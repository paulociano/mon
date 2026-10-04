import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Number,String,Math});
vm.runInContext(fs.readFileSync('data/content-packs-n5.js','utf8'),ctx);

const stats=vm.runInContext('n5PracticalStats()',ctx);
assert.ok(stats.units>=29,'practical N5 should expose a full multi-week graph');
assert.ok(stats.vocabulary>=100,'practical N5 needs a substantial reusable vocabulary catalog');
assert.ok(stats.grammar>=30,'practical N5 needs a substantial grammar catalog');
assert.ok(stats.kanji>=45,'practical N5 should cover a broad functional kanji set');
assert.equal(stats.lastDay,54,'day 54 maps to N5 practical day 30 after Foundation Zero');

const units=vm.runInContext('coursePacks.N5.units',ctx);
const days=Array.from(units,x=>x.day);
assert.equal(new Set(days).size,days.length,'structured N5 days must be unique');
assert.ok(days.every((d,i)=>i===0||d>days[i-1]),'structured N5 units should remain ordered');

const late=vm.runInContext("coursePackForDay(54)",ctx);
assert.equal(late.id,'n5-autonomy');
assert.ok(late.methods.includes('roleplay'));
assert.ok(late.mastery.minAccuracy>=90);

for(const unit of units){
  assert.ok(unit.objectives.length>=2,unit.id+' objectives');
  assert.ok(unit.vocabulary.length>=4,unit.id+' vocabulary');
  assert.ok(unit.grammar.length>=1,unit.id+' grammar');
  assert.ok(unit.scenarios.length>=1,unit.id+' scenario');
  assert.ok(unit.methods.includes('freeRecall'),unit.id+' free recall');
  assert.ok(unit.methods.includes('roleplay'),unit.id+' roleplay');
}

console.log('MON N5 scale tests passed:',JSON.stringify(stats));
