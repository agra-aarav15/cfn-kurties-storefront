/**
 * Instant search dialog — searches while typing (debounced).
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { formatPrice } from "@/utils/format";
import type { Product } from "@/types";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query, 280);
  const inputRef = useRef<HTMLInputElement>(null);
  useLockBodyScroll(open);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debounced.trim())}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setResults(data.data || []);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            className="mx-auto mt-0 w-full max-w-2xl bg-white shadow-2xl md:mt-24 md:rounded-sm"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-brand-border px-4 py-4">
              <Search className="h-5 w-5 text-brand-gray-400" strokeWidth={1.5} />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search kurties, fabrics, styles…"
                className="flex-1 bg-transparent text-base outline-none placeholder:text-brand-gray-400"
                aria-label="Search query"
                autoComplete="off"
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin text-brand-gray-400" />}
              <button type="button" onClick={onClose} aria-label="Close search">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {!query.trim() && (
                <p className="px-6 py-10 text-center text-sm text-brand-gray-400">
                  Start typing to search the collection
                </p>
              )}
              {query.trim() && !loading && results.length === 0 && (
                <p className="px-6 py-10 text-center text-sm text-brand-gray-500">
                  No results for “{query}”
                </p>
              )}
              <ul>
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-brand-gray-50"
                    >
                      <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden bg-brand-cream">
                        {p.images[0] && (
                          <Image
                            src={p.images[0].src}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-brand-black">{p.name}</p>
                      </div>
                      <span className="text-sm font-medium">{formatPrice(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {results.length > 0 && (
                <div className="border-t border-brand-border p-4 text-center">
                  <Link
                    href={`/shop?search=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="text-sm font-medium text-brand-black hover:text-brand-gold"
                  >
                    View all results →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
