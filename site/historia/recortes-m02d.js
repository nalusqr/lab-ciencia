/* Recortes do tópico 4 do módulo 2 (Reinos africanos: Gana, Mali e Songhai), desenhados em código. A única figura de IA do tópico é o Mansa Musa (historia-africa-mansa-musa).
   Carregue DEPOIS de colagem.js e recortes.js. Não altera o motor: registra ícones novos em C.icone e tipos novos em C.tipos.
   Ícones (use {tipo:'icone', nome:'...'}): camelo-af, pepita, sal, tecidos, cavalo, tamaras, mesquita, manuscritos, cauri, pilha-ouro, mascara-longa, mascara-marfim, mascara-gelede, grio.
   Tipos próprios: mapitens (camada de ícones, setas, régua e círculos sobre o mapa, em longitude e latitude), fitaafr (fita do tempo de três faixas), musa (a figura de IA em P&B com o ouro em cor),
     cauri3 (cauri que cai e gira), minimapa (África com três pontos acesos), matri (árvore de família matrilinear), col2 (duas colunas de papel), candace (silhueta em círculo), vitrine (linha tracejada que se fecha), ondas (ondas sonoras do griô).
   Regras: a escrita que aparece é abstrata e ilegível; nenhum texto árabe real. */
(function(){
'use strict';
const C=window.Colagem;
if(!C||!C.tipos||!C.icone)throw new Error('Carregue colagem.js e recortes.js antes de recortes-m02d.js');
const T='#1b1a17',P='#f6f1e4',esc=C.esc;
let seq=0;
const pth=(d,f,s,w,x)=>'<path d="'+d+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+' stroke-linecap="round" stroke-linejoin="round"'+(x||'')+'/>';
const tinta=(d,w)=>pth(d,'none',T,w||2);
const circ=(cx,cy,r,f,s,w)=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+'/>';
const ell=(cx,cy,rx,ry,f,s,w,x)=>'<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+(x||'')+'/>';
const rect=(x,y,w,h,f,s,sw,x2)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(sw||3)+'"':'')+' stroke-linejoin="round"'+(x2||'')+'/>';
const hach=(d,pad,op)=>'<path d="'+d+'" fill="url(#'+(pad||'cm-h1')+')" opacity="'+(op||.6)+'"/>';
const sTx=(x,y,t,sz,w,anc,fill,fam,extra)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+(anc||'middle')+'"'+(extra||'')+' style="font:'+(w||700)+' '+sz+'px '+(fam||'var(--sans,sans-serif)')+';fill:'+(fill||T)+'">'+esc(t)+'</text>';
const SERIF='var(--serif,Georgia,serif)';
const GOLD='#e0b43a',MUD='#cfa86a',MUD2='#bd9358',RED='#c93a2a',WOOD='#8a5a33',WOOD2='#6b4524',IVORY='#efe3c2',SKIN='#a9744a',INDIGO='#2f4f8f';
const sleep=0;void sleep;

/* ---------- CSS da página ---------- */
(function(){
  const s=document.createElement('style');
  s.textContent=
  '.cm-m4{filter:none}.cm-m4 svg{display:block;width:100%;height:100%;overflow:visible}'+
  '.cm-m4.sb{filter:drop-shadow(0 6px 8px rgba(0,0,0,.22))}'+
  '.cm-m4.mi{pointer-events:none}'+
  '.cm-m4 .it{opacity:0;transition:opacity .6s ease-out}.cm-m4 .it.on{opacity:1;transition-delay:var(--a,0s)}'+
  '.cm-m4 .mk{opacity:.5;transition:opacity .5s}.cm-m4 .mk.on{opacity:1}'+
  '.cm-m4 .mk.on .mt{paint-order:stroke;stroke:#ffd83d;stroke-width:9px;stroke-linejoin:round}'+
  '.cm-m4 .ap{opacity:1}'+
  '.m4-pulsa{animation:m4-p 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}'+
  '@keyframes m4-p{0%,100%{transform:scale(.8);opacity:.9}50%{transform:scale(1.35);opacity:.35}}'+
  '.m4-cand{filter:none;border-radius:50%;overflow:hidden;border:10px solid #ffd83d;background:#e6dcc0;box-shadow:0 5px 8px rgba(0,0,0,.28)}'+
  '.m4-cand svg{display:block;width:100%;height:100%}'+
  '.m4-col{background:#fffdf6;display:grid;grid-template-columns:1fr 1fr;box-shadow:0 5px 8px rgba(0,0,0,.25);filter:none}'+
  '.m4-col>div{padding:30px 34px}.m4-col>div+div{border-left:5px dashed rgba(27,26,23,.4)}'+
  '.m4-col h4{margin:0 0 14px;font:400 var(--t1,60px)/1.08 var(--serif);display:inline;background:linear-gradient(transparent 55%,var(--cor,#ffd83d) 55% 92%,transparent 92%)}'+
  '.m4-col p{margin:18px 0 0;font:600 var(--t2,40px)/1.25 var(--sans);color:#2f2e2a}'+
  '.m4-cauri{filter:none}.m4-cauri svg{overflow:visible}'+
  '.m4-ouro{position:absolute;inset:0;background-size:cover;background-position:center}'+
  '@media (prefers-reduced-motion:no-preference){'+
    '.m4-cauri:not(.fora) .gi{animation:m4-g 6s linear 1.4s infinite;transform-origin:50% 50%;transform-box:fill-box}'+
    '.m4-cauri:not(.fora) .qd{animation:m4-q 1.1s cubic-bezier(.2,.9,.3,1.15) var(--a,0s) both}'+
    '.cm-m4 .vit{stroke-dasharray:1;stroke-dashoffset:1}.cm-m4:not(.fora) .vit{animation:m4-v 2.2s ease-out var(--a,0s) forwards}'+
    '.cm-m4 .ond{opacity:0}.cm-m4:not(.fora) .ond{animation:m4-o 2.4s ease-in-out var(--a,0s) infinite}'+
    '.cm-m4 .ond.o2{animation-delay:calc(var(--a,0s) + .5s)}.cm-m4 .ond.o3{animation-delay:calc(var(--a,0s) + 1s)}'+
    '@keyframes m4-g{0%{transform:rotateY(0)}50%{transform:rotateY(180deg)}100%{transform:rotateY(360deg)}}'+
    '@keyframes m4-q{from{opacity:0;transform:translateY(-300px) rotate(-70deg)}to{opacity:1;transform:none}}'+
    '@keyframes m4-v{to{stroke-dashoffset:0}}'+
    '@keyframes m4-o{0%{opacity:0}30%{opacity:.95}100%{opacity:0}}'+
  '}'+
  '@media (prefers-reduced-motion:reduce){.cm-m4 .vit{stroke-dashoffset:0}.cm-m4 .ond{opacity:.8}.m4-pulsa{animation:none}}';
  document.head.appendChild(s);
})();

/* ---------- escrita abstrata (só ritmo de traços, sem palavra nenhuma) ---------- */
function escrita(seed,x0,x1,y,amp,sw,cor){
  const r=C.rng('esc'+seed);let x=x0,d='M'+x0+' '+y;const a=amp||14;
  while(x<x1-20){
    const k=r(),w=14+r()*20;
    if(k<.25){d+=' L'+(x+w*.4).toFixed(1)+' '+y+' L'+(x+w*.4).toFixed(1)+' '+(y-a*(1.6+r())).toFixed(1)+' M'+(x+w*.4).toFixed(1)+' '+y;}
    else if(k<.55){d+=' C'+(x+w*.2).toFixed(1)+' '+(y-a*1.4).toFixed(1)+' '+(x+w*.8).toFixed(1)+' '+(y-a*1.4).toFixed(1)+' '+(x+w).toFixed(1)+' '+y;}
    else if(k<.8){d+=' C'+(x+w*.3).toFixed(1)+' '+(y+a*1.2).toFixed(1)+' '+(x+w*.7).toFixed(1)+' '+(y+a*1.2).toFixed(1)+' '+(x+w).toFixed(1)+' '+y;}
    else {d+=' L'+(x+w).toFixed(1)+' '+y;}
    x+=w;
  }
  return '<path d="'+d+'" fill="none" stroke="'+(cor||T)+'" stroke-width="'+(sw||3)+'" stroke-linecap="round" stroke-linejoin="round"/>';
}

/* ---------- ícones: arte em 0..200, papel colorido por baixo, margem branca de recorte ---------- */
const IO={},ART={};
function reg(nome,fundo,rotulo,art){IO[nome]={fundo:fundo,nome:rotulo,art:art};ART[nome]=art;if(C.ICONES&&C.ICONES.indexOf(nome)<0)C.ICONES.push(nome);}
function fundoO(cor,seed){
  const r=C.rng('fundo'+seed),pts=[];
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2,k=84+(r()-.5)*7;pts.push([104+Math.cos(a)*k,106+Math.sin(a)*k]);}
  return '<path d="'+C.suave(pts,true)+'" fill="'+C.cor(cor)+'" filter="url(#cm-rasga)"/>';
}
const icone0=C.icone;
try{icone0(C.ICONES[0]);}catch(e){}/* garante os padrões de hachura (cm-h1, cm-hh) no documento */
function iconeO(nome,o){
  o=o||{};const ic=IO[nome],u='md'+(seq++)+'-',fd=o.fundo===false?'':fundoO(o.fundo||ic.fundo,nome);
  return '<svg viewBox="-14 -14 228 228" role="img" aria-label="'+esc(o.rotulo||ic.nome)+'">'+fd+
    '<g filter="url(#cm-sombra)"><g class="cm-sil">'+ic.art('s'+u)+'</g></g>'+ic.art(u)+'</svg>';
}
C.icone=function(nome,o){return IO[nome]?iconeO(nome,o):icone0(nome,o);};

