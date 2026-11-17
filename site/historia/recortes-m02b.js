/* Recortes do tópico 2 do módulo 2 (Feudalismo), desenhados em código. Nada de IA além da figura do senhorio.
   Carregue DEPOIS de colagem.js e recortes.js. Não altera o motor: registra ícones novos em C.icone e tipos novos em C.tipos.
   Ícones (use {tipo:'icone', nome:'...'}): campones, lote-sem-moeda, cavaleiro, maos-unidas, mapa-partido, frasco-oleo, toque-real,
     selo-papal, igreja, livro-cadeado, pia, aliancas, vela, cruz, denario, moinho-forno, charrua, moinho-vento, mitra, elmo-espada, enxada-feixe.
   Tipos próprios: bilhete (nota amarela com ícone), jigsaw (peças Roma e germânicos), palavra (marca-texto), quadrinho (três atos),
     pacto (suserano e vassalo), ordens (pirâmide das três ordens), senhorio (a figura com as camadas de cor), calendario, obrigacoes,
     balanca3, igrejavida, excomunhao, poder (coroa e setas partidas), retalhos (reino em pedaços), trienal, romanica, gotica, fitafeudal. */
(function(){
'use strict';
const C=window.Colagem;
if(!C||!C.tipos||!C.icone)throw new Error('Carregue colagem.js e recortes.js antes de recortes-m02b.js');
const T='#1b1a17',P='#f6f1e4',esc=C.esc;
let seq=0;
const pth=(d,f,s,w,x)=>'<path d="'+d+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+' stroke-linecap="round" stroke-linejoin="round"'+(x||'')+'/>';
const tinta=(d,w)=>pth(d,'none',T,w||2);
const circ=(cx,cy,r,f,s,w)=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+'/>';
const rect=(x,y,w,h,f,s,sw,x2)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(sw||3)+'"':'')+' stroke-linejoin="round"'+(x2||'')+'/>';
const hach=(d,pad,op)=>'<path d="'+d+'" fill="url(#'+(pad||'cm-h1')+')" opacity="'+(op||.6)+'"/>';
const sTx=(x,y,t,sz,w,anc,fill,fam,extra)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+(anc||'middle')+'"'+(extra||'')+' style="font:'+(w||700)+' '+sz+'px '+(fam||'var(--sans,sans-serif)')+';fill:'+(fill||T)+'">'+esc(t)+'</text>';
const SERIF='var(--serif,Georgia,serif)';

/* ---------- CSS da página: aparece uma vez ---------- */
(function(){
  const s=document.createElement('style');
  s.textContent=
  '.cm-m2{filter:none}.cm-m2 svg{display:block;width:100%;height:100%;overflow:visible}'+
  '.cm-m2.cm-m2s{filter:drop-shadow(0 6px 8px rgba(0,0,0,.22))}'+
  '.m2-bil{background:#ffd83d;box-shadow:0 3px 5px rgba(0,0,0,.25);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:34px 22px 26px;text-align:center;font:700 42px/1.16 var(--sans);color:var(--tinta);filter:none}'+
  '.m2-bil .ic{width:92%;flex:none}.m2-bil .ic svg{display:block;width:100%;height:auto}.m2-bil span.t{margin-top:10px}'+
  '.m2-bil .cm-fita{top:-16px}'+
  '.m2-pal{display:flex;align-items:center;justify-content:center;font:400 150px/1 var(--serif);color:var(--tinta);filter:none}'+
  '.m2-pal span{position:relative;padding:0 .12em;background:linear-gradient(100deg,transparent 0 2%,#ffd83d 2% 98%,transparent 98%) no-repeat 0 62%/100% 62%}'+
  '.m2-tx{filter:none}'+
  '.cl.reg path[fill^="url"]{stroke:#b8891a;stroke-width:3px}'+
  '@media (prefers-reduced-motion:no-preference){'+
    '.cm-m2 .ap{opacity:0}.cm-m2:not(.fora) .ap{animation:m2-t .8s ease-out var(--a,0s) forwards}'+
    '.cm-m2 .ar{stroke-dasharray:1;stroke-dashoffset:1}.cm-m2:not(.fora) .ar{animation:m2-d 1.1s ease-out var(--a,0s) forwards}'+
    '.cm-m2 .bl{fill-opacity:0}.cm-m2:not(.fora) .bl{animation:m2-t .9s ease-out var(--a,0s) forwards}'+
    '.cm-m2 .dim{opacity:.32}.cm-m2:not(.fora) .dim{animation:m2-l .9s ease-out var(--a,0s) forwards}'+
    '.cm-m2 .cai{opacity:0}.cm-m2:not(.fora) .cai{animation:m2-c .7s cubic-bezier(.2,.9,.3,1.15) var(--a,0s) forwards}'+
    '.cm-m2.jl:not(.fora) svg{animation:m2-vl 2.4s cubic-bezier(.3,.1,.2,1) .5s both}.cm-m2.jr:not(.fora) svg{animation:m2-vr 2.4s cubic-bezier(.3,.1,.2,1) .5s both}'+
    '.m2-pal span{background-size:0 62%}.m2-pal:not(.fora) span{animation:m2-marca 1.1s ease-out var(--a,3s) forwards}'+
    '.cm-m2 .gi{transform-box:fill-box;transform-origin:center;animation:m2-g 30s linear infinite}'+
    '@keyframes m2-t{to{opacity:1;fill-opacity:1}}@keyframes m2-l{to{opacity:1}}@keyframes m2-d{to{stroke-dashoffset:0}}'+
    '@keyframes m2-c{from{opacity:0;transform:translateY(-40px)}to{opacity:1;transform:none}}'+
    '@keyframes m2-vl{from{transform:translateX(-340px)}to{transform:none}}@keyframes m2-vr{from{transform:translateX(340px)}to{transform:none}}'+
    '@keyframes m2-marca{to{background-size:100% 62%}}@keyframes m2-g{to{transform:rotate(360deg)}}'+
  '}'+
  '@media (prefers-reduced-motion:reduce){.m2-pal span{background-size:100% 62%}}';
  document.head.appendChild(s);
})();

/* ---------- ícones: mesmo formato de recortes.js (arte em 0..200, fundo de papel colorido, margem branca) ---------- */
const IO={};
function reg(nome,fundo,rotulo,art){IO[nome]={fundo:fundo,nome:rotulo,art:art};if(C.ICONES&&C.ICONES.indexOf(nome)<0)C.ICONES.push(nome);}
function fundoO(cor,seed){
  const r=C.rng('fundo'+seed),pts=[];
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2,k=84+(r()-.5)*7;pts.push([104+Math.cos(a)*k,106+Math.sin(a)*k]);}
  return '<path d="'+C.suave(pts,true)+'" fill="'+C.cor(cor)+'" filter="url(#cm-rasga)"/>';
}
function iconeO(nome,o){
  o=o||{};const ic=IO[nome],u='mo'+(seq++)+'-',fd=o.fundo===false?'':fundoO(o.fundo||ic.fundo,nome);
  return '<svg viewBox="-14 -14 228 228" role="img" aria-label="'+esc(o.rotulo||ic.nome)+'">'+fd+
    '<g filter="url(#cm-sombra)"><g class="cm-sil">'+ic.art('s'+u)+'</g></g>'+ic.art(u)+'</svg>';
}
const icone0=C.icone;
C.icone=function(nome,o){return IO[nome]?iconeO(nome,o):icone0(nome,o);};

const SKIN='#f1d9b8',WOOL='#c9a36a',WOOD='#8a5a33',GOLD='#e0b43a',STONE='#d8d1c0',RED='#c93a2a',GREEN='#6f9a4a';

/* cavalo de perfil, virado para a direita; caixa de 0 a 140 por 0 a 110 */
function cavalo(cor,x,y,k,cobre){
  const c=cor||'#a9784a';
  let s='<g transform="translate('+x+' '+y+') scale('+k+')">';
  s+=pth('M14 38 C0 42 -2 64 6 84','none',T,5);
  s+=pth('M26 62 L24 100 M44 62 L44 102 M86 62 L88 102 M102 58 L108 98','none',T,10)+pth('M26 62 L24 100 M44 62 L44 102 M86 62 L88 102 M102 58 L108 98','none',c,6);
  s+=pth('M14 40 C14 22 40 18 62 20 C84 18 100 22 104 36 C106 50 100 62 90 64 L26 64 C16 62 14 52 14 40Z',c,T,3.2);
  s+=pth('M94 34 C100 14 110 4 122 6 L138 26 C140 32 134 38 128 36 L122 34 C118 44 114 52 106 58Z',c,T,3.2);
  s+=pth('M112 8 L116 -4 L122 8','#7a5230',T,2.4)+circ(124,18,2.6,T);
  s+=pth('M98 30 C104 22 108 14 112 8 M96 38 C102 30 108 22 112 12','none',T,2.2);
  s+=hach('M30 52 C50 62 80 62 98 52 L100 62 L30 64Z','cm-h1',.5);
  if(cobre)s+=pth('M40 18 C52 14 80 14 96 24 L98 58 L40 58Z','#d6563f',T,2.4)+pth('M40 40 H98','none',T,2);
  return s+'</g>';
}

/* camponês de enxada */
reg('campones','amarelo','Camponês com enxada',u=>{
  let s=pth('M150 40 L146 172','none',T,10)+pth('M150 40 L146 172','none',WOOD,6);
  s+=pth('M142 168 L176 170 L172 188 L140 184Z','#7c8189',T,3);
  s+=pth('M84 142 L82 180 M112 142 L114 180','none',T,10)+pth('M84 142 L82 180 M112 142 L114 180','none','#6d5a46',6)+pth('M70 182 H90 M106 182 H126','none',T,6);
  s+=pth('M76 74 L120 74 L130 142 L66 142Z',WOOL,T,3.2)+hach('M110 74 L120 74 L130 142 L116 142Z','cm-h1',.5)+pth('M72 108 H124','none',T,5)+pth('M96 76 V108','none',T,2);
  s+=pth('M116 84 L146 102','none',T,13)+pth('M116 84 L146 102','none',SKIN,8)+circ(148,103,6,SKIN,T,2.4);
  s+=pth('M80 86 L74 124','none',T,13)+pth('M80 86 L74 124','none',SKIN,8);
  s+=circ(98,52,18,SKIN,T,3.2)+pth('M79 50 C80 30 116 30 117 50 C110 44 88 44 79 50Z','#7a5a3a',T,2.6)+pth('M91 58 H103 M92 54 h2 M102 54 h2','none',T,2.2);
  return s;});

/* lote de terra no lugar da moeda riscada */
reg('lote-sem-moeda','coral','Lote de terra no lugar da moeda',u=>{
  let s=pth('M26 128 L116 100 L186 130 L98 166Z',WOOL,T,3.4)+hach('M26 128 L116 100 L186 130 L98 166Z','cm-h1',.35);
  for(let i=1;i<6;i++){const a=[26+i*12.5,128-i*5.6],b=[98+i*14.7,166-i*6];s+=tinta('M'+a[0]+' '+(a[1]+i*1.6)+' L'+b[0]+' '+(b[1]-4),1.8);}
  s+=pth('M20 136 L98 172 L190 138','none',T,3)+pth('M66 150 L72 140 M120 146 L124 138','none',T,2);
  s+=circ(140,58,36,GOLD,T,3.6)+circ(140,58,26,'none',T,2)+pth('M140 42 V74 M126 58 H154','none',T,3.4);
  s+=pth('M104 90 L176 26','none','#d63a22',11)+pth('M104 90 L176 26','none','#fff',3,' stroke-opacity=".55"');
  return s;});

