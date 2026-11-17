/* Recortes desenhados em código para a colagem da História: ilustrações SVG em traço de gravura,
   P&B com hachura e um destaque em cor, coladas como recorte de papel (margem branca e sombra).
   Também os esquemas: pirâmide social, comparação lado a lado e tabela recortada.
   Uso como peça: {tipo:'icone', nome:'zigurate', legenda:'Zigurate de Ur'}.  Lista: Colagem.ICONES. */
(function(){
'use strict';
const C=window.Colagem;if(!C)throw new Error('Carregue colagem.js antes de recortes.js');
const T='#1b1a17',P='#f6f1e4',esc=C.esc;
let seq=0;

/* padrões de hachura, filtros e regras da silhueta, uma vez por página */
function defs(){
  if(document.getElementById('cm-defs'))return;
  const d=document.createElement('div');d.className='cm-defs';d.setAttribute('aria-hidden','true');
  d.innerHTML='<svg id="cm-defs" width="0" height="0"><defs>'+
    '<pattern id="cm-h1" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><path d="M0 3H6" stroke="'+T+'" stroke-width="1" stroke-opacity=".8"/></pattern>'+
    '<pattern id="cm-h3" width="3.6" height="3.6" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><path d="M0 1.8H4" stroke="'+T+'" stroke-width="1.1"/></pattern>'+
    '<pattern id="cm-h2" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><path d="M0 2.5H5M2.5 0V5" stroke="'+T+'" stroke-width="1"/></pattern>'+
    '<pattern id="cm-hh" width="8" height="5" patternUnits="userSpaceOnUse"><path d="M0 2.5H8" stroke="'+T+'" stroke-width=".8" stroke-opacity=".55"/></pattern>'+
    '<pattern id="cm-hv" width="5" height="8" patternUnits="userSpaceOnUse"><path d="M2.5 0V8" stroke="'+T+'" stroke-width=".8" stroke-opacity=".6"/></pattern>'+
    '<filter id="cm-sombra" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-opacity=".28"/></filter>'+
    '<filter id="cm-rasga" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter>'+
    '</defs></svg>';
  document.body.appendChild(d);
}
if(document.body)defs();else document.addEventListener('DOMContentLoaded',defs);

/* helpers de desenho */
const pth=(d,f,s,w,x)=>'<path d="'+d+'" fill="'+(f||'none')+'"'+(s?' stroke="'+s+'" stroke-width="'+(w||3)+'"':'')+' stroke-linecap="round" stroke-linejoin="round"'+(x||'')+'/>';
const tinta=(d,w)=>pth(d,'none',T,w||2);
function clip(id,d){return '<clipPath id="'+id+'"><path d="'+d+'"/></clipPath>';}
function sombra(id,d,quem,pad){return '<g clip-path="url(#'+id+')"><path d="'+quem+'" fill="url(#'+(pad||'cm-h1')+')"/></g>';}
function espiral(cx,cy,r0,voltas,dir){
  const pts=[],n=Math.round(voltas*24);
  for(let i=0;i<=n;i++){const a=i/24*Math.PI*2*(dir||1),r=r0*(1-i/n*.86);pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}
  return C.suave(pts);
}
function bezPt(p0,p1,p2,p3,t){const u=1-t;return [u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]];}

/* ---------- as ilustrações (viewBox 0 0 200 200) ---------- */
const I={};

I['pedra-lascada']={fundo:'amarelo',nome:'Pedra lascada',art(u){
  const out='M100 12 C116 30 142 74 149 112 C156 152 136 185 100 189 C64 185 44 152 51 112 C58 74 84 30 100 12 Z';
  const r=C.rng('lasca');
  const esq=[[86,22],[70,48],[56,76],[46,104],[40,132],[44,160],[58,182],[84,198]];
  let cic='';
  // lascas: círculos centrados fora da borda; os arcos que se cruzam formam as facetas em concha
  const ordem=[];esq.forEach((q,i)=>{ordem.push([q[0]-4,q[1],0,i]);ordem.push([200-q[0]+4,q[1]+6,1,i]);});
  ordem.forEach(([x,y,lado])=>{
    const R=30+r()*9;
    cic+='<circle cx="'+x+'" cy="'+y+'" r="'+R.toFixed(1)+'" fill="'+(lado?'url(#cm-h1)':P)+'"/>'+
      '<circle cx="'+x+'" cy="'+y+'" r="'+(R*.62).toFixed(1)+'" fill="none" stroke="'+T+'" stroke-width=".8" stroke-opacity=".45"/>'+
      '<circle cx="'+x+'" cy="'+y+'" r="'+(R*.8).toFixed(1)+'" fill="none" stroke="'+T+'" stroke-width=".8" stroke-opacity=".35"/>'+
      '<circle cx="'+x+'" cy="'+y+'" r="'+R.toFixed(1)+'" fill="none" stroke="'+T+'" stroke-width="1.9"/>';
  });
  return '<defs>'+clip(u+'o',out)+'</defs>'+pth(out,P)+'<g clip-path="url(#'+u+'o)"><path d="M100 0 L104 60 L98 120 L102 200 H200 V0Z" fill="url(#cm-h1)" opacity=".5"/>'+cic+'</g>'+
    pth(out,'none',T,3.2);
}};

I['pedra-polida']={fundo:'amarelo',nome:'Pedra polida',art(u){
  const haste='M44 190 C56 150 84 96 112 30 L128 36 C102 100 76 154 62 194 Z';
  const lam='M82 62 C108 56 138 44 166 34 C182 50 186 82 174 100 C146 90 112 82 84 80 Z';
  return '<defs>'+clip(u+'h',haste)+clip(u+'l',lam)+'</defs>'+
    pth(haste,'#efe4cf',T,3)+'<g clip-path="url(#'+u+'h)"><path d="M30 0H200V200H30Z" fill="url(#cm-hh)" transform="rotate(-22 90 110)"/>'+
      tinta('M60 186 C72 150 96 100 120 40',1.2)+'<path d="M64 196 C76 156 100 100 126 36 L140 40 L80 200Z" fill="url(#cm-h1)"/></g>'+pth(haste,'none',T,3)+
    pth(lam,'var(--petroleo)',T,3)+
    '<g clip-path="url(#'+u+'l)"><path d="M80 80 C120 86 150 92 178 104 L178 120 L80 120Z" fill="url(#cm-h3)" opacity=".75"/><path d="M80 72 C112 74 146 80 178 92 L178 104 C146 92 112 84 80 80Z" fill="url(#cm-h1)" opacity=".8"/></g>'+
    pth('M98 60 C120 54 142 46 162 40','none','#fff',3.2,' stroke-opacity=".75"')+pth('M168 42 C176 56 178 74 172 88','none','#fff',2,' stroke-opacity=".6"')+
    pth(lam,'none',T,3)+
    '<g stroke="'+T+'" stroke-width="2.2" fill="'+P+'">'+[0,1,2,3].map(i=>'<path d="M'+(88+i*4)+' '+(52-i*3)+' L'+(118+i*3)+' '+(92-i*2)+'" />').join('')+
    [0,1,2].map(i=>'<path d="M'+(118+i*3)+' '+(50-i*3)+' L'+(90+i*4)+' '+(94-i*3)+'"/>').join('')+'</g>';
}};

I['fogo']={fundo:'petroleo',nome:'Fogo',art(u){
  const ch='M100 14 C110 42 136 56 142 88 C148 118 134 146 100 152 C66 146 52 120 58 94 C62 74 78 68 80 48 C92 62 90 76 96 84 C104 66 92 40 100 14 Z';
  const mi='M100 66 C110 86 126 98 124 120 C122 138 112 146 100 148 C88 146 76 138 76 120 C76 104 92 96 100 66 Z';
  const tora=(g)=>'<g transform="rotate('+g+' 100 166)"><rect x="26" y="154" width="148" height="26" rx="5" fill="'+P+'"/><rect x="26" y="154" width="148" height="26" rx="5" fill="url(#cm-hh)"/>'+
    '<path d="M30 172 H170" stroke="'+T+'" stroke-width="1" opacity=".6"/><rect x="26" y="154" width="148" height="26" rx="5" fill="none" stroke="'+T+'" stroke-width="3"/>'+
    '<ellipse cx="174" cy="167" rx="8" ry="13" fill="#efe4cf" stroke="'+T+'" stroke-width="2.6"/><ellipse cx="174" cy="167" rx="4" ry="7" fill="none" stroke="'+T+'" stroke-width="1.2"/></g>';
  return '<defs>'+clip(u+'c',ch)+'</defs>'+tora(-11)+tora(191)+
    pth(ch,'var(--coral)',T,3)+'<g clip-path="url(#'+u+'c)"><path d="M104 0 H200 V200 H118 C138 140 132 80 104 0Z" fill="url(#cm-h1)"/></g>'+
    pth(mi,'var(--amarelo)',T,2.4)+
    tinta('M124 92 C132 108 130 126 120 138',1.8)+tinta('M72 104 C70 118 74 130 84 140',1.8)+tinta('M100 92 C96 108 104 122 100 140',1.4)+
    ['M136 34 l4 8 l-4 8 l-4 -8z','M66 40 l3 6 l-3 6 l-3 -6z','M150 64 l3 5 l-3 5 l-3 -5z'].map(d=>pth(d,T)).join('');
}};

I['espiga-foice']={fundo:'coral',nome:'Espiga e foice',art(u){
  let s='';const haste=[[84,196],[86,150],[84,100],[78,34]];
  s+=tinta(C.suave(haste),3);
  s+=pth('M85 150 C100 126 126 110 150 104 C130 120 108 136 86 160 Z','#efe4cf',T,2.4)+tinta('M88 152 C106 134 124 120 146 106',1);
  for(let i=0;i<7;i++){
    const y=44+i*12,x=80+i*.9,lado=i%2?1:-1;
    [-1,1].forEach(sd=>{
      const gx=x+sd*10,gy=y+(sd===lado?0:6),ang=sd*24;
      s+='<g transform="translate('+gx+' '+gy+') rotate('+ang+')"><ellipse rx="7.5" ry="13" fill="var(--amarelo)" stroke="'+T+'" stroke-width="2"/><path d="M0 -11 V11" stroke="'+T+'" stroke-width="1"/><path d="M2 -8 C5 -2 5 4 2 10" fill="none" stroke="'+T+'" stroke-width=".9" opacity=".7"/>'+
        '<path d="M0 -13 L'+(sd*4)+' -44" stroke="'+T+'" stroke-width="1.1"/></g>';
    });
  }
  s+='<g transform="translate(78 26)"><ellipse rx="6" ry="11" fill="var(--amarelo)" stroke="'+T+'" stroke-width="2"/><path d="M0 -11 L0 -38" stroke="'+T+'" stroke-width="1.1"/></g>';
  // foice
  const o=[[146,150],[196,118],[192,46],[124,30]],ii=[[124,30],[168,52],[172,110],[140,142]];
  const lam='M'+o[0]+' C'+o[1]+' '+o[2]+' '+o[3]+' C'+ii[1]+' '+ii[2]+' '+ii[3]+' Z';
  let dentes='M'+ii[0];for(let k=1;k<=26;k++){const a=bezPt(ii[0],ii[1],ii[2],ii[3],k/26),b=bezPt(ii[0],ii[1],ii[2],ii[3],(k-.5)/26);dentes+=' L'+(b[0]-3).toFixed(1)+' '+(b[1]+1).toFixed(1)+' L'+a[0].toFixed(1)+' '+a[1].toFixed(1);}
  s+='<defs>'+clip(u+'f',lam)+'</defs>'+pth(lam,'#e9e6df',T,3)+'<g clip-path="url(#'+u+'f)"><path d="M170 0H210V200H150C186 130 186 70 170 0Z" fill="url(#cm-h1)"/><path d="M180 0H210V200H170C196 130 196 70 180 0Z" fill="url(#cm-h3)"/></g>'+
    pth('M132 36 C176 52 182 112 150 144','none','#fff',2,' stroke-opacity=".8"')+tinta(dentes,1.2)+pth(lam,'none',T,3);
  s+='<g transform="rotate(14 150 172)"><rect x="141" y="144" width="18" height="54" rx="6" fill="#efe4cf" stroke="'+T+'" stroke-width="3"/><rect x="141" y="144" width="18" height="54" rx="6" fill="url(#cm-hv)"/><rect x="139" y="146" width="22" height="9" rx="2" fill="'+T+'"/></g>';
  return s;
}};

I['tabua']={fundo:'coral',nome:'Tábua cuneiforme',art(u){
  const r=C.rng('tabua');
  const face='M38 26 C70 20 130 20 164 28 C172 70 172 130 164 176 C130 184 70 184 36 176 C28 130 28 70 38 26 Z';
  let s='<g transform="rotate(-6 100 100)"><path d="'+face+'" transform="translate(9 8)" fill="'+T+'"/><path d="'+face+'" transform="translate(9 8)" fill="url(#cm-h2)" stroke="'+T+'" stroke-width="3"/>'+
    '<defs>'+clip(u+'t',face)+'</defs>'+pth(face,'#ede3cc',T,3)+'<g clip-path="url(#'+u+'t)">'+
    '<rect x="40" y="88" width="122" height="20" fill="var(--amarelo)" opacity=".85" transform="rotate(-.5 100 98)"/>';
  for(let l=0;l<7;l++){
    const y=46+l*20;s+='<path d="M40 '+(y+11)+' H164" stroke="'+T+'" stroke-width=".9" opacity=".5"/>';
    let x=46+r()*6;
    while(x<154){
      const n=1+Math.floor(r()*3);
      for(let w=0;w<n;w++){
        const tipo=r(),gx=x+w*5;
        if(tipo<.55)s+='<path d="M'+gx+' '+(y-6)+' l5 0 l-2.5 5 z M'+(gx+2.5)+' '+(y-1)+' v10" fill="'+T+'" stroke="'+T+'" stroke-width="1.3"/>';
        else if(tipo<.8)s+='<path d="M'+gx+' '+(y-1)+' l0 5 l5 -2.5 z M'+(gx+5)+' '+(y+1.5)+' h7" fill="'+T+'" stroke="'+T+'" stroke-width="1.3"/>';
        else s+='<path d="M'+(gx+6)+' '+(y-4)+' l-6 3 l6 3 z" fill="'+T+'" stroke="'+T+'" stroke-width="1"/>';
      }
      x+=n*5+7+r()*6;
    }
  }
  s+='<path d="M150 18 L176 18 L176 60 L166 52 L160 40 L150 36 Z" fill="'+P+'"/></g>'+
    pth('M146 26 C150 34 158 38 164 52 L170 58','none',T,2.6)+pth('M146 26 L150 34 L162 42 L170 58 L178 40 Z','url(#cm-h1)')+
    tinta('M38 140 L52 146 L58 160 L72 168',1.4)+pth(face,'none',T,3)+'</g>';
  return s;
}};

I['zigurate']={fundo:'amarelo',nome:'Zigurate',art(u){
  const nv=[[18,182,182,170,166,128,34,128],[48,128,152,128,142,92,58,92],[72,92,128,92,120,64,80,64]];
  let s=pth('M6 184 H194','none',T,3)+pth('M10 184 H190 V192 H10Z','url(#cm-h1)');
  nv.forEach((n,i)=>{
    const d='M'+n[0]+' '+(i?n[1]:170)+' L'+n[2]+' '+(i?n[3]:170)+' L'+n[4]+' '+n[5]+' L'+n[6]+' '+n[7]+' Z';
    const id=u+'n'+i;s+='<defs>'+clip(id,d)+'</defs>'+pth(d,'#efe4cf')+
      '<g clip-path="url(#'+id+')"><rect x="0" y="0" width="200" height="200" fill="url(#cm-hh)"/><path d="M'+(n[2]-26)+' 0 H200 V200 H'+(n[2]-30)+'Z" fill="url(#cm-h1)"/>'+
      '<path d="M'+(n[2]-26)+' 0 V200" stroke="'+T+'" stroke-width="1.6"/></g>'+pth(d,'none',T,3);
  });
  // escadarias
  const esc1='M88 170 L112 170 L106 128 L94 128 Z',esc2='M94 128 L106 128 L104 92 L96 92 Z';
  [esc1,esc2].forEach((d,i)=>{s+=pth(d,P,T,2.4);const y0=i?128:170,y1=i?92:128;for(let y=y0-4;y>y1;y-=4)s+=tinta('M'+(100-(i?6:12)+(y0-y)*(i?.05:.15))+' '+y+' H'+(100+(i?6:12)-(y0-y)*(i?.05:.15)),.9);});
  // santuário
  s+=pth('M84 64 V40 H116 V64 Z','var(--petroleo)',T,3)+pth('M80 40 H120 L116 32 H84 Z','#efe4cf',T,2.6)+pth('M96 64 V50 C96 44 104 44 104 50 V64Z',T)+
    pth('M108 40 V64 H116 V40Z','url(#cm-h1)');
  return s;
}};

I['coluna']={fundo:'petroleo',nome:'Coluna grega',art(u){
  let s=pth('M34 176 H166 V190 H34Z','#efe4cf',T,3)+pth('M44 166 H156 V176 H44Z','#efe4cf',T,2.6)+pth('M142 166 H156 V176 H142ZM150 176 H166 V190 H150Z','url(#cm-h1)');
  s+=pth('M56 166 C52 160 56 154 62 154 H138 C144 154 148 160 144 166 Z','#efe4cf',T,2.6);
  const fuste='M66 154 L70 64 H130 L134 154 Z';
  s+='<defs>'+clip(u+'f',fuste)+'</defs>'+pth(fuste,P)+'<g clip-path="url(#'+u+'f)"><path d="M112 0 H200 V200 H114Z" fill="url(#cm-h1)"/><path d="M124 0 H200 V200 H126Z" fill="url(#cm-h3)"/>';
  for(let i=1;i<8;i++){const xt=70+i*7.5,xb=66+i*8.5;s+=tinta('M'+xb+' 154 L'+xt+' 64',1.3);}
  s+=tinta('M68 120 L90 112 L96 118 L132 104',1.4)+'</g>'+pth(fuste,'none',T,3);
  s+=pth('M64 64 C66 56 134 56 136 64 Z','#efe4cf',T,2.6);
  s+=pth('M44 52 H156 C158 60 150 64 140 60 H60 C50 64 42 60 44 52Z',P,T,2.6);
  s+=tinta(espiral(56,60,13,2.1,1),2)+tinta(espiral(144,60,13,2.1,-1),2);
  s+=pth('M40 38 H160 V48 H40Z','#efe4cf',T,3)+pth('M146 38 H160 V48 H146Z','url(#cm-h1)');
  s+=pth('M30 14 H170 L166 24 L158 20 L150 30 L170 30 V38 H30Z','#efe4cf',T,3)+pth('M30 30 H170','none',T,1.2)+pth('M150 14 H170 V38 H150Z','url(#cm-h1)');
  return s;
}};

I['anfora']={fundo:'amarelo',nome:'Ânfora',art(u){
  const corpo='M86 30 L86 52 C60 60 44 86 46 112 C48 140 70 160 92 172 L96 186 C98 190 102 190 104 186 L108 172 C130 160 152 140 154 112 C156 86 140 60 114 52 L114 30 Z';
  let s='<defs>'+clip(u+'a',corpo)+'</defs>';
  s+=pth('M88 34 C62 34 52 48 62 66','none',T,9)+pth('M88 34 C62 34 52 48 62 66','none','var(--coral)',4);
  s+=pth('M112 34 C138 34 148 48 138 66','none',T,9)+pth('M112 34 C138 34 148 48 138 66','none','var(--coral)',4);
  s+=pth(corpo,'var(--coral)')+'<g clip-path="url(#'+u+'a)">'+
    '<rect x="0" y="66" width="200" height="22" fill="'+T+'"/>';
  let m='M40 82';for(let x=40;x<160;x+=12)m+=' h6 v-10 h-3 v5 h-3 v5 h12';
  s+=pth('M30 70 H170','none','#f3dcc0',1.4)+pth(m,'none','#f3dcc0',1.6)+pth('M30 85 H170','none','#f3dcc0',1.4)+
    '<rect x="0" y="134" width="200" height="6" fill="'+T+'"/>'+
    '<path d="M112 0 C150 60 156 130 104 200 H200 V0Z" fill="url(#cm-h1)"/><path d="M134 0 C166 70 162 140 116 200 H200 V0Z" fill="url(#cm-h3)"/></g>'+
    pth('M64 96 C62 116 70 136 84 150','none','#fff',3,' stroke-opacity=".55"');
  s+=pth(corpo,'none',T,3)+pth('M80 22 H120 V32 H80Z','var(--coral)',T,3)+pth('M86 32 H114','none',T,2);
  return s;
}};

I['moeda']={fundo:'petroleo',nome:'Moeda',art(u){
  const r=C.rng('moeda');const pts=[];for(let i=0;i<14;i++){const a=i/14*Math.PI*2,k=78+(r()-.5)*6;pts.push([100+Math.cos(a)*k,102+Math.sin(a)*k]);}
  const disco=C.suave(pts,true);
  let s='<defs>'+clip(u+'m',disco)+'</defs>'+pth(disco,'#e3bf55',T,3)+'<g clip-path="url(#'+u+'m)"><path d="M120 0 C176 60 170 150 110 210 H210 V0Z" fill="url(#cm-h1)" opacity=".85"/></g>';
  for(let i=0;i<36;i++){const a=i/36*Math.PI*2;s+='<circle cx="'+(100+Math.cos(a)*66).toFixed(1)+'" cy="'+(102+Math.sin(a)*66).toFixed(1)+'" r="1.8" fill="'+T+'"/>';}
  // coruja
  const corpo='M80 74 C80 60 120 60 120 74 C128 92 128 128 116 144 C108 152 92 152 84 144 C72 128 72 92 80 74 Z';
  s+='<defs>'+clip(u+'c',corpo)+'</defs>'+pth(corpo,'#ecd27e',T,2.6)+'<g clip-path="url(#'+u+'c)">';
  for(let y=104;y<150;y+=8)for(let x=78+(y/8%2)*4;x<124;x+=8)s+=tinta('M'+(x-3.5)+' '+y+' Q'+x+' '+(y+5)+' '+(x+3.5)+' '+y,1);
  s+='<path d="M106 60 C126 90 124 130 108 156 H140 V60Z" fill="url(#cm-h1)"/></g>';
  s+=pth('M84 96 C92 112 92 132 86 142','none',T,1.6)+pth('M116 96 C108 112 108 132 114 142','none',T,1.6);
  s+='<circle cx="91" cy="84" r="9" fill="'+P+'" stroke="'+T+'" stroke-width="2.2"/><circle cx="109" cy="84" r="9" fill="'+P+'" stroke="'+T+'" stroke-width="2.2"/><circle cx="91" cy="84" r="3.6" fill="'+T+'"/><circle cx="109" cy="84" r="3.6" fill="'+T+'"/>'+
    pth('M97 92 L100 100 L103 92Z',T)+tinta('M80 70 L76 62 M120 70 L124 62',2)+tinta('M90 150 L86 158 M110 150 L114 158 M80 158 H120',2);
  s+=tinta('M58 66 C62 56 66 50 72 46',1.8)+pth('M60 62 C54 58 52 52 54 48 C60 50 62 56 60 62Z','#ecd27e',T,1.4)+pth('M66 52 C64 46 66 40 70 38 C72 44 70 50 66 52Z','#ecd27e',T,1.4)+
    pth('M136 52 C130 56 130 66 136 70 C132 64 132 58 136 52Z',T);
  s+='<text x="129" y="114" font-family="Georgia,serif" font-size="12" font-weight="700" fill="'+T+'" letter-spacing="1">ΑΘΕ</text>';
  return s;
}};

I['coroa']={fundo:'petroleo',nome:'Coroa',art(u){
  const pontas='M40 132 L26 70 L58 102 L68 50 L90 96 L100 26 L110 96 L132 50 L142 102 L174 70 L160 132 Z';
  const aro='M36 130 C70 142 130 142 164 130 L162 164 C130 174 70 174 38 164 Z';
  let s='<defs>'+clip(u+'p',pontas)+clip(u+'a',aro)+'</defs>'+pth(pontas,'var(--amarelo)')+
    '<g clip-path="url(#'+u+'p)"><path d="M110 0 L200 0 L200 200 L112 200Z" fill="url(#cm-h1)"/>'+tinta('M100 34 L100 120 M68 58 L80 120 M132 58 L120 120',1)+'</g>'+pth(pontas,'none',T,3);
  [[26,70],[68,50],[100,26],[132,50],[174,70]].forEach(q=>{s+='<circle cx="'+q[0]+'" cy="'+(q[1]-6)+'" r="7" fill="'+P+'" stroke="'+T+'" stroke-width="2.4"/>';});
  s+=pth(aro,'var(--amarelo)')+'<g clip-path="url(#'+u+'a)"><path d="M118 0 H200 V200 H122Z" fill="url(#cm-h1)"/></g>'+pth(aro,'none',T,3);
  for(let i=0;i<14;i++)s+='<circle cx="'+(44+i*8.6)+'" cy="'+(138+Math.sin(i/13*Math.PI)*3.2)+'" r="2" fill="'+T+'"/>';
  [[60,'var(--coral)'],[100,'var(--petroleo)'],[140,'var(--coral)']].forEach(j=>{s+='<ellipse cx="'+j[0]+'" cy="155" rx="'+(j[0]===100?10:8)+'" ry="7" fill="'+j[1]+'" stroke="'+T+'" stroke-width="2.4"/><path d="M'+(j[0]-4)+' 152 l3 -2" stroke="#fff" stroke-width="2"/>';});
  [80,120].forEach(x=>{s+='<path d="M'+x+' 149 l5 6 l-5 6 l-5 -6z" fill="'+P+'" stroke="'+T+'" stroke-width="1.8"/>';});
  return s;
}};

I['pergaminho']={fundo:'amarelo',nome:'Pergaminho',art(u){
  const folha='M46 40 H154 C150 80 158 120 152 160 H48 C54 120 42 80 46 40 Z';
  let s=pth(folha,P,T,3)+'<defs>'+clip(u+'f',folha)+'</defs><g clip-path="url(#'+u+'f)"><path d="M128 0 C140 60 132 120 140 200 H200 V0Z" fill="url(#cm-h1)" opacity=".7"/></g>';
  const r=C.rng('perg');
  s+=pth('M60 56 H124','none',T,3.2);
  for(let l=0;l<7;l++){const y=72+l*11;let x=60,d='';const fim=l===6?110:140-r()*6;
    while(x<fim){const w=8+r()*16;d+='M'+x.toFixed(1)+' '+y+' q'+(w/4).toFixed(1)+' -3 '+(w/2).toFixed(1)+' 0 t'+(w/2).toFixed(1)+' 0 ';x+=w+5;}
    s+=tinta(d,1.3);}
  const rolo=(y)=>{const d='M36 '+y+' H164 C170 '+y+' 170 '+(y+20)+' 164 '+(y+20)+' H36 C30 '+(y+20)+' 30 '+y+' 36 '+y+'Z';
    return pth(d,'#efe4cf',T,3)+'<path d="M36 '+(y+11)+' H164 V'+(y+20)+' H36Z" fill="url(#cm-h1)"/>'+pth(d,'none',T,3)+
      '<ellipse cx="36" cy="'+(y+10)+'" rx="6" ry="10" fill="'+P+'" stroke="'+T+'" stroke-width="2.4"/>'+tinta(espiral(36,y+10,7,1.6,1),1.2);};
  s+=rolo(26)+rolo(154);
  s+=pth('M124 150 L118 188 L126 182 L132 190 L134 152Z','var(--coral-esc)',T,2)+pth('M136 150 L146 186 L150 178 L158 182 L144 148Z','var(--coral)',T,2);
  s+='<circle cx="134" cy="140" r="16" fill="var(--coral)" stroke="'+T+'" stroke-width="2.6"/><circle cx="134" cy="140" r="10" fill="none" stroke="'+T+'" stroke-width="1.4"/>'+pth('M128 140 L134 133 L140 140 L134 147Z','none',T,1.6);
  return s;
}};

I['balanca']={fundo:'petroleo',nome:'Balança',art(u){
  let s=pth('M66 188 H134 L124 172 H76Z','#efe4cf',T,3)+pth('M118 172 L134 188 H120 L110 172Z','url(#cm-h1)');
  s+=pth('M96 172 V44 H104 V172Z',P,T,2.6)+pth('M101 44 H104 V172 H101Z','url(#cm-h1)');
  s+='<circle cx="100" cy="36" r="8" fill="#efe4cf" stroke="'+T+'" stroke-width="2.6"/>';
  s+=pth('M30 66 L170 46 L170 54 L30 74Z','#efe4cf',T,2.6)+'<circle cx="100" cy="60" r="5" fill="'+T+'"/>';
  const prato=(x,y,id)=>{const d='M'+(x-34)+' '+y+' C'+(x-30)+' '+(y+22)+' '+(x+30)+' '+(y+22)+' '+(x+34)+' '+y+' Z';
    return tinta('M'+x+' '+(y-56+(x<100?4:0))+' L'+(x-30)+' '+y+' M'+x+' '+(y-56+(x<100?4:0))+' L'+(x+30)+' '+y+' M'+x+' '+(y-56+(x<100?4:0))+' L'+x+' '+y,1.4)+
      '<defs>'+clip(id,d)+'</defs>'+pth(d,'#efe4cf')+'<g clip-path="url(#'+id+')"><rect x="'+x+'" y="'+y+'" width="40" height="30" fill="url(#cm-h1)"/></g>'+pth(d,'none',T,2.8)+
      '<ellipse cx="'+x+'" cy="'+y+'" rx="34" ry="5" fill="'+P+'" stroke="'+T+'" stroke-width="2.4"/>';};
  s+=prato(32,126,u+'a')+prato(168,106,u+'b');
  s+=pth('M20 120 H44 V108 H20Z','var(--coral)',T,2.4)+pth('M24 108 H40 V98 H24Z','var(--coral)',T,2.4)+pth('M36 98 H40 V120 H36Z','url(#cm-h1)');
  return s;
}};

I['navio']={fundo:'amarelo',nome:'Navio antigo',art(u){
  let s='';
  for(let i=0;i<7;i++){const x=56+i*16;s+=tinta('M'+x+' 128 L'+(x-18)+' 170',2.4);}
  s+=pth('M96 114 V22','none',T,3.4)+pth('M50 32 C80 28 116 26 144 28','none',T,3);
  const vela='M54 34 C82 31 114 29 140 31 C136 56 138 82 134 104 C108 100 82 102 60 106 C64 82 58 56 54 34 Z';
  s+='<defs>'+clip(u+'v',vela)+'</defs>'+pth(vela,'var(--coral)')+'<g clip-path="url(#'+u+'v)">';
  for(let x=62;x<140;x+=14)s+='<path d="M'+x+' 20 V120" stroke="#f6e6d4" stroke-width="4.5"/>';
  s+='<path d="M112 0 C126 50 124 90 118 120 H160 V0Z" fill="url(#cm-h1)"/></g>'+pth(vela,'none',T,3)+tinta('M58 70 C84 66 112 64 138 66',1.2);
  s+=tinta('M96 22 L26 112 M96 22 L172 92',1.2);
  const casco='M6 134 L28 130 L28 112 C70 118 130 116 166 104 C174 94 178 82 174 70 C192 80 190 108 178 120 C166 136 148 146 126 148 L46 148 C30 146 16 142 6 134 Z';
  s+='<defs>'+clip(u+'c',casco)+'</defs>'+pth(casco,'#efe4cf')+'<g clip-path="url(#'+u+'c)"><rect x="0" y="100" width="200" height="60" fill="url(#cm-hh)"/><path d="M0 138 C60 148 120 148 200 122 V200 H0Z" fill="url(#cm-h1)"/>'+
    tinta('M28 122 C70 126 130 124 170 110',1.6)+[0,1,2,3,4,5,6].map(i=>'<circle cx="'+(56+i*16)+'" cy="128" r="3" fill="'+T+'"/>').join('')+'</g>'+pth(casco,'none',T,3);
  s+=pth('M176 74 C172 62 180 54 186 60 C190 66 184 72 180 68','none',T,2.6);
  s+='<circle cx="38" cy="132" r="4" fill="'+P+'" stroke="'+T+'" stroke-width="1.6"/><circle cx="38" cy="132" r="1.6" fill="'+T+'"/>';
  s+=pth('M-4 136 L10 132 L12 140 Z',T);
  for(let k=0;k<3;k++){const y=172+k*8;let d='M'+(10+k*8)+' '+y;for(let x=10+k*8;x<190-k*8;x+=20)d+=' q5 -6 10 0 t10 0';s+=tinta(d,1.8);}
  return s;
}};

I['muralha']={fundo:'petroleo',nome:'Muralha',art(u){
  const r=C.rng('muro');
  const muro='M8 100 H20 V88 H34 V100 H48 V88 H62 V100 H76 V88 H90 V100 H104 V88 H118 V100 H128 V184 H8 Z';
  const torre='M122 60 H134 V46 H148 V60 H160 V46 H174 V60 H190 V184 H122 Z';
  let s='<defs>'+clip(u+'m',muro)+clip(u+'t',torre)+'</defs>';
  const pedras=(x0,x1,y0,y1)=>{let d='';for(let y=y0,l=0;y<y1;y+=12,l++){d+='M'+x0+' '+y+' H'+x1;for(let x=x0+(l%2?10:2)+r()*4;x<x1;x+=18+r()*8)d+=' M'+x.toFixed(1)+' '+y+' v12';}return tinta(d,1);};
  s+=pth(muro,'#efe4cf')+'<g clip-path="url(#'+u+'m)">'+pedras(0,130,88,190)+'<path d="M0 170 H130 V190 H0Z" fill="url(#cm-h1)"/></g>';
  const portao='M46 184 V138 C46 116 82 116 82 138 V184 Z';
  s+=pth(portao,T)+'<path d="'+portao+'" fill="url(#cm-h2)"/>'+tinta('M52 184 V140 M58 184 V132 M64 184 V128 M70 184 V132 M76 184 V140',1.4)+pth('M42 186 V138 C42 110 86 110 86 138 V186','none',T,3)+pth(muro,'none',T,3);
  s+=pth(torre,'#efe4cf')+'<g clip-path="url(#'+u+'t)">'+pedras(120,192,46,190)+'<path d="M166 0 H200 V200 H166Z" fill="url(#cm-h1)"/><path d="M180 0 H200 V200 H180Z" fill="url(#cm-h3)"/></g>'+pth(torre,'none',T,3);
  s+=pth('M152 96 h6 v24 h-6z',T)+pth('M152 140 h6 v20 h-6z',T);
  s+=pth('M154 46 V12','none',T,2.6)+pth('M154 12 C166 10 172 16 186 14 L180 22 L186 30 C172 32 166 26 154 28 Z','var(--coral)',T,2.2);
  s+=pth('M0 186 H200','none',T,3)+'<path d="M0 186 H200 V194 H0Z" fill="url(#cm-h1)"/>';
  return s;
}};


/* ---------- Pré-História: ilustrações novas (tópico 1 do módulo 1) ---------- */
const PEPATH='M-2 -34 C8 -35 13 -28 12 -18 C11 -10 6 -4 6 4 C6 14 9 20 8 28 C7 36 -1 40 -8 36 C-14 32 -12 22 -11 14 C-10 4 -13 -4 -13 -14 C-13 -26 -9 -33 -2 -34Z';
const PEDEDOS=[[-8,-38.5,3.6],[-1,-41.5,4.2],[6,-39.5,3.6],[11,-34.5,3],[13.4,-27.5,2.6]];

I['pegadas']={fundo:'coral',nome:'Pegadas fossilizadas em cinza vulcânico',art(u){
  const slab='M12 44 C38 14 152 8 186 36 C200 72 198 138 180 172 C142 198 52 198 20 172 C6 130 4 84 12 44 Z',r=C.rng('peg');
  let pontos='';for(let i=0;i<70;i++)pontos+='<circle cx="'+(14+r()*172).toFixed(1)+'" cy="'+(14+r()*174).toFixed(1)+'" r="'+(.7+r()*1.2).toFixed(1)+'" fill="'+T+'" opacity=".45"/>';
  const pe=(x,y,g,m)=>'<g transform="translate('+x+' '+y+') rotate('+g+') scale('+(m?-.72:.72)+' .72)"><path d="'+PEPATH+'" fill="'+T+'" fill-opacity=".84" stroke="'+T+'" stroke-width="3"/>'+
    PEDEDOS.map(d=>'<circle cx="'+d[0]+'" cy="'+d[1]+'" r="'+d[2]+'" fill="'+T+'" fill-opacity=".84"/>').join('')+
    '<path d="M-5 -22 C-6 -10 -3 2 0 12" fill="none" stroke="#fbf8ef" stroke-width="2.4" stroke-opacity=".45"/></g>';
  return '<defs>'+clip(u+'s',slab)+'</defs>'+pth(slab,'#d9d4c8')+'<g clip-path="url(#'+u+'s)"><rect width="200" height="200" fill="url(#cm-hv)"/><path d="M140 0 H200 V200 H110 C150 140 150 60 140 0Z" fill="url(#cm-h1)" opacity=".55"/>'+pontos+'</g>'+
    pe(64,150,-8,0)+pe(124,100,7,1)+pe(70,50,-6,0)+pth(slab,'none',T,3.2);
}};

I['arbusto']={fundo:'amarelo',nome:'Arbusto da evolução humana',art(u){
  const ramos=['M100 194 C100 176 99 162 97 148','M97 148 C80 134 66 120 52 98','M97 148 C100 128 105 110 110 92 C114 74 104 52 100 24',
    'M72 124 C62 108 62 90 50 72','M52 98 C46 84 40 76 31 62','M103 118 C122 110 140 100 152 84','M110 92 C126 82 136 64 150 50','M152 84 C162 74 170 70 178 58',
    'M103 150 C124 148 146 140 164 122','M101 58 C87 50 80 40 71 30','M103 50 C114 42 124 38 132 28','M62 108 C80 100 92 108 104 102'];
  const pontas=[[31,62],[50,72],[71,30],[132,28],[150,50],[178,58],[152,84],[164,122]];
  let s=pth('M12 4 H188 V198 H12Z',P)+pth('M14 190 C50 186 150 186 186 190 V198 H14Z','url(#cm-hh)');
  ramos.forEach(d=>{s+=tinta(d,3.2);});
  pontas.forEach(q=>{s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="4" fill="'+P+'" stroke="'+T+'" stroke-width="2.4"/>';});
  s+='<circle cx="100" cy="24" r="7" fill="var(--amarelo)" stroke="'+T+'" stroke-width="3"/>'+
    '<text x="100" y="6" text-anchor="middle" font-family="Atkinson Hyperlegible Next,sans-serif" font-weight="700" font-size="15" fill="'+T+'">Homo sapiens</text>'+
    '<text x="22" y="176" font-family="Atkinson Hyperlegible Next,sans-serif" font-style="italic" font-size="12" fill="'+T+'">pontas soltas</text>';
  return s;
}};

I['microlitos']={fundo:'petroleo',nome:'Micrólitos presos numa haste de madeira',art(u){
  let s='<g transform="rotate(-34 100 100)">';
  for(let i=0;i<6;i++){const x=32+i*25;
    s+=pth('M'+x+' 90 L'+(x+4)+' 62 L'+(x+17)+' 56 L'+(x+21)+' 90 Z','#e6e2d8',T,2.4)+pth('M'+(x+4)+' 62 L'+(x+17)+' 56 L'+(x+16)+' 66 Z','url(#cm-h1)')+tinta('M'+(x+9)+' 88 L'+(x+11)+' 66',1);}
  s+=pth('M18 88 H182 C188 88 190 92 190 100 C190 108 188 112 182 112 H18 C12 112 10 108 10 100 C10 92 12 88 18 88Z','#e9d8b6',T,3)+
    '<defs>'+clip(u+'h','M18 88 H182 C188 88 190 92 190 100 C190 108 188 112 182 112 H18 C12 112 10 108 10 100 C10 92 12 88 18 88Z')+'</defs><g clip-path="url(#'+u+'h)"><rect x="0" y="100" width="200" height="14" fill="url(#cm-h1)"/>'+
    tinta('M14 96 C60 92 120 99 186 95',1.1)+tinta('M14 104 C70 101 130 106 186 103',1.1)+'</g>'+
    pth('M26 90 H170','none',T,1.6)+[0,1,2,3,4,5].map(i=>'<circle cx="'+(42+i*25)+'" cy="90" r="3.6" fill="'+T+'"/>').join('')+'</g>';
  return s;
}};

I['mamute']={fundo:false,nome:'Silhueta de mamute',art(u){
  const corpo='M62 74 C72 46 108 38 136 46 C164 54 182 80 180 114 C178 138 172 150 170 170 L154 170 L152 146 C142 150 118 150 106 146 L102 170 L86 170 L84 142 C72 140 62 130 62 118 Z';
  const tromba='M58 86 C42 90 34 106 36 124 C38 140 32 156 24 170 C22 178 30 184 38 180 C46 170 52 152 58 138 Z';
  let s='<defs>'+clip(u+'m',corpo)+'</defs>'+pth(corpo,P)+'<g clip-path="url(#'+u+'m)">';
  for(let i=0;i<9;i++)s+=tinta('M'+(86+i*10)+' '+(52+i%3*4)+' C'+(82+i*10)+' 90 '+(92+i*10)+' 120 '+(86+i*10)+' 158',1.3);
  s+='<path d="M120 40 H200 V176 H130 C160 120 156 80 120 40Z" fill="url(#cm-h1)" opacity=".6"/></g>'+pth(corpo,'none',T,3)+
    pth('M70 70 C84 52 104 56 108 72 C96 66 84 66 70 70Z',P,T,2.4)+
    pth(tromba,P,T,3)+tinta('M44 104 C48 118 46 132 42 146',1.3)+tinta('M40 112 C44 124 42 136 38 148',1.1)+
    pth('M48 116 C30 130 16 124 12 106 C10 94 16 86 24 80','none',T,9)+pth('M48 116 C30 130 16 124 12 106 C10 94 16 86 24 80','none','#fbf8ef',4.6)+
    '<circle cx="58" cy="96" r="3.4" fill="'+T+'"/>'+tinta('M62 146 L64 168',1.2)+tinta('M96 150 L94 168',1.2);
  return s;
}};

I['casa-barro']={fundo:'amarelo',nome:'Casa de barro',art(u){
  const par='M26 98 H174 V172 H26 Z';
  let s=pth('M8 172 H192','none',T,3)+pth('M8 172 H192 V182 H8Z','url(#cm-h1)')+'<defs>'+clip(u+'p',par)+'</defs>'+pth(par,'#ead9b6')+'<g clip-path="url(#'+u+'p)">';
  for(let y=106;y<172;y+=11){s+=tinta('M26 '+y+' H174',1);for(let x=(y/11%2?32:44);x<174;x+=24)s+=tinta('M'+x+' '+y+' v11',1);}
  s+='<path d="M130 90 H200 V180 H122Z" fill="url(#cm-h1)" opacity=".6"/></g>'+pth(par,'none',T,3)+
    pth('M20 84 H180 V98 H20Z','#e1cda3',T,3)+[0,1,2,3,4,5,6,7].map(i=>'<ellipse cx="'+(30+i*20)+'" cy="91" rx="5" ry="6" fill="'+P+'" stroke="'+T+'" stroke-width="2"/>').join('')+
    pth('M88 172 V138 C88 126 112 126 112 138 V172Z',T)+pth('M46 112 H70 V132 H46Z',T)+pth('M46 122 H70','none','#fbf8ef',1.6)+pth('M58 112 V132','none','#fbf8ef',1.6);
  return s;
}};

I['mo']={fundo:'coral',nome:'Mó de pedra e grãos',art(u){
  const base='M16 128 C16 108 44 100 100 100 C156 100 184 108 184 128 C184 150 160 162 100 162 C40 162 16 150 16 128Z';
  const r=C.rng('mo');let gr='';
  for(let i=0;i<16;i++){const gx=(30+r()*140).toFixed(1),gy=(166+r()*18).toFixed(1);gr+='<ellipse cx="'+gx+'" cy="'+gy+'" rx="4" ry="2.4" transform="rotate('+(r()*160).toFixed(0)+' '+gx+' '+gy+')" fill="var(--amarelo)" stroke="'+T+'" stroke-width="1.4"/>';}
  return '<defs>'+clip(u+'b',base)+'</defs>'+pth(base,'#d8d3c8')+'<g clip-path="url(#'+u+'b)"><rect width="200" height="200" fill="url(#cm-hh)"/><path d="M120 90 H200 V170 H100 C130 140 130 110 120 90Z" fill="url(#cm-h1)" opacity=".7"/></g>'+pth(base,'none',T,3)+
    pth('M44 124 C44 114 70 110 100 110 C130 110 156 114 156 124 C156 134 130 140 100 140 C70 140 44 134 44 124Z','#bdb7aa',T,2.4)+
    pth('M40 92 C40 74 160 74 160 92 C160 108 40 108 40 92Z','#e6e2d8',T,3)+pth('M60 82 C90 76 120 76 146 84','none','#fff',3,' stroke-opacity=".8"')+tinta('M56 98 C90 104 120 104 148 98',1.6)+
    gr+'<path d="M80 168 C90 160 110 160 120 168Z" fill="#f6f1e4" stroke="'+T+'" stroke-width="1.6"/>';
}};

I['trigo']={fundo:'amarelo',nome:'Trigo',art(u){
  let s='';
  [[-17,0],[17,0],[0,0]].forEach(([ang],k)=>{
    s+='<g transform="rotate('+ang+' 100 196)">'+tinta('M100 196 L100 56',3.4)+pth('M100 160 C88 140 76 128 60 124 C74 140 88 152 100 170Z','#efe4cf',T,2.2);
    for(let i=0;i<7;i++){const y=64+i*11;[-1,1].forEach(sd=>{s+='<g transform="translate('+(100+sd*8)+' '+(y+(sd>0?5:0))+') rotate('+(sd*22)+')"><ellipse rx="6.6" ry="11.5" fill="var(--amarelo)" stroke="'+T+'" stroke-width="2"/><path d="M0 -10 V10" stroke="'+T+'" stroke-width="1"/><path d="M0 -11 L'+(sd*3)+' -36" stroke="'+T+'" stroke-width="1.1"/></g>';});}
    s+='<ellipse cx="100" cy="52" rx="6" ry="10.5" fill="var(--amarelo)" stroke="'+T+'" stroke-width="2"/><path d="M100 42 L100 16" stroke="'+T+'" stroke-width="1.1"/></g>';
  });
  return s+pth('M72 172 C86 164 114 164 128 172 L124 184 C112 190 88 190 76 184Z','#d9c9a0',T,2.4)+tinta('M78 176 H122',1)+tinta('M80 182 H120',1);
}};

I['cabra']={fundo:'petroleo',nome:'Cabra no cercado',art(u){
  const corpo='M58 100 C58 86 92 82 122 86 C146 88 158 96 158 108 C158 118 150 126 140 126 L140 168 L130 168 L128 128 L98 128 L96 168 L86 168 L84 126 C68 124 58 114 58 100Z';
  let s=pth('M6 172 H194','none',T,3)+pth('M6 172 H194 V182 H6Z','url(#cm-h1)');
  [14,60,146,186].forEach(x=>{s+=pth('M'+(x-4)+' 172 V96 L'+x+' 90 L'+(x+4)+' 96 V172Z','#efe4cf',T,2.4);});
  s+=tinta('M10 112 H190',3)+tinta('M10 140 H190',3);
  s+='<defs>'+clip(u+'c',corpo)+'</defs>'+pth(corpo,P)+'<g clip-path="url(#'+u+'c)"><path d="M118 70 H200 V180 H122 C150 140 140 100 118 70Z" fill="url(#cm-h1)" opacity=".7"/>'+tinta('M70 100 C90 94 120 94 146 100',1.2)+tinta('M70 112 C90 106 120 106 148 112',1.2)+'</g>'+pth(corpo,'none',T,3);
  s+=pth('M64 94 C54 82 50 70 46 56 L40 50 C34 52 34 60 38 66 C38 80 44 98 58 112Z',P,T,3)+
    pth('M46 56 C38 56 30 60 28 68 C34 68 40 66 44 62Z',P,T,2.6)+pth('M42 52 C40 40 46 30 52 26 C50 36 52 44 52 52','none',T,3)+pth('M44 50 C46 38 54 32 62 30 C58 40 56 46 54 54','none',T,3)+
    pth('M32 68 C30 78 34 84 38 86','none',T,2.4)+'<circle cx="44" cy="58" r="2.4" fill="'+T+'"/>'+pth('M158 104 C166 100 170 94 168 88','none',T,3);
  return s;
}};

I['pote']={fundo:'coral',nome:'Pote de cerâmica',art(u){
  const corpo='M72 44 L68 60 C40 76 32 116 46 148 C54 168 76 178 100 178 C124 178 146 168 154 148 C168 116 160 76 132 60 L128 44 Z';
  let s='<defs>'+clip(u+'p',corpo)+'</defs>'+pth(corpo,'#f0d9bd')+'<g clip-path="url(#'+u+'p)"><path d="M112 30 H200 V190 H122 C158 150 150 80 112 30Z" fill="url(#cm-h1)" opacity=".75"/><path d="M130 30 H200 V190 H140 C170 140 160 80 130 30Z" fill="url(#cm-h3)" opacity=".6"/>';
  s+=pth('M40 96 H160','none',T,2.4)+pth('M38 128 H162','none',T,2.4);
  let z='M42 112';for(let x=44;x<160;x+=12)z+=' L'+(x+6)+' 100 L'+(x+12)+' 112';
  s+=pth(z,'none',T,2.2)+pth(z.replace(/ 100 /g,' 124 ').replace('M42 112','M42 112'),'none',T,2.2);
  for(let i=0;i<9;i++)s+='<path d="M'+(52+i*12)+' 140 l6 14 l6 -14z" fill="'+T+'" opacity=".85"/>';
  s+='</g>'+pth(corpo,'none',T,3)+pth('M62 44 C62 34 138 34 138 44 C138 54 62 54 62 44Z','#e8c9a4',T,3)+pth('M76 44 C84 48 116 48 124 44','none',T,1.4);
  return s;
}};

I['tear']={fundo:'amarelo',nome:'Tear de pesos',art(u){
  let s=pth('M6 184 H194','none',T,3)+pth('M6 184 H194 V192 H6Z','url(#cm-h1)');
  [44,156].forEach(x=>{s+=pth('M'+(x-7)+' 184 V22 H'+(x+7)+' V184Z','#e9d8b6',T,3)+tinta('M'+x+' 30 V176',1);});
  s+=pth('M34 22 H166 V36 H34Z','#e9d8b6',T,3);
  for(let x=60;x<=140;x+=8)s+=tinta('M'+x+' 36 V150',1.6);
  s+=pth('M58 40 H142 V84 H58Z','#f6f1e4',T,2.2)+'<rect x="58" y="40" width="84" height="44" fill="url(#cm-h2)" opacity=".8"/>'+tinta('M58 62 H142',1.4)+tinta('M58 50 H142',1);
  s+=pth('M54 86 H146','none',T,4.6);
  for(let x=60;x<=140;x+=16)s+=pth('M'+x+' 150 C'+(x-8)+' 152 '+(x-8)+' 172 '+x+' 174 C'+(x+8)+' 172 '+(x+8)+' 152 '+x+' 150Z','#d9d4c8',T,2.2);
  return s;
}};

I['celeiro']={fundo:'coral',nome:'Celeiro de grãos',art(u){
  const cupula='M44 164 C44 96 70 46 100 46 C130 46 156 96 156 164 Z';
  let s=pth('M6 178 H194','none',T,3)+pth('M6 178 H194 V188 H6Z','url(#cm-h1)')+pth('M34 164 H166 V178 H34Z','#d9d4c8',T,3)+
    '<defs>'+clip(u+'c',cupula)+'</defs>'+pth(cupula,'#ead9b6')+'<g clip-path="url(#'+u+'c)">';
  for(let y=58;y<164;y+=12)s+=tinta('M30 '+y+' C70 '+(y-6)+' 130 '+(y-6)+' 170 '+y,1.2);
  s+='<path d="M112 40 H200 V170 H128 C156 130 150 80 112 40Z" fill="url(#cm-h1)" opacity=".7"/></g>'+pth(cupula,'none',T,3)+
    pth('M86 164 V136 C86 124 114 124 114 136 V164Z',T)+pth('M90 46 C90 36 110 36 110 46','none',T,3)+
    pth('M20 176 C20 164 40 160 50 168 C52 174 48 178 44 178Z','#efe4cf',T,2.4)+pth('M150 178 C148 166 166 158 180 166 C184 172 182 178 176 178Z','#efe4cf',T,2.4);
  for(let i=0;i<8;i++)s+='<ellipse cx="'+(30+i*6)+'" cy="'+(171+i%2*2)+'" rx="3" ry="1.8" fill="var(--amarelo)" stroke="'+T+'" stroke-width="1"/>';
  return s;
}};

I['cobre']={fundo:'petroleo',nome:'Machado de cobre',art(u){
  const lam='M100 52 L100 108 L56 130 C46 110 46 68 56 30 Z';
  return '<g transform="rotate(-20 100 100)"><path d="M92 24 H108 V196 H92Z" fill="#e9d8b6" stroke="'+T+'" stroke-width="3"/><path d="M104 28 V192" stroke="'+T+'" stroke-width="1.2" opacity=".6"/>'+
    '<defs>'+clip(u+'l',lam)+'</defs>'+pth(lam,'#cf7a3c',T,3)+'<g clip-path="url(#'+u+'l)"><path d="M100 90 L60 124 L60 140 L100 140Z" fill="url(#cm-h1)" opacity=".85"/><path d="M54 44 C54 70 54 90 60 112" fill="none" stroke="#ffd9a8" stroke-width="5" opacity=".9"/></g>'+pth(lam,'none',T,3)+
    '<rect x="89" y="52" width="22" height="8" rx="2" fill="#efe4cf" stroke="'+T+'" stroke-width="2.2"/><rect x="89" y="68" width="22" height="8" rx="2" fill="#efe4cf" stroke="'+T+'" stroke-width="2.2"/><rect x="89" y="84" width="22" height="8" rx="2" fill="#efe4cf" stroke="'+T+'" stroke-width="2.2"/></g>';
}};

I['bronze']={fundo:'petroleo',nome:'Ponta de lança de bronze',art(u){
  const f='M100 10 C132 40 146 82 134 120 C128 134 116 140 100 142 C84 140 72 134 66 120 C54 82 68 40 100 10Z';
  return '<g transform="rotate(24 100 100)"><path d="M92 142 H108 V196 H92Z" fill="#e9d8b6" stroke="'+T+'" stroke-width="3"/>'+pth('M86 136 H114 L110 156 H90Z','#c89a42',T,3)+
    '<defs>'+clip(u+'f',f)+'</defs>'+pth(f,'#d3a947',T,3)+'<g clip-path="url(#'+u+'f)"><path d="M100 0 H160 V160 H100Z" fill="url(#cm-h1)" opacity=".85"/><path d="M82 40 C74 70 76 100 84 124" fill="none" stroke="#fff3c4" stroke-width="5" opacity=".9"/></g>'+pth(f,'none',T,3)+
    tinta('M100 14 V134',2.2)+'<circle cx="100" cy="148" r="3.4" fill="'+T+'"/></g>';
}};

I['ferro']={fundo:'petroleo',nome:'Lâmina de ferro',art(u){
  const f='M92 14 L108 14 L114 60 L112 128 L88 128 L86 60 Z';
  return '<g transform="rotate(32 100 100)"><path d="M92 14 C96 6 104 6 108 14" fill="#8a979e" stroke="'+T+'" stroke-width="3"/>'+
    '<defs>'+clip(u+'f',f)+'</defs>'+pth(f,'#8f9ca3',T,3)+'<g clip-path="url(#'+u+'f)"><path d="M100 0 H130 V140 H100Z" fill="url(#cm-h1)" opacity=".9"/><path d="M94 20 L92 120" fill="none" stroke="#e8f0f4" stroke-width="4" opacity=".9"/></g>'+pth(f,'none',T,3)+tinta('M100 20 V122',1.6)+
    pth('M70 128 H130 V138 H70Z','#4a463e',T,3)+pth('M92 138 H108 V182 H92Z','#e9d8b6',T,3)+tinta('M92 150 H108',1.4)+tinta('M92 162 H108',1.4)+pth('M92 182 C92 192 108 192 108 182Z','#4a463e',T,2.6)+'</g>';
}};

I['mao']={fundo:false,nome:'Mão que aponta',art(u){
  return pth('M164 70 H194 V162 H164Z','#e6e2d8',T,3)+
    pth('M18 90 C18 82 24 80 32 80 H108 C116 80 120 84 122 90 L160 90 C170 90 170 104 160 106 H122 C120 112 116 114 108 114 H32 C24 114 18 108 18 100Z',P,T,3)+
    pth('M96 114 H162 C172 114 172 130 162 130 H96 C86 130 86 114 96 114Z',P,T,3)+pth('M100 130 H162 C172 130 172 146 162 146 H100 C90 146 90 130 100 130Z',P,T,3)+pth('M108 146 H160 C170 146 170 160 160 160 H108 C98 160 98 146 108 146Z',P,T,3)+
    pth('M96 80 C100 66 124 64 150 70 L160 90 H122 C120 82 108 78 96 80Z',P,T,3)+tinta('M34 90 H104',1.2);
}};

/* ---------- Mesopotâmia: recortes novos ---------- */
const AZ='#2b62b3',AZ2='#4f86d1',OURO='#e2b53c';
function bicho(x,y,k,d){ // touro ou dragão em relevo amarelo, d = 1 olha para a direita, -1 para a esquerda
  return '<g transform="translate('+x+' '+y+') scale('+(k*d)+' '+k+')" fill="'+OURO+'" stroke="'+T+'" stroke-width="1.4" stroke-linejoin="round">'+
    '<path d="M-9 -3 C-9 -6 -4 -7 0 -7 C4 -7 8 -6 9 -3 L9 3 L-9 3Z"/><path d="M9 -5 C12 -8 15 -7 15 -4 L14 -1 L9 1Z"/><path d="M13 -8 L15 -12 M11 -8 L11 -12" fill="none"/>'+
    '<path d="M-8 3 V9 M-4 3 V9 M4 3 V9 M8 3 V9" fill="none"/><path d="M-9 -2 C-13 -1 -13 3 -11 5" fill="none"/></g>';
}
I['porta-ishtar']={fundo:false,nome:'Porta de Ishtar',art(u){
  let s='';
  const cren=(x0,x1,y)=>{let d='';for(let x=x0;x<x1;x+=14)d+='M'+x+' '+y+' h8 v-9 h-8Z ';return d;};
  const torre=(x0,x1,y0)=>{
    const d='M'+x0+' 186 V'+y0+' H'+x1+' V186 Z',id=u+'t'+x0;
    let t='<defs>'+clip(id,d)+'</defs>'+pth(d,AZ)+'<g clip-path="url(#'+id+')">';
    for(let y=y0+10;y<186;y+=11){t+=tinta('M'+x0+' '+y+' H'+x1,.9).replace('stroke-width="0.9"','stroke-width=".9" opacity=".5"');
      for(let x=x0+((y/11|0)%2?6:0);x<x1;x+=12)t+='<path d="M'+x+' '+(y-11)+' V'+y+'" stroke="'+T+'" stroke-width=".8" opacity=".4"/>';}
    t+='<path d="M'+(x1-8)+' '+y0+' H'+x1+' V186 H'+(x1-8)+'Z" fill="'+T+'" opacity=".25"/></g>';
    return t+pth(cren(x0+2,x1-6,y0),AZ2,T,2)+pth(d,'none',T,3);
  };
  s+=torre(14,70,34)+torre(130,186,34);
  const meio='M70 186 V70 H130 V186Z';
  s+='<defs>'+clip(u+'m',meio)+'</defs>'+pth(meio,AZ2)+'<g clip-path="url(#'+u+'m)">';
  for(let y=80;y<186;y+=11){s+='<path d="M70 '+y+' H130" stroke="'+T+'" stroke-width=".9" opacity=".45"/>';}
  s+='</g>'+pth(cren(72,126,70),AZ2,T,2)+pth(meio,'none',T,3);
  s+=pth('M82 186 V118 C82 90 118 90 118 118 V186Z','#16213a',T,3)+pth('M88 186 V120 C88 100 112 100 112 120 V186Z','url(#cm-h1)')+
     pth('M70 186 H130','none',T,3);
  // faixas de relevo: touros e dragões em fileiras
  [[26,58,1],[48,58,1],[26,92,1],[48,92,1],[26,126,1],[48,126,1],[142,58,-1],[164,58,-1],[142,92,-1],[164,92,-1],[142,126,-1],[164,126,-1]].forEach(a=>{s+=bicho(a[0]+8,a[1]+8,.95,a[2]);});
  [[100,80,1],[100,108,-1]].forEach(a=>{s+=bicho(a[0]-1,a[1],.8,a[2]);});
  s+=pth('M8 186 H192','none',T,3);
  return s;
}};

I['cerco']={fundo:'petroleo',nome:'Cerco assírio a uma cidade',art(u){
  const muro='M8 188 V58 H84 V188Z',id=u+'mu';
  let s='<defs>'+clip(id,muro)+'</defs>'+pth(muro,'#e9e1cf')+'<g clip-path="url(#'+id+')"><rect x="0" y="0" width="200" height="200" fill="url(#cm-hh)"/><path d="M62 0 H100 V200 H62Z" fill="url(#cm-h1)"/>';
  for(let y=70;y<188;y+=14)for(let x=(y/14%2?10:20);x<84;x+=20)s+='<path d="M'+x+' '+y+' h14 v10 h-14Z" fill="none" stroke="'+T+'" stroke-width=".8" opacity=".5"/>';
  s+='</g>';
  let cr='';for(let x=8;x<84;x+=20)cr+='M'+x+' 58 v-12 h12 v12Z ';
  s+=pth(cr,'#e9e1cf',T,2.4)+pth(muro,'none',T,3)+pth('M40 188 V132 C40 118 56 118 56 132 V188Z',T);
  // rampa de terra e aríete
  s+=pth('M84 150 L192 188 H84Z','#d9cfb6',T,3)+pth('M84 150 L192 188','none',T,3)+'<path d="M92 160 L180 186 H92Z" fill="url(#cm-h2)" opacity=".6"/>';
  const sold=(x,y,k)=>'<g transform="translate('+x+' '+y+') scale('+k+')">'+
    pth('M-9 -33 L0 -50 L9 -33 Z',P,T,2.4)+'<circle cx="0" cy="-26" r="8" fill="'+P+'" stroke="'+T+'" stroke-width="2.4"/>'+pth('M-9 -33 H9','none',T,2.4)+
    pth('M-9 -18 C-12 -4 -10 10 -8 22 H8 C10 10 12 -4 9 -18 Z',P,T,2.4)+tinta('M-5 22 V38 M5 22 V38',2.6)+
    pth('M6 -14 C20 -14 22 6 12 16 C8 18 4 14 4 6 Z','#8a7f68',T,2.4)+tinta('M-14 -30 L-14 30',2.2)+pth('M-14 -36 L-18 -28 H-10Z',T)+'</g>';
  s+=sold(118,150,.85)+sold(146,160,.85)+sold(172,170,.85);
  // escudo de cerco em cima da rampa: flechas
  s+=pth('M6 190 H194','none',T,3);
  return s;
}};

I['sargao']={fundo:'amarelo',nome:'Cabeça real em traço, no estilo acádio',art(u){
  const rostos='M100 36 C70 36 62 62 64 92 C66 112 76 126 100 130 C124 126 134 112 136 92 C138 62 130 36 100 36 Z';
  let s='<circle cx="100" cy="100" r="92" fill="'+P+'" stroke="'+T+'" stroke-width="3"/><defs>'+clip(u+'c','M100 100 m-92 0 a92 92 0 1 0 184 0 a92 92 0 1 0 -184 0')+'</defs><g clip-path="url(#'+u+'c)">';
  s+='<path d="M0 0 H200 V200 H0Z" fill="url(#cm-hh)" opacity=".5"/>';
  // ombros e manto
  s+=pth('M20 200 C24 160 60 146 100 146 C140 146 176 160 180 200Z',P,T,3)+'<path d="M100 146 C120 146 150 154 164 200 H130 C130 170 118 156 100 146Z" fill="url(#cm-h1)"/>';
  // barba longa em fileiras de cachos
  s+=pth('M64 92 C60 120 66 160 100 172 C134 160 140 120 136 92 C128 112 114 122 100 122 C86 122 72 112 64 92Z',P,T,3);
  for(let r=0;r<5;r++){const y=118+r*10,w=30-r*3;let d='M'+(100-w)+' '+y;for(let x=100-w;x<100+w;x+=10)d+=' q5 8 10 0';s+=tinta(d,1.6);}
  // rosto, cabelo, faixa
  s+=pth(rostos,P,T,3)+pth('M64 70 C64 44 82 30 100 30 C118 30 136 44 136 70 C130 56 118 50 100 50 C82 50 70 56 64 70Z','url(#cm-h3)',T,2.6)+
     pth('M62 62 C62 54 70 46 100 46 C130 46 138 54 138 62 L138 70 C130 64 70 64 62 70Z',P,T,3)+tinta('M64 58 H136',1.4);
  // coque atrás
  s+=pth('M136 80 C156 74 162 98 150 108 C142 114 134 108 138 100',P,T,3)+tinta('M142 90 C148 92 150 98 146 102',1.5);
  // olhos, nariz, bigode, boca
  s+=pth('M74 84 C80 79 90 79 94 84 C90 89 80 89 74 84Z',P,T,2.2)+'<circle cx="84" cy="84" r="2.8" fill="'+T+'"/>'+pth('M106 84 C110 79 120 79 126 84 C120 89 110 89 106 84Z',P,T,2.2)+'<circle cx="116" cy="84" r="2.8" fill="'+T+'"/>'+
     tinta('M72 76 C80 72 90 72 96 76 M104 76 C110 72 120 72 128 76',2.4)+tinta('M100 86 C96 98 94 104 100 106',2)+
     pth('M80 110 C90 104 110 104 120 110 C112 114 88 114 80 110Z','url(#cm-h3)',T,2)+tinta('M90 117 H110',2.2);
  s+='</g><circle cx="100" cy="100" r="92" fill="none" stroke="'+T+'" stroke-width="3.4"/>';
  return s;
}};

I['vento']={fundo:'petroleo',nome:'Vento: sinal de Enlil',art(u){
  return pth('M20 70 H120 C150 70 150 36 124 36 C112 36 104 44 106 52','none',T,6)+pth('M20 104 H150 C182 104 182 66 156 66','none',T,6)+
    pth('M20 138 H100 C132 138 132 172 108 172 C98 172 92 166 94 160','none',T,6)+pth('M44 170 H80','none',T,4)+pth('M30 40 H70','none',T,4);
}};
I['estrela8']={fundo:'amarelo',nome:'Estrela de oito pontas: sinal de Inanna',art(u){
  let d='';for(let i=0;i<16;i++){const a=i*Math.PI/8-Math.PI/2,r=i%2?34:80;d+=(i?'L':'M')+(100+Math.cos(a)*r).toFixed(1)+' '+(100+Math.sin(a)*r).toFixed(1)+' ';}
  let sd='';for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2;sd+='M100 100 L'+(100+Math.cos(a)*80).toFixed(1)+' '+(100+Math.sin(a)*80).toFixed(1);}
  return pth(d+'Z',P,T,4)+'<path d="M100 100 L100 20 L123 77Z M100 100 L157 43 L180 100Z M100 100 L180 100 L123 123Z" fill="url(#cm-h1)" opacity=".7"/>'+tinta(sd,1.4)+pth('M100 100 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0','var(--coral)',T,3);
}};

/* do desenho à cunha: espiga, traços simplificados, grupo de cunhas */
I['cunha-passos']={fundo:'coral',nome:'Do desenho da espiga ao sinal em cunha',art(u){
  const seta=y=>tinta('M100 '+y+' V'+(y+14)+' M92 '+(y+8)+' L100 '+(y+16)+' L108 '+(y+8),3);
  let s='';
  // 1: espiga desenhada
  s+='<g transform="translate(100 40)">'+tinta('M0 30 V-26',3)+['-22,-14','-12,-3','-2,8'].map(()=>'').join('');
  for(let i=0;i<5;i++){const y=-26+i*11;s+=pth('M0 '+(y+8)+' C-12 '+(y+8)+' -14 '+(y-6)+' -4 '+(y-10)+' C-2 '+(y-2)+' -2 '+(y+4)+' 0 '+(y+8)+'Z',P,T,2.2)+pth('M0 '+(y+8)+' C12 '+(y+8)+' 14 '+(y-6)+' 4 '+(y-10)+' C2 '+(y-2)+' 2 '+(y+4)+' 0 '+(y+8)+'Z',P,T,2.2);}
  s+=tinta('M0 -26 V-36 M-3 -34 L0 -44 L3 -34',2.4)+'</g>'+seta(76);
  // 2: linhas simples
  s+='<g transform="translate(100 118)">'+tinta('M0 18 V-18 M-12 -10 L0 -2 L12 -10 M-12 2 L0 10 L12 2 M-12 -22 L0 -14 L12 -22',3.2)+'</g>'+seta(142);
  // 3: cunhas
  const cunha=(x,y,k)=>'<path d="M'+x+' '+y+' h'+(10*k)+' l-'+(5*k)+' '+(9*k)+' z M'+(x+5*k)+' '+(y+7*k)+' v'+(18*k)+'" fill="'+T+'" stroke="'+T+'" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>';
  s+=pth('M40 164 H160 V198 H40Z','#ede3cc',T,2.4);
  s+=cunha(54,170,1)+cunha(68,170,1)+cunha(82,170,1)+'<path d="M100 170 l9 5 l-9 5 z M108 175 h12" fill="'+T+'" stroke="'+T+'" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>'+cunha(128,170,1)+cunha(142,170,1);
  return s;
}};

/* ---------- Egito: recortes novos ---------- */
I['nilometro']={fundo:'petroleo',nome:'Nilômetro: escada de pedra com marcas do nível da cheia',art(u){
  let s=pth('M10 150 C40 140 70 160 100 150 C130 140 160 160 190 150 V192 H10Z','#8ec3e8',T,3)+'<path d="M10 160 C40 150 70 170 100 160 C130 150 160 170 190 160" fill="none" stroke="'+T+'" stroke-width="1.5" opacity=".5"/>';
  const deg=[[28,40],[52,64],[76,88],[100,112],[124,136]];
  deg.forEach((d,i)=>{s+=pth('M'+d[0]+' '+d[1]+' H196 V'+(d[1]+24)+' H'+d[0]+'Z','#efe4cf',T,3)+'<path d="M'+(d[0])+' '+(d[1]+12)+' H196" stroke="'+T+'" stroke-width="1" opacity=".4"/>';});
  s+=pth('M10 16 H28 V160 H10Z','#efe4cf',T,3);
  [30,54,78,102,126].forEach(y=>{s+=tinta('M10 '+y+' H28',2);});
  s+=pth('M6 150 H34','none',T,3)+tinta('M44 50 l8 8 l-8 8',2.4)+tinta('M44 12 C60 4 74 20 90 12',2);
  return s;}};
I['cartucho']={fundo:'amarelo',nome:'Cartucho com hieróglifos',art(u){
  let s=pth('M44 30 H156 C180 30 180 170 156 170 H44 C20 170 20 30 44 30Z',P,T,4)+pth('M100 24 V176','none',T,0)+tinta('M170 40 V160',3);
  // falcão
  s+=pth('M54 70 C54 56 70 50 80 58 C86 62 84 72 80 74 L84 92 H60 L62 76 C56 76 54 72 54 70Z',P,T,3)+'<circle cx="68" cy="62" r="2.4" fill="'+T+'"/>'+tinta('M60 92 L56 100 M84 92 L88 100',3);
  // sol
  s+='<circle cx="118" cy="68" r="14" fill="var(--coral)" stroke="'+T+'" stroke-width="3"/><circle cx="118" cy="68" r="3.4" fill="'+T+'"/>';
  // água
  s+=tinta('M44 128 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10',3.2)+tinta('M44 146 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10',3.2);
  s+=pth('M96 108 H138','none',T,3);
  return s;}};
I['roseta']={fundo:'coral',nome:'Pedra de Roseta: três escritas na mesma laje',art(u){
  const lj='M40 190 L34 70 C34 40 60 18 100 18 C140 18 166 40 166 70 L160 190Z';
  let s='<defs>'+clip(u+'r',lj)+'</defs>'+pth(lj,'#cfcac0')+'<g clip-path="url(#'+u+'r)"><path d="M120 0 H200 V200 H120Z" fill="url(#cm-h1)" opacity=".5"/>';
  const faixas=[[26,78,'hieróglifos'],[82,128,'demótico'],[132,184,'grego']];
  faixas.forEach((f,i)=>{
    s+=tinta('M30 '+f[0]+' H170',1.8);
    for(let y=f[0]+10;y<f[1]-4;y+=11){let d='M44 '+y;for(let x=44;x<156;x+=9)d+=' l4.5 '+(i===0?-4:i===1?1:3)+' l4.5 '+(i===0?4:-1)+' ';s+=tinta(d,i===2?1.3:1.8);}
  });
  s+='</g>'+tinta('M30 76 H170 M30 130 H170',2.4)+pth(lj,'none',T,3.4)+pth('M110 20 L128 34 L116 46 L124 60','none',T,2);
  return s;}};
I['coroas']={fundo:'amarelo',nome:'Coroa branca, coroa vermelha e coroa dupla',art(u){
  const branca=(x,y,k,f)=>pth('M'+x+' '+(y+70*k)+' C'+(x-12*k)+' '+(y+60*k)+' '+(x-10*k)+' '+(y+20*k)+' '+x+' '+y+' C'+(x+10*k)+' '+(y+20*k)+' '+(x+12*k)+' '+(y+60*k)+' '+x+' '+(y+70*k)+'Z',f||P,T,3)+pth('M'+x+' '+y+' m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',f||P,T,2.4);
  const verm=(x,y,k)=>pth('M'+(x-22*k)+' '+(y+70*k)+' L'+(x-16*k)+' '+(y+30*k)+' L'+(x+6*k)+' '+(y+30*k)+' L'+(x+4*k)+' '+y+' L'+(x+10*k)+' '+y+' L'+(x+24*k)+' '+(y+70*k)+'Z','var(--coral)',T,3)+tinta('M'+(x+10*k)+' '+(y+4)+' C'+(x+34*k)+' '+(y-10*k)+' '+(x+36*k)+' '+(y+10*k)+' '+(x+24*k)+' '+(y+16*k),2.6);
  let s=branca(40,48,1.5)+tinta('M20 156 H60',1)+verm(112,50,1.4)+'<g transform="translate(0 0)">'+pth('M24 190 H176','none',T,3)+'</g>';
  // dupla: vermelha com branca por dentro
  s+=verm(158,118,.8).replace('var(--coral)','var(--coral)')+branca(150,100,.6);
  return s+pth('M12 184 H188','none',T,3);}};
I['aton']={fundo:false,nome:'Disco solar de Aton, com raios que terminam em mãos',art(u){
  let s='';
  for(let i=0;i<14;i++){const a=i*Math.PI/7,c=Math.cos(a),n=Math.sin(a),x1=100+c*34,y1=100+n*34,x2=100+c*70,y2=100+n*70;
    s+=pth('M'+x1.toFixed(1)+' '+y1.toFixed(1)+' L'+x2.toFixed(1)+' '+y2.toFixed(1),'none',T,4.4);
    const g=a*180/Math.PI;
    // mão: palma e três dedos, apontando para fora
    s+='<g transform="translate('+x2.toFixed(1)+' '+y2.toFixed(1)+') rotate('+g.toFixed(1)+')">'+pth('M0 -6 C8 -7 11 -5 11 0 C11 5 8 7 0 6Z',P,T,2.4)+tinta('M9 -3 L19 -6 M10 0 L21 0 M9 3 L19 6',2.2)+'</g>';}
  return s+'<circle cx="100" cy="100" r="36" fill="var(--amarelo)" stroke="'+T+'" stroke-width="4.5"/><circle cx="100" cy="100" r="22" fill="#ffe27a" stroke="'+T+'" stroke-width="2"/>';}};
I['sol']={fundo:'amarelo',nome:'Disco solar: Shamash, deus do Sol e da justiça',art(u){
  let s='';for(let i=0;i<8;i++){const a=i*Math.PI/4;s+=pth('M'+(100+Math.cos(a)*44).toFixed(1)+' '+(100+Math.sin(a)*44).toFixed(1)+' L'+(100+Math.cos(a)*84).toFixed(1)+' '+(100+Math.sin(a)*84).toFixed(1),'none',T,5);}
  for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8,d='M100 100';let w='M'+(100+Math.cos(a)*42).toFixed(1)+' '+(100+Math.sin(a)*42).toFixed(1);for(let k=1;k<=4;k++){const r=42+k*9,o=k%2?5:-5;w+=' L'+(100+Math.cos(a)*r-Math.sin(a)*o).toFixed(1)+' '+(100+Math.sin(a)*r+Math.cos(a)*o).toFixed(1);}s+=tinta(w,3);}
  return s+pth('M100 100 m-34 0 a34 34 0 1 0 68 0 a34 34 0 1 0 -68 0',P,T,4.4)+'<circle cx="100" cy="100" r="16" fill="var(--coral)" stroke="'+T+'" stroke-width="3"/>';}};
I['mumia']={fundo:'petroleo',nome:'Mumificação em três quadros: órgãos em vasos, corpo no natrão, faixas de linho',art(u){
  let s='';
  const q=(x)=>pth('M'+x+' 24 H'+(x+58)+' V176 H'+x+'Z',P,T,3);
  s+=q(8)+q(71)+q(134);
  // vasos
  [[22,60],[22,100],[22,140]].forEach(a=>{});
  [[36,52],[36,98],[36,144]].forEach((a,i)=>{s+=pth('M'+(a[0]-14)+' '+(a[1]+22)+' C'+(a[0]-16)+' '+(a[1]-6)+' '+(a[0]+16)+' '+(a[1]-6)+' '+(a[0]+14)+' '+(a[1]+22)+'Z',i%2?'#e9ddc2':P,T,2.6)+pth('M'+(a[0]-10)+' '+(a[1]-2)+' H'+(a[0]+10)+' L'+(a[0]+8)+' '+(a[1]-12)+' H'+(a[0]-8)+'Z',P,T,2.4);});
  // corpo no natrão
  s+=pth('M78 120 H122 V150 H78Z','url(#cm-h2)',T,2.6)+pth('M80 100 C80 88 120 88 120 100 L118 120 H82Z',P,T,2.6)+'<circle cx="100" cy="84" r="9" fill="'+P+'" stroke="'+T+'" stroke-width="2.6"/>';
  // faixas
  s+=pth('M154 60 C150 40 170 40 166 60 L170 150 H150Z',P,T,2.6);
  for(let y=68;y<150;y+=9)s+=tinta('M152 '+y+' L168 '+(y-6),1.6);
  s+=tinta('M30 24 V176 M0 0',0)+'';
  return s;}};
I['narmer']={fundo:'coral',nome:'Paleta de Narmer, desenhada em traço',art(u){
  const pal='M62 190 C62 150 40 140 40 110 C40 90 56 84 60 70 C52 56 56 30 74 26 C80 18 120 18 126 26 C144 30 148 56 140 70 C144 84 160 90 160 110 C160 140 138 150 138 190Z';
  let s='<defs>'+clip(u+'p',pal)+'</defs>'+pth(pal,'#b9b4a6')+'<g clip-path="url(#'+u+'p)"><path d="M104 0 H200 V200 H104Z" fill="url(#cm-h1)" opacity=".5"/>';
  // rei com coroa branca, golpeando
  s+=pth('M96 62 C88 46 100 44 98 60 L102 90 H92Z',P,T,2.4)+pth('M86 90 H108 L112 140 H84Z',P,T,2.4)+tinta('M108 98 L126 78 M126 78 l6 -10',2.8)+tinta('M90 140 L86 170 M104 140 L110 170',2.8)+
     pth('M60 150 H76 L74 176 H62Z',P,T,2.4)+tinta('M64 126 C70 120 78 120 82 126',2);
  s+='</g>'+tinta('M70 40 H130 M70 56 H130',0)+pth(pal,'none',T,3.4)+pth('M82 30 a18 8 0 0 0 36 0','none',T,2.4)+'<circle cx="100" cy="44" r="10" fill="none" stroke="'+T+'" stroke-width="2.4"/>';
  return s;}};
function perfil(u,tipo){
  let s='<circle cx="100" cy="100" r="92" fill="'+P+'" stroke="'+T+'" stroke-width="3"/><defs>'+clip(u+'c','M100 100 m-92 0 a92 92 0 1 0 184 0 a92 92 0 1 0 -184 0')+'</defs><g clip-path="url(#'+u+'c)"><rect width="200" height="200" fill="url(#cm-hh)" opacity=".5"/>';
  s+=pth('M20 200 C26 168 60 156 100 156 C140 156 176 168 180 200Z',P,T,3);
  if(tipo==='hat'){ // nemes e barba postiça
    s+=pth('M58 70 C58 34 82 24 104 24 C128 24 144 44 142 74 L156 160 H128 L122 112 L74 112 L66 160 H44 L58 74Z','var(--amarelo)',T,3)+tinta('M64 70 H140 M60 90 H142 M58 110 H138',0);
    for(let y=34;y<156;y+=9)s+='<path d="M'+(52+y*0.06)+' '+y+' H'+(150-y*0.06)+'" stroke="'+T+'" stroke-width="1.2" opacity=".35"/>';
  }
  s+=pth('M74 54 C80 44 112 44 118 56 C122 70 120 92 114 104 C108 114 90 116 82 106 C74 96 72 70 74 54Z',P,T,3);
  if(tipo==='hat')s+=pth('M96 112 H110 L108 142 H98Z','var(--amarelo)',T,2.4)+pth('M70 50 C82 42 112 42 120 54 L120 62 C100 54 80 56 70 62Z','var(--amarelo)',T,2.4);
  else s+=pth('M66 56 C70 34 112 30 124 52 C130 66 124 92 120 108 L112 90 L108 56 L74 60 L72 100 L66 90Z','url(#cm-h3)',T,3)+pth('M72 52 H122','none',T,2.6)+'<circle cx="97" cy="48" r="5" fill="var(--coral)" stroke="'+T+'" stroke-width="2"/>';
  s+=pth('M86 78 C90 74 98 74 102 78 C98 82 90 82 86 78Z',P,T,2)+'<circle cx="94" cy="78" r="2" fill="'+T+'"/>'+tinta('M82 70 C88 66 98 66 104 70',2.2)+tinta('M118 80 L124 90 L118 94',2.2)+tinta('M96 98 C102 100 108 98 112 96',2.2);
  return s+'</g><circle cx="100" cy="100" r="92" fill="none" stroke="'+T+'" stroke-width="3.4"/>';
}
I['hatshepsut']={fundo:'amarelo',nome:'Hatshepsut, em traço',art(u){return perfil(u,'hat');}};
I['cleopatra']={fundo:'petroleo',nome:'Cleópatra VII, em traço',art(u){return perfil(u,'cle');}};

/* ---------- Tópico 4: Fenícios, hebreus e persas ---------- */
const tufo=(cx,cy,n,r)=>{let s='';for(let i=0;i<n;i++){const a=-Math.PI+i/(n-1)*Math.PI;s+=tinta('M'+cx+' '+cy+' L'+(cx+Math.cos(a)*r).toFixed(1)+' '+(cy+Math.sin(a)*r).toFixed(1),1.6);}return s;};
const elip=(cx,cy,rx,ry,f,w)=>'<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+(f||'none')+'" stroke="'+T+'" stroke-width="'+(w||1.5)+'"/>';
I['cedro']={fundo:false,nome:'Tronco de cedro cortado, com os anéis visíveis na ponta',art(u){
  const corpo='M46 70 H152 C168 70 178 82 178 100 C178 118 168 130 152 130 H46Z';
  let s='<defs>'+clip(u+'c',corpo)+'</defs>'+pth(corpo,P)+'<g clip-path="url(#'+u+'c)"><path d="M0 104 H200 V140 H0Z" fill="url(#cm-h1)" opacity=".6"/></g>';
  s+=tinta('M64 78 C90 76 118 80 168 78 M58 92 C92 90 130 94 176 92 M60 108 C94 106 136 110 176 108 M64 122 C96 120 130 124 168 122',1.5)+pth(corpo,'none',T,3.4);
  s+=pth('M46 70 C30 70 22 82 22 100 C22 118 30 130 46 130 C62 130 70 118 70 100 C70 82 62 70 46 70Z','#efe2bd',T,3.4);
  [[19,24],[14,19],[9,13],[4,7]].forEach(q=>{s+=elip(46,100,q[0]+2,q[1]+4,'none',1.4);});
  s+=tinta('M118 70 C118 52 128 40 146 32',3.2)+tufo(146,32,8,20)+tufo(128,50,6,15)+tufo(160,54,6,14);
  return s;}};
I['vidro']={fundo:false,nome:'Frasco de vidro fenício, com faixas onduladas',art(u){
  const corpo='M86 34 H114 V50 C114 62 130 70 138 92 C150 120 144 152 124 166 C112 174 88 174 76 166 C56 152 50 120 62 92 C70 70 86 62 86 50Z';
  let s='<defs>'+clip(u+'v',corpo)+'</defs>'+pth(corpo,P)+'<g clip-path="url(#'+u+'v)"><path d="M104 0 H200 V200 H104Z" fill="url(#cm-h1)" opacity=".5"/>';
  for(let k=0;k<4;k++){const y=98+k*18;s+=tinta('M40 '+y+' C60 '+(y-12)+' 74 '+(y+12)+' 95 '+y+' S130 '+(y-12)+' 160 '+y,2.2);}
  s+='</g>'+pth(corpo,'none',T,3.4)+pth('M80 34 C80 26 120 26 120 34 C120 40 80 40 80 34Z',P,T,3)+tinta('M68 110 C66 124 70 138 76 148',2.4);
  return s;}};
I['murex']={fundo:false,nome:'Concha de múrex, o molusco que dava a púrpura',art(u){
  const w1='M58 118 C56 92 76 80 100 80 C128 80 146 96 144 122 C142 142 128 154 110 156 C84 158 60 144 58 118Z';
  let s=pth('M96 150 C104 168 108 184 104 198 C92 186 80 170 74 150Z',P,T,3.2)+tinta('M92 156 L100 188 M84 154 L92 178',1.6);
  s+=pth(w1,P,T,3.4)+'<path d="M112 84 C134 90 144 108 142 128 C140 146 128 154 112 156 C124 140 128 108 112 84Z" fill="url(#cm-h1)" opacity=".6"/>';
  s+=pth('M66 78 C64 58 80 46 98 46 C118 46 130 58 128 76 C112 70 84 70 66 78Z',P,T,3.2)+pth('M76 46 C76 32 90 24 102 26 C114 28 120 38 116 48 C104 44 90 44 76 46Z',P,T,3)+pth('M88 28 C90 14 104 12 108 22 C104 24 96 26 88 28Z',P,T,2.6);
  s+=tinta('M70 112 C84 104 110 104 134 112 M68 128 C86 122 112 122 138 128 M74 66 C90 62 108 62 122 66 M82 38 C94 35 104 36 112 40',1.8);
  [[58,110],[56,124],[62,138],[68,148],[144,112],[146,128],[138,144]].forEach(q=>{const dx=q[0]<100?-9:9;s+=pth('M'+q[0]+' '+(q[1]-5)+' L'+(q[0]+dx)+' '+q[1]+' L'+q[0]+' '+(q[1]+5),P,T,2);});
  return s;}};
I['purpura']={fundo:false,nome:'Retalho de tecido tingido de púrpura',art(u){
  const pano='M26 50 C56 38 88 60 120 48 C148 38 168 48 176 54 L170 150 C142 160 112 144 82 156 C60 164 40 156 26 148Z';
  let s='<defs>'+clip(u+'p',pano)+'</defs>'+pth(pano,'#7c2a6e')+'<g clip-path="url(#'+u+'p)">'+
    '<path d="M60 40 C70 80 52 120 66 170 M104 40 C112 80 96 120 110 170 M146 40 C154 80 138 120 152 170" fill="none" stroke="#3f0f3a" stroke-width="7" stroke-opacity=".38"/>'+
    '<path d="M76 40 C86 80 68 120 82 170 M120 40 C128 80 112 120 126 170 M160 40 C166 80 150 120 164 170" fill="none" stroke="#e7b6df" stroke-width="4" stroke-opacity=".3"/></g>'+pth(pano,'none',T,3.4);
  for(let x=36;x<170;x+=9)s+=tinta('M'+x+' '+(x<90?154:158)+' l-2 12',2);
  return s;}};
const glifo=(x,y,k)=>{switch(k%6){
  case 0:return '<circle cx="'+x+'" cy="'+y+'" r="4.4" fill="none" stroke="'+T+'" stroke-width="1.8"/><circle cx="'+x+'" cy="'+y+'" r="1.2" fill="'+T+'"/>';
  case 1:return tinta('M'+(x-2.5)+' '+(y-5)+' V'+(y+5)+' M'+(x+2.5)+' '+(y-5)+' V'+(y+5),1.9);
  case 2:return tinta('M'+(x-5)+' '+(y+3)+' L'+(x-2)+' '+(y-3)+' L'+(x+1)+' '+(y+3)+' L'+(x+4)+' '+(y-3),1.9);
  case 3:return tinta('M'+(x-5)+' '+(y+3)+' A5 5 0 0 1 '+(x+5)+' '+(y+3)+' Z',1.9);
  case 4:return elip(x,y+1,4.6,2.8,'none',1.8)+'<circle cx="'+(x+4.5)+'" cy="'+(y-3)+'" r="1.8" fill="'+T+'"/>';
  default:return tinta('M'+(x-5)+' '+y+' H'+(x+5)+' M'+x+' '+(y-4)+' V'+(y+4),1.9);}};
I['estela']={fundo:'amarelo',nome:'Estela de pedra com hieróglifos ilegíveis',art(u){
  const lap='M52 190 V72 C52 38 74 16 100 16 C126 16 148 38 148 72 V190Z';
  let s='<defs>'+clip(u+'e',lap)+'</defs>'+pth(lap,P)+'<g clip-path="url(#'+u+'e)"><path d="M118 0 H200 V200 H118Z" fill="url(#cm-h1)" opacity=".5"/></g>';
  s+='<circle cx="100" cy="42" r="8" fill="none" stroke="'+T+'" stroke-width="2.4"/>'+tinta('M92 42 C82 38 72 40 64 47 M108 42 C118 38 128 40 136 47',2.4);
  const r=C.rng('merneptah');
  [68,82,96,110,140,154,168].forEach(y=>{for(let x=64;x<=136;x+=12)s+=glifo(x,y,Math.floor(r()*6));});
  s+=tinta('M66 128 C70 120 82 120 88 125',2.4)+'<circle cx="99" cy="119" r="2.6" fill="none" stroke="'+T+'" stroke-width="1.8"/>'+tinta('M99 122 V132 M95 126 H103',1.8)+'<circle cx="112" cy="119" r="2.6" fill="none" stroke="'+T+'" stroke-width="1.8"/>'+tinta('M112 122 L108 132 H116Z',1.8)+tinta('M124 118 V132 M130 118 V132 M136 118 V132',2.2);
  return s+pth(lap,'none',T,3.6);}};
I['rolo-tora']={fundo:'amarelo',nome:'Rolo da Torá aberto, com linhas de texto ilegível',art(u){
  let s='';
  [[28,'L'],[172,'R']].forEach(q=>{const x=q[0];s+=pth('M'+(x-8)+' 42 H'+(x+8)+' V160 H'+(x-8)+'Z','#cfa968',T,3)+pth('M'+(x-12)+' 34 H'+(x+12)+' V44 H'+(x-12)+'Z',P,T,3)+pth('M'+(x-12)+' 158 H'+(x+12)+' V168 H'+(x-12)+'Z',P,T,3)+'<circle cx="'+x+'" cy="26" r="8" fill="'+P+'" stroke="'+T+'" stroke-width="3"/><circle cx="'+x+'" cy="176" r="8" fill="'+P+'" stroke="'+T+'" stroke-width="3"/>'+tinta('M'+x+' 44 V158',1.6);});
  s+=pth('M36 50 H164 V152 H36Z','#f6edd0',T,3)+'<path d="M36 50 H52 V152 H36Z M148 50 H164 V152 H148Z" fill="url(#cm-h1)" opacity=".55"/>';
  const r=C.rng('tora');
  for(let y=62;y<=142;y+=11){let x=144;while(x>58){const w=7+Math.floor(r()*22);s+=tinta('M'+x+' '+y+' H'+Math.max(58,x-w),3);x-=w+7;}}
  return s;}};
I['cilindro']={fundo:'coral',nome:'Cilindro de Ciro: barril de argila coberto de cunhas',art(u){
  const corpo='M44 60 H168 V144 H44 C32 144 26 124 26 102 C26 80 32 60 44 60Z';
  let s='<defs>'+clip(u+'y',corpo)+'</defs>'+pth(corpo,'#e8d9b4')+'<g clip-path="url(#'+u+'y)"><path d="M0 112 H200 V150 H0Z" fill="url(#cm-h1)" opacity=".55"/>';
  const r=C.rng('ciro'),cu=(x,y,a)=>'<path transform="translate('+x+' '+y+') rotate('+a+')" d="M-5 -2.6 L2 0 L-5 2.6Z M2 0 H6" fill="'+T+'" stroke="'+T+'" stroke-width="1.4" stroke-linejoin="round"/>';
  for(let y=72;y<=138;y+=13)for(let x=48;x<=160;x+=13){const n=1;for(let k=0;k<n;k++)s+=cu(x+k*3,y+(k?2:0),[0,90,45,0,135][Math.floor(r()*5)]);}
  s+='</g>'+pth(corpo,'none',T,3.4)+pth('M168 60 C180 60 186 80 186 102 C186 124 180 144 168 144 C176 124 176 80 168 60Z','#d6c595',T,3.2);
  return s;}};
I['darico']={fundo:'amarelo',nome:'Dárico: moeda de ouro com o grande rei ajoelhado, de perfil, com arco e lança',art(u){
  const r=C.rng('darico');let d='';for(let a=0;a<24;a++){const t=a/24*Math.PI*2,rr=80+(r()-.5)*5;d+=(a?'L':'M')+(100+Math.cos(t)*rr).toFixed(1)+' '+(100+Math.sin(t)*rr).toFixed(1);}d+='Z';
  let s=pth(d.replace(/(\d+\.\d) (\d+\.\d)/g,(m,x,y)=>(+x+4).toFixed(1)+' '+(+y+5).toFixed(1)),'#c99a1c',T,3)+pth(d,'#f2c94c',T,4)+'<path d="'+d+'" fill="url(#cm-h1)" opacity=".3"/>';
  // rei de perfil, olhando para a esquerda, ajoelhado em corrida
  s+=pth('M54 48 C38 70 38 106 54 128',null,T,4.5)+tinta('M54 48 L54 128',1.6);               // arco na mão da frente
  s+=pth('M122 54 L104 138',null,T,3.4)+pth('M122 54 L120 46 L126 50Z',T,T,1.6);                    // lança
  s+=pth('M82 118 L66 122 L64 144 L74 146',null,T,5)+pth('M98 120 L120 130 L136 142',null,T,5);     // pernas: joelho à frente, outra ao chão
  s+=pth('M82 66 L102 64 L106 94 L86 98Z','#f6edd0',T,3.4)+pth('M86 98 L106 94 L112 118 L80 122Z','#e8dfc6',T,3.4)+tinta('M86 104 L108 100 M84 112 L110 110',1.6); // túnica
  s+=pth('M88 74 L66 84',null,T,4.5)+pth('M102 72 L116 88 L106 104',null,T,4.5);                  // braços
  s+='<ellipse cx="86" cy="52" rx="9" ry="10.5" fill="#f1d9ab" stroke="'+T+'" stroke-width="3"/>'+pth('M78 56 C76 70 86 72 90 64 C84 66 80 62 78 56Z',T,T,1.4);  // cabeça e barba
  s+=pth('M77 44 L78 32 L82 38 L86 29 L90 38 L94 32 L95 44Z','#fffbe8',T,2.6);                  // coroa de ameias
  return s;}};
I['disco-alado']={fundo:'petroleo',nome:'Símbolo alado dos relevos persas: disco com figura de meio corpo, asas em penas e cauda em leque',art(u){
  let s='';
  // asas em fileiras de penas
  [-1,1].forEach(d=>{const X=x=>100+d*x;
    [[96,86,'#fffbe8'],[107,74,P],[118,60,'#fffbe8']].forEach((q,i)=>{const y=q[0],len=q[1],f=q[2];
      s+=pth('M'+X(18)+' '+(y-7)+' H'+X(len-6)+' Q'+X(len+8)+' '+y+' '+X(len-6)+' '+(y+7)+' H'+X(18)+'Z',f,T,2.6);
      for(let k=26;k<len-6;k+=9)s+=tinta('M'+X(k)+' '+(y-6)+' V'+(y+6),1.4);});
    // fitas que caem dos lados
    s+=pth('M'+X(14)+' 116 C'+X(26)+' 130 '+X(34)+' 146 '+X(26)+' 164 L'+X(34)+' 160 L'+X(38)+' 170 C'+X(46)+' 150 '+X(34)+' 128 '+X(20)+' 112Z',P,T,2.4);});
  // cauda em leque
  s+=pth('M86 120 H114 L124 140 H76Z','#fffbe8',T,2.6)+pth('M76 140 H124 L132 158 H68Z',P,T,2.6)+pth('M68 158 H132 L138 176 H62Z','#fffbe8',T,2.6);
  for(let k=-2;k<=2;k++)s+=tinta('M'+(100+k*9)+' 122 L'+(100+k*13)+' 176',1.4);
  // disco e figura barbada saindo dele
  s+='<circle cx="100" cy="108" r="17" fill="#fffbe8" stroke="'+T+'" stroke-width="3.2"/><circle cx="100" cy="108" r="10" fill="none" stroke="'+T+'" stroke-width="2.2"/>';
  s+=pth('M86 98 L88 80 H112 L114 98Z','#fffbe8',T,2.6)+pth('M112 84 L130 70',null,T,3)+'<circle cx="133" cy="67" r="5" fill="none" stroke="'+T+'" stroke-width="2.6"/>'+pth('M88 86 L76 92',null,T,3);
  s+='<ellipse cx="100" cy="68" rx="9" ry="10" fill="#fffbe8" stroke="'+T+'" stroke-width="2.8"/>'+pth('M92 72 C92 86 108 86 108 72 C104 78 96 78 92 72Z',T,T,1.4)+pth('M91 62 L92 52 L96 57 L100 50 L104 57 L108 52 L109 62Z','#fffbe8',T,2.2);
  return s;}};
I['alef']={fundo:'coral',nome:'Letra fenícia alef, derivada da cabeça de um boi',art(u){
  let s=pth('M30 30 H170 V170 H30Z','#fbf4de',T,3.2)+'<path d="M30 30 H62 V170 H30Z" fill="url(#cm-h1)" opacity=".4"/>';
  s+='<path d="M72 36 V164 M72 98 L132 40 M72 98 L124 164 M72 56 L100 36" fill="none" stroke="'+T+'" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>';
  return s;}};

I['altar-fogo']={fundo:'coral',nome:'Altar de pedra em degraus com a chama sagrada do zoroastrismo',art(u){
  let s=pth('M44 172 H156 V156 H44Z','#d9d0bb',T,3)+pth('M56 156 H144 V136 H56Z','#e6dfcc',T,3)+pth('M70 136 H130 V112 H70Z','#d9d0bb',T,3)+pth('M62 112 H138 L130 98 H70Z','#efe9d8',T,3);
  s+=tinta('M44 164 H156 M56 146 H144 M70 124 H130',1.4)+tinta('M52 172 V156 M70 156 V136 M88 136 V112',1.2);
  s+=pth('M100 100 C84 86 88 70 96 58 C98 66 104 68 104 76 C112 66 110 54 104 44 C124 58 128 84 114 98 C110 102 106 102 100 100Z','#e8573a',T,3);
  s+=pth('M100 100 C92 92 94 82 100 74 C106 82 108 92 100 100Z','#fbd24d',T,2.2);
  return s;}};
I['rolo-colunas']={fundo:'amarelo',nome:'Rolo de couro com o texto em colunas estreitas',art(u){
  let s=pth('M40 50 H160 V150 H40Z','#f1e4c1',T,3)+'<path d="M40 50 H56 V150 H40Z" fill="url(#cm-h1)" opacity=".5"/>';
  [[22,'L'],[178,'R']].forEach(q=>{const x=q[0];s+=pth('M'+(x-14)+' 42 H'+(x+14)+' V158 H'+(x-14)+'Z','#d8b878',T,3)+'<ellipse cx="'+x+'" cy="42" rx="14" ry="6" fill="#efe2bd" stroke="'+T+'" stroke-width="3"/>'+'<ellipse cx="'+x+'" cy="158" rx="14" ry="6" fill="#c9a460" stroke="'+T+'" stroke-width="3"/>'+tinta('M'+(x-5)+' 50 V150',1.4);});
  const r=C.rng('rolo');
  [[132,150],[100,128],[68,96]].forEach(c=>{for(let y=62;y<=140;y+=9){const w=8+Math.floor(r()*20);s+=tinta('M'+(c[0]-2)+' '+y+' H'+Math.max(c[1]-30,c[0]-w-2),2.6);}});
  s+=tinta('M118 56 V146 M86 56 V146',1.2);
  return s;}};
C.ICONES=Object.keys(I);

/* papel colorido rasgado atrás do recorte */
function fundo(cor,seed){
  const r=C.rng('fundo'+seed),pts=[];
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2,k=84+(r()-.5)*7;pts.push([104+Math.cos(a)*k,106+Math.sin(a)*k]);}
  return '<path d="'+C.suave(pts,true)+'" fill="'+C.cor(cor)+'" filter="url(#cm-rasga)"/>';
}
/* svg completo de um recorte: fundo de papel colorido, margem branca de recorte com sombra e a gravura */
C.icone=function(nome,o){
  o=o||{};const ic=I[nome];if(!ic)throw new Error('Recorte desconhecido: '+nome+'. Disponíveis: '+C.ICONES.join(', '));
  defs();const u='ic'+(seq++)+'-',art=ic.art(u),fd=o.fundo===false?'':fundo(o.fundo||ic.fundo,nome);
  return '<svg viewBox="-14 -14 228 228" role="img" aria-label="'+esc(o.rotulo||ic.nome)+'">'+fd+
    '<g filter="url(#cm-sombra)"><g class="cm-sil">'+ic.art('s'+u)+'</g></g>'+art+'</svg>';
};

