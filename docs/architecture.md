# Arquitetura — Yumi Studio

## Propósito

Este documento registra a arquitetura e as decisões técnicas consolidadas do projeto.

Ele deve representar o estado técnico atual e as decisões vigentes, não funcionar como histórico de discussão.

O repositório é a fonte de verdade. Antes de alterar arquitetura, schema ou integrations:

1. inspecione o código atual;
2. verifique as migrations existentes;
3. confirme configurações externas relevantes quando elas não puderem ser inferidas pelo repositório;
4. atualize este documento quando uma decisão técnica relevante mudar.

Não documente arquitetura especulativa como se já estivesse implementada.

> **Status desta consolidação:** auditado contra o repositório em 2026-09-14.
> Este documento descreve o estado técnico versionado conhecido. Configurações
> externas de Supabase e GitHub são registradas como expectativas operacionais
> quando não puderem ser comprovadas pelo repositório.

---

## Estado atual implementado

O projeto começou como um catálogo público temporário com frontend React/Vite e produtos definidos localmente.

A primeira estrutura persistente foi criada para utilizar Supabase e manter compatibilidade com o catálogo estático durante a transição.

O estado implementado e versionado inclui:

- SPA React/Vite;
- Supabase como provider de banco, Auth e Storage;
- abstrações internas para evitar dependência direta do provider na UI;
- persistência de produtos e imagens;
- persistência de categorias e associações produto-categoria;
- autenticação administrativa;
- autorização via RLS/policies;
- seed dos produtos estáticos existentes;
- fallback estático para desenvolvimento sem configuração Supabase;
- deploy via GitHub Pages.
- Vitest com Testing Library para testes de domínio, hooks, componentes e fluxos
  críticos;
- ESLint, Prettier, Husky e lint-staged como ferramentas de padronização local.

Configurações que vivem fora do repositório, como opções no Dashboard do Supabase ou GitHub, não devem ser assumidas como confirmadas somente porque estão documentadas aqui.

---

## Frontend

Stack documentada:

- React;
- TypeScript;
- Vite;
- Tailwind CSS;
- shadcn/ui.

A aplicação permanece uma SPA hospedável como arquivos estáticos.

Não introduzir SSR ou backend Node próprio sem necessidade concreta.

Preservar stack, padrões e comportamento existentes salvo motivo técnico ou funcional explícito para mudança.

---

## Estrutura real do repositório

Estrutura versionada relevante no checkpoint atual:

```text
src/
  application/
    contracts.ts
    dependencies.ts
  components/
    ui/
    *.tsx
    *.tests.tsx
  config/
  data/
    products.ts
  domain/
    product.ts
    product.tests.ts
  hooks/
    *.ts
    *.tests.tsx
  infrastructure/
    staticAuthService.ts
    staticMediaStorage.ts
    staticProductRepository.ts
    supabase/
      authService.ts
      client.ts
      mediaStorage.ts
      productMapper.ts
      productMapper.tests.ts
      productRepository.ts
  pages/
    admin/
    *.tsx
  test/
    setup.ts
  App.tsx
  main.tsx
supabase/
  migrations/
scripts/
  seed-products.ts
public/
  brand/yumi-logo.png
```

O repositório atualmente não contém arquivos em `public/products/`. A decisão
vigente é usar Supabase Storage como fonte oficial das imagens de produto. A
fonte estática `src/data/products.ts` ainda referencia caminhos sob
`/products/...` como legado/fallback local; esses caminhos não devem ser
tratados como fonte oficial para produção persistente.

Scripts npm versionados:

```text
npm run dev
npm run build
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run check
npm run test
npm run test:coverage
npm run lint-staged
npm run prepare
npm run preview
npm run seed:products
```

`npm run check` executa, em sequência:

```text
npm run format:check
npm run lint
npm test
npm run build
```

---

## Provider atual

### Supabase

A primeira versão persistente utiliza Supabase para:

- banco Postgres;
- autenticação;
- Storage de imagens;
- autorização via RLS e policies.

