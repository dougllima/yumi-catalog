# Yumi Studio - Catálogo público provisório

Catálogo simples em React + Vite para publicar produtos e preços de forma temporária.

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

## Adicionar um produto

1. Coloque as imagens em `public/products/nome-do-produto/`.
2. Cadastre o produto em `src/data/products.ts`.
3. Preencha `id`, `name`, `description`, `weight`, `price` e `images`.

Exemplo:

```ts
{
  id: "porta-retrato-gengar",
  name: "Porta-retrato Gengar",
  description: "Porta-retrato impresso em 3D.",
  weight: 150,
  price: 49.9,
  images: [
    "/products/porta-retrato-gengar/01.webp",
    "/products/porta-retrato-gengar/02.webp",
  ],
}
```

Um produto novo não exige alterar componentes React: basta adicionar imagens e um novo objeto no array `products`.

## Estilo

Os tokens visuais ficam em `src/index.css`. Componentes shadcn/ui locais ficam em `src/components/ui/`.
