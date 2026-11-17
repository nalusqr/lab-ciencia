# Revisão das animações 3D do módulo Embriologia (tópico 5)

Revisores: 🔬 Taxon (gametas, ovos e desenvolvimento) e 🧬 Sapien (anexos e humano), cada um com uma olhada rápida na parte do outro. Escopo: as 18 rotas gametas/resumo, ovos/tipos, ovos/vitelo, desenvolvimento/segmentacao, morula, blastula, gastrula, blastoporo, folhetos, neurula, organogenese, anexos/funcoes, anexos/amniotico, humano/fecundacao, nidacao, placenta, gemeos e semanas. Base: leitura de embrio3d.js, cenas3d-gametas-ovos.js, cenas3d-inicio.js, cenas3d-corpo.js, cenas3d-anexos.js e cenas3d-humano.js; os roteiros embriologia-roteiro.md e embriologia-roteiro-b.md; as folhas de contato em /tmp/claude-0/t5/shots/ e capturas novas (`*_rv.png` e `*_rvc.png`, feitas com cap.js). Parte das folhas de contato é de uma versão anterior do código: o que só aparecia nelas e sumiu nas capturas novas (blastóporo do celular sem endoderme no deuterostômio, título da 30ª semana cortado, rótulo "embrião" na 30ª semana) não entrou como achado. Nada foi editado no código.

Gravidade: M quer dizer que muda o conteúdo ou que há um erro científico. B quer dizer um problema menor (texto, regra de tela ou layout).

## O que conferimos e está certo

