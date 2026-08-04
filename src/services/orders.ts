/**
 * Order service — guest checkout orders via WooCommerce + local mock fallback.
 */

import { wooConfig, getWooApiUrl } from "@/config/woocommerce";
import { siteConfig } from "@/config/site";
import type {
  CreateOrderPayload,
  Order,
  OrderLineItem,
  OrderStatus,
  ShippingAddress,
  TrackOrderRequest,
  TrackOrderResult,
} from "@/types";
import { getProductById } from "./products";

/* In-memory mock store for placeholder mode (process lifetime) */
const mockOrders = new Map<string, Order>();

async function wooFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = getWooApiUrl(path);
  const credentials = Buffer.from(
    `${wooConfig.consumerKey}:${wooConfig.consumerSecret}`
  ).toString("base64");

  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(wooConfig.timeout),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WooCommerce order API ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

function mapAddress(a: ShippingAddress) {
  return {
    first_name: a.firstName,
    last_name: a.lastName,
    email: a.email,
    phone: a.phone,
    address_1: a.address1,
    address_2: a.address2 || "",
    city: a.city,
    state: a.state,
    postcode: a.postcode,
    country: a.country || "IN",
  };
}

function fromWooAddress(a: Record<string, string>): ShippingAddress {
  return {
    firstName: a.first_name || "",
    lastName: a.lastName || a.last_name || "",
    email: a.email || "",
    phone: a.phone || "",
    address1: a.address_1 || "",
    address2: a.address_2 || "",
    city: a.city || "",
    state: a.state || "",
    postcode: a.postcode || "",
    country: a.country || "IN",
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapWooOrder(raw: any): Order {
  const lineItems: OrderLineItem[] = (raw.line_items || []).map((li: any) => ({
    productId: li.product_id,
    name: li.name,
    quantity: li.quantity,
    price: parseFloat(li.price) || 0,
    size:
      (li.meta_data || []).find((m: any) => m.key === "pa_size" || m.key === "Size")?.value ||
      "36",
    image: li.image?.src,
    total: parseFloat(li.total) || 0,
  }));

  const tracking =
    (raw.meta_data || []).find((m: any) => m.key === "_tracking_number")?.value ||
    (raw.meta_data || []).find((m: any) => m.key === "tracking_number")?.value;

  return {
    id: raw.id,
    orderNumber: String(raw.number || raw.id),
    status: raw.status as OrderStatus,
    currency: raw.currency || "INR",
    total: parseFloat(raw.total) || 0,
    subtotal: parseFloat(raw.total) - parseFloat(raw.shipping_total || "0"),
    shippingTotal: parseFloat(raw.shipping_total || "0"),
    discountTotal: parseFloat(raw.discount_total || "0"),
    paymentMethod: raw.payment_method || "razorpay",
    paymentMethodTitle: raw.payment_method_title || "Razorpay",
    transactionId: raw.transaction_id,
    billing: fromWooAddress(raw.billing || {}),
    shipping: fromWooAddress(raw.shipping || {}),
    lineItems,
    customerNote: raw.customer_note,
    trackingNumber: tracking,
    dateCreated: raw.date_created,
    dateModified: raw.date_modified,
    estimatedDelivery: siteConfig.policies.estimatedDelivery,
  };
}

/* Sequential WooCommerce-style order counter for mock fallback */
let nextWooMockOrderId = 1001;

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  // Build line totals from catalog
  const lineItemsDetailed: OrderLineItem[] = [];
  let subtotal = 0;

  for (const item of payload.lineItems) {
    const product = await getProductById(item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    if (product.stockStatus === "outofstock") {
      throw new Error(`${product.name} is out of stock`);
    }
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    lineItemsDetailed.push({
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      size: item.size,
      image: product.images[0]?.src,
      total: lineTotal,
    });
  }

  const shippingTotal = 0;
  const total = subtotal;

  if (wooConfig.usePlaceholders) {
    const id = nextWooMockOrderId++;
    const order: Order = {
      id,
      orderNumber: String(id),
      status: "pending",
      currency: "INR",
      total,
      subtotal,
      shippingTotal,
      discountTotal: 0,
      paymentMethod: "razorpay",
      paymentMethodTitle: "Razorpay",
      billing: payload.billing,
      shipping: payload.shipping,
      lineItems: lineItemsDetailed,
      customerNote: payload.customerNote,
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      estimatedDelivery: siteConfig.policies.estimatedDelivery,
    };
    mockOrders.set(String(id), order);
    mockOrders.set(order.orderNumber, order);
    return order;
  }

  const body = {
    payment_method: "razorpay",
    payment_method_title: "Razorpay",
    set_paid: false,
    billing: mapAddress(payload.billing),
    shipping: mapAddress(payload.shipping),
    line_items: payload.lineItems.map((li) => ({
      product_id: li.productId,
      quantity: li.quantity,
      meta_data: [{ key: "pa_size", value: li.size }],
    })),
    shipping_lines: [
      {
        method_id: shippingTotal === 0 ? "free_shipping" : "flat_rate",
        method_title: shippingTotal === 0 ? "Free Shipping" : "Standard Shipping",
        total: shippingTotal.toFixed(2),
      },
    ],
    customer_note: payload.customerNote || "",
    meta_data: [
      { key: "_guest_checkout", value: "yes" },
      { key: "_estimated_delivery", value: siteConfig.policies.estimatedDelivery },
    ],
  };

  const raw = await wooFetch<unknown>("orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return mapWooOrder(raw);
}

export async function markOrderPaid(
  orderId: number | string,
  transactionId: string
): Promise<Order> {
  if (wooConfig.usePlaceholders) {
    const existing =
      mockOrders.get(String(orderId)) ||
      [...mockOrders.values()].find((o) => String(o.id) === String(orderId));
    if (!existing) throw new Error("Order not found");
    const updated: Order = {
      ...existing,
      status: "processing",
      transactionId,
      dateModified: new Date().toISOString(),
    };
    mockOrders.set(String(updated.id), updated);
    mockOrders.set(updated.orderNumber, updated);
    return updated;
  }

  const raw = await wooFetch<unknown>(`orders/${orderId}`, {
    method: "PUT",
    body: JSON.stringify({
      status: "processing",
      set_paid: true,
      transaction_id: transactionId,
    }),
  });
  return mapWooOrder(raw);
}

export async function trackOrder(req: TrackOrderRequest): Promise<TrackOrderResult> {
  const orderId = req.orderId.trim().replace(/^#/, "");
  const identity = req.emailOrPhone.trim().toLowerCase();

  if (wooConfig.usePlaceholders) {
    const order =
      mockOrders.get(orderId) ||
      [...mockOrders.values()].find(
        (o) => o.orderNumber.toLowerCase() === orderId.toLowerCase() || String(o.id) === orderId
      );

    if (!order) {
      return {
        found: false,
        message: "No order found. Check your Order ID and try again.",
      };
    }

    const emailMatch = order.billing.email.toLowerCase() === identity;
    const phoneDigits = order.billing.phone.replace(/\D/g, "").slice(-10);
    const inputDigits = identity.replace(/\D/g, "").slice(-10);
    const phoneMatch = phoneDigits && phoneDigits === inputDigits;

    if (!emailMatch && !phoneMatch) {
      return {
        found: false,
        message: "Order ID and email/phone do not match.",
      };
    }

    return {
      found: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        dateCreated: order.dateCreated,
        estimatedDelivery: order.estimatedDelivery,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        lineItems: order.lineItems,
      },
    };
  }

  try {
    // Search by order number / id
    let raw: any = null;
    if (/^\d+$/.test(orderId)) {
      try {
        raw = await wooFetch(`orders/${orderId}`);
      } catch {
        raw = null;
      }
    }
    if (!raw) {
      const list = await wooFetch<any[]>(`orders?search=${encodeURIComponent(orderId)}&per_page=5`);
      raw = list.find(
        (o) => String(o.number) === orderId || String(o.id) === orderId
      );
    }

    if (!raw) {
      return { found: false, message: "No order found with that ID." };
    }

    const order = mapWooOrder(raw);
    const emailMatch = order.billing.email.toLowerCase() === identity;
    const phoneDigits = order.billing.phone.replace(/\D/g, "").slice(-10);
    const inputDigits = identity.replace(/\D/g, "").slice(-10);
    const phoneMatch = phoneDigits && phoneDigits === inputDigits;

    if (!emailMatch && !phoneMatch) {
      return { found: false, message: "Order ID and email/phone do not match." };
    }

    return {
      found: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        dateCreated: order.dateCreated,
        estimatedDelivery: order.estimatedDelivery,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        lineItems: order.lineItems,
      },
    };
  } catch (err) {
    console.error("[orders] trackOrder failed:", err);
    return { found: false, message: "Unable to look up order right now. Please try again." };
  }
}

export async function getOrderById(id: number): Promise<Order | null> {
  if (wooConfig.usePlaceholders) {
    return mockOrders.get(String(id)) || null;
  }
  try {
    const raw = await wooFetch(`orders/${id}`);
    return mapWooOrder(raw);
  } catch {
    return null;
  }
}
