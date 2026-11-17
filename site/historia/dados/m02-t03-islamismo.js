/* Módulo 2, tópico 3: Islamismo. Roteiro revisado: docs/revisao-historia/m02-t03-islamismo.md
   Formato dos dados: docs/historia/MOTOR.md. Recortes e esquemas próprios: recortes-m02c.js (carregado depois de recortes.js).
   Regras religiosas: o profeta nunca é representado; sem crescente; sem versos árabes reais (só escrita abstrata); tom respeitoso.
   Mapa: base historia-mapa-mediterraneo (1376 x 768), escala 2 na mesa (2752 x 1536). Os pontos do mapa estão em pixels da base,
   conferidos sobre a imagem (a base é desenhada à mão e o Mar Vermelho dela fica mais a leste que a geografia real).
   A base acaba perto de Meca e não mostra o Iêmen: a rota do Iêmen sai pela borda de baixo, e o sul da Península Arábica não aparece.
   Mesa em zonas: mapa (alto), fita do tempo, Caaba e folhinha (à direita do mapa), fonte e escrita abstrata, livro e Abraão,
   cinco pilares, jihad, árvore dos califas e algarismos. */
(function(){
const A=n=>Colagem.reduz?0:n;
const S=2;
const MOB=window.innerWidth<600;
const M=(x,y)=>[x*S,y*S];
const FD=(cx,cy,w,asp)=>{const h=w/(asp||1.44);return [Math.round((cx-w/2)*S),Math.round((cy-h/2)*S),Math.round(w*S),Math.round(h*S)];};
const FMo=(cx,cy,w)=>FD(cx,cy,w,.64);

// ---- pontos do mapa, em pixels da base
const MECA=[1030,716],MEDINA=[1004,645],DAMASCO=[945,432],BAGDA=[1092,437],CAIRO=[838,511],CORDOBA=[131,311],POITIERS=[252,96];
const ARABIA=[[915,462],[1040,466],[1135,492],[1172,510],[1232,592],[1264,640],[1342,652],[1342,737],[1030,737],[1020,730],[1004,700],[1000,672],[985,652],[962,626],[950,602],[914,574],[906,540],[908,500]];
const SIRIA=[[905,378],[975,372],[1040,410],[1110,425],[1185,505],[1135,492],[1040,466],[915,462]];
const EGITO=[[716,500],[880,500],[900,520],[900,640],[716,640]];
const PERSIA=[[1060,400],[1100,380],[1180,360],[1342,330],[1342,652],[1264,640],[1232,592],[1185,505],[1110,425]];
const NAFRICA=[[45,345],[125,350],[220,345],[330,357],[420,345],[440,372],[560,460],[610,476],[716,500],[716,590],[45,590]];
const IBERIA=[[50,218],[150,214],[230,218],[260,236],[255,262],[240,290],[180,350],[120,348],[65,320],[48,250]];
const DOTS0=[[1035,502],[1137,560],[1084,684],[939,522],[1181,716],[1157,568],[949,494],[1028,681],[1187,562],[909,517],[1031,619],[1098,542],[1261,649],[997,616],[1132,697],[1081,665],[953,593],[899,641],[1214,621],[1283,715],[1108,640],[1065,641],[908,668],[1068,696],[1273,694],[1014,573],[965,524],[992,592],[1163,532],[1057,614],[1127,628],[1312,671],[1068,569],[980,505],[1043,476],[929,559],[892,696],[1001,555],[1055,495],[1104,592],[1044,533],[891,717],[1134,501],[1133,724],[1294,649],[1136,671],[1270,726],[1289,678],[893,537],[986,523],[1193,676],[1073,716],[943,466],[943,706],[1050,585],[1160,704],[1121,605],[1091,511],[1036,601],[999,536],[1174,597],[1126,648],[1109,714],[1216,697],[1256,702],[1304,721],[1071,593],[974,547],[911,726],[1010,497],[1154,650],[920,691],[1133,526],[933,505],[1030,544],[1000,466],[971,589],[1118,686],[1210,725],[1015,527],[1240,638],[1067,549],[1232,680],[1208,648],[1148,630],[1181,644],[916,533],[1235,723],[1117,565],[1128,587],[1104,494],[882,594],[948,554],[881,663],[1325,653],[1100,610],[934,481],[1066,522],[1082,531],[1200,710],[1118,512],[987,574],[1311,699],[1051,682],[1239,703],[1171,550],[1166,628],[1082,618],[1084,639],[1247,671],[942,577],[1123,548],[1176,578],[976,625],[1041,663],[1033,576],[1216,596],[1215,673],[1050,633],[1172,671],[1200,585],[1078,489],[882,645],[927,711],[1063,663],[888,623],[1157,602],[1089,725],[1027,636],[1176,690],[1182,624],[1096,565],[997,508],[1052,512],[935,540],[1279,661],[902,501],[1011,596],[1141,609],[1151,549],[1011,675],[1049,562],[1156,683],[1054,708],[1227,655],[985,642],[917,477],[966,465],[1198,693],[1154,511],[1266,674],[991,487],[1198,613],[1112,530],[1084,553],[970,609],[1099,693],[1112,658],[1061,472],[1073,505],[966,571],[1293,698],[1100,675],[1331,709],[954,724],[1085,581],[1200,632],[1009,628],[1253,721],[889,678],[1030,519],[1190,659],[918,494],[909,705],[1146,583],[952,536],[959,508],[1085,702],[1015,695],[896,554],[1245,621],[982,470]];
const inPoly=(p,P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){if((P[i][1]>p[1])!==(P[j][1]>p[1])&&p[0]<(P[j][0]-P[i][0])*(p[1]-P[i][1])/(P[j][1]-P[i][1])+P[i][0])c=!c;}return c;};
const DOTS=DOTS0.filter(q=>inPoly([q[0]-8,q[1]],ARABIA));
// rotas, em pixels da base
const R_CARAVANA=[[1078,768],[1062,744],[1046,726],[1032,716],[1024,692],[1014,664],[1004,645],[986,600],[966,545],[952,490],[945,432]];
const R_IDA=[[1026,712],[1020,690],[1012,668],[1005,649]];
const R_VOLTA=[[1012,650],[1026,672],[1038,694],[1034,712]];
const R_BAGDA_LESTE=[[1092,437],[1140,452],[1200,470],[1290,500],[1338,512]];
const R_BAGDA_MAR=[[1092,437],[1120,460],[1150,485],[1180,508],[1215,535],[1255,560],[1300,578],[1338,572]];
const R_BAGDA_OESTE=[[1092,437],[1010,440],[945,432],[900,470],[838,511],[790,524],[730,524],[690,520],[640,538],[590,538],[548,516],[520,492],[480,474],[446,466],[428,420],[410,368],[340,364],[260,364],[200,362],[160,364],[130,360]];
const R_CORDOBA=[[130,360],[122,340],[131,311]];

Colagem.montar({
  modulo:'Módulo 2: Idade Média e início da Idade Moderna',
  titulo:'Islamismo',
  subtitulo:'Uma fé nascida no deserto e um império de Córdoba a Bagdá',
  credito:'Mapa: base do Mediterrâneo, com rotas, regiões e etiquetas desenhadas pelo LAB. Recortes, esquemas e escrita abstrata desenhados em código. O profeta não é representado, por respeito à tradição islâmica.',
  ritmo:9000,
  msPalavra:250,
  celularGrande:true,
  mesa:{w:3700,h:12000},
  enem:`O ENEM cobra a origem do Islã na Arábia no ==século VII==, a ==Hégira== (622) como início do calendário, os ==cinco pilares== e a expansão, com a presença muçulmana na Península Ibérica e o legado cultural (algarismos, álgebra, palavras árabes no português). As questões costumam combater preconceitos.

Pegadinhas:
- Dizer que todo árabe é muçulmano e que todo muçulmano é árabe.
- Reduzir jihad a "guerra santa".
- Situar o Islã no século VIII.
- Confundir islamismo com os atos de grupos extremistas.`,
  urca:`Há ligações reais e verificáveis. Muitas palavras do português vêm do árabe, entre elas ==algodão==, ==açúcar==, ==azeite== e ==alface==; o algodão, aliás, foi um produto importante da economia cearense. A presença moura na Península Ibérica faz parte da herança que Portugal trouxe ao Brasil. E, no Nordeste, o ==Levante dos Malês== (Bahia, 1835) foi uma revolta de africanos escravizados muçulmanos.

Não invente ligações além dessas: estude o Islã como no ENEM, com atenção aos pilares, à Hégira e à expansão.`,
  estudo:[
  {titulo:'A Arábia antes do Islã',texto:`A **Península Arábica** é, em grande parte, deserto. No século VI, viviam ali tribos árabes, muitas de **beduínos**, pastores nômades organizados em clãs e muitas vezes rivais. Nos oásis e nas cidades de comércio, como **Meca**, a vida girava em torno das caravanas que ligavam o Índico ao Mediterrâneo.

A religião dominante era politeísta, e Meca era centro de peregrinação por causa da **Caaba**, santuário em forma de cubo com ídolos de várias tribos. Havia também comunidades de judeus e de cristãos. Nas fronteiras, estavam dois impérios, o Bizantino e o Persa, exaustos por guerras entre si.`},
  {titulo:'Muhammad, a revelação e a Hégira',texto:`**Muhammad** (Maomé) nasceu em Meca por volta de 570 e era comerciante de caravanas. Por volta de 610, segundo a tradição islâmica, recebeu as primeiras revelações de Deus por meio do **anjo Gabriel**. Passou a pregar o **monoteísmo**: um só Deus, **Allah** (palavra árabe para Deus). A pregação ameaçava os interesses dos comerciantes de Meca, que lucravam com as peregrinações aos ídolos, e os primeiros fiéis sofreram perseguição.

Em 622, Muhammad e seus seguidores migraram para Yathrib, que passou a se chamar **Medina**. Essa migração é a **Hégira**, marco do ano 1 do **calendário islâmico**. Em Medina, ele foi líder religioso, político e militar, e uniu tribos rivais. Em 630, voltou a Meca, retirou os ídolos da Caaba e fez dela o centro do Islã. Morreu em 632. O Islã surgiu, portanto, no **século VII**; é erro comum dizer século VIII.`},
  {titulo:'Crenças e práticas',texto:`**Islã** significa submissão a Deus, e **muçulmano** é quem se submete. O livro sagrado é o **Alcorão**, dividido em suratas. As revelações foram recitadas por Muhammad, memorizadas e escritas pelos seguidores e reunidas depois de sua morte. O Islã reconhece profetas anteriores, como Abraão, Moisés e Jesus, e vê Muhammad como o último. Como o monoteísmo é central, a tradição islâmica evita representar o profeta em imagens, e a arte desenvolveu a caligrafia e os desenhos geométricos. Por isso esta página não traz nenhuma imagem dele.

Os **cinco pilares** são deveres de todo fiel:
- a profissão de fé: não há deus além de Allah, e Muhammad é seu profeta;
- a oração cinco vezes ao dia, voltado para Meca;
- o jejum no mês do **Ramadã**, do nascer ao pôr do sol;
- o **zakat**, doação de 2,5% das economias aos pobres;
- a peregrinação a Meca, uma vez na vida, para quem tem condições.

**Jihad** significa esforço no caminho de Deus. Há a jihad **interna**, a luta contra os próprios vícios, que muitos sábios consideram a mais importante, e a **externa**, que inclui a defesa da comunidade, inclusive pelas armas. Reduzi-la a "guerra santa" é simplificação, e usar o termo para justificar violência é ação de grupos extremistas.`},
  {titulo:'Califas e a divisão entre sunitas e xiitas',texto:`Depois de 632, a comunidade passou a ser governada por **califas**, sucessores do profeta no governo, e não novos profetas. A sucessão causou um racha. Os **sunitas**, a grande maioria, aceitaram califas escolhidos pela comunidade. Os **xiitas** defendiam que o poder cabia a Ali, primo e genro de Muhammad, e a seus descendentes. Governaram os califas **omíadas** (de Damasco, a partir de 661) e depois os **abássidas** (de Bagdá, cidade fundada em 762).`},
  {titulo:'A expansão e o legado',texto:`Em cerca de cem anos, os árabes formaram o **Império Islâmico**: tomaram a Síria e o Egito de Bizâncio, venceram os persas, dominaram o norte da África e, em 711, entraram na Península Ibérica. A leste, chegaram ao rio Indo. Foram detidos pelos francos em Poitiers, em 732. A expansão misturou motivos religiosos, políticos e comerciais, e foi facilitada pelo cansaço de Bizâncio e da Pérsia. Cristãos e judeus, **povos do Livro**, mantinham sua fé pagando um imposto especial.

O império vivia do **comércio** de especiarias, seda, tecidos e papel, e suas cidades eram centros de saber. Em Bagdá, sábios traduziram obras gregas e persas. Os árabes difundiram os **algarismos indo-arábicos**, criados na Índia, desenvolveram a **álgebra** (do árabe al-jabr, com al-Khwarizmi, no século IX), a medicina e a astronomia. O português tem muitas palavras de origem árabe, como açúcar, algodão, alface, azeite e almoxarifado. A presença muçulmana na Península Ibérica durou séculos e terminou em 1492, com a queda de Granada.`}
  ],
  resumo:[
  'O Islã surgiu no século VII, na Península Arábica, entre tribos e cidades comerciais como Meca.',
  'Muhammad recebeu, segundo a tradição, as revelações do anjo Gabriel a partir de cerca de 610; o livro sagrado é o Alcorão.',
  'A Hégira (622), a ida para Medina, marca o ano 1 do calendário islâmico.',
  'Muçulmano é quem se submete a Deus; o Islã é monoteísta.',
  'Cinco pilares: profissão de fé, oração, jejum do Ramadã, zakat e peregrinação a Meca.',
  'Jihad é esforço, interno e externo; não é só "guerra santa".',
  'Califas sucederam o profeta no governo; sunitas e xiitas divergiram sobre a sucessão.',
  'Expansão: Síria, Egito, Pérsia, norte da África, Península Ibérica (711) e Indo; parada em Poitiers (732).',
  'Legado: comércio, algarismos indo-arábicos, álgebra e palavras árabes no português.'
  ],

  pecas:[
    // ================= o mapa: Península Arábica, Mediterrâneo e Pérsia
    {id:'mapa',tipo:'mapa',base:'historia-mapa-mediterraneo',x:0,y:0,w:1376*S,h:768*S,clicavel:false,rotulo:'Mapa da Península Arábica, do Mediterrâneo e da Pérsia, com Meca, Medina, Damasco, Bagdá e Córdoba',camadas:[
      // ===== etapa 1 (0): a Arábia antes do Islã
      {tipo:'regiao',pts:ARABIA,suave:false,terra:true,cor:'#e0ad4f',opac:.5,etapas:[0,1,2],atraso:A(900)},
      {tipo:'pontos',pts:DOTS,cor:'#8a5f1c',tam:.3,etapas:[0,1,2],atraso:A(1800)},
      {tipo:'rotulo',p:[1085,600],texto:'deserto',classe:'regiao',giro:-6,tam:.6,etapas:[0],atraso:A(2200)},
      {tipo:'rota',pts:R_CARAVANA,largura:5,etapas:[0],atraso:A(3000),dur:3.4},
      {tipo:'etiqueta',p:[1085,744],texto:'rumo ao Iêmen',tam:.46,etapas:[0],atraso:A(4200)},
      {tipo:'rotulo',p:[828,392],texto:'Império Bizantino',classe:'regiao',tam:.5,etapas:[0],atraso:A(6200)},
      {tipo:'rotulo',p:[1196,430],texto:'Império Persa',classe:'regiao',tam:.5,etapas:[0],atraso:A(6600)},
      {tipo:'nota',p:[1095,540],texto:'a oeste, o Império|Bizantino; a leste, o|Império Persa: os dois|exaustos por guerras|entre si',tam:.5,etapas:[0],atraso:A(7600)},
      {tipo:'cidade',p:DAMASCO,nome:'Síria',sub:'caravanas do norte',lado:'d',tam:.46,etapas:[0],atraso:A(4600)},
      {tipo:'cidade',p:MECA,nome:'Meca',lado:'e',tam:.5,etapas:[0,1,2,3,4,6],atraso:A(3800)},
      {tipo:'cidade',p:MEDINA,nome:'Medina',sub:'então Yathrib',lado:'e',tam:.5,etapas:[0,1],atraso:A(4400)},
      {tipo:'cidade',p:MEDINA,nome:'Medina',lado:'e',tam:.5,etapas:[2,3],atraso:A(700)},
      {tipo:'cidade',p:MEDINA,nome:'Medina',lado:'d',tam:.5,etapas:[4],atraso:A(700)},
      // ===== etapa 3 (2): a Hégira
      {tipo:'rota',pts:R_IDA,largura:6,movel:'ponto',tam:.6,invisivel:true,volta:A(4000)||4000,etapas:[2],atraso:A(1200),dur:2.2},
      {tipo:'etiqueta',p:[1052,626],texto:'622',tam:.5,cor:'amarelo',etapas:[2],atraso:A(3800)},
      {tipo:'rota',pts:R_VOLTA,largura:6,movel:'ponto',tam:.6,invisivel:true,volta:4000,etapas:[2],atraso:A(16000),dur:2.2,cor:'#e8572a'},
      {tipo:'etiqueta',p:[1064,700],texto:'630',tam:.5,cor:'amarelo',etapas:[2],atraso:A(18500)},
      // ===== etapa 5 (4): a direção de Meca
      {tipo:'cidade',p:CAIRO,nome:'Cairo',lado:'d',tam:.5,etapas:[4],atraso:A(22200)},
      {tipo:'cidade',p:DAMASCO,nome:'Damasco',lado:'e',tam:.5,etapas:[4],atraso:A(22200)},
      {tipo:'cidade',p:BAGDA,nome:'Bagdá',lado:'e',tam:.5,etapas:[4],atraso:A(22200)},
      // ===== etapa 7 (6): capitais
      {tipo:'cidade',p:MEDINA,nome:'Medina',sub:'632',capital:true,lado:'e',tam:.5,etapas:[6],atraso:A(14300)},
      {tipo:'rota',pts:[MEDINA,[990,590],[968,520],DAMASCO],largura:5,etapas:[6],atraso:A(15000),dur:2,cor:'#e8572a'},
      {tipo:'cidade',p:DAMASCO,nome:'Damasco',sub:'661',capital:true,lado:'e',tam:.5,etapas:[6],atraso:A(17000)},
      {tipo:'rota',pts:[DAMASCO,[1000,436],BAGDA],largura:5,etapas:[6],atraso:A(17800),dur:1.8,cor:'#e8572a'},
      {tipo:'cidade',p:BAGDA,nome:'Bagdá',sub:'762',capital:true,lado:'d',tam:.5,etapas:[6],atraso:A(19500)},
      // ===== etapa 8 (7): o império cresce
      {tipo:'regiao',pts:ARABIA,suave:false,terra:true,cor:'#2f6b4f',opac:.62,etapas:[7,8],atraso:A(1800)},
      {tipo:'regiao',pts:SIRIA,suave:false,terra:true,cor:'#2f6b4f',opac:.62,etapas:[7,8],atraso:A(3000)},
      {tipo:'regiao',pts:EGITO,suave:false,terra:true,cor:'#2f6b4f',opac:.62,etapas:[7,8],atraso:A(4200)},
      {tipo:'regiao',pts:PERSIA,suave:false,terra:true,cor:'#2f6b4f',opac:.62,etapas:[7,8],atraso:A(5200)},
      {tipo:'rota',pts:[[1250,470],[1338,456]],largura:6,etapas:[7],atraso:A(8800),dur:1.6},
      {tipo:'etiqueta',p:[1226,418],texto:'até o Indo',tam:.5,cor:'amarelo',etapas:[7],atraso:A(9800)},
      {tipo:'cidade',p:DAMASCO,nome:'Damasco',lado:'d',tam:.5,etapas:[7],atraso:A(1000)},
      {tipo:'cidade',p:BAGDA,nome:'Bagdá',lado:'d',tam:.5,etapas:[7],atraso:A(1000)},
      {tipo:'cidade',p:BAGDA,nome:'Bagdá',lado:'d',tam:.6,etapas:[8],atraso:A(1000)},
      {tipo:'regiao',pts:NAFRICA,suave:false,terra:true,cor:'#2f6b4f',opac:.62,etapas:[7,8],atraso:A(17500)},
      {tipo:'regiao',pts:IBERIA,suave:false,terra:true,cor:'#2f6b4f',opac:.62,etapas:[7,8],atraso:A(19200)},
      {tipo:'cidade',p:CORDOBA,nome:'Córdoba',sub:'al-Andalus',lado:'d',tam:.5,etapas:[7],atraso:A(20800)},
      {tipo:'cidade',p:CORDOBA,nome:'Córdoba',sub:'al-Andalus',lado:'d',tam:.8,etapas:[8],atraso:A(1000)},
      {tipo:'rota',pts:[CORDOBA,[150,262],[188,200],[222,148],POITIERS],largura:6,cor:'#e8572a',etapas:[7],atraso:A(22200),dur:1.8},
      {tipo:'rota',pts:[[236,76],[270,114]],largura:9,cor:'#c93a2a',tracejada:false,etapas:[7],atraso:A(24200),dur:.8},
      {tipo:'etiqueta',p:[318,60],texto:'732: Poitiers',tam:.5,cor:'amarelo',etapas:[7],atraso:A(25000)},
      {tipo:'nota',p:[190,410],texto:'o domínio muçulmano|na Península Ibérica|durou até 1492, com|a queda de Granada',tam:.5,etapas:[7],atraso:A(27000)},
      // ===== etapa 9 (8): rotas de comércio a partir de Bagdá
      {tipo:'rota',pts:R_BAGDA_LESTE,largura:5,etapas:[8],atraso:A(1200),dur:3},
      {tipo:'etiqueta',p:[1262,478],texto:'Índia e China',tam:.5,cor:'amarelo',etapas:[8],atraso:A(4000)},
      {tipo:'rota',pts:R_BAGDA_MAR,largura:5,etapas:[8],atraso:A(2200),dur:3},
      {tipo:'etiqueta',p:[1180,610],texto:'pelo mar',tam:.5,cor:'amarelo',etapas:[8],atraso:A(4800)},
      {tipo:'rota',pts:R_BAGDA_OESTE,largura:5,etapas:[8],atraso:A(15000),dur:5},
      {tipo:'rota',pts:R_CORDOBA,largura:5,etapas:[8],atraso:A(20500),dur:1.4},
      {tipo:'cidade',p:CAIRO,nome:'Cairo',lado:'e',tam:.8,etapas:[8],atraso:A(16000)}
    ]},
    // camelo e barco, que andam pelas rotas (sobre o mapa)
    {id:'viaj',tipo:'viajantes',x:0,y:0,w:1376*S,h:768*S,clicavel:false,rotulo:'Camelos e um barco viajando pelas rotas',itens:[
      {icone:'camelo',pts:R_CARAVANA.map(q=>[q[0]+16,q[1]-4]),et:'0',dur:15,tam:.26},
      {icone:'camelo',pts:R_BAGDA_OESTE,et:'8',dur:30,ini:3,tam:.28},
      {icone:'dhow',pts:R_BAGDA_MAR,et:'8',dur:18,tam:.28}
    ]},

    // ================= fita do tempo
    {id:'fita',tipo:'fitaislam',x:0,y:2500,w:3300,h:860,ini:0,rotulo:'Fita do tempo do Islã, de cerca de 570 a 1492'},

    // ================= etapa 1 e 3: a Caaba, à direita do mapa
    {id:'caaba',tipo:'icone',nome:'caaba',x:2960,y:140,w:520,h:520,giro:-1.5,atraso:A(14500),rotulo:'A Caaba, santuário em forma de cubo, em Meca'},
    {id:'caaba-et',tipo:'etq3',texto:'Caaba, em Meca',tam:54,x:2960,y:690,w:520,h:110,atraso:A(15500),rotulo:'Etiqueta: Caaba, em Meca'},
    // ================= etapa 2: o monte Hira, sobre o mapa, e a fonte
    {id:'hira',tipo:'icone',nome:'hira',x:2120,y:1240,w:220,h:220,giro:2,rotulo:'Monte Hira, perto de Meca'},
    {id:'hira-et',tipo:'etq3',texto:'monte Hira, onde vieram as primeiras revelações',tam:30,x:2060,y:1030,w:320,h:160,atraso:A(900),rotulo:'Etiqueta: monte Hira, onde vieram as primeiras revelações'},
    {id:'cal-et',tipo:'caligrafia',x:2900,y:300,w:700,h:230,marcaEm:1.6,ini:A(9.6),rotulo:'Linha de escrita abstrata, sem texto legível, com um marca-texto dourado'},
    {id:'fonte',tipo:'fonte',grande:true,x:2960,y:1000,w:560,h:540,giro:.6,atraso:A(14000),
      texto:'Recita, em nome do teu Senhor, que criou; que criou o ser humano de um coágulo. Recita, pois teu Senhor é o mais generoso, que ensinou pelo cálamo, ensinou ao ser humano o que ele não sabia.',
      ref:'Alcorão, surata 96, versículos 1 a 5, considerados pela tradição islâmica as primeiras palavras reveladas a Muhammad, por volta de 610 (paráfrase da equipe a partir de traduções em domínio público)',
      resposta:'Para os muçulmanos, é o começo da revelação: Deus manda recitar e se apresenta como criador do ser humano. Para o historiador, o texto mostra duas marcas do Islã nascente: o monoteísmo, com um só Deus criador, e o valor dado à palavra recitada e escrita, já que o cálamo é a pena de escrever. Ajuda a entender por que o Islã valorizou tanto a caligrafia e o estudo. Como em toda fonte religiosa, a análise histórica não discute a fé, mas o que o texto revela sobre quem o recebeu e transmitiu.',
      rotulo:'Fonte: Alcorão, surata 96, as primeiras palavras reveladas'},
    // ================= etapa 3: a folhinha do calendário
    {id:'cal',tipo:'calend',x:2960,y:1000,w:820,h:900,giro:1,v1:A(10.8)||10.8,v2:A(12.6)||12.6,atraso:A(7600),rotulo:'Folhinha de calendário: 621, 622 e o ano 1 do calendário islâmico'},
    {id:'cal-nota',tipo:'nota3',texto:'calendário lunar, cerca de 11 dias mais curto que o solar',tam:46,x:3020,y:1930,w:700,h:170,giro:-1,atraso:A(13000),rotulo:'Nota: o calendário lunar é cerca de 11 dias mais curto que o solar'},
    // ================= etapa 4: o livro e Abraão
    {id:'livro',tipo:'icone',nome:'livro',x:140,y:4220,w:760,h:760,giro:-2,rotulo:'O Alcorão, livro aberto com linhas de escrita abstrata'},
    {id:'livro-et',tipo:'etq3',texto:'Alcorão',tam:70,x:240,y:5010,w:420,h:120,atraso:A(1400),rotulo:'Etiqueta: Alcorão'},
    {id:'abra',tipo:'abraao',x:1250,y:4100,w:1500,h:1100,ini:A(9.8),rotulo:'Judaísmo, cristianismo e islamismo ligados a Abraão'},
    {id:'abra-nota',tipo:'nota3',texto:'as três religiões abraâmicas',tam:70,x:1800,y:5110,w:780,h:200,giro:1.2,atraso:A(11800),rotulo:'Nota: as três religiões abraâmicas'},
    // ================= etapa 5: os cinco pilares
    {id:'pil',tipo:'pilares',compacto:MOB,x:100,y:5520,w:MOB?1410:2900,h:MOB?1100:1320,ini:A(2),rotulo:'Cinco colunas sob um telhado: os cinco pilares do Islã'},
    // ================= etapa 6: jihad
    {id:'jih',tipo:'jihad',vert:MOB,x:MOB?1300:500,y:7220,w:MOB?1000:2700,h:MOB?2150:1160,ini:A(2),rotulo:'Jihad, esforço: interna e externa; guerra santa riscada como tradução incompleta'},
    // ================= etapa 7: a árvore dos califas
    {id:'arv',tipo:'califas',x:1100,y:8670,w:1500,h:1320,ini:A(2),rotulo:'Árvore: a morte do profeta em 632 e dois galhos, sunitas e xiitas'},
    // ================= etapa 9: algarismos e palavras
    {id:'num',tipo:'numeros',cols:MOB?5:10,x:MOB?1250:500,y:10370,w:MOB?1320:2700,h:MOB?1400:1180,ini:A(28),rotulo:'Os algarismos, das formas antigas indianas aos de hoje, com o zero'},
    {id:'p1',tipo:'palavraal',parte:'aç',resto:'úcar',tam:42,x:100,y:455,w:230,h:76,giro:-4,atraso:A(23800),rotulo:'Palavra: açúcar'},
    {id:'p2',tipo:'palavraal',parte:'al',resto:'godão',tam:42,x:350,y:455,w:250,h:76,giro:3,atraso:A(24400),rotulo:'Palavra: algodão'},
    {id:'p3',tipo:'palavraal',parte:'al',resto:'face',tam:42,x:120,y:535,w:210,h:76,giro:-3,atraso:A(25000),rotulo:'Palavra: alface'},
    {id:'p4',tipo:'palavraal',parte:'az',resto:'eite',tam:42,x:360,y:535,w:210,h:76,giro:4,atraso:A(25600),rotulo:'Palavra: azeite'},
    {id:'p5',tipo:'palavraal',parte:'al',resto:'moxarifado',tam:42,x:150,y:375,w:400,h:76,giro:-2,atraso:A(26200),rotulo:'Palavra: almoxarifado'},
    {id:'p-nota2',tipo:'nota3',texto:'em açúcar e azeite, o l se fundiu à letra seguinte: aç-, az-',tam:30,x:70,y:297,w:560,h:70,giro:-1,atraso:A(26400),rotulo:'Nota: o l do artigo se fundiu à letra seguinte'},
    {id:'p-nota',tipo:'nota3',texto:'al- é o artigo árabe o, a',tam:40,x:70,y:225,w:560,h:80,giro:1.5,atraso:A(27000),rotulo:'Nota: al- é o artigo árabe'},
    {id:'prox',tipo:'etq3',texto:'Próximo: reinos africanos',tam:60,x:MOB?1250:2150,y:MOB?11840:11580,w:850,h:130,rotulo:'Etiqueta: próximo, reinos africanos'}
  ],

  etapas:[
    {titulo:'A Arábia antes do Islã',
     texto:`A ==Península Arábica== é quase toda deserto, com poucos rios e chuvas raras. No século VI, era habitada por tribos árabes, muitas delas de beduínos, pastores nômades organizados em clãs e muitas vezes rivais entre si. Nos oásis e nas cidades, como Meca, vivia-se do ==comércio de caravanas==, que ligava o Oceano Índico ao Mar Mediterrâneo e levava especiarias, perfumes e tecidos.

A maioria dos árabes era politeísta. Meca era um centro de peregrinação: na ==Caaba==, santuário em forma de cubo, havia ídolos de muitas tribos, e a cidade lucrava com os visitantes. Também havia comunidades de judeus e de cristãos na região, e a ideia de um Deus único já circulava por lá.`,
     mostra:['mapa','viaj'],so:['caaba','caaba-et'],
     foco:FD(1090,570,560),focoM:FMo(1045,565,330),
     tomadas:[[15500,[2880,60,720,820]]],
     tomadasM:[[8500,FMo(1190,570,230)],[15500,[2880,60,720,820]]],
     tracos:[{tipo:'circulo',peca:'caaba',x:46,y:60,w:84,h:84,atraso:A(18500)}]},
    {titulo:'Muhammad e a revelação',
     texto:`==Muhammad==, ou Maomé, nasceu em Meca por volta de 570 e foi comerciante de caravanas. Por volta de 610, segundo a tradição islâmica, começou a receber revelações de Deus por meio do ==anjo Gabriel==. Passou a pregar que havia um só Deus, ==Allah==, palavra árabe para Deus, e que os fiéis deviam se submeter a Ele e ajudar os pobres.

A pregação incomodou os comerciantes e as lideranças de Meca, que lucravam com as peregrinações aos ídolos e temiam perder prestígio e renda. Os primeiros seguidores eram poucos, e muitos deles eram pessoas de condição humilde. Logo começaram as perseguições.`,
     mostra:[],so:['hira','hira-et','fonte','cal-et','fita'],fonte:'fonte',
     tracos:[{tipo:'seta',de:{peca:'hira-et',x:50,y:100},para:{peca:'hira',x:50,y:8},curva:.1,atraso:A(2500),ponta:26}],
     foco:FD(1090,650,400),focoM:FMo(1050,665,320),
     tomadas:[[8500,[2860,230,780,380]],[14000,[2960,1020,560,300]],[21000,[0,2500,1600,860]]],
     tomadasM:[[8500,[2860,230,780,380]],[14000,[2940,980,600,580]],[22000,[0,2500,800,860]]]},
    {titulo:'A Hégira',
     texto:`Perseguidos em Meca, Muhammad e seus seguidores partiram em 622 para Yathrib, que passou a se chamar ==Medina==, a cidade do profeta. Essa migração é a ==Hégira== e marca o ano 1 do ==calendário islâmico==, que é lunar. Em Medina, Muhammad foi ao mesmo tempo líder religioso, político e militar, e uniu tribos antes rivais numa só comunidade de fiéis.

Em 630, voltou a Meca, retirou os ídolos da Caaba e fez dela o centro do Islã. Morreu em 632. Em cerca de dez anos de liderança em Medina, quase toda a Arábia já estava unida sob a nova fé.`,
     mostra:[],so:['cal','cal-nota','caaba','caaba-et','fita'],
     foco:FD(1090,620,360),focoM:FMo(1020,665,210),
     tomadas:[[7000,[2900,960,940,1200]],[14500,FD(1090,620,360)],[20500,[2900,60,640,780]],[26000,[560,2500,900,860]]],
     tomadasM:[[7000,[2900,960,940,1200]],[14500,FMo(1020,665,210)],[20500,[2900,60,640,780]],[26000,[560,2500,900,860]]],
     tracos:[{tipo:'seta',de:M(1022,708),para:M(1000,654),curva:-.18,atraso:A(1500),ponta:30},
             {tipo:'seta',de:M(1014,652),para:M(1036,706),curva:-.18,atraso:A(16300),ponta:30},
             {tipo:'circulo',peca:'caaba',x:46,y:60,w:84,h:84,atraso:A(23500)}],
     /* a Caaba só aparece de novo no fim: o traço acompanha */},
    {titulo:'O Alcorão e um só Deus',
     texto:`O Islã é ==monoteísta==. A palavra islã quer dizer submissão a Deus, e ==muçulmano== é quem se submete a Ele. As revelações foram recitadas por Muhammad, memorizadas e escritas por seus seguidores e reunidas depois da sua morte no ==Alcorão==, o livro sagrado dos muçulmanos, dividido em capítulos chamados suratas.

Para os fiéis, o texto é palavra de Deus, e por isso é recitado e copiado no árabe original. O Islã reconhece profetas anteriores, como Abraão, Moisés e Jesus, e vê Muhammad como o último deles. Hoje, é a segunda maior religião do mundo, com fiéis em todos os continentes.`,
     mostra:[],so:['livro','livro-et','abra','abra-nota','fita'],
     foco:[40,4110,1000,1100],focoM:[60,4150,860,1050],
     tomadas:[[9000,[1230,4060,1540,1280]],[19000,[800,2500,900,860]]],
     tomadasM:[[9000,[1230,4060,1540,1280]],[19000,[800,2500,900,860]]],
     tracos:[{tipo:'circulo',peca:'livro',x:50,y:52,w:86,h:76,atraso:A(2600)},{tipo:'seta',de:{peca:'livro-et',x:50,y:10},para:{peca:'livro',x:48,y:88},curva:.12,atraso:A(3600)}]},
    {titulo:'Os cinco pilares',
     texto:`Todo muçulmano segue os ==cinco pilares==, deveres básicos da fé. O primeiro é a profissão de fé: não há deus além de Allah, e Muhammad é seu profeta. O segundo é a oração cinco vezes ao dia, voltado para Meca. O terceiro é o jejum do nascer ao pôr do sol durante o mês do ==Ramadã==, o nono do calendário islâmico.

O quarto é o ==zakat==, doação anual de 2,5% das economias aos pobres. O quinto é a peregrinação a Meca, ao menos uma vez na vida, para quem tem saúde e condições. Os pilares dão à comunidade uma prática comum, da Península Ibérica à Índia, e reforçam a solidariedade entre os fiéis.`,
     mostra:[],so:['pil'],
     foco:[60,5480,2940,1400],focoM:[60,5500,1500,1150],
     tomadas:[[16500,[60,5480,2940,1400]],[20000,FD(970,574,480)]],
     tomadasM:[[20000,FMo(980,570,330)]],
     tracos:[{tipo:'seta',de:M(CAIRO[0]+8,CAIRO[1]+6),para:M(MECA[0]-18,MECA[1]-12),curva:.08,atraso:A(22800),ponta:30},
             {tipo:'seta',de:M(DAMASCO[0]+8,DAMASCO[1]+10),para:M(MECA[0],MECA[1]-20),curva:.04,atraso:A(23500),ponta:30},
             {tipo:'seta',de:M(BAGDA[0],BAGDA[1]+12),para:M(MECA[0]+18,MECA[1]-12),curva:.08,atraso:A(24200),ponta:30}]},
    {titulo:'Jihad: o esforço',
     texto:`==Jihad== quer dizer esforço no caminho de Deus. Os livros distinguem a jihad ==interna==, a luta de cada pessoa contra os próprios vícios para se tornar melhor, considerada por muitos sábios a mais importante, e a jihad ==externa==, que inclui a defesa da comunidade, inclusive pelas armas.

Traduzir jihad só como "guerra santa" é uma simplificação que vem de leituras europeias e de grupos extremistas, que usam o termo para justificar a violência. Em provas e no dia a dia, vale distinguir a religião islâmica, seguida por mais de um bilhão de pessoas, dos atos de grupos radicais, que não representam todos os muçulmanos.`,
     mostra:[],so:['jih'],
     foco:[440,7150,2820,1300],focoM:[1260,7180,1080,2230],},
    {titulo:'Califas, sunitas e xiitas',
     texto:`Depois da morte de Muhammad, em 632, os líderes da comunidade passaram a ser os ==califas==, sucessores do profeta no governo, mas não novos profetas. A sucessão gerou um racha duradouro. Os ==sunitas==, hoje a grande maioria, aceitaram califas escolhidos pela comunidade. Os ==xiitas== defendiam que o poder cabia a Ali, primo e genro de Muhammad, e a seus descendentes.

Os califas omíadas governaram de Damasco, a partir de 661. Depois, os abássidas governaram de Bagdá, cidade fundada em 762, que se tornou grande centro de comércio e de saber.`,
     mostra:[],so:['arv','fita'],
     foco:[1040,8600,1620,1460],focoM:[1100,8660,1500,1340],
     tomadas:[[12000,FD(1000,575,520)],[23000,[1200,2500,2150,860]]],
     tomadasM:[[12000,FMo(1010,545,350)],[23000,[964,2500,800,860]],[27000,[2378,2500,800,860]]]},
    {titulo:'De Córdoba ao Indo',
     texto:`Em cerca de cem anos, os árabes formaram um enorme ==Império Islâmico==. Tomaram a Síria e o Egito dos bizantinos, venceram os persas e dominaram o norte da África. Em 711, entraram na ==Península Ibérica==, onde derrubaram o reino visigodo. A leste, chegaram ao rio Indo.

A expansão teve motivos religiosos, políticos e comerciais, e foi facilitada pelo esgotamento de Bizâncio e da Pérsia, que vinham de longas guerras. Os árabes foram detidos pelos francos em Poitiers, em 732. Cristãos e judeus, os ==povos do Livro==, podiam manter sua fé e suas leis pagando um imposto especial. Em geral, os povos conquistados não eram obrigados a se converter.`,
     mostra:[],so:['fita'],
     foco:FD(1010,520,720),focoM:FMo(990,520,380),
     tomadas:[[15000,FD(210,205,600)],[30000,[1860,2500,1500,860]]],
     tomadasM:[[7500,FMo(1205,500,280)],[15000,FMo(200,215,340)],[27500,FMo(210,385,300)],[31500,[1811,2500,800,860]],[35500,[2530,2500,800,860]]]},
    {titulo:'Especiarias, números e palavras',
     texto:`O Império Islâmico vivia do ==comércio==: caravanas e navios levavam especiarias, seda, tecidos e papel entre a Índia, a China, a África e o Mediterrâneo. Cidades como Bagdá, Córdoba e Cairo cresceram. Em Bagdá, sábios traduziram obras gregas e persas, preservando e ampliando o saber antigo.

Os árabes espalharam os ==algarismos indo-arábicos==, criados na Índia, o que incluiu o zero, e desenvolveram a ==álgebra==, palavra que vem do árabe al-jabr, além de avanços em medicina, astronomia e navegação. Deixaram palavras no português, como açúcar, algodão, alface, azeite e almoxarifado. Na Península Ibérica, a presença muçulmana, a partir de 711, deixou marcas na cultura portuguesa e espanhola.`,
     mostra:[],so:['p1','p2','p3','p4','p5','p-nota','p-nota2','num','prox'],
     foco:FD(1150,540,480),focoM:FMo(1150,540,260),
     tomadas:[[15000,FD(560,420,1060)],[22000,FD(200,300,520)],[29000,[440,10300,2840,1480]]],
     tomadasM:[[16500,FMo(1190,510,300)],[22000,FMo(190,260,300)],[28000,[1200,10340,1420,1700]]]}
  ]
});
})();
