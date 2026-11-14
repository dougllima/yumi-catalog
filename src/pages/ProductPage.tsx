import {
  ArrowLeft,
  Heart,
  Leaf,
  PackageCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import type { MouseEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { PageContainer } from "@/components/PageContainer";
import { Panel } from "@/components/Panel";
import { ProductContactButton } from "@/components/ProductContactButton";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { RelatedProducts } from "@/components/RelatedProducts";
import { StatePanel } from "@/components/StatePanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProducts";
import { formatCurrency } from "@/utils/formatters";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id);
  const location = useLocation();
  const navigate = useNavigate();

  // "default" indica entrada direta na página (sem histórico interno): nesse
  // caso o link segue para a home; caso contrário volta à tela anterior.
  const handleBack = (event: MouseEvent<HTMLAnchorElement>) => {
    if (location.key === "default") {
      return;
    }

    event.preventDefault();
    navigate(-1);
  };

  if (loading) {
    return (
      <PageContainer centered>
        <StatePanel
          as="section"
          headingAs="h1"
          icon={Sparkles}
          title="Carregando produto"
          description="Só um instante enquanto buscamos as informações."
        />
      </PageContainer>
    );
  }

  if (!product || error) {
    return (
      <PageContainer centered>
        <StatePanel
          as="section"
          headingAs="h1"
          icon={Sparkles}
          title={error ? "Não foi possível carregar" : "Produto não encontrado"}
          description={
            error ?? "Esse item não está disponível no catálogo atual."
          }
        >
          <Button asChild className="mx-auto rounded-full">
            <Link to="/">Voltar ao catálogo</Link>
          </Button>
        </StatePanel>
      </PageContainer>
    );
  }

  const hasDescription = Boolean(product.description?.trim());
  const price =
    typeof product.price === "number" && product.price > 0
      ? product.price
      : null;
  const categories = product.categories;

  return (
    <PageContainer>
      <Button
        asChild
        variant="ghost"
        className="mb-5 w-fit rounded-full px-2 text-muted-foreground hover:text-foreground"
      >
        <Link to="/" onClick={handleBack}>
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

        <Panel className="grid gap-6 lg:sticky lg:top-6">
          <div className="grid gap-4">
            <Badge
              variant="outline"
              className="w-fit rounded-full bg-background/40 px-3 pb-1 pt-[0.4rem] font-extrabold uppercase"
            >
              <Heart className="size-3.5 fill-primary/20" aria-hidden="true" />
              Impressão 3D
            </Badge>

            <div className="grid gap-3">
              <h1
                id="product-title"
                className="font-display text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-[2.6rem]"
              >
                {product.name}
              </h1>
              <strong
                className={`font-extrabold leading-none text-primary ${
                  price !== null ? "text-3xl sm:text-[2.1rem]" : "text-xl"
                }`}
              >
                {price !== null ? formatCurrency(price) : "Sob encomenda"}
              </strong>
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
                    className="rounded-full px-3 pb-1 pt-[0.4rem] text-sm font-extrabold"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
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
            <Link
              to="/cuidados"
              className="flex w-fit items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:yumi-focus"
            >
              <Leaf className="size-4" aria-hidden="true" />
              Como cuidar da sua peça
            </Link>
            <ProductContactButton productName={product.name} />
          </div>
        </Panel>
      </section>

      <RelatedProducts product={product} />
    </PageContainer>
  );
}
