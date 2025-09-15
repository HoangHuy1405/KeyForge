// src/services/SellerService.ts

import api from './api';

export interface SellerStartRequest {
  storeName: string;
  email: string;
  phoneNum: string;
  address: string;
  userId: string; // UUID string
}

export interface SellerShippingRequest {
  express?: boolean;
  standard?: boolean;
  economy?: boolean;
}

export interface SellerCreateResponse {
  sellerId: string;
  storeName: string;
  email: string;
  phoneNum: string;
  address: string;
  shippingConfigured?: boolean;
}
export async function startRegistration(data: SellerStartRequest) {
  return await api.post<SellerCreateResponse>('/api/sellers', data);
}
export async function configureShipping(
  sellerId: string,
  data: SellerShippingRequest,
) {
  return await api.post<SellerCreateResponse>(
    `/api/sellers/${sellerId}/shipping`,
    data,
  );
}