A escolha permite atender a SPA sem backend Node próprio e concentrar dependências específicas de infraestrutura em adapters.

O Supabase é detalhe de infraestrutura.

Uma futura troca de provider pode exigir:

- novas migrations;
- transformação e migração de dados;
- migração de arquivos;
- novas regras de autorização;
- alterações de configuração.

Ela não deve exigir reescrever páginas, componentes ou regras de negócio.

### Custo

Na adoção inicial, o plano gratuito do Supabase foi considerado suficiente para o volume atual da Yumi Studio.

Limites de free tier são dados externos e podem mudar. Não tratá-los como contrato arquitetural permanente.

Antes de habilitar recursos que possam gerar cobrança ou tomar decisões baseadas em quota, verificar os limites atuais do provider.

---

## Fronteira de infraestrutura

A UI e a lógica de negócio não devem importar diretamente o client do Supabase.

A estrutura documentada segue:

```text
React UI / pages / hooks
        |
        v
ProductRepository   AuthService   MediaStorage
        |
        v
src/application/dependencies.ts
        |
        v
src/infrastructure/supabase/*
        |
        v
Supabase
```

Os componentes utilizam hooks e serviços compostos pela aplicação.

Dependências específicas do Supabase ficam concentradas na infraestrutura e no ponto de composição.

Contracts reais em `src/application/contracts.ts`:

- `ProductRepository`;
- `AuthService`;
- `MediaStorage`;
- `AdminSession`;
- `UploadedMedia`;
- `AuthStateUnsubscribe`.

Composição real em `src/application/dependencies.ts`:

- `mediaStorage`;
- `productRepository`;
- `authService`;
- `runtimeBackend`.

Adapters Supabase reais:

- `SupabaseProductRepository`;
- `SupabaseAuthService`;
- `SupabaseMediaStorage`;
- `getSupabaseClient`;
- `isSupabaseConfigured`.

Fallbacks estáticos reais:

- `StaticProductRepository`;
- `StaticAuthService`;
- `StaticMediaStorage`.

O `ProductRepository` concentra as operações atuais de catálogo, incluindo:

- listagem pública e administrativa de produtos;
- leitura por identificador;
- criação, edição e exclusão de produtos;
- inclusão, remoção e ordenação de imagens;
- listagem de categorias existentes;
- substituição das categorias associadas a um produto.

Não transformar essa separação em Clean Architecture cerimonial.

Não introduzir sem necessidade concreta:

- `CommandBus`;
- `QueryBus`;
- `UnitOfWork`;
- repositories genéricos;
- interfaces para cada use case;
- framework de dependency injection.

Prefira composição explícita e simples.

---

## Seleção do provider de dados

Existe suporte documentado a provider configurável por ambiente.

O valor lido é:

```env
VITE_DATA_PROVIDER
```

Comportamento real:

- valor ausente: usa `"auto"`;
- `"auto"`: usa Supabase quando `VITE_SUPABASE_URL` e
  `VITE_SUPABASE_PUBLISHABLE_KEY` ou `VITE_SUPABASE_ANON_KEY` existem; caso
  contrário usa fallback estático;
- `"supabase"`: força Supabase e exige as variáveis de ambiente do frontend;
- `"static"`: usa fallback estático.

Sem a configuração necessária em modo `"auto"`, existe fallback estático utilizando:

```text
src/data/products.ts
```

Esse fallback serve ao desenvolvimento e à transição.

Ele não deve se tornar uma segunda fonte de verdade permanente para produção depois que a persistência estiver estabilizada.

No fallback estático:

- `listPublished`, `listAll` e `getById` leem `src/data/products.ts`;
- produtos estáticos incluem categorias derivadas do mapa
  `productCategoryNames`;
- `listCategories` deduplica e ordena as categorias presentes no fallback;
- produtos inativos são filtrados do catálogo público;
- operações de escrita em produtos lançam erro de configuração;
- alteração de categorias de produto lança erro de configuração;
- login administrativo retorna erro de configuração;
- upload/remoção de imagens retorna erro de configuração.

---

