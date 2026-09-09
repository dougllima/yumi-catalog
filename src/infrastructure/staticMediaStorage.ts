import type { MediaStorage, UploadedMedia } from "@/application/contracts";

export class StaticMediaStorage implements MediaStorage {
  async uploadProductImage(): Promise<UploadedMedia> {
    throw new Error(
      "Upload indisponível: configure o Supabase para habilitar storage.",
    );
  }

  async remove(): Promise<void> {
    throw new Error(
      "Remoção indisponível: configure o Supabase para habilitar storage.",
    );
  }

  getPublicUrl(storagePath: string) {
    return storagePath;
  }
}
