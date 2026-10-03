import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const state={masteryEvidence:{},unitMastery:{},remediation:null};
const ctx=vm.createContext({state,console,Object,Set,Number,String,Math,Date});
vm.runInContext(fs.readFileSync('data/content-packs.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('core/mastery-graph.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('core/progression-engine.js','utf8'),ctx);

let d=vm.runInContext("progressionDecision({day:25,type:'lesson'},{unitId:'n5-station'},95)",ctx);
assert.equal(d.action,'reinforce','an unseen structured unit must not advance just for completion');
assert.ok(d.gaps.length>0,'reinforcement needs concrete gaps');

for(const key of ['eki','doko']){
  for(const dim of ['recognize','recall','listen','transfer','produce']){
    for(let i=0;i<8;i++)vm.runInContext(`recordMasteryEvidence({_reviewType:'vocabulary',_reviewKey:'${key}',type:'${dim==='recognize'?'choice':dim==='recall'?'recall':dim==='listen'?'dictation':dim==='transfer'?'transfer':'roleplay'}},true,{hintUsed:false})`,ctx);
  }
}
for(const dim of ['recognize','recall','listen','transfer','produce']){
  for(let i=0;i<8;i++)vm.runInContext(`recordMasteryEvidence({_reviewType:'grammar',_reviewKey:'P:locationWaDoko',type:'${dim==='recognize'?'choice':dim==='recall'?'recall':dim==='listen'?'dictation':dim==='transfer'?'transfer':'roleplay'}},true,{hintUsed:false})`,ctx);
}
// Add enough evidence for other unit concepts so coverage clears the contract.
for(const key of ['deguchi','iriguchi','migi','hidari','massugu','sumimasen','mouichido']){
  for(let i=0;i<3;i++)vm.runInContext(`recordMasteryEvidence({_reviewType:'vocabulary',_reviewKey:'${key}',type:'choice'},true,{hintUsed:false})`,ctx);
}
vm.runInContext("for(let i=0;i<3;i++)recordMasteryEvidence({_reviewType:'grammar',_reviewKey:'P:locationNi',type:'choice'},true,{hintUsed:false})",ctx);

d=vm.runInContext("progressionDecision({day:25,type:'lesson'},{unitId:'n5-station'},92)",ctx);
assert.equal(d.action,'advance','mastery plus sufficient lesson accuracy should advance');

const zero=vm.runInContext("progressionDecision({day:12,type:'lesson'},{},30)",ctx);
assert.equal(zero.action,'advance','Foundation Zero remains linear for now');

const pack=vm.runInContext("buildMasteryRemediation({day:25,label:'Estação'})",ctx);
assert.ok(pack.exercises.length>=1&&pack.exercises.length<=6);
assert.equal(pack.remediation,true);
assert.ok(pack.exercises.every(x=>x._unitId==='n5-station'));

console.log('MON mastery progression tests passed');
