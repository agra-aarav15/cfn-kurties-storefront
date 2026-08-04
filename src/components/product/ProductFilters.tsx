/**
 * Shop filters — price, category, size, fabric, availability.
 * Compatible with WooCommerce query params via URL search params.
 */

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { ProductCategory } from "@/types";
import { sizes, fabrics } from "@/constants/brand";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface ProductFiltersProps {
  categories: ProductCategory[];
  className?: string;
  onClose?: () => void;
}

export function ProductFilters({ categories, className, onClose }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const toggleMulti = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(key)?.split(",").filter(Boolean) || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (next.length) params.set(key, next.join(","));
      else params.delete(key);
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
    onClose?.();
  };

  const selectedSizes = searchParams.get("size")?.split(",") || [];
  const selectedFabrics = searchParams.get("fabric")?.split(",") || [];
  const hasFilters = searchParams.toString().length > 0;

  return (
    <aside
      className={cn("space-y-8", isPending && "opacity-70", className)}
      aria-label="Product filters"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold">Filters</h2>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-brand-gray-500 hover:text-brand-black"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <FilterGroup title="Category">
        <button
          type="button"
          onClick={() => update("category", null)}
          className={filterChip(!searchParams.get("category"))}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => update("category", cat.slug)}
            className={filterChip(searchParams.get("category") === cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </FilterGroup>

      {/* Price */}
      <FilterGroup title="Price">
        {[
          { label: "Under ₹1,000", value: "0-999" },
          { label: "₹1,000 – ₹1,500", value: "1000-1500" },
          { label: "₹1,500 – ₹2,000", value: "1500-2000" },
          { label: "Above ₹2,000", value: "2000-99999" },
        ].map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() =>
              update("price", searchParams.get("price") === p.value ? null : p.value)
            }
            className={filterChip(searchParams.get("price") === p.value)}
          >
            {p.label}
          </button>
        ))}
      </FilterGroup>

      {/* Size */}
      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {sizes.numeric.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleMulti("size", s)}
              className={cn(
                "flex h-9 min-w-9 items-center justify-center border text-xs transition-colors",
                selectedSizes.includes(s)
                  ? "border-brand-black bg-brand-black text-white"
                  : "border-brand-border hover:border-brand-black"
              )}
              aria-pressed={selectedSizes.includes(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Availability */}
      <FilterGroup title="Availability">
        {[
          { label: "In stock", value: "instock" },
          { label: "Out of stock", value: "outofstock" },
        ].map((a) => (
          <button
            key={a.value}
            type="button"
            onClick={() =>
              update(
                "availability",
                searchParams.get("availability") === a.value ? null : a.value
              )
            }
            className={filterChip(searchParams.get("availability") === a.value)}
          >
            {a.label}
          </button>
        ))}
      </FilterGroup>

      {onClose && (
        <Button fullWidth variant="primary" onClick={onClose}>
          Show results
        </Button>
      )}
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-brand-gray-500">
        {title}
      </h3>
      <div className="flex flex-col items-start gap-2">{children}</div>
    </div>
  );
}

function filterChip(active: boolean) {
  return cn(
    "text-sm transition-colors",
    active ? "font-medium text-brand-black" : "text-brand-gray-500 hover:text-brand-black"
  );
}
