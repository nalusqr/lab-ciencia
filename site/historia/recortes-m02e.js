/* Recortes do módulo 2, tópico 5 (Cruzadas, renascimento comercial e crise do feudalismo), desenhados em código. Nenhuma figura de IA.
   Carregue DEPOIS de colagem.js e recortes.js (e de recortes-m02b.js, de onde vêm o esquema trienal e os moinhos). Não altera o motor.
   Ícones (use {tipo:'icone', nome:'...'}): pimenta, canela, seda, peixe, tora, feixe-trigo, pele, mina-seca, moeda-rachada, selo-cera.
   Tipos próprios: fitaim (faixas da Idade Média e o alfinete do século XI), bifurca (Cruzadas ou comércio), grafpop (gráfico de população),
     balanca5 (fé contra terras e lucro), xvermelho, credito (nota de crédito), cidade (cidade murada vista de cima), oficina, brasoes,
     campochuva, exploracao, enterro, trescada, balancacamp e castelo9. */
(function(){
'use strict';
const C=window.Colagem;
if(!C||!C.tipos||!C.icone)throw new Error('Carregue colagem.js e recortes.js antes de recortes-m02e.js');
const T='#1b1a17',AM='#ffd83d',esc=C.esc,VERM='#c93a2a',OLIVA='#7d7a2e';
let seq=0;
const pth=(d,f,s,w,x)=>'<path d="'+d+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+' stroke-linecap="round" stroke-linejoin="round"'+(x||'')+'/>';
const tinta=(d,w)=>pth(d,'none',T,w||2);
const circ=(cx,cy,r,f,s,w)=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+'/>';
const rect=(x,y,w,h,f,s,sw,rx)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"'+(rx?' rx="'+rx+'"':'')+' fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(sw||3)+'" stroke-linejoin="round"':'')+'/>';
const hach=(d,pad,op)=>'<path d="'+d+'" fill="url(#'+(pad||'cm-h1')+')" opacity="'+(op||.6)+'"/>';
const clipD=(id,d)=>'<clipPath id="'+id+'"><path d="'+d+'"/></clipPath>';
const sTx=(x,y,t,sz,w,anc,fill,fam,ex)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+(anc||'middle')+'"'+(ex||'')+' style="font:'+(w||700)+' '+sz+'px '+(fam||'var(--sans,sans-serif)')+';fill:'+(fill||T)+'">'+esc(t)+'</text>';
const SERIF='var(--serif,Georgia,serif)';
const fundoP=(W,H)=>'<rect width="'+W+'" height="'+H+'" fill="#fbf9f1"/><rect width="'+W+'" height="'+H+'" fill="url(#cm-hh)" opacity=".2"/>';
const ESTILO='<style>'+
  '.cm-m5.cm-esq{padding:0}.cm-m5 svg{display:block;width:100%;height:100%}'+
  '.cm-m5 .ap{opacity:0}.cm-m5:not(.fora) .ap{animation:m5t .7s ease-out var(--a,0s) forwards}'+
  '.cm-m5 .pop{opacity:0;transform-box:fill-box;transform-origin:50% 100%}.cm-m5:not(.fora) .pop{animation:m5p .55s cubic-bezier(.2,.9,.3,1.3) var(--a,0s) forwards}'+
  '.cm-m5 .dr{stroke-dasharray:1;stroke-dashoffset:1}.cm-m5:not(.fora) .dr{animation:m5d 1.1s ease-in-out var(--a,0s) forwards}'+
  '.cm-m5 .wp{transform-box:fill-box;transform-origin:0 50%;transform:scaleX(0)}.cm-m5:not(.fora) .wp{animation:m5w 1.5s ease-out var(--a,0s) forwards}'+
  '.cm-m5 .et{opacity:0;transition:opacity .8s}.cm-m5 .et.on{opacity:1}'+
  '.cm-m5 .ld{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 2.6s ease-in-out .3s}.cm-m5 .ld.on{stroke-dashoffset:0}'+
  '@keyframes m5t{to{opacity:1}}@keyframes m5p{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:none}}@keyframes m5d{to{stroke-dashoffset:0}}@keyframes m5w{to{transform:scaleX(1)}}'+
  '@media (prefers-reduced-motion:reduce){.cm-m5 .ap,.cm-m5 .pop{opacity:1!important;animation:none!important;transform:none!important}.cm-m5 .dr{stroke-dashoffset:0!important;animation:none!important}.cm-m5 .wp{transform:none!important;animation:none!important}.cm-m5 .ld{transition:none}.cm-m5 .et{transition:none}}'+
  '</style>';
const A=a=>' style="--a:'+a+'s"';
const esq=(p,W,H,corpo,rot,extra)=>({cls:'cm-esq cm-m5'+(extra||''),style:'--clip:'+C.rasgo(p.id,1.2),html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||rot)+'">'+ESTILO+fundoP(W,H)+corpo+'</svg>'});
const livre=(p,W,H,corpo,rot,extra)=>({cls:'cm-icone cm-m5'+(extra||''),html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||rot)+'" style="overflow:visible">'+ESTILO+corpo+'</svg>'});
const seta=(d,pt,a,cor,w)=>'<path class="dr"'+A(a)+' pathLength="1" d="'+d+'" fill="none" stroke="'+(cor||T)+'" stroke-width="'+(w||6)+'" stroke-linecap="round"/><path class="ap"'+A(a+.9)+' d="'+pt+'" fill="none" stroke="'+(cor||T)+'" stroke-width="'+((w||6)+1)+'" stroke-linecap="round" stroke-linejoin="round"/>';
/* ponta de seta no ponto (x,y), apontando segundo o ângulo ang (radianos) */
const ponta=(x,y,ang,s)=>{s=s||44;return 'M'+(x-s*Math.cos(ang-.5)).toFixed(1)+' '+(y-s*Math.sin(ang-.5)).toFixed(1)+' L'+x+' '+y+' L'+(x-s*Math.cos(ang+.5)).toFixed(1)+' '+(y-s*Math.sin(ang+.5)).toFixed(1);};
const etq=(x,y,w,h,ls,sz,a,giro,cor)=>{
  const n=ls.length,lh=Math.round(sz*1.16),y0=y+h/2-(n-1)*lh/2+sz*.34;
  return '<g class="ap"'+A(a)+'><g transform="rotate('+(giro||0)+' '+(x+w/2)+' '+(y+h/2)+')"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+(cor||'#fff')+'" stroke="'+T+'" stroke-opacity=".35" stroke-width="2"/>'+
    ls.map((l,i)=>sTx(x+w/2,y0+i*lh,l,sz,700)).join('')+'</g></g>';
};
const pessoa=(x,y,h,fill,ex)=>{
  const r=h*.14,hy=y-h+r,top=y-h*.72,w=h*.27,pe=h*.42,k=h*.09,tz=top;
  const d='M'+(x-w).toFixed(1)+' '+(tz+k).toFixed(1)+' Q'+(x-w).toFixed(1)+' '+tz.toFixed(1)+' '+(x-w+k).toFixed(1)+' '+tz.toFixed(1)+' H'+(x+w-k).toFixed(1)+' Q'+(x+w).toFixed(1)+' '+tz.toFixed(1)+' '+(x+w).toFixed(1)+' '+(tz+k).toFixed(1)+
    ' V'+(tz+pe*.9).toFixed(1)+' H'+(x+w*.62).toFixed(1)+' V'+(y-h*.28).toFixed(1)+' H'+(x+w*.62).toFixed(1)+' V'+y+' H'+(x+w*.1).toFixed(1)+' V'+(y-h*.28).toFixed(1)+' H'+(x-w*.1).toFixed(1)+' V'+y+' H'+(x-w*.62).toFixed(1)+' V'+(y-h*.28).toFixed(1)+' H'+(x-w*.62).toFixed(1)+' V'+(tz+pe*.9).toFixed(1)+' H'+(x-w).toFixed(1)+'Z';
  return '<g'+(ex||'')+'>'+circ(x.toFixed(1),hy.toFixed(1),r.toFixed(1),fill,T,3)+pth(d,fill,T,3)+'</g>';
};
/* pessoa de túnica longa, com capuz opcional (para a cena do enterro e a oficina) */
const robe=(x,y,h,fill,capuz,ex)=>{
  const r=h*.13,w=h*.24;
  let s='<g'+(ex||'')+'>'+pth('M'+(x-w)+' '+y+' L'+(x-w*.7)+' '+(y-h*.62)+' Q'+x+' '+(y-h*.78)+' '+(x+w*.7)+' '+(y-h*.62)+' L'+(x+w)+' '+y+'Z',fill,T,3);
  s+=circ(x,(y-h+r*1.2).toFixed(1),r.toFixed(1),capuz?fill:'#d9bf99',T,3);
  if(capuz)s+=pth('M'+(x-r*1.15)+' '+(y-h+r*1.9)+' Q'+x+' '+(y-h-r*1.5)+' '+(x+r*1.15)+' '+(y-h+r*1.9),fill,T,3)+circ(x+r*.18,(y-h+r*1.4).toFixed(1),r*.5,'#c9ad88',null,0);
  return s+'</g>';
};

