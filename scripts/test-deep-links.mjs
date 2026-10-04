import fs from 'node:fs';import assert from 'node:assert/strict';
const app=fs.readFileSync('app.js','utf8');
for(const token of ['ROUTABLE_VIEWS','routeFromLocation','routeUrl','commitRouteUrl','history.pushState','popstate'])assert.ok(app.includes(token),'missing deep-link contract '+token);
assert.ok(app.includes("searchParams.get('view')"),'route must read ?view');
assert.ok(app.includes("searchParams.set('view',id)"),'non-home routes must write ?view');
assert.ok(app.includes("searchParams.delete('view')"),'home route must keep canonical URL clean');
assert.ok(app.includes("go(initialRoute,{history:false})"),'initial deep link must hydrate without duplicating history');
assert.ok(app.includes("go(routeFromLocation(),{history:false})"),'browser back/forward must restore MON view');
console.log('MON deep-link navigation contracts passed');