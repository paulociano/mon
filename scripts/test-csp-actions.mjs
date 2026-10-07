import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=process.cwd();
const runtimeRoots=['index.html','app.js','core','features','data','legal'];
const files=[];
function add(p){
 const full=path.join(root,p);
 if(!fs.existsSync(full))return;
 const st=fs.statSync(full);
 if(st.isDirectory())for(const name of fs.readdirSync(full))add(path.join(p,name));
 else if(/\.(?:html|js)$/.test(p))files.push(p);
}
runtimeRoots.forEach(add);

for(const file of files){
 const source=fs.readFileSync(file,'utf8');
 assert.ok(!/\bon(?:click|input)\s*=\s*["'`]/i.test(source),`inline event attribute remains in ${file}`);
 assert.ok(!/\beval\s*\(/.test(source),`eval() is forbidden in ${file}`);
 assert.ok(!/\bnew\s+Function\s*\(/.test(source),`new Function() is forbidden in ${file}`);
}

const html=fs.readFileSync('index.html','utf8');
const csp=html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/i)?.[1]||'';
const scriptSrc=csp.split(';').map(x=>x.trim()).find(x=>x.startsWith('script-src '))||'';
assert.ok(scriptSrc,'script-src directive is required');
assert.ok(!scriptSrc.includes("'unsafe-inline'"),'script-src must not allow unsafe-inline');
assert.ok(scriptSrc.includes("'self'"),'script-src must allow same-origin application scripts');
assert.ok(!/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/i.test(html),'inline script block remains in index.html');
assert.ok(html.includes('<script src="./core/runtime-health.js"></script><script src="./app.js"></script>'),'CSP-safe runtime dispatcher must load before app.js');

const runtime=fs.readFileSync('core/runtime-health.js','utf8');
for(const token of ['data-mon-command','data-mon-input-command','ACTIONS=new Set','blocked MON action']){
 assert.ok(runtime.includes(token),'CSP dispatcher contract missing '+token);
}
assert.ok(!runtime.includes('eval('),'dispatcher must not use eval');
assert.ok(!runtime.includes('new Function'),'dispatcher must not use new Function');

const app=fs.readFileSync('app.js','utf8');
assert.ok(app.includes("ensureAccountRuntime().then(()=>monCloudBootstrap())"),'cloud bootstrap must resolve only after lazy account runtime loads');
for(const action of ['startMasteryRepair','claimPathChest','startQuickLesson','finishQuickLesson']){
 assert.ok(runtime.includes(action),`CSP dispatcher allowlist missing dynamic path action ${action}`);
}

const lesson=fs.readFileSync('features/lesson.js','utf8');
assert.ok(lesson.includes("function finishQuickLesson(destination='home'){quickRun=null;go(destination)}"),'lesson completion action must clear the active lesson before routing');
assert.ok(lesson.includes("finishQuickLesson('${practice||outOfEnergy?'practice':'home'}')"),'lesson completion must route through an allowlisted action');
assert.ok(!lesson.includes("quickRun=null;go('${practice||outOfEnergy?'practice':'home'}')"),'lesson result must not generate blocked assignment statements');

console.log('MON CSP script and declarative UI action contracts passed');
