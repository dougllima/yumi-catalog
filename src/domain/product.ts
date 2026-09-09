export type ProductImage = {
  id: string;
  url: string;
  storagePath?: string;
  altText?: string;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  weight?: number;
  price?: number;
  images: string[];
  imageRecords?: ProductImage[];
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductInput = {
  id?: string;
  name: string;
  description?: string;
  weight?: number;
  priceInCents?: number;
  isActive: boolean;
  sortOrder?: number;
};

export type ProductImageInput = {
  storagePath: string;
  altText?: string;
  sortOrder: number;
};

export const centsToReais = (cents?: number | null) =>
  typeof cents === "number" ? cents / 100 : undefined;

export const reaisToCents = (value?: number | null) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.round(value * 100)
    : undefined;

export const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

export const onlyActiveProducts = (products: Product[]) =>
  products.filter((product) => product.isActive);
