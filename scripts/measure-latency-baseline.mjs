import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base=process.env.MON_SMOKE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});

try{
 await page.addInitScript(()=>{localStorage.setItem('mon-onboarded','1');localStorage.removeItem('mon_perf_v1')});
 await page.goto(base+'?debug=1',{waitUntil:'networkidle'});
 await page.waitForSelector('#home.active',{state:'visible'});

 for(let i=0;i<6;i++){
  await page.evaluate(async()=>{await go('progress');await go('home')});
 }
 await page.evaluate(async()=>{
  await ensureLearningRuntime();
  await ensureFeatureRuntime('lesson');
  quickRun={idx:0,node:flatPath[0],pack:{title:'Latency',exercises:[{type:'choice',prompt:'Escolha',options:['a','b'],answer:'a',why:'baseline'}]},step:0,correct:0,answered:0,streak:0,xp:0,selected:null,built:[],matches:[],matchPick:null,checked:false};
  const start=perfStart();await go('lesson');renderQuickExercise();perfEnd('lesson:interactive',start,{mode:'baseline'});
  await go('home');
 });
 await page.waitForTimeout(150);
 const snapshot=await page.evaluate(()=>performanceSnapshot());

 for(const name of ['view:progress','view:home','lesson:interactive']){
  assert.ok(snapshot[name],name+' missing from latency baseline');
  assert.ok(snapshot[name].samples>=1,name+' needs samples');
  assert.ok(snapshot[name].p95>=snapshot[name].p50,name+' p95 must be >= p50');
 }
 const result={
  environment:{engine:'chromium',viewport:'1280x900',mode:'local-ci'},
  generatedAt:new Date().toISOString(),
  metrics:snapshot
 };
 console.log('MON latency baseline');
 console.log(JSON.stringify(result,null,2));
}finally{
 await browser.close();
}
