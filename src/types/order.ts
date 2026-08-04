/**
 * Order & checkout types for guest checkout + Razorpay flow.
 */

import type { CartItem, ProductSize } from "./product";

export type OrderStatus =
  | "pending"
  | "processing"
  | "on-hold"
  | "completed"
  | "cancelled"
  | "refunded"
  | "failed"
  | "shipped";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface CheckoutFormData extends ShippingAddress {
  notes?: string;
  acceptPolicies: boolean;
}

export interface OrderLineItem {
  productId: number;
  name: string;
  quantity: number;
  price: number;
  size: ProductSize;
  image?: string;
  total: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  currency: string;
  total: number;
  subtotal: number;
  shippingTotal: number;
  discountTotal: number;
  paymentMethod: string;
  paymentMethodTitle: string;
  transactionId?: string;
  billing: ShippingAddress;
  shipping: ShippingAddress;
  lineItems: OrderLineItem[];
  customerNote?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  dateCreated: string;
  dateModified: string;
  estimatedDelivery: string;
}

export interface CreateOrderPayload {
  billing: ShippingAddress;
  shipping: ShippingAddress;
  lineItems: Array<{
    productId: number;
    quantity: number;
    size: ProductSize;
  }>;
  customerNote?: string;
  paymentMethod: "razorpay";
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface RazorpayVerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  wooOrderId: number | string;
}

export interface TrackOrderRequest {
  orderId: string;
  emailOrPhone: string;
}

export interface TrackOrderResult {
  found: boolean;
  order?: Pick<
    Order,
    | "id"
    | "orderNumber"
    | "status"
    | "total"
    | "dateCreated"
    | "estimatedDelivery"
    | "trackingNumber"
    | "trackingUrl"
    | "lineItems"
  >;
  message?: string;
}

export type CheckoutCartSnapshot = CartItem[];
