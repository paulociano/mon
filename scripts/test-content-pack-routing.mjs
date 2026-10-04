import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');

assert.ok(!fs.existsSync('data/content-packs.js'),'generic monolithic content pack should stay retired');
assert.ok(fs.existsSync('data/content-packs-n5.js'),'N5 level pack missing');
assert.ok(app.includes("CONTENT_PACK_SCRIPTS={N5:'./data/content-packs-n5.js'}"),'level pack registry missing');
assert.ok(app.includes("function ensureContentPack(level='N5')"),'content pack loader seam missing');
assert.ok(app.includes("await ensureContentPack(level)"),'learning runtime must resolve level pack before engines');
const runtimeList=app.match(/const LEARNING_RUNTIME_SCRIPTS=\[(.*?)\];/s)?.[1]||'';
assert.ok(!runtimeList.includes('content-packs-n5.js'),'level data must not leak back into generic runtime list');

console.log('MON level content pack routing passed');
