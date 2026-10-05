// MON Practice Hub runtime · loaded only when practice opens
let grammarNotebookPromise;
async function ensureGrammarNotebook(){grammarNotebookPromise??=(async()=>{await loadRuntimeStyle('./features/grammar-notebook.css');await loadRuntimeScript('./features/grammar-notebook.js')})();await grammarNotebookPromise;renderGrammarNotebook()}
function masteryLabel(concept){
  const [type,key]=concept.split(':',2);
  if(type==='vocabulary'){const v=vocabularyCatalog?.[key];return v?`${v.jp} · ${v.pt}`:key}
  if(type==='grammar'){const id=concept.replace('grammar:P:',''),g=grammarCatalog?.[id];return g?g.form:id}
  return key||concept;
}
function renderMasteryMap(){
 const wrap=document.getElementById('masteryMap');if(!wrap||typeof masterySummary!=='function')return;
 const s=masterySummary(),labels={recognize:'reconhecer',recall:'recuperar',listen:'ouvir',transfer:'transferir',produce:'produzir'};
 const weak=s.weak||[];
 wrap.innerHTML=`<div class="mastery-copy"><span class="eyebrow">Mastery Graph · 習得</span><h3>${s.concepts?s.average+'% de domínio observado':'O mapa nasce das suas respostas.'}</h3><p>O MON separa reconhecer, recuperar, ouvir, transferir e produzir. Saber uma palavra no quiz não significa ainda conseguir usá-la numa conversa.</p><div class="mastery-summary"><span><b>${s.strong}</b> fortes</span><span><b>${s.developing}</b> em construção</span><span><b>${s.fragile}</b> frágeis</span></div></div><div class="mastery-edges">${weak.map(x=>`<article><div><b>${masteryLabel(x.concept)}</b><span>${labels[x.dimension]||x.dimension}</span></div><div class="mastery-meter"><i style="width:${x.score}%"></i></div><strong>${x.score}%</strong></article>`).join('')||'<div class="mastery-empty">Faça algumas lições. As primeiras arestas aparecem depois das respostas reais.</div>'}</div>`;
}
function renderReviewDeck(){
 const wrap=document.getElementById('reviewDeck');if(!wrap)return;
 const s=reviewSummary(),labels={kana:'Kana',kanji:'Kanji',grammar:'Gramática',error:'Erros',vocabulary:'Vocabulário'};
 const due=Object.entries(s.by).sort((a,b)=>b[1]-a[1]);
 const next=s.next?Math.max(1,Math.round((s.next.due-Date.now())/3600000)):null;
 wrap.innerHTML=`<div class="review-deck-copy"><span class="eyebrow">Fila Inteligente · 復習</span><h3>${s.due?s.due+' itens pedem retorno agora.':'Memória em dia.'}</h3><p>Um único scheduler organiza kana, kanji, gramática e correções. A fila considera atraso, lapsos e maturidade, enquanto cada domínio mantém seu próprio tipo de exercício.</p><div class="review-pills">${due.map(([k,v])=>`<span>${labels[k]||k} <b>${v}</b></span>`).join('')||`<span>próxima revisão <b>${next?'~'+next+'h':'quando novos itens entrarem'}</b></span>`}</div></div><div class="review-deck-stats"><div><b>${s.due}</b><span>vencendo</span></div><div><b>${s.mature}</b><span>maduros 7d+</span></div><button class="primary" ${s.due?'':'disabled'} onclick="startSmartReview()">Revisar agora →</button></div>`;
}
async function startSmartReview(){
 const exercises=scheduledReviewExercises(8);
 if(!exercises.length)return toast('Sua fila de memória está em dia');
 await ensureFeatureRuntime('lesson');
 quickRun={idx:null,node:{label:'Fila Inteligente',day:0},pack:{title:'Fila Inteligente',focus:'復',exercises,adaptive:true},step:0,correct:0,answered:0,streak:0,xp:0,selected:null,built:[],matches:[],matchPick:null,checked:false,practiceOnly:true};
 go('lesson');renderQuickExercise();updateMetrics();
}
function renderMistakeNotebook(){
 const wrap=document.getElementById('mistakeNotebook');if(!wrap)return;
 const s=mistakeSummary(),labels={'escuta':'Escuta','fala':'Fala','kana':'Kana','kanji':'Kanji','gramática':'Gramática','vocabulário':'Vocabulário','ordem da frase':'Ordem'};
 const cats=Object.entries(s.by).sort((a,b)=>b[1]-a[1]);
 wrap.innerHTML=`<div class="mistake-head"><div><span class="eyebrow">Caderno de Erros · 間違い帳</span><h3>${s.open?'Seu erro vira a próxima pista.':'Nenhum erro aberto agora.'}</h3><p>${s.open?'O MON agrupa padrões que ainda não foram recuperados com sucesso. Acertar novamente reduz a prioridade do erro.':'Erros futuros aparecerão aqui por categoria, frequência e recência.'}</p></div><button class="primary" ${s.open?'':'disabled'} onclick="startMistakePractice()">Praticar ${Math.min(6,s.open)} erros →</button></div>
 <div class="mistake-stats"><div><b>${s.open}</b><span>padrões abertos</span></div><div><b>${s.events}</b><span>eventos registrados</span></div><div><b>${cats[0]?labels[cats[0][0]]||cats[0][0]:'—'}</b><span>maior foco</span></div></div>
 <div class="mistake-categories">${cats.map(([k,v])=>`<span>${labels[k]||k} <b>${v}</b></span>`).join('')}</div>
 <div class="mistake-list">${s.top.map(x=>`<article><div class="mistake-tag">${labels[x.category]||x.category}</div><div><b>${x.title}</b><p>${x.why||'Revise o mecanismo e recupere sem pista.'}</p></div><strong>×${x.count}</strong></article>`).join('')||'<div class="mistake-empty">Continue a trilha. O caderno será alimentado pelos erros reais das lições.</div>'}</div>`;
}
async function startMistakePractice(){
 const exercises=remediationExercises(6);
 if(!exercises.length)return toast('Nenhum erro aberto para revisar');
 await ensureFeatureRuntime('lesson');
 quickRun={idx:null,node:{label:'Caderno de Erros',day:0},pack:{title:'Caderno de Erros',focus:'復',exercises,adaptive:true},step:0,correct:0,answered:0,streak:0,xp:0,selected:null,built:[],matches:[],matchPick:null,checked:false,practiceOnly:true};
 go('lesson');renderQuickExercise();updateMetrics();
}

