# MON — Supabase Vendor & Transfer Evidence

**Data da revisão:** 5 de outubro de 2026  
**Escopo:** evidência factual de fornecedor e transferência. Não é parecer jurídico.

## Estado observado

- Projeto: MON
- Project ref: `gpmobddlexssivfxzzjw`
- Região: `sa-east-1`
- Status observado: `ACTIVE_HEALTHY`
- Security Advisor: sem findings no momento da revisão
- Banco: PostgreSQL 17
- Edge Functions de produção: `delete-account` e `public-config`

## DPA e localização

O DPA vigente do Supabase estabelece que, quando o cliente direciona o processamento para uma região geográfica específica, os dados cobertos são armazenados e processados primariamente nessa região, ressalvadas exigências legais, instruções adicionais ou necessidades do serviço.

Para o MON, a região provisionada é `sa-east-1`.

O mesmo DPA permite processamento por Supabase e subprocessadores em outros locais sob as regras contratuais aplicáveis. Portanto, escolher São Paulo reduz a superfície geográfica primária, mas não elimina por si só a análise de transferência internacional.

## Papel do fornecedor

O DPA trata o Supabase como processor/service provider quando o cliente atua como controller/business.

No anexo de SCCs, o data importer indicado é:
- Supabase Pte. Ltd.
- Singapura

Isso é relevante porque o MON, se operado por controlador localizado no Brasil, precisa avaliar as operações que caracterizam transferência internacional sob a LGPD e a regulamentação da ANPD.

## Subprocessadores

O DPA incorpora uma lista oficial de subprocessadores mantida pelo Supabase e prevê mecanismo de notificação de mudanças. A página oficial consultada indicava atualização em 1º de junho de 2026.

O MON deve:
1. manter referência à lista oficial em vez de copiar uma fotografia estática como fonte de verdade;
2. definir owner para acompanhar mudanças;
3. revisar impacto de novos subprocessadores relevantes antes de mudanças materiais de tratamento.

## Incidentes e retenção contratual

O DPA vigente informa:
- notificação de incidente ao cliente sem demora indevida e, quando viável, em até 48 horas após ciência;
- assistência razoável em investigação e obrigações regulatórias;
- após término do contrato, janela de 30 dias para cópia/retorno dos dados cobertos e exclusão posterior das cópias processadas pelo Supabase/subprocessadores, conforme o DPA.

Esses prazos contratuais não substituem os prazos legais do controlador perante a ANPD ou titulares.

## Transferência internacional — Brasil

A Resolução CD/ANPD nº 19/2024 exige que o controlador verifique se a transferência:
- está sujeita à legislação brasileira;
- possui hipótese legal aplicável;
- utiliza mecanismo válido de transferência internacional;
- atende deveres de transparência ao titular.

O DPA do Supabase incorpora SCCs europeias e contém regras para outras jurisdições. Isso não é suficiente, por si só, para afirmar que o MON já atende ao mecanismo brasileiro vigente. A compatibilidade com as cláusulas-padrão da ANPD ou outro mecanismo válido deve ser revisada juridicamente e refletida no instrumento contratual aplicável.

## Evidência oficial consultada

- Supabase DPA: https://supabase.com/legal/customer-resources/data-processing-addendum
- Supabase Subprocessor List: https://supabase.com/legal/customer-resources/subprocessor-list
- ANPD Resolução CD/ANPD nº 19/2024: https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-19-de-23-de-agosto-de-2024

## Gate result

**Fechado:** diligência factual de região, DPA e subprocessadores.  
**Aberto:** validação jurídica do mecanismo de transferência internacional aplicável ao MON e adequação contratual correspondente.
