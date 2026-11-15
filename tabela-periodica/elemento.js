// Builds an element page. Each page in /elementos sets <body data-z="N">.
(()=>{
const Z=+document.body.dataset.z, e=ELS[Z-1], cat=CATS[e.c], C=cat.c;
const prev=ELS[Z-2], next=ELS[Z];
const SHELL='KLMNOPQ';
// A = número de massa: isótopo natural mais abundante (amax, tabela explícita em dados.js) ou, sem composição natural, o de vida mais longa.
const A=e.est?e.amax:parseInt(e.m), N=A-Z;
const sup=n=>String(n).split('').map(d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
const cfgStr=list=>list.map(([o,n])=>`${o}${sup(n)}`).join(' ');
document.title=`${e.n} (${e.s}) · Z ${Z}`;

const css=`
.hero{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center}
.tile{width:96px;height:108px;border-radius:12px;border:1px solid ${C};background:linear-gradient(160deg,${C}55,${C}12);display:flex;flex-direction:column;justify-content:space-between;padding:8px}
.tile .z{font-family:var(--f-data);font-size:13px;font-weight:500}.tile .s{font-family:var(--f-title);font-size:40px;font-weight:700;color:#fff;text-align:center;line-height:1}.tile .m{font-family:var(--f-data);font-size:12px;text-align:center;color:#fff}
.hero h1{font-family:var(--f-title);font-size:32px;font-weight:700;line-height:1.1;color:var(--txt);margin:4px 0}
@media(max-width:699px){.hero h1{font-size:26px}.tile{width:80px;height:92px}.tile .s{font-size:32px}}
.chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}.chips span{display:inline-flex;align-items:center;gap:6px;font-size:13px;padding:2px 8px;border-radius:4px;border:1px solid var(--line);background:var(--panel-2);color:var(--txt)}
.chips .c i{width:8px;height:8px;border-radius:50%;background:${C}}
#atom{position:relative;height:min(60vh,520px);min-height:360px;padding:0;overflow:hidden;border-radius:20px;margin-bottom:16px}
#atom canvas{width:100%;height:100%;display:block}
.shells{display:flex;gap:4px;flex-wrap:wrap}.shells div{flex:1;min-width:52px;border:1px solid var(--line);border-radius:8px;padding:8px;text-align:center;background:var(--panel-2)}
.shells .k{font-size:12px}.shells b{display:block;font-family:var(--f-data);font-weight:500;font-size:18px;color:var(--txt)}.shells .last{border-color:${C}}
.cfg{font-family:var(--f-data);font-weight:500;font-size:16px;color:var(--txt);line-height:1.6;word-break:break-word}.cfg.small{font-size:13px;color:var(--dim)}
.orb{display:flex;flex-wrap:wrap;gap:12px 16px}.orb .sub{display:flex;flex-direction:column;align-items:center;gap:4px}
.orb .bx{display:flex}.orb .bx span{width:24px;height:28px;border:1px solid var(--line-strong);margin-left:-1px;display:flex;align-items:center;justify-content:center;font-size:13px;letter-spacing:-2px;color:#fff;background:var(--bg)}
.orb .bx span.f{border-color:${C}}.orb small{font-family:var(--f-data);font-size:12px;color:var(--dim)}
.pred{font-size:12px;color:var(--amber);border:1px solid var(--amber);border-radius:4px;padding:0 4px;margin-left:4px;font-family:var(--f-txt);font-weight:400}
.grid2{display:grid;grid-template-columns:minmax(0,1fr);gap:24px;margin-bottom:24px}@media(min-width:760px){.grid2{grid-template-columns:1fr 1fr}}
@media(max-width:699px){.grid2{gap:16px;margin-bottom:16px}}
.grid2 .box{margin:0;min-width:0}
.modes{display:flex;gap:4px;margin-bottom:16px}.modes button{flex:1}.modes #mp{flex:0 0 52px;padding:0}.lv button{flex:1 0 auto;min-width:64px}.lv .z{flex:0 0 52px;min-width:44px;padding:0}
.modes .ico{width:20px;height:20px}
.sm{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.sm .gh{grid-column:1/-1;font-size:13px;color:var(--dim);margin-top:8px}
@media(min-width:760px){.sm{grid-template-columns:repeat(6,1fr)}}
.pc{border:1px solid var(--line);border-radius:8px;padding:8px;background:var(--panel-2);position:relative;transition:border-color .15s}.pc b{font-family:var(--f-title);font-size:18px;color:#fff;display:block}.pc i{font-style:normal;font-family:var(--f-data);font-size:12px;color:var(--dim);display:block;line-height:1.4}.pc .nm{font-size:13px;color:var(--txt)}
.pc.in{border-color:var(--line-strong)}.pc.in::after{content:'neste átomo';position:absolute;top:4px;right:6px;font-size:12px;color:var(--amber)}.pc.hl{border-color:${C}}
@media(max-width:699px){.pc.in::after{content:'';top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:var(--amber)}}
.pc.q b{color:#c3a6ff}.pc.l b{color:#8ce99a}.pc.g b{color:#ffd166}.pc.h b{color:#ff8787}
.counts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}.counts div{border:1px solid var(--line);border-radius:8px;padding:8px 12px;background:var(--panel-2)}.counts b{display:block;font-family:var(--f-data);font-weight:500;font-size:18px;color:var(--txt)}
.counts .cap{margin:0}
#atom{background:radial-gradient(60% 55% at 50% 50%,${C}14,transparent 70%),radial-gradient(70% 70% at 50% 48%,#161D33,#0B0F1C 78%)}
@media(max-width:699px){#atom .pill.bl,#atom .pill.br{display:none}}`;
document.head.insertAdjacentHTML('beforeend',`<style>${css}</style>`);

const RADIO_EXTRA={
  U:' O urânio natural é 99,3% U-238 e 0,7% U-235. O U-235 é o isótopo físsil: para usinas nucleares, o urânio é “enriquecido” até ~3–5% de U-235.',
  Th:' O tório natural é praticamente só Th-232, com meia-vida de ~14 bilhões de anos.',
  Bi:' O bismuto-209 tem meia-vida de ~2×10¹⁹ anos, mais de um bilhão de vezes a idade do Universo: na prática, ele se comporta como estável.',
  Pa:' O Pa-231 (meia-vida de ~33 mil anos) existe na natureza só em traços, porque se forma o tempo todo pelo decaimento do urânio-235.'
};
const where=e.g?`Grupo ${e.g}, período ${e.p}`:`Série ${e.c==='lantanideo'?'dos lantanídeos':'dos actinídeos'}, período ${e.p}`;
const massTxt=e.est?`${br(e.m)} u`:`[${e.m}]`;
const enTxt=e.en==='-'?'— (sem valor)':br(e.en);
const densTxt=e.d==='-'?'—':`${br(e.d.replace(/[()]/g,''))} g/cm³${isPred(e.d)?' <span class="pred">previsto</span>':''}${e.ph==='gas'?' <span class="cap">(gás, 0 °C)</span>':''}`;
const lastShell=e.sh.length;
const outer=e.sh[lastShell-1];

document.body.innerHTML=`<div class="wrap">
 <svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="ui-voltar" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5 8 12l6.5 6.5"/></g></symbol><symbol id="mod-tabela-periodica" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h3v3h3v3h3V6h6V3h3v12H3z"/><path d="M3 9h18M6 6v9"/><rect x="7.5" y="17.5" width="10.5" height="3.5" rx=".5"/><rect x="12.6" y="10.6" width="3" height="3" rx=".5" fill="currentColor" stroke="none"/></g></symbol><symbol id="ui-pausar" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></g></symbol><symbol id="ui-continuar" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5.3v13.4a.9.9 0 0 0 1.4.75l10.2-6.7a.9.9 0 0 0 0-1.5L9.4 4.55A.9.9 0 0 0 8 5.3z"/></g></symbol></svg>
 <nav class="nav" aria-label="Navegação da tabela">
   <a href="../index.html"><svg class="ico" aria-hidden="true"><use href="#mod-tabela-periodica"/></svg>Tabela periódica</a>
   ${prev?`<a href="${prev.slug}.html" aria-label="Elemento anterior: ${prev.n}"><svg class="ico" aria-hidden="true"><use href="#ui-voltar"/></svg>${prev.s} <span class="num">${prev.z}</span></a>`:''}
   ${next?`<a href="${next.slug}.html" aria-label="Próximo elemento: ${next.n}">${next.s} <span class="num">${next.z}</span><svg class="ico" aria-hidden="true" style="transform:scaleX(-1)"><use href="#ui-voltar"/></svg></a>`:''}
 </nav>
 <div class="box hero">
   <div class="tile"><span class="z">${Z}</span><span class="s">${e.s}</span><span class="m">${massTxt}</span></div>
   <div>
     <div class="k">Elemento ${Z}</div>
     <h1>${e.n}</h1>
     <div class="chips"><span class="c"><i aria-hidden="true"></i>${cat.n}</span><span>${where}</span><span>Bloco ${e.b}</span><span>${FASE[e.ph]} a 25 °C</span><span>${ORIGEM_CURTA[e.o]}</span></div>
   </div>
 </div>

 <div class="stage-3d" id="atom">
   <canvas id="cv"></canvas>
   <div class="pill tl"><b id="mtitle">Órbitas 3D</b><br>Escala <span class="num" id="mscale">—</span></div>
   <div class="pill tr"><b id="mstate">Animando</b><br>Arraste para girar</div>
   <div class="pill bl" id="hbl"></div>
   <div class="pill br" id="hbr"></div>
 </div>
 <div class="seg modes lv" id="lv" role="group" aria-label="Escala"><button id="zout" class="z" aria-label="Afastar" title="Afastar">−</button><button data-l="atomo">Átomo</button><button data-l="nucleo">Núcleo</button><button data-l="proton">Próton</button><button data-l="neutron">Nêutron</button><button data-l="eletron">Elétron</button><button id="zin" class="z" aria-label="Aproximar" title="Aproximar">+</button></div>
 <div class="seg modes" id="modes" role="group" aria-label="Modelo"><button id="m0" class="on">Órbitas 3D</button><button id="m1">Nuvem eletrônica</button><button id="mp" aria-label="Pausar" title="Pausar"><svg class="ico" aria-hidden="true"><use href="#ui-pausar"/></svg></button></div>
 <div class="box note" id="mnote"></div>

 <div class="box">
   <h2>Do que o elemento ${e.n.toLowerCase()} é feito: o modelo padrão</h2>
   <div class="cap">Contagem real para ${e.est?`o isótopo mais comum (${e.s}-${A})`:`${e.s}-${A}`}: cada próton tem 2 quarks up e 1 down; cada nêutron, 1 up e 2 down.</div>
   <div class="counts">
     <div><span class="k">Quarks up</span><b>${2*Z+N}</b><span class="cap">2×${Z} + ${N}</span></div>
     <div><span class="k">Quarks down</span><b>${Z+2*N}</b><span class="cap">${Z} + 2×${N}</span></div>
     <div><span class="k">Elétrons</span><b>${Z}</b><span class="cap">léptons</span></div>
   </div>
   <div class="cap">Glúons e fótons também estão lá, mas como partículas virtuais que aparecem e somem o tempo todo, sem um número fixo. Os 17 tipos de partícula conhecidos (massas: PDG):</div>
   <div class="sm" id="sm"></div>
 </div>

 <div class="box">
   <h2>Camadas eletrônicas</h2>
   <div class="cap">Quantos elétrons há em cada camada, de dentro (K) para fora. A última camada define como o elemento reage.</div>
   <div class="shells">${e.sh.map((n,i)=>`<div class="${i===lastShell-1?'last':''}"><span class="k">${SHELL[i]} (n=${i+1})</span><b>${n}</b></div>`).join('')}</div>
 </div>

 <div class="box">
   <h2>Configuração eletrônica${e.prev?' <span class="pred">prevista</span>':''}</h2>
   <div class="cap">Forma curta: o colchete resume o gás nobre anterior. Os elétrons ocupam os subníveis na ordem de energia (regra de Madelung, o “diagrama de Pauling” dos livros)${['Cr','Cu','Mo','Ag','Au','Pd','Gd','Cm'].includes(e.s)?' — <b style="color:var(--amber)">este elemento é uma exceção real à regra</b>, porque subníveis cheios ou meio cheios deixam o átomo mais estável':['Nb','Ru','Rh','La','Ce','Pt','Ac','Th','Pa','U','Np','Lr'].includes(e.s)?' — <b style="color:var(--amber)">este elemento é uma exceção real à regra</b>: as energias dos subníveis são tão próximas que a ordem de preenchimento muda. A configuração mostrada é a medida em laboratório':''}.</div>
   <div class="cfg">${e.core?`[${e.core}] `:''}${cfgStr(e.val)}</div>
   <div class="cfg small">completa: ${cfgStr(e.cfg)}</div>
 </div>

 <div class="box">
   <h2>Diagrama de orbitais</h2>
   <div class="cap">Cada caixa é um orbital e cabe 2 elétrons de spins opostos (↑↓). Num mesmo subnível, os elétrons primeiro ocupam caixas vazias (regra de Hund).</div>
   <div class="orb" id="orb"></div>
 </div>

 <div class="grid2">
  <div class="box">
   <h2>Propriedades físicas</h2>
   <div class="cap">Medidas em pressão normal (1&nbsp;atm).</div>
   <div class="kv">
     <div>Massa atômica</div><div>${massTxt}</div>
     <div>Densidade</div><div>${densTxt}</div>
     <div>Ponto de fusão</div><div>${fmtK(e.mp)}</div>
     <div>Ponto de ebulição</div><div>${fmtK(e.bp)}</div>
     <div>Estado a 25 °C</div><div>${FASE[e.ph]}</div>
   </div>${e.nota?`
   <div class="cap" style="margin-top:6px"><b style="color:var(--amber)">Obs.:</b> ${e.nota}.</div>`:''}
  </div>
  <div class="box">
   <h2>Identidade atômica</h2>
   <div class="cap">O que define este elemento.</div>
   <div class="kv">
     <div>Número atômico (Z)</div><div>${Z} prótons</div>
     <div>Nêutrons</div><div>${N} ${e.est?`(${e.s}-${A}, o isótopo mais comum)`:`(${e.s}-${A})`}</div>
     <div>Eletronegatividade</div><div>${enTxt}</div>
     <div>Posição</div><div>${where}</div>
     <div>Origem</div><div style="max-width:190px">${ORIGEM[e.o]}</div>
   </div>
  </div>
 </div>

 <div class="box note">${e.est
   ?`<b>Massa ${br(e.m)} u</b> é a média ponderada dos isótopos naturais de ${e.n.toLowerCase()}, por isso não é um número inteiro. Os nêutrons mostrados são os do isótopo mais abundante, <b>${e.s}-${A}</b> (${A} − ${Z} = ${N}).${Math.round(parseFloat(e.m))!==A?` Atenção: arredondar a massa atômica daria ${Math.round(parseFloat(e.m))}, que não é o isótopo mais comum. Massa atômica (média) e número de massa (de um isótopo) são coisas diferentes.`:''}${e.radio?(e.o==='primordial'?` ${e.n} não tem isótopo estável: todos os seus núcleos são radioativos, mas alguns duram tanto (bilhões de anos) que ainda existem na natureza desde a formação da Terra.`:` ${e.n} não tem isótopo estável: todos os seus núcleos são radioativos.`)+(RADIO_EXTRA[e.s]||''):''}`
   :`${e.n} não tem isótopo estável: todos os seus núcleos são radioativos. <b>[${e.m}]</b> é o número de massa do isótopo de vida mais longa, usado aqui para contar os nêutrons.`}
   O desenho em órbitas é o modelo de Bohr (1913): ótimo para contar camadas, mas na física quântica o elétron fica numa “nuvem” de probabilidade (orbital), não numa trilha. O núcleo real é cerca de 100 000 vezes menor que o átomo.</div>

 <div class="foot">Dados: Wikipedia, "List of chemical elements" (IUPAC); configuração calculada pela regra de Madelung com as exceções experimentais conhecidas.<br><a href="../index.html">Voltar à tabela periódica</a> <a href="../../index.html" style="margin-left:16px">Início do LAB</a></div>
</div>`;

// orbital diagram
const orb=document.getElementById('orb');
const LIDX={s:0,p:1,d:2,f:3};
orb.innerHTML=e.cfg.map(([o,n])=>{const k=2*LIDX[o[1]]+1;const box=[];for(let i=0;i<k;i++){const up=n>i,dn=n>k+i;box.push(`<span class="${up?'f':''}">${up?'↑':''}${dn?'↓':''}</span>`)}
  return `<div class="sub"><div class="bx">${box.join('')}</div><small>${o}: ${n}</small></div>`}).join('');


// Standard Model cards
{const P=[
 ['GH','Quarks: férmions, spin ½, sentem a força forte'],
 ['q','u','up','2,2 MeV','+⅔','proton neutron nucleo atomo'],['q','c','charm','1,27 GeV','+⅔',''],['q','t','top','172,6 GeV','+⅔',''],['q','d','down','4,7 MeV','−⅓','proton neutron nucleo atomo'],
 ['q','s','strange','93 MeV','−⅓',''],['q','b','bottom','4,18 GeV','−⅓',''],
 ['GH','Léptons: férmions, spin ½, não sentem a força forte'],
 ['l','e','elétron','0,511 MeV','−1','eletron atomo'],['l','μ','múon','105,7 MeV','−1',''],['l','τ','tau','1,777 GeV','−1',''],['l','νₑ','neutrino e','< 1 eV','0',''],['l','ν_μ','neutrino μ','< 1 eV','0',''],['l','ν_τ','neutrino τ','< 1 eV','0',''],
 ['GH','Bósons: carregam as forças'],
 ['g','g','glúon · força forte','0','0 · spin 1','proton neutron nucleo'],['g','γ','fóton · eletromagnética','0','0 · spin 1','eletron atomo'],['g','Z','Z · força fraca','91,19 GeV','0 · spin 1',''],['g','W','W · força fraca','80,37 GeV','±1 · spin 1','neutron'],
 ['h','H','Higgs · dá massa','125,2 GeV','0 · spin 0','']];
 const used=new Set(['u','d','e','g','γ']);
 document.getElementById('sm').innerHTML=P.map(p=>p[0]==='GH'?`<div class="gh">${p[1]}</div>`:`<div class="pc ${p[0]}${used.has(p[1])?' in':''}" data-at="${p[5]}"><b>${p[1]}</b><span class="nm">${p[2]}</span><i>${p[3]}</i><i>carga ${p[4]}</i></div>`).join('')}
// ---------- multi-scale renderer: átomo → núcleo → próton/nêutron, e elétron ----------
const cv=document.getElementById('cv'),mctx=cv.getContext('2d');let W,H,DPR;
const bufA=document.createElement('canvas'),bufB=document.createElement('canvas');
let ctx=bufA.getContext('2d');
function rs(){DPR=Math.min(2,devicePixelRatio||1);const r=cv.getBoundingClientRect();W=r.width;H=r.height;
  for(const c of [cv,bufA,bufB]){c.width=W*DPR;c.height=H*DPR;c.getContext('2d').setTransform(DPR,0,0,DPR,0,0)}}
addEventListener('resize',rs);rs();
const hex2rgb=h=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255]};
const CR=hex2rgb(C), ICE=[200,222,255];
const rgba=(c,a)=>`rgba(${c[0]},${c[1]},${c[2]},${a})`;
const NS=lastShell, TOT=Z+N;
const fmt=x=>br(String(x));
let seedG=Z*7919+3;const rnd=()=>((seedG=(seedG*16807)%2147483647)/2147483647)||1e-9;

// nucleus: nucleons packed in a ball; spins paired (↑↓) inside each species, the odd one left unpaired
const nucleons=[];{let pl=Z,nl=N;const tmp=[];
  for(let i=0;i<TOT;i++){const isP=pl&&(!nl||pl/(pl+nl)>rnd());isP?pl--:nl--;
    const r=Math.cbrt((i+0.5)/TOT),y=1-2*(i+0.5)/TOT,rr=Math.sqrt(1-y*y),th=i*2.39996;
    tmp.push({x:r*rr*Math.cos(th),y:r*y,z:r*rr*Math.sin(th),p:isP,ph:rnd()*6.28})}
  let pc=0,nc=0;for(const q of tmp){const k=q.p?pc++:nc++;q.spin=k%2?-1:1;q.unpaired=q.p?(Z%2===1&&k===Z-1):(N%2===1&&k===N-1);nucleons.push(q)}}
const shells=[];for(let s=0;s<NS;s++)shells.push({n:e.sh[s],inc:(s===0?0.35:0.35+s*0.83)%Math.PI,node:s*1.13,speed:1.15/Math.pow(s+1,0.9),off:s*0.9,last:s===NS-1});
// electron cloud: hydrogen-like radial distribution, Gamma(2n+1, n/2), most probable radius n² a₀
const cloud=[];{const per=Math.max(90,Math.min(900,Math.floor(9000/Z)));
  for(let s=0;s<NS;s++){const n=s+1,cnt=e.sh[s]*per;for(let i=0;i<cnt;i++){let r=0;for(let k=0;k<2*n+1;k++)r-=Math.log(rnd());r*=n/2;
    const u=rnd()*2-1,th=rnd()*6.283,q=Math.sqrt(1-u*u);cloud.push({x:r*q*Math.cos(th),y:r*u,z:r*q*Math.sin(th),s})}}}

// ---- state ----
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let mode=0,paused=false,yaw=0.4,pitch=-0.32,vyaw=RM?0:0.22,simT=0,t0=0;
const LV=['atomo','nucleo','proton','neutron','eletron'];
const DEPTH={atomo:0,nucleo:1,eletron:1,proton:2,neutron:2};
let level='atomo',prevLevel=null,trans=1;
const hit={nuc:null,electrons:[],nucleons:[]};

// camera
let CX,CY,SCL,FOV=4.2;
function proj(x,y,z){const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  let X=x*cy+z*sy,Zz=-x*sy+z*cy;let Y=y*cp-Zz*sp;Zz=y*sp+Zz*cp;const f=FOV/(FOV-Zz);return{X:CX+X*SCL*f,Y:CY-Y*SCL*f,z:Zz,f}}
function ringPt(sh,a,R){let x=R*Math.cos(a),y=0,z=R*Math.sin(a);const ci=Math.cos(sh.inc),si=Math.sin(sh.inc);[y,z]=[y*ci-z*si,y*si+z*ci];
  const cn=Math.cos(sh.node),sn=Math.sin(sh.node);[x,z]=[x*cn+z*sn,-x*sn+z*cn];return[x,y,z]}
function camera(){CX=W/2;CY=H/2+6;SCL=Math.min(W,H)*0.44}
function backdrop(){ctx.strokeStyle='rgba(120,140,200,.07)';ctx.lineWidth=1;
  for(let k=1;k<=4;k++){ctx.beginPath();ctx.arc(CX,CY,SCL*k/4*1.05,0,7);ctx.stroke()}
  ctx.beginPath();ctx.moveTo(CX-SCL*1.1,CY);ctx.lineTo(CX+SCL*1.1,CY);ctx.moveTo(CX,CY-SCL*1.1);ctx.lineTo(CX,CY+SCL*1.1);ctx.stroke()}
function ball(x,y,r,c0,c1,c2,a=1){const g=ctx.createRadialGradient(x-r*.35,y-r*.35,r*.05,x,y,r);g.addColorStop(0,rgba(c0,a));g.addColorStop(.45,rgba(c1,a));g.addColorStop(1,rgba(c2,a));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}
function glow(x,y,r,c,a){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(c,a));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()}
function arrow(x,y,dx,dy,c,w=1.5){const L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L;ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.stroke();
  const h=Math.max(3,L*0.3);ctx.beginPath();ctx.moveTo(x+dx,y+dy);ctx.lineTo(x+dx-ux*h-uy*h*.55,y+dy-uy*h+ux*h*.55);ctx.lineTo(x+dx-ux*h+uy*h*.55,y+dy-uy*h-ux*h*.55);ctx.closePath();ctx.fill()}
