import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const coach=fs.readFileSync('core/home-coach.js','utf8');

assert.ok(app.includes('function shellLocalDateKey(date=new Date())'),'boot-critical local date helper must live in app shell');
assert.ok(!/\blocalDateKey\s*\(/.test(app),'app shell must not depend on lazy localDateKey');
for(const token of ["todayQuestState(){const d=shellLocalDateKey()","updateGameStreak(){const today=shellLocalDateKey()","last===shellLocalDateKey(y)"]){
  assert.ok(app.includes(token),'Home boot date call must use shell helper '+token);
}

for(const id of ['homeAdaptivePrimary','homeAdaptiveSecondary']){
  assert.ok(html.includes(`id="${id}"`),'missing adaptive Home button '+id);
}
const homeMatch=html.match(/<section id="home"[\s\S]*?<\/section>/);
assert.ok(homeMatch,'Home section missing');
const homeButtons=[...homeMatch[0].matchAll(/<button\b([^>]*)>/g)].map(match=>match[1]);
for(const attrs of homeButtons){
  const wired=/\bonclick=/.test(attrs)||/\bid="homeAdaptive(?:Primary|Secondary)"/.test(attrs)||/\bid="todayReasonToggle"/.test(attrs);
  assert.ok(wired,'Home contains inert static button: '+attrs.replace(/\s+/g,' ').trim());
}
assert.ok(html.includes('id="toast" class="toast" role="status" aria-live="polite" aria-atomic="true"'),'toast must announce route/action feedback accessibly');

const views=[...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(match=>match[1]);
const navTargets=[...html.matchAll(/data-view="([^"]+)"/g)].map(match=>match[1]);
for(const target of new Set(navTargets)){
  assert.ok(views.includes(target),'navigation target has no section: '+target);
}

const coachActions=[...coach.matchAll(/(?:action|secondaryAction):'([^']+)'/g)].map(match=>match[1]);
const supportedActions=new Set(['repair','practice','journal','chest','lesson','session']);
for(const action of new Set(coachActions)){
  assert.ok(supportedActions.has(action),'Home Coach emits unsupported action: '+action);
  if(action!=='lesson')assert.ok(app.includes(`action==='${action}'`)||action==='chest','Home runtime missing handler for '+action);
}
for(const handler of ['startQuickLesson','startMasteryRepair','claimPathChest']){
  assert.ok(new RegExp('function\\s+'+handler+'\\s*\\(').test(app),'generated Home path references missing handler '+handler);
}

for(const token of [
  "primary.onclick=()=>runAdaptiveHomeAction(d.action)",
  "secondary.onclick=toggleTodayReason",
  "if(action==='practice')return go('practice')",
  "if(action==='journal')return go('journal')",
  "if(action==='session')return startSession()",
  "return startQuickLesson(idx)"
]){
  assert.ok(app.includes(token),'missing Home action contract '+token);
}

assert.ok(html.includes('id="todayReason"'),'Home needs an explainable-session rationale surface');
assert.ok(app.includes("reasonToggle.addEventListener('click',toggleTodayReason)"),'session rationale toggle must be wired by runtime');
assert.ok(html.includes('aria-expanded="false" aria-controls="todayReasonBody"'),'session rationale toggle needs accessible state');
assert.ok(app.includes("const NAV_PARENT="),'nested views need a primary navigation parent');
assert.ok(html.includes('onclick="showProfileSummary()"'),'profile control must have an action');
assert.ok(app.includes('function showProfileSummary()'),'profile action handler missing');

assert.ok(app.includes("catch(err){\n   console.error('MON route failed',id,err);"),'route failures must be surfaced');
assert.ok(app.includes("toast('Não consegui abrir '+(viewNames[id]||id)+'. Tente novamente.')"),'route failure needs user feedback');
for(const token of [
  'let routeRequestId=0',
  'const requestId=++routeRequestId',
  "const previous=document.querySelector('.view.active')?.id||'home'",
  'if(requestId!==routeRequestId)return false',
  "v.classList.toggle('active',v.id===previous)",
  "b.classList.toggle('active',b.dataset.view===navParentForView(previous))",
  'if(requestId===routeRequestId)setRouteBusy(false)'
]){
  assert.ok(app.includes(token),'missing resilient routing contract '+token);
}

const cacheVersion=Number(sw.match(/const CACHE_VERSION='v(\d+)'/)?.[1]||0);
assert.ok(cacheVersion>=29,'service worker cache version must preserve routing fix generation or newer');
assert.ok(sw.includes("event.request.destination==='script'||event.request.destination==='style'"),'runtime JS/CSS must avoid stale-first skew');
assert.ok(sw.includes("fetch(event.request,{cache:'no-cache'})"),'network-first assets must request fresh code');

console.log('MON Home interaction contracts passed');
