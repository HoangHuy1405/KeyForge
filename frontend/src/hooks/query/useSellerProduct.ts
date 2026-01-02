/**
 * Hook to fetch product data for seller editing
 */
import { useQuery } from '@tanstack/react-query';
import { getProductForSeller } from '../../services/ProductService';
import type { ProductFullResponse } from '../../services/interfaces/productTypes';

export function useSellerProduct(productId: string | undefined) {
  return useQuery<ProductFullResponse, Error>({
    queryKey: ['seller-product', productId],
    queryFn: () => getProductForSeller(productId!),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
