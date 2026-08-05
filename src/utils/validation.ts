/**
 * Strict Zod Schemas for Input Validation across API Routes & Components.
 *
 * Enforces strict types, strict length limits, strict regex/format rules,
 * and rejects any unexpected fields via .strict().
 */

import { z } from "zod";
import { sizes } from "@/constants/brand";

const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const pinRegex = /^[1-9][0-9]{5}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/** Sanitizes string input to strip HTML tags, script elements, and dangerous characters to prevent XSS / payload injection */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>?/gm, "")
    .replace(/[<>'"]/g, "")
    .trim();
}

/** Strict Shipping Address Schema — rejects unknown keys */
export const shippingAddressSchema = z
  .object({
    firstName: z.string().transform(sanitizeInput).pipe(z.string().min(1, "First name is required").max(50)),
    lastName: z.string().transform(sanitizeInput).pipe(z.string().min(1, "Last name is required").max(50)),
    email: z.string().transform(sanitizeInput).pipe(z.string().email("Enter a valid email").max(100)),
    phone: z.string().transform(sanitizeInput).pipe(z.string().regex(phoneRegex, "Enter a valid 10-digit Indian mobile number")),
    address1: z.string().transform(sanitizeInput).pipe(z.string().min(5, "Address is required").max(200)),
    address2: z.string().optional().transform((v) => sanitizeInput(v || "")).pipe(z.string().max(200)),
    city: z.string().transform(sanitizeInput).pipe(z.string().min(2, "City is required").max(80)),
    state: z.string().transform(sanitizeInput).pipe(z.string().min(2, "State is required").max(80)),
    postcode: z.string().transform(sanitizeInput).pipe(z.string().regex(pinRegex, "Enter a valid 6-digit PIN code")),
    country: z.string().optional().transform((v) => sanitizeInput(v || "IN")).pipe(z.string().length(2)),
  })
  .strict();

/** Strict Checkout Input Schema */
export const checkoutSchema = shippingAddressSchema
  .extend({
    notes: z.string().optional().transform((v) => sanitizeInput(v || "")).pipe(z.string().max(500)),
    acceptPolicies: z.boolean().refine((val) => val === true, {
      message: "Please accept the order policies to continue",
    }),
  })
  .strict();

/** Strict Cart Item Schema */
export const cartItemSchema = z
  .object({
    productId: z.number().int().positive(),
    slug: z.string().min(1).max(100),
    name: z.string().min(1).max(150),
    price: z.number().positive(),
    image: z.string().min(1).max(500),
    size: z.enum(sizes.numeric),
    quantity: z.number().int().min(1).max(10),
    fabric: z.string().optional().pipe(z.string().max(50)),
  })
  .strict();

/** Strict Order Line Item Schema */
export const lineItemSchema = z
  .object({
    productId: z.number().int().positive(),
    quantity: z.number().int().min(1).max(10),
    size: z.enum(sizes.numeric),
  })
  .strict();

/** Strict Create Order API Schema */
export const createOrderSchema = z
  .object({
    billing: shippingAddressSchema,
    shipping: shippingAddressSchema,
    lineItems: z.array(lineItemSchema).min(1, "Cart is empty").max(50),
    customerNote: z.string().max(500).optional(),
    paymentMethod: z.literal("razorpay"),
  })
  .strict();

/** Strict Track Order Schema */
export const trackOrderSchema = z
  .object({
    orderId: z.string().min(1, "Order ID is required").max(32),
    emailOrPhone: z
      .string()
      .min(5, "Email or phone is required")
      .max(100)
      .refine(
        (v) => z.string().email().safeParse(v).success || phoneRegex.test(v),
        "Enter a valid email or phone number"
      ),
  })
  .strict();

/** Strict Newsletter Subscription Schema */
export const newsletterSchema = z
  .object({
    email: z.string().email("Enter a valid email address").max(100),
  })
  .strict();

/** Strict Razorpay Payment Verification Schema */
export const razorpayVerifySchema = z
  .object({
    razorpay_order_id: z.string().min(1).max(100),
    razorpay_payment_id: z.string().min(1).max(100),
    razorpay_signature: z.string().min(1).max(256),
    wooOrderId: z.union([z.number().int().positive(), z.string().min(1).max(50)]),
  })
  .strict();

/** Strict Auth Login Schema */
export const loginSchema = z
  .object({
    email: z.string().email("Enter a valid email address").max(100),
    password: z.string().min(8, "Password must be at least 8 characters").max(100),
  })
  .strict();

/** Strict Auth Signup Schema */
export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Enter a valid email address").max(100),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100)
      .regex(
        passwordRegex,
        "Password must contain uppercase, lowercase, number, and special character (@$!%*?&)"
      ),
  })
  .strict();

/** Strict Auth Reset Password Schema */
export const resetPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid email address").max(100),
  })
  .strict();

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type TrackOrderInput = z.infer<typeof trackOrderSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
