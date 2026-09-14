import { describe, expect, it } from "vitest";

import {
  mapProductRow,
  type SupabaseProductRow,
  toProductWriteRow,
} from "@/infrastructure/supabase/productMapper";

describe("Supabase product mapper", () => {
  it("maps persisted products to the UI product model", () => {
    const product = mapProductRow(
      {
        id: "porta-joias",
        name: "Porta Jóias",
        description: "Organizador delicado",
        weight_grams: 392,
        price_cents: 13000,
        active: true,
        sort_order: 2,
        product_images: [
          {
            id: "image-2",
            product_id: "porta-joias",
            storage_path: "porta-joias/02.jpeg",
            alt_text: "Imagem 2",
            sort_order: 1,
          },
          {
            id: "image-1",
            product_id: "porta-joias",
            storage_path: "porta-joias/01.jpeg",
            alt_text: "Imagem 1",
            sort_order: 0,
          },
        ],
      } satisfies SupabaseProductRow,
      (path) => `https://storage.local/${path}`,
    );

    expect(product.price).toBe(130);
    expect(product.weight).toBe(392);
    expect(product.isActive).toBe(true);
    expect(product.images).toEqual([
      "https://storage.local/porta-joias/01.jpeg",
      "https://storage.local/porta-joias/02.jpeg",
    ]);
  });

  it("maps UI product input to persisted cents and nullable fields", () => {
    expect(
      toProductWriteRow({
        id: "novo-produto",
        name: " Novo produto ",
        description: "",
        priceInCents: 1990,
        isActive: false,
      }),
    ).toEqual({
      id: "novo-produto",
      name: "Novo produto",
      description: null,
      weight_grams: null,
      price_cents: 1990,
      active: false,
      sort_order: null,
    });
  });
});
