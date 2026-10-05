# MON · Japanese Learning System

## Propósito

O MON organiza o ensino de japonês por capacidade funcional demonstrada. O currículo não começa por uma lista de regras e não termina em múltipla escolha: cada unidade conecta uma tarefa real a input compreensível, explicação, recuperação ativa, transferência e produção.

O contrato pedagógico comum é:

```text
Can-do
→ situação
→ input contextual
→ Study
→ prática guiada
→ retrieval
→ transfer
→ produce
→ evidência
→ spacing
```

## Fontes pedagógicas

O MON usa princípios e cobertura inspirados em fontes de referência, sem copiar páginas, exercícios ou assets protegidos.

### Irodori · Fundação Japão

Owner principal de **comunicação funcional**.

Aplicações:
- Can-do observável;
- situações de vida e trabalho no Japão;
- linguagem escolhida pela tarefa;
- compreensão antes de produção;
- estratégias de reparo;
- transferência para uma situação nova.

Referência: https://fjsp.org.br/irodori/

### Desvendando a Língua Japonesa

Owner principal de **explicação PT-first**.

Aplicações:
- função antes de tradução literal;
- modelo mental;
- explicação de partículas e estruturas;
- comparação entre padrões próximos;
- exemplos trabalhados em português.

Referência: https://aulasdejapones.com.br/wp-content/uploads/2015/06/Desvendando.A.L%C3%ADngua.Japonesa.-.Livro_.pdf

### Meu Amigo Kanji · TUFS

Owner principal de **kanji contextual**.

Aplicações:
- significado e forma antes de inventário de leituras;
- leitura dentro de palavras;
- associação visual;
- kanji ligado à situação;
- recuperação cumulativa e contraste.

Referência: https://www.tufs.ac.jp/common/mlmc/kyouzai/adbr/docs/adbr_1nen_kanji/adbr_1nen_kanji_all.pdf

### Referências complementares privadas

Genki I/II, Tobira, Grammar Power, Basic Kanji Book e Remembering the Kanji podem orientar progressão, variedade de prática, leitura, listening e mnemônica quando disponíveis na fonte privada autorizada pelo usuário.

O repositório não deve armazenar cópias substanciais desses materiais.

## Contrato de unidade

Toda unidade estruturada N5/N4 deve produzir um `japaneseLearningContract` com:

- `canDo`: resultados observáveis;
- `situation`: contexto funcional;
- `input`: japonês + sentido;
- `study`: explicação aplicada;
- `kanji`: kanji da unidade ligados a palavra/contexto;
- `repair`: estratégia mínima para manter a conversa;
- `practice`: understand → notice → retrieve → transfer → produce;
- `sources`: provenance metodológica.

A Fundação Zero usa o mesmo princípio. Dias 1–12 ensinam forma + som + expressão funcional antes do teste; dias 13–24 acrescentam gramática explícita.

## Study Block

O Study Block não é avaliado e não gasta Energia.

Ele deve responder:

1. O que eu preciso conseguir fazer?
2. Em que situação isso aparece?
3. Qual mecanismo japonês resolve essa intenção?
4. Quais exemplos mostram o mecanismo funcionando?
5. Qual confusão provável preciso evitar?
6. Qual kanji/vocabulário aparece dentro desta tarefa?
7. Como reparo a conversa se eu não entender?

### Apoio adaptativo

O volume de teoria depende da evidência:

- **full**: conceito novo ou frágil;
- **compact**: conceito conhecido com domínio intermediário;
- **practice**: conceito forte, apenas reativação curta antes da aplicação.

A adaptação usa evidência de mastery; conclusão de atividade, sozinha, não reduz explicação.

## Gramática canônica · P2

O `grammarCatalog` é a fonte pedagógica canônica de cada estrutura gramatical. Cada entrada precisa carregar, diretamente ou por hidratação canônica:

- `mentalModel`;
- `explanation`;
- `examples`;
- `contrast`;
- `commonMistakes`;
- `realWorldUse`;
- `sources`.

Study Blocks, discovery, remediation e futuras superfícies de consulta devem ler esses campos do mesmo catálogo. Não criar uma segunda coleção de explicações paralela em engines ou UI.

