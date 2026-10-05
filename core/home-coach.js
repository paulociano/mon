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
    return {kind:'repair',eyebrow:'prioridade · domínio',title:'Fortaleça antes de abrir o próximo portão.',copy:'Uma habilidade crítica ainda está frágil. Faça um reforço curto antes de avançar.',cta:'fortalecer agora →',secondary:'ver prática adaptativa',action:'repair',secondaryAction:'practice',signal:'Mastery Graph',node};
  }
  if(!state.foundationComplete&&Number(state.foundationSessions||0)===1&&Number(state.foundationDay||1)===2){
    return {kind:'return',eyebrow:'seu segundo encontro · memória',title:'Você já abriu o portão. Agora descubra o que ficou.',copy:'Retome som e kana antes de acrescentar novidade. Veja o que já exige menos esforço.',cta:'ver o que eu lembro →',secondary:'ver por que repetir ajuda',action:'session',signal:'1ª sessão concluída',node};
  }
  if(due>=4){
    return {kind:'review',eyebrow:'prioridade · memória',title:`${due} revisões chegaram ao ponto certo.`,copy:'Recupere agora antes de adicionar conteúdo novo. A revisão será curta.',cta:'revisar memória →',secondary:'continuar trilha mesmo assim',action:'practice',secondaryAction:'lesson',signal:`${due} itens vencendo`,node};
  }
  if(energy<=0){
    return {kind:'recover',eyebrow:'prioridade · ritmo',title:'Sua energia de lição acabou. Sua memória, não.',copy:'Use a prática livre para recuperar itens e preparar o próximo nó sem gastar Energia.',cta:'abrir prática livre →',secondary:'ver Diário no Japão',action:'practice',secondaryAction:'journal',signal:'0 energia',node};
  }
  if(productionGap?.open>=2){
    return {kind:'functional',eyebrow:'prioridade · comunicação',title:`Reforce “${productionGap.label}”.`,copy:'A próxima sessão recupera essa função e volta à produção.',cta:'sessão →',action:'session',signal:`${productionGap.open} falhas abertas`,node};
  }
  if(mistakes>=3){
    return {kind:'mistake',eyebrow:'prioridade · correção',title:`${mistakes} padrões recorrentes merecem uma correção curta.`,copy:'Corrija só os padrões que voltaram a aparecer, sem repetir a unidade inteira.',cta:'corrigir erros →',secondary:'continuar trilha',action:'practice',secondaryAction:'lesson',signal:`${mistakes} erros abertos`,node};
  }

  const last=state.narrative?.lastEpisode,lastProgress=last?.unitId?state.narrative?.episodes?.[last.unitId]:null;
  if(last&&lastProgress&&!lastProgress.resolved&&unresolvedNarrative>0){
    return {kind:'story',eyebrow:'prioridade · transferência',title:`${last.characterName} ainda está esperando você resolver a situação.`,copy:`${last.placeName} continua aberto. Resolva a situação para transformar memória em autonomia.`,cta:'continuar episódio →',secondary:'abrir Diário',action:'lesson',secondaryAction:'journal',signal:`${unresolvedNarrative} situação${unresolvedNarrative===1?'':'ões'} em construção`,node};
  }

  return {kind:'advance',eyebrow:'próxima ação · avanço',title:node?`Continue por ${String(node.label||'sua trilha').toLowerCase()}.`:'Continue sua trilha.',copy:node?.type==='checkpoint'?'Você chegou a um checkpoint. Agora o foco é recuperar e transferir sem depender de pistas.':'Sem urgências de memória agora. É hora de avançar um passo.',cta:node?.type==='chest'?'abrir recompensa →':'continuar trilha →',secondary:last?'ver Diário no Japão':'abrir prática',action:node?.type==='chest'?'chest':'lesson',secondaryAction:last?'journal':'practice',signal:node?.type==='checkpoint'?'checkpoint pronto':'ritmo saudável',node};
}

if(typeof module!=='undefined'&&module.exports)module.exports={homeCoachDecision,homeCoachSignals};
