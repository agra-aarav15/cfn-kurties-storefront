/**
 * Why Choose CFN — trust pillars (premium, calm, conversion-minded).
 */

import { Sparkles, Shirt, Truck, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const pillars = [
  {
    icon: Shirt,
    title: "Premium Quality",
    text: "Carefully selected fabrics and clean finishing — pieces that feel as good as they look.",
  },
  {
    icon: Sparkles,
    title: "Affordable Elegance",
    text: "Modern ethnic design without the luxury markup. Honest pricing, elevated style.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    text: "Estimated delivery in 7–10 working days across India, with order updates by email & WhatsApp.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    text: "Guest checkout only — fast, private, and protected with Razorpay. No COD, no account required.",
  },
];

export function WhyChoose() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeader
          eyebrow="The CFN Promise"
          title="Why Choose CFN"
          subtitle="Built for women who want ethnic wear that feels modern, trustworthy, and premium."
          align="center"
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="border border-brand-border bg-white p-6 transition-colors hover:border-brand-gold/40 md:p-8"
            >
              <p.icon className="h-6 w-6 text-brand-gold" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-5 font-heading text-lg font-semibold text-brand-black">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-gray-500">{p.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
