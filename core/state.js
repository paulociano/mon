const MON_STATE_KEY='mon-state';
const MON_STATE_BACKUP_KEY='mon-state-backup';
const MON_STATE_CORRUPT_KEY='mon-state-corrupt-last';
const MON_SAVE_VERSION=2;
const defaultState={saveVersion:MON_SAVE_VERSION,xp:120,streak:1,reviews:{},kanaMastery:{},kanaReviews:{},speech:0,day:1,sessions:0,foundationDay:1,foundationComplete:false,foundationSessions:0,romajiMode:'auto',grammarOpened:{},grammarRecall:{},sentenceSolved:0,soundWins:0,lastStudyDate:null,history:[],diagnostic:null,energy:20,maxEnergy:20,gems:350,pathProgress:null,quests:{date:null,lessons:0,xp:0,accuracy:false},streakFreeze:0,xpBoostUntil:0,chests:{},leagueXp:0,perfectLessons:0,mistakes:[],mistakeStats:{},reviewItems:{},methodStats:{},masteryEvidence:{},unitMastery:{},remediation:null,narrative:{episodes:{},characters:{},arcs:{},lastEpisode:null},pronunciation:{sessions:0,plays:0,shadowAttempts:0,selfRatings:[],tracks:{}},kanjiLab:{attempts:0,correct:0,modes:{},last:null},survivalMissions:{completed:{},attempts:{},repairs:0},videoLearning:{opened:{},practice:{},last:null},productionGaps:{},functionalMastery:{}};

function normalizeState(raw={}){
 const source=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const normalized={...defaultState,...source,saveVersion:MON_SAVE_VERSION,reviews:{...(source.reviews||{})},kanaMastery:{...(source.kanaMastery||{})},kanaReviews:{...(source.kanaReviews||{})},grammarOpened:{...(source.grammarOpened||{})},grammarRecall:{...(source.grammarRecall||{})},history:Array.isArray(source.history)?source.history:[],quests:{...defaultState.quests,...(source.quests||{})},chests:{...(source.chests||{})},mistakes:Array.isArray(source.mistakes)?source.mistakes:[],mistakeStats:{...(source.mistakeStats||{})},reviewItems:{...(source.reviewItems||{})},methodStats:{...(source.methodStats||{})},masteryEvidence:{...(source.masteryEvidence||{})},unitMastery:{...(source.unitMastery||{})},remediation:source.remediation||null,narrative:{...defaultState.narrative,...(source.narrative||{}),episodes:{...((source.narrative||{}).episodes||{})},characters:{...((source.narrative||{}).characters||{})},arcs:{...((source.narrative||{}).arcs||{})},lastEpisode:(source.narrative||{}).lastEpisode||null},pronunciation:{...defaultState.pronunciation,...(source.pronunciation||{}),selfRatings:[...((source.pronunciation||{}).selfRatings||[])],tracks:{...((source.pronunciation||{}).tracks||{})}},kanjiLab:{...defaultState.kanjiLab,...(source.kanjiLab||{}),modes:{...((source.kanjiLab||{}).modes||{})}},survivalMissions:{...defaultState.survivalMissions,...(source.survivalMissions||{}),completed:{...((source.survivalMissions||{}).completed||{})},attempts:{...((source.survivalMissions||{}).attempts||{})}},videoLearning:{...defaultState.videoLearning,...(source.videoLearning||{}),opened:{...((source.videoLearning||{}).opened||{})},practice:{...((source.videoLearning||{}).practice||{})},last:(source.videoLearning||{}).last||null},productionGaps:{...(source.productionGaps||{})},functionalMastery:{...(source.functionalMastery||{})}};
 if(normalized.pathProgress==null)normalized.pathProgress=normalized.foundationComplete?24:Math.max(0,(normalized.foundationDay||1)-1);
 return normalized;
}
const MON_STATE_MIGRATIONS={
 0:s=>({...s,saveVersion:1}),
 1:s=>({...s,saveVersion:2,learningEvidence:{events:[...((s.learningEvidence?.events)||[])].slice(-600)}})
};
function migrateState(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('invalid MON save');
 const version=Number(raw.saveVersion||0);
 if(!Number.isInteger(version)||version<0)throw new Error('invalid MON save version');
 if(version>MON_SAVE_VERSION)throw new Error('future MON save version');
 let next={...raw},v=version;
 while(v<MON_SAVE_VERSION){
  const from=v,migrate=MON_STATE_MIGRATIONS[from];if(typeof migrate!=='function')throw new Error('missing MON migration '+from);
  next=migrate(next);v=Number(next.saveVersion);
  if(!Number.isInteger(v)||v<=from)throw new Error('invalid MON migration result');
 }
 return normalizeState(next);
}
function parseStoredState(raw){
 if(typeof raw!=='string'||!raw.trim())return null;
 return migrateState(JSON.parse(raw));
}
function rememberCorruptState(raw){
 if(typeof raw!=='string'||!raw)return;
 try{localStorage.setItem(MON_STATE_CORRUPT_KEY,raw)}catch(e){}
}
function loadState(){
 const primaryRaw=localStorage.getItem(MON_STATE_KEY);
 if(primaryRaw){
  try{
   const parsed=JSON.parse(primaryRaw),loaded=migrateState(parsed),from=Number(parsed.saveVersion||0);
   if(from<MON_SAVE_VERSION)try{localStorage.setItem(MON_STATE_BACKUP_KEY,primaryRaw);localStorage.setItem(MON_STATE_KEY,JSON.stringify(loaded))}catch(e){}
   return loaded;
  }catch(e){rememberCorruptState(primaryRaw)}
 }
 const backupRaw=localStorage.getItem(MON_STATE_BACKUP_KEY);
 if(backupRaw){
  try{
   const recovered=parseStoredState(backupRaw);
   try{localStorage.setItem(MON_STATE_KEY,JSON.stringify(recovered))}catch(e){}
   return recovered;
  }catch(e){}
 }
 return normalizeState(defaultState);
}
let state=loadState();
function save(){
 try{
  const next=normalizeState(state);
  const serialized=JSON.stringify(next);
  parseStoredState(serialized);
  const previous=localStorage.getItem(MON_STATE_KEY);
  if(previous){
   try{parseStoredState(previous);localStorage.setItem(MON_STATE_BACKUP_KEY,previous)}catch(e){rememberCorruptState(previous)}
  }
  localStorage.setItem(MON_STATE_KEY,serialized);
  state=next;
 }catch(e){}
 updateMetrics();
}
