import type {
  Product,
  ProductCategory,
  ProductImage,
  ProductImageInput,
  ProductInput,
} from "@/domain/product";

export type AdminSession = {
  id: string;
  email?: string;
};

export type UploadedMedia = {
  storagePath: string;
  publicUrl: string;
};

export type AuthStateUnsubscribe = () => void;

export interface AuthService {
  getCurrentAdmin(): Promise<AdminSession | null>;
  signIn(email: string, password: string): Promise<AdminSession>;
  signOut(): Promise<void>;
  onAuthStateChange(
    callback: (session: AdminSession | null) => void,
  ): AuthStateUnsubscribe;
}

export interface ProductRepository {
  listPublished(): Promise<Product[]>;
  listAll(): Promise<Product[]>;
  getById(
    id: string,
    options?: { includeInactive?: boolean },
  ): Promise<Product | null>;
  create(input: ProductInput): Promise<Product>;
  update(id: string, input: ProductInput): Promise<Product>;
  delete(id: string): Promise<void>;
  addImage(productId: string, input: ProductImageInput): Promise<ProductImage>;
  removeImage(imageId: string): Promise<void>;
  updateImageOrder(productId: string, orderedImageIds: string[]): Promise<void>;
  listCategories(): Promise<ProductCategory[]>;
  replaceProductCategories(
    productId: string,
    categoryNames: string[],
  ): Promise<ProductCategory[]>;
}

export interface MediaStorage {
  uploadProductImage(productId: string, file: File): Promise<UploadedMedia>;
  remove(storagePath: string): Promise<void>;
  getPublicUrl(storagePath: string): string;
}
