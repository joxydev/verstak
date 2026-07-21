import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  resolveProductImageUrl,
  setProductPublication,
  updateProduct,
  type ProductPayload,
} from "../api/admin-products";

import { useTelegram } from "../telegram/TelegramProvider";

import type { Product } from "../types/product";

interface ProductFormState {
  title: string;
  description: string;
  price: string;
  category: string;
  wood: string;
  size: string;
  managerLink: string;
  coverImage: string;
  isPublished: boolean;
}

const emptyForm: ProductFormState = {
  title: "",
  description: "",
  price: "",
  category: "",
  wood: "",
  size: "",
  managerLink: "",
  coverImage: "",
  isPublished: false,
};

function productToForm(product: Product): ProductFormState {
  return {
    title: product.title,
    description: product.description,
    price: String(product.price),
    category: product.category,
    wood: product.wood ?? "",
    size: product.size ?? "",
    managerLink: product.managerLink,
    coverImage: product.coverImage,
    isPublished: product.isPublished,
  };
}

function formToPayload(
  form: ProductFormState,
  resolvedImageUrl: string,
): ProductPayload {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    price: form.price.trim(),
    category: form.category.trim(),
    wood: form.wood.trim() || undefined,
    size: form.size.trim() || undefined,
    managerLink: form.managerLink.trim(),
    coverImage: resolvedImageUrl,
    isPublished: form.isPublished,
  };
}

function formatPrice(price: Product["price"]): string {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return String(price);
  }

  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string | string[];
          };
        };
      }
    ).response;

    const message = response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return error instanceof Error
    ? error.message
    : "Произошла неизвестная ошибка";
}

