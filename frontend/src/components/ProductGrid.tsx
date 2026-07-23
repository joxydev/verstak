import type { Product } from "../types/product";

import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  priorityCount?: number;
  className?: string;
}

export function ProductGrid({
  products,
  priorityCount = 0,
  className = "",
}: ProductGridProps) {
  return (
    <div className={["product-grid", className].filter(Boolean).join(" ")}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
