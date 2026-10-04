import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const css=fs.readFileSync('styles.css','utf8');
const journeyCss=fs.readFileSync('features/journey.css','utf8');

const nav=html.match(/<nav id="desktopNav">([\s\S]*?)<\/nav>/)?.[1]||'';
const primary=[...nav.matchAll(/data-view="([^"]+)"/g)].map(x=>x[1]);
assert.deepEqual(primary,['home','journey','practice','explore','progress'],'primary IA must stay focused on five learner decisions');

for(const id of ['journey','explore','progress','todayReason','onboardingShell'])assert.ok(html.includes(`id="${id}"`),'missing journey surface '+id);
for(const label of ['Abrir o portão','Sobreviver','Viver','Interagir','Ganhar autonomia'])assert.ok(html.includes(label),'missing capability stage '+label);
for(const view of ['foundation','kanji','pronunciation','writing','missions','speaking','reading','journal','videos','culture','league','shop']){
 assert.ok(html.includes(`data-view="${view}"`),'Explore must keep '+view+' discoverable');
}
for(const token of ['JOURNEY_STAGES','journeyStageIndex','journeyStageProgress','renderJourney','renderProgressHub','runJourneyPrimary','NAV_PARENT','navParentForView']){
 assert.ok(app.includes(token),'missing journey runtime '+token);
}
for(const token of ['.journey-stages','.hub-grid','.progress-evidence-grid']){
 assert.ok(journeyCss.includes(token),'missing lazy journey visual contract '+token);
}
for(const token of ['.onboarding-shell','.today-reason']){
 assert.ok(css.includes(token),'missing shell journey visual contract '+token);
}
assert.ok(app.includes("journey:['./features/journey.css']"),'Journey CSS must stay lazy');
assert.ok(app.includes("localStorage.setItem('mon-onboarded','1')"),'onboarding completion must persist');
assert.ok(html.toLowerCase().includes('por que esta sessão?'),'Home must explain why the next action was chosen');

console.log('MON guided learning journey contracts passed');
