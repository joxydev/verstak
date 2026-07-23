export const ROUTES = {
  home: "/",
  admin: "/admin",

  product: (id: number | string) => `/products/${id}`,
} as const;

export const SECTIONS = {
  categories: "categories",
  catalog: "catalog",
  atelier: "atelier",
  contact: "contact",
} as const;

export const CONTACTS = {
  telegram: "https://t.me/your_manager",
} as const;

export function sectionUrl(section: string): string {
  return `/#${section}`;
}

export function categoryUrl(category: string): string {
  return `/?category=${encodeURIComponent(category)}#${SECTIONS.catalog}`;
}
