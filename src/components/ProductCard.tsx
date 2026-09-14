import { Link } from "react-router-dom";

import { ProductGallery } from "@/components/ProductGallery";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/data/products";
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
  const hasFooterInfo = price !== null;

  return (
    <Card
      asChild
      className="group relative overflow-hidden py-0 shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10"
    >
      <article>
        <Link
          to={`/produto/${product.id}`}
          className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
          aria-label={`Ver detalhes de ${product.name}`}
        />
        <ProductGallery images={product.images} productName={product.name} />

        <CardContent className="grid min-h-[126px] gap-2.5 p-3.5">
          <div className="grid gap-1.5">
            <h3 className="font-display text-[1.05rem] font-semibold leading-tight tracking-normal">
              {product.name}
            </h3>
          </div>

          {hasDescription && (
            <p className="line-clamp-2 text-[0.84rem] leading-snug text-muted-foreground">
              {product.description}
            </p>
          )}

          {hasFooterInfo && (
            <div className="mt-auto flex items-end justify-between gap-3">
              {price !== null && (
                <strong className="ml-auto text-lg font-extrabold leading-none text-primary">
                  {formatCurrency(price)}
                </strong>
              )}
            </div>
          )}
        </CardContent>
      </article>
    </Card>
  );
}
