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
const FEATURE_RUNTIME_SCRIPTS={
 foundation:['./features/foundation.js'],
 session:['./features/foundation.js','./features/session.js']
};
const featureRuntimePromises={};
async function ensureFeatureRuntime(name){
 if(featureRuntimePromises[name])return featureRuntimePromises[name];
 const scripts=FEATURE_RUNTIME_SCRIPTS[name]||[];
 featureRuntimePromises[name]=(async()=>{for(const href of FEATURE_RUNTIME_STYLES[name]||[])await loadRuntimeStyle(href);for(const src of scripts)await loadRuntimeScript(src)})().catch(err=>{delete featureRuntimePromises[name];throw err});
 return featureRuntimePromises[name];
}
let learningRuntimePromise=null;
function loadRuntimeScript(src){
 return new Promise((resolve,reject)=>{
   const existing=document.querySelector(`script[data-runtime-src="${src}"]`);
   if(existing){if(existing.dataset.ready==='1')return resolve();existing.addEventListener('load',()=>resolve(),{once:true});existing.addEventListener('error',()=>reject(new Error('Falha ao carregar '+src)),{once:true});return}
   const s=document.createElement('script');s.src=src;s.async=false;s.dataset.runtimeSrc=src;
   s.onload=()=>{s.dataset.ready='1';resolve()};s.onerror=()=>reject(new Error('Falha ao carregar '+src));document.body.appendChild(s);
 });
}
function loadRuntimeStyle(href){
 return new Promise((resolve,reject)=>{
   const existing=document.querySelector(`link[data-runtime-href="${href}"]`);
   if(existing){if(existing.dataset.ready==='1')return resolve();existing.addEventListener('load',()=>resolve(),{once:true});existing.addEventListener('error',()=>reject(new Error('Falha ao carregar '+href)),{once:true});return}
   const link=document.createElement('link');link.rel='stylesheet';link.href=href;link.dataset.runtimeHref=href;
   link.onload=()=>{link.dataset.ready='1';resolve()};link.onerror=()=>reject(new Error('Falha ao carregar '+href));document.head.appendChild(link);
 });
}
const FEATURE_RUNTIME_STYLES={foundation:['./features/foundation.css']};
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
 if(id==='foundation')await ensureFeatureRuntime('foundation');
 if(id==='practice')await ensureLearningRuntime();
 document.body.classList.toggle('focus-session',id==='session');document.body.classList.toggle('quick-focus',id==='lesson');
 document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
 const crumb=document.getElementById('crumb');if(crumb)crumb.textContent=viewNames[id]||id;
 if(id==='home')renderGameHome();
 else if(id==='curriculum')renderCurriculum(curriculumLevel||currentPlan().level);
 else if(id==='foundation'){await ensureFeatureRuntime('foundation');renderFoundation();}
 else if(id==='kanji'){ensureDrawingCanvases();renderKanjiList();selectKanji(currentKanji)}
 else if(id==='writing'){ensureDrawingCanvases()}
 else if(id==='missions')hydrateMissionGrid();
 else if(id==='speaking')hydrateSurvivalPhrases();
 else if(id==='league')renderLeague();
 else if(id==='shop')renderShop();
 else if(id==='practice'){await ensureLearningRuntime();renderMasteryMap();renderReviewDeck();renderMistakeNotebook()}
 keepActiveNavVisible(id);window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}
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
 const p=currentPlan(),zeroPending=!state.foundationComplete;const plan=document.getElementById('planTop');if(plan)plan.textContent=zeroPending?`ZERO · sessão ${Math.min(FOUNDATION_TOTAL,state.foundationDay||1)}/${FOUNDATION_TOTAL}`:`${p.level} · dia ${p.localDay}/${p.total}`;const hero=document.getElementById('sessionDayHero');if(hero)hero.textContent=zeroPending?`fundação ${Math.min(FOUNDATION_TOTAL,state.foundationDay||1)}/${FOUNDATION_TOTAL}`:`dia ${state.day}`;const dd=document.getElementById('dailyDueCount');if(dd)dd.textContent=zeroPending?(typeof countKanaInTraining==='function'?countKanaInTraining():0):due;const pc=document.getElementById('pathCurrentLevel');if(pc)pc.textContent=zeroPending?'ZERO':p.level;const pd=document.getElementById('pathCurrentDay');if(pd)pd.textContent=zeroPending?`sessão ${Math.min(FOUNDATION_TOTAL,state.foundationDay||1)} · base sonora, escrita e gramática`:`dia ${p.localDay} · ${p.label}`;const pr=document.getElementById('pathRingFill');if(pr)pr.style.width=zeroPending?Math.min(100,((state.foundationDay||1)-1)/FOUNDATION_TOTAL*100)+'%':Math.min(100,p.localDay/p.total*100)+'%';updateDailyCommand();if(typeof renderFoundationProgress==='function')renderFoundationProgress();renderGameHome();
}

