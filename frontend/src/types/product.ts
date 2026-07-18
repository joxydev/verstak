export interface Product {
  id: number;
  title: string;
  description: string;
  price: string | number;
  category: string;
  wood: string | null;
  size: string | null;
  managerLink: string;
  coverImage: string;
  createdAt: string;
}
