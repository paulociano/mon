# MON — Terceiros e Subprocessadores

**Versão:** 0.1 — inventário inicial  
**Status:** nenhum fornecedor deve ser considerado juridicamente aprovado apenas por constar nesta lista.

| Fornecedor/serviço | Função | Dados potenciais | Carregamento | Status pré-produção |
| --- | --- | --- | --- | --- |
| Supabase | autenticação e sincronização | e-mail, user id, perfil, learning_state, metadados de sync | somente quando cloud configurada/Conta MON | validar região, DPA, subprocessadores, retenção e transferência internacional |
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
