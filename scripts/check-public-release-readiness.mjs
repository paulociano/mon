import fs from 'node:fs';

const file='compliance/RELEASE-GATES.md';
const text=fs.readFileSync(file,'utf8');
const p0=text.match(/## P0\n([\s\S]*?)(?:\n## |$)/)?.[1]||'';
const open=[...p0.matchAll(/^- \[ \] (.+)$/gm)].map(m=>m[1].trim());

if(open.length){
  console.error('PUBLIC RELEASE BLOCKED: open P0 gates');
  for(const item of open)console.error('- '+item);
  process.exit(1);
}
console.log('Public release readiness: all P0 gates are closed');
