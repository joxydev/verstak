import axios from 'axios';
import type { Product } from '../types/product';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');

if (!apiUrl) {
  console.warn(
    'VITE_API_URL is not configured. Add it to the frontend environment variables.',
  );
}

const api = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>('/products');
  return response.data;
}

export async function getProduct(id: number): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
}
