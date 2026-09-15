import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import type { Product } from "@/domain/product";
import { useProduct, usePublishedProducts } from "@/hooks/useProducts";
import { useTheme } from "@/hooks/useTheme";

vi.mock("@/hooks/useTheme", () => ({
  useTheme: vi.fn(),
}));

vi.mock("@/hooks/useProducts", () => ({
  useProduct: vi.fn(),
  usePublishedProducts: vi.fn(),
}));

const mockedUseTheme = vi.mocked(useTheme);
const mockedUsePublishedProducts = vi.mocked(usePublishedProducts);
const mockedUseProduct = vi.mocked(useProduct);

const product: Product = {
  id: "porta-joias",
  name: "Porta Joias",
  images: ["/products/porta-joias/01.webp"],
  categories: [],
  isActive: true,
  showOnHome: false,
};

describe("App", () => {
  beforeEach(() => {
    mockedUseTheme.mockReturnValue({
      theme: "dark",
      toggleTheme: vi.fn(),
    });
    mockedUsePublishedProducts.mockReturnValue({
      products: [product],
      loading: false,
      error: null,
      reload: vi.fn(),
    });
    mockedUseProduct.mockReturnValue({
      product,
      loading: false,
      error: null,
    });
  });

  it("renders the home route with the shared site header", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: "Yumi Studio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Pe.as .nicas para decorar/i }),
    ).toBeInTheDocument();
  });

  it("renders direct product routes inside the SPA", () => {
    render(
      <MemoryRouter initialEntries={["/produto/porta-joias"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Porta Joias" }),
    ).toBeInTheDocument();
    expect(mockedUseProduct).toHaveBeenCalledWith("porta-joias");
  });
});
