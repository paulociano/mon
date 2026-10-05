import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const src=fs.readFileSync(new URL('../core/reading-support.js',import.meta.url),'utf8');
const context={console};
vm.createContext(context);
vm.runInContext(src,context);

assert.equal(context.monKanaToRomaji('ひらがな'),'hiragana');
assert.equal(context.monKanaToRomaji('コンビニ'),'konbini');
assert.equal(context.monKanaToRomaji('きょう'),'kyou');
assert.equal(context.monKanaToRomaji('まっすぐ'),'massugu');
assert.equal(context.monKanaToRomaji('カード'),'kaado');

const kanji=context.renderJapaneseReading('駅','えき',{mode:'show'});
assert.match(kanji,/<ruby class="mon-reading romaji-show"/);
assert.match(kanji,/<rb lang="ja">駅<\/rb>/);
assert.match(kanji,/<rt aria-hidden="true">eki<\/rt>/);

const kata=context.renderJapaneseReading('コンビニ','コンビニ',{mode:'show'});
assert.match(kata,/>konbini<\/rt>/);

const unsupported=context.renderJapaneseReading('日本');
assert.equal(unsupported,'日本','kanji without a contextual reading must not be guessed');

const hidden=context.renderJapaneseReading('みず','みず',{mode:'hide'});
assert.match(hidden,/romaji-hide/);

console.log('reading support contracts: ok');