/* camelo (dromedário) de perfil, com a manta vermelha */
reg('camelo-af','amarelo','Camelo',u=>{
  let s=pth('M62 124 L60 172 M76 124 L78 172 M122 126 L124 172 M136 124 L140 172','none',T,12)+pth('M62 124 L60 172 M76 124 L78 172 M122 126 L124 172 M136 124 L140 172','none','#b98a4e',7);
  s+=pth('M34 98 C36 92 50 90 64 92 C72 92 76 86 80 76 C84 62 90 58 96 60 C104 64 106 80 116 90 C124 94 130 94 136 88 C144 80 146 64 152 52 C156 46 168 46 174 54 C178 60 176 66 168 68 C162 70 160 74 158 80 C154 92 150 102 146 112 C144 120 140 126 130 128 L72 128 C54 128 40 122 36 110Z','#c9a36a',T,3.4);
  s+=hach('M116 96 C130 100 144 96 150 84 L146 112 C144 120 140 126 130 128 L100 128 C114 124 118 110 116 96Z','cm-h1',.45);
  s+=circ(162,56,2.6,T)+pth('M170 62 H176','none',T,2.4)+pth('M36 100 C28 106 28 120 34 130','none',T,4);
  s+=pth('M96 94 C100 104 98 114 90 118 L68 120 C60 108 68 98 80 96Z',RED,T,2.6)+pth('M70 106 H92','none',T,2);
  return s;});

/* pepita de ouro */
reg('pepita','#e9dcb4','Pepita de ouro',u=>{
  let s=pth('M40 124 C30 98 50 72 78 68 C92 52 124 54 138 70 C160 74 172 100 162 126 C152 152 120 160 96 154 C70 158 48 148 40 124Z',GOLD,T,3.6);
  s+=pth('M78 68 C84 84 96 90 112 86 C124 84 134 78 138 70','none',T,2.4)+pth('M60 112 C74 108 82 118 96 114 C112 110 120 122 136 118','none',T,2.4)+pth('M70 136 C84 130 92 140 106 138','none',T,2.2);
  s+=pth('M62 92 C68 84 78 82 84 84','none','#fff6c8',5)+pth('M112 130 C122 128 132 124 140 116','none','#fff6c8',4);
  s+=hach('M98 154 C120 160 152 152 162 126 C168 110 160 90 150 82 C150 110 130 140 98 154Z','cm-h1',.5);
  return s;});

/* bloco de sal em placa, amarrado com corda (as placas de Taghaza) */
reg('sal','#cfe3ea','Placas de sal',u=>{
  let s=pth('M30 120 L100 100 L172 118 L172 158 L100 176 L30 158Z','#f4f1ea',T,3.4)+pth('M30 120 L100 138 L172 118','none',T,3)+pth('M100 138 V176','none',T,3);
  s+=hach('M100 138 L172 118 L172 158 L100 176Z','cm-h1',.45);
  s+=pth('M34 96 L100 78 L170 94 L170 120 L100 138 L34 122Z','#fffdf6',T,3.4)+pth('M34 96 L100 112 L170 94','none',T,3)+pth('M100 112 V138','none',T,3);
  s+=hach('M100 112 L170 94 L170 120 L100 138Z','cm-h1',.4);
  s+=pth('M62 88 C80 100 104 104 124 98','none','#8a5a33',4)+pth('M78 126 C98 140 120 142 140 134','none','#8a5a33',4);
  [[60,100],[80,150],[150,108]].forEach(q=>{s+=pth('M'+q[0]+' '+q[1]+' l6 -4 M'+(q[0]+8)+' '+(q[1]+6)+' l6 -3','none','#7fa4b4',2.2);});
  return s;});

