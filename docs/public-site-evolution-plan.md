# Plano de evolução do site público

## Objetivo e fonte de verdade

Ampliar o site para apresentar a Yumi, demonstrar trabalhos reais e facilitar
encomendas, preservando o catálogo e a administração existentes.

As regras funcionais estão em `docs/project-context.md`. Este documento organiza
o trabalho aprovado em entregas e identifica definições necessárias. Não define
schema, ferramentas editoriais ou recursos como se já estivessem implementados.

## Ponto de partida

Inspeção do repositório em 2026-09-17:

- existem home, listagem de produtos, página de produto e administração;
- a home apresenta a marca e destaques do catálogo;
- o header possui links para início, produtos, Instagram e contato;
- o footer atual contém mensagens de marca, sem informações comerciais detalhadas;
- categorias, produtos e imagens já são administráveis;
- não existem rotas de Sobre, portfólio, encomendas ou novidades;
- peças de estudo e modelos ainda não produzidos possuem regras documentadas,
  mas ainda não têm representação específica implementada.

## Etapa 1: conteúdo e estrutura

Primeiro trabalho: preparar um roteiro de conteúdo e a organização das páginas.

- Reunir apresentação da Yumi, responsáveis, proposta e fotos do ateliê.
- Selecionar fotos reais de trabalhos e preparar legendas com contexto.
- Descrever o processo real de contato, avaliação, orçamento, produção e entrega.
- Levantar canais, condições e informações de atendimento e entrega já praticados.
- Escolher exemplos de produtos consolidados, modelos ainda não produzidos e
  peças de estudo para orientar a comunicação.
- Organizar navegação para início, catálogo, Sobre, trabalhos, encomendas e,
  quando disponível, novidades.

Critério de conclusão: roteiro de páginas e conteúdo inicial revisados, com
lacunas identificadas e sem promessas de serviços ou condições não praticados.

## Etapa 2: apresentação, trabalhos e contato

Primeira entrega pública, priorizando confiança e descoberta.

- Evoluir a home com apresentação, fotos reais, amostra de trabalhos, resumo do
  processo e caminhos para catálogo e encomendas.
- Criar a página Sobre e a apresentação de trabalhos reais.
- Completar navegação, incluindo acesso às páginas no mobile, e footer.
- Publicar informações comerciais disponíveis e manter o contato acessível.
- Revisar textos existentes para distinguir autoria dos modelos, trabalho de
  impressão e acabamento efetivamente realizados pela Yumi.

Critério de conclusão: o visitante entende quem é a Yumi, vê trabalhos reais e
consegue explorar o catálogo ou iniciar uma conversa em desktop e mobile.

Antes de implementar, definir a forma mínima de manutenção desse conteúdo.
Não pressupor um CMS ou novas telas administrativas para toda informação.

## Etapa 3: encomendas com contexto

- Criar um caminho próprio para quem tem referência e para quem quer ajuda.
- Permitir comunicar ideia, tema, referências e características relevantes.
- Diferenciar as necessidades de figures e decoração sem exigir conhecimento
  técnico do cliente.
- Inserir chamadas nas categorias para quem não encontrou a opção desejada.
- Preservar o tema ou categoria de origem no início do contato.
- Apresentar condições de viabilidade, aquisição de arquivo ou licença, prazo,
  pintura e acabamento junto da ação de contato.

Critério de conclusão: uma solicitação chega ao canal definido com contexto útil,
sem prometer produção ou orçamento antes da avaliação.

Definição pendente: canal de recebimento e necessidade de formulário, anexos ou
mensagem preparada. Não assumir armazenamento de solicitações ou gestão de pedidos.

## Etapa 4: ofertas ainda não produzidas e peças de estudo

- Definir o label público e a representação mínima das condições de produção.
- Distinguir peça ainda não produzida de peça em estudo: uma peça já impressa
  pode continuar em estudo por decisão da Yumi.
- Identificar imagens de referência e fotos reais, inclusive em galerias mistas.
- Exibir avisos relevantes próximos às imagens e ao contato, além da descrição.
- Permitir manter e encerrar manualmente a fase de estudo e definir o preço final.
- Organizar produtos por tipos, temas e universos usando as categorias existentes.

Critério de conclusão: o cliente compreende a condição da oferta; a administração
permite mantê-la sem encerramento automático por quantidade ou cálculo automático
de desconto e preço regular.

Definições pendentes: labels, identificação por imagem, campos administrativos e
apresentação do preço especial. Qualquer alteração de persistência deve ser
avaliada e documentada na arquitetura durante a implementação.

## Etapa 5: novidades e seleções dos estúdios

- Definir um formato simples para publicações e sua manutenção.
- Publicar seleções de modelos, lançamentos e trabalhos com autoria e condições claras.
- Relacionar uma publicação a produto ou encomenda quando houver sentido.
- Permitir começar com poucas publicações, sem frequência obrigatória.
- Definir o destaque na home para que a apresentação da Yumi e os trabalhos
  continuem relevantes mesmo com baixa frequência de atualização.

Critério de conclusão: uma seleção pode ser publicada sem cadastrar todos os
modelos como produtos e conduz o interessado a uma encomenda contextualizada.

## Limites e validação

Busca externa, importação e integração com plataformas de modelos foram retiradas
do plano. Carrinho, checkout, pagamentos, contas de clientes e gestão de pedidos
continuam fora do escopo.

As etapas representam ordem recomendada, não prazo ou obrigação de entregar todas
de uma vez. Conteúdo de uma etapa pode ser preparado enquanto outra é implementada.

Em cada entrega, validar navegação, contato, legibilidade, imagens e expectativas
do cliente em desktop e mobile, além de preservar catálogo e fluxos administrativos.
Executar os checks existentes aplicáveis; mudanças de regras ou persistência devem
receber testes focados no risco e atualização dos documentos correspondentes.
