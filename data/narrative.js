// MON recurring narrative network · N5 practical
// A compact episodic layer that reuses prior language in new situations.

const narrativeCharacters={
  yuki:{name:'Yuki',jp:'ゆき',role:'vizinha e primeira amiga',note:'fala de forma clara, mas reduz pistas conforme o aluno ganha autonomia'},
  sato:{name:'Satō-san',jp:'佐藤さん',role:'colega de trabalho',note:'apresenta linguagem de rotina, horários e pedidos'},
  tanaka:{name:'Tanaka-san',jp:'田中さん',role:'atendente recorrente do bairro',note:'reaparece em compras, serviços e telefone'},
  emi:{name:'Emi',jp:'えみ',role:'amiga de Yuki',note:'puxa convites, preferências e conversa espontânea'},
  kobayashi:{name:'Kobayashi-san',jp:'小林さん',role:'senhorio / contato de serviços',note:'traz endereço, regras, telefone e reparos'}
};

const narrativePlaces={
  station:{name:'Estação Sakura',jp:'さくら駅',kind:'transporte'},
  konbini:{name:'Konbini Hoshi',jp:'ほしコンビニ',kind:'compras'},
  home:{name:'Apartamento 203',jp:'203号室',kind:'casa'},
  office:{name:'Escritório Aoba',jp:'あおばオフィス',kind:'trabalho'},
  cafe:{name:'Café Mado',jp:'まどカフェ',kind:'social'},
  clinic:{name:'Clínica Mori',jp:'もりクリニック',kind:'saúde'},
  city:{name:'Centro do bairro',jp:'まちのセンター',kind:'serviços'}
};

const narrativeArcs={
  arrival:{title:'Arco 1 · Cheguei. E agora?',promise:'resolver as primeiras necessidades sem depender de inglês'},
  settling:{title:'Arco 2 · Meu bairro começa a fazer sentido',promise:'conectar casa, tempo, transporte e pessoas'},
  belonging:{title:'Arco 3 · De visitante a morador',promise:'agir, pedir, combinar e manter rotina'},
  autonomy:{title:'Arco 4 · Um dia inteiro em japonês',promise:'explicar, perguntar, resolver e lembrar'}
};

