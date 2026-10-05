import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const state={
  foundationComplete:true,day:10,pathProgress:34,
  masteryEvidence:{
    'grammar:P:locationNi':{recognize:{attempts:3,score:82},recall:{attempts:2,score:68}},
    'grammar:P:requestKudasai':{recognize:{attempts:3,score:91},recall:{attempts:3,score:87},transfer:{attempts:2,score:84}}
  },
  reviewItems:{
    'grammar:P:locationNi':{type:'grammar',key:'P:locationNi',due:0,reps:1,interval:1,ease:2.3,lapses:1}
  },
  mistakeStats:{
    m1:{concept:'grammar:P:locationNi',count:2,recovered:1,lastAt:Date.now()}
  }
};
const ctx=vm.createContext({state,console,Object,Set,Map,Number,String,Math,Array,Date});
for(const file of [
  'data/content-packs-n5.js',
  'data/content-packs-n4.js',
  'data/content-packs-n4-61-70.js',
  'data/content-packs-n4-71-80.js',
  'data/content-packs-n4-81-90.js',
  'data/grammar-pedagogy.js',
  'core/review-scheduler.js',
  'core/mastery-graph.js',
  'core/course-engine.js',
  'features/grammar-notebook.js'
])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});

const entries=vm.runInContext("grammarNotebookEntries()",ctx);
assert.ok(entries.length>=8,'progressed learner should see encountered grammar');
assert.ok(entries.some(x=>x.id==='locationNi'),'encountered grammar must appear');
assert.ok(!entries.some(x=>x.id==='obligationNaito'),'future N4 grammar must remain hidden');
const ni=entries.find(x=>x.id==='locationNi');
assert.equal(ni.level,'N5');
assert.equal(ni.due,true);
assert.equal(ni.misconceptions,1);
assert.ok(ni.mastery>0&&ni.mastery<80);
assert.equal(ni.status,'developing');
assert.ok(ni.mentalModel.includes('destino'));
assert.ok(ni.examples.length>=2);

const weak=vm.runInContext("grammarNotebookEntries({filter:'weak'})",ctx);
assert.ok(Array.from(weak).some(x=>x.id==='locationNi'));
assert.ok(!Array.from(weak).some(x=>x.id==='requestKudasai'),'strong grammar should not appear in weak filter');

const due=vm.runInContext("grammarNotebookEntries({filter:'due'})",ctx);
assert.deepEqual(Array.from(due).map(x=>x.id),['locationNi']);

const search=vm.runInContext("grammarNotebookEntries({query:'destino'})",ctx);
assert.ok(Array.from(search).some(x=>x.id==='locationNi'),'search should include pedagogy text');

const review=vm.runInContext("grammarNotebookReviewExercises('locationNi')",ctx);
assert.equal(Array.from(review).length,2,'direct review should contain study + retrieval');
assert.equal(review[0].type,'study');
assert.equal(review[0].mode,'notebook');
assert.equal(review[1]._reviewType,'grammar');
assert.equal(review[1]._reviewKey,'P:locationNi');

const html=fs.readFileSync('index.html','utf8');
assert.ok(html.includes('id="grammarNotebook"'),'Practice Hub needs Grammar Notebook mount point');
assert.ok(html.includes('文法'),'Notebook should be visible as grammar study surface');

const app=fs.readFileSync('app.js','utf8');
assert.ok(app.includes("'./features/grammar-notebook.js'"),'Grammar Notebook must load lazily with Practice');
assert.ok(app.includes("'./features/grammar-notebook.css'"),'Grammar Notebook styles must remain lazy');

const practice=fs.readFileSync('features/practice.js','utf8');
assert.ok(practice.includes('renderGrammarNotebook'),'Practice rerenders the notebook on revisit');

console.log('MON Grammar Notebook contracts passed:',entries.length,'encountered structures');
