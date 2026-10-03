// MON application runtime
// Course datasets live in data/course-content.js.

const viewNames={home:'Aprender',lesson:'Lição',practice:'Praticar',league:'Liga',shop:'Loja',foundation:'Kana & gramática',session:'Sessão longa',curriculum:'Trilha acadêmica',kanji:'Kanji Atlas',missions:'Missões',reading:'Histórias',speaking:'Conversação',culture:'Cultura',writing:'Escrita'};
let currentKanji=0;
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1600)}
function keepActiveNavVisible(id){const nav=document.getElementById('desktopNav'),active=nav?.querySelector(`[data-view="${id}"]`);if(!nav||!active||nav.scrollHeight<=nav.clientHeight)return;const top=active.offsetTop-nav.offsetTop,bottom=top+active.offsetHeight,soft=18;let target=null;if(top<nav.scrollTop+soft)target=Math.max(0,top-soft);else if(bottom>nav.scrollTop+nav.clientHeight-soft)target=bottom-nav.clientHeight+soft;if(target!==null)nav.scrollTo({top:target,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
const LEARNING_RUNTIME_SCRIPTS=[
 './data/content-packs.js',
 './core/mistakes.js',
 './core/mastery-graph.js',
 './core/learning-methods.js',
 './core/course-engine.js',
 './core/progression-engine.js'
];
let learningRuntimePromise=null;
function loadRuntimeScript(src){
 return new Promise((resolve,reject)=>{
   const existing=document.querySelector(`script[data-runtime-src="${src}"]`);
   if(existing){if(existing.dataset.ready==='1')return resolve();existing.addEventListener('load',()=>resolve(),{once:true});existing.addEventListener('error',()=>reject(new Error('Falha ao carregar '+src)),{once:true});return}
   const s=document.createElement('script');s.src=src;s.async=false;s.dataset.runtimeSrc=src;
   s.onload=()=>{s.dataset.ready='1';resolve()};s.onerror=()=>reject(new Error('Falha ao carregar '+src));document.body.appendChild(s);
 });
}
function ensureLearningRuntime(){
 if(learningRuntimePromise)return learningRuntimePromise;
 document.body.classList.add('learning-runtime-loading');
 learningRuntimePromise=(async()=>{for(const src of LEARNING_RUNTIME_SCRIPTS)await loadRuntimeScript(src);document.body.classList.add('learning-runtime-ready')})()
   .catch(err=>{learningRuntimePromise=null;toast('Não consegui carregar o motor de aprendizagem');throw err})
   .finally(()=>document.body.classList.remove('learning-runtime-loading'));
 return learningRuntimePromise;
}
const hydratedViews=new Set(['home']);
function hydrateMissionGrid(){
 if(hydratedViews.has('missions'))return;
 const grid=document.getElementById('missionGrid');if(grid)grid.innerHTML=missions.map((m,i)=>`<button class="mission mission-${i}" onclick="missionOpen(${i})"><div class="mission-art"></div><div class="mission-body"><div class="symbol">${m.symbol}</div><b>${m.title}</b><small>${m.desc}</small></div><span class="level">${m.level}</span></button>`).join('');
 hydratedViews.add('missions');
}
function hydrateSurvivalPhrases(){
 if(hydratedViews.has('speaking'))return;
 const wrap=document.getElementById('survivalPhrases');if(wrap)wrap.innerHTML=phrases.map(p=>`<div class="phrase"><b>${p[0]}</b><span class="romaji">${p[1]}</span><span>${p[2]}</span><button class="audio-btn" style="margin-top:9px" onclick="speak('${p[0].replaceAll("'","\\'")}')">▶ ouvir</button></div>`).join('');
 hydratedViews.add('speaking');
}
async function go(id){
 document.body.classList.toggle('focus-session',id==='session');document.body.classList.toggle('quick-focus',id==='lesson');
 document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
 const crumb=document.getElementById('crumb');if(crumb)crumb.textContent=viewNames[id]||id;
 if(id==='home')renderGameHome();
 else if(id==='curriculum')renderCurriculum(curriculumLevel||currentPlan().level);
 else if(id==='foundation')renderFoundation();
 else if(id==='kanji'){ensureDrawingCanvases();renderKanjiList();selectKanji(currentKanji)}
 else if(id==='missions')hydrateMissionGrid();
 else if(id==='speaking')hydrateSurvivalPhrases();
 else if(id==='league')renderLeague();
 else if(id==='shop')renderShop();
 else if(id==='practice'){await ensureLearningRuntime();renderMasteryMap();renderReviewDeck();renderMistakeNotebook()}
 keepActiveNavVisible(id);window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===id));const crumb=document.getElementById('crumb');if(crumb)crumb.textContent=viewNames[id]||id;if(id==='curriculum')renderCurriculum(curriculumLevel||currentPlan().level);if(id==='foundation')renderFoundation();if(id==='home')renderGameHome();if(id==='league')renderLeague();if(id==='shop')renderShop();if(id==='practice'){renderMasteryMap();renderReviewDeck();renderMistakeNotebook()}keepActiveNavVisible(id);window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
function themeLabel(t){return t==='survival'?'sobrevivência':t==='city'?'cidade':'dia a dia'}
function renderKanjiList(filter='all',query=''){
 const q=query.trim().toLowerCase(); const wrap=document.getElementById('kanjiList');wrap.innerHTML='';
 kanjiData.forEach((x,i)=>{if(filter!=='all'&&x.theme!==filter)return;const hay=[x.k,x.m,...x.on,...x.kun,...x.ex.flat()].join(' ').toLowerCase();if(q&&!hay.includes(q))return;const b=document.createElement('button');b.className='kanji-chip'+(i===currentKanji?' active':'')+(isDue(x.k)?' due':'');b.textContent=x.k;b.title=x.m;b.onclick=()=>selectKanji(i);wrap.appendChild(b)});
}
function selectKanji(i){currentKanji=i;const x=kanjiData[i];document.getElementById('kanjiGlyph').textContent=x.k;document.getElementById('ghostKanji').textContent=x.k;document.getElementById('strokeCount').textContent=x.strokes+' traços';document.getElementById('kanjiTheme').textContent=themeLabel(x.theme);document.getElementById('kanjiMeaning').textContent=x.m;document.getElementById('kanjiNote').textContent=x.note;document.getElementById('kanjiStory').textContent=x.story;document.getElementById('readings').innerHTML=[...x.on.map(r=>`<span class="reading"><small>on</small>${r}</span>`),...x.kun.map(r=>`<span class="reading"><small>kun</small>${r}</span>`)].join('');document.getElementById('kanjiExamples').innerHTML=x.ex.map(e=>`<div class="example"><div><b>${e[0]}</b><br><span>${e[1]} • ${e[2]}</span></div><button class="audio-btn" onclick="speak('${e[1].replaceAll("'","\\'")}')">▶ ouvir</button></div>`).join('');document.getElementById('dueInfo').textContent=reviewText(x.k);clearDraw(drawCtx,drawCanvas);renderKanjiList(activeFilter,document.getElementById('kanjiSearch').value);updateForge()}
function speak(text){if(!('speechSynthesis' in window)){toast('Áudio indisponível neste navegador');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ja-JP';u.rate=.82;const jp=speechSynthesis.getVoices().find(v=>v.lang?.toLowerCase().startsWith('ja'));if(jp)u.voice=jp;speechSynthesis.speak(u)}
let activeFilter='all';document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));renderKanjiList(activeFilter,document.getElementById('kanjiSearch').value)}));document.getElementById('kanjiSearch').addEventListener('input',e=>renderKanjiList(activeFilter,e.target.value));
function isDue(k){return reviewIsDue('kanji',k,true)}
function reviewText(k){const r=reviewRecord('kanji',k);if(!r)return 'Ainda não revisado.';const diff=r.due-Date.now();if(diff<=0)return 'Revisão disponível agora.';const h=Math.round(diff/3600000);return h<24?`Próxima revisão em ~${Math.max(1,h)}h.`:`Próxima revisão em ~${Math.round(h/24)} dia(s).`}
function gradeKanji(k,g,quiet=false){const r=gradeReview('kanji',k,g);state.reviews[k]={...r,m:reviewMastery('kanji',k)};if(!quiet)state.xp+=g==='hard'?3:g==='good'?8:12;save();if(document.getElementById('dueInfo')&&kanjiData[currentKanji]?.k===k)document.getElementById('dueInfo').textContent=reviewText(k);renderKanjiList(activeFilter,document.getElementById('kanjiSearch')?.value||'');if(!quiet)toast('Revisão agendada • +'+(g==='hard'?3:g==='good'?8:12)+' XP')}
function grade(g){gradeKanji(kanjiData[currentKanji].k,g)}
document.querySelectorAll('.grade').forEach(b=>b.addEventListener('click',()=>grade(b.dataset.grade)));
function currentPlan(){const d=Number(state.day||1);if(d<=30)return{level:'N5',localDay:d,total:30,label:'sobrevivência',start:1};if(d<=90)return{level:'N4',localDay:d-30,total:60,label:'autonomia',start:31};return{level:'N3',localDay:Math.min(90,d-90),total:90,label:'integração',start:91}}
function updateMetrics(){
 const mastered=Object.values(state.reviews).filter(r=>(r.interval||0)>=7&&(r.reps||0)>=3).length;const due=kanjiData.filter(x=>isDue(x.k)).length;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v}, width=(id,v)=>{const e=document.getElementById(id);if(e)e.style.width=v};
 set('masteredMetric',mastered);set('dueMetric',due);width('masteredBar',Math.min(100,mastered/Math.max(1,kanjiData.length)*100)+'%');set('xpTop',state.xp);set('streakSidebar',state.streak);set('streakTop',state.streak);set('energyTop',Math.max(0,state.energy));set('quickEnergy',Math.max(0,state.energy));set('gemsTop',state.gems);set('speechMetric',(state.speech||0)+'%');width('speechBar',(state.speech||0)+'%');
 const p=currentPlan(),zeroPending=!state.foundationComplete;const plan=document.getElementById('planTop');if(plan)plan.textContent=zeroPending?`ZERO · sessão ${Math.min(FOUNDATION_TOTAL,state.foundationDay||1)}/${FOUNDATION_TOTAL}`:`${p.level} · dia ${p.localDay}/${p.total}`;const hero=document.getElementById('sessionDayHero');if(hero)hero.textContent=zeroPending?`fundação ${Math.min(FOUNDATION_TOTAL,state.foundationDay||1)}/${FOUNDATION_TOTAL}`:`dia ${state.day}`;const dd=document.getElementById('dailyDueCount');if(dd)dd.textContent=zeroPending?countKanaInTraining():due;const pc=document.getElementById('pathCurrentLevel');if(pc)pc.textContent=zeroPending?'ZERO':p.level;const pd=document.getElementById('pathCurrentDay');if(pd)pd.textContent=zeroPending?`sessão ${Math.min(FOUNDATION_TOTAL,state.foundationDay||1)} · base sonora, escrita e gramática`:`dia ${p.localDay} · ${p.label}`;const pr=document.getElementById('pathRingFill');if(pr)pr.style.width=zeroPending?Math.min(100,((state.foundationDay||1)-1)/FOUNDATION_TOTAL*100)+'%':Math.min(100,p.localDay/p.total*100)+'%';updateDailyCommand();renderFoundationProgress();renderGameHome();
}

