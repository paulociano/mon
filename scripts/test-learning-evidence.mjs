import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=fs.readFileSync('core/learning-evidence.js','utf8');
const context={state:{learningEvidence:{events:[]}},Date,Math,Number,String,Array,Object,console};
vm.createContext(context);
vm.runInContext(source+';globalThis.__record=recordLearningEvidence;globalThis.__summary=learningEvidenceSummary;globalThis.__state=learningEvidenceState;',context);

context.__record({source:'mastery',kind:'attempt',concept:'vocabulary:test',dimension:'recall',method:'recall',ok:true,spacingMs:24*60*60*1000});
context.__record({source:'mastery',kind:'attempt',concept:'unit:test',dimension:'transfer',method:'transfer',ok:false,hintUsed:true,spacingMs:1000});
context.__record({source:'mission',kind:'attempt',dimension:'produce',method:'roleplay',ok:true,context:'mission'});
context.__record({source:'mission',kind:'mission_complete',ok:true,context:'mission',autonomy:88});

const summary=context.__summary();
assert.equal(summary.attempts,3);
assert.equal(summary.accuracy,67);
assert.equal(summary.retentionAttempts,1);
assert.equal(summary.retentionAccuracy,100);
assert.equal(summary.transferAttempts,2);
assert.equal(summary.transferAccuracy,50);
assert.equal(summary.independentAttempts,2);
assert.equal(summary.independentAccuracy,100);
assert.equal(summary.missionCompletions,1);
assert.equal(summary.autonomyAverage,88);

for(let i=0;i<650;i++)context.__record({source:'test',kind:'attempt',ok:true});
assert.equal(context.__state().events.length,600,'learning evidence must remain bounded');
assert.ok(!source.includes('fetch(')&&!source.includes('sendBeacon'),'learning evidence must remain local-only');

console.log('MON learning evidence contracts passed');
