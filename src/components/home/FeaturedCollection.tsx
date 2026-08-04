/**
 * Featured collection — large editorial feature + product strip.
 */

import Image from "next/image";
import type { Product } from "@/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";

interface FeaturedCollectionProps {
  products: Product[];
}

export function FeaturedCollection({ products }: FeaturedCollectionProps) {
  const feature = products[0];
  const rest = products.slice(1, 3);

  if (!feature) return null;

  return (
    <section className="bg-brand-cream py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden bg-brand-gray-100">
            {feature.images[0] && (
              <Image
                src={feature.images[0].src}
                alt={feature.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
              Featured Collection
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-brand-black md:text-4xl lg:text-5xl">
              Elevated essentials for modern days
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-brand-gray-500 md:text-base">
              Quiet luxury in ethnic form — breathable fabrics, refined cuts, and colours that
              move from home to occasion with ease.
            </p>
            <div className="mt-8">
              <Button href="/shop" variant="primary" size="lg">
                Shop the edit
              </Button>
            </div>
            {rest.length > 0 && (
              <div className="mt-12 grid grid-cols-2 gap-4">
                {rest.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
