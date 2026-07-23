import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { ROUTES, SECTIONS, sectionUrl } from "../routes";
import { useTelegram } from "../telegram/TelegramProvider";

import { BrandLogo } from "./BrandLogo";
import { IconButton } from "./ui/IconButton";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

interface NavigationLinksProps {
  pathname: string;
  hash: string;
  isAdmin: boolean;
  onNavigate?: () => void;
}

function NavigationLinks({
  pathname,
  hash,
  isAdmin,
  onNavigate,
}: NavigationLinksProps) {
  function isSectionActive(section: string) {
    return pathname === "/" && hash === `#${section}`;
  }

  return (
    <>
      <Link
        className={
          isSectionActive(SECTIONS.catalog)
            ? "navigation-link navigation-link--active"
            : "navigation-link"
        }
        aria-current={
          isSectionActive(SECTIONS.catalog) ? "location" : undefined
        }
        to={sectionUrl(SECTIONS.catalog)}
        onClick={onNavigate}
      >
        Каталог
      </Link>

      <Link
        className={
          isSectionActive(SECTIONS.categories)
            ? "navigation-link navigation-link--active"
            : "navigation-link"
        }
        aria-current={
          isSectionActive(SECTIONS.categories) ? "location" : undefined
        }
        to={sectionUrl(SECTIONS.categories)}
        onClick={onNavigate}
      >
        Категории
      </Link>

      <Link
        className={
          isSectionActive(SECTIONS.atelier)
            ? "navigation-link navigation-link--active"
            : "navigation-link"
        }
        aria-current={
          isSectionActive(SECTIONS.atelier) ? "location" : undefined
        }
        to={sectionUrl(SECTIONS.atelier)}
        onClick={onNavigate}
      >
        О мастерской
      </Link>

      <Link
        className={
          isSectionActive(SECTIONS.contact)
            ? "navigation-link navigation-link--active"
            : "navigation-link"
        }
        aria-current={
          isSectionActive(SECTIONS.contact) ? "location" : undefined
        }
        to={sectionUrl(SECTIONS.contact)}
        onClick={onNavigate}
      >
        Контакты
      </Link>

      {isAdmin && (
        <Link
          className={
            pathname.startsWith(ROUTES.admin)
              ? "navigation-link navigation-link--admin navigation-link--active"
              : "navigation-link navigation-link--admin"
          }
          to={ROUTES.admin}
          onClick={onNavigate}
        >
          Управление
        </Link>
      )}
    </>
  );
}

export function SiteHeader() {
  const { isAdmin } = useTelegram();

  const location = useLocation();

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const menuPanelRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [hasScrolled, setHasScrolled] = useState(false);

  function closeMenu(restoreFocus = true) {
    setIsMenuOpen(false);

    if (restoreFocus) {
      requestAnimationFrame(() => {
        menuButtonRef.current?.focus();
      });
    }
  }

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    function updateHeader() {
      setHasScrolled(window.scrollY > 8);
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateHeader);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    document.body.classList.add("menu-open");

    requestAnimationFrame(() => {
      const focusable =
        menuPanelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);

      focusable?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !menuPanelRef.current) {
        return;
      }

      const focusable = Array.from(
        menuPanelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];

      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("menu-open");

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header
      className={["site-header", hasScrolled ? "site-header--scrolled" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="container site-header__inner">
        <Link
          className="site-header__brand"
          to={ROUTES.home}
          aria-label="VERSTAK — главная страница"
        >
          <BrandLogo />
        </Link>

        <nav className="desktop-navigation" aria-label="Основная навигация">
          <NavigationLinks
            pathname={location.pathname}
            hash={location.hash}
            isAdmin={isAdmin}
          />
        </nav>

        <IconButton
          ref={menuButtonRef}
          className="mobile-menu-button"
          label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => {
            if (isMenuOpen) {
              closeMenu(false);
            } else {
              setIsMenuOpen(true);
            }
          }}
        >
          <span
            className={["menu-icon", isMenuOpen ? "menu-icon--open" : ""]
              .filter(Boolean)
              .join(" ")}
            aria-hidden="true"
          >
            <span />
            <span />
          </span>
        </IconButton>
      </div>

      {isMenuOpen && (
        <>
          <button
            className="mobile-navigation__overlay"
            type="button"
            aria-label="Закрыть меню"
            onClick={() => closeMenu()}
          />

          <div
            ref={menuPanelRef}
            id="mobile-navigation"
            className="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Мобильное меню"
          >
            <div className="mobile-navigation__header">
              <BrandLogo compact />

              <IconButton label="Закрыть меню" onClick={() => closeMenu()}>
                <span className="mobile-navigation__close" aria-hidden="true">
                  ×
                </span>
              </IconButton>
            </div>

            <nav
              className="mobile-navigation__links"
              aria-label="Мобильная навигация"
            >
              <NavigationLinks
                pathname={location.pathname}
                hash={location.hash}
                isAdmin={isAdmin}
                onNavigate={() => closeMenu(false)}
              />
            </nav>

            <p className="mobile-navigation__signature">
              Wood Craftsmanship
              <br />
              Moldova
            </p>
          </div>
        </>
      )}
    </header>
  );
}
