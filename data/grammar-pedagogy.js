// MON canonical grammar pedagogy
// Enriches grammarCatalog in place so every consumer reads one pedagogical source of truth.

const grammarMentalModels={
  "topicDesu": "は organiza o tópico. Não pense nele como um sinal de “=”: primeiro diga sobre o que você fala, depois complete a informação.",
  "questionKa": "か marca a pergunta no fim. Em fala casual a entonação também ajuda, mas aqui o padrão polido deixa a intenção explícita.",
  "locationNi": "に marca o destino de movimento. Compare com で: に aponta para onde você vai; で marca onde uma ação acontece.",
  "locationWaDoko": "O molde X は どこですか separa tópico e pergunta. Evite traduzir palavra por palavra; recupere o bloco inteiro.",
  "objectO": "を marca o objeto da ação. Em português a ordem costuma carregar esse papel; em japonês a partícula é a pista mais confiável.",
  "requestKudasai": "ください funciona bem para pedir algo concreto. Pense em “X を ください” como um bloco funcional, não como tradução literal de “dar”.",
  "requestOnegai": "お願いします pede item, serviço ou ação com mais flexibilidade. É especialmente útil em atendimento e situações formais.",
  "deAction": "で marca o palco da ação. Lugar + で responde “onde a ação acontece?”, diferente de に com destino/existência.",
  "gaState": "が frequentemente destaca aquilo que está em certo estado ou foco perceptivo. Não tente substituir mecanicamente por “o/a” do português.",
  "karaMade": "から e まで formam limites: origem/início → fim. O mesmo mapa mental serve para tempo e deslocamento.",
  "existenceAru": "あります apresenta a existência de coisas. Pense no padrão como “há X neste ponto”, não como tradução direta de “ter”.",
  "existenceIru": "います apresenta pessoas e animais existentes em um lugar. O contraste com あります depende do tipo de entidade.",
  "positionNo": "の liga a referência espacial ao nome anterior: A の 上 significa “a região de cima de A”, formando um bloco de localização.",
  "timeNi": "に fixa a ação em um ponto específico do tempo. Horários definidos funcionam como alvos temporais.",
  "durationFromTo": "から abre o intervalo e まで fecha o limite. O mesmo mapa mental funciona para tempo e deslocamento.",
  "invitationMashou": "〜ましょう inclui o falante na proposta. É uma iniciativa conjunta, próxima de “vamos fazer”.",
  "invitationMasenka": "〜ませんか usa a forma negativa como convite polido. Em vez de negar, abre espaço para a outra pessoa aceitar ou recusar.",
  "likeGa": "好き descreve uma preferência/estado, por isso o item preferido aparece com が em vez de ser tratado como objeto com を.",
  "adjectiveI": "Adjetivos い carregam comportamento predicativo próprio. O い faz parte da forma e pode mudar em negação e passado.",
  "adjectiveNa": "Adjetivos な usam な antes de substantivos, mas com です predicam sem esse な. O comportamento é diferente dos adjetivos い.",
  "countersTsu": "Os contadores classificam aquilo que está sendo contado. つ é uma família geral útil quando o objeto não exige um contador mais específico.",
  "countersPeople": "Pessoas usam 人, com leituras especiais em 一人 e 二人. Aprenda número + contador como um bloco sonoro.",
  "teKudasai": "A forma て deixa a ação conectável; ください transforma essa ação em um pedido polido para outra pessoa.",
  "teMoIi": "〜てもいい combina uma ação em forma て com a ideia de “mesmo fazendo, está tudo bem”, produzindo permissão.",
  "teWaIkenai": "〜てはいけません enquadra a ação como algo que não é aceitável. É uma proibição mais forte que uma simples preferência negativa.",
  "desireTai": "〜たい se liga ao radical verbal e transforma a ação em desejo do falante. Comporte-se com ela como uma forma descritiva, não como futuro.",
  "teIru": "〜ている conecta uma ação a um estado em curso ou resultante. O contexto decide se o foco é “estar fazendo” ou “estar nesse estado”.",
  "frequency": "Advérbios de frequência calibram quão recorrente é a ação. あまり normalmente pede uma forma negativa para expressar baixa frequência.",
  "pastPolite": "ました e ませんでした carregam o passado no final do verbo. O restante da frase pode permanecer estável enquanto o predicado muda.",
  "beforeAfter": "前に e 後で organizam eventos em relação a um ponto de referência. Primeiro identifique qual ação serve de âncora temporal.",
  "reasonKara": "から colocado após uma razão conecta causa e consequência. Leia a frase como “A; por causa disso, B”.",
  "contrastKedo": "けど cria contraste e também pode suavizar o que vem depois. Em conversa, a segunda metade pode até ficar implícita.",
  "questionWords": "Palavras interrogativas deixam aberta a informação procurada. A partícula ao redor delas ainda mostra qual papel aquela resposta terá.",
  "alreadyYet": "もう indica que uma mudança ou conclusão já ocorreu; まだ mantém a situação antes da conclusão ou em continuidade.",
  "phoneIdentity": "No telefone, identificar-se cedo cria o contexto compartilhado. Xです é direto; Xと申します eleva a polidez da autoapresentação.",
  "obligationNaito": "〜ないといけません parte da forma negativa para marcar necessidade prática: pense em “se eu não fizer, não resolve”, não em uma tradução palavra por palavra.",
  "permissionTemo": "〜ても大丈夫です enquadra a ação como aceitável. O foco é remover uma restrição: “mesmo fazendo isso, está tudo bem”.",
  "conditionTara": "〜たら cria um ponto de passagem: quando A se concretizar, B passa a valer. É útil para instruções e próximos passos.",
  "purposeYouni": "〜ように aponta para um resultado desejado que você tenta garantir, especialmente cuidado, hábito ou capacidade.",
  "givingTeMoraeru": "〜てもらえますか transforma a ação da outra pessoa em ajuda recebida por você, criando um pedido mais suave.",
  "softNdesu": "〜んですが abre contexto antes do pedido ou problema. Ele prepara o interlocutor para entender por que a próxima fala importa.",
  "experienceTaKoto": "〜たことがあります trata uma ação passada como experiência acumulada: “já tive a experiência de fazer X”.",
  "planTsumori": "〜つもりです mostra uma intenção já formada. É mais planejado do que um desejo momentâneo com 〜たい.",
  "hearsaySou": "〜そうです separa informação recebida da sua própria observação. A fonte está implícita no “ouvi dizer”.",
  "explanationToIu": "〜という意味です transforma uma expressão em objeto de explicação: “isso quer dizer...”.",
  "suggestionHouga": "〜たほうがいい compara implicitamente alternativas e recomenda a ação considerada melhor.",
  "politeDecline": "〜はちょっと… deixa a recusa parcialmente implícita. O contexto social completa o “é um pouco difícil”.",
  "reasonNode": "〜ので apresenta razão de modo mais explicativo e geralmente mais suave do que uma justificativa brusca.",
  "whileNagara": "〜ながら mantém uma ação como pano de fundo enquanto outra acontece em paralelo.",
  "tryTeMiru": "〜てみる significa experimentar uma ação para ver o resultado, não apenas “ver” literalmente.",
  "becomeYouNiNaru": "〜ようになる marca mudança de estado ou capacidade ao longo do tempo: algo passa a ser possível ou habitual.",
  "passiveRareru": "A voz passiva muda o foco para aquilo que recebe a ação. Em avisos, importa primeiro entender o que será feito ou afetado.",
  "writtenTeAru": "〜てあります descreve um estado que existe porque alguém realizou uma ação intencionalmente antes.",
  "dueMadeNi": "〜までに estabelece um limite de conclusão: a ação precisa ocorrer antes de o ponto final ser ultrapassado.",
  "ifBa": "〜ば abre uma condição lógica: quando a condição é satisfeita, a consequência se torna aplicável.",
  "mustNakereba": "〜なければなりません expressa obrigação formal por uma lógica de “se não fizer, não serve / não pode ficar assim”.",
  "nominalNoWa": "〜のは empacota uma ação como tópico. Isso permite comparar, explicar ou avaliar o próprio ato.",
  "contrastNonI": "〜のに coloca lado a lado expectativa e resultado inesperado. O contraste é parte central do sentido.",
  "seemMitai": "〜みたいです marca impressão baseada no que parece ser verdade, sem afirmar certeza total.",
  "reportedTte": "〜って pode introduzir fala citada ou um tópico em registro informal. O contexto indica qual função está ativa.",
  "opinionToOmou": "〜と思います embala uma proposição como opinião sua, diminuindo a força de uma afirmação absoluta.",
  "compareYori": "AよりBのほうが organiza comparação por referência: A é o ponto de comparação e B recebe o destaque.",
  "sequenceTara": "〜たら、そのあと usa a conclusão de uma ação como gatilho para a próxima etapa da sequência.",
  "uncertaintyKamo": "〜かもしれません mantém uma hipótese aberta. É possibilidade, não previsão certa.",
  "askNdeshouka": "〜んでしょうか transforma dúvida em pedido de explicação, soando menos como uma pergunta seca de sim/não."
};

