import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Number,String});
vm.runInContext(fs.readFileSync('data/content-packs-n5.js','utf8'),ctx,{filename:'content-packs-n5.js'});

const errors=vm.runInContext('validateCoursePacks()',ctx);
assert.deepEqual(Array.from(errors),[]);

const n5Count=vm.runInContext("coursePacks.N5.units.length",ctx);
assert.ok(n5Count>=8,'N5 should expose the first survival slice');

const uniqueDays=vm.runInContext("new Set(coursePacks.N5.units.map(x=>x.day)).size===coursePacks.N5.units.length",ctx);
assert.equal(uniqueDays,true,'unit days must be unique');

const coverage=vm.runInContext("coursePacks.N5.units.every(u=>u.vocabulary.length>=4&&u.objectives.length>=2&&u.templates.includes('speak')&&u.mastery.required.length>=2)",ctx);
assert.equal(coverage,true,'every N5 unit needs vocabulary, objectives, speaking and mastery requirements');

const allPrereqs=vm.runInContext(`coursePacks.N5.units.every((u,i)=>{
  if(i===0)return u.prerequisites.includes('ZERO:24');
  return u.prerequisites.some(p=>coursePacks.N5.units.slice(0,i).some(x=>x.id===p));
})`,ctx);
assert.equal(allPrereqs,true,'prerequisites should point backward');

const vocabCount=vm.runInContext("Object.keys(vocabularyCatalog).length",ctx);
assert.ok(vocabCount>=30,'starter vocabulary catalog should be substantive');

console.log(`MON content pack tests passed: ${n5Count} units, ${vocabCount} vocabulary items.`);
