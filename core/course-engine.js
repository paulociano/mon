// MON adaptive course engine
// Public interface: buildLesson(node, learnerState)

function engineShuffle(a){
  a=[...a];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
  return a;
}
function engineShuffledOptions(correct,pool,count=4){
  const vals=[correct,...pool.filter(x=>x!==correct)].filter((x,i,a)=>a.indexOf(x)===i);
  const shuffled=engineShuffle(vals);
  const sliced=shuffled.slice(0,count);
  if(!sliced.includes(correct)&&sliced.length)sliced[Math.floor(Math.random()*sliced.length)]=correct;
  return sliced;
}

function lessonPlanFromNode(node){let day=node.day||1;if(day<=24){const p=foundationSessionPlans[Math.max(0,Math.min(23,day-1))];const basic=day<=7?kanaCourse.hira.basic:day<=12?kanaCourse.kata.basic:kanaCourse.hira.basic;const sample=basic.slice(Math.max(0,(day*3)%Math.max(1,basic.length-4)),Math.max(0,(day*3)%Math.max(1,basic.length-4))+4);const pairs=sample.length>=3?sample.slice(0,3):kanaCourse.hira.basic.slice(0,3);const wordChars=[...p.word].filter(x=>x.trim());const grammarTokens=(p.phrase.replace('。','').match(/.{1,2}/g)||[p.phrase.replace('。','')]);return {title:node.label,focus:p.kana,exercises:[
  {type:'listen',prompt:'Qual som ou bloco você ouviu?',audio:p.kana,options:engineShuffledOptions(p.roman,foundationSessionPlans.slice(Math.max(0,day-3),Math.min(24,day+4)).map(x=>x.roman)),answer:p.roman,why:`${p.kana} → ${p.roman}`},
  {type:'choice',prompt:`Qual forma corresponde a “${p.roman}”?`,options:engineShuffledOptions(p.kana,day<=12?[...kanaCourse.hira.basic,...kanaCourse.kata.basic].map(x=>x[0]):foundationSessionPlans.slice(12).map(x=>x.kana)),answer:p.kana,why:p.concept},
  {type:'match',prompt:'Faça os pares.',pairs:pairs},
  {type:'choice',prompt:`O que “${p.word}” significa?`,jp:p.word,options:engineShuffledOptions(p.pt,foundationSessionPlans.map(x=>x.pt)),answer:p.pt,why:`${p.word} · ${p.wordReading} · ${p.pt}`},
  {type:'wordbank',prompt:day<=12?'Reconstrua a palavra em japonês.':'Reconstrua o bloco em japonês.',target:day<=12?p.word:p.phrase.replace('。',''),tokens:day<=12?wordChars:grammarTokens,why:day<=12?'Leia em unidades de mora, não em letras portuguesas.':'Monte o japonês pela função dos blocos.'},
  {type:'choice',prompt:'Qual afirmação está correta?',options:p.conceptOptions,answer:p.concept,why:p.concept},
  {type:'listen',prompt:'Qual sentido corresponde à frase?',audio:p.phrase,options:engineShuffledOptions(p.phrasePt,foundationSessionPlans.map(x=>x.phrasePt)),answer:p.phrasePt,why:`${p.phrase} · ${p.phrasePt}`},
  {type:'speak',prompt:'Feche repetindo a frase inteira.',target:p.phrase,pt:p.phrasePt,why:'Faça shadowing: ouça, espere meio segundo e repita em um único ritmo.'}
 ]}}
 const mi=Math.max(0,Math.min(missions.length-1,(day-25)%missions.length)),m=missions[mi],sp=missionSpeech[mi],rd=microReadings[mi],k=kanjiData[(day-25)%kanjiData.length],ex=k.ex[0];return {title:node.label,focus:m.symbol,exercises:[
  {type:'listen',prompt:'O que a pessoa quis dizer?',audio:sp.npc,options:engineShuffledOptions(sp.npcPt,missionSpeech.map(x=>x.npcPt)),answer:sp.npcPt,why:'Capture primeiro a intenção geral.'},
  {type:'choice',prompt:`Qual kanji significa “${k.m.toLowerCase()}”?`,options:engineShuffledOptions(k.k,kanjiData.map(x=>x.k)),answer:k.k,why:`${k.k} · ${k.m}`},
  {type:'choice',prompt:`Como se lê ${ex[0]}?`,options:engineShuffledOptions(ex[1],kanjiData.flatMap(x=>x.ex.map(e=>e[1]))),answer:ex[1],why:`${ex[0]} → ${ex[1]} · ${ex[2]}`},
  {type:'choice',prompt:'Escolha a interpretação correta.',jp:rd.jp,options:engineShuffledOptions(rd.pt,microReadings.map(x=>x.pt)),answer:rd.pt,why:rd.insight},
  {type:'wordbank',prompt:'Reconstrua a resposta-alvo.',target:sp.target.replace('。',''),tokens:(sp.target.replace('。','').match(/.{1,3}/g)||[sp.target]),why:sp.pt},
  {type:'listen',prompt:'Ouça de novo. Qual é a resposta mais natural?',audio:sp.npc,options:engineShuffledOptions(sp.target,missionSpeech.map(x=>x.target)),answer:sp.target,why:sp.pt},
  {type:'choice',prompt:`Qual palavra contém ${k.k}?`,options:engineShuffledOptions(ex[0],kanjiData.map(x=>x.ex[0][0])),answer:ex[0],why:`${ex[0]} · ${ex[2]}`},
  {type:'speak',prompt:'Responda em japonês.',target:sp.target,pt:sp.pt,why:'Produção fecha o circuito.'}
 ]}}

function buildLesson(node,learnerState){
  const pack=lessonPlanFromNode(node);
  const repairs=typeof remediationExercises==='function'?remediationExercises(2):[];
  if(!repairs.length)return pack;
  const base=pack.exercises||[];
  const injected=[];
  // One correction early, one later. This keeps interleaving without turning every lesson into punishment.
  injected.push(repairs[0]);
  const pivot=Math.min(3,base.length);
  const exercises=[injected[0],...base.slice(0,pivot)];
  if(repairs[1])exercises.push(repairs[1]);
  exercises.push(...base.slice(pivot));
  return {...pack,exercises:exercises.slice(0,10),adaptive:true,repairCount:repairs.length};
}
