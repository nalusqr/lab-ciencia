/* Recortes do tópico 3 do módulo 2 (Islamismo), desenhados em código. Nenhuma figura de IA.
   Carregue DEPOIS de colagem.js e recortes.js. Não altera o motor: registra ícones novos em C.icone e tipos novos em C.tipos.
   Regras religiosas: o profeta nunca é representado (nem em silhueta); sem ícone de crescente; sem versos árabes reais
   (a escrita que aparece é abstrata e ilegível, só ritmo de traços); só padrões geométricos e tom respeitoso.
   Ícones (use {tipo:'icone', nome:'...'}): caaba, camelo, hira, livro, tapete, jejum, moedas, balao, coracao, escudo, dhow.
   Tipos próprios: bil3 (nota amarela com ícone), etq3 e nota3 (etiqueta e nota com tamanho de letra em px da mesa), caligrafia (linha abstrata com marca-texto),
     calend (folhinha que vira), abraao (três religiões ligadas a Abraão), pilares (cinco colunas e o telhado), jihad (interna, externa e a tradução riscada),
     califas (árvore de sunitas e xiitas), numeros (algarismos antigos e de hoje), fitaislam (fita do tempo), viajantes (camelo e barco sobre o mapa), palavraal (palavras de origem árabe). */
(function(){
'use strict';
const C=window.Colagem;
if(!C||!C.tipos||!C.icone)throw new Error('Carregue colagem.js e recortes.js antes de recortes-m02c.js');
const T='#1b1a17',P='#f6f1e4',esc=C.esc;
let seq=0;
const pth=(d,f,s,w,x)=>'<path d="'+d+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+' stroke-linecap="round" stroke-linejoin="round"'+(x||'')+'/>';
const tinta=(d,w)=>pth(d,'none',T,w||2);
const circ=(cx,cy,r,f,s,w)=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+'/>';
const rect=(x,y,w,h,f,s,sw,x2)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(sw||3)+'"':'')+' stroke-linejoin="round"'+(x2||'')+'/>';
const hach=(d,pad,op)=>'<path d="'+d+'" fill="url(#'+(pad||'cm-h1')+')" opacity="'+(op||.6)+'"/>';
const sTx=(x,y,t,sz,w,anc,fill,fam,extra)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+(anc||'middle')+'"'+(extra||'')+' style="font:'+(w||700)+' '+sz+'px '+(fam||'var(--sans,sans-serif)')+';fill:'+(fill||T)+'">'+esc(t)+'</text>';
const SERIF='var(--serif,Georgia,serif)';
const SAND='#e8c27a',GOLD='#e0b43a',STONE='#d8d1c0',RED='#c93a2a',GREEN='#6f9a4a',WOOD='#8a5a33',WOOL='#c9a36a',SKIN='#f1d9b8',MAR='#2b2a27';

/* ---------- CSS da página: aparece uma vez ---------- */
(function(){
  const s=document.createElement('style');
  s.textContent=
  '.cm-m3{filter:none}.cm-m3 svg{display:block;width:100%;height:100%;overflow:visible}'+
  '.cm-m3.m3s{filter:drop-shadow(0 6px 8px rgba(0,0,0,.22))}'+
  '.m3-bil{background:#ffd83d;box-shadow:0 3px 5px rgba(0,0,0,.25);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px 22px 26px;text-align:center;font:700 52px/1.14 var(--sans);color:var(--tinta);filter:none}'+
  '.m3-bil .ic{width:70%;flex:none}.m3-bil .ic svg{display:block;width:100%;height:auto}.m3-bil span.t{margin-top:10px}.m3-bil span.s{font:600 .72em/1.15 var(--sans);margin-top:6px}'+
  '.m3-bil .cm-fita{top:-16px}'+
  '.m3-al{display:flex;align-items:center;justify-content:center;background:#fff;box-shadow:0 3px 6px rgba(0,0,0,.28);font:700 66px/1 var(--sans);color:var(--tinta);filter:none;z-index:6}'+
  '.m3-al i{font-style:normal;background:linear-gradient(transparent 20%,#ffd83d 20% 88%,transparent 88%);padding:0 .04em}'+
  '.m3-cal{filter:none;perspective:1600px}.m3-cal .fol{position:absolute;left:0;right:0;top:0;bottom:0;background:#fffdf6;border:5px solid #1b1a17;box-shadow:0 6px 10px rgba(0,0,0,.25);text-align:center;transform-origin:50% 0;backface-visibility:hidden}'+
  '.m3-cal .top{position:absolute;left:-5px;right:-5px;top:-5px;height:150px;background:#c93a2a;border:5px solid #1b1a17;color:#fff;font:700 62px/150px var(--sans)}'+
  '.m3-cal .num{position:absolute;left:0;right:0;top:230px;font:400 250px/1 var(--serif);color:#1b1a17}'+
  '.m3-cal .leg{position:absolute;left:0;right:0;top:560px;font:700 52px/1.15 var(--sans);color:#2f2e2a;padding:0 30px}'+
  '.m3-cal .luas{position:absolute;left:0;right:0;bottom:44px;display:flex;justify-content:center;gap:18px;padding:0 40px}.m3-cal .luas i{width:42px;height:42px;border-radius:50%;background:#f1e3b4;border:4px solid #1b1a17}'+
  '.m3-cal .rod{position:absolute;top:-34px;width:26px;height:64px;border-radius:13px;background:#6b6358;border:4px solid #1b1a17;z-index:4}'+
  '.cm-m3 .vj{opacity:0;transition:opacity .5s}.cm-m3 .vj.on{opacity:1}'+
  '@media (prefers-reduced-motion:no-preference){'+
    '.cm-m3 .ap{opacity:0}.cm-m3:not(.fora) .ap{animation:m3-t .8s ease-out calc(var(--a,0s) + var(--i,0s)) forwards}'+
    '.cm-m3 .ar{stroke-dasharray:1;stroke-dashoffset:1}.cm-m3:not(.fora) .ar{animation:m3-d 1.1s ease-out calc(var(--a,0s) + var(--i,0s)) forwards}'+
    '.cm-m3 .cai{opacity:0}.cm-m3:not(.fora) .cai{animation:m3-c .8s cubic-bezier(.2,.9,.3,1.15) calc(var(--a,0s) + var(--i,0s)) forwards}'+
    '.cm-m3 .sobe{opacity:0;transform-box:fill-box;transform-origin:50% 100%}.cm-m3:not(.fora) .sobe{animation:m3-s 1.1s cubic-bezier(.2,.9,.3,1.05) calc(var(--a,0s) + var(--i,0s)) forwards}'+
    '.cm-m3 .mk3{transform-box:fill-box;transform-origin:0 50%;transform:scaleX(0)}.cm-m3:not(.fora) .mk3{animation:m3-m .9s ease-out calc(var(--a,0s) + var(--i,0s)) forwards}'+
    '.cm-m3 .vela{opacity:0}.cm-m3:not(.fora) .vela{animation:m3-v 1.1s ease-in-out calc(var(--a,0s) + var(--i,0s)) forwards}'+
    '.cm-m3 .velb{opacity:1}.cm-m3:not(.fora) .velb{animation:m3-vb 1.1s ease-in-out calc(var(--a,0s) + var(--i,0s)) forwards}'+
    '.m3-cal:not(.fora) .f1{animation:m3-vira 1.2s ease-in-out var(--v1,1.6s) forwards}.m3-cal:not(.fora) .f2{animation:m3-vira 1.2s ease-in-out var(--v2,4.2s) forwards}'+
    '@keyframes m3-t{to{opacity:1;fill-opacity:1}}@keyframes m3-d{to{stroke-dashoffset:0}}'+
    '@keyframes m3-c{from{opacity:0;transform:translateY(-60px)}to{opacity:1;transform:none}}'+
    '@keyframes m3-s{from{opacity:0;transform:scaleY(.05)}to{opacity:1;transform:none}}'+
    '@keyframes m3-m{to{transform:scaleX(1)}}'+
    '@keyframes m3-v{from{opacity:0}to{opacity:1}}@keyframes m3-vb{from{opacity:1}to{opacity:0}}'+
    '@keyframes m3-vira{to{transform:rotateX(-100deg);opacity:0}}'+
  '}'+
  '@media (prefers-reduced-motion:reduce){.m3-cal .f1,.m3-cal .f2{display:none}.cm-m3 .mk3{transform:none}.cm-m3 .velb{opacity:0}}';
  document.head.appendChild(s);
})();

/* ---------- escrita abstrata: ritmo de traços que não forma nenhuma palavra ---------- */
function escrita(seed,x0,x1,y,amp,sw,cor){
  const r=C.rng('esc'+seed);let x=x0,d='M'+x0+' '+y,pts='';const a=amp||14;
  while(x<x1-20){
    const k=r(),w=14+r()*20;
    if(k<.22){d+=' L'+(x+w*.4).toFixed(1)+' '+y+' L'+(x+w*.4).toFixed(1)+' '+(y-a*(1.6+r())).toFixed(1)+' M'+(x+w*.4).toFixed(1)+' '+y;}
    else if(k<.5){d+=' C'+(x+w*.2).toFixed(1)+' '+(y-a*1.4).toFixed(1)+' '+(x+w*.8).toFixed(1)+' '+(y-a*1.4).toFixed(1)+' '+(x+w).toFixed(1)+' '+y;}
    else if(k<.72){d+=' C'+(x+w*.3).toFixed(1)+' '+(y+a*1.2).toFixed(1)+' '+(x+w*.7).toFixed(1)+' '+(y+a*1.2).toFixed(1)+' '+(x+w).toFixed(1)+' '+y;}
    else if(k<.88){d+=' L'+(x+w).toFixed(1)+' '+y+' M'+(x+w*.3).toFixed(1)+' '+y+' C'+(x+w*.3).toFixed(1)+' '+(y+a*1.6).toFixed(1)+' '+(x+w*.6).toFixed(1)+' '+(y+a*1.6).toFixed(1)+' '+(x+w*.7).toFixed(1)+' '+(y+a*.4).toFixed(1)+' M'+(x+w).toFixed(1)+' '+y;}
    else {d+=' L'+(x+w).toFixed(1)+' '+y;}
    if(r()<.34){const px=x+w*(.2+r()*.6),py=r()<.5?y-a*(2+r()):y+a*(1.8+r());pts+='<circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="'+(sw*.62).toFixed(1)+'" fill="'+(cor||T)+'"/>';}
    x+=w;
  }
  return '<path d="'+d+'" fill="none" stroke="'+(cor||T)+'" stroke-width="'+(sw||3)+'" stroke-linecap="round" stroke-linejoin="round"/>'+pts;
}

/* ---------- ícones: mesmo formato de recortes.js (arte em 0..200, fundo de papel colorido, margem branca) ---------- */
const IO={},ART={};
function reg(nome,fundo,rotulo,art){IO[nome]={fundo:fundo,nome:rotulo,art:art};ART[nome]=art;if(C.ICONES&&C.ICONES.indexOf(nome)<0)C.ICONES.push(nome);}
function fundoO(cor,seed){
  const r=C.rng('fundo'+seed),pts=[];
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2,k=84+(r()-.5)*7;pts.push([104+Math.cos(a)*k,106+Math.sin(a)*k]);}
  return '<path d="'+C.suave(pts,true)+'" fill="'+C.cor(cor)+'" filter="url(#cm-rasga)"/>';
}
function iconeO(nome,o){
  o=o||{};const ic=IO[nome],u='mc'+(seq++)+'-',fd=o.fundo===false?'':fundoO(o.fundo||ic.fundo,nome);
  return '<svg viewBox="-14 -14 228 228" role="img" aria-label="'+esc(o.rotulo||ic.nome)+'">'+fd+
    '<g filter="url(#cm-sombra)"><g class="cm-sil">'+ic.art('s'+u)+'</g></g>'+ic.art(u)+'</svg>';
}
const icone0=C.icone;
C.icone=function(nome,o){return IO[nome]?iconeO(nome,o):icone0(nome,o);};