O arquivo `data/grammar-pedagogy.js` enriquece o catálogo em runtime e reaplica a hidratação quando novos chunks N4 são carregados. Essa operação é idempotente.

## Remediation adaptativa · P3

Quando uma resposta gramatical falha, o MON não repete a mesma pergunta às cegas. O erro é ligado ao conceito canônico por `_reviewType/_reviewKey`, preservando também a resposta escolhida.

Fluxo:

```text
erro gramatical
→ misconception evidence
→ Study de reparo
→ contraste + exemplos canônicos
→ nova tentativa
→ mistake recovery
```

A primeira falha usa modo `repair`, curto e específico. Se o mesmo padrão reaparece, o MON escala para `contrastive`, trazendo explicação mais completa e o boundary relevante. O Caderno de Erros preserva essa mesma sequência quando o item volta depois.

Regras:
- não criar uma segunda fonte de explicação;
- remediation lê `mentalModel`, `contrast`, `examples` e `commonMistakes` do `grammarCatalog`;
- retry assistido pode gerar evidência de mastery, mas não deve ser tratado como domínio independente;
- um retry não injeta outro loop de remediation imediatamente;
- erros não gramaticais continuam usando seus mecanismos próprios.

## Grammar Notebook · P4

O Grammar Notebook / 文法 é uma projeção navegável do `grammarCatalog`, nunca uma segunda base de conteúdo.

Ele mostra apenas estruturas já encontradas pelo aluno, inferidas por progressão curricular ou por evidência observada. Cada entrada combina:

- forma e função;
- modelo mental;
- explicação;
- exemplos trabalhados;
- contraste;
- erro comum;
- uso real;
- domínio observado;
- estado de revisão;
- misconceptions ainda abertas.

Filtros mínimos: todas, frágeis, revisar, N5 e N4. A busca percorre forma, função, explicação, contraste e exemplos.

O botão de revisão direta monta uma sessão curta de `Study + retrieval` usando o mesmo catálogo e o mesmo scheduler. O Notebook não cria exercícios proprietários nem duplica explicações.

Princípio de desbloqueio: conteúdo futuro permanece oculto mesmo existindo no catálogo. A biblioteca cresce junto com a jornada do aluno.

## Domínio conceitual de gramática · P5

Gramática usa um mastery profile próprio com cinco dimensões observáveis:

1. `recognize` — reconhecer a função do padrão;
2. `mechanism` — compreender o modelo mental e prever por que a estrutura funciona;
3. `contrast` — distinguir o padrão de uma alternativa próxima ou misconception comum;
4. `transfer` — aplicar a estrutura fora do exemplo em que foi ensinada;
5. `produce` — produzir a estrutura dentro de uma resposta funcional.

Reconhecimento isolado não pode produzir domínio alto. Para gramática, dimensões ainda sem evidência entram como lacunas no cálculo de mastery. Vocabulário, kana, kanji e demais conceitos mantêm suas dimensões anteriores.

As lições estruturadas coletam evidência explícita de mecanismo e contraste e atribuem transferência/produção ao conceito gramatical quando a prática usa a gramática da unidade. O Grammar Notebook exibe os cinco eixos e a revisão direta mira automaticamente o eixo mais fraco.

A profundidade do Study adaptativo também usa esse perfil: uma estrutura reconhecida mas conceitualmente incompleta continua recebendo explicação em vez de ser promovida prematuramente para prática sem apoio.

## Interleaving contrastivo · P6

O MON mantém um grafo canônico de estruturas que costumam competir pela mesma decisão funcional, por exemplo `に × で`, `は × が`, `から × ので` e `けど × のに`.

A seleção do rival usa três sinais:

1. **confusão observada** — erros reais em exercícios A × B;
2. **domínio de contraste** — score baixo em `contrast` aumenta prioridade;
3. **progressão** — uma estrutura futura ainda não encontrada não pode ser introduzida apenas porque pertence ao grafo.

Cada erro de discriminação abre uma dívida em `grammarConfusions`; um acerto posterior recupera uma unidade dessa dívida. Lição adaptativa, revisão espaçada e Grammar Notebook usam o mesmo ranking.

