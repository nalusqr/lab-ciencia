/* Recortes do tópico 7 (Povos orientais: China, Índia e Japão), desenhados em código.
   Carregue DEPOIS de colagem.js e recortes.js. Não altera o motor: registra ícones novos em C.icone e tipos novos em C.tipos.
   Ícones (use {tipo:'icone', nome:'...'}): pincel-rolo, pimenta, gema, algodao, om, mao-jaina, roda-dharma, torii, fuji, yin-yang.
   Tipos próprios: confucio (escada confuciana), tao (yin e yang com rio), religiao (cartão com símbolo), castas (as quatro varnas, os párias e o cadeado). */
(function(){
'use strict';
const C=window.Colagem;
if(!C||!C.tipos||!C.icone)throw new Error('Carregue colagem.js e recortes.js antes de recortes-oriente.js');
const T='#1b1a17',P='#f6f1e4',esc=C.esc;
let seq=0;
const pth=(d,f,s,w,x)=>'<path d="'+d+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+' stroke-linecap="round" stroke-linejoin="round"'+(x||'')+'/>';
const tinta=(d,w)=>pth(d,'none',T,w||2);
const circ=(cx,cy,r,f,s,w)=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+'/>';
const hach=(d,pad,op)=>'<path d="'+d+'" fill="url(#'+(pad||'cm-h1')+')" opacity="'+(op||.6)+'"/>';

/* ---------- ícones: mesmo formato de recortes.js (arte em 0..200, fundo de papel colorido, margem branca) ---------- */
const IO={};
function reg(nome,fundo,rotulo,art){IO[nome]={fundo:fundo,nome:rotulo,art:art};if(C.ICONES&&C.ICONES.indexOf(nome)<0)C.ICONES.push(nome);}
function fundoO(cor,seed){
  const r=C.rng('fundo'+seed),pts=[];
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2,k=84+(r()-.5)*7;pts.push([104+Math.cos(a)*k,106+Math.sin(a)*k]);}
  return '<path d="'+C.suave(pts,true)+'" fill="'+C.cor(cor)+'" filter="url(#cm-rasga)"/>';
}
function iconeO(nome,o){
  o=o||{};const ic=IO[nome],u='io'+(seq++)+'-',fd=o.fundo===false?'':fundoO(o.fundo||ic.fundo,nome);
  return '<svg viewBox="-14 -14 228 228" role="img" aria-label="'+esc(o.rotulo||ic.nome)+'">'+fd+
    '<g filter="url(#cm-sombra)"><g class="cm-sil">'+ic.art('s'+u)+'</g></g>'+ic.art(u)+'</svg>';
}
const icone0=C.icone;
C.icone=function(nome,o){return IO[nome]?iconeO(nome,o):icone0(nome,o);};

/* pincel de bambu e rolo de papel com colunas de escrita */
reg('pincel-rolo','amarelo','Pincel e rolo de papel',u=>{
  let s=pth('M52 62 H160 V152 H52Z','#fbf9f1',T,3.2)+pth('M30 56 H58 V158 H30Z','#e9dcb4',T,3.2)+'<ellipse cx="44" cy="56" rx="14" ry="7" fill="#f6f1e4" stroke="'+T+'" stroke-width="3"/>'+'<ellipse cx="44" cy="158" rx="14" ry="7" fill="#e9dcb4" stroke="'+T+'" stroke-width="3"/>';
  s+=hach('M138 62 H160 V152 H138Z','cm-h1',.45);
  [78,98,118].forEach((x,i)=>{s+=pth('M'+x+' 76 V146','none',T,5,' stroke-dasharray="'+(i===1?'7 6':'11 5')+'" stroke-opacity=".85"');});
  s+=pth('M178 22 L118 112','none','#b9884a',10)+tinta('M178 22 L118 112',1.6)+pth('M168 37 L172 40 M158 52 L162 55 M148 67 L152 70','none',T,2.4);
  s+=pth('M120 108 L108 128 C122 126 134 116 138 100Z',T,T,2.5)+pth('M122 106 L132 112','none','#d9c9a0',5);
  return s;});

/* tigela de grãos de pimenta-do-reino */
reg('pimenta','coral','Grãos de pimenta',u=>{
  let s='';
  [[78,92],[122,92]].forEach((q,i)=>{s+=pth('M'+q[0]+' '+q[1]+' C'+(q[0]+(i?18:-18))+' '+(q[1]-22)+' '+(q[0]+(i?34:-34))+' '+(q[1]-26)+' '+(q[0]+(i?46:-46))+' '+(q[1]-14)+' C'+(q[0]+(i?32:-32))+' '+(q[1]-4)+' '+(q[0]+(i?12:-12))+' '+(q[1]+2)+' '+q[0]+' '+q[1]+'Z','#6f9a4a',T,2.6)+tinta('M'+q[0]+' '+q[1]+' L'+(q[0]+(i?36:-36))+' '+(q[1]-14),1.4);});
  const bolas=[[70,106],[86,106],[102,106],[118,106],[134,106],[78,92],[94,92],[110,92],[126,92],[86,78],[102,78],[118,78],[94,65],[110,65],[102,53]];
  bolas.forEach((b,i)=>{s+=circ(b[0],b[1],9,i%3?'#3a2a22':'#4d3a30',T,2.2)+circ(b[0]-3,b[1]-3,2.2,'#f6f1e4');});
  s+=pth('M40 112 C44 164 156 164 160 112Z','#b98a4e',T,3.2)+hach('M130 116 C148 122 150 150 126 158 C150 150 156 130 160 112Z','cm-h1',.55)+'<ellipse cx="100" cy="112" rx="60" ry="10" fill="#d1a766" stroke="'+T+'" stroke-width="3"/>'+tinta('M52 128 C80 142 120 142 148 128',1.6);
  return s;});

/* pedra preciosa em cabochão, polida e sem facetas */
reg('gema','petroleo','Pedra preciosa em cabochão',u=>{
  const o='M100 44 C140 40 168 66 164 102 C160 138 130 162 98 158 C62 154 36 128 40 92 C44 62 68 46 100 44Z';
  let s=pth(o,'#4f9f8a',T,3.4)+'<defs><clipPath id="'+u+'c"><path d="'+o+'"/></clipPath></defs>';
  s+='<g clip-path="url(#'+u+'c)"><path d="M120 40 L176 120 L110 170Z" fill="url(#cm-h1)" opacity=".5"/><ellipse cx="100" cy="102" rx="38" ry="34" fill="#6fb8a2" opacity=".7"/></g>';
  s+=pth('M66 78 C72 64 88 56 102 56','none','#e9f6f1',7)+tinta('M58 118 C70 134 92 142 114 140',1.6);
  s+=pth('M74 150 C86 160 114 164 132 156','none',T,3);
  return s;});

/* capulho de algodão aberto */
reg('algodao','amarelo','Capulho de algodão',u=>{
  let s=pth('M100 184 C100 160 100 140 100 118','none',T,4)+pth('M100 176 C72 166 56 148 52 132 C80 132 98 150 100 176Z','#6f9a4a',T,2.6)+pth('M102 160 C128 154 142 140 148 124 C122 124 104 138 102 160Z','#6f9a4a',T,2.6);
  [[80,82,19],[120,82,19],[100,62,21],[100,92,21],[74,100,16],[126,100,16]].forEach(b=>{s+=circ(b[0],b[1],b[2],P,T,2.8);});
  s+=tinta('M70 78 q6 -6 12 0 M112 78 q6 -6 12 0 M92 58 q8 -6 16 0 M92 90 q8 -6 16 0',1.6);
  s+=pth('M62 122 L52 92 L74 104 L84 80 L100 104 L116 80 L126 104 L148 92 L138 122 C122 130 78 130 62 122Z','#8a5a33',T,3)+hach('M100 104 L116 80 L126 104 L148 92 L138 122 C128 126 112 128 100 128Z','cm-h1',.5);
  return s;});

/* Om (ॐ), redesenhado à mão: o "3" com a cauda, o arco da direita, a taça e o ponto */
reg('om','amarelo','Símbolo Om, do hinduísmo',u=>{
  let s='<g transform="translate(12 22) scale(1.08)">';
  s+=pth('M50 72 C60 54 92 58 83 79 C79 90 66 93 62 93 C92 90 112 108 99 123 C88 138 62 135 48 123 C40 117 34 111 25 104','none',T,17);
  s+=pth('M91 102 C107 97 118 77 138 72 C159 68 171 85 166 104 C162 121 141 126 122 130','none',T,17);
  s+=pth('M88 30 C94 52 110 63 126 63 C143 63 158 51 162 27 L147 25 C143 40 135 47 126 47 C117 47 107 41 103 27 Z',T,T,2);
  s+=circ(127,27,8,T)+'</g>';
  return s;});

/* mão espalmada com a roda da não violência */
reg('mao-jaina','petroleo','Mão espalmada com uma roda, símbolo do jainismo',u=>{
  const pele='#f1d3a8';
  let s='';
  [[60,52,17,70],[79,38,17,84],[98,42,17,80],[117,60,16,62]].forEach(f=>{s+='<rect x="'+f[0]+'" y="'+f[1]+'" width="'+f[2]+'" height="'+f[3]+'" rx="8.5" fill="'+pele+'" stroke="'+T+'" stroke-width="3"/>';});
  s+=pth('M64 118 C46 110 36 96 30 88 C28 82 34 76 40 80 L64 98','#f1d3a8',T,3);
  s+='<rect x="60" y="100" width="76" height="68" rx="20" fill="'+pele+'" stroke="'+T+'" stroke-width="3"/>';
  s+='<rect x="63" y="96" width="70" height="14" fill="'+pele+'"/>';
  s+=circ(98,134,24,'#fffdf6',T,2.8)+circ(98,134,6,T);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=tinta('M'+(98+Math.cos(a)*7).toFixed(1)+' '+(134+Math.sin(a)*7).toFixed(1)+' L'+(98+Math.cos(a)*22).toFixed(1)+' '+(134+Math.sin(a)*22).toFixed(1),2.2);}
  return s;});

