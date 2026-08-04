/**
 * Horizontal-feeling product section used for New Arrivals / Best Sellers.
 */

import type { Product } from "@/types";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductRailProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href: string;
  products: Product[];
}

export function ProductRail({ eyebrow, title, subtitle, href, products }: ProductRailProps) {
  if (!products.length) return null;

  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          href={href}
          linkLabel="View all"
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
          {products.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} priority={i < 2} />
          ))}
        </div>
      </Container>
    </section>
  );
}
