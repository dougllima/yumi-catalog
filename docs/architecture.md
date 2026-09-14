# Arquitetura — Yumi Studio

## Propósito

Este documento registra a arquitetura e as decisões técnicas consolidadas do projeto.

Ele deve representar o estado técnico atual e as decisões vigentes, não funcionar como histórico de discussão.

O repositório é a fonte de verdade. Antes de alterar arquitetura, schema ou integrations:

1. inspecione o código atual;
2. verifique as migrations existentes;
3. confirme configurações externas relevantes quando elas não puderem ser inferidas pelo repositório;
4. atualize este documento quando uma decisão técnica relevante mudar.

Não documente arquitetura especulativa como se já estivesse implementada.

> **Status desta consolidação:** os detalhes concretos abaixo foram preservados do `architecture.md` que já existia no projeto. Eles ainda devem ser auditados contra o repositório pelo Codex no primeiro bootstrap para confirmar que a documentação corresponde ao código atual.

---

## Estado atual documentado

O projeto começou como um catálogo público temporário com frontend React/Vite e produtos definidos localmente.

A primeira estrutura persistente foi criada para utilizar Supabase e manter compatibilidade com o catálogo estático durante a transição.

O estado documentado inclui:

- SPA React/Vite;
- Supabase como provider de banco, Auth e Storage;
- abstrações internas para evitar dependência direta do provider na UI;
- persistência de produtos e imagens;
- autenticação administrativa;
- autorização via RLS/policies;
- seed dos produtos estáticos existentes;
- fallback estático para desenvolvimento sem configuração Supabase;
- deploy via GitHub Pages.

Configurações que vivem fora do repositório, como opções no Dashboard do Supabase ou GitHub, não devem ser assumidas como confirmadas somente porque estão documentadas aqui.

---

## Frontend

Stack documentada:

- React;
- TypeScript;
- Vite;
- Tailwind CSS;
- shadcn/ui.

A aplicação permanece uma SPA hospedável como arquivos estáticos.

Não introduzir SSR ou backend Node próprio sem necessidade concreta.

Preservar stack, padrões e comportamento existentes salvo motivo técnico ou funcional explícito para mudança.

---

## Provider atual

### Supabase

A primeira versão persistente utiliza Supabase para:

- banco Postgres;
- autenticação;
- Storage de imagens;
- autorização via RLS e policies.

A escolha permite atender a SPA sem backend Node próprio e concentrar dependências específicas de infraestrutura em adapters.

O Supabase é detalhe de infraestrutura.

Uma futura troca de provider pode exigir:

- novas migrations;
- transformação e migração de dados;
- migração de arquivos;
- novas regras de autorização;
- alterações de configuração.

Ela não deve exigir reescrever páginas, componentes ou regras de negócio.

### Custo

Na adoção inicial, o plano gratuito do Supabase foi considerado suficiente para o volume atual da Yumi Studio.

Limites de free tier são dados externos e podem mudar. Não tratá-los como contrato arquitetural permanente.

Antes de habilitar recursos que possam gerar cobrança ou tomar decisões baseadas em quota, verificar os limites atuais do provider.

---

## Fronteira de infraestrutura

A UI e a lógica de negócio não devem importar diretamente o client do Supabase.

A estrutura documentada segue:

```text
React UI / pages / hooks
        |
        v
ProductRepository   AuthService   MediaStorage
        |
        v
src/application/dependencies.ts
        |
        v
src/infrastructure/supabase/*
        |
        v
Supabase
```

Os componentes utilizam hooks e serviços compostos pela aplicação.

Dependências específicas do Supabase ficam concentradas na infraestrutura e no ponto de composição.

Não transformar essa separação em Clean Architecture cerimonial.

Não introduzir sem necessidade concreta:

- `CommandBus`;
- `QueryBus`;
- `UnitOfWork`;
- repositories genéricos;
- interfaces para cada use case;
- framework de dependency injection.

Prefira composição explícita e simples.

---

## Seleção do provider de dados

Existe suporte documentado a provider configurável por ambiente.

Para usar Supabase:

```env
VITE_DATA_PROVIDER=supabase
```

Sem a configuração necessária, existe fallback estático utilizando:

```text
src/data/products.ts
```

Esse fallback serve ao desenvolvimento e à transição.

Ele não deve se tornar uma segunda fonte de verdade permanente para produção depois que a persistência estiver estabilizada.

---

## Modelo de dados atual documentado

### `products`

Cadastro principal dos produtos.

Campos documentados:

