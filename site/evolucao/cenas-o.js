/* LAB, módulo Origem da vida e evolução. Cenas da parte 1: origem da vida (O1 a O3), ideias evolutivas (I1, I2) e evidências (V1 a V3).
   Código da equipe (Aurelius). Textos: roteiro docs/revisao-biologia/evolucao-roteiro-parte1.md (parágrafos e cartões "No ENEM" entre as marcas TXT).
   Direção de arte: docs/visual/evolucao-ecologia.md (uma cor-âncora por seção; desenhos esquemáticos próprios, sem retrato). */
'use strict';
{
  const NOTA = 'Desenho esquemático, fora de escala', SIM = 'Modelo simplificado; números escolhidos para mostrar o efeito', EDU = 'Conteúdo educativo, não substitui orientação médica.';
  const TXT = {};
  //TXT-INICIO
  TXT.O1 = {
    d: `<p><i>Ninguém viu a vida começar; o que temos são experimentos, rochas antigas e hipóteses que podem ser testadas. A régua do tempo vai da formação da Terra, cerca de 4,6 bilhões de anos atrás, aos primeiros sinais de vida, cerca de 3,8 a 3,5 bilhões de anos atrás, e a hoje.</i></p>
<p>Por muito tempo se aceitou a <b>abiogênese</b>, ou <b>geração espontânea</b>: a ideia de que seres vivos surgem da matéria sem vida, guiados por um "princípio ativo". Aristóteles defendia isso, e no século XVII Van Helmont deu uma "receita" para obter camundongos com camisa suja e grãos de trigo. A ideia oposta é a <b>biogênese</b>: todo ser vivo vem de outro ser vivo.</p>
<p>Em 1668, <b>Francesco Redi</b> colocou carne em frascos abertos e em frascos cobertos com gaze. Só a carne dos frascos abertos teve larvas, porque as moscas pousavam e punham ovos. Redi mostrou que larvas vêm de ovos, mas os defensores da abiogênese passaram a apostar nos <b>microrganismos</b>, que acabavam de ser vistos ao microscópio. Por volta de 1745, <b>John Needham</b> ferveu caldos por pouco tempo, fechou os frascos e dias depois eles estavam cheios de micróbios. Para ele, era a prova da geração espontânea.</p>
<p>Cerca de vinte anos depois, <b>Lazzaro Spallanzani</b> ferveu os caldos por muito mais tempo e <b>lacrou</b> os frascos derretendo o vidro: nada cresceu. Needham respondeu que a fervura longa destruía o "princípio ativo" do ar. Quem encerrou a discussão foi <b>Louis Pasteur</b>, por volta de 1860, com os frascos de <b>pescoço de cisne</b>. O gargalo curvo deixa o ar entrar, mas a poeira com micróbios fica presa na curva. O caldo fervido continua estéril por muito tempo. Quando o pescoço é quebrado, ou o caldo encosta na curva, os micróbios aparecem. Assim, o "princípio ativo" do ar estava presente e mesmo assim nada surgiu. A <b>pasteurização</b> e a esterilização de materiais vêm dessa mesma ideia.</p>
<p>Atenção: a biogênese vale para o mundo de hoje. Ela não responde como surgiu o <b>primeiro</b> ser vivo, que é o assunto do <a href="#origem/hipoteses">próximo tópico</a>.</p>`,
    enem: `As questões trazem a descrição de um experimento e perguntam o que ele <b>testa</b> ou qual era o <b>grupo controle</b>. Lembre: Redi derrubou a geração espontânea para seres grandes; Spallanzani lacrou e ferveu mais; Pasteur manteve o ar entrando e mesmo assim nada cresceu, o que derrubou o argumento do "princípio ativo". Ligações comuns com o dia a dia: pasteurização do leite, autoclave, conservas.`
  };
  TXT.O2 = {
    d: `<p>A Terra se formou há cerca de <b>4,6 bilhões de anos</b>. Os indícios mais antigos de vida são marcas químicas em rochas de cerca de <b>3,8 a 3,7 bilhões de anos</b>, ainda debatidas, e fósseis de <b>estromatólitos</b> (camadas de rochas feitas por comunidades de bactérias) de cerca de <b>3,5 bilhões de anos</b>. A ideia central de hoje é a <b>evolução química</b>: moléculas simples formaram moléculas orgânicas, que se organizaram até surgir algo capaz de se copiar.</p>
<p>Nos anos 1920, <b>Aleksandr Oparin</b> e <b>J. B. S. Haldane</b> propuseram, cada um por conta própria, que a atmosfera primitiva não tinha gás oxigênio e era rica em <b>metano (CH₄)</b>, <b>amônia (NH₃)</b>, <b>hidrogênio (H₂)</b> e <b>vapor de água</b>. Com a energia de raios, vulcões e radiação ultravioleta, essas moléculas formariam compostos orgânicos que se acumulariam nos mares, a chamada "<b>sopa primitiva</b>". Oparin sugeriu que gotículas chamadas <b>coacervados</b>, cercadas por uma película, isolariam reações do meio.</p>
<p>Em 1953, <b>Stanley Miller</b>, orientado por <b>Harold Urey</b>, testou a ideia: um aparelho fechado com esses gases, água fervendo e <b>descargas elétricas</b> simulando raios. Em cerca de uma semana apareceram <b>aminoácidos</b>, como a glicina e a alanina. O experimento mostrou que moléculas da vida podem se formar sem seres vivos. Hoje se considera que a atmosfera primitiva tinha mais <b>gás carbônico (CO₂)</b> e <b>nitrogênio (N₂)</b> e era menos rica em metano e amônia; com essa mistura também se formam compostos orgânicos, em menor quantidade. Em 2008, frascos guardados de Miller foram reanalisados com técnicas novas e mostraram mais de 20 aminoácidos. Meteoritos e amostras de asteroides, como as do asteroide <b>Bennu</b> trazidas pela missão OSIRIS-REx, também têm aminoácidos e bases nitrogenadas, o que mostra que essa química também acontece no espaço.</p>
<p>Falta explicar como surgiu a <b>cópia</b>. Hoje sabemos que o DNA guarda a informação e as proteínas fazem o trabalho, mas um precisa do outro. A hipótese do <b>mundo do RNA</b> resolve isso: o RNA guarda informação <b>e</b> também pode agir como catalisador (as <b>ribozimas</b>, descobertas nos anos 1980). Um RNA capaz de se copiar teria vindo antes do DNA e das proteínas. Uma pista forte: no <b>ribossomo</b> de todos os seres vivos, quem une os aminoácidos é o RNA ribossômico (ver <a href="../biologia-molecular/index.html#na/nucleotideo">Biologia molecular</a>).</p>
<p>Outras hipóteses dividem a atenção dos cientistas. As <b>fontes hidrotermais</b> do fundo do mar, descobertas em 1977, oferecem calor, minerais e diferenças de acidez que podem ter dado energia às primeiras reações, longe da radiação ultravioleta. A <b>panspermia</b> propõe que moléculas ou até seres simples chegaram à Terra em meteoritos; ela não explica a origem da vida, só a desloca para outro lugar. Nenhuma dessas hipóteses está comprovada, e elas não se excluem.</p>`,
    enem: `O experimento de Miller-Urey aparece com o desenho do aparelho. Saiba dizer: o que ele simulava (atmosfera primitiva e raios), o que produziu (aminoácidos) e o que <b>não</b> provou (não criou vida, nem célula). Outra pegadinha: a atmosfera primitiva <b>não tinha gás oxigênio livre</b>. Panspermia aparece como hipótese que não resolve a origem.`
  };
  TXT.O3 = {
    d: `<p>Uma membrana de <b>lipídios</b> se forma sozinha na água, como as bolhas de sabão, e pode ter envolvido moléculas que se copiavam: assim teria surgido a primeira célula, um <b>procarionte</b> simples (ver <a href="../microrganismos/index.html#monera/celula">Microrganismos, a célula procariótica</a>). Todos os seres vivos de hoje descendem de um mesmo ancestral, chamado pelos cientistas de <b>LUCA</b> (o último ancestral comum universal), porque todos usam DNA, o mesmo código genético e ribossomos parecidos (ver <a href="../taxonomia/index.html#sistemas/dominios">os três domínios</a>).</p>
<p>Como os primeiros seres obtinham alimento é discutido. Na <b>hipótese heterotrófica</b>, a mais citada nos livros, os primeiros seres comiam as moléculas orgânicas da "sopa" e obtinham energia por <b>fermentação</b>, sem gás oxigênio. Quando a sopa foi acabando, levaram vantagem os que produziam o próprio alimento: os <b>fotossintetizantes</b>. Na <b>hipótese autotrófica</b>, os primeiros seres já produziam sua matéria orgânica por <b>quimiossíntese</b>, com a energia de substâncias como o gás sulfídrico e o hidrogênio das fontes hidrotermais. Estudos que comparam genes dos seres atuais para reconstruir o LUCA sugerem que ele vivia em ambiente quente e usava hidrogênio, o que dá força à hipótese autotrófica, mas as duas ainda são estudadas.</p>
<p>As <b>cianobactérias</b> faziam fotossíntese liberando <b>gás oxigênio</b>. O O₂ foi se acumulando e, há cerca de <b>2,4 bilhões de anos</b>, aconteceu o <b>Grande Evento de Oxidação</b>: o gás oxigênio passou a existir em quantidade na atmosfera. Para muitos seres foi um veneno; para outros, uma oportunidade, a <b>respiração aeróbia</b>, que libera muito mais energia (ver <a href="../bioenergetica/index.html#resp/geral">Bioenergética</a>). O O₂ também formou a <b>camada de ozônio</b>, que filtra o ultravioleta e depois permitiu a vida fora da água.</p>
<p>A célula <b>eucariótica</b> surgiu há cerca de 2 bilhões de anos, e os fósseis seguros mais antigos têm cerca de 1,6 bilhão de anos. A <b>teoria endossimbiótica</b>, defendida por <b>Lynn Margulis</b> a partir de 1967, explica a origem de duas organelas: uma célula hospedeira, aparentada com as <b>arqueias</b> segundo estudos recentes de DNA, englobou bactérias aeróbias, que não foram digeridas e viraram as <b>mitocôndrias</b>; mais tarde, uma linhagem englobou cianobactérias, que viraram os <b>cloroplastos</b>. As provas: mitocôndrias e cloroplastos têm <b>DNA próprio e circular</b>, como o das bactérias, <b>ribossomos parecidos com os bacterianos</b>, <b>duas membranas</b> e se dividem por conta própria, de modo parecido com a divisão das bactérias (ver <a href="../celula/index.html">Célula</a>). As dobras da membrana que formaram o núcleo e o retículo têm outra explicação, a <b>invaginação</b> da membrana.</p>`,
    enem: `Caem as <b>provas da endossimbiose</b> (DNA próprio, ribossomos parecidos com os de bactérias, dupla membrana) e a ordem clássica da hipótese heterotrófica: <b>fermentação</b> primeiro, depois <b>fotossíntese</b>, depois <b>respiração aeróbia</b>, porque a respiração precisa do O₂ que a fotossíntese liberou. Também aparece a relação entre a fotossíntese das cianobactérias e a formação da camada de ozônio.`
  };
  TXT.I1 = {
    d: `<p><i>Antes de Darwin, a maioria achava que as espécies não mudavam; a discussão era sobre como explicar os fósseis.</i></p>
<p>O <b>fixismo</b> dizia que as espécies foram criadas como são e <b>não mudam</b>. Era a visão da maioria dos naturalistas até o século XVIII, inclusive de <b>Lineu</b> no começo da carreira (ver <a href="../taxonomia/index.html">Taxonomia</a>). Os fósseis de animais que não existem mais foram explicados por <b>Georges Cuvier</b> com o <b>catastrofismo</b>: grandes catástrofes teriam extinguido faunas inteiras, sem que as espécies se transformassem.</p>
<p>Em 1809, <b>Jean-Baptiste de Lamarck</b> publicou a primeira teoria completa de <b>evolução</b>: as espécies mudam com o tempo e as formas mais complexas vêm de formas mais simples. Isso foi um grande avanço. Para explicar como a mudança acontece, ele propôs duas leis. A <b>lei do uso e desuso</b>: o órgão muito usado se desenvolve e o pouco usado atrofia. A <b>lei da herança dos caracteres adquiridos</b>: o que o indivíduo ganha ou perde durante a vida passa para os filhos. No exemplo clássico, as girafas teriam esticado o pescoço para alcançar folhas altas, e o pescoço um pouco mais longo passaria para a geração seguinte.</p>
<p>A primeira lei vale em parte para o <b>indivíduo</b>: o músculo exercitado cresce. O problema é a segunda. O que muda no corpo durante a vida <b>não muda o DNA das células reprodutivas</b>, então não é herdado. O filho de um fisiculturista não nasce musculoso. <b>August Weismann</b>, nos anos 1880, cortou a cauda de camundongos por várias gerações e os filhotes continuavam nascendo com cauda; ele propôs a separação entre a linhagem das células reprodutivas e o resto do corpo. Hoje se sabe que certas marcas químicas no DNA (a <b>epigenética</b>) às vezes passam para algumas gerações, mas isso não transforma espécies como Lamarck imaginava. Lamarck errou o mecanismo, mas acertou que as espécies mudam.</p>`,
    enem: `É o padrão de questão mais repetido do tema: um texto ou uma charge diz que "o animal desenvolveu a característica <b>para</b> se adaptar" ou "<b>por</b> usar muito o órgão" e pergunta a qual teoria corresponde. Uso e desuso e herança de caracteres adquiridos é <b>Lamarck</b>. Variação já existente e sobrevivência diferencial é <b>Darwin</b>. Desconfie de toda alternativa em que o ambiente "provoca" a característica de que o ser precisa.`
  };
  TXT.I2 = {
    d: `<p><b>Charles Darwin</b> viajou no navio <b>Beagle</b> de 1831 a 1836, ao redor do mundo e com muito tempo na América do Sul, inclusive no Brasil. Viu fósseis de animais gigantes parecidos com os tatus e preguiças de hoje e, nas <b>ilhas Galápagos</b>, espécies parecidas, mas diferentes de ilha para ilha (tentilhões, tartarugas, sabiás). Leu <b>Charles Lyell</b>, que mostrava uma Terra muito antiga, moldada por mudanças lentas, e <b>Thomas Malthus</b>, que dizia que as populações crescem mais rápido que os alimentos. Em 1858, <b>Alfred Russel Wallace</b>, estudando a fauna das ilhas do sudeste da Ásia, chegou à mesma ideia e mandou uma carta a Darwin. Os trabalhos dos dois foram apresentados juntos em Londres em 1858, e em 1859 Darwin publicou <i>A origem das espécies</i>.</p>
<p>A <b>seleção natural</b> se apoia em fatos simples. Os indivíduos de uma espécie <b>variam</b> entre si, e parte dessa variação é <b>herdada</b>. Nascem <b>mais</b> filhotes do que o ambiente consegue sustentar, então há <b>disputa</b> por alimento, abrigo e parceiros. Quem tem características mais favoráveis naquele ambiente sobrevive e se <b>reproduz mais</b>, deixando mais descendentes com essas características. Ao longo de muitas gerações, a população muda. É o que se chama de <b>adaptação</b>. A seleção não cria a variação: ela <b>favorece</b> algumas das variações que já existem. E não há meta: o que é vantagem num ambiente pode ser desvantagem em outro.</p>
<p>A segunda grande ideia é a <b>ancestralidade comum</b>: todas as espécies descendem de ancestrais comuns, formando uma <b>árvore da vida</b> que se ramifica. Darwin desenhou essa árvore em um caderno em 1837. O ponto fraco da teoria era a <b>herança</b>: Darwin não sabia de onde vinha a variação nem como ela passava aos filhos. As leis de Mendel só foram redescobertas em 1900. A união da seleção natural com a genética formou a <b>teoria sintética da evolução</b>, que está em <a href="#sintetica/variacao">De onde vem a variação</a>.</p>`,
    enem: `Saiba os quatro pontos: <b>variação</b>, <b>herança</b>, <b>excesso de descendentes</b> e <b>reprodução diferencial</b>. A seleção <b>não cria</b> a característica e <b>não age no indivíduo para melhorá-lo</b>: ela muda a frequência das características na <b>população</b>. Se a questão perguntar o que Darwin <b>não</b> conseguia explicar, a resposta é a <b>origem da variação e a herança</b>, resolvidas depois pela genética (ver <a href="../genetica/index.html#populacoes/fatores">Genética, fatores evolutivos</a>).`
  };
  TXT.V1 = {
    d: `<p><i>A evolução é aceita porque evidências independentes, de áreas diferentes, contam a mesma história: fósseis, comparação de corpos e embriões, moléculas e evolução observada hoje.</i></p>
<p><b>Fóssil</b> é qualquer resto ou vestígio de um ser vivo preservado em rocha ou em outro material: ossos, conchas, troncos, impressões de folhas, pegadas, ovos, fezes e até insetos presos em <b>âmbar</b>. A maioria se forma quando o ser é coberto rápido por <b>sedimentos</b> (areia, lama) e os minerais da água substituem aos poucos a matéria original. Por isso, a maior parte dos seres que já viveram não deixou fóssil.</p>
<p>As rochas <b>sedimentares</b> se formam em camadas. Sem perturbações, a camada de baixo é <b>mais antiga</b> que a de cima: é a <b>datação relativa</b>, que diz a <b>ordem</b>, não a idade. Para saber a idade em anos usa-se a <b>datação radiométrica</b>. Certos átomos são <b>radioativos</b> e se transformam em outros num ritmo constante, medido pela <b>meia-vida</b>: o tempo para metade deles se transformar. O <b>carbono-14</b> tem meia-vida de cerca de <b>5.730 anos</b> e serve para restos de seres que morreram há até cerca de 50 mil anos. Para rochas de milhões ou bilhões de anos usam-se outros átomos, como o <b>potássio-40</b> (que vira argônio) e o <b>urânio</b> (que vira chumbo).</p>
<p>Os fósseis mostram que a vida mudou: as camadas mais antigas só têm seres simples, e grupos como mamíferos e plantas com flores só aparecem em camadas mais recentes. Mostram também <b>formas de transição</b>, com características de dois grupos: o <b>Tiktaalik</b>, de cerca de 375 milhões de anos, um peixe com nadadeiras que tinham ossos de membro e pescoço; o <b>Archaeopteryx</b>, de cerca de 150 milhões de anos, com penas e asas, mas dentes, garras nas asas e cauda longa de ossos, como os dinossauros; e a série de fósseis das <b>baleias</b>, com ancestrais de patas que viviam em terra. A Chapada do Araripe, no Nordeste do Brasil, é um dos sítios de fósseis mais ricos do mundo. Veja outros exemplos de transição em <a href="../plantas-animais/index.html#animalia/novidades">Plantas e animais</a>.</p>`,
    enem: `Caem cálculos simples de <b>meia-vida</b> (depois de duas meias-vidas resta um quarto; depois de três, um oitavo) e a ideia de que o <b>carbono-14 não serve</b> para datar dinossauros, porque restaria quase nada dele depois de milhões de anos. Também aparece a leitura de camadas: a mais profunda é a mais antiga.`
  };
  TXT.V2 = {
    d: `<p>Estruturas <b>homólogas</b> têm a <b>mesma origem</b> e podem ter funções diferentes: o braço humano, a asa do morcego e a nadadeira da baleia têm os mesmos ossos na mesma ordem, herdados de um ancestral comum (é a <b>divergência</b>). Estruturas <b>análogas</b> têm a <b>mesma função</b>, mas origens diferentes: a asa da borboleta e a asa da ave voam, mas não vêm do mesmo órgão (é a <b>convergência</b>, quando ambientes parecidos selecionam formas parecidas). Só a homologia indica parentesco (ver <a href="../taxonomia/index.html#cladistica/homologia">Taxonomia, homologia e analogia</a>).</p>
<p><b>Órgãos vestigiais</b> são estruturas reduzidas que, nos ancestrais, eram maiores ou tinham outra função. Exemplos: o <b>cóccix</b> humano, resto de uma cauda; os músculos que mexem a orelha, que muita gente não consegue usar; a <b>prega semilunar</b> no canto do olho, resto de uma terceira pálpebra; os ossos da bacia que sobraram nas <b>baleias</b>; os olhos reduzidos de peixes de caverna. Vestigial não quer dizer inútil: o <b>apêndice</b> humano, por exemplo, tem tecido de defesa. O que conta é que a forma reduzida só faz sentido por herança de um ancestral.</p>
<p>Na <b>embriologia comparada</b>, embriões de vertebrados são muito parecidos no começo: todos têm <b>arcos faríngeos</b>, cauda e um tubo nervoso nas costas. Nos peixes os arcos viram brânquias; nos mamíferos viram partes da mandíbula, do ouvido e do pescoço (ver <a href="../embriologia/index.html">Embriologia</a>). No século XIX, Ernst Haeckel exagerou essas semelhanças em desenhos, e a ideia dele de que o embrião "repete" a evolução não é aceita, mas a semelhança real dos embriões continua sendo uma evidência.</p>
<p>As <b>evidências moleculares</b> são hoje as mais fortes. Todos os seres usam o mesmo <b>código genético</b>, com raras exceções, e a mesma maquinaria para fazer proteínas. Comparando a sequência de uma mesma proteína ou de um mesmo gene, quanto <b>menos diferenças</b>, mais <b>próximo</b> o parentesco. Humanos e chimpanzés têm cerca de <b>98 a 99%</b> de identidade nas sequências de DNA que podem ser comparadas diretamente. As árvores feitas com moléculas concordam, na maior parte, com as feitas com anatomia e fósseis, e é isso que dá força às conclusões.</p>`,
    enem: `Saiba separar <b>homologia</b> (mesma origem, parentesco, divergência) de <b>analogia</b> (mesma função, convergência). Órgão vestigial aparece como "estrutura sem função aparente que indica um ancestral". Questões recentes trazem tabelas de diferenças em proteínas ou em DNA e pedem a espécie mais próxima: é a de <b>menor número de diferenças</b>.`
  };
  TXT.V3 = {
    d: `<p>A evolução não aconteceu só no passado. Em seres que se reproduzem rápido ela é <b>observada</b> em poucos anos. O exemplo mais importante para a saúde é a <b>resistência a antibióticos</b>. A penicilina foi descoberta por <b>Alexander Fleming</b> em 1928 e começou a ser usada em larga escala nos anos 1940. Poucos anos depois já havia bactérias resistentes a ela.</p>
<p>Numa população de bactérias, algumas já têm, <b>por acaso</b>, uma mutação ou um gene que as torna resistentes, antes de qualquer contato com o remédio. Quando o antibiótico é usado, as sensíveis morrem e as resistentes <b>sobrevivem e se multiplicam</b>. Em pouco tempo a população é quase toda resistente. O antibiótico <b>não provoca</b> a resistência: ele <b>seleciona</b> quem já era resistente. Bactérias ainda trocam genes entre si, inclusive de espécies diferentes, por <b>plasmídeos</b> (ver <a href="../microrganismos/index.html#monera/reproducao">Microrganismos, reprodução e troca de genes</a>), o que espalha a resistência mais rápido.</p>
<p>Usar antibiótico sem receita, para gripe (que é causada por vírus, contra o qual o antibiótico não age), ou <b>interromper ou mudar o tratamento por conta própria</b>, sem seguir a orientação médica, favorece as resistentes. O uso em massa na criação de animais também. A Organização Mundial da Saúde considera a resistência aos antimicrobianos uma das maiores ameaças à saúde mundial. O mesmo raciocínio explica <b>insetos resistentes a inseticidas</b>, como populações do mosquito <i>Aedes aegypti</i>, e <b>plantas daninhas resistentes a herbicidas</b>. É a seleção natural de Darwin, medida em laboratório (ver <a href="#selecao/casos">Mariposas, bactérias e insetos</a>, <a href="#selecao/tipos">tipos de seleção</a> e <a href="../genetica/index.html#populacoes/fatores">Genética, fatores evolutivos</a>).</p>
<p>Conteúdo educativo, não substitui orientação médica.</p>`,
    enem: `É uma das questões mais cobradas de evolução. A resposta certa sempre diz que o antibiótico (ou o inseticida) <b>seleciona</b> indivíduos que <b>já eram</b> resistentes. Toda alternativa dizendo que o remédio "induziu", "provocou" ou "ensinou" a resistência é visão <b>lamarckista</b> e está errada. Cai também com o <i>Aedes aegypti</i> e os inseticidas.`
  };
  //TXT-FIM

  // ---------- ajudantes de vidraria ----------
  const VID = 'rgba(207,224,255,.55)', CALDO = '#FFE1A6', MICRO = '#A9C54A';
  // frasco: (x, y) = centro da base; h = altura; o.neck: 'aberto' | 'gaze' | 'rolha' | 'lacre' | 'cisne' | 'quebrado'; o.turb 0..1; o.carne; o.larv 0..1
  function frasco(x, y, w, h, o = {}) {
    const ry = h * .27, by = y - ry, nk = w * .3, ty = y - h * .55, topy = y - h, neck = o.neck || 'aberto';
    const sw = X.lineWidth;
    ell(x, by, w / 2, ry, 0, rgba(CALDO, .05), null);
    if (!o.carne) { // caldo
      const lv = by - ry * .35; X.save(); X.beginPath(); X.ellipse(x, by, w / 2 - 1, ry - 1, 0, 0, TAU); X.clip();
      X.fillStyle = rgba(CALDO, .28 + .35 * (o.turb || 0)); X.fillRect(x - w / 2, lv, w, ry * 2);
      const R = rng(7), n = Math.round(34 * (o.turb || 0)); for (let i = 0; i < n; i++) circ(x - w * .4 + R() * w * .8, lv + 3 + R() * (by + ry - lv - 6), 1.6, rgba(MICRO, .9));
      X.restore();
    } else { rr(x - w * .3, by - ry * .1, w * .6, ry * .75, 5, '#B5483C', 'rgba(11,15,28,.5)', 1); const R = rng(3), n = Math.round(10 * (o.larv || 0)); for (let i = 0; i < n; i++) { const lx = x - w * .24 + R() * w * .48, ly = by - ry * .2 + R() * ry * .5; line(lx, ly, lx + 5, ly - 2, '#FFF3D6', 2.4); } }
    X.save(); X.lineCap = 'round'; X.lineJoin = 'round';
    X.beginPath(); X.ellipse(x, by, w / 2, ry, 0, Math.PI * .62, Math.PI * 2.38); X.strokeStyle = VID; X.lineWidth = 2; X.stroke();
    // pescoço
    const nx = (a, b) => [x + a, y - h * b];
    if (neck === 'cisne') {
      const P = [nx(-nk / 2, .52), nx(-nk / 2, .7), nx(w * .1, .72), nx(w * .3, .6), nx(w * .45, .72), nx(w * .75, .98)], P2 = [nx(nk / 2, .52), nx(nk / 2, .66), nx(w * .12, .66), nx(w * .26, .55), nx(w * .5, .66), nx(w * .85, .94)];
      poly(P, VID, 2); poly(P2, VID, 2); o.cisneP = P.map((p, i) => [(p[0] + P2[i][0]) / 2, (p[1] + P2[i][1]) / 2]);
    } else {
      line(x - nk / 2, ty, x - nk / 2, topy, VID, 2); line(x + nk / 2, ty, x + nk / 2, topy, VID, 2);
      if (neck === 'gaze') { rr(x - nk / 2 - 2, topy - 3, nk + 4, 6, 2, 'rgba(232,237,247,.8)', null); for (let i = 0; i < 4; i++) line(x - nk / 2 + i * nk / 3, topy - 3, x - nk / 2 + i * nk / 3, topy + 3, 'rgba(11,15,28,.5)', 1); }
      if (neck === 'rolha') rr(x - nk / 2 - 2, topy - 5, nk + 4, 9, 2, '#B98B5A', null);
      if (neck === 'lacre') { X.beginPath(); X.arc(x, topy, nk / 2, Math.PI, 0); X.strokeStyle = VID; X.lineWidth = 2; X.stroke(); }
      if (neck === 'quebrado') { line(x - nk / 2, topy + h * .06, x - nk / 2 + 3, topy - 4, VID, 2); line(x + nk / 2, topy + h * .06, x + nk / 2 - 3, topy - 2, VID, 2); poly([[x - nk / 2, ty], [x - nk / 2, topy + h * .06]], VID, 2); }
    }
    X.restore(); X.lineWidth = sw;
    return o;
  }
  // uma bancada de dois frascos
  const BANC = [
    { n: 'Redi', a: '1668', f: [['aberto', { neck: 'aberto', carne: 1 }, 'frasco aberto', 'larv'], ['gaze', { neck: 'gaze', carne: 1 }, 'coberto com gaze', 0]], ok: 1, r: 'as larvas vêm de ovos de moscas, não da carne' },
    { n: 'Needham', a: 'cerca de 1745', f: [['a', { neck: 'aberto' }, 'sem ferver', 'micro'], ['b', { neck: 'rolha' }, 'fervura curta, com rolha', 'micro'], ], ok: 0, r: 'ele viu micróbios e concluiu geração espontânea; o calor tinha sido pouco' },
    { n: 'Spallanzani', a: 'cerca de 1765', f: [['a', { neck: 'rolha' }, 'fervura curta, com rolha', 'micro'], ['b', { neck: 'lacre' }, 'fervura longa, lacrado', 0]], ok: 1, r: 'lacrado e bem fervido, nada cresce; Needham diz que o ar perdeu o "princípio ativo"' },
    { n: 'Pasteur', a: 'cerca de 1860', f: [['a', { neck: 'quebrado' }, 'pescoço quebrado', 'micro'], ['b', { neck: 'cisne' }, 'pescoço de cisne', 0]], ok: 1, r: 'o ar entrou e nada cresceu, então o ar não é o "princípio ativo": a vida vem da vida' }
  ];
  function drawBanc(t, S, A) {
    const p = ciclo(lt(S), 9), cols = NAR ? 2 : 4, rows = NAR ? 2 : 1, g = 8, cw = (A.w - (cols - 1) * g) / cols, ch = (A.h - (rows - 1) * g) / rows, dia = Math.round(seg(p, .08, .7) * 8);
    BANC.forEach((b, i) => {
      const x = A.x0 + (i % cols) * (cw + g), y = A.y0 + Math.floor(i / cols) * (ch + g), sel = S.sel === i;
      rr(x, y, cw, ch, 12, sel ? rgba(EV.origem, .1) : 'rgba(19,26,43,.78)', b.ok ? (sel ? C.amber : rgba(EV.origem, .8)) : EV.cinza, sel ? 2.4 : 1.4);
      if (!b.ok) { X.save(); X.setLineDash([5, 4]); rr(x, y, cw, ch, 12, null, EV.cinza, 1.6); X.restore(); }
      hitR(x, y, cw, ch, 'b' + i); if (isf(S, 'b' + i)) rr(x - 2, y - 2, cw + 4, ch + 4, 14, null, EV.foco, 2);
      title(b.n, x + 10, y + 16, cw - 20, { a: 'left', s: fsz() + 2, c: b.ok ? EV.origem : EV.cinza });
      nome(b.a, x + cw - 10, y + 16, { a: 'right', f: FD, s: 12 }); if (!NAR || cw > 170) nome('dia ' + dia, x + 10, y + 34, { a: 'left', f: FD, s: 12, c: C.txt });
      const fh = Math.min((ch - (NAR ? 96 : 110)) * .85, 130), fw = fh * .62, fy = y + 46 + ((ch - (NAR ? 96 : 110)) - fh) / 2 + fh + 6;
      b.f.forEach(([k, o, lb, res], j) => {
        const fx = x + cw * (j ? .72 : .28), turb = res === 'micro' ? seg(p, .35, .85) : 0, larv = res === 'larv' ? seg(p, .35, .85) : 0;
        frasco(fx, fy, fw, fh, Object.assign({}, o, { turb, larv }));
        wrapTx(lb, fx, fy + 12, cw * .46, { s: 12, lh: 13, c: C.txt, bg: false });
        nome(j ? 'teste' : 'controle', fx, fy + (NAR ? 38 : 40) + (lb.length > 18 ? 6 : 0), { s: 12, c: j ? C.amber : C.dim });
      });
      const cy = y + ch - (NAR ? 34 : 38);
      if (!NAR || ch > 150) wrapTx(b.ok ? b.r : 'ideia refutada: ' + b.r, x + 8, cy + 8, cw - 16, { s: 12, lh: 14, a: 'left', c: b.ok ? C.txt : EV.cinza, bg: false });
    });
    cap(S.sel != null ? `<b>${BANC[S.sel].n}</b>: ${BANC[S.sel].r}.` : 'Passam os dias nas quatro bancadas. Toque numa bancada para ver a conclusão.');
  }
  // gargalo e frasco do experimento de Pasteur montado pelo aluno
  const dadosPasteur = S => { // resultado do caldo: 0 limpo, 1 turvo
    const lg = S.f === 1, ge = S.g; if (!lg) return 1; if (ge === 0) return 1; if (ge === 1) return 0; return (S.inc || S.brk) ? 1 : 0;
  };
  function drawMonte(t, S, A) {
    const wide = !NAR, fx = wide ? A.x0 + A.w * .2 : A.cx, fh = Math.min(A.h * (wide ? .8 : .42), 170), fw = fh * .62, fy = A.y0 + (wide ? A.h * .86 : fh + 30);
    const l = S.run ? S.ph - S.run : 0, dia = S.run ? Math.floor(cl(l / .55, 0, 12)) : 0;
    const base = S.run && dadosPasteur(Object.assign({}, S, { inc: false, brk: false })) ? seg(dia, 3, 8) : 0, l2 = S.t2 != null ? S.ph - S.t2 : -1, extra = S.t2 != null && dadosPasteur(S) ? seg(l2, 0, 3) : 0;
    const neck = S.g == null ? 'aberto' : S.brk ? 'quebrado' : ['aberto', 'lacre', 'cisne'][S.g];
    const turb = Math.max(base, extra);
    const o = frasco(fx, fy, fw, fh, { neck: S.g == null ? 'lacre' : neck, turb });
    // chama
    if (S.run && l < 2.4) for (let i = 0; i < 3; i++) { const k = fr(l * 1.4 + i / 3); ell(fx + (i - 1) * fw * .22, fy + 14 - k * 4, 5 * (1 - k * .5), 9 * (1 - k * .3), 0, rgba(i === 1 ? '#FFD36B' : '#FF8A3C', .85), null); }
    else if (S.run) nome('dia ' + dia, fx, fy + 22, { f: FD, s: 12, c: C.txt });
    // poeira
    if (S.g != null && S.g !== 1 && S.run && !S.brk || (S.brk && S.g === 2)) {
      const R = rng(11), topy = fy - fh, N = 9;
      for (let i = 0; i < N; i++) {
        const f = fr(l * .45 + R()), x0 = fx + (R() - .5) * fw * .2;
        if (S.g === 0 || S.brk) { const yy = lerp(topy - 22, fy - fh * .5, f); circ(x0, yy, 2, rgba('#CFC3A8', .9)); }
        else if (o.cisneP) { const P = o.cisneP, k = Math.min(f * 1.4, 1), q = pth([P[5], P[4], P[3]], k); const stuck = S.inc ? 0 : 1; circ(q[0] + (R() - .5) * 4, q[1] + (stuck ? 0 : 0), 2, rgba('#CFC3A8', .95)); }
      }
    }
    if (S.g === 2 && S.inc) nome('caldo encostou na curva', fx, fy - fh - 14, { s: 12, c: C.dim });
    // controles
    const cx0 = wide ? A.x0 + A.w * .42 : A.x0, cw = wide ? A.x1 - cx0 : A.w, bw = (cw - 16) / 3, bh = NAR ? 34 : 38; let cy = wide ? A.y0 + 2 : fy + 38;
    nome('gargalo', cx0, cy + 8, { a: 'left', c: C.txt }); cy += 18;
    ['reto aberto', 'reto lacrado', 'pescoço de cisne'].forEach((s, i) => bt(S, cx0 + i * (bw + 8), cy, bw, bh, s, EV.origem, 'g' + i, S.g === i)); cy += bh + 8;
    nome('fervura', cx0, cy + 8, { a: 'left', c: C.txt }); cy += 18;
    ['curta', 'longa'].forEach((s, i) => bt(S, cx0 + i * (bw + 8), cy, bw, bh, s, EV.origem, 'f' + i, S.f === i)); cy += bh + 10;
    const pronto = S.g != null && S.f != null, fim = S.run && dia >= 8;
    if (!S.run) bt(S, cx0, cy, cw, bh + 2, 'Ferver e esperar os dias', C.amber, 'go', false);
    else { if (S.g === 2) { bt(S, cx0, cy, bw * 1.5 + 4, bh, 'Inclinar o frasco', C.amber, 'inc', S.inc); bt(S, cx0 + bw * 1.5 + 12, cy, bw * 1.5 + 4, bh, 'Quebrar o pescoço', C.amber, 'brk', S.brk); } bt(S, cx0 + (S.g === 2 ? 0 : 0), cy + (S.g === 2 ? bh + 6 : 0), S.g === 2 ? cw : cw, bh, 'Novo frasco', EV.cinza, 'novo', false); }
    cy += (S.run && S.g === 2 ? bh * 2 + 14 : bh + 12);
    if (fim && cy + 40 < A.y1 + 40) {
      const turvo = turb > .5, ok = S.g === 2 && S.f === 1 && !turvo;
      const msg = S.f === 0 ? 'Fervura curta deixa micróbios vivos: o resultado não prova nada sobre o ar. Mude só uma variável por vez.'
        : S.g === 0 ? 'O ar com poeira entrou pelo gargalo reto, e o caldo turvou. Falta controlar a entrada do ar.'
        : S.g === 1 ? 'Nada cresceu, mas o ar não entrou: dá para dizer que o calor matou os micróbios, não que o ar é inocente (a dúvida de Needham).'
        : turvo ? 'Quando a poeira chegou ao caldo (pescoço quebrado ou frasco inclinado), os micróbios surgiram: eles vinham do ar, não do caldo.'
        : 'Válida: o ar entrou, a poeira ficou presa na curva e o caldo fervido continuou limpo. Variável controlada: só o caminho da poeira.';
      S.fimMsg = msg; S.ok = ok;
    } else S.fimMsg = null;
    cap(S.msg || S.fimMsg || (S.run ? 'Os dias passam e o caldo muda.' : pronto ? 'Tudo escolhido. Toque em "Ferver e esperar os dias".' : 'Escolha o gargalo e o tempo de fervura do caldo.'));
  }
  def('origem', 'biogenese', {
    t: 'Abiogênese x biogênese', s: 'dois mil anos de discussão resolvidos com frascos e caldos', c: EV.origem,
    loc: S => S.modo === 'monte' ? 'Monte o experimento de Pasteur' : 'Quatro bancadas', locNota: () => NOTA, still: 20,
    alt: 'quatro bancadas com frascos controle e teste dos experimentos de Redi, Needham, Spallanzani e Pasteur, com larvas e micróbios aparecendo ou não, e um frasco para o aluno montar o experimento de Pasteur escolhendo o gargalo e a fervura',
    extra: [mdE('banc', 'Quatro bancadas'), mdE('monte', 'Monte o experimento de Pasteur', S => { S.g = null; S.f = null; S.run = null; S.inc = false; S.brk = false; S.t2 = null; })],
    ctlVis: S => S.modo === 'banc',
    init(S) { S.modo = 'banc'; S.t0 = 0; S.msg = null; S.sel = null; S.g = null; S.f = null; S.run = null; S.inc = false; S.brk = false; S.t2 = null; },
    d: TXT.O1.d, enem: TXT.O1.enem,
    links: [['Microrganismos', '../microrganismos/index.html'], ['Os três domínios na Taxonomia', '../taxonomia/index.html#sistemas/dominios']],
    tap(x, y, S) {
      const h = hid(x, y); if (!h) return; flash(S, h);
      if (S.modo === 'banc') { if (h[0] === 'b') S.sel = S.sel === +h.slice(1) ? null : +h.slice(1); return; }
      if (h[0] === 'g') { S.g = +h.slice(1); S.run = null; S.inc = S.brk = false; S.t2 = null; S.msg = null; } else if (h[0] === 'f' && h.length === 2) { S.f = +h.slice(1); S.run = null; S.inc = S.brk = false; S.t2 = null; S.msg = null; }
      else if (h === 'go') { if (S.g == null || S.f == null) S.msg = 'Escolha o gargalo e a fervura antes de começar.'; else { S.run = agora(S); S.t2 = null; S.msg = null; } }
      else if (h === 'inc' && S.t2 == null) { S.inc = true; S.t2 = agora(S); } else if (h === 'brk' && S.t2 == null) { S.brk = true; S.t2 = agora(S); }
      else if (h === 'novo') { S.g = S.f = null; S.run = null; S.inc = S.brk = false; S.t2 = null; S.msg = null; }
    },
    draw(t, S) { const A = area(); if (S.modo === 'monte') drawMonte(t, S, A); else drawBanc(t, S, A); }
  });

  // ---------- O2: aparelho de Miller, laboratório da Terra primitiva e quem veio primeiro ----------
  const MOL = [['CH₄', '#9AA3B2'], ['NH₃', '#7CA6FF'], ['H₂', '#E8EDF7'], ['H₂O', '#2A9FC9']];
  const LOOP = [[.22, .6], [.22, .2], [.5, .2], [.5, .3], [.76, .3], [.88, .3], [.88, .62], [.88, .76], [.87, .88], [.83, .94], [.74, .97], [.65, .94], [.61, .88], [.6, .76], [.46, .76], [.34, .76], [.22, .68]];
  function drawMiller(t, S, A) {
    const p = ciclo(lt(S), 10), l = lt(S), y0 = A.y0 + 4;
    reguaGeo(A.x0, y0 + 14, A.w, null); tx(NAR ? 'Miller, 1953 (simula a Terra)' : 'Miller, 1953 (simula a Terra primitiva)', A.x0 + (NAR ? 132 : 142), y0 + 2, { s: 12, c: C.amber, a: 'left', bg: false });
    const ay = y0 + (NAR ? 54 : 58) + (NAR ? 34 : 22), ah = A.y1 - ay + 34, sc = Math.min(A.w, ah * 1.3), bx = A.cx - sc / 2, bh = sc / 1.3, by = ay + (ah - bh) / 2;
    const P = a => [bx + a[0] * sc, by + a[1] * bh], loop = LOOP.map(P);
    // vidraria
    X.save(); X.lineCap = 'round'; X.lineJoin = 'round';
    [loop.slice(0, 4), loop.slice(4, 16)].forEach(q => poly(q, 'rgba(207,224,255,.5)', 10)); [loop.slice(0, 4), loop.slice(4, 16)].forEach(q => poly(q, '#0E1527', 6.5));
    const [fx, fy] = P([.2, .78]), fr0 = sc * .1;
    circ(fx, fy, fr0, 'rgba(42,159,201,.1)', 'rgba(207,224,255,.55)', 2);
    X.save(); X.beginPath(); X.arc(fx, fy, fr0 - 1, 0, TAU); X.clip(); X.fillStyle = 'rgba(42,159,201,.55)'; X.fillRect(fx - fr0, fy + fr0 * .05, fr0 * 2, fr0); X.restore();
    for (let i = 0; i < 5; i++) { const k = fr(l * .7 + i * .2); circ(fx - fr0 * .5 + i * fr0 * .25, fy + fr0 * .5 - k * fr0 * .5, 2, 'rgba(207,224,255,.8)'); }
    const [sx, sy] = P([.62, .3]), sr = sc * .12;
    circ(sx, sy, sr, 'rgba(207,224,255,.05)', 'rgba(207,224,255,.6)', 2.5);
    const [e1x, e1y] = P([.46, .3]), [e2x, e2y] = P([.78, .3]);
    line(e1x, e1y, sx - sr * .35, sy, '#E8EDF7', 2); line(e2x, e2y, sx + sr * .35, sy, '#E8EDF7', 2);
    if (fr(l * 2.5) < .55) { const K = rng(Math.floor(l * 2.5) + 5), q = [[sx - sr * .35, sy]]; for (let i = 1; i < 4; i++) q.push([lerp(sx - sr * .35, sx + sr * .35, i / 4), sy + (K() - .5) * sr * .5]); q.push([sx + sr * .35, sy]); poly(q, EV.ouro, 2.6); circ(sx, sy, sr * .55, rgba(EV.ouro, .18)); }
    const [kx, ky] = P([.88, .46]); rr(kx - sc * .05, ky - sc * .1, sc * .1, sc * .2, 5, 'rgba(42,159,201,.13)', 'rgba(42,159,201,.6)', 1.3);
    // coletor em U que escurece
    const k = seg(p, .15, .95), yn = P([0, .9 - .15 * k])[1], uB = P([.74, .97]);
    const cor = mix('#E8F0FF', mix('#E6C86A', '#7A4A24', seg(p, .5, 1)), seg(p, .05, .5));
    X.save(); X.beginPath(); X.rect(bx, yn, sc, bh * 2); X.clip(); X.beginPath(); loop.slice(7, 14).forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.closePath(); X.fillStyle = rgba(cor, .5 + .4 * k); X.fill(); X.restore(); X.restore();
    // moléculas pelo circuito
    for (let i = 0; i < 12; i++) {
      const f = fr(l * .06 + i / 12), q = pth(loop, f), m = MOL[i % 4], depois = f > .27 && f < .9 && i % 3 === 0 && p > .12;
      if (depois) { circ(q[0], q[1], 4, EV.creme, 'rgba(11,15,28,.6)', 1); continue; }
      circ(q[0], q[1], 3.6, m[1], 'rgba(11,15,28,.6)', 1);
    }
    const LEG = MOL.concat([['aminoácido', EV.creme]]); LEG.forEach((m, i) => { const xx = A.x0 + 4 + (NAR ? (i % 3) * 92 : i * 100), yy = ay + 4 + (NAR ? (i / 3 | 0) * 18 : 0); circ(xx + 5, yy, 4.5, m[1], 'rgba(11,15,28,.6)', 1); mtx(m[0], xx + 14, yy, { s: 12, a: 'left', c: C.txt, bg: false }); });
    lab(fx, fy + fr0 * .4, fx - 30, fy + fr0 + 16, 'água fervendo'); lab(sx, sy - sr, sx - 20, sy - sr - 26, 'gases e faíscas'); lab(kx, ky - sc * .1, kx + sc * .06, ky - sc * .1 - 30, 'condensador'); lab(uB[0], uB[1] - 6, uB[0] - 50, uB[1] + 4, 'coletor');
    cap(S.msg || (p < .35 ? 'Água fervendo, gases e faíscas: o modelo da atmosfera primitiva e dos raios.' : p < .8 ? 'A cada faísca, moléculas simples se juntam e viram aminoácidos que se acumulam no coletor.' : 'Cerca de uma semana depois, o coletor está escuro: aparecem aminoácidos como a glicina e a alanina.'));
  }
  const GAS = [['CH₄', 'metano'], ['NH₃', 'amônia'], ['CO₂', 'gás carbônico'], ['O₂', 'oxigênio']], NIV = ['nada', 'pouco', 'muito'], ENE = ['faíscas', 'ultravioleta', 'fonte hidrotermal'];
  const PRE = [['Mistura de Miller', [2, 2, 0, 0]], ['Mais atual: CO₂ e N₂', [1, 0, 2, 0]], ['Com muito O₂', [2, 2, 0, 2]]];
  const rendim = S => { const g = S.gas, raw = g[0] * .3 + g[1] * .25 + g[2] * .1, o2 = [1, .22, .02][g[3]], en = [1, .8, .7][S.en]; return cl(raw / 1.15 * o2 * en, 0, 1); };
  function drawLab(t, S, A) {
    const g = 6, wide = !NAR, lw = wide ? A.w * .56 : A.w, rh = NAR ? 34 : 40; let y = A.y0 + 2;
    const pw = (lw - 2 * g) / 3; PRE.forEach(([n], i) => bt(S, A.x0 + i * (pw + g), y, pw, rh, n, EV.origem, 'p' + i, S.pre === i)); y += rh + g + 4;
    GAS.forEach(([f, n], i) => {
      mtx(`<b>${f}</b> ${n}`, A.x0, y + rh / 2, { s: fsz(), a: 'left', c: C.txt, bg: false });
      const bx0 = A.x0 + (NAR ? 100 : 130), bw = (A.x0 + lw - bx0 - 2 * 6) / 3; NIV.forEach((s, j) => bt(S, bx0 + j * (bw + 6), y, bw, rh - 4, s, i === 3 ? EV.alerta : EV.agua, 'g' + i + j, S.gas[i] === j)); y += rh;
    });
    nome('energia', A.x0, y + 8, { a: 'left', c: C.txt }); y += 16; const ew = (lw - 2 * g) / 3; ENE.forEach((s, i) => bt(S, A.x0 + i * (ew + g), y, ew, rh - 2, s, C.amber, 'e' + i, S.en === i)); y += rh + 6;
    // medidor
    const r = rendim(S), mx = wide ? A.x0 + lw + 24 : A.x0, my = wide ? A.y0 + 10 : y + 6, mw = wide ? A.x1 - mx : A.w, mh = wide ? A.h - 20 : Math.max(46, A.y1 - my + 20);
    panel(mx, my, mw, Math.min(mh, wide ? 200 : 70)); title('compostos orgânicos formados', mx + 10, my + 18, mw - 20, { a: 'left', s: fsz() + 1, c: C.txt });
    const by0 = my + 34, bw = mw - 20; rr(mx + 10, by0, bw, 16, 8, 'rgba(11,15,28,.7)', C.line, 1); rr(mx + 10, by0, Math.max(0, bw * r), 16, 8, mix('#7CA6FF', EV.creme, r), null);
    const nv = r > .7 ? 'alto' : r > .35 ? 'médio' : r > .08 ? 'baixo' : 'quase nenhum'; mtx(nv, mx + 10, by0 + 34, { s: fsz() + 2, a: 'left', w: 600, c: C.amber });
    if (wide) { wrapTx(S.gas[3] > 0 ? 'O gás oxigênio oxida e degrada as moléculas orgânicas.' : S.pre === 1 ? 'Com CO₂ e N₂ também se formam compostos orgânicos, em menor quantidade.' : 'Aminoácidos como a glicina e a alanina.', mx + 10, by0 + 62, bw, { s: 12, lh: 15, a: 'left', c: C.dim, bg: false }); }
    cap(S.msg || (S.gas[3] > 0 ? 'Com oxigênio na atmosfera, as moléculas orgânicas se degradam: quase nada se forma.' : `Rendimento ${nv}. Mude os gases e a energia para comparar.`));
  }
  const RN = [['DNA', 1, 0], ['RNA', 1, 1], ['proteína', 0, 1]];
  function drawRna(t, S, A) {
    const rh = Math.min(NAR ? 92 : 104, (A.h - 56) / 3 - 6); let y = A.y0 + 2;
    RN.forEach(([n, inf, cat], i) => {
      const certo = S.fim; panel(A.x0, y, A.w, rh, { s: S.fim && S.res[i] === 1 ? EV.verde : C.line });
      title(n, A.x0 + 14, y + rh / 2, 90, { a: 'left', s: fsz() + 5, c: i === 1 ? EV.origem : C.txt });
      const cw = (A.w - 130) / 2 - 8;
      [['guarda informação', inf], ['catalisa reação', cat]].forEach(([s, v], j) => {
        const on = S.ch[i][j], x = A.x0 + 110 + j * (cw + 12), id = 'c' + i + j;
        btn(x, y + 12, cw, rh - 24, s, on ? C.amber : EV.cinza, id, { on }); if (isf(S, id)) rr(x - 2, y + 10, cw + 4, rh - 20, 12, null, EV.foco, 2);
        if (S.fim) { const bom = !!on === !!v; if (bom) visto(x + cw - 12, y + 22, 10); else xis(x + cw - 12, y + 22, 10); }
      });
      y += rh + 8;
    });
    bt(S, A.x0, y, Math.min(190, A.w), 38, S.fim ? 'Ligar de novo' : 'Conferir', C.amber, 'conf', false);
    cap(S.msg || 'Para cada molécula, ligue o que ela faz: guardar informação, catalisar reações, ou as duas coisas.');
  }
  def('origem', 'hipoteses', {
    t: 'Como a química virou biologia', s: 'da sopa de Oparin ao mundo do RNA', c: EV.origem,
    loc: S => ({ miller: 'Aparelho de Miller', lab: 'Laboratório da Terra primitiva', rna: 'Quem veio primeiro' })[S.modo], locNota: S => S.modo === 'miller' ? NOTA : S.modo === 'lab' ? SIM : NOTA, still: 20,
    alt: 'o aparelho de vidro de Miller com água fervendo, gases, faíscas e um coletor que escurece com aminoácidos, um laboratório com botões de gases e energia e um medidor de compostos orgânicos, e três cartões DNA, RNA e proteína para ligar às funções',
    extra: [mdE('miller', 'Aparelho de Miller'), mdE('lab', 'Laboratório da Terra primitiva'), mdE('rna', 'Quem veio primeiro')],
    ctlVis: S => S.modo === 'miller',
    init(S) { S.modo = 'miller'; S.t0 = 0; S.msg = null; S.gas = [2, 2, 0, 0]; S.en = 0; S.pre = 0; S.ch = [[0, 0], [0, 0], [0, 0]]; S.fim = false; S.res = [0, 0, 0]; },
    d: TXT.O2.d, enem: TXT.O2.enem,
    links: [['Ácidos nucleicos em Biologia molecular', '../biologia-molecular/index.html#na/nucleotideo'], ['Célula e organelas', '../celula/index.html']],
    tap(x, y, S) {
      const h = hid(x, y); if (!h) return; flash(S, h);
      if (S.modo === 'lab') {
        if (h[0] === 'p') { S.pre = +h[1]; S.gas = PRE[S.pre][1].slice(); } else if (h[0] === 'g') { S.gas[+h[1]] = +h[2]; S.pre = null; } else if (h[0] === 'e') S.en = +h[1];
        S.msg = null;
      } else if (S.modo === 'rna') {
        if (h[0] === 'c' && h.length === 3 && !S.fim) { const i = +h[1], j = +h[2]; S.ch[i][j] = S.ch[i][j] ? 0 : 1; S.msg = null; }
        else if (h === 'conf') {
          if (S.fim) { S.fim = false; S.ch = [[0, 0], [0, 0], [0, 0]]; S.msg = null; return; }
          S.res = RN.map((r, i) => (!!S.ch[i][0] === !!r[1] && !!S.ch[i][1] === !!r[2]) ? 1 : 0); S.fim = true;
          S.msg = S.res.every(v => v) ? 'Certo: só o RNA recebe as duas ligações. Guarda informação como o DNA e catalisa como a proteína (as ribozimas), por isso pode ter vindo antes.' : 'Veja as marcas: o DNA só guarda informação, a proteína só catalisa, e o RNA faz as duas coisas. Toque em "Ligar de novo" para tentar outra vez.';
        }
      }
    },
    draw(t, S) { const A = area(); if (S.modo === 'lab') drawLab(t, S, A); else if (S.modo === 'rna') drawRna(t, S, A); else drawMiller(t, S, A); }
  });

  // ---------- O3: endossimbiose e o ar do planeta ----------
  const PROVAS = [['duas membranas', .34], ['DNA próprio e circular', .46], ['ribossomos como os de bactérias', .52], ['divisão por conta própria', .6]];
  // contorno da célula hospedeira com uma reentrância (dent) na direção th0
  function hospedeira(cx, cy, rx, ry, th0, dent, p) {
    const pts = []; for (let i = 0; i < 90; i++) { const a = i / 90 * TAU, d = Math.atan2(Math.sin(a - th0), Math.cos(a - th0)), k = 1 + .025 * Math.sin(3 * a + p * 1.5) - dent * Math.exp(-((d / .5) ** 2)) * .5; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    shape(pts, rgba(EV.rosa, .08), rgba(EV.rosa, .9), 2.4); return pts;
  }
  const bact = (x, y, w, h, ang, c, o = {}) => { X.save(); X.translate(x, y); X.rotate(ang); rr(-w / 2, -h / 2, w, h, h / 2, rgba(c, .3), c, 1.6); if (o.dna !== false) { X.beginPath(); X.ellipse(0, 0, w * .22, h * .22, 0, 0, TAU); X.strokeStyle = o.dc || EV.creme; X.lineWidth = 1.2; X.stroke(); } X.restore(); };
  function mito(x, y, w, h, k, ang) {
    X.save(); X.translate(x, y); X.rotate(ang); rr(-w / 2, -h / 2, w, h, h / 2, rgba('#F25C3B', .22), '#F25C3B', 2); rr(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, h / 2 - 3, null, rgba('#F25C3B', .6), 1.2);
    X.globalAlpha *= k; const n = 5; X.beginPath(); for (let i = 0; i < n; i++) { const xx = -w / 2 + w * (i + .7) / (n + .4), s = i % 2 ? 1 : -1; X.moveTo(xx, s * (h / 2 - 3)); X.lineTo(xx, s * (h / 2 - 3 - h * .55)); } X.strokeStyle = '#FF9A6B'; X.lineWidth = 1.6; X.stroke(); X.restore();
  }
  function cloro(x, y, w, h, k) {
    X.save(); X.translate(x, y); ell(0, 0, w / 2, h / 2, 0, rgba(EV.verde, .2), EV.verde, 2); X.globalAlpha *= k;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) rr(-w * .3 + i * w * .22, -h * .26 + j * h * .2, w * .17, h * .1, 2, rgba(EV.verdeEsc, .95), EV.verde, 1); X.restore();
  }
  const PROVA_TX = ['Duas membranas: a de dentro seria da bactéria e a de fora, da célula que a envolveu.', 'DNA próprio e circular, como o das bactérias e diferente do DNA do núcleo.', 'Os ribossomos da mitocôndria são parecidos com os das bactérias.', 'Mitocôndrias e cloroplastos se dividem por conta própria, como as bactérias.'];
  function drawEndo(t, S, A) {
    const p = ciclo(lt(S), 12), l = lt(S), wide = !NAR, pw = wide ? A.w * .34 : A.w, cw = wide ? A.w - pw - 16 : A.w, ch = wide ? A.h : A.h - 104;
    const cx = A.x0 + cw / 2, cy = A.y0 + ch / 2 + 2, rx = Math.min(cw * .4, 230), ry = Math.min(ch * .42, 160);
    // 1ª rodada (bactéria roxa, mitocôndria) e 2ª rodada (cianobactéria, cloroplasto)
    const e1 = seg(p, .08, .3), f1 = seg(p, .3, .4), m1 = seg(p, .4, .55), e2 = seg(p, .68, .86), c2 = seg(p, .86, 1);
    const th1 = .55, th2 = Math.PI - .5, dent = Math.max(Math.sin(Math.min(1, e1) * PI) * (p < .35 ? 1 : 0), Math.sin(e2 * PI) * (p > .6 ? 1 : 0)), thd = p > .6 ? th2 : th1;
    // núcleo
    hospedeira(cx, cy, rx, ry, thd, dent * .9, l);
    circ(cx - rx * .15, cy - ry * .45, ry * .26, rgba(EV.violeta, .3), EV.violeta, 2); nome('núcleo', cx - rx * .15, cy - ry * .45, { s: 12, c: C.txt });
    const mx = cx + Math.cos(th1) * rx * .5, my = cy + Math.sin(th1) * ry * .45;
    // bactéria 1
    const far1 = [cx + Math.cos(th1) * rx * 1.5, cy + Math.sin(th1) * ry * 1.45];
    if (p < .4) {
      const a = seg(p, 0, .08), bp = p < .08 ? [far1[0] + 50 * (1 - a), far1[1] + 34 * (1 - a)] : [lerp(far1[0], mx, ss(e1)), lerp(far1[1], my, ss(e1))];
      bact(bp[0], bp[1], 46, 22, th1, EV.violeta); lab(bp[0], bp[1], bp[0] + 14, bp[1] + 34, 'bactéria aeróbia');
      if (f1 > 0) ell(mx, my, 31, 19, th1, null, rgba(EV.rosa, .9), 2);
    } else if (p < .55) { bact(mx, my, 42, 20, th1, EV.violeta, { dna: false }); ell(mx, my, 31, 19, th1, null, rgba(EV.rosa, .9), 2); X.save(); X.globalAlpha *= m1; X.restore(); mito(mx, my, 50, 26, m1, th1); }
    else mito(mx, my, 56, 28, 1, th1);
    // provas visíveis dentro da mitocôndria
    if (p >= .46) { X.beginPath(); X.ellipse(mx - 10, my, 7, 5, th1, 0, TAU); X.strokeStyle = EV.violeta; X.lineWidth = 1.6; X.stroke(); }
    if (p >= .52) for (let i = 0; i < 3; i++) circ(mx + 8 + i * 5, my - 3 + (i % 2) * 6, 1.8, EV.creme);
    if (p >= .6 && p < .7) mito(mx + 34 * Math.cos(th1 + 1.1), my + 30, 34, 18, 1, th1);
    // cianobactéria
    const farC = [cx + Math.cos(th2) * rx * 1.55, cy + Math.sin(th2) * ry * 1.5], cxx = cx + Math.cos(th2) * rx * .45, cyy = cy + Math.sin(th2) * ry * .4 + 12;
    if (p >= .6 && p < .86) { const k = seg(p, .6, .68) * .3 + ss(e2) * .7; bact(lerp(farC[0] - 40, cxx, k), lerp(farC[1] + 20, cyy, k), 48, 24, th2 + PI, EV.verde, { dc: '#0B0F1C' }); if (e2 > .4) ell(cxx, cyy, 33, 21, th2 + PI, null, rgba(EV.rosa, .9), 2); }
    if (p >= .86) cloro(cxx, cyy, 64, 36, c2);
    lab(cx - rx * .5, cy + ry * .3, A.x0 + 40, A.y0 + ch - 6, 'célula hospedeira');
    if (p >= .4) lab(mx, my, mx + 70, my - 40, 'mitocôndria'); if (p >= .86) lab(cxx, cyy, cxx - 60, cyy + 60, 'cloroplasto');
    // painel das provas
    const px = wide ? A.x0 + cw + 16 : A.x0, py = wide ? A.y0 + 28 : A.y0 + ch + 6, bh = wide ? Math.min(58, (A.h - 28 - 3 * 8) / 4) : 44, bw = wide ? pw : (A.w - 8) / 2;
    if (wide) nome('provas da endossimbiose (toque numa)', px, py - 10, { a: 'left', s: 12, c: C.dim });
    PROVAS.forEach(([s, k], i) => {
      hitR(wide ? px : px + (i % 2) * ((A.w - 8) / 2 + 8), wide ? py + i * (bh + 8) : py + Math.floor(i / 2) * (bh + 6), bw, bh, 'v' + i);
      const on = p >= k, x = px + (wide ? 0 : (i % 2) * (bw + 8)), y = py + (wide ? i * (bh + 8) : Math.floor(i / 2) * (bh + 6));
      rr(x, y, bw, bh, 10, on ? rgba(EV.verde, .12) : 'rgba(19,26,43,.7)', on ? EV.verde : C.line, on ? 2 : 1.2); wrapTx(s, x + 34, y + bh / 2 - (wrapTx(s, 0, 0, bw - 44, { s: fsz(), lh: fsz() + 2, dry: true }) - fsz() - 2) / 2, bw - 44, { s: fsz(), lh: fsz() + 2, a: 'left', w: 600, c: on ? C.txt : C.dim, bg: false });
      if (on) { rr(x + 8, y + bh / 2 - 10, 20, 20, 5, rgba(EV.verde, .2), EV.verde, 1.6); visto(x + 18, y + bh / 2, 9); } else rr(x + 8, y + bh / 2 - 10, 20, 20, 5, null, C.line, 1.5);
    });
    cap(S.msg || (p < .3 ? 'Uma célula grande envolve uma bactéria aeróbia (a futura mitocôndria). Ela não é digerida.' : p < .6 ? 'A bactéria fica cercada por duas membranas e vira uma mitocôndria, com dobras (cristas).' : p < .86 ? 'Mais tarde, uma linhagem envolve uma cianobactéria.' : 'A cianobactéria vira o cloroplasto. As provas se marcam uma a uma; toque numa para ler.'));
  }
  // O ar do planeta
  const GEO = [[4.6, 'Terra jovem, formada há cerca de 4,6 bilhões de anos e ainda sem sinais de vida'], [3.8, 'primeiros sinais de vida (marcas químicas em rochas, ainda debatidas)'], [3.5, 'estromatólitos: camadas feitas por comunidades de bactérias'], [2.4, 'Grande Evento de Oxidação: o gás oxigênio passa a existir em quantidade na atmosfera'], [2.0, 'surge a célula eucariótica'], [1.0, 'aparecem os primeiros seres multicelulares'], [.6, 'animais e plantas se diversificam']];
  const O2G = ga => ga > 2.4 ? 0 : ga > .8 ? .1 : ga > .6 ? .35 : ga > .4 ? .6 : 1;
  const SEQ = [['heterotrófica', ['fermentação', 'fotossíntese', 'respiração aeróbia']], ['autotrófica', ['quimiossíntese', 'fotossíntese', 'respiração aeróbia']]];
  function drawAr(t, S, A) {
    const ga = 4.6 - S.v, wide = !NAR, y0 = A.y0 + 4, ry = reguaGeo(A.x0, y0 + 14, A.w, ga), gy = ry + 6, sh = A.y1 - gy - 44 + 40, sw = wide ? A.w * .58 : A.w, gh = wide ? sh : sh * .55;
    // céu
    const ox = O2G(ga), cs = mix('#4A2A22', '#1F5A8F', ox), g = X.createLinearGradient(0, gy, 0, gy + gh); g.addColorStop(0, mix('#2A1A1A', '#13324F', ox)); g.addColorStop(1, cs);
    rr(A.x0, gy, sw, gh, 10, g, C.line, 1); X.save(); X.beginPath(); X.roundRect(A.x0, gy, sw, gh, 10); X.clip();
    const mar = gy + gh * .62; rect(A.x0, mar, sw, gh - gh * .62, 'rgba(42,159,201,.35)'); const solo = gy + gh * .86; rect(A.x0, solo, sw, gh * .14, '#4B3A2A');
    if (ga > 3.8) { shape([[A.x0 + sw * .8, mar], [A.x0 + sw * .87, gy + gh * .38], [A.x0 + sw * .94, mar]], '#5A3A2A'); circ(A.x0 + sw * .87, gy + gh * .36, 8, rgba('#FF6A2A', .85)); }
    if (ga <= 3.5) for (let i = 0; i < 4; i++) { const x = A.x0 + sw * (.12 + i * .17); X.beginPath(); X.ellipse(x, solo, sw * .06, gh * .09, 0, Math.PI, TAU); X.fillStyle = '#A98B5C'; X.fill(); X.strokeStyle = '#6F5A3A'; X.lineWidth = 1.2; X.stroke(); line(x - sw * .04, solo - gh * .03, x + sw * .04, solo - gh * .03, '#6F5A3A', 1); nome(i === 0 ? 'estromatólitos' : '', x, solo + gh * .07, { s: 12, c: C.txt }); }
    if (ga <= 3.0) { const R = rng(5); for (let i = 0; i < 14; i++) { const x = A.x0 + sw * (.1 + R() * .5), f = fr(t * .15 + R()); if (ga <= 2.4 || f < .3) circ(x, lerp(solo - 6, mar - 10, f), 2, rgba(EV.verde, .9)); } if (ga > 2.4) nome('cianobactérias', A.x0 + sw * .3, mar + gh * .09, { s: 12, c: EV.verde }); }
    if (ga <= 2.0) { circ(A.x0 + sw * .62, mar + gh * .12, 13, rgba(EV.verde, .2), EV.verde, 2); circ(A.x0 + sw * .62 + 3, mar + gh * .12 - 2, 5, rgba(EV.violeta, .6), EV.violeta, 1.5); nome('célula eucariótica', A.x0 + sw * .62, mar + gh * .12 + 24, { s: 12, c: C.txt }); }
    if (ga <= 1.0) { for (let i = 0; i < 3; i++) { const x = A.x0 + sw * (.78 + i * .06); poly([[x, solo], [x - 3, solo - gh * .12], [x + 2, solo - gh * .2]], EV.verdeEsc, 3); } nome('multicelulares', A.x0 + sw * .82, solo - gh * .26, { s: 12, c: C.txt }); }
    X.restore();
    // gráfico de O2
    const gx = wide ? A.x0 + sw + 16 : A.x0, gw = wide ? A.x1 - gx : A.w, gy2 = wide ? gy : gy + gh + 8, gh2 = wide ? sh - 44 : A.y1 - gy2 - 34 + 40 - 40;
    panel(gx, gy2, gw, Math.max(70, gh2)); const H2 = Math.max(70, gh2), ax = gx + 14, aw = gw - 28, ay = gy2 + H2 - 20, ah = H2 - 50;
    title('gás oxigênio na atmosfera', gx + 10, gy2 + 16, gw - 16, { a: 'left', s: fsz(), c: C.txt });
    line(ax, ay, ax + aw, ay, C.line, 1.2); const P = [], Q = []; for (let i = 0; i <= 92; i++) { const g2 = 4.6 - 4.6 * i / 92, x = ax + aw * i / 92; P.push([x, ay - ah * O2G(g2)]); if (4.6 - g2 <= S.v) Q.push([x, ay - ah * O2G(g2)]); }
    poly(P, rgba(EV.oxi, .35), 2); if (Q.length > 1) poly(Q, EV.oxi, 3); const mxp = ax + aw * S.v / 4.6; line(mxp, ay - ah - 4, mxp, ay, C.amber, 1.5); circ(mxp, ay - ah * O2G(ga), 4.5, C.amber);
    nome('quase nenhum', ax + 2, ay - 8, { a: 'left', s: 12 }); nome('hoje', ax + aw, ay + 10, { a: 'right', s: 12 });
    // hipóteses
    const sq = SEQ[S.hip], by = wide ? A.y1 + 4 - 0 : A.y1 - 30, cwid = (A.w - 2 * 22 - 90) / 3;
    const al = [ga >= 3.0, ga < 3.0 && ga >= 2.4, ga < 2.4];
    if (wide) { nome(`hipótese ${sq[0]}`, A.x0, by + 12, { a: 'left', s: 12, c: C.amber }); sq[1].forEach((s, i) => { const x = A.x0 + 150 + i * (cwid + 24 - 20); rr(x, by, cwid - 10, 26, 8, al[i] ? rgba(C.amber, .22) : 'rgba(19,26,43,.7)', al[i] ? C.amber : C.line, al[i] ? 2 : 1.2); mtx(s, x + (cwid - 10) / 2, by + 13.5, { s: 12, w: 600, c: al[i] ? C.txt : C.dim, bg: false }); if (i < 2) arrow(x + cwid - 8, by + 13, x + cwid + 12, by + 13, C.dim, 1.4); }); }
    else { sq[1].forEach((s, i) => { const bw2 = (A.w - 32) / 3, x = A.x0 + i * (bw2 + 16); rr(x, by, bw2, 28, 8, al[i] ? rgba(C.amber, .22) : 'rgba(19,26,43,.7)', al[i] ? C.amber : C.line, al[i] ? 2 : 1.2); wrapTx(s, x + bw2 / 2, by + 14 - (wrapTx(s, 0, 0, bw2 - 6, { s: 12, lh: 12, dry: true }) - 12) / 2, bw2 - 6, { s: 12, lh: 12, w: 600, c: al[i] ? C.txt : C.dim, bg: false }); if (i < 2) arrow(x + bw2 + 1, by + 14, x + bw2 + 15, by + 14, C.dim, 1.4); }); }
    const mk = GEO.filter(m => m[0] >= ga - .001).pop();
    cap(`<span class="q">cerca de ${ga <= .05 ? 'hoje' : nbr(ga, 1) + ' bilhões de anos atrás'}</span>: ${mk ? mk[1] : ''}.`.replace('cerca de hoje', 'hoje'));
  }
  const rect = (x, y, w, h, c) => { X.fillStyle = c; X.fillRect(x, y, w, h); };
  def('origem', 'primeiras-celulas', {
    t: 'Das primeiras células aos eucariontes', s: 'bactérias mudaram o ar do planeta e depois foram morar dentro de outras células', c: EV.origem,
    loc: S => S.modo === 'ar' ? 'O ar do planeta' : 'Endossimbiose', locNota: () => NOTA, still: 20, stillV: 4.6,
    alt: 'uma célula grande englobando uma bactéria que vira mitocôndria e depois outra que vira cloroplasto, com as quatro provas acendendo, e a régua do tempo de 4,6 bilhões de anos com o gráfico do gás oxigênio e a troca entre as hipóteses heterotrófica e autotrófica',
    ctl: { l: 'Tempo', min: 0, max: 4.6, step: .1, v: 0, f: v => v >= 4.55 ? 'hoje' : 'cerca de ' + nbr(4.6 - v, 1) + ' bilhões de anos', rate: () => 1 },
    ctlVis: S => S.modo === 'ar',
    auto: S => { if (S.v >= 4.55 || S.touch) S.fimA = true; return S.modo === 'ar' && !S.fimA ? .5 : 0; },
    extra: [mdE('endo', 'Endossimbiose'), mdE('ar', 'O ar do planeta', S => { S.v = S.paused ? 4.6 : 0; S.fimA = !!S.paused; S.touch = 0; }), { t: 'Trocar hipótese', vis: S => S.modo === 'ar', on: S => { S.hip = 1 - S.hip; }, pressed: S => S.hip === 1 }],
    init(S) { S.modo = 'endo'; S.t0 = 0; S.msg = null; S.hip = 0; S.fimA = false; },
    tap(x, y, S) { if (S.modo !== 'endo') return; const h = hid(x, y); if (h && h[0] === 'v') { flash(S, h); S.msg = PROVA_TX[+h.slice(1)]; } else S.msg = null; },
    d: TXT.O3.d, enem: TXT.O3.enem,
    links: [['Célula procariótica em Microrganismos', '../microrganismos/index.html#monera/celula'], ['Respiração celular na Bioenergética', '../bioenergetica/index.html#resp/geral'], ['Os três domínios na Taxonomia', '../taxonomia/index.html#sistemas/dominios']],
    draw(t, S) { const A = area(); if (S.modo === 'ar') drawAr(S.ph, S, A); else drawEndo(t, S, A); }
  });

  // ---------- I1: Lamarck e Darwin lado a lado, e herda ou não herda ----------
  // girafa esquemática: (x, y) = chão sob o corpo; s = tamanho; neck = comprimento do pescoço (1 = médio)
  function girafa(x, y, s, neck, c, o = {}) {
    const a = o.a == null ? 1 : o.a; if (a < .03) return; X.save(); X.globalAlpha *= a; X.lineCap = 'round';
    const by = y - .8 * s, sy = by - .1 * s, hx = x + .5 * s + neck * .1 * s, hy = sy - neck * .95 * s;
    [-.34, -.2, .2, .34].forEach(dx => line(x + dx * s, by + .1 * s, x + dx * s, y, c, Math.max(2, s * .07)));
    ell(x, by, .5 * s, .25 * s, 0, rgba(c, .28), c, 1.8);
    line(x + .38 * s, sy + .02 * s, hx, hy + .1 * s, c, Math.max(4, s * .15)); line(x + .38 * s, sy + .02 * s, hx, hy + .1 * s, rgba('#0B0F1C', .55), Math.max(1.5, s * .06));
    ell(hx + .06 * s, hy, .13 * s, .08 * s, -.3, rgba(c, .5), c, 1.6); line(hx, hy - .06 * s, hx - .02 * s, hy - .17 * s, c, 1.6);
    for (let i = 0; i < 3; i++) circ(x - .2 * s + i * .2 * s, by - .03 * s + (i % 2) * .08 * s, s * .05, rgba(c, .8));
    if (o.folha) circ(hx + .2 * s, hy - .05 * s, 3, EV.verde); X.restore();
  }
  const folhas = (x0, x1, yy, a = 1) => { X.save(); X.globalAlpha *= a; for (let x = x0; x < x1; x += 10) circ(x, yy + Math.sin(x * .3) * 2, 3.2, rgba(EV.verde, .85)); X.restore(); };
  const GP = (() => { const G = [[.8, .95, 1.05, .9, 1.25, 1.12]]; for (let g = 0; g < 3; g++) { const sv = G[g].slice().sort((p, q) => q - p).slice(0, 3), v = [-.1, .06, .12, .02, -.06, .09]; G.push([0, 1, 2, 3, 4, 5].map(i => +(sv[i % 3] + v[i] + .03).toFixed(2))); } return G; })();
  function drawGiraf(t, S, A) {
    const p = ciclo(lt(S), 10), wide = !NAR, g = 10, pw = wide ? (A.w - g) / 2 : A.w, ph = wide ? A.h : (A.h - g) / 2;
    [0, 1].forEach(k => {
      const x = A.x0 + (wide ? k * (pw + g) : 0), y = A.y0 + (wide ? 0 : k * (ph + g)), cc = k ? EV.darwin : EV.lamarck;
      rr(x, y, pw, ph, 12, 'rgba(19,26,43,.6)', rgba(cc, .8), 1.5); title(k ? 'Darwin' : 'Lamarck', x + 12, y + 16, pw - 24, { a: 'left', c: cc, s: fsz() + 3 });
      const s = Math.min(pw / 8.6, ph / 3.1), gy = y + ph - 22, leafY = gy - (.9 + 1.15 * .95) * s;
      folhas(x + pw * .55, x + pw - 14, leafY - 5); line(x + 10, leafY, x + pw - 10, leafY, rgba(EV.verde, .35), 1, [4, 4]);
      nome('folhas altas', x + pw - 12, leafY - 14, { a: 'right', s: 12, c: EV.verde });
      if (!k) {
        const st = seg(p, 0, .35), nk = lerp(1, 1.2, ss(st)), baby = seg(p, .38, .55), rf = seg(p, .72, .85);
        girafa(x + pw * .22, gy, s, nk, cc, { folha: st > .9 });
        if (p < .38) nome(st > .1 ? 'estica o pescoço durante a vida' : 'pescoço médio', x + pw * .3, gy + 12, { s: 12, c: C.txt });
        if (baby > 0) { girafa(x + pw * .5, gy, s * .7, 1.2, cc, { a: baby }); nome('o filhote já nasce com o pescoço esticado', x + pw * .5, gy + 12, { s: 12, c: C.txt, a: 'center' }); }
        if (rf > 0) { X.save(); X.globalAlpha *= rf; X.translate(x + pw * .5, y + ph * .45); X.rotate(-.08); X.setLineDash([6, 4]); rr(-pw * .34, -22, pw * .68, 44, 10, 'rgba(11,15,28,.88)', EV.cinza, 2); X.setLineDash([]); mtx('explicação refutada', 0, 0, { s: fsz() + 3, w: 700, c: EV.cinza, bg: false }); X.restore(); }
      } else {
        const gi = Math.max(0, Math.min(3, Math.floor(p * 4))), q = p >= 1 ? 1 : fr(p * 4), G = GP[gi], thr = [...G].sort((a, b) => b - a)[2];
        const mean = G.reduce((a, b) => a + b, 0) / 6;
        G.forEach((nk, i) => { const keep = nk >= thr || gi === 3 || q < .45, cx = x + pw * (.1 + i * .16); girafa(cx, gy, s * .78, nk, cc, { a: keep ? 1 : .3, folha: nk >= 1.1 && keep }); if (!keep) xis(cx + s * .35, gy - s * .6, 12, EV.alerta); });
        nome(`geração ${gi + 1}`, x + 12, y + 36, { a: 'left', f: FD, s: 12, c: C.txt }); nome(`pescoço médio ${nbr(mean, 2)}`, x + pw - 12, y + 36, { a: 'right', f: FD, s: 12, c: cc });
        if (gi < 3 && q < .45) nome('pescoço curto: menos folhas, menos filhotes', x + pw / 2, gy + 12, { s: 12, c: C.txt });
        else nome('a população já nasce variada', x + pw / 2, gy + 12, { s: 12, c: C.txt });
      }
    });
    cap(S.msg || (p < .38 ? 'Lamarck: o pescoço estica com o uso e o filhote herdaria o esticado. Darwin: a população já nasce com pescoços variados.' : p < .8 ? 'Quem alcança mais folhas deixa mais filhotes; geração após geração a média aumenta.' : 'O lado de Lamarck termina refutado: o uso em vida não muda o DNA dos gametas.'));
  }
  const HERD = [['músculo de academia', 1, 'o corpo mudou, o DNA dos gametas não'], ['cicatriz', 1, 'é uma marca no corpo, não está no DNA dos gametas'], ['bronzeado', 1, 'a pele escurece em vida, sem mudar os gametas'], ['cor dos olhos', 0, 'está no DNA, e o DNA vai nos gametas'], ['tatuagem', 1, 'a tinta fica na pele, não no DNA'], ['mutação numa célula do ovário', 0, 'se a célula forma gametas, o alelo novo pode passar'], ['cauda cortada', 1, 'Weismann cortou caudas por gerações e os filhotes nasciam com cauda'], ['grupo sanguíneo', 0, 'é herdado, está nos alelos'], ['idioma aprendido', 1, 'aprendido em vida, não vem no DNA']];
  const BH = baralho({
    nome: 'her', dica: 'Toque num cartão e depois na caixa certa, ou arraste.',
    cartas: HERD.map(c => ({ t: c[0], k: c[1], r: c[2] })), alvos: [{ t: 'passa para os filhos', c: EV.verde }, { t: 'não passa', c: EV.cinza }],
    certo: (c, S) => { S.ins = null; return `Certo: ${c.r}. Só passa o que está no DNA das células reprodutivas.`; },
    errado: (c, al, S) => { S.ins = c.k; return `Não: ${c.r}. Só passa o que está no DNA das células reprodutivas.`; },
    fim: () => 'Tudo certo. Regra: só passa o que está no DNA das células reprodutivas.'
  });
  function drawHerd(t, S, A) {
    const wide = !NAR, bx = { x0: A.x0, y0: A.y0, x1: wide ? A.x0 + A.w * .62 : A.x1, y1: A.y1 };
    BH.draw(S, bx, { cols: 3, cartaH: NAR ? 40 : 44, slotH: NAR ? 30 : 34 });
    if (wide) {
      const x = A.x0 + A.w * .62 + 24, w = A.x1 - x, y = A.y0 + 6; panel(x, y, w, 200);
      nome('o que acontece com o DNA', x + 12, y + 16, { a: 'left', c: C.txt });
      const alt = S.ins; [['célula do corpo', alt === 1], ['gameta', alt === 0]].forEach(([n, mudou], i) => {
        const cx = x + w * (.27 + i * .46), cy = y + 90; circ(cx, cy, 36, rgba(EV.rosa, .1), EV.rosa, 1.6); nome(n, cx, y + 140, { s: 12, c: C.txt });
        rr(cx - 18, cy - 4, 36, 8, 4, rgba(EV.gelo, .5), mudou ? C.amber : EV.gelo, mudou ? 2.4 : 1); if (mudou) { circ(cx + 6, cy, 5, rgba(C.amber, .8)); } else if (alt == null) { /* sem exemplo ainda */ }
        if (i === 1 && alt === 1) nome('igual', cx, y + 158, { s: 12, c: EV.verde }); if (i === 0 && alt === 1) nome('DNA alterado', cx, y + 158, { s: 12, c: C.amber });
        if (i === 1 && alt === 0) nome('DNA alterado', cx, y + 158, { s: 12, c: C.amber }); if (i === 0 && alt === 0) nome('igual', cx, y + 158, { s: 12, c: EV.verde });
      });
      if (alt == null) nome('erre um cartão para ver o desenho', x + w / 2, y + 184, { s: 12, c: C.dim });
    }
    cap(BH.msg(S) || 'Arraste (ou toque no cartão e depois na caixa): isto passa para os filhos?');
  }
  def('ideias', 'lamarck', {
    t: 'Fixismo e Lamarck', s: 'a primeira teoria da evolução, e por que ela não se sustentou', c: EV.lamarck,
    loc: S => S.modo === 'herda' ? 'Herda ou não herda?' : 'Duas girafas', locNota: () => NOTA, still: 20,
    alt: 'a tela dividida com as girafas de Lamarck em lilás e de Darwin em verde-azulado, a primeira terminando com o selo explicação refutada, e cartões de nove características para arrastar até passa para os filhos ou não passa',
    extra: [mdE('gir', 'Duas girafas'), mdE('herda', 'Herda ou não herda?', S => BH.zera(S))], ctlVis: S => S.modo === 'gir',
    init(S) { S.modo = 'gir'; S.t0 = 0; S.msg = null; S.ins = null; BH.zera(S); },
    d: TXT.I1.d, enem: TXT.I1.enem, links: [['Lineu na Taxonomia', '../taxonomia/index.html'], ['Fatores evolutivos na Genética', '../genetica/index.html#populacoes/fatores']],
    tap(x, y, S) { if (S.modo === 'herda') BH.tap(x, y, S); },
    grab: (x, y, S) => S.modo === 'herda' && BH.grab(x, y, S), grabMove: (x, y, S) => BH.grabMove(x, y, S), grabEnd: (x, y, S) => BH.grabEnd(x, y, S),
    draw(t, S) { const A = area(); if (S.modo === 'herda') drawHerd(t, S, A); else drawGiraf(t, S, A); }
  });

  // ---------- I2: árvore da vida e seleção natural ao vivo ----------
  const ARV = [
    { id: 0, p: -1, x: .5, t: 0 }, { id: 1, p: 0, x: .3, t: .34 }, { id: 2, p: 0, x: .72, t: .34 },
    { id: 3, p: 1, x: .14, t: 1, tip: 1, n: 1 }, { id: 4, p: 1, x: .4, t: .62 }, { id: 5, p: 4, x: .3, t: 1, tip: 1, n: 2 }, { id: 6, p: 4, x: .52, t: .76, ext: 1 },
    { id: 7, p: 2, x: .62, t: .55 }, { id: 8, p: 2, x: .86, t: .6 }, { id: 9, p: 7, x: .56, t: 1, tip: 1, n: 3 }, { id: 10, p: 7, x: .7, t: .84, ext: 1 }, { id: 11, p: 8, x: .78, t: 1, tip: 1, n: 4 }, { id: 12, p: 8, x: .95, t: 1, tip: 1, n: 5 }
  ];
  const anc = id => { const L = []; for (let n = ARV[id]; n; n = ARV[n.p]) L.push(n.id); return L; };
  function drawArvore(t, S, A) {
    const p = Math.min(1, ciclo(lt(S), 12) * 1.3 + .08), wide = !NAR, tw0 = wide ? A.w * .62 : A.w, tx0 = A.x0 + 40, tw = tw0 - 50, ty0 = A.y0 + (wide ? 22 : 36), th = A.h - (wide ? 44 : 58);
    const P = n => [tx0 + tw * n.x, ty0 + th * (1 - n.t)];
    arrow(A.x0 + 14, ty0 + th, A.x0 + 14, ty0, C.dim, 1.4); nome('hoje', A.x0 + 14, ty0 - 10, { s: 12, a: 'center' }); nome('passado', A.x0 + 18, ty0 + th + 12, { s: 12, a: 'left' });
    const pk = S.pick || [], lca = pk.length === 2 ? anc(pk[0]).find(id => anc(pk[1]).includes(id)) : null, hot = lca != null ? new Set([...anc(pk[0]).slice(0, anc(pk[0]).indexOf(lca) + 1), ...anc(pk[1]).slice(0, anc(pk[1]).indexOf(lca) + 1)]) : new Set();
    ARV.slice(1).forEach(n => {
      const q = ARV[n.p], a = P(q), b = P(n), dy = Math.min(.08, (n.t - q.t) * .45), m = [b[0], P({ x: n.x, t: q.t + dy })[1]], f = seg(p, q.t, n.t), pa = [a, m, b];
      const [ex, ey] = pth(pa, f), pts = [a]; if (f > .12) pts.push(m); pts.push([ex, ey]);
      const on = hot.has(n.id), c = n.ext ? EV.cinza : mix(EV.lima, EV.ouro, q.t);
      poly(pts, on ? C.amber : c, on ? 5 : 3.4); if (n.ext && f >= 1) { const e = P(n); line(e[0] - 7, e[1] - 7, e[0] + 7, e[1] + 7, EV.cinza, 2.4); line(e[0] + 7, e[1] - 7, e[0] - 7, e[1] + 7, EV.cinza, 2.4); }
    });
    ARV.forEach(n => { if (!n.tip) return; const [x, y] = P(n); if (seg(p, ARV[n.p].t, n.t) < 1) return; const on = pk.includes(n.id); circ(x, y, 7, on ? C.amber : EV.lima, 'rgba(11,15,28,.7)', 1.5); if (on) circ(x, y, 12, null, EV.foco, 2); nome(String.fromCharCode(64 + n.n), x, y - 18, { s: 12, c: C.txt, f: FD }); hitC(x, y, 22, 't' + n.id); if (!on) pulso(S, x, y, 9); });
    if (lca != null) { const [x, y] = P(ARV[lca]); circ(x, y, 8, C.amber, '#fff', 1.5); lab(x, y, x + (wide ? 80 : -10), y - (wide ? 20 : 40), 'ancestral comum'); }
    if (p > .9 || p >= 1) nome(wide ? 'espécies atuais (toque em duas pontas)' : 'espécies atuais', tx0 + tw * .5, ty0 - 34, { s: 12, c: C.dim });
    ARV.filter(n => n.ext && seg(p, ARV[n.p].t, n.t) >= 1).forEach(n => { const e = P(n); nome('extinta', e[0] + (wide ? 14 : -14), e[1] + 1, { s: 12, c: EV.cinza, a: wide ? 'left' : 'right' }); });
    if (wide) { // caderno de 1837, redesenhado
      const x = A.x0 + tw0 + 20, w = A.x1 - x, y = A.y0 + 8; panel(x, y, w, Math.min(A.h - 16, 230)); nome('caderno de Darwin, 1837', x + 12, y + 18, { a: 'left', c: C.txt }); nome('redesenhado em traço simples', x + 12, y + 36, { a: 'left', s: 12, c: C.dim });
      const ph2 = Math.min(A.h - 16, 230), sc = Math.min(1, (ph2 - 78) / 125), cx = x + w / 2, cy = y + ph2 - 30; [[0, 0, -40, -60], [0, 0, 30, -70], [-40, -60, -70, -110], [-40, -60, -15, -105], [30, -70, 10, -120], [30, -70, 65, -115]].forEach(q => line(cx + q[0] * sc, cy + q[1] * sc, cx + q[2] * sc, cy + q[3] * sc, EV.creme, 1.8)); mtx('eu penso', cx, cy + 14, { s: 15, i: true, c: EV.creme, bg: false });
    }
    cap(S.msg || (pk.length === 2 ? 'O ponto onde os dois galhos se encontram é o ancestral comum das duas espécies.' : 'Os galhos se dividem com o tempo; a cruz cinza marca uma extinção. Toque em duas pontas para achar o ancestral comum.'));
  }
  const NB = 40, bgv = S => S.bg ? .9 : .15, bgc = S => S.bg ? '#2A211A' : '#BFA97E';
  function novaPop(S) { const R = rng(1234 + (S.sem || 0) * 77); S.rn = R; S.pop = []; for (let i = 0; i < NB; i++) S.pop.push({ v: S.nov ? .5 : .08 + R() * .84, i, nasc: -9 }); S.gen = 1; S.prevH = null; S.ev = null; S.autoN = 6; S.prox = 1.5; }
  const hist = pop => { const h = new Array(10).fill(0); pop.forEach(b => h[Math.min(9, Math.floor(b.v * 10))]++); return h; };
  function gerar(S) {
    const R = S.rn, comidos = new Set(); S.pop.forEach((b, i) => { if (R() < cl(.08 + .85 * Math.abs(b.v - bgv(S)), 0, .92)) comidos.add(i); });
    if (S.pop.length - comidos.size < 3) { comidos.clear(); }
    return comidos;
  }
  function aplica(S, comidos, t) {
    S.prevH = hist(S.pop); const sv = S.pop.filter((b, i) => !comidos.has(i));
    S.pop = S.pop.map((b, i) => { if (!comidos.has(i)) return b; const pa = sv[Math.floor(S.rn() * sv.length)]; return { v: S.nov ? .5 : cl(pa.v + (S.rn() - .5) * .14, .02, .98), i, nasc: t }; }); S.gen++; S.ev = null;
  }
  function inicia(S) { if (S.ev) return; const c = gerar(S); if (S.paused) aplica(S, c, S.ph); else S.ev = { t0: S.ph, c }; }
  function drawSel(t, S, A) {
    if (!S.pop) novaPop(S);
    if (S.ev) { const k = (S.ph - S.ev.t0) / 1.3; if (k >= 1) aplica(S, S.ev.c, S.ph); }
    else if (S.autoN > 0 && !S.paused && lt(S) > S.prox) { S.autoN--; S.prox = lt(S) + 2.4; inicia(S); }
    const bh = NAR ? 36 : 40, sh = A.h - 70 - (NAR ? bh * 2 + 6 : bh) - 16, sx = A.x0, sw = A.w, sy = A.y0;
    rr(sx, sy, sw, sh, 12, bgc(S), C.line, 1.4);
    const cols = 8, rows = 5, cwid = (sw - 20) / cols, rhei = (sh - 14) / rows, k = S.ev ? cl((S.ph - S.ev.t0) / 1.3, 0, 1) : 0, bx = lerp(sx - 24, sx + sw + 24, k);
    S.pop.forEach((b, i) => {
      const gx = sx + 10 + cwid * ((i % cols) + .5) + Math.sin(i * 7.1) * cwid * .18, gy = sy + 8 + rhei * (Math.floor(i / cols) + .5) + Math.cos(i * 3.7) * rhei * .15, gone = S.ev && S.ev.c.has(i) && gx < bx, fade = cl((S.ph - b.nasc) / .6, 0, 1);
      if (gone) return; X.save(); X.globalAlpha *= fade; ell(gx, gy, 10, 6.5, Math.sin(i) * .6, mix(EV.areia, EV.graf, b.v), 'rgba(0,0,0,.35)', 1); X.restore();
    });
    if (S.ev) bicho('ave', bx, sy + sh * .45, 46, { c: EV.gelo, f: rgba(EV.gelo, .5) });
    nome(`geração ${S.gen}`, sx + 10, sy + 8, { a: 'left', f: FD, s: 12, c: S.bg ? C.txt : '#0B0F1C', bg: false });
    // histograma
    const hy = sy + sh + 8, hh = 70, cur = hist(S.pop), mx = 22; panel(sx, hy, sw, hh);
    const bw = (sw - 20) / 10; cur.forEach((n, j) => { const ph = S.prevH ? S.prevH[j] : 0; if (ph) rr(sx + 10 + j * bw + 1, hy + hh - 6 - ph / mx * (hh - 22), bw - 2, ph / mx * (hh - 22), 2, rgba(EV.cinza, .45), null); if (n) rr(sx + 10 + j * bw + 4, hy + hh - 6 - n / mx * (hh - 22), bw - 8, n / mx * (hh - 22), 2, mix(EV.areia, EV.graf, (j + .5) / 10), EV.gelo, 1); });
    nome('claro', sx + 12, hy + 10, { a: 'left', s: 12 }); nome('escuro', sx + sw - 12, hy + 10, { a: 'right', s: 12 }); nome('cinza: geração anterior', sx + sw / 2, hy + 10, { s: 12, c: EV.cinza });
    // controles
    const ctr = [['Fundo de areia clara', EV.agua, 'b0', !S.bg], ['Fundo de tronco escuro', EV.agua, 'b1', !!S.bg], [S.nov ? 'Com variação' : 'E se não houver variação?', EV.cinza, 'nov', !!S.nov], ['Próxima geração', C.amber, 'ger', false]], cc = NAR ? 2 : 4, cbw = (A.w - (cc - 1) * 8) / cc, cy = hy + hh + 8;
    ctr.forEach((b, i) => bt(S, A.x0 + (i % cc) * (cbw + 8), cy + Math.floor(i / cc) * (bh + 6), cbw, bh, b[0], b[1], b[2], b[3]));
    cap(S.msg || (S.nov ? 'Sem variação, todos têm a mesma cor: a ave come ao acaso e a população não muda de direção.' : 'A ave come quem mais contrasta com o fundo; os sobreviventes deixam filhotes de cor parecida. Troque o fundo no meio da simulação.'));
  }
  def('ideias', 'darwin', {
    t: 'Darwin, Wallace e a seleção natural', s: 'o ambiente não cria a característica, ele favorece algumas das que já existem', c: EV.darwin,
    loc: S => S.modo === 'sel' ? 'Seleção natural ao vivo' : 'Árvore da vida', locNota: S => S.modo === 'sel' ? SIM : NOTA, still: 20,
    alt: 'uma árvore da vida que se ramifica com cruzes nas extinções, onde duas pontas tocadas acendem o ancestral comum, e uma população de besouros de cores variadas sobre um fundo escolhido, com uma ave e um histograma de cores que se desloca a cada geração',
    extra: [mdE('arv', 'Árvore da vida'), mdE('sel', 'Seleção natural ao vivo', S => { novaPop(S); })],
    ctlVis: S => S.modo === 'arv',
    init(S) { S.modo = 'arv'; S.t0 = 0; S.msg = null; S.pick = []; S.bg = 0; S.nov = 0; S.sem = (S.sem || 0) + 1; S.pop = null; },
    d: TXT.I2.d, enem: TXT.I2.enem, links: [['Hardy-Weinberg na Genética', '../genetica/index.html#populacoes/hardy-weinberg'], ['Cladograma na Taxonomia', '../taxonomia/index.html#cladistica/cladograma']],
    tap(x, y, S) {
      const h = hid(x, y); if (!h) return; flash(S, h);
      if (S.modo === 'arv') { if (h[0] === 't') { const id = +h.slice(1); S.pick = S.pick.includes(id) ? S.pick.filter(q => q !== id) : S.pick.length >= 2 ? [id] : S.pick.concat(id); } return; }
      if (h === 'b0' || h === 'b1') { S.bg = +h[1]; S.autoN = Math.max(S.autoN, 0); } else if (h === 'nov') { S.nov = S.nov ? 0 : 1; novaPop(S); S.autoN = 0; } else if (h === 'ger') { S.autoN = 0; inicia(S); }
    },
    draw(t, S) { const A = area(); if (S.modo === 'sel') drawSel(t, S, A); else drawArvore(t, S, A); }
  });

  // ---------- V1: fósseis e datação ----------
  const ROCHA = ['#8A6A4A', '#9AA3B2', '#FFE1A6', '#8A6A4A', '#9AA3B2'];
  function peixe(x, y, s, c, esq, a = 1) {
    X.save(); X.globalAlpha *= a; ell(x, y, s, s * .38, 0, esq ? 'rgba(0,0,0,0)' : rgba(c, .3), c, 1.8); shape([[x - s * .95, y], [x - s * 1.4, y - s * .45], [x - s * 1.4, y + s * .45]], esq ? null : rgba(c, .3), c, 1.8);
    if (esq) { line(x - s * .8, y, x + s * .7, y, c, 1.6); for (let i = -3; i <= 3; i++) line(x + i * s * .2, y - s * .28, x + i * s * .2, y + s * .28, c, 1.2); circ(x + s * .72, y, s * .16, null, c, 1.6); } else circ(x + s * .55, y - s * .06, 2.2, '#0B0F1C');
    X.restore();
  }
  function drawLago(t, S, A) {
    const p = ciclo(lt(S), 12), wide = !NAR, ry = reguaGeo(A.x0, A.y0 + 18, A.w, .375, {}), sy = ry + 2, sh = A.y1 - sy + 36, sx = A.x0, sw = A.w;
    rr(sx, sy, sw, sh, 10, '#101A2E', C.line, 1.2); X.save(); X.beginPath(); X.roundRect(sx, sy, sw, sh, 10); X.clip();
    const bed = sy + sh * .7, lay = sh * .085, fx = sx + sw * .5, seca = seg(p, .6, .7);
    if (seca < 1) rect(sx, sy + sh * .12, sw, bed - sy - sh * .12, rgba(EV.agua, .3 * (1 - seca)));
    rect(sx, bed, sw, sy + sh - bed, '#3A2F22');
    // peixe
    const vivo = p < .12, afunda = seg(p, .1, .24), pey = vivo ? sy + sh * .3 + Math.sin(t * 2) * 4 : lerp(sy + sh * .3, bed - 10, ss(afunda)), pex = vivo ? lerp(sx + sw * .3, fx, p / .12) : fx, esq = p > .5;
    // camadas (de baixo para cima)
    const nl = 4, depo = seg(p, .24, .5), rocha = seg(p, .6, .78), er = seg(p, .78, .92);
    for (let i = 0; i < nl; i++) { const k = cl(depo * nl - i, 0, 1), h = lay * k, c = [EV.solo, EV.cinza, EV.creme, '#7A5C3C'][i], top = bed - i * lay - h; if (k > 0) { rect(sx, top, sw, h, rgba(c, .55 + .2 * rocha)); if (rocha > 0) for (let j = 0; j < 4; j++) line(sx, top + h * (j + .5) / 4, sx + sw, top + h * (j + .5) / 4, rgba('#0B0F1C', .25 * rocha), 1); } }
    const peixeMin = mix(EV.creme, '#D9A441', seg(p, .5, .66)); if (p >= .1) peixe(pex, pey, 15, esq ? peixeMin : EV.gelo, esq, 1); else peixe(pex, pey, 15, EV.gelo, false);
    // erosão: o vale expõe o fóssil
    if (er > 0) { const cut = bed - 10 - lay * 0 , top0 = bed - lay * nl, depth = lerp(top0, cut - 18, er), w2 = sw * .26 * er + 20; X.beginPath(); X.moveTo(fx - w2 - 30, top0 - 2); X.lineTo(fx - w2, top0); X.lineTo(fx - w2 * .35, depth); X.lineTo(fx + w2 * .35, depth); X.lineTo(fx + w2, top0); X.lineTo(fx + w2 + 30, top0 - 2); X.lineTo(fx + w2 + 30, top0 - lay * nl - 20); X.lineTo(fx - w2 - 30, top0 - lay * nl - 20); X.closePath(); X.fillStyle = '#101A2E'; X.fill(); if (esq) peixe(fx, bed - 10, 15, peixeMin, true); }
    X.restore();
    // paleontólogo
    const pa = seg(p, .9, .98); if (pa > 0) { const x = fx + 46 + (1 - pa) * 40, y = bed - 34; circ(x, y - 22, 7, rgba(C.txt, .2), C.txt, 1.6); line(x, y - 15, x, y + 6, C.txt, 2); line(x, y - 8, x - 12, y - 2, C.txt, 2); line(x - 12, y - 2, x - 18, y + 6, C.txt, 2.4); line(x, y + 6, x - 5, y + 20, C.txt, 2); line(x, y + 6, x + 6, y + 20, C.txt, 2); }
    const mi = Math.round(p * 100 / 10) * 10; nome(mi < 10 ? 'agora' : `cerca de ${mi} milhões de anos depois`, sx + 12, sy + 14, { a: 'left', f: FD, s: 12, c: C.txt });
    nome(p < .2 ? 'o peixe morre e afunda' : p < .5 ? 'camadas de sedimento cobrem o corpo' : p < .65 ? 'minerais substituem o osso' : p < .78 ? 'as camadas viram rocha' : p < .9 ? 'a erosão expõe o fóssil' : 'um paleontólogo encontra o fóssil', NAR ? sx + 12 : sx + sw - 12, NAR ? sy + 30 : sy + 14, { a: NAR ? 'left' : 'right', s: 12, c: C.dim });
    if (!NAR || sw > 300) { lab(sx + sw * .1, bed + lay * .6, sx + sw * .1, bed + 40, 'camada mais antiga embaixo'); }
    cap(S.msg || (p < .24 ? 'Um peixe morre e afunda no fundo de um lago.' : p < .5 ? 'Lama e areia cobrem o corpo, camada sobre camada.' : p < .78 ? 'Minerais da água substituem o osso aos poucos e as camadas viram rocha.' : 'A rocha se desgasta e o fóssil aparece. Poucos seres viram fóssil.'));
  }
  const ATM = { c14: { n: 'carbono-14', h: 5730, f: k => nbr(5730 * k), u: 'anos', filho: 'nitrogênio-14', nota: 'serve para restos de até cerca de 50 mil anos' }, k40: { n: 'potássio-40', h: 1.25, f: k => nbr(1.25 * k, 2), u: 'bilhões de anos', filho: 'argônio-40', nota: 'serve para rochas de milhões e bilhões de anos' } };
  const DECAI = (() => { const R = rng(99), a = []; for (let i = 0; i < 64; i++) a.push(-Math.log(1 - R() * .985) / Math.LN2); return a; })();
  function drawRelogio(t, S, A) {
    const at = ATM[S.at], tau = Math.min(5.6, lt(S) * .45), wide = !NAR, jw = wide ? A.w * .36 : Math.min(A.w * .5, 190), jy = A.y0 + 40, gs = Math.min(jw / 9, (wide ? A.h - 110 : A.h * .34) / 9);
    bt(S, A.x0, A.y0, wide ? 140 : (A.w - 8) / 2, 34, 'carbono-14', EV.ouro, 'a0', S.at === 'c14'); bt(S, A.x0 + (wide ? 148 : (A.w - 8) / 2 + 8), A.y0, wide ? 160 : (A.w - 8) / 2, 34, 'potássio-40', EV.ouro, 'a1', S.at === 'k40');
    const jx = A.x0 + 4; rr(jx, jy, gs * 8.4, gs * 8.4, 10, 'rgba(19,26,43,.7)', C.line, 1.4);
    let rest = 0; for (let i = 0; i < 64; i++) { const x = jx + gs * (.7 + (i % 8)), y = jy + gs * (.7 + (i >> 3)), dec = tau > DECAI[i]; if (!dec) rest++; circ(x, y, gs * .34, dec ? rgba(EV.cinza, .5) : EV.verde, 'rgba(11,15,28,.6)', 1); }
    const rows = [['átomo-mãe', EV.verde], [`átomo-filho (${at.filho})`, EV.cinza]]; rows.forEach(([n, c], i) => { circ(jx + 6, jy + gs * 8.4 + 14 + i * 16, 5, c); nome(n, jx + 16, jy + gs * 8.4 + 14 + i * 16, { a: 'left', s: 12, c: C.txt }); });
    // gráfico
    const gx = wide ? A.x0 + A.w * .4 + 20 : A.x0 + jw + 20, gw = A.x1 - gx - 4, gy = wide ? A.y0 + 48 : A.y0 + 44, gh = wide ? A.h - 130 : A.h * .36, ax = gx + 30, aw = gw - 40, ay = gy + gh;
    panel(gx - 6, gy - 22, gw + 12, gh + 56, {}); nome('átomos-mãe que restam', gx + 2, gy - 8, { a: 'left', s: 12, c: C.txt });
    const X5 = k => ax + aw * k / 5.6, Y = n => ay - gh * n / 64; line(ax, ay, ax + aw, ay, C.line, 1.2); line(ax, ay, ax, gy, C.line, 1.2);
    const cv0 = []; for (let i = 0; i <= 56; i++) cv0.push([X5(i / 10), Y(64 * Math.pow(.5, i / 10))]); poly(cv0, rgba(EV.ouro, .4), 2, [4, 4]);
    const real = []; for (let i = 0; i <= Math.round(tau * 10); i++) { const k = i / 10, n = DECAI.filter(d => d > k).length; real.push([X5(k), Y(n)]); } if (real.length > 1) poly(real, EV.ouro, 3);
    [[1, 32, 'metade'], [2, 16, 'um quarto'], [3, 8, 'um oitavo']].forEach(([k, n, s]) => { const on = tau >= k; line(ax, Y(n), X5(k), Y(n), rgba(EV.ouro, on ? .6 : .2), 1, [3, 3]); line(X5(k), Y(n), X5(k), ay, rgba(EV.ouro, on ? .6 : .2), 1, [3, 3]); if (on) { circ(X5(k), Y(n), 4, C.amber); nome(s, X5(k) + 6, Y(n) - 10, { a: 'left', s: 12, c: C.txt }); } nome(`${k}`, X5(k), ay + 12, { s: 12, f: FD, c: C.dim }); });
    nome('meias-vidas', ax + aw / 2, ay + 28, { s: 12, c: C.dim });
    const tt = tau < .05 ? 'no começo' : `cerca de ${at.f(tau)} ${at.u}`;
    nome(`${at.n}: meia-vida de cerca de ${at.f(1)} ${at.u}`, A.x0, A.y1 + 2 - (wide ? 4 : 0) + (wide ? 8 : -6), { a: 'left', s: 12, c: C.txt }); // dica no rodapé do palco
    cap(S.msg || `<span class="q">${tt}</span>: restam ${rest} de 64 átomos-mãe. O ${at.n} ${at.nota}.`);
  }
  const FOS = [['planta com flor', 0, 'plantas com flores só aparecem em camadas recentes'], ['Archaeopteryx', 1, 'cerca de 150 milhões de anos, perto do topo'], ['Tiktaalik', 2, 'cerca de 375 milhões de anos, no meio'], ['trilobita', 3, 'um animal marinho muito antigo, bem fundo'], ['estromatólito', 4, 'cerca de 3,5 bilhões de anos, na camada mais funda']], ORD = [2, 4, 0, 3, 1], PROP = [.94, .82, .62, .4, .13];
  function soltaCam(S, i, h) {
    if (!h || h[0] !== 'l') { S.sel = null; return; } const row = +h.slice(1); S.sel = null;
    if (S.pl[row] != null) { S.msg = 'Essa camada já tem um fóssil.'; return; }
    if (FOS[i][1] === row) { S.pl[row] = i; S.msg = `Certo: ${FOS[i][0]}, ${FOS[i][2]}. A camada de baixo é mais antiga, e tem menos átomos-mãe.`; if (S.pl.every(v => v != null)) S.msg = 'Tudo no lugar: do mais recente (em cima) ao mais antigo (embaixo), e a proporção de átomos-mãe confirma a ordem.'; }
    else { S.bump = { i, t: performance.now() }; S.msg = `Ainda não: ${FOS[i][0]}, ${FOS[i][2]}. Lembre: a camada mais funda é a mais antiga.`; }
  }
  const dragCam = mkdrag('f', soltaCam);
  function drawCam(t, S, A) {
    const wide = !NAR, cw = wide ? A.w * .36 : A.w, ch = NAR ? 36 : 42, left = A.x0, ly0 = wide ? A.y0 : A.y0 + Math.ceil(5 / 2) * (ch + 6) + 4, lx = wide ? A.x0 + cw + 20 : A.x0, lw = wide ? A.x1 - lx : A.w, lh = (A.y1 + 40 - ly0 - 20) / 5;
    ORD.forEach((i, k) => {
      if (S.pl.includes(i)) return; const f = FOS[i], x = left + (wide ? 0 : (k % 2) * (cw / 2 + 4)), y = A.y0 + (wide ? k * (ch + 8) : Math.floor(k / 2) * (ch + 6)), w = wide ? cw : cw / 2 - 4, sel = S.sel === i, bump = S.bump && S.bump.i === i && performance.now() - S.bump.t < 500 ? Math.sin((performance.now() - S.bump.t) * .06) * 5 : 0;
      let px = x + bump, py = y; if (S.dr && S.dr.i === i) { px = S.dr.x - w / 2; py = S.dr.y - ch / 2; }
      rr(px, py, w, ch, 8, 'rgba(19,26,43,.94)', sel ? C.amber : 'rgba(157,169,196,.5)', sel ? 2.5 : 1.3); mtx(f[0], px + w / 2, py + ch / 2, { s: fsz(), w: 600, c: C.txt, bg: false }); if (!(S.dr && S.dr.i === i)) hitR(x, y, w, ch, 'f' + i); if (isf(S, 'f' + i)) rr(px - 2, py - 2, w + 4, ch + 4, 10, null, EV.foco, 2);
    });
    for (let r = 0; r < 5; r++) {
      const y = ly0 + r * lh, f = S.pl[r], c = ROCHA[r]; rr(lx, y, lw, lh - 3, 6, rgba(c, .32), S.sel != null || S.dr ? C.amber : rgba(c, .9), S.sel != null ? 1.8 : 1.2); hitR(lx, y, lw, lh - 3, 'l' + r);
      nome(r === 0 ? 'camada 1, mais recente' : r === 4 ? 'camada 5, mais antiga' : `camada ${r + 1}`, lx + 8, y + 12, { a: 'left', s: 12, c: C.txt });
      if (f != null) mtx(`<b>${FOS[f][0]}</b>`, lx + 8, y + lh - 16, { s: fsz(), a: 'left', c: EV.verde, bg: false });
      const bw = Math.min(lw * .34, 110), bx = lx + lw - bw - 8; rr(bx, y + lh / 2 - 7, bw, 12, 6, 'rgba(11,15,28,.7)', C.line, 1); rr(bx, y + lh / 2 - 7, bw * PROP[r], 12, 6, EV.verde, null); nome('átomos-mãe', bx + bw / 2, y + lh / 2 - 16, { s: 12, c: C.dim });
    }
    cap(S.msg || 'Arraste cada fóssil para a camada certa (ou toque no fóssil e depois na camada). A barra mostra quanto átomo-mãe resta.');
  }
  def('evidencias', 'fosseis', {
    t: 'Fósseis e datação', s: 'as rochas guardam a ordem, os átomos guardam a idade', c: EV.ouro,
    loc: S => ({ lago: 'Como nasce um fóssil', rel: 'Relógio atômico', cam: 'Camadas de rocha' })[S.modo], locNota: S => S.modo === 'rel' ? SIM : NOTA, still: 40,
    alt: 'um corte de lago em que um peixe afunda, é coberto por camadas, vira fóssil e é exposto pela erosão, um pote de 64 átomos que decaem com o gráfico de meias-vidas e um paredão de camadas onde o aluno posiciona cinco fósseis',
    extra: [mdE('lago', 'Como nasce um fóssil'), mdE('rel', 'Relógio atômico'), mdE('cam', 'Camadas de rocha', S => { S.pl = [null, null, null, null, null]; S.sel = null; S.dr = null; })], ctlVis: S => S.modo === 'lago',
    init(S) { S.modo = 'lago'; S.t0 = 0; S.msg = null; S.at = 'c14'; S.pl = [null, null, null, null, null]; S.sel = null; S.dr = null; },
    d: TXT.V1.d, enem: TXT.V1.enem, links: [['Animais: novidades evolutivas', '../plantas-animais/index.html#animalia/novidades'], ['Plantas e a conquista da terra', '../plantas-animais/index.html#plantae/conquista']],
    tap(x, y, S) {
      const h = hid(x, y); if (!h) return; flash(S, h);
      if (S.modo === 'rel' && h[0] === 'a') { S.at = h === 'a0' ? 'c14' : 'k40'; S.t0 = agora(S); S.msg = null; }
      else if (S.modo === 'cam') { if (h[0] === 'f') S.sel = S.sel === +h.slice(1) ? null : +h.slice(1); else if (h[0] === 'l' && S.sel != null) soltaCam(S, S.sel, h); }
    },
    grab: (x, y, S) => S.modo === 'cam' && dragCam.grab(x, y, S), grabMove: (x, y, S) => dragCam.grabMove(x, y, S), grabEnd: (x, y, S) => dragCam.grabEnd(x, y, S),
    draw(t, S) { const A = area(); if (S.modo === 'rel') drawRelogio(t, S, A); else if (S.modo === 'cam') drawCam(t, S, A); else drawLago(t, S, A); }
  });

  // ---------- V2: corpos, embriões e moléculas ----------
  const OSSO = { um: EV.ouro, ru: EV.darwin, pu: EV.rosa, de: EV.violeta };
  const MEMB = [{ n: 'braço humano', u: 1, a: .95, d: .45, w: 5, f: .5, s: 0 }, { n: 'asa de morcego', u: .8, a: 1.5, d: 1.7, w: 2.5, f: .95, s: .5 }, { n: 'nadadeira de baleia', u: .45, a: .5, d: .75, w: 7, f: .28, s: .6 }, { n: 'pata de gato', u: .95, a: .9, d: .4, w: 5, f: .35, s: 0 }];
  const mixM = (a, b, k) => { const o = {}; for (const q in a) o[q] = typeof a[q] === 'number' ? lerp(a[q], b[q], k) : (k < .5 ? a[q] : b[q]); return o; };
  function membro(x, y, L, m, o = {}) {
    const k = o.k || 1, ky = o.ky || .9; X.save(); X.lineCap = 'round'; const ux = x + m.u * L, ax = ux + m.a * L, y0 = y, off = 4 + m.w * .3;
    if (m.s > .02) { const P = [[ax, y0]]; for (let i = 0; i < 5; i++) { const ang = -m.f + 2 * m.f * i / 4; P.push([ax + Math.cos(ang) * m.d * L, y0 + Math.sin(ang) * m.d * L * ky]); } X.beginPath(); X.moveTo(ux, y0 - off); X.lineTo(ax, y0 - off); P.forEach(q => X.lineTo(q[0], q[1])); X.lineTo(ax, y0 + off); X.lineTo(ux, y0 + off); X.closePath(); X.fillStyle = rgba(EV.gelo, .12 * m.s / .6); X.fill(); X.strokeStyle = rgba(EV.gelo, .35); X.lineWidth = 1; X.stroke(); }
    line(x, y0, ux, y0, OSSO.um, 7 * k); line(ux, y0 - off * .6 * k, ax, y0 - off * .6 * k, OSSO.ru, 4.5 * k); line(ux, y0 + off * .6 * k, ax, y0 + off * .6 * k, OSSO.ru, 4.5 * k);
    circ(ax, y0, 6 * k, OSSO.pu, 'rgba(11,15,28,.6)', 1); for (let i = 0; i < 5; i++) { const ang = -m.f + 2 * m.f * i / 4; line(ax, y0, ax + Math.cos(ang) * m.d * L, y0 + Math.sin(ang) * m.d * L * ky, OSSO.de, m.w * k); }
    X.restore();
  }
  const BONES = [['úmero', OSSO.um], ['rádio e ulna', OSSO.ru], ['punho', OSSO.pu], ['dedos', OSSO.de]];
  function legOsso(x, y, vert) { BONES.forEach(([n, c], i) => { const w = mtw(n, 12, 600) + 22, xx = vert ? x : x + BONES.slice(0, i).reduce((a, b) => a + mtw(b[0], 12, 600) + 34, 0), yy = vert ? y + i * 18 : y; rr(xx, yy - 5, 12, 10, 3, c, null); mtx(n, xx + 18, yy, { s: 12, w: 600, a: 'left', c: C.txt, bg: false }); }); }
  function drawOssos(t, S, A) {
    const l = lt(S), tt = l / 4.4, auto = S.man == null; if (auto) S.cur = tt >= 4 ? 3 : Math.floor(tt) + (Math.floor(tt) < 3 ? ss(seg(fr(tt), .62, 1)) : 0); else S.cur = lerp(S.cur == null ? 0 : S.cur, S.man, 1 - Math.exp(-7 * Math.max(S.dt || 0, .016)));
    const i = Math.min(2, Math.floor(S.cur)), k = ss(S.cur - i), m = mixM(MEMB[i], MEMB[Math.min(3, i + 1)], S.cur >= 3 ? 0 : k), zt = A.y0 + 34, zb = A.y1 - 80, L = Math.min(A.w * .84 / 3.8, 120), cy = (zt + zb) / 2 - 40, ky = Math.min(.9, (zb - zt) / 2 / (1.4 * L));
    legOsso(A.x0 + 2, A.y0 + 8, NAR ? false : false);
    const mx0 = A.cx - (m.u + m.a + m.d * .8) * L / 2 - L * .2, ly = cy + 40, kk = Math.max(1, L / 55); membro(mx0, ly, L, m, { k: kk, ky });
    { const ux = mx0 + m.u * L, ax = ux + m.a * L, dy = Math.max(26, 16 * kk);
      lab(mx0 + m.u * L * .5, ly, mx0 + m.u * L * .5 - 12, ly - 46, 'úmero'); lab(ux + m.a * L * .5, ly - 3 * kk, ux + m.a * L * .5 - 40, ly - 46, 'rádio e ulna'); lab(ax, ly, ax - 4, ly - 72, 'punho'); lab(ax + m.d * L * .7, ly - m.d * L * ky * .45, ax + m.d * L * .7 + 24, ly - 46, 'dedos'); }
    const nm = MEMB[Math.round(S.cur)].n; title(nm, A.cx, A.y1 - 60, A.w - 20, { s: fsz() + 5, c: C.txt });
    const bw = (A.w - 3 * 8) / 4; MEMB.forEach((q, j) => { const on = Math.round(S.cur) === j; bt(S, A.x0 + j * (bw + 8), A.y1 - 44, bw, NAR ? 40 : 40, q.n, EV.ouro, 'm' + j, on); });
    cap(S.msg || 'Os quatro membros têm os mesmos ossos na mesma ordem, herdados de um ancestral comum: homologia. Toque num membro para ver a transformação.');
  }
  function drawAnalogia(t, S, A) {
    const wide = !NAR, pw = wide ? (A.w - 12) / 2 : A.w, ph = wide ? A.h : (A.h - 10) / 2;
    [0, 1].forEach(k => {
      const x = A.x0 + (wide ? k * (pw + 12) : 0), y = A.y0 + (wide ? 0 : k * (ph + 10)); panel(x, y, pw, ph); title(k ? 'asa de borboleta' : 'asa de ave', x + 12, y + 18, pw - 24, { a: 'left', c: C.txt, s: fsz() + 2 });
      const cx = x + pw * .5, cy = y + ph * .55;
      if (!k) { const L = Math.min(pw / 5.2, ph / 2.6); membro(cx - pw * .38, cy, L, { u: .9, a: 1.1, d: .9, w: 3, f: .35, s: 0 }); for (let i = 0; i < 7; i++) line(cx - pw * .38 + 2 * L + i * L * .12, cy + 6, cx - pw * .38 + 2 * L + i * L * .16 + L * .9, cy + 22 + i * 4, rgba(EV.gelo, .55), 3); nome('ossos do braço (como no morcego)', cx, y + ph - 12, { s: 12, c: C.dim }); }
      else { const sc = Math.min(pw / 4.4, ph / 2.4); X.save(); X.translate(cx, cy); X.beginPath(); X.moveTo(-sc * 1.2, 0); X.bezierCurveTo(-sc * .8, -sc * 1.0, sc * .6, -sc * .9, sc * 1.1, -sc * .2); X.bezierCurveTo(sc * 1.0, sc * .5, sc * .3, sc * .6, -sc * 1.2, 0); X.fillStyle = rgba('#F25C3B', .25); X.fill(); X.strokeStyle = '#F25C3B'; X.lineWidth = 2; X.stroke(); for (let i = 0; i < 5; i++) line(-sc * 1.2, 0, sc * (.5 + i * .12), -sc * .7 + i * sc * .28, rgba(EV.cinza, .9), 1.6); X.restore(); nome('membrana com nervuras, sem esses ossos', cx, y + ph - 12, { s: 12, c: C.dim }); }
    });
    const lx = wide ? A.cx : A.cx, ly = wide ? A.y0 + A.h * .5 : A.y0 + ph + 5; tok(lx, ly, 'análoga: mesma função, origem diferente', EV.laR, { s: 13 });
    cap(S.msg || 'As duas asas servem para voar, mas não vêm do mesmo órgão: é a convergência. Só a homologia indica parentesco.');
  }
  const SPEC = [['chimpanzé', 0], ['cachorro', 10], ['galinha', 13], ['sapo', 18], ['levedura', 44]], DIFS = SPEC.map((s, i) => { const R = rng(31 + i * 17), set = new Set(); while (set.size < s[1]) set.add(Math.floor(R() * 104)); return set; });
  function drawSeq(t, S, A) {
    const wide = !NAR, cols = 13, rowsN = 8, chW = wide ? (A.w * .46 - 16) / 3 : (A.w - 16) / 3, ch = NAR ? 32 : 36;
    SPEC.forEach(([n], i) => bt(S, A.x0 + (i % 3) * (chW + 8), A.y0 + Math.floor(i / 3) * (ch + 6), chW, ch, n, EV.ouro, 's' + i, S.sp.includes(i)));
    const gy0 = A.y0 + 2 * (ch + 6) + 6, gw = wide ? A.w * .46 : A.w, cell = Math.min(gw / cols, (A.y1 + 36 - gy0 - (wide ? 40 : 100)) / rowsN, 26), last = S.sp.length ? S.sp[S.sp.length - 1] : null, gx = A.x0;
    nome('proteína humana (citocromo c), 104 posições', gx, gy0 + 6, { a: 'left', s: 12, c: C.txt });
    for (let i = 0; i < 104; i++) { const x = gx + (i % cols) * cell, y = gy0 + 18 + Math.floor(i / cols) * cell, d = last != null && DIFS[last].has(i); rr(x + 1, y + 1, cell - 2, cell - 2, 3, d ? C.amber : 'rgba(157,169,196,.25)', d ? '#fff' : null, 1); }
    if (last != null) { const n = SPEC[last][1]; mtx(`<b>humano e ${SPEC[last][0]}</b>: ${n === 0 ? 'nenhuma diferença' : 'cerca de ' + n + ' diferenças'}`, gx, gy0 + 22 + rowsN * cell + 14, { s: fsz() + 1, a: 'left', c: C.amber, bg: false }); }
    // cladograma que se monta sozinho (humano embaixo; mais diferenças, galho mais antigo)
    const tx0 = wide ? A.x0 + A.w * .52 : A.x0, tw = wide ? A.x1 - tx0 - 70 : A.w - 80, ty0 = wide ? A.y0 + 6 : gy0 + 22 + rowsN * cell + 40, th = wide ? A.h - 10 : Math.max(60, A.y1 + 36 - ty0), tips = [4, 3, 2, 1, 0], rowH = th / 6;
    if (wide || th > 60) {
      const hy = ty0 + rowH * 5.5, x1 = tx0 + tw; line(tx0, hy, x1, hy, EV.agua, 3); mtx('<b>humano</b>', x1 + 8, hy, { s: fsz(), a: 'left', c: C.txt, bg: false });
      tips.forEach((si, r) => { if (!S.sp.includes(si)) return; const d = SPEC[si][1], bx = tx0 + tw * (1 - d / 50) - (d === 0 ? 0 : 0), by = ty0 + rowH * (r + .5); line(bx, hy, bx, by, EV.ouro, 3); line(bx, by, x1, by, EV.ouro, 3); mtx(SPEC[si][0], x1 + 8, by, { s: fsz(), a: 'left', c: C.txt, bg: false }); circ(bx, hy, 4, C.amber); });
      nome('mais diferenças, galho mais antigo', tx0, ty0 + th + 2 - (wide ? 4 : 0), { a: 'left', s: 12, c: C.dim });
    }
    cap(S.msg || (last == null ? 'Escolha um ser para comparar com a proteína humana. Trecho ilustrativo; números aproximados.' : 'Quanto menos diferenças, mais próximo o parentesco. Cada comparação acrescenta um galho à árvore.'));
  }
  def('evidencias', 'comparacao', {
    t: 'Corpos, embriões e moléculas', s: 'parentes guardam semelhanças, mesmo quando a função mudou', c: EV.ouro,
    loc: S => ({ oss: 'Mesmo osso, outra função', ana: 'Mesma função, outra origem', seq: 'Contador de diferenças' })[S.modo], locNota: S => S.modo === 'seq' ? 'Trecho ilustrativo, números aproximados' : NOTA, still: 40,
    alt: 'quatro membros com os ossos coloridos que se transformam um no outro, a asa da ave ao lado da asa da borboleta marcada como análoga, e uma fita de proteína humana comparada com outros seres, que monta uma árvore',
    extra: [mdE('oss', 'Mesmo osso, outra função', S => { S.man = null; }), mdE('ana', 'Mesma função, outra origem'), mdE('seq', 'Contador de diferenças')], ctlVis: S => S.modo === 'oss',
    init(S) { S.modo = 'oss'; S.t0 = 0; S.msg = null; S.man = null; S.cur = 0; S.sp = []; },
    d: TXT.V2.d, enem: TXT.V2.enem, links: [['Homologia e analogia na Taxonomia', '../taxonomia/index.html#cladistica/homologia'], ['Embriologia comparada', '../embriologia/index.html'], ['Cladograma na Taxonomia', '../taxonomia/index.html#cladistica/cladograma']],
    tap(x, y, S) { const h = hid(x, y); if (!h) return; flash(S, h); if (S.modo === 'oss' && h[0] === 'm') { S.man = +h.slice(1); S.msg = null; } else if (S.modo === 'seq' && h[0] === 's') { const i = +h.slice(1); S.sp = S.sp.includes(i) ? S.sp.filter(q => q !== i) : S.sp.concat(i); } },
    draw(t, S) { const A = area(); if (S.modo === 'ana') drawAnalogia(t, S, A); else if (S.modo === 'seq') drawSeq(t, S, A); else drawOssos(t, S, A); }
  });

  // ---------- V3: resistência a antibióticos ----------
  const NPL = NAR ? 70 : 110, PLQ = (() => { const R = rng(21), a = [], ord = []; for (let i = 0; i < 130; i++) { const r = Math.sqrt((i + .5) / 130) * .93, th = i * 2.39996 + R() * .4; a.push({ x: Math.cos(th) * r, y: Math.sin(th) * r, u: R(), o: R() }); ord.push(i); } for (let i = ord.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [ord[i], ord[j]] = [ord[j], ord[i]]; } return { a, ord }; })();
  function drawPlaca(t, S, A) {
    const p = ciclo(lt(S), 10), wide = !NAR, N = NPL, R = Math.min(A.h * (wide ? .46 : .36), A.w * (wide ? .26 : .42)), cx = wide ? A.x0 + A.w * .3 : A.cx, cy = A.y0 + (wide ? A.h * .5 : R + 16);
    circ(cx, cy, R + 6, 'rgba(207,224,255,.06)', 'rgba(207,224,255,.55)', 3); circ(cx, cy, R, 'rgba(255,225,166,.12)', null);
    const n0 = Math.round(N * .6), drop = seg(p, .22, .38), fadeB = seg(p, .4, .58), div = ss(seg(p, .58, .96));
    let res = 0, tot = 0; const ord = PLQ.ord.slice(0, N);
    ord.forEach((id, i) => {
      const q = PLQ.a[id], x = cx + q.x * R, y = cy + q.y * R; const inic = i < n0, r0 = inic && q.o < .06, vis = inic || i < n0 + (N - n0) * div; if (!vis) return;
      if (r0 || (!inic)) { if (r0 || div > 0) { res++; tot++; ell(x, y, 5.5, 3.6, i, rgba(EV.laR, .9), 'rgba(11,15,28,.6)', 1); } return; }
      const gone = fadeB > q.u * .9 + .05; if (gone) return; tot++; ell(x, y, 5.5, 3.6, i, rgba(EV.azS, .95 - fadeB * .3), 'rgba(11,15,28,.6)', 1);
    });
    if (drop > 0) { circ(cx, cy - R * (1 - drop) * .1, R * drop, rgba(EV.gelo, .1), rgba(EV.gelo, .55), 1.5); if (drop < 1) { circ(cx, cy - R - 30 + drop * 30, 6, EV.gelo, null); } nome('gota de antibiótico', cx, cy - R - 14, { s: 12, c: C.txt }); }
    // troca de plasmídeo
    const pa = PLQ.a[ord.find((id, i) => i < n0 && PLQ.a[id].o < .06)], nb = PLQ.a[ord[2]];
    if (p < .22 && pa) { const x1 = cx + pa.x * R, y1 = cy + pa.y * R, x2 = x1 + 26, y2 = y1 + 20; qarrow(x1 + 4, y1 - 3, x1 + 20, y1 - 20, x2, y2 - 6, C.amber, 1.6); const f = fr(lt(S) * .8), q = qpt(x1 + 4, y1 - 3, x1 + 20, y1 - 20, x2, y2 - 6, f); circ(q[0], q[1], 3.5, null, C.amber, 1.6); lab(x2, y2, wide ? cx - R - 16 : cx, wide ? y2 : cy - R - 24, 'troca de plasmídeo'); }
    // barras
    const bx = wide ? A.x0 + A.w * .6 : A.x0 + 10, by = wide ? A.y0 + 30 : cy + R + 28, bh = wide ? A.h * .6 : Math.max(60, A.y1 + 36 - by - 30), pw = wide ? Math.min(150, (A.x1 - bx - 40) / 2) : (A.w - 40) / 2;
    const antes = Math.round(100 * (ord.slice(0, n0).filter(id => PLQ.a[id].o < .06).length / n0)), depois = tot ? Math.round(100 * res / tot) : 0, pcs = [['antes', antes, EV.laR], ['depois', p < .22 ? antes : depois, EV.laR]];
    panel(bx - 10, by - 24, wide ? A.x1 - bx + 10 : A.w - 0, bh + 52); nome('bactérias resistentes na placa', bx, by - 10, { a: 'left', s: 12, c: C.txt });
    pcs.forEach(([n, v, c], i) => { const x = bx + 20 + i * (pw + 20), fut = i === 1 && p < .22, hh = Math.max(2, bh * v / 100); if (fut) { rr(x, by + bh - hh, pw * .6, hh, 4, null, rgba(c, .7), 1.6); X.save(); X.setLineDash([5, 4]); rr(x, by + bh - hh, pw * .6, hh, 4, null, C.panel || '#131A2B', 1.6); X.restore(); nome('?', x + pw * .3, by + bh - hh - 10, { s: 12, f: FD, c: C.dim }); } else { rr(x, by + bh - hh, pw * .6, hh, 4, c, null); nome(`${v} %`, x + pw * .3, by + bh - hh - 10, { s: 12, f: FD, c: C.txt }); } nome(fut ? 'depois (ainda não)' : n, x + pw * .3, by + bh + 12, { s: 12, c: C.dim }); });
    [[EV.azS, 'sensível'], [EV.laR, 'resistente']].forEach(([c, n], i) => { if (wide) { circ(A.x0 + 6, A.y1 + 36 + i * 0 - 10 - (1 - i) * 18 + 8, 5, c); nome(n, A.x0 + 16, A.y1 + 36 - 10 - (1 - i) * 18 + 8, { a: 'left', s: 12, c: C.txt }); } });
    cap(S.msg || (p < .22 ? 'Na placa há muitas bactérias sensíveis (azuis) e poucas resistentes (laranja), por acaso, antes de qualquer remédio. Uma delas passa o plasmídeo para outra.' : p < .6 ? 'O antibiótico cai sobre a placa: as sensíveis morrem.' : 'As resistentes sobram, se dividem e enchem a placa. O remédio selecionou quem já era resistente.'));
  }
  // simulação da receita: dia a dia
  function trata(S) {
    const dose = S.dose ? .3 : .65, D = [3, 7, 10][S.dias], arr = [{ s: S.S, r: S.R }]; let s = S.S, r = S.R, trat = true, parou = null, cur = 0, limpa = false;
    for (let d = 1; d <= 14; d++) {
      if (trat) { s *= dose; r *= .97; cur++; if (cur >= D || (S.cedo && s + r < (S.S + S.R) * .3)) { trat = false; parou = d; if (s + r < 3) { s = r = 0; limpa = true; } } }
      else if (!limpa) { const gr = Math.min(1.6, 200 / Math.max(1, s + r)); s *= S.pl ? gr * .8 : gr; r *= S.pl ? gr * 1.15 : gr; if (S.pl) { const x = s * .12; s -= x; r += x; } if (s + r > 200) { const k = 200 / (s + r); s *= k; r *= k; } }
      arr.push({ s, r });
    }
    return { arr, parou, limpa };
  }
  function drawReceita(t, S, A) {
    const wide = !NAR, cw = wide ? A.w * .34 : A.w, bh = NAR ? 34 : 38; let y = A.y0;
    nome('dose diária', A.x0, y + 7, { a: 'left', c: C.txt }); y += 16; ['baixa', 'indicada'].forEach((s, i) => bt(S, A.x0 + i * (cw / 2 + 4) * 1, y, cw / 2 - 4 + (i ? 4 : 0), bh, s, EV.azS, 'd' + i, S.dose === i)); y += bh + 8;
    nome('dias de tratamento', A.x0, y + 7, { a: 'left', c: C.txt }); y += 16; [3, 7, 10].forEach((s, i) => bt(S, A.x0 + i * (cw / 3 + 2), y, cw / 3 - 4, bh, String(s), EV.azS, 'n' + i, S.dias === i)); y += bh + 8;
    bt(S, A.x0, y, cw, bh + 4, 'Parar por conta própria quando melhorar', EV.alerta, 'ce', !!S.cedo); y += bh + 12;
    bt(S, A.x0, y, cw, bh, S.run ? 'Tratar de novo' : 'Tratar', C.amber, 'tr', false); y += bh + 6; bt(S, A.x0, y, cw, bh, 'Nova infecção', EV.cinza, 'nv', false);
    const gx = wide ? A.x0 + cw + 24 : A.x0, gy = wide ? A.y0 + 20 : y + bh + 24, gw = A.x1 - gx - 6, gh = wide ? A.h - 70 : Math.max(60, A.y1 + 30 - gy - 28), ax = gx + 6;
    panel(gx - 6, gy - 22, gw + 12, gh + 50); nome('bactérias no corpo', gx + 2, gy - 8, { a: 'left', s: 12, c: C.txt });
    const arr = S.run ? S.run.arr : [{ s: S.S, r: S.R }], dday = S.run ? Math.min(14, Math.floor((S.ph - S.run.t0) / .45)) : 0, Yv = v => gy + gh - gh * Math.min(1, v / 220), Xd = d => ax + (gw - 10) * d / 14;
    line(ax, gy + gh, ax + gw - 6, gy + gh, C.line, 1.2); line(ax, Yv(S.run ? 100 : 30), ax + gw - 6, Yv(100), rgba(EV.alerta, .5), 1, [4, 4]); nome('sintomas', ax + gw - 10, Yv(100) - 9, { a: 'right', s: 12, c: EV.alerta });
    const upto = Math.min(dday, arr.length - 1);
    if (S.run) { const top = [], rs = []; for (let d = 0; d <= upto; d++) { top.push([Xd(d), Yv(arr[d].s + arr[d].r)]); rs.push([Xd(d), Yv(arr[d].r)]); } if (top.length > 1) { X.beginPath(); X.moveTo(Xd(0), Yv(0)); top.forEach(q => X.lineTo(q[0], q[1])); X.lineTo(top[top.length - 1][0], Yv(0)); X.closePath(); X.fillStyle = rgba(EV.azS, .5); X.fill(); X.beginPath(); X.moveTo(Xd(0), Yv(0)); rs.forEach(q => X.lineTo(q[0], q[1])); X.lineTo(rs[rs.length - 1][0], Yv(0)); X.closePath(); X.fillStyle = rgba(EV.laR, .75); X.fill(); poly(top, EV.azS, 2); } if (S.run.parou && dday >= S.run.parou) { line(Xd(S.run.parou), gy, Xd(S.run.parou), gy + gh, C.amber, 1.2, [3, 3]); nome('fim do remédio', Xd(S.run.parou) + 4, gy + 8, { a: 'left', s: 12, c: C.amber }); } }
    nome('dias', ax + gw / 2, gy + gh + 14, { s: 12, c: C.dim }); const cur = arr[upto], tot = cur.s + cur.r, fracR = tot > .5 ? Math.round(100 * cur.r / tot) : 0;
    [[EV.azS, 'sensíveis'], [EV.laR, 'resistentes']].forEach(([c, n], i) => { circ(ax + 10 + i * 100, gy + gh + 32, 5, c); nome(n, ax + 20 + i * 100, gy + gh + 32, { a: 'left', s: 12, c: C.txt }); });
    mtx(`resistentes: <b>${fracR} %</b>`, gx + gw - 4, gy - 8, { s: fsz(), a: 'right', c: EV.laR, bg: false });
    const fim = S.run && dday >= 14; S.msgR = fim ? (S.run.limpa ? 'Tratamento completo: o remédio e as defesas do corpo zeraram a infecção.' : S.cedo && S.run.parou < [3, 7, 10][S.dias] ? 'Parou antes da hora: as resistentes sobraram e a infecção voltou, agora com mais resistentes.' : 'O remédio não deu conta de todas: as resistentes sobraram e a infecção voltou.') : null;
    cap(S.msg || S.msgR || (S.run ? 'Os dias passam.' : 'Escolha a dose e os dias e toque em Tratar. ' + EDU));
  }
  function drawGripe(t, S, A) {
    const p = ciclo(lt(S), 10), wide = !NAR, pw = wide ? (A.w - 12) / 2 : A.w, ph = wide ? A.h : (A.h - 10) / 2;
    [0, 1].forEach(k => {
      const x = A.x0 + (wide ? k * (pw + 12) : 0), y = A.y0 + (wide ? 0 : k * (ph + 10)); panel(x, y, pw, ph); title(k ? 'bactérias do intestino' : 'gripe (vírus)', x + 12, y + 18, pw - 24, { a: 'left', c: C.txt, s: fsz() + 2 });
      const R = rng(k + 5), N = 30; for (let i = 0; i < N; i++) {
        const px = x + 20 + R() * (pw - 40), py = y + 40 + R() * (ph - 76);
        if (!k) { circ(px, py, 5, rgba(EV.violeta, .5), EV.violeta, 1.5); for (let j = 0; j < 6; j++) { const a = j / 6 * TAU; line(px + Math.cos(a) * 5, py + Math.sin(a) * 5, px + Math.cos(a) * 9, py + Math.sin(a) * 9, EV.violeta, 1.2); } }
        else { const res = i < 3, gone = !res && seg(p, .4, .6) > R() * .9 + .05, exp = res ? 0 : 0; if (gone) continue; const nres = i < 3 ? 1 + ss(seg(p, .6, .95)) * 2.4 : 1; ell(px, py, 5.5 * (res ? nres * .75 : 1), 3.6 * (res ? nres * .75 : 1), i, rgba(res ? EV.laR : EV.azS, .9), 'rgba(11,15,28,.6)', 1); }
      }
      nome(k ? 'sensíveis morrem; as resistentes crescem' : 'o antibiótico não age contra vírus', x + pw / 2, y + ph - 14, { s: 12, c: C.txt });
    });
    if (p > .25) { const gx = wide ? A.cx : A.cx, gy = wide ? A.y0 + A.h * .5 : A.y0 + ph + 5; circ(gx, gy, 12, rgba(EV.gelo, .25), EV.gelo, 1.6); nome('antibiótico', gx, gy + 24, { s: 12, c: C.txt }); }
    cap(S.msg || 'O antibiótico não atinge o vírus da gripe, mas seleciona as bactérias resistentes do intestino. ' + EDU);
  }
  def('evidencias', 'resistencia', {
    t: 'Evolução que se vê: resistência a antibióticos', s: 'o antibiótico não cria a bactéria resistente, ele a seleciona', c: EV.ouro,
    loc: S => ({ placa: 'Placa de Petri', rec: 'Siga a receita', gri: 'Antibiótico para gripe' })[S.modo], locNota: S => S.modo === 'placa' ? NOTA : SIM, still: 30,
    alt: 'uma placa de Petri com bactérias azuis sensíveis e poucas laranja resistentes que se multiplicam depois da gota de antibiótico, com barras de proporção, uma simulação de tratamento com dose, dias e a opção de parar por conta própria, e o caso do antibiótico contra gripe',
    extra: [mdE('placa', 'Placa de Petri'), mdE('rec', 'Siga a receita', S => { S.run = null; }), mdE('gri', 'Antibiótico para gripe')], ctlVis: S => S.modo === 'placa',
    init(S) { S.modo = 'placa'; S.t0 = 0; S.msg = null; S.dose = 1; S.dias = 1; S.cedo = 0; S.pl = 0; S.S = 98; S.R = 2; S.run = null; },
    d: TXT.V3.d, enem: TXT.V3.enem + '<br>' + EDU, links: [['Troca de genes em Microrganismos', '../microrganismos/index.html#monera/reproducao'], ['Doenças bacterianas em Microrganismos', '../microrganismos/index.html#monera/doencas'], ['Fatores evolutivos na Genética', '../genetica/index.html#populacoes/fatores']],
    tap(x, y, S) {
      const h = hid(x, y); if (!h || S.modo !== 'rec') return; flash(S, h);
      if (h[0] === 'd') S.dose = +h[1]; else if (h[0] === 'n') S.dias = +h[1]; else if (h === 'ce') S.cedo = S.cedo ? 0 : 1;
      else if (h === 'tr') { if (S.run) { const a = S.run.arr[14]; S.S = a.s; S.R = a.r; } if (S.S + S.R < 3) { S.msg = 'Não há infecção para tratar. Toque em Nova infecção.'; return; } S.run = Object.assign(trata(S), { t0: agora(S) }); S.msg = null; }
      else if (h === 'nv') { S.S = 98; S.R = 2; S.run = null; S.msg = null; }
    },
    draw(t, S) { const A = area(); if (S.modo === 'rec') drawReceita(t, S, A); else if (S.modo === 'gri') drawGripe(t, S, A); else drawPlaca(t, S, A); }
  });
}