/* ---------- ícones: mesmo formato de recortes.js (arte em 0..200, fundo de papel colorido, margem branca) ---------- */
const IO={};
function reg(nome,fundo,rotulo,art){IO[nome]={fundo:fundo,nome:rotulo,art:art};if(C.ICONES&&C.ICONES.indexOf(nome)<0)C.ICONES.push(nome);}
function fundoO(cor,seed){
  const r=C.rng('fundo'+seed),pts=[];
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2,k=84+(r()-.5)*7;pts.push([104+Math.cos(a)*k,106+Math.sin(a)*k]);}
  return '<path d="'+C.suave(pts,true)+'" fill="'+C.cor(cor)+'" filter="url(#cm-rasga)"/>';
}
function iconeO(nome,o){
  o=o||{};const ic=IO[nome],u='m5'+(seq++)+'-',fd=o.fundo===false?'':fundoO(o.fundo||ic.fundo,nome);
  return '<svg viewBox="-14 -14 228 228" role="img" aria-label="'+esc(o.rotulo||ic.nome)+'">'+fd+
    '<g filter="url(#cm-sombra)"><g class="cm-sil">'+ic.art('s'+u)+'</g></g>'+ic.art(u)+'</svg>';
}
const icone0=C.icone;
C.icone=function(nome,o){return IO[nome]?iconeO(nome,o):icone0(nome,o);};

reg('pimenta','coral','Saco de pimenta-do-reino',u=>{
  let s=pth('M52 80 C38 116 40 160 62 184 H138 C160 160 162 116 148 80Z','#cdb48a',T,3.4)+hach('M120 84 C142 100 146 140 140 182 H128Z','cm-h1',.4);
  s+=pth('M62 84 C58 58 142 58 138 84','#d8c196',T,3.2)+pth('M58 86 H142','none','#7a5a2a',7)+pth('M58 86 H142','none',T,1.6);
  [[80,70],[96,64],[112,68],[126,72],[88,76],[104,76],[118,80]].forEach(q=>{s+=circ(q[0],q[1],6,'#2f241c',T,1.4);});
  s+=pth('M74 128 C92 118 108 138 126 124','none',T,2,' stroke-opacity=".5"');
  [[34,176],[50,190],[150,188],[170,176],[28,190]].forEach(q=>{s+=circ(q[0],q[1],5.5,'#2f241c',T,1.2);});
  return s;});
reg('canela','amarelo','Três rolos de canela amarrados',u=>{
  let s='<g transform="rotate(-18 100 100)">';
  [[60,0],[94,0],[128,0]].forEach(q=>{
    s+=pth('M30 '+q[0]+' H168 A13 13 0 0 1 168 '+(q[0]+26)+' H30Z','#b0703a',T,3.2)+hach('M110 '+q[0]+' H168 V'+(q[0]+26)+' H110Z','cm-h1',.4)+
      '<ellipse cx="30" cy="'+(q[0]+13)+'" rx="10" ry="13" fill="#7a4420" stroke="'+T+'" stroke-width="3"/>'+pth('M30 '+(q[0]+13)+' m-4 0 a4 4 0 1 1 5 4','none',T,1.6);
  });
  s+=pth('M96 52 V170','none','#e4d29a',9)+pth('M96 52 V170','none',T,1.6)+'</g>';
  return s;});
reg('seda','coral','Rolo de seda com a ponta desenrolada',u=>{
  let s=pth('M56 52 H150 A22 48 0 0 1 150 148 H56Z','#c4376a',T,3.4)+hach('M110 52 H150 A22 48 0 0 1 150 148 H110Z','cm-h1',.4);
  s+='<ellipse cx="56" cy="100" rx="22" ry="48" fill="#e3809e" stroke="'+T+'" stroke-width="3.4"/><ellipse cx="56" cy="100" rx="9" ry="20" fill="#8c1f4a" stroke="'+T+'" stroke-width="2"/>';
  s+=pth('M60 52 V148 M84 52 V148','none','#f0c3d2',3,' stroke-opacity=".7"');
  s+=pth('M60 148 C40 160 30 176 36 186 C62 192 82 176 100 184 C124 192 150 178 160 186 L150 148Z','#c4376a',T,3)+hach('M100 150 L112 184 L150 148Z','cm-h1',.4);
  s+=pth('M60 164 C80 170 100 166 124 172','none','#f0c3d2',2.4,' stroke-opacity=".7"');
  return s;});
reg('peixe','petroleo','Peixe',u=>{
  let s=pth('M30 100 C60 58 130 58 162 100 C130 142 60 142 30 100Z','#7aa6b5',T,3.4)+pth('M162 100 L192 68 L186 100 L192 132Z','#5f8b9c',T,3.2);
  s+=hach('M60 108 C90 140 130 134 160 104 C130 142 60 142 60 108Z','cm-h1',.45);
  s+=circ(60,92,6,'#fff',T,2.4)+circ(58,92,2.4,T)+pth('M80 74 C74 92 74 108 82 126','none',T,2.6);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)s+=pth('M'+(98+i*17)+' '+(90+j*13)+' q6 -6 12 0','none',T,1.6,' stroke-opacity=".55"');
  s+=pth('M98 62 C112 46 130 50 136 66','#5f8b9c',T,3);
  return s;});
reg('tora','amarelo','Pilha de toras de madeira',u=>{
  let s='';
  [[66,134],[134,134],[100,78]].forEach((q,i)=>{
    s+=circ(q[0],q[1],38,'#c9985a',T,3.6)+circ(q[0],q[1],27,'none',T,1.8)+circ(q[0],q[1],16,'none',T,1.6)+circ(q[0],q[1],5,'#8a5a2a',T,1.4)+pth('M'+(q[0]-30)+' '+(q[1]-6)+' L'+q[0]+' '+q[1]+' L'+(q[0]+22)+' '+(q[1]-22),'none',T,1.4,' stroke-opacity=".45"');
  });
  s+=pth('M20 176 H182','none',T,3.4);
  return s;});
reg('feixe-trigo','amarelo','Feixe de trigo amarrado',u=>{
  let s='';
  [[-26,22],[-12,10],[0,0],[12,-10],[26,-22]].forEach((a,i)=>{
    const ang=a[0]*Math.PI/180,x1=100+Math.sin(ang)*8,y1=150,x2=100+Math.sin(ang)*92,y2=150-Math.cos(ang)*104;
    s+=pth('M'+x1+' '+y1+' L'+x2.toFixed(1)+' '+y2.toFixed(1),'none',T,6)+pth('M'+x1+' '+y1+' L'+x2.toFixed(1)+' '+y2.toFixed(1),'none','#d8b04a',3.4);
    for(let k=0;k<5;k++){const f=.52+k*.1,gx=x1+(x2-x1)*f,gy=y1+(y2-y1)*f;
      s+='<ellipse cx="'+(gx-5).toFixed(1)+'" cy="'+gy.toFixed(1)+'" rx="4.4" ry="8.4" transform="rotate('+(-30+a[0])+' '+(gx-5).toFixed(1)+' '+gy.toFixed(1)+')" fill="#e6c456" stroke="'+T+'" stroke-width="1.6"/><ellipse cx="'+(gx+5).toFixed(1)+'" cy="'+(gy-3).toFixed(1)+'" rx="4.4" ry="8.4" transform="rotate('+(30+a[0])+' '+(gx+5).toFixed(1)+' '+(gy-3).toFixed(1)+')" fill="#e6c456" stroke="'+T+'" stroke-width="1.6"/>';}
  });
  s+=pth('M70 128 H130 L126 150 H74Z','#a8683a',T,3.2)+pth('M62 150 L80 190 M138 150 L120 190 M100 150 V192','none',T,3.4);
  return s;});
reg('pele','coral','Pele de animal estendida',u=>{
  let s=pth('M60 40 L92 62 L108 62 L140 40 L172 82 L148 112 L166 152 L134 142 L100 178 L66 142 L34 152 L52 112 L28 82Z','#9a6a3a',T,3.4);
  s+=hach('M108 62 L140 40 L172 82 L148 112 L166 152 L134 142 L100 178Z','cm-h1',.45);
  for(let i=0;i<14;i++){const x=56+(i%5)*22,y=80+Math.floor(i/5)*28;s+=pth('M'+x+' '+y+' l7 10','none','#d6b080',2.2,' stroke-opacity=".8"');}
  return s;});
