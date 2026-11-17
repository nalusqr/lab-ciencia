/* Módulo 1, tópico 2: Mesopotâmia. Roteiro revisado: docs/revisao-historia/m01-t02-mesopotamia.md
   Formato dos dados: docs/historia/MOTOR.md. Mesa grande em zonas: mapa (topo esquerdo), deuses e templos (topo direito),
   tributo (meio), tabuinha (meio esquerdo), Sargão (embaixo esquerdo), Hamurábi (embaixo), cerco assírio e Porta de Ishtar (direita). */
(function(){
const A=n=>Colagem.reduz?0:n;                      // atrasos só com movimento
const BASE='historia-mapa-mediterraneo';
const TIGRE=[[41.2,38.2],[42.5,37.3],[43.2,36.4],[43.4,35.5],[44.3,34],[44.6,33.3],[45.6,32.4],[46.8,31.4],[47.7,30.9]];
const EUFRATES=[[38.5,36.6],[40,35.5],[41.5,34.6],[42.8,33.8],[44.2,32.6],[45.4,31.8],[46.6,31.0],[47.6,30.5]];
const EUF=[[966,368],[985,372],[1000,377],[1012,398],[1030,410],[1045,412],[1060,418],[1080,432],[1100,446],[1130,466],[1160,484],[1182,500]];
const TIG=[[1048,345],[1060,358],[1072,375],[1082,400],[1088,425],[1100,445],[1125,462],[1155,478],[1182,500]];
const VALE1=[[1000,377],[1012,398],[1030,410],[1060,418],[1085,430],[1088,425],[1082,400],[1072,375],[1060,358],[1048,345],[1020,360]];
const VALE2=[[1085,422],[1100,434],[1130,442],[1152,448],[1162,458],[1164,472],[1174,486],[1182,500],[1168,504],[1148,494],[1124,484],[1100,470],[1090,445]];
const CRESC=[[838,488],[880,470],[912,430],[925,385],[950,345],[985,335],[1020,330],[1060,325],[1090,340],[1100,380],[1110,420],[1150,445],[1185,490],[1190,505],[1170,505],[1135,480],[1095,448],[1075,430],[1050,420],[1025,420],[1010,395],[990,385],[965,385],[945,400],[935,440],[915,470],[885,490],[850,500]];
const ACAD=[[47.6,30.1],[48.7,31.6],[47.3,33.4],[47.2,34],[46.8,36.2],[44.5,37.4],[41.6,37.4],[37,37.2],[35.5,36.2],[35,34],[35,32.2],[36.4,32],[41,33.2],[43.6,33.2],[43.8,31.5],[45.2,30.4]];
const F1=[[47.6,30.1],[48.7,31.6],[47.3,33.4],[45,34],[43.6,33.2],[43.8,31.5],[45.2,30.4]];
const F2=[[45,34.7],[47.2,34.1],[46.8,36.2],[44.5,37.4],[42.2,37.6],[42.5,35.6]];
const F3=[[35,32.2],[36.4,32],[41.6,34.2],[41.4,36.8],[37,37.1],[35.5,36.1],[35,34]];
const BABIL=[[47.6,30.1],[48.5,31.6],[47,33.8],[45,35.3],[43,35.7],[41.2,34.4],[42,33],[43.8,31.8],[45.2,30.4]];
const ASSIRIA=[[47.8,30.6],[48.6,31.8],[47.5,34],[46.5,36.5],[44,38],[41,38],[38,37.6],[36,36.8],[34.6,35.5],[34.8,32],[33.4,31.2],[31,31.3],[31.4,28.8],[33,27.8],[34.4,29.6],[35.5,30.6],[38,31.8],[42,31.4],[44.8,30.4]];
const NEOBABIL=[[47.8,30.4],[48.2,32],[46.6,34.6],[44.2,36.8],[41.2,37.2],[38,36.8],[36,36],[35,33],[34.6,31.5],[35.8,30.6],[38,32],[42,32.2],[44.8,30.6]];
const PERSA=[[48.2,29.8],[52,30],[54,34],[52,37.5],[49,37],[48,35],[47.8,32.5]];

Colagem.montar({
  modulo:'Módulo 1: Pré-História e Antiguidade',
  titulo:'Mesopotâmia',
  subtitulo:'Cidades de barro entre dois rios',
  credito:'Figura da estela: recriação gerada por IA a partir da estela do Louvre. Recortes, esquemas e mapa desenhados pelo LAB.',
  ritmo:10000,
  celularGrande:true,
  mesa:{w:5600,h:3700},
  msPalavra:250,
  enem:"O ENEM costuma usar trechos do **Código de Hamurábi** e perguntar o que eles revelam sobre a sociedade: hierarquia, papel do Estado, proteção da propriedade e relação entre lei e religião. Também cobra a ligação entre **rios, irrigação, excedente e Estado**, muitas vezes comparando Mesopotâmia e Egito, e a escrita como instrumento de controle administrativo, não só de cultura.\n\nPegadinhas:\n- Achar que o Código garantia igualdade perante a lei.\n- Ler a lei de talião como vingança sem limite; ela é proporcionalidade.\n- Dizer que o rei mesopotâmico era um deus vivo, como o faraó.\n- Tratar a Mesopotâmia como um país único e não como uma região com vários povos e cidades.",
  estudo:[
  {
    "titulo": "Um vale fértil, mas difícil",
    "texto": "A Mesopotâmia ficava entre os rios **Tigre e Eufrates**, sobretudo no atual Iraque, dentro da faixa de terras férteis que os historiadores modernos chamam de **Crescente Fértil**. O solo trazido pelas cheias era rico, mas no sul quase não chovia e as cheias eram irregulares. Por isso, a agricultura dependia de **irrigação**: canais, diques e reservatórios, construídos e limpos todos os anos. Plantava-se principalmente **cevada**, além de trigo, tâmaras e legumes, e criavam-se ovelhas e cabras.\n\nEssa dependência da água ajuda a explicar a organização política. Obras grandes exigiam muitos trabalhadores, planejamento e controle dos estoques. Templos e palácios passaram a coordenar a produção e a guardar o **excedente**. A falta de pedra, madeira e metais levou ao uso do tijolo de barro e ao **comércio** com regiões distantes. E, como a planície não tinha barreiras naturais, foi invadida muitas vezes: por isso a história mesopotâmica é uma sucessão de povos."
  },
  {
    "titulo": "Poder, religião e sociedade",
    "texto": "O Estado mesopotâmico era **teocrático**: o rei governava em nome dos deuses e cuidava dos templos, mas em geral não era considerado um deus, diferente do faraó. A religião era **politeísta**. Os deuses tinham forma humana e emoções humanas, e cada cidade tinha seu protetor. O templo, muitas vezes no alto de um **zigurate**, era também um centro econômico, com terras, rebanhos, oficinas e armazéns. A vida após a morte era imaginada como um lugar sombrio, sem a riqueza de detalhes da religião egípcia.\n\nA sociedade era hierarquizada. No topo ficavam o rei, os sacerdotes, os chefes militares e os altos funcionários; depois, comerciantes, escribas e artesãos; na base, a grande massa de camponeses; e havia escravos, em geral prisioneiros de guerra ou pessoas endividadas.\n\nOs livros didáticos descrevem essa economia como **modo de produção asiático**, ou **servidão coletiva**: as comunidades de aldeia entregavam **tributos** em produtos e em trabalho ao Estado, que se apresentava como dono da terra. O conceito é de Marx, no século XIX. Os historiadores o usam com cuidado, porque havia também propriedade privada, mercado, empréstimos a juros e dívidas, como mostram as próprias leis da época."
  },
  {
    "titulo": "Escrita e saber",
    "texto": "A **escrita cuneiforme** surgiu em Uruk por volta de 3200 a.C., como ferramenta de administração: registrar cevada, animais, rações e impostos. No começo, os sinais eram pequenos desenhos; com o tempo, viraram combinações de cunhas marcadas na argila. Aprender a escrever levava anos, e os **escribas** formavam um grupo de prestígio. A escrita passou a registrar leis, contratos, cartas, orações e literatura, como a **Epopeia de Gilgamesh**, que inclui uma narrativa de dilúvio.\n\nOs mesopotâmicos também desenvolveram a matemática em **base 60**, origem da divisão da hora em 60 minutos e do círculo em 360 graus, e uma **astronomia** ligada à religião e à previsão do futuro."
  },
  {
    "titulo": "Os povos, em ordem",
    "texto": "- **Sumérios** (a partir de cerca de 3500 a.C.): viviam em **cidades-estado** independentes, como Uruk, Ur e Lagash, governadas pelos **patesis**, que reuniam poder político, militar e religioso. Criaram a escrita cuneiforme e os zigurates.\n- **Acádios** (cerca de 2330 a 2150 a.C.): com **Sargão**, conquistaram e unificaram as cidades sumérias, formando o primeiro império conhecido. Absorveram a cultura suméria numa síntese. O império caiu por revoltas internas e invasões.\n- **Amoritas**, ou Primeiro Império Babilônico (cerca de 1900 a 1600 a.C.): **Hamurábi** unificou a região e criou o **Código de Hamurábi**, com cerca de 280 leis gravadas numa estela de pedra. Depois dele, vieram o declínio e novas invasões.\n- **Assírios** (auge entre cerca de 900 e 612 a.C.): Estado **militarista**, com exército permanente e armas de ferro, que conquistou do Irã ao Egito, deportava povos inteiros e acabou com o reino de Israel em 722 a.C. Caiu diante da aliança de caldeus e medos, que destruíram Nínive em 612 a.C.\n- **Caldeus**, ou Segundo Império Babilônico (626 a 539 a.C.): com **Nabucodonosor II**, a Babilônia viveu seu auge, com grandes construções. Em 587 a.C., ele destruiu Jerusalém e levou parte dos judeus para o exílio. Em 539 a.C., os persas de Ciro conquistaram a Babilônia."
  },
  {
    "titulo": "O Código de Hamurábi",
    "texto": "O Código é uma das fontes mais cobradas. Ele mostra uma sociedade com leis escritas e públicas, mas desigual: as penas dependiam da camada social da vítima e do culpado (homens livres, dependentes e escravos). Muitas leis seguem a **lei de talião**, \"olho por olho, dente por dente\", cujo objetivo era fixar uma pena proporcional ao dano e evitar vinganças sem limite. O texto apresenta o rei como escolhido pelos deuses para fazer justiça, o que reforça a legitimidade de seu poder. Não foi o primeiro código: as leis de Ur-Nammu, de Ur, são mais antigas."
  }
],
  resumo:[
  "Mesopotâmia: vale do Tigre e do Eufrates, no atual Iraque, com agricultura irrigada.",
  "Irrigação exigia trabalho coletivo e organização, o que fortaleceu templos e palácios.",
  "Estado teocrático e religião politeísta, com zigurates como templos.",
  "Modo de produção asiático: comunidades pagam tributo em produtos e trabalho ao Estado.",
  "Escrita cuneiforme, criada pelos sumérios por volta de 3200 a.C., para administrar.",
  "Sequência: sumérios, acádios, amoritas, assírios e caldeus.",
  "Código de Hamurábi: lei escrita, talião e penas diferentes conforme a camada social.",
  "Assírios: militarismo e deportações; caldeus: Nabucodonosor, exílio dos judeus, conquista persa em 539 a.C."
],
  urca:"Não há ligação histórica direta entre a Mesopotâmia e o Ceará, então o tema se estuda do mesmo jeito que para o ENEM. Vale reforçar o que mais aparece: a sequência dos cinco povos, a escrita cuneiforme, o Código de Hamurábi e o conceito de modo de produção asiático. Como comparação para estudar, e não como ligação histórica, pense no semiárido: lá também a falta de chuva regular levou a grandes obras de armazenamento de água, como os açudes, e o controle da água sempre esteve ligado ao poder.",

  pecas:[
    {id:'mapa',tipo:'mapa',base:BASE,x:0,y:0,w:2477,h:1382,rotulo:'Mapa do Mediterrâneo e do Oriente Próximo, com o vale do Tigre e do Eufrates',camadas:[
      {tipo:'rotulo',p:[1190,560],texto:'Golfo Pérsico',classe:'mar',tam:.36,atraso:0},
      {tipo:'etiqueta',ll:true,p:[37.4,25.6],texto:'fronteiras e litoral aproximados',tam:.5,atraso:0},
      // etapa 1: o Crescente Fértil, os dois rios e o vale
      {tipo:'regiao',pts:CRESC,suave:false,estilo:'listra',etapas:[0],atraso:A(1500)},
      {tipo:'etiqueta',p:[930,292],texto:'Crescente Fértil, nome moderno',tam:.5,etapas:[0],atraso:A(2600)},
      {tipo:'rota',estilo:'rio',pts:EUF,dur:2.4,largura:4,desde:0,atraso:A(4500)},
      {tipo:'rota',estilo:'rio',pts:TIG,dur:2.4,largura:4,desde:0,atraso:A(5000)},
      {tipo:'regiao',pts:VALE1,suave:false,cor:'coral',opac:.8,etapas:[0,1,2],atraso:A(7000)},
      {tipo:'regiao',pts:VALE2,suave:false,cor:'coral',opac:.8,etapas:[0,1,2],atraso:A(7000)},
      {tipo:'rota',estilo:'rio',pts:[[1086,434],[1104,452],[1124,466]],dur:1,largura:4,desde:0,atraso:A(8800)},
      {tipo:'rota',estilo:'rio',pts:[[1100,440],[1128,452],[1152,460]],dur:1,largura:4,desde:0,atraso:A(9200)},
      {tipo:'rota',estilo:'rio',pts:[[1112,458],[1134,476],[1154,490]],dur:1,largura:4,desde:0,atraso:A(9600)},
      {tipo:'rotulo',p:[972,358],texto:'Eufrates',classe:'terra',tam:.5,giro:14,etapas:[0],atraso:A(5600)},
      {tipo:'rotulo',p:[1056,382],texto:'Tigre',classe:'terra',tam:.5,giro:62,etapas:[0],atraso:A(5800)},
      // etapa 4: cidades-estado sumérias (posições levemente afastadas para caber os nomes)
      {tipo:'cidade',ll:true,p:[44.6,32.7],nome:'Nippur',lado:'e',tam:.3,etapas:[3],atraso:A(1500)},
      {tipo:'cidade',ll:true,p:[46.2,32.3],nome:'Umma',lado:'d',tam:.3,etapas:[3],atraso:A(2300)},
      {tipo:'cidade',ll:true,p:[45.0,31.75],nome:'Uruk',lado:'e',tam:.3,etapas:[3],atraso:A(3100)},
      {tipo:'cidade',ll:true,p:[46.6,31.4],nome:'Lagash',lado:'d',tam:.3,etapas:[3],atraso:A(3900)},
      {tipo:'cidade',ll:true,p:[45.5,30.85],nome:'Ur',lado:'e',tam:.3,etapas:[3],atraso:A(4700)},
      {tipo:'pulso',ll:true,pts:[[46.0,31.75],[46.95,32.0]],largura:16,cor:'#d62e2e',etapas:[3],atraso:A(5600)},
      {tipo:'rota',ll:true,pts:[[46.0,31.75],[46.95,32.0]],tracejada:false,cor:'#d62e2e',largura:3,dur:.8,etapas:[3],atraso:A(5600)},
      {tipo:'etiqueta',ll:true,p:[45.2,30.05],texto:'fronteira disputada',tam:.28,etapas:[3],atraso:A(6200)},
      // etapa 5: o império acádio, que cresce e se rasga
      {tipo:'regiao',ll:true,pts:ACAD,suave:false,cor:'coral',opac:.75,etapas:[4],atraso:A(900),dura:A(7000)},
      {tipo:'regiao',ll:true,pts:F1,suave:false,cor:'coral',opac:.75,etapas:[4],atraso:A(7600)},
      {tipo:'regiao',ll:true,pts:F2,suave:false,cor:'coral',opac:.75,etapas:[4],atraso:A(7600)},
      {tipo:'regiao',ll:true,pts:F3,suave:false,cor:'coral',opac:.75,etapas:[4],atraso:A(7600)},
      {tipo:'cidade',ll:true,p:[44.2,33.1],nome:'Acádia',capital:true,lado:'d',tam:.5,etapas:[4],atraso:A(1800)},
      {tipo:'etiqueta',ll:true,p:[40.2,30.1],texto:'local aproximado:',tam:.4,etapas:[4],atraso:A(2400)},
      {tipo:'etiqueta',ll:true,p:[40.2,29.5],texto:'a cidade nunca foi encontrada',tam:.4,etapas:[4],atraso:A(2600)},
      {tipo:'etiqueta',ll:true,p:[38.6,38.5],texto:'cerca de 2330 a.C.',cor:'amarelo',tam:.6,etapas:[4],atraso:A(600)},
      // etapa 6: a Babilônia de Hamurábi
      {tipo:'regiao',ll:true,pts:BABIL,suave:false,cor:'coral',opac:.8,etapas:[5],atraso:A(900)},
      {tipo:'etiqueta',ll:true,p:[38.2,38.5],texto:'cerca de 1792 a 1750 a.C.',cor:'amarelo',tam:.6,etapas:[5],atraso:A(1600)},
      // etapa 7: o império assírio
      {tipo:'pulso',ll:true,pts:[[43.26,35.46],[43.15,36.36]],largura:30,cor:'#6f7782',etapas:[6],atraso:A(500)},
      {tipo:'regiao',ll:true,pts:ASSIRIA,suave:false,cor:'#69727d',opac:.78,mistura:false,etapas:[6],atraso:A(1800),dura:A(13500)},
      {tipo:'cidade',ll:true,p:[43.26,35.46],nome:'Assur',lado:'e',tam:.5,etapas:[6],atraso:A(1200)},
      {tipo:'cidade',ll:true,p:[43.15,36.36],nome:'Nínive',capital:true,lado:'d',tam:.55,etapas:[6],atraso:A(1500)},
      {tipo:'rota',ll:true,pts:[[35.2,32.3],[36,34.5],[38.5,36],[41,36.5],[43.2,35.5]],movel:'ponto',volta:7000,dur:2,largura:4,etapas:[6],atraso:A(4200)},
      {tipo:'rota',ll:true,pts:[[44.4,32.5],[44,34.2],[43.26,35.46]],movel:'ponto',volta:6000,dur:1.4,largura:4,etapas:[6],atraso:A(5600)},
      {tipo:'rota',ll:true,pts:[[35.5,34],[38.5,36.2],[43.15,36.36]],movel:'ponto',volta:7500,dur:1.6,largura:4,etapas:[6],atraso:A(6600)},
      {tipo:'etiqueta',ll:true,p:[35.2,26.8],texto:'cerca de 900 a 612 a.C.',cor:'amarelo',tam:.6,etapas:[6],atraso:A(900)},
      {tipo:'rota',ll:true,pts:[[42.9,36.8],[43.4,35.9]],tracejada:false,cor:'#d62e2e',largura:7,dur:.5,etapas:[6],atraso:A(11500)},
      {tipo:'rota',ll:true,pts:[[42.9,35.9],[43.4,36.8]],tracejada:false,cor:'#d62e2e',largura:7,dur:.5,etapas:[6],atraso:A(12000)},
      {tipo:'etiqueta',ll:true,p:[43.8,37.9],texto:'612 a.C.: Nínive cai',tam:.55,etapas:[6],atraso:A(12400)},
      // etapa 8: a Babilônia volta, com Nabucodonosor II
      {tipo:'regiao',ll:true,pts:NEOBABIL,suave:false,cor:'coral',opac:.8,etapas:[7],atraso:A(900)},
      {tipo:'cidade',ll:true,p:[35.2,31.8],nome:'Jerusalém',lado:'e',tam:.5,etapas:[7],atraso:A(1500)},
      {tipo:'rota',ll:true,pts:[[35.2,31.8],[35.6,33],[37.5,35],[40.5,34.8],[42.8,33.8],[44.4,32.5]],movel:'ponto',volta:8000,dur:2.4,largura:4,etapas:[7],atraso:A(2400)},
      {tipo:'etiqueta',ll:true,p:[36.6,31.7],texto:'587 a.C.',cor:'amarelo',tam:.6,etapas:[7],atraso:A(3200)},
      {tipo:'regiao',ll:true,pts:PERSA,suave:false,cor:'#1fa39a',opac:.8,etapas:[7],atraso:A(14500)},
      {tipo:'etiqueta',ll:true,p:[49.6,38.6],texto:'539 a.C.: os persas entram',cor:'amarelo',tam:.55,etapas:[7],atraso:A(15400)},
      {tipo:'etiqueta',ll:true,p:[44.2,27.6],texto:'Próximo: Egito, e depois os persas',tam:.5,etapas:[7],atraso:A(16200)},
      {tipo:'cidade',ll:true,p:[44.4,32.5],nome:'Babilônia',capital:true,lado:'e',tam:.55,etapas:[5,7],atraso:A(700)}
    ]},
    {id:'tempo',tipo:'tempo',x:1360,y:1120,w:1200,h:110,giro:.4,
     marcos:[{p:4,t:'cerca de 3500 a.C.',etapa:0},{p:22,t:'cerca de 3200 a.C.',etapa:0},{p:40,t:'cerca de 2330 a.C.',etapa:0},{p:58,t:'cerca de 1792 a.C.',etapa:0},{p:76,t:'612 a.C.',etapa:0},{p:94,t:'539 a.C.',cor:'petroleo',etapa:0}]},
    {id:'n-datas',tipo:'nota',x:1360,y:1240,w:640,giro:-.8,texto:'a régua não está em escala; datas muito antigas variam algumas décadas'},
    {id:'n-chuva',tipo:'nota',x:1650,y:900,w:330,giro:-2,texto:'pouca chuva, muita água no rio'},

    /* zona 2: deuses, templos e reis */
    {id:'zig',tipo:'icone',nome:'zigurate',x:2740,y:120,w:380,h:380,giro:-2,rotulo:'Recorte: zigurate de Ur, com escadarias e um santuário no topo'},
    {id:'et-zig',tipo:'etiqueta',x:3170,y:120,w:240,h:64,texto:'zigurate',clicavel:false},
    {id:'vento',tipo:'icone',nome:'vento',x:3520,y:100,w:180,h:180,giro:2,rotulo:'Recorte: o vento, sinal de Enlil'},
    {id:'et-ven',tipo:'etiqueta',x:3730,y:150,w:380,h:64,texto:'Enlil, deus do vento',clicavel:false},
    {id:'estrela',tipo:'icone',nome:'estrela8',x:3520,y:330,w:180,h:180,giro:-2,rotulo:'Recorte: estrela de oito pontas, sinal de Inanna'},
    {id:'et-est',tipo:'etiqueta',x:3730,y:365,w:440,h:110,texto:'Inanna, deusa do amor e da guerra',clicavel:false},
    {id:'sol',tipo:'icone',nome:'sol',x:3520,y:560,w:180,h:180,giro:1.5,rotulo:'Recorte: disco solar, sinal de Shamash'},
    {id:'et-sha',tipo:'etiqueta',x:3730,y:575,w:460,h:110,texto:'Shamash, deus do Sol e da justiça',clicavel:false},
    {id:'bal',tipo:'icone',nome:'balanca',x:3120,y:800,w:300,h:300,giro:1.5,rotulo:'Recorte: balança que compara o rei mesopotâmico e o faraó'},
    {id:'et-rei',tipo:'etiqueta',x:2680,y:870,w:420,h:150,texto:'rei mesopotâmico: representante dos deuses',clicavel:false},
    {id:'et-far',tipo:'etiqueta',x:3450,y:900,w:380,h:80,texto:'faraó: deus vivo',clicavel:false},

    /* zona 3: o modo de produção asiático */
    {id:'trib',tipo:'tributo',x:2700,y:1700,w:900,h:640,giro:-.8,rotulo:'Esquema: aldeias entregam cevada e dias de trabalho ao templo e ao palácio, que devolvem rações'},
    {id:'n-marx',tipo:'nota',x:3690,y:1740,w:380,giro:1.8,texto:'nome dado por Marx; os mesopotâmios não o usavam'},
    {id:'et-priv',tipo:'etiqueta',x:3690,y:2100,w:400,h:120,texto:'terras privadas, comércio, dívidas',clicavel:false},

    /* zona 4: escrita cuneiforme */
    {id:'tab',tipo:'icone',nome:'tabua',x:150,y:1800,w:380,h:380,giro:-2,rotulo:'Recorte: tabuinha de argila com escrita cuneiforme'},
    {id:'pas',tipo:'icone',nome:'cunha-passos',x:580,y:1790,w:380,h:380,giro:1.5,rotulo:'Recorte: o desenho de uma espiga vira linhas simples e depois cunhas'},
    {id:'et-pat',tipo:'etiqueta',x:1010,y:1850,w:400,h:110,texto:'patesi, também lido ensi',clicavel:false},
    {id:'et-tab',tipo:'etiqueta',x:150,y:2230,w:380,h:64,texto:'tabuinha de argila',clicavel:false},
    {id:'et-pas',tipo:'etiqueta',x:580,y:2230,w:380,h:64,texto:'do desenho à cunha',clicavel:false},
    {id:'n-60',tipo:'nota',x:1010,y:2090,w:420,giro:-1.5,texto:'contavam em base 60: daí os 60 minutos da hora'},

    /* zona 5: Sargão */
    {id:'sar',tipo:'icone',nome:'sargao',x:150,y:2830,w:380,h:380,giro:-1.5,rotulo:'Retrato em traço de uma cabeça real barbada, no estilo da arte acádia'},
    {id:'et-sar',tipo:'etiqueta',x:580,y:2870,w:520,h:110,texto:'talvez Sargão ou seu neto Naram-Sin',clicavel:false},
    {id:'et-sum',tipo:'etiqueta',x:580,y:3060,w:260,h:64,texto:'sumérios',clicavel:false},
    {id:'et-aca',tipo:'etiqueta',x:860,y:3060,w:260,h:64,texto:'acádios',clicavel:false},
    {id:'n-sint',tipo:'nota',x:600,y:3200,w:480,giro:1.2,texto:'síntese: uma cultura nova, com raízes nas duas'},

    /* zona 6: Hamurábi */
    {id:'hamu',tipo:'foto',img:'historia-meso-hamurabi',x:1650,y:2750,w:430,h:576,giro:-1.5,fita:{x:14,g:-3},rotulo:'Recriação do topo da estela de Hamurábi: o rei diante do deus Shamash'},
    {id:'n-lei',tipo:'nota',x:2160,y:2790,w:400,giro:1.8,texto:'a lei vem dos deuses; o rei a aplica'},
    {id:'camadas',tipo:'piramide',x:2160,y:3090,w:480,h:223,giro:1,alturaCamada:84,rotulo:'Três camadas sociais: homens livres, dependentes e escravos',
     camadas:[{t:'Homens livres'},{t:'Dependentes'},{t:'Escravos'}]},
    {id:'doc',tipo:'fonte',x:2760,y:2720,w:580,h:580,giro:-1,rotulo:'Fonte histórica: Código de Hamurábi',
     texto:'“Se um homem livre cegar o olho de outro homem livre, cegarão o olho dele. Se cegar o olho de um dependente, pagará uma mina de prata. Se cegar o olho do escravo de um homem livre, pagará metade do preço do escravo.”',
     ref:'Código de Hamurábi, artigos 196, 198 e 199, Babilônia, cerca de 1754 a.C. Paráfrase da equipe a partir da tradução de L. W. King, 1910.',
     resposta:'Duas coisas. Entre iguais vale a ==lei de talião==: olho por olho, entre homens livres. Mas o mesmo crime tinha pena diferente conforme a posição da vítima: contra um dependente, a pena virava multa; contra um escravo, pagava-se metade do preço dele ao dono, como se fosse um bem. A lei era escrita e pública, mas ==não era igual para todos==. Quem fala é o rei, que mandou gravar a pedra para se mostrar justo: é também propaganda.'},

    /* zona 7: cerco assírio */
    {id:'cerco',tipo:'icone',nome:'cerco',x:4700,y:1650,w:460,h:460,giro:1.5,rotulo:'Recorte: soldados assírios e uma rampa de cerco diante de uma muralha'},

    {id:'et-cer',tipo:'etiqueta',x:4700,y:2150,w:460,h:110,texto:'relevo de cerco, inspirado em Laquis',clicavel:false},

    /* zona 8: Babilônia de Nabucodonosor */
    {id:'porta',tipo:'icone',nome:'porta-ishtar',fundo:false,x:4300,y:2750,w:480,h:480,giro:-1,rotulo:'Recorte: a Porta de Ishtar, de tijolos azuis com animais em relevo'},
    {id:'et-por',tipo:'etiqueta',x:4300,y:3260,w:480,h:64,texto:'Porta de Ishtar, Babilônia',clicavel:false},
    {id:'n-jard',tipo:'nota',x:4860,y:2800,w:460,giro:1.6,texto:'os Jardins Suspensos são citados por autores gregos, mas nunca foram encontrados'}
  ],

  etapas:[
    {titulo:"A terra entre rios",mostra:['mapa'],so:['n-chuva','tempo','n-datas'],
     foco:[200,60,1900,1060],focoM:[1560,560,640,760],tomadas:[[3800,[1340,520,1240,830]],[12000,[1340,1080,1260,330]]],tomadasM:[[5000,[1700,620,520,400]],[9500,[1340,1090,520,430]],[14000,[1840,1090,520,430]],[17000,[2150,1090,420,330]],[20000,[1530,1200,580,300]]],tempo:20000,
          texto:"==Mesopotâmia== quer dizer, em grego, terra entre rios: o vale do ==Tigre e do Eufrates==, que nascem nas montanhas da atual Turquia e correm até o Golfo Pérsico, atravessando o atual Iraque. No sul chove pouco, e as cheias vêm na primavera, com o degelo das montanhas, às vezes violentas e fora de hora. A lama deixada pelos rios era fértil, mas para plantar era preciso cavar canais, erguer diques e guardar água: a ==agricultura irrigada== era a base da economia. Essas obras exigiam muita gente trabalhando junta e alguém para organizar. Faltavam pedra e madeira, por isso se construía com tijolos de barro. Sem barreiras naturais, a região era fácil de invadir: vários povos se sucederam ali por quase três mil anos."},
    {titulo:"Deuses, templos e reis",so:['zig','et-zig','vento','et-ven','estrela','et-est','sol','et-sha','bal','et-rei','et-far'],
     foco:[2660,60,1560,960],focoM:[2720,100,720,440],tomadasM:[[4500,[3490,80,700,520]],[7000,[3490,540,720,260]],[9000,[2690,820,760,330]],[13000,[3100,820,760,330]]],tempo:12000,
     tracos:[{tipo:'circulo',peca:'zig',x:50,y:28,w:18,h:15,atraso:A(1500)},{tipo:'seta',de:{peca:'zig',x:60,y:26},para:{peca:'et-zig',x:0,y:50},curva:.25,atraso:A(2400)}],
     texto:"O poder era ==teocrático==: o rei governava em nome do deus da cidade e, em geral, não era ele mesmo um deus, como o faraó egípcio. A religião era ==politeísta==, com deuses parecidos com pessoas, ligados à natureza e tão imprevisíveis quanto as cheias: Enlil, do vento; Inanna, do amor e da guerra; Shamash, do Sol e da justiça. Cada cidade tinha seu deus protetor. No centro dela ficava o templo, muitas vezes no alto de um ==zigurate==, torre em degraus de tijolos de barro. O zigurate não era túmulo, como as pirâmides: era a casa do deus. Os templos tinham terras, oficinas e armazéns, e os sacerdotes observavam os astros para prever o futuro."},
    {titulo:"O modo de produção asiático",so:['trib','n-marx','et-priv'],
     foco:[2660,1670,1450,740],focoM:[2680,1690,940,680],tomadasM:[[7000,[3660,1710,440,560]]],tempo:14000,
     tracos:[{tipo:'circulo',peca:'et-priv',x:50,y:50,w:112,h:170,cor:'seta',atraso:A(6500)}],
     texto:"Os camponeses viviam em aldeias e entregavam parte da colheita e dias de trabalho ao templo e ao palácio. Esse trabalho obrigatório servia para cavar canais, erguer muralhas e construir templos. O Estado guardava o excedente nos armazéns e pagava rações aos trabalhadores. Muitos livros chamam isso de ==modo de produção asiático== ou ==servidão coletiva==: a terra era, em tese, do Estado ou dos deuses, e a comunidade inteira, e não cada pessoa, devia ==tributo== ao Estado. O conceito vem de Marx, no século XIX, que via nas obras de irrigação a origem de um Estado forte. Hoje ele é discutido: na Mesopotâmia também havia terras privadas, comerciantes, empréstimos e dívidas."},
    {titulo:"Sumérios: cidades e cunhas",so:['tab','pas','et-pat','n-60','et-tab','et-pas'],
     foco:[1730,680,500,300],foco2:[100,1740,1360,580],foco2Em:7500,focoM:[1830,640,330,420],tomadasM:[[7500,[130,1780,420,540]],[11000,[560,1780,420,540]],[14500,[990,1830,460,380]]],tempo:17000,
     tracos:[{tipo:'circulo',peca:'pas',x:50,y:88,w:68,h:22,cor:'amarelo',atraso:A(10500)}],
     texto:"Os sumérios viviam em ==cidades-estado== independentes, como Uruk, Ur e Lagash, cada uma com muralha, exército e deus protetor; elas guerreavam por terras e água. O governante, o ==patesi==, concentrava o poder político, militar e religioso, e sacerdotes e burocratas administravam o grão. Para controlar tudo, criaram, por volta de 3200 a.C., em Uruk, a escrita ==cuneiforme==, marcas em forma de cunha feitas com um estilete na argila mole. Ela nasceu para contar sacos de cevada e ovelhas; os primeiros sinais eram desenhos, que viraram cunhas. Só escribas treinados por anos sabiam usá-la. Depois serviu para leis, cartas e poemas. Os sumérios contavam em base 60, que ainda usamos nas horas e nos ângulos."},
    {titulo:"Acádios: o primeiro império",so:['sar','et-sar','et-sum','et-aca','n-sint'],
     foco:[1560,500,760,560],focoM:[1640,540,520,700],foco2:[100,2790,1060,520],foco2Em:9500,tomadasM:[[9500,[130,2800,420,430]],[12500,[560,2850,560,470]]],tempo:18000,
     tracos:[{tipo:'seta',de:{peca:'et-sum',x:50,y:100},para:{peca:'n-sint',x:30,y:0},curva:.25,atraso:A(12600)},{tipo:'seta',de:{peca:'et-aca',x:50,y:100},para:{peca:'n-sint',x:70,y:0},curva:-.25,atraso:A(13400)}],
     texto:"Por volta de 2330 a.C., ==Sargão==, rei de Acádia, conquistou e ==unificou== as cidades sumérias e levou seu exército até o Mediterrâneo. Formou o império acádio-sumeriano, considerado o primeiro império conhecido: um só rei governando várias cidades e povos, com governadores de confiança e tropas permanentes. Os acádios falavam uma língua semita, diferente do sumério, mas adotaram a escrita cuneiforme e os deuses sumérios, numa ==síntese cultural==. O acadiano, escrito em cunhas, virou por séculos a língua da diplomacia no Oriente Próximo. O império durou menos de dois séculos. Caiu por volta de 2150 a.C., entre revoltas das cidades, que queriam a independência de volta, e invasões de povos das montanhas."},
    {titulo:"Hamurábi e a lei escrita",so:['hamu','n-lei','camadas','doc'],fonte:'doc',
     foco:[1660,520,700,520],focoM:[1700,560,560,700],tomadas:[[5000,[1620,2700,1060,660]],[11500,[2700,2680,700,700]]],tomadasM:[[5000,[1640,2730,460,600]],[9000,[2140,2780,520,580]],[11500,[2770,2700,520,600]]],tempo:20000,
     tracos:[{tipo:'circulo',peca:'hamu',x:49,y:40,w:20,h:11,atraso:A(6500)},{tipo:'seta',de:{peca:'hamu',x:60,y:40},para:{peca:'n-lei',x:0,y:50},curva:-.2,atraso:A(7400)}],
     texto:"Os ==amoritas==, povo semita que entrou na região por volta de 2000 a.C., fizeram da Babilônia uma grande capital. Seu rei ==Hamurábi== (cerca de 1792 a 1750 a.C.) conquistou a Mesopotâmia e mandou gravar numa pedra cerca de 280 leis: o ==Código de Hamurábi==. Elas tratam de comércio, salários, dívidas, família, heranças e até erros de médicos e construtores. Muitas seguem a lei de talião, olho por olho, que limita a pena ao tamanho do dano. Mas a pena mudava conforme a posição social da vítima: homem livre, dependente ou escravo. Não foi o primeiro código de leis, mas é o mais famoso. Após a morte de Hamurábi, vieram o declínio e novas invasões."},
    {titulo:"Assírios: o império do medo",so:['cerco','et-cer'],
     foco:[1480,500,860,640],focoM:[1450,540,600,780],foco2:[4640,1620,560,680],foco2Em:12500,tomadasM:[[12500,[4650,1640,540,640]]],tempo:18000,
     texto:"Do norte vieram os ==assírios==, de espírito guerreiro, com exército permanente, carros de guerra, cavalaria, armas de ferro e máquinas de cerco. Entre cerca de 900 e 612 a.C., formaram um império do Irã ao Egito, um Estado ==militarista==, dividido em províncias com governadores, estradas e mensageiros. Para quebrar revoltas, ==deportavam== povos inteiros para longe de sua terra e escravizavam vencidos; assim acabou o reino de Israel, em 722 a.C. Os reis exibiam essa violência em relevos nos palácios, como propaganda. Mas também guardavam saber: em Nínive, o rei Assurbanipal reuniu milhares de tabuinhas numa biblioteca. A violência criou inimigos: caldeus e medos se aliaram e destruíram Nínive em 612 a.C."},
    {titulo:"Caldeus: a Babilônia volta",so:['porta','et-por','n-jard'],
     foco:[1420,500,900,640],focoM:[1450,540,600,780],tomadas:[[8500,[4260,2710,1120,640]],[13500,[1420,500,900,640]]],tomadasM:[[8500,[4270,2740,540,640]],[12000,[4830,2780,520,360]],[13500,[1700,540,600,780]]],tempo:20000,
     texto:"Os ==caldeus== formaram o ==Segundo Império Babilônico==, com a Babilônia como centro político, comercial e cultural. Com ==Nabucodonosor II== (605 a 562 a.C.) vieram conquistas e grandes obras: muralhas, palácios, um enorme zigurate e a Porta de Ishtar, de tijolos azuis vitrificados. Os astrônomos da Babilônia registravam o céu com precisão. Em 587 a.C., Nabucodonosor destruiu Jerusalém e seu Templo e levou parte dos judeus, sobretudo a elite, para a Babilônia: o chamado cativeiro, ou exílio, da Babilônia. Em 539 a.C., a cidade caiu diante dos persas de Ciro, que permitiu a volta dos judeus. A Mesopotâmia deixou de ser centro de impérios próprios e passou a fazer parte de impérios estrangeiros."}
  ]
});
})();
