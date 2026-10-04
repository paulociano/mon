import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base=process.env.MON_SMOKE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:900}});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));

try{
 await page.addInitScript(()=>localStorage.setItem('mon-onboarded','1'));
 await page.goto(base,{waitUntil:'networkidle'});
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)location.reload()});
 await page.waitForLoadState('networkidle');
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);

 // Warm critical lazy surfaces so their runtime assets are available offline.
 await page.evaluate(async()=>{await go('progress');await go('practice');await go('home')});
 await page.waitForSelector('#home.active',{state:'visible'});
 await page.evaluate(()=>{state.xp=654;save()});
 assert.equal(await page.evaluate(()=>state.xp),654);

 const cacheKeys=await page.evaluate(()=>caches.keys());
 assert.ok(cacheKeys.some(k=>k.startsWith('mon-japanese-os-')),'MON cache should exist before offline transition');

 await context.setOffline(true);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForSelector('#home.active',{state:'visible'});
 assert.equal(await page.evaluate(()=>state.xp),654,'offline reload must preserve local progress');

 await page.evaluate(async()=>await go('progress'));
 await page.waitForSelector('#progress.active',{state:'visible'});
 await page.evaluate(async()=>await go('practice'));
 await page.waitForSelector('#practice.active',{state:'visible'});
 await page.waitForSelector('#practiceCoach',{state:'visible'});

 const offlineCaches=await page.evaluate(()=>caches.keys());
 assert.ok(offlineCaches.every(k=>!k.startsWith('mon-japanese-os-')||/^mon-japanese-os-v\d+$/.test(k)),'MON cache namespace should stay versioned');
 assert.equal(errors.length,0,'offline flow emitted page errors: '+errors.join('\n'));

 console.log('MON offline smoke passed');
}finally{
 await context.setOffline(false).catch(()=>{});
 await browser.close();
}