/* tecidos dobrados em pilha, com listras */
reg('tecidos','#f0cfc4','Tecidos dobrados',u=>{
  let s=pth('M30 148 H172 V176 H30Z','#2f6f7a',T,3.2)+pth('M30 120 H168 V148 H30Z',RED,T,3.2)+pth('M36 92 H162 V120 H36Z','#e8c27a',T,3.2)+pth('M42 66 H156 V92 H42Z','#fffdf6',T,3.2);
  for(let i=0;i<7;i++){s+=pth('M'+(46+i*17)+' 148 V176','none','#fff',2.4);}
  for(let i=0;i<6;i++){s+=pth('M'+(40+i*20)+' 120 L'+(50+i*20)+' 148','none','#f6d3c8',2.4);}
  s+=pth('M48 100 L60 112 L72 100 L84 112 L96 100 L108 112 L120 100 L132 112 L144 100 L156 112','none',T,2.4);
  s+=pth('M52 74 H148 M52 82 H148','none',INDIGO,3);
  s+=pth('M156 66 C170 70 172 84 156 92','none',T,3.2)+pth('M168 120 C180 124 180 140 168 148','none',T,3.2);
  return s;});

/* cabeça de cavalo, com rédea */
reg('cavalo','#e9dcb4','Cavalo',u=>{
  let s=pth('M62 176 C66 150 66 130 70 110 C68 84 80 60 100 46 L104 24 L116 40 C134 38 152 48 160 66 C168 82 172 96 164 106 C156 112 146 108 140 100 C134 118 134 150 136 176Z','#a86b3c',T,3.4);
  s+=pth('M104 24 L100 40 M116 40 L112 54','none',T,2.6);
  s+=pth('M96 44 C84 58 76 78 76 102 C74 124 72 150 70 176 L84 176 C84 150 88 122 90 100 C92 80 98 62 108 50Z','#4a2d18',T,2.6);
  s+=hach('M108 70 C122 80 138 100 140 130 L136 176 L118 176 C124 150 126 120 108 70Z','cm-h1',.4);
  s+=circ(138,68,3.4,T)+pth('M162 96 C164 100 162 104 158 104','none',T,2.6)+pth('M150 68 C158 76 162 86 160 96','none',RED,4.4)+pth('M124 52 C132 58 142 62 150 68','none',RED,4);
  return s;});

/* tâmaras: cacho de frutos em uma tigela, com uma folha de palmeira */
reg('tamaras','#f1e0b5','Tâmaras',u=>{
  let s=pth('M100 90 C80 60 56 46 30 44 C54 52 72 70 86 96 M100 90 C100 54 108 34 126 20 C116 44 112 66 106 94 M100 90 C124 66 150 56 176 58 C152 64 132 80 112 98','none','#4f7a3a',5);
  s+=pth('M100 90 C80 60 56 46 30 44 C54 52 72 70 86 96Z','#6f9a4a',T,2.4)+pth('M100 90 C124 66 150 56 176 58 C152 64 132 80 112 98Z','#6f9a4a',T,2.4);
  s+=pth('M34 112 H166 C166 150 144 176 100 176 C56 176 34 150 34 112Z',WOOD,T,3.4)+pth('M42 126 H158','none',T,2.2)+pth('M50 142 H150','none',T,2.2)+hach('M100 112 H166 C166 150 144 176 100 176Z','cm-h1',.4);
  [[52,106],[72,98],[92,104],[112,98],[132,104],[150,106],[62,114],[84,112],[104,112],[124,112],[142,114]].forEach((q,i)=>{s+=ell(q[0],q[1],9.5,13,i%2?'#7a3b1c':'#5a2b14',T,2.4,' transform="rotate('+((i%3-1)*14)+' '+q[0]+' '+q[1]+')"');s+=pth('M'+(q[0]-3)+' '+(q[1]-6)+' q2 -3 5 -2','none','#c98a58',1.8);});
  return s;});

/* mesquita de barro com vigas de madeira saindo das paredes (arquitetura do Sahel) */
reg('mesquita','#e9dcb4','Mesquita de barro com vigas de madeira',u=>{
  let s=pth('M24 174 L24 98 L176 98 L176 174Z',MUD,T,3.4);
  const tw=(x,w,top)=>pth('M'+(x-w/2)+' 98 L'+(x-w/2+3)+' '+(top+26)+' L'+x+' '+top+' L'+(x+w/2-3)+' '+(top+26)+' L'+(x+w/2)+' 98Z',MUD2,T,3.2)+circ(x,top-6,4.6,'#fffdf6',T,2.4)+pth('M'+x+' '+(top-2)+' V'+top,'none',T,2);
  s+=tw(44,30,40)+tw(100,38,22)+tw(156,30,40);
  s+=hach('M100 98 L112 98 L112 44 L103 22Z','cm-h1',.35)+hach('M156 98 L171 98 L168 66 L158 40Z','cm-h1',.35)+hach('M44 98 L59 98 L56 66 L46 40Z','cm-h1',.35);
  for(let x=64;x<=140;x+=19){s+=pth('M'+x+' 98 V174','none',T,2);}
  [112,126,140,154].forEach(y=>{s+=pth('M16 '+y+' H30 M170 '+y+' H184','none',WOOD2,4.4);s+=pth('M68 '+y+' H78 M122 '+y+' H132','none',WOOD2,3.6);});
  [58,72,86].forEach(y=>{s+=pth('M26 '+y+' H34 M54 '+y+' H62 M80 '+(y-14)+' H88 M112 '+(y-14)+' H120 M142 '+y+' H150 M166 '+y+' H174','none',WOOD2,3.4);});
  s+=pth('M88 174 V150 C88 134 112 134 112 150 V174Z','#3a2a1c',T,2.6);
  s+=pth('M14 176 H186','none',T,3.4);
  return s;});

