// MON Survival Missions 3.0
let missionRun=null;
function missionState(){state.survivalMissions={completed:{},attempts:{},repairs:0,...(state.survivalMissions||{})};return state.survivalMissions}
function missionAutonomyScore(run=missionRun){if(!run)return 0;return Math.max(0,100-(run.wrong||0)*18-Math.max(0,(run.repairs||0)-1)*8)}
function missionAutonomyLabel(score){return score>=90?'autônomo':score>=75?'funcional':'em construção'}
function missionAutonomySummary(){
 const completed=Object.values(missionState().completed||{}),scores=completed.map(x=>Number(x.autonomy||0)).filter(Number.isFinite);
 return {completed:completed.length,average:scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0,strong:scores.filter(x=>x>=90).length,total:survivalMissionsV2.length};
}
function startMissionV2(id){const m=survivalMissionById(id),s=missionState();s.attempts[id]=(s.attempts[id]||0)+1;missionRun={id,step:0,repairs:0,wrong:0,strategies:[],supportShown:false,repairNote:''};save();renderMissionV2();document.getElementById('missionRunner')?.scrollIntoView({behavior:'smooth',block:'start'})}
function missionTurn(m,step){return step===0?{npc:m.npc,pt:m.npcPt,goal:'resolva a intenção do primeiro turno',target:m.reply,targetPt:m.replyPt,alt:m.altReply,altPt:m.altReplyPt}:{npc:m.confirm,pt:m.confirmPt,goal:'confirme e feche a tarefa',target:m.final,targetPt:m.finalPt,alt:m.altFinal,altPt:m.altFinalPt}}
function renderMissionV2(){
 const host=document.getElementById('missionRunner');if(!host)return;
 if(!missionRun){const a=missionAutonomySummary();host.innerHTML=`<div class="mission-empty"><span class="eyebrow">Survival Missions 3.0 · 自立</span><h3>Resolva a situação, não uma alternativa de múltipla escolha.</h3><p>A tradução não aparece de saída. Você pode responder diretamente, reformular ou usar estratégias de reparo quando precisar.</p><div class="mission-readiness"><span><b>${a.completed}/${a.total}</b> missões concluídas</span><span><b>${a.average||'—'}${a.average?'%':''}</b> autonomia média</span><span><b>${a.strong}</b> resolvidas com alta autonomia</span></div></div>`;return}
 const m=survivalMissionById(missionRun.id),repairs=missionRepairOptions(),step=missionRun.step;
 if(step>=2){const done=missionState().completed[m.id],a=missionAutonomySummary();host.innerHTML=`<div class="mission-complete"><span class="eyebrow">missão concluída · ${done.label}</span><div class="mission-seal">${m.symbol}</div><h3>${m.title}</h3><p>Você resolveu o objetivo observável: ${m.objective}.</p><div class="mission-result"><div><b>${done.autonomy}%</b><span>autonomia</span></div><div><b>${done.repairs}</b><span>reparos</span></div><div><b>${done.wrong}</b><span>desvios</span></div></div><p class="mission-bridge">${a.strong>=6?'Seu repertório já mostra transferência consistente em várias situações. A ponte para tarefas de autonomia do N4 está ficando concreta.':'Continue variando situações. O próximo salto vem quando você consegue resolver contextos diferentes sem depender sempre do mesmo tipo de apoio.'}</p><button class="primary" onclick="missionRun=null;renderMissionV2()">escolher outra missão →</button></div>`;return}
 const l=missionTurn(m,step);
 host.innerHTML=`<div class="mission-run"><div class="mission-run-head"><div><span class="eyebrow">etapa ${step+1}/2 · ${m.level}</span><h3>${m.title}</h3><p>${m.context}</p></div><div class="mission-goal"><span>objetivo</span><b>${m.objective}</b></div></div><div class="mission-npc"><span>interlocutor</span><b lang="ja">${l.npc}</b>${missionRun.supportShown?`<p class="mission-support">${l.pt}</p>`:'<p class="mission-support muted">Sem tradução automática. Repare a conversa se precisar.</p>'}<button onclick="speak('${l.npc.replaceAll("'","\\'")}')">▶ ouvir</button></div>${missionRun.repairNote?`<div class="mission-repair-note">${missionRun.repairNote}</div>`:''}<div class="mission-choice-title">${l.goal}</div><div class="mission-choices"><button onclick="answerMissionV2('target')"><b lang="ja">${l.target}</b><span>${l.targetPt}</span></button><button onclick="answerMissionV2('alt')" class="alternate"><b lang="ja">${l.alt}</b><span>outra forma válida · ${l.altPt}</span></button>${repairs.map(r=>`<button onclick="answerMissionV2('repair:${r.id}')" class="repair"><b lang="ja">${r.jp}</b><span>${r.label}</span></button>`).join('')}<button onclick="answerMissionV2('wrong')" class="wrong"><b lang="ja">${m.wrong}</b><span>frase possível, mas inadequada aqui</span></button></div><div id="missionFeedback" class="mission-feedback">Escolha pela função comunicativa. Não existe prêmio por fingir que entendeu.</div></div>`;
}
function answerMissionV2(choice){
 const m=survivalMissionById(missionRun.id),s=missionState(),f=document.getElementById('missionFeedback');
 if(choice.startsWith('repair:')){
  const kind=choice.split(':')[1];missionRun.repairs++;s.repairs++;missionRun.strategies.push(kind);
  if(kind==='meaning'){missionRun.supportShown=true;missionRun.repairNote='<b>Esclarecimento usado.</b> O sentido em português apareceu como apoio. Agora resolva a tarefa em japonês.'}
  else{missionRun.repairNote='<b>Repetição pedida.</b> O interlocutor repete o mesmo turno mais devagar. Tente novamente sem mudar de assunto.';speak(missionRun.step===0?m.npc:m.confirm)}
  save();renderMissionV2();return
 }
 if(choice==='wrong'){missionRun.wrong++;f.innerHTML='<b>Frase válida, função errada.</b> Volte ao objetivo desta etapa. Você ainda pode reparar ou tentar outra formulação.';return}
 if(choice!=='target'&&choice!=='alt')return;
 missionRun.strategies.push(choice==='alt'?'reformulate':'direct');missionRun.step++;missionRun.supportShown=false;missionRun.repairNote='';
 if(missionRun.step>=2){const autonomy=missionAutonomyScore(missionRun),previous=s.completed[m.id],best=Math.max(autonomy,Number(previous?.autonomy||0));s.completed[m.id]={at:Date.now(),repairs:missionRun.repairs,wrong:missionRun.wrong,strategies:[...missionRun.strategies],attempts:s.attempts[m.id]||1,autonomy:best,label:missionAutonomyLabel(best)};state.xp+=20;save();toast('Missão concluída · autonomia '+autonomy+'% · +20 XP')}
 renderMissionV2();
}
function renderMissionGridV2(){
 const grid=document.getElementById('missionGrid');if(!grid)return;const s=missionState();
 grid.innerHTML=survivalMissionsV2.map(m=>{const done=s.completed[m.id];return `<button class="mission mission-v2 ${done?'done':''}" onclick="startMissionV2('${m.id}')"><div class="mission-art"></div><div class="mission-body"><div class="symbol">${m.symbol}</div><b>${m.title}</b><small>${m.objective}</small></div><span class="level">${done?done.autonomy+'% · '+done.label:m.level}</span></button>`}).join('');
}
missionState();renderMissionGridV2();renderMissionV2();
