function renderGrammarStudyStep(e,{main,btn,h}){
 setQuickFeedback('Estude primeiro.',' A prática começa depois desta explicação.');
 h+=`<section class="study-card">
   <span class="study-label">gramática aplicada · 文法</span>
   <h2 class="quick-question">${e.title}</h2>
   <div class="study-mental-model"><span>modelo mental</span><p>${e.mentalModel}</p></div>
   <div class="study-explanation"><span>como funciona</span><p>${e.explanation}</p></div>
   <div class="study-examples">${(e.examples||[]).map(x=>`<article class="study-example"><b lang="ja">${x.jp}</b><span>${x.pt}</span><p>${x.note}</p></article>`).join('')}</div>
   <div class="study-contrast"><span>compare / evite</span><p>${e.contrast||''}</p></div>
   ${e.realWorldUse?`<div class="study-real"><span>na vida real</span><p>${e.realWorldUse}</p></div>`:''}
 </section>`;
 main.innerHTML=h;
 document.getElementById('quickEnergy').textContent=state.energy;
 btn.disabled=false;
 btn.textContent='COMEÇAR A PRÁTICA';
 btn.classList.add('continue');
 btn.onclick=quickNext;
}
