import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Number,String,Math});
vm.runInContext(fs.readFileSync('data/content-packs-n5.js','utf8'),ctx,{filename:'content-packs-n5.js'});
for(const file of ['data/content-packs-n4.js','data/content-packs-n4-61-70.js','data/content-packs-n4-71-80.js','data/content-packs-n4-81-90.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
vm.runInContext(fs.readFileSync('core/learning-methods.js','utf8'),ctx,{filename:'learning-methods.js'});

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
 const open=vm.runInContext("compileMONMethod(coursePacks.N4.units.find(x=>x.id='"+u.id+"'),'roleplay',0)",ctx);
 assert.ok(open,u.id+' should compile an open response');
 assert.equal('options' in open,false,'open production must not expose choices');
 assert.ok(open.assessment.groups.length>=3);
}
const lesson=fs.readFileSync('features/lesson.js','utf8');
for(const token of ['evaluateOpenProduction','quickOpenSpeech',"e.type==='openResponse'",'elementos funcionais'])assert.ok(lesson.includes(token),'missing open-production runtime '+token);
console.log('MON learning-method tests passed: '+Array.from(methodKinds).join(', ')+' + open N4 checkpoints');