/* cavaleiro: guerreiro especializado */
reg('cavaleiro','petroleo','Cavaleiro a cavalo',u=>{
  let s=pth('M122 100 L190 26','none',T,6)+pth('M122 100 L190 26','none',WOOD,3);
  s+=pth('M190 26 L170 20 L176 38Z','#d63a22',T,2.4);
  s+=cavalo('#b88a58',28,68,.96,true);
  s+=pth('M88 70 L84 100','none',T,13)+pth('M88 70 L84 100','none','#7c8189',8);
  s+=pth('M80 56 L110 56 L112 92 L78 92Z','#aab0b8',T,3.2)+hach('M100 56 L110 56 L112 92 L98 92Z','cm-h1',.5);
  s+=pth('M64 60 L88 60 L88 92 L76 110 L64 92Z','#c9a24a',T,3)+pth('M64 60 L88 92 L88 80 L72 60Z','#5f7f90')+pth('M64 60 L88 60 L88 92 L76 110 L64 92Z','none',T,3);
  s+=circ(96,42,15,'#aab0b8',T,3.2)+pth('M96 28 V56 M86 40 H106','none',T,2.6)+pth('M88 30 L96 22 L104 30','#aab0b8',T,2.4);
  return s;});

/* duas mãos unidas: vassalagem e laços pessoais */
reg('maos-unidas','amarelo','Duas mãos unidas',u=>{
  let s=pth('M8 92 L56 84 L62 128 L8 134Z','#5f7f90',T,3.2)+pth('M192 92 L144 84 L138 128 L192 134Z',WOOD,T,3.2);
  s+=pth('M14 104 H54 M14 118 H56','none',T,2)+pth('M186 104 H146 M186 118 H144','none',T,2);
  s+=pth('M56 88 C74 80 98 78 122 88 L144 90 L140 126 C118 134 86 136 62 128Z',SKIN,T,3.4);
  s+=pth('M70 96 C90 90 110 92 128 100 M72 108 C92 104 112 104 132 110 M76 120 C94 118 112 118 128 122','none',T,2.4);
  s+=pth('M84 86 C96 70 118 72 124 86','none',T,3.2)+pth('M92 130 C104 142 124 140 134 126','none',T,3.2);
  s+=hach('M60 118 C90 126 118 124 142 114 L140 126 C118 134 86 136 62 128Z','cm-h1',.5);
  return s;});

/* mapa partido em pedaços */
reg('mapa-partido','coral','Mapa partido em cinco pedaços',u=>{
  const ps=[['M22 34 L88 24 L96 74 L40 84Z','#efe3bf'],['M100 22 L170 34 L156 70 L104 74Z','#e4d6a8'],['M34 94 L98 84 L106 130 L52 142Z','#e9dcb4'],['M112 84 L174 78 L184 126 L120 134Z','#efe3bf'],['M60 150 L126 142 L146 184 L74 188Z','#e4d6a8']];
  let s='';
  ps.forEach((q,i)=>{s+=pth(q[0],q[1],T,3.2)+hach(q[0],'cm-hh',.35);});
  s+=pth('M46 50 C60 44 70 56 80 48 M118 44 C130 50 140 44 150 52 M58 112 C70 106 84 116 94 108 M136 104 C150 112 160 106 168 112 M90 166 C100 160 114 166 124 162','none',T,2.2);
  s+=pth('M96 74 L100 84 M104 74 L110 84','none','#d63a22',3);
  return s;});

/* frasco de óleo da sagração */
reg('frasco-oleo','amarelo','Ampola de óleo da unção',u=>{
  let s=pth('M92 16 H108 V40 H92Z',WOOD,T,3)+pth('M94 40 H106 V70 C132 84 140 122 128 150 C118 176 82 176 72 150 C60 122 68 84 94 70Z',GOLD,T,3.4);
  s+=hach('M112 76 C132 94 134 132 120 156 L108 168 C124 140 124 98 104 72Z','cm-h1',.5)+pth('M80 112 C82 98 88 90 96 86','none','#fff8d8',6);
  s+=pth('M100 188 C100 180 94 176 94 170 A6 6 0 0 0 106 170 C106 176 100 180 100 188Z','#7a5a1c',T,2);
  return s;});

reg('coroa-aro','petroleo','Coroa de aro e pontas',u=>{
  let s=pth('M30 140 L30 70 L66 104 L100 50 L134 104 L170 70 L170 140Z',GOLD,T,3.6)+hach('M130 104 L170 70 L170 140 H130Z','cm-h1',.5);
  s+=rect(26,138,148,26,'#c99a24',T,3.6)+pth('M40 150 H160','none','#fff3b0',3);
  [[30,66],[100,46],[170,66]].forEach(q=>{s+=circ(q[0],q[1],8,'#fff3b0',T,3);});
  return s;});

/* o toque real: mão sobre a cabeça de um doente */
reg('toque-real','coral','Mão do rei sobre a testa de um doente',u=>{
  let s=pth('M50 188 C50 150 70 138 106 138 C142 138 164 150 164 188Z',WOOL,T,3.4);
  s+=circ(112,118,24,SKIN,T,3.4)+pth('M96 126 H110 M100 112 h2 M120 112 h2','none',T,2.2);
  [[102,104],[112,100],[124,108],[100,122],[126,124],[116,128]].forEach(q=>{s+=circ(q[0],q[1],2.6,'#b8603f');});
  s+=pth('M10 40 L58 24 L78 62 L28 80Z','#8e1e2c',T,3.4)+pth('M16 48 L66 32 M22 62 L72 46','none',GOLD,3);
  s+=pth('M72 56 C84 56 96 70 98 86 L88 92 C84 84 78 78 70 74Z',SKIN,T,3);
  s+=pth('M98 86 C102 78 108 74 114 76 L116 84 C108 84 104 90 100 96Z',SKIN,T,3);
  s+=pth('M84 70 L94 82 M90 64 L100 78','none',T,2);
  return s;});

/* selo do papa: duas chaves cruzadas */
reg('selo-papal','coral','Selo papal com duas chaves cruzadas',u=>{
  let s=circ(100,100,66,RED,T,3.6)+circ(100,100,54,'none','#f6d58a',3)+hach('M100 34 A66 66 0 0 1 100 166 A50 50 0 0 0 100 34Z','cm-h1',.35);
  s+=pth('M64 142 L130 62','none',T,10)+pth('M64 142 L130 62','none',GOLD,5)+pth('M136 142 L70 62','none',T,10)+pth('M136 142 L70 62','none','#dfe3e6',5);
  s+=circ(134,58,12,'none',T,6)+circ(134,58,12,'none',GOLD,3)+circ(66,58,12,'none',T,6)+circ(66,58,12,'none','#dfe3e6',3);
  s+=pth('M74 126 L84 132 M80 136 L90 142','none',T,4)+pth('M126 126 L116 132 M120 136 L110 142','none',T,4);
  return s;});

/* igreja românica de aldeia, com torre e cruz */
reg('igreja','amarelo','Igreja de pedra com cruz',u=>{
  let s=pth('M24 170 V104 H110 V170Z',STONE,T,3.4)+pth('M110 170 V54 H150 V170Z',STONE,T,3.4);
  s+=pth('M20 106 L64 76 L114 106Z','#8f8c82',T,3.4)+pth('M106 54 L130 34 L154 54Z','#8f8c82',T,3.4);
  s+=pth('M130 28 V6 M122 14 H138','none',T,4)+pth('M54 170 V140 A12 12 0 0 1 78 140 V170Z','#4a3a2a',T,3)+pth('M34 128 V118 A6 6 0 0 1 46 118 V128Z','#4a3a2a',T,2.4)+pth('M88 128 V118 A6 6 0 0 1 100 118 V128Z','#4a3a2a',T,2.4);
  s+=pth('M122 90 V80 A8 8 0 0 1 138 80 V90Z','#4a3a2a',T,2.4)+hach('M138 54 H150 V170 H138Z','cm-h1',.5)+hach('M98 104 H110 V170 H98Z','cm-h1',.4)+tinta('M26 150 H110 M112 120 H148',1.6);
  s+=pth('M8 172 H192','none',T,3.4);
  return s;});

/* livro com cadeado: a escrita era monopólio do clero */
reg('livro-cadeado','petroleo','Livro fechado com cadeado',u=>{
  let s=pth('M40 50 H156 V158 H40Z','#8e1e2c',T,3.6)+pth('M40 50 V158 M48 50 V158','none',T,2.4)+pth('M156 56 H164 V154 H156Z','#fffdf6',T,2.6)+tinta('M160 66 V148',1.4);
  s+=pth('M58 70 H140 V138 H58Z','none','#e8c15a',3)+pth('M66 78 H132 M66 130 H132','none','#e8c15a',2.4);
  s+=pth('M84 100 V90 A16 16 0 0 1 116 90 V100','none',T,10)+pth('M84 100 V90 A16 16 0 0 1 116 90 V100','none','#c9ccd0',5);
  s+=rect(76,100,48,40,'#9a9da2',T,3.6)+circ(100,118,6,T)+pth('M100 118 V130','none',T,5);
  return s;});

/* pia batismal */
reg('pia','petroleo','Pia batismal de pedra',u=>{
  let s=pth('M76 172 H124 L118 140 H82Z',STONE,T,3.4)+pth('M60 172 H140','none',T,5)+pth('M86 140 C70 126 62 112 62 94 H138 C138 112 130 126 114 140Z',STONE,T,3.4);
  s+='<ellipse cx="100" cy="94" rx="40" ry="11" fill="#bfe0f4" stroke="'+T+'" stroke-width="3.4"/>'+tinta('M78 94 C90 98 112 98 124 92',1.8);
  s+=hach('M120 100 C132 108 134 120 114 140L122 140 C136 124 138 108 138 98Z','cm-h1',.5)+pth('M94 40 C94 50 86 54 86 62 A8 8 0 0 0 102 62 C102 54 94 50 94 40Z','#2f77b5',T,2.4);
  s+=pth('M120 52 C120 58 116 60 116 64 A5 5 0 0 0 126 64 C126 60 120 58 120 52Z','#2f77b5',T,2);
  return s;});

/* alianças: casamento */
reg('aliancas','amarelo','Duas alianças de casamento',u=>{
  let s=circ(80,112,38,'none',T,16)+circ(80,112,38,'none',GOLD,10)+circ(124,112,38,'none',T,16)+circ(124,112,38,'none','#dfe3e6',10);
  s+=pth('M96 84 A38 38 0 0 1 112 84','none',T,0)+circ(100,60,9,'#d63a22',T,3)+pth('M94 54 L100 46 L106 54','#fff',T,0);
  s+=pth('M64 84 C70 78 78 76 86 76','none','#fff8d8',4)+pth('M140 140 C132 146 124 148 116 146','none','#fff',3);
  return s;});

/* vela acesa: o fim da vida (extrema-unção) */
reg('vela','coral','Vela acesa',u=>{
  let s=pth('M80 172 H120 L124 160 H76Z','#c9a95a',T,3.2)+rect(88,78,24,84,'#fffdf6',T,3.4)+hach('M104 78 H112 V162 H104Z','cm-h1',.45);
  s+=pth('M100 78 V68','none',T,3)+pth('M100 20 C118 40 120 56 100 68 C80 56 82 40 100 20Z','#ffb02e',T,3)+pth('M100 38 C108 48 108 58 100 64 C92 58 92 48 100 38Z','#ffe58a',T,0);
  s+=pth('M88 96 C92 108 90 116 88 124','none',T,1.6);
  return s;});

