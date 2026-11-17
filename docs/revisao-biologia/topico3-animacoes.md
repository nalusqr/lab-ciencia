# Revisão das animações 3D do módulo Citogenética (tópico 3)

Revisores: 🔬 Taxon (ciclo celular e mitose) e 🧬 Sapien (meiose, alterações cromossômicas e gametogênese), cada um com uma olhada rápida na parte do outro. Escopo: as 14 rotas ciclo/interfase, ciclo/checagem, ciclo/cancer, mitose/fases, mitose/citocinese, meiose/fases, meiose/crossing, meiose/segregacao, comparar/lado, erros/naodisjuncao, erros/aneuploidias, erros/euploidias, gametogenese/espermatogenese e gametogenese/ovogenese. Base: capturas em /tmp/claude-0/t3/shots/ (duas novas: erros_aneuploidias_1.png e meiose_segregacao_0_m.png), a leitura de cito3d.js, cenas3d-ciclo.js, cenas3d-divisao.js, cenas3d-erros.js e cenas3d-gametas.js, e os textos `ph`, `inf` e `kv` do index.html que aparecem nessas rotas. Nada foi editado no código.

Gravidade: M quer dizer que muda o conteúdo ou que há um erro científico. B quer dizer um problema menor (texto, regra de tela ou layout).

## O que conferimos e está certo

- Ciclo: o anel tem G1 11 h, S 8 h, G2 4 h e M 1 h (célula humana de 24 h). O DNA vai de 2C para 4C na fase S, e o texto diz que a duplicação não muda o número de cromossomos.
- Pontos de checagem: estão na ordem certa no anel. G1/S fica no fim de G1, G2/M no fim de G2 e o do fuso no meio de M, com as condições certas para cada um. No passo 4, a p53 barra a célula no portão G1/S, com reparo ou apoptose.
- Câncer: mostra mutação em genes do ciclo (p53), tumor, ruptura da lâmina basal (invasão) e metástase pelo sangue. No passo 1, uma célula morre e outra a repõe.
- Mitose: a ordem é interfase G2, prófase, metáfase, anáfase, telófase e citocinese. São 4 cromossomos e 8 cromátides até a metáfase, e as cromátides se separam na anáfase. Os cromossomos se descondensam na telófase e no fim há 2 células 2n = 4. Citocinese animal centrípeta, com anel de actina e miosina, e vegetal centrífuga, com placa celular de vesículas do Golgi e fragmoplasto.
- Meiose: 2n = 4 no começo. Na prófase I aparecem o bivalente e o crossing-over, na metáfase I os pares ficam no equador e na anáfase I os homólogos se separam. No fim da meiose I são duas células n = 2 com cromossomos duplicados, e no fim 4 células n com C.
- Crossing: o quiasma aparece na prófase I, entre cromátides não irmãs. O resultado AB, Ab, aB e ab tem 2 cromátides parentais e 2 recombinantes, e as cores e os alelos de cada cromátide batem.
- Segregação independente: os dois arranjos têm a mesma chance e dão os gametas AB e ab num arranjo, Ab e aB no outro, ou seja, 2² = 4 tipos.
- Não disjunção: o erro na meiose I leva os dois homólogos do longo ao mesmo polo e dá n + 1, n + 1, n − 1 e n − 1, com os 4 gametas alterados. O erro na meiose II deixa as cromátides do longo juntas numa célula e dá n + 1, n − 1, n e n.
- Aneuploidias: óvulo com 24 cromossomos e espermatozoide com 23 formam um zigoto com 47. O cariótipo 47,XX,+21 tem três cópias do 21, que aparece como o menor autossomo. Também estão certos 45,X (Turner) e 47,XXY (Klinefelter, com o Y pequeno e um X a mais em destaque).
- Euploidias: banana e melancia sem sementes com 3n = 33, batata com 4n = 48, algodão com 52, trigo-comum com 6 × 7 = 42, aveia com 42 e morango com 8 × 7 = 56. O zangão tem n = 16 e a rainha 2n = 32, e o triploide humano (69) é letal. A comparação 3n (6 cromossomos) com 2n + 1 (5 cromossomos) e a tabela de nulissomia a tetrassomia estão certas.
- Espermatogênese: espermatogônia 2n, espermatócito I 2n, 2 espermatócitos II n, 4 espermátides n e 4 espermatozoides com acrossomo e flagelo. A espermiogênese aparece sem divisão.
- Ovogênese: as mitoses acontecem só na vida fetal e o ovócito I fica parado na prófase I. A meiose I é desigual e gera o ovócito II e o 1º corpúsculo polar, e a ovulação acontece em metáfase II. A meiose II só termina com a fecundação e gera 1 óvulo e o 2º corpúsculo polar. A escala está certa: cerca de 100 µm para o ovócito e cerca de 5 µm para a cabeça do espermatozoide.
- Regras de texto nos .js novos: nenhum "!", "~" ou código interno visível. O cartão `inf` passa por `ok()` em cito3d.js (linha 337), que troca " → " por " para " e " · " por ", ". Por isso "DNA: 2C para 4C" e "DNA: 4C, 8 cromátides" aparecem certos na tela.