/* pilha de manuscritos: livros de capa de couro e uma folha com escrita abstrata */
reg('manuscritos','#e9dcb4','Pilha de manuscritos',u=>{
  let s='<g transform="rotate(-7 100 80)">'+pth('M52 22 H150 V118 H52Z','#fffdf6',T,3.2);
  for(let i=0;i<6;i++){s+=escrita('ms'+i,60,142,40+i*13,3.2,1.9,'#3d3a33');}
  s+=pth('M60 30 H100','none','#c93a2a',2.6)+'</g>';
  s+=pth('M30 160 H170 V178 H30Z','#6b3f1d',T,3.2)+pth('M30 160 H170','none',GOLD,2.4)+pth('M40 164 V176 M52 164 V176','none',GOLD,2.2);
  s+=pth('M38 132 H164 V160 H38Z','#8d3b32',T,3.2)+pth('M38 140 H164 M38 152 H164','none',GOLD,2.2);
  s+=pth('M46 106 H156 V132 H46Z','#3f6d73',T,3.2)+pth('M52 106 V132','none',T,2.4)+pth('M62 114 H146 M62 124 H146','none','#e8c27a',2.2);
  return s;});

/* cauri: concha de cima, com a fenda e os dentes */
reg('cauri','#f0cfc4','Concha de cauri',u=>{
  let s=ell(100,104,56,76,'#f3e8d0',T,3.6,' transform="rotate(-14 100 104)"');
  s+=hach('M120 42 C160 70 168 126 120 176 C150 130 146 82 120 42Z','cm-h1',.4);
  s+=pth('M96 58 C108 86 108 124 96 152','none',T,3.4)+pth('M98 62 C104 86 104 124 98 148','#2b2018',T,2.4);
  for(let i=0;i<9;i++){const y=68+i*10;s+=pth('M91 '+y+' l-8 1 M104 '+(y+2)+' l8 1','none',T,2.2);}
  s+=pth('M64 70 C60 100 64 130 74 154','none','#fff',4)+pth('M70 56 C80 46 92 44 98 46','none','#e8c9a0',3);
  return s;});

/* pilha de pepitas */
reg('pilha-ouro','#e9dcb4','Pilha de pepitas de ouro',u=>{
  let s='';
  const n=(x,y,k)=>pth('M'+(x-20*k)+' '+y+' C'+(x-22*k)+' '+(y-16*k)+' '+(x-6*k)+' '+(y-24*k)+' '+(x+8*k)+' '+(y-22*k)+' C'+(x+26*k)+' '+(y-18*k)+' '+(x+24*k)+' '+(y+4*k)+' '+(x+10*k)+' '+(y+8*k)+' C'+x+' '+(y+12*k)+' '+(x-16*k)+' '+(y+10*k)+' '+(x-20*k)+' '+y+'Z',GOLD,T,3)+pth('M'+(x-10*k)+' '+(y-10*k)+' q8 -6 16 -2','none','#fff6c8',3);
  [[44,168],[88,172],[132,170],[168,166],[66,146],[110,150],[150,146],[88,124],[128,126],[108,102]].forEach((q,i)=>{s+=n(q[0],q[1],.95+((i*7)%5)*.03);});
  s+=pth('M20 176 H182','none',T,3);
  s+=pth('M36 70 l6 -8 M52 54 v-9 M164 78 l-8 -8 M148 60 v-9 M100 70 v-10','none','#e8572a',3.2);
  return s;});

/* máscara alongada de madeira, com raiz de rafia embaixo */
reg('mascara-longa','#d8c9a0','Máscara alongada de madeira',u=>{
  let s='';
  for(let i=0;i<15;i++){s+=pth('M'+(66+i*5.2)+' 150 L'+(60+i*5.8)+' '+(184+(i%3)*4),'none','#a88a4a',3);}
  s+=pth('M100 14 C142 18 150 64 144 104 C140 140 120 160 100 166 C80 160 60 140 56 104 C50 64 58 18 100 14Z',WOOD,T,3.6);
  s+=hach('M100 14 C142 18 150 64 144 104 C140 140 120 160 100 166 C112 130 116 70 100 14Z','cm-h1',.5);
  s+=pth('M100 28 V120','none',WOOD2,6)+pth('M92 98 C92 112 96 120 100 122 C104 120 108 112 108 98','none',T,2.6);
  s+=pth('M68 60 C76 54 86 54 92 60 M108 60 C114 54 124 54 132 60','none',T,3.6)+pth('M70 62 C78 66 86 66 90 62 M110 62 C114 66 122 66 130 62','#f6f1e4',T,2.4);
  s+=pth('M88 138 C96 144 104 144 112 138','none',T,3.2)+pth('M90 132 H110','none',T,2.4);
  [[72,84],[72,96],[72,108],[128,84],[128,96],[128,108]].forEach(q=>{s+=pth('M'+(q[0]-6)+' '+q[1]+' h12','none','#f6f1e4',2.6);});
  s+=pth('M100 14 L100 4 M86 16 L80 6 M114 16 L120 6','none',T,3);
  return s;});

/* máscara de marfim da rainha Idia (Benim): rosto sereno, faixa de cabeças e colar de anéis */
reg('mascara-marfim','#e9dcb4','Máscara de marfim, rainha Idia',u=>{
  let s=pth('M62 24 C74 12 126 12 138 24 L140 48 L60 48Z','#d6c595',T,3.2);
  for(let i=0;i<7;i++){const x=68+i*10.6;s+=circ(x,34,4.6,IVORY,T,1.8)+pth('M'+(x-2)+' 33 h1.6 M'+(x+1)+' 33 h1.6','none',T,1.4);}
  s+=pth('M62 24 L60 48 M138 24 L140 48','none',T,2.6);
  s+=pth('M64 48 C60 86 66 130 84 158 C92 166 108 166 116 158 C134 130 140 86 136 48Z',IVORY,T,3.6);
  s+=hach('M118 52 C134 84 132 130 112 160 C122 130 124 90 118 52Z','cm-h1',.45);
  s+=pth('M74 78 C80 72 90 72 94 78 M106 78 C110 72 120 72 126 78','none',T,3.2)+pth('M76 80 C82 84 90 84 92 80 M108 80 C112 84 120 84 124 80','#f6f1e4',T,2);
  s+=pth('M100 82 C98 98 94 106 92 112 C96 116 104 116 108 112 C106 106 102 98 100 82Z',IVORY,T,2.4);
  s+=pth('M88 132 C96 138 104 138 112 132','none',T,3);
  s+=pth('M70 60 H130','none',T,2)+pth('M70 66 H130','none',T,2);
  for(let i=0;i<9;i++){const x=62+i*9.6;s+=pth('M'+x+' 164 C'+x+' 172 '+(x+8)+' 172 '+(x+8)+' 164','#d6c595',T,2.2);}
  s+=pth('M50 164 C60 186 140 186 150 164','none',T,3);
  return s;});

