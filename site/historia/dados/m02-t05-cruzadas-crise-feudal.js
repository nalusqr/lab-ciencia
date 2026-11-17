/* Módulo 2, tópico 5: Cruzadas, renascimento comercial e crise do feudalismo. Roteiro revisado: docs/revisao-historia/m02-t05-cruzadas-crise-feudal.md
   Formato dos dados: docs/historia/MOTOR.md. Recortes e esquemas próprios: recortes-m02e.js (e trienal e moinhos, de recortes-m02b.js).
   Duas bases de mapa, as duas com escala 3 na mesa (4128 x 2304):
   - Mediterrâneo (historia-mapa-mediterraneo), à esquerda: etapas 2, 3 e 8. Vai da Ibéria ao Golfo Pérsico, sem a Britânia e o Báltico.
   - Mundo (historia-mapa-mundo), à direita: etapas 4 (feiras e Hansa) e 9 (revoltas na França e na Inglaterra).
   Pontos em longitude e latitude (ll:true); toda região é recortada pela costa (terra:true).
   Mesa em zonas: os dois mapas (topo), fita do tempo (embaixo dos mapas); etapa 1 (esquema trienal, bifurcação, gráfico e faixas) logo abaixo;
   etapa 4 (nota de crédito e cargas da Hansa) ao lado da fita; etapas 5, 6 e 7 em fileira (cidade, oficina, campo e castelo); etapas 8 e 9 na última fileira. */
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
const TLX=1700,TLW=6000,TLY=2480;
const TL=(p,w)=>[TLX+TLW*p/100-w/2,TLY-130,w,520];

// ---- polígonos (longitude e latitude)
const MUC_A=[[27.5,39.5],[30,40.4],[35,41.8],[41,41.2],[44,40],[46,37],[48,33],[48,29],[39,28.8],[35.2,28.6],[34.5,31.2],[34.8,32.5],[35.7,34.5],[36,36],[33,36.3],[30.5,36.6],[27.5,37.2]];
const MUC_B=[[24.8,31.7],[29,31.3],[32.3,31.4],[34.2,31.2],[34.5,29],[33,25],[24.8,22],[24.8,28]];
const IBERIA=[[-8.8,37],[-7,38.6],[-6.6,40.2],[-4,41],[-1,41.2],[0.8,41],[0.7,39],[-1.5,37.6],[-2,36.5],[-5.3,36.1]];
const CATAROS=[[0.3,43.8],[1.5,44.4],[3.1,44.1],[3.3,43.2],[1.8,42.9],[0.5,43]];
const REINO_JER=[[35.62,36.2],[36.05,35],[35.85,33.5],[35.15,32.3],[34.55,31.4],[35.05,31],[35.55,31.8],[35.6,33],[36.3,35],[36.4,36]];
const G_ANAT=[[27.5,40.2],[29,41.6],[34,42],[38,41],[40,40.5],[36,38.5],[31,37],[28,37.5]];
const G_GRECIA=[[20,39.8],[23,41],[26,41],[24,38],[22.5,36.5],[21,38]];
const G_SUL=[[12.4,38],[15.7,38.3],[17,39.5],[18.3,40.3],[16,41.5],[14.5,41.5],[13.2,41.4],[12.5,40],[11.8,38.9]];
const G_NORTE=[[7,44],[8,46],[12,46.8],[13.7,45.8],[13,43.5],[12.2,41.8],[10.2,43],[9,44.2]];
const G_FRANCA=[[-1.5,43.4],[-4.8,48.4],[-1.5,50.2],[2.5,51],[5,49.5],[7.2,48.5],[7.2,45.8],[7,43.8],[3.2,42.8]];
const G_IBERIA=[[-9.3,37],[-9.3,43.6],[-1.8,43.4],[3.3,42],[0.5,39.5],[-2,36.7],[-6,36.2]];
const G_CENTRO=[[8,47.5],[7.5,50.5],[9,51],[12,50],[16,48],[14.5,46.5],[10.5,47]];
const CHAMP=[[2.3,48.3],[3.3,49.2],[5,49.3],[5.6,48.4],[5.2,47.8],[3.2,47.8]];

const TEXTO=[
  'A partir do século XI, na ==Baixa Idade Média==, a Europa cresceu. As grandes migrações tinham acabado, as guerras diminuíram e novas técnicas aumentaram as colheitas: o ==sistema trienal==, que deixava só um terço da terra em descanso, a charrua puxada por cavalos, o adubo e os moinhos de água e de vento, vistos no tópico do feudalismo. Com mais comida, a população cresceu, e sobrou produção para trocar. Mas a terra cultivável não acompanhava tantas bocas, e muitos filhos de nobres ficavam sem herança. A ==expansão== tomou dois caminhos: o militar, com as Cruzadas e a Reconquista, e o comercial, com as feiras e as cidades.',
  'As ==Cruzadas== foram expedições militares e religiosas, apoiadas pela Igreja, para conquistar a ==Terra Santa==, com Jerusalém, e conter o avanço muçulmano sobre Bizâncio. Em 1095, no Concílio de Clermont, o papa Urbano II chamou os cristãos à luta, e a Primeira Cruzada partiu em 1096. Havia fé, mas também interesses: nobres sem herança queriam terras, que faltavam com o aumento da população; Veneza e Gênova queriam lucro; e a Igreja queria canalizar a violência dos cavaleiros para fora da Europa. O mesmo espírito aparecia na Reconquista ibérica, contra os muçulmanos da Península, e na guerra contra os cátaros, considerados hereges, no sul da França.',
  'Foram cinco grandes Cruzadas, entre 1096 e o século XIII. A primeira tomou Jerusalém em 1099 e fundou reinos cristãos no Oriente, defendidos por ordens militares, como a dos templários. Mas Jerusalém não ficou com os cristãos de vez: Saladino a retomou em 1187. Em 1204, na Quarta Cruzada, cruzados saquearam Constantinopla, a capital cristã que deviam ajudar, e aprofundaram a desconfiança entre o Ocidente e Bizâncio. A principal consequência foi ==ligar as rotas comerciais== entre Oriente e Ocidente. Gênova e Veneza lucraram revendendo ==especiarias==, seda e tecidos, e a Europa conheceu mais da cultura árabe, bizantina e grega.',
  'O comércio nunca tinha sumido, mas agora cresceu. Nos séculos XII e XIII, as ==feiras de Champagne==, na França, reuniam mercadores de Flandres, da Itália e da Alemanha, que traziam lã inglesa, especiarias, corantes, peles, linhos e couro. Nas feiras, a moeda e o crédito voltaram a circular: surgiram bancos, empréstimos e notas de crédito. No norte, a ==Liga Hanseática==, aliança de cidades alemãs, dominava o comércio do Báltico e do mar do Norte; no sul, Gênova e Veneza se destacavam no Mediterrâneo. A Igreja defendia o justo preço e condenava a usura, isto é, os ==juros==, porque cobrar pelo tempo seria vender algo que pertence a Deus.',
  'Com o excedente do campo e o comércio, os ==burgos== cresceram junto das rotas, cercados de muralhas para proteger mercadorias e cobrar impostos. Seus moradores, os ==burgueses==, dominavam o comércio e, em muitas cidades, a política. Era um mundo diferente do feudo: ali circulava dinheiro, e não só proteção e trabalho. Um ditado dizia: ==o ar da cidade liberta==, porque um servo que fugisse para a cidade e não fosse reclamado podia ficar livre. Muitas cidades compraram ou conquistaram dos senhores cartas de franquia, que lhes davam autonomia, justiça e administração próprias. Eram pequenas pelos padrões de hoje, mas atraíam gente, riqueza e ideias.',
  'Os mercadores se uniam em ==guildas==, que conseguiam isenções e controlavam preços; algumas viraram potências políticas, como em Paris e Rouen. Os artesãos formavam as ==corporações de ofício==: cada ofício, como tecelões, padeiros ou ferreiros, tinha estatutos com regras sobre qualidade, preço, quantidade e quem podia trabalhar. Isso limitava a concorrência e garantia um produto confiável, e as corporações ainda ajudavam membros doentes ou pobres. A produção era organizada pelo mestre, dono da oficina e das ferramentas, com oficiais, que recebiam salário, e aprendizes, que aprendiam o ofício. Subir de aprendiz a mestre era difícil, e as regras rígidas, mais tarde, freariam as novidades.',
  'A expansão teve um preço. Para plantar mais, desmataram florestas, drenaram pântanos e esgotaram o solo, e a população ficou frágil diante de qualquer falha na colheita. Entre 1315 e 1317, chuvas intensas destruíram colheitas e veio a ==Grande Fome==, com preços altos, doenças e muitas mortes. As minas de prata também se esgotaram, e faltou moeda. Para manter a renda, os senhores ==aumentaram a exploração== dos camponeses, com mais cobranças e mais trabalho. Começava a ==crise do feudalismo==, que não foi igual em toda parte nem aconteceu de uma vez; na França, por exemplo, os privilégios feudais só acabaram em 1789.',
  'Em 1347, a ==Peste Negra== chegou aos portos da Europa e, em 1348, se espalhou. Era causada pela bactéria ==Yersinia pestis==, levada por pulgas de ratos; na forma bubônica, a doença vinha da picada da pulga, e na forma pneumônica o contágio era respiratório. Ela viajou pelas rotas comerciais, e cidades como Paris, Florença, Veneza e Hamburgo perderam metade ou mais dos moradores. Morreram cerca de 20 milhões de pessoas, ==um em cada três europeus==, segundo o historiador Geoffrey Blainey; estimativas recentes são maiores. A escassez de alimentos virou escassez de mão de obra.',
  'Com tantas mortes, faltou ==mão de obra==, e os camponeses que sobraram passaram a exigir mais: salários maiores e menos obrigações. Os senhores reagiram com mais cobranças e com leis para segurar os salários, e vieram as ==revoltas camponesas==: as jacqueries, na França, de Jacques Bonhomme, o João Ninguém, em 1358, e, na Inglaterra, o levante de Wat Tyler e John Ball, em 1381. Houve destruição de propriedades e mortes de nobres, e a reação da aristocracia foi violenta. A nobreza esmagou as revoltas, mas saiu enfraquecida. Isso abriu espaço para o ==fortalecimento do poder dos reis==, apoiados pela burguesia.'
];

