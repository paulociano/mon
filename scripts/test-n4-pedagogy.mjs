import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const state={methodStats:{},masteryEvidence:{},reviewItems:{},mistakeStats:{},functionalMastery:{},learningEvidence:{events:[]}};
const ctx=vm.createContext({state,console,Object,Set,Map,Number,String,Math,Array,Date});
for(const file of [
  'data/content-packs-n5.js',
  'data/content-packs-n4.js',
  'data/content-packs-n4-61-70.js',
  'data/content-packs-n4-71-80.js',
  'data/content-packs-n4-81-90.js',
  'data/n4-capabilities.js',
  'data/grammar-pedagogy.js',
  'core/learning-evidence.js',
  'core/review-scheduler.js',
  'core/mastery-graph.js',
  'core/learning-methods.js',
  'core/course-engine.js',
  'core/mistakes.js'
])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});

vm.runInContext('applyN4CapabilityContracts()',ctx);
const units=Array.from(vm.runInContext('coursePacks.N4.units',ctx));
assert.equal(units.length,36,'P9 expects the complete 36-unit N4 curriculum');

for(const unit of units){
  ctx.__unitId=unit.id;
  const contract=vm.runInContext("japaneseLearningContract(coursePacks.N4.units.find(x=>x.id===__unitId))",ctx);
  assert.ok(contract.canDo?.length>=1,unit.id+' needs an observable Can-do');
  assert.ok(contract.capabilities?.length>=2,unit.id+' needs N4 capabilities in the learning contract');
  assert.deepEqual(Array.from(contract.capabilities),Array.from(unit.capabilities),unit.id+' capability contract drift');
  assert.equal(contract.study?.type,'study',unit.id+' needs a Study Block');
  assert.ok(contract.study?.mentalModel?.length>=30,unit.id+' needs a mental model');
  assert.ok(contract.study?.examples?.length>=2,unit.id+' needs worked examples');
  assert.ok(contract.study?.contrast?.length>=35,unit.id+' needs a contrast/boundary');
  assert.ok(contract.study?.commonMistakes?.length>=1,unit.id+' needs misconception guidance');
  assert.ok(contract.study?.realWorldUse?.length>=20,unit.id+' needs real-world use');
  assert.deepEqual(Array.from(contract.study.capabilities),Array.from(unit.capabilities),unit.id+' Study Block must surface capabilities');

  const seq=vm.runInContext("compileAdaptiveMONSequence(coursePacks.N4.units.find(x=>x.id===__unitId))",ctx);
  const grammarRows=Array.from(seq).filter(x=>x._reviewType==='grammar');
  const dims=new Set(grammarRows.map(x=>x._masteryDimension).filter(Boolean));
  for(const dim of ['mechanism','contrast','transfer','produce']){
    assert.ok(dims.has(dim),unit.id+' must collect '+dim+' grammar evidence');
  }
}

const target=units.find(x=>x.id==='n4-convo-compare');
assert.ok(target,'representative N4 unit missing');
const lesson=vm.runInContext("lessonPlanFromPack(coursePacks.N4.units.find(x=>x.id==='n4-convo-compare'))",ctx);
assert.ok(lesson.learning?.capabilities?.includes('negotiate'),'P9 lesson plan must preserve N4 capabilities');
assert.ok(lesson.learning?.capabilities?.includes('explain'),'P9 lesson plan must preserve N4 capabilities');

ctx.__base=vm.runInContext("({type:'choice',prompt:'Qual estrutura resolve melhor uma comparação?',options:[grammarCatalog.compareYori.form,grammarCatalog.opinionToOmou.form],answer:grammarCatalog.compareYori.form,why:grammarCatalog.compareYori.explanation,bridge:grammarCatalog.compareYori.mentalModel,_reviewType:'grammar',_reviewKey:'P:compareYori',_unitId:'n4-convo-compare',_masteryDimension:'contrast',method:'contrast'})",ctx);
const mistake=vm.runInContext("recordMistake(__base,{chosen:grammarCatalog.opinionToOmou.form,node:82})",ctx);
ctx.__mistake=mistake;
const repair=vm.runInContext("grammarRemediationSequence(__base,{chosen:grammarCatalog.opinionToOmou.form,mistake:__mistake})",ctx);
assert.equal(Array.from(repair).length,2,'N4 misconception must create study + retry');
assert.equal(repair[0].type,'study');
assert.ok(repair[0].mentalModel?.length>=25,'N4 repair must preserve conceptual explanation');
assert.ok(repair[0].contrast?.length>=30,'N4 repair must preserve contrast');

console.log('MON P9 N4 pedagogy contracts passed:',units.length,'units');
