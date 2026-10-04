import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Number,String,Math});
vm.runInContext(fs.readFileSync('data/content-packs-n5.js','utf8'),ctx,{filename:'content-packs.js'});
vm.runInContext(fs.readFileSync('core/learning-methods.js','utf8'),ctx,{filename:'learning-methods.js'});
vm.runInContext(fs.readFileSync('core/course-engine.js','utf8'),ctx,{filename:'course-engine.js'});

const stationDistractors=Array.from(vm.runInContext("catalogDistractors('eki','pt').slice(0,8)",ctx));
assert.ok(stationDistractors.length>=4);
assert.ok(stationDistractors.some(x=>['saída','entrada','direita','esquerda','em frente / reto'].includes(x)),'station distractors should prefer semantically nearby content');

for(const id of ['topicDesu','locationNi','objectO','deAction','gaState']){
 const note=vm.runInContext(`grammarBridge('${id}',grammarCatalog.${id})`,ctx);
 assert.ok(note.length>=50,id+' needs a substantive Portuguese-first bridge');
}
const sequence=vm.runInContext(`optimizeExerciseSequence([
 {type:'choice',prompt:'a',answer:'1'},
 {type:'choice',prompt:'b',answer:'2'},
 {type:'choice',prompt:'c',answer:'3'},
 {type:'listen',prompt:'d',answer:'4'},
 {type:'recall',prompt:'e',target:'5'},
 {type:'roleplay',prompt:'f',target:'6'}
],10)`,ctx);
const families=Array.from(sequence,e=>vm.runInContext(`exerciseFamily(${JSON.stringify(e)})`,ctx));
for(let i=2;i<families.length;i++)assert.ok(!(families[i]===families[i-1]&&families[i]===families[i-2]),'three identical modalities in a row');
assert.ok(families.includes('produce'),'optimized sequence must retain productive retrieval');

console.log('MON content quality contracts passed');
