/**
 * GET /api/products — list products with WooCommerce-compatible filters.
 */

import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/services/products";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import type { ProductFilters, ProductSize } from "@/types";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`products:${ip}`, 60, 60_000);
  if (!limited.success) {
    return NextResponse.json(
      { success: false, error: { message: "Too many requests" } },
      { status: 429 }
    );
  }

  const sp = request.nextUrl.searchParams;
  const price = sp.get("price");
  let minPrice: number | undefined;
  let maxPrice: number | undefined;
  if (price?.includes("-")) {
    const [min, max] = price.split("-").map(Number);
    minPrice = min;
    maxPrice = max;
  }
  if (sp.get("min_price")) minPrice = Number(sp.get("min_price"));
  if (sp.get("max_price")) maxPrice = Number(sp.get("max_price"));

  const size = sp.get("size");
  const fabric = sp.get("fabric");

  const filters: ProductFilters = {
    category: sp.get("category") || undefined,
    search: sp.get("search") || sp.get("q") || undefined,
    minPrice,
    maxPrice,
    sizes: size ? (size.split(",") as ProductSize[]) : undefined,
    fabric: fabric ? fabric.split(",") : undefined,
    availability: (sp.get("availability") as ProductFilters["availability"]) || undefined,
    featured: sp.get("featured") === "true",
    onSale: sp.get("on_sale") === "true",
    orderby: (sp.get("orderby") as ProductFilters["orderby"]) || "date",
    order: (sp.get("order") as ProductFilters["order"]) || "desc",
    page: Number(sp.get("page") || 1),
    perPage: Math.min(48, Number(sp.get("per_page") || 24)),
  };

  try {
    const result = await getProducts(filters);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("[api/products]", err);
    return NextResponse.json(
      { success: false, error: { message: "Failed to load products" } },
      { status: 500 }
    );
  }
}
