/**
 * Add to cart controls — size required, quantity, stock messaging.
 */

"use client";

import { useState } from "react";
import type { Product, ProductSize } from "@/types";
import { useCart } from "@/hooks/useCart";
import { SizeSelector } from "./SizeSelector";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/utils/format";
import { Minus, Plus } from "lucide-react";

interface AddToCartProps {
  product: Product;
}

export function AddToCart({ product }: AddToCartProps) {
  const [size, setSize] = useState<ProductSize | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCart((s) => s.addItem);
  const outOfStock = product.stockStatus === "outofstock";

  const handleAdd = () => {
    if (outOfStock) return;
    if (!size) {
      setError("Please select a size");
      return;
    }
    setError(null);
    addItem(product, size, qty);
  };

  return (
    <div className="space-y-6">
      <SizeSelector
        available={product.sizes}
        sizeStock={product.sizeStock}
        value={size}
        onChange={(s) => {
          setSize(s);
          setError(null);
        }}
        disabled={outOfStock}
      />
      {error && (
        <p className="text-sm text-brand-error" role="alert">
          {error}
        </p>
      )}

      {/* Quantity */}
      {!outOfStock && (
        <div>
          <span className="mb-3 block text-sm font-medium text-brand-black">Quantity</span>
          <div className="inline-flex items-center border border-brand-border">
            <button
              type="button"
              aria-label="Decrease quantity"
              className="flex h-11 w-11 items-center justify-center text-brand-black transition-colors hover:bg-brand-gray-50"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-12 text-center text-sm font-medium" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="flex h-11 w-11 items-center justify-center text-brand-black transition-colors hover:bg-brand-gray-50"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Button
        fullWidth
        size="lg"
        onClick={handleAdd}
        disabled={outOfStock}
        variant={outOfStock ? "secondary" : "primary"}
      >
        {outOfStock ? "Out of Stock" : `Add to Bag — ${formatPrice(product.price * qty)}`}
      </Button>
    </div>
  );
}
