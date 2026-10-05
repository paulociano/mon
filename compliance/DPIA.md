# MON — RIPD / DPIA Inicial

**Versão:** 0.1 — pré-avaliação, não parecer jurídico

## Escopo

Conta MON, sincronização, adaptação pedagógica, transcrição de voz, conteúdo externo e possibilidade de uso por menores.

## Necessidade e proporcionalidade

O produto é local-first e pode funcionar sem conta. Cloud é opcional e serve a autenticação/sincronização. Adaptação usa sinais produzidos pelo próprio estudo. O desenho reduz centralização de dados, mas a sincronização passa a concentrar o estado pedagógico quando habilitada.

## Riscos iniciais

| Risco | Impacto | Controles atuais | Gap |
| --- | --- | --- | --- |
| acesso cruzado entre usuários | alto | RLS por auth.uid | manter testes |
| sobrescrita/perda de progresso | médio | revision/CAS/conflict + backup | manter testes |
| conta comprometida por e-mail | médio | OTP/magic link do fornecedor | revisar auth settings |
| exposição de learning_state | alto | RLS, sem service_role no client | revisar logs/backups/hosting |
| retenção excessiva | médio | política criada | implementar prazos/rotina |
| ausência de deleção total | médio/alto | delete de state | criar endpoint de exclusão da identidade |
| processamento externo de voz | médio | ação explícita + disclosure + sem áudio bruto no MON | manter disclosure por browser |
| terceiros de vídeo/CDN | baixo/médio | carregamento parcial sob ação | validar necessidade e termos |
| menores + perfilamento pedagógico | alto se aplicável | política protetiva, sem ads | decisão de idade + avaliação específica |
| transferência internacional | médio/alto | inventário | confirmar região/mecanismo |

## Perfilamento/adaptação

Next Best Lesson, Mastery Graph e Learning Evidence usam sinais de comportamento de estudo para organizar atividades. O sistema não deve extrapolar para inferências de saúde, personalidade, capacidade geral ou elegibilidade.

Se menores forem admitidos, este fluxo deve ser reavaliado antes da produção sob a legislação vigente.

## Conclusão

O desenho técnico apresenta bons controles de minimização e isolamento, mas a produção pública fica condicionada a:
1. identificação do controlador e canais;
2. exclusão completa da identidade;
3. validação contratual/transferência internacional dos fornecedores;
4. decisão formal sobre menores;
5. revisão jurídica dos documentos publicados.
