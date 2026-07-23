import { Link } from "react-router-dom";

import { BrandLogo } from "../../components/BrandLogo";
import { buttonClassName } from "../../components/ui/Button";
import { ProductImage } from "../../components/ui/ProductImage";
import { ROUTES, SECTIONS } from "../../routes";
import type { Product } from "../../types/product";

interface HeroProps {
  product: Product | null;
  contactLink: string;
}

export function Hero({ product, contactLink }: HeroProps) {
  return (
    <section className="atelier-hero">
      <div className="container atelier-hero__grid">
        <div className="atelier-hero__copy">
          <span className="eyebrow">Авторская мастерская · Moldova</span>

          <h1>Изделия из дерева, созданные на поколения</h1>

          <p className="atelier-hero__description">
            Нарды, шахматы, корабли, иконы, шкатулки и декоративные работы
            ручного изготовления.
          </p>

          <div className="atelier-hero__actions">
            <a
              className={buttonClassName({
                variant: "primary",
                size: "large",
              })}
              href={`#${SECTIONS.catalog}`}
            >
              Смотреть коллекцию
            </a>

            <a
              className="atelier-hero__contact-link"
              href={contactLink}
              target="_blank"
              rel="noreferrer"
            >
              Связаться с мастерской
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <ul
            className="atelier-hero__trust"
            aria-label="Особенности мастерской"
          >
            <li>Ручная работа</li>

            <li>Натуральное дерево</li>

            <li>Сделано в Молдове</li>
          </ul>
        </div>

        <div className="atelier-hero__media">
          {product ? (
            <Link
              className="atelier-hero__image-link"
              to={ROUTES.product(product.id)}
              aria-label={`Открыть изделие «${product.title}»`}
            >
              <ProductImage
                className="atelier-hero__image"
                src={product.coverImage}
                alt={product.title}
                width={1080}
                height={1350}
                sizes="(max-width: 767px) calc(100vw - 32px), 48vw"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />

              <span className="atelier-hero__caption">
                <small>Новая работа</small>

                <strong>{product.title}</strong>
              </span>
            </Link>
          ) : (
            <div className="atelier-hero__placeholder">
              <BrandLogo />
            </div>
          )}

          <span className="atelier-hero__monogram" aria-hidden="true">
            V
          </span>
        </div>
      </div>
    </section>
  );
}