/* roda de oito raios do dharma */
reg('roda-dharma','amarelo','Roda de oito raios, símbolo do budismo',u=>{
  let s=circ(100,100,68,'#e3b24a',T,4)+circ(100,100,52,P,T,3.2)+hach('M100 32 A68 68 0 0 1 168 100 A52 52 0 0 0 100 48Z','cm-h1',.4);
  for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8,c=Math.cos(a),n=Math.sin(a);
    s+=pth('M'+(100+c*16).toFixed(1)+' '+(100+n*16).toFixed(1)+' L'+(100+c*52).toFixed(1)+' '+(100+n*52).toFixed(1),'none',T,6);
    s+=circ((100+c*60).toFixed(1),(100+n*60).toFixed(1),4.2,P,T,2);}
  s+=circ(100,100,17,'#e3b24a',T,3.4)+circ(100,100,6,T);
  return s;});

/* portão torii: duas colunas e duas traves */
reg('torii','coral','Portão torii, de um santuário xintoísta',u=>{
  let s=pth('M44 80 L52 176 H70 L66 80Z','#c93a2a',T,3)+pth('M134 80 L130 176 H148 L156 80Z','#c93a2a',T,3);
  s+=pth('M40 108 H160 V122 H40Z','#c93a2a',T,3)+pth('M100 82 V108','none',T,3);
  s+=pth('M26 66 Q100 84 174 66 V80 Q100 98 26 80Z','#c93a2a',T,3);
  s+=pth('M8 38 Q100 66 192 38 L186 56 Q100 84 14 56Z',T,T,3);
  s+=pth('M40 176 H76 M124 176 H160','none',T,6)+hach('M44 80 L52 176 H58 L54 80Z','cm-h3',.5);
  return s;});

