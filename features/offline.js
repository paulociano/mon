// Download only the current learning tier; never fetch account or third-party data.
function monOfflineFiles(){
 const names=['session','foundation','lesson','practice','progress'];
 const level=contentPackLevelForDay();
 return [...new Set([...LEARNING_RUNTIME_SCRIPTS,...CONTENT_PACK_SCRIPTS[level],...(level==='N5'?[]:[N4_CAP]),
  ...names.flatMap(n=>FEATURE_RUNTIME_SCRIPTS[n]||[]),...names.flatMap(n=>FEATURE_RUNTIME_STYLES[n]||[]),
  './features/grammar-notebook.js','./features/grammar-notebook.css'])];
}
async function monOfflineCache(){
 if(!navigator.serviceWorker?.controller)throw new Error('Reabra o MON com internet para ativar o modo offline.');
 return new Promise((resolve,reject)=>{
  const done=e=>{if(e.source!==navigator.serviceWorker.controller||e.data?.type!=='MON_SW_STATUS')return;clearTimeout(timer);navigator.serviceWorker.removeEventListener('message',done);resolve(e.data.cache)};
  const timer=setTimeout(()=>{navigator.serviceWorker.removeEventListener('message',done);reject(new Error('Não foi possível verificar o modo offline.'))},5000);
  navigator.serviceWorker.addEventListener('message',done);navigator.serviceWorker.controller.postMessage({type:'MON_SW_STATUS'});
 });
}
async function monOfflineReady(){
 const cache=await caches.open(await monOfflineCache());
 return (await Promise.all(monOfflineFiles().map(file=>cache.match(new URL(file,location.href))))).every(Boolean);
}
async function prepareMonOffline(){
 const button=document.getElementById('prepareOffline'),status=document.getElementById('offlineStatus');
 button.disabled=true;status.textContent='Baixando o estudo do seu nível…';
 try{
  const cache=await caches.open(await monOfflineCache());
  for(const file of monOfflineFiles()){
   const url=new URL(file,location.href),response=await fetch(url,{cache:'reload'});
   if(!response.ok)throw new Error('Download interrompido. Conecte-se e tente novamente.');
   await cache.put(url,response);
  }
  if(!await monOfflineReady())throw new Error('O estudo não ficou completo. Tente novamente.');
  status.textContent='Lições, sessão guiada e prática do nível atual disponíveis offline. Áudio depende das vozes do dispositivo; vídeos e reconhecimento de voz podem precisar de internet.';
 }catch(e){status.textContent=e.message}finally{button.disabled=false}
}
async function renderOfflinePanel(){
 let box=document.getElementById('offlinePanel');
 if(!box){box=document.createElement('section');box.id='offlinePanel';box.className='user-card';box.innerHTML='<h3>Estudar sem internet</h3><p id="offlineStatus" role="status" aria-live="polite">Verificando o conteúdo neste dispositivo…</p><div class="user-actions"><button id="prepareOffline" class="user-save" type="button">preparar estudo offline</button></div>';document.querySelector('.user-grid').appendChild(box);box.querySelector('button').onclick=prepareMonOffline}
 try{document.getElementById('offlineStatus').textContent=await monOfflineReady()?'Estudo do nível atual disponível offline. Áudio e serviços externos podem depender de conexão.':'Prepare suas lições, sessão guiada e prática enquanto estiver conectado.'}catch(e){document.getElementById('offlineStatus').textContent=e.message}
}