C.tipos.icone=p=>({cls:'cm-icone',html:C.icone(p.nome,{fundo:p.fundo,rotulo:p.legenda||p.rotulo})+(p.legenda?'<span class="cm-legenda">'+esc(p.legenda)+'</span>':'')});

/* pirâmide social: camadas do topo para a base; data-item permite realce por etapa */
C.tipos.piramide=p=>{
  const cs=p.camadas||[],n=cs.length,W=600,Hc=p.alturaCamada||84,H=n*Hc+8;
  let s='';
  cs.forEach((c,i)=>{
    const y0=4+i*Hc,y1=y0+Hc-6,lw=k=>W*(.3+.66*k/n),w0=i===0?W*.14:lw(i),w1=lw(i+1),cx=W/2;
    const d='M'+(cx-w0/2)+' '+y0+' L'+(cx+w0/2)+' '+y0+' L'+(cx+w1/2)+' '+y1+' L'+(cx-w1/2)+' '+y1+' Z';
    const sd='M'+(cx+w0/2-22)+' '+y0+' L'+(cx+w0/2)+' '+y0+' L'+(cx+w1/2)+' '+y1+' L'+(cx+w1/2-26)+' '+y1+' Z';
    const ty=y0+(c.s?32:Hc/2+4);
    s+='<g class="cam" data-item="'+i+'" style="--i:'+(n-1-i)+'"><path class="faixa" d="'+d+'"/><path class="somb" d="'+sd+'"/>'+
      '<text x="'+cx+'" y="'+ty+'" text-anchor="middle">'+esc(c.t)+'</text>'+(c.s?'<text class="s" x="'+cx+'" y="'+(ty+22)+'" text-anchor="middle">'+esc(c.s)+'</text>':'')+'</g>';
  });
  return {cls:'cm-piramide',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Pirâmide social: '+cs.map(c=>c.t).join(', '))+'">'+s+'</svg>'};
};

C.tipos.comparacao=p=>{
  const col=(c,k)=>'<div style="--cor:'+C.cor(c.cor||(k?'coral':'amarelo'))+'"><h4>'+esc(c.titulo)+'</h4><ul>'+(c.itens||[]).map((t,j)=>'<li data-item="'+(k*100+j)+'">'+esc(t)+'</li>').join('')+'</ul></div>';
  return {cls:'cm-esq rasgado',style:'--clip:'+C.rasgo(p.id,1.2),html:(p.titulo?'<h3>'+esc(p.titulo)+'</h3>':'')+'<div class="cm-comp">'+col(p.a,0)+col(p.b,1)+'</div>'};
};

C.tipos.tabela=p=>({cls:'cm-esq cm-tab rasgado',style:'--clip:'+C.rasgo(p.id,1.2),html:(p.titulo?'<h3>'+esc(p.titulo)+'</h3>':'')+
  '<table><thead><tr>'+(p.colunas||[]).map(c=>'<th scope="col">'+esc(c)+'</th>').join('')+'</tr></thead><tbody>'+
  (p.linhas||[]).map((l,i)=>'<tr data-item="'+i+'">'+l.map(c=>'<td>'+esc(c)+'</td>').join('')+'</tr>').join('')+'</tbody></table>'});

/* ---------- Pré-História: peças novas ---------- */
/* mão que aponta e mamute em recorte sem papel colorido por baixo */
C.tipos.mao=p=>({cls:'cm-icone',html:C.icone('mao',{fundo:false,rotulo:p.rotulo})});
C.tipos.mamute=p=>({cls:'cm-icone cm-desbota',html:C.icone('mamute',{fundo:false,rotulo:p.rotulo})});

/* etiqueta de papel branco presa por fita (use h para os traços acharem o centro) */
C.tipos.etiqueta=p=>({cls:'cm-etq',html:'<span class="cm-fita" style="--fx:'+(p.fita!=null?p.fita:12)+'%;--fg:-5deg"></span><span>'+esc(p.texto)+'</span>'});

/* nota amarela com ícone em traço: pé, lança, cérebro, balão de fala */
const HIC={
  pe:'<g transform="translate(32 33) scale(.6)" fill="none" stroke="'+T+'" stroke-width="4.2" stroke-linejoin="round"><path d="'+PEPATH+'"/>'+PEDEDOS.map(d=>'<circle cx="'+d[0]+'" cy="'+d[1]+'" r="'+d[2]+'"/>').join('')+'</g>',
  lanca:'<g transform="rotate(-42 32 32)" fill="none" stroke="'+T+'" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M32 60 V22"/><path d="M32 3 C39 11 41 18 32 25 C23 18 25 11 32 3Z" fill="'+P+'"/><path d="M27 29 H37 M27 34 H37"/></g>',
  cerebro:'<g fill="none" stroke="'+T+'" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 46 C8 44 6 31 12 26 C8 17 17 8 26 11 C30 4 41 4 45 11 C54 9 60 19 53 26 C60 32 56 45 45 46 C42 53 28 53 20 46Z"/><path d="M32 12 V46"/><path d="M18 27 C25 24 28 31 32 29"/><path d="M47 27 C39 24 36 33 32 31"/><path d="M21 39 C28 36 30 41 32 39"/><path d="M44 39 C37 36 34 41 32 39"/></g>',
  fala:'<g fill="none" stroke="'+T+'" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 10 H56 V40 H31 L19 53 V40 H8Z" fill="'+P+'"/><path d="M17 20 H47 M17 29 H38"/></g>'
};
C.tipos.hipotese=p=>({cls:'cm-hip',html:'<span class="cm-fita" style="--fx:38%;--fg:-3deg"></span><svg viewBox="0 0 64 64" aria-hidden="true">'+(HIC[p.icone]||'')+'</svg><b>'+esc(p.texto)+'</b>'});

/* foto P&B com manchas de cor (cópia colorida da mesma figura, com máscara): fogueira, mão em ocre */
C.tipos.fotomanchas=p=>{
  const r=C.tipos.foto(p),src=(window.LAB_IMG||{})[p.img]||'';
  const ms=(p.manchas||[]).map(m=>'<div class="mancha'+(m.pulsa?' pulsa':'')+'" data-et="'+m.et+'" style="--x:'+m.x+'%;--y:'+m.y+'%;--rx:'+m.w+'%;--ry:'+m.h+'%"><img alt="" src="'+src+'"></div>').join('');
  r.html=r.html.replace('></div>','>'+ms+'</div>');return r;
};

/* fita do tempo da Pré-História: régua quebrada (a escala pula) e régua ampliada com os marcos de datas */
C.tipos.fita=p=>{
  const ac=(x,y,t,o)=>'<text x="'+x+'" y="'+y+'"'+(o||'')+'>'+esc(t)+'</text>';
  const mk=(et,corpo)=>'<g class="mk" data-et="'+et+'">'+corpo+'</g>';
  let s='<svg viewBox="0 0 1160 380" role="img" aria-label="'+esc(p.rotulo||'Fita do tempo da Pré-História')+'">';
  s+='<defs><filter id="ft-s" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity=".28"/></filter></defs>';
  // faixas: Paleolítico (quase toda a fita), rasgo, Mesolítico, Neolítico, Metais
  s+='<g filter="url(#ft-s)"><path d="M8 70 H850 L860 84 L852 98 L862 112 L854 126 L862 140 L852 154 L860 170 H8Z" fill="#eadfc3" stroke="'+T+'" stroke-width="3"/>'+
    '<path d="M8 70 H850 L860 84 L852 98 L862 112 L854 126 L862 140 L852 154 L860 170 H8Z" fill="url(#cm-hh)" opacity=".7"/>'+
    '<path d="M902 70 H986 V170 H902 L910 154 L902 140 L910 126 L902 112 L910 98 L902 84Z" fill="#f2d28f" stroke="'+T+'" stroke-width="3"/>'+
    '<path d="M992 70 H1074 V170 H992Z" fill="#eab48a" stroke="'+T+'" stroke-width="3"/>'+
    '<path d="M1080 70 H1156 V170 H1080Z" fill="#c4d6d9" stroke="'+T+'" stroke-width="3"/></g>';
  s+='<text class="gr" x="430" y="124" text-anchor="middle">Paleolítico</text>'+ac(430,152,'pedra lascada, caça e coleta',' text-anchor="middle" class="m"')+
    ac(944,118,'Mesolítico',' text-anchor="middle" class="b"')+ac(944,138,'transição',' text-anchor="middle" class="m"')+
    ac(1033,118,'Neolítico',' text-anchor="middle" class="b"')+ac(1033,138,'pedra polida',' text-anchor="middle" class="m"')+
    ac(1118,112,'Idade dos',' text-anchor="middle" class="b"')+ac(1118,130,'Metais',' text-anchor="middle" class="b"');
  [[16,78],[16,162],[1146,78],[1146,162],[996,78],[906,162]].forEach(q=>{s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="5.5" fill="var(--seta)" stroke="'+T+'" stroke-width="2"/>';});
  // marcos da régua quebrada
  s+=mk('0,3','<path d="M8 58 V70" stroke="'+T+'" stroke-width="3"/>'+ac(8,46,'mais de 2,5 milhões de anos atrás',' class="b g"'))+
    mk('1','<path d="M757 58 V170" stroke="'+T+'" stroke-width="2.5" stroke-dasharray="6 5"/><circle cx="757" cy="70" r="8" fill="var(--amarelo)" stroke="'+T+'" stroke-width="2.5"/>'+ac(790,32,'Homo sapiens,',' text-anchor="end" class="b g"')+ac(790,52,'cerca de 300 mil anos',' text-anchor="end" class="b g"'))+
    mk('0,8','<path d="M1156 56 V70" stroke="'+T+'" stroke-width="3"/>'+ac(1156,40,'cerca de 3200 a.C.',' text-anchor="end" class="b g"'))+
    ac(880,62,'aqui a régua pula',' text-anchor="middle" class="i"');
  // lupa
  s+='<rect x="896" y="62" width="266" height="116" rx="6" fill="none" stroke="var(--seta)" stroke-width="3" stroke-dasharray="9 7"/>'+
    '<path d="M896 178 L500 252 M1162 178 L1160 252" stroke="var(--seta)" stroke-width="3" stroke-dasharray="9 7" fill="none"/>';
  s+='<g filter="url(#ft-s)"><rect x="500" y="252" width="660" height="118" fill="#fffdf6" stroke="'+T+'" stroke-width="3"/></g>'+ac(516,276,'régua ampliada: aqui o tempo não está em escala',' class="i"')+
    '<path d="M520 318 H1140" stroke="'+T+'" stroke-opacity=".4" stroke-width="2.5" stroke-dasharray="7 6"/>';
  [[0,'6','fim da glaciação','cerca de','10 000 a.C.'],[1,'7','agricultura','cerca de','9500 a.C.'],[2,'0,8','escrita','cerca de','3200 a.C.'],[3,'8','bronze','cerca de','3000 a.C.'],[4,'8','ferro','cerca de','1200 a.C.']].forEach(([i,et,sub,l1,l2])=>{
    const x=566+i*132;
    s+=mk(et,ac(x,300,sub,' text-anchor="middle" class="m"')+'<circle cx="'+x+'" cy="318" r="9" stroke="'+T+'" stroke-width="2.5"/>'+ac(x,342,l1,' text-anchor="middle" class="b"')+ac(x,360,l2,' text-anchor="middle" class="b"'));
  });
  [[508,260],[1152,260]].forEach(q=>{s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="5.5" fill="var(--seta)" stroke="'+T+'" stroke-width="2"/>';});
  return {cls:'cm-fita2',html:s+'</svg>'};
};


/* Mesopotâmia: esquema do tributo. Aldeias embaixo, templo e palácio no alto; sacos de cevada sobem, rações descem, bonecos sobem (dias de trabalho) */
C.tipos.tributo=p=>{
  const W=900,H=640;let s='<defs><pattern id="cm-quad" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#6d8aa6" stroke-width="1" opacity=".35"/></pattern></defs><rect width="'+W+'" height="'+H+'" fill="#fbf9f1"/><rect width="'+W+'" height="'+H+'" fill="url(#cm-quad)"/>';
  const traco=(d,w)=>'<path d="'+d+'" fill="none" stroke="'+T+'" stroke-width="'+(w||3)+'" stroke-linecap="round" stroke-linejoin="round"/>';
  const casa=(x,y)=>traco('M'+x+' '+(y+34)+' V'+(y+10)+' L'+(x+22)+' '+y+' L'+(x+44)+' '+(y+10)+' V'+(y+34)+' Z M'+(x+16)+' '+(y+34)+' V'+(y+20)+' H'+(x+28)+' V'+(y+34),3);
  // templo e palácio no alto
  s+='<g transform="translate(250 28)">'+traco('M0 100 H130 M10 100 V74 H120 V100 M24 74 V48 H106 V74 M44 48 V24 H86 V48 M52 24 V12 H78 V24',3.4)+'<path d="M10 100 H120 V74 H10Z" fill="url(#cm-h1)" opacity=".5"/></g>';
  s+='<g transform="translate(470 56)">'+traco('M0 72 H150 M6 72 V32 H144 V72 M0 32 H150 M24 32 V12 M54 32 V12 M84 32 V12 M114 32 V12 M144 32 V12 M26 72 V50 H44 V72 M60 50 H90 V62 H60Z',3.4)+'</g>';
  s+='<text x="315" y="162" text-anchor="middle" class="cm-tx">templo</text><text x="545" y="162" text-anchor="middle" class="cm-tx">palácio</text>';
  // aldeias
  for(let i=0;i<5;i++){const x=70+i*165;s+=casa(x,480)+casa(x+26,498);}
  s+='<text x="450" y="600" text-anchor="middle" class="cm-tx">aldeias de camponeses</text>';
  // sacos de cevada subindo (setas tracejadas) 
  const sacos=[[120,0],[330,1],[560,2],[780,3]];
  const arrows=[['M130 470 C150 380 240 250 300 190',0],['M355 470 C355 400 370 280 380 190',1],['M590 470 C590 400 540 300 520 190',2],['M790 470 C780 380 650 260 590 190',3]];
  arrows.forEach(a=>{s+='<path d="'+a[0]+'" fill="none" stroke="'+T+'" stroke-width="3.4" stroke-dasharray="3 12" stroke-linecap="round"/>';});
  const saco=(x,y)=>'<g transform="translate('+x+' '+y+')"><path d="M0 -14 C-22 -12 -26 18 -14 26 H14 C26 18 22 -12 0 -14Z" fill="#efe0b0" stroke="'+T+'" stroke-width="3"/><path d="M-6 -14 L0 -22 L6 -14" fill="none" stroke="'+T+'" stroke-width="3"/><path d="M-6 6 C-2 0 2 0 6 6" fill="none" stroke="'+T+'" stroke-width="2"/></g>';
  s+=saco(215,350)+saco(372,360)+saco(552,350)+saco(700,370);
  s+='<text x="76" y="330" class="cm-tx" font-weight="700">cevada</text>';
  // rações: seta fina de volta
  s+='<path d="M430 210 C470 270 470 380 440 440" fill="none" stroke="'+T+'" stroke-width="2" stroke-dasharray="8 8"/><path d="M432 430 L440 444 L452 432" fill="none" stroke="'+T+'" stroke-width="2"/>';
  s+='<text x="486" y="300" class="cm-tx">rações</text>';
  // bonecos: dias de trabalho
  const bon=(x,y)=>'<g transform="translate('+x+' '+y+')" fill="none" stroke="'+T+'" stroke-width="3" stroke-linecap="round"><circle cx="0" cy="-12" r="7" fill="#fbf9f1"/><path d="M0 -5 V14 M-9 4 H9 M0 14 L-7 28 M0 14 L7 28"/></g>';
  s+=bon(262,370)+bon(300,330)+bon(640,330)+bon(680,300)+bon(720,270);
  s+='<text x="880" y="430" text-anchor="end" class="cm-tx" font-weight="700">dias de trabalho</text>';
  return {cls:'cm-esq cm-tributo',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Esquema: aldeias entregam cevada e dias de trabalho ao templo e ao palácio, que devolvem rações')+'"><style>.cm-tx{font:600 36px "Caveat","Segoe Print",cursive;fill:'+T+'}</style>'+s+'</svg>'};
};

/* Egito e Kush: esquema do Nilo (do delta a Meroé), com cataratas numeradas e manchas que entram por etapa (data-et) */
C.tipos.nilosul=p=>{
  const W=520,H=900,et=p.etapa!=null?p.etapa:8;
  const rio='M300 70 C300 150 320 260 330 330 S350 420 350 440 S330 540 300 580 S230 600 240 640 S300 720 330 790 L340 860';
  let s='<style>.cm-nilosul .ev{opacity:0;transition:opacity .9s}.cm-nilosul .ev.on{opacity:1}.cm-nilosul .ev.d1.on{transition-delay:1s}.cm-nilosul .ev.d2.on{transition-delay:3s}'+
    '.cm-nilosul .nv.on{opacity:0;animation:cm-nv 7s 3s ease-in-out forwards}@keyframes cm-nv{0%{opacity:0}18%{opacity:.85}62%{opacity:.85}100%{opacity:0}}'+
    '.cm-nilosul .pe.on{transition-delay:8s}.cm-nilosul text{font:700 24px var(--sans,sans-serif);fill:'+T+'}.cm-nilosul text.p{font-size:26px;font-weight:600}'+
    '@media (prefers-reduced-motion:reduce){.cm-nilosul .ev,.cm-nilosul .ev.on{transition:none!important}.cm-nilosul .nv.on{animation:none;opacity:.85}}</style>';
  s+='<rect width="'+W+'" height="'+H+'" fill="#f6efdc"/><rect width="'+W+'" height="'+H+'" fill="url(#cm-hh)" opacity=".35"/>';
  const E='data-et="'+et+'"';
  // manchas
  s+='<path class="ev d1" '+E+' d="M250 560 L370 560 L400 640 L380 860 L270 880 L220 700Z" fill="#b0793a" fill-opacity=".8"/><path class="ev d1" '+E+' d="M250 560 L370 560 L400 640 L380 860 L270 880 L220 700Z" fill="url(#cm-h1)"/>';
  s+='<path class="ev nv" '+E+' d="M250 50 L370 50 L400 330 L400 560 L270 560 L250 330Z" fill="#b0793a" fill-opacity=".85"/><path class="ev nv" '+E+' d="M250 50 L370 50 L400 330 L400 560 L270 560 L250 330Z" fill="url(#cm-h1)"/>';
  s+='<path class="ev pe" '+E+' d="M20 30 L520 30 L520 470 L20 470Z" fill="#1fa39a" fill-opacity=".6"/>';
  // rio e delta
  s+='<path d="M300 70 L246 30 M300 70 L300 24 M300 70 L356 30" fill="none" stroke="#2f77b5" stroke-width="7" stroke-linecap="round"/><path d="'+rio+'" fill="none" stroke="#2f77b5" stroke-width="9" stroke-linecap="round"/>';
  // cataratas
  [[350,452],[342,520],[298,592],[246,656],[292,732],[330,826]].forEach((c,i)=>{s+='<path d="M'+(c[0]-18)+' '+c[1]+' h36" stroke="'+T+'" stroke-width="5" stroke-linecap="round"/><circle cx="'+(c[0]+44)+'" cy="'+(c[1]-2)+'" r="17" fill="#fff" stroke="'+T+'" stroke-width="2.6"/><text class="p" x="'+(c[0]+44)+'" y="'+(c[1]+8)+'" text-anchor="middle">'+(i+1)+'</text>';});
  // cidades
  const cid=(x,y,t,lado)=>'<circle cx="'+x+'" cy="'+y+'" r="9" fill="'+T+'" stroke="#fff" stroke-width="3"/><text x="'+(lado==='e'?x-18:x+18)+'" y="'+(y+8)+'" text-anchor="'+(lado==='e'?'end':'start')+'">'+t+'</text>';
  s+=cid(300,120,'Gizé','e')+cid(330,330,'Tebas','d')+cid(350,438,'Assuã','d').replace('x="368"','x="400"')+cid(240,640,'Napata','e')+cid(330,790,'Meroé','d');
  // pirâmides
  [[300,150],[218,672],[354,822]].forEach((a,i)=>{s+='<path class="ev d1" '+E+' d="M'+(a[0]-18)+' '+a[1]+' L'+a[0]+' '+(a[1]-26)+' L'+(a[0]+18)+' '+a[1]+'Z" fill="'+P+'" stroke="'+T+'" stroke-width="3"/>';});
  // rótulos
  s+='<text x="40" y="200">Egito</text><text x="60" y="720" class="ev d1" '+E+' style="font-size:30px">Kush</text><text x="400" y="600" class="p ev nv" '+E+'>728 a.C.</text><text x="40" y="410" class="p ev pe" '+E+'>persas, 525 a.C.</text>';
  return {cls:'cm-esq cm-nilosul',html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Esquema do Nilo, do delta a Meroé, com as cataratas numeradas e o reino de Kush')+'">'+s+'</svg>'};
};

/* Fenícios: moeda que gira uma vez ao entrar */
C.tipos.darico=p=>{let h=C.icone('darico',{fundo:p.fundo,rotulo:p.rotulo});if(p.giraEm)h=h.replace('<svg','<svg style="animation-delay:'+p.giraEm+'ms"');return {cls:'cm-icone cm-gira',html:h};};

/* Fenícios: do alef ao alfa e ao A, e uma linha de consoantes sem vogais (esquema desenhado em código) */
C.tipos.alfabeto=p=>{
  const W=900,H=600,sans='var(--sans,sans-serif)',serif='var(--serif,Georgia,serif)';
  const tx=(x,y,t,sz,w,fam,anc)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+(anc||'middle')+'" style="font:'+(w||700)+' '+sz+'px '+(fam||sans)+';fill:'+T+'">'+esc(t)+'</text>';
  let s='';
  const card=(x,rot,tit,leg)=>'<g transform="translate('+x+' 24) rotate('+rot+' 120 150)"><rect width="240" height="300" fill="#fffdf6" stroke="'+T+'" stroke-width="3"/><rect width="240" height="46" fill="#f2d28f" stroke="'+T+'" stroke-width="3"/>'+tx(120,35,tit,34)+
    '<rect y="254" width="240" height="46" fill="#eee6cf" stroke="'+T+'" stroke-width="3"/>'+tx(120,289,leg,34,600)+'</g>';
  s+=card(30,-1.5,'fenício','alef: boi')+card(330,1,'grego','alfa')+card(630,-1,'latino','A');
  s+='<g transform="translate(30 24) rotate(-1.5 120 150)"><path d="M72 84 V226 M72 160 L156 80 M72 160 L148 226 M72 104 L112 78" fill="none" stroke="'+T+'" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/></g>';
  s+='<g transform="translate(330 24) rotate(1 120 150)">'+tx(120,200,'Α α',130,400,serif)+'</g>';
  s+='<g transform="translate(630 24) rotate(-1 120 150)">'+tx(120,214,'A',180,400,sans)+'</g>';
  const seta=(x0,x1)=>'<path d="M'+x0+' 170 C'+(x0+14)+' 132 '+(x1-14)+' 132 '+(x1-6)+' 166" fill="none" stroke="var(--seta)" stroke-width="6" stroke-linecap="round" stroke-dasharray="14 9"/><path d="M'+(x1-26)+' 160 L'+(x1-4)+' 170 L'+(x1-10)+' 146" fill="none" stroke="var(--seta)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>';
  s+=seta(276,326)+seta(576,626);
  // linha fenícia: só consoantes, escrita da direita para a esquerda (alef, bet, gimel, dalet, he)
  s+='<rect x="30" y="364" width="840" height="206" fill="#fffdf6" stroke="'+T+'" stroke-width="3"/><rect x="30" y="364" width="840" height="44" fill="#eadfc3" stroke="'+T+'" stroke-width="3"/>'+tx(450,395,'só consoantes, da direita para a esquerda',34);
  const gl=[[770,'M18 -32 V32 M18 -2 L-20 -30 M18 -2 L-14 30 M4 -18 L-4 -34'],[590,'M16 30 V-30 H-14 Q-24 -30 -24 -16 Q-24 -2 -14 -2 H16'],[410,'M14 30 L18 -28 L-18 -24'],[230,'M18 -30 L-20 0 L18 30Z M18 -30 L26 -36']];
  gl.forEach((g,i)=>{s+='<g transform="translate('+g[0]+' 474)"><path d="'+g[1]+'" fill="none" stroke="'+T+'" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></g>';if(i<gl.length-1)s+='<rect x="'+(g[0]-106)+'" y="456" width="32" height="34" rx="4" fill="none" stroke="var(--seta)" stroke-width="3" stroke-dasharray="5 5"/>';});
  s+=tx(450,550,'quadrinhos tracejados: vogais não escritas',34,400,sans);
  return {cls:'cm-esq cm-alfabeto',style:'--clip:'+C.rasgo(p.id,1.2),html:'<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(p.rotulo||'Da letra fenícia alef ao alfa grego e ao A latino, e uma linha fenícia só com consoantes')+'">'+s+'</svg>'};
};
})();
