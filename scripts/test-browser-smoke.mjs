import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base=process.env.MON_SMOKE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
await page.addInitScript(()=>{
 localStorage.setItem('mon-onboarded','1');
 window.__srConstructed=0;
 class FakeSpeechRecognition{constructor(){window.__srConstructed++}start(){}stop(){}}
 Object.defineProperty(window,'SpeechRecognition',{value:FakeSpeechRecognition,writable:true});
});
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));
page.on('console',msg=>{if(msg.type()==='error')console.error('[browser console]',msg.text())});

async function waitVisible(selector){
 try{
  await page.waitForSelector(selector,{state:'visible'});
 }catch(error){
  const snapshot=await page.locator(selector).evaluateAll(nodes=>nodes.map(node=>({
   tag:node.tagName,
   id:node.id,
   className:node.className,
   hidden:node.hidden,
   display:getComputedStyle(node).display,
   visibility:getComputedStyle(node).visibility,
   opacity:getComputedStyle(node).opacity,
   rect:node.getBoundingClientRect().toJSON()
  }))).catch(()=>[]);
  throw new Error(`Failed waiting for ${selector}. pageErrors=${pageErrors.join(' | ')||'none'} snapshot=${JSON.stringify(snapshot)} original=${error.message}`);
 }
}

try{
 const response=await page.goto(base,{waitUntil:'networkidle'});
 if(!response?.ok()){
  throw new Error(`MON smoke navigation failed: status=${response?.status()??'none'} url=${page.url()}`);
 }
 try{
  await waitVisible('#home.active');
 }catch(error){
  const title=await page.title().catch(()=> '');
  const body=await page.locator('body').innerText().catch(()=> '');
  const markup=(await page.content().catch(()=> '')).slice(0,1200);
  throw new Error(`${error.message} finalUrl=${page.url()} status=${response.status()} title=${JSON.stringify(title)} body=${JSON.stringify(body.slice(0,600))} markup=${JSON.stringify(markup)}`);
 }
 assert.equal(pageErrors.length,0,'Home boot emitted page errors: '+pageErrors.join('\n'));
 await page.keyboard.press('Tab');
 assert.equal(await page.evaluate(()=>document.activeElement?.classList.contains('skip-link')),true,'first keyboard stop should expose skip link');
 await page.keyboard.press('Enter');
 assert.equal(await page.evaluate(()=>document.activeElement?.id),'mainContent','skip link must move focus to main content');
 const progressNav=page.locator('#desktopNav [data-view="progress"]');
 await progressNav.focus();await page.keyboard.press('Enter');await waitVisible('#progress.active');
 assert.equal(await page.evaluate(()=>document.activeElement?.id),'progress','keyboard navigation must move focus to the active view');
 await page.evaluate(async()=>await go('home'));
 await waitVisible('#home.active');
 assert.equal(await page.evaluate(()=>typeof speak),'function','shared speak helper must exist at shell boot');
 assert.equal(await page.evaluate(()=>typeof shuffleArray),'function','shared shuffle helper must exist at shell boot');

 for(const target of ['journey','explore','progress']){
  await page.click(`#desktopNav [data-view="${target}"]`);
  await waitVisible(`#${target}.active`);
 }
 await page.click('#desktopNav [data-view="explore"]');
 await waitVisible('#explore.active');

 await page.click('[data-view="pronunciation"]');
 await waitVisible('#pronunciation.active');
 await page.waitForSelector('#pronMic',{state:'visible'});
 assert.equal(await page.evaluate(()=>window.__srConstructed),0,'opening pronunciation must not request microphone access');
 const micBox=await page.locator('#pronMic').boundingBox();
 assert.ok(micBox&&micBox.width>=24&&micBox.height>=24,'microphone control must meet minimum target size');
 assert.match(await page.locator('#pronMicPolicy').innerText(),/só é solicitado/i,'microphone policy must explain explicit activation');
 await page.evaluate(async()=>await go('videos'));

 await waitVisible('#videos.active');
 await page.waitForSelector('#videoGrid .video-card');
 assert.equal(await page.locator('#videoModal').evaluate(el=>el.hidden),true,'video modal must stay hidden before playback');
 await page.locator('#videoGrid .video-card').first().click();
 await waitVisible('#videoModal.open');
 assert.equal(await page.locator('#videoModal').evaluate(el=>el.hidden),false,'video modal should unhide after click');
 assert.match(await page.locator('#videoStage iframe').getAttribute('src'),/youtube-nocookie\.com\/embed\//);
 assert.match(await page.locator('#videoExternalLink').getAttribute('href'),/youtube\.com\/watch\?v=/);
 await page.click('#videoClose');
 assert.equal(await page.locator('#videoModal').evaluate(el=>el.hidden),true,'video modal must hide after close');

 await page.evaluate(async()=>{await ensureLearningRuntime();await ensureFeatureRuntime('lesson');quickRun={idx:0,node:flatPath[0],pack:{title:'Smoke',exercises:[{type:'wordbank',prompt:'Monte',target:'東京駅',tokens:['東京','駅'],why:'smoke'},{type:'speak',prompt:'Fale',target:'こんにちは',pt:'olá',why:'smoke'}]},step:0,correct:0,answered:0,streak:0,xp:0,selected:null,built:[],matches:[],matchPick:null,checked:false};await go('lesson');renderQuickExercise()});
 await waitVisible('#lesson.active');
 await page.waitForSelector('#wordBank .word-token');
 await page.evaluate(()=>speak('こんにちは'));
 assert.equal(pageErrors.length,0,'lesson helpers emitted page errors: '+pageErrors.join('\n'));
 await page.evaluate(async()=>await go('missions'));
 await waitVisible('#missions.active');
 await page.evaluate(()=>startMissionV2('phone'));
 await page.locator('#missionRunner .mission-choices button').first().click();
 await page.locator('#missionRunner .mission-choices button').first().click();
 await page.waitForSelector('#missionFreeText',{state:'visible'});
 await page.fill('#missionFreeText','五時でお願いします');
 await page.click('.mission-free .primary');
 assert.equal(await page.locator('#missionFreeText').count(),0,'successful free response must advance the dialogue');
 assert.match(await page.locator('#missionRunner').innerText(),/先ほど選んだ五時/,'closing turn must remember the selected time');
 assert.match(await page.locator('#missionRunner').innerText(),/十分前/,'world state must add a consequence to the confirmed booking');
 assert.equal(await page.evaluate(()=>missionRun.contextMemory.time),'五時','mission runtime must retain the selected time');
 assert.equal(await page.evaluate(()=>missionRun.worldState.booking),'confirmed','selected time must change booking world state');
 await page.locator('#missionRunner .mission-choices button').first().click();
 assert.equal(await page.evaluate(()=>state.survivalMissions.completed.phone.worldState.bookingTime),'五時','completed mission must persist world state');
 assert.equal(pageErrors.length,0,'multi-turn free mission emitted page errors: '+pageErrors.join('\n'));

 await page.evaluate(async()=>await go('practice'));

 await waitVisible('#practice.active');
 await page.waitForSelector('#practiceCoach');
 assert.equal(pageErrors.length,0,'navigation emitted page errors: '+pageErrors.join('\n'));

 await page.evaluate(async()=>await go('home'));
 await waitVisible('#home.active');
 await page.evaluate(()=>localStorage.setItem('mon-state',JSON.stringify({saveVersion:3,xp:321,foundationDay:4,energy:30,maxEnergy:30})));
 await page.reload({waitUntil:'networkidle'});
 await waitVisible('#home.active');
 assert.equal(await page.evaluate(()=>state.xp),321,'valid persisted state must survive reload');

 await page.evaluate(()=>localStorage.setItem('mon-state','{broken'));
 await page.reload({waitUntil:'networkidle'});
 await waitVisible('#home.active');
 assert.equal(await page.evaluate(()=>state.saveVersion),3,'corrupt state must recover to a valid schema');
 assert.equal(await page.evaluate(()=>localStorage.getItem('mon-state-corrupt-last')),'{broken','corrupt primary payload must be preserved');
 assert.equal(pageErrors.length,0,'recovery reload emitted page errors: '+pageErrors.join('\n'));

 console.log('MON browser smoke passed');
}finally{
 await browser.close();
}
