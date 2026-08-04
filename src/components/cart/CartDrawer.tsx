/**
 * Side drawer cart — guest bag with quantity controls and checkout CTA.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { formatPrice } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import type { ProductSize } from "@/types";

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const items = useCart((s) => s.items);
  const closeCart = useCart((s) => s.closeCart);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const freeShip = siteConfig.policies.freeShippingThreshold;
  const remaining = Math.max(0, freeShip - subtotal);

  useLockBodyScroll(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                Your Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="flex h-10 w-10 items-center justify-center"
                aria-label="Close bag"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mb-4 h-10 w-10 text-brand-gray-300" strokeWidth={1} />
                  <p className="font-heading text-lg font-medium">Your bag is empty</p>
                  <p className="mt-2 text-sm text-brand-gray-500">
                    Discover modern ethnic pieces made for everyday elegance.
                  </p>
                  <Button
                    className="mt-6"
                    variant="outline"
                    href="/shop"
                    onClick={closeCart}
                  >
                    Explore Collection
                  </Button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={`${item.productId}-${item.size}`} className="flex gap-4">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="relative h-28 w-20 flex-shrink-0 overflow-hidden bg-brand-cream"
                      >
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="text-sm font-medium leading-snug text-brand-black hover:text-brand-gold"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.productId, item.size as ProductSize)
                            }
                            className="text-brand-gray-400 hover:text-brand-black"
                            aria-label={`Remove ${item.name}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-brand-gray-400">
                          Size {item.size}
                          {item.fabric ? ` · ${item.fabric}` : ""}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="inline-flex items-center border border-brand-border">
                            <button
                              type="button"
                              aria-label="Decrease"
                              className="flex h-8 w-8 items-center justify-center"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.size as ProductSize,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-6 text-center text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase"
                              className="flex h-8 w-8 items-center justify-center"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.size as ProductSize,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brand-border px-5 py-5">
                {remaining > 0 ? (
                  <p className="mb-3 text-xs text-brand-gray-500">
                    Add {formatPrice(remaining)} more for free shipping
                  </p>
                ) : (
                  <p className="mb-3 text-xs text-brand-success">You qualify for free shipping</p>
                )}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-brand-gray-500">Subtotal</span>
                  <span className="font-heading text-lg font-semibold">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <Button fullWidth size="lg" href="/checkout" onClick={closeCart}>
                  Checkout
                </Button>
                <p className="mt-3 text-center text-[11px] text-brand-gray-400">
                  Guest checkout · No COD · Secure payment via Razorpay
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
