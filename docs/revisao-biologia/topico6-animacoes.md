# Revisão das animações 3D do módulo Histologia (tópico 6)

Revisores: 🔬 Taxon (tecidos, epitelial e conjuntivo) e 🧬 Sapien (sangue, muscular e nervoso), cada um com uma olhada rápida na parte do outro. Escopo: as 17 rotas tecidos/visao, epitelial/revestimento, epitelial/glandular, conjuntivo/propriamente, adiposo, cartilagem, osso, ossificacao, sangue/elementos, sangue/coagulacao, muscular/tipos, sarcomero, contracao, nervoso/neuronio, glia, impulso e sinapse. Base: leitura de histo3d.js, cenas3d-tecidos.js, cenas3d-conjuntivo.js, cenas3d-sangue.js, cenas3d-musculo.js e cenas3d-nervoso.js (e das legendas que vêm das cenas 2D, que rodam escondidas); os roteiros histologia-roteiro.md e histologia-roteiro-b.md; as capturas em /tmp/claude-0/t6/shots/ e as montagens /tmp/claude-0/t6/mont_*.png. Parte das montagens é de versões anteriores do código: quando a captura mais nova (sufixos b, c, d, e) já mostrava o problema resolvido, ele não entrou como achado. Nada foi editado no código.

Gravidade: M quer dizer que muda o conteúdo ou que há um erro científico. B quer dizer um problema menor (texto, regra de tela ou layout).

## O que conferimos e está certo

- Visão geral: intestino com epitélio simples prismático e células caliciformes, conjuntivo com vasos, muscular e plexo nervoso; pele com epiderme estratificada queratinizada e vasos só na derme. Proporção de células e matriz com "cerca de".
- Epitélio de revestimento: os 7 tipos (simples pavimentoso, cúbico e prismático com microvilosidades e caliciformes; pseudoestratificado com núcleos em alturas diferentes, cílios e muco; estratificado queratinizado e não queratinizado; transição), sempre sobre a membrana basal e com o capilar só no conjuntivo, de onde a difusão sobe até as células.
- Glandular: exócrina com ducto, porção secretora e secreção saindo na superfície; endócrina sem ducto, em cordões junto ao capilar, com o hormônio entrando no sangue.
- Conjuntivo propriamente dito: fibras colágenas e elásticas, substância fundamental, fibroblasto, macrófago (fagocitose de bactéria), mastócito com histamina e vaso que se dilata; frouxo e denso pela faixa.
- Adiposo: adipócito branco com uma gota e núcleo achatado na borda; pardo multilocular, com núcleo central, mais no recém-nascido; ácidos graxos saindo no jejum.
- Cartilagem: condrócitos em lacunas, grupos isógenos, matriz sem vasos, nutrição por difusão a partir do vaso do pericôndrio; hialina (anéis em C da traqueia com músculo liso atrás), elástica (orelha) e fibrosa (disco entre vértebras).
- Osso: compacto e esponjoso, medula vermelha e amarela; ósteon com canal de Havers, lamelas concêntricas, osteócitos com canalículos e canal de Volkmann; remodelação com osteoclasto multinucleado e osteoblastos.
- Ossificação: intramembranosa no crânio (centros no mesênquima, fontanelas, a anterior até cerca de 2 anos) e endocondral no osso longo (molde de cartilagem, centro primário, canal medular, centros secundários, disco epifisário que fecha no fim da adolescência).
- Sangue: hemácias anucleadas e bicôncavas, neutrófilo com núcleo em gomos, linfócito, monócito com núcleo em rim, eosinófilo com grânulos alaranjados, plaquetas como fragmentos de megacariócito; tubo centrifugado com plasma cerca de 55%, hemácias cerca de 45% e faixa branca menor que 1%; altitude e eritropoetina.
- Coagulação: vaso se contrai, tampão de plaquetas, cascata em três degraus (tromboplastina e Ca²⁺; protrombina vira trombina, com vitamina K; fibrinogênio vira fibrina), rede prendendo hemácias. Botões vitamina K, hemofilia, AAS e sem cálcio falham no degrau certo.
- Muscular: esquelético com muitos núcleos periféricos e estrias, cardíaco com 1 ou 2 núcleos centrais e discos intercalares, liso fusiforme com 1 núcleo central. Sarcômero com banda A fixa em 1,6 µm, banda I e zona H encurtando (zona H some em 2,0 µm), actina e miosina sem encurtar. Ponte cruzada com Ca²⁺ na troponina, tropomiosina saindo da frente e ATP soltando a cabeça da miosina; curare, toxina botulínica, organofosforado e falta de ATP corretos.
- Nervoso: neurônio com dendritos, corpo celular, núcleo, axônio, mielina, nodos de Ranvier e terminais; glia do SNC (astrócito no capilar, oligodendrócito com vários axônios, micróglia, ependimárias) e do SNP (célula de Schwann com um só axônio); potencial de ação com repouso −70, limiar −55 e pico +30, entrada de Na⁺ e saída de K⁺, condução saltatória; sinapse com vesículas, Ca²⁺, fenda de cerca de 20 nm, receptores, enzima e recaptação.
- Regras de texto nos arquivos 3D novos: nenhum "!", "·", "→" ou "↔" visível, aproximações com "cerca de", nenhum código interno visível.

