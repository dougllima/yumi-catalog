# Yumi Studio - Catálogo público

Catálogo React + Vite para publicar produtos da Yumi Studio, agora com primeira
estrutura persistente para administração interna.

O catálogo público permite buscar produtos por nome, descrição ou categoria, e
filtrar produtos por categorias associadas a produtos ativos.

Estilização com Tailwind CSS v4 e componentes locais no padrão shadcn/ui.

## Executar localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Qualidade

```bash
npm run check
npm run format
npm run lint:fix
npm run test:coverage
```

Use `npm run check` como validação principal antes de publicar alterações.

## Testes

```bash
npm run test
```

## Administração persistente

A área administrativa fica em `/admin` e usa Supabase quando configurada.

1. Copie `.env.example` para `.env.local`.
2. Preencha as variáveis do Supabase.
3. Aplique as migrations em `supabase/migrations`.
4. Crie manualmente o usuário no Supabase Auth.
5. Adicione o usuário à tabela `admin_users`.
6. Importe o catálogo atual:

```bash
npm run seed:products
```

As imagens dos produtos devem ficar no Supabase Storage, no bucket
`product-images`. O script de seed também cria categorias ausentes e associa
categorias aos produtos. Ele tenta migrar imagens locais quando elas existirem,
mas o repositório não trata `public/products` como fonte oficial.

Veja os detalhes em `docs/architecture.md`.

## Fallback estático

Sem variáveis Supabase, o catálogo continua usando `src/data/products.ts` como
fallback local. Isso facilita desenvolvimento, mas a fonte oficial das imagens
do catálogo persistente é o Supabase Storage.

## Estilo

Os tokens visuais ficam em `src/index.css`. Componentes shadcn/ui locais ficam
em `src/components/ui/`.
