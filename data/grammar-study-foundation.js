// MON applied grammar study content · loaded only with the learning runtime
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
    explanation:'Em português, ordem e preposições fazem muito do trabalho gramatical. No japonês, partículas deixam explícito o papel dos blocos. Isso permite omitir elementos já conhecidos e mudar a ordem com mais liberdade. O objetivo não é decorar traduções soltas, mas reconhecer qual papel cada bloco exerce na situação.',
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
      {jp:'今何時ですか。',pt:'Que horas são agora?',note:'何時 pergunta a hora; 時 é o indicador de horas.'},
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
  return note?{type:'study',...note}:null;
}
