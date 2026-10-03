// MON mistake model
// Converts raw wrong answers into a compact pedagogical notebook.

function mistakeCategory(exercise={}){
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
  const out={type:exercise.type,prompt:exercise.prompt||'',why:exercise.why||'',jp:exercise.jp||'',audio:exercise.audio||'',answer:exercise.answer||'',target:exercise.target||'',pt:exercise.pt||''};
  if(Array.isArray(exercise.options))out.options=exercise.options.slice(0,8);
  if(Array.isArray(exercise.tokens))out.tokens=exercise.tokens.slice(0,16);
  if(Array.isArray(exercise.pairs))out.pairs=exercise.pairs.slice(0,8);
  return out;
}
function recordMistake(exercise={},context={}){
  state.mistakeStats=state.mistakeStats||{};
  state.mistakes=Array.isArray(state.mistakes)?state.mistakes:[];
  const key=mistakeKey(exercise),now=Date.now(),prev=state.mistakeStats[key]||{count:0,recovered:0};
  const entry={
    key,category:mistakeCategory(exercise),count:(prev.count||0)+1,recovered:prev.recovered||0,
    firstAt:prev.firstAt||now,lastAt:now,node:context.node??prev.node??null,
    title:exercise.prompt||'Erro de prática',why:exercise.why||'',exercise:safeExerciseSnapshot(exercise)
  };
  state.mistakeStats[key]=entry;
  state.mistakes.unshift({at:now,key,category:entry.category,title:entry.title,node:entry.node});
  state.mistakes=state.mistakes.slice(0,60);
  return entry;
}
function markMistakeRecovered(exercise={}){
  const key=mistakeKey(exercise),x=state.mistakeStats?.[key];
  if(!x)return;
  x.recovered=(x.recovered||0)+1;
  x.lastRecoveredAt=Date.now();
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
  return getMistakeQueue(limit).map(x=>({...x.exercise,_mistakeKey:x.key,_remediation:true})).filter(e=>{
    if(e.type==='choice'||e.type==='listen')return Array.isArray(e.options)&&e.answer;
    if(e.type==='wordbank')return Array.isArray(e.tokens)&&e.target;
    if(e.type==='match')return Array.isArray(e.pairs)&&e.pairs.length;
    if(e.type==='speak')return !!e.target;
    return false;
  });
}
