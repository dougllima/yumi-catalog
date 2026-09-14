# AGENTS.md — Yumi Studio

## Papel deste arquivo

Este arquivo define como agentes de desenvolvimento devem trabalhar neste repositório.

O repositório é a fonte de verdade do projeto. Não dependa do histórico de conversas para preservar decisões que precisam continuar válidas em tarefas futuras.

Antes de alterações substanciais, leia:

- `docs/project-context.md`
- `docs/architecture.md`

Esses documentos representam, respectivamente:

- contexto funcional e regras consolidadas do produto;
- arquitetura e decisões técnicas vigentes.

Quando uma decisão consolidada mudar, atualize o documento correspondente na mesma tarefa.

---

## Objetivo do projeto

A Yumi Studio trabalha com impressão 3D sob encomenda.

O sistema deve reduzir trabalho operacional, evitar erros, centralizar informações reutilizáveis e automatizar cálculos derivados.

A primeira interface pública é um catálogo online, mas o sistema deve ser concebido como uma plataforma interna de gestão que evolui gradualmente.

Antes de implementar uma funcionalidade, considere:

> Isso reduz trabalho, evita erros ou melhora a tomada de decisão?

Se não houver benefício concreto, provavelmente a funcionalidade não pertence ao sistema.

---

## Forma de trabalho

Trate requisitos, ideias e soluções propostas como hipóteses a serem verificadas, não como fatos incontestáveis.

Antes de implementar:

1. inspecione a implementação atual;
2. compreenda o comportamento existente;
3. identifique o problema real;
4. confirme entradas, saídas e constraints;
5. escolha a menor alteração suficiente;
6. implemente;
7. valide casos relacionados e possíveis regressões.

Não redesenhe a aplicação por causa de um problema localizado.

Não introduza abstrações, camadas, dependências ou patterns sem resolver um problema concreto.

Entre soluções válidas, prefira a que:

- exige menos manutenção;
- reduz mais trabalho operacional;
- altera menos o sistema existente;
- é mais fácil de compreender;
- resolve o problema atual sem antecipar necessidades hipotéticas.

Problemas adjacentes podem ser apontados, mas não devem ser corrigidos automaticamente se não fizerem parte do escopo ou não bloquearem a tarefa.

---

## Discussões e consolidação de decisões

Conversas com o usuário podem envolver exploração de alternativas, hipóteses, brainstorming ou decisões ainda não consolidadas.

Não trate automaticamente uma ideia discutida como decisão oficial.

Durante discussões:

- analise alternativas e trade-offs;
- diferencie fato, hipótese, interpretação e recomendação;
- não altere código apenas porque uma possibilidade foi mencionada;
- não registre hipóteses como regras consolidadas.

Quando a conversa resultar claramente em uma decisão que deve permanecer válida para tarefas futuras, registre-a no repositório antes de encerrar o assunto.

Use:

- `docs/project-context.md` para regras de negócio, escopo, conceitos e decisões funcionais;
- `docs/architecture.md` para decisões técnicas, schema, boundaries, integrations e infraestrutura;
- `AGENTS.md` somente para regras permanentes sobre como agentes devem atuar.

Se não estiver claro se uma decisão foi realmente tomada, confirme com o usuário antes de registrá-la como fonte de verdade.

Ao registrar uma decisão:

- represente o estado consolidado atual;
- não transforme a documentação em histórico da conversa;
- remova ou ajuste informações anteriores que tenham se tornado incorretas;
- informe no relatório final qual documento foi atualizado e por quê.

---

## Princípios de produto

### Simplicidade operacional acima de flexibilidade

Prefira fluxos simples mesmo quando forem menos genéricos.

É aceitável cadastrar produtos separados em vez de criar um configurador complexo quando isso tornar a operação mais simples.

### Informar somente dados primários

O usuário deve informar somente os dados realmente necessários.

Valores derivados devem ser calculados sempre que isso reduzir trabalho ou inconsistências.

Exemplos:

- custo por grama;
- custo do material;
- custo da impressão;
- custo total;
- lucro;
- margem.

Não persista valores derivados sem necessidade concreta, exceto quando houver motivo como snapshot histórico imutável.

### Centralizar informações reutilizáveis

Dados compartilhados por vários produtos devem possuir uma única fonte de verdade quando apropriado.

Exemplos:

- materiais;
- componentes de custo;
- categorias;
- parâmetros de precificação.

