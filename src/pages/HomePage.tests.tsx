import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Product } from "@/domain/product";
import { usePublishedProducts } from "@/hooks/useProducts";
import { HomePage } from "@/pages/HomePage";

vi.mock("@/hooks/useProducts", () => ({
  usePublishedProducts: vi.fn(),
}));

const mockedUsePublishedProducts = vi.mocked(usePublishedProducts);

const makeProduct = (index: number): Product => ({
  id: `product-${index}`,
  name: `Produto ${index}`,
  description: `Descricao ${index}`,
  price: index,
  images: [`/products/product-${index}/01.webp`],
  categories: [],
  isActive: true,
});

const renderHomePage = () =>
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );

describe("HomePage", () => {
  beforeEach(() => {
    mockedUsePublishedProducts.mockReset();
  });

  it("renders the hero, featured products, and catalog link", () => {
    mockedUsePublishedProducts.mockReturnValue({
      products: Array.from({ length: 7 }, (_, index) => makeProduct(index + 1)),
      loading: false,
      error: null,
      reload: vi.fn(),
    });

    renderHomePage();

    expect(
      screen.getByRole("heading", { name: /Pe.as .nicas para decorar/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Ver todos os produtos" }),
    ).toHaveAttribute("href", "/produtos");

    const productsRegion = screen.getByLabelText(/Produtos dispon.veis/i);
    expect(within(productsRegion).getByText("Produto 1")).toBeInTheDocument();
    expect(within(productsRegion).getByText("Produto 6")).toBeInTheDocument();
    expect(
      within(productsRegion).queryByText("Produto 7"),
    ).not.toBeInTheDocument();
  });

  it("shows loading placeholders and load errors", () => {
    mockedUsePublishedProducts.mockReturnValue({
      products: [],
      loading: true,
      error: "Falha ao carregar produtos.",
      reload: vi.fn(),
    });

    renderHomePage();

    expect(screen.getByText("Falha ao carregar produtos.")).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Produtos dispon.veis/i).children,
    ).toHaveLength(6);
  });
});
