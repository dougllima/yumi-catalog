import { ProductImageCropFrame } from "@/components/ProductImageCropFrame";
import type { ProductImage } from "@/domain/product";
import { publicAssetUrl } from "@/utils/publicAssetUrl";

type ProductGalleryProps = {
  image?: ProductImage;
  images: string[];
  productName: string;
};

export function ProductGallery({
  image,
  images,
  productName,
}: ProductGalleryProps) {
  const firstImage = image?.url ?? images[0];

  if (!firstImage) {
    return null;
  }

  const imageUrl = publicAssetUrl(firstImage);

  return (
    <ProductImageCropFrame
      className="bg-muted"
      src={imageUrl}
      alt={`${productName} - imagem`}
      crop={image?.crop}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/18 via-transparent to-transparent" />
    </ProductImageCropFrame>
  );
}
