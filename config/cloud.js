// Public Supabase browser configuration.
// Privileged server credentials must stay server-side.
// The publishable key is injected at deploy/runtime through a meta tag or MON_CLOUD_RUNTIME_CONFIG.
const monCloudRuntime=globalThis.MON_CLOUD_RUNTIME_CONFIG||{};
const monCloudMetaKey=globalThis.document?.querySelector?.('meta[name="mon-supabase-publishable-key"]')?.content?.trim()||'';
globalThis.MON_CLOUD_CONFIG=Object.freeze({
 url:monCloudRuntime.url||'https://gpmobddlexssivfxzzjw.supabase.co',
 publishableKey:monCloudRuntime.publishableKey||monCloudMetaKey||''
});
