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
const authUi=fs.readFileSync('features/account-auth.js','utf8');
for(const token of ['signUpMonCloud','signInMonCloud','setMonCloudPassword'])assert.ok(authUi.includes(token),'account auth action must stay inside lazy account boundary '+token);
assert.ok(app.includes("'./features/account-auth.js'"),'account auth module must load with account runtime');
assert.ok(!html.toLowerCase().includes('entrar com google'),'shell must not advertise unavailable auth');
console.log('MON account boundary contracts passed');

const profileSummary=app.match(/function showProfileSummary\(\)\{([^}]*)\}/)?.[1]||'';
assert.ok(profileSummary.includes("go('user')"),'profile summary must route through the user lazy boundary');
assert.ok(!profileSummary.includes('ensureUserArea('),'profile summary must not touch lazy user symbols before account runtime loads');

assert.ok(sync.includes("identity.textContent=session.user.email||'usuário'"),'account identity must render without HTML interpolation');
assert.ok(!sync.includes('escapeHtml('),'account sync UI must not reference undefined escapeHtml');

assert.ok(app.includes("const MON_AUTH_RESET_MARKER='mon-auth-reset-password-v1'"),'fresh password auth rollout must have a one-time client reset marker');
for(const key of ['mon-account','mon-cloud-linked','mon-cloud-conflict-last','mon-sync-dirty-at','sb-gpmobddlexssivfxzzjw-auth-token'])assert.ok(app.includes(key),'auth reset must clear '+key);
assert.ok(!app.includes("localStorage.removeItem('mon-state')"),'auth reset must preserve learning state');
assert.ok(!app.includes("localStorage.removeItem('mon-profile')"),'auth reset must preserve local profile');
assert.ok(app.includes("k.startsWith('mon-japanese-os-')"),'auth reset must clear MON-owned PWA caches');
const userSource=fs.readFileSync('features/user.js','utf8');
assert.ok(userSource.includes('id="userAuthGate"'),'user route must expose an auth-first gate');
assert.ok(userSource.includes('id="userProfileShell" class="user-profile-shell" hidden'),'profile shell must start hidden until session verification');
assert.ok(sync.includes('profileShell.hidden=true'),'signed-out state must keep profile hidden');
assert.ok(sync.includes('profileShell.hidden=false'),'valid session must reveal profile');
