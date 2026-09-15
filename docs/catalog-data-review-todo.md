# Todo de revisão do catálogo

Este arquivo reúne tarefas operacionais e decisões de cadastro que precisam ser
confirmadas antes de bater a planilha, as imagens locais e o Supabase.

Não usar este arquivo como backlog técnico. Ele existe para organizar revisão de
produto, preço, composição, foto, descrição e decisão comercial.

## Decisões já alinhadas

- [ ] Todos os itens da planilha devem virar produtos, exceto `Troféu Rodrigo`.
- [ ] Produtos sem preço podem continuar ativos, mas devem ficar marcados para
      revisão posterior.
- [ ] `Suporte Controle - Base dupla`, `Suporte Controle - Base tripla`,
      `Suporte Controle - Encaixe PS3`, `Suporte Controle - Encaixe PS4` e
      `Suporte Controle - Encaixe PS5` não entram como produtos públicos
      separados.
- [ ] Os suportes para controle entram como dois produtos públicos:
      `Suporte para 2 controles` e `Suporte para 3 controles`.
- [ ] Cada encaixe de controle deve ser considerado como R$ 15,00 no valor do
      suporte.
- [ ] `Porta Copos - Planta` e `Porta Copos - Vaso` compõem um único produto:
      `Porta Copos - Planta`, com preço final de R$ 120,00.
- [ ] `Porta Polaroid - coração` deve substituir os kits de 5 e 10 unidades como
      produto único, ativo e sem preço definido por enquanto.

## Conferências pendentes

- [ ] Revisar a planilha inteira e confirmar nome final, preço, categorias,
      descrição e status de cada produto.
- [ ] Conferir quais produtos devem aparecer na home, especialmente a seleção de
      Halloween.
- [ ] Conferir se produtos sem preço devem exibir texto específico no catálogo
      ou apenas ocultar o preço.
- [ ] Conferir quais produtos novos precisam de descrição antes de entrar no
      catálogo.
- [ ] Conferir categorias dos produtos novos para evitar categorias duplicadas
      por variação de acento, caixa ou espaçamento.
- [ ] Conferir se produtos com nomes parecidos são produtos diferentes ou
      variações do mesmo item.
- [ ] Conferir se algum produto deve ficar inativo mesmo existindo na planilha.

## Produtos com decisão ou inconsistência específica

- [ ] `Kit Monster`: revisar composição e cadastro.
      Composição informada: 1 `Caneca Monster`, 1 `Abridor Monster` e 1
      `Tampa Monster`.
- [ ] `Kit Monster`: confirmar preço final. A planilha informa R$ 50,00 para o
      kit, enquanto os itens separados somam R$ 60,00.
- [ ] `Kit Monster`: confirmar como lidar com fotos dos itens separados, já que
      hoje há foto do kit, mas não necessariamente das peças individuais.
- [ ] `Caneca Monster`: criar como produto separado e confirmar foto/descrição.
- [ ] `Abridor Monster`: criar como produto separado e confirmar foto/descrição.
- [ ] `Tampa Monster`: criar como produto separado e confirmar foto/descrição.
- [ ] `Suporte para 2 controles`: confirmar foto, porque foi encontrada pasta de
      imagem para `suporte-para-3-controles`, mas não para
      `suporte-para-2-controles`.
- [ ] `Suporte para 2 controles`: confirmar preço final de R$ 60,00
      considerando base dupla de R$ 30,00 + 2 encaixes de R$ 15,00.
- [ ] `Suporte para 3 controles`: confirmar preço final de R$ 85,00
      considerando base tripla de R$ 40,00 + 3 encaixes de R$ 15,00.
- [ ] `Porta Copos - Vaso Costela de Adão`: usar como produto único com preço
      de R$ 120,00 e conferir descrição para explicar que as folhas podem ser
      retiradas e usadas como porta-copos.
- [ ] `Porta Copos - Vaso Costela de Adão`: mapear imagens da pasta
      `public/products/porta-copos-vaso-planta`.
- [ ] `Porta Copos - Vaso`: não cadastrar como produto separado se a decisão de
      produto único for mantida.
- [ ] `Porta Polaroid - coração`: remover/substituir os kits atuais de 5 e 10
      unidades no catálogo.
- [ ] `Porta Polaroid - coração`: deixar ativo sem preço e confirmar qual foto
      usar das pastas dos kits atuais.
- [x] `Mini prendedores`: remover o conceito de kit; manter como produto
      `Mini prendedores`, ativo e sem preço.
- [ ] `Suporte de óculos - Gatinho`: definir preço.
- [ ] `Kit Porta Copos Flor`: confirmar preço correto, pois o cadastro atual usa
      R$ 100,00 e a planilha informa R$ 50,00.
- [ ] `Kit Porta Copos Flor`: confirmar se é o mesmo produto que
      `Porta Copos - Costela de Adão`; se for, não cadastrar produto separado.
- [ ] `Troféu Rodrigo`: não cadastrar como produto público.

## Imagens locais para conferir

- [ ] Confirmar se cada pasta em `public/products` corresponde a um produto real
      do catálogo ou apenas a material temporário de revisão.
- [ ] Conferir pastas com nome divergente do produto:
      `figure-fieren`, `marca-pagina-pet` e `tampa-caneca-chapel-seletor`.
- [ ] Conferir produtos da planilha sem pasta de imagem aparente:
      `Aparador de livro - L`, `Cabide - Cintos`, `Caixinha Copa`,
      `Caneca Monster`, `Chaveiro kettlebell`, `Máscara Silent Hill F`,
      `Porta Escovas`, `Porta Polaroid - coração`, `Porta Retrato Musica`,
      `Porta Retrato Simples`, `Prensador de Hamburguer`,
      `Suporte de bolo - Boleira`, `Suporte para 2 controles`,
      `Tampa Monster` e `Treco de sacola`.
- [ ] Conferir produtos com pasta de imagem local que não apareceram na planilha:
      `clicker-capivara`, `figure-balrog`, `figure-frieren`,
      `figure-legolas-ogro`, `suporte-controle-gengar` e
      `tampa-caneca-chapeu-seletor`.

## Antes de atualizar o Supabase

- [x] Aplicar a migration que remove `weight_grams` e adiciona `show_on_home`.
- [x] Gerar um diff de dados antes de escrever no banco.
- [x] Separar o diff em produtos criados, atualizados, inativados e removidos do
      catálogo.
- [x] Confirmar manualmente qualquer alteração de preço.
- [x] Confirmar manualmente qualquer produto sem imagem.
- [x] Confirmar manualmente qualquer produto sem preço.
- [ ] Depois da atualização, revisar produtos ativos, produtos destacados na
      home, categorias e imagens quebradas.
