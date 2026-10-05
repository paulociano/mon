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
     └─ pronúncia/score e metadados
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
  → exibição transitória na tela
  → somente alvo/score/timestamp podem ir ao estado local/cloud
```

### Vídeo

```text
grade MON
  → poster local, sem request ao YouTube
clique do usuário
  → youtube-nocookie player sem autoplay
  → tratamento definido pelo terceiro
```

## Classificação operacional

| Dado | Classe | Fonte | Storage | Compartilhamento |
| --- | --- | --- | --- | --- |
| e-mail | pessoal | usuário/auth | auth/session | Supabase |
| nome de perfil | pessoal | usuário | local/cloud | Supabase se sync |
| progresso de estudo | pessoal comportamental | uso | local/cloud | Supabase se sync |
| erros e mastery | pessoal comportamental | uso | local/cloud | Supabase se sync |
| journal narrativo | progresso estruturado de episódios/missões | uso | local/cloud | Supabase se sync |
| transcrição de voz | pessoal/contextual; pode conter conteúdo livre | fala | transitória na UI; não persistida pelo MON | fornecedor de reconhecimento do browser/SO |
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
