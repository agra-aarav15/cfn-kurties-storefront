/**
 * Homepage — Full-bleed Hero, Brand Quote Statement, Staggered Collection Grid, and Product Showcase.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ProductRail } from "@/components/home/ProductRail";
import { getFeaturedProducts } from "@/services/products";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.description,
  alternates: { canonical: siteConfig.url },
};

export default async function HomePage() {
  const featured = await getFeaturedProducts(6);

  return (
    <main className="w-full overflow-hidden bg-brand-off-white">
      {/* 1. Full-bleed Hero */}
      <Hero />

      {/* 2. Featured Visual Layout — 1 Large + 2 Staggered Grid */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-white">
        <Container>
          <div className="max-w-[1500px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Column — 1 Large Tall Visual Frame */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-brand-border bg-brand-off-white group cursor-pointer shadow-stitch-diffused">
                <Image
                  src="/images/kurti-1.jpg?v=custom_v1"
                  alt={featured[0]?.name || "Designer Kurti Collection"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-500" />
              </div>

              {/* Right Column — 2 Side-by-Side Staggered Visual Frames */}
              <div className="grid grid-cols-2 gap-6 sm:gap-8">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-brand-border bg-brand-off-white group cursor-pointer shadow-stitch-diffused">
                  <Image
                    src="/images/kurti-2.jpg?v=custom_v1"
                    alt={featured[1]?.name || "Embroidered Kurti"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-500" />
                </div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-brand-border bg-brand-off-white group cursor-pointer shadow-stitch-diffused mt-8 sm:mt-12">
                  <Image
                    src="/images/hero-banner.jpg?v=custom_v1"
                    alt={featured[2]?.name || "Festive Kurti"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-500" />
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <Link
                href="/shop"
                className="group relative inline-block px-12 py-4 border border-brand-black text-brand-black font-mono text-xs tracking-[0.25em] uppercase overflow-hidden transition-all duration-500 hover:text-white rounded-full"
              >
                <span className="absolute inset-0 bg-brand-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-full" />
                <span className="relative z-10 font-bold">View All Collections</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Product Showcase Rail */}
      <ProductRail
        eyebrow="Curated Selection"
        title="Featured Kurties"
        subtitle="Minimalist ethnic wear crafted with premium breathable fabrics."
        href="/shop"
        products={featured}
      />
    </main>
  );
}
