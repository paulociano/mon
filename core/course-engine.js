function engineShuffle(a){
  a=[...a];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a;
}
function engineShuffledOptions(correct,pool,count=4){
  const vals=[correct,...pool.filter(x=>x!==correct)].filter((x,i,a)=>a.indexOf(x)===i);
  const shuffled=engineShuffle(vals);
  const sliced=shuffled.slice(0,count);
  if(!sliced.includes(correct)&&sliced.length)sliced[Math.floor(Math.random()*sliced.length)]=correct;
  return sliced;
}

function catalogDistractors(id,field='pt'){
  const base=vocabularyCatalog[id]||{},tags=new Set(base.tags||[]);
  const rows=Object.entries(vocabularyCatalog).filter(([key])=>key!==id).map(([key,v])=>({
    key,v,shared:(v.tags||[]).reduce((n,t)=>n+(tags.has(t)?1:0),0),
    lengthGap:Math.abs(String(v[field]||'').length-String(base[field]||'').length)
  })).filter(x=>x.v[field]);
  rows.sort((a,b)=>b.shared-a.shared||a.lengthGap-b.lengthGap||a.key.localeCompare(b.key));
  return [...new Set(rows.map(x=>x.v[field]))];
}

function exerciseFamily(e={}){
  if(['listen','dictation','minimalPair'].includes(e.type))return 'listen';
  if(['recall','transfer','speak','roleplay','openResponse','wordbank','cloze'].includes(e.type))return 'produce';
  if(e.type==='match')return 'match';
  return 'recognize';
}
function exerciseSignature(e={}){
  return [e.type,e._reviewType||'',e._reviewKey||'',e.prompt||'',e.target||e.answer||e.jp||''].join('|');
}
function optimizeExerciseSequence(exercises=[],limit=10){
  const unique=[],seen=new Set();
  for(const e of exercises){const sig=exerciseSignature(e);if(seen.has(sig))continue;seen.add(sig);unique.push(e)}
  const pools={recognize:[],listen:[],produce:[],match:[]};
  for(const e of unique)pools[exerciseFamily(e)].push(e);
  const out=[],order=['recognize','listen','produce','match'],last=[];
  while(out.length<limit&&Object.values(pools).some(x=>x.length)){
    let pick=order.find(f=>pools[f].length&&!(last.length>=2&&last.at(-1)===f&&last.at(-2)===f));
    if(!pick)pick=order.find(f=>pools[f].length);
    const e=pools[pick].shift();out.push(e);last.push(pick);
    order.push(order.shift());
  }
  if(out.length&&out.every(e=>exerciseFamily(e)!=='produce')){
    const p=unique.find(e=>exerciseFamily(e)==='produce');
    if(p)out[Math.min(out.length-1,limit-1)]=p;
  }
  return out.slice(0,limit);
}
function compilePackExercise(unit,template,index){
  const vocabIds=unit.vocabulary||[],vocabId=vocabIds[index%Math.max(1,vocabIds.length)],v=vocabularyCatalog[vocabId];
  const scenario=(unit.scenarios||[])[index%Math.max(1,(unit.scenarios||[]).length)];
  if(template==='meaning'&&v)return {type:'choice',prompt:`O que “${v.jp}” significa?`,jp:v.jp,options:engineShuffledOptions(v.pt,catalogDistractors(vocabId,'pt')),answer:v.pt,why:`${v.jp} · ${v.reading} · ${v.pt}`,_reviewType:'vocabulary',_reviewKey:vocabId};
  if(template==='reverseMeaning'&&v)return {type:'choice',prompt:`Como dizer “${v.pt}” neste bloco?`,options:engineShuffledOptions(v.jp,catalogDistractors(vocabId,'jp')),answer:v.jp,why:`${v.pt} → ${v.jp} · ${v.reading}`,_reviewType:'vocabulary',_reviewKey:vocabId};
  if(template==='reading'&&v)return {type:'choice',prompt:`Como se lê ${v.jp}?`,jp:v.jp,options:engineShuffledOptions(v.reading,catalogDistractors(vocabId,'reading')),answer:v.reading,why:`${v.jp} → ${v.reading}`,_reviewType:'vocabulary',_reviewKey:vocabId};
  if(template==='listenMeaning'&&v)return {type:'listen',prompt:'Ouça. Qual é o sentido?',audio:v.jp,options:engineShuffledOptions(v.pt,catalogDistractors(vocabId,'pt')),answer:v.pt,why:`${v.jp} · ${v.reading} · ${v.pt}`,_reviewType:'vocabulary',_reviewKey:vocabId};
  if(template==='sentenceBuild'&&scenario){
    const target=scenario.reply.replace(/[。！？!?]/g,''),tokens=target.match(/.{1,3}/g)||[target];
    return {type:'wordbank',prompt:'Monte uma resposta natural para a situação.',target,tokens,why:`${scenario.reply} · ${scenario.replyPt}`};
  }
  if(template==='speak'&&scenario){if(unit.openProduction&&scenario.assessment)return {type:'openResponse',prompt:'Responda com suas próprias palavras.',npc:scenario.npc,npcPt:scenario.pt,target:scenario.reply,pt:scenario.replyPt,assessment:scenario.assessment,why:'O checkpoint avalia intenção e elementos essenciais, não cópia da frase-modelo.',method:'produce'};return {type:'speak',prompt:`Responda: ${scenario.npc}`,target:scenario.reply,pt:scenario.replyPt,why:'Produza a resposta inteira em um único fluxo.'}};
  return null;
}
function compileOpenProduction(unit,index=0){
  const scenarios=unit.scenarios||[],scenario=scenarios[index%Math.max(1,scenarios.length)];
  if(!unit.openProduction||!scenario?.assessment)return null;
  return {type:'openResponse',prompt:'Responda com suas próprias palavras.',npc:scenario.npc,npcPt:scenario.pt,target:scenario.reply,pt:scenario.replyPt,assessment:scenario.assessment,why:'O checkpoint avalia intenção e elementos essenciais, não cópia da frase-modelo.',method:'produce'};
}
function lessonPlanFromPack(unit){
  const standard=(unit.templates||[]).map((t,i)=>compilePackExercise(unit,t,i)).filter(Boolean);
  const distinctive=typeof compileAdaptiveMONSequence==='function'?compileAdaptiveMONSequence(unit):typeof compileMONSequence==='function'?compileMONSequence(unit):[];
  const exercises=[];
  const max=Math.max(standard.length,distinctive.length);
  for(let i=0;i<max;i++){if(distinctive[i])exercises.push(distinctive[i]);if(standard[i])exercises.push(standard[i])}
  const narrative=typeof narrativeEchoExercise==='function'?narrativeEchoExercise(unit):null;
  if(narrative)exercises.splice(Math.min(4,exercises.length),0,narrative);
  let tagged=optimizeExerciseSequence(exercises,10).map(e=>({...e,_unitId:unit.id}));
  if(unit.openProduction&&!tagged.some(e=>e.type==='openResponse')){const open=compileOpenProduction(unit,Math.max(1,(unit.scenarios||[]).length-1));if(open)tagged=[...tagged.slice(0,9),{...open,_unitId:unit.id}]}
  return {title:unit.title,focus:unit.symbol,unitId:unit.id,objectives:unit.objectives,mastery:unit.mastery,narrative:typeof narrativeEpisodeForUnit==='function'?narrativeEpisodeForUnit(unit):null,
    study:typeof grammarStudyBlock==='function'?grammarStudyBlock(unit):null,
    method:typeof MON_METHOD!=='undefined'?MON_METHOD:null,exercises:tagged};
}

