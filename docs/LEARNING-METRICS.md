# MON — Learning Metrics

> Métricas de aprendizagem do MON são derivadas de evidência local e sempre expõem valor, denominador e qualidade da amostra.

## Princípio

Atividade não é aprendizagem.

O MON separa seis dimensões para evitar que XP, streak ou sessões sejam tratados como prova de retenção:

| Métrica | Definição operacional |
| --- | --- |
| **Atividade** | sessões registradas; XP e streak entram apenas como contexto |
| **Retenção** | acerto em tentativas após pelo menos 20 horas de espaçamento |
| **Domínio** | média das células observadas do Mastery Graph |
| **Transferência** | acerto em produção/transferência ou contexto de missão |
| **Reparo** | proporção de gaps de produção recuperados entre gaps observados |
| **Autonomia** | autonomia média em missões concluídas |

A fonte executável das definições é `core/learning-metrics.js`.

## Contrato de apresentação

Toda métrica deve expor:

- `value`;
- `samples` como denominador;
- `lastAt` quando houver evidência temporal;
- `status` de qualidade da amostra.

Estados de qualidade:

- `empty`: ainda não há observação;
- `early`: menos de 3 observações;
- `ready`: pelo menos 3 observações recentes;
- `stale`: amostra suficiente, mas última evidência tem mais de 14 dias.

A UI não deve esconder o denominador.

## Interpretação

Essas métricas são descritivas. Elas não provam causalidade entre uma feature e aprendizagem.

Exemplos:

- retenção melhor após uma mudança de produto não prova que a mudança causou o ganho;
- uma média alta com 2 observações continua sendo amostra inicial;
- mais sessões podem coexistir com pior transferência;
- autonomia em missões mede o comportamento implementado pelo MON, não fluência geral em japonês.

## Uso adaptativo

Nesta etapa, as métricas são visíveis e auditáveis, mas o MON não deve introduzir uma regra única do tipo "otimize o maior score".

Home e Next Best Lesson já usam sinais pedagógicos granulares como revisões vencendo, mastery gaps, erros recorrentes e production gaps. A camada de métricas serve para avaliar se esses mecanismos produzem aprendizagem ao longo do tempo antes de virar um novo sinal de decisão.

## Privacidade e armazenamento

- cálculo local;
- sem `fetch` ou `sendBeacon`;
- deriva do estado existente e do Learning Evidence;
- nenhuma telemetria externa nova é introduzida por este gate.

## Gate

O Quality Gate valida:

- as seis métricas;
- denominadores obrigatórios;
- classificação de amostra;
- retenção por espaçamento;
- transferência;
- recuperação de gaps;
- autonomia;
- ausência de envio externo.
