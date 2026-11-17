/* Colagem explicativa da História: motor movido a dados.
   Cada tópico é só um arquivo de dados que chama Colagem.montar({...}).
   Formato documentado em docs/historia/MOTOR.md. Sem dependências; abre por file://. */
(function(){
'use strict';
const C = window.Colagem = window.Colagem || {};
const NS = 'http://www.w3.org/2000/svg';
const reduz = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
C.reduz = reduz;

/* ---------- utilidades ---------- */
function hash(s){let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){let a=hash(seed);return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fx=n=>(+n).toFixed(1);
const fp=p=>fx(p[0])+' '+fx(p[1]);
C.hash=hash;C.rng=rng;C.esc=esc;

/* texto do aluno: parágrafos separados por linha em branco (ou array), ==palavra== vira marca-texto, **x** vira negrito */
function marcar(txt,k0){
  const ps=Array.isArray(txt)?txt:String(txt||'').split(/\n\s*\n/);let k=k0||0;
  return ps.filter(p=>p.trim()).map(p=>'<p>'+esc(p.trim())
    .replace(/==(.+?)==/g,(_,w)=>'<mark style="--md:'+(0.35+0.6*(k++)).toFixed(2)+'s">'+w+'</mark>')
    .replace(/\*\*(.+?)\*\*/g,'<b>$1</b>')+'</p>').join('');
}
C.marcar=marcar;

/* Catmull-Rom: suaviza uma polilinha de pontos [[x,y],...] em curvas de Bézier */
C.suave=function(pts,fechado){
  const n=pts.length;if(n<2)return '';
  if(n<3)return 'M'+fp(pts[0])+' L'+fp(pts[1])+(fechado?'Z':'');
  const P=i=>fechado?pts[(i+n)%n]:pts[Math.max(0,Math.min(n-1,i))];
  let d='M'+fp(pts[0]);const fim=fechado?n:n-1;
  for(let i=0;i<fim;i++){
    const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2);
    const c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6];
    const c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];
    d+=' C'+fp(c1)+' '+fp(c2)+' '+fp(p2);
  }
  return d+(fechado?' Z':'');
};
C.linha=(pts,fechado)=>'M'+pts.map(fp).join(' L')+(fechado?' Z':'');

/* ---------- bases de mapa e conversão de longitude e latitude ----------
   Calibragem medida nas próprias imagens (17/11/2026):
   mundo: equirretangular, ajuste por 7 pontos (Gibraltar, cabo Agulhas, cabo Horn, cabo Guardafui,
          cabo Comorim, foz do Mississippi, sul da Tasmânia); erro de até cerca de 6 px.
   medit: afim por 5 pontos (Gibraltar, Bósforo, Dardanelos, vértice do delta do Nilo, foz do Chatt al-Arab);
          a base foi desenhada à mão, então o erro chega a cerca de 13 px na vertical. */
C.proj={
  mundo:(lon,lat)=>[657.03+3.961*lon,437.78-4.401*lat],
  medit:(lon,lat)=>[237.83+19.595*lon-0.411*lat,1234.47+0.1721*lon-24.251*lat]
};
C.BASES={
  'historia-egito-mapa':{w:1152,h:928},
  'historia-mapa-mediterraneo':{w:1376,h:768,proj:'medit'},
  'historia-mapa-mundo':{w:1376,h:768,proj:'mundo'}
};
C.lonlat=(base,lon,lat)=>{const b=C.BASES[base]||{},f=C.proj[b.proj||base];if(!f)throw new Error('Base sem projeção: '+base);return f(lon,lat);};

/* borda de papel rasgado (clip-path), determinística por id */
function rasgo(id,amp){
  const r=rng('rasgo'+id),a=amp||1.5,v=()=>(r()*a).toFixed(1),pts=[],n=26;
  for(let i=0;i<=n;i++)pts.push((i/n*100).toFixed(1)+'% '+v()+'%');
  for(let i=0;i<=n;i++)pts.push((100-v())+'% '+(i/n*100).toFixed(1)+'%');
  for(let i=n;i>=0;i--)pts.push((i/n*100).toFixed(1)+'% '+(100-v())+'%');
  for(let i=n;i>=0;i--)pts.push(v()+'% '+(i/n*100).toFixed(1)+'%');
  return 'polygon('+pts.join(',')+')';
}
C.rasgo=rasgo;

