# Revisão científica das telas · Embriologia (`site/embriologia/`)

Revisão de 🔬 Taxon (seções Ovos e Desenvolvimento) contra o roteiro `embriologia-roteiro.md`. O professor não edita código: o dono de cada arquivo aplica as correções.

## cenas-a (Aurelius)

Revisados: `#ovos/tipos` e `#ovos/vitelo`, nos textos (`d`, `kv`, cartões, legendas e rótulos) e nos desenhos, com as capturas `aurelius-ovos-*` em 1280 e 390 px (0%, 13%, 50%, 88%, 95% e 100%, além do modo centrolécito).

**Textos:** conferem palavra por palavra com o roteiro (O1 e O2), inclusive o quadro dos quatro tipos, os exemplos e os cartões ENEM. Não há erro científico nos textos.

### Correções obrigatórias (3)

**1. `#ovos/tipos`, rótulo "cicatrícula (núcleo)" (canvas, modo telolécito).**
A cicatrícula não é o núcleo: é o disco de citoplasma onde fica o núcleo. O texto do próprio tópico diz isso ("o citoplasma e o núcleo ficam num pequeno disco no polo animal, a cicatrícula"), e o rótulo o contradiz.
- Antes: `'cicatrícula (núcleo)'`
- Depois: `'cicatrícula (citoplasma e núcleo)'`. A linha de chamada deve apontar para o disco cinza, não para o ponto violeta. Se faltar espaço no celular, use só `'cicatrícula'`.

**2. `#ovos/tipos`, miniatura do oligolécito (fileira de botões embaixo).**
A miniatura mostra grânulos de vitelo grandes e densos, que cobrem quase toda a célula. Ela parece ter mais vitelo que a miniatura do heterolécito, o contrário do que o tópico ensina. O desenho grande está certo (poucos grânulos pequenos e espalhados).
- Correção: a miniatura deve usar a mesma densidade e o mesmo tamanho de grânulo do desenho grande, ou seja, poucos pontos pequenos sobre o citoplasma cinza. Lida da esquerda para a direita, a fileira precisa mostrar o vitelo **aumentando**.

**3. `#ovos/vitelo`, painel do mamífero: o embrião aparece fora do útero.**
Em todos os quadros, a bolsa com o embrião fica **em cima** da barra "útero", ligada a uma placenta pousada na superfície. Isso sugere desenvolvimento fora do corpo da mãe, que é justamente o contraste com a ave.
- Correção: desenhar o útero como uma cavidade (forma de pera ou "U" com a parede rosa) e colocar a bolsa com o embrião **dentro** dela. A placenta (disco lilás) fica **na parede** do útero e o cordão vai do embrião até ela. O rótulo "útero" fica na parede.
- No início da faixa (≈ 0 a 15%), em vez do embrião já curvado, mostrar o ovo/blastocisto **minúsculo** chegando e se implantando na parede, com o rótulo que já existe ("ovócito de cerca de 0,1 mm, quase sem vitelo"). O embrião curvado só aparece depois. É o que dá ao aluno a comparação de tamanho com a gema da ave.

### Ajustes recomendados (não bloqueiam)
- `#ovos/tipos`, modo centrolécito: acrescentar o rótulo `'citoplasma (na periferia)'` apontando para a borda cinza. É a característica que define o tipo, e hoje só "núcleo" e "vitelo" estão rotulados. A ilha de citoplasma com o núcleo no centro está correta (é assim no ovo de inseto).
- `#ovos/tipos`, 390 px: no telolécito, o rótulo da cicatrícula cobre o rótulo "polo animal" (aparece só "p"). Afastar um dos dois.
- `#ovos/vitelo`, anfíbio: ok. O ovo heterolécito com a cápsula gelatinosa, o girino e a metamorfose estão corretos. Se couber, um rótulo "cápsula gelatinosa" no primeiro quadro.

### Conferido e correto
- Faixa de vitelo do oligolécito (17) → heterolécito (50) → telolécito (95), com o vitelo crescendo a partir do polo vegetativo e o núcleo subindo para o polo animal.
- Os polos animal e vegetativo estão nos lugares certos; o centrolécito está à parte, num botão.
- Na ave: "dia N de 21", a gema diminuindo e o pintinho que sai parecido com o adulto (desenvolvimento direto).
- A barra "reserva de vitelo" esvazia rápido no anfíbio, devagar na ave e já começa vazia no mamífero, compensada pela barra "nutrientes pela placenta".

## cenas-c (Prometeu)

Revisados: `#desenvolvimento/blastoporo`, `/folhetos`, `/neurula` e `/organogenese` (`site/embriologia/cenas-c.js`), nos textos (`d`, `kv`, `enem`, `cap`, rótulos) e nos desenhos, com as capturas `c-*` em 1280 e 390 px.

