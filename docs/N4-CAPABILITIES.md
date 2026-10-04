# MON — N4 Capability Contract

> O N4 do MON é governado por capacidades funcionais observáveis, não apenas por volume de conteúdo.

## Capacidades transversais

O N4 reutiliza cinco capacidades já presentes no Functional Mastery Graph e nas Survival Missions:

| Capacidade | Outcome observável |
| --- | --- |
| **repair** | manter a interação quando algo quebra, pedindo repetição, esclarecimento ou reformulando |
| **confirm** | checar entendimento, dado crítico, condição ou próximo passo |
| **explain** | dar contexto, causa, restrição ou significado suficiente para a outra pessoa agir |
| **negotiate** | ajustar plano, prioridade, prazo, horário, rota ou alternativa |
| **summarize** | devolver o ponto principal, separar decisão de detalhe e fechar o próximo passo |

A fonte executável dessa taxonomia é `data/n4-capabilities.js`.

## Contrato por unidade

Cada unidade N4 deve:

- declarar pelo menos duas capacidades funcionais;
- usar somente capacidades do catálogo canônico;
- conter prática de `transfer`;
- conter produção/roleplay;
- manter objetivos e cenários coerentes com o comportamento que pretende desenvolver.

As capacidades não substituem vocabulário, gramática, kanji, listening ou leitura. Elas dizem **para que o aluno precisa usar essas peças**.

## Evidência e readiness

O estado longitudinal continua em `state.functionalMastery`.

Uma capacidade pode ser considerada pronta para um gate somente quando houver simultaneamente:

- pelo menos 2 tentativas observadas;
- score funcional de pelo menos 65.

Esses valores são um **gate inicial de produto**, não uma alegação de equivalência oficial ao JLPT nem prova científica de domínio. Eles devem ser recalibrados quando a camada de Learning Evidence acumular dados suficientes.

## Regra de progressão

Nesta etapa, o contrato é **observacional e de governança**:

- o currículo sabe quais capacidades cada unidade exige;
- o CI impede unidades N4 sem contrato funcional;
- Progresso e missões continuam produzindo evidência por capacidade;
- o motor adaptativo pode consultar essa informação em ciclos futuros.

O P2 não bloqueia retroativamente a trilha do usuário por score funcional. Antes de tornar o gate impeditivo, o MON precisa validar distribuição, estabilidade e qualidade dos dados coletados no P1.

## Gate final N4

A unidade `n4-autonomy-final` exige as cinco capacidades:

`repair → confirm → explain → negotiate → summarize`

Isso transforma o fim do N4 em uma demonstração integrada de autonomia, e não apenas na conclusão de mais uma sequência de conteúdo.

## Guardrails

- não criar um segundo sistema pedagógico paralelo;
- não confundir conclusão de unidade com capacidade demonstrada;
- não aumentar threshold sem evidência;
- não usar score funcional isolado para afirmar fluência;
- toda nova unidade N4 precisa entrar no mapa de capacidades e passar no Quality Gate.
