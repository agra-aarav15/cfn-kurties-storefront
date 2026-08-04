/**
 * POST /api/track — look up order by ID + email/phone (no account).
 */

import { NextRequest, NextResponse } from "next/server";
import { trackOrderSchema } from "@/utils/validation";
import { trackOrder } from "@/services/orders";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`track:${ip}`, 15, 60_000);
  if (!limited.success) {
    return NextResponse.json(
      { success: false, error: { message: "Too many attempts. Please wait a minute." } },
      { status: 429 }
    );
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
