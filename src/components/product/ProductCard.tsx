/**
 * Product card — Google Stitch rounded surface, clean hierarchy.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/format";
import { cn } from "@/utils/cn";

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

export function ProductCard({ product, index = 0, priority = false }: ProductCardProps) {
  const image = product.images[0];
  const outOfStock = product.stockStatus === "outofstock";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-white p-3 shadow-stitch-diffused transition-all duration-300 hover:shadow-md hover:border-brand-gray-300"
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden rounded-xl bg-brand-off-white"
        aria-label={`View ${product.name}`}
      >
        <div className="relative aspect-[4/5] w-full">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                "object-cover transition-transform duration-700 ease-out group-hover:scale-105",
                outOfStock && "opacity-60"
              )}
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-brand-gray-100 text-sm text-brand-gray-400">
              No image
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.onSale && (
            <span className="rounded-full bg-brand-rose px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm font-mono">
              Sale
            </span>
          )}
          {outOfStock && (
            <span className="rounded-full bg-brand-gray-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm font-mono">
              Sold out
            </span>
          )}
        </div>
      </Link>

      <div className="mt-3 flex flex-col gap-1 px-1 pb-1">
        <Link href={`/product/${product.slug}`} className="group/title">
          <h3 className="font-heading text-base font-bold leading-snug text-brand-black transition-colors group-hover/title:text-brand-rose">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-brand-black font-heading">
              {formatPrice(product.price)}
            </span>
            {product.onSale && product.regularPrice > product.price && (
              <span className="text-xs text-brand-gray-400 line-through">
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </div>
          <span className="rounded-full bg-brand-off-white px-2 py-0.5 text-[11px] font-semibold text-brand-gray-700 border border-brand-border">
            ★ {product.averageRating}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
