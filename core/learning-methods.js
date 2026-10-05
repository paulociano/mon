const MON_METHOD={
  name:'Japanese Learning Cycle',
  stages:['input','study','retrieve','transfer','produce','reflect'],
  principle:'Primeiro compreenda a missão e o mecanismo; depois recupere, transfira e produza com apoio decrescente.'
};

function grammarBridge(id,g={}){
  return g.mentalModel||grammarCatalog?.[id]?.mentalModel||`Observe a função de ${g.form||'este padrão'} dentro da frase antes de procurar uma tradução fixa em português.`;
}
function grammarStudyNote(id,g={}){
  return {
    mentalModel:g.mentalModel||grammarBridge(id,g),
    explanation:g.explanation||`${g.form||'Este padrão'} serve para ${g.function||'organizar a frase'}.`,
    examples:[...(g.examples||[])],
    contrast:g.contrast||'Compare a função deste padrão com estruturas próximas antes de escolher pela tradução.',
    commonMistakes:[...(g.commonMistakes||[])],
    realWorldUse:g.realWorldUse||g.function||''
  };
}
function grammarStudyBlock(unit={}){
  const ids=(unit.grammar||[]).filter(id=>grammarCatalog?.[id]);
  if(!ids.length)return null;
  const notes=ids.map(id=>({id,g:grammarCatalog[id],...grammarStudyNote(id,grammarCatalog[id])}));
  const scenario=(unit.scenarios||[])[0];
  const examples=[];
  if(scenario?.reply)examples.push({jp:scenario.reply,pt:scenario.replyPt||scenario.pt||'Resposta aplicada da situação.',note:'Exemplo da própria situação da lição: observe a estrutura funcionando dentro da intenção comunicativa.'});
  for(const x of notes){
    for(const example of x.examples||[]){
      if(examples.length>=4)break;
      if(!examples.some(e=>e.jp===example.jp&&e.pt===example.pt))examples.push({...example,note:example.note||`Exemplo do catálogo para ${x.g.form}.`});
    }
    if(examples.length>=4)break;
  }
  while(examples.length<2&&notes[0])examples.push({jp:notes[0].g.form,pt:notes[0].g.pt,note:'Molde da estrutura: recupere a função antes da tradução.'});
  const commonMistakes=notes.flatMap(x=>x.commonMistakes||[]).filter((x,i,a)=>a.findIndex(y=>y.wrong===x.wrong)===i).slice(0,3);
  const baseContrast=notes.length>1?notes.map(x=>`${x.g.form}: ${x.contrast}`).join(' '):notes[0].contrast;
  const mistake=commonMistakes[0];
  return {
    type:'study',
    title:`${unit.title||'Lição'} · gramática aplicada`,
    mentalModel:notes.map(x=>x.mentalModel).join(' '),
    explanation:notes.map(x=>x.explanation).join(' '),
    examples,
    contrast:baseContrast+(mistake?` Erro comum: ${mistake.wrong} ${mistake.explanation}`:''),
    commonMistakes,
    realWorldUse:[...new Set(notes.map(x=>x.realWorldUse).filter(Boolean))].join(' · ')||((unit.objectives||[]).join(' · '))
  };
}

const pronunciationContrasts=[
  {a:'おばさん',aPt:'tia',b:'おばあさん',bPt:'avó',focus:'vogal longa'},
  {a:'ビル',aPt:'prédio',b:'ビール',bPt:'cerveja',focus:'duração vocálica'},
  {a:'きて',aPt:'venha',b:'きって',bPt:'selo postal',focus:'pequeno っ'}
];

function methodShuffle(a){
  a=[...a];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a;
}
function methodOptions(correct,pool,count=4){
  const vals=[correct,...pool.filter(x=>x!==correct)].filter((x,i,a)=>a.indexOf(x)===i);
  return methodShuffle(vals).slice(0,count);
}
function unitScenario(unit){return (unit.scenarios||[])[0]||null}
function unitVocab(unit,index=0){const ids=unit.vocabulary||[];const id=ids[index%Math.max(1,ids.length)];return {id,item:vocabularyCatalog[id]}}
function unitGrammar(unit,index=0){const ids=unit.grammar||[];const id=ids[index%Math.max(1,ids.length)];return {id,item:grammarCatalog[id]}}
function firstScenarioVocab(unit){
  const s=unitScenario(unit);if(!s)return null;
  for(const id of unit.vocabulary||[]){
    const v=vocabularyCatalog[id];
    if(v&&s.reply.includes(v.jp))return {id,item:v};
  }
  return unitVocab(unit,0);
}