Evite copiar informações reutilizáveis para dentro de cada produto.

### Complexidade somente quando necessária

A arquitetura deve permitir evolução, mas módulos futuros não devem ser implementados antecipadamente.

Possíveis módulos futuros incluem:

- pedidos;
- clientes;
- fila de produção;
- financeiro;
- relatórios.

A possibilidade de existirem no futuro não justifica infraestrutura sem uso atual.

### Priorizar produtividade

O cadastro de produto deve exigir o menor número possível de informações sem comprometer a confiabilidade da precificação e do catálogo.

Não exija detalhes de fabricação que não contribuam para cálculo, catálogo ou tomada de decisão.

---

## Escopo conceitual

### Núcleo

- produtos;
- precificação;
- materiais;
- componentes de custo;
- configurações.

### Interfaces

- catálogo público;
- administração.

O catálogo é uma interface do sistema, não o sistema inteiro.

---

## Catálogo público

O catálogo público não é um e-commerce.

Não introduza sem solicitação explícita:

- carrinho;
- checkout;
- pagamentos;
- conta de cliente.

Preserve o comportamento e o visual existentes quando a tarefa não exigir mudanças.

Somente produtos destinados à exibição pública devem aparecer no catálogo.

---

## Administração

A área administrativa existe para reduzir manutenção manual do catálogo e dos dados operacionais.

Prefira formulários e fluxos explícitos a mecanismos genéricos de configuração.

Operações administrativas devem ser protegidas por autenticação e também por autorização no backend, banco e storage.

Não considere esconder elementos da UI como mecanismo de segurança.

---

## Revisão de produto

O projeto possui o conceito de produto que pode exigir revisão quando informações compartilhadas relevantes à precificação forem alteradas.

Mantenha o mecanismo simples.

Um produto pode possuir um estado equivalente a `requer revisão`.

Quando esse estado estiver ativo:

- ele deve ser facilmente identificável e filtrável no admin;
- o fluxo normal de salvar pode assumir o papel de `Concluir revisão`;
- concluir a revisão limpa a flag.

Não crie workflow de aprovação, histórico de revisão ou justificativas sem necessidade explícita.

---

## Arquitetura

Antes de alterar arquitetura ou infraestrutura,
leia `docs/architecture.md`.

Respeite as boundaries e decisões técnicas ali documentadas.

Não introduza abstrações, layers ou patterns adicionais
sem necessidade concreta.

---

## Portabilidade de provider

O provider atual é Supabase, mas o código da aplicação não deve ficar desnecessariamente acoplado a ele.

Uma futura troca deve impactar principalmente:

- adapters;
- configuração;
- migrations;
- migração de dados;
- migração de arquivos;
- regras específicas de segurança.

Não tente abstrair todas as capacidades do banco.

O objetivo é evitar reescrever UI e lógica de negócio, não tornar uma migração de provider sem custo.

---

## Supabase

Quando Supabase estiver sendo utilizado:

- alterações de schema devem ser versionadas em migrations;
- migrations devem ficar em `supabase/migrations/`;
- RLS e policies devem ser versionadas quando aplicável;
- evite mudanças manuais de schema em produção quando uma migration for apropriada;
- nunca faça commit de secrets ou `service_role`;
- chaves públicas usadas pela SPA não devem ser tratadas como segredo;
- segurança deve depender de autenticação, RLS e policies, não de ocultar keys.

O Git deve ser a fonte de verdade para a evolução do schema.

Antes de assumir detalhes de configuração do projeto Supabase, verifique a configuração real do repositório e do ambiente.

---

## Hosting

Prefira manter o frontend como aplicação React/Vite capaz de ser hospedada como arquivos estáticos enquanto isso atender ao problema.

Não introduza SSR ou backend Node próprio apenas para intermediar operações que o provider escolhido consegue executar com segurança.

Hosting deve permanecer substituível sem redesenho da aplicação.

---

## Frontend

Preserve tecnologias e padrões existentes salvo motivo concreto para mudança.

Stack esperada atualmente:

- React;
- TypeScript;
- Vite;
- Tailwind CSS;
- shadcn/ui quando apropriado.

Antes de assumir versões ou dependências, inspecione `package.json` e o código atual.

Não substitua a stack apenas por preferência técnica.

---

## Valores monetários

Evite problemas de floating point.

Quando apropriado, prefira valores monetários em unidade mínima inteira, como centavos.

