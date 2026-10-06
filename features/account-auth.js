// MON account authentication actions. Loaded lazily with the account runtime.
async function monAuthClient(){const client=await getMonSupabase();if(!client)throw new Error('Nuvem MON ainda não configurada');return client}
async function monCloudSignUp(email,password){const client=await monAuthClient(),redirectTo=location.href.split('#')[0],{data,error}=await client.auth.signUp({email,password,options:{emailRedirectTo:redirectTo}});if(error)throw error;return data}
async function monCloudPasswordSignIn(email,password){const client=await monAuthClient(),{data,error}=await client.auth.signInWithPassword({email,password});if(error)throw error;return data}
async function monCloudSetPassword(password){const client=await monAuthClient(),{data,error}=await client.auth.updateUser({password});if(error)throw error;return data}
async function monCloudRequestPasswordReset(email){
 const client=await monAuthClient();
 const redirectTo=new URL(location.href);redirectTo.hash='';redirectTo.search='';redirectTo.searchParams.set('view','auth');redirectTo.searchParams.set('recovery','1');
 const {data,error}=await client.auth.resetPasswordForEmail(email,{redirectTo:redirectTo.toString()});
 if(error)throw error;return data
}
function monAuthEmail(){
 const email=(document.getElementById('authEmail')||document.getElementById('userCloudEmail'))?.value.trim()||'';
 if(!email)throw new Error('Digite seu e-mail');
 return email;
}
function monAuthCredentials(){
 const email=monAuthEmail(),password=(document.getElementById('authPassword')||document.getElementById('userCloudPassword'))?.value||'';
 if(password.length<8)throw new Error('Use uma senha com pelo menos 8 caracteres');
 return {email,password};
}
async function signUpMonCloud(){
 try{const {email,password}=monAuthCredentials(),data=await monCloudSignUp(email,password);if(data?.session){await ensureAccountRuntime();await monCloudBootstrap();toast('Conta criada e conectada');await go('home',{replace:true})}else{setAuthStatus('Conta criada. Confirme seu e-mail e depois entre.');toast('Confirme seu e-mail')}}catch(e){setAuthStatus(e.message);toast(e.message)}
}
async function signInMonCloud(){
 try{const {email,password}=monAuthCredentials();await monCloudPasswordSignIn(email,password);await ensureAccountRuntime();await monCloudBootstrap();toast('Conta MON conectada');await go('home',{replace:true})}catch(e){setAuthStatus(e.message);toast(e.message)}
}
async function setMonCloudPassword(){
 const password=document.getElementById('userCloudNewPassword')?.value||'';
 if(password.length<8){toast('Use uma senha com pelo menos 8 caracteres');return}
 try{await monCloudSetPassword(password);toast('Senha da Conta MON atualizada')}catch(e){toast(e.message)}
}

async function requestMonPasswordReset(){
 try{
  const email=monAuthEmail();
  await monCloudRequestPasswordReset(email);
  setAuthStatus('Se existir uma Conta MON para este e-mail, enviaremos um link de recuperação.');
  if(typeof toast==='function')toast('Confira seu e-mail para recuperar a senha');
 }catch(e){setAuthStatus(e.message);if(typeof toast==='function')toast(e.message)}
}
async function completeMonPasswordRecovery(){
 const password=document.getElementById('authPassword')?.value||'';
 if(password.length<8){setAuthStatus('Use uma senha com pelo menos 8 caracteres');return}
 try{
  await monCloudSetPassword(password);
  const clean=new URL(location.href);clean.hash='';clean.searchParams.delete('recovery');clean.searchParams.set('view','home');history.replaceState({},'',clean);
  setAuthStatus('Senha atualizada.');
  if(typeof toast==='function')toast('Senha atualizada');
  await go('home',{replace:true});
 }catch(e){setAuthStatus(e.message);if(typeof toast==='function')toast(e.message)}
}
