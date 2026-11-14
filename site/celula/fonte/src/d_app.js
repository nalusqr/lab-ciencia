// ================= APP: estado, cena React Three Fiber e interface =================
const CELLS={
 vegetal:['Célula vegetal',['nucleo','cloroplasto','vacuolo','mitocondria','re','golgi','ribossomo','peroxissomo','citoesqueleto','membrana']],
 animal:['Célula animal',['nucleo','mitocondria','re','golgi','ribossomo','lisossomo','peroxissomo','centriolo','citoesqueleto','membrana']],
 bacteria:['Célula bacteriana',['nucleoide','plasmidio','ribo70','parede_bac','flagelo','pili']],
 neuronio:['Neurônio',['nucleo','dendrito','axonio','mielina','sinapse','mitocondria']],
 esperma:['Espermatozoide',['acrossomo','nucleo_esp','peca_int','cauda']],
 levedura:['Levedura',['nucleo_lev','vacuolo_lev','mitocondria','broto','parede_lev']],
 sangue:['Células do sangue',['hemacia','leucocito','plaqueta']],
 fago:['Bacteriófago (vírus)',['capsideo','dna_fago','cauda_fago','fibras']]};
DETB.nucleo_lev=DETB.nucleo;   // o núcleo da levedura usa a mesma tela em corte, com o texto próprio
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const S={ctype:'animal',view:'celula',sel:null,hv:null,labels:true,paused:RM,z:0,ver:0};
const subs=new Set();
function set(p){let ch=false;for(const k in p)if(S[k]!==p[k]){ch=true;break}if(!ch)return;Object.assign(S,p);S.ver++;subs.forEach(f=>f());ui()}
const useS=()=>React.useSyncExternalStore(cb=>{subs.add(cb);return()=>subs.delete(cb)},()=>S.ver);
const sceneKey=()=>S.view==='celula'?'c:'+S.ctype:'d:'+S.view;
const CACHE={};
function getScene(key){if(CACHE[key])return CACHE[key];MATS.length=0;const [t,k]=key.split(':');const sc=(t==='c'?CELLB[k]:DETB[k])();sc.mats=MATS.slice();MATS.length=0;sc.g.updateMatrixWorld(true);return CACHE[key]=sc}
const inList=k=>CELLS[S.ctype][1].includes(k);
function choose(k){stopTour();if(!inList(k))return;if(k==='mitocondria'&&typeof MODELOS!=='undefined')MODELOS.preparar('mitocondria');if(S.sel===k&&DETB[k])open(k);else set({sel:k,hv:k})}
function open(k){if(!DETB[k])return;set({view:k,sel:null,hv:null,z:0});setHash(k)}
function back(){set({view:'celula',hv:null,z:0});setHash(S.ctype)}
function setType(t){if(!CELLS[t])return;stopTour();set({ctype:t,view:'celula',sel:null,hv:null,z:0});setHash(t)}
function setHash(h){try{history.replaceState(null,'','#'+h)}catch(e){}}
let T=0;const PORTAL={current:document.getElementById('stage')};
const BAR=()=>innerWidth<700?68:76;   // altura ocupada pela barra de ferramentas embaixo do palco (px)
// ---------- componentes 3D ----------
function Env(){const {gl,scene}=useThree();React.useEffect(()=>{gl.localClippingEnabled=true;if(MAT)MAT.configurarRenderer(gl);
  const pm=new THREE.PMREMGenerator(gl);const env=pm.fromScene(new RoomEnvironment(),.04).texture;scene.environment=env;scene.environmentIntensity=.38;pm.dispose();
  let bg=null,bt=null;
  if(MAT){bg=MAT.fundoPalco(34);scene.add(bg)}   // degradê do palco (guia 2.1), da biblioteca de materiais
  else{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');const g=x.createRadialGradient(128,120,8,128,128,200);g.addColorStop(0,'#161D33');g.addColorStop(1,'#0B0F1C');x.fillStyle=g;x.fillRect(0,0,256,256);bt=new THREE.CanvasTexture(c);bt.colorSpace=THREE.SRGBColorSpace;scene.background=bt}
  return()=>{env.dispose();if(bg){scene.remove(bg);bg.geometry.dispose();bg.material.dispose()}if(bt)bt.dispose()}},[]);return null}
// três luzes do "laboratório" (guia 5): principal morna de cima e da esquerda, preenchimento frio, contorno por trás
const LUZ=MAT?MAT.luzes(1.05):null;
function Lights(){return LUZ?html`<primitive object=${LUZ}/>`:html`<ambientLight intensity=${.2}/><directionalLight position=${[-5,5,5]} intensity=${2.3} color="#FFF4E6"/><directionalLight position=${[6,1,3]} intensity=${.7} color="#CFE0FF"/><directionalLight position=${[0,3,-6]} intensity=${1.4}/>`}
const fitK=(w,h)=>Math.min(2.5,Math.max(1,1.27/(w/h)));
function Rig({sc}){const ctl=React.useRef();const {camera,size}=useThree();
  React.useEffect(()=>{camera.position.copy(sc.cam.clone().normalize().multiplyScalar(sc.dist*fitK(size.width,size.height)*1.35));if(ctl.current)ctl.current.target.set(0,0,0);camera.lookAt(0,0,0)},[sc]);
  useFrame((st,dt)=>{const c=ctl.current;if(!c)return;dt=Math.min(dt,.05);let tgt=V3(0,0,0),f=1;
    // com seleção: a organela vai para o centro da área livre (acima da barra)
    if(S.view==='celula'&&S.sel&&sc.anch[S.sel]){tgt=sc.anch[S.sel].clone().applyMatrix4(sc.g.matrixWorld);f=.66}
    const oy=Math.round(BAR()/2);if(!camera.view||camera.view.offsetY!==oy||camera.view.fullWidth!==size.width||camera.view.fullHeight!==size.height)camera.setViewOffset(size.width,size.height,0,oy,size.width,size.height);
    c.target.lerp(tgt,Math.min(1,dt*3));const want=sc.dist*fitK(size.width,size.height)*f*Math.pow(1.3,-S.z);const off=camera.position.clone().sub(c.target);const cur=off.length();off.setLength(cur+(want-cur)*Math.min(1,dt*4));camera.position.copy(c.target).add(off);c.update();
    const vis=2*off.length()*Math.tan(camera.fov*Math.PI/360)*size.width/size.height;updMag(size.width/(vis*sc.upu),vis*sc.upu,size.width)});
  return html`<${OrbitControls} ref=${ctl} makeDefault enablePan=${false} enableZoom=${false} enableDamping=${true} dampingFactor=${.08} rotateSpeed=${.55} minPolarAngle=${.12} maxPolarAngle=${Math.PI-.12}/>`}
// ---------- rótulos sem sobreposição (guia 5, "Rótulos") ----------
// Cada rótulo se registra; a cada quadro, do mais importante para o menos, cada um tenta ficar à direita ou à
// esquerda do seu ponto. Se não couber sem tocar num já colocado (nem nas bordas, no cartão ou na barra), fica escondido.
const LBL=new Set();const _pv=new THREE.Vector3();let _lt=0,_mr=null,_mt=0;
function layoutLabels(cam,size){const now=performance.now();if(now-_lt<90)return;_lt=now;const W=size.width,H=size.height,list=[...LBL].filter(e=>e.g&&e.d&&e.d.isConnected);
  const sp=e=>e.d.querySelector('span');const max=W<700?5:8;
  list.sort((a,b)=>b.pri()-a.pri()||a.i-b.i);
  if(!_mr||now-_mt>1000){_mt=now;const mag=document.getElementById('mag'),sr=document.getElementById('stage').getBoundingClientRect(),r=mag.getBoundingClientRect();_mr=[r.left-sr.left,r.top-sr.top,r.right-sr.left,r.bottom-sr.top]}
  const block=[_mr];
  block.push([W/2-200,H-BAR()-4,W/2+200,H]);
  const hit=(r,arr)=>arr.some(q=>r[0]<q[2]+4&&r[2]+4>q[0]&&r[1]<q[3]+3&&r[3]+3>q[1]);
  const placed=[];let n=0;
  for(const e of list){e.g.getWorldPosition(_pv).project(cam);e.x=(_pv.x*.5+.5)*W;e.y=(-_pv.y*.5+.5)*H;e.off=_pv.z>1||e.x<-8||e.x>W+8||e.y<-8||e.y>H+8}
  const dots=list.filter(e=>!e.off).map(e=>{const r=e.dot===18?11:5;return[e.x-r,e.y-r,e.x+r,e.y+r,e]});
  for(const e of list){const s=sp(e);if(!s){e.d.classList.remove('hid');continue}
    if(e.off){e.d.classList.add('hid');continue}
    const x=e.x,y=e.y;if(!e.w||e.d.dataset.t!==s.textContent){e.w=s.offsetWidth||s.textContent.length*7.5+22;e.d.dataset.t=s.textContent}
    const h=28,gap=e.dot,R=[x+gap,y-h/2,x+gap+e.w,y+h/2],L=[x-gap-e.w,y-h/2,x-gap,y+h/2];
    const od=e.dot===12&&e.i===0?[]:dots.filter(q=>q[4]!==e);// 1º rótulo do detalhe é o principal: não cede a pontos
    const okR=R[2]<W-4&&!hit(R,placed)&&!hit(R,block)&&!hit(R,od),okL=L[0]>4&&!hit(L,placed)&&!hit(L,block)&&!hit(L,od);
    const must=e.pri()>=2;let side=null;
    if(n<max||must){if(x>W*.62){side=okL?'l':okR?'r':null}else{side=okR?'r':okL?'l':null}if(!side&&must)side=x>W*.62?'l':'r'}
    e.LR=[L,R];if(side){placed.push(side==='r'?R:L);n++;e.d.classList.toggle('r',side==='l');e.d.classList.remove('hid')}else e.d.classList.add('hid')}
  // cena densa (pontos muito juntos, comum no celular): 2ª passada sem bloquear por pontos, até 3 nomes
  if(n<3)for(const e of list){if(n>=3)break;if(e.off||!e.LR||!e.d.classList.contains('hid'))continue;const [L,R]=e.LR;
    const okR=R[2]<W-4&&!hit(R,placed)&&!hit(R,block),okL=L[0]>4&&!hit(L,placed)&&!hit(L,block);const side=e.x>W*.62?(okL?'l':okR?'r':null):(okR?'r':okL?'l':null);
    if(side){placed.push(side==='r'?R:L);n++;e.d.classList.toggle('r',side==='l');e.d.classList.remove('hid')}}}
function Hot({k,p,i}){useS();const g=React.useRef(),d=React.useRef();const on=S.sel===k||S.hv===k;
  React.useEffect(()=>{const e={g:null,d:null,i,dot:18,pri:()=>S.sel===k?3:S.hv===k?2:0};const t=setInterval(()=>{e.g=g.current;e.d=d.current},200);e.g=g.current;e.d=d.current;LBL.add(e);return()=>{clearInterval(t);LBL.delete(e)}},[]);
  useFrame(()=>{if(g.current)g.current.position.copy(p)});
  return html`<group ref=${g}><${Html} portal=${PORTAL} zIndexRange=${[40,0]}><div ref=${d} className=${'hs'+(on?' on':'')} style=${{'--c':ORG[k].c}}><button aria-label=${ORG[k].t} onClick=${e=>{e.stopPropagation();choose(k)}} onPointerEnter=${()=>set({hv:k})} onPointerLeave=${()=>set({hv:null})}></button>${S.labels||on?html`<span>${ORG[k].t}</span>`:null}</div><//></group>`}
function Lab({l,i}){const g=React.useRef(),d=React.useRef();
  React.useEffect(()=>{const e={g:null,d:null,i,dot:12,pri:()=>0};const t=setInterval(()=>{e.g=g.current;e.d=d.current},200);e.g=g.current;e.d=d.current;LBL.add(e);return()=>{clearInterval(t);LBL.delete(e)}},[]);
  useFrame(()=>{if(g.current)g.current.position.copy(l.live?l.live():l[1])});
  return html`<group ref=${g}><${Html} portal=${PORTAL} zIndexRange=${[40,0]}><div ref=${d} className="dl"><i></i><span>${l[0]}</span></div><//></group>`}
// seleção: a organela escolhida ganha um realce; as outras perdem 40% da saturação (guia 5, "Brilho")
const _hsl={},_c=new THREE.Color();
function World({sc}){useS();const kg=React.useRef();
  useFrame((st,dt)=>{dt=Math.min(dt,.05);if(!S.paused){T+=dt;if(sc.tick)sc.tick(T,dt)}
    sc.g.updateMatrixWorld();if(kg.current){kg.current.position.copy(sc.g.position);kg.current.quaternion.copy(sc.g.quaternion);kg.current.scale.copy(sc.g.scale)}const now=st.clock.elapsedTime;
    const cell=S.view==='celula',focus=cell?(S.sel||S.hv):null;
    for(const m of sc.mats){const k=m.userData.k;const on=k&&k===focus;const t=on?.22+.08*Math.sin(now*4):m.userData.e0;m.emissiveIntensity+=(t-m.emissiveIntensity)*Math.min(1,dt*8);
      const c0=m.userData.c0;if(!c0)continue;const dim=focus&&!on&&k!=='membrana'?1:0;m.userData.dz=(m.userData.dz||0)+(dim-(m.userData.dz||0))*Math.min(1,dt*6);
      const q=m.userData.dz;_c.copy(c0);if(q>.002){_c.getHSL(_hsl);_c.setHSL(_hsl.h,_hsl.s*(1-.4*q),_hsl.l*(1-.25*q))}m.color.copy(_c)}
    layoutLabels(st.camera,st.size)});
  const kOf=e=>{let o=e.object;while(o&&!o.userData.k)o=o.parent;return o&&o.userData.k};
  const cell=S.view==='celula';
  const ev=cell?{onPointerMove:e=>{e.stopPropagation();const k=kOf(e);const v=k&&inList(k)?k:null;if(v!==S.hv)set({hv:v});document.body.style.cursor=v?'pointer':''},
    onPointerOut:()=>{if(S.hv)set({hv:null});document.body.style.cursor=''},onClick:e=>{e.stopPropagation();const k=kOf(e);if(k&&inList(k))choose(k)}}:{};
  const kids=cell?CELLS[S.ctype][1].filter(k=>sc.anch[k]).map((k,i)=>html`<${Hot} key=${k} k=${k} i=${i} p=${sc.anch[k]}/>`):sc.labels.map((l,i)=>html`<${Lab} key=${i} i=${i} l=${l}/>`);
  return html`<primitive object=${sc.g} dispose=${null} ...${ev}/><group ref=${kg}>${kids}</group>`}
function App(){useS();const sc=getScene(sceneKey());
  return html`<${Canvas} dpr=${[1,2]} gl=${{antialias:true,powerPreference:'high-performance'}} camera=${{fov:34,near:.05,far:120,position:[0,5,9]}}
    onPointerMissed=${()=>{if(S.view==='celula'&&S.sel){stopTour();set({sel:null})}}}>
    <${Env}/><${Lights}/><${World} key=${sceneKey()} sc=${sc}/><${Rig} sc=${sc}/><//>`}
// ---------- interface HTML ----------
const $=id=>document.getElementById(id);
const typesEl=$('types'),orgsEl=$('orgs'),viewEl=$('view');
typesEl.innerHTML=Object.keys(CELLS).map(k=>`<button role="tab" data-t="${k}"><svg aria-hidden="true"><use href="#cel-${k}"/></svg>${CELLS[k][0]}</button>`).join('');
typesEl.onclick=e=>{const b=e.target.closest('button');if(b)setType(b.dataset.t)};
orgsEl.onclick=e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.k;if(k==='celula'){stopTour();if(S.view!=='celula')back();set({sel:null});return}
  if(S.view!=='celula')set({view:'celula'});choose(k);if(innerWidth<900)viewEl.scrollIntoView({behavior:'smooth',block:'start'})};
