import {
  useEffect,
  useState,
} from 'react';
import {
  Link,
  useLocation,
} from 'react-router-dom';

import {
  CONTACTS,
  ROUTES,
} from '../routes';
import {
  useTelegram,
} from '../telegram/TelegramProvider';

import {
  BrandLogo,
} from './BrandLogo';
import {
  IconButton,
} from './ui/IconButton';

export function SiteHeader() {
  const {
    isAdmin,
  } = useTelegram();

  const location =
    useLocation();

  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [
    location.pathname,
    location.hash,
  ]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [
    isMenuOpen,
  ]);

  const navigation = (
    <>
      <Link to="/#catalog">
        Коллекция
      </Link>

      <Link to="/#atelier">
        О мастерской
      </Link>

      <a
        href={CONTACTS.telegram}
        target="_blank"
        rel="noreferrer"
      >
        Контакты
      </a>

      {isAdmin && (
        <Link
          className="navigation__admin-link"
          to={ROUTES.admin}
        >
          Управление
        </Link>
      )}
    </>
  );

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link
          className="site-header__brand"
          to={ROUTES.home}
          aria-label="VERSTAK — главная"
        >
          <BrandLogo />
        </Link>

        <nav
          className="desktop-navigation"
          aria-label="Основная навигация"
        >
          {navigation}
        </nav>

        <IconButton
          className="mobile-menu-button"
          label={
            isMenuOpen
              ? 'Закрыть меню'
              : 'Открыть меню'
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() =>
            setIsMenuOpen(
              (current) =>
                !current,
            )
          }
        >
          <span
            className={`menu-icon ${
              isMenuOpen
                ? 'menu-icon--open'
                : ''
            }`}
            aria-hidden="true"
          >
            <span />
            <span />
          </span>
        </IconButton>
      </div>

      <div
        id="mobile-navigation"
        className={[
          'mobile-navigation',
          isMenuOpen
            ? 'mobile-navigation--open'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!isMenuOpen}
      >
        <nav
          className="container mobile-navigation__inner"
          aria-label="Мобильная навигация"
        >
          {navigation}
        </nav>
      </div>
    </header>
  );
}
