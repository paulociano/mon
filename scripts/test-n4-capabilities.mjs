import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Map,Number,String,Math,Array});
for(const file of [
 'data/content-packs-n5.js',
 'data/content-packs-n4.js',
 'data/content-packs-n4-61-70.js',
 'data/content-packs-n4-71-80.js',
 'data/content-packs-n4-81-90.js',
 'data/n4-capabilities.js'
])vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});

const units=Array.from(vm.runInContext('coursePacks.N4.units',ctx));
const capabilities=vm.runInContext('N4_CAPABILITIES',ctx);
const map=vm.runInContext('N4_UNIT_CAPABILITIES',ctx);
vm.runInContext('applyN4CapabilityContracts()',ctx);

assert.equal(units.length,36,'N4 capability gate expects the current 36-unit curriculum');
assert.equal(Object.keys(map).length,units.length,'every N4 unit must have an explicit capability contract');

const valid=new Set(Object.keys(capabilities));
const counts=Object.fromEntries([...valid].map(x=>[x,0]));
for(const unit of units){
 assert.ok(Array.isArray(unit.capabilities)&&unit.capabilities.length>=2,unit.id+' needs at least two observable capabilities');
 assert.ok(unit.methods?.includes('transfer'),unit.id+' must include transfer practice');
 assert.ok(unit.methods?.includes('roleplay'),unit.id+' must include roleplay/production practice');
 for(const cap of unit.capabilities){
  assert.ok(valid.has(cap),unit.id+' uses unknown capability '+cap);
  counts[cap]++;
 }
}

for(const [cap,count] of Object.entries(counts))assert.ok(count>=5,cap+' is too sparse across N4: '+count);
assert.deepEqual(Array.from(units.find(x=>x.id==='n4-autonomy-final').capabilities),['repair','confirm','explain','negotiate','summarize']);

const ready=vm.runInContext("n4CapabilityReadiness({functionalMastery:{confirm:{attempts:2,score:70}}},'confirm')",ctx);
assert.equal(ready.ready,true);
const weak=vm.runInContext("n4CapabilityReadiness({functionalMastery:{confirm:{attempts:1,score:90}}},'confirm')",ctx);
assert.equal(weak.ready,false,'score without enough attempts must not count as readiness');

console.log('MON N4 capability contracts passed:',JSON.stringify(counts));
