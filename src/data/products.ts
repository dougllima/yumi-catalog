import type { Product, ProductCategory } from "../domain/product";
import { createProductCategory } from "../domain/product";

export type { Product } from "../domain/product";

type ProductSeed = Omit<
  Product,
  "categories" | "images" | "imageRecords" | "isActive"
> & {
  imageFolder?: string;
  isActive?: boolean;
};

const img = (folder: string, ...files: string[]) =>
  files.map((file) => `/products/${folder}/${file}`);

const productImagePaths: Record<string, string[]> = {
  "aparador-de-livro-dragao": img(
    "aparador-de-livro-dragao",
    "01.webp",
    "02.webp",
    "03.jpeg",
    "04.jpeg",
    "05.jpeg",
    "06.jpeg",
    "07.jpeg",
    "08.jpeg",
  ),
  "caixa-de-dados-p": img(
    "caixa-de-dados-p",
    "01.jpeg",
    "02.jpeg",
    "03.jpeg",
    "04.jpeg",
  ),
  "chaveiro-calendario": img("chaveiro-calendario", "01.jpeg"),
  "chaveiro-cartinha": img("chaveiro-cartinha", "01.webp"),
  "clicker-capivara": img("clicker-capivara", "01.jpeg", "01.webp"),
  "enfeite-home-m": img("enfeite-home-m", "01.webp"),
  "figure-balrog": img("figure-balrog", "01.jpeg", "02.jpeg", "03.jpeg"),
  "figure-frieren": img(
    "figure-fieren",
    "01.jpeg",
    "02.jpeg",
    "03.jpeg",
    "04.jpeg",
  ),
  "figure-legolas-ogro": img("figure-legolas-ogro", "01.jpeg", "02.jpeg"),
  "fruta-one-piece": img("fruta-one-piece", "01.webp", "02.webp", "03.webp"),
  "kit-mecanismo-clicker": img("kit-mecanismo-clicker", "01.webp"),
  "kit-mini-prendedores-10": img("kit-mini-prendedores-10", "01.webp"),
  "kit-monster": img("kit-monster", "01.jpeg", "02.jpeg"),
  "kit-porta-polaroid-coracao-5": img(
    "kit-porta-polaroid-coracao-5",
    "01.webp",
  ),
  "kit-porta-polaroid-coracao-10": img(
    "kit-porta-polaroid-coracao-10",
    "01.jpeg",
  ),
  "lagarto-tom": img("lagarto-tom", "04.jpeg", "05.jpeg"),
  "marca-pagina-gatinho": img("marca-pagina-gatinho", "02.jpeg", "03.jpeg"),
  "porta-celular-stars": img(
    "porta-celular-stars",
    "01.jpeg",
    "02.jpeg",
    "03.jpeg",
    "04.jpeg",
  ),
  "porta-copo-gatinho-batman": img(
    "porta-copo-gatinho-batman",
    "01.jpeg",
    "02.jpeg",
  ),
  "porta-copos-costela-de-adao": img(
    "porta-copos-costela-de-adao",
    "02.jpeg",
    "03.jpeg",
  ),
  "porta-copos-planta": img(
    "porta-copos-planta",
    "01.jpeg",
    "02.jpeg",
    "03.jpeg",
    "04.jpeg",
    "05.jpeg",
    "06.jpeg",
  ),
  "porta-cotonete": img(
    "porta-cotonete",
    "01.jpeg",
    "02.jpeg",
    "03.jpeg",
    "04.jpeg",
  ),
  "porta-guardanapo-costela-de-adao": img(
    "porta-guardanapo-costela-de-adao",
    "01.jpeg",
    "02.jpeg",
  ),
  "porta-incenso-gato": img(
    "porta-incenso-gato",
    "01.jpeg",
    "02.jpeg",
    "03.jpeg",
    "04.jpeg",
    "05.jpeg",
  ),
  "porta-joias": img("porta-joias", "01.jpeg", "02.jpeg", "03.jpeg", "04.jpeg"),
  "porta-maquiagem": img(
    "porta-maquiagem",
    "01.jpeg",
    "02.jpeg",
    "03.jpeg",
    "04.jpeg",
    "05.jpeg",
    "06.jpeg",
    "07.jpeg",
  ),
  "porta-remedios-umbrella": img(
    "porta-remedios-umbrella",
    "01.jpeg",
    "02.jpeg",
  ),
  "quadro-reforco-infantil": img("quadro-reforco-infantil", "01.webp"),
  "suporte-controle-gengar": img(
    "suporte-controle-gengar",
    "01.jpeg",
    "02.jpeg",
    "03.jpeg",
  ),
  "suporte-de-chave-mario": img(
    "suporte-de-chave-mario",
    "01.jpeg",
    "02.jpeg",
    "03.jpeg",
  ),
  "suporte-livro-darth-vader": img(
    "suporte-livro-darth-vader",
    "01.jpeg",
    "02.jpeg",
    "03.jpeg",
  ),
  "suporte-oculos-gatinho": img(
    "suporte-oculos-gatinho",
    "01.jpeg",
    "02.jpeg",
    "03.jpeg",
  ),
  "suporte-para-3-controles": img(
    "suporte-para-3-controles",
    "01.jpeg",
    "02.jpeg",
    "03.jpeg",
    "04.jpeg",
  ),
  "tampa-caneca-chapeu-seletor": img("tampa-caneca-chapel-seletor", "01.jpeg"),
  "trono-de-ferro": img("trono-de-ferro", "01.jpeg", "02.jpeg", "03.jpeg"),
  vaso: img("vaso", "01.jpeg", "02.jpeg"),
};

