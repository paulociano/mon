# Changelog

## 0.1.0 — 2026-10-05

Primeira release formalmente identificada do MON.

### Added
- release identity verificável no runtime e no PWA;
- health diagnostics locais e privacy-first;
- dedicated maskable icon;
- incident response runbook;
- executable contracts para versão e runtime health.

### Security
- nenhum erro bruto, stack trace, URL visitada, conteúdo digitado ou identificador de conta é enviado por telemetria;
- runtime health permanece local, limitado a 7 dias e 50 eventos.

### Known limitations
- GitHub Pages ainda publica em paralelo ao Quality Gate até a configuração administrativa ser migrada;
- Leaked Password Protection do Supabase ainda requer habilitação no console;
- Supabase JS continua vindo de jsDelivr no runtime;
- PNG 192/512 e Apple touch icon ainda não estão versionados.
