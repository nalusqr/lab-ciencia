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
const MOB=window.innerWidth<=860;
const TM=(d,m)=>MOB?m:d;
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
const TLX=2300,TLW=5000,TLY=3900;
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
const FRANCOS_N=[[-5,48.8],[-5,47.4],[-1.6,47.3],[1.5,47.3],[3,46.6],[4.8,47.4],[5.5,47.8],[6.6,48.8],[6.4,49.5],[6,49.5],[2.4,49.5],[0,49.5],[-2,49.5]];
const FRANCOS_S=[[-1.2,45.7],[-0.7,44.9],[0.4,44.2],[1.45,43.65],[2.4,43.9],[3.1,44.8],[3.2,46],[3,46.6],[1.5,47.3],[-1.6,47.3],[-1.6,46.4]];
// em 511 o Garonne era o limite: ao sul, os visigodos (Septimânia); a leste, a Provença ostrogoda; a Burgúndia só foi anexada em 534
const VISI_FR=[[-1.9,43.2],[-1.2,45.7],[-0.7,44.9],[0.4,44.2],[1.45,43.65],[2.4,43.9],[3.1,44.4],[3.6,43.6],[3.3,42.5],[0.6,42.7]];
const PROV_FR=[[3.6,43.6],[5.2,44.4],[7,44.6],[7.2,43.8],[6.2,43.2],[5.2,43.3]];
const BURG5=[[3,46.8],[4.8,47.6],[6,47.5],[7.2,46.2],[7,44.7],[5.2,44.4],[3.6,44.7],[3.3,45.8]];
// Bizâncio
const B_NUCLEO=[[17.5,42.5],[19,45.5],[22.5,44.6],[28.7,44.1],[28.9,42],[33,42],[38,41.2],[41.5,41],[43.5,39.5],[42.5,37.2],[36.6,36.4],[31,36.6],[27,36.6],[23,36],[21,37.6],[19.5,40.5]];
const B_SIRIA=[[36.6,36.4],[42.5,37.2],[41,33],[39,30],[35.4,29.4],[34.8,31.3],[35.2,33.5],[35.9,35]];
const B_EGITO=[[24,32],[28,31.6],[32.3,31.2],[34.2,31.2],[35,28],[34,25],[33,22],[25,22],[24,28]];
const B_ITALIA=[[7,43.8],[7.5,45.6],[13.6,46.5],[13.5,45.2],[19,44],[19,42],[18.7,40.1],[16.5,37.7],[15.6,36.6],[12.3,36.6],[12,38.2],[9,43]];
const B_AFRICA=[[-1.5,35.4],[3,36.9],[8,37.4],[11.4,37.3],[11.4,33.6],[10,32],[8,32.8],[3,34],[-1.5,34.3]];
const B_ESPANHA=[[-6.5,36.2],[-2,36.7],[-1.6,37.8],[-4,38.2],[-6.5,37.4]];
const B_FIM=[[22,40.5],[22.5,41.8],[24,42.8],[28.7,43.5],[28.9,42],[33,42],[38,41.2],[41,41],[41,38.5],[36.6,36.4],[31,36.6],[27,36.6],[26.2,38],[25.5,39.5]];
// Império Carolíngio, cerca de 814
const CAROL=[[-1.9,43.2],[-4.9,47.6],[-4.9,48.7],[-1.5,50.2],[2,51.5],[4.2,52.6],[7,53.7],[9,54.2],[10.7,53.6],[11.9,53.3],[12.3,51.6],[12.7,50.2],[13.6,49],[13.3,47.6],[15,46.7],[13.9,45.6],[12.4,44.5],[13.4,43.6],[14,42.4],[13.2,42.6],[12.6,42.4],[11.3,42.6],[10.3,43],[9.7,44.1],[8.5,44.2],[7.6,43.8],[6.2,43.2],[4,43.3],[3.3,42.1],[1.4,41.1],[0.9,40.7],[-0.9,41.7],[-0.6,42.8]];
const FRANCIA_CL=[[-4.9,48.6],[-4.9,47.5],[-1.9,43.2],[0.6,42.7],[3.1,42.5],[4.8,43.8],[5,46.2],[7,48],[6.6,50.4],[2.4,51.6],[-1.5,50.2]];
const M_HISP=[[-1.6,42.9],[-0.6,42.5],[-0.9,41.7],[0.4,41.1],[0.9,40.7],[1.4,41.1],[3.3,42.1],[3.3,42.9],[1.2,43.2]];
const M_BRETANHA=[[-4.9,47.6],[-4.9,48.7],[-1.8,48.8],[-1.2,47.6]];
const M_FRIUL=[[12.4,44.5],[13.9,45.6],[15,46.7],[13.3,47.6],[12.2,46.4]];
const M_PANONIA=[[13.3,47.6],[15,46.7],[16.6,47.4],[16.4,48.8],[13.6,49]];
const M_NORTE=[[7,53.7],[9,54.2],[10.7,53.6],[9.6,52.6],[8,53]];
const COND=[[[1.8,47.6],[3.4,47.4],[3.2,48.6],[1.9,48.7]],[[-0.8,47.3],[0.6,47.2],[0.7,48.2],[-0.7,48.2]]];
const PAPA=[[10.9,42.4],[11.8,43.4],[12.4,44.5],[13.0,44.6],[13.5,43.6],[14.0,42.8],[13.2,42.0],[12.9,41.5],[12.2,41.3],[11.5,42.0]];
// Tratado de Verdun, 843
const V_OESTE=[[-1.9,43.2],[-4.9,47.6],[-4.9,48.7],[-1.5,50.2],[2,51.5],[3.5,51.4],[3.8,50.4],[4.9,49.2],[5,47.8],[4.9,46.2],[4.8,44.5],[4.5,43.3],[3.3,42.1],[1.4,41.1],[0.9,40.7],[-0.9,41.7],[-0.6,42.8]];
const V_MEIO=[[3.5,51.4],[4.2,52.6],[6,53.4],[7,53.7],[8.2,53.2],[8.6,52],[7.5,50.6],[8.2,49.2],[7.8,47.6],[8.4,46.5],[10.4,46.5],[13.8,46.4],[13.8,45.6],[12.4,44.5],[13.4,43.6],[14,42.4],[13.2,42.6],[12.6,42.4],[11.3,42.6],[10.3,43],[9.7,44.1],[8.5,44.2],[7.6,43.8],[6.2,43.2],[4.5,43.3],[4.8,44.5],[4.9,46.2],[5,47.8],[4.9,49.2],[3.8,50.4]];
const V_LESTE=[[8.6,52],[8.2,53.2],[8.9,54.3],[10.7,53.6],[12.4,54.1],[13.6,53.2],[13.9,51.6],[14.1,50.2],[14.2,49],[13.6,47.6],[15,46.7],[13.8,46.4],[10.4,46.5],[8.4,46.5],[7.8,47.6],[8.2,49.2],[7.5,50.6]];

