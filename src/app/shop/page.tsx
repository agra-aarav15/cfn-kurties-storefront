/**
 * Shop page — full catalog with filters, sort, and pagination-ready list.
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { ShopToolbar } from "./ShopToolbar";
import { getProducts, getCategories } from "@/services/products";
import type { ProductFilters as Filters, ProductSize } from "@/types";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Shop All Kurties",
  description:
    "Browse the full CFN Kurties collection — modern ethnic wear in premium fabrics at honest prices.",
  alternates: { canonical: `${siteConfig.url}/shop` },
};

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function parseFilters(sp: Record<string, string | string[] | undefined>): Filters {
  const get = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const price = get("price");
  let minPrice: number | undefined;
  let maxPrice: number | undefined;
  if (price?.includes("-")) {
    const [min, max] = price.split("-").map(Number);
    minPrice = min;
    maxPrice = max;
  }

  const size = get("size");
  const fabric = get("fabric");
  const availability = get("availability") as Filters["availability"];
  const orderby = (get("orderby") as Filters["orderby"]) || "date";
  const order = (get("order") as Filters["order"]) || "desc";
  const page = Number(get("page") || 1);

  return {
    category: get("category"),
    search: get("search"),
    minPrice,
    maxPrice,
    sizes: size ? (size.split(",") as ProductSize[]) : undefined,
    fabric: fabric ? fabric.split(",") : undefined,
    availability: availability || "all",
    orderby,
    order,
    page,
    perPage: 24,
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const [result, categories] = await Promise.all([
    getProducts(filters),
    getCategories(),
  ]);

  return (
    <div className="bg-white pt-24 pb-20 md:pt-28 md:pb-28">
      <Container>
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
            Collection
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-5xl">
            Shop All
          </h1>
          <p className="mt-3 text-sm text-brand-gray-500">
            {result.total} {result.total === 1 ? "piece" : "pieces"}
            {filters.search ? ` for “${filters.search}”` : ""}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-4">
          <div className="hidden lg:block lg:col-span-1">
            <Suspense fallback={null}>
              <ProductFilters categories={categories} />
            </Suspense>
          </div>

          <div className="lg:col-span-3">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ShopToolbar categories={categories} total={result.total} />
              <ProductGrid products={result.products} />
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}
