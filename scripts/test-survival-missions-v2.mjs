import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({});
vm.runInContext(fs.readFileSync('data/missions-v2.js','utf8'),ctx,{filename:'missions-v2.js'});
vm.runInContext(fs.readFileSync('data/missions-dialogues.js','utf8'),ctx,{filename:'missions-dialogues.js'});
const missions=vm.runInContext('survivalMissionsV2',ctx);
assert.ok(missions.length>=9,'need broad survival coverage');
for(const id of ['station','konbini','restaurant','delivery','work','clinic','cityhall','phone','disaster']){
 const m=missions.find(x=>x.id===id);assert.ok(m,id+' missing');
 for(const key of ['objective','context','npc','npcPt','reply','replyPt','altReply','altReplyPt','confirm','confirmPt','final','finalPt','altFinal','altFinalPt','wrong'])assert.ok(m[key],id+' missing '+key);
}
const repair=vm.runInContext('missionRepairPhrase()',ctx);
const repairs=vm.runInContext('missionRepairOptions()',ctx);
assert.ok(repair.jp.includes('もう一度'));
assert.ok(repair.jp.includes('ゆっくり'));
assert.equal(repairs.length,2);
assert.ok(repairs.some(x=>x.id==='meaning'&&x.jp.includes('意味')));

const js=fs.readFileSync('features/missions-v2.js','utf8');
const dialogue=fs.readFileSync('features/missions-dialogue.js','utf8');
const css=fs.readFileSync('features/missions-v2.css','utf8');
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const state=fs.readFileSync('core/state.js','utf8');
for(const branch of ["choice.startsWith('repair:')","choice==='wrong'","choice!=='target'&&choice!=='alt'"])assert.ok(js.includes(branch));
assert.ok(js.includes('missionAutonomyScore'));
assert.ok(js.includes('supportShown=true'));
assert.ok(js.includes("missionAutonomyLabel"));
assert.ok(js.includes('completed[m.id]'));
assert.ok(js.includes('objective'));
for(const id of ['work','phone','cityhall','disaster']){const d=vm.runInContext(`missionDialoguesV4['${id}']`,ctx);assert.ok(d,id+' adaptive dialogue missing');assert.equal(d.opening.length,2);assert.ok(Object.keys(d.pressure).length>=2);assert.ok(d.closing)}
const runtimeCtx=vm.createContext({state:{functionalMastery:{negotiate:{attempts:3,score:28},repair:{attempts:3,score:72}}},missionRun:{id:'phone',step:0,pressureCapability:'negotiate',lastChoice:null},missionDialoguesV4:vm.runInContext('missionDialoguesV4',ctx),Date,Math,Object,Number,String,Set});
vm.runInContext(dialogue,runtimeCtx,{filename:'missions-dialogue.js'});
assert.equal(vm.runInContext("missionPressureCapability('phone')",runtimeCtx),'negotiate');
assert.equal(vm.runInContext("adaptiveMissionTurns('phone',missionRun).length",runtimeCtx),4);
vm.runInContext("missionRun.step=1;missionRun.lastChoice='alt'",runtimeCtx);assert.ok(vm.runInContext("adaptiveMissionTurn({id:'phone'},missionRun).npc",runtimeCtx).includes('よろしい'));
vm.runInContext("missionRecordFunctionalTurn({capability:'confirm',goal:'confirmar'},false)",runtimeCtx);assert.equal(vm.runInContext("state.functionalMastery.confirm.attempts",runtimeCtx),1);
assert.ok(app.includes("'./data/missions-v2.js'"));
assert.ok(app.includes("'./data/missions-dialogues.js'"));
assert.ok(app.includes("'./features/missions-dialogue.js'"));
assert.ok(app.includes("'./features/missions-v2.js'"));
assert.ok(app.includes("missions:['./features/missions-v2.css']"));
assert.ok(html.includes('id="missionRunner"'));
assert.ok(state.includes('survivalMissions:{completed:{}'));
assert.ok(css.includes('.mission-run'));
assert.ok(css.includes('.mission-complete'));
assert.ok(css.includes('.mission-readiness'));
assert.ok(css.includes('.mission-repair-note'));

console.log('MON Survival Missions 2.0 contracts passed');
