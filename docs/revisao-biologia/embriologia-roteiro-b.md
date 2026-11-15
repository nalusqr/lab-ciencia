# Roteiro científico · Embriologia, parte B (módulo `site/embriologia/`)

🧬 Sapien, 2026-11-15. Para 🏛️ Aurelius (implementação), 🎨 Apolo (visual) e 🧭 Atlas (integração). Revisão cruzada: 🔬 Taxon.
Item 5 da ementa da Nalu: "Embriologia – classificação dos óvulos quanto à quantidade e distribuição do vitelo. Estudo do desenvolvimento embrionário: segmentação, mórula, blástula, gástrula, nêurula e organogênese. Anexos embrionários: vesícula vitelínica, alantoide, córion e âmnio. Gametogênese: ovulogênese e espermatogênese – Embriologia humana."

Este arquivo cobre **Gametas (resumo)**, **Anexos embrionários** e **Embriologia humana**. Tipos de ovo e desenvolvimento (segmentação a organogênese) estão no arquivo do 🔬 Taxon, `docs/revisao-biologia/embriologia-roteiro.md`.

## Mapa do módulo (combinado com o 🔬 Taxon)

Ordem das seções: **Gametas → Ovos → Desenvolvimento → Anexos → Humano**. O gameta vem antes do ovo; os anexos vêm depois da gástrula, porque são formados pelos folhetos; o humano fecha o módulo e junta tudo.

| Seção | Rotas | Dono do roteiro |
|---|---|---|
| Gametas | `#gametas/resumo` | 🧬 Sapien |
| Ovos | `#ovos/tipos`, `#ovos/vitelo` | 🔬 Taxon |
| Desenvolvimento | `#desenvolvimento/segmentacao`, `/morula`, `/blastula`, `/gastrula`, `/blastoporo`, `/folhetos`, `/neurula`, `/organogenese` | 🔬 Taxon |
| Anexos | `#anexos/funcoes`, `#anexos/amniotico` | 🧬 Sapien |
| Humano | `#humano/fecundacao`, `#humano/nidacao`, `#humano/placenta`, `#humano/gemeos`, `#humano/semanas` | 🧬 Sapien |

Fronteiras, para não repetir conteúdo:
1. A **fecundação humana** fica em `#humano/fecundacao`; o desenvolvimento do 🔬 Taxon começa no zigoto e aponta para cá.
2. **Blástula e blastocele** em geral ficam com o 🔬 Taxon; aqui o **blastocisto** (trofoblasto e embrioblasto) aparece só na nidação, com link para `#desenvolvimento/blastula`.
3. **Folhetos germinativos** e seus derivados ficam com o 🔬 Taxon; em `#humano/semanas` só há uma linha com link.
4. O **tipo de ovo humano** fica com o 🔬 Taxon; aqui ele aparece em uma linha, com link.
5. Os **anexos** ficam todos aqui; quando o texto do 🔬 Taxon citar a gema do ovo de galinha, aponta para `#anexos/funcoes`.

## Convenção de idades (importante para todo o módulo)

- Neste roteiro, como no Moore, as idades do embrião contam **a partir da fecundação**. Uma gestação dura cerca de **38 semanas** (266 dias) desde a fecundação.
- Médicos e exames de pré-natal contam a **idade gestacional** a partir do primeiro dia da **última menstruação (DUM)**, cerca de 2 semanas antes da fecundação: são as famosas **40 semanas** (280 dias).
- Na tela, sempre que aparecer uma semana, mostrar as duas: "4ª semana após a fecundação (≈ 6ª semana de gestação, pela DUM)". Sem isso, o aluno vê "coração bate na 4ª semana" num lugar e "na 6ª" em outro e acha que um dos dois está errado.

## Fontes

- MOORE, K. L.; PERSAUD, T. V. N.; TORCHIA, M. G. *Embriologia Clínica*. 10. ed. Rio de Janeiro: Elsevier, 2016. Cap. 2 (fecundação), 3 (1ª semana), 4 (2ª semana), 5 (3ª semana), 6 (4ª a 8ª semana), 7 (período fetal), 7 e 8 (placenta, membranas fetais, gêmeos). É a referência dos números humanos deste arquivo.
- AMABIS, J. M.; MARTHO, G. R. *Biologia Moderna*. São Paulo: Moderna, 2016. Vol. 1, unidade de reprodução e desenvolvimento (anexos embrionários e ovo amniótico).
- LOPES, S.; ROSSO, S. *Bio*. São Paulo: Saraiva, 2016. Vol. 1, capítulos de reprodução e embriologia; vol. 2 (vertebrados).
- GILBERT, S. F.; BARRESI, M. J. F. *Biologia do Desenvolvimento*. 11. ed. Porto Alegre: Artmed, 2019. Capítulos de desenvolvimento das aves e dos mamíferos (membranas extraembrionárias, gêmeos).

