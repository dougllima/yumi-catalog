# Previa de atualizacao do Supabase

Esta previa foi montada em 2026-09-15 antes de qualquer escrita nova no banco.

Objetivo: alinhar o Supabase com a lista revisada de produtos e com as imagens
locais em `public/products`, confirmando inconsistencias antes de alterar dados
ambiguos.

## Estado verificado

- MCP/CLI do Supabase autenticado.
- Projeto remoto vinculado: `omyslabybzuwzlsvggjh`.
- Migrations locais e remotas estao alinhadas ate
  `202609150002_remove_product_weight_add_home_highlight.sql`.
- A tabela `public.products` remota ja possui `show_on_home`.
- A coluna `weight_grams` ja nao existe no schema remoto.
- Todos os produtos remotos consultados estao ativos.
- Nenhum produto remoto esta marcado com `show_on_home = true`.
- A migration local `20260915164248_catalog_products_update.sql` foi gerada,
  mas nao aplicada no banco remoto.
- Foram enviados 58 arquivos ao bucket `product-images` para preparar os
  caminhos usados pela migration.

## Regra de aplicacao proposta

- Criar ou atualizar produtos a partir da lista revisada.
- Nao cadastrar `Trofeu Rodrigo`.
- Nao cadastrar como produtos publicos separados:
  `Suporte Controle - Base dupla`, `Suporte Controle - Base tripla`,
  `Suporte Controle - Encaixe PS3`, `Suporte Controle - Encaixe PS4` e
  `Suporte Controle - Encaixe PS5`.
- Manter `Suporte para 2 controles` e `Suporte para 3 controles` como os dois
  produtos publicos finais.
- Consolidar `Porta Copos - Planta` e `Porta Copos - Vaso` em um unico produto:
  `Porta Copos - Vaso Costela de Adao`, por R$ 120,00.
- Substituir os kits `Kit Porta Polaroid Coracao - 5 unidades` e
  `Kit Porta Polaroid Coracao - 10 unidades` por `Porta Polaroid - coracao`,
  ativo e sem preco por enquanto.
- Manter produtos sem preco ativos, para revisao posterior.
- Manter ativos os produtos remotos que nao apareceram na planilha revisada.
- Nao marcar nenhum produto para home nesta importacao, ate a selecao de
  destaques ser definida.

## Produtos a criar

| ID proposto               | Nome                      |     Preco | Observacao                                     |
| ------------------------- | ------------------------- | --------: | ---------------------------------------------- |
| `abridor-monster`         | Abridor Monster           |   R$ 4,00 | Sem pasta local individual.                    |
| `aparador-de-livro-l`     | Aparador de livro - L     |  R$ 10,00 | Sem pasta local.                               |
| `cabide-cintos`           | Cabide - Cintos           |  R$ 10,00 | Sem pasta local.                               |
| `caixa-polaroid`          | Caixa Polaroid            |  R$ 50,00 | Existe no fallback local, mas nao no Supabase. |
| `caixinha-copa`           | Caixinha Copa             |  R$ 40,00 | Sem pasta local.                               |
| `caneca-monster`          | Caneca Monster            |  R$ 50,00 | Sem pasta local individual.                    |
| `chaveiro-kettlebell`     | Chaveiro Kettlebell       |  R$ 15,00 | Sem pasta local.                               |
| `chaveiro-yumi`           | Chaveiro Yumi             |  R$ 10,00 | Existe no fallback local, mas nao no Supabase. |
| `mascara-silent-hill-f`   | Mascara Silent Hill F     |  R$ 60,00 | Sem pasta local.                               |
| `mecanismo-clicker`       | Mecanismo Clicker         |   R$ 1,50 | Existe no fallback local, mas nao no Supabase. |
| `mini-prendedores`        | Mini prendedores          | Sem preco | Substitui o cadastro antigo de kit.            |
| `organizador-magic`       | Organizador Magic         |  R$ 35,00 | Existe no fallback local, mas nao no Supabase. |
| `porta-escovas`           | Porta Escovas             |  R$ 30,00 | Sem pasta local.                               |
| `porta-polaroid-coracao`  | Porta Polaroid - coracao  | Sem preco | Substitui os kits de 5 e 10 unidades.          |
| `porta-retrato-musica`    | Porta Retrato Musica      |  R$ 40,00 | Sem pasta local.                               |
| `porta-retrato-simples`   | Porta Retrato Simples     |  R$ 50,00 | Sem pasta local.                               |
| `prensador-de-hamburguer` | Prensador de Hamburguer   |  R$ 25,00 | Sem pasta local.                               |
| `suporte-de-bolo-boleira` | Suporte de bolo - Boleira |  R$ 60,00 | Sem pasta local.                               |
| `tampa-monster`           | Tampa Monster             |   R$ 6,00 | Sem pasta local individual.                    |
| `treco-de-sacola`         | Treco de sacola           |  R$ 10,00 | Sem pasta local.                               |

## Produtos a atualizar

| ID atual                   | Alteracao proposta                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `jogo-equilibrio`          | Definir preco como R$ 100,00; manter nome atual `Jogo de Equilibrio`.                                              |
| `kit-monster-v1`           | Renomear ID tecnico para `kit-monster`, porque o ID e usado como slug da URL.                                      |
| `marca-pagina-gatinho`     | Corrigir nome remoto de `Marca-pagina Pet` para `Marca-pagina Gatinho`.                                            |
| `porta-copos-planta`       | Renomear para `porta-copos-vaso-costela-de-adao`, preco R$ 120,00, com imagens da pasta `porta-copos-vaso-planta`. |
| `suporte-para-2-controles` | Manter preco R$ 60,00.                                                                                             |
| `suporte-para-3-controles` | Manter preco R$ 85,00.                                                                                             |

