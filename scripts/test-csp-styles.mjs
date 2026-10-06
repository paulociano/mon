import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const roots=['index.html','app.js','core','features','data','legal'];
const files=[];
function add(p){
 const full=path.join(process.cwd(),p);
 if(!fs.existsSync(full))return;
 const st=fs.statSync(full);
 if(st.isDirectory())for(const name of fs.readdirSync(full))add(path.join(p,name));
 else if(/\.(?:html|js)$/.test(p))files.push(p);
}
roots.forEach(add);

for(const file of files){
 const source=fs.readFileSync(file,'utf8');
 assert.ok(!/\bstyle\s*=\s*["'`]/i.test(source),`inline style attribute remains in ${file}`);
 assert.ok(!/\.style(?:\.|\[)/.test(source),`direct element.style mutation remains in ${file}`);
 assert.ok(!/\.style\.setProperty\s*\(/.test(source),`style.setProperty remains in ${file}`);
}

const html=fs.readFileSync('index.html','utf8');
const csp=html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/i)?.[1]||'';
const styleSrc=csp.split(';').map(x=>x.trim()).find(x=>x.startsWith('style-src '))||'';
assert.ok(styleSrc,'style-src directive is required');
assert.ok(styleSrc.includes("'self'"),'style-src must allow same-origin stylesheets');
assert.ok(!styleSrc.includes("'unsafe-inline'"),'style-src must not allow unsafe-inline');
assert.ok(!/<style\b[^>]*>[\s\S]*?<\/style>/i.test(html),'inline style block remains in index.html');

const runtime=fs.readFileSync('core/runtime-health.js','utf8');
for(const token of ['MON_STYLE_PROPS','monRuntimeStyleSheet','function monStyle(','data-mon-width','data-mon-p']){
 assert.ok(runtime.includes(token),'CSP style bridge contract missing '+token);
}
assert.ok(runtime.includes('sheet.insertRule'),'dynamic styles must be emitted through the allowed external stylesheet CSSOM');

console.log('MON CSP style contracts passed');
