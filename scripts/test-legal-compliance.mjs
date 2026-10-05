import fs from 'node:fs';

const required=[
 'LICENSE',
 'legal/TERMS-OF-USE.md',
 'legal/PRIVACY-POLICY.md',
 'legal/DATA-RETENTION.md',
 'legal/SUBPROCESSORS.md',
 'legal/AGE-AND-CHILD-SAFETY.md',
 'compliance/DATA-INVENTORY.md',
 'compliance/PROCESSING-REGISTER.md',
 'compliance/INCIDENT-RESPONSE.md',
 'compliance/LGPD-CONTROLS.md',
 'compliance/DPIA.md',
 'compliance/RELEASE-GATES.md'
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