/* mão-morta: o senhor leva a melhor cabeça do rebanho da herança */
reg('mao-morta','coral','Mão do senhor levando um boi',u=>{
  let s=pth('M148 122 C160 128 168 140 164 158','none',T,4);
  s+=pth('M56 134 V176 M78 134 V176 M126 134 V176 M146 134 V176','none',T,11)+pth('M56 134 V176 M78 134 V176 M126 134 V176 M146 134 V176','none','#9a6c40',6);
  s+=pth('M54 92 C54 66 88 60 124 64 C156 66 168 84 164 106 L162 138 L54 138Z','#b88a58',T,3.6)+hach('M130 66 C158 72 168 90 164 106 L162 138 L136 138Z','cm-h1',.5);
  s+=pth('M54 88 C34 86 22 100 24 120 L44 134 L58 110Z','#b88a58',T,3.4)+pth('M30 90 L22 70 M48 86 L54 68','none',T,5)+circ(38,106,3,T)+pth('M26 124 C22 118 24 112 28 112','none',T,2.4);
  s+=pth('M26 122 C12 132 10 146 16 156','none',T,3.4)+pth('M2 150 C8 142 22 144 28 154 L22 170 C10 172 2 166 2 150Z',SKIN,T,3.2)+pth('M8 156 L20 162','none',T,2);
  return s;});

/* moinho de água de aldeia */
reg('moinho-agua','petroleo','Moinho de água',u=>{
  let s=pth('M14 168 H188','none',T,3.4);
  s+=pth('M30 168 V84 H110 V168Z',STONE,T,3.4)+pth('M22 88 L70 44 L118 88Z','#8f8c82',T,3.4)+pth('M54 168 V132 H86 V168Z','#4a3a2a',T,2.6)+hach('M96 84 H110 V168 H96Z','cm-h1',.5)+pth('M44 112 V100 A6 6 0 0 1 56 100 V112Z','#4a3a2a',T,2.2);
  s+=circ(138,134,36,'none',T,5)+circ(138,134,36,'none',WOOD,2.6)+circ(138,134,6,WOOD,T,2.4);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=pth('M'+(138+Math.cos(a)*6)+' '+(134+Math.sin(a)*6)+' L'+(138+Math.cos(a)*36)+' '+(134+Math.sin(a)*36),'none',WOOD,3)+pth('M'+(138+Math.cos(a)*36-3)+' '+(134+Math.sin(a)*36-3)+' l6 6','none',T,5);}
  s+=pth('M96 176 C120 184 160 184 192 174','none','#2f77b5',3.4);
  return s;});

/* carrinho de esterco: o adubo */
reg('carrinho','amarelo','Carrinho de esterco',u=>{
  let s=pth('M24 96 H170 L152 144 H46Z','#a77a4b',T,3.6)+hach('M138 96 H170 L152 144 H134Z','cm-h1',.5);
  s+=pth('M34 96 C40 70 64 62 84 70 C100 56 132 58 142 80 C152 84 160 90 160 96Z','#5a3d24',T,3.2)+pth('M60 82 H70 M104 76 H116 M130 90 H140','none','#8a6a44',3);
  s+=pth('M24 96 L2 78 M2 78 L-6 92','none',T,6)+circ(98,160,22,'none',T,6)+circ(98,160,22,'none',WOOD,3)+circ(98,160,4,T)+pth('M98 140 V180 M78 160 H118','none',WOOD,2.4)+pth('M46 144 L98 160','none',T,3);
  return s;});

/* cruz latina de pedra */
reg('cruz','amarelo','Cruz latina',u=>{
  let s=pth('M86 16 H114 V70 H168 V98 H114 V184 H86 V98 H32 V70 H86Z',GOLD,T,3.6)+hach('M100 16 H114 V70 H168 V98 H114 V184 H100Z','cm-h1',.4);
  s+=pth('M96 30 V176 M44 84 H156','none','#fff8d8',3,' stroke-opacity=".7"')+circ(100,84,9,'#d63a22',T,2.6);
  return s;});

/* denário medieval: moedas com cruz (a moeda de prata dos séculos medievais) */
reg('denario','amarelo','Moedas de prata com cruz',u=>{
  let s='';
  [[70,128,34],[128,134,34],[100,92,36]].forEach((q,i)=>{s+=circ(q[0],q[1],q[2],i===2?'#e9e6dc':'#d9d6cb',T,3.4)+circ(q[0],q[1],q[2]-8,'none',T,1.8)+pth('M'+q[0]+' '+(q[1]-14)+' V'+(q[1]+14)+' M'+(q[0]-14)+' '+q[1]+' H'+(q[0]+14),'none',T,3.4);
    s+=circ(q[0]-q[2]+10,q[1],1.8,T)+circ(q[0]+q[2]-10,q[1],1.8,T);});
  s+=pth('M60 150 C72 160 96 162 106 152','none',T,2)+pth('M50 112 C54 100 62 94 74 92','none','#fff',3);
  return s;});

/* moinho de água e forno do senhor: as banalidades */
reg('moinho-forno','petroleo','Moinho de água e forno de pão',u=>{
  let s=pth('M18 170 H182','none',T,3.4);
  s+=pth('M20 168 V100 H84 V168Z',STONE,T,3.4)+pth('M14 102 L52 66 L90 102Z','#c76a4b',T,3.4)+pth('M40 168 V138 H60 V168Z','#4a3a2a',T,2.6)+hach('M72 100 H84 V168 H72Z','cm-h1',.5);
  s+=circ(94,134,34,'none',T,5)+circ(94,134,34,'none',WOOD,2.4)+circ(94,134,6,WOOD,T,2.4);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=pth('M'+(94+Math.cos(a)*6)+' '+(134+Math.sin(a)*6)+' L'+(94+Math.cos(a)*34)+' '+(134+Math.sin(a)*34),'none',WOOD,3)+pth('M'+(94+Math.cos(a)*34-3)+' '+(134+Math.sin(a)*34-3)+' l6 6','none',T,5);}
  s+=pth('M92 168 C112 176 146 176 168 168','none','#2f77b5',3);
  s+=pth('M112 170 C108 100 196 100 192 170Z','#d49a58',T,3.6)+hach('M170 118 C188 130 192 154 192 170 H172Z','cm-h1',.5)+pth('M126 128 C140 118 164 118 178 128 M118 148 H186','none',T,1.8)+pth('M138 170 V150 A14 14 0 0 1 166 150 V170Z','#2a1c10',T,2.6)+pth('M146 168 C146 158 152 156 152 148 C158 156 162 158 160 168Z','#ff9a2e',T,1.8)+pth('M110 172 H196','none',T,3.4);
  return s;});

/* charrua puxada por cavalo */
reg('charrua','amarelo','Charrua de ferro puxada por cavalo',u=>{
  let s=cavalo('#a9784a',2,62,.62,false);
  s+=pth('M80 108 L150 126','none',T,4)+pth('M82 96 L152 122','none',T,3);
  s+=pth('M150 100 L150 140 L186 150 L184 168 L146 160 L132 168 L130 128Z','#8f949c',T,3)+pth('M150 100 L190 56','none',T,10)+pth('M150 100 L190 56','none',WOOD,6);
  s+=circ(130,162,16,'none',T,6)+circ(130,162,16,'none',WOOD,3)+circ(130,162,3,T)+pth('M130 146 V178 M114 162 H146','none',WOOD,2);
  s+=pth('M120 176 H190','none',T,2.6)+pth('M164 178 L172 184 M176 178 L184 184','none',T,2);
  return s;});

/* moinho de vento de pilar */
reg('moinho-vento','amarelo','Moinho de vento de madeira',u=>{
  let s=pth('M92 124 L80 176 M108 124 L120 176 M100 124 V176 M84 150 H116','none',T,6)+pth('M92 124 L80 176 M108 124 L120 176 M100 124 V176','none',WOOD,3);
  s+=pth('M76 62 H124 L130 126 H70Z','#d6b985',T,3.4)+hach('M114 62 H124 L130 126 H114Z','cm-h1',.5)+pth('M70 62 L100 40 L130 62Z','#8a5a33',T,3.4)+pth('M92 126 V104 H108 V126Z','#3a2a1c',T,2.4);
  s+=tinta('M74 82 H128 M72 102 H128',1.6);
  [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(q=>{const x=100+q[0]*4,y=92+q[1]*4;const ex=100+q[0]*72,ey=92+q[1]*60;
    s+=pth('M100 92 L'+ex+' '+ey,'none',T,6)+pth('M100 92 L'+ex+' '+ey,'none',WOOD,3);
    const nx=-q[1]*.7,ny=q[0]*.7,ax=100+q[0]*24,ay=92+q[1]*20;
    s+=pth('M'+ax+' '+ay+' L'+ex+' '+ey+' L'+(ex+nx*22+q[0]*0)+' '+(ey+ny*22)+' L'+(ax+nx*22)+' '+(ay+ny*22)+'Z','#fbf9f1',T,2.6)+tinta('M'+(ax+nx*11)+' '+(ay+ny*11)+' L'+(ex+nx*11)+' '+(ey+ny*11),1.4);});
  s+=circ(100,92,6,WOOD,T,2.4);
  return s;});

/* mitra e livro: os que oram */
reg('mitra','coral','Mitra de bispo e livro',u=>{
  let s=pth('M44 150 L156 150 L152 176 L48 176Z','#8e1e2c',T,3.2)+pth('M50 150 V132 H150 V150Z','#fffdf6',T,3)+tinta('M52 140 H148',1.6);
  s+=pth('M56 130 C56 80 80 40 100 20 C120 40 144 80 144 130Z','#f4f0e4',T,3.6)+pth('M100 28 V130 M84 70 L100 52 L116 70','none',GOLD,5)+hach('M126 40 C142 76 144 110 144 130 H126Z','cm-h1',.45);
  s+=pth('M56 130 H144','none',GOLD,7)+pth('M148 128 L168 150 M52 128 L34 150','none',T,4)+pth('M148 140 H166 V152 H148Z',GOLD,T,2)+pth('M34 140 H52 V152 H34Z',GOLD,T,2);
  return s;});

/* elmo e espada: os que lutam */
reg('elmo-espada','petroleo','Elmo e espada',u=>{
  let s='<g transform="rotate(52 100 100)">'+pth('M100 14 L100 176','none',T,14)+pth('M100 14 L100 176','none','#c9ccd0',8)+pth('M70 146 H130','none',T,12)+pth('M70 146 H130','none',GOLD,6)+pth('M100 154 V182','none',T,10)+circ(100,186,6,GOLD,T,2.4)+'</g>';
  s+=pth('M54 110 C50 60 74 34 100 34 C126 34 150 60 146 110 L146 126 H54Z','#aab0b8',T,3.6)+pth('M100 34 V126','none',T,3)+hach('M124 40 C142 60 146 90 146 110 V126 H124Z','cm-h1',.5);
  s+=pth('M84 70 H116 V104 H84Z','#2b2a27',T,2.6)+pth('M92 76 H108 M92 84 H108 M92 92 H108','none','#aab0b8',2);
  return s;});

/* enxada e feixe de trigo: os que trabalham */
reg('enxada-feixe','amarelo','Enxada e feixe de trigo',u=>{
  let s=pth('M44 20 L72 176','none',T,10)+pth('M44 20 L72 176','none',WOOD,6)+pth('M52 160 L90 150 L96 172 L62 184Z','#7c8189',T,3);
  s+=pth('M96 170 C100 130 116 100 128 60 M112 170 C118 130 132 104 148 66 M130 172 C130 132 140 106 164 78','none',T,5);
  [[128,60],[148,66],[164,78],[120,76],[138,82],[154,92]].forEach((q,i)=>{s+=pth('M'+q[0]+' '+q[1]+' C'+(q[0]-8)+' '+(q[1]-16)+' '+(q[0]-2)+' '+(q[1]-34)+' '+(q[0]+2)+' '+(q[1]-44)+' C'+(q[0]+10)+' '+(q[1]-30)+' '+(q[0]+10)+' '+(q[1]-14)+' '+q[0]+' '+q[1]+'Z',GOLD,T,2.4);});
  s+=pth('M86 130 C108 142 144 142 166 126','none',T,8)+pth('M86 130 C108 142 144 142 166 126','none','#b9884a',4);
  return s;});

/* ---------- utilidades dos esquemas ---------- */
/* ícone embutido num esquema SVG: x, y e lado em unidades do esquema */
function ico(nome,x,y,lado,o){
  const s=C.icone(nome,o||{});
  return s.replace('<svg ','<svg x="'+x+'" y="'+y+'" width="'+lado+'" height="'+lado+'" ');
}
const fundoCard=(W,H)=>'<rect width="'+W+'" height="'+H+'" fill="#fbf9f1"/><rect width="'+W+'" height="'+H+'" fill="url(#cm-hh)" opacity=".16"/>';
/* peça-esquema: papel com borda rasgada e arte em SVG; W e H são o tamanho da peça na mesa (1 unidade = 1 px da mesa) */
function esq(p,W,H,corpo,rot,o){
  o=o||{};
  return {cls:'cm-m2'+(o.fundo===false?'':' rasgado')+(o.cls?' '+o.cls:''),style:o.fundo===false?'':'--clip:'+C.rasgo(p.id,1.2),
    html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||rot)+'">'+(o.fundo===false?'':fundoCard(W,H))+corpo+'</svg>'};
}
const ap=(cls,a,corpo,x)=>'<g class="'+cls+'" style="--a:'+a+'s"'+(x||'')+'>'+corpo+'</g>';
const seta=(d,cor,w,a,ponta)=>{
  /* seta tracejada com ponta: d é o caminho; a ponta vem por último em dois traços curtos */
  return '<path class="ar" pathLength="1" d="'+d+'" fill="none" stroke="'+(cor||T)+'" stroke-width="'+(w||6)+'" stroke-linecap="round" stroke-linejoin="round" style="--a:'+(a||0)+'s" stroke-dasharray="1"/>';
};
/* ponta de seta em (x,y) apontando no ângulo ang (radianos) */
const ponta=(x,y,ang,cor,w,l)=>{
  l=l||34;const a1=ang+Math.PI-.5,a2=ang+Math.PI+.5;
  return pth('M'+(x+Math.cos(a1)*l).toFixed(1)+' '+(y+Math.sin(a1)*l).toFixed(1)+' L'+x+' '+y+' L'+(x+Math.cos(a2)*l).toFixed(1)+' '+(y+Math.sin(a2)*l).toFixed(1),'none',cor||T,w||6);
};

