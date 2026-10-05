// MON account privacy controls — lazy, user-area only.
async function monCloudDeleteAccount(){
 const client=typeof getMonSupabase==='function'?await getMonSupabase():null;
 const session=typeof monCloudSession==='function'?await monCloudSession():null;
 if(!client||!session)throw new Error('Entre na Conta MON para excluir a conta');
 const {data,error}=await client.functions.invoke('delete-account',{body:{confirm:'DELETE_MY_ACCOUNT'}});
 if(error)throw new Error('Não foi possível excluir sua Conta MON');
 if(!data?.deleted)throw new Error('A exclusão da Conta MON não foi confirmada');
 try{await client.auth.signOut({scope:'local'})}catch{}
 monSupabaseClient=null;
 return true;
}
async function deleteMonAccount(){
 const confirmed=globalThis.confirm?.('Excluir permanentemente sua Conta MON e todos os dados sincronizados na nuvem? Seu progresso local neste dispositivo será mantido.');
 if(!confirmed)return false;
 await monCloudDeleteAccount();
 try{
  localStorage.removeItem(MON_ACCOUNT_KEY);
  localStorage.removeItem(MON_CLOUD_LINK_KEY);
  localStorage.removeItem(MON_SYNC_DIRTY_KEY);
  localStorage.removeItem(MON_CLOUD_CONFLICT_KEY);
 }catch{}
 if(typeof toast==='function')toast('Conta MON excluída. Seu progresso local foi mantido.');
 if(typeof renderUserArea==='function')renderUserArea();
 return true;
}
async function deleteMonCloudData(){
 const client=typeof getMonSupabase==='function'?await getMonSupabase():null;
 const session=typeof monCloudSession==='function'?await monCloudSession():null;
 if(!client||!session)throw new Error('Entre na Conta MON para excluir dados da nuvem');
 const confirmed=globalThis.confirm?.('Excluir permanentemente seu progresso sincronizado da nuvem? O progresso deste dispositivo será mantido.');
 if(!confirmed)return false;
 const {error}=await client.from('mon_user_state').delete().eq('user_id',session.user.id);
 if(error)throw error;
 const account=loadMonAccount();
 saveMonAccount({...account,cloudRevision:0,lastSyncedAt:null,lastSyncStatus:'cloud-data-deleted'});
 clearMonSyncDirty();
 if(typeof toast==='function')toast('Dados sincronizados excluídos da nuvem');
 if(typeof renderUserArea==='function')renderUserArea();
 return true;
}
function ensureMonPrivacyControls(){
 if(document.querySelector('[data-mon-privacy-controls]'))return;
 const actions=[...document.querySelectorAll('#user .user-actions')].at(-1);if(!actions)return;
 const wrap=document.createElement('span');wrap.dataset.monPrivacyControls='1';wrap.className='user-actions';
 wrap.innerHTML='<button class="user-secondary" type="button" data-mon-delete-cloud>Excluir dados da nuvem</button><button class="user-secondary" type="button" data-mon-delete-account>Excluir Conta MON</button><a class="user-secondary" href="legal/privacy.html" target="_blank" rel="noopener">privacidade</a><a class="user-secondary" href="legal/terms.html" target="_blank" rel="noopener">termos</a>';
 actions.insertAdjacentElement('afterend',wrap);
 wrap.querySelector('[data-mon-delete-cloud]')?.addEventListener('click',async e=>{const btn=e.currentTarget;btn.disabled=true;try{await deleteMonCloudData()}catch(err){if(typeof toast==='function')toast(err?.message||'Não foi possível excluir os dados da nuvem')}finally{btn.disabled=false}});
 wrap.querySelector('[data-mon-delete-account]')?.addEventListener('click',async e=>{const btn=e.currentTarget;btn.disabled=true;try{await deleteMonAccount()}catch(err){if(typeof toast==='function')toast(err?.message||'Não foi possível excluir a Conta MON')}finally{btn.disabled=false}});
}