let curriculumLevel='N5';
function renderCurriculum(level=curriculumLevel){curriculumLevel=level;document.querySelectorAll('[data-level]').forEach(b=>b.classList.toggle('active',b.dataset.level===level));const data=curriculumData.find(x=>x.level===level)||curriculumData[0];const p=currentPlan();const same=p.level===level;document.getElementById('curriculumSummary').innerHTML=`<div class="curriculum-stat"><span>promessa</span><b>${data.promise}</b></div><div class="curriculum-stat"><span>kanji alvo</span><b>${data.kanji}</b></div><div class="curriculum-stat"><span>gramática funcional</span><b>${data.grammar}</b></div><div class="curriculum-stat"><span>missões</span><b>${data.missions}</b></div>`;const levelStart=level==='N5'?1:level==='N4'?31:91;document.getElementById('curriculumGrid').innerHTML=data.units.map((u,i)=>{const span=u.days.split('–').map(Number),absStart=levelStart+(span[0]-1),absEnd=levelStart+(span[1]-1);const done=state.day>absEnd, current=same&&state.day>=absStart&&state.day<=absEnd, locked=state.day<absStart&&level!=='N5';return `<article class="unit-card ${done?'done':''} ${current?'current':''} ${locked?'locked':''}" data-kanji="${u.kanji}"><div class="unit-index"><span>${data.level} · dias ${u.days}</span><i></i></div><h4>${u.title}</h4><p>${u.desc}</p><div class="unit-meta">${u.meta.map(m=>`<span>${m}</span>`).join('')}</div><button class="unit-action" onclick="${current||done?`startSession()`:`toast('Este bloco abre conforme você demonstra domínio')`}">${current?'continuar daqui →':done?'revisar bloco →':'prévia bloqueada'}</button></article>`}).join('')}
document.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>renderCurriculum(b.dataset.level)));
function updateDailyCommand(){if(!document.getElementById('dailyMissionTitle'))return;if(!state.foundationComplete){const u=foundationUnits[Math.max(0,Math.min(FOUNDATION_TOTAL-1,(state.foundationDay||1)-1))];document.getElementById('dailyMissionTitle').textContent='Fundação Zero: '+u.title.toLowerCase();document.getElementById('dailyMissionCopy').textContent=`Sessão ${u.n}/${FOUNDATION_TOTAL} · ${u.desc}. O objetivo é automatizar leitura e som antes de acelerar no N5.`;const c=document.getElementById('dailyStepCount');if(c)c.textContent=6;return}const i=Math.min(missions.length-1,Math.floor(((state.day||1)-1)%30/5));document.getElementById('dailyMissionTitle').textContent='Hoje: '+missions[i].title.toLowerCase();document.getElementById('dailyMissionCopy').textContent=`Missão ${i+1}/6 · ${missions[i].desc}. O bloco começa pelo que está vencendo na sua memória.`}
function shuffledOptions(correct, pool, count=4){const vals=[correct,...pool.filter(x=>x!==correct)].filter((x,i,a)=>a.indexOf(x)===i);for(let i=vals.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[vals[i],vals[j]]=[vals[j],vals[i]]}const sliced=vals.slice(0,count);if(!sliced.includes(correct))sliced[Math.floor(Math.random()*sliced.length)]=correct;return sliced}
let sessionRun=null,sessionTimer=null,sessionCanvasCtx=null;
const sessionLabels=['Ouvir','Reconhecer','Ler','Escrever','Interpretar','Falar'];
function buildDailySteps(){const missionIndex=Math.min(missions.length-1,Math.floor(((state.day||1)-1)%30/5));const due=kanjiData.map((x,i)=>({x,i})).filter(o=>isDue(o.x.k));const target=(due[0]||{x:kanjiData[((state.day||1)-1)%kanjiData.length],i:((state.day||1)-1)%kanjiData.length});const k=target.x;const ex=k.ex[0];const speech=missionSpeech[missionIndex];const reading=microReadings[missionIndex];const meanings=shuffledOptions(k.m,kanjiData.map(x=>x.m));const glyphs=shuffledOptions(k.k,kanjiData.map(x=>x.k));const readings=shuffledOptions(ex[1],kanjiData.flatMap(x=>x.ex.map(e=>e[1])));return {missionIndex,targetIndex:target.i,steps:[
 {type:'audio',title:'Escute antes de ler',jp:speech.npc,question:'O que a pessoa acabou de perguntar ou dizer?',options:shuffledOptions(speech.npcPt,missionSpeech.map(x=>x.npcPt)),answer:speech.npcPt,why:'Primeiro extraia a intenção geral. Detalhes vêm depois.',min:2},
 {type:'choice',title:'Kanji sem tradução na frente',question:`Qual kanji significa “${k.m.toLowerCase()}”?`,options:glyphs,answer:k.k,why:`${k.k} · ${k.m}. A recuperação vem antes de rever a história mnemônica.`,min:4,jp:true},
 {type:'choice',title:'Leitura dentro da palavra',question:`Como você lê ${ex[0]}?`,options:readings,answer:ex[1],why:`${ex[0]} → ${ex[1]} · ${ex[2]}. Memorize a leitura dentro desta palavra.`,min:3,jp:true},
 {type:'writing',title:'Da ideia para a mão',question:`Sem olhar o modelo, escreva o kanji de “${k.m.toLowerCase()}”.`,answer:k.k,meaning:k.m,min:4},
 {type:'reading',title:'Microleitura de sobrevivência',jp:reading.jp,question:'Qual sentido corresponde à frase?',options:shuffledOptions(reading.pt,microReadings.map(x=>x.pt)),answer:reading.pt,why:reading.insight,min:3},
 {type:'speaking',title:'Responda, não recite',npc:speech.npc,npcPt:speech.npcPt,target:speech.target,pt:speech.pt,min:4}
 ]}}
function buildFoundationSteps(day=state.foundationDay||1){const plan=foundationSessionPlans[Math.max(0,Math.min(foundationSessionPlans.length-1,day-1))];const allKana=[...kanaCourse.hira.basic,...kanaCourse.hira.voiced,...kanaCourse.hira.yoon,...kanaCourse.kata.basic,...kanaCourse.kata.voiced,...kanaCourse.kata.yoon];const glyphPool=allKana.map(x=>x[0]);const romanPool=allKana.map(x=>x[1]);const wordMeanings=foundationSessionPlans.map(x=>x.pt);const grammarPhase=day>=13;const soundOptions=grammarPhase?shuffledOptions(plan.roman,foundationSessionPlans.slice(12).map(x=>x.roman)):shuffledOptions(plan.roman,romanPool);const glyphOptions=grammarPhase?shuffledOptions(plan.kana,foundationSessionPlans.slice(12).map(x=>x.kana)):shuffledOptions(plan.kana,glyphPool);return {plan,steps:[
 {type:'audio',title:grammarPhase?'Reconheça o bloco':'Som antes da letra',jp:plan.kana,question:grammarPhase?'Qual pista sonora/forma está em foco?':'Qual som você ouviu?',options:soundOptions,answer:plan.roman,why:`${plan.kana} → ${plan.roman}. Ouça novamente e repita uma vez.`,min:3},
 {type:'choice',title:grammarPhase?'Reconheça a peça funcional':'Do som para o kana',question:`Qual forma representa “${plan.roman}”?`,options:glyphOptions,answer:plan.kana,why:grammarPhase?`A peça-alvo é ${plan.kana}. Agora observe como ela funciona dentro de uma frase.`:`A ponte é ${plan.roman}; a meta é enxergar ${plan.kana} e não precisar mais do romaji.`,min:3,jp:true},
 {type:'reading',title:'Leia em contexto',jp:plan.word,question:`O que “${plan.word}” significa aqui?`,options:shuffledOptions(plan.pt,wordMeanings),answer:plan.pt,why:`${plan.word} · ${plan.wordReading} · ${plan.pt}. Leia primeiro em japonês; use romaji só para conferir se ainda estiver na fase de ponte.`,min:3},
 {type:'writing',title:grammarPhase?'Recupere a forma-chave':'Som → mão',question:grammarPhase?`Sem copiar, escreva a peça “${plan.kana}” usada neste bloco.`:`Sem copiar, escreva ${plan.roman}.`,answer:plan.kana,meaning:plan.roman,min:4,kana:true},
 {type:'choice',title:'Entenda o mecanismo',question:'Qual afirmação está correta?',options:plan.conceptOptions,answer:plan.concept,why:plan.concept,min:3},
 {type:'speaking',title:'Feche com uma frase real',npc:'Treino final',npcPt:'Ouça, espere um instante e produza o bloco inteiro.',target:plan.phrase,pt:plan.phrasePt,min:4}
 ]}}
