# MON — Longitudinal Learning Validation

> P9.2 valida aprendizagem ao longo do tempo com evidência local. Tendência observacional não é prova causal.

## Perguntas respondidas

A camada de validação tenta responder cinco perguntas:

1. o aluno lembra depois de **1d+, 3d+ e 7d+**?
2. a dependência de pistas está caindo?
3. a transferência para produção/contextos novos está melhorando?
4. a autonomia nas missões está subindo?
5. erros recorrentes estão sendo recuperados?

## Retenção

As janelas são cumulativas e baseadas no espaçamento real entre exposições:

- **1d+**: pelo menos 20 horas;
- **3d+**: pelo menos 60 horas;
- **7d+**: pelo menos 144 horas.

Cada janela mostra percentual e denominador. Uma observação de 7d+ também pertence às janelas menores por definição.

## Tendências

Para hints, transferência, autonomia e erros recorrentes, o MON compara uma metade inicial e uma metade recente quando existem pelo menos 3 observações de cada lado.

Estados:

- `empty`: sem observações;
- `sparse`: 1–2;
- `emerging`: 3–7;
- `observed`: 8+.

Uma tendência só aparece como `directional` com pelo menos 6 observações.

## Erros recorrentes

Novos eventos explícitos são registrados:

- `mistake`;
- `mistake_recovery`.

Um erro é considerado recorrente quando o mesmo conceito/chave aparece errado pelo menos duas vezes. A validação mede a proporção de eventos de erro entre erro + recuperação e compara início vs período recente.

Para históricos anteriores sem esses eventos, existe fallback pelos attempts do Mastery Graph.

## Interpretação

- queda de dependência de pistas é um sinal favorável;
- queda de taxa de erros recorrentes é favorável;
- aumento de transferência e autonomia é favorável;
- retenção deve ser lida por horizonte e tamanho da amostra;
- nenhuma dessas tendências demonstra que uma feature específica causou a mudança.

## Privacidade

Tudo permanece local. Nenhum evento novo é enviado externamente.

## Quality Gate

O CI valida:

- janelas 1d+/3d+/7d+;
- denominadores e estados de evidência;
- tendência de hints;
- tendência de transferência;
- tendência de autonomia;
- erro recorrente + recuperação;
- caveat explícito de não causalidade.
