import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const css=fs.readFileSync('styles.css','utf8');
const journeyCss=fs.readFileSync('features/journey.css','utf8');
const curriculum=fs.readFileSync('data/curriculum.js','utf8');

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
assert.ok(app.includes("displayLevel:'PONTE'"),'days 31–54 must be labeled as the N5→N4 bridge');
assert.ok(app.includes("if(d<=54)"),'bridge phase boundary missing');
assert.ok(app.includes("if(d<=90)return{level:'N4',displayLevel:'N4'"),'executable N4 phase must start after the bridge');
assert.ok(app.includes("absStart=span[0],absEnd=span[1]"),'curriculum ranges must be treated as absolute days');
for(const label of ['Ponte · vida diária e interação','Ponte · ação, tempo e explicação','Ponte · serviços e autonomia N5','N4 · autonomia funcional'])assert.ok(curriculum.includes(label),'curriculum bridge mapping missing '+label);

console.log('MON guided learning journey contracts passed');