/* Caaba: cubo escuro e liso, com uma faixa dourada lisa (sem escrita) */
reg('caaba','#e9dcb4','Caaba, santuário em forma de cubo',u=>{
  let s=pth('M44 80 L116 80 L116 168 L44 168Z',MAR,T,3.4)+pth('M116 80 L156 62 L156 150 L116 168Z','#1c1b19',T,3.4)+pth('M44 80 L84 62 L156 62 L116 80Z','#4d4a43',T,3.4);
  s+=pth('M44 98 L116 98 L116 112 L44 112Z',GOLD,T,2.4)+pth('M116 98 L156 80 L156 94 L116 112Z','#b98f26',T,2.4);
  s+=pth('M92 130 H108 V168 H92Z','#6b4f1d',GOLD,3);
  s+=hach('M116 80 L156 62 L156 150 L116 168Z','cm-h1',.35);
  s+=pth('M30 170 H176','none',T,3);
  return s;});

/* camelo (dromedário) de perfil */
reg('camelo','amarelo','Camelo',u=>{
  let s=pth('M62 124 L60 172 M76 124 L78 172 M122 126 L124 172 M136 124 L140 172','none',T,12)+pth('M62 124 L60 172 M76 124 L78 172 M122 126 L124 172 M136 124 L140 172','none','#b98a4e',7);
  s+=pth('M34 98 C36 92 50 90 64 92 C72 92 76 86 80 76 C84 62 90 58 96 60 C104 64 106 80 116 90 C124 94 130 94 136 88 C144 80 146 64 152 52 C156 46 168 46 174 54 C178 60 176 66 168 68 C162 70 160 74 158 80 C154 92 150 102 146 112 C144 120 140 126 130 128 L72 128 C54 128 40 122 36 110Z','#c9a36a',T,3.4);
  s+=hach('M116 96 C130 100 144 96 150 84 L146 112 C144 120 140 126 130 128 L100 128 C114 124 118 110 116 96Z','cm-h1',.45);
  s+=circ(162,56,2.6,T)+pth('M170 62 H176','none',T,2.4)+pth('M94 66 C98 76 102 84 108 90','none',T,2);
  s+=pth('M36 100 C28 106 28 120 34 130','none',T,4);
  s+=pth('M96 94 C100 104 98 114 90 118 L68 120 C60 108 68 98 80 96Z','#d63a22',T,2.6)+pth('M70 106 H92','none',T,2);
  return s;});