/* ---------- bilhete: nota amarela com um ícone e uma frase ---------- */
C.tipos.bilhete=p=>({cls:'m2-bil',html:
  '<span class="cm-fita" style="--fx:'+(p.fita!=null?p.fita:38)+'%;--fg:'+(p.fg!=null?p.fg:-4)+'deg"></span>'+
  '<div class="ic">'+C.icone(p.icone,{fundo:p.fundo,rotulo:p.rotuloIcone||p.texto})+'</div><span class="t">'+esc(p.texto)+'</span>'});

/* ---------- nota amarela e etiqueta branca com tamanho de letra em px da mesa ---------- */
C.tipos.notag=p=>({cls:'cm-nota',style:'font-size:'+(p.tam||40)+'px;line-height:1.22;',html:esc(p.texto)});
C.tipos.etq2=p=>({cls:'cm-etq',style:'font-size:'+(p.tam||40)+'px;line-height:1.2;padding:16px 22px!important;',html:'<span class="cm-fita" style="--fx:'+(p.fita!=null?p.fita:12)+'%;--fg:-5deg"></span><span>'+esc(p.texto)+'</span>'});

/* ---------- palavra com marca-texto ---------- */
C.tipos.palavra=p=>({cls:'m2-pal',style:'--a:'+(p.marcaEm!=null?p.marcaEm:3)+'s;'+(p.tam?'font-size:'+p.tam+'px;':''),html:'<span>'+esc(p.texto)+'</span>'});

/* ---------- jigsaw: as peças Roma e germânicos, que se encaixam ---------- */
const JW=500,JH=760;
const TAB_R='M0 0 H500 V330 C500 346 512 350 520 350 A36 36 0 1 1 520 422 C512 422 500 426 500 442 V760 H0 Z';
const TAB_L='M0 0 H500 V760 H0 V442 C0 426 12 422 20 422 A36 36 0 1 0 20 350 C12 350 0 346 0 330 Z';
function pessoa(x,y,k,cor,o){
  o=o||{};
  return '<g transform="translate('+x+' '+y+') scale('+k+')">'+
    pth('M-14 8 L14 8 L20 62 L-20 62Z',cor||WOOL,T,3.2)+circ(0,-6,14,SKIN,T,3)+(o.chapeu?pth('M-15 -8 C-14 -26 14 -26 15 -8 C8 -13 -8 -13 -15 -8Z','#7a5a3a',T,2.4):'')+
    (o.escudo?circ(-18,28,16,'#c9a36a',T,3)+circ(-18,28,5,'#8a8d92',T,2)+circ(-18,28,11,'none',T,1.6):'')+
    (o.lanca?pth('M22 70 L22 -34','none',T,3.4)+pth('M22 -34 L17 -22 L27 -22Z','#9a9da2',T,2):'')+'</g>';
}
C.tipos.jigsaw=p=>{
  const roma=p.lado==='roma';let s='';
  s+='<g filter="url(#cm-sombra)"><path d="'+(roma?TAB_R:TAB_L)+'" fill="'+(roma?'#f1e6c9':'#e7e8d6')+'" stroke="'+T+'" stroke-width="5" filter="url(#cm-rasga)"/></g>';
  s+='<path d="'+(roma?TAB_R:TAB_L)+'" fill="url(#cm-hh)" opacity=".16"/>';
  if(roma){
    s+=sTx(250,96,'Roma',88,400,'middle',T,SERIF)+tinta('M120 116 H380',3);
    /* planta de uma vila: campos em volta da casa grande */
    s+=rect(46,150,408,290,'#e3cf93',T,4)+rect(46,150,408,290,'url(#cm-hv)',null,0,' opacity=".6"');
    [[46,150,150,110],[304,150,150,110],[46,330,150,110],[304,330,150,110]].forEach(r=>{s+=rect(r[0]+8,r[1]+8,r[2]-16,r[3]-16,'none',T,2.2,' stroke-dasharray="9 6"');});
    s+=rect(166,226,168,138,'#fffdf6',T,4.4)+pth('M166 226 L250 180 L334 226','#c76a4b',T,4.4)+rect(210,282,80,82,'#e8dcc0',T,3.2)+tinta('M174 244 H326 M174 262 H326',1.6)+hach('M300 226 H334 V364 H300Z','cm-h1',.45);
    s+=sTx(250,490,'vila romana',48,700,'middle',T);
    /* colono preso a um lote por linha tracejada */
    s+=pessoa(110,570,1.25,'#7a8fa3',{chapeu:1})+rect(262,560,150,100,'#d9c58a',T,3.6)+rect(262,560,150,100,'url(#cm-hv)',null,0,' opacity=".6"')+
      '<path d="M142 626 C190 640 232 640 262 618" fill="none" stroke="'+T+'" stroke-width="4" stroke-dasharray="11 9" stroke-linecap="round"/>';
    s+=sTx(250,720,'colono preso ao lote',42,700,'middle',T);
  }else{
    s+=sTx(262,96,'germânicos',76,400,'middle',T,SERIF)+tinta('M110 116 H410',3);
    /* chefe no centro, guerreiros em roda */
    const cx=262,cy=290,R=118;
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(R+34)+'" fill="none" stroke="'+T+'" stroke-width="3" stroke-dasharray="3 12" stroke-linecap="round"/>';
    for(let i=0;i<7;i++){const a=-Math.PI/2+i*Math.PI*2/7;s+=pessoa(cx+Math.cos(a)*R,cy+Math.sin(a)*R-18,.92,['#6f8f5a','#8a6f4a','#7a8fa3'][i%3],{escudo:1,lanca:i%2});}
    s+=pessoa(cx,cy-16,1.6,'#8e1e2c',{})+pth('M'+(cx-22)+' '+(cy-56)+' L'+(cx-16)+' '+(cy-70)+' L'+cx+' '+(cy-60)+' L'+(cx+16)+' '+(cy-70)+' L'+(cx+22)+' '+(cy-56)+'Z',GOLD,T,2.6);
    s+=sTx(262,480,'comitatus',50,700,'middle',T)+sTx(262,526,'fidelidade ao chefe',38,500,'middle','#2f2e2a');
    /* lote entregue de mão em mão */
    s+=pth('M120 640 C150 626 190 626 232 640 L238 676 C196 688 156 688 126 676Z',SKIN,T,3.4)+pth('M120 626 L70 624 L64 686 L122 690Z','#8e1e2c',T,3.2)+
      pth('M404 640 C376 626 336 626 298 640 L290 676 C332 688 372 688 398 676Z',SKIN,T,3.4)+pth('M404 626 L452 624 L456 686 L402 690Z','#5f7f90',T,3.2);
    s+=rect(214,580,86,62,'#d9c58a',T,3.4)+rect(214,580,86,62,'url(#cm-hv)',null,0,' opacity=".6"')+
      pth('M236 650 C246 640 266 640 276 650','none',T,2.4);
    s+=sTx(262,732,'lote em troca de serviço',38,700,'middle',T);
  }
  return {cls:'cm-m2 '+(roma?'jl':'jr'),html:'<svg viewBox="0 0 '+JW+' '+JH+'" role="img" aria-label="'+esc(p.rotulo||(roma?'Herança de Roma: a vila e o colono preso ao lote':'Herança germânica: o chefe com seus guerreiros e o lote dado em troca de serviço'))+'">'+s+'</svg>'};
};

