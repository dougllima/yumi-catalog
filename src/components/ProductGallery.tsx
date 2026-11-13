import { ProductImageCropFrame } from "@/components/ProductImageCropFrame";
import type { ProductImage } from "@/domain/product";
import { publicAssetUrl } from "@/utils/publicAssetUrl";

type ProductGalleryProps = {
  image?: ProductImage;
  images: string[];
  productName: string;
  hoverImage?: ProductImage;
};

export function ProductGallery({
  image,
  images,
  productName,
  hoverImage,
}: ProductGalleryProps) {
  const firstImage = image?.url ?? images[0];

  if (!firstImage) {
    return null;
  }

  const imageUrl = publicAssetUrl(firstImage);
  const hoverImageUrl = hoverImage?.url ?? images[1];

  return (
    <ProductImageCropFrame
      className="bg-muted"
      src={imageUrl}
      alt={`${productName} - imagem`}
      crop={image?.crop}
    >
      {hoverImageUrl && (
        <ProductImageCropFrame
          data-testid="product-card-hover-image"
          className="absolute inset-0 aspect-auto self-stretch opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          src={publicAssetUrl(hoverImageUrl)}
          alt=""
          crop={hoverImage?.crop}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/18 via-transparent to-transparent" />
    </ProductImageCropFrame>
  );
}