Cores sugeridas (o 🎨 Apolo decide no guia): uma cor fixa por anexo, a mesma em todo o módulo. Proposta: vesícula vitelínica = âmbar (a mesma cor do vitelo no arquivo do 🔬 Taxon), âmnio = azul-claro, córion = lilás, alantoide = verde-água (diferente do verde da notocorda). Os folhetos, quando aparecerem, seguem as cores do 🔬 Taxon: ectoderme azul, mesoderme vermelha, endoderme amarela. Sangue materno em vermelho-escuro e sangue fetal em vermelho-vivo, sem nunca se misturar no desenho.

---

## (a) Seção Gametas

Seção `{id:'gametas', t:'Gametas'}`. Um tópico só, de resumo. A gametogênese completa já existe na Citogenética (`site/divisao-celular/`, seção `gametogenese`) e **não deve ser copiada**.

### Tópico 1 · `#gametas/resumo`
- **Título:** "De onde vêm os gametas"
- **Subtítulo:** "espermatogênese e ovogênese em uma tabela"

**Texto para o aluno:**
> Todo embrião começa com dois **gametas**: o **espermatozoide** e o **ovócito**. Eles são haploides (**n = 23** na espécie humana) e se formam por **meiose**, num processo chamado **gametogênese**: **espermatogênese** no homem e **ovogênese** (ou ovulogênese) na mulher. Nos dois sexos as etapas são as mesmas: **multiplicação** por mitoses, **crescimento** e **maturação** pela meiose. A diferença está no resultado. No testículo, cada espermatócito primário forma **4 espermatozoides** pequenos e móveis, de forma contínua a partir da puberdade. No ovário, cada ovócito primário forma **1 só gameta** grande, rico em citoplasma, e dois ou três **corpúsculos polares** que degeneram; a menina já nasce com todos os ovócitos que terá.
>
> Atenção: a célula liberada na ovulação é o **ovócito secundário**, parado na metáfase II. A meiose só termina se um espermatozoide entrar nele, e é por isso que este módulo começa a história do embrião na fecundação (ver `#humano/fecundacao`).

**Tabela na tela:**

| | Espermatogênese | Ovogênese |
|---|---|---|
| Onde | túbulos seminíferos (testículos) | ovários |
| Começa | na puberdade | na vida fetal |
| Gametas por célula que entra em meiose | 4 | 1 (+ corpúsculos polares) |
| Divisão do citoplasma | igual | desigual |
| Pausas | nenhuma | prófase I (até a puberdade) e metáfase II (até a fecundação) |
| Duração | cerca de 70 dias (Moore cita ~2 meses) | de 12 a ~50 anos, contando a pausa na prófase I |

**Animação:** nenhuma nova. Mostrar as duas árvores da Citogenética lado a lado em miniatura (4 bolinhas à esquerda, 1 bola grande e 2 pequenas à direita), como imagem estática, e dois botões grandes: "Ver espermatogênese" → `../divisao-celular/index.html#gametogenese/espermatogenese` e "Ver ovogênese" → `../divisao-celular/index.html#gametogenese/ovogenese`. A faixa pode ficar oculta neste tópico.

**Cartão "No ENEM":**
> A comparação cai muito: **4 espermatozoides contra 1 óvulo** por célula, divisão **igual** contra **desigual**, produção **contínua** contra um estoque formado **antes do nascimento**. E a pegadinha: o que sai do ovário na ovulação é o **ovócito secundário**, não o óvulo pronto.

---

## (b) Seção Anexos embrionários

Seção `{id:'anexos', t:'Anexos'}`. Dois tópicos. **Anexos embrionários** (ou membranas extraembrionárias) são estruturas formadas pelo próprio embrião, mas que **não fazem parte do corpo** dele: protegem, nutrem, fazem trocas e guardam excretas, e são descartados no nascimento ou na eclosão.

Os quatro anexos ficam num tópico só (`#anexos/funcoes`), com uma animação do ovo de galinha em incubação, e o quadro por grupo fica em `#anexos/amniotico`. Assim o módulo fica com 18 tópicos (8 aqui, 10 no arquivo do 🔬 Taxon), o teto pedido pelo 🧭 Atlas.

**Quadro "quem tem o quê"** (usar em `#anexos/amniotico` e como resumo em todos):

| Grupo | Vesícula vitelínica | Âmnio | Córion | Alantoide | Placenta |
|---|---|---|---|---|---|
| Peixes | sim | não | não | não | não* |
| Anfíbios | não** | não | não | não | não |
| Répteis e aves | sim, grande | sim | sim | sim, grande | não |
| Mamíferos placentários | sim, pequena e sem vitelo | sim | sim | sim, reduzida | sim |

