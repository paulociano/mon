import fs from 'node:fs';
import assert from 'node:assert/strict';

const data=fs.readFileSync('data/pronunciation.js','utf8');
const js=fs.readFileSync('features/pronunciation.js','utf8');
const css=fs.readFileSync('features/pronunciation.css','utf8');
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const state=fs.readFileSync('core/state.js','utf8');

for(const id of ["id:'mora'","id:'long'","id:'sokuon'","id:'n'"])assert.ok(data.includes(id),'missing pronunciation track '+id);
assert.ok(data.includes('pronunciationShadowing'));
assert.ok(data.includes("moras:['と','う','きょ','う']"),'Tokyo mora segmentation should count long vowels');
assert.ok(data.includes("compareMoras:['き','っ','て']"),'small tsu must occupy its own mora');

assert.ok(app.includes("pronunciation:['./data/pronunciation.js','./features/pronunciation.js']"));
assert.ok(app.includes("pronunciation:['./features/pronunciation.css']"));
assert.ok(html.includes('data-view="pronunciation"'));
assert.ok(html.includes('id="pronLab"'));
assert.ok(js.includes("u.lang='ja-JP'"));
assert.ok(js.includes('window.SpeechRecognition||window.webkitSpeechRecognition'));
assert.ok(js.includes('Não é avaliação fonética')||js.includes('não como nota fonética')||js.includes('não é avaliação fonética'));
assert.ok(js.includes('selfRatings'));
assert.ok(css.includes('.mora-row'));
assert.ok(css.includes('.shadow-lab'));
assert.ok(state.includes('pronunciation:{sessions:0'));

console.log('MON Listening & Pronunciation Lab contracts passed');
