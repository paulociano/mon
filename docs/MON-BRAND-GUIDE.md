# MON Brand & Interface Guide

## 1. Essência

MON é um sistema de aprendizagem de japonês para quem precisa entender, lembrar e usar a língua com clareza.

A interface deve transmitir três sensações:
- **clareza**: cada tela deixa evidente o próximo passo;
- **calma**: baixa fadiga visual, sem decoração competindo com o conteúdo;
- **precisão**: estados, progresso e feedback parecem ferramentas de estudo, não recompensas de jogo.

A direção visual é **futurística silenciosa**. Tecnologia aparece em proporção, ritmo, contraste e microinteração, não em excesso de glow, imagens temáticas ou cards empilhados.

## 2. Princípios de interface

### Um objetivo dominante por tela
A ação principal deve ser identificável em poucos segundos. Ações secundárias não competem em cor, tamanho ou profundidade.

### Menos recipientes
Não criar um card apenas para separar conteúdo. Use primeiro:
1. espaço;
2. alinhamento;
3. divisores;
4. mudança sutil de superfície;
5. card somente quando houver uma unidade interativa ou semântica real.

### Sem decoração narrativa no background
Fundos fotográficos, ilustrações de cenário e imagens temáticas não fazem parte do sistema principal. Conteúdo visual explícito continua permitido quando tiver função pedagógica.

### Texto sem eco
Título, subtítulo, badge e card não devem repetir a mesma ideia. Se duas frases dizem essencialmente a mesma coisa, uma delas deve desaparecer.

### Progressão visível, gamificação silenciosa
Progresso, energia e score podem existir, mas não devem superar a tarefa pedagógica em hierarquia.

## 3. Sistema tipográfico

MON usa **uma família visual única** para interface, títulos e japonês:

```css
--ui: "Noto Sans JP", "Hiragino Sans", "Yu Gothic UI", Inter,
      ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--display: var(--ui);
--jp: var(--ui);
```

Não usar Georgia, Palatino, serif editorial ou uma fonte diferente por seção.

### Pesos
- 500: corpo em destaque e japonês longo;
- 620–650: títulos;
- 700–800: labels curtos, estados e CTAs.

### Escala
- display principal: `clamp(36px, 5vw, 56px)`;
- título de seção: 20–28px;
- título de componente: 14–18px;
- corpo: 12–15px;
- metadata: 8–10px.

Evitar texto abaixo de 8px.

## 4. Cor

### Base
- Canvas: `#080d14`
- Surface: `#0d141d`
- Surface raised: `#111b26`
- Surface interactive: `#162230`
- Text: `#edf3f8`
- Text muted: `#8f9caa`

### Acentos
- Accent / sucesso de progresso: `#7fd6c9`
- CTA / atenção: `#ff6b5e`
- Secondary signal: `#9fb4c8`

Acentos são sinais, não preenchimento de grandes áreas.

## 5. Profundidade e superfícies

- borda padrão: `1px solid rgba(255,255,255,.06–.08)`;
- borda de destaque: `rgba(127,214,201,.18–.24)`;
- radius principal: 14–20px;
- sombras profundas são exceção;
- cards comuns preferem `background: rgba(255,255,255,.018–.03)`;
- overlays usam blur somente quando há motivo funcional, como topbar ou atualização.

Não usar sombras 3D, botões com “degrau” ou camadas pesadas para simular game UI.

## 6. Navegação

A sidebar é uma ferramenta, não um painel decorativo.

- fundo sólido;
- ícone pequeno e consistente;
- item ativo por mudança de fundo + linha de acento;
- sem imagem de fundo;
- sem card cultural decorativo;
- labels de grupo discretos;
- scroll da navegação não deve chamar atenção.

No mobile, a navegação inferior mantém no máximo os destinos primários.

## 7. Home

A Home responde somente:
1. Onde estou?
2. O que faço agora?
3. Por que isso é o próximo passo?

O hero adaptativo é a principal superfície. A rail lateral deve conter apenas informação operacional útil. Cards duplicando orientação, jornada ou explicações já presentes no hero devem ser removidos ou ocultados.

## 8. Jornada, Explorar e Progresso

### Jornada
Usar uma sequência vertical limpa. Etapas são linhas no fluxo, não cards independentes.

### Explorar
Ferramentas podem aparecer em grid, mas com baixa profundidade. O usuário deve perceber categorias antes de perceber caixas.

### Progresso
Priorizar evidência de domínio. Métricas são compactas e não devem parecer dashboard financeiro.

## 9. Fundação e lições

Conteúdo pedagógico tem prioridade máxima.

- explicação antes de exercício;
- bloco mental e exemplo em superfície calma;
- japonês com espaço generoso;
- feedback correto/incorreto usa cor + texto, nunca só cor;
- botão de continuar só é habilitado quando a etapa realmente terminou;
- exercício avaliativo nunca avança por clique duplicado ou estado incompleto.

## 10. Motion

Motion existe para orientar:
- entrada de view: 160–240ms;
- hover/focus: 120–180ms;
- progresso: até 450ms;
- evitar loops decorativos;
- respeitar `prefers-reduced-motion`.

Movimento não deve alterar layout durante leitura.

## 11. Conteúdo e microcopy

Preferir verbos concretos:
- “continuar”
- “revisar”
- “ouvir”
- “responder”
- “tentar novamente”

Evitar slogans repetidos em telas operacionais.

Labels em japonês são apoio cultural e semântico, não decoração. Se um kanji não ajuda a reconhecer uma função, ele não precisa estar na interface.

## 12. Regras de implementação

Antes de criar um novo componente:
1. verificar se espaço/divisor resolve;
2. verificar se já existe um padrão equivalente;
3. reutilizar tokens;
4. validar narrow/wide viewport;
5. validar foco por teclado;
6. validar reduced motion;
7. confirmar que o componente não repete informação próxima.

## 13. Anti-patterns

Não introduzir:
- imagens de cenário como background;
- fontes diferentes por menu;
- serifas editoriais isoladas;
- cards aninhados sem função;
- glow permanente em múltiplos elementos;
- grandes gradientes coloridos competindo com conteúdo;
- microcopy duplicada;
- botão “continuar” antes de conclusão real;
- estados de hover que deslocam layout.

## 14. Fonte de verdade

Código:
- `styles.css`: tokens e shell global;
- `features/*.css`: especializações que devem herdar os mesmos tokens;
- este documento: contrato humano para novas decisões.

Quando código e documento divergirem, a divergência deve ser corrigida explicitamente. Não criar um segundo design system paralelo.
