import { ArrowRight, Heart } from "lucide-react";

import { FeatureStrip } from "@/components/FeatureStrip";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

export function HomePage() {
  return (
    <>
      <Hero />

      <main className="mx-auto w-full max-w-[1400px] px-4 pb-6 pt-4 sm:px-7 sm:pb-8 sm:pt-5">
        <section
          id="produtos"
          className="grid gap-4"
          aria-labelledby="products-title"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid gap-1.5">
              <p className="flex items-center gap-2 text-sm font-extrabold text-primary">
                <Heart className="size-4" aria-hidden="true" />
                Destaques da Yumi Studio
              </p>
              <h2
                id="products-title"
                className="font-display text-3xl font-semibold leading-tight tracking-normal sm:text-4xl"
              >
                Peças queridinhas
              </h2>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Produtos fofos, úteis e cheios de personalidade para deixar seu
                dia mais bonito e organizado.
              </p>
            </div>

            <Button asChild variant="outline" className="w-fit rounded-full px-5">
              <a href="#produtos">
                Ver todos os produtos
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </div>

          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
            aria-label="Produtos disponíveis"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <FeatureStrip />
      </main>
    </>
  );
}
