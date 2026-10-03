# MON Learning Companion — direção de mascote

## Decisão

Vale criar um mascote para o MON, desde que ele seja tratado como **interface pedagógica recorrente** e não como decoração ou mecanismo de recompensa.

O produto já possui superfícies que funcionam como um "coach" sem rosto: a Home adaptativa muda a orientação conforme o estado do aluno, a `guide-card` diferencia aprendizado, revisão, reparo e checkpoint, e as Survival Missions fornecem feedback funcional. O mascote pode unificar essas vozes e tornar o sistema adaptativo mais legível emocionalmente sem criar um segundo sistema pedagógico.

## Papel no produto

O mascote deve funcionar como **companheiro de percurso**.

Ele pode:
- traduzir o estado do motor adaptativo em uma reação curta e humana;
- sinalizar quando é hora de aprender, recuperar, revisar ou reparar;
- celebrar evidência de domínio, não mero clique ou conclusão;
- normalizar reparo de conversa como habilidade, não como fracasso;
- introduzir missões e fazer debriefs curtos;
- lembrar o aluno de recuperar antes de revelar uma pista;
- reforçar continuidade entre Home, lição, Practice Hub e Missions.

Ele não deve:
- entregar a resposta durante retrieval practice;
- interromper exercícios com falas longas;
- transformar XP/streak em objetivo principal;
- usar culpa, urgência artificial ou perda emocional para retenção;
- aparecer em toda tela;
- competir visualmente com japonês, kanji ou áudio;
- substituir feedback técnico específico.

## Arquitetura pedagógica

### Estados principais

| Estado | Função | Comportamento |
| --- | --- | --- |
| learn | preparar a próxima habilidade | curioso, aponta a missão e some quando começa a recuperação |
| review | lembrar que reencontro importa | compacto, reconhece conteúdo antigo e sugere recuperação |
| repair | proteger continuidade após erro | calmo, destaca mecanismo ou função comunicativa sem revelar resposta |
| checkpoint | elevar foco | mais sóbrio, reduz fala e deixa o aluno demonstrar domínio |
| transfer | incentivar uso em contexto novo | pergunta "o que esta situação precisa resolver?" |
| mastery | celebrar evidência | reação breve, associada a retenção/transferência, não a atividade bruta |

### Regra de presença

**Antes da tentativa:** pode orientar a missão.

**Durante recuperação:** reduz presença ao mínimo.

**Depois da tentativa:** pode explicar o mecanismo.

**Em erro recorrente:** pode oferecer uma pista graduada.

**Em domínio demonstrado:** celebra brevemente e devolve o foco ao caminho.

## Pontos de integração existentes

1. **Home / Adaptive Home Coach**
   - usar o estado já produzido por `homeCoachDecision()`;
   - mapear `learn / review / repair / recover / mistake / checkpoint` para expressão e microcopy;
   - a `guide-card` é o primeiro ponto ideal para um MVP.

2. **Lesson / Session**
   - aparecer somente no feedback pós-resposta;
   - oferecer explicação do mecanismo, não apenas "certo/errado";
   - esconder-se durante produção ou free recall.

3. **Practice Hub**
   - sinalizar revisão vencida e erro recorrente;
   - diferenciar "você já viu" de "você consegue recuperar".

4. **Survival Missions**
   - introduzir objetivo;
   - reforçar que pedir repetição é uma estratégia válida;
   - fazer debrief depois da tarefa observável.

5. **Checkpoint**
   - presença mínima;
   - sem pistas não solicitadas;
   - reação apenas após a evidência de domínio.

## Direção visual

O MON tem uma linguagem mais editorial, japonesa e contemplativa do que arcade. O mascote precisa caber nesse sistema sem empurrar o produto para uma estética infantil.

### Direção recomendada: espírito de tinta / selo

Um pequeno personagem original construído a partir da linguagem de:
- pincel e tinta;
- selo vermelho como acento, não como corpo inteiro;
- formas simples e reconhecíveis em 24–64 px;
- textura de papel muito sutil;
- olhos e postura suficientes para comunicar estado;
- silhueta que continue legível sem detalhes.

A proposta evita depender de um animal japonês estereotipado e permite que o personagem pareça nativo da identidade visual do MON.

