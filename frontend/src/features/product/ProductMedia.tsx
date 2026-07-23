import { ProductImage } from "../../components/ui/ProductImage";
import type { Product } from "../../types/product";

interface ProductMediaProps {
  product: Product;
}

export function ProductMedia({ product }: ProductMediaProps) {
  return (
    <div className="product-media">
      <div className="product-media__frame">
        <ProductImage
          className="product-media__image"
          src={product.coverImage}
          alt={product.title}
          width={1400}
          height={1400}
          sizes="(max-width: 899px) calc(100vw - 32px), 58vw"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />

        <span className="product-media__label">Ручная работа · Moldova</span>
      </div>

      <p className="product-media__caption">
        Фотография представлена без декоративного изменения самого изделия.
      </p>
    </div>
  );
}
