import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Number,String});
vm.runInContext(fs.readFileSync('data/content-packs-n5.js','utf8'),ctx,{filename:'content-packs-n5.js'});
vm.runInContext(fs.readFileSync('data/content-packs-n4.js','utf8'),ctx,{filename:'content-packs-n4.js'});
for(const file of ['data/content-packs-n4-61-70.js','data/content-packs-n4-71-80.js','data/content-packs-n4-81-90.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});

const errors=vm.runInContext('validateCoursePacks()',ctx);
assert.deepEqual(Array.from(errors),[]);

const n5Count=vm.runInContext("coursePacks.N5.units.length",ctx);
assert.ok(n5Count>=8,'N5 should expose the first survival slice');

const n4Count=vm.runInContext("coursePacks.N4.units.length",ctx);
assert.equal(n4Count,36,'N4 should expose a continuous executable arc from day 55 to 90');
const n4Coverage=vm.runInContext("coursePacks.N4.units.every(u=>u.vocabulary.length>=4&&u.objectives.length>=3&&u.templates.includes('speak')&&u.mastery.required.length>=3)",ctx);
assert.equal(n4Coverage,true,'every N4 unit needs substantive vocabulary, outcomes, speaking and mastery');
const n4Days=vm.runInContext("coursePacks.N4.units.map(x=>x.day)",ctx);
assert.deepEqual(Array.from(n4Days),Array.from({length:36},(_,i)=>55+i),'N4 days must be continuous through day 90');
const n4Stats=vm.runInContext('n4PracticalStats()',ctx);
assert.equal(n4Stats.scenarios>=72,true,'N4 needs at least two real-world turns per daily unit');
const n4Prereqs=vm.runInContext(`coursePacks.N4.units.every((u,i)=>i===0?u.prerequisites.includes('n5-autonomy'):u.prerequisites.includes(coursePacks.N4.units[i-1].id))`,ctx);
assert.equal(n4Prereqs,true,'N4 prerequisites should form one continuous autonomy chain');

const uniqueDays=vm.runInContext("new Set(Object.values(coursePacks).flatMap(l=>l.units.map(x=>x.day))).size===Object.values(coursePacks).flatMap(l=>l.units).length",ctx);
assert.equal(uniqueDays,true,'unit days must be unique across levels');

const coverage=vm.runInContext("coursePacks.N5.units.every(u=>u.vocabulary.length>=4&&u.objectives.length>=2&&u.templates.includes('speak')&&u.mastery.required.length>=2)",ctx);
assert.equal(coverage,true,'every N5 unit needs vocabulary, objectives, speaking and mastery requirements');

const allPrereqs=vm.runInContext(`coursePacks.N5.units.every((u,i)=>{
  if(i===0)return u.prerequisites.includes('ZERO:24');
  return u.prerequisites.some(p=>coursePacks.N5.units.slice(0,i).some(x=>x.id===p));
})`,ctx);
assert.equal(allPrereqs,true,'prerequisites should point backward');

const vocabCount=vm.runInContext("Object.keys(vocabularyCatalog).length",ctx);
assert.ok(vocabCount>=30,'starter vocabulary catalog should be substantive');

console.log(`MON content pack tests passed: ${n5Count} N5 units, ${n4Count} N4 units, ${vocabCount} vocabulary items.`);
