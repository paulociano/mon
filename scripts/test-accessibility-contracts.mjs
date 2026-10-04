import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const css=fs.readFileSync('styles.css','utf8');

assert.ok(html.includes('<a class="skip-link" href="#mainContent">'),'skip link must target main content');
assert.ok(html.includes('<main id="mainContent" tabindex="-1">'),'main landmark must be programmatically focusable');
assert.ok(html.includes('data-view="home" aria-current="page"'),'initial navigation state must be exposed');
assert.ok(!/tabindex=["']?[1-9]\d*/i.test(html),'positive tabindex values are forbidden');

for(const token of [
 "activeView.setAttribute('tabindex','-1')",
 "activeView.focus({preventScroll:true})",
 "setAttribute('aria-current','page')",
 "removeAttribute('aria-current')",
 "toggle.setAttribute('aria-expanded',String(open))"
])assert.ok(app.includes(token),'missing runtime accessibility contract '+token);

assert.ok(css.includes('.skip-link:focus'),'skip link must become visible on focus');
assert.ok(css.includes(':focus-visible'),'global visible focus treatment missing');
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'),'reduced-motion fallback missing');
assert.ok(css.includes('animation-duration:.01ms!important'),'reduced-motion must suppress ambient animation');

console.log('MON accessibility contracts passed');
