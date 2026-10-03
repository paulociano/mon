// MON structured curriculum packs
// Domain data only. The course engine decides how these declarations become exercises.

const vocabularyCatalog={
  eki:{jp:'駅',reading:'えき',pt:'estação',en:'station',tags:['city','transport'],kanji:['駅']},
  deguchi:{jp:'出口',reading:'でぐち',pt:'saída',en:'exit',tags:['city','transport'],kanji:['出','口']},
  iriguchi:{jp:'入口',reading:'いりぐち',pt:'entrada',en:'entrance',tags:['city'],kanji:['入','口']},
  doko:{jp:'どこ',reading:'どこ',pt:'onde',en:'where',tags:['question']},
  migi:{jp:'右',reading:'みぎ',pt:'direita',en:'right',tags:['direction'],kanji:['右']},
  hidari:{jp:'左',reading:'ひだり',pt:'esquerda',en:'left',tags:['direction'],kanji:['左']},
  massugu:{jp:'まっすぐ',reading:'まっすぐ',pt:'em frente / reto',en:'straight ahead',tags:['direction']},
  konbini:{jp:'コンビニ',reading:'コンビニ',pt:'loja de conveniência',en:'convenience store',tags:['shopping']},
  ikura:{jp:'いくら',reading:'いくら',pt:'quanto custa',en:'how much',tags:['shopping','question']},
  kore:{jp:'これ',reading:'これ',pt:'isto',en:'this',tags:['demonstrative']},
  sore:{jp:'それ',reading:'それ',pt:'isso',en:'that',tags:['demonstrative']},
  kudasai:{jp:'ください',reading:'ください',pt:'por favor / me dê',en:'please give me',tags:['request']},
  fukuro:{jp:'袋',reading:'ふくろ',pt:'sacola',en:'bag',tags:['shopping'],kanji:['袋']},
  genkin:{jp:'現金',reading:'げんきん',pt:'dinheiro em espécie',en:'cash',tags:['shopping'],kanji:['現','金']},
  kaado:{jp:'カード',reading:'カード',pt:'cartão',en:'card',tags:['shopping']},
  mizu:{jp:'水',reading:'みず',pt:'água',en:'water',tags:['food'],kanji:['水']},
  tabemono:{jp:'食べ物',reading:'たべもの',pt:'comida',en:'food',tags:['food'],kanji:['食','物']},
  nomimono:{jp:'飲み物',reading:'のみもの',pt:'bebida',en:'drink',tags:['food'],kanji:['飲','物']},
  onegaishimasu:{jp:'お願いします',reading:'おねがいします',pt:'por favor',en:'please',tags:['request']},
  osusume:{jp:'おすすめ',reading:'おすすめ',pt:'recomendação',en:'recommendation',tags:['food']},
  kaikei:{jp:'会計',reading:'かいけい',pt:'conta / pagamento',en:'bill / checkout',tags:['food'],kanji:['会','計']},
  juusho:{jp:'住所',reading:'じゅうしょ',pt:'endereço',en:'address',tags:['life'],kanji:['住','所']},
  koko:{jp:'ここ',reading:'ここ',pt:'aqui',en:'here',tags:['demonstrative']},
  kaku:{jp:'書く',reading:'かく',pt:'escrever',en:'to write',tags:['verb'],kanji:['書']},
  hataraku:{jp:'働く',reading:'はたらく',pt:'trabalhar',en:'to work',tags:['work'],kanji:['働']},
  kyou:{jp:'今日',reading:'きょう',pt:'hoje',en:'today',tags:['time'],kanji:['今','日']},
  yoroshiku:{jp:'よろしくお願いします',reading:'よろしくおねがいします',pt:'conto com você / prazer',en:'I look forward to working with you',tags:['work','social']},
  daijoubu:{jp:'大丈夫',reading:'だいじょうぶ',pt:'tudo bem',en:'okay / all right',tags:['survival'],kanji:['大','丈','夫']},
  itai:{jp:'痛い',reading:'いたい',pt:'dolorido / dói',en:'painful / hurts',tags:['health'],kanji:['痛']},
  atama:{jp:'頭',reading:'あたま',pt:'cabeça',en:'head',tags:['health'],kanji:['頭']},
  kusuri:{jp:'薬',reading:'くすり',pt:'remédio',en:'medicine',tags:['health'],kanji:['薬']},
  wakarimasen:{jp:'分かりません',reading:'わかりません',pt:'não entendo',en:"I don't understand",tags:['repair'],kanji:['分']},
  mouichido:{jp:'もう一度',reading:'もういちど',pt:'mais uma vez',en:'one more time',tags:['repair'],kanji:['一','度']},
  yukkuri:{jp:'ゆっくり',reading:'ゆっくり',pt:'devagar',en:'slowly',tags:['repair']},
  sumimasen:{jp:'すみません',reading:'すみません',pt:'com licença / desculpe',en:'excuse me / sorry',tags:['social']}
};

