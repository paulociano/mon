import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Math,Number,String,Array,Object,Set});
for(const file of ['data/kana.js','data/foundation.js','data/session.js','core/beginner-scaffolding.js','core/course-engine.js']){
  vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
}
for(let day=1;day<=24;day++){
  const plan=vm.runInContext(`lessonPlanFromNode({day:${day},label:'Foundation ${day}'})`,ctx);
  const build=Array.from(plan.exercises).find(e=>e.type==='wordbank');
  assert.ok(build,`day ${day} needs guided reconstruction`);
  assert.ok(build.cue?.length>=2,`day ${day} wordbank needs a semantic cue`);
  assert.ok(build.hint?.length>=20,`day ${day} wordbank needs a progressive hint`);
  assert.equal(Array.from(build.tokens).join(''),build.target,`day ${day} blocks must reconstruct target exactly`);
}
const day16=vm.runInContext("lessonPlanFromNode({day:16,label:'Fundação 16'}).exercises.find(e=>e.type==='wordbank')",ctx);
assert.deepEqual(Array.from(day16.tokens),['これ','は','わたし','の','ほん','です'],'day 16 must teach noun relationships in meaningful blocks');
assert.equal(day16.cue,'Este é meu livro.');
assert.match(day16.hint,/tópico.*は.*の.*objeto/);
const lesson=fs.readFileSync('features/lesson.js','utf8'),scaffold=fs.readFileSync('core/beginner-scaffolding.js','utf8');
assert.ok(lesson.includes('renderGuidedWordbank'),'lesson runtime must delegate guided reconstruction UI');
for(const token of ['wordbank-cue','quickWordbankHint','wordbankHint','hintUsed=true'])assert.ok(scaffold.includes(token),'guided wordbank support missing '+token);
console.log('MON beginner reconstruction scaffolding contracts passed');
