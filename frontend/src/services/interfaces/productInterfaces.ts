/**
 * Product Interfaces - Aligned with Backend DTOs
 * KeyForge Mechanical Keyboard Marketplace
 * 
 * NOTE: This file contains legacy interfaces for backward compatibility.
 * For new code, prefer using interfaces from productTypes.ts
 */

// ===== PAGINATION =====
export interface Meta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

// ===== ENUMS =====
export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'INACTIVE' | string;

// ===== PRODUCT INTERFACES =====

export interface ProductList {
  meta: Meta;
  result: Product[];
}

export interface Product {
  id: string;
  name: string;
  thumbnailUrl: string;
  category: string;
  stockStatus?: string;
  status: ProductStatus;
  attributes: Record<string, unknown>;
  location?: string;
  price?: number;
  availableQuantity?: number;
  createdAt?: string;
}

export type ProductImage = {
  id: string;
  url: string;
  publicId?: string;
  version?: number;
  sortOrder: number;
};

export type SellerInfo = {
  id: string;
  username: string;
  email: string;
  phoneNum: string | null;
  avatarUrl: string | null;
};

export interface Inventory {
  price: number | null;
  stockQuantity?: number | null;
  reservedQuantity?: number | null;
  availableQuantity: number | null;
  minOrderQuantity: number | null;
  maxOrderQuantity: number | null;
}

export interface ShippingOptions {
  fast?: boolean | null;
  regular?: boolean | null;
  economy?: boolean | null;
}

export interface Logistic {
  location: string | null;
  shipping?: ShippingOptions | null;
}

// ProductDetailsView - Used for product detail pages
export type ProductDetailsView = {
  id: string;
  name: string;
  description: string;
  category: string;
  stockStatus?: string;
  status: ProductStatus;
  thumbnailUrl: string | null;
  images: ProductImage[];
  attributes: Record<string, unknown>;
  inventory: Inventory | null;
  logistics: Logistic | null;
  seller: SellerInfo;
};
