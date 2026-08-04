/**
 * Dynamic sitemap — static routes + products + categories.
 */

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getProducts, getCategories } from "@/services/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/track-order`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/policies`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/shipping`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const [productsResult, categories] = await Promise.all([
      getProducts({ perPage: 100, page: 1 }),
      getCategories(),
    ]);

    const productRoutes: MetadataRoute.Sitemap = productsResult.products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${base}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
