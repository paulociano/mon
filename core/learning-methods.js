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

Object.assign(grammarBridgeNotes,{
  obligationNaito:'〜ないといけません parte da forma negativa para marcar necessidade prática: pense em “se eu não fizer, não resolve”, não em uma tradução palavra por palavra.',
  permissionTemo:'〜ても大丈夫です enquadra a ação como aceitável. O foco é remover uma restrição: “mesmo fazendo isso, está tudo bem”.',
  conditionTara:'〜たら cria um ponto de passagem: quando A se concretizar, B passa a valer. É útil para instruções e próximos passos.',
  purposeYouni:'〜ように aponta para um resultado desejado que você tenta garantir, especialmente cuidado, hábito ou capacidade.',
  givingTeMoraeru:'〜てもらえますか transforma a ação da outra pessoa em ajuda recebida por você, criando um pedido mais suave.',
  softNdesu:'〜んですが abre contexto antes do pedido ou problema. Ele prepara o interlocutor para entender por que a próxima fala importa.',
  experienceTaKoto:'〜たことがあります trata uma ação passada como experiência acumulada: “já tive a experiência de fazer X”.',
  planTsumori:'〜つもりです mostra uma intenção já formada. É mais planejado do que um desejo momentâneo com 〜たい.',
  hearsaySou:'〜そうです separa informação recebida da sua própria observação. A fonte está implícita no “ouvi dizer”.',
  explanationToIu:'〜という意味です transforma uma expressão em objeto de explicação: “isso quer dizer...”.',
  suggestionHouga:'〜たほうがいい compara implicitamente alternativas e recomenda a ação considerada melhor.',
  politeDecline:'〜はちょっと… deixa a recusa parcialmente implícita. O contexto social completa o “é um pouco difícil”.',
  reasonNode:'〜ので apresenta razão de modo mais explicativo e geralmente mais suave do que uma justificativa brusca.',
  whileNagara:'〜ながら mantém uma ação como pano de fundo enquanto outra acontece em paralelo.',
  tryTeMiru:'〜てみる significa experimentar uma ação para ver o resultado, não apenas “ver” literalmente.',
  becomeYouNiNaru:'〜ようになる marca mudança de estado ou capacidade ao longo do tempo: algo passa a ser possível ou habitual.',
  passiveRareru:'A voz passiva muda o foco para aquilo que recebe a ação. Em avisos, importa primeiro entender o que será feito ou afetado.',
  writtenTeAru:'〜てあります descreve um estado que existe porque alguém realizou uma ação intencionalmente antes.',
  dueMadeNi:'〜までに estabelece um limite de conclusão: a ação precisa ocorrer antes de o ponto final ser ultrapassado.',
  ifBa:'〜ば abre uma condição lógica: quando a condição é satisfeita, a consequência se torna aplicável.',
  mustNakereba:'〜なければなりません expressa obrigação formal por uma lógica de “se não fizer, não serve / não pode ficar assim”.',
  nominalNoWa:'〜のは empacota uma ação como tópico. Isso permite comparar, explicar ou avaliar o próprio ato.',
  contrastNonI:'〜のに coloca lado a lado expectativa e resultado inesperado. O contraste é parte central do sentido.',
  seemMitai:'〜みたいです marca impressão baseada no que parece ser verdade, sem afirmar certeza total.',
  reportedTte:'〜って pode introduzir fala citada ou um tópico em registro informal. O contexto indica qual função está ativa.',
  opinionToOmou:'〜と思います embala uma proposição como opinião sua, diminuindo a força de uma afirmação absoluta.',
  compareYori:'AよりBのほうが organiza comparação por referência: A é o ponto de comparação e B recebe o destaque.',
  sequenceTara:'〜たら、そのあと usa a conclusão de uma ação como gatilho para a próxima etapa da sequência.',
  uncertaintyKamo:'〜かもしれません mantém uma hipótese aberta. É possibilidade, não previsão certa.',
  askNdeshouka:'〜んでしょうか transforma dúvida em pedido de explicação, soando menos como uma pergunta seca de sim/não.'
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

