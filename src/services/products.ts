/**
 * Product service — WooCommerce REST with seamless placeholder fallback.
 * Client code should prefer Next.js API routes; this module is used server-side.
 */

import { wooConfig, getWooApiUrl } from "@/config/woocommerce";
import { mapWooProduct, mapWooCategory } from "@/lib/woocommerce-mapper";
import {
  placeholderProducts,
  placeholderCategories,
} from "@/constants/placeholders";
import type {
  Product,
  ProductCategory,
  ProductFilters,
  ProductListResult,
  ProductSize,
} from "@/types";

async function wooFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = new URL(getWooApiUrl(path));
  // Basic auth via query is common for server-side WC; prefer Authorization header
  const credentials = Buffer.from(
    `${wooConfig.consumerKey}:${wooConfig.consumerSecret}`
  ).toString("base64");

  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(wooConfig.timeout),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WooCommerce API ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json() as Promise<T>;
}

function filterPlaceholders(filters: ProductFilters = {}): ProductListResult {
  let list = [...placeholderProducts];

  if (filters.category) {
    list = list.filter((p) => p.categories.some((c) => c.slug === filters.category));
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }
  if (filters.minPrice != null) {
    list = list.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    list = list.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.sizes?.length) {
    list = list.filter((p) => filters.sizes!.some((s) => p.sizes.includes(s as ProductSize)));
  }
  if (filters.fabric?.length) {
    list = list.filter((p) =>
      filters.fabric!.some((f) => p.fabric.toLowerCase() === f.toLowerCase())
    );
  }
  if (filters.availability === "instock") {
    list = list.filter((p) => p.stockStatus === "instock");
  } else if (filters.availability === "outofstock") {
    list = list.filter((p) => p.stockStatus === "outofstock");
  }
  if (filters.featured) {
    list = list.filter((p) => p.featured);
  }
  if (filters.onSale) {
    list = list.filter((p) => p.onSale);
  }

  const orderby = filters.orderby || "date";
  const order = filters.order || "desc";
  list.sort((a, b) => {
    let cmp = 0;
    switch (orderby) {
      case "price":
        cmp = a.price - b.price;
        break;
      case "title":
        cmp = a.name.localeCompare(b.name);
        break;
      case "rating":
        cmp = a.averageRating - b.averageRating;
        break;
      case "popularity":
        cmp = a.reviewCount - b.reviewCount;
        break;
      default:
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return order === "asc" ? cmp : -cmp;
  });

  const page = filters.page || 1;
  const perPage = filters.perPage || wooConfig.perPage;
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const products = list.slice(start, start + perPage);

  return { products, total, totalPages, page, perPage };
}

/** List products with filters */
export async function getProducts(filters: ProductFilters = {}): Promise<ProductListResult> {
  if (wooConfig.usePlaceholders) {
    return filterPlaceholders(filters);
  }

  try {
    const params = new URLSearchParams();
    params.set("page", String(filters.page || 1));
    params.set("per_page", String(filters.perPage || wooConfig.perPage));
    params.set("status", "publish");

    if (filters.search) params.set("search", filters.search);
    if (filters.minPrice != null) params.set("min_price", String(filters.minPrice));
    if (filters.maxPrice != null) params.set("max_price", String(filters.maxPrice));
    if (filters.featured) params.set("featured", "true");
    if (filters.onSale) params.set("on_sale", "true");
    if (filters.orderby) params.set("orderby", filters.orderby === "title" ? "title" : filters.orderby);
    if (filters.order) params.set("order", filters.order);
    if (filters.availability === "instock") params.set("stock_status", "instock");
    if (filters.category) {
      // Resolve category by slug first
      const cats = await getCategories();
      const cat = cats.find((c) => c.slug === filters.category);
      if (cat) params.set("category", String(cat.id));
    }

    // Attribute filters (size / fabric) via Woo attribute taxonomies when configured
    const raw = await wooFetch<unknown[]>(`products?${params.toString()}`);
    let products = (raw as Parameters<typeof mapWooProduct>[0][]).map(mapWooProduct);

    if (filters.sizes?.length) {
      products = products.filter((p) =>
        filters.sizes!.some((s) => p.sizes.includes(s as ProductSize))
      );
    }
    if (filters.fabric?.length) {
      products = products.filter((p) =>
        filters.fabric!.some((f) => p.fabric.toLowerCase() === f.toLowerCase())
      );
    }

    const page = filters.page || 1;
    const perPage = filters.perPage || wooConfig.perPage;
    return {
      products,
      total: products.length,
      totalPages: Math.max(1, Math.ceil(products.length / perPage)),
      page,
      perPage,
    };
  } catch (err) {
    console.error("[products] WooCommerce fetch failed, using placeholders:", err);
    return filterPlaceholders(filters);
  }
}

/** Single product by slug */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (wooConfig.usePlaceholders) {
    return placeholderProducts.find((p) => p.slug === slug) || null;
  }

  try {
    const raw = await wooFetch<unknown[]>(`products?slug=${encodeURIComponent(slug)}`);
    if (!Array.isArray(raw) || raw.length === 0) return null;
    return mapWooProduct(raw[0]);
  } catch (err) {
    console.error("[products] getProductBySlug failed:", err);
    return placeholderProducts.find((p) => p.slug === slug) || null;
  }
}

/** Single product by ID */
export async function getProductById(id: number): Promise<Product | null> {
  if (wooConfig.usePlaceholders) {
    return placeholderProducts.find((p) => p.id === id) || null;
  }
  try {
    const raw = await wooFetch<unknown>(`products/${id}`);
    return mapWooProduct(raw);
  } catch {
    return placeholderProducts.find((p) => p.id === id) || null;
  }
}

/** Categories */
export async function getCategories(): Promise<ProductCategory[]> {
  if (wooConfig.usePlaceholders) {
    return placeholderCategories;
  }
  try {
    const raw = await wooFetch<unknown[]>("products/categories?per_page=100&hide_empty=true");
    return (raw as Parameters<typeof mapWooCategory>[0][]).map(mapWooCategory);
  } catch (err) {
    console.error("[products] getCategories failed:", err);
    return placeholderCategories;
  }
}

export async function getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug) || null;
}

/** Instant search (limited results) */
export async function searchProducts(query: string, limit = 8): Promise<Product[]> {
  if (!query.trim()) return [];
  const result = await getProducts({ search: query.trim(), perPage: limit, page: 1 });
  return result.products;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const result = await getProducts({ featured: true, perPage: limit });
  return result.products;
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const result = await getProducts({ orderby: "date", order: "desc", perPage: limit });
  return result.products;
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  // Prefer category slug; fall back to popularity sort
  const byCat = await getProducts({ category: "best-sellers", perPage: limit });
  if (byCat.products.length) return byCat.products;
  const result = await getProducts({ orderby: "popularity", order: "desc", perPage: limit });
  return result.products;
}
