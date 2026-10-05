import fs from 'node:fs';

const required=[
 'LICENSE',
 'legal/TERMS-OF-USE.md',
 'legal/PRIVACY-POLICY.md',
 'legal/DATA-RETENTION.md',
 'legal/SUBPROCESSORS.md',
 'legal/AGE-AND-CHILD-SAFETY.md',
 'legal/privacy.html',
 'legal/terms.html',
 'legal/legal-viewer.js',
 'legal/legal-viewer.css',
 'compliance/DATA-INVENTORY.md',
 'compliance/PROCESSING-REGISTER.md',
 'compliance/INCIDENT-RESPONSE.md',
 'compliance/LGPD-CONTROLS.md',
 'compliance/DPIA.md',
 'compliance/RELEASE-GATES.md',
 'compliance/SUPABASE-VENDOR-REVIEW.md',
 'compliance/SUPABASE-E2E-EVIDENCE.md'
];
for(const file of required){
 if(!fs.existsSync(file))throw new Error('missing legal/compliance file: '+file);
 if(fs.readFileSync(file,'utf8').trim().length<80)throw new Error('legal/compliance file too small: '+file);
}
const license=fs.readFileSync('LICENSE','utf8');
if(!license.includes('not open source'))throw new Error('LICENSE must state repository licensing model');

const schema=fs.readFileSync('supabase/schema.sql','utf8');
for(const requiredText of [
 'grant select, insert, update, delete',
 'mon users delete own state',
 'for delete to authenticated',
 'using ((select auth.uid()) = user_id)'
])if(!schema.includes(requiredText))throw new Error('cloud deletion control missing: '+requiredText);

const account=fs.readFileSync('features/account-privacy.js','utf8');
for(const requiredText of [
 'async function deleteMonCloudData',
 'async function deleteMonAccount',
 'Excluir Conta MON',
 ".delete().eq('user_id',session.user.id)",
 'Excluir dados da nuvem'
])if(!account.includes(requiredText))throw new Error('account deletion surface missing: '+requiredText);

const deleteFn=fs.readFileSync('supabase/functions/delete-account/index.ts','utf8');
for(const requiredText of [
 "auth.admin.deleteUser(user.id, false)",
 "auth.signOut({ scope: 'global' })",
 "userClient.auth.getUser(token)",
 "DELETE_MY_ACCOUNT",
 "SUPABASE_SECRET_KEYS",
 "SUPABASE_SERVICE_ROLE_KEY"
])if(!deleteFn.includes(requiredText))throw new Error('server-side account deletion control missing: '+requiredText);

const cloud=fs.readFileSync('features/account-privacy.js','utf8');
for(const requiredText of [
 "client.functions.invoke('delete-account'",
 "scope:'local'"
])if(!cloud.includes(requiredText))throw new Error('client account deletion integration missing: '+requiredText);

console.log('legal/compliance baseline ok');

const authPage=fs.readFileSync('features/auth-page.js','utf8');
for(const href of ['legal/privacy.html','legal/terms.html'])if(!authPage.includes(href))throw new Error('auth legal link missing: '+href);
for(const file of ['legal/privacy.html','legal/terms.html']){
 const html=fs.readFileSync(file,'utf8');
 if(!html.includes('baseline pré-produção'))throw new Error('legal page must disclose pre-launch status: '+file);
 if(!html.includes('legal-viewer.js'))throw new Error('legal page must load canonical source viewer: '+file);
}
const privacyControls=fs.readFileSync('features/account-privacy.js','utf8');
for(const href of ['legal/privacy.html','legal/terms.html'])if(!privacyControls.includes(href))throw new Error('account legal link missing: '+href);

const privacyPolicy=fs.readFileSync('legal/PRIVACY-POLICY.md','utf8');
const terms=fs.readFileSync('legal/TERMS-OF-USE.md','utf8');
const agePolicy=fs.readFileSync('legal/AGE-AND-CHILD-SAFETY.md','utf8');
for(const source of [privacyPolicy,terms])if(!source.includes('Paulo Henrique Graciano'))throw new Error('controller name missing from published legal source');
if(privacyPolicy.includes('[NOME/RAZÃO SOCIAL DO RESPONSÁVEL]')||terms.includes('[NOME/RAZÃO SOCIAL DO RESPONSÁVEL]'))throw new Error('controller placeholder must not remain');
if(!agePolicy.includes('sem restrição etária'))throw new Error('age decision must be explicit');
if(!agePolicy.includes('gate de salvaguardas para menores permanece aberto'))throw new Error('minor safeguards gate must remain explicit');
