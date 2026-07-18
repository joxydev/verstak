import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../api/products';
import type { Product } from '../types/product';

function formatPrice(value: string | number): string {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return String(value);
  }

  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
  }).format(price);
}

export function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!Number.isInteger(productId) || productId <= 0) {
        setError('Некорректный идентификатор товара.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getProduct(productId);
        setProduct(data);
      } catch (requestError) {
        if (
          axios.isAxiosError(requestError) &&
          requestError.response?.status === 404
        ) {
          setError('Товар не найден.');
        } else {
          setError('Не удалось загрузить информацию о товаре.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <main className="page-section">
        <div className="container">
          <div className="status-card">
            <div className="loader" />
            <p>Загружаем товар...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="page-section">
        <div className="container">
          <div className="status-card status-card--error">
            <h1>Товар недоступен</h1>
            <p>{error ?? 'Товар не найден.'}</p>

            <Link className="button button--primary" to="/">
              Вернуться в каталог
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-section">
      <div className="container">
        <Link className="back-link" to="/">
          ← Назад в каталог
        </Link>

        <article className="product-details">
          <div className="product-details__media">
            <img
              className="product-details__image"
              src={product.coverImage}
              alt={product.title}
            />
          </div>

          <div className="product-details__content">
            <span className="eyebrow">{product.category}</span>

            <h1>{product.title}</h1>

            <p className="product-details__description">
              {product.description}
            </p>

            <dl className="product-specifications">
              {product.wood && (
                <div>
                  <dt>Материал</dt>
                  <dd>{product.wood}</dd>
                </div>
              )}

              {product.size && (
                <div>
                  <dt>Размер</dt>
                  <dd>{product.size}</dd>
                </div>
              )}

              <div>
                <dt>Категория</dt>
                <dd>{product.category}</dd>
              </div>
            </dl>

            <div className="product-details__order">
              <strong>{formatPrice(product.price)} MDL</strong>

              <a
                className="button button--primary"
                href={product.managerLink}
                target="_blank"
                rel="noreferrer"
              >
                Связаться с менеджером
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
