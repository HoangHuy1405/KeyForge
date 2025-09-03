export interface ProductList {
  meta: Meta;
  result: Product[];
}

export interface Meta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface Product {
  id: string;
  name: string;
  thumbnailUrl: string;
  category: Category;
  status: ProductStatus;
  details: ProductDetails;
  logistic: {
    location: string;
  };
  inventory: {
    price: number;
  };
  availableQuantity: number;
}
export type ProductStatus =
  | 'ACTIVE'
  | 'DRAFT'
  | 'SOLD_OUT'
  | 'REMOVED'
  | string;

export interface ProductDetails {
  brand: string;
  model: string;
  size: string;
  material: string;
  origin: string; // e.g., "VN", "KR"
  condition: ProductCondition;
}
// export type Condition = 'NEW' | 'REFURBISHED' | 'USED' | string;
export interface Logistic {
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  location: string; // e.g., "HCMC-DC1"
  preOrder: boolean;
  shipping: {
    fast: boolean;
    regular: boolean;
    economy: boolean;
  };
}
export interface Inventory {
  price: number;
  availableQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity: number;
}
export type ProductImage = {
  id: string;
  url: string;
  sortOrder: number;
};
export type SellerInfo = {
  id: string;
  username: string;
  email: string;
  phoneNum: string;
  avatarUrl: string;
};
export type ProductDetailsView = {
  id: string;
  name: string;
  description: string;
  category: Category;
  status: ProductStatus;
  thumbnailUrl: string;
  images: ProductImage[];
  details: ProductDetails;
  inventory: Inventory;
  logistics: Logistic;
  seller: SellerInfo;
};

// Category enum dạng string enum
export enum Category {
  FASHION = 'Fashion',
  JEWELRY = 'Jewelry',
  WATCHES = 'Watches',

  ELECTRONICS = 'Electronics',
  PHONES = 'Phones',
  LAPTOPS = 'Laptops',
  TABLETS = 'Tablets',
  CAMERAS = 'Cameras',
  ACCESSORIES = 'Accessories',

  FURNITURE = 'Furniture',
  HOME_APPLIANCES = 'Home Appliances',
  KITCHEN = 'Kitchen',
  DECOR = 'Decor',

  BEAUTY = 'Beauty',
  COSMETICS = 'Cosmetics',
  SKINCARE = 'Skincare',
  HAIRCARE = 'Haircare',
  SUPPLEMENTS = 'Supplements',

  BOOKS = 'Books',
  TOYS = 'Toys',
  SPORTS = 'Sports',
  AUTOMOTIVE = 'Automotive',
  PET = 'Pet',

  FOOD = 'Food',
}

export const ProductCategoryOptions = Object.values(Category).map((value) => ({
  value,
  label: value,
}));

export interface CreateProductRequest {
  name: string;
  description?: string;
  category: Category;
  sellerId: string;
}

export interface UpdateBasicRequest {
  name: string;
  description?: string;
  category: Category;
}

export interface ProductBasicResponse {
  id: string;
  name: string;
  description: string;
  category: Category;
  status: ProductStatus;
}

export interface UpdateDetailsRequest {
  brand?: string;
  model?: string;
  size?: string;
  material?: string;
  origin?: string;
  condition: ProductCondition;
}

export interface ProductDetailedResponse {
  brand?: string;
  model?: string;
  size?: string;
  material?: string;
  origin?: string;
  condition?: ProductCondition;
}
export interface UpdateLogisticsRequest {
  weightGrams?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  location?: string;
  preOrder?: boolean;
  preOrderLeadTimeDays?: number;
  supportFastShipping?: boolean;
  supportRegularShipping?: boolean;
  supportEconomyShipping?: boolean;
}

export interface ProductLogisticsResponse {
  weightGrams?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  location?: string;
  preOrder?: boolean;
  preOrderLeadTimeDays?: number;
  shipping?: ShippingOptionsResponse;
}

interface ShippingOptionsResponse {
  fast?: boolean;
  regular?: boolean;
  economy?: boolean;
}
//

export enum ProductCondition {
  NEW = 'New',
  USED = 'Used',
  REFURBISHED = 'Refurbished',
}

export interface UpdateInventoryRequest {
  price: number;
  stockQuantity: number;
  reservedQuantity: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
}

export interface ProductInventoryResponse {
  price?: number;
  stockQuantity?: number;
  reservedQuantity?: number;
  availableQuantity?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
}