**Textos:** conferem com o roteiro (D5 a D8), inclusive o quadro de Moore em D6 e os cartões ENEM. As idades seguem a convenção combinada (desde a fecundação, com a DUM ao lado) e as contas de `semF`/`semD` estão certas (dia 22 = 4ª semana / 6ª pela DUM; dia 28 = 4ª / 6ª; dia 56 = 8ª / 10ª). As frases acrescentadas ("após a fecundação", a prevenção do zika com repelente e combate ao *Aedes aegypti*) estão corretas e pedidas nas notas do roteiro. Não há erro científico nos textos; os problemas estão nos desenhos e em rótulos do canvas.

### Correções obrigatórias (5)

**1. `#desenvolvimento/blastoporo`, função `gastrula()` (linhas 47 a 58): o desenho mostra um pseudoceloma, não um celoma.**
A mesoderme (`ell(... K('meso'))`) só reveste a parede do corpo; o tubo amarelo da endoderme fica solto dentro da cavidade escura, sem mesoderme em volta. Pelo próprio texto do tópico, cavidade "revestida só em parte pela mesoderme" é **pseudoceloma**; os exemplos das duas gástrulas (anelídeos, moluscos, artrópodes × equinodermos e cordados) são todos **celomados**.
- Correção: desenhar uma faixa vermelha fina por fora do tubo amarelo (mesma cor `K('meso')`, espessura ≈ `m`), dentro do mesmo `X.clip()`, logo antes do `rr(... K('endo'))` da linha 54. Assim a cavidade escura fica revestida por mesoderme dos dois lados (parede do corpo e parede do intestino), que é o celoma verdadeiro. O comentário da linha 51 ("celoma, revestida pela mesoderme") passa a ser verdade.

**2. `#desenvolvimento/folhetos`, rótulos que somem: "rins" (mesoderme) e "pâncreas" (endoderme).**
Os dois órgãos acendem, mas o rótulo é descartado pelo `lab()` do motor porque colide com o de "estômago" (veja as capturas `c-folhetos-1-*` e `c-folhetos-2-*`). Rins estão na lista do roteiro para o vermelho, e pâncreas é item do cartão ENEM.
- Correção: no `pts.forEach` da linha 218, dar deslocamentos verticais próprios a esses dois (por exemplo, rins com a caixa abaixo de "estômago", à direita; pâncreas à esquerda, abaixo de "fígado"), ou trocar o critério de lado para que estômago (direita) e rins/pâncreas (esquerda) não disputem o mesmo espaço. Conferir em 1280 e 390 px que os cinco rótulos da endoderme e os cinco da mesoderme aparecem.

**3. `#desenvolvimento/folhetos`, o estômago rotulado só como "estômago" nas posições Mesoderme e Endoderme.**
Na Endoderme o estômago aparece inteiro amarelo com o rótulo "estômago"; na Mesoderme aparece com contorno vermelho e o mesmo rótulo. Lido isoladamente, cada quadro diz que o estômago "vem" daquele folheto, que é justamente a confusão que a quarta posição ("Órgão misto") quer desfazer.
- Correção (linhas 142 e 208 a 214): o nome mostrado depende de `sel`: `'epitélio do estômago'` quando `sel === 'endo'`, `'músculo do estômago'` quando `sel === 'meso'`, e `'estômago'` só em "Órgão misto". Pela mesma razão, na Endoderme, os pulmões e o intestino podem ganhar o rótulo `'pulmões (revestimento)'` e `'intestino (revestimento)'` se couber; ver opcional 4.

**4. `#desenvolvimento/folhetos`, ossos em creme na posição Mesoderme (linha 147).**
Com `sel === 'meso'`, os ossos são desenhados em `'#F7E9D8'` (creme/branco). A convenção do módulo (e o roteiro: "músculos, ossos, coração e rins em vermelho") pede a cor do folheto. Em creme, o aluno não liga o osso à mesoderme; o creme ainda é a cor reservada ao vitelo.
- Correção: usar `K('meso')` (ou um tom claro dele, `light(K('meso'), .25)`) com a mesma espessura 3.

