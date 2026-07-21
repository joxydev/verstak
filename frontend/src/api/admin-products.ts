import type { Product } from '../types/product';

import {
  apiClient,
  assertApiConfigured,
} from './client';

export async function getAdminProducts():
Promise<Product[]> {
  assertApiConfigured();

  const response =
    await apiClient.get<Product[]>(
      '/admin/products',
    );

  return response.data;
}

export async function setProductPublication(
  id: number,
  isPublished: boolean,
): Promise<Product> {
  assertApiConfigured();

  const response =
    await apiClient.patch<Product>(
      `/admin/products/${id}/publication`,
      {
        isPublished,
      },
    );

  return response.data;
}
