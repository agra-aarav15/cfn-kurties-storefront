/**
 * Social proof reviews section.
 */

import { Star } from "lucide-react";
import type { Review } from "@/types";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface ReviewsProps {
  reviews: Review[];
}

export function Reviews({ reviews }: ReviewsProps) {
  return (
    <section className="bg-brand-off-white py-20 md:py-28">
      <Container>
        <SectionHeader
          eyebrow="Loved by You"
          title="Customer Stories"
          subtitle="Real feedback from women who chose CFN for everyday elegance."
          align="center"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <blockquote
              key={r.id}
              className="flex flex-col border border-brand-border bg-white p-6 md:p-7"
            >
              <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < r.rating ? "fill-brand-gold text-brand-gold" : "text-brand-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-brand-gray-600">
                “{r.content}”
              </p>
              <footer className="mt-6 border-t border-brand-border pt-4">
                <cite className="not-italic text-sm font-medium text-brand-black">
                  {r.author}
                </cite>
                {r.verified && (
                  <p className="mt-0.5 text-[11px] uppercase tracking-wider text-brand-gray-400">
                    Verified buyer
                  </p>
                )}
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