reg('mina-seca','petroleo','Entrada de mina riscada por um X vermelho',u=>{
  let s=pth('M14 172 L70 54 L104 100 L130 64 L190 172Z','#9c9588',T,3.4)+hach('M104 100 L130 64 L190 172 L120 172Z','cm-h1',.5);
  s+=pth('M72 172 V120 H128 V172Z','#2b2a27',T,3.2)+pth('M66 172 V112 H134 V172','none','#8a5a33',9)+pth('M66 172 V112 H134 V172','none',T,1.8);
  s+=pth('M20 176 H186','none',T,3.4);
  s+=pth('M120 150 L170 120 M160 112 L178 134','none','#6b4423',7)+pth('M120 150 L170 120','none',T,1.6);
  s+=pth('M36 38 L170 180','none','#fff',22)+pth('M36 38 L170 180','none',VERM,14)+pth('M170 38 L36 180','none','#fff',22)+pth('M170 38 L36 180','none',VERM,14);
  return s;});
reg('moeda-rachada','amarelo','Moeda de prata rachada ao meio',u=>{
  const cr='M104 14 L92 52 L110 80 L90 112 L112 146 L96 190';
  let s='<defs>'+clipD(u+'e',cr+' L0 190 V14Z')+clipD(u+'d',cr+' L200 190 V14Z')+'</defs>';
  s+='<g transform="translate(-8 2) rotate(-4 100 100)"><g clip-path="url(#'+u+'e)">'+circ(100,100,74,'#d4d8dc',T,3.6)+circ(100,100,58,'none',T,1.8)+pth('M100 62 V138 M76 92 H124','none',T,5)+'</g></g>';
  s+='<g transform="translate(8 -2) rotate(4 100 100)"><g clip-path="url(#'+u+'d)">'+circ(100,100,74,'#c3c8cd',T,3.6)+circ(100,100,58,'none',T,1.8)+pth('M100 62 V138 M76 92 H124','none',T,5)+hach('M100 40 A60 60 0 0 1 100 160Z','cm-h1',.4)+'</g></g>';
  return s;});
reg('selo-cera','coral','Selo de cera vermelha com uma muralha',u=>{
  const r=C.rng('selo'),pts=[];
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2,k=80+(r()-.5)*12+(i%2?-4:4);pts.push([100+Math.cos(a)*k,100+Math.sin(a)*k]);}
  let s=pth('M70 150 L40 196 L66 186 L82 196 L96 160Z','#8c1f1f',T,3)+pth('M130 150 L160 196 L134 186 L118 196 L104 160Z','#a62424',T,3);
  s+=pth(C.suave(pts,true),'#c42b2b',T,4)+hach('M100 22 A78 78 0 0 1 100 178 L120 100Z','cm-h1',.3);
  s+=circ(100,100,56,'none','#8c1f1f',5)+circ(100,100,52,'none','#e06a5a',2,'',);
  s+=pth('M64 134 V92 H72 V82 H82 V92 H92 V82 H108 V92 H118 V82 H128 V92 H136 V134Z','#e6a79c',T,2.6)+pth('M92 134 V112 C92 100 108 100 108 112 V134Z','#8c1f1f',T,2.2);
  s+=pth('M96 82 V62 H106 V82','#e6a79c',T,2.4)+pth('M96 62 L101 50 L106 62','#e6a79c',T,2.2);
  return s;});

/* ponto invisível, usado para ancorar um círculo no mapa */
if(!C.tipos.alvo)C.tipos.alvo=p=>livre(p,10,10,'','Ponto do mapa',' cm-sem-ar');

/* ---------- etapa 1: faixas da Idade Média e o alfinete do século XI ---------- */
C.tipos.fitaim=p=>{
  const W=1700,H=900;
  let s=sTx(60,102,'Idade Média',96,400,'start',T,SERIF)+'<rect class="wp"'+A(.3)+' x="50" y="116" width="560" height="14" fill="'+AM+'"/>';
  s+='<g class="wp"'+A(.9)+'>'+pth('M60 200 H1100 V420 H60Z','#e9dcb4',T,6)+hach('M1010 200 H1100 V420 H1010Z','cm-h1',.3)+'</g>';
  s+='<g class="ap"'+A(1.8)+'>'+sTx(580,300,'Alta Idade Média',78,700)+sTx(580,378,'séculos V a X',62,500,'middle','#2f2e2a')+'</g>';
  s+='<g class="ap"'+A(1.4)+'>'+pth('M60 420 V470','none',T,5,' stroke-dasharray="2 10"')+circ(60,420,13,'#e8572a',T,3)+sTx(76,534,'476',66,700,'start')+'</g>';
  s+=seta('M1100 310 C1240 310 1280 420 1180 510 C1120 560 860 520 640 560','M690 520 L640 562 L700 590',3.4,'#e8572a',9);
  s+='<g class="wp"'+A(4.4)+'>'+pth('M560 600 H1640 V820 H560Z','#d9d6cf',T,6)+hach('M1550 600 H1640 V820 H1550Z','cm-h1',.3)+'</g>';
  s+='<g class="ap"'+A(5.2)+'>'+sTx(1100,700,'Baixa Idade Média',78,700)+sTx(1100,778,'séculos XI a XV',62,500,'middle','#2f2e2a')+'</g>';
  s+='<g class="ap"'+A(5.6)+'>'+pth('M1640 820 V860','none',T,5,' stroke-dasharray="2 10"')+sTx(1640,892,'fim do século XV',60,700,'end')+'</g>';
  /* o alfinete do século XI: cabeça vermelha, agulha e um halo que pulsa quando a etapa chega ao crescimento */
  s+='<g class="pop"'+A(6.4)+'><circle cx="606" cy="600" r="30" fill="none" stroke="'+AM+'" stroke-width="10" opacity=".9"/>'+pth('M606 600 L560 520','none',T,5)+circ(606,600,15,'#e8572a',T,3.4)+'</g>';
  s+=etq(120,606,420,96,['século XI'],56,6.6,-2,AM);
  return esq(p,W,H,s,'Faixas da Idade Média: Alta, séculos V a X, de 476; Baixa, séculos XI a XV, até o fim do século XV; um alfinete marca o século XI, quando a Europa cresce');
};

/* ---------- etapa 1: a bifurcação, Cruzadas de um lado e comércio e cidades do outro ---------- */
C.tipos.bifurca=p=>{
  const W=1500,H=960;
  let s=sTx(50,100,'dois caminhos',78,400,'start',T,SERIF)+'<rect class="wp"'+A(.3)+' x="40" y="114" width="420" height="14" fill="'+AM+'"/>';
  const estrada=(d,a)=>'<path class="dr"'+A(a)+' pathLength="1" d="'+d+'" fill="none" stroke="'+T+'" stroke-width="40" stroke-linecap="round"/><path class="dr"'+A(a)+' pathLength="1" d="'+d+'" fill="none" stroke="#efe2bd" stroke-width="30" stroke-linecap="round"/><path class="dr"'+A(a)+' pathLength="1" d="'+d+'" fill="none" stroke="'+T+'" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 .02" stroke-opacity=".35" style="stroke-dasharray:18 20"/>';
  s+=estrada('M40 520 C240 520 320 520 520 500',.8);
  s+=estrada('M520 500 C700 480 780 300 960 260',2.2)+estrada('M520 500 C700 520 780 700 960 740',2.6);
  s+='<g class="ap"'+A(3.4)+'>'+pth(ponta(980,255,-.26,52),'none',T,9)+pth(ponta(980,745,.26,52),'none',T,9)+'</g>';
  /* cruz e espada */
  s+='<g class="pop"'+A(3.2)+'><g transform="translate(1180 256)"><g transform="rotate(32)">'+pth('M-11 -128 L11 -128 L11 52 L-11 52Z','#cfd3d8',T,3.4)+pth('M-11 -128 L0 -150 L11 -128','#cfd3d8',T,3.4)+pth('M-52 52 H52 V70 H-52Z','#a9793a',T,3.4)+pth('M-8 70 H8 V112 H-8Z','#6b4423',T,3.4)+circ(0,120,12,'#a9793a',T,3.4)+'</g>'+
    pth('M-17 -92 H17 V-26 H72 V8 H17 V96 H-17 V8 H-72 V-26 H-17Z','#c93a2a',T,5)+'</g></g>';
  s+=etq(1020,60,440,100,['Cruzadas'],62,3.8,-1.5);
  /* balança e saco de moedas */
  s+='<g class="pop"'+A(3.6)+'><g transform="translate(1110 744)">'+pth('M0 -94 V84 M-30 84 H30','none',T,6)+pth('M-80 -66 H80','none',T,6)+circ(0,-94,9,'#e4b13a',T,3.4)+
    pth('M-80 -66 L-100 -10 H-60Z','none',T,3.4)+pth('M80 -66 L60 -10 H100Z','none',T,3.4)+pth('M-108 -10 C-100 14 -56 14 -52 -10Z','#e4b13a',T,3.6)+pth('M52 -10 C60 14 104 14 108 -10Z','#e4b13a',T,3.6)+'</g>'+
    '<g transform="translate(1310 760)">'+pth('M-40 -8 C-70 24 -66 80 -34 94 H34 C66 80 70 24 40 -8Z','#cdb48a',T,3.6)+pth('M-34 -8 C-30 -34 30 -34 34 -8','#d8c196',T,3.4)+pth('M-42 -6 H42','none','#7a5a2a',7)+circ(0,40,20,'#e4b13a',T,3)+pth('M0 28 V52 M-8 36 C-8 28 8 28 8 36 C8 44 -8 40 -8 48 C-8 56 8 56 8 48','none',T,2.6)+'</g></g>';
  s+=etq(840,830,620,100,['comércio e cidades'],58,4,1.5);
  return esq(p,W,H,s,'Uma estrada que se bifurca: um caminho leva às Cruzadas, com uma cruz e uma espada; o outro, ao comércio e às cidades, com uma balança e um saco de moedas');
};

