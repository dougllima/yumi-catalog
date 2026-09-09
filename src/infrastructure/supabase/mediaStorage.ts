import type { SupabaseClient } from "@supabase/supabase-js";

import type { MediaStorage } from "@/application/contracts";

const maxImageSizeInBytes = 5 * 1024 * 1024;
const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const sanitizeFileName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export class SupabaseMediaStorage implements MediaStorage {
  private readonly client: SupabaseClient;
  private readonly bucketName: string;

  constructor(client: SupabaseClient, bucketName = "product-images") {
    this.client = client;
    this.bucketName = bucketName;
  }

  async uploadProductImage(productId: string, file: File) {
    if (!acceptedImageTypes.has(file.type)) {
      throw new Error("Formato inválido. Use JPEG, PNG ou WebP.");
    }

    if (file.size > maxImageSizeInBytes) {
      throw new Error("Imagem muito grande. O limite atual é 5 MB.");
    }

    const safeName = sanitizeFileName(file.name) || "imagem";
    const storagePath = `${productId}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    const { error } = await this.client.storage
      .from(this.bucketName)
      .upload(storagePath, file, {
        cacheControl: "31536000",
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    return {
      storagePath,
      publicUrl: this.getPublicUrl(storagePath),
    };
  }

  async remove(storagePath: string) {
    const { error } = await this.client.storage
      .from(this.bucketName)
      .remove([storagePath]);

    if (error) {
      throw new Error(error.message);
    }
  }

  getPublicUrl(storagePath: string) {
    const { data } = this.client.storage
      .from(this.bucketName)
      .getPublicUrl(storagePath);

    return data.publicUrl;
  }
}
