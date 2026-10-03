import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const state={masteryEvidence:{},unitMastery:{},methodStats:{}};
const ctx=vm.createContext({state,console,Object,Set,Number,String,Math,Date});
vm.runInContext(fs.readFileSync('data/content-packs.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('core/mastery-graph.js','utf8'),ctx);

for(let i=0;i<3;i++)vm.runInContext("recordMasteryEvidence({_reviewType:'vocabulary',_reviewKey:'eki',type:'choice'},true,{hintUsed:false})",ctx);
for(let i=0;i<3;i++)vm.runInContext("recordMasteryEvidence({_reviewType:'vocabulary',_reviewKey:'eki',type:'recall'},false,{hintUsed:false})",ctx);

const recognize=vm.runInContext("masteryScore('vocabulary:eki','recognize')",ctx);
const recall=vm.runInContext("masteryScore('vocabulary:eki','recall')",ctx);
assert.ok(recognize>recall,'recognition and recall must remain separate');
assert.ok(recall<50,'failed free recall should expose weak edge');

const weak=vm.runInContext("masteryWeakEdges(3)",ctx);
assert.equal(weak[0].dimension,'recall');

const hints=vm.runInContext("masteryMethodHints(coursePacks.N5.units[0])",ctx);
assert.ok(Array.from(hints).includes('freeRecall'),'weak recall should bias future method mix');

for(let i=0;i<5;i++)vm.runInContext("recordMasteryEvidence({_reviewType:'vocabulary',_reviewKey:'doko',type:'recall'},true,{hintUsed:false})",ctx);
const doko=vm.runInContext("conceptMastery('vocabulary:doko')",ctx);
assert.ok(doko>50,'repeated clean retrieval should build concept mastery');

const status=vm.runInContext("unitMasteryStatus(coursePacks.N5.units[0])",ctx);
assert.ok(['exposed','reinforcing','mastered'].includes(status.status));
assert.ok(status.coverage>=0&&status.coverage<=100);

console.log('MON mastery graph tests passed');
