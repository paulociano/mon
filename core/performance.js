// MON local performance telemetry
// Never sends data anywhere. Keeps a small rolling sample in this browser only.
const MON_PERF_KEY='mon_perf_v1';
const MON_PERF_LIMIT=40;
function perfNow(){return performance?.now?.()??Date.now()}
function perfStart(){return perfNow()}
function perfRead(){
 try{return JSON.parse(localStorage.getItem(MON_PERF_KEY)||'[]')}catch{return[]}
}
function perfWrite(entry){
 const write=()=>{try{const rows=perfRead();rows.unshift(entry);localStorage.setItem(MON_PERF_KEY,JSON.stringify(rows.slice(0,MON_PERF_LIMIT)))}catch{}};
 if('requestIdleCallback'in window)requestIdleCallback(write,{timeout:1200});else setTimeout(write,0);
}
function perfEnd(name,start,meta={}){
 const duration=Math.max(0,Math.round((perfNow()-start)*10)/10);
 perfWrite({name,duration,at:Date.now(),...meta});return duration;
}
function performanceSnapshot(){
 const rows=perfRead(),by={};
 for(const r of rows){(by[r.name]??=[]).push(r.duration)}
 const summary={};
 for(const [name,vals] of Object.entries(by)){const sorted=[...vals].sort((a,b)=>a-b);summary[name]={samples:vals.length,median:sorted[Math.floor(sorted.length/2)]||0,p95:sorted[Math.min(sorted.length-1,Math.floor(sorted.length*.95))]||0}}
 return summary;
}
(function(){
 const boot=perfStart();
 addEventListener('load',()=>perfEnd('boot:load',boot,{navType:performance.getEntriesByType?.('navigation')?.[0]?.type||'unknown'}),{once:true});
 if('PerformanceObserver'in window){
   try{const obs=new PerformanceObserver(list=>{for(const e of list.getEntries())if(e.duration>=50)perfWrite({name:'longtask',duration:Math.round(e.duration*10)/10,at:Date.now()})});obs.observe({type:'longtask',buffered:true})}catch{}
 }
})();

function performanceResourceSnapshot(){
 const rows=performance.getEntriesByType?.('resource')||[];
 return rows.filter(x=>x.name.startsWith(location.origin)).map(x=>({name:x.name,duration:Math.round(x.duration*10)/10,transferSize:x.transferSize||0,decodedBodySize:x.decodedBodySize||0}));
}
(function loadPerformanceLabWhenRequested(){
 try{
  if(!new URLSearchParams(location.search).has('debug'))return;
  const css=document.createElement('link');css.rel='stylesheet';css.href='./features/performance-lab.css';document.head.appendChild(css);
  const js=document.createElement('script');js.src='./features/performance-lab.js';js.defer=true;document.head.appendChild(js);
 }catch{}
})();
