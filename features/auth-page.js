function authPageMarkup(){
 return '<section id="auth" class="view"><div class="auth-shell"><div class="auth-brand"><img src="./assets/brand/mon-lockup.svg" alt="MON 門 Japanese OS"><span>Conta MON</span></div><div class="auth-card"><span class="eyebrow">Acesso · 入門</span><h1>Entre no seu caminho.</h1><p>Use sua conta MON para sincronizar progresso entre dispositivos.</p><label><span>E-mail</span><input id="authEmail" type="email" autocomplete="email" placeholder="voce@exemplo.com"></label><label><span>Senha</span><input id="authPassword" type="password" autocomplete="current-password" minlength="8" placeholder="mínimo 8 caracteres"></label><div class="auth-actions"><button class="auth-primary" onclick="signInMonCloud()">entrar</button><button class="auth-secondary" onclick="signUpMonCloud()">criar conta</button><button class="auth-secondary" type="button" onclick="requestMonPasswordReset()">esqueci minha senha</button></div><div id="authStatus" class="auth-status" role="status" aria-live="polite"></div><small>Ao criar uma conta, seu progresso local continua preservado e pode ser sincronizado após o acesso.</small><nav class="auth-legal" aria-label="Documentos legais"><a href="legal/privacy.html" target="_blank" rel="noopener">Política de Privacidade</a><a href="legal/terms.html" target="_blank" rel="noopener">Termos de Uso</a></nav><small class="auth-minor-note">Se você é criança ou adolescente, use o MON com orientação de um responsável. Para criar a conta, o MON não pede data de nascimento, escola, endereço ou localização.</small><small class="auth-legal-note">Documentos em revisão pré-lançamento.</small></div></div></section>';
}
function ensureAuthPage(){let view=document.getElementById('auth');if(view)return view;document.querySelector('.content')?.insertAdjacentHTML('afterbegin',authPageMarkup());return document.getElementById('auth')}
function setAuthStatus(message=''){const el=document.getElementById('authStatus');if(el)el.textContent=message}
function monPasswordRecoveryRequested(){
 const query=new URLSearchParams(location.search);
 return query.get('recovery')==='1'||location.hash.includes('type=recovery');
}
function renderMonPasswordRecovery(){
 const card=document.querySelector('#auth .auth-card');
 if(!card)return;
 const heading=card.querySelector('h1'),copy=heading?.nextElementSibling;
 if(heading)heading.textContent='Defina uma nova senha.';
 if(copy)copy.textContent='O link de recuperação foi validado. Escolha uma nova senha para sua Conta MON.';
 const email=document.getElementById('authEmail')?.closest('label');if(email)email.hidden=true;
 const password=document.getElementById('authPassword');
 if(password){password.value='';password.autocomplete='new-password';password.placeholder='nova senha · mínimo 8 caracteres';const label=password.closest('label')?.querySelector('span');if(label)label.textContent='Nova senha'}
 const actions=card.querySelector('.auth-actions');
 if(actions)actions.innerHTML='<button class="auth-primary" type="button" onclick="completeMonPasswordRecovery()">salvar nova senha</button>';
 setAuthStatus('Crie uma nova senha com pelo menos 8 caracteres.');
}
async function renderAuthPage(){
 ensureAuthPage();setAuthStatus('');
 try{
  const session=await monCloudSession();
  if(monPasswordRecoveryRequested()){
   if(session){renderMonPasswordRecovery();return}
   setAuthStatus('Não foi possível validar este link de recuperação. Solicite um novo e-mail.');
   return;
  }
  if(session){await go('home',{replace:true});return}
 }catch{if(monPasswordRecoveryRequested())setAuthStatus('Não foi possível validar este link de recuperação. Solicite um novo e-mail.')}
}
