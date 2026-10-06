import fs from 'node:fs';
import assert from 'node:assert/strict';

const css=fs.readFileSync('styles.css','utf8');
const foundation=fs.readFileSync('features/foundation.css','utf8');
const kanji=fs.readFileSync('features/kanji.js','utf8');

for(const asset of ['foundation-zero-banner.webp','culture-banner.webp','kanji-atlas-banner.webp']){
  assert.ok(!css.includes(asset),'global UI must not use scenic section background '+asset);
  assert.ok(!foundation.includes(asset),'Foundation must not use scenic section background '+asset);
}
assert.ok(kanji.includes('class="ka-head kanji-atlas-hero"'),'lazy Kanji Atlas hero markup missing');
assert.ok(css.includes('.kanji-atlas-hero{min-height:250px'),'Kanji Atlas must keep a clean non-image hero surface');
assert.ok(foundation.includes('.foundation-hero{min-height:310px'),'Foundation must keep a clean non-image hero surface');
console.log('MON clean section surfaces passed');
