import fs from 'node:fs';
import assert from 'node:assert/strict';

const sw=fs.readFileSync('sw.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const manifest=JSON.parse(fs.readFileSync('manifest.json','utf8'));
assert.equal(manifest.id,'./','PWA manifest must declare a stable app id');
assert.equal(manifest.scope,'./','PWA manifest must declare its scope explicitly');
assert.equal(manifest.lang,'pt-BR','PWA manifest should declare the primary UI language');
assert.ok(manifest.icons.some(i=>i.src==='./icon.svg'&&i.purpose==='any'),'regular PWA icon must use purpose any');
assert.ok(manifest.icons.some(i=>i.src==='./icon-maskable.svg'&&i.purpose==='maskable'),'PWA must provide a dedicated maskable icon');

const coreMatch=sw.match(/const CORE=\[(.*?)\];/s);
assert.ok(coreMatch,'service worker CORE shell missing');
const core=coreMatch[1];
for(const match of core.matchAll(/'([^']+)'/g)){const file=match[1];if(file!=='./')assert.ok(fs.existsSync(file),'precache asset missing: '+file)}
for(const asset of ['./','./index.html','./styles.css','./release.json','./core/runtime-health.js','./icon-maskable.svg','./data/course-content.js','./core/state.js','./app.js']){
  assert.ok(core.includes(`'${asset}'`),'critical shell asset missing '+asset);
}
for(const lazy of ['./data/content-packs.js','./features/session.js','./features/videos.js','./data/kanji.js']){
  assert.ok(!core.includes(`'${lazy}'`),'lazy runtime must not be install-precache '+lazy);
}
const installBlock=sw.match(/self\.addEventListener\('install'[\s\S]*?\n}\);/)?.[0]||'';
assert.ok(installBlock.includes("if(CRITICAL_SHELL_UPGRADE)await self.skipWaiting()"),'controlled install hook must remain available');
assert.ok(sw.includes("const CACHE_VERSION='v44'"),'release runtime must use the current MON cache version');
assert.ok(sw.includes('const CRITICAL_SHELL_UPGRADE=true'),'v44 recovery must activate immediately to replace stale dispatcher/runtime pairs');
assert.ok(!sw.includes('client.navigate('),'service worker activation must not trigger navigation reload loops');
assert.ok(sw.includes("event.data?.type==='SKIP_WAITING'"),'service worker needs explicit update activation message');
assert.ok(sw.includes("const CACHE_PREFIX='mon-japanese-os-'"),'service worker cache namespace missing');
assert.ok(sw.includes("k.startsWith(CACHE_PREFIX)&&k!==CACHE"),'service worker must only delete MON-owned caches');
assert.ok(!sw.includes("keys.filter(k=>k!==CACHE)"),'service worker must not delete unrelated origin caches');
assert.ok(sw.includes("event.data?.type==='MON_SW_STATUS'"),'service worker status probe missing');
assert.ok(sw.includes('staleWhileRevalidate(event)'),'runtime assets should still be cached on demand');
assert.ok(sw.includes("await cache.put('./index.html',response.clone())"),'navigation responses must refresh the canonical shell cache instead of caching query-specific route URLs');
assert.ok(sw.includes("fetch(event.request,{cache:'no-cache'})"),'navigations must bypass stale HTTP cache entries before falling back to the offline shell');
for(const token of ['showMonUpdate','applyMonUpdate','watchMonUpdate','reg.waiting','updatefound','controllerchange',"updateViaCache:'none'",'reg.update()',"mon-sw-recovery-v44",'sessionStorage.getItem(recoveryKey)']){
  assert.ok(app.includes(token),'missing controlled PWA update contract '+token);
}
assert.ok(html.includes('id="updateBanner"'),'update availability UI missing');
assert.ok(html.includes('data-mon-command="applyMonUpdate()"'),'CSP-safe update action missing');
console.log('MON PWA shell and update contracts passed');
assert.ok(app.includes("monUpdateWorker?.state==='installed'"),'update action must ignore stale non-waiting worker references');
assert.ok(app.includes('reg?.waiting'),'update action must resolve the current waiting worker');
assert.ok(app.includes('location.reload()'),'update action must recover when the worker already activated');

assert.ok(app.includes("caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mon-japanese-os-'))"),'fresh auth migration must clear only MON-owned PWA caches');
