# AGENTS.md — Yumi Studio

## Papel deste arquivo

Este arquivo define como agentes de desenvolvimento devem trabalhar neste repositório.

O repositório é a fonte de verdade do projeto. Não dependa do histórico de conversas para preservar decisões que precisam continuar válidas em tarefas futuras.

Antes de alterações substanciais, leia:

- `docs/project-context.md`
- `docs/architecture.md`

Use:

- `AGENTS.md` para regras permanentes de atuação;
- `docs/project-context.md` para produto, regras de negócio, escopo e decisões funcionais;
- `docs/architecture.md` para arquitetura e decisões técnicas vigentes.

Quando uma decisão consolidada mudar, atualize o documento correspondente na mesma tarefa.

---

## Objetivo de atuação

O sistema da Yumi Studio existe para reduzir trabalho operacional, evitar erros, centralizar informações reutilizáveis e automatizar cálculos derivados.

Antes de propor ou implementar uma funcionalidade, considere:

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

Não trate automaticamente uma possibilidade discutida como decisão oficial.

Durante discussões:

- analise alternativas e trade-offs;
- diferencie fatos, hipóteses, interpretações e recomendações;
- não altere código apenas porque uma possibilidade foi mencionada;
- não registre hipóteses como regras consolidadas.

Quando a conversa resultar claramente em uma decisão que deve permanecer válida para tarefas futuras, registre-a no repositório antes de encerrar o assunto.

Se não estiver claro se a decisão foi realmente tomada, confirme com o usuário antes de registrá-la como fonte de verdade.

Ao registrar uma decisão:

- represente o estado consolidado atual;
- não transforme a documentação em histórico da conversa;
- remova ou ajuste informações anteriores que tenham se tornado incorretas;
- informe ao usuário qual documento foi atualizado e por quê.

---

## Princípios transversais

### Simplicidade operacional acima de flexibilidade

Prefira fluxos simples mesmo quando forem menos genéricos.

É aceitável representar opções como produtos separados em vez de criar um configurador complexo quando isso reduzir trabalho e manutenção.

### Dados primários e derivados

O usuário deve informar somente os dados realmente necessários.

Valores derivados devem ser calculados quando isso reduzir trabalho ou inconsistências.

Não persista valores derivados sem necessidade concreta, exceto quando houver motivo como snapshot histórico imutável.

### Centralização

Dados compartilhados por vários produtos devem possuir uma única fonte de verdade quando apropriado.

Evite duplicar informações reutilizáveis.

### Complexidade somente quando necessária

A arquitetura deve permitir evolução, mas funcionalidades e módulos futuros não devem ser implementados antecipadamente.

Não transforme o projeto em ERP ou sistema industrial sem necessidade real.

### Produtividade

O cadastro e a manutenção devem exigir o menor esforço possível sem comprometer a confiabilidade das informações.

Não exija detalhes de produção que não contribuam para cálculo, catálogo ou tomada de decisão.

---

## Arquitetura e padrões existentes

Antes de alterar arquitetura ou infraestrutura, leia `docs/architecture.md` e inspecione o código real.

Respeite as boundaries e decisões técnicas já estabelecidas, salvo motivo explícito para mudá-las.

Quando uma decisão arquitetural mudar:

1. justifique a mudança;
2. avalie o impacto;
3. atualize `docs/architecture.md`;
4. preserve o mínimo de alteração necessário.

Não replique neste arquivo detalhes de schema, provider, deploy ou estrutura que pertencem a `docs/architecture.md`.

---

## Decisões funcionais

Antes de alterar regras de negócio, escopo, conceitos de produto ou fluxos operacionais, leia `docs/project-context.md`.

Quando uma decisão funcional mudar:

1. confirme que ela está consolidada;
2. atualize `docs/project-context.md`;
3. ajuste ou remova regras anteriores que deixaram de ser válidas.

Não replique neste arquivo detalhes funcionais que pertencem a `docs/project-context.md`, exceto princípios transversais que orientam a implementação.

---

## Segurança

Não trate ocultação de UI como mecanismo de segurança.

Operações protegidas devem possuir autorização adequada na camada de infraestrutura correspondente.

Nunca exponha secrets em código frontend ou arquivos versionados.

---

## Qualidade e testes

Siga a estratégia existente no repositório.

Para correções de bugs:

1. reproduza o problema quando razoável;
2. identifique a causa;
3. corrija pontualmente;
4. adicione proteção contra regressão quando trouxer valor.

Priorize testes para:

- regras de negócio;
- transformações e mapping relevantes;
- contracts independentes de provider;
- comportamento crítico do admin;
- regressões.

Não teste detalhes internos de SDKs de terceiros.

Não contorne erros de TypeScript com `any`, `@ts-ignore` ou desativação de lint sem justificativa concreta.

Antes de concluir mudanças relevantes, execute os checks aplicáveis existentes no projeto. Quando disponíveis:

```bash
npm run lint
npm run test
npm run build
```

Relate apenas resultados realmente executados.

---

## Disciplina de escopo

Implemente apenas o escopo solicitado e o que for estritamente necessário para suportá-lo.

Se encontrar technical debt não relacionado:

- registre quando relevante;
- não corrija automaticamente.

Não use uma feature localizada como justificativa para refactor amplo.

---

## Documentação como fonte de verdade

Atualize `docs/project-context.md` quando houver mudança consolidada em:

- regra de negócio;
- comportamento esperado;
- escopo;
- conceito de produto;
- fluxo operacional;
- requisito funcional.

Atualize `docs/architecture.md` quando houver mudança consolidada em:

- estrutura técnica;
- schema;
- boundaries;
- contracts;
- adapters;
- persistência;
- autenticação;
- storage;
- integrations;
- deployment;
- decisão técnica relevante para tarefas futuras.

Atualize `AGENTS.md` somente quando mudar:

- a forma como agentes devem trabalhar;
- uma constraint permanente de implementação;
- uma regra transversal válida para o projeto inteiro.

Não documente:

- detalhes triviais facilmente compreendidos pelo código;
- tentativas descartadas;
- hipóteses não confirmadas;
- histórico da discussão;
- possibilidades futuras sem decisão tomada.

---

## Antes de concluir uma tarefa

Verifique:

1. a implementação ou discussão mudou alguma regra ou decisão permanente?
2. `docs/project-context.md` ainda representa corretamente o produto?
3. `docs/architecture.md` ainda representa corretamente as decisões técnicas?
4. alguma regra deste `AGENTS.md` ficou obsoleta?
5. os checks aplicáveis foram executados?

No relatório final, informe:

- o que mudou;
- decisões relevantes;
- migrations ou configuração necessárias;
- documentos atualizados e o motivo;
- validações realmente executadas;
- riscos ou pendências reais.

Não transforme possibilidades futuras em bloqueadores atuais.
