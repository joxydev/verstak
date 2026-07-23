import { Link } from "react-router-dom";

import { Button, buttonClassName } from "../../components/ui/Button";

import { ROUTES } from "../../routes";

import type { ProductSort, ProductStatusFilter } from "./types";

interface AdminToolbarProps {
  search: string;
  status: ProductStatusFilter;
  sort: ProductSort;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ProductStatusFilter) => void;
  onSortChange: (value: ProductSort) => void;
  onRefresh: () => void;
}

const statusOptions: Array<{
  value: ProductStatusFilter;
  label: string;
}> = [
  {
    value: "all",
    label: "Все",
  },
  {
    value: "published",
    label: "Опубликованные",
  },
  {
    value: "draft",
    label: "Черновики",
  },
];

export function AdminToolbar({
  search,
  status,
  sort,
  isLoading,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onRefresh,
}: AdminToolbarProps) {
  return (
    <section className="admin-toolbar" aria-label="Поиск и фильтры">
      <div className="admin-toolbar__top">
        <label className="admin-search-field">
          <span className="visually-hidden">Поиск товаров</span>

          <span className="admin-search-field__icon" aria-hidden="true">
            ⌕
          </span>

          <input
            type="search"
            value={search}
            placeholder="Название, категория или ID"
            autoComplete="off"
            onChange={(event) => onSearchChange(event.target.value)}
          />

          {search && (
            <button
              type="button"
              aria-label="Очистить поиск"
              onClick={() => onSearchChange("")}
            >
              ×
            </button>
          )}
        </label>

        <div className="admin-toolbar__primary-actions">
          <Button variant="secondary" disabled={isLoading} onClick={onRefresh}>
            {isLoading ? "Обновление..." : "Обновить"}
          </Button>

          <Link
            className={buttonClassName({
              variant: "primary",
            })}
            to={ROUTES.adminProductNew}
          >
            Добавить товар
          </Link>
        </div>
      </div>

      <div className="admin-toolbar__filters">
        <div
          className="admin-filter-chips"
          role="group"
          aria-label="Статус товара"
        >
          {statusOptions.map((option) => (
            <button
              className={[
                "admin-filter-chip",
                status === option.value ? "admin-filter-chip--active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={option.value}
              type="button"
              aria-pressed={status === option.value}
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label className="admin-sort-field">
          <span>Сортировка</span>

          <select
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value as ProductSort)
            }
          >
            <option value="updated-desc">Недавно изменённые</option>

            <option value="title-asc">По названию</option>

            <option value="price-asc">Цена: сначала ниже</option>

            <option value="price-desc">Цена: сначала выше</option>
          </select>
        </label>
      </div>
    </section>
  );
}
