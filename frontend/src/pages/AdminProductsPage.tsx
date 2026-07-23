import { useCallback, useEffect, useMemo, useState } from "react";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import {
  deleteProduct,
  getAdminProducts,
  setProductPublication,
} from "../api/admin-products";

import { ConfirmDialog } from "../components/ui/ConfirmDialog";

import { Notice } from "../components/ui/Notice";

import { AdminProductList } from "../features/admin-products/AdminProductList";

import { AdminStats } from "../features/admin-products/AdminStats";

import { AdminToolbar } from "../features/admin-products/AdminToolbar";

import {
  parseProductSort,
  parseStatusFilter,
  type ProductSort,
  type ProductStatusFilter,
} from "../features/admin-products/types";

import type { Product } from "../types/product";

import { getApiErrorMessage } from "../utils/errors";

interface NavigationState {
  notice?: string;
}

export function AdminProductsPage() {
  const location = useLocation();

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  const [isLoading, setIsLoading] = useState(true);

  const [busyProductId, setBusyProductId] = useState<number | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [notice, setNotice] = useState<string | null>(null);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const status = parseStatusFilter(searchParams.get("status"));

  const sort = parseProductSort(searchParams.get("sort"));

  const loadProducts = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAdminProducts(signal);

      setProducts(response);
    } catch (loadError) {
      if (signal?.aborted) {
        return;
      }

      setError(getApiErrorMessage(loadError, "Не удалось загрузить каталог."));
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    document.title = "Управление каталогом — VERSTAK";

    const controller = new AbortController();

    void loadProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadProducts]);

  useEffect(() => {
    const state = location.state as NavigationState | null;

    if (!state?.notice) {
      return;
    }

    setNotice(state.notice);

    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: null,
    });
  }, [location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);

    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);

      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const query = searchParams.get("q") ?? "";

    if (query !== search) {
      setSearch(query);
    }
  }, [searchParams]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      if (status === "published" && !product.isPublished) {
        return false;
      }

      if (status === "draft" && product.isPublished) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        product.title.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        String(product.id).includes(normalizedSearch)
      );
    });

    return [...filtered].sort((left, right) => {
      if (sort === "title-asc") {
        return left.title.localeCompare(right.title, "ru");
      }

      if (sort === "price-asc") {
        return Number(left.price) - Number(right.price);
      }

      if (sort === "price-desc") {
        return Number(right.price) - Number(left.price);
      }

      return (
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
      );
    });
  }, [products, search, sort, status]);

  const publishedCount = products.filter(
    (product) => product.isPublished,
  ).length;

  const draftCount = products.length - publishedCount;

  const lastUpdated = products.reduce<string | null>((latest, product) => {
    if (!latest) {
      return product.updatedAt;
    }

    return new Date(product.updatedAt).getTime() > new Date(latest).getTime()
      ? product.updatedAt
      : latest;
  }, null);

  function updateQuery(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === null ||
        value === "" ||
        value === "all" ||
        value === "updated-desc"
      ) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    setSearchParams(next, {
      replace: true,
    });
  }

  function handleSearchChange(value: string) {
    setSearch(value);

    updateQuery({
      q: value.trim() || null,
    });
  }

  function handleStatusChange(value: ProductStatusFilter) {
    updateQuery({
      status: value,
    });
  }

  function handleSortChange(value: ProductSort) {
    updateQuery({
      sort: value,
    });
  }

  function resetFilters() {
    setSearch("");
    setSearchParams(new URLSearchParams(), {
      replace: true,
    });
  }

  async function handlePublicationToggle(product: Product) {
    setBusyProductId(product.id);

    setError(null);
    setNotice(null);

    try {
      const updated = await setProductPublication(
        product.id,
        !product.isPublished,
      );

      setProducts((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );

      setNotice(
        updated.isPublished
          ? `Товар «${updated.title}» опубликован`
          : `Товар «${updated.title}» скрыт из каталога`,
      );
    } catch (updateError) {
      setError(
        getApiErrorMessage(updateError, "Не удалось изменить публикацию."),
      );
    } finally {
      setBusyProductId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setBusyProductId(deleteTarget.id);

    setError(null);
    setNotice(null);

    try {
      await deleteProduct(deleteTarget.id);

      setProducts((current) =>
        current.filter((product) => product.id !== deleteTarget.id),
      );

      setNotice(`Товар «${deleteTarget.title}» удалён`);

      setDeleteTarget(null);
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, "Не удалось удалить товар."));
    } finally {
      setBusyProductId(null);
    }
  }

  const hasActiveFilters =
    Boolean(search.trim()) || status !== "all" || sort !== "updated-desc";

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div>
          <span className="admin-page-header__eyebrow">VERSTAK CMS</span>

          <h1>Управление каталогом</h1>

          <p>Создание, публикация и редактирование изделий мастерской.</p>
        </div>
      </header>

      <Notice
        tone="success"
        message={notice}
        onDismiss={() => setNotice(null)}
      />

      <Notice tone="error" message={error} onDismiss={() => setError(null)} />

      <Notice
        tone="warning"
        message={
          isOnline
            ? null
            : "Нет подключения к интернету. Изменения пока недоступны."
        }
      />

      <AdminStats
        total={products.length}
        published={publishedCount}
        drafts={draftCount}
        lastUpdated={lastUpdated}
      />

      <AdminToolbar
        search={search}
        status={status}
        sort={sort}
        isLoading={isLoading}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
        onRefresh={() => void loadProducts()}
      />

      <div className="admin-results-summary">
        <strong>
          {visibleProducts.length}{" "}
          {visibleProducts.length === 1 ? "товар" : "товаров"}
        </strong>

        {hasActiveFilters && (
          <button type="button" onClick={resetFilters}>
            Сбросить фильтры
          </button>
        )}
      </div>

      <AdminProductList
        products={visibleProducts}
        isLoading={isLoading}
        busyProductId={busyProductId}
        hasActiveFilters={hasActiveFilters}
        onTogglePublication={(product) => void handlePublicationToggle(product)}
        onDelete={setDeleteTarget}
        onResetFilters={resetFilters}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Удалить товар?"
        description={
          deleteTarget
            ? `Товар «${deleteTarget.title}» будет удалён без возможности восстановления.`
            : ""
        }
        isBusy={deleteTarget !== null && busyProductId === deleteTarget.id}
        onClose={() => {
          if (busyProductId === null) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
