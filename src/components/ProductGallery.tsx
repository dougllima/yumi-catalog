import { publicAssetUrl } from "@/utils/publicAssetUrl";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const firstImage = images[0];

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
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/18 via-transparent to-transparent" />
    </div>
  );
}