/* monte Hira: montanha em traço, com a entrada escura de uma gruta alta na encosta */
reg('hira','#dccfae','Monte Hira, perto de Meca',u=>{
  let s=pth('M14 166 L70 62 L96 100 L116 68 L188 166Z','#d9cba6',T,3.4);
  s+=hach('M96 100 L116 68 L188 166 L128 166 L108 118Z','cm-h1',.5)+hach('M70 62 L96 100 L84 166 L56 166Z','cm-hh',.35);
  s+=pth('M70 62 L58 84 L66 92 L76 82Z','#fffdf6',T,2.4)+pth('M116 68 L106 86 L114 92 L124 84Z','#fffdf6',T,2.4);
  s+=pth('M58 120 C58 104 78 104 78 120 L78 132 L58 132Z',MAR,T,2.6);
  s+=pth('M96 150 L110 134 L122 150 M142 138 L152 150','none',T,2.4)+pth('M14 170 H188','none',T,3.4);
  [[30,180],[54,184],[88,182],[132,184],[160,182],[178,184]].forEach(q=>{s+=circ(q[0],q[1],1.8,T);});
  return s;});

/* livro aberto, com linhas de escrita abstrata (ilegível) */
reg('livro','#e9dcb4','Livro aberto',u=>{
  let s=pth('M18 62 C54 52 88 56 100 70 L100 164 C88 150 54 146 18 156Z','#fffdf6',T,3.4)+pth('M182 62 C146 52 112 56 100 70 L100 164 C112 150 146 146 182 156Z','#fbf5e3',T,3.4);
  s+=pth('M14 66 L14 162 C52 152 88 156 100 170 C112 156 148 152 186 162 L186 66','none',T,3.4);
  s+=pth('M18 62 C54 52 88 56 100 70 L100 74 C88 60 54 56 18 66Z','#b98a4e');
  for(let i=0;i<5;i++){s+=escrita('l'+i,28,92,86+i*14,3.6,2.1,'#3d3a33').replace(/<path/,'<path transform="rotate('+(-2+i*.2)+' 60 110)"');}
  for(let i=0;i<5;i++){s+=escrita('r'+i,110,174,86+i*14,3.6,2.1,'#3d3a33').replace(/<path/,'<path transform="rotate('+(2-i*.2)+' 140 110)"');}
  s+=pth('M100 70 V170','none',T,2.4)+hach('M100 70 C112 56 146 52 182 62 L182 72 C146 62 112 66 100 80Z','cm-h1',.25);
  s+=pth('M94 150 L94 190 L100 184 L106 190 L106 152','#c93a2a',T,2.4);
  return s;});

/* tapete de oração: arco, padrão geométrico e franjas; a seta mostra a direção de Meca */
reg('tapete','#d8c9a0','Tapete de oração com seta para Meca',u=>{
  let s=pth('M54 60 H146 V160 H54Z','#8d3b32',T,3.4)+pth('M64 70 H136 V150 H64Z','none','#f1d9b8',3);
  s+=pth('M72 148 V108 C72 86 100 76 100 76 C100 76 128 86 128 108 V148Z','#3f6d73',T,2.8);
  [[100,102],[100,124]].forEach(q=>{s+=pth('M'+q[0]+' '+(q[1]-9)+' L'+(q[0]+9)+' '+q[1]+' L'+q[0]+' '+(q[1]+9)+' L'+(q[0]-9)+' '+q[1]+'Z','#e8c27a',T,1.8);});
  s+=hach('M54 60 H146 V160 H54Z','cm-hh',.25);
  for(let i=0;i<9;i++){s+=tinta('M'+(58+i*10.5)+' 160 V170 M'+(58+i*10.5)+' 60 V50',2.2);}
  s+=pth('M100 40 V8','none','#fff',10)+pth('M100 40 V8','none','#e8572a',6)+pth('M88 20 L100 6 L112 20','none','#e8572a',6);
  return s;});

/* jejum: prato vazio e o arco do sol do nascer ao pôr (sem crescente) */
reg('jejum','#cfe0d2','Prato vazio e o arco do sol',u=>{
  let s=pth('M24 118 C40 38 160 38 176 118','none',T,3,' stroke-dasharray="3 8"');
  s+=circ(100,60,17,'#ffd83d',T,3)+pth('M100 30 V22 M70 40 L64 34 M130 40 L136 34 M52 62 H44 M148 62 H156','none',T,3);
  s+=circ(26,118,8,'#ffd83d',T,2.6)+circ(174,118,8,'#e8572a',T,2.6);
  s+='<ellipse cx="100" cy="152" rx="60" ry="22" fill="#fffdf6" stroke="'+T+'" stroke-width="3.4"/><ellipse cx="100" cy="150" rx="40" ry="13" fill="#efe7d1" stroke="'+T+'" stroke-width="2.4"/>';
  s+=hach('M120 160 C150 160 158 148 158 140 C150 166 118 172 100 172Z','cm-h1',.4);
  return s;});

