/**
 * Simple in-memory rate limiter for API routes.
 * Suitable for single-node PM2; use Redis in multi-instance production if needed.
 */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

export function rateLimit(
  key: string,
  limit = 20,
  windowMs = 60_000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count };
}

/** Best-effort client IP from request headers (behind Nginx) */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