function startFoundationSession(day=state.foundationDay||1,reviewOnly=false){const built=buildFoundationSteps(day);sessionRun={mode:'foundation',step:-1,score:0,correct:0,answered:0,startedAt:Date.now(),foundationDay:day,targetKana:built.plan.kana,reviewOnly,steps:built.steps};go('session');renderSession();startSessionClock()}
function openFoundationUnit(day){if(day<=(state.foundationDay||1)||state.foundationComplete)startFoundationSession(day,true);else toast('Conclua a sessão anterior para abrir este bloco')}
function startSession(){if(!state.foundationComplete)return startFoundationSession();const built=buildDailySteps();sessionRun={mode:'daily',step:-1,score:0,correct:0,answered:0,startedAt:Date.now(),missionIndex:built.missionIndex,targetIndex:built.targetIndex,steps:built.steps};go('session');renderSession();startSessionClock()}
function startDiagnostic(){sessionRun={mode:'diagnostic',step:-1,score:0,correct:0,answered:0,startedAt:Date.now(),steps:diagnosticItems.map(x=>{const answer=x.options[x.correct];return{type:'choice',title:'Sonda rápida',question:x.q,options:shuffledOptions(answer,x.options),answer,why:x.why,min:1}})};go('session');renderSession();startSessionClock()}
function startSessionClock(){clearInterval(sessionTimer);sessionTimer=setInterval(()=>{if(!sessionRun)return;const sec=Math.floor((Date.now()-sessionRun.startedAt)/1000);const el=document.getElementById('sessionClock');if(el)el.textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')},1000)}
function renderSessionRail(){const rail=document.getElementById('sessionRail');if(!rail||!sessionRun)return;if(sessionRun.mode==='diagnostic'){rail.innerHTML=sessionRun.steps.map((s,i)=>`<div class="session-rail-step ${i===sessionRun.step?'active':i<sessionRun.step?'done':''}"><i>${i+1}</i><span>Probe ${i+1}</span></div>`).join('');return}rail.innerHTML=sessionRun.steps.map((s,i)=>`<div class="session-rail-step ${i===sessionRun.step?'active':i<sessionRun.step?'done':''}"><i>${i+1}</i><span>${sessionLabels[i]||'Prática'} · ${s.min} min</span></div>`).join('')}
function sessionContextHTML(){if(!sessionRun)return'';if(sessionRun.mode==='diagnostic')return `<div class="context-seal">測</div><h4>Não é prova.</h4><p>O objetivo é encontrar um ponto de partida. Um erro isolado não rebaixa seu nível inteiro.</p><ul><li>Responda sem pesquisar.</li><li>Não há penalidade de XP.</li><li>A sugestão só será aplicada se você escolher.</li></ul>`;if(sessionRun.mode==='foundation'){const u=foundationUnits[sessionRun.foundationDay-1];return `<div class="context-seal">${u.symbol}</div><h4>Fundação ${u.n}/${FOUNDATION_TOTAL} · ${u.title}</h4><p>${u.desc}.</p><ul><li>Romaji é apoio temporário, não sistema final.</li><li>Ouça antes de ler sempre que possível.</li><li>Escreva depois de tentar recuperar a forma.</li></ul>`}const m=missions[sessionRun.missionIndex],k=kanjiData[sessionRun.targetIndex];return `<div class="context-seal">${m.symbol}</div><h4>${m.title}</h4><p>${m.desc}.</p><ul><li>Kanji-âncora: ${k.k} · ${k.m}</li><li>Hoje há ${kanjiData.filter(x=>isDue(x.k)).length} itens de kanji vencendo.</li><li>Meta: produzir algo sem pista em cada bloco.</li></ul>`}
function renderSession(){if(!sessionRun)return;renderSessionRail();document.getElementById('sessionContext').innerHTML=sessionContextHTML();const p=document.getElementById('sessionProgressBar');const total=sessionRun.steps.length;p.style.width=(sessionRun.step<0?0:Math.min(100,(sessionRun.step/total)*100))+'%';const wrap=document.getElementById('sessionContent');if(sessionRun.step<0){if(sessionRun.mode==='diagnostic'){wrap.innerHTML=`<div class="session-card"><span class="session-kicker">Teste de entrada · 3 minutos</span><h2>Encontre seu piso.<br>Não tente impressionar o app.</h2><p class="lead">Oito perguntas curtas atravessam som, kana, partículas, frases e gramática funcional. O objetivo é localizar onde começar, não produzir uma nota escolar.</p><div class="session-actions"><button class="primary" onclick="beginSession()">Começar diagnóstico →</button><button class="ghost" onclick="go('foundation')">voltar à Fundação Zero</button></div></div>`;return}if(sessionRun.mode==='foundation'){const u=foundationUnits[sessionRun.foundationDay-1];wrap.innerHTML=`<div class="session-card"><span class="session-kicker">Fundação Zero · sessão ${u.n}/${FOUNDATION_TOTAL}</span><h2>${u.title}</h2><div class="session-mission-jp">${u.symbol}</div><p class="lead">${u.desc}. Você vai ouvir, reconhecer, ler, escrever, entender o mecanismo e fechar com uma frase real.</p><span class="session-badge">音 → 字 → 文 · som, escrita, frase</span><div class="session-actions"><button class="primary" onclick="beginSession()">Iniciar sessão Zero →</button><button class="ghost" onclick="go('foundation')">voltar ao mapa</button></div></div>`;return}const m=missions[sessionRun.missionIndex];wrap.innerHTML=`<div class="session-card"><span class="session-kicker">Sessão ${state.sessions+1} · missão de hoje</span><h2>${m.title}</h2><div class="session-mission-jp">${m.symbol}</div><p class="lead">Em aproximadamente 20 minutos você vai ouvir, reconhecer, ler, escrever, interpretar e responder. Os itens de memória vencidos entram antes do conteúdo novo.</p><span class="session-badge">復習 first · novidade depois</span><div class="session-actions"><button class="primary" onclick="beginSession()">Iniciar os 6 blocos →</button><button class="ghost" onclick="go('home')">agora não</button></div></div>`;return}if(sessionRun.step>=total){renderSessionComplete();return}const s=sessionRun.steps[sessionRun.step];const kicker=sessionRun.mode==='diagnostic'?'diagnóstico':sessionRun.mode==='foundation'?`fundação ${sessionRun.foundationDay}/${FOUNDATION_TOTAL} · bloco ${sessionRun.step+1} de ${total}`:`bloco ${sessionRun.step+1} de ${total} · ${s.min} min`;let html=`<div class="session-card"><span class="session-kicker">${kicker}</span><h2>${s.title}</h2>`;if(s.type==='audio')html+=`<p class="lead">Sem olhar a resposta, ouça duas vezes e capture o som ou a intenção.</p><button class="listen-large" onclick="speak('${s.jp.replaceAll("'","\\'")}')">▶</button><div class="session-mission-jp" style="font-size:30px;filter:blur(8px);opacity:.18" aria-hidden="true">${s.jp}</div>${sessionOptions(s)}`;else if(s.type==='choice')html+=`<p class="lead">${s.question}</p>${sessionOptions(s)}`;else if(s.type==='reading')html+=`<div class="session-mission-jp" style="font-size:38px">${s.jp}</div><p class="lead">${s.question}</p>${sessionOptions(s)}`;else if(s.type==='writing')html+=`<p class="lead">${s.question}</p><div class="session-canvas-wrap"><canvas id="sessionCanvas" class="session-canvas"></canvas><div class="writing-answer" id="writingAnswer">${s.answer}</div></div><div class="session-actions"><button class="ghost" onclick="clearSessionCanvas()">limpar</button><button class="secondary" onclick="revealWriting()">comparar com modelo</button></div><div class="self-grade" id="writingGrades" style="display:none"><button class="session-option" onclick="finishWriting('hard')">Não lembrei</button><button class="session-option" onclick="finishWriting('good')">Quase / corrigi</button><button class="session-option" onclick="finishWriting('easy')">Lembrei sozinho</button></div>`;else if(s.type==='speaking')html+=`<p class="lead">${sessionRun.mode==='foundation'?'Ouça o bloco e repita como uma unidade.':'A pessoa diz:'}</p><div class="session-mission-jp" style="font-size:31px">${s.npc}</div><p class="lead">${s.npcPt}</p><div class="session-feedback"><b>Resposta-alvo</b><span style="font-family:var(--jp);font-size:18px;color:#fff">${s.target}</span><br>${s.pt}</div><div class="session-actions"><button class="secondary" onclick="speak('${s.target.replaceAll("'","\\'")}')">▶ ouvir resposta</button><button class="primary" id="sessionMic" onclick="sessionSpeech()">● responder</button><button class="ghost" onclick="finishSpeaking(60)">fiz shadowing</button></div><div id="sessionTranscript" class="session-feedback" style="display:none"></div>`;wrap.innerHTML=html+'</div>';if(s.type==='writing')setTimeout(setupSessionCanvas,0)}
function sessionOptions(s){return `<div class="session-options">${s.options.map((o,i)=>`<button class="session-option ${s.jp?'jp':''}" data-session-option="${i}" onclick="sessionChoose(${i})">${o}</button>`).join('')}</div><div id="sessionFeedback"></div>`}
function beginSession(){sessionRun.step=0;renderSession()}
function sessionChoose(i){const s=sessionRun.steps[sessionRun.step];const buttons=[...document.querySelectorAll('[data-session-option]')];if(buttons.some(b=>b.disabled))return;const chosen=s.options[i],ok=chosen===s.answer;buttons.forEach(b=>{b.disabled=true;if(b.textContent===s.answer)b.classList.add('correct')});if(!ok)buttons[i].classList.add('wrong');sessionRun.answered++;if(ok){sessionRun.correct++;sessionRun.score+=10}const fb=document.getElementById('sessionFeedback');fb.innerHTML=`<div class="session-feedback"><b>${ok?'Boa recuperação.':'Quase. Corrija o mecanismo.'}</b>${s.why||''}<div class="session-actions"><button class="primary" onclick="nextSessionStep()">continuar →</button></div></div>`}
function setupSessionCanvas(){const c=document.getElementById('sessionCanvas');if(!c)return;const ctx=c.getContext('2d'),dpr=window.devicePixelRatio||1,r=c.getBoundingClientRect();c.width=Math.max(1,Math.floor(r.width*dpr));c.height=Math.max(1,Math.floor(r.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineWidth=7;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#0d1422';let drawing=false,last=null;const pos=e=>{const rr=c.getBoundingClientRect();return{x:e.clientX-rr.left,y:e.clientY-rr.top}};c.onpointerdown=e=>{drawing=true;last=pos(e);c.setPointerCapture?.(e.pointerId)};c.onpointermove=e=>{if(!drawing)return;const n=pos(e);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(n.x,n.y);ctx.stroke();last=n};c.onpointerup=c.onpointercancel=()=>{drawing=false;last=null};sessionCanvasCtx=ctx}
function clearSessionCanvas(){const c=document.getElementById('sessionCanvas');if(c&&sessionCanvasCtx)sessionCanvasCtx.clearRect(0,0,c.width,c.height)}
function revealWriting(){document.getElementById('writingAnswer')?.classList.add('show');const g=document.getElementById('writingGrades');if(g)g.style.display='grid'}
function gradeGrammarTarget(day,g){const key='F'+day,r=gradeReview('grammar',key,g);state.grammarRecall[key]={...r,m:reviewMastery('grammar',key)};save()}
function finishWriting(g){if(sessionRun.mode==='foundation'){if(sessionRun.foundationDay<=12)gradeKana(sessionRun.targetKana,g,true);else gradeGrammarTarget(sessionRun.foundationDay,g)}else{const k=kanjiData[sessionRun.targetIndex].k;gradeKanji(k,g,true)}sessionRun.answered++;if(g==='easy'){sessionRun.correct++;sessionRun.score+=12}else if(g==='good'){sessionRun.score+=7}else sessionRun.score+=2;nextSessionStep()}
function sessionSpeech(){const s=sessionRun.steps[sessionRun.step],SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('Reconhecimento de voz indisponível; use shadowing');return}const r=new SR();r.lang='ja-JP';r.interimResults=false;r.maxAlternatives=1;const btn=document.getElementById('sessionMic');btn.textContent='● ouvindo…';r.onresult=e=>{const txt=e.results[0][0].transcript,sc=similarity(txt,s.target);const box=document.getElementById('sessionTranscript');box.style.display='block';box.innerHTML=`<b>Reconhecido: ${txt}</b>Correspondência textual: ${sc}%<div class="session-actions"><button class="primary" onclick="finishSpeaking(${sc})">usar este resultado →</button></div>`};r.onerror=()=>toast('Não consegui captar a fala');r.onend=()=>btn.textContent='● responder';r.start()}
function finishSpeaking(sc){sessionRun.answered++;if(sc>=70)sessionRun.correct++;sessionRun.score+=Math.max(4,Math.round(sc/10));state.speech=Math.max(state.speech||0,sc);nextSessionStep()}
function nextSessionStep(){sessionRun.step++;renderSession()}
function localDateKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function finishDailyState(){const today=localDateKey(),last=state.lastStudyDate;if(last!==today){if(last){const y=new Date();y.setDate(y.getDate()-1);state.streak=last===localDateKey(y)?(state.streak||0)+1:1}else state.streak=Math.max(1,state.streak||1);state.day=Math.min(180,(state.day||1)+1)}state.lastStudyDate=today;state.sessions=(state.sessions||0)+1;state.xp+=(sessionRun.score||0)+20;state.history.unshift({at:Date.now(),score:sessionRun.score,correct:sessionRun.correct,total:sessionRun.answered,mission:missions[sessionRun.missionIndex]?.title||'sessão'});state.history=state.history.slice(0,30);save()}
function renderSessionComplete(){clearInterval(sessionTimer);const wrap=document.getElementById('sessionContent'),p=document.getElementById('sessionProgressBar');p.style.width='100%';if(sessionRun.mode==='diagnostic'){const score=sessionRun.correct;let label,detail;if(score<=2){label='Fundação Zero · do início';detail='som, hiragana e leitura automática'}else if(score<=4){label='Fundação Zero · aceleração';detail='katakana + máquina da frase'}else if(score<=6){label='N5 · fundamentos';detail='começar com revisão de partículas e verbos'}else{label='N5 · checkpoint avançado';detail='confirmar domínio em uso real'}state.diagnostic={score,at:Date.now()};save();wrap.innerHTML=`<div class="session-card"><span class="session-kicker">diagnóstico concluído</span><h2>Seu ponto de partida sugerido:<br>${label}</h2><p class="lead">Você acertou ${score} de ${sessionRun.steps.length}. A sonda só localiza a fronteira inicial; retenção, escrita e uso ainda precisam ser confirmados.</p><div class="session-complete-grid"><div><b>${score}/${sessionRun.steps.length}</b><span>itens</span></div><div><b>${score<=4?'ZERO':'N5'}</b><span>entrada</span></div><div><b>${detail}</b><span>foco</span></div></div><div class="session-actions"><button class="primary" onclick="applyDiagnosticScore(${score})">usar este ponto →</button><button class="ghost" onclick="go('foundation')">rever Fundação Zero</button></div></div>`;return}if(sessionRun.mode==='foundation'){const pct=sessionRun.answered?Math.round(sessionRun.correct/sessionRun.answered*100):0;const completedDay=sessionRun.foundationDay;if(!sessionRun.reviewOnly&&completedDay===(state.foundationDay||1)){state.foundationSessions=(state.foundationSessions||0)+1;state.xp+=(sessionRun.score||0)+15;if(completedDay>=FOUNDATION_TOTAL){state.foundationComplete=true;state.foundationDay=FOUNDATION_TOTAL}else state.foundationDay=completedDay+1;save()}const complete=state.foundationComplete;wrap.innerHTML=`<div class="session-card"><span class="session-kicker">Fundação Zero · sessão concluída</span><h2>${complete?'A porta do N5 está aberta.':'Mais uma camada virou automática.'}</h2><p class="lead">${complete?'Você cobriu som, hiragana, katakana, partículas, verbos, descrição e reparo de conversa. Agora o N5 começa com situações reais, não com alfabetização pendente.':'O objetivo não é “terminar kana”, e sim reduzir o esforço de decodificação a cada encontro.'}</p><div class="session-complete-grid"><div><b>${pct}%</b><span>recuperação</span></div><div><b>+${sessionRun.score+(sessionRun.reviewOnly?0:15)}</b><span>XP</span></div><div><b>${complete?'N5':Math.min(FOUNDATION_TOTAL,state.foundationDay)+'/'+FOUNDATION_TOTAL}</b><span>próximo</span></div></div><div class="session-actions"><button class="primary" onclick="${complete?"go('curriculum')":"go('foundation')"}">${complete?'entrar na trilha N5 →':'voltar à Fundação →'}</button><button class="ghost" onclick="startFoundationSession(${completedDay},true)">repetir esta sessão</button></div></div>`;return}finishDailyState();const pct=sessionRun.answered?Math.round(sessionRun.correct/sessionRun.answered*100):0;wrap.innerHTML=`<div class="session-card"><span class="session-kicker">sessão concluída · おつかれさま</span><h2>Você fechou o circuito,<br>não só a lição.</h2><p class="lead">O que saiu sem pista ganhou espaço. O que exigiu correção já voltou para a fila com intervalo menor.</p><div class="session-complete-grid"><div><b>${pct}%</b><span>recuperação</span></div><div><b>+${sessionRun.score+20}</b><span>XP</span></div><div><b>${state.streak}</b><span>dias seguidos</span></div></div><span class="session-badge">próximo bloco · ${currentPlan().level} ${currentPlan().label}</span><div class="session-actions"><button class="primary" onclick="go('home')">voltar ao painel →</button><button class="ghost" onclick="go('kanji')">abrir Kanji Atlas</button></div></div>`}
function applyDiagnosticScore(score){if(score<=2){state.foundationComplete=false;state.foundationDay=1;save();go('foundation');toast('Começando do som e hiragana')}else if(score<=4){state.foundationComplete=false;state.foundationDay=13;save();go('foundation');toast('Fundação acelerada para a máquina da frase')}else{state.foundationComplete=true;state.foundationDay=FOUNDATION_TOTAL;state.day=score<=6?1:8;save();renderCurriculum(currentPlan().level);go('curriculum');toast('Ponto de partida atualizado')}}
function toggleForge(){const a=document.getElementById('forgeAnswer'),b=document.getElementById('forgeBtn');const show=!a.classList.contains('revealed');a.classList.toggle('revealed',show);b.textContent=show?'ocultar e tentar de novo':'revelar resposta'}
function updateForge(){const x=kanjiData[currentKanji];const p=document.getElementById('forgePrompt'),a=document.getElementById('forgeAnswer'),b=document.getElementById('forgeBtn');if(!p)return;p.textContent=`Qual kanji significa “${x.m.toLowerCase()}”?`;a.textContent=`${x.k} · ${x.ex[0][1]}`;a.classList.remove('revealed');b.textContent='revelar resposta'}



const conjugationData={
 verbs:[
  {head:'食べる',label:'Grupo 2 · ichidan',forms:{'dicionário':'食べる','polida':'食べます','negativa':'食べない','passada':'食べた','forma て':'食べて','potencial':'食べられる'},note:'Grupo 2: retire る e acrescente a terminação. É o padrão mais transparente, mas nem todo verbo terminado em る pertence a este grupo.'},
  {head:'行く',label:'Grupo 1 · godan',forms:{'dicionário':'行く','polida':'行きます','negativa':'行かない','passada':'行った','forma て':'行って','potencial':'行ける'},note:'Grupo 1: a última mora muda de coluna. 行く tem uma forma て/passada especial: 行って / 行った.'},
  {head:'話す',label:'Grupo 1 · godan',forms:{'dicionário':'話す','polida':'話します','negativa':'話さない','passada':'話した','forma て':'話して','potencial':'話せる'},note:'Final す: します / さない / した / して / せる. Observe a família inteira como transformação sonora.'},
  {head:'読む',label:'Grupo 1 · godan',forms:{'dicionário':'読む','polida':'読みます','negativa':'読まない','passada':'読んだ','forma て':'読んで','potencial':'読める'},note:'Finais む/ぶ/ぬ compartilham んで / んだ na forma て e no passado.'},
  {head:'買う',label:'Grupo 1 · godan',forms:{'dicionário':'買う','polida':'買います','negativa':'買わない','passada':'買った','forma て':'買って','potencial':'買える'},note:'Com verbos terminados em う, a negativa usa わ: 買わない.'},
  {head:'する',label:'Irregular',forms:{'dicionário':'する','polida':'します','negativa':'しない','passada':'した','forma て':'して','potencial':'できる'},note:'する é irregular e extremamente produtivo: substantivo + する cria muitos verbos, como 勉強する.'},
  {head:'来る',label:'Irregular',forms:{'dicionário':'来る','polida':'来ます','negativa':'来ない','passada':'来た','forma て':'来て','potencial':'来られる'},note:'来る muda leitura entre formas. Aprenda a família como um bloco de alta frequência.'}
 ],
 adjectives:[
  {head:'高い',label:'adjetivo い',forms:{'não-passado':'高いです','negativa':'高くないです','passada':'高かったです','neg. passada':'高くなかったです','antes de N':'高い店','advérbio':'高く'},note:'Adjetivos い conjugam no próprio adjetivo. Não use でした diretamente após 高い.'},
  {head:'静か',label:'adjetivo な',forms:{'não-passado':'静かです','negativa':'静かじゃないです','passada':'静かでした','neg. passada':'静かじゃなかったです','antes de N':'静かな店','advérbio':'静かに'},note:'Adjetivos な usam な antes de substantivo, mas não antes de です.'},
  {head:'好き',label:'adjetivo な',forms:{'não-passado':'好きです','negativa':'好きじゃないです','passada':'好きでした','neg. passada':'好きじゃなかったです','antes de N':'好きな店','alvo típico':'日本語が好きです'},note:'好き funciona gramaticalmente como adjetivo な. O alvo do gosto costuma aparecer com が.'}
 ]
};
let conjKind='verbs',conjIndex=0;
function renderConjugation(){const rows=conjugationData[conjKind];if(!rows)return;document.querySelectorAll('[data-conj-kind]').forEach(b=>b.classList.toggle('active',b.dataset.conjKind===conjKind));document.getElementById('conjList').innerHTML=rows.map((x,i)=>`<button class="${i===conjIndex?'active':''}" onclick="conjIndex=${i};renderConjugation()"><b>${x.head}</b><small>${x.label}</small></button>`).join('');const x=rows[Math.min(conjIndex,rows.length-1)];document.getElementById('conjTable').innerHTML=Object.entries(x.forms).map(([k,v])=>`<div class="conj-cell"><span>${k}</span><b>${v}</b><button class="audio-btn" style="margin-top:7px" onclick="speak('${v.replaceAll("'","\\'")}')">▶</button></div>`).join('');document.getElementById('conjNote').textContent=x.note}

const soundPairs=[
 {a:'おばさん',b:'おばあさん',aPt:'tia / senhora',bPt:'avó',cue:'A vogal longa ocupa tempo extra.'},
 {a:'きて',b:'きって',aPt:'venha / vestindo (contexto)',bPt:'selo postal',cue:'O pequeno っ cria uma mora de fechamento.'},
 {a:'ここ',b:'こうこう',aPt:'aqui',bPt:'ensino médio',cue:'A duração de お muda o ritmo e a palavra.'},
 {a:'びよういん',b:'びょういん',aPt:'salão de beleza',bPt:'hospital',cue:'Yōon + duração merecem escuta lenta.'}
];
let currentSoundQuiz=null;
function playSoundQuiz(){const pair=soundPairs[Math.floor(Math.random()*soundPairs.length)];const target=Math.random()<.5?'a':'b';currentSoundQuiz={pair,target};speak(pair[target]);const wrap=document.getElementById('soundQuizOptions');wrap.innerHTML=`<button onclick="answerSoundQuiz('a')">${pair.a}</button><button onclick="answerSoundQuiz('b')">${pair.b}</button>`;document.getElementById('soundQuizFeedback').textContent='Qual forma você ouviu? Não leia tradução ainda.'}
function answerSoundQuiz(choice){if(!currentSoundQuiz)return;const {pair,target}=currentSoundQuiz,ok=choice===target;const btns=[...document.querySelectorAll('#soundQuizOptions button')];btns.forEach((b,i)=>{const key=i===0?'a':'b';b.disabled=true;if(key===target)b.classList.add('correct');if(key===choice&&!ok)b.classList.add('wrong')});if(ok){state.soundWins=(state.soundWins||0)+1;state.xp+=2;save()}document.getElementById('soundQuizFeedback').textContent=`${ok?'Certo.':'Compare de novo.'} ${pair.a} = ${pair.aPt}; ${pair.b} = ${pair.bPt}. ${pair.cue}`}

const confusionPairs=[
 {a:'シ',b:'ツ',cue:'シ tende a subir pela direita; ツ cai de cima para baixo.'},
 {a:'ソ',b:'ン',cue:'Observe a direção dos dois traços curtos antes do traço longo.'},
 {a:'ぬ',b:'め',cue:'ぬ fecha com um laço; め não termina com o mesmo gancho.'},
 {a:'れ',b:'ね',cue:'ね ganha um laço/volta final; れ permanece mais aberto.'},
 {a:'さ',b:'き',cue:'き cruza com um traço adicional; さ é mais econômico.'},
 {a:'ク',b:'ケ',cue:'ケ adiciona um traço vertical e ganha estrutura mais aberta.'},
 {a:'ウ',b:'ワ',cue:'ウ possui o pequeno traço superior; ワ abre a lateral.'},
 {a:'ル',b:'レ',cue:'ル termina em duas pernas; レ é um único gesto principal.'}
];
let confusionIndex=0,confusionTarget='a';
function renderConfusions(){const wrap=document.getElementById('confusionGrid');if(!wrap)return;wrap.innerHTML=confusionPairs.map((x,i)=>`<button class="confusion-card ${i===confusionIndex?'active':''}" onclick="practiceConfusion(${i})"><b>${x.a} ${x.b}</b><span>${x.cue}</span></button>`).join('');newConfusionQuestion()}
function practiceConfusion(i){confusionIndex=i;renderConfusions()}
function newConfusionQuestion(){const p=confusionPairs[confusionIndex];if(!p)return;confusionTarget=Math.random()<.5?'a':'b';document.getElementById('confusionPrompt').textContent=p[confusionTarget];document.getElementById('confusionChoices').innerHTML=`<button onclick="answerConfusion('a')">${p.a}</button><button onclick="answerConfusion('b')">${p.b}</button>`;document.getElementById('confusionFeedback').textContent='Identifique sem usar romaji.'}
function answerConfusion(key){const p=confusionPairs[confusionIndex],ok=key===confusionTarget;document.getElementById('confusionFeedback').textContent=(ok?'Correto. ':'Revise o contraste. ')+p.cue;if(ok){state.xp+=1;save()}setTimeout(newConfusionQuestion,650)}

const sentencePuzzles=[
 {pt:'Eu compro água no konbini.',tokens:['わたしは','コンビニで','みずを','かいます。'],answer:['わたしは','コンビニで','みずを','かいます。'],note:'は tópico · で lugar da ação · を objeto · verbo no fim.'},
 {pt:'Vou à estação às sete.',tokens:['しちじに','えきへ','いきます。'],answer:['しちじに','えきへ','いきます。'],note:'に marca horário; へ marca direção.'},
 {pt:'Há uma loja em frente à estação.',tokens:['えきのまえに','みせが','あります。'],answer:['えきのまえに','みせが','あります。'],note:'Lugar + に, entidade + が, existência no fim.'},
 {pt:'Como sushi com um amigo.',tokens:['ともだちと','すしを','たべます。'],answer:['ともだちと','すしを','たべます。'],note:'と companhia; を objeto; verbo fecha.'},
 {pt:'Esta loja é barata.',tokens:['このみせは','やすいです。'],answer:['このみせは','やすいです。'],note:'Adjetivo い pode funcionar como predicado.'},
 {pt:'Como estou ocupado, não vou.',tokens:['いそがしいから、','いきません。'],answer:['いそがしいから、','いきません。'],note:'から conecta motivo → consequência.'}
];
let sentencePuzzleIndex=0,sentenceBuilt=[];
function shuffleArray(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function renderSentencePuzzle(){const x=sentencePuzzles[sentencePuzzleIndex];if(!x)return;document.getElementById('sentencePrompt').textContent=x.pt;const pool=shuffleArray(x.tokens.map((t,i)=>({t,i})));document.getElementById('sentenceBank').innerHTML=pool.map(o=>`<button class="sentence-token" data-token-index="${o.i}" onclick="addSentenceToken(${o.i},this)">${o.t}</button>`).join('');sentenceBuilt=[];renderSentenceBuilt();document.getElementById('sentenceFeedback').className='sentence-feedback';document.getElementById('sentenceFeedback').textContent='Monte os blocos. Partículas mostram o papel de cada um.'}
function renderSentenceBuilt(){const wrap=document.getElementById('sentenceBuild');if(!sentenceBuilt.length){wrap.innerHTML='<span style="color:#647181;font-size:8px">sua frase aparece aqui</span>';return}wrap.innerHTML=sentenceBuilt.map((i,pos)=>`<button class="sentence-token" onclick="removeSentenceToken(${pos})">${sentencePuzzles[sentencePuzzleIndex].tokens[i]}</button>`).join('')}
function addSentenceToken(i,btn){if(sentenceBuilt.includes(i))return;sentenceBuilt.push(i);btn.classList.add('used');renderSentenceBuilt()}
function removeSentenceToken(pos){const idx=sentenceBuilt.splice(pos,1)[0];document.querySelectorAll(`[data-token-index="${idx}"]`).forEach(b=>b.classList.remove('used'));renderSentenceBuilt()}
function resetSentencePuzzle(){renderSentencePuzzle()}
function nextSentencePuzzle(){sentencePuzzleIndex=(sentencePuzzleIndex+1)%sentencePuzzles.length;renderSentencePuzzle()}
function checkSentencePuzzle(){const x=sentencePuzzles[sentencePuzzleIndex];const built=sentenceBuilt.map(i=>x.tokens[i]);const ok=JSON.stringify(built)===JSON.stringify(x.answer);const f=document.getElementById('sentenceFeedback');f.className='sentence-feedback '+(ok?'good':'bad');f.textContent=(ok?'Boa estrutura. ':'Ainda não. Modelo: '+x.answer.join(' ')+'. ')+x.note;if(ok){state.sentenceSolved=(state.sentenceSolved||0)+1;state.xp+=4;save()}}
function speakSentenceAnswer(){speak(sentencePuzzles[sentencePuzzleIndex].answer.join(' '))}

let grammarCategory='ALL';
function grammarCategoryOf(x){const f=(x.function+' '+x.form).toLowerCase();if(/[はがをにでへとも]/.test(x.form)&&x.level==='ZERO')return 'Partículas';if(/verbo|ação|forma|pedido|permiss|proibi|potencial|passiv|causativ|hábito|plano|intenção|experimenta|preparar/.test(f))return 'Verbos';if(/adjet|descre|aparência|semelhança|grau|tendência/.test(f))return 'Descrição';if(/porque|motivo|condi|mesmo se|apesar|durante|enquanto|cada vez|à medida|conector|objetivo|causa/.test(f))return 'Conexões';if(x.level==='N3'||/opinião|inferência|expectativa|nuance|explicar|regra|decisão|ênfase|conclusão/.test(f))return 'Nuance';return 'Fundamentos'}
function renderGrammarMap(){const wrap=document.getElementById('grammarMap');if(!wrap)return;const cats=['Fundamentos','Partículas','Verbos','Descrição','Conexões','Nuance'];wrap.innerHTML=cats.map(c=>`<div><b>${c}</b><span>${grammarData.filter(x=>grammarCategoryOf(x)===c).length} padrões</span></div>`).join('')}
function grammarBridge(x){const f=x.form;if(f.includes('は'))return 'Não traduza は como uma palavra fixa. Ele organiza o tópico; em uso de partícula lê-se wa.';if(f.includes('が'))return 'Português/inglês tendem a depender mais da posição. Japonês usa が para marcar sujeito/foco em muitos contextos.';if(f.includes('を'))return 'を marca o objeto e normalmente é pronunciado o na fala moderna.';if(f.includes('に')||f.includes('で'))return 'Evite procurar uma única preposição equivalente: escolha a partícula pela função do bloco.';if(/V|ます|て|辞書形/.test(f))return 'O verbo japonês carrega muita informação no final da frase. Espere o predicado antes de fechar a interpretação.';if(/adj|い|な/.test(f))return 'Adjetivos japoneses não concordam em gênero ou número como no português; い e な têm comportamentos próprios.';return 'Procure a função comunicativa primeiro e só depois compare com uma tradução em português/inglês.'}
function openGrammarDrawer(i){const x=grammarData[i];if(!x)return;state.grammarOpened[i]=Date.now();save();const c=document.getElementById('grammarDrawerContent');c.innerHTML=`<span class="eyebrow">${x.level} · ${grammarCategoryOf(x)}</span><h2>${x.function}</h2><p style="font-size:10px;color:#98a3af;line-height:1.7">${x.meaning}</p><div class="grammar-drawer-form">${x.form}</div><div class="grammar-drawer-section"><b>EXEMPLO VIVO</b><div class="grammar-drawer-example">${x.jp}</div><p>${x.pt}</p><button class="secondary" onclick="speak('${x.jp.replaceAll("'","\\'")}')">▶ ouvir exemplo</button></div><div class="grammar-drawer-section"><b>PONTE PT / EN</b><p>${grammarBridge(x)}</p></div><div class="grammar-drawer-section"><b>NOTA DE USO</b><p>${x.note||'Aprenda o padrão dentro de frases completas e varie apenas um elemento por vez antes de produzir livremente.'}</p></div><div class="grammar-drawer-section"><b>RECUPERAÇÃO</b><p>Sem olhar a forma acima: como você expressaria “${x.pt}” em japonês?</p><button class="ghost" onclick="document.getElementById('grammarSelfCheck').style.display='block'">revelar modelo</button><div id="grammarSelfCheck" class="grammar-selfcheck">${x.jp}<br><span>${x.form}</span></div></div>`;document.getElementById('grammarDrawer').classList.add('open')}
function closeGrammarDrawer(){document.getElementById('grammarDrawer').classList.remove('open')}
function setGrammarCategory(cat){grammarCategory=cat;document.querySelectorAll('[data-grammar-cat]').forEach(b=>b.classList.toggle('active',b.dataset.grammarCat===cat));renderGrammar(grammarLevel,document.getElementById('grammarSearch')?.value||'')}

let foundationKanaScript='hira',foundationKanaSet='basic',kanaQuizDirection='read',currentKanaQuiz=null,grammarLevel='ZERO';
function allKanaItems(script=foundationKanaScript,set=foundationKanaSet){return kanaCourse[script][set]||[]}
function isKanaDue(k){return reviewIsDue('kana',k,true)}
function countKanaInTraining(){return Object.keys(state.kanaMastery||{}).filter(k=>kanaMastery(k)>0&&kanaMastery(k)<5&&isKanaDue(k)).length}
function kanaMastery(k){return Math.max(0,Math.min(5,Number(state.kanaMastery?.[k]??reviewMastery('kana',k))))}
function gradeKana(k,g,quiet=false){const prev=kanaMastery(k);state.kanaMastery[k]=g==='hard'?Math.max(0,prev-1):g==='good'?Math.min(5,prev+1):Math.min(5,prev+2);const r=gradeReview('kana',k,g);state.kanaReviews[k]={...r};if(!quiet)state.xp+=g==='hard'?1:g==='good'?3:5;save();renderFoundationKana();if(!quiet)toast(`Kana ${k} · próxima volta ${g==='hard'?'em algumas horas':Math.max(1,Math.round(r.interval))+'d'}`)}
function renderFoundationProgress(){const day=Math.max(1,Math.min(FOUNDATION_TOTAL,state.foundationDay||1)),pct=state.foundationComplete?100:Math.round((day-1)/FOUNDATION_TOTAL*100);[['foundationPct',pct+'%'],['zeroEntryPct',pct+'%']].forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.textContent=v});const f=document.getElementById('foundationProgressFill');if(f)f.style.width=pct+'%';const n=document.getElementById('foundationNow');if(n){const u=foundationUnits[day-1];n.textContent=state.foundationComplete?'Fundação concluída · N5 liberado':`Sessão ${day} · ${u.title}`};const firm=Object.values(state.kanaMastery||{}).filter(v=>v>=3).length;const due=Object.keys(state.kanaMastery||{}).filter(k=>kanaMastery(k)>0&&isKanaDue(k)).length;const rom=state.romajiMode==='show'?100:state.romajiMode==='hide'?0:Math.max(0,Math.round(100-(day-1)/(FOUNDATION_TOTAL-1)*100));const opened=new Set([...Object.keys(state.grammarOpened||{}),...Object.keys(state.grammarRecall||{})]).size;const vals=[['kanaKnownMetric',firm],['kanaDueMetric',due],['romajiMetric',rom+'%'],['grammarSeenMetric',opened]];vals.forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.textContent=v});const rb=document.getElementById('romajiModeBtn');if(rb)rb.textContent=state.romajiMode==='show'?'mostrar':state.romajiMode==='hide'?'oculto':'automático'}
function renderFoundationRunway(){const wrap=document.getElementById('foundationRunway');if(!wrap)return;const d=state.foundationDay||1;wrap.innerHTML=foundationUnits.map(u=>{const done=state.foundationComplete||u.n<d,current=!state.foundationComplete&&u.n===d,locked=!state.foundationComplete&&u.n>d;return `<button class="foundation-step ${done?'done':''} ${current?'current':''} ${locked?'locked':''}" onclick="openFoundationUnit(${u.n})"><small>sessão ${u.n}/${FOUNDATION_TOTAL}</small><b>${u.title}</b><p>${u.desc}</p><i>${u.symbol}</i></button>`}).join('')}
function renderPronunciation(){const wrap=document.getElementById('soundGrid');if(!wrap)return;wrap.innerHTML=pronunciationData.map(x=>`<article class="sound-card"><header><span class="sound-symbol">${x.symbol}</span><button onclick="speak('${x.audio.replaceAll("'","\\'")}')" aria-label="Ouvir ${x.title}">▶</button></header><b>${x.title}</b><p>${x.text}</p><span class="bridge">${x.bridge}</span></article>`).join('')}
function toggleRomajiMode(){state.romajiMode=state.romajiMode==='auto'?'show':state.romajiMode==='show'?'hide':'auto';save();renderFoundationKana();renderFoundationProgress()}
function renderFoundationKana(){const wrap=document.getElementById('foundationKanaGrid');if(!wrap)return;const items=allKanaItems();const autoFade=state.romajiMode==='auto'&&(state.foundationDay||1)>8;wrap.innerHTML=items.map(([k,r])=>`<button class="foundation-kana m${kanaMastery(k)} ${currentKanaQuiz?.kana===k?'selected':''} ${isKanaDue(k)&&kanaMastery(k)>0?'due':'scheduled'} ${state.romajiMode==='hide'?'hide-romaji':'auto-romaji'} ${autoFade?'romaji-faded':''}" onclick="speak('${k}');currentKanaQuiz={kana:'${k}',roman:'${r}'};document.getElementById('kanaQuizPrompt').textContent='${k}';document.getElementById('kanaQuizFeedback').textContent='${k} · ${r}. Ouça e repita.'"><b>${k}</b><small>${r}</small></button>`).join('')}
function setKanaQuizDirection(dir){kanaQuizDirection=dir;newKanaQuiz()}
function speakCurrentKana(){if(currentKanaQuiz)speak(currentKanaQuiz.kana)}
function newKanaQuiz(){const items=allKanaItems();if(!items.length)return;const sorted=[...items].sort((a,b)=>(isKanaDue(a[0])?0:1)-(isKanaDue(b[0])?0:1)||kanaMastery(a[0])-kanaMastery(b[0])||Math.random()-.5);const item=sorted[Math.floor(Math.random()*Math.min(8,sorted.length))]||sorted[0];currentKanaQuiz={kana:item[0],roman:item[1]};const prompt=document.getElementById('kanaQuizPrompt'),title=document.getElementById('kanaQuizTitle'),opts=document.getElementById('kanaQuizOptions'),fb=document.getElementById('kanaQuizFeedback');if(!prompt||!opts)return;const pool=items.map(x=>kanaQuizDirection==='read'?x[1]:x[0]);const answer=kanaQuizDirection==='read'?item[1]:item[0];prompt.textContent=kanaQuizDirection==='read'?item[0]:item[1];title.textContent=kanaQuizDirection==='read'?'Leia sem romaji.':'Recupere a forma.';const options=shuffledOptions(answer,pool);opts.innerHTML=options.map((o,i)=>`<button data-kana-option="${i}" onclick="answerKanaQuiz(${i})">${o}</button>`).join('');currentKanaQuiz.options=options;currentKanaQuiz.answer=answer;if(fb)fb.textContent=kanaQuizDirection==='read'?'Escolha o som. Depois ouça e repita.':'Escolha o kana sem consultar o mapa.';renderFoundationKana()}
function answerKanaQuiz(i){if(!currentKanaQuiz)return;const buttons=[...document.querySelectorAll('[data-kana-option]')];if(buttons.some(b=>b.disabled))return;const chosen=currentKanaQuiz.options[i],ok=chosen===currentKanaQuiz.answer;buttons.forEach((b,j)=>{b.disabled=true;if(currentKanaQuiz.options[j]===currentKanaQuiz.answer)b.classList.add('correct')});if(!ok)buttons[i].classList.add('wrong');gradeKana(currentKanaQuiz.kana,ok?'good':'hard',true);const fb=document.getElementById('kanaQuizFeedback');fb.innerHTML=`${ok?'Boa.':'Corrija agora.'} <b>${currentKanaQuiz.kana} · ${currentKanaQuiz.roman}</b> <button class="small-btn" onclick="newKanaQuiz()">próximo →</button>`;speak(currentKanaQuiz.kana)}
function renderGrammar(level=grammarLevel,query=''){grammarLevel=level;document.querySelectorAll('[data-grammar-level]').forEach(b=>b.classList.toggle('active',b.dataset.grammarLevel===level));const q=(query||'').trim().toLowerCase();const rows=grammarData.map((x,i)=>({x,i})).filter(o=>(level==='ALL'||o.x.level===level)&&(grammarCategory==='ALL'||grammarCategoryOf(o.x)===grammarCategory)&&(!q||[o.x.function,o.x.form,o.x.meaning,o.x.jp,o.x.pt,o.x.note,grammarCategoryOf(o.x)].join(' ').toLowerCase().includes(q)));const wrap=document.getElementById('grammarGrid');if(!wrap)return;wrap.innerHTML=rows.map(({x,i})=>`<article class="grammar-card" onclick="openGrammarDrawer(${i})"><span class="g-level">${x.level} · ${grammarCategoryOf(x)}</span><button onclick="event.stopPropagation();speak('${x.jp.replaceAll("'","\'")}')" aria-label="Ouvir exemplo">▶</button><h4>${x.function}</h4><div class="g-form">${x.form}</div><p>${x.meaning}${x.note?` ${x.note}`:''}</p><div class="g-example"><b>${x.jp}</b><span>${x.pt}</span></div></article>`).join('')||'<div class="session-feedback">Nenhum padrão encontrado com este filtro.</div>'}
function renderFoundation(){renderFoundationProgress();renderFoundationRunway();renderPronunciation();renderFoundationKana();renderGrammarMap();renderConjugation();renderGrammar(grammarLevel,document.getElementById('grammarSearch')?.value||'');renderConfusions();renderSentencePuzzle();if(!currentKanaQuiz)newKanaQuiz();if(!currentSoundQuiz)playSoundQuiz()}

function setupCanvas(canvas){const ctx=canvas.getContext('2d');let drawing=false,last=null;function resize(){const r=canvas.parentElement.getBoundingClientRect();const dpr=window.devicePixelRatio||1;canvas.width=Math.floor(r.width*dpr);canvas.height=Math.floor(r.height*dpr);canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#101726';ctx.lineWidth=7}function p(e){const r=canvas.getBoundingClientRect();const t=e.touches?.[0]||e;return{x:t.clientX-r.left,y:t.clientY-r.top}}function start(e){e.preventDefault();drawing=true;last=p(e)}function move(e){if(!drawing)return;e.preventDefault();const n=p(e);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(n.x,n.y);ctx.stroke();last=n}function end(){drawing=false;last=null}canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);window.addEventListener('pointerup',end);resize();window.addEventListener('resize',resize);return ctx}
function clearDraw(ctx,canvas){ctx.clearRect(0,0,canvas.width,canvas.height)}
let drawCanvas=null,drawCtx=null,freeCanvas=null,freeCtx=null;
function ensureDrawingCanvases(){
 if(drawCtx&&freeCtx)return;
 drawCanvas=document.getElementById('drawCanvas');freeCanvas=document.getElementById('freeCanvas');
 if(drawCanvas&&!drawCtx)drawCtx=setupCanvas(drawCanvas);
 if(freeCanvas&&!freeCtx)freeCtx=setupCanvas(freeCanvas);
 const clear=document.getElementById('clearCanvas'),freeClear=document.getElementById('freeClear'),guide=document.getElementById('toggleGuide');
 if(clear&&!clear.dataset.bound){clear.dataset.bound='1';clear.onclick=()=>clearDraw(drawCtx,drawCanvas)}
 if(freeClear&&!freeClear.dataset.bound){freeClear.dataset.bound='1';freeClear.onclick=()=>clearDraw(freeCtx,freeCanvas)}
 if(guide&&!guide.dataset.bound){guide.dataset.bound='1';guide.onclick=e=>{document.getElementById('ghostKanji').classList.toggle('hidden');e.target.textContent=document.getElementById('ghostKanji').classList.contains('hidden')?'mostrar guia':'ocultar guia'}}
}

function missionOpen(i){const m=missions[i],sc=missionSpeech[i];document.getElementById('npcLine').textContent=sc.npc;document.getElementById('npcPt').textContent=sc.npcPt;document.getElementById('targetSpeech').textContent=sc.target;document.getElementById('targetPt').textContent='“'+sc.pt+'”';document.getElementById('transcript').textContent='Sua transcrição aparecerá aqui. Se o reconhecimento de voz não estiver disponível, use o áudio e faça shadowing.';document.getElementById('speechScore').textContent='0';document.getElementById('scoreRing').style.setProperty('--score',0);toast('Missão aberta: '+m.title);go('speaking')}

document.querySelectorAll('[data-conj-kind]').forEach(b=>b.addEventListener('click',()=>{conjKind=b.dataset.conjKind;conjIndex=0;renderConjugation()}));
document.querySelectorAll('[data-foundation-script]').forEach(b=>b.addEventListener('click',()=>{foundationKanaScript=b.dataset.foundationScript;document.querySelectorAll('[data-conj-kind]').forEach(b=>b.addEventListener('click',()=>{conjKind=b.dataset.conjKind;conjIndex=0;renderConjugation()}));
document.querySelectorAll('[data-foundation-script]').forEach(x=>x.classList.toggle('active',x===b));renderFoundationKana();newKanaQuiz()}));
document.querySelectorAll('[data-foundation-set]').forEach(b=>b.addEventListener('click',()=>{foundationKanaSet=b.dataset.foundationSet;document.querySelectorAll('[data-foundation-set]').forEach(x=>x.classList.toggle('active',x===b));renderFoundationKana();newKanaQuiz()}));
document.querySelectorAll('[data-grammar-level]').forEach(b=>b.addEventListener('click',()=>renderGrammar(b.dataset.grammarLevel,document.getElementById('grammarSearch')?.value||'')));
document.querySelectorAll('[data-grammar-cat]').forEach(b=>b.addEventListener('click',()=>setGrammarCategory(b.dataset.grammarCat)));
document.getElementById('grammarSearch')?.addEventListener('input',e=>renderGrammar(grammarLevel,e.target.value));

const initialChapter=document.getElementById('chapterContent').innerHTML;
document.querySelectorAll('[data-book]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-book]').forEach(b=>b.classList.toggle('active',b===btn));const i=Number(btn.dataset.book);document.getElementById('chapterContent').innerHTML=i===0?initialChapter:bookData[i];if(i===0){const t=document.getElementById('toggleTranslation');if(t)t.onclick=toggleReadingTranslation}}));
function toggleReadingTranslation(e){const p=document.getElementById('readingTranslation');if(!p)return;const show=p.style.display==='none';p.style.display=show?'block':'none';e.target.textContent=show?'ocultar tradução':'mostrar tradução'}
function renderKana(type='hira'){document.getElementById('kanaGrid').innerHTML=kanaSets[type].map(k=>`<button class="kana-key" onclick="speak('${k[0]}')"><b>${k[0]}</b><span>${k[1]}</span></button>`).join('')}
document.querySelectorAll('[data-kana]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-kana]').forEach(x=>x.classList.toggle('active',x===b));renderKana(b.dataset.kana)}));
renderKana();

