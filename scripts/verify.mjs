import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html');
const sw=read('sw.js');

const refs=[...html.matchAll(/<(?:script[^>]+src|link[^>]+href)="([^"]+)"/g)].map(m=>m[1]).filter(x=>x.startsWith('./'));
const missing=refs.filter(r=>!fs.existsSync(path.join(root,r.slice(2))));
if(missing.length)throw new Error('Missing local refs: '+missing.join(', '));

const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const duplicateIds=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
if(duplicateIds.length)throw new Error('Duplicate HTML ids: '+duplicateIds.join(', '));

const scriptOrder=[
 './data/course-content.js',
 './core/state.js',
 './core/review-scheduler.js',
 './core/mistakes.js',
 './core/course-engine.js',
 './app.js'
];
let cursor=-1;
for(const src of scriptOrder){
 const p=html.indexOf(`src="${src}"`);
 if(p<0)throw new Error('Missing script tag: '+src);
 if(p<=cursor)throw new Error('Invalid script order around '+src);
 cursor=p;
}

for(const asset of scriptOrder){
 if(!sw.includes(`'${asset}'`))throw new Error('PWA cache missing '+asset);
}

const requiredIds=['learningPath','quickMain','quickFeedback','quickCheck','reviewDeck','mistakeNotebook','toast'];
for(const id of requiredIds){
 if(!html.includes(`id="${id}"`))throw new Error('Required UI id missing: '+id);
}

console.log('MON static verification passed');
console.log(`Checked ${refs.length} local refs, ${ids.length} ids and ${scriptOrder.length} runtime modules.`);
