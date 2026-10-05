if(typeof document!=='undefined'&&!document.querySelector('link[data-mon-reading-support]')){
 const link=document.createElement('link');link.rel='stylesheet';link.href='./features/reading-support.css';link.dataset.monReadingSupport='1';document.head.appendChild(link);
}
// MON adaptive reading support · romaji above Japanese when the reading is reliable.
const MON_KANA_ROMAJI={
 'あ':'a','い':'i','う':'u','え':'e','お':'o','か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
 'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so','た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
 'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no','は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
 'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo','や':'ya','ゆ':'yu','よ':'yo',
 'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro','わ':'wa','を':'wo','ん':'n',
 'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go','ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
 'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do','ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
 'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
 'ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o','ゔ':'vu'
};
const MON_KANA_DIGRAPHS={
 'きゃ':'kya','きゅ':'kyu','きょ':'kyo','しゃ':'sha','しゅ':'shu','しょ':'sho','ちゃ':'cha','ちゅ':'chu','ちょ':'cho',
 'にゃ':'nya','にゅ':'nyu','にょ':'nyo','ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo','みゃ':'mya','みゅ':'myu','みょ':'myo',
 'りゃ':'rya','りゅ':'ryu','りょ':'ryo','ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo','じゃ':'ja','じゅ':'ju','じょ':'jo',
 'びゃ':'bya','びゅ':'byu','びょ':'byo','ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
 'ふぁ':'fa','ふぃ':'fi','ふぇ':'fe','ふぉ':'fo','てぃ':'ti','でぃ':'di','とぅ':'tu','どぅ':'du',
 'うぃ':'wi','うぇ':'we','うぉ':'wo','しぇ':'she','ちぇ':'che','じぇ':'je'
};
function monEscapeReadingHtml(value){
 return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function monKatakanaToHiragana(text){
 return [...String(text||'')].map(ch=>{const c=ch.charCodeAt(0);return c>=0x30A1&&c<=0x30F6?String.fromCharCode(c-0x60):ch}).join('');
}
function monLastVowel(text){
 const m=String(text||'').match(/[aeiou](?!.*[aeiou])/);return m?m[0]:'';
}
function monKanaToRomaji(text){
 const hira=monKatakanaToHiragana(text),out=[];let geminate=false;
 for(let i=0;i<hira.length;i++){
  const ch=hira[i];
  if(ch==='っ'){geminate=true;continue}
  if(ch==='ー'){const v=monLastVowel(out.join(''));if(v)out.push(v);continue}
  const pair=hira.slice(i,i+2);
  let r=MON_KANA_DIGRAPHS[pair];
  if(r){i++}else r=MON_KANA_ROMAJI[ch];
  if(!r){out.push(ch);geminate=false;continue}
  if(geminate){const consonant=r.startsWith('ch')?'t':r.startsWith('sh')?'s':r[0];if(consonant&&!/[aeioun]/.test(consonant))r=consonant+r;geminate=false}
  out.push(r);
 }
 return out.join('');
}
function monReadingMode(stateLike=typeof state!=='undefined'?state:null){
 const mode=stateLike?.romajiMode;return mode==='show'||mode==='hide'?mode:'auto';
}
function monReadingSupportClass(stateLike=typeof state!=='undefined'?state:null,mode=monReadingMode(stateLike),annotation='romaji'){
 if(mode==='show')return 'romaji-show';
 if(mode==='hide')return 'romaji-hide';
 const day=Math.max(1,Number(stateLike?.foundationDay||1));
 if(annotation==='furigana')return 'romaji-auto reading-furigana';
 if(day>8)return 'romaji-auto romaji-auto-faded';
 return 'romaji-auto';
}
function monContainsKanji(text){
 return /[\u3400-\u4dbf\u4e00-\u9fff]/.test(String(text||''));
}
function monKanaOnlyReading(text){
 const value=String(text||'').trim();
 return value&&/^[\u3040-\u30ffー・、。！？!?\s]+$/.test(value)?value:'';
}
function renderJapaneseReading(text,reading='',options={}){
 const jp=String(text??''),source=String(reading||monKanaOnlyReading(jp)||'');
 if(!source)return monEscapeReadingHtml(jp);
 const mode=options.mode||monReadingMode(options.state),stateLike=options.state||(typeof state!=='undefined'?state:null);
 const day=Math.max(1,Number(stateLike?.foundationDay||1)),pastFoundation=!!stateLike?.foundationComplete||day>12;
 let annotation='romaji',support=String(options.romaji||monKanaToRomaji(source)||'').trim();
 if(mode==='auto'&&pastFoundation){
  if(!monContainsKanji(jp))return monEscapeReadingHtml(jp);
  annotation='furigana';support=source;
 }
 if(!support)return monEscapeReadingHtml(jp);
 const klass=monReadingSupportClass(stateLike,mode,annotation);
 return `<ruby class="mon-reading ${klass}" data-reading-support="${mode}" data-reading-kind="${annotation}"><rb lang="ja">${monEscapeReadingHtml(jp)}</rb><rt aria-hidden="true">${monEscapeReadingHtml(support)}</rt></ruby>`;
}
if(typeof window!=='undefined')Object.assign(window,{monKanaToRomaji,renderJapaneseReading,monReadingMode,monReadingSupportClass,monContainsKanji});
