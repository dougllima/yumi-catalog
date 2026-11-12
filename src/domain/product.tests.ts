import { describe, expect, it } from "vitest";

import {
  categoryShowcaseFrom,
  categorySlug,
  centsToReais,
  createProductCategory,
  dedupeCategoryNames,
  isNewProduct,
  normalizeProductImageCrop,
  normalizeSearch,
  onlyActiveProducts,
  type Product,
  reaisToCents,
  relatedProducts,
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

  describe("isNewProduct", () => {
    const base: Product = {
      id: "p",
      name: "P",
      images: [],
      categories: [],
      isActive: true,
      showOnHome: false,
    };
    const now = new Date("2026-11-11T12:00:00Z");

    it("marks products created in the last 30 days", () => {
      expect(
        isNewProduct({ ...base, createdAt: "2026-11-01T00:00:00Z" }, now),
      ).toBe(true);
      expect(
        isNewProduct({ ...base, createdAt: "2026-09-01T00:00:00Z" }, now),
      ).toBe(false);
    });

    it("ignores missing or invalid dates", () => {
      expect(isNewProduct(base, now)).toBe(false);
      expect(isNewProduct({ ...base, createdAt: "invalid" }, now)).toBe(false);
    });
  });

  describe("relatedProducts", () => {
    const category = (slug: string) => ({ id: slug, name: slug, slug });
    const make = (id: string, slugs: string[], isActive = true): Product => ({
      id,
      name: id,
      images: [],
      categories: slugs.map(category),
      isActive,
      showOnHome: false,
    });

    it("ranks by shared categories and excludes itself and inactive products", () => {
      const current = make("current", ["a", "b"]);
      const result = relatedProducts(current, [
        current,
        make("one-shared", ["a"]),
        make("two-shared", ["a", "b"]),
        make("inactive", ["a"], false),
        make("unrelated", ["c"]),
      ]);

      expect(result.map((product) => product.id)).toEqual([
        "two-shared",
        "one-shared",
      ]);
    });

    it("returns nothing when the product has no categories", () => {
      const current = make("current", []);

      expect(relatedProducts(current, [make("other", ["a"])])).toEqual([]);
    });
  });

  describe("categoryShowcaseFrom", () => {
    const category = (slug: string, imageUrl?: string) => ({
      id: slug,
      name: slug,
      slug,
      imageUrl,
    });
    const make = (
      id: string,
      categories: ReturnType<typeof category>[],
      image = true,
    ): Product => ({
      id,
      name: id,
      images: image ? [`/${id}.webp`] : [],
      categories,
      isActive: true,
      showOnHome: false,
    });

    it("never reuses the same product image across categories", () => {
      const a = category("a");
      const b = category("b");
      const shared = make("shared", [a, b]);
      const onlyA = make("only-a", [a]);
      const result = categoryShowcaseFrom([shared, onlyA]);
      const images = result.map((item) => item.imageUrl);

      expect(new Set(images).size).toBe(images.length);
      expect(result.find((item) => item.slug === "b")?.imageUrl).toBe(
        "/shared.webp",
      );
      expect(result.find((item) => item.slug === "a")?.imageUrl).toBe(
        "/only-a.webp",
      );
    });

    it("prefers the category own image", () => {
      const a = category("a", "https://cdn.example/a.webp");
      const result = categoryShowcaseFrom([make("p", [a])]);

      expect(result[0]?.imageUrl).toBe("https://cdn.example/a.webp");
    });

    it("leaves the image empty when no product is available", () => {
      const result = categoryShowcaseFrom([make("p", [category("a")], false)]);

      expect(result[0]?.imageUrl).toBeUndefined();
    });
  });
});