/* máscara Gelede: rosto pintado e, no alto, pequenas figuras */
reg('mascara-gelede','#f0cfc4','Máscara Gelede, com figuras no alto',u=>{
  let s=pth('M66 66 C66 40 134 40 134 66 L138 112 C138 150 116 168 100 168 C84 168 62 150 62 112Z','#7a4a2a',T,3.6);
  s+=pth('M66 66 C66 40 134 40 134 66 L138 112 C138 150 116 168 100 168 C84 168 62 150 62 112Z','url(#cm-hh)',null,0,' opacity=".4"');
  s+=pth('M64 92 H136','none','#f6f1e4',7)+pth('M64 92 H136','none',RED,2.6)+pth('M66 70 H134','none',INDIGO,5);
  s+=pth('M72 100 C80 94 90 94 94 100 C88 104 78 104 72 100Z','#fffdf6',T,2.6)+pth('M106 100 C110 94 120 94 128 100 C122 104 112 104 106 100Z','#fffdf6',T,2.6)+circ(84,100,2.4,T)+circ(116,100,2.4,T);
  s+=pth('M100 100 C98 116 94 124 92 130 C96 134 104 134 108 130 C106 124 102 116 100 100Z','#6b3f1d',T,2.4);
  s+=pth('M86 146 C94 152 106 152 114 146','none',T,3)+pth('M90 142 H110','none','#f6f1e4',3);
  s+=pth('M52 40 H148 V52 C148 56 52 56 52 52Z',WOOD2,T,3);
  [[70,'#c93a2a'],[100,GOLD],[130,'#3f6d73']].forEach(a=>{s+=pth('M'+(a[0]-8)+' 40 L'+(a[0]-6)+' 18 H'+(a[0]+6)+' L'+(a[0]+8)+' 40Z',a[1],T,2.4)+circ(a[0],11,6.6,SKIN,T,2.4);});
  s+=pth('M60 40 C56 30 62 22 70 24 M140 40 C144 30 138 22 130 24','none',T,2.4);
  s+=pth('M96 6 C98 -2 106 -2 108 6','none',T,2.6);
  return s;});

/* griô sentado, com a kora (cabaça, braço longo e cordas) e a túnica longa */
reg('grio','#d8c9a0','Griô com a kora',u=>{
  let s=pth('M46 176 C44 142 56 112 80 104 L120 104 C144 112 156 142 154 176Z',INDIGO,T,3.4);
  s+=hach('M100 104 L120 104 C144 112 156 142 154 176 L116 176Z','cm-h1',.4);
  s+=pth('M84 96 C84 80 92 74 100 74 C110 74 118 80 118 96 L118 106 L84 106Z',SKIN,T,3.2)+circ(100,70,19,SKIN,T,3.4);
  s+=pth('M82 64 C84 50 98 46 106 48 C116 50 120 58 118 66 C112 60 94 58 82 64Z','#fffdf6',T,2.8);
  s+=circ(94,70,1.8,T)+circ(107,70,1.8,T)+pth('M96 79 C100 82 104 82 106 79','none',T,2.2);
  s+=circ(64,146,24,'#c98a58',T,3.4)+hach('M64 122 C84 140 84 156 64 170 C90 160 90 134 64 122Z','cm-h1',.3);
  s+=pth('M64 124 L108 62','none',WOOD2,5)+pth('M62 124 L104 64','none',T,1.6);
  [0,1,2,3].forEach(i=>{s+=pth('M'+(58+i*3.4)+' 128 L'+(100+i*2.2)+' 74','none','#f6f1e4',1.6);});
  s+=pth('M120 112 C112 124 96 134 80 138','none',SKIN,9)+pth('M120 112 C112 124 96 134 80 138','none',T,2);
  s+=pth('M40 176 H170','none',T,3.2);
  return s;});

/* ---------- peça com a figura de IA: P&B com o ouro em cor ---------- */
C.tipos.musa=p=>{
  const r=C.tipos.foto(p);
  const src=(window.LAB_IMG||{})[p.img]||'';
  const m=(x,y,rr)=>'radial-gradient(ellipse '+(rr*1.0)+'% '+(rr*1.7)+'% at '+x+'% '+y+'%,#000 62%,transparent 100%)';
  const ouro=p.ouro||[[40.4,46.5,5.2],[51.6,31.5,5],[49,40,3.2],[44.2,58,2.8],[51.5,60,3]];
  const mk=ouro.map(o=>m(o[0],o[1],o[2])).join(',');
  const lay='<div class="m4-ouro" style="background-image:url('+src+');-webkit-mask-image:'+mk+';mask-image:'+mk+'"></div>';
  r.html=r.html.replace('></div>','>'+lay+'</div>');
  return r;
};

/* ---------- cauri que cai na mesa e gira ---------- */
C.tipos.cauri3=p=>({cls:'m4-cauri',html:'<svg viewBox="-14 -14 228 228" role="img" aria-label="'+esc(p.rotulo||'Concha de cauri')+'"><g class="qd" style="--a:'+((p.queda||0))+'s"><g class="gi">'+
  fundoO('#f0cfc4','cauri3')+'<g filter="url(#cm-sombra)">'+ART['cauri']('c3')+'</g></g></g></svg>'});

/* ---------- ondas sonoras desenhadas à mão ---------- */
C.tipos.ondas=p=>{
  let s='';
  [0,1,2].forEach(i=>{const r=40+i*34;s+='<path class="ond o'+(i+1)+'" style="--a:'+(p.atraso||0)+'s" d="M'+(50+i*6)+' '+(100-r*.8)+' C'+(50+i*6+r*.7)+' '+(100-r*.4)+' '+(50+i*6+r*.7)+' '+(100+r*.4)+' '+(50+i*6)+' '+(100+r*.8)+'" fill="none" stroke="'+T+'" stroke-width="7" stroke-linecap="round"/>';});
  return {cls:'cm-m4',html:'<svg viewBox="0 0 200 200" aria-hidden="true">'+s+'</svg>'};
};

/* ---------- vitrine: linha tracejada que se fecha em volta de uma peça ---------- */
C.tipos.vitrine=p=>{
  const W=p.w,H=p.h;let s='';
  s+='<path class="vit" pathLength="1" d="M20 '+(H-20)+' V40 L50 14 H'+(W-50)+' L'+(W-20)+' 40 V'+(H-20)+' Z" fill="rgba(180,215,225,.22)" stroke="'+T+'" stroke-width="7" stroke-dasharray="1" style="--a:'+(p.atraso||0)+'s"/>';
  s+=pth('M20 '+(H-20)+' H'+(W-20),'none',T,12);
  s+=pth('M'+(W*.2)+' 70 L'+(W*.1)+' 150 M'+(W*.3)+' 54 L'+(W*.15)+' 170','none','#fff',8,' opacity=".7"');
  return {cls:'cm-m4',html:'<svg viewBox="0 0 '+W+' '+H+'" aria-hidden="true">'+s+'</svg>'};
};

