# MON — Revisão Técnica de Segurança e Privacidade para Menores

**Data:** 5 de outubro de 2026  
**Escopo:** baseline técnico para produto sem restrição etária. Não é parecer jurídico.

## Contexto regulatório observado

A Lei nº 15.211/2025 alcança produtos e serviços direcionados a crianças/adolescentes ou de acesso provável por eles e exige proteção prioritária, melhor interesse e medidas proporcionais de privacidade, proteção de dados e segurança.

A ANPD também orienta que o melhor interesse deve prevalecer no tratamento de dados de crianças e adolescentes, com avaliação concreta das operações.

Fontes oficiais:
- https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm
- https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/copy_of_guia_legitimo_interesse.pdf
- https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-19-de-23-de-agosto-de-2024

## Estratégia adotada

O MON não coleta idade no baseline. Em vez de usar idade para decidir quem recebe proteção, aplica defaults protetivos a todos os usuários.

Isso reduz a necessidade de coletar mais um dado pessoal e evita que proteções de privacidade dependam de uma classificação etária potencialmente incorreta.

## Controles verificados

### Conta
- e-mail e senha são os únicos dados obrigatórios do cadastro;
- não há campo de data de nascimento, escola, endereço ou localização;
- a tela de autenticação apresenta orientação simples para crianças/adolescentes e responsáveis;
- Termos e Privacidade estão disponíveis antes do cadastro.

### Voz
- reconhecimento inicia somente após clique em “falar”;
- o MON não usa `getUserMedia` nem `MediaRecorder`;
- áudio bruto não é armazenado pelo MON;
- transcrição retornada pelo browser é mostrada apenas na tentativa;
- texto reconhecido não é salvo nem sincronizado;
- somente frase-alvo, score aproximado e timestamp podem permanecer no estado pedagógico;
- texto legado de `lastTranscript` é removido quando o laboratório é carregado.

### Vídeo
- a grade não carrega thumbnails de `i.ytimg.com`;
- nenhum iframe existe antes da ação do usuário;
- após clique, o player usa `youtube-nocookie.com`;
- autoplay está desativado;
- fechar o modal remove o iframe.

### Produto
- não há publicidade comportamental no baseline;
- não há social graph, mensagens usuário-a-usuário ou perfil público;
- o Journal é um registro estruturado de progresso narrativo, não um diário de texto livre;
- adaptação pedagógica usa sinais do próprio estudo e não deve inferir saúde, personalidade ou elegibilidade;
- cloud state usa RLS por usuário;
- o usuário pode excluir estado cloud e a Conta MON inteira.

## Gaps que permanecem

- revisão jurídica específica para menores;
- análise formal do melhor interesse por operação;
- decisão sobre necessidade/proporcionalidade de aferição de idade;
- papel e mecanismo de responsáveis legais quando aplicável;
- revisão de bases legais para tratamentos envolvendo menores;
- revisão da transferência internacional quando dados de menores estiverem envolvidos;
- canal de suporte/privacidade ainda não definido;
- CPF/CNPJ do controlador ainda não preenchido.

## Resultado

**Baseline técnico protetivo: implementado e testável.**

**Conformidade jurídica para menores: aberta.**