- Gametogênese: espermatócito primário 2n, meiose I e II com divisões iguais e 4 espermatozoides; ovogênese com citoplasma desigual, ovócito primário parado na prófase I, ovócito secundário ovulado em metáfase II, meiose II só com a entrada do espermatozoide, corpúsculos polares.
- Tipos de ovo e segmentação: oligolécito com holoblástica igual (ouriço-do-mar, anfioxo, mamíferos), heterolécito com vitelo no polo vegetativo e holoblástica desigual (micrômeros em cima, macrômeros embaixo; a 3ª clivagem fica deslocada para o polo animal), telolécito com meroblástica discoidal só na cicatrícula (aves, répteis, maioria dos peixes), centrolécito com núcleos que se dividem no centro e migram para a periferia (insetos). Ovos/vitelo: ave com desenvolvimento direto em 21 dias; anfíbio com larva e metamorfose (patas de trás primeiro); mamífero placentário quase sem vitelo, nutrido pela placenta.
- Mórula maciça; blástula com blastocele (anfioxo central, anfíbio deslocada para o polo animal, ave em disco, blastocisto com trofoblasto e massa celular interna); gástrula com arquêntero revestido de endoderme, blastóporo, mesoderme entre os folhetos, blastocele encolhendo e notocorda; protostômios (anelídeos, moluscos, artrópodes; blastóporo vira boca) e deuterostômios (equinodermos e cordados; blastóporo vira ânus).
- Folhetos: ectoderme (epiderme, encéfalo, medula, cristalino), mesoderme (coração, sangue, rins, ossos, músculos), endoderme (epitélio do tubo digestório e dos pulmões, fígado, pâncreas, tireoide), estômago e intestino como órgãos mistos. Nêurula com notocorda induzindo a placa neural, sulco, pregas, tubo, crista neural, somitos e endoderme ventral. Organogênese: coração no dia 22, braços no 26, pernas cerca de 2 dias depois, cerca de 30 mm no dia 56.
- Anexos: vesícula vitelínica (nutrição; no humano sem vitelo, primeiras células do sangue), âmnio (proteção, bolsa d'água), córion (trocas, vilosidades, hCG), alantoide (excretas e trocas; no humano vasos umbilicais). Quem tem cada um segue o roteiro B (peixes só vesícula vitelínica, anfíbios sem anexos, répteis e aves com os quatro, placentários com placenta). Linha do tempo com "cerca de 370" e "cerca de 312" milhões de anos.
- Humano: fecundação na ampola com capacitação, reação acrossômica, bloqueio da polispermia, 2º corpúsculo polar e pronúcleos n; hCG a partir do dia 6,5, dobrando a cada cerca de 2 dias e passando de 25 mUI/mL perto do dia 14; cenários sem gravidez e ectópica. Placenta com parte fetal e materna, artérias umbilicais azuis (pobres em O₂) e veia vermelha, O₂, glicose e IgG da mãe para o feto, CO₂ e ureia do feto para a mãe, álcool e rubéola atravessam, hemácia não. Gêmeos: até o dia 3 dicoriônicos e diamnióticos (cerca de 1/3), 4 a 8 monocoriônicos e diamnióticos (cerca de 2/3), 9 a 12 mono e mono (cerca de 1%), depois unidos; dizigóticos sempre com 2 córions e 2 âmnios. Semanas: embrião até a 8ª semana e feto depois, DUM com 2 semanas a mais, trimestres 0 a 13, 13 a 27, 27 a 40, tamanhos e massas iguais à tabela do roteiro B.
- Regras de texto nos arquivos 3D novos: nenhum "!", "·", "→" ou "↔" visível, nenhum código interno visível. As ocorrências antigas estão em B1 a B4.

## Erros de conteúdo (M)

### M1. Placenta, nível "membrana": o rótulo "vilosidade" aponta para o capilar do feto (Sapien)
- Rota: humano/placenta, zoom 3. Arquivo: cenas3d-humano.js, linha 183 (`g.cap3 = ... 'vil', g.N[3]`) e linha 208 (`ach(g, 'vil', w([1.8, .3, .4]))`). O tubo vermelho interno é o capilar com sangue do feto; a vilosidade é a cápsula lilás em volta (já rotulada "membrana placentária"). O aluno lê que a vilosidade é o vaso do feto.
- Correção: em `pecas` (depois da linha 158) acrescentar `cap: { nome: 'Capilar do feto', frase: 'Vaso do feto dentro da vilosidade: por ele corre o sangue do feto, separado do sangue da mãe pela membrana placentária.', cor: K.sangueF },`; na linha 165 acrescentar `{ pc: 'cap', t: 'capilar do feto' }` aos `rotulos`; na linha 183 trocar `'vil', g.N[3]` por `'cap', g.N[3]`; na linha 208 trocar `ach(g, 'vil', w([1.8, .3, .4]))` por `ach(g, 'cap', w([1.8, .3, .4]))`.

### M2. Organogênese: a linha do tempo põe o embrião uma semana antes (Taxon)
- Rota: desenvolvimento/organogenese. Arquivo: cenas3d-corpo.js, linhas 164 a 171. O marcador fica em `fx(d / 7)` e os rótulos "1ª" a "9ª" ficam no início de cada intervalo. Dia 22 (início da 4ª semana) cai logo depois do traço "3ª"; dia 39 (6ª semana, como diz a faixa) aparece entre "5ª" e "6ª" (captura desenvolvimento_organogenese_6f3_1200). A faixa rosa de teratógenos vai do traço 3 ao 8 e deixa a 8ª semana de fora.
- Correção: na linha 164, depois de `fx = w => ...`, acrescentar `, sem = dd => 1 + (dd - 1) / 7` e trocar `wk = d / 7` por `wk = sem(d)`. Linha 165: `rr(fx(3), y - 5, fx(9) - fx(3), 10, 5, 'rgba(242,85,106,.28)')`. Linha 168: `circ(fx(sem(dd)), y, 3, ...)`. Linha 171: `tx('período mais sensível a teratógenos', fx(9), y - 18, ...)`. Assim o dia 22 fica no começo da 4ª, o dia 56 no fim da 8ª, e a faixa cobre as semanas 3 a 8 como no roteiro.

### M3. Ovos/tipos: o telolécito aparece com uma calota grande de citoplasma livre (Taxon)
- Rota: ovos/tipos, faixa de 70 a cerca de 85. Arquivo: cenas3d-gametas-ovos.js, linha 109: `f = ... mix(.22, .9, us)`. Em v = 70 o nível do vitelo fica em 0,32 R, e cerca de um terço do ovo aparece branco (citoplasma) acima da gema, enquanto o painel diz "citoplasma só na cicatrícula".
- Correção: linha 109, `const f = cen ? 0 : v < 25 ? 0 : v < 70 ? mix(.22, .62, (v - 25) / 45) : mix(.9, .95, (v - 70) / 30), lvl = -R + 2 * R * f;`. O heterolécito continua com o vitelo na metade vegetativa e, a partir de 70, a gema chega até a cicatrícula.

## Problemas menores (B)

### B1. Card ENEM da mórula com "→" (já conhecido)
- Rota: desenvolvimento/morula. Arquivo: cenas-b.js, linha 253. Trecho: `A sequência que a prova cobra é <b>zigoto → mórula → blástula → gástrula → nêurula</b>.`
- Correção: `A sequência que a prova cobra é, nessa ordem, <b>zigoto, mórula, blástula, gástrula e nêurula</b>.`

### B2. Card ENEM da nidação com "→" (já conhecido)
- Rota: humano/nidacao. Arquivo: cenas-d.js, linha 668. Trecho: `Sequência para não errar: <b>zigoto → mórula (3º dia, chega ao útero) → blastocisto (4º-5º dia) → nidação (6º-7º dia)</b>;`
- Correção: `Sequência para não errar: <b>zigoto, depois mórula (3º dia, chega ao útero), blastocisto (4º-5º dia) e nidação (6º-7º dia)</b>;`. O resto da linha 668 e a frase da linha 670 (pílula do dia seguinte e DIU de cobre) ficam como estão.

### B3. Quadro da placenta com "→" (já conhecido)
- Rota: humano/placenta. Arquivo: cenas-e.js, linha 287. Trechos: `['Mãe → feto', 'O₂, glicose, aminoácidos, água, sais, IgG']` e `['Feto → mãe', 'CO₂ e ureia']`.
- Correção: `['Da mãe para o feto', 'O₂, glicose, aminoácidos, água, sais, IgG']` e `['Do feto para a mãe', 'CO₂ e ureia']`.

### B4. Título da aba com "·" (já conhecido)
- Todas as rotas. Arquivo: motor.js, linha 194: `` document.title = `${o.t} · Embriologia · LAB`; ``. Também index.html, linha 6: `<title>Embriologia · LAB</title>`.
- Correção, no padrão de Histologia e Vírus: `` document.title = `${o.t} | Embriologia | LAB`; `` e `<title>Embriologia | LAB</title>`.

### B5. Semanas@20 no desktop: a legenda encosta na base e cobre a banana e o feto (pedido)
- Rota: humano/semanas, semana 20, 1200 px (capturas humano_semanas_20f3_1200 e humano_semanas_20_1200_rvc). A legenda tem 3 linhas e repete a viabilidade: `limite de viabilidade, com UTI. O tracejado na barra marca o limite de viabilidade, 22 a 24 semanas pela DUM`. Ela fica a cerca de 10 px da base do palco, por cima da ponta da banana e da parte de baixo do feto.
- Correção: (1) cenas-e.js, linha 568: trocar `w >= 20 && w <= 22` por `w >= 21 && w <= 22` (na semana 20 o marco já fala da viabilidade), e a legenda volta a 2 linhas. (2) cenas3d-humano.js, linha 302, câmera do desktop: `cam(g, P, L * 1.7, L * 1.6, { th: .1, al: [0, L * .3, 0], viva: .4 })`, para afastar um pouco e subir o par feto e objeto. Depois, conferir no desktop as semanas 20, 21 e 38.

### B6. Semanas: tamanho sem "cabeça-nádega"
- Rota: humano/semanas. Arquivo: cenas3d-humano.js, linha 305. Na 38ª semana a tela diz `cerca de 360 mm`, e o aluno compara com os cerca de 50 cm do recém-nascido. O roteiro B pede o rótulo na tela.
- Correção: no desktop, `` `cerca de ${arred(mm)} mm da cabeça às nádegas${ms ? `; cerca de ${nbr(ms)} g` : ''}; ao lado, ${OBJ[oi].n}` ``; no celular, `` `cerca de ${arred(mm)} mm (cabeça às nádegas)${ms ? ` e ${nbr(ms)} g` : ''}` `` (sem "ao lado, ...", porque o rótulo "comparação" já aparece).

### B7. Semanas: 45 g na 12ª semana viram "cerca de 50 g"
- Rota: humano/semanas, semana 12. Arquivo: cenas3d-humano.js, linha 304: `Math.round(interp(MAS, w) / 10) * 10`.
- Correção: `const mr = interp(MAS, w), ms = w >= 12 ? (mr < 100 ? Math.round(mr / 5) * 5 : Math.round(mr / 10) * 10) : 0;`.

### B8. Organogênese e Semanas dão tamanhos diferentes para a 4ª e a 5ª semana
- Rotas: desenvolvimento/organogenese (dia 28: 4 mm; dia 35: 8 mm) e humano/semanas (4ª: 5 mm; 5ª: 7 mm). Arquivo: cenas3d-corpo.js, linha 140.
- Correção: `const MM = [[22, 3], [28, 5], [35, 7], [42, 13], [49, 17], [56, 30]];` (igual à linha 265 de cenas3d-humano.js e dentro das faixas do roteiro B).

### B9. Nidação: frase do endométrio com "6º ao 10º dia"
- Rota: humano/nidacao. Arquivo: cenas3d-humano.js, linha 92. Trecho: `O blastocisto se implanta nele por volta do 6º ao 10º dia.`
- Correção: `O blastocisto começa a se implantar nele por volta do 6º ou 7º dia, e a nidação se completa por volta do 10º.`

### B10. Nidação no celular: o rótulo "tuba uterina" cobre o embrião e a fita do teste cobre as tubas
- Rota: humano/nidacao, 390 px, dia 20 (folhas sheet6 e sheet7). O rótulo da tuba (âncora `Pt[18]`) fica em cima do embrião no fundo do útero, e o rótulo "embrião" não aparece; a fita "teste positivo" fica sobre a tuba direita.
- Correção em cenas3d-humano.js: linha 130, `if (d < 4 || cen === 'ect' || E3.deitado(g)) ach(g, 'tuba', Pt[18]);` (no celular, o nome da tuba só aparece enquanto o embrião está nela); linha 132, câmera do celular com `al: [0, 1.4, 0]` no lugar de `[0, .9, 0]`. Conferir no celular.

### B11. Ovos/tipos: o rótulo "cicatrícula" não aparece no telolécito
- Rota: ovos/tipos, 80 e 95 (capturas ovos_tipos_80_390_rv e ovos_tipos_95_390_rv). A âncora da cicatrícula fica colada na do núcleo e o rótulo some.
- Correção: cenas3d-gametas-ovos.js, linha 128: `ach(g, 'cic', [-R * .38, R * .92, 0])`.

### B12. Ovo amniótico: "Mamíferos" na cena e "Mamíferos placentários" na faixa
- Rota: anexos/amniotico. Arquivo: cenas3d-anexos.js, linha 101 (`l: 'Mamíferos'`). Monotremados não têm placenta.
- Correção: `l: 'Mamíferos placentários'` e, na linha 153, `E3.reserva(g, [q[0] - 85, q[1] - 10, 170, 20])`.

### B13. Segmentação no celular: botões com o nome cortado
- Rota: desenvolvimento/segmentacao, 390 px (sheet2). "Ovo oligolécito" e "Ovo heterolécito" passam da largura do botão. Arquivo: cenas-b.js, linha 172: `` t: `Ovo ${T.o}` ``.
- Correção: `t: T.o[0].toUpperCase() + T.o.slice(1)` ("Oligolécito", "Heterolécito"...). Se ainda cortar em 390 px, pôr os 4 botões em 2 linhas de 2.

### B14. Gametas: legenda cobrindo a base no desktop e "ovócito secundário" só na célula de baixo
- Rota: gametas/resumo, 1200 px (gametas_resumof9_1200). A legenda cobre as caudas dos espermatozoides e a metade de baixo do ovócito. O ovócito secundário de verdade (a célula grande do meio, saída da meiose I) fica sem nome.
- Correção em cenas3d-gametas-ovos.js: linha 73, `cam(g, P, E3.deitado(g) ? 8.8 : 5.6, 8.2, { al: [0, -.8, 0] })`; linha 64, trocar a âncora por `if (k1 > .6) ach(g, 'oc2', [q1[0] - 1.45 * L, q1[1] + .9, 0]);` (fora do `if (k2 > .02)`), e depois da linha 63 acrescentar `if (sai > .5) E3.texto(g, [q2[0], q2[1] - so - .6, 0], 'ovócito fecundado', { s: 12, c: C.dim });`. Conferir no desktop.

### B15. Blastóporo no desktop: a linha dos grupos fica por cima das células
- Rota: desenvolvimento/blastoporo, 1280 px (desenvolvimento_blastoporo_100_1280_rv). "anelídeos, moluscos, artrópodes" e "equinodermos e cordados" ficam sobre a borda da gástrula.
- Correção: cenas3d-inicio.js, linha 278: `add(b, [0, g.R + 1.1, 0])` no lugar de `add(b, [0, g.R + .6, 0])`.

### B16. Mórula: a compactação só aparece depois de 32 células
- Rota: desenvolvimento/morula. Arquivo: cenas3d-inicio.js, linha 127. Nos mamíferos a compactação começa com cerca de 8 células (3º dia).
- Correção: no terceiro texto do painel, `NAR ? null : n === 6 ? 'nos mamíferos, a compactação começa já com cerca de 8 células' : 'o embrião não cresce: as células ficam menores'`.

### B17. Semanas: o marcador cobre o nome do trimestre e "período fetal" cai sobre o tracejado
- Rota: humano/semanas, 390 e 1200 px. Arquivo: cenas3d-humano.js, linhas 312 e 314.
- Correção: linha 314, `marker(fx(w + 2), y2 + 4, '#FFB347')`; linha 312, `tx('período fetal', (fx(26) + fx(40)) / 2, y2 + 20, ...)`.

## Olhada cruzada

- 🧬 Sapien na parte do Taxon: confirma M2 (a faixa da organogênese diz "6ª semana" e o marcador mostra a 5ª) e B8 (tamanhos diferentes nas duas rotas). Nada a corrigir nos derivados dos folhetos.
- 🔬 Taxon na parte do Sapien: confirma M1; anexos por grupo, gêmeos e hCG conferem com o roteiro B.
