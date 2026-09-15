begin;

insert into public.categories (name, slug)
values
  ('Casa', 'casa'),
  ('Chaveiros', 'chaveiros'),
  ('Decoração', 'decoracao'),
  ('Fotos', 'fotos'),
  ('Games', 'games'),
  ('Geek', 'geek'),
  ('Livros', 'livros'),
  ('Organização', 'organizacao'),
  ('Porta-copos', 'porta-copos')
on conflict (slug) do update
set name = excluded.name;

insert into public.products (
  id,
  name,
  description,
  price_cents,
  active,
  show_on_home,
  sort_order,
  created_at,
  updated_at
)
select
  'kit-monster',
  'Kit Monster',
  description,
  5000,
  true,
  show_on_home,
  sort_order,
  created_at,
  now()
from public.products
where id = 'kit-monster-v1'
on conflict (id) do update
set
  name = excluded.name,
  price_cents = excluded.price_cents,
  active = true,
  updated_at = now();

insert into public.products (
  id,
  name,
  price_cents,
  active,
  show_on_home,
  sort_order
)
values ('kit-monster', 'Kit Monster', 5000, true, false, 13)
on conflict (id) do update
set
  name = excluded.name,
  price_cents = excluded.price_cents,
  active = true,
  updated_at = now();

insert into public.product_categories (product_id, category_id)
select 'kit-monster', category_id
from public.product_categories
where product_id = 'kit-monster-v1'
on conflict do nothing;

update public.product_images
set
  product_id = 'kit-monster',
  alt_text = coalesce(alt_text, 'Kit Monster')
where product_id = 'kit-monster-v1';

delete from public.product_categories
where product_id = 'kit-monster-v1';

delete from public.products
where id = 'kit-monster-v1';

insert into public.products (
  id,
  name,
  description,
  price_cents,
  active,
  show_on_home,
  sort_order,
  created_at,
  updated_at
)
select
  'mini-prendedores',
  'Mini prendedores',
  null,
  null,
  true,
  show_on_home,
  sort_order,
  created_at,
  now()
from public.products
where id = 'kit-mini-prendedores-10'
on conflict (id) do update
set
  name = excluded.name,
  description = null,
  price_cents = null,
  active = true,
  updated_at = now();

insert into public.products (
  id,
  name,
  description,
  price_cents,
  active,
  show_on_home,
  sort_order
)
values ('mini-prendedores', 'Mini prendedores', null, null, true, false, 16)
on conflict (id) do update
set
  name = excluded.name,
  description = null,
  price_cents = null,
  active = true,
  updated_at = now();

insert into public.product_categories (product_id, category_id)
select 'mini-prendedores', category_id
from public.product_categories
where product_id = 'kit-mini-prendedores-10'
on conflict do nothing;

update public.product_images
set
  product_id = 'mini-prendedores',
  alt_text = coalesce(alt_text, 'Mini prendedores')
where product_id = 'kit-mini-prendedores-10';

delete from public.product_categories
where product_id = 'kit-mini-prendedores-10';

delete from public.products
where id = 'kit-mini-prendedores-10';

insert into public.products (
  id,
  name,
  description,
  price_cents,
  active,
  show_on_home,
  sort_order,
  created_at,
  updated_at
)
select
  'porta-copos-vaso-costela-de-adao',
  'Porta Copos - Vaso Costela de Adão',
  'Porta-copos em formato de vaso com folhas de costela de adão removíveis para uso individual.',
  12000,
  true,
  show_on_home,
  sort_order,
  created_at,
  now()
from public.products
where id = 'porta-copos-planta'
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  price_cents = excluded.price_cents,
  active = true,
  updated_at = now();

insert into public.products (
  id,
  name,
  description,
  price_cents,
  active,
  show_on_home,
  sort_order
)
values (
  'porta-copos-vaso-costela-de-adao',
  'Porta Copos - Vaso Costela de Adão',
  'Porta-copos em formato de vaso com folhas de costela de adão removíveis para uso individual.',
  12000,
  true,
  false,
  23
)
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description,
  price_cents = excluded.price_cents,
  active = true,
  updated_at = now();

insert into public.product_categories (product_id, category_id)
select 'porta-copos-vaso-costela-de-adao', category_id
from public.product_categories
where product_id = 'porta-copos-planta'
on conflict do nothing;

update public.product_images
set
  product_id = 'porta-copos-vaso-costela-de-adao',
  alt_text = coalesce(alt_text, 'Porta Copos - Vaso Costela de Adão')
where product_id = 'porta-copos-planta';

delete from public.product_categories
where product_id = 'porta-copos-planta';

