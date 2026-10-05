# MON — Resposta a Incidentes de Segurança

**Versão:** 0.1

## Objetivo

Responder a incidentes sem improviso, preservando evidência, limitando impacto e avaliando obrigações de comunicação.

## Severidade operacional

- **S0 — evento sem impacto confirmado:** sinal técnico, falso positivo possível.
- **S1 — incidente limitado:** impacto pequeno, sem exposição relevante confirmada.
- **S2 — incidente relevante:** acesso indevido, perda de confidencialidade/integridade/disponibilidade com potencial de risco ao titular.
- **S3 — crítico:** exposição ampla, credenciais privilegiadas, comprometimento sistêmico, menores ou dados de alto impacto.

A classificação operacional não substitui avaliação jurídica de risco ou dano relevante.

## Fluxo

1. registrar horário, fonte e sistema afetado;
2. conter sem destruir evidência;
3. revogar/rotacionar credenciais comprometidas;
4. preservar logs necessários com acesso restrito;
5. determinar dados, usuários, período e terceiros afetados;
6. avaliar confidencialidade, integridade e disponibilidade;
7. avaliar risco ou dano relevante aos titulares;
8. envolver responsável jurídico/privacidade quando houver dados pessoais;
9. quando aplicável, preparar comunicação à ANPD e aos titulares dentro do prazo regulatório vigente;
10. corrigir causa raiz;
11. validar restauração;
12. registrar postmortem, ações e reteste.

## Regra temporal

O baseline deve considerar a Resolução CD/ANPD nº 15/2024, atualmente vigente, que prevê comunicação pelo controlador em até três dias úteis nos casos abrangidos. O relógio exato e a aplicabilidade devem ser confirmados no incidente real.

## Evidência mínima

- incident_id;
- detected_at;
- confirmed_at;
- systems;
- data categories;
- estimated subjects;
- containment;
- root cause;
- notifications decision;
- owner;
- remediation;
- retest;
- closed_at.

## Proibições

- não publicar PII/secrets no GitHub;
- não testar credenciais vazadas contra terceiros sem autorização;
- não apagar logs antes de preservar evidência necessária;
- não afirmar “sem impacto” por ausência de telemetria.
