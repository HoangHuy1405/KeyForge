import api from './api';

// ============ Types ============

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  VNPAY = 'VNPAY',
  PAYPAL = 'PAYPAL',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum ShippingMethod {
  EXPRESS = 'EXPRESS',
  STANDARD = 'STANDARD',
  ECONOMY = 'ECONOMY',
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  buyerId: string;
  items: OrderItemRequest[];
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  receiverName: string;
  receiverPhone: string;
}

export interface OrderItemResponse {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  thumbnailUrl?: string | null;
}

export interface OrderResponse {
  orderId: string;
  buyerId: string;
  buyerName?: string;
  shippingAddress: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  items: OrderItemResponse[];
}

// Order List Item for My Orders page
export interface OrderListItemDto {
  orderId: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItemResponse[];
}

// Order Detail with timeline timestamps
export interface OrderDetailResponseDto {
  orderId: string;
  buyerId: string;
  buyerName?: string;
  shippingAddress: string;
  receiverName: string;
  receiverPhone: string;
  totalAmount: number;
  shippingFee: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  items: OrderItemResponse[];
  // Timeline timestamps
  createdAt: string;
  processingAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

// API Response Wrapper
export interface ApiResponse<T> {
  status: string;
  errorCode?: string;
  timestamp: string;
  message: string;
  data: T;
  statusCode: number;
}

// Pagination Types
export interface Meta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface ResultPaginationDTO {
  meta: Meta;
  result: OrderListItemDto[];
}

// ============ API Functions ============

const BASE = '/orders';

/**
 * Create a new order
 */
export const createOrder = async (request: CreateOrderRequest): Promise<OrderResponse> => {
  return api.post<OrderResponse>(BASE, request);
};

// Map OrderResponseDto (backend name) to OrderResponse (frontend name) to avoid confusion if needed, 
// for now I'll stick to OrderResponse as defined above but update the return type to match what we use.
// Looking at backend DTOs: OrderResponseDto maps to OrderResponse here.

/**
 * Get order by ID
 */
export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  return api.get<OrderResponse>(`${BASE}/${orderId}`);
};

/**
 * Cancel an order
 */
export const cancelOrder = async (orderId: string): Promise<OrderResponse> => {
  return api.patch<OrderResponse>(`${BASE}/${orderId}/cancel`, {});
};

/**
 * Pay for an order
 */
export const payOrder = async (orderId: string): Promise<OrderResponse> => {
  return api.patch<OrderResponse>(`${BASE}/${orderId}/pay`, {});
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: string, 
  status: OrderStatus
): Promise<OrderResponse> => {
  return api.patch<OrderResponse>(`${BASE}/${orderId}/order-status`, { status });
};

/**
 * Get current user's orders with pagination
 */
export const getMyOrders = async (
  page: number = 0,
  size: number = 5,
  status?: OrderStatus
): Promise<ResultPaginationDTO> => {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('size', String(size));
  if (status) {
    params.append('status', status);
  }
  return api.get<ResultPaginationDTO>(`${BASE}/my-orders?${params.toString()}`);
};

/**
 * Get order detail with timeline
 */
export const getOrderDetail = async (orderId: string): Promise<OrderDetailResponseDto> => {
  return api.get<OrderDetailResponseDto>(`${BASE}/${orderId}`);
};

/**
 * Get seller's orders with pagination
 */
export const getSellerOrders = async (
  page: number = 0,
  size: number = 10
): Promise<ResultPaginationDTO> => {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('size', String(size));
  return api.get<ResultPaginationDTO>(`${BASE}/seller-orders?${params.toString()}`);
};
