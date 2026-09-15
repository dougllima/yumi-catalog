alter table public.product_images
add column if not exists crop_x numeric(5, 2) not null default 50,
add column if not exists crop_y numeric(5, 2) not null default 50,
add column if not exists crop_zoom numeric(4, 2) not null default 1;

alter table public.product_images
drop constraint if exists product_images_crop_x_range,
add constraint product_images_crop_x_range check (
  crop_x >= 0 and crop_x <= 100
);

alter table public.product_images
drop constraint if exists product_images_crop_y_range,
add constraint product_images_crop_y_range check (
  crop_y >= 0 and crop_y <= 100
);

alter table public.product_images
drop constraint if exists product_images_crop_zoom_range,
add constraint product_images_crop_zoom_range check (
  crop_zoom >= 1 and crop_zoom <= 3
);