\*Alguns tubarões vivíparos têm uma "placenta" formada pela vesícula vitelínica; é exceção, fica fora da tela.
\*\*Nos anfíbios o vitelo fica **dentro das células** do polo vegetativo e do endoderma, e não forma uma bolsa separada (Amabis & Martho; Lopes & Rosso). Alguns livros dizem "peixes e anfíbios têm só vesícula vitelínica"; o padrão dos livros do ensino médio mais usados, e das bancas, é o da tabela: anfíbios sem anexos. Se uma questão disser o contrário, ela segue o outro livro, não um erro de biologia.

---

### Tópico 2 · `#anexos/funcoes`
- **Título:** "Os quatro anexos"
- **Subtítulo:** "vesícula vitelínica, âmnio, córion e alantoide"

**Texto para o aluno:**
> Os **anexos embrionários** são bolsas e membranas que o próprio embrião forma, mas que ficam **fora do corpo** dele e são descartadas no nascimento ou na eclosão. São quatro. A **vesícula vitelínica** guarda o **vitelo** e o leva ao embrião por vasos sanguíneos: é a **nutrição**. Ela existe em **peixes, répteis, aves e mamíferos**; no ovo de galinha é enorme (a gema), e nos mamíferos placentários é pequena e quase sem vitelo, mas é nela que surgem as **primeiras células do sangue** (3ª à 6ª semana) e as **células germinativas primordiais**, que darão os gametas (Moore). O **âmnio** forma uma bolsa fechada cheia de **líquido amniótico** em volta do embrião: protege contra **desidratação** e **choques**, mantém a temperatura e deixa o embrião se mexer. No ser humano é a "bolsa d'água", com cerca de **1 litro** de líquido perto do fim da gestação.
>
> O **córion** é o anexo **mais externo** e envolve todos os outros. Nos **répteis e aves** fica sob a casca e se junta à **alantoide**, formando a **membrana corioalantoide**, cheia de vasos, que faz as **trocas gasosas** pelos poros da casca. A alantoide, uma bolsa que brota do intestino, também **guarda as excretas** (o **ácido úrico**, pouco tóxico e quase insolúvel) e retira cálcio da casca para o esqueleto do pintinho. Nos **mamíferos placentários**, o córion forma as **vilosidades coriônicas**, a parte do embrião na placenta, e produz o **hCG**; a alantoide fica pequena, mas os vasos dela viram os **vasos do cordão umbilical** (ver `#humano/placenta`). Âmnio, córion e alantoide existem só em **répteis, aves e mamíferos**.

**Resumo na tela (uma linha por anexo, cada uma na cor do anexo):**

| Anexo | Função principal | Quem tem | No ser humano |
|---|---|---|---|
| Vesícula vitelínica | nutrição (vitelo) | peixes, répteis, aves, mamíferos | pequena, sem vitelo; primeiras células do sangue e células germinativas |
| Âmnio | proteção contra dessecação e choques (líquido amniótico) | répteis, aves, mamíferos | "bolsa d'água", ≈ 1 L a termo |
| Córion | envolve tudo; trocas gasosas (com a alantoide) | répteis, aves, mamíferos | vilosidades coriônicas: parte fetal da placenta; produz hCG |
| Alantoide | guarda excretas (ácido úrico); trocas gasosas | répteis, aves, mamíferos | reduzida; seus vasos formam os vasos umbilicais |

**O que a animação mostra:** o corte do ovo de galinha em incubação (casca, membranas da casca, câmara de ar, clara, gema e embrião). Conforme os dias passam:
1. Dia 2 a 4: vasos sanguíneos se espalham sobre a gema a partir do embrião (vesícula vitelínica acesa).
2. Dia 3 a 5: o âmnio se fecha em volta do embrião, que passa a flutuar no líquido.
3. Dia 4 a 10: a alantoide brota do intestino e cresce como um balão até encostar no córion, sob a casca; bolinhas de O₂ entram e de CO₂ saem pelos poros; cristais brancos de ácido úrico se acumulam dentro dela.
4. Dia 19 a 21: o resto da gema é puxado para dentro do abdome do pintinho, a clara acabou e ele bica a casca.
Botão "ave / humano": o mesmo esquema no útero humano (semana 2 a 12), com âmnio grande, vesícula vitelínica como uma bolinha âmbar fora do âmnio, alantoide como um tubinho no pedículo e córion virando placenta. Tocar em um anexo acende só ele e abre a linha dele na tabela.

**A faixa controla:** o dia de incubação (0 a 21) na ave, ou a semana (2 a 12) no humano. A gema e a clara diminuem, a alantoide e o âmnio crescem. Dados do desenho (Gilbert; Amabis & Martho): a incubação da galinha dura **21 dias**; a gema é o próprio ovócito, uma célula gigante; a clara não faz parte da célula (água e proteínas secretadas pelo oviduto); a casca de carbonato de cálcio tem milhares de poros.