// rotas no mapa do Mediterrâneo, em pixels da base (lidos na própria imagem, com grade)
const R_ALEX=[[810,478],[700,435],[620,400],[560,375],[500,372],[458,340],[440,305],[445,270],[452,235],[430,195],[405,172],[396,162]];
const R_ACRE=[[918,440],[880,420],[800,418],[740,420],[690,418],[640,395],[605,370],[590,330],[588,290],[578,262],[560,235],[545,210],[515,180],[488,155],[470,141]];
const R_CP=[[790,254],[765,255],[745,270],[722,300],[716,340],[706,370],[672,388],[640,382],[612,364],[596,330],[592,290],[582,262],[564,236],[549,211],[519,180],[492,154],[473,141]];
const R_PESTE1=[[905,141],[890,170],[860,200],[830,225],[805,240],[795,248],[765,255],[745,270],[722,300],[716,340],[706,368],[690,382],[650,392],[600,380],[560,350],[545,335],[534,326]];
const R_PESTE2=[[534,326],[505,305],[470,285],[450,240],[428,203],[400,186],[370,183],[340,186],[328,187]];

// ---- camadas do mapa do Mediterrâneo
const camadasMed=[
  {tipo:'rotulo',ll:true,p:[1.2,38.2],texto:'Mar Mediterrâneo',classe:'mar',tam:.55,etapas:[1,2,7]},
  // ===== etapa 2 (1) e 3 (2): as terras muçulmanas, as Cruzadas e a Reconquista
  {tipo:'regiao',ll:true,terra:true,pts:MUC_A,suave:false,cor:'#8a8a3a',opac:.62,etapas:[1,2],atraso:A(700)},
  {tipo:'regiao',ll:true,terra:true,pts:MUC_B,suave:false,cor:'#8a8a3a',opac:.62,etapas:[1,2],atraso:A(900)},
  {tipo:'etiqueta',ll:true,p:TM([38.6,39.4],[37.6,39.2]),texto:'terras muçulmanas',tam:TM(.46,.4),etapas:[1],atraso:A(1500),cor:'#d8d89a'},
  {tipo:'regiao',ll:true,terra:true,pts:IBERIA,suave:false,estilo:'listra',etapas:[1],atraso:A(14500)},
  {tipo:'regiao',ll:true,terra:true,pts:CATAROS,suave:false,estilo:'listra',etapas:[1],atraso:A(21500)},
  {tipo:'etiqueta',ll:true,p:TM([-8.8,35.1],[-9.6,35.2]),texto:'Reconquista',tam:TM(.46,.4),etapas:[1],atraso:A(15300),cor:'amarelo'},
  {tipo:'etiqueta',ll:true,p:TM([3.8,43.0],[3.8,43.2]),texto:'cátaros',tam:TM(.46,.4),etapas:[1],atraso:A(22000),cor:'amarelo'},
  {tipo:'cidade',p:[915,470],nome:'Jerusalém',capital:true,tam:TM(.5,.42),lado:'d',etapas:[1,2],atraso:A(2200)},
  {tipo:'cidade',p:[793,248],nome:'Constantinopla',capital:true,tam:TM(.5,.42),lado:'e',etapas:[1,2],atraso:A(1800)},
  {tipo:'etiqueta',p:TM([150,16],[110,16]),texto:'França, Alemanha, Itália',tam:TM(.42,.4),etapas:[1],atraso:A(3500)},
  // ===== etapa 3 (2): Jerusalém muda de mãos, Constantinopla é saqueada, as rotas se ligam (pontos em pixels da base, lidos na própria imagem)
  {tipo:'regiao',ll:true,terra:true,pts:REINO_JER,suave:false,cor:'#e8572a',opac:.92,mistura:false,etapas:[2],atraso:A(4000),dura:A(5200)},
  {tipo:'etiqueta',ll:true,p:TM([36.8,34.2],[36.5,34.3]),texto:'1099: cruzados',tam:TM(.44,.4),etapas:[2],atraso:A(4400),dura:A(4800),cor:'#f2a794'},
  {tipo:'regiao',ll:true,terra:true,pts:REINO_JER,suave:false,cor:'#8a8a3a',opac:.95,etapas:[2],atraso:A(10400)},
  {tipo:'etiqueta',ll:true,p:TM([36.8,34.2],[36.5,34.3]),texto:'1187: Saladino',tam:TM(.44,.4),etapas:[2],atraso:A(10800),cor:'#d8d89a'},
  {tipo:'cidade',p:[920,442],nome:'Acre',tam:.4,lado:'d',etapas:[2],atraso:A(18000)},
  {tipo:'cidade',p:[807,486],nome:'Alexandria',tam:.4,lado:'e',etapas:[2],atraso:A(18400)},
  {tipo:'cidade',p:[463,137],nome:'Veneza',tam:TM(.44,.4),lado:'d',etapas:[2],atraso:A(18800)},
  {tipo:'cidade',p:[394,160],nome:'Gênova',tam:TM(.44,.4),lado:'e',etapas:[2],atraso:A(19200)},
  {tipo:'rota',pts:R_ALEX,movel:'barco',tam:TM(1.6,1.5),volta:15000,largura:3,etapas:[2],atraso:A(19800)},
  {tipo:'rota',pts:R_ACRE,movel:'barco',tam:TM(1.6,1.5),volta:17000,largura:3,etapas:[2],atraso:A(20300)},
  {tipo:'rota',pts:R_CP,movel:'barco',tam:TM(1.6,1.5),volta:19000,largura:3,etapas:[2],atraso:A(20800)},
  // ===== etapa 8 (7): a peste chega de navio, pelo Mar Negro, e anda pelas rotas
  {tipo:'cidade',p:[905,139],nome:'Caffa',sub:'Crimeia',tam:TM(.46,.4),lado:'e',etapas:[7],atraso:A(800)},
  {tipo:'cidade',p:[531,325],nome:'Messina',tam:TM(.46,.4),lado:'d',etapas:[7],atraso:A(8200)},
  {tipo:'cidade',p:[326,184],nome:'Marselha',tam:TM(.46,.4),lado:'e',etapas:[7],atraso:A(10600)},
  {tipo:'pulso',pts:R_PESTE1,largura:TM(48,42),cor:'#7a7a80',etapas:[7],atraso:A(2200)},
  {tipo:'rota',pts:R_PESTE1,invisivel:true,movel:'barco',tam:TM(1.7,1.5),volta:9000,etapas:[7],atraso:A(1800)},
  {tipo:'pulso',pts:R_PESTE2,largura:TM(48,42),cor:'#7a7a80',etapas:[7],atraso:A(9200)},
  {tipo:'regiao',ll:true,terra:true,pts:G_ANAT,suave:false,cor:'#6f6f74',opac:.85,etapas:[7],atraso:A(4000)},
  {tipo:'regiao',ll:true,terra:true,pts:G_GRECIA,suave:false,cor:'#6f6f74',opac:.85,etapas:[7],atraso:A(6000)},
  {tipo:'regiao',ll:true,terra:true,pts:G_SUL,suave:false,cor:'#6f6f74',opac:.85,etapas:[7],atraso:A(9000)},
  {tipo:'regiao',ll:true,terra:true,pts:G_NORTE,suave:false,cor:'#6f6f74',opac:.85,etapas:[7],atraso:A(12000)},
  {tipo:'regiao',ll:true,terra:true,pts:G_FRANCA,suave:false,cor:'#6f6f74',opac:.85,etapas:[7],atraso:A(14000)},
  {tipo:'regiao',ll:true,terra:true,pts:G_IBERIA,suave:false,cor:'#6f6f74',opac:.85,etapas:[7],atraso:A(16000)},
  {tipo:'regiao',ll:true,terra:true,pts:G_CENTRO,suave:false,cor:'#6f6f74',opac:.85,etapas:[7],atraso:A(18000)},
  {tipo:'etiqueta',ll:true,p:TM([29.5,46.4],[33.5,47.6]),texto:'1347',tam:TM(.5,.46),etapas:[7],atraso:A(1500),cor:'amarelo'},
  {tipo:'etiqueta',ll:true,p:TM([8.6,41.2],[7.6,40.2]),texto:'1347 e 1348',tam:TM(.46,.42),etapas:[7],atraso:A(11500),cor:'amarelo'},
  {tipo:'etiqueta',ll:true,p:TM([17,49.4],[14,50.4]),texto:'até 1351',tam:TM(.46,.42),etapas:[7],atraso:A(19000),cor:'amarelo'}
];
// cargas que chegam a Veneza e a Gênova (etapa 3): três recortes de especiarias e tecidos
const CARGAS=[['pimenta',6.0,47.2,'pimenta',22500],['canela',9.4,47.2,'canela',24500],['seda',12.8,47.2,'seda',26500]];

