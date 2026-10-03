import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

function load(seed={}){
  const state={reviewItems:{},reviews:{},kanaReviews:{},grammarRecall:{},...seed};
  const ctx=vm.createContext({state,console,Date,Math,Set,Object,Number,String});
  vm.runInContext(fs.readFileSync('core/review-scheduler.js','utf8'),ctx,{filename:'review-scheduler.js'});
  return {state,run:code=>vm.runInContext(code,ctx)};
}

{
  const {state,run}=load();
  run("gradeReview('kana','あ','hard')");
  const r=state.reviewItems['kana:あ'];
  assert.equal(r.type,'kana');
  assert.equal(r.key,'あ');
  assert.equal(r.lapses,1);
  assert.ok(r.due>Date.now());
  assert.ok(r.interval>0&&r.interval<1);
}

{
  const {state,run}=load();
  run("gradeReview('kanji','駅','good')");
  const first=state.reviewItems['kanji:駅'];
  assert.equal(first.interval,1);
  run("gradeReview('kanji','駅','good')");
  const second=state.reviewItems['kanji:駅'];
  assert.equal(second.interval,3);
  assert.ok(second.reps>first.reps);
}

{
  const now=Date.now();
  const {state,run}=load({reviewItems:{
    'grammar:F13':{type:'grammar',key:'F13',due:now-86400000,reps:1,interval:1,ease:2.3,lapses:0},
    'error:m1':{type:'error',key:'m1',due:now-3600000,reps:0,interval:.1,ease:2.1,lapses:2}
  }});
  const ids=run("getReviewQueue(2).map(x=>reviewId(x.type,x.key))");
  assert.equal(ids.length,2);
  assert.equal(ids[0],'error:m1');
}

{
  const now=Date.now();
  const {state}=load({
    reviews:{'日':{reps:3,interval:7,ease:2.4,due:now+1000,last:'good',lastAt:now}},
    kanaReviews:{'あ':{reps:2,interval:2,ease:2.3,due:now+1000,last:'good',lastAt:now}},
    grammarRecall:{F13:{m:3,reps:2,last:'good',lastAt:now}}
  });
  assert.ok(state.reviewItems['kanji:日']);
  assert.ok(state.reviewItems['kana:あ']);
  assert.ok(state.reviewItems['grammar:F13']);
}

console.log('MON review scheduler tests passed');
