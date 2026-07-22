import {
  useState,
} from 'react';
import {
  Link,
} from 'react-router-dom';

import {
  ROUTES,
} from '../routes';
import type {
  Product,
} from '../types/product';

import {
  ProductPrice,
} from './ui/ProductPrice';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const [
    hasImageError,
    setHasImageError,
  ] = useState(false);

  const secondaryDetail =
    product.wood ||
    product.size;

  return (
    <article className="product-card">
      <Link
        className="product-card__link"
        to={ROUTES.product(
          product.id,
        )}
        aria-label={`Открыть изделие «${product.title}»`}
      >
        <div className="product-card__media">
          {!hasImageError ? (
            <img
              className="product-card__image"
              src={product.coverImage}
              alt={product.title}
              width={960}
              height={720}
              loading={
                priority
                  ? 'eager'
                  : 'lazy'
              }
              fetchPriority={
                priority
                  ? 'high'
                  : 'auto'
              }
              decoding="async"
              onError={() =>
                setHasImageError(
                  true,
                )
              }
            />
          ) : (
            <div
              className="product-card__placeholder"
              aria-label="Изображение временно недоступно"
            >
              <span aria-hidden="true">
                V
              </span>
            </div>
          )}

          <span className="product-card__action">
            Смотреть изделие
            <span aria-hidden="true">
              ↗
            </span>
          </span>
        </div>

        <div className="product-card__body">
          <span className="product-badge">
            {product.category}
          </span>

          <h3 className="product-card__title">
            {product.title}
          </h3>

          <p className="product-card__description">
            {product.description}
          </p>

          <div className="product-card__footer">
            <ProductPrice
              value={product.price}
            />

            {secondaryDetail && (
              <span className="product-card__detail">
                {secondaryDetail}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
