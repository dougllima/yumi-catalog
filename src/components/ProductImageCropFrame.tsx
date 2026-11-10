import type { ComponentProps } from "react";

import type { ProductImageCrop } from "@/domain/product";
import { cn } from "@/lib/utils";
import { productImageCropStyle } from "@/utils/productImageCropStyle";

type ProductImageCropFrameProps = ComponentProps<"div"> & {
  src: string;
  alt: string;
  crop?: ProductImageCrop;
  imgClassName?: string;
  testId?: string;
};

export function ProductImageCropFrame({
  src,
  alt,
  crop,
  className,
  imgClassName,
  testId,
  children,
  ...frameProps
}: ProductImageCropFrameProps) {
  return (
    <div
      {...frameProps}
      className={cn(
        "relative aspect-square w-full self-start overflow-hidden",
        className,
      )}
    >
      <img
        data-testid={testId}
        src={src}
        alt={alt}
        className={cn(
          "absolute inset-0 block size-full object-cover",
          imgClassName,
        )}
        style={productImageCropStyle(crop)}
      />
      {children}
    </div>
  );
}
