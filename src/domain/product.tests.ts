import { describe, expect, it } from "vitest";

import {
  categorySlug,
  centsToReais,
  createProductCategory,
  dedupeCategoryNames,
  normalizeProductImageCrop,
  normalizeSearch,
  onlyActiveProducts,
  type Product,
  reaisToCents,
} from "@/domain/product";

describe("product domain helpers", () => {
  it("converts currency without keeping floating point values in persistence", () => {
    expect(reaisToCents(19.9)).toBe(1990);
    expect(centsToReais(1990)).toBe(19.9);
  });

  it("filters only active products for the public catalog", () => {
    const products: Product[] = [
      {
        id: "active",
        name: "Produto ativo",
        images: [],
        categories: [],
        isActive: true,
        showOnHome: false,
      },
      {
        id: "inactive",
        name: "Produto inativo",
        images: [],
        categories: [],
        isActive: false,
        showOnHome: false,
      },
    ];

    expect(onlyActiveProducts(products)).toHaveLength(1);
    expect(onlyActiveProducts(products)[0]?.id).toBe("active");
  });

  it("normalizes searches with accents", () => {
    expect(normalizeSearch("Porta Jóias")).toContain("joias");
  });

  it("creates stable category slugs from accents, casing, and spacing", () => {
    expect(categorySlug(" Decoração ")).toBe("decoracao");
    expect(categorySlug("decoracao")).toBe("decoracao");
    expect(categorySlug("DECORAÇÃO")).toBe("decoracao");
  });

  it("deduplicates category names by normalized slug", () => {
    expect(
      dedupeCategoryNames([" Decoração ", "decoracao", "Geek", "geek"]),
    ).toEqual(["Decoração", "Geek"]);
  });

  it("does not create empty category records", () => {
    expect(createProductCategory("   ")).toBeNull();
    expect(createProductCategory("!!!")).toBeNull();
  });

  it("normalizes image crop metadata with centered defaults", () => {
    expect(normalizeProductImageCrop()).toEqual({
      xPercent: 50,
      yPercent: 50,
      zoom: 1,
    });
    expect(
      normalizeProductImageCrop({
        xPercent: -10,
        yPercent: 120,
        zoom: 5,
      }),
    ).toEqual({
      xPercent: 0,
      yPercent: 100,
      zoom: 3,
    });
  });
});