const CORES_R={visi:'#f0d462',ostro:'#a9762f',franc:'#ec6f5e',burg:'#b7a3cc',vand:'#3fbf9b',suev:'#e8a05c',anglo:'#d98c8c'};

// pontos das cidades romanas (etapa 3)
const CIDS=[[12.5,41.9],[9.2,45.5],[4.8,45.8],[10.3,36.9],[1.25,41.1],[-6.3,38.9],[2.3,48.85],[13.4,38.1]];
// retalhos de campo: [lon, lat, cor]
const CAMPOS=[[2.4,46.9,'#cdbd78'],[-0.3,44.9,'#b9c98a'],[4.6,44.2,'#e0b77a'],[-4.2,40.3,'#cdbd78'],[-6.5,38.5,'#b9c98a'],[11.6,43.7,'#e0b77a'],[13.4,42.3,'#cdbd78'],[9.4,35.8,'#b9c98a'],[6.4,36.2,'#e0b77a']];
const ROTAS_C=[[[12.5,41.9],[12.1,42.9],[11.6,43.7]],[[12.5,41.9],[13,42.1],[13.4,42.3]],[[4.8,45.8],[3.6,46.4],[2.4,46.9]],[[4.8,45.8],[4.7,45],[4.6,44.2]],[[1.25,41.1],[-2,39.5],[-4.2,40.3]],[[-6.3,38.9],[-6.4,38.7],[-6.5,38.5]],[[10.3,36.9],[10,36.3],[9.4,35.8]],[[10.3,36.9],[8,36.7],[6.4,36.2]],[[4.8,45.8],[1.5,45.4],[-0.3,44.9]]];

