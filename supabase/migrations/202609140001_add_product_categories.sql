create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_not_blank check (length(trim(name)) > 0),
  constraint categories_slug_not_blank check (length(trim(slug)) > 0),
  constraint categories_slug_format check (
    slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  )
);

create table if not exists public.product_categories (
  product_id text not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (product_id, category_id)
);

create index if not exists product_categories_category_id_idx
on public.product_categories (category_id);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.product_categories enable row level security;

revoke all on public.categories from anon, authenticated;
revoke all on public.product_categories from anon, authenticated;

grant select on public.categories to anon, authenticated;
grant select on public.product_categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant insert, update, delete on public.product_categories to authenticated;

drop policy if exists categories_public_can_read_active_product_categories on public.categories;
create policy categories_public_can_read_active_product_categories
on public.categories
for select
to anon, authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.product_categories
    join public.products on products.id = product_categories.product_id
    where product_categories.category_id = categories.id
      and products.active = true
  )
);

drop policy if exists categories_admin_can_insert on public.categories;
create policy categories_admin_can_insert
on public.categories
for insert
to authenticated
with check (public.is_admin());

drop policy if exists categories_admin_can_update on public.categories;
create policy categories_admin_can_update
on public.categories
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists categories_admin_can_delete on public.categories;
create policy categories_admin_can_delete
on public.categories
for delete
to authenticated
using (public.is_admin());

drop policy if exists product_categories_public_can_read_active_products on public.product_categories;
create policy product_categories_public_can_read_active_products
on public.product_categories
for select
to anon, authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.products
    where products.id = product_categories.product_id
      and products.active = true
  )
);

drop policy if exists product_categories_admin_can_insert on public.product_categories;
create policy product_categories_admin_can_insert
on public.product_categories
for insert
to authenticated
with check (public.is_admin());

drop policy if exists product_categories_admin_can_update on public.product_categories;
create policy product_categories_admin_can_update
on public.product_categories
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists product_categories_admin_can_delete on public.product_categories;
create policy product_categories_admin_can_delete
on public.product_categories
for delete
to authenticated
using (public.is_admin());

with category_values(name, slug) as (
  values
    ('Casa', 'casa'),
    ('Chaveiros', 'chaveiros'),
    ('Decoração', 'decoracao'),
    ('Figures', 'figures'),
    ('Fotos', 'fotos'),
    ('Games', 'games'),
    ('Geek', 'geek'),
    ('Infantil', 'infantil'),
    ('Livros', 'livros'),
    ('Organização', 'organizacao'),
    ('Pets', 'pets'),
    ('Porta-copos', 'porta-copos')
)
insert into public.categories (name, slug)
select name, slug
from category_values
on conflict (slug) do nothing;

with product_category_values(product_id, category_slug) as (
  values
    ('aparador-de-livro-dragao', 'livros'),
    ('aparador-de-livro-dragao', 'geek'),
    ('aparador-de-livro-dragao', 'decoracao'),
    ('caixa-de-dados-p', 'games'),
    ('caixa-de-dados-p', 'organizacao'),
    ('caixa-polaroid', 'fotos'),
    ('caixa-polaroid', 'organizacao'),
    ('chaveiro-calendario', 'chaveiros'),
    ('chaveiro-cartinha', 'chaveiros'),
    ('chaveiro-yumi', 'chaveiros'),
    ('enfeite-home-m', 'casa'),
    ('enfeite-home-m', 'decoracao'),
    ('figure-balrog', 'figures'),
    ('figure-balrog', 'geek'),
    ('figure-frieren', 'figures'),
    ('figure-frieren', 'geek'),
    ('figure-legolas-ogro', 'figures'),
    ('figure-legolas-ogro', 'geek'),
    ('fruta-one-piece', 'geek'),
    ('fruta-one-piece', 'decoracao'),
    ('jogo-equilibrio', 'games'),
    ('jogo-equilibrio', 'infantil'),
    ('kit-monster-v1', 'geek'),
    ('kit-monster-v1', 'decoracao'),
    ('kit-porta-copos-flor', 'casa'),
    ('kit-porta-copos-flor', 'porta-copos'),
    ('kit-mini-prendedores-10', 'organizacao'),
    ('kit-mini-prendedores-10', 'casa'),
    ('marca-pagina-gatinho', 'livros'),
    ('marca-pagina-gatinho', 'pets'),
    ('organizador-magic', 'games'),
    ('organizador-magic', 'organizacao'),
    ('porta-celular-stars', 'geek'),
    ('porta-celular-stars', 'organizacao'),
    ('porta-copo-gatinho-batman', 'porta-copos'),
    ('porta-copo-gatinho-batman', 'geek'),
    ('porta-copos-costela-de-adao', 'porta-copos'),
    ('porta-copos-costela-de-adao', 'casa'),
    ('porta-copos-planta', 'porta-copos'),
    ('porta-copos-planta', 'casa'),
    ('porta-cotonete', 'organizacao'),
    ('porta-cotonete', 'casa'),
    ('porta-guardanapo-costela-de-adao', 'casa'),
    ('porta-incenso-gato', 'casa'),
    ('porta-incenso-gato', 'pets'),
    ('porta-joias', 'organizacao'),
    ('porta-joias', 'casa'),
    ('porta-maquiagem', 'organizacao'),
    ('porta-maquiagem', 'casa'),
    ('kit-porta-polaroid-coracao-5', 'fotos'),
    ('kit-porta-polaroid-coracao-10', 'fotos'),
    ('porta-remedios-umbrella', 'organizacao'),
    ('porta-remedios-umbrella', 'geek'),
    ('separador-de-livro-dragao', 'livros'),
    ('separador-de-livro-dragao', 'geek'),
    ('suporte-para-2-controles', 'games'),
    ('suporte-para-2-controles', 'organizacao'),
    ('suporte-para-3-controles', 'games'),
    ('suporte-para-3-controles', 'organizacao'),
    ('suporte-controle-gengar', 'games'),
    ('suporte-controle-gengar', 'geek'),
    ('suporte-de-chave-mario', 'geek'),
    ('suporte-de-chave-mario', 'casa'),
    ('suporte-oculos-gatinho', 'organizacao'),
    ('suporte-oculos-gatinho', 'pets'),
    ('suporte-livro-darth-vader', 'livros'),
    ('suporte-livro-darth-vader', 'geek'),
    ('tampa-caneca-chapeu-seletor', 'geek'),
    ('tampa-caneca-chapeu-seletor', 'casa'),
    ('trono-de-ferro', 'geek'),
    ('trono-de-ferro', 'decoracao'),
    ('vaso', 'casa'),
    ('vaso', 'decoracao'),
    ('caixa-uno', 'games'),
    ('caixa-uno', 'organizacao'),
    ('quadro-reforco-infantil', 'infantil')
)
insert into public.product_categories (product_id, category_id)
select product_category_values.product_id, categories.id
from product_category_values
join public.categories on categories.slug = product_category_values.category_slug
join public.products on products.id = product_category_values.product_id
on conflict (product_id, category_id) do nothing;
