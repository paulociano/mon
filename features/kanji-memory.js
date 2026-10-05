// MON Kanji Memory Lab 2.0
let kanjiLabMode='family';
function kanjiLabState(){state.kanjiLab={attempts:0,correct:0,modes:{},last:null,...(state.kanjiLab||{})};return state.kanjiLab}
function kmOptions(correct,pool,count=4){const vals=[correct,...pool.filter(x=>x!==correct)].filter((x,i,a)=>a.indexOf(x)===i);return vals.sort(()=>Math.random()-.5).slice(0,count)}
function renderKanjiMemoryLab(){
 const host=document.getElementById('kanjiMemoryLab');if(!host||typeof kanjiMemoryMeta!=='function')return;
 const x=kanjiData[currentKanji],meta=kanjiMemoryMeta(x.k),family=kanjiMemoryFamilyFor(x.k),s=kanjiLabState();
 const tabs=[['family','famílias'],['contrast','contraste'],['meaning','sentido → forma'],['reading','forma → leitura']].map(([id,label])=>`<button class="${kanjiLabMode===id?'active':''}" onclick="setKanjiLabMode('${id}')">${label}</button>`).join('');
 let body='';
 if(kanjiLabMode==='family'){
  body=`<div class="km-family"><div><span class="eyebrow">família visual</span><h4>${family.title}</h4><p>${family.cue}</p></div><div class="km-family-row">${(family.items||[]).filter(k=>kanjiData.some(x=>x.k===k)).map(k=>`<button onclick="selectKanji(${kanjiData.findIndex(x=>x.k===k)})"><b lang="ja">${k}</b><span>${kanjiData.find(x=>x.k===k)?.m||''}</span></button>`).join('')}</div><div class="km-parts"><span>componentes visuais</span>${meta.parts.map(p=>`<b lang="ja">${p}</b>`).join('<i>+</i>')}<small>${meta.cue}</small></div><blockquote>${meta.scene}</blockquote></div>`;
 }else if(kanjiLabMode==='contrast'){
  body=`<div class="km-contrast"><div class="km-contrast-pair"><b lang="ja">${meta.contrast?.[0]||x.k}</b><span>vs</span><b lang="ja">${meta.contrast?.[1]||x.k}</b></div><div><span class="eyebrow">discriminação visual</span><h4>Procure a diferença antes de ler.</h4><p>O alvo é <strong>${x.k}</strong> · ${x.m}. Compare silhueta, componente e posição.</p><button class="secondary" onclick="startKanjiContrast()">testar contraste →</button></div></div><div id="kanjiLabChallenge"></div>`;
 }else if(kanjiLabMode==='meaning'){
  body=`<div class="km-recall-head"><div><span class="eyebrow">recall ativo</span><h4>Qual forma corresponde a “${x.m.toLowerCase()}”?</h4><p>Escolha antes de rever história, leitura ou traços.</p></div><strong>${s.correct}/${s.attempts||0}</strong></div><div class="km-options">${kmOptions(x.k,kanjiData.map(k=>k.k)).map(k=>`<button onclick="answerKanjiMeaning('${k}')"><b lang="ja">${k}</b></button>`).join('')}</div><div id="kanjiLabFeedback" class="km-feedback">Recupere primeiro. Feedback vem depois.</div>`;
 }else{
  const ex=x.ex[0],pool=kanjiData.flatMap(k=>k.ex.map(e=>e[1]));
  body=`<div class="km-recall-head"><div><span class="eyebrow">leitura em contexto</span><h4 lang="ja">${ex[0]}</h4><p>Qual leitura pertence a esta palavra?</p></div><strong>${s.correct}/${s.attempts||0}</strong></div><div class="km-options readings-mode">${kmOptions(ex[1],pool).map(r=>`<button onclick="answerKanjiReading('${String(r).replaceAll("'","\\'")}')"><b lang="ja">${r}</b></button>`).join('')}</div><div id="kanjiLabFeedback" class="km-feedback">${ex[2]}</div>`;
 }
 host.innerHTML=`<section class="km-shell"><div class="km-top"><div><span class="eyebrow">Kanji Memory Lab 2.0 · 記憶</span><h3>${x.k} deixa de ser uma figura isolada.</h3><p>Família, contraste, recuperação e produção trabalham juntos. Os componentes aqui são mnemônicos visuais, não etimologia histórica.</p></div><div class="km-tabs">${tabs}</div></div>${body}</section>`;
}
function setKanjiLabMode(mode){kanjiLabMode=mode;const s=kanjiLabState();s.modes[mode]=(s.modes[mode]||0)+1;save();renderKanjiMemoryLab()}
function recordKanjiLab(ok,mode){const s=kanjiLabState();s.attempts++;if(ok)s.correct++;s.last={k:kanjiData[currentKanji].k,mode,ok,at:Date.now()};save();gradeKanji(kanjiData[currentKanji].k,ok?'good':'hard',true)}
function answerKanjiMeaning(k){const x=kanjiData[currentKanji],ok=k===x.k;recordKanjiLab(ok,'meaning');const f=document.getElementById('kanjiLabFeedback');f.dataset.state=ok?'success':'error';f.innerHTML=ok?`<b>Correto.</b> Agora escreva ${x.k} sem guia.`:`<b>Não ainda.</b> Compare ${k} com ${x.k} e tente desenhar ${x.k} de memória.`}
function answerKanjiReading(r){const x=kanjiData[currentKanji],ex=x.ex[0],ok=r===ex[1];recordKanjiLab(ok,'reading');const f=document.getElementById('kanjiLabFeedback');f.dataset.state=ok?'success':'error';f.innerHTML=ok?`<b>Correto.</b> ${ex[0]} → ${ex[1]} · ${ex[2]}`:`<b>Tente novamente.</b> Recupere a leitura dentro da palavra ${ex[0]}.`}
function startKanjiContrast(){const x=kanjiData[currentKanji],m=kanjiMemoryMeta(x.k),opts=[...new Set([x.k,...(m.contrast||[])])].slice(0,3);document.getElementById('kanjiLabChallenge').innerHTML=`<div class="km-contrast-test"><span>toque no caractere “${x.m}”</span><div>${opts.map(k=>`<button onclick="answerKanjiContrast('${k}')"><b lang="ja">${k}</b></button>`).join('')}</div></div>`}
function answerKanjiContrast(k){const x=kanjiData[currentKanji],ok=k===x.k;recordKanjiLab(ok,'contrast');document.getElementById('kanjiLabChallenge').innerHTML=`<div class="km-feedback" data-state="${ok?'success':'error'}">${ok?'Boa discriminação.':'Observe a estrutura e tente novamente.'}</div>`}
kanjiLabState();

// UI orchestration lives in features/kanji.js; this file provides memory exercise engines.
