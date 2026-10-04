import fs from 'node:fs';
import assert from 'node:assert/strict';

const state=fs.readFileSync('core/state.js','utf8');
const lesson=fs.readFileSync('features/lesson.js','utf8');

assert.ok(state.includes('energy:30,maxEnergy:30'),'new learners must start with 30 energy');
assert.ok(state.includes("2:s=>({...s,saveVersion:3"),'existing saves need an explicit energy migration');
assert.ok(lesson.includes("if(correct)quickRun.streak"),'correct answers must keep the positive streak path');
assert.ok(lesson.includes("else{state.energy=Math.max(0,(state.energy||0)-1)"),'only incorrect answers may spend energy');
assert.ok(lesson.includes("energyTick(ok)"),'lesson grading must route the result through the energy policy');
assert.ok(!lesson.includes("state.energy=Math.max(0,(state.energy||0)-1);if(correct)"),'legacy always-spend energy behavior must not return');

console.log('MON energy policy contracts passed');
