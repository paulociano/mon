import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx=vm.createContext({console,Object,Set,Map,Number,String,Math});
vm.runInContext(fs.readFileSync('data/content-packs.js','utf8'),ctx,{filename:'content-packs.js'});

const units=Array.from(vm.runInContext('coursePacks.N5.units',ctx));
const vocab=vm.runInContext('vocabularyCatalog',ctx);
const grammar=vm.runInContext('grammarCatalog',ctx);

const requiredDomains=['transport','shopping','food','home','time','weather','social','work','health','service','repair','counter'];
const domainHits=new Map(requiredDomains.map(domain=>[domain,0]));
const vocabUse=new Map();
const grammarUse=new Map();
const seenVocabulary=new Set();
let laterUnitsWithReuse=0;
const novelty=[];

for(const unit of units){
  assert.ok(unit.objectives?.length>=2,unit.id+' needs at least two observable objectives');
  assert.ok(unit.scenarios?.length>=1,unit.id+' needs a transfer scenario');
  assert.ok(unit.vocabulary?.length>=4,unit.id+' needs enough lexical material');
  assert.ok(unit.vocabulary.length<=10,unit.id+' introduces too much vocabulary at once');
  const fresh=unit.vocabulary.filter(key=>!seenVocabulary.has(key));
  const reused=unit.vocabulary.filter(key=>seenVocabulary.has(key));
  const noveltyBudget=unit===units[0]?9:8;
  assert.ok(fresh.length<=noveltyBudget,unit.id+' exceeds new-vocabulary budget: '+fresh.length);
  if(unit!==units[0]&&reused.length)laterUnitsWithReuse++;
  novelty.push({id:unit.id,newVocabulary:fresh.length,reusedVocabulary:reused.length});
  unit.vocabulary.forEach(key=>seenVocabulary.add(key));
  for(const method of ['freeRecall','transfer','roleplay']){
    assert.ok(unit.methods?.includes(method),unit.id+' missing '+method);
  }

  for(const key of unit.vocabulary||[]){
    const days=vocabUse.get(key)||[];
    days.push(unit.day);
    vocabUse.set(key,days);
    for(const tag of vocab[key]?.tags||[]){
      if(domainHits.has(tag))domainHits.set(tag,domainHits.get(tag)+1);
    }
  }
  for(const key of unit.grammar||[]){
    const days=grammarUse.get(key)||[];
    days.push(unit.day);
    grammarUse.set(key,days);
  }
}

assert.ok(laterUnitsWithReuse>=16,'too few later N5 units reuse previously seen vocabulary');

for(const id of ['n5-health','n5-repair','n5-phone','n5-autonomy']){
  const unit=units.find(item=>item.id===id);
  assert.ok(unit?.scenarios?.length>=2,id+' needs scenario variety for real-world transfer');
  assert.equal(new Set(unit.scenarios.map(s=>s.npc+'|'+s.reply)).size,unit.scenarios.length,id+' scenarios must be distinct');
}

for(const [domain,count] of domainHits){
  assert.ok(count>0,'N5 functional coverage missing domain: '+domain);
}

const grammarCapabilities=[
  'topicDesu','locationNi','objectO','deAction','gaState',
  'timeNi','existenceAru','countersTsu','teKudasai','teMoIi',
  'desireTai','pastPolite','reasonKara','questionWords','alreadyYet'
];
for(const id of grammarCapabilities)assert.ok(grammar[id],'N5 grammar capability missing: '+id);

for(const key of ['wakarimasen','mouichido']){
  assert.ok((vocabUse.get(key)||[]).length>=3,key+' must reappear across contexts for repair fluency');
}

const survivalReappearance=['migi','hidari','fukuro','genkin','basu','oriru','tenki','kasa','toire','kaku','denwa'];
for(const key of survivalReappearance){
  const days=vocabUse.get(key)||[];
  assert.ok(days.length>=2,key+' must reappear after first exposure');
  assert.ok(days.at(-1)>days[0],key+' needs temporally separated retrieval');
}
for(const key of ['phoneIdentity']){
  const days=grammarUse.get(key)||[];
  assert.ok(days.length>=2,key+' grammar must transfer into a later unit');
}

const repeatedVocabulary=[...vocabUse.values()].filter(days=>days.length>=2).length;
const repeatedGrammar=[...grammarUse.values()].filter(days=>days.length>=2).length;
assert.ok(repeatedVocabulary>=18,'too little lexical reappearance across N5');
assert.ok(repeatedGrammar>=10,'too little grammar reappearance across N5');

const report={
  units:units.length,
  domains:Object.fromEntries(domainHits),
  repeatedVocabulary,
  repeatedGrammar,
  maxVocabularyPerUnit:Math.max(...units.map(unit=>unit.vocabulary.length)),
  transferReady:units.filter(unit=>['freeRecall','transfer','roleplay'].every(method=>unit.methods.includes(method))).length,
  laterUnitsWithReuse,
  novelty
};

console.log('MON N5 depth audit passed:',JSON.stringify(report));