/* ---------- gráfico de população: sobe, treme em 1315, cai em 1347 a 1351 ---------- */
C.tipos.grafpop=p=>{
  const W=1550,H=960,X=y=>Math.round(170+(y-1000)*2.6),bx=820;
  const todas='0,1,2,3,4,5,6,7,8';
  let s=sTx(60,96,'população',76,400,'start',T,SERIF)+'<rect class="wp"'+A(.3)+' x="50" y="110" width="360" height="14" fill="'+AM+'"/>';
  s+=pth('M150 150 V800 H1500','none',T,6)+pth(ponta(1500,800,0,36),'none',T,6)+pth(ponta(150,150,-Math.PI/2,36),'none',T,6);
  [[1000,'1000'],[1315,'1315'],[1500,'1500']].forEach(q=>{s+=pth('M'+X(q[0])+' 800 V818','none',T,5)+sTx(X(q[0]),868,q[1],60,700);});
  /* a linha que sobe, de 1000 a 1315 */
  const dsobe='M'+X(1000)+' 700 C'+X(1080)+' 690 '+X(1140)+' 560 '+X(1200)+' 450 C'+X(1250)+' 350 '+X(1290)+' 280 '+X(1315)+' 262';
  s+='<path class="ld on" data-et="'+todas+'" pathLength="1" d="'+dsobe+'" fill="none" stroke="#e8572a" stroke-width="12" stroke-linecap="round"/>';
  s+='<g class="ap"'+A(3)+'><path d="'+dsobe+'" fill="none" stroke="none"/></g>';
  /* em 1315: a linha para e treme */
  const dtrem='M'+X(1315)+' 262 L'+X(1318)+' 252 L'+X(1322)+' 270 L'+X(1327)+' 250 L'+X(1332)+' 268 L'+X(1337)+' 254 L'+X(1342)+' 262';
  s+='<g data-et="6,7,8" class="et">'+pth('M'+X(1315)+' 262 V800','none','#c93a2a',4,' stroke-dasharray="10 12"')+'</g>';
  s+='<path class="ld" data-et="6,7,8" pathLength="1" d="'+dtrem+'" fill="none" stroke="#e8572a" stroke-width="12" stroke-linecap="round"/>';
  s+='<g data-et="6" class="et">'+etq(X(1315)-470,150,440,100,['1315: a fome'],58,0,-1.5,AM)+'</g>';
  /* a queda da peste: de 1347 a 1351 */
  const dqueda='M'+X(1342)+' 262 C'+X(1346)+' 262 '+X(1347)+' 262 '+X(1348)+' 300 C'+X(1349)+' 380 '+X(1350)+' 440 '+X(1351)+' 480 C'+X(1380)+' 490 '+X(1440)+' 470 '+X(1500)+' 450';
  s+='<g data-et="7,8" class="et">'+pth('M'+X(1347)+' 262 V800','none','#c93a2a',4,' stroke-dasharray="10 12"')+sTx(X(1347)+10,930,'1347 a 1351',58,700,'middle','#c93a2a')+'</g>';
  s+='<path class="ld" data-et="7,8" pathLength="1" d="'+dqueda+'" fill="none" stroke="#e8572a" stroke-width="12" stroke-linecap="round"/>';
  s+='<g data-et="7,8" class="et">'+pth('M1180 262 H1230 M1180 480 H1230','none',T,4)+pth('M1230 262 V480','none',T,5)+pth(ponta(1230,480,Math.PI/2,26),'none',T,5)+pth(ponta(1230,262,-Math.PI/2,26),'none',T,5)+
    etq(1060,540,420,160,['cerca de','um terço'],64,0,1.5,AM)+'</g>';
  return esq(p,W,H,s,'Gráfico de linha da população europeia, de 1000 a 1500: sobe até 1315, treme com a Grande Fome e despenca com a Peste Negra, de 1347 a 1351, cerca de um terço');
};

/* ---------- etapa 2: a balança da fé contra terras, lucro e aventura ---------- */
C.tipos.balanca5=p=>{
  const W=1200,H=900;
  let s='<style>@media (prefers-reduced-motion:no-preference){.cm-m5 .sw{transform-box:view-box;transform-origin:600px 150px;animation:m5sw 5s ease-in-out infinite alternate}@keyframes m5sw{from{transform:rotate(-1.3deg)}to{transform:rotate(1.3deg)}}}</style>';
  s+=sTx(50,96,'o que pesava',76,400,'start',T,SERIF)+'<rect class="wp"'+A(.3)+' x="40" y="110" width="420" height="14" fill="'+AM+'"/>';
  s+='<g class="sw">'+pth('M600 140 V470 M520 470 H680','none',T,10)+circ(600,140,18,'#e4b13a',T,4);
  s+=pth('M190 160 H1010','none',T,12)+pth('M190 160 H1010','none','#a9793a',6);
  /* prato esquerdo: fé */
  s+=pth('M190 160 L100 420 M190 160 L280 420','none',T,4)+pth('M70 420 C80 480 300 480 310 420Z','#e4b13a',T,5);
  s+='<g class="pop"'+A(1.4)+'>'+pth('M176 340 H204 V396 H176Z M162 362 H218 V382 H162Z','#c93a2a',T,4)+'</g>';
  s+=etq(70,500,240,100,['fé'],70,1.8,-2);
  /* prato direito: terras, lucro, aventura */
  s+=pth('M1010 160 L920 420 M1010 160 L1100 420','none',T,4)+pth('M890 420 C900 480 1120 480 1130 420Z','#e4b13a',T,5);
  s+='<g class="pop"'+A(1.8)+'>'+pth('M908 400 L960 340 L1012 400Z','#6f9a4a',T,4)+'</g><g class="pop"'+A(2.2)+'>'+circ(1042,384,26,'#e4b13a',T,4)+circ(1088,392,22,'#d4d8dc',T,4)+'</g><g class="pop"'+A(2.6)+'>'+pth('M1020 340 L1066 290 L1112 340 L1066 322Z','#c93a2a',T,4)+'</g>';
  s+=etq(790,500,420,190,['terras,','lucro,','aventura'],58,3,2)+'</g>';
  s+='<g class="ap"'+A(4)+'>'+sTx(600,800,'os dois lados pesam parecido',58,700,'middle','#2f2e2a')+'</g>';
  return esq(p,W,H,s,'Uma balança em equilíbrio: de um lado a fé; do outro, terras, lucro e aventura; os dois pesam parecido');
};

/* ---------- etapa 3: X vermelho sobre Constantinopla ---------- */
C.tipos.xvermelho=p=>{
  const W=320,H=320,d1='M40 50 C110 110 200 200 280 280',d2='M285 44 C210 110 130 200 44 282';
  let s='';
  [d1,d2].forEach((d,i)=>{s+='<path class="dr"'+A(.2+i*.6)+' pathLength="1" d="'+d+'" fill="none" stroke="#fff" stroke-width="54" stroke-linecap="round"/><path class="dr"'+A(.2+i*.6)+' pathLength="1" d="'+d+'" fill="none" stroke="#c93a2a" stroke-width="38" stroke-linecap="round"/>';});
  return livre(p,W,H,s,'Um X vermelho sobre Constantinopla, saqueada em 1204',' cm-sem-ar');
};

