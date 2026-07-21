import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  getAdminProducts,
  setProductPublication,
} from '../api/admin-products';

import { useTelegram } from '../telegram/TelegramProvider';

import type { Product } from '../types/product';

function formatPrice(
  price: Product['price'],
): string {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return String(price);
  }

  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

function getErrorMessage(
  error: unknown,
): string {
  return error instanceof Error
    ? error.message
    : 'Произошла неизвестная ошибка';
}

export function AdminProductsPage() {
  const {
    user,
    role,
  } = useTelegram();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [updatingProductId, setUpdatingProductId] =
    useState<number | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response =
        await getAdminProducts();

      setProducts(response);
    } catch (loadError) {
      setError(
        getErrorMessage(loadError),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  async function handlePublicationToggle(
    product: Product,
  ) {
    setUpdatingProductId(product.id);
    setError(null);

    try {
      const updatedProduct =
        await setProductPublication(
          product.id,
          !product.isPublished,
        );

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === updatedProduct.id
            ? updatedProduct
            : currentProduct,
        ),
      );
    } catch (updateError) {
      setError(
        getErrorMessage(updateError),
      );
    } finally {
      setUpdatingProductId(null);
    }
  }

  return (
    <main className="page-section admin-page">
      <div className="container">
        <header className="admin-page__header">
          <div>
            <span className="eyebrow">
              Управление каталогом
            </span>

            <h1>Админ-панель</h1>

            <p>
              {user?.firstName || user?.username}
              {' · '}
              {role}
            </p>
          </div>

          <button
            className="button button--secondary"
            type="button"
            onClick={() => void loadProducts()}
            disabled={isLoading}
          >
            Обновить
          </button>
        </header>

        <section className="admin-summary">
          <article className="admin-summary__item">
            <span>Всего товаров</span>
            <strong>{products.length}</strong>
          </article>

          <article className="admin-summary__item">
            <span>Опубликовано</span>
            <strong>
              {
                products.filter(
                  (product) =>
                    product.isPublished,
                ).length
              }
            </strong>
          </article>

          <article className="admin-summary__item">
            <span>Черновики</span>
            <strong>
              {
                products.filter(
                  (product) =>
                    !product.isPublished,
                ).length
              }
            </strong>
          </article>
        </section>

        {error && (
          <div className="admin-alert">
            <strong>Ошибка запроса</strong>
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="status-card">
            <div className="loader" />
            <p>Загружаем товары...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="status-card">
            <h2>Товаров пока нет</h2>
            <p>
              На следующем этапе добавим форму
              создания товаров.
            </p>
          </div>
        ) : (
          <div className="admin-products">
            {products.map((product) => {
              const isUpdating =
                updatingProductId === product.id;

              return (
                <article
                  className="admin-product"
                  key={product.id}
                >
                  <img
                    className="admin-product__image"
                    src={product.coverImage}
                    alt={product.title}
                    loading="lazy"
                  />

                  <div className="admin-product__content">
                    <div className="admin-product__heading">
                      <div>
                        <span className="admin-product__category">
                          {product.category}
                        </span>

                        <h2>{product.title}</h2>
                      </div>

                      <span
                        className={
                          product.isPublished
                            ? 'admin-status admin-status--published'
                            : 'admin-status admin-status--draft'
                        }
                      >
                        {
                          product.isPublished
                            ? 'Опубликован'
                            : 'Черновик'
                        }
                      </span>
                    </div>

                    <div className="admin-product__meta">
                      <span>
                        ID: {product.id}
                      </span>

                      <strong>
                        {formatPrice(product.price)}
                        {' MDL'}
                      </strong>
                    </div>

                    <button
                      className="button button--secondary"
                      type="button"
                      disabled={isUpdating}
                      onClick={() =>
                        void handlePublicationToggle(
                          product,
                        )
                      }
                    >
                      {
                        isUpdating
                          ? 'Сохранение...'
                          : product.isPublished
                            ? 'Снять с публикации'
                            : 'Опубликовать'
                      }
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
