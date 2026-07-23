import { Link } from "react-router-dom";

import { ROUTES } from "../routes";
import type { Product } from "../types/product";

import { ProductImage } from "./ui/ProductImage";
import { ProductPrice } from "./ui/ProductPrice";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const secondaryDetail = [product.wood, product.size]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="product-card">
      <Link
        className="product-card__link"
        to={ROUTES.product(product.id)}
        aria-label={`Открыть изделие «${product.title}»`}
      >
        <div className="product-card__media">
          <ProductImage
            className="product-card__image"
            src={product.coverImage}
            alt={product.title}
            width={960}
            height={720}
            sizes="(max-width: 575px) calc(100vw - 32px), (max-width: 1023px) 46vw, (max-width: 1399px) 31vw, 23vw"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />

          <span className="product-card__action">
            Смотреть
            <span aria-hidden="true">↗</span>
          </span>
        </div>

        <div className="product-card__body">
          <span className="product-badge">{product.category}</span>

          <h3 className="product-card__title">{product.title}</h3>

          <p className="product-card__description">{product.description}</p>

          <div className="product-card__footer">
            <ProductPrice value={product.price} />

            {secondaryDetail && (
              <span className="product-card__detail">{secondaryDetail}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
