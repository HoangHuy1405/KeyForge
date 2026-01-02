/**
 * useHomeProducts hook
 * Fetches products for the homepage with pagination support
 */
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../services/ProductService';
import {
  ProductListResponse,
  ProductSummaryResponse,
} from '../../services/interfaces/productTypes';
import { ProductView } from '../../features/Product/ProductListingPage/ProductCard';

/**
 * Maps a ProductSummaryResponse to the UI ProductView
 */
export function mapProductSummaryToView(p: ProductSummaryResponse): ProductView {
  return {
    id: p.id,
    name: p.name,
    price: typeof p.price === 'string' ? parseFloat(p.price) : (p.price ?? 0),
    originalPrice: undefined,
    rating: 0, // API doesn't provide rating yet
    reviewCount: 0,
    image: p.thumbnailUrl || '',
    location: p.location || '',
    category: p.category,
    brand: (p.attributes?.brand as string) || '',
    sales: 0, // API doesn't provide sales count
    dateAdded: p.createdAt || new Date().toISOString(),
  };
}

/**
 * Maps ProductListResponse to ProductView array
 */
export function mapProductListResponseToViews(
  response: ProductListResponse
): ProductView[] {
  return (response.result ?? []).map(mapProductSummaryToView);
}

interface UseHomeProductsOptions {
  size?: number;
  enabled?: boolean;
}

interface UseHomeProductsResult {
  products: ProductView[];
  totalProducts: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: () => void;
}

/**
 * Hook to fetch products for the homepage
 */
export function useHomeProducts(
  options: UseHomeProductsOptions = {}
): UseHomeProductsResult {
  const { size = 50, enabled = true } = options;

  const { data, isLoading, isError, error, isFetching, refetch } = useQuery<
    ProductListResponse,
    Error
  >({
    queryKey: ['homepage-products', size],
    queryFn: async () => {
      return await getProducts({
        size,
        sort: [{ field: 'createdAt', direction: 'desc' }],
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled,
  });

  const products = data ? mapProductListResponseToViews(data) : [];
  const totalProducts = data?.meta.total ?? 0;

  return {
    products,
    totalProducts,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  };
}
