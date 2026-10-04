// MON account boundary
const MON_ACCOUNT_KEY='mon-account';
const MON_SYNC_VERSION=1;
const MON_CLOUD_LINK_KEY='mon-cloud-linked';
let monSyncTimer=null,monSyncInFlight=null;

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
  const stored=JSON.parse(localStorage.getItem(MON_ACCOUNT_KEY)||'{}'),account=normalizeMonAccount(stored);
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
function monCloudAvailable(){return typeof monCloudConfigured==='function'&&monCloudConfigured()}
function monLocalSyncDirty(){try{return !!localStorage.getItem(MON_SYNC_DIRTY_KEY)}catch{return false}}
function clearMonSyncDirty(){try{localStorage.removeItem(MON_SYNC_DIRTY_KEY)}catch{}}
function monHasMeaningfulLocalProgress(){
 return Number(state?.sessions||0)>0||Number(state?.xp||120)>120||Number(state?.foundationDay||1)>1||Number(state?.pathProgress||0)>0||Number(state?.day||1)>1||(state?.mistakes||[]).length>0;
}
function monRememberSession(session){
 if(!session?.user)return loadMonAccount();
 const account=saveMonAccount({...loadMonAccount(),provider:'supabase',userId:session.user.id,email:session.user.email||null,status:'connected'});
 try{localStorage.setItem(MON_CLOUD_LINK_KEY,'1')}catch{}
 return account;
}
function monRecordCloudSync(row,session){
 const account=saveMonAccount({...loadMonAccount(),provider:'supabase',userId:session?.user?.id||loadMonAccount().userId,email:session?.user?.email||loadMonAccount().email,cloudRevision:Number(row?.revision||0),lastSyncedAt:row?.updated_at||new Date().toISOString(),lastSyncStatus:'synced'});
 clearMonSyncDirty();try{localStorage.setItem(MON_CLOUD_LINK_KEY,'1')}catch{};return account;
}

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
 state=validated.learningState;if(markDirty)markMonSyncDirty();else clearMonSyncDirty();updateMetrics();return validated;
}
function importMonBackup(raw){const payload=typeof raw==='string'?JSON.parse(raw):raw;return applyMonSnapshot(payload,{markDirty:true})}
async function importMonBackupFile(input){
 const file=input?.files?.[0];if(!file)return false;
 try{
  const text=await file.text();importMonBackup(text);
  if(typeof renderUserArea==='function')renderUserArea();if(typeof renderGameHome==='function')renderGameHome();
  if(typeof toast==='function')toast('Backup importado com segurança');return true;
 }catch(e){
  if(typeof toast==='function')toast('Backup inválido · nada foi alterado');return false;
 }finally{if(input)input.value=''}
}
function ensureMonBackupImportControl(){
 if(document.getElementById('userBackupInput'))return;
 const actions=[...document.querySelectorAll('#user .user-actions')].at(-1);if(!actions)return;
 actions.insertAdjacentHTML('beforeend','<button class="user-secondary" type="button" data-mon-import>importar backup</button><input id="userBackupInput" type="file" accept="application/json,.json" hidden>');
 actions.querySelector('[data-mon-import]')?.addEventListener('click',()=>document.getElementById('userBackupInput')?.click());
 document.getElementById('userBackupInput')?.addEventListener('change',e=>importMonBackupFile(e.currentTarget));
}
function monApplyCloudRow(row,session){
 const validated=applyMonSnapshot({syncVersion:row.sync_version,profile:row.profile,learningState:row.learning_state},{markDirty:false});
 monRecordCloudSync(row,session);if(typeof renderGameHome==='function')renderGameHome();return validated;
}
async function monCloudReconcile({preference=null}={}){
 if(!monCloudAvailable())return {status:'unavailable'};
 if(monSyncInFlight&&!preference)return monSyncInFlight;
 const run=(async()=>{
  const session=await monCloudSession();if(!session)return {status:'disconnected'};
  const account=monRememberSession(session),remote=await monCloudPull();
  const localDirty=monLocalSyncDirty()||(!account.cloudRevision&&monHasMeaningfulLocalProgress());
  if(!remote){
   const pushed=await monCloudPush(loadLocalProfile(),{expectedRevision:0});monRecordCloudSync(pushed,session);return {status:'pushed',row:pushed};
  }
  const remoteRevision=Number(remote.revision||1),knownRevision=Number(account.cloudRevision||0),cloudChanged=remoteRevision!==knownRevision;
  if(preference==='cloud'){monApplyCloudRow(remote,session);return {status:'pulled',row:remote}}
  if(preference==='local'){
   const pushed=await monCloudPush(loadLocalProfile(),{expectedRevision:remoteRevision});monRecordCloudSync(pushed,session);return {status:'pushed',row:pushed};
  }
  if(cloudChanged&&localDirty){saveMonAccount({...account,lastSyncStatus:'conflict'});return {status:'conflict',row:remote,localDirty:true}}
  if(cloudChanged){monApplyCloudRow(remote,session);return {status:'pulled',row:remote}}
  if(localDirty){
   try{const pushed=await monCloudPush(loadLocalProfile(),{expectedRevision:knownRevision});monRecordCloudSync(pushed,session);return {status:'pushed',row:pushed}}
   catch(e){if(e?.code==='MON_SYNC_CONFLICT'){const latest=await monCloudPull();saveMonAccount({...account,lastSyncStatus:'conflict'});return {status:'conflict',row:latest,localDirty:true}}throw e}
  }
  monRecordCloudSync(remote,session);return {status:'current',row:remote};
 })();
 if(!preference)monSyncInFlight=run;
 try{return await run}finally{if(monSyncInFlight===run)monSyncInFlight=null}
}
function scheduleMonCloudSync(){
 clearTimeout(monSyncTimer);
 monSyncTimer=setTimeout(async()=>{try{const result=await monCloudReconcile();if(result.status==='conflict'&&document.getElementById('user')?.classList.contains('active'))renderCloudAccountPanel()}catch(e){}},1600);
}
async function monCloudBootstrap(){try{return await monCloudReconcile()}catch(e){return {status:'error',error:e}}}

