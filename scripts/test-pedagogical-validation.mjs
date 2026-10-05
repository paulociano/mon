import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Map,Number,String,Math,Array,Date,state:{methodStats:{},masteryEvidence:{},reviewItems:{},mistakeStats:{},functionalMastery:{}}});
for(const file of [
  'data/content-packs-n5.js',
  'data/content-packs-n4.js',
  'data/content-packs-n4-61-70.js',
  'data/content-packs-n4-71-80.js',
  'data/content-packs-n4-81-90.js',
  'data/n4-capabilities.js',
  'data/kanji.js',
  'data/grammar-pedagogy.js',
  'core/mastery-graph.js',
  'core/learning-methods.js',
  'core/course-engine.js'
])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});

vm.runInContext('applyN4CapabilityContracts()',ctx);
const n4=Array.from(vm.runInContext('coursePacks.N4.units',ctx));

function evaluate(unit){
  ctx.__unitId=unit.id;
  const contract=vm.runInContext("japaneseLearningContract(coursePacks.N4.units.find(x=>x.id===__unitId))",ctx);
  const seq=Array.from(vm.runInContext("compileAdaptiveMONSequence(coursePacks.N4.units.find(x=>x.id===__unitId))",ctx));
  const dims=new Set(seq.filter(x=>x._reviewType==='grammar').map(x=>x._masteryDimension).filter(Boolean));
  const types=new Set(seq.map(x=>x.type));
  const sources=new Set(Array.from(contract.sources||[]));
  const checks={
    mission:contract.canDo?.length>=1&&contract.situation?.length>=20,
    input:Boolean(contract.input?.jp&&contract.input?.pt),
    study:contract.study?.type==='study'&&contract.study?.mentalModel?.length>=30&&contract.study?.explanation?.length>=80,
    workedExamples:Array.isArray(contract.study?.examples)&&contract.study.examples.length>=2&&contract.study.examples.every(x=>x.jp&&x.pt&&x.note),
    misconception:Boolean(contract.study?.contrast?.length>=35&&contract.study?.commonMistakes?.length>=1),
    conceptualEvidence:dims.has('mechanism')&&dims.has('contrast'),
    retrieval:types.has('recall')||types.has('dictation')||types.has('cloze'),
    transfer:dims.has('transfer')||types.has('transfer'),
    production:dims.has('produce')||types.has('roleplay')||types.has('openResponse')||types.has('speak'),
    repair:Boolean(contract.repair?.jp&&contract.repair?.pt),
    capabilities:Array.isArray(contract.capabilities)&&contract.capabilities.length>=2,
    provenance:sources.has('Irodori')&&sources.has('Desvendando')&&(!(unit.kanji||[]).length||sources.has('Meu Amigo Kanji'))
  };
  return {unitId:unit.id,checks,score:Object.values(checks).filter(Boolean).length,total:Object.keys(checks).length};
}

const report=n4.map(evaluate);
const failures=report.flatMap(row=>Object.entries(row.checks).filter(([,ok])=>!ok).map(([check])=>row.unitId+': '+check));
assert.deepEqual(failures,[],'P10 pedagogical rubric failed:\n'+failures.join('\n'));
assert.ok(report.every(x=>x.score===x.total),'every N4 unit must satisfy the complete pedagogical rubric');

const catalog=vm.runInContext('grammarCatalog',ctx);
for(const unit of n4){
  for(const id of unit.grammar||[]){
    const g=catalog[id];
    assert.ok(g?.mentalModel&&g?.explanation,id+' lacks conceptual explanation');
    assert.ok(g?.contrast&&g?.commonMistakes?.length,id+' lacks contrast/misconception handling');
    assert.ok(g?.examples?.length>=2,id+' lacks worked examples');
  }
}

const caveat='Este gate valida coerência estrutural e alinhamento metodológico; não prova eficácia causal nem substitui validação longitudinal com aprendizes.';
assert.match(caveat,/não prova eficácia causal/);

console.log('MON P10 pedagogical validation passed:',report.length,'N4 units ×',report[0].total,'rubric checks');
