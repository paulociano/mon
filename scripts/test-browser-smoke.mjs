import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base=process.env.MON_SMOKE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}});
await page.addInitScript(()=>localStorage.setItem('mon-onboarded','1'));
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

 for(const target of ['journey','explore','progress']){
  await page.click(`#desktopNav [data-view="${target}"]`);
  await waitVisible(`#${target}.active`);
 }
 await page.click('#desktopNav [data-view="explore"]');
 await waitVisible('#explore.active');

 await page.click('[data-view="videos"]');
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

 await page.click('[data-view="practice"]');
 await waitVisible('#practice.active');
 await page.waitForSelector('#practiceCoach');
 assert.equal(pageErrors.length,0,'navigation emitted page errors: '+pageErrors.join('\n'));

 await page.evaluate(async()=>await go('home'));
 await waitVisible('#home.active');
 await page.evaluate(()=>localStorage.setItem('mon-state',JSON.stringify({saveVersion:1,xp:321,foundationDay:4})));
 await page.reload({waitUntil:'networkidle'});
 await waitVisible('#home.active');
 assert.equal(await page.evaluate(()=>state.xp),321,'valid persisted state must survive reload');

 await page.evaluate(()=>localStorage.setItem('mon-state','{broken'));
 await page.reload({waitUntil:'networkidle'});
 await waitVisible('#home.active');
 assert.equal(await page.evaluate(()=>state.saveVersion),1,'corrupt state must recover to a valid schema');
 assert.equal(await page.evaluate(()=>localStorage.getItem('mon-state-corrupt-last')),'{broken','corrupt primary payload must be preserved');
 assert.equal(pageErrors.length,0,'recovery reload emitted page errors: '+pageErrors.join('\n'));

 console.log('MON browser smoke passed');
}finally{
 await browser.close();
}