let curriculumLevel='N5';
function renderCurriculum(level=curriculumLevel){curriculumLevel=level;document.querySelectorAll('[data-level]').forEach(b=>b.classList.toggle('active',b.dataset.level===level));const data=curriculumData.find(x=>x.level===level)||curriculumData[0];const p=currentPlan();const same=p.level===level;document.getElementById('curriculumSummary').innerHTML=`<div class="curriculum-stat"><span>promessa</span><b>${data.promise}</b></div><div class="curriculum-stat"><span>kanji alvo</span><b>${data.kanji}</b></div><div class="curriculum-stat"><span>gramática funcional</span><b>${data.grammar}</b></div><div class="curriculum-stat"><span>missões</span><b>${data.missions}</b></div>`;const levelStart=level==='N5'?1:level==='N4'?31:91;document.getElementById('curriculumGrid').innerHTML=data.units.map((u,i)=>{const span=u.days.split('–').map(Number),absStart=levelStart+(span[0]-1),absEnd=levelStart+(span[1]-1);const done=state.day>absEnd, current=same&&state.day>=absStart&&state.day<=absEnd, locked=state.day<absStart&&level!=='N5';return `<article class="unit-card ${done?'done':''} ${current?'current':''} ${locked?'locked':''}" data-kanji="${u.kanji}"><div class="unit-index"><span>${data.level} · dias ${u.days}</span><i></i></div><h4>${u.title}</h4><p>${u.desc}</p><div class="unit-meta">${u.meta.map(m=>`<span>${m}</span>`).join('')}</div><button class="unit-action" onclick="${current||done?`startSession()`:`toast('Este bloco abre conforme você demonstra domínio')`}">${current?'continuar daqui →':done?'revisar bloco →':'prévia bloqueada'}</button></article>`}).join('')}
document.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>renderCurriculum(b.dataset.level)));
function updateDailyCommand(){if(!document.getElementById('dailyMissionTitle'))return;if(!state.foundationComplete){const u=foundationUnits[Math.max(0,Math.min(FOUNDATION_TOTAL-1,(state.foundationDay||1)-1))];document.getElementById('dailyMissionTitle').textContent='Fundação Zero: '+u.title.toLowerCase();document.getElementById('dailyMissionCopy').textContent=`Sessão ${u.n}/${FOUNDATION_TOTAL} · ${u.desc}. O objetivo é automatizar leitura e som antes de acelerar no N5.`;const c=document.getElementById('dailyStepCount');if(c)c.textContent=6;return}const i=Math.min(missions.length-1,Math.floor(((state.day||1)-1)%30/5));document.getElementById('dailyMissionTitle').textContent='Hoje: '+missions[i].title.toLowerCase();document.getElementById('dailyMissionCopy').textContent=`Missão ${i+1}/6 · ${missions[i].desc}. O bloco começa pelo que está vencendo na sua memória.`}
function shuffledOptions(correct, pool, count=4){const vals=[correct,...pool.filter(x=>x!==correct)].filter((x,i,a)=>a.indexOf(x)===i);for(let i=vals.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[vals[i],vals[j]]=[vals[j],vals[i]]}const sliced=vals.slice(0,count);if(!sliced.includes(correct))sliced[Math.floor(Math.random()*sliced.length)]=correct;return sliced}
async function startSession(){await ensureFeatureRuntime('session');return window.startSession()}
async function startDiagnostic(){await ensureFeatureRuntime('session');return window.startDiagnostic()}
async function startFoundationSession(...args){await ensureFeatureRuntime('session');return window.startFoundationSession(...args)}
function toggleForge(){const a=document.getElementById('forgeAnswer'),b=document.getElementById('forgeBtn');const show=!a.classList.contains('revealed');a.classList.toggle('revealed',show);b.textContent=show?'ocultar e tentar de novo':'revelar resposta'}
function updateForge(){const x=kanjiData[currentKanji];const p=document.getElementById('forgePrompt'),a=document.getElementById('forgeAnswer'),b=document.getElementById('forgeBtn');if(!p)return;p.textContent=`Qual kanji significa “${x.m.toLowerCase()}”?`;a.textContent=`${x.k} · ${x.ex[0][1]}`;a.classList.remove('revealed');b.textContent='revelar resposta'}



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
const foundationNav=document.querySelector('[data-view="foundation"]');
if(foundationNav)foundationNav.addEventListener('pointerover',()=>ensureFeatureRuntime('foundation').catch(()=>{}),{passive:true,once:true});
const pathWarm=document.getElementById('learningPath');
if(pathWarm)pathWarm.addEventListener('pointerover',e=>{if(e.target.closest('.path-node.current'))ensureLearningRuntime().catch(()=>{})},{passive:true});