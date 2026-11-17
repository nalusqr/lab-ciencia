/* Recortes do módulo 2, tópico 1 (Alta Idade Média), desenhados em código. Nenhuma figura de IA.
   Carregue DEPOIS de colagem.js e recortes.js. Não altera o motor: registra ícones novos em C.icone e tipos novos em C.tipos.
   Ícones (use {tipo:'icone', nome:'...'}): capacete-godo, pia-coroa, santa-sofia, corpus, cruz-cisma, villa.
   Tipos próprios: idade (fita da Idade Média), capa (trevas, romantico, seculo20), pessoas20 (gráfico de bonequinhos),
   comitatus (chefe e guerreiros), cruz (cruz fina sobre o mapa), maos (coroa e mapa da Itália), manuscrito (minúscula carolíngia),
   castelos (castelos e círculos de alcance sobre o mapa-múndi) e riscado (Constantinopla riscada). */
(function(){
'use strict';
const C=window.Colagem;
if(!C||!C.tipos||!C.icone)throw new Error('Carregue colagem.js e recortes.js antes de recortes-m02a.js');
const T='#1b1a17',P='#f6f1e4',AM='#ffd83d',esc=C.esc;
let seq=0;
const pth=(d,f,s,w,x)=>'<path d="'+d+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+' stroke-linecap="round" stroke-linejoin="round"'+(x||'')+'/>';
const tinta=(d,w)=>pth(d,'none',T,w||2);
const circ=(cx,cy,r,f,s,w)=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+'/>';
const rect=(x,y,w,h,f,s,sw,rx)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"'+(rx?' rx="'+rx+'"':'')+' fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(sw||3)+'" stroke-linejoin="round"':'')+'/>';
const hach=(d,pad,op)=>'<path d="'+d+'" fill="url(#'+(pad||'cm-h1')+')" opacity="'+(op||.6)+'"/>';
const clipD=(id,d)=>'<clipPath id="'+id+'"><path d="'+d+'"/></clipPath>';

/* ---------- ícones: mesmo formato de recortes.js (arte em 0..200, fundo de papel colorido, margem branca) ---------- */
const IO={};
function reg(nome,fundo,rotulo,art){IO[nome]={fundo:fundo,nome:rotulo,art:art};if(C.ICONES&&C.ICONES.indexOf(nome)<0)C.ICONES.push(nome);}
function fundoO(cor,seed){
  const r=C.rng('fundo'+seed),pts=[];
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2,k=84+(r()-.5)*7;pts.push([104+Math.cos(a)*k,106+Math.sin(a)*k]);}
  return '<path d="'+C.suave(pts,true)+'" fill="'+C.cor(cor)+'" filter="url(#cm-rasga)"/>';
}
function iconeO(nome,o){
  o=o||{};const ic=IO[nome],u='m2'+(seq++)+'-',fd=o.fundo===false?'':fundoO(o.fundo||ic.fundo,nome);
  return '<svg viewBox="-14 -14 228 228" role="img" aria-label="'+esc(o.rotulo||ic.nome)+'">'+fd+
    '<g filter="url(#cm-sombra)"><g class="cm-sil">'+ic.art('s'+u)+'</g></g>'+ic.art(u)+'</svg>';
}
const icone0=C.icone;
C.icone=function(nome,o){return IO[nome]?iconeO(nome,o):icone0(nome,o);};

/* capacete godo: elmo de bandas (spangenhelm), sem chifres */
reg('capacete-godo','coral','Capacete godo de bandas de ferro',u=>{
  const d='M56 128 C54 84 72 46 100 22 C128 46 146 84 144 128 Z';
  let s=pth('M54 128 C48 152 58 176 80 186 L88 142Z','#9a8b6a',T,3)+pth('M146 128 C152 152 142 176 120 186 L112 142Z','#9a8b6a',T,3);
  s+='<defs>'+clipD(u+'d',d)+'</defs>'+pth(d,'#bfc2c6',T,3.4)+'<g clip-path="url(#'+u+'d)"><path d="M104 20 L152 40 V140 H112Z" fill="url(#cm-h1)" opacity=".6"/><path d="M56 70 C80 66 120 66 144 70" fill="none" stroke="'+T+'" stroke-opacity=".25" stroke-width="1.4"/></g>';
  s+=pth('M100 22 V128 M100 22 C86 52 76 90 68 128 M100 22 C114 52 124 90 132 128','none','#a9793a',5.5)+pth('M100 22 V128 M100 22 C86 52 76 90 68 128 M100 22 C114 52 124 90 132 128','none',T,1.2);
  s+=pth('M50 124 H150 V142 H50Z','#a9793a',T,3)+hach('M120 124 H150 V142 H120Z','cm-h1',.5);
  s+=pth('M95 142 V178 H105 V142Z','#a9793a',T,2.6);
  [[64,133],[84,133],[116,133],[136,133]].forEach(q=>{s+=circ(q[0],q[1],2.6,'#f6f1e4',T,1.6);});
  s+=pth('M100 22 V12','none',T,4)+circ(100,12,5,'#a9793a',T,2.4);
  s+=tinta('M66 150 C70 164 76 174 84 178 M134 150 C130 164 124 174 116 178',1.6);
  return s;});

/* pia batismal e, ao lado, a coroa */
reg('pia-coroa','petroleo','Pia batismal e uma coroa ao lado',u=>{
  const bowl='M20 84 H132 C132 110 108 126 76 126 C44 126 20 110 20 84Z';
  let s=pth('M44 190 H110 L102 152 H52Z','#d8d0bd',T,3)+pth('M60 152 C60 134 64 122 66 114 H88 C90 122 94 134 94 152Z','#cfc6af',T,3);
  s+='<defs>'+clipD(u+'b',bowl)+'</defs>'+pth(bowl,'#e4dcc8',T,3.4)+'<g clip-path="url(#'+u+'b)"><path d="M100 80 H140 V130 H84Z" fill="url(#cm-h1)" opacity=".5"/></g>';
  s+='<ellipse cx="76" cy="84" rx="56" ry="13" fill="#e4dcc8" stroke="'+T+'" stroke-width="3.4"/><ellipse cx="76" cy="86" rx="44" ry="8.5" fill="#79b3d4" stroke="'+T+'" stroke-width="1.8"/>';
  s+=tinta('M58 87 C66 84 74 90 82 87',1.4)+pth('M76 100 V120 M67 108 H85','none',T,3.4);
  // coroa: faixa de ouro, cinco pontas com bolas e duas pedras
  s+=pth('M140 176 H192 V154 H140Z','#e4b13a',T,3)+pth('M140 154 L142 124 L156 142 L166 114 L176 142 L190 124 L192 154Z','#e4b13a',T,3)+hach('M176 120 L190 124 L192 176 H176Z','cm-h1',.45);
  [[142,121],[166,111],[190,121]].forEach(q=>{s+=circ(q[0],q[1],4.6,'#f6f1e4',T,2.2);});
  s+=circ(153,165,4.2,'#c93a2a',T,1.8)+circ(166,165,4.2,'#2f6f7a',T,1.8)+circ(179,165,4.2,'#c93a2a',T,1.8);
  return s;});

/* silhueta de Santa Sofia: cúpula sobre base quadrada, sem minaretes (acrescentados depois de 1453) */
reg('santa-sofia','amarelo','Silhueta da igreja de Santa Sofia',u=>{
  let s=pth('M12 178 H188 V190 H12Z','#d9cfb4',T,3);
  s+=pth('M46 118 H154 V178 H46Z','#e6dcc0',T,3.2)+hach('M128 118 H154 V178 H128Z','cm-h1',.45);
  s+=pth('M20 150 C20 128 40 118 50 116 V178 H20Z','#dccfae',T,3)+pth('M180 150 C180 128 160 118 150 116 V178 H180Z','#dccfae',T,3);
  s+=pth('M12 130 H30 V178 H12Z','#cfc3a2',T,3)+pth('M170 130 H188 V178 H170Z','#cfc3a2',T,3);
  const dome='M58 118 C58 58 142 58 142 118Z';
  s+='<defs>'+clipD(u+'d',dome)+'</defs>'+pth(dome,'#b9b5a9',T,3.4)+'<g clip-path="url(#'+u+'d)"><path d="M104 56 L150 70 V120 H110Z" fill="url(#cm-h1)" opacity=".55"/>'+tinta('M100 60 V118 M82 64 L76 118 M118 64 L124 118',1.2)+'</g>';
  s+=pth('M58 118 H142 V108 H58Z','#d9cfb4',T,2.6);
  for(let i=0;i<9;i++)s+=rect(62+i*9,110,5,6,'#6b5a3a',null);
  s+=pth('M100 58 V40 M93 46 H107','none',T,3.6);
  [[62,138],[88,138],[114,138]].forEach(q=>{s+=pth('M'+q[0]+' 170 V'+(q[1]+8)+' C'+q[0]+' '+(q[1]-6)+' '+(q[0]+14)+' '+(q[1]-6)+' '+(q[0]+14)+' '+(q[1]+8)+' V170Z','#6b5a3a',T,2.4);});
  s+=tinta('M20 166 H44 M156 166 H180',1.4);
  return s;});

/* livro fechado do Corpus Juris Civilis, com a balança da justiça em relevo */
reg('corpus','petroleo','Livro fechado do Corpus Juris Civilis, com uma balança na capa',u=>{
  let s=pth('M46 164 H158 L150 178 H38Z','#f1e8cd',T,3)+tinta('M48 170 H152 M52 174 H146',1.2);
  s+=pth('M34 44 H48 V166 H34Z','#6e2a1f',T,3)+tinta('M34 70 H48 M34 100 H48 M34 130 H48',1.8);
  s+=pth('M48 40 H160 V166 H48Z','#8b3d2e',T,3.4)+hach('M140 40 H160 V166 H140Z','cm-h1',.5);
  s+=pth('M58 50 H150 V156 H58Z','none','#d4a73a',2.6)+pth('M64 56 H144 V150 H64Z','none','#d4a73a',1.6);
  // balança
  s+=pth('M104 70 V128','none','#e6c25a',4)+pth('M82 82 H126','none','#e6c25a',4)+circ(104,70,4.4,'#e6c25a',T,1.4);
  s+=pth('M82 82 L72 106 H92Z','none','#e6c25a',2.4)+pth('M126 82 L116 106 H136Z','none','#e6c25a',2.4);
  s+=pth('M68 108 C72 118 92 118 96 108Z','#e6c25a',T,1.6)+pth('M112 108 C116 118 136 118 140 108Z','#e6c25a',T,1.6);
  s+=pth('M90 130 H118 V122 H90Z','#e6c25a',T,1.6);
  s+=pth('M160 92 H172 V108 H160Z','#b98a3a',T,2.4);
  return s;});

/* cruz que se parte em duas: o Cisma do Oriente, de 1054 */
reg('cruz-cisma','coral','Cruz partida em duas metades, o Cisma de 1054',u=>{
  const cruz='M82 18 H118 V62 H162 V98 H118 V186 H82 V98 H38 V62 H82Z';
  const zz=(dx)=>'M'+(100+dx)+' 0 L'+(94+dx)+' 40 L'+(104+dx)+' 74 L'+(95+dx)+' 108 L'+(105+dx)+' 142 L'+(98+dx)+' 176 L'+(100+dx)+' 200';
  const esq=zz(0)+' H0V0Z',dir=zz(0)+' H200V0Z';
  let s='<defs>'+clipD(u+'e',esq)+clipD(u+'d',dir)+'</defs>';
  s+='<g transform="translate(-10 4) rotate(-5 100 100)"><g clip-path="url(#'+u+'e)">'+pth(cruz,'#e6c25a',T,3.6)+hach('M38 62 H100 V98 H38Z','cm-h1',.35)+'</g></g>';
  s+='<g transform="translate(10 -2) rotate(4 100 100)"><g clip-path="url(#'+u+'d)">'+pth(cruz,'#d8d2c4',T,3.6)+hach('M118 98 V186 H100 V98Z','cm-h1',.45)+'</g></g>';
  s+=pth('M94 40 L104 74 L95 108 L105 142 L98 176','none',T,2.2,' stroke-dasharray="3 5"');
  return s;});

/* casa de campo romana (villa): a grande propriedade rural */
reg('villa','amarelo','Casa de campo romana, uma villa',u=>{
  let s=pth('M10 172 H190','none',T,3)+pth('M34 104 H166 V170 H34Z','#e9dbb6',T,3.2)+hach('M140 104 H166 V170 H140Z','cm-h1',.45);
  s+=pth('M22 106 L100 56 L178 106Z','#c46a4a',T,3.4);
  for(let i=1;i<4;i++)s+=tinta('M'+(22+i*14)+' '+(106-i*12.5)+' H'+(178-i*14),1.4);
  [48,70,126,148].forEach(x=>{s+=rect(x-4,112,8,58,'#fbf8ef',T,2.2);});
  s+=pth('M88 170 V136 C88 120 112 120 112 136 V170Z','#5a4630',T,2.6);
  s+=rect(26,106,148,6,'#d7c79a',T,2.4);
  s+=pth('M168 172 C168 152 176 148 182 140 C190 150 192 164 190 172','#6f9a4a',T,2.6);
  return s;});

/* ---------- esquemas ---------- */
const sTx=(x,y,t,sz,w,anc,fill,fam,ex)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+(anc||'middle')+'"'+(ex||'')+' style="font:'+(w||700)+' '+sz+'px '+(fam||'var(--sans,sans-serif)')+';fill:'+(fill||T)+'">'+esc(t)+'</text>';
const SERIF='var(--serif,Georgia,serif)';
const fundoP=(W,H)=>'<rect width="'+W+'" height="'+H+'" fill="#fbf9f1"/><rect width="'+W+'" height="'+H+'" fill="url(#cm-hh)" opacity=".2"/>';
const ESTILO='<style>'+
  '.cm-m2.cm-esq{padding:0}.cm-m2 svg{display:block;width:100%;height:100%}'+
  '.cm-m2 .ap{opacity:0}.cm-m2:not(.fora) .ap{animation:m2t .7s ease-out var(--a,0s) forwards}'+
  '.cm-m2 .pop{opacity:0;transform-box:fill-box;transform-origin:50% 100%}.cm-m2:not(.fora) .pop{animation:m2p .55s cubic-bezier(.2,.9,.3,1.3) var(--a,0s) forwards}'+
  '.cm-m2 .dr{stroke-dasharray:1;stroke-dashoffset:1}.cm-m2:not(.fora) .dr{animation:m2d 1.1s ease-in-out var(--a,0s) forwards}'+
  '.cm-m2 .wp{transform-box:fill-box;transform-origin:0 50%;transform:scaleX(0)}.cm-m2:not(.fora) .wp{animation:m2w 1.5s ease-out var(--a,0s) forwards}'+
  '@keyframes m2t{to{opacity:1}}@keyframes m2p{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:none}}@keyframes m2d{to{stroke-dashoffset:0}}@keyframes m2w{to{transform:scaleX(1)}}'+
  '@media (prefers-reduced-motion:reduce){.cm-m2 .ap,.cm-m2 .pop{opacity:1!important;animation:none!important;transform:none!important}.cm-m2 .dr{stroke-dashoffset:0!important;animation:none!important}.cm-m2 .wp{transform:none!important;animation:none!important}}'+
  '</style>';
const A=a=>' style="--a:'+a+'s"';
const esq=(p,W,H,corpo,rot,extra)=>({cls:'cm-esq cm-m2'+(extra||''),style:'--clip:'+C.rasgo(p.id,1.2),html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||rot)+'">'+ESTILO+fundoP(W,H)+corpo+'</svg>'});
const livre=(p,W,H,corpo,rot,extra)=>({cls:'cm-icone cm-m2'+(extra||''),html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||rot)+'" style="overflow:visible">'+ESTILO+corpo+'</svg>'});
const seta=(d,pt,a,cor,w)=>'<path class="dr"'+A(a)+' pathLength="1" d="'+d+'" fill="none" stroke="'+(cor||T)+'" stroke-width="'+(w||6)+'" stroke-linecap="round"/><path class="ap"'+A(a+.9)+' d="'+pt+'" fill="none" stroke="'+(cor||T)+'" stroke-width="'+((w||6)+1)+'" stroke-linecap="round" stroke-linejoin="round"/>';
/* etiqueta de papel branco dentro de um esquema */
const etq=(x,y,w,h,ls,sz,a,giro,cor)=>{
  const n=ls.length,lh=Math.round(sz*1.16),y0=y+h/2-(n-1)*lh/2+sz*.34;
  return '<g class="ap"'+A(a)+'><g transform="rotate('+(giro||0)+' '+(x+w/2)+' '+(y+h/2)+')"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+(cor||'#fff')+'" stroke="'+T+'" stroke-opacity=".35" stroke-width="2"/>'+
    ls.map((l,i)=>sTx(x+w/2,y0+i*lh,l,sz,700)).join('')+'</g></g>';
};
/* pessoa em pictograma: cabeça redonda e corpo em trapézio; (x,y) é o centro da base dos pés */
const pessoa=(x,y,h,fill,ex)=>{
  const r=h*.15,hy=y-h+r,top=y-h*.62,w=h*.32;
  return '<g'+(ex||'')+'>'+circ(x.toFixed(1),hy.toFixed(1),r.toFixed(1),fill,T,3)+
    pth('M'+(x-w).toFixed(1)+' '+top.toFixed(1)+' H'+(x+w).toFixed(1)+' L'+(x+w*1.2).toFixed(1)+' '+y+' H'+(x-w*1.2).toFixed(1)+'Z',fill,T,3)+'</g>';
};

