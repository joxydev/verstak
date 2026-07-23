import { useRef } from "react";

import { Link } from "react-router-dom";

import { buttonClassName } from "../../components/ui/Button";

import { ProductImage } from "../../components/ui/ProductImage";

import { StatusBadge } from "../../components/ui/StatusBadge";

import { ROUTES } from "../../routes";

import type { Product } from "../../types/product";

import { formatCurrency, formatDateTime } from "../../utils/format";

interface AdminProductRowProps {
  product: Product;
  isBusy: boolean;
  onTogglePublication: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function AdminProductRow({
  product,
  isBusy,
  onTogglePublication,
  onDelete,
}: AdminProductRowProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  function closeMenu() {
    if (detailsRef.current) {
      detailsRef.current.open = false;
    }
  }

  return (
    <article className="admin-product-row">
      <div className="admin-product-row__media">
        <ProductImage
          className="admin-product-row__image"
          src={product.coverImage}
          alt=""
          width={128}
          height={128}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="admin-product-row__identity">
        <span>ID {product.id}</span>

        <strong>{product.title}</strong>
      </div>

      <div className="admin-product-row__category">{product.category}</div>

      <div className="admin-product-row__price">
        {formatCurrency(product.price)}
      </div>

      <div className="admin-product-row__status">
        <StatusBadge published={product.isPublished} />
      </div>

      <time className="admin-product-row__updated" dateTime={product.updatedAt}>
        {formatDateTime(product.updatedAt)}
      </time>

      <div className="admin-product-row__desktop-actions">
        <Link
          className={buttonClassName({
            variant: "secondary",
            size: "small",
          })}
          to={ROUTES.adminProductEdit(product.id)}
        >
          Изменить
        </Link>

        <button
          className={buttonClassName({
            variant: "quiet",
            size: "small",
          })}
          type="button"
          disabled={isBusy}
          onClick={() => onTogglePublication(product)}
        >
          {product.isPublished ? "Скрыть" : "Опубликовать"}
        </button>

        <button
          className="admin-row-delete-button"
          type="button"
          disabled={isBusy}
          aria-label={`Удалить товар «${product.title}»`}
          onClick={() => onDelete(product)}
        >
          Удалить
        </button>
      </div>

      <details ref={detailsRef} className="admin-product-menu">
        <summary aria-label={`Действия с товаром «${product.title}»`}>
          <span aria-hidden="true">⋮</span>
        </summary>

        <div className="admin-product-menu__panel">
          <Link to={ROUTES.adminProductEdit(product.id)} onClick={closeMenu}>
            Редактировать
          </Link>

          <button
            type="button"
            disabled={isBusy}
            onClick={() => {
              closeMenu();

              onTogglePublication(product);
            }}
          >
            {product.isPublished ? "Снять с публикации" : "Опубликовать"}
          </button>

          {product.isPublished && (
            <Link
              to={ROUTES.product(product.id)}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
            >
              Открыть на сайте
            </Link>
          )}

          <button
            className="admin-product-menu__danger"
            type="button"
            disabled={isBusy}
            onClick={() => {
              closeMenu();
              onDelete(product);
            }}
          >
            Удалить товар
          </button>
        </div>
      </details>
    </article>
  );
}
