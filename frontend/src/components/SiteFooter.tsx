import { Link } from "react-router-dom";

import { ROUTES, SECTIONS, sectionUrl } from "../routes";

import { BrandLogo } from "./BrandLogo";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Link to={ROUTES.home} aria-label="VERSTAK — главная">
            <BrandLogo light />
          </Link>

          <p>
            Авторские изделия из натурального дерева, созданные вручную в
            Молдове.
          </p>
        </div>

        <nav className="site-footer__column" aria-label="Навигация по каталогу">
          <strong>Коллекция</strong>

          <Link to={sectionUrl(SECTIONS.categories)}>Категории</Link>

          <Link to={sectionUrl(SECTIONS.catalog)}>Все изделия</Link>

          <Link to={sectionUrl(SECTIONS.atelier)}>О мастерской</Link>
        </nav>

        <div className="site-footer__column">
          <strong>Заказ</strong>

          <Link to={sectionUrl(SECTIONS.contact)}>Связаться с мастером</Link>

          <span>Индивидуальное изготовление</span>

          <span>Доставка обсуждается отдельно</span>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <span>© {currentYear} VERSTAK</span>

        <span>Wood Craftsmanship · Moldova</span>
      </div>
    </footer>
  );
}
