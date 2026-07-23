import { lazy, Suspense } from "react";

import { Link, Route, Routes } from "react-router-dom";

import { AdminRoute } from "./components/AdminRoute";

import { PublicShell } from "./components/layout/PublicShell";

import { ScrollToTop } from "./components/ScrollToTop";

import { buttonClassName } from "./components/ui/Button";

import { FeedbackState } from "./components/ui/FeedbackState";

import { RouteFallback } from "./components/ui/Skeleton";

import { ROUTES } from "./routes";

const CatalogPage = lazy(async () => {
  const module = await import("./pages/CatalogPage");

  return {
    default: module.CatalogPage,
  };
});

const ProductPage = lazy(async () => {
  const module = await import("./pages/ProductPage");

  return {
    default: module.ProductPage,
  };
});

const AdminShell = lazy(async () => {
  const module = await import("./features/admin-products/AdminShell");

  return {
    default: module.AdminShell,
  };
});

const AdminProductsPage = lazy(async () => {
  const module = await import("./pages/AdminProductsPage");

  return {
    default: module.AdminProductsPage,
  };
});

const AdminProductEditorPage = lazy(async () => {
  const module = await import("./pages/AdminProductEditorPage");

  return {
    default: module.AdminProductEditorPage,
  };
});

function NotFoundPage() {
  return (
    <main id="main-content" className="page-shell">
      <div className="container">
        <FeedbackState
          title="Страница не найдена"
          description="Такой страницы в каталоге VERSTAK нет."
          action={
            <Link
              className={buttonClassName({
                variant: "primary",
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
    <>
      <ScrollToTop />

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<PublicShell />}>
            <Route path={ROUTES.home} element={<CatalogPage />} />

            <Route path="/products/:id" element={<ProductPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route element={<AdminShell />}>
              <Route path={ROUTES.admin} element={<AdminProductsPage />} />

              <Route
                path={ROUTES.adminProductNew}
                element={<AdminProductEditorPage />}
              />

              <Route
                path={ROUTES.adminProductEditPattern}
                element={<AdminProductEditorPage />}
              />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
