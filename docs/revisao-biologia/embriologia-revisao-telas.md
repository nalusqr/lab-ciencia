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
