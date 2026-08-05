/**
 * Curated placeholder catalog used until WooCommerce is connected.
 * Shapes match normalized Product / Category types so the UI is production-ready.
 */

import type { Product, ProductCategory, Review } from "@/types";
import { siteConfig } from "@/config/site";

const delivery = siteConfig.policies.estimatedDelivery;

/** Soft editorial placeholders — local inline SVG data URIs for 100% reliability */
const img = (id: string, label: string) =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="100%" height="100%" fill="%2327272a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" fill="%23c4a35a" font-weight="600">${encodeURIComponent(label)}</text></svg>`;

const imgSq = (id: string, label: string) =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="100%" height="100%" fill="%23f4f4f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%2318181b" font-weight="600">${encodeURIComponent(label)}</text></svg>`;

export const placeholderCategories: ProductCategory[] = [
  {
    id: 1,
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Fresh silhouettes for the season",
    image: imgSq("cat1", "New Arrivals"),
    count: 8,
  },
  {
    id: 2,
    name: "Best Sellers",
    slug: "best-sellers",
    description: "Most loved by our community",
    image: imgSq("cat2", "Best Sellers"),
    count: 6,
  },
  {
    id: 3,
    name: "Everyday Essentials",
    slug: "everyday-essentials",
    description: "Effortless kurties for daily wear",
    image: imgSq("cat3", "Everyday"),
    count: 10,
  },
  {
    id: 4,
    name: "Festive",
    slug: "festive",
    description: "Celebrate in refined ethnic style",
    image: imgSq("cat4", "Festive"),
    count: 5,
  },
  {
    id: 5,
    name: "Workwear",
    slug: "workwear",
    description: "Polished looks for modern days",
    image: imgSq("cat5", "Workwear"),
    count: 7,
  },
  {
    id: 6,
    name: "Cotton Collection",
    slug: "cotton-collection",
    description: "Breathable comfort, elevated cuts",
    image: imgSq("cat6", "Cotton"),
    count: 9,
  },
];

function baseProduct(
  partial: Partial<Product> & Pick<Product, "id" | "name" | "slug" | "price" | "fabric">
): Product {
  const price = partial.price;
  return {
    shortDescription: partial.shortDescription || "Premium ethnic wear by CFN Kurties.",
    description:
      partial.description ||
      `<p>Crafted for the modern Indian woman, this ${partial.name} balances comfort and elegance. Soft fabric drape, thoughtful finishing, and a silhouette made for everyday confidence.</p><p>Pair with trousers, palazzos, or jeans for an elevated ethnic look.</p>`,
    regularPrice: partial.regularPrice ?? price,
    salePrice: partial.salePrice ?? null,
    onSale: partial.onSale ?? false,
    sku: partial.sku || `CFN-${partial.id}`,
    stockStatus: partial.stockStatus || "instock",
    stockQuantity: partial.stockQuantity ?? 25,
    images: partial.images || [
      {
        id: partial.id * 10,
        src: img(`p${partial.id}`, partial.name),
        alt: partial.name,
      },
      {
        id: partial.id * 10 + 1,
        src: img(`p${partial.id}b`, `${partial.name} Detail`),
        alt: `${partial.name} detail`,
      },
    ],
    categories: partial.categories || [placeholderCategories[0]],
    attributes: partial.attributes || [
      {
        id: 1,
        name: "Size",
        slug: "pa_size",
        options: ["32", "34", "36", "38", "40", "42"],
        variation: true,
      },
      {
        id: 2,
        name: "Fabric",
        slug: "pa_fabric",
        options: [partial.fabric],
        visible: true,
      },
    ],
    sizes: partial.sizes || ["32", "34", "36", "38", "40", "42"],
    tags: partial.tags || ["kurti", "ethnic"],
    featured: partial.featured ?? false,
    averageRating: partial.averageRating ?? 4.6,
    reviewCount: partial.reviewCount ?? 12,
    estimatedDelivery: delivery,
    codAvailable: false,
    returnsAllowed: false,
    damagedSupport: true,
    createdAt: partial.createdAt || "2026-06-01T10:00:00Z",
    updatedAt: partial.updatedAt || "2026-07-01T10:00:00Z",
    ...partial,
    price,
  };
}

