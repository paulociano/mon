import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base=process.env.MON_SMOKE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});

async function noOverflow(page,label){
 const d=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
 assert.ok(d.scroll<=d.client+2,label+' horizontal overflow: '+JSON.stringify(d));
}
async function target(page,selector,label){
 const box=await page.locator(selector).first().boundingBox();
 assert.ok(box&&box.height>=40,label+' target too small: '+JSON.stringify(box));
}

try{
 for(const v of [{width:390,height:844,name:'mobile'},{width:768,height:1024,name:'tablet'}]){
  const page=await browser.newPage({viewport:{width:v.width,height:v.height}});
  await page.addInitScript(()=>localStorage.setItem('mon-onboarded','1'));
  await page.goto(base,{waitUntil:'networkidle'});

  await page.evaluate(async()=>await go('foundation'));
  await page.waitForSelector('#foundation.active',{state:'visible'});
  await page.waitForSelector('#foundationReferenceAtlas details',{state:'visible'});
  await noOverflow(page,v.name+' foundation');
  await target(page,'#foundationReferenceAtlas summary',v.name+' foundation atlas');

  await page.evaluate(async()=>await go('journal'));
  await page.waitForSelector('#journal.active',{state:'visible'});
  await page.waitForSelector('#journalContent',{state:'visible'});
  await noOverflow(page,v.name+' journal');
  if(await page.locator('#journalContent button').count())await target(page,'#journalContent button',v.name+' journal');

  await page.evaluate(async()=>await go('missions'));
  await page.waitForSelector('#missions.active',{state:'visible'});
  await page.waitForSelector('#missionRunner',{state:'visible'});
  await noOverflow(page,v.name+' missions');
  await page.evaluate(()=>startMissionV2('phone'));
  await page.waitForSelector('#missionRunner .mission-choices button',{state:'visible'});
  await target(page,'#missionRunner .mission-choices button',v.name+' mission choice');
  await noOverflow(page,v.name+' active mission');

  await page.evaluate(async()=>await go('pronunciation'));
  await page.waitForSelector('#pronunciation.active',{state:'visible'});
  await page.waitForSelector('#pronMic',{state:'visible'});
  await noOverflow(page,v.name+' pronunciation');
  await target(page,'#pronMic',v.name+' microphone');
  await target(page,'.pron-tabs button',v.name+' pronunciation tab');

  await page.evaluate(async()=>await go('kanji'));
  await page.waitForSelector('#kanji.active',{state:'visible'});
  await page.waitForSelector('.ka-focus',{state:'visible'});
  await noOverflow(page,v.name+' kanji');
  await target(page,'.ka-library-toggle',v.name+' kanji library');
  await target(page,'.ka-focus .primary',v.name+' kanji study');

  await page.close();
 }
 console.log('MON P8 secondary surfaces responsive smoke passed');
}finally{
 await browser.close();
}
