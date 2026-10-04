// MON Quick Lesson UI runtime · loaded only when a lesson starts
function exitQuickLesson(){quickRun=null;go('home')}
function setQuickFeedback(title,copy='',ok=null){const f=document.getElementById('quickFeedback');if(!f)return;f.innerHTML=`<b>${title}</b>${copy}`;if(ok===true)f.style.color='#79dca9';else if(ok===false)f.style.color='#ff7c89';else f.style.color='#8f9aaa'}
function renderQuickExercise(){
 if(!quickRun)return;
 const total=quickRun.pack.exercises.length;if(quickRun.step>=total)return renderQuickComplete();
 const e=quickRun.pack.exercises[quickRun.step],main=document.getElementById('quickMain'),prog=document.getElementById('quickProgress'),btn=document.getElementById('quickCheck');
 const progressPct=Math.round(quickRun.step/total*100);prog.style.width=`${progressPct}%`;prog.parentElement?.setAttribute('aria-valuenow',String(progressPct));quickRun.selected=null;quickRun.built=[];quickRun.matchPick=null;quickRun.matches=[];quickRun.typed='';quickRun.hintUsed=false;quickRun.checked=false;
 btn.style.display='';btn.disabled=true;btn.textContent='VERIFICAR';btn.classList.remove('continue');btn.onclick=quickCheck;
 const methodLabel=e.type==='study'?' · estudar':e.method?` · ${({discover:'descobrir',recall:'recuperar',transfer:'transferir',produce:'produzir'}[e.method]||e.method)}`:'';
 setQuickFeedback(e.method?'Gate Loop'+methodLabel:'Escolha uma resposta.');
 let h=`<span class="quick-kicker">${quickRun.pack.title} · ${quickRun.step+1}/${total}${methodLabel}</span>`;
 if(e.type==='study'){setQuickFeedback('Estude primeiro.',' A prática começa depois desta explicação.');h+=`<section class="study-card"><h2 class="quick-question">${e.title}</h2><b class="study-model">${e.mentalModel}</b><p>${e.explanation}</p><div class="study-examples">${e.examples.map(x=>`<article><strong lang="ja">${x.jp}</strong><span>${x.pt}</span><small>${x.note}</small></article>`).join('')}</div><p class="study-contrast">${e.contrast}</p>${e.commonMistakes?.length?`<div class="study-mistakes"><strong>Evite este atalho mental</strong>${e.commonMistakes.map(x=>`<p><del>${x.wrong}</del><span>${x.explanation}</span></p>`).join('')}</div>`:''}</section>`;main.innerHTML=h;document.getElementById('quickEnergy').textContent=state.energy;btn.disabled=false;btn.textContent='COMEÇAR A PRÁTICA';btn.classList.add('continue');btn.onclick=quickNext;return}
 if(e._story){
   h+=`<aside class="story-memory"><div class="story-memory-top"><span>${e._story.arc}</span><b>${e._story.place}</b></div><div class="story-memory-character"><strong>${e._story.character}</strong><small>${e._story.role}</small></div><p>${e._story.scenePt}</p><em lang="ja">${e._story.sceneJp}</em><div class="story-memory-tags">${(e._story.reuses||[]).map(x=>`<span>${x}</span>`).join('')}</div></aside>`;
 }
 h+=`<h2 class="quick-question">${e.prompt}</h2>`;
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
   }else if(e.type==='openResponse'){
     h+=`<div class="roleplay-scene"><span>interlocutor</span><b>${e.npc}</b><p>${e.npcPt||''}</p></div><textarea id="quickTyped" class="quick-typed quick-open" lang="ja" rows="4" spellcheck="false" placeholder="responda em japonês com suas próprias palavras…" oninput="quickTypedInput(this.value)"></textarea><div class="quick-open-actions"><button class="quick-option" onclick="quickOpenSpeech(this)">● ditar resposta</button><button class="method-reveal" onclick="quickRevealModel()">ver modelo depois da tentativa</button></div><div id="roleplayModel" class="roleplay-model"></div><p class="quick-helper">O checkpoint procura intenção e elementos essenciais. Não exige a frase-modelo exata.</p>`;
   }else if(e.type==='roleplay'){
     h+=`<div class="roleplay-scene"><span>店員 / interlocutor</span><b>${e.npc}</b><p>${e.npcPt||''}</p></div>`;
     h+=`<div class="quick-options"><button class="quick-option" onclick="quickSpeech(this)">● Responder com microfone</button><button class="quick-option" onclick="quickRoleplayAttempt(this)">Respondi em voz alta</button></div><button class="method-reveal" onclick="quickRevealModel()">preciso de uma pista</button><div id="roleplayModel" class="roleplay-model"></div>`;
   }
 }
 main.innerHTML=h;document.getElementById('quickEnergy').textContent=state.energy;
}function quickOptions(options){return `<div class="quick-options">${options.map((o,i)=>`<button class="quick-option" data-qopt="${i}" onclick="quickSelect(${i},this)"><span class="quick-key" aria-hidden="true">${i+1}</span><span>${o}</span></button>`).join('')}</div>`}
function quickSelect(i,b){if(quickRun.checked)return;document.querySelectorAll('[data-qopt]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');quickRun.selected=i;document.getElementById('quickCheck').disabled=false}
function quickTypedInput(value){if(!quickRun||quickRun.checked)return;quickRun.typed=value;document.getElementById('quickCheck').disabled=!value.trim()}
function quickRoleplayAttempt(b){document.querySelectorAll('.quick-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');quickRun.selected=1;document.getElementById('quickCheck').disabled=false}
function evaluateOpenProduction(text,assessment={}){
 const normalized=normalizeJP(String(text||'')),groups=assessment.groups||[],labels=assessment.labels||[];
 const hits=groups.map(g=>(g||[]).some(t=>normalized.includes(normalizeJP(t)))),score=groups.length?hits.filter(Boolean).length/groups.length:0,min=Number(assessment.min||.66);
 return {ok:score>=min,score:Math.round(score*100),hits,missing:labels.filter((_,i)=>!hits[i]),covered:labels.filter((_,i)=>hits[i])};
}
function quickOpenSpeech(b){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('Ditado por voz indisponível neste navegador');return}const r=new SR();r.lang='ja-JP';r.interimResults=false;r.maxAlternatives=1;b.textContent='● ouvindo…';r.onresult=x=>{const txt=x.results[0][0].transcript,input=document.getElementById('quickTyped');if(input){input.value=txt;quickTypedInput(txt)}b.textContent='● resposta capturada'};r.onend=()=>{if(b.textContent==='● ouvindo…')b.textContent='● ditar resposta'};r.start()}
function quickRevealModel(){const e=quickRun?.pack.exercises[quickRun.step],box=document.getElementById('roleplayModel');if(!e||!box)return;box.innerHTML=`<b>${e.target}</b><span>${e.pt||''}</span>`;box.classList.add('show');quickRun.hintUsed=true}
function wordTap(i,b){if(quickRun.checked||b.classList.contains('used'))return;b.classList.add('used');quickRun.built.push(i);const e=quickRun.pack.exercises[quickRun.step],w=document.getElementById('wordBuilt');w.innerHTML=quickRun.built.map((idx,pos)=>`<button class="word-token" onclick="wordUntap(${pos})">${e.tokens[idx]}</button>`).join('');document.getElementById('quickCheck').disabled=quickRun.built.length===0}
function wordUntap(pos){if(quickRun.checked)return;const idx=quickRun.built.splice(pos,1)[0],e=quickRun.pack.exercises[quickRun.step];document.querySelector(`[data-wb="${idx}"]`)?.classList.remove('used');const w=document.getElementById('wordBuilt');w.innerHTML=quickRun.built.length?quickRun.built.map((j,p)=>`<button class="word-token" onclick="wordUntap(${p})">${e.tokens[j]}</button>`).join(''):'<span style="color:#607083;font-size:9px">toque nos blocos abaixo</span>';document.getElementById('quickCheck').disabled=quickRun.built.length===0}
function matchTap(b){if(quickRun.checked||b.classList.contains('matched'))return;if(!quickRun.matchPick){quickRun.matchPick=b;b.classList.add('pick');return}const a=quickRun.matchPick;if(a===b)return;if(a.dataset.mid===b.dataset.mid&&a.dataset.side!==b.dataset.side){a.classList.remove('pick');a.classList.add('matched');b.classList.add('matched');quickRun.matches.push(a.dataset.mid);quickRun.matchPick=null;if(quickRun.matches.length===quickRun.pack.exercises[quickRun.step].pairs.length){quickRun.selected=1;document.getElementById('quickCheck').disabled=false;setQuickFeedback('Pares completos.',' Verifique para continuar.',true)}}else{a.classList.remove('pick');a.classList.add('bad');b.classList.add('bad');quickRun.matchPick=null;energyTick(false);setQuickFeedback('Esses dois não formam par.',' Tente de novo.',false);setTimeout(()=>{a.classList.remove('bad');b.classList.remove('bad')},350)}}
function quickShadow(b){document.querySelectorAll('.quick-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');quickRun.selected=1;document.getElementById('quickCheck').disabled=false}
function quickSpeech(b){const e=quickRun.pack.exercises[quickRun.step],SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast('Microfone indisponível; use shadowing');return}const r=new SR();r.lang='ja-JP';r.interimResults=false;r.maxAlternatives=1;b.textContent='● ouvindo…';r.onresult=x=>{const txt=x.results[0][0].transcript,sc=similarity(txt,e.target);quickRun.selected=sc>=55?1:0;b.textContent=`Reconhecido: ${txt} · ${sc}%`;document.getElementById('quickCheck').disabled=false};r.onend=()=>{if(b.textContent==='● ouvindo…')b.textContent='● Usar microfone'};r.start()}
function energyTick(correct){if(correct)quickRun.streak=(quickRun.streak||0)+1;else{state.energy=Math.max(0,(state.energy||0)-1);quickRun.streak=0}document.getElementById('quickEnergy').textContent=state.energy}
function quickCheck(){
 if(!quickRun||quickRun.checked)return;
 const e=quickRun.pack.exercises[quickRun.step];let ok=false,chosen='',detail='';
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
 }else if(e.type==='openResponse'){
   chosen=(quickRun.typed||'').trim();const result=evaluateOpenProduction(chosen,e.assessment);ok=result.ok;detail=`<span class="open-assessment"><strong>${result.score}% dos elementos funcionais</strong>${result.covered.length?`Cobriu: ${result.covered.join(' · ')}.`:''}${result.missing.length?` Falta: ${result.missing.join(' · ')}.`:''}</span>`;quickRun.openResult=result;if(!ok)recordProductionGaps(e,result);else if(e._openRetry)recoverProductionGaps(e);const input=document.getElementById('quickTyped');if(input){input.disabled=true;input.classList.add(ok?'correct':'wrong')}
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
 if(e.type==='openResponse'&&!ok&&!e._openRetry){const repair=buildOpenRemediation(e,quickRun.openResult||{});if(repair.length)quickRun.pack.exercises.splice(quickRun.step+1,0,...repair)}
 if(!quickRun.practiceOnly)energyTick(ok);
 const bridge=e.bridge?`<span class="feedback-bridge"><strong>Lente MON</strong>${e.bridge}</span>`:'';
 setQuickFeedback(ok?(e.type==='openResponse'?(e._openRetry?'Intenção recuperada.':'Intenção preservada.'):e._openRepair?'Lacuna reparada.':e._remediation?'Erro recuperado!':e.method?'Recuperação válida.':'Correto!'):(e.type==='openResponse'&&!e._openRetry?'Resposta incompleta. O MON vai treinar a lacuna e trazer esta situação de volta.':e.type==='openResponse'?'Retry ainda incompleto.':'Boa correção.'),(e.why||'')+detail+bridge,ok);
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
     const node=quickRun.node;if(node.day&&node.day<=24){state.foundationDay=Math.max(state.foundationDay||1,Math.min(SHELL_FOUNDATION_TOTAL,node.day+1));if(node.day>=24)state.foundationComplete=true}else if(node.day>24){state.foundationComplete=true;state.day=Math.max(state.day||1,node.day-24)}
   }
 }
 if(!practice&&quickRun.pack?.narrative&&typeof recordNarrativeEpisode==='function')recordNarrativeEpisode(quickRun.pack,acc,{resolved:!outOfEnergy&&decision.action==='advance'});
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

let __lessonKeyboardBound=false;
function bindLessonKeyboard(){
 if(__lessonKeyboardBound)return;__lessonKeyboardBound=true;
 document.addEventListener('keydown',e=>{
   if(!document.body.classList.contains('quick-focus'))return;
   if(e.target?.matches?.('input,textarea,[contenteditable="true"]'))return;
   if(/^[1-4]$/.test(e.key)){
     const b=document.querySelector(`[data-qopt="${Number(e.key)-1}"]:not(:disabled)`);
     if(b){e.preventDefault();b.click()}
   }else if(e.key==='Enter'){
     const b=document.getElementById('quickCheck');
     if(b&&!b.disabled&&b.offsetParent!==null){e.preventDefault();b.click()}
   }
 });
}
bindLessonKeyboard();
