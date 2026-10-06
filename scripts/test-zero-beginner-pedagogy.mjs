import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Map,Number,String,Math,Array});
for(const f of ['data/kana.js','data/foundation.js','data/session.js','core/beginner-scaffolding.js','core/course-engine.js']){
  vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
}

const titles=vm.runInContext('foundationUnits.map(x=>x.title)',ctx);
assert.match(titles[12],/Como uma frase japonesa funciona/,'grammar must begin with sentence architecture');
assert.match(titles[13],/Tópico com は/,'topic must be isolated before particle overload');
assert.match(titles[16],/Verbo no fim \+ objeto を/,'first verbal pattern should be object + verb');
assert.match(titles[20],/Existência/,'が should first appear in a concrete existence pattern');
assert.match(titles[22],/Forma て para pedidos/,'te-form should enter through one functional use');

const phase13=vm.runInContext('foundationPedagogyPhase(13)',ctx);
assert.equal(phase13.id,'sentence-map');
const phase17=vm.runInContext('foundationPedagogyPhase(17)',ctx);
assert.equal(phase17.id,'verb-particles');

for(let day=13;day<=24;day++){
  const plan=vm.runInContext(`lessonPlanFromNode({day:${day},label:'Foundation ${day}'})`,ctx);
  const study=Array.from(plan.exercises).find(e=>e.type==='study'&&e.mode!=='block-intro');
  assert.ok(study,`day ${day} must teach before drilling`);
  assert.ok(study.explanation?.length>100,`day ${day} needs a real explanation`);
  assert.ok(study.examples?.length>=2,`day ${day} needs worked examples`);
  assert.ok(study.contrast?.length>30,`day ${day} needs a misconception boundary`);
}

const day14=vm.runInContext('foundationStudyBlock(14)',ctx);
assert.match(day14.explanation,/は/);
assert.doesNotMatch(day14.title,/は・が・を/,'day 14 must not overload three particles');

const day23=vm.runInContext('foundationStudyBlock(23)',ctx);
assert.match(day23.title,/Forma て \+ ください/);
assert.match(day23.explanation,/Outras funções entram/,'te-form should be deliberately bounded');

console.log('MON zero-beginner pedagogy contracts passed');