async function renderCloudAccountPanel(){
 const panel=document.getElementById('userCloudPanel');if(typeof ensureMonBackupImportControl==='function')ensureMonBackupImportControl();if(!panel)return;
 if(!monCloudAvailable()){panel.innerHTML='<b>Conta MON</b><br>Nuvem preparada, aguardando configuração do projeto Supabase.';return}
 try{
  const session=await monCloudSession();
  if(!session){
   panel.innerHTML='<b>Sincronizar entre dispositivos</b><br><label class="user-field"><span>E-mail</span><input id="userCloudEmail" type="email" autocomplete="email" placeholder="voce@exemplo.com"></label><div class="user-actions"><button class="user-save" onclick="connectMonCloud()">enviar link de acesso</button></div>';return;
  }
  monRememberSession(session);
  const result=await monCloudReconcile();
  if(result.status==='conflict'){
   panel.innerHTML='<b>Conflito de progresso</b><br>Este dispositivo e a nuvem mudaram desde o último sync. Escolha qual versão deve continuar. Um backup local é preservado antes de substituir dados.<div class="user-actions"><button class="user-save" onclick="resolveMonCloudConflict(\'local\')">usar este dispositivo</button><button class="user-secondary" onclick="resolveMonCloudConflict(\'cloud\')">usar nuvem</button></div>';return;
  }
  const account=loadMonAccount(),email=escapeHtml(session.user.email||'usuário'),syncText=account.lastSyncedAt?'último sync '+new Date(account.lastSyncedAt).toLocaleString():'sync pronto';
  panel.innerHTML='<b>Conta MON conectada</b><br>'+email+' · revisão '+account.cloudRevision+' · '+syncText+'<div class="user-actions"><button class="user-save" onclick="syncMonNow()">sincronizar agora</button><button class="user-secondary" onclick="disconnectMonCloud()">sair</button></div>';
 }catch(e){panel.textContent='Conta MON indisponível: '+e.message}
}
async function connectMonCloud(){
 const email=document.getElementById('userCloudEmail')?.value.trim();if(!email){toast('Digite seu e-mail');return}
 try{await monCloudSignIn(email);toast('Link de acesso enviado ao seu e-mail')}catch(e){toast(e.message)}
}
async function disconnectMonCloud(){
 try{
  await monCloudSignOut();const a=loadMonAccount();saveMonAccount({...a,provider:null,userId:null,email:null,status:'local',cloudRevision:0,lastSyncedAt:null,lastSyncStatus:null});
  try{localStorage.removeItem(MON_CLOUD_LINK_KEY)}catch{};await renderCloudAccountPanel();toast('Conta desconectada deste dispositivo');
 }catch(e){toast(e.message)}
}
async function resolveMonCloudConflict(choice){
 try{
  const result=await monCloudReconcile({preference:choice});
  await renderCloudAccountPanel();if(typeof renderUserArea==='function')renderUserArea();
  toast(result.status==='pulled'?'Progresso da nuvem aplicado':'Progresso deste dispositivo enviado');
 }catch(e){toast(e.message)}
}
async function syncMonNow(){
 try{
  const result=await monCloudReconcile();
  if(result.status==='conflict'){await renderCloudAccountPanel();toast('Há um conflito de progresso para resolver');return}
  toast(result.status==='pulled'?'Progresso atualizado da nuvem':result.status==='pushed'?'Progresso enviado para a nuvem':'Progresso já sincronizado');
  await renderCloudAccountPanel();
 }catch(e){toast(e.message)}
}
function exportMonBackup(){const payload=monSyncPayload(loadLocalProfile());const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='mon-backup-'+shellLocalDateKey()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),0);toast('Backup do MON exportado')}
