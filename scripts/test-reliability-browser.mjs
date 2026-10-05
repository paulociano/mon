import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=process.env.MON_SMOKE_URL||'http://127.0.0.1:4173';
fs.mkdirSync('test-results',{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});
await context.tracing.start({screenshots:true,snapshots:true});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{if(window===window.top)localStorage.setItem('mon-onboarded','1')});
try{
 await page.goto(base+'?view=home',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 // One failed request must not poison the loader's promise or DOM registry.
 const loaderContext=await browser.newContext({serviceWorkers:'block'}),loaderPage=await loaderContext.newPage();
 try{
  await loaderPage.goto(base);
  let first=true;
  await loaderPage.route('**/features/user.js',route=>{if(first){first=false;return route.abort()}return route.continue()});
  assert.equal(await loaderPage.evaluate(()=>go('user')),false);
  assert.equal(await loaderPage.evaluate(()=>go('user')),true);
  await loaderPage.waitForSelector('#user.active');
 }finally{await loaderContext.close()}
 await page.evaluate(async()=>{await go('user');setMonUserAuthState(true)});
 await page.waitForSelector('#user.active');
 await page.fill('#userNameInput','Teste de rotina');
 await page.click('button[onclick="saveUserArea()"]');
 assert.equal(await page.locator('#userNameHero').innerText(),'Teste de rotina');
 assert.ok(await page.locator('#userAccountBadge').isVisible(),'sync status must remain visible on mobile');
 const a11y=await new AxeBuilder({page}).include('#user').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 fs.writeFileSync('test-results/accessibility.json',JSON.stringify(a11y,null,2));
 assert.deepEqual(a11y.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],'account UI accessibility');
 await page.screenshot({path:'test-results/account-mobile.png',fullPage:true});
 // A failed local write stays visible until a real retry succeeds.
 await page.evaluate(()=>{
  window.realStorageSet=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(k==='mon-state')throw new DOMException('full','QuotaExceededError');return window.realStorageSet.call(this,k,v)};
  state.xp=789;save();
 });
 await page.waitForSelector('#saveFailure');
 const download=page.waitForEvent('download');
 await page.getByRole('button',{name:'baixar backup',exact:true}).click();
 const file=await download;const backup=JSON.parse(fs.readFileSync(await file.path(),'utf8'));
 assert.equal(backup.learningState.xp,789);
 await page.evaluate(()=>Storage.prototype.setItem=window.realStorageSet);
 await page.getByRole('button',{name:'tentar salvar',exact:true}).click();
 assert.ok(await page.locator('#saveFailure').isHidden());
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mon-state')).xp),789);
 // Pronunciation interactions must persist without undefined save helpers.
 await page.evaluate(()=>go('pronunciation'));
 await page.evaluate(()=>ratePron(2));
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mon-state')).pronunciation.selfRatings[0].rating),2);
 await page.evaluate(async()=>{await go('user');setMonUserAuthState(true)});
 await page.click('#prepareOffline');
 await page.waitForFunction(()=>document.getElementById('offlineStatus').textContent.startsWith('Lições,'));
 await context.setOffline(true);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof startQuickLesson==='function');
 await page.evaluate(()=>startQuickLesson(0));
 await page.waitForSelector('#lesson.active');
 assert.equal(await page.evaluate(()=>state.xp),789);
 // Updates cannot reload a lesson in progress.
 assert.equal(await page.evaluate(()=>{window.updated=false;monUpdateWorker={postMessage(){window.updated=true}};applyMonUpdate();return window.updated}),false);
 assert.deepEqual(errors,[]);
 console.log('MON reliability browser checks passed: retry, storage recovery, accessibility, pronunciation, prepared offline lesson, safe update');
}catch(e){await page.screenshot({path:'test-results/reliability-failure.png',fullPage:true}).catch(()=>{});throw e}
finally{await context.tracing.stop({path:'test-results/reliability-trace.zip'});await browser.close()}
