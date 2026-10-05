// MON Supabase adapter. Loaded only from the user area.
let monSupabaseClient=null,monSupabaseClientPromise=null;
function monCloudConfig(){return globalThis.MON_CLOUD_CONFIG||{}}
function monCloudConfigured(){const c=monCloudConfig();return /^https:\/\/.+\.supabase\.co$/.test(c.url||'')&&!!c.publishableKey}
async function ensureSupabaseSdk(){
 if(globalThis.supabase?.createClient)return globalThis.supabase;
 await loadRuntimeScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2');
 return globalThis.supabase;
}
async function getMonSupabase(){
 if(monSupabaseClient)return monSupabaseClient;
 if(monSupabaseClientPromise)return monSupabaseClientPromise;
 monSupabaseClientPromise=(async()=>{
  if(!monCloudConfigured()&&typeof monEnsureCloudConfig==='function'){try{await monEnsureCloudConfig()}catch{}}
  if(!monCloudConfigured())return null;
  const sdk=await ensureSupabaseSdk(),c=monCloudConfig();
  return sdk.createClient(c.url,c.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 })();
 try{
  monSupabaseClient=await monSupabaseClientPromise;
  return monSupabaseClient;
 }finally{
  monSupabaseClientPromise=null;
 }
}
async function monCloudSession(){const client=await getMonSupabase();if(!client)return null;const {data}=await client.auth.getSession();return data.session||null}
async function monCloudSignIn(email){const client=await getMonSupabase();if(!client)throw new Error('Nuvem MON ainda não configurada');const redirectTo=location.href.split('#')[0];const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:redirectTo}});if(error)throw error;return true}
async function monCloudSignOut(){const client=await getMonSupabase();if(!client)return;const {error}=await client.auth.signOut();if(error)throw error}
function monSyncConflict(message='O progresso mudou em outro dispositivo'){const e=new Error(message);e.code='MON_SYNC_CONFLICT';return e}
function monCloudRow(session,payload,revision){
 return {user_id:session.user.id,sync_version:payload.syncVersion,profile:payload.profile,learning_state:payload.learningState,client_updated_at:payload.updatedAt,updated_at:new Date().toISOString(),revision};
}
async function monCloudPull(){
 const client=await getMonSupabase(),session=await monCloudSession();
 if(!client||!session)throw new Error('Entre na Conta MON para sincronizar');
 const {data,error}=await client.from('mon_user_state').select('sync_version,profile,learning_state,client_updated_at,updated_at,revision').eq('user_id',session.user.id).maybeSingle();
 if(error)throw error;
 return data;
}
async function monCloudPush(profile,{expectedRevision=0}={}){
 const client=await getMonSupabase(),session=await monCloudSession();
 if(!client||!session)throw new Error('Entre na Conta MON para sincronizar');
 const payload=monSyncPayload(profile),nextRevision=Math.max(1,Number(expectedRevision||0)+1),row=monCloudRow(session,payload,nextRevision);
 if(Number(expectedRevision||0)===0){
  const {data,error}=await client.from('mon_user_state').insert(row).select('sync_version,profile,learning_state,client_updated_at,updated_at,revision').single();
  if(error){if(error.code==='23505')throw monSyncConflict();throw error}
  return data;
 }
 const {data,error}=await client.from('mon_user_state').update(row).eq('user_id',session.user.id).eq('revision',Number(expectedRevision)).select('sync_version,profile,learning_state,client_updated_at,updated_at,revision').maybeSingle();
 if(error)throw error;
 if(!data)throw monSyncConflict();
 return data;
}
