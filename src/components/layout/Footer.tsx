/**
 * Premium footer — brand, shop links, policies, contact, social.
 */

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { navLinks } from "@/constants/brand";

const policyLinks = [
  { href: "/shipping", label: "Shipping" },
  { href: "/policies", label: "Order Policies" },
  { href: "/track-order", label: "Track Order" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-border bg-brand-black text-white">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="font-heading text-2xl font-semibold tracking-[0.2em]">CFN</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {siteConfig.tagline}. Premium Indian ethnic wear crafted for modern elegance.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
              Shop
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.slice(0, 5).map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
              Help
            </h3>
            <ul className="mt-5 space-y-3">
              {policyLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
              Connect
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors hover:text-white"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  WhatsApp Support
                </a>
              </li>
              <li className="flex gap-4 pt-2">
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand-gold"
                >
                  Instagram
                </a>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand-gold"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/40">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            No COD · No Returns · Damaged product support only · Delivery{" "}
            {siteConfig.policies.estimatedDelivery}
          </p>
        </div>
      </Container>
    </footer>
  );
}