export const placeholderProducts: Product[] = [
  baseProduct({
    id: 101,
    name: "Noir A-Line Cotton Kurti",
    slug: "noir-a-line-cotton-kurti",
    price: 1299,
    regularPrice: 1599,
    salePrice: 1299,
    onSale: true,
    fabric: "Cotton",
    featured: true,
    categories: [placeholderCategories[0], placeholderCategories[1]],
    tags: ["new", "bestseller", "cotton"],
    averageRating: 4.8,
    reviewCount: 34,
  }),
  baseProduct({
    id: 102,
    name: "Ivory Linen Straight Kurti",
    slug: "ivory-linen-straight-kurti",
    price: 1499,
    fabric: "Linen",
    featured: true,
    categories: [placeholderCategories[0], placeholderCategories[2]],
    tags: ["new", "linen"],
  }),
  baseProduct({
    id: 103,
    name: "Saffron Festive Embroidered Kurti",
    slug: "saffron-festive-embroidered-kurti",
    price: 2199,
    regularPrice: 2499,
    salePrice: 2199,
    onSale: true,
    fabric: "Georgette",
    featured: true,
    categories: [placeholderCategories[3], placeholderCategories[1]],
    tags: ["festive", "bestseller"],
    averageRating: 4.9,
    reviewCount: 48,
  }),
  baseProduct({
    id: 104,
    name: "Sage Everyday Relaxed Kurti",
    slug: "sage-everyday-relaxed-kurti",
    price: 999,
    fabric: "Cotton Blend",
    categories: [placeholderCategories[2], placeholderCategories[5]],
    tags: ["everyday", "cotton"],
  }),
  baseProduct({
    id: 105,
    name: "Charcoal Workwear Collar Kurti",
    slug: "charcoal-workwear-collar-kurti",
    price: 1699,
    fabric: "Cotton",
    featured: true,
    categories: [placeholderCategories[4], placeholderCategories[1]],
    tags: ["workwear", "bestseller"],
  }),
  baseProduct({
    id: 106,
    name: "Blush Soft Rayon Flared Kurti",
    slug: "blush-soft-rayon-flared-kurti",
    price: 1399,
    fabric: "Rayon",
    categories: [placeholderCategories[0], placeholderCategories[2]],
    tags: ["new", "rayon"],
  }),
  baseProduct({
    id: 107,
    name: "Indigo Block Print Cotton Kurti",
    slug: "indigo-block-print-cotton-kurti",
    price: 1199,
    fabric: "Cotton",
    categories: [placeholderCategories[5], placeholderCategories[1]],
    tags: ["cotton", "bestseller", "print"],
    averageRating: 4.7,
    reviewCount: 29,
  }),
  baseProduct({
    id: 108,
    name: "Pearl White Chiffon Overlay Kurti",
    slug: "pearl-white-chiffon-overlay-kurti",
    price: 1899,
    fabric: "Chiffon",
    categories: [placeholderCategories[3]],
    tags: ["festive", "chiffon"],
  }),
  baseProduct({
    id: 109,
    name: "Olive Khadi Mandarin Kurti",
    slug: "olive-khadi-mandarin-kurti",
    price: 1599,
    fabric: "Khadi",
    categories: [placeholderCategories[4], placeholderCategories[2]],
    tags: ["workwear", "khadi"],
  }),
  baseProduct({
    id: 110,
    name: "Rose Gold Silk Blend Kurti",
    slug: "rose-gold-silk-blend-kurti",
    price: 2499,
    fabric: "Silk Blend",
    featured: true,
    categories: [placeholderCategories[3], placeholderCategories[0]],
    tags: ["festive", "new", "premium"],
    averageRating: 5,
    reviewCount: 16,
  }),
  baseProduct({
    id: 111,
    name: "Mist Grey Everyday Tunic",
    slug: "mist-grey-everyday-tunic",
    price: 1099,
    fabric: "Cotton Blend",
    stockStatus: "outofstock",
    stockQuantity: 0,
    categories: [placeholderCategories[2]],
    tags: ["everyday"],
  }),
  baseProduct({
    id: 112,
    name: "Terracotta Linen Long Kurti",
    slug: "terracotta-linen-long-kurti",
    price: 1799,
    fabric: "Linen",
    categories: [placeholderCategories[0], placeholderCategories[5]],
    tags: ["new", "linen"],
  }),
];

export const placeholderReviews: Review[] = [
  {
    id: 1,
    author: "Ananya S.",
    rating: 5,
    content:
      "The fabric quality surprised me for the price. Fit is true to size and the finish feels premium. Already ordered a second colour.",
    date: "2026-06-12",
    verified: true,
    productName: "Noir A-Line Cotton Kurti",
  },
  {
    id: 2,
    author: "Meera K.",
    rating: 5,
    content:
      "Finally a brand that keeps ethnic wear simple and modern. Packaging was neat and delivery was on time.",
    date: "2026-06-20",
    verified: true,
    productName: "Ivory Linen Straight Kurti",
  },
  {
    id: 3,
    author: "Priya R.",
    rating: 4,
    content:
      "Beautiful festive piece. Soft on skin and looks expensive. Sizing chart was accurate — go with your usual size.",
    date: "2026-07-02",
    verified: true,
    productName: "Saffron Festive Embroidered Kurti",
  },
  {
    id: 4,
    author: "Divya M.",
    rating: 5,
    content:
      "Wore the charcoal kurti to work and got so many compliments. Clean design, no fuss — exactly what I wanted.",
    date: "2026-07-10",
    verified: true,
    productName: "Charcoal Workwear Collar Kurti",
  },
];

export const instagramPlaceholders = [
  { id: 1, src: imgSq("ig1", "Look 01"), alt: "CFN Kurties Instagram look 1", href: siteConfig.social.instagram },
  { id: 2, src: imgSq("ig2", "Look 02"), alt: "CFN Kurties Instagram look 2", href: siteConfig.social.instagram },
  { id: 3, src: imgSq("ig3", "Look 03"), alt: "CFN Kurties Instagram look 3", href: siteConfig.social.instagram },
  { id: 4, src: imgSq("ig4", "Look 04"), alt: "CFN Kurties Instagram look 4", href: siteConfig.social.instagram },
  { id: 5, src: imgSq("ig5", "Look 05"), alt: "CFN Kurties Instagram look 5", href: siteConfig.social.instagram },
  { id: 6, src: imgSq("ig6", "Look 06"), alt: "CFN Kurties Instagram look 6", href: siteConfig.social.instagram },
];

export const heroContent = {
  eyebrow: "Modern Ethnic Fashion",
  title: "Affordable Elegance,\nEveryday Grace",
  subtitle:
    "Premium kurties designed for the contemporary woman — refined fabrics, clean silhouettes, honest prices.",
  primaryCta: { label: "Explore Collection", href: "/shop" },
  secondaryCta: { label: "Discover Styles", href: "/category/new-arrivals" },
  image: {
    src: "/images/hero-banner.jpg",
    alt: "CFN Kurties hero — modern ethnic fashion",
  },
  /** Optional; enable via NEXT_PUBLIC_HERO_VIDEO_ENABLED=true and set videoSrc */
  videoSrc: process.env.NEXT_PUBLIC_HERO_VIDEO_SRC || "",
};
