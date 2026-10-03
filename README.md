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
- `app.js` — conteúdo, estado local e motores de aprendizagem
- `assets/brand/` — masters SVG da marca MON
- `assets/scene/` — ilustrações SVG originais usadas na interface
- `manifest.json` + `sw.js` — PWA/offline

## Marca

O símbolo combina o kanji `門` (mon, “portão”) com um lintel inspirado em torii. O master vetorial e as variantes ficam em `assets/brand/`.

Paleta principal: Sumi/Indigo `#0A1626`, Shu Vermilion `#E64D3D`, Washi Ivory `#F4E8D2`.