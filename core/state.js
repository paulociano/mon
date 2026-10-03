// MON persistent learning state
// Single seam for local progress, gamification and review persistence.

const defaultState={xp:120,streak:1,reviews:{},kanaMastery:{},kanaReviews:{},speech:0,day:1,sessions:0,foundationDay:1,foundationComplete:false,foundationSessions:0,romajiMode:'auto',grammarOpened:{},grammarRecall:{},sentenceSolved:0,soundWins:0,lastStudyDate:null,history:[],diagnostic:null,energy:20,maxEnergy:20,gems:350,pathProgress:null,quests:{date:null,lessons:0,xp:0,accuracy:false},streakFreeze:0,xpBoostUntil:0,chests:{},leagueXp:0,perfectLessons:0,mistakes:[],mistakeStats:{},reviewItems:{}};
let state=defaultState;
try{state={...defaultState,...JSON.parse(localStorage.getItem('mon-state')||'{}')}}catch(e){state={...defaultState,reviews:{}}}
state={...defaultState,...state,reviews:{...(state.reviews||{})},kanaMastery:{...(state.kanaMastery||{})},kanaReviews:{...(state.kanaReviews||{})},grammarOpened:{...(state.grammarOpened||{})},grammarRecall:{...(state.grammarRecall||{})},history:Array.isArray(state.history)?state.history:[],quests:{...defaultState.quests,...(state.quests||{})},chests:{...(state.chests||{})},mistakes:Array.isArray(state.mistakes)?state.mistakes:[],mistakeStats:{...(state.mistakeStats||{})},reviewItems:{...(state.reviewItems||{})}};if(state.pathProgress==null)state.pathProgress=state.foundationComplete?24:Math.max(0,(state.foundationDay||1)-1);
function save(){try{localStorage.setItem('mon-state',JSON.stringify(state))}catch(e){} updateMetrics();}
