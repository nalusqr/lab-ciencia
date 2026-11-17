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
const AF=FD(722,432,560),AFm=FMo(722,432,262);         // a África toda
const WA=FD(640,352,400),WAm=FMo(630,354,236);         // África Ocidental
const RT=FD(690,336,470),RTm=FMo(700,340,252);         // rotas pelo Saara
const RT5=FD(705,345,500),RT5m=FMo(712,350,270);       // rota até Meca
const RT6=FD(650,350,440),RT6m=FMo(650,350,272);       // Songhai, de ponta a ponta
const Z=(x,y,w,h)=>[x,y,w,h];

// ---- regiões (longitude e latitude)
const SAARA=[[-17,21],[-15,26],[-13,28.5],[-9,29.8],[-5,31.5],[0,32],[5,33],[9,33.2],[10,31.5],[14,31],[18,30.4],[23,31.2],[26,30.5],[30,29.8],[32.5,29.8],[32.5,23],[35,23],[36,19],[30,17.8],[24,16.2],[16,15.6],[8,16.6],[0,17.2],[-8,17],[-14,17.5],[-17.5,18]];
const NORTE=[[-17,28],[-13,28.5],[-9,29.8],[-5,31.5],[0,32],[5,33],[9,33.2],[10,31.5],[14,31],[18,30.4],[23,31.2],[26,30.5],[30,29.8],[32.6,29.8],[32.6,31.7],[30,31.8],[25,32.8],[23,33.4],[20,33.8],[15,34.2],[11.5,35.5],[10.8,37.6],[5,37.2],[0,36.4],[-3,35.5],[-5.8,35.8],[-7,35.5],[-10,34]];
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
      {tipo:'regiao',ll:true,pts:SUBSAARA,suave:false,terra:true,cor:'#ec6f5e',opac:.34,etapas:[0],atraso:A(10000)},
      {tipo:'etiqueta',ll:true,p:[14,-6],texto:'África Subsaariana',tam:.34,etapas:[0],atraso:A(11200)},
      {tipo:'regiao',ll:true,pts:NORTE,suave:false,terra:true,cor:'#e8572a',opac:.62,etapas:[0],atraso:A(5200)},
      {tipo:'etiqueta',ll:true,p:[-2,36.2],texto:'África Setentrional',tam:.34,etapas:[0],atraso:A(6400)},
      {tipo:'regiao',ll:true,pts:SAARA,suave:false,terra:true,cor:'#e6cd92',opac:.8,etapas:[0],atraso:A(1400)},
      {tipo:'pontos',ll:true,pts:(function(){const r=Colagem.rng('saara'),o=[];for(let i=0;i<230;i++){o.push([-16+r()*50,17.5+r()*14]);}return o.filter(q=>{let d=false;for(let i=0,j=SAARA.length-1;i<SAARA.length;j=i++){const a=SAARA[i],b=SAARA[j];if(((a[1]>q[1])!==(b[1]>q[1]))&&(q[0]<(b[0]-a[0])*(q[1]-a[1])/(b[1]-a[1])+a[0]))d=!d;}return d&&q[1]>19;});})(),cor:'#a9843c',tam:.22,etapas:[0],atraso:A(2400)},
      {tipo:'etiqueta',ll:true,p:[-8,26],texto:'Saara',sub:'cerca de um terço do continente',tam:.34,etapas:[0],atraso:A(3200)},
      {tipo:'regiao',ll:true,pts:SAHEL,estilo:'listra',suave:false,terra:true,etapas:[0],atraso:A(7800)},
      {tipo:'etiqueta',ll:true,p:[10,15],texto:'Sahel',sub:'borda do deserto',tam:.34,etapas:[0],atraso:A(8800)},
      // ===== etapa 2 (1): muitos povos
      {tipo:'regiao',ll:true,pts:BANTOS,suave:false,terra:true,cor:'#e8572a',opac:.5,etapas:[1],atraso:A(1400)},
      {tipo:'etiqueta',ll:true,p:[20,-14],texto:'bantos',tam:.36,etapas:[1],atraso:A(2400)},
      {tipo:'regiao',ll:true,pts:SUDANESES,suave:false,terra:true,cor:'#f2c230',opac:.62,etapas:[1],atraso:A(4600)},
      {tipo:'etiqueta',ll:true,p:[-4,9.6],texto:'sudaneses',tam:.36,etapas:[1],atraso:A(5400)},
      {tipo:'regiao',ll:true,pts:FLORESTA,suave:false,terra:true,cor:'#4f9a58',opac:.62,etapas:[1],atraso:A(7600)},
      {tipo:'etiqueta',ll:true,p:[8,-0.4],texto:'povos da floresta',sub:'equatorial',tam:.3,etapas:[1],atraso:A(8400)},
      {tipo:'regiao',ll:true,pts:NILOTAS,suave:false,terra:true,cor:'#3d8fd6',opac:.55,etapas:[1],atraso:A(10600)},
      {tipo:'etiqueta',ll:true,p:[36,6],texto:'nilotas',tam:.34,etapas:[1],atraso:A(11400)},
      {tipo:'regiao',ll:true,pts:KHOIKHOI,suave:false,terra:true,cor:'#9b6fb0',opac:.55,etapas:[1],atraso:A(13600)},
      {tipo:'etiqueta',ll:true,p:[24,-28],texto:'khoikhoi',tam:.34,etapas:[1],atraso:A(14400)},
      {tipo:'regiao',ll:true,pts:BERBERES,suave:false,terra:true,cor:'#d8923a',opac:.55,etapas:[1],atraso:A(16600)},
      {tipo:'etiqueta',ll:true,p:[-6,27.6],texto:'berberes',tam:.36,etapas:[1],atraso:A(17400)},
      // ===== etapa 3 (2): Gana, o reino do ouro (rios ficam até a etapa 6)
      {tipo:'rota',ll:true,pts:NIGER,estilo:'rio',largura:2.4,etapas:[2,3,4,5],atraso:A(800),dur:2.6},
      {tipo:'rota',ll:true,pts:SENEGAL,estilo:'rio',largura:2.4,etapas:[2,3,4,5],atraso:A(1800),dur:1.6},
      {tipo:'rotulo',ll:true,p:[-0.5,13.4],texto:'rio Níger',classe:'regiao',tam:.26,giro:8,etapas:[2,3,4,5],atraso:A(3400)},
      {tipo:'rotulo',ll:true,p:[-17,13.6],texto:'rio Senegal',classe:'regiao',tam:.26,giro:-28,etapas:[2],atraso:A(3800)},
      {tipo:'regiao',ll:true,pts:GANA,suave:false,terra:true,cor:'#e8572a',opac:.62,etapas:[2],atraso:A(4400)},
      {tipo:'etiqueta',ll:true,p:[-11.4,14.6],texto:'Gana',tam:.4,etapas:[2],atraso:A(5200)},
      {tipo:'cidade',ll:true,p:[-8,15.8],nome:'Kumbi Saleh',sub:'capital',capital:true,lado:'d',tam:.3,etapas:[2],atraso:A(6400)},
      {tipo:'cidade',ll:true,p:[-11,17.7],nome:'Audagoste',sub:'centro comercial',lado:'e',tam:.3,etapas:[2],atraso:A(7200)},
      {tipo:'nota',ll:true,p:[-36,18.2],texto:'Não é o Gana|atual, que fica|mais ao sul',tam:.27,etapas:[2],atraso:A(8200)},
      {tipo:'rota',ll:true,pts:R1,suave:false,largura:2.6,etapas:[2],atraso:A(16500),dur:2.6},
      {tipo:'rota',ll:true,pts:R2,suave:false,largura:2.6,etapas:[2],atraso:A(18000),dur:3},
      {tipo:'rota',ll:true,pts:R3,suave:false,largura:2.6,etapas:[2],atraso:A(19500),dur:3},
      {tipo:'cidade',ll:true,p:[-4.3,31.3],nome:'Sijilmasa',lado:'e',tam:.26,etapas:[2],atraso:A(20500)},
      {tipo:'cidade',ll:true,p:[13.2,32.9],nome:'Trípoli',lado:'d',tam:.26,etapas:[2],atraso:A(21000)},
      {tipo:'cidade',ll:true,p:[31.2,30],nome:'Cairo',lado:'e',tam:.26,etapas:[2],atraso:A(21500)},
      {tipo:'rotulo',ll:true,p:[-4,24.6],texto:'Saara',classe:'regiao',tam:.34,giro:-4,etapas:[2],atraso:A(16000)},
      // ===== etapa 4 (3): Mali e os mansas
      {tipo:'regiao',ll:true,pts:GANA_RECUA,suave:false,terra:true,cor:'#e8572a',opac:.3,etapas:[3],atraso:A(400)},
      {tipo:'rotulo',ll:true,p:[-11.2,15.4],texto:'Gana, em declínio',classe:'regiao',tam:.24,giro:-6,etapas:[3],atraso:A(1200)},
      {tipo:'regiao',ll:true,pts:MALI,suave:false,terra:true,cor:'#e8572a',opac:.66,etapas:[3],atraso:A(2400)},
      {tipo:'etiqueta',ll:true,p:[-12,12.4],texto:'Mali',tam:.4,etapas:[3],atraso:A(3800)},
      {tipo:'cidade',ll:true,p:[-9,11.4],nome:'Niani',sub:'capital',capital:true,lado:'e',tam:.3,etapas:[3],atraso:A(5200)},
      {tipo:'cidade',ll:true,p:[-3,16.8],nome:'Tombuctu',lado:'d',tam:.3,etapas:[3],atraso:A(7000)},
      // ===== etapa 5 (4): Mansa Musa, o Mali até o Atlântico e a peregrinação
      {tipo:'regiao',ll:true,pts:MALI_ATL,suave:false,terra:true,cor:'#e8572a',opac:.66,etapas:[4],atraso:A(600)},
      {tipo:'etiqueta',ll:true,p:[-15,11.6],texto:'Mali',tam:.4,etapas:[4],atraso:A(1800)},
      {tipo:'cidade',ll:true,p:[-9,11.4],nome:'Niani',lado:'d',tam:.28,etapas:[4],atraso:A(2400)},
      {tipo:'cidade',ll:true,p:[-3,16.8],nome:'Tombuctu',lado:'d',tam:.28,etapas:[4],atraso:A(2800)},
      {tipo:'rota',ll:true,pts:RHAJJ,suave:false,largura:2.8,movel:'ponto',tam:.34,volta:A(9000)||9000,etapas:[4],atraso:A(9400),dur:6},
      {tipo:'cidade',ll:true,p:[31.2,30],nome:'Cairo',lado:'e',tam:.28,etapas:[4],atraso:A(10600)},
      {tipo:'cidade',ll:true,p:[39.8,21.4],nome:'Meca',lado:'d',tam:.28,etapas:[4],atraso:A(14600)},
      {tipo:'etiqueta',ll:true,p:[14,22.6],texto:'1324 e 1325',tam:.32,cor:'amarelo',etapas:[4],atraso:A(15600)},
      // ===== etapa 6 (5): Songhai
      {tipo:'regiao',ll:true,pts:MALI,suave:false,terra:true,estilo:'listra',etapas:[5],atraso:A(300)},
      {tipo:'rotulo',ll:true,p:[-10.6,11.9],texto:'Mali, em declínio',classe:'regiao',tam:.22,etapas:[5],atraso:A(1000)},
      {tipo:'regiao',ll:true,pts:SONGHAI,suave:false,terra:true,cor:'#e8572a',opac:.62,etapas:[5],atraso:A(1600)},
      {tipo:'etiqueta',ll:true,p:[3.4,12.4],texto:'Songhai',tam:.4,etapas:[5],atraso:A(3000)},
      {tipo:'cidade',ll:true,p:[-0.05,16.27],nome:'Gao',sub:'capital',capital:true,lado:'d',tam:.3,etapas:[5],atraso:A(4400)},
      {tipo:'cidade',ll:true,p:[-3,16.8],nome:'Tombuctu',sub:'1468',lado:'e',tam:.28,etapas:[5],atraso:A(5600)},
      {tipo:'cidade',ll:true,p:[-4.55,13.9],nome:'Djenné',sub:'1473',lado:'e',tam:.28,etapas:[5],atraso:A(6800)},
      {tipo:'etiqueta',ll:true,p:[10.8,13.2],texto:'lago Chade',tam:.28,etapas:[5],atraso:A(7600)},
      {tipo:'etiqueta',ll:true,p:[-12,34.2],texto:'Marrocos',tam:.32,etapas:[5],atraso:A(24400)}
    ]},
    // ícones, setas, régua e círculos sobre o mapa
    {id:'itens',tipo:'mapitens',x:0,y:0,w:1376*S,h:768*S,clicavel:false,ate:5,rotulo:'Camelos, mercadorias, setas e uma régua sobre o mapa',itens:[
      // etapa 2: setas finas mostram que os grupos se misturam nas bordas
      {t:'seta',et:'1',a:[20,6.5],b:[20,10.5],curva:.2,cor:'#1b1a17',w:1.3,ponta:4.4,d:A(19000)/1000},
      {t:'seta',et:'1',a:[29,9],b:[26,11],curva:.2,cor:'#1b1a17',w:1.3,ponta:4.4,d:A(19200)/1000},
      {t:'seta',et:'1',a:[8,10],b:[8,18],curva:.1,cor:'#1b1a17',w:1.3,ponta:4.4,d:A(19400)/1000},
      {t:'seta',et:'1',a:[20,-0.8],b:[20,-8],curva:.12,cor:'#1b1a17',w:1.3,ponta:4.4,d:A(19600)/1000},
      // etapa 3: mercadorias e camelos nas rotas
      {t:'viaja',et:'2',nome:'camelo-af',pts:R1,k:.07,dur:22,ini:0,d:A(17000)/1000},
      {t:'viaja',et:'2',nome:'camelo-af',pts:rev(R1),k:.07,dur:22,ini:11,d:A(17000)/1000},
      {t:'viaja',et:'2',nome:'pepita',pts:R1,k:.05,dur:22,ini:3,d:A(17000)/1000},
      {t:'viaja',et:'2',nome:'sal',pts:rev(R1),k:.055,dur:22,ini:14,d:A(17000)/1000},
      {t:'viaja',et:'2',nome:'camelo-af',pts:R2,k:.07,dur:26,ini:0,d:A(19000)/1000},
      {t:'viaja',et:'2',nome:'pepita',pts:R2,k:.05,dur:26,ini:6,d:A(19000)/1000},
      {t:'viaja',et:'2',nome:'tecidos',pts:rev(R2),k:.055,dur:26,ini:2,d:A(19000)/1000},
      {t:'viaja',et:'2',nome:'cavalo',pts:rev(R2),k:.055,dur:26,ini:9,d:A(19000)/1000},
      {t:'viaja',et:'2',nome:'tamaras',pts:rev(R2),k:.05,dur:26,ini:16,d:A(19000)/1000},
      {t:'viaja',et:'2',nome:'camelo-af',pts:R3,k:.07,dur:20,ini:0,d:A(21000)/1000},
      {t:'viaja',et:'2',nome:'pepita',pts:R3,k:.05,dur:20,ini:7,d:A(21000)/1000},
      {t:'viaja',et:'2',nome:'sal',pts:rev(R3),k:.055,dur:20,ini:4,d:A(21000)/1000},
      // etapa 4: círculo amarelo em volta de Tombuctu
      {t:'circulo',et:'3',p:[-3,16.8],r:9,d:A(8200)/1000},
      // etapa 5: pilha de pepitas que se espalha no Cairo
      {t:'icone',et:'4',nome:'pilha-ouro',p:[31.2,33],k:.09,d:A(12400)/1000},
      {t:'icone',et:'4',nome:'pepita',p:[27.6,34.4],k:.04,giro:-14,d:A(13000)/1000},
      {t:'icone',et:'4',nome:'pepita',p:[35,34.2],k:.04,giro:20,d:A(13400)/1000},
      // etapa 6: régua "mais de 2 mil km" e a seta vermelha vinda do Marrocos
      {t:'regua',et:'5',a:[-16.5,7.4],b:[14.5,7.4],texto:'mais de 2 mil km',n:12,larg:100,fs:10,alt:15,d:A(8400)/1000},
      {t:'seta',et:'5',a:[-8,32.4],b:[-0.3,17.4],curva:-.14,cor:'#c93a2a',w:3.4,ponta:8,cheia:true,d:A(25000)/1000}
    ]},

    // ================= fita do tempo, com três faixas: Gana, Mali e Songhai
    {id:'fita',tipo:'fitaafr',x:0,y:1750,w:3500,h:860,rotulo:'Fita do tempo de Gana, Mali e Songhai, do século III ao XVI'},

    // ================= etapa 1: a etiqueta "54 países hoje" e a nota sobre o preconceito, ao lado do mapa
    {id:'p54',tipo:'etq3',texto:'54 países hoje',tam:26,x:1740,y:930,w:300,h:80,giro:3,atraso:A(13000),rotulo:'Etiqueta: 54 países hoje'},
    {id:'n-pre',tipo:'nota3',texto:'A história da África ainda é pouco ensinada e cheia de preconceitos.',tam:23,x:1030,y:800,w:330,h:150,giro:-2,atraso:A(15000),rotulo:'Nota: a história da África ainda é pouco ensinada e cheia de preconceitos'},
    // ================= etapa 2: nota sobre a classificação
    {id:'n-cla',tipo:'nota3',texto:'Classificação antiga e simplificada. Cada grupo reúne muitos povos diferentes.',tam:23,x:1030,y:800,w:330,h:170,giro:-2,atraso:A(19600),rotulo:'Nota: classificação antiga e simplificada; cada grupo reúne muitos povos'},
    // ================= etapa 3: legenda do comércio
    {id:'l-ouro',tipo:'etq3',texto:'ouro vai para o norte',tam:23,x:1010,y:760,w:360,h:70,giro:-2,atraso:A(22500),rotulo:'Etiqueta: o ouro vai para o norte'},
    {id:'l-sal',tipo:'etq3',texto:'sal, tecidos, cavalos e tâmaras vêm para o sul',tam:22,x:1010,y:850,w:360,h:120,giro:1.5,atraso:A(23200),rotulo:'Etiqueta: sal, tecidos, cavalos e tâmaras vêm para o sul'},
    // ================= etapa 4: Tombuctu, mesquita de barro e manuscritos (zona à direita do mapa)
    {id:'mesq',tipo:'icone',nome:'mesquita',x:2900,y:100,w:560,h:560,giro:-1.5,rotulo:'Mesquita de barro com vigas de madeira saindo das paredes, no estilo do Sahel'},
    {id:'manu',tipo:'icone',nome:'manuscritos',x:3540,y:170,w:440,h:440,giro:2,atraso:A(900),rotulo:'Pilha de manuscritos'},
    {id:'tomb-et',tipo:'etq3',texto:'Tombuctu: livros e estudo',tam:46,x:3220,y:720,w:700,h:120,giro:-1,atraso:A(1600),rotulo:'Etiqueta: Tombuctu, livros e estudo'},
    {id:'n-mansa',tipo:'nota3',texto:'Mansa: rei dos reis, imperador.',tam:46,x:3020,y:900,w:640,h:150,giro:1.2,atraso:A(10200),rotulo:'Nota: mansa, rei dos reis, imperador'},
    // ================= etapa 5: a figura de IA e a fonte
    {id:'musa',tipo:'musa',img:'historia-africa-mansa-musa',x:2900,y:1000,w:900,h:502,giro:-1.5,fita:{x:44,g:-4},rasgo:1.6,atraso:A(1200),rotulo:'Mansa Musa sentado no trono, com uma pepita de ouro na mão, numa recriação inspirada no estilo do Atlas Catalão'},
    {id:'musa-et',tipo:'etq3',texto:'Mansa Musa',tam:54,x:3290,y:1600,w:420,h:120,giro:1,atraso:A(24500),rotulo:'Etiqueta: Mansa Musa'},
    {id:'fonte',tipo:'fonte',grande:true,x:3900,y:960,w:640,h:640,giro:.8,atraso:A(25500),
      texto:'Este senhor negro se chama Musse Melly, senhor dos negros da Guiné. Este rei é o mais rico e o mais nobre senhor de toda a região, pela grande abundância de ouro que se recolhe em sua terra.',
      ref:'Atlas Catalão, mapa feito em Maiorca em 1375, atribuído ao cartógrafo judeu Abraão Cresques, hoje na Biblioteca Nacional da França. Legenda junto da figura de um rei africano. Paráfrase da equipe.',
      resposta:'Que no século XIV a Europa conhecia e admirava a riqueza do Mali: o rei aparece com coroa, cetro e uma pepita de ouro, como qualquer grande monarca. Musse Melly é Mansa Musa, rei do Mali. O mapa foi feito por quem nunca esteve lá, com informações de mercadores do comércio transaariano. Mostra que a imagem da África como terra "sem história" é uma construção posterior.',
      rotulo:'Fonte: legenda do Atlas Catalão sobre o rei Musse Melly'},
    // ================= etapa 6: o cauri, a moeda, e as notas do Songhai (mesma zona à direita)
    {id:'cauri',tipo:'cauri3',x:2900,y:160,w:480,h:480,queda:A(900)/1000,rotulo:'Concha de cauri, usada como moeda'},
    {id:'cauri-et',tipo:'etq3',texto:'moeda',tam:56,x:3040,y:740,w:260,h:120,giro:-2,atraso:A(5200),rotulo:'Etiqueta: moeda'},
    {id:'n-po',tipo:'nota3',texto:'Na corte, quem falava com o imperador cobria a cabeça de pó, em sinal de respeito.',tam:42,x:3540,y:140,w:700,h:230,giro:-1.5,atraso:A(11000),rotulo:'Nota: na corte, quem falava com o imperador cobria a cabeça de pó'},
    {id:'n-sankore',tipo:'nota3',texto:'Sankore teria reunido cerca de 25 mil estudantes, segundo os relatos.',tam:42,x:3540,y:520,w:700,h:200,giro:1.5,atraso:A(18000),rotulo:'Nota: Sankore teria reunido cerca de 25 mil estudantes, segundo os relatos'},

    // ================= etapa 7: mães, rainhas e linhagens (sem mapa)
    {id:'mini',tipo:'minimapa',et:'6',x:80,y:3000,w:720,h:807,giro:-1,pontos:[
      {ll:[39.2,-12.6],nome:'macua',dx:-16,dy:-4,anc:'e',larg:62,atraso:A(1600)},
      {ll:[31.6,19.4],nome:'Núbia',dx:16,dy:-4,larg:66,atraso:A(3600)},
      {ll:[4.2,7.6],nome:'iorubás',dx:16,dy:-6,larg:72,atraso:A(5600)}],rotulo:'Mapinha da África com três pontos acesos: norte de Moçambique, Núbia e terra iorubá'},
    {id:'mini-et',tipo:'etq3',texto:'macua: norte de Moçambique',tam:36,x:90,y:3840,w:700,h:100,giro:1,atraso:A(2600),rotulo:'Etiqueta: macua, norte de Moçambique'},
    {id:'arv',tipo:'matri',x:980,y:3000,w:1300,h:930,ini:0,rotulo:'Árvore de família matrilinear: a linha de herança, em amarelo, corre pelo lado das mulheres'},
    {id:'cand',tipo:'candace',x:2420,y:3000,w:520,h:520,giro:2,atraso:A(500),rotulo:'Silhueta de uma candace, rainha da Núbia'},
    {id:'cand-et',tipo:'etq3',texto:'candace: rainha da Núbia',tam:44,x:2330,y:3580,w:700,h:120,giro:-1.5,atraso:A(1500),rotulo:'Etiqueta: candace, rainha da Núbia'},
    {id:'comp',tipo:'col2',a:{titulo:'macua: herança da mãe',sub:'o parentesco e a herança seguem a linha materna'},b:{titulo:'Europa medieval: herança do pai',sub:'o parentesco e a herança seguem a linha paterna'},x:980,y:4010,w:1700,h:430,t1:54,t2:38,giro:.6,atraso:A(500),rotulo:'Comparação em duas colunas: macua, herança da mãe; Europa medieval, herança do pai'},
    {id:'n-matri',tipo:'nota3',texto:'Matrilinear não quer dizer que as mulheres governavam: é um modo de contar o parentesco.',tam:40,x:2330,y:3760,w:760,h:230,giro:1.2,atraso:A(2600),rotulo:'Nota: matrilinear é um modo de contar o parentesco, não um governo das mulheres'},

    // ================= etapa 8: máscaras, arte e griôs (sem mapa)
    {id:'ma-t',tipo:'etq3',texto:'cada povo, uma arte',tam:62,x:660,y:4580,w:900,h:130,giro:-1,atraso:A(5200),rotulo:'Etiqueta: cada povo, uma arte'},
    {id:'m1',tipo:'icone',nome:'mascara-longa',x:150,y:4780,w:560,h:560,giro:-2,rotulo:'Máscara alongada de madeira'},
    {id:'m2',tipo:'icone',nome:'mascara-marfim',x:850,y:4780,w:560,h:560,giro:1.5,atraso:A(900),rotulo:'Máscara de marfim, rainha Idia, do antigo reino de Benim'},
    {id:'m3',tipo:'icone',nome:'mascara-gelede',x:1550,y:4780,w:560,h:560,giro:-1,atraso:A(1800),rotulo:'Máscara Gelede, com figuras no alto'},
    {id:'idia-et',tipo:'etq3',texto:'rainha Idia, do antigo reino de Benim, atual Nigéria',tam:38,x:800,y:5400,w:700,h:160,giro:1,atraso:A(8200),rotulo:'Etiqueta: rainha Idia, do antigo reino de Benim, atual Nigéria'},
    {id:'vit',tipo:'vitrine',x:70,y:4700,w:720,h:740,atraso:A(2500)/1000,rotulo:'Vitrine de museu em linha tracejada fechando-se em volta da máscara de madeira'},
    {id:'n-vit',tipo:'nota3',texto:'Fora do ritual, a máscara perde o sentido.',tam:42,x:70,y:5500,w:720,h:160,giro:-1.5,atraso:A(5600),rotulo:'Nota: fora do ritual, a máscara perde o sentido'},
    {id:'grio',tipo:'icone',nome:'grio',x:2420,y:4780,w:700,h:700,giro:1.5,rotulo:'Griô sentado com a kora, instrumento de cordas'},
    {id:'ond',tipo:'ondas',x:3120,y:4880,w:340,h:340,atraso:A(2200)/1000,rotulo:'Ondas sonoras desenhadas à mão'},
    {id:'grio-et',tipo:'etq3',texto:'griô e kora: a memória em música',tam:42,x:2370,y:5520,w:800,h:130,giro:-1,atraso:A(1400),rotulo:'Etiqueta: griô e kora, a memória em música'}
  ],

  etapas:[
    {titulo:'Uma África, muitas Áfricas',
     texto:`A África não é um país nem um povo só: hoje tem 54 países e enorme variedade de línguas, religiões e modos de vida. O ==Saara== ocupa cerca de um terço do continente e funcionou ao mesmo tempo como barreira e como caminho de comércio.

Ao norte fica a ==África Setentrional==, que recebeu os árabes e o islamismo desde o século VII e tem clima desértico. Ao sul fica a ==África Subsaariana==, a maior parte do continente, onde vive a maioria da população negra. Entre as duas fica o Sahel, nome que significa borda do deserto. A história africana ainda é pouco ensinada e cheia de preconceitos, e os reinos deste tópico ajudam a corrigir isso.`,
     mostra:['mapa','itens'],so:['p54','n-pre'],
     foco:[0,0,2752,1536],focoM:[0,0,2752,1536],
     tomadas:[[2600,AF]],tomadasM:[[2600,AFm]]},
    {titulo:'Muitos povos, muitas línguas',
     texto:`Os livros agrupam os povos africanos por língua e modo de vida, numa classificação antiga e simplificada. Os ==bantos==, no centro e no sul, são o grupo mais numeroso, com centenas de povos de línguas aparentadas. Os sudaneses viviam nas savanas, do Atlântico ao Nilo, como agricultores.

Havia ainda caçadores e coletores da floresta equatorial, os nilotas, no alto Nilo, os khoikhoi, no sudoeste, e os ==berberes==, no norte, islamizados a partir do século VIII. Séculos depois, bantos e sudaneses estariam entre os povos mais atingidos pelo tráfico de escravizados para a América. O contato com os europeus vinha desde a Antiguidade, no norte, e se intensificou com as Navegações do século XV.`,
     so:['n-cla'],
     foco:AF,focoM:AFm},
    {titulo:'Gana, o reino do ouro',
     texto:`O reino de ==Gana== surgiu, segundo os livros, por volta do século III, entre os rios Níger e Senegal, nos atuais Mali e Mauritânia, longe do litoral e fora do Saara. Não é o Gana de hoje, que fica mais ao sul. Foi formado pelos soninquês para se proteger de ataques de nômades.

Com o ==camelo==, animal ideal para atravessar o deserto, cresceu o comércio com os berberes: ouro do sul, ==sal== do norte, além de tecidos, cavalos e tâmaras. O rei controlava e taxava o comércio do ouro, que vinha de minas ao sul, em Bambuk e Buré. A capital era Kumbi Saleh, e Audagoste era o centro comercial. O apogeu foi entre os séculos VII e IX.`,
     so:['fita','l-ouro','l-sal'],
     foco:WA,focoM:WAm,
     tomadas:[[14800,RT],[24500,Z(0,1730,1500,880)]],tomadasM:[[14800,RTm],[24500,Z(0,1730,800,880)]]},
    {titulo:'Mali e os mansas',
     texto:`Nos séculos XI e XII, Gana entrou em declínio, por causa do esgotamento do ouro, de revoltas e da pressão de outros povos. No século XIII, por volta de 1235, a região foi unificada pelo ==Mali==, que ocupava terras dos atuais Mali, Senegal e Guiné.

Fundado por ==Sundiata Keita==, o Mali tinha capital em Niani, na bacia do rio Níger, e seus imperadores se chamavam ==mansas==. O comércio com os árabes trouxe também o islamismo, que conviveu com as crenças tradicionais. A cidade de Tombuctu virou centro cultural, com mesquitas e bibliotecas que guardavam milhares de manuscritos e atraíam mercadores, sábios e estudantes.`,
     so:['fita','mesq','manu','tomb-et','n-mansa'],
     foco:WA,focoM:WAm,
     tomadas:[[9600,Z(2830,60,1260,940)],[19000,Z(1500,1730,1600,880)]],tomadasM:[[9600,Z(2830,60,700,760)],[14500,Z(3440,100,640,820)],[19000,Z(1500,1730,800,880)]],
     tracos:[{tipo:'seta',de:{peca:'tomb-et',x:50,y:0},para:{peca:'mesq',x:55,y:92},curva:.2,atraso:A(11800)},
             {tipo:'seta',de:{peca:'n-mansa',x:50,y:0},para:{peca:'tomb-et',x:60,y:100},curva:-.2,atraso:A(13000)}]},
    {titulo:'Mansa Musa, o rei mais rico',
     texto:`O apogeu do Mali veio com ==Mansa Musa==, que expandiu o império até o Atlântico. Muçulmano, fez em 1324 e 1325 uma ==peregrinação a Meca== famosa pelo luxo: atravessou o Saara com uma enorme caravana e distribuiu tanto ouro no Cairo que, segundo o cronista árabe al-Umari, o preço do metal caiu por anos.

A fama chegou à Europa: o Atlas Catalão, de 1375, desenha o rei com uma pepita de ouro na mão. De volta, ele teria trazido sábios e arquitetos do mundo islâmico, e as cidades do Níger ganharam mesquitas e escolas. Depois da sua morte, o Mali declinou e, no século XV, foi superado pelos Songhai.`,
     so:['musa','musa-et','fonte','fita'],fonte:'fonte',
     foco:WA,focoM:WAm,
     tomadas:[[9000,RT5],[22000,Z(2840,940,1020,720)],[31000,Z(2840,900,1740,780)],[38000,Z(2100,1730,1300,880)]],
     tomadasM:[[9000,RT5m],[22000,Z(2860,980,880,640)],[28500,Z(3860,940,700,720)],[38000,Z(2100,1730,760,880)]],
     tracos:[{tipo:'circulo',peca:'musa',x:50,y:57,w:36,h:82,atraso:A(24000)},
             {tipo:'seta',de:{peca:'musa-et',x:50,y:0},para:{peca:'musa',x:50,y:92},curva:.2,atraso:A(25200)}]},
    {titulo:'Songhai: do Atlântico ao lago Chade',
     texto:`O ==Songhai==, reino antigo com centro em Gao, foi transformado em império por Sonni Ali Ber, a partir de 1464, no século XV. Ele tomou Tombuctu (1468) e Djenné (1473) e controlou o comércio do rio Níger, num domínio de mais de 2 mil quilômetros, do Atlântico ao lago Chade.

A principal moeda era o ==cauri==, uma concha usada da África à China, embora o ouro e o sal também fossem referência do comércio. Havia trabalho escravo e cidades de estudo, como a Universidade de Sankore, que teria reunido cerca de 25 mil estudantes. Em 1591, o império foi derrotado por um exército marroquino com armas de fogo, na batalha de Tondibi.`,
     so:['cauri','cauri-et','n-po','n-sankore','fita'],
     foco:RT6,focoM:RT6m,
     tomadas:[[9600,Z(2840,60,1440,960)],[23000,RT6],[28000,Z(2300,1730,1200,880)]],
     tomadasM:[[9600,Z(2840,60,720,780)],[15500,Z(3460,100,820,800)],[23000,RT6m],[28000,Z(2300,1730,760,880)]],
     tracos:[{tipo:'seta',de:{peca:'cauri-et',x:50,y:0},para:{peca:'cauri',x:52,y:92},curva:.2,atraso:A(6600)}]},
    {titulo:'Mães, rainhas e linhagens',
     texto:`Em muitas sociedades africanas, as mulheres tinham poder que a Europa patriarcal não dava. Entre os macua, do norte de Moçambique, a sociedade era ==matrilinear==: a descendência e a herança seguiam a linha da mãe, o governante tinha uma conselheira e as mulheres orientavam parte da economia. Matrilinear não quer dizer que as mulheres governavam: é um modo de contar o parentesco.

Na Núbia, rainhas, as ==candaces==, comandavam cerimônias, diplomacia e exércitos. Entre os iorubás, a mulher que se tornava mãe ganhava poderes considerados divinos. Esses exemplos contrastam com a tradição patriarcal europeia e mostram que não existe um papel feminino único na África.`,
     so:['mini','mini-et','arv','cand','cand-et','comp','n-matri'],
     foco:Z(40,2940,1020,860),focoM:Z(30,2960,780,900),
     tomadas:[[7500,Z(940,2920,1400,1060)],[19000,Z(2300,2940,880,820)],[26000,Z(940,3960,1760,540)]],
     tomadasM:[[7500,Z(950,2940,1360,1020)],[19000,Z(2330,2960,740,860)],[26000,Z(960,3980,880,500)],[31000,Z(1830,3980,880,500)]],
     tracos:[{tipo:'seta',de:{peca:'cand-et',x:50,y:0},para:{peca:'cand',x:50,y:94},curva:.2,atraso:A(21000)}]},
    {titulo:'Máscaras, arte e griôs',
     texto:`Não existe uma "arte africana" única: cada povo tinha sua cerâmica, suas estatuetas e suas ==máscaras==, usadas em guerras, nascimentos, colheitas e funerais, com materiais, tamanhos e sentidos variados. Entre os iorubás, a sociedade Gelede, presidida por mulheres, cercava a confecção das máscaras de rituais.

Os colonizadores trataram essas peças como objetos exóticos de museu, tirando-as de seu contexto. A memória era guardada pela ==tradição oral== dos griôs, contadores de histórias com música e dança, poupados até pelos inimigos para que a memória dos povos não se perdesse. A máscara de marfim da rainha Idia, do antigo reino de Benim, hoje na Nigéria, é um dos exemplos mais conhecidos dessa arte.`,
     so:['ma-t','m1','m2','m3','idia-et','vit','n-vit','grio','ond','grio-et'],
     foco:Z(100,4540,2080,1080),focoM:Z(100,4560,2060,1040),
     tomadas:[[8000,Z(760,4700,760,940)],[12500,Z(30,4640,860,1000)],[20500,Z(2330,4700,1260,1000)]],
     tomadasM:[[4000,Z(120,4700,640,760)],[8000,Z(800,4700,640,980)],[11000,Z(1500,4700,680,700)],[13500,Z(30,4660,820,1000)],[20500,Z(2340,4700,1060,1000)]],
     tracos:[{tipo:'seta',de:{peca:'idia-et',x:30,y:0},para:{peca:'m2',x:50,y:92},curva:.2,atraso:A(9000)}]}
  ]
});
})();