**Cartão "No ENEM":**
> Associe cada anexo a uma palavra: vesícula vitelínica, **nutrição**; âmnio, **proteção** (contra dessecação e choques); córion, **trocas gasosas** e **placenta**; alantoide, **excretas** (ácido úrico) e **respiração**. Duas pegadinhas: o **mamífero tem vesícula vitelínica**, mesmo quase sem vitelo; e no ovo fechado a excreta guardada é **ácido úrico**, não ureia nem amônia. A **biópsia de vilo corial** colhe células do córion, que são do embrião, para fazer o cariótipo do bebê.

---

### Tópico 3 · `#anexos/amniotico`
- **Título:** "O ovo amniótico"
- **Subtítulo:** "como os vertebrados saíram da água"

**Texto para o aluno:**
> Os anfíbios ainda dependem da água para se reproduzir: o ovo não tem casca nem âmnio e seca em poucas horas fora d'água, e por isso a maioria dos sapos e rãs volta à lagoa para desovar, e o girino vive na água. Há cerca de **310 a 320 milhões de anos**, no período Carbonífero, os ancestrais dos répteis passaram a pôr um ovo novo, o **ovo amniótico**: com **casca** porosa e resistente, **âmnio** com líquido, **córion** e **alantoide** para respirar e guardar excretas, e **vesícula vitelínica** grande com alimento. Esse ovo é como um "lago portátil": o embrião se desenvolve em terra firme, sem fase larval na água.
>
> O ovo amniótico veio junto com a **fecundação interna** (o espermatozoide precisa chegar ao ovócito antes da casca ser feita), com a pele impermeável e com a excreção de ácido úrico. Os **répteis e aves** mantêm o ovo com casca; os **mamíferos placentários** perderam a casca e o vitelo, mas guardaram os mesmos anexos, que no útero formam a placenta e o cordão. É por isso que répteis, aves e mamíferos formam o grupo dos **amniotas**, e peixes e anfíbios, o dos **anamniotas**.

**O que a animação mostra:**
1. Quatro ovos lado a lado, em corte: peixe, anfíbio, réptil/ave, mamífero (embrião no útero). Em cada um, só os anexos que o grupo tem aparecem, nas cores fixas.
2. Um "sol" sobre os ovos: o ovo de anfíbio murcha (perde água), o de réptil/ave fica inteiro.
3. Uma linha do tempo abaixo, de 400 a 300 milhões de anos: "vertebrados saem da água (anfíbios, ~370 Ma)" e "primeiro ovo amniótico (~312 Ma, *Hylonomus*)".

**A faixa controla:** o grupo (peixe → anfíbio → réptil e ave → mamífero). Cada parada liga os anexos daquele grupo, preenche a linha do quadro "quem tem o quê" e mostra um rótulo "depende da água para se reproduzir: sim / não".

**Cartão "No ENEM":**
> É um dos temas que mais caem em embriologia, quase sempre ligado à evolução: o **ovo amniótico** (casca + âmnio + córion + alantoide) e a **fecundação interna** libertaram répteis, aves e mamíferos da água para se reproduzir. Os **anfíbios** continuam dependentes da água porque o ovo deles não tem âmnio nem casca. Se a pergunta for "qual anexo protege contra a dessecação?", a resposta é o **âmnio**.

---

## (c) Seção Embriologia humana

Seção `{id:'humano', t:'Humano'}`. Cinco tópicos.

**Base visual comum:** um corte frontal simplificado do sistema genital feminino (ovário, tuba uterina com infundíbulo e ampola, útero com endométrio), já usado como mapa nos dois primeiros tópicos. Um marcador mostra onde está o embrião em cada momento.

---

### Tópico 4 · `#humano/fecundacao`
- **Título:** "Fecundação"
- **Subtítulo:** "o encontro, na tuba uterina"

**Texto para o aluno:**
> A **fecundação** acontece na **tuba uterina**, em geral na **ampola**, a parte mais larga, perto do ovário, e não no útero. Numa ejaculação há de **200 a 600 milhões** de espermatozoides, mas só cerca de **200** chegam à ampola (Moore). No caminho eles passam pela **capacitação**: perdem moléculas da superfície e ficam aptos a fecundar, o que leva cerca de 7 horas. O ovócito secundário resiste só **cerca de 24 horas** depois da ovulação; os espermatozoides, em geral 2 a 3 dias, alguns até cerca de 5 dias. Por isso a gravidez depende de relações nos dias perto da ovulação.
>
> Ao tocar o ovócito, o espermatozoide atravessa a **corona radiata** e a **zona pelúcida** com as enzimas do **acrossomo** (a **reação acrossômica**). Quando a membrana dos dois se funde, a zona pelúcida muda e **bloqueia a entrada de outros espermatozoides** (bloqueio da polispermia). Só então o ovócito **termina a meiose II** e solta o segundo corpúsculo polar. Os dois núcleos haploides (os pronúcleos) se aproximam, os cromossomos se juntam, e surge o **zigoto**, com 46 cromossomos. O sexo genético já está definido nesse momento: depende de o espermatozoide trazer um cromossomo **X** (menina, 46,XX) ou **Y** (menino, 46,XY).