/* ---------- tipos de peça (recortes.js acrescenta ícones e esquemas) ---------- */
C.tipos=C.tipos||{};
const img=k=>(window.LAB_IMG||{})[k]||'';

C.tipos.foto=p=>({cls:'cm-foto'+(p.cor?' cor':''),html:
  '<div class="in rasgado" style="--clip:'+rasgo(p.id,p.rasgo||1.6)+'"><img alt="" src="'+img(p.img)+'"'+
  (p.zoom?' style="transform:scale('+p.zoom+');transform-origin:'+(p.foco||'50% 50%')+'"':(p.foco?' style="object-position:'+p.foco+'"':''))+'></div>'+
  (p.fita===false?'':'<span class="cm-fita" style="--fx:'+(p.fita&&p.fita.x!=null?p.fita.x:40)+'%;--fg:'+(p.fita&&p.fita.g!=null?p.fita.g:-4)+'deg"></span>')+
  (p.legenda?'<span class="cm-legenda">'+esc(p.legenda)+'</span>':'')});

C.tipos.retrato=p=>({cls:'cm-retrato',html:'<img alt="" src="'+img(p.img)+'" style="transform:scale('+(p.zoom||1)+');transform-origin:'+(p.foco||'50% 50%')+'">'});

C.tipos.fonte=p=>({cls:'cm-fonte rasgado',style:'--clip:'+rasgo(p.id,1.2),html:
  '<span class="tag">Fonte histórica</span><blockquote>'+esc(p.texto)+'</blockquote><cite>'+esc(p.ref)+'</cite>'+
  '<span class="perg">'+esc(p.pergunta||'O que essa fonte mostra?')+'</span>'});

C.tipos.tempo=p=>({cls:'cm-tempo rasgado',style:'--clip:'+rasgo(p.id,5),html:'<span class="eixo"></span>'+
  (p.marcos||[]).map((m,i)=>'<span class="marco" data-m="'+i+'" style="left:'+m.p+'%'+(m.cor?';--cor:'+cor(m.cor):'')+'"><i></i><b>'+esc(m.t)+'</b></span>').join('')});

C.tipos.nota=p=>({cls:'cm-nota',html:esc(p.texto)});

C.tipos.mapa=p=>({cls:'cm-mapa rasgado',style:'--clip:'+rasgo(p.id,p.rasgo||1.2),html:svgMapa(p)});

const CORES={amarelo:'var(--amarelo)',coral:'var(--coral)','coral-esc':'var(--coral-esc)',seta:'var(--seta)',petroleo:'var(--petroleo)',tinta:'var(--tinta)',rio:'var(--rio)',branco:'#fff'};
function cor(c){return CORES[c]||c||'var(--amarelo)';}
C.cor=cor;

