import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const state={methodStats:{},reviewItems:{},reviews:{},kanaReviews:{},grammarRecall:{}};
const ctx=vm.createContext({state,console,Object,Set,Number,String,Math,Date});
vm.runInContext(fs.readFileSync('data/content-packs.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('core/learning-methods.js','utf8'),ctx);

let seq=vm.runInContext("adaptiveMethodSequence(coursePacks.N5.units[0])",ctx);
assert.ok(seq.includes('discover')&&seq.includes('freeRecall'));

state.methodStats.recall={attempts:10,correct:4,hints:0};
seq=vm.runInContext("adaptiveMethodSequence(coursePacks.N5.units[0])",ctx);
assert.ok(seq.indexOf('cloze')<seq.indexOf('freeRecall'),'weak recall should scaffold with cloze');

state.methodStats.recall={attempts:10,correct:9,hints:0};
state.methodStats.transfer={attempts:10,correct:9,hints:0};
seq=vm.runInContext("adaptiveMethodSequence(coursePacks.N5.units[0])",ctx);
assert.equal(seq[0],'freeRecall','strong recall should start with retrieval');

vm.runInContext("recordMethodOutcome({method:'produce'},true,{hintUsed:false})",ctx);
assert.equal(state.methodStats.produce.attempts,1);
assert.equal(state.methodStats.produce.correct,1);

vm.runInContext("recordMethodOutcome({method:'produce'},false,{hintUsed:true})",ctx);
assert.equal(state.methodStats.produce.hints,1);

console.log('MON adaptive method tests passed');