export function AdminProductsPage() {
  const { user, role } = useTelegram();

  const [products, setProducts] = useState<Product[]>([]);

  const [form, setForm] = useState<ProductFormState>(emptyForm);

  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [isResolvingImage, setIsResolvingImage] = useState(false);

  const [busyProductId, setBusyProductId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [notice, setNotice] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        String(product.id).includes(query),
    );
  }, [products, search]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAdminProducts();

      setProducts(response);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  function updateField<Key extends keyof ProductFormState>(
    key: Key,
    value: ProductFormState[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setEditingProductId(null);
    setForm(emptyForm);
    setError(null);
  }

  function startCreate() {
    resetForm();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function startEdit(product: Product) {
    setEditingProductId(product.id);

    setForm(productToForm(product));

    setError(null);
    setNotice(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function resolveImage(showNotice = true): Promise<string> {
    const currentUrl = form.coverImage.trim();

    if (!currentUrl) {
      throw new Error("Укажите ссылку на изображение");
    }

    setIsResolvingImage(true);

    try {
      const resolvedUrl = await resolveProductImageUrl(currentUrl);

      updateField("coverImage", resolvedUrl);

      if (showNotice) {
        setNotice(
          currentUrl === resolvedUrl
            ? "Ссылка на изображение проверена"
            : "Ссылка ibb.co преобразована в прямой адрес изображения",
        );
      }

      return resolvedUrl;
    } finally {
      setIsResolvingImage(false);
    }
  }

  async function handleResolveImage() {
    setError(null);
    setNotice(null);

    try {
      await resolveImage();
    } catch (resolveError) {
      setError(getErrorMessage(resolveError));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setError(null);
    setNotice(null);

    try {
      const resolvedImageUrl = await resolveImage(false);

      const payload = formToPayload(form, resolvedImageUrl);

      if (editingProductId === null) {
        const created = await createProduct(payload);

        setProducts((current) => [created, ...current]);

        setNotice(`Товар «${created.title}» создан`);
      } else {
        const updated = await updateProduct(editingProductId, payload);

        setProducts((current) =>
          current.map((product) =>
            product.id === updated.id ? updated : product,
          ),
        );

        setNotice(`Товар «${updated.title}» обновлён`);
      }

      resetForm();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublicationToggle(product: Product) {
    setBusyProductId(product.id);
    setError(null);
    setNotice(null);

    try {
      const updated = await setProductPublication(
        product.id,
        !product.isPublished,
      );

      setProducts((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    } finally {
      setBusyProductId(null);
    }
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Удалить товар «${product.title}»? Это действие нельзя отменить.`,
    );

    if (!confirmed) {
      return;
    }

    setBusyProductId(product.id);
    setError(null);
    setNotice(null);

    try {
      await deleteProduct(product.id);

      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );

      if (editingProductId === product.id) {
        resetForm();
      }

      setNotice(`Товар «${product.title}» удалён`);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setBusyProductId(null);
    }
  }

  return (
    <main className="page-section admin-page">
      <div className="container">
        <header className="admin-page__header">
          <div>
            <span className="eyebrow">VERSTAK Control</span>

            <h1>Управление каталогом</h1>

            <p>
              {user?.firstName || user?.username}
              {" · "}
              {role}
            </p>
          </div>

          <button
            className="button button--secondary"
            type="button"
            onClick={() => void loadProducts()}
            disabled={isLoading}
          >
            Обновить список
          </button>
        </header>

        <section className="admin-summary">
          <article className="admin-summary__item">
            <span>Всего</span>
            <strong>{products.length}</strong>
          </article>

          <article className="admin-summary__item">
            <span>Опубликовано</span>
            <strong>
              {products.filter((product) => product.isPublished).length}
            </strong>
          </article>

          <article className="admin-summary__item">
            <span>Черновики</span>
            <strong>
              {products.filter((product) => !product.isPublished).length}
            </strong>
          </article>
        </section>

        {error && (
          <div className="admin-alert">
            <strong>Ошибка</strong>
            <span>{error}</span>
          </div>
        )}

        {notice && <div className="admin-notice">{notice}</div>}

        <section className="admin-editor">
          <header className="admin-editor__header">
            <div>
              <span className="eyebrow">
                {editingProductId === null
                  ? "Новый товар"
                  : `Редактирование ID ${editingProductId}`}
              </span>

              <h2>
                {editingProductId === null
                  ? "Добавить товар"
                  : "Изменить товар"}
              </h2>
            </div>

            {editingProductId !== null && (
              <button
                className="button button--secondary"
                type="button"
                onClick={resetForm}
              >
                Отменить
              </button>
            )}
          </header>

          <form className="admin-form" onSubmit={handleSubmit}>
            <label className="admin-field admin-field--wide">
              <span>Название *</span>

              <input
                required
                maxLength={150}
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
              />
            </label>

            <label className="admin-field">
              <span>Категория *</span>

              <input
                required
                maxLength={100}
                placeholder="Нарды"
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
              />
            </label>

            <label className="admin-field">
              <span>Цена MDL *</span>

              <input
                required
                inputMode="decimal"
                pattern="\d+(\.\d{1,2})?"
                placeholder="1800.00"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
              />
            </label>

            <label className="admin-field">
              <span>Материал</span>

              <input
                maxLength={100}
                placeholder="Ясень"
                value={form.wood}
                onChange={(event) => updateField("wood", event.target.value)}
              />
            </label>

            <label className="admin-field">
              <span>Размер</span>

              <input
                maxLength={100}
                placeholder="60 × 30 см"
                value={form.size}
                onChange={(event) => updateField("size", event.target.value)}
              />
            </label>

            <label className="admin-field admin-field--wide">
              <span>Описание *</span>

              <textarea
                required
                maxLength={5000}
                rows={6}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
              />
            </label>

            <label className="admin-field admin-field--wide">
              <span>Ссылка менеджера *</span>

              <input
                required
                type="url"
                placeholder="https://t.me/username"
                value={form.managerLink}
                onChange={(event) =>
                  updateField("managerLink", event.target.value)
                }
              />
            </label>

            <div className="admin-field admin-field--wide">
              <span>Изображение *</span>

              <div className="admin-url-row">
                <input
                  required
                  type="url"
                  placeholder="https://ibb.co/... или https://i.ibb.co/.../image.jpg"
                  value={form.coverImage}
                  onChange={(event) =>
                    updateField("coverImage", event.target.value)
                  }
                />

                <button
                  className="button button--secondary"
                  type="button"
                  disabled={isResolvingImage || !form.coverImage.trim()}
                  onClick={() => void handleResolveImage()}
                >
                  {isResolvingImage ? "Проверка..." : "Проверить URL"}
                </button>
              </div>

              <small>
                Можно вставить страницу ibb.co. Система автоматически найдёт
                прямую ссылку на изображение.
              </small>
            </div>

            {form.coverImage && (
              <div className="admin-image-preview admin-field--wide">
                <img src={form.coverImage} alt="Предпросмотр товара" />

                <span>Предпросмотр изображения</span>
              </div>
            )}

            <label className="admin-checkbox admin-field--wide">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) =>
                  updateField("isPublished", event.target.checked)
                }
              />

              <span>Сразу опубликовать товар</span>
            </label>

            <div className="admin-form__actions admin-field--wide">
              <button
                className="button button--primary"
                type="submit"
                disabled={isSaving || isResolvingImage}
              >
                {isSaving
                  ? "Сохранение..."
                  : editingProductId === null
                    ? "Создать товар"
                    : "Сохранить изменения"}
              </button>

              <button
                className="button button--secondary"
                type="button"
                onClick={startCreate}
              >
                Очистить форму
              </button>
            </div>
          </form>
        </section>

        <section className="admin-catalog">
          <header className="admin-catalog__header">
            <div>
              <span className="eyebrow">Каталог</span>

              <h2>Товары</h2>
            </div>

            <input
              className="admin-search"
              type="search"
              placeholder="Поиск по названию, категории или ID"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </header>

          {isLoading ? (
            <div className="status-card">
              <div className="loader" />
              <p>Загружаем товары...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="status-card">
              <h2>Ничего не найдено</h2>
              <p>Измени поисковый запрос или создай новый товар.</p>
            </div>
          ) : (
            <div className="admin-products">
              {filteredProducts.map((product) => {
                const isBusy = busyProductId === product.id;

                return (
                  <article className="admin-product" key={product.id}>
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
                            product.isPublishe
                              ? "admin-status admin-status--published"
                              : "admin-status admin-status--draft"
                          }
                        >
                          {product.isPublished ? "Опубликован" : "Черновик"}
                        </span>
                      </div>

                      <div className="admin-product__meta">
                        <span>ID: {product.id}</span>

                        <strong>
                          {formatPrice(product.price)}
                          {" MDL"}
                        </strong>
                      </div>

                      <div className="admin-product__actions">
                        <button
                          className="button button--secondary"
                          type="button"
                          disabled={isBusy}
                          onClick={() => startEdit(product)}
                        >
                          Редактировать
                        </button>

                        <button
                          className="button button--secondary"
                          type="button"
                          disabled={isBusy}
                          onClick={() => void handlePublicationToggle(product)}
                        >
                          {product.isPublished ? "Скрыть" : "Опубликовать"}
                        </button>

                        <button
                          className="button admin-button--danger"
                          type="button"
                          disabled={isBusy}
                          onClick={() => void handleDelete(product)}
                        >
                          {isBusy ? "Подождите..." : "Удалить"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
