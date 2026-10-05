// Public Supabase browser configuration.
// Privileged server credentials must stay server-side.
// The publishable key is public client material; MON resolves it from runtime config,
// a deploy-time meta tag, or the public-config Edge Function.
const monCloudRuntime=globalThis.MON_CLOUD_RUNTIME_CONFIG||{};
const monCloudMetaKey=globalThis.document?.querySelector?.('meta[name="mon-supabase-publishable-key"]')?.content?.trim()||'';
const monCloudBaseUrl=monCloudRuntime.url||'https://gpmobddlexssivfxzzjw.supabase.co';
globalThis.MON_CLOUD_CONFIG=Object.freeze({
 url:monCloudBaseUrl,
 publishableKey:monCloudRuntime.publishableKey||monCloudMetaKey||''
});
let monCloudConfigPromise=null;
async function monEnsureCloudConfig(){
 const current=globalThis.MON_CLOUD_CONFIG||{};
 if(current.publishableKey)return current;
 if(monCloudConfigPromise)return monCloudConfigPromise;
 monCloudConfigPromise=(async()=>{
  const res=await fetch(monCloudBaseUrl+'/functions/v1/public-config',{headers:{Accept:'application/json'}});
  if(!res.ok)throw new Error('Configuração cloud indisponível');
  const data=await res.json();
  if(data?.url!==monCloudBaseUrl||!/^sb_publishable_/.test(data?.publishableKey||''))throw new Error('Configuração cloud inválida');
  globalThis.MON_CLOUD_CONFIG=Object.freeze({url:data.url,publishableKey:data.publishableKey});
  return globalThis.MON_CLOUD_CONFIG;
 })().catch(err=>{monCloudConfigPromise=null;throw err});
 return monCloudConfigPromise;
}
