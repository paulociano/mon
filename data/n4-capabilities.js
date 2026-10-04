// MON N4 capability contract
// Cross-cutting functional outcomes shared by curriculum, missions and progress.

const N4_CAPABILITIES={
 repair:{label:'Reparar',outcome:'manter a interação quando algo quebra',evidence:['pedir repetição ou esclarecimento','reformular sem abandonar o objetivo']},
 confirm:{label:'Confirmar',outcome:'checar entendimento, condição ou próximo passo',evidence:['repetir dado crítico','confirmar decisão, prazo, valor ou sequência']},
 explain:{label:'Explicar',outcome:'dar contexto suficiente para a outra pessoa agir',evidence:['descrever situação, causa ou restrição','explicar sentido com palavras próprias']},
 negotiate:{label:'Negociar',outcome:'ajustar plano, prioridade ou alternativa',evidence:['propor alternativa viável','combinar condição, prazo, horário ou rota']},
 summarize:{label:'Resumir',outcome:'devolver ponto principal e próximo passo',evidence:['separar decisão de detalhe','encerrar com síntese operacional']}
};

const N4_UNIT_CAPABILITIES={
 'n4-work-priority':['confirm','negotiate'],
 'n4-services-process':['confirm','repair'],
 'n4-health-context':['explain','confirm'],
 'n4-social-plans':['negotiate','explain'],
 'n4-urban-reading':['explain','summarize'],
 'n4-open-conversation':['repair','explain'],

 'n4-social-invite':['negotiate','confirm'],
 'n4-social-apology':['explain','negotiate'],
 'n4-social-favors':['explain','negotiate'],
 'n4-social-smalltalk':['repair','explain'],
 'n4-social-experience':['explain','summarize'],
 'n4-social-planning':['negotiate','confirm'],
 'n4-social-hosting':['negotiate','confirm'],
 'n4-social-suggestion':['explain','negotiate'],
 'n4-social-multitask':['explain','summarize'],
 'n4-social-checkpoint':['repair','negotiate','confirm'],

 'n4-reading-notices':['summarize','confirm'],
 'n4-reading-train':['summarize','negotiate'],
 'n4-reading-housing':['summarize','confirm'],
 'n4-reading-delivery':['summarize','negotiate'],
 'n4-reading-menu':['confirm','summarize'],
 'n4-reading-interface':['summarize','confirm'],
 'n4-reading-bank':['confirm','summarize'],
 'n4-reading-terms':['repair','summarize'],
 'n4-reading-emergency':['confirm','summarize'],
 'n4-reading-checkpoint':['explain','summarize'],

 'n4-convo-problem':['explain','repair'],
 'n4-convo-compare':['explain','negotiate'],
 'n4-convo-story':['explain','summarize'],
 'n4-convo-opinion':['explain','negotiate'],
 'n4-convo-hearsay':['explain','confirm'],
 'n4-convo-lost':['explain','repair'],
 'n4-convo-phone':['repair','confirm'],
 'n4-convo-work-adjust':['explain','negotiate','confirm'],
 'n4-convo-summary':['summarize','confirm'],
 'n4-autonomy-final':['repair','confirm','explain','negotiate','summarize']
};

function n4CapabilityContract(unitOrId){
 const id=typeof unitOrId==='string'?unitOrId:unitOrId?.id;
 return (N4_UNIT_CAPABILITIES[id]||[]).map(id=>({id,...N4_CAPABILITIES[id]}));
}
function applyN4CapabilityContracts(){
 const units=coursePacks?.N4?.units||[];
 for(const unit of units){
  const ids=N4_UNIT_CAPABILITIES[unit.id];
  if(ids)unit.capabilities=[...ids];
 }
 return units;
}
function n4CapabilityEvidence(state={},capability){
 const x=state.functionalMastery?.[capability]||{};
 return {capability,attempts:Number(x.attempts||0),successes:Number(x.successes||0),score:Number(x.score||0),lastAt:Number(x.lastAt||0)};
}
function n4CapabilityReadiness(state={},capability,{minAttempts=2,minScore=65}={}){
 const e=n4CapabilityEvidence(state,capability);
 return {...e,ready:e.attempts>=minAttempts&&e.score>=minScore,minAttempts,minScore};
}
function n4UnitCapabilityReadiness(unit,state={},options){
 const required=n4CapabilityContract(unit).map(x=>n4CapabilityReadiness(state,x.id,options));
 return {unitId:unit?.id||null,required,ready:required.length>0&&required.every(x=>x.ready)};
}