/* ---------- silhueta em círculo recortado: a candace, rainha da Núbia ---------- */
C.tipos.candace=p=>{
  let s='<rect width="200" height="200" fill="#e6dcc0"/><path d="M0 130 H200 V200 H0Z" fill="#d6c9a4"/>'+hach('M0 0 H200 V200 H0Z','cm-hh',.3);
  s+=pth('M58 200 C58 160 74 146 92 140 L92 118 L118 118 L120 140 C140 146 150 160 150 200Z','#2b2a27');
  s+=pth('M82 96 C82 70 94 58 108 58 C124 58 134 72 132 92 C134 100 130 108 124 112 C122 118 116 122 108 122 C94 122 84 112 82 96Z','#2b2a27');
  s+=pth('M130 94 L142 98 L132 104Z','#2b2a27');
  s+=pth('M76 70 C80 40 130 36 136 70 C130 62 84 60 76 70Z','#2b2a27')+ell(106,40,13,13,'#2b2a27')+ell(106,40,7,7,'#e0b43a');
  s+=pth('M98 52 C90 60 92 72 98 76 M114 52 C122 60 120 72 114 76','none','#e0b43a',3);
  s+=pth('M96 126 C96 134 118 134 118 126','none','#e0b43a',3);
  return {cls:'m4-cand',html:'<svg viewBox="0 0 200 200" role="img" aria-label="'+esc(p.rotulo||'Silhueta de uma candace, rainha da Núbia')+'">'+s+'</svg>'};
};

/* ---------- duas colunas de papel (macua e Europa medieval) ---------- */
C.tipos.col2=p=>{
  const col=(c,k)=>'<div style="--cor:'+C.cor(c.cor||(k?'coral':'amarelo'))+'"><h4>'+esc(c.titulo)+'</h4>'+(c.sub?'<p>'+esc(c.sub)+'</p>':'')+'</div>';
  return {cls:'m4-col rasgado',style:'--clip:'+C.rasgo(p.id,1.2)+';--t1:'+(p.t1||60)+'px;--t2:'+(p.t2||40)+'px;',html:col(p.a,0)+col(p.b,1)};
};

/* ---------- mapinha de canto: a África com três pontos acesos ---------- */
C.tipos.minimapa=p=>{
  const B='historia-mapa-mundo',src=(window.LAB_IMG||{})[B]||'';
  const vb=p.vb||[560,250,330,370];
  const pt=(lo,la)=>C.lonlat(B,lo,la);
  let s='<image href="'+src+'" x="0" y="0" width="1376" height="768" preserveAspectRatio="none"/>';
  (p.pontos||[]).forEach((q,i)=>{
    const c=pt(q.ll[0],q.ll[1]);
    s+='<g class="it" data-et="'+(p.et||'6')+'" style="--a:'+(q.atraso||0)+'s"><circle class="m4-pulsa" cx="'+c[0]+'" cy="'+c[1]+'" r="12" fill="#ffd83d" stroke="'+T+'" stroke-width="2"/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="5.2" fill="#e8572a" stroke="#fff" stroke-width="1.8"/>'+
      '<g transform="translate('+(c[0]+(q.dx||0))+' '+(c[1]+(q.dy||0))+')"><rect x="'+(q.anc==='e'?-(q.larg||110):0)+'" y="-10" width="'+(q.larg||110)+'" height="'+(q.alt||24)+'" fill="#fff" stroke="'+T+'" stroke-width="1"/>'+
      sTx((q.anc==='e'?-(q.larg||110)/2:(q.larg||110)/2),(q.alt||24)/2-1,q.nome,q.fs||11.5,700,'middle',T)+'</g></g>';
  });
  return {cls:'cm-m4 sb',html:'<svg viewBox="'+vb.join(' ')+'" role="img" aria-label="'+esc(p.rotulo||'Mapa da África com três pontos')+'" style="background:#18181b">'+s+'</svg>'};
};

