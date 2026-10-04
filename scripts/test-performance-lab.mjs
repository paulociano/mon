import fs from 'node:fs';
import assert from 'node:assert/strict';
const core=fs.readFileSync('core/performance.js','utf8');
const lab=fs.readFileSync('features/performance-lab.js','utf8');
assert.ok(core.includes("has('debug')"));
assert.ok(core.includes('performanceResourceSnapshot'));
assert.ok(core.includes('perfPercentile'));
assert.ok(core.includes("name:'boot:navigation'"));
assert.ok(lab.includes('performanceSnapshot()'));
assert.ok(lab.includes('p50 / p95'));
assert.ok(lab.includes('v.p50'));
assert.ok(!lab.includes('v.median'));
assert.ok(lab.includes('navigator.serviceWorker'));
assert.ok(!lab.includes('fetch('));
assert.ok(!lab.includes('sendBeacon'));
console.log('MON Performance Lab contracts passed');

const app=fs.readFileSync('app.js','utf8');
assert.ok(app.includes("perfEnd('lesson:interactive'"),'lesson interactive latency must be recorded');