// ---- camadas do mapa-múndi
const HANSA='#2f6f7a';
// rota de feira: um fio de tinta por baixo e um traço amarelo tracejado por cima (o halo do motor seria grosso demais na Europa)
const rotaF=(pts,cor,at,mov,vl)=>{const o=[{tipo:'rota',ll:true,pts:pts,estilo:'fronteira',cor:'tinta',largura:TM(1.5,1.6),tracejada:false,etapas:[3],atraso:A(at)},
  {tipo:'rota',ll:true,pts:pts,estilo:'fronteira',cor:cor,largura:TM(.9,1),tracejada:true,etapas:[3],atraso:A(at)}];
  if(mov)o.push({tipo:'rota',ll:true,pts:pts,invisivel:true,movel:mov,tam:mov==='barco'?TM(.3,.3):TM(.22,.22),volta:vl||6000,etapas:[3],atraso:A(at)});return o;};
const LB=TM(.15,.19);
const camadasMun=[].concat(
  // ===== etapa 4 (3): Champagne, rotas das feiras, Hansa e Mediterrâneo
  [{tipo:'regiao',ll:true,terra:true,pts:CHAMP,suave:false,cor:'#e8572a',opac:.92,mistura:false,etapas:[3],atraso:A(1500)},
  {tipo:'pontos',ll:true,pts:[[2.7,48.87],[3.3,48.56],[4.08,48.3],[4.7,48.23]],tam:TM(.2,.22),cor:'tinta',etapas:[3],atraso:A(2600)},
  {tipo:'etiqueta',ll:true,p:TM([-8.6,47.2],[-12,46.4]),texto:'Champagne',sub:'quatro feiras',tam:LB,etapas:[3],atraso:A(3000),cor:'#f2a794'}],
  rotaF([[3.2,51.2],[3.7,49.9],[4.0,48.7]],'#ffd83d',4200,'ponto',5200),
  rotaF([[9.2,45.5],[7.2,46.5],[5.6,47.6],[4.5,48.2]],'#ffd83d',5000,'ponto',6200),
  rotaF([[8.7,50.1],[6.6,49.6],[5.2,49.0],[4.4,48.6]],'#ffd83d',5800,'ponto',5600),
  [{tipo:'etiqueta',ll:true,p:TM([-6.8,52.6],[-14,51.6]),texto:'Flandres',tam:LB,etapas:[3],atraso:A(4400)},
  {tipo:'etiqueta',ll:true,p:TM([9.8,44.6],[11,43.9]),texto:'Itália',tam:LB,etapas:[3],atraso:A(5200)},
  {tipo:'etiqueta',ll:true,p:TM([8.6,48.6],[9.6,48.2]),texto:'Alemanha',tam:LB,etapas:[3],atraso:A(6000)}],
  // Hansa: rota azul petróleo no mar do Norte e no Báltico
  rotaF([[-0.1,51.5],[2.6,52.6],[5.6,54.2],[8.2,54.1],[9.9,53.7]],'#7fc8d0',12000,'ponto',6400),
  rotaF([[10.9,54.0],[12.8,54.7],[15.4,55.3],[17.4,56.8],[18.3,57.6],[21.5,57.3],[24.1,57.0]],'#7fc8d0',13500,'ponto',7200),
  rotaF([[18.3,57.6],[19.1,55.6],[18.65,54.35]],'#7fc8d0',14800),
  [{tipo:'cidade',ll:true,p:[10.7,53.9],nome:'Lübeck',tam:LB,lado:'d',etapas:[3],atraso:A(14000)},
  {tipo:'cidade',ll:true,p:[9.9,53.55],nome:'Hamburgo',tam:LB,lado:'e',etapas:[3],atraso:A(13200)},
  {tipo:'cidade',ll:true,p:[18.65,54.35],nome:'Danzig',tam:LB,lado:'d',etapas:[3],atraso:A(15200)},
  {tipo:'cidade',ll:true,p:[24.1,56.95],nome:'Riga',tam:LB,lado:'d',etapas:[3],atraso:A(15600)},
  {tipo:'etiqueta',ll:true,p:TM([-3,60.4],[-12,59.4]),texto:'Liga Hanseática',tam:LB,etapas:[3],atraso:A(12400),cor:'#9fd0d3'}],
  // sul: Gênova e Veneza
  rotaF([[12.3,45.2],[14,43],[17,39.6],[20,37],[24,35.6],[28.8,36.8],[29.2,40.8]],'#ffd83d',21000,'barco',12000),
  rotaF([[8.9,44.2],[9.5,42.6],[11,40.2],[14,38],[18,36],[24,34.6],[29.6,31.4]],'#ffd83d',21800,'barco',13000),
  [{tipo:'etiqueta',ll:true,p:TM([20.5,44.6],[17.5,45.2]),texto:'Veneza e Gênova',tam:LB,etapas:[3],atraso:A(22000),cor:'amarelo'},
  // ===== etapa 9 (8): pontos de revolta na França e na Inglaterra
  {tipo:'pontos',ll:true,pts:[[2.4,49.2]],tam:TM(.5,.5),cor:'seta',etapas:[8],atraso:A(2500)},
  {tipo:'etiqueta',ll:true,p:TM([4.4,48.3],[4,47.4]),texto:'Jacquerie, 1358',tam:LB,etapas:[8],atraso:A(3000),cor:'#f2a794'},
  {tipo:'pontos',ll:true,pts:[[0.6,51.6]],tam:TM(.5,.5),cor:'seta',etapas:[8],atraso:A(5200)},
  {tipo:'etiqueta',ll:true,p:TM([-10.5,52.8],[-14,53.4]),texto:'Wat Tyler, 1381',tam:LB,etapas:[8],atraso:A(5700),cor:'#f2a794'}]
);

