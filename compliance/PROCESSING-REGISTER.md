# MON — Registro Simplificado de Operações de Tratamento

**Versão:** 0.1 — baseline para revisão jurídica

| ID | Operação | Dados | Finalidade | Sistema | Terceiros | Base a validar | Retenção |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | persistência local | perfil/progresso | continuidade do estudo | browser | nenhum | execução do serviço | enquanto usuário mantiver |
| P02 | autenticação | e-mail/user id | acesso à Conta MON | Supabase Auth | Supabase | execução do serviço | enquanto conta existir |
| P03 | sync | perfil/learning_state | multi-device e recovery | Supabase DB | Supabase | execução do serviço | enquanto sync/conta |
| P04 | adaptação pedagógica | histórico, erros, mastery, retenção | recomendar próxima atividade | browser | nenhum; Supabase apenas como storage quando sync | execução do serviço / legítimo interesse a avaliar | junto ao estado |
| P05 | reconhecimento de voz | áudio em trânsito; transcrição transitória; alvo/score/timestamp | shadowing e pista textual | browser/SO + MON | fornecedor do browser/SO | ação solicitada pelo usuário; validar enquadramento | áudio e texto reconhecido não armazenados pelo MON; score/metadados junto ao estado |
| P06 | vídeo externo | metadados técnicos após clique | apoio educacional | YouTube | Google/YouTube | validar conforme configuração | conforme terceiro; sem contato de thumbnail/player antes do clique |
| P07 | segurança/incidente | metadados mínimos | proteger serviço e cumprir obrigações | infraestrutura a definir | fornecedores de infra | legítimo interesse/obrigação legal a validar | prazo definido por política |

## Cobertura desconhecida

Antes da produção ainda precisam ser confirmados:
- CPF/CNPJ do controlador e canais de suporte/privacidade;
- mecanismo contratual de transferência internacional aplicável ao Supabase sob a Resolução CD/ANPD nº 19/2024;
- acompanhamento de mudanças na lista de subprocessadores do Supabase;
- logs de hosting/CDN;
- base legal final por operação;
- salvaguardas e avaliação específica para menores sob a política sem restrição etária;
- revisão jurídica final das operações e bases legais.


## Evidência de fornecedor atualizada

Para P02/P03, já foram observados: projeto MON em `sa-east-1`, DPA vigente do Supabase, lista oficial de subprocessadores e identificação contratual da Supabase Pte. Ltd. como importador no anexo de SCCs. Permanece pendente a validação jurídica do mecanismo de transferência internacional aplicável ao controlador brasileiro.