/* moedas numa mão aberta */
reg('moedas','amarelo','Moedas numa mão aberta',u=>{
  let s='';
  [[96,100],[122,92],[110,70]].forEach((q,i)=>{s+='<ellipse cx="'+q[0]+'" cy="'+q[1]+'" rx="26" ry="9" fill="'+GOLD+'" stroke="'+T+'" stroke-width="3"/><path d="M'+(q[0]-26)+' '+q[1]+' V'+(q[1]+9)+' C'+(q[0]-26)+' '+(q[1]+19)+' '+(q[0]+26)+' '+(q[1]+19)+' '+(q[0]+26)+' '+(q[1]+9)+' V'+q[1]+'" fill="#b98f26" stroke="'+T+'" stroke-width="3"/><ellipse cx="'+q[0]+'" cy="'+q[1]+'" rx="26" ry="9" fill="'+GOLD+'" stroke="'+T+'" stroke-width="3"/><ellipse cx="'+q[0]+'" cy="'+q[1]+'" rx="14" ry="4.6" fill="none" stroke="'+T+'" stroke-width="2"/>';});
  s+=pth('M24 132 C48 122 70 130 90 136 L142 124 C156 122 162 136 150 142 L112 160 C92 168 62 170 44 162 L24 152Z',SKIN,T,3.4);
  s+=pth('M100 138 L146 130','none',T,2.4)+pth('M40 150 C60 156 84 156 104 150','none',T,2.2)+hach('M60 160 C84 168 108 162 128 152 L112 160 C92 168 62 170 44 162Z','cm-h1',.4);
  return s;});

/* balão de fala com linha de escrita abstrata */
reg('balao','amarelo','Balão com uma linha de escrita',u=>{
  let s=pth('M26 40 H174 V132 H108 L72 168 L76 132 H26Z','#fffdf6',T,3.6);
  s+=escrita('b1',44,156,72,6,3.4)+escrita('b2',44,156,104,6,3.4,'#3d3a33');
  s+=pth('M44 90 H156','none','#ffd83d',10,' stroke-opacity=".6"');
  return s;});

reg('coracao','#f2c9c0','Coração',u=>{
  let s=pth('M100 164 C40 120 26 84 44 58 C62 36 92 44 100 70 C108 44 138 36 156 58 C174 84 160 120 100 164Z','#d9503f',T,3.6);
  s+=hach('M124 62 C150 56 166 84 150 112 C140 132 120 148 100 164 C128 130 140 98 124 62Z','cm-h1',.45)+pth('M62 62 C70 54 82 54 88 62','none','#fff',6,' stroke-opacity=".8"');
  return s;});

reg('escudo','#c4d6d9','Escudo redondo liso',u=>{
  let s=circ(100,100,74,'#6f8f9e',T,3.6)+circ(100,100,56,'#86a3b0',T,2.4)+circ(100,100,15,'#d8c58a',T,2.6);
  s+=hach('M100 28 A72 72 0 0 1 100 172 A52 52 0 0 0 100 48Z','cm-h1',.3);
  return s;});

/* dhow: barco de vela triangular do Índico */
reg('dhow','#c4d6d9','Barco de vela triangular',u=>{
  let s=pth('M24 126 H176 C168 150 148 164 126 166 H64 C46 160 30 146 24 126Z',WOOD,T,3.4)+pth('M30 138 H170','none',T,2.2);
  s+=pth('M96 126 V22','none',T,6)+pth('M96 126 V22','none',WOOD,3);
  s+=pth('M100 26 C128 56 150 92 168 122 H100Z','#fff8e4',T,3.2)+pth('M96 40 C86 70 66 98 44 118 H96Z','#f0e2c2',T,3.2);
  s+=pth('M112 60 C122 76 134 98 146 114','none',T,1.8)+hach('M100 26 C128 56 150 92 168 122 H140 C128 90 114 56 100 26Z','cm-h1',.3);
  s+=pth('M10 176 C34 168 50 184 76 176 C100 168 118 184 144 176 C164 170 176 180 192 174','none','#1f5fae',3.6);
  return s;});

/* ---------- notas e etiquetas com tamanho de letra em px da mesa ---------- */
C.tipos.nota3=p=>({cls:'cm-nota',style:'font-size:'+(p.tam||44)+'px;line-height:1.22;padding:14px 20px;',html:esc(p.texto)});
C.tipos.etq3=p=>({cls:'cm-etq',style:'font-size:'+(p.tam||44)+'px;line-height:1.2;padding:14px 22px!important;',html:'<span class="cm-fita" style="--fx:'+(p.fita!=null?p.fita:12)+'%;--fg:-5deg"></span><span>'+esc(p.texto)+'</span>'});
C.tipos.bil3=p=>({cls:'m3-bil',style:(p.tam?'font-size:'+p.tam+'px;':''),html:
  '<span class="cm-fita" style="--fx:'+(p.fita!=null?p.fita:38)+'%;--fg:'+(p.fg!=null?p.fg:-4)+'deg"></span>'+
  '<div class="ic">'+C.icone(p.icone,{fundo:p.fundo,rotulo:p.rotuloIcone||p.texto})+'</div><span class="t">'+esc(p.texto)+'</span>'+(p.sub?'<span class="s">'+esc(p.sub)+'</span>':'')});

/* palavra de origem árabe, com a parte do artigo árabe em marca-texto: parte = texto que vai em marca */
C.tipos.palavraal=p=>({cls:'m3-al',style:'--a:'+(p.atrasoMarca!=null?p.atrasoMarca:.4)+'s;'+(p.tam?'font-size:'+p.tam+'px;':''),
  html:'<span><i>'+esc(p.parte)+'</i>'+esc(p.resto)+'</span>'});

