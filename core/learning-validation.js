// MON Learning Validation
// Longitudinal learning evidence. Descriptive only: no causal claims.

const VALIDATION_WINDOWS=[
 {id:'d1',label:'1d+',minMs:20*60*60*1000},
 {id:'d3',label:'3d+',minMs:60*60*60*1000},
 {id:'d7',label:'7d+',minMs:144*60*60*1000}
];
const VALIDATION_MIN_TREND_SIDE=3;

function validationPct(rows,predicate=x=>x.ok){
 return rows.length?Math.round(rows.filter(predicate).length/rows.length*100):null;
}
function validationEvidenceStatus(samples){
 if(!samples)return 'empty';
 if(samples<3)return 'sparse';
 if(samples<8)return 'emerging';
 return 'observed';
}
function validationSplit(rows){
 const sorted=[...rows].sort((a,b)=>Number(a.at||0)-Number(b.at||0));
 if(sorted.length<VALIDATION_MIN_TREND_SIDE*2)return {early:[],recent:[]};
 const size=Math.max(VALIDATION_MIN_TREND_SIDE,Math.floor(sorted.length/2));
 return {early:sorted.slice(0,size),recent:sorted.slice(-size)};
}
function validationTrend(rows,valueFn){
 const {early,recent}=validationSplit(rows);
 if(!early.length||!recent.length)return {status:'insufficient',early:null,recent:null,delta:null,samples:rows.length};
 const a=valueFn(early),b=valueFn(recent),delta=a===null||b===null?null:b-a;
 return {status:'directional',early:a,recent:b,delta,samples:rows.length};
}
function retentionValidation(events=[]){
 const attempts=events.filter(x=>x.kind==='attempt'&&typeof x.ok==='boolean');
 return VALIDATION_WINDOWS.map(w=>{
  const rows=attempts.filter(x=>Number(x.spacingMs||0)>=w.minMs);
  return {id:w.id,label:w.label,value:validationPct(rows),samples:rows.length,status:validationEvidenceStatus(rows.length),minSpacingMs:w.minMs};
 });
}
function contrastRetentionValidation(learnerState={},now=Date.now()){
 const rows=Object.values(learnerState.grammarConfusions||{}).filter(x=>Number(x.errors||0)>0);
 const windows=VALIDATION_WINDOWS.map(w=>{
  const eligible=rows.filter(x=>Number(x.lastErrorAt||0)>0&&now-Number(x.lastErrorAt)>=w.minMs);
  const passed=eligible.filter(x=>!!x.retention?.[w.id]);
  return {id:w.id,label:w.label,value:eligible.length?Math.round(passed.length/eligible.length*100):null,
   samples:eligible.length,status:validationEvidenceStatus(eligible.length),retained:passed.length};
 });
 return {pairs:rows.length,retained:rows.filter(x=>!!x.retention?.d7).length,pending:rows.filter(x=>!x.retention?.d7).length,windows};
}
function hintDependenceValidation(events=[]){
 const rows=events.filter(x=>x.kind==='attempt'&&typeof x.ok==='boolean');
 const hinted=r=>Number(r.hintLevel||0)>0;
 const value=validationPct(rows,hinted);
 const trend=validationTrend(rows,x=>validationPct(x,hinted));
 return {value,samples:rows.length,status:validationEvidenceStatus(rows.length),trend};
}
function transferValidation(events=[]){
 const rows=events.filter(x=>x.kind==='attempt'&&typeof x.ok==='boolean'&&(x.dimension==='transfer'||x.dimension==='produce'||x.context==='transfer'||x.context==='mission'));
 return {value:validationPct(rows),samples:rows.length,status:validationEvidenceStatus(rows.length),trend:validationTrend(rows,validationPct)};
}
function autonomyValidation(events=[]){
 const rows=events.filter(x=>x.kind==='mission_complete'&&Number.isFinite(Number(x.autonomy)));
 const avg=x=>x.length?Math.round(x.reduce((n,r)=>n+Number(r.autonomy||0),0)/x.length):null;
 return {value:avg(rows),samples:rows.length,status:validationEvidenceStatus(rows.length),trend:validationTrend(rows,avg)};
}
function recurrentErrorValidation(events=[]){
 const mistakeEvents=events.filter(x=>(x.kind==='mistake'||x.kind==='mistake_recovery')&&x.concept);
 if(mistakeEvents.length){
  const counts={};mistakeEvents.forEach(x=>{if(x.kind==='mistake')counts[x.concept]=(counts[x.concept]||0)+1});
  const recurrent=new Set(Object.entries(counts).filter(([,n])=>n>=2).map(([k])=>k));
  const relevant=mistakeEvents.filter(x=>recurrent.has(x.concept));
  const errorRate=x=>x.length?Math.round(x.filter(r=>r.kind==='mistake').length/x.length*100):null;
  return {concepts:recurrent.size,value:errorRate(relevant),samples:relevant.length,status:validationEvidenceStatus(relevant.length),trend:validationTrend(relevant,errorRate),source:'mistake-events'};
 }
 const rows=events.filter(x=>x.kind==='attempt'&&typeof x.ok==='boolean'&&x.concept);
 const wrongBy={};rows.forEach(x=>{if(!x.ok)(wrongBy[x.concept]??=[]).push(x)});
 const recurrent=new Set(Object.entries(wrongBy).filter(([,v])=>v.length>=2).map(([k])=>k));
 const relevant=rows.filter(x=>recurrent.has(x.concept)),errorRate=x=>x.length?100-validationPct(x):null;
 return {concepts:recurrent.size,value:errorRate(relevant),samples:relevant.length,status:validationEvidenceStatus(relevant.length),trend:validationTrend(relevant,errorRate),source:'attempt-fallback'};
}
function learningValidationReport(state={},events=null,now=Date.now()){
 const rows=events||((typeof learningEvidenceState==='function'?learningEvidenceState().events:[])||[]);
 const retention=retentionValidation(rows),contrastRetention=contrastRetentionValidation(state,now),hints=hintDependenceValidation(rows),transfer=transferValidation(rows),autonomy=autonomyValidation(rows),errors=recurrentErrorValidation(rows);
 const observed=[
  ...retention.map(x=>x.status==='observed'),
  hints.status==='observed',transfer.status==='observed',autonomy.status==='observed',errors.status==='observed'
 ].filter(Boolean).length;
 return {
  generatedAt:now,
  retention,
  contrastRetention,
  hintDependence:hints,
  transfer,
  autonomy,
  recurrentErrors:errors,
  coverage:{observed,total:retention.length+4},
  caveat:'Tendências observacionais locais; não demonstram causalidade.'
 };
}
