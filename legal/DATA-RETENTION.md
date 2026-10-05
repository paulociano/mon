# MON — Política de Retenção e Exclusão de Dados

**Versão:** 0.1 — baseline operacional

## Objetivo

Definir quando os dados do MON permanecem, são exportados ou são eliminados. Prazos legais ou contratuais específicos devem ser validados antes da produção.

## Matriz

| Categoria | Local | Regra padrão | Exclusão |
| --- | --- | --- | --- |
| Perfil e progresso local | browser/localStorage | enquanto o usuário mantiver o estado | reset/limpeza local |
| Backup local | browser/localStorage ou arquivo exportado | até substituição/exclusão pelo usuário | limpeza local/arquivo |
| E-mail de autenticação | Supabase Auth | enquanto existir a conta ou obrigação aplicável | fluxo server-side de exclusão da conta |
| Perfil e learning_state cloud | Supabase | enquanto a conta usar sync | exclusão pelo próprio usuário |
| Metadados de revisão/sync | Supabase/local | enquanto necessários para consistência | junto com o estado |
| Transcrição de fala | estado local/cloud, se sincronizado | enquanto integrar o estado de aprendizagem | junto com o estado |
| Áudio bruto | não armazenado pelo MON | não aplicável | não aplicável |
| Evidência de incidente | storage restrito a definir | prazo proporcional ao risco e obrigação aplicável | revisão periódica |
| Logs de infraestrutura | fornecedores | conforme configuração/contrato | validar antes da produção |

## Regras

1. Não manter dados indefinidamente sem finalidade.
2. Exclusão do estado cloud deve remover `mon_user_state` do usuário autenticado.
3. Exclusão completa da conta deve remover a identidade de autenticação por mecanismo server-side autorizado.
4. Cópias em backups de infraestrutura podem seguir ciclos técnicos de expiração, desde que não retornem ao uso operacional após solicitação válida de exclusão.
5. Exceções de retenção exigem fundamento, escopo, owner e data de revisão.
6. Logs não devem conter estado pedagógico completo, secrets ou transcrições sem necessidade.
