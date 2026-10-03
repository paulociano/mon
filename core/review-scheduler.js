// MON unified review scheduler
// One timing model for kana, kanji, grammar and corrective errors.
// Domain modules remain responsible for how an item is presented.

const REVIEW_POLICY={
  kana:{hardHours:4,firstGoodDays:1,secondGoodDays:2,ease:2.30,minEase:1.65,easyBoost:1.18,priority:1.15},
  kanji:{hardHours:6,firstGoodDays:1,secondGoodDays:3,ease:2.35,minEase:1.65,easyBoost:1.28,priority:1.25},
  grammar:{hardHours:8,firstGoodDays:1,secondGoodDays:3,ease:2.30,minEase:1.65,easyBoost:1.22,priority:1.10},
  error:{hardHours:2,firstGoodDays:.5,secondGoodDays:2,ease:2.15,minEase:1.55,easyBoost:1.12,priority:1.45},
  vocabulary:{hardHours:5,firstGoodDays:1,secondGoodDays:3,ease:2.30,minEase:1.65,easyBoost:1.20,priority:1.20}
};
function reviewId(type,key){return type+':'+String(key)}
function reviewRecord(type,key){return state.reviewItems?.[reviewId(type,key)]||null}
function reviewIsDue(type,key,unseenDue=false,now=Date.now()){
  const r=reviewRecord(type,key);
  return r?Number(r.due||0)<=now:!!unseenDue;
}
function reviewMastery(type,key){
  const r=reviewRecord(type,key);if(!r)return 0;
  const interval=Math.max(0,Number(r.interval||0)),reps=Number(r.reps||0);
  return Math.max(0,Math.min(5,Math.round(Math.log2(Math.max(1,interval)))+(reps>=3?1:0)));
}
function gradeReview(type,key,grade,meta={}){
  state.reviewItems=state.reviewItems||{};
  const id=reviewId(type,key),policy=REVIEW_POLICY[type]||REVIEW_POLICY.vocabulary;
  const old=state.reviewItems[id]||{type,key,reps:0,interval:0,ease:policy.ease,lapses:0,createdAt:Date.now()};
  let reps=Number(old.reps||0),interval=Number(old.interval||0),ease=Number(old.ease||policy.ease),lapses=Number(old.lapses||0),hours;
  if(grade==='hard'){
    lapses++;reps=Math.max(0,reps-1);ease=Math.max(policy.minEase,ease-.16);
    hours=policy.hardHours;interval=hours/24;
  }else if(grade==='good'){
    reps++;
    interval=reps===1?policy.firstGoodDays:reps===2?policy.secondGoodDays:Math.max(policy.secondGoodDays+1,Math.round(Math.max(1,interval)*ease));
    hours=interval*24;
  }else{
    reps+=2;ease=Math.min(2.9,ease+.08);
    interval=reps<=2?Math.max(2,policy.secondGoodDays):Math.max(5,Math.round(Math.max(1,interval)*ease*policy.easyBoost));
    hours=interval*24;
  }
  const next={...old,...meta,type,key,reps,interval,ease,lapses,last:grade,lastAt:Date.now(),due:Date.now()+hours*3600000};
  state.reviewItems[id]=next;
  return next;
}
function reviewPriority(r,now=Date.now()){
  const policy=REVIEW_POLICY[r.type]||REVIEW_POLICY.vocabulary;
  const overdueHours=Math.max(0,(now-Number(r.due||0))/3600000);
  const weakness=Number(r.lapses||0)*1.7+Math.max(0,3-reviewMastery(r.type,r.key));
  return policy.priority*(1+Math.min(8,overdueHours/24))+weakness;
}
function getReviewQueue(limit=20,types=null,now=Date.now()){
  const allowed=types?new Set(types):null;
  return Object.values(state.reviewItems||{}).filter(r=>(!allowed||allowed.has(r.type))&&Number(r.due||0)<=now)
    .sort((a,b)=>reviewPriority(b,now)-reviewPriority(a,now)||(a.due||0)-(b.due||0)).slice(0,limit);
}
function reviewSummary(now=Date.now()){
  const all=Object.values(state.reviewItems||{}),due=all.filter(r=>Number(r.due||0)<=now),by={};
  due.forEach(r=>by[r.type]=(by[r.type]||0)+1);
  const mature=all.filter(r=>Number(r.interval||0)>=7&&Number(r.reps||0)>=3).length;
  return {total:all.length,due:due.length,mature,by,next:all.filter(r=>Number(r.due||0)>now).sort((a,b)=>a.due-b.due)[0]||null};
}
function migrateLegacyReviewState(){
  state.reviewItems=state.reviewItems||{};
  const put=(type,key,r={})=>{
    const id=reviewId(type,key);if(state.reviewItems[id])return;
    const policy=REVIEW_POLICY[type]||REVIEW_POLICY.vocabulary;
    state.reviewItems[id]={type,key,reps:Number(r.reps||0),interval:Number(r.interval||0),ease:Number(r.ease||policy.ease),lapses:Number(r.lapses||0),due:Number(r.due||r.lastAt||Date.now()),last:r.last||null,lastAt:Number(r.lastAt||0),migrated:true};
  };
  Object.entries(state.reviews||{}).forEach(([k,r])=>put('kanji',k,r));
  Object.entries(state.kanaReviews||{}).forEach(([k,r])=>put('kana',k,r));
  Object.entries(state.grammarRecall||{}).forEach(([k,r])=>{
    const mastery=Number(r.m||0),interval=mastery>=4?7:mastery>=2?2:.33;
    put('grammar',k,{...r,interval,due:r.due||((r.lastAt||Date.now())+interval*86400000),ease:2.3});
  });
}
migrateLegacyReviewState();
