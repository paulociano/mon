const viewNames={home:'Hoje',journey:'Jornada',practice:'Praticar',explore:'Explorar',progress:'Progresso',user:'Minha área',lesson:'Lição',league:'Liga',shop:'Loja',foundation:'Kana & gramática',session:'Sessão longa',curriculum:'Mapa acadêmico',kanji:'Kanji Atlas',missions:'Missões',reading:'Histórias',speaking:'Conversação',culture:'Cultura',writing:'Escrita',journal:'Diário no Japão',videos:'Vídeos',pronunciation:'Pronúncia'};
let currentKanji=0;
function shellLocalDateKey(date=new Date()){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-')}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1600)}
function shuffleArray(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function speak(text,rate=.86){if(!('speechSynthesis'in window)){toast('Áudio indisponível neste navegador');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||''));u.lang='ja-JP';u.rate=rate;const ja=speechSynthesis.getVoices().find(v=>String(v.lang).toLowerCase().startsWith('ja'));if(ja)u.voice=ja;speechSynthesis.speak(u)}
const NAV_PARENT={lesson:'home',session:'home',curriculum:'journey',foundation:'explore',kanji:'explore',missions:'explore',reading:'explore',speaking:'explore',culture:'explore',writing:'explore',journal:'explore',videos:'explore',pronunciation:'explore',league:'explore',shop:'explore',user:'user'};
function navParentForView(id){return NAV_PARENT[id]||id}
function keepActiveNavVisible(id){const nav=document.getElementById('desktopNav'),active=nav?.querySelector(`[data-view="${navParentForView(id)}"]`);if(!nav||!active||nav.scrollHeight<=nav.clientHeight)return;const top=active.offsetTop-nav.offsetTop,bottom=top+active.offsetHeight,soft=18;let target=null;if(top<nav.scrollTop+soft)target=Math.max(0,top-soft);else if(bottom>nav.scrollTop+nav.clientHeight-soft)target=bottom-nav.clientHeight+soft;if(target!==null)nav.scrollTo({top:target,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
const ACCOUNT_RUNTIME_SCRIPT='./core/account.js';
const CLOUD_RUNTIME_SCRIPTS=['./config/cloud.js','./core/supabase-sync.js'];
let accountRuntimePromise=null;
function ensureAccountRuntime(){return accountRuntimePromise||(accountRuntimePromise=(async()=>{await loadRuntimeScript(ACCOUNT_RUNTIME_SCRIPT);for(const src of CLOUD_RUNTIME_SCRIPTS)await loadRuntimeScript(src)})())}
const LE='./core/learning-evidence.js';
const LEARNING_RUNTIME_SCRIPTS=[
 './data/kanji.js',
 './data/kana.js',
 './data/experiences.js',
 './data/foundation.js',
 './data/session.js',
 './data/narrative.js',
 './core/narrative-state.js',
 './core/next-best-lesson.js',
 './core/mistakes.js',
 LE,
 './core/mastery-graph.js',
 './core/learning-methods.js',
 './core/course-engine.js',
 './core/progression-engine.js'
];
const N5='./data/content-packs-n5.js',N4=['./data/content-packs-n4.js','./data/content-packs-n4-61-70.js','./data/content-packs-n4-71-80.js','./data/content-packs-n4-81-90.js'],N4_CAP='./data/n4-capabilities.js';
const CONTENT_PACK_SCRIPTS={N5:[N5],N4A:[N5,...N4.slice(0,1)],N4B:[N5,...N4.slice(0,2)],N4C:[N5,...N4.slice(0,3)],N4D:[N5,...N4]};
const contentPackPromises={};
function ensureContentPack(level='N5'){
 const resolved=CONTENT_PACK_SCRIPTS[level]?level:'N5';
 if(contentPackPromises[resolved])return contentPackPromises[resolved];
 const sources=resolved==='N5'?CONTENT_PACK_SCRIPTS.N5:[...CONTENT_PACK_SCRIPTS[resolved],N4_CAP];
 contentPackPromises[resolved]=(async()=>{for(const src of sources)await loadRuntimeScript(src);if(resolved!=='N5'&&typeof applyN4CapabilityContracts==='function')applyN4CapabilityContracts()})().catch(err=>{delete contentPackPromises[resolved];throw err});
 return contentPackPromises[resolved];
}
const FEATURE_RUNTIME_SCRIPTS={
 foundation:['./data/kana.js','./data/foundation.js','./features/foundation.js'],
 session:['./data/kanji.js','./data/kana.js','./data/experiences.js','./data/foundation.js','./data/session.js','./data/narrative.js','./core/next-best-lesson.js','./features/foundation.js','./features/session.js'],
 kanji:['./data/kanji.js','./data/kanji-memory.js','./features/kanji.js','./features/kanji-memory.js'],
 reading:['./data/kana.js','./data/experiences.js','./features/experiences.js'],
 missions:[LE,'./data/kana.js','./data/experiences.js','./data/missions-v2.js','./data/missions-dialogues.js','./features/experiences.js','./features/missions-reactions.js','./features/missions-world.js','./features/missions-dialogue.js','./features/missions-v2.js'],
 speaking:['./data/kana.js','./data/experiences.js','./features/experiences.js'],
 progress:[LE,'./core/learning-metrics.js','./features/progress.js'],
 curriculum:['./data/curriculum.js'],
 lesson:['./features/open-production-remediation.js','./features/lesson.js'],
 practice:['./features/practice.js'],
 journal:['./data/narrative.js','./core/narrative-state.js','./features/journal.js'],
 videos:['./features/videos.js'],
 pronunciation:['./data/pronunciation.js','./features/pronunciation.js']
};
const featureRuntimePromises={};
async function ensureFeatureRuntime(name){
 if(featureRuntimePromises[name])return featureRuntimePromises[name];
 const started=typeof perfStart==='function'?perfStart('feature:'+name):null;
 const scripts=FEATURE_RUNTIME_SCRIPTS[name]||[];
 featureRuntimePromises[name]=(async()=>{for(const href of FEATURE_RUNTIME_STYLES[name]||[])await loadRuntimeStyle(href);for(const src of scripts)await loadRuntimeScript(src);if(started!==null&&typeof perfEnd==='function')perfEnd('feature:'+name,started)})().catch(err=>{delete featureRuntimePromises[name];throw err});
 return featureRuntimePromises[name];
}
let learningRuntimePromise=null;
function contentPackLevelForDay(day=state.day){
 const d=Number(day||1);
 if(d>=81&&d<=90)return 'N4D';
 if(d>=71)return 'N4C';
 if(d>=61)return 'N4B';
 if(d>=55)return 'N4A';
 return 'N5';
}
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
const FEATURE_RUNTIME_STYLES={journey:['./features/journey.css'],explore:['./features/journey.css'],progress:['./features/journey.css'],user:['./features/user.css'],foundation:['./features/foundation.css'],lesson:['./features/lesson.css'],practice:['./features/practice.css'],journal:['./features/journal.css'],videos:['./features/videos.css'],pronunciation:['./features/pronunciation.css'],kanji:['./features/kanji-memory.css'],missions:['./features/missions-v2.css']};
async function ensureLearningRuntime(){
 const level=contentPackLevelForDay();
 await ensureContentPack(level);
 if(learningRuntimePromise)return learningRuntimePromise;
 const started=typeof perfStart==='function'?perfStart('runtime:learning'):null;
 document.body.classList.add('learning-runtime-loading');
 learningRuntimePromise=(async()=>{for(const src of LEARNING_RUNTIME_SCRIPTS)await loadRuntimeScript(src);document.body.classList.add('learning-runtime-ready');if(started!==null&&typeof perfEnd==='function')perfEnd('runtime:learning',started)})()
   .catch(err=>{learningRuntimePromise=null;toast('Não consegui carregar o motor de aprendizagem');throw err})
   .finally(()=>document.body.classList.remove('learning-runtime-loading'));
 return learningRuntimePromise;
}
const hydratedViews=new Set(['home']);
function setRouteBusy(on,label='Carregando'){
 const loader=document.getElementById('routeLoader'),main=document.querySelector('main');
 document.body.classList.toggle('route-busy',on);if(main)main.setAttribute('aria-busy',on?'true':'false');
 if(loader){loader.setAttribute('aria-hidden',on?'false':'true');loader.setAttribute('aria-label',label);loader.dataset.label=label}
}
let routeRequestId=0;
const ROUTABLE_VIEWS=new Set(Object.keys(viewNames));
function routeFromLocation(){const id=new URL(location.href).searchParams.get('view');return id&&ROUTABLE_VIEWS.has(id)?id:'home'}
function routeUrl(id){const url=new URL(location.href);if(id==='home')url.searchParams.delete('view');else url.searchParams.set('view',id);return url.pathname+url.search+url.hash}
function commitRouteUrl(id,replace=false){const next=routeUrl(id);if(next===location.pathname+location.search+location.hash)return;history[replace?'replaceState':'pushState']({monView:id},'',next)}
async function go(id,options={}){
 if(!ROUTABLE_VIEWS.has(id))id='home';
 const requestId=++routeRequestId;
 const previous=document.querySelector('.view.active')?.id||'home';
 const viewStart=typeof perfStart==='function'?perfStart('view:'+id):null;
 const busyTimer=setTimeout(()=>{if(requestId===routeRequestId)setRouteBusy(true,'Abrindo '+(viewNames[id]||id))},90);
 try{
   if(id==='user'){ensureUserArea();await ensureAccountRuntime();}
   if(['journey','explore','progress','user'].includes(id))await ensureFeatureRuntime(id);
   if(id==='foundation')await ensureFeatureRuntime('foundation');
   if(id==='curriculum')await ensureFeatureRuntime('curriculum');
   if(id==='kanji')await ensureFeatureRuntime('kanji');
   if(id==='reading'||id==='missions'||id==='speaking')await ensureFeatureRuntime(id);
   if(id==='practice'){await ensureLearningRuntime();await ensureFeatureRuntime('practice');}
   if(id==='journal')await ensureFeatureRuntime('journal');
   if(id==='videos')await ensureFeatureRuntime('videos');
   if(id==='pronunciation')await ensureFeatureRuntime('pronunciation');
   if(requestId!==routeRequestId)return false;
   document.body.classList.toggle('focus-session',id==='session');
   document.body.classList.toggle('quick-focus',id==='lesson');
   document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
   document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===navParentForView(id)));
   const crumb=document.getElementById('crumb');if(crumb)crumb.textContent=viewNames[id]||id;
   if(id==='home')renderGameHome();
   else if(id==='journey')renderJourney();
   else if(id==='progress')renderProgressHub();
   else if(id==='user')renderUserArea();
   else if(id==='curriculum')renderCurriculum(curriculumLevel||currentPlan().level);
   else if(id==='foundation')renderFoundation();
   else if(id==='kanji'){ensureKanjiAtlas();renderKanjiAtlas()}
   else if(id==='writing'){ensureDrawingCanvases()}
   else if(id==='reading'){if(typeof hydrateReading==='function')hydrateReading()}
   else if(id==='missions'){if(typeof renderMissionGridV2==='function'){renderMissionGridV2();renderMissionV2()}else hydrateMissionGrid();}
   else if(id==='speaking')hydrateSurvivalPhrases();
   else if(id==='league')renderLeague();
   else if(id==='shop')renderShop();
   else if(id==='practice'){renderPracticeCoach();renderMasteryMap();renderReviewDeck();renderMistakeNotebook()}
   else if(id==='journal')renderJournal();
   else if(id==='videos'&&typeof renderVideos==='function')renderVideos();
   else if(id==='pronunciation'&&typeof renderPronunciation==='function')renderPronunciation();
   if(options.history!==false)commitRouteUrl(id,options.replace===true);
   keepActiveNavVisible(id);
   window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
   if(viewStart!==null&&typeof perfEnd==='function')perfEnd('view:'+id,viewStart);
 }catch(err){
   console.error('MON route failed',id,err);
   if(requestId===routeRequestId){
     document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===previous));
     document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===navParentForView(previous)));
     const crumb=document.getElementById('crumb');if(crumb)crumb.textContent=viewNames[previous]||previous;
     toast('Não consegui abrir '+(viewNames[id]||id)+'. Tente novamente.');
   }
   return false;
 }finally{
   clearTimeout(busyTimer);
   if(requestId===routeRequestId)setRouteBusy(false);
 }
 return requestId===routeRequestId;
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
window.addEventListener('popstate',()=>go(routeFromLocation(),{history:false}));
const MON_PROFILE_KEY='mon-profile';
function loadLocalProfile(){try{return {...{name:'Estudante MON',dailyGoal:20,studyMode:'equilibrado'},...JSON.parse(localStorage.getItem(MON_PROFILE_KEY)||'{}')}}catch(e){return {name:'Estudante MON',dailyGoal:20,studyMode:'equilibrado'}}}
function saveLocalProfile(profile){localStorage.setItem(MON_PROFILE_KEY,JSON.stringify(profile))}
function userAreaMarkup(){
 return '<div class="user-shell"><div class="user-hero"><div class="user-identity"><div class="user-avatar" id="userAvatar">門</div><div><span class="eyebrow">Minha área · 私</span><h2 id="userNameHero">Estudante MON</h2><p id="userPlanHero">Seu progresso e suas preferências neste dispositivo.</p></div></div><span class="user-local-badge" id="userAccountBadge">perfil local</span></div><div class="user-grid"><section class="user-card"><h3>Seu aprendizado</h3><p>Uma leitura rápida do seu momento, sem transformar estudo em painel de vaidade.</p><div class="user-stats"><div class="user-stat"><span>nível</span><b id="userLevel">N5</b></div><div class="user-stat"><span>sequência</span><b id="userStreak">1 dia</b></div><div class="user-stat"><span>XP</span><b id="userXp">0</b></div></div><div class="user-progress-line"><i id="userJourneyBar"></i></div><div class="user-data-note" id="userJourneyText"></div><div class="user-actions"><button class="user-secondary" onclick="go(\'progress\')">ver progresso</button><button class="user-secondary" onclick="go(\'journey\')">abrir jornada</button></div></section><section class="user-card"><h3>Perfil e rotina</h3><p>Preferências simples para o MON adaptar a experiência sem exigir uma conta.</p><label class="user-field"><span>Como quer ser chamado</span><input id="userNameInput" maxlength="32" autocomplete="nickname"></label><label class="user-field"><span>Meta diária</span><select id="userGoalInput"><option value="10">10 min · leve</option><option value="20">20 min · consistente</option><option value="30">30 min · intenso</option></select></label><label class="user-field"><span>Ritmo preferido</span><select id="userModeInput"><option value="equilibrado">Equilibrado</option><option value="revisao">Mais revisão</option><option value="desafio">Mais desafio</option></select></label><div class="user-actions"><button class="user-save" onclick="saveUserArea()">salvar preferências</button><button class="user-secondary" onclick="exportMonBackup()">exportar backup</button></div><div class="user-data-note" id="userCloudPanel"></div><div class="user-data-note" id="userAccountNote">Seus dados ficam salvos localmente neste navegador. Exportar um backup protege seu progresso antes de trocar de dispositivo ou limpar os dados do site.</div></section></div></div>';
}
function ensureUserArea(){let view=document.getElementById('user');if(view)return view;view=document.createElement('section');view.id='user';view.className='view';view.innerHTML=userAreaMarkup();document.querySelector('.content')?.appendChild(view);return view}
function renderUserArea(){
 ensureUserArea();const profile=loadLocalProfile(),p=currentPlan(),stage=JOURNEY_STAGES[journeyStageIndex()],pct=Math.round(journeyStageProgress()*100);
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};set('userNameHero',profile.name);set('userLevel',(p.displayLevel||p.level)+' · dia '+p.localDay+'/'+p.total);set('userStreak',(state.streak||0)+' '+((state.streak||0)===1?'dia':'dias'));set('userXp',state.xp||0);set('userJourneyText',stage.name+' · '+stage.title+' · '+pct+'% da etapa');const bar=document.getElementById('userJourneyBar');if(bar)bar.style.width=pct+'%';const name=document.getElementById('userNameInput'),goal=document.getElementById('userGoalInput'),mode=document.getElementById('userModeInput');if(name)name.value=profile.name;if(goal)goal.value=String(profile.dailyGoal);if(mode)mode.value=profile.studyMode;const avatar=document.getElementById('userAvatar');if(avatar)avatar.textContent=(profile.name.trim()[0]||'門').toUpperCase();const account=loadMonAccount(),badge=document.getElementById('userAccountBadge'),note=document.getElementById('userAccountNote');if(badge)badge.textContent=monAccountStatus()==='connected'?'conta sincronizada':'perfil local';if(note)note.textContent=typeof monCloudConfigured==='function'&&monCloudConfigured()?'Conta MON disponível. Entre por link seguro enviado ao seu e-mail para sincronizar entre dispositivos.':'Este perfil tem um ID local estável, mas a nuvem ainda precisa da URL e chave publicável do projeto Supabase.';renderCloudAccountPanel();
}
async function renderCloudAccountPanel(){
 const panel=document.getElementById('userCloudPanel');
 if(typeof ensureMonBackupImportControl==='function')ensureMonBackupImportControl();
 if(!panel)return;
 if(typeof monCloudConfigured!=='function'||!monCloudConfigured()){
  panel.innerHTML='<b>Conta MON</b><br>Nuvem preparada, aguardando configuração do projeto Supabase.';
  return;
 }
 try{
  const session=await monCloudSession();
  if(session){
   const email=escapeHtml(session.user.email||'usuário');
   panel.innerHTML='<b>Conta MON conectada</b><br>'+email+'<div class="user-actions"><button class="user-save" onclick="syncMonNow()">sincronizar agora</button><button class="user-secondary" onclick="disconnectMonCloud()">sair</button></div>';
  }else{
   panel.innerHTML='<b>Sincronizar entre dispositivos</b><br><label class="user-field"><span>E-mail</span><input id="userCloudEmail" type="email" autocomplete="email" placeholder="voce@exemplo.com"></label><div class="user-actions"><button class="user-save" onclick="connectMonCloud()">enviar link de acesso</button></div>';
  }
 }catch(e){
  panel.textContent='Conta MON indisponível: '+e.message;
 }
}
async function connectMonCloud(){
 const email=document.getElementById('userCloudEmail')?.value.trim();
 if(!email){toast('Digite seu e-mail');return}
 try{
  await monCloudSignIn(email);
  toast('Link de acesso enviado ao seu e-mail');
 }catch(e){toast(e.message)}
}
async function disconnectMonCloud(){
 try{
  await monCloudSignOut();
  await renderCloudAccountPanel();
  toast('Conta desconectada deste dispositivo');
 }catch(e){toast(e.message)}
}
async function syncMonNow(){
 try{
  await monCloudPush(loadLocalProfile());
  toast('Progresso sincronizado com a Conta MON');
  await renderCloudAccountPanel();
 }catch(e){toast(e.message)}
}
function saveUserArea(){const name=(document.getElementById('userNameInput')?.value||'Estudante MON').trim().slice(0,32)||'Estudante MON',dailyGoal=Number(document.getElementById('userGoalInput')?.value||20),studyMode=document.getElementById('userModeInput')?.value||'equilibrado';saveLocalProfile({name,dailyGoal,studyMode});renderUserArea();toast('Preferências salvas neste dispositivo')}
function exportMonBackup(){const payload=monSyncPayload(loadLocalProfile());const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='mon-backup-'+shellLocalDateKey()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),0);toast('Backup do MON exportado')}
function showProfileSummary(){ensureUserArea();go('user')}
function currentPlan(){const d=Number(state.day||1);if(d<=30)return{level:'N5',displayLevel:'N5',phase:'n5',localDay:d,total:30,label:'sobrevivência',start:1};if(d<=54)return{level:'N4',displayLevel:'PONTE',phase:'bridge',localDay:d-30,total:24,label:'consolidação N5 → N4',start:31};if(d<=90)return{level:'N4',displayLevel:'N4',phase:'n4',localDay:d-54,total:36,label:'autonomia',start:55};return{level:'N3',displayLevel:'N3',phase:'n3',localDay:Math.min(90,d-90),total:90,label:'integração',start:91}}
const JOURNEY_STAGES=[
 {name:'Abrir o portão',title:'Reconhecer sons e começar a ler.',copy:'Som, ritmo, kana e primeiras frases funcionais.'},
 {name:'Sobreviver',title:'Pedir, perguntar e se locomover.',copy:'Situações essenciais de estação, compras, comida e direção.'},
 {name:'Viver',title:'Resolver sua rotina.',copy:'Casa, agenda, bairro, serviços e trabalho básico.'},
 {name:'Interagir',title:'Manter conversas curtas e reparar falhas.',copy:'Listening, resposta espontânea e estratégias de reparo.'},
 {name:'Ganhar autonomia',title:'Resolver situações novas.',copy:'Transferência, produção e leitura funcional com menos pistas.'}
];
function journeyStageIndex(){
 if(!state.foundationComplete)return 0;
 const d=Number(state.day||1);
 if(d<=30)return 1;
 if(d<=60)return 2;
 if(d<=90)return 3;
 return 4;
}
function journeyStageProgress(){
 const stage=journeyStageIndex();
 if(stage===0)return Math.max(0,Math.min(1,((state.foundationDay||1)-1)/Math.max(1,SHELL_FOUNDATION_TOTAL)));
 if(stage===1)return Math.max(0,Math.min(1,(Math.min(30,state.day||1)-1)/29));
 if(stage===2)return Math.max(0,Math.min(1,((Math.min(60,state.day||31)-31))/29));
 if(stage===3)return Math.max(0,Math.min(1,((Math.min(90,state.day||61)-61))/29));
 return Math.max(0,Math.min(1,((Math.min(180,state.day||91)-91))/89));
}
function runJourneyPrimary(){
 const d=homeCoachDecision(state,flatPath);
 return runAdaptiveHomeAction(d.action);
}
function renderJourney(){
 const current=journeyStageIndex();
 document.querySelectorAll('.journey-stage').forEach((el,i)=>{
   el.classList.toggle('done',i<current);
   el.classList.toggle('current',i===current);
   el.classList.toggle('locked',i>current);
   const status=el.querySelector('.journey-stage-status');
   if(status)status.textContent=i<current?'conquistado':i===current?'agora':'depois';
 });
}
function averageMasteryDimension(dimension){
 const vals=[];
 for(const cells of Object.values(state.masteryEvidence||{})){
   const score=Number(cells?.[dimension]?.score);
   if(Number.isFinite(score))vals.push(score);
 }
 return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
}
function renderProgressHub(){
 const stage=journeyStageIndex(),meta=JOURNEY_STAGES[stage],pct=Math.round(journeyStageProgress()*100);
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
 set('progressCapabilityTitle',meta.name+' · '+meta.title);
 set('progressCapabilityCopy',meta.copy);
 set('progressJourneyPct',pct+'%');const ring=document.querySelector('.progress-ring-large');if(ring)ring.style.setProperty('--progress',pct+'%');
 set('journeyStageMini',meta.name);
 set('journeyCapabilityMini',meta.title);
 const due=Object.values(state.reviewItems||{}).filter(x=>(x?.due||0)<=Date.now()).length;
 const mistakes=Object.values(state.mistakeStats||{}).filter(x=>(x?.count||0)>(x?.recovered||0)).length;
 const dims=[
   ['Reconhecer',averageMasteryDimension('recognize'),'identificar com apoio'],
   ['Recuperar',averageMasteryDimension('recall'),'lembrar sem pista'],
   ['Escutar',averageMasteryDimension('listen'),'transformar som em sentido'],
   ['Produzir',averageMasteryDimension('produce'),'responder e construir']
 ];
 const grid=document.getElementById('progressEvidenceGrid');
 if(grid)grid.innerHTML=dims.map(([name,score,desc])=>`<article class="progress-evidence"><span>${name}</span><b>${score||'—'}${score?'%':''}</b><small>${desc}</small><i><em style="width:${score||0}%"></em></i></article>`).join('');
 const nextTitle=document.getElementById('progressNextTitle'),nextCopy=document.getElementById('progressNextCopy');
 if(nextTitle&&nextCopy){
   if(due>=4){nextTitle.textContent='Revisar antes de empilhar novidade.';nextCopy.textContent=`${due} itens chegaram ao ponto ideal de recuperação espaçada.`;}
   else if(mistakes>=3){nextTitle.textContent='Corrigir o padrão que está voltando.';nextCopy.textContent=`${mistakes} padrões ainda aparecem como erros recorrentes.`;}
   else {nextTitle.textContent='Transferir o que você já sabe.';nextCopy.textContent='O próximo avanço vem de usar linguagem conhecida em um contexto um pouco diferente.';}
 }
}
function updateMetrics(){
 const mastered=Object.values(state.reviews).filter(r=>(r.interval||0)>=7&&(r.reps||0)>=3).length;
 const reviewedKanji=new Set(Object.keys(state.reviews||{}));
 const dueReviewed=Object.values(state.reviewItems||{}).filter(r=>r?.type==='kanji'&&(r.due||0)<=Date.now()).length;
 const due=Math.max(0,SHELL_KANJI_COUNT-reviewedKanji.size)+dueReviewed;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v}, width=(id,v)=>{const e=document.getElementById(id);if(e)e.style.width=v};
 set('masteredMetric',mastered);set('dueMetric',due);width('masteredBar',Math.min(100,mastered/Math.max(1,SHELL_KANJI_COUNT)*100)+'%');set('xpTop',state.xp);set('streakSidebar',state.streak);set('streakTop',state.streak);set('energyTop',Math.max(0,state.energy));set('quickEnergy',Math.max(0,state.energy));set('gemsTop',state.gems);set('speechMetric',(state.speech||0)+'%');width('speechBar',(state.speech||0)+'%');
 const p=currentPlan(),zeroPending=!state.foundationComplete;const plan=document.getElementById('planTop');if(plan)plan.textContent=zeroPending?`ZERO · sessão ${Math.min(SHELL_FOUNDATION_TOTAL,state.foundationDay||1)}/${SHELL_FOUNDATION_TOTAL}`:`${p.displayLevel||p.level} · dia ${p.localDay}/${p.total}`;const hero=document.getElementById('sessionDayHero');if(hero)hero.textContent=zeroPending?`fundação ${Math.min(SHELL_FOUNDATION_TOTAL,state.foundationDay||1)}/${SHELL_FOUNDATION_TOTAL}`:`dia ${state.day}`;const dd=document.getElementById('dailyDueCount');if(dd)dd.textContent=zeroPending?(typeof countKanaInTraining==='function'?countKanaInTraining():0):due;const pc=document.getElementById('pathCurrentLevel');if(pc)pc.textContent=zeroPending?'ZERO':(p.displayLevel||p.level);const pd=document.getElementById('pathCurrentDay');if(pd)pd.textContent=zeroPending?`sessão ${Math.min(SHELL_FOUNDATION_TOTAL,state.foundationDay||1)} · base sonora, escrita e gramática`:`dia ${p.localDay} · ${p.label}`;const pr=document.getElementById('pathRingFill');if(pr)pr.style.width=zeroPending?Math.min(100,((state.foundationDay||1)-1)/SHELL_FOUNDATION_TOTAL*100)+'%':Math.min(100,p.localDay/p.total*100)+'%';updateDailyCommand();if(typeof renderFoundationProgress==='function')renderFoundationProgress();renderGameHome();
}
let curriculumLevel='N5';
function renderCurriculum(level=curriculumLevel){curriculumLevel=level;document.querySelectorAll('[data-level]').forEach(b=>b.classList.toggle('active',b.dataset.level===level));const data=curriculumData.find(x=>x.level===level)||curriculumData[0];const p=currentPlan();const same=p.level===level;document.getElementById('curriculumSummary').innerHTML=`<div class="curriculum-stat"><span>promessa</span><b>${data.promise}</b></div><div class="curriculum-stat"><span>kanji alvo</span><b>${data.kanji}</b></div><div class="curriculum-stat"><span>gramática funcional</span><b>${data.grammar}</b></div><div class="curriculum-stat"><span>missões</span><b>${data.missions}</b></div>`;document.getElementById('curriculumGrid').innerHTML=data.units.map((u,i)=>{const span=u.days.split('–').map(Number),absStart=span[0],absEnd=span[1];const done=state.day>absEnd, current=same&&state.day>=absStart&&state.day<=absEnd, locked=state.day<absStart&&level!=='N5';return `<article class="unit-card ${done?'done':''} ${current?'current':''} ${locked?'locked':''}" data-kanji="${u.kanji}"><div class="unit-index"><span>${data.level} · dias ${u.days}</span><i></i></div><h4>${u.title}</h4><p>${u.desc}</p><div class="unit-meta">${u.meta.map(m=>`<span>${m}</span>`).join('')}</div><button class="unit-action" onclick="${current||done?`startSession()`:`toast('Este bloco abre conforme você demonstra domínio')`}">${current?'continuar daqui →':done?'revisar bloco →':'prévia bloqueada'}</button></article>`}).join('')}
document.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>renderCurriculum(b.dataset.level)));
function updateDailyCommand(){if(!document.getElementById('dailyMissionTitle'))return;const profile=loadLocalProfile(),goal=[10,20,30].includes(Number(profile.dailyGoal))?Number(profile.dailyGoal):20,steps=goal===10?4:goal===30?7:6,mode={equilibrado:'equilíbrio',revisao:'mais revisão',desafio:'mais desafio'}[profile.studyMode]||'equilíbrio',label=document.getElementById('dailyGoalLabel'),count=document.getElementById('dailyStepCount'),ring=document.getElementById('dailyPlanRing'),bar=document.getElementById('dailyPlanBar');if(label)label.textContent=`${goal} min · ${steps} blocos`;if(count)count.textContent=steps;if(ring)ring.style.setProperty('--goal',(goal/30*100)+'%');if(bar)bar.style.width=(goal/30*100)+'%';if(!state.foundationComplete){const u=shellFoundationOutline[Math.max(0,Math.min(SHELL_FOUNDATION_TOTAL-1,(state.foundationDay||1)-1))];document.getElementById('dailyMissionTitle').textContent='Hoje você vai automatizar '+u.title.toLowerCase();document.getElementById('dailyMissionCopy').textContent=`Sessão ${u.n}/${SHELL_FOUNDATION_TOTAL} · ${u.desc}. Ritmo: ${mode}. A meta diária passa a definir o tamanho real da sessão.`;return}const i=Math.min(shellMissionOutline.length-1,Math.floor(((state.day||1)-1)%30/5)),m=shellMissionOutline[i];document.getElementById('dailyMissionTitle').textContent='Hoje você vai conseguir: '+m.title.toLowerCase();document.getElementById('dailyMissionCopy').textContent=`Missão ${i+1}/6 · ${m.desc}. O MON começa pelo que está vencendo na memória e fecha com uso ativo. Ritmo: ${mode}.`}
function normalizeJP(s){return(s||'').replace(/[\s。、！？,.!?]/g,'').replace(/とうきょう/g,'東京').replace(/えき/g,'駅').toLowerCase()}
function similarity(a,b){a=normalizeJP(a);b=normalizeJP(b);if(!a||!b)return 0;let same=0;for(const ch of new Set(a)){same+=Math.min(a.split(ch).length-1,b.split(ch).length-1)}return Math.max(0,Math.min(100,Math.round((same/Math.max(a.length,b.length))*115)))}
function shuffledOptions(correct, pool, count=4){const vals=[correct,...pool.filter(x=>x!==correct)].filter((x,i,a)=>a.indexOf(x)===i);for(let i=vals.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[vals[i],vals[j]]=[vals[j],vals[i]]}const sliced=vals.slice(0,count);if(!sliced.includes(correct))sliced[Math.floor(Math.random()*sliced.length)]=correct;return sliced}
async function startSession(){await ensureFeatureRuntime('session');return window.startSession()}
async function startDiagnostic(){await ensureFeatureRuntime('session');return window.startDiagnostic()}
async function startFoundationSession(...args){await ensureFeatureRuntime('session');return window.startFoundationSession(...args)}
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
const globalSearch=document.getElementById('globalSearch');
if(globalSearch){globalSearch.addEventListener('keydown',async e=>{if(e.key==='Enter'&&e.target.value.trim()){await go('kanji');const q=e.target.value.trim();const ks=document.getElementById('kanjiSearch');ks.value=q;renderKanjiList('all',q);setTimeout(()=>ks.focus(),220)}})}
if(matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelectorAll('.experience-card,.mission').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--rx',(-y*4)+'deg');card.style.setProperty('--ry',(x*5)+'deg')});card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg')})})}
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
function todayQuestState(){const d=shellLocalDateKey();if(state.quests.date!==d)state.quests={date:d,lessons:0,xp:0,accuracy:false};return state.quests}
function runAdaptiveHomeAction(action){
 const idx=Math.max(0,Math.min(flatPath.length-1,state.pathProgress||0));
 if(action==='repair')return startMasteryRepair(idx);
 if(action==='practice')return go('practice');
 if(action==='journal')return go('journal');
 if(action==='session')return startSession();
 if(action==='chest')return claimPathChest(idx);
 return startQuickLesson(idx);
}
function guideMascotState(decision){
 if(['repair','mistake'].includes(decision?.kind))return 'repair';
 if(['review','recover'].includes(decision?.kind))return 'review';
 if(decision?.kind==='story')return 'transfer';
 if(decision?.node?.type==='checkpoint')return 'checkpoint';
 return 'learn';
}
function renderGuideMascot(decision){
 const mood=guideMascotState(decision),guide=document.querySelector('.guide-card'),mascot=document.getElementById('guideMascot'),label=document.getElementById('guideStateLabel');
 if(guide)guide.dataset.state=mood==='transfer'?'story':mood;
 if(mascot)mascot.dataset.mood=mood;
 if(label)label.textContent=({learn:'aprender',review:'revisar',repair:'reparar',transfer:'transferir',checkpoint:'checkpoint'})[mood]||'agora';
 return mood;
}
function renderAdaptiveHome(){
 const d=homeCoachDecision(state,flatPath),banner=document.querySelector('.course-banner');
 if(banner)banner.dataset.adaptive=d.kind;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set('homeAdaptiveEyebrow',d.eyebrow);set('homeAdaptiveTitle',d.title);set('homeAdaptiveCopy',d.copy);set('homeAdaptiveSignal',d.signal);
 const primary=document.getElementById('homeAdaptivePrimary'),secondary=document.getElementById('homeAdaptiveSecondary');
 if(primary){primary.textContent=d.cta;primary.onclick=()=>runAdaptiveHomeAction(d.action)}
 if(secondary){secondary.textContent='por que esta sessão?';secondary.onclick=()=>document.getElementById('todayReason')?.classList.toggle('open')}
 const reasonTitle=document.getElementById('todayReasonTitle'),reasonCopy=document.getElementById('todayReasonCopy');
 if(reasonTitle)reasonTitle.textContent=d.title;
 if(reasonCopy)reasonCopy.textContent=d.copy+' Sinal principal: '+d.signal+'.';
 const guide=document.querySelector('.guide-card');
 if(guide&&['repair','review','recover','mistake','story'].includes(d.kind)){
   set('guideTitle',d.title);set('guideCopy',d.copy);
 }
 return d;
}
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
 renderQuests();renderHomeJournalSummary();const adaptive=renderAdaptiveHome();
 const stage=journeyStageIndex(),stageMeta=JOURNEY_STAGES[stage];el('journeyStageMini',stageMeta.name);el('journeyCapabilityMini',stageMeta.title);
 const g=flatPath[Math.min(progress,total-1)];
 if(g&& !['repair','review','recover','mistake','story'].includes(adaptive?.kind)){
   const repair=state.remediation?.idx===progress,guide=document.querySelector('.guide-card');
   if(guide){guide.dataset.state=repair?'repair':g.type==='checkpoint'?'checkpoint':g.type==='story'?'story':'learn'}
   el('guideTitle',repair?'Fortaleça a aresta fraca.':g.type==='checkpoint'?'Prepare-se para provar domínio.':g.type==='story'?'Leia para integrar o que aprendeu.':g.day<=12?'Automatize o kana.':g.day<=24?'Monte frases, não traduções.':'Use japonês em contexto.');
   el('guideCopy',repair?'Você concluiu a atividade, mas o Mastery Graph ainda encontrou uma habilidade crítica instável. O reforço é curto, direcionado e não consome Energia.':g.type==='checkpoint'?'O checkpoint mistura competências da unidade. Ele não mede velocidade, mede se você consegue recuperar e transferir sem pista.':g.type==='story'?'Histórias conectam vocabulário e gramática em contexto contínuo. Leia primeiro pelo sentido geral, depois volte aos detalhes.':g.day<=12?'Leia, ouça e recupere a forma. O romaji some conforme seu cérebro para de precisar dele.':g.day<=24?'Partículas mostram o papel dos blocos. Espere o predicado antes de fechar o sentido.':'Agora o curso mistura kana, gramática, kanji, áudio e situações reais no mesmo circuito.');
 }
 renderGuideMascot(adaptive);
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
function renderHomeJournalSummary(){
 const ns=state.narrative||{},episodes=Object.values(ns.episodes||{}),chars=Object.values(ns.characters||{}),resolved=episodes.filter(x=>x.resolved).length,last=ns.lastEpisode;
 const title=document.getElementById('journalMiniTitle'),meta=document.getElementById('journalMiniMeta'),stat=document.getElementById('journalMiniStat');
 if(title)title.textContent=last?last.title:'Seu diário começa no N5';
 if(meta)meta.textContent=last?`${last.characterName} · ${last.placeName}`:'Personagens e lugares reaparecem conforme você avança.';
 if(stat)stat.textContent=`${resolved} resolvidas · ${chars.length} pessoas`;
}
function renderQuests(){const q=todayQuestState(),items=[{icon:'道',name:'Complete 1 lição',now:q.lessons||0,max:1},{icon:'✦',name:'Ganhe 30 XP',now:q.xp||0,max:30},{icon:'正',name:'Faça uma lição com 80%+',now:q.accuracy?1:0,max:1}];const w=document.getElementById('questList');if(!w)return;w.innerHTML=items.map(x=>{const pct=Math.min(100,Math.round(x.now/x.max*100)),done=x.now>=x.max;return `<div class="quest-row ${done?'done':''}"><div class="quest-icon">${x.icon}</div><div><b>${x.name}</b><span>${Math.min(x.now,x.max)}/${x.max}</span><div class="quest-progress"><i style="width:${pct}%"></i></div></div><div class="quest-check">${done?'✓':'◆ 10'}</div></div>`}).join('')}
function claimPathChest(idx){if(idx>state.pathProgress)return toast('Este baú ainda está bloqueado');if(state.chests[idx])return toast('Baú já aberto');state.chests[idx]=true;state.gems+=40;state.energy=Math.min(state.maxEnergy,state.energy+4);if(idx===state.pathProgress)state.pathProgress++;save();toast('Baú aberto · +40 cristais · +4 energia');renderGameHome()}
let quickRun=null;
async function startQuickLesson(idx){if(idx>state.pathProgress)return toast('Complete o círculo anterior primeiro');const node=flatPath[idx];if(!node)return;if(node.type==='chest')return claimPathChest(idx);await ensureLearningRuntime();await ensureFeatureRuntime('lesson');if(state.remediation?.idx===idx)return startMasteryRepair(idx);if((state.energy||0)<=0){go('practice');toast('Energia vazia · pratique para recarregar ou use a Loja');return}const pack=buildLesson(node,state);quickRun={idx,node,pack,step:0,correct:0,answered:0,streak:0,xp:0,selected:null,built:[],matches:[],matchPick:null,checked:false};go('lesson');renderQuickExercise();updateMetrics()}
async function startMasteryRepair(idx){await ensureLearningRuntime();await ensureFeatureRuntime('lesson');if(idx!==state.pathProgress)return toast('O reforço pertence ao nó atual');const node=flatPath[idx];if(!node)return;const pack=buildMasteryRemediation(node);if(!pack.exercises.length)return toast('Sem lacunas observáveis para reforçar agora');quickRun={idx,node,pack,step:0,correct:0,answered:0,streak:0,xp:0,selected:null,built:[],matches:[],matchPick:null,checked:false,practiceOnly:true,masteryRepair:true};go('lesson');renderQuickExercise();updateMetrics()}
function updateGameStreak(){const today=shellLocalDateKey(),last=state.lastStudyDate;if(last===today)return;if(last){const y=new Date();y.setDate(y.getDate()-1);if(last===shellLocalDateKey(y))state.streak=(state.streak||0)+1;else if((state.streakFreeze||0)>0){state.streakFreeze--;state.streak=(state.streak||1)+1}else state.streak=1}else state.streak=Math.max(1,state.streak||1);state.lastStudyDate=today}
function renderLeague(){const base=[['Aiko','2.480'],['Kenji','2.130'],['Mina','1.860'],['Rui','1.420'],['Sora','980'],['Emi','720'],['Tomo','510']].map(x=>({name:x[0],xp:Number(x[1].replace('.','')),demo:true}));base.push({name:'Você',xp:state.leagueXp||0,you:true});base.sort((a,b)=>b.xp-a.xp);const w=document.getElementById('leagueBoard');if(w)w.innerHTML=base.map((x,i)=>`<div class="league-row ${x.you?'you':''}"><div class="league-rank">${i+1}</div><div class="league-user"><b>${x.name}</b><small>${x.you?'seu progresso local':'avatar demonstrativo'}</small></div><div class="league-xp">${x.xp.toLocaleString('pt-BR')} XP</div></div>`).join('')}
function renderShop(){updateMetrics()}
function buyItem(type){const costs={freeze:100,energy:60,boost:180},cost=costs[type];if(state.gems<cost)return toast('Cristais insuficientes');state.gems-=cost;if(type==='freeze'){state.streakFreeze=(state.streakFreeze||0)+1;toast('Amuleto equipado')}if(type==='energy'){state.energy=state.maxEnergy;toast('Energia recarregada')}if(type==='boost'){state.xpBoostUntil=Date.now()+15*60*1000;toast('2× XP ativo por 15 min')}save()}
let monUpdateWorker=null,monReloadForUpdate=false;
function showMonUpdate(worker){
 monUpdateWorker=worker;
 const banner=document.getElementById('updateBanner');
 if(banner)banner.hidden=false;
}
function applyMonUpdate(){
 if(!monUpdateWorker)return;
 monReloadForUpdate=true;
 monUpdateWorker.postMessage({type:'SKIP_WAITING'});
}
function watchMonUpdate(reg){
 if(reg.waiting&&navigator.serviceWorker.controller)showMonUpdate(reg.waiting);
 reg.addEventListener('updatefound',()=>{
  const worker=reg.installing;if(!worker)return;
  worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)showMonUpdate(worker)});
 });
}
if('serviceWorker' in navigator){
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(monReloadForUpdate)window.location.reload()});
 window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').then(watchMonUpdate).catch(()=>{}));
}
function finishOnboarding(mode){
 localStorage.setItem('mon-onboarded','1');
 const shell=document.getElementById('onboardingShell');if(shell)shell.hidden=true;
 if(mode==='diagnostic')startDiagnostic();
 else {go('home');setTimeout(()=>runJourneyPrimary(),120);}
}
function initOnboarding(){
 const shell=document.getElementById('onboardingShell');
 if(!shell)return;
 const seen=localStorage.getItem('mon-onboarded')==='1'||(state.sessions||0)>0||(state.foundationDay||1)>1;
 shell.hidden=seen;
}
const reasonToggle=document.getElementById('todayReasonToggle');
if(reasonToggle)reasonToggle.addEventListener('click',()=>document.getElementById('todayReason')?.classList.toggle('open'));
updateMetrics();renderGameHome();initOnboarding();
const initialRoute=routeFromLocation();
if(initialRoute!=='home')go(initialRoute,{history:false}).catch(()=>{});
else history.replaceState({monView:'home'},'',routeUrl('home'));
for(const name of ['kanji','reading','missions','speaking','curriculum','journal','videos','pronunciation']){
 const nav=document.querySelector(`[data-view="${name}"]`);
 if(nav)nav.addEventListener('pointerover',()=>ensureFeatureRuntime(name).catch(()=>{}),{passive:true,once:true});
}
const foundationNav=document.querySelector('[data-view="foundation"]');
if(foundationNav)foundationNav.addEventListener('pointerover',()=>ensureFeatureRuntime('foundation').catch(()=>{}),{passive:true,once:true});
const pathWarm=document.getElementById('learningPath');
if(pathWarm)pathWarm.addEventListener('pointerover',e=>{if(e.target.closest('.path-node.current'))ensureLearningRuntime().catch(()=>{})},{passive:true});