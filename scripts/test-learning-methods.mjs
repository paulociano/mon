import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Number,String,Math,state:{methodStats:{},reviewItems:{},mistakeStats:{},masteryEvidence:{},narrative:{episodes:{}}}});
vm.runInContext(fs.readFileSync('data/content-packs-n5.js','utf8'),ctx,{filename:'content-packs-n5.js'});
for(const file of ['data/content-packs-n4.js','data/content-packs-n4-61-70.js','data/content-packs-n4-71-80.js','data/content-packs-n4-81-90.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
vm.runInContext(fs.readFileSync('core/learning-methods.js','utf8'),ctx,{filename:'learning-methods.js'});
vm.runInContext(fs.readFileSync('core/course-engine.js','utf8'),ctx,{filename:'course-engine.js'});

const unit=vm.runInContext("coursePacks.N5.units[0]",ctx);
const seq=vm.runInContext("compileMONSequence(coursePacks.N5.units[0])",ctx);
const types=Array.from(seq, x=>x.type);

assert.ok(types.includes('discovery'));
assert.ok(types.includes('recall'));
assert.ok(types.includes('roleplay'));
assert.ok(types.includes('minimalPair'));
assert.ok(seq.every(x=>x.prompt&&x.method));

const role=seq.find(x=>x.type==='roleplay');
assert.ok(role.target&&role.npc);
assert.equal('options' in role,false,'roleplay must not reveal answer as multiple choice');

const recall=seq.find(x=>x.type==='recall');
assert.ok(recall.accepted.length>=1);
assert.equal('options' in recall,false,'free recall must not offer recognition cues');

const all=vm.runInContext("coursePacks.N5.units.flatMap(u=>compileMONSequence(u))",ctx);
const methodKinds=new Set(Array.from(all,x=>x.type));
for(const t of ['discovery','recall','dictation','cloze','transfer','roleplay','minimalPair'])assert.ok(methodKinds.has(t),'missing '+t);

const checkpoints=vm.runInContext("coursePacks.N4.units.filter(u=>[70,80,90].includes(u.day))",ctx);
assert.equal(checkpoints.length,3);
for(const u of checkpoints){
 assert.equal(u.openProduction,true,u.id+' must use open production');
 assert.ok(u.scenarios.every(s=>s.assessment?.groups?.length>=3),u.id+' needs observable criteria');
 const compiled=vm.runInContext("(()=>{const unit=coursePacks.N4.units.find(x=>x.id==='"+u.id+"'),scenario=unit.scenarios[1],open=compileOpenProduction(unit,1),p=lessonPlanFromPack(unit),e=p.exercises.find(x=>x.type==='openResponse');return {unitOpen:unit.openProduction,scenarioAssessment:!!scenario?.assessment,scenarioCriteria:scenario?.assessment?.groups?.length||0,openType:open?.type||null,openCriteria:open?.assessment?.groups?.length||0,types:p.exercises.map(x=>x.type),exists:!!e,hasOptions:e?'options' in e:true,criteria:e?.assessment?.groups?.length||0}})()",ctx);
 
 assert.equal(compiled.exists,true,u.id+' should guarantee an open response in final lesson');
 assert.equal(compiled.hasOptions,false,'open production must not expose choices');
 assert.ok(compiled.criteria>=3,u.id+' open response needs criteria');
}
const lesson=fs.readFileSync('features/lesson.js','utf8'),remediation=fs.readFileSync('features/open-production-remediation.js','utf8');
for(const token of ['evaluateOpenProduction','quickOpenSpeech',"e.type==='openResponse'",'elementos funcionais','treinar a lacuna'])assert.ok(lesson.includes(token),'missing open-production UI runtime '+token);
for(const token of ['buildOpenRemediation','recordProductionGaps','recoverProductionGaps','_openRetry','_openRepair'])assert.ok(remediation.includes(token),'missing remediation engine '+token);
assert.ok(remediation.includes("if(exercise._openRetry||!result.missing?.length)return []"),'open retry must not recursively schedule another remediation cycle');
assert.ok(lesson.includes("quickRun.pack.exercises.splice(quickRun.step+1,0,...repair)"),'remediation must run immediately before returning to the lesson');
console.log('MON learning-method tests passed: '+Array.from(methodKinds).join(', ')+' + open N4 checkpoints');
