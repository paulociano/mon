// MON account boundary
// Provider-agnostic identity and sync payloads. No network provider is configured yet.

const MON_ACCOUNT_KEY='mon-account';
const MON_SYNC_VERSION=1;

function createMonLocalId(){
 const bytes=new Uint8Array(12);
 if(globalThis.crypto?.getRandomValues)crypto.getRandomValues(bytes);
 else for(let i=0;i<bytes.length;i++)bytes[i]=Math.floor(Math.random()*256);
 return 'mon_'+Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
}
function normalizeMonAccount(raw={}){
 return {
  version:MON_SYNC_VERSION,
  localId:String(raw.localId||createMonLocalId()),
  provider:raw.provider||null,
  userId:raw.userId||null,
  email:raw.email||null,
  status:raw.userId?'connected':'local',
  lastSyncedAt:raw.lastSyncedAt||null
 };
}
function loadMonAccount(){
 try{
  const stored=JSON.parse(localStorage.getItem(MON_ACCOUNT_KEY)||'{}');
  const account=normalizeMonAccount(stored);
  localStorage.setItem(MON_ACCOUNT_KEY,JSON.stringify(account));
  return account;
 }catch(e){
  const account=normalizeMonAccount();
  try{localStorage.setItem(MON_ACCOUNT_KEY,JSON.stringify(account))}catch(err){}
  return account;
 }
}
function monSyncPayload(profile={}){
 const account=loadMonAccount();
 return {
  syncVersion:MON_SYNC_VERSION,
  localId:account.localId,
  updatedAt:new Date().toISOString(),
  profile:{...profile},
  learningState:typeof normalizeState==='function'?normalizeState(state):state
 };
}
function monAccountStatus(){return loadMonAccount().status}
function monCloudAvailable(){return false}