## Erros de conteúdo (M)

### M1. Sangue/elementos: o basófilo não existe na cena 3D, e "Próxima célula" pula monócito e eosinófilo (Sapien)
- Rota: sangue/elementos. Arquivo: cenas3d-sangue.js, linhas 16 a 26 (`PE`, `ORDEM`, `LEU`) e linha 93. O roteiro (tabela de leucócitos e animação) e o esfregaço 2D (cenas-c.js, linha 43) têm o basófilo; no 3D só há neutrófilo, linfócito, monócito e eosinófilo. Além disso, `ORDEM = ['hem', 'neutro', 'linfo', 'plaq']`, então o botão nunca mostra o monócito nem o eosinófilo, que só aparecem por toque.
- Correção: (1) em `PE`, depois da linha 20, `baso: { nome: 'Basófilo', frase: 'Grânulos escuros que quase escondem o núcleo; libera histamina e heparina. De 0,5 a 1% dos leucócitos.', cor: '#9C8AD0' },`. (2) linha 25: `const ORDEM = ['hem', 'neutro', 'linfo', 'mono', 'eosi', 'baso', 'plaq'];`. (3) linha 26: acrescentar `['baso', .27, .12]` a `LEU`. (4) linha 93: trocar `else {` por `else if (id === 'eosi') {` e acrescentar depois `else { nk([0, 0, .05], [.5, .45, .45], '#3A2470'); for (let j = 0; j < 16; j++) { const u2 = j * 2.4, y2 = 1 - (j + .5) / 8; H3.put(g, g.gra, add(p, [Math.cos(u2) * .6 * r, y2 * .5 * r, Math.sin(u2) * .6 * r]), null, .12 * r, null, null, '#2E1A5A', 1, g.pecas.baso); } }`. (5) linha 33: acrescentar `{ pc: 'baso', t: 'basófilo', pr: 8, se: g => g.lar }` aos `rotulos`; linha 121: incluir `'baso'` na lista. Conferir que `g.gra` comporta mais 16 instâncias.

### M2. Conjuntivo/propriamente: a legenda cita o plasmócito, mas ele não está na cena 3D (Taxon)
- Rota: conjuntivo/propriamente. Arquivo: cenas3d-conjuntivo.js, linhas 18 a 32 (`pecas` e `rotulos`). A legenda padrão, que vem de cenas-b.js linha 223, diz "o plasmócito solta anticorpos" (captura conjuntivo_propriamente_1200b), e o card ENEM cobra o plasmócito, mas o 3D só tem fibroblasto, macrófago e mastócito. O aluno procura uma célula que não existe.
- Correção: em `pecas`, depois da linha 23, `plasm: { nome: 'Plasmócito', frase: 'Vem do linfócito B e produz anticorpos.', cor: '#7FA4E8' },`; na linha 32 acrescentar `{ pc: 'plasm', t: 'plasmócito' }`; no `montar`, criar `g.pla` como o mastócito (linha 44), com `H3.lumpy(g, 'pla', 87, 3, 3, .05, .5, .9)`, cor `#9DB8EE` e um núcleo redondo deslocado para a borda (núcleo excêntrico); no `animar`, perto do mastócito (linha 85), soltar 6 a 8 pontinhos azuis (`H3.brilho`) se afastando dele, e `ach(g, 'plasm', ...)` na linha 96.

## Problemas menores (B)

### B1. Neurônio no desktop: o rótulo "terminais do axônio" encosta na legenda (pedido)
- Rota: nervoso/neuronio, 1200 px (captura nervoso_neuronio_1200b). Arquivo: cenas3d-nervoso.js, linha 101: `ach(g, 'term', w(g.ter[0][7]))`. O ramo 0 é o de baixo (`d[1] = (0 - 2) * .45`), e o rótulo cai logo acima da caixa da legenda. No celular (390 px) o mesmo rótulo some, porque bate na legenda.
- Correção: linha 101, `ach(g, 'term', w(g.ter[3][7]))` (ramo de cima do leque, longe da legenda). Se ainda encostar, linha 106, câmera do desktop: `cam(g, P, 5.5, 2.6, { th: .2, fi: .2, al: [.8, -.05, 0], k: 1.02 })`, o que também evita que a ponta do dendrito de cima saia do palco. Conferir em 1200 e 390 px.

