# Roteiro científico · Histologia, parte B (módulo `site/histologia/`)

🧬 Sapien, 2026-11-15. Para 🏛️ Aurelius (implementação), 🎨 Apolo (visual) e 🧭 Atlas (integração). Revisão cruzada: 🔬 Taxon.
Item 6 da ementa da Nalu: "Histologia: características gerais e fisiologia dos tecidos epiteliais, conjuntivos, musculares e nervoso." Módulo novo (`site/histologia/`).

Este arquivo cobre o **tecido muscular** (4 tópicos) e o **tecido nervoso** (4 tópicos). Os tecidos epiteliais e conjuntivos estão no arquivo do 🔬 Taxon, `docs/revisao-biologia/histologia-roteiro.md`.

## Mapa do módulo (combinado com o 🔬 Taxon)

Ordem das seções: **Tecidos → Epitelial → Conjuntivo → Sangue → Muscular → Nervoso**, do tecido mais simples ao mais especializado, como em Junqueira & Carneiro. Total: 18 tópicos (10 do 🔬 Taxon, 8 aqui).

| Seção | Rotas | Dono do roteiro |
|---|---|---|
| Tecidos | `#tecidos/visao` | 🔬 Taxon |
| Epitelial | `#epitelial/revestimento`, `#epitelial/glandular` | 🔬 Taxon |
| Conjuntivo | `#conjuntivo/propriamente`, `/adiposo`, `/cartilagem`, `/osso`, `/ossificacao` | 🔬 Taxon |
| Sangue | `#sangue/elementos`, `#sangue/coagulacao` | 🔬 Taxon |
| Muscular | `#muscular/tipos`, `#muscular/sarcomero`, `#muscular/contracao`, `#muscular/energia` | 🧬 Sapien |
| Nervoso | `#nervoso/neuronio`, `#nervoso/glia`, `#nervoso/impulso`, `#nervoso/sinapse` | 🧬 Sapien |

Fronteiras, para não repetir conteúdo:
1. Tendões, ligamentos e o conjuntivo que envolve o músculo (epimísio, perimísio, endomísio) ficam com o 🔬 Taxon, em `#conjuntivo/propriamente`; aqui aparecem em uma linha, com link.
2. Osso, cartilagem e medula óssea vermelha ficam com o 🔬 Taxon; aqui o músculo só se contrai e puxa o tendão. A **medula espinal** fica aqui.
3. A origem embrionária dos tecidos fica com o 🔬 Taxon, em `#tecidos/visao`; aqui só há uma linha por seção.
4. A **junção neuromuscular** fica em `#muscular/contracao`; `#nervoso/sinapse` aponta para ela.
5. Epitélios sensoriais (neuroepitélio), se aparecerem, ficam com o 🔬 Taxon, em `#epitelial/revestimento`.
6. Sangue e células de defesa ficam com o 🔬 Taxon; a micróglia fica aqui, com link para os macrófagos em `#conjuntivo/propriamente`.

Links para módulos que já existem (não repetir o conteúdo deles):
- Neurônio em 3D: `../celula/index.html#neuronio` (dendritos, axônio, mielina e sinapse já têm telas de detalhe).
- Bomba de sódio e potássio: `../morfofisiologia/index.html#membranas/bomba`.
- Fermentação lática: `../bioenergetica/index.html#ferm/latica`; cadeia respiratória: `../bioenergetica/index.html#resp/cadeia`.

## Fontes

- JUNQUEIRA, L. C.; CARNEIRO, J. *Histologia Básica*. 13. ed. Rio de Janeiro: Guanabara Koogan, 2017. Cap. 9 (tecido nervoso) e cap. 10 (tecido muscular). É a referência das medidas de células deste arquivo.
- HALL, J. E. *Guyton & Hall: Tratado de Fisiologia Médica*. 13. ed. Rio de Janeiro: Elsevier, 2017. Cap. 5 (potenciais de membrana e de ação), 6 e 7 (contração do músculo esquelético e junção neuromuscular), 8 (músculo liso), 46 (sinapses), 85 (fisiologia do esporte: sistemas de energia).
- AMABIS, J. M.; MARTHO, G. R. *Biologia Moderna*. São Paulo: Moderna, 2016. Vol. 1, unidade de histologia.
- LOPES, S.; ROSSO, S. *Bio*. São Paulo: Saraiva, 2016. Vol. 1, capítulos de tecidos.
- AZEVEDO, F. A. C. et al. Equal numbers of neuronal and nonneuronal cells make the human brain an isometrically scaled-up primate brain. *Journal of Comparative Neurology*, v. 513, p. 532-541, 2009 (grupo de Suzana Herculano-Houzel, UFRJ: ~86 bilhões de neurônios).