/* ---------- quadrinho: os três atos do laço vassálico ---------- */
C.tipos.quadrinho=p=>{
  const W=1860,H=640,FW=580,FH=420;let s='';
  const quadro=(i,x,cena,titulo,sub,a)=>{
    let g='<g transform="translate('+x+' 0)"><g filter="url(#cm-sombra)"><rect width="'+FW+'" height="'+FH+'" fill="#fffdf6" stroke="'+T+'" stroke-width="5"/></g>'+
      '<g clip-path="url(#qd'+i+')">'+cena+'</g><defs><clipPath id="qd'+i+'"><rect width="'+FW+'" height="'+FH+'"/></clipPath></defs>'+
      circ(44,44,32,'#ffd83d',T,4)+sTx(44,58,String(i+1),44,700,'middle',T)+
      '<path d="M-6 '+(FH+12)+' H'+(FW+6)+' V'+(H-4)+' H-6Z" fill="#fff4c2" stroke="'+T+'" stroke-width="4"/>'+sTx(FW/2,FH+64,titulo,56,700,'middle',T)+sTx(FW/2,FH+112,sub[0],38,500,'middle','#2f2e2a')+sTx(FW/2,FH+156,sub[1],38,500,'middle','#2f2e2a')+'</g>';
    return ap('dim',a,g);
  };
  const chao='<rect y="340" width="580" height="80" fill="#e3cf93"/><rect y="340" width="580" height="80" fill="url(#cm-hh)" opacity=".5"/>'+tinta('M0 340 H580',3);
  /* 1: homenagem. O vassalo ajoelhado, com as mãos entre as do senhor */
  const c1=chao+
    pth('M392 150 L492 150 L524 360 L368 360Z','#8e1e2c',T,4)+hach('M462 150 H492 L524 360 H480Z','cm-h1',.45)+pth('M380 292 H512','none',GOLD,6)+circ(442,108,38,SKIN,T,4)+pth('M406 94 C408 62 476 62 478 94','#3a2a1c',T,3)+pth('M412 68 L418 52 L434 64 L442 48 L450 64 L466 52 L472 68','none',GOLD,5)+
    pth('M96 340 L108 322 L250 322 L264 340Z','#4a6878',T,3.6)+pth('M92 322 C88 268 108 214 148 192 C190 180 222 204 220 246 L240 322Z','#5f7f90',T,4)+pth('M110 318 H236','none',T,2.6)+circ(172,150,34,SKIN,T,4)+pth('M140 140 C142 112 202 112 206 140 C192 134 158 134 140 140Z','#3a2a1c',T,3)+
    pth('M206 220 C236 224 266 228 296 232','none',T,22)+pth('M206 220 C236 224 266 228 296 232','none','#5f7f90',14)+
    pth('M410 176 C384 190 360 204 344 226','none',T,24)+pth('M410 176 C384 190 360 204 344 226','none','#8e1e2c',16)+
    pth('M294 266 C288 232 298 204 314 198 C330 204 336 232 330 266Z',SKIN,T,3.6)+pth('M312 204 V258 M304 214 V258 M322 214 V258','none',T,2)+
    pth('M276 262 C268 236 276 210 292 204 L300 214 C296 234 298 252 304 268Z',SKIN,T,3.6)+pth('M340 206 C356 212 362 238 354 262 L330 270 C338 250 340 230 336 214Z',SKIN,T,3.6)+
    '';
  /* 2: fidelidade. Mão sobre a Bíblia aberta */
  const c2=chao+
    pth('M170 360 L190 250 H390 L410 360Z',WOOD,T,4)+hach('M360 250 H390 L410 360 H380Z','cm-h1',.5)+
    pth('M200 250 C240 230 270 232 290 244 C310 232 340 230 380 250 L380 270 C340 252 312 254 290 266 C268 254 240 252 200 270Z','#fffdf6',T,4)+tinta('M214 252 C240 244 262 246 280 256 M300 256 C318 246 340 244 366 252 M214 262 C240 254 262 256 280 264 M300 266 C318 256 340 254 366 262',2)+pth('M290 244 V268','none',T,3)+
    pth('M10 140 L120 110 L170 190 L40 240Z','#5f7f90',T,4)+pth('M30 150 L130 124','none',T,2.4)+
    pth('M150 180 C176 178 200 196 232 226 C246 240 262 246 276 244 L290 258 C270 270 244 268 222 256 C196 244 176 232 160 216Z',SKIN,T,4)+tinta('M222 232 L250 250 M214 240 L244 258',2.4)+
    pth('M430 330 L430 280 L478 262 L526 280 L526 330Z','#d8b44a',T,4)+pth('M430 280 L478 244 L526 280','#e9c868',T,4)+pth('M460 330 V300 H496 V330','none',T,2.6);
  /* 3: investidura. Entrega do ramo com um punhado de terra */
  const c3=chao+
    pth('M10 130 L110 100 L170 176 L40 230Z',WOOD,T,4)+pth('M30 140 L120 116','none',T,2.4)+
    pth('M140 180 C170 172 210 186 250 206 L246 232 C206 226 172 222 144 212Z',SKIN,T,4)+tinta('M200 196 L240 214 M190 206 L236 226',2.4)+
    pth('M240 190 L330 140','none','#7a5a3a',8)+
    [[330,140,-20],[310,118,-60],[352,118,20],[290,150,-110],[350,160,50]].map(q=>pth('M'+q[0]+' '+q[1]+' c'+(Math.cos(q[2]*Math.PI/180)*50).toFixed(0)+' '+(Math.sin(q[2]*Math.PI/180)*50-12).toFixed(0)+' '+(Math.cos(q[2]*Math.PI/180)*60).toFixed(0)+' '+(Math.sin(q[2]*Math.PI/180)*60+12).toFixed(0)+' 0 0','#6f9a4a',T,3)).join('')+
    pth('M270 340 C300 296 360 296 390 330 L400 360 H260Z','#7a5a3a',T,4)+tinta('M290 332 L300 344 M340 322 L352 336 M376 336 L384 348',2.4)+
    pth('M320 250 C350 244 400 248 450 270 C470 280 478 296 470 312 L410 312 C380 296 350 290 320 292Z',SKIN,T,4)+tinta('M370 262 L420 280 M360 274 L416 296',2.4)+
    pth('M470 304 C500 300 540 290 560 270 L560 330 C520 330 490 322 462 316Z','#8e1e2c',T,4);
  s+=quadro(0,0,c1,'homenagem',['as mãos do vassalo','entre as do senhor'],0.8)+quadro(1,640,c2,'fidelidade',['juramento sobre a Bíblia','ou sobre relíquias'],3.8)+quadro(2,1280,c3,'investidura',['entrega simbólica','do feudo'],6.8);
  return esq(p,W,H,s,'Os três atos do pacto: homenagem, fidelidade e investidura',{fundo:false});
};

/* ---------- pacto: suserano, vassalo e a cadeia de dependências ---------- */
C.tipos.pacto=p=>{
  const W=1000,H=1000;let s='';
  const card=(y,t,sub,a,cor)=>ap('cai',a,'<g filter="url(#cm-sombra)"><path d="M214 '+(y+4)+' L786 '+y+' L790 '+(y+138)+' L210 '+(y+142)+'Z" fill="'+cor+'" stroke="'+T+'" stroke-width="5"/></g>'+sTx(500,y+64,t,54,700,'middle',T)+sTx(500,y+114,sub,40,500,'middle','#2f2e2a'));
  s+=card(30,'suserano','pode ser o rei',0.4,'#fffdf6')+card(390,'vassalo e suserano','de nobres menores',1.2,'#fff4c2')+card(750,'vassalo','de um senhor maior',2,'#fffdf6');
  const par=(y0,a)=>{
    const yA=y0+142,yB=y0+360;let g='';
    g+=seta('M130 '+(yA+14)+' C104 '+(yA+80)+' 104 '+(yB-90)+' 130 '+(yB-16),T,7,a+.2);
    g+=ap('ap',a+1.1,ponta(130,yB-14,Math.PI/2+.1,T,7))+
      ap('ap',a+.4,sTx(178,yA+80,'feudo',58,700,'start',T)+sTx(178,yA+130,'terra, cargo',44,500,'start','#2f2e2a')+sTx(178,yA+178,'ou renda',44,500,'start','#2f2e2a'));
    g+=seta('M870 '+(yB-16)+' C896 '+(yB-90)+' 896 '+(yA+80)+' 870 '+(yA+14),'#c93a2a',7,a+.6);
    g+=ap('ap',a+1.5,ponta(870,yA+12,-Math.PI/2-.1,'#c93a2a',7))+
      ap('ap',a+.8,sTx(822,yA+80,'lealdade',58,700,'end',T)+sTx(822,yA+130,'e serviço',44,500,'end','#2f2e2a')+sTx(822,yA+178,'militar',44,500,'end','#2f2e2a'));
    return g;};
  s+=par(30,2.6)+par(390,4.4);
  return esq(p,W,H,s,'Esquema do pacto feudo-vassálico: o suserano dá o feudo, o vassalo devolve lealdade e serviço militar, e o vassalo pode ser suserano de outro nobre');
};

/* ---------- ordens: a pirâmide das três ordens ---------- */
C.tipos.ordens=p=>{
  const W=1300,H=1100;let s='';
  const faixa=(i,d,sd,fill,ic,tt,sub,ty,a,cx)=>{
    return ap('ap',a,'<path d="'+d+'" fill="'+fill+'" stroke="'+T+'" stroke-width="5" fill-opacity="1"/><path d="'+sd+'" fill="url(#cm-h1)" opacity=".4"/>'+
      '<g transform="translate('+(cx-84)+' '+(ty-210)+')">'+ico(ic,0,0,190,{fundo:false})+'</g>'+sTx(cx,ty+24,tt,70,700,'middle',T)+sTx(cx,ty+82,sub,52,500,'middle','#2f2e2a'),' data-item="'+i+'"');
  };
  s+=faixa(0,'M470 40 L830 40 L910 350 L390 350Z','M800 40 L830 40 L910 350 L870 350Z','#fffdf6','mitra','oratores','os que oram',250,0.4,650);
  s+=faixa(1,'M380 376 L920 376 L1050 706 L250 706Z','M980 376 L920 376 L1050 706 L1010 706Z','#fff0cf','elmo-espada','bellatores','os que lutam',600,1.8,650);
  s+=faixa(2,'M240 732 L1060 732 L1240 1060 L60 1060Z','M1130 732 L1060 732 L1240 1060 L1190 1060Z','#fff4c2','enxada-feixe','laboratores','os que trabalham',960,3.2,650);
  return esq(p,W,H,s,'Pirâmide das três ordens: os oratores, que rezam, no topo; os bellatores, que lutam, no meio; os laboratores, que trabalham, na base, bem mais larga');
};

/* ---------- calendário da corveia ---------- */
C.tipos.calendario=p=>{
  const W=900,H=920,dias=['seg','ter','qua','qui','sex','sáb','dom'];let s=sTx(60,96,'a semana do servo',72,400,'start',T,SERIF)+tinta('M60 120 H620',3);
  dias.forEach((d,i)=>{const x=50+(i%4)*205,y=160+Math.floor(i/4)*260;
    s+='<g filter="url(#cm-sombra)"><rect x="'+x+'" y="'+y+'" width="190" height="236" fill="'+(i===6?'#d9d6cc':'#fffdf6')+'" stroke="'+T+'" stroke-width="4"/></g>'+rect(x,y,190,64,'#e6dfcf',T,4)+sTx(x+95,y+48,d,46,700,'middle',T)+rect(x,y,190,236,'url(#cm-hh)',null,0,' opacity=".14"');
    if(i<3)s+=ap('ap',1+i*1.1,rect(x+8,y+72,174,156,'#ffd83d',T,3.4)+sTx(x+95,y+138,'corveia',40,700,'middle',T)+pth('M'+(x+54)+' '+(y+172)+' L'+(x+80)+' '+(y+198)+' L'+(x+138)+' '+(y+158),'none','#c93a2a',9));
    if(i===6)s+=sTx(x+95,y+140,'dia santo',38,700,'middle','#4a463e')+sTx(x+95,y+186,'descanso',38,500,'middle','#4a463e');
  });
  s+=rect(60,690,60,44,'#ffd83d',T,3.6)+sTx(140,726,'corveia: trabalho gratuito',42,700,'start',T)+
     rect(60,752,60,44,'#fffdf6',T,3.6)+sTx(140,788,'resto: manso servil e descanso',42,500,'start','#2f2e2a')+
     sTx(60,860,'cerca de três dias por semana',42,700,'start','#4a463e');
  return esq(p,W,H,s,'Calendário de uma semana, com três dias marcados em amarelo, a corveia, e o domingo em cinza, dia santo');
};