const narrativeEpisodes={
 'n5-station':{arc:'arrival',character:'yuki',place:'station',scenePt:'Você saiu da estação pela saída errada. Yuki está te esperando do outro lado.',sceneJp:'ゆきさんは駅の反対側で待っています。',memoryCue:'Use すみません antes de perguntar.',npc:'駅はどこですか。',npcPt:'Onde fica a estação?',target:'すみません。駅はどこですか。',targetPt:'Com licença. Onde fica a estação?',reuses:['sumimasen','eki','doko']},
 'n5-shopping':{arc:'arrival',character:'tanaka',place:'konbini',scenePt:'No caminho para casa, você compra água. Tanaka-san pergunta sobre a sacola.',sceneJp:'帰りにコンビニで水を買います。',memoryCue:'Você já sabe pedir localização. Agora reutilize すみません para iniciar o atendimento.',npc:'袋はご利用ですか。',npcPt:'Vai precisar de sacola?',target:'いいえ、袋はいりません。水をください。',targetPt:'Não, não preciso de sacola. Água, por favor.',reuses:['sumimasen','mizu','kudasai'],callback:'n5-station'},
 'n5-restaurant':{arc:'arrival',character:'yuki',place:'cafe',scenePt:'Yuki te leva para comer. Você precisa pedir sem apontar em silêncio.',sceneJp:'ゆきさんと初めて店で食べます。',memoryCue:'Recupere これ e o padrão de pedido do konbini.',npc:'ご注文はお決まりですか。',npcPt:'Já decidiu o pedido?',target:'これをお願いします。水もお願いします。',targetPt:'Este, por favor. Água também, por favor.',reuses:['kore','mizu','onegaishimasu'],callback:'n5-shopping'},
 'n5-address':{arc:'arrival',character:'kobayashi',place:'home',scenePt:'Kobayashi-san entrega um formulário do apartamento. Você precisa confirmar onde escrever.',sceneJp:'アパートの書類に住所を書きます。',memoryCue:'Reutilize どこ como pergunta funcional, não como tradução isolada.',npc:'ご住所をお願いします。',npcPt:'Seu endereço, por favor.',target:'住所はここに書きますか。',targetPt:'Escrevo o endereço aqui?',reuses:['juusho','koko','doko'],callback:'n5-station'},
 'n5-work':{arc:'arrival',character:'sato',place:'office',scenePt:'Primeiro dia no escritório. Satō-san apresenta sua mesa e a rotina da manhã.',sceneJp:'今日から仕事が始まります。',memoryCue:'Use すみません quando precisar interromper e よろしくお願いします para abrir a relação.',npc:'今日からよろしくお願いします。',npcPt:'Conto com você a partir de hoje.',target:'こちらこそ、よろしくお願いします。',targetPt:'Igualmente, prazer e conto com você.',reuses:['kyou','yoroshiku','sumimasen'],callback:'n5-address'},
 'n5-health':{arc:'arrival',character:'yuki',place:'clinic',scenePt:'Depois de uma semana corrida, sua cabeça dói. Yuki te acompanha à clínica.',sceneJp:'頭が痛いので、クリニックに行きます。',memoryCue:'Se travar, use o reparo de conversa que já conhece: 分かりません.',npc:'どうしましたか。',npcPt:'O que houve?',target:'頭が痛いです。日本語がまだよく分かりません。',targetPt:'Minha cabeça dói. Ainda não entendo bem japonês.',reuses:['atama','itai','wakarimasen'],callback:'n5-work'},
 'n5-repair':{arc:'arrival',character:'sato',place:'office',scenePt:'Satō-san dá uma instrução rápida demais. Sua tarefa é manter a conversa viva.',sceneJp:'佐藤さんの説明が少し速いです。',memoryCue:'Não finja compreensão. Repare a conversa de forma explícita.',npc:'分かりましたか。',npcPt:'Entendeu?',target:'すみません、もう一度ゆっくりお願いします。',targetPt:'Desculpe, mais uma vez devagar, por favor.',reuses:['sumimasen','mouichido','yukkuri'],callback:'n5-health'},
 'n5-checkpoint':{arc:'arrival',character:'yuki',place:'station',scenePt:'Uma semana depois, Yuki pede que você resolva sozinho um pequeno trajeto e uma compra.',sceneJp:'今日は一人で駅と店に行きます。',memoryCue:'Combine linguagem de transporte, compra e reparo sem esperar um roteiro.',npc:'一人で大丈夫ですか。',npcPt:'Tudo bem ir sozinho?',target:'はい。分からないときは、ゆっくりお願いしますと言います。',targetPt:'Sim. Quando eu não entender, vou pedir para falar devagar.',reuses:['daijoubu','wakarimasen','yukkuri'],callback:'n5-repair'},

 'n5-home':{arc:'settling',character:'kobayashi',place:'home',scenePt:'Você finalmente começa a organizar o apartamento 203 e precisa localizar coisas sem apontar.',sceneJp:'203号室で新しい生活が始まります。',memoryCue:'Endereço virou lugar real. Agora use localização dentro da casa.',npc:'トイレはどこですか。',npcPt:'Onde fica o banheiro?',target:'台所の近くです。',targetPt:'Fica perto da cozinha.',reuses:['toire','daidokoro','chikaku'],callback:'n5-address'},
 'n5-time':{arc:'settling',character:'sato',place:'office',scenePt:'Satō-san combina seu primeiro horário fixo de chegada.',sceneJp:'仕事の時間を確認します。',memoryCue:'Reutilize 今日 e ligue horário a uma ação concreta.',npc:'明日は何時に来ますか。',npcPt:'Que horas você vem amanhã?',target:'七時半に来ます。',targetPt:'Venho às sete e meia.',reuses:['ashita','nanji','han'],callback:'n5-work'},
 'n5-transport':{arc:'settling',character:'yuki',place:'station',scenePt:'Agora você precisa explicar para Yuki como vai ao trabalho.',sceneJp:'毎日の行き方を説明します。',memoryCue:'A estação não é mais destino abstrato: conecte meio de transporte e chegada.',npc:'何で仕事に行きますか。',npcPt:'Como você vai ao trabalho?',target:'電車で行きます。駅で降ります。',targetPt:'Vou de trem. Desço na estação.',reuses:['densha','eki','oriru'],callback:'n5-time'},
 'n5-weather':{arc:'settling',character:'yuki',place:'home',scenePt:'Está chovendo antes de sair. Yuki pergunta se você vai levar guarda-chuva.',sceneJp:'朝から雨です。',memoryCue:'Sua decisão agora depende do clima e do deslocamento aprendido ontem.',npc:'傘を持って行きますか。',npcPt:'Vai levar guarda-chuva?',target:'はい。雨ですから、傘を持って行きます。',targetPt:'Sim. Como está chovendo, vou levar guarda-chuva.',reuses:['ame','kasa','densha'],callback:'n5-transport'},
 'n5-invitation':{arc:'settling',character:'emi',place:'cafe',scenePt:'Emi aparece pela primeira vez e convida você para o Café Mado no dia de folga.',sceneJp:'えみさんに初めて誘われます。',memoryCue:'Use horário e amanhã para negociar o convite, não só dizer sim/não.',npc:'明日、一緒に行きませんか。',npcPt:'Quer ir junto amanhã?',target:'はい。午後なら行けます。',targetPt:'Sim. Se for à tarde, consigo ir.',reuses:['ashita','issho','ikimasenka'],callback:'n5-time'},
 'n5-preference':{arc:'settling',character:'emi',place:'cafe',scenePt:'No café, Emi quer descobrir o que você gosta para escolher algo para dividir.',sceneJp:'カフェで好きなものを話します。',memoryCue:'Recupere comida e bebida do restaurante, agora como preferência pessoal.',npc:'何が好きですか。',npcPt:'Do que você gosta?',target:'日本の食べ物が好きです。',targetPt:'Gosto de comida japonesa.',reuses:['suki','tabemono','nomimono'],callback:'n5-restaurant'},
 'n5-description':{arc:'settling',character:'yuki',place:'konbini',scenePt:'Você e Yuki comparam duas lojas do bairro para decidir onde comprar.',sceneJp:'二つの店を比べます。',memoryCue:'O konbini volta, mas agora o objetivo é descrever, não apenas comprar.',npc:'この店はどうですか。',npcPt:'Como é esta loja?',target:'安いけど、少し遠いです。',targetPt:'É barata, mas fica um pouco longe.',reuses:['yasui','tooku','konbini'],callback:'n5-shopping'},

 'n5-existence':{arc:'belonging',character:'kobayashi',place:'home',scenePt:'Kobayashi-san pergunta se há alguém no apartamento para receber uma entrega.',sceneJp:'荷物が届きます。',memoryCue:'Use a casa que você já conhece para distinguir coisa existente de pessoa presente.',npc:'部屋に誰かいますか。',npcPt:'Tem alguém no quarto?',target:'はい、友達がいます。',targetPt:'Sim, há um amigo.',reuses:['heya','tomodachi','imasu'],callback:'n5-home'},
 'n5-counters':{arc:'belonging',character:'tanaka',place:'konbini',scenePt:'Tanaka-san te reconhece. Desta vez você compra itens para receber amigos em casa.',sceneJp:'友達のために買い物をします。',memoryCue:'Reutilize pedido do primeiro konbini, acrescentando quantidade.',npc:'いくつですか。',npcPt:'Quantos são?',target:'二つください。',targetPt:'Dois, por favor.',reuses:['futatsu','kudasai','tomodachi'],callback:'n5-shopping'},
 'n5-requests':{arc:'belonging',character:'sato',place:'office',scenePt:'No trabalho, Satō-san pede três ações pequenas em sequência.',sceneJp:'仕事で短い指示を聞きます。',memoryCue:'Não traduza ください como uma palavra fixa: perceba o pedido de ação completo.',npc:'少し待ってください。',npcPt:'Espere um pouco, por favor.',target:'はい、分かりました。',targetPt:'Sim, entendi.',reuses:['matte','wakarimasen','shigoto'],callback:'n5-repair'},
 'n5-permission':{arc:'belonging',character:'emi',place:'cafe',scenePt:'Emi quer tirar uma foto dentro do café e pede para você perguntar ao atendente.',sceneJp:'店で写真を撮りたいです。',memoryCue:'O mesmo atendimento de restaurante agora vira negociação de permissão.',npc:'ここで写真を撮ってもいいですか。',npcPt:'Posso tirar foto aqui?',target:'ここで写真を撮ってもいいですか。',targetPt:'Posso tirar foto aqui?',reuses:['koko','shashin','toru'],callback:'n5-restaurant'},
 'n5-desire':{arc:'belonging',character:'emi',place:'cafe',scenePt:'Depois da foto, Emi pergunta o que você realmente quer comer.',sceneJp:'今日は自分で注文を決めます。',memoryCue:'Volte à comida do começo, mas produza desejo, não pedido decorado.',npc:'何を食べたいですか。',npcPt:'O que você quer comer?',target:'ラーメンを食べたいです。',targetPt:'Quero comer ramen.',reuses:['tabetai','tabemono','onegaishimasu'],callback:'n5-preference'},
 'n5-routine':{arc:'belonging',character:'sato',place:'office',scenePt:'Satō-san pergunta como está sua rotina depois das primeiras semanas.',sceneJp:'日本での一日を説明します。',memoryCue:'Conecte horas, trabalho, estudo e volta para casa em um dia real.',npc:'今、何をしていますか。',npcPt:'O que você está fazendo agora?',target:'仕事の後で、日本語を勉強しています。',targetPt:'Depois do trabalho, estou estudando japonês.',reuses:['shigoto','benkyou','yoru'],callback:'n5-time'},
 'n5-frequency':{arc:'belonging',character:'yuki',place:'home',scenePt:'Yuki percebe que seu japonês está mudando e pergunta quanto você usa no dia a dia.',sceneJp:'日本語を使う回数が増えました。',memoryCue:'Responda com hábito, não com uma frase isolada de “sim/não”.',npc:'よく日本語を使いますか。',npcPt:'Você usa japonês com frequência?',target:'はい。仕事で時々使います。',targetPt:'Sim. Às vezes uso no trabalho.',reuses:['yoku','tokidoki','shigoto'],callback:'n5-routine'},

 'n5-past':{arc:'autonomy',character:'yuki',place:'home',scenePt:'Yuki pergunta como foi seu dia anterior. Agora você precisa narrar, não apenas reagir.',sceneJp:'昨日のことを話します。',memoryCue:'Recupere trabalho e estudo, mas mova tudo para o passado.',npc:'昨日、何をしましたか。',npcPt:'O que você fez ontem?',target:'仕事の後で、日本語を勉強しました。',targetPt:'Depois do trabalho, estudei japonês.',reuses:['kinou','shigoto','benkyou'],callback:'n5-routine'},
 'n5-sequence':{arc:'autonomy',character:'sato',place:'office',scenePt:'Satō-san pede que você explique a ordem de duas tarefas.',sceneJp:'仕事の順番を説明します。',memoryCue:'Use 前 e 後 para transformar eventos passados em sequência.',npc:'仕事の前に何をしますか。',npcPt:'O que você faz antes do trabalho?',target:'仕事の前に、駅でコーヒーを買います。',targetPt:'Antes do trabalho, compro café na estação.',reuses:['mae','ato','eki'],callback:'n5-past'},
 'n5-reason':{arc:'autonomy',character:'emi',place:'cafe',scenePt:'Emi convida você de novo, mas desta vez você precisa recusar dando um motivo.',sceneJp:'誘いを理由つきで断ります。',memoryCue:'O convite antigo volta com uma exigência nova: explicar por quê.',npc:'今日、一緒に行きませんか。',npcPt:'Quer ir junto hoje?',target:'すみません。仕事がありますから、行きません。',targetPt:'Desculpe. Não vou porque tenho trabalho.',reuses:['issho','shigoto','kara'],callback:'n5-invitation'},
 'n5-questions':{arc:'autonomy',character:'tanaka',place:'konbini',scenePt:'Tanaka-san já te conhece. Você aproveita para manter uma conversa curta sem roteiro.',sceneJp:'買い物のあとで少し話します。',memoryCue:'Transforme palavras interrogativas em uma conversa, não numa lista de tradução.',npc:'いつ日本に来ましたか。',npcPt:'Quando você veio ao Japão?',target:'先月来ました。田中さんはここでいつから働いていますか。',targetPt:'Vim no mês passado. Tanaka-san trabalha aqui desde quando?',reuses:['itsu','hataraku','konbini'],callback:'n5-work'},
 'n5-already':{arc:'autonomy',character:'kobayashi',place:'home',scenePt:'Kobayashi-san liga para confirmar uma reserva de manutenção do apartamento.',sceneJp:'アパートの予約を確認します。',memoryCue:'Telefone e casa se encontram: diga o que já foi feito e o que ainda falta.',npc:'もう予約しましたか。',npcPt:'Já fez a reserva?',target:'はい、もう予約しました。',targetPt:'Sim, já fiz a reserva.',reuses:['mou','yoyaku','ie'],callback:'n5-home'},
 'n5-phone':{arc:'autonomy',character:'kobayashi',place:'city',scenePt:'Você precisa resolver uma mudança de horário por telefone sem Yuki ao lado.',sceneJp:'一人で電話をします。',memoryCue:'Use nome, horário e reparo de conversa na mesma interação.',npc:'お名前と電話番号をお願いします。',npcPt:'Seu nome e telefone, por favor.',target:'パウロです。時間を変更したいです。',targetPt:'Sou Paulo. Quero mudar o horário.',reuses:['namae','denwa','jikanhenkou'],callback:'n5-time'},
 'n5-autonomy':{arc:'autonomy',character:'yuki',place:'station',scenePt:'Um mês depois, Yuki só observa. Você organiza sozinho reserva, horário, trem e encontro.',sceneJp:'今日は最初から最後まで一人で動きます。',memoryCue:'Não procure uma frase perfeita. Combine recursos conhecidos e repare a conversa se necessário.',npc:'今日は何をしますか。',npcPt:'O que você vai fazer hoje?',target:'十時の予約があります。電車で行って、分からないときは聞きます。',targetPt:'Tenho uma reserva às dez. Vou de trem e, quando não entender, vou perguntar.',reuses:['yoyaku','densha','wakarimasen','nanji'],callback:'n5-phone'}
};

