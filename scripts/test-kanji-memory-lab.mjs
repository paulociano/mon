import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({});
vm.runInContext(fs.readFileSync('data/kanji-memory.js','utf8'),ctx,{filename:'kanji-memory.js'});
const meta=vm.runInContext("kanjiMemoryMeta('駅')",ctx);
const family=vm.runInContext("kanjiMemoryFamilyFor('駅')",ctx);
assert.ok(meta.parts.length>=2);
assert.ok(meta.contrast.length>=2);
assert.equal(meta.family,'movement');
assert.ok(family.items.includes('駅')&&family.items.includes('車'));

const js=fs.readFileSync('features/kanji-memory.js','utf8');
const css=fs.readFileSync('features/kanji-memory.css','utf8');
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const state=fs.readFileSync('core/state.js','utf8');

for(const mode of ["'family'","'contrast'","'meaning'","'reading'"])assert.ok(js.includes(mode),'missing Kanji Lab mode '+mode);
assert.ok(js.includes('recordKanjiLab'));
assert.ok(js.includes("gradeKanji(kanjiData[currentKanji].k,ok?'good':'hard',true)"));
assert.ok(app.includes("'./data/kanji-memory.js'"));
assert.ok(app.includes("'./features/kanji-memory.js'"));
assert.ok(app.includes("kanji:['./features/kanji-memory.css']"));
assert.ok(html.includes('id="kanjiMemoryLab"'));
assert.ok(state.includes('kanjiLab:{attempts:0'));
assert.ok(css.includes('.km-contrast'));
assert.ok(css.includes('.km-options'));
assert.ok(!fs.readFileSync('README.md','utf8').includes('lista oficial JLPT'));

console.log('MON Kanji Memory Lab 2.0 contracts passed');
