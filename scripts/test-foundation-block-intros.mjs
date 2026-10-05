import fs from'node:fs';import vm from'node:vm';import assert from'node:assert/strict';
const ctx=vm.createContext({console,Object,Set,Map,Number,String,Math,Array});
for(const f of['data/foundation.js','data/session.js','core/course-engine.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
for(const day of [1,6,8,13,17,22]){
 const intro=vm.runInContext(`foundationBlockIntro(${day})`,ctx);
 assert.equal(intro?.type,'study');assert.equal(intro?.mode,'block-intro');assert.ok(intro.examples.length>=3);
 const lesson=vm.runInContext(`lessonPlanFromNode({day:${day},label:'Foundation'})`,ctx);
 assert.equal(lesson.exercises[0].mode,'block-intro');
}
assert.equal(vm.runInContext('foundationBlockIntro(2)',ctx),null);
const hira=vm.runInContext('foundationBlockIntro(1)',ctx);assert.ok(hira.examples.map(x=>x.jp).join('').includes('ん'));
const kata=vm.runInContext('foundationBlockIntro(8)',ctx);assert.ok(kata.examples.map(x=>x.jp).join('').includes('ン'));
const html=fs.readFileSync('index.html','utf8');assert.ok(html.includes('id="foundationReferenceAtlas"'));
const feature=fs.readFileSync('features/foundation.js','utf8');assert.ok(feature.includes('renderFoundationReferenceAtlas'));
console.log('MON Foundation block intros + P8 atlas contracts passed');