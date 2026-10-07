(()=>{
const KEY='mon-runtime-health-v1',MAX_AGE=7*24*60*60*1000,MAX_EVENTS=50;
const release=document.querySelector('meta[name="mon-release"]')?.content||'unknown';
function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}}
function write(events){try{localStorage.setItem(KEY,JSON.stringify(events))}catch{}}
function record(type){
 const now=Date.now(),events=read().filter(e=>Number(e.at)>=now-MAX_AGE);
 events.push({type:String(type),at:now,release});
 write(events.slice(-MAX_EVENTS));
}
function summary(){
 const now=Date.now(),events=read().filter(e=>Number(e.at)>=now-MAX_AGE),counts={};
 for(const e of events)counts[e.type]=(counts[e.type]||0)+1;
 return {release,windowDays:7,total:events.length,counts,lastEventAt:events.at(-1)?.at||null};
}
addEventListener('error',event=>record(event instanceof ErrorEvent?'js-error':'resource-error'),true);
addEventListener('unhandledrejection',()=>record('promise-rejection'));
globalThis.MON_RUNTIME_HEALTH=Object.freeze({record,summary,clear:()=>{try{localStorage.removeItem(KEY)}catch{}}});
write(read().filter(e=>Number(e.at)>=Date.now()-MAX_AGE).slice(-MAX_EVENTS));

