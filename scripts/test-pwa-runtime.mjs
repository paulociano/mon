import fs from 'node:fs';
import assert from 'node:assert/strict';

const sw=fs.readFileSync('sw.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');

const coreMatch=sw.match(/const CORE=\[(.*?)\];/s);
assert.ok(coreMatch,'service worker CORE shell missing');
const core=coreMatch[1];
for(const asset of ['./','./index.html','./styles.css','./data/course-content.js','./core/state.js','./app.js']){
  assert.ok(core.includes(`'${asset}'`),'critical shell asset missing '+asset);
}
for(const lazy of ['./data/content-packs.js','./features/session.js','./features/videos.js','./data/kanji.js']){
  assert.ok(!core.includes(`'${lazy}'`),'lazy runtime must not be install-precache '+lazy);
}
const installBlock=sw.match(/self\.addEventListener\('install'[\s\S]*?\n}\);/)?.[0]||'';
assert.ok(!installBlock.includes('skipWaiting'),'updates must not activate silently during install');
assert.ok(sw.includes("event.data?.type==='SKIP_WAITING'"),'service worker needs explicit update activation message');
assert.ok(sw.includes("const CACHE_PREFIX='mon-japanese-os-'"),'service worker cache namespace missing');
assert.ok(sw.includes("k.startsWith(CACHE_PREFIX)&&k!==CACHE"),'service worker must only delete MON-owned caches');
assert.ok(!sw.includes("keys.filter(k=>k!==CACHE)"),'service worker must not delete unrelated origin caches');
assert.ok(sw.includes("event.data?.type==='MON_SW_STATUS'"),'service worker status probe missing');
assert.ok(sw.includes('staleWhileRevalidate(event)'),'runtime assets should still be cached on demand');
for(const token of ['showMonUpdate','applyMonUpdate','watchMonUpdate','reg.waiting','updatefound','controllerchange']){
  assert.ok(app.includes(token),'missing controlled PWA update contract '+token);
}
assert.ok(html.includes('id="updateBanner"'),'update availability UI missing');
assert.ok(html.includes('onclick="applyMonUpdate()"'),'update action missing');
console.log('MON PWA shell and update contracts passed');