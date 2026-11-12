# Contexto do Projeto — Yumi Studio

## Propósito

A Yumi Studio trabalha com impressão 3D sob encomenda.

O sistema deve centralizar informações hoje distribuídas em planilhas, reduzir trabalho operacional, automatizar cálculos e reutilizar dados compartilhados.

A primeira entrega pública é um catálogo online de produtos, mas o catálogo é apenas uma interface do sistema.

A visão é evoluir gradualmente para uma plataforma interna de gestão sem antecipar módulos que ainda não resolvem problemas reais.

---

## Filosofia do produto

Toda nova funcionalidade deve ser avaliada pela pergunta:

> Ela reduz trabalho, evita erros ou melhora a tomada de decisão?

Caso contrário, provavelmente não pertence ao sistema.

Prioridades:

1. simplicidade operacional;
2. redução de trabalho manual;
3. confiabilidade dos dados;
4. reutilização de informações;
5. evolução gradual;
6. baixa manutenção.

Entre soluções válidas, priorizar a que simplifica a operação e reduz esforço de cadastro e manutenção.

---

## Escopo da fase atual

A fase atual inclui a manutenção do catálogo persistente com administração e a
ampliação do site público para apresentar o estúdio, demonstrar trabalhos reais
e facilitar encomendas. A prioridade de evolução pública é conteúdo,
apresentação e caminhos de contato.

### Em escopo

- catálogo público;
- apresentação da Yumi e página Sobre;
- portfólio de peças produzidas;
- informações sobre atuação, encomendas e atendimento;
- caminho de encomenda a partir de ideias e referências;
- novidades e seleções de modelos dos estúdios assinados;
- persistência de produtos;
- área administrativa;
- autenticação de administradores;
- gerenciamento de produtos;
- gerenciamento de imagens;
- ativação e inativação de produtos;
- identificação de produtos que precisam de revisão;
- fundação necessária para evolução da precificação.

### Fora do escopo atual

- e-commerce;
- carrinho;
- checkout;
- pagamentos;
- pedidos;
- clientes;
- fila de produção;
- financeiro;
- relatórios;
- workflows complexos de aprovação.
- busca, importação ou integração com catálogos de plataformas externas de modelos.

Esses módulos podem existir no futuro, mas não devem ser antecipados sem necessidade concreta.

---

## Núcleo conceitual

O núcleo esperado do sistema inclui:

- produtos;
- precificação;
- materiais;
- componentes de custo;
- configurações.

As interfaces implementadas atualmente são:

- catálogo público;
- administração.

---

## Produtos

O catálogo trabalha com informações de produto como:

- identificação;
- nome;
- descrição;
- preço público/final;
- imagens;
- categorias.

O conceito de produto também inclui:

- ativo/visível no catálogo;
- exibir na home;
- requer revisão.

A forma técnica de persistir esses conceitos pertence à arquitetura e pode evoluir sem alterar a regra funcional.

### Modelos ainda não produzidos e peças de estudo

O catálogo pode incluir modelos ainda não produzidos pela Yumi, selecionados e
cadastrados manualmente, inclusive modelos que o estúdio já possui ou deseja
produzir. A oferta sob encomenda pode incluir impressão, pintura e acabamento.

Quando uma peça ainda não tiver sido produzida, essa condição deve ser informada
ao cliente, distinguindo imagens de referência de fotos reais da produção da
Yumi. A viabilidade e as condições de produção precisam ser avaliadas; o prazo
pode ser maior por envolver preparação e validação do processo.

Uma peça pode ser considerada internamente uma peça de estudo e receber um
valor especial durante essa fase. A fase de estudo não termina automaticamente
após a primeira unidade nem após uma quantidade fixa de encomendas: permanece
até a Yumi decidir que a peça está validada e seguirá no catálogo como oferta
consolidada. Essa decisão e a definição do preço regular são manuais.

A classificação interna de estudo não precisa ser exposta com esse nome ao
cliente, mas as condições relevantes da oferta devem ser claras. O valor
especial não implica desconto percentual automático nem preço regular derivado.

O nome do label público e a representação técnica dessa classificação ainda
não foram definidos.

### Ativação e inativação

Retirar um produto do catálogo não implica apagar o cadastro.

Quando houver valor operacional em manter o registro, utilizar inativação lógica.

Produtos inativos não aparecem no catálogo público.

### Destaques da home

Produtos podem ser marcados para exibição na seção de destaques da home.

A marcação de destaque não substitui a ativação do produto: produtos inativos
continuam fora do catálogo público mesmo quando marcados para home.

Quando nenhum produto ativo estiver marcado para home, a home pode usar uma
seleção simples dos primeiros produtos publicados para evitar uma seção vazia.

---

## Categorias de produto

Produtos podem possuir zero, uma ou múltiplas categorias.

Categorias são uma forma de organização e descoberta do catálogo. Elas ajudam o
cliente a encontrar produtos, mas não fazem parte das regras de precificação,
materiais, componentes de custo ou criação/fabricação de peças.

