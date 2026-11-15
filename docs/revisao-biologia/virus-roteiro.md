# Roteiro científico: Os Vírus (módulo novo `site/virus/`)

🔬 Taxon, 2026-11-15. Escrito na "esteira", logo depois da Taxonomia; fica pronto para o 🧭 Atlas distribuir. Revisão cruzada: 🧬 Sapien (notas no fim do arquivo).
Item 8 da ementa: "Os Vírus: estrutura da partícula viral, replicação e doenças relacionadas."

## Mapa do módulo

São **13 tópicos num só arquivo**, em seis seções, nesta ordem: **Natureza, Estrutura, Fagos, Replicação, Doenças, Prevenção**. A lógica é ir do "o que é" (partícula) ao "como se multiplica" (ciclos) e ao "o que causa e como evitar" (doenças e vacinas), que é onde o ENEM mais cobra.

| Seção | Rotas |
|---|---|
| Natureza | `#natureza/vivo` |
| Estrutura | `#estrutura/particula`, `#estrutura/tipos` |
| Fagos | `#fagos/litico`, `#fagos/lisogenico` |
| Replicação | `#replicacao/animal`, `#replicacao/retrovirus` |
| Doenças | `#doencas/arboviroses`, `#doencas/hiv`, `#doencas/respiratorias`, `#doencas/hepatites-hpv` |
| Prevenção | `#prevencao/vacinas`, `#prevencao/transmissao` |

**Fronteiras com outros módulos:**
1. A Morfofisiologia já tem a tela `../morfofisiologia/index.html#teoria/virus` ("Vírus: a exceção"), com a ideia de vírus acelular e o ciclo lítico resumido. Este módulo aprofunda; a tela da Morfofisiologia deve ganhar um link "ver o módulo Vírus".
2. O bacteriófago T4 em 3D já existe no módulo Célula (`../celula/index.html#celula_fago`). Aqui ele é reaproveitado, sem modelo novo.
3. A Taxonomia (`../taxonomia/index.html#sistemas/reinos`) diz que vírus não entram em nenhum reino. Aqui só se explica o porquê (N1); a classificação dos vírus em famílias (Baltimore, ICTV) fica fora do escopo.
4. O funcionamento do sistema imune (linfócitos, anticorpos, memória) é do item da fisiologia humana. Aqui só o necessário para entender vacina, soro e a aids.
5. Os mosquitos (biologia do *Aedes*, metamorfose) ficam para o item 9 ("Os seres vivos"); aqui o mosquito aparece só como **vetor**.
6. Transcrição, tradução e o dogma central estão em Biologia Molecular (`../biologia-molecular/index.html`); R2 aponta para lá.

**Vocabulário:**
- "partícula viral" ou "vírion" para o vírus completo fora da célula; evitar "célula viral" (não existe);
- "capsídeo" (não "cápsula", que é estrutura de bactéria) e "capsômero" para cada unidade de proteína;
- "envelope" (não "membrana do vírus" sem explicar que ela vem da célula hospedeira);
- "replicação" ou "multiplicação" viral; evitar "reprodução" sem aspas, porque o vírus não se divide;
- "ciclo lítico" e "ciclo lisogênico"; "prófago" (no DNA da bactéria) e "provírus" (no DNA de célula eucarionte, como no HIV);
- "HIV" para o vírus e "aids" (minúsculo, como nos documentos do Ministério da Saúde) para a doença; "pessoa vivendo com HIV", nunca "aidético";
- "covid-19" para a doença e "SARS-CoV-2" para o vírus;
- "arbovirose" para doença por vírus transmitido por artrópode.

**Cores (proposta para o 🎨 Apolo):** o **capsídeo** no cinza-azulado `#B9C2D3`, que já é a cor do vírus na Morfofisiologia e na Célula. **DNA** em violeta `#9A6BFF` (o mesmo do resto do site) e **RNA** em coral, para o aluno sempre ver qual ácido nucleico está em jogo. O **envelope** no rosa da célula animal `#F06AAE`: a cor diz, sem palavras, que aquela membrana foi "roubada" da célula. As **espículas** (glicoproteínas) em âmbar `#F7C13B`, a cor de destaque do guia Campo escuro, porque são elas que se encaixam nos receptores e que as vacinas miram. A bactéria no verde-oliva `#A9C54A` do ícone `cel-bacteria`. Nas doenças, uma cor por **via de transmissão**, repetida em D1 a D4 e em P2: vetor (verde-limão), respiratória (azul), sangue e sexual (vermelho), fecal-oral (marrom).

**Fontes:**
- AMABIS, J. M.; MARTHO, G. R. *Biologia Moderna*. São Paulo: Moderna, 2016. Vol. 2, capítulo sobre vírus.
- LOPES, S.; ROSSO, S. *Bio*. São Paulo: Saraiva, 2016. Vol. 2, capítulo sobre vírus e viroses.
- LINHARES, S.; GEWANDSZNAJDER, F.; PACCA, H. *Biologia Hoje*. São Paulo: Ática, 2016. Vol. 2, capítulo sobre vírus.
- REECE, J. B. et al. *Biologia de Campbell*. 10. ed. Porto Alegre: Artmed, 2015. Cap. 19 (vírus).
- TORTORA, G. J.; FUNKE, B. R.; CASE, C. L. *Microbiologia*. 12. ed. Porto Alegre: Artmed, 2017. Cap. 13 (vírus, viroides e príons).
- MADIGAN, M. T. et al. *Microbiologia de Brock*. 14. ed. Porto Alegre: Artmed, 2016. Caps. 8 e 9 (vírus e genética viral).
- BRASIL. Ministério da Saúde. *Guia de Vigilância em Saúde*. 6. ed. Brasília, 2023 (dengue, chikungunya, zika, febre amarela, sarampo, hepatites, HIV/aids, influenza, covid-19).
- BRASIL. Ministério da Saúde. Calendário Nacional de Vacinação (versão vigente no site do Programa Nacional de Imunizações).
- ORGANIZAÇÃO MUNDIAL DA SAÚDE. Fichas informativas (*fact sheets*) sobre HIV, hepatites, sarampo, dengue, influenza e HPV.
- TEMIN, H. M.; MIZUTANI, S. RNA-dependent DNA polymerase in virions of Rous sarcoma virus. *Nature*, v. 226, p. 1211-1213, 1970; BALTIMORE, D. RNA-dependent DNA polymerase in virions of RNA tumour viruses. *Nature*, v. 226, p. 1209-1211, 1970.
- LWOFF, A. The concept of virus. *Journal of General Microbiology*, v. 17, p. 239-253, 1957.

---

## Seção: Natureza (`natureza`)

### N1 `#natureza/vivo`: "Vírus são seres vivos?"
- **Subtítulo:** "passam no filtro, não têm célula e só se multiplicam dentro de outra"

**Texto do aluno:**
> No fim do século XIX, os cientistas já sabiam que muitas doenças eram causadas por bactérias, e um jeito de provar isso era passar o líquido doente por um **filtro de porcelana**, com poros tão finos que seguravam as bactérias. Em **1892**, o russo **Dmitri Ivanovsky** fez isso com a seiva de plantas de tabaco com a **doença do mosaico** (folhas manchadas) e viu que o líquido filtrado continuava infectando plantas sadias. Em **1898**, o holandês **Martinus Beijerinck** repetiu o experimento e concluiu que o agente era algo novo, menor que qualquer bactéria e que só se multiplicava dentro da planta. Chamou-o de **vírus** (do latim, "veneno"). Ninguém viu um vírus até **1939**, quando o **microscópio eletrônico** mostrou os bastonetes do vírus do mosaico do tabaco. A maioria dos vírus mede de **20 a 300 nanômetros**: uma bactéria comum tem cerca de 2 000 nm.
>
> Um vírus **não tem célula**: é só um **ácido nucleico** (DNA ou RNA) dentro de uma capa de proteína. Não tem citoplasma, ribossomos nem enzimas para produzir energia, e por isso **não tem metabolismo próprio**. Fora de uma célula, é uma partícula inerte, que pode até ser **cristalizada**, como um sal (Wendell Stanley fez isso com o vírus do mosaico em 1935). Dentro de uma célula, usa a maquinaria dela para fazer cópias de si mesmo: é um **parasita intracelular obrigatório**. Também não cresce nem se divide: as cópias são **montadas** a partir de peças. Por tudo isso, muitos autores **não consideram os vírus seres vivos**, ou os colocam "na fronteira" da vida. Por outro lado, os vírus têm **material genético**, que passa para as cópias (**hereditariedade**), sofrem **mutação** e **evoluem por seleção natural**: é assim que surgem as variantes do vírus da gripe e da covid-19. A descoberta de **vírus gigantes**, como o **mimivírus** (cerca de 750 nm, maior que algumas bactérias), reacendeu o debate. Na Biologia, a resposta mais honesta é: depende da definição de vida que se usa.

