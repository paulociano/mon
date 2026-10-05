const cfg={
 privacy:{title:'Política de Privacidade',source:'./PRIVACY-POLICY.md'},
 terms:{title:'Termos de Uso',source:'./TERMS-OF-USE.md'}
};
const type=document.body.dataset.legalDoc,doc=cfg[type];
document.title=(doc?.title||'Documento legal')+' · MON 門';
const title=document.getElementById('legalTitle'),body=document.getElementById('legalBody');
if(title)title.textContent=doc?.title||'Documento legal';
(async()=>{
 try{
  if(!doc)throw new Error('Documento desconhecido');
  const res=await fetch(doc.source,{cache:'no-cache'});
  if(!res.ok)throw new Error('Não foi possível carregar o documento');
  const text=await res.text();
  body.textContent=text;
 }catch(err){
  body.textContent='Não foi possível carregar este documento agora. Consulte o repositório público do MON ou tente novamente.';
 }
})();