// MON Grammar Notebook · projection of canonical grammar + learner evidence
let grammarNotebookFilter='all',grammarNotebookQuery='';

function grammarNotebookCourseDay(){
  return state.foundationComplete?24+Math.max(1,Number(state.day||1)):Math.max(1,Number(state.foundationDay||1));
}
function grammarNotebookUnits(){
  return [...(coursePacks?.N5?.units||[]),...(coursePacks?.N4?.units||[])];
}
function grammarNotebookFirstDay(id){
  const days=grammarNotebookUnits().filter(u=>(u.grammar||[]).includes(id)).map(u=>Number(u.day||999));
  return days.length?Math.min(...days):999;
}
function grammarNotebookMisconceptions(concept){
  return Object.values(state.mistakeStats||{}).filter(x=>x.concept===concept)
    .reduce((n,x)=>n+Math.max(0,Number(x.count||0)-Number(x.recovered||0)),0);
}
function grammarNotebookEntries(options={}){
  const filter=options.filter??grammarNotebookFilter,query=String(options.query??grammarNotebookQuery).trim().toLowerCase();
  const courseDay=grammarNotebookCourseDay();
  const rows=Object.entries(grammarCatalog||{}).map(([id,g])=>{
    const concept='grammar:P:'+id,day=grammarNotebookFirstDay(id);
    const evidenced=!!state.masteryEvidence?.[concept]||!!state.reviewItems?.['grammar:P:'+id]||
      Object.values(state.mistakeStats||{}).some(x=>x.concept===concept);
    const encountered=evidenced||day<=courseDay;
    const mastery=typeof conceptMastery==='function'?conceptMastery(concept):0;
    const due=typeof reviewIsDue==='function'?reviewIsDue('grammar','P:'+id,false):false;
    const misconceptions=grammarNotebookMisconceptions(concept);
    const status=mastery>=80?'strong':mastery>=50?'developing':mastery>0?'fragile':'new';
    const dimensions=typeof conceptBreakdown==='function'?conceptBreakdown(concept):[];
    return {id,level:g.level||'N5',day,encountered,mastery,due,misconceptions,status,dimensions,
      form:g.form,pt:g.pt,function:g.function,mentalModel:g.mentalModel,explanation:g.explanation,
      examples:[...(g.examples||[])],contrast:g.contrast,commonMistakes:[...(g.commonMistakes||[])],
      realWorldUse:g.realWorldUse,sources:[...(g.sources||[])]};
  }).filter(x=>x.encountered);
  return rows.filter(x=>{
    if(filter==='weak'&&!(x.mastery<80||x.misconceptions>0))return false;
    if(filter==='due'&&!x.due)return false;
    if((filter==='N5'||filter==='N4')&&x.level!==filter)return false;
    if(query){
      const hay=[x.form,x.pt,x.function,x.mentalModel,x.explanation,x.contrast,x.realWorldUse,...x.examples.flatMap(e=>[e.jp,e.pt,e.note])].join(' ').toLowerCase();
      if(!hay.includes(query))return false;
    }
    return true;
  }).sort((a,b)=>a.day-b.day||a.form.localeCompare(b.form,'ja'));
}
function grammarNotebookWeakDimension(id){
  const rows=typeof conceptBreakdown==='function'?conceptBreakdown('grammar:P:'+id):[];
  return [...rows].sort((a,b)=>(a.score-b.score)||(a.attempts-b.attempts))[0]?.dimension||'recognize';
}
function grammarNotebookReviewExercises(id){
  const g=grammarCatalog?.[id];if(!g)return [];
  const study={type:'study',mode:'notebook',title:`文法 · ${g.form}`,mentalModel:g.mentalModel,explanation:g.explanation,
    examples:(g.examples||[]).slice(0,3),contrast:g.contrast+(g.commonMistakes?.[0]?` Erro comum: ${g.commonMistakes[0].wrong} ${g.commonMistakes[0].explanation}`:''),
    commonMistakes:[...(g.commonMistakes||[])],realWorldUse:g.realWorldUse,_grammarId:id};
  const unit=grammarNotebookUnits().find(u=>(u.grammar||[]).includes(id)),dimension=grammarNotebookWeakDimension(id);
  const method={recognize:'discover',mechanism:'mechanism',contrast:'contrast',transfer:'transfer',produce:'roleplay'}[dimension]||'discover';
  const index=Math.max(0,(unit?.grammar||[]).indexOf(id));
  const retrieval=unit&&typeof compileMONMethod==='function'?compileMONMethod(unit,method,index):null;
  return retrieval?[study,retrieval]:[study];
}
async function startGrammarNotebookReview(id){
  const exercises=grammarNotebookReviewExercises(id);if(!exercises.length)return;
  await ensureFeatureRuntime('lesson');
  quickRun={idx:null,node:{label:'Grammar Notebook',day:0},pack:{title:'Grammar Notebook · 文法',focus:'文',exercises,adaptive:true},
    step:0,correct:0,answered:0,streak:0,xp:0,selected:null,built:[],matches:[],matchPick:null,checked:false,practiceOnly:true};
  await go('lesson');renderQuickExercise();updateMetrics();
}
function setGrammarNotebookFilter(filter,button){
  grammarNotebookFilter=filter;
  document.querySelectorAll('[data-grammar-filter]').forEach(b=>b.classList.toggle('active',b===button));
  renderGrammarNotebook();
}
function setGrammarNotebookQuery(value){grammarNotebookQuery=value;renderGrammarNotebook()}
function renderGrammarNotebook(){
  const host=document.getElementById('grammarNotebook');if(!host)return;
  const all=grammarNotebookEntries({filter:'all',query:''}),rows=grammarNotebookEntries();
  const strong=all.filter(x=>x.status==='strong').length,due=all.filter(x=>x.due).length;
  host.innerHTML=`<div class="grammar-notebook-head"><div><span class="eyebrow">Grammar Notebook · 文法</span><h3>Gramática que você já encontrou, organizada para voltar.</h3><p>Modelo mental, exemplos, contraste e erros recorrentes vêm do mesmo catálogo usado pelas lições e pela remediation.</p></div><div class="grammar-notebook-stats"><span><b>${all.length}</b> encontradas</span><span><b>${strong}</b> fortes</span><span><b>${due}</b> para revisar</span></div></div>
  <div class="grammar-notebook-tools"><label><span>⌕</span><input value="${grammarNotebookQuery.replaceAll('"','&quot;')}" data-mon-input-command="setGrammarNotebookQuery(this.value)" placeholder="Buscar função, forma, exemplo…"></label><div class="grammar-notebook-filters">
  ${[['all','todas'],['weak','frágeis'],['due','revisar'],['N5','N5'],['N4','N4']].map(([k,l])=>`<button data-grammar-filter class="${grammarNotebookFilter===k?'active':''}" data-mon-command="setGrammarNotebookFilter('${k}',this)">${l}</button>`).join('')}</div></div>
  <div class="grammar-notebook-list">${rows.map(x=>`<details class="grammar-note ${x.status}"><summary><span class="grammar-note-level">${x.level}</span><div><b lang="ja">${x.form}</b><small>${x.function}</small></div><div class="grammar-note-meter"><i style="width:${x.mastery}%"></i></div><strong>${x.mastery?x.mastery+'%':'nova'}</strong>${x.due?'<em>revisar</em>':''}${x.misconceptions?'<em class="repair">reparo '+x.misconceptions+'</em>':''}</summary><div class="grammar-note-body"><div class="grammar-dimensions">${x.dimensions.map(d=>`<div><span>${({recognize:'reconhecer',mechanism:'mecanismo',contrast:'contraste',transfer:'transferir',produce:'produzir'}[d.dimension]||d.dimension)}</span><b>${d.score}%</b><i><em style="width:${d.score}%"></em></i></div>`).join('')}</div><section><span>modelo mental</span><p>${x.mentalModel}</p></section><section><span>como funciona</span><p>${x.explanation}</p></section><div class="grammar-note-examples">${x.examples.slice(0,3).map(e=>`<article><b lang="ja">${e.jp}</b><span>${e.pt}</span><small>${e.note}</small></article>`).join('')}</div><section class="grammar-note-contrast"><span>contraste</span><p>${x.contrast}</p></section>${x.commonMistakes.length?`<section class="grammar-note-mistake"><span>erro comum</span><p><b>${x.commonMistakes[0].wrong}</b> ${x.commonMistakes[0].explanation}</p></section>`:''}<footer><p>${x.realWorldUse}</p><button class="primary" data-mon-command="startGrammarNotebookReview('${x.id}')">revisar esta estrutura →</button></footer></div></details>`).join('')||'<div class="grammar-notebook-empty">Nenhuma estrutura corresponde a este filtro. Continue a trilha ou limpe a busca.</div>'}</div>`;
}
