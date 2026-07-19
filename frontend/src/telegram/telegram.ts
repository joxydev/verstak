import type { TelegramWebApp } from './telegram.types';

const TELEGRAM_BACKGROUND = '#f4efe7';
const TELEGRAM_HEADER = '#f4efe7';
const TELEGRAM_BOTTOM_BAR = '#f4efe7';

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.Telegram?.WebApp ?? null;
}

export function isTelegramMiniApp(): boolean {
  const webApp = getTelegramWebApp();

  return Boolean(webApp?.initData);
}

export function initializeTelegramMiniApp(): TelegramWebApp | null {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    console.info('VERSTAK запущен вне Telegram');

    document.documentElement.dataset.telegram = 'false';

    return null;
  }

  document.documentElement.dataset.telegram = 'true';
  document.documentElement.dataset.telegramPlatform =
    webApp.platform || 'unknown';
  document.documentElement.dataset.telegramTheme =
    webApp.colorScheme || 'light';

  try {
    webApp.setHeaderColor?.(TELEGRAM_HEADER);
    webApp.setBackgroundColor?.(TELEGRAM_BACKGROUND);
    webApp.setBottomBarColor?.(TELEGRAM_BOTTOM_BAR);

    webApp.expand();
    webApp.ready();

    console.info('Telegram Mini App initialized', {
      platform: webApp.platform,
      version: webApp.version,
      colorScheme: webApp.colorScheme,
      userId: webApp.initDataUnsafe.user?.id,
    });
  } catch (error) {
    console.error('Telegram Mini App initialization failed:', error);
  }

  return webApp;
}

export function getTelegramInitData(): string {
  return getTelegramWebApp()?.initData ?? '';
}
