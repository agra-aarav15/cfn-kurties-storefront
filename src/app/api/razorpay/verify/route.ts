/**
 * POST /api/razorpay/verify — verify payment signature and mark order paid.
 */

import { NextRequest, NextResponse } from "next/server";
import { razorpayVerifySchema } from "@/utils/validation";
import { verifyRazorpayPayment } from "@/services/razorpay";
import { markOrderPaid } from "@/services/orders";
import { checkAuthenticatedRateLimit, createRateLimitResponse, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = checkAuthenticatedRateLimit(ip, "rzp_verify");
  if (!limited.success) {
    return createRateLimitResponse(limited);
  }

  try {
    const body = await request.json();
    const parsed = razorpayVerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: "Invalid payment payload" } },
        { status: 400 }
      );
    }

    const valid = verifyRazorpayPayment(parsed.data);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: { message: "Payment verification failed" } },
        { status: 400 }
      );
    }

    const order = await markOrderPaid(
      parsed.data.wooOrderId,
      parsed.data.razorpay_payment_id
    );

    return NextResponse.json({
      success: true,
      data: {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total,
        },
      },
    });
  } catch (err) {
    console.error("[api/razorpay/verify]", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: err instanceof Error ? err.message : "Verification failed",
        },
      },
      { status: 500 }
    );
  }
}
