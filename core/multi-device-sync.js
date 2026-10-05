let monSyncTimer=null,monSyncInFlight=null;

function monCloudAvailable(){return typeof monCloudConfigured==='function'&&monCloudConfigured()}
function monHasMeaningfulLocalProgress(){
 return Number(state?.sessions||0)>0||Number(state?.xp||120)>120||Number(state?.foundationDay||1)>1||Number(state?.pathProgress||0)>0||Number(state?.day||1)>1||(state?.mistakes||[]).length>0;
}
function monRememberSession(session){
 if(!session?.user)return loadMonAccount();
 const prev=loadMonAccount(),same=prev.userId===session.user.id;
 const account=saveMonAccount({...prev,provider:'supabase',userId:session.user.id,email:session.user.email||null,status:'connected',cloudRevision:same?prev.cloudRevision:0,lastSyncedAt:same?prev.lastSyncedAt:null,lastSyncStatus:same?prev.lastSyncStatus:null});
 try{localStorage.setItem(MON_CLOUD_LINK_KEY,'1')}catch{}
 return account;
}
function monLocalSnapshot(){return JSON.stringify([state,loadLocalProfile()])}
function monRecordCloudSync(row,session,snapshot=monLocalSnapshot()){
 const prev=loadMonAccount(),pending=snapshot!==monLocalSnapshot();
 const account=saveMonAccount({...prev,provider:'supabase',userId:session?.user?.id||prev.userId,email:session?.user?.email||prev.email,cloudRevision:Number(row?.revision||0),lastSyncedAt:row?.updated_at||new Date().toISOString(),lastSyncStatus:pending?'pending':'synced'});
 if(!pending)clearMonSyncDirty();else markMonSyncDirty();
 try{localStorage.setItem(MON_CLOUD_LINK_KEY,'1')}catch{};return account;
}
function monApplyCloudRow(row,session){
 const validated=applyMonSnapshot({syncVersion:row.sync_version,profile:row.profile,learningState:row.learning_state},{markDirty:false});
 monRecordCloudSync(row,session);
 if(typeof renderGameHome==='function')renderGameHome();
 return validated;
}
async function monCloudReconcile({preference=null}={}){
 if(!monCloudAvailable()&&typeof monEnsureCloudConfig==='function'){try{await monEnsureCloudConfig()}catch{}}
 if(!monCloudAvailable())return {status:'unavailable'};
 if(monSyncInFlight)return monSyncInFlight;
 const run=(async()=>{
  const session=await monCloudSession();
  if(!session)return {status:'disconnected'};
  const account=monRememberSession(session),beforePull=monLocalSnapshot(),remote=await monCloudPull();
  const localDirty=monLocalSyncDirty()||(!account.cloudRevision&&monHasMeaningfulLocalProgress());
  if(remote&&beforePull!==monLocalSnapshot()){rememberMonCloudConflict(remote);return {status:'conflict',row:remote,reason:'local-changed-during-pull'}}
  if(!remote){
   const snapshot=monLocalSnapshot(),pushed=await monCloudPush(loadLocalProfile(),{expectedRevision:0});
   monRecordCloudSync(pushed,session,snapshot);return {status:'pushed',row:pushed};
  }
  const remoteRevision=Number(remote.revision||1),knownRevision=Number(account.cloudRevision||0),cloudChanged=remoteRevision!==knownRevision;
  if(remoteRevision<knownRevision){rememberMonCloudConflict(remote);saveMonAccount({...account,lastSyncStatus:'conflict'});return {status:'conflict',row:remote,reason:'revision-regressed'}}
  if(preference==='cloud'){monApplyCloudRow(remote,session);return {status:'pulled',row:remote}}
  if(preference==='local'){
   const snapshot=monLocalSnapshot(),pushed=await monCloudPush(loadLocalProfile(),{expectedRevision:remoteRevision});
   monRecordCloudSync(pushed,session,snapshot);return {status:'pushed',row:pushed};
  }
  if(cloudChanged&&localDirty){rememberMonCloudConflict(remote);saveMonAccount({...account,lastSyncStatus:'conflict'});return {status:'conflict',row:remote}}
  if(cloudChanged){monApplyCloudRow(remote,session);return {status:'pulled',row:remote}}
  if(localDirty){
   try{
    const snapshot=monLocalSnapshot(),pushed=await monCloudPush(loadLocalProfile(),{expectedRevision:knownRevision});
    monRecordCloudSync(pushed,session,snapshot);return {status:'pushed',row:pushed};
   }catch(e){
    if(e?.code!=='MON_SYNC_CONFLICT')throw e;
    const latest=await monCloudPull();rememberMonCloudConflict(latest);
    saveMonAccount({...account,lastSyncStatus:'conflict'});
    return {status:'conflict',row:latest};
   }
  }
  monRecordCloudSync(remote,session);return {status:'current',row:remote};
 })();
 monSyncInFlight=run;
 try{return await run}finally{if(monSyncInFlight===run)monSyncInFlight=null}
}
function scheduleMonCloudSync(){
 clearTimeout(monSyncTimer);
 monSyncTimer=setTimeout(async()=>{try{
  const result=await monCloudReconcile();
  if(result.status==='conflict'&&document.getElementById('user')?.classList.contains('active'))renderCloudAccountPanel();
 }catch(e){const account=loadMonAccount();saveMonAccount({...account,lastSyncStatus:'error'});const badge=document.getElementById('userAccountBadge');if(badge)badge.textContent='envio pendente'}},1600);
}
async function monCloudBootstrap(){try{return await monCloudReconcile()}catch(e){return {status:'error',error:e}}}

