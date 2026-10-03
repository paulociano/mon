// MON Listening & Pronunciation Lab content
const pronunciationTracks=[
 {id:'mora',symbol:'拍',title:'Ritmo em moras',pt:'O japonês organiza o ritmo em unidades curtas e relativamente regulares.',tip:'Bata um dedo por mora. Não tente encaixar a palavra no ritmo do português.',items:[
  {jp:'たべます',moras:['た','べ','ま','す'],pt:'comer (forma polida)',focus:'4 moras'},
  {jp:'にほん',moras:['に','ほ','ん'],pt:'Japão',focus:'3 moras'},
  {jp:'とうきょう',moras:['と','う','きょ','う'],pt:'Tóquio',focus:'4 moras'}
 ]},
 {id:'long',symbol:'長',title:'Vogais longas',pt:'Alongar ou encurtar uma vogal pode mudar a palavra. Trate a duração como parte da forma.',tip:'Conte a vogal longa como uma mora adicional.',items:[
  {jp:'おばさん',compare:'おばあさん',moras:['お','ば','さ','ん'],compareMoras:['お','ば','あ','さ','ん'],pt:'tia ↔ avó',focus:'a duração de あ muda o sentido'},
  {jp:'ここ',compare:'こうこう',moras:['こ','こ'],compareMoras:['こ','う','こ','う'],pt:'aqui ↔ ensino médio',focus:'ouça 2 moras extras'},
  {jp:'ゆき',compare:'ゆうき',moras:['ゆ','き'],compareMoras:['ゆ','う','き'],pt:'neve ↔ coragem',focus:'ゆう tem uma mora a mais'}
 ]},
 {id:'sokuon',symbol:'促',title:'っ pequeno',pt:'O っ cria uma pausa consonantal. Ele ocupa uma mora mesmo sem ter vogal própria.',tip:'Segure a próxima consoante por um pulso antes de soltá-la.',items:[
  {jp:'きて',compare:'きって',moras:['き','て'],compareMoras:['き','っ','て'],pt:'venha ↔ selo postal',focus:'a pausa de っ muda a palavra'},
  {jp:'さか',compare:'サッカー',moras:['さ','か'],compareMoras:['サ','ッ','カ','ー'],pt:'ladeira ↔ futebol',focus:'perceba a parada antes de カ'}
 ]},
 {id:'n',symbol:'撥',title:'ん como uma mora',pt:'O ん ocupa seu próprio pulso e muda de qualidade conforme o som seguinte.',tip:'Não acrescente uma vogal depois de ん. Dê a ele um pulso próprio.',items:[
  {jp:'ほん',moras:['ほ','ん'],pt:'livro',focus:'2 moras'},
  {jp:'しんぶん',moras:['し','ん','ぶ','ん'],pt:'jornal',focus:'4 moras'},
  {jp:'でんしゃ',moras:['で','ん','しゃ'],pt:'trem',focus:'3 moras'}
 ]},
 {id:'devoice',symbol:'息',title:'Vogais fracas na fala real',pt:'Em certos contextos, especialmente い e う entre consoantes surdas, a vogal pode soar muito fraca.',tip:'Primeiro reconheça a forma completa. Depois perceba a redução natural sem tentar apagá-la à força.',items:[
  {jp:'です',moras:['で','す'],pt:'copula polida',focus:'o う de す pode soar muito fraco'},
  {jp:'好きです',moras:['す','き','で','す'],pt:'eu gosto',focus:'escute a fala conectada sem perder as moras'}
 ]}
];

const pronunciationShadowing=[
 {id:'station',jp:'すみません。駅はどこですか。',chunks:['すみません。','駅は','どこですか。'],pt:'Com licença. Onde fica a estação?',goal:'ritmo + pergunta funcional'},
 {id:'slow',jp:'もう一度ゆっくりお願いします。',chunks:['もう一度','ゆっくり','お願いします。'],pt:'Mais uma vez, devagar, por favor.',goal:'vogal longa + っ pequeno'},
 {id:'train',jp:'電車で行きます。駅で降ります。',chunks:['電車で','行きます。','駅で','降ります。'],pt:'Vou de trem. Desço na estação.',goal:'ん + fala conectada'},
 {id:'work',jp:'仕事の後で、日本語を勉強しています。',chunks:['仕事の後で、','日本語を','勉強しています。'],pt:'Depois do trabalho, estudo japonês.',goal:'segmentação em blocos'}
];

function pronunciationTrack(id){return pronunciationTracks.find(x=>x.id===id)||pronunciationTracks[0]}
