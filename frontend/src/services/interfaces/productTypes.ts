/**
 * Product Types - Aligned with Backend DTOs
 * KeyForge Mechanical Keyboard Marketplace
 */

// ===== ENUMS =====

export enum ProductCategory {
  KEYBOARD_KIT = 'KEYBOARD_KIT',
  SWITCH = 'SWITCH',
  KEYCAP = 'KEYCAP',
  STABILIZER = 'STABILIZER',
  PCB = 'PCB',
  PLATE = 'PLATE',
  CASE = 'CASE',
  ACCESSORY = 'ACCESSORY',
}

export const ProductCategoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.KEYBOARD_KIT]: 'Keyboard Kit',
  [ProductCategory.SWITCH]: 'Switch',
  [ProductCategory.KEYCAP]: 'Keycap Set',
  [ProductCategory.STABILIZER]: 'Stabilizer',
  [ProductCategory.PCB]: 'PCB Board',
  [ProductCategory.PLATE]: 'Plate',
  [ProductCategory.CASE]: 'Case',
  [ProductCategory.ACCESSORY]: 'Accessory',
};

export enum ProductCondition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  FOR_PARTS = 'FOR_PARTS',
}

export const ProductConditionLabels: Record<ProductCondition, string> = {
  [ProductCondition.NEW]: 'New',
  [ProductCondition.LIKE_NEW]: 'Like New',
  [ProductCondition.GOOD]: 'Good',
  [ProductCondition.FAIR]: 'Fair',
  [ProductCondition.FOR_PARTS]: 'For Parts',
};

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  PRE_ORDER = 'PRE_ORDER',
  GROUP_BUY = 'GROUP_BUY',
  INTEREST_CHECK = 'INTEREST_CHECK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export const StockStatusLabels: Record<StockStatus, string> = {
  [StockStatus.IN_STOCK]: 'In Stock',
  [StockStatus.PRE_ORDER]: 'Pre-Order',
  [StockStatus.GROUP_BUY]: 'Group Buy',
  [StockStatus.INTEREST_CHECK]: 'Interest Check',
  [StockStatus.OUT_OF_STOCK]: 'Out of Stock',
};

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// ===== REQUEST DTOs =====

export interface CreateProductRequest {
  name: string;
  description?: string;
  category: ProductCategory;
  productCondition: ProductCondition;
  stockStatus: StockStatus;
  attributes: Record<string, unknown>;
}

export interface UpdateInventoryRequest {
  price: string; // BigDecimal as string
  stockQuantity: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
}

export interface UpdateLogisticsRequest {
  location?: string;
  supportFastShipping?: boolean;
  supportRegularShipping?: boolean;
  supportEconomyShipping?: boolean;
}

export interface UpdateProductRequest {
  name: string;
  description?: string;
  category: ProductCategory;
  stockStatus: StockStatus;
  price: string;
  stockQuantity: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  attributes: Record<string, unknown>;
  weightGrams?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  location?: string;
  supportFastShipping?: boolean;
  supportRegularShipping?: boolean;
  supportEconomyShipping?: boolean;
}

// ===== RESPONSE DTOs =====

export interface ProductBasicResponse {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  stockStatus: StockStatus;
  status: ProductStatus;
  price: string | null;
  stockQuantity: number | null;
  attributes: Record<string, unknown>;
}

export interface InventoryResponse {
  price: string | null;
  stockQuantity: number | null;
  reservedQuantity: number | null;
  availableQuantity: number | null;
  minOrderQuantity: number | null;
  maxOrderQuantity: number | null;
}

export interface ShippingOptionsResponse {
  fast: boolean | null;
  regular: boolean | null;
  economy: boolean | null;
}

export interface LogisticsResponse {
  weightGrams: number | null;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  location: string | null;
  shipping: ShippingOptionsResponse | null;
}

export interface ProductImageDto {
  id: string;
  url: string;
  publicId: string;
  version: number;
  sortOrder: number;
}

export interface ProductMediaResponse {
  thumbnailUrl: string | null;
  thumbnailPublicId: string | null;
  thumbnailVersion: number | null;
  images: ProductImageDto[];
}

export interface ProductFullResponse {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  stockStatus: StockStatus;
  status: ProductStatus;
  thumbnailUrl: string | null;
  images: ProductImageDto[];
  attributes: Record<string, unknown>;
  inventory: InventoryResponse | null;
  logistics: LogisticsResponse | null;
  createdAt: string;
  updatedAt: string;
}

export interface SellerInfo {
  id: string;
  username: string;
  email: string;
  phoneNum: string | null;
  avatarUrl: string | null;
}

export interface ProductViewerResponse {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  stockStatus: StockStatus;
  status: ProductStatus;
  thumbnailUrl: string | null;
  images: ProductImageDto[];
  attributes: Record<string, unknown>;
  inventory: InventoryResponse | null;
  logistics: LogisticsResponse | null;
  seller: SellerInfo;
}

export interface ProductSummaryResponse {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  category: ProductCategory;
  stockStatus: StockStatus;
  status: ProductStatus;
  price: string | null;
  availableQuantity: number | null;
  location: string | null;
  attributes: Record<string, unknown>;
  createdAt: string;
}

// ===== PAGINATION =====

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface ProductListResponse {
  meta: PaginationMeta;
  result: ProductSummaryResponse[];
}
