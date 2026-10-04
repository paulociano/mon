const NB_METHODS={
 functionalRepair:['freeRecall','cloze','transfer','roleplay','dictation'],
 repair:['freeRecall','cloze','dictation','transfer','roleplay'],
 retrieve:['freeRecall','dictation','cloze','transfer','roleplay'],
 listening:['dictation','minimalPair','freeRecall','transfer','roleplay'],
 production:['freeRecall','transfer','roleplay','dictation','cloze'],
 transfer:['cloze','transfer','roleplay','freeRecall','dictation'],
 advance:['discover','freeRecall','transfer','roleplay','dictation']
};

function nbWeakMasteryDimension(state={}){
 const sums={},counts={};
 for(const cells of Object.values(state.masteryEvidence||{}))for(const [d,cell] of Object.entries(cells||{})){
   const score=Number(cell?.score);if(!Number.isFinite(score))continue;
   sums[d]=(sums[d]||0)+score;counts[d]=(counts[d]||0)+1;
 }
 return Object.keys(sums).map(d=>({dimension:d,score:Math.round(sums[d]/counts[d]),samples:counts[d]}))
   .filter(x=>x.samples>=2).sort((a,b)=>a.score-b.score)[0]||null;
}
function nbOpenProductionGap(state={}){
 return Object.entries(state.productionGaps||{}).map(([label,g])=>({label,count:+(g?.count||0),recovered:+(g?.recovered||0),open:Math.max(0,+(g?.count||0)-+(g?.recovered||0)),lastAt:+(g?.lastAt||0),tokens:Array.isArray(g?.tokens)?g.tokens.filter(Boolean):[],unitId:g?.unitId||null,capability:g?.capability||null,functionalScore:g?.capability?+(state.functionalMastery?.[g.capability]?.score||0):0})).filter(x=>x.open>0).sort((a,b)=>b.open-a.open||a.functionalScore-b.functionalScore||b.lastAt-a.lastAt)[0]||null;
}
function nbValidationSignal(state={}){
 const e=state.learningEvidence?.events||[],pct=(r,f=x=>x.ok)=>r.length?Math.round(r.filter(f).length/r.length*100):null,trend=(r,f=x=>x.ok,avg=false)=>{if(r.length<8)return null;r=[...r].sort((a,b)=>(a.at||0)-(b.at||0));const n=Math.floor(r.length/2),a=r.slice(0,n),b=r.slice(-n),v=x=>avg?Math.round(x.reduce((s,y)=>s+Number(y.autonomy||0),0)/x.length):pct(x,f),early=v(a),recent=v(b);return{early,recent,delta:recent-early,samples:r.length}};
 const attempts=e.filter(x=>x.kind==='attempt'&&typeof x.ok==='boolean'),ret=attempts.filter(x=>Number(x.spacingMs||0)>=144*60*60*1000);
 if(ret.length>=8&&pct(ret)<70)return{intent:'retrieve',metric:'retention7d',value:pct(ret),samples:ret.length,reason:`Retenção após 7d está em ${pct(ret)}% com ${ret.length} observações.`};
 const transfer=attempts.filter(x=>x.dimension==='transfer'||x.dimension==='produce'||x.context==='transfer'||x.context==='mission'),t=trend(transfer);
 if(t&&t.recent<70&&t.delta<=0)return{intent:'transfer',metric:'transfer',...t,reason:`Transferência recente está em ${t.recent}% e não melhorou na amostra observada.`};
 const h=trend(attempts,x=>Number(x.hintLevel||0)>0);
 if(h&&h.recent>=40&&h.delta>0)return{intent:'production',metric:'hints',...h,reason:`Dependência de pistas subiu para ${h.recent}% na amostra observada.`};
 const missions=e.filter(x=>x.kind==='mission_complete'&&Number.isFinite(Number(x.autonomy))),a=trend(missions,x=>true,true);
 if(a&&a.recent<65&&a.delta<=0)return{intent:'transfer',metric:'autonomy',...a,reason:`Autonomia recente está em ${a.recent}% e não melhorou na amostra observada.`};
 return null;
}
function nextBestSignals(state={},now=Date.now()){
 const dueReviews=Object.values(state.reviewItems||{}).filter(x=>Number(x?.due||0)<=now).length;
 const openMistakes=Object.values(state.mistakeStats||{}).filter(x=>(x?.count||0)>(x?.recovered||0)).length;
 const unresolvedNarrative=Object.values(state.narrative?.episodes||{}).filter(x=>!x.resolved).length;
 const weakMastery=nbWeakMasteryDimension(state);
 const weakMethod=Object.entries(state.methodStats||{}).map(([method,s])=>({method,attempts:s?.attempts||0,accuracy:s?.attempts?s.correct/s.attempts:null}))
   .filter(x=>x.attempts>=2&&x.accuracy!==null).sort((a,b)=>a.accuracy-b.accuracy)[0]||null;
 const productionGap=nbOpenProductionGap(state),validation=nbValidationSignal(state);
 return {dueReviews,openMistakes,unresolvedNarrative,weakMastery,weakMethod,productionGap,validation};
}
function nextBestLessonPlan(state={},node={},now=Date.now()){
 const s=nextBestSignals(state,now);let intent='advance',reason='Sem dívida pedagógica prioritária.';
 if(state.remediation){intent='repair';reason='Há uma lacuna de domínio marcada para reforço.'}
 else if(s.dueReviews>=4){intent='retrieve';reason=`${s.dueReviews} itens chegaram ao ponto de recuperação espaçada.`}
 else if(s.productionGap?.open>=2){intent='functionalRepair';reason=`A função “${s.productionGap.label}” voltou a faltar ${s.productionGap.open} vezes${s.productionGap.capability?` · domínio ${s.productionGap.functionalScore}%`:''}.`}
 else if(s.openMistakes>=3){intent='repair';reason=`${s.openMistakes} padrões de erro continuam abertos.`}
 else if(s.weakMastery?.dimension==='listen'&&s.weakMastery.score<65){intent='listening';reason=`Escuta é a dimensão mais frágil observada (${s.weakMastery.score}%).`}
 else if(s.weakMastery?.dimension==='produce'&&s.weakMastery.score<65){intent='production';reason=`Produção é a dimensão mais frágil observada (${s.weakMastery.score}%).`}
 else if(s.weakMethod?.method==='produce'&&s.weakMethod.accuracy<.65){intent='production';reason='Produção recente está abaixo do nível desejável.'}
 else if(s.unresolvedNarrative>0){intent='transfer';reason='Há uma situação narrativa ainda não resolvida com evidência suficiente.'}
 else if(s.validation){intent=s.validation.intent;reason=s.validation.reason}
 const objective={functionalRepair:`Reparar a função comunicativa “${s.productionGap?.label||'produção'}” e voltar a usá-la sem apoio.`,repair:'Corrigir uma lacuna específica antes de ampliar dificuldade.',retrieve:'Recuperar memória vencendo antes de introduzir novidade.',listening:'Converter som em sentido com menos apoio visual.',production:'Produzir japonês com menos pistas.',transfer:'Reutilizar linguagem conhecida em contexto diferente.',advance:'Aprender pouco conteúdo novo e fechá-lo com recuperação e produção.'}[intent];
 return {intent,objective,reason,signals:s,functionalGap:intent==='functionalRepair'?s.productionGap:null,reviewCount:intent==='repair'||intent==='retrieve'?3:intent==='advance'?1:2,targetExercises:intent==='repair'||intent==='retrieve'?9:8,methodOrder:[...(NB_METHODS[intent]||NB_METHODS.advance)],node:{day:node?.day||null,label:node?.label||'',type:node?.type||'lesson'}};
}
function nbExerciseFamily(e={}){
 if(['listen','audio','dictation','minimalPair'].includes(e.type))return'listen';
 if(['recall','speak','speaking','roleplay','writing','wordbank','cloze','transfer'].includes(e.type))return'produce';
 if(e.type==='reading'||e.method==='transfer')return'transfer';
 if(e.type==='match')return'match';return'recognize';
}
function sequenceLessonByPlan(exercises=[],plan={},limit=8){
 const methods=plan.methodOrder||NB_METHODS.advance,seen=new Set();
 const scored=exercises.map((e,index)=>{const m=methods.indexOf(e.method||'');let score=m>=0?60-m*7:20;if(e._reviewType)score+=(plan.intent==='retrieve'||plan.intent==='repair')?55:25;if(plan.intent==='listening'&&nbExerciseFamily(e)==='listen')score+=28;if(plan.intent==='production'&&nbExerciseFamily(e)==='produce')score+=28;if(plan.intent==='transfer'&&nbExerciseFamily(e)==='transfer')score+=28;if(e._story&&plan.intent==='transfer')score+=35;return{e,index,score}}).sort((a,b)=>b.score-a.score||a.index-b.index);
 const out=[],last=[];
 while(out.length<limit&&scored.length){let i=scored.findIndex(x=>!(last.length>=2&&last.at(-1)===nbExerciseFamily(x.e)&&last.at(-2)===nbExerciseFamily(x.e)));if(i<0)i=0;const e=scored.splice(i,1)[0].e;const sig=[e.type,e.prompt||'',e.target||e.answer||e.jp||''].join('|');if(seen.has(sig))continue;seen.add(sig);out.push(e);last.push(nbExerciseFamily(e))}
 if(out.length&&!out.some(e=>nbExerciseFamily(e)==='produce')){const p=exercises.find(e=>nbExerciseFamily(e)==='produce');if(p)out[out.length-1]=p}
 return out.slice(0,limit);
}
function dailyLoopRecipe(plan={}){
 const orders={functionalRepair:['retrieve','function','apply','transfer','produce','reflect'],repair:['retrieve','listen','apply','transfer','produce','reflect'],retrieve:['retrieve','listen','apply','transfer','produce','reflect'],listening:['listen','retrieve','transfer','apply','produce','reflect'],production:['retrieve','apply','listen','transfer','produce','reflect'],transfer:['retrieve','listen','apply','transfer','produce','reflect'],advance:['listen','retrieve','learn','apply','transfer','produce']};
 const minutes={functionalRepair:[2,4,3,3,4,3],repair:[3,3,3,3,2,3],retrieve:[3,3,3,3,2,3],listening:[3,3,3,3,2,4],production:[2,3,3,3,3,4],transfer:[2,3,3,3,3,4],advance:[2,3,3,4,3,4]};
 return {intent:plan.intent||'advance',roles:orders[plan.intent]||orders.advance,minutes:minutes[plan.intent]||minutes.advance,labels:{retrieve:'Aquecer memória',function:'Reparar função',listen:'Ouvir',learn:'Aprender',apply:'Aplicar',transfer:'Reencontrar',produce:'Produzir',reflect:'Fechar o ciclo'}};
}
if(typeof module!=='undefined'&&module.exports)module.exports={nextBestSignals,nextBestLessonPlan,sequenceLessonByPlan,dailyLoopRecipe,nbWeakMasteryDimension,nbExerciseFamily,nbOpenProductionGap,nbValidationSignal};