/* monte Fuji com neve no cume */
reg('fuji','petroleo','Monte Fuji, com neve no cume',u=>{
  const m='M10 170 C52 154 80 100 90 58 C96 50 104 50 110 58 C120 100 148 154 190 170Z';
  let s=pth(m,'#9db8c9',T,3.4)+'<defs><clipPath id="'+u+'c"><path d="'+m+'"/></clipPath></defs>';
  s+='<g clip-path="url(#'+u+'c)"><path d="M100 40 L190 170 H110Z" fill="url(#cm-h1)" opacity=".5"/></g>';
  s+=pth('M90 58 C96 50 104 50 110 58 C112 66 114 74 118 84 L108 76 L100 90 L92 76 L84 86 C88 76 88 66 90 58Z','#fffdf6',T,2.6);
  s+=tinta('M72 112 C80 118 82 128 86 142 M126 112 C120 120 118 130 114 144 M40 156 C60 152 70 150 84 148 M116 148 C130 150 150 152 166 158',1.8);
  s+=circ(158,48,15,'#d63a22',T,2.6);
  return s;});

/* yin e yang */
reg('yin-yang','amarelo','Yin e yang',u=>{
  let s=circ(100,100,66,P,T,5)+pth('M100 34 A66 66 0 0 1 100 166 A33 33 0 0 1 100 100 A33 33 0 0 0 100 34Z',T,T,3);
  s+=circ(100,133,9,P,T,1.5)+circ(100,67,9,T,P,1.5)+hach('M100 34 A66 66 0 0 1 100 166 A33 33 0 0 1 100 100 A33 33 0 0 0 100 34Z','cm-hh',.0);
  return s;});

