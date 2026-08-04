/**
 * Lock body scroll when drawers/modals are open (a11y + mobile UX).
 */

"use client";

import { useEffect } from "react";

export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