// castelos: pontos em terra, sorteados sobre a base do mapa-múndi
// só o interior ocidental: nada na Escandinávia, na Hungria nem na África (os invasores vinham de lá)
const PTS_CAST_D=[[9.1,52],[13.8,47.2],[15,50.1],[3,49],[10.5,49.6],[7.4,46.4],[13,53],[-6.8,42.5],[-3,40.6],[-0.1,45.8],[-4,38.1],[-2.1,53.5],[4.6,51.8],[10.6,45.2],[-7.9,39.3],[0.2,42.9],[4.3,45],[-0.8,49],[12.3,42.7],[14.4,41],[-1.8,52.4]];
const PTS_CAST_M=[[3,49],[9.1,52],[7.4,46.4],[-0.1,45.8],[-6.8,42.5],[-3,40.6],[10.6,45.2],[12.3,42.7],[0.2,42.9],[4.3,45],[13.8,47.2],[-2.1,53.5]];
const PTS_CASTELOS=MOB?PTS_CAST_M:PTS_CAST_D;
const VIK='#d9442f',MAG='#d89a12',MUC='#1f5a3a';
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
  {tipo:'rotulo',ll:true,p:[1.2,38.2],texto:'Mar Mediterrâneo',classe:'mar',tam:.55,desde:2,ate:5},
  // ===== etapa 3 (2): cidades grandes que encolhem, o campo e as pessoas que saem da cidade
  {tipo:'pontos',ll:true,pts:CIDS,tam:2.6,cor:'tinta',etapas:[2],atraso:A(700),dura:6200},
  {tipo:'pontos',ll:true,pts:CIDS,tam:.85,cor:'tinta',etapas:[2],atraso:A(7300)},
  {tipo:'etiqueta',ll:true,p:[13.1,42.9],texto:'Roma',tam:.42,etapas:[2],atraso:A(1500)},
  {tipo:'etiqueta',ll:true,p:[10.9,37.6],texto:'Cartago',tam:.42,etapas:[2],atraso:A(1900),dura:20000},
  {tipo:'etiqueta',ll:true,p:[5.4,46.6],texto:'Lião',tam:.42,etapas:[2],atraso:A(2300)},
  {tipo:'etiqueta',ll:true,p:[2.9,49.6],texto:'Paris',tam:.42,etapas:[2],atraso:A(2700)}
];
CAMPOS.forEach((c,i)=>{camadasMed.push({tipo:'regiao',ll:true,terra:true,pts:retalho(c[0],c[1],1.7,1.15),suave:false,cor:c[2],opac:.85,etapas:[2],atraso:A(9500+i*450)});});
ROTAS_C.forEach((r,i)=>{camadasMed.push({tipo:'rota',ll:true,pts:r,invisivel:true,movel:'ponto',tam:.9,volta:5200+i*500,etapas:[2],atraso:A(9000+i*300)});});
camadasMed.push(
  {tipo:'etiqueta',ll:true,p:[-8.8,35.6],texto:'grandes propriedades',tam:.4,etapas:[2],atraso:A(15500),cor:'amarelo',dura:7500},
  // ===== etapa 5 (4): o reino dos francos em 511 vai só até o Garonne; Septimânia e Provença ficam de fora
  {tipo:'regiao',ll:true,terra:true,pts:FRANCOS_N,suave:false,cor:'coral',opac:.85,etapas:[4],atraso:A(1500)},
  {tipo:'regiao',ll:true,terra:true,pts:FRANCOS_S,suave:false,cor:'coral',opac:.85,etapas:[4],atraso:A(4500)},
  {tipo:'regiao',ll:true,terra:true,pts:VISI_FR,suave:false,cor:'#f0dc9a',opac:.9,etapas:[4],atraso:A(6000)},
  {tipo:'regiao',ll:true,terra:true,pts:PROV_FR,suave:false,cor:'#9fd0d3',opac:.9,etapas:[4],atraso:A(6600)},
  {tipo:'regiao',ll:true,terra:true,pts:BURG5,suave:false,cor:'#b7a3cc',opac:.9,etapas:[4],atraso:A(7200)},
  {tipo:'etiqueta',ll:true,p:TM([-3.6,47.4],[-1.5,47.4]),texto:'reino dos francos',tam:TM(.5,.3),etapas:[4],atraso:A(5200)},
  {tipo:'cidade',ll:true,p:[2.35,48.85],nome:'Paris',tam:TM(.5,.3),lado:'e',etapas:[4],atraso:A(3500)},
  {tipo:'etiqueta',ll:true,p:[-1.9,44.1],texto:'visigodos',tam:TM(.5,.24),etapas:[4],atraso:A(6600)},
  {tipo:'etiqueta',ll:true,p:[4.9,44.5],texto:'ostrogodos',tam:TM(.5,.24),etapas:[4],atraso:A(7200)},
  {tipo:'etiqueta',ll:true,p:[3.6,46.4],texto:'Burgúndia',sub:'só em 534',tam:TM(.5,.24),etapas:[4],atraso:A(7800)},
  // ===== etapa 6 (5): Bizâncio cresce com Justiniano e depois recua
  {tipo:'regiao',ll:true,terra:true,pts:B_NUCLEO,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(900),dura:29500},
  {tipo:'regiao',ll:true,terra:true,pts:B_SIRIA,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(900),dura:29500},
  {tipo:'regiao',ll:true,terra:true,pts:B_EGITO,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(900),dura:29500},
  {tipo:'regiao',ll:true,terra:true,pts:B_ITALIA,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(8500),dura:16000},
  {tipo:'regiao',ll:true,terra:true,pts:B_AFRICA,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(9200),dura:15300},
  {tipo:'regiao',ll:true,terra:true,pts:B_ESPANHA,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(9800),dura:14700},
  {tipo:'regiao',ll:true,terra:true,pts:B_FIM,suave:false,cor:'coral',opac:.85,etapas:[5],atraso:A(30500)},
  {tipo:'etiqueta',ll:true,p:[27.2,37.6],texto:'Império Bizantino',tam:.45,etapas:[5],atraso:A(2500)},
  {tipo:'etiqueta',ll:true,p:[13.4,38.9],texto:'Itália',tam:.5,etapas:[5],atraso:A(10000),dura:14500},
  {tipo:'etiqueta',ll:true,p:[1.5,33.5],texto:'norte da África',tam:.5,etapas:[5],atraso:A(10600),dura:13900},
  {tipo:'cidade',ll:true,p:[28.98,41.01],nome:'Constantinopla',sub:'antiga Bizâncio',capital:true,tam:.5,lado:'e',etapas:[5],atraso:A(1500)},
  {tipo:'etiqueta',ll:true,p:TM([-6.3,48.9],[-4,49.6]),texto:'c. 555: o império de Justiniano',tam:TM(.5,.56),etapas:[5],atraso:A(11500),dura:13000},
  {tipo:'etiqueta',ll:true,p:[-4.0,35.7],texto:'Espanha bizantina',tam:TM(.5,.56),etapas:[5],atraso:A(10400),dura:14000},
  {tipo:'nota',ll:true,p:TM([11,48.8],[23.6,49.0]),texto:'depois de Justiniano o|império encolhe, mas|dura até 1453',tam:.5,etapas:[5],atraso:A(31500)}
);

// ---- camadas do mapa-múndi
const camadasMun=[];
// ===== etapa 4 (3): o Império do Ocidente se rasga em retalhos (mapa por volta de 500)
const LT=TM(.26,.22);
[['visi',VISI],['suev',SUEV],['ostro',OSTRO],['franc',FRANC],['burg',BURG],['vand',VAND]].forEach(r=>{
  camadasMun.push({tipo:'regiao',ll:true,terra:true,pts:r[1],suave:false,cor:'coral',opac:.85,etapas:[3],atraso:A(400),dura:2000});});
[['visi',VISI,0],['suev',SUEV,1],['ostro',OSTRO,2],['franc',FRANC,3],['burg',BURG,4],['vand',VAND,5],['anglo',ANGLO,6]].forEach(r=>{
  camadasMun.push({tipo:'regiao',ll:true,terra:true,pts:r[1],suave:false,cor:CORES_R[r[0]],opac:.9,etapas:[3],atraso:A(2400+r[2]*350)});});
