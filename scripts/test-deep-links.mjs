import fs from 'node:fs';import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8');
for(const token of ['ROUTABLE_VIEWS','routeFromLocation','routeUrl','commitRouteUrl',"'pushState'",'popstate',"?id:'auth'"])assert.ok(app.includes(token),'missing deep-link contract '+token);
assert.ok(app.includes("searchParams.get('view')"),'route must read ?view');
assert.ok(app.includes("searchParams.set('view',id)"),'non-home routes must write ?view');
assert.ok(app.includes("if(id==='auth')url.searchParams.delete('view')"),'auth route must keep canonical root URL clean');
assert.ok(app.includes("go(initialRoute,{history:false,replace:true})"),'initial route must hydrate without duplicating history');
assert.ok(app.includes("go(routeFromLocation(),{history:false})"),'browser back/forward must restore MON view');
console.log('MON deep-link navigation contracts passed');