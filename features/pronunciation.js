// MON Listening & Pronunciation Lab · lazy
let pronTrackId='mora',pronShadowIndex=0,pronRecognition=null;

function pronState(){
 state.pronunciation={sessions:0,plays:0,shadowAttempts:0,selfRatings:[],tracks:{},...(state.pronunciation||{})};
 const ps=state.pronunciation;
 if(ps.lastTranscript&&Object.prototype.hasOwnProperty.call(ps.lastTranscript,'text')){delete ps.lastTranscript.text;if(typeof save==='function')save()}
 return ps;
}
function pronSpeak(text,rate=.86){
 if(!('speechSynthesis'in window)){toast('Áudio TTS indisponível neste navegador');return}
 speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ja-JP';u.rate=rate;u.pitch=1;
 const voices=speechSynthesis.getVoices(),ja=voices.find(v=>String(v.lang).toLowerCase().startsWith('ja'));if(!ja){toast('Voz japonesa indisponível. Ative uma voz japonesa no dispositivo ou pratique com o texto.');return}u.voice=ja;u.onerror=()=>toast('Não foi possível reproduzir o áudio. Você pode continuar com o texto.');
 speechSynthesis.speak(u);const ps=pronState();ps.plays++;save();
}
function pronMoras(moras=[]){return `<div class="mora-row">${moras.map((m,i)=>`<span><i>${i+1}</i><b lang="ja">${m}</b></span>`).join('')}</div>`}
function renderPronunciation(){
 const host=document.getElementById('pronLab');if(!host)return;
 const track=pronunciationTrack(pronTrackId),ps=pronState(),shadow=pronunciationShadowing[pronShadowIndex%pronunciationShadowing.length];
 host.innerHTML=`
 <header class="pron-hero"><div><span class="eyebrow">Listening & Pronunciation Lab · 音</span><h2>Ouça o tempo antes de perseguir o sotaque.</h2><p>Treine contraste, mora, duração e produção. O objetivo é ficar compreensível e reconhecer padrões reais, não imitar uma voz perfeita.</p></div><div class="pron-summary"><b>${ps.shadowAttempts||0}</b><span>shadowings</span><b>${ps.plays||0}</b><span>escutas</span></div></header>
 <div class="pron-layout"><aside class="pron-tabs">${pronunciationTracks.map(t=>`<button class="${t.id===track.id?'active':''}" onclick="setPronTrack('${t.id}')"><em>${t.symbol}</em><span>${t.title}</span></button>`).join('')}</aside>
 <main class="pron-main">
  <section class="pron-concept"><span class="eyebrow">modelo mental</span><h3>${track.title}</h3><p>${track.pt}</p><div class="pron-tip">PT → JP · ${track.tip}</div></section>
  <section class="pron-items">${track.items.map((x,i)=>`<article class="pron-item"><div class="pron-item-head"><div><span>exemplo ${i+1}</span><h4 lang="ja">${x.jp}${x.compare?` <small>↔</small> ${x.compare}`:''}</h4><p>${x.pt}</p></div><div class="pron-audio"><button onclick="pronSpeak('${x.jp}',.72)">0.72×</button><button onclick="pronSpeak('${x.jp}',.92)">▶ normal</button>${x.compare?`<button onclick="pronSpeak('${x.compare}',.8)">▶ contraste</button>`:''}</div></div>${pronMoras(x.moras)}${x.compareMoras?pronMoras(x.compareMoras):''}<strong>${x.focus}</strong></article>`).join('')}</section>
  <section class="shadow-lab"><div class="shadow-copy"><span class="eyebrow">shadowing guiado · Can-do: ${shadow.canDo||shadow.goal}</span><h3>${shadow.goal}</h3><p>${shadow.context?`Situação: ${shadow.context}. `:'' }1. Ouça sem ler. 2. Ouça vendo os blocos. 3. Repita meio passo atrás do áudio. 4. Faça uma tentativa e compare apenas a transcrição.</p><div class="shadow-chunks">${shadow.chunks.map(c=>`<span lang="ja">${c}</span>`).join('')}</div><div class="shadow-pt">${shadow.pt}</div></div><div class="shadow-actions"><button class="primary" onclick="pronSpeak('${shadow.jp}',.78)">▶ ouvir devagar</button><button onclick="pronSpeak('${shadow.jp}',.98)">▶ ouvir natural</button><button id="pronMic" aria-describedby="pronMicPolicy" aria-pressed="false" onclick="pronRecord()">● falar</button><button onclick="nextShadow()">próxima frase →</button></div><p id="pronMicPolicy" class="pron-mic-policy">O microfone só é solicitado quando você ativa “falar”. O MON não grava áudio bruto. A transcrição aparece apenas nesta tela e não é salva nem sincronizada; o reconhecimento é fornecido pelo navegador e pode depender dos serviços da plataforma.</p><div id="pronTranscript" class="pron-transcript" role="status" aria-live="polite">O reconhecimento textual aparecerá aqui. Ele serve como pista de inteligibilidade, não como nota fonética.</div></section>
  <section class="pron-self"><span class="eyebrow">autoavaliação depois da tentativa</span><h3>Sem ouvir de novo: o que você percebeu?</h3><div><button onclick="ratePron(1)">perdi o ritmo</button><button onclick="ratePron(2)">quase estável</button><button onclick="ratePron(3)">ritmo claro</button></div><p id="pronSelfFeedback">A autoavaliação é parte do treino: compare duração, pausas e blocos, não “sotaque perfeito”.</p></section>
 </main></div>`;
}
function setPronTrack(id){pronTrackId=id;const ps=pronState();ps.tracks[id]=(ps.tracks[id]||0)+1;save();renderPronunciation()}
function nextShadow(){pronShadowIndex=(pronShadowIndex+1)%pronunciationShadowing.length;renderPronunciation()}
function pronRecord(){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition,box=document.getElementById('pronTranscript'),btn=document.getElementById('pronMic');
 if(!SR){box.dataset.state='error';box.textContent='Reconhecimento de voz indisponível. Faça shadowing sem score: ouça, repita e compare ritmo/duração.';return}
 if(pronRecognition)try{pronRecognition.stop()}catch{}
 const target=pronunciationShadowing[pronShadowIndex%pronunciationShadowing.length].jp;
 const r=new SR();pronRecognition=r;r.lang='ja-JP';r.interimResults=false;r.maxAlternatives=1;if(btn){btn.textContent='● ouvindo…';btn.setAttribute('aria-pressed','true')};
 r.onresult=e=>{const txt=e.results[0][0].transcript,match=typeof similarity==='function'?similarity(txt,target):0;box.dataset.state=match>=70?'success':'';box.innerHTML=`<b>Reconhecido:</b> <span lang="ja">${escapeHtml(txt)}</span><br><small>Correspondência textual aproximada: ${match}%. Não é avaliação fonética.</small>`;const ps=pronState();ps.shadowAttempts++;ps.lastTranscript={target,match,at:Date.now()};save();};
 r.onerror=e=>{box.dataset.state='error';box.textContent=e?.error==='not-allowed'?'Acesso ao microfone não foi permitido. Você pode continuar o shadowing sem microfone ou liberar a permissão nas configurações do navegador.':'Não consegui reconhecer esta tentativa. Isso não significa que sua pronúncia esteja errada; tente novamente em ambiente mais silencioso.'};
 r.onend=()=>{pronRecognition=null;if(btn){btn.textContent='● falar';btn.setAttribute('aria-pressed','false')}};r.start();
}
function ratePron(rating){const ps=pronState();ps.selfRatings.unshift({rating,track:pronTrackId,at:Date.now()});ps.selfRatings=ps.selfRatings.slice(0,30);save();const f=document.getElementById('pronSelfFeedback');if(f){f.dataset.state=rating===3?'success':'';f.textContent=rating===1?'Ótimo diagnóstico. Volte ao áudio lento e marque cada mora com o dedo.':rating===2?'Boa base. Faça mais uma repetição sem ler e preserve as pausas.':'Bom. Agora teste a mesma frase em velocidade natural sem acelerar as moras longas.'}}
pronState();renderPronunciation();
