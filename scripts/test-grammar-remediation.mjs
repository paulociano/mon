import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const state={mistakeStats:{},mistakes:[],reviewItems:{},learningEvidence:{events:[]}};
const ctx=vm.createContext({state,console,Object,Set,Map,Number,String,Math,Array,Date});
for(const file of [
  'data/content-packs-n5.js',
  'data/grammar-pedagogy.js',
  'core/learning-evidence.js',
  'core/review-scheduler.js',
  'core/mistakes.js'
])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});

const base=vm.runInContext(`({
 type:'discovery',
 prompt:'Qual função esta estrutura cumpre?',
 options:['marcar destino','marcar local da ação'],
 answer:'marcar destino',
 why:'Lugar に 行きます',
 bridge:grammarCatalog.locationNi.mentalModel,
 _reviewType:'grammar',
 _reviewKey:'P:locationNi',
 _unitId:'n5-station',
 method:'discover'
})`,ctx);

ctx.base=base;
const first=vm.runInContext("recordMistake(base,{chosen:'marcar local da ação',node:24})",ctx);
ctx.first=first;
assert.equal(first.concept,'grammar:P:locationNi');
assert.equal(first.lastChosen,'marcar local da ação');
assert.equal(first.exercise._reviewType,'grammar');
assert.equal(first.exercise._reviewKey,'P:locationNi');

const repair=vm.runInContext("grammarRemediationSequence(base,{chosen:'marcar local da ação',mistake:first})",ctx);
assert.equal(Array.from(repair).length,2,'grammar error should create study + retry');
assert.equal(repair[0].type,'study');
assert.equal(repair[0].mode,'repair');
assert.equal(repair[0]._grammarId,'locationNi');
assert.ok(repair[0].mentalModel.includes('destino'));
assert.ok(repair[0].contrast.includes('で'),'locationNi remediation should surface に × で contrast');
assert.ok(repair[0].explanation.includes('marcar local da ação'),'feedback should mention the learner choice');
assert.ok(repair[0].examples.length>=2,'repair should include worked examples');
assert.equal(repair[1]._remediation,true);
assert.equal(repair[1]._grammarRepair,true);
assert.equal(repair[1]._reviewKey,'P:locationNi');

const queued=vm.runInContext("remediationExercises(1)",ctx);
assert.equal(Array.from(queued).length,2,'mistake notebook should preserve study + retry for grammar');
assert.equal(queued[0].type,'study');
assert.equal(queued[0].mode,'repair');
assert.equal(queued[1]._remediation,true);

vm.runInContext("recordMistake(base,{chosen:'marcar local da ação',node:24})",ctx);
const recurrent=vm.runInContext("grammarRemediationSequence(base,{chosen:'marcar local da ação',mistake:state.mistakeStats[mistakeKey(base)]})",ctx);
assert.equal(recurrent[0].mode,'contrastive','repeated grammar errors should escalate to contrastive remediation');
assert.ok(recurrent[0].explanation.length>repair[0].explanation.length,'recurrent remediation should add more conceptual support');

ctx.retry=repair[1];
vm.runInContext("markMistakeRecovered(retry)",ctx);
assert.equal(vm.runInContext("state.mistakeStats[mistakeKey(base)].recovered",ctx),1);

const events=state.learningEvidence.events;
assert.ok(events.some(x=>x.kind==='misconception'&&x.concept==='grammar:P:locationNi'),'grammar mistakes should emit misconception evidence');
assert.ok(events.some(x=>x.kind==='mistake_recovery'),'successful repair should emit recovery evidence');

const vocab=vm.runInContext("({type:'recall',prompt:'Recupere estação',target:'駅',_reviewType:'vocabulary',_reviewKey:'eki'})",ctx);
ctx.vocab=vocab;
assert.deepEqual(Array.from(vm.runInContext("grammarRemediationSequence(vocab,{chosen:'x'})",ctx)),[],'non-grammar errors should not enter grammar remediation');

const source=fs.readFileSync('features/lesson.js','utf8');
assert.ok(source.includes('grammarRemediationSequence'),'lesson runtime must inject targeted grammar remediation');
assert.ok(source.includes('mistake=recordMistake'),'lesson must pass fresh mistake evidence into remediation');
assert.ok(source.includes("!e._grammarRepair"),'grammar retry must not recursively inject endless repair loops');

console.log('MON adaptive grammar remediation contracts passed');
