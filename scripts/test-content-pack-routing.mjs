import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');

assert.ok(!fs.existsSync('data/content-packs.js'),'generic monolithic content pack should stay retired');
assert.ok(fs.existsSync('data/content-packs-n5.js'),'N5 level pack missing');
assert.ok(fs.existsSync('data/content-packs-n4.js'),'N4 level pack missing');
assert.ok(app.includes("N5:['./data/content-packs-n5.js']"),'N5 pack registry missing');
assert.ok(app.includes("N4:['./data/content-packs-n5.js','./data/content-packs-n4.js']"),'N4 layered pack registry missing');
assert.ok(app.includes("function ensureContentPack(level='N5')"),'content pack loader seam missing');
assert.ok(app.includes("function contentPackLevelForDay(day=state.day)"),'day-aware content pack selector missing');
assert.ok(app.includes("return d>=55&&d<=90?'N4':'N5'"),'N4 executable threshold missing');
assert.ok(app.includes("await ensureContentPack(level)"),'learning runtime must resolve level pack before engines');
const runtimeList=app.match(/const LEARNING_RUNTIME_SCRIPTS=\[(.*?)\];/s)?.[1]||'';
assert.ok(!runtimeList.includes('content-packs-n5.js'),'level data must not leak back into generic runtime list');
assert.ok(!runtimeList.includes('content-packs-n4.js'),'N4 level data must stay lazy');

console.log('MON level content pack routing passed');
