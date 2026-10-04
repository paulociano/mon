import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Number,String});
vm.runInContext(fs.readFileSync('data/content-packs-n5.js','utf8'),ctx,{filename:'content-packs-n5.js'});
vm.runInContext(fs.readFileSync('data/content-packs-n4.js','utf8'),ctx,{filename:'content-packs-n4.js'});

const errors=vm.runInContext('validateCoursePacks()',ctx);
assert.deepEqual(Array.from(errors),[]);

const n5Count=vm.runInContext("coursePacks.N5.units.length",ctx);
assert.ok(n5Count>=8,'N5 should expose the first survival slice');

const n4Count=vm.runInContext("coursePacks.N4.units.length",ctx);
assert.ok(n4Count>=6,'N4 should expose an executable autonomy slice');
const n4Coverage=vm.runInContext("coursePacks.N4.units.every(u=>u.vocabulary.length>=4&&u.objectives.length>=3&&u.templates.includes('speak')&&u.mastery.required.length>=3)",ctx);
assert.equal(n4Coverage,true,'every N4 unit needs substantive vocabulary, outcomes, speaking and mastery');
const n4Days=vm.runInContext("coursePacks.N4.units.map(x=>x.day)",ctx);
assert.deepEqual(Array.from(n4Days),[55,56,57,58,59,60]);
const n4Stats=vm.runInContext('n4PracticalStats()',ctx);
assert.equal(n4Stats.scenarios>=12,true,'N4 needs multiple real-world branches');

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
