import fs from'node:fs';import vm from'node:vm';import assert from'node:assert/strict';
const ctx=vm.createContext({console,Object,Set,Map,Number,String,Math,Array});
for(const f of['data/kana.js','data/foundation.js','data/session.js','core/course-engine.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
const boundaries=[1,6,8,13,17,22];
for(const day of boundaries){
 const intro=vm.runInContext(`foundationBlockIntro(${day})`,ctx);
 assert.equal(intro?.type,'study','day '+day+' needs a block intro');
 assert.equal(intro?.mode,'block-intro');
 assert.ok(intro.title?.length>8);
 assert.ok(intro.explanation?.length>80);
 assert.ok(intro.examples?.length>=3);
 assert.ok(intro.referenceLabel?.length>3);
 const lesson=vm.runInContext(`lessonPlanFromNode({day:${day},label:'Foundation ${day}'})`,ctx);
 assert.equal(lesson.exercises[0].mode,'block-intro','intro must be first');
 assert.equal(lesson.exercises[1].type,'study','lesson study comes after block orientation');
}
assert.equal(vm.runInContext("foundationBlockIntro(2)",ctx),null,'non-boundary day must not repeat intro');
const hira=vm.runInContext("foundationBlockIntro(1)",ctx);assert.ok(hira.examples.map(x=>x.jp).join('').includes('ん'));assert.ok(hira.examples.map(x=>x.note).join(' ').includes('46'));
const kata=vm.runInContext("foundationBlockIntro(8)",ctx);assert.ok(kata.examples.map(x=>x.jp).join('').includes('ン'));assert.ok(kata.examples.map(x=>x.note).join(' ').includes('46'));
const grammar=vm.runInContext("foundationBlockIntro(13)",ctx);assert.ok(grammar.examples.map(x=>x.jp).join(' ').includes('は'));assert.ok(grammar.examples.map(x=>x.jp).join(' ').includes('を'));
const verbs=vm.runInContext("foundationBlockIntro(17)",ctx);assert.ok(verbs.examples.some(x=>x.jp.includes('ます')));
const numbers=vm.runInContext("foundationBlockIntro(22)",ctx);assert.ok(numbers.examples.some(x=>/時|円|人/.test(x.jp)));
const html=fs.readFileSync('index.html','utf8');assert.ok(html.includes('id="foundationReferenceAtlas"'),'Foundation needs persistent reference atlas');
const feature=fs.readFileSync('features/foundation.js','utf8');assert.ok(feature.includes('renderFoundationReferenceAtlas'),'Foundation must render persistent atlas');
console.log('MON block introductions and reference atlas contracts passed');