const grammarCatalog={
  topicDesu:{id:'topicDesu',level:'N5',form:'A は B です',pt:'A é B / quanto a A, é B',function:'apresentar ou classificar um tópico'},
  questionKa:{id:'questionKa',level:'N5',form:'〜ですか',pt:'transforma a frase em pergunta polida',function:'perguntar'},
  locationNi:{id:'locationNi',level:'N5',form:'Lugar に 行きます',pt:'ir para um destino',function:'marcar destino'},
  locationWaDoko:{id:'locationWaDoko',level:'N5',form:'X は どこですか',pt:'onde fica X?',function:'perguntar localização'},
  objectO:{id:'objectO',level:'N5',form:'Objeto を verbo',pt:'marca objeto direto',function:'marcar aquilo sobre que a ação recai'},
  requestKudasai:{id:'requestKudasai',level:'N5',form:'これを ください',pt:'isto, por favor',function:'fazer pedido direto e educado'},
  requestOnegai:{id:'requestOnegai',level:'N5',form:'X を お願いします',pt:'X, por favor',function:'pedir serviço ou item'},
  deAction:{id:'deAction',level:'N5',form:'Lugar で ação',pt:'fazer uma ação em um lugar',function:'marcar local da ação'},
  gaState:{id:'gaState',level:'N5',form:'X が estado',pt:'X está / é percebido em certo estado',function:'marcar foco do estado'},
  karaMade:{id:'karaMade',level:'N5',form:'A から B まで',pt:'de A até B',function:'marcar intervalo ou trajeto'}
};

