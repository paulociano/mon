const LEARNING_EVIDENCE_LIMIT=600;
const RETENTION_MIN_MS=20*60*60*1000;

function learningEvidenceState(){
 state.learningEvidence=state.learningEvidence||{events:[]};
 if(!Array.isArray(state.learningEvidence.events))state.learningEvidence.events=[];
 return state.learningEvidence;
}
function learningEvidenceEvent(input={}){
 const at=Number(input.at||Date.now());
 const event={
  at,
  source:String(input.source||'learning'),
  kind:String(input.kind||'attempt'),
  concept:input.concept||null,
  dimension:input.dimension||null,
  method:input.method||null,
  ok:typeof input.ok==='boolean'?input.ok:null,
  hintLevel:Number.isFinite(input.hintLevel)?input.hintLevel:(input.hintUsed?1:0),
  spacingMs:Number.isFinite(input.spacingMs)&&input.spacingMs>=0?Math.round(input.spacingMs):null,
  context:input.context||null,
  capability:input.capability||null,
  autonomy:Number.isFinite(input.autonomy)?Math.max(0,Math.min(100,Math.round(input.autonomy))):null
 };
 const s=learningEvidenceState();s.events.push(event);
 if(s.events.length>LEARNING_EVIDENCE_LIMIT)s.events.splice(0,s.events.length-LEARNING_EVIDENCE_LIMIT);
 return event;
}
function recordLearningEvidence(input={}){
 const event=learningEvidenceEvent(input);
 return event;
}
function learningEvidenceSummary(events=learningEvidenceState().events){
 const attempts=events.filter(x=>x.kind==='attempt'&&typeof x.ok==='boolean');
 const independent=attempts.filter(x=>(x.hintLevel||0)===0);
 const retention=attempts.filter(x=>Number(x.spacingMs||0)>=RETENTION_MIN_MS);
 const transfer=attempts.filter(x=>x.dimension==='transfer'||x.dimension==='produce'||x.context==='transfer'||x.context==='mission');
 const missions=events.filter(x=>x.kind==='mission_complete'&&Number.isFinite(x.autonomy));
 const pct=rows=>rows.length?Math.round(rows.filter(x=>x.ok).length/rows.length*100):null;
 const avg=rows=>rows.length?Math.round(rows.reduce((n,x)=>n+Number(x.autonomy||0),0)/rows.length):null;
 return {
  attempts:attempts.length,
  accuracy:pct(attempts),
  independentAttempts:independent.length,
  independentAccuracy:pct(independent),
  retentionAttempts:retention.length,
  retentionAccuracy:pct(retention),
  transferAttempts:transfer.length,
  transferAccuracy:pct(transfer),
  missionCompletions:missions.length,
  autonomyAverage:avg(missions)
 };
}
function learningEvidenceByConcept(concept){
 return learningEvidenceState().events.filter(x=>x.concept===concept);
}