delete from public.products
where id = 'porta-copos-planta';

with product_rows (
  id,
  name,
  description,
  price_cents,
  active,
  show_on_home,
  sort_order
) as (
  values
    ('abridor-monster', 'Abridor Monster', null, 400, true, false, 44),
    ('aparador-de-livro-l', 'Aparador de livro - L', null, 1000, true, false, 45),
    ('cabide-cintos', 'Cabide - Cintos', null, 1000, true, false, 46),
    ('caixa-polaroid', 'Caixa Polaroid', null, 5000, true, false, 47),
    ('caixinha-copa', 'Caixinha Copa', null, 4000, true, false, 48),
    ('caneca-monster', 'Caneca Monster', null, 5000, true, false, 49),
    ('chaveiro-kettlebell', 'Chaveiro Kettlebell', null, 1500, true, false, 50),
    ('chaveiro-yumi', 'Chaveiro Yumi', null, 1000, true, false, 51),
    ('jogo-equilibrio', 'Jogo de Equilíbrio', null, 10000, true, false, 12),
    ('mascara-silent-hill-f', 'Mascara Silent Hill F', null, 6000, true, false, 52),
    ('mecanismo-clicker', 'Mecanismo Clicker', null, 150, true, false, 53),
    ('mini-prendedores', 'Mini prendedores', null, null, true, false, 16),
    ('organizador-magic', 'Organizador Magic', null, 3500, true, false, 54),
    ('porta-escovas', 'Porta Escovas', null, 3000, true, false, 55),
    ('porta-polaroid-coracao', 'Porta Polaroid - Coração', null, null, true, false, 29),
    ('porta-retrato-musica', 'Porta Retrato Musica', null, 4000, true, false, 56),
    ('porta-retrato-simples', 'Porta Retrato Simples', null, 5000, true, false, 57),
    ('prensador-de-hamburguer', 'Prensador de Hamburguer', null, 2500, true, false, 58),
    ('suporte-de-bolo-boleira', 'Suporte de bolo - Boleira', null, 6000, true, false, 59),
    ('tampa-monster', 'Tampa Monster', null, 600, true, false, 60),
    ('treco-de-sacola', 'Treco de sacola', null, 1000, true, false, 61)
)
insert into public.products (
  id,
  name,
  description,
  price_cents,
  active,
  show_on_home,
  sort_order
)
select
  id,
  name,
  description,
  price_cents,
  active,
  show_on_home,
  sort_order
from product_rows
on conflict (id) do update
set
  name = excluded.name,
  description = coalesce(excluded.description, public.products.description),
  price_cents = excluded.price_cents,
  active = excluded.active,
  show_on_home = excluded.show_on_home,
  updated_at = now();

update public.products
set
  description = null,
  price_cents = null,
  active = true,
  show_on_home = false,
  updated_at = now()
where id in ('mini-prendedores', 'porta-polaroid-coracao');

update public.products
set
  active = false,
  show_on_home = false,
  updated_at = now()
where id in (
  'kit-porta-polaroid-coracao-5',
  'kit-porta-polaroid-coracao-10'
);

update public.product_images
set
  product_id = 'porta-polaroid-coracao',
  alt_text = coalesce(alt_text, 'Porta Polaroid - Coração')
where product_id in (
  'kit-porta-polaroid-coracao-5',
  'kit-porta-polaroid-coracao-10'
);

insert into public.product_categories (product_id, category_id)
select 'porta-polaroid-coracao', category_id
from public.product_categories
where product_id in (
  'kit-porta-polaroid-coracao-5',
  'kit-porta-polaroid-coracao-10'
)
on conflict do nothing;

