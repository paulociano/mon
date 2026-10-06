# MON — Conta e sincronização multi-device

> A sincronização do MON preserva progresso por revisão otimista. Nenhum dispositivo pode sobrescrever silenciosamente mudanças feitas por outro.

## Estado sincronizado

A Conta MON sincroniza:

- perfil local;
- estado pedagógico completo;
- Learning Evidence;
- erros e recuperação;
- Mastery Graph;
- progresso de missão;
- Journal;
- Kanji/Pronunciation;
- demais campos persistentes do save versionado.

O envelope continua usando `syncVersion`. O `learning_state` continua sujeito às migrations normais do MON.

## Revisões

Cada linha em `mon_user_state` possui `revision`.

Fluxo de escrita:

1. o cliente lê a revisão remota;
2. envia update condicionado à revisão esperada;
3. o write incrementa a revisão;
4. se a revisão já mudou, o update não encontra a linha esperada;
5. o MON trata isso como `MON_SYNC_CONFLICT`.

O adapter não usa `upsert` cego para updates multi-device.

## Dirty state

Toda chamada de `save()` marca `mon-sync-dirty-at`.

Alterações de perfil também marcam o dispositivo como dirty.

Após sync concluído, o marcador é removido.

Quando a Conta MON já foi ligada neste navegador, o app carrega o runtime de conta em idle e tenta reconciliar sem colocar Supabase no caminho crítico do boot.

## Reconciliation

Estados possíveis:

- **remote ausente** → cria o estado remoto;
- **apenas local mudou** → push com revisão esperada;
- **apenas nuvem mudou** → pull;
- **nenhum mudou** → current;
- **ambos mudaram** → conflito explícito;
- **revisão remota regrediu** → conflito, nunca rollback silencioso.

Um dispositivo novo com estado local significativo não é sobrescrito automaticamente por uma conta já existente. Isso também vira conflito explícito.

## Resolução de conflito

O MON não faz merge campo a campo do save pedagógico.

A UI oferece duas ações:

- **usar este dispositivo**: escreve o estado local sobre a revisão remota atual;
- **usar nuvem**: aplica o estado remoto localmente.

Antes de substituir estado local, o save atual vai para `mon-state-backup`.

Quando um conflito é detectado, a versão remota também é preservada em `mon-cloud-conflict-last`.

## Identidade

Se a sessão Supabase mudar para outro usuário, a revisão conhecida da conta anterior é descartada e a nova identidade começa a reconciliar em revisão 0.

Isso evita reutilizar metadata de sync de uma conta diferente.

## Auth

A implementação usa e-mail + senha via Supabase Auth.

Fluxos suportados:

- cadastro com confirmação de e-mail;
- login direto com e-mail + senha;
- alteração de senha para sessão autenticada;
- recuperação de senha por e-mail com `resetPasswordForEmail`;
- retorno do link de recovery para uma sessão válida;
- definição da nova senha com `updateUser`.

Sessão:

- persiste no navegador;
- usa auto refresh;
- usa `detectSessionInUrl`;
- pode retomar sync após confirmação de cadastro ou recuperação de senha.

## Segurança

A tabela usa Row Level Security e políticas por `auth.uid()`.

A aplicação web aceita apenas URL pública do projeto e publishable key. Nunca deve conter `service_role`.

## Ativação do backend

O ambiente publicado resolve configuração browser-safe nesta ordem:

1. `globalThis.MON_CLOUD_RUNTIME_CONFIG`;
2. meta tag de deploy `mon-supabase-publishable-key`;
3. Edge Function pública `public-config`.

A URL pública do projeto fica em `config/cloud.js`. A publishable key é material público de cliente e pode ser entregue ao browser somente com RLS e grants mínimos protegendo os dados. Secret key e service role nunca pertencem ao frontend ou ao repositório.

## Quality Gate

O CI valida:

- RLS;
- ausência de service-role no browser;
- revisionamento;
- compare-and-set em updates;
- ausência de blind upsert;
- push inicial;
- pull remoto;
- conflito bilateral;
- escolha local;
- escolha cloud;
- corrida de escrita;
- dispositivo novo com progresso local;
- troca de identidade;
- rollback de revisão;
- snapshot remoto do último conflito;
- dirty marker do save local;
- cadastro/login por senha;
- presença do fluxo de recuperação de senha;
- configuração pública sem material privilegiado.
