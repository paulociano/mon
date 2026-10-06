// MON Japan Journal · loaded on demand
function journalPct(n,d){return d?Math.round(n/d*100):0}
function journalDate(ts){
  if(!ts)return '';
  try{return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short'}).format(new Date(ts))}catch{return''}
}
function renderJournal(){
  const host=document.getElementById('journalContent');if(!host)return;
  const model=narrativeJournalModel(),s=model.summary;
  const resolvedSet=new Set(model.episodes.filter(x=>x.progress.resolved).map(x=>x.id));
  if(!s.episodes){
    host.innerHTML=`<section class="journal-empty"><div class="journal-seal">記</div><span class="eyebrow">Diário no Japão</span><h2>Sua história começa quando o japonês deixa de ser exercício.</h2><p>Ao chegar às situações N5, personagens e lugares começam a reaparecer. O MON registra encontros, retornos e situações que você conseguiu resolver com evidência de domínio.</p><button class="primary" data-mon-command="go('home')">voltar à trilha →</button></section>`;
    return;
  }
  const arcCards=model.arcs.map(a=>`<article class="journal-arc ${a.resolved===a.total&&a.total?'complete':''}">
    <div class="journal-arc-top"><span>${a.title}</span><b>${a.resolved}/${a.total}</b></div>
    <p>${a.promise}</p><div class="journal-progress" aria-label="${a.pct}% resolvido"><i data-mon-width="${a.pct}%"></i></div>
  </article>`).join('');
  const chars=model.characters.map(c=>`<article class="journal-person">
    <div class="journal-avatar" aria-hidden="true">${c.name?.slice(0,1)||'人'}</div>
    <div><b>${c.name}</b><span>${c.role||'personagem recorrente'}</span><small>${c.encounters||0} encontro${c.encounters===1?'':'s'}</small></div>
  </article>`).join('');
  const timeline=model.episodes.map((x,i)=>{
    const ep=x.content,p=x.progress,callback=ep?.callback&&resolvedSet.has(ep.callback);
    return `<article class="journal-entry ${p.resolved?'resolved':'seen'}">
      <div class="journal-line"><i></i></div>
      <div class="journal-entry-card">
        <div class="journal-entry-top"><span>${journalDate(p.firstSeenAt)} · ${ep?.arcMeta?.title||p.arc||'N5'}</span><strong>${p.resolved?'resolvido':'em construção'}</strong></div>
        <div class="journal-entry-place"><b>${ep?.place?.name||p.placeId}</b><span>${ep?.character?.name||p.characterId}</span></div>
        <h3>${p.title}</h3>
        <p>${ep?.scenePt||''}</p>
        <blockquote lang="ja">${ep?.sceneJp||''}</blockquote>
        <div class="journal-entry-meta"><span>melhor precisão · ${p.bestAccuracy||0}%</span><span>${p.attempts||1} tentativa${p.attempts===1?'':'s'}</span>${callback?'<span class="callback">↺ eco recuperado</span>':''}</div>
        <div class="journal-entry-actions"><button data-mon-command="speak('${(ep?.target||'').replaceAll("'","\\'")}')">▶ ouvir resposta-alvo</button><button data-mon-command="go('home')">voltar à trilha</button></div>
      </div>
    </article>`;
  }).join('');
  host.innerHTML=`<header class="journal-hero">
    <div><span class="eyebrow">Diário no Japão · 日本の日記</span><h2>O que você já viveu em japonês.</h2><p>Não é uma coleção de badges. É o rastro das situações, pessoas e lugares que voltaram até você conseguir agir sem depender de tradução constante.</p></div>
    <div class="journal-hero-stats"><div><b>${s.resolved}</b><span>situações resolvidas</span></div><div><b>${s.characters}</b><span>pessoas conhecidas</span></div><div><b>${model.arcs.filter(a=>a.seen).length}</b><span>arcos iniciados</span></div></div>
  </header>
  <section class="journal-section"><div class="journal-section-head"><span class="eyebrow">Arcos</span><h3>Seu primeiro mês ganha continuidade.</h3></div><div class="journal-arcs">${arcCards}</div></section>
  <section class="journal-section"><div class="journal-section-head"><span class="eyebrow">Pessoas</span><h3>Quem já faz parte da sua rotina.</h3></div><div class="journal-people">${chars}</div></section>
  <section class="journal-section timeline-section"><div class="journal-section-head"><span class="eyebrow">Linha do tempo</span><h3>Encontros, retornos e ecos.</h3></div><div class="journal-timeline">${timeline}</div></section>`;
}
