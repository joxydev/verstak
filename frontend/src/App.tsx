import {
  lazy,
  Suspense,
} from 'react';
import {
  Link,
  Route,
  Routes,
} from 'react-router-dom';

import {
  AdminRoute,
} from './components/AdminRoute';
import {
  ScrollToTop,
} from './components/ScrollToTop';
import {
  SiteFooter,
} from './components/SiteFooter';
import {
  SiteHeader,
} from './components/SiteHeader';
import {
  buttonClassName,
} from './components/ui/Button';
import {
  FeedbackState,
} from './components/ui/FeedbackState';
import {
  RouteFallback,
} from './components/ui/Skeleton';
import {
  ROUTES,
} from './routes';

const CatalogPage =
  lazy(async () => {
    const module =
      await import(
        './pages/CatalogPage'
      );

    return {
      default:
        module.CatalogPage,
    };
  });

const ProductPage =
  lazy(async () => {
    const module =
      await import(
        './pages/ProductPage'
      );

    return {
      default:
        module.ProductPage,
    };
  });

const AdminProductsPage =
  lazy(async () => {
    const module =
      await import(
        './pages/AdminProductsPage'
      );

    return {
      default:
        module.AdminProductsPage,
    };
  });

function NotFoundPage() {
  return (
    <main className="page-shell">
      <div className="container">
        <FeedbackState
          title="Страница не найдена"
          description="Такой страницы в каталоге VERSTAK нет."
          action={
            <Link
              className={buttonClassName({
                variant:
                  'primary',
              })}
              to={ROUTES.home}
            >
              Открыть коллекцию
            </Link>
          }
        />
      </div>
    </main>
  );
}

function App() {
  return (
    <div className="site-shell">
      <ScrollToTop />
      <SiteHeader />

      <Suspense
        fallback={
          <RouteFallback />
        }
      >
        <Routes>
          <Route
            path={ROUTES.home}
            element={
              <CatalogPage />
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProductPage />
            }
          />

          <Route
            element={
              <AdminRoute />
            }
          >
            <Route
              path={ROUTES.admin}
              element={
                <AdminProductsPage />
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <NotFoundPage />
            }
          />
        </Routes>
      </Suspense>

      <SiteFooter />
    </div>
  );
}

export default App;
