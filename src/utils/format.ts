/**
 * Formatting helpers for currency, dates, and display text.
 */

import { siteConfig } from "@/config/site";

/** Format number as INR currency (e.g. ₹1,299) */
export function formatPrice(amount: number, currency = siteConfig.currency): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Parse WooCommerce string prices safely */
export function parsePrice(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;
  const n = parseFloat(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Human-readable order status */
export function formatOrderStatus(status: string): string {
  const map: Record<string, string> = {
    pending: "Payment Pending",
    processing: "Processing",
    "on-hold": "On Hold",
    completed: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
    failed: "Failed",
    shipped: "Shipped",
  };
  return map[status] || status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Format ISO date for Indian locale */
export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Truncate text with ellipsis */
export function truncate(text: string, max = 120): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

/** Strip HTML tags from WooCommerce descriptions */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
