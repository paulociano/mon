// MON session/lesson datasets · loaded only for active learning
const foundationSessionPlans = [{"day":1,"kana":"あ","roman":"a","word":"あさ","wordReading":"asa","pt":"manhã","phrase":"おはようございます。","phrasePt":"Bom dia.","concept":"Vogais japonesas são curtas e estáveis.","conceptOptions":["Vogais japonesas são curtas e estáveis.","Toda vogal vira ditongo.","A letra u é sempre muda.","Toda palavra termina com consoante."]},{"day":2,"kana":"し","roman":"shi","word":"すし","wordReading":"sushi","pt":"sushi","phrase":"すみません。","phrasePt":"Com licença / desculpe.","concept":"し é uma unidade sonora própria; romaji é só apoio.","conceptOptions":["し é uma unidade sonora própria; romaji é só apoio.","し deve soar como si português perfeito.","し é sempre lido chi.","Romaji substitui o kana no longo prazo."]},{"day":3,"kana":"つ","roman":"tsu","word":"みち","wordReading":"michi","pt":"caminho","phrase":"これはなんですか。","phrasePt":"O que é isto?","concept":"ち e つ merecem treino auditivo separado.","conceptOptions":["ち e つ merecem treino auditivo separado.","ち e つ têm o mesmo som.","つ é sempre su.","O t desaparece em toda palavra."]},{"day":4,"kana":"ふ","roman":"fu","word":"ふね","wordReading":"fune","pt":"barco","phrase":"ありがとうございます。","phrasePt":"Muito obrigado(a).","concept":"ふ usa os lábios de forma diferente do f português/inglês.","conceptOptions":["ふ usa os lábios de forma diferente do f português/inglês.","ふ é um v forte.","ふ é mudo.","ふ sempre vira hu inglês."]},{"day":5,"kana":"ら","roman":"ra","word":"そら","wordReading":"sora","pt":"céu","phrase":"わかりません。","phrasePt":"Não entendo.","concept":"O r japonês é um toque curto da língua.","conceptOptions":["O r japonês é um toque curto da língua.","É o r inglês prolongado.","É sempre o rr forte do português.","É idêntico a l em qualquer contexto."]},{"day":6,"kana":"が","roman":"ga","word":"かぎ","wordReading":"kagi","pt":"chave","phrase":"もういちどおねがいします。","phrasePt":"Mais uma vez, por favor.","concept":"Dakuten muda a sonoridade de várias linhas do kana.","conceptOptions":["Dakuten muda a sonoridade de várias linhas do kana.","Dakuten indica plural.","Dakuten transforma kana em kanji.","Dakuten marca vogal longa."]},{"day":7,"kana":"きょ","roman":"kyo","word":"きょう","wordReading":"kyou","pt":"hoje","phrase":"ゆっくりおねがいします。","phrasePt":"Mais devagar, por favor.","concept":"ゃゅょ pequenos combinam com kana da coluna i.","conceptOptions":["ゃゅょ pequenos combinam com kana da coluna i.","ゃゅょ sempre valem uma palavra inteira.","ょ é pontuação.","Combinações yōon usam romaji obrigatoriamente."]},{"day":8,"kana":"ア","roman":"a","word":"アイス","wordReading":"aisu","pt":"sorvete","phrase":"コーヒーをおねがいします。","phrasePt":"Café, por favor.","concept":"Katakana representa os mesmos sons básicos do hiragana.","conceptOptions":["Katakana representa os mesmos sons básicos do hiragana.","Katakana é um alfabeto latino.","Katakana só aparece em manga.","Katakana não usa vogais longas."]},{"day":9,"kana":"ツ","roman":"tsu","word":"ホテル","wordReading":"hoteru","pt":"hotel","phrase":"ホテルはどこですか。","phrasePt":"Onde fica o hotel?","concept":"シ/ツ se distinguem pela direção e origem dos traços.","conceptOptions":["シ/ツ se distinguem pela direção e origem dos traços.","シ e ツ são variantes livres.","ツ é sempre pequeno.","Katakana não precisa de ordem de traço."]},{"day":10,"kana":"ン","roman":"n","word":"コンビニ","wordReading":"konbini","pt":"loja de conveniência","phrase":"コンビニでかいます。","phrasePt":"Compro no konbini.","concept":"ソ/ン exigem contraste visual deliberado, não memorização isolada.","conceptOptions":["ソ/ン exigem contraste visual deliberado, não memorização isolada.","ソ e ン têm exatamente o mesmo desenho.","ン significa n apenas no fim da frase.","Katakana não aparece em lojas."]},{"day":11,"kana":"ー","roman":"chouon","word":"スーパー","wordReading":"suupaa","pt":"supermercado","phrase":"スーパーはちかいです。","phrasePt":"O supermercado é perto.","concept":"Duração é parte da palavra; ー prolonga a vogal anterior no katakana.","conceptOptions":["Duração é parte da palavra; ー prolonga a vogal anterior no katakana.","ー é hífen comum.","Vogais longas nunca mudam palavras.","ー só aparece em nomes próprios."]},{"day":12,"kana":"字","roman":"ji","word":"タクシー","wordReading":"takushii","pt":"táxi","phrase":"タクシーをおねがいします。","phrasePt":"Um táxi, por favor.","concept":"O objetivo é ler kana sem converter cada símbolo para romaji.","conceptOptions":["O objetivo é ler kana sem converter cada símbolo para romaji.","Romaji deve permanecer para sempre abaixo de cada palavra.","Katakana substitui hiragana em frases formais.","Kana só serve antes de aprender kanji."]},{"day":13,"kana":"は","roman":"wa","word":"わたし","wordReading":"watashi","pt":"eu","phrase":"わたしはパウロです。","phrasePt":"Eu sou Paulo.","concept":"は marca o tópico; です fecha uma identificação polida.","conceptOptions":["は marca o tópico; です fecha uma identificação polida.","は sempre significa “é”.","です é um pronome.","は é pronunciado ha em qualquer uso."]},{"day":14,"kana":"を","roman":"o","word":"みず","wordReading":"mizu","pt":"água","phrase":"みずをのみます。","phrasePt":"Bebo água.","concept":"を marca o objeto direto; が frequentemente marca sujeito/foco.","conceptOptions":["を marca o objeto direto; が frequentemente marca sujeito/foco.","を marca sempre destino.","が significa “de”.","は e が são intercambiáveis em toda frase."]},{"day":15,"kana":"に","roman":"ni","word":"えき","wordReading":"eki","pt":"estação","phrase":"しちじにえきへいきます。","phrasePt":"Vou à estação às sete.","concept":"に marca tempo/destino em muitos usos; で marca onde a ação acontece.","conceptOptions":["に marca tempo/destino em muitos usos; で marca onde a ação acontece.","で marca sempre posse.","へ marca objeto direto.","に e で nunca aparecem com lugares."]},{"day":16,"kana":"の","roman":"no","word":"ともだち","wordReading":"tomodachi","pt":"amigo","phrase":"ともだちといきます。","phrasePt":"Vou com um amigo.","concept":"の liga substantivos; と marca companhia/citação; も adiciona “também”.","conceptOptions":["の liga substantivos; と marca companhia/citação; も adiciona “também”.","の transforma todo verbo em passado.","も é apenas plural.","と só existe em citações formais."]},{"day":17,"kana":"ます","roman":"masu","word":"たべます","wordReading":"tabemasu","pt":"comer (polido)","phrase":"ここでたべます。","phrasePt":"Como aqui.","concept":"Na fala polida básica, o verbo costuma fechar a frase com ます.","conceptOptions":["Na fala polida básica, o verbo costuma fechar a frase com ます.","ます marca sujeito.","Todo verbo japonês termina em ます no dicionário.","O verbo deve vir antes do objeto."]},{"day":18,"kana":"た","roman":"ta","word":"いきました","wordReading":"ikimashita","pt":"fui","phrase":"きのうえきにいきました。","phrasePt":"Ontem fui à estação.","concept":"ません nega; ました marca passado polido; tempo costuma vir por advérbio/contexto.","conceptOptions":["ません nega; ました marca passado polido; tempo costuma vir por advérbio/contexto.","ました significa futuro.","ません é uma partícula de lugar.","Japonês exige pronome sujeito no passado."]},{"day":19,"kana":"て","roman":"te","word":"まって","wordReading":"matte","pt":"espere","phrase":"ちょっとまってください。","phrasePt":"Espere um pouco, por favor.","concept":"A forma て conecta ações e aparece em pedidos como 〜てください.","conceptOptions":["A forma て conecta ações e aparece em pedidos como 〜てください.","て é sempre passado.","ください torna qualquer frase negativa.","Forma て só existe em escrita formal."]},{"day":20,"kana":"い","roman":"i","word":"やすい","wordReading":"yasui","pt":"barato","phrase":"このみせはやすいです。","phrasePt":"Esta loja é barata.","concept":"Adjetivos い e な conjugam de modos diferentes; não concordam em gênero.","conceptOptions":["Adjetivos い e な conjugam de modos diferentes; não concordam em gênero.","Adjetivos japoneses mudam para masculino/feminino.","な é sempre pronunciado depois de todo adjetivo.","い-adjetivos nunca podem predicar."]},{"day":21,"kana":"ある","roman":"aru","word":"あります","wordReading":"arimasu","pt":"há (coisa)","phrase":"えきのまえにみせがあります。","phrasePt":"Há uma loja em frente à estação.","concept":"あります é usado para inanimados; います para pessoas/animais.","conceptOptions":["あります é usado para inanimados; います para pessoas/animais.","います é só passado de あります.","あります marca objeto direto.","Existência não usa lugar."]},{"day":22,"kana":"時","roman":"ji","word":"なんじ","wordReading":"nanji","pt":"que horas","phrase":"いまなんじですか。","phrasePt":"Que horas são agora?","concept":"Japonês usa contadores e leituras que dependem da categoria; números sozinhos não resolvem tudo.","conceptOptions":["Japonês usa contadores e leituras que dependem da categoria; números sozinhos não resolvem tudo.","Todos os objetos usam o mesmo contador.","時 significa apenas dia da semana.","Preço não usa 円."]},{"day":23,"kana":"から","roman":"kara","word":"だから","wordReading":"dakara","pt":"por isso","phrase":"いそがしいから、いきません。","phrasePt":"Como estou ocupado, não vou.","concept":"Formas simples abrem conectores como から e けど; contexto passa a carregar mais informação.","conceptOptions":["Formas simples abrem conectores como から e けど; contexto passa a carregar mais informação.","から marca sempre destino.","Forma simples é apenas gíria.","けど só pode terminar perguntas."]},{"day":24,"kana":"門","roman":"mon","word":"にほんご","wordReading":"nihongo","pt":"japonês","phrase":"にほんごがまだよくわかりません。ゆっくりおねがいします。","phrasePt":"Ainda não entendo bem japonês. Mais devagar, por favor.","concept":"Domínio inicial significa conseguir reparar a conversa, ler kana e montar frases úteis sob pressão.","conceptOptions":["Domínio inicial significa conseguir reparar a conversa, ler kana e montar frases úteis sob pressão.","Domínio significa memorizar todas as regras antes de falar.","Romaji deve ser usado em toda conversa.","Kanji precisa ser dominado antes de hiragana."]}];
const foundationStudyNotes={
  13:{
    title:'は e です · construir uma identificação',
    mentalModel:'Pense em は como um holofote: ele anuncia sobre o que a frase vai falar; です fecha a informação de modo polido.',
    explanation:'Em japonês, a frase não precisa copiar a ordem do português. Em A は B です, primeiro você estabelece o tópico A e depois informa B sobre ele. は não significa “é”, e です não funciona como um verbo equivalente ao português em todos os contextos. O padrão inteiro serve para apresentar, identificar e classificar algo de forma neutra e polida.',
    examples:[
      {jp:'わたしはパウロです。',pt:'Eu sou Paulo.',note:'わたし é o tópico; パウロです fornece a identificação.'},
      {jp:'これは水です。',pt:'Isto é água.',note:'これ vira o tópico da frase; 水 identifica o que é.'}
    ],
    contrast:'Não confunda は com が: は organiza o tópico da conversa; が costuma destacar quem ou o que satisfaz uma condição ou está em foco.',
    realWorldUse:'Apresentações, identificação de objetos, nacionalidade, profissão e perguntas simples.'
  },
  14:{
    title:'は・が・を · papéis, não traduções fixas',
    mentalModel:'As partículas são etiquetas de função: は organiza o tópico, が destaca o foco/sujeito e を marca aquilo que recebe a ação.',
    explanation:'Em português, ordem e preposições fazem muito do trabalho gramatical. No japonês, partículas deixam explícito o papel dos blocos. Isso permite omitir elementos já conhecidos e mudar a ordem com mais liberdade. O objetivo não é decorar “は = quanto a”, “が = sujeito” e “を = objeto”, mas reconhecer qual papel cada bloco exerce na situação.',
    examples:[
      {jp:'わたしは水をのみます。',pt:'Eu bebo água.',note:'わたし é o tópico e 水 é o objeto de のみます.'},
      {jp:'ねこがいます。',pt:'Há um gato.',note:'が destaca a entidade cuja existência está sendo apresentada.'}
    ],
    contrast:'は e が podem aparecer em contextos parecidos, mas não são intercambiáveis mecanicamente. は organiza informação conhecida; が frequentemente introduz ou focaliza informação.',
    realWorldUse:'Conversas básicas, pedidos, descrição do que existe e construção de frases com verbos.'
  },
  15:{
    title:'に・で・へ · destino, palco e direção',
    mentalModel:'に aponta para um ponto; で marca o palco onde uma ação acontece; へ aponta a direção do movimento.',
    explanation:'Essas partículas costumam virar “em”, “para” ou “a” em português, mas o japonês distingue a função. Use に para destino, horário específico e vários contextos de existência. Use で para o lugar onde uma ação acontece. Use へ quando a ideia importante é a direção do movimento. Pensar na função evita escolher a partícula pela tradução.',
    examples:[
      {jp:'駅に行きます。',pt:'Vou para a estação.',note:'駅 é o destino do movimento, por isso に.'},
      {jp:'駅で食べます。',pt:'Como na estação.',note:'A estação é o palco da ação de comer, por isso で.'},
      {jp:'日本へ行きます。',pt:'Vou em direção ao Japão.',note:'へ enfatiza a direção do movimento.'}
    ],
    contrast:'Compare 駅に行きます com 駅で食べます: o mesmo lugar recebe partículas diferentes porque exerce funções diferentes.',
    realWorldUse:'Transporte, horários, encontros, restaurantes, compras e orientação.'
  },
  16:{
    title:'の・と・も・か · conectar relações e intenções',
    mentalModel:'の conecta nomes, と conecta companhia ou conteúdo citado, も adiciona “também” e か transforma a intenção em pergunta.',
    explanation:'Essas partículas criam relações entre blocos sem exigir frases longas. の liga dois substantivos em uma relação que o contexto especifica, como posse, origem ou categoria. と pode marcar companhia e também conteúdo citado. も adiciona uma entidade à mesma afirmação. か, no padrão polido, deixa explícita a intenção interrogativa no fim.',
    examples:[
      {jp:'わたしの友だちです。',pt:'É meu amigo.',note:'の conecta わたし e 友だち em uma relação de pertencimento.'},
      {jp:'友だちと行きます。',pt:'Vou com um amigo.',note:'と marca companhia.'},
      {jp:'わたしも行きます。',pt:'Eu também vou.',note:'も inclui わたし na mesma ação.'}
    ],
    contrast:'Não trate の como “de” em qualquer frase. Ele conecta substantivos; a relação exata vem do contexto.',
    realWorldUse:'Apresentar pessoas, falar de companhia, pertences, categorias e fazer perguntas.'
  },
  17:{
    title:'Verbos ます · a ação fecha a frase',
    mentalModel:'Em japonês, o verbo funciona como o motor que fecha a oração; ます coloca esse motor em registro polido.',
    explanation:'Na fala polida básica, o verbo costuma aparecer no fim e carregar a informação principal de ação. Objetos, lugares e tempo aparecem antes com partículas. ます não é parte da forma de dicionário e não significa “presente” sozinho: é uma terminação polida usada em afirmações não passadas. Essa estrutura permite omitir o sujeito quando ele já está claro.',
    examples:[
      {jp:'水を飲みます。',pt:'Bebo água.',note:'水 é o objeto e 飲みます fecha a ação.'},
      {jp:'ここで食べます。',pt:'Como aqui.',note:'ここで informa onde; 食べます encerra a oração.'}
    ],
    contrast:'A forma de dicionário 食べる e a forma polida 食べます pertencem ao mesmo verbo, mas servem a registros e construções diferentes.',
    realWorldUse:'Pedidos, rotina, deslocamento, trabalho e praticamente toda interação polida inicial.'
  },
  18:{
    title:'Negativo e passado · mudar o final, não reconstruir a frase',
    mentalModel:'Tempo e polaridade ficam concentrados no predicado: altere o final do verbo e mantenha os demais blocos estáveis.',
    explanation:'Com verbos em ます, ません cria a forma negativa, ました marca passado afirmativo e ませんでした combina passado e negação. Advérbios como きのう ajudam a localizar a ação no tempo, mas a terminação do verbo continua mostrando a forma gramatical. Isso permite reutilizar a mesma estrutura mudando apenas o predicado.',
    examples:[
      {jp:'今日は行きません。',pt:'Hoje não vou.',note:'行きません muda a ação para negativa.'},
      {jp:'きのう駅に行きました。',pt:'Ontem fui à estação.',note:'行きました marca a ação como passada.'}
    ],
    contrast:'ません não significa passado. ました não significa futuro. A diferença está na terminação completa do verbo.',
    realWorldUse:'Dizer o que fez, não fez, vai ou não vai fazer em rotina, agenda e serviços.'
  },
  19:{
    title:'Forma て · conectar e pedir uma ação',
    mentalModel:'A forma て deixa o verbo “aberto” para se conectar ao que vem depois, em vez de encerrar a frase sozinho.',
    explanation:'A forma て é uma base extremamente produtiva. Ela conecta ações, participa de pedidos e abre várias construções posteriores. Em 〜てください, a forma て apresenta a ação e ください transforma o conjunto em um pedido educado. O importante é aprender a função de conexão, não traduzir て como uma palavra isolada.',
    examples:[
      {jp:'ちょっと待ってください。',pt:'Espere um pouco, por favor.',note:'待って apresenta a ação; ください cria o pedido.'},
      {jp:'見てください。',pt:'Olhe, por favor.',note:'見て é a forma て de 見る.'}
    ],
    contrast:'Forma て não é passado. Ela precisa do contexto ou de outra construção para completar a função da oração.',
    realWorldUse:'Pedidos, instruções, sequências de ações e futuras construções como ています.'
  },
  20:{
    title:'Adjetivos い e な · dois comportamentos, nenhuma concordância de gênero',
    mentalModel:'Adjetivos japoneses descrevem estados, mas os grupos い e な seguem mecânicas diferentes; não tente aplicar masculino/feminino do português.',
    explanation:'Os adjetivos い podem funcionar diretamente antes de um substantivo e também mudar de forma para passado ou negação. Os chamados adjetivos な usam な antes de substantivos em posição atributiva, mas não precisam dele quando predicam com です. Nenhum dos grupos muda por gênero ou plural como no português.',
    examples:[
      {jp:'この店は安いです。',pt:'Esta loja é barata.',note:'安い é um adjetivo い usado como predicado.'},
      {jp:'静かな店です。',pt:'É uma loja tranquila.',note:'静か usa な antes do substantivo 店.'}
    ],
    contrast:'Não coloque な depois de todo adjetivo. Ele é uma ligação específica dos adjetivos な quando qualificam um substantivo.',
    realWorldUse:'Descrever preços, lugares, clima, pessoas, objetos e preferências.'
  },
  21:{
    title:'あります・います · existência depende do tipo de entidade',
    mentalModel:'Use あります para coisas/inanimados e います para pessoas e animais; o lugar funciona como referência da existência.',
    explanation:'Japonês distingue a existência de seres animados e inanimados. Um padrão comum é Lugar に X が あります/います: に marca o ponto onde algo existe, が apresenta a entidade e o verbo de existência fecha a frase. Essa estrutura é diferente de descrever uma ação acontecendo em determinado lugar com で.',
    examples:[
      {jp:'駅の前に店があります。',pt:'Há uma loja em frente à estação.',note:'店 é inanimado, por isso あります.'},
      {jp:'部屋に人がいます。',pt:'Há uma pessoa no quarto.',note:'人 é pessoa, por isso います.'}
    ],
    contrast:'Compare 部屋に人がいます com 部屋で人が食べます: に marca existência; で marca onde a ação de comer acontece.',
    realWorldUse:'Localizar lojas, pessoas, banheiros, objetos, serviços e pontos de referência.'
  },
  22:{
    title:'Números, horas e contadores · quantidade tem categoria',
    mentalModel:'No japonês, contar não é apenas dizer um número: muitas vezes você combina número + contador adequado à categoria.',
    explanation:'Horas usam 時, pessoas usam 人 e diferentes objetos podem pedir contadores específicos. Algumas leituras mudam por combinação e precisam ser aprendidas em blocos frequentes. Para começar, o objetivo é reconhecer os contadores mais úteis e entender que o número sozinho nem sempre comunica a categoria daquilo que está sendo contado.',
    examples:[
      {jp:'今何時ですか。',pt:'Que horas são agora?',note:'何時 pergunta a hora; 時 é o contador/indicador de horas.'},
      {jp:'二人です。',pt:'São duas pessoas.',note:'二人 usa a leitura especial ふたり.'},
      {jp:'水を二つください。',pt:'Duas águas, por favor.',note:'つ funciona como contador geral em vários pedidos simples.'}
    ],
    contrast:'Não procure um único contador universal. Priorize os contadores funcionais que aparecem nas situações que você realmente precisa resolver.',
    realWorldUse:'Preço, restaurante, compras, horários, reservas, bilhetes e quantidade de pessoas.'
  },
  23:{
    title:'Forma simples, から e けど · explicar motivo e contraste',
    mentalModel:'A forma simples permite encaixar uma oração dentro de uma ideia maior; から acrescenta motivo e けど abre contraste ou suavização.',
    explanation:'Quando você sai do padrão polido isolado e começa a ligar ideias, formas simples aparecem com frequência. から pode conectar uma causa à consequência, enquanto けど introduz contraste e muitas vezes deixa a conclusão implícita na conversa. O contexto passa a carregar mais informação, então traduzir palavra por palavra se torna cada vez menos confiável.',
    examples:[
      {jp:'忙しいから、行きません。',pt:'Como estou ocupado, não vou.',note:'忙しい apresenta o motivo; から conecta à consequência.'},
      {jp:'行きたいけど、時間がありません。',pt:'Quero ir, mas não tenho tempo.',note:'けど cria o contraste entre desejo e limitação.'}
    ],
    contrast:'から aqui expressa motivo, mas a mesma forma também pode marcar origem em outros contextos. A função vem da estrutura completa.',
    realWorldUse:'Explicar decisões, recusar, justificar atrasos, negociar planos e manter conversas menos telegráficas.'
  },
  24:{
    title:'Sobrevivência integrada · contexto, omissão e reparo',
    mentalModel:'Autonomia inicial não é conhecer todas as regras: é reconhecer funções, montar blocos úteis e reparar a conversa quando algo falha.',
    explanation:'Em situações reais, japonês frequentemente omite sujeito e outras informações já compartilhadas. Por isso, compreender partículas, finais verbais e blocos funcionais vale mais do que exigir tradução completa de cada palavra. Quando faltar compreensão, use estratégias de reparo explícitas para pedir repetição, velocidade menor ou esclarecimento, mantendo a interação viva.',
    examples:[
      {jp:'日本語がまだよく分かりません。',pt:'Ainda não entendo bem japonês.',note:'が focaliza 日本語 como aquilo cuja compreensão está limitada.'},
      {jp:'もう一度お願いします。',pt:'Mais uma vez, por favor.',note:'Um bloco completo de reparo evita travar a conversa.'},
      {jp:'ゆっくりお願いします。',pt:'Mais devagar, por favor.',note:'A intenção funcional importa mais que montar uma frase longa.'}
    ],
    contrast:'Não espere dominar toda a gramática para falar. Use o que reconhece, preserve a intenção e repare a conversa quando necessário.',
    realWorldUse:'Qualquer situação em que você não entendeu tudo, mas ainda precisa completar uma tarefa.'
  }
};

