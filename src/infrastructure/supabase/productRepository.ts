import type { SupabaseClient } from "@supabase/supabase-js";

import type { MediaStorage, ProductRepository } from "@/application/contracts";
import type {
  Product,
  ProductCategory,
  ProductImage,
  ProductImageCropInput,
  ProductImageInput,
  ProductInput,
} from "@/domain/product";
import {
  categorySlug,
  dedupeCategoryNames,
  normalizeProductImageCrop,
} from "@/domain/product";
import {
  mapProductRow,
  type SupabaseCategoryRow,
  type SupabaseProductImageRow,
  type SupabaseProductRow,
  toProductWriteRow,
} from "@/infrastructure/supabase/productMapper";

const productSelect = `
  id,
  name,
  description,
  price_cents,
  active,
  show_on_home,
  sort_order,
  created_at,
  updated_at,
  product_images (
    id,
    product_id,
    storage_path,
    alt_text,
    sort_order,
    crop_x,
    crop_y,
    crop_zoom,
    created_at
  ),
  product_categories (
    product_id,
    category_id,
    categories (
      id,
      name,
      slug,
      created_at,
      updated_at
    )
  )
`;

export class SupabaseProductRepository implements ProductRepository {
  private readonly client: SupabaseClient;
  private readonly mediaStorage: MediaStorage;

  constructor(client: SupabaseClient, mediaStorage: MediaStorage) {
    this.client = client;
    this.mediaStorage = mediaStorage;
  }

  async listPublished() {
    const { data, error } = await this.client
      .from("products")
      .select(productSelect)
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .returns<SupabaseProductRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map((row) => this.mapProduct(row));
  }

  async listAll() {
    const { data, error } = await this.client
      .from("products")
      .select(productSelect)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .returns<SupabaseProductRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map((row) => this.mapProduct(row));
  }

  async getById(id: string, options?: { includeInactive?: boolean }) {
    let query = this.client.from("products").select(productSelect).eq("id", id);

    if (!options?.includeInactive) {
      query = query.eq("active", true);
    }

    const { data, error } = await query
      .returns<SupabaseProductRow[]>()
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? this.mapProduct(data) : null;
  }

  async create(input: ProductInput) {
    const { data, error } = await this.client
      .from("products")
      .insert(toProductWriteRow(input))
      .select(productSelect)
      .single<SupabaseProductRow>();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapProduct(data);
  }

  async update(id: string, input: ProductInput) {
    const row = toProductWriteRow(input);
    delete row.id;
    const { data, error } = await this.client
      .from("products")
      .update(row)
      .eq("id", id)
      .select(productSelect)
      .single<SupabaseProductRow>();

    if (error) {
      throw new Error(error.message);
    }

    return this.mapProduct(data);
  }

  async delete(id: string) {
    const { error } = await this.client.from("products").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async addImage(productId: string, input: ProductImageInput) {
    const { data, error } = await this.client
      .from("product_images")
      .insert({
        product_id: productId,
        storage_path: input.storagePath,
        alt_text: input.altText ?? null,
        sort_order: input.sortOrder,
        crop_x: input.crop?.xPercent ?? 50,
        crop_y: input.crop?.yPercent ?? 50,
        crop_zoom: input.crop?.zoom ?? 1,
      })
      .select(
        "id, product_id, storage_path, alt_text, sort_order, crop_x, crop_y, crop_zoom, created_at",
      )
      .single<SupabaseProductImageRow>();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      url: this.mediaStorage.getPublicUrl(data.storage_path),
      storagePath: data.storage_path,
      altText: data.alt_text ?? undefined,
      sortOrder: data.sort_order,
      crop: normalizeProductImageCrop({
        xPercent: data.crop_x ?? undefined,
        yPercent: data.crop_y ?? undefined,
        zoom: data.crop_zoom ?? undefined,
      }),
    };
  }

  async removeImage(imageId: string) {
    const { error } = await this.client
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async updateImageOrder(productId: string, orderedImageIds: string[]) {
    await Promise.all(
      orderedImageIds.map(async (imageId, index) => {
        const { error } = await this.client
          .from("product_images")
          .update({ sort_order: index })
          .eq("product_id", productId)
          .eq("id", imageId);

        if (error) {
          throw new Error(error.message);
        }
      }),
    );
  }

  async updateImageCrop(
    imageId: string,
    input: ProductImageCropInput,
  ): Promise<ProductImage> {
    const crop = normalizeProductImageCrop(input);
    const { data, error } = await this.client
      .from("product_images")
      .update({
        crop_x: crop.xPercent,
        crop_y: crop.yPercent,
        crop_zoom: crop.zoom,
      })
      .eq("id", imageId)
      .select(
        "id, product_id, storage_path, alt_text, sort_order, crop_x, crop_y, crop_zoom, created_at",
      )
      .single<SupabaseProductImageRow>();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      url: this.mediaStorage.getPublicUrl(data.storage_path),
      storagePath: data.storage_path,
      altText: data.alt_text ?? undefined,
      sortOrder: data.sort_order,
      crop: normalizeProductImageCrop({
        xPercent: data.crop_x ?? undefined,
        yPercent: data.crop_y ?? undefined,
        zoom: data.crop_zoom ?? undefined,
      }),
    };
  }

  async listCategories() {
    const { data, error } = await this.client
      .from("categories")
      .select("id, name, slug, created_at, updated_at")
      .order("name", { ascending: true })
      .returns<SupabaseCategoryRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map(mapCategoryRow);
  }

  async replaceProductCategories(productId: string, categoryNames: string[]) {
    const categoryRecords = await this.ensureCategories(categoryNames);

    const { error: deleteError } = await this.client
      .from("product_categories")
      .delete()
      .eq("product_id", productId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    if (categoryRecords.length === 0) {
      return [];
    }

    const { error: insertError } = await this.client
      .from("product_categories")
      .insert(
        categoryRecords.map((category) => ({
          product_id: productId,
          category_id: category.id,
        })),
      );

    if (insertError) {
      throw new Error(insertError.message);
    }

    return categoryRecords;
  }

  private mapProduct(row: SupabaseProductRow): Product {
    return mapProductRow(row, (storagePath) =>
      this.mediaStorage.getPublicUrl(storagePath),
    );
  }

  private async ensureCategories(categoryNames: string[]) {
    const names = dedupeCategoryNames(categoryNames);
    const rows = names
      .map((name) => ({
        name,
        slug: categorySlug(name),
      }))
      .filter((category) => category.slug);

    if (rows.length === 0) {
      return [];
    }

    const { error: upsertError } = await this.client
      .from("categories")
      .upsert(rows, {
        onConflict: "slug",
        ignoreDuplicates: true,
      });

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    const { data, error } = await this.client
      .from("categories")
      .select("id, name, slug, created_at, updated_at")
      .in(
        "slug",
        rows.map((category) => category.slug),
      )
      .returns<SupabaseCategoryRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    const bySlug = new Map(data.map((category) => [category.slug, category]));

    return rows
      .map((row) => bySlug.get(row.slug))
      .filter((category): category is SupabaseCategoryRow => Boolean(category))
      .map(mapCategoryRow);
  }
}

const mapCategoryRow = (row: SupabaseCategoryRow): ProductCategory => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
});
