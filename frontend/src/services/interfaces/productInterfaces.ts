export interface ProductListResponse {
  meta: Meta;
  result: ProductResponse[];
}

export interface Meta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface ProductResponse {
  id: string;
  name: string;
  thumbnailUrl: string;
  category: Category;
  status: ProductStatus;
  details: ProductDetails;
  logistic: Logistic;
  inventory: Inventory;
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
  location: string; // e.g., "HCMC-DC1"
}

export interface Inventory {
  price: number;
}