## Modelo de dados atual implementado

### `products`

Cadastro principal dos produtos.

Campos documentados:

- `id`: slug textual estável;
- `name`: nome exibido;
- `description`: descrição opcional;
- `weight_grams`: peso informado pelo usuário;
- `price_cents`: preço em centavos;
- `active`: controla visibilidade pública;
- `sort_order`: ordenação simples;
- `created_at`;
- `updated_at`.

Valores financeiros são persistidos em centavos inteiros para evitar problemas de floating point.

A UI continua apresentando valores em Real brasileiro.

Schema versionado em `202609080001_init_products_admin.sql`:

```text
id text primary key
name text not null
description text
weight_grams numeric(10, 2)
price_cents integer
active boolean not null default true
sort_order integer not null default 0
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

Constraints versionadas:

- `products_name_not_blank`: `length(trim(name)) > 0`;
- `products_weight_positive`: `weight_grams is null or weight_grams > 0`;
- `products_price_non_negative`: `price_cents is null or price_cents >= 0`.

Trigger versionado:

- `products_set_updated_at`, executado antes de `update`, chama
  `public.set_updated_at()`.

### `product_images`

Metadados das imagens associadas aos produtos.

Campos documentados:

- `product_id`: produto dono da imagem;
- `storage_path`: caminho do arquivo no bucket;
- `alt_text`: texto alternativo;
- `sort_order`: ordem da galeria.

URLs públicas são derivadas pelo adapter de Storage e não persistidas como dado de domínio.

A imagem principal pode ser determinada pela ordenação enquanto não houver necessidade concreta de um campo dedicado.

Schema versionado em `202609080001_init_products_admin.sql`:

```text
id uuid primary key default gen_random_uuid()
product_id text not null references public.products(id) on delete cascade
storage_path text not null unique
alt_text text
sort_order integer not null default 0
created_at timestamptz not null default now()
```

Constraint versionada:

- `product_images_storage_path_not_blank`:
  `length(trim(storage_path)) > 0`.

### `categories`

Cadastro leve das categorias reutilizáveis de produto.

Campos documentados:

- `id`: UUID gerado no banco;
- `name`: nome exibido na UI;
- `slug`: chave normalizada e única;
- `created_at`;
- `updated_at`.

O slug é gerado pela aplicação a partir do nome, removendo acentos, normalizando
caixa e substituindo separadores por hífen. Exemplos como `Decoração`,
`decoração` e `decoracao` devem resolver para o mesmo slug `decoracao`.

Schema versionado em `202609140001_add_product_categories.sql`:

```text
id uuid primary key default gen_random_uuid()
name text not null
slug text not null unique
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

Constraints versionadas:

- `categories_name_not_blank`: `length(trim(name)) > 0`;
- `categories_slug_not_blank`: `length(trim(slug)) > 0`;
- `categories_slug_format`: slug em letras minúsculas, números e hífens.

Trigger versionado:

- `categories_set_updated_at`, executado antes de `update`, chama
  `public.set_updated_at()`.

### `product_categories`

Associação many-to-many entre produtos e categorias.

Campos documentados:

- `product_id`: produto associado;
- `category_id`: categoria associada;
- `created_at`.

Schema versionado em `202609140001_add_product_categories.sql`:

```text
product_id text not null references public.products(id) on delete cascade
category_id uuid not null references public.categories(id) on delete cascade
created_at timestamptz not null default now()
primary key (product_id, category_id)
```

Índice versionado:

- `product_categories_category_id_idx` em `category_id`.

### `admin_users`

Lista explícita de usuários autorizados a administrar o sistema.

Não existe cadastro público de administradores.

As contas são criadas no Supabase Auth e posteriormente autorizadas pela tabela `admin_users`.

Schema versionado em `202609080001_init_products_admin.sql`:

```text
user_id uuid primary key references auth.users(id) on delete cascade
created_at timestamptz not null default now()
```

### Tipos de domínio no frontend

Tipos reais em `src/domain/product.ts`:

