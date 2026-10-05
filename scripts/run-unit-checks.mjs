import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const files=fs.readdirSync('scripts').filter(n=>(n.startsWith('test-')||n==='verify.mjs')&&n.endsWith('.mjs'));
let count=0;
for(const file of files){
 const path='scripts/'+file;
 if(fs.readFileSync(path,'utf8').includes('playwright'))continue;
 const result=spawnSync(process.execPath,[path],{stdio:'inherit'});
 if(result.status!==0)process.exit(result.status||1);
 count++;
}
console.log(`${count} checks passed`);
