import type { ProductRepository } from "@/application/contracts";
import { products as staticProducts } from "@/data/products";
import type {
  Product,
  ProductCategory,
  ProductImage,
  ProductImageCropInput,
  ProductImageInput,
  ProductInput,
} from "@/domain/product";
import { onlyActiveProducts } from "@/domain/product";

const notConfigured = () =>
  new Error(
    "Configure VITE_DATA_PROVIDER=supabase e as variáveis do Supabase para administrar produtos.",
  );

export class StaticProductRepository implements ProductRepository {
  async listPublished() {
    return onlyActiveProducts(staticProducts);
  }

  async listAll() {
    return staticProducts;
  }

  async getById(id: string, options?: { includeInactive?: boolean }) {
    const product = staticProducts.find((item) => item.id === id) ?? null;

    if (!product || options?.includeInactive || product.isActive) {
      return product;
    }

    return null;
  }

  async create(input: ProductInput): Promise<Product> {
    void input;
    throw notConfigured();
  }

  async update(id: string, input: ProductInput): Promise<Product> {
    void id;
    void input;
    throw notConfigured();
  }

  async delete(id: string): Promise<void> {
    void id;
    throw notConfigured();
  }

  async addImage(
    productId: string,
    input: ProductImageInput,
  ): Promise<ProductImage> {
    void productId;
    void input;
    throw notConfigured();
  }

  async removeImage(imageId: string): Promise<void> {
    void imageId;
    throw notConfigured();
  }

  async updateImageOrder(
    productId: string,
    orderedImageIds: string[],
  ): Promise<void> {
    void productId;
    void orderedImageIds;
    throw notConfigured();
  }

  async updateImageCrop(
    imageId: string,
    input: ProductImageCropInput,
  ): Promise<ProductImage> {
    void imageId;
    void input;
    throw notConfigured();
  }

  async listCategories(): Promise<ProductCategory[]> {
    const categories = new Map<string, ProductCategory>();

    staticProducts.forEach((product) => {
      product.categories.forEach((category) => {
        categories.set(category.slug, category);
      });
    });

    return [...categories.values()].sort((left, right) =>
      left.name.localeCompare(right.name, "pt-BR"),
    );
  }

  async replaceProductCategories(
    productId: string,
    categoryNames: string[],
  ): Promise<ProductCategory[]> {
    void productId;
    void categoryNames;
    throw notConfigured();
  }
}
