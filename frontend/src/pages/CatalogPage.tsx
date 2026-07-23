import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getProducts } from "../api/products";
import { CategoryFilter } from "../components/CategoryFilter";
import { ProductGrid } from "../components/ProductGrid";
import { buttonClassName } from "../components/ui/Button";
import { FeedbackState } from "../components/ui/FeedbackState";
import { SectionHeading } from "../components/ui/SectionHeading";
import { CatalogSkeleton } from "../components/ui/Skeleton";
import { AtelierStory } from "../features/catalog/AtelierStory";
import {
  CategoryGrid,
  type CategorySummary,
} from "../features/catalog/CategoryGrid";
import { ContactCTA } from "../features/catalog/ContactCTA";
import { CraftPrinciples } from "../features/catalog/CraftPrinciples";
import { FeaturedWorks } from "../features/catalog/FeaturedWorks";
import { Hero } from "../features/catalog/Hero";
import { CONTACTS, SECTIONS } from "../routes";
import type { Product } from "../types/product";
import { getApiErrorMessage } from "../utils/errors";

const ALL_CATEGORY = "Все изделия";

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const selectedCategory = searchParams.get("category") || ALL_CATEGORY;

  async function loadProducts(signal?: AbortSignal) {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProducts(signal);

      setProducts(data);
    } catch (requestError) {
      if (signal?.aborted) {
        return;
      }

      setError(
        getApiErrorMessage(requestError, "Не удалось загрузить коллекцию."),
      );
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    document.title = "VERSTAK — авторские изделия из дерева";

    const controller = new AbortController();

    void loadProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((product) => product.category)),
    );

    return [ALL_CATEGORY, ...unique];
  }, [products]);

  const categorySummaries = useMemo<CategorySummary[]>(() => {
    return categories
      .filter((category) => category !== ALL_CATEGORY)
      .map((category) => {
        const categoryProducts = products.filter(
          (product) => product.category === category,
        );

        return {
          name: category,
          count: categoryProducts.length,
          image: categoryProducts[0].coverImage,
        };
      });
  }, [categories, products]);

  useEffect(() => {
    if (
      isLoading ||
      selectedCategory === ALL_CATEGORY ||
      categories.includes(selectedCategory)
    ) {
      return;
    }

    const next = new URLSearchParams(searchParams);

    next.delete("category");

    setSearchParams(next, {
      replace: true,
    });
  }, [categories, isLoading, searchParams, selectedCategory, setSearchParams]);

  const visibleProducts = useMemo(() => {
    if (selectedCategory === ALL_CATEGORY) {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const heroProduct = products[0] ?? null;

  const featuredProducts = products.slice(0, 3);

  const contactLink = heroProduct?.managerLink || CONTACTS.telegram;

  function selectCategory(category: string) {
    const next = new URLSearchParams(searchParams);

    if (category === ALL_CATEGORY) {
      next.delete("category");
    } else {
      next.set("category", category);
    }

    setSearchParams(next, {
      replace: false,
    });
  }

  return (
    <main id="main-content">
      <Hero product={heroProduct} contactLink={contactLink} />

      {!isLoading && !error && <CategoryGrid categories={categorySummaries} />}

      {!isLoading && !error && <FeaturedWorks products={featuredProducts} />}

      <section id={SECTIONS.catalog} className="catalog-section">
        <div className="container">
          <SectionHeading
            eyebrow="Полная коллекция"
            title="Работы мастерской"
            description="Выберите категорию и откройте подробную презентацию изделия."
            meta={
              !isLoading && !error ? (
                <span className="result-count">
                  {visibleProducts.length}{" "}
                  {visibleProducts.length === 1 ? "изделие" : "изделий"}
                </span>
              ) : null
            }
          />

          {!isLoading && !error && categories.length > 1 && (
            <CategoryFilter
              categories={categories}
              selected={selectedCategory}
              onChange={selectCategory}
            />
          )}

          {isLoading && <CatalogSkeleton />}

          {!isLoading && error && (
            <FeedbackState
              tone="error"
              title="Коллекция временно недоступна"
              description={error}
              action={
                <button
                  className={buttonClassName({
                    variant: "primary",
                  })}
                  type="button"
                  onClick={() => void loadProducts()}
                >
                  Повторить
                </button>
              }
            />
          )}

          {!isLoading && !error && visibleProducts.length === 0 && (
            <FeedbackState
              title="В этой категории пока нет изделий"
              description="Выберите другую категорию или сбросьте фильтр."
              action={
                <button
                  className={buttonClassName({
                    variant: "secondary",
                  })}
                  type="button"
                  onClick={() => selectCategory(ALL_CATEGORY)}
                >
                  Показать всё
                </button>
              }
            />
          )}

          {!isLoading && !error && visibleProducts.length > 0 && (
            <ProductGrid products={visibleProducts} />
          )}
        </div>
      </section>

      <AtelierStory />
      <CraftPrinciples />

      <ContactCTA contactLink={contactLink} />
    </main>
  );
}
