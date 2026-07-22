import type {
  Product,
} from '../types/product';

import {
  apiClient,
  assertApiConfigured,
} from './client';

export async function getProducts(
  signal?: AbortSignal,
): Promise<Product[]> {
  assertApiConfigured();

  const response =
    await apiClient.get<Product[]>(
      '/products',
      {
        signal,
      },
    );

  return response.data;
}

export async function getProduct(
  id: number,
  signal?: AbortSignal,
): Promise<Product> {
  assertApiConfigured();

  const response =
    await apiClient.get<Product>(
      `/products/${id}`,
      {
        signal,
      },
    );

  return response.data;
}
