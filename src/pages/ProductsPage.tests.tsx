import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Product } from "@/domain/product";
import { usePublishedProducts } from "@/hooks/useProducts";
import { ProductsPage } from "@/pages/ProductsPage";

vi.mock("@/hooks/useProducts", () => ({
  usePublishedProducts: vi.fn(),
}));

const mockedUsePublishedProducts = vi.mocked(usePublishedProducts);

const makeProduct = (overrides: Partial<Product>): Product => ({
  id: "produto",
  name: "Produto",
  images: ["/products/produto/01.webp"],
  categories: [],
  isActive: true,
  ...overrides,
});

const renderProductsPage = () =>
  render(
    <MemoryRouter>
      <ProductsPage />
    </MemoryRouter>,
  );

describe("ProductsPage", () => {
  beforeEach(() => {
    mockedUsePublishedProducts.mockReset();
  });

  it("shows the loading grid while products are loading", () => {
    mockedUsePublishedProducts.mockReturnValue({
      products: [],
      loading: true,
      error: null,
      reload: vi.fn(),
    });

    renderProductsPage();

    expect(screen.getByLabelText("Carregando produtos")).toBeInTheDocument();
    expect(screen.getByText("Todos os produtos")).toBeInTheDocument();
  });

  it("filters products by name and clears the active filter", async () => {
    const user = userEvent.setup();
    mockedUsePublishedProducts.mockReturnValue({
      products: [
        makeProduct({ id: "porta-joias", name: "Porta Joias" }),
        makeProduct({ id: "vaso", name: "Vaso" }),
      ],
      loading: false,
      error: null,
      reload: vi.fn(),
    });

    renderProductsPage();

    const productsGrid = screen.getByLabelText("Todos os produtos cadastrados");
    expect(within(productsGrid).getByText("Porta Joias")).toBeInTheDocument();
    expect(within(productsGrid).getByText("Vaso")).toBeInTheDocument();

    await user.type(screen.getByTestId("products-search-input"), "vaso");

    expect(
      within(productsGrid).queryByText("Porta Joias"),
    ).not.toBeInTheDocument();
    expect(within(productsGrid).getByText("Vaso")).toBeInTheDocument();
    expect(screen.getByText("vaso")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Limpar busca" }));

    expect(within(productsGrid).getByText("Porta Joias")).toBeInTheDocument();
    expect(within(productsGrid).getByText("Vaso")).toBeInTheDocument();
  });

  it("shows an empty search state when no product matches", async () => {
    const user = userEvent.setup();
    mockedUsePublishedProducts.mockReturnValue({
      products: [makeProduct({ id: "vaso", name: "Vaso" })],
      loading: false,
      error: null,
      reload: vi.fn(),
    });

    renderProductsPage();

    await user.type(screen.getByTestId("products-search-input"), "porta");

    expect(screen.getByText("Nenhum produto encontrado")).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Todos os produtos cadastrados"),
    ).not.toBeInTheDocument();
  });

  it("searches by category and filters products by category", async () => {
    const user = userEvent.setup();
    mockedUsePublishedProducts.mockReturnValue({
      products: [
        makeProduct({
          id: "porta-joias",
          name: "Porta Joias",
          categories: [
            {
              id: "organizacao",
              name: "Organização",
              slug: "organizacao",
            },
          ],
        }),
        makeProduct({
          id: "trono-de-ferro",
          name: "Trono de Ferro",
          categories: [
            {
              id: "decoracao",
              name: "Decoração",
              slug: "decoracao",
            },
          ],
        }),
      ],
      loading: false,
      error: null,
      reload: vi.fn(),
    });

    renderProductsPage();

    await user.type(screen.getByTestId("products-search-input"), "decoracao");

    expect(screen.queryByText("Porta Joias")).not.toBeInTheDocument();
    expect(screen.getByText("Trono de Ferro")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Limpar busca" }));
    await user.click(
      screen.getByTestId("products-category-filter-organizacao"),
    );

    expect(screen.getByText("Porta Joias")).toBeInTheDocument();
    expect(screen.queryByText("Trono de Ferro")).not.toBeInTheDocument();
  });
});
