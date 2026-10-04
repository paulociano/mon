<p align="center">
  <img src="assets/brand/mon-lockup.svg" alt="MON 門 Japanese OS" width="520">
</p>

<p align="center">
  <strong>Aprenda japonês do zero à vida real.</strong><br>
  Uma PWA de aprendizagem adaptativa pensada para quem fala português/inglês e precisa construir autonomia no Japão.
</p>

<p align="center">
  <img src="assets/readme/mon-summary.svg" alt="Resumo visual do MON Japanese OS" width="100%">
</p>

# MON 門 Japanese OS

O **MON** é uma aplicação web/PWA para aprender japonês desde o zero absoluto até situações reais do cotidiano. Em vez de organizar o estudo apenas como listas de palavras ou exercícios repetidos, o produto combina **Fundação Zero, SRS, Mastery Graph, narrativa recorrente, prática adaptativa, Kanji Memory Lab, listening, fala e missões de sobrevivência**.

A interface segue uma identidade japonesa contemporânea: sumi/indigo, shu vermilion, washi, dourado, tipografia editorial, torii, sakura e padrões culturais tratados de forma discreta.

<p align="center">
  <img src="assets/readme/mon-features.svg" alt="Mapa visual de funcionalidades do MON" width="100%">
</p>

## O que já existe

| Área | O que faz |
| --- | --- |
| **Fundação Zero** | Som, hiragana, katakana, gramática inicial e saída gradual do romaji |
| **Home Coach** | Escolhe uma próxima ação principal usando sinais reais do aluno |
| **Next Best Lesson Engine** | Monta a receita da próxima sessão a partir de revisão, erros, domínio e narrativa |
| **Daily Loop adaptativo** | Alterna ouvir, recuperar, aprender, aplicar, transferir e produzir |
| **SRS + Caderno de Erros** | Agenda memória e reapresenta padrões que continuam falhando |
| **Mastery Graph** | Separa evidência de reconhecimento, recall, listening e produção |
| **Kanji Memory Lab 2.0** | Famílias visuais, contraste, sentido → forma, forma → leitura e escrita |
| **Listening & Pronunciation Lab** | Mora, vogais longas, っ, ん, shadowing e autoavaliação |
| **Survival Missions 2.0** | Cenários ramificados com reparo de conversa e objetivo observável |
| **Diário no Japão** | Registra personagens, lugares, callbacks e situações resolvidas |
| **Vídeos** | Biblioteca de apoio visual lazy, com player externo somente no clique |
| **PWA/offline** | Shell e features cacheados para uso resiliente |
| **Performance Lab** | Diagnóstico local opcional via `?debug=1` |

## Princípios pedagógicos

- **recuperar antes de rever**;
- avançar por **domínio demonstrado**, não apenas por conclusão;
- intercalar reconhecimento, listening, recall, transferência e produção;
- ensinar gramática com modelos mentais em português, evitando equivalências literais enganosas;
- reutilizar conteúdo em personagens, lugares e situações recorrentes;
- tratar reconhecimento de voz como **pista textual**, não como avaliação fonética clínica;
- usar vídeo como apoio, nunca como substituto de prática ativa.

## Arquitetura

O projeto usa uma arquitetura progressivamente modular e lazy:

```text
index.html
├── shell crítico
├── data/                 conteúdo
├── core/                 estado + motores pedagógicos
├── features/             superfícies carregadas sob demanda
├── assets/               marca, cenas e banners
├── scripts/              contratos e budgets
└── .github/workflows/    Quality Gate
```

Algumas fronteiras importantes:

- `core/home-coach.js` — próxima melhor ação da Home;
- `core/next-best-lesson.js` — receita adaptativa da próxima sessão;
- `core/review-scheduler.js` — revisão espaçada;
- `core/mastery-graph.js` — evidência de domínio;
- `data/narrative.js` + `core/narrative-state.js` — memória narrativa;
- `features/pronunciation.js` — Listening & Pronunciation Lab;
- `features/kanji-memory.js` — Kanji Memory Lab 2.0;
- `features/missions-v2.js` — Survival Missions 2.0.

## Performance

A regra arquitetural é simples: **uma nova feature não deve automaticamente virar custo de boot**.

O projeto possui budgets separados para shell, datasets e features lazy. O Quality Gate falha se uma fronteira ultrapassar os limites definidos em `scripts/test-performance-budget.mjs`.

O `Performance Lab` pode ser ativado localmente com:

```text
?debug=1
```

Ele mostra timings locais, long tasks, recursos mais lentos e estado de cache, sem telemetria externa.

## Rodar localmente

```bash
python -m http.server 8080
```

Abra:

```text
http://localhost:8080
```

## Qualidade e segurança

O workflow `.github/workflows/quality.yml` verifica, entre outros:

- sintaxe JavaScript;
- contratos estáticos;
- curriculum/content quality;
- review scheduler;
- Gate Loop;
- adaptive teaching;
- Mastery Graph;
- narrativa e persistência;
- Home Coach;
- Next Best Lesson Engine;
- Daily Loop;
- Pronunciation Lab;
- Kanji Memory Lab;
- Survival Missions;
- lazy loading;
- budgets de performance;
- PWA/cache;
- integridade e segurança do repositório.

## Roadmap

O roadmap operacional fica em [`docs/ROADMAP.md`](docs/ROADMAP.md).

A ordem é por **dependência e ganho de aprendizagem**, não por volume de funcionalidades. O **gate estrutural N5 está concluído** e documentado em [`docs/N5-READINESS.md`](docs/N5-READINESS.md); retenção, transferência e autonomia continuam em validação longitudinal. O foco seguinte é formalizar o N4 por capacidades observáveis e instrumentar métricas de aprendizagem.

## Marca

O símbolo combina o kanji `門` (*mon*, “portão”) com um lintel inspirado em torii.

Masters vetoriais:

- `assets/brand/mon-lockup.svg`
- `assets/brand/mon-mark.svg`
- `assets/brand/mon-mark-reversed.svg`
- `assets/brand/mon-mark-mono.svg`

Paleta principal:

- Sumi / Indigo `#0A1626`
- Shu Vermilion `#E64D3D`
- Washi Ivory `#F4E8D2`
- Kin Gold `#D7B56D`
- Jade `#63D3C2`

## Documentação

- [Roadmap](docs/ROADMAP.md)
- [N5 Readiness Gate](docs/N5-READINESS.md)
- [N4 Capability Contract](docs/N4-CAPABILITIES.md)
- [Learning Metrics](docs/LEARNING-METRICS.md)
- [Learning Validation](docs/LEARNING-VALIDATION.md)
- [Next Best Lesson Calibration](docs/NBL-CALIBRATION.md)
- [State Recovery & Backup](docs/STATE-RECOVERY.md)
- [PWA Runtime Resilience](docs/PWA-RUNTIME.md)
- [Accessibility & Microphone Policy](docs/ACCESSIBILITY-MICROPHONE.md)
- [Latency Observability](docs/LATENCY-OBSERVABILITY.md)
- [Pesquisa de Quality Engineering](docs/QUALITY-RESEARCH-2026-10-03.md)
- [Segurança](SECURITY.md)
- [Contribuição](CONTRIBUTING.md)
- [Licença e dependências](docs/LICENSE-STATUS.md)

---

<p align="center">
  <strong>門を開く。Abra o portão.</strong><br>
  Japonês como sistema de autonomia, não apenas como coleção de lições.
</p>