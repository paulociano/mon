function mistakeCategory(exercise={}){
  if(exercise._reviewType==='grammar')return 'gramática';
  const prompt=(exercise.prompt||'').toLowerCase();
  if(exercise.type==='listen') return 'escuta';
  if(exercise.type==='speak') return 'fala';
  if(exercise.type==='match') return 'kana';
  if(exercise.type==='wordbank') return /frase|bloco|resposta/.test(prompt)?'ordem da frase':'vocabulário';
  if(/kanji|leitura/.test(prompt)) return 'kanji';
  if(/som|kana|forma corresponde/.test(prompt)) return 'kana';
  if(/afirmação|partícula|verbo|adjetivo|gram/.test(prompt)) return 'gramática';
  return 'vocabulário';
}
function mistakeKey(exercise={}){
  const raw=[mistakeCategory(exercise),exercise.prompt||'',exercise.answer||exercise.target||''].join('|');
  let h=2166136261;
  for(let i=0;i<raw.length;i++){h^=raw.charCodeAt(i);h=Math.imul(h,16777619)}
  return 'm'+(h>>>0).toString(36);
}
function safeExerciseSnapshot(exercise={}){
  const out={type:exercise.type,prompt:exercise.prompt||'',why:exercise.why||'',bridge:exercise.bridge||'',method:exercise.method||'',jp:exercise.jp||'',audio:exercise.audio||'',answer:exercise.answer||'',target:exercise.target||'',pt:exercise.pt||'',cue:exercise.cue||'',npc:exercise.npc||'',npcPt:exercise.npcPt||'',_reviewType:exercise._reviewType||null,_reviewKey:exercise._reviewKey||null,_unitId:exercise._unitId||exercise.unitId||null,_masteryDimension:exercise._masteryDimension||null};
  if(Array.isArray(exercise.accepted))out.accepted=exercise.accepted.slice(0,6);
  if(Array.isArray(exercise.examples))out.examples=exercise.examples.slice(0,4);
  if(Array.isArray(exercise._contrastPair))out._contrastPair=exercise._contrastPair.slice(0,2);
  if(Array.isArray(exercise.options))out.options=exercise.options.slice(0,8);
  if(Array.isArray(exercise.tokens))out.tokens=exercise.tokens.slice(0,16);
  if(Array.isArray(exercise.pairs))out.pairs=exercise.pairs.slice(0,8);
  return out;
}
function mistakeEvidence(kind,key,context,at){if(typeof recordLearningEvidence==='function')recordLearningEvidence({source:'mistake',kind,concept:key,ok:!['mistake','misconception'].includes(kind),context,at})}
function grammarConceptId(exercise={}){return exercise._reviewType==='grammar'&&String(exercise._reviewKey||'').startsWith('P:')?String(exercise._reviewKey).slice(2):null}
function recordMistake(exercise={},context={}){
  state.mistakeStats=state.mistakeStats||{};
  state.mistakes=Array.isArray(state.mistakes)?state.mistakes:[];
  const key=mistakeKey(exercise),now=Date.now(),prev=state.mistakeStats[key]||{count:0,recovered:0};
  const grammarId=grammarConceptId(exercise),concept=grammarId?'grammar:P:'+grammarId:null;
  const entry={
    key,category:mistakeCategory(exercise),concept,count:(prev.count||0)+1,recovered:prev.recovered||0,
    firstAt:prev.firstAt||now,lastAt:now,node:context.node??prev.node??null,lastChosen:context.chosen??prev.lastChosen??null,
    title:exercise.prompt||'Erro de prática',why:exercise.why||'',exercise:safeExerciseSnapshot(exercise)
  };
  state.mistakeStats[key]=entry;
  if(typeof gradeReview==='function')gradeReview('error',key,'hard',{category:entry.category});
  state.mistakes.unshift({at:now,key,category:entry.category,title:entry.title,node:entry.node});
  state.mistakes=state.mistakes.slice(0,60);
  mistakeEvidence('mistake',key,entry.category,now);
  if(concept)mistakeEvidence('misconception',concept,{grammarId,chosen:entry.lastChosen,key},now);
  if(context.r)queueGrammarRepair(context.r,exercise,context.chosen,entry);
  return entry;
}
function markMistakeRecovered(exercise={}){
  const key=mistakeKey(exercise),x=state.mistakeStats?.[key];
  if(!x)return;
  x.recovered=(x.recovered||0)+1;
  x.lastRecoveredAt=Date.now();
  mistakeEvidence('mistake_recovery',key,x.category,x.lastRecoveredAt);
  if(typeof gradeReview==='function')gradeReview('error',key,'good',{category:x.category});
}
function mistakePriority(x){
  const age=Math.min(7,(Date.now()-(x.lastAt||0))/86400000);
  return Math.max(0,(x.count||1)*3-(x.recovered||0)*2+Math.max(0,3-age));
}
function getMistakeQueue(limit=8){
  return Object.values(state.mistakeStats||{}).filter(x=>(x.count||0)>(x.recovered||0))
    .sort((a,b)=>mistakePriority(b)-mistakePriority(a)||(b.lastAt||0)-(a.lastAt||0)).slice(0,limit);
}
function mistakeSummary(){
  const queue=getMistakeQueue(100),by={};
  queue.forEach(x=>by[x.category]=(by[x.category]||0)+1);
  return {open:queue.length,events:(state.mistakes||[]).length,by,top:queue.slice(0,5)};
}
function remediationExercises(limit=6){
  return getMistakeQueue(limit).flatMap(x=>{
    const e={...x.exercise,_mistakeKey:x.key,_remediation:true};
    const grammarRepair=grammarRemediationSequence(e,{chosen:x.lastChosen,mistake:x});
    return grammarRepair.length?grammarRepair:[e];
  }).filter(e=>{
    if(e.type==='study')return true;
    if(e.type==='choice'||e.type==='listen'||e.type==='discovery'||e.type==='minimalPair')return Array.isArray(e.options)&&e.answer;
    if(e.type==='recall'||e.type==='dictation'||e.type==='cloze'||e.type==='transfer')return !!e.target;
    if(e.type==='wordbank')return Array.isArray(e.tokens)&&e.target;
    if(e.type==='match')return Array.isArray(e.pairs)&&e.pairs.length;
    if(e.type==='speak'||e.type==='roleplay')return !!e.target;
    return false;
  });
}
function grammarRemediationStudy(exercise={},context={}){
  const id=grammarConceptId(exercise),g=id&&typeof grammarCatalog!=='undefined'?grammarCatalog[id]:null;
  if(!g)return null;
  const mistake=context.mistake||state.mistakeStats?.[mistakeKey(exercise)]||null,count=Number(mistake?.count||1);
  const misconception=(g.commonMistakes||[])[0];
  const chosen=context.chosen??mistake?.lastChosen??null;
  const mode=count>=2?'contrastive':'repair';
  const correction=misconception?misconception.explanation:g.contrast;
  const explanation=mode==='contrastive'
    ?`Este padrão já causou ${count} erros. ${g.explanation} Erro a desmontar: ${misconception?.wrong||'escolher pela tradução'}. ${correction}`
    :`${chosen?`Você escolheu “${chosen}”. `:''}${correction} Reative o modelo antes de tentar novamente.`;
  return {
    type:'study',mode,title:`Reparo · ${g.form}`,mentalModel:g.mentalModel,explanation,
    examples:(g.examples||[]).slice(0,mode==='contrastive'?3:2),contrast:g.contrast,
    commonMistakes:[...(g.commonMistakes||[])],realWorldUse:g.realWorldUse,
    _grammarRepair:true,_grammarId:id,_mistakeKey:mistake?.key||mistakeKey(exercise)
  };
}
function grammarRemediationSequence(exercise={},context={}){
  if(exercise._grammarRepair)return [];
  const study=grammarRemediationStudy(exercise,context);if(!study)return [];
  const retry={...exercise,_remediation:true,_grammarRepair:true,_mistakeKey:study._mistakeKey,
    bridge:`Agora aplique ${grammarCatalog?.[study._grammarId]?.form||'a estrutura'} sem escolher pela tradução.`};
  return [study,retry];
}
function queueGrammarRepair(run,exercise,chosen,mistake){
  if(exercise._grammarRepair)return;
  const repair=grammarRemediationSequence(exercise,{chosen,mistake});
  if(repair.length)run.pack.exercises.splice(run.step+1,0,...repair);
}

