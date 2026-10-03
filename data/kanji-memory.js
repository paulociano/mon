// MON Kanji Memory Lab 2.0 content
// Visual components are mnemonic decomposition, not claims about historical etymology.

const kanjiVisualMeta={
 '駅':{parts:['馬','尺'],cue:'cavalo + medida → ponto de viagem',family:'movement',contrast:['験','駅'],scene:'Imagine a plataforma medindo a chegada de cada trem.'},
 '日':{parts:['☀'],cue:'um quadro de luz',family:'time',contrast:['目','日'],scene:'Um sol enquadrado marcando o dia.'},
 '月':{parts:['月'],cue:'lua estreita',family:'time',contrast:['用','月'],scene:'A lua vira seu marcador de mês.'},
 '時':{parts:['日','寺'],cue:'dia + templo',family:'time',contrast:['待','時'],scene:'O sino do templo divide as horas do dia.'},
 '人':{parts:['人'],cue:'duas pernas',family:'people',contrast:['入','人'],scene:'Uma pessoa caminhando.'},
 '大':{parts:['人','一'],cue:'pessoa com braços abertos',family:'shape',contrast:['犬','大'],scene:'Abra os braços para mostrar algo grande.'},
 '小':{parts:['小'],cue:'três pontos pequenos',family:'shape',contrast:['少','小'],scene:'Pequenos fragmentos separados.'},
 '山':{parts:['山'],cue:'três picos',family:'place',contrast:['出','山'],scene:'Três picos no horizonte.'},
 '川':{parts:['川'],cue:'três fluxos',family:'place',contrast:['州','川'],scene:'Três linhas de água correndo.'},
 '口':{parts:['口'],cue:'abertura quadrada',family:'body',contrast:['日','口'],scene:'Uma boca aberta em forma de quadro.'},
 '木':{parts:['木'],cue:'tronco + galhos',family:'material',contrast:['本','木'],scene:'Um tronco atravessado por galhos.'},
 '本':{parts:['木','一'],cue:'árvore + marca na raiz',family:'material',contrast:['木','本'],scene:'Marque a base da árvore: origem, livro-base.'},
 '水':{parts:['水'],cue:'fluxo central + gotas',family:'nature',contrast:['氷','水'],scene:'Água espirrando para os lados.'},
 '火':{parts:['火'],cue:'chama + faíscas',family:'nature',contrast:['人','火'],scene:'Uma chama subindo e duas faíscas.'},
 '金':{parts:['金'],cue:'metal sob cobertura',family:'material',contrast:['全','金'],scene:'Algo valioso protegido sob um teto.'},
 '電':{parts:['雨','田'],cue:'chuva + campo + descarga',family:'movement',contrast:['雷','電'],scene:'Uma descarga atravessa a chuva sobre o campo.'},
 '車':{parts:['車'],cue:'eixo + carroceria',family:'movement',contrast:['東','車'],scene:'Veja o eixo atravessando o veículo.'},
 '行':{parts:['彳','亍'],cue:'passos em duas direções',family:'movement',contrast:['待','行'],scene:'Passos abrindo um caminho.'},
 '来':{parts:['来'],cue:'algo chegando ao centro',family:'movement',contrast:['未','来'],scene:'Linhas convergem para algo que vem até você.'},
 '見':{parts:['目','儿'],cue:'olho + pernas',family:'perception',contrast:['貝','見'],scene:'Um olho que se move para olhar.'},
 '聞':{parts:['門','耳'],cue:'portão + ouvido',family:'perception',contrast:['問','聞'],scene:'Encoste o ouvido no portão para escutar.'},
 '話':{parts:['言','舌'],cue:'palavra + língua',family:'perception',contrast:['語','話'],scene:'Palavras saem da língua numa conversa.'},
 '食':{parts:['食'],cue:'tampa + alimento',family:'daily',contrast:['良','食'],scene:'Uma refeição guardada sob cobertura.'},
 '飲':{parts:['食','欠'],cue:'comida/bebida + boca aberta',family:'daily',contrast:['飯','飲'],scene:'Incline a bebida para matar a sede.'},
 '店':{parts:['广','占'],cue:'cobertura + lugar ocupado',family:'place',contrast:['床','店'],scene:'Um ponto ocupado sob uma cobertura vira loja.'}
};
const kanjiMemoryFamilies={
 time:{title:'Tempo & calendário',cue:'formas que organizam dia, mês e hora',items:['日','月','時']},
 movement:{title:'Movimento & transporte',cue:'deslocamento, chegada e infraestrutura',items:['駅','電','車','行','来']},
 perception:{title:'Percepção & conversa',cue:'olhar, ouvir e falar',items:['見','聞','話']},
 material:{title:'Materiais & origem',cue:'árvore, base e metal',items:['木','本','金']},
 nature:{title:'Natureza elementar',cue:'água e fogo',items:['水','火']},
 place:{title:'Lugar & paisagem',cue:'montanha, rio e loja',items:['山','川','店']},
 shape:{title:'Forma & escala',cue:'grande e pequeno',items:['大','小']},
 daily:{title:'Comer & beber',cue:'ações de sobrevivência diária',items:['食','飲']}
};
function kanjiMemoryMeta(k){return kanjiVisualMeta[k]||{parts:[k],cue:'observe a silhueta antes da leitura',family:'other',contrast:[],scene:'Prenda forma, sentido e uso numa cena curta.'}}
function kanjiMemoryFamilyFor(k){const meta=kanjiMemoryMeta(k);return kanjiMemoryFamilies[meta.family]||{title:'Outros',cue:'família em construção',items:[k]}}
