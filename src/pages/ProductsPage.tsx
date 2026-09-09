import { Search, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";

import { FeatureStrip } from "@/components/FeatureStrip";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { normalizeSearch } from "@/domain/product";
import { usePublishedProducts } from "@/hooks/useProducts";

const productSkeletons = Array.from({ length: 12 }, (_, index) => index);

export function ProductsPage() {
  const { products, loading, error } = usePublishedProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearchTerm = normalizeSearch(searchTerm);

  const filteredProducts = useMemo(() => {
    if (!normalizedSearchTerm) {
      return products;
    }

    return products.filter((product) =>
      normalizeSearch(product.name).includes(normalizedSearchTerm),
    );
  }, [normalizedSearchTerm, products]);

  const hasSearch = searchTerm.trim().length > 0;
  const hasProducts = filteredProducts.length > 0;

  return (
    <>
      <main className="mx-auto w-full max-w-[1400px] px-4 pb-6 pt-6 sm:px-7 sm:pb-8 sm:pt-8">
        <section className="grid gap-5" aria-labelledby="all-products-title">
          <div className="grid gap-4 rounded-[1.75rem] border bg-card/58 p-4 shadow-xl shadow-primary/8 backdrop-blur sm:p-6 lg:grid-cols-[1fr_420px] lg:items-end">
            <div className="grid gap-2">
              <p className="flex items-center gap-2 text-sm font-extrabold text-primary">
                <Sparkles className="size-4" aria-hidden="true" />
                Catálogo completo
              </p>
              <h1
                id="all-products-title"
                className="font-display text-3xl font-semibold leading-tight tracking-normal sm:text-4xl"
              >
                Todos os produtos
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Encontre as peças cadastradas no catálogo da Yumi Studio.
              </p>
            </div>

            <form
              className="grid gap-2"
              role="search"
              onSubmit={(event) => event.preventDefault()}
            >
              <label
                htmlFor="product-search"
                className="text-sm font-extrabold text-foreground"
              >
                Filtrar por nome
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="product-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar produto..."
                  className="h-11 w-full rounded-full border bg-background/70 py-2 pl-10 pr-11 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
                {hasSearch && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 size-9 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchTerm("")}
                    aria-label="Limpar filtro por nome"
                  >
                    <X aria-hidden="true" />
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Exibindo{" "}
              <strong className="font-extrabold text-foreground">
                {loading ? "..." : filteredProducts.length}
              </strong>{" "}
              de {products.length} produtos
            </p>
            {hasSearch && (
              <p>
                Filtro ativo para{" "}
                <strong className="font-extrabold text-primary">
                  {searchTerm.trim()}
                </strong>
              </p>
            )}
          </div>

          {error && (
            <p className="rounded-2xl border bg-card/70 px-4 py-3 text-sm font-semibold text-destructive shadow-sm">
              {error}
            </p>
          )}

          {loading ? (
            <div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
              aria-label="Carregando produtos"
            >
              {productSkeletons.map((item) => (
                <div
                  key={item}
                  className="min-h-[310px] animate-pulse rounded-[1rem] border bg-card/50 shadow-lg shadow-primary/5"
                />
              ))}
            </div>
          ) : hasProducts ? (
            <div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
              aria-label="Todos os produtos cadastrados"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid min-h-[260px] place-items-center rounded-[1.5rem] border bg-card/62 p-6 text-center shadow-lg shadow-primary/5 backdrop-blur">
              <div className="grid max-w-sm gap-3">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-primary">
                  <Search aria-hidden="true" />
                </div>
                <h2 className="font-display text-2xl font-semibold">
                  Nenhum produto encontrado
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Tente buscar por outro nome ou limpe o filtro para ver o
                  catálogo completo.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mx-auto rounded-full"
                  onClick={() => setSearchTerm("")}
                >
                  Limpar filtro
                </Button>
              </div>
            </div>
          )}
        </section>

        <FeatureStrip />
      </main>
    </>
  );
}