**Animação:** o experimento de Ivanovsky e Beijerinck em três quadros. (1) Folha com mosaico é triturada; o suco passa por um filtro de porcelana desenhado em corte, com bactérias (bastonetes verde-oliva) presas nos poros e pontinhos cinza-azulados passando. (2) O filtrado é pingado numa folha sadia, que fica manchada. (3) Zoom do microscópio eletrônico sobre o filtrado: aparecem os bastonetes do vírus do mosaico do tabaco, com a régua "300 nm".
**Interação "Vivo ou não vivo?":** uma balança de dois pratos. O aluno arrasta cartões de características para o prato "como um ser vivo" ou "diferente de um ser vivo": "tem DNA ou RNA" (como), "sofre mutação" (como), "evolui por seleção natural" (como), "tem célula" (diferente), "tem metabolismo próprio" (diferente), "tem ribossomos" (diferente), "multiplica-se sozinho" (diferente), "pode ser cristalizado" (diferente). No fim, a balança fica pendente para "diferente", e a tela mostra: "por isso muitos autores não consideram o vírus um ser vivo, mas a questão continua em debate".
**Faixa "Escala":** uma régua logarítmica com hemácia (cerca de 7 µm), bactéria (cerca de 2 µm), mimivírus (cerca de 750 nm), HIV (cerca de 120 nm), vírus da gripe (cerca de 100 nm), poliovírus (cerca de 30 nm). Ao tocar em cada um, o tamanho em nm.

**Cartão "No ENEM":**
> As duas ideias mais cobradas: vírus são **acelulares** e **parasitas intracelulares obrigatórios**. Delas sai tudo: por que não entram em nenhum reino, por que **antibióticos não funcionam** contra vírus (agem em parede e ribossomos de bactérias, que o vírus não tem) e por que é preciso cultivar vírus **em células vivas** (ovos embrionados, culturas de células) para estudá-los ou fazer vacinas. Se a questão perguntar o argumento **a favor** de serem vivos, a resposta é **material genético com mutação e evolução**.

---

## Seção: Estrutura (`estrutura`)

### E1 `#estrutura/particula`: "A partícula viral"
- **Subtítulo:** "ácido nucleico, capsídeo e, às vezes, um envelope"

**Texto do aluno:**
> Todo vírus tem duas partes. No centro, o **ácido nucleico**, que guarda os genes do vírus: **DNA ou RNA, nunca os dois** como material genético. Ele pode ser de fita **simples** ou **dupla**, inteiro ou dividido em pedaços (o vírus da gripe tem o RNA em **8 segmentos**). Em volta, uma capa de proteína, o **capsídeo**, formada por muitas unidades iguais, os **capsômeros**, que se encaixam sozinhas, como peças de um brinquedo de montar. O capsídeo protege o ácido nucleico e, nos vírus sem envelope, é ele que se prende à célula. Ácido nucleico mais capsídeo formam o **nucleocapsídeo**. Alguns vírus carregam também **enzimas** dentro do capsídeo, como a transcriptase reversa do HIV (ver R2).
>
> Muitos vírus que infectam animais têm, por fora do capsídeo, um **envelope**: uma bicamada de **lipídios** que o vírus leva da **membrana da célula** onde foi montado, quando sai dela. Nesse envelope ficam espetadas **glicoproteínas virais**, as **espículas**, que funcionam como "chaves": elas se encaixam em **receptores** da membrana de certas células, como chave e fechadura. É por isso que cada vírus infecta só alguns tipos de célula (**especificidade**): o HIV usa a proteína **CD4** dos linfócitos T auxiliares; o SARS-CoV-2 usa a sua **proteína S** (*spike*) para se ligar à **ECA2**, presente em células do pulmão e de outros órgãos; o vírus da gripe usa a **hemaglutinina (H)** para entrar e a **neuraminidase (N)** para sair, e as letras H e N dão nome aos subtipos, como **H1N1** e **H3N2**. Como o envelope é feito de lipídios, **sabão** e **álcool 70%** o destroem e inativam o vírus. Vírus **sem envelope** (HPV, hepatite A, rotavírus, norovírus, poliovírus) são mais resistentes ao ambiente e ao álcool.

**Animação:** uma partícula de vírus envelopado (modelo genérico, com cara de vírus da gripe) se monta de dentro para fora: primeiro o ácido nucleico (coral, RNA), depois os capsômeros (cinza-azulado) se encaixando em volta, depois o envelope rosa "brotando" de um pedaço de membrana celular, e por fim as espículas âmbar. Um botão "corte" abre a partícula ao meio, com rótulos. Um segundo botão, "sabão", mostra moléculas de sabão desmanchando o envelope: as espículas se soltam e o vírus não consegue mais se prender à célula; o nucleocapsídeo nu fica de lado, rotulado "inativado".
**Interação "Chave e fechadura":** três vírus (HIV, SARS-CoV-2, vírus da gripe) e quatro células (linfócito T com CD4, célula do pulmão com ECA2, célula da traqueia com receptor de ácido siálico, hemácia sem nenhum desses receptores). O aluno arrasta cada vírus até uma célula; se a espícula encaixa no receptor, a célula acende e o vírus entra; se não, o vírus "escorrega" e a tela explica: "sem receptor, sem infecção". A hemácia nunca é infectada por nenhum dos três.

**Cartão "No ENEM":**
> Saiba as partes: **ácido nucleico** (DNA **ou** RNA), **capsídeo** (proteína, feito de capsômeros) e **envelope** (lipídios da célula hospedeira, com glicoproteínas virais). A ideia de **especificidade** (espícula e receptor) explica por que o HIV ataca linfócitos T CD4 e por que muitas vacinas miram a proteína da superfície do vírus. Pegadinha do dia a dia: lavar as mãos com **sabão** funciona contra vírus envelopados porque **dissolve o envelope** de lipídios, não porque "mata" o vírus como se mata uma bactéria.

### E2 `#estrutura/tipos`: "Formas e tipos de vírus"
- **Subtítulo:** "hélice, icosaedro, cabeça e cauda; DNA ou RNA"

**Texto do aluno:**
> Os capsômeros se organizam em poucas formas. Na simetria **helicoidal**, eles giram em espiral em volta do ácido nucleico e formam um bastonete, como no **vírus do mosaico do tabaco**; o vírus da gripe e o do sarampo têm nucleocapsídeos helicoidais dentro do envelope. Na simetria **icosaédrica**, o capsídeo é um poliedro de **20 faces triangulares**, quase uma esfera, como no **HPV**, no **adenovírus** e no **poliovírus**. Os **bacteriófagos** como o **T4** têm forma **complexa**: uma "cabeça" icosaédrica com o DNA, uma **cauda** que funciona como seringa e **fibras** que prendem o fago na bactéria. Por fora, com o envelope, muitos vírus parecem esferas com espinhos, e a forma do capsídeo fica escondida.
>
> Os vírus também são separados pelo material genético. **Vírus de DNA:** herpes (herpes labial e genital, catapora), HPV, hepatite B, varíola, adenovírus e o fago T4. **Vírus de RNA:** gripe, SARS-CoV-2, HIV, dengue, zika, chikungunya, febre amarela, sarampo, raiva, poliomielite e hepatites A e C. Os vírus de RNA, em geral, **mutam mais**, porque as enzimas que copiam RNA quase não corrigem os próprios erros. É por isso que a vacina da gripe muda todo ano e que o SARS-CoV-2 ganhou tantas variantes. Existem vírus para **todos os grupos de seres vivos**: bactérias (bacteriófagos), arqueas, fungos, plantas e animais.
>
> Na fronteira dos vírus há agentes ainda mais simples. Os **viroides** são só uma pequena molécula de **RNA circular, sem capsídeo**, e causam doenças em plantas (como a do tubérculo afilado da batata). Os **príons** não têm **nenhum ácido nucleico**: são **proteínas** com a forma errada que fazem outras proteínas iguais mudarem de forma. Eles causam doenças que destroem o cérebro, como a **encefalopatia espongiforme bovina** ("doença da vaca louca") e, em humanos, a doença de Creutzfeldt-Jakob.

