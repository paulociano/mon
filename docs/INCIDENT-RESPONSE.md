# MON — Incident Response & Runtime Health

## Owner

O owner técnico primário de incidentes do MON é o maintainer do repositório, `@paulociano`.

Enquanto os canais públicos de suporte e privacidade permanecerem em aberto nos release gates, o repositório é a fonte operacional de ownership. Isso não substitui os contatos legais ainda pendentes.

## Fontes de sinal

O MON usa sinais proporcionais à arquitetura atual:

- MON Quality Gate;
- GitHub Pages deployment status;
- Supabase security/performance advisors;
- health diagnostics locais do navegador;
- relatos reproduzíveis de usuários.

O runtime **não envia telemetria de erro para servidor** nesta fase.

## Runtime health local

`core/runtime-health.js` registra somente:

- categoria do evento;
- timestamp;
- versão do MON.

Categorias atuais:

- `js-error`;
- `resource-error`;
- `promise-rejection`.

Não são persistidos:

- mensagem do erro;
- stack trace;
- URL visitada;
- conteúdo digitado;
- e-mail;
- identificador de conta;
- payload de progresso.

Retenção local:

- janela máxima: **7 dias**;
- máximo: **50 eventos**;
- storage: navegador do próprio usuário;
- limpeza manual disponível via `MON_RUNTIME_HEALTH.clear()`.

Resumo local:

`MON_RUNTIME_HEALTH.summary()`

O usuário só compartilha esse resumo quando escolher fazê-lo.

## Severidade

### SEV-0
- perda ou corrupção ampla de progresso;
- exposição de credencial privilegiada;
- quebra de isolamento entre usuários;
- takeover de conta reproduzível;
- release público claramente inseguro.

Ação: interromper promoção, conter acesso/feature afetada quando possível, preservar evidência e priorizar correção antes de nova feature.

### SEV-1
- auth indisponível;
- sync falhando de forma ampla;
- PWA sem boot/offline após release;
- regressão cross-browser material;
- deploy incorreto com impacto relevante.

Ação: interromper novos releases, confirmar escopo, decidir rollback ou forward-fix e validar em runtime.

### SEV-2
- falha degradada ou localizada;
- problema visual sem bloqueio;
- regressão com workaround seguro.

Ação: registrar, priorizar e corrigir no ciclo normal com teste de regressão.

## Fluxo

1. **Detectar**
   - registrar release/commit afetado;
   - separar sintoma de hipótese.

2. **Conter**
   - parar promoção adicional;
   - evitar writes destrutivos;
   - revogar/rotacionar credenciais se houver exposição comprovada.

3. **Diagnosticar**
   - reproduzir;
   - comparar último release saudável;
   - revisar Quality Gate, Pages e Supabase;
   - usar runtime health apenas como contador/categoria.

4. **Decidir recuperação**
   - rollback do frontend somente quando compatível com schema e dados;
   - forward-fix quando rollback puder criar incompatibilidade;
   - migrations e Auth exigem análise específica.

5. **Verificar**
   - repetir jornada afetada;
   - rodar gates proporcionais;
   - confirmar browser/ambiente relevante.

6. **Comunicar**
   - impacto observado;
   - escopo;
   - workaround seguro, se houver;
   - status de recuperação;
   - itens ainda desconhecidos.

7. **Aprender**
   - causa;
   - por que o gate anterior não detectou;
   - teste/controle adicionado;
   - owner e follow-up.

## Evidência de release

Para incidentes ligados a release, registrar:

- versão MON;
- commit SHA;
- Quality Gate run;
- Pages deployment run;
- service-worker cache version;
- migrations aplicadas;
- rollback/forward-fix escolhido.

## Retenção e limites

- runtime health local: 7 dias / 50 eventos;
- Git history e release identity: preservados como evidência do projeto;
- GitHub Actions, GitHub Pages/CDN e Supabase possuem logs operacionais geridos pelos respectivos providers;
- os prazos desses logs de provider continuam sujeitos ao gate específico de retention/compliance e não são inferidos por este documento;
- o MON não cria um novo backend de logs nesta fase.

## Regra de privacidade

Observabilidade só pode crescer para telemetria remota depois de definir:

- finalidade;
- campos;
- minimização;
- base operacional/jurídica aplicável;
- retenção;
- acesso;
- deleção;
- subprocessadores;
- comunicação ao usuário quando necessária.
