/**
 * GET /api/search?q= — instant product search.
 */

import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/services/products";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`search:${ip}`, 60, 60_000);
  if (!limited.success) {
    return NextResponse.json(
      { success: false, error: { message: "Too many requests" } },
      { status: 429 }
    );
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
