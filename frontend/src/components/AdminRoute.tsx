import {
  Link,
  Outlet,
} from 'react-router-dom';

import {
  ROUTES,
} from '../routes';
import {
  useTelegram,
} from '../telegram/TelegramProvider';

import {
  buttonClassName,
} from './ui/Button';
import {
  FeedbackState,
} from './ui/FeedbackState';
import {
  RouteFallback,
} from './ui/Skeleton';

export function AdminRoute() {
  const {
    isReady,
    isAuthenticated,
    isAdmin,
    authStatus,
    authError,
  } = useTelegram();

  const isLoading =
    !isReady ||
    authStatus === 'idle' ||
    authStatus === 'loading';

  if (isLoading) {
    return (
      <RouteFallback />
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="page-shell">
        <div className="container">
          <FeedbackState
            tone="error"
            title="Требуется авторизация"
            description={
              authError ||
              'Панель управления доступна только после авторизации через Telegram Mini App.'
            }
            action={
              <Link
                className={buttonClassName({
                  variant:
                    'primary',
                })}
                to={ROUTES.home}
              >
                Вернуться в коллекцию
              </Link>
            }
          />
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="page-shell">
        <div className="container">
          <FeedbackState
            tone="error"
            title="Доступ закрыт"
            description="Панель управления доступна только владельцу мастерской."
            action={
              <Link
                className={buttonClassName({
                  variant:
                    'primary',
                })}
                to={ROUTES.home}
              >
                Вернуться в коллекцию
              </Link>
            }
          />
        </div>
      </main>
    );
  }

  return <Outlet />;
}
