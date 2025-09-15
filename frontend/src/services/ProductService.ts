import api from './api';
import { GetListParams } from './interfaces/paramsType';
import {
  CreateProductRequest,
  ProductBasicResponse,
  UpdateDetailsRequest,
  ProductDetailedResponse,
  UpdateInventoryRequest,
  ProductInventoryResponse,
  UpdateLogisticsRequest,
  ProductLogisticsResponse,
  ProductList,
  UpdateBasicRequest,
  ProductDetailsView,
} from './interfaces/productInterfaces';

const BASE = 'api/products';

const DEFAULT_CURR_PAGE = 0;
const DEFAULT_PAGE_SIZE = 18;

export async function getProducts(params: GetListParams): Promise<ProductList> {
  const searchParams = new URLSearchParams();

  searchParams.append(
    'size',
    params.size ? String(params.size) : DEFAULT_PAGE_SIZE.toString(),
  );
  searchParams.append(
    'page',
    params.page ? String(params.page) : DEFAULT_CURR_PAGE.toString(),
  );
  if (params.sort) {
    params.sort.forEach(({ field, direction }) => {
      searchParams.append('sort', `${field},${direction}`);
    });
  }
  if (params.filters) {
    searchParams.append('filter', params.filters);
  }
  console.log(searchParams.toString());
  console.log(`${BASE}?${searchParams.toString()}`);
  const data = await api.get<ProductList>(`${BASE}?${searchParams.toString()}`);
  return data;
}

export async function getProduct(id: string): Promise<ProductDetailsView> {
  const data = await api.get<ProductDetailsView>(`${BASE}/${id}`);
  return data;
}

export async function createProduct(
  payload: CreateProductRequest,
): Promise<ProductBasicResponse> {
  return await api.post<ProductBasicResponse>(`${BASE}`, payload);
}

export async function updateBasicProduct(
  payload: UpdateBasicRequest,
  productId: string,
  sellerId: string,
) {
  return await api.put<ProductBasicResponse>(
    `${BASE}/${productId}/basic?sellerId=${sellerId}`,
    payload,
  );
}

export async function updateDetailsProduct(
  payload: UpdateDetailsRequest,
  productId: string,
  sellerId: string,
) {
  return await api.put<ProductDetailedResponse>(
    `${BASE}/${productId}/details?sellerId=${sellerId}`,
    payload,
  );
}

export async function updateInventoryProduct(
  payload: UpdateInventoryRequest,
  productId: string,
  sellerId: string,
) {
  return await api.put<ProductInventoryResponse>(
    `${BASE}/${productId}/inventory?sellerId=${sellerId}`,
    payload,
  );
}

export async function updateLogisticProduct(
  payload: UpdateLogisticsRequest,
  productId: string,
  sellerId: string,
) {
  return await api.put<ProductLogisticsResponse>(
    `${BASE}/${productId}/logistics?sellerId=${sellerId}`,
    payload,
  );
}

export async function getProductsBySeller(
  params: GetListParams,
  sellerId: string,
) {
  const searchParams = new URLSearchParams();

  if (params.size !== undefined)
    searchParams.append('size', String(params.size));
  if (params.page !== undefined)
    searchParams.append('page', String(params.page));
  if (params.sort) {
    params.sort.forEach(({ field, direction }) => {
      searchParams.append('sort', `${field},${direction}`);
    });
  }
  if (params.filters) {
    searchParams.append('filter', params.filters);
  }
  console.log(searchParams.toString());
  return await api.get(
    `${BASE}/by-seller/${sellerId}?${searchParams.toString()}`,
  );
}
