const CACHE='mon-japanese-os-v31';
const CORE=['./','./index.html','./styles.css','./data/course-content.js','./core/state.js','./core/review-scheduler.js','./core/performance.js','./core/home-coach.js','./app.js','./manifest.json','./icon.svg','./assets/brand/mon-mark.svg','./assets/brand/mon-lockup.svg','./assets/brand/kitsu-mascot.webp','./assets/scene/mon-home-banner.webp','./assets/scene/mon-sidebar-bg.webp'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    if(self.registration.navigationPreload)await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
});

async function cachePut(request,response){
  if(!response||!response.ok||new URL(request.url).origin!==self.location.origin)return response;
  const cache=await caches.open(CACHE);await cache.put(request,response.clone());return response;
}
async function networkFirstNavigation(event){
  try{
    const preload=await event.preloadResponse;
    const response=preload||await fetch(event.request);
    return cachePut(event.request,response);
  }catch{
    return (await caches.match(event.request))||(await caches.match('./index.html'));
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
