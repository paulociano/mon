import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html');
const shellContent=read('data/course-content.js');
const css=read('styles.css');
const foundationCss=read('features/foundation.css');
const sw=read('sw.js');
const app=read('app.js');

const refs=[...html.matchAll(/<(?:script[^>]+src|link[^>]+href)="([^"]+)"/g)].map(m=>m[1]).filter(x=>x.startsWith('./'));
const cssRefs=[...css.matchAll(/url\(['"]?(\.\/[^'")]+)['"]?\)/g)].map(m=>m[1]);
const featureCssRefs=[...foundationCss.matchAll(/url\(['"]?(\.\.\/[^'")]+)['"]?\)/g)].map(m=>m[1]).map(r=>'./'+r.slice(3));
const localRefs=[...new Set([...refs,...cssRefs,...featureCssRefs])];
const missing=localRefs.filter(r=>!fs.existsSync(path.join(root,r.slice(2))));
if(missing.length)throw new Error('Missing local refs: '+missing.join(', '));

const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const duplicateIds=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
if(duplicateIds.length)throw new Error('Duplicate HTML ids: '+duplicateIds.join(', '));

const scriptOrder=[
 './data/course-content.js',
 './core/state.js',
 './core/review-scheduler.js',
 './core/performance.js',
 './core/home-coach.js',
 './app.js'
];
const featureRuntime=['./features/missions-v2.css','./features/missions-v2.js','./data/missions-v2.js','./features/kanji-memory.css','./features/kanji-memory.js','./data/kanji-memory.js','./data/pronunciation.js','./features/pronunciation.js','./features/pronunciation.css','./features/videos.js','./features/videos.css','./core/narrative-state.js','./features/journal.js','./features/journal.css','./data/narrative.js','./features/lesson.js','./features/lesson.css','./features/practice.js','./features/practice.css','./data/kanji.js','./data/kana.js','./data/foundation.js','./data/session.js','./data/experiences.js','./data/curriculum.js','./features/foundation.js','./features/foundation.css','./features/session.js','./features/kanji.js','./features/experiences.js'];
const debugRuntime=['./features/performance-lab.js','./features/performance-lab.css'];
const lazyRuntime=[
 './data/content-packs.js',
 './core/next-best-lesson.js',
 './core/mistakes.js',
 './core/mastery-graph.js',
 './core/learning-methods.js',
 './core/course-engine.js',
 './core/progression-engine.js'
];
let cursor=-1;
for(const src of scriptOrder){
 const p=html.indexOf(`src="${src}"`);
 if(p<0)throw new Error('Missing script tag: '+src);
 if(p<=cursor)throw new Error('Invalid script order around '+src);
 cursor=p;
}

for(const asset of scriptOrder){
 if(!sw.includes(`'${asset}'`))throw new Error('PWA shell cache missing '+asset);
}
for(const src of [...lazyRuntime,...featureRuntime]){
 if(html.includes(`src="${src}"`))throw new Error('Lazy runtime leaked into critical HTML: '+src);
 if(!app.includes(`'${src}'`))throw new Error('Lazy runtime loader missing '+src);
 if(!fs.existsSync(path.join(root,src.slice(2))))throw new Error('Lazy runtime file missing '+src);
}

const requiredIds=['learningPath','quickMain','quickFeedback','quickCheck','masteryMap','reviewDeck','mistakeNotebook','toast'];
for(const id of requiredIds){
 if(!html.includes(`id="${id}"`))throw new Error('Required UI id missing: '+id);
}

