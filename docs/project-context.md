# Contexto do Projeto — Yumi Studio

## Objetivo

A Yumi Studio trabalha com impressão 3D sob encomenda.

O sistema deve centralizar informações hoje distribuídas em planilhas, reduzir trabalho operacional, automatizar cálculos e reutilizar dados compartilhados.

A primeira entrega pública é um catálogo online de produtos.

Esse catálogo é apenas uma interface do sistema. A visão do projeto é evoluir gradualmente para uma plataforma interna de gestão, sem antecipar módulos que ainda não resolvem problemas reais.

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

## Escopo atual

O foco atual é evoluir o catálogo temporário para uma aplicação persistente com administração.

### Em escopo

- catálogo público;
- persistência de produtos;
- área administrativa;
- autenticação de administradores;
- gerenciamento de produtos;
- gerenciamento de imagens;
- ativação/inativação de produtos;
- identificação de produtos que precisam de revisão;
- fundação necessária para futura precificação.

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

O catálogo temporário já trabalha com informações equivalentes a:

- identificação;
- nome;
- descrição;
- peso;
- preço público/final;
- imagens.

O modelo persistente deve suportar também:

- ativo/visível no catálogo;
- requer revisão.

O código atual deve ser inspecionado antes de assumir nomes ou tipos exatos.

### Ativação e inativação

Retirar um produto do catálogo não implica apagar o cadastro.

Quando houver valor operacional em manter o registro, utilizar inativação lógica.

Produtos inativos não aparecem no catálogo público.

---

## Revisão de produto

O sistema deve conseguir marcar produtos que precisam de revisão quando dados compartilhados relevantes forem alterados.

Exemplos de eventos futuros que podem exigir revisão:

- alteração de material;
- alteração ou exclusão de componente de custo;
- mudança de parâmetros de precificação.

A implementação deve permanecer simples.

Experiência desejada:

- o produto recebe uma flag de atenção;
- a flag fica visível na listagem do admin;
- produtos podem ser filtrados por essa situação;
- o usuário pode salvar o produto mesmo sem alterar outros campos;
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

Valores derivados devem ser calculados automaticamente sempre que isso reduzir trabalho e evitar inconsistências.

### Valores derivados esperados

- custo por grama;
- custo do material;
- custo da impressão;
- custo total;
- lucro;
- margem.

### Preço

O sistema deve distinguir, quando o módulo correspondente for implementado:

- preço sugerido calculado;
- preço final definido para venda.

O preço final pode ser diferente do preço sugerido.

No estágio atual, o preço público/final continua sendo um dado explícito do produto.

---

## Materiais

Materiais são informações reutilizáveis e devem existir de forma centralizada.

Dados já definidos para materiais incluem:

- nome;
- peso do rolo;
- custo do rolo;
- frete.

O custo por grama deve ser derivado desses dados, não informado manualmente.

Há uma referência operacional inicial de **R$ 28,00 de frete** para cálculo conservador. Isso não deve ser transformado em constante espalhada pelo código; quando o módulo for implementado, deve permanecer configurável conforme a modelagem adotada.

---

## Custos de impressão

A precificação futura poderá considerar:

- custo por hora da impressora;
- energia;
- tempo de impressão;
- perdas;
- peso/material utilizado.

A interface deve pedir somente os dados necessários para os cálculos realmente utilizados.

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

Quando a flexibilidade aumentar significativamente o esforço de cadastro, preferir opções explícitas mais simples.

---

## Catálogo público

O catálogo existe para permitir que clientes consultem produtos e preços sem precisar solicitar essas informações pelo Instagram.

Não é um e-commerce.

O catálogo deve permanecer focado em:

- produtos;
- imagens;
- descrição;
- preço;
- informações úteis à decisão do cliente.

Não introduzir carrinho, checkout, pagamentos ou conta de cliente sem decisão explícita.

---

## Administração

A área administrativa deve reduzir a necessidade de editar código ou planilhas para manter o catálogo.

Objetivo imediato:

- criar produto;
- editar produto;
- gerenciar imagens;
- alterar preço;
- alterar peso;
- ativar/inativar produto;
- identificar e concluir revisão de produtos.

Administradores não precisam de cadastro público.

Inicialmente, contas administrativas podem ser criadas de forma controlada no provider de autenticação.

---

## Stack conhecida

O frontend atual foi concebido com:

- React;
- TypeScript;
- Vite;
- Tailwind CSS;
- shadcn/ui;
- tema escuro;
- assets locais no catálogo temporário.

O repositório atual é a fonte de verdade para versões, dependências e estrutura efetivamente implementadas.

---

## Infraestrutura e custo

Supabase foi escolhido como provider atual para a próxima fase, cobrindo persistência, autenticação e storage enquanto o plano gratuito for suficiente para a operação atual.

O projeto deve evitar dependência estrutural do provider.

Antes de habilitar recursos que possam gerar cobrança, verificar custos e limites atuais.

A aplicação deve permanecer preparada para trocar, se necessário:

- backend;
- banco;
- autenticação;
- storage;
- hosting.

Essa portabilidade não elimina migração de schema, dados ou arquivos; ela deve evitar reescrever UI e regras de negócio.

---

## Migrations e fonte de verdade

A intenção atual é manter o Git como fonte de verdade da evolução do banco.

Alterações de schema devem ser representadas por migrations em:

```text
supabase/migrations/
```

RLS, policies, funções e triggers relacionadas ao schema devem ser versionadas quando aplicável.

Mudanças manuais no schema de produção devem ser evitadas quando uma migration for apropriada.

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
