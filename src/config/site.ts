/**
 * CFN Kurties — Site configuration
 * Central source of truth for brand, URLs, contact, and feature flags.
 */

export const siteConfig = {
  name: "CFN Kurties",
  tagline: "Modern Ethnic Fashion · Affordable Elegance",
  description:
    "Discover premium Indian ethnic wear at CFN Kurties. Modern kurties crafted with elegant fabrics, premium quality, and affordable elegance for the contemporary woman.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://cfnkurties.in",
  locale: "en_IN",
  currency: "INR",
  currencySymbol: "₹",

  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "help@cfnkurties.in",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+919569096645",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919569096645",
    address: "India",
  },

  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/cfntrendzkurtis",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/share/1K9jN3qdno/",
    pinterest: process.env.NEXT_PUBLIC_PINTEREST_URL || "https://pinterest.com/cfnkurties",
  },

  policies: {
    estimatedDelivery: "7–10 Working Days",
    cod: false,
    returns: false,
    damagedSupport: true,
    freeShippingThreshold: 0,
  },

  features: {
    heroVideo: process.env.NEXT_PUBLIC_HERO_VIDEO_ENABLED === "true",
    guestCheckoutOnly: true,
    trackOrder: true,
    newsletter: true,
  },

  seo: {
    titleTemplate: "%s | CFN Kurties",
    defaultTitle: "CFN Kurties — Modern Ethnic Fashion | Affordable Elegance",
    keywords: [
      "kurties",
      "ethnic wear",
      "Indian fashion",
      "modern kurtis",
      "affordable elegance",
      "premium kurties",
      "CFN Kurties",
      "women ethnic wear online",
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