function narrativeEpisodeForUnit(unitOrId){
  const id=typeof unitOrId==='string'?unitOrId:unitOrId?.id;
  const ep=narrativeEpisodes[id];if(!ep)return null;
  return {...ep,character:narrativeCharacters[ep.character],place:narrativePlaces[ep.place],arcMeta:narrativeArcs[ep.arc]};
}
function narrativeEchoExercise(unit){
  const ep=narrativeEpisodeForUnit(unit);if(!ep)return null;
  return {
    type:'transfer',
    prompt:'Cena recorrente: responda sem copiar uma frase antiga.',
    cue:ep.scenePt,
    target:ep.target.replace(/[。！？!?]/g,''),
    accepted:[ep.target,ep.target.replace(/[。！？!?]/g,'')],
    why:`${ep.target} · ${ep.targetPt}`,
    bridge:`Eco de memória: ${ep.memoryCue}`,
    method:'transfer',
    _story:{
      arc:ep.arcMeta.title,
      character:ep.character.name,
      role:ep.character.role,
      place:ep.place.name,
      scenePt:ep.scenePt,
      sceneJp:ep.sceneJp,
      reuses:ep.reuses,
      callback:ep.callback||null
    }
  };
}
function narrativeCoverage(){
  const units=coursePacks.N5.units,covered=units.filter(u=>narrativeEpisodes[u.id]);
  const chars={};for(const ep of Object.values(narrativeEpisodes))chars[ep.character]=(chars[ep.character]||0)+1;
  return {units:units.length,covered:covered.length,characters:chars,arcs:Object.keys(narrativeArcs).length};
}
