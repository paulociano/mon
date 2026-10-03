import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const kanji=fs.readFileSync('features/kanji.js','utf8');
const exp=fs.readFileSync('features/experiences.js','utf8');
const telemetry=fs.readFileSync('core/performance.js','utf8');

assert.ok(!app.includes('function renderKanjiList('));
assert.ok(kanji.includes('function renderKanjiList('));
assert.ok(kanji.includes('function gradeKanji('));
assert.ok(!app.includes('function missionOpen('));
assert.ok(exp.includes('function missionOpen('));
assert.ok(exp.includes('function hydrateMissionGrid('));
assert.ok(exp.includes('function hydrateSurvivalPhrases('));
assert.ok(app.includes("kanji:['./features/kanji.js']"));
assert.ok(app.includes("reading:['./features/experiences.js']"));
assert.ok(app.includes("reviewIsDue('kanji',x.k,true)"),'home metrics must not need Kanji feature');
assert.ok(app.includes('function similarity('),'lesson speech scoring remains shell-safe');
assert.ok(telemetry.includes("MON_PERF_KEY='mon_perf_v1'"));
assert.ok(telemetry.includes('PerformanceObserver'));
assert.ok(!telemetry.includes('fetch('));
assert.ok(!telemetry.includes('sendBeacon'));
console.log('MON lazy experience and telemetry contracts passed');