document.getElementById('toggleTranslation').onclick=toggleReadingTranslation;
document.getElementById('listenTarget').onclick=()=>speak(document.getElementById('targetSpeech').textContent);
function normalizeJP(s){return(s||'').replace(/[\s。、！？,.!?]/g,'').replace(/とうきょう/g,'東京').replace(/えき/g,'駅').toLowerCase()}
function similarity(a,b){a=normalizeJP(a);b=normalizeJP(b);if(!a||!b)return 0;let same=0;for(const ch of new Set(a)){same+=Math.min(a.split(ch).length-1,b.split(ch).length-1)}return Math.max(0,Math.min(100,Math.round((same/Math.max(a.length,b.length))*115)))}
document.getElementById('micBtn').onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('Reconhecimento de voz indisponível');document.getElementById('transcript').textContent='Seu navegador não oferece reconhecimento de voz. Use ▶ e faça shadowing.';return}const r=new SR();r.lang='ja-JP';r.interimResults=false;r.maxAlternatives=1;const btn=document.getElementById('micBtn');btn.textContent='● Ouvindo…';r.onresult=e=>{const txt=e.results[0][0].transcript;document.getElementById('transcript').textContent=txt;const sc=similarity(txt,document.getElementById('targetSpeech').textContent);document.getElementById('speechScore').textContent=sc;document.getElementById('scoreRing').style.setProperty('--score',sc);state.speech=Math.max(state.speech,sc);state.xp+=10;save();toast('Resposta registrada • +10 XP')};r.onerror=()=>toast('Não consegui captar a fala');r.onend=()=>btn.textContent='● Falar agora';r.start()};
const globalSearch=document.getElementById('globalSearch');
if(globalSearch){globalSearch.addEventListener('keydown',async e=>{if(e.key==='Enter'&&e.target.value.trim()){await go('kanji');const q=e.target.value.trim();const ks=document.getElementById('kanjiSearch');ks.value=q;renderKanjiList('all',q);setTimeout(()=>ks.focus(),220)}})}
if(matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelectorAll('.experience-card,.mission').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--rx',(-y*4)+'deg');card.style.setProperty('--ry',(x*5)+'deg')});card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg')})})}

