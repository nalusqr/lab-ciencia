/* Módulo 1, tópico 3: Egito antigo. Conteúdo do piloto aprovado (piloto-vox.html), agora em dados.
   Coordenadas do mapa em pixels da base historia-egito-mapa (1152 x 928). Formato: docs/historia/MOTOR.md */
(function(){
// o Nilo, de Assuã ao vértice do delta, em pontos da base (desenhados sobre o mapa)
const NILO=[[800,925],[796,870],[800,830],[797,790],[774,750],[770,710],[745,670],[694,630],[662,590],[624,550],[600,510],[594,470],[590,430],[600,390],[616,350],[630,310],[637,270],[634,245]];
const DELTA_O=[[634,245],[606,190],[584,146],[558,108]];
const DELTA_L=[[634,245],[668,196],[700,165],[729,135]];
const S=Colagem.suave;
const RIO=S(NILO)+' '+S(DELTA_O)+' '+S(DELTA_L);
const BAIXO=[[478,172],[560,104],[700,98],[762,146],[644,262],[622,262]];

Colagem.montar({
  modulo:'Módulo 1: Pré-História e Antiguidade',
  titulo:'Egito antigo',
  subtitulo:'O rio, o faraó e quem trabalhava a terra',
  credito:'Fotos: reconstruções geradas por IA a partir de fontes arqueológicas. Mapa esquemático desenhado pelo LAB.',
  ritmo:9000,
  mesa:{w:1600,h:1000},
  jornal:[[1080,20,420,46,1],[40,730,300,30,-2]],
  enem:'Cobra a relação ==Nilo, agricultura e Estado==, o faraó como deus vivo (teocracia) e o tributo em produtos e em trabalho devido a um Estado centralizado.\n\nPegadinha: a frase "presente do rio" é de um autor grego. O ENEM gosta de pedir que você perceba o ==ponto de vista== de quem escreve. Outra: as pirâmides não foram obra de escravos acorrentados.',

  pecas:[
    {id:'mapa',tipo:'mapa',base:'historia-egito-mapa',x:60,y:60,w:800,h:644,giro:-2,rotulo:'Mapa do Egito antigo',
     camadas:[
      {tipo:'rotulo',p:[150,70],texto:'Mar Mediterrâneo',classe:'mar',atraso:0},
      {tipo:'rotulo',p:[905,560],texto:'Mar Vermelho',classe:'mar',giro:58,atraso:0},
      {tipo:'rotulo',p:[870,250],texto:'Sinai',classe:'terra',atraso:0},
      {tipo:'rotulo',p:[200,470],texto:'Deserto Ocidental',classe:'regiao',etapas:[0],atraso:2000},
      {tipo:'rotulo',p:[760,420],texto:'Deserto Oriental',classe:'regiao',giro:62,etapas:[0],atraso:2300},
      {tipo:'pulso',d:RIO,largura:46,etapas:[1],atraso:300},
      {tipo:'corredor',pts:NILO,largura:120,corte:[0,262,1152,700],desde:2,atraso:300},
      {tipo:'regiao',pts:BAIXO,suave:false,estilo:'listra',etapas:[2],atraso:700,dura:1900},
      {tipo:'regiao',pts:BAIXO,suave:false,desde:2,atraso:2500},
      {tipo:'rota',estilo:'rio',d:RIO,dur:2,atraso:300},
      {tipo:'rota',pts:NILO,invisivel:true,movel:'barco',volta:16000,desde:1,atraso:600},
      {tipo:'cidade',p:[628,272],nome:'Mênfis, a capital',capital:true,desde:1,atraso:1800},
      {tipo:'cidade',p:[772,715],nome:'Tebas',lado:'e',desde:2,atraso:1000},
      {tipo:'cidade',p:[798,882],nome:'Assuã',desde:2,atraso:1200},
      {tipo:'etiqueta',p:[300,560],texto:'Kemet, a terra negra',sub:'faixa de limo fértil',etapas:[1],atraso:1300},
      {tipo:'etiqueta',p:[250,150],texto:'Baixo Egito',etapas:[2],atraso:900,dura:1700},
      {tipo:'etiqueta',p:[330,620],texto:'Alto Egito',etapas:[2],atraso:1000,dura:1600},
      {tipo:'etiqueta',p:[250,380],texto:'Um só reino',sub:'cerca de 3100 a.C.',cor:'amarelo',desde:2,atraso:2700}
     ]},
    {id:'nilo',tipo:'foto',img:'historia-egito-nilo',x:900,y:80,w:600,h:338,giro:1.5,rotulo:'Foto recriada: camponeses e escriba na margem do Nilo'},
    {id:'pir',tipo:'foto',img:'historia-egito-piramide',x:930,y:470,w:600,h:338,giro:-1.8,fita:{x:12,g:3},rotulo:'Foto recriada: obra de uma pirâmide'},
    {id:'ret',tipo:'retrato',img:'historia-egito-nilo',zoom:3.4,foco:'62% 62%',x:740,y:440,w:150,h:150,rotulo:'Retrato: o escriba'},
    {id:'doc',tipo:'fonte',x:110,y:740,w:700,h:230,giro:-1,rotulo:'Fonte histórica: Heródoto',
     texto:'“A terra do Egito para onde os gregos navegam foi acrescentada aos egípcios: é um presente do rio.”',
     ref:'Heródoto, Histórias, livro II, cerca de 430 a.C. Tradução livre e resumida.',
     resposta:'Mostra a importância do Nilo para o Egito, vista por um **estrangeiro** que escreveu mais de dois mil anos depois da unificação. É preciso criticar a fonte: a riqueza do Egito também dependia do trabalho organizado de camponeses, escribas e do Estado.'},
    {id:'tempo',tipo:'tempo',x:860,y:850,w:660,h:70,giro:.6,
     marcos:[{p:10,t:'cerca de 3100 a.C.',etapa:2},{p:45,t:'cerca de 2560 a.C.',etapa:4},{p:84,t:'cerca de 430 a.C.',cor:'petroleo',etapa:5}]},
    {id:'n3',tipo:'nota',x:880,y:440,w:260,giro:-1.5,texto:'O escriba anota a colheita e calcula o imposto'},
    {id:'n4',tipo:'nota',x:1300,y:400,w:230,giro:2,texto:'Camponeses em turnos, pagos com pão e cerveja'}
  ],

  etapas:[
    {titulo:'Um rio no meio do deserto',foco:[40,40,840,684],mostra:['mapa'],
     texto:'O Egito antigo fica no nordeste da ==África==. Em volta, quase tudo é deserto.\n\nA vida se concentrava numa faixa estreita ao longo do ==Nilo==, que corre do sul para o norte e se abre em braços, o delta, antes de chegar ao Mediterrâneo.'},
    {titulo:'A cheia que fertiliza',foco:[300,170,470,560],
     texto:'Todo ano, entre julho e outubro, o Nilo ==enchia== e cobria os campos.\n\nQuando a água baixava, ficava uma lama escura e fértil, o ==limo==. Os egípcios chamavam sua terra de Kemet, a terra negra. Cheia fraca trazia fome; cheia forte demais destruía aldeias.'},
    {titulo:'Dois reinos, um faraó',foco:[200,50,560,680],
     texto:'Ao longo do rio havia dois reinos: o ==Alto Egito==, no sul, e o Baixo Egito, no delta.\n\nPor volta de 3100 a.C., um rei do sul unificou os dois. O ==faraó== era visto como um deus vivo, que garantia a cheia e a ordem do mundo. Isso é a teocracia.'},
    {titulo:'Quem fazia a terra produzir',foco:[720,60,820,540],mostra:['nilo','ret'],so:['n3'],
     tracos:[{tipo:'circulo',peca:'nilo',x:62,y:62,w:17,h:34},{tipo:'seta',de:{peca:'nilo',x:56,y:76},para:{peca:'n3',x:66,y:0},curva:.18}],
     texto:'O rio dava a água, mas era o ==trabalho humano== que fazia a terra produzir: canais, diques e calendário.\n\nOs camponeses entregavam parte da colheita como imposto. Os ==escribas== anotavam tudo.'},
    {titulo:'Quem construiu as pirâmides',foco:[860,380,700,560],mostra:['pir','tempo'],so:['n4'],
     tracos:[{tipo:'circulo',peca:'pir',x:52,y:64,w:42,h:37},{tipo:'seta',de:{peca:'pir',x:70,y:50},para:[1372,504],curva:-.3}],
     texto:'A grande pirâmide de Quéops ficou pronta por volta de 2560 a.C.\n\nA arqueologia mostra que não foram escravos acorrentados: eram ==camponeses convocados em turnos==, na época da cheia, pagos com rações de pão e cerveja. Esse trabalho obrigatório se chama ==corveia==.'},
    {titulo:'O que essa fonte mostra?',foco:[80,700,820,300],mostra:['doc'],fonte:'doc',
     tracos:[{tipo:'circulo',peca:'doc',x:64,y:49,w:37,h:24,cor:'seta',espessura:5}],
     texto:'Leia o trecho de ==Heródoto==, um viajante grego. Para ele, o próprio solo do delta foi formado pela lama que o rio trouxe.'}
  ]
});
})();