Cores sugeridas (o 🎨 Apolo decide no guia), combinadas com o 🔬 Taxon: uma cor por tecido (epitelial turquesa, conjuntivo âmbar, sangue vermelho, **muscular rosa-salmão**, **nervoso violeta**), núcleos sempre roxo-azulados e citoplasma rosa, como na coloração HE. Para moléculas e íons: actina azul-claro, miosina vermelha, Ca²⁺ amarelo, Na⁺ laranja, K⁺ roxo-claro (distinto do violeta do tecido e do roxo dos núcleos), mielina branco-gelo (a mesma do módulo Célula), neurotransmissor verde.

---

## (a) Seção Muscular

Seção `{id:'muscular', t:'Muscular'}`. Quatro tópicos. Características gerais, para a abertura da seção: o tecido muscular é feito de células alongadas, as **fibras musculares**, especializadas em **contração**. Elas têm muitas proteínas contráteis (actina e miosina) e muitas mitocôndrias. Os nomes mudam: a membrana é o **sarcolema**, o citoplasma é o **sarcoplasma** e o retículo endoplasmático liso é o **retículo sarcoplasmático**. Os três tipos vêm da **mesoderme** (ver `#tecidos/visao`).

### Tópico 1 · `#muscular/tipos`
- **Título:** "Três tecidos musculares"
- **Subtítulo:** "liso, estriado esquelético e estriado cardíaco"

**Texto para o aluno:**
> O **estriado esquelético** forma os músculos presos aos ossos. Suas fibras são enormes: cada uma vem da fusão de muitas células embrionárias, então tem **muitos núcleos**, que ficam **na periferia**, logo abaixo da membrana. Ao microscópio, mostram **estrias transversais**, faixas claras e escuras. A contração é **voluntária**, rápida e forte, e cansa. O **estriado cardíaco** forma o miocárdio. Também tem estrias, mas as células são menores, **ramificadas**, com **1 ou 2 núcleos centrais**, e se ligam pelos **discos intercalares**, que têm junções comunicantes por onde o sinal elétrico passa direto de uma célula para outra. Assim o coração se contrai como um bloco. A contração é **involuntária**, rítmica e não cansa: o próprio coração gera o ritmo, no nó sinoatrial, cerca de 60 a 100 vezes por minuto em repouso.
>
> O **liso** fica na parede dos órgãos ocos e dos vasos: estômago, intestino, bexiga, útero, artérias, além da íris e dos músculos que arrepiam os pelos. As células são **fusiformes**, com **1 núcleo central**, e **não têm estrias**, porque a actina e a miosina não estão alinhadas em fileiras. A contração é **involuntária**, lenta e duradoura, como nos movimentos peristálticos do intestino. A capacidade de se regenerar também é diferente: o liso se regenera bem; o esquelético, de forma limitada, a partir das células-satélite; e o cardíaco praticamente não se regenera, e por isso a área morta num infarto vira uma cicatriz de tecido conjuntivo.

**Quadro na tela** (Junqueira & Carneiro, cap. 10):

| | Estriado esquelético | Estriado cardíaco | Liso |
|---|---|---|---|
| Forma da célula | cilíndrica, muito longa | cilíndrica, ramificada | fusiforme |
| Tamanho | 10 a 100 µm de diâmetro; até dezenas de cm de comprimento | ~15 µm × 85 a 100 µm | 5 a 10 µm × 20 a 500 µm |
| Núcleos | muitos, periféricos | 1 ou 2, centrais | 1, central |
| Estrias | sim | sim | não |
| Junções especiais | não | discos intercalares | junções comunicantes |
| Controle | voluntário | involuntário (ritmo próprio) | involuntário |
| Contração | rápida, forte, cansa | rítmica, não cansa | lenta, duradoura |
| Regeneração | limitada (células-satélite) | quase nenhuma | boa |

**O que a animação mostra:** três painéis lado a lado, em corte longitudinal, com as células desenhadas na mesma escala (o esquelético sai da tela; uma seta diz "continua"). Os núcleos ficam em violeta e as estrias, em faixas alternadas. Ao lado de cada painel, um ícone do órgão (braço, coração, intestino). Cada tecido se contrai no seu ritmo: o esquelético em espasmos curtos, ao toque; o cardíaco em batidas regulares, com uma onda que atravessa os discos intercalares; o liso em ondas lentas, como uma peristalse.

