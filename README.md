# Yumi Studio - Catálogo público

Catálogo React + Vite para publicar produtos da Yumi Studio, agora com primeira
estrutura persistente para administração interna.

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

## Testes

```bash
npm run test
```

## Administração persistente

A área administrativa fica em `/admin` e usa Supabase quando configurada.

1. Copie `.env.example` para `.env.local`.
2. Preencha as variáveis do Supabase.
3. Aplique a migration em `supabase/migrations`.
4. Crie manualmente o usuário no Supabase Auth.
5. Adicione o usuário à tabela `admin_users`.
6. Importe o catálogo atual:

```bash
npm run seed:products
```

Veja os detalhes em `docs/architecture.md`.

## Fallback estático

Sem variáveis Supabase, o catálogo continua usando `src/data/products.ts` como
fallback local. Isso facilita desenvolvimento e permite migrar gradualmente.

## Estilo

Os tokens visuais ficam em `src/index.css`. Componentes shadcn/ui locais ficam em `src/components/ui/`.
