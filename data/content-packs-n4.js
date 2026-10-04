// MON N4 executable extension
// Loaded after N5 so prior vocabulary, grammar and mastery remain available.

Object.assign(vocabularyCatalog,{
  shimekiri:{jp:'締め切り',reading:'しめきり',pt:'prazo final',en:'deadline',tags:['work']},
  yuusen:{jp:'優先',reading:'ゆうせん',pt:'prioridade',en:'priority',tags:['work'],kanji:['優','先']},
  kakunin:{jp:'確認',reading:'かくにん',pt:'confirmação',en:'confirmation',tags:['work','repair'],kanji:['確','認']},
  okure:{jp:'遅れ',reading:'おくれ',pt:'atraso',en:'delay',tags:['work','time'],kanji:['遅']},
  moushikomi:{jp:'申し込み',reading:'もうしこみ',pt:'solicitação / inscrição',en:'application',tags:['services'],kanji:['申','込']},
  madoguchi:{jp:'窓口',reading:'まどぐち',pt:'guichê de atendimento',en:'service counter',tags:['services'],kanji:['窓','口']},
  hitsuyou:{jp:'必要',reading:'ひつよう',pt:'necessário',en:'necessary',tags:['services'],kanji:['必','要']},
  henko:{jp:'変更',reading:'へんこう',pt:'alteração',en:'change',tags:['services'],kanji:['変','更']},
  netsu:{jp:'熱',reading:'ねつ',pt:'febre',en:'fever',tags:['health'],kanji:['熱']},
  kusuriTecho:{jp:'お薬手帳',reading:'おくすりてちょう',pt:'caderneta de medicamentos',en:'medicine notebook',tags:['health'],kanji:['薬','手','帳']},
  yoyakuHenkou:{jp:'予約変更',reading:'よやくへんこう',pt:'alteração de consulta/reserva',en:'appointment change',tags:['health','services'],kanji:['予','約','変','更']},
  byoujou:{jp:'症状',reading:'しょうじょう',pt:'sintoma / quadro',en:'symptom',tags:['health'],kanji:['症','状']},
  sasou:{jp:'誘う',reading:'さそう',pt:'convidar',en:'invite',tags:['social'],kanji:['誘']},
  yotei:{jp:'予定',reading:'よてい',pt:'plano / agenda',en:'plan',tags:['social','time'],kanji:['予','定']},
  tsugou:{jp:'都合',reading:'つごう',pt:'conveniência / disponibilidade',en:'availability',tags:['social'],kanji:['都','合']},
  zannen:{jp:'残念',reading:'ざんねん',pt:'que pena',en:'unfortunately',tags:['social'],kanji:['残','念']},
  chuui:{jp:'注意',reading:'ちゅうい',pt:'atenção / aviso',en:'caution',tags:['city','reading'],kanji:['注','意']},
  kinshi:{jp:'禁止',reading:'きんし',pt:'proibido',en:'prohibited',tags:['city','reading'],kanji:['禁','止']},
  eigyou:{jp:'営業時間',reading:'えいぎょうじかん',pt:'horário de funcionamento',en:'business hours',tags:['city','time'],kanji:['営','業','時','間']},
  uketsuke:{jp:'受付',reading:'うけつけ',pt:'recepção / atendimento',en:'reception',tags:['services'],kanji:['受','付']},
  iikaeru:{jp:'言い換える',reading:'いいかえる',pt:'reformular',en:'rephrase',tags:['repair'],kanji:['言','換']},
  tatoeba:{jp:'例えば',reading:'たとえば',pt:'por exemplo',en:'for example',tags:['conversation'],kanji:['例']},
  tsumari:{jp:'つまり',reading:'つまり',pt:'em outras palavras',en:'in other words',tags:['conversation']},
  riyuu:{jp:'理由',reading:'りゆう',pt:'motivo',en:'reason',tags:['conversation'],kanji:['理','由']}
});

