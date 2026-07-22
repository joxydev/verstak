export const ROUTES = {
  home: '/',
  admin: '/admin',
  product: (id: number | string) =>
    `/products/${id}`,
} as const;

export const CONTACTS = {
  telegram:
    'https://t.me/your_manager',
} as const;
