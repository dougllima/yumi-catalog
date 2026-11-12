import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
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
      <SectionHeader titleId="related-title" title="Você também pode gostar" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