const grammarContrasts={
  topicDesu:'Compare は com が: は organiza o tópico compartilhado; が destaca ou introduz aquilo que está em foco.',
  locationNi:'Compare に com で: に aponta destino, horário ou existência; で marca o palco onde uma ação acontece.',
  deAction:'Compare で com に: で responde onde a ação acontece; に aponta destino, horário ou existência.',
  gaState:'Não troque が por は mecanicamente. が focaliza a entidade no estado; は muda a organização informacional da frase.',
  existenceAru:'あります é usado para coisas e entidades inanimadas; para pessoas e animais, o padrão básico é います.',
  existenceIru:'います é usado para pessoas e animais; para coisas e entidades inanimadas, o padrão básico é あります.',
  adjectiveI:'Adjetivos い carregam o い na própria forma; adjetivos な usam な antes de substantivos e seguem outra mecânica.',
  adjectiveNa:'Adjetivos な usam な antes de substantivos; não aplique a conjugação dos adjetivos い a este grupo.',
  invitationMashou:'〜ましょう propõe uma ação conjunta de forma mais direta; 〜ませんか convida deixando mais espaço para recusa.',
  invitationMasenka:'〜ませんか é convite polido; 〜ましょう soa mais como proposta conjunta já encaminhada.',
  requestKudasai:'Xをください funciona bem para pedir algo concreto; お願いします é mais flexível para itens, serviços e ações.',
  requestOnegai:'お願いします cobre pedidos mais amplos; ください é mais direto quando o objeto ou ação está claramente definido.',
  teMoIi:'〜てもいい marca permissão. Não confunda com 〜てはいけません, que marca proibição.',
  teWaIkenai:'〜てはいけません marca proibição. Não confunda com 〜てもいい, que libera a ação.',
  desireTai:'〜たい expressa desejo de fazer uma ação; ほしい, quando aparecer depois, expressa querer uma coisa.',
  reasonKara:'から dá motivo de modo direto; ので, mais adiante, tende a apresentar a razão de forma mais explicativa e suave.',
  reasonNode:'ので explica a razão com tom geralmente mais suave; から costuma soar mais direto na ligação causa → consequência.',
  conditionTara:'〜たら depende da concretização de A para B; não trate toda ocorrência como um simples “se” abstrato.',
  ifBa:'〜ば enfatiza a condição lógica; 〜たら frequentemente funciona melhor quando a sequência temporal importa.',
  planTsumori:'〜つもりです mostra intenção planejada; 〜たいです expressa desejo e não implica o mesmo grau de plano.',
  hearsaySou:'〜そうです aqui marca informação recebida; não confunda com outras construções de そう ligadas a aparência.',
  seemMitai:'〜みたいです marca impressão/aparência; hearsay 〜そうです indica informação que chegou por outra fonte.',
  contrastKedo:'けど cria contraste ou suavização; のに destaca mais fortemente um resultado contrário à expectativa.',
  contrastNonI:'のに carrega contraste inesperado; けど pode ser apenas oposição leve ou suavização conversacional.',
  alreadyYet:'もう aponta mudança/conclusão já alcançada; まだ mantém a situação antes da conclusão ou ainda em continuidade.',
  passiveRareru:'Na passiva, o foco muda para quem ou o que recebe a ação. Não leia apenas pela ordem das palavras.',
  writtenTeAru:'〜てあります descreve estado resultante de ação intencional; 〜ています pode descrever processo ou estado sem essa intenção prévia.',
  teIru:'〜ています pode ser ação em andamento ou estado resultante; 〜てあります destaca resultado preparado intencionalmente.',
  politeDecline:'〜はちょっと… deixa a recusa implícita por convenção social; não espere uma negação explícita para entender a intenção.',
  reportedTte:'〜って é informal e pode citar fala ou marcar tópico; o contexto decide, portanto não force uma única tradução.',
  opinionToOmou:'〜と思います enquadra a proposição como opinião; sem esse enquadramento, a mesma frase pode soar mais categórica.',
  compareYori:'Em AよりBのほうが, A é a referência e B recebe o destaque comparativo. Não inverta os papéis pela ordem portuguesa.'
};