- `ProductImage`: `id`, `url`, `storagePath?`, `altText?`, `sortOrder`;
- `Product`: `id`, `name`, `description?`, `weight?`, `price?`, `images`,
  `imageRecords?`, `categories`, `isActive`, `sortOrder?`, `createdAt?`,
  `updatedAt?`;
- `ProductInput`: `id?`, `name`, `description?`, `weight?`, `priceInCents?`,
  `isActive`, `sortOrder?`;
- `ProductImageInput`: `storagePath`, `altText?`, `sortOrder`.
- `ProductCategory`: `id`, `name`, `slug`;

Conversões reais:

- `reaisToCents`;
- `centsToReais`;
- `normalizeSearch`;
- `normalizeCategoryName`;
- `categorySlug`;
- `createProductCategory`;
- `dedupeCategoryNames`;
- `onlyActiveProducts`.

---

## Requisitos funcionais ainda não refletidos no modelo implementado

O contexto funcional possui o conceito de produto que **requer revisão** quando alterações em dados compartilhados impactarem sua precificação.

Esse conceito ainda não aparece no modelo persistente documentado acima.

Não assumir uma implementação técnica específica antes de verificar o código atual.

Quando essa feature for implementada, documentar aqui:

- representação persistente adotada;
- eventos que ativam a flag;
- forma de conclusão da revisão;
- impacto em queries e listagens administrativas.

---

## Banco e migrations

O Git é a fonte de verdade para evolução do schema.

Migrations ficam em:

```text
supabase/migrations/
```

As migrations versionadas atuais são:

```text
supabase/migrations/202609080001_init_products_admin.sql
supabase/migrations/202609080002_seed_products_from_static_data.sql
supabase/migrations/202609140001_add_product_categories.sql
```

A migration `202609080001_init_products_admin.sql` estabelece:

- extensão `pgcrypto`;
- tabelas `public.admin_users`, `public.products` e
  `public.product_images`;
- primary keys e foreign keys descritas no modelo de dados;
- unique constraint em `product_images.storage_path`;
- constraints de nome não vazio, peso positivo, preço não negativo e storage
  path não vazio;
- função `public.set_updated_at()`;
- trigger `products_set_updated_at`;
- função `public.is_admin()`;
- RLS habilitado em `admin_users`, `products` e `product_images`;
- revokes de permissões amplas para `anon` e `authenticated`;
- grants mínimos para leitura pública/autenticada e escrita autenticada
  protegida por policies;
- bucket `storage.buckets` chamado `product-images`, público, com limite de
  5 MB e MIME types `image/jpeg`, `image/png` e `image/webp`;
- policies em `storage.objects` para leitura pública e escrita/alteração/remoção
  apenas por administradores.

Policies versionadas:

- `admin_users_can_read_own_membership`;
- `products_public_can_read_active`;
- `products_admin_can_insert`;
- `products_admin_can_update`;
- `products_admin_can_delete`;
- `product_images_public_can_read_active_products`;
- `product_images_admin_can_insert`;
- `product_images_admin_can_update`;
- `product_images_admin_can_delete`;
- `product_images_storage_public_read`;
- `product_images_storage_admin_insert`;
- `product_images_storage_admin_update`;
- `product_images_storage_admin_delete`.

A migration `202609080002_seed_products_from_static_data.sql` faz upsert de
produtos em `public.products`. Ela não registra metadados em `product_images` e
não envia arquivos ao Storage.

A migration `202609140001_add_product_categories.sql` estabelece:

- tabelas `public.categories` e `public.product_categories`;
- primary keys, foreign keys e unique constraint descritas no modelo de dados;
- índice `product_categories_category_id_idx`;
- constraints de nome, slug obrigatório e formato do slug;
- trigger `categories_set_updated_at`;
- RLS habilitado em `categories` e `product_categories`;
- grants mínimos para leitura pública/autenticada e escrita autenticada
  protegida por policies;
- seed inicial das categorias e associações equivalentes ao fallback estático.

Policies versionadas para categorias:

