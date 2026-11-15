# Revisão científica das telas · Histologia (`site/histologia/`)

Revisão dos professores de Biologia contra os roteiros: 🔬 Taxon (`histologia-roteiro.md`: tecidos, epitelial, conjuntivo, sangue) e 🧬 Sapien (`histologia-roteiro-b.md`: muscular, nervoso). O professor não edita código: o dono de cada arquivo aplica as correções. Linhas citadas conforme o arquivo em 2026-11-15.

## cenas-c (Prometeu)

Revisados: `#sangue/elementos` e `#sangue/coagulacao` (🔬 Taxon) e `#muscular/tipos` (🧬 Sapien), nos textos (`d`, `kv`, `enem`, legendas, rótulos e caixas) e nos desenhos, com as capturas `prometeu-*` em 1280 e 390 px e capturas novas `rev-elem-*` e `rev-coag-*` (console sem erros).

**Textos:** `d`, quadros e cartões ENEM conferem com o roteiro (S1, S2 e tópico 1). Os valores do hemograma estão como faixas aproximadas, com o aviso de que não servem para diagnóstico.

**Desenhos que conferem:** o tubo mostra plasma amarelado em cima, uma camada branca fina e as hemácias embaixo, com 55%, menos de 1% e 45%. No esfregaço, os tamanhos relativos estão certos (neutrófilo, eosinófilo e monócito maiores que a hemácia, plaquetas de 2 a 3 µm), e as formas também: núcleo em gomos, redondo, em rim, bilobado com grânulos alaranjados e coberto de grânulos escuros. A altitude leva o hematócrito de 45% a cerca de 50% em semanas. Na coagulação, as quatro etapas seguem a ordem do roteiro, a fibrina é amarela, o Ca²⁺ é amarelo e a falta de vitamina K para no segundo degrau. Nos músculos, a escala é a mesma nos três painéis (esquelético com 40 µm de diâmetro, cardíaco com 15 × 100 µm, liso com 8 × 200 µm). Os núcleos ficam na periferia do esquelético e no centro do cardíaco e do liso. Os discos intercalares estão em degraus, o coração bate a cerca de 60 por minuto e o liso faz uma onda lenta.

### Correções obrigatórias (2)

**1. `#sangue/coagulacao`, degrau 1 da cascata (`cenas-c.js`, l. 320).**
`{ a: 'tromboplastina + Ca²⁺', b: 'liberados pelas plaquetas e pelo tecido lesado' }`: do jeito que está, a frase diz que o Ca²⁺ também é liberado pelas plaquetas. O cálcio da coagulação vem do **plasma**, e é por isso que o citrato da bolsa de sangue, que prende o cálcio do plasma, impede a coagulação. O ENEM explora exatamente esse ponto.
- Antes: `b: 'liberados pelas plaquetas e pelo tecido lesado'`
- Depois: `b: 'tromboplastina das plaquetas e do tecido lesado; Ca²⁺ do plasma'`

**2. `#sangue/coagulacao`, nota da hemofilia (`MODOS`, l. 222).**
O texto "não se forma fibrina" exagera. Na hemofilia a coagulação é lenta e insuficiente: forma-se pouca fibrina, e o sangramento demora muito a parar. O roteiro diz "pequenos ferimentos sangram muito".
- Antes: `'... um degrau falha, não se forma fibrina e o sangramento continua.'`
- Depois: `'... um degrau falha, forma-se pouca fibrina e o sangramento demora muito a parar.'`

### Recomendadas (6)

**R1. `#sangue/coagulacao`, simulação da hemofilia (`estadoCoag`, l. 234).** Para combinar com a correção 2, deixe passar um pouco do degrau 1 até o 3 na hemofilia, por exemplo `c2 = Math.min(c2, .3); c3 = Math.min(c3, .3)`, e uma rede de fibrina rala, por exemplo com `fib` multiplicado por 0,25. O status deve continuar "o sangramento continua" ou "sangramento diminuindo", nunca "o sangramento parou". As faltas de vitamina K e de cálcio ficam como estão.

