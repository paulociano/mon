# MON — N5 Readiness Gate

> Estado oficial da fronteira N5 do MON. Este documento separa o que já é provado pelo repositório do que ainda depende de evidência longitudinal de uso.

## Decisão

O **N5 está estruturalmente pronto para servir de base à expansão por capacidades do N4**.

Isso não significa que a aprendizagem N5 esteja "encerrada". A validação de retenção, transferência e autonomia continua sendo um processo longitudinal. O que está concluído é o gate estrutural necessário para evitar que o roadmap trate o N5 como um bloqueio indefinido.

## Evidência executável existente

O Quality Gate já executa duas auditorias específicas:

- `scripts/test-n5-scale.mjs`
- `scripts/test-n5-depth.mjs`

### Cobertura estrutural

O contrato atual exige, entre outros pontos:

- pelo menos 29 unidades N5;
- 100+ itens reutilizáveis de vocabulário;
- 30+ capacidades/estruturas gramaticais;
- 45+ kanji funcionais;
- progressão ordenada até o dia 54;
- objetivos observáveis por unidade;
- cenários de transferência;
- `freeRecall`, `transfer` e `roleplay`;
- limite de vocabulário novo por unidade;
- reaparição lexical e gramatical em momentos posteriores;
- cobertura de domínios como transporte, compras, alimentação, casa, tempo, clima, social, trabalho, saúde, serviços, reparo de conversa e contadores;
- variedade adicional em cenários críticos de saúde, telefone, reparo e autonomia.

### Gate estrutural

**Status: PASS quando o Quality Gate estiver verde.**

Se qualquer um desses contratos regredir, o N5 volta automaticamente a bloquear expansão curricular relacionada.

## O que permanece em validação

A camada estrutural não prova, sozinha, que pessoas reais retêm e transferem o que estudaram. Permanecem como validação contínua:

### Retenção

- acerto após espaçamento;
- necessidade de pistas;
- recuperação depois de 1, 3, 7+ dias;
- padrões de esquecimento por habilidade e modalidade.

### Transferência

- uso de uma habilidade em contexto diferente daquele em que foi ensinada;
- desempenho em free recall;
- desempenho em roleplay;
- recuperação de erros recorrentes.

### Autonomia

- conclusão de missões sem opções prontas;
- reparo espontâneo de conversa;
- redução progressiva da ajuda necessária;
- capacidade funcional demonstrada em cenários novos.

## Regra para expansão N4

O N4 pode avançar desde que:

1. os gates N5 estruturais permaneçam verdes;
2. a expansão reutilize os mesmos motores pedagógicos;
3. novas capacidades sejam expressas como comportamento observável, não apenas volume de conteúdo;
4. gaps encontrados no N5 alimentem remediation e Next Best Lesson;
5. métricas futuras possam medir retenção, transferência e autonomia separadamente de atividade.

## Próximo gate

A próxima fronteira do produto é criar uma **camada de evidência de aprendizagem** que registre tentativas, espaçamento, modalidade, nível de pista, sucesso e contexto. Essa camada permitirá validar longitudinalmente se os mecanismos adaptativos estão produzindo retenção e autonomia.

## Fonte de verdade

- contratos estruturais: código e testes em `scripts/test-n5-*.mjs`;
- decisão de produto: este documento;
- sequência operacional: `docs/ROADMAP.md`.

Quando comportamento ou critérios mudarem, código, este gate e roadmap devem ser atualizados na mesma mudança.