- `categories_public_can_read_active_product_categories`;
- `categories_admin_can_insert`;
- `categories_admin_can_update`;
- `categories_admin_can_delete`;
- `product_categories_public_can_read_active_products`;
- `product_categories_admin_can_insert`;
- `product_categories_admin_can_update`;
- `product_categories_admin_can_delete`.

Índices explícitos versionados:

- `product_categories_category_id_idx`.

Quando aplicável, alterações futuras devem versionar por migration:

- tabelas;
- índices;
- constraints;
- RLS;
- policies;
- funções;
- triggers.

Evitar alterações manuais no schema de produção quando uma migration for apropriada.

---

## Integração Supabase + GitHub

A configuração pretendida/documentada para integração com o repositório é:

- working directory na raiz do repositório;
- branch de produção `main`;
- migrations em `supabase/migrations/`.

Como parte dessa configuração vive fora do código, confirme no Supabase/GitHub antes de depender do deploy automático de migrations.

O campo de working directory deve apontar para o diretório que contém a pasta `supabase/`, e não para `supabase/migrations/`.

---

## Segurança

Segurança não pode depender apenas da UI.

RLS e policies fazem parte da arquitetura de segurança e devem ser tratadas como código.

### Público (`anon`)

Pode:

- consultar apenas produtos com `active = true`;
- consultar metadados/imagens necessárias desses produtos;
- consultar categorias associadas a produtos ativos;
- acessar arquivos públicos necessários ao catálogo.

Não pode:

- criar produtos;
- criar categorias;
- editar produtos;
- editar categorias;
- excluir produtos;
- excluir categorias;
- realizar upload;
- alterar ou remover mídia;
- executar operações administrativas.

### Usuário autenticado não administrador

Continua limitado às permissões públicas.

Autenticação, por si só, não concede permissão administrativa.

### Administrador

Somente usuários autorizados em `admin_users` podem executar operações administrativas permitidas pelas policies.

Administradores podem listar todas as categorias existentes, inclusive categorias
associadas apenas a produtos inativos, para evitar recadastro desnecessário no
formulário de produto.

### Storage

O bucket documentado é:

```text
product-images
```

A leitura pública é permitida para suportar o catálogo.

Upload, update e delete exigem usuário autenticado e autorizado como administrador.

A fonte oficial das imagens de produto é o Supabase Storage. Arquivos locais em
`public/products/`, quando existirem, devem ser tratados apenas como origem
transitória para importação ou fallback local.

### Service role

Nunca utilizar `SUPABASE_SERVICE_ROLE_KEY` no frontend.

Ela é permitida apenas em scripts executados em ambiente confiável.

---

## Autenticação administrativa

Não deve existir signup público de administradores.

As contas são provisionadas de forma controlada no Supabase Auth e autorizadas em `admin_users`.

A aplicação deve tratar:

- login;
- logout;
- sessão persistida;
- sessão inválida ou expirada;
- proteção de rotas administrativas.

A proteção de rota no frontend não substitui RLS/policies.

Enquanto esse modelo for mantido, o signup público deve permanecer desabilitado no Supabase.

Como essa configuração vive no provider, ela precisa ser confirmada operacionalmente e não pode ser inferida apenas pelo repositório.

---

## Categorias de produto

Categorias são persistidas como entidade própria e associadas aos produtos por
`product_categories`.

A aplicação usa `ProductCategory` no modelo de domínio e sempre entrega
`categories` dentro de `Product`.

Comportamento implementado:

- o catálogo público deriva a lista de filtros a partir dos produtos publicados,
  portanto exibe apenas categorias de produtos ativos;
- a busca pública em `/produtos` considera nome, descrição, nome de categoria e
  slug de categoria;
- a página de produto exibe as categorias associadas;
- os cards de listagem exibem até duas categorias de forma discreta;
- o formulário administrativo permite selecionar categorias existentes por
  sugestão, criar novas categorias pelo campo de produto e remover categorias do
  produto;
- o admin lista todas as categorias existentes via `listCategories`, inclusive
  categorias associadas apenas a produtos inativos;
