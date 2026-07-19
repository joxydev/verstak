import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  getTelegramWebApp,
  initializeTelegramMiniApp,
} from './telegram';

import type {
  TelegramUser,
  TelegramWebApp,
} from './telegram.types';

interface TelegramContextValue {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  initData: string;
  isTelegram: boolean;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextValue | null>(null);

interface TelegramProviderProps {
  children: ReactNode;
}

export function TelegramProvider({
  children,
}: TelegramProviderProps) {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(() =>
    getTelegramWebApp(),
  );

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializedWebApp = initializeTelegramMiniApp();

    setWebApp(initializedWebApp);
    setIsReady(true);
  }, []);

  const value = useMemo<TelegramContextValue>(() => {
    const initData = webApp?.initData ?? '';

    return {
      webApp,
      user: webApp?.initDataUnsafe.user ?? null,
      initData,
      isTelegram: Boolean(initData),
      isReady,
    };
  }, [webApp, isReady]);

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram(): TelegramContextValue {
  const context = useContext(TelegramContext);

  if (!context) {
    throw new Error(
      'useTelegram must be used inside TelegramProvider',
    );
  }

  return context;
}
