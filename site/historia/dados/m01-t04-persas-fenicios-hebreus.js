/* Módulo 1, tópico 4: Fenícios, hebreus e persas. Roteiro revisado: docs/revisao-historia/m01-t04-persas-fenicios-hebreus.md
   Formato dos dados: docs/historia/MOTOR.md. Coordenadas do mapa em longitude e latitude (ll:true) sobre a base historia-mapa-mediterraneo;
   a peça do mapa tem escala 1,8 na mesa (2477 x 1382), por isso Mp() e F() convertem longitude e latitude em pixels da mesa.
   Mesa em zonas: mapa (topo esquerdo), fita do tempo (embaixo do mapa), recortes fenícios (topo, meio), relevo e moeda de Dario (topo direito),
   alfabeto (meio esquerdo), hebreus (meio), Torá (embaixo esquerdo), Cilindro de Ciro (embaixo, meio), zoroastrismo (embaixo direito). */
(function(){
const A=n=>Colagem.reduz?0:n;                      // atrasos só com movimento
const BASE='historia-mapa-mediterraneo',S=2477/1376;
const Mp=(lon,lat)=>{const q=Colagem.lonlat(BASE,lon,lat);return [Math.round(q[0]*S),Math.round(q[1]*S)];};
const F=(l0,a0,l1,a1)=>{const p=Mp(l0,a0),q=Mp(l1,a1);return [p[0],p[1],q[0]-p[0],q[1]-p[1]];};

const FEN=[[35.08,33.05],[35.2,33.3],[35.37,33.58],[35.5,33.9],[35.65,34.15],[35.8,34.45],[35.95,34.65],[36.45,34.6],[36.35,34.0],[36.05,33.5],[35.62,33.06]];
const JORDAO=[[35.6,33.2],[35.6,32.8],[35.58,32.4],[35.52,32.0],[35.5,31.75]];
const CANAA=[[34.3,31.3],[34.6,31.9],[34.95,32.55],[35.1,33.1],[35.65,33.25],[35.85,32.6],[35.75,31.9],[35.5,31.2],[35.1,30.9]];
const ISRAEL=[[34.75,31.88],[34.95,32.55],[35.1,33.1],[35.65,33.25],[35.85,32.6],[35.75,31.9]];
const JUDA=[[34.45,31.25],[34.75,31.88],[35.75,31.9],[35.5,31.2],[35.1,30.9]];
const IRA=[[48.8,30.2],[50.5,29.2],[52.8,27.6],[55,26.7],[56.3,27.0],[56.8,27.6],[56.8,36.9],[54,36.9],[51,36.7],[49.2,37.3],[47.9,38.4],[46.2,38.0],[45.5,36.0],[46.2,34.0],[47.6,32.4]];
const LIDIA=[[26.2,39.5],[27.1,38.2],[28.0,37.3],[31,36.4],[34,36.3],[36,36.8],[36.4,38.5],[36,41],[33,42],[30,41.2],[27.5,40.3]];
const FARS=[[49.4,29.9],[50.6,28.9],[52.8,27.6],[55,26.9],[56.6,27.3],[56.8,29.6],[55.2,31.4],[52.5,31.7],[50.4,31.3]];
const MEDIOS=[[45.6,36.0],[46.2,34.0],[48.2,33.0],[50.4,31.5],[52.5,31.7],[55.2,31.4],[56.8,31.6],[56.8,36.9],[54,36.9],[51,36.7],[49.2,37.3],[47.9,38.4],[46.2,38.0]];
const BAB=[[48.2,29.8],[48.8,31.2],[47.6,33.5],[46.2,35.5],[43.5,37.3],[41,37.2],[38,36.8],[36,36.3],[35.8,35],[35.1,33.2],[34.7,31.4],[35.8,30.2],[38,31.5],[42,31.6],[44.8,29.8],[47.5,29.0]];
const EGITO=[[25,31.7],[29,31.2],[32,31.3],[34.2,31.2],[34.9,29.5],[34.0,27.8],[35.6,24.0],[36.8,22.1],[25,22.0]];
const IMPERIO=[[24.8,31.6],[25.6,38.5],[26.5,40.5],[29,41.2],[34,42],[41,41.6],[44,41.2],[47,41],[49,38.5],[53,37.2],[56.8,37.6],[56.8,24.5],[48.5,28.5],[44,29.5],[38,29.8],[35,28.4],[34,25.5],[36.8,22.1],[24.8,22.1]];
const ROYAL=[[27.95,38.48],[30,39.2],[32,39.7],[35,39.3],[37.5,38.2],[40,37.8],[43,36.4],[45,35.8],[47,33.5],[48.2,32.19]];
const EXILIO=[[35.42,31.78],[35.7,33],[37.5,35],[40.5,34.8],[42.8,33.8],[44.4,32.5]];
const TIRO=[35.2,33.27];
const TL=(x,w)=>[x,4350,w,250];                  // enquadra um trecho da fita do tempo
const TRONCO=[[35.2,33.27],[31,33.9],[26,34.0],[21,34.5]];
const R_SICILIA=TRONCO.concat([[16,35.8],[13.6,36.6],[12.8,37.3],[12.5,37.8]]);
const R_SARDENHA=TRONCO.concat([[16,35.8],[13.4,36.7],[11.6,38.0],[9.6,38.9],[9.1,39.1]]);
const R_CARTAGO=TRONCO.concat([[16,35.8],[13.4,36.7],[11.6,37.9],[10.6,37.3],[10.3,36.88]]);
const R_GADIR=TRONCO.concat([[16,36.0],[12.5,37.7],[8,37.8],[3,37.6],[-1,36.7],[-4.2,36.1],[-5.6,35.95],[-6.3,36.45]]);
const R_CHIPRE=[[35.2,33.27],[34.4,33.9],[33.7,34.8]];

Colagem.montar({
  modulo:'Módulo 1: Pré-História e Antiguidade',
  titulo:'Fenícios, hebreus e persas',
  subtitulo:'O mar, um só Deus e um império de muitos povos',
  credito:'Figura do relevo: recriação gerada por IA a partir dos relevos de Persépolis. Recortes, esquemas e mapa desenhados pelo LAB.',
  ritmo:10000,
  celularGrande:true,
  msPalavra:250,
  mesa:{w:5900,h:4800},
  enem:`O ENEM costuma cobrar as **heranças** desses povos: o ==alfabeto fenício== como base da escrita ocidental, o ==monoteísmo hebraico== como raiz do judaísmo, do cristianismo e do islamismo, e a ==administração persa== como solução para governar um império diverso. Questões com trechos da Bíblia pedem que o aluno a trate como fonte histórica e cultural, e não como prova de todos os fatos narrados.

Pegadinhas:
- Dizer que os fenícios formaram um império territorial; eram cidades-estado.
- Atribuir aos fenícios um alfabeto com vogais; quem as acrescentou foram os gregos.
- Dizer que os fenícios "inventaram a escrita"; eles fixaram e espalharam o alfabeto.
- Confundir a tolerância persa com ausência de dominação; havia tributo e controle.
- Confundir a tolerância persa com respeito moderno a direitos; era uma troca por tributo e obediência.
- Confundir os hebreus antigos com o atual Estado de Israel, criado em 1948.`,
  estudo:[
  {titulo:'Três povos, três heranças',texto:`Este tópico reúne três povos do Oriente Próximo que os livros estudam juntos porque deixaram heranças duradouras: os **fenícios**, o alfabeto e o comércio marítimo; os **hebreus**, o monoteísmo; e os **persas**, um modelo de administração imperial e de tolerância. Seguimos a ordem do tempo: fenícios e hebreus já existiam quando os persas formaram seu império, e os persas acabaram dominando os dois.`},
  {titulo:'Fenícios: comércio e alfabeto',texto:`Os fenícios ocupavam uma faixa estreita de litoral, onde hoje fica o **Líbano**, entre montanhas e o mar. Com pouca terra fértil, voltaram-se para o mar. Organizavam-se em **cidades-estado** independentes, como **Biblos, Tiro e Sídon**, governadas por reis e, na prática, por ricas famílias de comerciantes. Por isso, alguns livros dizem que eram dominadas por uma elite de mercadores, uma **plutocracia**.

A economia se baseava no **comércio marítimo** e no **artesanato de luxo**: madeira de cedro, vidro, marfim e tecidos tingidos de **púrpura**, um corante tirado de um molusco. Eles criaram uma rede de **feitorias**, entrepostos comerciais espalhados pelo Mediterrâneo, da Sicília e do norte da África até a Península Ibérica. A mais importante foi **Cartago**, fundada segundo a tradição por volta de 814 a.C., que mais tarde rivalizou com Roma nas **Guerras Púnicas**.

Sua maior herança foi o **alfabeto** de 22 letras, todas consoantes, fixado por volta de 1000 a.C. Ele simplificou a escrita e facilitou o comércio. Os gregos o adaptaram e acrescentaram as vogais, e do alfabeto grego derivou o latino, que usamos hoje.`},
  {titulo:'Hebreus: história e fé',texto:`Os **hebreus** viviam em Canaã, mais tarde chamada **Palestina** pelos romanos. A principal fonte sobre eles é a **Bíblia hebraica**, que deve ser lida com crítica, porque é um texto religioso escrito ao longo de séculos. Ela narra três fases:
- **Patriarcas:** Abraão teria levado seu povo da Mesopotâmia a Canaã.
- **Juízes:** após o período no Egito e o Êxodo, liderado por Moisés, as doze tribos foram chefiadas por juízes.
- **Reis:** Saul, Davi e Salomão formaram uma monarquia unida, com capital em Jerusalém e o Templo.

A arqueologia confirma a existência de um povo chamado Israel em Canaã por volta de 1208 a.C., na estela de Merneptá, e de reinos nos séculos seguintes, mas não confirma episódios como o Êxodo. Depois de Salomão, houve o **cisma**: o reino se dividiu em **Israel**, ao norte, e **Judá**, ao sul. Israel foi destruído pelos **assírios** em 722 a.C. Judá foi conquistado pelos **babilônios** em 587 a.C., e parte do povo foi levada para o **cativeiro babilônico**. Em 539 a.C., o persa Ciro permitiu a volta a Jerusalém.

A grande marca dos hebreus é o **monoteísmo ético**: um só Deus, sem imagens, ligado a normas de justiça e de comportamento, como os Dez Mandamentos. O livro sagrado é a **Torá**, os cinco primeiros livros da Bíblia. Sob domínio romano, revoltas levaram à destruição do Templo em 70 d.C. e à expulsão dos judeus de Jerusalém após 135 d.C., ampliando a **diáspora**. O judaísmo é a base do **cristianismo** e influenciou o **islamismo**.`},
  {titulo:'Persas: um império de muitos povos',texto:`Os **persas** viviam no planalto do atual **Irã**. Com **Ciro**, a partir de cerca de 550 a.C., venceram os medos, conquistaram a Lídia e, em 539 a.C., a Babilônia. Seu filho **Cambises** conquistou o Egito em 525 a.C. O império chegou a ir do Egito e da Ásia Menor até o vale do Indo, ocupando áreas dos atuais Irã, Afeganistão, Paquistão e Oriente Médio.

A política de Ciro ficou conhecida pela **tolerância**: os povos conquistados mantinham sua religião, sua língua e seus costumes, desde que pagassem **tributos** e fossem leais. Era uma forma eficiente de governar um território enorme e diverso, ao contrário da violência assíria.

**Dario I** deu ao império uma organização duradoura:
- Divisão em **satrapias**, províncias governadas por **sátrapas**.
- Fiscais conhecidos como "olhos e ouvidos do rei".
- A **Estrada Real**, de Sardes a Susa, com postos para mensageiros.
- Uma moeda de ouro, o **dárico**, e o aramaico como língua administrativa.

A economia combinava **agricultura**, **tributos** e **comércio**. A religião oficial era o **zoroastrismo**, fundado pelo profeta Zaratustra, que opunha o bem, representado por Ahura Mazda, ao mal, e previa um julgamento final.

O império entrou em choque com os gregos nas **Guerras Médicas** (490 a 479 a.C.) e foi derrotado em batalhas como Maratona, Salamina e Plateia. Entre 334 e 330 a.C., **Alexandre, o Grande**, da Macedônia, conquistou todo o Império Persa.`}
  ],
  resumo:[
  'Fenícios: litoral do Líbano, cidades-estado, comércio marítimo e feitorias.',
  'Cartago foi a principal colônia fenícia, depois rival de Roma.',
  'Os fenícios criaram um alfabeto de 22 consoantes, base do grego e do latino.',
  'Hebreus: Canaã, patriarcas, juízes e reis; divisão em Israel e Judá.',
  'Assírios destruíram Israel em 722 a.C.; babilônios levaram parte de Judá ao cativeiro em 587 a.C.',
  'Monoteísmo ético e Torá; diáspora após as revoltas contra Roma.',
  'Persas: Ciro e a tolerância religiosa; Dario, satrapias, Estrada Real e dárico.',
  'Zoroastrismo: luta entre o bem e o mal.',
  'Os persas foram vencidos pelos gregos nas Guerras Médicas e conquistados por Alexandre.'
  ],
  urca:`Não há ligação histórica real entre esses três povos e o Ceará, então o tema se estuda do mesmo jeito que para o ENEM. Um alerta vale para o Nordeste: no século XX, o austríaco Ludwig Schwennhagen defendeu que os fenícios teriam chegado ao Brasil, citando Sete Cidades, no Piauí, e houve quem lesse inscrições rupestres, como as da Pedra do Ingá, na Paraíba, como letras fenícias. A arqueologia não encontrou nenhuma prova disso; essas marcas foram feitas por povos indígenas. Na prova, trate essa ideia como mito. Reforce o essencial: comércio e alfabeto fenícios, monoteísmo hebreu e administração persa.`,

  pecas:[
    {id:'mapa',tipo:'mapa',base:BASE,x:0,y:0,w:2477,h:1382,rotulo:'Mapa do Mediterrâneo e do Oriente Próximo, do Atlântico ao Golfo Pérsico',camadas:[
      {tipo:'rotulo',p:[540,452],texto:'Mar Mediterrâneo',classe:'mar',tam:.9},
      {tipo:'rotulo',p:[1148,612],texto:'Golfo Pérsico',classe:'mar',tam:.5},
      // etapa 1: o litoral do Líbano
      {tipo:'regiao',terra:true,ll:true,pts:FEN,suave:false,cor:'coral',opac:.9,etapas:[0,1],atraso:A(1400)},
      {tipo:'rotulo',ll:true,p:[36.0,34.3],texto:'∧',classe:'terra',tam:.4,etapas:[0],atraso:A(2400)},
      {tipo:'rotulo',ll:true,p:[36.12,33.95],texto:'∧',classe:'terra',tam:.4,etapas:[0],atraso:A(2600)},
      {tipo:'rotulo',ll:true,p:[36.05,33.62],texto:'∧',classe:'terra',tam:.4,etapas:[0],atraso:A(2800)},
      {tipo:'rotulo',ll:true,p:[35.9,33.3],texto:'∧',classe:'terra',tam:.4,etapas:[0],atraso:A(3000)},
      {tipo:'rotulo',ll:true,p:[36.75,34.1],texto:'montes do Líbano',classe:'terra',tam:.2,giro:90,etapas:[0],atraso:A(3200)},
      {tipo:'cidade',ll:true,p:[35.65,34.12],nome:'Biblos',lado:'e',tam:.2,etapas:[0],atraso:A(3200)},
      {tipo:'cidade',ll:true,p:[35.58,33.56],nome:'Sídon',lado:'d',tam:.2,etapas:[0],atraso:A(4000)},
      {tipo:'cidade',ll:true,p:[35.42,33.27],nome:'Tiro',lado:'e',tam:.2,etapas:[0],atraso:A(4800)},
      {tipo:'etiqueta',ll:true,p:[35.75,32.75],texto:'litoral do Líbano atual',tam:.22,etapas:[0],atraso:A(5600)},
      // etapa 2: as rotas do mar
      {tipo:'rota',ll:true,pts:R_CHIPRE,movel:'barco',volta:7000,dur:1.6,tam:.5,etapas:[1],atraso:A(1500)},
      {tipo:'rota',ll:true,pts:R_SICILIA,movel:'barco',volta:12000,dur:3,tam:.5,etapas:[1],atraso:A(4200)},
      {tipo:'rota',ll:true,pts:R_SARDENHA,movel:'barco',volta:13000,dur:3,tam:.5,etapas:[1],atraso:A(8200)},
      {tipo:'rota',ll:true,pts:R_CARTAGO,movel:'barco',volta:12500,dur:3,tam:.5,etapas:[1],atraso:A(12200)},
      {tipo:'rota',ll:true,pts:R_GADIR,movel:'barco',volta:16000,dur:4,tam:.5,etapas:[1],atraso:A(16200)},
      {tipo:'cidade',ll:true,p:[35.42,33.27],nome:'Tiro',lado:'e',tam:.5,etapas:[1],atraso:A(300)},
      {tipo:'cidade',ll:true,p:[33.7,34.85],nome:'Chipre',lado:'e',tam:.5,etapas:[1],atraso:A(3000)},
      {tipo:'cidade',ll:true,p:[12.5,37.85],nome:'Sicília',lado:'c',tam:.5,etapas:[1],atraso:A(7200)},
      {tipo:'cidade',ll:true,p:[9.1,39.1],nome:'Sardenha',lado:'e',tam:.5,etapas:[1],atraso:A(11200)},
      {tipo:'cidade',ll:true,p:[10.3,36.87],nome:'Cartago',capital:true,lado:'c',tam:.55,etapas:[1],atraso:A(15200)},
      {tipo:'cidade',ll:true,p:[-6.29,36.5],nome:'Gadir',sub:'atual Cádis',lado:'d',tam:.5,etapas:[1],atraso:A(20200)},
      {tipo:'etiqueta',ll:true,p:[-5.4,35.2],texto:'Estreito de Gibraltar',tam:.4,etapas:[1],atraso:A(19000)},
      // etapa 4: Canaã
      {tipo:'rota',estilo:'rio',ll:true,pts:JORDAO,dur:2,largura:1.6,etapas:[3,4,5],atraso:A(900)},
      {tipo:'etiqueta',ll:true,p:[35.95,32.85],texto:'Canaã',tam:.2,etapas:[3],atraso:A(1800)},
      {tipo:'rotulo',ll:true,p:[35.78,32.05],texto:'Jordão',classe:'terra',tam:.24,etapas:[3],atraso:A(2200)},
            {tipo:'pontos',ll:true,pts:[[35.2,32.45],[35.3,32.15],[35.15,31.95],[35.35,31.6],[35.3,31.4],[35.1,31.65],[35.4,32.55],[35.45,32.1]],tam:.5,cor:'#6f2a1f',etapas:[3],atraso:A(3400)},
      // etapa 5: reinos, conquistas e exílio
      {tipo:'regiao',terra:true,ll:true,pts:CANAA,suave:false,cor:'#e9c46a',opac:.8,etapas:[3,4],atraso:A(900),dura:A(5600)},
      {tipo:'regiao',terra:true,ll:true,pts:ISRAEL,suave:false,cor:'#e08e2b',opac:.9,etapas:[4],atraso:A(7600),dura:A(12400)},
      {tipo:'regiao',terra:true,ll:true,pts:JUDA,suave:false,cor:'#b5532b',opac:.9,etapas:[4],atraso:A(7600)},
      {tipo:'etiqueta',ll:true,p:[35.0,33.05],texto:'Israel',tam:.2,etapas:[4],atraso:A(8800),dura:A(10600)},
      {tipo:'etiqueta',ll:true,p:[34.9,31.5],texto:'Judá',tam:.2,etapas:[4],atraso:A(9400),dura:A(12600)},
      {tipo:'cidade',ll:true,p:[35.4,32.28],nome:'Samaria',lado:'e',tam:.16,etapas:[4],atraso:A(10000),dura:A(12000)},
      {tipo:'cidade',ll:true,p:[35.42,31.78],nome:'Jerusalém',capital:true,lado:'d',tam:.18,etapas:[4],atraso:A(10400),dura:A(11600)},
      {tipo:'cidade',ll:true,p:[35.42,31.78],nome:'Jerusalém',capital:true,lado:'c',tam:.65,etapas:[4,5],atraso:A(24000)},
      {tipo:'etiqueta',ll:true,p:[36.2,34.6],texto:'Assíria',tam:.16,etapas:[4],atraso:A(16400),dura:A(6000)},
      {tipo:'rota',ll:true,pts:EXILIO,estilo:'rota',movel:'ponto',volta:9000,dur:3,tam:.8,etapas:[4],atraso:A(24800)},
      {tipo:'rota',ll:true,pts:EXILIO,invisivel:true,movel:'ponto',volta:7000,etapas:[4],atraso:A(25800)},
      {tipo:'rota',ll:true,pts:EXILIO,invisivel:true,movel:'ponto',volta:11000,etapas:[4],atraso:A(26200)},
      {tipo:'cidade',ll:true,p:[44.4,32.5],nome:'Babilônia',capital:true,lado:'e',tam:.45,etapas:[4],atraso:A(26500)},
      {tipo:'etiqueta',ll:true,p:[38.6,31.2],texto:'587 a.C.',cor:'amarelo',tam:.5,etapas:[4],atraso:A(26500)},
      // etapa 6: a diáspora
      {tipo:'rota',ll:true,pts:[[35.42,31.78],[34.75,32.05],[30,33.4],[22,34.6],[16,37.6],[15.4,38.2],[12.6,41.4]],dur:3,tam:.5,etapas:[5],atraso:A(8000)},
      {tipo:'rota',ll:true,pts:[[35.42,31.78],[34.75,32.05],[31,31.7],[29.9,31.2]],dur:2,tam:.5,etapas:[5],atraso:A(8400)},
      {tipo:'rota',ll:true,pts:[[35.42,31.78],[35.6,33.5],[36.16,36.2]],dur:2,tam:.5,etapas:[5],atraso:A(8800)},
      {tipo:'rota',ll:true,pts:[[35.42,31.78],[34.75,32.05],[30,34],[27.35,37.9]],dur:2.5,tam:.5,etapas:[5],atraso:A(9200)},
      {tipo:'rota',ll:true,pts:EXILIO,dur:3,tam:.5,etapas:[5],atraso:A(9600)},
      {tipo:'rota',ll:true,pts:[[35.42,31.78],[34.75,32.05],[28,33.6],[20,34.2],[13,36.6],[10.3,36.88]],dur:3,tam:.5,etapas:[5],atraso:A(10000)},
      {tipo:'etiqueta',ll:true,p:[29.0,33.0],texto:'diáspora',cor:'amarelo',tam:.7,etapas:[5],atraso:A(10500)},
      {tipo:'cidade',ll:true,p:[12.5,41.9],nome:'Roma',lado:'c',tam:.6,etapas:[5],atraso:A(11000)},
      {tipo:'cidade',ll:true,p:[10.3,36.87],nome:'Cartago',lado:'c',tam:.6,etapas:[5],atraso:A(11000)},
      {tipo:'cidade',ll:true,p:[27.35,37.94],nome:'Éfeso',lado:'c',tam:.6,etapas:[5],atraso:A(11100)},
      {tipo:'cidade',ll:true,p:[36.16,36.2],nome:'Antioquia',lado:'d',tam:.6,etapas:[5],atraso:A(11100)},
      {tipo:'cidade',ll:true,p:[44.4,32.5],nome:'Babilônia',lado:'c',tam:.6,etapas:[5],atraso:A(11200)},
      {tipo:'cidade',ll:true,p:[29.9,31.2],nome:'Alexandria',lado:'c',tam:.6,etapas:[5],atraso:A(11200)},
      // etapa 7: Ciro
      {tipo:'regiao',terra:true,ll:true,pts:FARS,suave:false,cor:'#1fa39a',opac:.8,etapas:[6],atraso:A(1400)},
      {tipo:'regiao',terra:true,ll:true,pts:MEDIOS,suave:false,cor:'#1fa39a',opac:.8,etapas:[6],atraso:A(4500)},
      {tipo:'etiqueta',ll:true,p:[47.4,30.0],texto:'Pérsia, no Irã',tam:.5,etapas:[6],atraso:A(1800)},
      {tipo:'etiqueta',ll:true,p:[45.8,36.6],texto:'medos, 550 a.C.',cor:'amarelo',tam:.5,etapas:[6],atraso:A(5000)},
      {tipo:'regiao',terra:true,ll:true,pts:LIDIA,suave:false,cor:'#1fa39a',opac:.8,etapas:[6],atraso:A(8000)},
      {tipo:'etiqueta',ll:true,p:[26.8,38.4],texto:'Lídia',tam:.55,etapas:[6],atraso:A(8600)},
      {tipo:'regiao',terra:true,ll:true,pts:BAB,suave:false,cor:'#1fa39a',opac:.8,etapas:[6],atraso:A(11500)},
      {tipo:'cidade',ll:true,p:[44.4,32.5],nome:'Babilônia',capital:true,lado:'e',tam:.55,etapas:[6],atraso:A(12000)},
      {tipo:'etiqueta',ll:true,p:[43.2,30.0],texto:'539 a.C.',cor:'amarelo',tam:.6,etapas:[6],atraso:A(12400)},
      {tipo:'rota',ll:true,pts:EXILIO.slice().reverse(),movel:'ponto',volta:9000,dur:3,tam:.8,etapas:[6],atraso:A(14500)},
      {tipo:'cidade',ll:true,p:[35.42,31.78],nome:'Jerusalém',lado:'c',tam:.55,etapas:[6],atraso:A(14600)},
      {tipo:'regiao',terra:true,ll:true,pts:EGITO,suave:false,cor:'#1fa39a',opac:.8,etapas:[6],atraso:A(19500)},
      {tipo:'etiqueta',ll:true,p:[26.6,26.0],texto:'525 a.C.: Egito',cor:'amarelo',tam:.6,etapas:[6],atraso:A(20300)},
      // etapas 8 e 9: o império no auge
      {tipo:'regiao',terra:true,ll:true,pts:IMPERIO,suave:false,cor:'#1fa39a',opac:.8,etapas:[7,8],atraso:A(900),dura:A(41000)},
      {tipo:'etiqueta',ll:true,p:[28,25.2],texto:'Império Persa, no auge',cor:'amarelo',tam:.65,etapas:[7],atraso:A(1400)},
      {tipo:'rota',ll:true,pts:[[34.9,29.7],[34.3,31.6],[35.5,33],[38,34.6],[41,36.4]],estilo:'fronteira',etapas:[7],atraso:A(3200),dura:A(30000)},
      {tipo:'rota',ll:true,pts:[[25.2,35.9],[29,36.9],[31.5,38.5],[36,41]],estilo:'fronteira',etapas:[7],atraso:A(3800),dura:A(30000)},
      {tipo:'rota',ll:true,pts:[[41,36.4],[44.5,34.8],[46.8,32.5],[48.5,29.5]],estilo:'fronteira',etapas:[7],atraso:A(4400),dura:A(30000)},
      {tipo:'rota',ll:true,pts:[[46.8,32.5],[48.5,35],[51,37.6]],estilo:'fronteira',etapas:[7],atraso:A(5000),dura:A(30000)},
      {tipo:'rota',ll:true,pts:[[50.5,27.8],[51.8,31],[53,37.2]],estilo:'fronteira',etapas:[7],atraso:A(5600),dura:A(30000)},
      {tipo:'rotulo',ll:true,p:[27.6,26.4],texto:'satrapia do Egito',classe:'regiao2',tam:.62,etapas:[7],atraso:A(6200)},
      {tipo:'rotulo',ll:true,p:[34.2,29.3],texto:'Síria',classe:'regiao2',tam:.62,etapas:[7],atraso:A(6400)},
      {tipo:'rotulo',ll:true,p:[28.0,40.2],texto:'Lídia',classe:'regiao2',tam:.62,etapas:[7],atraso:A(6600)},
      {tipo:'rotulo',ll:true,p:[42.2,31.0],texto:'Babilônia',classe:'regiao2',tam:.62,etapas:[7],atraso:A(6800)},
      {tipo:'rotulo',ll:true,p:[47.5,35.4],texto:'Média',classe:'regiao2',tam:.62,etapas:[7],atraso:A(7000)},
      {tipo:'rotulo',ll:true,p:[52.4,28.8],texto:'Pérsia',classe:'regiao2',tam:.62,etapas:[7],atraso:A(7200)},
      {tipo:'rota',ll:true,pts:ROYAL,estilo:'rota',movel:'ponto',volta:7000,dur:5,tam:.8,etapas:[7],atraso:A(8500),dura:A(30000)},
      {tipo:'pontos',ll:true,pts:[[30,39.2],[32,39.7],[35,39.3],[37.5,38.2],[40,37.8],[43,36.4],[45,35.8],[47,33.5]],tam:.7,cor:'tinta',etapas:[7],atraso:A(13500),dura:A(30000)},
      {tipo:'cidade',ll:true,p:[27.95,38.48],nome:'Sardes',lado:'e',tam:.34,etapas:[7],atraso:A(8800)},
      {tipo:'cidade',ll:true,p:[48.2,32.19],nome:'Susa',capital:true,lado:'e',tam:.34,etapas:[7],atraso:A(13800)},
      {tipo:'cidade',ll:true,p:[52.9,29.93],nome:'Persépolis',capital:true,lado:'e',tam:.34,etapas:[7],atraso:A(14400)},
      {tipo:'etiqueta',ll:true,p:[36.0,39.9],texto:'Estrada Real',cor:'amarelo',tam:.45,etapas:[7],atraso:A(9000)},
      {tipo:'etiqueta',ll:true,p:[47.2,38.8],texto:'o império continua até o rio Indo',tam:.34,etapas:[7],atraso:A(17500)},
      {tipo:'etiqueta',ll:true,p:[45.2,38.8],texto:'o império continua até o rio Indo',tam:.5,etapas:[8],atraso:A(100),dura:A(32500)},
      // etapa 9: Guerras Médicas e Alexandre
      {tipo:'rota',ll:true,pts:[[26.9,37.7],[25.5,37.2],[24.4,38.15]],cor:'#0f6d68',movel:'ponto',volta:5000,dur:1.4,tam:.8,etapas:[8],atraso:A(14000)},
      {tipo:'etiqueta',ll:true,p:[25.6,37.1],texto:'490 a.C.',cor:'amarelo',tam:.5,etapas:[8],atraso:A(15200)},
      {tipo:'rota',ll:true,pts:[[26.5,40.4],[24,40.3],[22.6,38.9],[23.7,38.0],[26.9,38.4]],cor:'#0f6d68',movel:'ponto',volta:7000,dur:2.2,tam:.8,etapas:[8],atraso:A(17000)},
      {tipo:'etiqueta',ll:true,p:[20.0,36.0],texto:'480 a 479 a.C.',cor:'amarelo',tam:.5,etapas:[8],atraso:A(19000)},
      {tipo:'rota',ll:true,pts:[[22.5,40.8],[26.5,40.3],[31,38.5],[36.2,36.8],[43.3,36.5],[44.4,32.5],[48.2,32.2],[52.9,29.9],[56.8,30.5]],cor:'#c4452b',largura:8,movel:'ponto',volta:12000,dur:7,tam:.9,etapas:[8],atraso:A(25500)},
      {tipo:'regiao',terra:true,ll:true,pts:IMPERIO,suave:false,cor:'#7c7a72',opac:.92,etapas:[8],atraso:A(33000),dura:A(41000)},
      {tipo:'etiqueta',ll:true,p:[40.4,35.4],texto:'334 a 330 a.C.',cor:'amarelo',tam:.55,etapas:[8],atraso:A(27500)},
      {tipo:'etiqueta',ll:true,p:[52.4,32.8],texto:'até o Indo',cor:'amarelo',tam:.6,etapas:[8],atraso:A(33600)},
      {tipo:'cidade',ll:true,p:[22.5,40.8],nome:'Macedônia',lado:'c',tam:.45,etapas:[8],atraso:A(25000)},
      {tipo:'etiqueta',ll:true,p:[17.4,38.6],texto:'Próximo: Grécia',cor:'amarelo',tam:.6,etapas:[8],atraso:A(33500)}
    ]},
    {id:'tempo',tipo:'tempo',grande:true,x:0,y:4400,w:3800,h:190,giro:.3,avisoEt:'5',aviso:'a régua não está em escala; o último marco é um salto no tempo',
     marcos:[
      {p:7,t:'cerca de 1208 a.C.',s:'Estela de Merneptá',etapa:3},
      {p:15,t:'cerca de 1000 a.C.',s:'alfabeto e monarquia',etapa:[2,4]},
      {p:23,t:'cerca de 814 a.C.',s:'Cartago',etapa:1},
      {p:31,t:'722 a.C.',s:'fim de Israel',etapa:4},
      {p:39,t:'587 a.C.',s:'exílio na Babilônia',etapa:4},
      {p:47,t:'cerca de 550 a.C.',s:'Ciro vence os medos',cor:'petroleo',etapa:6},
      {p:55,t:'539 a.C.',s:'Babilônia',cor:'petroleo',etapa:6},
      {p:63,t:'525 a.C.',s:'Egito',cor:'petroleo',etapa:6},
      {p:71,t:'522 a 486 a.C.',s:'Dario I',cor:'petroleo',etapa:7},
      {p:79,t:'490 a 479 a.C.',s:'Guerras Médicas',cor:'petroleo',etapa:8},
      {p:87,t:'334 a 330 a.C.',s:'Alexandre',cor:'petroleo',etapa:8},
      {p:95,t:'70 d.C.',s:'Templo destruído',etapa:5}]},

    /* zona fenícios: recortes da etapa 1 */
    {id:'ced',tipo:'icone',fundo:false,nome:'cedro',x:2780,y:140,w:380,h:380,giro:-2,rotulo:'Recorte: tronco de cedro do Líbano'},
    {id:'et-ced',tipo:'etiqueta',x:2780,y:540,w:380,h:86,texto:'cedro do Líbano',clicavel:false},
    {id:'vid',tipo:'icone',fundo:false,nome:'vidro',x:3200,y:160,w:340,h:340,giro:1.5,rotulo:'Recorte: frasco de vidro fenício'},
    {id:'et-vid',tipo:'etiqueta',x:3250,y:540,w:240,h:86,texto:'vidro',clicavel:false},
    {id:'mur',tipo:'icone',fundo:false,nome:'murex',x:3560,y:140,w:380,h:380,giro:-1.5,rotulo:'Recorte: concha de múrex'},
    {id:'et-mur',tipo:'etiqueta',x:3530,y:540,w:440,h:86,texto:'múrex, um molusco',clicavel:false},
    {id:'pur',tipo:'icone',fundo:false,nome:'purpura',x:4020,y:170,w:400,h:340,giro:1,rotulo:'Recorte: retalho de tecido púrpura'},
    {id:'et-pur',tipo:'etiqueta',x:4070,y:540,w:300,h:86,texto:'púrpura',clicavel:false},
    {id:'n-feit',tipo:'nota',x:770,y:880,w:520,giro:-1.5,texto:'feitoria: porto de comércio, não território conquistado'},

    /* zona alfabeto: etapa 3 */
    {id:'tab',tipo:'icone',nome:'tabua',x:120,y:1790,w:400,h:400,giro:-2,rotulo:'Recorte: tabuinha com escrita cuneiforme'},
    {id:'cart',tipo:'icone',nome:'cartucho',x:560,y:1800,w:400,h:400,giro:1.5,rotulo:'Recorte: cartucho com hieróglifos'},
    {id:'alef',tipo:'icone',nome:'alef',x:1000,y:1790,w:400,h:400,giro:-1.5,rotulo:'Recorte: a letra fenícia alef'},
    {id:'et-cun',tipo:'etiqueta',x:120,y:2210,w:400,h:86,texto:'cuneiforme',clicavel:false},
    {id:'et-hie',tipo:'etiqueta',x:560,y:2210,w:400,h:86,texto:'hieróglifos',clicavel:false},
    {id:'et-fen',tipo:'etiqueta',x:1000,y:2210,w:400,h:86,texto:'alfabeto fenício',clicavel:false},
    {id:'et-cen',tipo:'etiqueta',x:120,y:2320,w:840,h:86,texto:'centenas de sinais',clicavel:false},
    {id:'et-22',tipo:'etiqueta',x:1000,y:2320,w:400,h:86,texto:'22 letras',clicavel:false},
    {id:'alfa',tipo:'alfabeto',x:1560,y:1760,w:1000,h:667,giro:.8,rotulo:'Esquema: a letra fenícia alef vira o alfa grego e o A latino; a escrita fenícia não tinha vogais'},

    /* zona hebreus: etapa 4 */
    {id:'est',tipo:'icone',nome:'estela',x:2840,y:1920,w:420,h:420,giro:-2,rotulo:'Recorte: estela de pedra com hieróglifos ilegíveis'},
    {id:'et-mer',tipo:'etiqueta',x:2800,y:2360,w:500,h:86,texto:'Estela de Merneptá',clicavel:false},
    {id:'et-isr',tipo:'etiqueta',x:2740,y:1720,w:860,h:86,texto:'Israel: sinal de povo, não de cidade',clicavel:false},
    {id:'perg',tipo:'icone',nome:'rolo-colunas',x:3860,y:1920,w:380,h:380,giro:1.5,rotulo:'Recorte: rolo de pergaminho, a Bíblia hebraica'},
    {id:'et-bib',tipo:'etiqueta',x:3820,y:2330,w:460,h:86,texto:'Bíblia hebraica',clicavel:false},
    {id:'bal',tipo:'icone',nome:'balanca',x:4700,y:1900,w:480,h:480,giro:-1,rotulo:'Recorte: balança que pesa a narrativa religiosa e a fonte histórica'},
    {id:'et-nar',tipo:'etiqueta',x:4680,y:2480,w:520,h:86,texto:'narrativa religiosa',clicavel:false},
    {id:'et-fon',tipo:'etiqueta',x:4720,y:2600,w:440,h:86,texto:'fonte histórica',clicavel:false},

    /* zona Torá: etapa 6 */
    {id:'tora',tipo:'icone',nome:'rolo-tora',x:760,y:2840,w:640,h:640,giro:0,rotulo:'Recorte: rolo da Torá aberto'},
    {id:'et-mon',tipo:'etiqueta',x:1480,y:2920,w:560,h:86,texto:'monoteísmo: um só Deus',clicavel:false},
    {id:'et-jud',tipo:'etiqueta',x:560,y:3560,w:300,h:86,giro:-6,texto:'judaísmo',clicavel:false},
    {id:'et-cri',tipo:'etiqueta',x:940,y:3600,w:380,h:86,giro:1.5,texto:'cristianismo',clicavel:false},
    {id:'et-isl',tipo:'etiqueta',x:1360,y:3560,w:460,h:86,giro:6,texto:'islã (século VII)',clicavel:false},

    /* zona Ciro: etapa 7 */
    {id:'cil',tipo:'icone',nome:'cilindro',x:2820,y:2900,w:520,h:520,giro:-1.5,rotulo:'Recorte: o Cilindro de Ciro, barril de argila com escrita cuneiforme'},
    {id:'et-cil',tipo:'etiqueta',x:2800,y:3440,w:560,h:86,texto:'Cilindro de Ciro',clicavel:false},
    {id:'doc',tipo:'fonte',grande:true,x:3480,y:2820,w:640,h:700,giro:-1,rotulo:'Fonte histórica: Cilindro de Ciro',
     texto:'“Eu sou Ciro, rei do mundo, grande rei, rei da Babilônia, rei da Suméria e da Acádia, rei dos quatro cantos do mundo. Devolvi os deuses às suas moradas, nas cidades do outro lado do Tigre, cujos santuários estavam em ruínas havia muito tempo. Reuni os antigos moradores e os devolvi às suas casas.”',
     ref:'Cilindro de Ciro, cilindro de argila escrito em cuneiforme acádio, Babilônia, cerca de 539 a.C., hoje no Museu Britânico. Paráfrase da equipe.',
     resposta:'A política persa de ==tolerância religiosa== e de retorno dos deslocados, usada para legitimar um conquistador estrangeiro. Ciro escreve em acádio, na escrita local, e se apresenta como rei tradicional da Babilônia: é ==propaganda== para os babilônios. O cilindro não cita os judeus; a volta deles é contada pela Bíblia, no livro de Esdras. Por isso chamá-lo de "primeira declaração de direitos humanos" é ==anacronismo==, porque projeta no passado uma ideia moderna.'},

    /* zona Dario: etapa 8 */
    {id:'rel',tipo:'foto',img:'historia-persas-tributarios',x:4760,y:110,w:900,h:502,giro:-1,fita:{x:14,g:-3},rotulo:'Recriação de um relevo de Persépolis: delegações de povos diferentes levam presentes ao rei'},
    {id:'et-sat',tipo:'etiqueta',x:4760,y:690,w:780,h:100,texto:'satrapias: cada povo, uma província',clicavel:false},
    {id:'dar',tipo:'darico',giraEm:30500,atraso:29000,x:5300,y:1000,w:340,h:340,giro:2,rotulo:'Recorte: o dárico, moeda de ouro persa'},
    {id:'et-dar',tipo:'etiqueta',atraso:29600,x:5180,y:1360,w:560,h:86,texto:'dárico, moeda de ouro',clicavel:false},

    /* zona zoroastrismo: etapa 9 */
    {id:'disco',tipo:'icone',nome:'disco-alado',x:4820,y:2820,w:420,h:420,giro:0,rotulo:'Recorte: disco alado dos relevos persas'},
    {id:'et-ahu',tipo:'etiqueta',x:4700,y:3260,w:580,h:120,texto:'símbolo alado, ligado a Ahura Mazda',clicavel:false},
    {id:'fogo',tipo:'icone',nome:'altar-fogo',x:5420,y:2840,w:340,h:340,giro:2,rotulo:'Recorte: altar de pedra com a chama sagrada do zoroastrismo'},
    {id:'et-fog',tipo:'etiqueta',x:5330,y:3260,w:440,h:120,texto:'o fogo sagrado, no altar',clicavel:false},
    {id:'n-bem',tipo:'nota',clara:true,x:4960,y:3640,w:400,giro:-1.5,texto:'o bem e a verdade'},
    {id:'n-mal',tipo:'nota',escura:true,x:4960,y:3880,w:400,giro:1.5,texto:'o mal e a mentira'}
  ],

  etapas:[
    {titulo:'Fenícios: entre a montanha e o mar',mostra:['mapa','tempo'],so:['ced','et-ced','vid','et-vid','mur','et-mur','pur','et-pur'],
     foco:F(31.6,36.0,39.6,31.4),focoM:F(34.2,35.2,37.6,32.4),
     tomadas:[[9500,[2740,90,1200,620]],[18500,[3340,90,1100,600]]],
     tomadasM:[[9500,[2740,110,480,640]],[14000,[3160,130,420,560]],[18500,[3530,110,440,640]],[23000,[4000,130,460,560]]],tempo:38000,
     tracos:[{tipo:'circulo',peca:'mur',x:50,y:52,w:58,h:72,atraso:A(21000)},{tipo:'seta',de:{peca:'mur',x:90,y:78},para:{peca:'et-pur',x:18,y:-2},curva:.3,atraso:A(22000)}],
     texto:'Os ==fenícios== viviam numa faixa estreita de litoral, onde hoje é o ==Líbano==, entre as montanhas e o mar. Tinham pouca terra para plantar, o que os empurrou para o mar, mas contavam com muita madeira de cedro, ótima para barcos e vendida ao Egito e à Mesopotâmia, e com bons portos. Não formaram um império nem um reino único: eram ==cidades-estado== independentes, como Biblos, Tiro e Sídon, cada uma com seu rei e governadas na prática por ricas famílias de comerciantes. Viviam do comércio e do artesanato de luxo, como vidro, objetos de marfim e tecidos tingidos de púrpura, um corante caro tirado de um molusco. O próprio nome fenício vem da palavra grega para essa cor.'},
    {titulo:'Navegadores do Mediterrâneo',so:['n-feit'],
     foco:F(-8,41,37,30),focoM:F(30,36,37,32),
     tomadas:[[14000,F(2,41,24,33)],[22000,F(-8,40,10,34)],[31000,TL(150,1300)]],
     tomadasM:[[8000,F(10,40,28,33)],[17000,F(-7.5,38.5,2,34.5)],[31000,TL(402,640)]],tempo:38000,
     texto:'Grandes ==navegadores==, os fenícios espalharam pelo Mediterrâneo uma rede de ==feitorias==: portos com armazém, onde compravam metais, como prata e estanho, e vendiam seus produtos. Navegavam guiados pelas estrelas e pela costa. Chegaram a Chipre, à Sicília, à Sardenha, ao norte da África e à Península Ibérica, onde fundaram Gadir, atual Cádis, já fora do Estreito de Gibraltar. A colônia mais famosa foi ==Cartago==, na atual Tunísia, fundada, segundo a tradição, por volta de 814 a.C. Cartago ficou independente e rica e, séculos depois, disputou o Mediterrâneo com Roma nas Guerras Púnicas. O poder fenício vinha do mar e do comércio, não da conquista de terras.'},
    {titulo:'Vinte e duas letras',so:['tab','cart','alef','et-cun','et-hie','et-fen','et-cen','et-22','alfa'],
     foco:[80,1730,1360,720],focoM:[100,1760,880,680],
     tomadas:[[13500,[1520,1720,1100,720]],[30000,TL(0,1300)]],
     tomadasM:[[8000,[960,1760,480,680]],[14000,[1550,1745,1020,700]],[34000,TL(98,640)]],tempo:38000,
     tracos:[{tipo:'circulo',peca:'alfa',x:55.5,y:79,w:12,h:13,cor:'seta',atraso:A(26000)}],
     texto:'Para negociar, era preciso escrever contratos, listas e cartas, mas a cuneiforme e os hieróglifos tinham centenas de sinais e exigiam anos de estudo. Por volta de 1000 a.C., os fenícios fixaram um ==alfabeto== de ==22 letras==, cada uma para um som de consoante, herdeiro de escritas mais antigas de Canaã. Cada letra tinha nome de uma coisa: alef era boi; bet, casa. Com poucos sinais, ficou bem mais fácil aprender a ler e escrever, e a escrita deixou de ser só de especialistas. Os gregos o adaptaram e acrescentaram vogais; de alfa e beta vem a palavra alfabeto. Dele vem também o alfabeto latino, que você está lendo agora.'},
    {titulo:'Hebreus: um povo em Canaã',so:['est','et-mer','et-isr','perg','et-bib','bal','et-nar','et-fon'],
     foco:F(31.7,34.4,38.9,30.0),focoM:F(33.4,34.4,37.6,30.6),
     tomadas:[[11000,[2700,1690,960,780]],[19500,[3760,1860,560,620]],[26500,[4540,1850,800,900]],[34000,TL(0,1300)]],
     tomadasM:[[10000,[2720,1700,900,900]],[17500,[3780,1880,600,560]],[22500,[4640,1900,600,560]],[27500,[4560,2430,600,340]],[34000,TL(98,640)]],tempo:38000,
     tracos:[{tipo:'circulo',peca:'est',x:50,y:62,w:46,h:20,atraso:A(13000)},{tipo:'seta',de:{peca:'est',x:50,y:52},para:{peca:'et-isr',x:30,y:100},curva:.25,atraso:A(14000)}],
     texto:'Os ==hebreus== viviam em Canaã, região que, muito depois, ficou conhecida como Palestina. A ==Bíblia hebraica== conta sua origem: o patriarca Abraão, vindo da Mesopotâmia; a escravidão no Egito; o Êxodo, a saída do Egito com Moisés, que teria recebido os Dez Mandamentos; e as doze tribos, lideradas por juízes, chefes militares e religiosos. A arqueologia não confirma tudo: não há vestígios do Êxodo, por exemplo. Mas uma estela do faraó Merneptá, de cerca de 1208 a.C., já cita um povo chamado ==Israel== em Canaã. A Bíblia é uma fonte histórica importante, desde que lida com crítica, porque é antes de tudo um texto religioso, escrito e reunido ao longo de séculos.'},
    {titulo:'Reinos, conquistas e exílio',
     foco:F(31.7,34.4,38.9,30.0),focoM:F(33.4,34.4,37.6,30.6),
     tomadas:[[23000,F(30.5,36.5,47.5,29.5)],[33000,TL(300,1300)]],
     tomadasM:[[23000,F(34.0,34.6,46.2,30.6)],[33000,TL(1010,640)]],tempo:38000,
     tracos:[{tipo:'seta',de:Mp(37.9,34.4),para:Mp(35.75,32.6),cor:'#4a525c',espessura:7,ponta:24,curva:-.1,atraso:A(16500)}],
     texto:'Segundo a Bíblia, por volta de 1000 a.C. as tribos se uniram numa ==monarquia==, com Saul, Davi, que fez de Jerusalém a capital, e Salomão, que construiu o Templo. Depois da morte de Salomão, disputas e impostos pesados dividiram o reino em dois: Israel, ao norte, com capital em Samaria, e Judá, ao sul, com Jerusalém. Israel foi destruído pelos assírios em 722 a.C., e parte da população foi deportada. Judá foi conquistado pelos babilônios de Nabucodonosor em 587 a.C.; o Templo foi destruído e parte do povo, sobretudo a elite, foi levada para a Babilônia, no ==cativeiro babilônico==. De Judá vem o nome ==judeus==.'},
    {titulo:'Um só Deus e a Torá',so:['tora','et-mon','et-jud','et-cri','et-isl'],
     foco:[500,2800,1400,860],focoM:[740,2820,680,680],
     tomadas:[[12000,F(10,43,47,29.5)],[26000,TL(2500,1300)]],
     tomadasM:[[5500,[1100,2860,950,300]],[9000,[520,3500,760,240]],[13000,[920,3500,940,240]],[17000,F(25,39.5,46,29.5)],[23000,F(8,43,26,36)],[29000,TL(3138,640)]],tempo:38000,
     tracos:[{tipo:'circulo',peca:'tora',x:50,y:52,w:38,h:46,atraso:A(2500)},{tipo:'seta',de:{peca:'tora',x:80,y:36},para:{peca:'et-mon',x:0,y:50},curva:.2,atraso:A(3400)},
       {tipo:'sublinha',de:{peca:'et-jud',x:60,y:0},para:{peca:'tora',x:30,y:96},cor:'tinta',espessura:3,atraso:A(5000)},
       {tipo:'sublinha',de:{peca:'et-cri',x:50,y:0},para:{peca:'tora',x:50,y:100},cor:'tinta',espessura:3,atraso:A(5800)},
       {tipo:'sublinha',de:{peca:'et-isl',x:40,y:0},para:{peca:'tora',x:72,y:96},cor:'tinta',espessura:3,atraso:A(6600)}],
     texto:'A grande marca dos hebreus é o ==monoteísmo==: a crença em um único Deus, Javé, que não podia ser representado em imagens. Era um monoteísmo ético, ligado a regras de conduta, como os Dez Mandamentos, o descanso no sábado e a proteção de órfãos, viúvas e estrangeiros. Essa fé se firmou aos poucos, com os profetas e sobretudo no exílio. O livro sagrado é a ==Torá==, os cinco primeiros livros da Bíblia. Bem depois, revoltas contra Roma levaram à destruição do Segundo Templo em 70 d.C.; após outra revolta, em 135 d.C., os judeus foram expulsos de Jerusalém, e a ==diáspora==, a dispersão pelo mundo, aumentou. O judaísmo é raiz do cristianismo e do islã.'},
    {titulo:'Ciro: conquistar sem apagar',so:['cil','et-cil','doc'],fonte:'doc',
     foco:F(24,43,58.5,25),focoM:F(44,38,58.5,27),
     tomadas:[[22000,[2760,2790,1420,780]],[30500,[3440,2790,700,760]],[37000,TL(1500,1300)]],
     tomadasM:[[9000,F(31,40.5,51,30.5)],[17000,F(31,35,48,31)],[20500,F(24,34,38,22)],[26000,[2820,2860,560,620]],[31000,[3430,2790,680,790]],[36000,TL(1618,640)]],tempo:40000,
     tracos:[{tipo:'circulo',peca:'cil',x:50,y:50,w:84,h:62,atraso:A(26500)}],
     texto:'Os ==persas== viviam no planalto do atual Irã, de agricultura e pastoreio. Por volta de 550 a.C., ==Ciro== venceu os medos, povo vizinho que os dominava, conquistou a rica Lídia, na Ásia Menor, e, em 539 a.C., tomou a Babilônia quase sem luta. Em vez de deportar, como os assírios, adotou a ==tolerância religiosa==: respeitou deuses, línguas e costumes locais e deixou povos deslocados voltarem, como os judeus, que reconstruíram o Templo de Jerusalém. Não era bondade pura, era estratégia: povos respeitados se revoltavam menos e, em troca, pagavam tributo e obedeciam ao rei. Em 525 a.C., seu filho Cambises conquistou o Egito, e o império virou o maior já visto.'},
    {titulo:'Dario: sátrapas, estradas e moedas',so:['rel','et-sat','dar','et-dar'],
     foco:F(24,42.5,50,26.5),focoM:F(26,41.5,42,33),
     tomadas:[[16000,F(40,41,58.6,26)],[23000,[4700,80,1000,780]],[31000,[5180,980,600,500]],[37000,TL(1900,1300)]],
     tomadasM:[[9000,F(38,38,52,28)],[16000,F(46,40,58.6,27)],[23000,[4740,100,900,640]],[30000,[5240,960,480,520]],[36000,TL(2226,640)]],tempo:44000,
     tracos:[{tipo:'circulo',peca:'rel',x:22,y:56,w:36,h:78,atraso:A(18500)},{tipo:'circulo',peca:'rel',x:74,y:56,w:24,h:78,atraso:A(19500)},
       {tipo:'seta',de:{peca:'rel',x:20,y:96},para:{peca:'et-sat',x:25,y:0},curva:.2,atraso:A(20500)},
       {tipo:'seta',de:Mp(54.0,37.9),para:Mp(58.2,37.9),cor:'seta',espessura:6,ponta:26,curva:0,atraso:A(18000)}],
     texto:'==Dario I== (522 a 486 a.C.) organizou o império, que ia do Egito e da Ásia Menor até o vale do Indo, no atual Paquistão. Dividiu-o em províncias, as ==satrapias==, governadas por sátrapas que cobravam tributos e mantinham a ordem, vigiados por inspetores, os "olhos e ouvidos do rei". Fez a ==Estrada Real==, de Sardes a Susa, com mais de 2 mil quilômetros e postos de cavalos descansados para os mensageiros. Cunhou uma moeda de ouro, o dárico, e usou o aramaico como língua da administração. Construiu Persépolis, capital de cerimônias. A economia unia agricultura, tributos e comércio, favorecido pela segurança das estradas e pela moeda única.'},
    {titulo:'Zoroastrismo e o fim do império',so:['disco','et-ahu','fogo','et-fog','n-bem','n-mal'],
     foco:[4700,2800,1100,640],focoM:[4730,2830,560,600],
     tomadas:[[5000,[4800,3580,640,520]],[10500,F(19,42,31,34)],[23500,F(17,43,58.5,25)],[38000,TL(2400,1300)]],
     tomadasM:[[4500,[5320,2830,480,560]],[8500,[4820,3600,560,500]],[18000,F(19.5,41,29.5,35)],[24000,F(21,41.5,40,32)],[29000,F(38,38,58.6,27)],[36500,F(14,41,32,34)],[41500,TL(2834,640)]],tempo:46000,
     tracos:[{tipo:'seta',de:{peca:'n-bem',x:50,y:100},para:{peca:'n-mal',x:50,y:0},curva:.3,atraso:A(8800)},
       {tipo:'seta',de:Mp(54.4,30.5),para:Mp(57.0,30.5),cor:'seta',espessura:6,ponta:26,curva:0,atraso:A(33600)}],
     texto:'Os reis persas adoravam ==Ahura Mazda==, o deus supremo e bom do ==zoroastrismo==, religião atribuída ao profeta Zaratustra, também chamado Zoroastro. Nela, o bem e a verdade lutam contra o mal e a mentira, e cada pessoa escolhe seu lado, à espera de um julgamento final. O fogo era símbolo sagrado. Ao tentar dominar as cidades gregas da Ásia Menor e depois a própria Grécia, os persas enfrentaram as ==Guerras Médicas== (490 a 479 a.C.), com batalhas como Maratona e Salamina, e perderam. O império continuou grande, mas, entre 334 e 330 a.C., o macedônio Alexandre o conquistou. Assim, os persas acabaram vencidos por gregos e macedônios.'}
  ]
});
})();