const grammarContrastPairs=[
  ['topicDesu','gaState'],['locationNi','deAction'],['existenceAru','existenceIru'],
  ['adjectiveI','adjectiveNa'],['invitationMashou','invitationMasenka'],['requestKudasai','requestOnegai'],
  ['teMoIi','teWaIkenai'],['reasonKara','reasonNode'],['conditionTara','ifBa'],
  ['desireTai','planTsumori'],['hearsaySou','seemMitai'],['contrastKedo','contrastNonI'],
  ['teIru','writtenTeAru']
];
function grammarContrastPartners(id){
  return grammarContrastPairs.filter(p=>p.includes(id)).map(p=>p[0]===id?p[1]:p[0]);
}
function grammarContrastPair(a,b){
  if(!a||!b)return null;
  const ids=[a,b].sort(),ga=grammarCatalog?.[a],gb=grammarCatalog?.[b];
  if(!ga||!gb)return null;
  return {id:ids.join('|'),a,b,boundary:`${ga.form} × ${gb.form}: ${ga.contrast||grammarContrasts[a]||''} ${gb.contrast||grammarContrasts[b]||''}`};
}

const grammarMistakes={
  topicDesu:{wrong:'Tratar は como se significasse “é”.',explanation:'は marca o tópico; です fecha uma identificação ou descrição polida. A função vem do padrão inteiro.'},
  locationNi:{wrong:'Usar で em qualquer frase com lugar.',explanation:'Escolha pela função: に para destino/horário/existência; で para o lugar onde a ação acontece.'},
  deAction:{wrong:'Usar に sempre que aparecer um lugar.',explanation:'Se o lugar é o palco de uma ação, で costuma ser a pista funcional correta.'},
  objectO:{wrong:'Escolher を pela posição da palavra na frase.',explanation:'を marca o objeto da ação. A partícula é mais confiável do que copiar a ordem do português.'},
  gaState:{wrong:'Substituir が por は em qualquer contexto.',explanation:'が pode focalizar a entidade ligada ao estado; は reorganiza tópico e contraste.'},
  adjectiveNa:{wrong:'Colocar な depois do adjetivo em toda posição.',explanation:'な aparece antes de substantivos, mas não é usado do mesmo modo quando o adjetivo predica com です.'},
  adjectiveI:{wrong:'Adicionar な a um adjetivo い.',explanation:'Os dois grupos têm comportamentos diferentes e precisam ser reconhecidos pela forma e função.'},
  existenceAru:{wrong:'Usar あります para pessoas.',explanation:'No padrão básico, pessoas e animais usam います; coisas usam あります.'},
  existenceIru:{wrong:'Usar います para objetos.',explanation:'No padrão básico, pessoas e animais usam います; coisas usam あります.'},
  countersPeople:{wrong:'Ler 一人 e 二人 pela leitura regular de 人.',explanation:'Essas duas formas têm leituras especiais e devem ser recuperadas como blocos frequentes.'},
  phoneIdentity:{wrong:'Traduzir literalmente cada palavra antes de se identificar.',explanation:'No telefone, o objetivo é estabelecer identidade e contexto cedo com um bloco funcional apropriado.'}
};

