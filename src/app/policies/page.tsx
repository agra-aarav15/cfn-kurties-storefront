/**
 * Order policies — No COD, No Returns, damaged support only.
 */

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Order Policies",
  description: "CFN Kurties order policies: shipping, COD, returns, and damaged product support.",
  alternates: { canonical: `${siteConfig.url}/policies` },
};

export default function PoliciesPage() {
  return (
    <div className="bg-white pt-24 pb-20 md:pt-28 md:pb-28">
      <Container narrow>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">Legal</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Order Policies
        </h1>
        <div className="prose-product mt-10 space-y-8">
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black">Payment</h2>
            <p className="mt-2">
              All orders are prepaid via Razorpay. <strong>Cash on Delivery (COD) is not available.</strong>
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black">Returns & exchanges</h2>
            <p className="mt-2">
              <strong>We do not accept returns or exchanges.</strong> Please check the size chart and
              product details carefully before ordering.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black">
              Damaged product support
            </h2>
            <p className="mt-2">
              If your item arrives damaged, contact us within 48 hours of delivery with your Order ID
              and clear photos of the product and packaging. We will arrange a resolution for genuine
              damage-in-transit cases only.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black">Delivery</h2>
            <p className="mt-2">
              Estimated delivery is <strong>{siteConfig.policies.estimatedDelivery}</strong> from
              order confirmation. Timelines may vary by location and courier conditions.
            </p>
          </section>
          <section>
            <h2 className="font-heading text-lg font-semibold text-brand-black">Guest checkout</h2>
            <p className="mt-2">
              We use guest checkout only — no account, login, registration, or OTP is required. Keep
              your Order ID safe to track your shipment.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
