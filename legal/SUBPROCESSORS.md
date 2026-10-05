# MON — Terceiros e Subprocessadores

**Versão:** 0.1 — inventário inicial  
**Status:** nenhum fornecedor deve ser considerado juridicamente aprovado apenas por constar nesta lista.

| Fornecedor/serviço | Função | Dados potenciais | Carregamento | Status pré-produção |
| --- | --- | --- | --- | --- |
| Supabase | autenticação e sincronização | e-mail, user id, perfil, learning_state, metadados de sync | somente quando cloud configurada/Conta MON | projeto MON em `sa-east-1`; DPA e lista oficial de subprocessadores revisados; mecanismo de transferência sob Res. CD/ANPD 19/2024 ainda requer validação contratual/jurídica |
| jsDelivr | entrega do SDK Supabase no runtime atual | IP, user-agent e metadados técnicos de requisição | sob demanda ao abrir conta/cloud | avaliar self-host/bundle local antes da produção |
| YouTube / Google | vídeo externo | dados técnicos de conexão e dados definidos pelo terceiro | player somente após clique; thumbnails carregadas na grade | validar política aplicável e necessidade de consentimento conforme configuração real |
| Navegador/SO — SpeechRecognition | reconhecimento de voz | áudio e metadados conforme fornecedor da plataforma | somente após ação explícita | manter disclosure; comportamento varia por fornecedor |

## Gate

Antes do lançamento:
- confirmar contratos/termos aplicáveis;
- registrar região e localização de dados quando conhecida;
- confirmar mecanismo de transferência internacional quando aplicável;
- revisar retenção e logs;
- reduzir terceiros dispensáveis;
- atualizar a Política de Privacidade com fatos verificados.


## Evidência de fornecedor — Supabase

Revisão factual em 5 de outubro de 2026:

- o projeto MON está provisionado em `sa-east-1`;
- o DPA vigente do Supabase declara que, quando o cliente escolhe uma região específica, os dados cobertos são armazenados e processados primariamente nessa região, ressalvadas instruções adicionais, exigências legais ou necessidades dos serviços;
- o DPA identifica a Supabase Pte. Ltd., em Singapura, como data importer no anexo de SCCs;
- o DPA mantém uma lista oficial e mutável de subprocessadores, com mecanismo de notificação de alterações;
- o DPA prevê notificação ao cliente, sem demora indevida e quando viável em até 48 horas, após ciência de incidente de segurança;
- após o término do contrato, o DPA prevê janela de 30 dias para cópia/retorno e exclusão subsequente das cópias dos dados cobertos;
- a lista oficial de subprocessadores estava publicada como atualizada em 1º de junho de 2026.

Fontes oficiais:
- https://supabase.com/legal/customer-resources/data-processing-addendum
- https://supabase.com/legal/customer-resources/subprocessor-list

### Limite desta revisão

Isto fecha apenas a diligência factual do fornecedor. Não equivale a aprovação jurídica do mecanismo de transferência internacional aplicável ao MON no Brasil.

A Resolução CD/ANPD nº 19/2024 exige que o controlador verifique a existência de hipótese legal e mecanismo válido de transferência internacional e também estabelece deveres de transparência ao titular. Como a ANPD possui cláusulas-padrão próprias, a aderência do instrumento contratual utilizado com o Supabase deve ser validada antes do lançamento público da Conta MON.

Fonte oficial:
- https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-19-de-23-de-agosto-de-2024
