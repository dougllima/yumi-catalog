import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { contactUrl } from "@/config/contact";
import type { Product } from "@/domain/product";
import { useProduct, usePublishedProducts } from "@/hooks/useProducts";
import { ProductPage } from "@/pages/ProductPage";

vi.mock("@/hooks/useProducts", () => ({
  useProduct: vi.fn(),
  usePublishedProducts: vi.fn(),
}));

const mockedUseProduct = vi.mocked(useProduct);

const product: Product = {
  id: "porta-joias",
  name: "Porta Joias",
  description: "Organizador delicado",
  price: 130,
  images: ["/products/porta-joias/01.webp"],
  categories: [
    {
      id: "organizacao",
      name: "Organização",
      slug: "organizacao",
    },
  ],
  isActive: true,
  showOnHome: false,
};

const renderProductPage = () =>
  render(
    <MemoryRouter initialEntries={["/produto/porta-joias"]}>
      <Routes>
        <Route path="/produto/:id" element={<ProductPage />} />
      </Routes>
    </MemoryRouter>,
  );

describe("ProductPage", () => {
  beforeEach(() => {
    mockedUseProduct.mockReset();
    vi.mocked(usePublishedProducts).mockReturnValue({
      products: [],
      loading: false,
      error: null,
      reload: vi.fn(),
    });
  });

  it("renders product details and contact action", () => {
    mockedUseProduct.mockReturnValue({
      product,
      loading: false,
      error: null,
    });

    renderProductPage();

    expect(mockedUseProduct).toHaveBeenCalledWith("porta-joias");
    expect(
      screen.getByRole("heading", { name: "Porta Joias" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Organizador delicado")).toBeInTheDocument();
    expect(screen.getByText("R$ 130,00")).toBeInTheDocument();
    expect(screen.getByText("Categorias")).toBeInTheDocument();
    expect(screen.getByText("Organização")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Falar sobre este produto/ }),
    ).toHaveAttribute("href", contactUrl);
  });

  it("goes back to the previous screen when there is in-app history", async () => {
    mockedUseProduct.mockReturnValue({ product, loading: false, error: null });

    render(
      <MemoryRouter
        initialEntries={[
          "/produtos?categoria=organizacao",
          "/produto/porta-joias",
        ]}
        initialIndex={1}
      >
        <Routes>
          <Route path="/produtos" element={<div>Lista de produtos</div>} />
          <Route path="/produto/:id" element={<ProductPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.click(
      screen.getByRole("link", { name: /Voltar ao cat.logo/i }),
    );

    expect(screen.getByText("Lista de produtos")).toBeInTheDocument();
  });

  it("renders the loading state", () => {
    mockedUseProduct.mockReturnValue({
      product: null,
      loading: true,
      error: null,
    });

    renderProductPage();

    expect(screen.getByText("Carregando produto")).toBeInTheDocument();
  });

  it("renders an unavailable state for missing products", () => {
    mockedUseProduct.mockReturnValue({
      product: null,
      loading: false,
      error: null,
    });

    renderProductPage();

    expect(screen.getByText(/Produto n.o encontrado/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Voltar ao cat.logo/i }),
    ).toHaveAttribute("href", "/");
  });
});
