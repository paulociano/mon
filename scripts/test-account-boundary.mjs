import fs from 'node:fs';import assert from 'node:assert/strict';
const core=fs.readFileSync('core/account.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
for(const token of ['MON_ACCOUNT_KEY','MON_SYNC_VERSION','createMonLocalId','normalizeMonAccount','loadMonAccount','saveMonAccount','monSyncPayload','validateMonBackup','importMonBackup','ensureMonBackupImportControl'])assert.ok(core.includes(token),'missing account boundary '+token);
const sync=fs.readFileSync('core/multi-device-sync.js','utf8');
for(const token of ['monCloudAvailable','monCloudReconcile','scheduleMonCloudSync','resolveMonCloudConflict','monCloudBootstrap'])assert.ok(sync.includes(token),'missing multi-device sync '+token);
assert.ok(app.includes("'./core/account.js'"),'account runtime must be loaded');
assert.ok(app.includes("'./core/multi-device-sync.js'"),'multi-device coordinator must be lazy-loaded with account runtime');
assert.ok(app.includes("localStorage.getItem('mon-cloud-linked')"),'linked devices should resume sync lazily');
assert.ok(fs.readFileSync('features/user.js','utf8').includes('monAccountStatus()'),'user area must expose account state');
assert.ok(core.includes('function exportMonBackup()')&&core.includes('monSyncPayload('),'backup must use versioned sync payload');
assert.ok(core.includes('ensureMonBackupImportControl'),'lazy account runtime must mount validated backup import');
for(const token of ['exportMonBackup'])assert.ok(core.includes(token),'account action must stay lazy '+token);
for(const token of ['renderCloudAccountPanel','disconnectMonCloud','syncMonNow','resolveMonCloudConflict'])assert.ok(sync.includes(token),'sync action must stay lazy '+token);
const userUi=fs.readFileSync('features/user.js','utf8');
for(const token of ['signUpMonCloud','signInMonCloud','setMonCloudPassword'])assert.ok(userUi.includes(token),'account auth action must stay inside lazy user boundary '+token);
assert.ok(!html.toLowerCase().includes('entrar com google'),'shell must not advertise unavailable auth');
console.log('MON account boundary contracts passed');

const profileSummary=app.match(/function showProfileSummary\(\)\{([^}]*)\}/)?.[1]||'';
assert.ok(profileSummary.includes("go('user')"),'profile summary must route through the user lazy boundary');
assert.ok(!profileSummary.includes('ensureUserArea('),'profile summary must not touch lazy user symbols before account runtime loads');

assert.ok(sync.includes("identity.textContent=session.user.email||'usuário'"),'account identity must render without HTML interpolation');
assert.ok(!sync.includes('escapeHtml('),'account sync UI must not reference undefined escapeHtml');
