import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');

for(const token of ['current-unit','done-unit','locked-unit','unit-progress','unit-status','node-type','aria-current="step"']){
  assert.ok(app.includes(token),'missing path rendering token '+token);
}
for(const token of ['homeAdaptiveTitle','homeAdaptiveCopy','homeAdaptivePrimary','dailyPlanCard','todayReason','learningPath']){
  assert.ok(html.includes(token),'missing focused Home contract '+token);
}
assert.ok(css.includes('.guide-card,.journey-mini,.guide-visual{display:none!important}'),'redundant Home rail cards must remain visually removed');
assert.ok(css.includes('.course-banner{min-height:218px'),'Home hero must stay compact');
assert.ok(css.includes('.path-node.current'),'current learning step must retain a visible state');
assert.ok(css.includes('.home-reveal.is-visible'),'Home progressive disclosure state missing');
assert.ok(app.includes("prefers-reduced-motion"),'motion must respect reduced-motion preference');
assert.ok(app.includes('homeCoachDecision'),'Home must remain adaptive');
assert.ok(app.includes('runAdaptiveHomeAction'),'primary Home action must remain functional');
assert.ok(!html.includes('kitsu-mascot.webp'),'legacy mascot asset must not render');
console.log('MON home polish contracts passed');