/* ---------- caligrafia: linha abstrata, ilegível, com marca-texto dourado que passa ---------- */
C.tipos.caligrafia=p=>{
  const W=p.w,H=p.h;let s='';
  s+='<rect class="mk3" style="--a:'+(p.marcaEm!=null?p.marcaEm:2.4)+'s" x="14" y="'+(H*.5-34)+'" width="'+(W-28)+'" height="68" rx="12" fill="#e0b43a" fill-opacity=".62"/>';
  s+='<g class="ap" style="--a:.3s">'+escrita('cal'+p.id,26,W-26,H*.5+6,16,6.2)+'</g>';
  s+=pth('M24 '+(H*.5+54)+' H'+(W-24),'none',T,2.4,' stroke-dasharray="4 10" stroke-opacity=".5"');
  return {cls:'cm-m3',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Linha de escrita abstrata, sem texto legível')+'">'+s+'</svg>'};
};

/* ---------- calendário: folhas que viram (621, 622, ano 1) ---------- */
C.tipos.calend=p=>{
  let luas='';for(let i=0;i<12;i++)luas+='<i></i>';
  const fol=(cls,top,num,leg,z)=>'<div class="fol '+cls+'" style="z-index:'+z+'"><div class="top">'+top+'</div><div class="num">'+num+'</div><div class="leg">'+leg+'</div><div class="luas">'+luas+'</div></div>';
  return {cls:'cm-m3 m3-cal',html:
    '<span class="rod" style="left:20%"></span><span class="rod" style="left:70%"></span>'+
    fol('f3','calendário islâmico','ano 1','12 meses lunares',1)+
    fol('f2','calendário solar','622','a Hégira: ida a Medina',2)+
    fol('f1','calendário solar','621','um ano antes da Hégira',3)};
};

/* ---------- abraão: as três religiões ligadas a um mesmo ponto ---------- */
C.tipos.abraao=p=>{
  const W=1500,H=1100;let s='';
  const tag=(x,y,w,t,at)=>'<g class="cai" style="--a:'+at+'s"><g filter="url(#cm-sombra)">'+rect(x,y,w,150,'#fff',T,4)+'</g>'+sTx(x+w/2,y+98,t,72,700,'middle',T)+'</g>';
  s+='<g class="ap" style="--a:.2s">'+pth('M750 240 C640 380 380 460 240 640','none',T,5,' stroke-dasharray="14 12" stroke-opacity=".75"')+pth('M750 240 L750 640','none',T,5,' stroke-dasharray="14 12" stroke-opacity=".75"')+pth('M750 240 C860 380 1140 460 1270 640','none',T,5,' stroke-dasharray="14 12" stroke-opacity=".75"')+'</g>';
  s+='<g class="cai" style="--a:0s"><g filter="url(#cm-sombra)">'+rect(520,90,460,170,'#fff',T,4)+'</g>'+sTx(750,205,'Abraão',96,700,'middle',T,SERIF)+'</g>';
  s+=circ(750,262,16,'#e8572a',T,4);
  s+=tag(30,640,420,'judaísmo',.6)+tag(480,640,560,'cristianismo',1.2)+tag(1070,640,400,'islamismo',1.8);
  s+='<g class="ap" style="--a:2.6s">'+pth('M1100 880 C1200 930 1340 920 1440 880','none','#ffd83d',20,' stroke-opacity=".9"')+'</g>';
  return {cls:'cm-m3',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Judaísmo, cristianismo e islamismo ligados a Abraão')+'">'+s+'</svg>'};
};

/* ---------- cinco pilares ---------- */
C.tipos.pilares=p=>{
  if(p.compacto){
    const W=1410,H=1100,cw=250,gap=20,x0=40;let s='';
    const nm=[['fé','balao'],['oração','tapete'],['jejum','jejum'],['zakat','moedas'],['Meca','caaba']];
    nm.forEach((q,i)=>{const x=x0+i*(cw+gap),a=(0.4+i*1.3).toFixed(1);
      s+='<g class="sobe" style="--a:'+a+'s"><g filter="url(#cm-sombra)">'+rect(x-10,1000,cw+20,70,'#d8d1c0',T,4)+rect(x,330,cw,670,'#f4ecd6',T,5)+rect(x-10,296,cw+20,44,'#e3dcc4',T,4)+'</g>'+
        circ(x+44,384,34,'#e8572a',T,4)+sTx(x+44,402,String(i+1),46,700,'middle','#fff')+
        '<g transform="translate('+(x+cw/2-85)+' 440) scale(.85)">'+ART[q[1]]('pk'+seq++)+'</g>'+
        '<rect class="mk3" style="--a:'+(parseFloat(a)+.7)+'s" x="'+(x+12)+'" y="716" width="'+(cw-24)+'" height="84" fill="#ffd83d" fill-opacity=".85"/>'+
        sTx(x+cw/2,776,q[0],56,700,'middle',T)+'</g>';});
    s+='<g class="cai" style="--a:7.4s"><g filter="url(#cm-sombra)">'+pth('M10 296 L705 20 L1400 296Z','#e3d3a8',T,5)+rect(10,286,1390,30,'#cfbf93',T,4)+'</g>'+'<rect x="445" y="150" width="520" height="100" fill="#ffd83d" fill-opacity=".9"/>'+sTx(705,230,'Islã',90,700,'middle',T,SERIF)+'</g>';
    return {cls:'cm-m3',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Cinco colunas sob um telhado: os cinco pilares do Islã')+'">'+s+'</svg>'};
  }
  const W=2900,H=1320,cw=480,gap=60,x0=100;let s='';
  const nomes=[['fé','profissão de fé','balao'],['oração','cinco vezes ao dia','tapete'],['jejum','no mês do Ramadã','jejum'],['zakat','2,5% das economias','moedas'],['peregrinação','uma vez na vida','caaba']];
  const ic=(nome,x,y,k)=>'<g transform="translate('+x+' '+y+') scale('+k+')">'+ART[nome]('pc'+seq++)+'</g>';
  nomes.forEach((q,i)=>{
    const x=x0+i*(cw+gap),a=(0.5+i*2.6).toFixed(1);
    s+='<g class="sobe" style="--a:'+a+'s"><g filter="url(#cm-sombra)">'+
      rect(x-14,1180,cw+28,90,'#d8d1c0',T,4)+rect(x,300,cw,880,'#f4ecd6',T,5)+rect(x-14,262,cw+28,56,'#e3dcc4',T,4)+'</g>'+
      hach('M'+(x+cw-80)+' 300 H'+(x+cw)+' V1180 H'+(x+cw-80)+'Z','cm-hh',.35)+
      [1,2,3,4,5,6].map(j=>tinta('M'+(x+j*cw/7)+' 340 V1160',1.6)).join('').replace(/<path/g,'<path stroke-opacity=".28"')+
      circ(x+66,366,44,'#e8572a',T,4)+sTx(x+66,388,String(i+1),58,700,'middle','#fff')+
      ic(q[2],x+cw/2-150,430,1.5)+
      '<rect class="mk3" style="--a:'+(parseFloat(a)+.9)+'s" x="'+(x+20)+'" y="806" width="'+(cw-40)+'" height="96" fill="#ffd83d" fill-opacity=".85"/>'+
      sTx(x+cw/2,880,q[0],q[0].length>9?58:74,700,'middle',T)+
      sTx(x+cw/2,972,q[1],46,600,'middle','#2f2e2a')+'</g>';
  });
  const xc=x0+4*(cw+gap)+cw/2;
  let dots='';for(let k=0;k<22;k++){const a=k/22*Math.PI*2;dots+=circ((xc+Math.cos(a)*200).toFixed(0),(590+Math.sin(a)*40).toFixed(0),9,'#3d3a33');}
  s+='<g class="ap" style="--a:14s">'+dots+'</g>';
  s+='<g class="cai" style="--a:15.5s"><g filter="url(#cm-sombra)">'+pth('M40 262 L1450 6 L2860 262Z','#e3d3a8',T,5)+rect(40,252,2820,34,'#cfbf93',T,4)+'</g>'+hach('M40 262 L1450 6 L2860 262Z','cm-hh',.25)+
    '<rect x="970" y="104" width="960" height="120" fill="#ffd83d" fill-opacity=".9"/>'+sTx(1450,198,'Islã',112,700,'middle',T,SERIF)+'</g>';
  return {cls:'cm-m3',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Cinco colunas sob um telhado: os cinco pilares do Islã')+'">'+s+'</svg>'};
};

/* ---------- jihad: duas notas, uma chave de lápis e a tradução riscada ---------- */
C.tipos.jihad=p=>{
  if(p.vert){
    const W=1000,H=2150;let s='';
    const nota=(y,t,sub,ico,at)=>'<g class="cai" style="--a:'+at+'s"><g filter="url(#cm-sombra)">'+rect(10,y,980,470,'#ffd83d')+'</g>'+
      '<g transform="translate(40 '+(y+50)+') scale(1.6)">'+ART[ico]('jv'+seq++)+'</g>'+sTx(380,y+200,t,100,700,'start',T)+sTx(380,y+290,sub[0],54,600,'start','#3a3520')+sTx(380,y+352,sub[1],54,600,'start','#3a3520')+'</g>';
    s+=nota(10,'interna',['a luta contra os','próprios vícios'],'coracao',.2)+nota(510,'externa',['a defesa da','comunidade'],'escudo',1.2);
    s+='<g class="ar" style="--a:2.2s"><path pathLength="1" d="M40 1010 C40 1080 480 1060 500 1160 C520 1060 960 1080 960 1010" fill="none" stroke="#3a3a3a" stroke-width="9" stroke-linecap="round"/></g>';
    s+='<g class="ap" style="--a:3.2s"><g filter="url(#cm-sombra)">'+rect(260,1200,480,290,'#fff',T,4)+'</g>'+sTx(500,1340,'jihad',140,700,'middle',T,SERIF)+sTx(500,1440,'esforço',84,600,'middle','#2f2e2a')+'</g>';
    s+='<g class="mk3" style="--a:3.8s"><rect x="290" y="1366" width="420" height="26" fill="#ffd83d" fill-opacity=".7"/></g>';
    s+='<g class="ap" style="--a:5s"><g filter="url(#cm-sombra)">'+rect(120,1570,760,190,'#fff',T,4)+'</g>'+sTx(500,1692,'“guerra santa”',76,600,'middle',T)+'</g>';
    s+='<g class="ar" style="--a:6.2s"><path pathLength="1" d="M130 1680 L870 1660" fill="none" stroke="#c93a2a" stroke-width="16" stroke-linecap="round"/></g>';
    s+='<g class="cai" style="--a:7.2s"><g filter="url(#cm-sombra)">'+rect(120,1840,760,250,'#ffd83d')+'</g>'+sTx(500,1948,'tradução',80,700,'middle',T)+sTx(500,2034,'incompleta',80,700,'middle',T)+'</g>';
    return {cls:'cm-m3',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Jihad, esforço: interna e externa; guerra santa riscada como tradução incompleta')+'">'+s+'</svg>'};
  }
  const W=2700,H=1160;let s='';
  const nota=(x,y,t,sub,ico,at)=>'<g class="cai" style="--a:'+at+'s"><g filter="url(#cm-sombra)">'+rect(x,y,980,500,'#ffd83d')+'</g>'+
    '<g transform="translate('+(x+28)+' '+(y+60)+') scale(1.7)">'+ART[ico]('jh'+seq++)+'</g>'+sTx(x+390,y+210,t,100,700,'start',T)+sTx(x+390,y+300,sub[0],54,600,'start','#3a3520')+sTx(x+390,y+366,sub[1],54,600,'start','#3a3520')+'</g>';
  s+=nota(10,20,'interna',['a luta contra os','próprios vícios'],'coracao',.2)+nota(10,610,'externa',['a defesa da','comunidade'],'escudo',1.4);
  s+='<g class="ar" style="--a:2.6s">'+'<path pathLength="1" d="M1030 60 C1110 60 1110 140 1110 240 C1110 400 1110 420 1190 580 C1110 740 1110 760 1110 920 C1110 1020 1110 1100 1030 1100" fill="none" stroke="#3a3a3a" stroke-width="9" stroke-linecap="round"/>'+'</g>';
  s+='<g class="ap" style="--a:3.8s"><g filter="url(#cm-sombra)">'+rect(1250,430,660,300,'#fff',T,4)+'</g>'+sTx(1580,556,'jihad',140,700,'middle',T,SERIF)+sTx(1580,672,'esforço',92,600,'middle','#2f2e2a')+'</g>';
  s+='<g class="mk3" style="--a:4.6s"><rect x="1290" y="580" width="580" height="30" fill="#ffd83d" fill-opacity=".7"/></g>';
  s+='<g class="ap" style="--a:7.2s"><g filter="url(#cm-sombra)">'+rect(2000,150,680,200,'#fff',T,4)+'</g>'+sTx(2340,276,'“guerra santa”',72,600,'middle',T)+'</g>';
  s+='<g class="ar" style="--a:8.6s"><path pathLength="1" d="M2010 262 L2670 244" fill="none" stroke="#c93a2a" stroke-width="16" stroke-linecap="round"/></g>';
  s+='<g class="cai" style="--a:10.4s"><g filter="url(#cm-sombra)">'+rect(2010,470,660,260,'#ffd83d')+'</g>'+sTx(2340,576,'tradução',74,700,'middle',T)+sTx(2340,660,'incompleta',74,700,'middle',T)+'</g>';
  return {cls:'cm-m3',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Jihad, esforço: interna e externa; a expressão guerra santa riscada como tradução incompleta')+'">'+s+'</svg>'};
};

/* ---------- califas: árvore de lápis, um tronco e dois galhos ---------- */
C.tipos.califas=p=>{
  const W=1500,H=1320;let s='';
  const tag=(x,y,w,h,l1,ls,at)=>'<g class="cai" style="--a:'+at+'s"><g filter="url(#cm-sombra)">'+rect(x,y,w,h,'#fff',T,4)+'</g>'+sTx(x+w/2,y+92,l1,90,700,'middle',T)+ls.map((t,i)=>sTx(x+w/2,y+170+i*68,t,60,600,'middle','#2f2e2a')).join('')+'</g>';
  s+='<g class="ap" style="--a:0s">'+pth('M560 1230 C590 1070 610 920 640 800 L860 800 C890 920 910 1070 940 1230Z','#e3d3a8',T,4)+hach('M760 810 L860 800 C890 920 910 1070 940 1230 L820 1230Z','cm-h1',.4)+pth('M690 1120 C700 1080 720 1040 740 1010 M820 1080 C830 1040 845 1010 860 980','none',T,3)+'</g>';
  s+='<g class="sobe" style="--a:1.2s">'+pth('M626 830 C610 670 500 530 330 392 L420 336 C570 450 700 640 784 830Z','#e3d3a8',T,4)+hach('M520 640 C600 700 700 790 784 830 L690 830Z','cm-h1',.35)+'</g>';
  s+='<g class="sobe" style="--a:2.4s">'+pth('M790 830 C830 700 950 570 1086 470 L1134 520 C1020 610 900 730 856 830Z','#e3d3a8',T,4)+'</g>';
  s+='<g class="ap" style="--a:2.8s">'+[[470,560],[560,640],[420,470],[980,590],[1050,520],[900,660]].map(q=>circ(q[0],q[1],16,'#7a9a55',T,3)).join('')+pth('M380 392 L380 330 M1110 470 L1110 350','none',T,5)+'</g>';
  s+=tag(40,40,620,280,'sunitas',['cerca de 85% a 90%','dos muçulmanos hoje'],3.2);
  s+=tag(840,100,620,250,'xiitas',['partidários de Ali'],4.4);
  s+='<g class="cai" style="--a:.6s"><g filter="url(#cm-sombra)">'+rect(960,1030,500,250,'#fff',T,4)+'</g>'+sTx(1210,1120,'632',90,700,'middle',T)+sTx(1210,1190,'morte do profeta',50,600,'middle','#2f2e2a')+sTx(1210,1252,'começa a sucessão',50,600,'middle','#2f2e2a')+pth('M960 1150 L900 1150','none',T,5)+'</g>';
  return {cls:'cm-m3',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Árvore: do tronco, a morte do profeta em 632, saem dois galhos, sunitas e xiitas')+'">'+s+'</svg>'};
};

/* ---------- algarismos: das formas antigas indianas (esquema) aos de hoje, com o zero ---------- */
C.tipos.numeros=p=>{
  const c=p.cols||10,rowsO=Math.ceil(9/c),rowsM=Math.ceil(10/c),W=c===10?2700:c*240+120,Y0=110,RH=250,YM=Y0+rowsO*RH+80,H=c===10?1180:YM+rowsM*RH+260;let s='';
  /* formas antigas, desenho esquemático: 1 a 4 em traços simples; 5 a 9 abstratos, só para dar a ideia da transformação */
  const velho=[
    'M-34 0 H34',
    'M-34 -16 H34 M-34 16 H34',
    'M-34 -30 H34 M-34 0 H34 M-34 30 H34',
    'M-36 0 H36 M0 -36 V36',
    'M-22 -40 V40 M-22 -4 C0 -22 30 -12 30 12 C30 34 0 40 -22 28',
    'M-8 -40 C-34 -20 -30 30 0 38 C30 34 34 -10 8 -12 C-10 -14 -22 4 -8 20',
    'M-30 -36 H30 L-6 40',
    'M0 -40 C-30 -34 -30 -8 0 0 C30 8 30 36 0 40 C-30 36 -30 8 0 0 C30 -8 30 -34 0 -40',
    'M-14 40 C-34 20 -28 -34 6 -38 C34 -36 34 -6 8 0 C-4 4 -8 10 -14 18'
  ];
  const col=240,x0=150;
  s+='<g class="ap" style="--a:.2s">'+sTx(40,70,'forma antiga, na Índia (esquema)',56,700,'start','#2f2e2a')+'</g>';
  s+='<g class="ap" style="--a:5.2s">'+sTx(40,(c===10?590:YM-30),'os algarismos de hoje',56,700,'start','#2f2e2a')+'</g>';
  velho.forEach((d,i)=>{
    const gx=i%c,gr=Math.floor(i/c),cx=(c===10?x0:60)+gx*col+60,a=(.6+i*.35).toFixed(2),yo=c===10?110:Y0+gr*RH,ym=c===10?640:YM+gr*RH;
    s+='<g class="ap" style="--a:'+a+'s"><g filter="url(#cm-sombra)">'+rect(cx-90,yo,180,230,'#fffdf6',T,3.4)+'</g>'+
      '<g transform="translate('+cx+' '+(yo+115)+') scale(1.45)">'+pth(d,'none',T,5.4)+'</g></g>';
    s+='<g class="ap" style="--a:'+(5.6+i*.18)+'s"><g filter="url(#cm-sombra)">'+rect(cx-90,ym,180,230,'#fffdf6',T,3.4)+'</g>'+sTx(cx,ym+185,String(i+1),210,400,'middle',T,SERIF)+'</g>';
  });
  const cz=(c===10?x0:60)+(9%c)*col+60,zr=c===10?0:Math.floor(9/c),zy=c===10?640:YM+zr*RH;
  s+='<g class="ap" style="--a:8.2s"><g filter="url(#cm-sombra)">'+rect(cz-90,zy,180,230,'#fffdf6',T,3.4)+'</g>'+sTx(cz,zy+185,'0',210,400,'middle',T,SERIF)+'</g>';
  s+='<g class="ar" style="--a:9s">'+'<path pathLength="1" d="M'+(cz-124)+' '+(zy+100)+' C'+(cz-120)+' '+(zy-50)+' '+(cz+120)+' '+(zy-50)+' '+(cz+124)+' '+(zy+100)+' C'+(cz+120)+' '+(zy+270)+' '+(cz-120)+' '+(zy+270)+' '+(cz-124)+' '+(zy+100)+'" fill="none" stroke="#ffd83d" stroke-width="16" stroke-linecap="round"/>'+'</g>';
  s+='<g class="cai" style="--a:9.8s"><g filter="url(#cm-sombra)">'+rect(c===10?960:40,H-200,c===10?1400:W-80,150,'#ffd83d')+'</g>'+sTx(c===10?1660:W/2,H-100,'o zero chegou à Europa por esse caminho',c===10?64:50,700,'middle',T)+'</g>';
  return {cls:'cm-m3',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Os algarismos de nove formas antigas indianas aos de hoje, com o zero no fim')+'">'+s+'</svg>'};
};

/* ---------- fita do tempo (cerca de 570 a 1492), com quebra na régua ---------- */
C.tipos.fitaislam=p=>{
  const W=3300,H=860,x0=90,k=14,X=a=>Math.round(x0+(a-570)*k),ey=430;let s='';
  s+='<g filter="url(#cm-sombra)"><rect x="0" y="0" width="'+W+'" height="'+H+'" fill="#fffdf6" stroke="'+T+'" stroke-width="5"/></g>'+rect(0,0,W,H,'url(#cm-hh)',null,0,' opacity=".14"');
  s+=sTx(60,70,'o Islã no tempo',54,700,'start',T);
  s+=pth('M'+X(570)+' '+ey+' H'+(X(762)+60),'none',T,6)+pth('M'+(X(762)+60)+' '+ey+' l30 -24 l28 48 l30 -24','none',T,6)+pth('M'+(X(762)+148)+' '+ey+' H3230','none',T,6);
  s+=sTx(2990,ey+80,'a régua não está em escala',40,600,'middle','#6b6358');
  for(let a=580;a<=760;a+=20)s+=pth('M'+X(a)+' '+(ey-12)+' V'+(ey+12),'none',T,4);
  /* marcos: [ano, título, subtítulo, etapa, lado (-1 em cima, 1 embaixo), fileira] */
  const M=[
    [570,'cerca de 570','nasce Muhammad','1',-1,0,'start'],
    [610,'cerca de 610','revelações','1',-1,0,'middle'],
    [622,'622','a Hégira','2',1,0,'middle'],
    [630,'630','volta a Meca','2',-1,1,'middle'],
    [632,'632','morte de Muhammad','2,6',1,1,'middle'],
    [650,'cerca de 650','texto do Alcorão reunido','3',-1,0,'middle'],
    [661,'661','omíadas em Damasco','6',1,0,'middle'],
    [711,'711','Península Ibérica','7',-1,0,'middle'],
    [732,'732','Poitiers','7',1,0,'middle'],
    [762,'762','fundação de Bagdá','6',-1,0,'middle']
  ];
  const SH=[1,2,3,6,7];
  const marco=(x,t1,t2,et,lado,row,anc,cor)=>{
    const dy=lado<0?-(110+row*150):(70+row*150),yy=ey+dy;
    const C=et.split(',').map(Number),mn=Math.min.apply(null,C),dimE=SH.filter(s=>s>=mn&&C.indexOf(s)<0).join(',');
    const g=(cl,e)=>e?'<g class="mk '+cl+'" data-et="'+e+'">'+pth('M'+x+' '+(ey+(lado<0?-10:10))+' V'+(lado<0?yy+76:yy-4),'none',T,3.4)+circ(x,ey,12,cor||'#d63a22',T,3.4)+
      sTx(x,yy+(lado<0?0:46),t1,50,700,anc||'middle',T)+sTx(x,yy+(lado<0?50:96),t2,42,600,anc||'middle','#2f2e2a')+'</g>':'';
    return g('b',et)+g('d',dimE);
  };
  M.forEach(m=>{s+=marco(X(m[0]),m[1],m[2],m[3],m[4],m[5],m[6]);});
  s+=marco(3080,'1492','queda de Granada','7',-1,1,'middle');
  return {cls:'cm-m3 f',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Fita do tempo do Islã, de cerca de 570 a 1492')+'">'+s+'</svg>'};
};
(function(){const st=document.createElement('style');
  st.textContent='.cm-m3.f .mk{opacity:0;transition:opacity .5s}.cm-m3.f .mk.on{opacity:1}.cm-m3.f .mk.d.on{opacity:.5}.cm-m3.f .mk.b.on circle{stroke-width:7}.cm-m3.f .mk.b.on text{paint-order:stroke;stroke:#ffd83d;stroke-width:9px;stroke-linejoin:round}';
  document.head.appendChild(st);})();

/* ---------- viajantes sobre o mapa: camelo e barco andando pelas rotas (pontos em pixels da base do mapa) ---------- */
C.tipos.viajantes=p=>{
  const W=p.W||1376,H=p.H||768;let s='';
  (p.itens||[]).forEach((it,i)=>{
    const d='M'+it.pts.map(q=>q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' L'),k=(it.tam||.22),
      g='<g transform="scale('+k+') translate(-100 -150)">'+ART[it.icone]('vj'+(seq++)+'-')+'</g>';
    const mov=C.reduz?'<g transform="translate('+it.pts[Math.floor(it.pts.length/2)][0]+' '+it.pts[Math.floor(it.pts.length/2)][1]+')">'+g+'</g>'
      :'<g>'+g+'<animateMotion dur="'+(it.dur||16)+'s" repeatCount="indefinite" begin="'+(it.ini||0)+'s" path="'+d+'"/></g>';
    s+='<g class="vj" data-et="'+it.et+'">'+mov+'</g>';
  });
  return {cls:'cm-m3',html:'<svg viewBox="0 0 '+W+' '+H+'" aria-hidden="true">'+s+'</svg>'};
};

/* atraso geral (ini, em segundos): os desenhos de dentro da peça só começam quando a câmera chega (ini) e a folhinha vira em v1 e v2 (s) */
['caligrafia','calend','abraao','pilares','jihad','califas','numeros','fitaislam'].forEach(n=>{
  const f=C.tipos[n];
  C.tipos[n]=function(p,T){const r=f(p,T);r.style=(r.style||'')+'--i:'+(p.ini||0)+'s;'+(p.v1!=null?'--v1:'+p.v1+'s;':'')+(p.v2!=null?'--v2:'+p.v2+'s;':'');return r;};
});

})();