Object.assign(grammarCatalog,{
  obligationNaito:{id:'obligationNaito',level:'N4',form:'〜ないといけません',pt:'tem que / precisa fazer',function:'expressar obrigação prática'},
  permissionTemo:{id:'permissionTemo',level:'N4',form:'〜ても大丈夫です',pt:'não tem problema se...',function:'dar permissão de modo natural'},
  conditionTara:{id:'conditionTara',level:'N4',form:'〜たら',pt:'quando/se acontecer...',function:'marcar condição ou próximo passo'},
  purposeYouni:{id:'purposeYouni',level:'N4',form:'〜ように',pt:'para que / de modo que',function:'expressar objetivo ou cuidado'},
  givingTeMoraeru:{id:'givingTeMoraeru',level:'N4',form:'〜てもらえますか',pt:'poderia fazer para mim?',function:'pedir ajuda com mais suavidade'},
  softNdesu:{id:'softNdesu',level:'N4',form:'〜んですが',pt:'é que... / acontece que...',function:'introduzir contexto antes de um pedido'},
  experienceTaKoto:{id:'experienceTaKoto',level:'N4',form:'〜たことがあります',pt:'já teve a experiência de...',function:'falar de experiência'},
  planTsumori:{id:'planTsumori',level:'N4',form:'〜つもりです',pt:'pretendo...',function:'expressar intenção planejada'},
  hearsaySou:{id:'hearsaySou',level:'N4',form:'〜そうです',pt:'ouvi dizer que...',function:'relatar informação recebida'},
  explanationToIu:{id:'explanationToIu',level:'N4',form:'〜という意味です',pt:'significa que...',function:'explicar ou confirmar significado'}
});

