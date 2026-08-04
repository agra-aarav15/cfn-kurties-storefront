# CFN Kurties — API Reference

Base URL (local): `http://localhost:3005`

All JSON responses:

```json
{ "success": true, "data": { } }
// or
{ "success": false, "error": { "message": "…", "details": optional } }
```

Rate limits are per IP (in-memory). Behind Nginx, `X-Forwarded-For` is used.

---

## `GET /api/products`

List/filter products.

| Query | Description |
|-------|-------------|
| `search` / `q` | Text search |
| `category` | Category slug |
| `price` | `min-max` e.g. `1000-1500` |
| `min_price` / `max_price` | Numeric |
| `size` | Comma sizes e.g. `34,36` |
| `fabric` | Comma fabrics |
| `availability` | `instock` \| `outofstock` |
| `featured` | `true` |
| `on_sale` | `true` |
| `orderby` | `date` \| `price` \| `title` \| `popularity` \| `rating` |
| `order` | `asc` \| `desc` |
| `page` | Default 1 |
| `per_page` | Default 24, max 48 |

---

## `GET /api/search?q=`

Instant search (max 8 results). Min query length: 2.

---

## `POST /api/checkout`

Create guest order + Razorpay order.

```json
{
  "billing": {
    "firstName": "Ananya",
    "lastName": "Sharma",
    "email": "a@example.com",
    "phone": "9876543210",
    "address1": "12 MG Road",
    "address2": "",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postcode": "560001",
    "country": "IN"
  },
  "shipping": { "...same..." },
  "lineItems": [{ "productId": 101, "quantity": 1, "size": "36" }],
  "customerNote": "optional",
  "paymentMethod": "razorpay"
}
```

Response includes `order` and `razorpayOrder` (`id`, `amount` in paise, `currency`).

Limit: 10 req/min/IP.

---

## `POST /api/razorpay/verify`

```json
{
  "razorpay_order_id": "order_…",
  "razorpay_payment_id": "pay_…",
  "razorpay_signature": "…",
  "wooOrderId": 123456
}
```

Mock mode accepts `order_mock_*` and `mock_signature`.

---

## `POST /api/track`

```json
{
  "orderId": "CFN123456",
  "emailOrPhone": "a@example.com"
}
```

---

## `POST /api/newsletter`

```json
{ "email": "a@example.com" }
```

Optional forward via `NEWSLETTER_WEBHOOK_URL`.

---

## `GET /api/orders?id=`

Summary only (no full PII). Prefer `/api/track` for customers.

---

## WooCommerce (upstream)

Configured via env. Endpoints used:

- `GET /wp-json/wc/v3/products`
- `GET /wp-json/wc/v3/products/categories`
- `POST /wp-json/wc/v3/orders`
- `PUT /wp-json/wc/v3/orders/:id`

Auth: HTTP Basic (`consumer_key` : `consumer_secret`).
