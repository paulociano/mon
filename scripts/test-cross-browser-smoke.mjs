import { chromium, firefox, webkit } from 'playwright';
import assert from 'node:assert/strict';

const base=process.env.MON_SMOKE_URL||'http://127.0.0.1:4173';
const selected=(process.env.MON_BROWSER||'firefox').toLowerCase();
const type={chromium,firefox,webkit}[selected];
if(!type)throw new Error('Unsupported MON_BROWSER '+selected);

const browser=await type.launch({headless:true});
const context=await browser.newContext({viewport:{width:1200,height:820},serviceWorkers:'block'});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));

try{
 await page.addInitScript(()=>localStorage.setItem('mon-onboarded','1'));
 const response=await page.goto(base,{waitUntil:'domcontentloaded'});
 assert.ok(response?.ok(),selected+' shell navigation failed');
 await page.waitForSelector('#home.active',{state:'visible'});

 for(const target of ['journey','explore','progress']){
  await page.click('#desktopNav [data-view="'+target+'"]');
  await page.waitForSelector('#'+target+'.active',{state:'visible'});
 }

 await page.evaluate(()=>{state.xp=432;save()});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForSelector('#home.active',{state:'visible'});
 assert.equal(await page.evaluate(()=>state.xp),432,selected+' persisted state failed after reload');
 assert.equal(errors.length,0,selected+' emitted page errors: '+errors.join('\n'));

 console.log('MON cross-browser smoke passed:',selected);
}finally{
 await browser.close();
}