/* ---------- etapa 1: a fita da Idade Média, de 476 a 1500, e a longa Idade Média de Le Goff ---------- */
C.tipos.idade=p=>{
  const W=3700,H=860,X=y=>Math.round(150+(y-476)*2.5),x0=X(476),xj=X(950),xb=X(1500),xf=X(1789);
  let s='';
  // título com marca-texto passando da esquerda para a direita
  s+='<rect class="wp"'+A(.6)+' x="120" y="46" width="860" height="150" fill="'+AM+'" opacity=".85"/>'+sTx(140,168,'Idade Média',150,400,'start',T,SERIF);
  // faixas
  s+='<g class="wp"'+A(1.6)+'>'+pth('M'+x0+' 330 H'+xj+' V500 H'+x0+'Z','#e9dcb4',T,5)+hach('M'+(xj-70)+' 330 H'+xj+' V500 H'+(xj-70)+'Z','cm-h1',.3)+'</g>';
  s+='<g class="ap"'+A(2.4)+'>'+sTx((x0+xj)/2,414,'Alta Idade Média',76,700)+sTx((x0+xj)/2,468,'século V ao IX ou X',44,500,'middle','#2f2e2a')+'</g>';
  s+='<g class="wp"'+A(4)+'>'+pth('M'+xj+' 330 H'+xb+' V500 H'+xj+'Z','#d9d6cf',T,5)+hach('M'+(xb-70)+' 330 H'+xb+' V500 H'+(xb-70)+'Z','cm-h1',.3)+'</g>';
  s+='<g class="ap"'+A(4.8)+'>'+sTx((xj+xb)/2,414,'Baixa Idade Média',76,700)+sTx((xj+xb)/2,468,'até o século XV',44,500,'middle','#2f2e2a')+'</g>';
  // a emenda: etiqueta de papel com fio
  s+='<g class="ap"'+A(7)+'>'+pth('M'+xj+' 258 V332','none',T,4)+circ(xj,332,9,T)+
    '<g transform="rotate(-2 '+xj+' 220)"><rect x="'+(xj-430)+'" y="176" width="860" height="84" fill="#fff" stroke="'+T+'" stroke-opacity=".35" stroke-width="2"/>'+sTx(xj,234,'século IX, X ou XI, conforme o livro',46,700)+'</g></g>';
  // a fita fina e pontilhada, de 1500 até 1789
  s+='<g class="ap"'+A(9)+'>'+pth('M'+xb+' 368 H'+(xf-20)+' L'+xf+' 415 L'+(xf-20)+' 462 H'+xb,'#f1ece1',T,4,' stroke-dasharray="3 14" fill-opacity=".7"')+'</g>';
  s+='<g class="ap"'+A(9.8)+'><g transform="rotate(1.5 '+((xb+xf)/2)+' 270)"><rect x="'+(xb+10)+'" y="228" width="'+(xf-xb+30)+'" height="84" fill="#fff" stroke="'+T+'" stroke-opacity=".35" stroke-width="2"/>'+sTx((xb+xf)/2+25,286,'a longa Idade Média de Le Goff',44,700)+'</g></g>';
  // datas
  const dt=(x,a,t,sub,anc)=>'<g class="ap"'+A(a)+'>'+pth('M'+x+' 500 V560','none',T,4,' stroke-dasharray="2 9"')+circ(x,500,10,'#e8572a',T,3)+sTx(x,650,t,100,700,anc||'middle')+sTx(x,712,sub,42,500,anc||'middle','#2f2e2a')+'</g>';
  s+=dt(x0,1.2,'476','queda do Império do Ocidente','start');
  s+=dt(xb,5.4,'1500','fim da Idade Média, pelo costume','middle');
  s+=dt(xf,10.4,'1789','Revolução Francesa','middle');
  return esq(p,W,H,s,'Fita do tempo da Idade Média: Alta Idade Média, do século V ao IX ou X, e Baixa, até o século XV; a emenda varia conforme o livro; uma fita pontilhada vai até 1789, a longa Idade Média de Le Goff');
};

