/**
 * Product domain types — aligned with WooCommerce REST shape,
 * normalized for the storefront.
 */

export type ProductSize = "32" | "34" | "36" | "38" | "40" | "42" | "44";

export type StockStatus = "instock" | "outofstock" | "onbackorder";

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
  name?: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  count?: number;
  parent?: number;
}

export interface ProductAttribute {
  id: number;
  name: string;
  slug: string;
  options: string[];
  visible?: boolean;
  variation?: boolean;
}

export interface SizeStock {
  size: ProductSize;
  stockQuantity: number | null;
  stockStatus: StockStatus;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  regularPrice: number;
  salePrice: number | null;
  onSale: boolean;
  sku: string;
  stockStatus: StockStatus;
  stockQuantity: number | null;
  images: ProductImage[];
  categories: ProductCategory[];
  attributes: ProductAttribute[];
  sizes: ProductSize[];
  sizeStock?: SizeStock[];
  fabric: string;
  tags: string[];
  featured: boolean;
  averageRating: number;
  reviewCount: number;
  estimatedDelivery: string;
  codAvailable: boolean;
  returnsAllowed: boolean;
  damagedSupport: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: ProductSize[];
  fabric?: string[];
  availability?: "instock" | "outofstock" | "all";
  search?: string;
  featured?: boolean;
  onSale?: boolean;
  orderby?: "date" | "price" | "popularity" | "rating" | "title";
  order?: "asc" | "desc";
  page?: number;
  perPage?: number;
}

export interface ProductListResult {
  products: Product[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: ProductSize;
  quantity: number;
  fabric?: string;
  maxQuantity?: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
