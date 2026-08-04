/**
 * Homepage category tiles — Google Stitch Asymmetric Bento Grid.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ProductCategory } from "@/types";
import { Container } from "@/components/ui/Container";

interface CategoriesProps {
  categories: ProductCategory[];
}

export function Categories({ categories }: CategoriesProps) {
  const list = categories.slice(0, 5);

  return (
    <section className="bg-white py-20 md:py-28" aria-labelledby="categories-heading">
      <Container>
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-rose font-mono">
              Curated Edit
            </span>
            <h2 id="categories-heading" className="font-heading text-3xl font-extrabold tracking-[-0.025em] text-brand-black sm:text-4xl md:text-5xl mt-2">
              Shop by Category
            </h2>
          </div>
          <p className="text-sm text-brand-gray-500 max-w-md">
            Explore handcrafted silhouettes tailored for contemporary ease, daily wear, and festive moments.
          </p>
        </div>

        {/* Asymmetric Stitch Bento Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {list.map((cat, i) => {
            const isFeatured = i === 0;
            const spanClass = isFeatured
              ? "lg:col-span-8 aspect-[16/9] sm:aspect-auto sm:min-h-[420px]"
              : i === 1
              ? "lg:col-span-4 aspect-[4/5] sm:min-h-[420px]"
              : "lg:col-span-4 aspect-[4/5]";

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={spanClass}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className="group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-[2rem] border border-brand-border bg-brand-off-white shadow-stitch-diffused transition-all duration-300 hover:shadow-lg"
                >
                  {cat.image && (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/20 to-transparent" />
                  <div className="relative z-10 p-6 md:p-8">
                    <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md mb-2">
                      {cat.count ? `${cat.count} Designs` : "In Stock"}
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-white md:text-3xl">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="mt-1 text-xs text-white/80 line-clamp-2 max-w-md">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
