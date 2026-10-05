# MON — Matriz Inicial de Controles LGPD

**Versão:** 0.1

| Controle | Implementação/evidência atual | Status |
| --- | --- | --- |
| minimização | local-first; sem áudio bruto | parcial/verificado no código |
| controle de acesso cloud | RLS por `auth.uid()` | implementado |
| credencial privilegiada fora do browser | config aceita somente publishable key | implementado |
| transparência | política e termos versionados | implementado como draft |
| exportação | backup JSON | implementado |
| exclusão de estado cloud | delete próprio com RLS | implementado nesta baseline |
| exclusão completa da conta | Edge Function autenticada + admin delete; deploy/teste ainda pendentes | implementação preparada; **gate de produção aberto** |
| inventário de dados | DATA-INVENTORY.md | implementado |
| registro de tratamento | PROCESSING-REGISTER.md | baseline |
| retenção | DATA-RETENTION.md | baseline, prazos jurídicos a validar |
| incident response | INCIDENT-RESPONSE.md | baseline |
| subprocessadores | SUBPROCESSORS.md | inventário, validação pendente |
| transferência internacional | mecanismo/region ainda não confirmados | **gate aberto** |
| política de menores | AGE-AND-CHILD-SAFETY.md | **gate aberto** |
| canal do titular | e-mail ainda não definido | **gate aberto** |
| controlador identificado | ainda não definido | **gate aberto** |

## Regra

Nenhum item “baseline” deve ser apresentado como certificação de conformidade. Evidência técnica prova apenas o controle observado e dentro de seu escopo.
