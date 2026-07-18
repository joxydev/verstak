import { Link } from 'react-router-dom';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

function formatPrice(value: string | number): string {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return String(value);
  }

  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
  }).format(price);
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link
        className="product-card__image-link"
        to={`/products/${product.id}`}
        aria-label={`Открыть товар ${product.title}`}
      >
        <img
          className="product-card__image"
          src={product.coverImage}
          alt={product.title}
          loading="lazy"
        />
      </Link>

      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>

        <h2 className="product-card__title">
          <Link to={`/products/${product.id}`}>{product.title}</Link>
        </h2>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__footer">
          <strong className="product-card__price">
            {formatPrice(product.price)} MDL
          </strong>

          <Link
            className="button button--secondary"
            to={`/products/${product.id}`}
          >
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}
