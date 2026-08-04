/**
 * GET /api/orders?id= — internal order fetch by id (limited use).
 * Prefer /api/track for customer-facing lookups.
 */

import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/services/orders";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`orders:${ip}`, 20, 60_000);
  if (!limited.success) {
    return NextResponse.json(
      { success: false, error: { message: "Too many requests" } },
      { status: 429 }
    );
  }

  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!id || Number.isNaN(id)) {
    return NextResponse.json(
      { success: false, error: { message: "Order id required" } },
      { status: 400 }
    );
  }

  try {
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: { message: "Order not found" } },
        { status: 404 }
      );
    }

    // Do not expose full PII in open GET — return summary only
    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        dateCreated: order.dateCreated,
        estimatedDelivery: order.estimatedDelivery,
      },
    });
  } catch (err) {
    console.error("[api/orders]", err);
    return NextResponse.json(
      { success: false, error: { message: "Failed to load order" } },
      { status: 500 }
    );
  }
}
