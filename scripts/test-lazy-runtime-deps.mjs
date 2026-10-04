import fs from 'node:fs';import assert from 'node:assert/strict';
const foundation=fs.readFileSync('features/foundation.js','utf8'),kanji=fs.readFileSync('features/kanji.js','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.ok(foundation.includes('function foundationSpeak('),'Foundation must own an audio fallback');
assert.ok(foundation.includes('foundationSpeak(pair[target])'),'sound quiz must use Foundation audio helper');
assert.ok(!foundation.includes('speak(pair[target])'),'Foundation must not depend on Kanji speak');
assert.ok(kanji.includes('Object.assign(window,{ensureKanjiAtlas,renderKanjiAtlas'),'Kanji lazy API must be explicitly global');
assert.ok(sw.includes("caches.match('./index.html')"),'navigation fallback must use canonical app shell');
assert.ok(!sw.includes('caches.match(event.request))||(await caches.match(\'./index.html\'))'),'navigation fallback must not depend on query-specific cache entry');
console.log('MON lazy runtime dependency contracts passed');