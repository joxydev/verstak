import { useEffect, useRef, useState } from "react";

import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { BrandLogo } from "../../components/BrandLogo";

import { IconButton } from "../../components/ui/IconButton";

import { ROUTES } from "../../routes";

import { useTelegram } from "../../telegram/TelegramProvider";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

interface AdminNavigationProps {
  onNavigate?: () => void;
}

function AdminNavigation({ onNavigate }: AdminNavigationProps) {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const currentStatus = params.get("status") ?? "all";

  const isListPage = location.pathname === ROUTES.admin;

  return (
    <nav className="admin-navigation" aria-label="Административная навигация">
      <span className="admin-navigation__label">Каталог</span>

      <Link
        className={[
          "admin-navigation__link",
          isListPage && currentStatus === "all"
            ? "admin-navigation__link--active"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        to={ROUTES.admin}
        onClick={onNavigate}
      >
        <span aria-hidden="true">◫</span>
        Все товары
      </Link>

      <Link
        className={[
          "admin-navigation__link",
          isListPage && currentStatus === "published"
            ? "admin-navigation__link--active"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        to={`${ROUTES.admin}?status=published`}
        onClick={onNavigate}
      >
        <span aria-hidden="true">●</span>
        Опубликованные
      </Link>

      <Link
        className={[
          "admin-navigation__link",
          isListPage && currentStatus === "draft"
            ? "admin-navigation__link--active"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
        to={`${ROUTES.admin}?status=draft`}
        onClick={onNavigate}
      >
        <span aria-hidden="true">○</span>
        Черновики
      </Link>

      <span className="admin-navigation__label">Действия</span>

      <NavLink
        className={({ isActive }) =>
          [
            "admin-navigation__link",
            isActive ? "admin-navigation__link--active" : "",
          ]
            .filter(Boolean)
            .join(" ")
        }
        to={ROUTES.adminProductNew}
        onClick={onNavigate}
      >
        <span aria-hidden="true">＋</span>
        Добавить товар
      </NavLink>

      <Link
        className="admin-navigation__link"
        to={ROUTES.home}
        onClick={onNavigate}
      >
        <span aria-hidden="true">↗</span>
        Публичная витрина
      </Link>
    </nav>
  );
}

export function AdminShell() {
  const { user, role } = useTelegram();

  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const drawerRef = useRef<HTMLElement>(null);

  const displayName = user?.firstName || user?.username || "Владелец";

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
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    document.body.classList.add("admin-menu-open");

    requestAnimationFrame(() => {
      drawerRef.current
        ?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        ?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) {
        return;
      }

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
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
      document.body.classList.remove("admin-menu-open");

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-main">
        Перейти к содержанию
      </a>

      <aside className="admin-sidebar">
        <Link
          className="admin-sidebar__brand"
          to={ROUTES.admin}
          aria-label="VERSTAK CMS"
        >
          <BrandLogo />
        </Link>

        <AdminNavigation />

        <div className="admin-session">
          <span className="admin-session__avatar" aria-hidden="true">
            {displayName.charAt(0).toUpperCase()}
          </span>

          <div>
            <strong>{displayName}</strong>

            <span>
              <i aria-hidden="true" />
              {role}
            </span>
          </div>
        </div>
      </aside>

      <header className="admin-mobile-header">
        <Link to={ROUTES.admin} aria-label="VERSTAK CMS">
          <BrandLogo compact />
        </Link>

        <IconButton
          ref={menuButtonRef}
          label="Открыть административное меню"
          aria-expanded={isMenuOpen}
          aria-controls="admin-mobile-menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <span className="menu-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </IconButton>
      </header>

      {isMenuOpen && (
        <>
          <button
            className="admin-drawer-overlay"
            type="button"
            aria-label="Закрыть меню"
            onClick={() => closeMenu()}
          />

          <aside
            ref={drawerRef}
            id="admin-mobile-menu"
            className="admin-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Административное меню"
          >
            <header className="admin-drawer__header">
              <BrandLogo compact />

              <IconButton label="Закрыть меню" onClick={() => closeMenu()}>
                <span className="admin-drawer__close" aria-hidden="true">
                  ×
                </span>
              </IconButton>
            </header>

            <AdminNavigation onNavigate={() => closeMenu(false)} />

            <div className="admin-session">
              <span className="admin-session__avatar" aria-hidden="true">
                {displayName.charAt(0).toUpperCase()}
              </span>

              <div>
                <strong>{displayName}</strong>

                <span>
                  <i aria-hidden="true" />
                  {role}
                </span>
              </div>
            </div>
          </aside>
        </>
      )}

      <main id="admin-main" className="admin-workspace">
        <Outlet />
      </main>
    </div>
  );
}
