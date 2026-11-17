/* Módulo 1, tópico 3: Egito antigo. Roteiro revisado: docs/revisao-historia/m01-t03-egito.md
   Coordenadas do mapa em pixels da base historia-egito-mapa (1152 x 928). Formato: docs/historia/MOTOR.md
   Mesa em zonas: Nilo e mapa (topo esquerdo), fita do tempo e pirâmide social (embaixo), julgamento (topo direito), Aton (meio direito), Kush (embaixo direito). */
(function(){
const A=n=>Colagem.reduz?0:n;                      // atrasos só com movimento
const NILO=[[800,910],[796,870],[800,830],[797,790],[774,750],[770,710],[745,670],[694,630],[662,590],[624,550],[600,510],[594,470],[590,430],[600,390],[616,350],[630,310],[637,270],[634,245]];
const DELTA_O=[[634,245],[606,190],[584,146],[558,108]];
const DELTA_L=[[634,245],[668,196],[700,165],[729,135]];
const S=Colagem.suave;
const RIO=S(NILO)+' '+S(DELTA_O)+' '+S(DELTA_L);
const BAIXO=[[478,172],[560,104],[700,98],[762,146],[644,262],[622,262]];

Colagem.montar({
  modulo:'Módulo 1: Pré-História e Antiguidade',
  titulo:'Egito antigo',
  subtitulo:'O rio, o faraó e quem trabalhava a terra',
  credito:'Fotos: reconstruções geradas por IA a partir de fontes arqueológicas. Recortes, esquemas e mapa desenhados pelo LAB.',
  ritmo:10000,
  celularGrande:true,
  msPalavra:250,
  mesa:{w:3400,h:2700},
  jornal:[[1080,20,420,46,1],[40,980,300,30,-2]],
  enem:"O ENEM costuma relacionar o **Nilo**, a agricultura e o poder do Estado, muitas vezes comparando com a Mesopotâmia. Usa imagens de pinturas e textos, como o Livro dos Mortos, para cobrar a **religião** e a **vida após a morte**. Também valoriza o Egito como civilização **africana**, ligada à Núbia, em diálogo com o ensino de história da África.\n\nPegadinhas:\n- Dizer que as pirâmides foram feitas por escravos.\n- Confundir o faraó, deus vivo, com o rei mesopotâmico, representante dos deuses.\n- Achar que Akhenaton \"inventou o monoteísmo\" ou que inspirou os hebreus, o que não tem prova.\n- Tratar \"o Egito é uma dádiva do Nilo\" como verdade absoluta, esquecendo o trabalho humano por trás das cheias.\n- Apresentar o Egito como se não fizesse parte da África.",
  estudo:[
  {
    "titulo": "O Nilo e a vida no deserto",
    "texto": "O Egito antigo se formou no nordeste da **África**, numa faixa estreita de terra fértil ao longo do **Nilo**, cercada de deserto. Todo ano, as chuvas de verão nas montanhas da Etiópia faziam o rio encher entre julho e outubro. Quando as águas baixavam, ficava o **limo**, uma lama escura e fértil, onde se plantava. Os egípcios chamavam sua terra de Kemet, a terra negra.\n\nA cheia era mais previsível que a dos rios da Mesopotâmia, mas variava: cheia fraca trazia fome; cheia forte demais destruía aldeias. Por isso, foi preciso construir canais e diques, medir o rio nos **nilômetros** e organizar um **calendário** de 365 dias, com três estações. O deserto protegia o país de invasões, o que ajuda a explicar a longa continuidade da civilização egípcia."
  },
  {
    "titulo": "Unificação e periodização",
    "texto": "No início, havia várias comunidades independentes, chamadas pelos livros de **nomos**. Elas formaram dois reinos, o Alto Egito, no sul, e o Baixo Egito, no delta. Por volta de 3100 a.C., **Menés**, provavelmente o mesmo rei chamado Narmer, unificou os dois. Começou a era dos **faraós**, dividida em:\n- **Antigo Império** (cerca de 2700 a 2200 a.C.): capital em Mênfis e construção das grandes pirâmides.\n- **Médio Império** (cerca de 2050 a 1650 a.C.): reorganização, obras de irrigação e expansão para a Núbia. Termina com a dominação dos hicsos, vindos do Oriente Próximo.\n- **Novo Império** (cerca de 1550 a 1070 a.C.): expulsão dos hicsos, conquistas militares e grandes templos em Tebas.\nEntre esses períodos houve fases de crise e divisão, chamadas de períodos intermediários."
  },
  {
    "titulo": "O faraó e a sociedade",
    "texto": "O Egito era uma **teocracia**: o **faraó** era considerado um **deus vivo**, filho de Rá e encarnação de Hórus. Diferentemente do rei mesopotâmico, que governava em nome dos deuses, ele mesmo era divino. Sua tarefa era manter a **maat**, a ordem do universo. Para governar, contava com o vizir, os sacerdotes, os escribas e os governadores das províncias.\n\nA sociedade tinha forma de pirâmide: no topo, o faraó e sua família; abaixo, sacerdotes, nobres e altos funcionários; depois, os **escribas**, essenciais à administração; mais abaixo, artesãos e comerciantes; e, na base, a grande maioria de **camponeses**. Havia escravos, sobretudo prisioneiros de guerra, mas em número pequeno.\n\nAs **mulheres** tinham uma posição de destaque para a Antiguidade: podiam possuir bens, fazer contratos, herdar e pedir divórcio. Algumas governaram, como **Hatshepsut**, no Novo Império. Isso não significa igualdade total, porque o poder político era sobretudo masculino. **Cleópatra VII**, de família macedônica, foi a última governante do Egito antes da conquista romana, em 30 a.C."
  },
  {
    "titulo": "Economia e trabalho",
    "texto": "A base da economia era a **agricultura**: trigo, cevada, linho e papiro. Os camponeses pagavam **impostos** em produtos, calculados conforme a cheia, e prestavam a **corveia**, trabalho obrigatório em obras públicas. O Estado armazenava grãos e os redistribuía como rações. Esse sistema é chamado nos livros de **servidão coletiva** e ligado ao **modo de produção asiático**: as comunidades deviam tributo ao Estado, dono da terra em teoria. Havia também comércio com a Núbia, de onde vinha o ouro, e com o Levante, de onde vinha a madeira.\n\nAs **pirâmides** de Gizé, do Antigo Império, eram túmulos reais. A arqueologia derrubou o mito dos escravos acorrentados: elas foram erguidas por **camponeses em turnos** e por artesãos especializados, alimentados pelo Estado. Uma vila de trabalhadores e seus túmulos foram encontrados ali perto. Em cerca de 1157 a.C., artesãos das tumbas reais pararam o trabalho porque as rações atrasaram, a primeira greve registrada da história."
  },
  {
    "titulo": "Religião, escrita e saber",
    "texto": "A religião era **politeísta**, com deuses como **Rá**, o Sol, **Osíris**, senhor dos mortos, **Hórus**, protetor do faraó, e **Anúbis**, ligado aos rituais funerários. A crença na **vida após a morte** explica a **mumificação**, os túmulos e o **Livro dos Mortos**, conjunto de orações escritas em papiro. No julgamento final, o coração do morto era pesado contra a pena da verdade.\n\nPor volta de 1350 a.C., **Amenófis IV** tentou impor o culto quase exclusivo a **Aton**, o disco solar. Mudou o nome para Akhenaton e transferiu a capital para Amarna, enfraquecendo os sacerdotes de Amon. Depois de sua morte, o politeísmo voltou. É a tentativa de **monoteísmo** citada nos livros, embora os historiadores discutam se foi um monoteísmo completo.\n\nNa escrita, os egípcios usaram os **hieróglifos**, além do hierático e do demótico. Destacaram-se na **medicina**, registrada em papiros médicos, na **arquitetura**, na **escultura**, na **pintura**, na matemática aplicada às obras e na **astronomia**."
  },
  {
    "titulo": "Um Egito africano: Kush e o fim dos faraós",
    "texto": "O Egito mantinha relações intensas com **Kush**, na Núbia, ao sul. Em cerca de 728 a.C., os kushitas conquistaram o Egito e governaram como faraós da **25ª dinastia**, até serem expulsos pelos assírios. Kush continuou forte em Meroé. O Egito foi conquistado pelos **persas** em 525 a.C., depois por Alexandre, em 332 a.C., e por Roma, em 30 a.C."
  }
],
  resumo:[
  "O Nilo e suas cheias tornaram possível a agricultura num país cercado de deserto.",
  "Menés unificou o Alto e o Baixo Egito por volta de 3100 a.C.",
  "Antigo, Médio e Novo Império, com períodos de crise entre eles.",
  "Teocracia: o faraó era um deus vivo, diferente do rei mesopotâmico.",
  "Servidão coletiva e corveia: impostos em produtos e trabalho obrigatório.",
  "As pirâmides foram construídas por camponeses em turnos e artesãos, não por escravos.",
  "Religião politeísta, vida após a morte, mumificação e reforma de Amenófis IV.",
  "Mulheres com direitos raros na Antiguidade; Hatshepsut governou.",
  "Kush, na Núbia, governou o Egito na 25ª dinastia; os persas conquistaram o Egito em 525 a.C."
],
  urca:"Não há ligação histórica direta entre o Egito antigo e o Ceará, então o tema se estuda do mesmo jeito que para o ENEM. Vale reforçar três pontos: a relação entre rio, agricultura e Estado; a teocracia do faraó; e o Egito como civilização africana. Esse último ponto ganhou força nas escolas brasileiras desde a Lei 10.639, de 2003, que tornou obrigatório o ensino de história e cultura africana e afro-brasileira.",

  pecas:[
    {id:'mapa',tipo:'mapa',base:'historia-egito-mapa',x:60,y:60,w:800,h:644,giro:-2,rotulo:'Mapa do Egito antigo',
     camadas:[
      {tipo:'rotulo',p:[150,70],texto:'Mar Mediterrâneo',classe:'mar',atraso:0},
      {tipo:'rotulo',p:[905,560],texto:'Mar Vermelho',classe:'mar',giro:58,atraso:0},
      {tipo:'rotulo',p:[870,250],texto:'Sinai',classe:'terra',atraso:0},
      {tipo:'rotulo',p:[200,470],texto:'Deserto Ocidental',classe:'regiao',etapas:[0],atraso:A(1000)},
      {tipo:'rotulo',p:[760,420],texto:'Deserto Oriental',classe:'regiao',giro:62,etapas:[0],atraso:A(1300)},
      {tipo:'pulso',d:RIO,largura:46,etapas:[0],atraso:A(4500)},
      {tipo:'corredor',pts:NILO,largura:120,corte:[0,262,1152,700],desde:2,atraso:300},
      {tipo:'regiao',pts:BAIXO,suave:false,estilo:'listra',etapas:[2],atraso:A(2600),dura:1900},
      {tipo:'regiao',pts:BAIXO,suave:false,desde:2,atraso:A(4600)},
      {tipo:'rota',estilo:'rio',d:RIO,dur:2,atraso:300},
      {tipo:'rota',pts:NILO,invisivel:true,movel:'barco',volta:16000,desde:0,atraso:A(2500)},
      {tipo:'cidade',p:[628,272],nome:'Mênfis, a capital',capital:true,desde:0,atraso:A(2800)},
      {tipo:'cidade',p:[772,715],nome:'Tebas',lado:'e',desde:2,ate:6,atraso:1000},
      {tipo:'cidade',p:[798,882],nome:'Assuã',desde:2,atraso:1200},
      {tipo:'etiqueta',p:[300,560],texto:'Kemet, a terra negra',sub:'faixa de limo fértil',tam:1.15,etapas:[0],atraso:A(7500)},
      {tipo:'etiqueta',p:[250,380],texto:'comunidades independentes',sub:'que os livros chamam de nomos',tam:1.15,etapas:[2],atraso:A(300),dura:2500},
      {tipo:'etiqueta',p:[250,150],texto:'Baixo Egito',etapas:[2],atraso:A(2800),dura:1700},
      {tipo:'etiqueta',p:[330,620],texto:'Alto Egito',etapas:[2],atraso:A(2900),dura:1600},
      {tipo:'etiqueta',p:[250,380],texto:'Um só reino',sub:'cerca de 3100 a.C.',cor:'amarelo',etapas:[2],atraso:A(5200)},
      {tipo:'rota',pts:NILO,largura:6,movel:'barco',volta:8000,dur:2.4,etapas:[5],atraso:A(9600)},
      // etapa 8: a capital muda de Tebas para Amarna e volta
      {tipo:'cidade',p:[772,715],nome:'Tebas',sub:'Karnak e Luxor',capital:true,lado:'e',etapas:[7],atraso:A(600),dura:A(2800)},
      {tipo:'cidade',p:[600,495],nome:'Amarna',sub:'cerca de 1350 a.C.',capital:true,lado:'e',etapas:[7],atraso:A(3600),dura:A(3800)},
      {tipo:'cidade',p:[772,715],nome:'Tebas',sub:'de volta, logo depois',capital:true,lado:'e',etapas:[7],atraso:A(8000)}
     ]},
    {id:'nilo',tipo:'foto',img:'historia-egito-nilo',x:900,y:80,w:600,h:338,giro:1.5,rotulo:'Foto recriada: camponeses e escriba na margem do Nilo'},
    {id:'pir',tipo:'foto',img:'historia-egito-piramide',x:930,y:470,w:600,h:338,giro:-1.8,fita:{x:12,g:3},rotulo:'Foto recriada: obra de uma pirâmide'},
    {id:'doc',tipo:'fonte',x:150,y:740,w:560,h:330,giro:-1,rotulo:'Fonte histórica: Heródoto',
     texto:'“O Egito para onde os gregos navegam é uma terra que os egípcios ganharam: foi acrescentada pelo rio, um presente dele.”',
     ref:'Heródoto, Histórias, livro II, capítulo 5, cerca de 430 a.C. Paráfrase da equipe. Daí vem a frase famosa “o Egito é uma dádiva do Nilo”.',
     resposta:'Heródoto explica que a terra do delta foi formada pela ==lama trazida pelo rio==, que avançou sobre o mar. Hoje a frase é usada num sentido mais amplo: sem o Nilo e suas cheias, não haveria agricultura no Egito. É preciso **criticar a fonte**: Heródoto era grego, visitou o Egito mais de dois mil anos depois da unificação, e a frase faz parecer que tudo vinha de graça do rio. A riqueza também dependia de trabalho humano: canais, diques, calendário e cobrança de impostos.'},
    {id:'n-cheia',tipo:'nota',x:1260,y:150,w:340,giro:1.5,texto:'cheia fraca, fome; cheia forte demais, aldeias destruídas'},

    /* etapa 1: o rio e o nilômetro */
    {id:'nilom',tipo:'icone',nome:'nilometro',x:900,y:80,w:300,h:300,giro:-2,rotulo:'Recorte: nilômetro, escada de pedra que media o nível da cheia'},

    /* etapa 2: hieróglifos e escribas */
    {id:'cart',tipo:'icone',nome:'cartucho',x:920,y:470,w:260,h:260,giro:-2,rotulo:'Recorte: cartucho com hieróglifos de falcão, sol e água'},
    {id:'ros',tipo:'icone',nome:'roseta',x:1220,y:470,w:260,h:260,giro:2,rotulo:'Recorte: Pedra de Roseta, com três escritas'},
    {id:'et-ros',tipo:'etiqueta',x:1190,y:745,w:360,h:110,texto:'Pedra de Roseta, 196 a.C.',clicavel:false},
    {id:'et-hi',tipo:'etiqueta',x:1510,y:470,w:270,h:64,texto:'hieróglifos',clicavel:false},
    {id:'et-de',tipo:'etiqueta',x:1510,y:550,w:270,h:64,texto:'demótico',clicavel:false},
    {id:'et-gr',tipo:'etiqueta',x:1510,y:630,w:270,h:64,texto:'grego',clicavel:false},
    {id:'et-esc',tipo:'etiqueta',x:1560,y:190,w:250,h:64,texto:'escribas',clicavel:false},

    /* etapa 3: Menés e a fita do tempo */
    {id:'coroas',tipo:'icone',nome:'coroas',x:930,y:90,w:290,h:290,giro:-1.5,rotulo:'Recorte: coroa branca, coroa vermelha e coroa dupla'},
    {id:'narmer',tipo:'icone',nome:'narmer',x:1260,y:90,w:290,h:290,giro:2,rotulo:'Recorte em traço: Paleta de Narmer'},
    {id:'et-nar',tipo:'etiqueta',x:1260,y:400,w:300,h:64,texto:'Paleta de Narmer',clicavel:false},
    {id:'tempo',tipo:'tempo',x:100,y:1760,w:1800,h:110,giro:.4,
     marcos:[{p:5,t:'cerca de 3100 a.C.',etapa:2},{p:52.5,t:'cerca de 1479 a.C.',etapa:3},{p:81,t:'525 a.C.',cor:'petroleo',etapa:8},{p:95,t:'30 a.C.',cor:'petroleo',etapa:3}]},
    {id:'et-ai',tipo:'etiqueta',x:406,y:1890,w:270,h:64,texto:'Antigo Império',clicavel:false},
    {id:'et-mi',tipo:'etiqueta',x:748,y:1890,w:240,h:64,texto:'Médio Império',clicavel:false},
    {id:'et-ni',tipo:'etiqueta',x:1009,y:1890,w:260,h:64,texto:'Novo Império',clicavel:false},

    /* etapa 4: o faraó */
    {id:'soc',tipo:'piramide',x:100,y:1090,w:640,h:350,giro:-1,alturaCamada:80,rotulo:'Pirâmide social: faraó, vizir, sacerdotes e escribas, artesãos e camponeses',
     camadas:[{t:'Faraó'},{t:'Vizir'},{t:'Sacerdotes e escribas'},{t:'Artesãos e camponeses'}]},
    {id:'et-escr',tipo:'etiqueta',x:790,y:1330,w:360,h:64,texto:'escravos, à parte',clicavel:false},
    {id:'hat',tipo:'icone',nome:'hatshepsut',x:955,y:1480,w:180,h:180,giro:-3,rotulo:'Retrato em traço de Hatshepsut, cerca de 1479 a 1458 a.C.'},
    {id:'et-hat',tipo:'etiqueta',x:895,y:1670,w:300,h:60,texto:'Hatshepsut',clicavel:false},
    {id:'et-cle',tipo:'etiqueta',x:1640,y:1670,w:340,h:60,texto:'Cleópatra VII',clicavel:false},
    {id:'cle',tipo:'icone',nome:'cleopatra',x:1720,y:1480,w:180,h:180,giro:3,rotulo:'Retrato em traço de Cleópatra VII, 51 a 30 a.C.'},

    /* etapa 5: quem fazia a terra produzir */
    {id:'n3',tipo:'nota',x:880,y:450,w:260,giro:-1.5,texto:'O escriba anota a colheita e calcula o imposto'},
    {id:'n-imp',tipo:'nota',x:1190,y:450,w:300,giro:1.5,texto:'a cheia define o imposto'},
    {id:'et-serv',tipo:'etiqueta',x:900,y:650,w:340,h:64,texto:'servidão coletiva',clicavel:false},
    {id:'n-serv',tipo:'nota',x:1270,y:620,w:420,giro:-1,texto:'modelo dos livros, ligado ao modo de produção asiático; não é palavra egípcia'},

    /* etapa 6: as pirâmides */
    {id:'n4',tipo:'nota',x:1330,y:400,w:230,giro:2,texto:'Camponeses em turnos, pagos com pão e cerveja'},
    {id:'et-rac',tipo:'etiqueta',x:1290,y:830,w:240,h:64,texto:'rações',clicavel:false},
    {id:'n-greve',tipo:'nota',x:930,y:910,w:560,giro:-1,texto:'em cerca de 1157 a.C., artesãos das tumbas reais fizeram a primeira greve registrada, porque as rações atrasaram'},

    /* etapa 7: múmias e o julgamento do coração */
    {id:'julg',tipo:'foto',img:'historia-egito-julgamento',x:1900,y:100,w:640,h:357,giro:-1.2,fita:{x:10,g:-3},rotulo:'Foto recriada: pesagem do coração diante de Anúbis, Osíris e Thot'},
    {id:'et-an',tipo:'etiqueta',x:1900,y:500,w:200,h:64,texto:'Anúbis',clicavel:false},
    {id:'et-os',tipo:'etiqueta',x:2150,y:500,w:200,h:64,texto:'Osíris',clicavel:false},
    {id:'et-th',tipo:'etiqueta',x:2400,y:500,w:180,h:64,texto:'Thot',clicavel:false},
    {id:'et-vida',tipo:'etiqueta',x:1900,y:630,w:420,h:64,texto:'vida após a morte',clicavel:false},
    {id:'mum',tipo:'icone',nome:'mumia',fundo:'amarelo',x:2640,y:80,w:480,h:480,giro:1.5,rotulo:'Recorte: mumificação em três quadros, com órgãos em vasos, corpo no natrão e faixas de linho'},
    {id:'n-livro',tipo:'nota',x:2650,y:600,w:480,giro:-1.5,texto:'Livro dos Mortos: orações para essa viagem, escritas em papiro'},

    /* etapa 8: Amenófis IV e Aton */
    {id:'aton',tipo:'icone',nome:'aton',fundo:false,x:1900,y:1100,w:440,h:440,giro:-1,rotulo:'Recorte: disco solar de Aton, com raios que terminam em mãos'},
    {id:'et-cult',tipo:'etiqueta',x:2400,y:1250,w:440,h:100,texto:'culto quase exclusivo',clicavel:false},

    /* etapa 9: Kush */
    {id:'kush',tipo:'foto',img:'historia-egito-kush',x:1900,y:1900,w:600,h:335,giro:-1.5,fita:{x:12,g:-3},rotulo:'Foto recriada: faraó kushita com a coroa das duas serpentes'},
    {id:'nsul',tipo:'nilosul',x:2600,y:1830,w:420,h:727,giro:1,etapa:8,rotulo:'Esquema do Nilo, do delta a Meroé, com as cataratas numeradas, o avanço de Kush e a entrada dos persas'},
    {id:'et-prox',tipo:'etiqueta',x:1900,y:2290,w:620,h:110,texto:'Próximo: persas, fenícios e hebreus',clicavel:false},
    {id:'n-kush',tipo:'nota',x:1900,y:2440,w:560,giro:1,texto:'Em cerca de 728 a.C., o rei kushita Piye conquistou o Egito; os assírios expulsaram os kushitas e, em 525 a.C., vieram os persas'}
  ],

  etapas:[
    {titulo:"Um rio no meio do deserto",mostra:['mapa'],so:['doc','nilom','n-cheia'],fonte:'doc',
     foco:[40,40,880,690],focoM:[170,60,540,690],tomadas:[[9000,[880,60,760,360]],[13000,[100,720,680,380]]],tomadasM:[[9000,[890,80,720,330]],[14500,[110,730,620,360]]],tempo:20000,
     texto:"O Egito antigo fica no nordeste da ==África==, cercado de deserto. A vida se concentrava numa faixa estreita ao longo do ==Nilo==, que corre do sul para o norte e se abre em braços, o delta, antes do Mediterrâneo. Todo ano, entre julho e outubro, as chuvas de verão nas montanhas da Etiópia faziam o rio encher; ao baixar, ele deixava o ==limo==, lama escura e fértil. Os egípcios chamavam sua terra de Kemet, a terra negra, e o deserto de terra vermelha. A cheia era mais regular que a dos rios da Mesopotâmia e organizava o calendário em três estações: cheia, plantio e colheita. O deserto ainda funcionava como proteção natural contra invasões."},
    {titulo:"Hieróglifos e escribas",so:['nilo','cart','ros','et-ros','et-hi','et-de','et-gr','et-esc'],
     foco:[900,40,1100,780],focoM:[880,60,640,460],tomadas:[[5000,[900,430,1000,440]]],tomadasM:[[5000,[900,460,380,300]],[9000,[1200,460,620,260]]],tempo:15000,
     tracos:[{tipo:'circulo',peca:'nilo',x:62,y:62,w:17,h:34,atraso:A(1500)},{tipo:'seta',de:{peca:'nilo',x:76,y:58},para:{peca:'et-esc',x:0,y:50},curva:-.2,atraso:A(2400)}],
     texto:"Os egípcios criaram, por volta de 3200 a.C., a escrita ==hieroglífica==, com centenas de sinais: alguns valiam ideias, outros sons. Gravada em templos e túmulos, era considerada sagrada e era usada pelos ==escribas==, que registravam colheitas, impostos, estoques e ordens do faraó. Ser escriba garantia prestígio e isenção do trabalho pesado. No dia a dia, usavam uma escrita mais rápida, o hierático, sobre ==papiro==, folha feita de uma planta do Nilo. Os hieróglifos só foram decifrados em 1822, pelo francês Champollion, graças à Pedra de Roseta, um decreto de 196 a.C. que traz o mesmo texto em três escritas: hieróglifos, demótico e grego. Conhecendo o grego, ele pôde comparar os textos."},
    {titulo:"Menés une dois reinos",mostra:['tempo'],so:['coroas','narmer','et-nar','et-ai','et-mi','et-ni'],
     foco:[40,40,880,690],focoM:[170,60,540,690],tomadas:[[9000,[890,70,700,420]],[14000,[60,1690,1000,330]],[18000,[900,1690,1000,330]]],tomadasM:[[9000,[900,80,320,340]],[11500,[1240,80,340,420]],[14000,[60,1740,560,300]],[17000,[420,1740,560,300]],[20000,[900,1740,560,300]]],tempo:22000,
     tracos:[{tipo:'circulo',peca:'narmer',x:48,y:42,w:22,h:20,atraso:A(10500)}],
     texto:"Os egípcios vinham de vários povos e viviam em comunidades independentes, que os livros chamam de nomos. Com o tempo, elas formaram dois reinos: o ==Alto Egito==, no sul, ao longo do vale, e o Baixo Egito, no delta. Por volta de 3100 a.C., ==Menés==, rei do sul, que muitos identificam com Narmer, unificou os dois e passou a usar a coroa dupla. Começou a ==era dos faraós==, que durou quase três mil anos. Os historiadores a dividem em Antigo Império, o tempo das grandes pirâmides; Médio Império, de reorganização e obras de irrigação; e Novo Império, de conquistas na Núbia e no Oriente Próximo. Entre eles houve períodos de crise e divisão."},
    {titulo:"O faraó, um deus vivo",so:['soc','et-escr','hat','cle','et-hat','et-cle'],
     foco:[60,1040,1160,520],focoM:[80,1030,680,400],tomadas:[[8000,[760,1440,1300,520]]],tomadasM:[[8000,[880,1470,360,330]],[11500,[1620,1470,380,330]]],tempo:16000,
     tracos:[{tipo:'circulo',peca:'soc',x:50,y:12,w:26,h:22,atraso:A(1500)}],
     texto:"O ==faraó== era visto como ==deus vivo==, filho de Rá e encarnação de Hórus. Devia manter a maat, a ordem do mundo: fazer o Nilo encher, vencer os inimigos e garantir a justiça. Por isso, o poder político e o religioso estavam unidos: é a ==teocracia== egípcia. Governava com um vizir, espécie de primeiro-ministro, sacerdotes, escribas e governadores das províncias. A sociedade era uma pirâmide, com o faraó no topo e os camponeses na base. As mulheres podiam ter bens, fazer contratos, herdar e pedir divórcio, algo raro na Antiguidade, e algumas governaram, como Hatshepsut. Cleópatra VII, de família macedônica, foi a última governante do Egito antigo."},
    {titulo:"Quem fazia a terra produzir",so:['nilo','n3','n-imp','et-serv','n-serv'],
     foco:[900,40,1180,820],focoM:[900,60,640,440],tomadasM:[[8000,[900,440,820,330]]],tempo:15000,
     tracos:[{tipo:'circulo',peca:'nilo',x:62,y:62,w:17,h:34,atraso:A(1000)},{tipo:'seta',de:{peca:'nilo',x:56,y:76},para:{peca:'n3',x:66,y:0},curva:.18,atraso:A(1800)},
             {tipo:'circulo',peca:'nilo',x:70,y:78,w:22,h:26,cor:'seta',atraso:A(3200)},{tipo:'seta',de:{peca:'nilo',x:72,y:92},para:{peca:'n-imp',x:30,y:0},curva:.2,atraso:A(4000)},
             {tipo:'seta',de:{peca:'nilo',x:30,y:72},para:{peca:'nilo',x:58,y:68},curva:-.25,atraso:A(5200)},{tipo:'seta',de:{peca:'nilo',x:16,y:58},para:{peca:'nilo',x:58,y:62},curva:.2,atraso:A(6000)},{tipo:'seta',de:{peca:'nilo',x:44,y:84},para:{peca:'nilo',x:62,y:74},curva:-.2,atraso:A(6800)}],
     texto:"A economia era ==agrícola==: trigo e cevada, para pão e cerveja, e linho, para roupas. A maioria da população era de camponeses que trabalhavam terras do faraó, dos templos e de altos funcionários. Eles entregavam parte da colheita como imposto, calculado conforme a altura da cheia, medida nos nilômetros. Também deviam a ==corveia==, trabalho obrigatório em canais, diques, templos e túmulos. O Estado guardava os grãos em celeiros e os distribuía em rações e nos anos ruins. Havia escravos, em geral prisioneiros de guerra, mas não eram a base do trabalho. Muitos livros chamam esse sistema de ==servidão coletiva==: comunidades inteiras devendo produtos e trabalho ao Estado."},
    {titulo:"Quem construiu as pirâmides",so:['pir','n4','et-rac','n-greve'],
     foco:[900,380,1180,860],focoM:[920,440,640,460],tomadas:[[9000,[40,40,880,690]]],tomadasM:[[8000,[920,880,620,200]],[11000,[170,60,540,690]]],tempo:15000,
     tracos:[{tipo:'circulo',peca:'pir',x:80,y:44,w:12,h:36,atraso:A(1500)},{tipo:'seta',de:{peca:'pir',x:76,y:62},para:{peca:'et-rac',x:50,y:0},curva:.25,atraso:A(2400)},{tipo:'circulo',peca:'pir',x:14,y:72,w:20,h:24,atraso:A(3800)}],
     texto:"As ==pirâmides== de Gizé eram túmulos de faraós do Antigo Império: Quéops, Quéfren e Miquerinos. A maior, de Quéops, ficou pronta por volta de 2560 a.C., com mais de dois milhões de blocos de pedra. A ideia de multidões de escravos chicoteados vem de autores gregos e do cinema. A arqueologia mostra outra coisa: eram ==camponeses convocados em turnos==, sobretudo na época da cheia, quando os campos ficavam sob a água, e artesãos fixos, pagos com rações de pão e cerveja. Perto delas há a vila dos trabalhadores, padarias e os túmulos dos próprios construtores, que não seriam feitos para escravos. As pirâmides mostram o poder do Estado de reunir gente e alimento."},
    {titulo:"Múmias e o julgamento do coração",so:['julg','et-an','et-os','et-th','et-vida','mum','n-livro'],
     foco:[1860,60,1300,680],focoM:[1880,70,700,520],tomadas:[[9000,[2590,60,600,680]]],tomadasM:[[9000,[2610,70,540,640]]],tempo:18000,
     tracos:[{tipo:'circulo',peca:'julg',x:45,y:52,w:26,h:46,atraso:A(1500)},{tipo:'seta',de:{peca:'julg',x:45,y:76},para:{peca:'et-vida',x:30,y:0},curva:.2,atraso:A(2400)},
             {tipo:'seta',de:{peca:'et-an',x:50,y:0},para:{peca:'julg',x:52,y:55},curva:-.2,atraso:A(3400)},{tipo:'seta',de:{peca:'et-os',x:50,y:0},para:{peca:'julg',x:77,y:48},curva:-.2,atraso:A(4200)},{tipo:'seta',de:{peca:'et-th',x:50,y:0},para:{peca:'julg',x:86,y:62},curva:.2,atraso:A(5000)}],
     texto:"A religião era ==politeísta==, com deuses muitas vezes de corpo humano e cabeça de animal: Rá, o Sol; Osíris, dos mortos; Hórus, de cabeça de falcão; Anúbis, de chacal. Os egípcios acreditavam na ==vida após a morte==, e o corpo precisava durar: daí a ==mumificação==, com retirada dos órgãos, secagem com natrão, um sal, e faixas de linho, num processo de cerca de 70 dias. Diante de Osíris, o coração do morto era pesado contra a pena da verdade; se fosse leve, seguia para a vida eterna. Destacaram-se também na medicina, conhecida por papiros médicos, na arquitetura, na escultura e na pintura, além da astronomia e do calendário."},
    {titulo:"Amenófis IV e o deus Aton",so:['aton','et-cult'],
     foco:[40,40,880,690],focoM:[330,330,400,540],tomadas:[[11000,[1860,1060,1060,500]]],tomadasM:[[11000,[1880,1080,500,480]],[14000,[2380,1200,480,200]]],tempo:20000,
     tracos:[{tipo:'circulo',peca:'aton',x:50,y:50,w:36,h:36,atraso:A(12500)},{tipo:'seta',de:{peca:'aton',x:80,y:50},para:{peca:'et-cult',x:0,y:50},curva:.2,atraso:A(13300)}],
     texto:"Por volta de 1350 a.C., no Novo Império, o faraó ==Amenófis IV== fez uma reforma religiosa: passou a adorar quase só ==Aton==, o disco solar, mudou o próprio nome para Akhenaton e fundou uma nova capital, Amarna. Os templos de outros deuses perderam recursos, e os ricos sacerdotes de Amon, em Tebas, perderam força. A arte da época ficou mais natural, mostrando a família real em cenas do dia a dia. Depois de sua morte, o culto antigo voltou: o jovem Tutankhaton passou a se chamar Tutankhamon, em honra de Amon. Os historiadores discutem se foi ==monoteísmo== de verdade e quanto da reforma era disputa de poder entre o faraó e os sacerdotes."},
    {titulo:"Kush e o fim do Egito dos faraós",so:['kush','nsul','et-prox','n-kush'],
     foco:[1860,1860,1200,820],focoM:[1880,1850,640,560],tomadas:[[7000,[2560,1810,500,780]]],tomadasM:[[7000,[2600,1830,420,400]],[11000,[2600,2190,420,400]],[15000,[1890,2270,640,380]]],tempo:20000,
     tracos:[{tipo:'circulo',peca:'kush',x:40,y:20,w:14,h:20,atraso:A(1500)}],
     texto:"Ao sul ficava o reino de ==Kush==, na Núbia, atual Sudão, rico em ouro e muito ligado ao Egito, que por séculos o dominou. Por volta de 728 a.C., o rei kushita Piye venceu os chefes que dividiam o Egito, e seus sucessores reinaram como faraós da ==25ª dinastia==, restaurando templos e tradições egípcias. Entre 671 e 664 a.C., os assírios os empurraram de volta para o sul. Kush seguiu independente por séculos em Meroé, com escrita própria, ferro e muitas pirâmides. O Egito foi conquistado pelos ==persas== em 525 a.C. Depois vieram Alexandre, em 332 a.C., a dinastia macedônica dos Ptolomeus e, em 30 a.C., os romanos."}
  ]
});
})();
