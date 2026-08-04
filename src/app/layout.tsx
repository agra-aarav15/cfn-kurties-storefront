/**
 * Root layout — fonts, chrome, SEO defaults, security-friendly structure.
 */

import type { Metadata, Viewport } from "next";
import { Outfit, Geist } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.seo.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    images: ["/images/og-default.jpg"],
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "fashion",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${outfit.variable} ${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