camadasMun.push(
  {tipo:'etiqueta',ll:true,p:TM([-29,64.8],[-17.6,69.4]),texto:'mapa por volta de 500',tam:TM(.3,.24),etapas:[3],atraso:A(600)},
  {tipo:'etiqueta',ll:true,p:[-9.2,38.4],texto:'visigodos',tam:LT,etapas:[3],atraso:A(3000)},
  {tipo:'etiqueta',ll:true,p:[-16,43.4],texto:'suevos',tam:LT,etapas:[3],atraso:A(3350)},
  {tipo:'etiqueta',ll:true,p:[11.4,44.0],texto:'ostrogodos',tam:LT,etapas:[3],atraso:A(3700)},
  {tipo:'etiqueta',ll:true,p:[-4.6,48.7],texto:'francos',tam:LT,etapas:[3],atraso:A(4050)},
  {tipo:'etiqueta',ll:true,p:[3.2,42.1],texto:'burgúndios',tam:LT,etapas:[3],atraso:A(4400)},
  {tipo:'etiqueta',ll:true,p:[-1.5,33],texto:'vândalos',tam:LT,etapas:[3],atraso:A(4750)},
  {tipo:'etiqueta',ll:true,p:[2.6,54.6],texto:'anglo-saxões',tam:LT,etapas:[3],atraso:A(5100)},
  {tipo:'etiqueta',ll:true,p:TM([-12.4,57.2],[-12.4,57.2]),texto:'Igreja',tam:LT,etapas:[3],atraso:A(26400)},
  // ===== etapa 7 (6): o império de Carlos Magno
  {tipo:'regiao',ll:true,terra:true,pts:FRANCIA_CL,suave:false,cor:'coral',opac:.85,etapas:[6],atraso:A(600),dura:7500},
  {tipo:'regiao',ll:true,terra:true,pts:CAROL,suave:false,cor:'coral',opac:.85,etapas:[6,7],atraso:A(8200)},
  {tipo:'cidade',ll:true,p:[6.08,50.78],nome:'Aix-la-Chapelle',sub:'(Aachen)',capital:true,tam:TM(.26,.22),lado:'d',etapas:[6],atraso:A(9800)},
  {tipo:'pontos',ll:true,pts:[[0.34,46.58]],tam:.9,cor:'tinta',etapas:[6],atraso:A(2600)},
  {tipo:'etiqueta',ll:true,p:TM([-14.5,45.4],[4.2,45.2]),texto:'Poitiers',sub:'732',tam:TM(.26,.22),etapas:[6],atraso:A(2900)},
  {tipo:'rota',ll:true,pts:TM([[-7.6,45.6],[0.34,46.58]],[[2.4,45.8],[0.34,46.58]]),cor:'tinta',largura:1.2,tracejada:false,etapas:[6],atraso:A(3100),dur:1},
  // condados: dois retalhos do interior, com um fio fino até a etiqueta
  {tipo:'regiao',ll:true,terra:true,pts:COND[0],suave:false,cor:'amarelo',opac:.9,etapas:[6],atraso:A(13500)},
  {tipo:'regiao',ll:true,terra:true,pts:COND[1],suave:false,cor:'amarelo',opac:.9,etapas:[6],atraso:A(13900)},
  {tipo:'etiqueta',ll:true,p:TM([-14.5,49.6],[-3.8,52.0]),texto:'condado',tam:TM(.24,.2),etapas:[6],atraso:A(14500),cor:'amarelo'},
  {tipo:'rota',ll:true,pts:TM([[-6.8,48.9],[1.85,48.1]],[[-1.5,50.7],[1.85,48.7]]),cor:'tinta',largura:1.2,tracejada:false,etapas:[6],atraso:A(14900),dur:1},
  {tipo:'rota',ll:true,pts:TM([[-6.8,48.4],[-0.75,47.6]],[[-1.5,50.5],[-0.6,48.3]]),cor:'tinta',largura:1.2,tracejada:false,etapas:[6],atraso:A(15100),dur:1},
  // marcas: Marca Hispânica (até o Ebro), Bretanha, Friul, Panônia e a fronteira saxã
  {tipo:'regiao',ll:true,terra:true,pts:M_HISP,suave:false,cor:'petroleo',opac:.9,etapas:[6],atraso:A(16000)},
  {tipo:'regiao',ll:true,terra:true,pts:M_BRETANHA,suave:false,cor:'petroleo',opac:.9,etapas:[6],atraso:A(16400)},
  {tipo:'regiao',ll:true,terra:true,pts:M_FRIUL,suave:false,cor:'petroleo',opac:.9,etapas:[6],atraso:A(16800)},
  {tipo:'regiao',ll:true,terra:true,pts:M_PANONIA,suave:false,cor:'petroleo',opac:.9,etapas:[6],atraso:A(17200)},
  {tipo:'regiao',ll:true,terra:true,pts:M_NORTE,suave:false,cor:'petroleo',opac:.9,etapas:[6],atraso:A(17600)},
  {tipo:'etiqueta',ll:true,p:[3.8,40.6],texto:'marca',sub:'(fronteira)',tam:TM(.24,.22),etapas:[6],atraso:A(18000)},
  {tipo:'rota',ll:true,pts:[[4.6,40.7],[2.8,41.7]],cor:'tinta',largura:1.2,tracejada:false,etapas:[6],atraso:A(18300),dur:1},
  {tipo:'etiqueta',ll:true,p:[17.2,46.4],texto:'marca',sub:'(fronteira)',tam:TM(.24,.22),etapas:[6],atraso:A(18600)},
  {tipo:'rota',ll:true,pts:[[17.2,46.3],[15.2,46.6]],cor:'tinta',largura:1.2,tracejada:false,etapas:[6],atraso:A(18900),dur:1},
  {tipo:'etiqueta',ll:true,p:[13.6,55.7],texto:'marca',sub:'(fronteira)',tam:TM(.24,.22),etapas:[6],atraso:A(19200)},
  {tipo:'rota',ll:true,pts:[[13.2,55.3],[10.2,53.6]],cor:'tinta',largura:1.2,tracejada:false,etapas:[6],atraso:A(19500),dur:1},
  // terras do papa (doação de Pepino, 756)
  {tipo:'regiao',ll:true,terra:true,pts:PAPA,suave:false,cor:'#8b5aa8',opac:.92,etapas:[6],atraso:A(21500)},
  {tipo:'etiqueta',ll:true,p:TM([15.5,42.2],[14.6,41.8]),texto:'terras do papa',sub:'(Pepino, 756)',tam:TM(.26,.22),etapas:[6],atraso:A(22300),cor:'#d8c4e8'},
  {tipo:'rota',ll:true,pts:TM([[15.4,42.0],[13.4,42.8]],[[14.5,41.6],[13.4,42.6]]),cor:'tinta',largura:1.2,tracejada:false,etapas:[6],atraso:A(22600),dur:1},
  // ===== etapa 8 (7): Verdun divide o império em três faixas
  {tipo:'regiao',ll:true,terra:true,pts:V_OESTE,suave:false,cor:'coral',opac:.85,etapas:[7],atraso:A(14000)},
  {tipo:'regiao',ll:true,terra:true,pts:V_MEIO,suave:false,cor:'#e8c14f',opac:.9,etapas:[7],atraso:A(14800)},
  {tipo:'regiao',ll:true,terra:true,pts:V_LESTE,suave:false,cor:'#6fb0b5',opac:.9,etapas:[7],atraso:A(15600)},
  {tipo:'etiqueta',ll:true,p:TM([-17.5,61.8],[-12.7,72.6]),texto:'843: Tratado de Verdun',tam:TM(.26,.22),etapas:[7],atraso:A(13500)},
  {tipo:'etiqueta',ll:true,p:TM([-15.5,50.8],[-12.8,52.6]),texto:'Carlos, o Calvo',sub:'futura França',tam:TM(.22,.21),etapas:[7],atraso:A(17500)},
  {tipo:'etiqueta',ll:true,p:TM([3.5,40.5],[3.4,41.6]),texto:'Lotário',sub:'faixa do meio',tam:TM(.22,.21),etapas:[7],atraso:A(18500)},
  {tipo:'etiqueta',ll:true,p:TM([15.5,52.0],[10.6,55.5]),texto:'Luís, o Germânico',sub:'futura Alemanha',tam:TM(.22,.21),etapas:[7],atraso:A(19500)},
  {tipo:'pontos',ll:true,pts:[[6.08,50.78]],tam:.9,cor:'tinta',etapas:[7],atraso:A(16500)},
  {tipo:'nota',ll:true,p:TM([2,59.4],[-5,62.5]),texto:'Hilário|Franco Júnior:|o primeiro esboço|do mapa europeu',tam:TM(.17,.2),etapas:[7],atraso:A(22000)},
  // ===== etapa 9 (8): invasões
  {tipo:'etiqueta',ll:true,p:[9,64.6],texto:'vikings',tam:.26,etapas:[8],atraso:A(2500),cor:'#f3a595'},
  {tipo:'etiqueta',ll:true,p:[27.5,50.4],texto:'magiares',tam:.26,etapas:[8],atraso:A(6500),cor:'#f2cf6b'},
  {tipo:'etiqueta',ll:true,p:[10,33.3],texto:'muçulmanos',tam:.26,etapas:[8],atraso:A(9800),cor:'#9ccfae'}
);

