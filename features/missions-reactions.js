// Semantic branches for accepted free-form mission turns
const MISSION_REACTIONS={
 work:{negotiate:[
  [['三時','3時'],['time','三時までなら対応できます。では、こちらを先にお願いします。','Se consegue até as três, faça este primeiro.',{deadline:'三時'}]],
  [['先'],['priority','分かりました。では、優先してお願いします。','Entendi. Então priorize este.']]
 ],repair:[
  [['もう一度'],['repeat','もちろんです。もう一度説明します。','Claro. Vou explicar novamente.']],
  [['意味'],['meaning','分かりました。意味から説明します。','Entendi. Vou explicar o significado.']]
 ]},
 phone:{negotiate:[
  [['五時','5時'],['five','五時ですね。では、その時間に変更します。','Cinco, certo. Vou alterar para esse horário.',{time:'五時'}]]
 ],repair:[
  [['五時','5時'],['five-repeat','五時ですね。今度は聞こえました。','Cinco, certo. Agora consegui ouvir.']],
  [['もう一度','言'],['repeat','ありがとうございます。内容を確認します。','Obrigado. Vou confirmar o conteúdo.']]
 ]},
 cityhall:{explain:[
  [['引っ越'],['moved','引っ越しですね。では、新しい住所で手続きを続けます。','Entendi, mudança. Vamos continuar com o novo endereço.',{issue:'引っ越し'}]],
  [['住所'],['address','住所の変更ですね。分かりました。','É alteração de endereço. Entendi.',{issue:'住所変更'}]]
 ],negotiate:[
  [['午前'],['morning','午前なら九時から受け付けています。','De manhã, atendemos a partir das nove.',{serviceTime:'九時'}]],
  [['何時'],['time','明日は九時から受け付けています。','Amanhã atendemos a partir das nove.',{serviceTime:'九時'}]]
 ]},
 disaster:{explain:[
  [['足','痛'],['injury','足が痛いんですね。係の人を呼びます。','A perna dói, certo. Vou chamar um responsável.',{constraint:'足が痛い'}]],
  [['歩'],['mobility','歩くのが難しいんですね。少し待ってください。','Está difícil andar. Aguarde um pouco.',{constraint:'歩くのが難しい'}]]
 ],negotiate:[
  [['安全'],['safe','安全な道なら駅前通りを使ってください。','Para uma rota segura, use a avenida da estação.',{route:'駅前通り'}]],
  [['別'],['other','別の道は駅前通りです。','A outra rota é a avenida da estação.',{route:'駅前通り'}]]
 ]}
};
function missionSemanticReaction(id,cap,text){
 const q=missionNormalize(text),rules=MISSION_REACTIONS[id]?.[cap]||[];
 for(const [terms,out] of rules)if(terms.some(x=>q.includes(missionNormalize(x))))return {key:out[0],npc:out[1],pt:out[2],slots:out[3]||null};
 return null
}

function missionContextualTurn(id,turn,m={}){
 const t={...turn};let lead='',pt='';
 if(id==='phone'&&m.time){lead=`先ほど選んだ${m.time}で予約を変更しました。`;pt=`A reserva foi alterada para ${m.time}.`}
 else if(id==='work'&&m.deadline){lead=`${m.deadline}までの予定で進めます。`;pt=`Seguiremos com prazo até ${m.deadline}.`}
 else if(id==='cityhall'&&m.serviceTime){lead=`明日は${m.serviceTime}から受け付けます。`;pt=`Amanhã o atendimento começa às ${m.serviceTime}.`}
 else if(id==='cityhall'&&m.issue){lead=`${m.issue}の手続きを続けます。`;pt='Vamos continuar esse procedimento.'}
 else if(id==='disaster'&&m.route){lead=`${m.route}を使って避難所へ行ってください。`;pt=`Use ${m.route} para chegar ao abrigo.`}
 else if(id==='disaster'&&m.constraint){lead=`${m.constraint}ので、係の人が手伝います。`;pt='Um responsável vai ajudar por causa dessa limitação.'}
 if(lead){t.npc=lead+' '+t.npc;t.pt=pt+' '+(t.pt||'')}return t
}
