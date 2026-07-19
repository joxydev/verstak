import axios from 'axios';

import {
  getAccessToken,
  removeAccessToken,
} from './token';

const apiUrl =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '');

if (!apiUrl) {
  console.warn(
    'VITE_API_URL is not configured. Add it to the frontend environment variables.',
  );
}

export const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.set(
      'Authorization',
      `Bearer ${accessToken}`,
    );
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      removeAccessToken();
    }

    return Promise.reject(error);
  },
);

export function assertApiConfigured(): void {
  if (!apiUrl) {
    throw new Error(
      'VITE_API_URL is not configured',
    );
  }
}
