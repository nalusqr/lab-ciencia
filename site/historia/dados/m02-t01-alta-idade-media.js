/* Módulo 2, tópico 1: Alta Idade Média. Roteiro revisado: docs/revisao-historia/m02-t01-alta-idade-media.md
   Formato dos dados: docs/historia/MOTOR.md. Recortes e esquemas próprios: recortes-m02a.js (carregado depois de recortes.js).
   Duas bases de mapa, as duas com escala 3 na mesa (4128 x 2304):
   - Mediterrâneo (historia-mapa-mediterraneo), à esquerda: etapas 3, 5 e 6. Vai da Ibéria ao Golfo Pérsico, sem a Britânia e o Báltico.
   - Mundo (historia-mapa-mundo), à direita: etapas 4, 7, 8 e 9 (Grã-Bretanha, Aachen, Verdun, Escandinávia).
   Pontos em longitude e latitude (ll:true); toda região é recortada pela costa (terra:true).
   Mesa em zonas: os dois mapas (topo), fita do tempo (embaixo dos mapas), fita da Idade Média e capas (embaixo, à esquerda).
   Peças das etapas 4 a 9 ficam no Atlântico, ao lado da Europa do mapa-múndi, ou na margem esquerda do mapa do Mediterrâneo. */
(function(){
const A=n=>Colagem.reduz?0:n;
const BM='historia-mapa-mediterraneo',BW='historia-mapa-mundo',S=3;
const MXM=1400,MXW=6300;
const Mm=(x,y)=>[Math.round(MXM+x*S),Math.round(y*S)];
const Mw=(x,y)=>[Math.round(MXW+x*S),Math.round(y*S)];
const LLm=(lon,lat)=>Colagem.lonlat(BM,lon,lat),LLw=(lon,lat)=>Colagem.lonlat(BW,lon,lat);
const MLm=(lon,lat)=>{const q=LLm(lon,lat);return Mm(q[0],q[1]);};
const MLw=(lon,lat)=>{const q=LLw(lon,lat);return Mw(q[0],q[1]);};
// enquadramentos em pixels da mesa; w em pixels da base. asp 1.5 no desktop, .68 no celular
const FR=(M,LL,lon,lat,w,asp)=>{const q=LL(lon,lat),h=w/asp,a=M(q[0]-w/2,q[1]-h/2);return [a[0],a[1],Math.round(w*S),Math.round(h*S)];};
const Fm=(lon,lat,w)=>FR(Mm,LLm,lon,lat,w,1.5),Fmc=(lon,lat,w)=>FR(Mm,LLm,lon,lat,w,.68);
const Fw=(lon,lat,w)=>FR(Mw,LLw,lon,lat,w,1.5),Fwc=(lon,lat,w)=>FR(Mw,LLw,lon,lat,w,.68);
// fita do tempo: enquadra um trecho
const TLX=2300,TLW=5000,TLY=2450;
const TL=(p,w)=>[TLX+TLW*p/100-w/2,TLY-130,w,520];
// retângulo levemente torto, para retalhos de campo (longitude e latitude)
const retalho=(cx,cy,wx,wy)=>[[cx-wx,cy-wy*.9],[cx+wx*.9,cy-wy],[cx+wx,cy+wy*.85],[cx-wx*.85,cy+wy]];

// ---- polígonos (longitude e latitude)
const VISI=[[-10,36],[-10,40.5],[-6.8,40.5],[-6.8,44],[-1.8,44],[-1,46.4],[0.8,47.4],[2.2,47.1],[3.6,43.6],[3.4,42.2],[1,40.6],[-1,37.6],[-2,36.4],[-5,36.05]];
const SUEV=[[-10,40.5],[-10,44],[-6.8,44],[-6.8,40.5]];
const OSTRO=[[6.9,43.7],[7.2,45.8],[9.2,46.5],[12.5,47.1],[15,46.6],[17.5,46],[19,44.8],[19.5,43],[17,42.3],[18.8,40.2],[16.5,37.6],[15.6,36.5],[12.3,36.6],[12,38.2],[11,41],[9,43.2]];
const FRANC=[[-5,48.5],[-5,47.5],[-1.5,47.3],[1.5,47.3],[3,46.8],[4.8,47.6],[6,47.5],[7.4,48.8],[6.6,51.2],[4.2,51.7],[2.2,51.4],[-1.5,50.4]];
const BURG=[[3,46.8],[4.8,47.6],[6,47.5],[7.2,46.2],[7,44.3],[5.2,43.3],[3.6,43.6],[3.6,45]];
const VAND=[[-2,35.2],[2,36.9],[8,37.4],[11.4,37.3],[11.4,33.5],[8,32],[3,33],[-2,34.2]];
const ANGLO=[[-5.8,50],[1.8,51],[2,52.8],[0.5,54],[-0.5,55.6],[-2.2,55.8],[-3.2,54.8],[-3.2,53.2],[-3,52],[-5,51.5]];
// reino de Clóvis (cerca de 511): quase toda a França atual; começa ao norte do Loire
const FRANCOS_N=[[-5,48.8],[-5,47.4],[-1.6,47.3],[1.5,47.3],[3,46.6],[4.8,47.4],[5.5,47.8],[6.6,48.8],[6.4,50.4],[6,51.4],[2.4,51.8],[0,50.6],[-2,49.8]];
const FRANCOS_S=[[-1.9,43.2],[-1.6,44.6],[-1.4,46.4],[-1.6,47.3],[1.5,47.3],[3,46.6],[4.8,47.4],[4.9,46.2],[4.8,44.6],[4.6,43.4],[3.1,42.5],[0.6,42.7]];
// Bizâncio
const B_NUCLEO=[[17.5,42.5],[19,45.5],[22.5,44.6],[28.7,44.1],[28.9,42],[33,42],[38,41.2],[41.5,41],[43.5,39.5],[42.5,37.2],[36.6,36.4],[31,36.6],[27,36.6],[23,36],[21,37.6],[19.5,40.5]];
const B_SIRIA=[[36.6,36.4],[42.5,37.2],[41,33],[39,30],[35.4,29.4],[34.8,31.3],[35.2,33.5],[35.9,35]];
const B_EGITO=[[24,32],[28,31.6],[32.3,31.2],[34.2,31.2],[35,28],[34,25],[33,22],[25,22],[24,28]];
const B_ITALIA=[[7,43.8],[7.5,45.6],[13.6,46.5],[13.5,45.2],[19,44],[19,42],[18.7,40.1],[16.5,37.7],[15.6,36.6],[12.3,36.6],[12,38.2],[9,43]];
const B_AFRICA=[[-1.5,35.4],[3,36.9],[8,37.4],[11.4,37.3],[11.4,33.6],[10,32],[8,32.8],[3,34],[-1.5,34.3]];
const B_ESPANHA=[[-6.5,36.2],[-2,36.7],[-1.6,37.8],[-4,38.2],[-6.5,37.4]];
const B_FIM=[[22,40.5],[22.5,41.8],[24,42.8],[28.7,43.5],[28.9,42],[33,42],[38,41.2],[41,41],[41,38.5],[36.6,36.4],[31,36.6],[27,36.6],[26.2,38],[25.5,39.5]];
// Império Carolíngio, cerca de 814
const CAROL=[[-1.9,43.2],[-4.9,47.6],[-4.9,48.7],[-1.5,50.2],[2,51.5],[4.2,52.6],[7,53.7],[9,54.2],[10.7,53.6],[11.9,53.3],[12.3,51.6],[12.7,50.2],[13.6,49],[13.3,47.6],[15,46.7],[13.9,45.6],[12.4,44.5],[13.4,43.6],[14,42.4],[13.2,42.6],[12.6,42.4],[11.3,42.6],[10.3,43],[9.7,44.1],[8.5,44.2],[7.6,43.8],[6.2,43.2],[4,43.3],[3.1,42.5],[1.4,41.3],[0.7,41.2],[0.5,42.5],[-0.6,42.8]];
const FRANCIA_CL=[[-4.9,48.6],[-4.9,47.5],[-1.9,43.2],[0.6,42.7],[3.1,42.5],[4.8,43.8],[5,46.2],[7,48],[6.6,50.4],[2.4,51.6],[-1.5,50.2]];
const M_HISP=[[-0.6,42.8],[0.5,42.5],[0.7,41.2],[1.4,41.3],[3.1,42.5],[3.3,42.9],[1.2,43.2]];
const M_BRETANHA=[[-4.9,47.6],[-4.9,48.7],[-1.8,48.8],[-1.2,47.6]];
const M_FRIUL=[[12.4,44.5],[13.9,45.6],[15,46.7],[13.3,47.6],[12.2,46.4]];
const M_PANONIA=[[13.3,47.6],[15,46.7],[16.6,47.4],[16.4,48.8],[13.6,49]];
const M_NORTE=[[7,53.7],[9,54.2],[10.7,53.6],[9.6,52.6],[8,53]];
const COND=[[[1.8,47.6],[3.4,47.4],[3.2,48.6],[1.9,48.7]],[[-0.4,46.6],[1.2,46.4],[1.3,47.4],[-0.3,47.5]],[[4.6,48.4],[6.2,48.3],[6.1,49.6],[4.7,49.6]],[[8.3,49.6],[10.2,49.4],[10.3,50.6],[8.4,50.7]],[[9.8,45.2],[11.4,45.1],[11.5,46.3],[9.9,46.4]],[[3.2,44.2],[4.6,44.1],[4.5,45.4],[3.3,45.5]]];
// Tratado de Verdun, 843
const V_OESTE=[[-1.9,43.2],[-4.9,47.6],[-4.9,48.7],[-1.5,50.2],[2,51.5],[3.5,51.4],[3.8,50.4],[4.9,49.2],[5,47.8],[4.9,46.2],[4.8,44.5],[4.5,43.3],[3.1,42.5],[1.4,41.3],[0.7,41.2],[0.5,42.5],[-0.6,42.8]];
const V_MEIO=[[3.5,51.4],[4.2,52.6],[6,53.4],[7,53.7],[8.2,53.2],[8.6,52],[7.5,50.6],[8.2,49.2],[7.8,47.6],[8.4,46.5],[10.4,46.5],[13.8,46.4],[13.8,45.6],[12.4,44.5],[13.4,43.6],[14,42.4],[13.2,42.6],[12.6,42.4],[11.3,42.6],[10.3,43],[9.7,44.1],[8.5,44.2],[7.6,43.8],[6.2,43.2],[4.5,43.3],[4.8,44.5],[4.9,46.2],[5,47.8],[4.9,49.2],[3.8,50.4]];
const V_LESTE=[[8.6,52],[8.2,53.2],[8.9,54.3],[10.7,53.6],[11.9,53.3],[12.3,51.6],[12.7,50.2],[13.6,49],[13.3,47.6],[15,46.7],[13.8,46.4],[10.4,46.5],[8.4,46.5],[7.8,47.6],[8.2,49.2],[7.5,50.6]];

const CORES_R={visi:'#e8c14f',ostro:'#6fb0b5',franc:'#ec6f5e',burg:'#b7a3cc',vand:'#8fb3a9',suev:'#e49a5c',anglo:'#d98c8c'};

// pontos das cidades romanas (etapa 3)
const CIDS=[[12.5,41.9],[9.2,45.5],[4.8,45.8],[10.3,36.9],[1.25,41.1],[-6.3,38.9],[2.3,48.85],[13.4,38.1]];
// retalhos de campo: [lon, lat, cor]
const CAMPOS=[[2.4,46.9,'#cdbd78'],[-0.3,44.9,'#b9c98a'],[4.6,44.2,'#e0b77a'],[-4.2,40.3,'#cdbd78'],[-6.5,38.5,'#b9c98a'],[11.6,43.7,'#e0b77a'],[13.4,42.3,'#cdbd78'],[9.4,35.8,'#b9c98a'],[6.4,36.2,'#e0b77a']];
const ROTAS_C=[[[12.5,41.9],[12.1,42.9],[11.6,43.7]],[[12.5,41.9],[13,42.1],[13.4,42.3]],[[4.8,45.8],[3.6,46.4],[2.4,46.9]],[[4.8,45.8],[4.7,45],[4.6,44.2]],[[1.25,41.1],[-2,39.5],[-4.2,40.3]],[[-6.3,38.9],[-6.4,38.7],[-6.5,38.5]],[[10.3,36.9],[10,36.3],[9.4,35.8]],[[10.3,36.9],[8,36.7],[6.4,36.2]],[[4.8,45.8],[1.5,45.4],[-0.3,44.9]]];

// castelos: pontos em terra, sorteados sobre a base do mapa-múndi
const PTS_CASTELOS=[[9.1,52],[22.1,47.1],[13.8,47.2],[15,50.1],[22.7,54.4],[19.3,49.7],[3,49],[23.7,44.6],[10.5,49.6],[7.4,46.4],[18.8,44.4],[24.3,57.2],[21.3,42.4],[13,53],[-6.8,42.5],[24.4,50.2],[-3,40.6],[-0.1,45.8],[-4,38.1],[-2.1,53.5],[17.8,52.9],[4.6,51.8],[10.6,45.2],[-7.9,39.3],[13.2,59.2],[0.2,42.9],[4.3,45],[17.9,46.9],[-0.8,49],[12.3,42.7],[14.4,41],[-1.8,52.4]];
const CAST_BOX=(()=>{const a=MLw(-11,61),b=MLw(28.5,35.5);return [a[0],a[1],b[0]-a[0],b[1]-a[1]];})();

const TEXTO=[
  'A ==Idade Média== vai da queda do Império Romano do Ocidente, em 476, ao fim do século XV. Os livros a dividem em duas partes. A ==Alta Idade Média==, do século V ao IX ou X, é o tempo em que o feudalismo se forma. A Baixa Idade Média, até o século XV, traz o apogeu e depois a crise. O ano de 476 é uma convenção: naquele ano, o chefe germânico Odoacro depôs o último imperador do Ocidente, Rômulo Augústulo, mas a mudança foi lenta e levou séculos. Para o historiador ==Jacques Le Goff==, a Idade Média foi ainda mais longa e só terminou no século XVIII, com a Revolução Industrial e a Revolução Francesa.',
  'O nome Idade Média nasceu de um preconceito. No Renascimento, ela parecia só um intervalo entre a grandeza da Antiguidade clássica e a época moderna: a ==Idade das Trevas==, ou "longa noite de mil anos". A arte medieval foi chamada de gótica, como se fosse coisa de godos, de bárbaros. No século XIX, os ==românticos== inverteram o olhar e a idealizaram como berço das nações, em parte como reação às invasões napoleônicas. No século XX, os historiadores estudaram suas características próprias e mostraram os ==avanços==: técnicas agrícolas novas, catedrais e um pensamento sofisticado, como o de Agostinho de Hipona e o de Tomás de Aquino.',
  'A crise do Império Romano vinha desde o século III. Com o fim das conquistas, faltavam novos escravos; o exército era cada vez mais formado por germânicos; e o Estado, enfraquecido, já não conseguia defender nem governar todo o território. Grandes proprietários passaram a proteger camponeses em troca de trabalho, o ==patrocínio==, e o ==colonato== se espalhou: o colono, preso à terra, pagava ao dono em produtos e serviços. O poder ficou local. A população diminuiu e muita gente deixou as cidades, sem abandoná-las de todo. Foi uma ==ruralização== sem prosperidade, com fome e epidemias. Os germânicos eram só cerca de 5% da população, e por isso o resultado foi uma fusão, não uma substituição.',
  'Sobre as terras do antigo Império formaram-se os ==reinos germânicos==: os visigodos na Península Ibérica, os ostrogodos na Itália, os francos e os burgúndios na Gália, os vândalos no norte da África, os suevos no noroeste ibérico e os anglo-saxões na Grã-Bretanha. Esses povos misturaram suas tradições com as romanas. Dos germânicos veio o ==comitatus==, a fidelidade dos guerreiros ao chefe, que em troca repartia os despojos de guerra. Mais tarde, essa lealdade pessoal ajudaria a formar a vassalagem. A ==Igreja==, a única instituição que resistiu à queda de Roma, tornou-se o elo entre romanos e germânicos, e seus bispos assumiram tarefas de governo nas cidades.',
  'Na Gália, ==Clóvis== (466 a 511) unificou os francos e fundou a dinastia ==merovíngia==, nome que vem de Meroveu, um ancestral lendário. Foi o primeiro rei germânico a se converter ao cristianismo da Igreja de Roma, e não ao arianismo, a corrente cristã seguida por vários outros povos germânicos. A conversão foi também uma decisão política: facilitou o governo da população galo-romana, que já era cristã, e garantiu o apoio dos bispos, que sabiam ler, escrever e administrar. O reino franco generalizou as relações de ==vassalagem== e suserania: o rei concedia terras a chefes guerreiros em troca de fidelidade e serviço militar.',
  'No Oriente, o Império Romano não caiu: continuou como ==Império Bizantino==, com capital em Constantinopla, a antiga Bizâncio. O poder do imperador era forte e ligado à Igreja. Com ==Justiniano== (527 a 565), o império reconquistou partes do Ocidente, como o norte da África e a Itália, e mandou reunir as leis romanas no ==Corpus Juris Civilis==, base do Direito de muitos países ocidentais. Bizâncio uniu o cristianismo, a cultura grega e o Direito romano. Em 1054, o Cisma do Oriente separou a Igreja Ortodoxa, do Oriente, da Igreja Católica, de Roma. Em 1453, os turcos otomanos tomaram Constantinopla e o império acabou.',
  'A dinastia merovíngia enfraqueceu, e o poder passou aos ==carolíngios==. Carlos Martel deteve os muçulmanos em Poitiers, em 732. Seu neto, ==Carlos Magno== (742 a 814), formou um grande império e, no Natal de 800, foi coroado imperador pelo papa Leão III. Os carolíngios deram à Igreja terras na Itália e reforçaram o dízimo; em troca, ganharam legitimidade e apoio. Para governar, Carlos Magno dividiu o território em condados e marcas, as regiões de fronteira, entregues a ==condes e marqueses== fiéis. Essa concessão de terras a chefes guerreiros, em troca de fidelidade, está na origem da vassalagem.',
  'Carlos Magno criou leis escritas, os capitulares, e enviou inspetores, os missi dominici, para vigiar os condes. Incentivou o ==Renascimento Carolíngio==: escolas nos mosteiros e na corte de Aix-la-Chapelle, cópia de livros antigos e um latim mais correto, escrito com uma letra mais legível, a minúscula carolíngia. Depois de sua morte, os netos disputaram o império, e o poder central voltou a se enfraquecer. O ==Tratado de Verdun==, em 843, o dividiu em três partes: Carlos, o Calvo, ficou com o oeste, Luís, o Germânico, com o leste, e Lotário com a faixa do meio. Foi um primeiro esboço do mapa da Europa, com as futuras ==França e Alemanha==.',
  'No século IX e começo do X, novas invasões atingiram a Europa. Os ==vikings==, vindos da Escandinávia, chegavam pelo mar e subiam os rios. Os ==magiares==, ou húngaros, avançavam pelo leste. Os muçulmanos atacavam pelo Mediterrâneo. Os reis carolíngios não conseguiam defender todo o território. Cada senhor local passou a organizar a defesa, julgar e cobrar na sua região, em torno de castelos e fortificações, e a população buscava proteção com quem estivesse perto e pudesse oferecê-la. O poder se pulverizou entre os nobres: nascia o ==feudalismo==, que o próximo tópico explica. A fonte desta etapa, de 909, mostra como os bispos viam esse caos.'
];

// ---- camadas do mapa do Mediterrâneo
const camadasMed=[
  {tipo:'rotulo',ll:true,p:[-1,37.9],texto:'Mar Mediterrâneo',classe:'mar',tam:.55,desde:2,ate:5},
  // ===== etapa 3 (2): cidades grandes que encolhem, o campo e as pessoas que saem da cidade
  {tipo:'pontos',ll:true,pts:CIDS,tam:2.6,cor:'tinta',etapas:[2],atraso:A(700),dura:6200},
  {tipo:'pontos',ll:true,pts:CIDS,tam:.85,cor:'tinta',etapas:[2],atraso:A(7300)},
  {tipo:'etiqueta',ll:true,p:[13.1,42.9],texto:'Roma',tam:.42,etapas:[2],atraso:A(1500)},
  {tipo:'etiqueta',ll:true,p:[10.9,37.6],texto:'Cartago',tam:.42,etapas:[2],atraso:A(1900)},
  {tipo:'etiqueta',ll:true,p:[5.4,46.6],texto:'Lião',tam:.42,etapas:[2],atraso:A(2300)},
  {tipo:'etiqueta',ll:true,p:[2.9,49.6],texto:'Paris',tam:.42,etapas:[2],atraso:A(2700)}
];
CAMPOS.forEach((c,i)=>{camadasMed.push({tipo:'regiao',ll:true,terra:true,pts:retalho(c[0],c[1],1.7,1.15),suave:false,cor:c[2],opac:.85,etapas:[2],atraso:A(9500+i*450)});});
ROTAS_C.forEach((r,i)=>{camadasMed.push({tipo:'rota',ll:true,pts:r,invisivel:true,movel:'ponto',tam:.9,volta:5200+i*500,etapas:[2],atraso:A(9000+i*300)});});
camadasMed.push(
  {tipo:'etiqueta',ll:true,p:[-8.8,35.6],texto:'grandes propriedades',tam:.4,etapas:[2],atraso:A(15500),cor:'amarelo'},
  // ===== etapa 5 (4): o reino dos francos cresce e cobre quase toda a França
  {tipo:'regiao',ll:true,terra:true,pts:FRANCOS_N,suave:false,cor:'coral',opac:.85,etapas:[4],atraso:A(1500)},
  {tipo:'regiao',ll:true,terra:true,pts:FRANCOS_S,suave:false,cor:'coral',opac:.85,etapas:[4],atraso:A(7000)},
  {tipo:'rotulo',ll:true,p:[-1.4,46.2],texto:'Gália',classe:'regiao2',tam:.9,etapas:[4],atraso:A(2500)},
  {tipo:'etiqueta',ll:true,p:[3,47.2],texto:'reino dos francos',tam:.4,etapas:[4],atraso:A(8500)},
  {tipo:'cidade',ll:true,p:[2.35,48.85],nome:'Paris',tam:.42,lado:'e',etapas:[4],atraso:A(4500)},
  // ===== etapa 6 (5): Bizâncio cresce com Justiniano e depois recua
  {tipo:'regiao',ll:true,terra:true,pts:B_NUCLEO,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(900),dura:29500},
  {tipo:'regiao',ll:true,terra:true,pts:B_SIRIA,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(900),dura:29500},
  {tipo:'regiao',ll:true,terra:true,pts:B_EGITO,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(900),dura:29500},
  {tipo:'regiao',ll:true,terra:true,pts:B_ITALIA,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(8500),dura:16000},
  {tipo:'regiao',ll:true,terra:true,pts:B_AFRICA,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(9200),dura:15300},
  {tipo:'regiao',ll:true,terra:true,pts:B_ESPANHA,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(9800),dura:14700},
  {tipo:'regiao',ll:true,terra:true,pts:B_FIM,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(30500)},
  {tipo:'etiqueta',ll:true,p:[27.2,37.6],texto:'Império Bizantino',tam:.45,etapas:[5],atraso:A(2500)},
  {tipo:'etiqueta',ll:true,p:[13.4,38.9],texto:'Italia reconquistada',tam:.4,etapas:[5],atraso:A(10000),dura:14500},
  {tipo:'etiqueta',ll:true,p:[1.5,33.5],texto:'norte da África reconquistado',tam:.4,etapas:[5],atraso:A(10600),dura:13900},
  {tipo:'cidade',ll:true,p:[28.98,41.01],nome:'Constantinopla',sub:'antiga Bizâncio',capital:true,tam:.5,lado:'e',etapas:[5],atraso:A(1500)}
);
camadasMed.forEach(L=>{if(L.texto==='Italia reconquistada')L.texto='Itália reconquistada';});

// ---- camadas do mapa-múndi
const camadasMun=[];
// ===== etapa 4 (3): o Império do Ocidente se rasga em retalhos
[['visi',VISI],['suev',SUEV],['ostro',OSTRO],['franc',FRANC],['burg',BURG],['vand',VAND]].forEach(r=>{
  camadasMun.push({tipo:'regiao',ll:true,terra:true,pts:r[1],suave:false,cor:'coral',opac:.85,etapas:[3],atraso:A(500),dura:5200});});
[['visi',VISI,0],['suev',SUEV,1],['ostro',OSTRO,2],['franc',FRANC,3],['burg',BURG,4],['vand',VAND,5],['anglo',ANGLO,6]].forEach(r=>{
  camadasMun.push({tipo:'regiao',ll:true,terra:true,pts:r[1],suave:false,cor:CORES_R[r[0]],opac:.9,etapas:[3],atraso:A(5600+r[2]*600)});});
camadasMun.push(
  {tipo:'etiqueta',ll:true,p:[-9.2,38.4],texto:'visigodos',tam:.34,etapas:[3],atraso:A(6200)},
  {tipo:'etiqueta',ll:true,p:[-19.5,43],texto:'suevos',tam:.34,etapas:[3],atraso:A(6800)},
  {tipo:'etiqueta',ll:true,p:[7.4,40.4],texto:'ostrogodos',tam:.34,etapas:[3],atraso:A(7400)},
  {tipo:'etiqueta',ll:true,p:[-4.6,48.7],texto:'francos',tam:.34,etapas:[3],atraso:A(8000)},
  {tipo:'etiqueta',ll:true,p:[7.6,45.6],texto:'burgúndios',tam:.34,etapas:[3],atraso:A(8600)},
  {tipo:'etiqueta',ll:true,p:[-1.5,33],texto:'vândalos',tam:.34,etapas:[3],atraso:A(9200)},
  {tipo:'etiqueta',ll:true,p:[2.6,54.6],texto:'anglo-saxões',tam:.34,etapas:[3],atraso:A(9800)},
  // ===== etapa 7 (6): o império de Carlos Magno
  {tipo:'regiao',ll:true,terra:true,pts:FRANCIA_CL,suave:false,cor:'coral',opac:.85,etapas:[6],atraso:A(600),dura:7500},
  {tipo:'regiao',ll:true,terra:true,pts:CAROL,suave:false,cor:'coral',opac:.85,etapas:[6,7],atraso:A(8200)},
  {tipo:'cidade',ll:true,p:[6.08,50.78],nome:'Aix-la-Chapelle',sub:'(Aachen)',capital:true,tam:.4,lado:'e',etapas:[6],atraso:A(10500)},
  {tipo:'cidade',ll:true,p:[0.34,46.58],nome:'Poitiers',sub:'732',tam:.4,lado:'e',etapas:[6],atraso:A(14500)},
  {tipo:'regiao',ll:true,terra:true,pts:M_HISP,suave:false,cor:'petroleo',opac:.9,etapas:[6],atraso:A(31000)},
  {tipo:'regiao',ll:true,terra:true,pts:M_BRETANHA,suave:false,cor:'petroleo',opac:.9,etapas:[6],atraso:A(31400)},
  {tipo:'regiao',ll:true,terra:true,pts:M_FRIUL,suave:false,cor:'petroleo',opac:.9,etapas:[6],atraso:A(31800)},
  {tipo:'regiao',ll:true,terra:true,pts:M_PANONIA,suave:false,cor:'petroleo',opac:.9,etapas:[6],atraso:A(32200)},
  {tipo:'regiao',ll:true,terra:true,pts:M_NORTE,suave:false,cor:'petroleo',opac:.9,etapas:[6],atraso:A(32600)}
);
COND.forEach((c,i)=>{camadasMun.push({tipo:'regiao',ll:true,terra:true,pts:c,suave:false,cor:'amarelo',opac:.9,etapas:[6],atraso:A(33000+i*350)});});
camadasMun.push(
  {tipo:'etiqueta',ll:true,p:[-0.4,47.8],texto:'condado',tam:.34,etapas:[6],atraso:A(35300),cor:'amarelo'},
  {tipo:'etiqueta',ll:true,p:[-10.5,40.2],texto:'marca (fronteira)',tam:.34,etapas:[6],atraso:A(35800)},
  // ===== etapa 8 (7): Verdun divide o império em três faixas
  {tipo:'regiao',ll:true,terra:true,pts:V_OESTE,suave:false,cor:'coral',opac:.85,etapas:[7],atraso:A(14000)},
  {tipo:'regiao',ll:true,terra:true,pts:V_MEIO,suave:false,cor:'#e8c14f',opac:.9,etapas:[7],atraso:A(14800)},
  {tipo:'regiao',ll:true,terra:true,pts:V_LESTE,suave:false,cor:'#6fb0b5',opac:.9,etapas:[7],atraso:A(15600)},
  {tipo:'etiqueta',ll:true,p:[-6.6,44.4],texto:'Carlos, o Calvo',sub:'futura França',tam:.34,etapas:[7],atraso:A(17500)},
  {tipo:'etiqueta',ll:true,p:[14.2,42.8],texto:'Lotário',sub:'faixa do meio',tam:.34,etapas:[7],atraso:A(18500)},
  {tipo:'etiqueta',ll:true,p:[14.4,50.2],texto:'Luís, o Germânico',sub:'futura Alemanha',tam:.34,etapas:[7],atraso:A(19500)},
  {tipo:'cidade',ll:true,p:[6.08,50.78],nome:'Aix-la-Chapelle',tam:.34,lado:'e',etapas:[7],atraso:A(16500)},
  // ===== etapa 9 (8): invasões
  {tipo:'etiqueta',ll:true,p:[7,60.8],texto:'vikings',tam:.38,etapas:[8],atraso:A(2500)},
  {tipo:'etiqueta',ll:true,p:[27.5,50.4],texto:'magiares',tam:.38,etapas:[8],atraso:A(6500)},
  {tipo:'etiqueta',ll:true,p:[10,33.3],texto:'muçulmanos',tam:.38,etapas:[8],atraso:A(9800)}
);

// ---- fita do tempo (régua fora de escala)
const marcos=[
  {p:5,t:'476',s:'fim do Império do Ocidente',etapa:[2,3]},
  {p:14,t:'511',s:'morte de Clóvis',etapa:4},
  {p:24,t:'527 a 565',s:'Justiniano',etapa:5,cor:'petroleo'},
  {p:35,t:'732',s:'Poitiers',etapa:6},
  {p:46,t:'800',s:'Carlos Magno, imperador',etapa:6},
  {p:57,t:'843',s:'Tratado de Verdun',etapa:7},
  {p:67,t:'909',s:'concílio de Trosly',etapa:8},
  {p:78,t:'1054',s:'Cisma do Oriente',etapa:5,cor:'petroleo'},
  {p:92,t:'1453',s:'queda de Constantinopla',etapa:5,cor:'petroleo'}
];

Colagem.montar({
  modulo:'Módulo 2: Idade Média e início da Idade Moderna',
  titulo:'Alta Idade Média',
  subtitulo:'Reinos germânicos, Bizâncio e o império de Carlos Magno',
  credito:'Os mapas usam bases geradas por IA, as mesmas do restante da História. Recortes, esquemas, camadas e fita do tempo são desenhados em código pelo LAB.',
  ritmo:10000,
  celularGrande:true,
  msPalavra:250,
  mesa:{w:10700,h:5900},
  enem:`O ENEM cobra a passagem da Antiguidade à Idade Média como fusão de heranças romanas (colonato, latifúndio, Direito), germânicas (comitatus) e cristãs, e o papel da Igreja como aliada dos reis francos. Também cai a crítica à "Idade das Trevas": a questão pede que você reconheça um preconceito renascentista. Pegadinhas:
- Tratar 476 como um corte brusco, quando a mudança levou séculos.
- Confundir o Império Bizantino, que durou até 1453, com o Ocidente que caiu em 476.
- Achar que os germânicos "substituíram" a população romana.`,
  estudo:[
  {titulo:'Como se divide e como se vê a Idade Média',texto:`A **Idade Média** vai de 476, quando o último imperador romano do Ocidente foi deposto, ao fim do século XV. Os livros a dividem em **Alta Idade Média** (do século V ao IX ou X), época de formação das estruturas medievais e do feudalismo, e **Baixa Idade Média** (até o século XV), de apogeu e crise. Cada autor põe o corte num ponto diferente, por isso a fórmula "IX ou X" é a mais segura. O ano de 476 é uma convenção: a transição levou séculos e quase ninguém a percebeu como um corte. O historiador **Jacques Le Goff** defende uma "longa Idade Média", que só terminaria no século XVIII, com a Revolução Industrial e a Revolução Francesa.

A própria expressão carrega um julgamento. Os humanistas do Renascimento viam a época como um intervalo entre a grandeza da Antiguidade e o seu próprio tempo: a "Idade das Trevas". O adjetivo "gótico", aplicado à arte medieval, era uma ofensa, pois lembrava os godos, tidos como bárbaros. No século XIX, os **românticos** fizeram o contrário e a idealizaram como berço das nacionalidades, em parte como reação às invasões napoleônicas. Só no século XX os historiadores passaram a estudá-la por suas características próprias, reconhecendo os avanços na agricultura, as catedrais e o pensamento de Agostinho de Hipona e de Tomás de Aquino.`},
  {titulo:'Do Império Romano aos campos',texto:`A queda do Império do Ocidente foi um processo, não um episódio. A crise vinha do século III: com o fim das grandes conquistas, diminuiu a entrada de escravos; o exército passou a recrutar cada vez mais germânicos; e o Estado já não conseguia governar e defender todo o território. Em troca de proteção, camponeses passaram a trabalhar para grandes proprietários, o **patrocínio**. Ao mesmo tempo, espalhou-se o **colonato**: o colono era formalmente livre, mas preso à terra e obrigado a pagar ao dono em produtos e serviços. É a raiz da servidão medieval.

O resultado foi a **ruralização**. A vida econômica e o poder foram para as grandes propriedades do campo. As cidades encolheram, perderam funções e habitantes, mas não sumiram: continuaram como sedes de bispos. Foi uma ruralização sem prosperidade, com fome, epidemias e queda da população.`},
  {titulo:'Os reinos germânicos',texto:`Os germânicos já entravam no Império havia tempo, como soldados de fronteira e mão de obra, antes de as migrações se tornarem violentas. Eram só cerca de 5% da população. Por isso a sociedade medieval nasceu da **fusão de heranças romanas e germânicas**, e não da substituição de um povo por outro. Formaram-se os reinos dos visigodos (Península Ibérica), ostrogodos (Itália), francos e burgúndios (Gália), vândalos (norte da África), suevos (noroeste ibérico) e anglo-saxões (Grã-Bretanha).

De Roma ficaram o latifúndio, o colonato, o Direito e o latim, de onde vieram as línguas românicas, como o português. Dos germânicos veio o **comitatus**, a fidelidade dos guerreiros ao chefe, que repartia com eles os despojos, e o **beneficium**, um lote concedido como pagamento. A **Igreja**, a única instituição que resistiu ao colapso romano, foi o elo entre os dois mundos, como mostra Hilário Franco Júnior. Ao se converterem, os reis germânicos ganhavam legitimidade diante dos súditos romanos.`},
  {titulo:'O reino dos francos e Carlos Magno',texto:`Os francos foram os que mais se firmaram. **Clóvis** (466 a 511) os unificou na Gália e fundou a dinastia **merovíngia**. Converteu-se ao cristianismo da Igreja de Roma, e não ao arianismo de outros germânicos, o que lhe deu o apoio dos bispos e da população galo-romana. Com o tempo, os reis merovíngios perderam força, e o poder passou aos mordomos do palácio, que formaram a dinastia **carolíngia**. Um deles, Carlos Martel, deteve os muçulmanos em Poitiers, em 732.

O auge foi **Carlos Magno** (742 a 814). Ele ampliou o reino e, no Natal de 800, foi coroado imperador pelo papa Leão III, numa troca de apoio com a Igreja: os carolíngios deram terras na Itália (a doação original foi de seu pai, Pepino, o Breve) e reforçaram o dízimo. Para governar, dividiu o império em **condados** e **marcas** (regiões de fronteira), entregues a condes e marqueses fiéis, e mandou inspetores, os missi dominici, vigiá-los. Essa concessão de terras em troca de fidelidade está na origem da **vassalagem**. O **Renascimento Carolíngio** criou escolas nos mosteiros e na corte de Aix-la-Chapelle, copiou livros antigos e difundiu um latim mais correto e a letra minúscula, que deu origem às nossas minúsculas.

Depois da morte do imperador, os netos disputaram o poder. O **Tratado de Verdun**, de 843, dividiu o império em três: a parte oeste (futura França), a leste (futura Alemanha) e a faixa do meio. Foi o primeiro esboço do mapa da Europa.`},
  {titulo:'Bizâncio, a Roma do Oriente',texto:`Enquanto o Ocidente se fragmentava, o Oriente manteve o Império. Teodósio dividira o Império em 395, e a parte oriental, com capital em Constantinopla, sobreviveu como **Império Bizantino** até 1453. Com **Justiniano** (527 a 565), o poder imperial se fortaleceu, parte do Ocidente foi reconquistada, e as leis romanas foram reunidas no **Corpus Juris Civilis**, base do Direito ocidental. Sua grande obra foi a igreja de Santa Sofia. Bizâncio uniu cristianismo, cultura grega e Direito romano. Em 1054, o **Cisma do Oriente** separou a Igreja Ortodoxa da Católica. Em 1453, os turcos otomanos tomaram Constantinopla.`},
  {titulo:'Novas invasões e o nascimento do feudalismo',texto:`No século IX e começo do X, **vikings** (pelo mar e pelos rios), **magiares** (pelo leste) e muçulmanos (pelo Mediterrâneo) atacaram a Europa. Os reis não conseguiam defender tudo. A defesa passou aos senhores locais, que protegiam, julgavam e cobravam em suas terras. O poder se espalhou entre os nobres, e nascia o **feudalismo**, tema do próximo tópico. A fonte do concílio de Trosly (909), nesta página, mostra a visão dos bispos sobre esse caos.`}
  ],
  resumo:[
  'Idade Média: de 476 ao fim do século XV; Alta Idade Média do século V ao IX ou X, e Baixa até o século XV.',
  '"Idade das Trevas" é visão preconceituosa do Renascimento; os românticos a idealizaram; no século XX, estudos mostraram seus avanços.',
  'Crise romana: fim das conquistas, menos escravos, colonato, patrocínio e ruralização.',
  'Os germânicos eram cerca de 5% da população: houve fusão de heranças romanas, germânicas e cristãs.',
  'Clóvis, rei dos francos, converteu-se ao cristianismo de Roma e fundou a dinastia merovíngia.',
  'Carlos Magno foi coroado em 800; criou condados e marcas e promoveu o Renascimento Carolíngio.',
  'Verdun, em 843, dividiu o império em três e esboçou França e Alemanha.',
  'Bizâncio, com Justiniano e o Corpus Juris Civilis, durou até 1453; o Cisma é de 1054.',
  'Vikings, magiares e muçulmanos fragmentaram o poder e levaram ao feudalismo.'
  ],
  urca:`Não há ligação histórica direta entre a Alta Idade Média e o Ceará, mas há heranças verificáveis. O português descende do latim, a língua que a Península Ibérica herdou de Roma, e o Direito brasileiro vem da tradição romano-germânica, que tem no Corpus Juris Civilis uma de suas bases. Na cultura popular do Nordeste, o ciclo de Carlos Magno e dos Doze Pares de França chegou de Portugal em livretos populares e foi estudado por Câmara Cascudo; também aparece em folhetos de cordel, tradição forte no Cariri, onde fica a Lira Nordestina, de Juazeiro do Norte. Nada além disso deve ser tratado como certo sobre a prova da URCA: estude o conteúdo como no ENEM.`,

  pecas:[
    // ---- mapas
    {id:'med',tipo:'mapa',base:BM,x:MXM,y:0,w:4128,h:2304,rotulo:'Mapa do Mediterrâneo e do oeste da Europa: Gália, Península Ibérica, Itália, norte da África, Constantinopla',camadas:camadasMed},
    {id:'mun',tipo:'mapa',base:BW,x:MXW,y:0,w:4128,h:2304,rotulo:'Mapa-múndi: Europa, norte da África e Escandinávia, com os reinos germânicos, o Império Carolíngio, a divisão de Verdun e as invasões',camadas:camadasMun},

    // ---- fita do tempo, com os marcos do tópico (a régua não está em escala)
    {id:'tempo',tipo:'tempo',grande:true,x:TLX,y:TLY,w:TLW,h:190,giro:.2,avisoEt:'2,3,4,5,6,7,8',aviso:'régua fora de escala',marcos:marcos},

    // ---- etapa 1: mil anos no meio
    {id:'idade',tipo:'idade',x:2200,y:3150,w:3700,h:860,giro:-.3,atraso:A(300),rotulo:'Fita do tempo da Idade Média, de 476 a 1500, em duas faixas, e a fita pontilhada de Le Goff até 1789'},
    {id:'n-476',tipo:'nota',fs:50,x:2300,y:4110,w:1250,giro:-1.2,atraso:A(9000),texto:'476: os hérulos depõem o último imperador do Ocidente'},

    // ---- etapa 2: Idade das Trevas?
    {id:'capa1',tipo:'capa',v:'trevas',linhas:['Renascimento:','trevas'],x:2200,y:4350,w:800,h:1075,giro:-2.4,atraso:A(400),rotulo:'Capa de livro preta: Renascimento, trevas'},
    {id:'capa2',tipo:'capa',v:'romantico',linhas:['século XIX:','berço das nações'],x:3100,y:4380,w:800,h:1075,giro:1.6,atraso:A(10500),rotulo:'Capa de livro com um castelo romântico: século XIX, berço das nações'},
    {id:'capa3',tipo:'capa',v:'seculo20',linhas:['século XX:','o que de fato houve'],tam:44,x:4000,y:4340,w:800,h:1075,giro:-1.2,atraso:A(20500),rotulo:'Capa de livro com uma lupa sobre arado, vitral e livro: século XX, o que de fato houve'},
    {id:'et-got',tipo:'etiqueta',fs:62,x:5100,y:4470,w:520,h:140,clicavel:false,atraso:A(29500),texto:'gótico'},
    {id:'capacete',tipo:'icone',nome:'capacete-godo',fundo:'coral',x:5800,y:4380,w:420,h:420,giro:2,atraso:A(31500),rotulo:'Recorte: capacete godo de bandas de ferro'},
    {id:'n-got',tipo:'nota',fs:46,x:5120,y:4800,w:1000,giro:-1.4,atraso:A(33500),texto:'o nome era uma ofensa'},

    // ---- etapa 3: do Império aos campos
    {id:'pessoas',tipo:'pessoas20',x:1700,y:1580,w:1500,h:640,giro:-.6,atraso:A(24500),rotulo:'Gráfico de bonequinhos: de vinte pessoas, só uma é germânica'},
    {id:'n-col',tipo:'nota',fs:44,x:3350,y:1660,w:800,giro:1.2,atraso:A(31000),texto:'colonato: o colono preso à terra, raiz da servidão'},
  ].concat(CAMPOS.map((c,i)=>{const q=MLm(c[0],c[1]);return {id:'vi'+i,tipo:'icone',nome:'villa',fundo:false,x:q[0]-80,y:q[1]-90,w:160,h:160,giro:(i%3-1)*3,atraso:A(10000+i*450),rotulo:'Recorte: casa de campo romana, uma grande propriedade'};})).concat([

    // ---- etapa 4: os reinos germânicos
    {id:'comitatus',tipo:'comitatus',x:7380,y:430,w:700,h:630,giro:-1,atraso:A(15000),rotulo:'Esquema do comitatus: um chefe no centro e guerreiros em roda'},
    {id:'cruz',tipo:'cruz',x:8170,y:470,w:330,h:462,atraso:A(26000),rotulo:'Cruz de traço fino sobre o mapa'},
    {id:'n-igreja',tipo:'nota',fs:42,x:7380,y:1130,w:760,giro:1,atraso:A(27500),texto:'Igreja: o elo, segundo Hilário Franco Júnior'},

    // ---- etapa 5: Clóvis e os francos (margem esquerda do mapa do Mediterrâneo)
    {id:'pia',tipo:'icone',nome:'pia-coroa',fundo:'petroleo',x:160,y:130,w:500,h:500,giro:-2,atraso:A(5000),rotulo:'Recorte: pia batismal com uma coroa ao lado, a conversão de Clóvis'},
    {id:'et-conv',tipo:'etiqueta',fs:60,x:790,y:300,w:520,h:130,clicavel:false,atraso:A(9500),texto:'conversão'},
    {id:'et-povo',tipo:'etiqueta',fs:48,x:150,y:880,w:720,h:130,clicavel:false,atraso:A(12500),texto:'povo galo-romano cristão'},
    {id:'et-bispos',tipo:'etiqueta',fs:48,x:960,y:880,w:340,h:130,clicavel:false,atraso:A(14000),texto:'bispos'},
    {id:'n-mero',tipo:'nota',fs:44,x:150,y:1090,w:1150,giro:-.8,atraso:A(17000),texto:'merovíngia: de Meroveu, ancestral lendário'},

    // ---- etapa 6: Bizâncio
    {id:'sofia',tipo:'icone',nome:'santa-sofia',fundo:'amarelo',x:3740,y:390,w:330,h:330,giro:-2,atraso:A(14000),rotulo:'Recorte: silhueta da igreja de Santa Sofia, em Constantinopla'},
    {id:'corpus',tipo:'icone',nome:'corpus',fundo:'petroleo',x:4150,y:390,w:330,h:330,giro:2,atraso:A(19500),rotulo:'Recorte: livro fechado do Corpus Juris Civilis'},
    {id:'et-sofia',tipo:'etiqueta',fs:44,x:3760,y:270,w:300,h:100,clicavel:false,atraso:A(15000),texto:'Santa Sofia'},
    {id:'et-corpus',tipo:'etiqueta',fs:40,x:3960,y:760,w:700,h:150,clicavel:false,atraso:A(20500),texto:'Corpus Juris Civilis, base do Direito ocidental'},
    {id:'cruzc',tipo:'icone',nome:'cruz-cisma',fundo:'coral',x:TLX+TLW*.78-170,y:TLY+260,w:340,h:340,giro:-2,atraso:A(33000),rotulo:'Recorte: cruz que se parte em duas, o Cisma do Oriente, em 1054'},
    {id:'risc',tipo:'riscado',x:TLX+TLW*.92-300,y:TLY+270,w:600,h:257,giro:1.5,atraso:A(37000),rotulo:'Constantinopla riscada: os turcos otomanos a tomam em 1453'},

    // ---- etapa 7: Carlos Magno
    {id:'maos',tipo:'maos',x:7380,y:480,w:700,h:404,giro:-1,atraso:A(23000),rotulo:'Duas mãos de papel trocam uma coroa e um mapa da Itália'},
    {id:'et-maos',tipo:'etiqueta',fs:44,x:7380,y:960,w:700,h:170,clicavel:false,atraso:A(25500),texto:'Igreja e carolíngios: apoio mútuo'},

    // ---- etapa 8: escolas, letras e Verdun
    {id:'manus',tipo:'manuscrito',x:7420,y:400,w:520,h:700,giro:1.2,atraso:A(300),rotulo:'Página de manuscrito carolíngio com uma letra minúscula ampliada'},
    {id:'et-letra',tipo:'etiqueta',fs:40,x:7360,y:1170,w:660,h:170,clicavel:false,atraso:A(6500),texto:'a letra que deu origem às nossas minúsculas'},
    {id:'n-hil',tipo:'nota',fs:42,x:7360,y:1400,w:760,giro:-1,atraso:A(24000),texto:'Hilário Franco Júnior: o primeiro esboço do mapa europeu'},

    // ---- etapa 9: novas invasões e o poder em pedaços
    {id:'castelos',tipo:'castelos',x:CAST_BOX[0],y:CAST_BOX[1],w:CAST_BOX[2],h:CAST_BOX[3],mx:MXW,my:0,s:S,base:BW,pts:PTS_CASTELOS,raio:20,k:.5,atraso:11.5,passo:.42,rotulo:'Castelos com círculos de alcance cobrindo a Europa'},
    {id:'doc',tipo:'fonte',grande:true,x:7340,y:330,w:640,h:930,giro:1,atraso:A(30000),rotulo:'Fonte histórica: concílio de Trosly, 909',
     texto:'“As cidades estão despovoadas, os mosteiros destruídos ou queimados, os campos viraram deserto. Assim como os primeiros homens viviam sem lei nem temor de Deus, agora cada um faz o que bem entende, despreza as leis humanas e divinas e as ordens da Igreja. Os mais fortes oprimem os mais fracos, e os homens são como os peixes do mar, que se devoram uns aos outros.”',
     ref:'Atas do concílio de Trosly, reunido pelo arcebispo de Reims e seus bispos, 909. Paráfrase da equipe.',
     resposta:'A visão dos ==bispos sobre a crise do começo do século X==: invasões, cidades e mosteiros arrasados e falta de um poder central capaz de impor a lei. A imagem dos peixes descreve a violência entre os poderosos locais, o ambiente em que nasce o feudalismo. É preciso criticar a fonte: quem escreve é o ==alto clero==, que sofria com o saque dos mosteiros e queria reforçar a autoridade da Igreja. Por isso exagera o caos e o liga ao pecado.'},
    {id:'et-prox',tipo:'etiqueta',fs:56,x:7340,y:1350,w:640,h:130,clicavel:false,atraso:A(42000),texto:'Próximo: feudalismo'}
  ]),
