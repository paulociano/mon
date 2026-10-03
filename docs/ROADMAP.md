# MON — Roadmap sequencial de produto e aprendizagem

> Roadmap operacional do MON. A ordem é por dependência, risco e ganho de aprendizagem, não por calendário fixo.
> Cada etapa deve preservar os budgets de performance, o modo offline e os gates pedagógicos existentes.

## Norte do produto

Levar alguém que fala português/inglês e chegou ao Japão do zero de dependência quase total para autonomia funcional crescente.

A vantagem do MON não deve ser “mais exercícios”. Ela deve vir da combinação de:

- progressão por domínio demonstrado;
- memória espaçada e correção dirigida por erros;
- narrativa recorrente e memória episódica;
- transferência para situações reais;
- leitura, escuta, produção e fala intercaladas;
- explicações PT-first que ensinam modelos mentais, não traduções literais;
- shell rápido, features lazy e funcionamento offline.

## O que já está construído

- Fundação Zero;
- trilha gamificada e progressão por domínio;
- SRS unificado;
- Caderno de Erros;
- Mastery Graph;
- Gate Loop: Discover → Recall → Transfer → Produce;
- currículo N5 prático;
- Kanji Atlas;
- Missões, leitura, fala e escrita;
- rede narrativa N5 recorrente;
- Diário no Japão com estado persistente;
- Practice Hub adaptativo;
- Performance Lab local;
- arquitetura lazy por dados, features e UI;
- quality gate com contratos pedagógicos, performance e PWA.

## Sequência de melhorias

### 1. Home adaptativa — próxima melhor ação
**Status:** em implementação.

**Objetivo:** a Home escolhe uma prioridade principal em vez de apresentar vários sistemas concorrentes.

Sinais disponíveis no shell:
- remediation / domínio insuficiente;
- revisões vencendo;
- energia;
- erros recorrentes;
- episódio narrativo pendente;
- próximo nó da trilha.

Política inicial:
1. reforço obrigatório;
2. memória vencendo;
3. prática livre quando Energia acabou;
4. correção de erros recorrentes;
5. transferência narrativa pendente;
6. avanço normal.

**Critério de aceite:** sempre existe uma ação principal explicável e acionável, sem carregar features pesadas para decidir.

### 2. Next Best Lesson Engine
**Dependência:** Home adaptativa estável.

**Objetivo:** evoluir de uma decisão de Home para um motor capaz de montar a próxima sessão a partir da evidência real do aluno.

Entradas:
- SRS;
- Mastery Graph;
- erro recorrente;
- histórico por método;
- narrativa;
- tempo desde a última exposição;
- modalidade subpraticada.

Saída:
- receita da sessão;
- objetivo explícito;
- mistura de modalidades;
- razão de cada bloco;
- condição de progressão.

**Critério de aceite:** duas pessoas no mesmo nó podem receber ordens de prática diferentes quando as evidências forem diferentes.

### 3. Daily Loop adaptativo
**Dependência:** Next Best Lesson Engine.

**Objetivo:** transformar “estudar japonês” num circuito diário curto, consistente e explicável.

Modelo:
1. aquecer memória;
2. aprender uma ideia;
3. aplicar;
4. reencontrar conteúdo antigo;
5. produzir sem pista;
6. registrar domínio e próxima ação.

O tamanho da sessão deve responder ao estado do aluno, não a uma quantidade fixa universal de exercícios.

### 4. Listening & Pronunciation Lab
**Dependência:** engine capaz de solicitar blocos específicos de listening/fala.

Adicionar:
- pares mínimos relevantes;
- duração de mora;
- vogais longas;
- っ pequeno;
- ん;
- shadowing escalonado;
- ditado curto;
- contraste áudio → produção;
- autoavaliação guiada;
- reconhecimento de voz usado como evidência textual, não como avaliação fonética clínica.

**Métrica:** recuperação correta após espaçamento e transferência para roleplay.

### 5. Kanji Memory Lab 2.0
**Dependência:** motor adaptativo e SRS consolidados.

Adicionar:
- famílias visuais;
- componentes recorrentes;
- contraste entre kanji confundíveis;
- significado → forma;
- forma → leitura em contexto;
- produção sem modelo;
- kanji dentro de episódios narrativos;
- alternância entre reconhecimento e escrita.

**Non-goal:** tratar listas não oficiais como “lista oficial JLPT” ou depender apenas de mnemônicas.

### 6. Survival Missions 2.0
**Dependência:** Listening Lab + rede narrativa.

