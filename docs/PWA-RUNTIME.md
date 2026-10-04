# MON — PWA Runtime Resilience

> O PWA deve continuar utilizável durante perda de rede e deve atualizar sem apagar caches que não pertencem ao MON.

## Cache ownership

O Service Worker usa:

- `CACHE_PREFIX = mon-japanese-os-`
- versão explícita de cache;
- limpeza limitada a caches que começam com o prefixo do MON.

O MON não apaga caches arbitrários da mesma origem.

## Update flow

Instalações novas não chamam `skipWaiting` automaticamente.

Quando existe uma versão em espera:

1. a aplicação mostra o banner de atualização;
2. o usuário aciona a atualização;
3. a página envia `SKIP_WAITING`;
4. o novo worker assume controle;
5. a aplicação recarrega no `controllerchange`.

Isso reduz troca de versão no meio de uma sessão.

## Offline behavior

O smoke offline usa um Service Worker real no Chromium:

1. inicia online;
2. espera o worker controlar a página;
3. aquece Home, Progresso e Practice;
4. grava progresso local;
5. corta a rede;
6. recarrega a aplicação;
7. confirma que Home abre pelo cache;
8. confirma persistência do progresso;
9. abre Progresso e Practice ainda offline.

O teste valida comportamento observado, não apenas presença de arquivos no `CORE`.

## Estratégias de cache

- navegação: network-first com fallback para shell;
- scripts e styles: network-first, usando cache em falha;
- demais assets: stale-while-revalidate;
- recursos externos não são interceptados pelo Service Worker do MON.

## Cross-browser

O runtime mínimo é exercitado em:

- Chromium;
- Firefox;
- WebKit.

Firefox e WebKit validam:

- boot do shell;
- navegação para views lazy;
- carregamento de Progresso;
- persistência local após reload;
- ausência de page errors no fluxo.

O smoke cross-browser não testa APIs opcionais como speech synthesis/microfone como se fossem uniformes entre engines.

## Limites

Offline completo de toda feature exige que seus recursos tenham sido previamente carregados/cacheados. O contrato atual garante shell e superfícies críticas aquecidas, não promete download antecipado de todo o currículo.

Vídeos externos e sync de nuvem continuam dependentes de rede.

## Quality Gate

O CI executa:

- contratos estáticos do Service Worker;
- browser smoke principal em Chromium;
- offline smoke real em Chromium;
- runtime smoke em Firefox;
- runtime smoke em WebKit.