function label(t,x,y,c='rgba(220,230,250,.85)',al='left',sz=12){ctx.font=`${Math.max(12,sz)}px JetBrains Mono, monospace`;ctx.textAlign=al;ctx.fillStyle=c;ctx.fillText(t,x,y);ctx.textAlign='left'}
function wavy(a,b,amp,waves,c,w,phase){const dx=b.X-a.X,dy=b.Y-a.Y,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();
  for(let i=0;i<=60;i++){const t=i/60,s=Math.sin(t*waves*6.283+phase)*amp*Math.sin(t*Math.PI);const x=a.X+dx*t+nx*s,y=a.Y+dy*t+ny*s;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}
function coil(a,b,amp,turns,c,w,phase){const dx=b.X-a.X,dy=b.Y-a.Y,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,nx=-uy,ny=ux;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();
  for(let i=0;i<=120;i++){const t=i/120,an=t*turns*6.283+phase;const x=a.X+dx*t+ux*Math.cos(an)*amp*0.7+nx*Math.sin(an)*amp,y=a.Y+dy*t+uy*Math.cos(an)*amp*0.7+ny*Math.sin(an)*amp;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}

// ================= ÁTOMO =================
function drawAtom(){
  const nR=(0.13+0.05*Math.min(1,TOT/200))*(mode===1?0.55:1);
  const ringR=s=>nR*1.9+(1-nR*1.9)*(s+1)/NS;
  backdrop();const prims=[];hit.electrons=[];
  if(mode===0){
    shells.forEach((sh,s)=>{const R=ringR(s),col=sh.last?CR:ICE;let prev=proj(...ringPt(sh,0,R));
      for(let i=1;i<=90;i++){const p=proj(...ringPt(sh,i/90*6.2832,R));const a=prev,b=p,z=(a.z+b.z)/2;
        prims.push({z,d(){const k=0.5+0.5*z;ctx.strokeStyle=rgba(col,(sh.last?0.22:0.12)+0.4*k*(sh.last?1:.6));ctx.lineWidth=(sh.last?1.6:1)*a.f;ctx.beginPath();ctx.moveTo(a.X,a.Y);ctx.lineTo(b.X,b.Y);ctx.stroke()}});prev=p}
      for(let i=0;i<sh.n;i++){const a0=simT*sh.speed+i*6.2832/sh.n+sh.off;const head=proj(...ringPt(sh,a0,R));hit.electrons.push(head);
        const trail=[];for(let k=1;k<=10;k++)trail.push(proj(...ringPt(sh,a0-k*0.045*(1+s*0.1),R)));
        prims.push({z:head.z+0.001,d(){ctx.lineCap='round';let pv=head;trail.forEach((p,k)=>{ctx.strokeStyle=rgba(col,0.55*(1-k/10)*(0.55+0.45*(head.z+1)/2));ctx.lineWidth=(3.2-k*0.25)*head.f;ctx.beginPath();ctx.moveTo(pv.X,pv.Y);ctx.lineTo(p.X,p.Y);ctx.stroke();pv=p});
          const r=(sh.last?4:3.2)*head.f*(0.75+0.25*(head.z+1)/2);glow(head.X,head.Y,r*4,col,.6);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(head.X,head.Y,r*0.6,0,7);ctx.fill()}})}});
  }else{
    const tint=si=>{const t=NS>1?si/(NS-1):1;return ICE.map((v,k)=>Math.round(v+(CR[k]-v)*t))};
    const pts=[];for(const q of cloud){const R=ringR(q.s),k=R/((q.s+1)*(q.s+1));if(Math.hypot(q.x,q.y,q.z)*k>1.18)continue;const p=proj(q.x*k,q.y*k,q.z*k);p.s=q.s;pts.push(p)}
    const dot=(p,a)=>{ctx.fillStyle=rgba(tint(p.s),a);const r=(1.15+0.5*(p.z+1)/2)*p.f;ctx.fillRect(p.X-r/2,p.Y-r/2,r,r)};
    prims.push({z:-1e-4,d(){ctx.save();ctx.globalCompositeOperation='lighter';for(const p of pts)if(p.z<=0)dot(p,0.38);ctx.restore()}});
    prims.push({z:1e-4,d(){ctx.save();ctx.globalCompositeOperation='lighter';for(const p of pts)if(p.z>0)dot(p,0.6);ctx.restore();ctx.setLineDash([2,5]);
      shells.forEach((sh,si)=>{const R=ringR(si)*SCL*proj(0,0,0).f;ctx.strokeStyle=rgba(tint(si),.45);ctx.lineWidth=1;ctx.beginPath();ctx.arc(CX,CY,R,0,7);ctx.stroke();label(SHELL[si],CX+R*0.707+3,CY-R*0.707-2,rgba(tint(si),.9))});ctx.setLineDash([])}});
  }
  prims.push({z:0,d(){const c=proj(0,0,0),Rn=nR*SCL*c.f,brr=Math.max(1.6,Rn/Math.cbrt(TOT)*1.05);hit.nuc={X:c.X,Y:c.Y,r:Math.max(26,Rn*1.6)};
    glow(c.X,c.Y,Rn*3.2,[255,110,120],.3);
    const ps=nucleons.map(q=>{const j=0.04*Math.sin(simT*3+q.ph);const p=proj(q.x*nR*(1+j),q.y*nR*(1+j),q.z*nR*(1+j));p.p=q.p;return p}).sort((a,b)=>a.z-b.z);
    for(const p of ps){const s=0.55+0.45*(p.z/nR+1)/2;p.p?ball(p.X,p.Y,brr,[255,230,230],[255,95,110],[110,20,40],s):ball(p.X,p.Y,brr,[235,242,255],[130,160,215],[30,45,90],s)}}});
  prims.sort((a,b)=>a.z-b.z);for(const p of prims)p.d();
  if(mode===0)shells.forEach((sh,s)=>{const R=ringR(s);let best=null;for(let i=0;i<36;i++){const p=proj(...ringPt(sh,i/36*6.2832,R));if(!best||p.X>best.X)best=p}label(`${SHELL[s]}·${sh.n}`,Math.min(W-34,best.X+5),best.Y+3,sh.last?rgba(CR,.95):'rgba(170,190,235,.65)')});
  else label('pontos = |ψ|² · tracejado = raio mais provável',CX,52,'rgba(170,190,235,.6)','center');
  // hint
  const c=hit.nuc;if(c){ctx.strokeStyle=`rgba(255,255,255,${.25+.2*Math.sin(simT*3)})`;ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(c.X,c.Y,c.r,0,7);ctx.stroke();ctx.setLineDash([]);label('toque: núcleo',c.X,c.Y+c.r+12,'rgba(255,255,255,.55)','center')}
}

// ================= NÚCLEO =================
const pions=[];
function drawNucleus(dt){
  backdrop();const R=0.78;const brr=Math.min(R*SCL*0.24,Math.max(3,R*SCL/Math.cbrt(TOT)*1.0));
  const ps=nucleons.map((q,i)=>{const j=0.025*Math.sin(simT*2.5+q.ph);const p=proj(q.x*R*(1+j),q.y*R*(1+j),q.z*R*(1+j));p.q=q;p.i=i;return p});
  // residual strong force: pion exchange between neighbouring nucleons
  if(!paused&&Math.random()<dt*Math.min(18,TOT*0.6)){const a=Math.floor(Math.random()*TOT);let b=-1,bd=1e9;const qa=nucleons[a];
    for(let k=0;k<TOT;k++){if(k===a)continue;const q=nucleons[k],d=(q.x-qa.x)**2+(q.y-qa.y)**2+(q.z-qa.z)**2;if(d<bd){bd=d;b=k}}
    if(b>=0)pions.push({a,b,t:0,ch:Math.random()<.5?'π⁰':(nucleons[a].p!==nucleons[b].p?(nucleons[a].p?'π⁺':'π⁻'):'π⁰')})}
  glow(CX,CY,R*SCL*1.5,[255,110,120],.12);
  const sorted=[...ps].sort((a,b)=>a.z-b.z);hit.nucleons=ps;
  for(const p of sorted){const q=p.q,s=0.5+0.5*(p.z/R+1)/2;
    q.p?ball(p.X,p.Y,brr*p.f,[255,230,230],[255,95,110],[110,20,40],s):ball(p.X,p.Y,brr*p.f,[235,242,255],[130,160,215],[30,45,90],s);
    if(brr>7&&p.z>-0.2){const L=brr*1.1*p.f;arrow(p.X,p.Y+q.spin*L*0.45,0,-q.spin*L*0.9,`rgba(255,255,255,${0.35+0.5*s})`,1.2)}
    if(q.unpaired){ctx.strokeStyle=`rgba(255,209,102,${.6+.4*Math.sin(simT*4)})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(p.X,p.Y,brr*p.f*1.25,0,7);ctx.stroke()}}
  for(let i=pions.length-1;i>=0;i--){const pi=pions[i];if(!paused)pi.t+=dt*2.2;if(pi.t>1){pions.splice(i,1);continue}
    const a=ps[pi.a],b=ps[pi.b];if(a.z<-0.3&&b.z<-0.3)continue;const al=Math.sin(pi.t*Math.PI);
    ctx.setLineDash([2,3]);ctx.strokeStyle=`rgba(255,209,102,${al*.9})`;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(a.X,a.Y);ctx.lineTo(b.X,b.Y);ctx.stroke();ctx.setLineDash([]);
    const mx=a.X+(b.X-a.X)*pi.t,my=a.Y+(b.Y-a.Y)*pi.t;glow(mx,my,7,[255,209,102],al);if(TOT<80)label(pi.ch,mx+5,my-5,`rgba(255,209,102,${al})`)}
  label(`raio ≈ 1,2 fm × A^⅓ = ${fmt((1.2*Math.cbrt(A)).toFixed(1))} fm`,CX,52,'rgba(170,190,235,.65)','center');
  label('toque num próton ou nêutron para entrar nele',CX,H-48,'rgba(255,255,255,.5)','center');
}

// ================= PRÓTON / NÊUTRON =================
const QC=[[255,77,95],[64,214,120],[80,150,255]]; // colour charge: vermelho, verde, azul
const QCN=['vermelho','verde','azul'];
let quarks=null,gluons=[],sea=[],field=[],nucType=null;
function initNucleon(t){nucType=t;const fl=t==='proton'?['u','u','d']:['u','d','d'];
  quarks=fl.map((f,i)=>({f,col:i,ph:i*2.094,spin:i===2?-1:1,ax:0.9+i*0.17,ay:1.3-i*0.21,az:0.7+i*0.29}));gluons=[];sea=[];
  field=[...Array(260)].map(()=>{const u=rnd()*2-1,th=rnd()*6.28,r=Math.cbrt(rnd())*0.95,q=Math.sqrt(1-u*u);return{x:r*q*Math.cos(th),y:r*u,z:r*q*Math.sin(th),c:Math.floor(rnd()*3),v:rnd()*6.28}})}
function qpos(q){const T=simT*0.9;return[0.42*Math.sin(T*q.ax+q.ph),0.42*Math.sin(T*q.ay+q.ph*1.7),0.42*Math.cos(T*q.az+q.ph*0.6)]}
function drawNucleon(dt){
  backdrop();const isP=nucType==='proton';
  // boundary (charge radius)
  const c=proj(0,0,0),Rb=SCL*c.f;glow(CX,CY,Rb*1.15,isP?[255,110,120]:[130,160,215],.16);
  ctx.strokeStyle='rgba(255,255,255,.12)';ctx.setLineDash([3,5]);ctx.beginPath();ctx.arc(CX,CY,Rb,0,7);ctx.stroke();ctx.setLineDash([]);
  // gluon field "sea": drifting coloured motes
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const f of field){if(!paused){f.v+=dt;const a=Math.sin(f.v*0.7)*0.004,b=Math.cos(f.v*0.9)*0.004;f.x+=a;f.z+=b;f.y+=Math.sin(f.v*1.3)*0.003;const d=Math.hypot(f.x,f.y,f.z);if(d>0.95){f.x*=0.9/d;f.y*=0.9/d;f.z*=0.9/d}}
    const p=proj(f.x,f.y,f.z);ctx.fillStyle=rgba(QC[f.c],0.18+0.12*(p.z+1)/2);ctx.fillRect(p.X,p.Y,1.6,1.6)}
  ctx.restore();
  const qp=quarks.map(q=>{const p=proj(...qpos(q));p.q=q;return p});
  // gluon exchange: colour flows between quarks, total stays "white"
  if(!paused&&Math.random()<dt*2.2&&gluons.length<3){let i=Math.floor(Math.random()*3),j=(i+1+Math.floor(Math.random()*2))%3;gluons.push({i,j,t:0,ci:quarks[i].col,cj:quarks[j].col,sw:false})}
  for(let k=gluons.length-1;k>=0;k--){const g=gluons[k];if(!paused)g.t+=dt*1.6;if(g.t>=0.5&&!g.sw){g.sw=true;const tmp=quarks[g.i].col;quarks[g.i].col=quarks[g.j].col;quarks[g.j].col=tmp}
    if(g.t>1){gluons.splice(k,1);continue}const al=Math.sin(g.t*Math.PI);const a=qp[g.i],b=qp[g.j];
    const grd=ctx.createLinearGradient(a.X,a.Y,b.X,b.Y);grd.addColorStop(0,rgba(QC[g.ci],al));grd.addColorStop(1,rgba(QC[g.cj],al));
    coil(a,b,5,9,grd,1.6,simT*12);const mx=(a.X+b.X)/2,my=(a.Y+b.Y)/2;label('g',mx+8,my-6,`rgba(255,255,255,${al*.8})`)}
  // sea quark–antiquark pairs (virtual)
  if(!paused&&Math.random()<dt*3&&sea.length<5){const u=rnd()*2-1,th=rnd()*6.28,r=0.3+rnd()*0.55,q=Math.sqrt(1-u*u);const fl=['u','d','s','u','d'][Math.floor(rnd()*5)];
    sea.push({x:r*q*Math.cos(th),y:r*u,z:r*q*Math.sin(th),t:0,fl,c:Math.floor(rnd()*3),dx:(rnd()-.5)*.25,dy:(rnd()-.5)*.25})}
  for(let k=sea.length-1;k>=0;k--){const s=sea[k];if(!paused)s.t+=dt*1.3;if(s.t>1){sea.splice(k,1);continue}const al=Math.sin(s.t*Math.PI)*0.8,sp=Math.sin(s.t*Math.PI)*0.6;
    const a=proj(s.x+s.dx*sp,s.y+s.dy*sp,s.z),b=proj(s.x-s.dx*sp,s.y-s.dy*sp,s.z);
    glow(a.X,a.Y,6,QC[s.c],al);glow(b.X,b.Y,6,[200,200,220],al*.7);label(s.fl,a.X+4,a.Y-4,`rgba(255,255,255,${al*.8})`,'left',8);label(s.fl+'̄',b.X+4,b.Y-4,`rgba(255,255,255,${al*.8})`,'left',8)}
  // valence quarks
  const qr=Math.max(14,SCL*0.12);
  for(const p of [...qp].sort((a,b)=>a.z-b.z)){const q=p.q,col=QC[q.col],r=qr*p.f;glow(p.X,p.Y,r*2.6,col,.45);ball(p.X,p.Y,r,[255,255,255],col,col.map(v=>v*0.35|0));
    label(q.f,p.X,p.Y+4,'#fff','center',Math.round(r*0.9));label(q.f==='u'?'+⅔':'−⅓',p.X+r*0.95,p.Y-r*0.7,'rgba(255,255,255,.9)','left',9);
    arrow(p.X-r*1.5,p.Y+q.spin*r*0.6,0,-q.spin*r*1.2,'rgba(255,255,255,.75)',1.4)}
  const sum=isP?'u + u + d = +⅔ +⅔ −⅓ = +1':'u + d + d = +⅔ −⅓ −⅓ = 0';
  label(`carga: ${sum}`,CX,52,'rgba(170,190,235,.75)','center');
  label(`cores agora: ${quarks.map(q=>QCN[q.col]).join(' + ')} = "branco"`,CX,H-48,'rgba(255,255,255,.5)','center');
}

// ================= ELÉTRON =================
let photons=[],pairs=[];
function drawElectron(dt){
  backdrop();const c=proj(0,0,0);
  // electric field lines point INTO a negative charge
  for(let i=0;i<16;i++){const a=i/16*6.283+0.2;const r1=SCL*0.95,r2=SCL*0.22;const x1=CX+Math.cos(a)*r1,y1=CY+Math.sin(a)*r1,x2=CX+Math.cos(a)*r2,y2=CY+Math.sin(a)*r2;
    ctx.strokeStyle='rgba(120,170,255,.16)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
    const m=0.45+0.5*((simT*0.25+i*0.13)%1);arrow(x1+(x2-x1)*m,y1+(y2-y1)*m,(x2-x1)*0.06,(y2-y1)*0.06,'rgba(120,170,255,.45)',1)}
  // vacuum polarisation: virtual e⁺e⁻ pairs
  if(!paused&&Math.random()<dt*2.5&&pairs.length<6){const a=rnd()*6.28,r=0.3+rnd()*0.5;pairs.push({a,r,t:0})}
  for(let k=pairs.length-1;k>=0;k--){const p=pairs[k];if(!paused)p.t+=dt*1.2;if(p.t>1){pairs.splice(k,1);continue}const al=Math.sin(p.t*Math.PI)*.8,sp=0.06*Math.sin(p.t*Math.PI);
    const xm=CX+Math.cos(p.a)*p.r*SCL,ym=CY+Math.sin(p.a)*p.r*SCL;const ux=Math.cos(p.a),uy=Math.sin(p.a);
    // positron sits closer to the electron (screening), electron farther
    const xp=xm-ux*sp*SCL,yp=ym-uy*sp*SCL,xe=xm+ux*sp*SCL,ye=ym+uy*sp*SCL;
    glow(xp,yp,6,[255,140,160],al);glow(xe,ye,6,[120,180,255],al);label('e⁺',xp+5,yp-4,`rgba(255,170,185,${al})`,'left',8);label('e⁻',xe+5,ye-4,`rgba(150,200,255,${al})`,'left',8)}
  // virtual photons
  if(!paused&&Math.random()<dt*1.8&&photons.length<4)photons.push({a:rnd()*6.28,t:0});
  for(let k=photons.length-1;k>=0;k--){const p=photons[k];if(!paused)p.t+=dt*0.9;if(p.t>1){photons.splice(k,1);continue}const al=Math.sin(p.t*Math.PI);
    const r0=0.08+p.t*0.6,r1=r0+0.28;const a={X:CX+Math.cos(p.a)*r0*SCL,Y:CY+Math.sin(p.a)*r0*SCL},b={X:CX+Math.cos(p.a)*r1*SCL,Y:CY+Math.sin(p.a)*r1*SCL};
    wavy(a,b,4,4,`rgba(255,230,120,${al*.9})`,1.5,simT*10);label('γ',b.X+4,b.Y,`rgba(255,230,120,${al})`)}
  // the electron: point-like core
  glow(CX,CY,SCL*0.35,[90,150,255],.18);glow(CX,CY,SCL*0.12,[150,200,255],.6);glow(CX,CY,10,[255,255,255],1);
  // spin ½: precessing arrow (spin is intrinsic angular momentum, not a spinning ball)
  const th=0.55,ph=simT*2.2,L=0.42;const tip=proj(L*Math.sin(th)*Math.cos(ph),L*Math.cos(th),L*Math.sin(th)*Math.sin(ph));
  ctx.strokeStyle='rgba(255,255,255,.18)';ctx.setLineDash([2,4]);ctx.beginPath();for(let i=0;i<=40;i++){const a=i/40*6.283;const p=proj(L*Math.sin(th)*Math.cos(a),L*Math.cos(th),L*Math.sin(th)*Math.sin(a));i?ctx.lineTo(p.X,p.Y):ctx.moveTo(p.X,p.Y)}ctx.stroke();ctx.setLineDash([]);
  arrow(c.X,c.Y,tip.X-c.X,tip.Y-c.Y,'rgba(255,255,255,.95)',2.2);label('spin ½ (ħ/2)',tip.X+8,tip.Y,'#fff');
  label('carga −1 · massa 0,511 MeV/c² · sem estrutura interna conhecida',CX,52,'rgba(170,190,235,.75)','center');
  label('raio < 10⁻¹⁸ m (limite experimental)',CX,H-48,'rgba(255,255,255,.5)','center');
}

// ---- info per level ----
const INFO={
 atomo:{t:()=>mode?'Nuvem eletrônica':'Órbitas 3D',scale:'~10⁻¹⁰ m',
   bl:`<span style="color:#ff6b6b">●</span> ${Z} próton${Z>1?'s':''}<br><span style="color:#8aa4d6">●</span> ${N} nêutron${N!==1?'s':''} (${e.s}-${A})`,
   br:`<span style="color:${C}">●</span> elétrons<br>camada de valência: ${e.sh[NS-1]} e⁻`,
   note:()=>mode?`<b>Nuvem eletrônica.</b> Cada ponto é uma posição possível de um elétron, sorteada pela distribuição de probabilidade do átomo de hidrogênio (orbital com l = n−1). O tracejado marca o raio mais provável, n² vezes o raio de Bohr. Representação qualitativa para átomos com muitos elétrons.`
     :`<b>Órbitas 3D.</b> Cada camada gira num plano diferente com o número real de elétrons de ${e.n.toLowerCase()}. No modelo de Bohr (1913), as camadas internas giram mais rápido porque estão mais presas ao núcleo. Hoje sabemos que o elétron não segue uma trilha: veja a NUVEM ELETRÔNICA. <b>Toque no núcleo</b> para dar zoom, ou <b>num elétron</b> para ver um lépton por dentro. Também dá para usar a roda do mouse ou o gesto de pinça.`},
 nucleo:{t:()=>'Núcleo',scale:'~10⁻¹⁴ m',
   bl:`<span style="color:#ff6b6b">●</span> ${Z} prótons · <span style="color:#8aa4d6">●</span> ${N} nêutrons${Z%2||N%2?'<br><span style="color:#ffd166">◯</span> spin sem par':'<br>todos os spins em pares ↑↓'}`,
   br:`<span style="color:#ffd166">- -</span> troca de píons (π)<br>força nuclear residual`,
   note:()=>`<b>Núcleo de ${e.n.toLowerCase()} (${e.s}-${A}).</b> Raio ≈ 1,2 fm × A^⅓ = <b>${fmt((1.2*Math.cbrt(A)).toFixed(1))} fm</b> (1 fm = 10⁻¹⁵ m), cerca de 100 000 vezes menor que o átomo inteiro. Prótons se repelem pela carga, mas a <b>força forte</b> os segura: entre núcleons ela atua pela troca de píons (linhas amarelas), um efeito residual dos glúons de dentro deles. As setas são os <b>spins</b>: prótons e nêutrons tendem a formar pares de spins opostos (↑↓); ${Z%2||N%2?'o anel amarelo marca quem ficou sem par.':'aqui todos ficam pareados (Z e N pares), e o spin total do núcleo no estado fundamental é 0.'} Disposição ilustrativa.`},
 proton:{t:()=>'Próton',scale:'~10⁻¹⁵ m',
   bl:`<span style="color:#ff4d5f">●</span><span style="color:#40d678">●</span><span style="color:#5096ff">●</span> carga de cor<br>quarks de valência: u u d`,
   br:`<span style="color:#fff">~~</span> glúons (g)<br>q q̄ = pares virtuais`,
   note:()=>`<b>Próton = 2 quarks up + 1 down</b>, presos por <b>glúons</b>, os bósons da força forte. Cada quark tem uma "carga de cor" (vermelho, verde ou azul) que muda quando troca glúons, mas o próton inteiro fica sempre "branco". Raio de carga: <b>0,84 fm</b>. Massa: <b>938,27 MeV/c²</b>, mas os 3 quarks somam só ~9 MeV (2,2 + 2,2 + 4,7): <b>~99% da massa vem da energia da interação forte</b> (o movimento dos quarks e o campo de glúons), e não da massa dos próprios quarks. Spin ½: o desenho ↑↑↓ é o modelo simples; medições mostram que os quarks carregam só ~30% do spin, o resto vem de glúons e do movimento orbital.`},
 neutron:{t:()=>'Nêutron',scale:'~10⁻¹⁵ m',
   bl:`<span style="color:#ff4d5f">●</span><span style="color:#40d678">●</span><span style="color:#5096ff">●</span> carga de cor<br>quarks de valência: u d d`,
   br:`<span style="color:#fff">~~</span> glúons (g)<br>q q̄ = pares virtuais`,
   note:()=>`<b>Nêutron = 1 quark up + 2 down</b>: carga +⅔ −⅓ −⅓ = 0. Massa <b>939,57 MeV/c²</b>, um pouco maior que a do próton. Fora do núcleo ele é instável e vive em média <b>~14,6 minutos</b> (878 s; meia-vida de ~10 minutos): um quark d vira u emitindo um <b>bóson W⁻</b>, e o resultado é n → p + e⁻ + ν̄ₑ (decaimento beta, força fraca). Dentro de um núcleo estável, como ${e.est&&!e.radio?'o de '+e.n.toLowerCase():'o de muitos elementos'}, ele não decai.`},
 eletron:{t:()=>'Elétron',scale:'< 10⁻¹⁸ m',
   bl:`<span style="color:#9cc4ff">●</span> elétron e⁻ (lépton)<br><span style="color:#ffe678">~</span> fótons virtuais γ`,
   br:`<span style="color:#ff8ca0">●</span>e⁺ <span style="color:#78b4ff">●</span>e⁻ pares virtuais<br>↗ spin ½`,
   note:()=>`<b>O elétron é um lépton: uma partícula elementar.</b> Até onde os experimentos alcançam, não tem nada dentro (raio < 10⁻¹⁸ m). Carga −1, massa <b>0,511 MeV/c²</b> (1836 vezes mais leve que o próton). Ele sente a força eletromagnética trocando <b>fótons</b> (γ) e a força fraca (bósons W e Z), mas não a força forte. O <b>spin ½</b> não é uma bolinha girando: é um momento angular intrinsecamente quântico, que num campo magnético faz precessão como a seta. Em volta dele, pares virtuais e⁺e⁻ blindam parte da carga (polarização do vácuo).`}
};
const lvBtns=document.getElementById('lv');
function setLevel(l){if(l===level)return;if(l==='proton'||l==='neutron')initNucleon(l);prevLevel=level;level=l;trans=0;updateUI()}
function updateUI(){const I=INFO[level];document.getElementById('mtitle').textContent=I.t();document.getElementById('mscale').textContent=I.scale;
  document.getElementById('hbl').innerHTML=I.bl;document.getElementById('hbr').innerHTML=I.br;document.getElementById('mnote').innerHTML=I.note();
  [...lvBtns.querySelectorAll('button[data-l]')].forEach(b=>b.classList.toggle('on',b.dataset.l===level));
  document.getElementById('modes').style.display=level==='atomo'?'flex':'none';
  document.getElementById('m0').classList.toggle('on',mode===0);document.getElementById('m1').classList.toggle('on',mode===1);
  document.querySelectorAll('.sm .pc').forEach(el=>el.classList.toggle('hl',(el.dataset.at||'').split(' ').includes(level)))}
lvBtns.onclick=ev=>{const b=ev.target.closest('button');if(!b)return;if(b.dataset.l)setLevel(b.dataset.l);if(b.id==='zin')zoom(1);if(b.id==='zout')zoom(-1)};
function zoom(d){const chain={atomo:['nucleo',null],nucleo:['proton','atomo'],proton:[null,'nucleo'],neutron:[null,'nucleo'],eletron:[null,'atomo']};const n=chain[level][d>0?0:1];if(n)setLevel(n)}
document.getElementById('m0').onclick=()=>{mode=0;updateUI()};document.getElementById('m1').onclick=()=>{mode=1;updateUI()};
document.getElementById('mp').onclick=()=>{paused=!paused;const mp=document.getElementById('mp');mp.innerHTML=`<svg class="ico" aria-hidden="true"><use href="#ui-${paused?'continuar':'pausar'}"/></svg>`;mp.setAttribute('aria-label',paused?'Continuar':'Pausar');mp.title=paused?'Continuar':'Pausar';document.getElementById('mstate').textContent=paused?'Pausado':'Animando'};

// ---- input: drag rotate, tap to dive, wheel / pinch zoom ----
const ptrs=new Map();let dragStart=null,pinch0=null;
cv.style.touchAction='pan-y';
cv.addEventListener('pointerdown',ev=>{ptrs.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});cv.setPointerCapture(ev.pointerId);
  if(ptrs.size===1)dragStart={x:ev.clientX,y:ev.clientY,lx:ev.clientX,ly:ev.clientY,moved:0};
  if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch0=Math.hypot(a.x-b.x,a.y-b.y);dragStart=null}});
cv.addEventListener('pointermove',ev=>{if(!ptrs.has(ev.pointerId))return;ptrs.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});
  if(ptrs.size===2&&pinch0){const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(d/pinch0>1.35){zoom(1);pinch0=d}else if(d/pinch0<0.74){zoom(-1);pinch0=d}return}
  if(!dragStart)return;const dx=ev.clientX-dragStart.lx,dy=ev.clientY-dragStart.ly;dragStart.lx=ev.clientX;dragStart.ly=ev.clientY;dragStart.moved+=Math.abs(dx)+Math.abs(dy);
  yaw+=dx*0.01;pitch=Math.max(-1.3,Math.min(1.3,pitch+dy*0.01));vyaw=dx*0.002});
cv.addEventListener('pointerup',ev=>{ptrs.delete(ev.pointerId);if(ptrs.size<2)pinch0=null;
  if(dragStart&&dragStart.moved<8)tap(ev);dragStart=null;if(Math.abs(vyaw)<0.05)vyaw=RM?0:0.22*Math.sign(vyaw||1)});
cv.addEventListener('pointercancel',ev=>{ptrs.delete(ev.pointerId);dragStart=null;pinch0=null});
cv.addEventListener('wheel',ev=>{ev.preventDefault();if(trans<1)return;zoom(ev.deltaY<0?1:-1)},{passive:false});
function tap(ev){const r=cv.getBoundingClientRect(),x=ev.clientX-r.left,y=ev.clientY-r.top;
  if(level==='atomo'){for(const p of hit.electrons)if(Math.hypot(p.X-x,p.Y-y)<16){setLevel('eletron');return}
    if(hit.nuc&&Math.hypot(hit.nuc.X-x,hit.nuc.Y-y)<hit.nuc.r){setLevel('nucleo');return}}
  else if(level==='nucleo'){let best=null,bd=1e9;for(const p of hit.nucleons){if(p.z<-0.2)continue;const d=Math.hypot(p.X-x,p.Y-y);if(d<bd){bd=d;best=p}}
    if(best&&bd<30)setLevel(best.q.p?'proton':'neutron')}}

// ---- main loop with zoom transitions ----
const DRAW={atomo:drawAtom,nucleo:drawNucleus,proton:drawNucleon,neutron:drawNucleon,eletron:drawElectron};
function render(l,buf,dt){ctx=buf.getContext('2d');ctx.clearRect(0,0,W,H);camera();
  if((l==='proton'||l==='neutron')&&nucType!==l){initNucleon(l)}DRAW[l](dt)}
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function frame(now){const dt=Math.min(0.05,(now-(t0||now))/1000);t0=now;if(!paused)simT+=dt;if(!dragStart)yaw+=vyaw*dt;
  mctx.clearRect(0,0,W,H);
  if(trans<1){trans=Math.min(1,trans+dt/0.9);const k=ease(trans);const inward=DEPTH[level]>DEPTH[prevLevel];
    if(prevLevel==='proton'||prevLevel==='neutron'){if(nucType!==prevLevel){/* old nucleon state not needed */}}
    render(prevLevel,bufB,0);render(level,bufA,dt);
    const draw=(buf,s,a)=>{mctx.save();mctx.globalAlpha=a;mctx.translate(W/2,H/2);mctx.scale(s,s);mctx.translate(-W/2,-H/2);mctx.drawImage(buf,0,0,W,H);mctx.restore()};
    if(inward){draw(bufB,1+k*7,1-k);draw(bufA,0.12+0.88*k,k)}else{draw(bufB,1-k*0.85,1-k);draw(bufA,4-3*k,k)}
    // scale flash
    mctx.fillStyle=`rgba(255,255,255,${0.12*Math.sin(k*Math.PI)})`;mctx.fillRect(0,0,W,H);
  }else{render(level,bufA,dt);mctx.drawImage(bufA,0,0,W,H)}
  requestAnimationFrame(frame)}
updateUI();requestAnimationFrame(frame);

})();
