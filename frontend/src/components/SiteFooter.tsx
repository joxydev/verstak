import {
  Link,
} from 'react-router-dom';

import {
  CONTACTS,
  ROUTES,
} from '../routes';

import {
  BrandLogo,
} from './BrandLogo';

const categories = [
  'Нарды',
  'Шахматы',
  'Корабли',
  'Иконы',
  'Шкатулки',
];

export function SiteFooter() {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Link
            to={ROUTES.home}
            aria-label="VERSTAK — главная"
          >
            <BrandLogo light />
          </Link>

          <p>
            Авторские изделия из дерева,
            созданные вручную в Молдове.
          </p>
        </div>

        <nav
          className="site-footer__column"
          aria-label="Категории"
        >
          <strong>Коллекция</strong>

          {categories.map(
            (category) => (
              <Link
                key={category}
                to={`/?category=${encodeURIComponent(
                  category,
                )}#catalog`}
              >
                {category}
              </Link>
            ),
          )}
        </nav>

        <div className="site-footer__column">
          <strong>Мастерская</strong>

          <Link to="/#atelier">
            О VERSTAK
          </Link>

          <a
            href={CONTACTS.telegram}
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>

          <span>Moldova</span>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <span>
          © {currentYear} VERSTAK
        </span>

        <span>
          Wood Craftsmanship · Moldova
        </span>
      </div>
    </footer>
  );
}
