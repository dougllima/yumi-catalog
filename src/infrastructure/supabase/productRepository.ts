import type { SupabaseClient } from "@supabase/supabase-js";

import type { MediaStorage, ProductRepository } from "@/application/contracts";
import type {
  Product,
  ProductImageInput,
  ProductInput,
} from "@/domain/product";
import {
  mapProductRow,
  type SupabaseProductImageRow,
  type SupabaseProductRow,
  toProductWriteRow,
} from "@/infrastructure/supabase/productMapper";

const productSelect = `
  id,
  name,
  description,
  weight_grams,
  price_cents,
  active,
  sort_order,
  created_at,
  updated_at,
  product_images (
    id,
    product_id,
    storage_path,
    alt_text,
    sort_order,
    created_at
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
      })
      .select("id, product_id, storage_path, alt_text, sort_order, created_at")
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

  private mapProduct(row: SupabaseProductRow): Product {
    return mapProductRow(row, (storagePath) =>
      this.mediaStorage.getPublicUrl(storagePath),
    );
  }
}
