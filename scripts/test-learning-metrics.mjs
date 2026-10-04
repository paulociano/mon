import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Date,Math,Number,String,Array,Object});
vm.runInContext(fs.readFileSync('core/learning-evidence.js','utf8')+';globalThis.RETENTION_MIN_MS=RETENTION_MIN_MS;',ctx);
vm.runInContext(fs.readFileSync('core/learning-metrics.js','utf8')+';globalThis.__snapshot=learningMetricsSnapshot;globalThis.__status=metricStatus;',ctx);

const now=Date.parse('2026-10-04T15:00:00Z');
const events=[
 {kind:'attempt',ok:true,spacingMs:24*60*60*1000,dimension:'recall',at:now-1000},
 {kind:'attempt',ok:false,spacingMs:24*60*60*1000,dimension:'transfer',context:'transfer',at:now-900},
 {kind:'attempt',ok:true,spacingMs:1000,dimension:'produce',context:'mission',at:now-800},
 {kind:'mission_complete',autonomy:80,at:now-700},
 {kind:'mission_complete',autonomy:100,at:now-600}
];
const state={
 sessions:4,xp:420,streak:3,lastStudyDate:'2026-10-04',
 masteryEvidence:{
  'unit:a':{recall:{score:80,attempts:3,lastAt:now-500},transfer:{score:60,attempts:2,lastAt:now-400}}
 },
 productionGaps:{
  confirm:{count:4,recovered:3,lastAt:now-300},
  repair:{count:2,recovered:1,lastAt:now-200}
 }
};
const snapshot=ctx.__snapshot(state,events,now);
const by=id=>snapshot.metrics.find(x=>x.id===id);

assert.deepEqual(snapshot.metrics.map(x=>x.id),['activity','retention','mastery','transfer','repair','autonomy']);
assert.equal(by('activity').value,4);
assert.equal(by('retention').value,50);
assert.equal(by('retention').samples,2);
assert.equal(by('mastery').value,70);
assert.equal(by('transfer').value,50);
assert.equal(by('transfer').samples,2);
assert.equal(by('repair').value,67);
assert.equal(by('repair').samples,6);
assert.equal(by('autonomy').value,90);
assert.equal(by('autonomy').samples,2);
assert.equal(snapshot.coverage.observed,6);
assert.equal(ctx.__status(0,null,now),'empty');
assert.equal(ctx.__status(2,now,now),'early');
assert.equal(ctx.__status(3,now-15*24*60*60*1000,now),'stale');
assert.equal(ctx.__status(3,now,now),'ready');

for(const metric of snapshot.metrics){
 assert.ok(Object.hasOwn(metric,'samples'),metric.id+' missing denominator');
 assert.ok(Object.hasOwn(metric,'status'),metric.id+' missing data-quality status');
}

const source=fs.readFileSync('core/learning-metrics.js','utf8');
assert.ok(!source.includes('fetch(')&&!source.includes('sendBeacon'),'learning metrics must stay local-only');

console.log('MON learning metrics contracts passed');
