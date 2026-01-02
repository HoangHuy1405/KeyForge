/**
 * Product Service - API calls for product management
 * Uses new productTypes aligned with backend DTOs
 */
import api from './api';
import type { GetListParams } from './interfaces/paramsType';
import type {
  CreateProductRequest,
  UpdateInventoryRequest,
  UpdateLogisticsRequest,
  UpdateProductRequest,
  ProductBasicResponse,
  InventoryResponse,
  LogisticsResponse,
  ProductFullResponse,
  ProductViewerResponse,
  ProductListResponse,
  ProductMediaResponse,
} from './interfaces/productTypes';

const BASE = '/products';

// ===== Step 1: Create Product (DRAFT) =====
export async function createProduct(
  payload: CreateProductRequest,
): Promise<ProductBasicResponse> {
  return await api.post<ProductBasicResponse>(BASE, payload);
}

// ===== Step 2: Update Inventory =====
export async function updateInventory(
  productId: string,
  payload: UpdateInventoryRequest,
): Promise<InventoryResponse> {
  return await api.put<InventoryResponse>(`${BASE}/${productId}/inventory`, payload);
}

// ===== Step 3: Update Logistics =====
export async function updateLogistics(
  productId: string,
  payload: UpdateLogisticsRequest,
): Promise<LogisticsResponse> {
  return await api.put<LogisticsResponse>(`${BASE}/${productId}/logistics`, payload);
}

// ===== General Update =====
export async function updateProduct(
  productId: string,
  payload: UpdateProductRequest,
): Promise<ProductFullResponse> {
  return await api.put<ProductFullResponse>(`${BASE}/${productId}`, payload);
}

// ===== Status Management =====
export async function changeProductStatus(
  productId: string,
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE',
): Promise<ProductBasicResponse> {
  return await api.put<ProductBasicResponse>(`${BASE}/${productId}/status?status=${status}`);
}

// ===== Read Operations =====
export async function getProductForSeller(productId: string): Promise<ProductFullResponse> {
  return await api.get<ProductFullResponse>(`${BASE}/${productId}/seller`);
}

export async function getProductsBySeller(params: GetListParams): Promise<ProductListResponse> {
  const searchParams = new URLSearchParams();

  if (params.size !== undefined) searchParams.append('size', String(params.size));
  if (params.page !== undefined) searchParams.append('page', String(params.page));
  if (params.sort) {
    params.sort.forEach(({ field, direction }) => {
      searchParams.append('sort', `${field},${direction}`);
    });
  }
  if (params.filters) {
    searchParams.append('filter', params.filters);
  }

  return await api.get<ProductListResponse>(`${BASE}/by-seller?${searchParams.toString()}`);
}

// ===== Public APIs =====
export async function getProducts(params: GetListParams): Promise<ProductListResponse> {
  const searchParams = new URLSearchParams();

  searchParams.append('size', params.size ? String(params.size) : '18');
  searchParams.append('page', params.page ? String(params.page) : '0');

  if (params.sort) {
    params.sort.forEach(({ field, direction }) => {
      searchParams.append('sort', `${field},${direction}`);
    });
  }
  if (params.filters) {
    searchParams.append('filter', params.filters);
  }

  return await api.get<ProductListResponse>(`${BASE}?${searchParams.toString()}`);
}

export async function getProduct(id: string): Promise<ProductViewerResponse> {
  return await api.get<ProductViewerResponse>(`${BASE}/${id}`);
}

// ===== Delete =====
export async function deleteProduct(productId: string): Promise<void> {
  await api.delete(`${BASE}/${productId}`);
}

// ===== Media Management =====
export async function getProductMedia(productId: string): Promise<ProductMediaResponse> {
  return await api.get<ProductMediaResponse>(`${BASE}/${productId}/media`);
}

export async function deleteThumbnail(productId: string): Promise<ProductMediaResponse> {
  return await api.delete<ProductMediaResponse>(`${BASE}/${productId}/media/thumbnail`);
}

export async function deleteGalleryImage(
  productId: string,
  imageId: string,
): Promise<ProductMediaResponse> {
  return await api.delete<ProductMediaResponse>(`${BASE}/${productId}/media/gallery/${imageId}`);
}
