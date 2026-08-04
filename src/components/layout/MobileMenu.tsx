/**
 * Full-screen hamburger menu — elegant, minimal, fast.
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/constants/brand";
import { siteConfig } from "@/config/site";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  useLockBodyScroll(open);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
        >
          <div className="flex h-16 items-center justify-between px-5 md:h-20 md:px-8">
            <span className="font-heading text-lg font-semibold tracking-[0.15em]">CFN</span>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center px-8 md:px-16">
            <ul className="space-y-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.35 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block py-3 font-heading text-3xl font-medium tracking-tight text-brand-black transition-colors hover:text-brand-gold md:text-4xl"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-brand-border px-8 py-8 md:px-16">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gray-400">
              {siteConfig.tagline}
            </p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="mt-3 block text-sm text-brand-gray-600 hover:text-brand-black"
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
