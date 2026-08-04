/**
 * POST /api/checkout — create guest order + Razorpay order.
 */

import { NextRequest, NextResponse } from "next/server";
import { createOrderSchema } from "@/utils/validation";
import { createOrder } from "@/services/orders";
import { createRazorpayOrder } from "@/services/razorpay";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`checkout:${ip}`, 10, 60_000);
  if (!limited.success) {
    return NextResponse.json(
      { success: false, error: { message: "Too many checkout attempts. Please wait." } },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid checkout data",
            details: parsed.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const order = await createOrder(parsed.data);
    const razorpayOrder = await createRazorpayOrder({
      amount: order.total,
      receipt: `cfn_${order.id}`,
      notes: {
        woo_order_id: String(order.id),
        order_number: order.orderNumber,
      },
    });

    return NextResponse.json({
      success: true,
      data: { order, razorpayOrder },
    });
  } catch (err) {
    console.error("[api/checkout]", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: err instanceof Error ? err.message : "Checkout failed",
        },
      },
      { status: 500 }
    );
  }
}
