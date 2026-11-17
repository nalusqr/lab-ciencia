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
  mesa:{w:3450,h:3400},
  enem:'O ENEM cobra a ==Revolução Neolítica== como causa do sedentarismo, do excedente, da divisão do trabalho e, mais tarde, das cidades e do Estado. Também usa a ==arte rupestre==, inclusive a da Serra da Capivara, como fonte histórica.\n\nPegadinhas: tratar povos sem escrita como “sem história”; pensar a evolução como uma escada em que “o homem veio do macaco” (humanos e outros primatas têm ancestrais comuns); achar que a agricultura surgiu de repente e num só lugar.',

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
      {tipo:'rotulo',p:[652,176],texto:'Europa',classe:'regiao',tam:.62},
      {tipo:'rotulo',p:[130,250],texto:'América do Norte',classe:'regiao',tam:.8},
      {tipo:'rotulo',p:[372,470],texto:'América do Sul',classe:'regiao',tam:.5},
      {tipo:'rotulo',p:[1118,556],texto:'Austrália',classe:'regiao',tam:.55},
      {tipo:'rotulo',p:[420,360],texto:'Oceano Atlântico',classe:'mar',tam:.62},
      {tipo:'rotulo',p:[40,560],texto:'Oceano Pacífico',classe:'mar',tam:.62},
      {tipo:'rotulo',p:[860,640],texto:'Oceano Índico',classe:'mar',tam:.62},
      // etapa 2: a África e o leste do continente
      {tipo:'regiao',ll:true,pts:AFRICA,suave:false,cor:'coral',opac:.4,etapas:[1],atraso:A(500)},
      {tipo:'regiao',ll:true,pts:LESTE,suave:false,cor:'coral',opac:.9,etapas:[1],atraso:A(1500)},
      {tipo:'cidade',ll:true,p:[35.2,-3.2],nome:'Laetoli',sub:'Tanzânia',lado:'d',tam:1.1,etapas:[1],atraso:A(2400)},
      {tipo:'cidade',ll:true,p:[-8.9,32],nome:'Jebel Irhoud',sub:'Marrocos, cerca de 300 mil anos',lado:'e',tam:1.1,etapas:[1],atraso:A(3000)},
      // etapa 4: a dispersão do Homo sapiens, sem datas exatas
      {tipo:'rota',ll:true,pts:[[36,3],[36,15],[34.5,28],[40,34],[56,34],[70,25],[86,24],[100,17],[110,24],[119,31]],dur:2.2,etapas:[3],atraso:A(5200)},
      {tipo:'rota',ll:true,pts:[[35,33],[28,40],[15,46],[2,47],[-6,43]],dur:1.8,etapas:[3],atraso:A(6600)},
      {tipo:'rota',ll:true,pts:[[100,16],[108,3],[120,-6],[133,-14],[142,-24]],dur:1.8,etapas:[3],atraso:A(8000)},
      {tipo:'rota',ll:true,pts:[[88,40],[100,52],[120,60],[145,65],[170,66],[179,66]],dur:2,etapas:[3],atraso:A(9300)},
      {tipo:'rota',ll:true,pts:[[-160,66],[-150,60],[-130,50],[-118,36],[-104,22],[-90,13],[-78,0],[-72,-18],[-70,-38]],dur:2.6,etapas:[3],atraso:A(10600)},
      {tipo:'etiqueta',ll:true,p:[60,-46],texto:'há dezenas de milhares de anos',cor:'amarelo',tam:1.1,etapas:[3],atraso:A(12400)},
      // etapa 6: arte rupestre
      {tipo:'cidade',ll:true,p:[4.4,44.4],nome:'Chauvet',sub:'França',lado:'d',tam:1.1,etapas:[5],atraso:A(5200)},
      {tipo:'cidade',ll:true,p:[1.2,45.05],nome:'Lascaux',sub:'França',lado:'e',tam:1.1,etapas:[5],atraso:A(5800)},
      {tipo:'cidade',ll:true,p:[-42.5,-8.8],nome:'Serra da Capivara',sub:'Piauí, Brasil',lado:'e',tam:1.1,capital:true,etapas:[5],atraso:A(6500)},
      // etapa 7: o gelo recua
      {tipo:'regiao',ll:true,pts:[[-10,72],[40,74],[62,70],[62,55],[40,50],[18,48],[5,50],[-8,53]],cor:'#e6f4fb',opac:.94,mistura:false,etapas:[6],atraso:A(300),dura:3600},
      {tipo:'regiao',ll:true,pts:[[-5,71],[30,73],[40,70],[28,66],[12,64],[2,66]],cor:'#e6f4fb',opac:.94,mistura:false,etapas:[6],atraso:A(300)},
      // etapa 8: centros independentes de agricultura
      {tipo:'regiao',ll:true,pts:[[34.5,31.5],[35,34.5],[37,37],[41,37.8],[44.5,37],[47,34.5],[48.5,31.5],[46.5,31.5],[44.5,34],[41,35],[37.5,34],[36.5,31.5]],cor:'coral',opac:.92,etapas:[7],atraso:A(500)},
      {tipo:'etiqueta',ll:true,p:[37,27.5],texto:'cerca de 9500 a.C.',cor:'amarelo',tam:1.05,etapas:[7],atraso:A(1300)},
      {tipo:'regiao',ll:true,pts:[[106,40],[118,40],[122,34],[116,32],[108,33]],cor:'coral',opac:.92,etapas:[7],atraso:A(2200)},
      {tipo:'etiqueta',ll:true,p:[124,41],texto:'Norte da China',tam:.8,etapas:[7],atraso:A(2500)},
      {tipo:'regiao',ll:true,pts:[[-103,22],[-96,21],[-90,18],[-92,15],[-100,16]],cor:'coral',opac:.92,etapas:[7],atraso:A(3200)},
      {tipo:'etiqueta',ll:true,p:[-104,29],texto:'Mesoamérica',tam:.8,etapas:[7],atraso:A(3500)},
      {tipo:'regiao',ll:true,pts:[[-79,-6],[-72,-8],[-68,-16],[-72,-19],[-77,-13]],cor:'coral',opac:.92,etapas:[7],atraso:A(4200)},
      {tipo:'etiqueta',ll:true,p:[-94,-23],texto:'Andes',tam:.8,etapas:[7],atraso:A(4500)},
      {tipo:'regiao',ll:true,pts:[[141,-5],[147,-5.5],[148,-8],[142,-8]],suave:false,cor:'coral',opac:.95,etapas:[7],atraso:A(5200)},
      {tipo:'etiqueta',ll:true,p:[134,6],texto:'Nova Guiné',tam:.8,etapas:[7],atraso:A(5500)},
      {tipo:'regiao',ll:true,pts:[[-15,13],[0,16],[15,16],[30,14],[30,10],[15,9],[0,10],[-12,11]],cor:'coral',opac:.92,etapas:[7],atraso:A(6200)},
      {tipo:'etiqueta',ll:true,p:[-8,20],texto:'Sahel',tam:.8,etapas:[7],atraso:A(6500)},
      // etapa 9: os vales dos grandes rios e as primeiras cidades
      {tipo:'corredor',ll:true,pts:[[31,31],[31.2,30],[31,27],[32.6,25.7],[32.9,24],[33.5,20],[33,17]],largura:24,cor:'coral',opac:.85,etapas:[8],atraso:A(4800)},
      {tipo:'corredor',ll:true,pts:[[36,36.7],[40,35.5],[42,34.4],[44,32.5],[45.5,31],[47.5,30.5]],largura:24,cor:'coral',opac:.85,etapas:[8],atraso:A(5300)},
      {tipo:'corredor',ll:true,pts:[[41,37.8],[43,36.3],[44.4,33.3],[46,32],[47.5,30.8]],largura:24,cor:'coral',opac:.85,etapas:[8],atraso:A(5600)},
      {tipo:'cidade',ll:true,p:[45.6,31.3],nome:'Uruk',lado:'d',tam:1.2,etapas:[8],atraso:A(6200)},
      {tipo:'cidade',ll:true,p:[31.25,29.85],nome:'Mênfis',lado:'e',tam:1.2,etapas:[8],atraso:A(6700)}
    ]},
    {id:'pegadas',tipo:'icone',nome:'pegadas',legenda:'Pegadas de Laetoli',x:1310,y:2310,w:200,h:200,giro:3,rotulo:'Recorte: pegadas fossilizadas em cinza vulcânico'},
    {id:'et-bip',tipo:'etiqueta',x:1560,y:2400,w:190,h:50,texto:'bipedismo',clicavel:false},
    {id:'arbusto',tipo:'icone',nome:'arbusto',legenda:'O arbusto da evolução',x:640,y:2230,w:240,h:240,giro:-2,rotulo:'Recorte: o arbusto da evolução humana'},
    {id:'tempo',tipo:'tempo',x:860,y:1790,w:820,h:80,giro:.5,
     marcos:[{p:10,t:'cerca de 10 000 a.C.',etapa:6},{p:30,t:'cerca de 9500 a.C.',etapa:7},{p:50,t:'cerca de 3200 a.C.',cor:'petroleo',etapa:8},{p:70,t:'cerca de 3000 a.C.',cor:'petroleo',etapa:8},{p:90,t:'cerca de 1200 a.C.',cor:'petroleo',etapa:8}]},
    {id:'micro',tipo:'icone',nome:'microlitos',legenda:'Micrólitos numa haste',x:820,y:1960,w:250,h:250,giro:-3,rotulo:'Recorte: pequenas lâminas de pedra presas numa haste de madeira'},
    {id:'et-fp',tipo:'etiqueta',x:850,y:2250,w:260,h:54,texto:'ferramentas pequenas',clicavel:false},
    {id:'mamute',tipo:'mamute',x:1440,y:1940,w:210,h:210,giro:2,rotulo:'Silhueta de mamute que desbota'},
    {id:'mao',tipo:'mao',x:1020,y:2245,w:200,h:120,giro:-4,rotulo:'Mão recortada que aponta para a Serra da Capivara'},
    {id:'n-datas',tipo:'nota',x:650,y:2300,w:280,giro:-2,texto:'As datas variam por sítio e são debatidas'},
    {id:'pir',tipo:'piramide',x:1320,y:2240,w:380,h:176,giro:1.5,alturaCamada:90,rotulo:'Pirâmide social: rei, escribas e sacerdotes, camponeses e artesãos',
     camadas:[{t:'Rei',s:'controla o excedente'},{t:'Escribas e sacerdotes'},{t:'Camponeses e artesãos'}]},
    {id:'et-prox',tipo:'etiqueta',x:1370,y:2445,w:320,h:52,texto:'Próximo: Mesopotâmia',clicavel:false},

    /* zona 3: quatro hipóteses */
    {id:'hp-bip',tipo:'hipotese',icone:'pe',texto:'bipedismo',x:2240,y:100,w:340,h:170,giro:-1.5,rotulo:'Hipótese: bipedismo'},
    {id:'hp-caca',tipo:'hipotese',icone:'lanca',texto:'caça',x:2580,y:330,w:340,h:170,giro:1.5,rotulo:'Hipótese: caça'},
    {id:'hp-cer',tipo:'hipotese',icone:'cerebro',texto:'cerebralização',x:2240,y:560,w:400,h:170,giro:-1,rotulo:'Hipótese: cerebralização'},
    {id:'hp-ling',tipo:'hipotese',icone:'fala',texto:'linguagem',x:1900,y:330,w:340,h:170,giro:2,rotulo:'Hipótese: linguagem'},
    {id:'et-cer',tipo:'etiqueta',x:2290,y:750,w:360,h:76,texto:'versão de hoje: crescimento gradual',clicavel:false},

    /* zona 4: acampamento */
    {id:'camp',tipo:'fotomanchas',img:'historia-pre-paleolitico',x:2500,y:1930,w:900,h:502,giro:-.8,fita:{x:8,g:-3},rotulo:'Foto recriada: acampamento de caçadores-coletores',
     manchas:[{x:46,y:76,w:7,h:11,et:'3,4,5',pulsa:true},{x:22,y:37,w:9,h:14,et:'5'}]},
    {id:'et-lasca',tipo:'etiqueta',x:3040,y:1850,w:300,h:54,texto:'pedra lascada',clicavel:false},
    {id:'et-com',tipo:'etiqueta',x:2540,y:1790,w:340,h:54,texto:'“comunismo primitivo”',clicavel:false},
    {id:'et-mat',tipo:'etiqueta',x:2960,y:1790,w:300,h:54,texto:'“matriarcalismo”',clicavel:false},
    {id:'n-com',tipo:'nota',x:2560,y:1860,w:260,giro:-1.5,texto:'nome do século XIX'},
    {id:'n-mat',tipo:'nota',x:2970,y:1858,w:300,giro:1.5,texto:'hipótese, não governo das mulheres'},

    /* zona 5: aldeia neolítica */
    {id:'casa',tipo:'icone',nome:'casa-barro',legenda:'Casa de barro',x:600,y:2720,w:230,h:230,giro:-2,atraso:A(5000),rotulo:'Recorte: casa de barro'},
    {id:'mo',tipo:'icone',nome:'mo',legenda:'Mó de pedra',x:850,y:2720,w:230,h:230,giro:2,atraso:A(5400),rotulo:'Recorte: mó de pedra e grãos'},
    {id:'trigo',tipo:'icone',nome:'trigo',legenda:'Trigo',x:1100,y:2720,w:230,h:230,giro:-1,atraso:A(5800),rotulo:'Recorte: espigas de trigo'},
    {id:'cabra',tipo:'icone',nome:'cabra',legenda:'Cabra no cercado',x:1350,y:2720,w:230,h:230,giro:2,atraso:A(6200),rotulo:'Recorte: cabra no cercado'},
    {id:'pote',tipo:'icone',nome:'pote',legenda:'Pote de cerâmica',x:600,y:2990,w:230,h:230,giro:1,atraso:A(6600),rotulo:'Recorte: pote de cerâmica'},
    {id:'tear',tipo:'icone',nome:'tear',legenda:'Tear',x:850,y:2990,w:230,h:230,giro:-2,atraso:A(7000),rotulo:'Recorte: tear'},
    {id:'celeiro',tipo:'icone',nome:'celeiro',legenda:'Celeiro de grãos',x:1100,y:2990,w:230,h:230,giro:1.5,atraso:A(7400),rotulo:'Recorte: celeiro de grãos'},
    {id:'machado',tipo:'icone',nome:'pedra-polida',legenda:'Machado de pedra polida',x:1350,y:2990,w:230,h:230,giro:-2,atraso:A(7800),rotulo:'Recorte: machado de pedra polida'},
    {id:'et-pol',tipo:'etiqueta',x:1640,y:3090,w:270,h:54,texto:'pedra polida',clicavel:false},
    {id:'n-exc',tipo:'nota',x:1040,y:3262,w:330,giro:-1.5,texto:'excedente: o que sobra depois de comer'},

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
     foco:[30,20,780,480],foco2:[520,20,1020,620],foco2Em:4800,focoM:[40,30,540,420],foco2M:[660,30,640,600],tempo:13000,
     texto:'Chamamos de ==Pré-História== o longo tempo anterior à escrita, que surgiu por volta de 3200 a.C., na Mesopotâmia. A divisão é antiga e hoje é criticada: povos sem escrita também têm história, e nós a conhecemos por ossos, ferramentas, fogueiras e pinturas, as ==fontes materiais==.\n\nOs livros dividem esse tempo pelo material das ferramentas: Paleolítico, Mesolítico e Neolítico. Depois vem a Idade dos Metais.'},

    {titulo:'Tudo começou na África',mostra:['mapa'],so:['pegadas','et-bip','arbusto'],
     foco:[640,1930,1140,600],focoM:[1020,2080,320,320],
     tracos:[{tipo:'circulo',peca:'pegadas',x:60.5,y:50,w:24,h:34,atraso:A(4200)},{tipo:'seta',de:{peca:'pegadas',x:74,y:56},para:{peca:'et-bip',x:0,y:50},curva:.3,atraso:A(5000)}],
     texto:'A ==hominização== é o processo, de milhões de anos, que levou ao ser humano atual. Ele aconteceu na ==África==: lá estão os fósseis mais antigos de hominídeos e do Homo sapiens, de cerca de 300 mil anos.\n\nNão foi uma escada, mas um arbusto de espécies, algumas vivendo ao mesmo tempo. A primeira hipótese é o ==bipedismo==: andar sobre dois pés liberou as mãos para carregar e fabricar.'},

    {titulo:'Quatro hipóteses, nenhuma sozinha',mostra:['hp-bip','hp-caca','hp-cer','hp-ling'],so:['et-cer'],
     foco:[1860,40,1100,880],
     tracos:[
      {tipo:'seta',de:{peca:'hp-bip',x:100,y:70},para:{peca:'hp-caca',x:55,y:0},curva:-.25,atraso:A(1200)},
      {tipo:'seta',de:{peca:'hp-caca',x:55,y:100},para:{peca:'hp-cer',x:100,y:30},curva:-.25,atraso:A(2300)},
      {tipo:'seta',de:{peca:'hp-cer',x:0,y:70},para:{peca:'hp-ling',x:55,y:100},curva:-.25,atraso:A(3400)},
      {tipo:'seta',de:{peca:'hp-ling',x:55,y:0},para:{peca:'hp-bip',x:0,y:30},curva:-.25,atraso:A(4500)}],
     texto:'Há mais três hipóteses. Pela ==teoria da caça==, caçar em grupo exigiu planejar e aperfeiçoou habilidades. Pela ==teoria da cerebralização==, uma mutação teria deixado alguns hominídeos mais inteligentes; hoje se sabe que o cérebro cresceu aos poucos, ao longo de milhões de anos, e não num salto.\n\nPela teoria da linguagem, falar permitiu cooperar, ensinar e organizar o grupo. Os cientistas hoje combinam esses fatores, que se reforçam.'},

    {titulo:'Paleolítico: pedra lascada e fogo',mostra:['camp'],so:['et-lasca'],
     foco:[2440,1790,1000,680],focoM:[2860,1880,520,560],foco2:[560,1880,1220,650],foco2M:[640,1950,1000,560],foco2Em:6200,tempo:16000,
     tracos:[{tipo:'circulo',peca:'camp',x:82,y:87,w:20,h:13,cor:'seta',atraso:A(900)},{tipo:'circulo',peca:'camp',x:81.6,y:35.5,w:7.5,h:13,cor:'seta',atraso:A(1700)},
             {tipo:'seta',de:{peca:'camp',x:81.6,y:27},para:{peca:'et-lasca',x:55,y:100},curva:.3,atraso:A(2600)}],
     texto:'No Paleolítico, a fase mais longa, os grupos faziam instrumentos de ==pedra lascada==, batendo uma pedra contra a outra, além de osso e madeira. Viviam da caça, da pesca e da coleta e eram ==nômades==: mudavam de lugar quando a comida acabava.\n\nO ==domínio do fogo==, há centenas de milhares de anos, trouxe calor, proteção, luz e comida cozida. Aos poucos, os humanos ocuparam todos os continentes, menos a Antártida.'},

    {titulo:'Comunismo primitivo e matriarcalismo',so:['et-com','et-mat','n-com','n-mat'],
     foco:[2470,1770,960,700],focoM:[2640,1780,580,560],
     tracos:[{tipo:'circulo',peca:'camp',x:37,y:64,w:14,h:18,cor:'amarelo',atraso:A(900)}],
     texto:'Os livros chamam a sociedade paleolítica de ==comunismo primitivo==: sem propriedade privada da terra e sem classes, com a comida dividida no grupo. O nome vem de autores do século XIX, como Engels, e simplifica: havia diferenças de idade, prestígio e tarefas.\n\nFala-se também em ==matriarcalismo==, pouca diferença entre homens e mulheres. Não há provas de que mulheres governassem, mas seu papel na coleta e na vida do grupo era central.'},

    {titulo:'A arte das cavernas',so:['mao','n-datas'],
     foco:[2500,1930,520,300],foco2:[640,2000,700,420],foco2M:[700,2040,500,360],foco2Em:5200,tempo:14000,
     tracos:[{tipo:'circulo',peca:'camp',x:22,y:37,w:11,h:18,cor:'amarelo',atraso:A(900)}],
     texto:'Os grupos paleolíticos deixaram ==pinturas rupestres== em cavernas e abrigos de pedra: animais, cenas de caça, mãos carimbadas e figuras humanas, feitas com carvão e pigmentos de terra. Não sabemos com certeza o sentido delas: magia para a caça, rituais, memória do grupo.\n\nO Brasil tem um dos maiores conjuntos das Américas, na ==Serra da Capivara==, no Piauí. Essas imagens são ==fontes históricas==, mesmo sem escrita.'},

    {titulo:'Mesolítico: a transição',mostra:['tempo'],so:['micro','et-fp','mamute'],
     foco:[800,1780,880,600],focoM:[820,1940,480,330],
     tracos:[{tipo:'circulo',peca:'micro',x:42,y:40,w:68,h:56,atraso:A(1600)},{tipo:'seta',de:{peca:'micro',x:42,y:70},para:{peca:'et-fp',x:50,y:0},curva:.3,atraso:A(2500)}],
     texto:'Por volta de 10 000 a.C., terminou a última era glacial. O clima esquentou, o gelo recuou, o nível do mar subiu e muitos grandes animais, como o mamute, desapareceram.\n\nComeça o ==Mesolítico==, uma ==fase de transição==: ferramentas pequenas e afiadas, mais pesca e coleta de sementes, acampamentos usados por mais tempo. O nome vale sobretudo para a Europa; no Oriente Próximo, essa fase logo levou ao cultivo.'},

    {titulo:'A Revolução Neolítica',mostra:['casa','mo','trigo','cabra','pote','tear','celeiro','machado'],so:['et-pol','n-exc'],
     foco:[560,1770,1220,760],focoM:[560,1850,1220,700],foco2:[560,2690,1400,620],foco2M:[600,2700,1000,560],foco2Em:7600,tempo:18000,
     tracos:[{tipo:'circulo',peca:'machado',x:64,y:35,w:50,h:36,cor:'seta',atraso:A(9600)},{tipo:'seta',de:{peca:'machado',x:92,y:38},para:{peca:'et-pol',x:0,y:50},curva:.25,atraso:A(10400)},
             {tipo:'circulo',peca:'celeiro',x:50,y:54,w:56,h:66,cor:'seta',atraso:A(11800)},{tipo:'seta',de:{peca:'celeiro',x:50,y:92},para:{peca:'n-exc',x:30,y:0},curva:.3,atraso:A(12600)}],
     texto:'No Neolítico, da ==pedra polida==, veio a maior virada: a ==Revolução Neolítica==, com agricultura e criação de animais, a partir de cerca de 9500 a.C. no Crescente Fértil. Foi lenta e ocorreu também, de forma independente, na China, nas Américas e na África.\n\nPlantar fixou as pessoas: o ==sedentarismo==. A economia era de subsistência, mas surgiu o excedente, e com ele a divisão do trabalho, a cerâmica e a tecelagem.'},

    {titulo:'Metais e cidades',mostra:['cobre','bronze','ferro','doc','pir','et-prox'],fonte:'doc',
     foco:[30,430,1500,700],focoM:[60,560,560,520],foco2:[1000,2030,740,480],foco2M:[1100,2060,500,400],foco2Em:7500,tempo:18000,
     tracos:[{tipo:'circulo',peca:'pir',x:50,y:16,w:44,h:28,atraso:A(9500)}],
     texto:'Depois vieram os metais: o cobre; o bronze, mistura de cobre e estanho, por volta de 3000 a.C.; e o ferro, difundido por volta de 1200 a.C. Fazer metal exigia artesãos especializados e comércio, a ==metalurgia==.\n\nNos vales dos grandes rios, aldeias viraram cidades: a ==revolução urbana==. Surgem a ==diferenciação social==, entre quem produz e quem controla o excedente, o Estado e a escrita. Para os livros, aqui termina a Pré-História.'}
  ]
});
})();