**Animação:** três modelos lado a lado, girando devagar: bastonete helicoidal (mosaico do tabaco), icosaedro (adenovírus, com as 20 faces destacadas uma a uma) e fago T4 (reaproveitar o modelo 3D do módulo Célula). Um botão "colocar envelope" veste o icosaedro com o envelope rosa e as espículas âmbar, mostrando que, por fora, a forma interna some.
**Interação "DNA ou RNA?":** cartões com o nome de vírus e doenças (gripe, herpes, HIV, HPV, dengue, hepatite B, sarampo, covid-19, febre amarela, hepatite A). O aluno arrasta para a coluna violeta (DNA) ou coral (RNA). Ao acertar, aparece também "tem envelope?" com sim ou não. Ao final, um resumo: "vírus de RNA mudam mais rápido; por isso a vacina da gripe é anual".
**Faixa "Viroide e príon":** três cartões comparativos, com ícones: vírus (ácido nucleico + capsídeo), viroide (só RNA circular), príon (só proteína).

**Cartão "No ENEM":**
> A prova não pede nome de família de vírus, mas cobra a relação entre **RNA**, **alta taxa de mutação** e **vacina que precisa ser atualizada** (gripe, covid-19). Formas que valem a pena reconhecer no desenho: o bastonete **helicoidal**, o **icosaedro** e o fago "cabeça e cauda". Se aparecer um agente infeccioso **sem ácido nucleico**, é um **príon**; só **RNA, sem capsídeo**, é um **viroide**.

---

## Seção: Fagos (`fagos`)

### F1 `#fagos/litico`: "O ciclo lítico"
- **Subtítulo:** "o fago entra, copia e arrebenta a bactéria"

**Texto do aluno:**
> Os **bacteriófagos** (ou só **fagos**, "comedores de bactéria") são vírus que infectam **bactérias**. O mais estudado é o **T4**, que ataca a *Escherichia coli*. No **ciclo lítico**, a infecção termina com a morte da bactéria, em cinco etapas:
> 1. **Adsorção:** as fibras da cauda se prendem a receptores da parede da bactéria.
> 2. **Penetração:** a cauda se contrai como uma seringa e **injeta só o DNA**; o capsídeo vazio fica do lado de fora.
> 3. **Síntese:** o DNA do fago comanda a bactéria. Uma das primeiras proteínas virais degrada o DNA da própria bactéria, e os **ribossomos, enzimas, nucleotídeos, aminoácidos e ATP da bactéria** passam a produzir DNA e proteínas do fago.
> 4. **Montagem:** as cabeças, caudas e fibras se juntam sozinhas, e cada cabeça recebe uma cópia do DNA.
> 5. **Liberação (lise):** uma enzima do fago, a **lisozima**, rompe a parede da bactéria, que **arrebenta** e libera de **100 a 200** fagos novos, prontos para infectar outras bactérias.
>
> Tudo isso leva cerca de **meia hora** a 37 °C. Como cada bactéria libera centenas de fagos, e cada um infecta outra bactéria, uma cultura de bactérias pode ser destruída em poucas horas. Numa placa de cultura, isso aparece como "buracos" claros no tapete de bactérias, as **placas de lise**. Os fagos atacam bactérias, mas **não infectam células humanas**: por isso estão sendo estudados como alternativa aos antibióticos contra bactérias resistentes (a **fagoterapia**).

**Animação:** o ciclo lítico em cinco quadros numerados, com o fago T4 do módulo Célula e uma *E. coli* em corte. O DNA do fago em violeta-claro e o da bactéria em violeta-escuro, para o aluno ver o DNA bacteriano sendo picotado na etapa 3. Na etapa 5, a bactéria se rompe e os fagos novos se espalham. Contador no canto: "tempo: 0 a 30 min" e "fagos liberados: cerca de 150".
**Interação "Monte o ciclo":** as cinco etapas em cartões embaralhados (adsorção, penetração, síntese, montagem, lise). O aluno coloca em ordem; a cada acerto, o quadro correspondente da animação toca. Depois, um modo "placa de cultura": o aluno toca num ponto do tapete de bactérias para soltar um fago, e a placa de lise cresce em círculo, geração após geração.

**Cartão "No ENEM":**
> Guarde a sequência **adsorção, penetração, síntese, montagem e liberação**, e o ponto central: o vírus usa a **maquinaria da célula** (ribossomos, enzimas, energia, matéria-prima), porque não tem a própria. No fago, **só o ácido nucleico entra**; essa é a base do experimento de Hershey e Chase (1952), que marcou o DNA e as proteínas do fago com isótopos diferentes e mostrou que o DNA, e não a proteína, é o material genético.

### F2 `#fagos/lisogenico`: "O ciclo lisogênico"
- **Subtítulo:** "o fago se esconde no DNA da bactéria"

**Texto do aluno:**
> Alguns fagos, como o **fago lambda (λ)**, podem seguir outro caminho. Depois de injetar o DNA, em vez de destruir a bactéria logo, o fago **insere o seu DNA no cromossomo bacteriano**. Esse DNA viral integrado se chama **prófago**. Ele fica "quieto": quase nenhum gene do fago é expresso, a bactéria continua viva e normal, e, cada vez que ela se divide, o prófago é **copiado junto** com o cromossomo. Assim, em poucas gerações, milhões de bactérias carregam o fago sem saber. A bactéria com prófago é chamada de **lisogênica**. Esse é o **ciclo lisogênico**.
>
> O prófago pode ficar assim por muitas gerações, mas não para sempre. Um estresse para a bactéria, como **radiação ultravioleta** ou certas substâncias químicas, pode provocar a **indução**: o prófago se solta do cromossomo e o vírus entra no **ciclo lítico**, com montagem de fagos e lise da bactéria. Às vezes, os genes do prófago mudam a própria bactéria, o que se chama **conversão lisogênica**. Um exemplo importante para a saúde: as bactérias da **difteria** (*Corynebacterium diphtheriae*) e da **cólera** (*Vibrio cholerae*) só produzem as toxinas que causam essas doenças quando carregam o gene trazido por um fago. Ou seja, um vírus pode transformar uma bactéria inofensiva em perigosa. Fagos que carregam pedaços de DNA de uma bactéria para outra também espalham genes, inclusive alguns de resistência a antibióticos (a **transdução**).

**Animação:** a tela começa com o fago injetando o DNA, como em F1, e então se divide em dois caminhos, à esquerda "lítico" e à direita "lisogênico". No lisogênico, o DNA do fago (violeta-claro) se encaixa no cromossomo circular da bactéria (violeta-escuro); a bactéria se divide três vezes e o pedaço violeta-claro aparece em todas as filhas. Um raio de luz ultravioleta atinge uma delas: o prófago se solta e ela entra no caminho lítico.
**Interação "Lítico ou lisogênico?":** um botão "condições" com dois controles: "bactérias bem nutridas, sem estresse" e "luz UV". O aluno escolhe e solta um fago lambda; a animação mostra o caminho que tende a ocorrer (na vida real, a "escolha" depende do estado da bactéria e de quantos fagos a infectam; a tela diz isso no rodapé). Depois, um quadro comparativo com duas colunas, preenchido pelo aluno arrastando frases: "a bactéria morre logo" (lítico); "o DNA viral entra no cromossomo" (lisogênico); "o vírus é copiado quando a bactéria se divide" (lisogênico); "libera centenas de fagos" (lítico).

**Cartão "No ENEM":**
> **Lítico** = multiplicação imediata e **lise** (morte) da célula. **Lisogênico** = DNA viral **integrado** ao cromossomo (**prófago**), copiado a cada divisão, sem matar a célula, até a **indução** para o ciclo lítico. A questão pode trazer o gráfico de uma cultura de bactérias que cresce normalmente e, de repente, despenca depois de uma exposição a UV: é a indução do prófago. A ideia de vírus "dormindo" no DNA reaparece no HIV (provírus, em R2).

---

## Seção: Replicação (`replicacao`)

### R1 `#replicacao/animal`: "Vírus em células animais"
- **Subtítulo:** "entrar inteiro, se desmontar e sair brotando"

