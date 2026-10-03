// MON Survival Missions 2.0
let missionRun=null;
function missionState(){state.survivalMissions={completed:{},attempts:{},repairs:0,...(state.survivalMissions||{})};return state.survivalMissions}
function startMissionV2(id){const m=survivalMissionById(id),s=missionState();s.attempts[id]=(s.attempts[id]||0)+1;missionRun={id,step:0,repaired:false};save();renderMissionV2();document.getElementById('missionRunner')?.scrollIntoView({behavior:'smooth',block:'start'})}
function renderMissionV2(){
 const host=document.getElementById('missionRunner');if(!host)return;
 if(!missionRun){host.innerHTML='<div class="mission-empty"><span class="eyebrow">Survival Missions 2.0</span><h3>Escolha uma missão para começar.</h3><p>Cada missão exige entender, responder, reparar se necessário e concluir uma tarefa observável.</p></div>';return}
 const m=survivalMissionById(missionRun.id),repair=missionRepairPhrase(),step=missionRun.step;
 const lines=[
  {npc:m.npc,pt:m.npcPt,goal:'entenda a intenção e responda',target:m.reply,targetPt:m.replyPt},
  {npc:m.confirm,pt:m.confirmPt,goal:'confirme a nova informação',target:m.final,targetPt:m.finalPt}
 ];
 if(step>=2){const done=missionState().completed[m.id];host.innerHTML=`<div class="mission-complete"><span class="eyebrow">missão concluída</span><div class="mission-seal">${m.symbol}</div><h3>${m.title}</h3><p>Objetivo observável: ${m.objective}.</p><div class="mission-result"><b>${done?.repairs||0}</b><span>reparos usados</span><b>${done?.attempts||1}</b><span>tentativas</span></div><button class="primary" onclick="missionRun=null;renderMissionV2()">escolher outra missão →</button></div>`;return}
 const l=lines[step];
 host.innerHTML=`<div class="mission-run"><div class="mission-run-head"><div><span class="eyebrow">etapa ${step+1}/2 · ${m.level}</span><h3>${m.title}</h3><p>${m.context}</p></div><div class="mission-goal"><span>objetivo</span><b>${m.objective}</b></div></div><div class="mission-npc"><span>interlocutor</span><b lang="ja">${l.npc}</b><p>${l.pt}</p><button onclick="speak('${l.npc.replaceAll("'","\\'")}')">▶ ouvir</button></div><div class="mission-choice-title">${l.goal}</div><div class="mission-choices"><button onclick="answerMissionV2('target')"><b lang="ja">${l.target}</b><span>${l.targetPt}</span></button><button onclick="answerMissionV2('repair')" class="repair"><b lang="ja">${repair.jp}</b><span>${repair.pt}</span></button><button onclick="answerMissionV2('wrong')" class="wrong"><b lang="ja">${m.wrong}</b><span>frase possível, mas inadequada aqui</span></button></div><div id="missionFeedback" class="mission-feedback">Escolha pela função comunicativa, não apenas pelas palavras reconhecidas.</div></div>`;
}
function answerMissionV2(choice){
 const m=survivalMissionById(missionRun.id),s=missionState(),f=document.getElementById('missionFeedback');
 if(choice==='repair'){missionRun.repaired=true;s.repairs++;save();f.innerHTML='<b>Bom reparo.</b> Pedir repetição mantém a conversa viva. Agora ouça novamente e escolha a resposta que resolve a tarefa.';speak(missionRun.step===0?m.npc:m.confirm);return}
 if(choice==='wrong'){f.innerHTML='<b>Frase válida, função errada.</b> Pergunte: o que esta etapa precisa resolver?';return}
 missionRun.step++;
 if(missionRun.step>=2){s.completed[m.id]={at:Date.now(),repairs:missionRun.repaired?1:0,attempts:s.attempts[m.id]||1};state.xp+=20;save();toast('Missão concluída • +20 XP')}
 renderMissionV2();
}
function renderMissionGridV2(){
 const grid=document.getElementById('missionGrid');if(!grid)return;const s=missionState();
 grid.innerHTML=survivalMissionsV2.map(m=>`<button class="mission mission-v2 ${s.completed[m.id]?'done':''}" onclick="startMissionV2('${m.id}')"><div class="mission-art"></div><div class="mission-body"><div class="symbol">${m.symbol}</div><b>${m.title}</b><small>${m.objective}</small></div><span class="level">${s.completed[m.id]?'concluída':m.level}</span></button>`).join('');
}
missionState();renderMissionGridV2();renderMissionV2();
