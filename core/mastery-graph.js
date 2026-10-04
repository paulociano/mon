// MON Mastery Graph
// Tracks what the learner can do with a concept, not only whether a lesson was completed.

const MASTERY_DIMENSIONS=['recognize','recall','listen','transfer','produce'];

function masteryConceptId(exercise={}){
  if(exercise._reviewType&&exercise._reviewKey)return exercise._reviewType+':'+exercise._reviewKey;
  if(exercise.unitId)return 'unit:'+exercise.unitId;
  if(exercise._unitId)return 'unit:'+exercise._unitId;
  return null;
}
function masteryDimension(exercise={}){
  if(exercise.type==='listen'||exercise.type==='minimalPair'||exercise.type==='dictation')return 'listen';
  if(exercise.type==='recall')return 'recall';
  if(exercise.type==='cloze'||exercise.type==='transfer'||exercise.type==='wordbank')return 'transfer';
  if(exercise.type==='speak'||exercise.type==='roleplay')return 'produce';
  return 'recognize';
}
function masteryCell(concept,dimension){
  return state.masteryEvidence?.[concept]?.[dimension]||null;
}
function recordMasteryEvidence(exercise={},ok=false,meta={}){
  const concept=masteryConceptId(exercise);if(!concept)return null;
  const dimension=masteryDimension(exercise),now=Date.now();
  state.masteryEvidence=state.masteryEvidence||{};
  const conceptState=state.masteryEvidence[concept]||{};
  const old=conceptState[dimension]||{attempts:0,successes:0,hints:0,score:35};
  const clean=ok&&!meta.hintUsed;
  // EMA rewards independent retrieval more than hinted success and keeps recent evidence meaningful.
  const observation=clean?100:ok?72:0;
  const alpha=old.attempts<2?.42:.28;
  const score=Math.round(old.score*(1-alpha)+observation*alpha);
  conceptState[dimension]={
    attempts:old.attempts+1,
    successes:old.successes+(ok?1:0),
    hints:old.hints+(meta.hintUsed?1:0),
    score,lastAt:now
  };
  state.masteryEvidence[concept]=conceptState;
  if(typeof recordLearningEvidence==='function')recordLearningEvidence({source:'mastery',kind:'attempt',concept,dimension,method:exercise.method||exercise.type||null,ok,hintUsed:!!meta.hintUsed,spacingMs:old.lastAt?now-old.lastAt:null,context:dimension==='transfer'||dimension==='produce'?'transfer':'practice',at:now});
  return {concept,dimension,score};
}
function masteryScore(concept,dimension){
  return masteryCell(concept,dimension)?.score||0;
}
function conceptMastery(concept){
  const cells=state.masteryEvidence?.[concept]||{};
  const scores=MASTERY_DIMENSIONS.map(d=>cells[d]?.score).filter(x=>Number.isFinite(x));
  if(!scores.length)return 0;
  // Conservative aggregation: weak transfer/production keeps "knows it" from being overstated.
  const avg=scores.reduce((a,b)=>a+b,0)/scores.length;
  const floor=Math.min(...scores);
  return Math.round(avg*.65+floor*.35);
}
function conceptBreakdown(concept){
  return MASTERY_DIMENSIONS.map(d=>({dimension:d,score:masteryScore(concept,d),attempts:masteryCell(concept,d)?.attempts||0}));
}
function masteryWeakEdges(limit=8,conceptPrefix=null){
  const rows=[];
  for(const [concept,cells] of Object.entries(state.masteryEvidence||{})){
    if(conceptPrefix&&!concept.startsWith(conceptPrefix))continue;
    for(const dimension of MASTERY_DIMENSIONS){
      const cell=cells[dimension];if(!cell)continue;
      const confidence=Math.min(1,(cell.attempts||0)/3);
      rows.push({concept,dimension,score:cell.score,attempts:cell.attempts||0,priority:(100-cell.score)*(0.65+confidence*.35)});
    }
  }
  return rows.sort((a,b)=>b.priority-a.priority||a.score-b.score).slice(0,limit);
}
function masterySummary(){
  const concepts=Object.keys(state.masteryEvidence||{});
  const scores=concepts.map(conceptMastery);
  const strong=scores.filter(x=>x>=80).length,developing=scores.filter(x=>x>=50&&x<80).length,fragile=scores.filter(x=>x<50).length;
  return {concepts:concepts.length,strong,developing,fragile,average:scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0,weak:masteryWeakEdges(5)};
}
function unitConcepts(unit){
  if(!unit)return[];
  return [
    ...(unit.vocabulary||[]).map(x=>'vocabulary:'+x),
    ...(unit.grammar||[]).map(x=>'grammar:P:'+x),
    'unit:'+unit.id
  ];
}
function unitMasteryStatus(unit){
  if(!unit)return {status:'unknown',score:0,coverage:0,required:[]};
  const concepts=unitConcepts(unit),seen=concepts.filter(c=>state.masteryEvidence?.[c]);
  const scores=seen.map(conceptMastery);
  const score=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
  const required=(unit.mastery?.required||[]).map(key=>{
    const concept=(unit.vocabulary||[]).includes(key)?'vocabulary:'+key:(unit.grammar||[]).includes(key)?'grammar:P:'+key:null;
    return {key,concept,score:concept?conceptMastery(concept):0};
  });
  const coverage=concepts.length?Math.round(seen.length/concepts.length*100):0;
  const min=unit.mastery?.minAccuracy||80;
  const requiredReady=required.every(x=>x.score>=Math.max(55,min-20));
  const status=score>=min&&coverage>=60&&requiredReady?'mastered':coverage>=30?'reinforcing':'exposed';
  return {status,score,coverage,required};
}
function methodForWeakDimension(dimension){
  return {recognize:'discover',recall:'freeRecall',listen:'dictation',transfer:'transfer',produce:'roleplay'}[dimension]||null;
}
function masteryMethodHints(unit){
  const concepts=new Set(unitConcepts(unit));
  const weak=masteryWeakEdges(20).filter(x=>concepts.has(x.concept));
  return [...new Set(weak.map(x=>methodForWeakDimension(x.dimension)).filter(Boolean))].slice(0,3);
}

function unitMasteryGaps(unit,limit=6){
  if(!unit)return[];
  const concepts=unitConcepts(unit),required=new Set((unit.mastery?.required||[]).map(key=>{
    if((unit.vocabulary||[]).includes(key))return 'vocabulary:'+key;
    if((unit.grammar||[]).includes(key))return 'grammar:P:'+key;
    return null;
  }).filter(Boolean));
  const gaps=[];
  for(const concept of concepts){
    const cells=state.masteryEvidence?.[concept]||{};
    for(const dimension of MASTERY_DIMENSIONS){
      const cell=cells[dimension];
      if(!cell){
        if(required.has(concept)||concept.startsWith('unit:'))gaps.push({concept,dimension,score:0,attempts:0,priority:required.has(concept)?120:90,unseen:true});
      }else if(cell.score<70){
        gaps.push({concept,dimension,score:cell.score,attempts:cell.attempts||0,priority:(100-cell.score)+(required.has(concept)?25:0),unseen:false});
      }
    }
  }
  return gaps.sort((a,b)=>b.priority-a.priority||a.score-b.score).slice(0,limit);
}
