/* Módulo 1, tópico 6: Roma antiga. Roteiro revisado: docs/revisao-historia/m01-t06-roma.md
   Formato dos dados: docs/historia/MOTOR.md. O mapa usa pixels da própria base (historia-mapa-mediterraneo, 1376 x 768),
   lidos sobre a costa desenhada, porque a base é uma pintura e a conversão por longitude e latitude erra até cerca de 13 px.
   Toda região é recortada pela costa (terra:true); os polígonos podem passar sobre o mar.
   A peça do mapa tem escala 3 na mesa (4128 x 2304). Mb() leva pixel da base para pixel da mesa.
   Mesa em zonas: loba e lenda (esquerda do mapa), mapa (topo), fita do tempo com as três faixas (embaixo do mapa),
   Coliseu e fonte (direita do mapa), e a fileira de baixo: sociedade (1), República (2), crise (3), triúnviros (4), colonato e queda (5), legado (6). */
(function(){
const A=n=>Colagem.reduz?0:n;                      // atrasos só com movimento
const BASE='historia-mapa-mediterraneo',S=3,MX=1000,MY=0;
const Mb=(x,y)=>[Math.round(MX+x*S),Math.round(MY+y*S)];
const FB=(cx,cy,w,asp)=>{const h=w/(asp||1.3),a=Mb(cx-w/2,cy-h/2);return [a[0],a[1],Math.round(w*S),Math.round(h*S)];};   // enquadra no mapa (desktop)
const FM=(cx,cy,w)=>FB(cx,cy,w,.68);                                                                                        // enquadra no mapa (celular)
const TLM=(x)=>[1000+x,2310,560,440];
const TL=(x,w)=>[1000+x,2230,w,440];                // enquadra um trecho da fita do tempo e das faixas
// ---- pontos (pixels da base)
const ROMA=[487,231],CAPUA=[513,249],CARTAGO=[438,352],MILAO=[436,124],RAVENA=[474,154],CPLA=[790,244],VESUVIO=[517,258];
const LACIO=[[474,222],[505,214],[520,232],[522,254],[508,262],[484,244]];
const ITALIA=[[428,160],[430,122],[470,114],[488,128],[489,160],[506,190],[526,214],[551,234],[573,258],[593,272],[601,286],[601,336],[548,334],[541,328],[520,312],[428,268]];
const SICILIA=[[460,316],[524,318],[530,336],[550,340],[550,364],[460,364]];
const SARCOR=[[388,190],[426,190],[426,305],[388,305]];
const HISPANIA=[[52,140],[205,146],[262,170],[300,196],[300,262],[262,320],[218,346],[165,356],[110,350],[52,345]];
const GALIA_NARB=[[262,150],[290,112],[345,100],[395,108],[412,140],[395,170],[345,184],[305,192],[266,168]];
const GALIA=[[195,40],[330,26],[400,40],[428,86],[428,122],[395,108],[345,100],[290,112],[256,150],[205,160],[195,140]];
const AFRICA=[[408,340],[448,338],[470,380],[520,420],[570,432],[570,465],[380,465],[380,340]];
const CARTAGO_P=[[426,342],[452,338],[458,364],[430,368]];
const MACED=[[598,205],[765,205],[765,262],[700,262],[690,270],[660,276],[598,276]];
const GRECIA_C=[[598,276],[660,276],[690,270],[700,262],[712,262],[712,338],[690,338],[672,327],[660,318.5],[596,318.5]];
const GRECIA_P=[[637,318.5],[660,318.5],[672,327],[690,338],[692,348],[692,380],[637,380]];
const ASIA=[[757,262],[802,246],[852,262],[862,302],[842,350],[772,362],[757,332]];
const LINHA=[[618,140],[610,185],[600,228],[604,300],[604,400],[600,510]];
const OESTE=[[195,38],[330,28],[395,30],[408,60],[430,62],[500,60],[560,70],[598,78],[598,112],[618,140],[610,185],[600,228],[604,300],[604,400],[600,510],[560,470],[470,450],[380,440],[300,400],[220,385],[120,372],[40,362],[40,160],[100,150],[195,150]];
const LESTE=[[618,140],[650,150],[690,165],[730,172],[768,165],[775,200],[800,232],[850,236],[900,238],[1000,245],[1040,262],[1100,330],[1180,430],[1180,500],[1100,520],[990,500],[935,480],[925,560],[900,600],[880,690],[770,690],[760,560],[640,545],[600,510],[604,400],[604,300],[600,228],[610,185]];
const MESOP=[[960,300],[1010,300],[1040,360],[1100,420],[1180,490],[1100,520],[1010,470],[950,420],[950,340]];
const DACIA=[[672,100],[700,90],[745,92],[782,112],[784,182],[700,198],[640,172],[655,130]];
const LESTE_E7=[[618,140],[650,150],[690,165],[730,172],[768,165],[775,200],[800,232],[850,236],[900,238],[1000,245],[1040,262],[1100,330],[1180,430],[1180,490],[1100,420],[1040,360],[1010,300],[960,300],[950,340],[950,420],[1010,470],[1100,520],[990,500],[935,480],[925,560],[900,600],[880,690],[770,690],[760,560],[640,545],[600,510],[604,400],[604,300],[600,228],[610,185]];
const HISP206=[[205,150],[262,170],[300,196],[300,262],[262,320],[218,346],[165,356],[110,350],[100,300],[170,290],[190,230],[205,200]];
const AFR_O=[[40,336],[600,336],[600,545],[40,430]];
const AFR_L=[[600,440],[900,440],[900,560],[600,560]];

// ---- rotas (pixels da base)
const R_ESPARTACO=[[513,249],[517,258],[528,279],[538,298],[546,274],[548,250],[536,228],[516,205],[492,178],[470,158]];
const R_ESPARTACO2=[[470,158],[480,190],[494,214],[504,238],[520,266],[532,292],[537,314]];
const E_APIA=[[487,231],[513,252],[540,264],[570,266],[586,274]];
const E_GALIA=[[487,231],[470,200],[450,172],[425,155],[380,150],[330,152],[295,158],[260,172],[228,202]];
const E_NORTE=[[487,231],[480,192],[475,160],[455,140],[436,124]];
const E_EGNATIA=[[598,240],[640,250],[690,262],[740,255],[790,244]];
const E_ORIENTE=[[790,244],[850,270],[900,290],[950,310]];
const G_VANDALOS=[[395,60],[370,110],[300,170],[200,235],[125,325],[150,345],[250,354],[348,354],[430,352]];
const G_SUEVOS=[[440,60],[380,100],[290,140],[200,168],[110,180]];
const G_FRANCOS=[[410,40],[385,70],[345,100],[320,125]];
const G_VISIGODOS=[[745,110],[690,150],[600,150],[530,126],[455,128],[370,150],[290,185],[215,215],[160,260]];
const G_OSTROGODOS=[[690,95],[630,112],[560,120],[500,140],[474,154]];
const G_LOMBARDOS=[[680,118],[620,132],[540,138],[470,134],[448,130]];
// ---- fita do tempo: três faixas de papel
const TEXTO=["A Península Itálica era ocupada por vários povos: samnitas, sabinos, latinos, gregos, no sul, e ==etruscos==, no norte. Roma surgiu por volta de 1000 a.C., quando os latinos se fixaram na região do Lácio, junto ao rio Tibre. A tradição romana marcou a fundação em 753 a.C., com a lenda contada por Tito Lívio e Virgílio: ==Rômulo e Remo==, gêmeos abandonados e amamentados por uma loba; Rômulo teria fundado a cidade e sido o primeiro rei. É um mito, que dava a Roma uma origem gloriosa. Na ==Monarquia==, que durou até 509 a.C., o rei era sagrado e acumulava as funções de chefe militar, religioso e de governo, mas era controlado pelo Senado, e uma assembleia de homens em idade militar podia ratificar as decisões. A partir do século VII a.C., reis etruscos governaram Roma.", "A sociedade romana era hierarquizada pelo nascimento. No topo estavam os ==patrícios==, donos das melhores terras e do poder político, exercido pelo Senado. Os ==plebeus== eram livres, trabalhavam como camponeses, artesãos e comerciantes, mas não tinham direitos políticos. Parte deles, os clientes, dependia de um patrício, que dava proteção em troca de apoio e serviços. Na base estavam os ==escravos==, por dívida ou por guerra. A escravidão antiga era diferente da moderna: não se baseava na cor da pele, e um escravo podia ser professor, médico ou artista; o trabalho no campo era o mais desgastante. A tensão entre patrícios e plebeus pôs fim à Monarquia: em 509 a.C., os patrícios depuseram o último rei etrusco, Tarquínio, porque temiam que ele se aliasse à plebe.", "Nasceu a ==República==, de caráter oligárquico: o poder ficou com a elite patrícia. O Senado, conselho de anciãos, cuidava da administração e da política externa. Dois cônsules governavam e comandavam o exército, e outros magistrados cuidavam da justiça, das finanças, da cidade e do censo. Nas eleições dos cônsules, feitas por uma assembleia organizada pela renda, os ricos pesavam mais. Os plebeus lutavam nas guerras, mas seguiam excluídos. Revoltaram-se, e o Senado teve de ceder. Vieram os ==tribunos da plebe==, escolhidos pelos plebeus e com poder de veto até sobre o Senado, e a ==Lei das Doze Tábuas== (450 a.C.), que pôs por escrito leis antes baseadas no costume e se tornou a base do Direito romano. Depois, os plebeus conquistaram o fim da escravidão por dívidas e o direito de casar com patrícios.", "Entre os séculos V e III a.C., Roma dominou a Península Itálica e passou a disputar o Mediterrâneo. O grande rival era Cartago, cidade de origem fenícia no norte da África, com quem brigou pela Sicília e pela navegação. Nas ==Guerras Púnicas== (264 a 146 a.C.), Roma venceu e destruiu Cartago, ganhando o ==controle do Mediterrâneo==, que os romanos chamavam de mare nostrum, nosso mar. As terras conquistadas viraram províncias, que pagavam pesados impostos, e muitos prisioneiros viraram escravos. O comércio e a arrecadação cresceram e enriqueceram os ==cavaleiros==, plebeus ricos que lucravam com o comércio, os arrendamentos e a cobrança de tributos. Já os pequenos camponeses, convocados para guerras longas, deixaram as terras e empobreceram. A riqueza das conquistas aumentou a desigualdade.", "As conquistas trouxeram uma crise. Com terras tomadas e escravos baratos, a elite formou grandes latifúndios, e os camponeses arruinados migraram para Roma, onde engrossaram a plebe pobre. Revoltas de escravos e de povos dominados, corrupção, mais impostos e o poder dos generais abalaram a República. Os irmãos ==Graco==, Tibério e Caio, tribunos da plebe, propuseram uma reforma agrária e a Lei Frumentária, que vendia trigo barato aos pobres. A elite reagiu, e os dois foram assassinados, Tibério em 133 a.C. e Caio em 121 a.C. Vieram guerras civis e o poder dos generais ==Mário e Sila==: Mário reformou o exército, e Sila governou como ditador e enfraqueceu os tribunos. Em 73 a.C., o gladiador ==Espártaco== liderou a maior revolta de escravos de Roma.", "A partir de 60 a.C., três líderes dividiram o poder no Primeiro ==Triunvirato==: Pompeu, general prestigiado, Crasso, um dos homens mais ricos de Roma, e ==Júlio César==. César conquistou a Gália a partir de 58 a.C., ganhou fama e um exército fiel, derrotou Pompeu na guerra civil e virou ditador. Temendo que ele se fizesse rei, um grupo de senadores, entre eles Bruto, o assassinou em 44 a.C. Formou-se o Segundo Triunvirato, com Otávio, sobrinho-neto e herdeiro de César, Lépido e Marco Antônio. Otávio afastou Lépido e venceu Marco Antônio na batalha de Áccio, em 31 a.C. Em 27 a.C., recebeu do Senado o título de ==Augusto==, o sagrado. Começava o Império. O Senado continuou existindo, mas subordinado ao imperador.", "O ==imperador== concentrava o comando do exército, o tesouro e a política, e era visto como escolhido dos deuses. Começou a ==Pax Romana==, longo período de estabilidade interna, em que o comércio circulava por estradas e pelo Mediterrâneo. Uma grande burocracia, formada por antigos patrícios e novos proprietários, administrava o Império; o Estado criou o correio e passou a cobrar os impostos diretamente. Para manter a plebe pobre de Roma sob controle, os governantes usavam a política do ==pão e circo==: distribuição de trigo e espetáculos, como as lutas de gladiadores no Coliseu, que recebia cerca de 50 mil pessoas. Mas o exército ganhava força, a sucessão passou a depender do seu apoio e houve imperadores tirânicos, como Calígula e Nero. A expansão, retomada a partir de 96 d.C., chegou ao máximo em 117 d.C.", "A partir do século III d.C., o Império entrou em declínio. Era imenso, difícil de comunicar e de defender, e as conquistas pararam. Sem guerras, havia menos prisioneiros, os escravos ficaram caros e a produção caiu. Surgiu o ==colonato==: escravos e camponeses pobres viraram colonos, presos ao lote, que pagavam ao dono da terra em trabalho e produtos. É a raiz da servidão medieval. Os gastos com burocracia e exército cresceram, e na anarquia militar, entre 235 e 285, houve 26 imperadores. Constantino deu liberdade de culto aos cristãos, em 313, e fundou Constantinopla; Teodósio fez do cristianismo a religião oficial, em 380, e, ao morrer, em 395, deixou o Império dividido entre os filhos. Com as ==migrações germânicas==, o Ocidente caiu em ==476==, quando os hérulos depuseram o imperador Rômulo Augusto.", "Roma absorveu boa parte da cultura grega, sobretudo a religião, e identificou seus deuses com os gregos: Zeus com ==Júpiter==, Dionísio com Baco, Ares com Marte, Afrodite com Vênus. O cristianismo, perseguido por muito tempo, só foi permitido no século IV. A arquitetura era utilitária, voltada para o uso público: estradas, aquedutos que levavam água às cidades, pontes, termas e anfiteatros. A educação variava por classe e sexo, e a elite aprendia latim e grego. Na literatura, Virgílio escreveu a Eneida, Ovídio, A Arte de Amar, e Tito Lívio, uma História de Roma. O ==latim== deu origem ao português, ao espanhol e ao italiano. O ==Direito romano==, retomado nas universidades a partir do século XII, influencia as leis europeias e as brasileiras até hoje, assim como a ideia de cidadania."];
const RUBR=["Uma loba, dois irmãos e um rei", "Patrícios, plebeus, clientes e escravos", "A República e a luta da plebe", "Do Lácio ao \"nosso mar\"", "A República em crise", "De César a Augusto", "Pão, circo e legiões", "A queda do Império do Ocidente", "O que Roma deixou"];
const C0='#e3a82b',C1='#e8573a',C2='#1d5f73';

Colagem.montar({
  modulo:'Módulo 1: Pré-História e Antiguidade',
  titulo:'Roma antiga',
  subtitulo:'Da aldeia do Lácio ao império do Mediterrâneo, e sua queda',
  credito:'Figura do Coliseu: recriação gerada por IA a partir do Anfiteatro Flávio, em 80 d.C. Recortes, esquemas e mapa desenhados pelo LAB.',
  ritmo:10000,
  celularGrande:true,
  msPalavra:250,
  mesa:{w:9400,h:7000},
  enem:"Caem as ==conquistas da plebe== como luta por direitos (tribunos com veto, Doze Tábuas, fim da escravidão por dívidas), a ==Lei das Doze Tábuas== como passagem do costume para a lei escrita, a expansão ligada ao latifúndio e à escravidão, o ==pão e circo== (às vezes com o trecho de Juvenal ou comparações com o presente) e a ==crise do século III==, com o colonato como origem da servidão medieval. O legado (direito, latim, cidadania, plebiscito) aparece em comparação com o Brasil atual.\n\nPegadinhas:\n- Dizer que patrício era rico e plebeu, pobre; a diferença era de nascimento.\n- Dizer que a República romana era uma democracia; era aristocrática.\n- Dizer que Augusto acabou com o Senado; ele continuou, mas subordinado ao imperador.\n- Dizer que os bárbaros destruíram Roma de uma vez; a entrada germânica foi longa e começou pacífica.\n- Confundir 476 d.C., queda do Ocidente, com 1453, queda de Constantinopla.",
  estudo:[{"titulo": "Formação e Monarquia", "texto": "A **Península Itálica** era ocupada por samnitas, sabinos, latinos, gregos e etruscos. Roma teria surgido por volta de 1000 a.C., com os latinos fixados no **Lácio**, junto ao rio Tibre. Os romanos contavam outra história: na versão mitológica, narrada por Tito Lívio e Virgílio, os gêmeos **Rômulo e Remo** foram amamentados por uma loba, e Rômulo fundou a cidade, em 753 a.C. pela tradição, e foi o primeiro rei. A lenda não é fato, mas mostra como Roma queria ver a própria origem.\n\nA **Monarquia** foi da fundação até 509 a.C. O rei era sagrado, chefe do governo, do exército e da religião, mas controlado pelo **Senado**, conselho de anciãos patrícios. Uma assembleia de homens em idade militar podia ratificar as decisões. A partir do século VII a.C., reis etruscos governaram Roma e fizeram grandes obras, como o templo de Júpiter e os esgotos."}, {"titulo": "Uma sociedade definida pelo nascimento", "texto": "Os **patrícios** tinham as terras e o poder político, pelo Senado. Os **plebeus** eram livres, mas sem direitos políticos; parte deles, os **clientes**, vivia sob a proteção de um patrício. Na base, os **escravos**, por dívidas ou por guerra. A diferença entre patrício e plebeu era de origem, não de riqueza: havia plebeus ricos. A escravidão antiga também não se apoiava na cor da pele, e havia escravos professores, médicos e artistas; o trabalho no campo era o mais duro. Em 509 a.C., os patrícios depuseram o último rei etrusco, Tarquínio, que temiam aliado à plebe."}, {"titulo": "A República e as conquistas da plebe", "texto": "A **República** (séculos VI a I a.C.) era oligárquica. O **Senado** cuidava da administração e da política externa. Os magistrados tinham mandato: dois **cônsules** chefiavam o governo e o exército e propunham leis; o pretor cuidava da justiça; o questor, das finanças; o edil, da cidade; o censor contava a população pela renda; e o pontífice máximo chefiava a religião. Os cônsules eram eleitos por uma assembleia organizada pela renda, em que os ricos pesavam mais.\n\nAs revoltas plebeias obrigaram o Senado a ceder. Primeiro veio o **tribuno da plebe**, escolhido pelas assembleias plebeias, com poder de veto até sobre o Senado. Depois, a **Lei das Doze Tábuas** (450 a.C.) pôs por escrito leis antes consuetudinárias, isto é, baseadas no costume; com a lei escrita, os patrícios já não a interpretavam como queriam, e ela virou a base do Direito romano. Vieram ainda o fim da escravidão por dívidas e o casamento entre patrícios e plebeus."}, {"titulo": "Expansão e Guerras Púnicas", "texto": "Entre os séculos V e III a.C., Roma conquistou a península. Depois disputou com **Cartago**, cidade de origem fenícia no norte da África, a Sicília e a navegação. As **Guerras Púnicas** (264 a 146 a.C.) terminaram com a destruição de Cartago e o domínio romano do Mediterrâneo, o **mare nostrum**. Os povos conquistados pagavam pesados impostos, e muitos foram escravizados. Surgiram os **cavaleiros**, plebeus enriquecidos com comércio, arrendamentos e cobrança de tributos. Já o pequeno camponês, convocado para guerras longas, perdeu a terra para grandes proprietários que usavam escravos baratos. Roma ficou rica e muito desigual."}, {"titulo": "A crise da República", "texto": "A concentração de terras arruinou os pequenos proprietários, que migraram para Roma. Somaram-se revoltas de escravos e de povos dominados, corrupção, aumento de impostos e o poder dos generais. Os irmãos **Tibério e Caio Graco**, tribunos da plebe, tentaram uma reforma agrária, que foi insuficiente, e criaram a **Lei Frumentária**, de trigo barato para os pobres; ambos foram assassinados. Vieram guerras civis: **Mário** reformou o exército, e **Sila** governou como ditador, enfraquecendo os tribunos. Em 73 a.C., **Espártaco** liderou uma grande revolta de escravos.\n\nEm 60 a.C., Pompeu, Crasso e Júlio César formaram o **Primeiro Triunvirato**. César conquistou a Gália (a partir de 58 a.C.), se impôs aos rivais e virou ditador, mas foi assassinado em 44 a.C. por senadores, entre eles Bruto. O **Segundo Triunvirato** reuniu Otávio, Lépido e Marco Antônio. Otávio venceu os rivais em Áccio (31 a.C.) e em 27 a.C. recebeu o título de **Augusto**, o sagrado."}, {"titulo": "O Império: Pax Romana, pão e circo", "texto": "No Império, o poder se concentrou no imperador, visto como escolhido dos deuses, e o Senado ficou subordinado. Houve a **Pax Romana**, longa estabilidade interna, e uma vasta burocracia privilegiada. O imperador controlava o tesouro, criou o correio, e o Estado passou a cobrar os impostos diretamente. A política do **pão e circo** distribuía trigo e oferecia espetáculos à plebe pobre, como os do **Coliseu**, para cerca de 50 mil pessoas: era uma forma de evitar revoltas e ganhar apoio. O exército, porém, passou a decidir a sucessão, e houve imperadores tirânicos, como Calígula e Nero. A expansão foi retomada a partir de 96 d.C. e chegou ao máximo com **Trajano**, em 117 d.C."}, {"titulo": "A crise do século III e a queda do Ocidente", "texto": "A partir do século III d.C., sem novas conquistas, havia menos prisioneiros, os escravos ficaram caros, os preços subiram e a produção caiu: é a **crise do escravismo**. A saída foi o **colonato**. Escravos e camponeses viraram colonos, arrendavam um lote e pagavam ao proprietário em trabalho e produtos, numa dependência chamada patrocinium. O colono não podia ser vendido sem a terra, nem a terra sem ele. Aí estão as raízes da servidão medieval.\n\nOs gastos com burocracia e exército cresceram, e na **anarquia militar** (235 a 285 d.C.) houve 26 imperadores, 25 deles assassinados. Diocleciano perseguiu os cristãos e criou o **Édito do Máximo**, que tabelava preços e salários contra a inflação, e a tetrarquia, com o poder dividido entre quatro. Constantino deu liberdade de culto aos cristãos (**Édito de Milão**, 313) e fundou **Constantinopla**, antiga Bizâncio, atual Istambul. Teodósio fez do cristianismo a religião oficial, em 380, e, ao morrer, em 395, deixou o Império dividido entre os filhos: o Ocidente, com capital em Milão e, depois, em Ravena, e o Oriente, com capital em Constantinopla. O Império Bizantino durou até 1453, quando caiu diante dos turcos otomanos.\n\nNo Ocidente, bárbaro era quem não falava latim nem seguia a cultura romana. Os germânicos entraram primeiro como mão de obra e soldados de fronteira; depois, em migrações violentas, em busca de terras: vândalos, suevos, francos, lombardos, ostrogodos e visigodos. Em **476 d.C.**, os hérulos depuseram Rômulo Augusto. A sociedade feudal nasceria da fusão de estruturas romanas e germânicas."}, {"titulo": "Cultura e legado", "texto": "Roma absorveu a **religião grega**: Júpiter corresponde a Zeus, Baco a Dionísio, Marte a Ares e Vênus a Afrodite. A arquitetura era utilitária, com edifícios públicos, estradas e aquedutos. Na literatura, Virgílio (Eneida), Ovídio (A Arte de Amar) e Tito Lívio (História). O **latim** deu origem ao português, ao espanhol e ao italiano, e o **Direito romano**, retomado a partir do século XII, influencia os direitos europeus e o brasileiro, como a ideia de cidadania."}],
  resumo:["Roma surgiu por volta de 1000 a.C. no Lácio; Rômulo e Remo é mito de origem.", "Patrícios, plebeus, clientes e escravos: a diferença era de nascimento.", "Monarquia até 509 a.C.; República oligárquica, com Senado e magistraturas.", "Conquistas da plebe: tribunos com veto, Doze Tábuas, fim da escravidão por dívidas, casamento misto.", "Guerras Púnicas: domínio do Mediterrâneo, escravos, latifúndio e cavaleiros.", "Crise: Graco, Mário e Sila, Espártaco, triunviratos; Augusto inicia o Império.", "Império: imperador forte, Pax Romana, pão e circo, peso do exército.", "Século III: escravos caros, colonato (raiz da servidão) e anarquia militar.", "Divisão em 395, queda do Ocidente em 476 d.C., Bizâncio até 1453."],
  urca:"Não há ligação histórica direta entre a Roma antiga e o Ceará: a herança romana chega ao estado como chega a todo o Brasil, pela língua portuguesa e por um Direito de tradição romana. Para a prova, concentre-se nas cadeias de causa e consequência: conquistas, escravidão e latifúndio na crise da República; fim das conquistas, crise escravista e colonato na crise do Império; e o colonato como ponte para o feudalismo do módulo 2.",

  pecas:[
    {id:'mapa',tipo:'mapa',base:BASE,x:MX,y:MY,w:4128,h:2304,rotulo:'Mapa do Mediterrâneo: a Itália, a Península Ibérica, a Gália, o norte da África, a Grécia e o Oriente Próximo',camadas:[
      // ---- nomes dos mares, sempre à vista
      {tipo:'rotulo',p:[560,462],texto:'Mar Mediterrâneo',classe:'mar',tam:.6,desde:0},
      {tipo:'rotulo',p:[396,296],texto:'Mar Tirreno',classe:'mar',tam:.3,desde:0},
      {tipo:'rotulo',p:[604,320],texto:'Mar Jônico',classe:'mar',tam:.3,desde:0},
      {tipo:'rotulo',p:[868,196],texto:'Mar Negro',classe:'mar',tam:.5,desde:0},

      // ===== etapa 1: a Península Itálica, o Lácio e Roma
      {tipo:'regiao',terra:true,pts:LACIO,suave:false,cor:'coral',opac:.9,etapas:[0],atraso:A(6500)},
      {tipo:'cidade',p:ROMA,nome:'Roma',capital:true,lado:'e',tam:.4,etapas:[0],atraso:A(7500)},
      {tipo:'etiqueta',p:[446,184],texto:'etruscos',sub:'no norte',tam:.4,etapas:[0],atraso:A(10000)},
      {tipo:'etiqueta',p:[498,200],texto:'sabinos',tam:.4,etapas:[0],atraso:A(12000)},
      {tipo:'etiqueta',p:[497,239],texto:'latinos',sub:'no Lácio',tam:.34,cor:'amarelo',etapas:[0],atraso:A(14000)},
      {tipo:'etiqueta',p:[519,264],texto:'samnitas',tam:.4,etapas:[0],atraso:A(12600)},
      {tipo:'etiqueta',p:[522,292],texto:'gregos',sub:'no sul',tam:.4,etapas:[0],atraso:A(16000)},

      // ===== etapa 4: do Lácio ao "nosso mar"
      {tipo:'regiao',terra:true,pts:ITALIA,suave:false,cor:'coral',opac:.88,etapas:[3],atraso:A(2500)},
      {tipo:'regiao',terra:true,pts:CARTAGO_P,suave:false,cor:'#1d5f73',opac:.9,etapas:[3],atraso:A(5000),dura:A(20000)},
      {tipo:'regiao',terra:true,pts:SICILIA,suave:false,cor:'coral',opac:.88,etapas:[3],atraso:A(8200)},
      {tipo:'regiao',terra:true,pts:SARCOR,suave:false,cor:'coral',opac:.88,etapas:[3],atraso:A(10200)},
      {tipo:'regiao',terra:true,pts:HISP206,suave:false,cor:'coral',opac:.88,etapas:[3],atraso:A(13500)},
      {tipo:'regiao',terra:true,pts:GALIA_NARB,suave:false,cor:'coral',opac:.88,etapas:[3],atraso:A(17500)},
      {tipo:'regiao',terra:true,pts:AFRICA,suave:false,cor:'coral',opac:.88,etapas:[3],atraso:A(23800)},
      {tipo:'regiao',terra:true,pts:CARTAGO_P,suave:false,cor:'#c93a2a',opac:.95,etapas:[3],atraso:A(23800)},
      {tipo:'regiao',terra:true,pts:MACED,suave:false,cor:'coral',opac:.88,etapas:[3],atraso:A(28500)},
      {tipo:'regiao',terra:true,pts:GRECIA_C,suave:false,cor:'coral',opac:.88,etapas:[3],atraso:A(28800)},
      {tipo:'regiao',terra:true,pts:GRECIA_P,suave:false,cor:'coral',opac:.88,etapas:[3],atraso:A(29100)},
      {tipo:'regiao',terra:true,pts:ASIA,suave:false,cor:'coral',opac:.88,etapas:[3],atraso:A(32500)},

      {tipo:'etiqueta',p:[452,170],texto:'Itália',sub:'séculos V a III a.C.',tam:.6,etapas:[3],atraso:A(3500)},
      {tipo:'cidade',p:ROMA,nome:'Roma',capital:true,lado:'e',tam:.5,etapas:[3],atraso:A(2000)},
      {tipo:'etiqueta',p:[490,330],texto:'Sicília',sub:'241 a.C.',tam:.6,etapas:[3],atraso:A(9000)},
      {tipo:'etiqueta',p:[236,196],texto:'Sardenha e Córsega',sub:'238 a.C.',tam:.6,etapas:[3],atraso:A(11000)},
      {tipo:'etiqueta',p:[70,212],texto:'Hispânia',sub:'206 a.C.',tam:.6,etapas:[3],atraso:A(14300)},
      {tipo:'etiqueta',p:[284,126],texto:'sul da Gália',sub:'121 a.C.',tam:.6,etapas:[3],atraso:A(18300)},
      {tipo:'etiqueta',p:[330,420],texto:'África',sub:'146 a.C.',tam:.6,etapas:[3],atraso:A(24800)},
      {tipo:'cidade',p:CARTAGO,nome:'Cartago',sub:'rival fenícia',lado:'c',tam:.62,etapas:[3],atraso:A(5500)},
      {tipo:'etiqueta',p:[492,396],texto:'Cartago destruída',sub:'146 a.C.',tam:.6,cor:'amarelo',etapas:[3],atraso:A(23800)},
      {tipo:'etiqueta',p:[604,178],texto:'Macedônia e Grécia',sub:'148 e 146 a.C.',tam:.6,etapas:[3],atraso:A(29600)},
      {tipo:'etiqueta',p:[794,292],texto:'Ásia',sub:'133 a.C.',tam:.6,etapas:[3],atraso:A(33300)},
      {tipo:'etiqueta',p:[640,420],texto:'mare nostrum, nosso mar',tam:.66,etapas:[3],atraso:A(36500)},

      // ===== etapa 5: a marcha de Espártaco
      {tipo:'regiao',terra:true,pts:ITALIA,suave:false,cor:'coral',opac:.88,etapas:[4],atraso:A(33000)},
      {tipo:'cidade',p:ROMA,nome:'Roma',capital:true,lado:'e',tam:.4,etapas:[4],atraso:A(33000)},
      {tipo:'cidade',p:CAPUA,nome:'Cápua',lado:'e',tam:.4,etapas:[4],atraso:A(34000)},
      {tipo:'etiqueta',p:[545,222],texto:'marcha de Espártaco',sub:'73 a 71 a.C.',tam:.42,etapas:[4],atraso:A(36000)},
      {tipo:'etiqueta',p:[560,322],texto:'derrota, 71 a.C.',tam:.5,etapas:[4],atraso:A(41500)},

      // ===== etapa 6: a Gália de César
      {tipo:'regiao',terra:true,pts:ITALIA,suave:false,cor:'coral',opac:.8,etapas:[5],atraso:A(300)},
      {tipo:'regiao',terra:true,pts:HISPANIA,suave:false,cor:'coral',opac:.8,etapas:[5],atraso:A(300)},
      {tipo:'regiao',terra:true,pts:GALIA_NARB,suave:false,cor:'coral',opac:.8,etapas:[5],atraso:A(300)},
      {tipo:'regiao',terra:true,pts:SICILIA,suave:false,cor:'coral',opac:.8,etapas:[5],atraso:A(300)},
      {tipo:'regiao',terra:true,pts:AFRICA,suave:false,cor:'coral',opac:.8,etapas:[5],atraso:A(300)},
      {tipo:'regiao',terra:true,pts:MACED,suave:false,cor:'coral',opac:.8,etapas:[5],atraso:A(300)},
      {tipo:'regiao',terra:true,pts:GRECIA_C,suave:false,cor:'coral',opac:.8,etapas:[5],atraso:A(300)},
      {tipo:'regiao',terra:true,pts:ASIA,suave:false,cor:'coral',opac:.8,etapas:[5],atraso:A(300)},
      {tipo:'regiao',terra:true,pts:GALIA,estilo:'listra',suave:false,etapas:[5],atraso:A(2500)},
      {tipo:'etiqueta',p:[262,70],texto:'Gália',sub:'conquistada por César, 58 a 51 a.C.',tam:.5,cor:'amarelo',etapas:[5],atraso:A(4000)},
      {tipo:'cidade',p:ROMA,nome:'Roma',capital:true,lado:'e',tam:.5,etapas:[5],atraso:A(1500)},

      // ===== etapa 7: o Império no tamanho máximo
      {tipo:'regiao',terra:true,pts:OESTE,suave:false,cor:'coral',opac:.88,etapas:[6],atraso:A(19000)},
      {tipo:'regiao',terra:true,pts:LESTE_E7,suave:false,cor:'coral',opac:.88,etapas:[6],atraso:A(19300)},
      {tipo:'regiao',terra:true,pts:AFR_O,suave:false,cor:'coral',opac:.88,etapas:[6],atraso:A(19600)},
      {tipo:'regiao',terra:true,pts:AFR_L,suave:false,cor:'coral',opac:.88,etapas:[6],atraso:A(19800)},
      {tipo:'regiao',terra:true,pts:DACIA,suave:false,cor:'coral',opac:.88,etapas:[6],atraso:A(21500)},
      {tipo:'regiao',terra:true,pts:MESOP,estilo:'listra',suave:false,etapas:[6],atraso:A(23000)},
      {tipo:'etiqueta',p:[900,532],texto:'Mesopotâmia',sub:'conquistada por Trajano, 117 d.C.',tam:.8,cor:'amarelo',etapas:[6],atraso:A(24000)},
      {tipo:'rota',pts:E_APIA,suave:false,largura:6,dur:2,etapas:[6],atraso:A(21000)},
      {tipo:'rota',pts:E_GALIA,largura:6,dur:2,etapas:[6],atraso:A(21400)},
      {tipo:'rota',pts:E_NORTE,suave:false,largura:6,dur:2,etapas:[6],atraso:A(21800)},
      {tipo:'rota',pts:E_EGNATIA,largura:6,dur:2.4,etapas:[6],atraso:A(22200)},
      {tipo:'rota',pts:E_ORIENTE,largura:6,dur:2,etapas:[6],atraso:A(22600)},
      {tipo:'cidade',p:ROMA,nome:'Roma',capital:true,lado:'d',tam:.8,etapas:[6],atraso:A(20500)},
      {tipo:'etiqueta',p:[170,262],texto:'estradas saindo de Roma',tam:.8,etapas:[6],atraso:A(24800)},
      {tipo:'etiqueta',p:[640,455],texto:'Império Romano no auge, 117 d.C.',tam:.8,cor:'amarelo',etapas:[6],atraso:A(26500)},

      // ===== etapa 8: a divisão de 395 e as rotas germânicas
      {tipo:'regiao',terra:true,pts:OESTE,suave:false,cor:'coral',opac:.88,etapas:[7],atraso:A(21000)},
      {tipo:'regiao',terra:true,pts:LESTE,suave:false,cor:'#1d5f73',opac:.85,etapas:[7],atraso:A(21400)},
      {tipo:'regiao',terra:true,pts:AFR_O,suave:false,cor:'coral',opac:.88,etapas:[7],atraso:A(21200)},
      {tipo:'regiao',terra:true,pts:AFR_L,suave:false,cor:'#1d5f73',opac:.85,etapas:[7],atraso:A(21600)},
      {tipo:'rota',pts:LINHA,suave:false,estilo:'fronteira',largura:9,cor:'seta',dur:3,etapas:[7],atraso:A(24000)},
      {tipo:'etiqueta',p:[120,262],texto:'Império do Ocidente',sub:'capitais: Milão e, depois, Ravena',tam:.74,etapas:[7],atraso:A(26500)},
      {tipo:'etiqueta',p:[700,440],texto:'Império do Oriente',sub:'capital: Constantinopla',tam:.74,etapas:[7],atraso:A(27000)},
      {tipo:'etiqueta',p:[618,170],texto:'395 d.C.',sub:'Teodósio divide o Império entre os filhos',tam:.74,cor:'amarelo',etapas:[7],atraso:A(28000)},
      {tipo:'cidade',p:ROMA,nome:'Roma',capital:true,lado:'e',tam:.6,etapas:[7],atraso:A(22500)},
      {tipo:'cidade',p:MILAO,nome:'Milão',lado:'e',tam:.6,etapas:[7],atraso:A(26800)},
      {tipo:'cidade',p:RAVENA,nome:'Ravena',lado:'c',tam:.6,etapas:[7],atraso:A(27300)},
      {tipo:'cidade',p:CPLA,nome:'Constantinopla',sub:'antiga Bizâncio, atual Istambul',capital:true,lado:'c',tam:.72,etapas:[7],atraso:A(27800)},
      {tipo:'etiqueta',p:[345,372],texto:'vândalos',tam:.62,etapas:[7],atraso:A(34800)},
      {tipo:'etiqueta',p:[150,30],texto:'suevos',tam:.62,etapas:[7],atraso:A(33600)},
      {tipo:'etiqueta',p:[335,34],texto:'francos',tam:.62,etapas:[7],atraso:A(34200)},
      {tipo:'etiqueta',p:[756,124],texto:'visigodos',tam:.62,etapas:[7],atraso:A(35400)},
      {tipo:'etiqueta',p:[736,92],texto:'ostrogodos',tam:.62,etapas:[7],atraso:A(36600)},
      {tipo:'etiqueta',p:[706,36],texto:'lombardos',tam:.62,etapas:[7],atraso:A(37200)},
      {tipo:'etiqueta',p:[452,38],texto:'476 d.C.',sub:'os hérulos depõem Rômulo Augusto',tam:.62,cor:'amarelo',etapas:[7],atraso:A(39000)},
      {tipo:'etiqueta',p:[636,372],texto:'380 d.C.',sub:'Teodósio: cristianismo oficial',tam:.8,etapas:[7],atraso:A(27600)},
      {tipo:'etiqueta',p:[820,320],texto:'Império Bizantino',sub:'dura até 1453',tam:.62,cor:'amarelo',etapas:[7],atraso:A(41200)}
    ]},

    /* fita do tempo e as três faixas de papel */
    {id:'tempo',tipo:'tempo',grande:true,x:MX,y:2420,w:4400,h:190,giro:.2,avisoEt:'0,1,2,3,4,5,6,7,8',aviso:'régua fora de escala',
     marcos:[
      {p:4.4,t:'cerca de 1000 a.C.',s:'latinos no Lácio',cor:C0,etapa:0},
      {p:10.5,t:'509 a.C.',s:'fim da Monarquia',cor:C0,etapa:1},
      {p:17.5,t:'450 a.C.',s:'Doze Tábuas',cor:C1,etapa:2},
      {p:24.5,t:'264 a 146 a.C.',s:'Guerras Púnicas',cor:C1,etapa:3},
      {p:31.5,t:'133 a.C.',s:'Tibério Graco',cor:C1,etapa:4},
      {p:38.5,t:'73 a.C.',s:'Espártaco',cor:C1,etapa:4},
      {p:45.5,t:'60 a.C.',s:'Primeiro Triunvirato',cor:C1,etapa:5},
      {p:52.5,t:'44 a.C.',s:'morte de César',cor:C1,etapa:5},
      {p:59.5,t:'27 a.C.',s:'Otávio vira Augusto',cor:C2,etapa:[5,6]},
      {p:64.5,t:'235 a 285 d.C.',s:'anarquia militar',cor:C2,etapa:7},
      {p:70,t:'313 d.C.',s:'Édito de Milão',cor:C2,etapa:7},
      {p:75.5,t:'380 d.C.',s:'religião oficial',cor:C2,etapa:7},
      {p:81,t:'395 d.C.',s:'Império dividido',cor:C2,etapa:7},
      {p:87.5,t:'476 d.C.',s:'queda do Ocidente',cor:C2,etapa:[7,8]},
      {p:94.5,t:'1453',s:'queda de Constantinopla',cor:C2,etapa:7}]},
    {id:'f-mon',tipo:'faixa',x:1000,y:2650,w:500,h:110,W:500,H:110,texto:'Monarquia',tam:46,cor:'#e9dc9f',selo:'509 a.C.',seloW:200,tamSelo:36,seloEt:'1,2,3,4,5,6,7,8',rotulo:'Faixa de papel da Monarquia, até 509 a.C.',clicavel:false},
    {id:'f-rep',tipo:'faixa',x:1500,y:2650,w:2118,h:110,W:2118,H:110,texto:'República',tam:52,cor:'#f4a58f',selo:'27 a.C.',seloW:200,tamSelo:36,seloEt:'5,6,7,8',rotulo:'Faixa de papel da República, de 509 a 27 a.C.',clicavel:false},
    {id:'f-imp',tipo:'faixa',x:3618,y:2650,w:1232,h:110,W:1232,H:110,texto:'Império',tam:52,cor:'#9fc6cf',selo:'476 d.C.',seloW:210,tamSelo:36,seloEt:'8',rotulo:'Faixa de papel do Império, a partir de 27 a.C.',clicavel:false},
    {id:'et-idade',tipo:'etiqueta',x:4720,y:2830,w:560,h:140,clicavel:false,fs:40,atraso:A(32000),texto:'Idade Média, módulo 2'},

    /* etapa 1: a loba, à esquerda do mapa */
    {id:'loba',tipo:'icone',nome:'loba',fundo:'amarelo',x:60,y:130,w:560,h:560,giro:-2,atraso:A(18500),rotulo:'Recorte: a loba que amamentou os gêmeos Rômulo e Remo'},
    {id:'et-753',tipo:'etiqueta',x:660,y:170,w:380,h:250,clicavel:false,fs:42,atraso:A(20000),texto:'753 a.C.: data da fundação, pela tradição'},
    {id:'et-lenda',tipo:'etiqueta',x:40,y:760,w:820,h:170,clicavel:false,fs:44,atraso:A(21500),texto:'lenda, não fato: uma origem gloriosa para Roma'},
    {id:'n-etr',tipo:'nota',x:40,y:990,w:1000,giro:-1,fs:40,atraso:A(26000),texto:'A partir do século VII a.C., reis etruscos governaram Roma e fizeram grandes obras, como o templo de Júpiter e os esgotos.'},

    /* etapa 2: sociedade, no começo da fileira de baixo */
    {id:'pir',tipo:'piramide',x:100,y:3060,w:1200,h:676,alturaCamada:110,giro:-.6,rotulo:'Pirâmide social de Roma: patrícios, plebeus e escravos',
     camadas:[{t:'patrícios',s:'terra e poder'},{t:'plebeus',s:'livres, sem direitos políticos'},{t:'escravos',s:'por dívida ou por guerra'}]},
    {id:'et-cli',tipo:'etiqueta',x:1100,y:3070,w:760,h:190,clicavel:false,fs:40,atraso:A(14000),texto:'clientes: plebeus que dependem da proteção de um patrício'},
    {id:'n-cor',tipo:'nota',x:1200,y:3470,w:700,giro:1,fs:38,atraso:A(22000),texto:'Diferente da escravidão do Brasil colonial, a romana não se baseava na cor da pele.'},
    {id:'coroa',tipo:'icone',nome:'coroa-etrusca',fundo:'amarelo',x:2400,y:3040,w:400,h:400,giro:3,atraso:A(30000),rotulo:'Recorte: diadema de ouro dos reis etruscos, riscado em vermelho'},
    {id:'et-509',tipo:'etiqueta',x:2240,y:3480,w:720,h:130,clicavel:false,fs:42,atraso:A(34500),texto:'509 a.C.: fim da Monarquia'},

    /* etapa 3: República */
    {id:'org',tipo:'orgroma',x:3100,y:3040,w:1840,h:1010,giro:-.4,rotulo:'Organograma da República romana'},
    {id:'tab',tipo:'icone',nome:'tabua-bronze',fundo:'petroleo',x:5300,y:3040,w:400,h:400,giro:2,atraso:A(28000),rotulo:'Recorte: tábua de bronze com a Lei das Doze Tábuas'},
    {id:'et-tab',tipo:'etiqueta',x:5140,y:3700,w:720,h:230,clicavel:false,fs:44,atraso:A(31500),texto:'Lei das Doze Tábuas, 450 a.C.: leis escritas, todos podem saber as regras'},

    /* etapa 4: ver o mapa; o que está ao lado do mapa fica no deserto */
    {id:'navio',tipo:'icone',nome:'navio',fundo:'amarelo',x:Mb(372,318)[0]-150,y:Mb(372,318)[1]-150,w:300,h:300,giro:3,atraso:A(7500),rotulo:'Recorte: navio de guerra antigo, para lembrar a rivalidade de Roma e Cartago pelo mar'},
    {id:'n-prov',tipo:'nota',x:Mb(110,470)[0],y:Mb(110,470)[1],w:1100,giro:-1,fs:56,atraso:A(35000),texto:'Província: terra conquistada fora da Itália, governada por Roma e obrigada a pagar tributo.'},
    {id:'et-trib',tipo:'etiqueta',x:Mb(110,565)[0],y:1650,w:520,h:130,clicavel:false,fs:56,corTexto:'petroleo',atraso:A(38500),texto:'tributo'},
    {id:'et-escr',tipo:'etiqueta',x:Mb(110,565)[0],y:1850,w:820,h:130,clicavel:false,fs:56,corTexto:'#c1311e',atraso:A(40500),texto:'pessoas escravizadas'},

    /* etapa 5: a crise */
    {id:'causa',tipo:'causaroma',x:5800,y:3040,w:1300,h:1020,giro:.4,rotulo:'Esquema de causa e consequência da crise da República'},
    {id:'exodo',tipo:'exodo',x:7300,y:3040,w:1300,h:827,giro:-.5,atraso:A(10000),rotulo:'Esquema: camponeses saem do campo e se amontoam em Roma'},
    {id:'sil-t',tipo:'silhueta',nome:'Tibério Graco',sub:'tribuno, 133 a.C.',tam:56,fundo:'#e9dc9f',x:7300,y:3960,w:360,h:443,giro:-2,atraso:A(20500)},
    {id:'sil-c',tipo:'silhueta',nome:'Caio Graco',sub:'tribuno, 121 a.C.',tam:60,fundo:'#f4c8b8',x:7720,y:3960,w:360,h:443,giro:2,atraso:A(22000)},
    {id:'et-ref',tipo:'etiqueta',x:8160,y:4010,w:560,h:130,clicavel:false,fs:44,atraso:A(24500),texto:'reforma agrária'},
    {id:'et-frum',tipo:'etiqueta',x:8160,y:4180,w:560,h:200,clicavel:false,fs:40,atraso:A(26000),texto:'Lei Frumentária: trigo barato para os pobres'},
    {id:'sil-m',tipo:'silhueta',nome:'Mário',sub:'reformou o exército',tam:70,tamSub:38,fundo:'#c9e0d2',x:5800,y:4170,w:360,h:443,giro:-1.5,atraso:A(26500),rotulo:'Cartão: Mário, que reformou o exército'},
    {id:'sil-s',tipo:'silhueta',nome:'Sila',sub:'ditador',tam:70,fundo:'#f4c8b8',x:6240,y:4170,w:360,h:443,giro:1.5,atraso:A(27800),rotulo:'Cartão: Sila, que governou como ditador'},
    {id:'n-mario',tipo:'nota',x:5800,y:5200,w:640,giro:-1,fs:46,atraso:A(29000),texto:'Mário reformou o exército; Sila governou como ditador e enfraqueceu os tribunos.'},

    /* etapa 6: triúnviros */
    {id:'et-prim',tipo:'etiqueta',x:100,y:4330,w:480,h:170,clicavel:false,fs:42,atraso:A(10500),texto:'Primeiro Triunvirato, 60 a.C.'},
    {id:'t-pom',tipo:'silhueta',nome:'Pompeu',sub:'general prestigiado',tam:70,fundo:'#e9dc9f',sai:A(17500),x:100,y:4520,w:400,h:492,giro:-2,atraso:A(11000),rotulo:'Cartão: Pompeu, general prestigiado'},
    {id:'t-cra',tipo:'silhueta',nome:'Crasso',sub:'um dos mais ricos',tam:70,fundo:'#c9e0d2',sai:A(18800),x:560,y:4520,w:400,h:492,giro:1.5,atraso:A(11800),rotulo:'Cartão: Crasso, um dos homens mais ricos de Roma'},
    {id:'t-ces',tipo:'silhueta',nome:'César',sub:'conquistou a Gália',tam:70,fundo:'#f4c8b8',risco:A(20500),x:1020,y:4520,w:400,h:492,giro:-1,atraso:A(12600),rotulo:'Cartão: Júlio César, riscado em 44 a.C.'},
    {id:'et-44',tipo:'etiqueta',x:840,y:5040,w:600,h:150,clicavel:false,fs:40,atraso:A(21000),texto:'44 a.C.: assassinado por senadores'},
    {id:'et-seg',tipo:'etiqueta',x:1700,y:4330,w:480,h:170,clicavel:false,fs:42,atraso:A(23500),texto:'Segundo Triunvirato'},
    {id:'t-oct',tipo:'silhueta',nome:'Otávio',sub:'herdeiro de César',tam:70,louros:A(33500),fundo:'#e9dc9f',x:1700,y:4520,w:400,h:492,giro:1.5,atraso:A(24000),rotulo:'Cartão: Otávio, sobrinho-neto e herdeiro de César'},
    {id:'t-lep',tipo:'silhueta',nome:'Lépido',sub:'afastado',tam:70,fundo:'#c9e0d2',sai:A(30500),x:2160,y:4520,w:400,h:492,giro:-1.5,atraso:A(24800),rotulo:'Cartão: Lépido, afastado por Otávio'},
    {id:'t-ant',tipo:'silhueta',nome:'Marco Antônio',sub:'Áccio, 31 a.C.',tam:56,fundo:'#f4c8b8',sai:A(31800),x:2620,y:4520,w:400,h:492,giro:1,atraso:A(25600),rotulo:'Cartão: Marco Antônio, vencido em Áccio, 31 a.C.'},
    {id:'et-aug',tipo:'etiqueta',x:1670,y:5040,w:500,h:120,clicavel:false,fs:50,atraso:A(34800),texto:'Augusto, 27 a.C.'},

    /* etapa 7: Coliseu, trigo e capacete, fonte de Juvenal */
    {id:'col',tipo:'foto',img:'historia-roma-coliseu',x:5400,y:60,w:1300,h:726,giro:-1,fita:{x:30,g:-4},rotulo:'Recorte: o Coliseu, o Anfiteatro Flávio, em 80 d.C.'},
    {id:'et-50',tipo:'etiqueta',x:5620,y:830,w:880,h:130,clicavel:false,fs:50,atraso:A(5500),texto:'cerca de 50 mil pessoas'},
    {id:'trigo',tipo:'icone',nome:'saco-trigo',fundo:'amarelo',x:5500,y:1040,w:340,h:340,giro:-2,atraso:A(10000),rotulo:'Recorte: saco de trigo'},
    {id:'mais',tipo:'etiqueta',x:5890,y:1150,w:130,h:130,clicavel:false,fs:100,atraso:A(11500),texto:'+'},
    {id:'capac',tipo:'icone',nome:'capacete-gladiador',fundo:'petroleo',x:6070,y:1040,w:340,h:340,giro:2,atraso:A(12500),rotulo:'Recorte: capacete de gladiador'},
    {id:'et-pan',tipo:'etiqueta',x:5480,y:1440,w:960,h:130,clicavel:false,fs:46,atraso:A(14000),texto:'pão e circo: comida e espetáculo'},
    {id:'n-117',tipo:'nota',x:Mb(95,450)[0],y:Mb(95,450)[1],w:1200,giro:-1,fs:56,atraso:A(31000),texto:'O Império chegou ao tamanho máximo em 117 d.C., com Trajano; depois, a expansão praticamente parou.'},
    {id:'doc',tipo:'fonte',grande:true,x:7000,y:60,w:600,h:520,giro:1,rotulo:'Fonte histórica: Juvenal, sátira X, sobre o pão e o circo',
     texto:"“Desde que não vendemos mais nosso voto a ninguém, o povo largou as preocupações. Ele, que antes dava o comando, os cargos, as legiões, tudo, agora se contém e deseja ansioso só duas coisas: pão e jogos no circo.”",
     ref:"Juvenal, Sátiras, X, versos 77 a 81 (cerca de 120 a 130 d.C.). Paráfrase da equipe, a partir do latim e da tradução de Ramsay (1918, domínio público).",
     resposta:"Uma crítica à ==perda da participação política do povo== no Império: as eleições da República quase não valiam mais, e o povo teria trocado a política por comida e espetáculo. Quem escreve é um ==poeta satírico, que exagera de propósito== e despreza a plebe; para ele, “pão e circo” é acusação, mas para os governantes era também uma forma de negociar com a plebe pobre. Repare ainda que ele ==admite que, na República, votos eram vendidos==."},

    /* etapa 8: a corrente da crise, o colono e as notas */
    {id:'corr',tipo:'corrente',x:3200,y:4420,w:2000,h:522,giro:.3,rotulo:'Corrente da crise do escravismo'},
    {id:'colono',tipo:'colono',x:3200,y:5040,w:1400,h:896,giro:-.4,atraso:A(11000),rotulo:'Esquema: o colono preso ao lote'},
    {id:'et-col',tipo:'etiqueta',x:4720,y:5090,w:1180,h:200,clicavel:false,fs:44,atraso:A(15000),texto:'não podia ser vendido sem a terra, nem a terra sem ele'},
    {id:'n-dio',tipo:'nota',x:4720,y:5420,w:1100,giro:1,fs:44,atraso:A(8500),texto:'Diocleciano tabelou preços e salários (Édito do Máximo), dividiu o poder entre quatro (tetrarquia) e perseguiu os cristãos.'},
    {id:'n-barb',tipo:'nota',x:1240,y:1290,w:900,giro:-1,fs:56,atraso:A(41500),texto:'Bárbaro, para os romanos, era quem não falava sua língua nem seguia sua cultura. O Império do Oriente, o Bizantino, durou até 1453.'},

    /* etapa 9: legado, mesa sem mapa */
    {id:'pares',tipo:'pares',x:100,y:5560,w:1500,h:857,giro:-.4,rotulo:'Pares de deuses gregos e romanos'},
    {id:'aqued',tipo:'aqueduto',x:1760,y:5640,w:1500,h:471,atraso:A(10500),rotulo:'Aqueduto romano'},
    {id:'et-aq',tipo:'etiqueta',x:1780,y:6170,w:780,h:200,clicavel:false,fs:46,atraso:A(13000),texto:'arquitetura utilitária: estradas, pontes, termas e aquedutos'},
    {id:'arv',tipo:'arvore',x:3500,y:5540,w:900,h:630,giro:.5,atraso:A(18000),rotulo:'Árvore das línguas: do latim ao português, ao espanhol e ao italiano'},
    {id:'n-edu',tipo:'nota',x:1760,y:6440,w:1000,giro:-1,fs:48,atraso:A(22500),texto:'A educação variava por classe e sexo; a elite aprendia latim e grego.'},
    {id:'et-her',tipo:'etiqueta',x:3480,y:6260,w:900,h:290,clicavel:false,fs:48,atraso:A(27500),texto:'Herança: cidadania, direito, mitologia, arquitetura'}
  ],

  etapas:[
    {titulo:RUBR[0],mostra:['mapa','tempo','f-mon'],so:['loba','et-753','et-lenda','n-etr'],
     foco:FB(690,300,420),focoM:FM(690,300,300),
     tomadas:[[2500,FB(510,236,470)],[17500,[20,110,1060,1090]],[34000,TL(-120,1700)]],
     tomadasM:[[2500,FM(505,244,270)],[17000,[30,100,1030,900]],[22000,[30,740,1020,420]],[34000,TLM(28)]],tempo:48000,
     tracos:[
       {tipo:'circulo',peca:'loba',x:50,y:62,w:80,h:56,espessura:7,atraso:A(24000)},
       {tipo:'seta',de:{peca:'et-753',x:50,y:100},para:{peca:'loba',x:90,y:18},espessura:8,ponta:30,curva:.2,atraso:A(25500)}],
     texto:TEXTO[0]},
    {titulo:RUBR[1],so:['pir','et-cli','n-cor','coroa','et-509'],
     foco:[40,2990,2150,780],focoM:[60,3500,1260,440],
     tomadas:[[27500,[2430,2990,500,660]],[38000,TL(150,1700)]],
     tomadasM:[[9000,[880,3050,1040,700]],[17000,[1150,3400,820,400]],[27500,[2200,2990,820,740]],[38000,TLM(336)]],tempo:48000,
     realce:[{peca:'pir',item:[0,1,2]}],
     tracos:[{tipo:'seta',de:{peca:'et-cli',x:0,y:48},para:{peca:'pir',x:62,y:15},espessura:8,ponta:30,curva:.12,atraso:A(15500)}],
     texto:TEXTO[1]},
    {titulo:RUBR[2],mostra:['f-rep'],so:['org','tab','et-tab'],
     foco:[3040,3000,1900,1100],focoM:[3640,3050,780,260],
     tomadas:[[6000,[3040,3030,1900,720]],[22000,[3040,3240,1900,830]],[30000,[5120,3000,780,980]],[40000,TL(500,1700)]],
     tomadasM:[[3000,[3110,3290,720,400]],[5200,[3800,3290,720,400]],[7300,[4400,3040,520,640]],[13500,[3440,3700,640,330]],[16500,[3440,3290,640,700]],[18500,[3150,3050,600,300]],[20000,[4090,3730,860,300]],[29500,[5120,3000,780,980]],[40000,TLM(644)]],tempo:50000,
     tracos:[{tipo:'circulo',peca:'tab',x:50,y:52,w:84,h:78,espessura:8,atraso:A(29500)},
             {tipo:'seta',de:{peca:'tab',x:50,y:102},para:{peca:'et-tab',x:50,y:-2},espessura:9,ponta:34,curva:.06,atraso:A(32500)}],
     texto:TEXTO[2]},
    {titulo:RUBR[3],so:['navio','n-prov','et-trib','et-escr'],
     foco:FB(500,262,640),focoM:FM(500,262,320),
     tomadas:[[12000,FB(300,250,640)],[21000,FB(450,335,470)],[27000,FB(690,292,600)],[35000,FB(520,350,860)],[44000,TL(300,1700)]],
     tomadasM:[[12000,FM(300,250,320)],[21000,FM(492,365,340)],[27000,FM(700,295,330)],[35000,FM(340,290,420)],[38000,FM(680,290,420)],[41000,[1290,1380,1000,700]],[44000,TLM(798)]],tempo:50000,
     tracos:[
       {tipo:'seta',de:Mb(215,290),para:Mb(470,238),cor:'petroleo',espessura:16,ponta:60,curva:-.1,atraso:A(37000)},
       {tipo:'seta',de:Mb(445,350),para:Mb(488,246),cor:'petroleo',espessura:16,ponta:60,curva:.1,atraso:A(37400)},
       {tipo:'seta',de:Mb(650,300),para:Mb(500,238),cor:'petroleo',espessura:16,ponta:60,curva:.14,atraso:A(37800)},
       {tipo:'seta',de:Mb(810,300),para:Mb(500,226),cor:'petroleo',espessura:16,ponta:60,curva:.2,atraso:A(38200)},
       {tipo:'seta',de:Mb(455,362),para:Mb(500,250),cor:'seta',espessura:16,ponta:60,curva:-.1,atraso:A(39500)},
       {tipo:'seta',de:[1340,1822],para:[1700,1822],cor:'petroleo',espessura:16,ponta:44,curva:0,atraso:A(38800)},
       {tipo:'seta',de:[1340,2022],para:[1700,2022],cor:'seta',espessura:16,ponta:44,curva:0,atraso:A(40800)},
       {tipo:'seta',de:Mb(660,310),para:Mb(505,242),cor:'seta',espessura:16,ponta:60,curva:-.14,atraso:A(39900)},
       {tipo:'seta',de:Mb(820,310),para:Mb(506,232),cor:'seta',espessura:16,ponta:60,curva:-.2,atraso:A(40300)}],
     texto:TEXTO[3]},
    {titulo:RUBR[4],so:['causa','exodo','sil-t','sil-c','et-ref','et-frum','sil-m','sil-s','n-mario'],
     foco:[5740,2990,1900,1130],focoM:[5740,3010,1400,1100],
     tomadas:[[11000,[7240,2990,1500,900]],[21000,[7240,3900,1500,560]],[28500,[5740,4150,1000,640]],[30500,[5760,5100,800,560]],[33500,FB(515,236,470)]],
     tomadasM:[[11000,[7270,3010,1340,860]],[21000,[7290,3980,790,430]],[24500,[8120,4160,600,460]],[26500,[5760,4150,460,520]],[28000,[6200,4150,460,520]],[29000,[5780,5150,700,500]],[33500,FM(515,236,330)]],tempo:50000,
     tracos:[{tipo:'circulo',peca:'causa',x:75,y:91,w:50,h:16,espessura:8,cor:'seta',atraso:A(9000)},
       {tipo:'seta',de:Mb(514,254),para:Mb(541,318),cor:'seta',espessura:17,ponta:56,curva:.12,atraso:A(34500)},
       {tipo:'seta',de:Mb(544,306),para:Mb(470,160),cor:'seta',espessura:17,ponta:56,curva:.2,atraso:A(36500)},
       {tipo:'seta',de:Mb(466,162),para:Mb(530,312),cor:'seta',espessura:17,ponta:56,curva:-.25,atraso:A(39000)}],
     texto:TEXTO[4]},
    {titulo:RUBR[5],mostra:['f-imp'],so:['et-prim','t-pom','t-cra','t-ces','et-44','et-seg','t-oct','t-lep','t-ant','et-aug'],
     foco:FB(300,110,520),focoM:FM(320,125,360),
     tomadas:[[9500,[40,4320,1500,860]],[22500,[1640,4320,1560,860]],[33000,[1620,4340,780,900]],[37500,TL(1500,1700)]],
     tomadasM:[[9500,[90,4490,880,540]],[14500,[600,4340,900,700]],[22500,[1680,4340,900,700]],[27500,[2200,4340,900,700]],[33000,[1600,4400,700,780]],[37500,TLM(2184)]],tempo:43000,
     texto:TEXTO[5]},
    {titulo:RUBR[6],so:['col','et-50','trigo','mais','capac','et-pan','n-117','doc'],fonte:'doc',
     foco:[5340,0,1400,1000],focoM:[5360,30,1340,950],
     tomadas:[[9500,[5420,1000,1100,640]],[17500,FB(640,292,1040)],[37500,[6940,40,720,580]]],
     tomadasM:[[9500,[5420,1010,1000,620]],[17500,FM(560,265,660)],[26000,FM(920,380,560)],[30000,FM(300,330,420)],[37500,[6960,40,680,760]]],tempo:50000,
     tracos:[{tipo:'circulo',peca:'col',x:68,y:36,w:70,h:56,espessura:10,atraso:A(2500)},
             {tipo:'seta',de:{peca:'col',x:60,y:62},para:{peca:'et-50',x:55,y:0},espessura:9,ponta:34,curva:.2,atraso:A(4000)}],
     texto:TEXTO[6]},
    {titulo:RUBR[7],so:['corr','colono','et-col','n-dio','n-barb'],
     foco:[3140,4350,2480,640],focoM:[3180,4380,1060,520],
     tomadas:[[8000,[4640,5340,1300,560]],[10500,[3140,5000,2800,1000]],[22000,FB(560,270,1000)],[32500,FB(480,215,900)],[41600,[1150,1230,1300,640]],[45000,TL(2700,1700)]],
     tomadasM:[[6000,[4130,4380,1060,520]],[8000,[4640,5380,1240,520]],[10500,[3200,5030,1420,920]],[15000,[4700,5060,1240,360]],[22000,FM(350,255,470)],[26000,FM(770,290,430)],[32500,FM(280,215,480)],[35500,FM(600,205,520)],[38800,FM(330,340,480)],[41600,[1160,1250,1000,420]],[45000,[4000,2310,660,440]]],tempo:50000,
     tracos:[].concat(...[
       ['f1',[415,36],[355,98],.1,33700],['s1',[268,38],[112,160],.12,33000],['v1',[340,38],[205,242],.1,34400],['v2',[170,322],[428,350],.12,35000],
       ['vi1',[752,138],[548,176],.1,35500],['vi2',[452,166],[218,238],.1,36000],['o1',[732,104],[490,146],.1,36700],['l1',[702,56],[512,122],.1,37300]
     ].map(a=>[{tipo:'seta',de:Mb(a[1][0],a[1][1]),para:Mb(a[2][0],a[2][1]),cor:'branco',espessura:17,ponta:62,curva:a[3],atraso:A(a[4])},{tipo:'seta',de:Mb(a[1][0],a[1][1]),para:Mb(a[2][0],a[2][1]),cor:'tinta',espessura:10,ponta:50,curva:a[3],atraso:A(a[4])}])).concat([
       {tipo:'seta',de:Mb(480,96),para:Mb(476,148),cor:'tinta',espessura:8,ponta:36,curva:.1,atraso:A(39800)}]),
     texto:TEXTO[7]},
    {titulo:RUBR[8],mostra:[],so:['pares','aqued','et-aq','arv','n-edu','et-her','doc','et-idade'],fonte:'doc',
     foco:[40,5500,1620,960],focoM:[60,5540,1560,900],
     tomadas:[[10000,[1700,5560,1600,1000]],[18000,[3430,5480,1080,780]],[27000,[3430,6140,1100,460]],[31500,TL(3400,1700)],[40000,[6940,40,720,580]]],
     tomadasM:[[8000,[100,5560,1500,860]],[10000,[1740,5620,780,500]],[14000,[2570,5620,780,500]],[17500,[3470,5560,940,1000]],[22500,[1740,6400,1040,380]],[27000,[3470,5560,940,1000]],[31500,TLM(3724)],[40000,[6940,40,720,580]]],tempo:50000,
     tracos:[{tipo:'seta',de:[4770,2768],para:[4800,2826],espessura:8,ponta:24,curva:.05,atraso:A(33000)}],
     texto:TEXTO[8]}
  ]
});
})();
