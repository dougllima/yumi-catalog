import { ChevronLeft, ChevronRight, Shapes } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { ProductImageCropFrame } from "@/components/ProductImageCropFrame";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { categoryShowcaseFrom, type Product } from "@/domain/product";
import { publicAssetUrl } from "@/utils/publicAssetUrl";

export function CategoryShortcuts({ products }: { products: Product[] }) {
  const categories = categoryShowcaseFrom(products);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    setCanScrollPrevious(track.scrollLeft > 4);
    setCanScrollNext(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);

    return () => window.removeEventListener("resize", updateScrollState);
  }, [categories.length, updateScrollState]);

  if (categories.length === 0) {
    return null;
  }

  const scrollByPage = (direction: -1 | 1) => {
    const track = trackRef.current;

    track?.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  return (
    <section className="grid gap-4 pt-8" aria-labelledby="categories-title">
      <SectionHeader
        titleId="categories-title"
        title="Explore por categoria"
        action={
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scrollByPage(-1)}
              disabled={!canScrollPrevious}
              aria-label="Categorias anteriores"
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scrollByPage(1)}
              disabled={!canScrollNext}
              aria-label="Próximas categorias"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        }
      />

      <div
        ref={trackRef}
        onScroll={updateScrollState}
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {categories.map(({ slug, name, imageUrl, crop }) => (
          <Link
            key={slug}
            to={`/produtos?categoria=${encodeURIComponent(slug)}`}
            className="group relative block w-[42%] shrink-0 snap-start overflow-hidden rounded-[1.25rem] border bg-card shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 sm:w-[30%] md:w-[22%] lg:w-[16%]"
          >
            {imageUrl ? (
              <ProductImageCropFrame
                className="bg-muted"
                src={publicAssetUrl(imageUrl)}
                alt=""
                crop={crop}
              />
            ) : (
              <div className="grid aspect-square place-items-center bg-accent text-primary">
                <Shapes className="size-8" aria-hidden="true" />
              </div>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8 font-display text-base font-semibold leading-tight text-white">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
