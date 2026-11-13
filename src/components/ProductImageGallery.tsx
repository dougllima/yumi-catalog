import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

import { ProductImageCropFrame } from "@/components/ProductImageCropFrame";
import { Button } from "@/components/ui/button";
import type { ProductImage } from "@/domain/product";
import { cn } from "@/lib/utils";
import { publicAssetUrl } from "@/utils/publicAssetUrl";

const SWIPE_THRESHOLD_PX = 40;

type ProductImageGalleryProps = {
  images: string[];
  imageRecords?: ProductImage[];
  productName: string;
};

export function ProductImageGallery({
  images,
  imageRecords,
  productName,
}: ProductImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [animateDrag, setAnimateDrag] = useState(false);
  const swipeStart = useRef<{
    pointerId: number;
    x: number;
    width: number;
  } | null>(null);
  const galleryImages: ProductImage[] =
    imageRecords && imageRecords.length > 0
      ? imageRecords
      : images.map((url, index) => ({
          id: url,
          url,
          sortOrder: index,
        }));

  if (galleryImages.length === 0) {
    return (
      <div className="grid aspect-square place-items-center rounded-item border bg-muted text-muted-foreground">
        Imagem indisponível
      </div>
    );
  }

  const activeImage = galleryImages[activeImageIndex] ?? galleryImages[0];

  if (!activeImage) {
    return (
      <div className="grid aspect-square place-items-center rounded-item border bg-muted text-muted-foreground">
        Imagem indisponível
      </div>
    );
  }

  const hasMultipleImages = galleryImages.length > 1;
  const activeImageUrl = publicAssetUrl(activeImage.url);
  const previousImage =
    galleryImages[
      activeImageIndex === 0 ? galleryImages.length - 1 : activeImageIndex - 1
    ];
  const nextImage =
    galleryImages[
      activeImageIndex === galleryImages.length - 1 ? 0 : activeImageIndex + 1
    ];

  const moveImage = (direction: -1 | 1) => {
    setActiveImageIndex((currentIndex) => {
      const total = galleryImages.length;
      return (currentIndex + direction + total) % total;
    });
  };

  const showPreviousImage = () => moveImage(-1);
  const showNextImage = () => moveImage(1);

  const settleDrag = () => {
    setAnimateDrag(true);
    setDragOffset(0);
  };

  return (
    <div className="grid gap-3">
      <div
        className="relative aspect-square touch-pan-y select-none overflow-hidden rounded-item border bg-muted shadow-xl shadow-primary/10"
        onPointerDown={(event) => {
          if (!hasMultipleImages || event.pointerType === "mouse") return;
          swipeStart.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            width: event.currentTarget.clientWidth,
          };
          setAnimateDrag(false);
        }}
        onPointerMove={(event) => {
          const start = swipeStart.current;
          if (!start || start.pointerId !== event.pointerId) return;

          const distance = event.clientX - start.x;
          setDragOffset(
            Math.max(-start.width, Math.min(start.width, distance)),
          );
        }}
        onPointerUp={(event) => {
          const start = swipeStart.current;
          swipeStart.current = null;
          if (!start || start.pointerId !== event.pointerId) return;

          const distance = event.clientX - start.x;
          if (Math.abs(distance) < SWIPE_THRESHOLD_PX) {
            settleDrag();
            return;
          }

          // Troca a imagem mantendo a posição visual do dedo, depois anima até 0.
          const direction = distance < 0 ? 1 : -1;
          const offsetAfterSwap =
            distance + (direction === 1 ? start.width : -start.width);
          setAnimateDrag(false);
          moveImage(direction);
          setDragOffset(offsetAfterSwap);
          requestAnimationFrame(() => requestAnimationFrame(settleDrag));
        }}
        onPointerCancel={() => {
          swipeStart.current = null;
          settleDrag();
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate3d(${dragOffset}px, 0, 0)`,
            transition: animateDrag ? "transform 220ms ease-out" : "none",
          }}
        >
          {hasMultipleImages && previousImage && (
            <ProductImageCropFrame
              className="absolute inset-0 aspect-auto self-stretch -translate-x-full"
              src={publicAssetUrl(previousImage.url)}
              alt=""
              crop={previousImage.crop}
            />
          )}
          <ProductImageCropFrame
            testId="product-image-gallery-active"
            className="absolute inset-0 aspect-auto self-stretch"
            src={activeImageUrl}
            alt={`${productName} - imagem ${activeImageIndex + 1}`}
            crop={activeImage.crop}
          />
          {hasMultipleImages && nextImage && (
            <ProductImageCropFrame
              className="absolute inset-0 aspect-auto self-stretch translate-x-full"
              src={publicAssetUrl(nextImage.url)}
              alt=""
              crop={nextImage.crop}
            />
          )}
        </div>

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
          {galleryImages.map((image, index) => (
            <Button
              type="button"
              key={image.id}
              variant="outline"
              aria-label={`Ver imagem ${index + 1} de ${productName}`}
              aria-pressed={index === activeImageIndex}
              className={cn(
                "size-18 shrink-0 overflow-hidden rounded-xl border-2 bg-card p-0 shadow-sm hover:bg-card",
                index === activeImageIndex
                  ? "border-primary ring-2 ring-ring/45"
                  : "border-border",
              )}
              onClick={() => setActiveImageIndex(index)}
            >
              <ProductImageCropFrame
                src={publicAssetUrl(image.url)}
                alt=""
                crop={image.crop}
              />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
