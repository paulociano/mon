# MON — Legal & Compliance Release Gates

A Conta MON não deve ser aberta ao público enquanto qualquer gate P0 permanecer aberto.

## P0

- [ ] proteger `main`, exigir os Quality Gate checks antes do merge e migrar GitHub Pages de branch publishing para GitHub Actions com deploy dependente de validação;
- [x] identificar nominalmente o controlador: Paulo Henrique Graciano;
- [ ] complementar CPF/CNPJ do controlador, conforme aplicável;
- [ ] definir e testar e-mail de suporte (mantido em branco por decisão atual);
- [ ] definir e testar e-mail de privacidade/titular (mantido em branco por decisão atual);
- [ ] revisão jurídica dos Termos e Política de Privacidade;
- [x] decidir política de idade: sem restrição etária;
- [x] implementar baseline técnico protetivo universal para uso provável por crianças e adolescentes;
- [ ] concluir avaliação de melhor interesse, aferição de idade/responsáveis e revisão jurídica específica para menores;
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
- [x] publicar links visíveis para Termos e Privacidade na autenticação e superfície de conta.

## P1

- [x] implementar recuperação de senha por e-mail com redirect de recovery e troca autenticada de senha;
- [x] adicionar CSP baseline limitando scripts, conexões, frames, workers e objetos aos origins necessários;
- [x] tornar `updated_at` de `mon_user_state` autoritativo no servidor via trigger;
- [ ] habilitar Supabase Leaked Password Protection e repetir o security advisor;
- [ ] remover jsDelivr do runtime por self-host/bundle do SDK; até lá, manter versão exata + CSP allowlist;
- [x] revisar e endurecer thumbnails/player do YouTube: sem thumbnail remoto pré-clique, `youtube-nocookie`, sem autoplay;
- [x] definir procedimento operacional de incidentes e owner em `docs/INCIDENT-RESPONSE.md`;
- [x] definir retenção dos diagnostics locais do MON: 7 dias / 50 eventos, sem telemetria remota;
- [ ] confirmar e documentar prazos de logs/backups geridos por GitHub/Supabase;
- [ ] testar fluxo de exportação + exclusão cloud ponta a ponta;
- [x] estabelecer release identity `0.1.0`, changelog e coerência com cache do Service Worker;
- [x] adicionar runtime health local, privacy-first e sem persistência de erro bruto;
- [x] separar ícone PWA regular e maskable em assets distintos;
- [ ] adicionar PNG 192/512 e Apple touch icon;
- [ ] remover `unsafe-inline` da CSP após migrar handlers/styles inline para módulos e classes.

## Critério

Gate só fecha com evidência. “Documento criado” não fecha controle técnico e “feature implementada” não fecha obrigação jurídica.
