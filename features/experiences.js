// MON stories, missions and speaking runtime · loaded on demand
function missionOpen(i){const m=missions[i],sc=missionSpeech[i];document.getElementById('npcLine').textContent=sc.npc;document.getElementById('npcPt').textContent=sc.npcPt;document.getElementById('targetSpeech').textContent=sc.target;document.getElementById('targetPt').textContent='“'+sc.pt+'”';document.getElementById('transcript').textContent='Sua transcrição aparecerá aqui. Se o reconhecimento de voz não estiver disponível, use o áudio e faça shadowing.';document.getElementById('speechScore').textContent='0';document.getElementById('scoreRing').style.setProperty('--score',0);toast('Missão aberta: '+m.title);go('speaking')}



const initialChapter=document.getElementById('chapterContent').innerHTML;
document.querySelectorAll('[data-book]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-book]').forEach(b=>b.classList.toggle('active',b===btn));const i=Number(btn.dataset.book);document.getElementById('chapterContent').innerHTML=i===0?initialChapter:bookData[i];if(i===0){const t=document.getElementById('toggleTranslation');if(t)t.onclick=toggleReadingTranslation}}));
function toggleReadingTranslation(e){const p=document.getElementById('readingTranslation');if(!p)return;const show=p.style.display==='none';p.style.display=show?'block':'none';e.target.textContent=show?'ocultar tradução':'mostrar tradução'}
function renderKana(type='hira'){document.getElementById('kanaGrid').innerHTML=kanaSets[type].map(k=>`<button class="kana-key" onclick="speak('${k[0]}')"><b>${k[0]}</b><span>${k[1]}</span></button>`).join('')}
document.querySelectorAll('[data-kana]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-kana]').forEach(x=>x.classList.toggle('active',x===b));renderKana(b.dataset.kana)}));
renderKana();

document.getElementById('toggleTranslation').onclick=toggleReadingTranslation;
document.getElementById('listenTarget').onclick=()=>speak(document.getElementById('targetSpeech').textContent);
document.getElementById('micBtn').onclick=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('Reconhecimento de voz indisponível');document.getElementById('transcript').textContent='Seu navegador não oferece reconhecimento de voz. Use ▶ e faça shadowing.';return}const r=new SR();r.lang='ja-JP';r.interimResults=false;r.maxAlternatives=1;const btn=document.getElementById('micBtn');btn.textContent='● Ouvindo…';r.onresult=e=>{const txt=e.results[0][0].transcript;document.getElementById('transcript').textContent=txt;const sc=similarity(txt,document.getElementById('targetSpeech').textContent);document.getElementById('speechScore').textContent=sc;document.getElementById('scoreRing').style.setProperty('--score',sc);state.speech=Math.max(state.speech,sc);state.xp+=10;save();toast('Resposta registrada • +10 XP')};r.onerror=()=>toast('Não consegui captar a fala');r.onend=()=>btn.textContent='● Falar agora';r.start()};

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
