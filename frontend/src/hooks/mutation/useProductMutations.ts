/**
 * React Query Hooks for Product Operations
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as productService from '../../services/ProductService';
import * as mediaService from '../../services/ProductMediaService';
import type {
  CreateProductRequest,
  UpdateInventoryRequest,
  UpdateLogisticsRequest,
  ProductBasicResponse,
  InventoryResponse,
  LogisticsResponse,
  ProductMediaResponse,
} from '../../services/interfaces/productTypes';

// ===== QUERY KEYS =====
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  bySeller: (sellerId: string) => [...productKeys.all, 'seller', sellerId] as const,
};

// ===== QUERIES =====

export const useProductDetail = (productId: string) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: () => productService.getProductForSeller(productId),
    enabled: !!productId,
  });
};

// ===== MUTATIONS =====

/**
 * Step 1: Create a new product (DRAFT)
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ProductBasicResponse, Error, CreateProductRequest>({
    mutationFn: (data) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

/**
 * Step 2a: Upload thumbnail image
 */
export const useUploadThumbnail = () => {
  return useMutation<ProductMediaResponse, Error, { productId: string; file: File }>({
    mutationFn: ({ productId, file }) => mediaService.uploadThumbnail(productId, file),
  });
};

/**
 * Step 2b: Upload gallery images
 */
export const useUploadGallery = () => {
  return useMutation<ProductMediaResponse, Error, { productId: string; files: File[] }>({
    mutationFn: ({ productId, files }) => mediaService.uploadGallery(productId, files),
  });
};

/**
 * Step 3: Update inventory (pricing & stock)
 */
export const useUpdateInventory = () => {
  return useMutation<InventoryResponse, Error, { productId: string; data: UpdateInventoryRequest }>({
    mutationFn: ({ productId, data }) => productService.updateInventory(productId, data),
  });
};

/**
 * Step 4: Update logistics (shipping)
 */
export const useUpdateLogistics = () => {
  const queryClient = useQueryClient();

  return useMutation<LogisticsResponse, Error, { productId: string; data: UpdateLogisticsRequest }>({
    mutationFn: ({ productId, data }) => productService.updateLogistics(productId, data),
    onSuccess: () => {
      // Product is now ACTIVE, invalidate queries
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

/**
 * Delete product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (productId) => productService.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};
