/* Módulo 2, tópico 4: Reinos africanos (Gana, Mali e Songhai). Roteiro revisado: docs/revisao-historia/m02-t04-reinos-africanos.md
   Formato dos dados: docs/historia/MOTOR.md. Recortes e esquemas próprios: recortes-m02d.js (carregado depois de recortes.js).
   Mapa-múndi (historia-mapa-mundo, 1376 x 768): os pontos usam longitude e latitude (ll:true), calibradas no motor com erro de até cerca de 6 px.
   A peça do mapa tem escala 2 na mesa (2752 x 1536). Zoom moderado: a base é uma imagem de 1376 px, e a câmera nunca passa de cerca de 3 pixels de tela por pixel da base no desktop.
   As regiões usam terra:true: a mancha é recortada pela costa da própria base, então polígonos podem passar um pouco para o mar.
   Mesa em zonas: mapa (topo), zona direita do mapa (mesquita, Mansa Musa e fonte, cauri), fita do tempo com três faixas (embaixo do mapa),
   mulheres e linhagens (mapinha, árvore, candace, comparação) e máscaras, arte e griô (embaixo). */
(function(){
const A=n=>Colagem.reduz?0:n;
const BASE='historia-mapa-mundo',S=2;
const LL=(lon,lat)=>Colagem.lonlat(BASE,lon,lat);
const M=(x,y)=>[Math.round(x*S),Math.round(y*S)];
const ML=(lon,lat)=>{const q=LL(lon,lat);return M(q[0],q[1]);};
const FB=(cx,cy,w,asp)=>{const h=w/asp;return [Math.round((cx-w/2)*S),Math.round((cy-h/2)*S),Math.round(w*S),Math.round(h*S)];};
const FD=(cx,cy,w)=>FB(cx,cy,w,1.47);   // enquadra no mapa (desktop), em pixels da base
const FMo=(cx,cy,w)=>FB(cx,cy,w,.66);   // enquadra no mapa (celular)
const WORLD=[0,0,2752,1536];
const AF=FD(715,432,570),AFm=FMo(712,432,272);         // a África toda
const WA=FD(648,372,280),WAm=FMo(608,378,190);         // África Ocidental
const WA2=FD(636,374,262),WA2m=FMo(606,380,180);
const RT=FD(690,336,370),RTm=FMo(662,345,282);         // rotas pelo Saara
const RT5=FD(705,345,420),RT5m=FMo(712,350,280);       // rota até Meca
const RT6=FD(655,352,330),RT6m=FMo(652,345,190);       // Songhai, de ponta a ponta
const Z=(x,y,w,h)=>[x,y,w,h];
// tomadas: lista de [ms, quadro no desktop, quadro no celular]; a primeira é o quadro de partida
const BT=l=>({foco:l[0][1],focoM:l[0][2]||l[0][1],tomadas:l.slice(1).map(b=>[b[0],b[1]]),tomadasM:l.slice(1).map(b=>[b[0],b[2]||b[1]])});

// ---- regiões (longitude e latitude)
const SAARA=[[-17,21],[-15,26],[-13,27.5],[-9,28.8],[-5,29.8],[0,30.2],[5,31],[9,31.5],[10,30.5],[14,29.8],[18,29.6],[23,30.5],[26,29.6],[30,28.8],[32.5,28.8],[32.5,23],[35,23],[36,19],[30,17.8],[24,16.2],[16,15.6],[8,16.6],[0,17.2],[-8,17],[-14,17.5],[-17.5,18]];
const NORTE=[[-17,27.5],[-13,27.5],[-9,28.8],[-5,29.8],[0,30.2],[5,31],[9,31.5],[10,30.5],[14,29.8],[18,29.6],[23,30.5],[26,29.6],[30,28.8],[32.6,28.8],[32.6,31.7],[30,31.8],[25,32.8],[23,33.4],[20,33.8],[15,34.2],[11.5,35.5],[10.8,37.6],[5,37.2],[0,36.4],[-3,35.5],[-5.8,35.8],[-7,35.5],[-10,34]];
const SAHEL=[[-17.5,17.5],[-8,17.2],[0,17.5],[8,16.8],[15,16],[23,16.3],[30,17.5],[36,17.5],[36,12.8],[30,11.8],[22,11],[15,10.6],[8,11.8],[0,11.4],[-8,11.2],[-12.5,12],[-17,12.5]];
const SUBSAARA=[[-18,12.3],[-12.5,11.8],[-8,11],[0,11],[8,11.6],[15,10.4],[22,10.8],[30,11.6],[36,12.5],[41,12.2],[43,11.6],[60,11.6],[60,-45],[-20,-45],[-20,12.3]];
const BANTOS=[[9,4],[17,4.5],[27,4],[33,2.5],[40,-1],[44,-8],[42,-18],[36,-26],[32,-34],[22,-35],[19,-26],[18,-19],[9,-17],[7,-5]];
const SUDANESES=[[-17,13],[-8,12.8],[0,12.5],[10,12.8],[20,12],[30,12.5],[34,11],[33,8.5],[22,8],[12,7.5],[2,7.5],[-8,8.5],[-13,9.5],[-16,11]];
const FLORESTA=[[11,3],[17,4],[25,3.5],[29,1],[29,-3],[24,-5],[17,-4],[12,-2]];
const NILOTAS=[[29,4],[34,4.5],[35,9],[32,11.5],[29,10.5],[28,7]];
const KHOIKHOI=[[13,-20],[20,-20],[24,-24],[22,-34.5],[18,-34],[15,-29],[14,-24]];
const BERBERES=[[-12,30.5],[-8,32],[-2,34],[4,36],[10,35],[14,33],[16,29],[11,25],[4,23],[-4,25],[-9,26.5]];
const GANA=[[-12.5,15.2],[-12,17.8],[-8,18.4],[-4,17.2],[-4,14.3],[-7.5,13.8],[-11.5,13.6]];
const GANA_RECUA=[[-11,15.5],[-10.5,17.4],[-8,17.8],[-5,16.8],[-5,14.8],[-8,14.5]];
const MALI=[[-11.5,10.8],[-12,14.5],[-9,16.5],[-3,17.4],[-1,15.5],[-2.5,11.8],[-6,10.4]];
const MALI_ATL=[[-17.2,12.5],[-17,15.5],[-14,17.5],[-8,18.2],[-3,17.6],[0.5,16.5],[0.8,14.5],[-1.8,11.8],[-6,10.2],[-12,10.2],[-15,11.2]];
const SONGHAI=[[-17,19],[-12,18.5],[-7,18.5],[-3,19.6],[1,19.8],[4,17.5],[9,16.5],[14,16.5],[15,11],[9,9.8],[3,10.5],[-2,10.3],[-6,10],[-11,10.8],[-17,12]];
// ---- rios (longitude e latitude)
const NIGER=[[-10.7,9],[-10.2,10.4],[-9,11.4],[-8,12.6],[-6.3,13.4],[-4.9,14.2],[-4.2,15.2],[-3,16.7],[-1.2,16.9],[-0.05,16.2],[1.3,15.5],[2.1,13.5],[3.3,11.9],[4.8,9.1],[6.7,7.8],[6.2,5.5]];
const SENEGAL=[[-10.7,11.5],[-11.4,13.2],[-12.45,14.9],[-13.3,15.65],[-14.5,16.55],[-15.5,16.6],[-16.4,16.1]];
// ---- rotas transaarianas (linhas retas de ponto a ponto, para o camelo andar certo)
const R1=[[-8,15.8],[-11,17.7],[-8,21],[-5,23.6],[-4.5,27],[-4.3,31.3]];                    // Kumbi Saleh, Audagoste, Taghaza e Sijilmasa
const R2=[[-8,15.8],[-3,16.8],[3,16.9],[8,17],[10.2,25.1],[13.2,32.9]];                     // Kumbi Saleh, Tombuctu, Agadez, Ghat e Trípoli
const R3=[[8,17],[12.9,18.7],[23.3,24.2],[25.5,29.2],[31.2,30]];                            // Agadez, Bilma, Kufra, Siwa e Cairo
const RHAJJ=[[-9,11.4],[-6.9,17.3],[0.3,27.7],[9.5,30.1],[21.3,29.1],[25.5,29.2],[31.2,30],[32.55,29.97],[35,29.5],[39.6,24.5],[39.8,21.4]]; // Niani, Walata, Tuat, Ghadames, Awjila, Siwa, Cairo, Suez, Aqaba, Medina e Meca
const rev=a=>a.slice().reverse();

// pontilhado do Saara: pontos sorteados (sempre os mesmos) dentro do polígono, só ao sul de 19 graus N em diante
const SAARA_PONTOS=(function(){const r=Colagem.rng('saara'),o=[];for(let i=0;i<260;i++){o.push([-16+r()*50,19+r()*11]);}
  return o.filter(q=>{let d=false;for(let i=0,j=SAARA.length-1;i<SAARA.length;j=i++){const a=SAARA[i],b=SAARA[j];if(((a[1]>q[1])!==(b[1]>q[1]))&&(q[0]<(b[0]-a[0])*(q[1]-a[1])/(b[1]-a[1])+a[0]))d=!d;}return d;});})();

Colagem.montar({
  modulo:'Módulo 2: Idade Média e início da Idade Moderna',
  titulo:'Reinos africanos',
  subtitulo:'Gana, Mali e Songhai, e uma África de muitos povos',
  credito:'Mapa: base do mundo, com regiões, rios, rotas e etiquetas desenhadas pelo LAB. A figura de Mansa Musa é uma recriação inspirada no estilo do Atlas Catalão, feita por IA, sem copiar o mapa original. Recortes e esquemas desenhados em código.',
  ritmo:9000,
  msPalavra:250,
  celularGrande:true,
  mesa:{w:4800,h:6200},
  enem:`O ENEM usa os reinos de ==Gana==, ==Mali== e ==Songhai== para combater a visão da África como continente sem história, ligando-os ao ==comércio transaariano== de ouro e sal, ao islamismo e a Tombuctu como centro de saber. Também cobra a diversidade cultural.

Pegadinhas:
- Achar que o antigo reino de Gana ficava no Gana atual.
- Tratar a África como uma coisa só.
- Confundir a escravidão que já existia na África com o tráfico atlântico, que veio depois.
- Ler "matrilinear" como "governo das mulheres".`,
  urca:`Aqui há ligação real. A ==Lei 10.639/2003== tornou obrigatório o ensino de história e cultura afro-brasileira e africana nas escolas, e por isso o tema faz parte do currículo escolar. A herança africana está no vocabulário (caçula, moleque, quitute, fubá, quiabo), na culinária (vatapá, acarajé, angu) e nas religiões afro-brasileiras.

No Ceará, a história da escravidão marcou a abolição: o estado libertou seus escravizados em 1884, antes do restante do país, depois da greve dos jangadeiros de 1881, liderada por Francisco José do Nascimento, o ==Dragão do Mar==, em Fortaleza.

Sobre a prova da URCA em si, não há o que afirmar: estude os reinos, o comércio e a diversidade.`,
  estudo:[
  {titulo:'Uma África de muitos povos',texto:`A África não é um país nem uma cultura só. Hoje tem 54 países, e a diversidade de línguas, religiões e modos de vida é enorme. O **Saara** ocupa cerca de um terço do continente. Ao norte fica a **África Setentrional**, de clima desértico, que recebeu os árabes e o islamismo desde o século VII. Ao sul fica a **África Subsaariana**, a maior parte do continente. Entre as duas está o **Sahel**, "borda do deserto".

Os livros costumam agrupar os povos por língua e modo de vida, numa classificação antiga e simplificada: **bantos** (o grupo mais numeroso, com centenas de povos), sudaneses (agricultores das savanas), caçadores e coletores da floresta equatorial, nilotas, khoikhoi e **berberes**. Cada grupo reúne povos diferentes.`},
  {titulo:'O comércio transaariano',texto:`O Saara não foi só uma barreira. Depois que o **camelo** foi domesticado, caravanas passaram a cruzar o deserto levando **sal** e outros produtos do norte (tecidos, cavalos, tâmaras) e trazendo **ouro** do sul. O ouro vinha de minas ao sul, em regiões como Bambuk e Buré, e quem controlava as rotas e cobrava taxas enriquecia. Os reinos do Sahel e da savana ocidental cresceram assim, e o islamismo chegou com os mercadores árabes e berberes.`},
  {titulo:'Gana, o reino do ouro',texto:`O reino de **Gana** surgiu, segundo os livros, por volta do século III (muitos historiadores preferem datas posteriores), entre os rios Níger e Senegal, nos atuais Mali e Mauritânia. Não é o Gana atual, que fica mais ao sul, na costa. Os **soninquês** o formaram para se proteger de nômades.

O rei controlava e taxava o comércio do ouro, e a capital era **Kumbi Saleh**; Audagoste era um centro comercial. O apogeu foi entre os séculos VII e IX. O declínio, nos séculos XI e XII, veio do esgotamento do ouro, de revoltas e da pressão de outros povos.`},
  {titulo:'Mali, Sundiata e Mansa Musa',texto:`No século XIII, por volta de 1235, **Sundiata Keita** venceu os sossos e fundou o **Mali**, com capital em Niani, na bacia do Níger. Os governantes se chamavam **mansas**, "reis dos reis". O islamismo, trazido pelo comércio, conviveu com as crenças tradicionais, e **Tombuctu** virou um grande centro de estudo, com mesquitas e bibliotecas de milhares de manuscritos.

O apogeu foi com **Mansa Musa**, que levou o império até o Atlântico. Em 1324 e 1325, fez uma **peregrinação a Meca** com enorme comitiva e distribuiu tanto ouro no Cairo que, segundo o cronista al-Umari, o preço do metal caiu. Sua fama chegou à Europa: o Atlas Catalão (1375) o retrata com uma pepita de ouro na mão. Depois de sua morte, o Mali declinou e foi superado pelos Songhai.`},
  {titulo:'Songhai',texto:`O **Songhai** era um reino antigo, com centro em **Gao**, e virou império com **Sonni Ali Ber**, a partir de 1464. Tomou Tombuctu (1468) e Djenné (1473), controlou o rio Níger e se estendeu por mais de 2 mil quilômetros, do Atlântico ao lago Chade. A moeda principal era o **cauri**, concha usada da África à China; ouro e sal também eram referência.

Havia trabalho escravo e cidades de estudo, como a Universidade de Sankore, que teria reunido cerca de 25 mil estudantes. Em 1591, foi derrotado por um exército marroquino com armas de fogo (batalha de Tondibi). A pressão europeia e o desvio do comércio para as rotas do Atlântico contribuíram para o declínio.`},
  {titulo:'Mulheres, arte e tradição oral',texto:`Em muitas sociedades africanas, as mulheres tinham poder que a Europa patriarcal negava. Entre os macua (norte de Moçambique), a sociedade era **matrilinear**: o parentesco, a herança e a descendência seguiam a linha da mãe. Isso não significa que as mulheres governavam, e sim que o parentesco era contado pelo lado materno. Na Núbia, as **candaces** eram rainhas com papel em cerimônias, diplomacia e exércitos. Entre os iorubás, a mãe tinha poderes considerados divinos.

Na arte, não há "uma arte africana": cada povo criava cerâmicas, estatuetas e **máscaras**, ligadas a rituais de guerra, nascimento, colheita e morte. A sociedade Gelede, dos iorubás, é presidida por mulheres. A máscara de marfim da rainha Idia, do reino de Benim, é um exemplo conhecido. Os colonizadores trataram essas peças como curiosidade de museu. A **tradição oral** guardava a memória, nas mãos dos **griôs**, contadores de histórias com música e dança.`}
  ],
  resumo:[
  'A África tem 54 países e muitos povos; o Saara ocupa cerca de um terço, e o Sahel é sua borda.',
  'Há a África Setentrional (árabe e islâmica desde o século VII) e a Subsaariana.',
  'O comércio transaariano, com camelos, trocava ouro do sul por sal do norte.',
  'Gana: soninquês, controle e taxação do ouro, capital Kumbi Saleh, apogeu nos séculos VII a IX; não é o Gana atual.',
  'Mali: Sundiata Keita (cerca de 1235), mansas, Niani, Tombuctu; Mansa Musa e a peregrinação de 1324 e 1325.',
  'Songhai: Sonni Ali Ber, Gao, Tombuctu (1468) e Djenné (1473); cauri; derrota em 1591.',
  'Matrilinear: parentesco pela linha da mãe; candaces na Núbia.',
  'Não há uma só arte africana; griôs guardam a tradição oral.'
  ],

  pecas:[
    // ================= o mapa: Mundo, com a África no centro
    {id:'mapa',tipo:'mapa',base:BASE,x:0,y:0,w:1376*S,h:768*S,clicavel:false,ate:5,rotulo:'Mapa-múndi com foco na África, do Sahel ao Saara, com os rios Níger e Senegal, os reinos de Gana, Mali e Songhai e as rotas transaarianas',camadas:[
      // ===== etapa 1 (0): uma África, muitas Áfricas
      {tipo:'regiao',ll:true,pts:SAARA,suave:false,terra:true,cor:'#e6cd92',opac:.8,etapas:[0],atraso:A(3800)},
      {tipo:'pontos',ll:true,pts:SAARA_PONTOS,cor:'#a9843c',tam:.22,etapas:[0],atraso:A(4200)},
      {tipo:'etiqueta',ll:true,p:[-8,26],texto:'Saara',sub:'cerca de um terço do continente',tam:.42,etapas:[0],atraso:A(4600)},
      {tipo:'regiao',ll:true,pts:NORTE,suave:false,terra:true,cor:'#e8572a',opac:.62,etapas:[0],atraso:A(9000)},
      {tipo:'etiqueta',ll:true,p:[0,41.2],texto:'África Setentrional',tam:.42,etapas:[0],atraso:A(9600)},
      {tipo:'regiao',ll:true,pts:SAHEL,estilo:'listra',suave:false,terra:true,etapas:[0],atraso:A(14000)},
      {tipo:'etiqueta',ll:true,p:[10,15],texto:'Sahel',sub:'borda do deserto',tam:.42,etapas:[0],atraso:A(14600)},
      {tipo:'regiao',ll:true,pts:SUBSAARA,suave:false,terra:true,cor:'#ec6f5e',opac:.34,etapas:[0],atraso:A(19000)},
      {tipo:'etiqueta',ll:true,p:[14,-6],texto:'África Subsaariana',tam:.42,etapas:[0],atraso:A(19600)},
      // ===== etapa 2 (1): muitos povos
      {tipo:'regiao',ll:true,pts:BANTOS,suave:false,terra:true,cor:'#e8572a',opac:.5,etapas:[1],atraso:A(800)},
      {tipo:'etiqueta',ll:true,p:[20,-14],texto:'bantos',tam:.46,etapas:[1],atraso:A(1500)},
      {tipo:'regiao',ll:true,pts:SUDANESES,suave:false,terra:true,cor:'#f2c230',opac:.62,etapas:[1],atraso:A(4800)},
      {tipo:'etiqueta',ll:true,p:[-8,5.4],texto:'sudaneses',tam:.46,etapas:[1],atraso:A(5500)},
      {tipo:'regiao',ll:true,pts:FLORESTA,suave:false,terra:true,cor:'#4f9a58',opac:.62,etapas:[1],atraso:A(8800)},
      {tipo:'etiqueta',ll:true,p:[3,-1],texto:'povos da floresta',sub:'equatorial',tam:.4,etapas:[1],atraso:A(9500)},
      {tipo:'regiao',ll:true,pts:NILOTAS,suave:false,terra:true,cor:'#3d8fd6',opac:.55,etapas:[1],atraso:A(12800)},
      {tipo:'etiqueta',ll:true,p:[36,6],texto:'nilotas',tam:.46,etapas:[1],atraso:A(13500)},
      {tipo:'regiao',ll:true,pts:KHOIKHOI,suave:false,terra:true,cor:'#9b6fb0',opac:.55,etapas:[1],atraso:A(16800)},
      {tipo:'etiqueta',ll:true,p:[24,-28],texto:'khoikhoi',tam:.46,etapas:[1],atraso:A(17500)},
      {tipo:'regiao',ll:true,pts:BERBERES,suave:false,terra:true,cor:'#d8923a',opac:.55,etapas:[1],atraso:A(20800)},
      {tipo:'etiqueta',ll:true,p:[-6,27.6],texto:'berberes',tam:.46,etapas:[1],atraso:A(21500)},
      // ===== etapa 3 (2): Gana, o reino do ouro (os rios ficam até a etapa 6)
      {tipo:'rota',ll:true,pts:NIGER,estilo:'rio',largura:2.4,etapas:[2,3,4,5],atraso:A(500),dur:1.8},
      {tipo:'rota',ll:true,pts:SENEGAL,estilo:'rio',largura:2.4,etapas:[2,3,4,5],atraso:A(1300),dur:1.2},
      {tipo:'rotulo',ll:true,p:[0.8,12],texto:'rio Níger',classe:'regiao',tam:.33,giro:8,etapas:[2,3,4,5],atraso:A(2200)},
      {tipo:'rotulo',ll:true,p:[-17.2,13],texto:'rio Senegal',classe:'regiao',tam:.38,giro:-30,etapas:[2],atraso:A(2400)},
      {tipo:'regiao',ll:true,pts:GANA,suave:false,terra:true,cor:'#e8572a',opac:.62,etapas:[2],atraso:A(5100)},
      {tipo:'etiqueta',ll:true,p:[-7,21.8],texto:'Gana',tam:.33,etapas:[2],atraso:A(5700)},
      {tipo:'cidade',ll:true,p:[-8,15.8],nome:'Kumbi Saleh',capital:true,lado:'d',tam:.33,etapas:[2],atraso:A(6000)},
      {tipo:'cidade',ll:true,p:[-11,17.7],nome:'Audagoste',lado:'e',tam:.33,etapas:[2],atraso:A(6400)},
      {tipo:'cidade',ll:true,p:[-11.3,13.3],nome:'ouro de Bambuk',lado:'e',tam:.33,etapas:[2],atraso:A(6800)},
      {tipo:'cidade',ll:true,p:[-9.8,11.2],nome:'ouro de Buré',lado:'d',tam:.33,etapas:[2],atraso:A(7000)},
      {tipo:'rota',ll:true,pts:R1,suave:false,largura:2.6,etapas:[2],atraso:A(13600),dur:1.4},
      {tipo:'rota',ll:true,pts:R2,suave:false,largura:2.6,etapas:[2],atraso:A(14000),dur:1.6},
      {tipo:'rota',ll:true,pts:R3,suave:false,largura:2.6,etapas:[2],atraso:A(14400),dur:1.6},
      {tipo:'cidade',ll:true,p:[-4.3,31.3],nome:'Sijilmasa',lado:'e',tam:.33,etapas:[2],atraso:A(14800)},
      {tipo:'cidade',ll:true,p:[-4.9,23.6],nome:'sal de Taghaza',lado:'e',tam:.33,etapas:[2],atraso:A(14900)},
      {tipo:'cidade',ll:true,p:[13.2,32.9],nome:'Trípoli',lado:'d',tam:.33,etapas:[2],atraso:A(15000)},
      {tipo:'cidade',ll:true,p:[31.2,30],nome:'Cairo',lado:'e',tam:.33,etapas:[2],atraso:A(15100)},
      {tipo:'rotulo',ll:true,p:[1,22.4],texto:'Saara',classe:'regiao',tam:.34,giro:-4,etapas:[2],atraso:A(18600)},
      // ===== etapa 4 (3): Mali e os mansas
      {tipo:'regiao',ll:true,pts:GANA_RECUA,suave:false,terra:true,cor:'#e8572a',opac:.3,etapas:[3],atraso:A(400)},
      {tipo:'rotulo',ll:true,p:[-13.5,19.6],texto:'Gana, em declínio',classe:'regiao',tam:.28,giro:-6,etapas:[3],atraso:A(1000)},
      {tipo:'regiao',ll:true,pts:MALI,suave:false,terra:true,cor:'#e8572a',opac:.66,etapas:[3],atraso:A(1400)},
      {tipo:'etiqueta',ll:true,p:[-8.6,14.9],texto:'Mali',tam:.34,etapas:[3],atraso:A(2000)},
      {tipo:'cidade',ll:true,p:[-9,11.4],nome:'Niani',capital:true,lado:'e',tam:.33,etapas:[3],atraso:A(5100)},
      {tipo:'cidade',ll:true,p:[-3,16.8],nome:'Tombuctu',lado:'d',tam:.33,etapas:[3],atraso:A(5600)},
      // ===== etapa 5 (4): Mansa Musa, o Mali até o Atlântico e a peregrinação
      {tipo:'regiao',ll:true,pts:MALI_ATL,suave:false,terra:true,cor:'#e8572a',opac:.66,etapas:[4],atraso:A(600)},
      {tipo:'etiqueta',ll:true,p:[-16,8.8],texto:'Mali',tam:.34,etapas:[4],atraso:A(1200)},
      {tipo:'cidade',ll:true,p:[-9,11.4],nome:'Niani',lado:'d',tam:.32,etapas:[4],atraso:A(1600)},
      {tipo:'cidade',ll:true,p:[-3,16.8],nome:'Tombuctu',lado:'d',tam:.32,etapas:[4],atraso:A(1900)},
      {tipo:'rota',ll:true,pts:RHAJJ,suave:false,largura:2.8,movel:'ponto',tam:.34,volta:9000,etapas:[4],atraso:A(5100),dur:2.4},
      {tipo:'cidade',ll:true,p:[31.2,30],nome:'Cairo',lado:'e',tam:.32,etapas:[4],atraso:A(5600)},
      {tipo:'cidade',ll:true,p:[39.8,21.4],nome:'Meca',lado:'d',tam:.32,etapas:[4],atraso:A(6000)},
      {tipo:'etiqueta',ll:true,p:[14,22.6],texto:'1324 e 1325',tam:.34,cor:'amarelo',etapas:[4],atraso:A(6300)},
      // ===== etapa 6 (5): Songhai
      {tipo:'regiao',ll:true,pts:MALI,suave:false,terra:true,estilo:'listra',etapas:[5],atraso:A(300)},
      {tipo:'rotulo',ll:true,p:[-17,19.8],texto:'Mali, em declínio',classe:'regiao',tam:.28,etapas:[5],atraso:A(1000)},
      {tipo:'regiao',ll:true,pts:SONGHAI,suave:false,terra:true,cor:'#e8572a',opac:.62,etapas:[5],atraso:A(1400)},
      {tipo:'etiqueta',ll:true,p:[3.4,11.9],texto:'Songhai',tam:.34,etapas:[5],atraso:A(2200)},
      {tipo:'cidade',ll:true,p:[-0.05,16.27],nome:'Gao',capital:true,lado:'d',tam:.33,etapas:[5],atraso:A(5000)},
      {tipo:'cidade',ll:true,p:[-3,16.8],nome:'Tombuctu',lado:'e',tam:.33,etapas:[5],atraso:A(5400)},
      {tipo:'cidade',ll:true,p:[-4.55,13.4],nome:'Djenné',lado:'e',tam:.33,etapas:[5],atraso:A(5800)},
      {tipo:'etiqueta',ll:true,p:[10.8,13.4],texto:'lago Chade',tam:.33,etapas:[5],atraso:A(6200)},
      {tipo:'etiqueta',ll:true,p:[-12,34.6],texto:'Marrocos',tam:.34,etapas:[5],atraso:A(24200)}
    ]},
    // ícones, setas, régua e círculos sobre o mapa
    {id:'itens',tipo:'mapitens',x:0,y:0,w:1376*S,h:768*S,clicavel:false,ate:5,rotulo:'Camelos, mercadorias, setas e uma régua sobre o mapa',itens:[
      // etapa 2: setas finas mostram que os grupos se misturam nas bordas
      {t:'seta',et:'1',a:[20,7.4],b:[20,10.6],curva:.2,cor:'#1b1a17',w:1.3,ponta:4.4,d:A(24600)/1000},
      {t:'seta',et:'1',a:[28,10.2],b:[31,8.6],curva:.2,cor:'#1b1a17',w:1.3,ponta:4.4,d:A(24800)/1000},
      {t:'seta',et:'1',a:[20,-0.6],b:[20,-7],curva:.12,cor:'#1b1a17',w:1.3,ponta:4.4,d:A(25000)/1000},
      // etapa 3: seta da nota ao Gana, mercadorias e camelos nas rotas
      {t:'viaja',et:'2',nome:'camelo-af',pts:R1,k:.1,dur:22,ini:0,d:A(18600)/1000},
      {t:'viaja',et:'2',nome:'camelo-af',pts:rev(R1),k:.1,dur:22,ini:11,d:A(18600)/1000},
      {t:'viaja',et:'2',nome:'pepita',pts:R1,k:.07,dur:22,ini:3,d:A(18600)/1000},
      {t:'viaja',et:'2',nome:'sal',pts:rev(R1),k:.08,dur:22,ini:14,d:A(18600)/1000},
      {t:'viaja',et:'2',nome:'camelo-af',pts:R2,k:.1,dur:26,ini:0,d:A(18600)/1000},
      {t:'viaja',et:'2',nome:'pepita',pts:R2,k:.07,dur:26,ini:6,d:A(18600)/1000},
      {t:'viaja',et:'2',nome:'tecidos',pts:rev(R2),k:.08,dur:26,ini:2,d:A(18600)/1000},
      {t:'viaja',et:'2',nome:'cavalo',pts:rev(R2),k:.08,dur:26,ini:9,d:A(18600)/1000},
      {t:'viaja',et:'2',nome:'tamaras',pts:rev(R2),k:.07,dur:26,ini:16,d:A(18600)/1000},
      {t:'viaja',et:'2',nome:'camelo-af',pts:R3,k:.1,dur:20,ini:0,d:A(18600)/1000},
      {t:'viaja',et:'2',nome:'pepita',pts:R3,k:.07,dur:20,ini:7,d:A(18600)/1000},
      {t:'viaja',et:'2',nome:'sal',pts:rev(R3),k:.08,dur:20,ini:4,d:A(18600)/1000},
      // etapa 4: círculo amarelo em volta de Tombuctu
      {t:'circulo',et:'3',p:[-3,16.8],r:5.4,d:A(6200)/1000},
      // etapa 5: pilha de pepitas que se espalha no Cairo
      {t:'icone',et:'4',nome:'pilha-ouro',p:[31.4,27.6],k:.12,d:A(10000)/1000},
      {t:'icone',et:'4',nome:'pepita',p:[27.4,26.4],k:.06,giro:-14,d:A(10400)/1000},
      {t:'icone',et:'4',nome:'pepita',p:[35.4,26.6],k:.06,giro:20,d:A(10800)/1000},
      // etapa 6: régua "mais de 2 mil km" e a seta vermelha vinda do Marrocos
      {t:'regua',et:'5',a:[-16.5,2.4],b:[14.5,2.4],texto:'mais de 2 mil km',n:12,larg:100,fs:10,alt:15,d:A(9500)/1000},
      {t:'seta',et:'5',a:[-8,32.4],b:[-0.3,17.4],curva:-.14,cor:'#c93a2a',w:3.4,ponta:8,cheia:true,d:A(24000)/1000}
    ]},

    // ================= fita do tempo, com três faixas: Gana, Mali e Songhai
    {id:'fita',tipo:'fitaafr',x:0,y:1750,w:3500,h:860,rotulo:'Fita do tempo de Gana, Mali e Songhai, do século III ao XVI'},

    // ================= etapas 1 e 2: a etiqueta "54 países hoje" e as notas, no Atlântico Sul, ao lado do mapa
    {id:'p54',tipo:'etq3',texto:'54 países hoje',tam:22,x:1184,y:850,w:215,h:70,giro:3,atraso:A(23800),rotulo:'Etiqueta: 54 países hoje'},
    {id:'n-pre',tipo:'nota3',texto:'A história da África ainda é pouco ensinada e cheia de preconceitos.',tam:21,x:1184,y:960,w:220,h:150,giro:-2,atraso:A(24600),rotulo:'Nota: a história da África ainda é pouco ensinada e cheia de preconceitos'},
    {id:'n-cla',tipo:'nota3',texto:'Classificação antiga e simplificada. Cada grupo reúne muitos povos diferentes.',tam:21,x:1184,y:960,w:220,h:170,giro:-2,atraso:A(25400),rotulo:'Nota: classificação antiga e simplificada; cada grupo reúne muitos povos'},
    {id:'n-gana',tipo:'nota3',texto:'Não é o Gana atual, que fica mais ao sul.',tam:21,x:1100,y:830,w:200,h:130,giro:-2,atraso:A(9600),rotulo:'Nota: não é o Gana atual, que fica mais ao sul, na costa'},
    // ================= etapa 4: Tombuctu, mesquita de barro e manuscritos (zona à direita do mapa)
    {id:'mesq',tipo:'icone',nome:'mesquita',x:2900,y:100,w:540,h:540,giro:-1.5,atraso:A(9600),rotulo:'Mesquita de barro com vigas de madeira saindo das paredes, no estilo do Sahel'},
    {id:'manu',tipo:'icone',nome:'manuscritos',x:3560,y:170,w:420,h:420,giro:2,atraso:A(10200),rotulo:'Pilha de manuscritos'},
    {id:'tomb-et',tipo:'etq3',texto:'Tombuctu: livros e estudo',tam:46,x:3170,y:720,w:700,h:120,giro:-1,atraso:A(10800),rotulo:'Etiqueta: Tombuctu, livros e estudo'},
    {id:'n-mansa',tipo:'nota3',texto:'Mansa: rei dos reis, imperador.',tam:46,x:3050,y:940,w:640,h:150,giro:1.2,atraso:A(14000),rotulo:'Nota: mansa, rei dos reis, imperador'},
    // ================= etapa 5: a figura de IA e a fonte
    {id:'musa',tipo:'musa',img:'historia-africa-mansa-musa',x:2900,y:1000,w:900,h:502,giro:-1.5,fita:{x:44,g:-4},rasgo:1.6,atraso:A(14900),rotulo:'Mansa Musa sentado no trono, com uma pepita de ouro na mão, numa recriação inspirada no estilo do Atlas Catalão'},
    {id:'musa-et',tipo:'etq3',texto:'Mansa Musa',tam:54,x:3240,y:1560,w:420,h:120,giro:1,atraso:A(16100),rotulo:'Etiqueta: Mansa Musa'},
    {id:'fonte',tipo:'fonte',grande:true,x:3860,y:960,w:620,h:430,giro:.8,atraso:A(21500),
      texto:'Este senhor negro se chama Musse Melly, senhor dos negros da Guiné. Este rei é o mais rico e o mais nobre senhor de toda a região, pela grande abundância de ouro que se recolhe em sua terra.',
      ref:'Atlas Catalão, mapa feito em Maiorca em 1375, atribuído ao cartógrafo judeu Abraão Cresques, hoje na Biblioteca Nacional da França. Legenda junto da figura de um rei africano. Paráfrase da equipe.',
      resposta:'Que no século XIV a Europa conhecia e admirava a riqueza do Mali: o rei aparece com coroa, cetro e uma pepita de ouro, como qualquer grande monarca. Musse Melly é Mansa Musa, rei do Mali. O mapa foi feito por quem nunca esteve lá, com informações de mercadores do comércio transaariano. Mostra que a imagem da África como terra "sem história" é uma construção posterior.',
      rotulo:'Fonte: legenda do Atlas Catalão sobre o rei Musse Melly'},
    // ================= etapa 6: o cauri, a moeda, e as notas do Songhai (mesma zona à direita)
    {id:'cauri',tipo:'cauri3',x:2900,y:160,w:480,h:480,queda:.3,atraso:A(14000),rotulo:'Concha de cauri, usada como moeda'},
    {id:'cauri-et',tipo:'etq3',texto:'moeda',tam:56,x:3040,y:740,w:260,h:120,giro:-2,atraso:A(15600),rotulo:'Etiqueta: moeda'},
    {id:'n-po',tipo:'nota3',texto:'Na corte, quem falava com o imperador cobria a cabeça de pó, em sinal de respeito.',tam:42,x:3540,y:140,w:700,h:230,giro:-1.5,atraso:A(19000),rotulo:'Nota: na corte, quem falava com o imperador cobria a cabeça de pó'},
    {id:'n-sankore',tipo:'nota3',texto:'Sankore teria reunido cerca de 25 mil estudantes, segundo os relatos.',tam:42,x:3540,y:520,w:700,h:200,giro:1.5,atraso:A(20400),rotulo:'Nota: Sankore teria reunido cerca de 25 mil estudantes, segundo os relatos'},

    // ================= etapa 7: mães, rainhas e linhagens (sem mapa)
    {id:'mini',tipo:'minimapa',et:'6',x:80,y:3000,w:720,h:807,giro:-1,pontos:[
      {ll:[39.2,-12.6],nome:'macua',dx:-16,dy:-4,anc:'e',larg:74,alt:28,fs:14,atraso:.6},
      {ll:[31.6,19.4],nome:'Núbia',dx:16,dy:-4,larg:76,alt:28,fs:14,atraso:1},
      {ll:[4.2,7.6],nome:'iorubás',dx:16,dy:-6,larg:88,alt:28,fs:14,atraso:1.4}],rotulo:'Mapinha da África com três pontos acesos: norte de Moçambique, Núbia e terra iorubá'},
    {id:'mini-et',tipo:'etq3',texto:'macua: norte de Moçambique',tam:40,x:90,y:3840,w:700,h:100,giro:1,atraso:A(1800),rotulo:'Etiqueta: macua, norte de Moçambique'},
    {id:'arv',tipo:'matri',x:980,y:3000,w:1500,h:1000,atraso:A(7000),rotulo:'Árvore de família matrilinear: a linha de herança, em amarelo, corre pelo lado das mulheres'},
    {id:'cand',tipo:'candace',x:2640,y:3000,w:520,h:520,giro:2,atraso:A(14000),rotulo:'Silhueta de uma candace, rainha da Núbia'},
    {id:'cand-et',tipo:'etq3',texto:'candace: rainha da Núbia',tam:46,x:2550,y:3580,w:700,h:120,giro:-1.5,atraso:A(14800),rotulo:'Etiqueta: candace, rainha da Núbia'},
    {id:'comp',tipo:'col2',a:{titulo:'macua: herança da mãe',sub:'o parentesco e a herança seguem a linha materna'},b:{titulo:'Europa medieval: herança do pai',sub:'o parentesco e a herança seguem a linha paterna'},x:980,y:4420,w:1700,h:340,t1:54,t2:40,giro:.6,atraso:A(20000),rotulo:'Comparação em duas colunas: macua, herança da mãe; Europa medieval, herança do pai'},
    {id:'n-matri',tipo:'nota3',texto:'Matrilinear não quer dizer que as mulheres governavam: é um modo de contar o parentesco.',tam:44,x:2780,y:4420,w:760,h:260,giro:1.2,atraso:A(22000),rotulo:'Nota: matrilinear é um modo de contar o parentesco, não um governo das mulheres'},

    // ================= etapa 8: máscaras, arte e griôs (sem mapa)
    {id:'ma-t',tipo:'etq3',texto:'cada povo, uma arte',tam:72,x:620,y:4580,w:980,h:130,giro:-1,atraso:A(2200),rotulo:'Etiqueta: cada povo, uma arte'},
    {id:'m1',tipo:'icone',nome:'mascara-longa',x:150,y:4780,w:560,h:560,giro:-2,atraso:A(600),rotulo:'Máscara alongada de madeira'},
    {id:'m2',tipo:'icone',nome:'mascara-marfim',x:850,y:4780,w:560,h:560,giro:1.5,atraso:A(1200),rotulo:'Máscara de marfim, rainha Idia, do antigo reino de Benim'},
    {id:'m3',tipo:'icone',nome:'mascara-gelede',x:1550,y:4780,w:560,h:560,giro:-1,atraso:A(1800),rotulo:'Máscara Gelede, com figuras no alto'},
    {id:'idia-et',tipo:'etq3',texto:'rainha Idia, do antigo reino de Benim, atual Nigéria',tam:40,x:800,y:5400,w:700,h:160,giro:1,atraso:A(7000),rotulo:'Etiqueta: rainha Idia, do antigo reino de Benim, atual Nigéria'},
    {id:'vit',tipo:'vitrine',x:70,y:4700,w:720,h:740,atraso:12.0,rotulo:'Vitrine de museu em linha tracejada fechando-se em volta da máscara de madeira'},
    {id:'n-vit',tipo:'nota3',texto:'Fora do ritual, a máscara perde o sentido.',tam:44,x:70,y:5500,w:720,h:160,giro:-1.5,atraso:A(13000),rotulo:'Nota: fora do ritual, a máscara perde o sentido'},
    {id:'grio',tipo:'icone',nome:'grio',x:2420,y:4780,w:700,h:700,giro:1.5,atraso:A(18000),rotulo:'Griô sentado com a kora, instrumento de cordas'},
    {id:'ond',tipo:'ondas',x:3120,y:4880,w:340,h:340,atraso:18.4,rotulo:'Ondas sonoras desenhadas à mão'},
    {id:'grio-et',tipo:'etq3',texto:'griô e kora: a memória em música',tam:44,x:2370,y:5520,w:800,h:130,giro:-1,atraso:A(18800),rotulo:'Etiqueta: griô e kora, a memória em música'}
  ],

  etapas:[
    {titulo:'Uma África, muitas Áfricas',
     texto:`A África não é um país nem um povo só: hoje tem 54 países e enorme variedade de línguas, religiões e modos de vida. O ==Saara== ocupa cerca de um terço do continente e funcionou ao mesmo tempo como barreira e como caminho de comércio.

Ao norte fica a ==África Setentrional==, que recebeu os árabes e o islamismo desde o século VII e tem clima desértico. Ao sul fica a ==África Subsaariana==, a maior parte do continente, onde vive a maioria da população negra. Entre as duas fica o Sahel, nome que significa borda do deserto. A história africana ainda é pouco ensinada e cheia de preconceitos, e os reinos deste tópico ajudam a corrigir isso.`,
     mostra:['mapa','itens'],so:['p54','n-pre'],
     ...BT([[0,WORLD],[3000,FD(715,415,560),FMo(712,420,272)],[8200,FD(700,345,500),FMo(700,350,250)],[13200,FD(715,380,520),FMo(712,385,262)],[18200,FD(715,470,560),FMo(712,480,272)],[23000,AF,AFm]])},
    {titulo:'Muitos povos, muitas línguas',
     texto:`Os livros agrupam os povos africanos por língua e modo de vida, numa classificação antiga e simplificada. Os ==bantos==, no centro e no sul, são o grupo mais numeroso, com centenas de povos de línguas aparentadas. Os sudaneses viviam nas savanas, do Atlântico ao Nilo, como agricultores.

Havia ainda caçadores e coletores da floresta equatorial, os nilotas, no alto Nilo, os khoikhoi, no sudoeste, e os ==berberes==, no norte, islamizados a partir do século VIII. Séculos depois, bantos e sudaneses estariam entre os povos mais atingidos pelo tráfico de escravizados para a América. O contato com os europeus vinha desde a Antiguidade, no norte, e se intensificou com as Navegações do século XV.`,
     so:['n-cla'],
     ...BT([[0,FD(745,470,520),FMo(745,480,262)],[4000,FD(690,400,520),FMo(690,405,262)],[8000,FD(730,430,520),FMo(730,432,262)],[12000,FD(780,410,520),FMo(770,410,262)],[16000,FD(730,500,540),FMo(735,510,262)],[20000,FD(680,340,520),FMo(680,345,262)],[24000,AF,AFm]])},
    {titulo:'Gana, o reino do ouro',
     texto:`O reino de ==Gana== surgiu, segundo os livros, por volta do século III, entre os rios Níger e Senegal, nos atuais Mali e Mauritânia, longe do litoral e fora do Saara. Não é o Gana de hoje, que fica mais ao sul. Foi formado pelos soninquês para se proteger de ataques de nômades.

Com o ==camelo==, animal ideal para atravessar o deserto, cresceu o comércio com os berberes: ouro do sul, ==sal== do norte, além de tecidos, cavalos e tâmaras. O rei controlava e taxava o comércio do ouro, que vinha de minas ao sul, em Bambuk e Buré. A capital era Kumbi Saleh, e Audagoste era o centro comercial. O apogeu foi entre os séculos VII e IX.`,
     so:['fita','n-gana'],
     ...BT([[0,WA,WAm],[4500,WA2,WA2m],[9000,WA,WAm],[13000,RT,RTm],[18000,FD(692,338,360),FMo(662,342,280)],[24000,Z(0,1670,1500,1020),Z(0,1422,1000,1516)]])},
    {titulo:'Mali e os mansas',
     texto:`Nos séculos XI e XII, Gana entrou em declínio, por causa do esgotamento do ouro, de revoltas e da pressão de outros povos. No século XIII, por volta de 1235, a região foi unificada pelo ==Mali==, que ocupava terras dos atuais Mali, Senegal e Guiné.

Fundado por ==Sundiata Keita==, o Mali tinha capital em Niani, na bacia do rio Níger, e seus imperadores se chamavam ==mansas==. O comércio com os árabes trouxe também o islamismo, que conviveu com as crenças tradicionais. A cidade de Tombuctu virou centro cultural, com mesquitas e bibliotecas que guardavam milhares de manuscritos e atraíam mercadores, sábios e estudantes.`,
     so:['fita','mesq','manu','tomb-et','n-mansa'],
     ...BT([[0,WA,WAm],[4500,WA2,WA2m],[9000,Z(2830,60,1260,860)],[13500,Z(2900,380,1160,800)],[18000,Z(1500,1636,1600,1088),Z(1900,1322,1200,1818)]]),
     tracos:[{tipo:'seta',de:{peca:'tomb-et',x:20,y:0},para:{peca:'mesq',x:55,y:96},curva:.25,atraso:A(11600)},
             {tipo:'seta',de:{peca:'n-mansa',x:50,y:0},para:{peca:'tomb-et',x:80,y:100},curva:-.2,atraso:A(14800)}]},
    {titulo:'Mansa Musa, o rei mais rico',
     texto:`O apogeu do Mali veio com ==Mansa Musa==, que expandiu o império até o Atlântico. Muçulmano, fez em 1324 e 1325 uma ==peregrinação a Meca== famosa pelo luxo: atravessou o Saara com uma enorme caravana e distribuiu tanto ouro no Cairo que, segundo o cronista árabe al-Umari, o preço do metal caiu por anos.

A fama chegou à Europa: o Atlas Catalão, de 1375, desenha o rei com uma pepita de ouro na mão. De volta, ele teria trazido sábios e arquitetos do mundo islâmico, e as cidades do Níger ganharam mesquitas e escolas. Depois da sua morte, o Mali declinou e, no século XV, foi superado pelos Songhai.`,
     so:['musa','musa-et','fonte','fita'],fonte:'fonte',
     ...BT([[0,WA,WAm],[4500,RT5,RT5m],[9500,FD(735,325,300),FMo(735,330,176)],[14500,Z(2840,960,1020,720),Z(2830,880,980,1000)],[21000,Z(3790,956,760,518),Z(3820,640,700,1060)],[27000,Z(2100,1738,1300,884),Z(1950,1322,1200,1818)]]),
     tracos:[{tipo:'circulo',peca:'musa',x:50,y:57,w:36,h:82,atraso:A(15700)},
             {tipo:'seta',de:{peca:'musa-et',x:50,y:0},para:{peca:'musa',x:50,y:92},curva:.2,atraso:A(16500)}]},
    {titulo:'Songhai: do Atlântico ao lago Chade',
     texto:`O ==Songhai==, reino antigo com centro em Gao, foi transformado em império por Sonni Ali Ber, a partir de 1464, no século XV. Ele tomou Tombuctu (1468) e Djenné (1473) e controlou o comércio do rio Níger, num domínio de mais de 2 mil quilômetros, do Atlântico ao lago Chade.

A principal moeda era o ==cauri==, uma concha usada da África à China, embora o ouro e o sal também fossem referência do comércio. Havia trabalho escravo e cidades de estudo, como a Universidade de Sankore, que teria reunido cerca de 25 mil estudantes. Em 1591, o império foi derrotado por um exército marroquino com armas de fogo, na batalha de Tondibi.`,
     so:['cauri','cauri-et','n-po','n-sankore','fita'],
     ...BT([[0,RT6,RT6m],[4500,FD(668,375,250),FMo(660,378,150)],[9000,RT6,RT6m],[13500,Z(2840,60,1000,720),Z(2860,60,780,1180)],[18500,Z(3440,60,1000,700),Z(3460,60,780,1180)],[23500,RT6,RT6m],[28500,Z(2000,1670,1500,1020),Z(2300,1322,1200,1818)]]),
     tracos:[{tipo:'seta',de:{peca:'cauri-et',x:50,y:0},para:{peca:'cauri',x:52,y:92},curva:.2,atraso:A(16200)}]},
    {titulo:'Mães, rainhas e linhagens',
     texto:`Em muitas sociedades africanas, as mulheres tinham poder que a Europa patriarcal não dava. Entre os macua, do norte de Moçambique, a sociedade era ==matrilinear==: a descendência e a herança seguiam a linha da mãe, o governante tinha uma conselheira e as mulheres orientavam parte da economia. Matrilinear não quer dizer que as mulheres governavam: é um modo de contar o parentesco.

Na Núbia, rainhas, as ==candaces==, comandavam cerimônias, diplomacia e exércitos. Entre os iorubás, a mulher que se tornava mãe ganhava poderes considerados divinos. Esses exemplos contrastam com a tradição patriarcal europeia e mostram que não existe um papel feminino único na África.`,
     so:['mini','mini-et','arv','cand','cand-et','comp','n-matri'],
     ...BT([[0,Z(40,2940,1020,860),Z(30,2960,780,1180)],[6500,Z(940,2920,1620,1100),Z(950,2940,1560,1500)],[13500,Z(2500,2940,880,820),Z(2500,2940,760,1160)],[19500,Z(960,4355,1740,470),Z(970,4240,880,700)],[25500,Z(1800,4355,900,470),Z(1840,4240,880,700)]]),
     tracos:[{tipo:'seta',de:{peca:'cand-et',x:50,y:0},para:{peca:'cand',x:50,y:94},curva:.2,atraso:A(15200)}]},
    {titulo:'Máscaras, arte e griôs',
     texto:`Não existe uma "arte africana" única: cada povo tinha sua cerâmica, suas estatuetas e suas ==máscaras==, usadas em guerras, nascimentos, colheitas e funerais, com materiais, tamanhos e sentidos variados. Entre os iorubás, a sociedade Gelede, presidida por mulheres, cercava a confecção das máscaras de rituais.

Os colonizadores trataram essas peças como objetos exóticos de museu, tirando-as de seu contexto. A memória era guardada pela ==tradição oral== dos griôs, contadores de histórias com música e dança, poupados até pelos inimigos para que a memória dos povos não se perdesse. A máscara de marfim da rainha Idia, do antigo reino de Benim, hoje na Nigéria, é um dos exemplos mais conhecidos dessa arte.`,
     so:['ma-t','m1','m2','m3','idia-et','vit','n-vit','grio','ond','grio-et'],
     ...BT([[0,Z(100,4540,2080,1080),Z(90,4560,2080,1500)],[6500,Z(760,4700,760,940),Z(760,4720,720,1090)],[11500,Z(30,4640,860,1000),Z(20,4660,820,1240)],[17500,Z(2330,4700,1260,1000),Z(2340,4700,1160,1760)]]),
     tracos:[{tipo:'seta',de:{peca:'idia-et',x:30,y:0},para:{peca:'m2',x:50,y:92},curva:.2,atraso:A(7600)}]}
  ]
});
})();
