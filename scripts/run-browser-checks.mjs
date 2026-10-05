import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
const root=process.cwd();
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost'),file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(root+path.sep)||!fs.statSync(file).isFile())throw Error('not found');
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});fs.createReadStream(file).pipe(res);
 }catch{res.writeHead(404);res.end('Not found')}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const checks=process.argv.slice(2);
try{
 for(const name of checks.length?checks:['test-browser-smoke.mjs','test-reliability-browser.mjs','test-offline-smoke.mjs','test-responsive-smoke.mjs']){
  const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['scripts/'+name],{stdio:'inherit',env:{...process.env,MON_SMOKE_URL:base}});child.on('error',reject);child.on('exit',resolve)});
  if(code!==0){process.exitCode=1;break}
 }
}finally{server.closeAllConnections();server.close()}