// ---- fita do tempo (régua fora de escala)
const marcos=[
  {p:4,t:'século XI',s:'a Europa cresce',d:0,etapa:0},
  {p:13,t:'1096 a 1099',s:'Primeira Cruzada',d:1,etapa:[1,2]},
  {p:22,t:'XII e XIII',s:'feiras de Champagne',d:3,etapa:3},
  {p:31,t:'1150 a 1330',s:'apogeu urbano',d:4,etapa:[4,5]},
  {p:40,t:'1187',s:'Saladino retoma Jerusalém',d:2,etapa:2},
  {p:49,t:'1204',s:'saque de Constantinopla',d:2,etapa:2},
  {p:58,t:'1315 a 1317',s:'Grande Fome',d:6,etapa:6},
  {p:67,t:'1347 e 1348',s:'Peste Negra',d:7,etapa:7},
  {p:76,t:'1358',s:'Jacquerie',d:8,etapa:8},
  {p:85,t:'1381',s:'revolta inglesa',d:8,etapa:8},
  {p:94,t:'século XV',s:'fim da Idade Média',d:8,etapa:8}
];

// zonas da mesa (canto superior esquerdo de cada uma)
const Z1=[1400,3800],Z5=[1400,6500],Z6=[4900,6500],Z7=[8300,6500],Z7b=[8300,7800],Z8=[1400,9500],Z9=[5300,9500];
const ZF=(z,x,y,w,h)=>[z[0]+x,z[1]+y,w,h];
const LOCAL_CAST=Mm(915,470),LOCAL_CP=Mm(793,248);

