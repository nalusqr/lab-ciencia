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

/* coroa sóbria: aro de ouro liso, três pontas e uma única pedra; (x,y) é o canto superior esquerdo da faixa, largura 100*k */
const coroaS=(x,y,k,a)=>'<g'+(a||'')+'><g transform="translate('+x+' '+y+') scale('+k+')">'+
  pth('M0 30 L0 -4 L25 16 L50 -16 L75 16 L100 -4 L100 30Z','#e4b13a',T,3.4)+pth('M0 30 H100 V56 H0Z','#e4b13a',T,3.4)+
  hach('M72 16 L100 -4 V56 H72Z','cm-h1',.35)+circ(50,43,6.5,'#a8281f',T,2.2)+'</g></g>';

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
  s+=pth('M50 120 H150 V144 H50Z','#8d9399',T,3.2)+hach('M120 120 H150 V144 H120Z','cm-h1',.55)+tinta('M50 132 H150',1.2);
  s+=pth('M93 144 V188 C93 192 107 192 107 188 V144Z','#8d9399',T,2.8)+tinta('M100 146 V186',1.2);
  [[62,132],[80,132],[120,132],[138,132]].forEach(q=>{s+=circ(q[0],q[1],3,'#d9dcdf',T,1.6);});
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
  // coroa: aro de ouro liso, três pontas, uma pedra
  s+=coroaS(138,128,.56);
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
  const r=h*.14,hy=y-h+r,top=y-h*.72,w=h*.27,pe=h*.42;   // cabeça, ombros arredondados, braços e duas pernas
  const k=h*.09,tz=top;
  const d='M'+(x-w).toFixed(1)+' '+(tz+k).toFixed(1)+' Q'+(x-w).toFixed(1)+' '+tz.toFixed(1)+' '+(x-w+k).toFixed(1)+' '+tz.toFixed(1)+' H'+(x+w-k).toFixed(1)+' Q'+(x+w).toFixed(1)+' '+tz.toFixed(1)+' '+(x+w).toFixed(1)+' '+(tz+k).toFixed(1)+
    ' V'+(tz+pe*.9).toFixed(1)+' H'+(x+w*.62).toFixed(1)+' V'+(y-h*.28).toFixed(1)+' H'+(x+w*.62).toFixed(1)+' V'+y+' H'+(x+w*.1).toFixed(1)+' V'+(y-h*.28).toFixed(1)+' H'+(x-w*.1).toFixed(1)+' V'+y+' H'+(x-w*.62).toFixed(1)+' V'+(y-h*.28).toFixed(1)+' H'+(x-w*.62).toFixed(1)+' V'+(tz+pe*.9).toFixed(1)+' H'+(x-w).toFixed(1)+'Z';
  return '<g'+(ex||'')+'>'+circ(x.toFixed(1),hy.toFixed(1),r.toFixed(1),fill,T,3)+pth(d,fill,T,3)+'</g>';
};

