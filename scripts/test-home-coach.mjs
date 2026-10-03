import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {homeCoachDecision}=require('../core/home-coach.js');

const path=[{label:'Vogais',type:'lesson'},{label:'Checkpoint',type:'checkpoint'},{label:'Baú',type:'chest'}];
const base={pathProgress:0,energy:20,reviewItems:{},mistakeStats:{},remediation:null,narrative:{episodes:{},lastEpisode:null}};

let d=homeCoachDecision({...base,remediation:{idx:0},reviewItems:{a:{due:0},b:{due:0},c:{due:0},d:{due:0}}},path,1000);
assert.equal(d.kind,'repair');

d=homeCoachDecision({...base,reviewItems:{a:{due:0},b:{due:0},c:{due:0},d:{due:0}}},path,1000);
assert.equal(d.kind,'review');
assert.equal(d.action,'practice');

d=homeCoachDecision({...base,energy:0},path,1000);
assert.equal(d.kind,'recover');

d=homeCoachDecision({...base,mistakeStats:{a:{count:3,recovered:0},b:{count:2,recovered:0},c:{count:1,recovered:0}}},path,1000);
assert.equal(d.kind,'mistake');

const narrative={episodes:{'n5-station':{resolved:false}},lastEpisode:{unitId:'n5-station',characterName:'Yuki',placeName:'Estação Sakura',resolved:true}};
d=homeCoachDecision({...base,narrative},path,1000);
assert.equal(d.kind,'story');

d=homeCoachDecision({...base,pathProgress:1},path,1000);
assert.equal(d.signal,'checkpoint pronto');

d=homeCoachDecision({...base,pathProgress:2},path,1000);
assert.equal(d.action,'chest');

console.log('MON adaptive Home Coach contracts passed');
