import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');

assert.ok(!fs.existsSync('data/content-packs.js'),'generic monolithic content pack should stay retired');
assert.ok(fs.existsSync('data/content-packs-n5.js'),'N5 level pack missing');
assert.ok(fs.existsSync('data/content-packs-n4.js'),'N4 level pack missing');
assert.ok(app.includes("N5:['./data/content-packs-n5.js']"),'N5 pack registry missing');
for(const key of ['N4A','N4B','N4C','N4D'])assert.ok(app.includes(key+':['),'N4 tier '+key+' missing');
assert.ok(app.includes("function ensureContentPack(level='N5')"),'content pack loader seam missing');
assert.ok(app.includes("function contentPackLevelForDay(day=state.day)"),'day-aware content pack selector missing');
for(const token of ["if(d>=81&&d<=90)return 'N4D'","if(d>=71)return 'N4C'","if(d>=61)return 'N4B'","if(d>=55)return 'N4A'"])assert.ok(app.includes(token),'N4 day tier missing: '+token);
assert.ok(app.includes("await ensureContentPack(level)"),'learning runtime must resolve level pack before engines');
const runtimeList=app.match(/const LEARNING_RUNTIME_SCRIPTS=\[(.*?)\];/s)?.[1]||'';
assert.ok(!runtimeList.includes('content-packs-n5.js'),'level data must not leak back into generic runtime list');
for(const file of ['content-packs-n4.js','content-packs-n4-61-70.js','content-packs-n4-71-80.js','content-packs-n4-81-90.js'])assert.ok(!runtimeList.includes(file),'N4 level data must stay lazy: '+file);

console.log('MON level content pack routing passed');
