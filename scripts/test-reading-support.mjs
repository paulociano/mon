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

const beginner=context.renderJapaneseReading('駅','えき',{state:{romajiMode:'auto',foundationDay:4,foundationComplete:false}});
assert.match(beginner,/>eki<\/rt>/);
assert.match(beginner,/data-reading-kind="romaji"/);

const transition=context.renderJapaneseReading('駅','えき',{state:{romajiMode:'auto',foundationDay:10,foundationComplete:false}});
assert.match(transition,/romaji-auto-faded/);

const graduated=context.renderJapaneseReading('駅','えき',{state:{romajiMode:'auto',foundationDay:24,foundationComplete:true}});
assert.match(graduated,/>えき<\/rt>/);
assert.match(graduated,/reading-furigana/);
assert.match(graduated,/data-reading-kind="furigana"/);

const kanaAfterFoundation=context.renderJapaneseReading('みず','みず',{state:{romajiMode:'auto',foundationDay:24,foundationComplete:true}});
assert.equal(kanaAfterFoundation,'みず','kana-only text should stop showing redundant reading support after foundation');

console.log('reading support contracts: ok');
