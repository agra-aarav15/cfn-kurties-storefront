/**
 * Track Order — guest lookup by Order ID + email or phone.
 */

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { TrackOrderForm } from "@/components/track/TrackOrderForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Track Order",
  description:
    "Track your CFN Kurties order with Order ID and email or phone. No account required.",
  alternates: { canonical: `${siteConfig.url}/track-order` },
  robots: { index: false, follow: true },
};

export default function TrackOrderPage() {
  return (
    <div className="bg-white pt-24 pb-20 md:pt-28 md:pb-28">
      <Container>
        <div className="mx-auto mb-10 max-w-lg text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">Support</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Track Your Order
          </h1>
          <p className="mt-3 text-sm text-brand-gray-500">
            Enter your Order ID and the email or phone number used at checkout. No login required.
          </p>
        </div>
        <TrackOrderForm />
      </Container>
    </div>
  );
}
