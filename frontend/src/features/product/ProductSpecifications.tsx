import type { Product } from "../../types/product";

interface ProductSpecificationsProps {
  product: Product;
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  return (
    <dl className="product-facts">
      {product.wood && (
        <div>
          <dt>Материал</dt>
          <dd>{product.wood}</dd>
        </div>
      )}

      {product.size && (
        <div>
          <dt>Размер</dt>
          <dd>{product.size}</dd>
        </div>
      )}

      <div>
        <dt>Категория</dt>
        <dd>{product.category}</dd>
      </div>

      <div>
        <dt>Изготовление</dt>
        <dd>Ручная работа</dd>
      </div>

      <div>
        <dt>Производство</dt>
        <dd>Moldova</dd>
      </div>
    </dl>
  );
}
