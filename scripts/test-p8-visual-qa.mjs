import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base=process.env.MON_SMOKE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const out='test-results/visual-qa';
await fs.mkdir(out,{recursive:true});

async function assertViewport(page,label,selector){
  const layout=await page.evaluate(sel=>{
    const root=document.documentElement,el=document.querySelector(sel);
    const r=el?.getBoundingClientRect();
    return {
      scrollWidth:root.scrollWidth,
      clientWidth:root.clientWidth,
      left:r?.left??null,
      right:r?.right??null,
      width:r?.width??null,
      visible:!!el&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'
    };
  },selector);
  assert.ok(layout.scrollWidth<=layout.clientWidth+2,label+' horizontal overflow: '+JSON.stringify(layout));
  assert.equal(layout.visible,true,label+' key surface must be visible');
  assert.ok(layout.left!==null&&layout.left>=-2,label+' key surface escapes left edge: '+JSON.stringify(layout));
  assert.ok(layout.right!==null&&layout.right<=layout.clientWidth+2,label+' key surface escapes right edge: '+JSON.stringify(layout));
}

async function capture(page,viewport,view,selector,setup){
  await page.evaluate(async id=>await go(id),view);
  await page.waitForSelector('#'+view+'.active',{state:'visible'});
  if(setup)await setup(page);
  await page.waitForTimeout(80);
  await assertViewport(page,viewport.name+' '+view,selector);
  await page.screenshot({path:`${out}/${viewport.name}-${view}.png`,fullPage:true});
}

try{
  for(const viewport of [
    {width:390,height:844,name:'mobile'},
    {width:1280,height:900,name:'desktop'}
  ]){
    const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height}});
    await page.addInitScript(()=>{
      localStorage.setItem('mon-onboarded','1');
      class FakeSpeechRecognition{start(){}stop(){}}
      Object.defineProperty(window,'SpeechRecognition',{value:FakeSpeechRecognition,writable:true});
    });
    const errors=[];
    page.on('pageerror',e=>errors.push(String(e?.stack||e)));
    const response=await page.goto(base+'?view=home',{waitUntil:'networkidle'});
    assert.ok(response?.ok(),viewport.name+' initial navigation failed');
    await page.waitForSelector('#home.active',{state:'visible'});

    await assertViewport(page,viewport.name+' home','.course-banner');
    await page.screenshot({path:`${out}/${viewport.name}-home.png`,fullPage:true});

    await capture(page,viewport,'journey','.journey-hero');
    await capture(page,viewport,'explore','.hub-hero');
    await capture(page,viewport,'progress','.progress-capability-card');
    await capture(page,viewport,'practice','.practice-coach');
    await capture(page,viewport,'missions','#missionRunner',async p=>{
      await p.evaluate(()=>startMissionV2('phone'));
      await p.waitForSelector('#missionRunner .mission-choices button',{state:'visible'});
      await assertViewport(p,viewport.name+' mission dialogue','.mission-npc');
      await assertViewport(p,viewport.name+' mission choices','.mission-choices');
    });
    await capture(page,viewport,'pronunciation','.pron-hero');
    await capture(page,viewport,'kanji','.ka-focus');

    await page.evaluate(async()=>{
      await ensureLearningRuntime();
      await ensureFeatureRuntime('lesson');
      quickRun={idx:0,node:flatPath[0],pack:{title:'Visual QA',exercises:[{type:'choice',prompt:'Escolha a resposta correta',options:['東京','大阪','京都','駅'],answer:'東京',why:'visual'}]},step:0,correct:0,answered:0,streak:0,xp:0,selected:null,built:[],matches:[],matchPick:null,checked:false};
      await go('lesson');
      renderQuickExercise();
    });
    await page.waitForSelector('#lesson.active .quick-option',{state:'visible'});
    await assertViewport(page,viewport.name+' lesson','.quick-main');
    await page.screenshot({path:`${out}/${viewport.name}-lesson.png`,fullPage:true});

    assert.equal(errors.length,0,viewport.name+' visual QA emitted runtime errors: '+errors.join('\n'));
    await page.close();
  }
  console.log('MON P8 visual QA evidence passed');
}finally{
  await browser.close();
}