coursePacks.N4={
 id:'N4',title:'Autonomia funcional',promise:'resolver trabalho, serviços, saúde e conversas abertas com menos apoio',
 units:[
  {id:'n4-work-priority',day:55,title:'Trabalho · prioridade e prazo',symbol:'締',
   objectives:['confirmar prioridade entre tarefas','negociar prazo quando houver impedimento','repetir a instrução para checar entendimento'],
   prerequisites:['n5-autonomy'],vocabulary:['shimekiri','yuusen','kakunin','okure'],grammar:['obligationNaito','softNdesu','conditionTara'],kanji:['締','優','先','確','認','遅'],
   scenarios:[{npc:'この資料を今日中にお願いします。',pt:'Preciso deste material ainda hoje.',reply:'確認ですが、こちらを先にしたほうがいいですか。',replyPt:'Só confirmando: é melhor priorizar este primeiro?'},{npc:'三時までにできますか。',pt:'Consegue até as três?',reply:'少し遅れそうなんですが、四時でも大丈夫ですか。',replyPt:'Parece que vou atrasar um pouco; quatro horas pode ser?'}],
   methods:['discover','freeRecall','cloze','dictation','transfer','roleplay'],templates:['meaning','reading','listenMeaning','sentenceBuild','speak'],
   mastery:{minAccuracy:88,minRetrievals:3,required:['shimekiri','yuusen','softNdesu']}},
  {id:'n4-services-process',day:56,title:'Serviços · formulário e procedimento',symbol:'窓',
   objectives:['perguntar quais documentos são necessários','entender uma sequência de atendimento','pedir que alguém escreva ou confirme informação'],
   prerequisites:['n4-work-priority'],vocabulary:['moushikomi','madoguchi','hitsuyou','henko'],grammar:['givingTeMoraeru','conditionTara','obligationNaito'],kanji:['申','込','窓','必','要','変','更'],
   scenarios:[{npc:'この申し込みには身分証明書が必要です。',pt:'Esta solicitação precisa de documento de identidade.',reply:'必要なものをここに書いてもらえますか。',replyPt:'Pode escrever aqui o que é necessário?'},{npc:'書いたら3番の窓口へ行ってください。',pt:'Depois de preencher, vá ao guichê 3.',reply:'書いたら3番ですね。分かりました。',replyPt:'Depois de preencher, é o guichê 3, certo? Entendi.'}],
   methods:['discover','dictation','freeRecall','cloze','transfer','roleplay'],templates:['meaning','reading','listenMeaning','sentenceBuild','speak'],
   mastery:{minAccuracy:88,minRetrievals:3,required:['madoguchi','hitsuyou','givingTeMoraeru']}},
  {id:'n4-health-context',day:57,title:'Saúde · explicar contexto e orientação',symbol:'症',
   objectives:['descrever duração e intensidade de sintoma','explicar informação relevante antes de um pedido','confirmar instrução de consulta ou medicamento'],
   prerequisites:['n4-services-process'],vocabulary:['netsu','kusuriTecho','yoyakuHenkou','byoujou'],grammar:['softNdesu','conditionTara','purposeYouni'],kanji:['熱','薬','手','帳','症','状'],
   scenarios:[{npc:'いつからこの症状がありますか。',pt:'Desde quando você está com este sintoma?',reply:'昨日からなんですが、今日はもっと痛いです。',replyPt:'É desde ontem, mas hoje dói mais.'},{npc:'熱が出たら、また来てください。',pt:'Se tiver febre, volte novamente.',reply:'熱が出たら来るんですね。分かりました。',replyPt:'Se tiver febre, devo voltar, certo? Entendi.'}],
   methods:['discover','dictation','freeRecall','cloze','transfer','roleplay'],templates:['meaning','reading','listenMeaning','sentenceBuild','speak'],
   mastery:{minAccuracy:89,minRetrievals:3,required:['byoujou','netsu','conditionTara']}},
  {id:'n4-social-plans',day:58,title:'Vida social · convite e disponibilidade',symbol:'予',
   objectives:['fazer convite com contexto','recusar sem encerrar a relação','combinar alternativa de horário'],
   prerequisites:['n4-health-context'],vocabulary:['sasou','yotei','tsugou','zannen'],grammar:['planTsumori','softNdesu','experienceTaKoto'],kanji:['誘','予','定','都','合','残','念'],
   scenarios:[{npc:'土曜日、一緒に食事しませんか。',pt:'Quer jantar comigo no sábado?',reply:'行きたいんですが、土曜日は予定があります。日曜日はどうですか。',replyPt:'Quero ir, mas tenho planos sábado. E domingo?'},{npc:'京都に行ったことがありますか。',pt:'Já foi a Kyoto?',reply:'まだありません。でも来月行くつもりです。',replyPt:'Ainda não. Mas pretendo ir no mês que vem.'}],
   methods:['discover','freeRecall','cloze','transfer','roleplay'],templates:['meaning','reading','listenMeaning','sentenceBuild','speak'],
   mastery:{minAccuracy:89,minRetrievals:3,required:['yotei','tsugou','planTsumori']}},
  {id:'n4-urban-reading',day:59,title:'Leitura urbana · avisos e restrições',symbol:'注',
   objectives:['extrair ação exigida de um aviso','distinguir horário, proibição e orientação','explicar o sentido principal com palavras próprias'],
   prerequisites:['n4-social-plans'],vocabulary:['chuui','kinshi','eigyou','uketsuke'],grammar:['purposeYouni','explanationToIu','obligationNaito'],kanji:['注','意','禁','止','営','業','受','付'],
   scenarios:[{npc:'「立入禁止」と書いてあります。どういう意味ですか。',pt:'Está escrito “entrada proibida”. O que significa?',reply:'ここに入ってはいけないという意味です。',replyPt:'Significa que não pode entrar aqui.'},{npc:'受付は五時までです。',pt:'A recepção funciona até as cinco.',reply:'五時までに行かないといけませんね。',replyPt:'Então preciso ir até as cinco, certo?'}],
   methods:['discover','dictation','freeRecall','cloze','transfer','roleplay'],templates:['meaning','reading','listenMeaning','sentenceBuild','speak'],
   mastery:{minAccuracy:90,minRetrievals:3,required:['kinshi','uketsuke','explanationToIu']}},
  {id:'n4-open-conversation',day:60,title:'Conversa aberta · reformular e sustentar',symbol:'換',
   objectives:['reformular quando faltar uma palavra','dar exemplo para explicar uma ideia','sustentar vários turnos sem abandonar a conversa'],
   prerequisites:['n4-urban-reading'],vocabulary:['iikaeru','tatoeba','tsumari','riyuu'],grammar:['explanationToIu','softNdesu','hearsaySou'],kanji:['言','換','例','理','由'],
   scenarios:[{npc:'もう少し詳しく説明してもらえますか。',pt:'Pode explicar com um pouco mais de detalhe?',reply:'うまく言えないんですが、例えば仕事の予定が急に変わることです。',replyPt:'Não consigo explicar muito bem, mas, por exemplo, é quando o plano de trabalho muda de repente.'},{npc:'つまり、どういう意味ですか。',pt:'Em outras palavras, o que quer dizer?',reply:'つまり、先に確認したほうがいいという意味です。',replyPt:'Em outras palavras, significa que é melhor confirmar primeiro.'}],
   methods:['discover','dictation','freeRecall','cloze','transfer','roleplay'],templates:['meaning','reading','listenMeaning','reverseMeaning','sentenceBuild','speak'],
   mastery:{minAccuracy:90,minRetrievals:4,required:['iikaeru','tatoeba','explanationToIu']}}
 ]
};

function n4PracticalStats(){
 const units=coursePacks.N4.units;
 return {units:units.length,vocabulary:units.flatMap(u=>u.vocabulary).filter((x,i,a)=>a.indexOf(x)===i).length,grammar:units.flatMap(u=>u.grammar).filter((x,i,a)=>a.indexOf(x)===i).length,scenarios:units.reduce((n,u)=>n+u.scenarios.length,0),firstDay:Math.min(...units.map(u=>u.day)),lastDay:Math.max(...units.map(u=>u.day))};
}