- `id`: slug textual estável;
- `name`: nome exibido;
- `description`: descrição opcional;
- `weight_grams`: peso informado pelo usuário;
- `price_cents`: preço em centavos;
- `active`: controla visibilidade pública;
- `sort_order`: ordenação simples;
- `created_at`;
- `updated_at`.

Valores financeiros são persistidos em centavos inteiros para evitar problemas de floating point.

A UI continua apresentando valores em Real brasileiro.

### `product_images`

Metadados das imagens associadas aos produtos.

Campos documentados:

- `product_id`: produto dono da imagem;
- `storage_path`: caminho do arquivo no bucket;
- `alt_text`: texto alternativo;
- `sort_order`: ordem da galeria.

URLs públicas são derivadas pelo adapter de Storage e não persistidas como dado de domínio.

A imagem principal pode ser determinada pela ordenação enquanto não houver necessidade concreta de um campo dedicado.

### `admin_users`

Lista explícita de usuários autorizados a administrar o sistema.

Não existe cadastro público de administradores.

As contas são criadas no Supabase Auth e posteriormente autorizadas pela tabela `admin_users`.

---

## Requisito funcional ainda não refletido no modelo documentado

O contexto funcional possui o conceito de produto que **requer revisão** quando alterações em dados compartilhados impactarem sua precificação.

Esse conceito ainda não aparece no modelo persistente documentado acima.

Não assumir uma implementação técnica específica antes de verificar o código atual.

Quando essa feature for implementada, documentar aqui:

- representação persistente adotada;
- eventos que ativam a flag;
- forma de conclusão da revisão;
- impacto em queries e listagens administrativas.

---

## Banco e migrations

O Git é a fonte de verdade para evolução do schema.

Migrations ficam em:

```text
supabase/migrations/
```

A migration inicial documentada é:

```text
supabase/migrations/202609080001_init_products_admin.sql
```

Ela estabelece a estrutura inicial de produtos/admin e habilita RLS nas tabelas públicas.

Quando aplicável, alterações futuras devem versionar por migration:

- tabelas;
- índices;
- constraints;
- RLS;
- policies;
- funções;
- triggers.

Evitar alterações manuais no schema de produção quando uma migration for apropriada.

---

## Integração Supabase + GitHub

A configuração pretendida/documentada para integração com o repositório é:

- working directory na raiz do repositório;
- branch de produção `main`;
- migrations em `supabase/migrations/`.

Como parte dessa configuração vive fora do código, confirme no Supabase/GitHub antes de depender do deploy automático de migrations.

O campo de working directory deve apontar para o diretório que contém a pasta `supabase/`, e não para `supabase/migrations/`.

---

## Segurança

Segurança não pode depender apenas da UI.

RLS e policies fazem parte da arquitetura de segurança e devem ser tratadas como código.

### Público (`anon`)

Pode:

- consultar apenas produtos com `active = true`;
- consultar metadados/imagens necessárias desses produtos;
- acessar arquivos públicos necessários ao catálogo.

Não pode:

- criar produtos;
- editar produtos;
- excluir produtos;
- realizar upload;
- alterar ou remover mídia;
- executar operações administrativas.

### Usuário autenticado não administrador

Continua limitado às permissões públicas.

Autenticação, por si só, não concede permissão administrativa.

### Administrador

Somente usuários autorizados em `admin_users` podem executar operações administrativas permitidas pelas policies.

### Storage

O bucket documentado é:

```text
product-images
```

A leitura pública é permitida para suportar o catálogo.

Upload, update e delete exigem usuário autenticado e autorizado como administrador.

### Service role

Nunca utilizar `SUPABASE_SERVICE_ROLE_KEY` no frontend.

Ela é permitida apenas em scripts executados em ambiente confiável.

---

## Autenticação administrativa

Não deve existir signup público de administradores.

As contas são provisionadas de forma controlada no Supabase Auth e autorizadas em `admin_users`.

A aplicação deve tratar:

- login;
- logout;
- sessão persistida;
- sessão inválida ou expirada;
- proteção de rotas administrativas.

A proteção de rota no frontend não substitui RLS/policies.

Enquanto esse modelo for mantido, o signup público deve permanecer desabilitado no Supabase.

Como essa configuração vive no provider, ela precisa ser confirmada operacionalmente e não pode ser inferida apenas pelo repositório.

---

## Imagens e Storage

Imagens de produto devem ser administráveis sem alteração de código.

O acesso ao Storage permanece atrás de `MediaStorage` ou adapter equivalente.

Requisitos documentados:

