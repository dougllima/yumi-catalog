import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mediaStorage, productRepository } from "@/application/dependencies";
import type { Product } from "@/domain/product";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";

vi.mock("@/application/dependencies", () => ({
  authService: {
    signOut: vi.fn(),
  },
  mediaStorage: {
    uploadProductImage: vi.fn(),
    remove: vi.fn(),
  },
  productRepository: {
    listAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    addImage: vi.fn(),
    removeImage: vi.fn(),
    updateImageOrder: vi.fn(),
  },
  runtimeBackend: "supabase",
}));

const mockedProductRepository = vi.mocked(productRepository);
const mockedMediaStorage = vi.mocked(mediaStorage);

const makeProduct = (overrides: Partial<Product>): Product => ({
  id: "produto",
  name: "Produto",
  images: [],
  imageRecords: [],
  isActive: true,
  ...overrides,
});

describe("AdminProductsPage", () => {
  beforeEach(() => {
    mockedProductRepository.listAll.mockReset();
    mockedProductRepository.create.mockReset();
    mockedProductRepository.update.mockReset();
    mockedProductRepository.delete.mockReset();
    mockedProductRepository.addImage.mockReset();
    mockedProductRepository.removeImage.mockReset();
    mockedProductRepository.updateImageOrder.mockReset();
    mockedMediaStorage.uploadProductImage.mockReset();
    mockedMediaStorage.remove.mockReset();
  });

  it("loads products, filters the admin list, and populates the edit form", async () => {
    const user = userEvent.setup();
    mockedProductRepository.listAll.mockResolvedValue([
      makeProduct({ id: "porta-joias", name: "Porta Joias", isActive: true }),
      makeProduct({
        id: "vaso",
        name: "Vaso",
        isActive: false,
        price: 60,
        weight: 210,
      }),
    ]);

    render(<AdminProductsPage />);

    expect(await screen.findByText("Porta Joias")).toBeInTheDocument();
    expect(screen.getByText("Vaso")).toBeInTheDocument();

    await user.type(screen.getByTestId("admin-products-search-input"), "vaso");

    expect(screen.queryByText("Porta Joias")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Vaso/ }));

    expect(screen.getByTestId("admin-product-id-input")).toHaveValue("vaso");
    expect(screen.getByTestId("admin-product-name-input")).toHaveValue("Vaso");
    expect(screen.getByTestId("admin-product-weight-input")).toHaveValue("210");
    expect(screen.getByTestId("admin-product-price-input")).toHaveValue("60");
    expect(screen.getByTestId("admin-product-active-input")).not.toBeChecked();
  });

  it("creates a product, uploads selected images, and registers image metadata", async () => {
    const user = userEvent.setup();
    const savedProduct = makeProduct({
      id: "mini-box",
      name: "Mini Box",
      description: "",
      weight: 12.5,
      price: 19.9,
    });
    const file = new File(["image"], "mini-box.webp", {
      type: "image/webp",
    });

    mockedProductRepository.listAll
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([savedProduct]);
    mockedProductRepository.create.mockResolvedValueOnce(savedProduct);
    mockedMediaStorage.uploadProductImage.mockResolvedValueOnce({
      storagePath: "mini-box/mini-box.webp",
      publicUrl: "https://storage.local/mini-box.webp",
    });
    mockedProductRepository.addImage.mockResolvedValueOnce({
      id: "image-1",
      url: "https://storage.local/mini-box.webp",
      storagePath: "mini-box/mini-box.webp",
      altText: "Mini Box",
      sortOrder: 0,
    });

    render(<AdminProductsPage />);

    await waitFor(() =>
      expect(mockedProductRepository.listAll).toHaveBeenCalledTimes(1),
    );

    await user.type(screen.getByTestId("admin-product-name-input"), "Mini Box");
    expect(screen.getByTestId("admin-product-id-input")).toHaveValue(
      "mini-box",
    );

    await user.type(
      screen.getByTestId("admin-product-description-input"),
      "Caixa pequena",
    );
    await user.type(screen.getByTestId("admin-product-weight-input"), "12,5");
    await user.type(screen.getByTestId("admin-product-price-input"), "19,90");
    await user.upload(screen.getByTestId("admin-product-images-input"), file);
    await user.click(screen.getByRole("button", { name: /Salvar produto/ }));

    await waitFor(() =>
      expect(mockedProductRepository.create).toHaveBeenCalledWith({
        id: "mini-box",
        name: "Mini Box",
        description: "Caixa pequena",
        weight: 12.5,
        priceInCents: 1990,
        isActive: true,
      }),
    );
    expect(mockedMediaStorage.uploadProductImage).toHaveBeenCalledWith(
      "mini-box",
      file,
    );
    expect(mockedProductRepository.addImage).toHaveBeenCalledWith("mini-box", {
      storagePath: "mini-box/mini-box.webp",
      altText: "Mini Box",
      sortOrder: 0,
    });
    expect(
      await screen.findByText("Produto salvo com sucesso."),
    ).toBeInTheDocument();
  });
});