/* ---------- etapa 4: nota de crédito ---------- */
C.tipos.credito=p=>{
  const W=1100,H=640;
  let s=rect(18,18,W-36,H-36,'#f4ecd2',T,5)+rect(46,46,W-92,H-92,'none',T,2.4)+hach('M18 18 H'+(W-18)+' V'+(H-18)+' H18Z','cm-hh',.35);
  s+=sTx(W/2,150,'nota de crédito',84,400,'middle',T,SERIF)+tinta('M300 176 H800',3);
  s+=sTx(110,262,'pague ao portador',50,700,'start','#2f2e2a')+sTx(W-110,262,'100 moedas',50,700,'end',T);
  s+=sTx(110,330,'na próxima feira',50,700,'start','#2f2e2a');
  s+=pth('M110 450 C170 400 210 500 270 440 C320 400 360 480 420 430 C470 400 500 470 540 440','none','#2a3a6a',5);
  s+=sTx(110,540,'assinatura do mercador',46,500,'start','#4a463e')+tinta('M110 478 H600',2.2);
  s+='<g class="pop"'+A(1)+'>'+circ(900,430,84,'#c42b2b',T,5)+circ(900,430,60,'none','#8c1f1f',5)+pth('M868 470 V420 H878 V408 H890 V420 H910 V408 H922 V420 H932 V470Z','#e6a79c',T,3)+'</g>';
  s+=sTx(W-110,586,'exemplo ilustrativo',46,500,'end','#4a463e');
  return esq(p,W,H,s,'Nota de crédito desenhada em código: pague ao portador cem moedas na próxima feira, com assinatura e selo; exemplo ilustrativo');
};

/* ---------- etapa 5: a cidade murada vista de cima, e o servo que atravessa o portão ---------- */
C.tipos.cidade=p=>{
  const W=1500,H=1400,cx=980,cy=700,R=500;
  let s='<style>@media (prefers-reduced-motion:no-preference){.cm-m5:not(.fora) .bone{animation:m5b 5.2s ease-in-out var(--a,2s) both}.cm-m5:not(.fora) .ch1{animation:m5c1 5.2s ease-in var(--a,2s) both}.cm-m5:not(.fora) .ch2{animation:m5c2 5.2s ease-in var(--a,2s) both}'+
    '@keyframes m5b{0%{transform:translateX(0)}18%{transform:translateX(0)}78%{transform:translateX(560px)}100%{transform:translateX(560px)}}'+
    '@keyframes m5c1{0%,60%{transform:none;opacity:1}100%{transform:translate(-26px,34px) rotate(-30deg);opacity:.2}}@keyframes m5c2{0%,60%{transform:none;opacity:1}100%{transform:translate(26px,34px) rotate(30deg);opacity:.2}}}'+
    '@media (prefers-reduced-motion:reduce){.cm-m5 .bone{transform:translateX(560px)}.cm-m5 .ch1,.cm-m5 .ch2{opacity:.2}}</style>';
  /* chão e campo do feudo, à esquerda */
  s+=rect(20,330,400,740,'#d9cf9a',T,5)+hach('M20 330 H420 V1070 H20Z','cm-hv',.35);
  for(let i=0;i<9;i++)s+=tinta('M'+(46+i*40)+' 350 V1050',2.4);
  s+=etq(40,1100,360,110,['feudo'],60,0.4,-1.5);
  /* a muralha: anel de pedra com torres e um portão a oeste */
  const ang0=Math.PI-.16,ang1=Math.PI+.16;
  const pa=(a,r)=>[cx+Math.cos(a)*r,cy+Math.sin(a)*r];
  const a1=pa(ang1,R),a0=pa(ang0,R);
  s+='<g class="ap"'+A(.6)+'>'+circ(cx,cy,R,'#efe2bd',T,6)+hach('M'+cx+' '+(cy-R)+' A'+R+' '+R+' 0 0 1 '+cx+' '+(cy+R)+' A'+R+' '+R+' 0 0 1 '+cx+' '+(cy-R)+'Z','cm-h1',.12)+'</g>';
  s+='<g class="dr"'+A(.8)+'>'+'<path pathLength="1" d="M'+a1[0].toFixed(1)+' '+a1[1].toFixed(1)+' A'+R+' '+R+' 0 1 1 '+a0[0].toFixed(1)+' '+a0[1].toFixed(1)+'" fill="none" stroke="'+T+'" stroke-width="78" stroke-linecap="butt"/><path pathLength="1" d="M'+a1[0].toFixed(1)+' '+a1[1].toFixed(1)+' A'+R+' '+R+' 0 1 1 '+a0[0].toFixed(1)+' '+a0[1].toFixed(1)+'" fill="none" stroke="#cfc6b0" stroke-width="64" stroke-linecap="butt"/></g>';
  for(let i=0;i<14;i++){const a=ang1+.14+i*(Math.PI*2-.46)/13,q=pa(a,R);s+='<g class="pop"'+A(1.2+i*.08)+'>'+circ(q[0].toFixed(1),q[1].toFixed(1),44,'#d8d0bd',T,5)+circ(q[0].toFixed(1),q[1].toFixed(1),24,'#8a5a33',T,3)+'</g>';}
  /* portão e cobrador de pedágio */
  const g=pa(Math.PI,R);
  s+=rect(g[0]-60,g[1]-70,120,140,'#d8d0bd',T,5)+pth('M'+(g[0]-36)+' '+(g[1]+70)+' V'+(g[1]-10)+' C'+(g[0]-36)+' '+(g[1]-48)+' '+(g[0]+36)+' '+(g[1]-48)+' '+(g[0]+36)+' '+(g[1]-10)+' V'+(g[1]+70),'#f1ece1',T,4);
  s+='<g class="pop"'+A(1.6)+'>'+pessoa(g[0]-100,g[1]-30,150,'#2f6f7a')+pth('M'+(g[0]-62)+' '+(g[1]-96)+' H'+(g[0]-4),'none',T,6)+pth('M'+(g[0]-132)+' '+(g[1]-154)+' h56 l-28 -32Z','#8a5a33',T,3)+'</g>';
  s+=etq(g[0]-360,g[1]+110,330,100,['pedágio'],60,1.8,-2);
  /* o interior: ruas, casas, a praça e a igreja */
  s+='<g class="ap"'+A(1.8)+'>'+tinta('M'+(cx-440)+' '+cy+' H'+(cx+440)+' M'+cx+' '+(cy-440)+' V'+(cy+440)+' M'+(cx-310)+' '+(cy-310)+' L'+(cx+310)+' '+(cy+310)+' M'+(cx+310)+' '+(cy-310)+' L'+(cx-310)+' '+(cy+310),4)+'</g>';
  const cs=C.rng('casas');
  for(let i=0;i<46;i++){const a=cs()*Math.PI*2,r=140+cs()*270,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;if(Math.hypot(x-cx,y-cy)<150||Math.hypot(x-(cx+210),y-(cy-210))<120||Math.abs(y-cy)<18||Math.abs(x-cx)<18)continue;
    s+='<g class="ap"'+A((2+i*.05).toFixed(2))+'><g transform="rotate('+Math.round(a*180/Math.PI+90)+' '+x.toFixed(0)+' '+y.toFixed(0)+')">'+rect((x-26).toFixed(0),(y-22).toFixed(0),52,44,i%3?'#c46a4a':'#b25a3a',T,3)+tinta('M'+(x-26).toFixed(0)+' '+(y).toFixed(0)+' H'+(x+26).toFixed(0),2)+'</g></g>';}
  s+='<g class="pop"'+A(2.4)+'>'+circ(cx,cy,120,'#f6f1e4',T,5)+['#c93a2a','#2f6f7a','#e4b13a','#6f9a4a','#c93a2a','#2f6f7a'].map((c,i)=>{const a=i/6*Math.PI*2,x=cx+Math.cos(a)*74,y=cy+Math.sin(a)*74;return rect((x-24).toFixed(0),(y-18).toFixed(0),48,36,c,T,3);}).join('')+circ(cx,cy,22,'#79b3d4',T,4)+'</g>';
  s+=etq(cx-150,cy+135,300,100,['praça'],60,2.8,1.5);
  /* igreja em cruz, vista de cima */
  s+='<g class="pop"'+A(2.8)+'><g transform="translate('+(cx+215)+' '+(cy-215)+') rotate(-45)">'+pth('M-30 -110 H30 V-30 H100 V30 H30 V110 H-30 V30 H-100 V-30 H-30Z','#e6dcc0',T,5)+hach('M-30 30 H30 V110 H-30Z','cm-h1',.3)+circ(0,0,32,'#c46a4a',T,4)+'</g></g>';
  s+=etq(cx+70,cy-390,290,100,['igreja'],60,3.2,2);
  /* o servo: sai do campo, atravessa o portão com uma corrente que se parte */
  const bx=190,by=700;
  s+='<g class="bone"'+A(2.4)+'>'+pessoa(bx,by,190,'#c94d3d')+
    '<g class="ch1">'+pth('M'+(bx-64)+' '+(by-96)+' h36','none',T,6)+circ(bx-76,by-96,10,'none',T,5)+circ(bx-40,by-96,10,'none',T,5)+'</g>'+
    '<g class="ch2">'+pth('M'+(bx+28)+' '+(by-96)+' h36','none',T,6)+circ(bx+40,by-96,10,'none',T,5)+circ(bx+76,by-96,10,'none',T,5)+'</g></g>';
  s+=etq(cx-340,cy-R-34-70,680,100,['burgo, cercado de muralhas'],56,.9,0);
  return esq(p,W,H,s,'Cidade medieval cercada por muralha, vista de cima: portão com cobrador de pedágio, praça do mercado e igreja; um servo sai do campo do feudo, atravessa o portão e sua corrente se parte');
};

