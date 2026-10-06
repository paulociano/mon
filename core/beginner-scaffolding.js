// MON beginner reconstruction scaffolding · loaded with the learning runtime.
const FOUNDATION_BUILD_BLOCKS={
 13:'わたし|は|パウロ|です',14:'わたし|は|パウロ|です',15:'これ|は|なん|ですか',
 16:'これ|は|わたし|の|ほん|です',17:'みず|を|のみます',18:'しちじ|に|えき|へ|いきます',
 19:'きのう|えき|に|いきました',20:'この|みせ|は|やすい|です',
 21:'えき|の|まえ|に|みせ|が|あります',22:'いま|なんじ|ですか',
 23:'ちょっと|まって|ください',
 24:'にほんご|が|まだ|よく|わかりません|ゆっくり|おねがいします'
};
const FOUNDATION_BUILD_HINTS={
 13:'encontre os blocos → localize a partícula → observe o predicado no fim',
 14:'tópico → は → informação sobre o tópico → です',
 15:'coisa apontada → は → informação desconhecida → ですか',
 16:'tópico → は → pessoa → の → objeto → です',
 17:'objeto → を → ação polida no fim',
 18:'hora → に → direção/destino → へ → ação',
 19:'tempo → destino → に → ação no passado',
 20:'este/esta → lugar → は → qualidade → です',
 21:'lugar de existência → に → coisa apresentada → が → あります',
 22:'agora → que horas → ですか',
 23:'ちょっと + ação em forma て + ください',
 24:'japonês → が → ainda → bem → não entender; depois peça fala mais lenta'
};
function semanticSentenceBuildTokens(text){
 const clean=String(text||'').replace(/[。！？!?]/g,'').trim(),out=[];
 if(!clean)return out;
 const starts=['すみません','いいえ','はい','でも','こちらこそ','つまり'],ends=['お願いします','おねがいします','てもらえますか','ないといけません','ませんでした','ませんか','ましょう','ました','ません','ですか','でした','です','ます'];
 for(let rest of clean.split('、').filter(Boolean)){
  const s=starts.find(x=>rest.startsWith(x)&&rest!==x);if(s){out.push(s);rest=rest.slice(s.length)}
  const e=ends.find(x=>rest.endsWith(x)&&rest!==x);if(e){const stem=rest.slice(0,-e.length);if(stem)out.push(stem);out.push(e)}else if(rest)out.push(rest);
 }
 return out.length>1?out:[clean];
}
function guidedFoundationBuild(day,p,prompt){
 if(day<=12)return {type:'wordbank',prompt:'Reconstrua a palavra com os kana estudados.',target:p.word,tokens:[...p.word],cue:`“${p.pt}” · leitura ${p.wordReading}`,hint:'Reconstrua o som que você acabou de praticar. Use um kana por vez; romaji é só ponte temporária.',why:'Leia em unidades de mora, não em letras portuguesas.'};
 const target=p.phrase.replace(/[。！？!?、]/g,''),tokens=(FOUNDATION_BUILD_BLOCKS[day]||target).split('|');
 return {type:'wordbank',prompt,target,tokens:tokens.join('')===target?tokens:[target],cue:p.phrasePt,hint:FOUNDATION_BUILD_HINTS[day]||'Intenção primeiro; depois partículas e ação.',why:'Reconstrução guiada: intenção primeiro, blocos linguísticos depois.'};
}
function guidedSentenceBuild(s){
 const target=s.reply.replace(/[。！？!?]/g,'');
 return {type:'wordbank',prompt:'Monte a resposta em blocos de sentido.',target,tokens:s.replyBlocks||semanticSentenceBuildTokens(s.reply),cue:s.replyPt,hint:'Comece pela intenção. Preserve expressões fixas e terminações como blocos inteiros.',why:`${s.reply} · ${s.replyPt}`};
}
function guidedMissionBuild(sp){
 return {type:'wordbank',prompt:'Reconstrua a resposta em blocos de sentido.',target:sp.target.replace(/[。！？!?]/g,''),tokens:semanticSentenceBuildTokens(sp.target),cue:sp.pt,hint:'Use a intenção para escolher o primeiro bloco; preserve expressões fixas e terminações.',why:sp.pt};
}
function renderGuidedWordbank(e){
 const cue=e.cue?`<div class="wordbank-cue"><span>intenção</span><strong>${e.cue}</strong></div>`:'';
 const bank=`<div class="word-built" id="wordBuilt"><span class="wordbank-empty">comece pelo bloco que carrega a ideia principal</span></div><div class="word-bank" id="wordBank">${shuffleArray(e.tokens.map((t,i)=>({t,i}))).map(x=>`<button class="word-token" data-wb="${x.i}" data-mon-command="wordTap(${x.i},this)">${x.t}</button>`).join('')}</div>`;
 const hint=e.hint?'<button class="method-reveal wordbank-hint-button" data-mon-command="quickWordbankHint()">preciso de uma pista</button><div id="wordbankHint" class="wordbank-hint"></div>':'';
 return cue+bank+hint;
}
function quickWordbankHint(){
 const e=quickRun?.pack.exercises[quickRun.step],box=document.getElementById('wordbankHint');
 if(!e?.hint||!box)return;box.textContent=e.hint;box.classList.add('show');quickRun.hintUsed=true;
}