/* ---------- obrigações: mesa de contas com os ícones ---------- */
C.tipos.obrigacoes=p=>{
  const W=900,H=1340;let s='';
  s+=rect(0,0,W,H,'#efe6cc',T,4);
  let x0='';for(let i=0;i<10;i++)for(let j=0;j<14;j++)if((i+j)%2===0)x0+='<rect x="'+(i*100-50)+'" y="'+(j*100-40)+'" width="100" height="100"/>';
  s+='<g fill="#d7c79a" opacity=".55">'+x0+'</g>'+rect(0,0,W,H,'none',T,6);
  const cards=[['trigo','talha','parte da colheita'],['denario','censo','renda fixa'],['moinho-forno','banalidades','moinho e forno'],['mao-morta','mão-morta','taxa na herança']];
  const pos=[[40,40],[460,40],[40,430],[460,430]];
  cards.forEach((c,i)=>{const x=pos[i][0],y=pos[i][1];
    s+=ap('cai',0.6+i*1.1,'<g filter="url(#cm-sombra)"><path d="M'+x+' '+(y+4)+' L'+(x+400)+' '+y+' L'+(x+404)+' '+(y+350)+' L'+(x-2)+' '+(y+354)+'Z" fill="#fffdf6" stroke="'+T+'" stroke-width="4"/></g>'+
      ico(c[0],x+100,y+6,200,{})+sTx(x+200,y+264,c[1],46,700,'middle',T)+sTx(x+200,y+312,c[2],38,500,'middle','#2f2e2a'));});
  s+=ap('cai',5,'<g transform="rotate(-2 120 420)"><rect x="30" y="800" width="440" height="90" fill="#ffd83d" stroke="'+T+'" stroke-width="3"/>'+sTx(250,838,'champart: nome francês',36,700,'middle',T)+sTx(250,876,'de uma parte da colheita',36,700,'middle',T)+'</g>');
  /* o dízimo vai à Igreja, não ao senhor: cartão à parte, com seta até a igreja */
  s+=ap('cai',6.2,'<g filter="url(#cm-sombra)"><path d="M40 930 L440 926 L444 1276 L38 1280Z" fill="#fff4c2" stroke="'+T+'" stroke-width="4"/></g>'+ico('cruz',140,936,200,{})+sTx(240,1194,'dízimo',46,700,'middle',T)+sTx(240,1242,'a décima parte',38,500,'middle','#2f2e2a'));
  s+=ap('ap',7.2,'<path d="M456 1100 H540" fill="none" stroke="#c93a2a" stroke-width="8" stroke-linecap="round"/>'+ponta(548,1100,0,'#c93a2a',8,30)+ico('igreja',560,940,300,{})+sTx(710,1252,'à Igreja,',40,700,'middle',T)+sTx(710,1298,'não ao senhor',40,700,'middle',T));
  return esq(p,W,H,s,'Mesa de contas com as obrigações do servo: talha, censo, banalidades e mão-morta, devidas ao senhor, e o dízimo, devido à Igreja',{fundo:false});
};

/* ---------- balança: escravo, servo e trabalhador livre ---------- */
C.tipos.balanca3=p=>{
  const W=1000,H=860;let s='';
  s+=tinta('M500 30 V120',5)+circ(500,24,14,'none',T,5);
  s+=pth('M30 140 L500 120 L970 140','none',T,10)+pth('M30 140 L500 120 L970 140','none','#8a8d92',5)+circ(500,122,18,GOLD,T,4);
  const pan=(x,y,cor,t,l1,l2,l3,a,gr)=>ap('cai',a,
    '<path d="M'+x+' 142 L'+(x-130)+' '+y+' M'+x+' 142 L'+(x+130)+' '+y+'" fill="none" stroke="'+T+'" stroke-width="3.4"/>'+
    '<path d="M'+(x-150)+' '+y+' H'+(x+150)+' C'+(x+130)+' '+(y+56)+' '+(x-130)+' '+(y+56)+' '+(x-150)+' '+y+'Z" fill="'+cor+'" stroke="'+T+'" stroke-width="5"/>'+
    sTx(x,y+130,t,gr?64:56,700,'middle',T)+sTx(x,y+184,l1,40,500,'middle','#2f2e2a')+sTx(x,y+228,l2,40,500,'middle','#2f2e2a')+sTx(x,y+272,l3,40,500,'middle','#2f2e2a'));
  s+=pan(170,300,'#e6dfcf','escravo','propriedade','de um dono,','sem direitos',0.5)+
     pan(500,300,'#ffd83d','servo','preso à terra,','com proteção e','terra para si',1.4,true)+
     pan(830,300,'#e6dfcf','livre','vilão: paga','renda, mas não','é preso à terra',2.3);
  s+=ap('ap',3.2,'<path d="M500 700 V640" fill="none" stroke="#c93a2a" stroke-width="7" stroke-linecap="round"/>'+ponta(500,632,-Math.PI/2,'#c93a2a',7,26)+sTx(500,756,'o servo está no meio',50,700,'middle','#c93a2a'));
  return esq(p,W,H,s,'Balança com três pratos: o escravo, o servo no meio e o livre, que pode ser vilão ou assalariado',{fundo:false});
};

/* ---------- a Igreja do nascimento à morte ---------- */
C.tipos.igrejavida=p=>{
  const W=1400,H=1060;let s='';
  const lig=(x,y,a)=>'<path d="M700 520 C700 570 '+x+' '+(y-120)+' '+x+' '+(y-30)+'" fill="none" stroke="'+T+'" stroke-width="5" stroke-dasharray="12 12" stroke-linecap="round" opacity=".8" style="--a:'+a+'s"/>';
  s+=ap('ap',0.2,ico('igreja',500,120,400,{}));
  s+=ap('ap',0.9,ico('livro-cadeado',50,150,260,{})+sTx(180,450,'escrita',52,700,'middle',T)+sTx(180,498,'só o clero lia',40,500,'middle','#2f2e2a')+'<path d="M300 280 C380 290 430 300 500 330" fill="none" stroke="'+T+'" stroke-width="4" stroke-dasharray="11 11"/>');
  const it=[['pia',210,'batismo','nasce',2.0],['aliancas',700,'casamento','vive',3.2],['vela',1190,'extrema-unção','morre',4.4]];
  it.forEach(q=>{s+=lig(q[1],740,q[4]-.4)+ap('ap',q[4],ico(q[0],q[1]-130,740,260,{})+sTx(q[1],1030,q[2],48,700,'middle',T));});
  s+=ap('ap',5.6,'<path d="M120 690 H1280" fill="none" stroke="#c93a2a" stroke-width="8" stroke-linecap="round"/>'+ponta(1280,690,0,'#c93a2a',8,36)+rect(430,570,540,70,'#ffd83d',T,4)+sTx(700,620,'do nascimento à morte',48,700,'middle',T));
  return esq(p,W,H,s,'A Igreja acompanhava a vida: batismo, casamento e extrema-unção, e guardava a escrita',{fundo:false});
};

/* ---------- o poder do rei em pedaços ---------- */
C.tipos.poder=p=>{
  const W=1000,H=1000,cx=500,cy=500;let s='';
  const R=[0,60,120,180,240,300];
  R.forEach((g,i)=>{
    const a=(g-90)*Math.PI/180,ux=Math.cos(a),uy=Math.sin(a),nx=-uy,ny=ux;
    const P=(r,o)=>[(cx+ux*r+nx*(o||0)).toFixed(1),(cy+uy*r+ny*(o||0)).toFixed(1)];
    const a0=P(170),a1=P(300),b0=P(358),b1=P(460);
    s+=seta('M'+a0.join(' ')+' L'+a1.join(' '),T,8,1+i*.25);
    /* o corte: um zigue-zague no meio do caminho */
    const z=[P(300),P(318,14),P(330,-14),P(344,12),P(358)];
    s+=ap('ap',1.6+i*.25,'<path d="M'+z.map(q=>q.join(' ')).join(' L')+'" fill="none" stroke="#c93a2a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>');
    /* o resto do caminho, apagado, e um castelinho no fim */
    s+=ap('ap',2.2+i*.25,'<path d="M'+b0.join(' ')+' L'+b1.join(' ')+'" fill="none" stroke="#9a948a" stroke-width="6" stroke-dasharray="10 12" stroke-linecap="round"/>');
    const e=P(486);
    s+=ap('ap',2.6+i*.25,'<g transform="translate('+(e[0]-24)+' '+(e[1]-26)+')">'+pth('M0 52 V16 H10 V24 H18 V16 H30 V24 H38 V16 H48 V52Z','#e6dfcf',T,3.4)+pth('M16 52 V38 A8 8 0 0 1 32 38 V52Z','#3a2a1c',T,2.4)+'</g>');
  });
  s+=circ(cx,cy,150,'#fffdf6',T,5)+ico('coroa-aro',cx-92,cy-136,184,{fundo:false})+sTx(cx,cy+106,'o rei',60,700,'middle',T);
  return esq(p,W,H,s,'A coroa no centro, com setas de poder que se partem no meio do caminho e terminam em castelos de senhores locais',{fundo:false});
};

/* ---------- retalhos: o reino em dezenas de senhorios (diagrama de Voronoi) ---------- */
function clipSemi(poly,a,b){ /* mantém o lado de a mais próximo de a do que de b */
  const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,nx=b[0]-a[0],ny=b[1]-a[1];
  const f=q=>(q[0]-mx)*nx+(q[1]-my)*ny; /* <=0 fica do lado de a */
  const out=[];
  for(let i=0;i<poly.length;i++){
    const p0=poly[i],p1=poly[(i+1)%poly.length],f0=f(p0),f1=f(p1);
    if(f0<=0)out.push(p0);
    if((f0<0&&f1>0)||(f0>0&&f1<0)){const t=f0/(f0-f1);out.push([p0[0]+(p1[0]-p0[0])*t,p0[1]+(p1[1]-p0[1])*t]);}
  }
  return out;
}
C.tipos.retalhos=p=>{
  const W=1380,H=1040,r=C.rng('retalhos'+(p.id||''));
  const contorno=[[270,50],[700,40],[930,250],[920,700],[640,990],[260,940],[70,590],[100,220]];
  const sites=[];
  for(let j=0;j<5;j++)for(let i=0;i<5;i++){sites.push([110+i*200+(j%2?90:0)+(r()-.5)*60,100+j*205+(r()-.5)*50]);}
  const dentro=q=>{ /* contorno é convexo: dentro se está do mesmo lado de todas as arestas */
    let sg=0;for(let i=0;i<contorno.length;i++){const a=contorno[i],b=contorno[(i+1)%contorno.length];const c=(b[0]-a[0])*(q[1]-a[1])-(b[1]-a[1])*(q[0]-a[0]);if(!c)continue;if(!sg)sg=Math.sign(c);else if(Math.sign(c)!==sg)return false;}return true;};
  const S=sites.filter(q=>dentro([q[0],q[1]]));
  const cores=['#f1e6c9','#e7e8d6','#efd9cf','#e3dcc4','#f4eed8','#e2e6dd','#f0dfc0'];
  let s='';
  const rei=S.reduce((m,q,i)=>(Math.abs(q[0]-760)+Math.abs(q[1]-300)<Math.abs(S[m][0]-760)+Math.abs(S[m][1]-300)?i:m),0);
  S.forEach((a,i)=>{
    let poly=contorno.map(q=>q.slice());
    S.forEach((b,j)=>{if(i!==j&&poly.length)poly=clipSemi(poly,a,b);});
    if(poly.length<3)return;
    const d='M'+poly.map(q=>q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' L')+'Z';
    const del=(0.4+((i*37)%S.length)/S.length*3.4).toFixed(2);
    let g='<path d="'+d+'" fill="'+(i===rei?'#ffd83d':cores[i%cores.length])+'" stroke="'+T+'" stroke-width="4"/>';
    if(i!==rei)g+='<g transform="translate('+(a[0]-24)+' '+(a[1]-25)+') scale(1.6)">'+pth('M0 32 V10 H6 V15 H11 V10 H19 V15 H24 V10 H30 V32Z','#fffdf6',T,2.6)+pth('M11 32 V24 A4 4 0 0 1 19 24 V32Z',T,T,1)+'</g>';
    s+=ap('ap',del,g);
  });
  const a=S[rei];
  s+=ap('ap',4.6,'<g filter="url(#cm-sombra)"><circle cx="'+a[0]+'" cy="'+(a[1]-6)+'" r="52" fill="#fffdf6" stroke="'+T+'" stroke-width="4"/></g>'+ico('coroa-aro',a[0]-48,a[1]-54,96,{fundo:false}));
  s+=ap('ap',5.4,'<path d="M'+(a[0]+56)+' '+(a[1]-20)+' L900 300" fill="none" stroke="'+T+'" stroke-width="5" stroke-dasharray="11 10"/>'+
    rect(900,240,470,170,'#fffdf6',T,4)+sTx(1135,310,'o rei governava',54,700,'middle',T)+sTx(1135,372,'só o seu pedaço',54,700,'middle',T));
  return esq(p,W,H,s,'O reino dividido em dezenas de senhorios com castelinhos; a coroa fica pequena em um dos pedaços',{fundo:false});
};

