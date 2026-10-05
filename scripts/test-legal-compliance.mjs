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

const account=fs.readFileSync('core/account.js','utf8');
for(const requiredText of [
 'async function deleteMonCloudData',
 ".delete().eq('user_id',session.user.id)",
 'Excluir dados da nuvem'
])if(!account.includes(requiredText))throw new Error('account deletion surface missing: '+requiredText);

console.log('legal/compliance baseline ok');
