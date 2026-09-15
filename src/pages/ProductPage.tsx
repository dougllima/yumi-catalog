import {
  ArrowLeft,
  Heart,
  MessageCircle,
  PackageCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { FeatureStrip } from "@/components/FeatureStrip";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { contactUrl } from "@/config/contact";
import { useProduct } from "@/hooks/useProducts";
import { formatCurrency } from "@/utils/formatters";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id);

  if (loading) {
    return (
      <>
        <main className="mx-auto grid min-h-[48vh] w-full max-w-[1360px] place-items-center px-4 py-10 sm:px-7">
          <section className="grid w-full max-w-md gap-5 rounded-[1.5rem] border bg-card/72 p-7 text-center shadow-xl shadow-primary/8 backdrop-blur">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-primary">
              <Sparkles aria-hidden="true" />
            </div>
            <div className="grid gap-2">
              <h1 className="font-display text-3xl font-semibold">
                Carregando produto
              </h1>
              <p className="text-muted-foreground">
                Só um instante enquanto buscamos as informações.
              </p>
            </div>
          </section>
        </main>
        <FeatureStrip />
      </>
    );
  }

  if (!product || error) {
    return (
      <>
        <main className="mx-auto grid min-h-[48vh] w-full max-w-[1360px] place-items-center px-4 py-10 sm:px-7">
          <section className="grid max-w-md gap-5 rounded-[1.5rem] border bg-card/72 p-7 text-center shadow-xl shadow-primary/8 backdrop-blur">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-primary">
              <Sparkles aria-hidden="true" />
            </div>
            <div className="grid gap-2">
              <h1 className="font-display text-3xl font-semibold">
                {error ? "Não foi possível carregar" : "Produto não encontrado"}
              </h1>
              <p className="text-muted-foreground">
                {error ?? "Esse item não está disponível no catálogo atual."}
              </p>
            </div>
            <Button asChild className="mx-auto rounded-full">
              <Link to="/">Voltar ao catálogo</Link>
            </Button>
          </section>
        </main>
        <FeatureStrip />
      </>
    );
  }

  const hasDescription = Boolean(product.description?.trim());
  const weight =
    typeof product.weight === "number" && product.weight > 0
      ? product.weight
      : null;
  const price =
    typeof product.price === "number" && product.price > 0
      ? product.price
      : null;
  const categories = product.categories;

  return (
    <>
      <main className="mx-auto w-full max-w-[1360px] px-4 py-6 sm:px-7 sm:py-8">
        <Button
          asChild
          variant="ghost"
          className="mb-5 w-fit rounded-full px-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/">
            <ArrowLeft aria-hidden="true" />
            Voltar ao catálogo
          </Link>
        </Button>

        <section
          className="grid gap-7 lg:grid-cols-[58fr_42fr] lg:items-start"
          aria-labelledby="product-title"
        >
          <ProductImageGallery
            key={product.id}
            images={product.images}
            imageRecords={product.imageRecords}
            productName={product.name}
          />

          <div className="grid gap-6 rounded-[1.5rem] border bg-card/62 p-5 shadow-xl shadow-primary/8 backdrop-blur sm:p-7 lg:sticky lg:top-6">
            <div className="grid gap-4">
              <Badge
                variant="outline"
                className="w-fit rounded-full bg-background/45 px-3 py-1 font-extrabold uppercase"
              >
                <Heart
                  className="size-3.5 fill-primary/20"
                  aria-hidden="true"
                />
                Impressão 3D
              </Badge>

              <div className="grid gap-3">
                <h1
                  id="product-title"
                  className="font-display text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-[2.6rem]"
                >
                  {product.name}
                </h1>
                {price !== null && (
                  <strong className="text-3xl font-extrabold leading-none text-primary sm:text-[2.1rem]">
                    {formatCurrency(price)}
                  </strong>
                )}
              </div>
            </div>

            {hasDescription && (
              <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                {product.description}
              </p>
            )}

            {categories.length > 0 && (
              <div className="grid gap-2">
                <span className="flex items-center gap-2 text-sm font-extrabold text-muted-foreground">
                  <Tag className="size-4 text-primary" aria-hidden="true" />
                  Categorias
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category.slug}
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-sm font-extrabold"
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {weight !== null && (
              <div className="grid gap-2">
                <span className="text-sm font-extrabold text-muted-foreground">
                  Peso aproximado
                </span>
                <Badge
                  variant="secondary"
                  className="w-fit rounded-full px-3 py-1 text-sm font-extrabold"
                >
                  {weight} g
                </Badge>
              </div>
            )}

            <div className="grid gap-4 border-t pt-5">
              <p className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <PackageCheck
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                Produção sob encomenda
              </p>
              <Button asChild className="h-11 rounded-full text-base">
                <a href={contactUrl} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" />
                  Falar sobre este produto
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <FeatureStrip />
    </>
  );
}