/* ---------- etapa 1: a fita da Idade Média, de 476 a 1500, e a longa Idade Média de Le Goff ---------- */
C.tipos.idade=p=>{
  if(p.m)return idadeM(p);
  const W=3700,H=1330,X=y=>Math.round(150+(y-476)*2.5),x0=X(476),xj=X(950),xb=X(1500),xf=X(1789);
  let s='';
  s+='<rect class="wp"'+A(.6)+' x="120" y="40" width="1160" height="210" fill="'+AM+'" opacity=".85"/>'+sTx(140,205,'Idade Média',190,400,'start',T,SERIF);
  s+='<g class="wp"'+A(1.6)+'>'+pth('M'+x0+' 450 H'+xj+' V770 H'+x0+'Z','#e9dcb4',T,6)+hach('M'+(xj-90)+' 450 H'+xj+' V770 H'+(xj-90)+'Z','cm-h1',.3)+'</g>';
  s+='<g class="ap"'+A(2.4)+'>'+sTx((x0+xj)/2,592,'Alta Idade Média',120,700)+sTx((x0+xj)/2,690,'século V ao IX ou X',84,500,'middle','#2f2e2a')+'</g>';
  s+='<g class="wp"'+A(4)+'>'+pth('M'+xj+' 450 H'+xb+' V770 H'+xj+'Z','#d9d6cf',T,6)+hach('M'+(xb-90)+' 450 H'+xb+' V770 H'+(xb-90)+'Z','cm-h1',.3)+'</g>';
  s+='<g class="ap"'+A(4.8)+'>'+sTx((xj+xb)/2,592,'Baixa Idade Média',120,700)+sTx((xj+xb)/2,690,'até o século XV',84,500,'middle','#2f2e2a')+'</g>';
  // a emenda: etiqueta de papel com fio
  s+='<g class="ap"'+A(7)+'>'+pth('M'+xj+' 392 V452','none',T,5)+circ(xj,452,12,T)+
    '<g transform="rotate(-1.5 '+xj+' 330)"><rect x="'+(xj-720)+'" y="270" width="1440" height="122" fill="#fff" stroke="'+T+'" stroke-opacity=".35" stroke-width="2"/>'+sTx(xj,356,'século IX ou X, conforme o livro',86,700)+'</g></g>';
  // a fita fina e pontilhada, de 1500 até 1789
  s+='<g class="ap"'+A(9)+'>'+pth('M'+xb+' 500 H'+(xf-20)+' L'+xf+' 610 L'+(xf-20)+' 720 H'+xb,'#f1ece1',T,5,' stroke-dasharray="3 16" fill-opacity=".7"')+'</g>';
  s+='<g class="ap"'+A(9.8)+'><g transform="rotate(1.2 '+((xb+xf)/2)+' 350)"><rect x="'+(xb+10)+'" y="236" width="'+(xf-xb+34)+'" height="206" fill="#fff" stroke="'+T+'" stroke-opacity=".35" stroke-width="2"/>'+
    sTx((xb+xf)/2+27,330,'a longa Idade Média',74,700)+sTx((xb+xf)/2+27,418,'de Le Goff',74,700)+'</g></g>';
  // datas
  const dt=(x,a,t,subs,anc,xt)=>'<g class="ap"'+A(a)+'>'+pth('M'+x+' 770 V850','none',T,5,' stroke-dasharray="2 10"')+circ(x,770,13,'#e8572a',T,3)+sTx(xt!=null?xt:x,1050,t,180,700,anc||'middle')+
    subs.map((l,i)=>sTx(xt!=null?xt:x,1144+i*84,l,76,500,anc||'middle','#2f2e2a')).join('')+'</g>';
  s+=dt(x0,1.2,'476',['queda do Império do Ocidente'],'start',x0-10);
  s+=dt(xb,5.4,'1500',['fim da Idade Média,','pelo costume'],'middle',xb-110);
  s+=dt(xf,10.4,'1789',['Revolução Francesa'],'end',3690);
  return esq(p,W,H,s,'Fita do tempo da Idade Média: Alta Idade Média, do século V ao IX ou X, e Baixa, até o século XV; a emenda varia conforme o livro; uma fita pontilhada vai até 1789, a longa Idade Média de Le Goff');
};
/* versão do celular: duas faixas empilhadas (Alta em cima, Baixa embaixo) e a fita de Le Goff em uma terceira linha */
function idadeM(p){
  const W=1220,H=1520,X1=y=>Math.round(60+(y-476)*1.9),X2=y=>Math.round(60+(y-950)*1.9),x0=60,xj=X1(950),xb=X2(1500);
  let s='';
  s+='<rect class="wp"'+A(.6)+' x="40" y="30" width="700" height="136" fill="'+AM+'" opacity=".85"/>'+sTx(56,142,'Idade Média',120,400,'start',T,SERIF);
  s+='<g class="wp"'+A(1.6)+'>'+pth('M'+x0+' 220 H'+xj+' V400 H'+x0+'Z','#e9dcb4',T,5)+hach('M'+(xj-60)+' 220 H'+xj+' V400 H'+(xj-60)+'Z','cm-h1',.3)+'</g>';
  s+='<g class="ap"'+A(2.4)+'>'+sTx((x0+xj)/2,302,'Alta Idade Média',64,700)+sTx((x0+xj)/2,368,'século V ao IX ou X',54,500,'middle','#2f2e2a')+'</g>';
  s+='<g class="ap"'+A(1.2)+'>'+pth('M'+x0+' 400 V440','none',T,4,' stroke-dasharray="2 9"')+circ(x0,400,11,'#e8572a',T,3)+sTx(x0,526,'476',84,700,'start')+sTx(x0,584,'queda do Império',54,500,'start','#2f2e2a')+sTx(x0,642,'do Ocidente',54,500,'start','#2f2e2a')+'</g>';
  s+='<g class="ap"'+A(7)+'>'+pth('M'+xj+' 400 V452','none',T,4)+circ(xj,400,10,T)+
    '<g transform="rotate(-1.5 840 516)"><rect x="520" y="452" width="640" height="130" fill="#fff" stroke="'+T+'" stroke-opacity=".35" stroke-width="2"/>'+sTx(840,508,'século IX ou X,',54,700)+sTx(840,566,'conforme o livro',54,700)+'</g></g>';
  s+='<g class="wp"'+A(4)+'>'+pth('M'+x0+' 690 H'+xb+' V870 H'+x0+'Z','#d9d6cf',T,5)+hach('M'+(xb-60)+' 690 H'+xb+' V870 H'+(xb-60)+'Z','cm-h1',.3)+'</g>';
  s+='<g class="ap"'+A(4.8)+'>'+sTx((x0+xb)/2,772,'Baixa Idade Média',64,700)+sTx((x0+xb)/2,838,'até o século XV',54,500,'middle','#2f2e2a')+'</g>';
  s+='<g class="ap"'+A(5.4)+'>'+pth('M'+xb+' 870 V910','none',T,4,' stroke-dasharray="2 9"')+circ(xb,870,11,'#e8572a',T,3)+sTx(1170,996,'1500',84,700,'end')+sTx(1170,1054,'fim da Idade Média,',54,500,'end','#2f2e2a')+sTx(1170,1112,'pelo costume',54,500,'end','#2f2e2a')+'</g>';
  s+='<g class="ap"'+A(9)+'>'+pth('M'+x0+' 1200 H1085 L1105 1262 L1085 1324 H'+x0,'#f1ece1',T,4,' stroke-dasharray="3 14" fill-opacity=".7"')+'</g>';
  s+='<g class="ap"'+A(9.8)+'><rect x="160" y="1206" width="860" height="112" fill="#fff" stroke="'+T+'" stroke-opacity=".35" stroke-width="2"/>'+sTx(590,1256,'a longa Idade Média',54,700)+sTx(590,1308,'de Le Goff, até 1789',54,700)+'</g>';
  s+='<g class="ap"'+A(10.4)+'>'+pth('M1105 1324 V1360','none',T,4,' stroke-dasharray="2 9"')+circ(1105,1324,11,'#e8572a',T,3)+sTx(1170,1446,'1789',84,700,'end')+sTx(1170,1500,'Revolução Francesa',54,500,'end','#2f2e2a')+'</g>';
  return esq(p,W,H,s,'Fita do tempo da Idade Média em duas faixas empilhadas: Alta, do século V ao IX ou X, e Baixa, até o século XV; a emenda varia conforme o livro; uma fita pontilhada vai até 1789, a longa Idade Média de Le Goff');
}

