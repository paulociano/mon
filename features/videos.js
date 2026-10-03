// MON Video Library · external players load only after user action
const MON_VIDEOS=[
 {id:'irodori-a1',yt:'GL9mCFgaAGM',cat:'course',jp:'入門',title:'Irodori Starter A1 em ação',desc:'Veja o fluxo de atividades do nível inicial e use o vídeo para entender como ouvir, responder e reutilizar linguagem em contexto.',source:'Japan Foundation · Irodori',tag:'curso A1'},
 {id:'listening',yt:'ArOfXbCC-WE',cat:'listen',jp:'聞',title:'Como trabalhar listening',desc:'Observe como uma atividade de escuta é construída. Ouça primeiro pela intenção e só depois pelos detalhes.',source:'Japan Foundation · Irodori',tag:'escuta'},
 {id:'speaking',yt:'xcTI2rPN_BE',cat:'speak',jp:'話',title:'Como trabalhar speaking',desc:'Apoio para entender a lógica de produção oral: contexto, tentativa, feedback e nova tentativa.',source:'Japan Foundation · Irodori',tag:'fala'},
 {id:'reading',yt:'EDCbKMNalVc',cat:'read',jp:'読',title:'Como trabalhar leitura',desc:'Use como metaguia para localizar pistas, prever sentido e evitar traduzir cada palavra antes de compreender o todo.',source:'Japan Foundation · Irodori',tag:'leitura'},
 {id:'writing',yt:'jcGWIWgOmWw',cat:'write',jp:'書',title:'Como trabalhar escrita',desc:'Veja como escrita pode nascer de uma tarefa funcional, em vez de apenas copiar caracteres isolados.',source:'Japan Foundation · Irodori',tag:'escrita'}
];
let videoFilter='all';
function renderVideos(){
 const host=document.getElementById('videoGrid');if(!host)return;
 const rows=videoFilter==='all'?MON_VIDEOS:MON_VIDEOS.filter(v=>v.cat===videoFilter);
 host.innerHTML=rows.map(v=>`<button class="video-card" onclick="openVideo('${v.id}')" aria-label="Assistir ${v.title}">
   <div class="video-thumb"><img loading="lazy" decoding="async" src="https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg" alt=""><span class="video-play">▶</span><em>${v.jp}</em></div>
   <div class="video-body"><div class="video-meta"><span>${v.tag}</span><small>externo · internet</small></div><h3>${v.title}</h3><p>${v.desc}</p><strong>${v.source}</strong></div>
 </button>`).join('');
}
function setVideoFilter(cat,btn){videoFilter=cat;document.querySelectorAll('[data-video-filter]').forEach(x=>x.classList.toggle('active',x===btn));renderVideos()}
function openVideo(id){
 const v=MON_VIDEOS.find(x=>x.id===id);if(!v)return;
 const modal=document.getElementById('videoModal'),stage=document.getElementById('videoStage');
 document.getElementById('videoModalTitle').textContent=v.title;document.getElementById('videoModalCopy').textContent=v.desc;
 stage.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${v.yt}?autoplay=1&rel=0" title="${v.title}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
 modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('video-open');document.getElementById('videoClose')?.focus();
}
function closeVideo(){const modal=document.getElementById('videoModal'),stage=document.getElementById('videoStage');if(stage)stage.innerHTML='';modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true');document.body.classList.remove('video-open')}
(function(){renderVideos();document.getElementById('videoClose')?.addEventListener('click',closeVideo);document.getElementById('videoModal')?.addEventListener('click',e=>{if(e.target.id==='videoModal')closeVideo()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('video-open'))closeVideo()})})();
