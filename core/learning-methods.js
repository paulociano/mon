const MON_METHOD={
  name:'Gate Loop',
  stages:['discover','recall','transfer','produce','reflect'],
  principle:'Ajuda aparece depois da tentativa sempre que o conteúdo já foi apresentado.'
};

const grammarBridgeNotes={
  topicDesu:'は organiza o tópico. Não pense nele como um sinal de “=”: primeiro diga sobre o que você fala, depois complete a informação.',
  questionKa:'か marca a pergunta no fim. Em fala casual a entonação também ajuda, mas aqui o padrão polido deixa a intenção explícita.',
  locationNi:'に marca o destino de movimento. Compare com で: に aponta para onde você vai; で marca onde uma ação acontece.',
  locationWaDoko:'O molde X は どこですか separa tópico e pergunta. Evite traduzir palavra por palavra; recupere o bloco inteiro.',
  objectO:'を marca o objeto da ação. Em português a ordem costuma carregar esse papel; em japonês a partícula é a pista mais confiável.',
  requestKudasai:'ください funciona bem para pedir algo concreto. Pense em “X を ください” como um bloco funcional, não como tradução literal de “dar”.',
  requestOnegai:'お願いします pede item, serviço ou ação com mais flexibilidade. É especialmente útil em atendimento e situações formais.',
  deAction:'で marca o palco da ação. Lugar + で responde “onde a ação acontece?”, diferente de に com destino/existência.',
  gaState:'が frequentemente destaca aquilo que está em certo estado ou foco perceptivo. Não tente substituir mecanicamente por “o/a” do português.',
  karaMade:'から e まで formam limites: origem/início → fim. O mesmo mapa mental serve para tempo e deslocamento.'
};
function grammarBridge(id,g={}){
  return grammarBridgeNotes[id]||`Observe a função de ${g.form||'este padrão'} dentro da frase antes de procurar uma tradução fixa em português.`;
}

Object.assign(grammarBridgeNotes,{
  existenceAru:'あります apresenta a existência de coisas. Pense no padrão como “há X neste ponto”, não como tradução direta de “ter”.',
  existenceIru:'います apresenta pessoas e animais existentes em um lugar. O contraste com あります depende do tipo de entidade.',
  positionNo:'の liga a referência espacial ao nome anterior: A の 上 significa “a região de cima de A”, formando um bloco de localização.',
  timeNi:'に fixa a ação em um ponto específico do tempo. Horários definidos funcionam como alvos temporais.',
  durationFromTo:'から abre o intervalo e まで fecha o limite. O mesmo mapa mental funciona para tempo e deslocamento.',
  invitationMashou:'〜ましょう inclui o falante na proposta. É uma iniciativa conjunta, próxima de “vamos fazer”.',
  invitationMasenka:'〜ませんか usa a forma negativa como convite polido. Em vez de negar, abre espaço para a outra pessoa aceitar ou recusar.',
  likeGa:'好き descreve uma preferência/estado, por isso o item preferido aparece com が em vez de ser tratado como objeto com を.',
  adjectiveI:'Adjetivos い carregam comportamento predicativo próprio. O い faz parte da forma e pode mudar em negação e passado.',
  adjectiveNa:'Adjetivos な usam な antes de substantivos, mas com です predicam sem esse な. O comportamento é diferente dos adjetivos い.',
  countersTsu:'Os contadores classificam aquilo que está sendo contado. つ é uma família geral útil quando o objeto não exige um contador mais específico.',
  countersPeople:'Pessoas usam 人, com leituras especiais em 一人 e 二人. Aprenda número + contador como um bloco sonoro.',
  teKudasai:'A forma て deixa a ação conectável; ください transforma essa ação em um pedido polido para outra pessoa.',
  teMoIi:'〜てもいい combina uma ação em forma て com a ideia de “mesmo fazendo, está tudo bem”, produzindo permissão.',
  teWaIkenai:'〜てはいけません enquadra a ação como algo que não é aceitável. É uma proibição mais forte que uma simples preferência negativa.',
  desireTai:'〜たい se liga ao radical verbal e transforma a ação em desejo do falante. Comporte-se com ela como uma forma descritiva, não como futuro.',
  teIru:'〜ている conecta uma ação a um estado em curso ou resultante. O contexto decide se o foco é “estar fazendo” ou “estar nesse estado”.',
  frequency:'Advérbios de frequência calibram quão recorrente é a ação. あまり normalmente pede uma forma negativa para expressar baixa frequência.',
  pastPolite:'ました e ませんでした carregam o passado no final do verbo. O restante da frase pode permanecer estável enquanto o predicado muda.',
  beforeAfter:'前に e 後で organizam eventos em relação a um ponto de referência. Primeiro identifique qual ação serve de âncora temporal.',
  reasonKara:'から colocado após uma razão conecta causa e consequência. Leia a frase como “A; por causa disso, B”.',
  contrastKedo:'けど cria contraste e também pode suavizar o que vem depois. Em conversa, a segunda metade pode até ficar implícita.',
  questionWords:'Palavras interrogativas deixam aberta a informação procurada. A partícula ao redor delas ainda mostra qual papel aquela resposta terá.',
  alreadyYet:'もう indica que uma mudança ou conclusão já ocorreu; まだ mantém a situação antes da conclusão ou em continuidade.',
  phoneIdentity:'No telefone, identificar-se cedo cria o contexto compartilhado. Xです é direto; Xと申します eleva a polidez da autoapresentação.'
});