**5. `#desenvolvimento/organogenese`, posição do coração e dos arcos faríngeos em `embriao()` (linhas 377, 378 e 383).**
- **Coração:** do dia 39 em diante, a elipse vermelha fica no meio do tronco, mais perto das costas do que da face ventral, e no dia 56 aparece **atrás da orelha** (`c-organogenese-6-1280`, `c-organogenese-8-1280`). O coração forma a **saliência cardíaca na face ventral**, logo abaixo da cabeça e acima do broto do braço. Correção: deslocar o centro para a face ventral (por exemplo, `Pc(.3)` com deslocamento `r * 1.0` para o lado côncavo, sempre entre a cabeça e o braço) e diminuir o tamanho com o crescimento (`r * lerp(.5, .3, g)`), já que na 8ª semana ele está dentro do tórax. A orelha deve ficar sempre na cabeça, atrás e um pouco abaixo do olho, e **nunca** à frente do coração.
- **Arcos faríngeos:** os arcos da linha 378 são desenhados em traço escuro fora do contorno do corpo, flutuando no fundo à direita do rótulo "coração" (visíveis nas capturas dos dias 22 e 39). Correção: colocá-los **sobre o corpo**, na região do pescoço, entre a cabeça e a saliência cardíaca, como três ou quatro sulcos claros (`dark(pele, .3)` em cima da pele), e dar um rótulo `'arcos faríngeos'` enquanto `fa > .5` (4ª e 5ª semana). O texto do tópico fala deles; se não houver espaço para o rótulo, prefiro tirar os arcos do desenho a deixá-los fora do corpo.

### Ajustes recomendados (não bloqueiam)
1. **`/blastoporo`, linha 92:** o rótulo troca de "blastóporo" para "boca"/"ânus" já com 30% da faixa, enquanto a legenda ainda diz "o arquêntero cresce". Sugiro manter `'blastóporo'` até a segunda abertura (`p < .9`) e só então mostrar "boca"/"ânus" nas duas pontas ao mesmo tempo, como pede o roteiro ("boca e ânus aparecendo nos lugares certos"). No celular (390 px) falta o "era o blastóporo" sob a primeira abertura; se couber, use `'boca (era o blastóporo)'` / `'ânus (era o blastóporo)'` em uma linha.
2. **`/blastoporo`, linha 107:** as pastilhas dos exemplos usam azul-claro (protostômios) e amarelo (deuterostômios), que são as cores da ectoderme e da endoderme. Num tópico sobre folhetos isso sugere uma relação que não existe. Usar uma cor neutra (por exemplo, `C.dim` claro) para os dois grupos.
3. **`/blastoporo`:** a alternância opcional "folhetos e celoma" (diblástico, acelomado, pseudocelomado, celomado em corte) não foi feita. Continua opcional; se entrar, é o lugar natural para mostrar a diferença do item 1 das obrigatórias.
4. **`/folhetos`, corte do embrião (linhas 178 a 181):** o mesmo caso do item 1 das obrigatórias: o anel amarelo do intestino fica solto na cavidade, sem mesoderme em volta. Um anel vermelho fino ao redor do amarelo deixaria o corte de cordado correto (celomado). Na Endoderme, rótulos `'pulmões (revestimento)'` e `'intestino (revestimento)'` reforçam a regra "o que reveste por dentro".
5. **`/folhetos`, Mesoderme:** se couber, acender também um vaso (uma linha vermelha no braço) com o rótulo "vasos e sangue", que é item do cartão ENEM ("o que transporta").
6. **`/neurula`, vista de cima (`cima()`, linhas 276 e 281):** com o tubo fechado, a linha azul passa do contorno do embrião na ponta de cima (`c0` fica acima de `top`). Limitar `c0` a `top + 4` e `c1` a `bot - 4`. Sugiro também alargar a ponta da frente do tubo (duas ou três "bolhas", as vesículas do encéfalo) e escrever "cabeça" e "cauda" nas pontas, para o aluno saber de que lado está o encéfalo.
7. **`/organogenese`, 390 px:** o rótulo "orelha" não aparece no celular (`!NAR`, linha 418). Pode ficar assim; se sobrar vaga no limite de 5 rótulos, mostrá-lo da 5ª semana em diante.

### Conferido e correto
- **D5:** blastóporo à esquerda nos dois embriões, o arquêntero crescendo até abrir a segunda abertura do outro lado; "boca primeiro" × "boca em segundo"; exemplos (minhoca, caracol, inseto × estrela-do-mar, peixe, ser humano); o cartão ENEM idêntico ao roteiro.
- **D6:** cores de cada folheto; corte com tubo neural (azul) em cima, notocorda (verde) logo abaixo e intestino (amarelo) embaixo; pele e sistema nervoso em azul; coração à esquerda do corpo (direita da tela), fígado à direita do corpo; tireoide no pescoço; "Órgão misto" com o epitélio amarelo por dentro e o músculo vermelho por fora, como pede o roteiro. A tabela de Moore está completa.
- **D7:** sequência placa → sulco → pregas → tubo, com o tubo se separando da ectoderme da superfície; notocorda sempre logo abaixo da placa/tubo e a endoderme embaixo; crista neural nas bordas das pregas e migrando para os lados depois do fechamento; somitos dos lados do tubo. Na vista de cima, o fechamento começa no meio e segue para as pontas, e os somitos se somam aos pares a partir do meio. Dias 18 → 28 com as duas contagens.
- **D8:** marcos e datas conferem com o Moore (coração bate no dia 22; brotos dos braços no dia 26 e das pernas no 28; raios dos dedos na 6ª semana; dedos separados no fim da 8ª); comprimentos de cerca de 3 mm (dia 22) a 30 mm (dia 56); a barra dos teratógenos cobre da 3ª à 8ª semana; somitos e cauda somem com o crescimento; "feto" a partir do dia 56. Linguagem sobre teratógenos neutra, sem imagens chocantes.

