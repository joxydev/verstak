import axios from 'axios';

interface ApiErrorPayload {
  message?: string | string[];
}

export function getHttpStatus(
  error: unknown,
): number | undefined {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  return error.response?.status;
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (!axios.isAxiosError<ApiErrorPayload>(
    error,
  )) {
    return error instanceof Error
      ? error.message
      : fallback;
  }

  const message =
    error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  if (typeof message === 'string') {
    return message;
  }

  if (!error.response) {
    return 'Нет соединения с сервером. Проверьте интернет и повторите попытку.';
  }

  return fallback;
}
