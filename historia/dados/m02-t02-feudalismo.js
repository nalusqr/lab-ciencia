/* Módulo 2, tópico 2: Feudalismo. Roteiro revisado: docs/revisao-historia/m02-t02-feudalismo.md
   Formato dos dados: docs/historia/MOTOR.md. Recortes e esquemas próprios: recortes-m02b.js (carregado depois de recortes.js).
   Mapa-múndi (historia-mapa-mundo, 1376 x 768): os pontos usam longitude e latitude (ll:true), calibradas no motor com erro de até cerca de 6 px.
   A peça do mapa tem escala 3 na mesa (4128 x 2304). Mb() leva pixel da base para pixel da mesa e ML() leva longitude e latitude direto à mesa.
   Mesa em zonas: notas de Bloch (esquerda, no alto), mapa (alto, ao centro), fita do tempo (sob o mapa), e depois, em fileiras:
   Roma e germânicos (etapa 2) e o rei em pedaços (etapa 3); três atos, pacto, ordens e fonte (etapas 4 e 5);
   senhorio, calendário, obrigações e balança (etapas 6 e 7); Igreja (etapa 8); trienal, charrua, moinho e catedrais (etapa 9). */
(function(){
const A=n=>Colagem.reduz?0:n;
const BASE='historia-mapa-mundo',S=3,MX=2700,MY=0;
const Mb=(x,y)=>[Math.round(MX+x*S),Math.round(MY+y*S)];
const LL=(lon,lat)=>Colagem.lonlat(BASE,lon,lat);
const FB=(cx,cy,w,asp)=>{const h=w/(asp||1.4),a=Mb(cx-w/2,cy-h/2);return [a[0],a[1],Math.round(w*S),Math.round(h*S)];};   // enquadra no mapa (desktop), em pixels da base
const FM=(cx,cy,w)=>FB(cx,cy,w,.66);                                                                                    // enquadra no mapa (celular)
const FD=(lon,lat,w)=>{const q=LL(lon,lat);return FB(q[0],q[1],w);};
const FC=(lon,lat,w)=>{const q=LL(lon,lat);return FM(q[0],q[1],w);};
const FX=MX,FY=2950;                                                       // fita do tempo, embaixo do mapa
const TL=(dx,w)=>[FX+dx,FY-10,w,640];                                      // trecho da fita
// ---- regiões da Europa ocidental (longitude e latitude)
const FRANCA=[[-4.9,48.5],[-3.0,48.9],[-1.6,49.7],[0.2,49.6],[1.6,50.2],[2.6,51.15],[4.0,50.4],[4.9,49.9],[5.9,49.6],[6.4,49.4],[8.3,49.1],[7.8,47.6],[7.0,47.4],[6.1,46.4],[7.1,45.9],[7.2,44.2],[7.8,43.8],[6.5,43.0],[3.2,43.1],[3.2,42.4],[1.5,42.4],[-0.8,42.9],[-1.9,43.5],[-1.3,45.2],[-1.2,46.0],[-2.3,47.0],[-3.0,47.5],[-4.6,47.8]];
const IBERIA=[[-9.6,43.3],[-1.9,43.4],[-1.0,42.8],[1.5,42.5],[3.2,42.3],[3.3,41.8],[1.0,41.0],[0.3,39.6],[-0.3,38.6],[-1.6,37.3],[-2.2,36.7],[-5.4,36.0],[-7.4,37.1],[-9.6,37.0]];
const BRIT=[[-5.8,50.0],[1.4,50.8],[1.8,52.8],[0.3,53.6],[-0.4,54.8],[-1.7,55.9],[-2.2,57.7],[-3.2,58.7],[-5.3,58.6],[-6.4,57.5],[-5.7,56.0],[-4.9,55.0],[-3.1,54.8],[-3.1,53.4],[-4.7,53.1],[-4.8,51.7]];
const IRL=[[-10.3,51.6],[-6.0,52.0],[-5.9,54.2],[-6.2,55.3],[-8.3,55.2],[-10.2,54.1],[-10.3,52.0]];
const GERM=[[2.6,51.2],[4.2,51.5],[3.9,52.6],[5.0,53.4],[8.0,53.8],[8.8,55.0],[10.1,54.8],[11.5,54.2],[14.2,54.0],[14.7,52.0],[14.5,50.8],[13.0,50.2],[12.6,49.0],[13.8,48.6],[13.4,47.4],[12.4,47.5],[10.4,47.5],[9.6,47.6],[7.8,47.6],[8.3,49.1],[6.4,49.4],[5.9,49.6],[4.9,49.9],[4.0,50.4]];
const ALPES=[[6.2,46.4],[7.1,45.9],[7.6,46.0],[9.0,46.1],[12.4,46.6],[13.4,46.5],[13.4,47.4],[12.4,47.5],[10.4,47.5],[9.6,47.6],[7.8,47.6],[7.0,47.4],[6.1,46.4]];
const ITALIA=[[7.0,44.2],[7.1,45.9],[7.6,46.0],[9.0,46.1],[12.4,46.6],[13.4,46.5],[13.7,45.6],[12.4,44.9],[12.4,44.1],[14.0,42.6],[16.0,41.9],[18.5,40.2],[17.1,39.0],[16.1,38.0],[15.6,38.0],[16.6,39.7],[15.5,40.5],[14.0,40.9],[12.5,41.5],[10.6,42.9],[9.7,44.1],[8.5,44.4],[7.4,43.9]];
// castelos de senhores locais: grade com ruído dentro da França
function dentro(pt,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>pt[1])!==(b[1]>pt[1])&&pt[0]<(b[0]-a[0])*(pt[1]-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;}
const CASTELOS=[];
(function(){const r=Colagem.rng('castelos');for(let lat=43.2;lat<51;lat+=1.05)for(let lon=-4.8;lon<8;lon+=1.35){const q=[lon+(r()-.5)*.8+(Math.round((lat-43.2)/1.05)%2?.6:0),lat+(r()-.5)*.5];if(dentro(q,FRANCA))CASTELOS.push(q);}})();
// cruzes de mosteiros e bispados: [longitude, latitude]
const CRUZES=[[4.66,46.43],[-1.51,48.64],[1.08,51.28],[-1.08,53.96],[-8.54,42.88],[6.08,50.78],[6.96,50.94],[9.38,47.42],[9.68,50.55],[13.81,41.49],[4.03,49.26],[2.35,48.85],[0.69,47.39],[4.78,48.15],[9.38,44.77],[-6.65,54.35],[-3.7,40.4],[11.35,44.5],[8.8,50.1],[-0.1,51.5]];
function desenhoCruzes(){return CRUZES.map(c=>{const q=LL(c[0],c[1]);return 'M'+(q[0]-2.7).toFixed(1)+' '+(q[1]-1.0).toFixed(1)+' H'+(q[0]+2.7).toFixed(1)+' M'+q[0].toFixed(1)+' '+(q[1]-4.0).toFixed(1)+' V'+(q[1]+3.5).toFixed(1);}).join(' ');}

// ---- zonas da mesa
const NX=100,NY=330;                                // notas de Bloch
const Z2={x:400,y:3300};                            // Roma e germânicos
const Z3={x:2400,y:4350};                           // rei sagrado e poder em pedaços
const Z4={x:300,y:6050};                            // três atos e pacto
const Z5={x:4400,y:6050};                           // ordens e fonte
const Z6={x:300,y:7950};                            // senhorio
const Z8={x:300,y:9900};                            // Igreja
const Z9={x:3500,y:9900};                           // trienal e catedrais
const SX=(x)=>Z6.x+Math.round(x*2),SY=(y)=>Z6.y+Math.round(y*2);   // pixel da figura do senhorio (880 x 491) na mesa

const TEXTO=[
  'O ==feudalismo== vem de feudum, que significa posse, domínio. Formou-se na França nos séculos IX e X, a partir da fragmentação do poder carolíngio, e desapareceu entre os séculos XV e XVI. O historiador ==Marc Bloch== resumiu seus traços: um campesinato submetido, o ==feudo== no lugar do salário, a supremacia de guerreiros especializados, laços pessoais de obediência e proteção, a vassalagem, e uma autoridade fragmentada. Não foi igual em toda a Europa: o modelo mais completo é o francês, e na Inglaterra o sistema foi reforçado depois da conquista normanda de 1066. Por isso se fala em feudalismo europeu, e não em um sistema único e idêntico.',
  'O feudalismo juntou heranças. De Roma vieram o latifúndio, a ==vila== romana, grande propriedade rural quase autossuficiente, e o colonato. Dos germânicos vieram o ==comitatus==, a fidelidade na guerra ao chefe, e o ==beneficium==, um lote de terra dado como pagamento por serviços. Sem um Estado forte para garantir a segurança, cada comunidade teve de se proteger sozinha: a defesa foi privatizada, e as pessoas passaram a buscar proteção em quem tinha terra e guerreiros. O historiador Perry Anderson vê o feudalismo como síntese dessas duas heranças. A Igreja, que sobreviveu à queda de Roma, deu ao sistema ideias e legitimidade.',
  'O rei continuava existindo e tinha ==caráter sagrado==: era ungido pela Igreja, e muitos acreditavam que seu toque curava doenças, tema do livro Os reis taumaturgos, de Marc Bloch. Mas o poder real estava ==fragmentado==. No lugar da relação entre Estado e cidadão, típica de Roma, havia ==laços pessoais== de dependência. Os condes e marqueses, que tinham recebido terras dos carolíngios, viraram uma nobreza com terra própria. O rei era só mais um suserano, sem exército nem tributos que alcançassem todo o reino, e as guerras ficavam com uma elite restrita, os cavaleiros. Essa fragmentação só começou a ser superada a partir do século XI.',
  'Entre nobres havia o ==pacto feudo-vassálico==. O ==suserano== concedia um feudo, em geral terra, mas também um cargo, um direito ou uma renda. O ==vassalo== devia lealdade, conselho e serviço militar. O laço se fazia em três atos, como descreve Hilário Franco Júnior: a homenagem, em que o vassalo punha as mãos entre as do senhor; o juramento de fidelidade, feito sobre a Bíblia ou sobre relíquias; e a investidura, a entrega simbólica do feudo. Um vassalo podia ser suserano de nobres menores, formando uma cadeia de dependências. O rei, no alto, era mais um suserano. Atenção: o pacto ocorria entre nobres, e não entre senhores e camponeses.',
  'A sociedade era dividida em três ordens. Os ==oratores==, o clero, rezavam pela salvação de todos. Os ==bellatores==, a nobreza, guerreavam e protegiam. Os ==laboratores==, camponeses e servos, trabalhavam para sustentar as outras duas. Dizia-se que essa divisão era vontade de Deus, e por isso parecia natural e imutável. Era uma sociedade estamental: o lugar de cada pessoa dependia do nascimento, e a mobilidade era mínima, de modo que quase sempre se morria na ordem em que se nascera. A justificativa religiosa da desigualdade tornava difícil questioná-la. Na fonte desta etapa, o bispo Adalberão de Laon descreve essa ideia por volta de 1025.',
  'A unidade de produção era o ==senhorio==, as terras de um senhor, nobre ou clérigo. Não se confunde com o feudo, que era a concessão feita no pacto entre nobres. O senhorio se dividia em ==mansos==: o senhorial, com o castelo e a produção destinada ao senhor; o servil, lotes cultivados pelos servos para o próprio sustento; e o comunal, pastos e bosques de uso comum. A produção era sobretudo de subsistência, voltada ao consumo local. O comércio e a moeda diminuíram, mas não sumiram: mercadores, muitos deles judeus, levavam sal, seda e especiarias. Pesos, medidas e moedas mudavam de feudo para feudo, o que dificultava as trocas.',
  'O ==servo== não era escravo: não era propriedade do senhor, trabalhava também para o próprio sustento e devia receber proteção. Mas também não era livre: estava preso à terra e pagava ==obrigações==. A corveia era o trabalho gratuito nas terras do senhor, cerca de três dias por semana. A talha era uma parte da produção do manso servil; o censo, uma renda fixa pelo uso da terra; as banalidades, taxas pelo uso do moinho e do forno do senhor; a mão-morta, uma taxa cobrada na herança; e o dízimo, a décima parte devida à Igreja. Essa servidão tinha origem no colonato romano.',
  'A ==Igreja== era a instituição mais poderosa da Europa. Possuía muitas terras e recebia o dízimo. Quase só o clero sabia ler e escrever, o que lhe dava o monopólio da cultura. Explicava o mundo pelo sagrado e prometia a salvação na vida eterna, o que ajudava a manter a ordem social. Estava presente no batismo, no casamento e na morte, organizava peregrinações e jejuns, cultuava santos e a Virgem e podia ==excomungar== até reis, isto é, expulsá-los da comunidade dos fiéis. ==Santo Agostinho==, bispo de Hipona (354 a 430), foi o grande pensador dos primeiros séculos, e sua influência durou até o século XI.',
  'A partir do século XI, com o fim das grandes invasões, a população cresceu. Vieram novidades agrícolas: o ==sistema trienal==, que deixava só um terço da terra em descanso, no lugar de metade; a charrua puxada por cavalos; o adubo; e os moinhos de água e de vento. A produção aumentou e os feudos se expandiram, com o arroteamento de novas terras. Ergueram-se as ==catedrais==, primeiro no estilo românico, pesado e horizontal, depois no gótico, alto, com arcos pontudos e vitrais. Na filosofia, ==Tomás de Aquino== (1225 a 1274) procurou conciliar a fé e a razão relendo Aristóteles. As mesmas mudanças que levaram ao apogeu prepararam a crise do sistema.'
];

Colagem.montar({
  modulo:'Módulo 2: Idade Média e início da Idade Moderna',
  titulo:'Feudalismo',
  subtitulo:'Senhores, vassalos e servos numa terra de poderes locais',
  credito:'Figura do senhorio: recriação gerada por IA de uma paisagem rural francesa do século XII. Mapa-múndi, recortes, esquemas e igrejas desenhados pelo LAB.',
  ritmo:10000,
  celularGrande:true,
  msPalavra:250,
  mesa:{w:7600,h:11500},
  enem:`O ENEM cobra as relações de ==suserania e vassalagem==, as obrigações servis (corveia, talha, banalidades), a sociedade estamental e o papel da Igreja na justificativa da ordem. Costuma trazer um texto de época, como o de Adalberão, e pedir o que ele revela sobre a desigualdade.

Pegadinhas:
- Confundir servo com escravo.
- Achar que suserano e vassalo eram senhor e servo: o pacto era entre nobres.
- Pensar que não havia rei, comércio ou moeda: havia, mas com poder e trocas reduzidos.
- Confundir senhorio e feudo.`,
  urca:`O feudalismo europeu não existiu no Ceará, e não há ligação histórica direta. Para comparar, sabe-se que o dízimo também foi cobrado na América portuguesa, e que a Coroa dividiu o Brasil em capitanias hereditárias a partir de 1534, o que alguns autores já compararam ao feudalismo. A maioria dos historiadores, porém, destaca que a colônia estava ligada ao mercado europeu e usava mão de obra escravizada, o que a distancia do modelo feudal. Use a comparação para entender conceitos, e não como afirmação sobre a prova.`,
  estudo:[
  {titulo:'O que foi o feudalismo',texto:`**Feudalismo** vem de feudum, "posse, domínio". É o sistema político, econômico e social que se formou na Europa ocidental entre os séculos IX e X, com o modelo mais completo na França, e que desapareceu entre os séculos XV e XVI. O historiador **Marc Bloch** o resumiu em cinco traços: campesinato submetido, **feudo** em vez de salário, supremacia de guerreiros especializados, laços de obediência e proteção (a **vassalagem**) e fragmentação da autoridade. Em lugar de Estado e cidadãos, havia relações pessoais de dependência.

As origens estão na junção de heranças. De Roma vieram o latifúndio, a vila e o **colonato**. Dos germânicos vieram o **comitatus** (fidelidade na guerra, com divisão dos despojos) e o **beneficium** (lote dado como pagamento). Perry Anderson vê nessa síntese romano-germânica a base do sistema. Soma-se a isso a queda do poder central e as invasões do século IX, que levaram à **privatização da defesa**: sem Estado, cada comunidade se protegeu como pôde. A **Igreja**, que sobreviveu a Roma, deu legitimidade e ideias.`},
  {titulo:'Política: poder em pedaços',texto:`O rei existia e era sagrado: ungido pela Igreja, a ele se atribuía até o poder de curar com o toque, crença estudada por Bloch em Os reis taumaturgos. Mas, na prática, era só mais um **suserano**. Os condes e marqueses, criados pelos carolíngios, viraram nobreza com terras próprias, e as guerras ficaram com uma elite de cavaleiros.

O **pacto feudo-vassálico** ligava nobres. O suserano concedia o **feudo** (terra, cargo, renda) e recebia lealdade, conselho e serviço militar. O laço se fazia em três atos, segundo Hilário Franco Júnior: **homenagem** (as mãos do vassalo entre as do senhor), **fidelidade** (juramento sobre a Bíblia ou relíquias) e **investidura** (entrega simbólica do feudo). O vassalo podia ser suserano de outros: surgia uma cadeia de dependências. Cuidado: suserano e vassalo eram nobres, e não "senhor e servo". Dentro de seu domínio, o senhor aplicava a justiça, protegia, administrava e fiscalizava. A fragmentação só começou a ser superada a partir do século XI, e a centralização veio devagar, até os Estados Nacionais.`},
  {titulo:'Economia: senhorio, mansos e servidão',texto:`A unidade de produção era o **senhorio**, as terras do senhor (nobre ou clérigo). O feudo é a concessão do pacto entre nobres; o senhorio, a unidade econômica. Ele se dividia em três **mansos**: o **senhorial** (castelo e produção para o senhor), o **servil** (lotes cultivados pelos servos) e o **comunal** (pastos e bosques de uso comum). A economia era de subsistência. Moeda e comércio diminuíram, mas existiam: mercadores, entre eles judeus, vendiam seda, especiarias e sal. Pesos, medidas e moedas variavam de feudo para feudo.

O trabalhador era o **servo**, herdeiro do colono romano. Não era escravo (não era propriedade do senhor, trabalhava também para si, devia ser protegido) nem trabalhador livre (preso à terra, pagava obrigações):
- **corveia**: trabalho gratuito nas terras do senhor, cerca de três dias por semana;
- **talha**: parte da produção do manso servil;
- **champart**: parte proporcional da colheita;
- **censo**: renda fixa pelo uso da terra;
- **banalidades**: taxas pelo uso do moinho, do forno e de outras instalações;
- **mão-morta**: taxa sobre a herança;
- **dízimo**: a décima parte, devida à Igreja.`},
  {titulo:'Sociedade: as três ordens',texto:`A sociedade era **estamental**, dividida em três ordens: os **oratores** (clero, os que rezam), os **bellatores** (nobreza, os que guerreiam) e os **laboratores** (camponeses e servos, os que trabalham). A explicação religiosa dizia que a ordem era vontade de Deus, e por isso a desigualdade parecia natural. Quem nascia numa ordem quase sempre morria nela. Na base, os que trabalhavam sustentavam as outras duas.`},
  {titulo:'Igreja e cultura',texto:`A **Igreja** era a instituição mais poderosa: dona de terras, cobradora do dízimo, detentora quase exclusiva da escrita e da leitura. Explicava o mundo pelo sagrado, prometia a salvação, acompanhava a vida do batismo à morte, organizava peregrinações e jejuns e podia **excomungar** reis. As festas populares, como a Festa dos Tolos, invertiam a hierarquia por um dia. Na filosofia, **Agostinho de Hipona** (354 a 430) dominou até o século XI, e **Tomás de Aquino** (1225 a 1274) conciliou fé e razão lendo Aristóteles. A arquitetura passou do **românico** (séculos X a XII, pedra, aspecto de fortaleza) ao **gótico** (a partir do século XII, altura, vitrais, como em Chartres).`},
  {titulo:'O apogeu a partir do século XI',texto:`O fim das invasões e das guerras maiores permitiu o crescimento da população. Vieram inovações: o **sistema trienal**, a charrua puxada por cavalos, o adubo e os moinhos de água e de vento. Os feudos se expandiram, e o apogeu feudal veio acompanhado de comércio e de cidades, que se tornariam a base da crise. Esse assunto é do tópico 5 do módulo.`}
  ],
  resumo:[
  'Feudalismo: sistema formado entre os séculos IX e X, com base na dependência pessoal; modelo mais completo na França.',
  'Origens: colonato e latifúndio romanos, comitatus e beneficium germânicos, privatização da defesa e Igreja.',
  'Poder fragmentado; rei sagrado, mas só mais um suserano.',
  'Pacto feudo-vassálico entre nobres: homenagem, fidelidade e investidura.',
  'Senhorio é a unidade de produção; o feudo é a concessão do pacto; três mansos: senhorial, servil e comunal.',
  'Servo não é escravo nem livre: paga corveia, talha, censo, banalidades, mão-morta e dízimo.',
  'Sociedade estamental: oratores, bellatores e laboratores.',
  'Igreja: terras, dízimo, monopólio da escrita, excomunhão; Agostinho e Tomás de Aquino.',
  'Apogeu a partir do século XI: sistema trienal, charrua, moinhos, catedrais românicas e góticas.'
  ],

  pecas:[
    // ================= o mapa-múndi, com a Europa ocidental
    {id:'mapa',tipo:'mapa',base:BASE,x:MX,y:MY,w:4128,h:2304,rotulo:'Mapa-múndi, com a Europa ocidental: França, ilhas britânicas, Península Ibérica, Alemanha e Itália',camadas:[
      // ===== etapa 1: onde o modelo foi mais completo (0)
      {tipo:'regiao',ll:true,terra:true,pts:IBERIA,suave:false,estilo:'listra',opac:.9,etapas:[0],atraso:A(17500)},
      {tipo:'regiao',ll:true,terra:true,pts:BRIT,suave:false,estilo:'listra',opac:.9,etapas:[0],atraso:A(17800)},
      {tipo:'regiao',ll:true,terra:true,pts:IRL,suave:false,estilo:'listra',opac:.9,etapas:[0],atraso:A(18000)},
      {tipo:'regiao',ll:true,terra:true,pts:GERM,suave:false,estilo:'listra',opac:.9,etapas:[0],atraso:A(18300)},
      {tipo:'regiao',ll:true,terra:true,pts:ALPES,suave:false,estilo:'listra',opac:.9,etapas:[0],atraso:A(18500)},
      {tipo:'regiao',ll:true,terra:true,pts:ITALIA,suave:false,estilo:'listra',opac:.9,etapas:[0],atraso:A(18700)},
      {tipo:'regiao',ll:true,terra:true,pts:FRANCA,suave:false,cor:'coral',opac:.92,etapas:[0],atraso:A(20500)},
      {tipo:'etiqueta',ll:true,p:[-31,52.5],texto:'França',sub:'o norte: modelo mais completo',tam:.32,etapas:[0],atraso:A(22500)},
      {tipo:'etiqueta',ll:true,p:[-31,41.5],texto:'Europa ocidental',sub:'o resto, em listras',tam:.32,etapas:[0],atraso:A(24500)},
      {tipo:'etiqueta',ll:true,p:[-31,47],texto:'Inglaterra',sub:'reforçado após 1066',tam:.34,etapas:[0],atraso:A(25500)},
      // ===== etapa 3: castelos por toda parte (2)
      {tipo:'regiao',ll:true,terra:true,pts:FRANCA,suave:false,cor:'coral',opac:.8,etapas:[2],atraso:A(18200)},
      {tipo:'pontos',ll:true,pts:CASTELOS,cor:'tinta',tam:.17,etapas:[2],atraso:A(19500)},
      {tipo:'cidade',ll:true,p:[2.35,48.85],nome:'Paris',sub:'domínio do rei',capital:true,lado:'d',tam:.26,etapas:[2],atraso:A(22500)},
      {tipo:'etiqueta',ll:true,p:[-18,44.4],texto:'dezenas de senhorios',sub:'cada um com seu castelo',tam:.28,etapas:[2],atraso:A(24000)},
      // ===== etapa 8: a rede de mosteiros e bispados (7)
      {tipo:'rota',d:desenhoCruzes(),estilo:'fronteira',cor:'#ffffff',tracejada:false,largura:7,dur:6,etapas:[7],atraso:A(600)},
      {tipo:'rota',d:desenhoCruzes(),estilo:'fronteira',cor:'#b8472f',tracejada:false,largura:3.4,dur:6,etapas:[7],atraso:A(600)},
      {tipo:'cidade',ll:true,p:[12.5,41.9],nome:'Roma',sub:'sede do papa',capital:true,lado:'e',tam:.26,etapas:[7],atraso:A(1500)},
      {tipo:'cidade',ll:true,p:[4.66,46.43],nome:'Cluny',lado:'e',tam:.24,etapas:[7],atraso:A(2200)},
      {tipo:'cidade',ll:true,p:[13.81,41.49],nome:'Monte Cassino',lado:'d',tam:.24,etapas:[7],atraso:A(2800)},
      {tipo:'etiqueta',ll:true,p:[-17.5,50],texto:'mosteiros e bispados',sub:'a rede da Igreja',tam:.3,etapas:[7],atraso:A(4500)}
    ]},
    // ================= fita do tempo
    {id:'fita',tipo:'fitafeudal',x:FX,y:FY,w:2700,h:620,rotulo:'Fita do tempo do feudalismo, de 800 a 1600'},

    // ================= etapa 1: os cinco traços de Marc Bloch
    {id:'bl-et',tipo:'etq2',texto:'os cinco traços, segundo Marc Bloch',tam:44,x:NX,y:NY-170,w:900,h:110,rotulo:'Etiqueta: os cinco traços, segundo Marc Bloch'},
    {id:'bl1',tipo:'bilhete',icone:'campones',texto:'campesinato submetido',x:NX,y:NY,w:440,h:600,giro:-1.2,atraso:A(1400),rotulo:'Nota 1: campesinato submetido'},
    {id:'bl2',tipo:'bilhete',icone:'lote-sem-moeda',texto:'feudo no lugar do salário',x:NX+480,y:NY,w:440,h:600,giro:1,atraso:A(2800),rotulo:'Nota 2: feudo no lugar do salário'},
    {id:'bl3',tipo:'bilhete',icone:'cavaleiro',texto:'guerreiros especializados',x:NX+960,y:NY,w:440,h:600,giro:-.8,atraso:A(4200),rotulo:'Nota 3: supremacia de guerreiros especializados'},
    {id:'bl4',tipo:'bilhete',icone:'maos-unidas',texto:'laços pessoais: a vassalagem',x:NX+1440,y:NY,w:440,h:600,giro:1.2,atraso:A(9800),rotulo:'Nota 4: laços pessoais de obediência e proteção, a vassalagem'},
    {id:'bl5',tipo:'bilhete',icone:'mapa-partido',texto:'autoridade fragmentada',x:NX+1920,y:NY,w:440,h:600,giro:-1,atraso:A(11200),rotulo:'Nota 5: autoridade fragmentada'},

    // ================= etapa 2: Roma e germânicos
    {id:'jr',tipo:'jigsaw',lado:'roma',x:Z2.x,y:Z2.y,w:500,h:760,rotulo:'Herança de Roma: a vila e o colono preso ao lote'},
    {id:'jg',tipo:'jigsaw',lado:'germ',x:Z2.x+500,y:Z2.y,w:500,h:760,rotulo:'Herança germânica: o chefe com os guerreiros e o lote dado em troca de serviço'},
    {id:'pal',tipo:'palavra',texto:'feudalismo',tam:150,marcaEm:.5,x:Z2.x+100,y:Z2.y+800,w:800,h:210,atraso:A(3800),rotulo:'A palavra feudalismo, formada pelas duas heranças'},
    {id:'cruz',tipo:'icone',nome:'cruz',x:Z2.x+380,y:Z2.y-330,w:240,h:240,atraso:A(6000),rotulo:'Cruz da Igreja'},
    {id:'cruz-et',tipo:'etq2',texto:'Igreja',tam:46,x:Z2.x+640,y:Z2.y-250,w:230,h:90,atraso:A(6800),rotulo:'Etiqueta: Igreja'},

    // ================= etapa 3: o rei sagrado e o poder em pedaços
    {id:'coroa',tipo:'icone',nome:'coroa-aro',x:Z3.x,y:Z3.y,w:300,h:300,rotulo:'Coroa do rei'},
    {id:'frasco',tipo:'icone',nome:'frasco-oleo',x:Z3.x+380,y:Z3.y+40,w:230,h:230,atraso:A(1400),rotulo:'Frasco de óleo da unção'},
    {id:'sagra-et',tipo:'etq2',texto:'sagração',tam:42,x:Z3.x+340,y:Z3.y+300,w:300,h:90,atraso:A(2400),rotulo:'Etiqueta: sagração'},
    {id:'toque',tipo:'icone',nome:'toque-real',x:Z3.x+850,y:Z3.y,w:300,h:300,atraso:A(3600),rotulo:'A mão do rei sobre a testa de um doente'},
    {id:'n-toque',tipo:'notag',texto:'o toque real: Marc Bloch estudou essa crença em Os reis taumaturgos',tam:40,x:Z3.x+740,y:Z3.y+350,w:560,h:230,atraso:A(4600),giro:1,rotulo:'Nota: o toque real, estudado por Marc Bloch'},
    {id:'poder',tipo:'poder',x:Z3.x+1600,y:Z3.y,w:1000,h:1000,rotulo:'A coroa, com setas de poder que se partem no meio do caminho e terminam em castelos'},
    {id:'retalhos',tipo:'retalhos',x:Z3.x+2900,y:Z3.y,w:1380,h:1040,rotulo:'O reino dividido em dezenas de senhorios, cada um com um castelo; a coroa fica pequena em um dos pedaços'},

    // ================= etapa 4: suserano e vassalo
    {id:'tres',tipo:'quadrinho',x:Z4.x,y:Z4.y,w:1860,h:640,rotulo:'Os três atos: homenagem, fidelidade e investidura'},
    {id:'pacto',tipo:'pacto',x:Z4.x+2100,y:Z4.y-150,w:1000,h:1000,rotulo:'O pacto entre suserano e vassalo'},
    {id:'n-nobres',tipo:'notag',texto:'Atenção: o pacto ocorria entre nobres, e não entre senhores e camponeses',tam:42,x:Z4.x+3200,y:Z4.y+80,w:620,h:300,giro:-1.2,rotulo:'Nota: o pacto era entre nobres'},

    // ================= etapa 5: as três ordens
    {id:'ordens',tipo:'ordens',x:Z5.x,y:Z5.y,w:1300,h:1100,rotulo:'Pirâmide das três ordens: oratores, bellatores e laboratores'},
    {id:'n-base',tipo:'notag',texto:'a base sustentava tudo',tam:44,x:Z5.x+1000,y:Z5.y+500,w:300,h:190,giro:1.5,atraso:A(7000),rotulo:'Nota: a base sustentava tudo'},
    {id:'adalberao',tipo:'fonte',grande:true,x:Z5.x+1560,y:Z5.y,w:720,h:470,giro:.6,atraso:A(15000),
      texto:'A casa de Deus, que parece uma só, é na verdade tripla: uns rezam, outros combatem e outros trabalham. Essas três partes vivem juntas e não podem ser separadas. O serviço de uma permite a obra das outras duas, e cada uma, por sua vez, ajuda todas.',
      ref:'Adalberão, bispo de Laon, poema dirigido ao rei Roberto II da França, por volta de 1025 a 1030 (paráfrase da equipe)',
      resposta:'A ideia das três ordens, apresentada como plano de Deus e como troca justa, em que cada grupo serve aos outros. Mas quem escreve é um bispo, membro do topo da sociedade, que fala ao rei. O texto descreve a sociedade como harmônica e esconde a desigualdade: só os que trabalhavam sustentavam materialmente os outros dois, pagando obrigações. É uma ==ideologia== que justificava a ordem feudal e tornava difícil questioná-la.',
      rotulo:'Fonte: o poema de Adalberão de Laon sobre as três ordens'},

    // ================= etapas 6 e 7: o senhorio
    {id:'senhorio',tipo:'senhorio',x:Z6.x,y:Z6.y,w:1760,h:982,giro:-.4,rotulo:'Senhorio medieval visto do alto, com os mansos senhorial, servil e comunal pintados por cima'},
    {id:'n-judeus',tipo:'notag',texto:'mercadores judeus seguiam levando seda, especiarias e sal',tam:42,x:SX(320),y:SY(491)+90,w:760,h:200,giro:1.2,rotulo:'Nota: mercadores judeus seguiam levando seda, especiarias e sal'},
    {id:'calendario',tipo:'calendario',x:Z6.x+2500,y:Z6.y,w:900,h:920,giro:.5,rotulo:'Calendário da semana do servo, com três dias de corveia'},
    {id:'obrig',tipo:'obrigacoes',x:Z6.x+3600,y:Z6.y-120,w:900,h:1340,rotulo:'Mesa de contas com as obrigações do servo'},
    {id:'balanca',tipo:'balanca3',x:Z6.x+4700,y:Z6.y,w:1000,h:860,rotulo:'Balança com escravo, servo e livre'},

    // ================= etapa 8: a Igreja
    {id:'igvida',tipo:'igrejavida',x:Z8.x,y:Z8.y,w:1400,h:1060,rotulo:'A Igreja do nascimento à morte'},
    {id:'ex-coroa',tipo:'icone',nome:'coroa-aro',x:Z8.x+1650,y:Z8.y+30,w:320,h:320,rotulo:'Coroa de um rei'},
    {id:'ex-selo',tipo:'icone',nome:'selo-papal',x:Z8.x+1800,y:Z8.y+130,w:290,h:290,giro:14,atraso:A(1800),rotulo:'Selo papal que risca a coroa'},
    {id:'ex-x',tipo:'xis',x:Z8.x+1650,y:Z8.y+30,w:320,h:320,atraso:A(2400),rotulo:'Dois traços vermelhos riscam a coroa'},
    {id:'ex-et',tipo:'etq2',texto:'excomunhão: expulsa da comunidade dos fiéis',tam:42,x:Z8.x+1620,y:Z8.y+470,w:640,h:170,atraso:A(3000),rotulo:'Etiqueta: excomunhão, expulsão da comunidade dos fiéis'},
    {id:'n-agost',tipo:'notag',texto:'Agostinho de Hipona (354 a 430): sua influência durou até o século XI',tam:42,x:Z8.x+2280,y:Z8.y,w:640,h:270,giro:-1,rotulo:'Nota: Agostinho de Hipona'},
    {id:'n-senhorio',tipo:'notag',texto:'a Igreja era senhorio: mosteiros e bispados tinham terras, mansos e servos',tam:42,x:Z8.x+2280,y:Z8.y+800,w:780,h:330,giro:-.8,atraso:A(2600),rotulo:'Nota: a Igreja era senhorio'},
    {id:'n-tolos',tipo:'notag',texto:'Na Festa dos Tolos e na Festa do Asno, a hierarquia era invertida por um dia; o carnaval era a transgressão aceita antes da quaresma.',tam:42,x:Z8.x+2280,y:Z8.y+360,w:760,h:380,giro:1,atraso:A(1200),rotulo:'Nota: a Festa dos Tolos e a Festa do Asno'},

    // ================= etapa 9: o apogeu
    {id:'trienal',tipo:'trienal',x:Z9.x,y:Z9.y,w:1100,h:960,rotulo:'Sistema trienal: três campos que giram entre trigo, legumes e descanso'},
    {id:'charrua',tipo:'icone',nome:'charrua',x:Z9.x+1300,y:Z9.y,w:300,h:300,atraso:A(2000),rotulo:'Charrua puxada por cavalo'},
    {id:'moinho',tipo:'icone',nome:'moinho-vento',x:Z9.x+1640,y:Z9.y,w:300,h:300,atraso:A(2800),rotulo:'Moinho de vento'},
    {id:'moinho-a',tipo:'icone',nome:'moinho-agua',x:Z9.x+1980,y:Z9.y,w:300,h:300,atraso:A(3200),rotulo:'Moinho de água'},
    {id:'carrinho',tipo:'icone',nome:'carrinho',x:Z9.x+2320,y:Z9.y,w:300,h:300,atraso:A(3600),rotulo:'Carrinho de esterco, o adubo'},
    {id:'et-charrua',tipo:'etq2',texto:'charrua e moinho de vento',tam:40,x:Z9.x+1290,y:Z9.y+330,w:640,h:90,atraso:A(3600),rotulo:'Etiqueta: charrua, adubo e moinhos'},
    {id:'et-agua',tipo:'etq2',texto:'moinho de água e adubo',tam:40,x:Z9.x+1980,y:Z9.y+330,w:640,h:90,atraso:A(3800),rotulo:'Etiqueta: moinho de água e adubo'},
    {id:'romanica',tipo:'romanica',x:Z9.x+1300,y:Z9.y+520,w:760,h:560,atraso:A(7000),rotulo:'Igreja românica'},
    {id:'et-rom',tipo:'etq2',texto:'românico, séculos X a XII: pesado, como uma fortaleza',tam:40,x:Z9.x+1290,y:Z9.y+1120,w:780,h:150,atraso:A(8000),rotulo:'Etiqueta: românico, séculos X a XII'},
    {id:'gotica',tipo:'gotica',x:Z9.x+2300,y:Z9.y+300,w:700,h:900,atraso:A(10500),rotulo:'Igreja gótica com rosácea de vitral colorido'},
    {id:'et-got',tipo:'etq2',texto:'gótico, a partir do século XII: alto, como em Chartres',tam:40,x:Z9.x+2230,y:Z9.y+1240,w:840,h:150,atraso:A(11500),rotulo:'Etiqueta: gótico, a partir do século XII'},
    {id:'et-prox',tipo:'etq2',texto:'Próximo: Islamismo',tam:56,x:FX+1900,y:FY+700,w:640,h:120,rotulo:'Etiqueta: o próximo tópico é o Islamismo'}
  ],

  etapas:[
    // ===== 1. O que é feudalismo
    {titulo:'O que é feudalismo',mostra:['bl-et','bl1','bl2','bl3','bl4','bl5','mapa','fita'],texto:TEXTO[0],
     foco:[NX-60,NY-250,1580,990],focoM:[NX-50,NY-230,1060,970],
     tomadas:[[8500,[NX+940,NY-250,1580,990]],[16000,FD(0,48.5,250)],[30500,TL(0,1450)],[35500,TL(1250,1450)]],
     tomadasM:[[5000,[NX+940,NY-60,960,780]],[10500,[NX+1400,NY-60,960,780]],[16000,FC(-4,47,230)],[30500,TL(0,860)],[35500,TL(1760,860)]],
     tempo:42000},
    // ===== 2. Raízes romanas e germânicas
    {titulo:'Raízes romanas e germânicas',mostra:['jr','jg','pal','cruz','cruz-et'],texto:TEXTO[1],
     foco:[Z2.x-120,Z2.y-400,1240,1560],focoM:[Z2.x-100,Z2.y-400,1200,1600],
     tomadas:[[1500,[Z2.x-60,Z2.y-40,1120,780]],[8000,[Z2.x-120,Z2.y-400,1240,1560]]],
     tomadasM:[[1500,[Z2.x-30,Z2.y-60,560,860]],[4200,[Z2.x+470,Z2.y-60,560,860]],[7000,[Z2.x+250,Z2.y-380,760,500]],[10000,[Z2.x-20,Z2.y+790,1040,640]]],tempo:30000},
    // ===== 3. O rei sagrado e o poder em pedaços
    {titulo:'O rei sagrado e o poder em pedaços',mostra:['coroa','frasco','sagra-et','toque','n-toque','poder','retalhos'],texto:TEXTO[2],
     foco:[Z3.x-70,Z3.y-70,1400,720],focoM:[Z3.x-50,Z3.y-60,740,560],
     tomadas:[[8000,[Z3.x+1560,Z3.y-60,1080,1080]],[16000,FD(2,47,260)],[25000,[Z3.x+2860,Z3.y-60,1460,1180]]],
     tomadasM:[[4500,[Z3.x+720,Z3.y-60,660,680]],[10500,[Z3.x+1570,Z3.y-60,1060,1080]],[16000,FC(2,47,170)],[25000,[Z3.x+2860,Z3.y-60,1460,1180]]],
     tempo:36000},
    // ===== 4. Suserano e vassalo
    {titulo:'Suserano e vassalo',mostra:['tres','pacto'],so:['n-nobres'],texto:TEXTO[3],
     foco:[Z4.x-50,Z4.y-80,1960,800],focoM:[Z4.x-30,Z4.y-60,640,700],
     tomadas:[[16500,[Z4.x+2050,Z4.y-210,1880,1130]]],
     tomadasM:[[4200,[Z4.x+590,Z4.y-60,640,700]],[8200,[Z4.x+1230,Z4.y-60,640,700]],[16500,[Z4.x+2040,Z4.y-210,1080,1130]],[27500,[Z4.x+3100,Z4.y-40,820,520]]],
     tempo:38000},
    // ===== 5. As três ordens
    {titulo:'Os que oram, os que lutam, os que trabalham',mostra:['ordens','n-base','adalberao'],fonte:'adalberao',texto:TEXTO[4],
     foco:[Z5.x-60,Z5.y-70,1440,1240],focoM:[Z5.x-50,Z5.y-60,1400,1230],
     tomadas:[[17500,[Z5.x+1500,Z5.y-80,980,880]],[31000,TL(0,1450)]],
     tomadasM:[[17500,[Z5.x+1530,Z5.y-60,920,860]],[31000,TL(0,860)]],
     tracos:[{tipo:'circulo',peca:'ordens',x:50,y:82,w:102,h:38,cor:'#d63a22',espessura:9,atraso:5200},
             {tipo:'seta',de:{peca:'n-base',x:30,y:100},para:{peca:'ordens',x:88,y:80},cor:'#d63a22',atraso:8200,curva:.25}],
     tempo:40000},
    // ===== 6. O senhorio e seus mansos
    {titulo:'O senhorio e seus mansos',mostra:['senhorio'],so:['n-judeus'],texto:TEXTO[5],
     foco:[Z6.x-60,Z6.y-60,1880,1400],focoM:[SX(0),SY(0),880,1000],
     tomadas:[[16000,[SX(240),SY(0),1520,1300]]],
     tomadasM:[[8500,[SX(380),SY(180),880,1000]],[16000,[SX(0),SY(180),880,1000]],[22500,[SX(420),SY(100),840,1000]],[29000,[SX(310),SY(491)+60,800,420]]],
     tracos:[{tipo:'circulo',peca:'senhorio',x:76.3,y:41.8,w:10.5,h:19,cor:'amarelo',espessura:9,atraso:19000},
             {tipo:'circulo',peca:'senhorio',x:63,y:48,w:17,h:32,cor:'amarelo',espessura:9,atraso:20000},
             {tipo:'circulo',peca:'senhorio',x:49.5,y:51.3,w:8,h:15,cor:'amarelo',espessura:9,atraso:21000}],
     tempo:42000},
    // ===== 7. Servo não é escravo
    {titulo:'Servo não é escravo',mostra:['senhorio','calendario','obrig','balanca'],texto:TEXTO[6],
     foco:[SX(130),SY(10),1340,1000],focoM:[SX(250),SY(20),900,1300],
     tomadas:[[9000,[Z6.x+2450,Z6.y-60,960,960]],[17500,[Z6.x+3540,Z6.y-200,1000,1460]],[28500,[Z6.x+4660,Z6.y-60,1160,980]]],
     tomadasM:[[8000,[Z6.x+2450,Z6.y-60,1000,960]],[16000,[Z6.x+3540,Z6.y-200,1000,1460]],[26000,[Z6.x+4660,Z6.y-20,1000,900]]],
     tempo:44000},
    // ===== 8. A Igreja, o maior senhor
    {titulo:'A Igreja, o maior senhor',mostra:['igvida','ex-coroa','ex-selo','ex-x','ex-et'],so:['n-agost','n-tolos','n-senhorio'],texto:TEXTO[7],
     foco:FD(4,47.5,300),focoM:FC(5,45,190),
     tomadas:[[9500,[Z8.x-60,Z8.y-60,1520,1180]],[21500,[Z8.x+1560,Z8.y-60,1620,1260]]],
     tracos:[{tipo:'seta',de:{peca:'ex-selo',x:50,y:100},para:{peca:'ex-et',x:40,y:0},cor:'#d63a22',atraso:A(3600),curva:.2}],
     tomadasM:[[9500,[Z8.x-10,Z8.y-40,1060,680]],[12500,[Z8.x+40,Z8.y+540,900,560]],[15500,[Z8.x+520,Z8.y+540,900,560]],[19500,[Z8.x+1600,Z8.y-30,760,780]],[24500,[Z8.x+2260,Z8.y-30,760,330]],[29000,[Z8.x+2260,Z8.y+330,820,460]],[33500,[Z8.x+2260,Z8.y+780,820,380]]],
     tempo:40000},
    // ===== 9. O apogeu
    {titulo:'O apogeu: arados, moinhos e catedrais',mostra:['trienal','charrua','moinho','moinho-a','carrinho','et-charrua','et-agua','romanica','et-rom','gotica','et-got','et-prox'],texto:TEXTO[8],
     foco:[Z9.x-60,Z9.y-60,1220,1060],focoM:[Z9.x-40,Z9.y-40,1180,1040],
     tomadas:[[9500,[Z9.x+1240,Z9.y-40,1440,560]],[14500,[Z9.x+1220,Z9.y-30,2080,1460]],[25500,TL(500,1500)],[30500,[FX+1250,FY-10,1450,860]]],
     tomadasM:[[8000,[Z9.x+1240,Z9.y-50,780,480]],[11500,[Z9.x+1900,Z9.y-50,780,480]],[15000,[Z9.x+1220,Z9.y+470,860,860]],[19500,[Z9.x+2200,Z9.y+250,860,1180]],[25500,TL(500,860)],[30500,TL(1750,860)]],
     tempo:42000}
  ]
});
})();