## cenas-b (Apolo)

Revisados: `#desenvolvimento/segmentacao`, `/morula`, `/blastula` e `/gastrula` (`site/embriologia/cenas-b.js`), nos textos e nos desenhos, com as capturas `b-*` em 1280 e 390 px (segmentação nos quatro tipos com 2,5 e 5 divisões; mórula com 2,5 e 6; blástula nos quatro animais com 50% e 100%; gástrula com 50% e 100%).

**Textos:** conferem com o roteiro (D1 a D4), inclusive os cartões ENEM. Os acréscimos estão corretos: a tabela ovo × segmentação × exemplos em D1 (cefalópodes e monotremados no telolécito estão certos), "os dias contam desde a fecundação" em D2 e D3, e o `semF(3)` do motor em D4 ("3ª semana após a fecundação, ≈ 5ª pela DUM"). Os dias da mórula (`DIA`, linha 243) conferem com o Moore. Não há erro científico nos textos.

### Correções obrigatórias (4)

**1. `#desenvolvimento/morula`, corte com 8 células: aparece um buraco no meio (`b-morula-0-2.5-1280`).**
No corte, as oito células cortadas deixam um espaço escuro no centro, que o aluno lê como cavidade. É justamente o que o tópico nega ("o corte mostra que não há cavidade"); a cavidade só vem na blástula.
- Correção (linhas 268 a 271): fechar o espaço antes da compactação. Por exemplo, aumentar a escala do `squash` também com `cp = 0` (`squash(cut, i, 1.25 + .1 * cp, 0)`) ou pintar um disco de tecido (`C.ovo`, raio ≈ `.35 * R`) atrás das células do corte. Conferir de 2 a 32 células que o centro do corte fica sempre preenchido.

**2. `#desenvolvimento/morula`, compactação: uma célula "de dentro" aparece na superfície, e é para ela que o rótulo aponta (`b-morula-0-6-1280` e `-390`).**
No corte, uma lasca cor de massa celular interna fica na borda (por volta das 7 horas), e o rótulo "massa celular interna" aponta para ela. Pelo texto, as células de fora formam o trofoblasto; uma célula de MCI na superfície contradiz a regra.
- Correção (linhas 269 e 278): classificar `out` pela distância do **centro** da célula ao centro do corte (por exemplo, `Math.hypot(c.x - c2[0], c.y - c2[1]) > .5 * R`), e não por `hypot + r`, que joga lascas pequenas da borda para "dentro". Ancorar o rótulo "massa celular interna" na célula interna mais próxima do centro, não em `cut.find(c => !c.out)`.

**3. `#desenvolvimento/morula`, vista externa na compactação: as células continuam esferas.**
Na posição 6 a legenda diz "as células se achatam umas contra as outras", mas a vista externa (linha 266) só aumenta as esferas e troca a cor. O roteiro pede que as células esféricas **se achatem**: a mórula compactada tem contorno liso, com os limites entre as células quase apagados.
- Correção: com `cp > 0`, desenhar a vista externa como no corte (polígonos do `squash` em vez de esferas), ou ao menos cortar cada esfera pelo contorno externo comum e afinar as linhas entre elas com `cp`. O corte já faz isso bem; falta a vista externa acompanhar.

**4. `#desenvolvimento/blastula`, mamífero: a blastocele não encosta no trofoblasto, e dois rótulos apontam para o lugar errado no meio da faixa.**
- **Com 100% (`b-blastula-3-100-1280`):** a blastocele (`cav: [0, .12, .76]`, linha 342) fica separada do trofoblasto por um anel escuro, que parece uma segunda cavidade. No blastocisto, o líquido preenche todo o espaço entre o trofoblasto e a massa celular interna. Correção: `cav: [0, 0, .89]` (o raio interno do trofoblasto), desenhada antes das células como já é; a massa celular interna fica por cima, encostada no trofoblasto do lado de cima.
- **Com 50% (`b-blastula-3-50-1280`):** o rótulo "massa celular interna" aponta para uma célula roxa do trofoblasto e "trofoblasto" aponta para o espaço vazio fora das células (linha 417, âncoras fixas `cx - R * .97` e `cy - R * .62`). Correção: ancorar os rótulos nas posições interpoladas das próprias células (o `m` do laço da linha 411, da primeira célula `kind === 't'` à esquerda e do centro das células `kind === 'i'`), ou só mostrá-los com `q > .9`. O mesmo vale para "blastocele" no anfíbio a 50% (`b-blastula-1-50-1280`), que aponta para uma célula e não para o líquido (linha 414): ancorar no centro da cavidade.