**R2. `#sangue/coagulacao`, legenda com um botão "e se" ligado (l. 346).** Hoje `cap(m ? m.nota : ...)` mostra a nota da falha desde "antes da lesão". Sugestão: até a etapa em que a falha age, mostrar a legenda normal. Para o AAS, a nota entra a partir da etapa 2 (`v >= 25`); para vitamina K, hemofilia e cálcio, a partir da etapa 3 (`v >= 50`). Assim o aluno vê que o vaso se contrai e o tampão se forma normalmente, e que a falha está na cascata.

**R3. `#sangue/coagulacao`, nota da vitamina K (l. 221).** "o fígado faz pouca protrombina" funciona no ensino médio. A forma mais precisa é "o fígado não consegue completar a protrombina e outros fatores", que também combina com o degrau 2 ("depende da vitamina K"). Opcional.

**R4. `#sangue/elementos`, rótulos do tubo (l. 171 e 173).** Com a altitude ligada, o plasma e as hemácias são arredondados cada um por conta própria e às vezes somam 99% (por exemplo, "≈ 51%" e "≈ 48%", na captura de 390 px). Arredonde o hematócrito primeiro e mostre o plasma como `100 - hct arredondado`.

**R5. `#muscular/tipos`, período das estrias (`tecidoMusc`, l. 411 e 443).** `Math.max(5, 2.5 * k * 2)` desenha uma faixa clara e uma escura a cada 5 µm, mas o sarcômero tem cerca de 2,5 µm. Como o painel diz "na mesma escala" e mostra a barra de 50 µm, o ideal é `Math.max(4, 2.5 * k)` no zoom "célula". Se ficar serrilhado demais, mantenha o período atual e acrescente "estrias fora de escala" perto da barra.

**R6. `#muscular/tipos`, ramificação do cardíaco (l. 447).** A ramificação aparece como uma faixa diagonal solta, sem estrias, que atravessa o espaço entre as fileiras. Na captura em zoom "célula", ela parece um objeto à parte. Melhor desenhá-la saindo da célula em forma de Y, com a mesma cor e as mesmas estrias, e terminando num disco intercalar na fileira de baixo.

**Nota (aceita, sem mudança):** o roteiro pedia um botão "contrair" que dispara a contração de cada tipo. O Prometeu fez só o esquelético obedecer ao botão, enquanto o cardíaco e o liso continuam no ritmo próprio, e a legenda explica isso. Do ponto de vista científico, é melhor que o roteiro, porque mostra o que é voluntário e o que é involuntário. Pode ficar.

## cenas-d (Leo)

Revisados: `#muscular/sarcomero`, `#muscular/contracao` e `#muscular/energia` (🧬 Sapien), nos textos e nos desenhos, com as capturas `leo-*` em 1280 e 390 px e um corte ampliado (`rev-sarc-zonaH-crop.png`).

**Textos:** `d`, `kv` e cartões ENEM conferem com o roteiro (tópicos 2, 3 e 4). O acréscimo "2 Ca²⁺ por ATP" (bomba do retículo) está correto. "Princípio do uso estético e médico da toxina" substitui bem o nome comercial.

