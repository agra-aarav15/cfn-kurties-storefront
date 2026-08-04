/**
 * Product detail page — images, description, fabric, sizes, price, stock,
 * estimated delivery, No COD / No Returns / damaged support only.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductRail } from "@/components/home/ProductRail";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getProductBySlug, getProducts } from "@/services/products";
import { formatPrice, stripHtml } from "@/utils/format";
import { siteConfig } from "@/config/site";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const description = product.shortDescription || stripHtml(product.description).slice(0, 160);
  const image = product.images[0]?.src;

  return {
    title: product.name,
    description,
    alternates: { canonical: `${siteConfig.url}/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      url: `${siteConfig.url}/product/${product.slug}`,
      type: "website",
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const relatedResult = await getProducts({
    category: product.categories[0]?.slug,
    perPage: 5,
  });
  const relatedProducts = relatedResult.products.filter((p) => p.id !== product.id).slice(0, 4);
  const inStock = product.stockStatus === "instock";
  const descriptionHtml = product.description || product.shortDescription;

  return (
    <div className="bg-white pt-24 pb-20 md:pt-28 md:pb-28">
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Shop", href: "/shop" },
          { name: product.name, href: `/product/${product.slug}` },
        ]}
      />

      <Container>
        {/* Breadcrumb */}
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
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          <div className="lg:col-span-5">
            {product.categories[0] && (
              <Link
                href={`/category/${product.categories[0].slug}`}
                className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold hover:text-brand-gold-dark"
              >
                {product.categories[0].name}
              </Link>
            )}

            <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-brand-black sm:text-3xl md:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-baseline gap-3 border-b border-brand-border pb-5">
              <span className="font-heading text-2xl font-semibold">{formatPrice(product.price)}</span>
              {product.onSale && product.regularPrice > product.price && (
                <span className="text-sm text-brand-gray-400 line-through">
                  {formatPrice(product.regularPrice)}
                </span>
              )}
              <span
                className={`text-xs font-medium uppercase tracking-wider ${
                  inStock ? "text-brand-success" : "text-brand-error"
                }`}
              >
                {inStock
                  ? product.stockQuantity != null
                    ? `In stock (${product.stockQuantity})`
                    : "In stock"
                  : "Out of stock"}
              </span>
            </div>

            {product.shortDescription && (
              <p className="mt-5 text-sm leading-relaxed text-brand-gray-600">
                {product.shortDescription}
              </p>
            )}

            {/* Key facts — no wash care, no extra tabs */}
            <dl className="mt-6 grid grid-cols-1 gap-3 border border-brand-border bg-brand-off-white p-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wider text-brand-gray-400">Fabric</dt>
                <dd className="mt-1 font-medium text-brand-black">{product.fabric}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-brand-gray-400">
                  Estimated delivery
                </dt>
                <dd className="mt-1 font-medium text-brand-black">
                  {product.estimatedDelivery || siteConfig.policies.estimatedDelivery}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-brand-gray-400">Available sizes</dt>
                <dd className="mt-1 font-medium text-brand-black">{product.sizes.join(", ")}</dd>
              </div>
            </dl>

            <div className="mt-8">
              <AddToCart product={product} />
            </div>

            {/* Policies — explicit, conversion-honest */}
            <ul className="mt-8 space-y-2 border-t border-brand-border pt-6 text-xs text-brand-gray-500">
              <li>· Estimated delivery: {siteConfig.policies.estimatedDelivery}</li>
              <li>· No Cash on Delivery (COD)</li>
              <li>· No returns or exchanges</li>
              <li>· Damaged product support only (contact with photos + order ID)</li>
              <li>· Guest checkout — no account required</li>
            </ul>
          </div>
        </div>

        {/* Description */}
        {descriptionHtml && (
          <section className="mt-16 max-w-3xl border-t border-brand-border pt-12" aria-labelledby="desc-heading">
            <h2 id="desc-heading" className="font-heading text-xl font-semibold tracking-tight">
              Description
            </h2>
            <div
              className="prose-product mt-4"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </section>
        )}

        {relatedProducts.length > 0 && (
          <div className="mt-8 border-t border-brand-border">
            <ProductRail
              eyebrow="You May Also Like"
              title="Related Designs"
              subtitle="Similar silhouettes from the CFN collection."
              href="/shop"
              products={relatedProducts}
            />
          </div>
        )}
      </Container>
    </div>
  );
}