const productCategoryNames: Record<string, string[]> = {
  "aparador-de-livro-dragao": ["Livros", "Geek", "Decoração"],
  "caixa-de-dados-p": ["Games", "Organização"],
  "caixa-polaroid": ["Fotos", "Organização"],
  "chaveiro-calendario": ["Chaveiros"],
  "chaveiro-cartinha": ["Chaveiros"],
  "chaveiro-yumi": ["Chaveiros"],
  "enfeite-home-m": ["Casa", "Decoração"],
  "figure-balrog": ["Figures", "Geek"],
  "figure-frieren": ["Figures", "Geek"],
  "figure-legolas-ogro": ["Figures", "Geek"],
  "fruta-one-piece": ["Geek", "Decoração"],
  "jogo-equilibrio": ["Games", "Infantil"],
  "kit-monster-v1": ["Geek", "Decoração"],
  "kit-porta-copos-flor": ["Casa", "Porta-copos"],
  "kit-mini-prendedores-10": ["Organização", "Casa"],
  "marca-pagina-gatinho": ["Livros", "Pets"],
  "organizador-magic": ["Games", "Organização"],
  "porta-celular-stars": ["Geek", "Organização"],
  "porta-copo-gatinho-batman": ["Porta-copos", "Geek"],
  "porta-copos-costela-de-adao": ["Porta-copos", "Casa"],
  "porta-copos-planta": ["Porta-copos", "Casa"],
  "porta-cotonete": ["Organização", "Casa"],
  "porta-guardanapo-costela-de-adao": ["Casa"],
  "porta-incenso-gato": ["Casa", "Pets"],
  "porta-joias": ["Organização", "Casa"],
  "porta-maquiagem": ["Organização", "Casa"],
  "kit-porta-polaroid-coracao-5": ["Fotos"],
  "kit-porta-polaroid-coracao-10": ["Fotos"],
  "porta-remedios-umbrella": ["Organização", "Geek"],
  "separador-de-livro-dragao": ["Livros", "Geek"],
  "suporte-para-2-controles": ["Games", "Organização"],
  "suporte-para-3-controles": ["Games", "Organização"],
  "suporte-controle-gengar": ["Games", "Geek"],
  "suporte-de-chave-mario": ["Geek", "Casa"],
  "suporte-oculos-gatinho": ["Organização", "Pets"],
  "suporte-livro-darth-vader": ["Livros", "Geek"],
  "tampa-caneca-chapeu-seletor": ["Geek", "Casa"],
  "trono-de-ferro": ["Geek", "Decoração"],
  vaso: ["Casa", "Decoração"],
  "caixa-uno": ["Games", "Organização"],
  "quadro-reforco-infantil": ["Infantil"],
};

const productImages = (folder: string) => productImagePaths[folder] ?? [];

const productCategories = (productId: string): ProductCategory[] =>
  (productCategoryNames[productId] ?? [])
    .map(createProductCategory)
    .filter((category): category is ProductCategory => Boolean(category));

