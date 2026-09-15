import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { productRepository } from "@/application/dependencies";
import type { Product } from "@/domain/product";
import { useProduct, usePublishedProducts } from "@/hooks/useProducts";

vi.mock("@/application/dependencies", () => ({
  productRepository: {
    listPublished: vi.fn(),
    getById: vi.fn(),
  },
}));

const repository = vi.mocked(productRepository);

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "product-1",
  name: "Produto teste",
  images: ["/products/product-1/01.webp"],
  categories: [],
  isActive: true,
  showOnHome: false,
  ...overrides,
});

describe("usePublishedProducts", () => {
  beforeEach(() => {
    repository.listPublished.mockReset();
  });

  it("loads published products and exposes a reload function", async () => {
    const firstProduct = makeProduct({ id: "first", name: "Primeiro" });
    const secondProduct = makeProduct({ id: "second", name: "Segundo" });
    repository.listPublished
      .mockResolvedValueOnce([firstProduct])
      .mockResolvedValueOnce([secondProduct]);

    const { result } = renderHook(() => usePublishedProducts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products).toEqual([firstProduct]);
    expect(result.current.error).toBeNull();

    await act(async () => {
      await result.current.reload();
    });

    expect(result.current.products).toEqual([secondProduct]);
    expect(repository.listPublished).toHaveBeenCalledTimes(2);
  });

  it("stores repository errors without throwing from the hook", async () => {
    repository.listPublished.mockRejectedValueOnce(
      new Error("Falha ao carregar catalogo."),
    );

    const { result } = renderHook(() => usePublishedProducts());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBe("Falha ao carregar catalogo.");
  });
});

describe("useProduct", () => {
  beforeEach(() => {
    repository.getById.mockReset();
  });

  it("does not query the repository when there is no product id", () => {
    const { result } = renderHook(() => useProduct());

    expect(result.current.loading).toBe(false);
    expect(result.current.product).toBeNull();
    expect(repository.getById).not.toHaveBeenCalled();
  });

  it("loads a product by id", async () => {
    const product = makeProduct({ id: "porta-joias", name: "Porta Joias" });
    repository.getById.mockResolvedValueOnce(product);

    const { result } = renderHook(() => useProduct("porta-joias"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(repository.getById).toHaveBeenCalledWith("porta-joias");
    expect(result.current.product).toEqual(product);
    expect(result.current.error).toBeNull();
  });
});
