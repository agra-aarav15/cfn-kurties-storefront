/**
 * Responsive product grid with empty state.
 */

import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface ProductGridProps {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting filters or browse the full collection.",
}: ProductGridProps) {
  if (!products.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="Shop all"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6 md:gap-y-12">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
