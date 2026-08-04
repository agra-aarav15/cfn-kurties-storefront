/**
 * Sticky minimal header — logo, search, bag, hamburger menu.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { MobileMenu } from "./MobileMenu";
import { SearchDialog } from "./SearchDialog";
import { Container } from "@/components/ui/Container";
import { cn } from "@/utils/cn";
import { siteConfig } from "@/config/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCart((s) => s.itemCount());
  const openCart = useCart((s) => s.openCart);
  // Re-subscribe to items so count updates
  const items = useCart((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Silence unused if tree-shaken — keep itemCount for clarity
  void itemCount;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-in-out",
          scrolled
            ? "border-b border-brand-border/80 bg-white/95 backdrop-blur-md shadow-stitch-diffused"
            : "bg-gradient-to-b from-black/60 via-black/20 to-transparent"
        )}
      >
        <Container className="flex h-16 items-center justify-between md:h-20">
          {/* Menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={cn(
              "flex h-10 w-10 items-center justify-center transition-colors duration-300 hover:opacity-80",
              scrolled ? "text-brand-black" : "text-white"
            )}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "absolute left-1/2 -translate-x-1/2 font-heading text-lg font-bold tracking-[0.2em] transition-colors duration-300 md:text-xl",
              scrolled ? "text-brand-black" : "text-white"
            )}
            aria-label={`${siteConfig.name} home`}
          >
            CFN KURTIES
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn(
                "flex h-10 w-10 items-center justify-center transition-colors duration-300 hover:opacity-80",
                scrolled ? "text-brand-black" : "text-white"
              )}
              aria-label="Search products"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={openCart}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center transition-colors duration-300 hover:opacity-80",
                scrolled ? "text-brand-black" : "text-white"
              )}
              aria-label={`Open bag, ${count} items`}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-brand-black shadow-sm">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
