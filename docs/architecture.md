# Yumi Studio - arquitetura persistente inicial

## Decisão de provedor

A primeira versão persistente usa Supabase para banco, autenticação e storage.

Motivos:

- funciona direto em uma SPA React/Vite, sem backend Node próprio;
- oferece Postgres, Auth e Storage no plano gratuito;
- permite proteger leitura/escrita com RLS e policies;
- concentra troca futura de fornecedor nos adapters em `src/infrastructure`.

Limites gratuitos relevantes verificados em setembro de 2026:

- 500 MB de banco;
- 50.000 usuários ativos mensais de Auth;
- 1 GB de Storage;
- 5 GB de egress;
- projetos Free podem pausar após 1 semana de inatividade.

Firebase foi considerado, mas Cloud Storage atualmente não deve ser assumido
como gratuito sem avaliar o plano Blaze/quotas do projeto. Para o volume atual
da Yumi Studio, Supabase cobre banco + Auth + imagens com menos peças.

## Fronteira de infraestrutura

```text
React UI / pages / hooks
   |
   v
ProductRepository   AuthService   MediaStorage
   |
   v
src/infrastructure/supabase/*
```

Componentes e páginas não importam o client Supabase. Eles usam hooks e os
serviços compostos em `src/application/dependencies.ts`.

Existe fallback estático para desenvolvimento sem `.env`, usando
`src/data/products.ts`. Em produção persistente, configure:

```env
VITE_DATA_PROVIDER=supabase
```

## Modelo de dados

### `products`

Cadastro principal dos produtos.

- `id`: slug textual estável;
- `name`: nome exibido;
- `description`: descrição opcional;
- `weight_grams`: peso primário informado pelo usuário;
- `price_cents`: preço em centavos;
- `active`: controla visibilidade pública;
- `sort_order`: ordenação simples;
- `created_at` e `updated_at`.

Valores financeiros são persistidos como centavos inteiros para evitar erro de
ponto flutuante. A UI continua exibindo em reais.

### `product_images`

Metadados das imagens de produto.

- `product_id`: produto dono da imagem;
- `storage_path`: caminho do arquivo no bucket;
- `alt_text`: texto alternativo;
- `sort_order`: ordem da galeria.

As URLs públicas são derivadas pelo adapter de storage, não persistidas como
dado de domínio.

### `admin_users`

Lista explícita de usuários autorizados a administrar produtos. Não há cadastro
público. As contas são criadas manualmente no Supabase Auth e depois liberadas
nesta tabela.

## Segurança

A migration `supabase/migrations/202609080001_init_products_admin.sql` habilita
RLS nas tabelas públicas.

Regras principais:

- público (`anon`) lê apenas produtos `active = true` e suas imagens;
- usuários autenticados não administradores também só leem produtos ativos;
- somente usuários presentes em `admin_users` podem criar, editar, excluir e
gerenciar imagens;
- o bucket `product-images` é público para leitura;
- uploads, updates e deletes no bucket exigem usuário autenticado e admin.

No painel do Supabase, desative signup público em Authentication para manter
criação de contas manual.

## Configuração local

1. Crie um projeto Supabase.
2. Aplique a migration SQL em `supabase/migrations/202609080001_init_products_admin.sql`.
3. Em Authentication, crie manualmente o usuário administrador.
4. Libere o usuário como admin:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'admin@yumi.example';
```

5. Copie `.env.example` para `.env.local` e preencha:

```env
VITE_DATA_PROVIDER=supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PRODUCT_IMAGES_BUCKET=product-images
```

Somente variáveis `VITE_*` vão para o navegador. A service role key é apenas
para scripts locais.

6. Instale e rode:

```bash
npm install
npm run dev
```

## Migração dos produtos atuais

Depois de aplicar a migration e preencher `.env.local`, execute:

```bash
npm run seed:products
```

O script:

- importa `src/data/products.ts`;
- faz upsert dos produtos por `id`;
- converte `price` em reais para `price_cents`;
- envia as imagens locais de `public/products` ao bucket `product-images`;
- registra imagens por `storage_path`, evitando duplicação em reexecuções.

Ele não apaga produtos ou imagens que existam no Supabase e não estejam mais no
arquivo estático. Isso evita perda acidental; limpezas podem ser feitas depois
pelo admin.

## Deploy

O app continua sendo uma SPA Vite. Pode ser hospedado como arquivos estáticos
em qualquer provedor.

No ambiente de deploy, configure apenas:

```env
VITE_DATA_PROVIDER=supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Não configure `SUPABASE_SERVICE_ROLE_KEY` no frontend hospedado.

`VITE_SUPABASE_ANON_KEY` ainda é aceito pelo código como compatibilidade com
projetos/documentações antigas, mas a variável preferida é
`VITE_SUPABASE_PUBLISHABLE_KEY`.

## Próximas evoluções naturais

- separar produtos por categoria;
- cadastrar materiais e custos primários;
- calcular custo/lucro/margem sem persistir derivados;
- melhorar compressão/resize de imagens no cliente;
- adicionar busca e filtros avançados no catálogo.
