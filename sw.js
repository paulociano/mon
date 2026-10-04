const CACHE_PREFIX='mon-japanese-os-';
const CACHE_VERSION='v35';
const CRITICAL_SHELL_UPGRADE=CACHE_VERSION==='v35';
const CACHE=CACHE_PREFIX+CACHE_VERSION;
const CORE=['./','./index.html','./styles.css','./data/course-content.js','./core/state.js','./core/review-scheduler.js','./core/performance.js','./core/home-coach.js','./app.js','./manifest.json','./icon.svg','./assets/brand/mon-mark.svg','./assets/brand/mon-lockup.svg','./assets/brand/kitsu-mascot.webp','./assets/scene/mon-home-banner.webp','./assets/scene/mon-sidebar-bg.webp'];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(CORE);
    if(CRITICAL_SHELL_UPGRADE)await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));
    if(self.registration.navigationPreload)await self.registration.navigationPreload.enable();
    await self.clients.claim();
    if(CRITICAL_SHELL_UPGRADE){
      const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
      await Promise.all(clients.map(client=>{
        try{
          const url=new URL(client.url);
          const view=url.searchParams.get('view');
          if(!view||view==='home')return client.navigate(client.url);
        }catch(e){}
        return null;
      }));
    }
  })());
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
  if(event.data?.type==='MON_SW_STATUS')event.source?.postMessage?.({type:'MON_SW_STATUS',cache:CACHE,version:CACHE_VERSION});
});

async function cachePut(request,response){
  if(!response||!response.ok||new URL(request.url).origin!==self.location.origin)return response;
  const cache=await caches.open(CACHE);await cache.put(request,response.clone());return response;
}
async function networkFirstNavigation(event){
  try{
    const preload=await event.preloadResponse;
    const response=preload?.ok?preload:await fetch(event.request);
    if(!response?.ok)throw new Error('navigation response not ok');
    return cachePut(event.request,response);
  }catch{
    const shell=(await caches.match('./index.html'))||(await caches.match('./'));
    if(shell)return shell;
    try{return await fetch('./index.html',{cache:'no-cache'})}catch{return new Response('MON offline shell unavailable',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}
  }
}
async function networkFirstAsset(event){
  try{
    const response=await fetch(event.request,{cache:'no-cache'});
    return cachePut(event.request,response);
  }catch{
    return (await caches.match(event.request))||Response.error();
  }
}
async function staleWhileRevalidate(event){
  const cached=await caches.match(event.request);
  const network=fetch(event.request).then(res=>cachePut(event.request,res)).catch(()=>null);
  if(cached){event.waitUntil(network);return cached}
  return (await network)||Response.error();
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){event.respondWith(networkFirstNavigation(event));return}
  if(event.request.destination==='script'||event.request.destination==='style'){event.respondWith(networkFirstAsset(event));return}
  event.respondWith(staleWhileRevalidate(event));
});
