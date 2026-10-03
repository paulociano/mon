import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const foundation=fs.readFileSync('features/foundation.js','utf8');
const session=fs.readFileSync('features/session.js','utf8');

assert.ok(!app.includes('const conjugationData='),'foundation implementation leaked into app.js');
assert.ok(!app.includes('let sessionRun=null'),'session implementation leaked into app.js');
assert.ok(foundation.includes('function renderFoundation()'));
assert.ok(foundation.includes('function gradeKana('));
assert.ok(session.includes('function renderSession('));
assert.ok(session.includes('function renderSessionComplete('));
assert.ok(app.includes("foundation:['./features/foundation.js']"));
assert.ok(app.includes("session:['./features/foundation.js','./features/session.js']"));
assert.ok(app.includes("typeof renderFoundationProgress==='function'"));
console.log('MON feature split contracts passed');