### B2. Sinapse no desktop: "célula seguinte" fica atrás da legenda (Sapien)
- Rota: nervoso/sinapse, 1200 px (captura nervoso_sinapse_1200b). Arquivo: cenas3d-nervoso.js, linha 377: `ach(g, 'pos', [1.2, -1.2, .02])`.
- Correção: `ach(g, 'pos', [1.2, -.7, .02])`.

### B3. Do nervo à contração no celular: a ponte cruzada aparece por baixo da legenda nos passos 1 e 2 (Sapien)
- Rota: muscular/contracao, 390 px, passo 1 (captura muscular_contracao_390d). Arquivo: cenas3d-musculo.js, linha 238. O grupo `g.J` some depois do passo 3, mas o `g.Z` (actina, tropomiosina e miosina) fica sempre visível e corta a legenda enquanto a câmera está na junção.
- Correção: no fim da linha 238, `g.Z.visible = lar || v >= 2.8;`.

### B4. Três tecidos musculares no celular: "1 núcleo central" do liso fica sob a legenda (Sapien)
- Rota: muscular/tipos, 390 px, zoom órgão (captura muscular_tipos_390c). Arquivo: cenas3d-musculo.js, linha 95, câmera em pé: `cam(g, P, 1.3, 4.1, { th: 0, fi: .04, al: [0, -.2, 0], k: 1.0, viva: .25 })`.
- Correção: `cam(g, P, 1.3, 4.6, { th: 0, fi: .04, al: [0, -.3, 0], k: 1.0, viva: .25 })`, para caber as três faixas com o texto de baixo. Conferir que o título "Estriado esquelético" não encosta no chip do topo.

### B5. Glia: o astrócito "forma" a barreira hematoencefálica (Sapien)
- Rota: nervoso/glia. Arquivo: cenas3d-nervoso.js, linha 115: `'Célula em estrela: sustenta os neurônios, leva nutrientes do sangue até eles e forma a barreira hematoencefálica.'`. Quem forma a barreira são as junções do endotélio do capilar; o astrócito ajuda. A legenda 2D e a frase do capilar (linha 114) já dizem "ajuda a formar".
- Correção: `'Célula em estrela: sustenta os neurônios, leva nutrientes do sangue até eles e ajuda a formar a barreira hematoencefálica.'`.

### B6. Ossificação endocondral: o centro do molde vira osso antes de o vaso chegar (Taxon)
- Rota: conjuntivo/ossificacao. Arquivo: cenas3d-conjuntivo.js, linhas 374 e 382; legenda em cenas-b.js, linha 668. No 3D o centro primário começa em `sst(8, 16, v)` e o vaso só entra em `sst(11, 14, v)`; a legenda diz "O centro do molde vira osso, chega um vaso e abre-se o canal medular". Na endocondral, a cartilagem do meio degenera, o vaso entra e só então os osteoblastos que ele traz fazem osso (como a própria frase de `pri`, linha 330, e de `vas`, linha 334, explicam).
- Correção: linha 374, `const pc = sst(11, 17, v)`; linha 382, primeiro vaso com `sst(8, 11, v)`. Legenda (cenas-b.js, linha 668, faixa `v < 24`): `'Um vaso entra no meio do molde, a cartilagem é trocada por osso e abre-se o canal medular; as placas do crânio crescem'`. Mesma troca no `alt` da linha 633: `o centro vira osso, chega um vaso` por `chega um vaso ao centro, que vira osso`.

### B7. Cartilagem fibrosa aparece com pericôndrio (Taxon)
- Rota: conjuntivo/cartilagem, tipo fibrosa. Arquivo: cenas3d-conjuntivo.js, linhas 187 e 230. A capa de pericôndrio e o rótulo continuam no tipo fibroso, que não tem pericôndrio (e o rótulo diz que ele "nutre e forma novas células").
- Correção: linha 187, guardar a capa (`g.per = per;` depois de `per.position.x = -2.16;`); no `animar`, `g.per.visible = k < 2;`; linha 230, trocar `ach(g, 'peric', ...)` por `if (k < 2) ach(g, 'peric', w([-2.16, .35, .8]));`.

### B8. Adiposo: o capilar atravessa os adipócitos (Taxon)
- Rota: conjuntivo/adiposo, 1200 px (captura conjuntivo_adiposo_1200). Arquivo: cenas3d-conjuntivo.js, linha 126. O tubo passa em z de .05 a .1, dentro da fileira da frente (centros em z −.25, raio de cerca de .5), e aparece cortando as células, quando os capilares correm entre elas.
- Correção: `g.vaso = H3.vaso(g, [[-3.6, -.15, .32], [-2, -.3, .36], [0, -.05, .32], [1.6, -.25, .36]], .12, { pc: 'vaso', n: 10, vel: .05, base: .3 });`, que passa por cima da face da frente do bloco. Conferir que os ácidos graxos (linha 151) ainda chegam ao tubo.
