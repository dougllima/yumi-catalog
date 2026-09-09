import { useEffect, useState } from "react";

import { productRepository } from "@/application/dependencies";
import type { Product } from "@/domain/product";

type ProductsState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

export function usePublishedProducts(): ProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      setProducts(await productRepository.listPublished());
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : "Não foi possível carregar os produtos.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProducts();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return {
    products,
    loading,
    error,
    reload: loadProducts,
  };
}

export function useProduct(id?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isActive = true;
    const productId = id;

    async function loadProduct() {
      setLoading(true);
      setError(null);

      try {
        const result = await productRepository.getById(productId);

        if (isActive) {
          setProduct(result);
        }
      } catch (unknownError) {
        if (isActive) {
          setError(
            unknownError instanceof Error
              ? unknownError.message
              : "Não foi possível carregar o produto.",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    const timeoutId = window.setTimeout(() => {
      void loadProduct();
    }, 0);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [id]);

  return {
    product,
    loading,
    error,
  };
}