/* ---------- mapa: base por chave em LAB_IMG + camadas SVG por etapa ---------- */
function svgMapa(p){
  const b=C.BASES[p.base]||{};const W=p.vb?p.vb[0]:b.w,H=p.vb?p.vb[1]:b.h;
  const pj=C.proj[p.proj||b.proj];const u='m-'+p.id;
  p._W=W;p._H=H;
  const P=(L,pt)=>L.ll?(pj?pj(pt[0],pt[1]):pt):pt;
  let defs='<filter id="'+u+'-r" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="3" seed="'+(hash(p.id)%97)+'"/><feDisplacementMap in="SourceGraphic" scale="14"/></filter>'+
    '<filter id="'+u+'-s" x="-10%" y="-20%" width="130%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".3"/></filter>'+
    '<filter id="'+u+'-b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>'+
    '<pattern id="'+u+'-l" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="22" height="22" fill="#f8e7a0" fill-opacity=".9"/><rect width="10" height="22" fill="#f2c230"/></pattern>';
  let corpo='';
  (p.camadas||[]).forEach((L,i)=>{
    const id=u+'-c'+i;let cls='cl',h='';
    const pts=(L.pts||[]).map(q=>P(L,q));const pt=L.p?P(L,L.p):null;
    const d=L.d||(pts.length?(L.suave===false?C.linha(pts,L.tipo==='regiao'):C.suave(pts,L.tipo==='regiao')):'');
    const tam=L.tam||1;
    if(L.tipo==='regiao'){
      cls+=' reg'+(L.mistura===false?' normal':'');
      if(L.corte)defs+='<clipPath id="'+id+'-k"><rect x="'+L.corte[0]+'" y="'+L.corte[1]+'" width="'+L.corte[2]+'" height="'+L.corte[3]+'"/></clipPath>';
      const listra=L.estilo==='listra';
      h='<g filter="url(#'+u+'-r)"'+(L.corte?' clip-path="url(#'+id+'-k)"':'')+'><path d="'+d+'" fill="'+(listra?'url(#'+u+'-l)':cor(L.cor||'coral'))+'" fill-opacity="'+(L.opac||(listra?.9:.78))+'"'+(listra?' stroke="var(--coral-esc)" stroke-width="6"':'')+'/></g>';
    }else if(L.tipo==='corredor'){
      cls+=' reg';
      if(L.corte)defs+='<clipPath id="'+id+'-k"><rect x="'+L.corte[0]+'" y="'+L.corte[1]+'" width="'+L.corte[2]+'" height="'+L.corte[3]+'"/></clipPath>';
      h='<g filter="url(#'+u+'-r)"'+(L.corte?' clip-path="url(#'+id+'-k)"':'')+'><path d="'+d+'" fill="none" stroke="'+cor(L.cor||'coral')+'" stroke-opacity="'+(L.opac||.78)+'" stroke-width="'+(L.largura||100)+'" stroke-linecap="round" stroke-linejoin="round"/></g>';
    }else if(L.tipo==='rota'){
      const est=L.estilo||'rota',dur=(L.dur||(est==='rio'?2:1.8))+'s';
      const sc=L.cor?cor(L.cor):(est==='rio'?'var(--rio)':est==='fronteira'?'var(--coral-esc)':'var(--amarelo)');
      const lw=L.largura||(est==='rio'?5:est==='fronteira'?4:7);
      const tracej=L.tracejada!=null?L.tracejada:(est!=='rio');
      h+='<path id="'+id+'-t" d="'+d+'" fill="none" stroke="none"/>';
      if(L.invisivel){}
      else if(tracej){
        h+='<mask id="'+id+'-m" maskUnits="userSpaceOnUse" x="0" y="0" width="'+W+'" height="'+H+'"><path class="tr desenha" style="--dur:'+dur+'" pathLength="1" d="'+d+'" stroke="#fff" stroke-width="'+(lw+14)+'"/></mask>';
        h+='<g mask="url(#'+id+'-m)">'+(est==='rota'?'<path class="tr" d="'+d+'" stroke="var(--tinta)" stroke-opacity=".55" stroke-width="'+(lw+5)+'" stroke-dasharray="'+(lw*2.6)+' '+(lw*1.6)+'"/>':'')+
          '<path class="tr" d="'+d+'" stroke="'+sc+'" stroke-width="'+lw+'" stroke-dasharray="'+(lw*2.6)+' '+(lw*1.6)+'"/></g>';
      }else{
        h+='<path class="tr desenha" style="--dur:'+dur+'" pathLength="1" d="'+d+'" stroke="'+sc+'" stroke-width="'+lw+'"/>';
      }
      if(L.movel){
        h+=L.movel==='barco'
          ?'<g class="movel" data-trilha="'+id+'-t" data-volta="'+(L.volta||14000)+'"><g class="vira"><g transform="scale('+tam+')"><path d="M-20 0 L20 0 L12 10 L-12 10 Z" fill="#6b3f1d" stroke="#2b1a0c" stroke-width="1.5"/><path d="M-1 0 V-28 L16 -6 Z" fill="#fff8e4" stroke="#6b3f1d" stroke-width="1.8"/></g></g></g>'
          :'<g class="movel" data-trilha="'+id+'-t" data-volta="'+(L.volta||9000)+'"><circle r="'+(9*tam)+'" fill="var(--seta)" stroke="#fff" stroke-width="'+(3*tam)+'"/></g>';
      }
    }else if(L.tipo==='pulso'){
      h='<path class="pulso" style="--lw:'+(L.largura||46)+'px" d="'+d+'" stroke="'+cor(L.cor||'#3d8fd6')+'" stroke-opacity=".55" filter="url(#'+u+'-b)"/>';
    }else if(L.tipo==='cidade'){
      cls+=' cid';const lado=L.lado||'d';
      const marca=L.capital?'<path d="M0 -19 l5.6 12 h13 l-10.5 8 l4 13 l-12.1 -7.6 l-12.1 7.6 l4 -13 l-10.5 -8 h13 z" fill="var(--amarelo)" stroke="var(--tinta)" stroke-width="2.4" stroke-linejoin="round"/>'
        :'<circle r="9" fill="var(--tinta)" stroke="#fff" stroke-width="3"/>';
      const dx=lado==='e'?-26:lado==='c'?0:26,dy=lado==='c'?(L.capital?28:20):-23;
      h='<g transform="translate('+fp(pt)+') scale('+tam+')">'+marca+etiq(L.nome,L.sub,lado,dx,dy,'#fff',u)+'</g>';
    }else if(L.tipo==='etiqueta'){
      cls+=' etq';
      h='<g transform="translate('+fp(pt)+') scale('+tam+')'+(L.giro?' rotate('+L.giro+')':'')+'">'+etiq(L.texto,L.sub,'d',0,0,L.cor==='amarelo'?'var(--amarelo)':cor(L.cor||'branco'),u)+'</g>';
    }else if(L.tipo==='rotulo'){
      cls+=' rot';
      h='<text class="'+(L.classe||'mar')+'" transform="translate('+fp(pt)+') rotate('+(L.giro||0)+') scale('+tam+')" text-anchor="'+(L.ancora||'start')+'">'+esc(L.texto)+'</text>';
    }
    corpo+='<g class="'+cls+'" data-l="'+i+'">'+h+'</g>';
  });
  return '<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true"><defs>'+defs+'</defs>'+
    '<image href="'+img(p.base)+'" width="'+W+'" height="'+H+'" preserveAspectRatio="none"/>'+corpo+'</svg>';
}
/* etiqueta de papel: a largura do retângulo é medida depois (ajustaEtiquetas) */
function etiq(t,s,lado,dx,dy,fundo,u){
  const h=s?74:46;
  return '<g class="lbl" data-lado="'+lado+'" transform="translate('+dx+' '+dy+')"><rect data-auto="1" y="0" width="160" height="'+h+'" fill="'+fundo+'" filter="url(#'+u+'-s)"/>'+
    '<text x="16" y="32" class="t1">'+esc(t)+'</text>'+(s?'<text x="16" y="60" class="t2">'+esc(s)+'</text>':'')+'</g>';
}
function ajustaEtiquetas(raiz){
  raiz.querySelectorAll('.cm-mapa g.lbl').forEach(g=>{
    const r=g.querySelector('rect'),ts=g.querySelectorAll('text');let w=0;
    ts.forEach(t=>{try{w=Math.max(w,t.getComputedTextLength());}catch(e){}});
    if(!w)return;w=Math.ceil(w+32);r.setAttribute('width',w);
    const lado=g.dataset.lado,tr=g.getAttribute('transform').match(/-?[\d.]+/g);
    if(lado==='e')g.setAttribute('transform','translate('+(-26-w)+' '+tr[1]+')');
    if(lado==='c')g.setAttribute('transform','translate('+(-w/2)+' '+tr[1]+')');
  });
}