/* ---------- etapa 6: a oficina, com mestre, oficial e aprendiz ---------- */
C.tipos.oficina=p=>{
  const W=1600,H=1040;
  let s=rect(20,20,W-40,640,'#efe2bd',T,5)+hach('M20 20 H'+(W-20)+' V660 H20Z','cm-hh',.25)+rect(20,660,W-40,340,'#cdb48a',T,5)+hach('M20 660 H'+(W-20)+' V1000 H20Z','cm-hv',.25);
  s+=pth('M60 150 H1540','none',T,3,' stroke-opacity=".35"')+sTx(60,112,'oficina',84,400,'start',T,SERIF);
  /* bancada ao fundo e prateleira com ferramentas */
  s+=rect(700,330,820,60,'#8a5a33',T,5)+rect(740,390,36,170,'#6b4423',T,4)+rect(1450,390,36,170,'#6b4423',T,4)+
     pth('M760 330 L820 290 H900 L930 330','#c9a36a',T,4)+pth('M1040 330 V260 M1020 260 H1100 L1070 300','none',T,6)+pth('M1180 330 L1230 264 L1260 330Z','#cfd3d8',T,4);
  /* escada de três degraus: aprendiz, oficial, mestre */
  const deg=[[80,830,430,170],[510,730,430,270],[940,630,430,370]];
  deg.forEach((d,i)=>{s+='<g class="ap"'+A(.6+i*.4)+'>'+rect(d[0],d[1],d[2],d[3],['#dcd2ad','#d3c79c','#c9bb8a'][i],T,6)+hach('M'+(d[0]+d[2]-70)+' '+d[1]+' H'+(d[0]+d[2])+' V'+(d[1]+d[3])+' H'+(d[0]+d[2]-70)+'Z','cm-h1',.25)+'</g>';});
  s+='<g class="pop"'+A(1.8)+'>'+pessoa(290,830,190,'#79b3d4')+'</g>';
  s+='<g class="pop"'+A(2.8)+'>'+pessoa(720,730,240,'#e4b13a')+rect(692,634,56,58,'#f6f1e4',T,3)+'</g>';
  s+='<g class="pop"'+A(3.8)+'>'+pessoa(1150,630,300,'#c94d3d')+rect(1112,520,76,70,'#a9793a',T,3)+pth('M1226 520 L1290 440','none','#6b4423',10)+pth('M1262 420 H1318 V462 H1262Z','#8d9399',T,3.6)+'</g>';
  s+=etq(50,870,500,120,['aprendiz','aprende o ofício'],46,2.2,-1.2);
  s+=etq(470,770,540,120,['oficial','trabalha por salário'],46,3.2,1);
  s+=etq(930,670,640,140,['mestre','dono da oficina e das ferramentas'],44,4.2,-1);
  s+=seta('M300 640 C300 560 420 500 560 470','M510 440 L564 468 L526 506',5.2,'#e8572a',8);
  s+=seta('M740 490 C740 420 860 380 980 360','M930 330 L984 358 L946 396',5.8,'#e8572a',8);
  return esq(p,W,H,s,'Oficina medieval com uma escada de três degraus: o aprendiz aprende o ofício, o oficial trabalha por salário e o mestre é dono da oficina e das ferramentas');
};

/* ---------- etapa 6: três brasões de ofício presos por uma fita ---------- */
C.tipos.brasoes=p=>{
  const W=1300,H=700;
  const escudo=(x,fill)=>pth('M'+x+' 130 H'+(x+300)+' V330 C'+(x+300)+' 420 '+(x+150)+' 450 '+(x+150)+' 470 C'+(x+150)+' 450 '+x+' 420 '+x+' 330Z',fill,T,6);
  let s='<path class="dr"'+A(.4)+' pathLength="1" d="M30 100 C250 150 450 60 650 110 C850 160 1050 60 1270 100" fill="none" stroke="#c93a2a" stroke-width="22" stroke-linecap="round"/>';
  const xs=[60,500,940];
  xs.forEach((x,i)=>{s+='<g class="pop"'+A(1+i*.5)+'>'+escudo(x,['#f1d9b8','#f2e3a8','#cfd3d8'][i])+hach('M'+(x+220)+' 130 H'+(x+300)+' V330 C'+(x+300)+' 380 '+(x+250)+' 410 '+(x+220)+' 424Z','cm-h1',.3)+
    circ(x+150,100,16,'#e4b13a',T,4)+'</g>';});
  /* tesoura */
  s+='<g class="pop"'+A(1.6)+'><g transform="translate(210 280)">'+pth('M-8 -10 L-70 -110 M8 -10 L70 -110','none',T,13)+pth('M-8 -10 L-70 -110 M8 -10 L70 -110','none','#cfd3d8',7)+circ(-34,60,34,'none',T,13)+circ(34,60,34,'none',T,13)+circ(-34,60,34,'none','#e4b13a',7)+circ(34,60,34,'none','#e4b13a',7)+pth('M-34 26 L22 -30 M34 26 L-22 -30','none',T,6)+'</g></g>';
  /* pão */
  s+='<g class="pop"'+A(2.1)+'><g transform="translate(650 290)">'+pth('M-84 40 C-110 -20 -54 -80 0 -80 C54 -80 110 -20 84 40 C70 76 -70 76 -84 40Z','#d9a24a',T,6)+hach('M20 -76 C70 -60 100 -10 84 40 C70 76 20 76 0 76Z','cm-h1',.35)+pth('M-44 -30 L-18 20 M-6 -44 L18 12 M32 -34 L52 14','none',T,5)+'</g></g>';
  /* martelo */
  s+='<g class="pop"'+A(2.6)+'><g transform="translate(1090 290) rotate(-30)">'+pth('M-12 -20 H12 V120 H-12Z','#a9793a',T,5)+pth('M-70 -80 H70 V-20 H-70Z','#8d9399',T,6)+hach('M20 -80 H70 V-20 H20Z','cm-h1',.5)+'</g></g>';
  s+=sTx(210,562,'tecelões',58,700)+sTx(650,562,'padeiros',58,700)+sTx(1090,562,'ferreiros',58,700);
  s+=sTx(650,654,'cada ofício, o seu brasão',54,500,'middle','#2f2e2a');
  return livre(p,W,H,s,'Três brasões de ofício presos por uma fita vermelha: tesoura dos tecelões, pão dos padeiros e martelo dos ferreiros');
};

