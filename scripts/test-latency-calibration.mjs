import fs from 'node:fs';
import assert from 'node:assert/strict';

const src=fs.readFileSync('scripts/calibrate-latency-baseline.mjs','utf8');

assert.ok(src.includes("MON_LATENCY_ROUNDS||5"),'calibration must default to multiple rounds');
assert.ok(src.includes("Math.max(3"),'calibration must reject single-run interpretation');
for(const metric of ['view:progress','view:home','lesson:interactive'])assert.ok(src.includes(metric),'missing calibrated metric '+metric);
assert.ok(src.includes('medianP50'));
assert.ok(src.includes('medianP95'));
assert.ok(src.includes('relative:'),'cross-run spread must be reported');
assert.ok(src.includes("absoluteBudgetGate:false"),'calibration must not silently become an absolute CI budget');
assert.ok(src.includes('production/device evidence is still required'),'calibration must preserve lab-vs-production boundary');
assert.ok(!/p95\s*[<>]=?\s*\d+/.test(src),'no hardcoded absolute p95 threshold allowed yet');

console.log('MON latency calibration contracts passed');
