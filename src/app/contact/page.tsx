/**
 * Contact page — email & WhatsApp support.
 */

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact CFN Kurties for order support, damaged product claims, and general enquiries.",
  alternates: { canonical: `${siteConfig.url}/contact` },
};

export default function ContactPage() {
  return (
    <div className="bg-white pt-24 pb-20 md:pt-28 md:pb-28">
      <Container narrow>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">Support</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Contact
        </h1>
        <p className="mt-4 text-sm text-brand-gray-500">
          We&apos;re here for order questions and damaged product support. Include your Order ID for
          faster help.
        </p>
        <ul className="mt-10 space-y-6 text-sm">
          <li>
            <p className="text-xs uppercase tracking-wider text-brand-gray-400">Email</p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="mt-1 block font-medium text-brand-black hover:text-brand-gold"
            >
              {siteConfig.contact.email}
            </a>
          </li>
          <li>
            <p className="text-xs uppercase tracking-wider text-brand-gray-400">WhatsApp</p>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block font-medium text-brand-black hover:text-brand-gold"
            >
              Chat on WhatsApp
            </a>
          </li>
          <li>
            <p className="text-xs uppercase tracking-wider text-brand-gray-400">Instagram</p>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block font-medium text-brand-black hover:text-brand-gold"
            >
              @cfnkurties
            </a>
          </li>
        </ul>
      </Container>
    </div>
  );
}
