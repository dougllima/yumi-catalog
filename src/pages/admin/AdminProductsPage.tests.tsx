import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mediaStorage, productRepository } from "@/application/dependencies";
import type { Product, ProductCategory } from "@/domain/product";
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
    listCategories: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    addImage: vi.fn(),
    removeImage: vi.fn(),
    updateImageOrder: vi.fn(),
    updateImageCrop: vi.fn(),
    replaceProductCategories: vi.fn(),
  },
  runtimeBackend: "supabase",
}));

const mockedProductRepository = vi.mocked(productRepository);
const mockedMediaStorage = vi.mocked(mediaStorage);

const decoracaoCategory: ProductCategory = {
  id: "category-decoracao",
  name: "Decoração",
  slug: "decoracao",
};

const makeProduct = (overrides: Partial<Product>): Product => ({
  id: "produto",
  name: "Produto",
  images: [],
  imageRecords: [],
  categories: [],
  isActive: true,
  ...overrides,
});

describe("AdminProductsPage", () => {
  beforeEach(() => {
    mockedProductRepository.listAll.mockReset();
    mockedProductRepository.listCategories.mockReset();
    mockedProductRepository.create.mockReset();
    mockedProductRepository.update.mockReset();
    mockedProductRepository.delete.mockReset();
    mockedProductRepository.addImage.mockReset();
    mockedProductRepository.removeImage.mockReset();
    mockedProductRepository.updateImageOrder.mockReset();
    mockedProductRepository.updateImageCrop.mockReset();
    mockedProductRepository.replaceProductCategories.mockReset();
    mockedMediaStorage.uploadProductImage.mockReset();
    mockedMediaStorage.remove.mockReset();
    mockedProductRepository.listCategories.mockResolvedValue([]);
    mockedProductRepository.updateImageCrop.mockResolvedValue({
      id: "image-1",
      url: "https://storage.local/mini-box.webp",
      storagePath: "mini-box/mini-box.webp",
      altText: "Mini Box",
      sortOrder: 0,
      crop: {
        xPercent: 50,
        yPercent: 50,
        zoom: 1,
      },
    });
    mockedProductRepository.replaceProductCategories.mockResolvedValue([]);
  });

  it("loads products, filters the admin list, and populates the edit form", async () => {
    const user = userEvent.setup();
    mockedProductRepository.listAll.mockResolvedValue([
      makeProduct({
        id: "vaso",
        name: "Vaso",
        isActive: false,
        price: 60,
        weight: 210,
      }),
      makeProduct({ id: "porta-joias", name: "Porta Joias", isActive: true }),
    ]);

    render(<AdminProductsPage />);

    expect(await screen.findByText("Porta Joias")).toBeInTheDocument();
    expect(screen.getByText("Vaso")).toBeInTheDocument();

    expect(
      within(screen.getByTestId("admin-products-list"))
        .getAllByRole("button")
        .map((button) => button.textContent),
    ).toEqual(["Porta JoiasAtivo", "VasoInativo"]);

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
      categories: [decoracaoCategory],
    });
    const file = new File(["image"], "mini-box.webp", {
      type: "image/webp",
    });

    mockedProductRepository.listAll
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([savedProduct]);
    mockedProductRepository.listCategories.mockResolvedValue([
      decoracaoCategory,
    ]);
    mockedProductRepository.create.mockResolvedValueOnce(savedProduct);
    mockedProductRepository.replaceProductCategories.mockResolvedValueOnce([
      decoracaoCategory,
    ]);
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
    await user.type(
      screen.getByTestId("admin-product-category-input"),
      "decoracao{Enter}",
    );
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
    expect(
      mockedProductRepository.replaceProductCategories,
    ).toHaveBeenCalledWith("mini-box", ["Decoração"]);
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

  it("accepts image files dropped into the image field", async () => {
    const user = userEvent.setup();
    const savedProduct = makeProduct({
      id: "mini-box",
      name: "Mini Box",
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
    fireEvent.drop(screen.getByTestId("admin-product-images-dropzone"), {
      dataTransfer: {
        files: [file],
      },
    });

    expect(screen.getByAltText(/mini-box\.webp/)).toBeInTheDocument();
    expect(
      screen.getByTestId("admin-product-pending-image-preview"),
    ).toHaveTextContent("mini-box.webp");

    await user.click(screen.getByRole("button", { name: /Salvar produto/ }));

    await waitFor(() =>
      expect(mockedMediaStorage.uploadProductImage).toHaveBeenCalledWith(
        "mini-box",
        file,
      ),
    );
    expect(mockedProductRepository.addImage).toHaveBeenCalledWith("mini-box", {
      storagePath: "mini-box/mini-box.webp",
      altText: "Mini Box",
      sortOrder: 0,
    });
  });

  it("updates crop metadata for an existing product image", async () => {
    const user = userEvent.setup();
    const productWithImage = makeProduct({
      id: "mini-box",
      name: "Mini Box",
      imageRecords: [
        {
          id: "image-1",
          url: "https://storage.local/mini-box.webp",
          storagePath: "mini-box/mini-box.webp",
          altText: "Mini Box",
          sortOrder: 0,
          crop: {
            xPercent: 50,
            yPercent: 50,
            zoom: 1,
          },
        },
      ],
      images: ["https://storage.local/mini-box.webp"],
    });

    mockedProductRepository.listAll.mockResolvedValue([productWithImage]);

    render(<AdminProductsPage />);

    await user.click(await screen.findByRole("button", { name: /Mini Box/ }));
    await user.click(screen.getByRole("button", { name: "Enquadrar imagem" }));

    fireEvent.change(screen.getByTestId("admin-product-crop-x-input"), {
      target: { value: "25" },
    });
    fireEvent.change(screen.getByTestId("admin-product-crop-y-input"), {
      target: { value: "70" },
    });
    fireEvent.change(screen.getByTestId("admin-product-crop-zoom-input"), {
      target: { value: "1.5" },
    });

    expect(screen.getByTestId("admin-product-crop-preview")).toHaveStyle({
      objectPosition: "25% 70%",
      transform: "scale(1.5)",
    });

    await user.click(
      screen.getByRole("button", { name: "Salvar enquadramento" }),
    );

    await waitFor(() =>
      expect(mockedProductRepository.updateImageCrop).toHaveBeenCalledWith(
        "image-1",
        {
          xPercent: 25,
          yPercent: 70,
          zoom: 1.5,
        },
      ),
    );
  });

  it("shows existing categories and removes selected categories in the form", async () => {
    const user = userEvent.setup();
    mockedProductRepository.listAll.mockResolvedValue([
      makeProduct({
        id: "porta-joias",
        name: "Porta Joias",
        categories: [decoracaoCategory],
      }),
    ]);
    mockedProductRepository.listCategories.mockResolvedValue([
      decoracaoCategory,
      {
        id: "category-geek",
        name: "Geek",
        slug: "geek",
      },
    ]);

    render(<AdminProductsPage />);

    await user.click(
      await screen.findByRole("button", { name: /Porta Joias/ }),
    );

    expect(screen.getByLabelText("Categorias selecionadas")).toHaveTextContent(
      "Decoração",
    );

    await user.click(
      screen.getByRole("button", { name: "Remover categoria Decoração" }),
    );

    expect(
      screen.queryByLabelText("Categorias selecionadas"),
    ).not.toBeInTheDocument();

    await user.type(screen.getByTestId("admin-product-category-input"), "gee");
    await user.click(screen.getByRole("button", { name: /Geek/ }));

    expect(screen.getByLabelText("Categorias selecionadas")).toHaveTextContent(
      "Geek",
    );
  });
});
