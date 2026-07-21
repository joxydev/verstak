import {
  Link,
  Outlet,
} from 'react-router-dom';

import { useTelegram } from '../telegram/TelegramProvider';

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
      <main className="page-section">
        <div className="container">
          <div className="status-card">
            <div className="loader" />

            <h1>Проверка доступа</h1>

            <p>
              Проверяем Telegram-сессию и права
              пользователя.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="page-section">
        <div className="container">
          <div className="status-card status-card--error">
            <h1>Требуется авторизация</h1>

            <p>
              Административная панель доступна
              только после авторизации через
              Telegram Mini App.
            </p>

            {authError && (
              <p className="admin-error-details">
                {authError}
              </p>
            )}

            <Link
              className="button button--primary"
              to="/"
            >
              Вернуться в каталог
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="page-section">
        <div className="container">
          <div className="status-card status-card--error">
            <h1>Доступ запрещён</h1>

            <p>
              Для открытия этой страницы
              необходима роль ADMIN или OWNER.
            </p>

            <Link
              className="button button--primary"
              to="/"
            >
              Вернуться в каталог
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <Outlet />;
}
