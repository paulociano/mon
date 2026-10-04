# MON — Typography System

> Tipografia no MON precisa equilibrar produto digital contemporâneo, caráter editorial japonês, legibilidade pedagógica e funcionamento offline.

## Decisão

O MON usa três papéis tipográficos canônicos:

### UI

`--ui`

Stack system-first:

- ui-sans-serif;
- San Francisco / Apple system via `-apple-system`;
- Segoe UI no Windows;
- Arial como fallback final.

Objetivo: interface, navegação, controles, labels, métricas e texto funcional.

O projeto não declara Inter como dependência porque não distribui nem carrega Inter. Se Inter for adotada no futuro, ela deve ser realmente empacotada ou carregada com uma política compatível com offline/performance.

### Display

`--display`

Stack editorial system-first:

- ui-serif;
- Iowan Old Style;
- Palatino / Book Antiqua;
- Georgia;
- Times New Roman como fallback final.

Objetivo: títulos, chamadas editoriais e headings de maior personalidade.

Georgia permanece apenas como fallback dentro do token. Ela não deve ser hardcoded em componentes.

### Japonês

`--jp`

Stack pedagógica sans:

- Hiragino Sans;
- Yu Gothic UI;
- Noto Sans JP;
- Meiryo;
- sans-serif.

Objetivo: kana, kanji, exemplos, leitura, inputs japoneses e elementos de treino.

A escolha sans é deliberada para superfícies de aprendizagem, onde clareza de forma e consistência de strokes têm prioridade sobre ornamentação.

## Por que não usar webfonts externas agora

O catálogo UI UX Pro Max sugere a família Noto Serif JP + Noto Sans JP para uma direção japonesa elegante. O radar tipográfico do Arsenal também destaca famílias modernas como Geist e Inter para UI.

Para o MON, porém, webfonts no caminho crítico trariam:

- dependência de rede;
- pior first render em conexões lentas;
- comportamento menos previsível em offline;
- custo adicional de cache/PWA;
- risco de layout shift.

Por isso a implementação atual preserva a intenção visual com stacks nativas e mantém zero dependência remota de fonte.

## Hierarquia

- display serif: títulos editoriais e hero headings;
- UI sans: corpo, navegação, botões, labels e dados;
- JP sans: material japonês e exercícios.

Evitar introduzir uma quarta família sem um novo papel funcional claro.

## Regras

- não hardcodar `Georgia`, `system-ui` ou famílias japonesas em componentes;
- usar apenas `var(--ui)`, `var(--display)` e `var(--jp)`;
- controles de formulário herdam a tipografia do contexto;
- fonte externa nova exige revisão de licença, peso, cache, layout shift e offline;
- Japanese learning content não deve depender de uma display font decorativa;
- títulos mistos PT/JP podem usar o papel de display, mas exercícios e glyphs pedagógicos ficam em `--jp`.

## Quality Gate

O CI verifica:

- presença dos três papéis;
- ausência de Inter sem asset real;
- ausência de Google Fonts ou outro provider remoto no caminho crítico;
- ausência de famílias hardcoded fora dos tokens;
- consistência de uso de `--display` e `--jp`.