const FOUNDATION_PROMPTS=[
 ['Escute sem olhar. Qual som você identifica?','Qual kana representa','Conecte kana e leitura.','Que sentido tem','Monte a forma japonesa sem copiar.','Qual explicação descreve o mecanismo?','Qual é a intenção da frase?','Produza a frase completa.'],
 ['Ouça primeiro. Qual bloco apareceu?','Encontre a forma de','Associe símbolo e leitura.','Neste contexto, o que significa','Reconstrua em japonês.','Escolha a regra deste exemplo.','Recupere o sentido global.','Produza em um único ritmo.'],
 ['Sem ler a tela, reconheça o som.','Do som, encontre','Forme os pares corretos.','Leia e escolha o significado de','Recupere a forma-alvo.','Qual leitura funcional está correta?','Ouça e escolha o sentido.','Feche com shadowing completo.']
];
function foundationVariedExercises(day,p,pairs,wordChars,grammarTokens){
 const q=FOUNDATION_PROMPTS[(day-1)%FOUNDATION_PROMPTS.length],items=[
  {type:'listen',prompt:q[0],audio:p.kana,options:engineShuffledOptions(p.roman,foundationSessionPlans.slice(Math.max(0,day-3),Math.min(24,day+4)).map(x=>x.roman)),answer:p.roman,why:`${p.kana} → ${p.roman}`},
  {type:'choice',prompt:`${q[1]} “${p.roman}”?`,options:engineShuffledOptions(p.kana,day<=12?[...kanaCourse.hira.basic,...kanaCourse.kata.basic].map(x=>x[0]):foundationSessionPlans.slice(12).map(x=>x.kana)),answer:p.kana,why:p.concept},
  {type:'match',prompt:q[2],pairs},
  {type:'choice',prompt:`${q[3]} “${p.word}”?`,jp:p.word,options:engineShuffledOptions(p.pt,foundationSessionPlans.map(x=>x.pt)),answer:p.pt,why:`${p.word} · ${p.wordReading} · ${p.pt}`},
  {type:'wordbank',prompt:q[4],target:day<=12?p.word:p.phrase.replace('。',''),tokens:day<=12?wordChars:grammarTokens,why:day<=12?'Leia em unidades de mora, não em letras portuguesas.':'Monte o japonês pela função dos blocos.'},
  {type:'choice',prompt:q[5],options:p.conceptOptions,answer:p.concept,why:p.concept},
  {type:'listen',prompt:q[6],audio:p.phrase,options:engineShuffledOptions(p.phrasePt,foundationSessionPlans.map(x=>x.phrasePt)),answer:p.phrasePt,why:`${p.phrase} · ${p.phrasePt}`},
  {type:'speak',prompt:q[7],target:p.phrase,pt:p.phrasePt,why:'Faça shadowing: ouça, espere meio segundo e repita em um único ritmo.'}
 ],middle=items.slice(1,-1),shift=(day-1)%middle.length;
 return [items[0],...middle.slice(shift),...middle.slice(0,shift),items.at(-1)];
}
function lessonPlanFromNode(node){let day=node.day||1;const structured=typeof coursePackForDay==='function'?coursePackForDay(day):null;if(structured)return lessonPlanFromPack(structured);if(day<=24){const p=foundationSessionPlans[Math.max(0,Math.min(23,day-1))];const basic=day<=7?kanaCourse.hira.basic:day<=12?kanaCourse.kata.basic:kanaCourse.hira.basic;const sample=basic.slice(Math.max(0,(day*3)%Math.max(1,basic.length-4)),Math.max(0,(day*3)%Math.max(1,basic.length-4))+4);const pairs=sample.length>=3?sample.slice(0,3):kanaCourse.hira.basic.slice(0,3);const wordChars=[...p.word].filter(x=>x.trim());const grammarTokens=(p.phrase.replace('。','').match(/.{1,2}/g)||[p.phrase.replace('。','')]);return {title:node.label,focus:p.kana,study:typeof foundationStudyBlock==='function'?foundationStudyBlock(day):null,exercises:foundationVariedExercises(day,p,pairs,wordChars,grammarTokens)}}
 const mi=Math.max(0,Math.min(missions.length-1,(day-25)%missions.length)),m=missions[mi],sp=missionSpeech[mi],rd=microReadings[mi],k=kanjiData[(day-25)%kanjiData.length],ex=k.ex[0];return {title:node.label,focus:m.symbol,exercises:[
  {type:'listen',prompt:'O que a pessoa quis dizer?',audio:sp.npc,options:engineShuffledOptions(sp.npcPt,missionSpeech.map(x=>x.npcPt)),answer:sp.npcPt,why:'Capture primeiro a intenção geral.'},
  {type:'choice',prompt:`Qual kanji significa “${k.m.toLowerCase()}”?`,options:engineShuffledOptions(k.k,kanjiData.map(x=>x.k)),answer:k.k,why:`${k.k} · ${k.m}`},
  {type:'choice',prompt:`Como se lê ${ex[0]}?`,options:engineShuffledOptions(ex[1],kanjiData.flatMap(x=>x.ex.map(e=>e[1]))),answer:ex[1],why:`${ex[0]} → ${ex[1]} · ${ex[2]}`},
  {type:'choice',prompt:'Escolha a interpretação correta.',jp:rd.jp,options:engineShuffledOptions(rd.pt,microReadings.map(x=>x.pt)),answer:rd.pt,why:rd.insight},
  {type:'wordbank',prompt:'Reconstrua a resposta-alvo.',target:sp.target.replace('。',''),tokens:(sp.target.replace('。','').match(/.{1,3}/g)||[sp.target]),why:sp.pt},
  {type:'listen',prompt:'Ouça de novo. Qual é a resposta mais natural?',audio:sp.npc,options:engineShuffledOptions(sp.target,missionSpeech.map(x=>x.target)),answer:sp.target,why:sp.pt},
  {type:'choice',prompt:`Qual palavra contém ${k.k}?`,options:engineShuffledOptions(ex[0],kanjiData.map(x=>x.ex[0][0])),answer:ex[0],why:`${ex[0]} · ${ex[2]}`},
  {type:'speak',prompt:'Responda em japonês.',target:sp.target,pt:sp.pt,why:'Produção fecha o circuito.'}
 ]}}

