export type ProductImage = {
  id: string;
  url: string;
  storagePath?: string;
  altText?: string;
  sortOrder: number;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  weight?: number;
  price?: number;
  images: string[];
  imageRecords?: ProductImage[];
  categories: ProductCategory[];
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

export const normalizeCategoryName = (value: string) =>
  value.trim().replace(/\s+/g, " ");

export const categorySlug = (value: string) =>
  normalizeSearch(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const createProductCategory = (name: string): ProductCategory | null => {
  const normalizedName = normalizeCategoryName(name);
  const slug = categorySlug(normalizedName);

  if (!normalizedName || !slug) {
    return null;
  }

  return {
    id: slug,
    name: normalizedName,
    slug,
  };
};

export const dedupeCategoryNames = (names: string[]) => {
  const deduped = new Map<string, string>();

  names.forEach((name) => {
    const category = createProductCategory(name);

    if (category && !deduped.has(category.slug)) {
      deduped.set(category.slug, category.name);
    }
  });

  return [...deduped.values()];
};

export const onlyActiveProducts = (products: Product[]) =>
  products.filter((product) => product.isActive);