// ---------- V6 GAME LOOP ----------
const pathUnits=[
 {title:'Portão 1 · Sons que cabem na boca',sub:'vogais, mora e primeiro hiragana',nodes:[['lesson','Vogais','あ',1],['lesson','K + S','し',2],['story','Primeiras palavras','本',2],['chest','Baú','箱',0],['checkpoint','Checkpoint','門',3]]},
 {title:'Portão 2 · Hiragana automático',sub:'linhas restantes, dakuten e combinações',nodes:[['lesson','T + N','つ',3],['lesson','H + M','ふ',4],['lesson','Y + R + W','ら',5],['lesson','Dakuten','が',6],['checkpoint','Checkpoint','門',7]]},
 {title:'Portão 3 · Ritmo e Katakana',sub:'っ, yōon, palavras estrangeiras e duração',nodes:[['lesson','Yōon & っ','きょ',7],['lesson','Katakana A–S','ア',8],['lesson','Katakana T–H','ツ',9],['story','Cidade em katakana','街',10],['chest','Baú','箱',0],['lesson','Katakana M–N','ン',10],['checkpoint','Duração','ー',11]]},
 {title:'Portão 4 · A máquina da frase',sub:'kana misto, tópico, pergunta e partículas nucleares',nodes:[['lesson','Escrita mista','字',12],['lesson','A は B です','は',13],['lesson','は・が・を','を',14],['story','Conheça alguém','会',13],['lesson','に・で・へ','に',15],['checkpoint','Partículas','門',16]]},
 {title:'Portão 5 · Verbos para sobreviver',sub:'ação polida, tempo, pedidos e descrição',nodes:[['lesson','の・と・も・か','の',16],['lesson','Verbos ます','ます',17],['lesson','Passado & negativo','た',18],['chest','Baú','箱',0],['lesson','Forma て','て',19],['checkpoint','Pedidos','門',19]]},
 {title:'Portão 6 · Descrever o mundo',sub:'adjetivos, existência, horas e formas simples',nodes:[['lesson','Adjetivos','い',20],['lesson','あります / います','ある',21],['lesson','Horas & contadores','時',22],['story','Um dia no Japão','日',22],['lesson','Forma simples','から',23],['checkpoint','Fundação concluída','門',24]]},
 {title:'Seção N5 · Sobrevivência urbana',sub:'estação, konbini, comida e pedidos reais',nodes:[['lesson','Estação','駅',25],['lesson','Compras','店',26],['story','No konbini','本',26],['lesson','Restaurante','食',27],['chest','Baú','箱',0],['checkpoint','Sobrevivência','旅',28]]},
 {title:'Seção N5 · Rotina & autonomia',sub:'endereço, trabalho, saúde e leitura funcional',nodes:[['lesson','Endereço','住',29],['lesson','Trabalho','働',30],['lesson','Saúde','病',31],['story','Meu primeiro mês','本',31],['lesson','Revisão N5','復',32],['checkpoint','N5 essencial','冠',33]]},
 {title:'N5 · Casa & tempo',sub:'localização, horários e deslocamento cotidiano',nodes:[['lesson','Casa','家',34],['lesson','Horas','時',35],['lesson','Transporte','電',36],['checkpoint','Mover-se sozinho','門',36]]},
 {title:'N5 · Mundo ao redor',sub:'clima, convites, gostos e descrições',nodes:[['lesson','Clima','天',37],['lesson','Convites','友',38],['lesson','Preferências','好',39],['lesson','Descrição','大',40],['checkpoint','Vida social básica','門',40]]},
 {title:'N5 · Existir, contar e pedir',sub:'existência, quantidades, pedidos e regras',nodes:[['lesson','Existência','在',41],['lesson','Contadores','数',42],['lesson','Pedidos','待',43],['lesson','Permissão','可',44],['checkpoint','Agir no espaço público','門',44]]},
 {title:'N5 · Desejo & rotina',sub:'querer, rotina e frequência sem roteiro pronto',nodes:[['lesson','Desejos','望',45],['lesson','Rotina','日',46],['lesson','Frequência','時',47],['story','Um dia comum','本',47],['checkpoint','Rotina independente','門',47]]},
 {title:'N5 · Passado & explicação',sub:'contar o que aconteceu, ordenar ações e dar motivos',nodes:[['lesson','Passado','昨',48],['lesson','Antes e depois','前',49],['lesson','Motivos','理',50],['checkpoint','Contar & explicar','門',50]]},
 {title:'N5 · Informação & serviços',sub:'perguntas abertas, status, telefone e autonomia',nodes:[['lesson','Perguntas abertas','何',51],['lesson','Já & ainda','未',52],['lesson','Telefone & serviços','話',53],['story','Resolver um dia','本',53],['checkpoint','Autonomia N5','冠',54]]}
];
const flatPath=[];pathUnits.forEach((u,ui)=>u.nodes.forEach((n,ni)=>flatPath.push({unit:ui,local:ni,type:n[0],label:n[1],icon:n[2],day:n[3]})));
function todayQuestState(){const d=localDateKey();if(state.quests.date!==d)state.quests={date:d,lessons:0,xp:0,accuracy:false};return state.quests}
function renderGameHome(){
 const wrap=document.getElementById('learningPath');if(!wrap)return;
 const q=todayQuestState(),total=flatPath.length,progress=Math.max(0,Math.min(total,state.pathProgress||0));
 let gi=0;
 wrap.innerHTML=pathUnits.map((u,ui)=>{
   const startIndex=gi;
   const html=u.nodes.map((n,ni)=>{
     const idx=gi++,type=n[0],done=idx<progress,current=idx===progress,locked=idx>progress,repairing=current&&state.remediation?.idx===idx;
     const cls=`${type} ${done?'done':''} ${current?'current':''} ${repairing?'reinforcing':''} ${locked?'locked':''}`;
     const click=locked?`toast('Complete o círculo anterior primeiro')`:repairing?`startMasteryRepair(${idx})`:type==='chest'?`claimPathChest(${idx})`:`startQuickLesson(${idx})`;
     const label=repairing?`↻ reforçar · ${n[1]}`:n[1];
     const typeLabel={lesson:'lição',story:'história',checkpoint:'checkpoint',chest:'recompensa'}[type]||type;
     return `<div class="path-node-wrap ${current?'is-current':''} ${done?'is-done':''}" data-node-index="${idx}">
       <button class="path-node ${cls}" onclick="${click}" aria-label="${label}" ${current?'aria-current="step"':''}>
         <span class="node-halo" aria-hidden="true"></span>
         <span class="node-icon">${done?'✓':repairing?'復':n[2]}</span>
         <span class="node-type">${typeLabel}</span>
         <small>${label}</small>
       </button>
     </div>`;
   }).join('');
   const count=u.nodes.length,endIndex=gi-1,doneCount=Math.max(0,Math.min(count,progress-startIndex));
   const unitPct=Math.round(doneCount/count*100);
   const currentUnit=progress>=startIndex&&progress<=endIndex;
   const unitDone=progress>endIndex;
   const unitLocked=progress<startIndex;
   const status=unitDone?'concluída':currentUnit?'em curso':'bloqueada';
   return `<section class="path-unit ${currentUnit?'current-unit':''} ${unitDone?'done-unit':''} ${unitLocked?'locked-unit':''}" data-unit-index="${ui}">
     <div class="path-unit-head">
       <div class="unit-heading"><span>unidade ${String(ui+1).padStart(2,'0')}</span><b>${u.title}</b><small>${u.sub}</small></div>
       <div class="unit-status"><strong>${status}</strong><span>${doneCount}/${count} etapas</span></div>
       <div class="unit-progress" aria-label="${unitPct}% concluído"><i style="width:${unitPct}%"></i></div>
     </div>
     <div class="lesson-path">${html}</div>
   </section>`;
 }).join('');
 const pct=Math.round(progress/total*100),unit=(flatPath[Math.min(progress,total-1)]||{unit:0}).unit;
 const el=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 el('courseSectionLabel',`Seção ${unit+1}`);el('courseScore',Math.round((state.xp||0)/10));el('coursePct',pct+'%');el('leagueMiniText',`${state.leagueXp||0} XP esta semana`);
 const goal=Math.min(100,Math.round((q.xp||0)/30*100)),ring=document.getElementById('dailyRing');if(ring)ring.style.setProperty('--goal',goal+'%');el('dailyGoalPct',goal+'%');
 renderQuests();
 const g=flatPath[Math.min(progress,total-1)];
 if(g){
   const repair=state.remediation?.idx===progress,guide=document.querySelector('.guide-card');
   if(guide){guide.dataset.state=repair?'repair':g.type==='checkpoint'?'checkpoint':g.type==='story'?'story':'learn'}
   el('guideTitle',repair?'Fortaleça a aresta fraca.':g.type==='checkpoint'?'Prepare-se para provar domínio.':g.type==='story'?'Leia para integrar o que aprendeu.':g.day<=12?'Automatize o kana.':g.day<=24?'Monte frases, não traduções.':'Use japonês em contexto.');
   el('guideCopy',repair?'Você concluiu a atividade, mas o Mastery Graph ainda encontrou uma habilidade crítica instável. O reforço é curto, direcionado e não consome Energia.':g.type==='checkpoint'?'O checkpoint mistura competências da unidade. Ele não mede velocidade, mede se você consegue recuperar e transferir sem pista.':g.type==='story'?'Histórias conectam vocabulário e gramática em contexto contínuo. Leia primeiro pelo sentido geral, depois volte aos detalhes.':g.day<=12?'Leia, ouça e recupere a forma. O romaji some conforme seu cérebro para de precisar dele.':g.day<=24?'Partículas mostram o papel dos blocos. Espere o predicado antes de fechar o sentido.':'Agora o curso mistura kana, gramática, kanji, áudio e situações reais no mesmo circuito.');
 }
 queueHomePolish();
}
function queueHomePolish(){
 const home=document.getElementById('home');if(!home||!home.classList.contains('active'))return;
 const items=[...home.querySelectorAll('.course-banner,.path-toolbar,.path-unit,.learn-rail>.rail-card')];
 items.forEach((el,i)=>{el.classList.add('home-reveal');el.style.setProperty('--reveal-delay',Math.min(i,7)*35+'ms')});
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(el=>el.classList.add('is-visible'));return}
 if(!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('is-visible'));return}
 window.__homeObserver?.disconnect?.();
 window.__homeObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');window.__homeObserver.unobserve(entry.target)}}),{threshold:.08,rootMargin:'40px 0px -30px'});
 items.forEach(el=>window.__homeObserver.observe(el));
}
function renderQuests(){const q=todayQuestState(),items=[{icon:'道',name:'Complete 1 lição',now:q.lessons||0,max:1},{icon:'✦',name:'Ganhe 30 XP',now:q.xp||0,max:30},{icon:'正',name:'Faça uma lição com 80%+',now:q.accuracy?1:0,max:1}];const w=document.getElementById('questList');if(!w)return;w.innerHTML=items.map(x=>{const pct=Math.min(100,Math.round(x.now/x.max*100)),done=x.now>=x.max;return `<div class="quest-row ${done?'done':''}"><div class="quest-icon">${x.icon}</div><div><b>${x.name}</b><span>${Math.min(x.now,x.max)}/${x.max}</span><div class="quest-progress"><i style="width:${pct}%"></i></div></div><div class="quest-check">${done?'✓':'◆ 10'}</div></div>`}).join('')}
function claimPathChest(idx){if(idx>state.pathProgress)return toast('Este baú ainda está bloqueado');if(state.chests[idx])return toast('Baú já aberto');state.chests[idx]=true;state.gems+=40;state.energy=Math.min(state.maxEnergy,state.energy+4);if(idx===state.pathProgress)state.pathProgress++;save();toast('Baú aberto · +40 cristais · +4 energia');renderGameHome()}
let quickRun=null;
async function startQuickLesson(idx){if(idx>state.pathProgress)return toast('Complete o círculo anterior primeiro');const node=flatPath[idx];if(!node)return;if(node.type==='chest')return claimPathChest(idx);await ensureLearningRuntime();if(state.remediation?.idx===idx)return startMasteryRepair(idx);if((state.energy||0)<=0){go('practice');toast('Energia vazia · pratique para recarregar ou use a Loja');return}const pack=buildLesson(node,state);quickRun={idx,node,pack,step:0,correct:0,answered:0,streak:0,xp:0,selected:null,built:[],matches:[],matchPick:null,checked:false};go('lesson');renderQuickExercise();updateMetrics()}
async function startMasteryRepair(idx){await ensureLearningRuntime();if(idx!==state.pathProgress)return toast('O reforço pertence ao nó atual');const node=flatPath[idx];if(!node)return;const pack=buildMasteryRemediation(node);if(!pack.exercises.length)return toast('Sem lacunas observáveis para reforçar agora');quickRun={idx,node,pack,step:0,correct:0,answered:0,streak:0,xp:0,selected:null,built:[],matches:[],matchPick:null,checked:false,practiceOnly:true,masteryRepair:true};go('lesson');renderQuickExercise();updateMetrics()}
function exitQuickLesson(){quickRun=null;go('home')}
function setQuickFeedback(title,copy='',ok=null){const f=document.getElementById('quickFeedback');if(!f)return;f.innerHTML=`<b>${title}</b>${copy}`;if(ok===true)f.style.color='#79dca9';else if(ok===false)f.style.color='#ff7c89';else f.style.color='#8f9aaa'}
function renderQuickExercise(){
 if(!quickRun)return;
 const total=quickRun.pack.exercises.length;if(quickRun.step>=total)return renderQuickComplete();
 const e=quickRun.pack.exercises[quickRun.step],main=document.getElementById('quickMain'),prog=document.getElementById('quickProgress'),btn=document.getElementById('quickCheck');
 prog.style.width=`${quickRun.step/total*100}%`;quickRun.selected=null;quickRun.built=[];quickRun.matchPick=null;quickRun.matches=[];quickRun.typed='';quickRun.hintUsed=false;quickRun.checked=false;
 btn.style.display='';btn.disabled=true;btn.textContent='VERIFICAR';btn.classList.remove('continue');btn.onclick=quickCheck;
 const methodLabel=e.method?` · ${({discover:'descobrir',recall:'recuperar',transfer:'transferir',produce:'produzir'}[e.method]||e.method)}`:'';
 setQuickFeedback(e.method?'Gate Loop'+methodLabel:'Escolha uma resposta.');
 let h=`<span class="quick-kicker">${quickRun.pack.title} · ${quickRun.step+1}/${total}${methodLabel}</span><h2 class="quick-question">${e.prompt}</h2>`;
 if(e.type==='discovery'&&e.examples){
   h+=`<div class="method-examples">${e.examples.map(x=>`<article><b>${x.jp}</b><span>${x.pt}</span></article>`).join('')}</div>`;
   h+=quickOptions(e.options);
 }else if(e.type==='minimalPair'){
   h+=`<button class="quick-listen contrast" onclick="speak('${e.audio.replaceAll("'","\\'")}')">▶ ouvir contraste</button>${quickOptions(e.options)}`;
 }else{
   if(e.jp)h+=`<div class="quick-jp">${e.jp}</div>`;
   if(e.type==='listen'){h+=`<button class="quick-listen" onclick="speak('${e.audio.replaceAll("'","\\'")}')">▶</button>${quickOptions(e.options)}`}
   else if(e.type==='choice'){h+=quickOptions(e.options)}
   else if(e.type==='wordbank'){h+=`<div class="word-built" id="wordBuilt"><span style="color:#607083;font-size:9px">toque nos blocos abaixo</span></div><div class="word-bank" id="wordBank">${shuffleArray(e.tokens.map((t,i)=>({t,i}))).map(x=>`<button class="word-token" data-wb="${x.i}" onclick="wordTap(${x.i},this)">${x.t}</button>`).join('')}</div>`}
   else if(e.type==='match'){const cards=[];e.pairs.forEach((p,i)=>{cards.push({text:p[0],id:i,side:'a'},{text:p[1],id:i,side:'b'})});h+=`<p class="quick-helper">Toque em um item de cada coluna mental. Pares corretos desaparecem.</p><div class="match-grid">${shuffleArray(cards).map(c=>`<button class="match-card" data-mid="${c.id}" data-side="${c.side}" onclick="matchTap(this)">${c.text}</button>`).join('')}</div>`}
   else if(e.type==='speak'){h+=`<button class="quick-listen" onclick="speak('${e.target.replaceAll("'","\\'")}')">▶</button><div class="quick-jp">${e.target}</div><p class="quick-helper">${e.pt}</p><div class="quick-options"><button class="quick-option" onclick="quickShadow(this)">Fiz shadowing em voz alta</button><button class="quick-option" onclick="quickSpeech(this)">● Usar microfone</button></div>`}
   else if(['recall','dictation','cloze','transfer'].includes(e.type)){
     if(e.type==='dictation')h+=`<button class="quick-listen" onclick="speak('${e.audio.replaceAll("'","\\'")}')">▶ ouvir sem legenda</button>`;
     if(e.cue)h+=`<div class="method-cue">${e.cue}</div>`;
     h+=`<input id="quickTyped" class="quick-typed" lang="ja" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="digite em japonês…" oninput="quickTypedInput(this.value)">`;
     h+=`<p class="quick-helper">Sem banco de palavras. Kana é aceito quando a leitura é equivalente.</p>`;
   }else if(e.type==='roleplay'){
     h+=`<div class="roleplay-scene"><span>店員 / interlocutor</span><b>${e.npc}</b><p>${e.npcPt||''}</p></div>`;
     h+=`<div class="quick-options"><button class="quick-option" onclick="quickSpeech(this)">● Responder com microfone</button><button class="quick-option" onclick="quickRoleplayAttempt(this)">Respondi em voz alta</button></div><button class="method-reveal" onclick="quickRevealModel()">preciso de uma pista</button><div id="roleplayModel" class="roleplay-model"></div>`;
   }
 }
 main.innerHTML=h;document.getElementById('quickEnergy').textContent=state.energy;
}function quickOptions(options){return `<div class="quick-options">${options.map((o,i)=>`<button class="quick-option" data-qopt="${i}" onclick="quickSelect(${i},this)">${o}</button>`).join('')}</div>`}
function quickSelect(i,b){if(quickRun.checked)return;document.querySelectorAll('[data-qopt]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');quickRun.selected=i;document.getElementById('quickCheck').disabled=false}
function quickTypedInput(value){if(!quickRun||quickRun.checked)return;quickRun.typed=value;document.getElementById('quickCheck').disabled=!value.trim()}
function quickRoleplayAttempt(b){document.querySelectorAll('.quick-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');quickRun.selected=1;document.getElementById('quickCheck').disabled=false}
function quickRevealModel(){const e=quickRun?.pack.exercises[quickRun.step],box=document.getElementById('roleplayModel');if(!e||!box)return;box.innerHTML=`<b>${e.target}</b><span>${e.pt||''}</span>`;box.classList.add('show');quickRun.hintUsed=true}
function wordTap(i,b){if(quickRun.checked||b.classList.contains('used'))return;b.classList.add('used');quickRun.built.push(i);const e=quickRun.pack.exercises[quickRun.step],w=document.getElementById('wordBuilt');w.innerHTML=quickRun.built.map((idx,pos)=>`<button class="word-token" onclick="wordUntap(${pos})">${e.tokens[idx]}</button>`).join('');document.getElementById('quickCheck').disabled=quickRun.built.length===0}
function wordUntap(pos){if(quickRun.checked)return;const idx=quickRun.built.splice(pos,1)[0],e=quickRun.pack.exercises[quickRun.step];document.querySelector(`[data-wb="${idx}"]`)?.classList.remove('used');const w=document.getElementById('wordBuilt');w.innerHTML=quickRun.built.length?quickRun.built.map((j,p)=>`<button class="word-token" onclick="wordUntap(${p})">${e.tokens[j]}</button>`).join(''):'<span style="color:#607083;font-size:9px">toque nos blocos abaixo</span>';document.getElementById('quickCheck').disabled=quickRun.built.length===0}
function matchTap(b){if(quickRun.checked||b.classList.contains('matched'))return;if(!quickRun.matchPick){quickRun.matchPick=b;b.classList.add('pick');return}const a=quickRun.matchPick;if(a===b)return;if(a.dataset.mid===b.dataset.mid&&a.dataset.side!==b.dataset.side){a.classList.remove('pick');a.classList.add('matched');b.classList.add('matched');quickRun.matches.push(a.dataset.mid);quickRun.matchPick=null;if(quickRun.matches.length===quickRun.pack.exercises[quickRun.step].pairs.length){quickRun.selected=1;document.getElementById('quickCheck').disabled=false;setQuickFeedback('Pares completos.',' Verifique para continuar.',true)}}else{a.classList.remove('pick');a.classList.add('bad');b.classList.add('bad');quickRun.matchPick=null;energyTick(false);setQuickFeedback('Esses dois não formam par.',' Tente de novo.',false);setTimeout(()=>{a.classList.remove('bad');b.classList.remove('bad')},350)}}
function quickShadow(b){document.querySelectorAll('.quick-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');quickRun.selected=1;document.getElementById('quickCheck').disabled=false}
function quickSpeech(b){const e=quickRun.pack.exercises[quickRun.step],SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('Microfone indisponível; use shadowing');return}const r=new SR();r.lang='ja-JP';r.interimResults=false;r.maxAlternatives=1;b.textContent='● ouvindo…';r.onresult=x=>{const txt=x.results[0][0].transcript,sc=similarity(txt,e.target);quickRun.selected=sc>=55?1:0;b.textContent=`Reconhecido: ${txt} · ${sc}%`;document.getElementById('quickCheck').disabled=false};r.onend=()=>{if(b.textContent==='● ouvindo…')b.textContent='● Usar microfone'};r.start()}
function energyTick(correct){state.energy=Math.max(0,(state.energy||0)-1);if(correct){quickRun.streak=(quickRun.streak||0)+1;if(quickRun.streak%3===0)state.energy=Math.min(state.maxEnergy,state.energy+1)}else quickRun.streak=0;document.getElementById('quickEnergy').textContent=state.energy}
function quickCheck(){
 if(!quickRun||quickRun.checked)return;
 const e=quickRun.pack.exercises[quickRun.step];let ok=false,chosen='';
 if(['choice','listen','discovery','minimalPair'].includes(e.type)){
   if(quickRun.selected==null)return;
   const opts=e.options;chosen=opts[quickRun.selected];ok=chosen===e.answer;
   document.querySelectorAll('[data-qopt]').forEach((b,i)=>{b.disabled=true;if(opts[i]===e.answer)b.classList.add('correct');if(i===quickRun.selected&&!ok)b.classList.add('wrong')});
 }else if(e.type==='wordbank'){
   chosen=quickRun.built.map(i=>e.tokens[i]).join('');ok=normalizeJP(chosen)===normalizeJP(e.target);
   document.querySelectorAll('.word-token').forEach(b=>b.disabled=true);
 }else if(e.type==='match'){
   ok=quickRun.matches.length===e.pairs.length;chosen=ok?'pares completos':'pares incompletos';
 }else if(['speak','roleplay'].includes(e.type)){
   ok=quickRun.selected===1;chosen=ok?'produção aceita':'produção abaixo do limiar';
 }else if(['recall','dictation','cloze','transfer'].includes(e.type)){
   chosen=(quickRun.typed||'').trim();const accepted=(e.accepted?.length?e.accepted:[e.target]).filter(Boolean);
   ok=accepted.some(x=>normalizeJP(chosen)===normalizeJP(x));
   const input=document.getElementById('quickTyped');if(input){input.disabled=true;input.classList.add(ok?'correct':'wrong')}
 }
 quickRun.checked=true;quickRun.answered++;
 if(ok){
   quickRun.correct++;quickRun.xp+=quickRun.practiceOnly?5:(e.method?12:10);
   if(e._remediation)markMistakeRecovered(e);
   else if(e._reviewType&&e._reviewKey)gradeReview(e._reviewType,e._reviewKey,'good');
 }else{
   recordMistake(e,{node:quickRun.idx,chosen});
   if(e._reviewType&&e._reviewKey&&e._reviewType!=='error')gradeReview(e._reviewType,e._reviewKey,'hard');
 }
 if(e.method&&typeof recordMethodOutcome==='function')recordMethodOutcome(e,ok,{hintUsed:!!quickRun.hintUsed});
 if(typeof recordMasteryEvidence==='function')recordMasteryEvidence(e,ok,{hintUsed:!!quickRun.hintUsed});
 if(!quickRun.practiceOnly)energyTick(ok);
 const bridge=e.bridge?`<span class="feedback-bridge"><strong>Lente MON</strong>${e.bridge}</span>`:'';
 setQuickFeedback(ok?(e._remediation?'Erro recuperado!':e.method?'Recuperação válida.':'Correto!'):'Boa correção.',(e.why||'')+bridge,ok);
 const btn=document.getElementById('quickCheck');btn.disabled=false;btn.textContent='CONTINUAR';btn.classList.add('continue');btn.onclick=quickNext;save();
}function quickNext(){if(!quickRun)return;if(!quickRun.practiceOnly&&state.energy<=0&&quickRun.step<quickRun.pack.exercises.length-1){quickRun.step=quickRun.pack.exercises.length;renderQuickComplete(true);return}quickRun.step++;renderQuickExercise()}
function renderQuickComplete(outOfEnergy=false){
 const total=quickRun.pack.exercises.length,acc=quickRun.answered?Math.round(quickRun.correct/quickRun.answered*100):0,boost=Date.now()<(state.xpBoostUntil||0)?2:1;
 const practice=!!quickRun.practiceOnly,repair=!!quickRun.masteryRepair,xp=practice?quickRun.xp:(quickRun.xp+15)*boost;
 state.xp+=xp;state.leagueXp=(state.leagueXp||0)+xp;if(!practice)state.gems+=acc>=80?8:4;
 state.sessions=(state.sessions||0)+1;if(acc===100)state.perfectLessons=(state.perfectLessons||0)+1;
 let decision={action:'advance',reason:'practice'};
 if(quickRun.pack?.unitId&&typeof coursePackForDay==='function'&&typeof unitMasteryStatus==='function'){const u=coursePackForDay(quickRun.node?.day);if(u)state.unitMastery[quickRun.pack.unitId]=unitMasteryStatus(u)}
 if(!outOfEnergy&&(repair||(!practice&&quickRun.idx===state.pathProgress))&&typeof progressionDecision==='function'){
   decision=progressionDecision(quickRun.node,quickRun.pack,acc);
   if(decision.action==='reinforce'){
     state.remediation={idx:quickRun.idx,unitId:quickRun.pack.unitId||null,reason:decision.reason,gaps:(decision.gaps||[]).slice(0,6),updatedAt:Date.now()};
   }else if(quickRun.idx===state.pathProgress){
     state.remediation=null;state.pathProgress++;
     const node=quickRun.node;if(node.day&&node.day<=24){state.foundationDay=Math.max(state.foundationDay||1,Math.min(FOUNDATION_TOTAL,node.day+1));if(node.day>=24)state.foundationComplete=true}else if(node.day>24){state.foundationComplete=true;state.day=Math.max(state.day||1,node.day-24)}
   }
 }
 if(!practice){const q=todayQuestState();q.lessons=(q.lessons||0)+1;q.xp=(q.xp||0)+xp;if(acc>=80)q.accuracy=true;if(!outOfEnergy&&decision.action==='advance'&&quickRun.idx!==state.pathProgress-1&&quickRun.idx===state.pathProgress){state.pathProgress++}updateGameStreak()}
 save();
 const reinforcing=!outOfEnergy&&decision.action==='reinforce',main=document.getElementById('quickMain'),prog=document.getElementById('quickProgress');prog.style.width='100%';
 const status=quickRun.pack?.unitId?state.unitMastery?.[quickRun.pack.unitId]:null;
 const title=reinforcing?'Atividade concluída. Domínio ainda em construção.':repair&&decision.action==='advance'?'Portão liberado.':practice?'Revisão inteligente concluída.':outOfEnergy?'Pare no ponto certo.':'一歩ずつ · mais um passo.';
 const copy=reinforcing?`Você terminou esta rodada, mas o grafo encontrou lacunas em competências críticas. O próximo toque abre um reforço curto e direcionado. Domínio observado: ${status?.score||0}%.`:repair&&decision.action==='advance'?'As arestas críticas atingiram evidência suficiente. O próximo nó da trilha foi liberado.':practice?'Você recuperou itens sem gastar Energia. A fila e o Mastery Graph foram atualizados.':outOfEnergy?'Sua energia acabou, mas erros e evidências ficaram salvos.':'O curso registrou memória, erros e domínio. O avanço agora considera evidência, não apenas conclusão.';
 const target=reinforcing?'startMasteryRepair('+quickRun.idx+')':`quickRun=null;go('${practice||outOfEnergy?'practice':'home'}')`;
 const button=reinforcing?'fortalecer agora →':repair&&decision.action==='advance'?'seguir para o próximo nó →':practice?'voltar à prática':outOfEnergy?'ir para prática':'continuar trilha →';
 main.innerHTML=`<div class="quick-result ${reinforcing?'needs-mastery':''}"><div class="result-seal">${reinforcing?'復':repair&&decision.action==='advance'?'開':practice?'復':outOfEnergy?'⚡':'門'}</div><span class="quick-kicker">${reinforcing?'domínio incompleto':repair?'mastery repair':practice?'prática':'lição concluída'}</span><h2>${title}</h2><p>${copy}</p><div class="result-stats"><div><b>${acc}%</b><span>precisão</span></div><div><b>+${xp}</b><span>XP${!practice&&boost>1?' · 2×':''}</span></div><div><b>${status?.score??'—'}%</b><span>domínio da unidade</span></div></div><button class="quick-check continue" style="width:auto" onclick="${target}">${button}</button></div>`;
 document.querySelector('.quick-bottom').style.display='none';setTimeout(()=>{const b=document.querySelector('.quick-bottom');if(b)b.style.display='flex'},50);document.getElementById('quickFeedback').innerHTML='';document.getElementById('quickCheck').style.display='none';renderGameHome();
}
function updateGameStreak(){const today=localDateKey(),last=state.lastStudyDate;if(last===today)return;if(last){const y=new Date();y.setDate(y.getDate()-1);if(last===localDateKey(y))state.streak=(state.streak||0)+1;else if((state.streakFreeze||0)>0){state.streakFreeze--;state.streak=(state.streak||1)+1}else state.streak=1}else state.streak=Math.max(1,state.streak||1);state.lastStudyDate=today}
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
function startSmartReview(){
 const exercises=scheduledReviewExercises(8);
 if(!exercises.length)return toast('Sua fila de memória está em dia');
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
function startMistakePractice(){
 const exercises=remediationExercises(6);
 if(!exercises.length)return toast('Nenhum erro aberto para revisar');
 quickRun={idx:null,node:{label:'Caderno de Erros',day:0},pack:{title:'Caderno de Erros',focus:'復',exercises,adaptive:true},step:0,correct:0,answered:0,streak:0,xp:0,selected:null,built:[],matches:[],matchPick:null,checked:false,practiceOnly:true};
 go('lesson');renderQuickExercise();updateMetrics();
}
function renderLeague(){const base=[['Aiko','2.480'],['Kenji','2.130'],['Mina','1.860'],['Rui','1.420'],['Sora','980'],['Emi','720'],['Tomo','510']].map(x=>({name:x[0],xp:Number(x[1].replace('.','')),demo:true}));base.push({name:'Você',xp:state.leagueXp||0,you:true});base.sort((a,b)=>b.xp-a.xp);const w=document.getElementById('leagueBoard');if(w)w.innerHTML=base.map((x,i)=>`<div class="league-row ${x.you?'you':''}"><div class="league-rank">${i+1}</div><div class="league-user"><b>${x.name}</b><small>${x.you?'seu progresso local':'avatar demonstrativo'}</small></div><div class="league-xp">${x.xp.toLocaleString('pt-BR')} XP</div></div>`).join('')}
function renderShop(){updateMetrics()}
function buyItem(type){const costs={freeze:100,energy:60,boost:180},cost=costs[type];if(state.gems<cost)return toast('Cristais insuficientes');state.gems-=cost;if(type==='freeze'){state.streakFreeze=(state.streakFreeze||0)+1;toast('Amuleto equipado')}if(type==='energy'){state.energy=state.maxEnergy;toast('Energia recarregada')}if(type==='boost'){state.xpBoostUntil=Date.now()+15*60*1000;toast('2× XP ativo por 15 min')}save()}

if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
updateMetrics();renderGameHome();
const pathWarm=document.getElementById('learningPath');
if(pathWarm)pathWarm.addEventListener('pointerover',e=>{if(e.target.closest('.path-node.current'))ensureLearningRuntime().catch(()=>{})},{passive:true});