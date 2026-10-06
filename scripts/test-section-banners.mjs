import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');
const foundation=fs.readFileSync('features/foundation.css','utf8');
const kanji=fs.readFileSync('features/kanji.js','utf8');
for(const asset of ['foundation-zero-banner.webp','culture-banner.webp','kanji-atlas-banner.webp']){
  assert.ok(fs.existsSync('assets/scene/'+asset),'missing generated section banner '+asset);
}
assert.ok(foundation.includes("url('../assets/scene/foundation-zero-banner.webp')"),'Foundation Zero must use generated banner');
assert.ok(css.includes("url('./assets/scene/culture-banner.webp')"),'Culture must use generated banner');
assert.ok(kanji.includes('class="ka-head kanji-atlas-hero"'),'lazy Kanji Atlas hero markup missing');
assert.ok(css.includes("url('./assets/scene/kanji-atlas-banner.webp')"),'Kanji Atlas must use generated banner');
assert.ok(!foundation.includes("url('../assets/scene/hero-japan.svg')"),'Foundation must not fall back to generic hero');
console.log('MON generated section banners passed');