/* ---------- etapa 2: as três capas de livro sobre a Idade Média ---------- */
function capaCorpo(v){
  let s='';
  if(v==='trevas'){
    s+=pth('M14 10 L626 6 L632 850 L10 854Z','#17171a',T,6);
    s+=pth('M14 10 L84 8 L82 852 L10 854Z','#0c0c0e',T,4)+pth('M30 120 H70 M30 740 H70','none','#5a5750',4);
    for(let i=0;i<7;i++)s+=pth('M110 '+(110+i*78)+' H'+(560-i*14%60),'none','#ffffff',2,' stroke-opacity=".07"');
    s+=pth('M470 130 A98 98 0 1 0 470 326 A76 76 0 1 1 470 130Z','#e4dfcd',null,0);
    [[150,160],[240,110],[330,250],[170,330],[560,420],[250,440],[460,470],[130,520]].forEach((q,i)=>{const r=i%3?9:14;s+=pth('M'+q[0]+' '+(q[1]-r*1.6)+' L'+(q[0]+r*.5)+' '+(q[1]-r*.5)+' L'+(q[0]+r*1.6)+' '+q[1]+' L'+(q[0]+r*.5)+' '+(q[1]+r*.5)+' L'+q[0]+' '+(q[1]+r*1.6)+' L'+(q[0]-r*.5)+' '+(q[1]+r*.5)+' L'+(q[0]-r*1.6)+' '+q[1]+' L'+(q[0]-r*.5)+' '+(q[1]-r*.5)+'Z','#ece6cf',null,0);});
    s+=pth('M100 560 C200 520 300 560 400 530 C480 506 560 540 616 520 V640 H100Z','#0a0a0b',null,0);
  }else if(v==='romantico'){
    s+=pth('M14 10 L626 6 L632 850 L10 854Z','#ead9b0',T,6)+pth('M14 10 L84 8 L82 852 L10 854Z','#a8452f',T,4)+pth('M30 120 H70 M30 740 H70','none','#f1e1b5',4);
    s+=pth('M120 130 C170 110 230 118 270 138','none',T,3,' stroke-opacity=".5"')+pth('M420 100 C470 84 540 92 584 114','none',T,3,' stroke-opacity=".5"');
    // colina
    s+=pth('M96 640 C160 560 260 520 340 520 C440 520 520 560 620 620 V660 H96Z','#9db36a',T,4)+hach('M440 540 C520 560 580 600 620 620 V660 H500Z','cm-h1',.4);
    // muralha com ameias
    s+=pth('M170 560 V446 H196 V430 H222 V446 H248 V430 H274 V446 H300 V430 H326 V446 H352 V430 H378 V446 H404 V430 H430 V446 H456 V560Z','#d9cdb0',T,4);
    s+=pth('M276 560 V504 C276 484 324 484 324 504 V560Z','#4a3a28',T,3.5);
    // torres com telhados cônicos
    const torre=(x,w,y,hc,flagY)=>{
      let t=pth('M'+x+' 560 V'+y+' H'+(x+w)+' V560Z','#e4d8bb',T,4)+hach('M'+(x+w-16)+' '+y+' H'+(x+w)+' V560 H'+(x+w-20)+'Z','cm-h1',.4);
      t+=pth('M'+(x-12)+' '+y+' L'+(x+w/2)+' '+(y-hc)+' L'+(x+w+12)+' '+y+'Z','#b4472f',T,4);
      t+=pth('M'+(x+w/2)+' '+(y-hc)+' V'+(y-hc-46),'none',T,4)+pth('M'+(x+w/2)+' '+(y-hc-46)+' C'+(x+w/2+22)+' '+(y-hc-58)+' '+(x+w/2+34)+' '+(y-hc-34)+' '+(x+w/2+58)+' '+(y-hc-44)+' L'+(x+w/2+52)+' '+(y-hc-20)+' C'+(x+w/2+32)+' '+(y-hc-12)+' '+(x+w/2+20)+' '+(y-hc-34)+' '+(x+w/2)+' '+(y-hc-22)+'Z','#e8572a',T,3);
      t+=pth('M'+(x+w/2-6)+' '+(y+46)+' V'+(y+76)+' M'+(x+w/2+6)+' '+(y+46)+' V'+(y+76),'none',T,5);
      return t;};
    s+=torre(160,70,330,120)+torre(430,70,350,110)+torre(280,80,250,150);
    s+=pth('M150 640 C170 610 200 600 230 604','none',T,3,' stroke-opacity=".6"');
    // árvores
    [[140,560],[520,575]].forEach(q=>{s+=pth('M'+q[0]+' '+q[1]+' V'+(q[1]-34),'none',T,5)+circ(q[0],q[1]-52,28,'#6f9a4a',T,3.5);});
  }else{
    s+=pth('M14 10 L626 6 L632 850 L10 854Z','#d9e6e1',T,6)+pth('M14 10 L84 8 L82 852 L10 854Z','#2f6f7a',T,4)+pth('M30 120 H70 M30 740 H70','none','#e9f1ee',4);
    // vitral em rosácea
    const cx=210,cy=190;
    s+=circ(cx,cy,100,'#fbf6e8',T,5);
    const cores=['#d63a22','#2f6f7a','#e4b13a','#6f9a4a','#8b5aa8','#d63a22','#2f6f7a','#e4b13a'];
    for(let i=0;i<8;i++){const a0=i/8*Math.PI*2,a1=(i+1)/8*Math.PI*2;
      s+=pth('M'+cx+' '+cy+' L'+(cx+Math.cos(a0)*92).toFixed(1)+' '+(cy+Math.sin(a0)*92).toFixed(1)+' A92 92 0 0 1 '+(cx+Math.cos(a1)*92).toFixed(1)+' '+(cy+Math.sin(a1)*92).toFixed(1)+'Z',cores[i],T,3.5,' fill-opacity=".85"');}
    s+=circ(cx,cy,36,'#fbf6e8',T,4)+circ(cx,cy,12,'#d63a22',T,3);
    // arado
    s+=pth('M96 560 C200 540 400 540 560 560','none',T,5);
    s+=pth('M150 500 L420 410','none','#8b5a2b',16)+pth('M150 500 L420 410','none',T,3);
    s+=pth('M170 500 L100 420 L124 410 L194 488','#8b5a2b',T,3.5)+pth('M232 470 L330 548 L392 548 L350 520 L278 452Z','#7a7a80',T,4)+pth('M330 548 L430 536 L392 548Z','#55555a',T,3);
    s+=pth('M425 408 L470 392','none',T,6);
    // lupa
    s+=circ(330,440,124,'rgba(255,255,255,.28)',T,12)+circ(330,440,110,'none','#ffffff',4)+pth('M418 528 L520 630','none','#6b4423',30)+pth('M418 528 L520 630','none',T,4);
    // livro aberto
    s+=pth('M330 700 C380 670 450 676 480 700 V790 C450 768 380 764 330 790Z','#fbf6e8',T,4)+pth('M480 700 C510 676 580 670 626 700 V790 C580 764 510 768 480 790Z','#f1e6c4',T,4)+tinta('M350 716 C390 700 436 704 464 720 M350 740 C390 724 436 728 464 744 M500 720 C528 704 572 700 606 716 M500 744 C528 728 572 724 606 740');
  }
  return s;
}
C.tipos.capa=p=>{
  const W=640,H=860,v=p.v||'trevas',ls=p.linhas||[''];
  let s=capaCorpo(v);
  const n=ls.length,sz=p.tam||46,lh=Math.round(sz*1.2),hh=n*lh+44,y0=H-60-hh;
  s+='<g transform="rotate(-2 330 '+(y0+hh/2)+')"><rect x="52" y="'+y0+'" width="556" height="'+hh+'" fill="#fff" stroke="'+T+'" stroke-opacity=".4" stroke-width="2"/>'+
    ls.map((l,i)=>sTx(330,y0+34+sz*.72+i*lh,l,sz,700)).join('')+'</g>';
  return livre(p,W,H,s,'Capa de livro sobre a Idade Média: '+ls.join(' '));
};

