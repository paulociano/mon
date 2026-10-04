import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Number,String,Math});
vm.runInContext(fs.readFileSync('data/kana.js','utf8'),ctx,{filename:'data/kana.js'});
vm.runInContext(fs.readFileSync('data/foundation.js','utf8'),ctx,{filename:'data/foundation.js'});
vm.runInContext(fs.readFileSync('data/session.js','utf8'),ctx,{filename:'data/session.js'});
vm.runInContext(fs.readFileSync('data/grammar-study-foundation.js','utf8'),ctx,{filename:'data/grammar-study-foundation.js'});
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
assert.ok(lesson.includes("e.type==='study'"),'lesson runtime must route study steps');
assert.ok(lesson.includes('renderGrammarStudyStep'),'lesson runtime must delegate study rendering');

const studyUi=fs.readFileSync('features/grammar-study.js','utf8');
for(const token of ['study-mental-model','study-example','COMEÇAR A PRÁTICA','btn.onclick=quickNext']){
  assert.ok(studyUi.includes(token),'grammar study UI missing '+token);
}

const css=fs.readFileSync('features/grammar-study.css','utf8');
for(const token of ['.study-card','.study-mental-model','.study-examples','.study-example']){
  assert.ok(css.includes(token),'study UI styles missing '+token);
}

const app=fs.readFileSync('app.js','utf8');
for(const token of ['./data/grammar-study-foundation.js','./features/grammar-study.js','./features/grammar-study.css']){
  assert.ok(app.includes(token),'lazy runtime missing '+token);
}

console.log('MON grammar study layer contracts passed');
