/**
 * Product Media Service - API calls for image uploads
 */
import api from './api';
import type { ProductMediaResponse } from './interfaces/productTypes';

const BASE = '/products';

// ===== Thumbnail =====
export async function uploadThumbnail(
  productId: string,
  file: File,
): Promise<ProductMediaResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return await api.post<ProductMediaResponse>(
    `${BASE}/${productId}/media/thumbnail`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
}

export async function updateThumbnail(
  productId: string,
  file: File,
): Promise<ProductMediaResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return await api.put<ProductMediaResponse>(
    `${BASE}/${productId}/media/thumbnail`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
}

export async function deleteThumbnail(productId: string): Promise<ProductMediaResponse> {
  return await api.delete<ProductMediaResponse>(`${BASE}/${productId}/media/thumbnail`);
}

// ===== Gallery =====
export async function uploadGallery(
  productId: string,
  files: File[],
): Promise<ProductMediaResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  return await api.post<ProductMediaResponse>(
    `${BASE}/${productId}/media/gallery`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
}

export async function updateGalleryImage(
  productId: string,
  imageId: string,
  file: File,
): Promise<ProductMediaResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return await api.put<ProductMediaResponse>(
    `${BASE}/${productId}/media/gallery/${imageId}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
}

export async function deleteGalleryImage(
  productId: string,
  imageId: string,
): Promise<ProductMediaResponse> {
  return await api.delete<ProductMediaResponse>(
    `${BASE}/${productId}/media/gallery/${imageId}`,
  );
}
