/**
 * POST /api/newsletter — subscribe email (stores / forwards when configured).
 */

import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/utils/validation";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

/** Simple in-memory set for placeholder mode */
const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`newsletter:${ip}`, 5, 60_000);
  if (!limited.success) {
    return NextResponse.json(
      { success: false, error: { message: "Too many requests" } },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { message: parsed.error.issues[0]?.message || "Invalid email" },
        },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase().trim();
    subscribers.add(email);

    // Optional: forward to WooCommerce / ESP via env webhook
    const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "cfn-kurties-site" }),
      }).catch((err) => console.error("[newsletter webhook]", err));
    }

    return NextResponse.json({
      success: true,
      data: { message: "Subscribed" },
    });
  } catch (err) {
    console.error("[api/newsletter]", err);
    return NextResponse.json(
      { success: false, error: { message: "Subscription failed" } },
      { status: 500 }
    );
  }
}