**A faixa controla:** o zoom, de órgão a tecido e a célula (braço → feixe de fibras → uma fibra com núcleos e estrias), igual nos três painéis. Um botão "contrair" dispara a contração de cada tipo.

**Cartão "No ENEM":**
> O quadro de comparação é o que mais cai: **esquelético** = voluntário, multinucleado, núcleos periféricos, com estrias; **cardíaco** = involuntário, estriado, 1 ou 2 núcleos centrais, **discos intercalares**; **liso** = involuntário, sem estrias, 1 núcleo central, fusiforme. E a ligação com saúde: o músculo cardíaco **não se regenera**, e por isso o infarto deixa cicatriz.

---

### Tópico 2 · `#muscular/sarcomero`
- **Título:** "O sarcômero"
- **Subtítulo:** "a unidade que se contrai"

**Texto para o aluno:**
> Um músculo esquelético é feito de feixes de **fibras** (as células), envoltos por tecido conjuntivo (endomísio, perimísio e epimísio) que continua nos tendões (ver `#conjuntivo/propriamente`). Dentro de cada fibra há centenas de **miofibrilas**, cilindros paralelos que ocupam quase todo o citoplasma. Cada miofibrila é uma fileira de unidades repetidas, os **sarcômeros**, de cerca de **2,5 µm** cada um. O sarcômero vai de uma **linha Z** até a seguinte. Presos às linhas Z ficam os filamentos finos, de **actina**; no meio, entre eles, ficam os filamentos grossos, de **miosina**.
>
> As estrias que se veem ao microscópio vêm desse arranjo. A **banda A**, escura, é onde está a miosina (com a ponta da actina sobreposta). A **banda I**, clara, tem só actina e é cortada ao meio pela linha Z. No centro da banda A fica a **zona H**, onde só há miosina. Na contração, os filamentos **não encolhem**: a actina **desliza** sobre a miosina em direção ao centro. As linhas Z se aproximam, o sarcômero fica mais curto, a banda I e a zona H diminuem, e a **banda A não muda de tamanho**. Esse é o **modelo do deslizamento dos filamentos**, proposto em 1954 por Huxley e Hanson e por Huxley e Niedergerke.

**O que a animação mostra:**
1. Zoom em quatro passos: músculo → feixe → fibra (com núcleos periféricos) → miofibrila com estrias → um sarcômero.
2. O sarcômero em esquema: linhas Z nas pontas (traços verticais), actina azul presa a elas, miosina vermelha no meio, com as "cabeças" saindo para os lados. Rótulos de banda A, banda I, zona H e linha Z, com chaves que medem cada uma.
3. Contração: a actina desliza para o centro. As chaves da banda I e da zona H encolhem e mudam de número; a chave da banda A fica fixa e pisca o rótulo "não muda".

**A faixa controla:** a contração, de 0% (relaxado, sarcômero ≈ 2,5 µm) a 100% (contraído, ≈ 2,0 µm), com os comprimentos em µm atualizados ao vivo. Valores para o desenho: banda A ≈ 1,6 µm (constante); filamento fino ≈ 1,0 µm de cada lado da linha Z.

**Cartão "No ENEM":**
> A pegadinha: na contração, **nenhum filamento encurta**. A actina **desliza** sobre a miosina, as linhas Z se aproximam, e a **banda I e a zona H diminuem**, mas a **banda A fica igual**. As estrias do músculo esquelético e do cardíaco existem porque a actina e a miosina estão alinhadas em sarcômeros; no liso elas não estão, e por isso ele não tem estrias.

---

### Tópico 3 · `#muscular/contracao`
- **Título:** "Do nervo à contração"
- **Subtítulo:** "acetilcolina, cálcio e ATP"

**Texto para o aluno:**
> A fibra esquelética só se contrai quando recebe ordem de um **neurônio motor**. O ponto de contato entre os dois é a **junção neuromuscular** (ou placa motora), uma sinapse química (ver `#nervoso/sinapse`). O impulso nervoso chega ao terminal do axônio, que libera **acetilcolina**. Ela se liga a receptores no sarcolema e gera um potencial de ação na fibra, que se espalha pela membrana e entra por tubos que mergulham na célula (os túbulos T). Isso faz o **retículo sarcoplasmático** liberar **íons cálcio (Ca²⁺)**. O cálcio se liga a uma proteína do filamento fino (a troponina), que desloca outra (a tropomiosina) e descobre os pontos de ligação da actina. As **cabeças da miosina** se prendem à actina, giram e puxam o filamento para o centro do sarcômero. Para soltar e puxar de novo, cada cabeça precisa de uma molécula de **ATP**.
>
> O relaxamento também gasta energia: o cálcio é bombeado de volta para o retículo por bombas que usam **ATP**, e a acetilcolina é destruída na fenda pela enzima **acetilcolinesterase**. Por isso, depois da morte, quando o ATP acaba, as cabeças da miosina ficam presas à actina e o corpo endurece: é a **rigidez cadavérica** (*rigor mortis*), que começa poucas horas depois da morte e se desfaz em 1 a 2 dias, quando as proteínas se degradam. Um neurônio motor e todas as fibras que ele comanda formam uma **unidade motora**: nos músculos dos olhos, que fazem movimentos finos, cada neurônio comanda poucas fibras; nos músculos grandes das pernas, centenas a milhares.