function compileMONMethod(unit,method,index=0){
  const s=unitScenario(unit),v=unitVocab(unit,index),g=unitGrammar(unit,index);
  if(method==='discover'&&g.item){
    const examples=[
      s?{jp:s.reply,pt:s.replyPt}:null,
      {jp:g.item.form,pt:g.item.pt}
    ].filter(Boolean);
    return {type:'discovery',prompt:'Observe os exemplos e identifique a função que acabou de estudar.',examples,
      options:methodOptions(g.item.function,Object.values(grammarCatalog).map(x=>x.function)),
      answer:g.item.function,why:`${g.item.form} · ${g.item.pt}`,
      bridge:g.item.mentalModel||grammarBridge(g.id,g.item),
      _reviewType:'grammar',_reviewKey:'P:'+g.id,_masteryDimension:'recognize',method:'discover'};
  }
  if(method==='mechanism'&&g.item){
    const pool=Object.values(grammarCatalog).map(x=>x.mentalModel).filter(Boolean);
    return {type:'choice',prompt:`Qual modelo mental explica melhor ${g.item.form}?`,jp:g.item.form,
      options:methodOptions(g.item.mentalModel,pool),answer:g.item.mentalModel,
      why:g.item.explanation,bridge:'Entender o mecanismo significa prever o uso sem depender de uma tradução fixa.',
      _reviewType:'grammar',_reviewKey:'P:'+g.id,_masteryDimension:'mechanism',method:'mechanism'};
  }
  if(method==='contrast'&&g.item){
    const pool=Object.values(grammarCatalog).map(x=>x.contrast).filter(Boolean);
    return {type:'choice',prompt:`Qual contraste evita confundir ${g.item.form} com uma estrutura próxima?`,jp:g.item.form,
      options:methodOptions(g.item.contrast,pool),answer:g.item.contrast,
      why:g.item.commonMistakes?.[0]?.explanation||g.item.contrast,
      bridge:'O boundary correto vale mais do que decorar uma tradução isolada.',
      _reviewType:'grammar',_reviewKey:'P:'+g.id,_masteryDimension:'contrast',method:'contrast'};
  }
  if(method==='freeRecall'&&v.item){
    return {type:'recall',prompt:'Sem alternativas: recupere em japonês.',cue:v.item.pt,target:v.item.jp,
      accepted:[v.item.jp,v.item.reading],why:`${v.item.jp} · ${v.item.reading} · ${v.item.pt}`,
      bridge:'Produção livre expõe se a memória existe sem pistas de reconhecimento.',
      _reviewType:'vocabulary',_reviewKey:v.id,method:'recall'};
  }
  if(method==='dictation'&&v.item){
    return {type:'dictation',prompt:'Ditado cego: ouça e escreva o que percebeu.',audio:v.item.jp,target:v.item.jp,
      accepted:[v.item.jp,v.item.reading],why:`${v.item.jp} · ${v.item.reading}`,
      bridge:'O objetivo é mapear som → escrita antes de consultar significado.',
      _reviewType:'vocabulary',_reviewKey:v.id,method:'recall'};
  }
  if(method==='cloze'){
    const found=firstScenarioVocab(unit);if(!s||!found?.item)return null;
    const masked=s.reply.replace(found.item.jp,'＿＿');
    return {type:'cloze',prompt:'Complete pelo sentido do contexto, não por tradução palavra a palavra.',jp:masked,
      target:found.item.jp,accepted:[found.item.jp,found.item.reading],why:`${s.reply} · ${s.replyPt}`,
      bridge:'Use o resto da frase como evidência. Japonês real quase nunca chega em cartões isolados.',
      _reviewType:'vocabulary',_reviewKey:found.id,method:'transfer'};
  }
  if(method==='transfer'&&s){
    return {type:'transfer',prompt:'Transferência: você está nessa situação. Produza a resposta sem modelo.',
      cue:`${s.npcPt} → ${s.replyPt}`,target:s.reply.replace(/[。！？!?]/g,''),accepted:[s.reply,s.reply.replace(/[。！？!?]/g,'')],
      why:`${s.reply} · ${s.replyPt}`,bridge:'A mesma estrutura precisa sobreviver fora do exercício em que foi apresentada.',
      _reviewType:g.item?'grammar':null,_reviewKey:g.item?'P:'+g.id:null,_masteryDimension:g.item?'transfer':null,method:'transfer'};
  }
  if(method==='roleplay'&&s){
    return {type:'roleplay',prompt:'Roleplay sem legenda da resposta.',npc:s.npc,npcPt:s.pt,target:s.reply,pt:s.replyPt,
      why:`${s.reply} · ${s.replyPt}`,bridge:'Primeiro responda. O modelo só aparece depois da tentativa.',
      _reviewType:g.item?'grammar':null,_reviewKey:g.item?'P:'+g.id:null,_masteryDimension:g.item?'produce':null,method:'produce'};
  }
  if(method==='minimalPair'){
    const p=pronunciationContrasts[index%pronunciationContrasts.length];
    const chooseA=index%2===0, audio=chooseA?p.a:p.b, answer=chooseA?p.aPt:p.bPt;
    return {type:'minimalPair',prompt:`Laboratório de contraste · ${p.focus}`,audio,
      options:methodShuffle([p.aPt,p.bPt]),answer,
      why:`${p.a} = ${p.aPt} · ${p.b} = ${p.bPt}`,
      bridge:'No japonês, duração e pequena pausa podem mudar a palavra. Treine contraste, não som isolado.',method:'discover'};
  }
  return null;
}
function compileMONSequence(unit){
  const methods=unit.methods||['discover','freeRecall','transfer','roleplay'];
  return methods.map((m,i)=>compileMONMethod(unit,m,i)).filter(Boolean);
}

