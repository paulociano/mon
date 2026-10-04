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