Categorias podem organizar produtos por tipo de peça, tema ou universo, como
decoração, Halloween e Resident Evil. A organização deve aproveitar as categorias
existentes, sem exigir hierarquia de franquias e subcategorias nesta etapa.

As categorias são texto livre, mas devem ser reutilizáveis para evitar cadastros
duplicados desnecessários.

Ao cadastrar ou editar um produto, a interface administrativa deve permitir:

- selecionar categorias existentes;
- buscar categorias existentes enquanto o usuário digita;
- criar uma nova categoria quando ela ainda não existir;
- evitar duplicatas evidentes causadas por variações de acento, caixa ou
  espaçamento, como `Decoração`, `decoração` e `decoracao`.

A administração possui uma tela de categorias (`/admin/categorias`) para renomear
e definir, trocar ou remover a imagem de cada categoria. Não há exclusão de
categorias pela interface; limpezas desse tipo podem ser feitas diretamente no
banco enquanto não houver necessidade real.

Renomear uma categoria altera seu slug, o que invalida links antigos com
`?categoria=`.

No catálogo público:

- a página do produto deve exibir as categorias associadas;
- a listagem de produtos pode exibir categorias se isso não prejudicar a
  clareza visual;
- a página de produtos deve permitir filtro por categoria;
- a busca da página de produtos deve ser genérica, considerando categorias além
  dos demais textos relevantes do produto;
- a lista pública de filtros deve exibir apenas categorias associadas a produtos
  ativos.

Na administração, a lista de categorias disponíveis para seleção deve considerar
todas as categorias existentes, mesmo que estejam associadas apenas a produtos
inativos.

---

## Revisão de produto

Produtos podem precisar de revisão quando informações compartilhadas relevantes à precificação forem alteradas.

Exemplos futuros de eventos que podem exigir revisão:

- alteração de material;
- alteração ou exclusão de componente de custo;
- mudança de parâmetros de precificação.

A experiência deve permanecer simples:

- o produto recebe uma flag de atenção;
- a flag fica visível na listagem administrativa;
- produtos podem ser filtrados por essa situação;
- o usuário pode concluir a revisão mesmo sem alterar outros campos;
- enquanto a flag estiver ativa, a ação principal de salvar pode ser apresentada como `Concluir revisão`;
- concluir a revisão limpa a flag.

Não há necessidade atual de:

- histórico de revisões;
- justificativa obrigatória;
- aprovação por múltiplas pessoas;
- workflow complexo.

---

## Precificação

O princípio central é separar dados primários de dados calculados.

O usuário deve informar somente os dados realmente necessários.

Valores derivados devem ser calculados automaticamente quando isso reduzir trabalho e evitar inconsistências.

### Valores derivados esperados

- custo por grama;
- custo do material;
- custo da impressão;
- custo total;
- lucro;
- margem.

### Preço sugerido e preço final

Quando o módulo correspondente estiver implementado, o sistema deve distinguir:

- preço sugerido calculado;
- preço final definido para venda.

O preço final pode ser diferente do preço sugerido.

Enquanto a lógica completa de precificação não estiver implementada, o preço público/final continua sendo um dado explícito do produto.

Produtos sem preço definido exibem "Sob encomenda" no card e na página do produto.

---

## Materiais

Materiais são informações reutilizáveis e devem existir de forma centralizada.

Dados já definidos para materiais incluem:

- nome;
- peso do rolo;
- custo do rolo;
- frete.

O custo por grama deve ser derivado desses dados, não informado manualmente.

Como referência operacional inicial, foi considerado frete de **R$ 28,00** para cálculo conservador.

Esse valor não deve ser tratado como regra imutável. Quando o módulo de materiais for implementado, ele deve poder ser alterado de acordo com a modelagem adotada.

---

## Custos de impressão

A precificação poderá considerar, conforme necessidade real:

- custo por hora da impressora;
- energia;
- tempo de impressão;
- perdas;
- peso/material utilizado.

A interface deve pedir somente os dados necessários para os cálculos efetivamente utilizados.

Não exigir detalhes de produção sem impacto em cálculo, catálogo ou tomada de decisão.

---

## Componentes de custo

Componentes compartilhados devem ser centralizados e reutilizados entre produtos.

Exemplos já considerados:

- cartão;
- chaveiro;
- adesivo;
- sacolinha;
- caixas;
- outros adicionais fixos.

Custos de trabalho manual, como pintura, também fazem parte da precificação futura.

Evitar duplicar valores compartilhados dentro de cada produto quando puderem ser referenciados.

---

## Cadastro de produto

O cadastro deve exigir o menor número possível de informações sem comprometer a confiabilidade do catálogo e da precificação.

Simplicidade operacional é mais importante do que representar perfeitamente todas as variações de fabricação.

Quando flexibilidade aumentar significativamente o esforço de cadastro, preferir alternativas explícitas mais simples.

---

## Site público e catálogo

O site deve apresentar a Yumi, demonstrar sua experiência e ajudar clientes a
descobrir produtos ou conversar sobre uma encomenda. O catálogo continua
permitindo consultar produtos e preços sem solicitar essas informações pelo
Instagram.

