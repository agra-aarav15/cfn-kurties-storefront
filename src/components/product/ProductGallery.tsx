/**
 * Product image gallery — main image + thumbnails, keyboard friendly.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types";
import { cn } from "@/utils/cn";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];

  if (!images.length) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center bg-brand-cream text-brand-gray-400">
        No images available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-cream">
        {current && (
          <Image
            src={current.src}
            alt={current.alt || productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="listbox"
          aria-label="Product images"
        >
          {images.map((img, i) => (
            <button
              key={img.id || i}
              type="button"
              role="option"
              aria-selected={i === active}
              aria-label={`View image ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-16 flex-shrink-0 overflow-hidden border-2 transition-colors",
                i === active ? "border-brand-black" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.src}
                alt={img.alt || `${productName} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
