import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Date,Math,Number,String,Array,Object,Set});
const mistakesSource=fs.readFileSync('core/mistakes.js','utf8');
assert.ok(mistakesSource.includes("mistakeEvidence('mistake'"));
assert.ok(mistakesSource.includes("mistakeEvidence('mistake_recovery'"));
vm.runInContext(fs.readFileSync('core/learning-validation.js','utf8')+';globalThis.__report=learningValidationReport;globalThis.__trend=validationTrend;',ctx);

const H=60*60*1000,now=Date.parse('2026-10-04T15:00:00Z');
const events=[
 {kind:'attempt',ok:true,hintLevel:1,spacingMs:24*H,at:now-12*H,concept:'unit:r1'},
 {kind:'attempt',ok:false,hintLevel:1,spacingMs:72*H,at:now-11*H,concept:'unit:r2'},
 {kind:'attempt',ok:true,hintLevel:0,spacingMs:8*24*H,at:now-10*H,concept:'unit:r3'},

 {kind:'attempt',ok:true,hintLevel:1,at:now-9*H,concept:'unit:h1'},
 {kind:'attempt',ok:true,hintLevel:1,at:now-8*H,concept:'unit:h2'},
 {kind:'attempt',ok:true,hintLevel:0,at:now-7*H,concept:'unit:h3'},
 {kind:'attempt',ok:true,hintLevel:0,at:now-6*H,concept:'unit:h4'},
 {kind:'attempt',ok:true,hintLevel:0,at:now-5*H,concept:'unit:h5'},
 {kind:'attempt',ok:true,hintLevel:0,at:now-4*H,concept:'unit:h6'},

 {kind:'attempt',ok:false,dimension:'transfer',at:now-18*H,concept:'unit:t1'},
 {kind:'attempt',ok:false,dimension:'transfer',at:now-17*H,concept:'unit:t2'},
 {kind:'attempt',ok:true,dimension:'transfer',at:now-16*H,concept:'unit:t3'},
 {kind:'attempt',ok:true,dimension:'transfer',at:now-3*H,concept:'unit:t4'},
 {kind:'attempt',ok:true,dimension:'transfer',at:now-2*H,concept:'unit:t5'},
 {kind:'attempt',ok:true,dimension:'transfer',at:now-H,concept:'unit:t6'},

 {kind:'mission_complete',autonomy:40,at:now-18*H},
 {kind:'mission_complete',autonomy:50,at:now-17*H},
 {kind:'mission_complete',autonomy:60,at:now-16*H},
 {kind:'mission_complete',autonomy:70,at:now-3*H},
 {kind:'mission_complete',autonomy:80,at:now-2*H},
 {kind:'mission_complete',autonomy:90,at:now-H},

 {kind:'mistake',concept:'mA',ok:false,at:now-12*H},
 {kind:'mistake',concept:'mA',ok:false,at:now-11*H},
 {kind:'mistake',concept:'mA',ok:false,at:now-10*H},
 {kind:'mistake_recovery',concept:'mA',ok:true,at:now-3*H},
 {kind:'mistake_recovery',concept:'mA',ok:true,at:now-2*H},
 {kind:'mistake_recovery',concept:'mA',ok:true,at:now-H}
];

const report=ctx.__report({},events,now);
const ret=id=>report.retention.find(x=>x.id===id);

assert.equal(ret('d1').value,67);
assert.equal(ret('d1').samples,3);
assert.equal(ret('d3').value,50);
assert.equal(ret('d3').samples,2);
assert.equal(ret('d7').value,100);
assert.equal(ret('d7').samples,1);
assert.equal(report.transfer.trend.status,'directional');
assert.equal(report.transfer.trend.early,33);
assert.equal(report.transfer.trend.recent,100);
assert.equal(report.transfer.trend.delta,67);
assert.equal(report.autonomy.trend.early,50);
assert.equal(report.autonomy.trend.recent,80);
assert.equal(report.autonomy.trend.delta,30);
assert.equal(report.recurrentErrors.source,'mistake-events');
assert.equal(report.recurrentErrors.concepts,1);
assert.equal(report.recurrentErrors.value,50);
assert.equal(report.recurrentErrors.trend.early,100);
assert.equal(report.recurrentErrors.trend.recent,0);
assert.equal(report.recurrentErrors.trend.delta,-100);
assert.ok(report.hintDependence.trend.delta<0,'hint dependence should fall in the synthetic improving cohort');
assert.match(report.caveat,/não demonstram causalidade/);

const contrastState={grammarConfusions:{
 'deAction|locationNi':{errors:2,recoveries:2,lastErrorAt:now-8*24*H,retention:{d1:true,d3:true,d7:true}},
 'gaState|topicDesu':{errors:1,recoveries:1,lastErrorAt:now-4*24*H,retention:{d1:true,d3:false}}
}};
const contrast=ctx.__report(contrastState,events,now).contrastRetention;
assert.equal(contrast.pairs,2);
assert.equal(contrast.retained,1);
assert.equal(contrast.pending,1);
assert.equal(contrast.windows.find(x=>x.id==='d1').value,100);
assert.equal(contrast.windows.find(x=>x.id==='d3').value,50);

const sparse=ctx.__report({},[{kind:'attempt',ok:true,spacingMs:24*H,at:now}],now);
assert.equal(sparse.retention[0].status,'sparse');
assert.equal(sparse.transfer.trend.status,'insufficient');

console.log('MON longitudinal learning validation contracts passed');

{
 const missing=[null,undefined,'',false,'30',NaN,Infinity,-1,101].map(autonomy=>({kind:'mission_complete',autonomy}));
 const report=ctx.__report({},missing,now);
 assert.equal(report.autonomy.samples,0);
 assert.equal(report.autonomy.value,null);
 const valid=ctx.__report({},[...missing,{kind:'mission_complete',autonomy:0},{kind:'mission_complete',autonomy:100}],now);
 assert.equal(valid.autonomy.samples,2);assert.equal(valid.autonomy.value,50);
}