with category_assignments (product_id, category_slug) as (
  values
    ('abridor-monster', 'geek'),
    ('abridor-monster', 'casa'),
    ('aparador-de-livro-l', 'livros'),
    ('cabide-cintos', 'casa'),
    ('cabide-cintos', 'organizacao'),
    ('caixa-polaroid', 'fotos'),
    ('caixa-polaroid', 'organizacao'),
    ('caixinha-copa', 'casa'),
    ('caixinha-copa', 'decoracao'),
    ('caneca-monster', 'geek'),
    ('caneca-monster', 'casa'),
    ('chaveiro-kettlebell', 'chaveiros'),
    ('chaveiro-yumi', 'chaveiros'),
    ('kit-monster', 'geek'),
    ('kit-monster', 'decoracao'),
    ('mascara-silent-hill-f', 'geek'),
    ('mascara-silent-hill-f', 'decoracao'),
    ('mini-prendedores', 'organizacao'),
    ('mini-prendedores', 'casa'),
    ('organizador-magic', 'games'),
    ('organizador-magic', 'organizacao'),
    ('porta-copos-vaso-costela-de-adao', 'porta-copos'),
    ('porta-copos-vaso-costela-de-adao', 'casa'),
    ('porta-escovas', 'casa'),
    ('porta-escovas', 'organizacao'),
    ('porta-polaroid-coracao', 'fotos'),
    ('porta-retrato-musica', 'fotos'),
    ('porta-retrato-musica', 'decoracao'),
    ('porta-retrato-simples', 'fotos'),
    ('porta-retrato-simples', 'decoracao'),
    ('prensador-de-hamburguer', 'casa'),
    ('suporte-de-bolo-boleira', 'casa'),
    ('tampa-monster', 'geek'),
    ('tampa-monster', 'casa'),
    ('treco-de-sacola', 'casa'),
    ('treco-de-sacola', 'organizacao')
)
insert into public.product_categories (product_id, category_id)
select category_assignments.product_id, categories.id
from category_assignments
join public.categories on categories.slug = category_assignments.category_slug
on conflict do nothing;

