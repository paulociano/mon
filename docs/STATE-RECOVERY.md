# MON — State Recovery & Backup

> O progresso local do MON é tratado como estado versionado e input não confiável. Upgrades e imports precisam preservar uma rota de recuperação antes de substituir dados válidos.

## Schema atual

- `MON_SAVE_VERSION = 2`
- migrations são aplicadas sequencialmente em `core/state.js`
- versões futuras são rejeitadas
- saves sem versão entram pelo caminho legado e são migrados passo a passo

## Migration v1 → v2

A primeira migration explícita formaliza o histórico de Learning Evidence:

- mantém os eventos existentes;
- limita o histórico aos 600 eventos mais recentes;
- preserva o restante do progresso;
- grava o save original v1 em `mon-state-backup` antes de persistir o v2.

O backup pré-migration é a cópia last-known-good e não deve ser apagado antes que o estado migrado seja validado.

## Recovery local

O MON usa três chaves:

- `mon-state`: estado ativo;
- `mon-state-backup`: último estado válido / pré-migration;
- `mon-state-corrupt-last`: último payload primário ilegível rejeitado.

No boot:

1. tenta validar e migrar `mon-state`;
2. se houver upgrade, preserva o original em backup e persiste a versão migrada;
3. se o primário estiver corrompido, preserva o bruto em `mon-state-corrupt-last`;
4. tenta recuperar `mon-state-backup`;
5. somente então cai para defaults.

## Export / import

O export continua usando o envelope versionado de sync:

- `syncVersion`;
- perfil;
- `learningState` normalizado.

O import:

1. faz parse do arquivo;
2. valida `syncVersion`;
3. valida e migra `learningState`;
4. normaliza preferências de perfil;
5. só depois preserva o estado atual em `mon-state-backup`;
6. substitui o estado ativo.

Se qualquer validação falhar, estado e perfil atuais permanecem intactos.

## Limites

O import local não resolve conflito de nuvem. A política de merge entre dispositivos pertence à etapa de sync e deve usar revision/etag ou outra autoridade explícita, nunca apenas horário local.

Também não há promessa de criptografia ou anti-tampering para save local: conteúdo local é tratado como input não confiável e validado antes do uso.

## Gates

O Quality Gate cobre:

- clean/default state;
- save legado sem versão;
- v1 → v2;
- preservação do backup pré-migration;
- versão futura;
- estado primário corrompido;
- recuperação por backup;
- rotação de backup em save;
- import válido;
- import inválido sem mutação;
- backup importado de versão anterior;
- smoke de reload no navegador.