**O que a animação mostra:**
1. Junção neuromuscular: o terminal do axônio sobre a fibra; vesículas soltam acetilcolina (pontos verdes) na fenda; uma onda elétrica se espalha pelo sarcolema e desce pelos túbulos T.
2. O retículo sarcoplasmático (rede em volta das miofibrilas) solta Ca²⁺ (pontos amarelos).
3. Zoom no filamento: Ca²⁺ se liga à troponina, a tropomiosina (fita) sai da frente, a cabeça da miosina se prende, gira e puxa. Uma molécula de ATP chega, a cabeça solta e se "rearma" (ATP → ADP + Pi).
4. Relaxamento: as bombas recolhem o Ca²⁺, a tropomiosina volta a cobrir a actina e o sarcômero se alonga.
5. Seletor "e se...": **curare** (a acetilcolina não se liga ao receptor → paralisia), **toxina botulínica** (a acetilcolina não é liberada → paralisia flácida; é o princípio do "botox"), **organofosforado** (a acetilcolinesterase é bloqueada → a acetilcolina se acumula → contrações descontroladas), **sem ATP** (as cabeças ficam presas → rigidez).

**A faixa controla:** o tempo da sequência, em passos (impulso → acetilcolina → Ca²⁺ → ponte cruzada → relaxamento). Um contador mostra o gasto de ATP em cada ciclo da cabeça de miosina e no bombeamento de Ca²⁺.

**Cartão "No ENEM":**
> Três peças que a prova combina: **acetilcolina** (liga o nervo ao músculo), **Ca²⁺** (libera a actina para a miosina) e **ATP** (solta a miosina e devolve o Ca²⁺ ao retículo). Questões sobre **agrotóxicos organofosforados** e **gases de nervos** perguntam o efeito de bloquear a acetilcolinesterase: a acetilcolina se acumula e os músculos se contraem sem controle. O **curare** e a **toxina botulínica** fazem o contrário: paralisam. A **rigidez cadavérica** acontece por **falta de ATP**.

---

### Tópico 4 · `#muscular/energia`
- **Título:** "Energia para o músculo"
- **Subtítulo:** "ATP, fosfocreatina, fermentação e respiração"

**Texto para o aluno:**
> O ATP guardado numa fibra muscular dura só **cerca de 3 segundos** de esforço máximo (Guyton). Para repor, o músculo usa três sistemas, um depois do outro. O primeiro é a **fosfocreatina**, que doa fosfato ao ADP e refaz ATP na hora; com o ATP que já havia, sustenta cerca de **8 a 10 segundos** de esforço máximo, como uma corrida de 100 metros. O segundo é a **glicólise com fermentação lática** (ver `../bioenergetica/index.html#ferm/latica`): a glicose do glicogênio vira lactato, sem oxigênio, rendendo só **2 ATP** por glicose, mas depressa; serve para esforços de cerca de **1 a 2 minutos**, como uma corrida de 400 metros. O terceiro é a **respiração aeróbica** nas mitocôndrias (ver `../bioenergetica/index.html#resp/cadeia`), que rende muito mais ATP por glicose e também queima gordura; é mais lenta, mas sustenta esforços por horas, como uma maratona.
>
> As fibras esqueléticas não são todas iguais. As **fibras lentas** (tipo I, "vermelhas") têm muita **mioglobina**, que guarda oxigênio, muitas mitocôndrias e muitos capilares: contraem com menos força, mas resistem à fadiga, e predominam em quem faz exercício de resistência. As **fibras rápidas** (tipo II, "brancas") têm menos mioglobina e mais enzimas da glicólise: contraem com força e rapidez, mas cansam logo. É por isso que a coxa do frango, que anda o dia todo, é escura, e o peito, usado em voos curtos e explosivos, é branco. Uma correção comum: a dor muscular do dia seguinte ao exercício **não** é causada por ácido lático acumulado; o lactato é removido do músculo em cerca de uma hora (é usado como combustível pelo coração e por outros músculos, ou vira glicose de novo no fígado). A dor tardia vem de microlesões nas fibras e da inflamação que as repara.