/* o tipo icone passa a conhecer os novos nomes pela própria C.icone (já embrulhada acima) */

/* ---------- esquemas ---------- */
const sTx=(x,y,t,sz,w,anc,fill,fam)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+(anc||'middle')+'" style="font:'+(w||700)+' '+sz+'px '+(fam||'var(--sans,sans-serif)')+';fill:'+(fill||T)+'">'+esc(t)+'</text>';
const SERIF='var(--serif,Georgia,serif)';
const fundoP=(W,H)=>'<rect width="'+W+'" height="'+H+'" fill="#fbf9f1"/><rect width="'+W+'" height="'+H+'" fill="url(#cm-hh)" opacity=".2"/>';
const ESTILO='<style>'+
  '.cm-or .bl{fill:#fffdf6}.cm-or:not(.fora) .bl{animation:cm-or-y .9s ease-out var(--a) forwards}'+
  '.cm-or .tx{opacity:.4}.cm-or:not(.fora) .tx{animation:cm-or-t .8s ease-out var(--a) forwards}'+
  '.cm-or .ap{opacity:0}.cm-or:not(.fora) .ap{animation:cm-or-t .8s ease-out var(--a) forwards}'+
  '.cm-or .rk{opacity:0}.cm-or:not(.fora) .rk{animation:cm-or-t .6s ease-out var(--a) forwards}'+
  '.cm-or .fl{stroke-dasharray:46 30;animation:cm-or-f 2.6s linear infinite}'+
  '.cm-or .gi{transform-box:fill-box;transform-origin:center;animation:cm-or-g 24s linear infinite}'+
  '@keyframes cm-or-y{from{fill:#fffdf6}to{fill:#f4c935}}@keyframes cm-or-t{to{opacity:1}}@keyframes cm-or-f{to{stroke-dashoffset:-152}}@keyframes cm-or-g{to{transform:rotate(360deg)}}'+
  '@media (prefers-reduced-motion:reduce){.cm-or .bl{fill:#f4c935!important;animation:none!important}.cm-or .tx,.cm-or .ap,.cm-or .rk{opacity:1!important;animation:none!important}.cm-or .fl,.cm-or .gi{animation:none!important}}'+
  '</style>';
