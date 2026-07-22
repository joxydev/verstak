import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import {
  getProducts,
} from '../api/products';
import {
  BrandLogo,
} from '../components/BrandLogo';
import {
  CategoryFilter,
} from '../components/CategoryFilter';
import {
  ProductGrid,
} from '../components/ProductGrid';
import {
  buttonClassName,
} from '../components/ui/Button';
import {
  CatalogSkeleton,
} from '../components/ui/Skeleton';
import {
  FeedbackState,
} from '../components/ui/FeedbackState';
import {
  SectionHeading,
} from '../components/ui/SectionHeading';
import {
  CONTACTS,
  ROUTES,
} from '../routes';
import type {
  Product,
} from '../types/product';
import {
  getApiErrorMessage,
} from '../utils/errors';

const ALL_CATEGORY =
  'Все изделия';

export function CatalogPage() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const selectedCategory =
    searchParams.get(
      'category',
    ) || ALL_CATEGORY;

  async function loadProducts(
    signal?: AbortSignal,
  ) {
    setIsLoading(true);
    setError(null);

    try {
      const data =
        await getProducts(signal);

      setProducts(data);
    } catch (requestError) {
      if (signal?.aborted) {
        return;
      }

      setError(
        getApiErrorMessage(
          requestError,
          'Не удалось загрузить коллекцию.',
        ),
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    document.title =
      'VERSTAK — авторские изделия из дерева';

    const controller =
      new AbortController();

    void loadProducts(
      controller.signal,
    );

    return () => {
      controller.abort();
    };
  }, []);

  const categories =
    useMemo(() => {
      const unique =
        Array.from(
          new Set(
            products.map(
              (product) =>
                product.category,
            ),
          ),
        );

      return [
        ALL_CATEGORY,
        ...unique,
      ];
    }, [
      products,
    ]);

  useEffect(() => {
    if (
      isLoading ||
      selectedCategory ===
        ALL_CATEGORY ||
      categories.includes(
        selectedCategory,
      )
    ) {
      return;
    }

    const next =
      new URLSearchParams(
        searchParams,
      );

    next.delete('category');

    setSearchParams(
      next,
      {
        replace: true,
      },
    );
  }, [
    categories,
    isLoading,
    searchParams,
    selectedCategory,
    setSearchParams,
  ]);

  const visibleProducts =
    useMemo(() => {
      if (
        selectedCategory ===
        ALL_CATEGORY
      ) {
        return products;
      }

      return products.filter(
        (product) =>
          product.category ===
          selectedCategory,
      );
    }, [
      products,
      selectedCategory,
    ]);

  const heroProduct =
    products[0] ?? null;

  function selectCategory(
    category: string,
  ) {
    const next =
      new URLSearchParams(
        searchParams,
      );

    if (
      category ===
      ALL_CATEGORY
    ) {
      next.delete('category');
    } else {
      next.set(
        'category',
        category,
      );
    }

    setSearchParams(next, {
      replace: true,
    });
  }

  return (
    <main>
      <section className="atelier-hero">
        <div className="container atelier-hero__grid">
          <div className="atelier-hero__copy">
            <span className="eyebrow">
              Авторская мастерская · Moldova
            </span>

            <h1>
              Изделия из дерева,
              созданные на поколения
            </h1>

            <p className="atelier-hero__description">
              Нарды, шахматы,
              корабли, иконы,
              шкатулки и
              декоративные работы
              ручного изготовления.
            </p>

            <div className="atelier-hero__actions">
              <a
                className={buttonClassName({
                  variant: 'primary',
                  size: 'large',
                })}
                href="#catalog"
              >
                Смотреть коллекцию
              </a>

              <a
                className={buttonClassName({
                  variant: 'secondary',
                  size: 'large',
                })}
                href={
                  heroProduct
                    ?.managerLink ||
                  CONTACTS.telegram
                }
                target="_blank"
                rel="noreferrer"
              >
                Связаться с мастерской
              </a>
            </div>

            <dl className="atelier-hero__facts">
              <div>
                <dt>Происхождение</dt>
                <dd>Moldova</dd>
              </div>

              <div>
                <dt>Производство</dt>
                <dd>Ручная работа</dd>
              </div>

              <div>
                <dt>Материал</dt>
                <dd>Натуральное дерево</dd>
              </div>
            </dl>
          </div>

          <div className="atelier-hero__media">
            {heroProduct ? (
              <Link
                className="atelier-hero__image-link"
                to={ROUTES.product(
                  heroProduct.id,
                )}
                aria-label={`Открыть изделие «${heroProduct.title}»`}
              >
                <img
                  src={
                    heroProduct.coverImage
                  }
                  alt={
                    heroProduct.title
                  }
                  width={1080}
                  height={1350}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />

                <span className="atelier-hero__caption">
                  <small>
                    Из коллекции
                  </small>

                  <strong>
                    {heroProduct.title}
                  </strong>
                </span>
              </Link>
            ) : (
              <div className="atelier-hero__placeholder">
                <BrandLogo />
              </div>
            )}

            <span
              className="atelier-hero__monogram"
              aria-hidden="true"
            >
              V
            </span>
          </div>
        </div>
      </section>

      <section
        id="catalog"
        className="catalog-section"
      >
        <div className="container">
          <SectionHeading
            eyebrow="Коллекция VERSTAK"
            title="Авторские работы"
            description="Каждое изделие создаётся отдельно — с собственным характером, материалом и деталями ручной обработки."
            meta={
              !isLoading &&
              !error ? (
                <span className="result-count">
                  {
                    visibleProducts.length
                  }
                  {' '}
                  {
                    visibleProducts.length ===
                    1
                      ? 'изделие'
                      : 'изделий'
                  }
                </span>
              ) : null
            }
          />

          {!isLoading &&
            !error &&
            categories.length > 1 && (
              <CategoryFilter
                categories={
                  categories
                }
                selected={
                  selectedCategory
                }
                onChange={
                  selectCategory
                }
              />
            )}

          {isLoading && (
            <CatalogSkeleton />
          )}

          {!isLoading &&
            error && (
              <FeedbackState
                tone="error"
                title="Коллекция временно недоступна"
                description={error}
                action={
                  <button
                    className={buttonClassName({
                      variant:
                        'primary',
                    })}
                    type="button"
                    onClick={() =>
                      void loadProducts()
                    }
                  >
                    Повторить
                  </button>
                }
              />
            )}

          {!isLoading &&
            !error &&
            visibleProducts.length ===
              0 && (
              <FeedbackState
                title="В этой категории пока нет изделий"
                description="Выберите другую категорию или вернитесь ко всей коллекции."
                action={
                  <button
                    className={buttonClassName({
                      variant:
                        'secondary',
                    })}
                    type="button"
                    onClick={() =>
                      selectCategory(
                        ALL_CATEGORY,
                      )
                    }
                  >
                    Показать всё
                  </button>
                }
              />
            )}

          {!isLoading &&
            !error &&
            visibleProducts.length >
              0 && (
              <ProductGrid
                products={
                  visibleProducts
                }
              />
            )}
        </div>
      </section>

      <section
        id="atelier"
        className="atelier-story"
      >
        <div className="container atelier-story__grid">
          <div className="atelier-story__identity">
            <BrandLogo />

            <span>
              Wood Craftsmanship
              <br />
              Moldova
            </span>
          </div>

          <div className="atelier-story__copy">
            <span className="eyebrow">
              Мастерская
            </span>

            <h2>
              Ремесло, в котором
              важна каждая деталь
            </h2>

            <p>
              VERSTAK объединяет
              работу с натуральным
              деревом, художественную
              резьбу и современную
              точность изготовления.
              Мы создаём предметы,
              рассчитанные не на один
              сезон, а на долгую жизнь.
            </p>

            <a
              className={buttonClassName({
                variant: 'quiet',
              })}
              href={CONTACTS.telegram}
              target="_blank"
              rel="noreferrer"
            >
              Обсудить индивидуальную работу
              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