/* ---------- etapa 3: gráfico de bonequinhos, vinte pessoas e só uma delas germânica ---------- */
C.tipos.pessoas20=p=>{
  const W=1500,H=640;
  let s=sTx(50,86,'o Império visto como vinte pessoas',50,400,'start',T,SERIF);
  const gx=134,x0=110,ys=[300,500];
  for(let i=0;i<20;i++){
    const col=i%10,lin=Math.floor(i/10),germ=(i===16);
    s+=pessoa(x0+col*gx,ys[lin],170,germ?'#e8572a':'#c9c2b0',' class="pop"'+A((.5+i*.18).toFixed(2)));
  }
  s+='<g class="ap"'+A(5)+'>'+circ(x0+6*gx,ys[1]-96,70,'none',AM,10)+'</g>';
  s+=etq(560,545,660,76,['germânicos: cerca de 5%'],44,5.6,-1.5);
  s+=sTx(1450,606,'cada boneco: cerca de 5%',34,600,'end','#3a3935');
  return esq(p,W,H,s,'Gráfico de bonequinhos: de vinte pessoas, só uma é germânica, cerca de 5% da população');
};

/* ---------- etapa 4: o comitatus, o chefe no centro e os guerreiros em roda ---------- */
C.tipos.comitatus=p=>{
  const W=1000,H=900,cx=500,cy=470;
  let s=sTx(50,100,'comitatus',92,400,'start',T,SERIF)+'<rect class="wp"'+A(.3)+' x="40" y="112" width="500" height="16" fill="'+AM+'"/>';
  const N=8,rx=330,ry=250,pts=[];
  for(let i=0;i<N;i++){const a=-Math.PI/2+i/N*Math.PI*2+.2;pts.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry+10]);}
  pts.forEach((q,i)=>{s+='<path class="ap"'+A((1+i*.25).toFixed(2))+' d="M'+cx+' '+cy+' L'+q[0].toFixed(0)+' '+(q[1]-60).toFixed(0)+'" fill="none" stroke="'+T+'" stroke-width="4.5" stroke-dasharray="14 12" stroke-linecap="round" stroke-opacity=".7"/>';});
  pts.forEach((q,i)=>{
    const a=(1.2+i*.25).toFixed(2);
    s+='<g class="pop"'+A(a)+'>'+pth('M'+(q[0]+46)+' '+(q[1]-132)+' V'+(q[1]+4),'none',T,5)+pth('M'+(q[0]+46)+' '+(q[1]-150)+' L'+(q[0]+38)+' '+(q[1]-128)+' H'+(q[0]+54)+'Z',T,T,2)+pessoa(q[0],q[1],136,'#c9c2b0')+circ(q[0]-8,q[1]-52,26,'#8b5a2b',T,4)+circ(q[0]-8,q[1]-52,7,'#c9a45a',T,2)+'</g>';
  });
  s+='<g class="pop"'+A(.8)+'>'+pessoa(cx,cy+90,230,'#e8572a')+pth('M'+(cx-52)+' '+(cy-54)+' L'+(cx-40)+' '+(cy-80)+' L'+(cx-18)+' '+(cy-62)+' L'+cx+' '+(cy-88)+' L'+(cx+18)+' '+(cy-62)+' L'+(cx+40)+' '+(cy-80)+' L'+(cx+52)+' '+(cy-54)+'Z','#e4b13a',T,3.4)+'</g>';
  s+=etq(60,775,380,70,['guerreiros juram fidelidade'],34,3.4,-1);
  s+=etq(500,800,440,70,['o chefe reparte os despojos'],34,4.2,1);
  return esq(p,W,H,s,'Esquema do comitatus: um chefe no centro e guerreiros em roda, ligados por linhas tracejadas');
};

