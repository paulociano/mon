import fs from 'node:fs';
import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const js=fs.readFileSync('features/videos.js','utf8');
const css=fs.readFileSync('features/videos.css','utf8');

assert.ok(app.includes("videos:['./features/videos.js']"));
assert.ok(app.includes("videos:['./features/videos.css']"));
assert.ok(html.includes('data-view="videos"'));
assert.ok(html.includes('id="videoGrid"'));
assert.ok(html.includes('id="videoStage"'));
assert.ok(js.includes('youtube-nocookie.com/embed/'));
assert.ok(js.includes('loading="lazy"'));
assert.ok(!html.includes('<iframe'),'no video iframe should exist before user action');
assert.ok(js.includes("source:'Japan Foundation · Irodori'"));
assert.ok(css.includes('.video-modal'));
console.log('MON Video Library contracts passed');
