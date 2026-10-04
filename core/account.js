// MON account boundary
const MON_ACCOUNT_KEY='mon-account';
const MON_SYNC_VERSION=1;
const MON_CLOUD_LINK_KEY='mon-cloud-linked';

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
  cloudRevision:Math.max(0,Number(raw.cloudRevision||0)),
  lastSyncedAt:raw.lastSyncedAt||null,
  lastSyncStatus:raw.lastSyncStatus||null
 };
}
function saveMonAccount(account){const next=normalizeMonAccount(account);localStorage.setItem(MON_ACCOUNT_KEY,JSON.stringify(next));return next}
function loadMonAccount(){
 try{
  const account=normalizeMonAccount(JSON.parse(localStorage.getItem(MON_ACCOUNT_KEY)||'{}'));
  localStorage.setItem(MON_ACCOUNT_KEY,JSON.stringify(account));return account;
 }catch(e){
  const account=normalizeMonAccount();try{localStorage.setItem(MON_ACCOUNT_KEY,JSON.stringify(account))}catch(err){}return account;
 }
}
function monSyncPayload(profile={}){
 const account=loadMonAccount();
 return {syncVersion:MON_SYNC_VERSION,localId:account.localId,updatedAt:new Date().toISOString(),profile:{...profile},learningState:typeof normalizeState==='function'?normalizeState(state):state};
}
function monAccountStatus(){return loadMonAccount().status}
function monLocalSyncDirty(){try{return !!localStorage.getItem(MON_SYNC_DIRTY_KEY)}catch{return false}}
function clearMonSyncDirty(){try{localStorage.removeItem(MON_SYNC_DIRTY_KEY)}catch{}}

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
function applyMonSnapshot(payload,{markDirty=true}={}){
 const validated=validateMonBackup(payload),current=JSON.stringify(normalizeState(state));
 localStorage.setItem(MON_STATE_BACKUP_KEY,current);
 localStorage.setItem(MON_STATE_KEY,JSON.stringify(validated.learningState));
 localStorage.setItem('mon-profile',JSON.stringify(validated.profile));
 state=validated.learningState;
 if(markDirty)markMonSyncDirty();else clearMonSyncDirty();
 updateMetrics();return validated;
}
function importMonBackup(raw){return applyMonSnapshot(typeof raw==='string'?JSON.parse(raw):raw,{markDirty:true})}
async function importMonBackupFile(input){
 const file=input?.files?.[0];if(!file)return false;
 try{
  importMonBackup(await file.text());
  if(typeof renderUserArea==='function')renderUserArea();
  if(typeof renderGameHome==='function')renderGameHome();
  if(typeof toast==='function')toast('Backup importado com segurança');
  return true;
 }catch(e){
  if(typeof toast==='function')toast('Backup inválido · nada foi alterado');
  return false;
 }finally{if(input)input.value=''}
}
function ensureMonBackupImportControl(){
 if(document.getElementById('userBackupInput'))return;
 const actions=[...document.querySelectorAll('#user .user-actions')].at(-1);if(!actions)return;
 actions.insertAdjacentHTML('beforeend','<button class="user-secondary" type="button" data-mon-import>importar backup</button><input id="userBackupInput" type="file" accept="application/json,.json" hidden>');
 actions.querySelector('[data-mon-import]')?.addEventListener('click',()=>document.getElementById('userBackupInput')?.click());
 document.getElementById('userBackupInput')?.addEventListener('change',e=>importMonBackupFile(e.currentTarget));
}
function exportMonBackup(){
 const payload=monSyncPayload(loadLocalProfile()),blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='mon-backup-'+shellLocalDateKey()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),0);toast('Backup do MON exportado');
}
