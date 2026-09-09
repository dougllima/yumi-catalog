import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { publicAssetUrl } from "@/utils/publicAssetUrl";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="grid aspect-square place-items-center rounded-[1.5rem] border bg-muted text-muted-foreground">
        Imagem indisponível
      </div>
    );
  }

  const activeImage = images[activeImageIndex] ?? images[0];

  if (!activeImage) {
    return (
      <div className="grid aspect-square place-items-center rounded-[1.5rem] border bg-muted text-muted-foreground">
        Imagem indisponível
      </div>
    );
  }

  const hasMultipleImages = images.length > 1;
  const activeImageUrl = publicAssetUrl(activeImage);

  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1
    );
  };

  return (
    <div className="grid gap-3">
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border bg-muted shadow-xl shadow-primary/8">
        <img
          src={activeImageUrl}
          alt={`${productName} - imagem ${activeImageIndex + 1}`}
          className="block size-full object-cover"
        />

        {hasMultipleImages && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-between p-3"
            aria-label={`Fotos de ${productName}`}
          >
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="pointer-events-auto rounded-full border border-background/70 bg-background/80 text-primary shadow-sm backdrop-blur-sm hover:bg-background"
              aria-label={`Ver foto anterior de ${productName}`}
              title="Foto anterior"
              onClick={showPreviousImage}
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="pointer-events-auto rounded-full border border-background/70 bg-background/80 text-primary shadow-sm backdrop-blur-sm hover:bg-background"
              aria-label={`Ver próxima foto de ${productName}`}
              title="Próxima foto"
              onClick={showNextImage}
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>

      {hasMultipleImages && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          aria-label="Selecionar imagem do produto"
        >
          {images.map((image, index) => (
            <Button
              type="button"
              key={image}
              variant="outline"
              aria-label={`Ver imagem ${index + 1} de ${productName}`}
              aria-pressed={index === activeImageIndex}
              className={cn(
                "size-18 shrink-0 overflow-hidden rounded-xl border-2 bg-card p-0 shadow-sm hover:bg-card",
                index === activeImageIndex
                  ? "border-primary ring-2 ring-ring/45"
                  : "border-border"
              )}
              onClick={() => setActiveImageIndex(index)}
            >
              <img
                src={publicAssetUrl(image)}
                alt=""
                className="block size-full object-cover"
                aria-hidden="true"
              />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
