// MON Learning Metrics
// Semantic metrics derived from local state + Learning Evidence.
// Metrics expose value, denominator and confidence status; they do not imply causality.

const LEARNING_METRIC_MIN_SAMPLE=3;
const LEARNING_METRIC_STALE_MS=14*24*60*60*1000;

function metricPct(successes,total){
 return total?Math.round(successes/total*100):null;
}
function metricStatus(samples,lastAt,now=Date.now()){
 if(!samples)return 'empty';
 if(samples<LEARNING_METRIC_MIN_SAMPLE)return 'early';
 if(lastAt&&now-lastAt>LEARNING_METRIC_STALE_MS)return 'stale';
 return 'ready';
}
function metricEnvelope(id,label,value,samples,lastAt,detail={},now=Date.now()){
 return {id,label,value,samples,lastAt:lastAt||null,status:metricStatus(samples,lastAt,now),...detail};
}
function learningMetricActivity(state={}){
 const sessions=Number(state.sessions||0),xp=Number(state.xp||0),streak=Number(state.streak||0);
 return metricEnvelope('activity','Atividade',sessions,sessions,Number(state.lastStudyDate?Date.parse(state.lastStudyDate):0)||null,{unit:'sessões',xp,streak});
}
function learningMetricRetention(events=[],now=Date.now()){
 const rows=events.filter(x=>x.kind==='attempt'&&typeof x.ok==='boolean'&&Number(x.spacingMs||0)>=RETENTION_MIN_MS);
 const lastAt=Math.max(0,...rows.map(x=>Number(x.at||0)));
 return metricEnvelope('retention','Retenção',metricPct(rows.filter(x=>x.ok).length,rows.length),rows.length,lastAt,{unit:'%',successes:rows.filter(x=>x.ok).length},now);
}
function learningMetricMastery(state={},now=Date.now()){
 const cells=[];
 for(const dims of Object.values(state.masteryEvidence||{}))for(const cell of Object.values(dims||{}))if(Number.isFinite(Number(cell?.score))&&Number(cell?.attempts||0)>0)cells.push(cell);
 const value=cells.length?Math.round(cells.reduce((n,x)=>n+Number(x.score||0),0)/cells.length):null;
 const lastAt=Math.max(0,...cells.map(x=>Number(x.lastAt||0)));
 return metricEnvelope('mastery','Domínio',value,cells.length,lastAt,{unit:'%',conceptCells:cells.length},now);
}
function learningMetricTransfer(events=[],now=Date.now()){
 const rows=events.filter(x=>x.kind==='attempt'&&typeof x.ok==='boolean'&&(x.dimension==='transfer'||x.dimension==='produce'||x.context==='transfer'||x.context==='mission'));
 const lastAt=Math.max(0,...rows.map(x=>Number(x.at||0)));
 return metricEnvelope('transfer','Transferência',metricPct(rows.filter(x=>x.ok).length,rows.length),rows.length,lastAt,{unit:'%',successes:rows.filter(x=>x.ok).length},now);
}
function learningMetricRepair(state={},now=Date.now()){
 const gaps=Object.values(state.productionGaps||{});
 const attempts=gaps.reduce((n,x)=>n+Number(x?.count||0),0);
 const recovered=gaps.reduce((n,x)=>n+Math.min(Number(x?.recovered||0),Number(x?.count||0)),0);
 const lastAt=Math.max(0,...gaps.map(x=>Number(x?.lastAt||0)));
 return metricEnvelope('repair','Reparo',metricPct(recovered,attempts),attempts,lastAt,{unit:'%',recovered},now);
}
function learningMetricAutonomy(events=[],now=Date.now()){
 const rows=events.filter(x=>x.kind==='mission_complete'&&Number.isFinite(x.autonomy)&&x.autonomy>=0&&x.autonomy<=100);
 const value=rows.length?Math.round(rows.reduce((n,x)=>n+Number(x.autonomy||0),0)/rows.length):null;
 const lastAt=Math.max(0,...rows.map(x=>Number(x.at||0)));
 return metricEnvelope('autonomy','Autonomia',value,rows.length,lastAt,{unit:'%',missions:rows.length},now);
}
function learningMetricsSnapshot(state={},events=null,now=Date.now()){
 const rows=events||((typeof learningEvidenceState==='function'?learningEvidenceState().events:[])||[]);
 const metrics=[
  learningMetricActivity(state),
  learningMetricRetention(rows,now),
  learningMetricMastery(state,now),
  learningMetricTransfer(rows,now),
  learningMetricRepair(state,now),
  learningMetricAutonomy(rows,now)
 ];
 const observed=metrics.filter(x=>x.samples>0),ready=metrics.filter(x=>x.status==='ready').length;
 return {metrics,coverage:{observed:observed.length,total:metrics.length,ready},generatedAt:now};
}
function learningMetricById(snapshot,id){
 return snapshot?.metrics?.find(x=>x.id===id)||null;
}
