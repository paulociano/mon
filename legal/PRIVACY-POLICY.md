# MON — Política de Privacidade

**Versão:** 0.1 — baseline pré-produção  
**Atualização:** 5 de outubro de 2026  
**Status:** requer revisão jurídica, identificação do controlador e validação de fornecedores antes do lançamento público.

## 1. Controlador

Controlador: **[NOME/RAZÃO SOCIAL DO RESPONSÁVEL]**  
CPF/CNPJ: **[PREENCHER]**  
Contato de privacidade: **[E-MAIL DE PRIVACIDADE]**

O canal acima deve ser preenchido e testado antes da ativação pública da Conta MON.

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
- transcrições de reconhecimento de voz quando o usuário usa essa função;
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
- recebe a transcrição retornada pelo navegador;
- pode armazenar localmente ou sincronizar a frase-alvo, texto reconhecido, correspondência textual aproximada, timestamp e autoavaliação.

O processamento de voz pode depender do navegador, sistema operacional ou fornecedor da plataforma. Portanto, o MON não afirma que o áudio permanece sempre no dispositivo.

### 3.4 Conteúdo de terceiros

Quando o usuário abre um vídeo externo, o navegador pode comunicar-se com o serviço de vídeo. O MON utiliza incorporação com `youtube-nocookie.com` para os vídeos configurados atualmente e carrega o player apenas após ação do usuário. O terceiro poderá tratar dados técnicos de conexão conforme seus próprios termos.

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

Quando menores forem admitidos no produto, o perfilamento/adaptação deve passar pela avaliação específica prevista no gate de crianças e adolescentes.

## 12. Crianças e adolescentes

A política de idade ainda é gate de produção.

Até a decisão formal:
- o MON não deve promover cadastro de menores;
- não deve usar dados de menores para publicidade direcionada;
- qualquer lançamento que envolva acesso provável por crianças ou adolescentes deve revisar o produto sob a Lei nº 15.211/2025, LGPD e regulamentação aplicável;
- configurações relevantes de privacidade devem permanecer protetivas por padrão.

## 13. Alterações

Mudanças materiais nesta Política devem ser versionadas e acompanhadas da correspondente revisão técnica quando alterarem dados, finalidades, terceiros ou controles.

## 14. Contato

Privacidade: **[E-MAIL DE PRIVACIDADE]**
