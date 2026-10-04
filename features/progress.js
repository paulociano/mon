// Functional Mastery Graph · loaded only on Progress
const FUNCTIONAL_MASTERY_META=[
 ['repair','Reparar','manter a interação quando algo quebra'],
 ['confirm','Confirmar','checar horário, condição e entendimento'],
 ['explain','Explicar','dar contexto, causa e motivo'],
 ['negotiate','Negociar','propor alternativa, restrição ou decisão'],
 ['summarize','Resumir','devolver o ponto principal e próximo passo']
];
function functionalMasteryCards(){
 return FUNCTIONAL_MASTERY_META.map(([id,name,desc])=>{const x=state.functionalMastery?.[id],score=Number(x?.score||0),attempts=Number(x?.attempts||0);return{id,name,desc,score:attempts?score:0,attempts}})
}
function renderFunctionalMastery(){
 const grid=document.getElementById('progressEvidenceGrid');if(!grid)return;
 grid.querySelectorAll('[data-functional-mastery]').forEach(x=>x.remove());
 const cards=functionalMasteryCards();
 grid.insertAdjacentHTML('beforeend',cards.map(x=>`<article class="progress-evidence" data-functional-mastery="${x.id}"><span>Função · ${x.name}</span><b>${x.attempts?x.score+'%':'—'}</b><small>${x.desc}</small><i><em style="width:${x.score}%"></em></i></article>`).join(''));
}
const renderProgressHubBase=renderProgressHub;
renderProgressHub=function(){renderProgressHubBase();renderFunctionalMastery()};

function renderLearningEvidence(){
 const grid=document.getElementById('progressEvidenceGrid');if(!grid||typeof learningEvidenceSummary!=='function')return;
 grid.querySelectorAll('[data-learning-evidence]').forEach(x=>x.remove());
 const s=learningEvidenceSummary(),fmt=x=>x===null?'—':x+'%';
 const cards=[
  ['retention','Retenção',fmt(s.retentionAccuracy),s.retentionAttempts+' reencontros após espaçamento'],
  ['transfer','Transferência',fmt(s.transferAccuracy),s.transferAttempts+' tentativas em produção/contexto'],
  ['independent','Sem pistas',fmt(s.independentAccuracy),s.independentAttempts+' tentativas independentes'],
  ['autonomy','Autonomia',fmt(s.autonomyAverage),s.missionCompletions+' missões observadas']
 ];
 grid.insertAdjacentHTML('beforeend',cards.map(([id,name,value,desc])=>`<article class="progress-evidence" data-learning-evidence="${id}"><span>Evidência · ${name}</span><b>${value}</b><small>${desc}</small><i><em style="width:${parseInt(value)||0}%"></em></i></article>`).join(''));
}
const renderProgressHubFunctional=renderProgressHub;
renderProgressHub=function(){renderProgressHubFunctional();renderLearningEvidence()};
