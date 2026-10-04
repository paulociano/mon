import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const accountSource=fs.readFileSync('core/account.js','utf8');
const syncSource=fs.readFileSync('core/multi-device-sync.js','utf8');

function clone(x){return x==null?x:JSON.parse(JSON.stringify(x))}
function row(revision,xp=900){
 return {sync_version:1,profile:{name:'Cloud',dailyGoal:20,studyMode:'equilibrado'},learning_state:{saveVersion:3,xp,sessions:2,pathProgress:3,foundationDay:4},client_updated_at:'2026-10-04T10:00:00.000Z',updated_at:'2026-10-04T10:00:00.000Z',revision};
}
function boot({state={saveVersion:3,xp:120,sessions:0,pathProgress:0,foundationDay:1},account=null,dirty=false,remote=null,user='u1',forceConflict=false}={}){
 const store=new Map();
 if(account)store.set('mon-account',JSON.stringify(account));
 if(dirty)store.set('mon-sync-dirty-at','2026-10-04T11:00:00.000Z');
 const localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
 const context={console,Date,Math,Number,String,Array,Object,Set,JSON,Uint8Array,crypto:globalThis.crypto,localStorage,setTimeout,clearTimeout,
  Blob:class{},URL:{createObjectURL(){return'blob:x'},revokeObjectURL(){}},
  document:{getElementById(){return null}},
  updateMetrics(){},renderGameHome(){},loadLocalProfile(){return{name:'Local',dailyGoal:20,studyMode:'equilibrado'}},
  shellLocalDateKey(){return'2026-10-04'},toast(){},normalizeState:x=>clone(x),migrateState:x=>clone(x)
 };
 vm.createContext(context);
 vm.runInContext(`
  const MON_SYNC_DIRTY_KEY='mon-sync-dirty-at';
  const MON_STATE_BACKUP_KEY='mon-state-backup';
  var state=${JSON.stringify(state)};
  function markMonSyncDirty(){localStorage.setItem(MON_SYNC_DIRTY_KEY,new Date().toISOString())}
  globalThis.__remote=${JSON.stringify(remote)};
  globalThis.__pushes=[];
  globalThis.__forceConflict=${forceConflict?'true':'false'};
  function monCloudConfigured(){return true}
  async function monCloudSession(){return {user:{id:${JSON.stringify(user)},email:'user@example.com'}}}
  async function monCloudPull(){return globalThis.__remote?JSON.parse(JSON.stringify(globalThis.__remote)):null}
  async function monCloudPush(profile,{expectedRevision=0}={}){
   globalThis.__pushes.push(expectedRevision);
   if(globalThis.__forceConflict){
    globalThis.__forceConflict=false;
    if(globalThis.__remote)globalThis.__remote={...globalThis.__remote,revision:globalThis.__remote.revision+1,updated_at:'2026-10-04T12:00:00.000Z'};
    const e=new Error('conflict');e.code='MON_SYNC_CONFLICT';throw e;
   }
   if(expectedRevision===0){
    if(globalThis.__remote){const e=new Error('conflict');e.code='MON_SYNC_CONFLICT';throw e}
    globalThis.__remote={sync_version:1,profile,learning_state:normalizeState(state),updated_at:'2026-10-04T12:00:00.000Z',revision:1};return globalThis.__remote;
   }
   if(!globalThis.__remote||globalThis.__remote.revision!==expectedRevision){const e=new Error('conflict');e.code='MON_SYNC_CONFLICT';throw e}
   globalThis.__remote={sync_version:1,profile,learning_state:normalizeState(state),updated_at:'2026-10-04T12:00:00.000Z',revision:expectedRevision+1};return globalThis.__remote;
  }
 `+accountSource+'\n'+syncSource+`;
  globalThis.__reconcile=monCloudReconcile;
  globalThis.__account=loadMonAccount;
  globalThis.__state=()=>state;
 `,context);
 return {context,store};
}

