# Revisão das animações novas do módulo Morfofisiologia (tópico 2)

Revisores: Taxon (teoria celular e procarionte × eucarionte) e Sapien (membranas e núcleo), cada um com uma olhada rápida na parte do outro. Escopo: as 26 rotas de teoria/, tipos/, membranas/ e nucleo/. Base: capturas em /tmp/claude-0/t2/shots/, as figuras de IA em site/img/ia/morfofisiologia-*.webp (as vistas a e b) e a leitura dos textos em cenas-figura.js, cenas2d.js, cenas3d-membranas.js, cenas3d-nucleo.js, morfo3d.js, cena-euc.js e nos `sz`/`s` do index.html. Nada foi editado no código.

Gravidade: M quer dizer que muda o conteúdo ou que há um erro científico. B quer dizer um problema menor.

## O que conferimos e está certo

- Bomba (membranas/bomba): os 6 passos estão na ordem certa (3 Na⁺ do citoplasma, fosforilação, 3 Na⁺ saem, 2 K⁺ de fora, desfosforilação, 2 K⁺ entram). Os gradientes também: Na⁺ cerca de 12 vezes e K⁺ cerca de 35 vezes, coerentes com 145/12 e 4/140 mM.
- Osmose: as hemácias aparecem inchada, em disco e crenada, e as células vegetais túrgida, flácida e plasmolisada. A ordem hipo, iso, hiper está certa na figura, nos pontos e nas setas da água (entra, equilíbrio, sai).
- Núcleo/eu: a heterocromatina está na periferia, junto à carioteca, e a eucromatina no centro, tanto na figura quanto no texto. O nucleossomo tem 8 histonas e cerca de 147 pb.
- Cromatina: 2 nm, 11 nm, 30 nm, 300 nm, 1 400 nm, com compactação de cerca de 6, 40, 1 000 e 10 000 vezes. Acrocêntricos 13, 14, 15, 21 e 22. Telômero TTAGGG. Pré-rRNA 45S cortado em 18S, 5,8S e 28S, com o 5S feito fora do nucléolo. Poro com simetria de 8 partes e cerca de 120 nm, importina com Ran-GTP.
- Membranas: DOPC a cerca de −17 °C e DPPC a cerca de 41 °C. Os dados de composição batem com Guidotti/Karp. Colesterol entre as caudas e glicocálix na face externa.
- Procarionte: 70S × 80S, peptideoglicano como alvo da penicilina, plasmídeo e conjugação por pili. Organelas: centríolos ausentes nas plantas com flores, REL sem ribossomos.
- Regra de texto nos .js novos: nenhum "!", "·", "→" ou "↔" em texto de tela, e todos os números aproximados usam "cerca de". Os problemas de texto estão todos no index.html (achado B1).

## Achados M

### M1. As duas camadas da bicamada 3D aparecem separadas por um vão, como se fossem duas membranas
- Rotas: membranas/difusao, membranas/facilitada, membranas/bomba (o mesmo vale para as outras que usam `bicamada()`). Arquivo: morfo3d.js, linha 186: `Lc = o.cauda || 1.55, meia = o.meia || 2.15`.
- O que está errado: a cauda começa em cerca de 1,93 do plano médio e mede 1,55, então termina a 0,38 do meio. Fica um vão de cerca de 0,76 entre as pontas das caudas das duas camadas, bem visível nas capturas membranas_difusao.png, membranas_facilitada.png e membranas_bomba_1t1.6.png. O aluno lê "duas membranas", e isso confunde com a membrana dupla da carioteca e das mitocôndrias, que é tema frequente no ENEM.
- Correção: fazer as caudas se tocarem no meio. Por exemplo, `Lc = o.cauda || 1.9` (as pontas chegam a cerca de 0,03 do plano médio) e, em cenas3d-membranas.js linha 37 (fluidez), conferir que `meia * ... - Lc * Lk` fique perto de 0 nos dois lados (para DPPC, `meia: 2.2` pede `Lk` de cerca de 1,2 com a cauda nova; ou simplesmente reduzir `meia`).

