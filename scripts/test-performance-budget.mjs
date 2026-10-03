import fs from 'node:fs';
import assert from 'node:assert/strict';

const size=p=>fs.statSync(p).size;
const kb=n=>Math.round(n/1024*10)/10;

const eagerScripts=['data/course-content.js','core/state.js','core/review-scheduler.js','core/performance.js','app.js'];
const dataScripts=['data/kanji.js','data/kana.js','data/foundation.js','data/session.js','data/experiences.js','data/curriculum.js'];
const foundationRouteScripts=['data/kana.js','data/foundation.js'];
const experienceRouteScripts=['data/kana.js','data/experiences.js'];
const kanjiRouteScripts=['data/kanji.js'];
const featureScripts=['features/foundation.js','features/session.js','features/kanji.js','features/experiences.js'];
const lazyScripts=['data/content-packs.js','core/mistakes.js','core/mastery-graph.js','core/learning-methods.js','core/course-engine.js','core/progression-engine.js'];
const eagerJs=eagerScripts.reduce((n,p)=>n+size(p),0);
const featureJs=featureScripts.reduce((n,p)=>n+size(p),0);
const dataJs=dataScripts.reduce((n,p)=>n+size(p),0);
const foundationRouteJs=foundationRouteScripts.reduce((n,p)=>n+size(p),0);
const experienceRouteJs=experienceRouteScripts.reduce((n,p)=>n+size(p),0);
const kanjiRouteJs=kanjiRouteScripts.reduce((n,p)=>n+size(p),0);
const lazyJs=lazyScripts.reduce((n,p)=>n+size(p),0);
const css=size('styles.css'),featureCss=size('features/foundation.css'),html=size('index.html');
const hero=size('assets/scene/mon-home-banner.webp'),side=size('assets/scene/mon-sidebar-bg.webp');

assert.ok(eagerJs<=92*1024,`eager JS budget exceeded: ${kb(eagerJs)} KB`);
assert.ok(dataJs<=64*1024,`total lazy dataset budget exceeded: ${kb(dataJs)} KB`);
assert.ok(foundationRouteJs<=28*1024,`Foundation route data budget exceeded: ${kb(foundationRouteJs)} KB`);
assert.ok(experienceRouteJs<=9*1024,`Experience route data budget exceeded: ${kb(experienceRouteJs)} KB`);
assert.ok(kanjiRouteJs<=11*1024,`Kanji route data budget exceeded: ${kb(kanjiRouteJs)} KB`);
assert.ok(featureJs<=72*1024,`feature runtime budget exceeded: ${kb(featureJs)} KB`);
assert.ok(lazyJs<=90*1024,`lazy learning runtime budget exceeded: ${kb(lazyJs)} KB`);
assert.ok(css<=105*1024,`CSS budget exceeded: ${kb(css)} KB`);
assert.ok(featureCss<=30*1024,`feature CSS budget exceeded: ${kb(featureCss)} KB`);
assert.ok(html<=48*1024,`HTML budget exceeded: ${kb(html)} KB`);
assert.ok(size('app.js')<=55*1024,`app.js should stay below 55 KB after feature split: ${kb(size('app.js'))} KB`);
assert.ok(hero<=20*1024,`hero image budget exceeded: ${kb(hero)} KB`);
assert.ok(side<=20*1024,`sidebar image budget exceeded: ${kb(side)} KB`);

const source=fs.readFileSync('app.js','utf8');
assert.ok(!source.includes('renderKanjiList();selectKanji(0);renderCurriculum'),'hidden views must not render at boot');
assert.ok(source.includes("const hydratedViews=new Set(['home'])"),'view hydration registry missing');
assert.ok(source.includes('ensureDrawingCanvases'),'canvas setup should be lazy');

console.log('MON performance budgets passed',JSON.stringify({
 eagerJsKB:kb(eagerJs),dataJsKB:kb(dataJs),foundationRouteKB:kb(foundationRouteJs),experienceRouteKB:kb(experienceRouteJs),kanjiRouteKB:kb(kanjiRouteJs),featureJsKB:kb(featureJs),lazyJsKB:kb(lazyJs),cssKB:kb(css),featureCssKB:kb(featureCss),htmlKB:kb(html),heroKB:kb(hero),sidebarKB:kb(side)
}));
