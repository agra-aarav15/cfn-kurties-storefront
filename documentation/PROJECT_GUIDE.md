# CFN Kurties — Project Guide

## Architecture

Headless commerce: **Next.js storefront** + **WordPress/WooCommerce admin** + **Razorpay payments**.

```
Browser → Next.js (SSR/SSG + API routes) → WooCommerce REST API
                                        → Razorpay Orders API
```

WordPress is **admin only** (products, orders, categories, coupons, inventory, banners). Customers never log into WordPress.

## Design principles

- Black / white / subtle gold
- Manrope (headings) + Inter (body)
- White space, large type, minimal motion
- Mobile-first, accessible, fast

## Data flow

### Products

1. `services/products.ts` checks `wooConfig.usePlaceholders`
2. If true (default without keys) → `constants/placeholders.ts`
3. If false → WooCommerce REST `wc/v3/products` with Basic Auth
4. Responses mapped via `lib/woocommerce-mapper.ts`

### Checkout (guest only)

1. Cart in Zustand + `localStorage` (`cfn-kurties-cart`)
2. `POST /api/checkout` validates with Zod, creates Woo order (or mock), creates Razorpay order
3. Client opens Razorpay Checkout (or mock path in dev)
4. `POST /api/razorpay/verify` verifies HMAC signature, marks order paid
5. Redirect to `/checkout/success?order=…`

### Track order

`POST /api/track` with Order ID + email or phone. No account required. Rate-limited.

## Folder conventions

| Path | Role |
|------|------|
| `components/*` | Presentational + interactive UI (commented) |
| `services/*` | Server-side business logic / external APIs |
| `app/api/*` | HTTP boundary, validation, rate limits |
| `hooks/*` | Client state & UX helpers |
| `config/*` | Env-driven configuration |
| `types/*` | Shared domain types |

## Policies (product & checkout)

- Estimated delivery: **7–10 working days**
- **No COD**
- **No returns**
- Damaged product support only
- No wash-care section / no extra product tabs

## Adding a page

1. Create `src/app/<route>/page.tsx`
2. Export `metadata` (title, description, canonical)
3. Use `Container`, brand classes, semantic HTML
4. Add to sitemap if public

## Adding a product attribute filter

1. Ensure WooCommerce attribute exists (`pa_size`, `pa_fabric`)
2. Mapper already extracts size/fabric
3. Shop URL params: `?size=36,38&fabric=Cotton`
4. `ProductFilters` + `getProducts` already wired

## Quality checklist

- [ ] Typed props and API payloads
- [ ] Loading / empty / error states
- [ ] Keyboard + ARIA on interactive UI
- [ ] No secrets in `NEXT_PUBLIC_*`
- [ ] Images via `next/image` with remote patterns
