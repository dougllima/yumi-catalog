import { ProductCard } from "@/components/ProductCard";
import { type Product, relatedProducts } from "@/domain/product";
import { usePublishedProducts } from "@/hooks/useProducts";

export function RelatedProducts({ product }: { product: Product }) {
  const { products } = usePublishedProducts();
  const related = relatedProducts(product, products);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4 pt-10" aria-labelledby="related-title">
      <h2
        id="related-title"
        className="font-display text-3xl font-semibold leading-tight"
      >
        Você também pode gostar
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