**O que a animação mostra:**
1. Um gráfico de três curvas sobrepostas ao longo do tempo de esforço máximo (0 s a 3 min, escala logarítmica ou quebrada): fosfocreatina (alta e curta), fermentação lática (sobe e cai em 1 a 2 min), respiração aeróbica (sobe devagar e fica). Ícones de prova: 100 m, 400 m, maratona.
2. Ao lado, uma fibra com três "tanques": ATP, fosfocreatina e glicogênio, que esvaziam no ritmo do gráfico, e um medidor de lactato que sobe na fase anaeróbica.
3. Botão "fibra lenta / fibra rápida": corte de músculo com fibras vermelhas (mais mitocôndrias e capilares) e brancas; um atleta de maratona e um velocista mostram a proporção de cada tipo.

**A faixa controla:** o tempo de esforço (0 s a 3 min, e um salto para "1 hora"). O gráfico, os tanques e o rótulo do sistema principal ("fosfocreatina", "fermentação lática", "respiração aeróbica") mudam juntos.

**Cartão "No ENEM":**
> O ENEM cobra a relação **tipo de exercício × via de energia**: esforços curtos e intensos usam **fosfocreatina e fermentação lática** (anaeróbicos); esforços longos usam **respiração aeróbica**. As fibras **vermelhas** têm mais **mioglobina e mitocôndrias** (resistência); as **brancas** dependem mais da glicólise (explosão). Cuidado com a ideia de que o ácido lático causa a dor do dia seguinte: ela vem de **microlesões**.

---

## (b) Seção Nervoso

Seção `{id:'nervoso', t:'Nervoso'}`. Quatro tópicos. Características gerais, para a abertura da seção: o tecido nervoso tem dois tipos de célula, os **neurônios**, que recebem, conduzem e transmitem sinais elétricos e químicos, e as **células da glia**, que sustentam, nutrem, isolam e defendem os neurônios. Tem pouquíssima substância entre as células. Forma o **sistema nervoso central** (encéfalo e medula espinal) e o **periférico** (nervos e gânglios). Neurônios e quase toda a glia vêm da **ectoderme**; a micróglia é exceção, porque deriva de células de defesa de origem mesodérmica (ver `#tecidos/visao`).

### Tópico 5 · `#nervoso/neuronio`
- **Título:** "O neurônio"
- **Subtítulo:** "a célula que conduz sinais"

**Texto para o aluno:**
> O **neurônio** tem três partes. O **corpo celular** (pericário) tem o núcleo e a maior parte das organelas, com muito retículo rugoso para produzir proteínas. Os **dendritos**, prolongamentos curtos e ramificados, **recebem** os sinais. O **axônio**, em geral único e longo, **conduz** o impulso para longe do corpo celular até os **terminais**, onde ele passa para outra célula. O sentido é sempre o mesmo: **dendrito → corpo celular → axônio → terminal**. Há axônios de menos de 1 milímetro e outros com cerca de 1 metro, como os que vão da medula espinal aos pés. O encéfalo humano tem cerca de **86 bilhões de neurônios** (Azevedo et al., 2009, um estudo brasileiro). Os neurônios maduros quase não se dividem, e por isso uma lesão no sistema nervoso central costuma deixar sequelas.
>
> Pela função, os neurônios são de três tipos. Os **sensitivos** (aferentes) levam informações dos receptores até o sistema nervoso central; os **motores** (eferentes) levam ordens do sistema nervoso central até músculos e glândulas; e os **de associação** (interneurônios), dentro do encéfalo e da medula, ligam uns aos outros. Os três aparecem juntos no **arco reflexo**: quando a mão encosta numa panela quente, um neurônio sensitivo leva o sinal à medula, um interneurônio o passa a um neurônio motor, e o braço se afasta antes mesmo de o cérebro perceber a dor. No reflexo patelar (a "martelada" no joelho), o neurônio sensitivo se liga direto ao motor, sem interneurônio.

**O que a animação mostra:**
1. Um neurônio multipolar grande, com rótulos (dendritos, corpo celular, núcleo, axônio, bainha de mielina, terminais). Pontos de luz correm sempre no mesmo sentido, dos dendritos aos terminais.
2. Botão "formas": neurônio multipolar (motor), bipolar (retina) e pseudounipolar (sensitivo, com o corpo celular num gânglio ao lado da medula).
3. Arco reflexo: mão, panela, medula em corte (substância cinzenta em forma de borboleta), neurônio sensitivo (entrando pela raiz dorsal), interneurônio e neurônio motor (saindo pela raiz ventral até o bíceps). Um relógio compara "braço se afasta" e "dor chega ao cérebro".
4. Link "Ver o neurônio em 3D" → `../celula/index.html#neuronio`.

