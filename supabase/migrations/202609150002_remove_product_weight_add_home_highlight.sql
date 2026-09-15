alter table public.products
add column if not exists show_on_home boolean not null default false;

alter table public.products
drop constraint if exists products_weight_positive;

alter table public.products
drop column if exists weight_grams;
