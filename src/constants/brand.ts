/**
 * Brand design tokens — colors, typography, spacing, motion.
 * Gold is used sparingly as a luxury accent.
 */

export const colors = {
  black: "#0A0A0A",
  blackSoft: "#1A1A1A",
  blackMuted: "#2A2A2A",
  white: "#FFFFFF",
  offWhite: "#FAFAF8",
  cream: "#F7F5F0",
  gold: "#C4A35A",
  goldLight: "#D4B96A",
  goldDark: "#A88B3D",
  gray50: "#F9F9F8",
  gray100: "#F0EFEC",
  gray200: "#E5E4E0",
  gray300: "#D1D0CB",
  gray400: "#9B9A95",
  gray500: "#6B6A66",
  gray600: "#4A4945",
  gray700: "#333230",
  gray800: "#1F1E1C",
  error: "#B33A3A",
  success: "#2D6A4F",
  border: "#E8E6E1",
} as const;

export const typography = {
  heading: "var(--font-manrope), system-ui, sans-serif",
  body: "var(--font-inter), system-ui, sans-serif",
} as const;

export const sizes = {
  numeric: ["32", "34", "36", "38", "40", "42", "44"] as const,
  labels: {
    "32": "XS / 32",
    "34": "S / 34",
    "36": "M / 36",
    "38": "L / 38",
    "40": "XL / 40",
    "42": "XXL / 42",
    "44": "3XL / 44",
  } as const,
};

export const fabrics = [
  "Cotton",
  "Cotton Blend",
  "Linen",
  "Rayon",
  "Georgette",
  "Chiffon",
  "Silk Blend",
  "Khadi",
] as const;

export const motion = {
  duration: {
    fast: 0.15,
    base: 0.3,
    slow: 0.5,
  },
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop Catalog" },
  { href: "/checkout", label: "Checkout" },
] as const;
