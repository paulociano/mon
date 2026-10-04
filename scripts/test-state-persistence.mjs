import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=fs.readFileSync('core/state.js','utf8');

function boot(seed={}){
 const store=new Map(Object.entries(seed));
 const localStorage={
  getItem:key=>store.has(key)?store.get(key):null,
  setItem:(key,value)=>store.set(key,String(value)),
  removeItem:key=>store.delete(key)
 };
 const context={localStorage,updateMetrics(){},console};
 vm.createContext(context);
 vm.runInContext(source+';globalThis.__state=state;globalThis.__save=save;globalThis.__version=MON_SAVE_VERSION;globalThis.__migrate=migrateState;',context);
 return {context,store};
}

{
 const {context}=boot();
 assert.equal(context.__state.saveVersion,2);
 assert.equal(context.__state.foundationDay,1);
 assert.deepEqual(Object.keys(context.__state.videoLearning.opened),[]);
 assert.deepEqual(Object.keys(context.__state.productionGaps),[]);
 assert.deepEqual(Object.keys(context.__state.functionalMastery),[]);
}
{
 const legacy={xp:777,foundationDay:8,reviews:{a:{ease:2.1}}};
 const {context}=boot({'mon-state':JSON.stringify(legacy)});
 assert.equal(context.__state.saveVersion,2);
 assert.equal(context.__state.xp,777);
 assert.equal(context.__state.foundationDay,8);
 assert.equal(context.__state.reviews.a.ease,2.1);
}
{
 const v1={saveVersion:1,xp:333,learningEvidence:{events:Array.from({length:605},(_,i)=>({at:i,kind:'attempt',ok:true}))}};
 const {context}=boot({'mon-state':JSON.stringify(v1)});
 assert.equal(context.__state.saveVersion,2);
 assert.equal(context.__state.xp,333);
 assert.equal(context.__state.learningEvidence.events.length,600);
 assert.equal(context.__state.learningEvidence.events[0].at,5);
}
{
 const backup={saveVersion:1,xp:444,foundationDay:5};
 const {context,store}=boot({'mon-state':'{broken','mon-state-backup':JSON.stringify(backup)});
 assert.equal(context.__state.xp,444);
 assert.equal(context.__state.foundationDay,5);
 assert.equal(JSON.parse(store.get('mon-state')).xp,444);
 assert.equal(store.get('mon-state-corrupt-last'),'{broken');
}
{
 const future={saveVersion:99,xp:999};
 const {context}=boot({'mon-state':JSON.stringify(future)});
 assert.equal(context.__state.xp,120);
 assert.equal(context.__state.saveVersion,2);
}
{
 const initial={saveVersion:1,xp:200,foundationDay:3};
 const {context,store}=boot({'mon-state':JSON.stringify(initial)});
 context.__state.xp=250;
 context.__save();
 assert.equal(JSON.parse(store.get('mon-state')).xp,250);
 assert.equal(JSON.parse(store.get('mon-state-backup')).xp,200);
 assert.equal(JSON.parse(store.get('mon-state')).saveVersion,2);
}
{
 const initial={saveVersion:1,videoLearning:{opened:{listening:2},practice:{listening:1},last:{id:'listening',at:123}}};
 const {context,store}=boot({'mon-state':JSON.stringify(initial)});
 assert.equal(context.__state.videoLearning.opened.listening,2);
 context.__state.videoLearning.practice.listening=2;context.__save();
 assert.equal(JSON.parse(store.get('mon-state')).videoLearning.practice.listening,2);
}
{
 const initial={saveVersion:1,productionGaps:{'alternativa':{count:2,recovered:1,lastAt:123,tokens:['別','大丈夫']}}};
 const {context,store}=boot({'mon-state':JSON.stringify(initial)});
 assert.equal(context.__state.productionGaps.alternativa.count,2);
 assert.deepEqual(Array.from(context.__state.productionGaps.alternativa.tokens),['別','大丈夫']);
 context.__state.productionGaps.alternativa.recovered=2;context.__save();
 assert.equal(JSON.parse(store.get('mon-state')).productionGaps.alternativa.recovered,2);
}
{
 const initial={saveVersion:1,functionalMastery:{confirm:{attempts:4,successes:3,score:74,lastAt:321,lastLabel:'confirmação',tokens:['確認']}}};
 const {context,store}=boot({'mon-state':JSON.stringify(initial)});
 assert.equal(context.__state.functionalMastery.confirm.score,74);
 context.__state.functionalMastery.confirm.score=81;context.__save();
 assert.equal(JSON.parse(store.get('mon-state')).functionalMastery.confirm.score,81);
}
{
 const initial={saveVersion:1,learningEvidence:{events:[{at:123,kind:'attempt',source:'mastery',concept:'unit:n5-test',dimension:'recall',ok:true,spacingMs:86400000}]}};
 const {context,store}=boot({'mon-state':JSON.stringify(initial)});
 assert.equal(context.__state.learningEvidence.events.length,1);
 assert.equal(context.__state.learningEvidence.events[0].concept,'unit:n5-test');
 context.__save();
 assert.equal(JSON.parse(store.get('mon-state')).learningEvidence.events[0].spacingMs,86400000);
}
{
 const {context}=boot();
 assert.equal(context.__version,2);
 assert.equal(context.__migrate({saveVersion:2,xp:888}).xp,888);
 assert.throws(()=>context.__migrate({saveVersion:3}),/future MON save version/);
}
console.log('MON state persistence contracts passed');