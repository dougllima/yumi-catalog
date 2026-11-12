-- Imagem opcional por categoria. O arquivo fica no bucket `product-images`,
-- sob o prefixo `categories/`, e a URL pública é derivada pelo adapter de Storage.
alter table public.categories
add column if not exists image_path text;

alter table public.categories
drop constraint if exists categories_image_path_not_blank,
add constraint categories_image_path_not_blank check (
  image_path is null or length(trim(image_path)) > 0
);
