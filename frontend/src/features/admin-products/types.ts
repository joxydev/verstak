export type ProductStatusFilter = "all" | "published" | "draft";

export type ProductSort =
  | "updated-desc"
  | "title-asc"
  | "price-asc"
  | "price-desc";

export function parseStatusFilter(value: string | null): ProductStatusFilter {
  if (value === "published" || value === "draft") {
    return value;
  }

  return "all";
}

export function parseProductSort(value: string | null): ProductSort {
  if (
    value === "title-asc" ||
    value === "price-asc" ||
    value === "price-desc"
  ) {
    return value;
  }

  return "updated-desc";
}