with image_rows (product_id, storage_path, alt_text, sort_order) as (
  values
    ('aparador-de-livro-dragao', 'aparador-de-livro-dragao/02.webp', 'Aparador de livro - Dragão', 2),
    ('mini-prendedores', 'mini-prendedores/01.webp', 'Mini prendedores', 0),
    ('porta-polaroid-coracao', 'porta-polaroid-coracao/kit-10-01.jpeg', 'Porta Polaroid - Coração', 1),
    ('porta-copos-costela-de-adao', 'porta-copos-costela-de-adao/02.jpeg', 'Porta Copos - Costela de Adão', 0),
    ('porta-copos-costela-de-adao', 'porta-copos-costela-de-adao/03.jpeg', 'Porta Copos - Costela de Adão', 1),
    ('porta-copos-vaso-costela-de-adao', 'porta-copos-vaso-costela-de-adao/01.jpeg', 'Porta Copos - Vaso Costela de Adão', 0),
    ('porta-copos-vaso-costela-de-adao', 'porta-copos-vaso-costela-de-adao/02.jpeg', 'Porta Copos - Vaso Costela de Adão', 1),
    ('porta-copos-vaso-costela-de-adao', 'porta-copos-vaso-costela-de-adao/03.jpeg', 'Porta Copos - Vaso Costela de Adão', 2),
    ('porta-copos-vaso-costela-de-adao', 'porta-copos-vaso-costela-de-adao/04.jpeg', 'Porta Copos - Vaso Costela de Adão', 3),
    ('porta-copos-vaso-costela-de-adao', 'porta-copos-vaso-costela-de-adao/05.jpeg', 'Porta Copos - Vaso Costela de Adão', 4),
    ('porta-copos-vaso-costela-de-adao', 'porta-copos-vaso-costela-de-adao/06.jpeg', 'Porta Copos - Vaso Costela de Adão', 5),
    ('porta-cotonete', 'porta-cotonete/01.jpeg', 'Porta Cotonete', 0),
    ('porta-cotonete', 'porta-cotonete/02.jpeg', 'Porta Cotonete', 1),
    ('porta-cotonete', 'porta-cotonete/03.jpeg', 'Porta Cotonete', 2),
    ('porta-cotonete', 'porta-cotonete/04.jpeg', 'Porta Cotonete', 3),
    ('porta-guardanapo-costela-de-adao', 'porta-guardanapo-costela-de-adao/01.jpeg', 'Porta Guardanapo - Costela de Adão', 0),
    ('porta-guardanapo-costela-de-adao', 'porta-guardanapo-costela-de-adao/02.jpeg', 'Porta Guardanapo - Costela de Adão', 1),
    ('porta-incenso-gato', 'porta-incenso-gato/01.jpeg', 'Porta Incenso Gato', 0),
    ('porta-incenso-gato', 'porta-incenso-gato/02.jpeg', 'Porta Incenso Gato', 1),
    ('porta-incenso-gato', 'porta-incenso-gato/03.jpeg', 'Porta Incenso Gato', 2),
    ('porta-incenso-gato', 'porta-incenso-gato/04.jpeg', 'Porta Incenso Gato', 3),
    ('porta-incenso-gato', 'porta-incenso-gato/05.jpeg', 'Porta Incenso Gato', 4),
    ('porta-joias', 'porta-joias/01.jpeg', 'Porta Jóias', 0),
    ('porta-joias', 'porta-joias/02.jpeg', 'Porta Jóias', 1),
    ('porta-joias', 'porta-joias/03.jpeg', 'Porta Jóias', 2),
    ('porta-joias', 'porta-joias/04.jpeg', 'Porta Jóias', 3),
    ('porta-maquiagem', 'porta-maquiagem/01.jpeg', 'Porta Maquiagem', 0),
    ('porta-maquiagem', 'porta-maquiagem/02.jpeg', 'Porta Maquiagem', 1),
    ('porta-maquiagem', 'porta-maquiagem/03.jpeg', 'Porta Maquiagem', 2),
    ('porta-maquiagem', 'porta-maquiagem/04.jpeg', 'Porta Maquiagem', 3),
    ('porta-maquiagem', 'porta-maquiagem/05.jpeg', 'Porta Maquiagem', 4),
    ('porta-maquiagem', 'porta-maquiagem/06.jpeg', 'Porta Maquiagem', 5),
    ('porta-maquiagem', 'porta-maquiagem/07.jpeg', 'Porta Maquiagem', 6),
    ('porta-remedios-umbrella', 'porta-remedios-umbrella/01.jpeg', 'Porta Remédios Umbrella', 0),
    ('porta-remedios-umbrella', 'porta-remedios-umbrella/02.jpeg', 'Porta Remédios Umbrella', 1),
    ('quadro-reforco-infantil', 'quadro-reforco-infantil/01.webp', 'Quadro Reforço Infantil', 0),
    ('suporte-controle-gengar', 'suporte-controle-gengar/01.jpeg', 'Suporte Controle Gengar', 0),
    ('suporte-controle-gengar', 'suporte-controle-gengar/02.jpeg', 'Suporte Controle Gengar', 1),
    ('suporte-controle-gengar', 'suporte-controle-gengar/03.jpeg', 'Suporte Controle Gengar', 2),
    ('suporte-de-chave-mario', 'suporte-de-chave-mario/01.jpeg', 'Suporte de chave - Mario', 0),
    ('suporte-de-chave-mario', 'suporte-de-chave-mario/02.jpeg', 'Suporte de chave - Mario', 1),
    ('suporte-de-chave-mario', 'suporte-de-chave-mario/03.jpeg', 'Suporte de chave - Mario', 2),
    ('suporte-livro-darth-vader', 'suporte-livro-darth-vader/01.jpeg', 'Suporte livro Darth Vader', 0),
    ('suporte-livro-darth-vader', 'suporte-livro-darth-vader/02.jpeg', 'Suporte livro Darth Vader', 1),
    ('suporte-livro-darth-vader', 'suporte-livro-darth-vader/03.jpeg', 'Suporte livro Darth Vader', 2),
    ('suporte-oculos-gatinho', 'suporte-oculos-gatinho/01.jpeg', 'Suporte de óculos - Gatinho', 0),
    ('suporte-oculos-gatinho', 'suporte-oculos-gatinho/02.jpeg', 'Suporte de óculos - Gatinho', 1),
    ('suporte-oculos-gatinho', 'suporte-oculos-gatinho/03.jpeg', 'Suporte de óculos - Gatinho', 2),
    ('suporte-para-3-controles', 'suporte-para-3-controles/01.jpeg', 'Suporte para 3 controles', 0),
    ('suporte-para-3-controles', 'suporte-para-3-controles/02.jpeg', 'Suporte para 3 controles', 1),
    ('suporte-para-3-controles', 'suporte-para-3-controles/03.jpeg', 'Suporte para 3 controles', 2),
    ('suporte-para-3-controles', 'suporte-para-3-controles/04.jpeg', 'Suporte para 3 controles', 3),
    ('tampa-caneca-chapeu-seletor', 'tampa-caneca-chapeu-seletor/01.jpeg', 'Tampa Caneca Chapéu Seletor', 0),
    ('trono-de-ferro', 'trono-de-ferro/01.jpeg', 'Trono de Ferro', 0),
    ('trono-de-ferro', 'trono-de-ferro/02.jpeg', 'Trono de Ferro', 1),
    ('trono-de-ferro', 'trono-de-ferro/03.jpeg', 'Trono de Ferro', 2),
    ('vaso', 'vaso/01.jpeg', 'Vaso', 0),
    ('vaso', 'vaso/02.jpeg', 'Vaso', 1)
)
insert into public.product_images (
  product_id,
  storage_path,
  alt_text,
  sort_order
)
select
  product_id,
  storage_path,
  alt_text,
  sort_order
from image_rows
on conflict (storage_path) do update
set
  product_id = excluded.product_id,
  alt_text = excluded.alt_text,
  sort_order = excluded.sort_order;

commit;
