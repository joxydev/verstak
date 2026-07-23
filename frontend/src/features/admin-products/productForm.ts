import type { ProductPayload } from "../../api/admin-products";

import type { Product } from "../../types/product";

export interface ProductFormState {
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

export type ProductTextField = Exclude<keyof ProductFormState, "isPublished">;

export type ProductFormErrors = Partial<Record<ProductTextField, string>>;

export function createEmptyProductForm(): ProductFormState {
  return {
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
}

export function productToForm(product: Product): ProductFormState {
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

function normalizePrice(value: string): string {
  return value.replace(/\s/g, "").replace(",", ".");
}

function validateHttpsUrl(value: string): URL | null {
  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

export function validateImageUrl(value: string): string | null {
  if (!value.trim()) {
    return "Укажите ссылку на изображение";
  }

  if (!validateHttpsUrl(value.trim())) {
    return "Используйте корректную HTTPS-ссылку";
  }

  return null;
}

export function validateProductForm(form: ProductFormState): ProductFormErrors {
  const errors: ProductFormErrors = {};

  const title = form.title.trim();

  if (!title) {
    errors.title = "Введите название товара";
  } else if (title.length < 2) {
    errors.title = "Название слишком короткое";
  } else if (title.length > 150) {
    errors.title = "Не более 150 символов";
  }

  const category = form.category.trim();

  if (!category) {
    errors.category = "Введите категорию";
  } else if (category.length > 100) {
    errors.category = "Не более 100 символов";
  }

  const description = form.description.trim();

  if (!description) {
    errors.description = "Добавьте описание товара";
  } else if (description.length < 10) {
    errors.description = "Описание должно содержать хотя бы 10 символов";
  } else if (description.length > 5000) {
    errors.description = "Не более 5000 символов";
  }

  const normalizedPrice = normalizePrice(form.price);

  if (!normalizedPrice) {
    errors.price = "Укажите цену";
  } else if (
    !/^\d+(?:\.\d{1,2})?$/.test(normalizedPrice) ||
    Number(normalizedPrice) <= 0
  ) {
    errors.price = "Введите положительную цену, например 1800.00";
  }

  if (form.wood.trim().length > 100) {
    errors.wood = "Не более 100 символов";
  }

  if (form.size.trim().length > 100) {
    errors.size = "Не более 100 символов";
  }

  const managerLink = form.managerLink.trim();

  if (!managerLink) {
    errors.managerLink = "Укажите ссылку менеджера";
  } else {
    const url = validateHttpsUrl(managerLink);

    const allowedHosts = new Set([
      "t.me",
      "www.t.me",
      "telegram.me",
      "www.telegram.me",
      "telegram.dog",
      "www.telegram.dog",
    ]);

    if (!url) {
      errors.managerLink = "Используйте корректную HTTPS-ссылку";
    } else if (!allowedHosts.has(url.hostname.toLowerCase())) {
      errors.managerLink = "Укажите ссылку Telegram вида https://t.me/username";
    }
  }

  const imageError = validateImageUrl(form.coverImage);

  if (imageError) {
    errors.coverImage = imageError;
  }

  return errors;
}

export function formToPayload(
  form: ProductFormState,
  published: boolean = form.isPublished,
): ProductPayload {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    price: normalizePrice(form.price),
    category: form.category.trim(),
    wood: form.wood.trim() || undefined,
    size: form.size.trim() || undefined,
    managerLink: form.managerLink.trim(),
    coverImage: form.coverImage.trim(),
    isPublished: published,
  };
}
