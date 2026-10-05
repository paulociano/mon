# MON — Gate de Idade, Crianças e Adolescentes

**Status:** decisão de produto tomada; gate de salvaguardas para menores permanece aberto

## Decisão de produto

O MON adota **política sem restrição etária**. O produto, portanto, admite a possibilidade de uso por adultos, adolescentes e crianças.

Essa decisão não equivale a conclusão de conformidade. Como menores podem usar o produto, a abertura pública definitiva depende da implementação e revisão das salvaguardas específicas abaixo.

## Enquanto o gate estiver aberto

- não direcionar campanhas especificamente a menores antes da conclusão da avaliação;
- não adicionar publicidade comportamental;
- manter privacidade protetiva por padrão;
- não usar dados de aprendizagem de menores para finalidades incompatíveis;
- não converter sinais pedagógicos em avaliação psicológica, de saúde ou de elegibilidade;
- não adicionar social graph, mensagens entre usuários ou publicação pública de perfil sem nova análise.

## Salvaguardas obrigatórias antes da abertura pública definitiva

Executar:
- avaliação de acesso provável;
- revisão da Lei nº 15.211/2025 e regulamentação vigente;
- RIPD focado em menores;
- mapa de perfilamento/adaptação do Next Best Lesson, Mastery Graph e Learning Evidence;
- linguagem de privacidade adequada à idade;
- controles de conta e exclusão;
- configuração protetiva por padrão;
- análise de aferição de idade proporcional ao risco;
- avaliação de responsabilidades de responsáveis legais quando aplicável;
- testes específicos de abuso e segurança.


## Estado da decisão

- restrição etária: **nenhuma**;
- publicidade comportamental para menores: **não permitida no baseline**;
- social graph/mensagens/perfil público: **não existentes no baseline**;
- baseline técnico protetivo: **implementado e testado**;
- avaliação jurídica/regulatória específica de menores: **pendente**;
- revisão jurídica: **pendente**.


## Baseline técnico protetivo — 5 de outubro de 2026

Controles implementados de forma universal, sem precisar identificar a idade do usuário:

- cadastro sem coleta de data de nascimento, escola, endereço ou localização;
- aviso simples para crianças/adolescentes e responsáveis na superfície de autenticação;
- ausência de publicidade comportamental;
- ausência de social graph, mensagens entre usuários e perfil público;
- microfone apenas após ação explícita;
- ausência de captura por `getUserMedia` ou gravação por `MediaRecorder`;
- áudio bruto não persistido pelo MON;
- texto reconhecido por voz exibido de forma transitória e não salvo/sincronizado;
- migração que remove texto de transcrição legado do estado quando o laboratório de pronúncia é carregado;
- grade de vídeos sem thumbnails remotos;
- player externo criado somente após clique;
- YouTube `youtube-nocookie` sem autoplay;
- exclusão de dados cloud e exclusão integral da Conta MON disponíveis ao usuário.

Esses controles reduzem coleta e contato com terceiros por padrão. Eles não substituem revisão jurídica, avaliação de melhor interesse, análise de aferição de idade ou responsabilidades de responsáveis legais.
