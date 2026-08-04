/**
 * Consistent section title + optional subtitle / link for homepage blocks.
 */

import Link from "next/link";
import { cn } from "@/utils/cn";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel = "View all",
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-3 md:mb-14",
        align === "center" && "items-center text-center",
        align === "left" && "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn(align === "center" && "max-w-2xl")}>
        {eyebrow && (
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
            {eyebrow}
          </p>
        )}
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-brand-black md:text-4xl lg:text-5xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-gray-500 md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 text-sm font-medium tracking-wide text-brand-black transition-colors hover:text-brand-gold"
        >
          {linkLabel}
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      )}
    </div>
  );
}