// ---- fita do tempo (régua fora de escala)
const marcos=[
  {p:8,t:'476',d:2,s:'fim do Império do Ocidente',etapa:[2,3]},
  {p:16,t:'511',d:4,s:'morte de Clóvis',etapa:4},
  {p:24,t:'527 a 565',d:5,s:'Justiniano',etapa:5,cor:'petroleo'},
  {p:35,t:'732',d:6,s:'Poitiers',etapa:6},
  {p:46,t:'800',d:6,s:'Carlos Magno',etapa:6},
  {p:57,t:'843',d:7,s:'Tratado de Verdun',etapa:7},
  {p:67,t:'909',d:8,s:'concílio de Trosly',etapa:8},
  {p:78,t:'1054',d:5,s:'Cisma do Oriente',etapa:5,cor:'petroleo'},
  {p:92,t:'1453',d:5,s:'queda de Constantinopla',etapa:5,cor:'petroleo'}
];

Colagem.montar({
  modulo:'Módulo 2: Idade Média e início da Idade Moderna',
  titulo:'Alta Idade Média',
  subtitulo:'Reinos germânicos, Bizâncio e o império de Carlos Magno',
  credito:'Os mapas usam bases geradas por IA, as mesmas do restante da História. Recortes, esquemas, camadas e fita do tempo são desenhados em código pelo LAB.',
  ritmo:10000,
  celularGrande:true,
  msPalavra:250,
  mesa:{w:10700,h:6700},
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
    {id:'tempo',tipo:'tempo',grande:true,gg:true,prog:true,x:TLX,y:TLY,w:TLW,h:190,giro:.2,avisoEt:'2,3,4,6,7,8',aviso:'régua fora de escala',marcos:marcos},

    // ---- etapa 1: mil anos no meio
    MOB?{id:'idade',tipo:'idade',m:true,x:2190,y:3070,w:1220,h:1520,giro:-.2,atraso:A(300),rotulo:'Fita do tempo da Idade Média, de 476 a 1500, em duas faixas empilhadas, e a fita pontilhada de Le Goff até 1789'}
        :{id:'idade',tipo:'idade',x:2200,y:3150,w:3700,h:1330,giro:-.3,atraso:A(300),rotulo:'Fita do tempo da Idade Média, de 476 a 1500, em duas faixas, e a fita pontilhada de Le Goff até 1789'},
    MOB?{id:'n-476',tipo:'nota',fs:50,x:2190,y:4650,w:1220,giro:-1,atraso:A(4500),texto:'476: os hérulos depõem o último imperador do Ocidente'}
        :{id:'n-476',tipo:'nota',fs:70,x:2250,y:4530,w:2000,giro:-1,atraso:A(4500),texto:'476: os hérulos depõem o último imperador do Ocidente'},

    // ---- etapa 2: Idade das Trevas?
    {id:'capa1',tipo:'capa',v:'trevas',linhas:['Renascimento:','trevas'],x:2200,y:4350,w:800,h:1075,giro:-2.4,atraso:A(400),rotulo:'Capa de livro preta: Renascimento, trevas'},
    {id:'capa2',tipo:'capa',v:'romantico',linhas:['século XIX:','berço das nações'],x:3100,y:4380,w:800,h:1075,giro:1.6,atraso:A(10500),rotulo:'Capa de livro com um castelo romântico: século XIX, berço das nações'},
    {id:'capa3',tipo:'capa',v:'seculo20',linhas:['século XX:','o que de fato houve'],tam:44,x:4000,y:4340,w:800,h:1075,giro:-1.2,atraso:A(20500),rotulo:'Capa de livro com uma lupa sobre arado, vitral e livro: século XX, o que de fato houve'},
    {id:'et-got',tipo:'etiqueta',fs:62,x:5100,y:4470,w:520,h:140,clicavel:false,atraso:A(29500),texto:'gótico'},
    {id:'capacete',tipo:'icone',nome:'capacete-godo',fundo:'coral',x:5800,y:4380,w:420,h:420,giro:2,atraso:A(31500),rotulo:'Recorte: capacete godo de bandas de ferro'},
    {id:'n-got',tipo:'nota',fs:46,x:5120,y:4800,w:1000,giro:-1.4,atraso:A(33500),texto:'o nome era uma ofensa'},

    // ---- etapa 3: do Império aos campos
    {id:'pessoas',tipo:'pessoas20',x:MOB?1610:1650,y:MOB?1420:1450,w:MOB?1140:1100,h:MOB?547:528,giro:-.6,atraso:A(24500),rotulo:'Gráfico de bonequinhos: de vinte pessoas, só uma é germânica'},
    {id:'n-col',tipo:'nota',fs:46,x:MOB?1610:1650,y:MOB?2000:2010,w:MOB?1140:1100,giro:.8,atraso:A(31000),texto:'colonato: o colono preso à terra, raiz da servidão'},
  ].concat(CAMPOS.map((c,i)=>{const q=MLm(c[0],c[1]);return {id:'vi'+i,tipo:'icone',nome:'villa',fundo:false,x:q[0]-80,y:q[1]-90,w:160,h:160,giro:(i%3-1)*3,atraso:A(10000+i*450),rotulo:'Recorte: casa de campo romana, uma grande propriedade'};})).concat([

    // ---- etapa 4: os reinos germânicos
    {id:'comitatus',tipo:'comitatus',x:7060,y:430,w:700,h:630,giro:-1,atraso:A(15000),rotulo:'Esquema do comitatus: um chefe no centro e guerreiros em roda'},
    {id:'cruz',tipo:'cruz',x:8090,y:570,w:62,h:87,atraso:A(26000),rotulo:'Cruz pequena no canto do mapa, ligada por uma seta tracejada à Europa'},
    {id:'n-igreja',tipo:'nota',fs:42,x:7060,y:1130,w:700,giro:1,atraso:A(19000),texto:'Igreja: o elo, segundo Hilário Franco Júnior'},

    // ---- etapa 5: Clóvis e os francos (margem esquerda do mapa do Mediterrâneo)
    {id:'pia',tipo:'icone',nome:'pia-coroa',fundo:'petroleo',x:160,y:130,w:500,h:500,giro:-2,atraso:A(4000),rotulo:'Recorte: pia batismal com uma coroa ao lado, a conversão de Clóvis'},
    {id:'et-conv',tipo:'etiqueta',fs:60,x:790,y:300,w:520,h:130,clicavel:false,atraso:A(6500),texto:'conversão'},
    {id:'et-496',tipo:'etiqueta',fs:48,x:150,y:670,w:1150,h:110,clicavel:false,atraso:A(5500),texto:'conversão de Clóvis: por volta de 496'},
    {id:'et-povo',tipo:'etiqueta',fs:48,x:150,y:880,w:720,h:130,clicavel:false,atraso:A(9500),texto:'povo galo-romano cristão'},
    {id:'et-bispos',tipo:'etiqueta',fs:48,x:960,y:880,w:340,h:130,clicavel:false,atraso:A(11000),texto:'bispos'},
    {id:'n-mero',tipo:'nota',fs:48,x:150,y:1090,w:1150,giro:-.8,atraso:A(13500),texto:'merovíngia: de Meroveu, ancestral lendário'},

    // ---- etapa 6: Bizâncio
    {id:'alvo',tipo:'alvo',x:3687,y:655,w:160,h:160,atraso:A(17000),rotulo:'Ponto de Constantinopla'},
    {id:'sofia',tipo:'icone',nome:'santa-sofia',fundo:'amarelo',x:3880,y:440,w:270,h:270,giro:-2,atraso:A(18000),rotulo:'Recorte: silhueta da igreja de Santa Sofia, em Constantinopla'},
    {id:'et-sofia',tipo:'etiqueta',fs:44,x:3860,y:330,w:310,h:100,clicavel:false,atraso:A(18800),texto:'Santa Sofia'},
    {id:'corpus',tipo:'icone',nome:'corpus',fundo:'petroleo',x:3640,y:1190,w:230,h:230,giro:2,atraso:A(23500),rotulo:'Recorte: livro fechado do Corpus Juris Civilis'},
    {id:'et-corpus',tipo:'etiqueta',fs:44,x:2990,y:1210,w:640,h:150,clicavel:false,atraso:A(24500),texto:'Corpus Juris Civilis, base do Direito ocidental'},
    {id:'cruzc',tipo:'icone',nome:'cruz-cisma',fundo:'coral',x:TLX+TLW*.78-170,y:TLY+260,w:340,h:340,giro:-2,atraso:A(33000),rotulo:'Recorte: cruz que se parte em duas, o Cisma do Oriente, em 1054'},
    {id:'risc',tipo:'riscado',x:TLX+TLW*.92-300,y:TLY+270,w:600,h:257,giro:1.5,atraso:A(37000),rotulo:'Constantinopla riscada: os turcos otomanos a tomam em 1453'},

    // ---- etapa 7: Carlos Magno
    MOB?{id:'maos',tipo:'maos',x:8210,y:900,w:400,h:231,giro:-1,atraso:A(23000),rotulo:'A mão da Igreja, com a mitra do papa, dá a coroa; a mão do rei dos francos dá a Itália em forma de bota'}
        :{id:'maos',tipo:'maos',x:8150,y:880,w:520,h:300,giro:-1,atraso:A(23000),rotulo:'A mão da Igreja, com a mitra do papa, dá a coroa; a mão do rei dos francos dá a Itália em forma de bota'},
    MOB?{id:'et-maos',tipo:'etiqueta',fs:34,x:8200,y:1150,w:420,h:110,clicavel:false,atraso:A(25500),texto:'Igreja e carolíngios: apoio mútuo'}
        :{id:'et-maos',tipo:'etiqueta',fs:44,x:8700,y:930,w:500,h:170,clicavel:false,atraso:A(25500),texto:'Igreja e carolíngios: apoio mútuo'},
    MOB?{id:'linhagem',tipo:'linhagem',m:true,x:8190,y:1290,w:620,h:700,atraso:A(30500),rotulo:'Carlos Martel, Pepino, o Breve, e Carlos Magno, ligados por setas'}
        :{id:'linhagem',tipo:'linhagem',x:8100,y:1230,w:1300,h:230,atraso:A(30500),rotulo:'Carlos Martel, Pepino, o Breve, e Carlos Magno, ligados por setas'},

    // ---- etapa 8: escolas, letras e Verdun
    {id:'manus',tipo:'manuscrito',x:7420,y:400,w:520,h:700,giro:1.2,atraso:A(300),rotulo:'Página de manuscrito carolíngio com uma letra minúscula ampliada'},
    {id:'et-letra',tipo:'etiqueta',fs:44,x:7360,y:1170,w:700,h:170,clicavel:false,atraso:A(6500),texto:'a letra que deu origem às nossas minúsculas'},

    // ---- etapa 9: novas invasões e o poder em pedaços
    {id:'castelos',tipo:'castelos',x:CAST_BOX[0],y:CAST_BOX[1],w:CAST_BOX[2],h:CAST_BOX[3],mx:MXW,my:0,s:S,base:BW,pts:PTS_CASTELOS,raio:42,k:.5,atraso:11.5,passo:.42,rotulo:'Castelos com círculos de alcance cobrindo a Europa'},
    {id:'doc',tipo:'fonte',grande:true,x:7340,y:330,w:640,h:930,giro:1,atraso:A(30000),rotulo:'Fonte histórica: concílio de Trosly, 909',
     texto:'“As cidades estão despovoadas, os mosteiros destruídos ou queimados, os campos viraram deserto. Assim como os primeiros homens viviam sem lei nem temor de Deus, agora cada um faz o que bem entende, despreza as leis humanas e divinas e as ordens da Igreja. Os mais fortes oprimem os mais fracos, e os homens são como os peixes do mar, que se devoram uns aos outros.”',
     ref:'Atas do concílio de Trosly, reunido pelo arcebispo de Reims e seus bispos, 909. Paráfrase da equipe.',
     resposta:'A visão dos ==bispos sobre a crise do começo do século X==: invasões, cidades e mosteiros arrasados e falta de um poder central capaz de impor a lei. A imagem dos peixes descreve a violência entre os poderosos locais, o ambiente em que nasce o feudalismo. É preciso criticar a fonte: quem escreve é o ==alto clero==, que sofria com o saque dos mosteiros e queria reforçar a autoridade da Igreja. Por isso exagera o caos e o liga ao pecado.'},
    {id:'et-prox',tipo:'etiqueta',fs:56,x:7340,y:1350,w:640,h:130,clicavel:false,atraso:A(42000),texto:'Próximo: feudalismo'}
  ]),

  etapas:[
    {titulo:'Mil anos no meio',so:['idade','n-476'],
     foco:[2120,2900,3860,2573],focoM:[2170,3070,1260,1850],
     tomadas:[[8500,[2150,3150,2100,1500]],[14500,[3050,3150,2000,1400]],[21000,[4300,3150,1700,1400]]],
     tomadasM:[[22000,[2170,3070,1260,1850]]],tempo:44000,
     texto:TEXTO[0]},
    {titulo:'Idade das Trevas?',so:['capa1','capa2','capa3','et-got','capacete','n-got'],
     foco:[2120,4280,960,1230],focoM:[2120,4280,960,1230],
     tomadas:[[10000,[3020,4300,960,1230]],[20000,[3920,4270,960,1230]],[27500,[2100,4270,2850,1250]],[33500,[5040,4320,1330,720]]],
     tomadasM:[[10000,[3020,4300,960,1230]],[20000,[3920,4270,960,1230]],[29500,[5060,4330,1250,720]]],tempo:46000,
     tracos:[{tipo:'seta',de:{peca:'et-got',x:100,y:50},para:{peca:'capacete',x:2,y:45},cor:'seta',espessura:9,ponta:44,curva:.25,atraso:A(32500)}],
     texto:TEXTO[1]},
    {titulo:'Do Império aos campos',mostra:['med','tempo'],so:['pessoas','n-col'].concat(CAMPOS.map((c,i)=>'vi'+i)),
     foco:Fm(4,42,720),focoM:Fmc(4,41,260),
     tomadas:[[9200,Fm(1,43,400)],[24000,[1550,1220,1500,1000]],[36500,TL(8,1200)]],
     tomadasM:[[9200,Fmc(1,44,130)],[24000,[1580,920,1200,1000]],[37000,TL(12,760)]],tempo:46000,
     texto:TEXTO[2]},
    {titulo:'Os reinos germânicos',mostra:['mun'],so:['comitatus','cruz','n-igreja'],
     foco:Fw(2,46,250),focoM:Fwc(3,45,150),
     tomadas:[[15000,[7010,380,820,1000]],[25500,Fw(2,46,250)],[36500,TL(8,1200)]],
     tomadasM:[[9000,Fwc(3.0,44.5,143)],[15000,[7010,380,820,1206]],[26000,Fwc(2,45,150)],[37000,TL(12,760)]],tempo:46000,
     tracos:[{tipo:'seta',de:MLw(5.2,42.2),para:MLw(5.0,44.4),cor:'tinta',espessura:6,ponta:26,curva:.1,atraso:A(5600)},
             {tipo:'seta',de:{peca:'cruz',x:50,y:104},para:MLw(-2,45.6),cor:'coral-esc',espessura:6,ponta:26,curva:.2,atraso:A(26800)}],
     texto:TEXTO[3]},
    {titulo:'Clóvis e os francos',so:['pia','et-conv','et-496','et-povo','et-bispos','n-mero'],
     foco:Fm(1.8,45.3,300),focoM:Fmc(1.5,45.5,125),
     tomadas:[[9000,[100,0,2800,1867]],[27000,TL(18,1200)]],
     tomadasM:[[9000,[120,90,1250,700]],[17500,[120,300,1250,900]],[22500,[120,1040,1250,280]],[27000,TL(20,760)]],tempo:40000,
     tracos:[{tipo:'circulo',peca:'pia',x:50,y:52,w:96,h:96,atraso:A(7000)},
             {tipo:'seta',de:{peca:'pia',x:100,y:45},para:{peca:'et-conv',x:0,y:50},cor:'seta',espessura:9,ponta:40,curva:-.2,atraso:A(8000)},
             {tipo:'seta',de:{peca:'et-conv',x:30,y:100},para:{peca:'et-povo',x:62,y:0},cor:'seta',espessura:9,ponta:40,curva:.2,atraso:A(10500)},
             {tipo:'seta',de:{peca:'et-conv',x:78,y:100},para:{peca:'et-bispos',x:50,y:0},cor:'seta',espessura:9,ponta:40,curva:-.2,atraso:A(12000)}],
     texto:TEXTO[4]},
    {titulo:'Bizâncio, a Roma do Oriente',so:['alvo','sofia','corpus','et-sofia','et-corpus','cruzc','risc'],
     foco:Fm(22,40,480),focoM:Fmc(27.5,40,285),
     tomadas:[[9500,Fm(13.5,38.3,800)],[17500,[3250,280,1180,787]],[22200,[2900,1100,1250,833]],[29500,Fm(28.5,39.5,700)],[34000,TL(24,1100)],[39500,[TLX+TLW*.78-600,TLY-130,1200,800]],[43500,[TLX+TLW*.92-600,TLY-130,1200,800]]],
     tomadasM:[[9500,Fmc(6.5,38,430)],[17500,[3300,380,900,1000]],[22200,[2960,1160,1080,850]],[29500,Fmc(27.5,39,360)],[34000,TL(24,760)],[38500,[TLX+TLW*.78-380,TLY-130,760,900]],[43000,[TLX+TLW*.92-320,TLY-130,640,900]]],tempo:48000,
     tracos:[{tipo:'circulo',peca:'alvo',x:50,y:50,w:100,h:100,atraso:A(20000)},
             {tipo:'seta',de:{peca:'sofia',x:0,y:80},para:{peca:'alvo',x:92,y:30},cor:'seta',espessura:8,ponta:30,curva:.2,atraso:A(20800)}],
     texto:TEXTO[5]},
    {titulo:'Carlos Magno, imperador',so:['maos','et-maos','linhagem'],
     foco:Fw(4,47,250),focoM:Fwc(3,47,120),
     tomadas:[[12500,Fw(2,46.5,230)],[21000,[8100,520,1120,747]],[29500,[8090,830,1330,887]],[37500,TL(40,1300)]],
     tomadasM:[[12500,Fwc(6.5,46.5,125)],[21500,[8165,600,455,671]],[30000,[8150,1180,720,1059]],[37500,TL(40.5,760)]],tempo:48000,
     tracos:[{tipo:'seta',de:MLw(-5.5,37.4),para:MLw(0.3,45.5),cor:'petroleo',espessura:11,ponta:46,curva:.18,atraso:A(3000)},
             {tipo:'sublinha',de:MLw(-1.3,46),para:MLw(1.9,46),cor:'seta',espessura:15,atraso:A(5000)},
             {tipo:'seta',de:{peca:'maos',x:80,y:14},para:MLw(12.6,42.2),cor:'#8b5aa8',espessura:7,ponta:30,curva:.2,atraso:A(24300)}],
     texto:TEXTO[6]},
    {titulo:'Escolas, letras e Verdun',so:['manus','et-letra'],
     foco:[7330,380,820,1000],focoM:[7330,380,820,1000],
     tomadas:[[12500,Fw(6,48,190)],[29500,TL(62,1300)]],
     tomadasM:[[12500,Fwc(6,50,150)],[29500,TL(62,760)]],tempo:40000,
     texto:TEXTO[7]},
    {titulo:'Novas invasões e o poder em pedaços',so:['castelos','doc','et-prox'],fonte:'doc',
     foco:Fw(10,48,250),focoM:Fwc(10,48,120),
     tomadas:[[27000,[7320,320,680,500]],[34500,[7320,780,680,500]],[41500,[7300,960,700,500]]],
     tomadasM:[[27000,[7335,320,650,1000]],[35500,[7335,760,650,860]]],tempo:52000,
     tracos:[
       // vikings (coral): uma linha para a Grã-Bretanha e três que sobem o Sena, o Loire e o Reno
       {tipo:'seta',de:MLw(10.5,59.6),para:MLw(-0.8,54.6),cor:VIK,espessura:10,ponta:40,curva:-.2,atraso:A(2600)},
       {tipo:'seta',de:MLw(-1.0,50.4),para:MLw(2.1,48.9),cor:VIK,espessura:8,ponta:30,curva:.2,atraso:A(3300)},
       {tipo:'seta',de:MLw(-4.4,46.9),para:MLw(0.7,47.3),cor:VIK,espessura:8,ponta:30,curva:-.15,atraso:A(3800)},
       {tipo:'seta',de:MLw(3.0,53.3),para:MLw(7.0,50.9),cor:VIK,espessura:8,ponta:30,curva:.2,atraso:A(4300)},
       // magiares (âmbar)
       {tipo:'seta',de:MLw(32,48.6),para:MLw(17.5,47.4),cor:MAG,espessura:10,ponta:40,curva:-.15,atraso:A(6600)},
       {tipo:'seta',de:MLw(28,46.4),para:MLw(11.5,45.9),cor:MAG,espessura:10,ponta:40,curva:.15,atraso:A(7400)},
       // muçulmanos (verde-escuro)
       {tipo:'seta',de:MLw(10.6,34.6),para:MLw(13.4,40.4),cor:MUC,espessura:10,ponta:40,curva:.2,atraso:A(9900)},
       {tipo:'seta',de:MLw(-4.6,36.1),para:MLw(5.6,43.1),cor:MUC,espessura:10,ponta:40,curva:-.25,atraso:A(10600)}],
     texto:TEXTO[8]}
  ]
});
})();
