import fs from 'node:fs';
import assert from 'node:assert/strict';

const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const journal=fs.readFileSync('features/journal.js','utf8');
const state=fs.readFileSync('core/state.js','utf8');

assert.ok(app.includes("journal:['./data/narrative.js','./core/narrative-state.js','./features/journal.js']"));
assert.ok(app.includes('function renderHomeJournalSummary()'));
assert.ok(!app.includes('narrativeEpisodes['),'Home shell should not depend on full narrative catalog');
assert.ok(html.includes('id="journalContent"'));
assert.ok(html.includes('id="journalMiniTitle"'));
assert.ok(journal.includes('function renderJournal()'));
assert.ok(journal.includes('narrativeJournalModel()'));
assert.ok(state.includes('narrative:{episodes:{}'),'default state needs narrative progress');
console.log('MON Japan Journal contracts passed');
