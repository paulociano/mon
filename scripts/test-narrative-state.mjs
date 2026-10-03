import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({
 console,Object,Set,Number,String,Math,Date,
 state:{narrative:{episodes:{},characters:{},arcs:{},lastEpisode:null}}
});
vm.runInContext(fs.readFileSync('data/content-packs.js','utf8'),ctx,{filename:'content-packs.js'});
vm.runInContext(fs.readFileSync('data/narrative.js','utf8'),ctx,{filename:'narrative.js'});
vm.runInContext(fs.readFileSync('core/narrative-state.js','utf8'),ctx,{filename:'narrative-state.js'});

const pack=vm.runInContext("({...coursePacks.N5.units.find(x=>x.id==='n5-shopping'),narrative:narrativeEpisodeForUnit('n5-shopping')})",ctx);
vm.runInContext("recordNarrativeEpisode("+JSON.stringify(pack)+",72,{resolved:false})",ctx);
vm.runInContext("recordNarrativeEpisode("+JSON.stringify(pack)+",91,{resolved:true})",ctx);

const summary=vm.runInContext('narrativeStateSummary()',ctx);
assert.equal(summary.episodes,1,'same unit should update one episode');
assert.equal(summary.resolved,1);
assert.equal(summary.characters,1,'repeated encounter should not duplicate a character');

const ep=vm.runInContext("state.narrative.episodes['n5-shopping']",ctx);
assert.equal(ep.attempts,2);
assert.equal(ep.bestAccuracy,91);
assert.equal(ep.resolved,true);
assert.ok(ep.firstSeenAt<=ep.lastSeenAt);

vm.runInContext("recordNarrativeEpisode("+JSON.stringify(pack)+",40,{resolved:false})",ctx);
const after=vm.runInContext("state.narrative.episodes['n5-shopping']",ctx);
assert.equal(after.resolved,true,'resolved episode must never regress');
assert.equal(after.bestAccuracy,91,'best accuracy must never regress');

console.log('MON narrative persistence contracts passed',JSON.stringify(summary));
