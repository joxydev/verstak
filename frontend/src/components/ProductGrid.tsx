import type {
  Product,
} from '../types/product';

import {
  ProductCard,
} from './ProductCard';

interface ProductGridProps {
  products: Product[];
  prioritizeFirst?: boolean;
}

export function ProductGrid({
  products,
  prioritizeFirst = false,
}: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.map(
        (product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={
              prioritizeFirst &&
              index === 0
            }
          />
        ),
      )}
    </div>
  );
}