O exercício contrastivo pede uma decisão funcional entre duas formas próximas, em vez de apenas reconhecer uma descrição textual. A resposta continua sendo registrada como evidence de `contrast` para a estrutura-alvo.

Princípios:
- o grafo de pares pertence à pedagogia canônica, não à UI;
- erros reais têm mais peso que heurísticas;
- rival ainda não encontrado permanece oculto;
- remediation específica continua usando o `grammarCatalog`, sem duplicar explicações.

## Retenção contrastiva longitudinal · P7

Uma misconception contrastiva não é considerada resolvida porque o aluno acertou logo após a correção.

O MON usa três checkpoints temporais aproximados:

- **d1** — 20h+ após o último erro;
- **d3** — 60h+ após o último erro;
- **d7** — 144h+ após o último erro.

Fluxo:

```text
erro A × B
→ repair imediato
→ probe d1 em situação nova
→ probe d3
→ probe d7
→ retained
```

O acerto imediato pode reduzir a dívida operacional, mas a confusão permanece aberta até existir evidência d7. Qualquer novo erro reinicia os checkpoints e atualiza `lastErrorAt`.

Os probes entram na mesma fila de revisão usada pelas lições e são priorizados antes de revisões genéricas quando estão vencidos. Cada probe continua registrando evidence na dimensão `contrast`.

O relatório de Learning Validation expõe retenção contrastiva separadamente da retenção geral, permitindo observar quantos pares estão pendentes e quantos sobreviveram aos checkpoints.

Princípios:
- correção imediata não equivale a retenção;
- retenção precisa sobreviver ao tempo e a uma situação nova;
- novo erro invalida a prova longitudinal anterior;
- não criar scheduler paralelo: os probes usam a revisão existente do MON.

## Gramática

A gramática é ensinada como função comunicativa.

Exemplo:

```text
駅に行きます
に → ponto/destino

駅で食べます
で → palco da ação
```

O MON evita transformar partículas em traduções fixas. Contraste e boundary conditions têm prioridade quando existe misconception provável.

## Kanji

Kanji é ensinado em três camadas:

1. forma + significado;
2. palavra/leitura necessária naquela unidade;
3. reencontro em contexto diferente.

Listas completas de ON/KUN não são objetivo inicial. Leituras novas devem entrar quando aparecem em vocabulário real.

O Kanji Memory Lab continua responsável por famílias visuais, contraste e retrieval. As lições passam a fornecer a ponte contextual que explica **por que aquele kanji importa agora**.

## Listening e pronúncia

Listening não é um silo. Sempre que possível, o input auditivo reutiliza linguagem que participa da missão funcional.

Pronúncia prioriza:
- mora;
- duração;
- っ;
- ん;
- segmentação;
- inteligibilidade.

Reconhecimento de voz continua sendo pista textual, não score fonético.

## Survival Missions

Missões são o teste de transferência do sistema.

Cada missão expõe o mesmo contrato:
- Can-do;
- contexto;
- input;
- resposta funcional;
- alternativa válida;
- repair;
- critério de conclusão.

A autonomia aumenta quando o aluno resolve a intenção com menos apoio, não quando replica uma frase-modelo.

## Progressão

A ordem de evidência é:

```text
compreensão
→ recuperação
→ transferência
→ produção
→ retenção espaçada
```

O Next Best Lesson pode reduzir novidade quando há:
- revisão vencida;
- erro recorrente;
- domínio frágil;
- gap funcional;
- transferência longitudinal baixa.

## Quality Gate

O CI deve impedir regressões em que:
- uma unidade estruturada não tenha Can-do;
- uma unidade não tenha input contextual;
- gramática seja testada sem Study Block;
- uma unidade com kanji não forneça contexto;
- retrieval/transfer/production desapareçam;
- Survival Mission perca repair;
- Foundation volte a testar antes de ensinar.

## Copyright e provenance

As fontes são referências metodológicas e de cobertura. Exemplos, explicações e exercícios do MON devem ser originais.

Não copiar:
- páginas;
- ilustrações;
- áudios;
- exercícios;
- answer keys;
- longos trechos;
- tabelas proprietárias.

Quando uma decisão curricular depender de uma fonte específica, preservar provenance no documento ou contrato correspondente.
