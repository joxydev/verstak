import { type FormEvent, useEffect, useRef, useState } from "react";

import { Button } from "../../components/ui/Button";

import { Notice } from "../../components/ui/Notice";

import { ProductImage } from "../../components/ui/ProductImage";

import type { ProductPayload } from "../../api/admin-products";

import {
  formToPayload,
  validateImageUrl,
  validateProductForm,
  type ProductFormErrors,
  type ProductFormState,
  type ProductTextField,
} from "./productForm";

interface ProductFormProps {
  initialValue: ProductFormState;
  mode: "create" | "edit";
  isSaving: boolean;
  onSubmit: (payload: ProductPayload) => Promise<void>;
  onResolveImage: (url: string) => Promise<string>;
  onCancel: () => void;
}

function fieldErrorId(field: ProductTextField): string {
  return `product-${field}-error`;
}

export function ProductForm({
  initialValue,
  mode,
  isSaving,
  onSubmit,
  onResolveImage,
  onCancel,
}: ProductFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState<ProductFormState>(initialValue);

  const [errors, setErrors] = useState<ProductFormErrors>({});

  const [isResolvingImage, setIsResolvingImage] = useState(false);

  const [imageNotice, setImageNotice] = useState<string | null>(null);

  useEffect(() => {
    setForm(initialValue);
    setErrors({});
    setImageNotice(null);
  }, [initialValue]);

  function updateField<Key extends keyof ProductFormState>(
    key: Key,
    value: ProductFormState[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    if (key !== "isPublished") {
      const errorKey = key as ProductTextField;

      setErrors((current) => {
        if (!current[errorKey]) {
          return current;
        }

        const next: ProductFormErrors = {
          ...current,
        };

        delete next[errorKey];

        return next;
      });
    }
  }

  function focusFirstError() {
    requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus();
    });
  }

  async function submitForm(publishAsDraft: boolean) {
    const nextErrors = validateProductForm(form);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError();
      return;
    }

    await onSubmit(
      formToPayload(form, publishAsDraft ? false : form.isPublished),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;

    const publishAsDraft = submitter?.dataset.intent === "draft";

    await submitForm(publishAsDraft);
  }

  async function handleResolveImage() {
    setImageNotice(null);

    const imageError = validateImageUrl(form.coverImage);

    if (imageError) {
      setErrors((current) => ({
        ...current,
        coverImage: imageError,
      }));

      focusFirstError();
      return;
    }

    setIsResolvingImage(true);

    try {
      const originalUrl = form.coverImage.trim();

      const resolvedUrl = await onResolveImage(originalUrl);

      updateField("coverImage", resolvedUrl);

      setImageNotice(
        resolvedUrl === originalUrl
          ? "Ссылка проверена"
          : "Страница ibb.co преобразована в прямую ссылку изображения",
      );
    } catch (resolveError) {
      setErrors((current) => ({
        ...current,
        coverImage:
          resolveError instanceof Error
            ? resolveError.message
            : "Не удалось проверить изображение",
      }));
    } finally {
      setIsResolvingImage(false);
    }
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      ref={formRef}
      className="product-editor-form"
      noValidate
      onSubmit={(event) => void handleSubmit(event)}
    >
      {hasErrors && (
        <Notice tone="error" message="Проверьте выделенные поля формы." />
      )}

      <fieldset className="product-form-section">
        <legend>Основная информация</legend>

        <p className="product-form-section__description">
          Название, категория и описание изделия.
        </p>

        <div className="product-form-grid">
          <label className="form-field form-field--wide">
            <span>
              Название
              <i aria-hidden="true">*</i>
            </span>

            <input
              name="title"
              value={form.title}
              maxLength={150}
              autoComplete="off"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={
                errors.title ? fieldErrorId("title") : undefined
              }
              onChange={(event) => updateField("title", event.target.value)}
            />

            {errors.title && (
              <small id={fieldErrorId("title")} className="form-field__error">
                {errors.title}
              </small>
            )}
          </label>

          <label className="form-field">
            <span>
              Категория
              <i aria-hidden="true">*</i>
            </span>

            <input
              name="category"
              value={form.category}
              maxLength={100}
              placeholder="Нарды"
              autoComplete="off"
              aria-invalid={Boolean(errors.category)}
              aria-describedby={
                errors.category ? fieldErrorId("category") : undefined
              }
              onChange={(event) => updateField("category", event.target.value)}
            />

            {errors.category && (
              <small
                id={fieldErrorId("category")}
                className="form-field__error"
              >
                {errors.category}
              </small>
            )}
          </label>

          <label className="form-field form-field--wide">
            <span>
              Описание
              <i aria-hidden="true">*</i>
            </span>

            <textarea
              name="description"
              value={form.description}
              rows={7}
              maxLength={5000}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? fieldErrorId("description") : undefined
              }
              onChange={(event) =>
                updateField("description", event.target.value)
              }
            />

            <span className="form-field__counter">
              {form.description.length}
              /5000
            </span>

            {errors.description && (
              <small
                id={fieldErrorId("description")}
                className="form-field__error"
              >
                {errors.description}
              </small>
            )}
          </label>
        </div>
      </fieldset>

      <fieldset className="product-form-section">
        <legend>Цена и характеристики</legend>

        <p className="product-form-section__description">
          Стоимость, материал и фактический размер.
        </p>

        <div className="product-form-grid">
          <label className="form-field">
            <span>
              Цена MDL
              <i aria-hidden="true">*</i>
            </span>

            <input
              name="price"
              value={form.price}
              inputMode="decimal"
              placeholder="1800.00"
              autoComplete="off"
              aria-invalid={Boolean(errors.price)}
              aria-describedby={
                errors.price ? fieldErrorId("price") : undefined
              }
              onChange={(event) => updateField("price", event.target.value)}
            />

            {errors.price && (
              <small id={fieldErrorId("price")} className="form-field__error">
                {errors.price}
              </small>
            )}
          </label>

          <label className="form-field">
            <span>Материал</span>

            <input
              name="wood"
              value={form.wood}
              maxLength={100}
              placeholder="Ясень"
              autoComplete="off"
              aria-invalid={Boolean(errors.wood)}
              aria-describedby={errors.wood ? fieldErrorId("wood") : undefined}
              onChange={(event) => updateField("wood", event.target.value)}
            />

            {errors.wood && (
              <small id={fieldErrorId("wood")} className="form-field__error">
                {errors.wood}
              </small>
            )}
          </label>

          <label className="form-field">
            <span>Размер</span>

            <input
              name="size"
              value={form.size}
              maxLength={100}
              placeholder="60 × 30 см"
              autoComplete="off"
              aria-invalid={Boolean(errors.size)}
              aria-describedby={errors.size ? fieldErrorId("size") : undefined}
              onChange={(event) => updateField("size", event.target.value)}
            />

            {errors.size && (
              <small id={fieldErrorId("size")} className="form-field__error">
                {errors.size}
              </small>
            )}
          </label>
        </div>
      </fieldset>

      <fieldset className="product-form-section">
        <legend>Изображение</legend>

        <p className="product-form-section__description">
          Можно вставить прямой HTTPS URL или страницу изображения ibb.co.
        </p>

        <div className="product-image-editor">
          <div className="product-image-editor__fields">
            <label className="form-field">
              <span>
                URL изображения
                <i aria-hidden="true">*</i>
              </span>

              <div className="form-field__action-row">
                <input
                  name="coverImage"
                  type="url"
                  value={form.coverImage}
                  placeholder="https://ibb.co/..."
                  inputMode="url"
                  autoComplete="url"
                  aria-invalid={Boolean(errors.coverImage)}
                  aria-describedby={
                    errors.coverImage ? fieldErrorId("coverImage") : undefined
                  }
                  onChange={(event) =>
                    updateField("coverImage", event.target.value)
                  }
                />

                <Button
                  variant="secondary"
                  disabled={
                    isResolvingImage || isSaving || !form.coverImage.trim()
                  }
                  onClick={() => void handleResolveImage()}
                >
                  {isResolvingImage ? "Проверка..." : "Проверить URL"}
                </Button>
              </div>

              {errors.coverImage && (
                <small
                  id={fieldErrorId("coverImage")}
                  className="form-field__error"
                >
                  {errors.coverImage}
                </small>
              )}

              {imageNotice && (
                <small className="form-field__success">{imageNotice}</small>
              )}
            </label>
          </div>

          <div className="product-image-preview">
            {form.coverImage ? (
              <ProductImage
                className="product-image-preview__image"
                src={form.coverImage}
                alt="Предпросмотр товара"
                width={720}
                height={540}
                decoding="async"
              />
            ) : (
              <div className="product-image-preview__empty">
                <span aria-hidden="true">V</span>

                <p>Предпросмотр появится после добавления ссылки</p>
              </div>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="product-form-section">
        <legend>Контакт и публикация</legend>

        <p className="product-form-section__description">
          Ссылка для связи с мастером и видимость товара в каталоге.
        </p>

        <div className="product-form-grid">
          <label className="form-field form-field--wide">
            <span>
              Telegram менеджера
              <i aria-hidden="true">*</i>
            </span>

            <input
              name="managerLink"
              type="url"
              value={form.managerLink}
              placeholder="https://t.me/username"
              inputMode="url"
              autoComplete="url"
              aria-invalid={Boolean(errors.managerLink)}
              aria-describedby={
                errors.managerLink ? fieldErrorId("managerLink") : undefined
              }
              onChange={(event) =>
                updateField("managerLink", event.target.value)
              }
            />

            {errors.managerLink && (
              <small
                id={fieldErrorId("managerLink")}
                className="form-field__error"
              >
                {errors.managerLink}
              </small>
            )}
          </label>

          <label className="publish-toggle form-field--wide">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(event) =>
                updateField("isPublished", event.target.checked)
              }
            />

            <span className="publish-toggle__control">
              <i />
            </span>

            <span className="publish-toggle__copy">
              <strong>Опубликовать товар</strong>

              <small>
                После сохранения товар будет доступен в публичном каталоге.
              </small>
            </span>
          </label>
        </div>
      </fieldset>

      <footer className="product-editor-actions">
        <Button variant="secondary" disabled={isSaving} onClick={onCancel}>
          Отмена
        </Button>

        <Button
          variant="secondary"
          type="submit"
          data-intent="draft"
          disabled={isSaving}
        >
          {isSaving ? "Сохранение..." : "Сохранить как черновик"}
        </Button>

        <Button type="submit" disabled={isSaving}>
          {isSaving
            ? "Сохранение..."
            : mode === "create"
              ? "Создать товар"
              : "Сохранить изменения"}
        </Button>
      </footer>
    </form>
  );
}