const productSeeds: ProductSeed[] = [
  {
    id: "aparador-de-livro-dragao",
    name: "Aparador de livro - Dragão",
    weight: 150,
    price: 40,
  },
  {
    id: "caixa-de-dados-p",
    name: "Caixa de Dados P",
    weight: 74,
    price: 30,
  },
  {
    id: "caixa-polaroid",
    name: "Caixa Polaroid",
    weight: 100,
    price: 50,
  },
  {
    id: "chaveiro-calendario",
    name: "Chaveiro Calendário",
    weight: 12,
    price: 15,
  },
  {
    id: "chaveiro-cartinha",
    name: "Chaveiro Cartinha",
    weight: 16,
    price: 10,
  },
  {
    id: "chaveiro-yumi",
    name: "Chaveiro Yumi",
    weight: 15,
    price: 10,
  },
  {
    id: "clicker-capivara",
    name: "Clicker Capivara",
  },
  {
    id: "enfeite-home-m",
    name: "Enfeite Home - M",
    weight: 72,
    price: 20,
  },
  {
    id: "figure-balrog",
    name: "Figure Balrog",
  },
  {
    id: "figure-frieren",
    name: "Figure Frieren",
  },
  {
    id: "figure-legolas-ogro",
    name: "Figure Legolas Ogro",
  },
  {
    id: "fruta-one-piece",
    name: "Fruta One Piece",
    weight: 85,
    price: 40,
  },
  {
    id: "jogo-equilibrio",
    name: "Jogo de Equilíbrio",
    description:
      "Jogo de equilíbrio com árvore, caixa e conjunto de peças temáticas à escolha.",
  },
  {
    id: "kit-monster-v1",
    name: "Kit Monster V1",
    weight: 157,
    price: 50,
    imageFolder: "kit-monster",
  },
  {
    id: "kit-porta-copos-flor",
    name: "Kit Porta Copos Flor",
    weight: 257,
    price: 100,
  },
  {
    id: "mecanismo-clicker",
    name: "Mecanismo Clicker",
    weight: 3,
    price: 1.5,
    imageFolder: "kit-mecanismo-clicker",
  },
  {
    id: "kit-mini-prendedores-10",
    name: "Kit de Mini Prendedores - 10 unidades",
    description:
      "Kit com dez mini prendedores para fechar pacotes e embalagens abertas.",
  },
  {
    id: "lagarto-tom",
    name: "Lagarto Tom",
    weight: 45,
    price: 20,
  },
  {
    id: "marca-pagina-gatinho",
    name: "Marca-página Gatinho",
    weight: 2,
    price: 5,
  },
  {
    id: "organizador-magic",
    name: "Organizador Magic",
    weight: 107,
    price: 35,
  },
  {
    id: "porta-celular-stars",
    name: "Porta Celular STARS",
    weight: 121,
    price: 80,
  },
  {
    id: "porta-copo-gatinho-batman",
    name: "Porta copo - Gatinho Batman",
    weight: 25,
    price: 10,
  },
  {
    id: "porta-copos-costela-de-adao",
    name: "Porta Copos - Costela de Adão",
    weight: 170,
    price: 60,
  },
  {
    id: "porta-copos-planta",
    name: "Porta Copos - Planta",
    weight: 206,
    price: 70,
  },
  {
    id: "porta-cotonete",
    name: "Porta Cotonete",
    weight: 97,
    price: 40,
  },
  {
    id: "porta-guardanapo-costela-de-adao",
    name: "Porta Guardanapo - Costela de Adão",
    weight: 73,
    price: 25,
  },
  {
    id: "porta-incenso-gato",
    name: "Porta Incenso Gato",
    weight: 51,
    price: 25,
  },
  {
    id: "porta-joias",
    name: "Porta Jóias",
    weight: 392,
    price: 130,
  },
  {
    id: "porta-maquiagem",
    name: "Porta Maquiagem",
    weight: 580,
    price: 160,
  },
  {
    id: "kit-porta-polaroid-coracao-5",
    name: "Kit Porta Polaroid Coração - 5 unidades",
    description:
      "Kit com cinco suportes pequenos em formato de coração para fotos Polaroid.",
    weight: 10,
    price: 10,
  },
  {
    id: "kit-porta-polaroid-coracao-10",
    name: "Kit Porta Polaroid Coração - 10 unidades",
    description:
      "Kit com dez suportes pequenos em formato de coração para fotos Polaroid.",
    weight: 20,
    price: 20,
  },
  {
    id: "porta-remedios-umbrella",
    name: "Porta Remédios Umbrella",
    weight: 20,
    price: 10,
  },
  {
    id: "separador-de-livro-dragao",
    name: "Separador de livro - Dragão",
    weight: 212,
    price: 55,
  },
  {
    id: "suporte-para-2-controles",
    name: "Suporte para 2 controles",
    description:
      "Suporte para dois controles com encaixes à escolha entre PS3, PS4 e PS5.",
    weight: 213,
    price: 60,
  },
  {
    id: "suporte-para-3-controles",
    name: "Suporte para 3 controles",
    description:
      "Suporte para três controles com encaixes à escolha entre PS3, PS4 e PS5.",
    weight: 318,
    price: 85,
  },
  {
    id: "suporte-controle-gengar",
    name: "Suporte Controle Gengar",
  },
  {
    id: "suporte-de-chave-mario",
    name: "Suporte de chave - Mario",
    weight: 230,
    price: 75,
  },
  {
    id: "suporte-oculos-gatinho",
    name: "Suporte de óculos - Gatinho",
  },
  {
    id: "suporte-livro-darth-vader",
    name: "Suporte livro Darth Vader",
    weight: 123.8,
    price: 45,
  },
  {
    id: "tampa-caneca-chapeu-seletor",
    name: "Tampa Caneca Chapéu Seletor",
  },
  {
    id: "trono-de-ferro",
    name: "Trono de Ferro",
    weight: 33,
    price: 20,
  },
  {
    id: "vaso",
    name: "Vaso",
    weight: 210,
    price: 60,
  },
  {
    id: "caixa-uno",
    name: "Caixa Uno",
    weight: 91,
    price: 25,
  },
  {
    id: "quadro-reforco-infantil",
    name: "Quadro Reforço Infantil",
    weight: 210,
    price: 50,
  },
];

export const products: Product[] = productSeeds.map(
  ({ imageFolder, ...product }) => ({
    ...product,
    isActive: product.isActive ?? true,
    images: productImages(imageFolder ?? product.id),
    categories: productCategories(product.id),
    imageRecords: productImages(imageFolder ?? product.id).map(
      (url, index) => ({
        id: `${product.id}-${index}`,
        url,
        altText: product.name,
        sortOrder: index,
      }),
    ),
  }),
);
