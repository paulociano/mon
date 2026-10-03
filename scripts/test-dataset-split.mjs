import fs from 'node:fs';
import assert from 'node:assert/strict';

const shell=fs.readFileSync('data/course-content.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');

assert.ok(shell.includes('SHELL_FOUNDATION_TOTAL=24'));
assert.ok(shell.includes('shellFoundationOutline'));
assert.ok(shell.includes('shellMissionOutline'));
for(const forbidden of ['const kanjiData','const kanaSets','const grammarData','const bookData','const curriculumData'])assert.ok(!shell.includes(forbidden),'eager shell contains '+forbidden);

for(const p of ['data/kanji.js','data/kana.js','data/foundation.js','data/experiences.js','data/curriculum.js']){
 assert.ok(fs.existsSync(p),p+' missing');
 assert.ok(sw.includes("'./"+p+"'"),p+' missing from PWA cache');
}
assert.ok(app.includes("kanji:['./data/kanji.js','./features/kanji.js']"));
assert.ok(app.includes("curriculum:['./data/curriculum.js']"));
assert.ok(app.includes("SHELL_KANJI_COUNT"));
assert.ok(!app.includes('kanjiData.filter(x=>reviewIsDue'));
console.log('MON dataset split contracts passed');
