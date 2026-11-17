/* Módulo 1, tópico 7: Povos orientais (China, Índia e Japão). Roteiro revisado: docs/revisao-historia/m01-t07-povos-orientais.md
   Formato dos dados: docs/historia/MOTOR.md. Recortes e esquemas próprios: recortes-oriente.js (carregado depois de recortes.js).
   Mapa-múndi (historia-mapa-mundo, 1376 x 768): os pontos usam longitude e latitude (ll:true), calibradas no motor com erro de até cerca de 6 px.
   A peça do mapa tem escala 3 na mesa (4128 x 2304). Mb() leva pixel da base para pixel da mesa e ML() leva longitude e latitude direto à mesa.
   Mesa em zonas: mapa (topo), fita do tempo com três faixas (embaixo do mapa), China (muralha e pirâmide), Confúcio e Tao e a fonte,
   castas, três religiões (segunda fileira) e Japão (segunda fileira, à direita). */
(function(){
const A=n=>Colagem.reduz?0:n;
const BASE='historia-mapa-mundo',S=3,MX=1000,MY=0;
const Mb=(x,y)=>[Math.round(MX+x*S),Math.round(MY+y*S)];
const LL=(lon,lat)=>Colagem.lonlat(BASE,lon,lat);
const ML=(lon,lat)=>{const q=LL(lon,lat);return Mb(q[0],q[1]);};
const FB=(cx,cy,w,asp)=>{const h=w/(asp||1.3),a=Mb(cx-w/2,cy-h/2);return [a[0],a[1],Math.round(w*S),Math.round(h*S)];};   // enquadra no mapa (desktop), em pixels da base
const FM=(cx,cy,w)=>FB(cx,cy,w,.68);                                                                                        // enquadra no mapa (celular)
const FD=(lon,lat,w)=>{const q=LL(lon,lat);return FB(q[0],q[1],w);};
const FC=(lon,lat,w)=>{const q=LL(lon,lat);return FM(q[0],q[1],w);};
const TL=(x,w)=>[x,2380,w,600];                       // enquadra um trecho da fita do tempo (três faixas)
// ---- regiões (longitude e latitude); "terra:true" recorta pela costa da base
const CHINA=[[103,37],[104.5,38.5],[106.5,39.2],[109,41],[112,41.4],[116,41.4],[119.6,41.2],[122,41.8],[124.3,40.8],[124.4,40],[124,38.5],[124,34],[124,28],[121.5,25],[118,22.5],[115,21],[112,20.5],[110,20],[108.2,21.2],[106.5,22.4],[104.2,22.6],[102,22.4],[101,24],[101.5,26.5],[102.8,29],[103.8,32],[103,34.5]];
const INDIA=[[68,23.5],[68.5,27.8],[71,28.3],[72.5,31.5],[74.4,32.8],[74.2,34.6],[76,35.8],[78,35.6],[79.6,33],[79,31.4],[80.3,30.3],[81.3,30.1],[80.2,28.8],[84.6,27.5],[88.1,26.6],[88.4,25],[88.7,24.2],[89,21.5],[88,20],[86.5,19],[84,16],[81,13],[80,10],[78.8,7.6],[77,7.5],[75.4,10.5],[73.8,14.5],[72.4,20],[70,20.5],[68,22]];
const INDIA_NE=[[89.8,26.7],[92.5,26.8],[93.5,28],[95.6,28.6],[97.4,28.3],[96.5,26.8],[95.4,25],[94.8,23.4],[93.3,23],[92.3,24.4],[91.4,25.2],[90.2,25.3]];
const JAPAO=[[129.6,34.2],[131.4,35.2],[134,36],[136.8,37.8],[139.2,40],[140,41.6],[140.2,45.8],[145.9,45.8],[146,43],[143.4,40.2],[142.4,37],[141.2,34.8],[136.5,32.8],[132,30.4],[129.6,30.8]];
// retalhos de reinos na Índia
const REINO1=[[72,24],[76,25],[77.5,28.5],[74,31],[72,29]];
const REINO2=[[77.5,25],[82,25.6],[83,28.5],[79,29.5],[77.5,28.5]];
const REINO3=[[83,25.6],[88.5,24.6],[88.5,27],[84,27.8],[83,28.5]];
const REINO4=[[73,16],[79,18],[81,23],[77,24.6],[72,21]];
const REINO5=[[79,17],[85,18.5],[87,22],[83,24.6],[81,23]];
const REINO6=[[75,7.5],[80.5,9],[80,14],[76,15.5],[73.8,13.5]];
// ---- rios (longitude e latitude)
const R_AMARELO=[[96,34.5],[99,35.4],[101.5,36],[103.5,36.6],[105.5,37.8],[106.8,39.3],[108.3,40.8],[110.5,40.6],[111,38.5],[110.6,36],[110.3,34.6],[112.5,34.8],[114.5,34.9],[116.6,35.8],[117.6,37.2],[118.9,37.8]];
const R_AZUL=[[91.2,33.5],[94.5,32.8],[97,31.5],[99,29.5],[100.4,27.5],[102.4,27.6],[104.3,28.8],[106.6,29.6],[108.5,30.8],[110.5,30.7],[112.3,30.1],[113.8,30.3],[115.6,29.8],[117.4,30.7],[119.6,32],[121.2,31.8],[121.9,31.4]];
const R_INDO=[[81.5,31],[79.5,32.2],[77.6,34.1],[75.6,35.3],[74.4,35.4],[73.2,34.8],[72.4,33.4],[71.7,31.5],[70.8,29.8],[70,28.5],[68.9,27.6],[68.4,25.8],[68.3,25],[67.7,24.3]];
const R_GANGES=[[79,30.9],[78.3,29.6],[79.3,28],[80.5,27],[82,26.1],[83.4,25.3],[85,25.6],[86.5,25.4],[87.6,25.2],[88.2,24.6],[89.2,23.8],[90.3,22.6]];
// muralha: linha dentada, de leste para oeste (dentes de cerca de meio grau)
function dentes(pts,amp,passo){
  const out=[];let k=0;
  for(let i=0;i<pts.length-1;i++){
    const a=pts[i],b=pts[i+1],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),n=Math.max(1,Math.round(L/passo)),nx=-dy/L,ny=dx/L;
    for(let j=0;j<n;j++){const t=j/n,m=(k++%2?1:-1)*amp;out.push([a[0]+dx*t+nx*m,a[1]+dy*t+ny*m]);}
  }
  out.push(pts[pts.length-1]);return out;
}
const MURALHA=dentes([[124.1,40.4],[121.2,40.8],[119.8,40.5],[117.5,40.7],[115,40.8],[113,40.3],[111,40.8],[109,40.5],[107,39.6],[106,38.6],[104,37.6],[102,37.8],[100,38.8],[98.3,39.8]],.3,.8);
// rota do budismo: Índia, China (pela Rota da Seda), Coreia e Japão
const R_BUDISMO=[[85,24.7],[80,30],[74.5,34.5],[75.8,39.4],[82.9,41.7],[89.2,42.9],[94.7,40.1],[102.6,37.9],[108.9,34.3],[112.4,34.6],[117,35.5],[120,36.2],[123.5,36.8],[126.6,37.4],[127.4,35.5],[129,35.2],[132.4,34.8],[135.6,34.7]];

const TEXTO=[
  'A leste do Mediterrâneo, a Ásia abrigava povos com religiões, línguas e formas de governo muito diferentes. Três deles aparecem bastante no ENEM e nos vestibulares: a ==China==, que se formou nos vales dos rios Amarelo e Azul; a ==Índia==, cuja primeira civilização nasceu às margens do rio Indo e que depois se expandiu para o vale do Ganges; e o ==Japão==, um arquipélago diante da Ásia continental, que recebeu muitas influências da China e da Coreia. Como no Egito e na Mesopotâmia, os grandes rios garantiam água, solo fértil e alimento para cidades populosas. Cuidado com a palavra Oriente: ela olha a Ásia a partir da Europa, como "o que fica a leste", e junta num mesmo nome povos que pouco tinham em comum.',
  'Os chineses ergueram a ==Muralha da China==, que não é uma obra única: é um conjunto de muros construídos e refeitos durante séculos, os mais antigos de terra socada, para proteger o norte contra povos nômades das estepes. No século III a.C., o primeiro imperador, Qin Shi Huang, uniu trechos que já existiam e padronizou a escrita, as moedas e os pesos. No topo do Estado estava o ==imperador==, visto como governante com um mandato do céu. Abaixo dele vinham os nobres e os ==mandarins==, funcionários letrados que administravam o império, cobravam impostos e precisavam dominar a escrita e os textos clássicos. Na base estavam os camponeses, a grande maioria da população, que pagavam impostos e eram convocados para trabalhar nas grandes obras, como a própria Muralha.',
  'Duas doutrinas formadas entre os séculos VI e V a.C. marcaram a China. O ==confucionismo==, baseado nos ensinamentos de Confúcio, valoriza a sabedoria, o estudo, o respeito às tradições, aos mais velhos e à hierarquia. Para ele, a sociedade fica em ordem quando cada um cumpre o seu papel: o governante governa, o súdito obedece, o pai orienta e o filho respeita. Por isso essas ideias serviram ao Estado e aos mandarins por muitos séculos. O ==taoísmo==, ligado pela tradição a Lao-Tsé, busca viver em harmonia com o Tao, o caminho natural das coisas, com simplicidade e sem excesso de regras. Critica as diferenças sociais, a ambição e as normas artificiais. O yin e o yang, forças opostas e complementares, é um símbolo associado a essa tradição.',
  'A primeira civilização indiana surgiu em torno do ==rio Indo==, hoje quase todo no Paquistão, com grandes cidades planejadas por volta de 2600 a.C. Por volta de 1500 a.C., povos indo-arianos chegaram ao norte da Índia, e a vida se deslocou aos poucos para o vale do Ganges. Na maior parte da Antiguidade, a Índia ficou dividida em muitos reinos, sem um império duradouro. Era rica em especiarias, temperos, pedras preciosas e algodão, produtos que atrairiam comerciantes por séculos. A sociedade se organizava em ==castas==: cada pessoa nascia numa casta, que definia seu trabalho e com quem podia casar, e nela morria. Não havia ==mobilidade social==, isto é, ninguém mudava de grupo pelo trabalho ou pela riqueza. O sistema tem raízes nos textos religiosos dos indo-arianos, os Vedas.',
  'O ==hinduísmo==, a religião mais antiga e tradicional da Índia, tem muitos deuses e textos sagrados, como os Vedas, e sustentava o sistema de castas: cumprir o dever da própria casta seria o caminho para renascer numa posição melhor. Nos séculos VI e V a.C., surgiram duas doutrinas que questionavam a autoridade dos sacerdotes brâmanes. O ==jainismo==, de Mahavira, busca tornar o espírito mais forte que as paixões e prega a não violência e o respeito a toda forma de vida. O ==budismo==, criado por Sidarta Gautama, o Buda, prega a contemplação e o desapego dos bens materiais como caminho para o fim do sofrimento. Acredita na reencarnação e no carma, a ideia de que cada ação traz consequências, mas é contrário às castas: qualquer pessoa pode buscar a iluminação.',
  'No Japão, o imperador tinha papel sagrado, mas, a partir de 1192, o poder real ficou com o ==xogum==, chefe militar apoiado pelos samurais, guerreiros ligados a seus senhores por lealdade. Esse governo é o ==xogunato==, que durou até 1867; portanto, pertence à Idade Média e à Idade Moderna, não à Antiguidade. A religião nativa é o ==xintoísmo==, que dá grande valor à natureza e venera os kami, espíritos presentes em montanhas, rios, árvores e pedras, além dos antepassados. O budismo, nascido na Índia, chegou ao Japão pela China e pela Coreia no século VI e pregava piedade, pacifismo e caridade. As duas religiões passaram a conviver, e muitos japoneses seguiam ambas. Como na China, a sociedade era bem hierarquizada: imperador, xogum, samurais e camponeses.'
];

Colagem.montar({
  modulo:'Módulo 1: Pré-História e Antiguidade',
  titulo:'China, Índia e Japão',
  subtitulo:'Três sociedades, muitas religiões e um mesmo nome dado de fora',
  credito:'Figura da muralha: recriação gerada por IA a partir de um trecho de muralha de terra socada da dinastia Han. Recortes, esquemas e mapa desenhados pelo LAB.',
  ritmo:10000,
  celularGrande:true,
  msPalavra:250,
  mesa:{w:9400,h:6800},
  enem:`O que mais cai é a ==sociedade de castas==, sem mobilidade social, comparada às sociedades estamental e de classes, e o ==budismo== como crítica às castas. As questões costumam trazer um trecho de texto religioso ou filosófico, como os Analectos de Confúcio, e pedem a relação entre a crença e a organização da sociedade.

Pegadinhas:
- A muralha de pedra e tijolo das fotos é da dinastia Ming, bem posterior.
- O xogunato é medieval e moderno, não antigo.
- As castas não vêm das cidades do vale do Indo; elas aparecem depois, com os indo-arianos.
- O budismo não rejeita a reencarnação, rejeita as castas.
- "Oriente" é um rótulo europeu, não um povo.`,
  estudo:[
  {titulo:'Um nome dado de fora',texto:`Os livros chamam de "povos orientais" sociedades da Ásia com religiões, línguas e governos muito diferentes entre si. O nome **Oriente** vem do ponto de vista europeu: é o que fica a leste da Europa. Vale usá-lo sabendo que ele junta povos que pouco tinham em comum. Este tópico trata de três deles: **China**, **Índia** e **Japão**.

Como no Egito e na Mesopotâmia, as primeiras civilizações da China e da Índia nasceram junto de grandes rios, que garantiam água, solo fértil e comida para cidades populosas: o **Amarelo** e o **Azul** (Yangtzé), na China, e o **Indo** e o **Ganges**, na Índia.`},
  {titulo:'China: imperador, mandarins e camponeses',texto:`O Estado chinês era centralizado e hierarquizado. No topo estava o **imperador**, visto como governante com um mandato do céu. Abaixo vinham os nobres e os **mandarins**, funcionários letrados que administravam o império, cobravam impostos e registravam tudo por escrito. Na base estavam os **camponeses**, a grande maioria, que sustentavam o Estado com impostos e com trabalho nas obras públicas.

A obra mais conhecida é a **Muralha da China**. Ela não é um muro único feito de uma vez: é um conjunto de muralhas construídas e refeitas durante séculos para proteger o norte contra povos nômades das estepes. No século III a.C., o primeiro imperador, **Qin Shi Huang**, uniu trechos que já existiam e padronizou a escrita, as moedas e os pesos, o que ajudou a manter unido um território enorme. As muralhas antigas eram sobretudo de terra socada, a **taipa**. A muralha de pedra e tijolo das fotos, perto de Pequim, é bem mais recente, da dinastia **Ming**, que governou a partir do século XIV.`},
  {titulo:'Confucionismo e taoísmo',texto:`Duas doutrinas formadas entre os séculos VI e V a.C. marcaram a China por mais de dois mil anos. O **confucionismo** nasceu dos ensinamentos de Confúcio (551 a 479 a.C., pela tradição), reunidos depois por seus discípulos nos Analectos. Ele valoriza a sabedoria, o estudo, as tradições e o respeito aos mais velhos e aos antepassados. A sociedade estaria em ordem quando cada um cumprisse o papel da sua posição, no Estado e na família: o governante como governante, o súdito como súdito, o pai como pai, o filho como filho. Como via a hierarquia como natural e valorizava o estudo, o confucionismo serviu ao Estado imperial e formou a cultura dos mandarins.

O **taoísmo** é ligado pela tradição a Lao-Tsé. Propõe viver em harmonia com o **Tao**, o caminho natural das coisas, com simplicidade, sem ambição e sem excesso de regras. Os livros didáticos o apresentam como contrário às diferenças sociais e às normas artificiais. O yin e o yang, forças opostas e complementares, é um símbolo associado a esse pensamento. Para lembrar: o confucionismo olha para a ordem da sociedade; o taoísmo, para a harmonia com a natureza.`},
  {titulo:'Índia: do vale do Indo às castas',texto:`A primeira civilização indiana surgiu no **vale do Indo**, hoje quase todo no Paquistão, com cidades planejadas por volta de 2600 a.C. Por volta de 1500 a.C., povos **indo-arianos** chegaram ao norte da Índia, e a vida se deslocou aos poucos para o vale do **Ganges**. Na maior parte da Antiguidade, a Índia ficou dividida em muitos reinos. Houve impérios, como o Máuria, no século III a.C., mas nenhum unificou a região de forma duradoura. A Índia era rica em especiarias, temperos, pedras preciosas e algodão, e por ela também circulava a seda, produto sobretudo chinês. Esses produtos atrairiam comerciantes por séculos, inclusive os europeus.

A marca mais cobrada da Índia é a **sociedade de castas**. Nos textos védicos, a sociedade aparece dividida em quatro grandes grupos, as **varnas**: brâmanes (sacerdotes), xátrias (guerreiros), vaixás (comerciantes e agricultores) e sudras (servos). Fora delas ficavam os **párias**, hoje chamados dalits. Na prática, havia milhares de grupos menores, as jatis. Cada pessoa nascia numa casta, que definia seu trabalho e com quem podia casar, e não podia mudar de casta durante a vida: não havia **mobilidade social**. A justificativa era religiosa: aceitar o próprio lugar seria o caminho para renascer numa posição melhor. Atenção: não há prova de que as castas existissem nas cidades do vale do Indo; elas aparecem depois, com os indo-arianos.`},
  {titulo:'Hinduísmo, jainismo e budismo',texto:`O **hinduísmo** é a religião mais antiga e tradicional da Índia. Tem muitos deuses e textos sagrados, como os Vedas, crê na reencarnação e no carma e dava sustentação religiosa às castas. Nos séculos VI e V a.C., surgiram duas doutrinas que questionavam a autoridade dos brâmanes. O **jainismo**, associado a Mahavira, busca tornar o espírito mais forte que as paixões e prega a não violência e o respeito a toda forma de vida. O **budismo** foi criado por Sidarta Gautama, o Buda, "o iluminado". Prega a contemplação e o desapego dos bens materiais como caminho para o fim do sofrimento. Mantém a crença na reencarnação e no carma, mas é contrário às castas: a iluminação está aberta a qualquer pessoa. O budismo se espalhou pela Ásia e chegou à China, à Coreia e ao Japão.`},
  {titulo:'Japão: xogunato, xintoísmo e budismo',texto:`O Japão é um arquipélago e recebeu muitas influências da China e da Coreia, como a escrita e o budismo. O imperador tinha papel sagrado, mas, a partir de 1192, o poder real passou ao **xogum**, chefe militar apoiado pelos **samurais**, guerreiros ligados por lealdade a seus senhores. Esse governo, o **xogunato**, durou até 1867. Por isso ele não é antigo: pertence à Idade Média e à Idade Moderna, e aparece aqui porque o material trata o Japão junto com China e Índia. A sociedade era hierarquizada: imperador, xogum, samurais e camponeses.

A religião nativa é o **xintoísmo**, que dá grande valor à natureza e venera os **kami**, espíritos presentes em montanhas, rios, árvores, pedras e nos antepassados. O budismo chegou no século VI, vindo da Índia pela China e pela Coreia, e pregava piedade, pacifismo e caridade. As duas religiões passaram a conviver.`},
  {titulo:'Comparando as três',texto:`Nas três sociedades, a hierarquia era forte, e a religião ou a filosofia ajudava a justificá-la: o confucionismo, a ordem chinesa; o hinduísmo, as castas; o caráter sagrado do imperador, o topo da sociedade japonesa. Mas cada uma produziu também críticas internas, como o taoísmo e o budismo.

Nas provas, a **sociedade de castas** costuma ser comparada à **sociedade estamental**, como a feudal, em que a mobilidade é rara e depende do nascimento, e à **sociedade de classes**, capitalista, em que a mobilidade é possível pela renda.`}
  ],
  resumo:[
  '"Oriente" é um rótulo europeu que junta povos muito diferentes.',
  'China e Índia nasceram junto de grandes rios: Amarelo e Azul; Indo e Ganges.',
  'China: imperador, nobres, mandarins e camponeses; a Muralha foi feita e refeita durante séculos.',
  'Confucionismo: hierarquia, tradição e estudo; taoísmo: harmonia com a natureza e crítica às regras artificiais.',
  'Índia: muitos reinos, especiarias, pedras preciosas e algodão.',
  'Castas: o nascimento define função e casamento; não há mobilidade social.',
  'Hinduísmo sustenta as castas; jainismo prega respeito à vida; budismo prega desapego e é contrário às castas.',
  'Japão: xogum e samurais (1192 a 1867), imperador sagrado, xintoísmo e kami, budismo vindo pela China e pela Coreia.'
  ],
  urca:`Não há ligação histórica direta entre a China, a Índia ou o Japão antigos e o Ceará. Para a prova, reforce a comparação entre castas, estamentos e classes e a diferença entre as três religiões da Índia. Guarde também uma ponte para o módulo 3: as especiarias e os tecidos da Ásia motivaram a busca portuguesa por um caminho marítimo para as Índias, parte da expansão que trouxe os europeus ao Brasil.`,

  pecas:[
    {id:'mapa',tipo:'mapa',base:BASE,x:MX,y:MY,w:4128,h:2304,rotulo:'Mapa-múndi: Europa, Ásia, os rios Amarelo, Azul, Indo e Ganges, a Muralha da China e o Japão',camadas:[
      // ===== etapa 1: muitos Orientes (0)
      {tipo:'cidade',ll:true,p:[12.5,41.9],nome:'Roma',tam:.25,lado:'e',etapas:[0],atraso:A(500)},
      {tipo:'cidade',ll:true,p:[23.7,38],nome:'Atenas',tam:.25,lado:'d',etapas:[0],atraso:A(1200)},
      {tipo:'regiao',ll:true,terra:true,pts:CHINA,suave:false,cor:'coral',opac:.85,etapas:[0,1],atraso:A(4500)},
      {tipo:'etiqueta',ll:true,p:[108.5,24.5],texto:'China',tam:.22,etapas:[0],atraso:A(5500)},
      {tipo:'rota',ll:true,pts:R_AMARELO,estilo:'rio',largura:2.6,dur:3,etapas:[0,1],atraso:A(7000)},
      {tipo:'etiqueta',ll:true,p:[95.2,38.2],texto:'rio Amarelo',tam:.2,etapas:[0],atraso:A(8000)},
      {tipo:'rota',ll:true,pts:R_AZUL,estilo:'rio',largura:2.6,dur:3,etapas:[0,1],atraso:A(9000)},
      {tipo:'etiqueta',ll:true,p:[102,26.6],texto:'rio Azul',sub:'(Yangtzé)',tam:.25,etapas:[0],atraso:A(10000)},
      {tipo:'regiao',ll:true,terra:true,pts:INDIA,suave:false,cor:'coral',opac:.85,etapas:[0],atraso:A(14000)},
      {tipo:'regiao',ll:true,terra:true,pts:INDIA_NE,suave:false,cor:'coral',opac:.85,etapas:[0],atraso:A(14000)},
      {tipo:'etiqueta',ll:true,p:[76,18],texto:'Índia',tam:.22,etapas:[0],atraso:A(15000)},
      {tipo:'rota',ll:true,pts:R_INDO,estilo:'rio',largura:2.6,dur:3,etapas:[0],atraso:A(16500)},
      {tipo:'etiqueta',ll:true,p:[61.5,30.5],texto:'rio Indo',tam:.2,etapas:[0],atraso:A(17500)},
      {tipo:'rota',ll:true,pts:R_GANGES,estilo:'rio',largura:2.6,dur:3,etapas:[0],atraso:A(18500)},
      {tipo:'etiqueta',ll:true,p:[81.5,23.2],texto:'rio Ganges',tam:.2,etapas:[0],atraso:A(19500)},
      {tipo:'regiao',ll:true,terra:true,pts:JAPAO,suave:false,cor:'coral',opac:.85,etapas:[0],atraso:A(25000)},
      {tipo:'etiqueta',ll:true,p:[142.5,37.5],texto:'Japão',tam:.22,etapas:[0],atraso:A(26000)},
      {tipo:'etiqueta',ll:true,p:[104,35.5],texto:'China',tam:.55,etapas:[0],atraso:A(33800)},
      {tipo:'etiqueta',ll:true,p:[74,24],texto:'Índia',tam:.55,etapas:[0],atraso:A(33800)},
      {tipo:'etiqueta',ll:true,p:[138,30],texto:'Japão',tam:.55,etapas:[0],atraso:A(33800)},
      {tipo:'rotulo',ll:true,p:[144,32],texto:'Oceano Pacífico',classe:'mar',tam:.3,desde:0,ate:0},
      {tipo:'rotulo',ll:true,p:[66,5],texto:'Oceano Índico',classe:'mar',tam:.3,desde:0,ate:0},

      // ===== etapa 2: China, a muralha (1)
      {tipo:'rota',ll:true,pts:MURALHA,estilo:'fronteira',cor:'amarelo',largura:2.4,tracejada:false,dur:4,etapas:[1],atraso:A(2000)},
      {tipo:'etiqueta',ll:true,p:[99.5,45.6],texto:'muros de várias épocas',sub:'unidos por Qin Shi Huang, século III a.C.',tam:.26,etapas:[1],atraso:A(6500)},

      // ===== etapa 4: Índia, o Indo e as castas (3)
      {tipo:'corredor',ll:true,pts:R_INDO.slice(5),cor:'coral',opac:.85,largura:13,etapas:[3],atraso:A(1500)},
      {tipo:'rota',ll:true,pts:R_INDO,estilo:'rio',largura:2.6,dur:2,etapas:[3],atraso:A(1500)},
      {tipo:'cidade',ll:true,p:[72.9,30.65],nome:'Harappa',tam:.2,lado:'d',etapas:[3],atraso:A(3500)},
      {tipo:'cidade',ll:true,p:[68.35,27.3],nome:'Mohenjo-Daro',tam:.2,lado:'e',etapas:[3],atraso:A(4200)},
      {tipo:'rotulo',ll:true,p:[61.5,31.5],texto:'vale do Indo',classe:'regiao',tam:.2,etapas:[3],atraso:A(5000)},
      {tipo:'nota',ll:true,p:[60,4.5],texto:'as castas vieram depois,|com os indo-arianos,|a partir de cerca de 1500 a.C.',tam:.2,etapas:[3],atraso:A(7000)},
      {tipo:'regiao',ll:true,terra:true,pts:REINO1,suave:false,cor:'#d9b45c',opac:.8,etapas:[3],atraso:A(14000)},
      {tipo:'regiao',ll:true,terra:true,pts:REINO2,suave:false,cor:'#8fb3a9',opac:.8,etapas:[3],atraso:A(14400)},
      {tipo:'regiao',ll:true,terra:true,pts:REINO3,suave:false,cor:'#c9806a',opac:.8,etapas:[3],atraso:A(14800)},
      {tipo:'regiao',ll:true,terra:true,pts:REINO4,suave:false,cor:'#b7a3cc',opac:.8,etapas:[3],atraso:A(15200)},
      {tipo:'regiao',ll:true,terra:true,pts:REINO5,suave:false,cor:'#d9b45c',opac:.8,etapas:[3],atraso:A(15600)},
      {tipo:'regiao',ll:true,terra:true,pts:REINO6,suave:false,cor:'#8fb3a9',opac:.8,etapas:[3],atraso:A(16000)},
      {tipo:'etiqueta',ll:true,p:[80.5,20.5],texto:'muitos reinos',tam:.2,etapas:[3],atraso:A(17000)},
      {tipo:'rota',ll:true,pts:[[63,40],[67,37],[70.5,34.6],[73.5,32],[77.5,29.4],[82,26.6]],estilo:'rota',cor:'seta',largura:3,tam:.4,movel:'ponto',volta:7000,etapas:[3],atraso:A(8500)},
      {tipo:'etiqueta',ll:true,p:[57,41.8],texto:'indo-arianos, cerca de 1500 a.C.',sub:'vindos do noroeste',tam:.25,etapas:[3],atraso:A(9500)},
      // ===== etapa 6: Japão e a rota do budismo (5)
      {tipo:'regiao',ll:true,terra:true,pts:JAPAO,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(1500)},
      {tipo:'etiqueta',ll:true,p:[133,32.5],texto:'Japão',tam:.3,etapas:[5],atraso:A(2500)},
      {tipo:'rota',ll:true,pts:R_BUDISMO,estilo:'rota',cor:'amarelo',largura:6,tam:.45,movel:'ponto',volta:12000,etapas:[5],atraso:A(8000),dur:6},
      {tipo:'etiqueta',ll:true,p:[82,22.5],texto:'Índia',tam:.38,etapas:[5],atraso:A(8500)},
      {tipo:'etiqueta',ll:true,p:[104,32],texto:'China',tam:.38,etapas:[5],atraso:A(12500)},
      {tipo:'etiqueta',ll:true,p:[126.2,38.4],texto:'Coreia',tam:.38,etapas:[5],atraso:A(14500)},
      {tipo:'etiqueta',ll:true,p:[120,28],texto:'o budismo chega',sub:'ao Japão no século VI',tam:.34,etapas:[5],atraso:A(16000)}
    ].map(L=>(L.etapas&&L.etapas.length===1&&L.etapas[0]===0&&(L.atraso||0)<33000&&/etiqueta|rotulo|cidade/.test(L.tipo))||(L.desde===0&&L.ate===0)?Object.assign(L,{dura:Math.max(500,33000-(L.atraso||0))}):L)},

    // ---- fita do tempo: três faixas (China, Índia, Japão); a régua não está em escala
    {id:'tempo-i',tipo:'tempo',grande:true,x:1400,y:2640,w:3400,h:190,giro:.2,avisoEt:'0,1,2,3,4,5',aviso:'régua fora de escala',
     marcos:[
      {p:8,t:'2600 a 1900 a.C.',s:'Índia: cidades do Indo',etapa:3,cor:'petroleo'},
      {p:22,t:'cerca de 1500 a.C.',s:'Índia: indo-arianos',etapa:3,cor:'petroleo'},
      {p:36,t:'séculos VI e V a.C.',s:'Índia: Mahavira e Buda',etapa:[4],cor:'petroleo'}]},
    {id:'tempo-c',tipo:'tempo',grande:true,x:1400,y:2420,w:3400,h:190,giro:-.2,
     marcos:[
      {p:36,t:'séculos VI e V a.C.',s:'China: Confúcio e Lao-Tsé',etapa:[2]},
      {p:50,t:'século III a.C.',s:'China: Qin Shi Huang',etapa:1}]},
    {id:'tempo-j',tipo:'tempo',grande:true,x:1400,y:2860,w:3400,h:190,giro:.2,
     marcos:[
      {p:64,t:'século VI d.C.',s:'Japão: chega o budismo',etapa:5,cor:'amarelo'},
      {p:80,t:'1192 a 1867',s:'Japão: xogunato',etapa:5,cor:'amarelo'}]},
    {id:'et-tc',tipo:'etiqueta',x:1000,y:2470,w:360,h:100,clicavel:false,texto:'China'},
    {id:'et-ti',tipo:'etiqueta',x:1000,y:2690,w:360,h:100,clicavel:false,texto:'Índia'},
    {id:'et-tj',tipo:'etiqueta',x:1000,y:2910,w:360,h:100,clicavel:false,texto:'Japão'},

    // ---- etapa 1: a seta do Oriente, dado de fora
    {id:'n-ori',tipo:'nota',fs:54,x:Mb(862,404)[0],y:Mb(862,404)[1],w:780,giro:-1.2,atraso:A(37500),texto:'Oriente: um nome dado de fora, pelos europeus.'},

    // ---- etapa 2: a muralha de taipa, a pirâmide do império e o pincel dos mandarins
    {id:'mur',tipo:'foto',img:'historia-oriente-muralha',x:700,y:3800,w:1000,h:558,giro:-1.5,fita:{x:30,g:-4},atraso:A(11500),rotulo:'Trecho antigo da muralha de terra socada e junco, no deserto de Gansu, no noroeste da China'},
    {id:'et-taipa',tipo:'etiqueta',fs:46,x:700,y:4430,w:1000,h:130,clicavel:false,atraso:A(16500),texto:'terra socada em camadas, não tijolo'},
    {id:'et-han',tipo:'etiqueta',fs:44,x:900,y:4590,w:600,h:100,clicavel:false,atraso:A(18000),texto:'trecho antigo, dinastia Han'},
    {id:'pir-c',tipo:'hierarquia',x:1900,y:3760,w:900,h:672,giro:.8,alturaCamada:110,atraso:A(22500),rotulo:'Pirâmide social da China: imperador, nobres, mandarins e camponeses',
     camadas:[{t:'imperador',s:'mandato do céu'},{t:'nobres'},{t:'mandarins',s:'funcionários letrados'},{t:'camponeses',s:'a grande maioria'}]},
    {id:'pincel',tipo:'icone',nome:'pincel-rolo',fundo:'amarelo',x:2650,y:4040,w:240,h:240,giro:3,atraso:A(25500),rotulo:'Recorte: pincel e rolo de papel, a escrita dos mandarins'},

    // ---- etapa 3: Confúcio e o Tao, e a fonte
    {id:'confucio',tipo:'confucio',x:3300,y:3800,w:1100,h:860,giro:-.6,rotulo:'Confucionismo: uma escada com governante, súdito, pai e filho, e a etiqueta ordem e hierarquia'},
    {id:'tao',tipo:'tao',x:4500,y:3800,w:1100,h:860,giro:.6,atraso:A(15000),rotulo:'Taoísmo: yin e yang e um rio que corre livre, com a etiqueta harmonia com a natureza'},
    {id:'doc',tipo:'fonte',grande:true,x:5800,y:3800,w:540,h:800,giro:1,atraso:A(27000),rotulo:'Fonte histórica: Confúcio, Analectos, livro XII, 11',
     texto:'“O duque Jing, de Qi, perguntou a Confúcio sobre o governo. Confúcio respondeu: que o governante seja governante, e o súdito, súdito; que o pai seja pai, e o filho, filho. O duque disse: muito bem. Se o governante não for governante, nem o súdito, súdito, mesmo que eu tenha cereal, será que vou poder comê-lo?”',
     ref:'Confúcio, Analectos (Lunyu), livro XII, 11. Conversas de Confúcio (551 a 479 a.C., pela tradição) reunidas pelos seus discípulos depois da morte dele. Paráfrase da equipe, a partir da tradução de Legge (1861, domínio público).',
     resposta:'Que, para o confucionismo, a boa ordem vem de ==cada um cumprir o papel da sua posição==, no Estado e na família, e que a hierarquia era vista como natural e necessária. Por isso essas ideias serviram ao Estado chinês e aos mandarins. Cuidado: não foi Confúcio quem escreveu; são ==falas registradas por discípulos==, organizadas depois.'},

    // ---- etapa 4: as castas, e os produtos da Índia
    {id:'castas',tipo:'castas',x:7100,y:3760,w:1300,h:900,giro:-.5,atraso:A(20000),rotulo:'As quatro varnas da Índia, os párias fora da pirâmide e um cadeado: nasce e morre na mesma casta'},
    {id:'pimenta',tipo:'icone',nome:'pimenta',fundo:'coral',x:Mb(...LL(76.2,11))[0]-50,y:Mb(...LL(76.2,11))[1]-50,w:100,h:100,giro:-3,atraso:A(10500),rotulo:'Recorte: tigela de grãos de pimenta, especiaria da Índia'},
    {id:'gema',tipo:'icone',nome:'gema',fundo:'petroleo',x:Mb(...LL(80.5,18.3))[0]-50,y:Mb(...LL(80.5,18.3))[1]-50,w:100,h:100,giro:2,atraso:A(11500),rotulo:'Recorte: pedra preciosa em cabochão'},
    {id:'algodao',tipo:'icone',nome:'algodao',fundo:'amarelo',x:Mb(...LL(73,21.5))[0]-50,y:Mb(...LL(73,21.5))[1]-50,w:100,h:100,giro:-2,atraso:A(12500),rotulo:'Recorte: capulho de algodão'},

    // ---- etapa 5: três religiões
    {id:'rel-h',tipo:'religiao',simbolo:'om',titulo:'Hinduísmo',cor:'coral',linhas:['tradição muito antiga','muitos deuses e os Vedas','sustenta as castas'],x:500,y:5280,w:640,h:736,giro:-2.5,rotulo:'Cartão: hinduísmo, com o símbolo Om'},
    {id:'rel-j',tipo:'religiao',simbolo:'mao-jaina',titulo:'Jainismo',cor:'petroleo',linhas:['Mahavira, séculos VI e V a.C.','não violência','respeito a toda vida'],x:1230,y:5300,w:640,h:736,giro:1.2,atraso:A(6500),rotulo:'Cartão: jainismo, com a mão espalmada'},
    {id:'rel-b',tipo:'religiao',simbolo:'roda-dharma',titulo:'Budismo',cor:'amarelo',linhas:['Buda, séculos VI e V a.C.','desapego dos bens','contra as castas'],x:1960,y:5270,w:640,h:736,giro:2.2,atraso:A(13000),rotulo:'Cartão: budismo, com a roda de oito raios'},
    {id:'cs-m',tipo:'castas',esp:true,risca:5.0,x:2800,y:5300,w:870,h:602,giro:-1,atraso:A(2500),rotulo:'As castas, em tamanho pequeno, com o cadeado riscado pelo budismo'},
    {id:'n-carma',tipo:'nota',fs:44,x:3800,y:5350,w:720,giro:1.2,atraso:A(26000),texto:'Carma: cada ação traz consequências, nesta vida ou na próxima.'},

    // ---- etapa 6: Japão, xintoísmo e xogunato
    {id:'torii',tipo:'icone',nome:'torii',fundo:'coral',x:5050,y:5300,w:420,h:420,giro:-2,atraso:A(20500),rotulo:'Recorte: portão torii de um santuário xintoísta'},
    {id:'et-xin',tipo:'etiqueta',fs:50,x:5000,y:5760,w:520,h:110,clicavel:false,atraso:A(21500),texto:'xintoísmo'},
    {id:'fuji',tipo:'icone',nome:'fuji',fundo:'petroleo',x:5690,y:5300,w:420,h:420,giro:2,atraso:A(23500),rotulo:'Recorte: monte Fuji, com neve no cume'},
    {id:'et-kami',tipo:'etiqueta',fs:50,x:5600,y:5760,w:540,h:200,clicavel:false,atraso:A(24500),texto:'kami: espíritos da natureza'},
    {id:'pir-j',tipo:'hierarquia',x:6600,y:5260,w:900,h:672,giro:-.8,alturaCamada:110,atraso:A(29000),rotulo:'Pirâmide social do Japão: imperador, xogum, samurais e camponeses',
     camadas:[{t:'imperador',s:'sagrado'},{t:'xogum',s:'poder real'},{t:'samurais'},{t:'camponeses'}]},
    {id:'n-xog',tipo:'nota',fs:44,x:5000,y:6060,w:1000,giro:1,atraso:A(34500),texto:'O xogunato começou na Idade Média, depois da Antiguidade.'}
  ],

  etapas:[
    {titulo:'Muitos Orientes',mostra:['mapa','tempo-c','tempo-i','tempo-j','et-tc','et-ti','et-tj'],so:['n-ori'],
     foco:FD(18,41,300),focoM:FC(18,41,190),
     tomadas:[[3000,FD(105,32,250)],[13000,FD(78,21,250)],[24000,FD(132,34,250)],[33000,FD(72,32,500)]],
     tomadasM:[[3000,FC(106,32,170)],[13000,FC(78,21,150)],[24000,FC(138,36,130)],[33000,FC(76,36,340)]],tempo:46000,
     tracos:[{tipo:'seta',de:ML(22,48),para:ML(89,37),cor:'seta',espessura:14,ponta:60,curva:-.2,atraso:A(34500)}],
     texto:TEXTO[0]},
    {titulo:'China: a muralha e o império',so:['mur','et-taipa','et-han','pir-c','pincel'],
     foco:FD(108,32,250),focoM:FC(110,32,170),
     tomadas:[[10500,[620,3740,1180,840]],[21500,[1820,3730,1320,780]],[34000,TL(2100,1300)]],
     tomadasM:[[10500,[640,3750,1120,760]],[21500,[1910,3760,990,700]],[34000,TL(2480,760)]],tempo:46000,
     realce:[{peca:'pir-c',item:3}],
     tracos:[{tipo:'circulo',peca:'mur',x:30,y:66,w:36,h:44,espessura:6,atraso:A(15000)},
             {tipo:'seta',de:{peca:'mur',x:28,y:88},para:{peca:'et-taipa',x:24,y:0},cor:'seta',espessura:6,curva:.25,atraso:A(17000)}],
     texto:TEXTO[1]},
    {titulo:'China: Confúcio e o Tao',so:['confucio','tao','doc'],fonte:'doc',
     foco:[3320,3820,1060,900],focoM:[3320,3820,1060,900],
     tomadas:[[14000,[4450,3750,1200,950]],[26000,[5770,3770,580,830]],[40000,TL(2100,1300)]],
     tomadasM:[[14000,[4450,3750,1200,950]],[26000,[5770,3770,580,830]],[40000,TL(2480,760)]],tempo:46000,
     tracos:[],
     texto:TEXTO[2]},
    {titulo:'Índia: o rio Indo e as castas',so:['castas','pimenta','gema','algodao'],
     foco:FD(70,27,240),focoM:FC(70,29,140),
     tomadas:[[9500,FD(76,16,250)],[14000,FD(80,23,250)],[19500,[7050,3700,1400,1000]],[36000,TL(1000,1300)]],
     tomadasM:[[9500,FC(70,17,150)],[14000,FC(80,23,150)],[19500,[7090,3780,860,860]],[27000,[7800,3830,540,520]],[36000,TL(1450,760)]],tempo:46000,
     tracos:[],
     texto:TEXTO[3]},
    {titulo:'Índia: três religiões',so:['rel-h','rel-j','rel-b','cs-m','n-carma'],
     foco:[440,5200,760,860],focoM:[440,5200,760,860],
     tomadas:[[6500,[1180,5200,760,860]],[13000,[1910,5200,760,860]],[19000,[1900,5200,1900,880]],[26000,[2750,5240,1900,800]],[36000,TL(2000,1300)]],
     tomadasM:[[6500,[1180,5200,760,860]],[13000,[1910,5200,760,860]],[19000,[2500,5330,720,560]],[26000,[3090,5280,620,520]],[31000,[3780,5330,760,380]],[36000,TL(2250,760)]],tempo:46000,
     tracos:[{tipo:'seta',de:{peca:'rel-b',x:100,y:48},para:{peca:'cs-m',x:0,y:38},cor:'seta',espessura:12,ponta:44,curva:-.15,atraso:A(18000)}],
     texto:TEXTO[4]},
    {titulo:'Japão: xoguns, kami e Buda',so:['torii','et-xin','fuji','et-kami','pir-j','n-xog'],
     foco:FD(137,36,230),focoM:FC(137,36,130),
     tomadas:[[7500,FD(105,32,340)],[19500,[4950,5200,1500,860]],[28000,[6500,5200,1100,800]],[34000,[4950,6000,1450,260]],[42000,TL(3300,1300)]],
     tomadasM:[[7500,FC(97,32,210)],[11500,FC(127,33,170)],[19500,[4960,5230,1180,760]],[28000,[6520,5230,1000,760]],[34000,[4960,5990,1100,420]],[39000,TL(3200,760)],[44000,TL(3750,760)]],tempo:50000,
     tracos:[],
     texto:TEXTO[5]}
  ]
});
})();
