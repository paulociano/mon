# MON — Inventário de Dados e Fluxos

**Versão:** 0.1

## Fluxos principais

### Local-first

```text
Usuário
  → browser
  → localStorage
     ├─ perfil
     ├─ progresso
     ├─ erros/revisões
     ├─ mastery/learning evidence
     ├─ journal/missões
     └─ pronúncia/transcrição
```

### Conta e sincronização

```text
Usuário
  → Supabase Auth (e-mail / user id)
  → sessão no browser
  → mon_user_state
     ├─ profile
     ├─ learning_state
     ├─ sync_version
     ├─ revision
     └─ timestamps
```

### Voz

```text
ação explícita
  → SpeechRecognition do browser/SO
  → processamento conforme fornecedor
  → transcrição retornada ao MON
  → estado local
  → cloud somente se Conta MON + sync
```

### Vídeo

```text
grade MON
  → thumbnail externa
clique do usuário
  → youtube-nocookie player
  → tratamento definido pelo terceiro
```

## Classificação operacional

| Dado | Classe | Fonte | Storage | Compartilhamento |
| --- | --- | --- | --- | --- |
| e-mail | pessoal | usuário/auth | auth/session | Supabase |
| nome de perfil | pessoal | usuário | local/cloud | Supabase se sync |
| progresso de estudo | pessoal comportamental | uso | local/cloud | Supabase se sync |
| erros e mastery | pessoal comportamental | uso | local/cloud | Supabase se sync |
| journal | potencialmente pessoal por conteúdo livre/estruturado | uso | local/cloud | Supabase se sync |
| transcrição | pessoal/contextual; pode conter conteúdo livre | fala | local/cloud | fornecedor de reconhecimento + Supabase se sync |
| áudio bruto | sensível ao contexto, mas não persistido pelo MON | microfone | não armazenado pelo MON | pode ser processado pelo fornecedor do reconhecimento |
| timestamps | metadado | sistema | local/cloud | Supabase se sync |

## Regras de mudança

Toda feature que introduzir nova classe de dado deve declarar:
- finalidade;
- origem;
- storage;
- terceiros;
- retenção;
- deleção;
- proteção;
- base legal a validar;
- impacto em menores quando aplicável.