/* ---------- etapa 7: chuva sobre o campo, que fica cinza ---------- */
C.tipos.campochuva=p=>{
  const W=1300,H=900;
  let s='<style>@media (prefers-reduced-motion:no-preference){.cm-m5:not(.fora) .gota{animation:m5g 1.4s linear var(--a,0s) infinite}@keyframes m5g{0%{transform:translateY(-40px);opacity:0}20%{opacity:1}100%{transform:translateY(300px);opacity:0}}.cm-m5:not(.fora) .cinza{animation:m5ci 6s ease-in 2s forwards}@keyframes m5ci{to{opacity:.82}}}.cm-m5 .cinza{opacity:0}</style>';
  s+=rect(20,420,1260,440,'#e0c866',T,5);
  for(let i=0;i<11;i++){s+=tinta('M'+(60+i*112)+' 440 L'+(30+i*118)+' 840',3);}
  s+=hach('M20 420 H1280 V860 H20Z','cm-hv',.25);
  s+='<g class="cinza">'+rect(20,420,1260,440,'#6e6e72',null)+'</g>';
  s+=pth('M20 420 H1280 V860 H20Z','none',T,5);
  [[300,230,170],[560,200,200],[820,230,180],[1040,250,150]].forEach((q,i)=>{s+=circ(q[0],q[1],q[2]*.5,'#c9ccd1',T,5);});
  s+=rect(220,230,900,120,'#c9ccd1',null)+pth('M220 350 H1120','none',T,5);
  for(let i=0;i<22;i++){const x=150+i*48,y=360+(i%5)*20;s+='<g class="gota" style="--a:'+(i*.11).toFixed(2)+'s"><path d="M'+x+' '+y+' q-10 22 0 30 q10 -8 0 -30Z" fill="#79b3d4" stroke="'+T+'" stroke-width="3"/></g>';}
  s+=etq(330,10,640,110,['1315 a 1317: chuvas'],54,0.4,-1.2);
  return livre(p,W,H,s,'Um campo debaixo de chuva forte, de gotas azuis que caem de nuvens cinzentas; o campo vai ficando cinza');
};

/* ---------- etapa 7: o castelo cobra mais da aldeia ---------- */
C.tipos.exploracao=p=>{
  const W=1400,H=900;
  let s=sTx(50,96,'os senhores apertam',76,400,'start',T,SERIF)+'<rect class="wp"'+A(.3)+' x="40" y="110" width="660" height="14" fill="'+AM+'"/>';
  /* castelo */
  s+='<g class="pop"'+A(.6)+'>'+pth('M60 440 V250 H110 V210 H150 V250 H190 V210 H230 V250 H270 V150 H250 V120 H280 V150 H320 V120 H350 V150 H330 V250 H380 V210 H420 V250 H460 V440Z','#d8d1c0',T,6)+hach('M360 250 H460 V440 H360Z','cm-h1',.35)+
    pth('M230 440 V350 C230 310 290 310 290 350 V440Z','#4a3a28',T,4)+pth('M60 440 H460','none',T,6)+pth('M150 300 V340 M370 300 V340','none',T,6)+pth('M300 120 V70 L346 86 L300 102','#c93a2a',T,4)+'</g>';
  s+=etq(100,470,360,100,['castelo'],54,1,-1.5);
  /* aldeia */
  [[760,640],[980,700],[1190,630]].forEach((q,i)=>{s+='<g class="pop"'+A(1.4+i*.4)+'>'+pth('M'+(q[0]-90)+' '+q[1]+' V'+(q[1]-90)+' H'+(q[0]+90)+' V'+q[1]+'Z','#e9dbb6',T,5)+pth('M'+(q[0]-110)+' '+(q[1]-90)+' L'+q[0]+' '+(q[1]-170)+' L'+(q[0]+110)+' '+(q[1]-90)+'Z','#c9a36a',T,5)+
    pth('M'+(q[0]-22)+' '+q[1]+' V'+(q[1]-50)+' H'+(q[0]+22)+' V'+q[1],'#6b4423',T,3.4)+'</g>';});
  s+='<g class="pop"'+A(2.4)+'>'+pessoa(880,850,160,'#c9ad88')+pessoa(1090,850,160,'#c9ad88')+'</g>';
  s+=etq(780,722,360,100,['aldeia'],54,1.8,1.5);
  /* a seta vermelha grossa, do castelo para a aldeia */
  s+='<path class="dr"'+A(3.2)+' pathLength="1" d="M480 300 C640 250 760 270 900 360 C1000 420 1050 440 1100 470" fill="none" stroke="'+VERM+'" stroke-width="40" stroke-linecap="round"/>'+
     '<path class="ap"'+A(4.2)+'" d="M1054 400 L1124 484 L1020 504" fill="none" stroke="'+VERM+'" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>';
  s+=etq(520,160,560,170,['mais impostos','e trabalho'],64,4.6,-3);
  return esq(p,W,H,s,'Um castelo e uma aldeia: uma grossa seta vermelha desce do castelo para a aldeia, com a etiqueta mais impostos e trabalho');
};

/* ---------- etapa 8: recorte em tinta de uma cena de enterro, quase em preto e branco ---------- */
C.tipos.enterro=p=>{
  const W=1300,H=860;
  const P='#e7ddc4';
  let s=pth('M30 26 L1270 14 L1286 842 L22 850Z',P,T,6)+hach('M1180 18 L1270 14 L1286 842 L1180 846Z','cm-h1',.2);
  s+=pth('M30 560 C300 520 600 540 900 520 C1060 510 1180 520 1280 500 V842 H22Z','#d4c9ac',T,4)+hach('M30 560 C300 520 600 540 900 520 C1060 510 1180 520 1280 500 V842 H22Z','cm-hv',.25);
  /* caixões em fileira, em perspectiva chapada */
  const caixao=(x,y,w,h)=>pth('M'+x+' '+y+' L'+(x+w*.2)+' '+(y-h*.18)+' H'+(x+w)+' L'+(x+w*.86)+' '+y+'Z','#a9793a',T,4)+pth('M'+x+' '+y+' H'+(x+w*.86)+' V'+(y+h*.62)+' H'+x+'Z','#8a5a33',T,4)+pth('M'+(x+w*.86)+' '+y+' L'+(x+w)+' '+(y-h*.18)+' V'+(y+h*.44)+' L'+(x+w*.86)+' '+(y+h*.62)+'Z','#6b4423',T,4)+
    tinta('M'+(x+w*.18)+' '+(y+h*.3)+' H'+(x+w*.68),2.4)+tinta('M'+(x+w*.43)+' '+(y+h*.14)+' V'+(y+h*.46),2.4);
  [[70,560,360,120],[210,610,360,120],[350,660,360,120],[490,710,360,120],[630,760,360,120]].forEach((q,i)=>{s+='<g class="pop"'+A(.5+i*.4)+'>'+caixao(q[0],q[1],q[2],q[3])+'</g>';});
  /* monte de terra à direita e pás */
  s+=pth('M900 560 C960 440 1060 420 1120 440 C1180 460 1240 520 1260 560Z','#8a7a58',T,5)+hach('M1040 430 C1120 440 1200 500 1260 560 H1090Z','cm-h1',.5);
  [[960,300,-12],[1180,320,10]].forEach((q,i)=>{s+='<g class="ap"'+A(2.4+i*.4)+'><g transform="translate('+q[0]+' '+q[1]+') rotate('+q[2]+')">'+pth('M0 0 V290','none','#8a5a33',14)+pth('M0 0 V290','none',T,2.4)+pth('M-34 290 H34 L24 360 H-24Z','#8d9399',T,5)+pth('M-26 -8 H26','none',T,10)+'</g></g>';});
  /* três figuras de capuz e touca, de túnica */
  s+='<g class="pop"'+A(1.6)+'>'+robe(540,470,330,'#2f2e2a',true)+'</g><g class="pop"'+A(2)+'>'+robe(700,500,350,'#4a463e',true)+'</g><g class="pop"'+A(2.4)+'>'+robe(820,460,310,'#2f2e2a',false)+pth('M778 330 q42 -50 84 0 v14 h-84Z','#e7ddc4',T,3.4)+'</g>';
  /* fita adesiva nos cantos */
  s+='<g transform="rotate(-18 60 40)"><rect x="-20" y="14" width="170" height="52" fill="#f2e6b0" fill-opacity=".85" stroke="'+T+'" stroke-opacity=".25" stroke-width="2"/></g><g transform="rotate(16 1240 40)"><rect x="1150" y="14" width="170" height="52" fill="#f2e6b0" fill-opacity=".85" stroke="'+T+'" stroke-opacity=".25" stroke-width="2"/></g>';
  return esq(p,W,H,s,'Recorte em tinta: uma fileira de caixões, três figuras de capuz e de touca, duas pás e um monte de terra');
};

/* ---------- etapa 8: de cada três, um some ---------- */
C.tipos.trescada=p=>{
  const W=1300,H=700;
  let s='<style>@media (prefers-reduced-motion:no-preference){.cm-m5:not(.fora) .some{animation:m5so 1.4s ease-in var(--a,0s) forwards}@keyframes m5so{to{opacity:.12}}}@media (prefers-reduced-motion:reduce){.cm-m5 .some{opacity:.12}}</style>';
  s+=sTx(60,96,'a mortandade, em bonecos',72,400,'start',T,SERIF)+'<rect class="wp"'+A(.3)+' x="50" y="110" width="520" height="14" fill="'+AM+'"/>';
  for(let i=0;i<9;i++){
    const x=110+i*135+(Math.floor(i/3))*40,morre=i%3===2;
    s+='<g class="pop"'+A((.6+i*.22).toFixed(2))+'>'+(morre?'<g class="some"'+A((4+Math.floor(i/3)*1)+'')+'>':'<g>')+pessoa(x,520,300,morre?'#c93a2a':'#c9c2b0')+'</g></g>';
  }
  s+=etq(250,570,800,100,['de cada três, um some'],62,5,-1.2,AM);
  return esq(p,W,H,s,'Nove bonequinhos em três grupos de três: em cada grupo, um desaparece, como um em cada três europeus');
};