Colagem.montar({
  modulo:'Módulo 2: Idade Média e início da Idade Moderna',
  titulo:'Cruzadas, cidades e crise',
  subtitulo:'A Europa cresce, comercia, adoece e muda',
  credito:'Os mapas usam bases geradas por IA, as mesmas do restante da História. Recortes, esquemas, camadas e fita do tempo são desenhados em código pelo LAB.',
  ritmo:10000,
  celularGrande:true,
  msPalavra:250,
  mesa:{w:11800,h:10800},
  enem:`Cai a ligação entre Cruzadas, comércio com o Oriente, feiras e cidades, e o papel da burguesia e das corporações de ofício. Na crise do século XIV, o ENEM cobra a soma de fome, peste e revoltas e a consequência: falta de mão de obra, enfraquecimento da nobreza e fortalecimento dos reis. Pegadinhas: a cidade medieval não nasceu "contra" o feudo, porque dependia do campo; as Cruzadas não foram só religiosas; e a crise não foi igual em toda a Europa.`,
  estudo:[
  {titulo:'Uma Europa que cresce',texto:`A Idade Média vai de 476, com a queda do Império Romano do Ocidente, ao fim do século XV. A Alta Idade Média (séculos V a X) foi o tempo de formação do feudalismo. A Baixa Idade Média (séculos XI a XV) viu o auge e, depois, a crise desse sistema. A partir do século XI, as migrações acabaram e as guerras ficaram mais limitadas. Novas técnicas, como o sistema trienal, a charrua puxada por cavalos, o adubo e os moinhos de água e de vento, aumentaram a produção. Com mais comida, a população cresceu e os feudos avançaram sobre florestas e pântanos. Surgiu assim uma pressão por terras e, ao mesmo tempo, um excedente agrícola que podia ser trocado. Dessa combinação saíram duas expansões: a militar, nas Cruzadas, e a comercial e urbana.`},
  {titulo:'As Cruzadas',texto:`As Cruzadas, entre os séculos XI e XIII, foram expedições militares e religiosas para tomar Jerusalém, a Terra Santa, dos muçulmanos. O imperador bizantino, ameaçado pelos turcos, pediu ajuda ao Ocidente. Em 1095, no Concílio de Clermont, o papa Urbano II convocou os cristãos, e a Primeira Cruzada partiu em 1096. A fé era real, mas não era o único motivo. Nobres sem herança buscavam terras e prestígio. Veneza e Gênova buscavam lucro com o transporte e o comércio. E a Igreja queria ampliar sua autoridade e dirigir a violência dos cavaleiros para fora da Europa.

A Primeira Cruzada tomou Jerusalém em 1099 e criou reinos cristãos no Oriente, defendidos por ordens militares como a dos templários. Em 1187, Saladino retomou a cidade, e a Terceira Cruzada, da qual participou Ricardo Coração de Leão, não a recuperou. Em 1204, a Quarta Cruzada saqueou Constantinopla, uma cidade cristã, o que aprofundou a desconfiança entre Ocidente e Bizâncio. Muitos livros falam em cinco grandes Cruzadas; outros contam oito ou nove, somando expedições menores. De todo modo, Jerusalém não foi conquistada de forma definitiva.

O espírito de cruzada apareceu também em outras frentes: a Reconquista da Península Ibérica contra os muçulmanos, que terminou em 1492, com a queda de Granada, e a guerra contra os cátaros, considerados hereges, no sul da França, a partir de 1209.`},
  {titulo:'O que as Cruzadas mudaram',texto:`A principal consequência foi ligar as rotas comerciais entre Oriente e Ocidente. Gênova e Veneza lucraram transportando cruzados e revendendo especiarias, seda e tecidos, e o Mediterrâneo voltou a ser um eixo de comércio. Os europeus conheceram melhor a cultura árabe, a bizantina e a grega. Houve também efeitos sobre a nobreza: parte dela se arruinou ou morreu na guerra, e alguns servos ganharam liberdade, por fuga ou por compra. Na outra ponta, o saque de 1204 enfraqueceu Bizâncio.`},
  {titulo:'Renascimento comercial e urbano',texto:`O comércio nunca desapareceu da Idade Média: havia cidades ligadas à Igreja, feiras e romarias. Mas o excedente agrícola e o contato com o Oriente o fizeram crescer. Nos séculos XII e XIII, as feiras de Champagne, na França, reuniam mercadores de Flandres, de Gênova, de Veneza e da Alemanha, com lã inglesa, especiarias, corantes, peles, linhos e couro. Circulavam também grãos, vinho, sal, tecidos, metais e madeira. Surgiram bancos, empréstimos e notas de crédito. No norte, a Liga Hanseática dominava o Báltico. A Igreja condenava os juros e defendia o justo preço.

Nas rotas, cresceram os burgos, cercados de muralhas. Os burgueses controlavam o comércio e, em muitas cidades, a política; compravam ou conquistavam autonomia diante dos senhores. O ditado "o ar da cidade liberta" resume um costume: em muitos lugares, o servo que vivesse na cidade por um ano e um dia, sem ser reclamado, ficava livre. O apogeu urbano se deu entre 1150 e 1330, segundo Jacques Le Goff. As maiores cidades tinham até 40 mil habitantes e dependiam do campo, ou seja, a cidade não nasceu contra o feudo. Nelas surgiram as universidades, controladas no início pela Igreja; a primeira foi a de Bolonha, em 1088.

Os mercadores se organizaram em guildas, que obtinham isenções e controlavam preços. Os artesãos formaram as corporações de ofício, com regras sobre qualidade, preço e recrutamento, que limitavam a concorrência e davam assistência aos membros. Em cada oficina havia o mestre, os oficiais e os aprendizes. Eram instituições urbanas e protegiam seus membros, mas também restringiam a livre concorrência.`},
  {titulo:'A crise do século XIV',texto:`A crise do feudalismo teve causas que se somaram. A expansão anterior (desmatamento, drenagem de pântanos, esgotamento do solo) causou impacto ambiental, e a população já era grande demais para uma agricultura ainda pouco produtiva. Entre 1315 e 1317, chuvas intensas destruíram as colheitas e veio a Grande Fome. As minas de prata se esgotaram, e faltou moeda. Os senhores, para manter a renda, aumentaram a exploração dos camponeses.

Em 1347, a Peste Negra chegou à Europa pelos portos, vinda do Mar Negro, e se espalhou em 1348. Foi causada pela bactéria Yersinia pestis, transmitida por pulgas de ratos; na forma pneumônica, o contágio era respiratório. A doença não era nova: havia sido epidêmica no século VI, desaparecera e voltou no século XIV. Cidades como Paris, Florença, Veneza e Hamburgo perderam metade ou mais dos moradores. Morreram cerca de 20 milhões de pessoas, um em cada três europeus, segundo o historiador Geoffrey Blainey. Cuidado: a máscara com bico de pássaro, associada ao "médico da peste", é do século XVII, e não desse período. Soma-se a Guerra dos Cem Anos entre França e Inglaterra (1337 a 1453), que interrompeu a centralização francesa e trouxe derrotas, fome e impostos.`},
  {titulo:'Revoltas e fortalecimento dos reis',texto:`A escassez de alimentos virou escassez de mão de obra. Os camponeses sobreviventes passaram a exigir mais, e os senhores reagiram aumentando a exploração. Vieram as revoltas: as jacqueries, na França, em 1358, nomeadas por Jacques Bonhomme, o "João Ninguém", e, na Inglaterra, o levante liderado por Wat Tyler e John Ball, em 1381. Houve destruição de propriedades e assassinato de nobres, e a reação aristocrática foi violenta. A nobreza venceu, mas ficou enfraquecida.

Já a burguesia sofreu menos com a crise. Os comerciantes atraíam mão de obra, emprestavam dinheiro a nobres e queriam acabar com os particularismos feudais: pedágios, pesos, medidas e moedas diferentes em cada senhorio. A centralização trazia mercados unificados e proteção contra produtos estrangeiros. Nobreza em dificuldades e burguesia em ascensão tinham, portanto, interesse na centralização monárquica. É o caminho para os Estados Nacionais, o tema do próximo módulo. Lembre que a crise não foi igual em toda a Europa nem aconteceu de uma só vez.`}
  ],
  resumo:[
  'A partir do século XI, técnicas agrícolas e fim das migrações levaram ao crescimento da população e da produção.',
  'As Cruzadas (1096 em diante) misturaram fé, busca de terras, lucro das cidades italianas e interesse da Igreja.',
  'Jerusalém foi tomada em 1099 e retomada por Saladino em 1187; em 1204, Constantinopla foi saqueada.',
  'A principal consequência das Cruzadas foi ligar as rotas comerciais entre Oriente e Ocidente.',
  'Feiras (Champagne), bancos, burgos e burgueses formaram o renascimento comercial e urbano.',
  'Guildas reuniam mercadores; corporações de ofício reuniam artesãos, com mestre, oficial e aprendiz.',
  'Crise: esgotamento do solo e das minas, Grande Fome (1315 a 1317), Peste Negra (1347 e 1348) e guerra.',
  'A Peste Negra matou cerca de um terço dos europeus (Blainey), e a falta de mão de obra fortaleceu os camponeses.',
  'Revoltas camponesas (1358 e 1381) foram reprimidas, mas enfraqueceram a nobreza.',
  'Nobreza enfraquecida e burguesia em ascensão abriram caminho à centralização, nos reis.'
  ],
  urca:`Não há ligação histórica direta entre as Cruzadas, a Peste Negra e o Ceará ou o Cariri. A ligação é indireta: a crise do feudalismo, a aliança entre reis e burgueses e o espírito de cruzada ajudam a explicar por que Portugal, que se centralizou cedo, se lançou ao mar e colonizou o Brasil, onde o Ceará foi ocupado mais tarde. Estude este tópico como base para Estados Nacionais e Expansão Marítima, no módulo 3.`,

  pecas:[
    // ---- mapas
    {id:'med',tipo:'mapa',base:BM,x:MXM,y:0,w:4128,h:2304,rotulo:'Mapa do Mediterrâneo e do Oriente Próximo: Jerusalém, Constantinopla, as rotas italianas e o caminho da peste',camadas:camadasMed},
    {id:'mun',tipo:'mapa',base:BW,x:MXW,y:0,w:4128,h:2304,rotulo:'Mapa-múndi com zoom na Europa: Champagne, a Liga Hanseática e as revoltas camponesas na França e na Inglaterra',camadas:camadasMun},
    {id:'tempo',tipo:'tempo',grande:true,gg:true,prog:true,x:TLX,y:TLY,w:TLW,h:190,giro:.2,avisoEt:'1,2,3,4,5,6,7,8',aviso:'régua fora de escala',marcos:marcos},

    // ---- etapa 1: a Europa volta a crescer (mesa de colagem, abaixo dos mapas)
    {id:'trienal',tipo:'trienal',x:Z1[0],y:Z1[1],w:1100,h:960,rotulo:'Sistema trienal: três campos que giram entre trigo, legumes e descanso'},
    {id:'et-t1',tipo:'etiqueta',fs:50,x:Z1[0],y:Z1[1]+1000,w:1100,h:110,clicavel:false,atraso:A(1500),texto:'visto no tópico 2'},
    {id:'moinho',tipo:'icone',nome:'moinho-vento',x:Z1[0]+1220,y:Z1[1]+30,w:330,h:330,atraso:A(2200),rotulo:'Moinho de vento'},
    {id:'et-t2',tipo:'etiqueta',fs:50,x:Z1[0]+1150,y:Z1[1]+390,w:470,h:110,clicavel:false,atraso:A(2800),texto:'visto no tópico 2'},
    {id:'bifurca',tipo:'bifurca',x:Z1[0]+1800,y:Z1[1],w:1500,h:960,atraso:A(6000),rotulo:'Uma estrada que se bifurca: um caminho leva às Cruzadas; o outro, ao comércio e às cidades'},
    {id:'grafpop',tipo:'grafpop',x:Z1[0]+3450,y:Z1[1],w:1550,h:960,atraso:A(15000),rotulo:'Gráfico de linha da população europeia, sempre subindo, a partir do século XI'},
    {id:'fitaim',tipo:'fitaim',x:Z1[0],y:Z1[1]+1300,w:1700,h:900,atraso:A(24000),rotulo:'Faixas da Idade Média, Alta e Baixa, com um alfinete no século XI'},
    {id:'n-1',tipo:'nota',fs:50,x:Z1[0]+1860,y:Z1[1]+1410,w:1260,giro:-1,atraso:A(31000),texto:'A Idade Média vai de 476 ao fim do século XV.'},

    // ---- etapa 2: por que as Cruzadas
    {id:'balanca',tipo:'balanca5',x:100,y:200,w:1200,h:900,atraso:A(9500),rotulo:'Uma balança em equilíbrio: fé de um lado; terras, lucro e aventura do outro'},
    {id:'alvo',tipo:'alvo',x:LOCAL_CAST[0]-60,y:LOCAL_CAST[1]-60,w:120,h:120,atraso:A(3200),rotulo:'Ponto de Jerusalém'},

    // ---- etapa 3: o que as Cruzadas mudaram
    {id:'n-3a',tipo:'nota',fs:46,x:100,y:300,w:1200,giro:-1,atraso:A(26000),texto:'Também enfraqueceram parte da nobreza e ajudaram a libertar servos.'},
    {id:'n-3b',tipo:'nota',fs:46,x:100,y:760,w:1200,giro:1,atraso:A(31000),texto:'Além das cinco grandes, houve outras expedições menores; alguns livros contam oito ou nove.'},
    {id:'xv',tipo:'xvermelho',x:LOCAL_CP[0]-100,y:LOCAL_CP[1]-100,w:200,h:200,atraso:A(14500),rotulo:'X vermelho sobre Constantinopla: o saque de 1204'}
  ].concat(CARGAS.map((c,i)=>{const q=MLm(c[1],c[2]);return {id:'cg'+i,tipo:'icone',nome:c[3],x:q[0]-110,y:q[1]-110,w:220,h:220,giro:(i-1)*3,atraso:A(c[4]),rotulo:'Recorte: '+c[3]};})).concat([

    // ---- etapa 4: feiras, moedas e hansas (cargas e crédito ao lado do mapa-múndi)
    {id:'credito',tipo:'credito',x:7900,y:2650,w:1100,h:640,giro:-1.2,atraso:A(21000),rotulo:'Nota de crédito desenhada em código'},
    {id:'et-juro',tipo:'etiqueta',fs:46,x:7900,y:3360,w:1100,h:210,clicavel:false,atraso:A(25500),texto:'juro: lucro sobre o tempo, e o tempo, para a Igreja, era de Deus'},
    {id:'c-peixe',tipo:'icone',nome:'peixe',x:9150,y:2650,w:250,h:250,giro:-2,atraso:A(16500),rotulo:'Recorte: peixe'},
    {id:'c-tora',tipo:'icone',nome:'tora',x:9420,y:2650,w:250,h:250,giro:2,atraso:A(17000),rotulo:'Recorte: toras de madeira'},
    {id:'c-trigo',tipo:'icone',nome:'feixe-trigo',x:9690,y:2650,w:250,h:250,giro:-1,atraso:A(17500),rotulo:'Recorte: feixe de trigo'},
    {id:'c-pele',tipo:'icone',nome:'pele',x:9960,y:2650,w:250,h:250,giro:2,atraso:A(18000),rotulo:'Recorte: pele de animal'},
    {id:'et-cargas',tipo:'etiqueta',fs:46,x:9150,y:2950,w:1060,h:110,clicavel:false,atraso:A(18500),texto:'peixe, madeira, cereais e peles'},

    // ---- etapa 5: o ar da cidade liberta
    {id:'cidade',tipo:'cidade',x:Z5[0],y:Z5[1],w:1500,h:1400,atraso:A(300),rotulo:'Cidade medieval cercada de muralhas, vista de cima'},
    {id:'selo',tipo:'icone',nome:'selo-cera',x:Z5[0]+1700,y:Z5[1],w:380,h:380,giro:3,atraso:A(16000),rotulo:'Recorte: selo de cera da cidade'},
    {id:'et-selo',tipo:'etiqueta',fs:50,x:Z5[0]+1650,y:Z5[1]+400,w:800,h:200,clicavel:false,atraso:A(17000),texto:'selo da cidade: símbolo da autonomia'},
    {id:'n-5a',tipo:'nota',fs:50,x:Z5[0]+2200,y:Z5[1],w:780,giro:1.2,atraso:A(22000),texto:'Apogeu das cidades: 1150 a 1330, segundo Jacques Le Goff.'},
    {id:'n-5b',tipo:'nota',fs:50,x:Z5[0]+1650,y:Z5[1]+720,w:1300,giro:-1,atraso:A(27000),texto:'As maiores tinham até 40 mil habitantes e dependiam do campo.'},
    {id:'n-5c',tipo:'nota',fs:50,x:Z5[0]+1650,y:Z5[1]+1140,w:1300,giro:.8,atraso:A(32000),texto:'Nas cidades nasceram as universidades, para formar funcionários, controladas no início pela Igreja. A primeira foi a de Bolonha, em 1088.'},

    // ---- etapa 6: guildas e corporações de ofício
    {id:'oficina',tipo:'oficina',x:Z6[0],y:Z6[1],w:1600,h:1040,atraso:A(300),rotulo:'Oficina com mestre, oficial e aprendiz ligados por uma escada de três degraus'},
    {id:'brasoes',tipo:'brasoes',x:Z6[0]+1750,y:Z6[1],w:1300,h:700,giro:-1,atraso:A(16000),rotulo:'Três brasões de ofício presos por uma fita: tesoura, pão e martelo'},
    {id:'n-6',tipo:'nota',fs:52,x:Z6[0]+1750,y:Z6[1]+800,w:1300,giro:1,atraso:A(24000),texto:'Corporação: regras rígidas, pouca concorrência.'},
    {id:'et-gui',tipo:'etiqueta',fs:50,x:Z6[0]+1750,y:Z6[1]+1060,w:630,h:120,clicavel:false,atraso:A(27500),texto:'guilda: mercadores'},
    {id:'et-cor',tipo:'etiqueta',fs:50,x:Z6[0]+2420,y:Z6[1]+1060,w:630,h:120,clicavel:false,atraso:A(28200),texto:'corporação: artesãos'},

    // ---- etapa 7: a fome do século XIV
    {id:'chuva',tipo:'campochuva',x:Z7[0],y:Z7[1],w:1300,h:900,atraso:A(2000),rotulo:'Campo debaixo de chuva forte, que vai ficando cinza'},
    {id:'mina',tipo:'icone',nome:'mina-seca',x:Z7[0]+1450,y:Z7[1],w:340,h:340,giro:-2,atraso:A(14000),rotulo:'Recorte: entrada de mina riscada por um X vermelho'},
    {id:'moeda',tipo:'icone',nome:'moeda-rachada',x:Z7[0]+1900,y:Z7[1],w:340,h:340,giro:2,atraso:A(16000),rotulo:'Recorte: moeda de prata rachada'},
    {id:'et-mina',tipo:'etiqueta',fs:50,x:Z7[0]+1400,y:Z7[1]+370,w:440,h:130,clicavel:false,atraso:A(15000),texto:'minas esgotadas'},
    {id:'et-moeda',tipo:'etiqueta',fs:50,x:Z7[0]+1870,y:Z7[1]+370,w:420,h:130,clicavel:false,atraso:A(17000),texto:'falta de moeda'},
    {id:'explora',tipo:'exploracao',x:Z7b[0],y:Z7b[1],w:1400,h:900,atraso:A(22000),rotulo:'Uma seta vermelha desce do castelo para a aldeia: mais impostos e trabalho'},
    {id:'n-7',tipo:'nota',fs:52,x:Z7b[0]+1500,y:Z7b[1]+150,w:1150,giro:1,atraso:A(32000),texto:'Na França, privilégios feudais só acabaram em 1789.'},

    // ---- etapa 8: a Peste Negra
    {id:'enterro',tipo:'enterro',x:Z8[0],y:Z8[1],w:1300,h:860,atraso:A(300),rotulo:'Recorte em tinta: caixões em fileira, figuras de capuz e pás'},
    {id:'doc',tipo:'fonte',grande:true,x:Z8[0]+1450,y:Z8[1]-100,w:720,h:1040,giro:.8,atraso:A(26000),rotulo:'Fonte histórica: Boccaccio, Decamerão, sobre a peste em Florença',
     texto:'“Como os cemitérios não bastavam para tantos corpos, abriram-se grandes valas, onde os mortos que chegavam às centenas eram empilhados em camadas, como mercadoria no porão de um navio, e cobertos com um pouco de terra, até a vala encher.”',
     ref:'Giovanni Boccaccio, Decamerão, introdução à Primeira Jornada (escrito por volta de 1349 a 1353), sobre a peste em Florença, em 1348. Paráfrase da equipe, a partir do italiano e da tradução de Rigg (1903, domínio público).',
     resposta:'O ==tamanho da mortandade== e o colapso dos costumes: não havia mais enterro individual nem ritual cristão completo, e os corpos eram tratados como carga. A comparação com mercadoria vem de alguém que vivia numa cidade de comerciantes. Boccaccio era florentino e viveu a peste, mas escreveu uma obra literária, e outros números que ele dá, como mais de cem mil mortos em Florença, são exagerados.'},
    {id:'tres',tipo:'trescada',x:Z8[0]+2350,y:Z8[1],w:1300,h:700,giro:-.6,atraso:A(18000),rotulo:'Nove bonequinhos em três grupos: em cada grupo, um some'},
    {id:'n-8',tipo:'nota',fs:52,x:Z8[0]+2350,y:Z8[1]+780,w:1300,giro:1,atraso:A(33000),texto:'O médico com máscara de bico é do século XVII, não da Peste Negra.'},

    // ---- etapa 9: revoltas e reis mais fortes
    {id:'bal',tipo:'balancacamp',x:Z9[0],y:Z9[1],w:1300,h:900,atraso:A(300),rotulo:'Balança que passa a pesar para o lado dos camponeses'},
    {id:'cast9',tipo:'castelo9',x:Z9[0]+1500,y:Z9[1],w:1300,h:1000,atraso:A(14000),rotulo:'Castelo em tinta com forcado e foice cruzados, chamas laranja e uma coroa de papel que cresce'},
    {id:'et-prox',tipo:'etiqueta',fs:56,x:Z9[0]+2950,y:Z9[1]+200,w:1150,h:140,clicavel:false,atraso:A(34000),texto:'Próximo: Estados Nacionais'},
    {id:'n-9',tipo:'nota',fs:52,x:Z9[0]+2950,y:Z9[1]+600,w:1150,giro:-1,atraso:A(37000),texto:'Também houve guerra: a dos Cem Anos, entre França e Inglaterra, de 1337 a 1453.'}
  ]),

  etapas:[
    {titulo:'A Europa volta a crescer',so:['trienal','et-t1','moinho','et-t2','bifurca','grafpop','fitaim','n-1'],
     foco:ZF(Z1,-70,-70,3500,1500),focoM:ZF(Z1,-40,-60,1180,1200),
     tomadas:[[8500,ZF(Z1,1750,-70,1600,1040)],[16500,ZF(Z1,3400,-70,1700,1040)],[24500,ZF(Z1,-70,1230,3500,1050)],[32500,ZF(Z1,1800,1330,1400,320)]],
     tomadasM:[[7000,ZF(Z1,1100,-20,640,640)],[12000,ZF(Z1,1750,-70,1560,1040)],[20500,ZF(Z1,3430,-70,1600,1040)],[29000,ZF(Z1,-50,1240,1500,980)],[36000,ZF(Z1,1840,1330,1300,300)]],tempo:46000,
     tracos:[{tipo:'seta',de:{peca:'trienal',x:100,y:66},para:{peca:'bifurca',x:1,y:56},cor:'tinta',espessura:7,ponta:30,curva:.12,atraso:A(5200)},
             {tipo:'seta',de:{peca:'moinho',x:100,y:50},para:{peca:'bifurca',x:3,y:48},cor:'tinta',espessura:7,ponta:30,curva:-.1,atraso:A(5600)}],
     texto:TEXTO[0]},
    {titulo:'Por que as Cruzadas',mostra:['med','tempo'],so:['balanca','alvo'],
     foco:Fm(23,40,700),focoM:Fmc(26,38,280),
     tomadas:[[8500,[60,160,1340,1000]],[14000,Fm(-2,40.5,330)],[20500,Fm(2.5,44,250)],[27500,TL(13,1500)]],
     tomadasM:[[9000,[80,170,1240,1000]],[14000,Fmc(-3,40.5,150)],[20500,Fmc(2,44.5,130)],[27500,TL(13,760)]],tempo:46000,
     tracos:[{tipo:'seta',de:Mm(262,56),para:Mm(900,458),cor:'seta',espessura:11,ponta:44,curva:-.12,atraso:A(4200)},
             {tipo:'seta',de:Mm(423,40),para:Mm(778,244),cor:'seta',espessura:11,ponta:44,curva:.1,atraso:A(5400)},
             {tipo:'seta',de:Mm(402,134),para:Mm(782,252),cor:'seta',espessura:11,ponta:44,curva:.18,atraso:A(6600)},
             {tipo:'circulo',peca:'alvo',x:50,y:50,w:100,h:100,atraso:A(3400)}],
     texto:TEXTO[1]},
    {titulo:'O que as Cruzadas mudaram',so:['xv','n-3a','n-3b'].concat(CARGAS.map((c,i)=>'cg'+i)),
     foco:Fm(23,38,700),focoM:Fmc(31,34.5,230),
     tomadas:[[3500,Fm(35,34,300)],[14000,Fm(29.5,40.8,300)],[17500,Fm(19,38.5,760)],[25500,Fm(9.5,45.5,330)],[28500,[60,220,1340,1000]],[34500,TL(45,1700)]],
     tomadasM:[[3500,Fmc(34,33.5,125)],[13500,Fmc(29.5,40.8,140)],[17500,Fmc(19,37,300)],[25500,Fmc(9.5,45.5,150)],[28500,[80,220,1240,1000]],[34500,TL(45,760)]],tempo:48000,
     texto:TEXTO[2]},
    {titulo:'Feiras, moedas e hansas',mostra:['mun'],so:['credito','et-juro','c-peixe','c-tora','c-trigo','c-pele','et-cargas'],
     foco:Fw(8,50,270),focoM:Fwc(4,49.5,120),
     tomadas:[[4000,Fw(4,49,200)],[11500,Fw(14,55,200)],[16000,[9100,2580,1180,520]],[20500,[7850,2600,1200,1000]],[27000,TL(22,1700)]],
     tomadasM:[[4000,Fwc(4,49,115)],[11500,Fwc(14,55.5,125)],[16500,[9100,2580,1180,520]],[21000,[7880,2640,1160,1000]],[27500,TL(22,760)]],tempo:48000,
     texto:TEXTO[3]},
    {titulo:'O ar da cidade liberta',so:['cidade','selo','et-selo','n-5a','n-5b','n-5c'],
     foco:ZF(Z5,-60,-60,3100,1520),focoM:ZF(Z5,-40,-60,1580,1500),
     tomadas:[[13500,ZF(Z5,1620,-60,1500,720)],[21000,ZF(Z5,1620,-60,1500,720)],[26000,ZF(Z5,1600,640,1500,600)],[31000,ZF(Z5,1600,1060,1500,500)],[37000,TL(31,1500)]],
     tomadasM:[[11000,ZF(Z5,1620,-30,1260,640)],[21000,ZF(Z5,2150,-30,880,380)],[26000,ZF(Z5,1640,650,1280,300)],[31000,ZF(Z5,1640,1070,1280,500)],[37000,TL(31,760)]],tempo:48000,
     texto:TEXTO[4]},
    {titulo:'Guildas e corporações de ofício',so:['oficina','brasoes','n-6','et-gui','et-cor'],
     foco:ZF(Z6,-70,-60,3200,1300),focoM:ZF(Z6,-30,-30,800,640),
     tomadas:[[7000,ZF(Z6,-30,-30,1700,1100)],[15500,ZF(Z6,1700,-60,1400,780)],[23500,ZF(Z6,1700,740,1400,540)],[37000,TL(31,1500)]],
     tomadasM:[[7000,ZF(Z6,-30,330,800,700)],[11000,ZF(Z6,350,230,900,780)],[14500,ZF(Z6,760,180,860,820)],[18000,ZF(Z6,1700,-30,1400,780)],[24000,ZF(Z6,1700,760,1400,500)],[37000,TL(31,760)]],tempo:46000,
     texto:TEXTO[5]},
    {titulo:'A fome do século XIV',so:['chuva','mina','moeda','et-mina','et-moeda','explora','n-7','grafpop'],
     foco:ZF(Z1,3400,-70,1700,1040),focoM:ZF(Z1,3430,-70,1600,1040),
     tomadas:[[7000,ZF(Z7,-50,-50,1400,980)],[13500,ZF(Z7,1380,-50,1000,640)],[21000,ZF(Z7b,-50,-50,1500,980)],[31000,ZF(Z7b,1450,50,1250,500)],[36500,TL(58,1500)]],
     tomadasM:[[7000,ZF(Z7,-40,-40,1360,960)],[14000,ZF(Z7,1380,-40,1000,700)],[21000,ZF(Z7b,-40,-40,1450,980)],[32000,ZF(Z7b,1450,60,1250,400)],[36500,TL(58,760)]],tempo:46000,
     texto:TEXTO[6]},
    {titulo:'A Peste Negra',so:['enterro','doc','tres','n-8','grafpop'],fonte:'doc',
     foco:Fm(20,41,720),focoM:Fmc(32,43.5,160),
     tomadas:[[5000,ZF(Z8,-40,-40,1420,980)],[9000,Fm(13,39.5,500)],[14500,Fm(5,44,400)],[18000,ZF(Z8,2300,-50,1400,800)],[25500,ZF(Z8,1400,-140,780,1140)],[32500,ZF(Z8,2300,700,1400,240)],[36000,ZF(Z1,3400,-70,1700,1040)],[42000,TL(67,1500)]],
     tomadasM:[[5000,ZF(Z8,-40,-40,1320,920)],[9000,Fmc(16,38.5,200)],[14500,Fmc(7,43,160)],[18000,ZF(Z8,2330,-50,1340,740)],[25500,ZF(Z8,1420,-140,760,1120)],[33000,ZF(Z8,2330,740,1340,200)],[36500,ZF(Z1,3430,-70,1600,1040)],[42000,TL(67,760)]],tempo:52000,
     tracos:[{tipo:'circulo',peca:'enterro',x:36,y:76,w:56,h:40,cor:'seta',espessura:10,atraso:A(5800)}],
     texto:TEXTO[7]},
    {titulo:'Revoltas e reis mais fortes',so:['bal','cast9','et-prox','n-9','grafpop'],
     foco:Fw(4,50,270),focoM:Fwc(2,50.5,125),
     tomadas:[[4000,Fw(2,50.5,190)],[9000,ZF(Z9,-50,-50,1400,1000)],[16500,ZF(Z9,1450,-50,1400,1100)],[33000,ZF(Z9,1450,-50,2700,1100)],[40000,TL(88,1700)]],
     tomadasM:[[4000,Fwc(2,50.5,115)],[9000,ZF(Z9,-50,-50,1400,1000)],[16500,ZF(Z9,1450,-50,1400,1100)],[33000,ZF(Z9,2900,150,1250,700)],[40000,TL(88,760)]],tempo:48000,
     tracos:[{tipo:'seta',de:{peca:'cast9',x:41,y:8},para:{peca:'et-prox',x:2,y:50},cor:'tinta',espessura:9,ponta:36,curva:.2,atraso:A(34800)}],
     texto:TEXTO[8]}
  ]
});
})();