const coursePacks={
  N5:{
    id:'N5',title:'Sobrevivência urbana',promise:'resolver situações cotidianas essenciais sem depender de tradução constante',
    units:[
      {
        id:'n5-station',day:25,title:'Estação · primeiro deslocamento',symbol:'駅',
        objectives:['perguntar onde fica um lugar','entender palavras básicas de direção','pedir repetição quando necessário'],
        prerequisites:['ZERO:24'],vocabulary:['eki','deguchi','iriguchi','doko','migi','hidari','massugu','sumimasen','mouichido'],
        grammar:['locationWaDoko','locationNi'],kanji:['駅','口'],
        scenarios:[{npc:'駅はどこですか。',pt:'Onde fica a estação?',reply:'すみません。駅はどこですか。',replyPt:'Com licença. Onde fica a estação?'}],
        templates:['meaning','reading','listenMeaning','sentenceBuild','speak'],
        mastery:{minAccuracy:80,minRetrievals:2,required:['eki','doko','locationWaDoko']}
      },
      {
        id:'n5-shopping',day:26,title:'Konbini · comprar e pagar',symbol:'店',
        objectives:['perguntar preço','pedir um item','responder sobre sacola e pagamento'],
        prerequisites:['n5-station'],vocabulary:['konbini','ikura','kore','sore','kudasai','fukuro','genkin','kaado'],
        grammar:['questionKa','objectO','requestKudasai'],kanji:['店','金'],
        scenarios:[{npc:'袋はご利用ですか。',pt:'Vai precisar de sacola?',reply:'いいえ、袋はいりません。',replyPt:'Não, não preciso de sacola.'}],
        templates:['meaning','listenMeaning','reverseMeaning','sentenceBuild','speak'],
        mastery:{minAccuracy:80,minRetrievals:2,required:['ikura','kore','requestKudasai']}
      },
      {
        id:'n5-restaurant',day:27,title:'Restaurante · pedir sem travar',symbol:'食',
        objectives:['pedir comida e bebida','pedir recomendação','solicitar a conta'],
        prerequisites:['n5-shopping'],vocabulary:['mizu','tabemono','nomimono','onegaishimasu','osusume','kaikei'],
        grammar:['objectO','requestOnegai'],kanji:['食','飲'],
        scenarios:[{npc:'ご注文はお決まりですか。',pt:'Já decidiu o pedido?',reply:'これをお願いします。',replyPt:'Este, por favor.'}],
        templates:['meaning','reading','listenMeaning','sentenceBuild','speak'],
        mastery:{minAccuracy:82,minRetrievals:2,required:['mizu','onegaishimasu','requestOnegai']}
      },
      {
        id:'n5-address',day:29,title:'Endereço · formulários e localização',symbol:'住',
        objectives:['dizer que mora em um lugar','reconhecer endereço','perguntar onde escrever'],
        prerequisites:['n5-restaurant'],vocabulary:['juusho','koko','kaku','doko'],
        grammar:['topicDesu','locationNi'],kanji:['住','書'],
        scenarios:[{npc:'ご住所をお願いします。',pt:'Seu endereço, por favor.',reply:'ここに書けばいいですか。',replyPt:'É só escrever aqui?'}],
        templates:['meaning','reading','sentenceBuild','listenMeaning','speak'],
        mastery:{minAccuracy:82,minRetrievals:2,required:['juusho','kaku']}
      },
      {
        id:'n5-work',day:30,title:'Trabalho · primeiro contato',symbol:'働',
        objectives:['fazer apresentação breve','entender instruções simples','usar fórmula social de início'],
        prerequisites:['n5-address'],vocabulary:['hataraku','kyou','yoroshiku','daijoubu'],
        grammar:['topicDesu','deAction'],kanji:['働','日'],
        scenarios:[{npc:'今日からよろしくお願いします。',pt:'Conto com você a partir de hoje.',reply:'こちらこそ、よろしくお願いします。',replyPt:'Igualmente, prazer e conto com você.'}],
        templates:['meaning','listenMeaning','sentenceBuild','speak','reverseMeaning'],
        mastery:{minAccuracy:82,minRetrievals:2,required:['hataraku','yoroshiku']}
      },
      {
        id:'n5-health',day:31,title:'Saúde · explicar o básico',symbol:'病',
        objectives:['dizer onde dói','pedir ajuda','entender instrução curta'],
        prerequisites:['n5-work'],vocabulary:['itai','atama','kusuri','daijoubu','wakarimasen'],
        grammar:['gaState','questionKa'],kanji:['病','頭','薬'],
        scenarios:[{npc:'どうしましたか。',pt:'O que houve?',reply:'頭が痛いです。',replyPt:'Minha cabeça dói.'}],
        templates:['meaning','reading','listenMeaning','sentenceBuild','speak'],
        mastery:{minAccuracy:85,minRetrievals:2,required:['itai','atama','gaState']}
      },
      {
        id:'n5-repair',day:32,title:'Reparo de conversa · continuar mesmo perdido',symbol:'復',
        objectives:['dizer que não entendeu','pedir repetição','pedir fala mais lenta'],
        prerequisites:['n5-health'],vocabulary:['wakarimasen','mouichido','yukkuri','sumimasen','onegaishimasu'],
        grammar:['requestOnegai'],kanji:['分','一'],
        scenarios:[{npc:'日本語は大丈夫ですか。',pt:'Seu japonês está tudo bem?',reply:'まだよく分かりません。ゆっくりお願いします。',replyPt:'Ainda não entendo bem. Mais devagar, por favor.'}],
        templates:['listenMeaning','reverseMeaning','sentenceBuild','speak','meaning'],
        mastery:{minAccuracy:85,minRetrievals:3,required:['wakarimasen','mouichido','yukkuri']}
      },
      {
        id:'n5-checkpoint',day:33,title:'Checkpoint · N5 essencial',symbol:'冠',
        objectives:['combinar transporte, compra, comida, trabalho e reparo','responder sem romaji','recuperar vocabulário misturado'],
        prerequisites:['n5-repair'],vocabulary:['eki','ikura','kore','mizu','juusho','hataraku','itai','wakarimasen','sumimasen'],
        grammar:['locationWaDoko','objectO','requestKudasai','requestOnegai','gaState'],kanji:['駅','店','食','働'],
        scenarios:[{npc:'すみません。大丈夫ですか。',pt:'Com licença. Está tudo bem?',reply:'はい。でも日本語がまだよく分かりません。',replyPt:'Sim. Mas ainda não entendo bem japonês.'}],
        templates:['meaning','reading','listenMeaning','reverseMeaning','sentenceBuild','speak'],
        mastery:{minAccuracy:88,minRetrievals:3,required:['eki','kore','wakarimasen','requestOnegai']}
      }
    ]
  }
};

function coursePackForDay(day){
  for(const level of Object.values(coursePacks)){
    const unit=level.units.find(x=>x.day===Number(day));
    if(unit)return unit;
  }
  return null;
}
function validateCoursePacks(){
  const errors=[],unitIds=new Set();
  for(const level of Object.values(coursePacks)){
    for(const u of level.units){
      if(!u.id||unitIds.has(u.id))errors.push('unit id inválido/duplicado: '+u.id);unitIds.add(u.id);
      if(!u.objectives?.length)errors.push(u.id+': sem objectives');
      if(!u.templates?.length)errors.push(u.id+': sem templates');
      if(!u.mastery?.minAccuracy)errors.push(u.id+': sem mastery');
      (u.vocabulary||[]).forEach(v=>{if(!vocabularyCatalog[v])errors.push(u.id+': vocabulário ausente '+v)});
      (u.grammar||[]).forEach(g=>{if(!grammarCatalog[g])errors.push(u.id+': gramática ausente '+g)});
    }
  }
  return errors;
}
