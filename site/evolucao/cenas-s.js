/* LAB, módulo Origem da vida e evolução. Cenas da parte 2: teoria sintética, seleção natural, acaso e migração, especiação, padrões e evolução humana (S1 a H1).
   Código da equipe (Aurelius). Textos: roteiro docs/revisao-biologia/evolucao-roteiro-parte2.md.
   Direção de arte: docs/visual/evolucao-ecologia.md (uma cor-âncora por seção; desenhos esquemáticos próprios, sem retrato). */
'use strict';
{
  const NOTA = 'Desenho esquemático, fora de escala', SIM = 'Modelo simplificado; números escolhidos para mostrar o efeito', EDU = 'Conteúdo educativo, não substitui orientação médica.';
  const TXT = {};
  TXT.S1 = {
    d: `<p>Darwin explicou a <b>seleção natural</b>, mas não sabia de onde vinham as diferenças entre os indivíduos nem como elas passavam aos filhos. No século 20, a união das ideias de Darwin com a genética de Mendel e com o estudo das populações formou a <b>teoria sintética da evolução</b> (ou <b>neodarwinismo</b>). Para ela, evoluir é <b>mudar a frequência dos alelos</b> de uma <b>população</b> ao longo das gerações. Quem evolui é a população, não o indivíduo.</p>
<p>A fonte primária de toda novidade é a <b>mutação</b>: uma mudança no DNA. Ela acontece <b>ao acaso</b>, no sentido de que não surge "para" ajudar o ser vivo: uma bactéria não fica resistente porque recebeu antibiótico; o alelo de resistência já existia, por mutação, antes do remédio. A maioria das mutações é <b>neutra</b> ou <b>prejudicial</b>; poucas são vantajosas, e isso depende do ambiente. Nos animais, só passam aos filhos as mutações que estão nas <b>células que formam gametas</b>.</p>
<p>A <b>recombinação gênica</b> não cria alelos novos, mas cria <b>combinações novas</b>. Na meiose, o <b>crossing-over</b> (permutação) troca pedaços entre cromossomos homólogos, e a <b>segregação independente</b> distribui os cromossomos ao acaso: só ela já permite cerca de 8 milhões de combinações diferentes de cromossomos num gameta humano. Na <b>fecundação</b>, um gameta de cada genitor se junta ao acaso. Por isso a <b>reprodução sexuada</b> gera muito mais variedade que a <b>assexuada</b>, em que os filhos são, em geral, cópias do genitor e só a mutação traz diferença. Mais variedade significa mais chance de alguém sobreviver quando o ambiente muda.</p>`,
    enem: `A pegadinha clássica é dizer que o ambiente <b>provoca</b> a mutação útil (antibiótico "cria" bactéria resistente, inseticida "ensina" o inseto). Isso é lamarckismo. Pela teoria sintética, a variação <b>já existe</b> e o ambiente só <b>seleciona</b>. Também cai a pergunta "por que a reprodução sexuada é vantajosa", cuja resposta é a <b>maior variabilidade genética</b>.`
  };
  TXT.SE1 = {
    d: `<p>Muitas características, como altura e peso, variam em degraus pequenos e formam uma <b>curva em sino</b>: muitos indivíduos no meio, poucos nas pontas. A seleção natural pode mexer nessa curva de três jeitos.</p>
<p>Na <b>seleção estabilizadora</b>, os do <b>meio</b> deixam mais filhos e os extremos são eliminados. A curva fica <b>mais estreita</b>, mas não sai do lugar. Exemplo: bebês humanos de peso muito baixo ou muito alto tinham, historicamente, mais risco ao nascer; o peso médio era favorecido. É o tipo mais comum em ambientes <b>estáveis</b>.</p>
<p>Na <b>seleção direcional</b>, um dos <b>extremos</b> é favorecido, e a média <b>anda</b> para aquele lado geração após geração. É o que acontece quando o <b>ambiente muda</b>: a mariposa escura na Inglaterra industrial e as bactérias resistentes a antibióticos (veja os <a href="#selecao/casos">casos reais</a>).</p>
<p>Na <b>seleção disruptiva</b>, os <b>dois extremos</b> são favorecidos e os do meio são eliminados. A curva se <b>divide em duas</b>. Exemplo: numa pequena ave africana que come sementes (<i>Pyrenestes ostrinus</i>), há sementes duras e grandes e sementes moles e pequenas; bicos grandes e bicos pequenos se dão bem, e os médios não. Esse tipo pode ser o começo de uma <b>especiação</b> (veja <a href="#especiacao/modos">como nasce uma espécie</a>).</p>
<p>A <b>seleção sexual</b> é um caso especial: favorece o que aumenta a chance de <b>conseguir parceiro</b>, mesmo que atrapalhe a sobrevivência. Pode ser por <b>escolha</b> (a fêmea do pavão prefere machos de cauda maior e mais vistosa) ou por <b>competição</b> entre machos (galhadas de cervos, tamanho dos elefantes-marinhos). Explica por que machos e fêmeas de muitas espécies são tão diferentes (<b>dimorfismo sexual</b>).</p>`,
    enem: `Vem quase sempre como <b>gráfico</b>: duas curvas, antes e depois, e a pergunta é o tipo de seleção. Média andou: <b>direcional</b>; curva estreitou no mesmo lugar: <b>estabilizadora</b>; virou duas corcovas: <b>disruptiva</b>. Seleção sexual aparece em textos sobre cores e cantos de aves; lembre que ela pode favorecer algo que <b>reduz</b> a sobrevivência.`
  };
  TXT.SE2 = {
    d: `<p>A <b>mariposa <i>Biston betularia</i></b> tem duas formas: <b>clara</b> e <b>escura</b> (melânica). Antes da Revolução Industrial, quase todas na Inglaterra eram claras, camufladas em troncos cobertos de líquens claros. Com a fuligem das fábricas, os líquens morreram e os troncos escureceram. As claras passaram a ser vistas e comidas por <b>aves</b>, e as escuras, camufladas, deixaram mais filhos. Perto de Manchester, no fim do século 19, a forma escura chegou a ser cerca de 98% da população. Depois das leis contra a poluição do ar, nos anos 1950, os troncos clarearam e a forma clara voltou a predominar. O alelo da cor escura <b>já existia</b> antes; o ambiente só mudou qual forma era favorecida. É <b>seleção direcional</b>, e ela inverteu de sentido quando o ambiente voltou.</p>
<p>Na <b>resistência a antibióticos</b>, numa população de bactérias há, por mutação, algumas poucas resistentes. O antibiótico mata as sensíveis e as resistentes sobrevivem e se multiplicam. Se o tratamento é <b>interrompido</b> antes da hora ou o antibiótico é usado <b>sem necessidade</b>, sobram mais resistentes, e a próxima infecção é mais difícil de tratar. As bactérias também <b>trocam genes</b> de resistência entre si (por plasmídios, na conjugação), o que espalha a resistência ainda mais rápido. A OMS considera a resistência antimicrobiana uma das maiores ameaças à saúde pública mundial.</p>
<p>Com <b>inseticidas</b> é igual: o produto mata os insetos sensíveis, e os poucos resistentes passam a ser a maioria. Por isso o mosquito <i>Aedes aegypti</i> ficou resistente a vários inseticidas no Brasil, e o uso repetido do mesmo produto na lavoura perde efeito. Revezar produtos e usar outros métodos de controle atrasa esse processo.</p>`,
    enem: `Este é um dos temas <b>mais cobrados</b> de evolução. A resposta certa sempre diz que o antibiótico ou o inseticida <b>seleciona</b> indivíduos que <b>já eram</b> resistentes; a alternativa errada diz que o produto <b>induziu</b> a resistência ou que o organismo "se acostumou". A mariposa aparece para testar a mesma ideia e a de que a seleção depende do <b>ambiente</b>: mudou o ambiente, mudou o fenótipo favorecido.`
  };
  TXT.A1 = {
    d: `<p>Nem toda mudança na população é seleção. Na <b>deriva genética</b>, a frequência de um alelo muda <b>por acaso</b>: quem morre num acidente ou quem deixa filhos naquela geração não depende de ser "melhor". É como tirar bolinhas de um saco: com milhares de bolinhas, a proporção quase não muda; com dez, muda muito. Por isso a deriva é <b>forte em populações pequenas</b>. Ela pode fazer um alelo <b>sumir</b> ou se tornar o <b>único</b> (fixação), mesmo que ele seja neutro ou até um pouco prejudicial, e <b>diminui a variabilidade</b> genética.</p>
<p>No <b>efeito gargalo</b>, uma catástrofe (caça, doença, desastre) reduz a população a poucos indivíduos, e os sobreviventes carregam só uma amostra dos alelos. O <b>elefante-marinho-do-norte</b> foi caçado até restarem algumas dezenas, no fim do século 19; hoje são mais de 100 mil, mas quase iguais geneticamente. O <b>guepardo</b> também tem pouquíssima variação, sinal de gargalos antigos. Pouca variação deixa a espécie mais <b>vulnerável</b> a doenças e mudanças do ambiente, uma preocupação da <b>conservação</b>.</p>
<p>No <b>efeito fundador</b>, poucos indivíduos saem e fundam uma população nova, isolada. Um alelo raro na população de origem pode ficar comum na nova. Em comunidades <b>Amish</b> dos Estados Unidos, fundadas por poucas famílias, uma síndrome rara com dedos a mais (Ellis-van Creveld) é muito mais frequente que no resto do mundo.</p>
<p>O <b>fluxo gênico</b> é a entrada ou saída de alelos quando indivíduos <b>migram e se reproduzem</b> em outra população (ou quando grãos de pólen e sementes viajam). Ele traz variação nova e <b>deixa as populações parecidas</b> entre si, o oposto do que acontece na especiação. Cortar o fluxo gênico, com uma estrada ou um desmatamento que isola fragmentos de mata, deixa cada fragmento pequeno e sujeito à deriva; <b>corredores ecológicos</b> ajudam a manter o fluxo.</p>`,
    enem: `O ENEM conta uma história e pede o fator: <b>poucos colonos fundaram uma ilha</b> é efeito fundador; <b>uma catástrofe deixou poucos sobreviventes</b> é gargalo; <b>indivíduos chegam de outra população</b> é fluxo gênico. Aparece também ligado à <b>fragmentação de habitat</b> e à perda de variabilidade em espécies ameaçadas. Lembre que a deriva <b>não é adaptativa</b>: não deixa a população mais ajustada ao ambiente.`
  };
  TXT.ES1 = {
    d: `<p><b>Espécie</b> é um grupo de populações que podem cruzar entre si na natureza e deixar <b>descendentes férteis</b>. <b>Especiação</b> é o surgimento de uma espécie nova a partir de outra. O caminho mais comum tem três passos: <b>isolamento</b>, <b>diferenciação</b> e <b>isolamento reprodutivo</b>.</p>
<p>Na <b>especiação alopátrica</b> ("em lugares diferentes"), uma <b>barreira geográfica</b> (um rio, uma montanha, o mar subindo) divide a população em duas. O fluxo gênico para. Cada lado sofre <b>mutações diferentes</b>, <b>seleção</b> em ambientes diferentes e <b>deriva</b>. Com muito tempo, as duas populações ficam tão diferentes que, mesmo se a barreira sumir, <b>não cruzam mais</b> ou não geram filhos férteis: são duas espécies. Um exemplo estudado: quando o <b>istmo do Panamá</b> se fechou, há cerca de 3 milhões de anos, populações de camarões do mar ficaram separadas entre o Pacífico e o Caribe; hoje, os pares de cada lado são espécies diferentes que quase não cruzam. É o modo mais comum de especiação.</p>
<p>Na <b>especiação simpátrica</b> ("no mesmo lugar"), a espécie nova surge <b>sem barreira geográfica</b>. Em <b>plantas</b>, é comum por <b>poliploidia</b>: um erro na meiose gera gametas com o dobro de cromossomos, e a planta que nasce não cruza mais com a de origem; o trigo que comemos tem origem assim, a partir de várias espécies. Em animais, pode acontecer quando um grupo muda de <b>recurso</b>: a mosca <i>Rhagoletis</i>, nos Estados Unidos, que punha ovos no espinheiro, passou em parte a usar a <b>maçã</b>; como cada grupo acasala na sua fruta, o cruzamento entre eles diminuiu.</p>`,
    enem: `A pergunta mais comum mostra um <b>mapa com uma barreira</b> e pede o nome do processo (alopátrica) ou o que define que surgiram duas espécies (o <b>isolamento reprodutivo</b>, e não só a aparência diferente). Cuidado: ficar diferente por fora <b>não basta</b>; e cruzar gerando filho <b>estéril</b> também conta como espécies diferentes.`
  };
  TXT.ES2 = {
    d: `<p><b>Isolamento reprodutivo</b> é o conjunto de barreiras <b>biológicas</b> que impedem duas espécies de trocar genes. Elas se dividem pelo momento em que agem: antes ou depois de formar o <b>zigoto</b>.</p>
<p>Os mecanismos <b>pré-zigóticos</b> impedem o cruzamento ou a fecundação. <b>Ecológico</b> (de habitat): vivem no mesmo lugar, mas em ambientes diferentes, um na água e outro na terra. <b>Temporal</b>: se reproduzem em épocas ou horários diferentes, como plantas que florescem em meses diferentes. <b>Comportamental</b>: o ritual de corte não combina; o canto, a dança ou a luz do vaga-lume de uma espécie não atrai a outra. <b>Mecânico</b>: os órgãos reprodutores não se encaixam, ou a flor não serve para aquele polinizador. <b>Gamético</b>: os gametas se encontram, mas não se reconhecem, comum em animais que soltam gametas na água.</p>
<p>Os mecanismos <b>pós-zigóticos</b> agem depois que o zigoto se forma. <b>Inviabilidade do híbrido</b>: o embrião morre no começo do desenvolvimento. <b>Esterilidade do híbrido</b>: o filho nasce e é saudável, mas é <b>estéril</b>. O exemplo clássico é a <b>mula</b> (ou o burro), filha de <b>égua</b> com <b>jumento</b>: o cavalo tem 64 cromossomos e o jumento 62; a mula fica com 63, e os cromossomos não formam pares certos na meiose, o que impede a formação de gametas normais. Por isso a mula é quase sempre estéril, e cavalo e jumento continuam espécies diferentes. <b>Colapso do híbrido</b>: a primeira geração é fértil, mas as seguintes são fracas ou estéreis.</p>`,
    enem: `Caem a <b>mula</b> (por que é estéril e por que isso mostra que cavalo e jumento são espécies diferentes) e a classificação de barreiras em <b>pré</b> e <b>pós-zigóticas</b>. Dica: se o texto fala de <b>canto, cor, época, encaixe</b>, é pré-zigótico; se fala de <b>filho estéril ou que morre</b>, é pós-zigótico.`
  };
  TXT.P1 = {
    d: `<p>Na <b>irradiação adaptativa</b>, um <b>ancestral comum</b> dá origem, em pouco tempo geológico, a <b>muitas espécies</b> adaptadas a ambientes e modos de vida diferentes. Costuma acontecer quando surgem muitas <b>oportunidades vazias</b>: uma ilha nova, um lago novo ou o fim de um grupo dominante. Os <b>tentilhões de Darwin</b>, em Galápagos, descendem de um ancestral que chegou do continente; hoje são mais de uma dúzia de espécies, com bicos diferentes para sementes duras, insetos, cactos. Os <b>mamíferos</b> se diversificaram muito depois da extinção dos dinossauros não avianos, há cerca de 66 milhões de anos, ocupando terra, mar (baleias) e ar (morcegos). O resultado são <b>estruturas homólogas</b>: mesma origem, funções diferentes, como o braço humano, a nadadeira da baleia e a asa do morcego.</p>
<p>Na <b>convergência evolutiva</b> acontece o contrário: grupos <b>sem parentesco próximo</b> ficam <b>parecidos</b> porque vivem em ambientes parecidos e sofrem seleção parecida. <b>Tubarões</b> (peixes) e <b>golfinhos</b> (mamíferos) têm corpo hidrodinâmico e nadadeiras; <b>cactos</b> americanos e certas <b>euforbiáceas</b> africanas têm caule grosso que guarda água e espinhos; asas surgiram de forma independente em <b>insetos</b>, <b>aves</b> e <b>morcegos</b>. O resultado são <b>estruturas análogas</b>: mesma função, origens diferentes. Semelhança de forma, portanto, <b>não prova</b> parentesco.</p>`,
    enem: `O ENEM pede para reconhecer <b>convergência</b> em textos sobre animais ou plantas parecidos de continentes diferentes, e <b>irradiação</b> nos tentilhões ou na diversificação dos mamíferos. Associe: irradiação produz <b>homologia</b>; convergência produz <b>analogia</b>.`
  };
  TXT.H1 = {
    d: `<p>Humanos, <b>chimpanzés</b> e <b>bonobos</b> são os parentes vivos mais próximos uns dos outros. Não descendemos deles: as linhagens se <b>separaram</b> a partir de um <b>ancestral comum</b> que viveu na África há cerca de 6 a 7 milhões de anos. Desde então, cada linhagem evoluiu por conta própria; os chimpanzés atuais são tão "evoluídos" quanto nós. O DNA de humanos e chimpanzés é muito parecido, com cerca de 98% de semelhança nas sequências comparáveis.</p>
<p>A evolução humana é uma <b>árvore ramificada</b>, não uma fila. Os <b>hominíneos</b> são a nossa linhagem depois da separação. Os <b>australopitecos</b>, como a famosa "Lucy" (cerca de 3 milhões de anos), já andavam em <b>duas pernas</b> (<b>bipedalismo</b>), mas ainda tinham cérebro pequeno: andar ereto veio <b>antes</b> do cérebro grande. Depois surgem espécies do gênero <b><i>Homo</i></b>. O <b><i>Homo erectus</i></b>, há cerca de 2 milhões de anos, foi, até onde se sabe, o primeiro a <b>sair da África</b> e se espalhar pela Ásia. Em vários momentos, <b>mais de uma espécie humana viveu ao mesmo tempo</b>.</p>
<p>O <b><i>Homo sapiens</i></b> surgiu na <b>África</b> há cerca de 300 mil anos; os fósseis mais antigos conhecidos são de Jebel Irhoud, no Marrocos. Há cerca de 60 mil anos, grupos saíram da África e ocuparam os outros continentes, chegando à <b>América</b> há pelo menos cerca de 15 mil anos (há indícios mais antigos, ainda em debate). Fora da África, os <i>Homo sapiens</i> encontraram os <b>neandertais</b> (Europa e Ásia) e os <b>denisovanos</b> (Ásia) e <b>cruzaram</b> com eles: pessoas de origem não africana carregam cerca de 2% de DNA neandertal. Os neandertais desapareceram há cerca de 40 mil anos. Toda a humanidade atual é <b>uma só espécie</b>, com pouca variação genética entre grupos, e a maior parte dela está <b>dentro</b> de cada grupo, não entre eles.</p>`,
    enem: `A ideia mais cobrada é a de <b>ancestral comum</b>: a alternativa "o homem descende do chimpanzé" está sempre errada. Também caem a <b>origem africana</b> do <i>Homo sapiens</i>, o <b>bipedalismo antes do cérebro grande</b> e a leitura de uma <b>árvore filogenética</b> com hominíneos. Textos sobre o povoamento da América costumam citar sítios arqueológicos brasileiros, como Lagoa Santa (MG) e a Serra da Capivara (PI).`
  };
  const LK = (h, t) => `<a href="${h}">${t}</a>`, FAT_L = '../genetica/index.html#populacoes/fatores';
  TXT.S1.d = `<p><b>Relembre:</b> a lista dos ${LK(FAT_L, 'fatores evolutivos')} está na Genética, e a seleção natural segundo Darwin está em ${LK('#ideias/darwin', 'Darwin e Wallace')}.</p>` + TXT.S1.d;
  TXT.SE1.d = `<p><b>Relembre:</b> a seleção age no <b>fenótipo</b>, e com ele muda a frequência dos alelos. Veja ${LK('../genetica/index.html#populacoes/hardy-weinberg', 'Hardy-Weinberg')}.</p>` + TXT.SE1.d;
  TXT.A1.d = `<p><b>Relembre:</b> o efeito fundador e o gargalo aparecem em uma frase cada na ${LK(FAT_L, 'lista dos fatores evolutivos')}.</p>` + TXT.A1.d;
  TXT.ES1.d = `<p><b>O que é espécie:</b> um grupo de populações que cruzam entre si na natureza e deixam descendentes férteis. Essa definição não serve para seres que se reproduzem só de forma assexuada nem para fósseis. Veja os ${LK('../taxonomia/index.html#nomes/binomial', 'nomes científicos')}.</p>` + TXT.ES1.d;
  TXT.P1.d = `<p><b>Relembre:</b> órgãos homólogos e análogos estão em ${LK('#evidencias/comparacao', 'Comparação entre espécies')}, e a homologia também aparece na ${LK('../taxonomia/index.html#cladistica/homologia', 'Taxonomia')}.</p>` + TXT.P1.d;
  TXT.H1.d = `<p><b>Aviso:</b> os seres humanos <b>não descendem</b> dos chimpanzés nem de nenhum macaco atual. Humanos e chimpanzés têm um <b>ancestral comum</b>. Veja o ${LK('../taxonomia/index.html#cladistica/cladograma', 'cladograma')}.</p>` + TXT.H1.d;
  // ---------- S1: de onde vem a variação ----------
  const LETRA = { A: '#FF8A6B', T: '#F7C13B', C: '#4B7BFF', G: '#3FBF6A' };
  function letra(x, y, s, w, glow) {
    if (glow) circ(x, y, w * .78, rgba(EV.creme, .22 * glow), rgba(EV.creme, glow), 2);
    rr(x - w / 2 + 1, y - 12, w - 2, 24, 5, rgba(LETRA[s], .2), LETRA[s], 1.4); tx(s, x, y + .5, { s: 13, w: 700, c: C.txt, bg: false });
  }
  function cromo(x, y, L, w, c1, c2, a = 1) {
    X.save(); X.globalAlpha *= a; rr(x - w / 2, y, w, L / 2 + 1, w / 2, c1, 'rgba(11,15,28,.65)', 1.2); rr(x - w / 2, y + L / 2 - 1, w, L / 2 + 1, w / 2, c2, 'rgba(11,15,28,.65)', 1.2); X.restore();
  }
  function drawDna(t, S, A) {
    const p = ciclo(Math.max(0, lt(S)), 10), n = 14, orig = 'ATGCCTAGGTCAAT', cop = orig.split(''); cop[7] = 'A';
    const hT = Math.min(A.h * .36, 130), pw = Math.min(NAR ? 24 : 32, (A.w - 24) / n), xs = i => A.cx + (i - (n - 1) / 2) * pw, y1 = A.y0 + 20, y2 = A.y0 + hT - 22, mid = (y1 + y2) / 2;
    const rx = xs(0) - pw / 2, fora = rx - 12 > A.x0 + 62; // rótulos junto ao início das fileiras: à esquerda se couber, senão acima/abaixo
    if (fora) { nome('DNA original', rx - 12, y1, { a: 'right' }); nome('cópia', rx - 12, y2, { a: 'right' }); } else { nome('DNA original', rx, y1 - 22, { a: 'left' }); nome('cópia', rx, y2 + 20, { a: 'left' }); }
    const c = seg(p, .02, .38) * n;
    for (let i = 0; i < n; i++) {
      letra(xs(i), y1, orig[i], pw);
      if (c > i) { X.save(); X.globalAlpha *= cl(c - i, 0, 1); line(xs(i), y1 + 13, xs(i), y2 - 13, rgba(C.dim, .45), 1); letra(xs(i), y2, cop[i], pw, i === 7 && c >= 8 ? .6 + .4 * Math.sin(S.ph * 4) : 0); X.restore(); }
    }
    if (c < n) { const mx = xs(Math.min(n - 1, c)); rr(mx - 38, mid - 10, 76, 20, 6, rgba(EV.rosa, .3), EV.rosa, 1.4); tx('copiadora', mx, mid + .5, { s: 12, w: 600, c: C.txt, bg: false }); }
    if (c >= 8) nome('mutação: uma letra trocada', clamp0(xs(7), A.x0 + 100, A.x1 - 100), y2 + 28, { c: EV.creme, s: 12 });
    // crossing-over e gametas
    const zt = A.y0 + hT + 30, mz = A.y1 - zt, L = Math.min(mz * .5, 110), cx = A.cx, k1 = ss(seg(p, .46, .62)), k2 = ss(seg(p, .68, .92)), cA = '#E8D9B5', cB = '#4A4A4A';
    nome('recombinação: crossing-over e formação dos gametas', A.x0 + 2, zt, { a: 'left' });
    const yc = zt + 18, dx = 18;
    if (k2 < 1) {
      X.save(); X.globalAlpha *= 1 - k2;
      cromo(cx - dx, yc, L, 12, cA, mix(cA, cB, k1)); cromo(cx + dx, yc, L, 12, cB, mix(cB, cA, k1));
      if (k1 > .05) { line(cx - dx, yc + L / 2, cx + dx, yc + L / 2 + 8, EV.creme, 2); line(cx + dx, yc + L / 2, cx - dx, yc + L / 2 + 8, EV.creme, 2); }
      X.restore();
      if (p < .66) { nome('claro: de um genitor', cx - dx - 20, yc + L + 12, { a: 'right', s: 12 }); nome('escuro: do outro', cx + dx + 20, yc + L + 12, { a: 'left', s: 12 }); }
    }
    if (k2 > 0) {
      const G = [[cA, cA], [cA, cB], [cB, cB], [cB, cA]], gap = Math.min(70, (A.w - 40) / 4), yg = lerp(yc, Math.min(yc + L * .55, A.y1 - L - 18), k2);
      G.forEach((g, j) => { const gx = lerp(j < 2 ? cx - dx : cx + dx, cx + (j - 1.5) * gap, k2); cromo(gx, yg, L, 10, g[0], g[1], k2); });
      if (k2 > .9) nome('quatro gametas, todos diferentes', cx, yg + L + 14, { c: C.txt });
    }
    cap(p < .4 ? 'A cópia do DNA às vezes sai com uma letra trocada: é a mutação, que acontece ao acaso.' : p < .66 ? 'No crossing-over, os cromossomos homólogos trocam pedaços.' : 'Quatro gametas diferentes. A mutação cria alelos novos; a recombinação cria combinações novas.');
  }
  const clamp0 = (v, a, b) => Math.max(a, Math.min(b, v));
  // duas ilhas: genótipo de 3 genes com 2 alelos (0 a 7); a doença só poupa quem tem os genes 1 e 2 (bits 0 e 1)
  const GC = ['#E8D9B5', '#F7C13B', '#F06AAE', '#9A6BFF', '#2FCFBF', '#4B7BFF', '#FF9A3C', '#A9C54A'], MU = [.01, .05, .15], MUN = ['baixa', 'média', 'alta'];
  function ilhas(S) { S.sem = (S.sem || 0) + 1; S.rg = rng(1234 + S.sem * 77); S.IA = Array(40).fill(1); S.IX = Array.from({ length: 40 }, () => Math.floor(S.rg() * 8)); S.ger = 0; S.mu = 1; S.run = 0; S.rt = 0; S.dis = 0; S.morte = null; S.msg = null; }
  function gera(S) {
    const mu = MU[S.mu], R = S.rg, nx = (arr, sex) => {
      const v = arr.filter(g => g != null); if (!v.length) return arr.map(() => null);
      return arr.map(() => { let g; if (sex) { const a = v[Math.floor(R() * v.length)], b = v[Math.floor(R() * v.length)]; g = 0; for (let k = 0; k < 3; k++) g |= (((R() < .5 ? a : b) >> k) & 1) << k; } else g = v[Math.floor(R() * v.length)]; for (let k = 0; k < 3; k++) if (R() < mu) g ^= 1 << k; return g; });
    };
    S.IA = nx(S.IA, false); S.IX = nx(S.IX, true); S.ger++; S.morte = null;
  }
  function doenca(S) {
    const m = { A: [], X: [], t: performance.now() }; ['IA', 'IX'].forEach(k => S[k] = S[k].map((g, i) => { if (g != null && (g & 3) !== 3) { m[k[1]].push(i); return null; } return g; })); S.morte = m; S.dis++;
    const vA = S.IA.filter(g => g != null).length, vX = S.IX.filter(g => g != null).length;
    S.msg = vA === 0 ? 'A ilha dos clones foi extinta: nenhum tinha a combinação de que a doença exige. A ilha sexuada ainda tem sobreviventes que vão repovoar.' : `Sobraram ${vA} clones e ${vX} indivíduos da ilha sexuada.`;
  }
  function drawIlhas(t, S, A) {
    if (S.run > 0) { if (S.paused) { while (S.run > 0) { gera(S); S.run--; } } else { S.rt += S.dt; if (S.rt > .3) { S.rt = 0; gera(S); S.run--; } } }
    const gw = (A.w - 16) / 2, pitch = Math.min(NAR ? 18 : 22, (gw - 24) / 8), ih = 5 * pitch + 24, y0 = A.y0 + 22, now = performance.now();
    [['IA', 'Reprodução assexuada', 'clones', A.x0], ['IX', 'Reprodução sexuada', 'mosaico', A.x0 + gw + 16]].forEach(([k, nm, , x0]) => {
      title(nm, x0 + gw / 2, A.y0 + 8, gw, { s: NAR ? 13 : 15 });
      ell(x0 + gw / 2, y0 + ih / 2 + 4, gw / 2 - 2, ih / 2 + 6, 0, rgba(EV.solo, .18), rgba(EV.solo, .6), 1.4);
      const gx = x0 + gw / 2 - 3.5 * pitch, gy = y0 + 14 + pitch * .5, vivos = S[k].filter(g => g != null);
      S[k].forEach((g, i) => { const x = gx + (i % 8) * pitch, y = gy + Math.floor(i / 8) * pitch; if (g != null) circ(x, y, pitch * .38, GC[g], 'rgba(11,15,28,.55)', 1); else if (S.morte && !S.paused && now - S.morte.t < 1300 && S.morte[k[1]].includes(i)) xis(x, y, pitch * .45, EV.alerta); });
      const dist = new Set(vivos).size;
      nome(vivos.length ? `combinações diferentes: ${dist} de 8` : 'ilha extinta', x0 + gw / 2, y0 + ih + 14, { c: vivos.length ? C.txt : EV.alerta, s: fsz() });
    });
    nome(`geração ${S.ger}`, A.cx, y0 + ih + 34, { s: 12 });
    const by = A.y1 - (NAR ? 78 : 40), bh = 34, g = 8, bw = NAR ? (A.w - g) / 2 : (A.w - 2 * g) / 3;
    bt(S, A.x0, by, bw, bh, S.run > 0 ? `rodando: faltam ${S.run}` : 'rodar 10 gerações', EV.rosa, 'rod');
    bt(S, A.x0 + bw + g, by, bw, bh, `mutação: ${MUN[S.mu]}`, EV.rosa, 'mut');
    bt(S, NAR ? A.x0 : A.x0 + 2 * (bw + g), NAR ? by + bh + 6 : by, NAR ? A.w : bw, bh, 'chega uma doença nova', EV.alerta, 'doe');
    cap(S.msg || (S.ger > 0 && S.dis ? 'A mutação cria alelos novos; a reprodução sexuada cria combinações novas.' : 'Rode algumas gerações e depois solte a doença: ela só poupa quem reúne dois alelos.'));
  }
  def('sintetica', 'variacao', {
    t: 'De onde vem a variação', s: 'mutação cria, reprodução sexuada embaralha', c: EV.rosa,
    loc: S => S.modo === 'ilhas' ? 'Duas ilhas, uma doença' : 'Mutação e recombinação', locNota: S => S.modo === 'ilhas' ? SIM : SIM, still: 20,
    alt: 'uma fita de DNA copiada com uma letra trocada, depois dois cromossomos homólogos que trocam pedaços e geram quatro gametas diferentes; e duas ilhas de quarenta indivíduos, uma de clones e outra de mosaico de cores, com botões para rodar gerações, mudar a mutação e soltar uma doença',
    extra: [mdE('dna', 'Mutação e recombinação'), mdE('ilhas', 'Duas ilhas, uma doença', S => ilhas(S))], ctlVis: S => S.modo === 'dna',
    init(S) { S.modo = 'dna'; S.t0 = 0; S.msg = null; ilhas(S); },
    d: TXT.S1.d, enem: TXT.S1.enem, links: [['Fatores evolutivos na Genética', '../genetica/index.html#populacoes/fatores'], ['Meiose na Divisão celular', '../divisao-celular/index.html#meiose/fases'], ['Darwin e a seleção natural', '#ideias/darwin'], ['Lamarck para comparar', '#ideias/lamarck']],
    tap(x, y, S) {
      if (S.modo !== 'ilhas') return; const h = hid(x, y); if (!h) return; flash(S, h);
      if (h === 'rod') { if (S.run <= 0) { S.run = 10; S.rt = 0; S.msg = null; } } else if (h === 'mut') { S.mu = (S.mu + 1) % 3; S.msg = `Taxa de mutação ${MUN[S.mu]}: aparece alelo novo com mais ou menos frequência.`; } else if (h === 'doe') doenca(S);
    },
    draw(t, S) { const A = area(); if (S.modo === 'ilhas') drawIlhas(t, S, A); else drawDna(t, S, A); }
  });

  // ---------- SE1: tipos de seleção ----------
  const GN = 57, GVv = i => -3.5 + 7 * i / (GN - 1), sg = v => 1 / (1 + Math.exp(-v));
  const AMB = [
    { n: 'ambiente estável', w: v => gau(v, 0, .8) + .04 },
    { n: 'só sementes duras', w: v => sg((v - .3) * 3.5) },
    { n: 'duras e moles, nada no meio', w: v => 1 - .9 * gau(v, 0, .75) },
    { n: 'fêmeas preferem cauda longa', w: v => sg((v - .5) * 2) * sg(-(v - 1) * 1.1) }
  ];
  const dens0 = () => { const d = Array.from({ length: GN }, (_, i) => gau(GVv(i), 0, 1)), s = d.reduce((a, b) => a + b, 0); return d.map(v => v / s); };
  const KER = (() => { const k = []; for (let j = -9; j <= 9; j++) k.push(gau(j * .125, 0, .3)); const s = k.reduce((a, b) => a + b, 0); return k.map(v => v / s); })();
  function proxGer(S) {
    const w = AMB[S.amb].w; let d = S.dens.map((v, i) => v * w(GVv(i))); const s = d.reduce((a, b) => a + b, 0); d = d.map(v => v / s);
    S.prev = S.dens; S.dens = d.map((_, i) => { let a = 0; for (let j = -9; j <= 9; j++) { const q = i + j; if (q >= 0 && q < GN) a += d[q] * KER[j + 9]; } return a; });
    const z = S.dens.reduce((a, b) => a + b, 0); S.dens = S.dens.map(v => v / z); S.gn++;
  }
  const estat = d => { let m = 0; d.forEach((v, i) => m += v * GVv(i)); let va = 0; d.forEach((v, i) => va += v * (GVv(i) - m) ** 2); const mx = Math.max(...d); let picos = 0; for (let i = 2; i < GN - 2; i++) if (d[i] > d[i - 1] && d[i] >= d[i + 1] && d[i] > d[i - 2] && d[i] > .35 * mx) picos++; return { m, sd: Math.sqrt(va), bi: picos >= 2 }; };
  function tipoNome(S) { if (!S.gn) return null; const e = estat(S.dens); if (e.bi) return 'seleção disruptiva: a curva se partiu em duas'; if (Math.abs(e.m) > .3) return S.amb === 3 ? 'seleção sexual: a média andou para as caudas maiores' : 'seleção direcional: a média andou'; if (e.sd < .88) return 'seleção estabilizadora: a curva estreitou no mesmo lugar'; return 'ainda sem mudança visível: rode mais gerações'; }
  function novaAmb(S, k) { S.amb = k; S.dens = dens0(); S.prev = null; S.gn = 0; S.msg = null; }
  function sino(x0, x1, yb, h, d, sc, o = {}) { // d em densidade, sc = altura por unidade
    const P = d.map((v, i) => [lerp(x0, x1, i / (GN - 1)), yb - Math.min(h * 1.04, v * sc)]);
    if (o.f) { X.beginPath(); X.moveTo(x0, yb); P.forEach(q => X.lineTo(q[0], q[1])); X.lineTo(x1, yb); X.closePath(); X.fillStyle = o.f; X.fill(); }
    if (o.s) poly(P, o.s, o.lw || 2, o.dash);
  }
  const TRES = [
    { n: 'Estabilizadora', l: 'favorece o meio', z: [[-3.6, -1.4], [1.4, 3.6]], f: v => 1.6 * gau(v, 0, .6) },
    { n: 'Direcional', l: 'favorece um extremo', z: [[-3.6, 0]], f: v => gau(v, 1.3, .85) * 1.15 },
    { n: 'Disruptiva', l: 'favorece os dois extremos', z: [[-1, 1]], f: v => .8 * (gau(v, -1.7, .55) + gau(v, 1.7, .55)) }
  ];
  function drawTres(t, S, A) {
    const p = ciclo(Math.max(0, lt(S)), 10), wide = !NAR, ph = wide ? A.h - 8 : (A.h - 8) / 3, pw = wide ? (A.w - 32) / 3 : A.w;
    TRES.forEach((T, k) => {
      const x = wide ? A.x0 + k * (pw + 16) : A.x0, y = wide ? A.y0 : A.y0 + k * ph, hh = wide ? Math.min(ph - 84, 320) : ph - 40, yb = wide ? y + 60 + hh : y + 26 + hh, xa = x + 8, xb = x + pw - 8, X0 = v => lerp(xa, xb, (v + 3.5) / 7);
      title(T.n, wide ? x + pw / 2 : x + 6, y + 14, pw - 12, { c: EV.verde, a: wide ? 'center' : 'left', s: NAR ? 14 : 16 });
      if (wide) nome(T.l, x + pw / 2, y + 36, { c: C.txt });
      const top = yb - hh, f = ss(seg(p, .15, .45)), g = ss(seg(p, .55, .85));
      line(xa, yb, xb, yb, C.line, 1);
      T.z.forEach(([a, b]) => { const xa2 = X0(a), xb2 = X0(b), hf = (yb - top) * f; rr(xa2, top, xb2 - xa2, hf, 3, rgba(EV.alerta, .12)); X.save(); X.setLineDash([5, 4]); X.strokeStyle = rgba(EV.alerta, .9); X.lineWidth = 1.4; X.strokeRect(xa2, top, xb2 - xa2, hf); X.restore(); if (f > .6) nome(xb2 - xa2 > 64 ? 'eliminados' : 'elimin.', (xa2 + xb2) / 2, top + hf / 2, { s: 12, c: EV.alerta }); });
      const base = Array.from({ length: GN }, (_, i) => gau(GVv(i), 0, 1)), sc = hh / 1.7;
      sino(xa, xb, yb, hh, base, sc, { s: C.dim, lw: 2, f: rgba(C.dim, .14) });
      if (g > 0) { X.save(); X.globalAlpha *= g; sino(xa, xb, yb, hh, Array.from({ length: GN }, (_, i) => T.f(GVv(i))), sc, { f: rgba(EV.verde, .34), s: EV.verde, lw: 2.4 }); X.restore(); }
      if (!wide) nome(T.l, x + pw - 6, y + 14, { a: 'right', s: 12 });
    });
    cap(p < .3 ? 'A mesma curva em sino nos três painéis: muitos no meio, poucos nas pontas.' : p < .55 ? 'O filtro verde mostra quem a seleção elimina em cada caso.' : 'A curva da geração seguinte, em verde, mostra o tipo de seleção.');
  }
  function drawAmb(t, S, A) {
    const wide = !NAR, g = 8, chH = Math.min(A.h * (wide ? .56 : .46), 250), yb = A.y0 + chH - 30, hh = chH - 56;
    const xa = A.x0 + 6, xb = wide && S.amb === 3 ? A.x0 + A.w * .66 : A.x1 - 6, X0 = v => lerp(xa, xb, (v + 3.5) / 7);
    const d0 = dens0(), cur = S.dens, mx = Math.max(Math.max(...d0), Math.max(...cur), S.prev ? Math.max(...S.prev) : 0), sc = hh / mx / 1.05;
    line(xa, yb, xb, yb, C.line, 1);
    sino(xa, xb, yb, hh, d0, sc, { s: C.dim, lw: 1.6, dash: [5, 4] });
    if (S.prev) sino(xa, xb, yb, hh, S.prev, sc, { s: rgba(EV.verde, .5), lw: 1.4 });
    sino(xa, xb, yb, hh, cur, sc, { f: rgba(EV.verde, .34), s: EV.verde, lw: 2.4 });
    nome('menor', xa, yb + 12, { a: 'left', s: 12 }); nome('maior', xb, yb + 12, { a: 'right', s: 12 }); nome(S.amb === 3 ? 'tamanho da cauda' : 'tamanho do bico', (xa + xb) / 2, yb + 12, { s: 12 });
    // população em pontos (quantis)
    let ac = 0, k = 0; const cdf = cur.map(v => ac += v), pts = []; for (let i = 0; i < 48; i++) { const q = (i + .5) / 48; while (k < GN - 1 && cdf[k] < q) k++; pts.push(GVv(k)); }
    pts.forEach((v, i) => circ(X0(v) + ((i * 7) % 5 - 2) * .8, A.y0 + 10 + (i % 3) * 7, 2.6, EV.verde));
    nome(`geração ${S.gn}`, A.x0 + 2, A.y0 + 40, { a: 'left', s: 12 });
    if (S.amb === 3 && wide) {
      const gx = xb + 24, gw = A.x1 - gx; panel(gx, A.y0 + 6, gw, 120);
      let sv = 0, ms = 0; S.dens.forEach((v, i) => { sv += v * sg(-(GVv(i) - 1) * 1.1); ms += v * sg((GVv(i) - .5) * 2); });
      [['sobrevivência', sv, EV.alerta], ['sucesso para acasalar', ms, EV.verde]].forEach(([n, v, c], i) => { const yy = A.y0 + 30 + i * 46; nome(n, gx + 10, yy - 8, { a: 'left', s: 12, c: C.txt }); rr(gx + 10, yy + 2, gw - 20, 10, 5, rgba(c, .15), rgba(c, .5), 1); rr(gx + 10, yy + 2, Math.max(6, (gw - 20) * v), 10, 5, c); });
    }
    const tn = tipoNome(S); if (tn) { pill(tn, A.cx, yb + 38, EV.verde); }
    const by = yb + 60, cols = NAR ? 2 : 4, bw = (A.w - (cols - 1) * g) / cols, bh = 34;
    AMB.forEach((a, i) => bt(S, A.x0 + (i % cols) * (bw + g), by + Math.floor(i / cols) * (bh + 6), bw, bh, a.n, EV.verde, 'am' + i, S.amb === i));
    const ry = by + Math.ceil(4 / cols) * (bh + 6) + 2, hw = (A.w - g) / 2;
    bt(S, A.x0, ry, hw, bh, 'próxima geração', EV.verde, 'ger'); bt(S, A.x0 + hw + g, ry, hw, bh, 'rodar 5 gerações', EV.verde, 'ger5');
    cap(S.msg || (S.amb === 3 ? 'Na seleção sexual a cauda longa ajuda a conseguir parceiro e atrapalha a sobrevivência.' : 'O ambiente decide qual fenótipo é melhor; a curva mostra o tipo de seleção.'));
  }
  def('selecao', 'tipos', {
    t: 'Estabilizadora, direcional, disruptiva e sexual', s: 'a seleção pode puxar a curva para o meio, para um lado ou para as pontas', c: EV.verde,
    loc: S => S.modo === 'amb' ? 'Escolha o ambiente' : 'Os três tipos', locNota: S => S.modo === 'amb' ? SIM : NOTA, still: 20,
    alt: 'três curvas em sino cinzas, cada uma com um filtro verde que elimina o meio, um lado ou as pontas, e a curva da geração seguinte em verde; e uma população ao vivo com quatro ambientes para escolher, em que a curva estreita, anda ou se parte a cada geração',
    extra: [mdE('tres', 'Os três tipos'), mdE('amb', 'Escolha o ambiente', S => novaAmb(S, S.amb || 0))], ctlVis: S => S.modo === 'tres',
    init(S) { S.modo = 'tres'; S.t0 = 0; S.msg = null; novaAmb(S, 0); },
    d: TXT.SE1.d, enem: TXT.SE1.enem, links: [['Fatores evolutivos na Genética', '../genetica/index.html#populacoes/fatores'], ['Aves e mamíferos em Plantas e animais', '../plantas-animais/index.html']],
    tap(x, y, S) {
      if (S.modo !== 'amb') return; const h = hid(x, y); if (!h) return; flash(S, h);
      if (h[0] === 'a' && h[1] === 'm') novaAmb(S, +h.slice(2)); else if (h === 'ger') proxGer(S); else if (h === 'ger5') for (let i = 0; i < 5; i++) proxGer(S);
    },
    draw(t, S) { const A = area(); if (S.modo === 'amb') drawAmb(t, S, A); else drawTres(t, S, A); }
  });
  // ---------- SE2: mariposas, bactérias e insetos ----------
  const MARIP = [[1800, 1], [1848, 2], [1870, 20], [1890, 90], [1898, 98], [1930, 95], [1950, 90], [1970, 60], [1990, 15]];
  const MPOS = [[.2, .1], [.7, .16], [.4, .3], [.78, .42], [.25, .52], [.6, .62], [.35, .78], [.75, .86]];
  const ESC = [[2], [0, 1, 2, 3, 4, 5, 6], [2]];
  function mariposa(x, y, s, escura, a = 1) {
    X.save(); X.globalAlpha *= a; const c = escura ? '#26221F' : '#EDE6D0';
    ell(x - s * .32, y, s * .34, s * .2, -.3, c, escura ? EV.gelo : 'rgba(11,15,28,.5)', 1); ell(x + s * .32, y, s * .34, s * .2, .3, c, escura ? EV.gelo : 'rgba(11,15,28,.5)', 1); ell(x, y, s * .08, s * .24, 0, escura ? '#0B0F1C' : '#B8AE8E'); X.restore();
  }
  function tronco(x, y, w, h, e, a, S, k, p) {
    X.save(); X.globalAlpha *= a; const esc = e === 1;
    rr(x, y, w, h, 8, esc ? '#3A3330' : '#C9C2A8', 'rgba(11,15,28,.6)', 1.3);
    const R = rng(11 + e); for (let i = 0; i < 9; i++) { const lx = x + 6 + R() * (w - 12), ly = y + 8 + R() * (h - 16); if (esc) circ(lx, ly, 2, '#2A2522'); else circ(lx, ly, 4 + R() * 3, rgba('#C8D79A', .75)); }
    const dark = ESC[k]; let alvo = k === 1 ? 4 : 2; // a mariposa mais visível
    MPOS.forEach((q, i) => {
      const mx = x + w * q[0] * .8 + w * .1, my = y + h * q[1] * .86 + h * .07, esc2 = dark.includes(i);
      const u = cl(p, 0, 1), comida = i === alvo && u > .55 && a > .9;
      mariposa(mx, my, Math.min(w * .26, 30), esc2, comida ? Math.max(0, 1 - (u - .55) * 6) : 1); if (comida && u < .62) xis(mx, my, 14, EV.alerta);
    });
    if (a > .9 && p > .1 && p < .9) { const q = MPOS[alvo], mx = x + w * q[0] * .8 + w * .1, my = y + h * q[1] * .86 + h * .07, u = (p - .1) / .8, k2 = u < .5 ? ss(u / .5) : 1 - ss((u - .5) / .5); bicho('ave', lerp(x + w * .92, mx + 8, k2), lerp(y + 6, my - 6, k2), Math.min(40, w * .4), { c: EV.gelo, flip: true }); }
    X.restore();
  }
  function drawMar(t, S, A) {
    const p = ciclo(Math.max(0, lt(S)), 12), wide = !NAR, tw = wide ? A.w * .56 : A.w, th = wide ? A.h - 40 : A.h * .54, tr = (tw - 28) / 3, k = Math.min(2, Math.floor(p * 3)), q = p >= 1 ? 1 : fr(p * 3);
    const nm = ['antes da indústria', 'com fuligem', 'ar limpo de novo'];
    for (let i = 0; i < 3; i++) { const x = A.x0 + i * (tr + 14); tronco(x, A.y0 + 24, tr, th - 52, i, p >= 1 ? 1 : i === k ? 1 : i < k ? .85 : .4, S, i, p >= 1 ? 1 : i === k ? q : i < k ? 1 : 0); nome(nm[i], x + tr / 2, A.y0 + 12, { s: 12, c: i === k || p >= 1 ? C.txt : C.dim }); nome(i === 1 ? 'líquen morto' : 'líquen claro', x + tr / 2, A.y0 + th - 14, { s: 12 }); }
    const cx0 = wide ? A.x0 + tw + 34 : A.x0 + 34, cx1 = A.x1 - 22, cy0 = wide ? A.y0 + 20 : A.y0 + th + 6, cy1 = wide ? A.y0 + th - 30 : A.y1 - 22;
    nome('mariposas escuras na população', wide ? (cx0 + cx1) / 2 : A.cx, cy0 - 8, { s: 12, c: C.txt });
    const X0 = a => lerp(cx0, cx1, (a - 1800) / 200), Y0 = v => lerp(cy1, cy0 + 6, v / 100);
    line(cx0, cy1, cx1, cy1, C.line, 1); line(cx0, cy0 + 6, cx0, cy1, C.line, 1);
    [0, 50, 100].forEach(v => nome(v + '%', cx0 - 10, Y0(v), { a: 'right', s: 12 })); [1800, 1900, 2000].forEach(a => nome(String(a), X0(a), cy1 + 12, { s: 12 }));
    const yr = lerp(1800, 1990, p), pts = []; MARIP.forEach(([a, v]) => { if (a <= yr) pts.push([X0(a), Y0(v)]); });
    let vy = MARIP[0][1]; for (let i = 1; i < MARIP.length; i++) if (yr <= MARIP[i][0]) { vy = lerp(MARIP[i - 1][1], MARIP[i][1], (yr - MARIP[i - 1][0]) / (MARIP[i][0] - MARIP[i - 1][0])); break; } else vy = MARIP[i][1];
    pts.push([X0(yr), Y0(vy)]); poly(pts, EV.verde, 2.6); circ(X0(yr), Y0(vy), 4.5, EV.ouro, '#0B0F1C', 1.5);
    cap(p < .34 ? 'Antes da indústria quase todas eram claras, camufladas nos troncos com líquen. A ave pega as escuras.' : p < .67 ? 'A fuligem escureceu os troncos: as claras ficaram visíveis e as escuras deixaram mais filhotes.' : 'Com o ar limpo os troncos clarearam e a forma clara voltou a predominar. O alelo escuro já existia; o ambiente mudou quem era favorecido.');
  }
  // placa de bactérias e lavoura: 200 pontos com tipos (0 sensível, 1 resistente, 2 segunda resistência)
  const PERM = (() => { const r = rng(99), a = Array.from({ length: 200 }, (_, i) => i); for (let i = 199; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; })();
  function popInit(S) { S.fase = 'ocioso'; S.tt = 0; S.n = S.modo === 'bac' ? [196, 4, 0] : [192, 4, 4]; S.cyc = 0; S.cedo = true; S.plas = false; S.rev = false; S.prod = 0; S.defesa = false; S.msg = null; S.hist = []; }
  function tipos(n) { const T = Array(200).fill(-1); let k = 0; [0, 1, 2].forEach(ty => { for (let i = 0; i < n[ty]; i++) if (k < 200) T[PERM[k++]] = ty; }); return T; }
  function aplica(S) {
    const bac = S.modo === 'bac', n = S.n.slice(), f = bac ? Math.pow(.35, S.cedo ? 3 : 7) : .15; let r, defesa = false;
    if (bac) { r = [Math.round(n[0] * f), n[1], 0]; if (!S.cedo && r[0] + r[1] <= 6) { r = [0, 0, 0]; defesa = true; } } else r = [0, 1, 2].map(i => i === S.prod ? n[i] : Math.round(n[i] * f));
    const tot = r[0] + r[1] + r[2]; let g = [0, 0, 0];
    if (tot > 0) { g = r.map(v => Math.round(200 * v / tot)); if (bac && S.plas) { const add = Math.round(g[0] * .15); g[0] -= add; g[1] += add; } g[0] += 200 - g[0] - g[1] - g[2]; }
    S.apos = r; S.novo = g; S.defesa = defesa; S.dias = bac ? (S.cedo ? 3 : 7) : 1;
  }
  function trata(S) {
    if (S.fase !== 'ocioso') return; S.s0 = S.n.slice(); aplica(S); S.cyc++;
    if (S.paused) { S.n = S.novo; fimTrat(S); } else { S.fase = 'trata'; S.tt = 0; }
  }
  function fimTrat(S) {
    S.fase = 'ocioso'; const tot = S.n[1] + S.n[2];
    if (S.modo === 'bac') S.msg = S.n[0] + S.n[1] === 0 ? 'A placa zerou: o tratamento completo, com as defesas do corpo, eliminou as bactérias.' : `Resistentes: cerca de ${Math.round(100 * S.n[1] / 200)}% da placa. ${S.cedo ? 'Parar cedo deixou as resistentes sozinhas para se multiplicar.' : 'Mesmo indo até o fim, as resistentes que já eram muitas continuam.'}`;
    else S.msg = `Resistentes ao produto A: cerca de ${Math.round(100 * S.n[1] / 200)}%; ao produto B: cerca de ${Math.round(100 * S.n[2] / 200)}%. ${S.rev ? 'Revezar os produtos segura as duas.' : 'Repetir o mesmo produto seleciona quem já resiste a ele.'}`;
    if (S.rev) S.prod = 1 - S.prod; void tot;
  }
  function drawPop(t, S, A) {
    const bac = S.modo === 'bac', wide = !NAR; let n = S.n, extra = '';
    if (S.fase === 'trata') {
      S.tt += S.dt; const dur = S.dias * .6 + .3, d = Math.min(S.dias, Math.floor(S.tt / .6) + 1);
      n = bac ? [Math.round(S.s0[0] * Math.pow(.35, d)), S.s0[1], 0] : S.apos; extra = bac ? `dia ${d} de ${S.dias}` : 'aplicando o produto';
      if (S.tt > dur) { S.fase = 'cresce'; S.tt = 0; S.n = S.novo; S.vis = S.apos; }
    } else if (S.fase === 'cresce') { S.tt += S.dt; const k = ss(S.tt / 1.1); n = S.apos.map((v, i) => Math.round(lerp(v, S.novo[i], k))); n[0] += 200 - n[0] - n[1] - n[2]; if (S.tt > 1.1) fimTrat(S); else extra = 'as sobreviventes se multiplicam'; }
    const R = wide ? Math.min(A.h * .46, A.w * .22) : Math.min(A.w * .3, A.h * .26), cx = wide ? A.x0 + R + 16 : A.cx, cy = wide ? A.cy : A.y0 + R + 16;
    circ(cx, cy, R + 6, rgba(EV.gelo, .06), rgba(EV.gelo, .7), 2); nome(bac ? 'placa com cerca de 200 bactérias' : 'lavoura com cerca de 200 insetos', cx, cy - R - 16, { s: 12 });
    const T = tipos(n), COL = [EV.cinza, EV.coral, EV.laR];
    T.forEach((ty, i) => { if (ty < 0) return; const rr0 = R * Math.sqrt((i + .5) / 200), th = i * 2.39996, x = cx + Math.cos(th) * rr0 * .93, y = cy + Math.sin(th) * rr0 * .93, rd = Math.max(3, R / 17); if (bac) circ(x, y, rd, COL[ty], 'rgba(11,15,28,.5)', .8); else { ell(x, y, rd * 1.2, rd * .8, th, COL[ty], 'rgba(11,15,28,.5)', .8); } });
    if (extra) nome(extra, cx, cy + R + 18, { s: 12, c: EV.ouro }); if (S.defesa && S.fase === 'cresce') for (let i = 0; i < 5; i++) circ(cx + Math.cos(i * 1.3 + S.ph) * R * .5, cy + Math.sin(i * 1.7) * R * .5, 7, rgba('#FFFFFF', .85), EV.gelo, 1.4);
    // painel e controles
    const px = wide ? cx + R + 30 : A.x0, pw = wide ? A.x1 - px : A.w, py = wide ? A.y0 + 6 : cy + R + (extra ? 30 : 26), g = 8;
    const nr = n[1] + n[2], res = [`bactérias resistentes: cerca de ${Math.round(100 * n[1] / 200)}%`, `resistentes ao produto A: cerca de ${Math.round(100 * n[1] / 200)}%`], resB = `resistentes ao produto B: cerca de ${Math.round(100 * n[2] / 200)}%`;
    void nr; nome(bac ? res[0] : res[1], px, py + 8, { a: 'left', c: C.txt }); if (!bac) nome(resB, px, py + 26, { a: 'left', c: C.txt });
    const bh = 34, y1 = py + (bac ? 24 : 42), cols = wide ? 1 : 2, bw = (pw - (cols - 1) * g) / cols; let k = 0; const pos = () => { const i = k++; return [px + (i % cols) * (bw + g), y1 + Math.floor(i / cols) * (bh + 6)]; };
    if (bac) {
      let [x, y] = pos(); bt(S, x, y, bw, bh, S.cyc ? 'repetir o tratamento' : 'dar antibiótico', EV.verde, 'dar');
      [x, y] = pos(); bt(S, x, y, bw, bh, 'parar no 3º dia', EV.laR, 'ced', S.cedo); [x, y] = pos(); bt(S, x, y, bw, bh, 'ir até o fim', EV.laR, 'fim', !S.cedo);
      [x, y] = pos(); bt(S, x, y, bw, bh, `troca de plasmídio: ${S.plas ? 'ligada' : 'desligada'}`, EV.agua, 'pla', S.plas);
    } else {
      let [x, y] = pos(); bt(S, x, y, bw, bh, `aplicar o produto ${S.prod ? 'B' : 'A'}`, EV.verde, 'dar');
      [x, y] = pos(); bt(S, x, y, bw, bh, `revezar produtos: ${S.rev ? 'sim' : 'não'}`, EV.laR, 'rev', S.rev);
    }
    const lx = wide ? px : A.x0, ly = wide ? y1 + (bac ? 4 : 2) * (bh + 6) + 10 : y1 + Math.ceil((bac ? 4 : 2) / cols) * (bh + 6) + 4;
    [[EV.cinza, bac ? 'sensível' : 'sensível aos dois'], [EV.coral, bac ? 'resistente' : 'resistente ao A'], ...(bac ? [] : [[EV.laR, 'resistente ao B']])].forEach(([c, s], i) => { circ(lx + 6 + i * (NAR ? 100 : 118), ly, 5, c); nome(s, lx + 16 + i * (NAR ? 100 : 118), ly, { a: 'left', s: 12 }); });
    if (bac) nome(EDU, lx, ly + 20, { a: 'left', s: 12 });
    cap(S.msg || (bac ? 'Dê o antibiótico e escolha parar cedo ou ir até o fim: quem sobrevive é quem já era resistente.' : 'Aplique o mesmo produto algumas vezes e depois reviste: o inseticida seleciona quem já resistia.'));
  }
  def('selecao', 'casos', {
    t: 'Mariposas, bactérias e insetos', s: 'a seleção acontecendo diante dos nossos olhos', c: EV.verde,
    loc: S => ({ mar: 'Mariposa e fuligem', bac: 'Tratamento completo ou pela metade', ins: 'Lavoura e inseticida' })[S.modo], locNota: S => S.modo === 'mar' ? NOTA : SIM, still: 20,
    alt: 'um tronco de árvore em três momentos, com líquen claro, com fuligem e limpo de novo, e mariposas claras e escuras sendo pegas por uma ave, ao lado de um gráfico da porcentagem de escuras; e uma placa com cerca de duzentas bactérias, ou uma lavoura de insetos, em que o antibiótico ou o inseticida deixa só os resistentes',
    extra: [mdE('mar', 'Mariposa e fuligem'), mdE('bac', 'Tratamento completo ou pela metade', S => popInit(S)), mdE('ins', 'Lavoura e inseticida', S => popInit(S))], ctlVis: S => S.modo === 'mar',
    init(S) { S.modo = 'mar'; S.t0 = 0; S.msg = null; popInit(S); },
    d: TXT.SE2.d, enem: TXT.SE2.enem, links: [['Bactérias e plasmídios em Microrganismos', '../microrganismos/index.html'], ['Fatores evolutivos na Genética', '../genetica/index.html#populacoes/fatores'], ['Resistência como evidência', '#evidencias/resistencia'], ['Lamarck para comparar', '#ideias/lamarck']],
    tap(x, y, S) {
      if (S.modo === 'mar') return; const h = hid(x, y); if (!h) return; flash(S, h);
      if (h === 'dar') trata(S); else if (h === 'ced') S.cedo = true; else if (h === 'fim') S.cedo = false; else if (h === 'pla') S.plas = !S.plas; else if (h === 'rev') S.rev = !S.rev;
    },
    draw(t, S) { const A = area(); if (S.modo === 'mar') drawMar(t, S, A); else drawPop(t, S, A); }
  });

  // ---------- A1: deriva genética e fluxo gênico ----------
  const BA = EV.violeta, BB = EV.ouro;
  const binom = (n, p, r) => { let c = 0; for (let i = 0; i < n; i++) if (r() < p) c++; return c; };
  function sorteios(N, seed, passos, quer) { for (let s = seed; ; s++) { const r = rng(s); let p = .5; const L = [p]; for (let i = 0; i < passos; i++) { p = binom(N, p, r) / N; L.push(p); } const fix = L.findIndex(v => v === 0 || v === 1); if (quer === 'fixa' ? fix > 0 && fix <= passos - 1 : L.every(v => Math.abs(v - .5) < .16)) return L; } }
  const SEQ = { grande: sorteios(60, 3, 6, 'estavel'), pequena: sorteios(6, 5, 6, 'fixa') };
  function bolas(x, y, w, h, n, nA, a = 1, ids) {
    const cols = Math.max(1, Math.round(Math.sqrt(n * w / h))), rows = Math.ceil(n / cols), r = Math.min(w / cols, h / rows) / 2 * .86;
    for (let i = 0; i < n; i++) { const cxx = x + (i % cols + .5) * w / cols, cyy = y + (Math.floor(i / cols) + .5) * h / rows; X.save(); X.globalAlpha *= (ids && ids[i] != null ? ids[i] : a); circ(cxx, cyy, r, i < nA ? BA : BB, 'rgba(11,15,28,.55)', 1); X.restore(); }
  }
  function saco(x, y, w, h, c) { shape([[x + w * .28, y], [x + w * .72, y], [x + w * .8, y + h * .18], [x + w, y + h * .4], [x + w * .96, y + h * .92], [x + w * .86, y + h], [x + w * .14, y + h], [x + w * .04, y + h * .92], [x, y + h * .4], [x + w * .2, y + h * .18]], rgba(c, .08), rgba(c, .7), 1.6); }
  function drawSaco(t, S, A) {
    const p = ciclo(Math.max(0, lt(S)), 12), g = Math.min(6, Math.floor(p * 6 + (p >= 1 ? 1 : 0))), bw = Math.min(NAR ? 150 : 230, (A.w - 40) / 2), bh = Math.min(A.h - 120, NAR ? 260 : 230), by = A.y0 + 40;
    [['grande', 60, (NAR ? 'população grande: 60' : 'população grande: 60 bolinhas'), A.cx - bw - 14], ['pequena', 6, (NAR ? 'população pequena: 6' : 'população pequena: 6 bolinhas'), A.cx + 14]].forEach(([k, N, nm, x]) => {
      const f = SEQ[k][Math.min(g, 6)], nA = Math.round(f * N); saco(x, by, bw, bh, C.dim); bolas(x + bw * .16, by + bh * .26, bw * .68, bh * .6, N, nA);
      title(nm, x + bw / 2, by - 20, bw + 24, { s: NAR ? 12 : 14, c: C.txt }); nome(`geração ${Math.min(g, 6)}: ${nA} roxas, ${N - nA} amarelas`, x + bw / 2, by + bh + 14, { s: 12, c: C.txt });
      if (f === 0 || f === 1) nome(f === 1 ? 'a roxa fixou: a amarela sumiu' : 'a amarela fixou: a roxa sumiu', x + bw / 2, by + bh + 32, { s: 12, c: EV.alerta });
    });
    nome('cada geração é um sorteio de bolinhas do saco anterior', A.cx, A.y1 - 8, { s: 12 });
    cap(g < 2 ? 'Cada saco começa com metade de cada cor. A próxima geração é uma amostra sorteada do saco.' : 'No saco grande a proporção quase não muda; no pequeno, uma cor pode sumir em poucas rodadas: é a deriva.');
  }
  function drawGarg(t, S, A) {
    const p = ciclo(Math.max(0, lt(S)), 12), rh = (A.h - 8) / 2, g = NAR ? 22 : 36, bw = (A.w - 2 * g) / 3, n = 24;
    const linha = (y, titulo, orig, nA0, sob, nA1, nomes, tipo) => {
      title(titulo, A.x0 + 4, y + 8, A.w, { a: 'left', s: NAR ? 13 : 15, c: EV.violeta });
      const by = y + 24, bh = rh - 52, a1 = ss(seg(p, .0, .1)), a2 = ss(seg(p, .3, .45)), a3 = ss(seg(p, .65, .8));
      [0, 1, 2].forEach(i => { const x = A.x0 + i * (bw + g); rr(x, by, bw, bh, 10, rgba(EV.violeta, .05), rgba(C.dim, .5), 1.2); nome(nomes[i], x + bw / 2, by + bh + 12, { s: 12 }); });
      X.save(); X.globalAlpha *= a1; bolas(A.x0 + 8, by + 8, bw - 16, bh - 16, n, nA0); X.restore();
      const ids = Array.from({ length: n }, (_, i) => i < sob ? 1 : 1 - ss(seg(p, .35, .5)) * .85); // sobreviventes primeiro
      if (p > .3) { X.save(); X.globalAlpha *= a2; const x2 = A.x0 + bw + g; bolas(x2 + bw * .1, by + bh * .12, bw * .8, bh * .76, sob, nA1 < 0 ? 0 : tipo === 'gar' ? 1 : 1); X.restore(); void ids; }
      X.save(); X.globalAlpha *= a3; const x3 = A.x0 + 2 * (bw + g), nn = Math.round(n * (tipo === 'gar' ? .25 : 1 / 3)); bolas(x3 + 8, by + 8, bw - 16, bh - 16, n, nn); X.restore();
      [0, 1].forEach(i => { if ((i === 0 ? a2 : a3) > .1) arrow(A.x0 + (i + 1) * bw + i * g + 4, by + bh / 2, A.x0 + (i + 1) * (bw + g) - 4, by + bh / 2, rgba(C.dim, .9), 2); });
    };
    // gargalo: 4 sobreviventes (1 roxa, 3 amarelas); fundador: 3 no barco (1 roxa, 2 amarelas), origem com 2 roxas em 24
    linha(A.y0, 'Gargalo: uma catástrofe deixa poucos sobreviventes', 12, 4, 4, 1, ['população original', 'sobreviventes: 4', 'população depois'], 'gar');
    linha(A.y0 + rh + 8, 'Fundador: poucos indivíduos fundam uma ilha', 2, 3, 3, 1, ['população de origem', 'barco: 3 indivíduos', 'população da ilha'], 'fun');
    cap(p < .3 ? 'Duas histórias com a mesma ideia: poucos indivíduos carregam só uma amostra dos alelos.' : p < .65 ? 'Só alguns passam: no gargalo por sorte da catástrofe, no fundador porque embarcaram.' : 'A população nova cresce a partir dessa amostra e fica diferente da original.');
  }
  const LINHA = ['#9A6BFF', '#FF9A3C', '#2FCFBF', '#F06AAE', '#F7C13B'];
  function simula(S) {
    const N = S.N, mig = Math.min(1, S.v / N), L = Array.from({ length: 5 }, () => [.5]), R = [0, 1, 2, 3, 4].map(i => rng(S.sem * 31 + i * 977 + 5));
    if (S.fund) for (let i = 0; i < 5; i++) L[i][0] = binom(5, .5, R[i]) / 5;
    for (let g = 1; g <= 50; g++) { const pm = L.reduce((a, l) => a + l[g - 1], 0) / 5, Nn = S.cat != null && g >= S.cat && g < S.cat + 2 ? Math.min(3, N) : N; for (let i = 0; i < 5; i++) { const pi = L[i][g - 1] * (1 - mig) + pm * mig; L[i].push(binom(Nn, pi, R[i]) / Nn); } }
    S.L = L; S.chave = [S.N, S.cat, S.fund, S.v].join('|');
  }
  function drawDados(t, S, A) {
    if (S.chave !== [S.N, S.cat, S.fund, S.v].join('|')) { simula(S); S.t0 = agora(S); }
    const wide = !NAR, g = Math.min(50, lt(S) * 8), cw = wide ? A.w * .64 : A.w, ch = wide ? A.h - 40 : A.h * .48, x0 = A.x0 + 34, x1 = A.x0 + cw - 6, y0 = A.y0 + 10, y1 = A.y0 + ch - 6;
    const X0 = i => lerp(x0, x1, i / 50), Y0 = v => lerp(y1, y0, v);
    line(x0, y1, x1, y1, C.line, 1); line(x0, y0, x0, y1, C.line, 1); [0, .5, 1].forEach(v => { nome(v === .5 ? '0,5' : String(v), x0 - 5, Y0(v), { a: 'right', s: 12 }); if (v === .5) line(x0, Y0(v), x1, Y0(v), rgba(C.dim, .3), 1, [3, 4]); });
    [0, 25, 50].forEach(i => nome(String(i), X0(i), y1 + 12, { s: 12 })); nome('gerações', (x0 + x1) / 2, y1 + 26, { s: 12 }); nome('frequência do alelo', A.x0 + 2, y0 - 2, { a: 'left', s: 12 });
    if (S.cat != null) { line(X0(S.cat), y0, X0(S.cat), y1, rgba(EV.alerta, .7), 1.5, [5, 4]); nome('catástrofe', X0(S.cat) + 4, y0 + 8, { a: 'left', s: 12, c: EV.alerta }); }
    let fix = 0; S.L.forEach((l, i) => { const m = Math.floor(g), pts = []; for (let j = 0; j <= m; j++) pts.push([X0(j), Y0(l[j])]); if (m < 50) pts.push([X0(g), Y0(lerp(l[m], l[m + 1], g - m))]); poly(pts, LINHA[i], 2.2); const fin = l[Math.min(50, m)]; if ((fin === 0 || fin === 1) && g >= 1) fix++; });
    const px = wide ? x1 + 30 : A.x0, pw = wide ? A.x1 - px : A.w, py = wide ? A.y0 + 4 : y1 + 40, bh = 34, gp = 8, cols = wide ? 1 : 3, bw = (pw - (cols - 1) * gp) / cols;
    nome(`populações que já fixaram: ${fix} de 5`, px, py + 6, { a: 'left', c: C.txt, s: fsz() });
    [10, 100, 1000].forEach((n, i) => bt(S, px + (wide ? 0 : i * (bw + gp)), py + 22 + (wide ? i * (bh + 6) : 0), bw, bh, `população de ${n}`, EV.violeta, 'n' + n, S.N === n));
    const y2 = py + 22 + (wide ? 3 * (bh + 6) : bh + 6);
    bt(S, px, y2, wide ? bw : (pw - gp) / 2, bh, 'catástrofe agora', EV.alerta, 'cat'); bt(S, wide ? px : px + (pw - gp) / 2 + gp, wide ? y2 + bh + 6 : y2, wide ? bw : (pw - gp) / 2, bh, `fundar com 5: ${S.fund ? 'sim' : 'não'}`, EV.violeta, 'fun', S.fund);
    cap(S.v > 0 ? `Com migrantes, as populações trocam alelos e as linhas se aproximam (fluxo gênico).` : S.N <= 10 ? 'Com 10 indivíduos as linhas se espalham e várias batem em 0 ou 1: a sorte escolhe.' : S.N >= 1000 ? 'Com 1000 indivíduos as linhas ficam perto do começo: a deriva é fraca.' : 'Cinco populações iguais, cinco histórias diferentes: na deriva, a sorte escolhe.');
  }
  def('acaso', 'deriva', {
    t: 'Deriva genética e fluxo gênico', s: 'quando a sorte e as viagens mudam a população', c: EV.violeta,
    loc: S => ({ saco: 'Saco de bolinhas', garg: 'Gargalo e fundador', dados: 'Lance os dados da população' })[S.modo], locNota: S => S.modo === 'dados' ? SIM : NOTA, still: 20,
    alt: 'dois sacos de bolinhas de duas cores, um grande e um pequeno, sorteados geração após geração; um gargalo e um barco de fundadores que deixam poucas bolinhas; e um gráfico com cinco linhas de frequência de um alelo em cinquenta gerações, com botões de tamanho da população, catástrofe, fundar ilha e migrantes',
    extra: [mdE('saco', 'Saco de bolinhas'), mdE('garg', 'Gargalo e fundador'), mdE('dados', 'Lance os dados', S => { S.chave = null; })],
    ctl: { l: 'Migrantes por geração', min: 0, max: 5, step: 1, v: 0, f: v => v === 0 ? 'nenhum' : String(v), rate: () => 1 }, ctlVis: S => S.modo === 'dados',
    init(S) { S.modo = 'saco'; S.t0 = 0; S.msg = null; S.N = 10; S.cat = null; S.fund = false; S.chave = null; S.sem = 1; },
    d: TXT.A1.d, enem: TXT.A1.enem, links: [['Fatores evolutivos na Genética', '../genetica/index.html#populacoes/fatores'], ['Hardy-Weinberg na Genética', '../genetica/index.html#populacoes/hardy-weinberg']],
    tap(x, y, S) {
      if (S.modo !== 'dados') return; const h = hid(x, y); if (!h) return; flash(S, h);
      if (h[0] === 'n') S.N = +h.slice(1); else if (h === 'cat') S.cat = S.paused ? 25 : cl(Math.floor(lt(S) * 8), 2, 45); else if (h === 'fun') S.fund = !S.fund;
    },
    draw(t, S) { const A = area(); if (S.modo === 'dados') drawDados(t, S, A); else if (S.modo === 'garg') drawGarg(t, S, A); else drawSaco(t, S, A); }
  });
  // ---------- ES1: como nasce uma espécie ----------
  const PD = (() => { const r = rng(5), L = []; for (let i = 0; i < 30; i++) L.push([r(), r(), r(), r()]); return L; })(); // x, y, x misturado, y misturado
  const TOM0 = '#9FE3F5';
  function mapa(x, y, w, h) { rr(x, y, w, h, 12, rgba(EV.solo, .16), rgba(EV.solo, .55), 1.4); }
  function barreira(tipo, x, y, w, h, k) { // k 0 a 1 = altura/presença
    if (k <= .02) return; const cx = x + w / 2; X.save(); X.globalAlpha *= Math.min(1, k * 1.4);
    if (tipo === 'montanha') { // uma única crista contínua, de cima a baixo, com dentes de serra
      const t0 = y + 32, t1 = y + h - 6, N = 12, bw = w * .09 * k, L = [], R = [];
      for (let i = 0; i <= N; i++) { const yy = lerp(t0, t1, i / N), a = i % 2 ? .35 : 1; L.push([cx - bw * a - (i % 2 ? 0 : bw * .25), yy]); R.push([cx + bw * a + (i % 2 ? 0 : bw * .25), yy]); }
      shape(L.concat(R.reverse()), rgba(EV.solo, .75), EV.solo, 1.6); }
    else { const bw = tipo === 'mar' ? w * .14 : w * .06; X.beginPath(); X.moveTo(cx - bw / 2, y); for (let i = 0; i <= 20; i++) X.lineTo(cx - bw / 2 + Math.sin(i * .9 + S0) * bw * .14, y + h * i / 20); for (let i = 20; i >= 0; i--) X.lineTo(cx + bw / 2 + Math.sin(i * .9 + S0 + 1) * bw * .14, y + h * i / 20); X.closePath(); X.fillStyle = rgba(EV.azS, .55); X.fill(); X.strokeStyle = EV.azS; X.lineWidth = 1.4; X.stroke(); }
    X.restore();
  }
  let S0 = 0;
  function pontos(x, y, w, h, d, mist, ban) {
    PD.forEach((q, i) => { const lado = i % 2, mx = x + w * (lerp(lado ? .56 : .06, q[2] * .9 + .05, mist) * (1) ), px = lado ? x + w * (.56 + q[0] * .38) : x + w * (.06 + q[0] * .38), py = y + h * (.1 + q[1] * .8), xx = lerp(px, x + w * (.05 + q[2] * .9), mist), yy = lerp(py, y + h * (.1 + q[3] * .8), mist); void mx;
      const c = mix(TOM0, lado ? EV.laR : EV.azS, d); circ(xx, yy, NAR ? 5 : 6.5, c, 'rgba(11,15,28,.6)', 1); });
    if (ban > 0) { X.save(); X.globalAlpha *= ban; for (let i = 0; i < 3; i++) { const cx = x + w / 2, cy = y + h * (.28 + i * .22); circ(cx - 14, cy, 6, mix(TOM0, EV.azS, d)); circ(cx + 14, cy, 6, mix(TOM0, EV.laR, d)); circ(cx, cy, 9, 'rgba(11,15,28,.7)', EV.alerta, 2); line(cx - 6, cy + 6, cx + 6, cy - 6, EV.alerta, 2); } X.restore(); }
  }
  function cromos(x, y, n, c) { for (let i = 0; i < n; i++) { rr(x + i * 11, y, 6, 22, 3, rgba(c, .35), c, 1.3); } }
  function drawAlo(t, S, A) {
    S0 = S.ph; const p = ciclo(Math.max(0, lt(S)), 14), wide = !NAR, mw = wide ? A.w * .7 : A.w, mh = wide ? A.h - 50 : A.h - 120, my = A.y0 + 34;
    const E = [['isolamento', .08], ['diferenciação', .3], [NAR ? 'isol. reprodutivo' : 'isolamento reprodutivo', .8]];
    E.forEach(([n, a], i) => { const on = p >= a, cx = A.x0 + (i + .5) * (mw / 3); rr(A.x0 + i * (mw / 3) + 3, A.y0 + 2, mw / 3 - 6, 26, 8, rgba(EV.agua, on ? .25 : .06), rgba(EV.agua, on ? 1 : .35), on ? 2 : 1); tx(n, cx, A.y0 + 15.5, { s: NAR ? 11 : 13, w: 600, c: on ? C.txt : C.dim, bg: false }); });
    mapa(A.x0, my, mw, mh);
    const mont = ss(seg(p, .08, .28)) * (1 - ss(seg(p, .74, .82))), d = ss(seg(p, .3, .7)), mist = ss(seg(p, .8, .9)), ban = ss(seg(p, .88, .97));
    barreira('montanha', A.x0, my, mw, mh, mont); pontos(A.x0, my, mw, mh, d, mist, ban);
    if (mont > .5) nome('cordilheira', A.x0 + mw / 2, my + 16, { s: 12 }); if (ban > .5) nome('não cruzam mais', A.x0 + mw / 2, my + mh - 14, { s: 12, c: EV.alerta });
    if (wide) {
      const x = A.x0 + mw + 20, w = A.x1 - x; panel(x, my, w, mh); nome('sem barreira (simpátrica)', x + w / 2, my + 18, { s: 12, c: C.txt });
      const k = ss(seg(p, .3, .6)); cromos(x + w / 2 - 28, my + 40, 4, EV.lima); nome('planta: 4 cromossomos', x + w / 2, my + 80, { s: 12 });
      if (k > .02) { X.save(); X.globalAlpha *= k; arrow(x + w / 2, my + 90, x + w / 2, my + 116, C.dim, 2); cromos(x + w / 2 - 50, my + 128, 8, EV.lima); nome('poliploidia: 8', x + w / 2, my + 164, { s: 12, c: C.txt }); nome('não cruza com a de origem', x + w / 2, my + 184, { s: 12 }); X.restore(); }
    }
    cap(p < .08 ? 'Uma só população ocupa a região, com fluxo gênico livre entre todos.' : p < .3 ? 'Uma barreira geográfica divide a população e o fluxo gênico para.' : p < .74 ? 'Cada lado acumula mutações diferentes e sofre seleção e deriva em ambientes diferentes.' : 'Sem a barreira os grupos se encontram, mas já não cruzam: são duas espécies.');
  }
  const BARR = [['rio', 'rio'], ['montanha', 'montanha'], ['mar', 'mar subindo'], ['nenhuma', 'nenhuma']];
  function drawMonte(t, S, A) {
    S0 = S.ph; const wide = !NAR, mw = wide ? A.w * .62 : A.w, mh = Math.min(wide ? A.h - 40 : 150, 280), my = A.y0 + 2, nenhuma = S.bar === 'nenhuma', d = nenhuma ? 0 : S.v / 100;
    mapa(A.x0, my, mw, mh);
    const mist = nenhuma || S.rem ? 1 : 0; barreira(S.bar, A.x0, my, mw, mh, nenhuma ? 0 : S.rem ? 0 : 1);
    const duas = !nenhuma && S.rem && d >= .6, volta = !nenhuma && S.rem && d < .6;
    if (!S.path) pontos(A.x0, my, mw, mh, d, mist, duas ? 1 : 0);
    if (duas) { rr(A.x0 + mw / 2 - 70, my + mh - 40, 140, 30, 8, 'rgba(11,15,28,.85)', EV.ouro, 2); tx('duas espécies', A.x0 + mw / 2, my + mh - 25, { s: 14, w: 700, c: EV.ouro, bg: false }); }
    if (S.path === 'poli') { const l = lt(S), k = ss(seg(l, .2, 1.4)); cromos(A.x0 + mw / 2 - 28, my + 40, 4, EV.lima); nome('planta de origem: 4 cromossomos', A.x0 + mw / 2, my + 80, { s: 12 }); X.save(); X.globalAlpha *= k; arrow(A.x0 + mw / 2, my + 88, A.x0 + mw / 2, my + 108, C.dim, 2); cromos(A.x0 + mw / 2 - 50, my + 118, 8, EV.lima); nome('planta nova: 8, não cruza com a de origem', A.x0 + mw / 2, my + 154, { s: 12, c: C.txt }); X.restore(); if (k > .9) { rr(A.x0 + mw / 2 - 70, my + mh - 40, 140, 30, 8, 'rgba(11,15,28,.85)', EV.ouro, 2); tx('duas espécies', A.x0 + mw / 2, my + mh - 25, { s: 14, w: 700, c: EV.ouro, bg: false }); } }
    if (S.path === 'fruta') { const l = lt(S), k = ss(seg(l, .3, 1.6)); circ(A.x0 + mw * .27, my + mh * .45, 18, rgba(EV.alerta, .5), EV.alerta, 2); circ(A.x0 + mw * .73, my + mh * .45, 26, rgba(EV.verde, .35), EV.verde, 2); nome('espinheiro', A.x0 + mw * .27, my + mh * .45 + 34, { s: 12 }); nome('maçã', A.x0 + mw * .73, my + mh * .45 + 42, { s: 12 }); for (let i = 0; i < 4; i++) { circ(lerp(A.x0 + mw * .5, A.x0 + mw * (.2 + i * .04), k), my + mh * (.25 + .02 * i), 4, EV.azS); circ(lerp(A.x0 + mw * .5, A.x0 + mw * (.68 + i * .04), k), my + mh * (.25 + .02 * i), 4, EV.laR); } nome('cada grupo acasala na sua fruta: o cruzamento entre eles diminui', A.x0 + mw / 2, my + mh - 14, { s: 12, c: C.txt }); }
    // controles
    const g = 8, bh = 34, cx0 = wide ? A.x0 + mw + 20 : A.x0, cw = wide ? A.x1 - cx0 : A.w, cy0 = wide ? my : my + mh + 10;
    nome('barreira', cx0, cy0 + 6, { a: 'left', s: 12, c: C.txt });
    const cols = wide ? 2 : 4, bw = (cw - (cols - 1) * g) / cols; BARR.forEach(([k, n], i) => bt(S, cx0 + (i % cols) * (bw + g), cy0 + 18 + Math.floor(i / cols) * (bh + 6), bw, bh, n, EV.agua, 'b' + k, S.bar === k && !S.path));
    const ry = cy0 + 18 + Math.ceil(4 / cols) * (bh + 6) + 4;
    if (!nenhuma) bt(S, cx0, ry, wide ? cw : cw, bh, S.rem ? 'recolocar a barreira' : 'remover a barreira', EV.laR, 'rem', S.rem);
    else { bt(S, cx0, ry, cw, bh, 'poliploidia na planta', EV.lima, 'poli', S.path === 'poli'); bt(S, cx0, ry + bh + 6, cw, bh, 'mudança de fruta hospedeira', EV.lima, 'fruta', S.path === 'fruta'); }
    cap(S.path ? (S.path === 'poli' ? 'Na poliploidia o erro na meiose dobra os cromossomos: a planta nova já nasce isolada, sem barreira geográfica.' : 'Sem barreira, um grupo mudou de fruta e passou a acasalar nela: o fluxo entre os grupos diminuiu.') : nenhuma ? 'Sem barreira e com fluxo gênico, as cores se misturam e não há espécie nova.' : !S.rem ? 'Ajuste o tempo e remova a barreira para ver se as populações voltam a cruzar.' : duas ? 'Mesmo sem a barreira, os dois grupos não cruzam mais: são duas espécies.' : volta ? 'Pouco tempo separados: ao remover a barreira voltam a cruzar e ainda são uma espécie.' : '');
  }
  def('especiacao', 'modos', {
    t: 'Como nasce uma espécie', s: 'separar, acumular diferenças, não cruzar mais', c: EV.agua,
    loc: S => S.modo === 'monte' ? 'Monte a especiação' : 'Especiação alopátrica', locNota: () => NOTA, still: 20,
    alt: 'um mapa com uma população de uma cor que uma cordilheira divide em duas, cada lado mudando de tom até o encontro em que os grupos não cruzam mais, ao lado de uma planta com cromossomos em dobro; e uma montagem em que se escolhe barreira, tempo e remoção da barreira para ver se aparece o carimbo duas espécies',
    extra: [mdE('alo', 'Especiação alopátrica'), mdE('monte', 'Monte a especiação', S => { S.rem = false; S.path = null; })],
    ctl: { l: 'Tempo de separação', min: 0, max: 100, step: 1, v: 50, f: v => v < 34 ? 'pouco' : v < 67 ? 'bastante' : 'muito', rate: () => 1 }, ctlVis: S => S.modo === 'monte' && S.bar !== 'nenhuma',
    init(S) { S.modo = 'alo'; S.t0 = 0; S.msg = null; S.bar = 'montanha'; S.rem = false; S.path = null; },
    d: TXT.ES1.d, enem: TXT.ES1.enem, links: [['Nomes científicos na Taxonomia', '../taxonomia/index.html#nomes/binomial'], ['Meiose e poliploidia na Divisão celular', '../divisao-celular/index.html#meiose/fases']],
    tap(x, y, S) {
      if (S.modo !== 'monte') return; const h = hid(x, y); if (!h) return; flash(S, h);
      if (h[0] === 'b') { S.bar = h.slice(1); S.path = null; S.rem = false; } else if (h === 'rem') S.rem = !S.rem; else if (h === 'poli' || h === 'fruta') { S.path = S.path === h ? null : h; S.t0 = agora(S); }
    },
    draw(t, S) { const A = area(); if (S.modo === 'monte') drawMonte(t, S, A); else drawAlo(t, S, A); }
  });

  // ---------- ES2: barreiras que impedem o cruzamento ----------
  const PORT = [['habitat', 0, 'vivem em ambientes diferentes'], ['época', 0, 'reproduzem em épocas diferentes'], ['corte', 0, 'o ritual de corte não combina'], ['encaixe', 0, 'os órgãos não se encaixam'], ['gametas', 0, 'os gametas não se reconhecem'], ['embrião', 1, 'o embrião morre cedo'], ['filho fértil', 1, 'o filho nasce estéril'], ['netos', 1, 'a geração seguinte é fraca ou estéril']];
  function drawPort(t, S, A) {
    const p = ciclo(Math.max(0, lt(S)), 14), n = PORT.length, wide = !NAR, k = Math.min(n - 1, Math.floor(p * n)), q = p >= 1 ? 1 : fr(p * n);
    const ZC = [EV.azS, EV.laR];
    if (wide) {
      const w = A.w / n, y = A.cy - 10, hh = Math.min(120, A.h * .34);
      nome('antes do zigoto', A.x0 + w * 2.5, A.y0 + 14, { s: 14, c: EV.azS }); nome('depois do zigoto', A.x0 + w * 6.5, A.y0 + 14, { s: 14, c: EV.laR });
      line(A.x0 + 6, A.y0 + 32, A.x0 + w * 5 - 6, A.y0 + 32, EV.azS, 2); line(A.x0 + w * 5 + 6, A.y0 + 32, A.x1 - 6, A.y0 + 32, EV.laR, 2);
      PORT.forEach(([nm, z], i) => { const cx = A.x0 + (i + .5) * w, c = ZC[z], fechado = p >= 1 || i < k || (i === k && q > .3), alt = i === k && p < 1 ? ss(seg(q, .1, .4)) : fechado ? 1 : 0;
        line(cx, y - hh / 2, cx, y + hh / 2, rgba(c, .5), 3); rr(cx - w * .36, y - hh / 2 + (hh - 12) * (1 - alt), w * .72, 12, 4, rgba(c, fechado ? .9 : .25), c, 1.4);
        if (i < n - 1) arrow(cx + w * .4, y + hh / 2 + 22, cx + w * .6, y + hh / 2 + 22, rgba(C.dim, .6), 1.4);
        nome(nm, cx, y + hh / 2 + 22, { s: 12, c: i === k && p < 1 ? C.txt : C.dim, w: i === k ? 700 : 400 }); if (fechado) xis(cx, y + hh / 2 + 42, 12, c); });
      const fx = A.x0 + 10 + (A.w - 20) * (p >= 1 ? 1 : (k + Math.min(q * 1.3, .5)) / n); circ(fx, y, 8, EV.ouro, '#0B0F1C', 1.5);
      if (k >= 0) nome(PORT[k][2], A.cx, A.y1 - 20, { s: 14, c: C.txt });
    } else {
      const rh = Math.min(38, (A.h - 24) / n), x0 = A.x0 + 6;
      PORT.forEach(([nm, z, ds], i) => { const y = A.y0 + 10 + i * rh, c = ZC[z], fechado = p >= 1 || i < k || (i === k && q > .3), act = i === k && p < 1;
        rr(x0, y, A.w - 12, rh - 6, 8, rgba(c, act ? .22 : .08), rgba(c, act ? 1 : .5), act ? 2 : 1.2); tx(nm, x0 + 10, y + (rh - 6) / 2, { a: 'left', s: 13, w: 700, c: C.txt, bg: false }); tx(z ? 'depois do zigoto' : 'antes do zigoto', A.x1 - 10, y + (rh - 6) / 2, { a: 'right', s: 12, c, bg: false }); if (fechado) xis(x0 + 108, y + (rh - 6) / 2, 12, c); });
    }
    cap(p >= 1 ? 'Todos os portões fechados: sem filhos férteis e netos, os genes não passam e as espécies continuam separadas.' : p < 5 / 8 ? `Antes do zigoto: ${PORT[k][2]}.` : `Depois do zigoto: ${PORT[k][2]}.`);
}
  const BI = baralho({
    nome: 'iso', dica: 'Toque num cartão e depois na caixa certa, ou arraste.',
    cartas: [['dois sapos que coaxam de um jeito diferente', 0, 'comportamental'], ['duas flores que abrem em meses diferentes', 0, 'temporal'], ['ouriços do mar cujos gametas não se reconhecem', 0, 'gamético'], ['égua cruzada com jumento: o filho é estéril', 1, 'esterilidade do híbrido'], ['um embrião que para de se desenvolver', 1, 'inviabilidade do híbrido'], ['uma flor que só encaixa em um tipo de abelha', 0, 'mecânico']].map(c => ({ t: c[0], k: c[1], t2: c[2] })),
    alvos: [{ t: 'pré-zigótico', c: EV.azS }, { t: 'pós-zigótico', c: EV.laR }],
    certo: (c) => `Certo: é ${c.k ? 'pós' : 'pré'}-zigótico, tipo ${c.t2}.`, errado: (c) => c.k ? 'Não: aqui o zigoto chega a se formar, então a barreira é depois dele.' : 'Não: aqui a barreira impede o cruzamento ou a fecundação, antes do zigoto.',
    fim: () => 'Tudo certo. Dica: canto, cor, época e encaixe são pré-zigóticos; filho estéril ou que morre é pós-zigótico.'
  });
  const bars = (x, y, n, pitch, h, c, a = 1, marca = -1) => { X.save(); X.globalAlpha *= a; for (let i = 0; i < n; i++) rr(x + i * pitch, y, Math.max(3, pitch - 3), h, 2, rgba(c, .4), i === marca ? EV.alerta : c, i === marca ? 2 : 1); X.restore(); };
  function drawMula(t, S, A) {
    const p = ciclo(Math.max(0, lt(S)), 10), cols = 32, pitch = Math.min(NAR ? 10.5 : 24, (A.w - 12) / cols), w0 = pitch * cols, x0 = A.cx - w0 / 2, h = NAR ? 26 : 34, y = A.y0 + 22, k1 = ss(seg(p, .05, .3)), k2 = ss(seg(p, .35, .6)), k3 = ss(seg(p, .65, .9));
    nome('gameta da égua: 32 cromossomos', A.x0 + 2, y - 10, { a: 'left', s: 12, c: EV.azS }); bars(x0, y, 32, pitch, h, EV.azS, k1);
    const y2 = y + h + 38; nome('gameta do jumento: 31 cromossomos', A.x0 + 2, y2 - 10, { a: 'left', s: 12, c: EV.laR }); bars(x0, y2, 31, pitch, h, EV.laR, k1);
    const y3 = y2 + h + 44; if (k2 > .02) { arrow(A.cx, y2 + h + 6, A.cx, y3 - 18, rgba(C.dim, .9), 2); nome('mula: 63 cromossomos', A.x0 + 2, y3 - 10, { a: 'left', s: 12, c: C.txt }); X.save(); X.globalAlpha *= k2; for (let i = 0; i < 32; i++) rr(x0 + i * pitch, y3, Math.max(3, pitch - 3), h, 2, rgba(EV.azS, .4), EV.azS, 1); for (let i = 0; i < 31; i++) rr(x0 + i * pitch, y3 + h + 4, Math.max(3, pitch - 3), h, 2, rgba(EV.laR, .4), EV.laR, 1); X.restore(); }
    if (k3 > .02) { X.save(); X.globalAlpha *= k3; for (let i = 0; i < 31; i++) line(x0 + i * pitch + (pitch - 3) / 2, y3 + h, x0 + i * pitch + (pitch - 3) / 2, y3 + h + 4, EV.ok, 2); rr(x0 + 31 * pitch - 2, y3 - 2, pitch + 1, h + 4, 3, null, EV.alerta, 2.4); nome('um cromossomo fica sem par', x0 + w0, y3 + 2 * h + 22, { a: 'right', s: 12, c: EV.alerta }); X.restore(); }
    nome('63 cromossomos, pares que não fecham', A.cx, A.y1 - 8, { s: fsz() + 1, c: C.txt });
    cap(p < .35 ? 'O cavalo tem 64 cromossomos e o jumento 62: cada gameta leva a metade.' : p < .65 ? 'A mula recebe 32 de um lado e 31 do outro: 63 cromossomos.' : 'Na meiose os cromossomos não formam pares certos, o gameta sai desequilibrado e a mula é quase sempre estéril.');
  }
  function drawCartas(t, S, A) { BI.draw(S, { x0: A.x0, y0: A.y0, x1: A.x1, y1: A.y1 }, { cols: NAR ? 2 : 3, cartaH: NAR ? 46 : 46, slotH: NAR ? 34 : 36 }); cap(BI.msg(S) || 'Arraste (ou toque no cartão e depois na caixa): a barreira age antes ou depois do zigoto?'); }
  def('especiacao', 'isolamento', {
    t: 'Barreiras que impedem o cruzamento', s: 'antes do zigoto ou depois dele', c: EV.agua,
    loc: S => ({ por: 'Portões do isolamento', car: 'Qual barreira é esta?', mul: 'O caso da mula' })[S.modo], locNota: () => NOTA, still: 20,
    alt: 'uma linha com oito portões que se fecham em sequência, cinco azuis antes do zigoto e três laranjas depois dele; cartões de situações para arrastar até pré-zigótico ou pós-zigótico; e os cromossomos do cavalo e do jumento que formam os sessenta e três da mula, com um cromossomo sem par',
    extra: [mdE('por', 'Os portões'), mdE('car', 'Qual barreira é esta?', S => BI.zera(S)), mdE('mul', 'O caso da mula')], ctlVis: S => S.modo !== 'car',
    init(S) { S.modo = 'por'; S.t0 = 0; S.msg = null; BI.zera(S); },
    d: TXT.ES2.d, enem: TXT.ES2.enem, links: [['Meiose e pareamento na Divisão celular', '../divisao-celular/index.html#meiose/fases'], ['Polinização e corte em Plantas e animais', '../plantas-animais/index.html']],
    tap(x, y, S) { if (S.modo === 'car') BI.tap(x, y, S); },
    grab: (x, y, S) => S.modo === 'car' && BI.grab(x, y, S), grabMove: (x, y, S) => BI.grabMove(x, y, S), grabEnd: (x, y, S) => BI.grabEnd(x, y, S),
    draw(t, S) { const A = area(); if (S.modo === 'car') drawCartas(t, S, A); else if (S.modo === 'mul') drawMula(t, S, A); else drawPort(t, S, A); }
  });
  // ---------- P1: irradiação adaptativa e convergência ----------
  const BICOS = [['sementes duras', 7, 11, 0, 'semente'], ['sementes pequenas', 3.2, 10, 0, 'semente'], ['insetos', 2.4, 17, 0, 'inseto'], ['cacto', 3.6, 18, 3, 'cacto'], ['folhas e brotos', 4.6, 12, 1, 'folha']];
  function ramo(x1, y1, x2, y2, f, c, lw) { const P = []; for (let i = 0; i <= 18; i++) { const t = i / 18 * f, u = 1 - t; P.push([u * u * x1 + 2 * u * t * x1 + t * t * x2, u * u * y1 + 2 * u * t * (y2 + (y1 - y2) * .45) + t * t * y2]); } poly(P, c, lw); return P[P.length - 1]; }
  function comida(tp, x, y, r, a) {
    X.save(); X.globalAlpha *= a;
    if (tp === 'semente') ell(x, y, r * .7, r * .5, .4, EV.solo, 'rgba(11,15,28,.6)', 1); else if (tp === 'inseto') { ell(x, y, r * .7, r * .4, 0, EV.laR, 'rgba(11,15,28,.6)', 1); line(x - r * .4, y - r * .6, x - r * .8, y - r, EV.laR, 1.2); line(x + r * .4, y - r * .6, x + r * .8, y - r, EV.laR, 1.2); } else if (tp === 'cacto') { rr(x - r * .4, y - r, r * .8, r * 2, r * .4, rgba(EV.verde, .5), EV.verde, 1.4); line(x, y - r * .3, x + r * .8, y - r * .8, EV.verde, 1.4); } else { ell(x, y, r * .8, r * .45, -.5, rgba(EV.verde, .6), EV.verde, 1.2); }
    X.restore();
  }
  function tentilhao(x, y, r, b, a) { // cabeça de ave com bico b = [nome, espessura, comprimento, curvatura]
    X.save(); X.globalAlpha *= a; const L = b[2] * r / 12, T = b[1] * r / 12, cv = b[3] * r / 12; circ(x, y, r, rgba(EV.lima, .22), EV.lima, 1.8); circ(x - r * .1, y - r * .22, 2.2, '#0B0F1C'); shape([[x + r * .85, y - T / 2], [x + r * .85 + L, y + cv], [x + r * .85, y + T / 2]], rgba(EV.ouro, .55), EV.ouro, 1.6); X.restore();
  }
  function drawIrra(t, S, A) {
    const p = ciclo(Math.max(0, lt(S)), 12), r = NAR ? 11 : 15, rx = A.cx, ry = A.y1 - 22, ty = A.y0 + 46 + r, n = 5;
    nome('ancestral que chegou do continente', rx, ry + 14, { s: 12, c: C.txt }); circ(rx, ry, 7, EV.ouro, '#0B0F1C', 1.5);
    BICOS.forEach((b, i) => { const tx0 = A.x0 + (i + .5) * A.w / n, f = ss(seg(p, .08 + i * .08, .5 + i * .06)), a = ss(seg(p, .4 + i * .06, .6 + i * .06)); ramo(rx, ry, tx0 - ((i - 2) * 2), ty + r + 6, f, rgba(EV.lima, .85), 2.4); if (a > .02) { tentilhao(tx0 - 6, ty, r, b, a); comida(b[4], tx0 + (NAR ? 2 : 10), ty - r - 16, NAR ? 8 : 10, a); X.save(); X.globalAlpha *= a; wrapTx(b[0], tx0, ty - r - (NAR ? 40 : 48), A.w / n - 4, { s: 12, lh: 13, c: C.txt }); X.restore(); } });
    nome('em pouco tempo geológico, muitas espécies com bicos diferentes', A.cx, A.y0 + 8, { s: fsz(), c: C.txt });
    cap(p < .5 ? 'Um ancestral chega a Galápagos e encontra oportunidades vazias: sementes, insetos, cactos.' : 'Cada ramo vira uma espécie com o bico adequado ao alimento: irradiação adaptativa. Os bicos são estruturas homólogas.');
  }
  const FORMA = { // comprimento do focinho, altura da dorsal, tamanho da cauda, espessura do corpo
    tubarao: { sl: .1, dh: .35, tl: .3, ry: .13, c: EV.cinza, n: 'tubarão', g: 'peixe' },
    ictio: { sl: .3, dh: .2, tl: .26, ry: .1, c: EV.ocre, n: 'ictiossauro, extinto', g: 'réptil' },
    golf: { sl: .2, dh: .22, tl: .24, ry: .15, c: EV.azS, n: 'golfinho', g: 'mamífero' }
  };
  const COMUM = { sl: .19, dh: .25, tl: .26, ry: .13 };
  function fusi(x, y, s, F, k) {
    const sl = lerp(F.sl, COMUM.sl, k), dh = lerp(F.dh, COMUM.dh, k), tl = lerp(F.tl, COMUM.tl, k), ry = lerp(F.ry, COMUM.ry, k), c = F.c;
    shape([[x + s * (.5 + sl), y], [x + s * .3, y - ry * s * .9], [x, y - ry * s], [x - s * .3, y - ry * s * .8], [x - s * .5, y - ry * s * .25], [x - s * (.62 + tl * .3), y - s * tl * .5], [x - s * .55, y], [x - s * (.62 + tl * .3), y + s * tl * .5], [x - s * .5, y + ry * s * .25], [x - s * .3, y + ry * s * .8], [x, y + ry * s], [x + s * .3, y + ry * s * .9]], rgba(c, .25), c, 2);
    shape([[x - s * .02, y - ry * s], [x - s * .22, y - (ry + dh) * s], [x - s * .26, y - ry * s * .85]], rgba(c, .4), c, 1.6); shape([[x + s * .16, y + ry * s * .85], [x + s * .02, y + (ry + .14) * s], [x - s * .06, y + ry * s * .9]], rgba(c, .4), c, 1.6); circ(x + s * .36, y - ry * s * .25, 2.2, '#0B0F1C');
  }
  function drawConv(t, S, A) {
    const p = ciclo(Math.max(0, lt(S)), 12), k = ss(seg(p, .35, .85)), s = Math.min(NAR ? 78 : 120, A.w / 3 - 34), ks = Object.keys(FORMA), wide = !NAR, ay = A.y0 + 40 + s * .3;
    nome('mesmo ambiente: água aberta', A.cx, A.y0 + 8, { s: fsz(), c: C.txt });
    const px = i => A.x0 + (i + .5) * A.w / 3, ty = A.y1 - 18, gy = ty - (wide ? 100 : 74);
    ks.forEach((kk, i) => { const F = FORMA[kk]; fusi(px(i) - 8, ay, s, F, k); nome(F.n, px(i), ay + s * .38, { s: 12, c: C.txt }); });
    // árvore: tubarão se separa cedo; ictiossauro e golfinho depois, em ramos afastados
    const rx = A.cx, ry = ty, n1 = [px(1), gy + 26], c = EV.lima;
    line(rx, ry, px(0), gy, rgba(c, .85), 2.2); line(rx, ry, n1[0], n1[1], rgba(c, .85), 2.2); line(n1[0], n1[1], px(1), gy, rgba(c, .85), 2.2); line(n1[0], n1[1], px(2), gy, rgba(c, .85), 2.2); circ(rx, ry, 5, EV.ouro);
    [0, 1, 2].forEach(i => { circ(px(i), gy, 4, FORMA[ks[i]].c); nome(FORMA[ks[i]].g, px(i), gy - 12, { s: 12 }); });
    nome('ancestral comum distante', rx, ry + 12, { s: 12 });
    cap(p < .35 ? 'Três grupos sem parentesco próximo: um peixe, um réptil e um mamífero, em ramos afastados da árvore da vida.' : p < .85 ? 'Vivendo em água aberta, sofrem seleção parecida e os corpos vão ficando parecidos.' : 'Convergência evolutiva: estruturas análogas, mesma função, origens diferentes. Semelhança de forma não prova parentesco.');
  }
  const BP = baralho({
    nome: 'par', dica: 'Toque num par e depois na caixa certa, ou arraste.',
    cartas: [['braço humano e nadadeira de baleia', 0, 'Certo: homólogas. São os mesmos ossos do membro com funções diferentes, herdados de um ancestral comum.'], ['asa de inseto e asa de ave', 1, 'Certo: análogas. Mesma função, origem diferente.'], ['ossos da asa de ave e do braço do morcego', 0, 'Certo: os ossos são homólogos. Já a asa como superfície de voo é análoga nos dois lados.'], ['espinho de cacto e de euforbiácea', 1, 'Certo: análogas. Plantas de continentes diferentes, ambiente seco parecido.']].map(c => ({ t: c[0], k: c[1], r: c[2] })),
    alvos: [{ t: 'mesma origem (homóloga)', c: EV.lima }, { t: 'mesma função, origem diferente (análoga)', c: EV.laR }],
    certo: c => c.r, errado: c => c.k ? 'Não: aqui a origem é diferente, só a função se parece. É analogia.' : 'Não: aqui a origem é a mesma, mesmo com funções diferentes. É homologia.',
    fim: () => 'Tudo certo. Homologia aponta parentesco; analogia aponta ambiente parecido.'
  });
  function drawPar(t, S, A) {
    const wide = !NAR, bx = { x0: A.x0, y0: A.y0, x1: wide ? A.x0 + A.w * .66 : A.x1, y1: A.y1 };
    BP.draw(S, bx, { cols: 2, cartaH: NAR ? 48 : 52, slotH: NAR ? 36 : 40 });
    if (wide) { const x = A.x0 + A.w * .66 + 24, w = A.x1 - x, y = A.y0 + 6; panel(x, y, w, 190); nome('mesmos ossos, funções diferentes', x + w / 2, y + 16, { s: 12, c: C.txt }); [['humano', 'braço'], ['baleia', 'nadadeira'], ['morcego', 'asa']].forEach(([b, n], i) => { const cx = x + w * (.2 + i * .3), on = BP.feito(S); bicho(b, cx, y + 80, Math.min(58, w * .26), { c: on ? EV.lima : C.dim }); nome(n, cx, y + 130, { s: 12, c: on ? EV.lima : C.dim }); }); nome(BP.feito(S) ? 'o mesmo conjunto de ossos: homologia' : 'resolva os pares para acender', x + w / 2, y + 166, { s: 12 }); }
    cap(BP.msg(S) || 'Arraste (ou toque no par e depois na caixa): mesma origem ou só mesma função?');
  }
  def('padroes', 'irradiacao', {
    t: 'Irradiação adaptativa e convergência', s: 'de um ancestral, muitas formas; de ancestrais diferentes, formas parecidas', c: EV.lima,
    loc: S => ({ irra: 'Irradiação dos tentilhões', conv: 'Convergência', par: 'Parente ou parecido?' })[S.modo], locNota: () => NOTA, still: 20,
    alt: 'uma árvore em leque a partir de um tentilhão ancestral com cinco bicos diferentes e seus alimentos; três silhuetas de tubarão, ictiossauro e golfinho em ramos afastados da árvore da vida que ficam quase iguais; e pares de estruturas para classificar como homólogas ou análogas',
    extra: [mdE('irra', 'Irradiação'), mdE('conv', 'Convergência'), mdE('par', 'Parente ou parecido?', S => BP.zera(S))], ctlVis: S => S.modo !== 'par',
    init(S) { S.modo = 'irra'; S.t0 = 0; S.msg = null; BP.zera(S); },
    d: TXT.P1.d, enem: TXT.P1.enem, links: [['Homologia na Taxonomia', '../taxonomia/index.html#cladistica/homologia'], ['Cladograma na Taxonomia', '../taxonomia/index.html#cladistica/cladograma'], ['Mamíferos, aves e cactos em Plantas e animais', '../plantas-animais/index.html'], ['Órgãos homólogos e análogos', '#evidencias/comparacao'], ['Fósseis', '#evidencias/fosseis']],
    tap(x, y, S) { if (S.modo === 'par') BP.tap(x, y, S); },
    grab: (x, y, S) => S.modo === 'par' && BP.grab(x, y, S), grabMove: (x, y, S) => BP.grabMove(x, y, S), grabEnd: (x, y, S) => BP.grabEnd(x, y, S),
    draw(t, S) { const A = area(); if (S.modo === 'par') drawPar(t, S, A); else if (S.modo === 'conv') drawConv(t, S, A); else drawIrra(t, S, A); }
  });

  // ---------- H1: a nossa árvore ----------
  const FAT = {
    chimp: 'Chimpanzés e bonobos são parentes vivos, não ancestrais: a linhagem se separou da nossa há cerca de 6 a 7 milhões de anos.',
    aus: 'Os australopitecos, como Lucy (cerca de 3 milhões de anos), já andavam em duas pernas, com cérebro pequeno.',
    erec: '<i>Homo erectus</i>, há cerca de 2 milhões de anos, foi o primeiro a sair da África, até onde se sabe.',
    nean: 'Os neandertais viveram na Europa e na Ásia e desapareceram há cerca de 40 mil anos. Pessoas de origem não africana têm cerca de 2% de DNA neandertal.',
    deni: 'Os denisovanos viveram na Ásia e também cruzaram com o <i>Homo sapiens</i>.',
    sap: 'O <i>Homo sapiens</i> surgiu na África há cerca de 300 mil anos e hoje é a única espécie humana.'
  };
  // arestas: [de(Ma, x), para(Ma, x), cor, tipo (tip=ponta viva, ext=extinta), id, rótulo]
  const HC = EV.cinza, HO = EV.ocre, HA = EV.agua;
  const ARE = [
    [[7, .5], [0, .06], HC, 'tip', 'chimp', 'chimpanzés e bonobos'],
    [[7, .5], [6, .56], HO], [[6, .56], [4.2, .5], HO],
    [[4.2, .5], [2.9, .3], HO, 'ext', 'aus', 'australopitecos'], [[4.2, .5], [1.2, .18], HO, 'ext', 'aus', ''],
    [[4.2, .5], [2.4, .62], HA],
    [[2.4, .62], [.1, .46], HA, 'ext', 'erec', '<i>Homo erectus</i>'], [[2.4, .62], [.6, .66], HA],
    [[.6, .66], [.05, .9], HA, 'ext', 'nean', 'neandertais'], [[.6, .66], [.06, .98], HA, 'ext', 'deni', 'denisovanos'],
    [[.6, .66], [0, .68], EV.ouro, 'sap', 'sap', '<i>Homo sapiens</i>']
  ];
  function cranio(x, y, vol, c, prog, a) {
    const rb = 24 * Math.cbrt(vol / 1350), j = prog; X.save(); X.globalAlpha *= a; ell(x - 2, y, rb * 1.15, rb, 0, rgba(c, .22), c, 1.8); shape([[x + rb * .5, y + rb * .1], [x + rb * (.95 + j), y + rb * .35], [x + rb * (.95 + j), y + rb * .95], [x + rb * .1, y + rb * .95]], rgba(c, .22), c, 1.8); circ(x + rb * .5, y + rb * .2, 2.4, '#0B0F1C'); X.restore();
  }
  function drawArv(t, S, A) {
    const p = ciclo(Math.max(0, lt(S)), 12), T = 7 * p, wide = !NAR, tw = wide ? A.w * .62 : A.w - 4, tx0 = A.x0 + 6, th = wide ? A.h - 40 : A.h - 132, ty0 = A.y0 + 38, X0 = x => tx0 + 40 + (tw - 52) * x, Y0 = m => ty0 + (m / 7) * (th);
    line(tx0 - 2, ty0, tx0 - 2, ty0 + th, rgba(C.dim, .4), 1); [0, 2, 4, 6].forEach(m => { line(tx0 - 6, Y0(m), tx0 + 2, Y0(m), C.dim, 1); nome(m === 0 ? 'hoje' : `${m} mi`, tx0 + 6, Y0(m) + (m === 0 ? 9 : 0), { a: 'left', s: 12 }); });
    nome('mi = milhões de anos', tx0 - 2, ty0 - 16, { a: 'left', s: 12 });
    const lt0 = [];
    ARE.forEach(([a, b, c, tp, id, rot]) => {
      const es = 7 - a[0], ee = 7 - b[0], f = cl((T - es) / (ee - es), 0, 1); if (f <= 0) return;
      const x1 = X0(a[1]), y1 = Y0(a[0]), x2 = x1 + (X0(b[1]) - x1) * f, y2 = y1 + (Y0(b[0]) - y1) * f; line(x1, y1, x2, y2, c, tp === 'sap' ? 3.4 : 2.6);
      if (f >= 1 && tp) { const ex = X0(b[1]), ey = Y0(b[0]); if (tp === 'ext') line(ex - 6, ey + 4, ex + 6, ey - 4, c, 2.4); if (tp === 'sap') { circ(ex, ey, 9, rgba(EV.ouro, .25), EV.ouro, 2.4); } else circ(ex, ey, tp === 'tip' ? 4 : 0.1, c); lt0.push([ex, ey, id, rot, tp, c]); hitC(ex, ey, 18, 'sp:' + id); }
    });
    lt0.forEach(([ex, ey, id, rot, tp, c], i) => { if (!rot) return; const fz = NAR ? 12 : 13, lr = id === 'chimp' ? 'r' : id === 'sap' ? 'c' : id === 'deni' ? 'l' : id === 'nean' ? 'l' : 'c', off = { chimp: [8, 0], sap: [0, -16], erec: [-4, 18], nean: [-4, 18], deni: [0, 34], aus: [10, -2] }[id] || [0, 14];
      if (id === 'chimp') mtx(rot, ex + 10, ey, { a: 'left', s: fz, c: C.txt }); else if (id === 'aus') mtx(rot, ex + 10, ey - 4, { a: 'left', s: fz, c: HO }); else mtx(rot, ex + (id === 'deni' || id === 'nean' ? -2 : 0), ey + off[1], { a: id === 'deni' ? 'right' : id === 'nean' ? 'right' : 'center', s: fz, c: id === 'sap' ? EV.ouro : HA, w: id === 'sap' ? 700 : 400 }); void i; void tp; void c; void lr; });
    if (T > 6.5) nome('ancestral comum', X0(.5), Y0(7) + 12, { s: 12, c: C.txt });
    if (T > 3) { const lx = X0(.5), ly = Y0(3.2); circ(lx - 60, ly, 3, HO); }
    // crânios
    const crs = [['australopiteco', 450, HO, .4, 'cerca de 450 cm³'], ['<i>Homo erectus</i>', 900, HA, .2, 'cerca de 900 cm³'], ['<i>Homo sapiens</i>', 1350, EV.ouro, 0, 'cerca de 1.350 cm³']];
    const ka = ss(seg(p, .5, .9)), px = wide ? A.x0 + tw + 16 : A.x0, pw = wide ? A.x1 - px : A.w, py = wide ? A.y0 + 36 : A.y1 - 70;
    crs.forEach(([n, v, c, j, lb], i) => { const cx = wide ? px + pw / 2 : px + (i + .5) * pw / 3, cy = wide ? py + 40 + i * 104 : py + 22; cranio(cx, cy, v, c, j, ka); X.save(); X.globalAlpha *= ka; mtx(n, cx, cy + (wide ? 38 : 34), { s: 12, c: C.txt }); nome(lb, cx, cy + (wide ? 54 : 48), { s: 12 }); X.restore(); });
    if (wide) nome('o cérebro cresce; andar ereto veio antes', px + pw / 2, py + 330 > A.y1 ? A.y1 - 4 : py + 330, { s: 12, c: C.txt });
    cap(S.msg || (p < .3 ? 'Há cerca de 7 milhões de anos, um ancestral comum: daí saem a linhagem dos chimpanzés e a nossa.' : p < .75 ? 'Nossa linhagem se ramifica: australopitecos e o gênero Homo, várias espécies ao mesmo tempo.' : 'Só um galho chega vivo ao presente: Homo sapiens. Toque numa ponta para saber mais.'));
  }
  const CONT = [
    [[.46, .30], [.48, .20], [.55, .15], [.66, .14], [.80, .18], [.88, .25], [.84, .34], [.78, .38], [.72, .46], [.68, .40], [.62, .38], [.58, .34], [.52, .33]],
    [[.46, .40], [.52, .36], [.57, .40], [.58, .48], [.56, .58], [.52, .70], [.48, .66], [.46, .55], [.43, .46]],
    [[.12, .18], [.22, .14], [.30, .22], [.28, .34], [.22, .40], [.18, .34]], [[.24, .44], [.32, .46], [.34, .58], [.30, .72], [.26, .78], [.24, .62]],
    [[.76, .62], [.86, .60], [.90, .68], [.82, .74], [.76, .70]]
  ];
  const WP = [[300, .52, .50], [260, .50, .44], [220, .54, .56], [170, .50, .62], [130, .53, .42], [100, .56, .38], [60, .60, .36], [55, .68, .42], [50, .80, .64], [45, .54, .28], [40, .74, .30], [25, .80, .20], [16, .20, .20], [14, .26, .30], [12, .30, .52], [10, .28, .66]];
  function drawMapa(t, S, A) {
    const ka = Math.round(300 - S.v), wide = !NAR, mw = A.w, mh = Math.min(A.h - (NAR ? 96 : 56), mw * .52), mx = A.x0, my = A.y0 + 6, Px = x => mx + x * mw, Py = y => my + y * mh;
    rr(mx, my, mw, mh, 12, rgba(EV.azS, .07), rgba(C.line, .6), 1.2); CONT.forEach(c => shape(c.map(q => [Px(q[0]), Py(q[1])]), rgba(EV.solo, .22), rgba(EV.solo, .7), 1.4));
    if (S.nean && ka >= 40) { ell(Px(.55), Py(.27), mw * .09, mh * .1, 0, rgba(EV.violeta, .2), EV.violeta, 1.6); nome('neandertais', Px(.55), Py(.27) - mh * .1 - 8, { s: 12, c: EV.violeta }); }
    if (S.deni && ka >= 30) { ell(Px(.72), Py(.34), mw * .08, mh * .1, 0, rgba(EV.laR, .2), EV.laR, 1.6); nome('denisovanos', Px(.74), Py(.34) + mh * .1 + 12, { s: 12, c: EV.laR }); }
    if (ka <= 60) { arrow(Px(.55), Py(.38), Px(.6), Py(.33), EV.ocre, 2.2); nome('saída da África', Px(.6), Py(.33) - 10, { s: 12, c: EV.ocre }); }
    WP.forEach(([k0, x, y]) => { if (k0 >= ka) { const novo = k0 - ka < 25; if (novo) circ(Px(x), Py(y), 9, rgba(EV.ouro, .25)); circ(Px(x), Py(y), 4.5, EV.ocre, '#0B0F1C', 1.2); } });
    if (ka <= 60 && ((S.nean && ka >= 40) || (S.deni && ka >= 30))) { const gx = S.nean && ka >= 40 ? Px(.58) : Px(.73), gy = S.nean && ka >= 40 ? Py(.30) : Py(.36); circ(gx, gy, 10 + 2 * Math.sin(S.ph * 3), null, EV.ouro, 2); nome('troca de genes', gx, gy + 20, { s: 12, c: EV.ouro }); }
    const lbl = ka <= 0 ? 'hoje' : `há cerca de ${ka} mil anos`; nome(lbl, mx + 10, my + mh - 12, { a: 'left', s: fsz() + 1, c: C.txt });
    const by = my + mh + 8, bw = (A.w - 8) / 2; bt(S, mx, by, bw, 34, `neandertais: ${S.nean ? 'visíveis' : 'ocultos'}`, EV.violeta, 'nea', S.nean); bt(S, mx + bw + 8, by, bw, 34, `denisovanos: ${S.deni ? 'visíveis' : 'ocultos'}`, EV.laR, 'den', S.deni);
    cap(ka > 280 ? 'Há cerca de 300 mil anos o Homo sapiens surge na África. Mova a régua para ver o povoamento.' : ka > 60 ? 'A espécie se espalha pela África.' : ka > 20 ? 'Há cerca de 60 mil anos, grupos saem da África e chegam à Ásia, à Austrália e à Europa. Fora da África encontram neandertais e denisovanos e cruzam com eles.' : 'A América é a última a ser ocupada, há pelo menos cerca de 15 mil anos.');
  }
  function drawFila(t, S, A) {
    const p = ciclo(Math.max(0, lt(S)), 9), a1 = 1 - ss(seg(p, .55, .7)), x = A.x0 + 8, w = A.w - 16, ic = Math.min(66, w / 5), yy = A.y0 + A.h * .26;
    nome('a ideia errada: uma fila', A.cx, A.y0 + 10, { s: fsz() + 1, c: EV.alerta });
    X.save(); X.globalAlpha *= a1; const sl = [i => bicho('chimpanze', i, yy, ic, { c: C.dim }), i => silhueta(i, yy + 6, ic * .85, C.dim), i => silhueta(i, yy + 4, ic * .95, C.dim), i => bicho('humano', i, yy, ic, { c: C.dim })];
    sl.forEach((f, i) => { const cx = x + (i + .5) * w / 4; f(cx); if (i < 3) arrow(cx + ic * .6, yy, cx + w / 4 - ic * .6, yy, rgba(C.dim, .8), 2); });
    X.restore(); const k = ss(seg(p, .3, .5)); if (k > 0) { X.save(); X.globalAlpha *= a1; line(x + 6, yy - ic * .8, x + 6 + (w - 12) * k, yy + ic * .8, EV.alerta, 5); line(x + 6, yy + ic * .8, x + 6 + (w - 12) * k, yy - ic * .8, EV.alerta, 5); X.restore(); }
    const b = ss(seg(p, .6, .9)); if (b > 0) {
      X.save(); X.globalAlpha *= b; const ry = A.y1 - 26, ty = A.y0 + A.h * .46, lx = A.cx - w * .22, rx = A.cx + w * .22;
      nome('a ideia certa: uma árvore', A.cx, A.y0 + 10, { s: fsz() + 1, c: EV.verde }); line(A.cx, ry, A.cx, ry - 50, EV.ouro, 3); line(A.cx, ry - 50, lx, ty + ic * .5, HC, 3); line(A.cx, ry - 50, rx, ty + ic * .5, HO, 3);
      circ(A.cx, ry - 50, 6, EV.ouro); mtx('ancestral comum, há cerca de 6 a 7 milhões de anos', A.cx, ry + 2, { s: 12, c: C.txt }); bicho('chimpanze', lx, ty, ic, { c: HC }); bicho('humano', rx, ty, ic, { c: EV.ouro }); nome('chimpanzés atuais', lx, ty + ic * .8, { s: 12, c: C.txt }); nome('humanos atuais', rx, ty + ic * .8, { s: 12, c: C.txt }); X.restore();
    }
    cap(p < .5 ? 'A imagem da fila de macaco virando homem passa a ideia de que descendemos dos chimpanzés atuais.' : 'Os dois grupos têm um ancestral comum. Cada linhagem evoluiu por conta própria desde então.');
  }
  def('humana', 'origem', {
    t: 'A nossa árvore', s: 'um ancestral comum com os chimpanzés e uma origem africana', c: EV.ocre,
    loc: S => ({ arv: 'Árvore dos hominíneos', mapa: 'Saindo da África', fila: 'O erro da fila' })[S.modo], locNota: () => NOTA, still: 20, stillV: 300,
    alt: 'uma árvore que cresce de baixo para cima sobre uma linha de milhões de anos, com um ramo para chimpanzés e bonobos e outro para os hominíneos, várias pontas cortadas de espécies extintas e só um galho chegando vivo ao presente, com crânios cada vez maiores; um mapa-múndi com uma régua de tempo que mostra o povoamento a partir da África; e a imagem da fila de macaco riscada e trocada pela árvore certa',
    extra: [mdE('arv', 'A árvore'), mdE('mapa', 'Saindo da África', S => { S.v = S.paused ? 300 : 0; S.touch = 0; }), mdE('fila', 'O erro da fila')],
    ctl: { l: 'Tempo', min: 0, max: 300, step: 5, v: 0, f: v => v >= 300 ? 'hoje' : `há cerca de ${300 - v} mil anos`, rate: () => 1 }, ctlVis: S => S.modo === 'mapa', auto: S => S.modo === 'mapa' ? 22 : 0,
    init(S) { S.modo = 'arv'; S.t0 = 0; S.msg = null; S.nean = true; S.deni = true; },
    d: TXT.H1.d, enem: TXT.H1.enem, links: [['Cladograma na Taxonomia', '../taxonomia/index.html#cladistica/cladograma'], ['Grupos na Taxonomia', '../taxonomia/index.html#cladistica/grupos'], ['Primatas em Plantas e animais', '../plantas-animais/index.html'], ['DNA comparado', '#evidencias/comparacao']],
    tap(x, y, S) {
      const h = hid(x, y); if (!h) return; flash(S, h);
      if (h.startsWith('sp:')) S.msg = FAT[h.slice(3)]; else if (h === 'nea') S.nean = !S.nean; else if (h === 'den') S.deni = !S.deni;
    },
    draw(t, S) { const A = area(); if (S.modo === 'mapa') drawMapa(t, S, A); else if (S.modo === 'fila') drawFila(t, S, A); else drawArv(t, S, A); }
  });
}
