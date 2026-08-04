/**
 * Instagram grid — placeholder looks until real feed is wired.
 */

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { instagramPlaceholders } from "@/constants/placeholders";
import { siteConfig } from "@/config/site";

export function Instagram() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeader
          eyebrow="Social"
          title="Follow the Look"
          subtitle="Style inspiration from the CFN community."
          href={siteConfig.social.instagram}
          linkLabel="@cfnkurties"
          align="center"
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-6">
          {instagramPlaceholders.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-brand-cream"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
