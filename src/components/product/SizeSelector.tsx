/**
 * Numeric size selector (32, 34, 36…). Accessible radio group pattern.
 */

"use client";

import type { ProductSize, SizeStock } from "@/types";
import { sizes as sizeMeta } from "@/constants/brand";
import { cn } from "@/utils/cn";

interface SizeSelectorProps {
  available: ProductSize[];
  sizeStock?: SizeStock[];
  value: ProductSize | null;
  onChange: (size: ProductSize) => void;
  disabled?: boolean;
}

export function SizeSelector({ available, sizeStock, value, onChange, disabled }: SizeSelectorProps) {
  const all = sizeMeta.numeric;
  const currentStock = sizeStock?.find((s) => s.size === value);

  return (
    <div role="radiogroup" aria-label="Select size">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-brand-black">
          Size{value ? `: ${value}` : ""}
        </span>
        {currentStock?.stockQuantity !== null && currentStock?.stockQuantity !== undefined ? (
          <span className="text-xs font-semibold text-brand-gold">
            {currentStock.stockQuantity > 0
              ? `Stock limit: ${currentStock.stockQuantity} left`
              : "Size sold out"}
          </span>
        ) : (
          <span className="text-xs text-brand-gray-400">Numeric sizing</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {all.map((size) => {
          const isAvailable = available.includes(size as ProductSize);
          const isSelected = value === size;
          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Size ${size}${!isAvailable ? " unavailable" : ""}`}
              disabled={disabled || !isAvailable}
              onClick={() => onChange(size as ProductSize)}
              className={cn(
                "flex h-11 min-w-11 items-center justify-center border px-3 text-sm transition-colors duration-200",
                isSelected &&
                  "border-brand-black bg-brand-black text-white",
                !isSelected &&
                  isAvailable &&
                  "border-brand-border bg-white text-brand-black hover:border-brand-black",
                !isAvailable &&
                  "cursor-not-allowed border-brand-gray-200 text-brand-gray-300 line-through"
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
