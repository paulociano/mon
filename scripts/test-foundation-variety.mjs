import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Math,Number,String,Array,Object,Set});
for(const file of ['data/kana.js','data/foundation.js','data/session.js','core/course-engine.js']){
 vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
}
const signatures=[];
for(let day=1;day<=8;day++){
 const plan=vm.runInContext(`lessonPlanFromNode({day:${day},label:'Foundation ${day}'})`,ctx);
 const sig=Array.from(plan.exercises,e=>e.type+':'+e.prompt).join('|');
 signatures.push(sig);
 assert.equal(plan.exercises.length,8,'foundation lesson '+day+' should keep eight exercises');
 assert.equal(plan.exercises[0].type,'listen','foundation lesson '+day+' must still begin with listening');
 assert.equal(plan.exercises.at(-1).type,'speak','foundation lesson '+day+' must still finish with production');
}
for(let i=1;i<signatures.length;i++)assert.notEqual(signatures[i],signatures[i-1],'adjacent early lessons must not repeat the same exercise sequence and prompts');
assert.ok(new Set(signatures.slice(0,6)).size>=3,'early foundation should expose multiple lesson shapes');

console.log('MON foundation lesson variety contracts passed');
