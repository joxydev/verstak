import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProduct, getProducts } from "../api/products";
import { ProductGrid } from "../components/ProductGrid";
import { buttonClassName } from "../components/ui/Button";
import { FeedbackState } from "../components/ui/FeedbackState";
import { ProductPrice } from "../components/ui/ProductPrice";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ProductPageSkeleton } from "../components/ui/Skeleton";
import { ProductMedia } from "../features/product/ProductMedia";
import { ProductSpecifications } from "../features/product/ProductSpecifications";
import { ROUTES } from "../routes";
import type { Product } from "../types/product";
import { getApiErrorMessage, getHttpStatus } from "../utils/errors";

export function ProductPage() {
  const { id } = useParams();

  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [shareNotice, setShareNotice] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      if (!Number.isInteger(productId) || productId <= 0) {
        setError("Некорректный идентификатор изделия.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setProduct(null);

      try {
        const currentProduct = await getProduct(productId, controller.signal);

        setProduct(currentProduct);

        document.title = `${currentProduct.title} — VERSTAK`;
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        const status = getHttpStatus(requestError);

        setError(
          status === 404
            ? "Изделие не найдено или больше не опубликовано."
            : getApiErrorMessage(
                requestError,
                "Не удалось загрузить информацию об изделии.",
              ),
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      controller.abort();
    };
  }, [productId]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const controller = new AbortController();

    void getProducts(controller.signal)
      .then((allProducts) => {
        setRelatedProducts(
          allProducts
            .filter(
              (item) =>
                item.id !== product.id && item.category === product.category,
            )
            .slice(0, 3),
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setRelatedProducts([]);
        }
      });

    return () => {
      controller.abort();
    };
  }, [product]);

  useEffect(() => {
    if (!shareNotice) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShareNotice(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [shareNotice]);

  async function handleShare() {
    if (!product) {
      return;
    }

    const shareData = {
      title: `${product.title} — VERSTAK`,
      text: `Посмотрите изделие «${product.title}» мастерской VERSTAK`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);

        setShareNotice("Ссылка отправлена");

        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);

        setShareNotice("Ссылка скопирована");

        return;
      }

      setShareNotice("Скопируйте адрес страницы из строки браузера");
    } catch (shareError) {
      if (
        shareError instanceof DOMException &&
        shareError.name === "AbortError"
      ) {
        return;
      }

      setShareNotice("Не удалось поделиться ссылкой");
    }
  }

  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  if (error || !product) {
    return (
      <main id="main-content" className="page-shell">
        <div className="container">
          <FeedbackState
            tone="error"
            title="Изделие недоступно"
            description={error || "Изделие не найдено."}
            action={
              <Link
                className={buttonClassName({
                  variant: "primary",
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
    <main id="main-content" className="product-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Навигационная цепочка">
          <Link to={ROUTES.home}>Коллекция</Link>

          <span aria-hidden="true">/</span>

          <span aria-current="page">{product.title}</span>
        </nav>

        <article className="product-showcase">
          <ProductMedia product={product} />

          <div className="product-showcase__information">
            <header className="product-showcase__heading">
              <span className="product-badge">{product.category}</span>

              <h1>{product.title}</h1>

              <ProductPrice value={product.price} size="large" />
            </header>

            <div className="product-showcase__description">
              {product.description
                .split("\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>

            <ProductSpecifications product={product} />

            <aside className="product-showcase__note">
              <strong>Уникальная работа</strong>

              <p>
                Оттенок и естественный рисунок древесины могут немного
                отличаться. Именно это делает каждое изделие индивидуальным.
              </p>
            </aside>

            <div className="product-contact">
              <div className="product-contact__copy">
                <strong>Обсудить заказ</strong>

                <p>Уточните наличие, срок изготовления и условия доставки.</p>
              </div>

              <a
                className={buttonClassName({
                  variant: "primary",
                  size: "large",
                  block: true,
                })}
                href={product.managerLink}
                target="_blank"
                rel="noreferrer"
              >
                Написать мастеру в Telegram
                <span aria-hidden="true">↗</span>
              </a>

              <button
                className={buttonClassName({
                  variant: "secondary",
                  block: true,
                })}
                type="button"
                onClick={() => void handleShare()}
              >
                Поделиться изделием
              </button>

              <div
                className="product-contact__notice"
                role="status"
                aria-live="polite"
              >
                {shareNotice}
              </div>
            </div>
          </div>
        </article>

        {relatedProducts.length > 0 && (
          <section className="related-products">
            <SectionHeading
              eyebrow="Продолжение коллекции"
              title="Другие работы"
              description={`Изделия из категории «${product.category}».`}
            />

            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </main>
  );
}