const rotuloEsq=(p,W,H,corpo,rot,extra)=>({cls:'cm-esq cm-or'+(extra||''),style:'--clip:'+C.rasgo(p.id,1.2),html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||rot)+'">'+ESTILO+fundoP(W,H)+corpo+'</svg>'});

/* confucionismo: a escada dos papéis, do governante ao filho */
C.tipos.confucio=p=>{
  const W=1100,H=860,deg=[['governante','governa'],['súdito','obedece'],['pai','orienta'],['filho','respeita']],at=[1.5,5,8.5,12];
  let s=sTx(56,100,'Confucionismo',74,400,'start',T,SERIF)+tinta('M56 124 H620',3);
  deg.forEach((d,i)=>{const x=60+i*250,y=190+i*100;
    s+='<path class="bl" style="--a:'+at[i]+'s" d="M'+x+' '+y+' H'+(x+250)+' V650 H'+x+'Z" stroke="'+T+'" stroke-width="5"/>'+pth('M'+(x+212)+' '+y+' H'+(x+250)+' V650 H'+(x+212)+'Z','url(#cm-h1)',null,0,' opacity=".3"');
    s+='<g class="tx" style="--a:'+at[i]+'s">'+sTx(x+125,y+62,d[0],40,700)+sTx(x+125,y+114,d[1],40,500,'middle','#2f2e2a')+'</g>';});
  s+='<g class="ap" style="--a:14s"><path d="M60 706 L1040 700 L1044 808 L64 812Z" fill="#f4c935" stroke="'+T+'" stroke-width="5"/>'+sTx(552,778,'ordem e hierarquia',64,700)+'</g>';
  return rotuloEsq(p,W,H,s,'Confucionismo: uma escada de quatro degraus com governante, súdito, pai e filho, e a etiqueta ordem e hierarquia');
};

/* taoísmo: yin e yang e um rio que corre livre */
C.tipos.tao=p=>{
  const W=1100,H=860,cx=330,cy=380,r=200;
  let s=sTx(56,100,'Taoísmo',74,400,'start',T,SERIF)+tinta('M56 124 H400',3);
  s+='<g class="gi">'+circ(cx,cy,r,P,T,6)+pth('M'+cx+' '+(cy-r)+' A'+r+' '+r+' 0 0 1 '+cx+' '+(cy+r)+' A'+(r/2)+' '+(r/2)+' 0 0 1 '+cx+' '+cy+' A'+(r/2)+' '+(r/2)+' 0 0 0 '+cx+' '+(cy-r)+'Z',T,T,3)+circ(cx,cy+r/2,r/6,P,T,2)+circ(cx,cy-r/2,r/6,T,P,2)+'</g>';
  s+=sTx(cx,cy+r+62,'yin e yang',44,600,'middle','#2f2e2a');
  // montanhas ao fundo e rio sinuoso
  s+=pth('M600 330 L700 190 L760 270 L840 150 L960 330Z','#dcd3bb',T,3.5)+hach('M840 150 L960 330 H880Z','cm-h1',.45)+pth('M700 190 L716 214 L700 206 L690 218 Z','#fffdf6',T,2);
  const rio='M770 330 C700 400 860 450 790 520 C740 570 860 600 820 650';
  s+='<path d="'+rio+'" fill="none" stroke="#2f77b5" stroke-width="46" stroke-linecap="round"/><path class="fl" d="'+rio+'" fill="none" stroke="#bfe0f4" stroke-width="7" stroke-linecap="round"/>';
  s+=pth('M660 600 C664 580 668 560 666 540 M680 604 C686 584 690 566 692 548','none','#4b6b2f',5)+pth('M930 560 C934 540 936 520 934 504 M950 562 C956 544 958 526 962 512','none','#4b6b2f',5);
  s+='<g class="ap" style="--a:3s"><path d="M60 706 L1040 700 L1044 808 L64 812Z" fill="#f4c935" stroke="'+T+'" stroke-width="5"/>'+sTx(552,778,'harmonia com a natureza',60,700)+'</g>';
  return rotuloEsq(p,W,H,s,'Taoísmo: o símbolo do yin e yang e um rio que corre livre entre montanhas, com a etiqueta harmonia com a natureza');
};

