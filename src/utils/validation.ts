/**
 * Zod schemas for checkout, track order, newsletter — server & client safe.
 */

import { z } from "zod";
import { sizes } from "@/constants/brand";

const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const pinRegex = /^[1-9][0-9]{5}$/;

/** Sanitizes string input to strip HTML tags, script elements, and dangerous characters to prevent XSS / payload injection */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>?/gm, "")
    .replace(/[<>'"]/g, "")
    .trim();
}

export const shippingAddressSchema = z.object({
  firstName: z.string().transform(sanitizeInput).pipe(z.string().min(1, "First name is required").max(50)),
  lastName: z.string().transform(sanitizeInput).pipe(z.string().min(1, "Last name is required").max(50)),
  email: z.string().transform(sanitizeInput).pipe(z.string().email("Enter a valid email")),
  phone: z.string().transform(sanitizeInput).pipe(z.string().regex(phoneRegex, "Enter a valid 10-digit Indian mobile number")),
  address1: z.string().transform(sanitizeInput).pipe(z.string().min(5, "Address is required").max(200)),
  address2: z.string().optional().transform((v) => sanitizeInput(v || "")),
  city: z.string().transform(sanitizeInput).pipe(z.string().min(2, "City is required").max(80)),
  state: z.string().transform(sanitizeInput).pipe(z.string().min(2, "State is required").max(80)),
  postcode: z.string().transform(sanitizeInput).pipe(z.string().regex(pinRegex, "Enter a valid 6-digit PIN code")),
  country: z.string().optional().transform((v) => sanitizeInput(v || "IN")),
});

export const checkoutSchema = shippingAddressSchema.extend({
  notes: z.string().optional().transform((v) => sanitizeInput(v || "")),
  acceptPolicies: z.boolean().refine((val) => val === true, {
    message: "Please accept the order policies to continue",
  }),
});

export const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  image: z.string(),
  size: z.enum(sizes.numeric),
  quantity: z.number().int().min(1).max(10),
  fabric: z.string().optional(),
});

export const createOrderSchema = z.object({
  billing: shippingAddressSchema,
  shipping: shippingAddressSchema,
  lineItems: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(10),
        size: z.enum(sizes.numeric),
      })
    )
    .min(1, "Cart is empty"),
  customerNote: z.string().max(500).optional(),
  paymentMethod: z.literal("razorpay"),
});

export const trackOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required").max(32),
  emailOrPhone: z
    .string()
    .min(5, "Email or phone is required")
    .refine(
      (v) => z.string().email().safeParse(v).success || phoneRegex.test(v),
      "Enter a valid email or phone number"
    ),
});

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const razorpayVerifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  wooOrderId: z.union([z.number().int().positive(), z.string().min(1)]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type TrackOrderInput = z.infer<typeof trackOrderSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