{
 const {context,store}=boot({state:{saveVersion:3,xp:500,sessions:2,pathProgress:3,foundationDay:4}});
 const result=await context.__reconcile();
 assert.equal(result.status,'pushed');
 assert.deepEqual(Array.from(context.__pushes),[0]);
 assert.equal(context.__account().cloudRevision,1);
 assert.equal(store.has('mon-sync-dirty-at'),false);
}
{
 const {context,store}=boot({state:{saveVersion:3,xp:300,sessions:1,pathProgress:1,foundationDay:2},account:{localId:'m1',userId:'u1',provider:'supabase',cloudRevision:1,lastSyncedAt:'2026-10-04T09:00:00.000Z'},remote:row(2,900)});
 const result=await context.__reconcile();
 assert.equal(result.status,'pulled');
 assert.equal(context.__state().xp,900);
 assert.equal(context.__account().cloudRevision,2);
 assert.equal(JSON.parse(store.get('mon-state-backup')).xp,300);
}
{
 const {context,store}=boot({state:{saveVersion:3,xp:500,sessions:2,pathProgress:2,foundationDay:3},account:{localId:'m1',userId:'u1',provider:'supabase',cloudRevision:1},dirty:true,remote:row(2,900)});
 const result=await context.__reconcile();
 assert.equal(result.status,'conflict');
 assert.equal(context.__state().xp,500);
 assert.deepEqual(Array.from(context.__pushes),[]);
 assert.equal(JSON.parse(store.get('mon-cloud-conflict-last')).revision,2,'remote conflict snapshot must be recoverable');
 const cloud=await context.__reconcile({preference:'cloud'});
 assert.equal(cloud.status,'pulled');
 assert.equal(context.__state().xp,900);
}
{
 const {context}=boot({state:{saveVersion:3,xp:500,sessions:2,pathProgress:2,foundationDay:3},account:{localId:'m1',userId:'u1',provider:'supabase',cloudRevision:1},dirty:true,remote:row(2,900)});
 const local=await context.__reconcile({preference:'local'});
 assert.equal(local.status,'pushed');
 assert.deepEqual(Array.from(context.__pushes),[2]);
 assert.equal(context.__account().cloudRevision,3);
 assert.equal(context.__state().xp,500);
}
{
 const {context}=boot({state:{saveVersion:3,xp:600,sessions:3,pathProgress:4,foundationDay:5},account:{localId:'m1',userId:'u1',provider:'supabase',cloudRevision:2},dirty:true,remote:row(2,900),forceConflict:true});
 const result=await context.__reconcile();
 assert.equal(result.status,'conflict');
 assert.equal(context.__pushes[0],2);
 assert.equal(context.__state().xp,600);
}
{
 const {context}=boot({state:{saveVersion:3,xp:650,sessions:2,pathProgress:3,foundationDay:4},account:{localId:'m2',cloudRevision:0},remote:row(4,1000)});
 const result=await context.__reconcile();
 assert.equal(result.status,'conflict','existing local progress on a new device must not be silently overwritten');
}
{
 const {context}=boot({state:{saveVersion:3,xp:120,sessions:0,pathProgress:0,foundationDay:1},account:{localId:'m3',cloudRevision:0},remote:row(4,1000)});
 const result=await context.__reconcile();
 assert.equal(result.status,'pulled');
 assert.equal(context.__state().xp,1000);
}
{
 const {context}=boot({state:{saveVersion:3,xp:400,sessions:1,pathProgress:1,foundationDay:2},account:{localId:'m4',userId:'old-user',provider:'supabase',cloudRevision:7,lastSyncedAt:'2026-10-04T09:00:00.000Z'},remote:row(1,700),user:'new-user'});
 const result=await context.__reconcile();
 assert.equal(result.status,'conflict');
 assert.equal(context.__account().userId,'new-user');
 assert.equal(context.__account().cloudRevision,0,'cloud revision must reset when identity changes');
}

{
 const {context}=boot({state:{saveVersion:3,xp:300,sessions:1,pathProgress:1,foundationDay:2},account:{localId:'m5',userId:'u1',provider:'supabase',cloudRevision:3},remote:row(2,800)});
 const result=await context.__reconcile();
 assert.equal(result.status,'conflict');
 assert.equal(result.reason,'revision-regressed');
 assert.equal(context.__state().xp,300,'revision rollback must never replace newer known local state');
}
console.log('MON multi-device sync contracts passed');
