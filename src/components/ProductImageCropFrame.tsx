import {
  type ComponentProps,
  type ReactEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

import type { ProductImageCrop } from "@/domain/product";
import { cn } from "@/lib/utils";
import { productImageCropStyle } from "@/utils/productImageCropStyle";

type ProductImageCropFrameProps = ComponentProps<"div"> & {
  src: string;
  alt: string;
  crop?: ProductImageCrop;
  imgClassName?: string;
  testId?: string;
  onImageLoad?: ReactEventHandler<HTMLImageElement>;
};

export function ProductImageCropFrame({
  src,
  alt,
  crop,
  className,
  imgClassName,
  testId,
  onImageLoad,
  children,
  ...frameProps
}: ProductImageCropFrameProps) {
  // Enquanto a imagem não carrega, mostra um bloco pulsante e esconde a
  // imagem (e seu alt), para não aparecer texto solto sobre tela vazia.
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const image = imageRef.current;
    setLoaded(Boolean(image?.complete && image.naturalWidth > 0));
  }, [src]);

  return (
    <div
      {...frameProps}
      className={cn(
        "relative aspect-square w-full self-start overflow-hidden",
        className,
      )}
    >
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-muted"
        />
      )}
      <img
        ref={imageRef}
        data-testid={testId}
        onLoad={(event) => {
          setLoaded(true);
          onImageLoad?.(event);
        }}
        // Erro também libera a imagem, para o estado de falha aparecer como antes.
        onError={() => setLoaded(true)}
        src={src}
        alt={alt}
        className={cn(
          "absolute inset-0 block size-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
        style={productImageCropStyle(crop)}
      />
      {children}
    </div>
  );
}