/* ---------- etapa 4: cruz de traço fino sobre o mapa ---------- */
C.tipos.cruz=p=>{
  const W=500,H=700,d='M210 20 H290 V190 H440 V270 H290 V680 H210 V270 H60 V190 H210Z';
  let s=pth(d,'none','#6b1f12',7,' stroke-opacity=".62"')+pth('M222 40 H278 V202 H424 V258 H278 V664 H222 V258 H76 V202 H222Z','none','#6b1f12',3,' stroke-opacity=".5"');
  return livre(p,W,H,s,'Cruz de traço fino sobre o mapa: a Igreja como elo entre romanos e germânicos',' cm-sem-ar');
};

/* ---------- etapa 7: mãos de papel trocam uma coroa e um mapa da Itália ---------- */
C.tipos.maos=p=>{
  const W=900,H=520,pele='#f1d3a8',manga='#2f6f7a';
  const dedo=(d)=>pth(d,'none',T,17)+pth(d,'none',pele,11);
  const mao=(cor)=>{
    let m=pth('M0 262 H70 V350 H0Z',cor,T,4.5)+hach('M40 262 H70 V350 H40Z','cm-h1',.4);
    m+=pth('M70 268 C120 252 190 252 236 262 L240 336 C190 350 120 350 70 344Z',pele,T,4.5);
    m+=dedo('M236 272 H300')+dedo('M238 292 H312')+dedo('M238 312 H306')+dedo('M236 330 H292');
    m+=dedo('M120 262 C140 232 168 226 190 238');
    m+=tinta('M110 300 C150 296 190 296 226 300',1.6);
    return m;};
  const coroa='<g class="pop"'+A(.8)+'>'+pth('M120 250 H230 V214 H120Z','#e4b13a',T,4)+pth('M120 214 L122 152 L152 188 L176 134 L202 188 L230 152 L232 214Z','#e4b13a',T,4)+hach('M200 150 L232 152 V250 H200Z','cm-h1',.4)+
    [[122,148],[176,130],[230,148]].map(q=>circ(q[0],q[1],9,'#f6f1e4',T,3.4)).join('')+circ(146,232,9,'#c93a2a',T,2.4)+circ(176,232,9,'#2f6f7a',T,2.4)+circ(206,232,9,'#c93a2a',T,2.4)+'</g>';
  // Itália em recorte de papel (bota), com o contorno tracejado
  const it='M0 0 C14 -14 34 -22 52 -36 C64 -46 78 -50 92 -44 C100 -38 96 -28 88 -22 C94 -8 104 6 118 16 C130 24 142 20 150 28 C146 40 132 44 118 40 C106 36 96 26 86 18 C76 24 74 38 78 52 C82 70 76 90 66 112 C60 124 48 126 46 112 C46 96 52 80 46 64 C40 44 22 30 8 22 C2 16 -2 8 0 0Z';
  const italia='<g class="pop"'+A(1.6)+'><g transform="translate(560 160) scale(1.25)">'+pth(it,'#e9dcb4',T,4)+hach('M86 18 C96 26 106 36 118 40 C104 70 90 70 78 52Z','cm-h1',.35)+'<path d="'+it+'" transform="translate(4 4)" fill="none" stroke="'+T+'" stroke-width="2" stroke-dasharray="5 6" stroke-opacity=".5"/>'+circ(44,12,6,'#e8572a',T,2.4)+'</g></g>';
  let s='<g class="ap"'+A(.2)+'><g transform="translate(40 0)">'+mao(manga)+'</g></g>'+coroa.replace(/<g class="pop"/,'<g class="pop" transform="translate(40 10)"');
  s+='<g class="ap"'+A(.2)+'><g transform="translate(860 0) scale(-1 1)">'+mao('#c94d3d')+'</g></g>';
  s+=italia;
  s+=seta('M300 120 C400 40 500 40 590 100','M552 70 L596 104 L546 120',2.4,'#e8572a',8)+seta('M640 460 C560 520 420 520 330 450','M360 420 L326 450 L374 470',3.2,'#e8572a',8);
  return livre(p,W,H,s,'Duas mãos de papel trocam uma coroa e um mapa da Itália: Igreja e carolíngios, apoio mútuo');
};

