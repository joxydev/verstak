import { Link } from "react-router-dom";

import { buttonClassName } from "../../components/ui/Button";

import { FeedbackState } from "../../components/ui/FeedbackState";

import { ROUTES } from "../../routes";

import type { Product } from "../../types/product";

import { AdminProductRow } from "./AdminProductRow";

interface AdminProductListProps {
  products: Product[];
  isLoading: boolean;
  busyProductId: number | null;
  hasActiveFilters: boolean;
  onTogglePublication: (product: Product) => void;
  onDelete: (product: Product) => void;
  onResetFilters: () => void;
}

function AdminListSkeleton() {
  return (
    <div
      className="admin-list-skeleton"
      aria-label="Загрузка товаров"
      aria-busy="true"
    >
      {Array.from({
        length: 5,
      }).map((_, index) => (
        <div className="admin-list-skeleton__row" key={index}>
          <span className="skeleton" />
          <span className="skeleton" />
          <span className="skeleton" />
          <span className="skeleton" />
        </div>
      ))}
    </div>
  );
}

export function AdminProductList({
  products,
  isLoading,
  busyProductId,
  hasActiveFilters,
  onTogglePublication,
  onDelete,
  onResetFilters,
}: AdminProductListProps) {
  if (isLoading) {
    return <AdminListSkeleton />;
  }

  if (products.length === 0) {
    return (
      <FeedbackState
        compact
        title={hasActiveFilters ? "Товары не найдены" : "Каталог пока пуст"}
        description={
          hasActiveFilters
            ? "Измените поиск или сбросьте фильтры."
            : "Создайте первый товар для каталога VERSTAK."
        }
        action={
          hasActiveFilters ? (
            <button
              className={buttonClassName({
                variant: "secondary",
              })}
              type="button"
              onClick={onResetFilters}
            >
              Сбросить фильтры
            </button>
          ) : (
            <Link
              className={buttonClassName({
                variant: "primary",
              })}
              to={ROUTES.adminProductNew}
            >
              Добавить товар
            </Link>
          )
        }
      />
    );
  }

  return (
    <section className="admin-product-list" aria-label="Товары каталога">
      <header className="admin-product-list__header">
        <span />
        <span>Товар</span>
        <span>Категория</span>
        <span>Цена</span>
        <span>Статус</span>
        <span>Обновлён</span>
        <span>Действия</span>
      </header>

      <div className="admin-product-list__body">
        {products.map((product) => (
          <AdminProductRow
            key={product.id}
            product={product}
            isBusy={busyProductId === product.id}
            onTogglePublication={onTogglePublication}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