/* cartão de religião: símbolo grande, nome e três linhas */
C.tipos.religiao=p=>{
  const W=800,H=920,ic=IO[p.simbolo];
  let s=sTx(400,716,p.titulo,84,400,'middle',T,SERIF);
  const fundoC=C.cor(p.cor||'amarelo');
  s='<ellipse cx="400" cy="290" rx="262" ry="252" fill="'+fundoC+'" opacity=".85" filter="url(#cm-rasga)"/>'+
    (ic?'<g transform="translate(150 40) scale(2.5)">'+ic.art('rl'+(seq++)+'-')+'</g>':'')+s;
  (p.linhas||[]).forEach((l,i)=>{s+=sTx(400,786+i*56,l,44,i?500:700,'middle',i?'#2f2e2a':T);});
  return rotuloEsq(p,W,H,s,p.rotulo||('Cartão: '+p.titulo));
};

/* as quatro varnas, os párias e o cadeado das castas (esp:true espelha: pirâmide à direita e cadeado à esquerda) */
C.tipos.castas=p=>{
  const W=1300,H=900,esp=!!p.esp,cx=esp?W-450:450,y0=110,hb=150,larg=[400,520,640,760,880],
    nomes=[['brâmanes','sacerdotes'],['xátrias','guerreiros'],['vaixás','comerciantes e agricultores'],['sudras','servos']],at=[1,3,5,7];
  const X=x=>esp?W-x:x;
  let s=sTx(cx,70,'as quatro varnas',52,700,'middle',T);
  nomes.forEach((n,i)=>{const a=y0+i*hb,b=a+hb-8,w0=larg[i],w1=larg[i+1];
    s+='<path class="bl" style="--a:'+at[i]+'s" d="M'+(cx-w0/2)+' '+a+' H'+(cx+w0/2)+' L'+(cx+w1/2)+' '+b+' H'+(cx-w1/2)+'Z" stroke="'+T+'" stroke-width="5"/>'+
      pth('M'+(cx+w0/2-36)+' '+a+' H'+(cx+w0/2)+' L'+(cx+w1/2)+' '+b+' H'+(cx+w1/2-42)+'Z','url(#cm-h1)',null,0,' opacity=".3"');
    s+='<g class="tx" style="--a:'+at[i]+'s">'+sTx(cx,a+58,n[0],50,700)+sTx(cx,a+104,n[1],38,500,'middle','#2f2e2a')+'</g>';});
  // fora da pirâmide: os párias, separados por um traço
  const yp=y0+4*hb+28;
  s+='<g class="tx" style="--a:9s"><path d="M'+(cx-440)+' '+(yp-14)+' H'+(cx+440)+'" stroke="'+T+'" stroke-width="4" stroke-dasharray="18 14" fill="none"/>'+
    '<path d="M'+(cx-320)+' '+yp+' H'+(cx+320)+' V'+(yp+118)+' H'+(cx-320)+'Z" fill="#e8e1cf" stroke="'+T+'" stroke-width="5"/><path d="M'+(cx-320)+' '+yp+' H'+(cx+320)+' V'+(yp+118)+' H'+(cx-320)+'Z" fill="url(#cm-hh)" opacity=".5"/>'+
    sTx(cx,yp+54,'dalits (párias)',50,700)+sTx(cx,yp+98,'fora das quatro varnas',38,500,'middle','#2f2e2a')+'</g>';
  // cadeado entre as faixas
  const lx=esp?190:1080,ly=330,ar='M'+(lx-34)+' '+(ly-6)+' V'+(ly-44)+' C'+(lx-34)+' '+(ly-92)+' '+(lx+34)+' '+(ly-92)+' '+(lx+34)+' '+(ly-44)+' V'+(ly-6);
  s+='<g class="tx" style="--a:5s"><path d="'+ar+'" fill="none" stroke="'+T+'" stroke-width="14" stroke-linecap="round"/><path d="'+ar+'" fill="none" stroke="#c9ccd0" stroke-width="6" stroke-linecap="round"/>'+
    '<rect x="'+(lx-62)+'" y="'+(ly-8)+'" width="124" height="96" rx="12" fill="#8a8d92" stroke="'+T+'" stroke-width="5"/>'+
    circ(lx,ly+34,11,T)+'<path d="M'+lx+' '+(ly+34)+' V'+(ly+66)+'" stroke="'+T+'" stroke-width="9" stroke-linecap="round"/>'+
    sTx(lx,ly+168,'nasce e morre',46,700)+sTx(lx,ly+220,'na mesma casta',46,700)+'</g>';
  // linha tracejada ligando as faixas ao cadeado
  s+='<path class="tx" style="--a:5.5s" d="M'+X(790)+' 250 C'+X(850)+' 250 '+X(880)+' 300 '+X(970)+' 322" fill="none" stroke="'+T+'" stroke-width="4" stroke-dasharray="12 10" stroke-linecap="round"/>';
  // risco vermelho sobre o cadeado (só no cartão pequeno, quando o budismo o corta)
  if(p.risca){const r=p.risca,rx=esp?lx+190:lx-190,ry=ly+30;s+='<g class="rk" style="--a:'+r+'s"><path d="M'+(rx-46)+' '+(ry-46)+' L'+(rx+46)+' '+(ry+46)+' M'+(rx+46)+' '+(ry-46)+' L'+(rx-46)+' '+(ry+46)+'" stroke="#d63a22" stroke-width="20" stroke-linecap="round"/></g>';}
  return rotuloEsq(p,W,H,s,'As quatro varnas da Índia: brâmanes, xátrias, vaixás e sudras, os dalits (párias) fora da pirâmide e um cadeado: nasce e morre na mesma casta',' cm-cs');
};


