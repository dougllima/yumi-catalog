import type { ProductImageCrop } from "@/domain/product";
import { normalizeProductImageCrop } from "@/domain/product";

export function visibleFractions(crop: ProductImageCrop, imageAspect: number) {
  return {
    width: 1 / (crop.zoom * Math.max(1, imageAspect)),
    height: 1 / (crop.zoom * Math.max(1, 1 / imageAspect)),
  };
}

export function cropWindow(crop: ProductImageCrop, imageAspect: number) {
  const { width, height } = visibleFractions(crop, imageAspect);
  return {
    x: (crop.xPercent / 100) * (1 - width),
    y: (crop.yPercent / 100) * (1 - height),
    width,
    height,
  };
}

export function dragCrop(
  crop: ProductImageCrop,
  deltaPx: { x: number; y: number },
  frameSizePx: number,
  imageAspect: number,
): ProductImageCrop {
  if (frameSizePx <= 0) return crop;

  const { width, height } = visibleFractions(crop, imageAspect);
  const moveAxis = (position: number, delta: number, visible: number) =>
    1 - visible < 1e-6
      ? position
      : position - (delta / frameSizePx) * (visible / (1 - visible)) * 100;

  return normalizeProductImageCrop({
    ...crop,
    xPercent: moveAxis(crop.xPercent, deltaPx.x, width),
    yPercent: moveAxis(crop.yPercent, deltaPx.y, height),
  });
}