## Achados M

### M1. O zigoto trissômico aparece com 25 cromossomos, não 47
- Rota: erros/aneuploidias, passo 2 (Fecundação). Arquivo: cenas3d-erros.js, linha 163: `K.tx('+ 22 outros', n[0], n[1], ...)`.
- O que está errado: no óvulo (passo 1), "duas cópias do 21 + 22 outros" dá 24, e está certo. No zigoto, o mesmo texto continua na tela ao lado de "Três cópias do 21", o que soma 25. Logo abaixo está escrito "Zigoto: 47 cromossomos" (captura erros_aneuploidias_1.png). A conta 3 + 44 = 47 é exatamente o que o ENEM cobra.
- Correção: `K.tx(g.zig > .9 ? '+ 44 outros' : '+ 22 outros', n[0], n[1], { s: 12.5, c: K.C.dim });`

### M2. Ovogênese: a primeira pausa não termina "na puberdade"
- Rota: gametogenese/ovogenese, painel `kv` da lição. Arquivo: index.html, linha 698: `['Primeira pausa','prófase I (até a puberdade)']`.
- O que está errado: cada ovócito I fica parado na prófase I até o ciclo em que é ovulado, o que pode levar de 12 a cerca de 50 anos. Escrito assim, parece que todos retomam a meiose na puberdade, e isso contradiz o passo 2 da própria cena ("fica por anos") e o texto "Da puberdade à menopausa, a cada ciclo...".
- Correção: `['Primeira pausa','prófase I (da vida fetal até a ovulação daquele ovócito, anos depois)']`

## Achados B

### B1. "→" visível no painel `kv` das lições
- index.html, linha 392 (mitose/fases) `'2n → 2n'`, linha 436 (meiose/fases) `'2n → n'`, linha 680 (espermatogenese) `'1 espermatócito I → 4 espermatozoides'` e linha 698 (ovogenese) `'1 ovócito I → 1 óvulo'`. O `kv` é montado direto com `$('kv').innerHTML` (linha 737) e não passa pelo `ok()`.
- Correção: `'de 2n para 2n'`, `'de 2n para n'`, `'1 espermatócito I forma 4 espermatozoides'` e `'1 ovócito I forma 1 óvulo'`. Também vale corrigir a fonte do `inf` (linhas 315, 389 e 433), que hoje só fica certa por causa do `ok()`. Por exemplo, `'DNA: 2C para 4C'` e `'DNA: 4C, 8 cromátides'`.

### B2. "Esquerda" e "direita" no texto, mas no celular os diagramas ficam um em cima do outro
- Rotas: meiose/segregacao e erros/naodisjuncao. No celular, `lay()` de cenas3d-divisao.js empilha os dois diagramas (capturas erros_naodisjuncao_2_m.png e meiose_segregacao_0_m.png). Textos em index.html: segregacao `ph[0]` "À esquerda, os dois cromossomos maternos ficam do mesmo lado; à direita, em lados opostos." e naodisjuncao `ph[0]` a `ph[4]` ("À esquerda...", "Esquerda:", "Direita:").
- Correção: usar os títulos que já aparecem na tela. Por exemplo: "No arranjo 1, os dois cromossomos maternos ficam do mesmo lado; no arranjo 2, em lados opostos." Em naodisjuncao: "No erro na meiose I, ...". "No erro na meiose II, ...".

### B3. Frase imprecisa sobre o crossing-over
- Rota: meiose/fases (rótulo da prófase I). Arquivo: cito3d.js, linha 194: `'Crossing-over': 'Troca de pedaços entre cromátides de homólogos diferentes.'`. "Homólogos diferentes" pode ser lido como pares diferentes.
- Correção: `'Troca de pedaços entre cromátides não irmãs de um mesmo par de homólogos.'`

### B4. Espermatogônia: "durante toda a vida, a partir da puberdade"
- index.html, espermatogenese `ph[0]`: as duas expressões se contradizem. O cartão 3D (cenas3d-gametas.js, linha 96) já está certo: "durante toda a vida reprodutiva".
- Correção: `'Células 2n da parede dos túbulos seminíferos, no testículo. Da puberdade em diante, multiplicam-se por mitose durante toda a vida.'`