/* ---------- senhorio: a figura em P&B com as camadas de cor por cima (vista aérea de um senhorio do século XII) ---------- */
const poly=(pts)=>'M'+pts.map(q=>q.join(' ')).join(' L')+'Z';
const SEN={
  castelo:[[152,128],[196,92],[222,52],[312,44],[326,108],[372,114],[416,126],[416,172],[352,194],[290,198],[214,192],[152,164]],
  campoSenhor:[[478,138],[524,124],[600,94],[740,90],[880,102],[880,254],[806,238],[762,200],[706,184],[640,172],[560,154]],
  servil:[[466,378],[560,334],[650,298],[722,284],[880,298],[880,491],[560,491],[420,436],[402,392]],
  horta:[[462,306],[520,290],[560,318],[500,336]],
  casas:[[236,226],[330,206],[466,214],[484,292],[446,352],[330,352],[240,306]],
  pasto:[[0,196],[112,202],[190,226],[196,322],[150,362],[0,366]],
  bosque1:[[0,50],[104,40],[150,70],[134,122],[82,160],[0,172]],
  bosque2:[[314,44],[480,50],[880,40],[880,88],[600,92],[470,102],[330,92]],
  bosque3:[[0,368],[150,334],[204,384],[192,491],[0,491]]
};
C.tipos.senhorio=p=>{
  const src=(window.LAB_IMG||{})['historia-feudo-senhorio']||'';
  const E=(et,d)=>'data-et="'+et+'"'+(d?' style="--a:'+d+'s"':'');
  let s='<defs><pattern id="sl-l" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="22" height="22" fill="#f8e7a0" fill-opacity=".9"/><rect width="10" height="22" fill="#f2c230"/></pattern></defs>';
  s+='<g class="lay" '+E('5,6',0.5)+'><path d="'+poly(SEN.castelo)+'" fill="#ec6f5e" fill-opacity=".62" stroke="#c94d3d" stroke-width="2.6" style="mix-blend-mode:multiply"/><path d="'+poly(SEN.campoSenhor)+'" fill="#ec6f5e" fill-opacity=".6" stroke="#c94d3d" stroke-width="2.6" style="mix-blend-mode:multiply"/></g>';
  s+='<g class="lay" '+E('5,6',2)+'><path d="'+poly(SEN.servil)+'" fill="url(#sl-l)" fill-opacity=".78" stroke="#c94d3d" stroke-width="2.6" style="mix-blend-mode:multiply"/><path d="'+poly(SEN.horta)+'" fill="url(#sl-l)" fill-opacity=".78" stroke="#c94d3d" stroke-width="2.2" style="mix-blend-mode:multiply"/><path d="'+poly(SEN.casas)+'" fill="url(#sl-l)" fill-opacity=".42" stroke="#c94d3d" stroke-width="2" stroke-dasharray="6 4" style="mix-blend-mode:multiply"/></g>';
  s+='<g class="lay" '+E('5',3.6)+'>'+[SEN.pasto,SEN.bosque1,SEN.bosque2,SEN.bosque3].map(q=>'<path d="'+poly(q)+'" fill="#6f9a4a" fill-opacity=".5" stroke="#3f6a2a" stroke-width="2.4" stroke-dasharray="7 5" style="mix-blend-mode:multiply"/>').join('')+'</g>';
  const lbl=(x,y,t,w,et,a)=>'<g class="lay" '+E(et,a)+'><rect x="'+x+'" y="'+y+'" width="'+w+'" height="34" fill="#fffdf6" stroke="'+T+'" stroke-width="1.6"/>'+sTx(x+w/2,y+25,t,22,700,'middle',T)+'</g>';
  s+=lbl(100,10,'manso senhorial',186,'5,6',1.2)+lbl(618,448,'manso servil',150,'5,6',2.8)+lbl(16,204,'manso comunal',176,'5',4.4)+lbl(196,356,'casas e hortas dos servos',296,'5,6',3.4);
  /* círculos do moinho, da igreja e do forno, com o nome da obrigação */
  s+=lbl(548,296,'igreja: dízimo',176,'6',19.2)+lbl(588,150,'moinho: banalidade',206,'6',20.2)+lbl(372,292,'forno: banalidade',200,'6',21.2);
  /* legenda fixa dos três mansos */
  const chip=(x,fill,t,w,et)=>'<g class="lay" '+E(et,0.2)+'><rect x="'+x+'" y="451" width="22" height="22" fill="'+fill+'" stroke="'+T+'" stroke-width="1.6"/><rect x="'+(x+26)+'" y="446" width="'+w+'" height="32" fill="#fffdf6" fill-opacity=".92" stroke="'+T+'" stroke-width="1.4"/>'+sTx(x+26+w/2,470,t,20,700,'middle',T)+'</g>';
  s+=chip(14,'#ec6f5e','senhorial',108,'5,6')+chip(160,'url(#sl-l)','servil',76,'5,6')+chip(274,'#6f9a4a','comunal',96,'5');
  /* camponês que vai do manso servil ao manso senhorial: a corveia */
  const trilha='M556 404 C490 370 424 300 388 220 C372 196 358 184 350 176';
  const fig='<g transform="translate(540 392)"><circle cx="0" cy="-16" r="30" fill="#fffdf6" fill-opacity=".9" stroke="'+T+'" stroke-width="2"/>'+pth('M-9 -6 L9 -6 L12 16 L-12 16Z',WOOL,T,2)+circ(0,-14,6.5,SKIN,T,2)+pth('M-7 -16 C-7 -24 7 -24 7 -16Z','#7a5a3a',T,1.6)+pth('M-5 16 L-6 28 M5 16 L6 28','none',T,3)+pth('M12 -6 L20 -22','none',WOOD,3)+pth('M17 -22 L26 -20','none','#7c8189',3)+'</g>';
  s+='<g class="lay" '+E('6',0.4)+'><path d="'+trilha+'" fill="none" stroke="#c93a2a" stroke-width="3.6" stroke-dasharray="9 8" stroke-linecap="round"/>'+pth('M340 196 L350 174 L368 188','none','#c93a2a',4.4)+fig+
    '<rect x="574" y="326" width="176" height="52" fill="#fffdf6" fill-opacity=".94" stroke="'+T+'" stroke-width="1.6"/>'+sTx(662,348,'corveia: trabalho',19,700,'middle',T)+sTx(662,370,'na terra do senhor',19,700,'middle',T)+'</g>';
  return {cls:'cm-foto m2-sen',html:'<div class="in rasgado" style="--clip:'+C.rasgo(p.id,1.6)+'"><img alt="" src="'+src+'"><svg viewBox="0 0 880 491" preserveAspectRatio="none" role="img" aria-label="'+esc(p.rotulo||'Senhorio medieval visto do alto: castelo, aldeia, campos e bosque, com os três mansos pintados por cima')+'">'+s+'</svg></div>'+
    (p.fita===false?'':'<span class="cm-fita" style="--fx:'+(p.fita&&p.fita.x!=null?p.fita.x:40)+'%;--fg:-4deg"></span>')};
};
(function(){const st=document.createElement('style');
  st.textContent='.m2-sen .in svg{position:absolute;inset:0;width:100%;height:100%;z-index:1}.m2-sen .lay{opacity:0;transition:opacity .9s ease-out var(--a,0s)}.m2-sen .lay.on{opacity:1}@media (prefers-reduced-motion:reduce){.m2-sen .lay{transition:opacity .3s}}';
  document.head.appendChild(st);})();

/* ---------- sistema trienal: três campos que giram entre trigo, legumes e descanso ---------- */
C.tipos.trienal=p=>{
  const W=1100,H=960,oy=70;
  let s=sTx(550,84,'sistema trienal',76,400,'middle',T,SERIF)+tinta('M300 108 H800',3);
  const est=[['trigo','#e6c456'],['legumes','#8fb56a'],['descanso','#dcd2ad']];
  const marcas=(k,x,y)=>{
    let g='';
    if(k===0)for(let i=0;i<7;i++)for(let j=0;j<5;j++){const cx=x+34+i*35,cy=y+40+j*60;g+=pth('M'+cx+' '+(cy+22)+' V'+(cy-6)+' M'+cx+' '+(cy+4)+' L'+(cx-8)+' '+(cy-8)+' M'+cx+' '+(cy+4)+' L'+(cx+8)+' '+(cy-8)+' M'+cx+' '+(cy-6)+' L'+cx+' '+(cy-20),'none','#8a6a1c',3);}
    if(k===1)for(let i=0;i<7;i++)for(let j=0;j<5;j++){const cx=x+34+i*35,cy=y+50+j*60;g+=circ(cx,cy,12,'#4f8a3a',T,2.4)+pth('M'+cx+' '+(cy-12)+' V'+(cy-24),'none','#2f5a22',3);}
    if(k===2)for(let i=0;i<6;i++)for(let j=0;j<4;j++){const cx=x+44+i*38+(j%2?18:0),cy=y+50+j*72;g+=pth('M'+(cx-9)+' '+(cy+8)+' L'+cx+' '+(cy-8)+' L'+(cx+9)+' '+(cy+8),'none','#7a7456',3);}
    return g;
  };
  [0,1,2].forEach(i=>{
    const x=60+i*350,y=170+oy,w=300,h=380,d='-'+(i*3)+'s';
    s+='<g filter="url(#cm-sombra)"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+est[i][1]+'" stroke="'+T+'" stroke-width="5" class="m2cf" style="animation-delay:'+d+'"/></g>'+rect(x,y,w,h,'url(#cm-hv)',null,0,' opacity=".5"');
    [0,1,2].forEach(k=>{s+='<g class="m2k m2k'+k+'" style="animation-delay:'+d+'"'+(k===i?'':' opacity="0"')+'>'+marcas(k,x,y)+rect(x-14,y+h+26,w+28,74,'#fffdf6',T,3.6)+sTx(x+w/2,y+h+80,est[k][0],52,700,'middle',T)+'</g>';});
  });
  /* o rodízio: setas de um campo ao seguinte, e a volta ao início */
  const yt=170+oy-14;
  s+=pth('M210 '+yt+' C260 '+(yt-62)+' 510 '+(yt-62)+' 556 '+(yt-6),'none',T,6)+ponta(560,yt-2,Math.PI/2+.5,T,6,26);
  s+=pth('M560 '+yt+' C610 '+(yt-62)+' 860 '+(yt-62)+' 906 '+(yt-6),'none',T,6)+ponta(910,yt-2,Math.PI/2+.5,T,6,26);
  s+=pth('M910 '+(yt-18)+' C840 '+(yt-120)+' 280 '+(yt-120)+' 214 '+(yt-18),'none','#c93a2a',5,' stroke-dasharray="12 12"')+ponta(212,yt-8,Math.PI/2-.6,'#c93a2a',5,24);
  s+=sTx(550,822,'cada campo gira: um terço sempre em descanso',44,700,'middle','#2f2e2a');
  /* antes: sistema bienal, metade parada */
  s+=sTx(550,892,'antes: dois campos, e metade parada',44,700,'middle','#4a463e')+
     rect(380,908,150,36,'#e6c456',T,3.4)+rect(550,908,150,36,'#dcd2ad',T,3.4);
  const css='<style>@media (prefers-reduced-motion:no-preference){.m2cf{animation:m2-cor 9s steps(1,end) infinite}.m2k{animation:m2-k 9s steps(1,end) infinite}.m2k1{animation-name:m2-k1}.m2k2{animation-name:m2-k2}'+
    '@keyframes m2-cor{0%{fill:#e6c456}33.4%{fill:#8fb56a}66.7%{fill:#dcd2ad}}'+
    '@keyframes m2-k{0%{opacity:1}33.4%{opacity:0}66.7%{opacity:0}}@keyframes m2-k1{0%{opacity:0}33.4%{opacity:1}66.7%{opacity:0}}@keyframes m2-k2{0%{opacity:0}33.4%{opacity:0}66.7%{opacity:1}}}</style>';
  return esq(p,W,H,css+s,'Três campos que giram entre trigo, legumes e descanso, ano após ano, com setas de rodízio; embaixo, o sistema antigo, com metade parada');
};

