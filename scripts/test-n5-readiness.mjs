import fs from 'node:fs';
import assert from 'node:assert/strict';

const readiness=fs.readFileSync('docs/N5-READINESS.md','utf8');
const roadmap=fs.readFileSync('docs/ROADMAP.md','utf8');
const quality=fs.readFileSync('.github/workflows/quality.yml','utf8');

for(const file of ['scripts/test-n5-scale.mjs','scripts/test-n5-depth.mjs']){
  assert.ok(fs.existsSync(file),'missing N5 gate contract: '+file);
  assert.ok(readiness.includes(file),'N5 readiness must name '+file);
}

assert.ok(
  roadmap.includes('Auditoria profunda do N5 — gate estrutural concluído'),
  'roadmap must reflect the current N5 structural-gate decision'
);
assert.ok(
  roadmap.includes('N5-READINESS.md'),
  'roadmap must link the N5 readiness source of truth'
);
assert.ok(
  readiness.includes('retenção, transferência e autonomia'),
  'readiness must keep longitudinal learning validation distinct from structural readiness'
);
assert.ok(
  readiness.includes('volta automaticamente a bloquear expansão curricular'),
  'readiness must define regression behavior'
);

for(const command of ['node scripts/test-n5-scale.mjs','node scripts/test-n5-depth.mjs']){
  assert.ok(quality.includes(command),'Quality Gate must execute '+command);
}

console.log('MON N5 readiness governance contracts passed');
