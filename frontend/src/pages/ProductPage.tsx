import {
  useEffect,
  useState,
} from 'react';
import {
  Link,
  useParams,
} from 'react-router-dom';

import {
  getProduct,
  getProducts,
} from '../api/products';
import {
  ProductGrid,
} from '../components/ProductGrid';
import {
  buttonClassName,
} from '../components/ui/Button';
import {
  FeedbackState,
} from '../components/ui/FeedbackState';
import {
  ProductPrice,
} from '../components/ui/ProductPrice';
import {
  SectionHeading,
} from '../components/ui/SectionHeading';
import {
  ProductPageSkeleton,
} from '../components/ui/Skeleton';
import {
  ROUTES,
} from '../routes';
import type {
  Product,
} from '../types/product';
import {
  getApiErrorMessage,
  getHttpStatus,
} from '../utils/errors';

export function ProductPage() {
  const {
    id,
  } = useParams();

  const productId =
    Number(id);

  const [
    product,
    setProduct,
  ] = useState<Product | null>(
    null,
  );

  const [
    relatedProducts,
    setRelatedProducts,
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

  const [
    hasImageError,
    setHasImageError,
  ] = useState(false);

  useEffect(() => {
    const controller =
      new AbortController();

    async function loadProduct() {
      if (
        !Number.isInteger(
          productId,
        ) ||
        productId <= 0
      ) {
        setError(
          'Некорректный идентификатор изделия.',
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setHasImageError(false);

      try {
        const [
          currentProduct,
          allProducts,
        ] = await Promise.all([
          getProduct(
            productId,
            controller.signal,
          ),
          getProducts(
            controller.signal,
          ),
        ]);

        setProduct(
          currentProduct,
        );

        setRelatedProducts(
          allProducts
            .filter(
              (item) =>
                item.id !==
                  currentProduct.id &&
                item.category ===
                  currentProduct.category,
            )
            .slice(0, 3),
        );

        document.title =
          `${currentProduct.title} — VERSTAK`;
      } catch (requestError) {
        if (
          controller.signal.aborted
        ) {
          return;
        }

        const status =
          getHttpStatus(
            requestError,
          );

        setError(
          status === 404
            ? 'Изделие не найдено или больше не опубликовано.'
            : getApiErrorMessage(
                requestError,
                'Не удалось загрузить информацию об изделии.',
              ),
        );
      } finally {
        if (
          !controller.signal.aborted
        ) {
          setIsLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      controller.abort();
    };
  }, [
    productId,
  ]);

  if (isLoading) {
    return (
      <ProductPageSkeleton />
    );
  }

  if (
    error ||
    !product
  ) {
    return (
      <main className="page-shell">
        <div className="container">
          <FeedbackState
            tone="error"
            title="Изделие недоступно"
            description={
              error ||
              'Изделие не найдено.'
            }
            action={
              <Link
                className={buttonClassName({
                  variant:
                    'primary',
                })}
                to={ROUTES.home}
              >
                Вернуться в коллекцию
              </Link>
            }
          />
        </div>
      </main>
    );
  }

  return (
    <main className="product-page">
      <div className="container">
        <nav
          className="breadcrumb"
          aria-label="Навигационная цепочка"
        >
          <Link
            to={ROUTES.home}
          >
            Коллекция
          </Link>

          <span aria-hidden="true">
            /
          </span>

          <span
            aria-current="page"
          >
            {product.title}
          </span>
        </nav>

        <article className="product-showcase">
          <div className="product-showcase__media">
            {!hasImageError ? (
              <img
                className="product-showcase__image"
                src={
                  product.coverImage
                }
                alt={
                  product.title
                }
                width={1200}
                height={1200}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={() =>
                  setHasImageError(
                    true,
                  )
                }
              />
            ) : (
              <div className="product-showcase__placeholder">
                <span aria-hidden="true">
                  V
                </span>

                <p>
                  Изображение временно
                  недоступно
                </p>
              </div>
            )}

            <span className="product-showcase__craft-label">
              Ручная работа · Moldova
            </span>
          </div>

          <div className="product-showcase__information">
            <div className="product-showcase__heading">
              <span className="product-badge">
                {product.category}
              </span>

              <h1>
                {product.title}
              </h1>

              <ProductPrice
                value={
                  product.price
                }
                size="large"
              />
            </div>

            <p className="product-showcase__description">
              {product.description}
            </p>

            <dl className="product-facts">
              {product.wood && (
                <div>
                  <dt>Материал</dt>
                  <dd>
                    {product.wood}
                  </dd>
                </div>
              )}

              {product.size && (
                <div>
                  <dt>Размер</dt>
                  <dd>
                    {product.size}
                  </dd>
                </div>
              )}

              <div>
                <dt>Изготовление</dt>
                <dd>
                  Ручная работа
                </dd>
              </div>

              <div>
                <dt>Происхождение</dt>
                <dd>Moldova</dd>
              </div>
            </dl>

            <div className="product-showcase__note">
              <strong>
                Индивидуальное изделие
              </strong>

              <p>
                Детали, оттенок и рисунок
                натурального дерева могут
                незначительно отличаться —
                это делает каждую работу
                уникальной.
              </p>
            </div>

            <a
              className={buttonClassName({
                variant: 'primary',
                size: 'large',
                block: true,
              })}
              href={
                product.managerLink
              }
              target="_blank"
              rel="noreferrer"
            >
              Связаться с мастерской
              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </article>

        {relatedProducts.length >
          0 && (
          <section className="related-products">
            <SectionHeading
              eyebrow="Продолжение коллекции"
              title="Похожие изделия"
              description={`Другие работы в категории «${product.category}».`}
            />

            <ProductGrid
              products={
                relatedProducts
              }
            />
          </section>
        )}
      </div>
    </main>
  );
}