**O que a animação mostra:**
1. Mapa: espermatozoides subindo pelo útero e pela tuba; o contador cai de "≈ 300 milhões" para "≈ 200".
2. Zoom: o ovócito com a zona pelúcida (anel claro) e a corona radiata (células em volta); um espermatozoide libera enzimas (nuvem) e atravessa.
3. A zona pelúcida muda de cor (fica "dura"), e os outros espermatozoides batem e não entram.
4. O ovócito solta o 2º corpúsculo polar; os pronúcleos ♀ e ♂ se aproximam e se fundem. Rótulo final: "zigoto, 2n = 46". Um selo mostra "X → menina" ou "Y → menino" conforme o espermatozoide sorteado.

**A faixa controla:** o tempo, de 0 a 24 horas depois do encontro (subida pela tuba, reação acrossômica, bloqueio, pronúcleos, zigoto). Um botão "sortear espermatozoide" troca X por Y.

**Cartão "No ENEM":**
> Três fatos que caem: a fecundação ocorre na **tuba uterina**, não no útero; quem define o sexo genético é o **espermatozoide** (X ou Y), porque todo ovócito leva X; e a **meiose II do ovócito só termina depois que o espermatozoide entra**. Questões sobre **laqueadura** e **vasectomia** usam isso: cortar as tubas impede o encontro dos gametas; cortar os ductos deferentes impede a saída dos espermatozoides.

---

### Tópico 5 · `#humano/nidacao`
- **Título:** "Nidação e hCG"
- **Subtítulo:** "da tuba ao útero, e o sinal que o teste de gravidez lê"

**Texto para o aluno:**
> Enquanto desce pela tuba, o zigoto se divide por mitoses (**segmentação**, ver `#desenvolvimento/segmentacao`): 2 células por volta de 30 horas e uma **mórula** de 12 a 32 células por volta do **3º dia**, quando chega ao útero. No **4º dia** ela vira o **blastocisto** (a blástula dos mamíferos, ver `#desenvolvimento/blastula`), com o **embrioblasto**, que formará o embrião, e o **trofoblasto**, que formará a parte fetal da placenta. No 5º dia ele sai da zona pelúcida e, por volta do **6º ao 7º dia**, gruda no **endométrio** e começa a se enterrar nele: é a **nidação** (implantação), completa por volta do **10º dia**. Se o blastocisto se implantar fora do útero, temos uma **gravidez ectópica**, em cerca de 95% dos casos na tuba (Moore), que pode romper e sangrar muito.
>
> Já na nidação, a camada externa do trofoblasto (o **sinciciotrofoblasto**, que depois faz parte do córion) começa a produzir a **gonadotrofina coriônica humana**, a **hCG**. Ela mantém vivo o **corpo-lúteo** do ovário, que continua produzindo **progesterona**; a progesterona mantém o endométrio, e a **menstruação não vem**. Sem gravidez, o corpo-lúteo degenera depois de cerca de 14 dias, a progesterona cai e o endométrio descama. A hCG passa para o sangue e a urina da mãe, e é ela que o **teste de gravidez** detecta, com anticorpos: no sangue, a partir do **fim da 2ª semana** após a fecundação (Moore); na urina, nos testes de farmácia, de forma confiável a partir do **dia do atraso menstrual**. A concentração dobra a cada 2 a 3 dias, chega ao pico entre a **8ª e a 11ª semana de gestação** e cai; por volta da 8ª a 10ª semana, a própria placenta já produz progesterona suficiente.

**O que a animação mostra:**
1. Mapa com marcador: dia 0 na ampola, descendo pela tuba; o embrião se divide (2, 4, 8, mórula) enquanto anda.
2. Dia 4, no útero: a mórula ganha uma cavidade e vira blastocisto; rótulos "embrioblasto" e "trofoblasto". Dia 5: a zona pelúcida se abre e ele sai.
3. Dias 6 a 10: zoom no endométrio; o blastocisto encosta pelo lado do embrioblasto e afunda, o trofoblasto invade entre os vasos maternos e o endométrio se fecha por cima. Pontinhos de hCG começam a sair para os vasos da mãe.
4. Painel lateral, dias 10 a 28: o ovário com o corpo-lúteo (aceso enquanto há hCG), uma curva de hCG subindo e uma fita de teste. A linha C aparece sempre; a linha T aparece quando a hCG passa do limiar típico dos testes de farmácia (cerca de 25 mUI/mL na urina), perto do dia 14.
5. Botões "e se...": "sem gravidez" (sem hCG, o corpo-lúteo murcha no 14º dia, a progesterona cai e o endométrio descama) e "gravidez ectópica" (o marcador para na tuba, com alerta).

