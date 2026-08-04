# Changelog

All notable changes to CFN Kurties storefront.

## [1.0.0] — 2026-07-29

### Added

- Next.js App Router storefront with TypeScript + Tailwind v4
- Design system: black / white / gold, Manrope + Inter
- Homepage: Hero (image/video), Categories, New Arrivals, Best Sellers, Featured, Why Choose, Reviews, Instagram, Newsletter
- Navigation: sticky header, hamburger menu, instant search, bag badge
- Shop with filters (price, category, size, fabric, availability) + sort
- Category and product detail pages
- Side drawer cart (Zustand + persist)
- Guest checkout + Razorpay (live + mock mode)
- Track order (Order ID + email/phone)
- WooCommerce REST integration with placeholder fallback
- API routes: products, search, checkout, razorpay/verify, track, newsletter, orders
- SEO: metadata, Open Graph, Twitter, JSON-LD, sitemap, robots
- Security headers, rate limiting, Zod validation
- Policy, shipping, contact, 404 pages
- Full documentation set and `.env.example`
- Dev/prod scripts on port **3005**