/* ---------- árvore de família matrilinear: a linha amarela corre pelo lado das mulheres ---------- */
C.tipos.matri=p=>{
  const W=1300,H=930;let s='';
  const ND=(x,y,mul,cor,nome,gray)=>{
    const sh=mul?circ(x,y,58,cor,T,5):rect(x-52,y-52,104,104,cor,T,5);
    return '<g class="'+(gray?'cin':'')+'" '+(gray?'opacity=".55"':'')+'>'+sh+sTx(x,y+14,nome,40,700,'middle',T)+'</g>';
  };
  const L=(a,b,c,d,cor,w,dash)=>pth('M'+a+' '+b+' L'+c+' '+d,'none',cor||T,w||5,dash?' stroke-dasharray="14 12"':'');
  const Y1=150,Y2=450,Y3=770;
  // linhas
  s+=L(650,Y1+58,650,300,T,5)+L(260,300,1040,300,T,5)+L(260,300,260,Y2-52,T,5)+L(650,300,650,Y2-58,T,5)+L(1040,300,1040,Y2-58,T,5);
  s+=L(650,Y2+58,650,620,T,5)+L(500,620,800,620,T,5)+L(500,620,500,Y3-52,T,5)+L(800,620,800,Y3-58,T,5);
  s+=L(260,Y2+52,260,620,T,5,true)+L(160,620,360,620,T,5,true)+L(160,620,160,Y3-52,T,5,true)+L(360,620,360,Y3-52,T,5,true);
  // linha da herança em amarelo (pelas mulheres)
  s+='<g class="ap">'+pth('M650 '+(Y1+60)+' V300 H650 V'+(Y2-60),'none','#ffd83d',20,' opacity=".9"')+pth('M650 '+(Y2+60)+' V620 H800 V'+(Y3-60),'none','#ffd83d',20,' opacity=".9"')+pth('M650 300 H1040 V'+(Y2-60),'none','#ffd83d',20,' opacity=".9"')+'</g>';
  s+=L(650,Y1+58,650,300,T,5)+L(650,300,1040,300,T,5)+L(650,300,650,Y2-58,T,5)+L(1040,300,1040,Y2-58,T,5)+L(650,Y2+58,650,620,T,5)+L(650,620,800,620,T,5)+L(800,620,800,Y3-58,T,5);
  s+=ND(650,Y1,1,'#f6d3c8','avó')+ND(1040,Y2,1,'#f6d3c8','tia')+ND(650,Y2,1,'#f6d3c8','mãe')+ND(260,Y2,0,'#dcd6c6','tio',1);
  s+=ND(500,Y3,0,'#fff2b0','filho')+ND(800,Y3,1,'#fff2b0','filha');
  s+=ND(160,Y3,0,'#dcd6c6','',1)+ND(360,Y3,1,'#dcd6c6','',1);
  s+=sTx(260,Y2+112,'pai dos filhos dele',32,600,'middle','#4a463e');
  s+=sTx(260,Y3+100,'de outra linhagem',32,600,'middle','#4a463e');
  s+=sTx(650,Y3+100,'a linhagem da mãe',36,700,'middle',T);
  s+=sTx(100,Y1-8,'matrilinear',50,700,'start',T,SERIF)+sTx(100,Y1+44,'a linhagem segue a mãe',38,600,'start','#4a463e');
  return {cls:'cm-m4',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Árvore de família matrilinear')+'">'+s+'</svg>'};
};

/* ---------- fita do tempo de três faixas: Gana, Mali e Songhai ---------- */
C.tipos.fitaafr=p=>{
  const W=3300,H=860,X=a=>120+(a-300)/1300*3060;let s='';
  s+=rect(10,10,W-20,H-20,'#fffdf6',T,0);
  // eixo
  s+=pth('M'+X(300)+' 130 H'+X(1600),'none',T,4);
  for(let a=300;a<=1600;a+=100){s+=pth('M'+X(a)+' 118 V142','none',T,3.4)+sTx(X(a),88,String(a),38,700,'middle','#2f2e2a');}
  s+=sTx(40,88,'d.C.',34,600,'start','#4a463e');
  const barra=(a,b,y,cor,txt,et,tx,dash)=>'<rect x="'+X(a)+'" y="'+y+'" width="'+(X(b)-X(a))+'" height="74" rx="8" fill="'+cor+'" stroke="'+T+'" stroke-width="4"'+(dash?' stroke-dasharray="16 12"':'')+'/>';
  const marca=(x,y1,y2,t1,t2,anc,et,cor)=>'<g class="mk" data-et="'+et+'">'+pth('M'+x+' '+y1+' V'+y2,'none',T,3.4)+circ(x,y1,13,cor||'#d63a22',T,3.4)+
    sTx(x,y2+(y2>y1?44:-30),t1,40,700,anc||'middle',T).replace('<text','<text class="mt"')+(t2?sTx(x,y2+(y2>y1?90:-76),t2,34,600,anc||'middle','#2f2e2a'):'')+'</g>';
  // Gana
  s+=sTx(40,300,'Gana',64,700,'start',T,SERIF);
  s+='<g class="mk" data-et="2,3">'+barra(300,1200,230,'#f2a695')+'</g>';
  s+='<g class="mk" data-et="2">'+'<rect x="'+X(650)+'" y="230" width="'+(X(900)-X(650))+'" height="74" rx="8" fill="#ffd83d" stroke="'+T+'" stroke-width="4"/>'+sTx((X(650)+X(900))/2,350,'apogeu',40,700,'middle',T).replace('<text','<text class="mt"')+sTx((X(650)+X(900))/2,392,'séculos VII a IX',34,600,'middle','#2f2e2a')+'</g>';
  s+='<g class="mk" data-et="2">'+sTx(X(300)+6,206,'começo, segundo os livros',34,600,'start','#2f2e2a')+'</g>';
  s+='<g class="mk" data-et="3">'+sTx(X(1100),350,'declínio',40,700,'middle',T).replace('<text','<text class="mt"')+sTx(X(1100),392,'séculos XI e XII',34,600,'middle','#2f2e2a')+'</g>';
  // Mali
  s+=sTx(40,500,'Mali',64,700,'start',T,SERIF);
  s+='<g class="mk" data-et="3,4">'+barra(1235,1450,430,'#e8b04a')+'<rect x="'+X(1450)+'" y="430" width="'+(X(1530)-X(1450))+'" height="74" fill="url(#m4fade)" stroke="none"/></g>';
  s+=marca(X(1235),430,470,'','','middle','3',null).replace(/<text[^>]*>.*?<\/text>/g,'');
  s+='<g class="mk" data-et="3">'+sTx(X(1235)-8,420,'cerca de 1235: Sundiata Keita',34,600,'end','#2f2e2a')+'</g>';
  s+='<g class="mk" data-et="4">'+pth('M'+X(1324)+' 504 V560','none',T,3.4)+circ(X(1324),504,13,'#d63a22',T,3.4)+sTx(X(1324)-8,600,'1324 e 1325',38,700,'end',T).replace('<text','<text class="mt"')+sTx(X(1324)-8,642,'peregrinação de Mansa Musa',32,600,'end','#2f2e2a')+'</g>';
  s+='<g class="mk" data-et="4">'+pth('M'+X(1375)+' 504 V560','none',T,3.4)+circ(X(1375),504,13,'#d63a22',T,3.4)+sTx(X(1375)+8,600,'1375',38,700,'start',T).replace('<text','<text class="mt"')+sTx(X(1375)+8,642,'Atlas Catalão',32,600,'start','#2f2e2a')+'</g>';
  // Songhai
  s+=sTx(40,700,'Songhai',64,700,'start',T,SERIF);
  s+='<g class="mk" data-et="5">'+barra(1000,1464,630,'#f6f1e4',null,null,null,true)+sTx(X(1232),602,'reino antigo, centro em Gao',32,600,'middle','#2f2e2a')+'</g>';
  s+='<g class="mk" data-et="5">'+barra(1464,1591,630,'#a8d0c4')+'</g>';
  s+='<g class="mk" data-et="5">'+pth('M'+X(1470)+' 704 V752','none',T,3.4)+circ(X(1470),704,13,'#d63a22',T,3.4)+sTx(X(1470)-10,798,'1468 e 1473',38,700,'end',T).replace('<text','<text class="mt"')+sTx(X(1470)-10,838,'Tombuctu e Djenné',32,600,'end','#2f2e2a')+'</g>';
  s+='<g class="mk" data-et="5">'+pth('M'+X(1591)+' 704 V752','none',T,3.4)+circ(X(1591),704,13,'#d63a22',T,3.4)+sTx(X(1591)+10,798,'1591',38,700,'start',T).replace('<text','<text class="mt"')+sTx(X(1591)+10,838,'derrota diante do Marrocos',32,600,'start','#2f2e2a')+'</g>';
  const defs='<defs><linearGradient id="m4fade" x1="0" x2="1"><stop offset="0" stop-color="#e8b04a"/><stop offset="1" stop-color="#e8b04a" stop-opacity="0"/></linearGradient></defs>';
  return {cls:'cm-m4 sb',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Fita do tempo de Gana, Mali e Songhai, do século III ao XVI')+'">'+defs+s+'</svg>'};
};

/* ---------- camada de ícones, setas, régua e círculos sobre o mapa (longitude e latitude) ---------- */
C.tipos.mapitens=p=>{
  const B=p.base||'historia-mapa-mundo',W=1376,H=768;let s='';
  const PT=q=>C.lonlat(B,q[0],q[1]);
  const art=(nome,k)=>'<g transform="scale('+k+') translate(-100 -100)">'+ART[nome]('mi'+(seq++)+'-')+'</g>';
  const d=pts=>'M'+pts.map(q=>{const c=PT(q);return c[0].toFixed(1)+' '+c[1].toFixed(1);}).join(' L');
  (p.itens||[]).forEach(it=>{
    const et=' data-et="'+it.et+'"',a=' style="--a:'+((it.d||0))+'s"';
    if(it.t==='icone'){
      const c=PT(it.p);
      s+='<g class="it"'+et+a+'><g transform="translate('+c[0].toFixed(1)+' '+c[1].toFixed(1)+') rotate('+(it.giro||0)+')">'+art(it.nome,it.k||.06)+'</g></g>';
    }else if(it.t==='viaja'){
      const k=it.k||.06,dd=d(it.pts);
      const g='<g>'+art(it.nome,k)+(C.reduz?'':'<animateMotion dur="'+(it.dur||14)+'s" repeatCount="indefinite" begin="'+(it.ini||0)+'s" path="'+dd+'"/>')+'</g>';
      s+='<g class="it"'+et+a+'>'+(C.reduz?'<g transform="translate('+PT(it.pts[Math.floor(it.pts.length/2)]).map(v=>v.toFixed(1)).join(' ')+')">'+art(it.nome,k)+'</g>':g)+'</g>';
    }else if(it.t==='seta'){
      const A=PT(it.a),Bq=PT(it.b),vx=Bq[0]-A[0],vy=Bq[1]-A[1],L=Math.hypot(vx,vy)||1,nx=-vy/L,ny=vx/L,kk=(it.curva==null?.18:it.curva)*L;
      const c1=[A[0]+vx*.3+nx*kk,A[1]+vy*.3+ny*kk],c2=[A[0]+vx*.72+nx*kk*.6,A[1]+vy*.72+ny*kk*.6];
      const ang=Math.atan2(Bq[1]-c2[1],Bq[0]-c2[0]),sz=it.ponta||7,w=it.w||2.4,cor=it.cor||'#e8572a';
      const p1=[Bq[0]-sz*Math.cos(ang-.5),Bq[1]-sz*Math.sin(ang-.5)],p2=[Bq[0]-sz*Math.cos(ang+.5),Bq[1]-sz*Math.sin(ang+.5)];
      s+='<g class="it"'+et+a+'><path d="M'+A[0].toFixed(1)+' '+A[1].toFixed(1)+' C'+c1.map(v=>v.toFixed(1)).join(' ')+' '+c2.map(v=>v.toFixed(1)).join(' ')+' '+Bq[0].toFixed(1)+' '+Bq[1].toFixed(1)+'" fill="none" stroke="'+cor+'" stroke-width="'+w+'" stroke-linecap="round"'+(it.cheia?'':' stroke-dasharray="'+(w*3)+' '+(w*2.2)+'"')+'/>'+
        '<path d="M'+p1.map(v=>v.toFixed(1)).join(' ')+' L'+Bq[0].toFixed(1)+' '+Bq[1].toFixed(1)+' L'+p2.map(v=>v.toFixed(1)).join(' ')+'" fill="none" stroke="'+cor+'" stroke-width="'+(w+.6)+'" stroke-linecap="round" stroke-linejoin="round"/></g>';
    }else if(it.t==='regua'){
      const A=PT(it.a),Bq=PT(it.b),w=it.w||2.4,mx=(A[0]+Bq[0])/2,my=(A[1]+Bq[1])/2;
      let ticks='';const n=it.n||10;for(let i=0;i<=n;i++){const x=A[0]+(Bq[0]-A[0])*i/n,y=A[1]+(Bq[1]-A[1])*i/n,h=(i===0||i===n)?7:(i%5===0?5:3.2);ticks+='<path d="M'+x.toFixed(1)+' '+(y-h).toFixed(1)+' V'+(y+h).toFixed(1)+'" stroke="'+T+'" stroke-width="'+(w*.7)+'" stroke-linecap="round"/>';}
      const tw=(it.larg||112),th=(it.alt||17);
      s+='<g class="it"'+et+a+'><path d="M'+A[0].toFixed(1)+' '+A[1].toFixed(1)+' L'+mx.toFixed(1)+' '+(my+1.4).toFixed(1)+' L'+Bq[0].toFixed(1)+' '+Bq[1].toFixed(1)+'" fill="none" stroke="'+T+'" stroke-width="'+w+'" stroke-linecap="round"/>'+ticks+
        '<rect x="'+(mx-tw/2).toFixed(1)+'" y="'+(my-th-9).toFixed(1)+'" width="'+tw+'" height="'+th+'" fill="#ffd83d" stroke="'+T+'" stroke-width="1.2"/>'+sTx(mx.toFixed(1),(my-th-9+th*.72).toFixed(1),it.texto,it.fs||11,700,'middle',T)+'</g>';
    }else if(it.t==='circulo'){
      const c=PT(it.p),r=C.rng('mc'+(it.p[0]*7+it.p[1]*3)),n=14,pts=[],a0=-1.9+r()*.4,rx=it.r||9,ry=(it.r||9)*.82;
      for(let i=0;i<=n;i++){const a=a0+i/n*Math.PI*2*1.12,kk=1+(r()-.5)*.1+(i/n)*.07;pts.push([c[0]+Math.cos(a)*rx*kk,c[1]+Math.sin(a)*ry*kk]);}
      s+='<g class="it"'+et+a+'><path d="'+C.suave(pts,false)+'" fill="none" stroke="'+(it.cor||'#ffd83d')+'" stroke-width="'+(it.w||2.8)+'" stroke-linecap="round"/></g>';
    }
  });
  return {cls:'cm-m4 mi',html:'<svg viewBox="0 0 '+W+' '+H+'" aria-hidden="true">'+s+'</svg>'};
};

})();