## Produtos a inativar/substituir

| ID atual                        | Acao proposta                                      |
| ------------------------------- | -------------------------------------------------- |
| `kit-porta-polaroid-coracao-5`  | Inativar depois de criar `porta-polaroid-coracao`. |
| `kit-porta-polaroid-coracao-10` | Inativar depois de criar `porta-polaroid-coracao`. |
| `kit-mini-prendedores-10`       | Substituir por `mini-prendedores`.                 |

## Produtos remotos fora da planilha

Estes produtos existem no Supabase e/ou nas imagens locais, mas nao apareceram na
lista revisada. Decisao: manter ativos por enquanto.

| ID atual                      | Nome remoto                 | Preco atual |
| ----------------------------- | --------------------------- | ----------: |
| `clicker-capivara`            | Clicker Capivara            |   Sem preco |
| `figure-balrog`               | Figure Balrog               |   Sem preco |
| `figure-frieren`              | Figure Frieren              |   Sem preco |
| `figure-legolas-ogro`         | Figure Legolas Ogro         |   Sem preco |
| `suporte-controle-gengar`     | Suporte Controle Gengar     |   Sem preco |
| `tampa-caneca-chapeu-seletor` | Tampa Caneca Chapeu Seletor |   Sem preco |

## Imagens locais a subir ou registrar

O bucket remoto possui algumas imagens, mas varios produtos ativos ainda estao
sem registros em `product_images`. A proposta e subir/registrar as pastas locais
abaixo quando o produto correspondente for mantido ativo.

| Pasta local                        | Produto alvo                       | Arquivos |
| ---------------------------------- | ---------------------------------- | -------: |
| `aparador-de-livro-dragao`         | `aparador-de-livro-dragao`         |        4 |
| `kit-mini-prendedores-10`          | `mini-prendedores`                 |        1 |
| `kit-porta-polaroid-coracao-10`    | `porta-polaroid-coracao`           |        1 |
| `kit-porta-polaroid-coracao-5`     | `porta-polaroid-coracao`           |        1 |
| `porta-copos-costela-de-adao`      | `porta-copos-costela-de-adao`      |        2 |
| `porta-copos-vaso-planta`          | `porta-copos-vaso-costela-de-adao` |        6 |
| `porta-cotonete`                   | `porta-cotonete`                   |        4 |
| `porta-guardanapo-costela-de-adao` | `porta-guardanapo-costela-de-adao` |        2 |
| `porta-incenso-gato`               | `porta-incenso-gato`               |        5 |
| `porta-joias`                      | `porta-joias`                      |        4 |
| `porta-maquiagem`                  | `porta-maquiagem`                  |        7 |
| `porta-remedios-umbrella`          | `porta-remedios-umbrella`          |        2 |
| `quadro-reforco-infantil`          | `quadro-reforco-infantil`          |        1 |
| `suporte-de-chave-mario`           | `suporte-de-chave-mario`           |        3 |
| `suporte-livro-darth-vader`        | `suporte-livro-darth-vader`        |        3 |
| `suporte-oculos-gatinho`           | `suporte-oculos-gatinho`           |        3 |
| `suporte-para-3-controles`         | `suporte-para-3-controles`         |        4 |
| `tampa-caneca-chapel-seletor`      | `tampa-caneca-chapeu-seletor`      |        1 |
| `trono-de-ferro`                   | `trono-de-ferro`                   |        3 |
| `vaso`                             | `vaso`                             |        2 |

## Produtos sem imagem local aparente

Estes produtos podem ser criados ativos sem imagem, mas precisam de revisao
visual depois.

- `abridor-monster`
- `aparador-de-livro-l`
- `cabide-cintos`
- `caixa-polaroid`
- `caixa-uno`
- `caixinha-copa`
- `caneca-monster`
- `chaveiro-kettlebell`
- `chaveiro-yumi`
- `jogo-equilibrio`
- `mascara-silent-hill-f`
- `mecanismo-clicker`
- `organizador-magic`
- `porta-escovas`
- `porta-retrato-musica`
- `porta-retrato-simples`
- `prensador-de-hamburguer`
- `suporte-de-bolo-boleira`
- `suporte-para-2-controles`
- `tampa-monster`
- `treco-de-sacola`

## Pendencias apos aplicacao

- [ ] Confirmar se `Kit Porta Copos Flor` e o mesmo produto que
      `porta-copos-costela-de-adao`. Ele nao sera criado nesta rodada.
- [ ] Definir quais produtos devem ter `show_on_home = true`.

## Confirmacoes ja respondidas

- [x] Confirmar se os produtos remotos fora da planilha devem continuar ativos,
      ficar inativos ou ser removidos depois.
- [x] Confirmar o destino de `kit-monster-v1`: o ID tecnico deve mudar para
      `kit-monster`, porque o ID tambem e usado como slug.
- [x] Confirmar se `Mini prendedores` deve permanecer como
      `Kit de Mini Prendedores - 10 unidades` ou mudar para outro nome/quantidade.
- [x] Confirmar se produtos sem imagem podem entrar ativos agora.

## Ordem de execucao apos aprovacao

1. Rodar advisors do Supabase antes da escrita.
2. Subir imagens locais faltantes para o bucket `product-images`.
3. Aplicar a migration versionada de produtos, categorias e metadados de imagem.
4. Validar contagem de produtos, produtos sem preco, produtos sem imagem e
   produtos marcados para home.
5. Revisar pendencias comerciais, especialmente home e `Kit Porta Copos Flor`.
