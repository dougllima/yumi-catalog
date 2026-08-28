type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="relative aspect-square overflow-hidden bg-muted">
      <img
        className="block size-full object-cover transition duration-500 group-hover:scale-[1.03]"
        src={images[0]}
        alt={`${productName} - imagem ${images[0]}`}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/18 via-transparent to-transparent" />
    </div>
  );
}
