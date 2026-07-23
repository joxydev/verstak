import { useEffect, useMemo, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  createProduct,
  getAdminProduct,
  resolveProductImageUrl,
  updateProduct,
  type ProductPayload,
} from "../api/admin-products";

import { buttonClassName } from "../components/ui/Button";

import { FeedbackState } from "../components/ui/FeedbackState";

import { Notice } from "../components/ui/Notice";

import { RouteFallback } from "../components/ui/Skeleton";

import { ProductForm } from "../features/admin-products/ProductForm";

import {
  createEmptyProductForm,
  productToForm,
  type ProductFormState,
} from "../features/admin-products/productForm";

import { ROUTES } from "../routes";

import { getApiErrorMessage, getHttpStatus } from "../utils/errors";

export function AdminProductEditorPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const isEditMode = id !== undefined;

  const productId = Number(id);

  const emptyForm = useMemo(() => createEmptyProductForm(), []);

  const [initialValue, setInitialValue] = useState<ProductFormState | null>(
    isEditMode ? null : emptyForm,
  );

  const [isLoading, setIsLoading] = useState(isEditMode);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = isEditMode
      ? "Редактирование товара — VERSTAK"
      : "Новый товар — VERSTAK";

    if (!isEditMode) {
      setInitialValue(emptyForm);

      setIsLoading(false);
      return;
    }

    if (!Number.isInteger(productId) || productId <= 0) {
      setError("Некорректный идентификатор товара.");

      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadProduct() {
      setIsLoading(true);
      setError(null);

      try {
        const product = await getAdminProduct(productId, controller.signal);

        setInitialValue(productToForm(product));

        document.title = `${product.title} — редактирование`;
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }

        const status = getHttpStatus(loadError);

        setError(
          status === 404
            ? "Товар не найден."
            : getApiErrorMessage(loadError, "Не удалось загрузить товар."),
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
  }, [emptyForm, isEditMode, productId]);

  async function handleSave(payload: ProductPayload) {
    setIsSaving(true);
    setError(null);

    try {
      const resolvedImageUrl = await resolveProductImageUrl(payload.coverImage);

      const finalPayload = {
        ...payload,
        coverImage: resolvedImageUrl,
      };

      if (isEditMode) {
        const updated = await updateProduct(productId, finalPayload);

        navigate(ROUTES.admin, {
          replace: true,
          state: {
            notice: `Товар «${updated.title}» обновлён`,
          },
        });

        return;
      }

      const created = await createProduct(finalPayload);

      navigate(ROUTES.admin, {
        replace: true,
        state: {
          notice: `Товар «${created.title}» создан`,
        },
      });
    } catch (saveError) {
      setError(
        getApiErrorMessage(
          saveError,
          isEditMode
            ? "Не удалось сохранить изменения."
            : "Не удалось создать товар.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <RouteFallback />;
  }

  if (error && !initialValue) {
    return (
      <div className="admin-editor-page">
        <FeedbackState
          tone="error"
          title="Редактор недоступен"
          description={error}
          action={
            <Link
              className={buttonClassName({
                variant: "primary",
              })}
              to={ROUTES.admin}
            >
              Вернуться к товарам
            </Link>
          }
        />
      </div>
    );
  }

  if (!initialValue) {
    return null;
  }

  return (
    <div className="admin-editor-page">
      <header className="admin-editor-header">
        <div>
          <Link className="admin-editor-header__back" to={ROUTES.admin}>
            ← К каталогу
          </Link>

          <span className="admin-page-header__eyebrow">
            {isEditMode ? `Редактирование ID ${productId}` : "Новый товар"}
          </span>

          <h1>{isEditMode ? "Изменить товар" : "Добавить товар"}</h1>

          <p>
            Заполните данные, проверьте изображение и выберите состояние
            публикации.
          </p>
        </div>
      </header>

      <Notice tone="error" message={error} onDismiss={() => setError(null)} />

      <ProductForm
        initialValue={initialValue}
        mode={isEditMode ? "edit" : "create"}
        isSaving={isSaving}
        onSubmit={handleSave}
        onResolveImage={resolveProductImageUrl}
        onCancel={() => navigate(ROUTES.admin)}
      />
    </div>
  );
}