/* ---------- igrejas: românica e gótica ---------- */
const pedra=(x,y,w,h,f)=>rect(x,y,w,h,f||'#e1dacb',T,4)+rect(x,y,w,h,'url(#cm-h3)',null,0,' opacity=".13"');
const arco=(cx,y0,w,h,f)=>'<path d="M'+(cx-w/2)+' '+(y0+h)+' V'+(y0+w/2)+' A'+(w/2)+' '+(w/2)+' 0 0 1 '+(cx+w/2)+' '+(y0+w/2)+' V'+(y0+h)+'Z" fill="'+(f||'#2b2a27')+'" stroke="'+T+'" stroke-width="3"/>';
C.tipos.romanica=p=>{
  const W=760,H=560;let s='';
  s+='<ellipse cx="380" cy="508" rx="360" ry="22" fill="#d8cfb4" opacity=".7"/>';
  s+=pedra(80,170,160,330)+pth('M80 170 H240 L196 128 H124Z','#8f8c82',T,4);
  s+=pedra(240,260,430,240)+pth('M232 264 L330 214 H580 L678 264Z','#8f8c82',T,4)+hach('M232 264 L330 214 H580 L678 264Z','cm-h3',.2);
  [[110,210],[190,210],[110,300],[190,300]].forEach(q=>{s+=arco(q[0],q[1],26,48);});
  s+=arco(160,408,124,92,'#e1dacb')+arco(160,416,100,84,'#cfc8b6')+arco(160,424,76,76,'#2b2a27')+pth('M98 408 A62 62 0 0 1 222 408','none',T,5);
  [300,370,440,510,580,640].forEach(x=>{s+=arco(x,326,22,44);});
  s+=hach('M600 262 L670 264 V500 H640Z','cm-h1',.35);
  /* friso de arcos cegos sob o beiral */
  for(let x=262;x<660;x+=36)s+=pth('M'+x+' 278 A18 18 0 0 1 '+(x+36)+' 278','none',T,2.6);
  s+=tinta('M80 330 H240 M240 430 H670 M80 400 H240',1.6);
  [[250,220]].forEach(q=>{});
  s+=hach('M200 170 H240 V500 H212Z','cm-h1',.4);
  s+=pth('M124 128 L160 96 L196 128','none',T,4)+pth('M160 96 V66 M148 78 H172','none',T,5);
  return esq(p,W,H,s,'Igreja românica: baixa, pesada, de paredes grossas e arcos redondos, parecida com uma fortaleza',{fundo:false});
};
C.tipos.gotica=p=>{
  const W=700,H=900;let s='';
  s+='<ellipse cx="350" cy="860" rx="320" ry="22" fill="#d8cfb4" opacity=".7"/>';
  const ponte=(cx,y0,w,h,f)=>'<path d="M'+(cx-w/2)+' '+(y0+h)+' V'+(y0+w*.7)+' Q'+(cx-w/2)+' '+(y0+w*.2)+' '+cx+' '+y0+' Q'+(cx+w/2)+' '+(y0+w*.2)+' '+(cx+w/2)+' '+(y0+w*.7)+' V'+(y0+h)+'Z" fill="'+(f||'#2b2a27')+'" stroke="'+T+'" stroke-width="3.4"/>';
  /* contrafortes voadores */
  s+=pedra(10,560,34,280)+pedra(656,560,34,280)+pth('M44 570 Q80 540 112 470 M44 650 Q80 620 112 560 M656 570 Q620 540 588 470 M656 650 Q620 620 588 560','none',T,13)+pth('M44 570 Q80 540 112 470 M44 650 Q80 620 112 560 M656 570 Q620 540 588 470 M656 650 Q620 620 588 560','none','#e1dacb',6);
  s+=pedra(110,330,150,510)+pedra(440,330,150,510)+pedra(250,420,200,420);
  s+=pth('M110 330 L185 60 L260 330Z','#b9b3a4',T,4)+pth('M440 330 L515 60 L590 330Z','#b9b3a4',T,4)+hach('M222 60 L260 330 H215Z','cm-h1',.4)+hach('M552 60 L590 330 H545Z','cm-h1',.4);
  s+=pth('M185 60 V28 M175 40 H195 M515 60 V28 M505 40 H525','none',T,4);
  s+=pth('M250 420 L350 300 L450 420Z','#cfc8b6',T,4)+pth('M350 300 V276 M340 288 H360','none',T,4);
  [[185,130],[185,220],[515,130],[515,220]].forEach(q=>{s+=ponte(q[0],q[1],36,70);});
  /* rosácea: o vitral é a única cor da cena */
  const rc=[350,395,'#e0a82e'],cores=['#6d1d2a','#23406b','#a87a24','#3b2a4a','#6d1d2a','#23406b','#a87a24','#1f4a45','#6d1d2a','#23406b','#a87a24','#3b2a4a'];
  s+=circ(350,395,82,'#fffdf6',T,5);
  for(let i=0;i<12;i++){const a0=i*Math.PI/6,a1=(i+1)*Math.PI/6,m=(a0+a1)/2,R1=(i%2?70:62);s+=pth('M350 395 L'+(350+Math.cos(a0)*R1).toFixed(1)+' '+(395+Math.sin(a0)*R1).toFixed(1)+' Q'+(350+Math.cos(m)*(R1+16)).toFixed(1)+' '+(395+Math.sin(m)*(R1+16)).toFixed(1)+' '+(350+Math.cos(a1)*R1).toFixed(1)+' '+(395+Math.sin(a1)*R1).toFixed(1)+'Z',cores[i],T,2.6);}
  s+=circ(350,395,22,'#fffdf6',T,3.4)+circ(350,395,82,'none',T,5);
  /* três portais em arco pontudo */
  [[290,60,170],[350,92,230],[410,60,170]].forEach((q,i)=>{s+=ponte(q[0],840-q[2],q[1],q[2],'#3b342b');});
  s+=ponte(350,610,92,230,'#2b2a27');
  s+=pth('M270 840 V710 Q270 650 350 610 Q430 650 430 710 V840','none',T,5)+pth('M250 840 V716 Q250 630 350 584 Q450 630 450 716 V840','none',T,4);
  s+=hach('M410 700 V840 H450 V716Z','cm-h1',.4)+tinta('M110 520 H260 M440 520 H590 M110 640 H260 M440 640 H590 M250 520 H450',1.6);
  return esq(p,W,H,s,'Igreja gótica: alta, de arcos pontudos, com uma rosácea de vitral colorido',{fundo:false});
};

/* ---------- xis: dois traços vermelhos de pincel, para riscar a coroa do excomungado ---------- */
C.tipos.xis=p=>esq(p,320,320,ap('ap',0,'<path d="M40 50 C110 110 200 200 280 280" fill="none" stroke="#fff" stroke-width="44" stroke-linecap="round"/><path d="M40 50 C110 110 200 200 280 280" fill="none" stroke="#c93a2a" stroke-width="30" stroke-linecap="round"/><path d="M285 44 C210 110 130 200 44 282" fill="none" stroke="#fff" stroke-width="44" stroke-linecap="round"/><path d="M285 44 C210 110 130 200 44 282" fill="none" stroke="#c93a2a" stroke-width="30" stroke-linecap="round"/>'),'Dois traços vermelhos riscam a coroa',{fundo:false});

/* ---------- fita do tempo do feudalismo (900 a 1600), em escala ---------- */
C.tipos.fitafeudal=p=>{
  const W=2700,H=620,x0=70,k=3.2,X=a=>Math.round(x0+(a-800)*k);let s='';
  s+='<g filter="url(#cm-sombra)"><rect x="0" y="0" width="'+W+'" height="'+H+'" fill="#fffdf6" stroke="'+T+'" stroke-width="5"/></g>'+rect(0,0,W,H,'url(#cm-hh)',null,0,' opacity=".14"');
  s+=sTx(60,56,'o feudalismo no tempo, de 800 a 1600',44,700,'start',T);
  const ey=330;
  s+=pth('M'+X(800)+' '+ey+' H'+X(1600),'none',T,6);
  for(let a=800;a<=1600;a+=100){s+=pth('M'+X(a)+' '+(ey-14)+' V'+(ey+14),'none',T,5)+sTx(X(a),ey+54,String(a),34,700,'middle','#2f2e2a');}
  const barra=(a,b,row,cor,t,et,tt)=>{
    const y=ey-58-row*68,w=X(b)-X(a);const dentro=t.length*20<w-20;
    return '<g class="mk" data-et="'+et+'"><rect x="'+X(a)+'" y="'+y+'" width="'+w+'" height="54" fill="'+cor+'" stroke="'+T+'" stroke-width="4"/>'+
      (dentro?sTx(X(a)+w/2,y+38,t,34,700,'middle',T):sTx(X(b)+12,y+38,t,34,700,'start',T))+'</g>';
  };
  s+=barra(801,1000,0,'#ec8a7a','séculos IX e X: formação','0')+barra(1001,1100,0,'#ffd83d','século XI','8')+barra(1401,1600,0,'#d8d1c0','séculos XV e XVI: fim','0,8');
  s+=barra(901,1200,1,'#e3dcc4','românico, séculos X a XII','8')+barra(1150,1500,2,'#ffd83d','gótico: a partir do século XII','8');
  s+=barra(1225,1274,3,'#c4d6d9','Tomás de Aquino','8');
  /* marcos pontuais abaixo do eixo */
  const pino=(a,t,et,row)=>{const y=ey+80+row*58;return '<g class="mk" data-et="'+et+'">'+pth('M'+X(a)+' '+(ey+8)+' V'+(y-34),'none',T,3.6)+circ(X(a),ey+8,10,'#d63a22',T,3)+sTx(X(a),y,t,34,700,'middle',T)+'</g>';};
  s+=pino(909,'909: concílio de Trosly','0',1)+pino(1027,'cerca de 1025 a 1030: Adalberão','4',2);
  return {cls:'cm-m2 f',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Fita do tempo do feudalismo, de 800 a 1600')+'">'+s+'</svg>'};
};
(function(){const st=document.createElement('style');
  st.textContent='.cm-m2.f .mk{opacity:.6;transition:opacity .5s}.cm-m2.f .mk.on{opacity:1}.cm-m2.f .mk.on rect{stroke-width:7}.cm-m2.f .mk.on text{paint-order:stroke;stroke:#ffd83d;stroke-width:9px;stroke-linejoin:round}';
  document.head.appendChild(st);})();

})();
