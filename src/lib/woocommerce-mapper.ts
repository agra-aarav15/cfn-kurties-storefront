/**
 * Maps raw WooCommerce REST API responses to storefront Product types.
 */

import type { Product, ProductCategory, ProductImage, ProductSize, SizeStock, StockStatus } from "@/types";
import { parsePrice, stripHtml } from "@/utils/format";
import { siteConfig } from "@/config/site";

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapImages(images: any[] = []): ProductImage[] {
  return images.map((img) => ({
    id: img.id ?? 0,
    src: img.src || "",
    alt: img.alt || img.name || "Product image",
    name: img.name,
  }));
}

function mapCategories(categories: any[] = []): ProductCategory[] {
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));
}

function extractSizes(attributes: any[] = []): ProductSize[] {
  const sizeAttr = attributes.find(
    (a) =>
      a.slug === "pa_size" ||
      a.name?.toLowerCase() === "size" ||
      a.name?.toLowerCase() === "sizes"
  );
  if (!sizeAttr?.options?.length) {
    return ["32", "34", "36", "38", "40", "42"];
  }
  return sizeAttr.options
    .map((o: string) => String(o).replace(/\D/g, "") || o)
    .filter(Boolean) as ProductSize[];
}

function extractSizeStock(raw: any): SizeStock[] {
  const sizes = extractSizes(raw.attributes);
  const totalStock = raw.stock_quantity ?? null;
  const isOutOfStock = raw.stock_status === "outofstock";

  return sizes.map((s, idx) => {
    let sizeStock: number | null = totalStock;
    if (totalStock !== null && sizes.length > 1) {
      const perSize = Math.max(1, Math.floor(totalStock / sizes.length));
      sizeStock = idx === sizes.length - 1 ? totalStock - perSize * (sizes.length - 1) : perSize;
    }
    return {
      size: s,
      stockQuantity: isOutOfStock ? 0 : sizeStock,
      stockStatus: isOutOfStock || (sizeStock !== null && sizeStock <= 0) ? "outofstock" : "instock",
    };
  });
}

function extractFabric(attributes: any[] = [], tags: any[] = []): string {
  const fabricAttr = attributes.find(
    (a) => a.slug === "pa_fabric" || a.name?.toLowerCase() === "fabric"
  );
  if (fabricAttr?.options?.[0]) return String(fabricAttr.options[0]);
  const fabricTag = tags.find((t) =>
    ["cotton", "linen", "rayon", "georgette", "chiffon", "silk", "khadi"].some((f) =>
      t.name?.toLowerCase().includes(f)
    )
  );
  return fabricTag?.name || "Cotton";
}

export function mapWooProduct(raw: any): Product {
  const price = parsePrice(raw.price);
  const regularPrice = parsePrice(raw.regular_price) || price;
  const salePrice = raw.sale_price ? parsePrice(raw.sale_price) : null;

  return {
    id: raw.id,
    name: raw.name || "Untitled",
    slug: raw.slug || String(raw.id),
    description: raw.description || "",
    shortDescription: stripHtml(raw.short_description || raw.description || "").slice(0, 200),
    price,
    regularPrice,
    salePrice,
    onSale: Boolean(raw.on_sale),
    sku: raw.sku || `CFN-${raw.id}`,
    stockStatus: (raw.stock_status as StockStatus) || "instock",
    stockQuantity: raw.stock_quantity ?? null,
    images: mapImages(raw.images),
    categories: mapCategories(raw.categories),
    attributes: (raw.attributes || []).map((a: any) => ({
      id: a.id,
      name: a.name,
      slug: a.slug || a.name,
      options: a.options || [],
      visible: a.visible,
      variation: a.variation,
    })),
    sizes: extractSizes(raw.attributes),
    sizeStock: extractSizeStock(raw),
    fabric: extractFabric(raw.attributes, raw.tags),
    tags: (raw.tags || []).map((t: any) => t.name || t.slug),
    featured: Boolean(raw.featured),
    averageRating: parseFloat(raw.average_rating || "0") || 0,
    reviewCount: raw.rating_count || 0,
    estimatedDelivery: siteConfig.policies.estimatedDelivery,
    codAvailable: false,
    returnsAllowed: false,
    damagedSupport: true,
    createdAt: raw.date_created || raw.date_created_gmt || new Date().toISOString(),
    updatedAt: raw.date_modified || raw.date_modified_gmt || new Date().toISOString(),
  };
}

export function mapWooCategory(raw: any): ProductCategory {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: stripHtml(raw.description || ""),
    image: raw.image?.src || null,
    count: raw.count,
    parent: raw.parent,
  };
}