function practiceRecommendation(){
 const review=typeof reviewSummary==='function'?reviewSummary():{due:0,mature:0};
 const mistakes=typeof mistakeSummary==='function'?mistakeSummary():{open:0,top:[]};
 const mastery=typeof masterySummary==='function'?masterySummary():{fragile:0,weak:[],average:0};
 if(review.due>0)return {tone:'memory',eyebrow:'agora · memória',title:`${review.due} revisões estão no ponto certo`,copy:'Recupere antes de estudar conteúdo novo. Revisão vencendo tem prioridade porque o intervalo já está no limite.',action:'startSmartReview()',cta:'revisar agora →'};
 if(mistakes.open>0)return {tone:'repair',eyebrow:'agora · correção',title:`${mistakes.open} padrões ainda pedem reparo`,copy:'O Caderno de Erros contém evidência mais específica do que repetir uma lição inteira. Corrija primeiro o padrão recorrente.',action:'startMistakePractice()',cta:'corrigir erros →'};
 if(mastery.fragile>0||mastery.weak?.length)return {tone:'mastery',eyebrow:'agora · domínio',title:'Fortaleça a aresta mais frágil',copy:'Seu mapa já mostra uma diferença entre reconhecer e conseguir recuperar ou produzir. Faça uma prática curta focada na habilidade mais baixa.',action:"go('home')",cta:'voltar à trilha guiada →'};
 return {tone:'clear',eyebrow:'memória em dia',title:'Você pode avançar sem acumular dívida de revisão',copy:'Não há urgência de revisão agora. Use uma prática livre curta ou continue a próxima unidade da trilha.',action:"go('home')",cta:'continuar trilha →'};
}
function renderPracticeCoach(){
 const host=document.getElementById('practiceCoach');if(!host)return;
 const r=practiceRecommendation();
 host.className='practice-coach '+r.tone;
 host.innerHTML=`<div class="practice-coach-mark" aria-hidden="true">復</div><div><span class="eyebrow">${r.eyebrow}</span><h3>${r.title}</h3><p>${r.copy}</p></div><button class="primary" onclick="${r.action}">${r.cta}</button>`;
 ensureGrammarNotebook();
}