**A faixa controla:** o tempo do arco reflexo, em milissegundos, do toque na panela até a contração do músculo. A faixa também alterna entre "reflexo de retirada" (com interneurônio) e "reflexo patelar" (sem interneurônio).

**Cartão "No ENEM":**
> Lembre o **sentido do impulso** (dendrito → corpo celular → axônio) e os três tipos funcionais: **sensitivo** leva ao sistema nervoso central, **motor** leva aos músculos, **de associação** liga um ao outro. O **arco reflexo** é a questão clássica: a resposta acontece na **medula espinal**, sem depender do encéfalo, e por isso é rápida e involuntária.

---

### Tópico 6 · `#nervoso/glia`
- **Título:** "Glia e mielina"
- **Subtítulo:** "as células que cuidam dos neurônios"

**Texto para o aluno:**
> As **células da glia** (neuróglia) não conduzem impulsos, mas sem elas os neurônios não funcionam. No **sistema nervoso central** há quatro tipos: os **astrócitos**, em forma de estrela, que sustentam os neurônios, levam nutrientes do sangue até eles, recolhem neurotransmissores e ajudam a formar a **barreira hematoencefálica**, que filtra o que passa do sangue para o encéfalo; os **oligodendrócitos**, que formam a **bainha de mielina** no sistema nervoso central, cada um envolvendo trechos de vários axônios; a **micróglia**, células de defesa que fagocitam micro-organismos e restos de células, parentes dos macrófagos (ver `#conjuntivo/propriamente`); e as **células ependimárias**, que revestem as cavidades do encéfalo e da medula e participam da produção do líquido cerebrospinal (líquor). No **sistema nervoso periférico**, as **células de Schwann** formam a mielina, cada uma envolvendo um trecho de um único axônio. Por muito tempo se disse que havia 10 células da glia para cada neurônio; contagens recentes mostram uma proporção perto de **1 para 1** no encéfalo humano (Azevedo et al., 2009).
>
> A **bainha de mielina** é feita de camadas da membrana dessas células, enroladas em volta do axônio, ricas em lipídios: funciona como um isolante elétrico. Entre um trecho de mielina e outro ficam espaços curtos, os **nodos de Ranvier**. O impulso "salta" de um nodo ao outro (**condução saltatória**), e por isso as fibras mielinizadas são muito mais rápidas: até cerca de **100 a 120 m/s**, contra menos de 2 m/s nas fibras finas sem mielina (Guyton). A mielina dá a cor da **substância branca** do sistema nervoso; a **substância cinzenta** é onde ficam os corpos celulares. Na **esclerose múltipla**, o próprio sistema imunitário destrói a mielina do sistema nervoso central, e a condução fica lenta ou falha.

**O que a animação mostra:**
1. Um "bairro" do sistema nervoso central: neurônios, um astrócito com os "pés" encostados num capilar e num neurônio, um oligodendrócito enrolando mielina em três axônios, uma micróglia englobando um resto de célula, células ependimárias com cílios na parede de um ventrículo. Tocar em cada uma acende a sua função.
2. Uma célula de Schwann girando em volta de um axônio periférico e formando as camadas de mielina (vista em corte, como um rocambole).
3. Corrida: dois axônios do mesmo comprimento, um sem mielina (o impulso avança contínuo e devagar) e um com mielina (o impulso salta de nodo em nodo). Um cronômetro mostra quem chega primeiro.
4. Botão "esclerose múltipla": trechos da mielina somem e o impulso se atrasa ou para.

**A faixa controla:** a espessura da mielina e a distância entre os nodos, de "sem mielina" a "muito mielinizado", com a velocidade de condução atualizada (≈ 0,5 a 2 m/s sem mielina; até ≈ 120 m/s nas fibras grossas mielinizadas).

**Cartão "No ENEM":**
> Associe: **oligodendrócito** = mielina no sistema nervoso **central**; **célula de Schwann** = mielina no **periférico**; **astrócito** = sustentação, nutrição e barreira hematoencefálica; **micróglia** = defesa. A mielina aumenta a **velocidade** do impulso (condução **saltatória**, de nodo em nodo). Doenças que destroem a mielina, como a **esclerose múltipla**, deixam a condução lenta.

---

