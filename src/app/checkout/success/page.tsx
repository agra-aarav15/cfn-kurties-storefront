/**
 * Post-payment success page — order confirmation for guest checkout.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { order } = await searchParams;
  const orderNumber = order || "—";

  return (
    <div className="bg-white pt-24 pb-20 md:pt-28 md:pb-28">
      <Container narrow className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">Thank you</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Order confirmed
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-brand-gray-500">
          Your payment was received. We&apos;ve sent a confirmation to your email. You&apos;ll also
          receive WhatsApp updates as we process and ship your order.
        </p>

        <div className="mx-auto mt-10 border border-brand-border bg-brand-off-white p-6 text-left">
          <p className="text-xs uppercase tracking-wider text-brand-gray-400">Order number</p>
          <p className="mt-1 font-heading text-2xl font-semibold">#{orderNumber}</p>
          <ul className="mt-5 space-y-2 text-sm text-brand-gray-600">
            <li>· Estimated delivery: {siteConfig.policies.estimatedDelivery}</li>
            <li>· No COD · No returns · Damaged product support only</li>
            <li>
              · Track anytime at{" "}
              <Link href="/track-order" className="underline hover:text-brand-black">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/track-order" variant="primary" size="lg">
            Track order
          </Button>
          <Button href="/shop" variant="outline" size="lg">
            Continue shopping
          </Button>
        </div>
      </Container>
    </div>
  );
}