### Ajustes recomendados (não bloqueiam)
1. **`/blastula`, estados intermediários (anfíbio, mamífero e anfioxo a 50%):** as células ficam soltas, com espaços entre elas e algumas sobrepostas no centro. Na formação da blástula a camada de células continua coesa (é um epitélio); se for simples, manter as células encostadas durante o `morph`, para não sugerir que elas se separam.
2. **`/blastula`, anfíbio a 100%:** as células do polo vegetativo estão só um pouco maiores que as do polo animal. O texto fala em "células grandes, cheias de vitelo" (e D1 em macrômeros). Aumentar as células da metade de baixo (menos células, maiores), mantendo o teto da blastocele com duas ou três camadas de células pequenas, como já está.
3. **`/segmentacao`, superficial com 32:** o contador diz 2⁵ = 32, e a camada desenhada tem cerca de 36 células. Desenhar exatamente 32 ou trocar o texto por "células: cerca de 32". Pode-se também acrescentar à nota que, no inseto real, os núcleos se dividem muitas vezes mais (milhares) antes das membranas.
4. **`/segmentacao`, discoidal:** o disco da cicatrícula está bem maior que no ovo real (na gema da galinha ele tem cerca de 3 mm). Para um esquema está bom; se couber, uma nota "disco ampliado" no rodapé ou na legenda.
5. **`/blastula`, mamífero:** o anel externo (linha 404) é a zona pelúcida. Se houver vaga no limite de rótulos, rotulá-lo; ele ajuda a explicar a "eclosão" antes da nidação no arquivo B.
6. **`/gastrula`, 100%:** as manchas azul-escuras perto do blastóporo e dos lados da notocorda são restos da blastocele. Estão corretas, mas sem rótulo podem parecer um quarto tecido. Ou rotular "restos da blastocele" (só no computador), ou pintá-las com o mesmo azul do líquido usado na blástula.

### Conferido e correto
- **D1:** quatro tipos com o tamanho total constante; holoblástica igual com blastômeros iguais; desigual com micrômeros no polo animal e macrômeros no vegetativo (rótulos certos); discoidal com só o disco dividindo e a gema inteira; superficial com os núcleos dividindo no centro sem membranas, migrando para a borda e só então separados por membranas em volta do vitelo. Contador 2ⁿ e a nota "o tamanho total não muda". Painéis de comparação andam juntos.
- **D2:** contagem de células, vista externa e corte, os dois tons na compactação (trofoblasto na cor do córion, MCI na cor do embrião, coerente com o módulo), dias de 1 a 4 contados desde a fecundação.
- **D3:** anfioxo como esfera oca regular; anfíbio com a blastocele deslocada para o polo animal e as células com vitelo embaixo; ave com o disco sobre a gema e a fenda embaixo; mamífero com trofoblasto, massa celular interna num dos lados e o rótulo "dia 4 a 5" (desde a fecundação).
- **D4:** invaginação do polo vegetativo, a blastocele encolhendo, o arquêntero abrindo pelo blastóporo; ectoderme azul por fora, endoderme amarela revestindo o arquêntero; no fim a mesoderme vermelha entre as duas e a notocorda verde em cima do arquêntero, como pede o roteiro. Legendas e o cartão "não confunda blastocele com arquêntero" corretos.

## cenas-e (Íris)

Revisão de 🧬 Sapien contra `embriologia-roteiro-b.md` (tópicos 6, 7 e 8). Revisados: `#humano/placenta`, `#humano/gemeos` e `#humano/semanas`, nos textos (`d`, `kv`, `enem`, legendas, `MONO`, `MARCO`, `SUB`) e nos desenhos, com as capturas `e-*` (1280 e 390 px) e mais três minhas (`sapien-e-*`: gêmeos nos dias 3 e 8, semana 9). Console sem erros.