/* ---------- traços à mão: círculo, seta tracejada e sublinhado ---------- */
function pontoMesa(ref,mapa){
  if(Array.isArray(ref))return ref;
  const p=mapa[ref.peca];if(!p)throw new Error('Peça não encontrada no traço: '+ref.peca);
  const x=p.x+p.w*ref.x/100,y=p.y+(p.h||0)*ref.y/100;
  return gira([x,y],p);
}
function gira(q,p){
  const g=(p.giro||0)*Math.PI/180;if(!g)return q;
  const cx=p.x+p.w/2,cy=p.y+(p.h||0)/2,dx=q[0]-cx,dy=q[1]-cy;
  return [cx+dx*Math.cos(g)-dy*Math.sin(g),cy+dx*Math.sin(g)+dy*Math.cos(g)];
}
function caminhoCirculo(t,mapa,seed){
  const p=mapa[t.peca],r=rng(seed);
  const cx=p.x+p.w*t.x/100,cy=p.y+p.h*t.y/100,rx=p.w*(t.w||20)/200,ry=p.h*(t.h||20)/200;
  const pts=[],n=16,a0=-1.9+r()*.4,volta=1.13;
  for(let i=0;i<=n;i++){
    const a=a0+i/n*Math.PI*2*volta,k=1+(r()-.5)*.08+(i/n)*.05;
    pts.push(gira([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k],p));
  }
  return C.suave(pts,false);
}
function caminhoSeta(t,mapa){
  const a=pontoMesa(t.de,mapa),b=pontoMesa(t.para,mapa);
  const vx=b[0]-a[0],vy=b[1]-a[1],L=Math.hypot(vx,vy)||1,nx=-vy/L,ny=vx/L,k=(t.curva==null?.22:t.curva)*L;
  const c1=[a[0]+vx*.3+nx*k,a[1]+vy*.3+ny*k],c2=[a[0]+vx*.72+nx*k*.6,a[1]+vy*.72+ny*k*.6];
  const ang=Math.atan2(b[1]-c2[1],b[0]-c2[0]),s=t.ponta||22;
  const p1=[b[0]-s*Math.cos(ang-.5),b[1]-s*Math.sin(ang-.5)],p2=[b[0]-s*Math.cos(ang+.5),b[1]-s*Math.sin(ang+.5)];
  return {d:'M'+fp(a)+' C'+fp(c1)+' '+fp(c2)+' '+fp(b),ponta:'M'+fp(p1)+' L'+fp(b)+' L'+fp(p2)};
}
function svgTraco(t,mapa,id,W,H){
  const c=cor(t.cor||(t.tipo==='circulo'?'amarelo':'seta'));
  if(t.tipo==='circulo')return '<path class="d" pathLength="1" d="'+caminhoCirculo(t,mapa,id)+'" stroke="'+c+'" stroke-width="'+(t.espessura||7)+'"/>';
  if(t.tipo==='sublinha'){const a=pontoMesa(t.de,mapa),b=pontoMesa(t.para,mapa),m=[(a[0]+b[0])/2,(a[1]+b[1])/2+5];
    return '<path class="d" pathLength="1" d="'+C.suave([a,m,b])+'" stroke="'+c+'" stroke-width="'+(t.espessura||6)+'"/>';}
  const s=caminhoSeta(t,mapa),w=t.espessura||4;
  return '<mask id="'+id+'-m" maskUnits="userSpaceOnUse" x="-200" y="-200" width="'+(W+400)+'" height="'+(H+400)+'"><path class="d" pathLength="1" d="'+s.d+'" stroke="#fff" stroke-width="'+(w+8)+'"/></mask>'+
    '<path d="'+s.d+'" fill="none" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round" stroke-dasharray="'+(w*3)+' '+(w*2.4)+'" mask="url(#'+id+'-m)"/>'+
    '<path class="ponta" d="'+s.ponta+'" fill="none" stroke="'+c+'" stroke-width="'+(w+1)+'" stroke-linecap="round" stroke-linejoin="round"/>';
}

