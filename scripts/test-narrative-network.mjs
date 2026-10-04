import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Number,String,Math,state:{methodStats:{}}});
vm.runInContext(fs.readFileSync('data/content-packs-n5.js','utf8'),ctx,{filename:'content-packs-n5.js'});
vm.runInContext(fs.readFileSync('data/narrative.js','utf8'),ctx,{filename:'narrative.js'});
vm.runInContext(fs.readFileSync('core/learning-methods.js','utf8'),ctx,{filename:'learning-methods.js'});
vm.runInContext(fs.readFileSync('core/course-engine.js','utf8'),ctx,{filename:'course-engine.js'});

const coverage=vm.runInContext('narrativeCoverage()',ctx);
assert.equal(coverage.covered,coverage.units,'every structured N5 unit needs a narrative episode');
assert.ok(coverage.arcs>=4);
assert.ok(Object.values(coverage.characters).filter(n=>n>=3).length>=4,'recurring characters should truly recur');

const units=vm.runInContext('coursePacks.N5.units',ctx);
for(const u of units){
 const ep=vm.runInContext(`narrativeEpisodeForUnit('${u.id}')`,ctx);
 assert.ok(ep.scenePt&&ep.sceneJp&&ep.target&&ep.targetPt,u.id+' incomplete story');
 assert.ok(ep.reuses.length>=3,u.id+' should deliberately reuse prior language');
 const ex=vm.runInContext(`narrativeEchoExercise(coursePacks.N5.units.find(x=>x.id==='${u.id}'))`,ctx);
 assert.equal(ex.type,'transfer');
 assert.ok(ex._story?.character&&ex._story?.place);
}
const sample=vm.runInContext("lessonPlanFromPack(coursePacks.N5.units.find(x=>x.id==='n5-weather'))",ctx);
assert.ok(sample.exercises.some(x=>x._story),'compiled lesson should contain a narrative echo');
assert.ok(sample.exercises.some(x=>x.method==='transfer'),'narrative should reinforce transfer');

console.log('MON narrative network contracts passed',JSON.stringify(coverage));
