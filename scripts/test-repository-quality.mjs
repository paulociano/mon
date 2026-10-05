import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html');
const app=read('app.js');
const workflow=read('.github/workflows/quality.yml');

for(const required of ['README.md','SECURITY.md','CONTRIBUTING.md','.github/CODEOWNERS','.github/dependabot.yml']){
  assert.ok(fs.existsSync(path.join(root,required)),`missing repository governance file: ${required}`);
}

assert.match(html,/<html\s+lang=["'][^"']+["']/i,'document language is required');
assert.match(html,/<meta\s+name=["']viewport["'][^>]+>/i,'viewport metadata is required');
assert.match(html,/<meta\s+name=["']description["'][^>]+content=["'][^"']+["']/i,'meta description is required');
assert.match(html,/<title>[^<]+<\/title>/i,'non-empty title is required');

for(const tag of [...html.matchAll(/<img\b[^>]*>/gi)].map(m=>m[0])){
  assert.match(tag,/\balt=["'][^"']*["']/i,`image missing alt attribute: ${tag.slice(0,120)}`);
}

assert.ok(!/tabindex=["']?[1-9]\d*/i.test(html),'positive tabindex values are not allowed');
assert.ok(!/\sautofocus(?:\s|=|>)/i.test(html),'autofocus is not allowed without explicit UX review');
assert.ok(app.includes("prefers-reduced-motion: reduce"),'runtime should respect reduced-motion preference');

for(const source of [html,app]){
  assert.ok(!/\beval\s*\(/.test(source),'eval() is not allowed');
  assert.ok(!/\bnew\s+Function\s*\(/.test(source),'new Function() is not allowed');
  assert.ok(!/document\.write\s*\(/.test(source),'document.write() is not allowed');
}

const externalExecutable=[...html.matchAll(/<(?:script|link)\b[^>]+(?:src|href)=["'](https?:\/\/[^"']+)["'][^>]*>/gi)].map(m=>m[1]);
assert.equal(externalExecutable.length,0,`external executable/style dependencies require explicit review: ${externalExecutable.join(', ')}`);

assert.match(workflow,/permissions:\s*\n\s+contents:\s*read/,'GitHub Actions must keep least-privilege contents: read');
assert.match(workflow,/actions\/checkout@[0-9a-f]{40}/,'checkout action must be pinned to a full commit SHA');

const textExtensions=new Set(['.js','.mjs','.html','.css','.md','.json','.yml','.yaml','.svg']);
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(['.git','node_modules','test-results'].includes(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())walk(full);
    else if(textExtensions.has(path.extname(entry.name))){
      const value=fs.readFileSync(full,'utf8');
      assert.ok(!/^(<<<<<<<|=======|>>>>>>>)/m.test(value),`merge conflict marker found in ${path.relative(root,full)}`);
      assert.ok(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(value),`private key material found in ${path.relative(root,full)}`);
    }
  }
}
walk(root);

console.log('MON repository quality and security contracts passed');
