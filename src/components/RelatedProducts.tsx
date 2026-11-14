import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { SectionHeader } from "@/components/SectionHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { type Product, relatedProducts } from "@/domain/product";
import { usePublishedProducts } from "@/hooks/useProducts";

const relatedSkeletons = Array.from({ length: 4 }, (_, index) => index);

export function RelatedProductsSkeleton() {
  return (
    <section className="grid gap-4 pt-10" aria-hidden="true">
      <div className="grid gap-1.5">
        <Skeleton className="h-9 w-64 max-w-full sm:h-11" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {relatedSkeletons.map((item) => (
          <ProductCardSkeleton key={item} />
        ))}
      </div>
    </section>
  );
}

export function RelatedProducts({ product }: { product: Product }) {
  const { products, loading } = usePublishedProducts();

  if (loading) {
    return <RelatedProductsSkeleton />;
  }

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
