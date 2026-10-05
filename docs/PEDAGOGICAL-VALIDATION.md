# P9/P10 — Cobertura N4 e validação pedagógica

## Objetivo

P9 e P10 fecham duas lacunas diferentes:

- **P9** garante que o N4 use o mesmo sistema pedagógico já aplicado ao N5, sem criar um segundo motor.
- **P10** cria um gate pedagógico estrutural para impedir que uma unidade passe a existir sem missão, explicação, recuperação, transferência e produção coerentes.

O gate é propositalmente conservador: ele valida **coerência estrutural e alinhamento metodológico**. Ele não prova eficácia causal nem substitui evidência longitudinal com aprendizes reais.

## P9 — expansão integral para N4

Cada unidade N4 deve preservar o ciclo:

```text
Can-do
→ situação
→ input
→ Study Block
→ retrieval
→ contrast/mechanism
→ transfer
→ produce
→ spacing / remediation
```

O contrato da unidade também carrega explicitamente as capacidades N4 aplicáveis:

- `repair`
- `confirm`
- `explain`
- `negotiate`
- `summarize`

Essas capacidades passam por `japaneseLearningContract()` e chegam ao Study Block e ao lesson plan. Assim, gramática e prática não ficam separadas do resultado funcional esperado.

O gate executável está em:

- `scripts/test-n4-pedagogy.mjs`

Ele exige para as 36 unidades N4:

- Can-do observável;
- duas ou mais capacidades funcionais;
- Study Block;
- modelo mental;
- exemplos trabalhados;
- contraste/boundary;
- misconception guidance;
- uso real;
- evidência conceitual de mecanismo e contraste;
- transferência;
- produção;
- remediation conceitual em erro N4 representativo.

## P10 — validação pedagógica

O gate executável está em:

- `scripts/test-pedagogical-validation.mjs`

Cada unidade N4 precisa satisfazer 12 critérios:

1. missão funcional;
2. input contextual;
3. Study Block;
4. exemplos trabalhados;
5. contraste e erro previsível;
6. evidência conceitual;
7. retrieval;
8. transfer;
9. production;
10. estratégia de repair;
11. capacidades N4 explícitas;
12. provenance das fontes pedagógicas.

### Fontes de referência

A validação segue a política do Japanese Learning System:

- **Irodori** para comunicação funcional e Can-do;
- **Desvendando a Língua Japonesa** para explicação PT-first;
- **Meu Amigo Kanji** para kanji contextual;
- princípios do `teach` para retrieval, spacing, interleaving e progressão por domínio.

## O que este gate prova

Ele prova que a estrutura atual do currículo mantém os contratos que o MON considera pedagogicamente necessários.

Ele **não prova**:

- que o aluno vai reter em 7 dias;
- que a sequência é ótima para todos os perfis;
- que a aplicação causa maior aprendizagem que uma alternativa;
- que todas as formulações são perfeitas do ponto de vista de um professor humano.

Essas questões precisam continuar sendo observadas por:

- retenção 1d+/3d+/7d+;
- transferência;
- autonomia;
- dependência de pistas;
- erros recorrentes;
- revisão qualitativa humana quando o conteúdo curricular mudar de forma relevante.

## Regra de manutenção

Uma mudança curricular N4 não está concluída se:

- o gate P9 falhar;
- a rubrica P10 falhar;
- o conteúdo reduzir a qualidade das fontes ou transformar gramática em tradução literal;
- o runtime deixar de registrar evidência conceitual, de transferência ou produção.

A validação humana deve ser tratada como revisão de conteúdo e de progressão, não como substituto dos testes estruturais.
