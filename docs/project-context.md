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

A fase atual é a evolução do catálogo temporário para uma aplicação persistente com administração.

### Em escopo

- catálogo público;
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

Esses módulos podem existir no futuro, mas não devem ser antecipados sem necessidade concreta.

---

## Núcleo conceitual

O núcleo esperado do sistema inclui:

- produtos;
- precificação;
- materiais;
- componentes de custo;
- configurações.

As interfaces atuais são:

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

As categorias são texto livre, mas devem ser reutilizáveis para evitar cadastros
duplicados desnecessários.

Ao cadastrar ou editar um produto, a interface administrativa deve permitir:

- selecionar categorias existentes;
- buscar categorias existentes enquanto o usuário digita;
- criar uma nova categoria quando ela ainda não existir;
- evitar duplicatas evidentes causadas por variações de acento, caixa ou
  espaçamento, como `Decoração`, `decoração` e `decoracao`.

Não haverá gestão dedicada de categorias nesta etapa.

Renomeação, correção ou limpeza de categorias existentes pode ser feita
diretamente no banco enquanto não houver necessidade real de uma tela própria.

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

## Catálogo público

O catálogo existe para permitir que clientes consultem produtos e preços sem precisar solicitar essas informações pelo Instagram.

Não é um e-commerce.

Deve permanecer focado em:

- produtos;
- imagens;
- descrição;
- preço;
- informações úteis à decisão do cliente.

Não introduzir carrinho, checkout, pagamentos ou conta de cliente sem decisão explícita.

---

## Administração

A área administrativa deve reduzir a necessidade de editar código ou planilhas para manter o catálogo.

Objetivos funcionais da fase atual:

- criar produto;
- editar produto;
- gerenciar imagens;
- adicionar imagens por seleção de arquivo ou arraste no formulário do produto;
- pré-visualizar imagens selecionadas antes de salvar o produto;
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
