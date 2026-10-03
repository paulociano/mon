// MON Performance Lab · optional, local-only diagnostics
(function(){
 const fmt=n=>Number.isFinite(n)?n.toFixed(1)+' ms':'—';
 async function cacheStatus(){
   if(!('caches'in window))return {available:false,entries:0};
   try{const keys=await caches.keys(),cache=keys.length?await caches.open(keys[0]):null,reqs=cache?await cache.keys():[];return {available:true,name:keys[0]||'—',entries:reqs.length}}catch{return {available:false,entries:0}}
 }
 function resourceRows(){
   const rows=performance.getEntriesByType?.('resource')||[];
   return rows.filter(x=>x.name.startsWith(location.origin)).map(x=>({name:x.name.split('/').pop(),duration:x.duration,transfer:x.transferSize||0})).sort((a,b)=>b.duration-a.duration).slice(0,8);
 }
 async function render(){
   const host=document.getElementById('monPerfLab');if(!host)return;
   const snapshot=performanceSnapshot(),cache=await cacheStatus(),resources=resourceRows(),longs=perfRead().filter(x=>x.name==='longtask');
   const metricRows=Object.entries(snapshot).filter(([k])=>k!=='longtask').sort((a,b)=>b[1].p95-a[1].p95);
   host.innerHTML=`<div class="perf-lab-head"><div><span>MON · Performance Lab</span><b>Diagnóstico local</b></div><button id="perfLabClose" aria-label="Fechar Performance Lab">×</button></div>
   <div class="perf-lab-grid"><div><span>service worker</span><b>${navigator.serviceWorker?.controller?'ativo':'não controlando'}</b></div><div><span>cache</span><b>${cache.available?cache.entries+' itens':'indisponível'}</b></div><div><span>long tasks</span><b>${longs.length}</b></div><div><span>rede</span><b>${navigator.connection?.effectiveType||'—'}</b></div></div>
   <h4>mediana / p95</h4><div class="perf-lab-table">${metricRows.map(([k,v])=>`<div><span>${k}</span><b>${fmt(v.median)}</b><strong>${fmt(v.p95)}</strong></div>`).join('')||'<p>Use o app por alguns instantes para coletar amostras.</p>'}</div>
   <h4>recursos mais lentos desta navegação</h4><div class="perf-lab-resources">${resources.map(r=>`<div><span>${r.name}</span><b>${fmt(r.duration)}</b><small>${r.transfer?Math.round(r.transfer/1024)+' KB':'cache/0 KB'}</small></div>`).join('')||'<p>Nenhum recurso medido.</p>'}</div>
   <div class="perf-lab-actions"><button id="perfLabRefresh">atualizar</button><button id="perfLabReset">limpar histórico</button></div>`;
   document.getElementById('perfLabClose').onclick=()=>host.remove();
   document.getElementById('perfLabRefresh').onclick=render;
   document.getElementById('perfLabReset').onclick=()=>{localStorage.removeItem(MON_PERF_KEY);render()};
 }
 const host=document.createElement('aside');host.id='monPerfLab';host.className='perf-lab';host.setAttribute('aria-label','Performance Lab');document.body.appendChild(host);render();
})();