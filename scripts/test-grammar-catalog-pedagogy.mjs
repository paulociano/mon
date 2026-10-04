import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Map,Number,String,Math,Array,state:{methodStats:{},masteryEvidence:{},functionalMastery:{}}});
for(const file of [
  'data/content-packs-n5.js',
  'data/content-packs-n4.js',
  'data/content-packs-n4-61-70.js',
  'data/content-packs-n4-71-80.js',
  'data/content-packs-n4-81-90.js',
  'data/grammar-pedagogy.js',
  'core/learning-methods.js'
])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});

const catalog=vm.runInContext('grammarCatalog',ctx);
const units=vm.runInContext('[...coursePacks.N5.units,...coursePacks.N4.units]',ctx);
const used=[...new Set(Array.from(units).flatMap(u=>Array.from(u.grammar||[])))];
assert.ok(used.length>=60,'expected broad N5/N4 grammar coverage');

for(const id of used){
  const g=catalog[id];
  assert.ok(g,id+' missing from grammarCatalog');
  assert.ok(g.mentalModel?.length>=25,id+' needs a mental model');
  assert.ok(g.explanation?.length>=60,id+' needs an applied explanation');
  assert.ok(Array.isArray(g.examples)&&g.examples.length>=2,id+' needs at least two worked examples');
  assert.ok(g.examples.every(x=>x.jp&&x.pt&&x.note),id+' examples need jp, pt and note');
  assert.ok(g.contrast?.length>=30,id+' needs a contrast/boundary');
  assert.ok(Array.isArray(g.commonMistakes)&&g.commonMistakes.length>=1,id+' needs common mistakes');
  assert.ok(g.commonMistakes.every(x=>x.wrong&&x.explanation),id+' mistakes need wrong + explanation');
  assert.ok(g.realWorldUse?.length>=20,id+' needs real-world use');
  assert.ok(Array.isArray(g.sources)&&g.sources.length>=1,id+' needs provenance');
}

const methods=fs.readFileSync('core/learning-methods.js','utf8');
assert.ok(!methods.includes('grammarBridgeNotes'),'pedagogy must not be duplicated in learning-methods');
assert.ok(methods.includes('g.mentalModel'),'learning methods should consume canonical catalog pedagogy');
assert.ok(methods.includes('g.commonMistakes'),'study blocks should consume canonical misconception data');

const station=vm.runInContext("grammarStudyBlock(coursePacks.N5.units.find(x=>x.id==='n5-station'))",ctx);
assert.ok(station.examples.some(x=>x.note.includes('catálogo')||x.note.includes('estrutura')),'Study Block should reuse canonical worked examples');
assert.ok(station.commonMistakes?.length>=1,'Study Block should expose common mistakes');

const before=Object.keys(catalog).length;
vm.runInContext("applyGrammarPedagogy()",ctx);
assert.equal(Object.keys(catalog).length,before,'reapplying pedagogy must be idempotent');
assert.ok(catalog.topicDesu.mentalModel.includes('tópico'),'reapplication must preserve pedagogy');

console.log('MON canonical grammar catalog contracts passed:',used.length,'structures');
