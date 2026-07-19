import type {
  CurrentUserResponse,
  TelegramAuthResponse,
} from '../types/auth';

import {
  apiClient,
  assertApiConfigured,
} from './client';

import {
  removeAccessToken,
  saveAccessToken,
} from './token';

export async function authenticateTelegram(
  initData: string,
): Promise<TelegramAuthResponse> {
  assertApiConfigured();

  if (!initData) {
    throw new Error(
      'Telegram initData is missing',
    );
  }

  const response =
    await apiClient.post<TelegramAuthResponse>(
      '/auth/telegram',
      {
        initData,
      },
    );

  if (!response.data.accessToken) {
    throw new Error(
      'Backend did not return an access token',
    );
  }

  saveAccessToken(response.data.accessToken);

  return response.data;
}

export async function getCurrentUser():
Promise<CurrentUserResponse> {
  assertApiConfigured();

  const response =
    await apiClient.get<CurrentUserResponse>(
      '/auth/me',
    );

  return response.data;
}

export function logout(): void {
  removeAccessToken();
}
