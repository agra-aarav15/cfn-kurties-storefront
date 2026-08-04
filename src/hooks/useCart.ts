/**
 * Zustand cart store — guest cart with localStorage persistence.
 * Side drawer open state included.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductSize } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, size: ProductSize, quantity?: number) => void;
  removeItem: (productId: number, size: ProductSize) => void;
  updateQuantity: (productId: number, size: ProductSize, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, size, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === product.id && i.size === size
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id && i.size === size
                  ? { ...i, quantity: Math.min(10, i.quantity + quantity) }
                  : i
              ),
              isOpen: true,
            };
          }
          const item: CartItem = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0]?.src || "",
            size,
            quantity,
            fabric: product.fabric,
            maxQuantity: product.stockQuantity ?? 10,
          };
          return { items: [...state.items, item], isOpen: true };
        });
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.productId === productId && i.size === size)),
        }));
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, quantity: Math.min(i.maxQuantity ?? 10, quantity) }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "cfn-kurties-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
