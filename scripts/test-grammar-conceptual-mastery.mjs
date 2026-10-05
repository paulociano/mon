import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const state={masteryEvidence:{},methodStats:{},reviewItems:{},mistakeStats:{},functionalMastery:{}};
const ctx=vm.createContext({state,console,Object,Set,Map,Number,String,Math,Array,Date});
for(const file of [
  'data/content-packs-n5.js',
  'data/grammar-pedagogy.js',
  'core/mastery-graph.js',
  'core/learning-methods.js'
])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});

assert.deepEqual(Array.from(vm.runInContext("masteryDimensionsForConcept('grammar:P:locationNi')",ctx)),
  ['recognize','mechanism','contrast','transfer','produce']);

ctx.rec={_reviewType:'grammar',_reviewKey:'P:locationNi',type:'discovery',_masteryDimension:'recognize'};
ctx.mech={_reviewType:'grammar',_reviewKey:'P:locationNi',type:'choice',_masteryDimension:'mechanism'};
ctx.contrast={_reviewType:'grammar',_reviewKey:'P:locationNi',type:'choice',_masteryDimension:'contrast'};
ctx.transfer={_reviewType:'grammar',_reviewKey:'P:locationNi',type:'transfer',_masteryDimension:'transfer'};
ctx.produce={_reviewType:'grammar',_reviewKey:'P:locationNi',type:'roleplay',_masteryDimension:'produce'};

for(let i=0;i<4;i++)vm.runInContext("recordMasteryEvidence(rec,true,{})",ctx);
const recognitionOnly=vm.runInContext("conceptMastery('grammar:P:locationNi')",ctx);
assert.ok(recognitionOnly<40,'recognition alone must not imply grammar mastery');

for(const name of ['mech','contrast','transfer','produce'])for(let i=0;i<4;i++)vm.runInContext(`recordMasteryEvidence(${name},true,{})`,ctx);
const complete=vm.runInContext("conceptMastery('grammar:P:locationNi')",ctx);
assert.ok(complete>=75,'balanced conceptual evidence should produce strong mastery');

const breakdown=vm.runInContext("conceptBreakdown('grammar:P:locationNi')",ctx);
assert.deepEqual(Array.from(breakdown).map(x=>x.dimension),['recognize','mechanism','contrast','transfer','produce']);
assert.ok(Array.from(breakdown).every(x=>x.attempts>=4));

const unit=vm.runInContext("coursePacks.N5.units.find(x=>x.id==='n5-station')",ctx);
ctx.unit=unit;
const seq=vm.runInContext("compileAdaptiveMONSequence(unit)",ctx);
const grammarRows=Array.from(seq).filter(x=>x._reviewType==='grammar');
assert.ok(grammarRows.some(x=>x._masteryDimension==='mechanism'),'lesson must collect mechanism evidence');
assert.ok(grammarRows.some(x=>x._masteryDimension==='contrast'),'lesson must collect contrast evidence');
assert.ok(grammarRows.some(x=>x._masteryDimension==='transfer'),'lesson must attribute grammar transfer');
assert.ok(grammarRows.some(x=>x._masteryDimension==='produce'),'lesson must attribute grammar production');

const mech=grammarRows.find(x=>x._masteryDimension==='mechanism');
assert.equal(mech.answer,vm.runInContext("grammarCatalog[mech._reviewKey.slice(2)].mentalModel",Object.assign(ctx,{mech})));
const boundary=grammarRows.find(x=>x._masteryDimension==='contrast');
assert.ok(boundary.answer.includes('で'),'locationNi contrast check should test the canonical に × で boundary');

const hints=vm.runInContext("methodForWeakDimension('mechanism')",ctx);
assert.equal(hints,'mechanism');
assert.equal(vm.runInContext("methodForWeakDimension('contrast')",ctx),'contrast');

const notebook=fs.readFileSync('features/grammar-notebook.js','utf8');
assert.ok(notebook.includes('conceptBreakdown(concept)'),'Notebook must consume conceptual breakdown');
assert.ok(notebook.includes("mechanism:'mecanismo'"),'Notebook must label mechanism mastery');
assert.ok(notebook.includes("contrast:'contraste'"),'Notebook must label contrast mastery');

console.log('MON conceptual grammar mastery contracts passed');
