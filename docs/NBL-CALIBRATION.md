# MON — Next Best Lesson Calibration

> P9.3 conecta evidência longitudinal ao Next Best Lesson sem deixar amostras pequenas ou tendências frágeis controlar a sessão.

## Regra de confiança

A calibração longitudinal só entra quando existem pelo menos **8 observações** do sinal relevante.

Ela nunca supera dívidas pedagógicas diretas já conhecidas pelo motor:

1. remediation explícita;
2. revisões vencidas;
3. gap funcional recorrente;
4. erros abertos;
5. fragilidade clara de mastery/método;
6. narrativa pendente;
7. somente então, calibração longitudinal;
8. avanço normal.

Isso significa que a P9.3 funciona como um freio antes de novidade, não como um segundo motor.

## Sinais ativos

### Retenção 7d+

Usa attempts com espaçamento de pelo menos 144 horas.

Quando há 8+ observações e a retenção está abaixo de 70%, uma sessão que seria `advance` vira `retrieve`.

### Transferência longitudinal

Usa attempts de `transfer`, `produce`, contexto `transfer` ou `mission`.

Com 8+ observações, divide a amostra cronologicamente em metade inicial e recente. Se a metade recente:

- está abaixo de 70%; e
- não está melhor que a metade inicial,

uma sessão que seria `advance` vira `transfer`.

## Sinais ainda somente observacionais

Dependência de pistas e autonomia continuam disponíveis na P9.2, mas ainda não alteram a receita do NBL.

Motivo: reduzir risco de sobreajuste e acumular mais evidência antes de transformar esses indicadores em política adaptativa.

Erros recorrentes já possuem gates diretos no NBL por `mistakeStats` e `productionGaps`, então não precisam de uma segunda regra longitudinal concorrente.

## Guardrails

- amostra < 8 nunca recalibra;
- tendência favorável de transferência não bloqueia avanço;
- revisão vencida continua superior a retenção longitudinal;
- nenhum sinal longitudinal altera Home Coach nesta etapa;
- não há causalidade implícita: o motor reage ao estado observado do aluno, não conclui por que ele mudou;
- budgets de runtime permanecem inalterados.

## Quality Gate

Os testes cobrem:

- amostra pequena sem efeito;
- retenção 7d+ observada puxando `retrieve`;
- dívida direta prevalecendo sobre calibração;
- transferência estagnada/declinante puxando `transfer`;
- transferência em melhora preservando `advance`.
