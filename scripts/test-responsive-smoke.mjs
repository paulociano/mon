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
  await page.addInitScript(()=>{
   localStorage.setItem('mon-onboarded','1');
   class StalledIntersectionObserver{observe(){}unobserve(){}disconnect(){}}
   Object.defineProperty(window,'IntersectionObserver',{value:StalledIntersectionObserver,writable:true});
  });
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForSelector('#home.active',{state:'visible'});
  await assertNoOverflow(page,viewport.name+' home');
  const shellLayout=await page.evaluate(()=>({
   sidebar:getComputedStyle(document.querySelector('.sidebar')).display,
   app:getComputedStyle(document.querySelector('.app')).display,
   mainWidth:document.querySelector('main').getBoundingClientRect().width,
   viewport:document.documentElement.clientWidth
  }));
  assert.equal(shellLayout.sidebar,'none',viewport.name+' desktop sidebar must be hidden');
  assert.equal(shellLayout.app,'block',viewport.name+' app shell must collapse to one column');
  assert.ok(shellLayout.mainWidth>=shellLayout.viewport-2,viewport.name+' main content must occupy full viewport: '+JSON.stringify(shellLayout));
  await page.waitForSelector('.course-banner.home-reveal');
  const homeVisibility=await page.evaluate(()=>({
   bannerOpacity:getComputedStyle(document.querySelector('.course-banner')).opacity,
   bannerTitle:getComputedStyle(document.getElementById('homeAdaptiveTitle')).visibility,
   bannerText:(document.getElementById('homeAdaptiveTitle')?.innerText||'').trim(),
   unitOpacity:getComputedStyle(document.querySelector('.path-unit')).opacity,
   unitTitle:(document.querySelector('.unit-heading b')?.innerText||'').trim()
  }));
  assert.equal(homeVisibility.bannerOpacity,'1',viewport.name+' Home banner must stay visible even if IntersectionObserver stalls');
  assert.equal(homeVisibility.bannerTitle,'visible',viewport.name+' Home title must be visible');
  assert.ok(homeVisibility.bannerText.length>4,viewport.name+' Home title must contain readable text');
  assert.equal(homeVisibility.unitOpacity,'1',viewport.name+' current path unit must stay visible');
  assert.ok(homeVisibility.unitTitle.length>2,viewport.name+' current path unit title must be visible');
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