function foundationStudyBlock(day){
  const note=foundationStudyNotes[day];
  return note?{type:'study',...note,method:'study'}:null;
}

const microReadings=[
 {jp:'東京駅はどこですか。',pt:'Onde fica a Estação de Tóquio?',insight:'X は どこですか transforma um lugar em pergunta de localização.'},
 {jp:'袋はいりません。',pt:'Não preciso de sacola.',insight:'X は いりません é uma forma direta e útil de recusar algo.'},
 {jp:'水をお願いします。',pt:'Água, por favor.',insight:'X を お願いします funciona para pedidos simples e educados.'},
 {jp:'ここに書けばいいですか。',pt:'É só escrever aqui?',insight:'〜ばいいですか pergunta o que é apropriado/fazer para resolver algo.'},
 {jp:'もう一度お願いします。',pt:'Mais uma vez, por favor.',insight:'Uma ferramenta de reparo vale mais que fingir compreensão.'},
 {jp:'頭が痛いです。',pt:'Minha cabeça dói.',insight:'Parte do corpo + が + 痛いです comunica dor de forma básica.'}
];
const diagnosticItems=[{"q":"Qual som corresponde a あ?","options":["a","i","u","e"],"correct":0,"why":"あ representa /a/."},{"q":"Qual é a leitura de ツ?","options":["tsu","shi","so","n"],"correct":0,"why":"ツ é tsu; contraste visual com シ é um ponto clássico de treino."},{"q":"Em きって, o pequeno っ faz o quê?","options":["segura a consoante seguinte por uma mora","alonga a vogal anterior","marca uma pergunta","transforma a palavra em katakana"],"correct":0,"why":"っ ocupa uma mora e prepara/gemina a consoante seguinte."},{"q":"Em 水を飲みます, を marca principalmente…","options":["o objeto da ação","o destino","o lugar da ação","o tópico"],"correct":0,"why":"を marca o objeto direto: água é aquilo que se bebe."},{"q":"Qual frase significa “Ainda não entendo bem japonês”?","options":["日本語がまだよく分かりません。","日本語を話します。","駅はどこですか。","これをください。"],"correct":0,"why":"まだ + よく分かりません comunica compreensão ainda limitada."},{"q":"Em コンビニで買います, で indica…","options":["onde a ação acontece","quem possui algo","o objeto direto","o passado"],"correct":0,"why":"で marca o local da ação: comprar acontece no konbini."},{"q":"Qual forma é um pedido educado para “espere”?","options":["待ってください。","待ちません。","待ちました。","待つです。"],"correct":0,"why":"Forma て + ください é um padrão básico de pedido."},{"q":"Qual ferramenta mantém a conversa quando você não entendeu?","options":["もう一度お願いします。","いただきます。","おめでとうございます。","いってきます。"],"correct":0,"why":"もう一度お願いします pede repetição e funciona como estratégia de reparo."}];