**Texto do aluno:**
> Nos vírus que infectam animais, as etapas são parecidas com as do fago, com três diferenças importantes. **Na entrada**, o vírus entra **inteiro**: depois de se prender ao receptor, ou o envelope **se funde** com a membrana da célula, ou a célula engole o vírus numa vesícula (**endocitose**), sem saber que é uma armadilha. **Depois**, o capsídeo se desmonta e libera o ácido nucleico no citoplasma; essa etapa se chama **desnudamento**. Vírus de DNA, em geral, levam o DNA ao **núcleo**, onde são copiados; muitos vírus de RNA se copiam no próprio **citoplasma**, com uma enzima que eles mesmos codificam (a **RNA polimerase dependente de RNA**, que a célula não tem).
>
> **Na saída**, vírus sem envelope costumam sair rompendo a célula, como no ciclo lítico. Os **envelopados** saem por **brotamento**: o nucleocapsídeo empurra um pedaço da membrana, onde as glicoproteínas virais já foram colocadas, e sai embrulhado nele, ganhando o envelope. A célula pode continuar produzindo vírus por um tempo antes de morrer. Alguns vírus também ficam **latentes**, quietos dentro da célula por anos. O vírus do **herpes simples** fica guardado em **neurônios** e volta a causar as bolhas do herpes labial quando a imunidade cai (estresse, febre, sol forte). O da **catapora** (varicela-zóster) faz o mesmo e pode voltar décadas depois como **herpes-zóster** ("cobreiro"). Isso lembra o ciclo lisogênico, mas o DNA do herpes **não se integra** ao DNA da célula: fica separado, dentro do núcleo.

**Animação:** uma célula animal em corte (membrana rosa, núcleo violeta) e um vírus envelopado. Etapas numeradas: (1) ligação da espícula ao receptor; (2) entrada por fusão do envelope (um botão alterna para "endocitose"); (3) desnudamento, com os capsômeros se espalhando; (4) cópia do RNA e produção de proteínas nos ribossomos da célula; (5) montagem perto da membrana; (6) brotamento: a membrana se curva em volta do nucleocapsídeo e o vírus novo sai já com o envelope rosa. Uma faixa lateral compara com F1: "fago: só o DNA entra; vírus animal: entra inteiro".
**Interação "Lise ou brotamento?":** o aluno escolhe entre um vírus sem envelope (adenovírus) e um envelopado (vírus da gripe) e vê a forma de saída de cada um; ao final, a pergunta: "de onde veio o envelope do vírus novo?" (resposta: da membrana desta célula).
**Faixa "Latência":** linha do tempo de uma pessoa: catapora aos 5 anos, anos de vírus quieto num gânglio nervoso, herpes-zóster aos 65 anos. Nota: existe vacina contra a catapora (no calendário infantil) e contra o herpes-zóster (para pessoas mais velhas).

**Cartão "No ENEM":**
> As diferenças para o fago: o vírus animal **entra inteiro** (por **fusão** ou **endocitose**), passa pelo **desnudamento** e, se tiver envelope, sai por **brotamento**, levando um pedaço da membrana da célula. Uma questão pode perguntar por que uma pessoa tem herpes labial "de novo" sem ter se contaminado outra vez: o vírus ficou **latente** em neurônios e foi **reativado**.

### R2 `#replicacao/retrovirus`: "Retrovírus e transcriptase reversa"
- **Subtítulo:** "de RNA para DNA, o caminho ao contrário"

**Texto do aluno:**
> Na célula, a informação genética costuma seguir um caminho: o **DNA** é transcrito em **RNA**, e o RNA é traduzido em **proteína**. Os **retrovírus** fazem parte do caminho ao contrário (*retro* = para trás). Seu material genético é **RNA**, mas, logo depois de entrar na célula, uma enzima que o vírus traz dentro do capsídeo, a **transcriptase reversa**, usa esse RNA como molde para fabricar **DNA**. Em seguida, outra enzima viral, a **integrase**, insere esse DNA no **cromossomo da célula**, onde ele passa a se chamar **provírus**. A partir daí, a célula transcreve os genes do vírus como se fossem seus, e produz RNA e proteínas para novos vírus; uma terceira enzima viral, a **protease**, corta as proteínas no tamanho certo para a montagem. A transcriptase reversa foi descoberta em **1970**, ao mesmo tempo, por Howard **Temin** e David **Baltimore** (Nobel de 1975). O retrovírus mais conhecido é o **HIV**.
>
> Três consequências caem muito em prova. Primeira: como o provírus fica no DNA da célula, a infecção pelo HIV é, até hoje, **para a vida toda**: os remédios controlam o vírus, mas o provírus continua nas células "escondidas". Segunda: a transcriptase reversa **erra muito** e não corrige os erros, por isso o HIV muda depressa dentro da própria pessoa, o que favorece a **resistência a medicamentos** e dificulta uma vacina. Por isso o tratamento usa vários remédios juntos (o "coquetel"). Terceira: os remédios **antirretrovirais** atacam justamente essas enzimas, que a célula humana não tem: há inibidores da **transcriptase reversa** (como o tenofovir e o antigo AZT), da **integrase** e da **protease**. Atenção: o **SARS-CoV-2 não é retrovírus** e não tem transcriptase reversa; ele copia RNA em RNA no citoplasma e não entra no núcleo. A transcriptase reversa também virou ferramenta de laboratório: o exame **RT-PCR** da covid-19 começa transformando o RNA do vírus em DNA com ela.

**Animação:** um linfócito T em corte. O HIV se prende ao CD4, funde o envelope e solta o capsídeo. Dentro dele, o RNA coral é "lido" pela transcriptase reversa (uma pecinha âmbar que desliza), e uma fita de DNA violeta vai sendo montada; o DNA entra no núcleo e a integrase o "costura" no cromossomo (provírus destacado em violeta-claro dentro do violeta-escuro). Depois, o núcleo produz RNA viral, os ribossomos fazem proteínas, a protease corta, e vírus novos brotam. No topo, uma faixa com o dogma central: "DNA, RNA, proteína", e uma seta curva âmbar de RNA para DNA marcada "transcriptase reversa". (Na tela, a seta é desenho; no texto, escrever "de RNA para DNA".)
**Interação "Onde o remédio age?":** a mesma animação, pausável em três pontos. O aluno arrasta três comprimidos (inibidor da transcriptase reversa, inibidor da integrase, inibidor da protease) até a etapa que cada um bloqueia; ao acertar, a animação trava ali e nenhum vírus novo sai. Ao final, um botão "só um remédio" mostra um vírus mutante que escapa e se multiplica; "os três juntos" mostra que fica muito mais difícil um mutante escapar de todos ao mesmo tempo.

**Cartão "No ENEM":**
> **Retrovírus** = vírus de **RNA** que usa a **transcriptase reversa** para fazer **DNA** a partir do RNA, e integra esse DNA no genoma da célula (**provírus**). É a exceção mais famosa ao "DNA faz RNA, que faz proteína". A prova também cobra por que o tratamento do HIV usa **vários antirretrovirais**: a alta taxa de **mutação** gera variantes resistentes a um remédio isolado. Pegadinha: o SARS-CoV-2 e o vírus da gripe são vírus de RNA, mas **não** são retrovírus.

---

## Seção: Doenças (`doencas`)

### D1 `#doencas/arboviroses`: "Dengue, zika, chikungunya e febre amarela"
- **Subtítulo:** "quatro vírus, um mosquito: o *Aedes aegypti*"

**Texto do aluno:**
> **Arboviroses** são doenças causadas por vírus transmitidos por artrópodes, como mosquitos. No Brasil, as mais importantes são **dengue**, **zika**, **chikungunya** e **febre amarela**, todas causadas por **vírus de RNA envelopados**. A dengue, a zika e a chikungunya são transmitidas nas cidades pela **fêmea** do mosquito ***Aedes aegypti*** (só a fêmea pica, porque precisa do sangue para amadurecer os ovos), e também pelo *Aedes albopictus*. O mosquito pica de dia e põe os ovos em **água parada e limpa**: pneus, vasos de plantas, garrafas, caixas-d'água destampadas. Os ovos resistem secos por mais de um ano e eclodem quando a água volta. Por isso o combate mais eficiente é **eliminar os criadouros**. Não há transmissão de pessoa para pessoa pelo ar nem pelo toque.
>
> A **dengue** causa febre alta, dor atrás dos olhos, dor no corpo e manchas na pele. Há **quatro sorotipos** do vírus (DENV-1 a DENV-4): quem pega um fica protegido contra ele, mas uma segunda infecção por **outro sorotipo** aumenta o risco de **dengue grave**, com sangramentos e queda da pressão. Por isso, com suspeita de dengue, **não se deve tomar ácido acetilsalicílico** (AAS) nem anti-inflamatórios, que pioram o sangramento, e é preciso beber muito líquido e procurar atendimento. O SUS oferece uma vacina contra a dengue desde 2024, para uma faixa de idade definida pelo Ministério da Saúde, e o Instituto Butantan desenvolveu uma vacina de dose única aprovada pela Anvisa em 2025. A **zika** costuma ser mais leve no adulto, mas, na gestante, o vírus atravessa a placenta e pode causar **microcefalia** e outras malformações no bebê (a **síndrome congênita do zika**, que marcou a epidemia de 2015 e 2016 no Brasil); também se associa à síndrome de **Guillain-Barré** e pode ser transmitida por **relação sexual**. A **chikungunya** ("aquele que se dobra", numa língua da Tanzânia) causa **dor forte nas articulações**, que pode durar meses.
>
> A **febre amarela** tem dois ciclos. No **ciclo silvestre**, nas matas, o vírus passa entre **macacos** por mosquitos dos gêneros *Haemagogus* e *Sabethes*, e a pessoa que entra na mata pode ser picada. Os **macacos não transmitem** a doença para pessoas: eles adoecem e morrem como nós, e servem de **alerta** de que o vírus está circulando; matá-los é crime e atrapalha a vigilância. No **ciclo urbano**, o transmissor seria o *Aedes aegypti*; no Brasil, não há registro de febre amarela urbana desde **1942**. O vírus ataca o **fígado**, e a pele amarelada (**icterícia**) dá nome à doença. Há uma **vacina** eficaz no calendário do SUS.

