import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Number,String,Math});
vm.runInContext(fs.readFileSync('data/kana.js','utf8'),ctx,{filename:'data/kana.js'});
vm.runInContext(fs.readFileSync('data/session.js','utf8'),ctx,{filename:'data/session.js'});
vm.runInContext(fs.readFileSync('core/course-engine.js','utf8'),ctx,{filename:'core/course-engine.js'});

for(let day=13;day<=24;day++){
  const plan=vm.runInContext(`buildLesson({day:${day},label:'Fundação ${day}'},{})`,ctx);
  const first=plan.exercises[0];
  assert.equal(first?.type,'study',`day ${day} should start with a study block`);
  assert.ok(first.title?.length>=4,`day ${day} needs a study title`);
  assert.ok(first.mentalModel?.length>=30,`day ${day} needs a substantive mental model`);
  assert.ok(first.explanation?.length>=80,`day ${day} needs applied grammar explanation`);
  assert.ok(Array.isArray(first.examples)&&first.examples.length>=2,`day ${day} needs at least two worked examples`);
  assert.ok(first.examples.every(x=>x.jp&&x.pt&&x.note),`day ${day} examples need jp, pt and note`);
  assert.ok(first.contrast?.length>=30,`day ${day} needs a contrast or boundary note`);
}

const lesson=fs.readFileSync('features/lesson.js','utf8');
for(const token of ["e.type==='study'",'study-mental-model','study-example','COMEÇAR A PRÁTICA']){
  assert.ok(lesson.includes(token),'lesson UI missing '+token);
}
assert.ok(lesson.includes("btn.onclick=quickNext"),'study block should advance without grading');

const css=fs.readFileSync('features/lesson.css','utf8');
for(const token of ['.study-card','.study-mental-model','.study-examples','.study-example']){
  assert.ok(css.includes(token),'study UI styles missing '+token);
}

console.log('MON grammar study layer contracts passed');