orgsEl.onmouseover=e=>{const b=e.target.closest('button');if(S.view==='celula')set({hv:b&&b.dataset.k!=='celula'?b.dataset.k:null})};
orgsEl.onmouseleave=()=>{if(S.view==='celula')set({hv:null})};
$('back').onclick=()=>{stopTour();back()};
$('lbls').onclick=()=>set({labels:!S.labels});
$('zin').onclick=()=>set({z:Math.min(5,S.z+1)});$('zout').onclick=()=>set({z:Math.max(-2,S.z-1)});
$('reset').onclick=()=>{stopTour();if(S.view!=='celula')back();set({sel:null,hv:null,z:0})};
$('pause').onclick=()=>set({paused:!S.paused});
viewEl.addEventListener('wheel',e=>{if(!e.target.closest('canvas'))return;e.preventDefault();set({z:Math.max(-2,Math.min(5,S.z+(e.deltaY<0?.5:-.5)))})},{passive:false});
addEventListener('keydown',e=>{if(e.key==='Escape'){stopTour();if(S.view!=='celula')back();else set({sel:null})}});
// passeio guiado
let tourT=null,tourI=0;const tb=$('tour');
function stopTour(){if(tourT){clearInterval(tourT);tourT=null;tb.classList.remove('on');tb.setAttribute('aria-pressed','false');tb.querySelector('.tx').textContent='Passeio';tb.title='Começar o passeio guiado'}}
function tourStep(){const ks=CELLS[S.ctype][1];if(tourI>=ks.length){stopTour();set({sel:null,hv:null});return}const k=ks[tourI++];set({view:'celula',sel:k,hv:k})}
tb.onclick=()=>{if(tourT){stopTour();return}if(S.view!=='celula')back();tourI=0;tourStep();tb.classList.add('on');tb.setAttribute('aria-pressed','true');tb.querySelector('.tx').textContent='Parar';tb.title='Parar o passeio';tourT=setInterval(tourStep,6000)};
// painel e marcações
let lastKey='',lastList='';
function ui(){const cell=S.view==='celula';const list=S.ctype;
  if(list!==lastList){lastList=list;orgsEl.innerHTML=`<button class="all" data-k="celula">${CELLS[S.ctype][0]} inteira</button>`+CELLS[S.ctype][1].map(k=>`<button data-k="${k}"><i style="background:${ORG[k].c}"></i><span>${ORG[k].t}</span></button>`).join('')}
  const cur=cell?(S.sel||'celula'):S.view;[...orgsEl.children].forEach(b=>{const on=b.dataset.k===cur;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  [...typesEl.children].forEach(b=>{const on=b.dataset.t===S.ctype;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});
  $('back').style.display=cell?'none':'flex';const lb=$('lbls');lb.classList.toggle('on',S.labels);lb.setAttribute('aria-pressed',S.labels);
  const pb=$('pause');pb.title=pb.ariaLabel=S.paused?'Continuar animação':'Pausar animação';pb.querySelector('use').setAttribute('href',S.paused?'#ui-continuar':'#ui-pausar');
  const sk=sceneKey();if(sk!==lastKey){lastKey=sk;viewEl.classList.remove('fade');void viewEl.offsetWidth;viewEl.classList.add('fade')}
  const k=!cell?S.view:(S.sel||'celula_'+S.ctype);const o=ORG[k];const fam=FAM[o.fam]||FAM.cel;
  $('iT').textContent=o.t;$('iF').textContent=fam[0];$('iC').style.background=o.c;$('iSub').textContent=o.s;$('desc').innerHTML=o.d;
  $('kv').innerHTML=o.kv.map(([a,b])=>`<div>${a}</div><div>${b}</div>`).join('');
  $('enemT').innerHTML=ENEM[k]||'';$('enem').hidden=!ENEM[k];
  const op=cell&&S.sel&&DETB[S.sel]?`<button class="btn primary open" data-o="${S.sel}">Ver ${ORG[S.sel].t.toLowerCase()} por dentro, em 3D</button>`:'';
  $('links').innerHTML=op+o.links.map(([t,h])=>`<a class="btn" href="${h}">${t}</a>`).join('');
  const tk=!cell?S.view:(S.hv||S.sel);const tt=$('tagT'),tc=$('tagC');
  if(tk){tt.innerHTML=ORG[tk].t+(cell&&DETB[tk]?' <small>Toque de novo para ver por dentro.</small>':!cell?' <small>Em corte. Arraste para girar.</small>':'');tc.style.cssText=`display:block;background:${ORG[tk].c}`}
  else{tt.innerHTML=`${CELLS[S.ctype][0]} <small>Toque num ponto ou arraste para girar.</small>`;tc.style.cssText='display:none'}}
$('links').onclick=e=>{const b=e.target.closest('button.open');if(b){stopTour();open(b.dataset.o);viewEl.scrollIntoView({behavior:'smooth',block:'start'})}};
// cartão de ampliação (escala real): ampliação arredondada a 2 algarismos
const NICE=[1,2,5];const nf=new Intl.NumberFormat('pt-BR');
const fmtLen=um=>um>=1000?`${nf.format(+(um/1000).toPrecision(2))} mm`:um>=1?`${nf.format(+um.toPrecision(2))} µm`:`${nf.format(+(um*1000).toPrecision(2))} nm`;
const fmtMag=m=>{const r=+m.toPrecision(2);return r>=1e6?`${nf.format(+(r/1e6).toPrecision(2))} milhões de vezes`:`${nf.format(r)} vezes`};let lastMag='';
function updMag(ppu,viewUm,W){const target=Math.min(150,W*.22)/ppu;const e=Math.floor(Math.log10(target));let v=Math.pow(10,e);for(const n of NICE)if(n*Math.pow(10,e)<=target)v=n*Math.pow(10,e);
  const mag=ppu*264.6;const key=`${fmtMag(mag)}|${v}|${fmtLen(viewUm)}`;if(key===lastMag)return;lastMag=key;
  $('magX').innerHTML='<span class="pre">Ampliada </span>cerca de '+fmtMag(mag);$('magBar').style.width=Math.round(v*ppu)+'px';
  $('magL').innerHTML=`${fmtLen(v)}<span class="vw">; vista de ${fmtLen(viewUm)}</span>`;$('magU').textContent=v<1?'1 nm é um milionésimo de milímetro.':'1 µm é um milésimo de milímetro; uma hemácia tem cerca de 7 µm.'}
// início
{const h=decodeURIComponent(location.hash.slice(1));if(CELLS[h])S.ctype=h;else if(DETB[h]){if(ORG[h].veg)S.ctype='vegetal';if(h==='nucleo_lev')S.ctype='levedura';S.view=h}}
function webgl(){try{const c=document.createElement('canvas');return!!(c.getContext('webgl2')||c.getContext('webgl'))}catch(e){return false}}
addEventListener('hashchange',()=>{const h=decodeURIComponent(location.hash.slice(1));if(CELLS[h]){if(S.view!==h||S.ctype!==h)setType(h)}else if(DETB[h]&&S.view!==h){stopTour();if(ORG[h].veg&&!CELLS[S.ctype][1].includes(h))S.ctype='vegetal';if(h==='nucleo_lev')S.ctype='levedura';set({view:h,sel:null,hv:null,z:0})}});
ui();
if(webgl())ReactDOMClient.createRoot($('stage')).render(html`<${App}/>`);
else $('stage').innerHTML='<p class="nogl">Seu navegador não mostrou o 3D. Tente atualizar a página ou abrir no Chrome ou no Firefox.</p>';