### Tópico 7 · `#nervoso/impulso`
- **Título:** "O impulso nervoso"
- **Subtítulo:** "potencial de repouso e potencial de ação"

**Texto para o aluno:**
> Em repouso, a membrana do neurônio é **polarizada**: o lado de dentro é negativo em relação ao de fora, cerca de **−70 mV**. Isso acontece porque os íons estão distribuídos de forma desigual. Fora há muito **sódio (Na⁺)**, cerca de 10 vezes mais que dentro; dentro há muito **potássio (K⁺)**, cerca de 35 vezes mais que fora (Guyton). A **bomba de sódio e potássio** mantém essa diferença, gastando ATP: a cada ciclo, põe **3 Na⁺ para fora** e **2 K⁺ para dentro** (ver `../morfofisiologia/index.html#membranas/bomba`). Como a membrana em repouso deixa vazar mais K⁺ do que Na⁺, o interior fica negativo.
>
> Quando um estímulo leva a membrana até o **limiar**, cerca de **−55 mV**, canais de Na⁺ se abrem, o sódio entra rápido e o interior fica positivo, até cerca de **+30 mV**: é a **despolarização**. Logo depois, os canais de Na⁺ se fecham e canais de K⁺ se abrem; o potássio sai e a membrana volta a ficar negativa (**repolarização**). Esse **potencial de ação** dura cerca de **1 milissegundo** e se propaga pelo axônio como uma onda, porque cada trecho despolarizado despolariza o trecho seguinte. Ele obedece à **lei do tudo ou nada**: um estímulo abaixo do limiar não dispara nada, e qualquer estímulo acima dele dispara um potencial de ação sempre do mesmo tamanho. Um estímulo mais forte não aumenta o potencial, aumenta a **frequência** de disparos. Logo depois de um disparo, o trecho fica um instante sem responder (período refratário), e é isso que faz o impulso seguir só para a frente. Anestésicos locais, como a lidocaína do dentista, bloqueiam os canais de Na⁺: o impulso de dor não chega ao cérebro.

**O que a animação mostra:**
1. Um trecho de membrana em corte, com Na⁺ (laranja) e K⁺ (roxo) dos dois lados, canais e a bomba girando (3 Na⁺ saem, 2 K⁺ entram, 1 ATP gasto). Sinais "+" fora e "−" dentro.
2. Embaixo, um gráfico de voltagem × tempo, com linhas de −70 mV (repouso), −55 mV (limiar) e +30 mV (pico).
3. Estímulo: os canais de Na⁺ abrem e o Na⁺ entra (o gráfico sobe); os canais de K⁺ abrem e o K⁺ sai (o gráfico desce, passa um pouco de −70 e volta).
4. Vista do axônio inteiro: a região despolarizada (inversão de sinais) avança como uma onda, e o trecho de trás fica cinza (refratário).
5. Botão "anestésico local": os canais de Na⁺ ficam bloqueados (cadeado) e o estímulo não passa do limiar.

**A faixa controla:** a **intensidade do estímulo**. Abaixo do limiar, o gráfico mal se mexe e nada se propaga; acima, o potencial de ação aparece **sempre com a mesma altura**, e o que muda, conforme a faixa sobe, é o número de disparos por segundo (um contador mostra a frequência). Esse é o "tudo ou nada" visto pelo aluno.

**Cartão "No ENEM":**
> Repouso: **dentro negativo**, Na⁺ concentrado **fora** e K⁺ **dentro**, mantidos pela **bomba de Na⁺/K⁺** (transporte ativo, gasta ATP). Potencial de ação: **Na⁺ entra** (despolarização), **K⁺ sai** (repolarização). A lei do **tudo ou nada** diz que o tamanho do impulso não depende da força do estímulo; o estímulo forte aumenta a **frequência**. Venenos e anestésicos que **bloqueiam canais de Na⁺** (a lidocaína, a toxina do baiacu) impedem o impulso.

---

### Tópico 8 · `#nervoso/sinapse`
- **Título:** "A sinapse"
- **Subtítulo:** "como um neurônio passa o sinal adiante"

