import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { getProducts } from '../api/products';
import type { Product } from '../types/product';

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProducts();
      setProducts(data);
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        setError(
          requestError.response?.data?.message ??
            'Не удалось получить каталог с сервера.',
        );
      } else {
        setError('Произошла неизвестная ошибка.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category)),
    );

    return ['Все', ...uniqueCategories];
  }, [products]);

  const visibleProducts = useMemo(() => {
    if (selectedCategory === 'Все') {
      return products;
    }

    return products.filter(
      (product) => product.category === selectedCategory,
    );
  }, [products, selectedCategory]);

  return (
    <>
      <section className="hero-section">
        <div className="container hero-section__content">
          <span className="eyebrow">Изделия ручной работы</span>

          <h1>VERSTAK</h1>

          <p>
            Авторские изделия из натурального дерева: корабли, нарды,
            шахматы, иконы, шкатулки и декоративные панно.
          </p>

          <a className="button button--primary" href="#catalog">
            Смотреть каталог
          </a>
        </div>
      </section>

      <main id="catalog" className="catalog-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Каталог</span>
              <h2>Наши работы</h2>
            </div>

            {!isLoading && !error && (
              <span className="products-count">
                Товаров: {visibleProducts.length}
              </span>
            )}
          </div>

          {!isLoading && !error && categories.length > 1 && (
            <div className="category-filter" aria-label="Категории товаров">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    selectedCategory === category
                      ? 'category-filter__button category-filter__button--active'
                      : 'category-filter__button'
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="status-card">
              <div className="loader" />
              <p>Загружаем каталог...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="status-card status-card--error">
              <h3>Каталог временно недоступен</h3>
              <p>{error}</p>

              <button
                className="button button--primary"
                type="button"
                onClick={() => void loadProducts()}
              >
                Повторить
              </button>
            </div>
          )}

          {!isLoading && !error && visibleProducts.length === 0 && (
            <div className="status-card">
              <h3>Товаров пока нет</h3>
              <p>В выбранной категории пока нет опубликованных изделий.</p>
            </div>
          )}

          {!isLoading && !error && visibleProducts.length > 0 && (
            <div className="products-grid">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
