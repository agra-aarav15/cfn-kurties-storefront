/**
 * Guest checkout only — no login, registration, or OTP.
 */

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure guest checkout for CFN Kurties. Pay with Razorpay.",
  alternates: { canonical: `${siteConfig.url}/checkout` },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="bg-white pt-24 pb-20 md:pt-28 md:pb-28">
      <Container>
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
            Guest checkout
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-brand-gray-500">
            No account needed. Delivery in {siteConfig.policies.estimatedDelivery}. No COD · No
            returns.
          </p>
        </div>
        <CheckoutForm />
      </Container>
    </div>
  );
}
