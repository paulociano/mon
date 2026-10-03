import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Number,String,Math});
vm.runInContext(fs.readFileSync('data/content-packs.js','utf8'),ctx,{filename:'content-packs.js'});
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

console.log('MON learning-method tests passed: '+Array.from(methodKinds).join(', '));
