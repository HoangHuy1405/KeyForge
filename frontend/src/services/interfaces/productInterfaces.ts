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

export type Category = 'ELECTRONICS' | 'FURNITURE' | string;
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
  condition: Condition;
}
export type Condition = 'NEW' | 'REFURBISHED' | 'USED' | string;
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