Não é um e-commerce.

O catálogo deve apresentar:

- produtos;
- imagens;
- descrição;
- preço;
- informações úteis à decisão do cliente.

A home e a página de produto também ajudam a descoberta e o contato:

- hero com peças em destaque;
- carrossel com todas as categorias de produtos ativos (levam a
  `/produtos?categoria=<slug>`); usa a imagem da categoria e, sem ela, a foto de
  um produto da categoria, sem repetir o mesmo produto em outra categoria;
- busca e filtro de categoria da página de produtos ficam na URL, e o botão
  voltar da página de produto retorna à origem (lista filtrada ou home);
- seção "Como encomendar", que informa que também são feitos modelos sob
  medida;
- selo "Novo" para produtos criados nos últimos 30 dias;
- produtos relacionados (categorias em comum) na página do produto;
- o botão de contato abre o Instagram e copia uma mensagem pronta com o
  produto e o link, pois o Instagram não aceita texto pré-preenchido.

Não introduzir carrinho, checkout, pagamentos ou conta de cliente sem decisão explícita.

### Apresentação e Sobre

A home deve apresentar o estúdio e oferecer caminhos claros para catálogo e
encomendas. A página Sobre deve apresentar quem está por trás da Yumi, o ateliê,
como atua e sua proposta, utilizando conteúdo e fotos reais. Capacidades atuais
devem ser distinguidas de planos e possibilidades ainda em desenvolvimento.

### Portfólio

Trabalhos já produzidos devem poder ser apresentados com fotos reais e contexto
sobre as peças, incluindo impressão, pintura e acabamento quando aplicáveis.
Portfólio demonstra experiência; catálogo apresenta ofertas. Um trabalho de
portfólio não precisa ser um produto à venda, embora possa ser relacionado a um.

### Encomendas por ideia ou referência

O cliente pode trazer um tema, personagem, referência ou necessidade. A Yumi
busca opções de modelos e avalia a produção, que pode incluir impressão, pintura
e acabamento. Esse serviço não implica oferta de modelagem exclusiva.

O caminho de encomenda deve atender tanto quem já possui uma referência quanto
quem deseja ajuda para encontrar uma opção. O cliente não precisa avaliar
detalhes técnicos dos arquivos; essa avaliação cabe à Yumi.

Ao explorar uma categoria, deve existir uma continuação para quem não encontrou
o que procura. O tema ou categoria de origem deve acompanhar o contato para
evitar que o cliente repita informações.

Para decoração, o levantamento deve considerar necessidade, uso, medidas,
estilo e referências conforme relevantes ao pedido.

As condições de encomenda devem esclarecer avaliação de viabilidade, definição
de tamanho e acabamento, prazo e eventual custo de aquisição do modelo ou
licença no orçamento. A licença aplicável deve ser verificada antes de oferecer
a produção. Imagens de referência não representam uma peça já produzida pela
Yumi nem garantem automaticamente o mesmo acabamento.

Não faz parte desta evolução direcionar a descoberta para catálogos externos
nem integrar buscas de plataformas de modelos. A seleção de ofertas publicadas
pela Yumi permanece manual; referências trazidas pelo cliente são aceitas.

### Novidades

A seção de novidades pode apresentar trabalhos, lançamentos, coleções e seleções
mensais de modelos dos estúdios assinados como possibilidades de encomenda.
Não há compromisso de frequência editorial.

Uma publicação não transforma automaticamente os modelos apresentados em
produtos do catálogo. As imagens e condições devem distinguir referências de
peças produzidas e ofertas já definidas. A autorização para uso das imagens e
produção comercial deve ser conferida conforme a licença do estúdio.

### Navegação e informações comerciais

O site deve possuir navegação consistente e footer com acesso a contato,
informações do estúdio e condições de encomenda, atendimento e entrega conforme
a operação real. A apresentação comercial mais completa não implica adoção de
carrinho ou checkout.

O plano de entrega desta evolução está em `docs/public-site-evolution-plan.md`.

---

## Administração

A área administrativa deve reduzir a necessidade de editar código ou planilhas para manter o catálogo.

Objetivos funcionais da fase atual:

- criar produto;
- editar produto;
- gerenciar imagens;
- adicionar imagens por seleção de arquivo ou arraste no formulário do produto;
- pré-visualizar imagens selecionadas antes de salvar o produto;
- reordenar imagens existentes por drag and drop (a primeira é a principal);
- ajustar o enquadramento de imagens existentes sem alterar o arquivo original;
- alterar preço;
- marcar/desmarcar exibição na home;
- ativar/inativar produto;
- identificar produtos que precisam de revisão;
- concluir revisão de produtos.

A listagem administrativa de produtos deve ser ordenada alfabeticamente pelo
nome para facilitar localização manual.

Não deve existir cadastro público de administradores sem decisão explícita.

---

## Evolução futura

Possíveis módulos futuros:

- pedidos;
- clientes;
- fila de produção;
- financeiro;
- relatórios.

Eles devem reutilizar o núcleo existente e evitar duplicação de informações.

A visão futura não implica implementação antecipada.
