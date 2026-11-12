import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mediaStorage, productRepository } from "@/application/dependencies";
import type { ProductCategory } from "@/domain/product";
import { AdminCategoriesPage } from "@/pages/admin/AdminCategoriesPage";

vi.mock("@/application/dependencies", () => ({
  authService: { signOut: vi.fn() },
  mediaStorage: {
    uploadCategoryImage: vi.fn(),
    remove: vi.fn(),
  },
  productRepository: {
    listCategories: vi.fn(),
    updateCategory: vi.fn(),
  },
}));

const repository = vi.mocked(productRepository);
const storage = vi.mocked(mediaStorage);

const category: ProductCategory = {
  id: "cat-1",
  name: "Decoracao",
  slug: "decoracao",
  imagePath: "categories/cat-1/old.webp",
  imageUrl: "https://cdn.example/old.webp",
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <AdminCategoriesPage />
    </MemoryRouter>,
  );

describe("AdminCategoriesPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    repository.listCategories.mockResolvedValue([category]);
  });

  it("renames a category", async () => {
    repository.updateCategory.mockResolvedValue({
      ...category,
      name: "Decoração",
    });
    renderPage();

    const input = await screen.findByLabelText("Nome");
    await userEvent.clear(input);
    await userEvent.type(input, "Decoração");
    await userEvent.click(screen.getByRole("button", { name: /Salvar/ }));

    await waitFor(() =>
      expect(repository.updateCategory).toHaveBeenCalledWith("cat-1", {
        name: "Decoração",
        imagePath: "categories/cat-1/old.webp",
      }),
    );
  });

  it("replaces the image and removes the previous file", async () => {
    storage.uploadCategoryImage.mockResolvedValue({
      storagePath: "categories/cat-1/new.webp",
      publicUrl: "https://cdn.example/new.webp",
    });
    storage.remove.mockResolvedValue();
    repository.updateCategory.mockResolvedValue(category);
    renderPage();

    const file = new File(["x"], "new.webp", { type: "image/webp" });
    await userEvent.upload(
      await screen.findByLabelText("Imagem da categoria Decoracao"),
      file,
    );
    await userEvent.click(screen.getByRole("button", { name: /Salvar/ }));

    await waitFor(() =>
      expect(repository.updateCategory).toHaveBeenCalledWith("cat-1", {
        name: "Decoracao",
        imagePath: "categories/cat-1/new.webp",
      }),
    );
    expect(storage.remove).toHaveBeenCalledWith("categories/cat-1/old.webp");
  });
});
