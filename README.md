<p align="center">
  <img src="assets/brand/mon-lockup.svg" alt="MON 門 Japanese OS" width="520">
</p>

<p align="center">
  <strong>Aprenda japonês do zero à vida real.</strong><br>
  Fundação Zero · Kana · Gramática · Kanji Atlas · Conversação · Missões no Japão
</p>

# MON 門 Japanese OS

Aplicação web/PWA para aprender japonês do zero à vida real. O produto combina Fundação Zero (pronúncia, hiragana e katakana), gramática progressiva, Kanji Atlas, prática adaptativa, microlições gamificadas, XP, sequência, energia, histórias, conversação e missões de sobrevivência no Japão.

## Rodar localmente

```bash
python -m http.server 8080
```

Abra `http://localhost:8080`.

## Estrutura

- `index.html` — estrutura da aplicação
- `styles.css` — sistema visual e responsividade
- `app.js` — estado, motores de aprendizagem e comportamento da interface
- `data/course-content.js` — conteúdo-base de kana, gramática, currículo, kanji e leituras
- `assets/brand/` — masters SVG da marca MON
- `assets/scene/` — ilustrações SVG originais usadas na interface
- `manifest.json` + `sw.js` — PWA/offline

## Marca

O símbolo combina o kanji `門` (mon, “portão”) com um lintel inspirado em torii. O master vetorial e as variantes ficam em `assets/brand/`.

Paleta principal: Sumi/Indigo `#0A1626`, Shu Vermilion `#E64D3D`, Washi Ivory `#F4E8D2`.

## Arquitetura de conteúdo

O conteúdo didático começa a ser separado da lógica da aplicação para permitir expansão do curso sem aumentar indefinidamente o arquivo principal. A primeira camada modular está em `data/course-content.js`; as próximas migrações separarão prática, SRS, gamificação e conteúdo por nível.
