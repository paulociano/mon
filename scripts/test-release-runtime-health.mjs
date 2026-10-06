import fs from 'node:fs';
import assert from 'node:assert/strict';

const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const lock=JSON.parse(fs.readFileSync('package-lock.json','utf8'));
const release=JSON.parse(fs.readFileSync('release.json','utf8'));
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const health=fs.readFileSync('core/runtime-health.js','utf8');

assert.equal(pkg.version,release.version,'package and release identity must match');
assert.equal(lock.version,release.version,'lockfile release identity must match');
assert.equal(lock.packages[''].version,release.version,'lockfile root package version must match');
assert.ok(html.includes(`name="mon-release" content="${release.version}"`),'HTML must expose release identity');
assert.ok(sw.includes("const CACHE_VERSION='v43'"),'release must bump service-worker cache identity');
for(const asset of ["'./release.json'","'./core/runtime-health.js'"])assert.ok(sw.includes(asset),'release diagnostics asset missing from PWA shell '+asset);
assert.ok(html.includes('<script src="./core/runtime-health.js"></script><script src="./app.js"></script>'),'runtime health, UI dispatcher, and style bridge must load before app.js');

for(const token of ["MAX_AGE=7*24*60*60*1000","MAX_EVENTS=50","js-error","resource-error","promise-rejection","MON_RUNTIME_HEALTH"])assert.ok(health.includes(token),'runtime health contract missing '+token);
for(const forbidden of ['event.message','event.reason','event.filename','event.error','stack'])assert.ok(!health.includes(forbidden),'runtime health must not persist raw error details: '+forbidden);

console.log('MON release identity and privacy-first runtime health contracts passed');
