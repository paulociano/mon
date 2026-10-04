// MON adaptive multi-turn mission engine
function missionDialogue(id){return typeof missionDialoguesV4!=='undefined'?missionDialoguesV4[id]||null:null}
function missionCapabilityScore(cap){const x=state.functionalMastery?.[cap];return x?.attempts?Number(x.score||0):null}
function missionPressureCapability(id){
 const d=missionDialogue(id);if(!d)return null;const caps=Object.keys(d.pressure||{}),seen=caps.map(cap=>({cap,score:missionCapabilityScore(cap)})).filter(x=>x.score!==null);
 return seen.length?seen.sort((a,b)=>a.score-b.score)[0].cap:(d.defaultCapability&&d.pressure?.[d.defaultCapability]?d.defaultCapability:caps[0]||null)
}
function adaptiveMissionTurns(id,run=missionRun){
 const d=missionDialogue(id);if(!d)return null;const pressure=d.pressure?.[run?.pressureCapability]||d.pressure?.[d.defaultCapability]||Object.values(d.pressure||{})[0];
 return [...(d.opening||[]),pressure,d.closing].filter(Boolean)
}
function adaptiveMissionTurn(m,run=missionRun){
 const turns=adaptiveMissionTurns(m.id,run);if(!turns)return null;const t={...turns[run.step]};
 if(run.lastChoice==='alt'&&t.npcAlt)t.npc=t.npcAlt;
 return t;
}
function adaptiveMissionTurnCount(m,run=missionRun){return adaptiveMissionTurns(m.id,run)?.length||2}
function adaptiveMissionStart(id,run){const d=missionDialogue(id);if(!d)return run;run.pressureCapability=missionPressureCapability(id);run.multiTurn=true;return run}
function adaptiveMissionRecordTurn(run,choice,turn){
 run.history=run.history||[];run.history.push({step:run.step,choice,capability:turn?.capability||null,at:Date.now()});run.lastChoice=choice;
}
