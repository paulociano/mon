// MON Supabase adapter. Loaded only from the user area.
let monSupabaseClient=null;
function monCloudConfig(){return globalThis.MON_CLOUD_CONFIG||{}}
function monCloudConfigured(){const c=monCloudConfig();return /^https:\/\/.+\.supabase\.co$/.test(c.url||'')&&!!c.publishableKey}
async function ensureSupabaseSdk(){
 if(globalThis.supabase?.createClient)return globalThis.supabase;
 await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.crossOrigin='anonymous';s.onload=resolve;s.onerror=()=>reject(new Error('Falha ao carregar Supabase'));document.head.appendChild(s)});
 return globalThis.supabase;
}
async function getMonSupabase(){
 if(monSupabaseClient)return monSupabaseClient;
 if(!monCloudConfigured())return null;
 const sdk=await ensureSupabaseSdk(),c=monCloudConfig();
 monSupabaseClient=sdk.createClient(c.url,c.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 return monSupabaseClient;
}
async function monCloudSession(){const client=await getMonSupabase();if(!client)return null;const {data}=await client.auth.getSession();return data.session||null}
async function monCloudSignIn(email){const client=await getMonSupabase();if(!client)throw new Error('Nuvem MON ainda não configurada');const redirectTo=location.href.split('#')[0];const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:redirectTo}});if(error)throw error;return true}
async function monCloudSignOut(){const client=await getMonSupabase();if(!client)return;const {error}=await client.auth.signOut();if(error)throw error}
async function monCloudPush(profile){const client=await getMonSupabase(),session=await monCloudSession();if(!client||!session)throw new Error('Entre na Conta MON para sincronizar');const payload=monSyncPayload(profile);const row={user_id:session.user.id,sync_version:payload.syncVersion,profile:payload.profile,learning_state:payload.learningState,client_updated_at:payload.updatedAt,updated_at:new Date().toISOString()};const {error}=await client.from('mon_user_state').upsert(row,{onConflict:'user_id'});if(error)throw error;return row.updated_at}
async function monCloudPull(){const client=await getMonSupabase(),session=await monCloudSession();if(!client||!session)throw new Error('Entre na Conta MON para sincronizar');const {data,error}=await client.from('mon_user_state').select('sync_version,profile,learning_state,updated_at').eq('user_id',session.user.id).maybeSingle();if(error)throw error;return data}
