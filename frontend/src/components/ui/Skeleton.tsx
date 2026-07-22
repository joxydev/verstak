export function CatalogSkeleton() {
  return (
    <div
      className="product-grid"
      aria-label="Загрузка каталога"
      aria-busy="true"
    >
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <article
          className="product-skeleton"
          key={index}
        >
          <div className="skeleton product-skeleton__image" />

          <div className="product-skeleton__body">
            <div className="skeleton product-skeleton__eyebrow" />
            <div className="skeleton product-skeleton__title" />
            <div className="skeleton product-skeleton__line" />
            <div className="skeleton product-skeleton__line product-skeleton__line--short" />
            <div className="skeleton product-skeleton__price" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <main className="page-shell">
      <h1 className="visually-hidden">
        Загрузка изделия
      </h1>

      <div className="container">
        <div
          className="product-page-skeleton"
          aria-label="Загрузка изделия"
          aria-busy="true"
        >
          <div className="skeleton product-page-skeleton__image" />

          <div className="product-page-skeleton__content">
            <div className="skeleton product-page-skeleton__eyebrow" />
            <div className="skeleton product-page-skeleton__title" />
            <div className="skeleton product-page-skeleton__line" />
            <div className="skeleton product-page-skeleton__line" />
            <div className="skeleton product-page-skeleton__line product-page-skeleton__line--short" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function RouteFallback() {
  return (
    <main className="page-shell">
      <div className="container">
        <div
          className="route-fallback"
          role="status"
          aria-live="polite"
        >
          <span
            className="route-fallback__spinner"
            aria-hidden="true"
          />
          <span>Загрузка страницы…</span>
        </div>
      </div>
    </main>
  );
}
