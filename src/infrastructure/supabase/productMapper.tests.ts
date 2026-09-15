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
        price_cents: 13000,
        active: true,
        show_on_home: true,
        sort_order: 2,
        product_images: [
          {
            id: "image-2",
            product_id: "porta-joias",
            storage_path: "porta-joias/02.jpeg",
            alt_text: "Imagem 2",
            sort_order: 1,
            crop_x: 20,
            crop_y: 30,
            crop_zoom: 1.5,
          },
          {
            id: "image-1",
            product_id: "porta-joias",
            storage_path: "porta-joias/01.jpeg",
            alt_text: "Imagem 1",
            sort_order: 0,
            crop_x: 60,
            crop_y: 40,
            crop_zoom: 1,
          },
        ],
        product_categories: [
          {
            product_id: "porta-joias",
            category_id: "category-geek",
            categories: {
              id: "category-geek",
              name: "Geek",
              slug: "geek",
            },
          },
          {
            product_id: "porta-joias",
            category_id: "category-organizacao",
            categories: {
              id: "category-organizacao",
              name: "Organização",
              slug: "organizacao",
            },
          },
        ],
      } satisfies SupabaseProductRow,
      (path) => `https://storage.local/${path}`,
    );

    expect(product.price).toBe(130);
    expect(product.isActive).toBe(true);
    expect(product.showOnHome).toBe(true);
    expect(product.images).toEqual([
      "https://storage.local/porta-joias/01.jpeg",
      "https://storage.local/porta-joias/02.jpeg",
    ]);
    expect(product.imageRecords?.[0]?.crop).toEqual({
      xPercent: 60,
      yPercent: 40,
      zoom: 1,
    });
    expect(product.imageRecords?.[1]?.crop).toEqual({
      xPercent: 20,
      yPercent: 30,
      zoom: 1.5,
    });
    expect(product.categories.map((category) => category.name)).toEqual([
      "Geek",
      "Organização",
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
        showOnHome: false,
      }),
    ).toEqual({
      id: "novo-produto",
      name: "Novo produto",
      description: null,
      price_cents: 1990,
      active: false,
      show_on_home: false,
      sort_order: null,
    });
  });
});
