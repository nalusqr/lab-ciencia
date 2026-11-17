/* Módulo 1, tópico 5: Grécia antiga. Roteiro revisado: docs/revisao-historia/m01-t05-grecia.md
   Formato dos dados: docs/historia/MOTOR.md. O mapa da Grécia usa pixels da própria base (historia-mapa-mediterraneo, 1376 x 768),
   lidos sobre a costa desenhada, porque a base é uma pintura e a conversão por longitude e latitude erra até cerca de 13 px (muito num zoom forte).
   Só as regiões do Oriente (Pérsia, Egito, Mesopotâmia) usam longitude e latitude (ll:true).
   A peça do mapa tem escala 3 na mesa (4128 x 2304). Mb() leva pixel da base para pixel da mesa.
   Mesa em zonas: genos (esquerda do mapa), mapa (topo), fita do tempo (embaixo do mapa), Esparta (direita do mapa),
   Atenas (meio esquerda), democracia (meio), quem ficava de fora (meio direita), cultura (embaixo). */
(function(){
const A=n=>Colagem.reduz?0:n;                      // atrasos só com movimento
const BASE='historia-mapa-mediterraneo',S=3,MX=1000,MY=0;
const Mb=(x,y)=>[Math.round(MX+x*S),Math.round(MY+y*S)];
const FB=(cx,cy,w,asp)=>{const h=w/(asp||1.3),a=Mb(cx-w/2,cy-h/2);return [a[0],a[1],Math.round(w*S),Math.round(h*S)];};   // enquadra no mapa (desktop)
const FM=(cx,cy,w)=>FB(cx,cy,w,.68);                                                                                        // enquadra no mapa (celular)
const PCT=(x,y)=>[x/1376*100,y/768*100];
const TL=(x,w)=>[1000+x,2370,w,400];                // enquadra um trecho da fita do tempo
// ---- pontos (pixels da base)
const ATENAS=[687,318],ESPARTA=[665,354],CORINTO=[653,319.5],TEBAS=[678,308],OLIMPIA=[648,329],MICENAS=[668,333],CNOSSOS=[714,396],MILETO=[757,330];
const MARATONA=[693,312],TERMOPILAS=[664,296],SALAMINA=[683,321.5],DELOS=[718,332],EGOS=[740,267];
const OLBIA=[822,108],QUERSONESO=[868,148],PANTICAPEU=[944,134],SINOPE=[903,214],TREBIZONDA=[985,234],BIZANCIO=[790,244];
const CUMAS=[498,247],TARENTO=[560,262],CROTONE=[558,290],SIRACUSA=[527,338];
// ---- regiões (pixels da base); "terra:true" recorta pela costa da base
const CONT=[[596,262],[712,262],[712,338],[690,338],[672,327],[660,318.5],[596,318.5]];
const PELOP=[[637,318.5],[660,318.5],[672,327],[690,338],[692,348],[692,380],[637,380]];
const CRETA=[[678,384],[748,384],[748,414],[678,414]];
const CICLADES=[[693,321],[744,321],[744,382],[693,382]];
const RODES=[[760,363],[784,363],[784,386],[760,386]];
const T_ATICA=[[672,314],[712,314],[712,338],[690,338],[672,327]];
const T_BEOCIA=[[656,298],[684,298],[684,314],[656,314]];
const T_CORINTO=[[640,314],[668,314],[668,326],[640,326]];
const T_LACONIA=[[656,334],[686,334],[686,380],[660,380]];
const T_ELIDA=[[637,322],[656,322],[656,342],[637,342]];
const MESSENIA=[[637,336],[656,336],[660,352],[664,380],[637,380]];
const MAGNA=[[535,232],[594,232],[594,334],[538,336],[505,300],[500,262]];
const SICILIA=[[464,300],[540,300],[540,362],[464,362]];
const LIGA_ATENAS=[[745,285],[760,287],[757,300],[765,312],[760,326],[767,338],[762,352],[745,354]];
const LESBOS=[[726,284],[744,284],[744,302],[726,302]];
const LIGA_ESPARTA=[[596,296],[672,296],[672,318.5],[596,318.5]];
const MACEDONIA=[[598,205],[765,205],[765,262],[700,262],[690,270],[660,276],[598,276]];
// ---- Oriente (longitude e latitude)
const IMPERIO=[[24.8,31.6],[25.6,38.5],[26.5,40.5],[29,41.2],[34,42],[41,41.6],[44,41.2],[47,41],[49,38.5],[53,37.2],[56.8,37.6],[56.8,24.5],[48.5,28.5],[44,29.5],[38,29.8],[35,28.4],[34,25.5],[36.8,22.1],[24.8,22.1]];
const EGITO=[[25,31.7],[29,31.2],[32,31.3],[34.2,31.2],[34.9,29.5],[34.0,27.8],[35.6,24.0],[36.8,22.1],[25,22.0]];
const BAB=[[48.2,29.8],[48.8,31.2],[47.6,33.5],[46.2,35.5],[43.5,37.3],[41,37.2],[38,36.8],[36,36.3],[35.8,35],[35.1,33.2],[34.7,31.4],[35.8,30.2],[38,31.5],[42,31.6],[44.8,29.8],[47.5,29.0]];
const IRA=[[48.8,30.2],[50.5,29.2],[52.8,27.6],[55,26.7],[56.8,27.0],[56.8,36.9],[54,36.9],[51,36.7],[49.2,37.3],[47.9,38.4],[46.2,38.0],[45.5,36.0],[46.2,34.0],[47.6,32.4]];
const ANATOLIA=[[26,36.4],[26.2,41.8],[28.5,41.3],[33,42.2],[38,41.2],[41.5,41.2],[44,40.3],[42,37.2],[36.2,36.2],[30,36.2]];
const ALEX=[[22.5,40.8],[26.5,40.3],[31,38.5],[36.2,36.8],[35.2,33.3],[32.5,31.2],[29.9,31.2],[33.5,31.2],[35.5,33.3],[38,35.5],[43.3,36.5],[44.4,32.5],[48.2,32.2],[52.9,29.9],[56.8,31.2]];
// ---- rotas por água (pixels da base)
const R_NEGRO=[[690,324],[702,313],[713,301],[722,288],[730,272],[740,262],[752,257],[764,252],[778,252],[789,250],[791,243],[790,232],[786,215],[781,192],[790,166],[805,142],[818,119]];
const R_SINOPE=[[791,243],[800,236],[830,228],[865,220],[895,214]];
const R_TREBIZ=[[895,214],[930,224],[965,234]];
const R_PANTI=[[805,142],[850,152],[900,134],[940,132]];
const R_MILETO=[[690,324],[708,330],[728,334],[748,331]];
const R_ITALIA=[[653,321],[644,323],[634,327],[620,324],[606,314],[592,300],[580,288],[570,276]];
const R_SICILIA=[[634,327],[620,334],[598,342],[572,347],[548,347],[532,342]];
// ---- fita do tempo: pinos
const TEXTO=[
  'A Grécia antiga nasceu no sul da ==Península Balcânica==, entre os mares Egeu e Jônico, num território dividido em três partes: a Grécia continental, a peninsular, que é o Peloponeso, e a insular, com centenas de ilhas. O relevo é montanhoso e o solo é pouco fértil, com pouca terra boa para plantar. Por isso os gregos se voltaram para o mar, e o ==comércio== virou a principal atividade. Entre cerca de 2200 e 1200 a.C., floresceram os cretenses, na ilha de Creta, e depois os micênicos, ou aqueus, estes já de língua grega. Como no Egito e na Mesopotâmia, havia palácios que controlavam a produção e um ==rei-sacerdote==. Por volta de 1200 a.C., os micênicos entraram em crise, que a tradição liga às invasões dóricas.',
  'Depois da crise micênica veio o ==período homérico==, que conhecemos pela Ilíada e pela Odisseia, poemas atribuídos a Homero. As famílias viviam em genos: comunidades agrícolas autossuficientes, com a terra de todos, a propriedade comunal, chefiadas pelo pater. Com o crescimento da população, faltou terra. Os genos se uniram, a propriedade comunal acabou e uma elite ficou com os melhores lotes. Separadas pelo relevo e pelas disputas entre dórios, jônios e eólios, as comunidades formaram as ==pólis==: cidades-estado independentes, cada uma com leis, exército e cultos próprios, e com a acrópole como centro. Quem ficou sem terra partiu: a partir do século VIII a.C., os gregos fundaram ==colônias== no Mar Negro, na Ásia Menor e no sul da Itália, a Magna Grécia.',
  'Atenas foi primeiro uma monarquia, governada pelo basileu. Depois, o poder passou aos nobres, os eupátridas, que escolhiam os ==arcontes==, governantes com mandato de um ano. A expansão comercial enriqueceu alguns, mas muitos camponeses se endividaram e corriam o risco de virar escravos dos credores. Para conter a crise, vieram reformas. ==Drácon== pôs por escrito as leis da tradição oral, mas elas confirmaram o poder dos eupátridas. ==Sólon==, em 594 a.C., aboliu a escravidão por dívidas de atenienses, deu a qualquer cidadão o direito de prestar queixa na justiça e dividiu os cidadãos pela renda, o critério censitário. As tensões continuaram e abriram espaço para os tiranos, que tomavam o poder fora das regras tradicionais. Em 510 a.C., o último foi expulso e, em 508 a.C., Clístenes fez as reformas que criaram a democracia.',
  'Democracia vem do grego demos, povo, e kratos, governo. Em Atenas ela era ==direta==: não havia representantes, e o próprio cidadão votava na ==Eclésia==, a assembleia, que se reunia cerca de 40 vezes por ano para decidir sobre leis, guerra e paz, religião e festas. A Bulé, um conselho com membros sorteados e pagos, analisava os projetos de lei e supervisionava a administração, e os magistrados executavam o que a Eclésia decidia. Pelo ==ostracismo==, os cidadãos podiam afastar por dez anos quem ameaçasse o regime. Três princípios guiavam o sistema: isonomia, igualdade perante a lei; isocracia, igualdade de acesso aos cargos; e isegoria, igualdade para falar na assembleia. O auge foi o século V a.C., chamado século de Péricles.',
  'Cidadão era só o ==homem livre, maior de 18 anos, filho de pai e mãe atenienses==. Por volta de 430 a.C., de cerca de 310 mil habitantes, só cerca de 40 mil eram cidadãos. Mesmo assim havia uma novidade: pequenos proprietários votavam lado a lado com os nobres. As mulheres ficavam restritas ao lar e à criação dos filhos. Os ==metecos==, estrangeiros livres que viviam do comércio e do artesanato, pagavam taxa, não votavam e não podiam casar com cidadãos. Os escravos, por guerra, nascimento ou, até Sólon, por dívida, eram a base do trabalho, nas minas, no campo e nas casas. Aristóteles os chamou de ==instrumentos vivos==, expressão lembrada pelo historiador Pedro Paulo Funari. Era esse trabalho que dava aos cidadãos tempo livre para a política.',
  'Esparta foi fundada pelos dórios por volta do século IX a.C., no Peloponeso, em terras mais férteis. Era uma ==oligarquia militar==. Dois reis, a diarquia, cuidavam da religião e do exército. A Gerúsia, com 28 homens de mais de 60 anos, elaborava as leis. A Apela, assembleia dos cidadãos-soldados acima de 30 anos, votava as leis e elegia os gerontes, e cinco éforos, eleitos a cada ano, executavam as decisões. Os espartanos eram uma minoria e dominavam os periecos, livres, mas sem direitos políticos, e os ==hilotas==, servos do Estado presos à terra, que eram a maioria. O medo de uma revolta dos hilotas explica a ==educação militar==: desde a infância, o Estado educava os meninos para a guerra, até que se tornassem hoplitas.',
  'No século V a.C., os persas de Dario I e de Xerxes tentaram dominar a Grécia: são as ==Guerras Médicas==, nome que vem dos medos, povo ligado aos persas. Atenas e Esparta lideraram os gregos e venceram em batalhas como Maratona, em 490 a.C., e Salamina, em 480 a.C. Em 478 a.C., Atenas formou a ==Liga de Delos==, aliança militar cujo tesouro ficava na ilha de Delos. Com o tempo, Atenas usou a Liga para mandar nas aliadas e cobrar tributos: é o imperialismo ateniense, que ajudou a pagar o esplendor da cidade de Péricles. Contra ele, Esparta liderou a Liga do Peloponeso. A ==Guerra do Peloponeso== durou de 431 a 404 a.C. e terminou com a vitória de Esparta, depois da batalha de Egos Pótamos, em 405 a.C.',
  'As guerras entre as pólis deixaram as cidades gregas fracas e divididas. No século IV a.C., a ==Macedônia==, reino do norte, aproveitou e conquistou a Grécia. ==Alexandre, o Grande==, rei macedônio de 336 a 323 a.C., derrotou o Império Persa, conquistou o Egito e chegou até a Índia, no rio Indo. Pelo caminho fundou várias cidades chamadas Alexandria; a mais famosa, no Egito, virou um grande centro de estudos. A cultura grega se espalhou e se misturou às culturas do Oriente: é o ==período helenístico==. Depois da morte de Alexandre, o império se dividiu entre seus generais em reinos, como Macedônia, Egito e Síria. Roma os incorporou a partir do século II a.C., mas as cidades gregas mantiveram suas instituições e sua cultura.',
  'A cultura grega é uma das bases do Ocidente. Na ==filosofia==, Sócrates, Platão e Aristóteles buscaram explicar o mundo pela razão; na história, Heródoto e Tucídides passaram a investigar e narrar os fatos humanos. A religião era politeísta: deuses como Zeus, Atena, Apolo e Poseidon eram imortais, mas antropomórficos, com forma e paixões humanas, e interferiam na vida das pessoas; os semideuses eram filhos de deuses e humanos. Homero cantou a Guerra de Troia na Ilíada e a volta de Ulisses na Odisseia. No ==teatro==, havia tragédias, como as de Ésquilo e Sófocles, e comédias, como as de Aristófanes. Na arquitetura surgiram as ordens dórica, jônica e coríntia, e o maior símbolo é o ==Partenon==, templo de Atena na acrópole de Atenas.'
];

Colagem.montar({
  modulo:'Módulo 1: Pré-História e Antiguidade',
  titulo:'Grécia antiga',
  subtitulo:'Das pólis à democracia, e quem ficava de fora dela',
  credito:'Figura da hídria: recriação gerada por IA a partir de uma hídria ática de figuras negras. Recortes, esquemas e mapa desenhados pelo LAB.',
  ritmo:10000,
  celularGrande:true,
  msPalavra:250,
  mesa:{w:9200,h:6200},
  enem:`O tema mais cobrado é a ==democracia ateniense e seus limites==, muitas vezes a partir de um texto, como a oração fúnebre de Péricles, comparada à democracia representativa e de voto universal de hoje. Também cai a comparação entre Atenas e Esparta.

Pegadinhas:
- Dizer que "todos votavam"; só os cidadãos votavam.
- Dizer que a democracia ateniense era representativa; era direta.
- Dizer que Sólon aboliu toda a escravidão; ele acabou só com a de atenienses por dívida.
- Igualar a escravidão antiga, por guerra, dívida ou nascimento, à do Brasil colonial, justificada pela suposta inferioridade dos africanos.
- Dizer que a Liga de Delos foi uma aliança de Atenas com Esparta; Esparta liderou a Liga do Peloponeso, rival de Atenas.`,
  estudo:[
  {titulo:'Onde e quando',texto:`A **Antiguidade** vai da invenção da escrita, por volta de 3200 a.C., à queda do Império Romano do Ocidente, em 476 d.C. A Grécia surgiu no sul da **Península Balcânica**, entre os mares Egeu e Jônico, e se divide em Grécia **continental**, **peninsular** (o Peloponeso) e **insular**. O relevo montanhoso e o solo pouco fértil tiveram duas consequências: isolaram as comunidades e empurraram os gregos para o mar, o comércio e a busca de novas terras.`},
  {titulo:'Dos creto-micênicos às pólis',texto:`Entre cerca de 2200 e 1200 a.C., floresceram os **cretenses** e depois os **micênicos**, ou aqueus, já de língua grega. Como no Egito e na Mesopotâmia, havia palácios que controlavam a produção e um rei-sacerdote. Por volta de 1200 a.C., os micênicos entraram em crise. A explicação tradicional é a invasão dos **dórios**, povo indo-europeu, como os jônios e os eólios; hoje se fala numa crise geral do Mediterrâneo.

No **período homérico**, conhecido pela Ilíada e pela Odisseia, a sociedade se organizava em **genos**: comunidades agrícolas autossuficientes, com terra de todos e chefiadas pelo pater. O crescimento da população tornou a terra escassa, a propriedade comunal acabou e uma elite ficou com as melhores terras. Isoladas pelo relevo e pelas disputas entre os povos, as comunidades formaram as **pólis**, cidades-estado independentes, cada uma com leis, exército e cultos próprios e com a acrópole como centro. O que unia os gregos era a língua, a religião e os costumes. No **Período Arcaico** (séculos VIII a VI a.C.), destacaram-se Atenas e Esparta, e a falta de terra levou à colonização do Mar Negro, da Ásia Menor e do sul da Itália, a **Magna Grécia**. As colônias mandavam cereais e matérias-primas; as cidades de origem, manufaturas.`},
  {titulo:'Atenas: das leis escritas à democracia',texto:`Atenas foi monarquia, com o basileu, e depois aristocracia: os **eupátridas**, os "bem-nascidos", escolhiam os **arcontes**, com mandato de um ano. A expansão comercial enriqueceu alguns, mas muitos camponeses se endividaram e podiam virar escravos do credor. **Drácon** pôs por escrito as leis orais, mas reforçou o poder dos eupátridas. **Sólon**, em 594 a.C., aboliu a escravidão por dívidas de atenienses, deu a qualquer cidadão o direito de prestar queixa na justiça e dividiu os cidadãos pela renda, o **critério censitário**: a riqueza, e não só o nascimento, passou a abrir os cargos. A crise abriu espaço para os **tiranos**, que tomavam o poder fora das regras tradicionais. Em 510 a.C., o último, Hípias, foi expulso, e em 508 a.C. **Clístenes** fez as reformas que criaram a democracia.`},
  {titulo:'Como funcionava a democracia',texto:`Democracia vem de *demos*, povo, e *kratos*, governo. A ateniense era **direta**, sem representantes. A **Eclésia**, assembleia dos cidadãos, reunia-se cerca de 40 vezes por ano e decidia sobre leis, guerra e paz, religião e festas. A **Bulé**, conselho sorteado e remunerado, preparava os projetos de lei, e os magistrados executavam as decisões. O **ostracismo** afastava por dez anos quem ameaçasse o regime. Os princípios eram a **isonomia** (igualdade perante a lei), a **isocracia** (igualdade de acesso aos cargos) e a **isegoria** (igualdade de palavra). O apogeu foi o século V a.C., o "século de Péricles". Participar exigia ser livre e ter tempo, e esse tempo vinha do trabalho escravo: em Atenas, democracia e escravidão andavam juntas.`.replace(/\*demos\*/g,'demos').replace(/\*kratos\*/g,'kratos')},
  {titulo:'Quem ficava de fora',texto:`Cidadão era o **homem livre, maior de 18 anos, filho de pai e mãe atenienses** (alguns livros dizem 21). Por volta de 430 a.C., de cerca de 310 mil habitantes, só cerca de 40 mil eram cidadãos. Ainda assim, pequenos proprietários votavam ao lado dos nobres. As **mulheres** ficavam restritas ao lar. Os **metecos**, estrangeiros livres, viviam do comércio e do artesanato, pagavam taxa e não tinham direitos políticos. Os **escravos** eram a base da sociedade; Pedro Paulo Funari, retomando Aristóteles, lembra que eram vistos como "instrumentos vivos": cerca de 30 mil nas minas de prata, 25 mil no campo e 73 mil nas cidades. A cerâmica, com cenas do cotidiano e da mitologia, é uma das fontes para conhecer essa sociedade.`},
  {titulo:'Esparta',texto:`Fundada pelos dórios por volta do século IX a.C., no Peloponeso, em terras férteis, Esparta era uma **oligarquia militar**. Dois reis (a **diarquia**) cuidavam da religião e do exército; a **Gerúsia**, com 28 homens de mais de 60 anos, elaborava as leis; a **Apela**, dos cidadãos-soldados acima de 30 anos, votava; e cinco **éforos**, eleitos por ano, executavam. Uma pequena elite de espartanos dominava os **periecos**, livres mas sem direitos políticos, e os **hilotas**, servos do Estado presos à terra e maioria da população. O medo de revolta explica a militarização, com educação militar dos meninos até virarem **hoplitas**, a xenofobia e o papel da mulher: gerar filhos fortes para o Estado.`},
  {titulo:'Das Guerras Médicas a Alexandre',texto:`No século V a.C., os persas de Dario I e Xerxes invadiram a Grécia, e os gregos, liderados por Atenas e Esparta, venceram as **Guerras Médicas**. Em 478 a.C., Atenas criou a **Liga de Delos**, aliança com tesouro na ilha de Delos, e depois a usou para submeter as aliadas: é o **imperialismo ateniense**. Sob Esparta, as rivais formaram a **Liga do Peloponeso**. A **Guerra do Peloponeso** (431 a 404 a.C.) terminou com a vitória espartana, depois de Egos Pótamos, e as disputas seguintes enfraqueceram as pólis. No século IV a.C., a **Macedônia** conquistou a Grécia. **Alexandre, o Grande**, derrotou os persas, chegou à Índia e fundou várias Alexandrias, a mais célebre no Egito. A cultura grega se misturou à oriental no **período helenístico**. Após sua morte, o império se dividiu em reinos (Macedônia, Egito, Síria), que Roma incorporou a partir do século II a.C.`},
  {titulo:'Cultura grega',texto:`Os gregos estão na base da cultura ocidental: na **filosofia**, Sócrates, Platão e Aristóteles; na história, Heródoto e Tucídides. Os deuses, como Zeus, Atena, Apolo e Poseidon, eram imortais, mas **antropomórficos**, com paixões humanas. A Ilíada conta a Guerra de Troia; a Odisseia, a volta de Ulisses. No **teatro**, Ésquilo, o "pai da tragédia", Sófocles, autor de Édipo Rei e Antígona, e Aristófanes, nas comédias. Na arquitetura, as ordens **dórica**, **jônica** e **coríntia** e o **Partenon**. A ideia de que os assuntos públicos dizem respeito a todos foi retomada no Ocidente a partir do século XVIII.`}
  ],
  resumo:[
  'Relevo e solo pobre levaram ao isolamento, ao comércio marítimo e à colonização.',
  'Genos com terra comum deram lugar a uma elite proprietária e às pólis.',
  'Atenas: Drácon, Sólon, tiranias e, com Clístenes, a democracia.',
  'Democracia direta: Eclésia, Bulé, ostracismo; isonomia, isocracia, isegoria.',
  'Cerca de 40 mil cidadãos em cerca de 310 mil habitantes; mulheres, metecos e escravos de fora.',
  'Esparta: oligarquia militar apoiada na servidão dos hilotas.',
  'Guerras Médicas, Liga de Delos, imperialismo ateniense e Guerra do Peloponeso.',
  'Alexandre e o período helenístico.'
  ],
  urca:`Não há ligação histórica direta entre a Grécia antiga e o Ceará. A ponte possível é a comparação entre escravidões: na Grécia, sem critério de cor; no Brasil, apoiada no racismo. O Ceará foi a primeira província a declarar o fim da escravidão, em 25 de março de 1884, tema do módulo sobre o Império. Para a prova, reforce o vocabulário (pólis, genos, eupátridas, metecos, hilotas, isonomia, ostracismo) e a diferença entre democracia direta e representativa.`,

  pecas:[
    {id:'mapa',tipo:'mapa',base:BASE,x:MX,y:MY,w:4128,h:2304,rotulo:'Mapa do Mediterrâneo oriental: a Grécia, o Mar Egeu, o Mar Negro, a Itália e o Oriente Próximo',camadas:[
      // ---- nomes dos mares, sempre à vista
      {tipo:'rotulo',p:[592,404],texto:'Mar Mediterrâneo',classe:'mar',tam:.34,desde:0},
      {tipo:'rotulo',p:[722,358],texto:'Mar Egeu',classe:'mar',tam:.22,desde:0},
      {tipo:'rotulo',p:[596,346],texto:'Mar Jônico',classe:'mar',tam:.2,desde:0},
      {tipo:'rotulo',p:[868,196],texto:'Mar Negro',classe:'mar',tam:.46,desde:0},

      // ===== etapa 1: montanhas, mar e palácios
      {tipo:'regiao',terra:true,pts:CONT,suave:false,cor:'coral',opac:.85,etapas:[0],atraso:A(4500)},
      {tipo:'etiqueta',p:[606,248],texto:'Grécia continental',tam:.12,etapas:[0],atraso:A(5600)},
      {tipo:'regiao',terra:true,pts:PELOP,suave:false,cor:'coral',opac:.85,etapas:[0],atraso:A(10500)},
      {tipo:'etiqueta',p:[600,354],texto:'Peloponeso',tam:.12,etapas:[0],atraso:A(11600)},
      {tipo:'regiao',terra:true,pts:CRETA,suave:false,cor:'coral',opac:.85,etapas:[0],atraso:A(16500)},
      {tipo:'regiao',terra:true,pts:CICLADES,suave:false,cor:'coral',opac:.85,etapas:[0],atraso:A(16700)},
      {tipo:'regiao',terra:true,pts:RODES,suave:false,cor:'coral',opac:.85,etapas:[0],atraso:A(16900)},
      {tipo:'etiqueta',p:[696,350],texto:'Grécia insular',tam:.12,etapas:[0],atraso:A(17600)},
      // relevo: montanhas
      {tipo:'rotulo',p:[626,286],texto:'▲',classe:'terra',tam:.4,etapas:[0],atraso:A(21500)},
      {tipo:'rotulo',p:[631,296],texto:'▲',classe:'terra',tam:.4,etapas:[0],atraso:A(21700)},
      {tipo:'rotulo',p:[636,306],texto:'▲',classe:'terra',tam:.4,etapas:[0],atraso:A(21900)},
      {tipo:'rotulo',p:[651,268],texto:'▲',classe:'terra',tam:.4,etapas:[0],atraso:A(22100)},
      {tipo:'rotulo',p:[660,286],texto:'▲',classe:'terra',tam:.4,etapas:[0],atraso:A(22300)},
      {tipo:'rotulo',p:[648,298],texto:'▲',classe:'terra',tam:.4,etapas:[0],atraso:A(22500)},
      {tipo:'rotulo',p:[654,346],texto:'▲',classe:'terra',tam:.4,etapas:[0],atraso:A(22700)},
      {tipo:'rotulo',p:[657,356],texto:'▲',classe:'terra',tam:.4,etapas:[0],atraso:A(22900)},
      {tipo:'rotulo',p:[664,336],texto:'▲',classe:'terra',tam:.4,etapas:[0],atraso:A(23100)},
      {tipo:'nota',p:[584,296],texto:'Pouca terra|fértil',tam:.12,etapas:[0],atraso:A(24500)},
      // Creta e Micenas
      {tipo:'cidade',p:CNOSSOS,nome:'Cnossos',lado:'c',tam:.12,etapas:[0],atraso:A(26500)},
      {tipo:'cidade',p:MICENAS,nome:'Micenas',lado:'d',tam:.12,etapas:[0],atraso:A(27500)},
      // povos que descem do norte
      {tipo:'etiqueta',p:[600,208],texto:'povos indo-europeus',tam:.13,etapas:[0],atraso:A(29500)},
      {tipo:'etiqueta',p:[606,226],texto:'eólios',tam:.11,etapas:[0],atraso:A(30500)},
      {tipo:'etiqueta',p:[638,226],texto:'dórios',tam:.11,etapas:[0],atraso:A(31200)},
      {tipo:'etiqueta',p:[672,226],texto:'jônios',tam:.11,etapas:[0],atraso:A(31900)},
      {tipo:'nota',p:[704,196],texto:'invasão dórica: explicação|tradicional; hoje se fala|numa crise geral do|Mediterrâneo por volta|de 1200 a.C.',tam:.1,etapas:[0],atraso:A(33500)},

      // ===== etapa 2: dos genos às pólis
      {tipo:'regiao',terra:true,pts:T_ATICA,suave:false,cor:'#e8573a',opac:.75,etapas:[1],atraso:A(16500)},
      {tipo:'regiao',terra:true,pts:T_LACONIA,suave:false,cor:'#2f77b5',opac:.7,etapas:[1],atraso:A(17000)},
      {tipo:'regiao',terra:true,pts:T_CORINTO,suave:false,cor:'#e9c46a',opac:.85,etapas:[1],atraso:A(17500)},
      {tipo:'regiao',terra:true,pts:T_BEOCIA,suave:false,cor:'#1fa39a',opac:.7,etapas:[1],atraso:A(18000)},
      {tipo:'regiao',terra:true,pts:T_ELIDA,suave:false,cor:'#b5532b',opac:.7,etapas:[1],atraso:A(18500)},
      {tipo:'cidade',p:ATENAS,nome:'Atenas',capital:true,lado:'d',tam:.12,etapas:[1],atraso:A(17000)},
      {tipo:'cidade',p:ESPARTA,nome:'Esparta',capital:true,lado:'d',tam:.12,etapas:[1],atraso:A(17800)},
      {tipo:'cidade',p:CORINTO,nome:'Corinto',lado:'e',tam:.11,etapas:[1],atraso:A(18300)},
      {tipo:'cidade',p:TEBAS,nome:'Tebas',lado:'e',tam:.11,etapas:[1],atraso:A(18800)},
      {tipo:'cidade',p:OLIMPIA,nome:'Olímpia',lado:'e',tam:.11,etapas:[1],atraso:A(19300)},
      // colonização
      {tipo:'regiao',terra:true,estilo:'listra',pts:MAGNA,suave:false,etapas:[1],atraso:A(33000)},
      {tipo:'regiao',terra:true,estilo:'listra',pts:SICILIA,suave:false,etapas:[1],atraso:A(33300)},
      {tipo:'rota',largura:3,pts:R_NEGRO,suave:false,movel:'barco',volta:9000,dur:3,tam:.28,etapas:[1],atraso:A(25000)},
      {tipo:'rota',largura:3,pts:R_SINOPE,suave:false,dur:1.6,etapas:[1],atraso:A(28500)},
      {tipo:'rota',largura:3,pts:R_TREBIZ,suave:false,dur:1.2,etapas:[1],atraso:A(29500)},
      {tipo:'rota',largura:3,pts:R_PANTI,suave:false,dur:1.6,etapas:[1],atraso:A(28500)},
      {tipo:'rota',largura:3,pts:R_MILETO,suave:false,movel:'barco',volta:6000,dur:1.6,tam:.28,etapas:[1],atraso:A(26500)},
      {tipo:'rota',largura:3,pts:R_ITALIA,suave:false,movel:'barco',volta:8000,dur:2.4,tam:.28,etapas:[1],atraso:A(31500)},
      {tipo:'rota',largura:3,pts:R_SICILIA,suave:false,dur:2,etapas:[1],atraso:A(32500)},
      {tipo:'cidade',p:OLBIA,nome:'Olbia',lado:'d',tam:.12,etapas:[1],atraso:A(28000)},
      {tipo:'cidade',p:QUERSONESO,nome:'Quersoneso',lado:'c',tam:.12,etapas:[1],atraso:A(29000)},
      {tipo:'cidade',p:PANTICAPEU,nome:'Panticapeu',lado:'c',tam:.12,etapas:[1],atraso:A(30000)},
      {tipo:'cidade',p:SINOPE,nome:'Sinope',lado:'c',tam:.12,etapas:[1],atraso:A(30500)},
      {tipo:'cidade',p:TREBIZONDA,nome:'Trebizonda',lado:'c',tam:.12,etapas:[1],atraso:A(31000)},
      {tipo:'cidade',p:BIZANCIO,nome:'Bizâncio',lado:'e',tam:.11,etapas:[1],atraso:A(28800)},
      {tipo:'cidade',p:MILETO,nome:'Mileto',lado:'c',tam:.12,etapas:[1],atraso:A(28000)},
      {tipo:'cidade',p:CUMAS,nome:'Cumas',lado:'e',tam:.12,etapas:[1],atraso:A(34000)},
      {tipo:'cidade',p:TARENTO,nome:'Tarento',lado:'e',tam:.12,etapas:[1],atraso:A(34300)},
      {tipo:'cidade',p:CROTONE,nome:'Crotone',lado:'d',tam:.12,etapas:[1],atraso:A(34600)},
      {tipo:'cidade',p:SIRACUSA,nome:'Siracusa',lado:'d',tam:.12,etapas:[1],atraso:A(34900)},
      {tipo:'etiqueta',p:[774,300],texto:'Grécia Asiática',tam:.13,cor:'amarelo',etapas:[1],atraso:A(29000)},
      {tipo:'etiqueta',p:[496,300],texto:'Magna Grécia',tam:.14,cor:'amarelo',etapas:[1],atraso:A(35500)},
      {tipo:'etiqueta',p:[850,168],texto:'colônias do Mar Negro',tam:.13,cor:'amarelo',etapas:[1],atraso:A(30000)},
      {tipo:'nota',p:[580,380],texto:'Colônias mandavam cereais|e matérias-primas;|a pólis mandava manufaturas.',tam:.13,etapas:[1],atraso:A(37000)},

      // ===== etapa 3: Atenas
      {tipo:'regiao',terra:true,pts:T_ATICA,suave:false,cor:'#e8573a',opac:.8,etapas:[2],atraso:A(600)},
      {tipo:'cidade',p:ATENAS,nome:'Atenas',capital:true,lado:'d',tam:.2,etapas:[2],atraso:A(400)},

      // ===== etapa 6: Esparta
      {tipo:'regiao',terra:true,pts:PELOP,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(300)},
      {tipo:'regiao',terra:true,estilo:'listra',pts:MESSENIA,suave:false,etapas:[5],atraso:A(1200)},
      {tipo:'etiqueta',p:[666,368],texto:'terras dos hilotas',tam:.17,cor:'amarelo',etapas:[5],atraso:A(1800)},
      {tipo:'cidade',p:ESPARTA,nome:'Esparta',capital:true,lado:'d',tam:.2,etapas:[5],atraso:A(600)},
      {tipo:'cidade',p:ATENAS,nome:'Atenas',lado:'d',tam:.16,etapas:[5],atraso:A(400)},

      // ===== etapa 7: Guerras Médicas, Liga de Delos, Guerra do Peloponeso
      {tipo:'regiao',terra:true,ll:true,pts:IMPERIO,suave:false,cor:'#1fa39a',opac:.8,etapas:[6],atraso:A(1500),dura:A(9000)},
      {tipo:'etiqueta',ll:true,p:[50.5,32.2],texto:'Império Persa',cor:'amarelo',tam:.55,etapas:[6],atraso:A(2200),dura:A(8000)},
      {tipo:'rotulo',p:[690,296],texto:'Grécia',classe:'regiao',tam:.2,etapas:[6],atraso:A(1500),dura:A(8000)},
      {tipo:'cidade',p:MARATONA,nome:'Maratona',lado:'c',tam:.1,etapas:[6],atraso:A(10500)},
      {tipo:'cidade',p:TERMOPILAS,nome:'Termópilas',lado:'e',tam:.1,etapas:[6],atraso:A(16500)},
      {tipo:'cidade',p:SALAMINA,nome:'Salamina',lado:'c',tam:.1,etapas:[6],atraso:A(19500)},
      {tipo:'etiqueta',p:[754,336],texto:'Dario I, 490 a.C.',tam:.1,cor:'amarelo',etapas:[6],atraso:A(10800)},
      {tipo:'etiqueta',p:[710,238],texto:'Xerxes, 480 a.C.',tam:.1,cor:'amarelo',etapas:[6],atraso:A(14800)},
      // Liga de Delos
      {tipo:'cidade',p:DELOS,nome:'Delos',lado:'c',tam:.1,etapas:[6],atraso:A(23000)},
      {tipo:'rota',largura:3,pts:[DELOS,[728,320],[742,305],[737,292]],suave:false,dur:1.4,etapas:[6],atraso:A(24500),dura:A(7000)},
      {tipo:'rota',largura:3,pts:[DELOS,[736,333],[748,331],[757,330]],suave:false,dur:1.2,etapas:[6],atraso:A(24800),dura:A(7000)},
      {tipo:'rota',largura:3,pts:[DELOS,[728,350],[748,366],[766,372]],suave:false,dur:1.6,etapas:[6],atraso:A(25100),dura:A(7000)},
      {tipo:'rota',largura:3,pts:[[737,292],[722,305],[705,314],[690,320]],suave:false,dur:1.4,cor:'seta',etapas:[6],atraso:A(31000)},
      {tipo:'rota',largura:3,pts:[[757,330],[735,330],[712,326],[692,322]],suave:false,dur:1.2,cor:'seta',etapas:[6],atraso:A(31300)},
      {tipo:'rota',largura:3,pts:[[766,372],[748,358],[722,340],[694,326]],suave:false,dur:1.6,cor:'seta',etapas:[6],atraso:A(31600)},
      {tipo:'etiqueta',p:[702,368],texto:'tributo',tam:.12,cor:'amarelo',etapas:[6],atraso:A(33000)},
      {tipo:'etiqueta',p:[690,304],texto:'Liga de Delos, 478 a.C.',tam:.1,cor:'amarelo',etapas:[6],atraso:A(24000),dura:A(8000)},
      // duas ligas
      {tipo:'regiao',terra:true,pts:T_ATICA,suave:false,cor:'coral',opac:.9,etapas:[6],atraso:A(35000)},
      {tipo:'regiao',terra:true,pts:CICLADES,suave:false,cor:'coral',opac:.9,etapas:[6],atraso:A(35000)},
      {tipo:'regiao',terra:true,pts:LIGA_ATENAS,suave:false,cor:'coral',opac:.9,etapas:[6],atraso:A(35000)},
      {tipo:'regiao',terra:true,pts:LESBOS,suave:false,cor:'coral',opac:.9,etapas:[6],atraso:A(35000)},
      {tipo:'regiao',terra:true,pts:RODES,suave:false,cor:'coral',opac:.9,etapas:[6],atraso:A(35000)},
      {tipo:'regiao',terra:true,pts:PELOP,suave:false,cor:'#1d5f73',opac:.9,etapas:[6],atraso:A(36000)},
      {tipo:'regiao',terra:true,pts:LIGA_ESPARTA,suave:false,cor:'#1d5f73',opac:.9,etapas:[6],atraso:A(36000)},
      {tipo:'etiqueta',p:[618,298],texto:'Liga do Peloponeso: Esparta e aliados',tam:.1,cor:'petroleo',etapas:[6],atraso:A(36800)},
      {tipo:'etiqueta',p:[738,314],texto:'Liga de Delos: Atenas e aliados',tam:.1,cor:'coral',etapas:[6],atraso:A(36300)},
      {tipo:'cidade',p:ATENAS,nome:'Atenas',capital:true,lado:'d',tam:.12,etapas:[6],atraso:A(37000)},
      {tipo:'cidade',p:ESPARTA,nome:'Esparta',capital:true,lado:'d',tam:.12,etapas:[6],atraso:A(37000)},
      {tipo:'cidade',p:EGOS,nome:'Egos Pótamos',capital:true,lado:'e',tam:.14,etapas:[6],atraso:A(39500)},
      {tipo:'nota',p:[744,274],texto:'405 a.C.: a frota|ateniense é destruída',tam:.1,etapas:[6],atraso:A(40500)},

      // ===== etapa 8: Alexandre
      {tipo:'regiao',terra:true,ll:true,pts:IMPERIO,suave:false,cor:'#1fa39a',opac:.8,etapas:[7],atraso:A(600),dura:A(24000)},
      {tipo:'regiao',terra:true,pts:MACEDONIA,suave:false,cor:'coral',opac:1,mistura:false,etapas:[7],atraso:A(3000),dura:A(28000)},
      {tipo:'cidade',p:[690,262],nome:'Macedônia',lado:'d',tam:.22,etapas:[7],atraso:A(3500)},
      {tipo:'regiao',terra:true,ll:true,pts:ANATOLIA,suave:false,cor:'coral',opac:1,mistura:false,etapas:[7],atraso:A(8000),dura:A(23000)},
      {tipo:'regiao',terra:true,ll:true,pts:EGITO,suave:false,cor:'coral',opac:1,mistura:false,etapas:[7],atraso:A(12000),dura:A(19000)},
      {tipo:'regiao',terra:true,ll:true,pts:BAB,suave:false,cor:'coral',opac:1,mistura:false,etapas:[7],atraso:A(16000),dura:A(15000)},
      {tipo:'regiao',terra:true,ll:true,pts:IRA,suave:false,cor:'coral',opac:1,mistura:false,etapas:[7],atraso:A(20000),dura:A(11000)},
      // o império se parte em três reinos
      {tipo:'regiao',terra:true,pts:MACEDONIA,suave:false,cor:'#e8573a',opac:.9,mistura:false,etapas:[7],atraso:A(33000)},
      {tipo:'regiao',terra:true,ll:true,pts:EGITO,suave:false,cor:'#e9c46a',opac:.95,mistura:false,etapas:[7],atraso:A(33200)},
      {tipo:'regiao',terra:true,ll:true,pts:BAB,suave:false,cor:'#1d5f73',opac:.9,mistura:false,etapas:[7],atraso:A(33400)},
      {tipo:'regiao',terra:true,ll:true,pts:IRA,suave:false,cor:'#1d5f73',opac:.9,mistura:false,etapas:[7],atraso:A(33400)},
      {tipo:'regiao',terra:true,ll:true,pts:ANATOLIA,suave:false,cor:'#1d5f73',opac:.9,mistura:false,etapas:[7],atraso:A(33400)},
      {tipo:'rota',ll:true,pts:ALEX,suave:false,cor:'amarelo',largura:9,movel:'ponto',volta:14000,dur:20,tam:1.2,etapas:[7],atraso:A(4000)},
      {tipo:'etiqueta',ll:true,p:[27.0,41.6],texto:'334 a.C.',cor:'amarelo',tam:.4,etapas:[7],atraso:A(6500)},
      {tipo:'etiqueta',ll:true,p:[27.5,30.0],texto:'331 a.C.',cor:'amarelo',tam:.4,etapas:[7],atraso:A(13000)},
      {tipo:'etiqueta',ll:true,p:[44.6,34.4],texto:'331 a.C.',cor:'amarelo',tam:.4,etapas:[7],atraso:A(17500)},
      {tipo:'etiqueta',ll:true,p:[50.6,28.0],texto:'330 a.C.',cor:'amarelo',tam:.4,etapas:[7],atraso:A(21500)},
      {tipo:'cidade',ll:true,p:[29.9,31.2],nome:'Alexandria',capital:true,lado:'e',tam:.55,etapas:[7],atraso:A(12600)},
      {tipo:'cidade',ll:true,p:[47.9,30.8],nome:'Alexandria',lado:'d',tam:.4,etapas:[7],atraso:A(21000)},
      {tipo:'cidade',ll:true,p:[44.4,32.5],nome:'Babilônia',lado:'c',tam:.4,etapas:[7],atraso:A(17000)},
      {tipo:'cidade',ll:true,p:[52.9,29.9],nome:'Persépolis',lado:'e',tam:.4,etapas:[7],atraso:A(21200)},
      {tipo:'etiqueta',ll:true,p:[47.0,36.2],texto:'até o rio Indo',cor:'amarelo',tam:.55,etapas:[7],atraso:A(24000)},
      {tipo:'etiqueta',ll:true,p:[47.0,28.6],texto:'outras Alexandrias',tam:.38,etapas:[7],atraso:A(25000)},
      {tipo:'etiqueta',p:[672,244],texto:'Macedônia',tam:.4,etapas:[7],atraso:A(34000)},
      {tipo:'etiqueta',ll:true,p:[27.0,28.4],texto:'Egito',tam:.5,etapas:[7],atraso:A(34200)},
      {tipo:'etiqueta',ll:true,p:[42.0,33.4],texto:'Síria',tam:.55,etapas:[7],atraso:A(34400)}
    ]},
    {id:'tempo',tipo:'tempo',grande:true,x:MX,y:2420,w:3800,h:190,giro:.3,avisoEt:'0,1,2,3,4,5,6,7,8',aviso:'a régua não está em escala; o último marco é um salto no tempo',
     marcos:[
      {p:6,t:'cerca de 3200 a.C.',s:'escrita: começa a Antiguidade',etapa:0},
      {p:14,t:'2200 a 1200 a.C.',s:'cretenses e micênicos',etapa:0},
      {p:22,t:'século VIII a.C.',s:'pólis e colônias',etapa:1},
      {p:30,t:'594 a.C.',s:'Sólon',etapa:2},
      {p:38,t:'510 a.C.',s:'fim da tirania',etapa:2},
      {p:46,t:'508 a.C.',s:'Clístenes',etapa:2},
      {p:54,t:'século V a.C.',s:'século de Péricles',etapa:[3,4]},
      {p:62,t:'490 a 479 a.C.',s:'Guerras Médicas',cor:'petroleo',etapa:6},
      {p:70,t:'478 a.C.',s:'Liga de Delos',cor:'petroleo',etapa:6},
      {p:78,t:'431 a 404 a.C.',s:'Guerra do Peloponeso',cor:'petroleo',etapa:6},
      {p:86,t:'336 a 323 a.C.',s:'Alexandre',cor:'petroleo',etapa:7},
      {p:94,t:'476 d.C.',s:'fim da Antiguidade',etapa:8}]},
    {id:'et-ant',tipo:'etiqueta',x:1000,y:2650,w:1160,h:100,clicavel:false,texto:'Antiguidade: da escrita à queda de Roma, em 476 d.C.'},
    {id:'et-arc',tipo:'etiqueta',x:1560,y:2650,w:1060,h:100,clicavel:false,texto:'Período Arcaico, séculos VIII a VI a.C.'},
    {id:'et-roma',tipo:'etiqueta',x:4040,y:2650,w:520,h:100,clicavel:false,texto:'a Grécia aponta para Roma'},

    /* etapa 1: palácio de Cnossos, sobre o mar ao sul de Creta */
    {id:'pal',tipo:'icone',nome:'palacio-creta',fundo:false,x:Mb(714,396)[0]-105,y:Mb(714,396)[1]-175,w:210,h:210,giro:-3,atraso:A(26500),rotulo:'Recorte: planta de um palácio cretense, com o grande pátio'},
    {id:'et-pal',tipo:'etiqueta',x:Mb(714,396)[0]-150,y:Mb(714,396)[1]+55,w:300,h:70,clicavel:false,atraso:A(27500),texto:'palácio de Cnossos'},

    /* etapa 2: genos (à esquerda do mapa) e acrópole sobre Atenas */
    {id:'genos',tipo:'genos',x:60,y:80,w:900,h:760,giro:-.8,rotulo:'Esquema: famílias em volta de um campo único, que se divide em lotes; alguns ficam sem terra'},
    {id:'acro',tipo:'icone',nome:'acropole',fundo:false,x:Mb(687,318)[0]-95,y:Mb(687,318)[1]-165,w:150,h:150,giro:2,atraso:A(20500),rotulo:'Recorte: colina da acrópole com um templo no alto'},

    /* etapa 3: Atenas, a escada das reformas */
    {id:'escada',tipo:'escada',x:60,y:3000,w:1200,h:688,giro:.4,rotulo:'Escada com quatro degraus: rei, arcontes, leis escritas e Clístenes'},
    {id:'marco',tipo:'icone',nome:'marco-hipoteca',fundo:'amarelo',x:1330,y:3010,w:250,h:250,giro:-2,atraso:A(24000),rotulo:'Recorte: marco de pedra de uma terra hipotecada, riscado em vermelho, com a corrente partida'},
    {id:'n-sol1',tipo:'nota',x:1640,y:3050,w:600,giro:-1.2,atraso:A(26000),texto:'Só a escravidão por dívida de atenienses acabou. A de estrangeiros continuou.'},
    {id:'n-sol2',tipo:'nota',x:1640,y:3330,w:620,giro:1.2,atraso:A(32000),texto:'Sólon também deu a qualquer cidadão o direito de prestar queixa na justiça, até em nome de outro.'},

    /* etapa 4: democracia direta */
    {id:'org',tipo:'organograma',x:3000,y:3000,w:1040,h:688,giro:-.5,rotulo:'Organograma da democracia ateniense'},
    {id:'ost',tipo:'icone',nome:'ostraco',fundo:'coral',x:4180,y:3020,w:380,h:380,giro:3,atraso:A(15000),rotulo:'Recorte: óstraco, caco de cerâmica com um nome riscado'},
    {id:'et-ost',tipo:'etiqueta',x:4100,y:3430,w:540,h:96,clicavel:false,atraso:A(16500),texto:'ostracismo: dez anos fora'},
    {id:'et-iso1',tipo:'etiqueta',x:3000,y:3750,w:360,h:90,clicavel:false,atraso:A(24000),texto:'isonomia'},
    {id:'et-iso2',tipo:'etiqueta',x:3420,y:3750,w:360,h:90,clicavel:false,atraso:A(25200),texto:'isegoria'},
    {id:'et-iso3',tipo:'etiqueta',x:3000,y:3870,w:800,h:130,clicavel:false,atraso:A(26400),texto:'isocracia: igualdade de acesso aos cargos'},
    {id:'n-livre',tipo:'nota',x:4130,y:3600,w:600,giro:1.3,atraso:A(30000),texto:'Ser livre e ter tempo livre era condição para participar. Esse tempo vinha do trabalho escravo.'},

    /* etapa 5: quem ficava de fora */
    {id:'bon',tipo:'bonecos',x:5600,y:3000,w:1250,h:690,giro:.4,rotulo:'Gráfico de bonequinhos: de 31 pessoas, só 4 eram cidadãos'},
    {id:'et-cid',tipo:'etiqueta',x:5640,y:3350,w:320,h:90,clicavel:false,atraso:A(5500),texto:'cidadãos'},
    {id:'et-mul',tipo:'etiqueta',x:6560,y:3100,w:420,h:130,clicavel:false,atraso:A(10500),texto:'mulheres e crianças'},
    {id:'et-met',tipo:'etiqueta',x:6560,y:3300,w:300,h:90,clicavel:false,atraso:A(11500),texto:'metecos'},
    {id:'et-esc',tipo:'etiqueta',x:6560,y:3490,w:300,h:90,clicavel:false,atraso:A(12500),texto:'escravos'},
    {id:'hid',tipo:'foto',img:'historia-grecia-hidria',x:7240,y:3000,w:640,h:478,giro:-1.5,fita:{x:30,g:-4},atraso:A(20000),rotulo:'Hídria ática de figuras negras, com mulheres buscando água numa fonte'},
    {id:'et-cer',tipo:'etiqueta',x:7200,y:3560,w:720,h:150,clicavel:false,atraso:A(24500),texto:'a cerâmica também é fonte histórica: mostra o cotidiano e os mitos'},
    {id:'n-fun',tipo:'nota',x:7200,y:3770,w:720,giro:1,atraso:A(27500),texto:'Escravos, segundo Funari: cerca de 30 mil nas minas de prata, 25 mil no campo e 73 mil nas cidades.'},
    {id:'n-hoje',tipo:'nota',x:5640,y:3830,w:900,giro:-1,atraso:A(30500),texto:'Hoje a democracia é representativa: elegemos quem decide, e votam homens e mulheres a partir de 16 anos.'},
    {id:'doc',tipo:'fonte',grande:true,x:8180,y:3000,w:700,h:900,giro:1,rotulo:'Fonte histórica: oração fúnebre de Péricles, em Tucídides',
     texto:'“Nossa constituição não copia as leis dos vizinhos; somos antes um modelo para os outros. Ela se chama democracia porque o governo está nas mãos da maioria, e não de poucos. Nas questões privadas, a lei é igual para todos; na vida pública, cada um é preferido pelo mérito, e a pobreza não impede ninguém de servir à cidade.”',
     ref:'Tucídides, História da Guerra do Peloponeso, livro II, 37: oração fúnebre de Péricles, no inverno de 431 a 430 a.C. Paráfrase da equipe, a partir do grego e da tradução de Crawley (1874, domínio público).',
     resposta:'A imagem que a democracia ateniense fazia de si: ==governo da maioria==, igualdade diante da lei e participação dos pobres. Mas a "maioria" era a maioria dos cidadãos, cerca de 40 mil em cerca de 310 mil habitantes: o discurso cala sobre ==mulheres, metecos e escravos==. E é um discurso de guerra, feito para exaltar a cidade, que ==Tucídides reescreveu== à sua maneira.'},

    /* etapa 6: Esparta, à direita do mapa */
    {id:'pir',tipo:'piramide',x:5420,y:140,w:900,h:390,giro:.8,alturaCamada:84,rotulo:'Três camadas sociais de Esparta: espartanos, periecos e hilotas',
     camadas:[{t:'espartanos',s:'poucos'},{t:'periecos',s:'livres, sem direitos políticos'},{t:'hilotas',s:'a maioria, servos do Estado'}]},
    {id:'esc',tipo:'icone',nome:'escudo-hoplita',fundo:'petroleo',x:5460,y:700,w:360,h:360,giro:-3,atraso:A(15000),rotulo:'Recorte: escudo redondo de bronze de um hoplita'},
    {id:'et-hop',tipo:'etiqueta',x:5900,y:790,w:560,h:130,clicavel:false,atraso:A(16500),texto:'hoplita: soldado de infantaria'},
    {id:'n-xen',tipo:'nota',x:5460,y:1130,w:800,giro:1,atraso:A(25000),texto:'Xenofobia: desconfiança do estrangeiro. Mulher: gerar filhos fortes para o Estado.'},
    {id:'et-com',tipo:'etiqueta',x:5440,y:1400,w:900,h:140,clicavel:false,atraso:A(30000),texto:'Em comum com Atenas: língua, religião, autonomia e muitos escravos'},

    /* etapa 7: cofre da Liga de Delos, sobre a ilha */
    {id:'cofre',tipo:'icone',nome:'templo-apolo',fundo:false,x:Mb(718,332)[0]-50,y:Mb(718,332)[1]-40-50,w:100,h:100,giro:-2,atraso:A(23500),rotulo:'Recorte: templo de Apolo em Delos, onde ficava o tesouro da Liga'},

    /* etapa 8: nota do período helenístico, ao lado do mapa */
    {id:'n-helen',tipo:'nota',x:Mb(800,356)[0],y:Mb(800,356)[1],w:540,giro:1.2,atraso:A(35500),texto:'Helenístico: grego misturado com o oriental.'},

    /* etapa 9: cultura grega, mesa sem mapa */
    {id:'cap1',tipo:'icone',nome:'capitel-dorico',fundo:'coral',x:100,y:4720,w:380,h:380,giro:-2,rotulo:'Recorte: capitel dórico'},
    {id:'cap2',tipo:'icone',nome:'capitel-jonico',fundo:'amarelo',x:520,y:4720,w:380,h:380,giro:1.5,atraso:A(2200),rotulo:'Recorte: capitel jônico, com volutas'},
    {id:'cap3',tipo:'icone',nome:'capitel-corintio',fundo:'petroleo',x:940,y:4720,w:380,h:380,giro:-1.5,atraso:A(4200),rotulo:'Recorte: capitel coríntio, com folhas de acanto'},
    {id:'et-dor',tipo:'etiqueta',x:70,y:5130,w:440,h:96,clicavel:false,atraso:A(900),texto:'dórico (simples)'},
    {id:'et-jon',tipo:'etiqueta',x:490,y:5130,w:440,h:96,clicavel:false,atraso:A(3000),texto:'jônico (volutas)'},
    {id:'et-cor',tipo:'etiqueta',x:910,y:5130,w:440,h:96,clicavel:false,atraso:A(5000),texto:'coríntio (folhas)'},
    {id:'et-par',tipo:'etiqueta',x:70,y:5330,w:520,h:96,clicavel:false,atraso:A(9000),texto:'Partenon, Atenas'},
    {id:'mt',tipo:'icone',nome:'mascara-tragica',fundo:'petroleo',x:1560,y:4720,w:380,h:380,giro:-2,atraso:A(12000),rotulo:'Recorte: máscara de teatro trágica'},
    {id:'mc',tipo:'icone',nome:'mascara-comica',fundo:'amarelo',x:2120,y:4720,w:380,h:380,giro:2,atraso:A(15500),rotulo:'Recorte: máscara de teatro cômica'},
    {id:'et-esq',tipo:'etiqueta',x:1470,y:5130,w:560,h:150,clicavel:false,atraso:A(13000),texto:'Ésquilo, pai da tragédia: Prometeu acorrentado, Sete contra Tebas'},
    {id:'et-sof',tipo:'etiqueta',x:1500,y:5300,w:500,h:110,clicavel:false,atraso:A(14200),texto:'Sófocles: Édipo Rei, Antígona'},
    {id:'et-ari',tipo:'etiqueta',x:2060,y:5130,w:520,h:150,clicavel:false,atraso:A(16500),texto:'Aristófanes, comédias: As rãs, As nuvens'},
    {id:'rolo',tipo:'icone',nome:'rolo-colunas',fundo:'amarelo',x:2860,y:4720,w:360,h:360,giro:1.5,atraso:A(19500),rotulo:'Recorte: rolo de pergaminho com os poemas de Homero'},
    {id:'et-ili',tipo:'etiqueta',x:2690,y:5120,w:700,h:96,clicavel:false,atraso:A(20500),texto:'Ilíada: a Guerra de Troia'},
    {id:'et-odi',tipo:'etiqueta',x:2690,y:5240,w:700,h:96,clicavel:false,atraso:A(21500),texto:'Odisseia: a volta de Ulisses'},
    {id:'n-deu',tipo:'nota',x:3640,y:4740,w:760,giro:-1,atraso:A(24000),texto:'Deuses antropomórficos: com forma humana. Semideuses: filhos de deuses e humanos.'},
    {id:'n-fil',tipo:'nota',x:3640,y:5020,w:760,giro:1,atraso:A(26500),texto:'Filosofia: Sócrates, Platão e Aristóteles. História: Heródoto e Tucídides.'}
  ],

  etapas:[
    {titulo:'Montanhas, mar e palácios',mostra:['mapa','tempo'],so:['pal','et-pal','et-ant'],
     foco:[1000,0,4128,2304],focoM:[1000,0,4128,2304],
     tomadas:[[2800,FB(688,342,200)],[20500,FB(652,300,180)],[25500,FB(706,385,120)],[28500,FB(660,262,150)],[39500,TL(0,1300)]],
     tomadasM:[[2800,FM(660,318,96)],[16000,FM(712,380,96)],[20500,FM(645,298,80)],[25500,FM(698,420,84)],[28800,FM(660,246,84)],[39500,TL(30,700)]],tempo:42000,
     tracos:[
       {tipo:'circulo',peca:'mapa',x:PCT(641,292)[0],y:PCT(641,292)[1],w:2.4,h:7,espessura:4,atraso:A(24000)},
       {tipo:'seta',de:Mb(618,252),para:Mb(628,282),espessura:5,ponta:20,curva:.1,atraso:A(31000)},
       {tipo:'seta',de:Mb(650,252),para:Mb(656,326),espessura:5,ponta:20,curva:.08,atraso:A(31800)},
       {tipo:'seta',de:Mb(684,252),para:Mb(693,304),espessura:5,ponta:20,curva:.1,atraso:A(32500)}],
     texto:TEXTO[0]},
    {titulo:'Dos genos às pólis',so:['genos','acro','et-arc'],
     foco:[20,20,980,860],focoM:[20,40,980,820],
     tomadas:[[15000,FB(660,310,150)],[24000,FB(660,300,320)],[37000,FB(660,262,230)],[44000,TL(300,1300)]],
     tomadasM:[[15000,FM(670,320,80)],[24000,FM(740,260,160)],[30500,FM(838,170,190)],[34000,FM(540,290,170)],[44000,TL(636,700)]],tempo:50000,
     tracos:[],
     texto:TEXTO[1]},
    {titulo:'Atenas: das leis escritas a Clístenes',so:['escada','marco','n-sol1','n-sol2'],
     foco:FB(690,322,170),focoM:FM(692,322,95),
     tomadas:[[6000,[20,2960,1300,740]],[20500,[620,2980,660,540]],[27000,[1320,2990,940,460]],[33500,[1320,3280,940,400]],[41000,TL(900,1300)]],
     tomadasM:[[6000,[60,3300,620,520]],[12000,[360,3200,620,520]],[19000,[640,3100,620,520]],[23500,[940,3120,360,320]],[27000,[1330,2990,900,560]],[33500,[1630,3290,620,360]],[41000,TL(1244,700)]],tempo:46000,
     tracos:[{tipo:'seta',de:{peca:'marco',x:96,y:40},para:{peca:'n-sol1',x:0,y:50},cor:'seta',espessura:6,curva:-.3,atraso:A(26500)}],
     texto:TEXTO[2]},
    {titulo:'Democracia direta, sem representantes',so:['org','ost','et-ost','et-iso1','et-iso2','et-iso3','n-livre'],
     foco:[2970,2970,1120,730],focoM:[3000,3000,860,700],
     tomadas:[[9000,[2970,2970,1120,730]],[13500,[4080,2990,720,580]],[21500,[2970,3720,860,320]],[28500,[4090,3560,720,260]],[40500,TL(1500,1300)]],
     tomadasM:[[5000,[3000,3000,860,700]],[9500,[3380,3000,700,420]],[13500,[4140,3000,480,440]],[18000,[4080,3410,600,160]],[22000,[2970,3730,830,280]],[29500,[4100,3580,660,260]],[40500,TL(1548,700)]],tempo:46000,
     tracos:[{tipo:'circulo',peca:'ost',x:50,y:53,w:78,h:44,atraso:A(16000)}],
     texto:TEXTO[3]},
    {titulo:'Quem ficava de fora',so:['bon','et-cid','et-mul','et-met','et-esc','hid','et-cer','n-fun','n-hoje','doc'],fonte:'doc',
     foco:[5560,2970,1540,800],focoM:[5580,2990,700,720],
     tomadas:[[19500,[7140,2980,860,640]],[26500,[7140,3540,960,440]],[30000,[5600,3760,1020,200]],[38000,[8100,2960,840,980]]],
     tomadasM:[[4000,[5580,2990,700,720]],[10000,[6180,3080,850,700]],[19500,[7200,2990,740,560]],[24000,[7190,3000,780,760]],[27000,[7180,3750,760,260]],[30000,[5600,3800,940,200]],[38000,[8120,2980,760,940]]],tempo:46000,
     tracos:[{tipo:'circulo',peca:'bon',x:16.2,y:30,w:21,h:37,espessura:4,atraso:A(5000)},
             {tipo:'circulo',peca:'hid',x:51,y:60,w:42,h:54,cor:'seta',atraso:A(22000)},
             {tipo:'seta',de:{peca:'hid',x:30,y:92},para:{peca:'et-cer',x:30,y:0},curva:.2,atraso:A(23500)}],
     texto:TEXTO[4]},
    {titulo:'Esparta, a cidade em armas',so:['pir','esc','et-hop','n-xen','et-com'],
     foco:FB(662,346,150),focoM:FM(668,344,86),
     tomadas:[[11000,[5380,100,1000,520]],[14000,[5400,640,1100,460]],[24500,[5420,1100,900,180]],[29500,[5400,1370,980,220]]],
     tomadasM:[[11000,[5380,120,980,440]],[18000,[5440,690,760,400]],[24500,[5440,1110,860,180]],[29500,[5420,1380,940,180]]],tempo:46000,
     tracos:[{tipo:'circulo',peca:'pir',x:50,y:106,w:104,h:32,cor:'seta',atraso:A(13500)}],
     texto:TEXTO[5]},
    {titulo:'Gregos contra persas, gregos contra gregos',so:['cofre'],
     foco:FB(850,326,520),focoM:FM(850,300,330),
     tomadas:[[9500,FB(690,302,130)],[22000,FB(712,308,170)],[34000,FB(700,318,190)],[39000,FB(715,295,110)],[46000,TL(2100,1300)]],
     tomadasM:[[9500,FM(690,306,66)],[15500,FM(690,290,86)],[22000,FM(730,320,72)],[30000,FM(730,326,80)],[34500,FM(690,318,70)],[39000,FM(730,282,70)],[46000,TL(2460,700)]],tempo:48000,
     tracos:[
       {tipo:'seta',de:Mb(763,326),para:Mb(704,318),cor:'seta',espessura:6,ponta:22,curva:.12,atraso:A(10000)},
       {tipo:'seta',de:Mb(740,262),para:Mb(668,294),cor:'seta',espessura:6,ponta:22,curva:.14,atraso:A(14500)},
       {tipo:'seta',de:Mb(664,299),para:Mb(676,314),cor:'seta',espessura:6,ponta:22,curva:.12,atraso:A(18000)}],
     texto:TEXTO[6]},
    {titulo:'Alexandre leva a Grécia ao Oriente',so:['n-helen'],
     foco:FB(860,300,660),focoM:FM(830,300,440),
     tomadas:[[5000,FB(790,300,420)],[12500,FB(900,330,400)],[19000,FB(1010,322,520)],[30000,FB(870,300,640)],[34500,FB(805,296,440)],[38500,FB(805,380,600,3.4)],[43000,TL(2700,1300)]],
     tomadasM:[[5000,FM(760,280,300)],[12500,FM(880,330,240)],[19500,FM(1012,322,300)],[30500,FM(870,300,440)],[34500,FM(790,296,300)],[43000,TL(3068,700)]],tempo:44000,
     tracos:[],
     texto:TEXTO[7]},
    {titulo:'Uma cultura que chegou até nós',mostra:[],so:['cap1','cap2','cap3','et-dor','et-jon','et-cor','et-par','mt','mc','et-esq','et-sof','et-ari','rolo','et-ili','et-odi','n-deu','n-fil','et-roma','doc'],fonte:'doc',
     foco:[40,4670,1340,820],focoM:[60,4690,560,540],
     tomadas:[[11500,[1420,4670,1200,820]],[18500,[2640,4670,780,640]],[23500,[3600,4700,860,600]],[30500,TL(2900,1300)],[40000,[8100,2960,840,980]]],
     tomadasM:[[2500,[80,4700,440,440]],[7500,[500,4700,440,440]],[12000,[920,4700,440,440]],[16000,[40,5310,640,200]],[20000,[1500,4700,540,640]],[26000,[2080,4700,540,640]],[30500,[2760,4700,520,600]],[36000,[3620,4720,800,300]],[39500,[3620,5000,800,300]],[42000,TL(3068,700)],[47500,[8120,2980,760,940]]],tempo:50000,
     tracos:[{tipo:'circulo',peca:'cap1',x:50,y:42,w:62,h:50,atraso:A(8000)},
             {tipo:'seta',de:{peca:'cap1',x:60,y:92},para:{peca:'et-par',x:40,y:0},curva:.2,atraso:A(9000)}],
     texto:TEXTO[8]}
  ]
});
})();
