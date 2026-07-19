import type { Product } from '../types/product';

import {
  apiClient,
  assertApiConfigured,
} from './client';

export async function getProducts():
Promise<Product[]> {
  assertApiConfigured();

  const response =
    await apiClient.get<Product[]>(
      '/products',
    );

  return response.data;
}

export async function getProduct(
  id: number,
): Promise<Product> {
  assertApiConfigured();

  const response =
    await apiClient.get<Product>(
      `/products/${id}`,
    );

  return response.data;
}