/* ---------- etapa 2: as três capas de livro sobre a Idade Média ---------- */
function capaCorpo(v){
  let s='';
  if(v==='trevas'){
    s+=pth('M14 10 L626 6 L632 850 L10 854Z','#17171a',T,6);
    s+=pth('M14 10 L84 8 L82 852 L10 854Z','#0c0c0e',T,4)+pth('M30 120 H70 M30 740 H70','none','#5a5750',4);
    for(let i=0;i<7;i++)s+=pth('M110 '+(110+i*78)+' H'+(560-i*14%60),'none','#ffffff',2,' stroke-opacity=".07"');
    s+=circ(440,220,84,'#e4dfcd',null,0)+circ(478,196,74,'#17171a',null,0);
    [[150,160],[240,110],[330,250],[170,330],[560,420],[250,440],[460,470],[130,520]].forEach((q,i)=>{const r=i%3?9:14;s+=pth('M'+q[0]+' '+(q[1]-r*1.6)+' L'+(q[0]+r*.5)+' '+(q[1]-r*.5)+' L'+(q[0]+r*1.6)+' '+q[1]+' L'+(q[0]+r*.5)+' '+(q[1]+r*.5)+' L'+q[0]+' '+(q[1]+r*1.6)+' L'+(q[0]-r*.5)+' '+(q[1]+r*.5)+' L'+(q[0]-r*1.6)+' '+q[1]+' L'+(q[0]-r*.5)+' '+(q[1]-r*.5)+'Z','#ece6cf',null,0);});
    s+=pth('M84 600 C170 540 250 560 330 520 C420 480 520 540 626 500 V700 H84Z','#26262c',null,0)+pth('M84 650 C200 610 320 640 430 600 C500 576 570 600 626 590 V760 H84Z','#1f1f24',null,0);
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
    const cx=190,cy=200;
    s+=circ(cx,cy,96,'#fbf6e8',T,5);
    s+=circ(cx,cy,92,'#1f3a66',T,4);
    for(let i=0;i<12;i++){const g=i*30;
      s+='<ellipse cx="'+cx+'" cy="'+(cy-56)+'" rx="19" ry="33" transform="rotate('+g+' '+cx+' '+cy+')" fill="'+(i%2?'#e0a02f':'#7a1f32')+'" stroke="'+T+'" stroke-width="2.6"/>';
      const a0=(g+15)*Math.PI/180;
      s+=pth('M'+(cx+Math.sin(a0)*34).toFixed(1)+' '+(cy-Math.cos(a0)*34).toFixed(1)+' L'+(cx+Math.sin(a0)*88).toFixed(1)+' '+(cy-Math.cos(a0)*88).toFixed(1),'none','#f6e7b4',2.2,' stroke-opacity=".8"')+circ((cx+Math.sin(a0)*80).toFixed(1),(cy-Math.cos(a0)*80).toFixed(1),4.5,'#e0a02f',T,1.4);}
    s+=circ(cx,cy,92,'none',T,4)+circ(cx,cy,26,'#e0a02f',T,3.4)+circ(cx,cy,12,'#7a1f32',T,2.4);
    // livro aberto, no alto, à direita
    s+=pth('M330 150 C370 126 430 130 460 152 V232 C430 212 370 208 330 232Z','#fbf6e8',T,4)+pth('M460 152 C490 130 550 126 596 150 V230 C550 208 490 212 460 232Z','#f1e6c4',T,4)+tinta('M348 166 C380 152 424 154 446 168 M348 186 C380 172 424 174 446 188 M348 206 C380 192 424 194 446 208 M476 168 C500 154 544 152 578 166 M476 188 C500 174 544 172 578 186 M476 208 C500 194 544 192 578 206');
    // arado de roda, com a lupa centrada nele
    s+=pth('M96 594 C220 580 420 580 560 598','none',T,5);
    s+=circ(236,520,38,'#d8c08c',T,5)+pth('M236 482 V558 M198 520 H274 M209 493 L263 547 M263 493 L209 547','none',T,3)+circ(236,520,8,'#6b4423',T,3);
    s+=pth('M236 520 L440 432','none','#8b5a2b',17)+pth('M236 520 L440 432','none',T,3);
    s+=pth('M436 436 L486 352','none','#8b5a2b',13)+pth('M436 436 L486 352','none',T,3)+pth('M476 366 L506 380','none',T,6);
    s+=pth('M332 482 L342 572','none','#7a7a80',9)+pth('M332 482 L342 572','none',T,2.4);
    s+=pth('M326 574 L420 556 L392 518 L344 526Z','#7a7a80',T,3.6)+hach('M380 522 L420 556 L360 566Z','cm-h1',.5);
    // lupa
    s+=circ(366,462,128,'rgba(255,255,255,.22)',T,12)+circ(366,462,113,'none','#ffffff',4)+pth('M456 552 L540 634','none','#6b4423',28)+pth('M456 552 L540 634','none',T,4);
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
  const W=1500,H=720;
  let s=sTx(50,92,'o Império visto como vinte pessoas',60,400,'start',T,SERIF);
  const gx=134,x0=110,ys=[330,540];
  for(let i=0;i<20;i++){
    const col=i%10,lin=Math.floor(i/10),germ=(i===16);
    s+=pessoa(x0+col*gx,ys[lin],170,germ?'#e8572a':'#c9c2b0',' class="pop"'+A((.5+i*.18).toFixed(2)));
  }
  s+='<g class="ap"'+A(5)+'>'+circ(x0+6*gx,ys[1]-86,78,'none',AM,10)+'</g>';
  s+=etq(600,535,880,96,['germânicos: cerca de 5%'],64,5.6,-1.5);
  s+=sTx(50,690,'cada boneco: cerca de 5%',64,600,'start','#3a3935');
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
  s+='<g class="pop"'+A(.8)+'>'+pessoa(cx,cy+90,230,'#e8572a')+coroaS(cx-45,cy-176,.9)+'</g>';
  s+=etq(30,740,440,150,['guerreiros juram','fidelidade'],50,3.4,-1);
  s+=etq(520,750,450,150,['o chefe reparte','os despojos'],50,4.2,1);
  return esq(p,W,H,s,'Esquema do comitatus: um chefe no centro e guerreiros em roda, ligados por linhas tracejadas');
};

/* ---------- etapa 4: cruz pequena, no canto do mapa, ligada por seta tracejada ---------- */
C.tipos.cruz=p=>{
  const W=100,H=140,d='M40 6 H60 V40 H92 V60 H60 V134 H40 V60 H8 V40 H40Z';
  let s=pth(d,'#8c2f1f',T,5)+hach('M54 6 H60 V40 H92 V60 H54Z','cm-h1',.35)+pth('M45 14 V132','none','#d9a79a',2.4,' stroke-opacity=".8"');
  return livre(p,W,H,s,'Cruz pequena: a Igreja como elo entre romanos e germânicos',' cm-sem-ar');
};
/* ponto invisível, usado para ancorar um círculo no mapa */
C.tipos.alvo=p=>livre(p,10,10,'','Ponto do mapa',' cm-sem-ar');

/* ---------- etapa 7: a Igreja (mão com mitra) dá a coroa; os carolíngios dão a Itália em forma de bota ---------- */
/* contorno da Itália (longitude, latitude), traduzido em pontos de papel */
const ITA=[[7.0,44.1],[7.5,45.9],[9,46.3],[12.4,46.7],[13.7,46.5],[13.6,45.7],[12.3,44.9],[12.4,44.1],[13.6,43.6],[14.8,42.1],[16.2,41.9],[18.5,40.2],[17.1,40.5],[16.5,39.8],[17.1,39.1],[16.5,38.4],[15.7,37.9],[15.6,38.5],[15.7,40],[14.9,40.2],[13.7,41.2],[12.0,42.0],[10.5,43.2],[9.7,44.2],[8.0,43.9]];
const SIC=[[12.4,38.0],[13.5,38.2],[15.6,38.3],[15.1,36.7],[14.3,37.0],[12.7,37.7]];
const PAPA_P=[[10.9,42.4],[11.8,43.4],[12.4,44.5],[13.0,44.6],[13.5,43.6],[14.0,42.8],[13.2,42.0],[12.9,41.5],[12.2,41.3],[11.5,42.0]];
const ptsIt=(L)=>'M'+L.map(q=>((q[0]-6.5)*13.3).toFixed(1)+' '+((47-q[1])*18).toFixed(1)).join(' L')+'Z';
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
  // Itália: bota de papel; o miolo violeta são as terras do papa
  const it=ptsIt(ITA),sic=ptsIt(SIC);
  const bota='<g class="pop"'+A(1.4)+'><g transform="translate(612 40) scale(1.1)">'+'<defs>'+clipD('m2ita',it)+'</defs>'+pth(it,'#efe4c2',T,4)+pth(sic,'#efe4c2',T,4)+
    '<g clip-path="url(#m2ita)"><path d="'+ptsIt(PAPA_P)+'" fill="#8b5aa8" fill-opacity=".92"/></g>'+pth(it,'none',T,4)+'</g></g>';
  const mitra='<g class="pop"'+A(.5)+'>'+pth('M22 262 C22 204 40 160 62 126 C84 160 102 204 102 262Z','#f6f1e4',T,4)+pth('M22 236 H102','none','#e4b13a',9)+pth('M62 156 V206 M46 178 H78','none','#e4b13a',6)+tinta('M62 126 C54 150 50 176 50 204',1.6)+'</g>';
  let s='<g class="ap"'+A(.2)+'><g transform="translate(40 0)">'+mao(manga)+'</g></g>'+mitra+coroaS(122,184,1.1,' class="pop"'+A(.9));
  s+='<g class="ap"'+A(.2)+'><g transform="translate(860 0) scale(-1 1)">'+mao('#c94d3d')+'</g></g>';
  s+=bota;
  s+=seta('M262 134 C350 40 500 40 610 100','M570 64 L612 102 L562 116',2.6,'#e8572a',8)+seta('M600 470 C520 515 420 515 360 468','M392 438 L358 466 L404 484',3.4,'#e8572a',8);
  s+=etq(10,380,250,96,['papa'],62,3.8,-2)+etq(640,380,250,96,['Carlos Magno'],46,4.4,2);
  return livre(p,W,H,s,'A mão da Igreja, com a mitra do papa, dá a coroa; a mão do rei dos francos dá a Itália em forma de bota: apoio mútuo');
};

