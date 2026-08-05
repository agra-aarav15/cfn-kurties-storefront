/**
 * POST /api/track — look up order by ID + email/phone (no account).
 */

import { NextRequest, NextResponse } from "next/server";
import { trackOrderSchema } from "@/utils/validation";
import { trackOrder } from "@/services/orders";
import { checkAuthenticatedRateLimit, createRateLimitResponse, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = checkAuthenticatedRateLimit(ip, "track");
  if (!limited.success) {
    return createRateLimitResponse(limited, "Too many tracking attempts. Please wait.");
  }

  try {
    const body = await request.json();
    const parsed = trackOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: parsed.error.issues[0]?.message || "Invalid input",
          },
        },
        { status: 400 }
      );
    }

    const result = await trackOrder(parsed.data);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("[api/track]", err);
    return NextResponse.json(
      { success: false, error: { message: "Unable to track order" } },
      { status: 500 }
    );
  }
}
