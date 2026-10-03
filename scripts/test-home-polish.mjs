import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');

for(const token of ['current-unit','done-unit','locked-unit','unit-progress','unit-status','node-type','aria-current="step"']){
  assert.ok(app.includes(token),'missing path rendering token '+token);
}
for(const token of ['rail-card-label','daily-card','quest-card','practice-mini']){
  assert.ok(html.includes(token),'missing rail markup '+token);
}
for(const token of ['.path-node.checkpoint::after','.guide-card[data-state="checkpoint"]','.home-reveal.is-visible']){
  assert.ok(css.includes(token),'missing visual state '+token);
}
assert.ok(app.includes("prefers-reduced-motion"),'motion must respect reduced-motion preference');
console.log('MON home polish contracts passed');