/* ---------- etapa 9: a balança passa a pesar para o lado dos camponeses ---------- */
C.tipos.balancacamp=p=>{
  const W=1300,H=900,cxp=650,cyp=170,L=420;
  const dy=Math.round(L*Math.sin(9*Math.PI/180));
  let s='<style>@media (prefers-reduced-motion:no-preference){.cm-m5:not(.fora) .bv{animation:m5bv 6s ease-in-out 1s both}.cm-m5:not(.fora) .pe{animation:m5pe 6s ease-in-out 1s both}.cm-m5:not(.fora) .pd{animation:m5pd 6s ease-in-out 1s both}.cm-m5:not(.fora) .pc{animation:m5pc 6s ease-in-out 1s both}'+
    '@keyframes m5bv{from{transform:rotate(9deg)}to{transform:rotate(-9deg)}}@keyframes m5pe{from{transform:translateY('+(-dy)+'px)}to{transform:translateY('+dy+'px)}}@keyframes m5pd{from{transform:translateY('+dy+'px)}to{transform:translateY('+(-dy)+'px)}}@keyframes m5pc{from{transform:scale(.7)}to{transform:scale(1.25)}}}'+
    '@media (prefers-reduced-motion:reduce){.cm-m5 .bv{transform:rotate(-9deg)}.cm-m5 .pe{transform:translateY('+dy+'px)}.cm-m5 .pd{transform:translateY('+(-dy)+'px)}}.cm-m5 .bv,.cm-m5 .pe,.cm-m5 .pd{transform-box:view-box}.cm-m5 .bv{transform-origin:'+cxp+'px '+cyp+'px}.cm-m5 .pc{transform-box:fill-box;transform-origin:50% 100%}</style>';
  s+=pth('M'+cxp+' '+cyp+' V760 M'+(cxp-120)+' 760 H'+(cxp+120),'none',T,10)+circ(cxp,cyp,18,'#e4b13a',T,4);
  s+='<g class="bv">'+pth('M'+(cxp-L)+' '+cyp+' H'+(cxp+L),'none',T,14)+pth('M'+(cxp-L)+' '+cyp+' H'+(cxp+L),'none','#a9793a',7)+'</g>';
  /* prato esquerdo, camponeses: poucos bonequinhos e cada vez mais pesados */
  s+='<g class="pe" style="transform-origin:0 0"><g transform="translate('+(cxp-L)+' '+cyp+')">'+pth('M0 0 L-100 330 M0 0 L100 330','none',T,4)+pth('M-130 330 C-120 400 120 400 130 330Z','#e4b13a',T,5)+
    '<g class="pc">'+pessoa(-52,326,150,'#6f9a4a')+'</g><g class="pc">'+pessoa(52,326,150,'#6f9a4a')+'</g>'+'</g></g>';
  /* prato direito, senhores: um saco de moedas */
  s+='<g class="pd"><g transform="translate('+(cxp+L)+' '+cyp+')">'+pth('M0 0 L-100 330 M0 0 L100 330','none',T,4)+pth('M-130 330 C-120 400 120 400 130 330Z','#e4b13a',T,5)+
    pth('M-44 322 C-70 340 -64 330 -64 296 C-64 260 -36 252 -34 238 H34 C36 252 64 260 64 296 C64 330 70 340 44 322Z','#cdb48a',T,4)+pth('M-36 240 C-30 220 30 220 36 240','#d8c196',T,3.6)+circ(0,288,18,'#e4b13a',T,3)+'</g></g>';
  s+=etq(cxp-L-160,610,320,100,['camponeses'],52,.6,-1.5);
  s+=etq(cxp+L-130,610,320,100,['senhores'],52,.9,1.5);
  s+=etq(330,800,640,90,['faltou mão de obra'],54,3,-1,AM);
  return livre(p,W,H,s,'Uma balança que passa a pesar para o lado dos camponeses: poucos bonequinhos cada vez mais pesados num prato, um saco de moedas no outro');
};

/* ---------- etapa 9: forcados e foices sobre o castelo, chamas laranja e, no fim, a coroa de papel ---------- */
C.tipos.castelo9=p=>{
  const W=1300,H=1000;
  let s='<style>@media (prefers-reduced-motion:no-preference){.cm-m5:not(.fora) .chama{animation:m5ch .7s ease-in-out var(--a,0s) infinite alternate}@keyframes m5ch{from{transform:scaleY(.86)}to{transform:scaleY(1.1)}}}.cm-m5 .chama{transform-box:fill-box;transform-origin:50% 100%}'+
    '.cm-m5 .cor{opacity:0;transform-box:fill-box;transform-origin:50% 100%;transform:scale(.1)}.cm-m5:not(.fora) .cor{animation:m5co 1.6s cubic-bezier(.2,.9,.3,1.2) var(--a,0s) forwards}@keyframes m5co{to{opacity:1;transform:none}}</style>';
  /* o castelo, só em tinta */
  s+='<g class="ap"'+A(.3)+'>'+pth('M180 880 V500 H240 V440 H300 V500 H360 V440 H420 V500 H480 V300 H450 V260 H500 V300 H560 V260 H610 V300 H580 V500 H640 V440 H700 V500 H760 V440 H820 V500 H880 V880Z','#efe8d4',T,7)+hach('M700 500 H880 V880 H700Z','cm-h1',.35)+
    pth('M430 880 V700 C430 640 630 640 630 700 V880Z','#2b2a27',T,5)+pth('M300 600 V660 M760 600 V660 M540 420 V470','none',T,8)+pth('M180 880 H880','none',T,7)+'</g>';
  /* chamas laranja, a única cor */
  [[170,860,1],[330,880,.8],[520,900,.9],[730,880,.8],[890,860,1.1],[250,500,.7],[790,480,.7]].forEach((q,i)=>{
    s+='<g class="chama" style="--a:'+(i*.13).toFixed(2)+'s"><g class="ap"'+A((.9+i*.16).toFixed(2))+'><g transform="translate('+q[0]+' '+q[1]+') scale('+q[2]+')">'+pth('M0 0 C-60 -40 -50 -120 -10 -170 C-6 -120 20 -110 30 -140 C70 -90 70 -30 0 0Z','#f08a1c',T,4)+pth('M0 0 C-26 -20 -22 -60 -4 -84 C0 -56 14 -52 18 -66 C38 -42 30 -14 0 0Z','#ffd83d',null,0)+'</g></g></g>';});
  /* forcado e foice cruzados, em tinta */
  s+='<g class="ap"'+A(1.4)+'><g transform="translate(540 520) rotate(-35)">'+pth('M0 -300 V320','none','#8a5a33',18)+pth('M0 -300 V320','none',T,3)+pth('M-52 -330 V-250 M0 -340 V-250 M52 -330 V-250 M-52 -250 H52','none',T,13)+pth('M-52 -330 V-250 M0 -340 V-250 M52 -330 V-250 M-52 -250 H52','none','#cfd3d8',6)+'</g></g>';
  s+='<g class="ap"'+A(1.8)+'><g transform="translate(540 520) rotate(35)">'+pth('M0 -300 V320','none','#8a5a33',18)+pth('M0 -300 V320','none',T,3)+pth('M0 -300 C-20 -380 -130 -380 -200 -290 C-120 -330 -50 -320 0 -270Z','#cfd3d8',T,6)+'</g></g>';
  /* a coroa de papel cresce no fim */
  s+='<g class="cor"'+A(18)+'>'+pth('M360 230 L360 110 L450 180 L540 70 L630 180 L720 110 L720 230Z','#ffd83d',T,8)+pth('M360 230 H720 V270 H360Z','#e4b13a',T,8)+circ(540,250,12,'#c93a2a',T,3)+circ(360,110,12,'#c93a2a',T,3)+circ(720,110,12,'#c93a2a',T,3)+circ(540,70,12,'#c93a2a',T,3)+hach('M640 160 L720 110 V270 H640Z','cm-h1',.3)+'</g>';
  return livre(p,W,H,s,'Um castelo em tinta, com um forcado e uma foice cruzados sobre ele e chamas laranja; no fim, uma coroa de papel cresce sobre o castelo');
};

})();
