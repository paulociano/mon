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

function validateMonBackup(payload){
 if(!payload||typeof payload!=='object'||Array.isArray(payload))throw new Error('Backup MON inválido');
 const syncVersion=Number(payload.syncVersion||0);
 if(!Number.isInteger(syncVersion)||syncVersion<1||syncVersion>MON_SYNC_VERSION)throw new Error('Versão de backup não suportada');
 if(!payload.learningState||typeof payload.learningState!=='object'||Array.isArray(payload.learningState))throw new Error('Backup sem estado de aprendizagem válido');
 const learningState=migrateState(payload.learningState);
 const profile=payload.profile&&typeof payload.profile==='object'&&!Array.isArray(payload.profile)?{
  name:String(payload.profile.name||'Estudante MON').slice(0,32),
  dailyGoal:[10,20,30].includes(Number(payload.profile.dailyGoal))?Number(payload.profile.dailyGoal):20,
  studyMode:['equilibrado','revisao','desafio'].includes(payload.profile.studyMode)?payload.profile.studyMode:'equilibrado'
 }:{name:'Estudante MON',dailyGoal:20,studyMode:'equilibrado'};
 return {syncVersion,learningState,profile};
}
function importMonBackup(raw){
 const payload=typeof raw==='string'?JSON.parse(raw):raw;
 const validated=validateMonBackup(payload);
 const current=JSON.stringify(normalizeState(state));
 localStorage.setItem(MON_STATE_BACKUP_KEY,current);
 localStorage.setItem(MON_STATE_KEY,JSON.stringify(validated.learningState));
 localStorage.setItem('mon-profile',JSON.stringify(validated.profile));
 state=validated.learningState;
 updateMetrics();
 return validated;
}
async function importMonBackupFile(input){
 const file=input?.files?.[0];if(!file)return false;
 try{
  const text=await file.text();
  importMonBackup(text);
  if(typeof renderUserArea==='function')renderUserArea();
  if(typeof renderGameHome==='function')renderGameHome();
  if(typeof toast==='function')toast('Backup importado com segurança');
  return true;
 }catch(e){
  if(typeof toast==='function')toast('Backup inválido · nada foi alterado');
  return false;
 }finally{
  if(input)input.value='';
 }
}
