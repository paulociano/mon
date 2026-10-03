import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');

for(const id of ['homeAdaptivePrimary','homeAdaptiveSecondary']){
  assert.ok(html.includes(`id="${id}"`),'missing adaptive Home button '+id);
}
for(const token of [
  "primary.onclick=()=>runAdaptiveHomeAction(d.action)",
  "secondary.onclick=()=>runAdaptiveHomeAction(d.secondaryAction)",
  "if(action==='practice')return go('practice')",
  "if(action==='journal')return go('journal')",
  "return startQuickLesson(idx)"
]){
  assert.ok(app.includes(token),'missing Home action contract '+token);
}

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
  "b.classList.toggle('active',b.dataset.view===previous)",
  'if(requestId===routeRequestId)setRouteBusy(false)'
]){
  assert.ok(app.includes(token),'missing resilient routing contract '+token);
}

assert.ok(sw.includes("const CACHE='mon-japanese-os-v29'"),'service worker cache version must advance with routing fix');
assert.ok(sw.includes("event.request.destination==='script'||event.request.destination==='style'"),'runtime JS/CSS must avoid stale-first skew');
assert.ok(sw.includes("fetch(event.request,{cache:'no-cache'})"),'network-first assets must request fresh code');

console.log('MON Home interaction contracts passed');