- múltiplas imagens por produto;
- ordem definida;
- upload;
- remoção;
- `alt_text`;
- validação razoável;
- tratamento de falhas;
- prevenção de duplicação e arquivos órfãos quando possível sem complexidade excessiva.

Não implementar pipeline sofisticado de resize/compressão sem necessidade concreta.

---

## Migração dos produtos estáticos

Os produtos existentes não devem ser recadastrados manualmente.

O projeto documenta o comando:

```bash
npm run seed:products
```

O seed:

- importa `src/data/products.ts`;
- faz upsert por `id`;
- converte `price` em reais para `price_cents`;
- envia imagens de `public/products` para o bucket `product-images`;
- registra imagens por `storage_path`;
- evita duplicação em reexecuções.

O processo não apaga automaticamente produtos ou imagens que já existam no Supabase e tenham sido removidos da fonte estática.

Essa decisão evita perda acidental durante a migração.

O fallback estático e o seed são mecanismos de transição. Quando a persistência estiver consolidada, reavaliar sua necessidade antes de mantê-los indefinidamente.

---

## Configuração de ambiente

Manter `.env.example` atualizado.

Variáveis documentadas para desenvolvimento e seed:

```env
VITE_DATA_PROVIDER=supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PRODUCT_IMAGES_BUCKET=product-images
```

Somente variáveis `VITE_*` são destinadas ao bundle do navegador.

Variáveis frontend devem ser tratadas como públicas.

`SUPABASE_SERVICE_ROLE_KEY` nunca deve ser configurada no frontend hospedado.

O código documentado ainda aceita `VITE_SUPABASE_ANON_KEY` por compatibilidade, mas a variável preferida é:

```text
VITE_SUPABASE_PUBLISHABLE_KEY
```

---

## Configuração local

Fluxo operacional documentado:

1. criar/configurar o projeto Supabase;
2. aplicar as migrations;
3. criar manualmente o usuário administrador no Supabase Auth;
4. inserir seu `user_id` em `public.admin_users`;
5. configurar `.env.local`;
6. instalar dependências;
7. executar a aplicação.

Exemplo de autorização inicial:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'admin@yumi.example';
```

O e-mail acima é apenas exemplo e não deve ser tratado como configuração real.

---

## Hosting e deploy

O frontend permanece desacoplado do provider de hosting no nível da aplicação.

O provider documentado atualmente é **GitHub Pages**.

URL documentada:

```text
https://dougllima.github.io/yumi-catalog/
```

Configuração documentada:

- `vite.config.ts` usa `base: "/yumi-catalog/"`;
- `BrowserRouter` usa `basename={import.meta.env.BASE_URL}`;
- `.github/workflows/deploy.yml` gera `dist`;
- o workflow cria `dist/404.html` a partir de `dist/index.html` para suportar rotas diretas da SPA no GitHub Pages.

No GitHub, Pages deve usar:

```text
Settings > Pages > Source > GitHub Actions
```

Variáveis de deploy necessárias:

```env
VITE_DATA_PROVIDER=supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Não configurar `SUPABASE_SERVICE_ROLE_KEY` no ambiente do frontend.

GitHub Pages é o hosting atual/documentado, não uma dependência arquitetural do domínio.

Uma futura troca de hosting não deve exigir alteração de regras de negócio ou componentes centrais.

---

## Persistência do catálogo

O catálogo público deve consumir o mesmo núcleo persistente administrado internamente.

Produtos inativos não devem aparecer publicamente.

A aplicação deve tratar de forma compreensível:

- loading;
- falha de carregamento;
- imagens quebradas;
- indisponibilidade temporária do provider.

---

## Testabilidade

A separação por contracts deve permitir testar lógica da aplicação sem depender diretamente do Supabase.

Mocks, fakes ou implementação in-memory podem ser utilizados quando trouxerem benefício concreto.

Priorizar testes para:

- regras de negócio;
- mapping entre persistência e aplicação;
- contracts relevantes;
- comportamento crítico do admin;
- regressões.

Não testar detalhes internos do SDK do Supabase.

---

## Decisões técnicas ainda abertas

As decisões abaixo devem ser registradas somente quando forem efetivamente tomadas ou implementadas:

- modelagem persistente da flag `requer revisão`;
- modelagem de materiais;
- modelagem de componentes de custo;
- estratégia de precificação calculada;
- necessidade real de resize/compressão de imagens no cliente;
- necessidade de código server-side;
- eventual troca de provider de hosting;
- eventual remoção do fallback estático após estabilização da persistência.

Quando uma dessas decisões for consolidada, atualizar este documento removendo-a desta seção e descrevendo o estado adotado.
