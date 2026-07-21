import type { Product } from "../types/product";

import { apiClient, assertApiConfigured } from "./client";

export interface ProductPayload {
  title: string;
  description: string;
  price: string;
  category: string;
  wood?: string;
  size?: string;
  managerLink: string;
  coverImage: string;
  isPublished: boolean;
}

interface ResolveImageResponse {
  originalUrl: string;
  resolvedUrl: string;
}

export async function getAdminProducts(): Promise<Product[]> {
  assertApiConfigured();

  const response = await apiClient.get<Product[]>("/admin/products");

  return response.data;
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  assertApiConfigured();

  const response = await apiClient.post<Product>("/admin/products", payload);

  return response.data;
}

export async function updateProduct(
  id: number,
  payload: ProductPayload,
): Promise<Product> {
  assertApiConfigured();

  const response = await apiClient.patch<Product>(
    `/admin/products/${id}`,
    payload,
  );

  return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
  assertApiConfigured();

  await apiClient.delete(`/admin/products/${id}`);
}

export async function setProductPublication(
  id: number,
  isPublished: boolean,
): Promise<Product> {
  assertApiConfigured();

  const response = await apiClient.patch<Product>(
    `/admin/products/${id}/publication`,
    {
      isPublished,
    },
  );

  return response.data;
}

export async function resolveProductImageUrl(url: string): Promise<string> {
  assertApiConfigured();

  const response = await apiClient.post<ResolveImageResponse>(
    "/admin/products/resolve-image",
    {
      url,
    },
  );

  return response.data.resolvedUrl;
}
