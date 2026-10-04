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
 const grid=document.getElementById('progressEvidenceGrid');if(!grid)return;
 grid.querySelectorAll('[data-learning-evidence]').forEach(x=>x.remove());
 if(typeof learningMetricsSnapshot!=='function')return;
 const s=learningMetricsSnapshot(state),fmt=x=>x.value===null?'—':x.value+(x.unit==='%'?'%':'');
 const status={empty:'sem dados',early:'amostra inicial',stale:'dados antigos',ready:'evidência suficiente'};
 grid.insertAdjacentHTML('beforeend',s.metrics.map(x=>`<article class="progress-evidence" data-learning-evidence="${x.id}"><span>Métrica · ${x.label}</span><b>${fmt(x)}</b><small>${x.samples} observações · ${status[x.status]||x.status}</small><i><em style="width:${x.unit==='%'?(x.value||0):Math.min(100,x.samples*10)}%"></em></i></article>`).join(''));
}
const renderProgressHubFunctional=renderProgressHub;
renderProgressHub=function(){renderProgressHubFunctional();renderLearningEvidence()};
