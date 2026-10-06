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
  assert.equal(await page.locator('#onboardingShell .course-badge').count(),3,'onboarding must explain only three simple promises');
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
  assert.equal(firstRun.count,5,'first win must include one non-evaluated teaching step before practice');
  assert.deepEqual(firstRun.types,['study','audio','choice','reading','speaking'],'first win must teach → sound → recognition → context → speech');
  assert.ok(firstRun.minutes<=10,'first win should fit the promised ten-minute window: '+JSON.stringify(firstRun));
  assert.equal(firstRun.types.includes('writing'),false,'writing should wait until after the first win');
  assert.match(await page.locator('.session-card').innerText(),/Primeira vitória/i);
  assert.match(await page.locator('.session-card').innerText(),/entender o que está ouvindo/i);

  await page.evaluate(async()=>{
    state.foundationSessions=1;
    state.foundationDay=2;
    state.pathProgress=1;
    state.foundationComplete=false;
    save();
    await go('home');
  });
  await page.waitForSelector('#home.active',{state:'visible'});
  assert.ok(await page.locator('body').evaluate(el=>el.classList.contains('beginner-mode')),'early learner should get progressive disclosure');
  assert.equal(await page.locator('.xp-pill').evaluate(el=>getComputedStyle(el).display),'none','XP should not compete with the first return');
  assert.match(await page.locator('#homeAdaptiveTitle').innerText(),/o que ficou/i,'first return should explain the memory goal');
  assert.match(await page.locator('#homeAdaptiveCopy').innerText(),/retome som e kana/i);
  assert.match(await page.locator('#homeAdaptivePrimary').innerText(),/o que eu lembro/i);
  await page.locator('#homeAdaptivePrimary').click();
  await page.waitForSelector('#session.active',{state:'visible'});
  const returnRun=await page.evaluate(()=>({mode:sessionRun?.mode,day:sessionRun?.foundationDay,firstWin:sessionRun?.firstWin}));
  assert.equal(returnRun.mode,'foundation');
  assert.equal(returnRun.day,2,'first return must continue with Foundation session 2');
  assert.equal(returnRun.firstWin,false,'first-return session should use the normal Foundation cycle');

  console.log('MON beginner first-win and return loop passed');
}finally{
  await browser.close();
}