**Textos:** os três `d` e os cartões ENEM conferem com o roteiro, inclusive a tabela de marcos e os números do Moore. Os três pontos pedidos pelo 🧭 Atlas:
- **Dia 8 dos gêmeos:** está errado (correção 1).
- **Trimestres, viabilidade e as duas contagens:** corretos. `tri()` usa a DUM (1º até a 13ª, 2º da 14ª à 27ª, 3º da 28ª em diante), então a semana 12 após a fecundação (14ª pela DUM) cai no 2º trimestre, como na tabela. Na barra estão certos o período embrionário (DUM 2 a 10), as listras de teratógenos (3ª a 8ª após a fecundação = DUM 4 a 10), o tracejado de viabilidade (22 e 24 pela DUM) e as duas réguas, com o 0 da fecundação na 2ª semana da DUM. Todo rótulo de semana traz as duas contagens, menos a legenda das listras (correção 3).
- **Sangue materno e fetal:** não se misturam em nenhum nível. Na vilosidade, as hemácias da mãe ficam no lago (desenhadas por trás) e as do feto correm dentro do capilar. Na membrana, quando a hemácia está escolhida, as de cada lado só encostam na membrana e voltam, com o selo "não atravessa". As cores também estão certas: materno escuro, fetal vivo e artérias umbilicais azuladas, com a explicação no texto.

### Correções obrigatórias (4)

**1. `#humano/gemeos`: dia 8 classificado como "1 córion + 1 âmnio".**
O âmnio começa a se formar por volta do 8º dia (Moore, cap. 4). Se o embrião se separa até aí, cada um ainda forma o seu âmnio, e o resultado é **1 córion + 2 âmnios**. O caso de âmnio único é a separação **depois** que o âmnio já existe, do 9º ao 12º dia. O roteiro dizia "4º ao 8º" e "8º ao 12º", com o dia 8 nas duas faixas. A culpa da ambiguidade é minha, e ajusto o roteiro para "9º ao 12º" quando o 🧭 Atlas liberar. Hoje a tela se contradiz: a faixa de dias diz "4º ao 8º", mas o dia 8 acende o segmento "8º ao 12º" (captura `sapien-e-1280-humano_gemeos_8`).
- `TIPO`: antes `d <= 7 ? 1`; depois `d <= 8 ? 1` (dia 9 a 12 → 2; 13 em diante → 3).
- `linhaDias`: `segs` passa a `[[0, 3.5], [3.5, 8.5], [8.5, 12.5], [12.5, 14]]`. `nomes`: `['0 a 3', '4 a 8', '9 a 12', '13+']` (celular) e `['até o 3º dia', '4º ao 8º', '9º ao 12º', '13º em diante']`.
- Tabela do `d`, 3ª linha: antes `8º ao 12º dia`; depois `9º ao 12º dia (o âmnio já se formou)`.

**2. `#humano/gemeos`: selos do DNA dos dizigóticos.**
`'mesmo DNA: ~50% em comum, como irmãos'` (1280) se contradiz ("mesmo DNA" e "50%") e `'~50% do DNA'` (390) ensina uma ideia errada, porque quaisquer duas pessoas têm mais de 99% do DNA igual. O que os irmãos dividem, em média, é metade das variantes herdadas dos pais. Para o ensino médio, basta a frase que o `kv` já usa.
- 1280: `'material genético: como irmãos comuns'`.
- 390: `'dizigóticos: sexo pode diferir; genes como irmãos'`.
- Para casar com o selo da direita, o dos monozigóticos pode ficar `'mesmo sexo: sim     material genético: igual'`.

**3. `#humano/semanas`, função `barra`: a legenda das listras não diz qual contagem usa.**
O texto `'listras: maior sensibilidade a teratógenos (3ª a 8ª)'` fica logo abaixo da régua da DUM, e o aluno lê "3ª a 8ª pela DUM". É a confusão que a convenção das duas contagens existe para evitar.
- Depois: `'listras: maior sensibilidade a teratógenos (3ª a 8ª semana após a fecundação)'`. Se faltar espaço, encurte o trecho do tracejado para `'tracejado: viabilidade (22 a 24 pela DUM)'`.

**4. `#humano/placenta`, nível "cordão" (`nCordao`): a nota sobre a artéria.**
`'Aqui a artéria leva sangue pobre em O₂: ela sai do coração do feto'` sugere que a artéria umbilical sai direto do coração. Ela vem das artérias ilíacas internas. O ponto do conceito é que artéria é o vaso que **leva o sangue para longe do coração**, seja ele rico ou pobre em O₂.
- Depois: `'Artéria é o vaso que leva o sangue para longe do coração. As umbilicais levam sangue pobre em O₂ do feto para a placenta'`.