console.log('MON static verification passed');
for(const asset of ['./assets/scene/mon-home-banner.webp','./assets/scene/mon-sidebar-bg.webp']){if(!sw.includes(`'${asset}'`))throw new Error('PWA cache missing visual asset '+asset)}
for(const cls of ['unit-progress','unit-status','node-halo','rail-card-label','home-reveal']){if(!css.includes('.'+cls)&&!html.includes('class="'+cls))throw new Error('Missing home polish contract '+cls)}
if(!app.includes('queueHomePolish'))throw new Error('Missing progressive home reveal runtime')
if(!app.includes('aria-current="step"'))throw new Error('Current path step lacks aria-current')
if(!html.includes('fetchpriority="high"'))throw new Error('Hero preload should be high priority')
if(!app.includes('ensureLearningRuntime'))throw new Error('Missing lazy learning runtime loader')
if(!app.includes('loadRuntimeStyle'))throw new Error('Missing lazy feature stylesheet loader')
const homeCoach=read('core/home-coach.js');
if(!homeCoach.includes('homeCoachDecision'))throw new Error('Adaptive Home policy missing')
if(!app.includes('homeCoachDecision(state,flatPath)'))throw new Error('Home runtime is not consuming Home Coach')
if(!html.includes('id="routeLoader"'))throw new Error('Missing route loading feedback')
if(!html.includes('aria-live="polite"'))throw new Error('Lesson feedback should expose a polite live region')
if(!app.includes("lesson:['./features/lesson.js']"))throw new Error('Lesson UI must stay lazy')
if(!app.includes("practice:['./features/practice.js']"))throw new Error('Practice Hub must stay lazy')
const narrative=read('data/narrative.js');
if(!narrative.includes('narrativeEpisodeForUnit'))throw new Error('Narrative network missing')
if(!narrative.includes('narrativeEchoExercise'))throw new Error('Narrative transfer exercise missing')
if(!html.includes('id="practiceCoach"'))throw new Error('Practice recommendation surface missing')
if(!html.includes('id="journalContent"'))throw new Error('Japan Journal view missing')
if(!html.includes('id="videoGrid"'))throw new Error('Video Library view missing')
if(!html.includes('id="pronLab"'))throw new Error('Pronunciation Lab view missing')
if(!html.includes('id="kanjiMemoryLab"'))throw new Error('Kanji Memory Lab surface missing')
if(!html.includes('id="missionRunner"'))throw new Error('Survival Mission runner missing')
if(!app.includes("'./data/kanji-memory.js'"))throw new Error('Kanji Memory dataset must stay lazy')
if(!app.includes("'./data/missions-v2.js'"))throw new Error('Survival Missions dataset must stay lazy')
if(!app.includes("pronunciation:['./data/pronunciation.js','./features/pronunciation.js']"))throw new Error('Pronunciation Lab must stay lazy')
if(!app.includes("videos:['./features/videos.js']"))throw new Error('Video Library must stay lazy')
if(!html.includes('data-view="journal"'))throw new Error('Japan Journal navigation missing')
if(!app.includes("journal:['./data/narrative.js','./core/narrative-state.js','./features/journal.js']"))throw new Error('Japan Journal must stay lazy')
const perfModule=read('core/performance.js');
for(const src of debugRuntime){
 if(!fs.existsSync(path.join(root,src.slice(2))))throw new Error('Debug runtime file missing '+src);
 if(!perfModule.includes(src))throw new Error('Debug runtime loader missing '+src);
}
if(!shellContent.includes('SHELL_FOUNDATION_TOTAL'))throw new Error('Shell content outline missing')
if(shellContent.includes('const kanjiData'))throw new Error('Kanji catalog leaked into eager shell content')
if(shellContent.includes('const grammarData'))throw new Error('Grammar catalog leaked into eager shell content')

if(!perfModule.includes('performanceSnapshot'))throw new Error('Missing local performance telemetry snapshot')
if(perfModule.includes('fetch(')||perfModule.includes('sendBeacon'))throw new Error('Performance telemetry must remain local-only')
if(!perfModule.includes('performanceResourceSnapshot'))throw new Error('Resource performance snapshot missing')
console.log(`Checked ${localRefs.length} local refs, ${ids.length} ids and ${scriptOrder.length} runtime modules.`);
