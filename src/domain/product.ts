export type ProductImageCrop = {
  xPercent: number;
  yPercent: number;
  zoom: number;
};

export type ProductImage = {
  id: string;
  url: string;
  storagePath?: string;
  altText?: string;
  sortOrder: number;
  crop?: ProductImageCrop;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  imagePath?: string;
  imageUrl?: string;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  images: string[];
  imageRecords?: ProductImage[];
  categories: ProductCategory[];
  isActive: boolean;
  showOnHome: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductInput = {
  id?: string;
  name: string;
  description?: string;
  priceInCents?: number;
  isActive: boolean;
  showOnHome: boolean;
  sortOrder?: number;
};

export type ProductImageInput = {
  storagePath: string;
  altText?: string;
  sortOrder: number;
  crop?: ProductImageCrop;
};

export type ProductImageCropInput = ProductImageCrop;

export const centsToReais = (cents?: number | null) =>
  typeof cents === "number" ? cents / 100 : undefined;

export const reaisToCents = (value?: number | null) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.round(value * 100)
    : undefined;

export const defaultProductImageCrop: ProductImageCrop = {
  xPercent: 50,
  yPercent: 50,
  zoom: 1,
};

const clampNumber = (
  value: number | undefined,
  min: number,
  max: number,
  fallback: number,
) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.min(Math.max(value, min), max)
    : fallback;

export const normalizeProductImageCrop = (
  crop?: Partial<ProductImageCrop> | null,
): ProductImageCrop => ({
  xPercent: clampNumber(
    crop?.xPercent,
    0,
    100,
    defaultProductImageCrop.xPercent,
  ),
  yPercent: clampNumber(
    crop?.yPercent,
    0,
    100,
    defaultProductImageCrop.yPercent,
  ),
  zoom: clampNumber(crop?.zoom, 1, 3, defaultProductImageCrop.zoom),
});

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

const newProductWindowInDays = 30;
const millisecondsPerDay = 24 * 60 * 60 * 1000;

export const isNewProduct = (product: Product, now = new Date()) => {
  if (!product.createdAt) {
    return false;
  }

  const createdAt = new Date(product.createdAt).getTime();

  if (Number.isNaN(createdAt)) {
    return false;
  }

  return (
    now.getTime() - createdAt <= newProductWindowInDays * millisecondsPerDay
  );
};

export const relatedProducts = (
  product: Product,
  products: Product[],
  limit = 4,
) => {
  const slugs = new Set(product.categories.map((category) => category.slug));

  if (slugs.size === 0) {
    return [];
  }

  return products
    .filter((candidate) => candidate.id !== product.id && candidate.isActive)
    .map((candidate) => ({
      candidate,
      shared: candidate.categories.filter((category) =>
        slugs.has(category.slug),
      ).length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort(
      (left, right) =>
        right.shared - left.shared ||
        left.candidate.name.localeCompare(right.candidate.name, "pt-BR"),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
};

export type CategoryShowcase = {
  slug: string;
  name: string;
  count: number;
  imageUrl?: string;
  crop?: ProductImageCrop;
};

/**
 * Categorias com produtos ativos, prontas para a vitrine da home.
 * A imagem da própria categoria tem prioridade; sem ela, usa a foto de um
 * produto da categoria, sem repetir o mesmo produto em outra categoria.
 * Categorias com menos produtos escolhem primeiro, para não ficarem sem opção.
 */
export const categoryShowcaseFrom = (
  products: Product[],
): CategoryShowcase[] => {
  const groups = new Map<
    string,
    { category: ProductCategory; products: Product[] }
  >();

  products.forEach((product) => {
    product.categories.forEach((category) => {
      const group = groups.get(category.slug);

      if (group) {
        group.products.push(product);
      } else {
        groups.set(category.slug, { category, products: [product] });
      }
    });
  });

  const usedProductIds = new Set<string>();
  const showcase = new Map<string, CategoryShowcase>();
  const byScarcity = [...groups.values()].sort(
    (left, right) =>
      left.products.length - right.products.length ||
      left.category.name.localeCompare(right.category.name, "pt-BR"),
  );

  byScarcity.forEach(({ category, products: categoryProducts }) => {
    const base = {
      slug: category.slug,
      name: category.name,
      count: categoryProducts.length,
    };

    if (category.imageUrl) {
      showcase.set(category.slug, { ...base, imageUrl: category.imageUrl });
      return;
    }

    const candidate = categoryProducts.find(
      (product) =>
        !usedProductIds.has(product.id) &&
        (product.imageRecords?.[0]?.url ?? product.images[0]),
    );

    if (!candidate) {
      showcase.set(category.slug, base);
      return;
    }

    usedProductIds.add(candidate.id);
    const image = candidate.imageRecords?.[0];
    showcase.set(category.slug, {
      ...base,
      imageUrl: image?.url ?? candidate.images[0],
      crop: image?.crop,
    });
  });

  return [...showcase.values()].sort(
    (left, right) =>
      right.count - left.count || left.name.localeCompare(right.name, "pt-BR"),
  );
};