/* ---------- etapa 8: página de manuscrito com a minúscula carolíngia ampliada ---------- */
C.tipos.manuscrito=p=>{
  const W=640,H=860,r=C.rng('manuscrito');
  let s=pth('M26 18 L610 10 L620 840 L18 850Z','#efe2bd',T,5)+hach('M560 14 L610 10 L620 840 L540 846Z','cm-h1',.2);
  s+=pth('M60 60 H580 M60 100 H580','none','#b59a62',2,' stroke-opacity=".5"')+pth('M96 40 V830','none','#c0472f',2.4,' stroke-opacity=".6"');
  // rubrica e linhas de texto, desenhadas como traços de tinta em blocos que lembram palavras
  s+=pth('M120 88 H300 M330 88 H430','none','#b0392a',9,' stroke-opacity=".85"');
  for(let i=0;i<14;i++){
    const y=150+i*38;let d='',x=120;
    while(x<540){const w=26+Math.floor(r()*74);d+='M'+x+' '+y+' H'+Math.min(x+w,556);x+=w+18;}
    s+=pth(d,'none','#4a3826',9,' stroke-opacity=".78"');
  }
  // palavra de onde sai a lente
  s+=pth('M120 330 H210','none','#4a3826',9)+'<path class="dr"'+A(1.8)+' pathLength="1" d="M214 320 C260 290 300 300 330 360" fill="none" stroke="'+T+'" stroke-width="3.6" stroke-dasharray="1" stroke-linecap="round"/>';
  // lente com a letra grande, circulada em amarelo
  s+='<g class="pop"'+A(1.2)+'>'+circ(400,560,168,'#fffdf6',T,6)+sTx(400,664,'a',330,400,'middle','#4a3826',SERIF)+pth('M524 684 L610 770','none','#6b4423',30)+pth('M524 684 L610 770','none',T,4)+'</g>';
  s+='<circle class="dr"'+A(2.4)+' pathLength="1" cx="400" cy="560" r="186" fill="none" stroke="'+AM+'" stroke-width="16" stroke-linecap="round"/>';
  return esq(p,W,H,s,'Página de manuscrito carolíngio, com uma letra a minúscula ampliada e circulada em amarelo');
};

