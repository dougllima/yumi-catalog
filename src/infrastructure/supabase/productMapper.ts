import type {
  Product,
  ProductCategory,
  ProductImage,
  ProductInput,
} from "@/domain/product";
import { centsToReais } from "@/domain/product";

export type SupabaseProductImageRow = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  created_at?: string;
};

export type SupabaseCategoryRow = {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
};

export type SupabaseProductCategoryRow = {
  product_id: string;
  category_id: string;
  categories: SupabaseCategoryRow | null;
};

export type SupabaseProductRow = {
  id: string;
  name: string;
  description: string | null;
  weight_grams: number | null;
  price_cents: number | null;
  active: boolean;
  sort_order: number | null;
  created_at?: string;
  updated_at?: string;
  product_images?: SupabaseProductImageRow[] | null;
  product_categories?: SupabaseProductCategoryRow[] | null;
};

export type SupabaseProductWriteRow = {
  id?: string;
  name: string;
  description: string | null;
  weight_grams: number | null;
  price_cents: number | null;
  active: boolean;
  sort_order?: number | null;
};

const optionalText = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export function mapProductRow(
  row: SupabaseProductRow,
  getPublicUrl: (storagePath: string) => string,
): Product {
  const imageRecords: ProductImage[] = [...(row.product_images ?? [])]
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((image) => ({
      id: image.id,
      url: getPublicUrl(image.storage_path),
      storagePath: image.storage_path,
      altText: image.alt_text ?? undefined,
      sortOrder: image.sort_order,
    }));

  const categories: ProductCategory[] = [...(row.product_categories ?? [])]
    .map((item) => item.categories)
    .filter((category): category is SupabaseCategoryRow => Boolean(category))
    .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"))
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));

  return {
    id: row.id,
    name: row.name,
    description: optionalText(row.description ?? undefined),
    weight: row.weight_grams ?? undefined,
    price: centsToReais(row.price_cents),
    images: imageRecords.map((image) => image.url),
    imageRecords,
    categories,
    isActive: row.active,
    sortOrder: row.sort_order ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toProductWriteRow(
  input: ProductInput,
): SupabaseProductWriteRow {
  return {
    id: input.id,
    name: input.name.trim(),
    description: input.description?.trim() || null,
    weight_grams: input.weight ?? null,
    price_cents: input.priceInCents ?? null,
    active: input.isActive,
    sort_order: input.sortOrder ?? null,
  };
}