**Texto para o aluno:**
> **Sinapse** é o ponto de comunicação entre um neurônio e outra célula: outro neurônio, uma fibra muscular (a junção neuromuscular, ver `#muscular/contracao`) ou uma glândula. Na **sinapse química**, a mais comum, as duas células não se tocam: entre elas há a **fenda sináptica**, de cerca de **20 nm**. Quando o impulso chega ao terminal do axônio, canais de **Ca²⁺** se abrem, o cálcio entra e faz **vesículas** cheias de **neurotransmissor** se fundirem com a membrana e o liberarem na fenda (exocitose). O neurotransmissor se liga a **receptores** na célula seguinte e abre canais iônicos: pode **excitá-la** (aproximá-la do limiar) ou **inibi-la** (afastá-la). Depois, ele é **destruído** por enzimas, como a acetilcolinesterase, ou **recapturado** pelo terminal que o liberou. Como só o terminal tem vesículas e só a célula seguinte tem receptores, o sinal segue em **um só sentido**. Há também **sinapses elétricas**, em que junções comunicantes deixam os íons passarem direto de uma célula a outra: são mais rápidas e existem em algumas regiões do encéfalo e na retina; as mesmas junções comunicantes ligam as células do músculo cardíaco (ver `#muscular/tipos`).
>
> Alguns neurotransmissores para conhecer: **acetilcolina** (músculos, memória), **glutamato** (o principal excitatório do encéfalo), **GABA** (o principal inibitório), **dopamina** (movimento, motivação e recompensa; a doença de Parkinson vem da perda de neurônios que produzem dopamina), **serotonina** (humor, sono, apetite) e **noradrenalina** (alerta). Muitos medicamentos e drogas agem na sinapse. Antidepressivos como a fluoxetina **bloqueiam a recaptação de serotonina**, que fica mais tempo na fenda; a **cocaína** bloqueia a recaptação de dopamina; os **organofosforados** inibem a acetilcolinesterase; os **benzodiazepínicos** reforçam o efeito do GABA.

**O que a animação mostra:**
1. Terminal do axônio em cima, fenda no meio, célula seguinte embaixo com receptores (formas de "fechadura").
2. O impulso chega (onda), canais de Ca²⁺ abrem (pontos amarelos entram), vesículas descem e se abrem, e o neurotransmissor (pontos verdes) atravessa a fenda e se encaixa nos receptores; a célula de baixo acende (excitatória) ou escurece (inibitória).
3. Limpeza da fenda: parte dos pontos é cortada por uma enzima (tesoura) e parte volta ao terminal por transportadores (recaptação).
4. Seletor de substância: "fluoxetina" (transportador bloqueado: a serotonina fica na fenda), "cocaína" (o mesmo com a dopamina), "organofosforado" (a enzima para: a acetilcolina se acumula), "curare" (receptores tampados). Cada opção mostra uma frase sobre o efeito.
5. Botão "sinapse elétrica": as duas membranas encostadas, com canais (junções comunicantes) por onde os íons passam direto, sem vesículas.

**A faixa controla:** a frequência de impulsos que chegam ao terminal (de 1 a 100 por segundo). Com mais impulsos, mais vesículas se abrem e o neurotransmissor se acumula na fenda; um medidor mostra a resposta da célula seguinte. Com uma substância selecionada, a faixa mostra como o acúmulo muda (por exemplo, com recaptação bloqueada, o nível na fenda demora a cair).

**Cartão "No ENEM":**
> A sequência é: impulso → entrada de **Ca²⁺** → liberação do **neurotransmissor** por exocitose → ligação a **receptores** → remoção por **enzima** ou **recaptação**. A sinapse química é **unidirecional**. As questões costumam pedir o efeito de uma substância: bloquear a **recaptação** (antidepressivos, cocaína) ou a **enzima** (organofosforados) **prolonga** o efeito do neurotransmissor; bloquear o **receptor** (curare) **impede** o efeito.

---

## (c) Pontos de atenção para o 🏛️ Aurelius e o 🎨 Apolo

1. **Banda A constante** no sarcômero: na animação, só a banda I e a zona H encolhem.
2. **Sentido do impulso** sempre dendrito → corpo celular → axônio; as partículas nunca andam para trás.
3. **Tudo ou nada**: na faixa de `#nervoso/impulso`, a altura do potencial de ação nunca muda; só a frequência.
4. **Valores de membrana**: −70 mV (repouso), ≈ −55 mV (limiar), ≈ +30 mV (pico). Guyton usa −90 mV para fibras grossas; o ensino médio e o ENEM usam −70 mV, que é o valor da tela.
5. **Oligodendrócito × Schwann**: o oligodendrócito envolve vários axônios; a célula de Schwann, um trecho de um só axônio.
6. Drogas e venenos (cocaína, curare, organofosforados, toxina botulínica) aparecem de forma factual, pelo mecanismo, sem tom de incentivo nem de alarme.
7. Nada de imagens de terceiros: os cortes histológicos são desenhos próprios, em canvas 2D, inspirados na coloração HE (rosa e roxo), sem copiar micrografias de livros.
