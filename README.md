# CFN Kurties

Production-ready headless e-commerce storefront for **CFN Kurties** — modern Indian ethnic fashion.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · Headless WooCommerce · Razorpay

**Brand:** Modern Ethnic Fashion · Affordable Elegance · Premium Quality

---

## Quick start

```bash
cd cfn-kurties
cp .env.example .env.local
npm install
npm run dev
```

Open **[http://localhost:3005](http://localhost:3005)**

The site runs with **placeholder products** and **mock Razorpay** until you connect WooCommerce and payment keys.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port **3005** |
| `npm run build` | Production build |
| `npm start` | Production server on port **3005** |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

---

## Project structure

```
src/
  app/           # Routes, API, SEO (robots, sitemap)
  components/    # UI, layout, home, product, cart, checkout
  config/        # Site, WooCommerce, Razorpay
  constants/     # Brand tokens, placeholders
  hooks/         # Cart, debounce, body lock
  lib/           # Mappers, rate limit
  services/      # Products, orders, payments
  types/         # Shared TypeScript types
  utils/         # cn, format, validation
documentation/   # Guides (deployment, API, style, etc.)
```

---

## Features

- Premium fashion homepage (hero image/video, categories, arrivals, bestsellers, reviews, Instagram, newsletter)
- Sticky hamburger navigation + instant search
- Shop with filters: price, category, size, fabric, availability
- Product pages (fabric, sizes, stock, delivery, No COD / No Returns)
- Side-drawer cart · **guest checkout only** · Razorpay
- Track order (Order ID + email/phone, no account)
- SEO: meta, OG, Twitter, JSON-LD, sitemap, robots
- Security headers, rate-limited APIs, Zod validation

---

## Documentation

| File | Contents |
|------|----------|
| [PROJECT_GUIDE.md](./documentation/PROJECT_GUIDE.md) | Architecture & conventions |
| [DEPLOYMENT.md](./documentation/DEPLOYMENT.md) | Oracle Cloud, Nginx, PM2, SSL, Termux |
| [API.md](./documentation/API.md) | REST API reference |
| [STYLE_GUIDE.md](./documentation/STYLE_GUIDE.md) | Design system |
| [CHANGELOG.md](./documentation/CHANGELOG.md) | Version history |
| [.env.example](./.env.example) | Environment variables |

---

## Connecting real data

1. **WooCommerce** — set `WOOCOMMERCE_URL`, consumer key/secret, `WOOCOMMERCE_USE_PLACEHOLDERS=false`
2. **Razorpay** — set key ID + secret, `RAZORPAY_MOCK=false`
3. **Hero** — replace placeholder image or set `NEXT_PUBLIC_HERO_VIDEO_SRC` + enable video
4. **Products** — manage in WordPress admin; storefront picks them up via REST API

---

## License

Private — CFN Kurties. All rights reserved.
