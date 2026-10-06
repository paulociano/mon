import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const cssFiles=[
  'styles.css',
  ...fs.readdirSync('features').filter(x=>x.endsWith('.css')).map(x=>path.join('features',x))
];
const css=cssFiles.map(file=>({file,content:fs.readFileSync(file,'utf8')}));

for(const {file,content} of css){
  assert.ok(!/url\([^)]*assets\/scene\//i.test(content),file+' must not use scenic background images');
  assert.ok(!/font(?:-family)?\s*:[^;}]*\bGeorgia\b/i.test(content),file+' must not reintroduce Georgia');
  assert.ok(!/font(?:-family)?\s*:[^;}]*var\(--serif\)/i.test(content),file+' must not use a separate serif role');
  assert.ok(!/font(?:-family)?\s*:[^;}]*var\(--sans\)/i.test(content),file+' must use the canonical UI role');
}

const global=fs.readFileSync('styles.css','utf8');
assert.ok(global.includes('--display:var(--ui);'),'display type must inherit the canonical UI family');
assert.ok(global.includes('--jp:var(--ui);'),'Japanese UI text must inherit the canonical family stack');
assert.ok(global.includes('.side-culture{display:none!important}'),'decorative sidebar scene must stay removed');
assert.ok(global.includes('.guide-card,.journey-mini,.guide-visual{display:none!important}'),'redundant Home guidance cards must stay out of the visual hierarchy');

const guide='docs/MON-BRAND-GUIDE.md';
assert.ok(fs.existsSync(guide),'MON brand guide must exist');
const guideText=fs.readFileSync(guide,'utf8');
for(const token of ['futurística silenciosa','Menos recipientes','Sem decoração narrativa no background','Sistema tipográfico','Anti-patterns']){
  assert.ok(guideText.includes(token),'brand guide missing '+token);
}

console.log('MON brand system contracts passed');
