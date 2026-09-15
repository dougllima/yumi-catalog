import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProductImageGallery } from "@/components/ProductImageGallery";

describe("ProductImageGallery", () => {
  it("shows an unavailable image state when there are no images", () => {
    render(<ProductImageGallery images={[]} productName="Produto teste" />);

    expect(screen.getByText(/Imagem indispon/i)).toBeInTheDocument();
  });

  it("cycles through images with next and previous controls", async () => {
    const user = userEvent.setup();

    render(
      <ProductImageGallery
        images={["/products/item/01.webp", "/products/item/02.webp"]}
        productName="Produto teste"
      />,
    );

    const activeImage = screen.getByTestId("product-image-gallery-active");

    expect(activeImage).toHaveAttribute("alt", "Produto teste - imagem 1");
    expect(activeImage).toHaveAttribute(
      "src",
      expect.stringContaining("/products/item/01.webp"),
    );

    await user.click(
      screen.getByRole("button", {
        name: /Ver pr.xima foto de Produto teste/,
      }),
    );

    expect(activeImage).toHaveAttribute("alt", "Produto teste - imagem 2");
    expect(
      screen.getByRole("button", { name: "Ver imagem 2 de Produto teste" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(
      screen.getByRole("button", {
        name: "Ver foto anterior de Produto teste",
      }),
    );

    expect(activeImage).toHaveAttribute("alt", "Produto teste - imagem 1");
  });

  it("applies saved crop metadata to rendered images", () => {
    render(
      <ProductImageGallery
        images={["/products/item/01.webp"]}
        imageRecords={[
          {
            id: "image-1",
            url: "/products/item/01.webp",
            sortOrder: 0,
            crop: {
              xPercent: 35,
              yPercent: 70,
              zoom: 1.4,
            },
          },
        ]}
        productName="Produto teste"
      />,
    );

    expect(screen.getByTestId("product-image-gallery-active")).toHaveStyle({
      objectPosition: "35% 70%",
      transform: "scale(1.4)",
    });
  });
});
