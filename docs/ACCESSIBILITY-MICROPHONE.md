# MON — Accessibility & Microphone Policy

> Acessibilidade é comportamento funcional. Permissão de microfone é uma ação sensível e só pode ocorrer após intenção explícita do usuário.

## Navegação e foco

O MON mantém:

- skip link visível ao receber foco;
- landmark principal programaticamente focável;
- foco movido para a view ativa após navegação;
- `aria-current="page"` apenas no destino primário ativo;
- estados expansíveis com `aria-expanded` sincronizado;
- foco visível global para controles interativos;
- zero `tabindex` positivo.

## Reduced motion

Quando `prefers-reduced-motion: reduce` estiver ativo:

- animações ambiente são reduzidas ao mínimo;
- loops de animação não permanecem rodando;
- transições são praticamente removidas;
- scroll programático usa comportamento não animado.

A experiência continua funcional sem depender de movimento.

## Touch targets

Controles críticos verificados em runtime precisam ter pelo menos 24 × 24 CSS px.

Isso é um piso técnico, não um objetivo visual. Superfícies mobile devem continuar preferindo alvos maiores quando o layout permitir.

## Microfone

O Listening & Pronunciation Lab segue estas regras:

1. abrir a área de Pronúncia não inicia reconhecimento nem solicita microfone;
2. o reconhecimento só começa depois de ativar o botão **falar**;
3. o botão expõe estado de escuta por texto e `aria-pressed`;
4. negar permissão não bloqueia o treino sem microfone;
5. o MON não usa `getUserMedia` nem `MediaRecorder` nesta feature;
6. o MON não grava nem persiste áudio bruto;
7. somente a transcrição retornada pelo reconhecimento e a correspondência textual podem entrar no estado local.

## Privacy boundary

O reconhecimento usa `SpeechRecognition` / `webkitSpeechRecognition`, quando oferecido pelo navegador.

O MON **não afirma que esse processamento é local**. Dependendo do navegador, sistema operacional e configuração, o reconhecimento pode envolver serviços da plataforma ou fornecedor do navegador. Essa dependência é informada ao usuário antes do uso.

Dados persistidos pelo MON nessa feature:

- frase-alvo;
- texto reconhecido;
- correspondência textual aproximada;
- timestamp;
- autoavaliações do aluno.

Áudio bruto não é armazenado pelo MON.

## Sem falsa precisão

A transcrição é apenas uma pista de inteligibilidade textual.

Ela não deve:

- virar nota fonética;
- afirmar qualidade clínica de pronúncia;
- penalizar o aluno por falha do recognizer;
- ser tratada como medida universalmente comparável entre browsers.

## Quality Gate

O CI verifica:

- landmarks e skip link;
- ausência de tabindex positivo;
- foco visível;
- reduced motion;
- foco após navegação;
- aria-current;
- aria-expanded;
- política explícita de microfone;
- ausência de captura/gravação bruta;
- nenhum reconhecimento iniciado ao apenas abrir a feature;
- alvo mínimo do botão de microfone em runtime.
