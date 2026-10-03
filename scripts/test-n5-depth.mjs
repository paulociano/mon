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

for(const unit of units){
  assert.ok(unit.objectives?.length>=2,unit.id+' needs at least two observable objectives');
  assert.ok(unit.scenarios?.length>=1,unit.id+' needs a transfer scenario');
  assert.ok(unit.vocabulary?.length>=4,unit.id+' needs enough lexical material');
  assert.ok(unit.vocabulary.length<=10,unit.id+' introduces too much vocabulary at once');
  for(const method of ['freeRecall','transfer','roleplay']){
    assert.ok(unit.methods?.includes(method),unit.id+' missing '+method);
  }

  for(const key of unit.vocabulary||[]){
    vocabUse.set(key,(vocabUse.get(key)||0)+1);
    for(const tag of vocab[key]?.tags||[]){
      if(domainHits.has(tag))domainHits.set(tag,domainHits.get(tag)+1);
    }
  }
  for(const key of unit.grammar||[])grammarUse.set(key,(grammarUse.get(key)||0)+1);
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
  assert.ok((vocabUse.get(key)||0)>=3,key+' must reappear across contexts for repair fluency');
}

const repeatedVocabulary=[...vocabUse.values()].filter(n=>n>=2).length;
const repeatedGrammar=[...grammarUse.values()].filter(n=>n>=2).length;
assert.ok(repeatedVocabulary>=18,'too little lexical reappearance across N5');
assert.ok(repeatedGrammar>=10,'too little grammar reappearance across N5');

const report={
  units:units.length,
  domains:Object.fromEntries(domainHits),
  repeatedVocabulary,
  repeatedGrammar,
  maxVocabularyPerUnit:Math.max(...units.map(unit=>unit.vocabulary.length)),
  transferReady:units.filter(unit=>['freeRecall','transfer','roleplay'].every(method=>unit.methods.includes(method))).length
};

console.log('MON N5 depth audit passed:',JSON.stringify(report));
