/* Recortes do tópico 6 do módulo 2 (Renascimento), desenhados em código. Nenhuma imagem de IA e nenhuma imagem de terceiros.
   Carregue DEPOIS de colagem.js e recortes.js. Não altera o motor: só registra tipos novos em C.tipos.
   As obras de arte NÃO são copiadas nem imitadas: aparecem só como esquemas, silhuetas e esboços do LAB.
   Tipos (todos desenhados em SVG): mecenas, moldura, centros, nota6 (nota com ícone), etq6 (etiqueta), anel (linhas da roda),
     retratos (quatro silhuetas presas a uma fita), perspectiva, vitruvio, fita (fita do tempo em faixas), ceus (geocentrismo e heliocentrismo),
     telescopio. Ícones próprios em I6. */
(function(){
'use strict';
const C=window.Colagem;
if(!C||!C.tipos)throw new Error('Carregue colagem.js e recortes.js antes de recortes-m02f.js');
const esc=C.esc;
const T='#1b1a17',P='#f6f1e4',SEPIA='#5b3a1e',OURO='#d9a82c',AM='#ffd83d',CORAL='#e8572a',VERM='#c93a2a',PETR='#2f6f7a';
const SANS='var(--sans,sans-serif)',SERIF='var(--serif,Georgia,serif)';
let sq=0;

/* ---------- CSS ---------- */
(function(){
  const s=document.createElement('style');
  s.textContent=
  '.cm-m6{filter:none}.cm-m6.sh{filter:drop-shadow(0 6px 8px rgba(0,0,0,.22))}.cm-m6 svg{display:block;width:100%;height:100%;overflow:visible}'+
  '.m6-pp{position:absolute;inset:0;background:#f8f2e2;background-image:linear-gradient(rgba(40,40,40,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(40,40,40,.06) 1px,transparent 1px);background-size:36px 36px}'+
  '.m6-pp.sep{background-color:#ecdcb4;background-image:radial-gradient(ellipse at 30% 25%,rgba(255,255,255,.5),transparent 60%),radial-gradient(ellipse at 80% 90%,rgba(120,80,30,.22),transparent 60%)}'+
  '.m6-pp svg{position:absolute;inset:0;width:100%;height:100%}'+
  '.m6-nota{background:#ffd83d;box-shadow:0 3px 5px rgba(0,0,0,.25);display:flex;align-items:center;gap:22px;padding:24px 28px;color:var(--tinta);filter:none;position:absolute}'+
  '.m6-nota .ic{flex:none;width:210px}.m6-nota .ic svg{display:block;width:100%;height:auto;overflow:visible}'+
  '.m6-nota .tx{font:700 60px/1.1 var(--sans)}.m6-nota .tx small{display:block;font:600 40px/1.15 var(--sans);margin-top:6px}'+
  '.m6-nota.col{flex-direction:column;justify-content:center;text-align:center;gap:10px}.m6-nota.col .ic{width:auto}'+
  '.m6-nota .cm-fita{top:-16px}'+
  '.cm-m6 .et{opacity:.2;transition:opacity .5s}.cm-m6 .et.on{opacity:1}'+
  '.cm-m6 .gira{transform-box:fill-box;transform-origin:50% 50%}'+
  '@media (prefers-reduced-motion:no-preference){'+
    '.cm-m6 .ap{opacity:0}.cm-m6:not(.fora) .ap{animation:m6-t .8s ease-out var(--a,0s) forwards}'+
    '.cm-m6 .ar{stroke-dasharray:1;stroke-dashoffset:1}.cm-m6:not(.fora) .ar{animation:m6-d var(--du,1.1s) ease-out var(--a,0s) forwards}'+
    '.cm-m6 .cai{opacity:0}.cm-m6:not(.fora) .cai{animation:m6-c .8s cubic-bezier(.2,.9,.3,1.15) var(--a,0s) forwards}'+
    '.cm-m6 .sobe{opacity:0;transform-box:fill-box;transform-origin:50% 100%}.cm-m6:not(.fora) .sobe{animation:m6-s 1.1s cubic-bezier(.2,.9,.3,1.05) var(--a,0s) forwards}'+
    '.cm-m6 .mk{transform-box:fill-box;transform-origin:0 50%;transform:scaleX(0)}.cm-m6:not(.fora) .mk{animation:m6-m .9s ease-out var(--a,0s) forwards}'+
    '.cm-m6:not(.fora) .gira{animation:m6-g var(--gd,40s) linear infinite}'+
    '@keyframes m6-t{to{opacity:1}}@keyframes m6-d{to{stroke-dashoffset:0}}'+
    '@keyframes m6-c{from{opacity:0;transform:translateY(-50px)}to{opacity:1;transform:none}}'+
    '@keyframes m6-s{from{opacity:0;transform:scaleY(.05)}to{opacity:1;transform:none}}'+
    '@keyframes m6-m{to{transform:scaleX(1)}}@keyframes m6-g{to{transform:rotate(360deg)}}'+
  '}';
  document.head.appendChild(s);
})();

/* ---------- utilidades de desenho ---------- */
const pth=(d,f,s,w,x)=>'<path d="'+d+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+' stroke-linecap="round" stroke-linejoin="round"'+(x||'')+'/>';
const circ=(cx,cy,r,f,s,w,x)=>'<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+(x||'')+'/>';
const rect=(x,y,w,h,f,s,sw,x2)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(sw||3)+'"':'')+' stroke-linejoin="round"'+(x2||'')+'/>';
const tx=(x,y,t,sz,w,anc,fill,fam,ex)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+(anc||'middle')+'"'+(ex||'')+' style="font:'+(w||700)+' '+sz+'px '+(fam||SANS)+';fill:'+(fill||T)+'">'+esc(t)+'</text>';
const sh=()=>'filter="url(#cm-sombra)"';
const A=(a,extra)=>' style="--a:'+a+'s'+(extra||'')+'"';
function roda(cx,cy,rx,ry,seed,v){
  const r=C.rng('r6'+seed),pts=[],n=14,a0=-1.7+r()*.5;
  for(let i=0;i<=n;i++){const a=a0+i/n*Math.PI*2*(v||1.1),k=1+(r()-.5)*.07+(i/n)*.04;pts.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k]);}
  return C.suave(pts,false);
}
/* seta tracejada que se desenha; (x,y) é a ponta e ang o ângulo de chegada em graus */
function seta(d,x,y,ang,a,cor,w,du){
  const id='m6s'+(sq++),c=cor||CORAL,lw=w||7,r=ang*Math.PI/180,s=lw*4.2;
  const p1=[x-s*Math.cos(r-.5),y-s*Math.sin(r-.5)],p2=[x-s*Math.cos(r+.5),y-s*Math.sin(r+.5)];
  return '<mask id="'+id+'" maskUnits="userSpaceOnUse" x="-400" y="-400" width="6000" height="6000"><path class="ar" pathLength="1" d="'+d+'" stroke="#fff" stroke-width="'+(lw+16)+'" fill="none" style="--a:'+a+'s;--du:'+(du||1.1)+'s"/></mask>'+
    '<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+lw+'" stroke-linecap="round" stroke-dasharray="'+(lw*3)+' '+(lw*2.2)+'" mask="url(#'+id+')"/>'+
    '<path class="ap" style="--a:'+(a+(du||1.1)*.8)+'s" d="M'+p1[0].toFixed(1)+' '+p1[1].toFixed(1)+' L'+x+' '+y+' L'+p2[0].toFixed(1)+' '+p2[1].toFixed(1)+'" fill="none" stroke="'+c+'" stroke-width="'+(lw+1)+'" stroke-linecap="round" stroke-linejoin="round"/>';
}
function marca(x,y,w,h,a,cor){return '<rect class="mk" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+(cor||AM)+'" fill-opacity=".85"'+A(a)+'/>';}
function etiq(x,y,w,h,t,sz,a,g){
  return '<g class="cai"'+A(a)+'><g transform="rotate('+(g||0)+' '+(x+w/2)+' '+(y+h/2)+')"><g '+sh()+'>'+rect(x,y,w,h,'#fff',T,3)+'</g>'+
    rect(x+w*.35,y-14,w*.3,28,'rgba(240,228,190,.85)',null,0)+tx(x+w/2,y+h/2+sz*.35,t,sz,700,'middle',T)+'</g></g>';
}
function papel(p,corpo,vb,sep){
  return {cls:'cm-m6 sh',html:'<div class="m6-pp rasgado'+(sep?' sep':'')+'" style="--clip:'+C.rasgo(p.id,1.4)+'"><svg viewBox="0 0 '+vb[0]+' '+vb[1]+'" role="img" aria-label="'+esc(p.rotulo||'')+'">'+corpo+'</svg></div>'};
}
function solto(p,corpo,vb){
  return {cls:'cm-m6',html:'<svg viewBox="0 0 '+vb[0]+' '+vb[1]+'" role="img" aria-label="'+esc(p.rotulo||'')+'">'+corpo+'</svg>'};
}

/* ---------- ícones pequenos (caixa 0 a 100), traço de tinta ---------- */
const I6={
  coluna:()=>rect(14,8,72,14,'#e8dcc0',T,4)+rect(28,22,44,58,'#f4ecd6',T,4)+pth('M40 24 V78 M50 24 V78 M60 24 V78','none',T,2.5)+rect(14,80,72,12,'#e8dcc0',T,4),
  lupa:()=>circ(42,42,26,'rgba(255,255,255,.65)',T,7)+pth('M62 62 L88 88','none',T,12)+pth('M30 34 C32 28 38 24 44 24','none',T,4),
  humano:()=>circ(50,22,13,'#f1d9b8',T,5)+pth('M50 36 V68 M26 48 L74 48 M50 68 L34 94 M50 68 L66 94','none',T,7),
  livro:()=>pth('M50 24 C38 14 20 14 6 20 V80 C20 74 38 74 50 84 C62 74 80 74 94 80 V20 C80 14 62 14 50 24Z','#f4ecd6',T,4)+pth('M50 24 V84 M16 34 C26 32 36 34 44 40 M16 48 C26 46 36 48 44 54 M84 34 C74 32 64 34 56 40 M84 48 C74 46 64 48 56 54','none',T,2.5),
  engrenagem:()=>{let d='';for(let i=0;i<8;i++){d+='<rect x="42" y="4" width="16" height="22" rx="3" transform="rotate('+(i*45)+' 50 50)" fill="#c9c3b4" stroke="'+T+'" stroke-width="3"/>';}return d+circ(50,50,30,'#d8d2c2',T,5)+circ(50,50,11,'#f6f1e4',T,5);},
  folha:()=>pth('M18 70 C14 30 40 10 82 14 C86 52 64 78 18 70Z','#9bc07a',T,4)+pth('M20 68 C40 50 56 36 76 20 M44 48 L52 52 M34 58 L44 62 M56 38 L66 40','none',T,3)+circ(62,66,15,'rgba(255,255,255,.7)',T,5)+pth('M73 77 L90 94','none',T,9),
  assinatura:a=>rect(6,22,88,56,'rgba(255,255,255,.55)',T,3)+'<path class="ar" pathLength="1" d="M14 64 C22 28 32 28 32 54 C32 70 40 40 48 48 C54 54 48 70 60 56 C68 46 72 58 88 38" fill="none" stroke="'+SEPIA+'" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"'+A(a||1,';--du:2.6s')+'/>'+pth('M12 72 C40 76 64 72 90 66','none',SEPIA,3,' class="ap"'+A((a||1)+2.4)),
  olho:()=>pth('M6 50 C26 20 74 20 94 50 C74 80 26 80 6 50Z','#fff',T,5)+circ(50,50,15,'#6b4a2a',T,4)+circ(50,50,6,T)+circ(55,45,3.5,'#fff'),
  orelha:()=>pth('M34 80 C14 70 12 24 44 14 C76 6 90 34 80 56 C74 70 62 66 60 78 C58 90 42 90 34 80Z','#f1d9b8',T,5)+pth('M44 70 C34 56 36 34 52 30 C64 28 70 40 62 50','none',T,4),
  mao:()=>pth('M30 94 C22 80 18 68 22 58 L28 44 C30 40 36 42 36 48 L40 56 L40 14 C40 8 48 8 48 14 L50 44 L52 10 C52 4 60 4 60 10 L60 44 L66 18 C68 12 76 14 74 20 L70 52 L80 36 C84 32 90 36 86 42 L74 72 C70 84 66 90 62 94Z','#f1d9b8',T,4),
  nariz:()=>pth('M50 8 C48 36 44 54 34 70 C28 78 36 88 48 86 C54 90 64 90 70 84 C76 76 66 72 62 66 C58 56 56 30 50 8Z','#f1d9b8',T,5)+pth('M42 80 C46 78 50 78 52 80','none',T,3),
  boca:()=>pth('M6 52 C24 34 38 36 50 42 C62 36 76 34 94 52 C76 78 24 78 6 52Z','#d65a4a',T,5)+pth('M8 52 C30 56 70 56 92 52','none',T,4),
  moedas:()=>pth('M22 40 C8 62 18 92 50 92 C82 92 92 62 78 40 C70 32 62 28 62 20 L38 20 C38 28 30 32 22 40Z','#c9a36a',T,4)+rect(34,16,32,8,'#a07838',T,3)+circ(50,64,16,OURO,T,3)
};
function icone6(n,a){const f=I6[n];return f?'<svg viewBox="0 0 100 100" aria-hidden="true">'+f(a)+'</svg>':'';}
C.icone6=icone6;

/* ---------- etiqueta e nota (HTML), com tamanho de letra em px da mesa ---------- */
C.tipos.etq6=p=>({cls:'cm-etq',style:'font-size:'+(p.tam||52)+'px;line-height:1.15;padding:14px 22px!important;',html:'<span class="cm-fita" style="--fx:'+(p.fita!=null?p.fita:12)+'%;--fg:-5deg"></span><span>'+esc(p.texto)+'</span>'});
C.tipos.nota6=p=>({cls:'m6-nota cm-m6'+(p.col?' col':''),style:(p.tam?'--s:'+p.tam+'px;':''),html:
  '<span class="cm-fita" style="--fx:'+(p.fita!=null?p.fita:38)+'%;--fg:'+(p.fg!=null?p.fg:-3)+'deg"></span>'+
  (p.sentidos?'<div class="ic" style="width:auto;display:flex;gap:10px;order:2">'+['olho','orelha','mao','nariz','boca'].map(n=>'<span style="width:84px;display:block">'+icone6(n)+'</span>').join('')+'</div>'
    :'<div class="ic">'+icone6(p.icone,1.4)+'</div>')+
  '<div class="tx"'+(p.tam?' style="font-size:'+p.tam+'px"':'')+'>'+esc(p.texto)+(p.sub?'<small>'+esc(p.sub)+'</small>':'')+'</div>'});

/* ---------- mecenas: saco de moedas vira pincel e livro ---------- */
C.tipos.mecenas=p=>{
  let s='';
  // saco
  s+='<g class="cai"'+A(.2)+'><g '+sh()+'>'+pth('M150 430 C106 530 150 650 262 650 C374 650 414 530 372 430 C344 388 304 366 292 336 L232 336 C220 366 182 388 150 430Z','#c9a36a',T,6)+
    pth('M232 336 C218 296 196 284 178 272 M292 336 C306 296 326 284 344 272','none',T,6)+
    pth('M206 340 C240 360 284 360 318 340','none',T,6)+'</g>'+
    circ(262,510,56,OURO,T,5)+circ(262,510,38,'none',T,3)+pth('M262 486 V534 M240 510 H284','none',T,4)+'</g>';
  // moedas ao lado
  [[470,640],[470,618],[470,596]].forEach((q,i)=>{s+='<g class="cai"'+A(.6+i*.15)+'>'+pth('M410 '+q[1]+' V'+(q[1]+14)+' C410 '+(q[1]+36)+' 530 '+(q[1]+36)+' 530 '+(q[1]+14)+' V'+q[1],OURO,T,4)+'<ellipse cx="470" cy="'+q[1]+'" rx="60" ry="20" fill="#f0c84a" stroke="'+T+'" stroke-width="4"/></g>';});
  s+=seta('M420 330 C540 150 700 150 800 260',800,260,60,1.4,CORAL,8,1.3);
  // pincel (gira em torno do ponto 880 380)
  s+='<g class="cai"'+A(2.4)+'><g transform="translate(880 330) rotate(38)">'+
    pth('M-15 -190 L15 -190 L11 -20 L-11 -20Z','#8a5a33',T,5)+rect(-14,-20,28,60,'#c9c3b4',T,5)+
    pth('M-26 40 C-34 96 -10 140 0 168 C10 140 34 96 26 40Z',CORAL,T,5)+pth('M-8 60 C-10 100 -4 128 0 150','none','#fff',4,' stroke-opacity=".6"')+'</g></g>';
  // livro aberto
  s+='<g class="cai"'+A(2.9)+'><g transform="translate(1010 350) rotate(-6)"><g '+sh()+'>'+pth('M85 14 C60 -4 20 -4 -6 8 V168 C20 156 60 156 85 176 C110 156 150 156 176 168 V8 C150 -4 110 -4 85 14Z','#f4ecd6',T,6)+'</g>'+
    pth('M85 14 V176','none',T,5)+pth('M10 42 C30 38 52 42 70 54 M10 74 C30 70 52 74 70 86 M10 106 C30 102 52 106 70 118 M160 42 C140 38 118 42 100 54 M160 74 C140 70 118 74 100 86 M160 106 C140 102 118 106 100 118','none',T,4,' stroke-opacity=".6"')+'</g></g>';
  // etiqueta
  s+=etiq(400,545,780,125,'mecenas: quem paga a arte',60,3.4,-1.5);
  return solto(p,s,[1200,700]);
};

/* ---------- galeria: três molduras (n = 0, 1, 2) ---------- */
function bustoFrente(cx,cy,k,halo){
  let s='';
  if(halo)s+=circ(cx,cy-10*k,95*k,'rgba(240,200,70,.35)',OURO,22*k)+circ(cx,cy-10*k,95*k,'none',T,4*k);
  s+='<g transform="translate('+cx+' '+cy+') scale('+k+')">'+pth('M-150 210 C-140 120 -80 96 -40 86 L40 86 C80 96 140 120 150 210Z','#3b2f26',T,3)+rect(-24,40,48,50,'#3b2f26')+'<ellipse cx="0" cy="-10" rx="62" ry="76" fill="#3b2f26"/>'+pth('M-62 -20 C-70 -90 70 -90 62 -20 C40 -60 -40 -60 -62 -20Z','#241b15')+'</g>';
  return s;
}
function bustoPerfil(cx,cy,k,dir,gorro){
  const d=dir||1;
  return '<g transform="translate('+cx+' '+cy+') scale('+(k*d)+' '+k+')">'+pth('M-170 220 C-150 130 -100 106 -52 94 L-50 66 C-70 44 -74 14 -70 -20 C-66 -80 -30 -110 14 -106 C56 -102 80 -70 78 -34 C77 -20 92 -12 96 -4 L84 6 L88 22 C86 40 72 54 52 60 L52 94 C110 106 150 130 170 220Z','#3b2f26',T,3)+
    (gorro?pth('M-72 -34 C-80 -100 -20 -130 30 -118 C78 -106 90 -62 76 -34 C50 -58 -30 -66 -72 -34Z','#7a2a22',T,3)+pth('M-70 -34 C-30 -52 50 -52 76 -32','none','#d9a82c',6):'')+'</g>';
}
function cupido(cx,cy,k){
  const ink=SEPIA;
  return '<g transform="translate('+cx+' '+cy+') scale('+k+')" fill="none" stroke="'+ink+'" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">'+
    '<circle cx="0" cy="-70" r="24" fill="#f1d9b8"/>'+pth('M-18 -90 C-10 -102 10 -102 18 -90','none',ink,4)+
    pth('M0 -46 V30 M0 -34 L-34 -8 M0 -34 L40 -20 M0 30 L-22 76 M0 30 L24 70','none',ink,6)+
    pth('M-8 -30 C-60 -70 -86 -46 -70 -8 C-56 -18 -36 -16 -8 -6Z','#fff',ink,4)+pth('M8 -30 C60 -70 86 -46 70 -8 C56 -18 36 -16 8 -6Z','#fff',ink,4)+
    pth('M56 -70 C100 -30 100 20 56 56','none',ink,6)+pth('M56 -70 L56 56','none',ink,2.5)+pth('M-30 -12 L100 -12 M100 -12 L84 -22 M100 -12 L84 0','none',ink,4)+'</g>';
}
C.tipos.moldura=p=>{
  const n=p.n||0,nomes=['Trecento','Quattrocento','Cinquecento'],datas=['1300','1400','1500'],subs=['arte sacra','sacra e profana','laica e profana'];
  let s='';
  const a0=.2+n*.3;
  s+=marca(70,26,660,104,1.8+n*.6);
  s+=tx(400,112,nomes[n],96,400,'middle',T,SERIF,' class="ap"'+A(a0));
  const fr='<g class="cai"'+A(a0+.2)+'><g '+sh()+'>'+rect(90,170,620,740,'#e8d6a4','#b98a2a',40)+'</g>'+rect(110,190,580,700,'#ecdcb2',T,4)+'</g>';
  s+=fr;
  if(n===0){
    s+='<g class="ap"'+A(a0+.9)+'>'+bustoFrente(400,520,1.35,true)+'</g>';
  }else if(n===1){
    s+='<clipPath id="m6c'+n+p.id+'a"><rect x="110" y="190" width="290" height="700"/></clipPath><clipPath id="m6c'+n+p.id+'b"><rect x="400" y="190" width="290" height="700"/></clipPath>';
    s+='<g class="ap"'+A(a0+.9)+'><g clip-path="url(#m6c'+n+p.id+'a)">'+bustoFrente(400,520,1.35,true)+'</g><g clip-path="url(#m6c'+n+p.id+'b)">'+bustoPerfil(400,500,1.1,-1,true)+'</g></g>';
    s+=pth('M400 190 V890','none',T,3,' stroke-dasharray="14 10" stroke-opacity=".6"');
  }else{
    s+='<g class="ap"'+A(a0+.9)+'>'+bustoPerfil(290,560,.95,1,true)+'</g>';
    s+='<g class="ap"'+A(a0+1.7)+'>'+cupido(535,640,1.15)+'</g>';
  }
  const gx=60,gy=950;
  s+='<g class="cai"'+A(a0+2.2)+'><g transform="rotate('+(n-1)*2+' 400 1060)"><g '+sh()+'>'+rect(gx+120,gy,520,200,'#fff',T,3)+'</g>'+rect(gx+300,gy-14,160,28,'rgba(240,228,190,.85)')+
    tx(400,gy+98,datas[n],92,700,'middle',T)+tx(400,gy+160,subs[n],48,600,'middle','#3a362d')+'</g></g>';
  return solto(p,s,[800,1200]);
};

/* ---------- teocentrismo e antropocentrismo ---------- */
function deus(cx,cy,r,a,rotulo,sz){
  let s='';
  for(let i=0;i<14;i++){const g=i/14*Math.PI*2,r1=r*1.25,r2=r*(i%2?1.55:1.8);s+='<path d="M'+(cx+Math.cos(g)*r1).toFixed(1)+' '+(cy+Math.sin(g)*r1).toFixed(1)+' L'+(cx+Math.cos(g)*r2).toFixed(1)+' '+(cy+Math.sin(g)*r2).toFixed(1)+'" stroke="'+OURO+'" stroke-width="'+(r*.1)+'" stroke-linecap="round"/>';}
  s+=circ(cx,cy,r,'#f6d968',T,5);
  return '<g class="ap"'+A(a)+'>'+s+(rotulo?tx(cx,cy+r*2.45+sz*.2,rotulo,sz,700,'middle',T):'')+'</g>';
}
C.tipos.centros=p=>{
  let s='';
  const C1=[470,520],C2=[1530,520],R=350;
  // círculos de compasso
  s+='<g class="ap"'+A(.2)+'>'+circ(C1[0],C1[1],R,'#fffdf6',T,5,' stroke-dasharray="4 0"')+circ(C1[0],C1[1],R-70,'none',T,3,' stroke-dasharray="12 12" stroke-opacity=".5"')+'</g>';
  s+='<g class="ap"'+A(.5)+'>'+circ(C2[0],C2[1],R,'#fffdf6',T,5)+circ(C2[0],C2[1],R-70,'none',T,3,' stroke-dasharray="12 12" stroke-opacity=".5"')+'</g>';
  s+=marca(40,10,860,96,1.2)+tx(470,84,'teocentrismo',76,700,'middle',T,SERIF)+tx(470,150,'(Idade Média)',58,600,'middle','#3a362d');
  s+=marca(1060,10,940,96,2)+tx(1530,84,'antropocentrismo',76,700,'middle',T,SERIF);
  s+=deus(C1[0],C1[1]-30,70,1,'Deus',66);
  // pessoas pequenas em volta de Deus (tudo gira em torno dele)
  for(let i=0;i<6;i++){const g=i/6*Math.PI*2+.3,x=C1[0]+Math.cos(g)*235,y=C1[1]-30+Math.sin(g)*215;s+='<g class="ap"'+A(1.2+i*.12)+' transform="translate('+x.toFixed(0)+' '+y.toFixed(0)+') scale(.34)">'+icone6('humano').replace('<svg viewBox="0 0 100 100" aria-hidden="true">','<g transform="translate(-50 -50)">').replace('</svg>','</g>')+'</g>';}
  // ser humano no centro
  s+='<g class="cai"'+A(1.4)+'><g transform="translate(1470 395) scale(2.3)">'+I6.humano()+'</g></g>';
  s+=tx(1500,690,'ser humano',66,700,'middle',T);
  s+=deus(1745,350,36,2.4,'Deus',60);
  s+=seta('M860 440 C960 360 1060 360 1140 430',1140,430,40,2.8,CORAL,8,1.2);
  return solto(p,s,[2000,900]);
};

/* ---------- anel de linhas tracejadas entre as notas da roda ---------- */
C.tipos.anel=p=>{
  let s='';
  (p.trechos||[]).forEach((t,i)=>{
    const [x1,y1,x2,y2]=t,dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,k=Math.min(80,L*.12);
    const d='M'+x1+' '+y1+' Q'+((x1+x2)/2-dy/L*k)+' '+((y1+y2)/2+dx/L*k)+' '+x2+' '+y2;
    const id='m6a'+(sq++);
    s+='<mask id="'+id+'" maskUnits="userSpaceOnUse" x="-100" y="-100" width="'+(p.w+200)+'" height="'+(p.h+200)+'"><path class="ar" pathLength="1" d="'+d+'" stroke="#fff" stroke-width="30" fill="none"'+A(.2+i*.35,';--du:1.2s')+'/></mask>'+
      '<path d="'+d+'" fill="none" stroke="'+T+'" stroke-opacity=".6" stroke-width="7" stroke-linecap="round" stroke-dasharray="22 16" mask="url(#'+id+')"/>';
  });
  return solto(p,s,[p.w,p.h]);
};

/* ---------- quatro silhuetas presas a uma fita ---------- */
function silh(qm,cx,cy,k){
  const I=SEPIA,F='#2b2118',L=(d,w)=>pth(d,'none',I,w||2,' stroke-opacity=".7"');
  let s='<g transform="translate('+cx+' '+cy+') scale('+k+')"><clipPath id="m6q'+qm+'"><circle cx="0" cy="0" r="96"/></clipPath><g clip-path="url(#m6q'+qm+')">'+
    '<circle cx="0" cy="0" r="100" fill="#e8d9b0"/>';
  const ombros=pth('M-96 100 C-92 56 -52 40 -24 36 L24 36 C52 40 92 56 96 100Z',F);
  const pescoco=rect(-14,10,28,30,F);
  const rosto='<ellipse cx="0" cy="-22" rx="30" ry="38" fill="'+F+'"/>';
  if(qm==='dona'){ // gorro redondo
    s+=ombros+pescoco+rosto+pth('M-36 -42 C-40 -84 40 -84 36 -42 C20 -58 -20 -58 -36 -42Z','#6e2a24',I,2)+pth('M-34 -44 C-10 -52 12 -52 34 -44','none',OURO,5)+pth('M-30 -16 C-34 -4 -28 12 -18 18','none','#f6f1e4',1.6,' stroke-opacity=".0"');
  }else if(qm==='leo'){ // cabelo e barba longos, esboço
    s+=ombros+pescoco+pth('M-36 -50 C-52 -30 -50 20 -40 60 C-34 80 -20 84 -12 70 L-18 20 Z',F)+pth('M36 -50 C52 -30 50 20 40 60 C34 80 20 84 12 70 L18 20Z',F)+rosto+
      pth('M-26 -6 C-30 30 -20 80 0 92 C20 80 30 30 26 -6 C16 10 -16 10 -26 -6Z',F)+pth('M-38 -54 C-24 -84 24 -84 38 -54 C20 -70 -20 -70 -38 -54Z',F)+
      L('M-20 20 L-16 80 M-10 24 L-6 88 M0 26 L0 92 M10 24 L6 88 M20 20 L16 80',1.6)+L('M-46 -30 L-44 30 M46 -30 L44 30',1.6);
  }else if(qm==='mic'){ // cabelo curto, barba curta
    s+=ombros+pescoco+rosto+pth('M-34 -44 C-34 -80 34 -80 34 -44 C20 -62 -20 -62 -34 -44Z',F)+pth('M-24 -2 C-22 22 -8 34 0 34 C8 34 22 22 24 -2 C14 8 -14 8 -24 -2Z',F)+
      pth('M-30 -48 C-38 -52 -42 -40 -36 -34 M30 -48 C38 -52 42 -40 36 -34','none',I,2);
  }else{ // barrete largo e cabelo ao pescoço
    s+=ombros+pescoco+pth('M-34 -40 C-44 -10 -40 20 -30 34 L-20 20Z',F)+pth('M34 -40 C44 -10 40 20 30 34 L20 20Z',F)+rosto+
      pth('M-48 -52 C-60 -70 -20 -90 26 -84 C66 -78 70 -56 40 -48 C20 -56 -20 -58 -48 -52Z','#3c4a63',I,2)+pth('M-44 -54 C-10 -62 30 -62 52 -52','none',OURO,4);
  }
  return s+'</g>'+circ(0,0,98,'none',AM,14)+circ(0,0,106,'none',T,3)+'</g>';
}
C.tipos.retratos=p=>{
  const W=2040,H=900;let s='';
  // fita do tempo (tira de papel) com as faixas dos séculos
  s+='<g class="ap"'+A(.1)+'><g '+sh()+'>'+rect(20,20,2000,120,'#f0e6c8',T,3)+'</g>'+rect(20,20,1000,120,'#c9dcae',null,0,' fill-opacity=".5"')+rect(1020,20,1000,120,'#f0b8a8',null,0,' fill-opacity=".5"')+
    pth('M20 140 H2020','none',T,3)+tx(520,102,'século XV',60,700,'middle',T)+tx(1520,102,'século XVI',60,700,'middle',T)+'</g>';
  const q=[['dona','Donatello','1386 a 1466'],['leo','Leonardo','1452 a 1519'],['mic','Michelangelo','1475 a 1564'],['raf','Rafael','1483 a 1520']];
  q.forEach((o,i)=>{
    const cx=270+i*500,a=.7+i*.6;
    s+='<g class="cai"'+A(a)+'>'+pth('M'+cx+' 140 V210','none','#b9ac86',6)+
      '<g transform="translate('+(cx-60)+' 122) rotate(-4 60 18)">'+rect(0,0,120,34,'rgba(240,228,190,.85)')+'</g>'+
      '<g '+sh()+'>'+silh(o[0],cx,420,1.95)+'</g>'+
      '<g transform="rotate('+(i%2?1.5:-1.5)+' '+cx+' 700)"><g '+sh()+'>'+rect(cx-215,640,430,170,'#fff',T,3)+'</g>'+tx(cx,712,o[1],62,700,'middle',T)+tx(cx,778,o[2],46,600,'middle','#3a362d')+'</g></g>';
  });
  return solto(p,s,[W,H]);
};

/* ---------- perspectiva com ponto de fuga ---------- */
C.tipos.perspectiva=p=>{
  const W=1300,H=960,vx=650,vy=330;let s='';
  // parede do fundo com arcos
  s+='<g class="ap"'+A(.2)+'>'+rect(400,130,500,200,'#e9dcb8',T,4);
  [450,590,730].forEach(x=>{s+=pth('M'+x+' 330 V220 C'+x+' 160 '+(x+120)+' 160 '+(x+120)+' 220 V330','#d4c49a',T,4);});
  s+='</g>';
  // piso: ladrilhos
  const bx=[-60,140,340,540,740,940,1140,1340,1540];
  const ys=[330,372,424,490,578,700,860,1060];
  const xAt=(b,y)=>vx+(b-vx)*(y-vy)/(960-vy);
  let tiles='';
  for(let j=0;j<ys.length-1;j++){for(let i=0;i<bx.length-1;i++){
    const y1=ys[j],y2=ys[j+1];
    tiles+='<path d="M'+xAt(bx[i],y1).toFixed(1)+' '+y1+' L'+xAt(bx[i+1],y1).toFixed(1)+' '+y1+' L'+xAt(bx[i+1],y2).toFixed(1)+' '+y2+' L'+xAt(bx[i],y2).toFixed(1)+' '+y2+'Z" fill="'+((i+j)%2?'#c9b78a':'#f1e6c4')+'"/>';}}
  s+='<clipPath id="m6pf"><rect x="0" y="330" width="1300" height="630"/></clipPath><g class="ap" clip-path="url(#m6pf)"'+A(.5)+'>'+tiles+'</g>';
  s+=pth('M0 330 H1300','none',T,5,' class="ap"'+A(.5));
  // linhas de fuga
  bx.forEach((b,i)=>{const d='M'+b+' 960 L'+vx+' '+vy;s+=pth(d,'none',VERM,4,' class="ar" stroke-opacity=".8"'+A(1.4+i*.3,';--du:1.4s'));});
  s+=circ(vx,vy,42,AM,T,5,' class="cai"'+A(4.6))+circ(vx,vy,12,T,null,0,' class="ap"'+A(4.8));
  s+=etiq(790,150,420,108,'ponto de fuga',54,5.2,2);
  s+=seta('M860 262 C830 300 780 320 700 332',700,332,150,5.6,CORAL,6,.8);
  return papel(p,s,[W,H]);
};

/* ---------- Homem Vitruviano: esquema próprio, sem copiar o desenho ---------- */
C.tipos.vitruvio=p=>{
  const W=1500,H=1500,cx=750,topo=250,pes=1150,alt=900,um=594,R=pes-um;
  let s='';
  const ink=SEPIA,sw=7;
  const fig=(d,w)=>pth(d,'none',ink,w||sw);
  let f='';
  // cabeça e pescoço
  f+='<ellipse cx="750" cy="'+(topo+58)+'" rx="52" ry="62" fill="#f4e6c0" stroke="'+ink+'" stroke-width="'+sw+'"/>'+fig('M706 '+(topo+40)+' C720 '+(topo+22)+' 780 '+(topo+22)+' 794 '+(topo+40))+fig('M732 '+(topo+120)+' V'+(topo+150)+' M768 '+(topo+120)+' V'+(topo+150));
  // tronco
  f+=pth('M640 410 C680 396 720 392 750 392 C780 392 820 396 860 410 C850 480 838 560 826 650 C832 676 836 690 838 704 L662 704 C664 690 668 676 674 650 C662 560 650 480 640 410Z','#f4e6c0',ink,sw);
  f+=fig('M750 400 V700 M690 470 C720 490 780 490 810 470 M704 548 C730 560 770 560 796 548',4);
  f+=circ(750,um,6,ink);
  // braços horizontais e erguidos
  f+=fig('M640 412 C560 410 420 424 300 436 M860 412 C940 410 1080 424 1200 436',sw+2);
  f+=fig('M640 410 C560 380 430 320 330 280 M860 410 C940 380 1070 320 1170 280',sw+2);
  // pernas juntas e abertas
  f+=fig('M690 704 C694 800 700 980 708 1128 M810 704 C806 800 800 980 792 1128',sw+1);
  f+=fig('M680 704 C640 800 590 960 540 1118 M820 704 C860 800 910 960 960 1118',sw+1);
  // mãos e pés
  [[300,436],[1200,436],[330,280],[1170,280]].forEach(q=>{f+='<ellipse cx="'+q[0]+'" cy="'+q[1]+'" rx="22" ry="14" fill="#f4e6c0" stroke="'+ink+'" stroke-width="5"/>';});
  [[708,1138],[792,1138],[540,1128],[960,1128]].forEach(q=>{f+='<ellipse cx="'+q[0]+'" cy="'+q[1]+'" rx="34" ry="14" fill="#f4e6c0" stroke="'+ink+'" stroke-width="5"/>';});
  // sombreado em traços
  let hz='';for(let i=0;i<9;i++){hz+='M'+(668+i*8)+' 520 L'+(660+i*8)+' 640 ';}
  f+=pth(hz,'none',ink,2.5,' stroke-opacity=".45"');
  s+='<g class="cai"'+A(.3)+'>'+f+'</g>';
  // círculo amarelo (centro no umbigo) e quadrado vermelho
  const cd='M'+(cx-R)+' '+um+' A'+R+' '+R+' 0 1 1 '+(cx+R)+' '+um+' A'+R+' '+R+' 0 1 1 '+(cx-R)+' '+um;
  s+=pth(cd,'none',T,22,' stroke-opacity=".12" class="ar"'+A(1.6,';--du:2.2s'))+pth(cd,'none',AM,14,' class="ar"'+A(1.6,';--du:2.2s'));
  const qd='M300 '+topo+' H1200 V'+pes+' H300 Z';
  s+=pth(qd,'none',VERM,10,' class="ar"'+A(3.9,';--du:2.2s'));
  // centro do círculo no umbigo
  s+=pth(roda(cx,um,38,38,'umb'),'none',VERM,7,' class="ar"'+A(6.4,';--du:.8s'));
  s+=etiq(880,520,230,86,'centro',50,7.0,2);
  s+=seta('M880 560 C850 566 810 576 790 592',790,592,155,7.2,VERM,5,.7);
  // régua da altura (esquerda) e da envergadura (embaixo)
  let rg='';
  rg+=pth('M236 '+topo+' V'+pes,'none',T,6)+pth('M222 '+topo+' H250 M222 '+pes+' H250','none',T,6);
  for(let i=1;i<8;i++){const y=topo+alt/8*i;rg+=pth('M226 '+y+' H246','none',T,4);}
  rg+=pth('M300 1236 H1200','none',T,6)+pth('M300 1222 V1250 M1200 1222 V1250','none',T,6);
  for(let i=1;i<8;i++){const x=300+alt/8*i;rg+=pth('M'+x+' 1226 H'+x+' V1246','none',T,4);}
  s+='<g class="ap"'+A(8.2)+'>'+rg+'</g>';
  s+='<g class="ap"'+A(8.8)+'>'+marca(130,620,70,330,8.8)+'<g transform="translate(180 790) rotate(-90)">'+tx(0,0,'altura',54,700,'middle',T)+'</g></g>';
  s+='<g class="ap"'+A(9.2)+'>'+rect(560,1268,380,66,AM,null,0,' fill-opacity=".85"')+tx(750,1318,'envergadura',54,700,'middle',T)+'</g>';
  s+='<g class="ap"'+A(10)+'>'+rect(380,1380,740,84,'#fff',T,3)+tx(750,1440,'altura igual à envergadura',50,700,'middle',T)+'</g>';
  s+=tx(750,38,'esquema inspirado no Homem Vitruviano, de Leonardo',40,600,'middle','#3a362d');
  return papel(p,s,[W,H],true);
};

/* ---------- fita do tempo em faixas ---------- */
C.tipos.fita=p=>{
  const W=3400,H=720,y0=270,hb=150;let s='';
  const faixas=[[60,600,'#ecd08a','Trecento','século XIV'],[600,1500,'#b6d3d6','Quattrocento','século XV'],[1500,2080,'#f2b9a8','Cinquecento','século XVI'],[2080,3340,'#c8dcae','fora da Itália','séculos XVI e XVII']];
  faixas.forEach((f,i)=>{
    const a=.2+i*.5,last=i===3;
    s+='<g class="cai"'+A(a)+'><g '+sh()+'>'+(last?pth('M'+f[0]+' '+y0+' H'+(f[1]-50)+' L'+f[1]+' '+(y0+hb/2)+' L'+(f[1]-50)+' '+(y0+hb)+' H'+f[0]+'Z',f[2],T,4):rect(f[0],y0,f[1]-f[0],hb,f[2],T,4))+'</g>'+
      tx((f[0]+f[1])/2-(last?20:0),y0+70,f[3],62,700,'middle',T,SERIF)+tx((f[0]+f[1])/2-(last?20:0),y0+120,f[4],42,600,'middle','#3a362d')+'</g>';
  });
  if(p.marcos){
    const M=[[1000,'cerca de 1450','imprensa de Gutenberg',5],[1360,'cerca de 1490','Homem Vitruviano',5],
      [2200,'1543','Copérnico',6],[2480,'1572','Os Lusíadas',6],[2760,'cerca de 1595','Romeu e Julieta',6],[3040,'1605','Dom Quixote',6],[2340,'1609','Kepler',6],[2620,'1610','Galileu',6],[2900,'cerca de 1630','Don Juan',6]];
    // posições alternadas: acima (y 110) e abaixo (y 520)
    const pos=[['a'],['b'],['a'],['b'],['a'],['b'],['b'],['a'],['b']];
    const lay=[[1000,'a'],[1360,'b'],[2160,'a'],[2440,'b'],[2720,'a'],[3000,'b'],[2300,'b'],[2580,'a'],[2860,'b']];
    M.forEach((m,i)=>{
      const x=lay[i][0],acima=lay[i][1]==='a',ys=acima?y0:y0+hb,ye=acima?y0-70:y0+hb+80;
      const et=p.todas?'':' data-et="'+(m[3]===5?'5,6':'6')+'" class="et"';
      s+='<g'+(p.todas?' class="ap"'+A(1.8+i*.3):et)+'>'+pth('M'+x+' '+ys+' V'+ye,'none',T,4)+circ(x,ys,12,CORAL,T,3)+
        tx(x,acima?ye-72:ye+56,m[1],46,700,'middle',T)+tx(x,acima?ye-26:ye+104,m[2],40,600,'middle','#3a362d')+'</g>';
    });
  }
  s+=tx(W-60,H-14,'a régua não está em escala',34,600,'end','#4a463e',SANS,' font-style="italic"');
  return papel(p,s,[W,H]);
};

/* ---------- geocentrismo e heliocentrismo ---------- */
C.tipos.ceus=p=>{
  const W=2400,H=1100;let s='';
  const L=[600,640],Rr=[1800,640];
  s+=marca(60,20,1080,110,1.2)+tx(600,110,'geocentrismo',92,700,'middle',T,SERIF);
  s+=marca(1260,20,1080,110,3.8)+tx(1800,110,'heliocentrismo',92,700,'middle',T,SERIF);
  s+=tx(600,180,'a Terra no centro',54,600,'middle','#3a362d')+tx(1800,180,'o Sol no centro',54,600,'middle','#3a362d');
  // painel esquerdo
  [[170,'Lua'],[270,'Sol'],[370,'estrelas']].forEach((o,i)=>{
    s+='<g class="ap"'+A(.6+i*.5)+'>'+circ(L[0],L[1],o[0]*1.0,'none',T,4,' stroke-dasharray="14 12" stroke-opacity=".7"')+'</g>';
  });
  s+='<g class="ap"'+A(.5)+'>'+circ(L[0],L[1],60,'#5b9bd0',T,5)+pth('M570 620 C580 596 604 594 612 614 C620 632 596 646 580 650 C566 650 560 634 570 620Z','#79a85a',T,3)+pth('M620 666 C634 658 648 668 640 684 C630 690 618 680 620 666Z','#79a85a',T,3)+'</g>';
  s+='<g class="gira" style="--gd:36s"><g class="ap"'+A(1.1)+'>'+circ(L[0]+170,L[1],24,'#e9e4d2',T,4)+circ(L[0]+162,L[1]-6,5,'#c9c3b0')+'</g></g>';
  s+='<g class="gira" style="--gd:70s"><g class="ap"'+A(1.6)+'>'+circ(L[0],L[1]-270,38,'#f6d968',T,5)+'</g></g>';
  s+='<g class="ap"'+A(2.1)+'>'+[[420,320],[800,330],[330,560],[880,560],[330,780],[860,820],[470,900],[740,930]].map(q=>'<path d="M'+q[0]+' '+(q[1]-18)+' L'+(q[0]+5)+' '+(q[1]-5)+' L'+(q[0]+18)+' '+q[1]+' L'+(q[0]+5)+' '+(q[1]+5)+' L'+q[0]+' '+(q[1]+18)+' L'+(q[0]-5)+' '+(q[1]+5)+' L'+(q[0]-18)+' '+q[1]+' L'+(q[0]-5)+' '+(q[1]-5)+'Z" fill="'+OURO+'" stroke="'+T+'" stroke-width="2"/>').join('')+'</g>';
  s+=tx(600,1040,'Lua, Sol e estrelas giram em volta da Terra',46,600,'middle','#3a362d');
  // painel direito
  s+='<g class="ap"'+A(3.9)+'>'+circ(Rr[0],Rr[1],110,'none',T,4,' stroke-dasharray="14 12" stroke-opacity=".7"')+circ(Rr[0],Rr[1],190,'none',T,4,' stroke-dasharray="14 12" stroke-opacity=".7"')+circ(Rr[0],Rr[1],270,'none',T,4,' stroke-dasharray="14 12" stroke-opacity=".7"')+'</g>';
  // elipse de Kepler (Sol em um dos focos)
  s+='<g class="ap"'+A(5.2)+'><ellipse cx="'+(Rr[0]+40)+'" cy="'+Rr[1]+'" rx="400" ry="300" fill="none" stroke="'+CORAL+'" stroke-width="7"/></g>';
  s+='<g class="ap"'+A(3.8)+'>'+(()=>{let d='';for(let i=0;i<14;i++){const g=i/14*Math.PI*2,r1=62,r2=i%2?82:96;d+='<path d="M'+(Rr[0]+Math.cos(g)*r1).toFixed(1)+' '+(Rr[1]+Math.sin(g)*r1).toFixed(1)+' L'+(Rr[0]+Math.cos(g)*r2).toFixed(1)+' '+(Rr[1]+Math.sin(g)*r2).toFixed(1)+'" stroke="'+OURO+'" stroke-width="7" stroke-linecap="round"/>';}return d;})()+circ(Rr[0],Rr[1],48,'#f6d968',T,5)+'</g>';
  const planeta=(r,cor,rd,du,a)=>'<g class="gira" style="--gd:'+du+'s;transform-origin:'+Rr[0]+'px '+Rr[1]+'px;transform-box:view-box"><g class="ap"'+A(a)+'>'+circ(Rr[0]+r,Rr[1],rd,cor,T,4)+'</g></g>';
  s+=planeta(110,'#b9b2a2',14,18,4.3)+planeta(190,'#5b9bd0',20,30,4.6)+planeta(270,'#c9573a',17,50,4.9);
  s+='<g class="ap"'+A(5.6)+'>'+circ(Rr[0]+440,Rr[1],18,'#9a8f78',T,4)+'</g>';
  s+=etiq(1990,860,360,100,'órbita elíptica',50,6.2,-2);
  s+=seta('M2150 860 C2200 800 2230 740 2236 690',2236,690,-80,6.6,CORAL,6,.8);
  s+=tx(1800,1040,'os planetas giram em volta do Sol',46,600,'middle','#3a362d');
  s+=pth('M1200 220 V1060','none',T,4,' stroke-dasharray="18 14" stroke-opacity=".4"');
  return papel(p,s,[W,H]);
};

/* ---------- telescópio, Lua e luas de Júpiter ---------- */
C.tipos.telescopio=p=>{
  const W=1100,H=860;let s='';
  // Lua
  s+='<g class="ap"'+A(.3)+'>'+circ(840,200,130,'#efe9d6',T,5)+circ(800,160,26,'#d8d1bb',T,3)+circ(880,230,34,'#d8d1bb',T,3)+circ(830,260,16,'#d8d1bb',T,3)+circ(900,140,14,'#d8d1bb',T,3)+'</g>';
  s+=tx(840,380,'Lua',60,700,'middle',T);
  // linha de visada tracejada
  s+=pth('M470 500 L700 280','none',CORAL,6,' stroke-dasharray="16 12" class="ap"'+A(1.4));
  // telescópio
  s+='<g class="cai"'+A(.6)+'><g transform="translate(300 600) rotate(-42)"><g '+sh()+'>'+rect(-40,-420,0,0)+
    pth('M-30 -20 L-24 -300 L24 -300 L30 -20Z','#c9a36a',T,5)+rect(-34,-330,68,60,'#8a5a33',T,5)+rect(-46,-380,92,56,'#b98a2a',T,5)+circ(0,-380,40,'rgba(180,220,230,.6)',T,4)+rect(-26,-20,52,28,'#8a5a33',T,5)+'</g></g>'+
    pth('M300 600 L170 820 M300 600 L430 820 M300 600 L300 800','none',T,9)+'</g>';
  // Júpiter e quatro luas
  s+='<g class="ap"'+A(2.4)+'>'+circ(900,630,80,'#e4c9a0',T,5)+pth('M830 600 H970 M824 640 H976 M836 676 H964','none','#b9855a',9,' stroke-opacity=".8"')+
    [[760,630],[790,560],[1010,600],[1040,680]].map(q=>circ(q[0],q[1],11,'#fff',T,3)).join('')+'</g>';
  s+=tx(900,780,'Júpiter e suas luas',46,700,'middle',T);
  return papel(p,s,[W,H]);
};
})();