**Números conferidos:**
- **Sarcômero:** de 2,5 a 2,0 µm. A banda A fica fixa em 1,6 µm, e o filamento fino mede 1,0 µm de cada lado da linha Z. A banda I é `L - 1,6` (de 0,9 a 0,4 µm) e a zona H é `L - 2,0` (de 0,5 a 0 µm). Na captura de 2,25 µm aparecem 0,65 e 0,25 µm, como deve ser. No desenho, a zona H só tem miosina e as cabeças apontam para as linhas Z, com uma zona nua no meio. A miofibrila do quadro de zoom encolhe na mesma proporção.
- **Energia** (`partes`, l. 371), calculada ponto a ponto. A fosfocreatina domina até **11 s** (aos 10 s: 55% de fosfocreatina e 41% de fermentação), o que fica dentro do combinado de 10 a 12 s e combina com os "8 a 10 s" do texto, porque o sistema se esgota antes de perder o primeiro lugar. A respiração aeróbica passa a fermentação em **75 s** (aos 75 s, 50% cada), de acordo com Gastin (2001) e Guyton. Aos 2 min, 68% aeróbica; aos 3 min, 80%. As provas estão nos lugares certos: 100 m em 10 s e 400 m em cerca de 50 s. Nos tanques, o ATP nunca fica abaixo de 70%, o que está certo: a fosfocreatina o repõe.
- **Fibras:** 82% de fibras lentas no maratonista e 37% no velocista, iguais às médias de Guyton (cap. 85), e o corte sorteado mostra essas proporções. As fibras lentas aparecem escuras, com mitocôndrias e capilares ao lado.
- **Contração:** a ordem é impulso, acetilcolina, potencial de ação e túbulos T, Ca²⁺ do retículo, troponina e tropomiosina, ponte cruzada e relaxamento com bombas. O ciclo da cabeça está certo: ela se prende armada com ADP e Pi, solta os dois no golpe, fica presa até o ATP chegar, solta e se rearma ao quebrar o ATP. A actina anda no sentido do golpe. "Sem ATP" deixa a cabeça presa depois do primeiro golpe. Curare (receptor ocupado), toxina botulínica (vesículas sem liberar) e organofosforado (acetilcolina sem ser destruída, onda que se repete) estão corretos na animação.

### Correção obrigatória (1)

**1. `#muscular/contracao`, legenda do passo 3 no cenário organofosforado (l. 357 com `CAPS.normal[2]`, l. 205).**
Com `S.cen === 'organo'` e `v < 4`, a tela usa as legendas normais. No passo 3 aparece "A acetilcolinesterase destrói a acetilcolina", justamente no cenário em que essa enzima está bloqueada e a animação mostra a acetilcolina parada na fenda (`achOff = 0`). A legenda contradiz o desenho e o ponto que o ENEM cobra.
- Correção: no organofosforado, use a legenda `CAPS.organo` a partir do passo 3 (`v >= 2`) em vez de `v >= 4`. Outra saída é uma variante do passo 3: "Nasce um potencial de ação na fibra, que desce pelos túbulos T. A acetilcolinesterase está bloqueada: a acetilcolina fica na fenda".

### Recomendadas (2)

**R1. `#muscular/energia`, curva "fosfocreatina" desde 0 s (`SIS`, l. 375).** Nos primeiros cerca de 3 s, o ATP vem do próprio ATP guardado, como diz o texto, e a curva marca 100% "fosfocreatina". Sugestão: chamar a legenda de "ATP guardado e fosfocreatina", ou acrescentar ao parágrafo do esquema (l. 405): "a curva azul inclui o ATP já guardado na fibra".

**R2. `#muscular/energia`, marca "maratona" (l. 427).** Em `v = 97` a marca cai em cerca de 33 min no eixo, e uma maratona leva mais de 2 horas. Como o eixo termina em "1 h", troque o rótulo por "prova longa" ou ponha a marca em `v = 100`, com o rótulo "maratona (horas)".

## cenas-b (Apolo)

Revisados: `#conjuntivo/propriamente`, `/adiposo`, `/cartilagem`, `/osso` e `/ossificacao` (🔬 Taxon), nos textos (`d`, `kv`, `enem`, legendas e rótulos) e nos desenhos, com as capturas `apolo-*` em 1280 e 390 px.

**Textos:** conferem com o roteiro (C1 a C5), inclusive os quadros das células e dos tipos de cartilagem, a nota sobre vitamina C e escorbuto, as 9 kcal, a termogenina, os 2/3 de mineral e 1/3 de colágeno, os 99% do cálcio, o paratormônio, a calcitonina e a vitamina D, as fontanelas e o fechamento do disco epifisário. Não há erro científico nos textos.

