import fs from 'node:fs';
import assert from 'node:assert/strict';

const files=[
 'styles.css','index.html','features/lesson.css','features/practice.css',
 'features/journey.css','features/journal.css','features/pronunciation.css',
 'features/kanji-memory.css','features/missions-v2.css'
];
const text=Object.fromEntries(files.map(f=>[f,fs.readFileSync(f,'utf8')]));
const root=text['styles.css'];

assert.ok(root.includes('--ui:ui-sans-serif'),'UI role must be system-first and offline-safe');
assert.ok(root.includes('--display:ui-serif'),'display role must have a centralized serif stack');
assert.ok(root.includes('--jp:"Hiragino Sans"'),'Japanese role must prefer native Japanese sans');
assert.ok(root.includes('"Yu Gothic UI"'),'Japanese Windows fallback missing');
assert.ok(root.includes('"Noto Sans JP"'),'Japanese open fallback missing');
assert.ok(root.includes('button,input,select,textarea{font:inherit}'),'form controls must inherit the typography system');

const joined=Object.values(text).join('\n');
assert.ok(!/fonts\.googleapis\.com|fonts\.gstatic\.com|@import\s+url\([^)]*font/i.test(joined),'critical typography must not depend on remote font providers');
assert.ok(!/\bInter\b/.test(joined),'do not declare Inter unless the project actually ships it');

for(const [file,src] of Object.entries(text)){
 if(file==='styles.css')continue;
 assert.ok(!/Georgia|Times New Roman|system-ui/.test(src),file+' contains a raw typography family outside the token system');
}
const stylesWithoutTokens=root.replace(/--display:[^;]+;/,'').replace(/--ui:[^;]+;/,'').replace(/--jp:[^;]+;/,'');
assert.ok(!/Georgia|Times New Roman|system-ui/.test(stylesWithoutTokens),'styles.css contains raw typography families outside root tokens');
assert.ok((joined.match(/var\(--display\)/g)||[]).length>=40,'display typography should be consistently tokenized');
assert.ok((joined.match(/var\(--jp\)/g)||[]).length>=50,'Japanese learning typography should stay on the JP token');

console.log('MON typography system contracts passed');
