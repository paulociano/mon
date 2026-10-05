import { chromium, firefox, webkit } from 'playwright';
import assert from 'node:assert/strict';

const base=process.env.MON_SMOKE_URL||'http://127.0.0.1:4173';
const browserName=(process.env.MON_BROWSER||'chromium').toLowerCase();
const rounds=Math.max(3,Number(process.env.MON_LATENCY_ROUNDS||5));
const browserType={chromium,firefox,webkit}[browserName];
if(!browserType)throw new Error('Unsupported MON_BROWSER '+browserName);

const median=values=>{
 const s=[...values].filter(Number.isFinite).sort((a,b)=>a-b);
 if(!s.length)return null;
 const m=Math.floor(s.length/2);
 return s.length%2?s[m]:(s[m-1]+s[m])/2;
};
const spread=values=>{
 const s=[...values].filter(Number.isFinite).sort((a,b)=>a-b);
 if(!s.length)return null;
 const med=median(s);
 return {min:s[0],max:s.at(-1),median:med,relative:med?Math.round(((s.at(-1)-s[0])/med)*1000)/10:null};
};

const browser=await browserType.launch({headless:true});
const results=[];
try{
 for(let round=1;round<=rounds;round++){
  const context=await browser.newContext({viewport:{width:1280,height:900}});
  const page=await context.newPage();
  await page.addInitScript(()=>{localStorage.setItem('mon-onboarded','1');localStorage.removeItem('mon_perf_v1')});
  await page.goto(base+'?view=home&debug=1',{waitUntil:'networkidle'});
  await page.waitForSelector('#home.active',{state:'visible'});
  for(let i=0;i<6;i++)await page.evaluate(async()=>{await go('progress');await go('home')});
  await page.evaluate(async()=>{
   await ensureLearningRuntime();await ensureFeatureRuntime('lesson');
   quickRun={idx:0,node:flatPath[0],pack:{title:'Latency',exercises:[{type:'choice',prompt:'Escolha',options:['a','b'],answer:'a',why:'baseline'}]},step:0,correct:0,answered:0,streak:0,xp:0,selected:null,built:[],matches:[],matchPick:null,checked:false};
   const start=perfStart();await go('lesson');renderQuickExercise();perfEnd('lesson:interactive',start,{mode:'calibration'});
   await go('home');
  });
  await page.waitForFunction(()=>{
   const snapshot=performanceSnapshot();
   return ['view:progress','view:home','lesson:interactive'].every(name=>snapshot[name]?.samples>=1);
  },null,{timeout:2500});
  const snapshot=await page.evaluate(()=>performanceSnapshot());
  const row={round,metrics:{}};
  for(const name of ['view:progress','view:home','lesson:interactive']){
   const metric=snapshot[name];
   assert.ok(metric,name+' missing in '+browserName+' round '+round);
   assert.ok(metric.samples>=1,name+' has no samples in '+browserName+' round '+round);
   assert.ok(metric.p95>=metric.p50,name+' p95 must be >= p50');
   row.metrics[name]={samples:metric.samples,p50:metric.p50,p95:metric.p95};
  }
  results.push(row);
  await context.close();
 }
}finally{
 await browser.close();
}

const metricNames=['view:progress','view:home','lesson:interactive'];
const summary={};
for(const name of metricNames){
 const p50=results.map(r=>r.metrics[name].p50),p95=results.map(r=>r.metrics[name].p95);
 summary[name]={rounds,medianP50:median(p50),medianP95:median(p95),p50Spread:spread(p50),p95Spread:spread(p95)};
}
const report={
 environment:{engine:browserName,viewport:'1280x900',mode:'local-ci'},
 rounds,
 generatedAt:new Date().toISOString(),
 metrics:summary,
 interpretation:{
  technicalBaseline:'multi-round',
  absoluteBudgetGate:false,
  reason:'CI calibration is lab data; production/device evidence is still required before absolute latency thresholds block merges.'
 }
};
console.log('MON latency calibration');
console.log(JSON.stringify(report,null,2));
