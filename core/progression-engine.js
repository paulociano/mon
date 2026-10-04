function progressionOptions(correct,pool,count=4){
  const vals=[correct,...pool.filter(x=>x!==correct)].filter((x,i,a)=>a.indexOf(x)===i);
  return vals.slice(0,count);
}
function progressionDecision(node,pack,lessonAccuracy){
  if(!node||Number(node.day||0)<=24||!pack?.unitId)return {action:'advance',reason:'linear-foundation',gaps:[]};
  const unit=coursePackForDay(node.day);if(!unit)return {action:'advance',reason:'unstructured-node',gaps:[]};
  const status=unitMasteryStatus(unit),gaps=unitMasteryGaps(unit,6);
  const accuracyFloor=Math.max(70,(unit.mastery?.minAccuracy||80)-8);
  const ready=status.status==='mastered'&&lessonAccuracy>=accuracyFloor;
  return ready
    ?{action:'advance',reason:'mastery-demonstrated',status,gaps:[]}
    :{action:'reinforce',reason:lessonAccuracy<accuracyFloor?'lesson-accuracy':'mastery-gaps',status,gaps};
}
function exerciseForMasteryGap(gap,unit){
  const [type]=gap.concept.split(':');
  const dimension=gap.dimension;
  if(type==='vocabulary'){
    const key=gap.concept.slice('vocabulary:'.length),v=vocabularyCatalog[key];if(!v)return null;
    const base={_reviewType:'vocabulary',_reviewKey:key,_unitId:unit.id,_masteryRepair:true};
    if(dimension==='recognize')return {...base,type:'choice',prompt:'Reforço: qual é o sentido?',jp:v.jp,options:progressionOptions(v.pt,Object.values(vocabularyCatalog).map(x=>x.pt)),answer:v.pt,why:`${v.jp} · ${v.reading} · ${v.pt}`};
    if(dimension==='listen')return {...base,type:'dictation',method:'recall',prompt:'Reforço de escuta: escreva sem legenda.',audio:v.jp,target:v.jp,accepted:[v.jp,v.reading],why:`${v.jp} · ${v.reading}`};
    if(dimension==='recall')return {...base,type:'recall',method:'recall',prompt:'Reforço sem alternativas.',cue:v.pt,target:v.jp,accepted:[v.jp,v.reading],why:`${v.jp} · ${v.reading} · ${v.pt}`};
    const s=(unit.scenarios||[]).find(x=>x.reply.includes(v.jp))||(unit.scenarios||[])[0];
    if(dimension==='produce'&&s)return {...base,type:'roleplay',method:'produce',prompt:'Use a competência em fala.',npc:s.npc,npcPt:s.pt,target:s.reply,pt:s.replyPt,why:`${s.reply} · ${s.replyPt}`};
    if(s)return {...base,type:'transfer',method:'transfer',prompt:'Transfira para a situação real.',cue:`${s.pt} → ${s.replyPt}`,target:s.reply.replace(/[。！？!?]/g,''),accepted:[s.reply,s.reply.replace(/[。！？!?]/g,'')],why:`${s.reply} · ${s.replyPt}`};
  }
  if(type==='grammar'){
    const id=gap.concept.replace('grammar:P:',''),g=grammarCatalog[id];if(!g)return null;
    const base={_reviewType:'grammar',_reviewKey:'P:'+id,_unitId:unit.id,_masteryRepair:true};
    if(dimension==='recognize')return {...base,type:'choice',prompt:'Reforço: qual função descreve este padrão?',jp:g.form,options:progressionOptions(g.function,Object.values(grammarCatalog).map(x=>x.function)),answer:g.function,why:`${g.form} · ${g.pt}`};
    const s=(unit.scenarios||[])[0];
    if(dimension==='produce'&&s)return {...base,type:'roleplay',method:'produce',prompt:'Use o padrão sem ver a resposta.',npc:s.npc,npcPt:s.pt,target:s.reply,pt:s.replyPt,why:`${g.form} · ${g.pt}`};
    if(s)return {...base,type:'transfer',method:'transfer',prompt:'Aplique o padrão na situação.',cue:s.replyPt,target:s.reply.replace(/[。！？!?]/g,''),accepted:[s.reply,s.reply.replace(/[。！？!?]/g,'')],why:`${g.form} · ${g.pt}`};
  }
  if(type==='unit'){
    const s=(unit.scenarios||[])[0];if(!s)return null;
    if(dimension==='listen')return {type:'listen',method:'transfer',prompt:'Entenda a fala antes de responder.',audio:s.npc,options:progressionOptions(s.pt,(unit.scenarios||[]).map(x=>x.pt)),answer:s.pt,why:s.pt,_unitId:unit.id,_masteryRepair:true};
    if(dimension==='produce')return {type:'roleplay',method:'produce',prompt:'Roleplay de domínio.',npc:s.npc,npcPt:s.pt,target:s.reply,pt:s.replyPt,why:s.replyPt,_unitId:unit.id,_masteryRepair:true};
    return {type:'transfer',method:'transfer',prompt:'Resolva a situação sem modelo.',cue:`${s.pt} → ${s.replyPt}`,target:s.reply.replace(/[。！？!?]/g,''),accepted:[s.reply,s.reply.replace(/[。！？!?]/g,'')],why:s.replyPt,_unitId:unit.id,_masteryRepair:true};
  }
  return null;
}
function buildMasteryRemediation(node){
  const unit=coursePackForDay(node?.day);if(!unit)return {title:'Reforço',focus:'復',exercises:[],remediation:true};
  const gaps=unitMasteryGaps(unit,8),seen=new Set(),exercises=[];
  for(const gap of gaps){
    const signature=gap.concept+'|'+gap.dimension;if(seen.has(signature))continue;
    const ex=exerciseForMasteryGap(gap,unit);if(!ex)continue;
    seen.add(signature);exercises.push(ex);if(exercises.length>=6)break;
  }
  if(!exercises.length){
    const fallback=compileAdaptiveMONSequence(unit).slice(0,4).map(e=>({...e,_unitId:unit.id,_masteryRepair:true}));
    exercises.push(...fallback);
  }
  return {title:'Reforço · '+unit.title,focus:'復',unitId:unit.id,objectives:unit.objectives,mastery:unit.mastery,exercises,remediation:true};
}