**A faixa controla:** os dias após a fecundação, de 0 a 28. O dia fica escrito grande no canto, com o número de células no começo, e um marco "menstruação esperada" no ≈ 14º dia. Um "Saiba mais" pode mostrar a curva inteira da hCG até a 20ª semana, com o pico.

**Cartão "No ENEM":**
> Sequência para não errar: **zigoto → mórula (3º dia, chega ao útero) → blastocisto (4º-5º dia) → nidação (6º-7º dia)**; a fecundação foi na **tuba**, a nidação é no **endométrio**. E a pergunta clássica: **por que não há menstruação na gravidez?** Porque a **hCG** do embrião mantém o **corpo-lúteo**, que segue produzindo **progesterona**. O **teste de gravidez detecta hCG**; não confunda com **LH** e **FSH**, que vêm da hipófise. Questões sobre **métodos contraceptivos** usam essa sequência: a **pílula do dia seguinte** age sobretudo adiando a ovulação, e o **DIU de cobre** dificulta a fecundação.

Nota para o 🧭 Atlas: o cartão menciona contracepção de forma factual, como o ENEM faz. Se a Nalu preferir, a última frase sai.

---

### Tópico 6 · `#humano/placenta`
- **Título:** "Placenta e cordão umbilical"
- **Subtítulo:** "dois sangues que não se misturam"

**Texto para o aluno:**
> A **placenta** é o órgão de trocas entre a mãe e o feto, formada por **duas partes**: uma **fetal**, o **córion viloso** (as vilosidades coriônicas, ver `#anexos/funcoes`), e uma **materna**, a **decídua basal**, a parte do endométrio onde o embrião se implantou. As vilosidades ficam mergulhadas em lagos de **sangue materno**, mas o sangue do feto corre **dentro** delas, separado do da mãe por uma membrana fina, a membrana placentária. **Os dois sangues não se misturam**: as substâncias passam por essa membrana. No fim da gestação a placenta é um disco de **15 a 25 cm** de diâmetro, cerca de **3 cm** de espessura e **500 a 600 g** (Moore).
>
> Pela placenta passam **oxigênio, glicose, aminoácidos, água, sais** e **anticorpos IgG** da mãe para o feto, e **gás carbônico e ureia** do feto para a mãe. Ela também é uma glândula: produz **hCG**, **progesterona** e **estrogênios**. Mas a barreira não é perfeita: **álcool, nicotina, muitos medicamentos, drogas** e alguns agentes de doença (os vírus da **rubéola**, do **Zika** e o **HIV**, o protozoário da **toxoplasmose** e a bactéria da **sífilis**) também atravessam. O feto se liga à placenta pelo **cordão umbilical**, com cerca de **55 cm** em média (de 30 a 90 cm), que tem **duas artérias** e **uma veia**, envoltas numa geleia protetora (geleia de Wharton). Atenção ao sentido: as **artérias umbilicais levam sangue pobre em O₂** do feto para a placenta, e a **veia umbilical traz sangue rico em O₂** da placenta para o feto.

**O que a animação mostra:**
1. Vista geral: útero com o feto, o cordão e a placenta em disco.
2. Zoom na placenta: uma vilosidade (árvore de dedos) mergulhada num lago vermelho-escuro (sangue materno), com capilares vermelho-vivo dentro (sangue fetal).
3. Partículas atravessando a membrana: O₂ e glicose da mãe para o feto; CO₂ e ureia do feto para a mãe. Uma partícula "álcool" atravessa também, com rótulo de alerta. Hemácias de cada lado **nunca** atravessam.
4. Zoom no corte do cordão: 2 artérias (azuladas, "sangue pobre em O₂, do feto") e 1 veia (vermelha, "rico em O₂, para o feto"), na geleia.

**A faixa controla:** o nível de zoom (útero → placenta → vilosidade → membrana). Um seletor de "substância" (O₂, CO₂, glicose, anticorpos, álcool, vírus da rubéola, hemácia) mostra se passa ou não, e em que sentido.

Cuidado visual: a cor das artérias umbilicais é a exceção à regra "artéria = vermelho" dos outros módulos; vale um rótulo "artéria leva sangue pobre em O₂ aqui".

**Cartão "No ENEM":**
> O ENEM gosta de três ideias: o sangue da mãe e o do feto **não se misturam** (as trocas são por difusão e transporte através da membrana placentária); a placenta **não barra tudo**, e por isso álcool, cigarro, medicamentos e infecções como **rubéola, Zika, toxoplasmose e sífilis** podem afetar o feto (relacione com o pré-natal e a vacinação); e a placenta tem uma parte **materna** e uma **fetal**.

