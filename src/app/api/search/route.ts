/**
 * GET /api/search?q= — instant product search.
 */

import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/services/products";
import { checkPublicRateLimit, createRateLimitResponse, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = checkPublicRateLimit(ip, "search");
  if (!limited.success) {
    return createRateLimitResponse(limited);
  }

  const q = request.nextUrl.searchParams.get("q") || "";
  if (q.trim().length < 2) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const products = await searchProducts(q, 8);
    return NextResponse.json({ success: true, data: products });
  } catch (err) {
    console.error("[api/search]", err);
    return NextResponse.json(
      { success: false, error: { message: "Search failed" } },
      { status: 500 }
    );
  }
}
