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
 vm.runInContext(source+';globalThis.__state=state;globalThis.__save=save;globalThis.__version=MON_SAVE_VERSION;',context);
 return {context,store};
}

{
 const {context}=boot();
 assert.equal(context.__state.saveVersion,1);
 assert.equal(context.__state.foundationDay,1);
 assert.deepEqual(Object.keys(context.__state.videoLearning.opened),[]);
}
{
 const legacy={xp:777,foundationDay:8,reviews:{a:{ease:2.1}}};
 const {context}=boot({'mon-state':JSON.stringify(legacy)});
 assert.equal(context.__state.saveVersion,1);
 assert.equal(context.__state.xp,777);
 assert.equal(context.__state.foundationDay,8);
 assert.equal(context.__state.reviews.a.ease,2.1);
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
 assert.equal(context.__state.saveVersion,1);
}
{
 const initial={saveVersion:1,xp:200,foundationDay:3};
 const {context,store}=boot({'mon-state':JSON.stringify(initial)});
 context.__state.xp=250;
 context.__save();
 assert.equal(JSON.parse(store.get('mon-state')).xp,250);
 assert.equal(JSON.parse(store.get('mon-state-backup')).xp,200);
 assert.equal(JSON.parse(store.get('mon-state')).saveVersion,1);
}
{
 const initial={saveVersion:1,videoLearning:{opened:{listening:2},practice:{listening:1},last:{id:'listening',at:123}}};
 const {context,store}=boot({'mon-state':JSON.stringify(initial)});
 assert.equal(context.__state.videoLearning.opened.listening,2);
 context.__state.videoLearning.practice.listening=2;context.__save();
 assert.equal(JSON.parse(store.get('mon-state')).videoLearning.practice.listening,2);
}
console.log('MON state persistence contracts passed');