/**
 * POST /api/auth/login — Example Authentication Endpoint
 * Demonstrates Strict Rate Limiting (per-IP + per-account) with Exponential Backoff.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkAuthRateLimit, createRateLimitResponse, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email : undefined;

    // Apply strict auth rate limiter evaluating both IP and account email
    const authLimit = checkAuthRateLimit(ip, email);

    if (!authLimit.success) {
      return createRateLimitResponse(
        authLimit,
        `Too many authentication attempts. Exponential backoff active. Try again in ${authLimit.retryAfterSeconds} seconds.`
      );
    }

    // Auth processing logic placeholder / WooCommerce JWT auth
    if (!email || !body.password) {
      return NextResponse.json(
        { success: false, error: { message: "Email and password are required." } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: { email, role: "customer" },
    });
  } catch (err) {
    console.error("[api/auth/login]", err);
    return NextResponse.json(
      { success: false, error: { message: "Login processing failed" } },
      { status: 500 }
    );
  }
}
