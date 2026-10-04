// MON Home Coach
// Pure priority policy for the Home surface. No DOM and no lazy feature dependencies.

function homeCoachSignals(state={},now=Date.now()){
  const dueReviews=Object.values(state.reviewItems||{}).filter(x=>(x?.due||0)<=now).length;
  const openMistakes=Object.values(state.mistakeStats||{}).filter(x=>(x?.count||0)>(x?.recovered||0)).length;
  const unresolvedNarrative=Object.values(state.narrative?.episodes||{}).filter(x=>!x.resolved).length;
  let productionGap;for(const [label,g] of Object.entries(state.productionGaps||{})){const open=(g?.count||0)-(g?.recovered||0);if(open>0&&(!productionGap||open>productionGap.open))productionGap={label,open}}
  return {dueReviews,openMistakes,unresolvedNarrative,productionGap,energy:Math.max(0,state.energy||0)};
}
function homeCoachDecision(state={},flatPath=[],now=Date.now()){
  const total=flatPath.length,idx=total?Math.max(0,Math.min(total-1,state.pathProgress||0)):0,node=flatPath[idx]||null;
  const {dueReviews:due,openMistakes:mistakes,unresolvedNarrative,productionGap,energy}=homeCoachSignals(state,now);

  if(state.remediation?.idx===idx){
    return {kind:'repair',eyebrow:'prioridade · domínio',title:'Fortaleça antes de abrir o próximo portão.',copy:'Você concluiu a atividade, mas a evidência ainda está frágil em uma habilidade crítica. O reforço é curto e direcionado.',cta:'fortalecer agora →',secondary:'ver prática adaptativa',action:'repair',secondaryAction:'practice',signal:'Mastery Graph',node};
  }
  if(due>=4){
    return {kind:'review',eyebrow:'prioridade · memória',title:`${due} revisões chegaram ao ponto certo.`,copy:'Recupere agora antes de empilhar conteúdo novo. O intervalo já amadureceu e a prática será curta.',cta:'revisar memória →',secondary:'continuar trilha mesmo assim',action:'practice',secondaryAction:'lesson',signal:`${due} itens vencendo`,node};
  }
  if(energy<=0){
    return {kind:'recover',eyebrow:'prioridade · ritmo',title:'Sua energia de lição acabou. Sua memória, não.',copy:'Use a prática livre para recuperar itens, corrigir erros e preparar o próximo nó sem gastar Energia.',cta:'abrir prática livre →',secondary:'ver Diário no Japão',action:'practice',secondaryAction:'journal',signal:'0 energia',node};
  }
  if(productionGap?.open>=2){
    return {kind:'functional',eyebrow:'prioridade · comunicação',title:`Reforce “${productionGap.label}”.`,copy:'A próxima sessão recupera essa função e volta à produção sem apoio.',cta:'sessão direcionada →',action:'session',signal:`${productionGap.open} falhas abertas`,node};
  }
  if(mistakes>=3){
    return {kind:'mistake',eyebrow:'prioridade · correção',title:`${mistakes} padrões recorrentes merecem uma correção curta.`,copy:'Repetir a unidade inteira seria desperdício. O Caderno de Erros consegue atacar exatamente o padrão que voltou a aparecer.',cta:'corrigir erros →',secondary:'continuar trilha',action:'practice',secondaryAction:'lesson',signal:`${mistakes} erros abertos`,node};
  }

  const last=state.narrative?.lastEpisode,lastProgress=last?.unitId?state.narrative?.episodes?.[last.unitId]:null;
  if(last&&lastProgress&&!lastProgress.resolved&&unresolvedNarrative>0){
    return {kind:'story',eyebrow:'prioridade · transferência',title:`${last.characterName} ainda está esperando você resolver a situação.`,copy:`${last.placeName} virou um ponto de memória. Continue a trilha para transformar esse encontro em autonomia demonstrada.`,cta:'continuar episódio →',secondary:'abrir Diário',action:'lesson',secondaryAction:'journal',signal:`${unresolvedNarrative} situação${unresolvedNarrative===1?'':'ões'} em construção`,node};
  }

  return {kind:'advance',eyebrow:'próxima ação · avanço',title:node?`Continue por ${String(node.label||'sua trilha').toLowerCase()}.`:'Continue sua trilha.',copy:node?.type==='checkpoint'?'Você chegou a um checkpoint. Agora o foco é recuperar e transferir sem depender de pistas.':'Sua memória não tem nenhuma urgência maior agora. É um bom momento para avançar um passo.',cta:node?.type==='chest'?'abrir recompensa →':'continuar trilha →',secondary:last?'ver Diário no Japão':'abrir prática',action:node?.type==='chest'?'chest':'lesson',secondaryAction:last?'journal':'practice',signal:node?.type==='checkpoint'?'checkpoint pronto':'ritmo saudável',node};
}

if(typeof module!=='undefined'&&module.exports)module.exports={homeCoachDecision,homeCoachSignals};