**Desenhos que conferem:**
- **Propriamente dito:** fibroblasto "fiando" colágeno; macrófago com pseudópodes; mastócito com grânulos metacromáticos indo ao vaso, que se dilata; plasmócito com núcleo excêntrico em "roda de carroça" e halo claro do Golgi. O denso modelado tem fibras paralelas e onduladas entre o músculo e o osso, com fibroblastos enfileirados. No "puxar", o frouxo cede nos dois sentidos, o não modelado resiste nos dois e o modelado só no sentido das fibras.
- **Adiposo:** o unilocular tem núcleo achatado na borda e o número de células fixo (só a gota muda); o multilocular, núcleo central, gotinhas e muitas mitocôndrias. O frio gera calor e há tecido pardo entre as escápulas e no pescoço do bebê.
- **Cartilagem:** vaso só no conjuntivo vizinho; pericôndrio com células achatadas; grupos isógenos com matriz territorial mais escura; difusão de nutrientes. A elástica tem fibras elásticas e a fibrosa, fileiras de condrócitos entre feixes de colágeno, com pericôndrio apagado (correto: a fibrocartilagem quase não tem).
- **Osso:** ósteon com linha cimentante, lamelas, osteócitos alongados entre as lamelas com canalículos radiais, canal de Havers com artéria e veia e canal de Volkmann. Os osteoblastos são cúbicos sobre uma camada de osteoide que se mineraliza; o osteoclasto tem vários núcleos e borda pregueada na cratera e libera Ca²⁺. As traves somem na osteoporose. No experimento, o osso no vinagre dobra e o queimado fica branco e esfarela.
- **Ossificação:** centros no mesênquima do crânio; fontanela anterior entre os frontais e os parietais e posterior entre os parietais e o occipital, fechando em cerca de 4 meses e em 2 anos. No osso longo, molde azul de cartilagem, centro primário, vaso, canal medular, centros secundários depois do nascimento, discos epifisários com setas de crescimento e fechamento por volta dos 20 anos.

### Correções obrigatórias

Nenhuma.

### Recomendadas (5)

**R1. `#conjuntivo/ossificacao`, rótulo sobre o título (l. 658, com o `head` da l. 642).** Em 1280 px, com a idade no máximo, o rótulo "disco fechado: parou de crescer" (destino em `y2 = Bo[1] - o.re * 1.3 - 16`) cobre o título "Endocondral (osso longo)" (captura `apolo-ossificacao-1280b`). O mesmo pode acontecer com "disco epifisário (cresce aqui)" (l. 656). Baixe o título ou leve os rótulos de cima para `y1`, embaixo do osso.

**R2. `#conjuntivo/ossificacao`, cor do canal medular no adulto (l. 610).** O canal fica vermelho (`mix(C.sangue, BG, .3)`) até a idade adulta. No adulto, a diáfise dos ossos longos tem **medula amarela** (gordura); a vermelha fica nas pontas e nos ossos chatos, como o próprio `#conjuntivo/osso` mostra, com o canal em laranja-amarelado. Sugestão: passar do vermelho ao tom do `#conjuntivo/osso` entre a puberdade e os 20 anos (`v` de 70 a 90), para as duas telas concordarem.

**R3. `#conjuntivo/adiposo`, tamanho do adipócito pardo (l. 297).** O multilocular é desenhado quase do mesmo tamanho do unilocular, mas é bem menor: o unilocular tem até cerca de 100 µm, e o pardo, algumas dezenas de µm. Sugestão: hexágono com cerca de 0,6 de `R`, ou um aviso de que os painéis não estão na mesma escala.

**R4. `#conjuntivo/osso`, `kv` do paratormônio e da calcitonina (l. 472).** "liberam e guardam cálcio no osso" depende da ordem das palavras para ficar certo. Mais claro: `['Paratormônio', 'tira cálcio do osso para o sangue (osteoclastos)'], ['Calcitonina', 'faz o contrário: guarda cálcio no osso']`.

**R5. `#conjuntivo/ossificacao`, cartilagem articular (`ossoEndo`, l. 611 a 613).** Os centros secundários quase cobrem a epífise inteira. Seria bom deixar à vista uma capa fina de cartilagem hialina na ponta do osso adulto, que nunca vira osso: é a cartilagem articular, que a tela de cartilagem cita ("reveste as superfícies das articulações"). Na captura do adulto ainda aparece um crescente azul. Basta garantir que ele não some e, se houver espaço, pôr o rótulo "cartilagem articular".
