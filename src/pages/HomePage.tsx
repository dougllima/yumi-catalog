import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

import { CategoryShortcuts } from "@/components/CategoryShortcuts";
import { Hero } from "@/components/Hero";
import { HowToOrder } from "@/components/HowToOrder";
import { PageContainer } from "@/components/PageContainer";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { usePublishedProducts } from "@/hooks/useProducts";

const productSkeletons = Array.from({ length: 6 }, (_, index) => index);

export function HomePage() {
  const { products, loading, error } = usePublishedProducts();
  const highlightedProducts = products.filter((product) => product.showOnHome);
  const featuredProducts = (
    highlightedProducts.length > 0 ? highlightedProducts : products
  ).slice(0, 6);

  return (
    <>
      <Hero products={featuredProducts} />

      <PageContainer className="pt-4 sm:pt-5">
        <section
          id="produtos"
          className="grid gap-4"
          aria-labelledby="products-title"
        >
          <SectionHeader
            titleId="products-title"
            eyebrow={
              <>
                <Heart aria-hidden="true" />
                Destaques da Yumi Studio
              </>
            }
            title="Peças queridinhas"
            description="Produtos fofos, úteis e cheios de personalidade para deixar seu dia mais bonito e organizado."
            action={
              <Button
                asChild
                variant="outline"
                className="w-fit rounded-full px-5"
              >
                <Link to="/produtos">
                  Ver todos os produtos
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            }
          />

          <div
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6"
            aria-label="Produtos disponíveis"
          >
            {loading
              ? productSkeletons.map((item) => (
                  <div
                    key={item}
                    className="min-h-[310px] animate-pulse rounded-2xl border bg-card/60 shadow-lg shadow-primary/5"
                  />
                ))
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          {error && (
            <p className="rounded-2xl border bg-card/70 px-4 py-3 text-sm font-semibold text-destructive shadow-sm">
              {error}
            </p>
          )}
        </section>

        <CategoryShortcuts products={products} />

        <HowToOrder />
      </PageContainer>
    </>
  );
}
