/**
 * Track order — Order ID + email or phone, no account required.
 */

"use client";

import { useState, type FormEvent } from "react";
import { formatDate, formatOrderStatus, formatPrice } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import type { TrackOrderResult } from "@/types";

export function TrackOrderForm() {
  const [orderId, setOrderId] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackOrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, emailOrPhone }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Lookup failed");
      }
      setResult(data.data as TrackOrderResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="orderId" className="mb-1.5 block text-sm font-medium">
            Order ID
          </label>
          <input
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            placeholder="e.g. CFN123456"
            className="w-full border border-brand-border bg-white px-3 py-3 text-sm outline-none focus:border-brand-black"
          />
        </div>
        <div>
          <label htmlFor="emailOrPhone" className="mb-1.5 block text-sm font-medium">
            Email or phone used at checkout
          </label>
          <input
            id="emailOrPhone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
            placeholder="Email or 10-digit mobile"
            className="w-full border border-brand-border bg-white px-3 py-3 text-sm outline-none focus:border-brand-black"
          />
        </div>
        {error && (
          <p className="text-sm text-brand-error" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" fullWidth size="lg" loading={loading}>
          Track order
        </Button>
      </form>

      {result && !result.found && (
        <p className="mt-8 text-center text-sm text-brand-gray-500" role="status">
          {result.message || "Order not found."}
        </p>
      )}

      {result?.found && result.order && (
        <div className="mt-10 border border-brand-border bg-brand-off-white p-6" role="status">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-brand-gray-400">Order</p>
              <p className="font-heading text-xl font-semibold">#{result.order.orderNumber}</p>
            </div>
            <span className="bg-brand-black px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
              {formatOrderStatus(result.order.status)}
            </span>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-brand-gray-500">Placed</dt>
              <dd>{formatDate(result.order.dateCreated)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-gray-500">Total</dt>
              <dd className="font-medium">{formatPrice(result.order.total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-gray-500">Est. delivery</dt>
              <dd>{result.order.estimatedDelivery}</dd>
            </div>
            {result.order.trackingNumber && (
              <div className="flex justify-between">
                <dt className="text-brand-gray-500">Tracking</dt>
                <dd>
                  {result.order.trackingUrl ? (
                    <a
                      href={result.order.trackingUrl}
                      className="text-brand-gold underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.order.trackingNumber}
                    </a>
                  ) : (
                    result.order.trackingNumber
                  )}
                </dd>
              </div>
            )}
          </dl>
          {result.order.lineItems?.length > 0 && (
            <ul className="mt-6 space-y-2 border-t border-brand-border pt-4 text-sm">
              {result.order.lineItems.map((li, idx) => (
                <li key={idx} className="flex justify-between text-brand-gray-600">
                  <span>
                    {li.name} · {li.size} × {li.quantity}
                  </span>
                  <span>{formatPrice(li.total)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 text-xs text-brand-gray-400">
            Updates are sent by email and WhatsApp. For damaged product support, contact us with
            your order ID and photos.
          </p>
        </div>
      )}
    </div>
  );
}
