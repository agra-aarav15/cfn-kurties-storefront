/**
 * Razorpay payment configuration
 * Key ID is public; secret stays server-side only.
 */

export const razorpayConfig = {
  keyId:
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID ||
    "rzp_test_1DP5mmOlF5G5ag",
  keySecret: process.env.RAZORPAY_KEY_SECRET || "",
  currency: "INR",
  companyName: "CFN Kurties",
  themeColor: "#1a1a1a",
  mockMode: false,
} as const;