### B5. Aneuploidias: o rótulo do gameta se repete e o chama de "óvulo"
- cenas3d-erros.js, linhas 59 e 162: o rótulo tocável `'Óvulo: 24 cromossomos'` e o texto de `sobre` com a mesma frase aparecem juntos no passo 1 (erros_aneuploidias_0.png). Além disso, a própria lição de ovogênese ensina que a célula fecundada é o ovócito II.
- Correção: na linha 59, `t: 'Gameta feminino (n + 1)'`, e na linha 162, manter `'Óvulo: 24 cromossomos'` com uma nota no `ph[0]`: "(na verdade, um ovócito II)". Outra opção é trocar as duas por "Ovócito II: 24 cromossomos".

### B6. Ovogênese no celular: rótulos encostados (já conhecido)
- gametogenese/ovogenese, captura gametogenese_ovogenese_2_m.png. "1º corpúsculo polar" fica sobre o ovócito II, "Ovócito I" fica sobre "mitoses e crescimento" e "Ovogônia" cobre o "2n". Na espermatogênese o mesmo acontece, mais leve: "mitoses e crescimento" encosta em "Espermatócito I" (gametogenese_espermatogenese_3_m.png).
- Correção em cenas3d-gametas.js, `animar`, na linha que define `g.anc[n.id]`:
  `g.anc[n.id] = add(p, !HZ && n.kind === 'pb' ? [n.r + .6, -n.r - .9, 0] : !HZ && n.r >= 5 ? [-n.r * .6, n.r * .8, n.r * .3] : [0, (n.kind === 'sp' ? n.r * .6 : n.r) + .15, n.kind === 'sp' ? 0 : n.r * .3]);`
  Assim, no modo vertical, o rótulo do corpúsculo polar fica abaixo e à direita dele e o das células grandes fica à esquerda, longe da coluna de etapas. Em `sobre`, ainda no modo vertical, desenhar as etapas (`c.PL`) com `s: 12` e em `y + 14`, logo abaixo da linha que liga as células. Para a ovogônia, desenhar o `pl` ("2n") só quando `n.r >= 1.2 || HZ`.

### B7. Citocinese no celular: a legenda da célula animal fica colada no título "Célula vegetal" (já conhecido)
- mitose/citocinese, captura mitose_citocinese_2_m.png. Arquivo: cenas3d-divisao.js, linha 132: `offA = ... [0, 7.4, 0]`, `offB = ... [0, -7.4, 0]`. Com a legenda em `-7.6` e o título em `+6.6`, sobra um vão de só 0,6 unidade.
- Correção: na linha 132, usar `[0, 8.8, 0]` e `[0, -8.8, 0]`. Na linha 173, usar `b = ... larg ? -6.4 : -6.8`. Na `camera`, usar `hy = larg ? 6.5 : 15.6`. O vão passa a cerca de 4 unidades, ou cerca de 35 px.

### B8. Câncer no celular: cena pequena, com sobra vertical e rótulos sumidos (já conhecido)
- ciclo/cancer, captura ciclo_cancer_3_m.png. O epitélio ocupa cerca de 1/4 da altura do palco. "Tumor", "Vaso sanguíneo" e "Metástase" mostram só o ponto da âncora, sem o texto.
- Correção em cenas3d-ciclo.js, `camera`: `const big = P.i >= 2, nar = g.v.w < 640; return C3.viva({ th: -.42 + .08 * P.u, fi: nar ? .7 : .34, d: C3.enquadrar(g, nar ? 11.5 : 13.5, big ? 8.5 : 7.5, 6), al: [0, big ? 0 : -.6, 0] }, g.t, .7);`. Com a câmera mais de cima, a profundidade do epitélio e o vaso ocupam a altura que sobra. Depois, conferir de novo os 3 rótulos no celular.

### B9. Etiquetas de gameta cortadas ou encostadas no alto dos diagramas duplos
- meiose/segregacao (meiose_segregacao_4.png): o "aB" de cima encosta no cartão `inf`, e em 1280 × 720 com o palco em 640 px a célula da direita do Arranjo 2 sai da borda. Em erros/naodisjuncao (erros_naodisjuncao_5.png), o "n" de cima à direita fica cortado sob o cartão. Em comparar/lado no celular (comparar_lado_6_m.png), "n = 2" encosta no título "Meiose". No celular (meiose_segregacao_0_m.png), "Arranjo 1" é desenhado em cima da célula.
- Correção em cenas3d-divisao.js: em `camera` de `porEstados`, somar a folga das etiquetas à altura, com `hy = ... + (c.diag.length > 1 ? 2.6 : 1.8)`. Em `sobre`, quando a etiqueta ficar acima do topo útil, desenhá-la abaixo da célula com `p[1] = Math.max(p[1], 70)`. No celular, usar `tituloY: 150` para tirar o título de cima da célula.

## Contagem

M: 2. B: 9.
