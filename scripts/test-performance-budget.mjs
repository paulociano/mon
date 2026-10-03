import fs from 'node:fs';
import assert from 'node:assert/strict';

const size=p=>fs.statSync(p).size;
const kb=n=>Math.round(n/1024*10)/10;

const eagerScripts=['data/course-content.js','core/state.js','core/review-scheduler.js','app.js'];
const featureScripts=['features/foundation.js','features/session.js'];
const lazyScripts=['data/content-packs.js','core/mistakes.js','core/mastery-graph.js','core/learning-methods.js','core/course-engine.js','core/progression-engine.js'];
const eagerJs=eagerScripts.reduce((n,p)=>n+size(p),0);
const featureJs=featureScripts.reduce((n,p)=>n+size(p),0);
const lazyJs=lazyScripts.reduce((n,p)=>n+size(p),0);
const css=size('styles.css'),html=size('index.html');
const hero=size('assets/scene/mon-home-banner.webp'),side=size('assets/scene/mon-sidebar-bg.webp');

assert.ok(eagerJs<=145*1024,`eager JS budget exceeded: ${kb(eagerJs)} KB`);
assert.ok(featureJs<=60*1024,`feature runtime budget exceeded: ${kb(featureJs)} KB`);
assert.ok(lazyJs<=90*1024,`lazy learning runtime budget exceeded: ${kb(lazyJs)} KB`);
assert.ok(css<=140*1024,`CSS budget exceeded: ${kb(css)} KB`);
assert.ok(html<=48*1024,`HTML budget exceeded: ${kb(html)} KB`);
assert.ok(hero<=20*1024,`hero image budget exceeded: ${kb(hero)} KB`);
assert.ok(side<=20*1024,`sidebar image budget exceeded: ${kb(side)} KB`);

const source=fs.readFileSync('app.js','utf8');
assert.ok(!source.includes('renderKanjiList();selectKanji(0);renderCurriculum'),'hidden views must not render at boot');
assert.ok(source.includes("const hydratedViews=new Set(['home'])"),'view hydration registry missing');
assert.ok(source.includes('ensureDrawingCanvases'),'canvas setup should be lazy');

console.log('MON performance budgets passed',JSON.stringify({
 eagerJsKB:kb(eagerJs),featureJsKB:kb(featureJs),lazyJsKB:kb(lazyJs),cssKB:kb(css),htmlKB:kb(html),heroKB:kb(hero),sidebarKB:kb(side)
}));
