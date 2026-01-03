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

// Analytics types
export interface DailyRevenue {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  revenueChart: DailyRevenue[];
}

/**
 * Get analytics summary for the current seller
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const response = await api.get<AnalyticsSummary>('seller/analytics/summary');
  return response;
}