### Ajustes recomendados (não bloqueiam)
- `#humano/gemeos`: a faixa começa em "dia 0", que é o dia da própria fecundação, e a primeira divisão só ocorre por volta de 30 horas. Sugiro `min: 1`.
- `#humano/gemeos`, 1280, dia 8: o rótulo "placenta" cobre o fim de "dia 8: separação do disco embrionário". Afaste um dos dois.
- `#humano/placenta`, nível "útero": o rótulo `'parede do útero (endométrio)'` aponta para a camada externa, mais grossa, que é o **miométrio** (músculo). Aponte para a camada interna, mais clara, ou use só `'parede do útero'`.
- `#humano/semanas`, 390 px: a banana sai pela borda direita (semanas 16 a 28) e a barra não explica as listras nem o tracejado. Reduza o objeto para caber e ponha uma linha curta de legenda (ou explique na legenda de baixo também nas semanas 20 a 24).
- `#humano/semanas`, 1280: o quadro branco da semana atual cobre parte do rótulo "período embrionário" nas semanas 6 a 8. Desenhe o rótulo por cima do quadro.

### Conferido e correto
- Placenta: parte materna (decídua basal) em cima e parte fetal (córion viloso, placa coriônica e cordão) embaixo; vilosidades em árvore no lago materno, com artérias espiraladas; capilar em "U" que chega pobre e sai rico em O₂; as 8 substâncias com o sentido certo (O₂, glicose e IgG da mãe para o feto; CO₂ e ureia ao contrário; álcool e rubéola com alerta; hemácia não passa); cordão com 1 veia larga e 2 artérias de parede grossa na geleia de Wharton.
- Gêmeos: os dizigóticos vêm de 2 ovócitos de cores diferentes, cada um com o seu córion e a sua placenta, e com a nota da fusão; nos monozigóticos, a mesma cor nos dois embriões; as frações 1/3, 2/3 e cerca de 1% e os gêmeos unidos a partir do 13º dia estão certos.
- Semanas: blastocisto (1ª), disco bilaminar entre o âmnio e a vesícula vitelínica (2ª), disco trilaminar (3ª), embrião em "C" com o coração (4ª a 7ª) e feto a partir da 8ª; o selo "o coração bate (≈ 22º dia)" na semana 4; "comprimento cabeça-nádega" a partir da 8ª; a lupa nas primeiras semanas; os objetos de comparação como no roteiro.

## cenas-d (Leo)

Revisão de 🧬 Sapien contra `embriologia-roteiro-b.md` (tópicos 2, 3, 4 e 5). Revisados: `#anexos/funcoes` (ave e humano), `#anexos/amniotico`, `#humano/fecundacao` e `#humano/nidacao`, nos textos (`d`, `KV`, `kv`, `enem`, `caps`, `FN`, legendas) e nos desenhos, com as capturas de `/tmp/claude-0/emb/prints/leo/` em 1280 e 390 px.

**Textos:** os quatro `d`, as tabelas e os cartões ENEM conferem com o roteiro. Duas mudanças do Leo melhoram o texto e ficam: "sexo genético feminino/masculino (46,XX/46,XY)" no lugar de "menina/menino", e as duas contagens em todas as semanas da nidação (pico de hCG, progesterona da placenta, teste no sangue). O quadro "quem tem o quê" (`GR.tem`) está igual ao roteiro, com as notas * e **.

### Correções obrigatórias (3)

**1. `#anexos/funcoes`, modo Humano, 2ª semana (`uteroHum`, ramo `w < 3.5`): o desenho não mostra o que a legenda diz.**
A legenda diz "disco embrionário entre o âmnio e a vesícula vitelínica", mas o disco aparece **dentro** do círculo do âmnio, e a vesícula fica longe, ligada por um fio, como nas semanas seguintes (captura `anexos_funcoes_1280_hum0`). Na 2ª semana, o disco bilaminar é ao mesmo tempo o **assoalho da cavidade amniótica** (epiblasto, em cima) e o **teto da vesícula vitelínica** (hipoblasto, embaixo). As duas bolsas encostam no disco, uma de cada lado, e a vesícula é do tamanho do âmnio ou maior. A **alantoide** também ainda não existe: ela brota da vesícula vitelínica por volta do **16º dia**, já na 3ª semana (Moore, cap. 5).
- Para `w < 3.5`, desenhar a figura do "8" deitado: âmnio em cima, disco (ecto em cima, endo embaixo) no meio, vesícula vitelínica embaixo, encostada, com tamanho parecido. As duas ficam presas ao córion pelo **pedículo de conexão** (um tubinho cinza).
- Na 2ª semana, não desenhar nem rotular a alantoide. Se a pessoa tocar em "Alantoide" nessa semana, a legenda pode dizer `'a alantoide surge na 3ª semana, a partir da vesícula vitelínica'`.
- A faixa humana começa na semana 2. Se for mais simples, comece na semana 3, mas o caso da semana 2 é o que mais aparece nos livros.

