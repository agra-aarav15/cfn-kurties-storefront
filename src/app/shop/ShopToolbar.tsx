/**
 * Mobile filter trigger + sort control for shop listing.
 */

"use client";

import { useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductFilters } from "@/components/product/ProductFilters";
import type { ProductCategory } from "@/types";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface ShopToolbarProps {
  categories: ProductCategory[];
  total: number;
}

function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("orderby") || "date";

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const [orderby, order] = value.split(":");
    params.set("orderby", orderby);
    params.set("order", order || "desc");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const value =
    current === "price" && searchParams.get("order") === "asc"
      ? "price:asc"
      : current === "price"
        ? "price:desc"
        : current === "title"
          ? "title:asc"
          : "date:desc";

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-brand-gray-400">Sort</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-brand-border bg-white px-2 py-1.5 text-sm outline-none focus:border-brand-black"
      >
        <option value="date:desc">Newest</option>
        <option value="price:asc">Price: Low to High</option>
        <option value="price:desc">Price: High to Low</option>
        <option value="title:asc">Name A–Z</option>
        <option value="popularity:desc">Popularity</option>
      </select>
    </label>
  );
}

export function ShopToolbar({ categories, total }: ShopToolbarProps) {
  const [open, setOpen] = useState(false);
  useLockBodyScroll(open);

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 border border-brand-border px-3 py-2 text-sm lg:hidden"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
        <p className="hidden text-sm text-brand-gray-400 sm:block lg:hidden">
          {total} items
        </p>
        <Suspense fallback={null}>
          <SortSelect />
        </Suspense>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-full max-w-sm overflow-y-auto bg-white p-6 shadow-xl">
            <div className="mb-4 flex justify-end">
              <button type="button" onClick={() => setOpen(false)} aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Suspense fallback={null}>
              <ProductFilters categories={categories} onClose={() => setOpen(false)} />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
}