/* ---------- montagem da página ---------- */
C.montar=function(T){
  const raiz=document.getElementById('colagem')||document.body;
  const W=(T.mesa&&T.mesa.w)||1600,H=(T.mesa&&T.mesa.h)||1000;
  const E=T.etapas||[],PC=T.pecas||[],mapa={};
  PC.forEach(p=>{mapa[p.id]=p;});
  // quando cada peça entra: a primeira etapa que a mostra (mostra) ou só nas etapas que a citam (so)
  PC.forEach(p=>{
    if(p.desde==null){const i=E.findIndex(e=>(e.mostra||[]).includes(p.id));p.desde=i<0?null:i;}
    p.soEm=E.map((e,i)=>(e.so||[]).includes(p.id)?i:-1).filter(i=>i>=0);
    if(p.desde==null&&!p.soEm.length)p.desde=0;
    if(p.ir==null)p.ir=p.desde!=null?p.desde:p.soEm[0];
  });
  const visivel=(p,i)=>(p.desde!=null&&i>=p.desde&&(p.ate==null||i<=p.ate))||p.soEm.includes(i);

  const trilha='<nav class="cm-trilha" aria-label="Você está em"><a href="../index.html">Início do LAB</a><a href="index.html">História</a>'+
    (T.modulo?'<span>'+esc(T.modulo)+'</span>':'')+'</nav>';
  let pecasHtml=(T.jornal||[]).map(j=>'<span class="cm-jornal" aria-hidden="true" style="left:'+j[0]+'px;top:'+j[1]+'px;width:'+j[2]+'px;height:'+j[3]+'px;--g:'+(j[4]||0)+'deg"></span>').join('');
  PC.forEach(p=>{
    const f=C.tipos[p.tipo];if(!f)throw new Error('Tipo de peça desconhecido: '+p.tipo);
    const r=f(p,T),clic=p.ir!=null&&p.clicavel!==false&&p.tipo!=='nota'&&p.tipo!=='tempo';
    const st='left:'+p.x+'px;top:'+p.y+'px;width:'+p.w+'px;'+(p.h?'height:'+p.h+'px;':'')+'--g:'+(p.giro||0)+'deg;'+(r.style||'');
    pecasHtml+='<div class="peca '+r.cls+' fora" id="pc-'+esc(p.id)+'" data-id="'+esc(p.id)+'" style="'+st+'"'+
      (clic?' role="button" tabindex="-1" aria-label="'+esc(p.rotulo||p.legenda||p.id)+'. Ir para a etapa '+(p.ir+1)+'"':' aria-hidden="true"')+'>'+r.html+'</div>';
  });
  // traços por etapa
  let tracos='';
  E.forEach((e,i)=>(e.tracos||[]).forEach((t,j)=>{
    const id='tr-'+i+'-'+j,d=t.atraso!=null?t.atraso/1000:(reduz?0:.9+j*.75);
    tracos+='<g data-e="'+i+'" style="--d:'+d.toFixed(2)+'s;--dur:'+(t.tipo==='circulo'?.8:.7)+'s">'+svgTraco(t,mapa,id,W,H)+'</g>';
  }));

  raiz.innerHTML=
    '<a class="cm-pular" href="#cm-painel">Pular para a explicação</a><header class="cm-topo">'+trilha+'<h1><span>'+esc(T.titulo)+'</span></h1>'+(T.subtitulo?'<p>'+esc(T.subtitulo)+'</p>':'')+'</header>'+
    '<main class="cm-main">'+
      '<section class="cm-palco" aria-label="'+esc(T.rotuloPalco||('Colagem animada: '+T.titulo))+'"><div class="cm-mesa" style="width:'+W+'px;height:'+H+'px">'+pecasHtml+
        '<svg class="cm-traco" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" aria-hidden="true">'+tracos+'</svg></div></section>'+
      '<aside class="cm-painel" id="cm-painel" tabindex="-1" aria-label="Explicação">'+
        '<div class="cm-ctrl"><button type="button" id="bAnt" data-a="ant">Anterior</button><button type="button" id="bPlay" data-a="play">Pausar</button><button type="button" id="bProx" data-a="prox">Próxima</button><span class="n" aria-hidden="true"></span></div>'+
        '<div class="cm-barra" aria-hidden="true"><i></i></div>'+
        '<p class="so-leitor" role="status" aria-live="polite"></p>'+
        '<h2 tabindex="-1"></h2><div class="cm-txt"></div><div class="cm-extra"></div>'+
        '<nav aria-label="Etapas do tópico"><ol class="cm-lista">'+E.map((e,i)=>'<li><button type="button" data-i="'+i+'">'+(i+1)+'. '+esc(e.titulo)+'</button></li>').join('')+'</ol></nav>'+
        (T.enem?'<details class="cm-enem"><summary>No ENEM</summary>'+marcar(T.enem,99)+'</details>':'')+
        (T.credito?'<p class="cm-credito">'+esc(T.credito)+'</p>':'')+
      '</aside></main>';

  const $=s=>raiz.querySelector(s),$$=s=>[...raiz.querySelectorAll(s)];
  const palco=$('.cm-palco'),mesa=$('.cm-mesa');
  ajustaEtiquetas(raiz);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>ajustaEtiquetas(raiz));

  let at=-1,fase=0,tocando=!reduz&&T.auto!==false,timer=null,timers=[];
  const mapaVis={};// camadas visíveis na etapa anterior (para atrasar só as novas)

  function focoDe(i){
    const e=E[i],mob=palco.clientWidth<600;let f=(fase&&e.foco2)?((mob&&e.foco2M)||e.foco2):((e.focoM&&mob)?e.focoM:e.foco);
    if(Array.isArray(f)&&typeof f[0]==='number')return f;
    const ids=f?(Array.isArray(f)?f:[f]):[...(e.mostra||[]),...(e.so||[])];
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    ids.forEach(id=>{const p=mapa[id];if(!p)return;const h=p.h||120;x0=Math.min(x0,p.x);y0=Math.min(y0,p.y);x1=Math.max(x1,p.x+p.w);y1=Math.max(y1,p.y+h);});
    if(x0>x1)return [0,0,W,H];
    const m=e.margem!=null?e.margem:40;return [x0-m,y0-m,x1-x0+2*m,y1-y0+2*m];
  }
  function camera(){
    const r=palco.getBoundingClientRect();if(!r.width)return;
    const [x,y,w,h]=focoDe(at);const s=Math.min(r.width/w,r.height/h)*.96;
    mesa.style.transform='translate('+(r.width/2-(x+w/2)*s).toFixed(1)+'px,'+(r.height/2-(y+h/2)*s).toFixed(1)+'px) scale('+s.toFixed(4)+')';
  }
  function visCamada(L,i){return L.etapas?L.etapas.includes(i):(i>=(L.desde||0)&&(L.ate==null||i<=L.ate));}

  function vai(i,origem){
    i=Math.max(0,Math.min(E.length-1,i));if(i===at&&origem!=='init')return;
    const ant=at;at=i;const e=E[at];fase=0;
    timers.forEach(clearTimeout);timers=[];
    if(e.foco2)timers.push(setTimeout(()=>{fase=1;camera();},e.foco2Em||4500));// segunda tomada da câmera na mesma etapa
    mesa.dataset.e=at;
    // peças
    let k=0,nNotas=(e.tracos||[]).length;
    PC.forEach(p=>{
      const el=document.getElementById('pc-'+p.id),v=visivel(p,at),era=!el.classList.contains('fora');
      let d=0;
      if(v&&!era){d=p.atraso!=null?p.atraso/1000:p.tipo==='nota'?(reduz?.2:.9+nNotas*.75):(reduz?0:.2+(k++)*.15);}
      el.style.setProperty('--d',d.toFixed(2)+'s');
      el.classList.toggle('fora',!v);el.classList.toggle('atual',v&&(p.ir===at));
      if(el.getAttribute('role')==='button'){el.tabIndex=v?0:-1;el.setAttribute('aria-hidden',v?'false':'true');}
      // marcos da fita do tempo
      if(p.tipo==='tempo')el.querySelectorAll('.marco').forEach(m=>{const mm=p.marcos[+m.dataset.m];m.classList.toggle('on',mm.etapa===at||(Array.isArray(mm.etapa)&&mm.etapa.includes(at)));});
      // marcas que acendem em certas etapas (data-et="0,3")
      el.querySelectorAll('[data-et]').forEach(m=>m.classList.toggle('on',m.dataset.et.split(',').includes(String(at))));
      // realces dentro de esquemas
      el.querySelectorAll('[data-item]').forEach(it=>it.classList.toggle('realce',(e.realce||[]).some(r=>r.peca===p.id&&(Array.isArray(r.item)?r.item.includes(+it.dataset.item):r.item===+it.dataset.item))));
      // camadas do mapa
      if(p.tipo==='mapa'){
        let n=0;const vis=mapaVis[p.id]||[];
        (p.camadas||[]).forEach((L,li)=>{
          const g=el.querySelector('g.cl[data-l="'+li+'"]'),on=visCamada(L,at),novo=on&&!vis[li];
          const dd=novo?(L.atraso!=null?L.atraso/1000:(reduz?0:.5+(n++)*.45)):0;
          g.style.setProperty('--d',dd.toFixed(2)+'s');g.style.transitionDelay=dd.toFixed(2)+'s';
          g.querySelectorAll('.desenha').forEach(x=>x.style.transitionDelay=dd.toFixed(2)+'s');
          g.classList.toggle('on',on);vis[li]=on;
          const ultima=L.etapas?!L.etapas.includes(at+1):(L.ate===at);
          if(on&&L.dura&&ultima)timers.push(setTimeout(()=>{g.style.transitionDelay='0s';g.classList.remove('on');vis[li]=false;},dd*1000+L.dura));
        });
        mapaVis[p.id]=vis;
      }
    });
    // traços
    $$('.cm-traco g[data-e]').forEach(g=>g.classList.toggle('on',+g.dataset.e===at));
    camera();
    // painel
    $('h2').textContent=e.titulo;
    $('.cm-txt').innerHTML=marcar(e.texto);
    const ex=$('.cm-extra');ex.innerHTML='';
    if(e.fonte&&mapa[e.fonte]){
      const f=mapa[e.fonte],rid='resp-'+at;
      ex.innerHTML='<button type="button" class="cm-revelar" aria-expanded="false" aria-controls="'+rid+'">Ver o que essa fonte mostra</button><div class="cm-resp" id="'+rid+'" hidden>'+marcar(f.resposta)+'</div>';
      const b=ex.querySelector('button');b.onclick=()=>{const r=document.getElementById(rid),ab=r.hidden;r.hidden=!ab;b.setAttribute('aria-expanded',ab);b.textContent=ab?'Esconder a resposta':'Ver o que essa fonte mostra';};
    }
    $('.cm-ctrl .n').textContent='Etapa '+(at+1)+' de '+E.length;
    $('.so-leitor').textContent='Etapa '+(at+1)+' de '+E.length+': '+e.titulo;
    $('.cm-barra i').style.width=((at+1)/E.length*100)+'%';
    $('[data-a=ant]').disabled=at===0;$('[data-a=prox]').disabled=at===E.length-1;
    $$('.cm-lista button').forEach((b,j)=>{if(j===at)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    agenda();
  }
  function agenda(){
    clearTimeout(timer);
    if(tocando&&at<E.length-1)timer=setTimeout(()=>vai(at+1),E[at].tempo||T.ritmo||9000);
    if(at===E.length-1&&tocando){tocando=false;botao();}
  }
  function botao(){const b=$('[data-a=play]');b.textContent=tocando?'Pausar':'Continuar';b.setAttribute('aria-label',tocando?'Pausar a viagem automática':'Continuar a viagem automática');}
  function pausa(){if(tocando){tocando=false;botao();clearTimeout(timer);}}

  $('[data-a=ant]').onclick=()=>{pausa();vai(at-1);};
  $('[data-a=prox]').onclick=()=>{pausa();vai(at+1);};
  $('[data-a=play]').onclick=()=>{tocando=!tocando;if(tocando&&at===E.length-1)vai(0);botao();agenda();};
  $$('.cm-lista button').forEach(b=>b.onclick=()=>{pausa();vai(+b.dataset.i);});
  $$('.peca[role=button]').forEach(el=>{
    const go=()=>{pausa();vai(mapa[el.dataset.id].ir);};
    el.addEventListener('click',go);
    el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();go();}});
  });
  document.addEventListener('keydown',ev=>{
    if(ev.altKey||ev.ctrlKey||ev.metaKey)return;
    const t=ev.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;
    if(ev.key==='ArrowRight'){pausa();vai(at+1);}
    else if(ev.key==='ArrowLeft'){pausa();vai(at-1);}
    else if(ev.key==='Home'&&!t.closest('.cm-painel')){pausa();vai(0);}
    else if(ev.key==='End'&&!t.closest('.cm-painel')){pausa();vai(E.length-1);}
  });
  addEventListener('resize',camera);
  if(window.ResizeObserver)new ResizeObserver(camera).observe(palco);

  // objetos que viajam pelas rotas (barco ou ponto)
  const moveis=$$('.cm-mapa .movel').map(m=>({m,tr:document.getElementById(m.dataset.trilha),volta:+m.dataset.volta,vira:m.querySelector('.vira')}));
  if(moveis.length&&!reduz){
    let t0=0;
    const anda=ts=>{if(!t0)t0=ts;
      moveis.forEach(o=>{if(!o.m.closest('.cl.on'))return;const L=o.tr.getTotalLength(),q=((ts-t0)/o.volta)%1;
        const a=o.tr.getPointAtLength(L*q),b=o.tr.getPointAtLength(Math.min(L,L*q+2));
        o.m.setAttribute('transform','translate('+fx(a.x)+' '+fx(a.y)+')');
        if(o.vira)o.vira.setAttribute('transform',b.x<a.x-.05?'scale(-1 1)':'');});
      requestAnimationFrame(anda);};
    requestAnimationFrame(anda);
  }
  botao();vai(0,'init');
  C.atual={vai,etapa:()=>at,total:E.length};
};
})();
