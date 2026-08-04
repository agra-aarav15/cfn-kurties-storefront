/**
 * Guest checkout form — no login, no OTP. Collects shipping + policies.
 * Creates Woo order, opens Razorpay, verifies payment.
 */

"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { checkoutSchema } from "@/utils/validation";
import { formatPrice } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { razorpayConfig } from "@/config/razorpay";
import type { ProductSize } from "@/types";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clearCart);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );
  const shipping = 0;
  const total = subtotal;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "IN",
    notes: "",
    acceptPolicies: false as boolean,
  });

  const set = (key: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!items.length) {
      setFormError("Your bag is empty.");
      return;
    }

    const parsed = checkoutSchema.safeParse({
      ...form,
      acceptPolicies: form.acceptPolicies ? true : undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() || "form";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const address = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address1: form.address1,
        address2: form.address2 || undefined,
        city: form.city,
        state: form.state,
        postcode: form.postcode,
        country: "IN",
      };

      // 1) Create Woo / mock order
      const orderRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing: address,
          shipping: address,
          lineItems: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            size: i.size as ProductSize,
          })),
          customerNote: form.notes || undefined,
          paymentMethod: "razorpay",
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error?.message || "Could not create order");
      }

      const order = orderData.data.order;
      const razorpayOrder = orderData.data.razorpayOrder;

      // 2) Open official Razorpay Gateway Popup Modal
      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) {
        throw new Error("Unable to load Razorpay. Please refresh and try again.");
      }

      const rzp = new window.Razorpay({
        key: razorpayConfig.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: siteConfig.name,
        description: `Order ${order.orderNumber}`,
        order_id: razorpayOrder.id.startsWith("order_rzp_") ? undefined : razorpayOrder.id,
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: razorpayConfig.themeColor },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || razorpayOrder.id,
                razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || "mock_signature",
                wooOrderId: order.id,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error?.message || "Verification failed");
            }
            clearCart();
            router.push(`/checkout/success?order=${order.orderNumber}`);
          } catch (err) {
            setFormError(err instanceof Error ? err.message : "Payment verification failed");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });
      rzp.open();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-heading text-xl font-semibold">Your bag is empty</p>
        <Button href="/shop" className="mt-6" variant="outline">
          Continue shopping
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-12 lg:grid-cols-5" noValidate>
      <div className="space-y-8 lg:col-span-3">
        <fieldset>
          <legend className="font-heading text-xl font-semibold">Contact</legend>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              label="First name"
              name="firstName"
              value={form.firstName}
              onChange={(v) => set("firstName", v)}
              error={errors.firstName}
              autoComplete="given-name"
              required
            />
            <Field
              label="Last name"
              name="lastName"
              value={form.lastName}
              onChange={(v) => set("lastName", v)}
              error={errors.lastName}
              autoComplete="family-name"
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(v) => set("email", v)}
              error={errors.email}
              autoComplete="email"
              required
              className="sm:col-span-2"
            />
            <Field
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={(v) => set("phone", v)}
              error={errors.phone}
              autoComplete="tel"
              required
              className="sm:col-span-2"
              placeholder="10-digit mobile"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-heading text-xl font-semibold">Shipping address</legend>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              label="Address"
              name="address1"
              value={form.address1}
              onChange={(v) => set("address1", v)}
              error={errors.address1}
              autoComplete="address-line1"
              required
              className="sm:col-span-2"
            />
            <Field
              label="Apartment, landmark (optional)"
              name="address2"
              value={form.address2}
              onChange={(v) => set("address2", v)}
              autoComplete="address-line2"
              className="sm:col-span-2"
            />
            <Field
              label="City"
              name="city"
              value={form.city}
              onChange={(v) => set("city", v)}
              error={errors.city}
              autoComplete="address-level2"
              required
            />
            <div>
              <label htmlFor="state" className="mb-1.5 block text-sm font-medium">
                State
              </label>
              <select
                id="state"
                name="state"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                required
                className={inputClass(!!errors.state)}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.state && <p className="mt-1 text-xs text-brand-error">{errors.state}</p>}
            </div>
            <Field
              label="PIN code"
              name="postcode"
              value={form.postcode}
              onChange={(v) => set("postcode", v)}
              error={errors.postcode}
              autoComplete="postal-code"
              required
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-heading text-xl font-semibold">Order note</legend>
          <textarea
            name="notes"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            placeholder="Optional delivery instructions"
            className={`${inputClass(false)} mt-5 resize-y`}
          />
        </fieldset>

        <label className="flex items-start gap-3 text-sm leading-relaxed text-brand-gray-600">
          <input
            type="checkbox"
            checked={form.acceptPolicies}
            onChange={(e) => set("acceptPolicies", e.target.checked)}
            className="mt-1 h-4 w-4 accent-brand-black"
          />
          <span>
            I understand: delivery in {siteConfig.policies.estimatedDelivery},{" "}
            <strong>no COD</strong>, <strong>no returns</strong>, only damaged product support.
            Payment is secure via Razorpay.
          </span>
        </label>
        {errors.acceptPolicies && (
          <p className="text-sm text-brand-error">{errors.acceptPolicies}</p>
        )}
      </div>

      {/* Summary */}
      <aside className="lg:col-span-2">
        <div className="sticky top-24 border border-brand-border bg-brand-off-white p-6">
          <ul className="mt-5 space-y-4 border-b border-brand-border pb-5">
            {items.map((i) => (
              <li key={`${i.productId}-${i.size}`} className="flex items-center gap-3 text-sm">
                <div className="relative h-14 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white border border-brand-border shadow-sm">
                  {i.image ? (
                    <Image
                      src={i.image}
                      alt={i.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-gray-100 text-[10px] text-brand-gray-400">
                      Item
                    </div>
                  )}
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-black text-[9px] font-bold text-white shadow-sm">
                    {i.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-black truncate">{i.name}</p>
                  <p className="text-xs text-brand-gray-500 font-mono mt-0.5">
                    Size: {i.size} {i.fabric ? `· ${i.fabric}` : ""}
                  </p>
                </div>
                <span className="font-bold text-brand-black whitespace-nowrap font-heading">
                  {formatPrice(i.price * i.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-gray-500">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray-500">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-brand-border pt-3 font-heading text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {formError && (
            <p className="mt-4 text-sm text-brand-error" role="alert">
              {formError}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" className="mt-6" loading={loading}>
            Pay {formatPrice(total)}
          </Button>
          <p className="mt-3 text-center text-[11px] text-brand-gray-400">
            Secured by Razorpay
          </p>
        </div>
      </aside>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return `w-full border bg-white px-3 py-3 text-sm outline-none transition-colors focus:border-brand-black ${
    hasError ? "border-brand-error" : "border-brand-border"
  }`;
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  required,
  className = "",
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className={inputClass(!!error)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-brand-error">
          {error}
        </p>
      )}
    </div>
  );
}
