create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  weight_grams numeric(10, 2),
  price_cents integer,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_name_not_blank check (length(trim(name)) > 0),
  constraint products_weight_positive check (
    weight_grams is null or weight_grams > 0
  ),
  constraint products_price_non_negative check (
    price_cents is null or price_cents >= 0
  )
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  storage_path text not null unique,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint product_images_storage_path_not_blank check (
    length(trim(storage_path)) > 0
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;

revoke all on public.admin_users from anon, authenticated;
revoke all on public.products from anon, authenticated;
revoke all on public.product_images from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.product_images to anon, authenticated;
grant select on public.admin_users to authenticated;
grant insert, update, delete on public.products to authenticated;
grant insert, update, delete on public.product_images to authenticated;

drop policy if exists admin_users_can_read_own_membership on public.admin_users;
create policy admin_users_can_read_own_membership
on public.admin_users
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists products_public_can_read_active on public.products;
create policy products_public_can_read_active
on public.products
for select
to anon, authenticated
using (active = true or public.is_admin());

drop policy if exists products_admin_can_insert on public.products;
create policy products_admin_can_insert
on public.products
for insert
to authenticated
with check (public.is_admin());

drop policy if exists products_admin_can_update on public.products;
create policy products_admin_can_update
on public.products
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists products_admin_can_delete on public.products;
create policy products_admin_can_delete
on public.products
for delete
to authenticated
using (public.is_admin());

drop policy if exists product_images_public_can_read_active_products on public.product_images;
create policy product_images_public_can_read_active_products
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and (products.active = true or public.is_admin())
  )
);

drop policy if exists product_images_admin_can_insert on public.product_images;
create policy product_images_admin_can_insert
on public.product_images
for insert
to authenticated
with check (public.is_admin());

drop policy if exists product_images_admin_can_update on public.product_images;
create policy product_images_admin_can_update
on public.product_images
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists product_images_admin_can_delete on public.product_images;
create policy product_images_admin_can_delete
on public.product_images
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists product_images_storage_public_read on storage.objects;
create policy product_images_storage_public_read
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists product_images_storage_admin_insert on storage.objects;
create policy product_images_storage_admin_insert
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists product_images_storage_admin_update on storage.objects;
create policy product_images_storage_admin_update
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists product_images_storage_admin_delete on storage.objects;
create policy product_images_storage_admin_delete
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());