function methodStatKey(exercise={}){
  return exercise.method||exercise.type||'standard';
}
function recordMethodOutcome(exercise={},ok=false,meta={}){
  state.methodStats=state.methodStats||{};
  const key=methodStatKey(exercise),old=state.methodStats[key]||{attempts:0,correct:0,hints:0};
  state.methodStats[key]={
    attempts:old.attempts+1,
    correct:old.correct+(ok?1:0),
    hints:old.hints+(meta.hintUsed?1:0),
    lastAt:Date.now()
  };
}
function methodAccuracy(key){
  const x=state.methodStats?.[key];return x?.attempts?x.correct/x.attempts:null;
}
function adaptiveMethodSequence(unit){
  const declared=[...(unit.methods||['discover','freeRecall','transfer','roleplay'])];
  const recall=methodAccuracy('recall'),transfer=methodAccuracy('transfer'),produce=methodAccuracy('produce');
  const weakRecall=recall!==null&&recall<.65;
  const strongRecall=recall!==null&&recall>=.82;
  const weakTransfer=transfer!==null&&transfer<.65;
  const strongProduce=produce!==null&&produce>=.8;
  let ordered=[...(typeof masteryMethodHints==='function'?masteryMethodHints(unit):[]),...declared];
  if(weakRecall){
    ordered=['discover','cloze','dictation','freeRecall',...ordered];
  }else if(strongRecall){
    ordered=['freeRecall','transfer','roleplay','dictation',...ordered.filter(x=>x!=='discover')];
  }
  if(weakTransfer)ordered=['cloze','transfer',...ordered];
  if(strongProduce)ordered=ordered.filter((x,i)=>x!=='discover'||i===0);
  if((unit.grammar||[]).length){
    const conceptual=['discover','mechanism','contrast','transfer','roleplay'];
    ordered=[...conceptual,...ordered.filter(x=>!conceptual.includes(x))];
  }
  return [...new Set(ordered)].slice(0,6);
}
function compileAdaptiveMONSequence(unit){
  return adaptiveMethodSequence(unit).map((m,i)=>compileMONMethod(unit,m,i)).filter(Boolean);
}
function methodPerformanceSummary(){
  const out={};
  for(const [k,v] of Object.entries(state.methodStats||{}))out[k]={...v,accuracy:v.attempts?Math.round(v.correct/v.attempts*100):0};
  return out;
}

