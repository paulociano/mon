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

### 1. Home adaptativa — próxima melhor ação ✅
**Status:** implementada e coberta pelo Quality Gate.

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

### 2. Next Best Lesson Engine ✅
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

### 3. Daily Loop adaptativo ✅
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

### Vídeos de apoio ✅
**Status:** biblioteca lazy adicionada com player externo apenas no clique.

Objetivo:
- reforçar listening, speaking, reading e writing com apoio visual;
- manter o caminho crítico limpo;
- priorizar fontes confiáveis;
- nunca transformar vídeo em substituto de recuperação ativa.

### 4. Listening & Pronunciation Lab ✅
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

### 5. Kanji Memory Lab 2.0 ✅
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

### 6. Survival Missions 2.0 ✅
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

### 7. Auditoria profunda do N5 — gate estrutural concluído ✅
**Dependência:** engines e modalidades estabilizados.

**Decisão:** o N5 está estruturalmente pronto para sustentar a expansão por capacidades do N4. O gate executável cobre escala, cobertura funcional, densidade lexical, orçamento de vocabulário novo, reaparição, variedade de cenários críticos, recall + transfer + roleplay e capacidades gramaticais essenciais.

A validação de **retenção, transferência e autonomia reais** continua longitudinalmente e não deve ser confundida com completude estrutural do currículo.

Fonte de verdade do gate: [N5 Readiness](N5-READINESS.md).

**Gate:** se `test-n5-scale.mjs` ou `test-n5-depth.mjs` falhar, a expansão curricular relacionada volta a ficar bloqueada.

### 8. N4 por capacidades — contrato implementado ✅
**Dependência:** N5 profundo validado.

**Decisão:** o N4 passa a ser governado por cinco capacidades funcionais observáveis — repair, confirm, explain, negotiate e summarize — com contrato explícito por unidade e validação no CI. Fonte de verdade: [N4 Capability Contract](N4-CAPABILITIES.md).

Expandir por capacidades, não por quantidade:
- narrar eventos com mais detalhe;
- explicar motivo e contraste;
- planejar;
- compreender instruções maiores;
- trabalhar com serviços e rotina profissional;
- ler textos funcionais mais longos;
- aumentar complexidade gramatical e kanji contextual.

Reusar os mesmos motores. Não criar um segundo sistema pedagógico paralelo.

### 9. Métricas de aprendizagem — camada semântica implementada ✅

### 9.2 Validação longitudinal da aprendizagem — implementada ✅

### 9.3 Calibração longitudinal do Next Best Lesson — implementada ✅
**Dependência:** motores estáveis + telemetria local.

**Decisão:** atividade, retenção, domínio, transferência, reparo e autonomia agora possuem definições operacionais, denominadores e status de qualidade da amostra. Fonte de verdade: [Learning Metrics](LEARNING-METRICS.md).

Separar:
- atividade: XP, sessões e streak;
- retenção: acerto após espaçamento;
- domínio: evidência por habilidade;
- transferência: resolução em contexto novo;
- reparo: recuperação de erro recorrente;
- autonomia: missões completadas com menos pistas.

A Home e o Next Best Lesson devem otimizar aprendizagem, não atividade.

**P9.2:** retenção 1d+/3d+/7d+, dependência de pistas, transferência, autonomia e recuperação de erros recorrentes agora possuem relatório longitudinal local. Fonte de verdade: [Learning Validation](LEARNING-VALIDATION.md).

**P9.3:** o Next Best Lesson usa apenas sinais longitudinais com amostra observada para frear avanço quando retenção 7d+ ou transferência permanecem frágeis. Dívidas pedagógicas diretas continuam tendo prioridade. Fonte de verdade: [NBL Calibration](NBL-CALIBRATION.md).

### 10. Performance por latência observada — instrumentação implementada ✅
**Dependência:** Performance Lab existente.

**Decisão:** o MON passa a registrar distribuições p50/p95 para boot, features, views e tempo até lição interativa, com baseline reproduzível em CI. Fonte de verdade: [Latency Observability](LATENCY-OBSERVABILITY.md).

Além dos budgets de bytes:
- boot p50/p95;
- feature load p50/p95;
- view transition p50/p95;
- long tasks;
- comportamento de cache;
- tempo até lição interativa.

Definir budgets de latência somente depois de coletar baseline real em navegadores/dispositivos representativos.

### 11. UI/UX de alta fidelidade — primeira fatia P8 implementada ✅
**Pode avançar em paralelo, sem quebrar os gates.**

**Fatia atual:** Home, Lesson e Practice receberam refinamento responsivo; a Fundação Zero ganhou variação determinística entre lições iniciais; energia inicial sobe para 30 e passa a ser consumida apenas em erros. Japan Journal, Survival Missions, Listening/Pronunciation e Kanji Atlas também receberam uma segunda leva responsiva com touch targets, hierarquia e estados de interação mais robustos. O Quality Gate cobre esses comportamentos em desktop, tablet e mobile.

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
- migração/versionamento de estado local ✅;
- export/import do progresso ✅;
- recuperação de estado corrompido ✅;
- backup pré-migration + testes de upgrade ✅;
- estratégia de atualização do Service Worker ✅;
- auditoria de acessibilidade;
- testes cross-browser ✅;
- smoke test offline ✅;
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

1. Home adaptativa concluída.
2. Next Best Lesson Engine concluído.
3. Daily Loop adaptativo concluído.
4. Listening & Pronunciation Lab concluído.
5. Kanji Memory Lab 2.0 concluído.
6. Survival Missions 2.0 concluído.
7. Gate estrutural N5 concluído; manter validação longitudinal de retenção e transferência.
8. N4 por capacidades formalizado; manter calibração longitudinal dos gates funcionais.
9. P9.2/P9.3 implementados: validar longitudinalmente e recalibrar o NBL apenas com sinais observados; manter Home fora dessa calibração por enquanto.
10. Latência observada implementada; acumular baselines equivalentes antes de transformar números em gates.
11. P8 avançado em Home, Lesson, Practice, Journal, Missions, Listening/Pronunciation e Kanji; seguir com validação visual publicada e refinamentos residuais sem quebrar os gates.

## Guardrails permanentes

- Não avançar apenas porque uma atividade foi concluída quando o resultado exige domínio.
- Não aumentar conteúdo se isso piorar o caminho crítico.
- Não usar gamificação para esconder dívida pedagógica.
- Não criar scores de pronúncia com precisão que a tecnologia disponível não suporta.
- Não misturar PT/EN/Japonês sem função pedagógica explícita.
- Não ensinar por tradução literal quando um modelo mental melhor estiver disponível.
- Não expandir N4/N3 antes de provar que o motor reutiliza bem o N5.
- Toda melhoria relevante deve entrar em CI com contrato observável quando isso for viável.
