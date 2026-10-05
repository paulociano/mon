# MON — Legal & Compliance Release Gates

A Conta MON não deve ser aberta ao público enquanto qualquer gate P0 permanecer aberto.

## P0

- [ ] identificar controlador (nome/razão social + CPF/CNPJ conforme aplicável);
- [ ] definir e testar e-mail de suporte;
- [ ] definir e testar e-mail de privacidade/titular;
- [ ] revisão jurídica dos Termos e Política de Privacidade;
- [ ] decidir política de idade;
- [ ] implementar exclusão completa da identidade de autenticação por backend/Edge Function;
- [ ] validar região, DPA/termos e transferência internacional do Supabase;
- [ ] confirmar hosting/CDN de produção e respectivos logs/retention;
- [ ] publicar links visíveis para Termos e Privacidade na superfície de conta.

## P1

- [ ] validar necessidade de jsDelivr em runtime ou empacotar SDK;
- [ ] revisar comportamento de thumbnails/player do YouTube;
- [ ] definir procedimento operacional de incidentes e owner;
- [ ] definir prazos concretos de logs/backups;
- [ ] testar fluxo de exportação + exclusão cloud ponta a ponta.

## Critério

Gate só fecha com evidência. “Documento criado” não fecha controle técnico e “feature implementada” não fecha obrigação jurídica.
