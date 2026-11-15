/* LAB · Divisão celular → Citogenética · seção "Cromossomos"
   Cenas em canvas 2D, carregadas pelo index.html via window.LAB_CITO (API do Aurelius).
   Desenho e código próprios da equipe (Apolo). Conteúdo: padrão dos livros de ensino médio;
   alinhado ao roteiro do Taxon (docs/revisao-biologia/citogenetica-roteiro.md) e revisado por ele. */
(window.LAB_CITO=window.LAB_CITO||[]).push(function(K){
'use strict';
const{TAU,cl,lerp,ss}=K;

// ---------- cores fixas por estrutura (guia 2.3) ----------
const COR={
 mat:K.C.mat,          // cromossomo de origem materna (violeta, informação genética)
 pat:K.C.pat,          // cromossomo de origem paterna (azul)
 cen:'#CFE0FF',        // centrômero (azul-gelo, onde o fuso se prende)
 tel:'#2FCFBF',        // telômeros (turquesa)
 loc:'#FFE1A6',        // locus gênico (creme)
 sex:'#F7C13B',        // cromossomos sexuais, no destaque (amarelo-ouro)
 aut:'#E8EDF7',        // autossomos, no destaque (branco suave)
 txt:K.C.txt,dim:K.C.dim};

// ---------- cromossomo desenhado como contorno (1 ou 2 cromátides) ----------
// o: x (eixo), y (topo), L (comprimento), w (largura da cromátide), c (posição do centrômero, 0 = topo, 1 = base),
//    dup (0 = uma cromátide, 1 = duas), gap (espaço entre cromátides), wav (0..1, fio ondulado), amp, nw (ondas), sd (fase),
//    col, tel (0..1), cen (0..1), pin (estrangulamento no centrômero, 0..1), bd (alfa das bandas), seed, loc [[fração, cor]]
function crom(o){const X=K.X,L=Math.max(4,o.L),w=Math.max(1.5,o.w),hw=w/2,sc=cl(o.c,0,1)*L,dup=o.dup==null?1:o.dup,wav=o.wav||0,
  gap=o.gap==null?w*.18:o.gap,pin=o.pin==null?1:o.pin,amp=o.amp||Math.min(14,L*.05),nw=o.nw||7,sd=o.sd||0,n=Math.max(18,Math.min(140,Math.round(L/2)));
 const h=s=>{const e0=Math.min(s,L-s);let k=1;if(e0<hw)k=Math.sqrt(Math.max(0,1-((hw-e0)/hw)**2));const d=(s-sc)/(w*.9);return hw*Math.max(.1,k)*(1-.45*pin*Math.exp(-d*d))};
 const off=s=>{const d=(s-sc)/(w*1.2);return dup*(hw+gap/2)*(1-.9*Math.exp(-d*d))};
 const pull=o.pull||0,wx=s=>wav*amp*Math.sin(s/L*TAU*nw+sd)-pull*Math.abs(s-sc)*.6;
 const P=k=>{X.beginPath();for(let j=0;j<=n;j++){const s=L*j/n,x=o.x+k*off(s)+wx(s)-h(s);j?X.lineTo(x,o.y+s):X.moveTo(x,o.y+s)}
  for(let j=n;j>=0;j--){const s=L*j/n;X.lineTo(o.x+k*off(s)+wx(s)+h(s),o.y+s)}X.closePath()};
 const ks=dup>.01?[-1,1]:[0];
 for(const k of ks){P(k);X.fillStyle=o.col;X.fill();
  if(o.bd>.01||o.tel>.01||o.loc){X.save();P(k);X.clip();
   if(o.bd>.01){X.globalAlpha*=o.bd;X.fillStyle='rgba(11,15,28,.55)';for(const[a,b]of bandas(o.seed||1,o.c)){X.fillRect(o.x-w*3,o.y+a*L,w*6,Math.max(1,(b-a)*L))}X.globalAlpha/=o.bd}
   if(o.loc)for(const[fr,cc]of o.loc){X.fillStyle=cc;X.fillRect(o.x-w*3-amp,o.y+fr*L-Math.max(2,w*.22),w*6+amp*2,Math.max(4,w*.44))}
   if(o.tel>.01){const tl=Math.min(w*.55,L*.09);X.globalAlpha*=o.tel;X.fillStyle=COR.tel;X.fillRect(o.x-w*3-amp,o.y-1,w*6+amp*2,tl+1);X.fillRect(o.x-w*3-amp,o.y+L-tl,w*6+amp*2,tl+1);X.globalAlpha/=o.tel}
   X.restore()}
  if(w>5){P(k);X.strokeStyle='rgba(11,15,28,.6)';X.lineWidth=1;X.stroke()}}
 if(o.cen>.01){const ga=X.globalAlpha;X.globalAlpha=ga*o.cen;X.beginPath();X.ellipse(o.x+wx(sc),o.y+sc,Math.max(2.5,w*.55+dup*gap*.3),Math.max(2,w*.3),0,0,TAU);X.fillStyle=COR.cen;X.fill();X.strokeStyle='rgba(11,15,28,.7)';X.lineWidth=1;X.stroke();X.globalAlpha=ga}
 return{x:o.x,cy:o.y+sc,top:o.y,bot:o.y+L,half:dup*(hw+gap/2)+hw,wx}}

// bandas escuras (aparência de coloração em bandas), geradas por semente: esquemáticas, não um mapa real
const BCACHE={};
function bandas(seed,c){const key=seed+':'+c.toFixed(2);if(BCACHE[key])return BCACHE[key];let r=seed*9301+49297;const rnd=()=>(r=(r*9301+49297)%233280)/233280;
 const out=[];let s=.06+rnd()*.05;while(s<.92){const len=.03+rnd()*.06;if(Math.abs(s+len/2-c)>.06)out.push([s,Math.min(.95,s+len)]);s+=len+.04+rnd()*.08}
 return BCACHE[key]=out}

// colchete de braço (p ou q) à esquerda do cromossomo
function colch(x,y1,y2,s,al){if(al<=.01||y2-y1<6)return;const X=K.X,ga=X.globalAlpha;X.globalAlpha=ga*al;X.lineCap='round';
 K.line(x,y1+2,x,y2-2,'rgba(232,237,247,.7)',1.5);K.line(x,y1+2,x+6,y1+2,'rgba(232,237,247,.7)',1.5);K.line(x,y2-2,x+6,y2-2,'rgba(232,237,247,.7)',1.5);
 K.tx(s,x-10,(y1+y2)/2,{f:K.FD,s:14,w:500,c:COR.txt,a:'right'});X.globalAlpha=ga}
// cromossomo girado em torno do centrômero (px,py)
function cromR(o,px,py,ang){const X=K.X;X.save();X.translate(px,py);X.rotate(ang||0);const g=crom(Object.assign({},o,{x:0,y:-o.c*o.L}));X.restore();return g}
const mixS=(A,B,q)=>{const o={};for(const k in B)o[k]=typeof B[k]==='number'?lerp(A[k]==null?B[k]:A[k],B[k],q):B[k];return o};

K.secao({id:'cromossomos',t:'Cromossomos',c:'#3FBF6A'});

// ================= 1. ESTRUTURA =================
K.topico('cromossomos','estrutura',{t:'Anatomia de um cromossomo',s:'cromátides, centrômero, braços e telômeros',c:'#9A6BFF',
 ph:[['Não duplicado (G1)','Em G1, cada cromossomo é uma única molécula de DNA, longa e fina, enrolada em proteínas: a cromatina. Ele já tem um centrômero.'],
  ['Duplicação (fase S)','O DNA é copiado. Surgem duas cromátides-irmãs, idênticas, unidas pelo centrômero. Ainda é um cromossomo só.'],
  ['Condensação','No começo da divisão, o DNA se enrola cada vez mais. O cromossomo encurta e engrossa.'],
  ['Condensado (metáfase)','No máximo de condensação dá para ver tudo: as cromátides-irmãs, o centrômero com o cinetocoro, os braços p e q e os telômeros.'],
  ['Anáfase','As cromátides-irmãs se separam, puxadas pelo centrômero. Cada uma passa a ser um cromossomo não duplicado: agora são 2.']],
 inf:[['1 cromossomo','1 cromátide'],['1 cromossomo','2 cromátides-irmãs'],['1 cromossomo','2 cromátides'],['1 cromossomo','2 cromátides'],['2 cromossomos','1 cromátide cada']],
 leg:[[COR.mat,'cromátide (DNA + proteínas)'],[COR.cen,'centrômero'],[COR.tel,'telômeros (pontas)']],
 d:`<p>O <b>cromossomo</b> é uma molécula de DNA muito longa enrolada em proteínas, as <b>histonas</b>. Na interfase ele fica solto, como <b>cromatina</b>; na divisão se condensa ao máximo, e é na <b>metáfase</b> que fica mais visível. O DNA de uma célula humana, esticado, mede cerca de 2&nbsp;m.</p><p>Depois da fase S, o cromossomo está <b>duplicado</b>: tem duas <b>cromátides-irmãs</b>, cópias idênticas, unidas pelo <b>centrômero</b>. No centrômero fica o <b>cinetocoro</b>, onde se prendem as fibras do fuso. O centrômero divide o cromossomo em dois <b>braços</b>: o curto, <b>p</b> (do francês <i>petit</i>), e o longo, <b>q</b>.</p><p>Nas pontas ficam os <b>telômeros</b>, sequências repetidas que protegem o DNA e encurtam a cada divisão na maioria das células. As duas cromátides têm a mesma cor no desenho porque são cópias idênticas.</p>`,
 kv:[['Célula humana em G1','46 cromossomos, 46 moléculas de DNA'],['Em G2 ou na metáfase','46 cromossomos, 92 cromátides'],['Centrômero','une as cromátides; tem o cinetocoro'],['Braço p','o curto'],['Braço q','o longo'],['Telômeros','protegem as pontas']],
 enem:`A pergunta clássica é contar. Um cromossomo duplicado tem <b>duas cromátides</b>, mas continua sendo <b>um</b> cromossomo: conte os <b>centrômeros</b>. Uma célula humana em metáfase tem 46 cromossomos e 92 cromátides. As cromátides-irmãs são cópias idênticas (até o crossing-over); os homólogos não são.`,
 links:[['Duplicação na fase S','#ciclo/interfase'],['As fases da mitose','#mitose/fases'],['Como o DNA se duplica, no módulo 1','../dna/index.html']],
 draw(i,e){const{W,H}=K,top=64,bot=H-14,av=bot-top,nar=W<520,Lm=Math.min(av*.78,300),wm=cl(Lm*.11,12,28),Lt=av-16,c=.36;
  const M={L:Lm,w:wm,dup:1,wav:0,gap:wm*.18,tel:1,cen:1,pin:1};
  const S=[{L:Lt,w:3,dup:0,wav:1,gap:0,tel:0,cen:.9,pin:0},{L:Lt,w:3,dup:1,wav:1,gap:5,tel:0,cen:.9,pin:0},
   {L:lerp(Lt,Lm,.6),w:lerp(3,wm,.45),dup:1,wav:.35,gap:wm*.2,tel:.2,cen:1,pin:.5},M,M];
  const q=i?e:1,s=mixS(S[Math.max(0,i-1)],S[i],q),cx=W/2-(nar?14:0),y=top+(av-s.L)/2,bx0=nar?64:110;
  if(i===4){const sep=q*Math.min(W*.27,150),cy=y+c*s.L;
   [-1,1].forEach(k=>{const g=crom({x:cx+k*(s.w*.6+sep),y,L:s.L,w:s.w,c,dup:0,col:COR.mat,tel:1,cen:1,pin:1,pull:k*q*.5});
    K.lab(g.x+k*s.w*.6,cy,g.x+k*(s.w+40),cy-s.L*.3-24,k<0?'Cromossomo 1':'Cromossomo 2',q)});return}
  const g=crom({x:cx,y,L:s.L,w:s.w,c,dup:s.dup,wav:s.wav,gap:s.gap,amp:Math.min(16,W*.045),nw:8,col:COR.mat,tel:s.tel,cen:s.cen,pin:s.pin});
  const xr=cx+g.half,bx=Math.min(W-70,xr+bx0);
  if(i===0){K.lab(cx+g.wx(s.L*.72),y+s.L*.72,bx,y+s.L*.66,'Uma molécula de DNA',q);K.lab(cx+g.wx(g.cy-y),g.cy,bx,g.cy-28,'Centrômero',q)}
  if(i===1){K.lab(cx+g.wx(s.L*.82)+s.gap,y+s.L*.82,bx,y+s.L*.78,'Duas cópias idênticas',q);K.lab(cx+g.wx(g.cy-y),g.cy,bx,g.cy-28,'Centrômero',q)}
  if(i===2)K.lab(xr,y+s.L*.7,bx,y+s.L*.72,'O DNA se enrola',q);
  if(i===3){const xl=cx-g.half-14;colch(xl,y,g.cy,'p',q);colch(xl,g.cy,y+s.L,'q',q);
   if(!nar){K.tx('braço curto',xl-26,(y+g.cy)/2,{s:13,c:COR.dim,a:'right'});K.tx('braço longo',xl-26,(g.cy+y+s.L)/2,{s:13,c:COR.dim,a:'right'})}
   K.lab(cx+s.w*.5+s.gap*.5,y+3,bx,y+14,'Telômeros',q);
   K.lab(cx+s.w*.6,g.cy,bx,g.cy-16,'Centrômero',q);
   K.lab(cx+g.half-2,g.cy+3,bx,g.cy+16,'Cinetocoro',q);
   K.lab(cx+s.w*.5+s.gap*.5,y+s.L*.78,bx,y+s.L*.8,'Cromátides-irmãs',q)}}});

// ================= 2. CLASSIFICAÇÃO =================
const CLS=[{n:'Metacêntrico',a:'meta',c:.5,r:'p e q quase iguais',an:'V',ex:'Ser humano: 1, 3, 16, 19 e 20'},
 {n:'Submetacêntrico',a:'submeta',c:.3,r:'p mais curto que q',an:'J',ex:'Ser humano: 2, 4 a 12, 17, 18 e X'},
 {n:'Acrocêntrico',a:'acro',c:.12,r:'p muito curto',an:'I',ex:'Ser humano: 13, 14, 15, 21, 22 e Y'},
 {n:'Telocêntrico',a:'telo',c:0,r:'centrômero na ponta, sem braço p',an:'I',ex:'Não existe em humanos',no:1}];
K.topico('cromossomos','classificacao',{t:'Onde fica o centrômero',s:'metacêntrico, submetacêntrico, acrocêntrico, telocêntrico',c:'#5CC8F0',
 ph:CLS.map((k,j)=>[k.n,[
  'O centrômero fica no meio: os braços p e q têm quase o mesmo tamanho. Na anáfase, puxado pelo centrômero, ele forma um V.',
  'O centrômero fica um pouco fora do meio: um braço é claramente mais curto. Na anáfase, forma um J (ou L).',
  'O centrômero fica perto de uma ponta: o braço p é minúsculo. Na anáfase, parece um bastão (I).',
  'O centrômero fica na própria ponta: só há o braço q. Não existe em humanos; ocorre em outras espécies, como o camundongo.'][j]]),
 inf:CLS.map(k=>[`forma ${k.an}`,'na anáfase']),
 leg:[[COR.mat,'cromátides'],[COR.cen,'centrômero'],[COR.tel,'telômeros']],
 d:`<p>A posição do <b>centrômero</b> dá a forma do cromossomo e serve para classificá-lo. Ele divide o cromossomo em braço <b>p</b> (curto, em cima) e braço <b>q</b> (longo, embaixo). Mova a faixa e veja o centrômero deslizar do meio até a ponta.</p><p><b>Metacêntrico</b>: centrômero no meio, braços quase iguais. <b>Submetacêntrico</b>: um pouco fora do meio. <b>Acrocêntrico</b>: perto de uma ponta, braço p minúsculo. <b>Telocêntrico</b>: na própria ponta, um braço só.</p><p>Na <b>anáfase</b>, cada cromátide é puxada pelo centrômero e as pontas ficam para trás. Por isso o metacêntrico vira um <b>V</b>, o submetacêntrico um <b>J</b> e o acrocêntrico e o telocêntrico, um bastão (<b>I</b>). A espécie humana tem os três primeiros tipos, mas <b>nenhum telocêntrico</b>.</p>`,
 kv:[['Metacêntrico','1, 3, 16, 19, 20'],['Submetacêntrico','2, 4 a 12, 17, 18, X'],['Acrocêntrico','13, 14, 15, 21, 22, Y'],['Telocêntrico','nenhum em humanos']],
 enem:`As questões mostram o desenho de um cromossomo, às vezes na anáfase, e pedem o tipo. Olhe <b>onde está o centrômero</b>: no meio, metacêntrico (V na anáfase); fora do meio, submetacêntrico (J ou L); perto da ponta, acrocêntrico (I com um braço minúsculo); na ponta, telocêntrico (I sem braço p). O ser humano <b>não tem telocêntricos</b>, e o 21, o da síndrome de Down, é acrocêntrico.`,
 links:[['Anatomia de um cromossomo','#cromossomos/estrutura'],['O cariótipo humano','#cromossomos/cariotipo']],
 draw(i,e){const{X,W,H}=K,top=60,bot=H-10,nar=W<520,rowH=nar?80:96,exH=50,av=bot-top-rowH-exH,L=Math.min(av-16,250),w=cl(L*.12,10,26);
  const q=i?e:1,c=lerp(CLS[Math.max(0,i-1)].c,CLS[i].c,q),cx=nar?W*.38:W/2-70,y=top+8+(av-16-L)/2;
  const g=crom({x:cx,y,L,w,c,dup:1,gap:w*.18,col:COR.mat,tel:1,cen:1,pin:1});
  const xl=cx-g.half-12;colch(xl,y,g.cy,'p',c*L>8?1:0);colch(xl,g.cy,y+L,'q',1);
  // forma na anáfase: uma cromátide puxada pelo centrômero (para a direita), com as pontas para trás
  const aL=L*.6,ax=nar?W-14-aL*(1-c)*.66:W/2+110,ay=g.cy-c*aL;
  crom({x:ax,y:ay,L:aL,w:w*.9,c,dup:0,col:COR.mat,tel:1,cen:1,pin:1,pull:-1.1});
  K.tx('na anáfase',ax-aL*.12,y+L+2,{s:13,c:COR.dim});
  if(!nar)K.lab(cx+w*.7,g.cy,cx+g.half+90,g.cy-34,'Centrômero',1);
  const ty=y+L+22,ex=CLS[i];X.globalAlpha=q;K.tx(ex.r,W/2,ty,{s:13,c:COR.dim});K.tx(ex.ex,W/2,ty+22,{f:K.FD,s:nar?12:13,w:500,c:ex.no?'#FF9AA6':COR.txt});X.globalAlpha=1;
  const ry=bot-rowH,sw=Math.min(150,(W-16)/4),x0=(W-sw*4)/2,Li=rowH-38,wi=cl(Li*.13,4,8);
  CLS.forEach((k,j)=>{const xc=x0+(j+.5)*sw,on=j===i;X.globalAlpha=on?1:.55;
   if(on){K.rr(xc-sw/2+3,ry,sw-6,rowH-2,8);X.fillStyle='rgba(255,255,255,.06)';X.fill();X.strokeStyle='rgba(232,237,247,.55)';X.lineWidth=1.2;X.stroke()}
   crom({x:xc-(nar?8:12),y:ry+8,L:Li,w:wi,c:k.c,dup:1,gap:wi*.2,col:COR.mat,tel:1,cen:1,pin:1});
   K.tx(k.an,xc+(nar?14:20),ry+8+Li*.5,{f:K.FTT,s:15,w:700,c:on?COR.txt:COR.dim,bg:false});
   K.tx(nar?k.a:k.n,xc,ry+rowH-14,{s:nar?12:13,w:on?700:400,c:on?COR.txt:COR.dim,bg:false})});X.globalAlpha=1}});

// ================= 3. CARIÓTIPO =================
// comprimentos relativos (cromossomo 1 = 1) e índice centromérico (fração do braço p): valores aproximados de livros-texto
const LEN={1:1,2:.97,3:.81,4:.77,5:.73,6:.69,7:.64,8:.59,9:.57,10:.55,11:.55,12:.54,13:.46,14:.43,15:.41,16:.36,17:.33,18:.31,19:.24,20:.25,21:.19,22:.2,X:.62,Y:.23};
const CI={1:.49,2:.39,3:.47,4:.29,5:.28,6:.39,7:.37,8:.34,9:.35,10:.32,11:.4,12:.28,13:.16,14:.16,15:.17,16:.43,17:.33,18:.27,19:.46,20:.45,21:.2,22:.21,X:.4,Y:.2};
const GR=[['A',[1,2,3],'grandes; 1 e 3 metacêntricos, 2 submetacêntrico'],['B',[4,5],'grandes, submetacêntricos'],['C',[6,7,8,9,10,11,12],'médios, submetacêntricos'],
 ['D',[13,14,15],'médios, acrocêntricos'],['E',[16,17,18],'pequenos; 16 metacêntrico, 17 e 18 submetacêntricos'],['F',[19,20],'pequenos, metacêntricos'],['G',[21,22],'pequenos, acrocêntricos'],['XY',['S'],'cromossomos sexuais']];
const ROWS=[[0,1],[2],[3,4],[5,6,7]];
let modo=0,btn=null,visto=0;
const MODOS=['Destaque: nenhum','Destaque: autossomos','Destaque: sexuais'];
function updBtn(){if(!btn)return;btn.textContent=MODOS[modo];btn.setAttribute('aria-pressed',String(modo>0));
 btn.title=modo===0?'Toque para destacar os 22 pares de autossomos':modo===1?'Toque para destacar o par de cromossomos sexuais':'Toque para tirar o destaque'}
function botao(){visto=performance.now();if(btn&&btn.isConnected)return;const row=document.querySelector('.ctrl .row');if(!row)return;
 btn=document.createElement('button');btn.type='button';btn.className='btn';btn.id='cromDestaque';btn.onclick=()=>{modo=(modo+1)%3;updBtn()};row.appendChild(btn);updBtn();
 const chk=()=>{if(btn)btn.style.display=performance.now()-visto>400?'none':'';requestAnimationFrame(chk)};requestAnimationFrame(chk)}
// posições da metáfase espalhada (fixas, geradas por semente)
const ESPALHA=(()=>{let r=4242;const rnd=()=>(r=(r*9301+49297)%233280)/233280;const out=[];for(let j=0;j<46;j++){const a=rnd()*TAU,d=Math.sqrt(.06+rnd()*.94)*.82;out.push([Math.cos(a)*d,Math.sin(a)*d,(rnd()-.5)*TAU])}return out})();
K.topico('cromossomos','cariotipo',{t:'Cariótipo humano',s:'46 cromossomos em ordem',c:'#F7C13B',dur:2.6,
 ph:[['Metáfase espalhada','Células em divisão recebem colchicina, que impede o fuso: elas param na metáfase, com os cromossomos bem condensados e espalhados.'],
  ...GR.slice(0,7).map(([g,ns,s])=>[`Grupo ${g}`,`Pares ${ns[0]} ${ns.length===2?'e':'a'} ${ns[ns.length-1]}: ${s}.`]),
  ['46,XX','O 23º par é o dos cromossomos sexuais. Com dois X, o cariótipo é feminino: 46,XX.'],
  ['46,XY','Com um X e um Y, o cariótipo é masculino: 46,XY. O Y é bem menor que o X e vem sempre do pai.']],
 inf:[['46 cromossomos','espalhados'],...GR.slice(0,7).map(([g,ns])=>[`Grupo ${g}`,`pares ${ns[0]} ${ns.length===2?'e':'a'} ${ns[ns.length-1]}`]),['46,XX','44 autossomos + XX'],['46,XY','44 autossomos + XY']],
 leg:[[COR.mat,'cromossomo de origem materna'],[COR.pat,'cromossomo de origem paterna'],[COR.aut,'autossomos (no destaque)'],[COR.sex,'sexuais (no destaque)']],
 d:`<p>O <b>cariótipo</b> é o conjunto de cromossomos de uma espécie, e também a imagem em que eles aparecem organizados em pares. A espécie humana tem <b>46 cromossomos</b>: <b>22 pares de autossomos</b>, numerados de 1 a 22 do maior para o menor, e <b>1 par de cromossomos sexuais</b>, <b>XX</b> na mulher e <b>XY</b> no homem.</p><p>Para montá-lo, cultivam-se células que se dividem (em geral linfócitos do sangue) e acrescenta-se <b>colchicina</b>, que impede a formação do fuso e para as células na <b>metáfase</b>. Os cromossomos são corados, o que revela <b>bandas</b> claras e escuras próprias de cada um, e depois pareados pelo <b>tamanho</b>, pela <b>posição do centrômero</b> e pelo <b>padrão de bandas</b>, em 7 grupos, de A a G. A notação resume o resultado: <b>46,XX</b> ou <b>46,XY</b>.</p><p>Numa foto real os cromossomos não têm cor; aqui o violeta marca o que veio da mãe e o azul, o que veio do pai. As bandas do desenho são esquemáticas. Use o botão <b>Destacar</b> para separar autossomos e sexuais.</p>`,
 kv:[['Cromossomos','46 (2n)'],['Autossomos','44 (22 pares)'],['Sexuais','2 (XX ou XY)'],['Fase usada','metáfase (colchicina)'],['Gametas','23 (n)']],
 enem:`Cariótipo se monta com células em <b>metáfase</b>, paradas pela <b>colchicina</b>, que bloqueia o fuso. A prova costuma dar um cariótipo e pedir o sexo e se há alteração: conte os cromossomos (46?), veja o par sexual (XX ou XY) e procure um número com três cópias ou com uma só. O cariótipo mostra alterações de <b>número e de forma</b> dos cromossomos; uma mutação num só gene não aparece nele.`,
 links:[['Aneuploidias','#erros/aneuploidias'],['Onde fica o centrômero','#cromossomos/classificacao']],
 draw(i,e){botao();const{X,W,H}=K,top=58,bot=H-6,nar=W<600,sx=i===9&&modo===0?e:i===9?1:0;
  const pq=n=>[CI[n]*LEN[n],(1-CI[n])*LEN[n]];
  const RW=ROWS.map(r=>{let mp=0,mq=0,slots=0;r.forEach(g=>{const ns=g===7?['X']:GR[g][1];slots+=ns.length;ns.forEach(n=>{const[a,b]=pq(n);mp=Math.max(mp,a);mq=Math.max(mq,b)})});return{mp,mq,slots:slots+(r.length-1)*.6}});
  const lab=30,gapR=nar?4:8,sum=RW.reduce((a,r)=>a+r.mp+r.mq,0),k=Math.max(20,(bot-top-ROWS.length*lab-(ROWS.length-1)*gapR)/sum);
  const maxS=Math.max(...RW.map(r=>r.slots)),sw=Math.min(84,(W-12)/maxS),w=Math.min(sw*.11,k*.055,9),dx=w*1.25+1.5;
  const Rc=Math.min(W/2-12,(bot-top)/2-6),ccx=W/2,ccy=(top+bot)/2,ks=Rc*.3,ws=Math.max(2.5,ks*.06);
  const fly=g=>modo>0?1:g===7?(i>=8?(i===8?e:1):0):(g<i-1?1:g===i-1?e:0);
  const aCel=modo>0?0:i===0?1:i===1?1-e:0;
  if(aCel>.01){X.globalAlpha=aCel;K.circ(ccx,ccy,Rc,'rgba(44,29,68,.35)','rgba(240,106,174,.5)',1.5);X.globalAlpha=1}
  // grade: posição do centrômero de cada cromossomo
  let y=top,idx=0;const fr={},ITEMS=[];
  ROWS.forEach((r,ri)=>{const R=RW[ri],cy=y+16+R.mp*k,hh=(R.mp+R.mq)*k,rowW=R.slots*sw;let x=(W-rowW)/2;
   r.forEach(g=>{const ns=g===7?['S']:GR[g][1];fr[g]={b:[x+2,y+1,ns.length*sw-4,hh+lab-2],ly:y+7,ny:y+16+hh+8,ns,x0:x};
    ns.forEach((n,j)=>{const xc=x+(j+.5)*sw;
     if(n==='S'){ITEMS.push({g,L:LEN.X,c:CI.X,col:COR.mat,px:xc-dx,py:cy,seed:24,id:idx++});ITEMS.push({g,L:lerp(LEN.X,LEN.Y,sx),c:lerp(CI.X,CI.Y,sx),col:COR.pat,px:xc+dx,py:cy,seed:sx>.5?99:24,id:idx++})}
     else{ITEMS.push({g,L:LEN[n],c:CI[n],col:COR.mat,px:xc-dx,py:cy,seed:n*7+1,id:idx++});ITEMS.push({g,L:LEN[n],c:CI[n],col:COR.pat,px:xc+dx,py:cy,seed:n*7+1,id:idx++})}});
    x+=ns.length*sw+.6*sw});
   y+=hh+lab+gapR});
  // molduras e textos dos grupos
  for(let g=0;g<8;g++){const F=fr[g],a=fly(g);let dim=1;if(modo===1&&g===7)dim=.22;if(modo===2&&g<7)dim=.22;
   if(modo===0&&a>.01&&(g===i-1||(g===7&&i>=8))){X.globalAlpha=a;K.rr(...F.b,8);X.fillStyle='rgba(255,255,255,.05)';X.fill();X.strokeStyle='rgba(232,237,247,.4)';X.lineWidth=1;X.stroke()}
   if(a*dim>.01){X.globalAlpha=a*dim;K.tx(GR[g][0],F.b[0]+F.b[2]/2,F.ly,{f:K.FD,s:12,w:500,c:g===7&&modo===2?COR.sex:COR.dim,bg:false});
    F.ns.forEach((n,j)=>K.tx(n==='S'?(sx>.5?'XY':'XX'):String(n),F.x0+(j+.5)*sw,F.ny,{f:K.FD,s:12,w:500,c:COR.txt,bg:false}))}}
  X.globalAlpha=1;
  // cromossomos: da metáfase espalhada até a grade
  for(const it of ITEMS){const a=ss(fly(it.g)),sp=ESPALHA[it.id];let dim=1;if(modo===1&&it.g===7)dim=.22;if(modo===2&&it.g<7)dim=.22;
   const vis=modo>0?1:Math.max(aCel,a);if(vis<=.01)continue;X.globalAlpha=vis*dim;
   const px=lerp(ccx+sp[0]*Rc,it.px,a),py=lerp(ccy+sp[1]*Rc,it.py,a),sc=lerp(ks,k,a),ww=lerp(ws,w,a);
   cromR({L:it.L*sc,w:ww,c:it.c,dup:1,gap:ww*.2,col:it.col,bd:.7,seed:it.seed,tel:0,cen:0,pin:1},px,py,lerp(sp[2],0,a))}
  X.globalAlpha=1;
  if(i===0&&modo===0)K.lab(ccx+Rc*.7,ccy-Rc*.7,ccx,ccy-Rc-6,'Colchicina: parada na metáfase',e);
  if(modo===1){for(let g=0;g<7;g++){K.rr(...fr[g].b,8);X.strokeStyle=COR.aut;X.lineWidth=1.5;X.stroke()}if(!nar){const b=fr[1].b;K.lab(b[0]+b[2],b[1]+b[3]*.5,b[0]+b[2]+110,b[1]+b[3]*.5,'Autossomos: 22 pares',1)}}
  if(modo===2){const b=fr[7].b;K.rr(...b,8);X.fillStyle='rgba(247,193,59,.08)';X.fill();X.strokeStyle=COR.sex;X.lineWidth=2;X.stroke();if(!nar)K.lab(b[0]+b[2],b[1]+b[3]*.5,b[0]+b[2]+90,b[1]+b[3]*.5,sx>.5?'Sexuais: X e Y':'Sexuais: X e X',1)}}});

// ================= 4. HOMÓLOGOS, n E 2n =================
const ESP=[['Mosca-das-frutas',8],['Ervilha',14],['Milho',20],['Gato',38],['Ser humano',46],['Chimpanzé',48],['Jumento',62],['Cavalo',64],['Cão',78]];
K.topico('cromossomos','homologos',{t:'Homólogos, n e 2n',s:'um conjunto da mãe, outro do pai',c:'#F06AAE',
 ph:[['Célula diploide (2n)','A célula-modelo do módulo tem 2 pares de cromossomos, um longo e um curto: 2n = 4. Em cada par, um veio da mãe e o outro do pai.'],
  ['Um par de homólogos','Os homólogos têm o mesmo tamanho, o centrômero no mesmo lugar e os mesmos genes nas mesmas posições. Os alelos podem ser diferentes: A num, a no outro.'],
  ['Gametas (n)','Na meiose, cada gameta recebe um conjunto: um cromossomo de cada tipo, sem homólogos. n = 2. Na fecundação, n + n refaz o 2n.'],
  ['Número por espécie','Cada espécie tem seu número. No ser humano, n = 23 e 2n = 46. O número não mede a complexidade: o cão tem 78.']],
 inf:[['2n = 4','2 pares de homólogos'],['1 par','mesmos genes'],['n = 2','um de cada tipo'],['Ser humano','n = 23, 2n = 46']],
 leg:[[COR.mat,'origem materna'],[COR.pat,'origem paterna'],[COR.loc,'locus (posição de um gene)'],[COR.cen,'centrômero']],
 d:`<p><b>Cromossomos homólogos</b> são os dois de um mesmo par: têm o mesmo tamanho, a mesma posição do centrômero e os <b>mesmos genes nos mesmos lugares</b> (os <b>loci</b>), mas podem ter versões diferentes desses genes, os <b>alelos</b>. Um veio da mãe, pelo óvulo, e o outro do pai, pelo espermatozoide.</p><p>A letra <b>n</b> indica quantos cromossomos há num <b>conjunto</b>, o lote completo com um de cada tipo. Uma célula <b>diploide (2n)</b> tem dois conjuntos, ou seja, os cromossomos em pares; uma <b>haploide (n)</b> tem um só, sem homólogos. No ser humano, <b>n&nbsp;=&nbsp;23</b> e <b>2n&nbsp;=&nbsp;46</b>: as células do corpo são 2n e os gametas, n. A fecundação junta n&nbsp;+&nbsp;n e refaz o 2n.</p><p>O número de cromossomos é próprio de cada espécie e não indica complexidade: o cão tem 78, e o ser humano, 46.</p>`,
 kv:[['Ser humano','2n = 46, n = 23'],['Chimpanzé','2n = 48'],['Cão','2n = 78'],['Cavalo','2n = 64'],['Jumento','2n = 62'],['Burro ou mula (híbrido)','63 cromossomos, estéril'],['Mosca-das-frutas','2n = 8']],
 enem:`<b>Homólogos</b> formam um par (um da mãe, um do pai, mesmos genes, alelos que podem diferir); <b>cromátides-irmãs</b> são as duas cópias idênticas de um mesmo cromossomo duplicado. Não confunda. <b>n</b> é o número de cromossomos de um conjunto: gametas humanos têm n&nbsp;=&nbsp;23, as demais células, 2n&nbsp;=&nbsp;46. A mula, com 63 cromossomos (32&nbsp;+&nbsp;31), cai como exemplo de híbrido estéril, porque não consegue parear os cromossomos na meiose.`,
 links:[['Meiose I e II','#meiose/fases'],['O cariótipo humano','#cromossomos/cariotipo']],
 draw(i,e){const{X,W,H}=K,top=60,bot=H-10,av=bot-top,nar=W<600,q=i?e:1;
  const aC=i===0?1:i===1?1-e:i===2?e:i===3?1-e:0,aP=i===1?e:i===2?1-e:0,aG=i===2?e:i===3?1-e:0,aB=i===3?e:0;
  const two=!nar,R=two?Math.min(W*.2,(av-70)/2):Math.min(W*.36,(av/2-48)/1.9);
  const pos=i===0||i===1&&!two?[[W/2,top+(av-30)/2]]:two?[[W*.32,top+(av-30)/2],[W*.72,top+(av-30)/2]]:[[W/2,top+R+6],[W/2,top+av/2+R*.78+18]];
  const Ls=[.95,.55].map(v=>v*R*.9),wd=cl(R*.1,4,10),CC=[.4,.3];
  const cel=(x,y,r,set,al,tag,sub)=>{if(al<=.01)return;X.globalAlpha=al;K.circ(x,y,r,K.C.cyt,K.C.mem,2);
   set.forEach(([pi,col,ox])=>{const L=Ls[pi]*(r/R);crom({x:x+ox*r,y:y-L*.5,L,w:wd*(r/R)+.5,c:CC[pi],dup:0,col,tel:0,cen:1,pin:.6})});
   K.tx(tag,x,y+r+14,{f:K.FD,s:13,w:500,c:COR.txt});K.tx(sub,x,y+r+32,{s:12.5,c:COR.dim,bg:false});X.globalAlpha=1};
  if(aC>.01){const p0=i===0||i===1?[W/2,top+(av-30)/2]:pos[0];
   cel(p0[0],p0[1],R,[[0,COR.mat,-.5],[0,COR.pat,-.22],[1,COR.mat,.2],[1,COR.pat,.48]],aC,'2n = 4','célula do corpo (diploide)');
   if(i===0)K.lab(p0[0]-.36*R,p0[1]-Ls[0]*.3,p0[0]-.2*R,p0[1]-R-16,'Par de homólogos',q);
   if(i>=2){const p1=pos[1];cel(p1[0],p1[1],R*.75,[[0,COR.mat,-.25],[1,COR.pat,.25]],aG*aC/(aC||1),'n = 2','gameta (haploide)')}}
  if(aP>.01){X.globalAlpha=aP;const L=Math.min(av-80,260),w=cl(L*.1,10,22),d=Math.max(w*2.6,Math.min(W*.16,90)),cx=W/2,y=top+14+(av-80-L)/2,c=.35;
   const loc=[[.16,COR.loc],[.72,COR.loc]];
   const g1=crom({x:cx-d,y,L,w,c,dup:1,col:COR.mat,tel:1,cen:1,loc}),g2=crom({x:cx+d,y,L,w,c,dup:1,col:COR.pat,tel:1,cen:1,loc});
   [['A','B',g1,-1],['a','b',g2,1]].forEach(([p1,p2,g,s])=>{K.tx(p1,g.x+s*(g.half+14),y+.16*L,{f:K.FTT,s:15,w:700,c:COR.loc});K.tx(p2,g.x+s*(g.half+14),y+.72*L,{f:K.FTT,s:15,w:700,c:COR.loc})});
   K.tx('materno',cx-d,y+L+16,{s:13,c:K.light(COR.mat,.4)});K.tx('paterno',cx+d,y+L+16,{s:13,c:K.light(COR.pat,.3)});
   K.lab(cx+d-w*.5,y+.72*L,cx,y+L+44,'Mesmo gene, alelos diferentes',i===1?e:1);X.globalAlpha=1}
  if(aB>.01){X.globalAlpha=aB;const rh=Math.min(44,(av-12)/ESP.length),nw=nar?122:170,x0=12+nw,bw=W-x0-(nar?76:96),y0=top+(av-rh*ESP.length)/2;
   ESP.forEach(([s,n],j)=>{const yy=y0+(j+.5)*rh,hu=s==='Ser humano',len=bw*n/78*e;
    K.tx(s,12,yy,{s:13,w:hu?700:400,c:hu?COR.txt:COR.dim,a:'left',bg:false});
    K.rr(x0,yy-rh*.2,Math.max(2,len),rh*.4,4);X.fillStyle=hu?COR.mat:K.rgba(COR.mat,.45);X.fill();
    K.tx(`2n = ${n}`,x0+len+8,yy,{f:K.FD,s:13,w:500,c:hu?COR.txt:COR.dim,a:'left',bg:false})});X.globalAlpha=1}}});
});
