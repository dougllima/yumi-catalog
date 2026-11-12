import { Link } from "react-router-dom";

import { ProductGallery } from "@/components/ProductGallery";
import { Card, CardContent } from "@/components/ui/card";
import { isNewProduct, type Product } from "@/domain/product";
import { formatCurrency } from "@/utils/formatters";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const hasDescription = Boolean(product.description?.trim());
  const price =
    typeof product.price === "number" && product.price > 0
      ? product.price
      : null;
  const visibleCategories = product.categories.slice(0, 2);

  return (
    <Card
      asChild
      className="group relative h-full overflow-hidden py-0 shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10"
    >
      <article>
        <Link
          to={`/produto/${product.id}`}
          className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          aria-label={`Ver detalhes de ${product.name}`}
        />
        <ProductGallery
          image={product.imageRecords?.[0]}
          images={product.images}
          productName={product.name}
          hoverImage={product.imageRecords?.[1]}
        />
        {isNewProduct(product) && (
          <span className="absolute left-2.5 top-2.5 z-[5] rounded-full bg-primary px-2.5 py-1 text-[0.68rem] font-extrabold uppercase leading-none text-primary-foreground shadow-md">
            Novo
          </span>
        )}

        <CardContent className="flex flex-1 flex-col gap-2 p-3 sm:p-3.5">
          {/* Título reserva 2 linhas e a linha de categorias tem altura fixa,
              para que badges e preço fiquem alinhados entre cards. */}
          <h3 className="line-clamp-2 min-h-[2.5rem] font-display text-[0.95rem] font-semibold leading-tight tracking-normal sm:min-h-[2.65rem] sm:text-[1.05rem]">
            {product.name}
          </h3>
          <div className="flex h-5 flex-wrap gap-1 overflow-hidden">
            {visibleCategories.map((category) => (
              <span
                key={category.slug}
                className="rounded-full border bg-background/55 px-2 pb-0.5 pt-[0.2rem] text-[0.62rem] font-extrabold uppercase leading-none text-muted-foreground sm:text-[0.68rem]"
              >
                {category.name}
              </span>
            ))}
          </div>

          {hasDescription && (
            <p className="line-clamp-2 text-[0.8rem] leading-snug text-muted-foreground sm:text-[0.84rem]">
              {product.description}
            </p>
          )}

          <strong className="mt-auto pt-1 text-right text-base font-extrabold leading-none text-primary sm:text-lg">
            {price !== null ? formatCurrency(price) : "Sob encomenda"}
          </strong>
        </CardContent>
      </article>
    </Card>
  );
}
