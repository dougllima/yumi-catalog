import type {
  Dispatch,
  KeyboardEvent,
  PointerEvent,
  SetStateAction,
  SyntheticEvent,
} from "react";
import { useEffect, useRef, useState } from "react";

import { ProductImageCropFrame } from "@/components/ProductImageCropFrame";
import type { ProductImageCrop } from "@/domain/product";
import { normalizeProductImageCrop } from "@/domain/product";
import { dragCrop } from "@/utils/productImageCropGeometry";

const arrowDirections = new Map([
  ["ArrowLeft", { x: -1, y: 0 }],
  ["ArrowRight", { x: 1, y: 0 }],
  ["ArrowUp", { x: 0, y: -1 }],
  ["ArrowDown", { x: 0, y: 1 }],
]);

type AdminProductCropPreviewProps = {
  src: string;
  alt: string;
  crop: ProductImageCrop;
  setCrop: Dispatch<SetStateAction<ProductImageCrop>>;
};

export function AdminProductCropPreview({
  src,
  alt,
  crop,
  setCrop,
}: AdminProductCropPreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const [imageAspect, setImageAspect] = useState(0);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const zoomWithWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.deltaY === 0) return;

      event.preventDefault();
      setCrop((current) =>
        normalizeProductImageCrop({
          ...current,
          zoom: Number(
            (current.zoom - Math.sign(event.deltaY) * 0.05).toFixed(2),
          ),
        }),
      );
    };

    frame.addEventListener("wheel", zoomWithWheel, { passive: false });
    return () => frame.removeEventListener("wheel", zoomWithWheel);
  }, [setCrop]);

  const loadImage = ({ currentTarget }: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = currentTarget;
    if (naturalWidth && naturalHeight)
      setImageAspect(naturalWidth / naturalHeight);
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!imageAspect || event.button !== 0 || drag.current) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const previous = drag.current;
    if (!previous || previous.pointerId !== event.pointerId) return;

    const delta = {
      x: event.clientX - previous.x,
      y: event.clientY - previous.y,
    };
    const { width } = event.currentTarget.getBoundingClientRect();
    drag.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    setCrop((current) => dragCrop(current, delta, width, imageAspect));
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId === event.pointerId) drag.current = null;
  };

  const moveWithKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    const direction = arrowDirections.get(event.key);
    if (!direction) return;

    event.preventDefault();
    const step = event.shiftKey ? 5 : 1;
    setCrop((current) =>
      normalizeProductImageCrop({
        ...current,
        xPercent: current.xPercent + step * direction.x,
        yPercent: current.yPercent + step * direction.y,
      }),
    );
  };

  return (
    <ProductImageCropFrame
      ref={frameRef}
      testId="admin-product-crop-preview"
      src={src}
      alt={alt}
      crop={crop}
      className={`touch-none rounded-2xl bg-muted outline outline-border focus-visible:ring-2 focus-visible:ring-ring ${imageAspect ? "cursor-grab active:cursor-grabbing" : ""}`}
      imgClassName="pointer-events-none select-none"
      role="group"
      tabIndex={0}
      aria-label="Prévia do enquadramento"
      onImageLoad={loadImage}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onKeyDown={moveWithKeys}
    />
  );
}
