import {
  Link,
  Route,
  Routes,
} from 'react-router-dom';

import { AdminRoute } from './components/AdminRoute';
import { TelegramStatus } from './components/TelegramStatus';

import { AdminProductsPage } from './pages/AdminProductsPage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductPage } from './pages/ProductPage';

import { useTelegram } from './telegram/TelegramProvider';

function App() {
  const {
    isAdmin,
  } = useTelegram();

  return (
    <div className="app">
      <header className="site-header">
        <div className="container site-header__content">
          <Link
            className="brand"
            to="/"
          >
            VERSTAK
          </Link>

          <div className="site-header__actions">
            <nav
              className="site-navigation"
              aria-label="Основная навигация"
            >
              <Link to="/">
                Каталог
              </Link>

              {isAdmin && (
                <Link to="/admin">
                  Админка
                </Link>
              )}

              <a
                href="https://t.me/your_manager"
                target="_blank"
                rel="noreferrer"
              >
                Контакты
              </a>
            </nav>

            <TelegramStatus />
          </div>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={<CatalogPage />}
        />

        <Route
          path="/products/:id"
          element={<ProductPage />}
        />

        <Route element={<AdminRoute />}>
          <Route
            path="/admin"
            element={<AdminProductsPage />}
          />
        </Route>

        <Route
          path="*"
          element={
            <main className="page-section">
              <div className="container">
                <div className="status-card">
                  <h1>
                    Страница не найдена
                  </h1>

                  <Link
                    className="button button--primary"
                    to="/"
                  >
                    Открыть каталог
                  </Link>
                </div>
              </div>
            </main>
          }
        />
      </Routes>

      <footer className="site-footer">
        <div className="container site-footer__content">
          <strong>VERSTAK</strong>

          <span>
            Авторские изделия из дерева
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
