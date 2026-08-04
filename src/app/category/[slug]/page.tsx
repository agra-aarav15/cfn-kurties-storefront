/**
 * Category listing page — WooCommerce-compatible slug routing.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getCategoryBySlug, getProducts } from "@/services/products";
import { siteConfig } from "@/config/site";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const title = category?.name || slug.replace(/-/g, " ");
  const description =
    category?.description || `Browse ${title} at CFN Kurties — modern ethnic fashion.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.url}/category/${slug}` },
    openGraph: {
      title: `${title} | CFN Kurties`,
      description,
      url: `${siteConfig.url}/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const result = await getProducts({ category: slug, perPage: 24, orderby: "date", order: "desc" });

  if (!category && result.products.length === 0) {
    notFound();
  }

  const title =
    category?.name ||
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div className="bg-white pt-24 pb-20 md:pt-28 md:pb-28">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Shop", href: "/shop" },
          { name: title, href: `/category/${slug}` },
        ]}
      />

      <Container>
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-brand-gray-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-brand-black">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/shop" className="hover:text-brand-black">
                Shop
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-brand-black" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>

        <div className="mb-10 md:mb-14">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
            Collection
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h1>
          {category?.description && (
            <p className="mt-3 max-w-xl text-sm text-brand-gray-500">{category.description}</p>
          )}
          <p className="mt-2 text-sm text-brand-gray-400">
            {result.total} {result.total === 1 ? "piece" : "pieces"}
          </p>
        </div>

        <ProductGrid
          products={result.products}
          emptyTitle={`No products in ${title}`}
          emptyDescription="Check back soon or browse the full collection."
        />
      </Container>
    </div>
  );
}