const JAPANESE_LEARNING_SOURCES={
  functional:'Irodori',
  grammar:'Desvendando',
  kanji:'Meu Amigo Kanji'
};
function unitKanjiMeaning(k,unit={}){
  const known=typeof kanjiData!=='undefined'?kanjiData.find(x=>x.k===k):null;
  if(known)return known.m;
  for(const id of unit.vocabulary||[]){
    const v=vocabularyCatalog?.[id];
    if(v?.kanji?.includes(k))return v.pt;
  }
  return 'kanji da situação';
}
function kanjiStudyForUnit(unit={}){
  const scenario=(unit.scenarios||[])[0]||{};
  return (unit.kanji||[]).slice(0,5).map(k=>{
    const known=typeof kanjiData!=='undefined'?kanjiData.find(x=>x.k===k):null;
    const vocab=(unit.vocabulary||[]).map(id=>vocabularyCatalog?.[id]).find(v=>v?.kanji?.includes(k));
    const word=vocab?.jp||known?.ex?.[0]?.[0]||k;
    const reading=vocab?.reading||known?.ex?.[0]?.[1]||'';
    const context=[scenario.npc,scenario.reply].find(x=>String(x||'').includes(k))||`${word} aparece no vocabulário funcional desta unidade.`;
    return {k,meaning:unitKanjiMeaning(k,unit),word,reading,context};
  });
}
function japaneseLearningContract(unit={}){
  const scenario=(unit.scenarios||[])[0]||{};
  const study=grammarStudyBlock(unit);
  const kanji=kanjiStudyForUnit(unit);
  const canDo=(unit.objectives||[]).filter(Boolean);
  const situation=unit.context||`${unit.title||'Situação prática'}: ${scenario.pt||canDo[0]||'use japonês para concluir a tarefa comunicativa.'}`;
  const repair={jp:'すみません、もう一度ゆっくりお願いします。',pt:'Desculpe, mais uma vez devagar, por favor.'};
  if(study){
    const kanjiExamples=kanji.slice(0,2).map(x=>({jp:x.word,pt:x.meaning,note:`Kanji em contexto: ${x.k} · ${x.context}`}));
    study.canDo=canDo;study.situation=situation;study.kanjiPreview=kanji;study.repair=repair;
    study.title=`${canDo[0]||unit.title||'Missão'} · ${study.title}`;
    study.explanation=`Situação: ${situation} ${study.explanation}`;
    study.examples=[...(study.examples||[]),...kanjiExamples].slice(0,4);
    study.realWorldUse=`${study.realWorldUse||''} Estratégia de reparo: ${repair.jp} · ${repair.pt}`;
  }
  return {
    unitId:unit.id||null,
    canDo,
    situation,
    input:{jp:scenario.npc||scenario.reply||'',pt:scenario.pt||scenario.replyPt||''},
    study,
    kanji,
    repair,
    practice:['understand','notice','retrieve','transfer','produce'],
    sources:[JAPANESE_LEARNING_SOURCES.functional,JAPANESE_LEARNING_SOURCES.grammar,...(kanji.length?[JAPANESE_LEARNING_SOURCES.kanji]:[])]
  };
}
function grammarEvidenceScore(id,learnerState={}){
  const cells=learnerState.masteryEvidence?.['grammar:P:'+id]||{};
  const rows=['recognize','recall','transfer','produce'].map(d=>cells[d]).filter(x=>Number.isFinite(x?.score));
  if(!rows.length)return null;
  return Math.round(rows.reduce((n,x)=>n+x.score,0)/rows.length);
}
function adaptStudyForLearner(contract={},learnerState={}){
  const study=contract.study;if(!study)return null;
  const unit=typeof coursePacks!=='undefined'
    ?[...(coursePacks.N5?.units||[]),...(coursePacks.N4?.units||[])].find(x=>x.id===contract.unitId)
    :null;
  const scores=(unit?.grammar||[]).map(id=>grammarEvidenceScore(id,learnerState)).filter(Number.isFinite);
  const average=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):null;
  const mode=average===null?'full':average>=85?'practice':average>=65?'compact':'full';
  if(mode==='compact')return {...study,mode,explanation:study.explanation.split('. ').slice(0,2).join('. '),examples:(study.examples||[]).slice(0,2)};
  if(mode==='practice')return {...study,mode,explanation:'Reative o modelo mental e confirme o contraste antes de aplicar sem apoio.',examples:(study.examples||[]).slice(0,1)};
  return {...study,mode:'full'};
}
function missionLearningContract(mission={}){
  return {
    canDo:mission.objective||mission.title||'concluir a missão',
    situation:mission.context||mission.title||'situação funcional',
    input:{jp:mission.npc||'',pt:mission.npcPt||''},
    repair:typeof missionRepairPhrase==='function'?missionRepairPhrase():{jp:'すみません、もう一度お願いします。',pt:'Mais uma vez, por favor.'},
    transfer:{jp:mission.altReply||mission.reply||'',pt:mission.altReplyPt||mission.replyPt||''},
    criterion:'concluir a tarefa preservando intenção e recuperar a conversa se faltar compreensão',
    source:JAPANESE_LEARNING_SOURCES.functional
  };
}