Transformar missões em tarefas com pequenas ramificações e reparo de conversa.

Cenários prioritários:
- estação e trem;
- konbini;
- restaurante;
- endereço e entrega;
- trabalho;
- clínica;
- prefeitura/serviços;
- telefone;
- emergência/desastre.

Cada missão deve exigir:
- entender intenção;
- responder;
- reparar quando não entende;
- completar uma tarefa observável.

### 7. Auditoria profunda do N5
**Dependência:** engines e modalidades estabilizados.

Antes de ampliar o volume:
- revisar cobertura funcional;
- aumentar variedade de exemplos;
- fechar lacunas de partículas, verbos, adjetivos, tempo, contadores e serviços;
- ampliar leitura funcional;
- garantir reaparição em múltiplos contextos;
- auditar densidade de vocabulário novo por sessão;
- verificar que cada habilidade importante aparece em recall e transferência.

**Gate:** qualidade de retenção e transferência deve justificar expansão.

### 8. N4 por capacidades
**Dependência:** N5 profundo validado.

Expandir por capacidades, não por quantidade:
- narrar eventos com mais detalhe;
- explicar motivo e contraste;
- planejar;
- compreender instruções maiores;
- trabalhar com serviços e rotina profissional;
- ler textos funcionais mais longos;
- aumentar complexidade gramatical e kanji contextual.

Reusar os mesmos motores. Não criar um segundo sistema pedagógico paralelo.

### 9. Métricas de aprendizagem
**Dependência:** motores estáveis + telemetria local.

Separar:
- atividade: XP, sessões e streak;
- retenção: acerto após espaçamento;
- domínio: evidência por habilidade;
- transferência: resolução em contexto novo;
- reparo: recuperação de erro recorrente;
- autonomia: missões completadas com menos pistas.

A Home e o Next Best Lesson devem otimizar aprendizagem, não atividade.

### 10. Performance por latência observada
**Dependência:** Performance Lab existente.

Além dos budgets de bytes:
- boot p50/p95;
- feature load p50/p95;
- view transition p50/p95;
- long tasks;
- comportamento de cache;
- tempo até lição interativa.

Definir budgets de latência somente depois de coletar baseline real em navegadores/dispositivos representativos.

### 11. UI/UX de alta fidelidade
**Pode avançar em paralelo, sem quebrar os gates.**

Superfícies prioritárias:
1. Home adaptativa;
2. Lesson UI;
3. Practice Hub;
4. Japan Journal;
5. Mission UI;
6. Listening Lab;
7. Kanji Lab.

Regras:
- uma ação principal por superfície;
- estados vazios úteis;
- feedback imediato;
- foco de teclado;
- reduced motion;
- touch targets adequados;
- mobile-first para estudo rápido;
- animação ambiente discreta.

### 12. Robustez antes de escala
- migração/versionamento de estado local;
- export/import do progresso;
- recuperação de estado corrompido;
- estratégia de atualização do Service Worker;
- testes de upgrade entre versões;
- auditoria de acessibilidade;
- testes cross-browser;
- smoke test offline;
- política clara para microfone.

### 13. Conta e sync
**Somente depois do modelo local estar estável.**

- autenticação;
- sync entre dispositivos;
- resolução de conflitos;
- backup;
- privacidade;
- migração do estado local para conta sem perda.

## Ordem operacional imediata

1. Concluir Home adaptativa + testes de prioridade.
2. Criar Next Best Lesson Engine como seam profundo.
3. Fazer o Daily Loop consumir esse engine.
4. Construir Listening & Pronunciation Lab.
5. Evoluir Kanji Memory Lab.
6. Transformar Survival Missions em tarefas ramificadas.
7. Auditar N5 completo.
8. Expandir para N4 somente depois dos gates anteriores.
9. Definir budgets de latência com dados reais do Performance Lab.
10. Executar hardening de estado/PWA/acessibilidade antes de escala.

## Guardrails permanentes

- Não avançar apenas porque uma atividade foi concluída quando o resultado exige domínio.
- Não aumentar conteúdo se isso piorar o caminho crítico.
- Não usar gamificação para esconder dívida pedagógica.
- Não criar scores de pronúncia com precisão que a tecnologia disponível não suporta.
- Não misturar PT/EN/Japonês sem função pedagógica explícita.
- Não ensinar por tradução literal quando um modelo mental melhor estiver disponível.
- Não expandir N4/N3 antes de provar que o motor reutiliza bem o N5.
- Toda melhoria relevante deve entrar em CI com contrato observável quando isso for viável.
