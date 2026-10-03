// MON persistent narrative state
// Keeps compact world progress in state; full story content stays in data/narrative.js.

function ensureNarrativeState(){
  const base={episodes:{},characters:{},arcs:{},lastEpisode:null};
  state.narrative={
    ...base,
    ...(state.narrative||{}),
    episodes:{...((state.narrative||{}).episodes||{})},
    characters:{...((state.narrative||{}).characters||{})},
    arcs:{...((state.narrative||{}).arcs||{})},
    lastEpisode:(state.narrative||{}).lastEpisode||null
  };
  return state.narrative;
}
function recordNarrativeEpisode(pack,accuracy=0,{resolved=false}={}){
  const meta=pack?.narrative,unitId=pack?.unitId||pack?.id;if(!unitId||!meta)return null;
  const ns=ensureNarrativeState(),now=Date.now();
  const charId=Object.entries(typeof narrativeCharacters!=='undefined'?narrativeCharacters:{}).find(([,v])=>v.name===meta.character?.name)?.[0]||meta.character?.name||'unknown';
  const placeId=Object.entries(typeof narrativePlaces!=='undefined'?narrativePlaces:{}).find(([,v])=>v.name===meta.place?.name)?.[0]||meta.place?.name||'unknown';
  const prev=ns.episodes[unitId]||{};
  ns.episodes[unitId]={
    unitId,title:pack.title||prev.title||unitId,arc:meta.arc||prev.arc||null,characterId:charId,placeId,
    firstSeenAt:prev.firstSeenAt||now,lastSeenAt:now,attempts:(prev.attempts||0)+1,
    bestAccuracy:Math.max(prev.bestAccuracy||0,accuracy||0),resolved:!!(prev.resolved||resolved),
    resolvedAt:prev.resolvedAt||(resolved?now:null)
  };
  const cm=meta.character||{};
  const cp=ns.characters[charId]||{};
  ns.characters[charId]={
    id:charId,name:cm.name||cp.name||charId,role:cm.role||cp.role||'',
    firstSeenAt:cp.firstSeenAt||now,lastSeenAt:now,encounters:(cp.encounters||0)+1
  };
  const arcId=meta.arc||'unknown',arcMeta=(typeof narrativeArcs!=='undefined'&&narrativeArcs[arcId])||{};
  const ap=ns.arcs[arcId]||{};
  const seenUnits=new Set([...(ap.seenUnits||[]),unitId]);
  const resolvedUnits=new Set([...(ap.resolvedUnits||[]),...(resolved?[unitId]:[])]);
  ns.arcs[arcId]={
    id:arcId,title:arcMeta.title||ap.title||arcId,firstSeenAt:ap.firstSeenAt||now,lastSeenAt:now,
    seenUnits:[...seenUnits],resolvedUnits:[...resolvedUnits]
  };
  ns.lastEpisode={unitId,title:pack.title||unitId,characterName:cm.name||charId,placeName:meta.place?.name||placeId,at:now,resolved:!!resolved};
  return ns.episodes[unitId];
}
function narrativeStateSummary(){
  const ns=ensureNarrativeState(),episodes=Object.values(ns.episodes),characters=Object.values(ns.characters);
  return {
    episodes:episodes.length,resolved:episodes.filter(x=>x.resolved).length,
    characters:characters.length,arcs:Object.values(ns.arcs).length,lastEpisode:ns.lastEpisode
  };
}
function narrativeJournalModel(){
  const ns=ensureNarrativeState(),order=Object.keys(typeof narrativeEpisodes!=='undefined'?narrativeEpisodes:{});
  const episodes=order.filter(id=>ns.episodes[id]).map(id=>{
    const progress=ns.episodes[id],content=narrativeEpisodeForUnit(id);
    return {id,progress,content};
  });
  const arcs=Object.entries(typeof narrativeArcs!=='undefined'?narrativeArcs:{}).map(([id,meta])=>{
    const total=order.filter(k=>narrativeEpisodes[k]?.arc===id).length;
    const seen=(ns.arcs[id]?.seenUnits||[]).length,resolved=(ns.arcs[id]?.resolvedUnits||[]).length;
    return {id,...meta,total,seen,resolved,pct:total?Math.round(resolved/total*100):0};
  });
  const characters=Object.values(ns.characters).sort((a,b)=>(b.encounters||0)-(a.encounters||0));
  const summary=narrativeStateSummary();
  return {summary,episodes,arcs,characters};
}
ensureNarrativeState();