async function renderCloudAccountPanel(){
 const panel=document.getElementById('userCloudPanel');
 if(typeof ensureMonBackupImportControl==='function')ensureMonBackupImportControl();
 if(typeof ensureMonPrivacyControls==='function')ensureMonPrivacyControls();
 if(!panel)return;
 if(!monCloudAvailable()&&typeof monEnsureCloudConfig==='function'){try{await monEnsureCloudConfig()}catch{}}
 if(!monCloudAvailable()){panel.innerHTML='<b>Conta MON</b><br>Sync indisponível. Seu progresso continua neste navegador; exporte um backup.';return}
 try{
  const session=await monCloudSession();
  if(!session){
   panel.innerHTML='<b>Sincronizar entre dispositivos</b><br><label class="user-field"><span>E-mail</span><input id="userCloudEmail" type="email" autocomplete="email" placeholder="voce@exemplo.com"></label><div class="user-actions"><button class="user-save" onclick="connectMonCloud()">enviar link de acesso</button></div>';
   return;
  }
  monRememberSession(session);const badge=document.getElementById('userAccountBadge');if(badge)badge.textContent='conta conectada';
  const result=await monCloudReconcile();
  if(badge)badge.textContent=result.status==='conflict'?'conflito de progresso':monLocalSyncDirty()?'envio pendente':'conta sincronizada';
  if(result.status==='conflict'){
   panel.innerHTML='<b>Conflito de progresso</b><br>Este dispositivo e a nuvem mudaram. Escolha qual versão deve continuar; o MON preserva um backup local.<div class="user-actions"><button class="user-save" onclick="resolveMonCloudConflict(\'local\')">usar este dispositivo</button><button class="user-secondary" onclick="resolveMonCloudConflict(\'cloud\')">usar nuvem</button></div>';
   return;
  }
  const account=loadMonAccount(),syncText=account.lastSyncedAt?'último sync '+new Date(account.lastSyncedAt).toLocaleString():'sync pronto';
  panel.innerHTML='<b>Conta MON conectada</b><br><span id="monCloudIdentity"></span> · revisão '+account.cloudRevision+' · '+syncText+'<div class="user-actions"><button class="user-save" onclick="syncMonNow()">sincronizar agora</button><button class="user-secondary" onclick="disconnectMonCloud()">sair</button></div>';
  const identity=document.getElementById('monCloudIdentity');if(identity)identity.textContent=session.user.email||'usuário';
 }catch(e){panel.textContent='Conta MON indisponível: '+e.message}
}
async function connectMonCloud(){
 const email=document.getElementById('userCloudEmail')?.value.trim();
 if(!email){toast('Digite seu e-mail');return}
 try{await monCloudSignIn(email);toast('Link de acesso enviado ao seu e-mail')}catch(e){toast(e.message)}
}
async function disconnectMonCloud(){
 try{
  await monCloudSignOut();
  const a=loadMonAccount();
  saveMonAccount({...a,provider:null,userId:null,email:null,status:'local',cloudRevision:0,lastSyncedAt:null,lastSyncStatus:null});
  try{localStorage.removeItem(MON_CLOUD_LINK_KEY)}catch{}
  await renderCloudAccountPanel();toast('Conta desconectada deste dispositivo');
 }catch(e){toast(e.message)}
}
async function resolveMonCloudConflict(choice){
 try{
  const result=await monCloudReconcile({preference:choice});
  if(result.status==='conflict'){await renderCloudAccountPanel();toast('O progresso mudou de novo. Revise antes de escolher.');return}
  if(typeof renderUserArea==='function')renderUserArea();
  toast(result.status==='pulled'?'Versão da nuvem aplicada':'Versão deste dispositivo enviada');
 }catch(e){toast(e.message)}
}
async function syncMonNow(){
 try{
  const result=await monCloudReconcile();
  if(result.status==='conflict'){await renderCloudAccountPanel();toast('Há um conflito para resolver');return}
  toast(result.status==='pulled'?'Nuvem aplicada':result.status==='pushed'?'Progresso enviado':'Já sincronizado');
  await renderCloudAccountPanel();
 }catch(e){toast(e.message)}
}
if(typeof window!=='undefined')window.addEventListener('online',scheduleMonCloudSync);
