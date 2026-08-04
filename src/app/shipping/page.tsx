/**
 * Shipping information page.
 */

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/utils/format";

export const metadata: Metadata = {
  title: "Shipping",
  description: "CFN Kurties shipping timelines, free shipping threshold, and delivery details.",
  alternates: { canonical: `${siteConfig.url}/shipping` },
};

export default function ShippingPage() {
  return (
    <div className="bg-white pt-24 pb-20 md:pt-28 md:pb-28">
      <Container narrow>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">Help</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Shipping
        </h1>
        <div className="prose-product mt-10 space-y-6">
          <p>
            We ship across India. Estimated delivery:{" "}
            <strong>{siteConfig.policies.estimatedDelivery}</strong> after payment confirmation.
          </p>
          <p>
            Free standard shipping on orders of{" "}
            <strong>{formatPrice(siteConfig.policies.freeShippingThreshold)}</strong> or more. A
            flat shipping fee may apply below that threshold at checkout.
          </p>
          <p>
            Once shipped, tracking details (when available) can be checked on the{" "}
            <a href="/track-order" className="underline">
              Track Order
            </a>{" "}
            page. You will also receive updates by email and WhatsApp.
          </p>
          <p>
            We do not offer Cash on Delivery. All orders must be paid online via Razorpay before
            dispatch.
          </p>
        </div>
      </Container>
    </div>
  );
}
