/**
 * WooCommerce REST API configuration
 * Uses environment variables for credentials — never hardcode secrets.
 */

export const wooConfig = {
  baseUrl: process.env.WOOCOMMERCE_URL || process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "",
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || "",
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || "",
  apiVersion: "wc/v3",
  /** When true (or credentials missing), services return curated placeholder products */
  usePlaceholders:
    process.env.WOOCOMMERCE_USE_PLACEHOLDERS === "true" ||
    !process.env.WOOCOMMERCE_CONSUMER_KEY ||
    !process.env.WOOCOMMERCE_URL,
  timeout: 15000,
  perPage: 24,
} as const;

export function getWooApiUrl(path: string): string {
  const base = wooConfig.baseUrl.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  return `${base}/wp-json/${wooConfig.apiVersion}/${cleanPath}`;
}
