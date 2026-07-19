import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { authenticateTelegram } from '../api/auth';

import type {
  AuthUser,
  UserRole,
} from '../types/auth';

import {
  getTelegramWebApp,
  initializeTelegramMiniApp,
} from './telegram';

import type {
  TelegramUser,
  TelegramWebApp,
} from './telegram.types';

type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'browser'
  | 'error';

interface TelegramContextValue {
  webApp: TelegramWebApp | null;
  telegramUser: TelegramUser | null;
  user: AuthUser | null;
  initData: string;
  isTelegram: boolean;
  isReady: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  role: UserRole | null;
  authStatus: AuthStatus;
  authError: string | null;
}

const TelegramContext =
  createContext<TelegramContextValue | null>(null);

interface TelegramProviderProps {
  children: ReactNode;
}

export function TelegramProvider({
  children,
}: TelegramProviderProps) {
  const [webApp, setWebApp] =
    useState<TelegramWebApp | null>(() =>
      getTelegramWebApp(),
    );

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [isReady, setIsReady] =
    useState(false);

  const [authStatus, setAuthStatus] =
    useState<AuthStatus>('idle');

  const [authError, setAuthError] =
    useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function initialize() {
      const initializedWebApp =
        initializeTelegramMiniApp();

      if (!isActive) {
        return;
      }

      setWebApp(initializedWebApp);
      setIsReady(true);

      const initData =
        initializedWebApp?.initData ?? '';

      if (!initData) {
        setAuthStatus('browser');
        return;
      }

      setAuthStatus('loading');
      setAuthError(null);

      try {
        const response =
          await authenticateTelegram(initData);

        if (!isActive) {
          return;
        }

        setUser(response.user);
        setAuthStatus('authenticated');

        console.info(
          'Telegram backend authentication completed',
          {
            userId: response.user.id,
            telegramId: response.user.telegramId,
            role: response.user.role,
          },
        );
      } catch (error) {
        if (!isActive) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Telegram authentication failed';

        console.error(
          'Telegram backend authentication failed:',
          error,
        );

        setAuthError(message);
        setAuthStatus('error');
      }
    }

    void initialize();

    return () => {
      isActive = false;
    };
  }, []);

  const value =
    useMemo<TelegramContextValue>(() => {
      const initData =
        webApp?.initData ?? '';

      const role =
        user?.role ?? null;

      return {
        webApp,
        telegramUser:
          webApp?.initDataUnsafe.user ?? null,
        user,
        initData,
        isTelegram: Boolean(initData),
        isReady,
        isAuthenticated:
          authStatus === 'authenticated' &&
          Boolean(user),
        isAdmin:
          role === 'ADMIN' ||
          role === 'OWNER',
        isOwner:
          role === 'OWNER',
        role,
        authStatus,
        authError,
      };
    }, [
      webApp,
      user,
      isReady,
      authStatus,
      authError,
    ]);

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram(): TelegramContextValue {
  const context =
    useContext(TelegramContext);

  if (!context) {
    throw new Error(
      'useTelegram must be used inside TelegramProvider',
    );
  }

  return context;
}
