// MON shell content
// Keep this file intentionally small. Feature datasets load on demand.

const SHELL_FOUNDATION_TOTAL=24;
const SHELL_KANJI_COUNT=26;
const shellFoundationOutline = [
{"n":1,"title":"Vogais & mora","desc":"ouvir a i u e o, sentir o ritmo e entender que japonês é organizado por moras","symbol":"あ"},
{"n":2,"title":"Hiragana K + S","desc":"ler pequenas famílias, comparar som e forma e começar a abandonar a soletração em português","symbol":"し"},
{"n":3,"title":"Hiragana T + N","desc":"ampliar a leitura com atenção a ち e つ, sem exigir palavras longas","symbol":"つ"},
{"n":4,"title":"Hiragana H + M","desc":"automatizar mais duas famílias e treinar ふ e う com articulação natural","symbol":"ふ"},
{"n":5,"title":"Hiragana Y + R + W + ん","desc":"fechar o mapa básico e ler palavras curtas sem converter cada símbolo para romaji","symbol":"ら"},
{"n":6,"title":"Dakuten & handakuten","desc":"entender como marcas transformam sons já conhecidos em vez de decorar outro alfabeto","symbol":"が"},
{"n":7,"title":"Yōon + pequeno っ","desc":"combinar sons, perceber pausa consonantal e preservar o ritmo por mora","symbol":"きょ"},
{"n":8,"title":"Katakana A–S","desc":"reconhecer que os sons são familiares e aprender a nova forma gráfica em palavras reais","symbol":"ア"},
{"n":9,"title":"Katakana T–H","desc":"continuar a leitura e comparar pares visuais como シ/ツ","symbol":"ツ"},
{"n":10,"title":"Katakana M–N","desc":"fechar o mapa básico e comparar ソ/ン em nomes, lojas e objetos comuns","symbol":"ン"},
{"n":11,"title":"Duração & vogal longa","desc":"entender que duração muda palavras e praticar ー sem tratar ritmo como detalhe","symbol":"ー"},
{"n":12,"title":"Checkpoint de leitura kana","desc":"ler palavras e expressões curtas em hiragana/katakana com romaji apenas como socorro","symbol":"字"},
{"n":13,"title":"Como uma frase japonesa funciona","desc":"entender blocos, predicado no fim, omissão de sujeito e o papel das partículas antes de decorar regras","symbol":"文"},
{"n":14,"title":"Tópico com は","desc":"separar 'sobre o que falamos' da informação dita sobre esse tópico","symbol":"は"},
{"n":15,"title":"Identificar e perguntar","desc":"usar です, か, これ/それ/あれ para construir e compreender frases nominais simples","symbol":"か"},
{"n":16,"title":"Relacionar nomes com の e も","desc":"ligar substantivos e adicionar 'também' antes de empilhar partículas mais abstratas","symbol":"の"},
{"n":17,"title":"Verbo no fim + objeto を","desc":"entender a arquitetura N を Vます e produzir ações simples com um único papel novo","symbol":"を"},
{"n":18,"title":"Lugar, destino e tempo","desc":"distinguir に, で e へ pela função do lugar em exemplos contrastivos","symbol":"に"},
{"n":19,"title":"Negativo & passado em ます","desc":"mudar tempo e polaridade pelo final do verbo sem reconstruir a frase inteira","symbol":"た"},
{"n":20,"title":"Adjetivos い / な","desc":"descrever coisas e lugares entendendo os dois comportamentos básicos, sem concordância de gênero","symbol":"い"},
{"n":21,"title":"Existência: あります / います","desc":"introduzir が dentro de um padrão concreto de existência antes de discutir foco de modo abstrato","symbol":"が"},
{"n":22,"title":"Números, horas & contadores","desc":"usar quantidade em preço, horário e pessoas com os contadores mais úteis","symbol":"時"},
{"n":23,"title":"Forma て para pedidos","desc":"aprender a forma て primeiro como ponte funcional para 〜てください, sem abrir todas as conjugações de uma vez","symbol":"て"},
{"n":24,"title":"Checkpoint de autonomia inicial","desc":"integrar leitura, frases básicas, pedidos e reparo de conversa sem depender de romaji","symbol":"門"}
];
const shellMissionOutline = [
 {symbol:'駅',title:'Chegar à estação certa',desc:'perguntar direção, reconhecer saída e destino',level:'primeiras 24h'},
 {symbol:'店',title:'Comprar no konbini',desc:'preço, saco, pagamento e perguntas rápidas',level:'dia 1'},
 {symbol:'食',title:'Pedir comida',desc:'pedido, recomendação, água e conta',level:'dia 2'},
 {symbol:'住',title:'Resolver endereço',desc:'endereço, formulário e onde você mora',level:'semana 1'},
 {symbol:'働',title:'Primeiro dia de trabalho',desc:'apresentação, pedidos simples e etiqueta básica',level:'semana 1'},
 {symbol:'病',title:'Pedir ajuda em saúde',desc:'descrever sintomas simples e entender instruções',level:'essencial'}
];
