import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base=process.env.MON_SMOKE_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});

try{
  await page.addInitScript(()=>{
    localStorage.removeItem('mon-onboarded');
    localStorage.removeItem('mon-state');
  });
  const response=await page.goto(base+'?view=home',{waitUntil:'networkidle'});
  assert.ok(response?.ok(),'beginner onboarding page must load');
  await page.waitForSelector('#onboardingShell',{state:'visible'});
  assert.match(await page.locator('#onboardingTitle').innerText(),/Comece usando japonês/i);
  assert.equal(await page.locator('.onboarding-promise span').count(),3,'onboarding must explain only three simple promises');
  assert.match(await page.locator('#onboardingShell').innerText(),/10 minutos/i);

  await page.getByRole('button',{name:/Começar minha primeira sessão/i}).click();
  await page.waitForSelector('#session.active',{state:'visible'});
  await page.waitForSelector('.session-card',{state:'visible'});

  const firstRun=await page.evaluate(()=>({
    mode:sessionRun?.mode,
    firstWin:sessionRun?.firstWin,
    count:sessionRun?.steps?.length,
    types:sessionRun?.steps?.map(x=>x.type),
    minutes:sessionRun?.steps?.reduce((n,x)=>n+(x.min||0),0)
  }));
  assert.equal(firstRun.mode,'foundation');
  assert.equal(firstRun.firstWin,true);
  assert.equal(firstRun.count,4,'first win must stay short');
  assert.deepEqual(firstRun.types,['audio','choice','reading','speaking'],'first win must preserve sound → recognition → context → speech');
  assert.ok(firstRun.minutes<=10,'first win should fit the promised ten-minute window: '+JSON.stringify(firstRun));
  assert.equal(firstRun.types.includes('writing'),false,'writing should wait until after the first win');
  assert.match(await page.locator('.session-card').innerText(),/Primeira vitória/i);
  assert.match(await page.locator('.session-card').innerText(),/quatro coisas/i);

  console.log('MON beginner first-win onboarding passed');
}finally{
  await browser.close();
}
