# MON — Latency Observability

> Performance no MON deve ser medida por distribuição observada, não por uma única execução nem por thresholds inventados antes do baseline.

## Métricas

A camada local de performance registra:

- `boot:navigation`: duração de navegação reportada pelo browser;
- `boot:load`: tempo do runtime de performance até o evento `load`;
- `feature:<name>`: carregamento lazy de cada feature;
- `view:<name>`: transição completa até a view renderizada;
- `lesson:interactive`: do início da abertura da lição até o primeiro exercício estar renderizado e interativo;
- `longtask`: tarefas acima de 50 ms observadas pela PerformanceObserver.

## Distribuições

O Performance Lab mostra, por métrica:

- número de amostras;
- p50;
- p95;
- mínimo;
- máximo.

O histórico local mantém até 80 medições recentes.

P50 representa a experiência típica observada. P95 serve para enxergar a cauda lenta. Nenhum deles é tratado como field telemetry global.

## Baseline reproduzível

O CI executa `scripts/measure-latency-baseline.mjs` em Chromium local.

O baseline:

1. inicia com histórico limpo;
2. abre o app em `?debug=1`;
3. repete transições Home ↔ Progresso;
4. prepara uma lição mínima;
5. mede o tempo até a lição ficar interativa;
6. imprime o snapshot com p50/p95.

O baseline de CI é **lab data**, não field data.

## Calibração multi-run

Além do baseline simples, o CI executa `scripts/calibrate-latency-baseline.mjs`.

A calibração abre um contexto novo por rodada, limpa o histórico local, repete as mesmas transições Home ↔ Progresso e mede novamente `lesson:interactive`. Entre rodadas, calcula mediana dos p50/p95, mínimo, máximo e spread relativo.

Chromium usa 5 rodadas por padrão. Firefox e WebKit usam 3 rodadas cada. Isso responde se o número é reproduzível no mesmo laboratório, mas ainda não prova que representa um dispositivo real ou hardware mais lento.

## Budgets de latência

Nesta etapa, o MON deliberadamente **não falha o CI por um número arbitrário de milissegundos**.

Um budget de latência só deve virar gate quando houver:

- baseline repetido em condições equivalentes ✅;
- entendimento da variabilidade entre runs ✅ via calibração multi-run;
- pelo menos um ambiente representativo além do runner de CI;
- impacto perceptível ou risco operacional que justifique o threshold.

Quando um budget for adotado, ele deve registrar:

- métrica;
- percentil;
- ambiente;
- baseline;
- tolerância;
- justificativa;
- data de revisão.

## Cache e interpretação

Transfer size igual a zero pode indicar cache, mas não deve ser tratado isoladamente como prova de performance melhor.

Service Worker, cache quente/frio, engine, viewport, CPU e rede mudam latência. Comparações devem manter as condições equivalentes.

## Privacidade

As métricas ficam no navegador e não são enviadas pelo MON.

O Performance Lab continua local-only e não usa `fetch` ou `sendBeacon`.

## Quality Gate

O CI valida:

- presença de p50/p95;
- ordenação p95 >= p50;
- instrumentação de boot;
- instrumentação de views/features;
- tempo até lição interativa;
- execução de baseline reproduzível;
- ausência de telemetria externa nova.
