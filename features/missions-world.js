// Mission world state · consequences from remembered context
function missionApplyWorldState(id,run){
 const m=run.contextMemory||{},w={...(run.worldState||{})};
 if(id==='phone'&&m.time){w.booking='confirmed';w.bookingTime=m.time}
 else if(id==='work'&&m.deadline){w.priority='locked';w.deadline=m.deadline}
 else if(id==='cityhall'&&m.serviceTime){w.office='return';w.openAt=m.serviceTime}
 else if(id==='cityhall'&&m.issue){w.procedure=m.issue}
 else if(id==='disaster'&&m.route){w.route='rerouted';w.routeName=m.route}
 else if(id==='disaster'&&m.constraint){w.assistance='dispatched';w.constraint=m.constraint}
 run.worldState=w;return w
}
function missionWorldTurn(id,turn,w={}){
 const t={...turn};
 if(id==='phone'&&w.booking==='confirmed'){t.npc+=` ${w.bookingTime}の十分前に来てください。`;t.pt=(t.pt||'')+' Chegue dez minutos antes.'}
 else if(id==='work'&&w.priority==='locked'){t.npc+=` ${w.deadline}まで、この仕事を優先してください。`;t.pt=(t.pt||'')+` Priorize esta tarefa até ${w.deadline}.`}
 else if(id==='cityhall'&&w.office==='return'){t.npc+=` 明日は${w.openAt}にこの窓口へ来てください。`;t.pt=(t.pt||'')+` Volte amanhã às ${w.openAt}.`}
 else if(id==='disaster'&&w.assistance==='dispatched'){t.npc+=' 係の人が入口まで迎えに行きます。';t.pt=(t.pt||'')+' Alguém irá encontrar você na entrada.'}
 else if(id==='disaster'&&w.route==='rerouted'){t.npc+=` ${w.routeName}は混んでいるので、係員の案内に従ってください。`;t.pt=(t.pt||'')+` A rota ${w.routeName} está cheia; siga os responsáveis.`}
 return t
}
function missionWorldSummary(w={}){
 if(w.booking==='confirmed')return `reserva confirmada · ${w.bookingTime}`;
 if(w.priority==='locked')return `prioridade definida · até ${w.deadline}`;
 if(w.office==='return')return `retorno necessário · ${w.openAt}`;
 if(w.assistance==='dispatched')return 'ajuda acionada';
 if(w.route==='rerouted')return `rota alterada · ${w.routeName}`;
 return null
}
