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
assert.ok(app.includes("kanji:['./data/kanji.js','./data/kanji-memory.js','./features/kanji.js','./features/kanji-memory.js']"));
assert.ok(app.includes("reading:['./data/kana.js','./data/experiences.js','./features/experiences.js']"));
assert.ok(app.includes('SHELL_KANJI_COUNT'),'home metrics need only shell Kanji count');
assert.ok(!app.includes('kanjiData.filter('),'home metrics must not need Kanji catalog');
assert.ok(app.includes('function similarity('),'lesson speech scoring remains shell-safe');
assert.ok(telemetry.includes("MON_PERF_KEY='mon_perf_v1'"));
assert.ok(telemetry.includes('PerformanceObserver'));
assert.ok(!telemetry.includes('fetch('));
assert.ok(!telemetry.includes('sendBeacon'));
console.log('MON lazy experience and telemetry contracts passed');
