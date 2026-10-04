import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({
  console,Object,Set,Map,Number,String,Math,Array,
  state:{methodStats:{},masteryEvidence:{},unitMastery:{},functionalMastery:{}}
});
for(const file of [
  'data/content-packs-n5.js',
  'data/content-packs-n4.js',
  'data/content-packs-n4-61-70.js',
  'data/content-packs-n4-71-80.js',
  'data/content-packs-n4-81-90.js',
  'data/n4-capabilities.js',
  'data/kanji.js',
  'data/missions-v2.js',
  'data/grammar-pedagogy.js',
  'core/learning-methods.js',
  'core/course-engine.js'
])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});

const units=vm.runInContext('[...coursePacks.N5.units,...coursePacks.N4.units]',ctx);
assert.ok(units.length>=60,'expected the full structured Japanese curriculum');

for(const unit of units){
  const contract=vm.runInContext(`japaneseLearningContract(([...coursePacks.N5.units,...coursePacks.N4.units]).find(x=>x.id===${JSON.stringify(unit.id)}))`,ctx);
  assert.ok(contract.canDo?.length>=1,unit.id+' needs an observable Can-do');
  assert.ok(contract.situation?.length>=20,unit.id+' needs a meaningful situation');
  assert.ok(contract.input?.jp&&contract.input?.pt,unit.id+' needs contextual input');
  assert.ok(contract.study?.type==='study',unit.id+' needs a Study Block');
  assert.ok(contract.study?.mentalModel?.length>=30,unit.id+' needs a mental model');
  assert.ok(contract.study?.examples?.length>=2,unit.id+' needs worked examples');
  assert.ok(contract.practice?.includes('retrieve'),unit.id+' must include retrieval');
  assert.ok(contract.practice?.includes('transfer'),unit.id+' must include transfer');
  assert.ok(contract.practice?.includes('produce'),unit.id+' must include production');
  assert.ok(contract.repair?.jp&&contract.repair?.pt,unit.id+' needs a repair strategy');
  if((unit.kanji||[]).length){
    assert.ok(contract.kanji?.length>=1,unit.id+' needs contextual kanji guidance');
    assert.ok(contract.kanji.every(x=>x.k&&x.meaning&&x.context),unit.id+' kanji guidance must be contextual');
  }
}

const station=vm.runInContext("japaneseLearningContract(coursePacks.N5.units.find(x=>x.id==='n5-station'))",ctx);
assert.ok(station.canDo.some(x=>/esta|plata|dire|local/i.test(x)), 'station Can-do must remain functional');
assert.ok(station.sources.includes('Irodori'),'functional design should carry Irodori provenance');
assert.ok(station.sources.includes('Desvendando'),'grammar study should carry Portuguese-first provenance');
assert.ok(station.sources.includes('Meu Amigo Kanji'),'kanji study should carry contextual-kanji provenance');

const full=vm.runInContext("adaptStudyForLearner(japaneseLearningContract(coursePacks.N5.units[0]),{masteryEvidence:{}})",ctx);
assert.equal(full.mode,'full','new concepts should receive full study');

const compactState={masteryEvidence:{}};
for(const id of vm.runInContext('coursePacks.N5.units[0].grammar',ctx)){
  compactState.masteryEvidence['grammar:P:'+id]={recognize:{attempts:3,score:82},recall:{attempts:3,score:78}};
}
ctx.compactState=compactState;
const compact=vm.runInContext("adaptStudyForLearner(japaneseLearningContract(coursePacks.N5.units[0]),compactState)",ctx);
assert.ok(['compact','practice'].includes(compact.mode),'known grammar should reduce explanation');

for(const mission of vm.runInContext('survivalMissionsV2',ctx)){
  const m=vm.runInContext(`missionLearningContract(survivalMissionsV2.find(x=>x.id===${JSON.stringify(mission.id)}))`,ctx);
  assert.ok(m.canDo&&m.situation&&m.input?.jp&&m.repair?.jp,mission.id+' mission needs the same learning contract');
}

const lesson=vm.runInContext("lessonPlanFromPack(coursePacks.N4.units[0])",ctx);
assert.ok(lesson.learning?.canDo?.length,'lesson plan must expose its learning contract');
assert.equal(lesson.study?.type,'study','lesson plan must preserve study');
assert.ok(lesson.kanjiStudy?.length>=1,'lesson plan must expose contextual kanji');

console.log('MON Japanese learning cycle contracts passed:',units.length,'units');
