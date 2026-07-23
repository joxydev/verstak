import { Link } from "react-router-dom";

import { ProductImage } from "../../components/ui/ProductImage";
import { SectionHeading } from "../../components/ui/SectionHeading";
import { categoryUrl, SECTIONS } from "../../routes";

export interface CategorySummary {
  name: string;
  count: number;
  image: string;
}

interface CategoryGridProps {
  categories: CategorySummary[];
}

function getCountLabel(count: number): string {
  if (count === 1) {
    return "1 работа";
  }

  if (count >= 2 && count <= 4) {
    return `${count} работы`;
  }

  return `${count} работ`;
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section id={SECTIONS.categories} className="category-showcase">
      <div className="container">
        <SectionHeading
          eyebrow="Направления мастерской"
          title="Выберите категорию"
          description="Откройте коллекцию через тип изделия — от резных нард до интерьерных работ."
        />

        <div className="category-grid">
          {categories.map((category) => (
            <article className="category-card" key={category.name}>
              <Link
                className="category-card__link"
                to={categoryUrl(category.name)}
                aria-label={`${category.name}, ${getCountLabel(
                  category.count,
                )}`}
              >
                <div className="category-card__media">
                  <ProductImage
                    className="category-card__image"
                    src={category.image}
                    alt=""
                    width={720}
                    height={540}
                    sizes="(max-width: 767px) 78vw, (max-width: 1100px) 40vw, 24vw"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="category-card__content">
                  <div>
                    <h3>{category.name}</h3>

                    <span>{getCountLabel(category.count)}</span>
                  </div>

                  <span className="category-card__arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