**Nome de trabalho preservado do produto existente:** `Kitsu` (キツ). A Home já usa `Seu guia · キツ` e uma raposa simbólica `狐`; o MVP deve evoluir essa semente em vez de introduzir um segundo personagem. A direção recomendada passa a ser um híbrido **raposa de tinta + selo**, reduzindo o risco de um kitsune genérico.

### Alternativas para exploração

**Kitsune guia**
- alta expressividade;
- forte leitura imediata;
- risco alto de parecer genérico entre produtos "japoneses".

**Tanuki viajante**
- simpático e adequado a jornada;
- ótimo para humor e situações;
- tende a empurrar a marca para um registro mais cartunesco.

**Kitsu · raposa de tinta / selo**
- preserva o guia já insinuado na Home;
- combina a leitura imediata de uma raposa com a linguagem editorial de tinta/selo;
- leve para HTML/CSS/SVG;
- evita criar um mascote desconectado da interface existente.

Esta direção híbrida é a recomendada para o MVP.

## Character bible mínima

Se a direção for aprovada, registrar antes de produzir várias poses:

- silhueta principal;
- proporções;
- olhos e boca;
- acento de cor;
- textura/material;
- cinco expressões base;
- poses permitidas;
- elementos que nunca mudam;
- tamanho mínimo de leitura;
- versão monocromática;
- comportamento em dark/light context, se aplicável.

### Expressões do MVP

1. neutro / disponível;
2. curioso / aprender;
3. concentrado / checkpoint;
4. reparo / "tente por função";
5. domínio / confirmação breve;
6. escuta / áudio.

## Motion

Motion deve informar estado, não divertir por si só.

- learn: pequena inclinação/entrada;
- review: loop quase imperceptível;
- repair: desacelera e estabiliza;
- checkpoint: imóvel;
- mastery: reação curta, sem confete obrigatório;
- reduced-motion: frame estático equivalente.

Começar com SVG/CSS. Só migrar para Rive/Lottie se expressões e transições justificarem o custo.

## Voz

Tom:
- curto;
- observacional;
- sem infantilização;
- sem elogio vazio;
- focado em estratégia.

Exemplos de intenção, não copy final:
- "Você reconhece. Agora recupere sem olhar."
- "A frase é possível, mas não resolve esta situação."
- "Peça repetição. Manter a conversa viva também é fluência."
- "Você usou isso em outro contexto. Esse é o sinal que importa."

## Experimento MVP

### Hipótese

Uma presença visual consistente que represente o estado adaptativo pode tornar as decisões do MON mais compreensíveis e aumentar continuidade percebida sem reduzir autonomia.

### Escopo mínimo

Implementar apenas na `guide-card` da Home:
- um slot visual;
- estados derivados do coach existente;
- 5–6 poses/expressões;
- microcopy atual preservada;
- suporte a `prefers-reduced-motion`;
- sem nova dependência.

### Métricas úteis

Não medir sucesso por cliques no mascote.

Observar:
- início da ação recomendada pela Home;
- conclusão de revisões vencidas;
- retorno a reparos;
- uso de repair em Missions;
- abandono após erro;
- retenção/transferência quando houver telemetria suficiente.

### Gate para expansão

Expandir para Lesson/Missions somente se:
1. a presença não reduzir clareza;
2. o asset permanecer legível em mobile;
3. não aumentar custo/performance de forma relevante;
4. usuários entenderem que o personagem orienta, mas não entrega respostas;
5. houver sinal de melhora em continuidade ou compreensão do próximo passo.

## Riscos

- infantilizar uma marca atualmente mais editorial;
- virar decoração repetitiva;
- criar dívida de assets por muitas poses cedo demais;
- mascarar feedback pedagógico fraco com personalidade;
- usar o personagem como mecanismo de pressão de streak;
- adicionar animação pesada a superfícies já funcionais.

## Próxima decisão

Produzir **três estudos visuais realmente diferentes**, todos para o mesmo papel pedagógico:
1. espírito de tinta/selo;
2. kitsune editorial;
3. tanuki viajante minimalista.

Comparar em contexto na Home, em tamanho real, antes de escolher. Depois da escolha, criar character bible e somente então integrar o MVP.
