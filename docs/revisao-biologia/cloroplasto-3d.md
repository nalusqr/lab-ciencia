# Revisão de Biologia: cloroplasto 3D

Revisor: Taxon. Material: `site/assets/modelos/previa-cloroplasto.png`, `site/assets/modelos/fonte/cloroplasto.py`, `docs/ASSETS.md` §5.2 e §5.4, rótulos em `site/celula/fonte/src/e_modelos.js` (`MODELOS.ROTULOS.cloroplasto`).
Veredito: **aprovar com 1 correção obrigatória** (E1). E2 é recomendada antes de publicar a página.

## O que está correto
- **Envoltório:** duas membranas lisas com o espaço entre elas. A membrana interna não tem dobras, ao contrário da mitocôndria. A comparação é boa para a prova.
- **Tilacoides:** são um sistema à parte, que não sai da membrana interna no cloroplasto maduro. É o que se vê nas micrografias.
- **Rede de tilacoides:** discos dos grana e lamelas do estroma são uma rede contínua de membrana, e o lúmen é um compartimento só. Na fatia (zoom da prévia), o lúmen das lamelas entra no dos discos sem parede, com a mesma cor. Esse era o ponto mais delicado e ficou certo.
- **Grana:** pilhas de 7 a 11 discos, com lamelas saindo da borda de um disco e chegando ao disco do vizinho, em outro nível.
- **DNA e ribossomos:** DNA circular em várias cópias e ribossomos 70S soltos no estroma, as mesmas evidências de endossimbiose da mitocôndria.
- **Grãos de amido:** no estroma, como produto da fotossíntese guardado ali.
- **Plastoglóbulos:** gotículas de lipídio perto das lamelas.
- **Tamanho:** 5,2 × 3 × 2,4 µm, dentro da faixa real (de 3 a 10 µm no comprimento).

## Erros conceituais (o aluno aprenderia errado)
**E1. O modelo não mostra onde ocorre a fase clara (lacuna).** O caso é o mesmo do E3 da mitocôndria.
- **O problema:** a membrana do tilacoide aparece "vazia".
- **O que o aluno pode concluir:** que o cloroplasto é só um saco de discos verdes. A pergunta mais frequente sobre cloroplasto no ENEM é *onde* ocorre cada etapa:
  - fase clara (fotólise da água, liberação de O₂, produção de ATP e NADPH) na membrana do tilacoide;
  - ciclo de Calvin (fixação do CO₂) no estroma.
- **Correção:**
  - acrescentar, na face das membranas dos tilacoides voltada para o estroma, pequenos blocos para os fotossistemas;
  - nas lamelas e nas bordas dos grana, a ATP sintase com a cabeça voltada para o estroma (o inverso da mitocôndria, em que a cabeça fica na matriz);
  - usar a mesma ATP sintase e o mesmo tom do modelo da mitocôndria, para o aluno reconhecer a peça;
  - com rótulos "Fotossistemas" e "ATP sintase".

  Se não couber no orçamento de triângulos, ponha pelo menos a legenda e uma seta de H⁺ do estroma para o lúmen.

**E2. O lúmen do tilacoide quase não se separa da membrana na fatia.**
- **O problema:** o lúmen `#276447` fica perto do verde de grana `#2A9450`. No zoom da prévia ele aparece como uma faixa pouco mais escura no meio de cada disco.
- **Por que importa:** é o compartimento onde os H⁺ se acumulam e onde a água é quebrada. Se o aluno não vê que o disco é oco, perde a ideia de compartimento.
- **Correção:** escurecer o lúmen para algo entre `#1A3A2C` e `#1E4433`, mantendo a família verde, para que cada disco leia como "bolsa com interior".

## Grana e lamelas: mesma cor ou dois tons? (dúvida da Íris)
**Decisão: dois tons do mesmo verde, como está, com dois ajustes.**

Por que dois tons e não um:
- Grana e lamelas do estroma são a mesma membrana e o mesmo compartimento, mas não são iguais. Os grana concentram o fotossistema II e o complexo coletor de luz. As lamelas concentram o fotossistema I e a ATP sintase.
- Nas micrografias, os grana aparecem mais escuros. Uma diferença de tom tem base real.
- A diferença também ajuda o aluno a achar o granum, que é a palavra que a prova usa.

O risco é o mesmo do E2 da mitocôndria: cor diferente pode comunicar *estrutura* diferente. Por isso, os ajustes:
1. **Mesmo matiz, só a luminosidade muda, e o contraste diminui.** Hoje as lamelas usam `#3FBF6A`, que salta como outra peça. Use para as lamelas um tom intermediário, por volta de `#35A95C` (entre `#2A9450` e `#3FBF6A`), e mantenha os grana em `#2A9450`.
2. **Sem costura no encontro.** Faça a cor passar de um tom ao outro nos primeiros ~0,08 µm da lamela, pela cor dos vértices, como já foi feito no retículo do núcleo. Assim a lamela "sai" do disco em vez de parecer colada nele.

O **lúmen** continua com uma cor só para discos e lamelas. Isso não muda.

Texto para o painel, que fecha a dúvida para o aluno:
> As lamelas do estroma são tilacoides que ligam um granum a outro. A membrana e o espaço interno são contínuos; o tom mais escuro dos grana só mostra onde os tilacoides estão empilhados.

