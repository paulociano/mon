# MON — Política de Privacidade

**Versão:** 0.1 — baseline pré-produção  
**Atualização:** 5 de outubro de 2026  
**Status:** requer revisão jurídica, complementação cadastral do controlador, canais de contato e validação final dos gates antes do lançamento público.

## 1. Controlador

Controlador: **Paulo Henrique Graciano**  
CPF/CNPJ:  
Contato de privacidade:  

O documento cadastral e o canal de privacidade permanecem em aberto e devem ser definidos e testados antes da ativação pública definitiva da Conta MON.

## 2. Princípios do MON

O MON adota uma arquitetura local-first. Sempre que possível, progresso e preferências permanecem no dispositivo. A camada cloud é opcional e existe para autenticação e sincronização entre dispositivos.

O desenho de privacidade segue minimização, finalidade, necessidade, segurança, transparência e acesso controlado.

## 3. Dados tratados

### 3.1 Uso local sem conta

O navegador pode armazenar localmente:
- identificador local aleatório;
- nome de perfil informado pelo usuário;
- meta diária e modo de estudo;
- progresso pedagógico;
- histórico de revisões e erros;
- evidências de domínio e retenção;
- progresso de missões e journal;
- uso de recursos de kanji, listening e pronúncia;
- timestamps e metadados necessários a backup, recovery e sincronização.

Esses dados ficam no armazenamento local do navegador até serem apagados pelo usuário, pelo próprio navegador ou pelo fluxo de reset/exclusão do produto.

### 3.2 Conta MON e sincronização

Quando a Conta MON estiver habilitada e o usuário optar por entrar, podem ser tratados:
- endereço de e-mail;
- identificador da conta fornecido pelo serviço de autenticação;
- perfil do aluno;
- estado completo de aprendizagem sincronizado;
- versão/revisão do estado e timestamps de sincronização.

### 3.3 Reconhecimento de voz

O MON usa `SpeechRecognition` / `webkitSpeechRecognition` quando disponível.

O MON:
- somente inicia reconhecimento após ação explícita do usuário;
- não usa essa funcionalidade para gravar ou persistir áudio bruto;
- recebe a transcrição retornada pelo navegador e a exibe apenas durante a tentativa;
- não persiste nem sincroniza o texto reconhecido;
- pode armazenar a frase-alvo, a correspondência textual aproximada, timestamp e autoavaliação para continuidade pedagógica.

O processamento de voz pode depender do navegador, sistema operacional ou fornecedor da plataforma. Portanto, o MON não afirma que o áudio permanece sempre no dispositivo.

### 3.4 Conteúdo de terceiros

A grade de vídeos do MON não carrega thumbnails remotos. Somente após ação do usuário ao abrir um vídeo o navegador pode comunicar-se com o serviço de vídeo. O MON utiliza incorporação com `youtube-nocookie.com`, sem autoplay, para os vídeos configurados atualmente. O terceiro poderá tratar dados técnicos de conexão conforme seus próprios termos.

## 4. Finalidades

Os dados são usados para:
- manter o progresso e as preferências do aluno;
- agendar revisões;
- adaptar a próxima atividade com base em evidências do próprio usuário;
- permitir backup e recuperação;
- sincronizar estado entre dispositivos quando solicitado;
- autenticar a Conta MON;
- prevenir conflitos e perda de progresso;
- manter segurança, integridade e disponibilidade;
- responder a solicitações do titular;
- cumprir obrigações legais quando aplicáveis.

O MON não deve usar dados de aprendizagem para publicidade comportamental ou venda de perfis sem uma mudança explícita desta política, revisão jurídica e controles correspondentes.

## 5. Bases legais

As bases legais devem ser mapeadas por operação antes do lançamento. O baseline técnico parte das seguintes hipóteses a serem validadas:
- execução de contrato ou procedimentos relacionados ao serviço, quando necessários para fornecer funcionalidades solicitadas;
- legítimo interesse apenas quando houver avaliação documentada e compatibilidade com expectativas e direitos do titular;
- cumprimento de obrigação legal ou regulatória quando aplicável;
- consentimento somente quando a operação realmente depender dele, sem usar consentimento como fundamento genérico para todo tratamento.