/* pirâmide social de topo truncado (usa o CSS da pirâmide do motor): o texto cabe na faixa mais estreita */
C.tipos.hierarquia=p=>{
  const cs=p.camadas||[],n=cs.length,W=600,Hc=p.alturaCamada||110,H=n*Hc+8,cx=W/2,topo=.52,base=.97;
  const lw=k=>W*(topo+(base-topo)*k/n);
  let s='';
  cs.forEach((c,i)=>{
    const y0=4+i*Hc,y1=y0+Hc-6,w0=lw(i),w1=lw(i+1);
    const d='M'+(cx-w0/2)+' '+y0+' L'+(cx+w0/2)+' '+y0+' L'+(cx+w1/2)+' '+y1+' L'+(cx-w1/2)+' '+y1+' Z';
    const sd='M'+(cx+w0/2-22)+' '+y0+' L'+(cx+w0/2)+' '+y0+' L'+(cx+w1/2)+' '+y1+' L'+(cx+w1/2-26)+' '+y1+' Z';
    const ty=y0+(c.s?44:Hc/2+6);
    s+='<g class="cam" data-item="'+i+'" style="--i:'+(n-1-i)+'"><path class="faixa" d="'+d+'"/><path class="somb" d="'+sd+'"/>'+
      '<text x="'+cx+'" y="'+ty+'" text-anchor="middle" style="font-size:26px">'+esc(c.t)+'</text>'+(c.s?'<text class="s" x="'+cx+'" y="'+(ty+31)+'" text-anchor="middle" style="font-size:23px">'+esc(c.s)+'</text>':'')+'</g>';
  });
  return {cls:'cm-piramide',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Pirâmide social: '+cs.map(c=>c.t).join(', '))+'">'+s+'</svg>'};
};

})();
