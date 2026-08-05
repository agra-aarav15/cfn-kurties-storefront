/**
 * Centralized, Environment-Configurable Rate Limit Thresholds & Settings.
 *
 * Supports 3 distinct tiers:
 *  1. Auth Routes (Strictest — per-IP + per-account limits, exponential backoff)
 *  2. Public Endpoints (Moderate — search, products, categories)
 *  3. Authenticated / Action User Endpoints (Looser — cart, checkout, payment verify)
 */

export const rateLimitConfig = {
  // 1. Strict Auth Routes (login, signup, password reset, verification)
  auth: {
    maxAttempts: Number(process.env.RATE_LIMIT_AUTH_MAX_ATTEMPTS) || 5,
    baseWindowMs: Number(process.env.RATE_LIMIT_AUTH_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    backoffFactor: Number(process.env.RATE_LIMIT_AUTH_BACKOFF_FACTOR) || 2.0, // Exponential multiplier
    maxBackoffMs: Number(process.env.RATE_LIMIT_AUTH_MAX_BACKOFF_MS) || 24 * 60 * 60 * 1000, // 24 hours cap
  },

  // 2. Moderate Public Endpoints (product listing, search, category browsing)
  public: {
    limit: Number(process.env.RATE_LIMIT_PUBLIC_LIMIT) || 60,
    windowMs: Number(process.env.RATE_LIMIT_PUBLIC_WINDOW_MS) || 60 * 1000, // 1 minute
  },

  // 3. Looser Authenticated / User Action Endpoints (checkout, payment verification, order tracking)
  authenticated: {
    limit: Number(process.env.RATE_LIMIT_USER_LIMIT) || 120,
    windowMs: Number(process.env.RATE_LIMIT_USER_WINDOW_MS) || 60 * 1000, // 1 minute
  },
} as const;

export type RateLimitConfig = typeof rateLimitConfig;
