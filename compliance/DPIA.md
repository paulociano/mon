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
| conta comprometida por credenciais | médio | e-mail + senha via Supabase Auth | revisar recuperação de senha, rate limits e auth settings |
| exposição de learning_state | alto | RLS, sem service_role no client | revisar logs/backups/hosting |
| retenção excessiva | médio | política criada | implementar prazos/rotina |
| ausência de deleção total | médio/alto | delete de state | criar endpoint de exclusão da identidade |
| processamento externo de voz | médio | ação explícita + disclosure + sem áudio bruto + transcrição não persistida | revisar fornecedores/browser e linguagem jurídica |
| terceiros de vídeo/CDN | baixo/médio | poster local; player `youtube-nocookie` só após clique; sem autoplay | validar termos/transferência do terceiro |
| menores + perfilamento pedagógico | alto | sem ads/social; local-first; voz minimizada; terceiros sob ação; aviso simples no cadastro | avaliação de melhor interesse, bases legais, aferição de idade/responsáveis e revisão jurídica |
| transferência internacional | médio/alto | projeto em `sa-east-1`; DPA e subprocessadores revisados | validar mecanismo contratual aplicável sob Res. CD/ANPD 19/2024 e transparência ao titular |

## Perfilamento/adaptação

Next Best Lesson, Mastery Graph e Learning Evidence usam sinais de comportamento de estudo para organizar atividades. O sistema não deve extrapolar para inferências de saúde, personalidade, capacidade geral ou elegibilidade.

Como o MON adotou política sem restrição etária, este fluxo deve ser reavaliado especificamente para menores antes da abertura pública definitiva.

## Conclusão

O desenho técnico apresenta bons controles de minimização e isolamento, mas a produção pública fica condicionada a:
1. complementação cadastral do controlador e definição dos canais;
2. exclusão completa da identidade;
3. validação jurídica do mecanismo de transferência internacional e incorporação contratual necessária;
4. conclusão das salvaguardas e avaliação específica para menores;
5. revisão jurídica dos documentos publicados.


## Baseline técnico para menores

A revisão técnica de 5 de outubro de 2026 adotou proteção universal por padrão, sem criar um banco de idades. O produto não precisa saber se o usuário é menor para aplicar os controles mais protetivos.

Foram verificados/implementados: ausência de coleta de nascimento/endereço/localização no cadastro; nenhuma publicidade comportamental ou recurso social; microfone por ação explícita; não persistência da transcrição reconhecida; remoção de texto legado; ausência de requests de thumbnail de YouTube antes do clique; player sem autoplay; e controles de exclusão.

Esse baseline técnico não conclui a avaliação jurídica de melhor interesse nem a adequação integral à Lei nº 15.211/2025/LGPD.