function grammarStudyNote(id,g={}){
  const mentalModel=grammarBridge(id,g);
  return {
    mentalModel,
    explanation:`${g.form||'Este padrão'} serve para ${g.function||'organizar a frase'}. Em uso, ${g.pt||'o sentido depende do contexto'}. ${mentalModel}`
  };
}
function grammarStudyBlock(unit={}){
  const ids=(unit.grammar||[]).filter(id=>grammarCatalog?.[id]);
  if(!ids.length)return null;
  const notes=ids.map(id=>({id,g:grammarCatalog[id],...grammarStudyNote(id,grammarCatalog[id])}));
  const scenario=(unit.scenarios||[])[0];
  const examples=[];
  if(scenario?.reply)examples.push({jp:scenario.reply,pt:scenario.replyPt||scenario.pt||'Resposta aplicada da situação.',note:'Exemplo da própria situação da lição: observe as partículas e o final da frase em contexto.'});
  for(const x of notes){
    if(examples.length>=4)break;
    examples.push({jp:x.g.form,pt:x.g.pt,note:`Molde de ${x.g.function}: use a forma como mapa funcional, não como frase para decorar isoladamente.`});
  }
  while(examples.length<2&&notes[0])examples.push({jp:notes[0].g.form,pt:notes[0].g.pt,note:notes[0].mentalModel});
  return {
    type:'study',
    title:`${unit.title||'Lição'} · gramática aplicada`,
    mentalModel:notes.map(x=>x.mentalModel).join(' '),
    explanation:notes.map(x=>`${x.g.form}: ${x.explanation}`).join(' '),
    examples,
    contrast:notes.length>1
      ?`Nesta lição, não escolha estruturas pela tradução em português. Compare as funções: ${notes.map(x=>`${x.g.form} → ${x.g.function}`).join(' · ')}.`
      :`Use ${notes[0].g.form} quando a intenção for ${notes[0].g.function}. Trocar a estrutura muda o papel gramatical, mesmo que a tradução pareça próxima.`,
    realWorldUse:(unit.objectives||[]).join(' · ')
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
    return {type:'discovery',prompt:'Descubra a regra antes da explicação.',examples,
      options:methodOptions(g.item.function,Object.values(grammarCatalog).map(x=>x.function)),
      answer:g.item.function,why:`${g.item.form} · ${g.item.pt}`,
      bridge:grammarBridge(g.id,g.item),
      _reviewType:'grammar',_reviewKey:'P:'+g.id,method:'discover'};
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
      why:`${s.reply} · ${s.replyPt}`,bridge:'A mesma estrutura precisa sobreviver fora do exercício em que foi apresentada.',method:'transfer'};
  }
  if(method==='roleplay'&&s){
    return {type:'roleplay',prompt:'Roleplay sem legenda da resposta.',npc:s.npc,npcPt:s.pt,target:s.reply,pt:s.replyPt,
      why:`${s.reply} · ${s.replyPt}`,bridge:'Primeiro responda. O modelo só aparece depois da tentativa.',method:'produce'};
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