### M2. Na figura de IA, o fago está fora de escala em relação à bactéria, e o cartão do lado diz outra coisa
- Rota: teoria/virus, vista a. Arquivos: img/ia/morfofisiologia-teoria-virus-a.webp e cenas-figura.js (`cena('teoria/virus'...)`, legenda 'Bacteriófagos infectando uma bactéria').
- O que está errado: cada fago tem cerca de 1/3 do comprimento da bactéria. Na realidade um T4 tem cerca de 0,2 µm e a E. coli cerca de 2 µm, ou seja, cerca de 1/10. O cartão da mesma tela diz "100 nm, vírus típico (bactéria: 2 µm)", então a figura contradiz o número que está ao lado dela. A proporção vírus × célula é cobrada no ENEM.
- Correção: trocar a legenda da vista a por 'Bacteriófagos infectando uma bactéria (fora de escala: o fago tem cerca de 1/10 do comprimento dela)'. Se a figura for gerada de novo, pedir fagos de cerca de 1/10 do comprimento da bactéria.

## Achados B

### B1. Regras de texto: "~", "→" e "↔" visíveis na tela (index.html)
- Os cartões `sz` do canto superior direito aparecem em todas as rotas, e estes trazem "~": teoria/leeuwenhoek `'~270×'`; teoria/virus `'~100 nm'`, `'vírus típico (bactéria: ~2 µm)'`; tipos/proc `'~2 µm'`; tipos/euc `'célula animal típica ~20 µm'`; membranas/mosaico `'~5 nm'`; membranas/facilitada `'~10⁸ íons/s'`; membranas/espec `'~1 µm'`; nucleo/geral `'~5–10 µm'`; nucleo/poro `'~120 nm'`; nucleo/cromatina `'~2 m → 46 cromossomos'` (tem "~" e "→" juntos, visto em nucleo_cromatina_3t2.png).
- Subtítulo da rota nucleo/poro (aparece no botão): `s:'o tráfego núcleo ↔ citoplasma'`.
- Nas lições (`d` e `kv`) das 26 rotas há cerca de 95 "~", por exemplo `'~2 µm × 0,8 µm'`, `'~145 / ~12 mM'`, `'Como 2 metros de DNA cabem num núcleo de ~6 µm?'`. Há também "→" em `'45S → 18S + 5,8S + 28S'` (kv do nucléolo, linha 797) e nas cenas 2D de reserva: linha 617, `'ATP → ADP: o fosfato se liga à proteína'`, e linha 805, `'pré-rRNA 45S  →  18S + 5,8S + 28S'`.
- Correção: trocar cada "~X" por "cerca de X". Por exemplo, `sz:['cerca de 2 µm', ...]`, `sz:['cerca de 270 vezes', ...]`, `sz:['cerca de 2 m em 46 cromossomos','DNA de uma célula humana']`, `s:'o tráfego entre núcleo e citoplasma'`, `'45S cortado em 18S, 5,8S e 28S'` e `'o ATP vira ADP: o fosfato se liga à proteína'` (igual ao texto do 3D). Como o cartão `sz` é curto, vale usar só o número quando ele for exato, ou escrever "cerca de" por extenso.

### B2. tipos/lado: a bactéria parece grande demais ao lado da célula animal
- Arquivo: img/ia/morfofisiologia-tipos-lado-a.webp e -b.webp, legenda 'A bactéria é muito menor e não tem organelas com membrana'. O corpo da bactéria tem cerca de 1/5 do diâmetro da célula, quando deveria ter cerca de 1/10 (2 µm contra 20 µm).
- Correção: acrescentar à legenda da vista a ', cerca de 10 vezes menor (figura fora de escala)'.

### B3. tipos/escala: o "10⁴" exagera e um nome sai cortado na borda
- O cartão diz `sz:['10⁴ ×','do ribossomo ao óvulo']`, mas 120 µm divididos por 25 nm dão cerca de 5 000. Correção: `sz:['cerca de 5 000 ×','do ribossomo ao óvulo']`.
- Em cenas2d.js, `if (r < 7 || x < 70 || x > W - 70) continue;` testa só o centro do rótulo, e por isso "Mycoplasma" e "cerca de 0,3 µm" aparecem cortados na borda direita (tipos_escala.png). Correção: medir a largura com `X.measureText(IT[i][0]).width` e pular o rótulo quando `x ± largura/2` sair de `[8, W - 8]`.