- não existe tela dedicada para gestão, renomeação ou exclusão de categorias.

A substituição das categorias de um produto ocorre por
`replaceProductCategories(productId, categoryNames)`. O adapter Supabase:

1. normaliza e deduplica nomes por slug;
2. cria categorias ausentes com `upsert` por `slug`;
3. busca as categorias efetivas;
4. remove as associações atuais do produto;
5. insere o novo conjunto de associações.

O slug é a barreira técnica contra duplicatas evidentes como `Decoração`,
`decoração` e `decoracao`.

---

## Imagens e Storage

Imagens de produto devem ser administráveis sem alteração de código.

O acesso ao Storage permanece atrás de `MediaStorage` ou adapter equivalente.

Requisitos documentados:

- múltiplas imagens por produto;
- ordem definida;
- upload;
- remoção;
- `alt_text`;
- validação razoável;
- tratamento de falhas;
- prevenção de duplicação e arquivos órfãos quando possível sem complexidade excessiva.

Não implementar pipeline sofisticado de resize/compressão sem necessidade concreta.

---

## Migração dos produtos estáticos

Os produtos existentes não devem ser recadastrados manualmente.

O projeto possui duas formas versionadas relacionadas a seed/import:

- `supabase/migrations/202609080002_seed_products_from_static_data.sql`;
- `scripts/seed-products.ts`, executado por `npm run seed:products`.

A migration SQL faz upsert apenas dos registros de produto em
`public.products`.

O script local documentado pelo comando:

```bash
npm run seed:products
```

O script:

- importa `src/data/products.ts`;
- faz upsert por `id`;
- converte `price` em reais para `price_cents`;
- cria categorias ausentes a partir de `product.categories`;
- associa categorias aos produtos sem duplicar associações já existentes;
- tenta enviar imagens locais referenciadas em `src/data/products.ts` para o
  bucket `product-images`;
- registra imagens por `storage_path`;
- evita duplicação em reexecuções.
- lê variáveis de `.env`, `.env.local` e `process.env`;
- aceita `SUPABASE_URL` ou `VITE_SUPABASE_URL` para a URL;
- exige `SUPABASE_SERVICE_ROLE_KEY`;
- usa `SUPABASE_PRODUCT_IMAGES_BUCKET` ou `product-images`.

Quando uma imagem local não existe, o script registra um warning e continua.
No checkpoint atual do repositório, não há arquivos versionados em
`public/products/`, e isso está alinhado à decisão de usar Supabase Storage como
fonte oficial das imagens.

O processo não apaga automaticamente produtos, categorias, associações ou imagens
que já existam no Supabase e tenham sido removidos da fonte estática.

Essa decisão evita perda acidental durante a migração.

O fallback estático e o seed são mecanismos de transição. Quando a persistência estiver consolidada, reavaliar sua necessidade antes de mantê-los indefinidamente.

---

## Configuração de ambiente

Manter `.env.example` atualizado.

Variáveis versionadas em `.env.example`:

```env
VITE_DATA_PROVIDER=auto
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=

# Usado somente por scripts locais de migração/seed. Nunca exponha no browser.
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PRODUCT_IMAGES_BUCKET=product-images
```

Somente variáveis `VITE_*` são destinadas ao bundle do navegador.

Variáveis frontend devem ser tratadas como públicas.

`SUPABASE_SERVICE_ROLE_KEY` nunca deve ser configurada no frontend hospedado.

O código documentado ainda aceita `VITE_SUPABASE_ANON_KEY` por compatibilidade, mas a variável preferida é:

```text
VITE_SUPABASE_PUBLISHABLE_KEY
```

---

## Configuração local

Fluxo operacional documentado:

1. criar/configurar o projeto Supabase;
2. aplicar as migrations;
3. criar manualmente o usuário administrador no Supabase Auth;
4. inserir seu `user_id` em `public.admin_users`;
5. configurar `.env.local`;
6. instalar dependências;
7. executar a aplicação.