Para crianças e adolescentes, o enquadramento deve observar as regras específicas aplicáveis e o melhor interesse.

## 6. Compartilhamento e operadores

O MON busca limitar terceiros ao mínimo necessário. O inventário atual e o status de validação ficam em `legal/SUBPROCESSORS.md`.

Antes da produção, cada operador deve ter finalidade, dados envolvidos, local de processamento, contrato/termos e mecanismo de transferência internacional, quando aplicável, verificados.

## 7. Transferência internacional

Serviços de infraestrutura, autenticação, entrega de conteúdo ou processamento do navegador podem envolver tratamento fora do Brasil.

Antes da ativação pública, o responsável pelo MON deve documentar as transferências aplicáveis, países ou regiões relevantes e o mecanismo utilizado em conformidade com a LGPD e regulamentação da ANPD.

## 8. Retenção

A política operacional está em `legal/DATA-RETENTION.md`.

Em síntese:
- dados locais permanecem até exclusão pelo usuário, limpeza do navegador ou reset;
- dados cloud devem existir apenas enquanto necessários para a conta e sincronização ou enquanto houver obrigação legítima de retenção;
- backups, logs e registros de segurança devem possuir prazos e critérios próprios;
- dados não devem ser mantidos indefinidamente por conveniência.

## 9. Direitos do titular

Conforme aplicável, o titular pode solicitar informações e exercer direitos previstos na legislação de proteção de dados, incluindo acesso, correção, portabilidade quando cabível, informação sobre compartilhamento, oposição nos casos aplicáveis e eliminação quando juridicamente cabível.

O produto deve oferecer, no mínimo:
- exportação do estado de aprendizagem;
- exclusão dos dados sincronizados pelo próprio usuário;
- fluxo seguro para exclusão completa da conta de autenticação antes da abertura pública de contas.

Solicitações adicionais serão tratadas pelo canal de privacidade.

## 10. Segurança

O MON utiliza controles técnicos como:
- arquitetura local-first;
- Row Level Security por usuário no estado cloud;
- chave pública limitada no browser;
- proibição de credenciais privilegiadas no cliente;
- revisão otimista para evitar sobrescrita silenciosa;
- backup local antes de substituição de estado;
- política de microfone por ação explícita;
- controle de dependências e Quality Gate.

Nenhum sistema é absolutamente imune a incidentes. O processo de resposta está em `compliance/INCIDENT-RESPONSE.md`.

## 11. Decisões automatizadas e adaptação

O MON utiliza mecanismos automatizados para organizar e recomendar atividades pedagógicas com base no histórico de estudo.

Esses mecanismos não tomam decisões sobre crédito, emprego, saúde, acesso a direitos ou outras matérias de alto impacto. Ainda assim, o usuário deve receber explicação clara de que a recomendação deriva de sinais como revisões vencidas, erros, domínio observado, retenção e transferência.

O MON adota política sem restrição etária. Por isso, o perfilamento/adaptação precisa passar pela avaliação específica prevista no gate de crianças e adolescentes antes da abertura pública definitiva.

## 12. Crianças e adolescentes

O MON adota **política sem restrição etária** e, portanto, admite a possibilidade de uso por crianças e adolescentes.

Essa decisão não encerra o gate de proteção de menores. Antes da abertura pública definitiva, o produto deve concluir a avaliação específica de acesso provável, tratamento de dados e adaptação pedagógica para menores, com proteção por padrão, linguagem adequada à idade e demais salvaguardas aplicáveis.

Enquanto esse gate permanecer aberto:
- não usar dados de menores para publicidade direcionada;
- manter configurações relevantes de privacidade protetivas por padrão;
- não exigir data de nascimento, escola, endereço ou localização para criar a Conta MON;
- não persistir texto de transcrição de voz no estado local/cloud;
- não carregar thumbnails ou players de vídeo de terceiros antes da ação do usuário;
- não converter sinais pedagógicos em avaliação psicológica, de saúde ou de elegibilidade;
- não adicionar social graph, mensagens entre usuários ou publicação pública de perfil sem nova análise.

## 13. Alterações

Mudanças materiais nesta Política devem ser versionadas e acompanhadas da correspondente revisão técnica quando alterarem dados, finalidades, terceiros ou controles.

## 14. Contato

Privacidade:
