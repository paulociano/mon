(()=>{
const KEY='mon-runtime-health-v1',MAX_AGE=7*24*60*60*1000,MAX_EVENTS=50;
const release=document.querySelector('meta[name="mon-release"]')?.content||'unknown';
function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}}
function write(events){try{localStorage.setItem(KEY,JSON.stringify(events))}catch{}}
function record(type){
 const now=Date.now(),events=read().filter(e=>Number(e.at)>=now-MAX_AGE);
 events.push({type:String(type),at:now,release});
 write(events.slice(-MAX_EVENTS));
}
function summary(){
 const now=Date.now(),events=read().filter(e=>Number(e.at)>=now-MAX_AGE),counts={};
 for(const e of events)counts[e.type]=(counts[e.type]||0)+1;
 return {release,windowDays:7,total:events.length,counts,lastEventAt:events.at(-1)?.at||null};
}
addEventListener('error',event=>record(event instanceof ErrorEvent?'js-error':'resource-error'),true);
addEventListener('unhandledrejection',()=>record('promise-rejection'));
globalThis.MON_RUNTIME_HEALTH=Object.freeze({record,summary,clear:()=>{try{localStorage.removeItem(KEY)}catch{}}});
write(read().filter(e=>Number(e.at)>=Date.now()-MAX_AGE).slice(-MAX_EVENTS));
})();