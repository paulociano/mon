import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const lesson=fs.readFileSync('features/lesson.js','utf8');
const css=fs.readFileSync('features/lesson.css','utf8');
const html=fs.readFileSync('index.html','utf8');

assert.ok(!app.includes('function renderQuickExercise('),'lesson renderer leaked into shell');
assert.ok(lesson.includes('function renderQuickExercise('));
assert.ok(lesson.includes('function quickCheck('));
assert.ok(lesson.includes("btn.removeAttribute('data-mon-command')"),'lesson CTA must not dispatch twice');
assert.ok(lesson.includes("if(current?.type!=='study'&&!quickRun.checked)return"),'evaluative exercise must not advance before validation');
assert.ok(lesson.includes('bindLessonKeyboard'));
assert.ok(lesson.includes('data-qopt'));
assert.ok(app.includes("lesson:['./features/open-production-remediation.js','./features/lesson.js']"));
assert.ok(fs.readFileSync('features/open-production-remediation.js','utf8').includes('buildOpenRemediation'));
assert.ok(app.includes("lesson:['./features/lesson.css','./features/beginner-scaffolding.css']"),'lesson route must lazy-load base and beginner scaffold styles');
assert.ok(html.includes('role="progressbar"'));
assert.ok(html.includes('aria-live="polite"'));
assert.ok(css.includes('.quick-key'));
assert.ok(css.includes(':focus-visible'));
console.log('MON lazy lesson UI contracts passed');
