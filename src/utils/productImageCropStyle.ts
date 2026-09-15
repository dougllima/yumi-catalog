import type { CSSProperties } from "react";

import type { ProductImageCrop } from "@/domain/product";
import { normalizeProductImageCrop } from "@/domain/product";

export const productImageCropStyle = (
  crop?: Partial<ProductImageCrop> | null,
): CSSProperties => {
  const normalizedCrop = normalizeProductImageCrop(crop);
  const position = `${normalizedCrop.xPercent}% ${normalizedCrop.yPercent}%`;

  return {
    objectPosition: position,
    transform:
      normalizedCrop.zoom === 1 ? undefined : `scale(${normalizedCrop.zoom})`,
    transformOrigin: position,
  };
};
