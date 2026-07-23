import { ProductGrid } from "../../components/ProductGrid";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { SECTIONS, sectionUrl } from "../../routes";
import type { Product } from "../../types/product";

interface FeaturedWorksProps {
  products: Product[];
}

export function FeaturedWorks({ products }: FeaturedWorksProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="featured-works">
      <div className="container">
        <SectionHeading
          eyebrow="Новые работы"
          title="Последние изделия"
          description="Недавно добавленные работы мастерской — каждая со своим материалом, рисунком и характером."
          meta={
            <a
              className="section-text-link"
              href={sectionUrl(SECTIONS.catalog)}
            >
              Вся коллекция
              <span aria-hidden="true">↓</span>
            </a>
          }
        />

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