function grammarAllUnits(){
  return [...(coursePacks?.N5?.units||[]),...(coursePacks?.N4?.units||[])];
}
function grammarExamplesFromCurriculum(id,g={}){
  const examples=[];
  for(const unit of grammarAllUnits().filter(u=>(u.grammar||[]).includes(id))){
    for(const s of unit.scenarios||[]){
      if(s.reply&&s.replyPt)examples.push({jp:s.reply,pt:s.replyPt,note:`Exemplo aplicado em “${unit.title}”: observe como ${g.form||'a estrutura'} resolve a intenção da situação.`});
      if(examples.length>=3)return examples;
    }
  }
  if(examples.length<2)examples.push({jp:g.form||id,pt:g.pt||g.function||'estrutura-alvo',note:`Molde da estrutura: identifique a função “${g.function||'organizar a frase'}” antes de traduzir.`});
  if(examples.length<2)examples.push({jp:g.form||id,pt:g.pt||g.function||'estrutura-alvo',note:'Recupere este padrão como uma unidade funcional e depois aplique-o em uma frase própria.'});
  return examples.slice(0,3);
}
function grammarRealWorldUse(id,g={}){
  const goals=grammarAllUnits().filter(u=>(u.grammar||[]).includes(id)).flatMap(u=>u.objectives||[]);
  const unique=[...new Set(goals)].slice(0,3);
  return unique.length?unique.join(' · '):`Use esta estrutura para ${g.function||'resolver uma intenção comunicativa real'}.`;
}
function grammarContrast(id,g={}){
  return grammarContrasts[id]||`Compare esta estrutura com alternativas de função próxima. Use ${g.form||'o padrão'} quando a intenção principal for ${g.function||'esta função'}, não apenas porque a tradução em português parece semelhante.`;
}
function grammarCommonMistakes(id,g={}){
  const known=grammarMistakes[id];
  if(known)return [known];
  return [{wrong:'Escolher a estrutura apenas pela tradução em português.',explanation:`A decisão deve seguir a função “${g.function||'gramatical'}” e o contexto. Traduções semelhantes podem exigir padrões japoneses diferentes.`}];
}
function applyGrammarPedagogy(){
  if(typeof grammarCatalog==='undefined')return;
  for(const [id,g] of Object.entries(grammarCatalog)){
    const mentalModel=grammarMentalModels[id]||`Leia ${g.form||id} como um bloco funcional antes de procurar uma equivalência literal.`;
    Object.assign(g,{
      mentalModel,
      explanation:`${g.form||'Este padrão'} serve para ${g.function||'organizar a frase'}. Em uso, ${g.pt||'o sentido depende do contexto'}. ${mentalModel}`,
      examples:grammarExamplesFromCurriculum(id,g),
      contrast:grammarContrast(id,g),
      contrastWith:grammarContrastPartners(id),
      commonMistakes:grammarCommonMistakes(id,g),
      realWorldUse:grammarRealWorldUse(id,g),
      sources:['Desvendando','Irodori']
    });
  }
}
applyGrammarPedagogy();
