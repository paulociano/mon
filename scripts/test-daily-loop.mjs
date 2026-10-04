import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {dailyLoopRecipe}=require('../core/next-best-lesson.js');

for(const intent of ['functionalRepair','repair','retrieve','listening','production','transfer','advance']){
 const r=dailyLoopRecipe({intent});
 assert.equal(r.roles.length,6,intent+' must have six blocks');
 assert.equal(r.minutes.length,6);
 assert.ok(r.roles.includes('produce'),intent+' must close with active production somewhere');
 const total=r.minutes.reduce((a,b)=>a+b,0);
 assert.ok(total>=16&&total<=20,intent+' should remain a short daily loop');
}
const session=fs.readFileSync('features/session.js','utf8');
assert.ok(session.includes('nextBestLessonPlan(state,node)'));
assert.ok(session.includes('dailyLoopRecipe(nextBest)'));
assert.ok(session.includes('fitDailyLoop(baseLoop,profile.dailyGoal,profile.studyMode)'));
assert.ok(session.includes("goal===10?4:goal===30?7:6")||fs.readFileSync('app.js','utf8').includes("goal===10?4:goal===30?7:6"));
assert.ok(session.includes('sessionRun.nextBest'));
assert.ok(session.includes('s.loopLabel||sessionLabels[i]'));
assert.ok(session.includes('Duração estimada:'));
assert.ok(session.includes("function:{type:'choice',title:'Repare uma função recorrente'"));
assert.ok(session.includes('nextBest.functionalGap'));
const focused=dailyLoopRecipe({intent:'functionalRepair'});assert.ok(focused.roles.includes('function'));
console.log('MON adaptive Daily Loop contracts passed');
