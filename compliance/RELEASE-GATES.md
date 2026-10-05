# MON — Legal & Compliance Release Gates

A Conta MON não deve ser aberta ao público enquanto qualquer gate P0 permanecer aberto.

## P0

- [ ] identificar controlador (nome/razão social + CPF/CNPJ conforme aplicável);
- [ ] definir e testar e-mail de suporte;
- [ ] definir e testar e-mail de privacidade/titular;
- [ ] revisão jurídica dos Termos e Política de Privacidade;
- [ ] decidir política de idade;
- [x] implementar exclusão completa da identidade de autenticação por backend/Edge Function no repositório;
- [x] deployar a Edge Function `delete-account` no projeto Supabase MON (`sa-east-1`);
- [x] disponibilizar a publishable key ao frontend por runtime público controlado (`public-config`), sem expor secret/service-role;
- [x] configurar Site URL + Redirect URL do Supabase Auth para `https://paulociano.github.io/mon/` e observar cadastro/confirmação/login reais em produção;
- [x] validar isolamento RLS transacional entre usuários sintéticos, sem persistir contas de teste;
- [x] validar optimistic concurrency por `revision` (CAS), incluindo rejeição de revisão obsoleta;
- [x] validar `ON DELETE CASCADE` de `auth.users` para `mon_user_state` em transação com rollback;
- [x] validar cadastro real, confirmação de e-mail, login por senha e criação/atualização de `mon_user_state` em produção;
- [x] testar exclusão completa ponta a ponta com usuário autenticado real e confirmar `auth.users=0`, `auth.sessions=0` e `mon_user_state=0`;
- [x] provisionar o projeto Supabase MON em `sa-east-1`;
- [x] revisar região, DPA e lista oficial de subprocessadores do Supabase;
- [ ] validar juridicamente o mecanismo contratual de transferência internacional aplicável sob a Resolução CD/ANPD nº 19/2024;
- [x] confirmar GitHub Pages como hosting de produção (`https://paulociano.github.io/mon/`);
- [ ] confirmar política concreta de logs/retention do hosting/CDN;
- [ ] publicar links visíveis para Termos e Privacidade na superfície de conta.

## P1

- [ ] validar necessidade de jsDelivr em runtime ou empacotar SDK;
- [ ] revisar comportamento de thumbnails/player do YouTube;
- [ ] definir procedimento operacional de incidentes e owner;
- [ ] definir prazos concretos de logs/backups;
- [ ] testar fluxo de exportação + exclusão cloud ponta a ponta.

## Critério

Gate só fecha com evidência. “Documento criado” não fecha controle técnico e “feature implementada” não fecha obrigação jurídica.
