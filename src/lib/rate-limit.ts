/**
 * Tiered, Configurable Rate Limiting Engine.
 *
 * Supports:
 *  - Strict Auth Routes: Dual per-IP & per-account rate limits with Exponential Backoff
 *  - Moderate Public Routes: Configurable per-IP rate limits
 *  - Looser Authenticated User Actions: Higher throughput limits for active users
 *  - Standard HTTP RFC headers (X-RateLimit-*, Retry-After)
 */

import { NextResponse } from "next/server";
import { rateLimitConfig } from "@/config/rate-limit";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number; // Unix timestamp in milliseconds
  retryAfterSeconds: number;
  reason?: "ip_limit" | "account_limit" | "rate_limit_exceeded";
}

interface BucketEntry {
  count: number;
  consecutiveViolations: number;
  resetAt: number;
}

// In-memory bucket store (Suitable for single-node deployment)
const buckets = new Map<string, BucketEntry>();

/** Periodic cleanup of expired rate limit buckets to prevent memory leaks */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of buckets.entries()) {
    if (now > entry.resetAt + 60_000) {
      buckets.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Core sliding/fixed window rate limiter with configurable parameters.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, consecutiveViolations: 0, resetAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetAt,
      retryAfterSeconds: 0,
    };
  }

  if (entry.count >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return {
      success: false,
      limit,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfterSeconds,
      reason: "rate_limit_exceeded",
    };
  }

  entry.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
    retryAfterSeconds: 0,
  };
}

/**
 * 1. Strict Rate Limiter for Authentication Routes (Login, Signup, Password Reset).
 * Uses a combination of per-IP and per-account limits with Exponential Backoff.
 *
 * Rather than a hard lockout, repeated failures increase the reset delay exponentially.
 */
export function checkAuthRateLimit(
  ip: string,
  accountIdentifier?: string
): RateLimitResult {
  const now = Date.now();
  const { maxAttempts, baseWindowMs, backoffFactor, maxBackoffMs } = rateLimitConfig.auth;

  // Helper to evaluate a single auth bucket with exponential backoff
  const evaluateAuthBucket = (bucketKey: string, isAccount: boolean): RateLimitResult => {
    let entry = buckets.get(bucketKey);

    if (!entry || now > entry.resetAt) {
      const consecutive = entry ? entry.consecutiveViolations : 0;
      const resetAt = now + baseWindowMs;
      entry = { count: 1, consecutiveViolations: consecutive, resetAt };
      buckets.set(bucketKey, entry);
      return {
        success: true,
        limit: maxAttempts,
        remaining: maxAttempts - 1,
        resetAt,
        retryAfterSeconds: 0,
      };
    }

    if (entry.count >= maxAttempts) {
      // Increment violations for exponential backoff calculation
      entry.consecutiveViolations += 1;

      // Exponential Backoff calculation: baseWindow * (backoffFactor ^ violations)
      const multiplier = Math.pow(backoffFactor, Math.min(10, entry.consecutiveViolations));
      const dynamicWindowMs = Math.min(maxBackoffMs, baseWindowMs * multiplier);

      entry.resetAt = Math.max(entry.resetAt, now + dynamicWindowMs);
      const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

      return {
        success: false,
        limit: maxAttempts,
        remaining: 0,
        resetAt: entry.resetAt,
        retryAfterSeconds,
        reason: isAccount ? "account_limit" : "ip_limit",
      };
    }

    entry.count += 1;
    return {
      success: true,
      limit: maxAttempts,
      remaining: maxAttempts - entry.count,
      resetAt: entry.resetAt,
      retryAfterSeconds: 0,
    };
  };

  // Evaluate IP-level rate limit
  const ipResult = evaluateAuthBucket(`auth:ip:${ip}`, false);
  if (!ipResult.success) return ipResult;

  // If an account (email/username) was provided, evaluate account-level rate limit
  if (accountIdentifier) {
    const cleanAccount = accountIdentifier.toLowerCase().trim();
    const accountResult = evaluateAuthBucket(`auth:account:${cleanAccount}`, true);
    if (!accountResult.success) return accountResult;

    // Return the lower remaining capacity
    return {
      ...accountResult,
      remaining: Math.min(ipResult.remaining, accountResult.remaining),
    };
  }

  return ipResult;
}

/**
 * 2. Moderate Rate Limiter for Public Endpoints (Search, Products, Categories).
 */
export function checkPublicRateLimit(
  ip: string,
  routeName = "public"
): RateLimitResult {
  const { limit, windowMs } = rateLimitConfig.public;
  return rateLimit(`pub:${routeName}:${ip}`, limit, windowMs);
}

/**
 * 3. Looser Rate Limiter for Authenticated User Actions (Checkout, Payment Verify, Order Tracking).
 */
export function checkAuthenticatedRateLimit(
  identifier: string,
  routeName = "user_action"
): RateLimitResult {
  const { limit, windowMs } = rateLimitConfig.authenticated;
  return rateLimit(`user:${routeName}:${identifier}`, limit, windowMs);
}

/**
 * Utility to extract Client IP address from request headers (supports reverse proxies like Nginx/Cloudflare).
 */
export function getClientIp(request: Request): string {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return request.headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Generates standard HTTP rate limit headers.
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };

  if (!result.success && result.retryAfterSeconds > 0) {
    headers["Retry-After"] = String(result.retryAfterSeconds);
  }

  return headers;
}

/**
 * Creates a standard HTTP 429 Too Many Requests response with compliant RFC headers.
 */
export function createRateLimitResponse(
  result: RateLimitResult,
  customMessage?: string
): NextResponse {
  const message =
    customMessage ||
    (result.reason === "account_limit"
      ? "Too many failed attempts for this account. Please wait before retrying."
      : result.reason === "ip_limit"
      ? "Too many requests from your IP address. Exponential backoff applied."
      : "Rate limit exceeded. Please try again later.");

  const headers = getRateLimitHeaders(result);

  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        retryAfterSeconds: result.retryAfterSeconds,
      },
    },
    {
      status: 429,
      headers,
    }
  );
}
