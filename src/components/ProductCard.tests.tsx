import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/domain/product";

const product: Product = {
  id: "porta-joias",
  name: "Porta Joias",
  description: "Organizador delicado",
  price: 130,
  images: ["/products/porta-joias/01.webp"],
  isActive: true,
};

describe("ProductCard", () => {
  it("renders product details and links to the product page", () => {
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: "Ver detalhes de Porta Joias" }),
    ).toHaveAttribute("href", "/produto/porta-joias");
    expect(screen.getByText("Porta Joias")).toBeInTheDocument();
    expect(screen.getByText("Organizador delicado")).toBeInTheDocument();
    expect(screen.getByText("R$ 130,00")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("/products/porta-joias/01.webp"),
    );
  });
});
