// MON Video Library · external players load only after user action
const MON_VIDEOS=[
 {id:'irodori-a1',yt:'GL9mCFgaAGM',cat:'course',skill:'foundation',level:'ZERO–N5',jp:'入門',title:'Irodori Starter A1 em ação',desc:'Veja o fluxo de atividades do nível inicial e use o vídeo para entender como ouvir, responder e reutilizar linguagem em contexto.',source:'Japan Foundation · Irodori',tag:'curso A1'},
 {id:'listening',yt:'ArOfXbCC-WE',cat:'listen',skill:'listen',level:'N5–N4',jp:'聞',title:'Como trabalhar listening',desc:'Observe como uma atividade de escuta é construída. Ouça primeiro pela intenção e só depois pelos detalhes.',source:'Japan Foundation · Irodori',tag:'escuta'},
 {id:'speaking',yt:'xcTI2rPN_BE',cat:'speak',skill:'produce',level:'N5–N4',jp:'話',title:'Como trabalhar speaking',desc:'Apoio para entender a lógica de produção oral: contexto, tentativa, feedback e nova tentativa.',source:'Japan Foundation · Irodori',tag:'fala'},
 {id:'reading',yt:'EDCbKMNalVc',cat:'read',skill:'transfer',level:'N5–N4',jp:'読',title:'Como trabalhar leitura',desc:'Use como metaguia para localizar pistas, prever sentido e evitar traduzir cada palavra antes de compreender o todo.',source:'Japan Foundation · Irodori',tag:'leitura'},
 {id:'writing',yt:'jcGWIWgOmWw',cat:'write',skill:'produce',level:'ZERO–N5',jp:'書',title:'Como trabalhar escrita',desc:'Veja como escrita pode nascer de uma tarefa funcional, em vez de apenas copiar caracteres isolados.',source:'Japan Foundation · Irodori',tag:'escrita'}
];
let videoFilter='all';
function videoLearningState(){state.videoLearning={opened:{},practice:{},last:null,...(state.videoLearning||{}),opened:{...((state.videoLearning||{}).opened||{})},practice:{...((state.videoLearning||{}).practice||{})}};return state.videoLearning}
function videoDimensionScores(s=state){
 const sums={},counts={};for(const cells of Object.values(s.masteryEvidence||{}))for(const [d,cell] of Object.entries(cells||{})){const score=Number(cell?.score);if(!Number.isFinite(score))continue;sums[d]=(sums[d]||0)+score;counts[d]=(counts[d]||0)+1}
 return Object.keys(sums).map(d=>({dimension:d,score:Math.round(sums[d]/counts[d]),samples:counts[d]})).filter(x=>x.samples>=2).sort((a,b)=>a.score-b.score);
}
function recommendedVideo(s=state){
 const vs=videoLearningState(),last=vs.last&&MON_VIDEOS.find(v=>v.id===vs.last.id);
 if(last&&(vs.opened[last.id]||0)>(vs.practice[last.id]||0))return{video:last,followThrough:true,reason:'Você abriu este apoio. Agora feche o ciclo recuperando sem o vídeo.'};
 const weak=videoDimensionScores(s)[0];let id='irodori-a1',reason='Comece pelo fluxo completo e observe como input vira resposta em contexto.';
 if(weak?.dimension==='listen'){id='listening';reason=`Escuta é a dimensão mais frágil observada (${weak.score}%). Use o vídeo como preparação, não como resposta final.`}
 else if(weak?.dimension==='produce'){id='speaking';reason=`Produção é a dimensão mais frágil observada (${weak.score}%). Observe o ciclo tentativa → feedback → nova tentativa.`}
 else if(['transfer','recall','recognize'].includes(weak?.dimension)){id='reading';reason=`${weak.dimension==='transfer'?'Transferência':'Recuperação'} está pedindo apoio (${weak.score}%). Use pistas do texto e depois tente sem suporte.`}
 return{video:MON_VIDEOS.find(v=>v.id===id)||MON_VIDEOS[0],followThrough:false,reason};
}
function renderVideoRecommendation(){
 const host=document.getElementById('videoRecommendation');if(!host)return;const r=recommendedVideo(),v=r.video;
 host.innerHTML=`<div><span class="eyebrow">recomendado pelo seu progresso · ${v.level}</span><h3>${r.followThrough?'Agora retire o apoio.':v.title}</h3><p>${r.reason}</p></div><button class="primary" onclick="${r.followThrough?`startVideoPractice('${v.id}')`:`openVideo('${v.id}')` }">${r.followThrough?'praticar sem vídeo →':'assistir apoio →'}</button>`;
}

function renderVideos(){
 const host=document.getElementById('videoGrid');if(!host)return;
 const rows=videoFilter==='all'?MON_VIDEOS:MON_VIDEOS.filter(v=>v.cat===videoFilter);
 host.innerHTML=rows.map(v=>`<button class="video-card" onclick="openVideo('${v.id}')" aria-label="Assistir ${v.title}">
   <div class="video-thumb"><img loading="lazy" decoding="async" src="https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg" alt=""><span class="video-play">▶</span><em>${v.jp}</em></div>
   <div class="video-body"><div class="video-meta"><span>${v.tag} · ${v.level}</span><small>externo · internet</small></div><h3>${v.title}</h3><p>${v.desc}</p><strong>${v.source}</strong></div>
 </button>`).join('');
}
function setVideoFilter(cat,btn){videoFilter=cat;document.querySelectorAll('[data-video-filter]').forEach(x=>x.classList.toggle('active',x===btn));renderVideos()}
function openVideo(id){
 const v=MON_VIDEOS.find(x=>x.id===id);if(!v)return;
 const modal=document.getElementById('videoModal'),stage=document.getElementById('videoStage'),external=document.getElementById('videoExternalLink'),practice=document.getElementById('videoPracticeButton'),vs=videoLearningState();
 vs.opened[id]=(vs.opened[id]||0)+1;vs.last={id,at:Date.now()};save();renderVideoRecommendation();
 document.getElementById('videoModalTitle').textContent=v.title;document.getElementById('videoModalCopy').textContent=v.desc;
 if(external)external.href='https://www.youtube.com/watch?v='+encodeURIComponent(v.yt);
 if(practice){practice.textContent=(v.cat==='listen'||v.cat==='speak')?'praticar sem vídeo →':'aplicar sem vídeo →';practice.onclick=()=>startVideoPractice(id)}
 stage.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${v.yt}?autoplay=1&rel=0" title="${v.title}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
 modal.hidden=false;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('video-open');document.getElementById('videoClose')?.focus();
}
function startVideoPractice(id){
 const v=MON_VIDEOS.find(x=>x.id===id);if(!v)return;const vs=videoLearningState();vs.practice[id]=(vs.practice[id]||0)+1;vs.last={id,at:Date.now(),practiced:true};save();closeVideo();
 const route={listen:'pronunciation',speak:'speaking',read:'reading',write:'writing',course:'practice'}[v.cat]||'practice';go(route);
}
function closeVideo(){const modal=document.getElementById('videoModal'),stage=document.getElementById('videoStage');if(stage)stage.innerHTML='';modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true');if(modal)modal.hidden=true;document.body.classList.remove('video-open')}
(function(){renderVideos();renderVideoRecommendation();document.getElementById('videoClose')?.addEventListener('click',closeVideo);document.getElementById('videoModal')?.addEventListener('click',e=>{if(e.target.id==='videoModal')closeVideo()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('video-open'))closeVideo()})})();