const MON_STYLE_PROPS=new Set(['width','height','display','color','--progress','--goal','--rx','--ry','--reveal-delay','--score','--p']);
const monStyleRules=new Map(),monStyleState=new WeakMap();let monStyleSeq=0;
function monRuntimeStyleSheet(){const sheet=[...document.styleSheets].find(x=>{try{return x.href&&new URL(x.href,location.href).pathname.endsWith('/styles.css')&&x.cssRules}catch{return false}});if(!sheet)throw new Error('MON stylesheet unavailable');return sheet}
function monStyle(el,prop,value){if(!el)return;if(!MON_STYLE_PROPS.has(prop))throw new Error('blocked MON style property');const state=monStyleState.get(el)||Object.create(null),old=state[prop];if(old)el.classList.remove(old);if(value===''||value==null){delete state[prop];monStyleState.set(el,state);return}const v=String(value);if(/[;{}]/.test(v)||/url\s*\(/i.test(v))throw new Error('blocked MON style value');const key=prop+'\u0000'+v;let cls=monStyleRules.get(key);if(!cls){cls='mon-dyn-'+(++monStyleSeq);const sheet=monRuntimeStyleSheet();sheet.insertRule('.'+cls+'{'+prop+':'+v+'}',sheet.cssRules.length);monStyleRules.set(key,cls)}el.classList.add(cls);state[prop]=cls;monStyleState.set(el,state)}
globalThis.monStyle=monStyle;

function monApplyStyleAttrs(root=document){const nodes=[];if(root?.nodeType===1&&root.matches?.('[data-mon-width],[data-mon-p]'))nodes.push(root);root?.querySelectorAll?.('[data-mon-width],[data-mon-p]').forEach(x=>nodes.push(x));for(const el of nodes){if(el.dataset.monWidth!=null)monStyle(el,'width',el.dataset.monWidth);if(el.dataset.monP!=null)monStyle(el,'--p',el.dataset.monP)}}
globalThis.monApplyStyleAttrs=monApplyStyleAttrs;
monApplyStyleAttrs(document);
new MutationObserver(list=>{for(const m of list){for(const n of m.addedNodes)if(n.nodeType===1)monApplyStyleAttrs(n);if(m.type==='attributes')monApplyStyleAttrs(m.target)}}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-mon-width','data-mon-p']});

const ACTIONS=new Set(`addSentenceToken answerConfusion answerKanaQuiz answerKanjiContrast answerKanjiMeaning answerKanjiReading answerMissionV2 answerSoundQuiz applyDiagnosticScore applyMonUpdate beginSession buyItem claimPathChest checkSentencePuzzle clearSessionCanvas closeGrammarDrawer completeKanjiStudy completeMonPasswordRecovery disconnectMonCloud exitQuickLesson exportMonBackup finishOnboarding finishQuickLesson finishSpeaking finishWriting foundationSpeak go gradeKanji matchTap missionFreeSpeech missionOpen missionShowChoices newConfusionQuestion newKanaQuiz nextSentencePuzzle nextSessionStep nextShadow openFoundationUnit openGrammarDrawer openVideo playSoundQuiz practiceConfusion previewFoundationKana pronRecord pronSpeak quickCheck quickOpenSpeech quickRevealModel quickRoleplayAttempt quickSelect quickShadow quickSpeech quickTypedInput quickWordbankHint ratePron removeSentenceToken renderConjugation renderKanjiAtlas renderKanjiFocus renderMissionV2 requestMonPasswordReset resetMissionV2 resetSentencePuzzle resolveMonCloudConflict revealWriting runJourneyPrimary saveUserArea selectConjugation selectKanji sessionChoose sessionSpeech setGrammarNotebookFilter setGrammarNotebookQuery setKanaQuizDirection setKanjiLabMode setKanjiStudyStep setMonCloudPassword setPronTrack setVideoFilter showGrammarSelfCheck showProfileSummary signInMonCloud signUpMonCloud speak speakCurrentKana speakSentenceAnswer startDiagnostic startFoundationSession startGrammarNotebookReview startKanjiContrast startKanjiStudy startMissionV2 startMistakePractice startMasteryRepair startQuickLesson startSession startSmartReview startVideoPractice syncMonNow toast toggleKanjiLibrary toggleRomajiMode wordTap wordUntap`.split(' '));
function splitTop(value,sep){
 const out=[];let part='',quote='',escape=false,depth=0;
 for(const ch of String(value||'')){
  if(escape){part+=ch;escape=false;continue}
  if(quote){part+=ch;if(ch==='\\')escape=true;else if(ch===quote)quote='';continue}
  if(ch==="'"||ch==='"'){quote=ch;part+=ch;continue}
  if(ch==='('||ch==='['||ch==='{')depth++;
  else if(ch===')'||ch===']'||ch==='}')depth=Math.max(0,depth-1);
  if(ch===sep&&depth===0){if(part.trim())out.push(part.trim());part='';continue}
  part+=ch;
 }
 if(part.trim())out.push(part.trim());
 return out;
}
function unquote(token){
 const q=token[0],body=token.slice(1,-1);
 return body.replace(/\\(['"\\nrt])/g,(_,x)=>x==='n'?'\n':x==='r'?'\r':x==='t'?'\t':x);
}
function arg(token,ctx){
 const t=token.trim();
 if(t==='this')return ctx.el;
 if(t==='event')return ctx.event;
 if(t==='this.value')return ctx.el?.value;
 if(t==='null')return null;
 if(t==='true')return true;
 if(t==='false')return false;
 if(/^[-+]?\d+(?:\.\d+)?$/.test(t))return Number(t);
 if((t.startsWith("'")&&t.endsWith("'"))||(t.startsWith('"')&&t.endsWith('"')))return unquote(t);
 throw new Error('unsupported MON action argument');
}
function invoke(expr,ctx){
 const m=expr.match(/^([A-Za-z_$][\w$]*)\((.*)\)$/s);
 if(!m||!ACTIONS.has(m[1]))throw new Error('blocked MON action');
 const fn=globalThis[m[1]];
 if(typeof fn!=='function')throw new Error('MON action unavailable: '+m[1]);
 const args=m[2].trim()?splitTop(m[2],',').map(x=>arg(x,ctx)):[];
 return fn(...args);
}
function run(command,ctx){
 for(const stmt of splitTop(command,';')){
  if(stmt==='return false'){ctx.event.preventDefault();continue}
  if(stmt==='event.stopPropagation()'){ctx.event.stopPropagation();continue}
  const conditional=stmt.match(/^if\(event\.target===this\)(.+)$/s);
  if(conditional){if(ctx.event.target===ctx.el)invoke(conditional[1],ctx);continue}
  const scroll=stmt.match(/^document\.getElementById\((['"])([^'"]+)\1\)\?\.scrollIntoView\(\)$/);
  if(scroll){document.getElementById(scroll[2])?.scrollIntoView();continue}
  invoke(stmt,ctx);
 }
}
document.addEventListener('click',event=>{
 const el=event.target.closest?.('[data-mon-command]');
 if(!el)return;
 try{run(el.dataset.monCommand,{event,el})}catch(err){record('ui-action-error');console.error('MON UI action blocked',err)}
});
document.addEventListener('input',event=>{
 const el=event.target.closest?.('[data-mon-input-command]');
 if(!el)return;
 try{run(el.dataset.monInputCommand,{event,el})}catch(err){record('ui-action-error');console.error('MON input action blocked',err)}
});
})();