/* ---------- etapa 7: Carlos Martel, Pepino e Carlos Magno, ligados por setas ---------- */
C.tipos.linhagem=p=>{
  const card=(x,y,w,h,ls,a,g)=>'<g class="ap"'+A(a)+'><g transform="rotate('+g+' '+(x+w/2)+' '+(y+h/2)+')"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#fff" stroke="'+T+'" stroke-opacity=".4" stroke-width="2"/>'+
    ls.map((l,i)=>sTx(x+w/2,y+h/2-(ls.length-1)*30+i*60+14,l[0],l[1],l[2]||700)).join('')+'</g></g>';
  if(p.m){
    const W=620,H=700;
    let s=card(30,10,560,150,[['Carlos Martel',46],['(732)',46,500]],.3,-1)+card(30,250,560,200,[['Pepino, o Breve',46],['(751 a 768: terras',40,500],['ao papa, 756)',40,500]],1.2,1)+card(30,540,560,150,[['Carlos Magno',46],['(800)',46,500]],2.1,-1);
    s+=seta('M310 164 V244','M286 214 L310 246 L334 214',.6,'#e8572a',8)+seta('M310 454 V534','M286 504 L310 536 L334 504',1.6,'#e8572a',8);
    return livre(p,W,H,s,'Três nomes ligados por setas: Carlos Martel, 732; Pepino, o Breve, 751 a 768, com as terras ao papa em 756; Carlos Magno, 800');
  }
  const W=1300,H=230;
  let s=card(0,20,300,190,[['Carlos Martel',42],['(732)',42,500]],.3,-1)+card(400,20,500,190,[['Pepino, o Breve',44],['(751 a 768: terras',38,500],['ao papa, 756)',38,500]],1.2,.8)+card(1000,20,300,190,[['Carlos Magno',42],['(800)',42,500]],2.1,-1);
  s+=seta('M304 116 H396','M366 90 L398 116 L366 142',.6,'#e8572a',8)+seta('M904 116 H996','M966 90 L998 116 L966 142',1.6,'#e8572a',8);
  return livre(p,W,H,s,'Três nomes ligados por setas: Carlos Martel, 732; Pepino, o Breve, 751 a 768, com as terras ao papa em 756; Carlos Magno, 800');
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
    const m=C.lonlat(base,q[0],q[1]),x=ox+m[0]*S-p.x,y=oy+m[1]*S-p.y,cor='#a9793a',a=((p.atraso||0)+i*(p.passo||.4)).toFixed(2);
    s+='<g class="c" style="--a:'+a+'s"><circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+rad+'" fill="'+cor+'" fill-opacity=".2" stroke="#8a5f26" stroke-opacity=".35" stroke-width="2.4" stroke-dasharray="7 6"/>'+
      '<g>'+castelo(x,y+12*k,1.35*k)+'</g></g>';
  });
  return {cls:'cm-icone cm-cs',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Castelos com círculos de alcance cobrindo a Europa')+'" style="overflow:visible">'+s+'</svg>'};
};

/* ---------- etapa 6: Constantinopla riscada, caída em 1453 ---------- */
C.tipos.riscado=p=>{
  const W=700,H=300;
  let s='<g transform="rotate(-1.5 350 90)"><rect x="10" y="20" width="680" height="130" fill="#fff" stroke="'+T+'" stroke-opacity=".35" stroke-width="2"/>'+sTx(350,112,'Constantinopla',84,700)+'</g>';
  s+='<path class="dr"'+A(1)+' pathLength="1" d="M24 108 C200 100 420 102 676 106" fill="none" stroke="#d63a22" stroke-width="7" stroke-linecap="round"/>';
  s+='<g class="ap"'+A(2.6)+'><g transform="rotate(1.2 350 235)"><rect x="90" y="178" width="520" height="92" fill="'+AM+'" stroke="'+T+'" stroke-opacity=".35" stroke-width="2"/>'+sTx(350,238,'turcos otomanos, 1453',50,700)+'</g></g>';
  return livre(p,W,H,s,'Constantinopla riscada: tomada pelos turcos otomanos em 1453');
};

})();
