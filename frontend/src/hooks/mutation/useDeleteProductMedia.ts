/**
 * Mutations for deleting product media (thumbnail and gallery images)
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteThumbnail, deleteGalleryImage } from '../../services/ProductService';
import type { ProductMediaResponse } from '../../services/interfaces/productTypes';

/**
 * Hook to delete product thumbnail
 */
export function useDeleteThumbnail() {
  const queryClient = useQueryClient();

  return useMutation<ProductMediaResponse, Error, { productId: string }>({
    mutationFn: ({ productId }) => deleteThumbnail(productId),
    onSuccess: (_, { productId }) => {
      // Invalidate product queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['seller-product', productId] });
    },
  });
}

/**
 * Hook to delete a gallery image
 */
export function useDeleteGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation<
    ProductMediaResponse,
    Error,
    { productId: string; imageId: string }
  >({
    mutationFn: ({ productId, imageId }) => deleteGalleryImage(productId, imageId),
    onSuccess: (_, { productId }) => {
      // Invalidate product queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['seller-product', productId] });
    },
  });
}
