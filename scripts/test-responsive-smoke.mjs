import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base=process.env.MON_SMOKE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});

async function assertNoOverflow(page,label){
 const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
 assert.ok(dims.scroll<=dims.client+2,label+' has horizontal overflow: '+JSON.stringify(dims));
}

try{
 for(const viewport of [{width:390,height:844,name:'mobile'},{width:768,height:1024,name:'tablet'}]){
  const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height}});
  await page.addInitScript(()=>localStorage.setItem('mon-onboarded','1'));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForSelector('#home.active',{state:'visible'});
  await assertNoOverflow(page,viewport.name+' home');
  const banner=await page.locator('.course-banner').boundingBox();
  assert.ok(banner&&banner.width<=viewport.width,viewport.name+' home banner must fit viewport');

  await page.evaluate(async()=>await go('practice'));
  await page.waitForSelector('#practice.active',{state:'visible'});
  await page.waitForSelector('#practiceCoach',{state:'visible'});
  await assertNoOverflow(page,viewport.name+' practice');

  await page.evaluate(async()=>{
   await ensureLearningRuntime();await ensureFeatureRuntime('lesson');
   quickRun={idx:0,node:flatPath[0],pack:{title:'Responsive',exercises:[{type:'choice',prompt:'Escolha a resposta correta para continuar',options:['a','b','c','d'],answer:'a',why:'responsive'}]},step:0,correct:0,answered:0,streak:0,xp:0,selected:null,built:[],matches:[],matchPick:null,checked:false};
   await go('lesson');renderQuickExercise();
  });
  await page.waitForSelector('#lesson.active',{state:'visible'});
  await page.waitForSelector('.quick-option',{state:'visible'});
  await assertNoOverflow(page,viewport.name+' lesson');
  const button=await page.locator('.quick-option').first().boundingBox();
  assert.ok(button&&button.height>=44,viewport.name+' lesson answer target should remain comfortably tappable');
  await page.close();
 }
 console.log('MON responsive smoke passed');
}finally{
 await browser.close();
}