function scheduledReviewExercise(item){
  if(!item)return null;
  if(item.type==='error'){
    const m=state.mistakeStats?.[item.key];
    return m?.exercise?{...m.exercise,_mistakeKey:item.key,_reviewType:'error',_reviewKey:item.key,_remediation:true}:null;
  }
  if(item.type==='kana'){
    const pools=[...kanaCourse.hira.basic,...kanaCourse.hira.voiced,...kanaCourse.hira.yoon,...kanaCourse.kata.basic,...kanaCourse.kata.voiced,...kanaCourse.kata.yoon];
    const found=pools.find(x=>x[0]===item.key);if(!found)return null;
    return {type:'choice',prompt:'Revisão espaçada: como se lê este kana?',jp:found[0],options:engineShuffledOptions(found[1],pools.map(x=>x[1])),answer:found[1],why:`${found[0]} → ${found[1]}`,_reviewType:'kana',_reviewKey:item.key};
  }
  if(item.type==='kanji'){
    const k=kanjiData.find(x=>x.k===item.key);if(!k)return null;
    return {type:'choice',prompt:`Revisão espaçada: qual sentido combina com ${k.k}?`,jp:k.k,options:engineShuffledOptions(k.m,kanjiData.map(x=>x.m)),answer:k.m,why:`${k.k} · ${k.m} · ${k.ex[0][1]}`,_reviewType:'kanji',_reviewKey:item.key};
  }
  if(item.type==='vocabulary'){
    const v=vocabularyCatalog?.[item.key];if(!v)return null;
    return {type:'choice',prompt:'Revisão espaçada: qual é o sentido?',jp:v.jp,options:engineShuffledOptions(v.pt,catalogDistractors(item.key,'pt')),answer:v.pt,why:`${v.jp} · ${v.reading} · ${v.pt}`,_reviewType:'vocabulary',_reviewKey:item.key};
  }
  if(item.type==='grammar'){
    if(String(item.key).startsWith('P:')){
      const g=grammarCatalog?.[String(item.key).slice(2)];if(!g)return null;
      return {type:'choice',prompt:'Revisão espaçada: qual função descreve este padrão?',jp:g.form,options:engineShuffledOptions(g.function,Object.values(grammarCatalog).map(x=>x.function)),answer:g.function,why:`${g.form} · ${g.pt}`,_reviewType:'grammar',_reviewKey:item.key};
    }
    const day=Number(String(item.key).replace(/^F/,'')),p=foundationSessionPlans[day-1];if(!p)return null;
    return {type:'choice',prompt:'Revisão espaçada: qual afirmação descreve este mecanismo?',jp:p.phrase,options:p.conceptOptions,answer:p.concept,why:p.concept,_reviewType:'grammar',_reviewKey:item.key};
  }
  return null;
}
function scheduledReviewExercises(limit=6){
  if(typeof getReviewQueue!=='function')return [];
  const seen=new Set(),out=[];
  for(const item of getReviewQueue(limit*3)){
    const e=scheduledReviewExercise(item);if(!e)continue;
    const key=e._reviewType+':'+e._reviewKey;if(seen.has(key))continue;seen.add(key);out.push(e);
    if(out.length>=limit)break;
  }
  return out;
}

function buildLesson(node,learnerState){
  const pack=lessonPlanFromNode(node),base=pack.exercises||[];
  const nextBest=typeof nextBestLessonPlan==='function'?nextBestLessonPlan(learnerState||state,node):null;
  const reviewCount=nextBest?.reviewCount??2,reviews=scheduledReviewExercises(reviewCount);
  const exercises=[...reviews,...base];
  const ordered=nextBest&&typeof sequenceLessonByPlan==='function'
    ?sequenceLessonByPlan(exercises,nextBest,nextBest.targetExercises||8)
    :optimizeExerciseSequence(exercises,10);
  const lessonExercises=pack.study?[pack.study,...ordered]:ordered;
  return {...pack,exercises:lessonExercises,adaptive:true,reviewCount:reviews.length,nextBest};
}
