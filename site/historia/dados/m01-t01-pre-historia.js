/* Módulo 1, tópico 1: Pré-História. Roteiro revisado: docs/revisao-historia/m01-t01-pre-historia.md
   Formato dos dados: docs/historia/MOTOR.md. A mesa é grande e dividida em zonas (a câmera viaja entre elas):
   fita do tempo (topo esquerdo), quatro hipóteses (topo direito), mapa-múndi (meio), acampamento (meio direito), aldeia neolítica (embaixo). */
(function(){
const BASE='historia-mapa-mundo';
const MX=600,MY=1900,ME=1100/1376;                 // o mapa-múndi na mesa: x 600, y 1900, 1100 x 614
const LL=(lon,lat)=>{const q=Colagem.lonlat(BASE,lon,lat);return [MX+q[0]*ME,MY+q[1]*ME];};
const A=n=>Colagem.reduz?0:n;                      // atrasos só com movimento

const AFRICA=[[-5.9,35.8],[-1,35.2],[3,36.8],[10.2,37.2],[11,35.5],[10.1,33.8],[15,32.3],[20,32.1],[23,32.8],[30,31.2],[32.3,31.3],[32.6,30],[34,27.5],[35.5,24],[37,20],[38.8,16],[41,14],[43.3,12.5],[51.3,11.8],[50.8,9],[48,5],[44,1],[41.5,-1.8],[39,-5],[39.3,-7],[40.5,-10.5],[40.6,-15],[36,-18.5],[35,-20],[35.5,-23.5],[32.8,-26],[31,-29.8],[27.9,-33],[20,-34.8],[18.4,-34],[17.5,-31],[15,-26.5],[14,-22],[12,-17],[13.5,-12],[12.3,-6],[9.5,-1],[9.7,3.9],[6,4.3],[2.5,6.3],[-2,4.8],[-7.5,4.4],[-13,8],[-15.5,11],[-17.4,14.7],[-16.5,19.5],[-17,21],[-13,27.7],[-9.8,30],[-9.7,32.5],[-6.8,34]];
const LESTE=[[30,10],[38,12],[42,8],[43,3],[41,-2],[39,-8],[37,-12],[32,-11],[29,-5],[29,2]];

Colagem.montar({
  modulo:'Módulo 1: Pré-História e Antiguidade',
  titulo:'Pré-História',
  subtitulo:'Da pedra lascada às primeiras cidades',
  credito:'Figura do acampamento: reconstituição gerada por IA a partir de fontes arqueológicas. Recortes, fita do tempo e mapa desenhados pelo LAB.',
  ritmo:10000,
  celularGrande:true,
  mesa:{w:3450,h:3400},
  enem:"O ENEM costuma partir de uma imagem ou de um texto e pedir relações de causa e consequência. O tema mais cobrado é a **Revolução Neolítica** e seus efeitos: sedentarismo, excedente, divisão do trabalho e, mais tarde, cidades, Estado e desigualdade. Também aparecem a **arte rupestre** como fonte histórica, muitas vezes com imagens da Serra da Capivara, e o povoamento da América.\n\nPegadinhas frequentes:\n- Dizer que povos sem escrita \"não têm história\".\n- Tratar a evolução como escada ou dizer que \"o homem veio do macaco\".\n- Achar que a agricultura surgiu de repente e num único lugar.\n- Confundir pedra lascada (Paleolítico) com pedra polida (Neolítico).",

  msPalavra:250,
  // texto de estudo: seção "Texto de estudo" do roteiro (docs/revisao-historia/m01-t01-pre-historia.md)
  estudo:[
    {
      "titulo": "O que é a Pré-História e como a conhecemos",
      "texto": "Pré-História é o nome dado ao período que vai do surgimento dos primeiros seres humanos até a invenção da escrita, por volta de 3200 a.C., na Mesopotâmia. O termo foi criado no século XIX, quando se acreditava que a história só começava com documentos escritos. Hoje essa ideia é criticada: sociedades sem escrita também mudavam no tempo e criavam técnicas, crenças e formas de organização.\n\nComo esses povos não deixaram textos, nós os conhecemos pelas **fontes materiais**: ossos, dentes, ferramentas, restos de fogueiras, sementes e pinturas, estudados pela **arqueologia**. Fósseis de outros seres vivos, como os dinossauros, são assunto de outra ciência, a **paleontologia**.\n\nA divisão tradicional usa o material das ferramentas: **Paleolítico** (pedra lascada), **Mesolítico** (transição) e **Neolítico** (pedra polida), seguidos da **Idade dos Metais**. Esse esquema nasceu na Europa e não ocorreu ao mesmo tempo em todo o planeta: na América, muitos povos plantavam sem usar metal."
    },
    {
      "titulo": "Hominização: como nos tornamos humanos",
      "texto": "**Hominização** é o processo, de milhões de anos, que levou ao ser humano atual. Os fósseis mais antigos de hominídeos estão na **África**, e é lá também que aparecem os restos mais antigos de **Homo sapiens**, em Jebel Irhoud, no Marrocos, com cerca de 300 mil anos. A evolução não foi uma escada em que uma espécie se transforma na seguinte. Foi um arbusto de espécies, várias vivendo ao mesmo tempo, como o Homo sapiens e os neandertais. Também não é correto dizer que o homem veio do macaco: humanos e outros primatas têm **ancestrais comuns**.\n\nPara explicar a hominização, os livros apresentam quatro hipóteses:\n- **Bipedismo:** andar sobre dois pés liberou as mãos para carregar e fabricar instrumentos; as pegadas de Laetoli, na Tanzânia, têm cerca de 3,6 milhões de anos.\n- **Caça:** caçar em grupo exigiu planejamento, estratégia e cooperação, e a carne trouxe mais energia.\n- **Cerebralização:** a versão escolar diz que uma mutação tornou alguns hominídeos mais inteligentes. A ciência atual mostra um crescimento gradual do cérebro.\n- **Linguagem:** a fala permitiu comunicar com precisão, ensinar e organizar o grupo.\n\nHoje se entende que esses fatores agiram juntos e se reforçaram."
    },
    {
      "titulo": "Paleolítico: pedra lascada, nomadismo e fogo",
      "texto": "O **Paleolítico** é a fase mais longa da trajetória humana: começa há mais de 2,5 milhões de anos, com as primeiras ferramentas de pedra, e vai até cerca de 10 000 a.C. Os instrumentos eram de **pedra lascada**, feitos batendo uma pedra contra a outra, além de osso e madeira. A economia era de **caça, pesca e coleta**, e os grupos eram **nômades**. O **domínio do fogo** deu calor, luz, proteção e comida cozida. Com essas técnicas, os humanos se espalharam da África para a Ásia, a Europa, a Oceania e, por último, a América.\n\nA organização social é chamada de **comunismo primitivo**: sem propriedade privada da terra, sem classes e com partilha do alimento. O termo vem de Engels, no século XIX, e simplifica, porque havia diferenças de idade e prestígio. O **matriarcalismo** indica pouca diferença entre homens e mulheres, e não um governo feminino, que não tem prova arqueológica."
    },
    {
      "titulo": "Arte rupestre",
      "texto": "As **pinturas rupestres** são imagens feitas em paredes de cavernas e abrigos de pedra, com carvão e pigmentos minerais, como o ocre. Mostram animais, caçadas, mãos e figuras humanas, e seu sentido exato é debatido. Na França, destacam-se Chauvet e Lascaux. No Brasil, o **Parque Nacional da Serra da Capivara**, no Piauí, é Patrimônio Mundial da UNESCO e guarda um dos maiores conjuntos de arte rupestre das Américas. Para o historiador, essas imagens são **fontes históricas**."
    },
    {
      "titulo": "Mesolítico: a transição",
      "texto": "Por volta de 10 000 a.C., a última glaciação terminou. O clima esquentou e grandes animais, como o mamute, desapareceram. O **Mesolítico** é a fase de adaptação: micrólitos, arco e flecha, mais pesca e coleta e acampamentos mais duradouros. O termo vale sobretudo para a Europa."
    },
    {
      "titulo": "Neolítico e Revolução Neolítica",
      "texto": "O **Neolítico**, da **pedra polida**, é marcado pela **Revolução Neolítica**: a domesticação de plantas e animais. No **Crescente Fértil**, no Oriente Próximo, isso começou por volta de 9500 a.C., com trigo, cevada, cabras e ovelhas. A agricultura surgiu também de forma independente em outros lugares, como a China, a Mesoamérica, os Andes, a Nova Guiné e a África. \"Revolução\" indica a importância da mudança, não a velocidade.\n\nAs consequências foram enormes: **sedentarismo**, com aldeias fixas perto das plantações; uma **economia de subsistência** que aos poucos gerou **excedente**, a sobra estocada; **divisão do trabalho**; **cerâmica** e **tecelagem**; e crescimento da população, com disputas por terras e estoques."
    },
    {
      "titulo": "Metais, cidades e o fim da Pré-História",
      "texto": "Na **Idade dos Metais**, a **metalurgia** trouxe o cobre, depois o **bronze** (cobre e estanho), por volta de 3000 a.C., e o **ferro**, difundido por volta de 1200 a.C. Nos vales do Tigre, do Eufrates e do Nilo, a irrigação aumentou a produção, e aldeias viraram cidades: é a **revolução urbana**. Surgem a **diferenciação social** entre quem produz e quem controla o excedente, o **Estado**, os tributos e a **escrita**, criada para registrar a administração. Com ela, para os livros, começa a chamada Idade Antiga."
    },
    {
      "titulo": "O povoamento da América e do Brasil",
      "texto": "A América foi o último continente ocupado. A hipótese mais aceita é a chegada de grupos vindos da Ásia pela **Beríngia**, faixa de terra que ligava a Sibéria ao Alasca na glaciação, quando o mar estava mais baixo; discute-se também uma rota pelo litoral do Pacífico. Há consenso de que havia humanos na América há pelo menos cerca de 15 mil anos; datas mais antigas, como algumas propostas para a Serra da Capivara, são debatidas.\n\nNo Brasil, destacam-se **Luzia**, crânio com cerca de 11 mil anos achado em Lagoa Santa, Minas Gerais, um dos fósseis humanos mais antigos das Américas, e os **sambaquis**, grandes montes de conchas erguidos no litoral por grupos pescadores e coletores. Para o Brasil, muitos historiadores preferem falar em **período pré-colonial**, porque o termo \"Pré-História\" sugere que os povos indígenas não tinham história antes da chegada dos europeus."
    }
  ],
  resumo:[
    "Pré-História é o período anterior à escrita (cerca de 3200 a.C.); é estudada por fontes materiais.",
    "A hominização ocorreu na África; o Homo sapiens tem cerca de 300 mil anos.",
    "Hipóteses da hominização: bipedismo, caça, cerebralização e linguagem, que agiram juntas.",
    "Paleolítico: pedra lascada, nomadismo, caça e coleta, fogo, comunismo primitivo e arte rupestre.",
    "Mesolítico: transição após o fim da glaciação, por volta de 10 000 a.C.",
    "Neolítico: pedra polida, agricultura, sedentarismo, excedente e divisão do trabalho.",
    "Idade dos Metais: cobre, bronze e ferro; revolução urbana, Estado e escrita.",
    "A América foi povoada há pelo menos cerca de 15 mil anos; no Brasil, Luzia, Serra da Capivara e sambaquis."
  ],
  urca:"O tema se estuda como para o ENEM, mas o Ceará oferece exemplos próximos. O estado tem sítios arqueológicos registrados pelo IPHAN, com pinturas e gravuras rupestres em abrigos e lajedos do sertão e das serras; as gravuras na pedra são chamadas de **itacoatiaras**, palavra de origem tupi. São fontes materiais, como as da Serra da Capivara, no vizinho Piauí.\n\nNo Cariri, é preciso separar duas coisas. A **Chapada do Araripe** é famosa pelos fósseis do período Cretáceo, com mais de 100 milhões de anos: peixes, insetos, plantas e pterossauros. Por isso a região abriga o **Geopark Araripe**, que entrou em 2006 na Rede Global de Geoparques, apoiada pela UNESCO, é Geoparque Mundial da UNESCO desde 2015 e é mantido pela URCA, e o Museu de Paleontologia de Santana do Cariri, também ligado à universidade. Isso é **paleontologia**, não Pré-História humana: esses animais viveram dezenas de milhões de anos antes de existir qualquer hominídeo. A presença humana no Cariri é muito mais recente e é estudada pela **arqueologia**. Em Nova Olinda, a Fundação Casa Grande mantém o Memorial do Homem Kariri. O nome Cariri vem dos povos indígenas Kariri, que viviam ali quando os colonizadores chegaram.",
  pecas:[
    /* zona 1: fita do tempo */
    {id:'fita',tipo:'fita',x:60,y:60,w:1160,h:380,giro:-.4,rotulo:'Fita do tempo da Pré-História, com a escala quebrada'},
    {id:'lasca',tipo:'icone',nome:'pedra-lascada',legenda:'Biface de pedra lascada',x:1280,y:70,w:230,h:230,giro:3,rotulo:'Recorte: biface de pedra lascada'},
    {id:'polida',tipo:'icone',nome:'pedra-polida',legenda:'Machado de pedra polida',x:1280,y:350,w:230,h:230,giro:-3,rotulo:'Recorte: machado de pedra polida'},
    {id:'nA',tipo:'nota',x:880,y:480,w:330,giro:-1.5,texto:'A escrita é um marco, não o começo da história'},

    /* zona 2: mapa-múndi */
    {id:'mapa',tipo:'mapa',base:BASE,x:MX,y:MY,w:1100,h:614,giro:-.5,rotulo:'Mapa-múndi da Pré-História',camadas:[
      {tipo:'rotulo',p:[655,420],texto:'África',classe:'regiao',tam:.95},
      {tipo:'rotulo',p:[1010,190],texto:'Ásia',classe:'regiao',tam:1.1},
      {tipo:'rotulo',p:[652,176],texto:'Europa',classe:'regiao',tam:.9},
      {tipo:'rotulo',p:[130,250],texto:'América do Norte',classe:'regiao',tam:.8},
      {tipo:'rotulo',p:[372,470],texto:'América do Sul',classe:'regiao',tam:.72},
      {tipo:'rotulo',p:[1118,556],texto:'Austrália',classe:'regiao',tam:.8},
      {tipo:'rotulo',p:[420,360],texto:'Oceano Atlântico',classe:'mar',tam:.78},
      {tipo:'rotulo',p:[40,560],texto:'Oceano Pacífico',classe:'mar',tam:.78},
      {tipo:'rotulo',p:[820,545],texto:'Oceano Índico',classe:'mar',tam:.78},
      // etapa 2: a África e o leste do continente
      {tipo:'regiao',ll:true,pts:AFRICA,suave:false,cor:'coral',opac:.4,etapas:[1],atraso:A(500)},
      {tipo:'regiao',ll:true,pts:LESTE,suave:false,cor:'coral',opac:.9,etapas:[1],atraso:A(1500)},
      {tipo:'cidade',ll:true,p:[35.2,-3.2],nome:'Laetoli',sub:'Tanzânia',lado:'d',tam:1.1,etapas:[1],atraso:A(1000)},
      {tipo:'cidade',ll:true,p:[-8.9,32],nome:'Jebel Irhoud',sub:'Marrocos, cerca de 300 mil anos',lado:'d',tam:1.1,etapas:[1],atraso:A(1800)},
      // etapa 4: a dispersão do Homo sapiens, sem datas exatas
      {tipo:'rota',ll:true,pts:[[36,3],[36,15],[34.5,28],[40,34],[56,34],[70,25],[86,24],[100,17],[110,24],[119,31]],dur:2.2,etapas:[3],atraso:A(5200)},
      {tipo:'rota',ll:true,pts:[[35,33],[28,40],[15,46],[2,47],[-6,43]],dur:1.8,etapas:[3],atraso:A(6600)},
      {tipo:'rota',ll:true,pts:[[100,16],[108,3],[120,-6],[133,-14],[142,-24]],dur:1.8,etapas:[3],atraso:A(8000)},
      {tipo:'rota',ll:true,pts:[[88,40],[100,52],[120,60],[145,65],[170,66],[179,66]],dur:2,etapas:[3],atraso:A(9300)},
      {tipo:'rota',ll:true,pts:[[-160,66],[-150,60],[-130,50],[-118,36],[-104,22],[-90,13],[-78,0],[-72,-18],[-70,-38]],dur:2.6,etapas:[3],atraso:A(10600)},
      {tipo:'etiqueta',ll:true,p:[22,-47],texto:'há dezenas de milhares de anos',cor:'amarelo',tam:1.1,etapas:[3],atraso:A(12400)},
      // etapa 6: arte rupestre
      {tipo:'cidade',ll:true,p:[4.4,44.4],nome:'Chauvet',sub:'França',lado:'d',tam:1.1,etapas:[5],atraso:A(5200)},
      {tipo:'cidade',ll:true,p:[1.2,45.05],nome:'Lascaux',sub:'França',lado:'e',tam:1.1,etapas:[5],atraso:A(5800)},
      {tipo:'cidade',ll:true,p:[-42.5,-8.8],nome:'Serra da Capivara',sub:'Piauí, Brasil',lado:'e',tam:1.1,capital:true,etapas:[5],atraso:A(6500)},
      // etapa 7: o gelo recua
      {tipo:'regiao',ll:true,pts:[[-10,72],[40,74],[62,70],[62,55],[40,50],[18,48],[5,50],[-8,53]],cor:'#e6f4fb',opac:.94,mistura:false,etapas:[6],atraso:A(300),dura:3600},
      {tipo:'regiao',ll:true,pts:[[-5,71],[30,73],[40,70],[28,66],[12,64],[2,66]],cor:'#e6f4fb',opac:.94,mistura:false,etapas:[6],atraso:A(300)},
      {tipo:'etiqueta',ll:true,p:[18,79],texto:'gelo recua',tam:1,etapas:[6],atraso:A(1500)},
      // etapa 8: centros independentes de agricultura
      {tipo:'regiao',ll:true,pts:[[34.5,31.5],[35,34.5],[37,37],[41,37.8],[44.5,37],[47,34.5],[48.5,31.5],[45.5,31.5],[43.8,33.2],[41,33.8],[38.5,33.2],[37.2,31.5]],cor:'coral',opac:.92,etapas:[7],atraso:A(500)},
      {tipo:'etiqueta',ll:true,p:[36,52],texto:'cerca de 9500 a.C.',cor:'amarelo',tam:1.05,etapas:[7],atraso:A(1300)},
      {tipo:'regiao',ll:true,pts:[[106,40],[118,40],[122,34],[116,32],[108,33]],cor:'coral',opac:.92,etapas:[7],atraso:A(1800)},
      {tipo:'etiqueta',ll:true,p:[124,41],texto:'Norte da China',tam:.8,etapas:[7],atraso:A(2100)},
      {tipo:'regiao',ll:true,pts:[[-103,22],[-96,21],[-90,18],[-92,15],[-100,16]],cor:'coral',opac:.92,etapas:[7],atraso:A(4200)},
      {tipo:'etiqueta',ll:true,p:[-104,29],texto:'Mesoamérica',tam:.8,etapas:[7],atraso:A(4500)},
      {tipo:'regiao',ll:true,pts:[[-79,-6],[-72,-8],[-68,-16],[-72,-19],[-77,-13]],cor:'coral',opac:.92,etapas:[7],atraso:A(5000)},
      {tipo:'etiqueta',ll:true,p:[-94,-23],texto:'Andes',tam:.8,etapas:[7],atraso:A(5300)},
      {tipo:'regiao',ll:true,pts:[[141,-5],[147,-5.5],[148,-8],[142,-8]],suave:false,cor:'coral',opac:.95,etapas:[7],atraso:A(6000)},
      {tipo:'etiqueta',ll:true,p:[134,6],texto:'Nova Guiné',tam:.8,etapas:[7],atraso:A(6300)},
      {tipo:'regiao',ll:true,pts:[[-15,13],[0,16],[15,16],[30,14],[30,10],[15,9],[0,10],[-12,11]],cor:'coral',opac:.92,etapas:[7],atraso:A(2800)},
      {tipo:'etiqueta',ll:true,p:[-8,20],texto:'Sahel',tam:.8,etapas:[7],atraso:A(3100)},
      // etapa 9: os vales dos grandes rios e as primeiras cidades
      {tipo:'corredor',ll:true,pts:[[31.2,30],[31.2,29],[31,27],[32.6,25.7],[32.9,24],[33.5,20],[33,17]],largura:18,cor:'coral',opac:.85,etapas:[8],atraso:A(4800)},
      {tipo:'corredor',ll:true,pts:[[36,36.7],[40,35.5],[42,34.4],[44,32.5],[45.5,31],[47.5,30.5]],largura:14,cor:'coral',opac:.85,etapas:[8],atraso:A(5300)},
      {tipo:'corredor',ll:true,pts:[[41,37.8],[43,36.3],[44.4,33.3],[46,32],[47.5,30.8]],largura:14,cor:'coral',opac:.85,etapas:[8],atraso:A(5600)},
      {tipo:'cidade',ll:true,p:[45.6,31.3],nome:'Uruk',lado:'d',tam:1.2,etapas:[8],atraso:A(6200)},
      {tipo:'cidade',ll:true,p:[31.25,28.4],nome:'Mênfis',lado:'e',tam:1.2,etapas:[8],atraso:A(6700)}
    ]},
    {id:'pegadas',tipo:'icone',nome:'pegadas',legenda:'Pegadas de Laetoli',x:1310,y:2310,w:200,h:200,giro:3,rotulo:'Recorte: pegadas fossilizadas em cinza vulcânico'},
    {id:'et-bip',tipo:'etiqueta',x:1560,y:2395,w:240,h:64,texto:'bipedismo',clicavel:false},
    {id:'arbusto',tipo:'icone',nome:'arbusto',legenda:'O arbusto da evolução',x:640,y:2230,w:240,h:240,giro:-2,rotulo:'Recorte: o arbusto da evolução humana'},
    {id:'tempo',tipo:'tempo',aviso:'a régua não está em escala',x:860,y:1780,w:940,h:96,giro:.5,
     marcos:[{p:9,t:'cerca de 10 000 a.C.',etapa:6},{p:30,t:'cerca de 9500 a.C.',etapa:7},{p:50,t:'cerca de 3200 a.C.',cor:'petroleo',etapa:8},{p:70,t:'cerca de 3000 a.C.',cor:'petroleo',etapa:8},{p:90,t:'cerca de 1200 a.C.',cor:'petroleo',etapa:8}]},
    {id:'micro',tipo:'icone',nome:'microlitos',legenda:'Micrólitos numa haste',x:1780,y:1960,w:250,h:250,giro:-3,rotulo:'Recorte: pequenas lâminas de pedra presas numa haste de madeira'},
    {id:'et-fp',tipo:'etiqueta',x:1770,y:2270,w:420,h:64,texto:'ferramentas pequenas',clicavel:false},
    {id:'mamute',tipo:'mamute',x:1440,y:1940,w:210,h:210,giro:2,rotulo:'Silhueta de mamute que desbota'},
    {id:'mao',tipo:'mao',x:960,y:2232,w:200,h:120,giro:-4,rotulo:'Mão recortada que aponta para a Serra da Capivara'},
    {id:'n-datas',tipo:'nota',x:930,y:2385,w:300,giro:-2,texto:'As datas variam por sítio e são debatidas'},
    {id:'pir',tipo:'piramide',x:1780,y:2110,w:420,h:195,giro:1.5,alturaCamada:90,rotulo:'Pirâmide social: rei, escribas e sacerdotes, camponeses e artesãos',
     camadas:[{t:'Rei'},{t:'Escribas e sacerdotes'},{t:'Camponeses e artesãos'}]},
    {id:'et-prox',tipo:'etiqueta',x:1790,y:2360,w:380,h:64,texto:'Próximo: Mesopotâmia',clicavel:false},

    /* zona 3: quatro hipóteses */
    {id:'hp-bip',tipo:'hipotese',icone:'pe',texto:'bipedismo',x:2240,y:100,w:340,h:170,giro:-1.5,rotulo:'Hipótese: bipedismo'},
    {id:'hp-caca',tipo:'hipotese',icone:'lanca',texto:'caça',x:2580,y:330,w:340,h:170,giro:1.5,rotulo:'Hipótese: caça'},
    {id:'hp-cer',tipo:'hipotese',icone:'cerebro',texto:'cerebralização',x:2240,y:560,w:400,h:170,giro:-1,rotulo:'Hipótese: cerebralização'},
    {id:'hp-ling',tipo:'hipotese',icone:'fala',texto:'linguagem',x:1900,y:330,w:340,h:170,giro:2,rotulo:'Hipótese: linguagem'},
    {id:'et-cer',tipo:'etiqueta',x:2240,y:745,w:460,h:100,texto:'versão de hoje: crescimento gradual',clicavel:false},

    /* zona 4: acampamento */
    {id:'camp',tipo:'fotomanchas',img:'historia-pre-paleolitico',x:2500,y:1930,w:900,h:502,giro:-.8,fita:{x:8,g:-3},rotulo:'Foto recriada: acampamento de caçadores-coletores',
     manchas:[{x:46,y:76,w:7,h:11,et:'3,4,5',pulsa:true},{x:22,y:37,w:9,h:14,et:'5'}]},
    {id:'et-lasca',tipo:'etiqueta',x:3040,y:1840,w:340,h:64,texto:'pedra lascada',clicavel:false},
    {id:'et-com',tipo:'etiqueta',x:2520,y:1730,w:460,h:64,texto:'“comunismo primitivo”',clicavel:false},
    {id:'et-mat',tipo:'etiqueta',x:3040,y:1730,w:380,h:64,texto:'“matriarcalismo”',clicavel:false},
    {id:'n-com',tipo:'nota',x:2540,y:1810,w:360,giro:-1.5,texto:'nome do século XIX'},
    {id:'n-mat',tipo:'nota',x:3040,y:1808,w:370,giro:1.5,texto:'hipótese, não governo das mulheres'},

    /* zona 5: aldeia neolítica */
    {id:'casa',tipo:'icone',nome:'casa-barro',legenda:'Casa de barro',x:600,y:2720,w:230,h:230,giro:-2,atraso:A(5000),rotulo:'Recorte: casa de barro'},
    {id:'mo',tipo:'icone',nome:'mo',legenda:'Mó de pedra',x:850,y:2720,w:230,h:230,giro:2,atraso:A(5400),rotulo:'Recorte: mó de pedra e grãos'},
    {id:'trigo',tipo:'icone',nome:'trigo',legenda:'Trigo',x:1100,y:2720,w:230,h:230,giro:-1,atraso:A(5800),rotulo:'Recorte: espigas de trigo'},
    {id:'cabra',tipo:'icone',nome:'cabra',legenda:'Cabra no cercado',x:1350,y:2720,w:230,h:230,giro:2,atraso:A(6200),rotulo:'Recorte: cabra no cercado'},
    {id:'pote',tipo:'icone',nome:'pote',legenda:'Pote de cerâmica',x:600,y:2990,w:230,h:230,giro:1,atraso:A(6600),rotulo:'Recorte: pote de cerâmica'},
    {id:'tear',tipo:'icone',nome:'tear',legenda:'Tear',x:850,y:2990,w:230,h:230,giro:-2,atraso:A(7000),rotulo:'Recorte: tear'},
    {id:'celeiro',tipo:'icone',nome:'celeiro',legenda:'Celeiro de grãos',x:1100,y:2990,w:230,h:230,giro:1.5,atraso:A(7400),rotulo:'Recorte: celeiro de grãos'},
    {id:'machado',tipo:'icone',nome:'pedra-polida',legenda:'Machado de pedra polida',x:1350,y:2990,w:230,h:230,giro:-2,atraso:A(7800),rotulo:'Recorte: machado de pedra polida'},
    {id:'et-pol',tipo:'etiqueta',x:1370,y:3250,w:220,h:60,texto:'pedra polida',clicavel:false},
    {id:'n-exc',tipo:'nota',x:1000,y:3250,w:340,giro:-1.5,texto:'excedente: o que sobra depois de comer'},

    /* zona 1, etapa 9: metais e a fonte de Lucrécio */
    {id:'cobre',tipo:'icone',nome:'cobre',legenda:'Machado de cobre',x:640,y:620,w:220,h:220,giro:-3,rotulo:'Recorte: machado de cobre'},
    {id:'bronze',tipo:'icone',nome:'bronze',legenda:'Ponta de lança de bronze',x:900,y:620,w:220,h:220,giro:2,rotulo:'Recorte: ponta de lança de bronze'},
    {id:'ferro',tipo:'icone',nome:'ferro',legenda:'Lâmina de ferro',x:1160,y:620,w:220,h:220,giro:-2,rotulo:'Recorte: lâmina de ferro'},
    {id:'doc',tipo:'fonte',x:60,y:560,w:540,h:500,giro:-1,rotulo:'Fonte histórica: Lucrécio',
     texto:'“As armas mais antigas foram as mãos, as unhas e os dentes, as pedras e os galhos arrancados das florestas, e o fogo, assim que foi conhecido. Mais tarde se descobriu a força do ferro e do bronze, e o bronze foi usado antes do ferro.”',
     ref:'Lucrécio, poeta romano, Sobre a natureza das coisas, livro V, versos 1283 a 1287, por volta de 55 a.C. Paráfrase da equipe.',
     resposta:'Mostra que já na Antiguidade havia a ideia de uma ==sequência de idades==: pedra e fogo, depois bronze, depois ferro. Mas Lucrécio não viu esse passado: ele o deduziu e imaginou, vivendo milhares de anos depois. Não é testemunho da Pré-História, e sim a reflexão de um romano.\n\nSó no século XIX a arqueologia confirmou a ordem com escavações e criou o sistema das três idades. Para estudar a Pré-História, as fontes principais são **materiais**: ossos, ferramentas, restos de fogueiras e pinturas.'}
  ],

  etapas:[
    {titulo:'Antes da escrita',mostra:['fita','lasca','polida'],so:['nA'],
     foco:[30,20,780,480],foco2:[520,20,1020,620],foco2Em:4800,focoM:[40,10,480,220],tomadasM:[[2800,[440,10,420,200]],[5600,[870,20,380,190]],[8400,[520,240,440,150]],[11000,[850,250,400,330]]],tempo:15000,
     texto:"Chamamos de ==Pré-História== o longo tempo anterior à escrita, que surgiu por volta de 3200 a.C., na Mesopotâmia. O nome foi criado no século XIX, quando se pensava que só havia história onde houvesse documentos escritos. Hoje essa ideia é criticada: povos sem escrita também têm história, e nós a conhecemos por ossos, ferramentas, restos de fogueiras, sementes e pinturas, as ==fontes materiais==, estudadas pela arqueologia. Os livros dividem esse tempo pelo material e pela técnica das ferramentas: Paleolítico, ou Idade da Pedra Lascada; Mesolítico, a transição; e Neolítico, ou Idade da Pedra Polida. Depois vem a Idade dos Metais. Essa divisão nasceu na Europa e não vale igual para o planeta todo, porque cada região viveu essas mudanças em tempos diferentes. Por isso, as datas são sempre aproximadas."},

    {titulo:'Tudo começou na África',mostra:['mapa'],so:['pegadas','et-bip','arbusto'],
     foco:[640,1930,1140,600],focoM:[1040,2080,470,330],tomadasM:[[5000,[620,2200,300,330]],[8000,[1290,2290,520,260]]],tempo:12000,
     tracos:[{tipo:'circulo',peca:'pegadas',x:60.5,y:50,w:24,h:34,atraso:A(8500)},{tipo:'seta',de:{peca:'pegadas',x:74,y:56},para:{peca:'et-bip',x:0,y:50},curva:.3,atraso:A(9300)}],
     texto:"A ==hominização== é o processo, de milhões de anos, que levou ao ser humano atual. Ele aconteceu na ==África==: lá estão os fósseis mais antigos de hominídeos, como as pegadas de Laetoli, na Tanzânia, de cerca de 3,6 milhões de anos, e os restos mais antigos de Homo sapiens, achados em Jebel Irhoud, no Marrocos, com cerca de 300 mil anos. A evolução não foi uma escada, com uma espécie virando a seguinte, mas um arbusto de espécies; algumas viveram ao mesmo tempo, como o Homo sapiens e os neandertais. E o ser humano não veio do macaco: humanos e outros primatas têm ancestrais comuns. A primeira hipótese para a hominização é o ==bipedismo==: andar sobre dois pés liberou as mãos para carregar alimentos, levar os filhos e fabricar instrumentos."},

    {titulo:'Quatro hipóteses, nenhuma sozinha',mostra:['hp-bip','hp-caca','hp-cer','hp-ling'],so:['et-cer'],
     foco:[1860,40,1100,880],
     tracos:[
      {tipo:'seta',de:{peca:'hp-bip',x:100,y:70},para:{peca:'hp-caca',x:55,y:0},curva:-.25,atraso:A(1200)},
      {tipo:'seta',de:{peca:'hp-caca',x:55,y:100},para:{peca:'hp-cer',x:100,y:30},curva:-.25,atraso:A(2300)},
      {tipo:'seta',de:{peca:'hp-cer',x:0,y:70},para:{peca:'hp-ling',x:55,y:100},curva:-.25,atraso:A(3400)},
      {tipo:'seta',de:{peca:'hp-ling',x:55,y:0},para:{peca:'hp-bip',x:0,y:30},curva:-.25,atraso:A(4500)}],
     texto:"Há mais três hipóteses. Pela ==teoria da caça==, caçar em grupo exigiu planejar, dividir tarefas e fabricar armas, o que aperfeiçoou habilidades; a carne também trouxe mais energia ao corpo. Pela ==teoria da cerebralização==, uma mutação teria deixado alguns hominídeos mais inteligentes que outros. É a versão de muitos livros, mas hoje se sabe que o cérebro cresceu aos poucos, ao longo de milhões de anos, e não num salto. Pela teoria da linguagem, falar permitiu uma comunicação mais precisa: cooperar, ensinar a fazer ferramentas, combinar a caça e organizar o grupo. Nenhuma teoria explica tudo sozinha. Os cientistas hoje combinam esses fatores, que se reforçam: mãos livres ajudam a fabricar, fabricar e caçar exigem cérebro e cooperação, e a linguagem torna essa cooperação possível."},

    {titulo:'Paleolítico: pedra lascada e fogo',mostra:['camp'],so:['et-lasca'],
     foco:[2440,1790,1000,680],focoM:[2860,1840,540,640],foco2:[560,1880,1220,650],foco2Em:6200,tomadasM:[[6000,[1160,2030,460,470]],[11200,[590,1960,380,440]]],tempo:16000,
     tracos:[{tipo:'circulo',peca:'camp',x:82,y:87,w:20,h:13,cor:'seta',atraso:A(900)},{tipo:'circulo',peca:'camp',x:81.4,y:70,w:8,h:15,cor:'seta',atraso:A(1700)},
             {tipo:'seta',de:{peca:'camp',x:81.4,y:61},para:{peca:'et-lasca',x:55,y:100},curva:.3,atraso:A(2600)}],
     texto:"No Paleolítico, a fase mais longa, de mais de 2,5 milhões de anos atrás até cerca de 10 000 a.C., os grupos faziam instrumentos de ==pedra lascada==, batendo uma pedra contra a outra para tirar lascas afiadas, além de objetos de osso e madeira. Viviam da caça, da pesca e da coleta de frutos e raízes e eram ==nômades==: mudavam de lugar quando a comida acabava ou quando os animais migravam. Abrigavam-se em entradas de cavernas, abrigos de pedra e cabanas de galhos e peles. O ==domínio do fogo==, há centenas de milhares de anos, trouxe calor, proteção contra animais, luz à noite e comida cozida, mais fácil de digerir. Com essas técnicas, os humanos ocuparam aos poucos todos os continentes, menos a Antártida. A América foi o último continente a ser povoado."},

    {titulo:'Comunismo primitivo e matriarcalismo',so:['et-com','et-mat','n-com','n-mat'],
     foco:[2470,1700,960,740],focoM:[2520,1700,900,540],
     tracos:[{tipo:'circulo',peca:'camp',x:37,y:64,w:14,h:18,cor:'amarelo',atraso:A(900)}],
     texto:"Os livros chamam a sociedade paleolítica de ==comunismo primitivo==: não havia propriedade privada da terra nem classes sociais, e o alimento caçado ou coletado era dividido no grupo. Isso fazia sentido para bandos pequenos, de algumas dezenas de pessoas, que não acumulavam bens, porque precisavam carregar tudo nas mudanças. O nome vem de autores do século XIX, como Engels, e simplifica: havia diferenças de idade, prestígio e tarefas. Fala-se também em ==matriarcalismo==, isto é, pouca diferença entre homens e mulheres. Não há provas de que mulheres governassem, mas seu papel na coleta, que garantia boa parte da comida, e na vida do grupo era central. Na prova, guarde a ideia principal: igualdade relativa e partilha, antes de existir excedente para disputar."},

    {titulo:'A arte das cavernas',so:['mao','n-datas'],
     foco:[2500,1930,520,300],foco2:[640,2000,700,470],foco2M:[760,2030,560,490],foco2Em:5200,tempo:14000,
     tracos:[{tipo:'circulo',peca:'camp',x:22,y:37,w:11,h:18,cor:'amarelo',atraso:A(900)}],
     texto:"Os grupos paleolíticos deixaram ==pinturas rupestres== em cavernas e abrigos de pedra: animais, cenas de caça, danças, mãos carimbadas e figuras humanas. Usavam carvão e pigmentos de terra, como o ocre vermelho, misturados com água ou gordura. Há também gravuras feitas na própria rocha. Não sabemos com certeza o sentido dessas imagens: magia para garantir a caça, rituais, marcas de território ou memória do grupo. Na Europa, as mais famosas estão nas cavernas de Chauvet e Lascaux, na França. O Brasil tem um dos maiores conjuntos das Américas, na ==Serra da Capivara==, no Piauí, e o Ceará também tem sítios com pinturas e gravuras. Essas imagens são ==fontes históricas==: mesmo sem escrita, mostram o que aqueles grupos viam, caçavam e valorizavam."},

    {titulo:'Mesolítico: a transição',mostra:['tempo'],so:['micro','et-fp','mamute'],
     foco:[860,1780,1190,640],focoM:[830,1775,470,110],tomadasM:[[3000,[1080,1930,600,260]],[6500,[1740,1960,470,420]]],tempo:12000,
     tracos:[{tipo:'circulo',peca:'micro',x:42,y:40,w:68,h:56,atraso:A(7000)},{tipo:'seta',de:{peca:'micro',x:42,y:70},para:{peca:'et-fp',x:50,y:0},curva:.3,atraso:A(7800)}],
     texto:"Por volta de 10 000 a.C., terminou a última era glacial. O clima esquentou, o gelo recuou para o norte, o nível do mar subiu e muitos grandes animais, como o mamute, desapareceram, por causa do clima e, em parte, da caça. Os grupos humanos precisaram se adaptar. Começa o ==Mesolítico==, uma ==fase de transição== entre o Paleolítico e o Neolítico: ferramentas pequenas e afiadas, os micrólitos, presas em hastes para fazer flechas e foices; uso do arco e flecha; mais pesca e coleta de sementes e moluscos; acampamentos usados por mais tempo. Alguns grupos começaram a deixar a vida totalmente nômade. O nome vale sobretudo para a Europa; no Oriente Próximo, essa fase logo levou ao cultivo de plantas."},

    {titulo:'A Revolução Neolítica',mostra:['casa','mo','trigo','cabra','pote','tear','celeiro','machado'],so:['et-pol','n-exc'],
     foco:[560,1770,1300,760],focoM:[1090,2050,500,280],foco2:[560,2690,1060,680],foco2Em:7600,tomadasM:[[3600,[700,2100,340,320]],[5600,[1360,2140,360,260]],[7400,[580,2700,520,560]],[8800,[1090,2700,500,540]],[10000,[1000,2960,640,430]]],tempo:18000,
     tracos:[{tipo:'circulo',peca:'machado',x:64,y:35,w:50,h:36,cor:'seta',atraso:A(10200)},{tipo:'seta',de:{peca:'machado',x:64,y:56},para:{peca:'et-pol',x:50,y:0},curva:.25,atraso:A(11000)},
             {tipo:'circulo',peca:'celeiro',x:50,y:54,w:56,h:66,cor:'seta',atraso:A(12400)},{tipo:'seta',de:{peca:'celeiro',x:50,y:92},para:{peca:'n-exc',x:40,y:0},curva:.3,atraso:A(13200)}],
     texto:"No Neolítico, da ==pedra polida==, veio a maior virada: a ==Revolução Neolítica==, com a agricultura e a criação de animais, a partir de cerca de 9500 a.C. no Crescente Fértil, onde se domesticaram trigo, cevada, cabras e ovelhas. Foi um processo lento, de milhares de anos, e ocorreu também, de forma independente, na China, com arroz e milhete, nas Américas, com milho e mandioca, e na África. Plantar fixou as pessoas perto das roças: o ==sedentarismo==. A economia era de subsistência, voltada para o consumo do próprio grupo, mas aos poucos surgiu o excedente, a sobra que podia ser guardada. Com ele vieram a divisão do trabalho, as aldeias, a cerâmica para guardar grãos e a tecelagem."},

    {titulo:'Metais e cidades',mostra:['cobre','bronze','ferro','doc','pir','et-prox'],fonte:'doc',
     foco:[30,560,1500,620],focoM:[640,745,480,200],foco2:[1000,2030,1220,480],foco2Em:7500,tomadasM:[[2500,[900,745,480,200]],[5500,[30,540,600,560]],[10500,[1060,2060,340,260]],[14500,[1760,2090,460,350]]],tempo:20000,
     tracos:[{tipo:'circulo',peca:'pir',x:50,y:16,w:44,h:28,atraso:A(15200)}],
     texto:"Depois veio a ==metalurgia==: primeiro o cobre; depois o bronze, mistura de cobre e estanho, mais duro, por volta de 3000 a.C.; e o ferro, difundido por volta de 1200 a.C. Fazer metal exigia minério, fornos, artesãos especializados e comércio com regiões distantes, porque o estanho era raro. Nos vales dos grandes rios, como o Tigre, o Eufrates e o Nilo, a irrigação aumentou o excedente, e aldeias viraram cidades: a ==revolução urbana==. Surge a ==diferenciação social== entre quem produz, camponeses e artesãos, e quem controla o excedente, sacerdotes, guerreiros e reis. Com ela nascem o Estado, os impostos e a escrita, criada para registrar colheitas e tributos. Para os livros, aqui termina a Pré-História."}
  ]
});
})();