### B4. tipos/organelas: o cartão diz 13 estruturas, mas a cena tem 11 pontos
- index.html, `sz:['13','estruturas, cada uma com uma tarefa']`. Em cenas-figura.js há 11 pontos: núcleo, nucléolo, RER, REL, golgiense, mitocôndria, centríolos, lisossomo, parede, vacúolo e cloroplasto.
- Correção: `sz:['11', ...]`, ou acrescentar os 2 pontos que faltam (por exemplo membrana plasmática e peroxissomo).

### B5. teoria/schleiden: "Mitocôndria" diz que produz a energia
- cenas-figura.js, ponto `mito` de teoria/schleiden: 'Produz a energia da célula.' Energia não se produz, e esse é um distrator clássico.
- Correção: 'Faz a respiração celular e libera a energia dos nutrientes na forma de ATP. Existe nos dois tipos de célula.'

### B6. teoria/virus: dois nomes diferentes para a mesma estrutura
- O ponto `fibras` da vista a se chama 'Fibras da cauda' e o ponto `pernas` da vista b se chama 'Fibras de fixação', com o texto 'As pernas ficam estendidas...'.
- Correção: usar 'Fibras da cauda' nas duas vistas e, no texto de `pernas`, 'As fibras da cauda ficam estendidas até o vírus encontrar a bactéria que ele infecta.'

### B7. nucleo/eu: dois textos absolutos ou imprecisos
- Ponto `fibra`: 'onde os genes não podem ser lidos'. Correção: 'onde os genes ficam pouco acessíveis e quase não são lidos.'
- Ponto `poro`: 'Por ele saem os RNAs lidos na eucromatina.' Correção: 'Por ele saem os RNAs transcritos a partir da eucromatina.'

### B8. membranas/osmose: célula flácida
- Ponto `flacida`: 'a pressão contra a parede é pequena e o vacúolo encolhe.' Correção: 'Em meio isotônico, entra e sai a mesma quantidade de água: o vacúolo fica menor que na célula túrgida e a pressão contra a parede é pequena.'

### B9. Rótulos 3D escondidos ou soltos
- nucleo/cromossomos (nucleo_cromossomos.png): o rótulo "Acrocêntrico" não aparece, porque a caixa de "Submetacêntrico" fica em cima dele. Correção: dar `pr` mais alto ao t2 ou separar os tipos em x (cenas3d-nucleo.js, `TIPOS_C`).
- nucleo/poro (nucleo_poro.png): "Cesta nuclear" fica coberto pela legenda do passo. Correção: subir a âncora ou baixar a prioridade da legenda.
- membranas/endo (membranas_endo_2t3.2.png): o rótulo "Membrana plasmática" aponta para o vazio, longe da membrana. Correção: ancorar no ponto da bicamada que segue visível em cada tipo.
- membranas/difusao: "Meio extracelular" sai cortado na borda direita. Correção: limitar a âncora a x < W - largura do rótulo.

### B10. nucleo/nucleolo: aspas
- cenas3d-nucleo.js linha 415: `'<b>"Árvores de Natal": ...'`. Na fonte de título, a aspa reta aparece como ” nos dois lados (abre com uma aspa de fechar). Correção: `“Árvores de Natal”`.

### B11. tipos/euc (para conferir): o rótulo "Mitocôndria" parece apontar para o centrossomo
- Na captura tipos_euc.png, o ponto branco ao lado da caixa "Mitocôndria" fica no centro das fibras do citoesqueleto, e não num dos cilindros vermelhos. O 3D vem de ../celula/index.html?moldura=1. Correção: conferir a âncora da mitocôndria na cena da célula animal do módulo Célula.

## Olhada cruzada

- Sapien sobre teoria e tipos: concorda com M2 e B2. Conferiu Hooke 1665, Schleiden 1838, Schwann 1839, Virchow 1855, Leeuwenhoek com aumento de cerca de 270 vezes e bactérias em 1676, e o frasco de Pasteur com o pó retido na curva. Tudo correto.
- Taxon sobre membranas e núcleo: concorda com M1. Conferiu a ordem da bomba, a ordem da osmose e a heterocromatina na periferia. Tudo correto.
