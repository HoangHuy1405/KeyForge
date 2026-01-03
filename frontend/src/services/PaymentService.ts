import api from './api';
import { CreateOrderRequest } from './OrderService';

// ============ VNPay Types ============

export interface VnPayCheckoutResponse {
  orderId: string;
  paymentUrl: string;
  vnpTxnRef: string;
}

export interface OrderPaymentResponse {
  orderId: string;
  amountUsd: number;
  amountVnd: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  exchangeRate: number;
  message: string;
}

// ============ API Functions ============

const BASE = '/payments';

/**
 * Create VNPay checkout - creates order and returns payment URL
 * User should be redirected to the paymentUrl
 */
export const createVnPayCheckout = async (
  orderRequest: CreateOrderRequest
): Promise<VnPayCheckoutResponse> => {
  return api.post<VnPayCheckoutResponse>(`${BASE}/checkout/vnpay`, orderRequest);
};

/**
 * Get payment status after VNPay callback
 * This is typically called by the return page to verify payment
 */
export const getPaymentStatus = async (
  params: Record<string, string>
): Promise<OrderPaymentResponse> => {
  const queryString = new URLSearchParams(params).toString();
  return api.get<OrderPaymentResponse>(`${BASE}/vnpay-return?${queryString}`);
};
