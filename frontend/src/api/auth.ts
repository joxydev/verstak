import axios from 'axios';

import type { TelegramAuthResponse } from '../types/auth';

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');

const authApi = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export async function authenticateTelegram(
  initData: string,
): Promise<TelegramAuthResponse> {
  if (!apiUrl) {
    throw new Error('VITE_API_URL is not configured');
  }

  if (!initData) {
    throw new Error('Telegram initData is missing');
  }

  const response =
    await authApi.post<TelegramAuthResponse>(
      '/auth/telegram',
      {
        initData,
      },
    );

  return response.data;
}
