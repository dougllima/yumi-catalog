import { describe, expect, it } from "vitest";

import {
  centsToReais,
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
        isActive: true,
      },
      {
        id: "inactive",
        name: "Produto inativo",
        images: [],
        isActive: false,
      },
    ];

    expect(onlyActiveProducts(products)).toHaveLength(1);
    expect(onlyActiveProducts(products)[0]?.id).toBe("active");
  });

  it("normalizes searches with accents", () => {
    expect(normalizeSearch("Porta Jóias")).toContain("joias");
  });
});
