import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const stateSource=fs.readFileSync('core/state.js','utf8');
const accountSource=fs.readFileSync('core/account.js','utf8');

function boot(seed={}){
 const store=new Map(Object.entries(seed));
 const localStorage={
  getItem:key=>store.has(key)?store.get(key):null,
  setItem:(key,value)=>store.set(key,String(value)),
  removeItem:key=>store.delete(key)
 };
 const context={localStorage,updateMetrics(){},console,Date,JSON,Math,Uint8Array,crypto:globalThis.crypto};
 vm.createContext(context);
 vm.runInContext(stateSource+';globalThis.__getState=()=>state;',context);
 vm.runInContext(accountSource+';globalThis.__validate=validateMonBackup;globalThis.__import=importMonBackup;globalThis.__payload=monSyncPayload;',context);
 return {context,store};
}

{
 const {context}=boot({'mon-profile':JSON.stringify({name:'Antes',dailyGoal:10,studyMode:'revisao'})});
 const payload={syncVersion:1,profile:{name:'Paulo',dailyGoal:30,studyMode:'desafio'},learningState:{saveVersion:1,xp:999,foundationDay:9,learningEvidence:{events:[{at:1,kind:'attempt',ok:true}]}}};
 const out=context.__import(JSON.stringify(payload));
 assert.equal(out.learningState.saveVersion,2);
 assert.equal(context.__getState().xp,999);
 assert.equal(JSON.parse(context.localStorage.getItem('mon-state')).saveVersion,2);
 assert.equal(JSON.parse(context.localStorage.getItem('mon-state-backup')).xp,120);
 assert.equal(JSON.parse(context.localStorage.getItem('mon-profile')).name,'Paulo');
}

{
 const {context,store}=boot({'mon-state':JSON.stringify({saveVersion:2,xp:555}),'mon-profile':JSON.stringify({name:'Seguro',dailyGoal:20,studyMode:'equilibrado'})});
 const beforeState=store.get('mon-state'),beforeProfile=store.get('mon-profile');
 assert.throws(()=>context.__import(JSON.stringify({syncVersion:99,learningState:{saveVersion:2,xp:1}})),/Versão de backup não suportada/);
 assert.equal(store.get('mon-state'),beforeState,'invalid import must not overwrite state');
 assert.equal(store.get('mon-profile'),beforeProfile,'invalid import must not overwrite profile');
}

{
 const {context}=boot();
 assert.throws(()=>context.__validate({syncVersion:1,learningState:{saveVersion:99}}),/future MON save version/);
 const payload=context.__payload({name:'Backup',dailyGoal:20,studyMode:'equilibrado'});
 assert.equal(payload.learningState.saveVersion,2);
 assert.equal(payload.syncVersion,1);
}

console.log('MON backup import/export contracts passed');