## Simplificações aceitáveis (vão na nota "fora de escala / simplificado")
Texto sugerido para a página:
> Modelo simplificado e fora de escala. As membranas estão de 2 a 3 vezes mais grossas e aparecem como uma faixa única. Um cloroplasto real tem de 40 a 60 grana, e as lamelas se enrolam em espiral em volta de cada um; aqui há 11 grana, ligados de forma simplificada. O DNA do cloroplasto, esticado, é muito maior do que os anéis desenhados e fica compactado em nucleoides. Quantidade e tamanho de ribossomos, grãos de amido e plastoglóbulos são ilustrativos.

Também cabem na nota, sem precisar de mudança:
- a membrana externa translúcida;
- a ausência de clorofila como objeto, porque ela está *dentro* da membrana do tilacoide e o verde do modelo a representa;
- os grãos de amido maiores do que o habitual.

## Rótulos na Célula (`MODELOS.ROTULOS.cloroplasto`)
Valem as mesmas regras do núcleo:
- caixa normal (inicial maiúscula, siglas em maiúsculas);
- até 3 palavras;
- a função vai para o painel;
- a ordem é a prioridade (5 rótulos no celular, 8 no computador).

| Ordem | Peça | Hoje | Como deve ficar |
|---|---|---|---|
| 1 | `tilacoides` | granum (pilha de tilacoides) | **Tilacoides (granum)** |
| 2 | `estroma` | estroma (ciclo de Calvin) | **Estroma** |
| 3 | `membrana_externa` | membrana externa | **Membrana externa** |
| 4 | `membrana_interna` | membrana interna | **Membrana interna** |
| 5 | `dna_do_cloroplasto` | DNA próprio | **DNA do cloroplasto** |
| 6 | `ribossomos` | ribossomos próprios | **Ribossomos** |
| 7 | `lamelas_estromais` | lamelas (ligam os grana) | **Lamela do estroma** |
| 8 | `lumen_do_tilacoide` | lúmen do tilacoide | **Lúmen do tilacoide** |
| 9 | `graos_de_amido` | grão de amido | **Grão de amido** |
| 10 | `espaco_intermembranas` | espaço intermembranas | **Espaço intermembranas** |
| 11 | `plastoglobulos` | plastoglóbulos (gotas de lipídio) | **Plastoglóbulo** |

Por quê:
- "Tilacoides" vem primeiro, porque é a palavra da prova. "Granum" fica entre parênteses porque nomeia a pilha.
- "DNA do cloroplasto" substitui "DNA próprio", que é ambíguo sem contexto.
- Lúmen sobe para a 8ª posição, por causa de E1 e E2.
- Depois de E1, inserir **Fotossistemas** e **ATP sintase** logo após "Estroma", empurrando os demais.

## Legendas recomendadas (pt-BR, uma frase cada)
| Parte (`rotulo`) | Legenda | Ligação com o ENEM |
|---|---|---|
| Cloroplasto | Organela das plantas e algas onde ocorre a fotossíntese, que transforma energia luminosa em energia química. | 6 CO₂ + 6 H₂O + luz → C₆H₁₂O₆ + 6 O₂ |
| Membrana externa | Membrana lisa e permeável a moléculas pequenas, como a da mitocôndria. | Dupla membrana: evidência da endossimbiose |
| Membrana interna | Membrana lisa, sem dobras, que controla a troca de substâncias com o estroma. | Comparação com a mitocôndria (lá ela tem cristas) |
| Espaço intermembranas | Espaço estreito entre as duas membranas do envoltório. | |
| Tilacoides (granum) | Bolsas achatadas de membrana, com clorofila, empilhadas em grana; ali ocorre a fase clara. | Fase clara: luz, fotólise da água, O₂, ATP e NADPH |
| Lamela do estroma | Tilacoide que liga um granum a outro; membrana e lúmen são contínuos com os dos grana. | |
| Lúmen do tilacoide | Espaço dentro do tilacoide, onde a água é quebrada e os H⁺ se acumulam. | O O₂ liberado vem da água, não do CO₂ |
| Fotossistemas (após E1) | Conjuntos de clorofila e proteínas que captam a luz e passam elétrons adiante. | Papel da clorofila e da luz |
| ATP sintase (após E1) | Enzima que usa o retorno dos H⁺ para o estroma para produzir ATP. | Mesma enzima da mitocôndria |
| Estroma | Líquido interno onde o ciclo de Calvin fixa o CO₂ e produz açúcar, usando o ATP e o NADPH da fase clara. | Fase escura (química) e onde ocorre |
| Grão de amido | Reserva do açúcar produzido na fotossíntese, guardada como amido. | Teste do iodo em folhas |
| DNA do cloroplasto | DNA próprio, circular e sem histonas, como o das bactérias. | Endossimbiose |
| Ribossomos | Ribossomos próprios, do tipo bacteriano (70S). | Endossimbiose |
| Plastoglóbulo | Gotícula de lipídios e pigmentos que se acumula perto dos tilacoides. | |

Nota de página "No ENEM": o cloroplasto, como a mitocôndria, tem dupla membrana, DNA circular e ribossomos do tipo bacteriano, e se divide sozinho. Por isso os dois são as evidências clássicas da teoria endossimbiótica. Ligar com `../morfofisiologia/index.html#origem/cloro`.