Na UI, valores devem permanecer naturais para Real brasileiro.

---

## Imagens e mídia

Imagens de produto devem ser administráveis sem alteração de código.

O acesso ao storage deve permanecer atrás de uma boundary interna.

Evite APIs específicas do provider espalhadas pela aplicação.

Considere de forma prática:

- múltiplas imagens;
- ordenação;
- imagem principal;
- upload;
- remoção;
- validação;
- prevenção razoável de arquivos órfãos.

Não implemente pipeline complexo de mídia sem necessidade demonstrada.

---

## Exclusão e inativação

Prefira inativação lógica quando manter o registro tiver valor operacional.

Não exclua permanentemente dados de negócio apenas para removê-los do catálogo, salvo quando exclusão definitiva for realmente a intenção.

---

## Erros

Não esconda erros operacionais silenciosamente.

No admin, forneça feedback suficiente para:

- falha ao carregar;
- falha ao salvar;
- falha em upload;
- sessão expirada;
- indisponibilidade do serviço.

Não crie uma plataforma de observabilidade complexa sem necessidade.

---

## Testes

Siga a estratégia já existente no repositório.

Em correções de bugs, reproduza o problema quando razoável e adicione proteção contra regressão quando isso trouxer valor.

Priorize testes para:

- regras de negócio;
- transformações e mapping;
- contracts independentes de provider;
- comportamento importante do admin;
- regressões.

Não teste detalhes internos de SDKs de terceiros.

Antes de concluir mudanças relevantes, execute os checks existentes. Quando disponíveis:

```bash
npm run lint
npm run test
npm run build
```

Relate somente resultados realmente executados.

Nunca diga que um comando passou sem tê-lo executado com sucesso.

---

## Qualidade TypeScript

Não contorne erros usando:

- `any`;
- `@ts-ignore`;
- desativação de lint;

salvo justificativa concreta e documentada.

Prefira corrigir o problema de typing.

---

## Configuração de ambiente

Mantenha configuração dependente de ambiente fora da lógica da aplicação.

Atualize `.env.example` quando novas variáveis forem necessárias.

Nunca faça commit de secrets.

Lembre que variáveis incluídas no bundle da SPA são visíveis no navegador.

---

## Disciplina de escopo

Implemente apenas o escopo solicitado e o que for estritamente necessário para suportá-lo.

Se encontrar technical debt não relacionado:

- registre quando relevante;
- não corrija automaticamente.

Não use uma feature pequena como justificativa para refactor amplo.

---

## Documentação como fonte de verdade

Ao realizar uma mudança relevante, verifique explicitamente se ela altera alguma decisão documentada ou introduz uma nova decisão que tarefas futuras precisarão conhecer.

Atualize `docs/project-context.md` quando houver mudança em:

- regra de negócio;
- comportamento esperado;
- escopo;
- conceito de produto;
- fluxo operacional;
- requisito funcional consolidado.

Atualize `docs/architecture.md` quando houver mudança em:

- estrutura técnica;
- schema;
- boundaries;
- contracts;
- adapters;
- persistência;
- autenticação;
- storage;
- integration;
- deployment;
- decisão técnica relevante que afete futuras implementações.

Atualize `AGENTS.md` somente quando mudar:

- a forma como os agentes devem trabalhar;
- uma constraint permanente de implementação;
- uma regra transversal válida para o projeto inteiro.

Não documente:

- detalhes triviais de implementação;
- decisões locais facilmente compreendidas pelo código;
- tentativas descartadas;
- hipóteses não confirmadas;
- histórico da discussão;
- possibilidades futuras sem decisão tomada.

A documentação deve representar o estado consolidado atual.

---

## Antes de concluir uma tarefa

Verifique:

1. a implementação ou discussão mudou alguma regra ou decisão permanente?
2. `docs/project-context.md` ainda representa corretamente o produto?
3. `docs/architecture.md` ainda representa corretamente o sistema e as decisões técnicas?
4. alguma regra deste `AGENTS.md` ficou obsoleta?
5. lint, testes e build aplicáveis foram executados?

Se a resposta exigir atualização, faça-a antes de concluir a tarefa.

No relatório final, informe:

- o que mudou;
- decisões relevantes;
- migrations ou configuração necessárias;
- documentos atualizados e o motivo;
- validações realmente executadas;
- riscos ou pendências reais.

Não transforme possibilidades futuras em bloqueadores atuais.