**2. `#humano/nidacao`, botão "Gravidez ectópica" com o dia entre 3 e 6: o texto diz "útero".**
No modo `ect`, o marcador para na tuba, mas o zoom (ramo `d < 6`) continua escrevendo `'no útero'` e a legenda diz `'3º dia: a <b>mórula</b> chega ao útero'`. Isso contradiz o próprio cenário.
- No ramo `d < 6`, se `ect`, trocar o texto do zoom por `'parado na tuba'`.
- Na legenda, se `ect && d >= 3`, usar `'O embrião não consegue descer: continua na tuba, onde vai se implantar'` no lugar das frases do 3º ao 5º dia.

**3. `#humano/nidacao`, gráfico da hCG: a linha `'limiar do teste ≈ 25 mUI/mL'`.**
Do dia 10 ao 14, a legenda diz que a hCG "no sangue, já pode ser detectada", mas a curva ainda está abaixo do "limiar do teste" e a fita dá negativo. Parece contradição. Os 25 mUI/mL são o limiar do teste de farmácia, na urina. O exame de sangue detecta valores bem menores, de cerca de 5 mUI/mL.
- Antes: `'limiar do teste ≈ 25 mUI/mL'`. Depois: `'limiar do teste de farmácia (urina) ≈ 25 mUI/mL'`. No celular: `'limiar do teste de urina'`.
- A palavra "teste" na fita pode virar `'teste de urina'`.

### Ajustes recomendados (não bloqueiam)
- `#anexos/funcoes`, modo Humano, legenda das semanas 8 a 12 (`caps.hum`): "o âmnio enche o córion" está adiantado. O âmnio só encosta no córion e apaga a cavidade coriônica por volta da 12ª semana após a fecundação. Sugestão: `'o âmnio cresce e, por volta da 12ª semana, encosta no córion'`.
- `#anexos/funcoes`, modo Humano, semanas 4 a 12: o pedículo da vesícula vitelínica sai do embrião direto para a bolinha âmbar, fora do cordão. Na realidade, ele passa pelo cordão junto com a alantoide e depois sai dele. Se der, faça o fio âmbar sair do cordão. Não é erro grave.
- `#anexos/funcoes`, Ave: o selo `CO₂` (cor `C.c`, cinza) quase some sobre a casca. Clareie o fundo do selo.
- `#humano/fecundacao`, a partir de 21,5 h: o zigoto aparece com um núcleo só. No ser humano, os pronúcleos não chegam a formar um núcleo comum: os envoltórios se desfazem e os cromossomos se juntam no fuso da primeira mitose. O texto diz isso certo ("os cromossomos se juntam"). Se der, desenhe os cromossomos juntos no centro, sem membrana nuclear. Se ficar como está, tudo bem: é a simplificação dos livros do ensino médio.
- `#humano/nidacao`: a curva dobra a cada 1,9 dia (`hcg`) e o texto diz "a cada 2 a 3 dias". Use `/ 2.2` no expoente e confira se o limiar ainda é cruzado perto do dia 14 (se não for, ajuste o fator 1,6).

### Conferido e correto
- Ovo de galinha: vasos sobre a gema desde o 2º dia, âmnio fechando do 3º ao 5º, alantoide brotando do intestino e encostando no córion sob a casca, cristais de ácido úrico, O₂ entrando e CO₂ saindo pelos poros, câmara de ar no polo rombo, clara consumida, gema puxada para dentro e o pintinho bicando a casca no 20º/21º dia.
- Humano: vesícula vitelínica âmbar entre o âmnio e o córion (não foi apagada), alantoide no pedículo, córion com vilosidades que se concentram no lado da placenta.
- Ovo amniótico: peixe só com a vesícula, anfíbio sem anexos e com o vitelo dentro das células de baixo, réptil/ave com os quatro anexos e casca, mamífero com os quatro anexos e placenta; anfíbio murchando ao sol; linha do tempo com cerca de 370 Ma e cerca de 312 Ma (*Hylonomus*).
- Fecundação: ampola perto do ovário, contador de 300 milhões até cerca de 200, acrossomo, zona pelúcida endurecida barrando os outros, 2º corpúsculo polar no espaço sob a zona, pronúcleos n e zigoto 2n = 46 com o sorteio X/Y.
- Nidação: 2 células por volta de 30 h, mórula no 3º dia, blastocisto no 4º, saída da zona no 5º, implantação pelo lado do embrioblasto do 6º ao 10º dia, hCG indo para os vasos maternos, corpo-lúteo aceso, menstruação esperada no dia 14 e o cenário "sem gravidez" (corpo-lúteo regride, endométrio descama).
