import { ChevronLeft, ChevronRight, Search, Sparkles, X } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { PageContainer } from "@/components/PageContainer";
import { Panel } from "@/components/Panel";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { SectionHeader } from "@/components/SectionHeader";
import { StatePanel } from "@/components/StatePanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { inputClass } from "@/components/uiStyles";
import { normalizeSearch } from "@/domain/product";
import { usePublishedProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

const pageSizeOptions = [12, 24, 48] as const;
const defaultPageSize = 24;

const productSkeletons = Array.from({ length: 12 }, (_, index) => index);
const categorySkeletons = Array.from({ length: 5 }, (_, index) => index);

export function ProductsPage() {
  const { products, loading, error } = usePublishedProducts();
  // Filtros na URL para sobreviverem à ida e volta da página de produto.
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") ?? "";
  const selectedCategorySlug = searchParams.get("categoria") ?? "";
  const requestedPageSize = Number(searchParams.get("por-pagina"));
  const pageSize =
    pageSizeOptions.find((option) => option === requestedPageSize) ??
    defaultPageSize;
  const requestedPage = Number(searchParams.get("pagina"));
  const updateParams = (changes: Record<string, string>) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);

        Object.entries(changes).forEach(([key, value]) => {
          if (value) {
            next.set(key, value);
          } else {
            next.delete(key);
          }
        });

        return next;
      },
      { replace: true },
    );
  // Mudar filtro volta para a primeira página.
  const setSearchTerm = (value: string) =>
    updateParams({ q: value, pagina: "" });
  const setSelectedCategorySlug = (value: string) =>
    updateParams({ categoria: value, pagina: "" });
  const setPageSize = (value: number) =>
    updateParams({
      "por-pagina": value === defaultPageSize ? "" : String(value),
      pagina: "",
    });
  const setPage = (value: number) => {
    updateParams({ pagina: value > 1 ? String(value) : "" });
    window.scrollTo({ top: 0 });
  };
  const normalizedSearchTerm = normalizeSearch(searchTerm);

  const categoryFilters = useMemo(() => {
    const categories = new Map<
      string,
      { slug: string; name: string; count: number }
    >();

    products.forEach((product) => {
      product.categories.forEach((category) => {
        const current = categories.get(category.slug);

        categories.set(category.slug, {
          slug: category.slug,
          name: current?.name ?? category.name,
          count: (current?.count ?? 0) + 1,
        });
      });
    });

    return [...categories.values()].sort((left, right) =>
      left.name.localeCompare(right.name, "pt-BR"),
    );
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategorySlug ||
      product.categories.some(
        (category) => category.slug === selectedCategorySlug,
      );

    if (!matchesCategory) {
      return false;
    }

    if (!normalizedSearchTerm) {
      return true;
    }

    const searchable = [
      product.name,
      product.description,
      ...product.categories.map((category) => category.name),
      ...product.categories.map((category) => category.slug),
    ]
      .filter(Boolean)
      .join(" ");

    return normalizeSearch(searchable).includes(normalizedSearchTerm);
  });

  const hasSearch = searchTerm.trim().length > 0;
  const hasCategoryFilter = Boolean(selectedCategorySlug);
  const selectedCategory = categoryFilters.find(
    (category) => category.slug === selectedCategorySlug,
  );
  const hasFilters = hasSearch || hasCategoryFilter;
  const hasProducts = filteredProducts.length > 0;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(
    Math.max(1, Number.isInteger(requestedPage) ? requestedPage : 1),
    totalPages,
  );
  const pageStart = (currentPage - 1) * pageSize;
  const pageProducts = filteredProducts.slice(pageStart, pageStart + pageSize);

  return (
    <>
      <PageContainer>
        <section className="grid gap-5" aria-labelledby="all-products-title">
          <Panel className="grid gap-4 lg:grid-cols-[1fr_420px] lg:items-end">
            <SectionHeader
              as="h1"
              titleId="all-products-title"
              eyebrow={
                <>
                  <Sparkles aria-hidden="true" />
                  Catálogo completo
                </>
              }
              title="Todos os produtos"
              description="Encontre as peças cadastradas no catálogo da Yumi Studio."
            />

            <form
              className="grid gap-2"
              role="search"
              onSubmit={(event) => event.preventDefault()}
            >
              <label
                htmlFor="product-search"
                className="text-sm font-extrabold text-foreground"
              >
                Buscar no catálogo
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="product-search"
                  data-testid="products-search-input"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Nome, descrição ou categoria..."
                  className={cn(
                    inputClass,
                    "w-full py-2 pl-10 pr-11 text-sm text-foreground [&::-webkit-search-cancel-button]:appearance-none",
                  )}
                />
                {hasSearch && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 size-9 -translate-y-1/2 rounded-full text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchTerm("")}
                    aria-label="Limpar busca"
                  >
                    <X aria-hidden="true" />
                  </Button>
                )}
              </div>
            </form>
          </Panel>

          {loading && (
            <div className="flex flex-wrap gap-2" aria-hidden="true">
              {categorySkeletons.map((item) => (
                <Skeleton key={item} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          )}

          {!loading && categoryFilters.length > 0 && (
            <div
              className="flex flex-wrap gap-2"
              aria-label="Filtrar produtos por categoria"
            >
              <Button
                type="button"
                variant={!selectedCategorySlug ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setSelectedCategorySlug("")}
              >
                Todas
              </Button>
              {categoryFilters.map((category) => (
                <Button
                  key={category.slug}
                  type="button"
                  data-testid={`products-category-filter-${category.slug}`}
                  variant={
                    selectedCategorySlug === category.slug
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedCategorySlug(category.slug)}
                >
                  {category.name}
                  <span className="text-xs opacity-75">{category.count}</span>
                </Button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Exibindo{" "}
              <strong className="font-extrabold text-foreground">
                {loading ? "..." : pageProducts.length}
              </strong>{" "}
              de {filteredProducts.length} produtos
              {filteredProducts.length !== products.length &&
                ` (${products.length} no catálogo)`}
            </p>
            {hasSearch && (
              <p>
                Busca ativa para{" "}
                <strong className="font-extrabold text-primary">
                  {searchTerm.trim()}
                </strong>
              </p>
            )}
            {selectedCategory && (
              <p>
                Categoria{" "}
                <strong className="font-extrabold text-primary">
                  {selectedCategory.name}
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
              className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
              aria-label="Carregando produtos"
            >
              {productSkeletons.map((item) => (
                <ProductCardSkeleton key={item} />
              ))}
            </div>
          ) : hasProducts ? (
            <div
              className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
              aria-label="Todos os produtos cadastrados"
            >
              {pageProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid min-h-[260px] place-items-center">
              <StatePanel
                icon={Search}
                title="Nenhum produto encontrado"
                description="Tente buscar por outro termo ou limpe os filtros para ver o catálogo completo."
              >
                <Button
                  type="button"
                  variant="secondary"
                  className="mx-auto rounded-full"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategorySlug("");
                  }}
                >
                  {hasFilters ? "Limpar filtros" : "Ver catálogo"}
                </Button>
              </StatePanel>
            </div>
          )}

          {!loading && hasProducts && (
            <nav
              className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
              aria-label="Paginação de produtos"
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                Por página
                <select
                  data-testid="products-page-size"
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  className={cn(
                    inputClass,
                    "px-3 text-sm font-bold text-foreground",
                  )}
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    disabled={currentPage <= 1}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    <ChevronLeft aria-hidden="true" />
                    Anterior
                  </Button>
                  <span
                    className="text-sm font-bold"
                    data-testid="products-page-indicator"
                  >
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    Próxima
                    <ChevronRight aria-hidden="true" />
                  </Button>
                </div>
              )}
            </nav>
          )}
        </section>
      </PageContainer>
    </>
  );
}
