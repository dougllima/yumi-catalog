import type { ProductImage } from "@/domain/product";
import { productImageCropStyle } from "@/utils/productImageCropStyle";
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
    <div className="relative aspect-square overflow-hidden bg-muted">
      <img
        className="block size-full object-cover transition duration-500 group-hover:scale-[1.03]"
        src={imageUrl}
        alt={`${productName} - imagem`}
        style={productImageCropStyle(image?.crop)}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/18 via-transparent to-transparent" />
    </div>
  );
}