Exemplo de autorização inicial:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'admin@yumi.example';
```

O e-mail acima é apenas exemplo e não deve ser tratado como configuração real.

---

## Hosting e deploy

O frontend permanece desacoplado do provider de hosting no nível da aplicação.

O provider documentado atualmente é **GitHub Pages**.

URL documentada:

```text
https://dougllima.github.io/yumi-catalog/
```

Configuração versionada:

- `vite.config.ts` usa `base: "/yumi-catalog/"`;
- `BrowserRouter` usa `basename={import.meta.env.BASE_URL}`;
- `.github/workflows/deploy.yml` roda em push para `main` e
  `workflow_dispatch`;
- o workflow usa Node 24, executa `npm ci` e `npm run check`;
- o workflow cria `dist/404.html` a partir de `dist/index.html` para suportar rotas diretas da SPA no GitHub Pages.
- o workflow publica `dist` com `actions/upload-pages-artifact@v3` e
  `actions/deploy-pages@v4`.

No GitHub, Pages deve usar:

```text
Settings > Pages > Source > GitHub Actions
```

Variáveis de deploy necessárias:

```env
VITE_DATA_PROVIDER=supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Não configurar `SUPABASE_SERVICE_ROLE_KEY` no ambiente do frontend.

GitHub Pages é o hosting atual/documentado, não uma dependência arquitetural do domínio.

Uma futura troca de hosting não deve exigir alteração de regras de negócio ou componentes centrais.

---

## Persistência do catálogo

O catálogo público deve consumir o mesmo núcleo persistente administrado internamente.

Produtos inativos não devem aparecer publicamente.

A aplicação deve tratar de forma compreensível:

- loading;
- falha de carregamento;
- imagens quebradas;
- indisponibilidade temporária do provider.

---

## Testabilidade

A separação por contracts deve permitir testar lógica da aplicação sem depender diretamente do Supabase.

Mocks, fakes ou implementação in-memory podem ser utilizados quando trouxerem benefício concreto.

Setup real atual:

- Vitest configurado em `vite.config.ts`;
- ambiente `jsdom`;
- setup em `src/test/setup.ts`;
- Testing Library e `@testing-library/jest-dom`;
- arquivos de teste com sufixo `.tests.ts` ou `.tests.tsx`;
- coverage com provider `v8`;
- relatórios `text`, `html` e `lcov` em `coverage/`;
- thresholds globais iniciais: 60% para statements, functions e lines; 50%
  para branches.

Priorizar testes para:

- regras de negócio;
- mapping entre persistência e aplicação;
- contracts relevantes;
- comportamento crítico do admin;
- regressões.

Não testar detalhes internos do SDK do Supabase.

---

## Padronização de desenvolvimento

Configurações versionadas:

- TypeScript estrito em `tsconfig.app.json` e `tsconfig.node.json`;
- ESLint flat config em `eslint.config.js`;
- Prettier em `.prettierrc.json`;
- `.prettierignore`;
- `.editorconfig`;
- `.gitattributes` com LF e imagens como binárias;
- Husky em `.husky/`;
- pre-commit executando `npm run lint-staged`;
- `lint-staged` aplicando ESLint/Prettier em arquivos staged.

Regras técnicas relevantes:

- `eslint-config-prettier` desativa conflitos entre ESLint e Prettier;
- `eslint-plugin-simple-import-sort` exige ordenação de imports e exports;
- `eslint-plugin-react-hooks` aplica regras de hooks;
- `eslint-plugin-react-refresh` protege o padrão esperado de exports em
  componentes React.

---

## Decisões técnicas ainda abertas

As decisões abaixo devem ser registradas somente quando forem efetivamente tomadas ou implementadas:

- modelagem persistente da flag `requer revisão`;
- modelagem de materiais;
- modelagem de componentes de custo;
- estratégia de precificação calculada;
- necessidade real de resize/compressão de imagens no cliente;
- necessidade de código server-side;
- eventual troca de provider de hosting;
- eventual remoção do fallback estático após estabilização da persistência.

Quando uma dessas decisões for consolidada, atualizar este documento removendo-a desta seção e descrevendo o estado adotado.
