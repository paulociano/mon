// MON account authentication actions. Loaded lazily with the account runtime.
function monAuthCredentials(){
 const email=document.getElementById('userCloudEmail')?.value.trim()||'',password=document.getElementById('userCloudPassword')?.value||'';
 if(!email)throw new Error('Digite seu e-mail');
 if(password.length<8)throw new Error('Use uma senha com pelo menos 8 caracteres');
 return {email,password};
}
async function signUpMonCloud(){
 try{const {email,password}=monAuthCredentials(),data=await monCloudSignUp(email,password);toast(data?.session?'Conta criada e conectada':'Conta criada. Confirme seu e-mail para entrar.');await renderCloudAccountPanel()}catch(e){toast(e.message)}
}
async function signInMonCloud(){
 try{const {email,password}=monAuthCredentials();await monCloudPasswordSignIn(email,password);await monCloudBootstrap();await renderCloudAccountPanel();toast('Conta MON conectada')}catch(e){toast(e.message)}
}
async function setMonCloudPassword(){
 const password=document.getElementById('userCloudNewPassword')?.value||'';
 if(password.length<8){toast('Use uma senha com pelo menos 8 caracteres');return}
 try{await monCloudSetPassword(password);toast('Senha da Conta MON atualizada')}catch(e){toast(e.message)}
}