---

### Tópico 7 · `#humano/gemeos`
- **Título:** "Gêmeos"
- **Subtítulo:** "um zigoto que se divide ou dois zigotos"

**Texto para o aluno:**
> Os **gêmeos dizigóticos** (ou fraternos, "bivitelinos") surgem quando **dois ovócitos** são liberados no mesmo ciclo e cada um é fecundado por um espermatozoide diferente. São dois zigotos, e por isso os irmãos são tão parecidos quanto quaisquer irmãos: podem ter sexos e tipos sanguíneos diferentes. Cada um tem o seu **âmnio** e o seu **córion** (e às vezes as placentas se fundem, mas os córions continuam separados). São cerca de **2/3** dos gêmeos, e a frequência varia muito: aumenta com a idade da mãe, com a história na família materna e com tratamentos de fertilidade (Moore).
>
> Os **gêmeos monozigóticos** ("idênticos", "univitelinos") vêm de **um só zigoto**, que se divide em dois embriões. Têm o mesmo material genético, o **mesmo sexo** e o mesmo tipo sanguíneo. A frequência é parecida no mundo todo, cerca de **3 a 4 por 1.000 nascimentos**. Os anexos que eles dividem dependem de **quando** o embrião se separa (Moore; Gilbert): até o **3º dia** (2 células a mórula), cada um tem córion e âmnio próprios (cerca de 1/3 dos casos); entre o **4º e o 8º dia** (massa celular interna do blastocisto), dividem o córion e a placenta, mas têm âmnios separados (cerca de 2/3, o caso mais comum); entre o **8º e o 12º dia**, dividem córion e âmnio (cerca de 1%); depois de cerca de **13 dias**, a separação fica incompleta e surgem os **gêmeos unidos** (siameses).

**O que a animação mostra:**
1. Duas colunas: "dizigóticos" (2 ovócitos + 2 espermatozoides → 2 zigotos, cores diferentes) e "monozigóticos" (1 ovócito + 1 espermatozoide → 1 zigoto que se parte, mesma cor).
2. Na coluna dos monozigóticos, o momento da separação e o resultado nos anexos: dois círculos de córion (lilás) e dois de âmnio (azul); um córion com dois âmnios; um córion com um âmnio; dois embriões unidos.
3. Selos sobre os bebês: "mesmo sexo: sim / pode não ser", "mesmo DNA: sim / ~50% em comum, como irmãos".

**A faixa controla:** o dia em que o embrião monozigótico se separa (0 a 14). Conforme o dia avança, o desenho dos anexos muda de "2 córions + 2 âmnios" para "1 córion + 2 âmnios", "1 córion + 1 âmnio" e "unidos", com a fração de casos escrita ao lado.

**Cartão "No ENEM":**
> Monozigóticos vêm de **1 zigoto**: mesmo sexo, mesmo genótipo; diferenças entre eles vêm do **ambiente** (por isso são usados em estudos de "genética ou ambiente"). Dizigóticos vêm de **2 ovócitos e 2 espermatozoides**: são irmãos comuns nascidos juntos. Cuidado: "ter placenta separada" **não prova** que os gêmeos são dizigóticos, porque monozigóticos que se separam até o 3º dia também têm placentas e córions próprios.

---

### Tópico 8 · `#humano/semanas`
- **Título:** "Semana a semana"
- **Subtítulo:** "do zigoto ao recém-nascido"

**Texto para o aluno:**
> O desenvolvimento humano tem dois períodos. O **período embrionário** vai da fecundação ao fim da **8ª semana**: nele se formam os folhetos (gastrulação na **3ª semana**, ver `#desenvolvimento/gastrula`), o tubo neural (fecha na **4ª semana**, ver `#desenvolvimento/neurula`) e todos os órgãos principais (organogênese). O coração começa a bater por volta do **22º dia**. No fim da 8ª semana, o embrião tem cerca de **3 cm** e já tem aparência humana. Como tudo está se formando, é a fase de **maior sensibilidade** a agentes que causam malformações (os **teratógenos**: álcool, alguns medicamentos, radiação, rubéola e Zika; ver `#desenvolvimento/organogenese`), e muitas mulheres ainda nem sabem que estão grávidas.
>
> A partir da **9ª semana**, o embrião passa a se chamar **feto**, e o **período fetal** é sobretudo de **crescimento** e amadurecimento dos órgãos já formados. Os órgãos genitais externos permitem ver o sexo no ultrassom por volta da 12ª a 14ª semana; a mãe sente os movimentos entre a **16ª e a 20ª semana**; os pulmões começam a produzir **surfactante** perto da 24ª semana, e é por isso que bebês nascidos antes de cerca de 22 a 24 semanas de gestação (pela DUM) raramente sobrevivem. O parto ocorre por volta de **38 semanas após a fecundação** (40 pela DUM), com cerca de **3,4 kg** e 50 cm. Os **trimestres** costumam ser contados pela DUM: 1º até a 13ª semana, 2º da 14ª à 27ª, 3º da 28ª até o parto.

