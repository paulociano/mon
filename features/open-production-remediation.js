// MON open-production remediation · lazy with lesson
function recordProductionGaps(exercise,result){
 state.productionGaps=state.productionGaps||{};
 for(const label of result.missing||[]){const old=state.productionGaps[label]||{count:0,recovered:0};state.productionGaps[label]={...old,count:old.count+1,lastAt:Date.now(),unitId:exercise._unitId||null}}
}
function recoverProductionGaps(exercise){
 state.productionGaps=state.productionGaps||{};
 for(const label of exercise._gapLabels||[]){const old=state.productionGaps[label]||{count:0,recovered:0};state.productionGaps[label]={...old,recovered:(old.recovered||0)+1,lastRecoveredAt:Date.now()}}
}
function buildOpenRemediation(exercise,result){
 if(exercise._openRetry||!result.missing?.length)return [];
 const labels=exercise.assessment?.labels||[],groups=exercise.assessment?.groups||[];
 const gapIndex=labels.findIndex(x=>result.missing.includes(x));if(gapIndex<0)return [];
 const accepted=(groups[gapIndex]||[]).filter(Boolean),target=accepted[0];if(!target)return [];
 const label=labels[gapIndex]||'elemento funcional',model=exercise.target||'',normalizedTarget=normalizeJP(model),token=accepted.find(x=>normalizedTarget.includes(normalizeJP(x)))||target;
 const clozeTarget=model&&token?model.replace(token,'＿＿'):model;
 const drills=[
  {type:'recall',prompt:`Microtreino · recupere o elemento “${label}”.`,cue:label,target,accepted,why:`Este elemento faltou na sua resposta anterior: ${label}.`,method:'recall',_openRepair:true,_gapLabels:[label],_unitId:exercise._unitId},
  clozeTarget!==model?{type:'cloze',prompt:`Microtreino · reinsira “${label}” no contexto.`,jp:clozeTarget,target:token,accepted:[token,...accepted],why:'Recoloque a peça funcional dentro da frase completa.',method:'transfer',_openRepair:true,_gapLabels:[label],_unitId:exercise._unitId}:null
 ].filter(Boolean);
 const retry={...exercise,prompt:'Tente novamente a mesma situação, agora sem copiar o modelo.',_openRetry:true,_gapLabels:[...(result.missing||[])],why:'Retry imediato: preserve a intenção e recupere os elementos que faltaram.'};
 return [...drills,retry];
}
