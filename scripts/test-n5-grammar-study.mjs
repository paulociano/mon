import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Number,String,Math,state:{methodStats:{}}});
vm.runInContext(fs.readFileSync('data/content-packs-n5.js','utf8'),ctx,{filename:'data/content-packs-n5.js'});
vm.runInContext(fs.readFileSync('data/grammar-pedagogy.js','utf8'),ctx,{filename:'data/grammar-pedagogy.js'});
vm.runInContext(fs.readFileSync('core/learning-methods.js','utf8'),ctx,{filename:'core/learning-methods.js'});
vm.runInContext(fs.readFileSync('core/course-engine.js','utf8'),ctx,{filename:'core/course-engine.js'});

const units=vm.runInContext("coursePacks.N5.units",ctx);
assert.ok(units.length>=20,'N5 should expose a practical unit set');

for(const unit of units){
  if(!(unit.grammar||[]).length)continue;
  const study=vm.runInContext(`grammarStudyBlock(coursePacks.N5.units.find(x=>x.id===${JSON.stringify(unit.id)}))`,ctx);
  assert.equal(study?.type,'study',unit.id+' should compile an applied study block');
  assert.ok(study.title?.includes('gramática'),unit.id+' needs an explicit grammar title');
  assert.ok(study.mentalModel?.length>=40,unit.id+' needs a substantive mental model');
  assert.ok(study.explanation?.length>=90,unit.id+' needs an applied explanation');
  assert.ok(Array.isArray(study.examples)&&study.examples.length>=2,unit.id+' needs worked examples');
  assert.ok(study.examples.every(x=>x.jp&&x.pt&&x.note),unit.id+' examples need jp, pt and note');
  assert.ok(study.contrast?.length>=35,unit.id+' needs a boundary/contrast note');

  for(const id of unit.grammar){
    const note=vm.runInContext(`grammarStudyNote(${JSON.stringify(id)},grammarCatalog[${JSON.stringify(id)}])`,ctx);
    assert.ok(note?.mentalModel?.length>=25,id+' needs a reusable mental model');
    assert.ok(note?.explanation?.length>=55,id+' needs a reusable applied explanation');
  }
}

const station=vm.runInContext("lessonPlanFromPack(coursePacks.N5.units.find(x=>x.id==='n5-station'))",ctx);
assert.equal(station.study?.type,'study','N5 lesson plan must expose the study block');
assert.ok(station.exercises.every(x=>x.type!=='study'),'study should remain outside graded exercise compilation');

console.log('MON N5 applied grammar study contracts passed');