**Tabela de marcos** (idade após a fecundação; entre parênteses, pela DUM). Tamanhos e massas: Moore, cap. 6 e 7 (CCN = comprimento cabeça-nádega, que é o que o ultrassom mede no começo):

| Semana após a fecundação (DUM) | Marco | Tamanho / massa |
|---|---|---|
| 1 (3) | fecundação, segmentação, blastocisto, início da nidação | 0,1 mm |
| 2 (4) | nidação completa; disco embrionário com 2 folhetos; âmnio e vesícula vitelínica; hCG detectável no sangue | 0,2 mm |
| 3 (5) | gastrulação (3 folhetos), notocorda, placa neural; tubo cardíaco se forma | 1,5 a 2,5 mm |
| 4 (6) | **coração bate (≈ 22º dia)**; tubo neural fecha; brotos dos braços e pernas | 4 a 6 mm |
| 5 a 7 (7 a 9) | encéfalo cresce rápido; mãos e pés em forma de "pá", depois dedos | 7 a 22 mm |
| 8 (10) | fim do período embrionário; todos os órgãos principais formados; aparência humana | ≈ 30 mm |
| 12 (14) | início do 2º trimestre; sexo distinguível pela genitália externa | ≈ 87 mm; ≈ 45 g |
| 16 (18) | ossos visíveis no ultrassom; movimentos começam a ser sentidos (16 a 20 semanas) | ≈ 140 mm; ≈ 200 g |
| 20 (22) | pele coberta de vérnix e lanugem; ultrassom morfológico; limite de viabilidade, com UTI | ≈ 190 mm; ≈ 460 g |
| 24 (26) | surfactante começa a ser produzido; prematuros já têm boa chance de sobreviver com UTI | ≈ 230 mm; ≈ 820 g |
| 28 (30) | olhos abrem; pulmões já conseguem respirar com ajuda | ≈ 270 mm; ≈ 1.300 g |
| 32 (34) | acúmulo de gordura sob a pele | ≈ 300 mm; ≈ 2.100 g |
| 38 (40) | a termo: parto | ≈ 360 mm (CCN); ≈ 3.400 g |

Os tamanhos a partir da 8ª semana são CCN (sentado), não o comprimento total; o recém-nascido mede cerca de 50 cm de comprimento total. Na tela, usar o rótulo "comprimento cabeça-nádega" para não parecer erro.

**O que a animação mostra:**
1. Uma silhueta do embrião/feto em escala real (tamanho em mm na tela, quando couber), que cresce e muda de forma conforme a semana; nas primeiras semanas, uma lupa mostra o detalhe.
2. Uma régua de comparação com objetos do dia a dia (grão de arroz na 4ª semana, uva na 8ª, limão na 12ª, banana na 20ª, melancia pequena na 38ª), para dar noção de escala sem números demais.
3. Uma barra de trimestres embaixo, com as duas contagens (fecundação e DUM) e a faixa "período embrionário / período fetal". A parte das semanas 3 a 8 fica destacada em laranja: "maior sensibilidade a teratógenos".

**A faixa controla:** a semana após a fecundação (1 a 38). O rótulo mostra as duas contagens ("semana 8 · 10ª pela DUM"), o tamanho, a massa e o marco daquela semana.

**Cartão "No ENEM":**
> O que mais cai é o **período embrionário (até a 8ª semana)** como fase de **maior risco de malformações**: é nele que se formam os órgãos, e por isso álcool, cigarro, alguns medicamentos e infecções como **rubéola e Zika** (microcefalia) são mais perigosos no começo da gravidez. Lembre também que embrião vira **feto** a partir da 9ª semana e que o pré-natal conta a gestação pela **DUM** (40 semanas).

---

## (d) Pontos de atenção para o 🏛️ Aurelius e o 🎨 Apolo

1. **Duas contagens de semanas** em toda a seção Humano (ver "Convenção de idades").
2. **Sangue materno e fetal nunca se misturam** no desenho da placenta; hemácias não atravessam a membrana.
3. **Artérias umbilicais em azulado** (sangue pobre em O₂), com rótulo, porque contraria a regra de cor dos outros módulos.
4. **Anfíbio sem anexos** no quadro, com a nota de rodapé sobre a divergência entre livros.
5. **Mamífero tem vesícula vitelínica**: não apagar a bolinha âmbar do desenho humano.
6. Tom do texto: a gravidez ectópica, os gêmeos unidos e os teratógenos aparecem de forma factual e curta, sem imagens chocantes; nada de fotos, só desenho esquemático.
7. Nenhuma imagem de terceiros: todos os desenhos são feitos em canvas 2D pela equipe.