/* ---------- etapa 9: castelos com círculo de alcance, brotando por toda a Europa ---------- */
const COR_AL=['#ec6f5e','#ffd83d','#6fb0b5','#9bc26a','#b7a3cc'];
function castelo(x,y,k){
  // torre central alta, duas torres baixas e ameias; (x,y) é o centro da base
  const s=k||1,X=a=>(x+a*s).toFixed(1),Y=b=>(y+b*s).toFixed(1);
  const corpo=[[-24,0],[-24,-22],[-16,-22],[-16,-28],[-9,-28],[-9,-22],[-4,-22],[-4,-44],[-9,-44],[-9,-52],[-2,-52],[-2,-44],[2,-44],[2,-52],[9,-52],[9,-44],[4,-44],[4,-22],[9,-22],[9,-28],[16,-28],[16,-22],[24,-22],[24,0]];
  return pth('M'+corpo.map(q=>X(q[0])+' '+Y(q[1])).join(' L')+'Z','#e9dfc4',T,2.6*s)+
    pth('M'+X(-5)+' '+Y(0)+' V'+Y(-12)+' C'+X(-5)+' '+Y(-21)+' '+X(5)+' '+Y(-21)+' '+X(5)+' '+Y(-12)+' V'+Y(0)+'Z','#4a3a28',T,1.6*s)+
    pth('M'+X(-1.5)+' '+Y(-36)+' V'+Y(-32)+' M'+X(-18)+' '+Y(-14)+' V'+Y(-10)+' M'+X(18)+' '+Y(-14)+' V'+Y(-10),'none',T,2.2*s);
}
C.tipos.castelos=p=>{
  const W=p.w,H=p.h,pts=p.pts||[],S=p.s||3,base=p.base||'historia-mapa-mundo',ox=p.mx||0,oy=p.my||0;
  const rad=p.raio||30,k=p.k||1;
  let s='<style>.cm-cs .c{opacity:0}.cm-cs:not(.fora) .c{animation:m2c .8s cubic-bezier(.2,.9,.3,1.3) var(--a,0s) both}.cm-cs .c g{transform-box:fill-box;transform-origin:50% 100%}'+
    '@keyframes m2c{from{opacity:0;transform:scale(.2)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.cm-cs .c{opacity:1!important;animation:none!important}}</style>';
  pts.forEach((q,i)=>{
    const m=C.lonlat(base,q[0],q[1]),x=ox+m[0]*S-p.x,y=oy+m[1]*S-p.y,cor=COR_AL[i%COR_AL.length],a=((p.atraso||0)+i*(p.passo||.4)).toFixed(2);
    s+='<g class="c" style="--a:'+a+'s"><circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+rad+'" fill="'+cor+'" fill-opacity=".5" stroke="'+T+'" stroke-opacity=".5" stroke-width="2.6" stroke-dasharray="7 6" style="mix-blend-mode:multiply"/>'+
      '<g>'+castelo(x,y+12*k,1.35*k)+'</g></g>';
  });
  return {cls:'cm-icone cm-cs',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Castelos com círculos de alcance cobrindo a Europa')+'" style="overflow:visible">'+s+'</svg>'};
};

/* ---------- etapa 6: Constantinopla riscada, caída em 1453 ---------- */
C.tipos.riscado=p=>{
  const W=700,H=300;
  let s='<g transform="rotate(-1.5 350 90)"><rect x="10" y="20" width="680" height="130" fill="#fff" stroke="'+T+'" stroke-opacity=".35" stroke-width="2"/>'+sTx(350,112,'Constantinopla',84,700)+'</g>';
  s+='<path class="dr"'+A(1)+' pathLength="1" d="M30 118 C180 84 380 84 676 108" fill="none" stroke="#d63a22" stroke-width="13" stroke-linecap="round"/>'+
    '<path class="dr"'+A(1.8)+' pathLength="1" d="M40 66 C220 150 420 130 664 74" fill="none" stroke="#d63a22" stroke-width="11" stroke-linecap="round"/>';
  s+='<g class="ap"'+A(2.6)+'><g transform="rotate(1.2 350 235)"><rect x="90" y="178" width="520" height="92" fill="'+AM+'" stroke="'+T+'" stroke-opacity=".35" stroke-width="2"/>'+sTx(350,238,'turcos otomanos, 1453',50,700)+'</g></g>';
  return livre(p,W,H,s,'Constantinopla riscada: tomada pelos turcos otomanos em 1453');
};

})();
