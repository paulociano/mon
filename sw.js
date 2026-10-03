const CACHE='mon-japanese-os-v14';
const CORE=['./','./index.html','./styles.css','./data/course-content.js','./data/content-packs.js','./core/state.js','./core/review-scheduler.js','./core/mistakes.js','./core/mastery-graph.js','./core/learning-methods.js','./core/course-engine.js','./core/progression-engine.js','./features/foundation.js','./features/session.js','./app.js','./manifest.json','./icon.svg','./assets/brand/mon-mark.svg','./assets/brand/mon-lockup.svg','./assets/scene/mon-home-banner.webp','./assets/scene/mon-sidebar-bg.webp'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    if(self.registration.navigationPreload)await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
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
  event.respondWith(staleWhileRevalidate(event));
});
