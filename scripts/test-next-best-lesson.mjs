import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {nextBestLessonPlan,sequenceLessonByPlan}=require('../core/next-best-lesson.js');

const base={reviewItems:{},mistakeStats:{},masteryEvidence:{},methodStats:{},narrative:{episodes:{}},productionGaps:{},functionalMastery:{},learningEvidence:{events:[]},remediation:null};
const node={day:25,label:'Estação',type:'lesson'};

let p=nextBestLessonPlan({...base,remediation:{idx:1}},node,1000);
assert.equal(p.intent,'repair');

p=nextBestLessonPlan({...base,reviewItems:{a:{due:0},b:{due:0},c:{due:0},d:{due:0}}},node,1000);
assert.equal(p.intent,'retrieve');
assert.equal(p.reviewCount,3);

p=nextBestLessonPlan({...base,productionGaps:{alternativa:{count:3,recovered:1,lastAt:900,tokens:['別','大丈夫']}}},node,1000);
assert.equal(p.intent,'functionalRepair');
assert.equal(p.functionalGap.label,'alternativa');
assert.equal(p.functionalGap.open,2);
assert.deepEqual(p.functionalGap.tokens,['別','大丈夫']);

p=nextBestLessonPlan({...base,productionGaps:{causa:{count:2,recovered:0,lastAt:800,tokens:['ので'],capability:'explain'},alternativa:{count:2,recovered:0,lastAt:900,tokens:['別'],capability:'negotiate'}},functionalMastery:{explain:{score:62},negotiate:{score:28}}},node,1000);
assert.equal(p.functionalGap.label,'alternativa','weaker functional mastery should break equal-gap ties');
assert.equal(p.functionalGap.functionalScore,28);

p=nextBestLessonPlan({...base,mistakeStats:{a:{count:2,recovered:0},b:{count:2,recovered:0},c:{count:1,recovered:0}}},node,1000);
assert.equal(p.intent,'repair');

const listenCells={a:{listen:{score:42},produce:{score:82}},b:{listen:{score:50},produce:{score:80}}};
p=nextBestLessonPlan({...base,masteryEvidence:listenCells},node,1000);
assert.equal(p.intent,'listening');

const prodCells={a:{listen:{score:85},produce:{score:44}},b:{listen:{score:80},produce:{score:48}}};
p=nextBestLessonPlan({...base,masteryEvidence:prodCells},node,1000);
assert.equal(p.intent,'production');

p=nextBestLessonPlan({...base,narrative:{episodes:{x:{resolved:false}}}},node,1000);
assert.equal(p.intent,'transfer');

const day=24*60*60*1000;
const sparseRetention=Array.from({length:7},(_,i)=>({kind:'attempt',ok:i<3,spacingMs:7*day,at:i+1}));
p=nextBestLessonPlan({...base,learningEvidence:{events:sparseRetention}},node,1000);
assert.equal(p.intent,'advance','sparse longitudinal evidence must not recalibrate the lesson');

const observedRetention=Array.from({length:8},(_,i)=>({kind:'attempt',ok:i<4,spacingMs:7*day,at:i+1}));
p=nextBestLessonPlan({...base,learningEvidence:{events:observedRetention}},node,1000);
assert.equal(p.intent,'retrieve');
assert.equal(p.signals.validation.metric,'retention7d');
assert.equal(p.signals.validation.samples,8);

p=nextBestLessonPlan({...base,reviewItems:{a:{due:0},b:{due:0},c:{due:0},d:{due:0}},learningEvidence:{events:observedRetention}},node,1000);
assert.equal(p.intent,'retrieve');
assert.equal(p.reason,'4 itens chegaram ao ponto de recuperação espaçada.','direct due-review debt must outrank longitudinal calibration');

const transferTrend=[
 ...[true,true,true,false].map((ok,i)=>({kind:'attempt',ok,dimension:'transfer',at:i+1})),
 ...[true,true,false,false].map((ok,i)=>({kind:'attempt',ok,dimension:'transfer',at:i+5}))
];
p=nextBestLessonPlan({...base,learningEvidence:{events:transferTrend}},node,1000);
assert.equal(p.intent,'transfer');
assert.equal(p.signals.validation.metric,'transfer');
assert.equal(p.signals.validation.recent,50);

const improvingTransfer=[
 ...[true,true,false,false].map((ok,i)=>({kind:'attempt',ok,dimension:'transfer',at:i+1})),
 ...[true,true,true,false].map((ok,i)=>({kind:'attempt',ok,dimension:'transfer',at:i+5}))
];
p=nextBestLessonPlan({...base,learningEvidence:{events:improvingTransfer}},node,1000);
assert.equal(p.intent,'advance','improving observed transfer should not block advancement');

p=nextBestLessonPlan(base,node,1000);
assert.equal(p.intent,'advance');

const exercises=[
 {type:'choice',prompt:'new',answer:'a'},
 {type:'choice',prompt:'review',answer:'b',_reviewType:'kanji'},
 {type:'dictation',prompt:'listen',target:'c',method:'dictation'},
 {type:'roleplay',prompt:'speak',target:'d',method:'roleplay'},
 {type:'transfer',prompt:'transfer',target:'e',method:'transfer'}
];
const retrieve=nextBestLessonPlan({...base,reviewItems:{a:{due:0},b:{due:0},c:{due:0},d:{due:0}}},node,1000);
const seq=sequenceLessonByPlan(exercises,retrieve,5);
assert.ok(seq[0]._reviewType,'retrieve session should prioritize a due review');
assert.ok(seq.some(x=>['roleplay','transfer'].includes(x.type)),'session must retain productive transfer');

console.log('MON Next Best Lesson contracts passed');