**Quadro (Ministério da Saúde, Guia de Vigilância em Saúde):**

| Doença | Transmissão principal | Marca da doença | Vacina no SUS |
|---|---|---|---|
| Dengue | *Aedes aegypti* (urbano) | febre alta, dor atrás dos olhos; 4 sorotipos; risco de forma grave | sim, para grupos e idades definidos |
| Zika | *Aedes aegypti*; também sexual e da mãe para o feto | microcefalia e outras malformações; Guillain-Barré | não |
| Chikungunya | *Aedes aegypti* | dor nas articulações que pode durar meses | não (ainda fora do calendário) |
| Febre amarela | *Haemagogus* e *Sabethes* (silvestre); *Aedes aegypti* (urbano, sem casos no Brasil desde 1942) | icterícia, lesão do fígado | sim |

**Animação:** um quintal desenhado, com criadouros escondidos (pneu, pratinho de vaso, garrafa, calha entupida, caixa-d'água aberta). O ciclo do mosquito acontece num deles, sem detalhar a metamorfose: ovos na parede, água sobe, larvas, mosquito adulto em cerca de 7 a 10 dias. Uma fêmea pica uma pessoa doente, depois uma pessoa sadia; uma linha pontilhada liga as duas, com o rótulo "o vírus vai junto com a saliva". Para a febre amarela, um segundo cenário: a copa da mata, com macacos e *Haemagogus*, e uma pessoa entrando na trilha.
**Interação "Caça aos criadouros":** o aluno toca nos criadouros do quintal para eliminá-los (virar a garrafa, pôr areia no pratinho, tampar a caixa, guardar o pneu). Um contador de mosquitos cai a cada criadouro eliminado. No fim, "Sabia?": a Fiocruz solta mosquitos com a bactéria ***Wolbachia***, que diminui a capacidade do *Aedes* de transmitir os vírus; os mosquitos com *Wolbachia* cruzam com os locais e passam a bactéria para os filhotes.
**Interação "Qual arbovirose?":** quatro fichas de pacientes fictícios (febre alta e dor atrás dos olhos; gestante com manchas e bebê com microcefalia; dor nas juntas há três meses; pele amarelada depois de acampar na mata). O aluno associa cada ficha a uma doença.

**Cartão "No ENEM":**
> É um dos temas mais cobrados da Biologia no ENEM. Saiba: as quatro são **viroses**, transmitidas por **mosquito** (vetor), e a medida mais eficaz nas cidades é **eliminar os criadouros de água parada**. Antibiótico **não** trata nenhuma delas. Pegadinhas: o mosquito **não** é o causador (é o **vetor**; o causador é o vírus); o **macaco não transmite** febre amarela para pessoas; e na suspeita de dengue não se toma **AAS**. A relação **zika na gestação e microcefalia** aparece em questões sobre teratogenia.

### D2 `#doencas/hiv`: "HIV e aids"
- **Subtítulo:** "o vírus que ataca a defesa do corpo"

**Texto do aluno:**
> O **HIV** (vírus da imunodeficiência humana) é um **retrovírus** que infecta principalmente os **linfócitos T auxiliares**, que têm a proteína **CD4** na membrana. Esses linfócitos coordenam a resposta imune: sem eles, os outros glóbulos brancos não são "avisados" do perigo. Logo depois da infecção, pode haver febre e mal-estar parecidos com uma gripe; depois, a pessoa pode passar **anos sem sintomas**, enquanto o vírus destrói os linfócitos aos poucos. Sem tratamento, quando a quantidade de linfócitos CD4 fica muito baixa (abaixo de **200 por mm³** de sangue), o corpo perde a defesa contra micróbios que normalmente não causariam doença: são as **doenças oportunistas**, como tuberculose, pneumonia por *Pneumocystis*, candidíase e o câncer chamado sarcoma de Kaposi. Essa fase é a **aids** (síndrome da imunodeficiência adquirida). Ter HIV não é o mesmo que ter aids.
>
> O HIV é transmitido por **sangue**, **sêmen**, **secreção vaginal** e **leite materno**: por **relação sexual sem preservativo**, pelo **compartilhamento de seringas e agulhas**, e **da mãe para o filho** na gestação, no parto ou na amamentação (a transmissão por transfusão ficou muito rara com a testagem do sangue doado). O HIV **não** passa por abraço, beijo no rosto, aperto de mão, talheres, piscina, suor, lágrimas nem **picada de mosquito**. Não há vacina nem cura, mas há **tratamento**: o **tratamento antirretroviral**, gratuito no SUS desde **1996**, controla o vírus. A pessoa em tratamento que mantém a carga viral **indetectável** por pelo menos seis meses **não transmite o HIV por via sexual** ("indetectável = intransmissível") e tem expectativa de vida próxima à de quem não tem o vírus. A prevenção combina **preservativo**, **testagem** (teste rápido gratuito), **PrEP** (remédio tomado antes, por quem tem maior chance de exposição), **PEP** (remédio começado em até **72 horas** depois de uma exposição de risco) e o tratamento da gestante, que reduz muito a transmissão para o bebê.

**Animação:** um "placar" do sistema imune ao longo de dez anos sem tratamento: uma linha de linfócitos CD4 (azul) caindo devagar e uma de carga viral (vermelha) que sobe no começo, cai, e volta a subir no fim. Ao cruzar a linha de 200 CD4/mm³, aparecem ícones de doenças oportunistas. Um botão "com tratamento" redesenha o gráfico: a carga viral despenca até "indetectável" e os linfócitos se recuperam.
**Interação "Passa ou não passa?":** cartões com situações; o aluno marca "transmite" ou "não transmite": relação sexual sem preservativo (transmite); compartilhar seringa (transmite); gestação sem tratamento (pode transmitir); amamentação (pode transmitir); abraço (não); beijo no rosto (não); usar o mesmo copo (não); picada de mosquito (não, e a tela explica: o vírus não se multiplica no mosquito, e o mosquito não injeta sangue de uma pessoa na outra); relação com parceiro com carga viral indetectável há mais de seis meses (não transmite pela via sexual).

**Cartão "No ENEM":**
> Saiba: HIV é **retrovírus**, ataca **linfócitos T CD4**, e a aids é a fase em que a imunidade cai e surgem **doenças oportunistas**. As **vias de transmissão** (sexual, sangue, mãe para filho) e as que **não** transmitem são as mais cobradas, muitas vezes em questões que combatem o **preconceito**. O tratamento combina **vários antirretrovirais** por causa da mutação rápida. Pegadinha: **mosquito não transmite HIV**, mas transmite dengue; a diferença é que o vírus da dengue se multiplica no mosquito e chega à saliva dele.

### D3 `#doencas/respiratorias`: "Gripe, covid-19 e sarampo"
- **Subtítulo:** "vírus que viajam no ar"

**Texto do aluno:**
> A **gripe** é causada pelo **vírus influenza**, um vírus de RNA com envelope e genoma em 8 pedaços. Passa por **gotículas** e **aerossóis** expelidos ao tossir, espirrar e falar, e por mãos e objetos contaminados. O vírus muda o tempo todo por **pequenas mutações** nas proteínas H e N; por isso a vacina é **atualizada todo ano**, com as cepas que mais circulam, e deve ser tomada **todo ano**. De vez em quando, dois vírus diferentes (um humano e um de ave ou de porco) infectam a mesma célula e **trocam segmentos** de RNA, gerando um vírus muito diferente, contra o qual quase ninguém tem defesa: é assim que nascem as **pandemias** de gripe, como a de 1918 (a "gripe espanhola") e a de 2009 (H1N1). Gripe não é o mesmo que resfriado, que é causado por outros vírus (como os rinovírus) e costuma ser mais leve.
>
> A **covid-19** é causada pelo **SARS-CoV-2**, um **coronavírus** (de RNA, com envelope, cujas espículas lembram uma coroa). A OMS declarou a **pandemia** em **março de 2020** e encerrou a emergência internacional em **maio de 2023**. O vírus usa a proteína **S** para entrar nas células pela **ECA2** e passa por gotículas e **aerossóis**, sobretudo em lugares fechados e pouco ventilados. Por isso funcionaram **máscaras**, **ventilação**, distanciamento e **vacinas**. O vírus acumulou mutações e gerou **variantes** (como Gama, identificada em Manaus, Delta e Ômicron). As vacinas foram feitas por várias técnicas: **vírus inativado** (CoronaVac, Butantan), **vetor viral** (um adenovírus modificado que leva o gene da proteína S; AstraZeneca e Fiocruz) e **RNA mensageiro** (Pfizer), que ensina as células a produzir a proteína S por pouco tempo e **não altera o DNA** de quem é vacinado.
>
> O **sarampo** é uma das doenças **mais contagiosas** que existem: uma pessoa doente pode infectar de 12 a 18 outras sem imunidade, pelo ar. Causa febre alta, tosse, olhos vermelhos e **manchas vermelhas** que começam no rosto e descem pelo corpo, e pode levar a pneumonia, encefalite e morte, sobretudo em crianças pequenas e desnutridas. A prevenção é a vacina **tríplice viral** (sarampo, caxumba e rubéola), em duas doses na infância. O Brasil recebeu o certificado de país livre do sarampo em **2016**, **perdeu** em 2019 depois de surtos ligados à queda da vacinação, e **voltou a ser certificado** em 2024. A doença volta sempre que a cobertura vacinal cai.

**Animação:** uma sala de aula vista de cima, com uma pessoa doente e 20 colegas. Três botões: "gripe", "covid-19" e "sarampo". A tela mostra nuvens de aerossol e quantos colegas são infectados em média (com números de ordem de grandeza, rotulados "média aproximada"). Controles: "janelas abertas", "máscaras", "turma vacinada". Com a turma vacinada, a nuvem continua saindo, mas quase ninguém fica doente. No sarampo, sem vacina, quase a sala inteira adoece.
**Interação "Por que vacina todo ano?":** um vírus da gripe com as espículas H e N em âmbar. A cada "ano" (botão), algumas espículas mudam levemente de forma e os anticorpos do ano anterior (em forma de Y) encaixam cada vez pior. Um botão "vacina nova" ajusta os anticorpos à forma atual. Um segundo botão, "troca de segmentos", junta um vírus de ave e um humano numa célula de porco e mostra o vírus "novo", contra o qual nenhum anticorpo encaixa: "risco de pandemia".

**Cartão "No ENEM":**
> **Gripe:** vírus de RNA que muda muito, por isso a **vacina é anual**; pandemias surgem quando vírus diferentes trocam pedaços de RNA. **Covid-19:** transmissão por **aerossóis**; as vacinas de **RNAm** não mudam o DNA; as **variantes** são exemplo de mutação e seleção natural acontecendo na nossa frente. **Sarampo:** altíssima transmissão pelo ar, prevenido pela **tríplice viral**; a volta da doença está ligada à **queda da cobertura vacinal**. As questões costumam usar gráficos de casos e de vacinação.

### D4 `#doencas/hepatites-hpv`: "Hepatites virais e HPV"
- **Subtítulo:** "fígado, câncer e as vacinas que os previnem"

**Texto do aluno:**
> **Hepatite** é inflamação do **fígado**, e vários vírus diferentes podem causá-la. A **hepatite A** (vírus de RNA, **sem envelope**) passa pela via **fecal-oral**: água e alimentos contaminados com fezes. É mais comum onde falta **saneamento básico**, costuma ser aguda e curar sozinha, e tem vacina no calendário infantil. A **hepatite B** (vírus de **DNA**, com envelope) passa por **sangue**, **relação sexual** e **da mãe para o bebê**. Pode virar uma infecção **crônica** e, depois de anos, causar **cirrose** e **câncer de fígado**. A **vacina** contra a hepatite B é dada **logo ao nascer** e faz parte do calendário em várias doses. A **hepatite C** (vírus de RNA) passa principalmente por **sangue** (seringas compartilhadas, objetos cortantes, procedimentos sem material esterilizado; antes da testagem do sangue doado, também por transfusão). Não tem vacina, mas hoje tem **cura** com remédios antivirais em mais de 95% dos casos. Muitas pessoas com hepatite B ou C **não têm sintomas** por anos; por isso a testagem é importante. (Existem também as hepatites D, que só ocorre em quem tem a B, e E, fecal-oral.)
>
> O **HPV** (papilomavírus humano) é um vírus de **DNA**, **sem envelope**, com mais de 200 tipos. É a **infecção sexualmente transmissível mais comum**: passa pelo contato de pele e mucosa nas relações sexuais, e o preservativo **reduz, mas não elimina** o risco, porque o vírus pode estar em regiões que ele não cobre. A maioria das infecções some sozinha. Alguns tipos (como o **6** e o **11**) causam **verrugas genitais**; outros (sobretudo o **16** e o **18**) podem, depois de anos de infecção persistente, causar **câncer do colo do útero**, além de câncer de ânus, pênis e garganta. A **vacina** contra o HPV, gratuita no SUS para **meninas e meninos** numa faixa de idade antes do início da vida sexual, protege contra esses tipos. É uma **vacina contra o câncer**. O exame **preventivo** (citopatológico, o "Papanicolau", e o teste de DNA do HPV) encontra lesões antes que virem câncer.

**Quadro (Ministério da Saúde):**

| Vírus | Material genético | Transmissão | Prevenção principal |
|---|---|---|---|
| Hepatite A | RNA, sem envelope | fecal-oral (água e alimentos) | saneamento, higiene, vacina |
| Hepatite B | DNA, com envelope | sangue, sexual, mãe para filho | vacina (ao nascer), preservativo |
| Hepatite C | RNA, com envelope | sangue | não compartilhar seringas e objetos cortantes; testagem e tratamento (tem cura) |
| HPV | DNA, sem envelope | sexual (pele e mucosa) | vacina, preservativo, exame preventivo |

**Animação:** um fígado esquemático, em três versões: saudável, com hepatite aguda (inchado e avermelhado) e com cirrose (endurecido, com nódulos). Uma linha do tempo mostra a hepatite B crônica avançando ao longo de décadas, com o botão "vacinada ao nascer" que impede tudo. Para o HPV: o colo do útero em corte, com células que mudam aos poucos (lesão, lesão avançada, câncer) ao longo de 10 a 20 anos, e duas barreiras desenhadas: "vacina" (antes da infecção) e "exame preventivo" (pega a lesão no começo).
**Interação "Qual via?":** cartões de situações (comer salada lavada com água contaminada; compartilhar alicate de unha; nascer de mãe com hepatite B; relação sexual sem preservativo; transfusão com sangue testado). O aluno associa cada uma ao vírus (A, B, C, HPV) e à via de transmissão, com a cor da via (marrom fecal-oral, vermelho sangue e sexual).

**Cartão "No ENEM":**
> As hepatites se separam pela **via de transmissão**: a **A** é **fecal-oral** e está ligada a **saneamento**; a **B** e a **C** passam por **sangue** (a B também por via sexual e da mãe para o filho). A **B** tem vacina, a **C** tem cura. O **HPV** aparece ligado ao **câncer do colo do útero** e à vacinação de meninas **e meninos**. Pegadinha: vacinar meninos não é "à toa": eles transmitem o vírus e também podem ter câncer pelo HPV.

---

## Seção: Prevenção (`prevencao`)

### P1 `#prevencao/vacinas`: "Vacina, soro e antivirais"
- **Subtítulo:** "ensinar o corpo, emprestar anticorpos ou bloquear o vírus"

**Texto do aluno:**
> Uma **vacina** apresenta ao sistema imune o vírus enfraquecido, morto, ou só um pedaço dele, sem causar a doença. O corpo produz **anticorpos** e células de **memória**, e, quando encontra o vírus de verdade, responde rápido e forte. É uma **imunização ativa** (o próprio corpo produz a defesa), **preventiva** e **duradoura**, mas que leva alguns dias ou semanas para fazer efeito. Os principais tipos são: **vírus atenuado** (vivo, enfraquecido: tríplice viral, febre amarela, catapora); **vírus inativado** (morto: poliomielite injetável, CoronaVac, gripe); **subunidade** ou **partícula semelhante ao vírus** (só proteínas do vírus, sem ácido nucleico: hepatite B e HPV); **vetor viral** e **RNA mensageiro** (o corpo recebe a "receita" de uma proteína do vírus e a produz por pouco tempo). O **soro** é diferente: contém **anticorpos prontos**, produzidos em outro animal (em geral cavalos) ou em pessoas. É uma **imunização passiva**: age **na hora**, mas **dura pouco** e não deixa memória. Por isso é usado para **tratar** ou em emergências, como o **soro antirrábico** depois da mordida de um animal com suspeita de raiva, junto com a vacina.
>
> Quando muita gente se vacina, o vírus encontra poucas pessoas para infectar e para de circular, protegendo também quem não pode tomar a vacina (bebês muito pequenos, pessoas com imunidade baixa): é a **imunidade coletiva** (ou "de rebanho"). Foi assim que a **varíola** foi **erradicada** do mundo (a OMS declarou em **1980**) e que o Brasil não tem casos de **poliomielite** desde **1989**. A história das vacinas no Brasil passa pela **Revolta da Vacina** (1904), no Rio de Janeiro, contra a vacinação obrigatória contra a varíola liderada por **Oswaldo Cruz**. Contra vírus já instalados, **antibióticos não funcionam**: eles atacam parede celular e ribossomos de bactérias, estruturas que o vírus não tem, e usá-los sem necessidade seleciona **bactérias resistentes**. Para alguns vírus existem **antivirais**, que bloqueiam etapas da multiplicação viral: aciclovir (herpes), oseltamivir (gripe), os antirretrovirais (HIV) e os remédios que curam a hepatite C.

**Quadro (Amabis; Lopes; Ministério da Saúde):**

| | Vacina | Soro |
|---|---|---|
| O que contém | antígeno (vírus atenuado, inativado ou parte dele) | anticorpos prontos |
| Tipo de imunização | ativa | passiva |
| Quando age | depois de dias ou semanas | imediatamente |
| Duração | longa (memória) | curta (semanas) |
| Uso | prevenção | tratamento ou emergência |
| Exemplo com vírus | tríplice viral, febre amarela, HPV | soro antirrábico |

**Animação:** dois gráficos lado a lado de "quantidade de anticorpos" ao longo do tempo. No da **vacina**: primeira dose, subida lenta e pequena; reforço ou contato com o vírus, subida rápida e alta (a **resposta secundária**, graças à memória). No do **soro**: subida imediata no momento da aplicação, e queda em poucas semanas, sem memória. Cada curva com sua cor e um marcador "aqui chega o vírus".
**Interação "Vacina ou soro?":** casos para o aluno decidir: criança que vai completar o calendário (vacina); pessoa mordida por um morcego (soro e vacina, e a tela explica por que os dois); viajante que vai para área de febre amarela daqui a um mês (vacina, com pelo menos 10 dias de antecedência); adolescente de 10 anos (vacina contra HPV). Depois, "Antibiótico serve?": gripe (não), covid-19 (não), dengue (não), pneumonia bacteriana depois da gripe (sim, porque aí a doença é causada por bactéria).
**Faixa "Imunidade coletiva":** uma rede de 100 bonecos. O aluno arrasta um controle de cobertura vacinal (0% a 100%) e solta um caso de sarampo. Com cobertura baixa, o vírus se espalha pela rede; acima de cerca de 95% (meta para o sarampo), a cadeia se interrompe e até os não vacinados ficam protegidos.

**Cartão "No ENEM":**
> **Vacina** = **antígeno**, imunização **ativa**, **preventiva**, com **memória**. **Soro** = **anticorpos prontos**, imunização **passiva**, efeito **imediato** e **curto**, usado para **tratar**. Esta é uma das comparações mais cobradas da Biologia. Também caem: **imunidade coletiva**, erradicação da **varíola**, **Revolta da Vacina** e o erro de usar **antibiótico contra vírus**. Gráficos de anticorpos com resposta primária e secundária são frequentes.

### P2 `#prevencao/transmissao`: "Cada via, sua prevenção"
- **Subtítulo:** "ar, mosquito, sangue e sexo, água e alimento"

**Texto do aluno:**
> Para prevenir uma virose, a primeira pergunta é: **como o vírus chega até a pessoa?** Cada **via de transmissão** pede medidas diferentes, e a vacina, quando existe, entra em todas.
> 1. **Respiratória** (gripe, covid-19, sarampo, catapora, caxumba, rubéola): vacinação, **ambientes ventilados**, máscara quando indicada, cobrir a boca e o nariz ao tossir e espirrar com o braço, lavar as mãos e ficar em casa quando doente.
> 2. **Vetorial** (dengue, zika, chikungunya, febre amarela): **eliminar criadouros de água parada**, telas, repelente, roupas que cobrem o corpo, vacina (febre amarela e dengue); métodos novos como os mosquitos com *Wolbachia*.
> 3. **Sangue e sexual** (HIV, hepatites B e C, HPV, herpes genital): **preservativo**, não compartilhar seringas, agulhas e objetos cortantes, material esterilizado ou descartável em hospitais, estúdios de tatuagem e manicures, **testagem** do sangue doado, testagem e tratamento, PrEP e PEP para o HIV, vacina (hepatite B e HPV), pré-natal para evitar a transmissão da mãe para o bebê.
> 4. **Fecal-oral** (hepatite A, poliomielite, rotavírus, norovírus): **saneamento básico**, **água tratada** ou fervida, lavar as mãos depois de usar o banheiro e antes de comer, lavar bem os alimentos crus, vacina (hepatite A, poliomielite, rotavírus).
> 5. **Mordida de animal** (raiva): vacinar cães e gatos, não mexer em morcegos, e, depois de uma mordida, lavar o ferimento com água e sabão e procurar atendimento para vacina e, se indicado, soro.
>
> Algumas medidas valem para quase tudo: **vacinação em dia**, **água limpa e esgoto tratado** e **informação**. Muitas viroses são também problemas **sociais**: a dengue cresce onde falta coleta de lixo e água encanada regular (o que obriga a guardar água em recipientes), e a hepatite A, onde falta esgoto. Por isso a prevenção depende tanto da atitude de cada um quanto de **políticas públicas**.

**Animação:** um mapa de bairro com quatro "portas" coloridas, uma por via (azul respiratória, verde-limão vetor, vermelho sangue e sexual, marrom fecal-oral). Ao tocar numa porta, os vírus daquela via aparecem entrando, e cada medida de prevenção aparece como uma "tranca" que fecha a porta. A vacina aparece como uma tranca que serve em várias portas.
**Interação "Monte o plano":** o aluno recebe uma virose sorteada (uma das viroses citadas no módulo) e escolhe, numa lista de 12 medidas, as três mais eficazes para ela. A tela corrige e explica (por exemplo, para a hepatite A: saneamento, água tratada e vacina; "máscara" aparece como escolha errada, com a explicação "a via é fecal-oral").
**Quadro-resumo final do módulo:** uma tabela com todas as viroses do módulo em linhas e as colunas "vírus de DNA ou RNA", "via", "vacina no SUS" e "tela do módulo", para revisão rápida antes da prova.

**Cartão "No ENEM":**
> O ENEM gosta de questões que dão uma doença e pedem a **medida de prevenção mais adequada**: o segredo é identificar primeiro a **via de transmissão**. Mosquito: **criadouros**. Ar: **vacina e ventilação**. Sangue e sexo: **preservativo e seringas**. Água e alimento: **saneamento**. Pegadinhas: usar antibiótico "para prevenir" virose; achar que mosquiteiro protege contra o *Aedes* (ele pica **de dia**; a tela e o repelente ajudam mais que o mosquiteiro só à noite); ou propor saneamento contra uma doença transmitida pelo ar.

---

## Notas para a implementação
- **Nomes científicos:** *Aedes aegypti*, *Aedes albopictus*, *Haemagogus*, *Sabethes*, *Escherichia coli*, *Corynebacterium diphtheriae*, *Vibrio cholerae*, *Wolbachia*, *Pneumocystis* sempre em itálico, inclusive nos botões e rótulos. Siglas de vírus (HIV, HPV, SARS-CoV-2, DENV) e nomes de doenças ficam retos.
- **Setas:** nas animações, as setas são desenho. No texto da tela, escrever "de RNA para DNA", "da mãe para o filho" etc., sem o caractere de seta.
- **Desenhos:** todos próprios e **esquemáticos**, fora de escala, com o rodapé "desenho esquemático, fora de escala" em E1, E2, F1, F2, R1 e R2. O fago T4 reaproveita o modelo do módulo Célula (`../celula/index.html#celula_fago`). Não usar fotos de pacientes, lesões de pele nem de órgãos genitais; em D4, o colo do útero é um corte esquemático.
- **Números aproximados:** tamanhos (E1, N1), tempo e número de fagos liberados (F1) e as médias de contágio (D3) são ordens de grandeza; a tela deve dizer "cerca de" ou "média aproximada".
- **Calendário de vacinação (pedido do Sapien):** idades, número de doses e público de cada vacina mudam. A tela não deve fixar idades no texto do aluno; deve ter um link "calendário vigente" para a página do Programa Nacional de Imunizações. O quadro de D1 e o de D4 dizem só "sim" ou "não" para vacina no SUS. Conferir a lista na véspera do lançamento.
- **Linguagem sobre HIV:** "pessoa vivendo com HIV", nunca "aidético" ou "grupo de risco" (usar "situações de maior exposição"). A interação de D2 combate mitos; o tom é informativo, sem medo.
- **Fichas de pacientes (D1):** fictícias e rotuladas assim; não usar nomes reais.
- **Links para fora do módulo:** Morfofisiologia (`#teoria/virus`, em N1, e pedir link de volta), Célula (`#celula_fago`, em E2 e F1), Taxonomia (`#sistemas/reinos`, em N1), Biologia Molecular (dogma central e PCR, em R2), Embriologia (teratógenos e placenta, em D1, para o zika: `../embriologia/index.html`) e, quando existirem, os módulos de seres vivos (item 9, mosquitos e bactérias) e de fisiologia humana (sistema imune).
- **Fora do escopo:** classificação de Baltimore e famílias de vírus (ICTV), detalhes de cada sintoma e tratamento, esquemas de dose, mecanismo molecular da integração do fago λ, vírus oncogênicos além do HPV e da hepatite B, terapia gênica com vetores virais, e a origem evolutiva dos vírus.

---

## Revisão cruzada: 🧬 Sapien (2026-11-15)

Reli o roteiro do 🔬 Taxon inteiro, como segundo professor. Corrigi direto no texto acima:

1. **E1, "DNA ou RNA, nunca os dois":** o Taxon tinha escrito "nunca os dois" sem qualificar. Alguns vírus (como o citomegalovírus e o mimivírus) carregam moléculas de RNA da célula dentro da partícula. Ficou "DNA ou RNA, nunca os dois **como material genético**", que é o que os livros querem dizer.
2. **E1, sabão e álcool:** o texto dizia que sabão e álcool "matam todos os vírus". Vírus sem envelope (norovírus, hepatite A, rotavírus) resistem bem ao álcool 70%. Acrescentei a frase sobre os vírus sem envelope. "Matar" virou "inativar", para não contradizer N1.
3. **F1, Hershey e Chase:** o ano estava 1953 (o ano da dupla hélice). O experimento é de **1952**. Corrigido.
4. **F2, conversão lisogênica:** o texto citava também a toxina do tétano. A tetanospasmina é codificada num **plasmídeo** da bactéria, não num fago. Tirei o tétano; ficaram difteria e cólera, que são exemplos seguros.
5. **R1, herpes e lisogenia:** o Taxon comparava a latência do herpes com o prófago "do mesmo jeito". O DNA do herpes fica **separado** (epissomo) no núcleo, sem se integrar. Mantive a comparação, mas com a ressalva no texto, porque o aluno vai encontrar a palavra "integra" no HIV e não pode generalizar.
6. **R2, SARS-CoV-2:** acrescentei a frase "não é retrovírus e não entra no núcleo" e, em D3, "a vacina de RNAm não altera o DNA". É uma confusão comum e boato frequente; vale deixar explícito nas duas telas.
7. **D1, febre amarela urbana:** o Taxon tinha escrito "erradicada". O correto é "sem registro de **ciclo urbano** desde 1942"; o vírus circula no ciclo silvestre, com surtos grandes em 2016-2018. Acrescentei também que os macacos são **sentinelas**, não transmissores, porque já houve matança de macacos por desinformação.
8. **D1, dengue grave:** "segunda infecção sempre causa dengue grave" virou "aumenta o risco de dengue grave". A maioria das reinfecções não é grave.
9. **D2, aids e CD4:** o texto tinha só "linfócitos baixos". Pus o limite de **200 células por mm³**, que é o critério usado, e a frase "ter HIV não é o mesmo que ter aids". Troquei "grupos de risco" por "maior chance de exposição", como orienta o Ministério da Saúde.
10. **D3, gripe e resfriado:** acrescentei que são doenças diferentes, causadas por vírus diferentes; é pergunta frequente de aluno.
11. **P1, vacina da poliomielite:** o exemplo de vírus atenuado era a "gotinha" (VOP). O Brasil substituiu a VOP pela vacina **injetável inativada** (VIP) no calendário em 2024. Tirei a gotinha da lista de atenuadas e pus a pólio na de **inativadas**.
12. **P2, mosquiteiro:** acrescentei a pegadinha do *Aedes* que pica **de dia**.

Conferi e mantive: Ivanovsky (1892), Beijerinck (1898), Stanley (1935), microscópio eletrônico e o vírus do mosaico (1939); Temin e Baltimore (1970, Nobel de 1975); os 8 segmentos do influenza e os subtipos H e N; proteína S e ECA2; CD4 no HIV; tamanho de 20 a 300 nm e mimivírus de cerca de 750 nm; 100 a 200 fagos por lise em cerca de meia hora; HPV 6 e 11 (verrugas) e 16 e 18 (câncer); hepatite B como vírus de DNA e a vacina ao nascer; cura da hepatite C acima de 95%; pandemia de covid-19 (março de 2020) e fim da emergência (maio de 2023); varíola erradicada (1980); pólio sem casos no Brasil desde 1989; Revolta da Vacina (1904); TARV no SUS desde 1996; PEP em até 72 horas; "indetectável = intransmissível" com carga viral indetectável por pelo menos seis meses; sarampo com R0 de 12 a 18.

**Para conferir antes de publicar (dados que mudam):**
- **Vacinas da dengue:** o SUS usa a Qdenga desde fevereiro de 2024, para uma faixa etária restrita; a vacina de dose única do Butantan foi aprovada pela Anvisa em 2025, e a incorporação ao SUS e o público-alvo estavam sendo definidos. Por isso o texto não fixa idades. Conferir a situação na data do lançamento.
- **Sarampo:** o Brasil foi recertificado como livre do sarampo em novembro de 2024. Com os surtos nas Américas em 2025 e 2026, o status pode mudar; conferir antes de publicar a frase "voltou a ser certificado".
- **HPV:** o esquema passou a ser de dose única em 2024, com ampliação temporária de faixa etária. O texto fala só em "faixa de idade antes do início da vida sexual"; o link do calendário resolve o resto.
- **Chikungunya:** existe vacina aprovada pela Anvisa (2025), mas ela não está no calendário do SUS e teve restrições de uso em idosos em outros países. O quadro diz "não (ainda fora do calendário)"; conferir.
- **PrEP:** há PrEP injetável de longa duração aprovada em outros países; no Brasil, a oferta no SUS ainda é sobretudo por comprimido. O texto fala de PrEP de forma genérica, de propósito.

**Para o 🧭 Atlas decidir (não muda a ciência):**
- São 13 tópicos. Se precisar enxugar, F1 e F2 viram um tópico só ("Ciclos do bacteriófago"), com o botão "lítico ou lisogênico" como interação; e P2 pode virar só o quadro-resumo final, dentro de P1.
- As telas que mais rendem na prova são **D1** (arboviroses e criadouros), **P1** (vacina e soro) e **F1 e F2** (ciclos). Sugiro começar por elas; F1 e F2 aproveitam o fago 3D que já existe.
- Os cartões "No ENEM" descrevem o tipo de questão, sem citar ano nem item, como na Taxonomia, porque não conferimos as provas do INEP uma a uma.
- D1 a D4 lidam com saúde pública real. Sugiro que a tela de créditos diga "conteúdo educativo, não substitui orientação médica" e aponte para o Disque Saúde 136.