const GRAMMAR_RETENTION_WINDOWS=[{id:'d1',minMs:20*3600000},{id:'d3',minMs:60*3600000},{id:'d7',minMs:144*3600000}];
function grammarContrastId(a,b){return [String(a||''),String(b||'')].sort().join('|')}
function grammarContrastRetentionState(x={},now=Date.now()){
  const marks=x.retention||{},base=Number(x.lastErrorAt||0);
  const next=GRAMMAR_RETENTION_WINDOWS.find(w=>!marks[w.id])||null;
  return {d1:!!marks.d1,d3:!!marks.d3,d7:!!marks.d7,status:marks.d7?'retained':Number(x.errors||0)?'pending':'empty',
    next:next?.id||null,dueAt:next&&base?base+next.minMs:null};
}
function grammarContrastConfusion(a,b,learnerState=state){
  const id=grammarContrastId(a,b),x=learnerState.grammarConfusions?.[id]||{},retention=grammarContrastRetentionState(x);
  const errors=Number(x.errors||0),recoveries=Number(x.recoveries||0);
  const open=errors?(retention.status==='retained'?0:Math.max(1,errors-recoveries)):0;
  const age=x.lastAt?Math.max(0,Date.now()-x.lastAt):Infinity,recency=Number.isFinite(age)?Math.max(0,14-age/86400000):0;
  return {id,a,b,errors,recoveries,open,lastAt:Number(x.lastAt||0),lastErrorAt:Number(x.lastErrorAt||0),retention,
    priority:open*100+errors*8+recency};
}
function recordGrammarContrastOutcome(exercise={},ok=false){
  const pair=exercise._contrastPair;if(!Array.isArray(pair)||pair.length<2)return null;
  state.grammarConfusions=state.grammarConfusions||{};
  const [a,b]=pair,id=grammarContrastId(a,b),old=state.grammarConfusions[id]||{errors:0,recoveries:0,retention:{}},now=Date.now();
  let retention={...(old.retention||{})},lastErrorAt=Number(old.lastErrorAt||0);
  let errors=Number(old.errors||0),recoveries=Number(old.recoveries||0);
  if(!ok){
    errors++;lastErrorAt=now;retention={};
  }else if(exercise._retentionStage){
    const stage=exercise._retentionStage;
    const due=GRAMMAR_RETENTION_WINDOWS.find(w=>w.id===stage);
    if(due&&lastErrorAt&&now-lastErrorAt>=due.minMs)retention[stage]=true;
  }else if(errors>recoveries)recoveries++;
  const next={...old,target:a,rival:b,errors,recoveries,retention,lastErrorAt,lastAt:now};
  state.grammarConfusions[id]=next;return grammarContrastConfusion(a,b);
}
function grammarContrastQueue(limit=6,learnerState=state){
  return Object.values(learnerState.grammarConfusions||{}).map(x=>grammarContrastConfusion(x.target,x.rival,learnerState))
    .filter(x=>x.open>0).sort((a,b)=>b.priority-a.priority||b.lastAt-a.lastAt).slice(0,limit);
}
function grammarContrastRetentionQueue(limit=6,learnerState=state,now=Date.now()){
  return Object.values(learnerState.grammarConfusions||{}).map(x=>{
    const q=grammarContrastConfusion(x.target,x.rival,learnerState),stage=q.retention.next;
    return {...q,stage,dueAt:q.retention.dueAt};
  }).filter(x=>x.open>0&&x.stage&&Number(x.dueAt||Infinity)<=now)
    .sort((a,b)=>a.dueAt-b.dueAt||b.priority-a.priority).slice(0,limit);
}
function grammarContrastRetentionExercise(a,b){
  const q=grammarContrastConfusion(a,b),stage=q.retention.next;if(!stage)return null;
  const e=typeof grammarContrastExercise==='function'?grammarContrastExercise(a,b):null;if(!e)return null;
  const g=grammarCatalog?.[a],sample=(g?.examples||[])[1]||(g?.examples||[])[0];
  return {...e,prompt:`Situação nova · retenção ${stage}: ${sample?.pt||g?.realWorldUse||g?.function} Qual estrutura mantém a função correta?`,
    _retentionStage:stage,_retentionPair:q.id,method:'contrast-retention'};
}

