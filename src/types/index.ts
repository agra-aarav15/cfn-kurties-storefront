/**
 * Barrel export for shared TypeScript types.
 */

export * from "./product";
export * from "./order";

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  date: string;
  verified: boolean;
  productName?: string;
}

export interface NewsletterPayload {
  email: string;
}

export interface NavItem {
  href: string;
  label: string;
  children?: NavItem[];
}
