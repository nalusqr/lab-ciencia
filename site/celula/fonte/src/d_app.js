// ================= APP: estado, cena React Three Fiber e interface =================
const CELLS={
 vegetal:['Célula vegetal',['nucleo','cloroplasto','vacuolo','mitocondria','re','golgi','ribossomo','peroxissomo','membrana']],
 animal:['Célula animal',['nucleo','mitocondria','re','golgi','ribossomo','lisossomo','peroxissomo','centriolo','citoesqueleto','membrana']],
 bacteria:['Célula bacteriana',['nucleoide','plasmidio','ribo70','parede_bac','flagelo','pili']],
 neuronio:['Neurônio',['nucleo','dendrito','axonio','mielina','sinapse','mitocondria']],
 esperma:['Espermatozoide',['acrossomo','nucleo_esp','peca_int','cauda']],
 levedura:['Levedura',['nucleo','vacuolo_lev','mitocondria','broto','parede_lev']],
 sangue:['Células do sangue',['hemacia','leucocito','plaqueta']],
 fago:['Bacteriófago (vírus)',['capsideo','dna_fago','cauda_fago','fibras']]};
const ICONS={
 vegetal:'<path d="M10 1.5 17.5 6v8L10 18.5 2.5 14V6z" fill="#3a5a1a" stroke="#a9e34b" stroke-width="1.6"/><ellipse cx="8" cy="11" rx="3.2" ry="3.6" fill="#15aabf"/><circle cx="12.5" cy="7.5" r="2.2" fill="#9775fa"/>',
 animal:'<ellipse cx="10" cy="10" rx="8.5" ry="7.3" fill="#3d2456" stroke="#f06595" stroke-width="1.6"/><circle cx="9" cy="10" r="3.2" fill="#9775fa"/><rect x="13" y="6" width="3" height="1.6" rx=".8" fill="#ff6b35"/>',
 bacteria:'<rect x="2.5" y="6" width="13" height="8" rx="4" fill="#34253f" stroke="#82c91e" stroke-width="1.6"/><path d="M2.5 10c-1-2-2 0-2.3-1" stroke="#ffa94d" fill="none"/><circle cx="9" cy="10" r="2" fill="none" stroke="#4dabf7" stroke-width="1.2"/>',
 neuronio:'<circle cx="6" cy="10" r="3.3" fill="#f08c00"/><path d="M9 10h9M3.5 7.5 1 5M3.5 12.5 1 15M6 6.7 5 3" stroke="#ffe066" stroke-width="1.5" stroke-linecap="round"/><rect x="11" y="8.6" width="3" height="2.8" rx="1.4" fill="#e9ecef"/>',
 esperma:'<ellipse cx="5" cy="10" rx="3.6" ry="2.6" fill="#7b5cd6"/><path d="M8.5 10c2 0 2.5-2 4.5-2s2 4 4 4 1.5-1.5 2.5-1.5" stroke="#a5d8ff" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
 levedura:'<ellipse cx="8" cy="11" rx="6" ry="5.6" fill="#d9b26f"/><circle cx="15.5" cy="6.5" r="3" fill="#d9b26f"/><circle cx="7" cy="12" r="2" fill="#15aabf"/>',
 sangue:'<circle cx="7" cy="9" r="5" fill="#d6262a"/><circle cx="7" cy="9" r="2.2" fill="#8a0d14"/><circle cx="15" cy="13" r="3.6" fill="#cdbfe6"/><circle cx="15" cy="13" r="1.5" fill="#7048e8"/>',
 fago:'<path d="M10 1.5l3.5 2v4L10 9.5 6.5 7.5v-4z" fill="#adb5bd"/><rect x="9" y="9.5" width="2" height="5.5" fill="#ced4da"/><path d="M9 15 5 18.5M11 15l4 3.5M9 15l-2.5 4M11 15l2.5 4" stroke="#868e96" stroke-width="1.2"/>'};
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const S={ctype:'animal',view:'celula',sel:null,hv:null,labels:false,paused:RM,z:0,ver:0};
const subs=new Set();
function set(p){let ch=false;for(const k in p)if(S[k]!==p[k]){ch=true;break}if(!ch)return;Object.assign(S,p);S.ver++;subs.forEach(f=>f());ui()}
const useS=()=>React.useSyncExternalStore(cb=>{subs.add(cb);return()=>subs.delete(cb)},()=>S.ver);
const sceneKey=()=>S.view==='celula'?'c:'+S.ctype:'d:'+S.view;
const CACHE={};
function getScene(key){if(CACHE[key])return CACHE[key];MATS.length=0;const [t,k]=key.split(':');const sc=(t==='c'?CELLB[k]:DETB[k])();sc.mats=MATS.slice();MATS.length=0;sc.g.updateMatrixWorld(true);return CACHE[key]=sc}
const inList=k=>CELLS[S.ctype][1].includes(k);
function choose(k){stopTour();if(!inList(k))return;if(S.sel===k&&DETB[k])open(k);else set({sel:k,hv:k})}
function open(k){if(!DETB[k])return;set({view:k,sel:null,hv:null,z:0});setHash(k)}
function back(){set({view:'celula',hv:null,z:0});setHash(S.ctype)}
function setType(t){if(!CELLS[t])return;stopTour();set({ctype:t,view:'celula',sel:null,hv:null,z:0});setHash(t)}
function setHash(h){try{history.replaceState(null,'','#'+h)}catch(e){}}
let T=0;const PORTAL={current:document.getElementById("stage")};
// ---------- componentes 3D ----------
function Env(){const {gl,scene}=useThree();React.useEffect(()=>{gl.localClippingEnabled=true;const pm=new THREE.PMREMGenerator(gl);const env=pm.fromScene(new RoomEnvironment(),.04).texture;scene.environment=env;scene.environmentIntensity=.55;
  const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');const g=x.createRadialGradient(256,230,10,256,256,400);g.addColorStop(0,'#1d2446');g.addColorStop(.5,'#0f1329');g.addColorStop(1,'#05060c');x.fillStyle=g;x.fillRect(0,0,512,512);
  const bt=new THREE.CanvasTexture(c);bt.colorSpace=THREE.SRGBColorSpace;scene.background=bt;pm.dispose();return()=>{env.dispose();bt.dispose()}},[]);return null}
function Lights(){return html`<ambientLight intensity=${.22}/><directionalLight position=${[4,7,5]} intensity=${2.4} color="#fff1df"/><directionalLight position=${[-6,2,-5]} intensity=${1.3} color="#7fb4ff"/><pointLight position=${[0,-4,3]} intensity=${10} distance=${14} color="#e599f7"/>`}
const fitK=(w,h)=>Math.min(2.5,Math.max(1,1.27/(w/h)));
function Rig({sc}){const ctl=React.useRef();const {camera,size}=useThree();
  React.useEffect(()=>{camera.position.copy(sc.cam.clone().normalize().multiplyScalar(sc.dist*fitK(size.width,size.height)*1.35));if(ctl.current)ctl.current.target.set(0,0,0);camera.lookAt(0,0,0)},[sc]);
  useFrame((st,dt)=>{const c=ctl.current;if(!c)return;dt=Math.min(dt,.05);let tgt=V3(0,0,0),f=1;
    if(S.view==='celula'&&S.sel&&sc.anch[S.sel]){tgt=sc.anch[S.sel].clone().applyMatrix4(sc.g.matrixWorld).multiplyScalar(.8);f=.7}
    const oy=Math.round(Math.min(40,size.height*.05));if(!camera.view||camera.view.offsetY!==oy||camera.view.fullWidth!==size.width||camera.view.fullHeight!==size.height)camera.setViewOffset(size.width,size.height,0,oy,size.width,size.height);
    c.target.lerp(tgt,Math.min(1,dt*2.5));const want=sc.dist*fitK(size.width,size.height)*f*Math.pow(1.3,-S.z);const off=camera.position.clone().sub(c.target);const cur=off.length();off.setLength(cur+(want-cur)*Math.min(1,dt*3.5));camera.position.copy(c.target).add(off);c.update();
    const vis=2*off.length()*Math.tan(camera.fov*Math.PI/360)*size.width/size.height;updMag(size.width/(vis*sc.upu),vis*sc.upu,size.width)});
  return html`<${OrbitControls} ref=${ctl} makeDefault enablePan=${false} enableZoom=${false} enableDamping=${true} dampingFactor=${.08} rotateSpeed=${.55} minPolarAngle=${.12} maxPolarAngle=${Math.PI-.12}/>`}
const _pv=new THREE.Vector3();function flip(g,d,cam){if(!g||!d)return;g.getWorldPosition(_pv).project(cam);d.classList.toggle('r',_pv.x>.3)}
function Hot({k,p}){useS();const g=React.useRef(),d=React.useRef();useFrame(st=>{if(g.current){g.current.position.copy(p);flip(g.current,d.current,st.camera)}});const on=S.sel===k||S.hv===k;
  return html`<group ref=${g}><${Html} portal=${PORTAL} zIndexRange=${[40,0]}><div ref=${d} className=${'hs'+(on?' on':'')} style=${{'--c':ORG[k].c}}><button aria-label=${ORG[k].t} onClick=${e=>{e.stopPropagation();choose(k)}} onPointerEnter=${()=>set({hv:k})} onPointerLeave=${()=>set({hv:null})}></button>${S.labels||on?html`<span>${ORG[k].t}</span>`:null}</div><//></group>`}
function Lab({l}){const g=React.useRef(),d=React.useRef();useFrame(st=>{if(g.current){g.current.position.copy(l.live?l.live():l[1]);flip(g.current,d.current,st.camera)}});
  return html`<group ref=${g}><${Html} portal=${PORTAL} zIndexRange=${[40,0]}><div ref=${d} className="dl"><i></i><span>${l[0]}</span></div><//></group>`}
function World({sc}){useS();const kg=React.useRef();
  useFrame((st,dt)=>{dt=Math.min(dt,.05);if(!S.paused){T+=dt;if(sc.tick)sc.tick(T,dt);if(S.view==='celula'&&!S.sel)sc.g.rotation.y+=(Math.sin(T*.15)*.4-sc.g.rotation.y)*Math.min(1,dt*2)}
    sc.g.updateMatrixWorld();if(kg.current){kg.current.position.copy(sc.g.position);kg.current.quaternion.copy(sc.g.quaternion);kg.current.scale.copy(sc.g.scale)}const now=st.clock.elapsedTime;
    for(const m of sc.mats){const k=m.userData.k;const on=k&&(k===S.sel||k===S.hv)&&S.view==='celula';const t=on?.32+.14*Math.sin(now*4):m.userData.e0;m.emissiveIntensity+=(t-m.emissiveIntensity)*Math.min(1,dt*8)}});
  const kOf=e=>{let o=e.object;while(o&&!o.userData.k)o=o.parent;return o&&o.userData.k};
  const cell=S.view==='celula';
  const ev=cell?{onPointerMove:e=>{e.stopPropagation();const k=kOf(e);const v=k&&inList(k)?k:null;if(v!==S.hv)set({hv:v});document.body.style.cursor=v?'pointer':''},
    onPointerOut:()=>{if(S.hv)set({hv:null});document.body.style.cursor=''},onClick:e=>{e.stopPropagation();const k=kOf(e);if(k&&inList(k))choose(k)}}:{};
  const kids=cell?CELLS[S.ctype][1].filter(k=>sc.anch[k]).map(k=>html`<${Hot} key=${k} k=${k} p=${sc.anch[k]}/>`):sc.labels.map((l,i)=>html`<${Lab} key=${i} l=${l}/>`);
  return html`<primitive object=${sc.g} dispose=${null} ...${ev}/><group ref=${kg}>${kids}</group>`}
function App(){useS();const sc=getScene(sceneKey());
  return html`<${Canvas} dpr=${[1,2]} gl=${{antialias:true,powerPreference:'high-performance'}} camera=${{fov:34,near:.05,far:120,position:[0,5,9]}}
    onPointerMissed=${()=>{if(S.view==='celula'&&S.sel){stopTour();set({sel:null})}}}>
    <${Env}/><${Lights}/><${World} key=${sceneKey()} sc=${sc}/><${Rig} sc=${sc}/><//>`}
// ---------- interface HTML ----------
const $=id=>document.getElementById(id);
const typesEl=$('types'),orgsEl=$('orgs'),viewEl=$('view');
typesEl.innerHTML=Object.keys(CELLS).map(k=>`<button data-t="${k}"><svg viewBox="0 0 20 20" aria-hidden="true">${ICONS[k]}</svg>${CELLS[k][0]}</button>`).join('');
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
function stopTour(){if(tourT){clearInterval(tourT);tourT=null;tb.classList.remove('on');tb.querySelector('.tx').textContent='Tour'}}
function tourStep(){const ks=CELLS[S.ctype][1];if(tourI>=ks.length){stopTour();set({sel:null,hv:null});return}const k=ks[tourI++];set({view:'celula',sel:k,hv:k})}
tb.onclick=()=>{if(tourT){stopTour();return}if(S.view!=='celula')back();tourI=0;tourStep();tb.classList.add('on');tb.querySelector('.tx').textContent='Parar';tourT=setInterval(tourStep,6000)};
// ficha e marcações
let lastKey='',lastList='';
function ui(){const cell=S.view==='celula';const list=S.ctype;
  if(list!==lastList){lastList=list;orgsEl.innerHTML=`<button class="all" data-k="celula">${CELLS[S.ctype][0]} inteira</button>`+CELLS[S.ctype][1].map(k=>`<button data-k="${k}"><i style="background:${ORG[k].c}"></i><span>${ORG[k].t}</span></button>`).join('')}
  const cur=cell?(S.sel||'celula'):S.view;[...orgsEl.children].forEach(b=>b.classList.toggle('on',b.dataset.k===cur));[...typesEl.children].forEach(b=>b.classList.toggle('on',b.dataset.t===S.ctype));
  $('back').style.display=cell?'none':'block';$('lbls').classList.toggle('on',S.labels);const pb=$('pause');pb.classList.toggle('on',S.paused);pb.title=S.paused?'Continuar animação':'Pausar animação';
  const sk=sceneKey();if(sk!==lastKey){lastKey=sk;viewEl.classList.remove('fade');void viewEl.offsetWidth;viewEl.classList.add('fade')}
  const k=!cell?S.view:(S.sel||'celula_'+S.ctype);const o=ORG[k];
  $('iT').textContent=o.t;$('iS').textContent=o.s;$('iC').style.cssText=`background:${o.c};box-shadow:0 0 12px ${o.c}`;$('desc').innerHTML=o.d;
  $('kv').innerHTML=o.kv.map(([a,b])=>`<div>${a}</div><div>${b}</div>`).join('');
  const op=cell&&S.sel&&DETB[S.sel]?`<button class="open" data-o="${S.sel}">Ver ${ORG[S.sel].t.toLowerCase()} por dentro, em 3D</button>`:'';
  $('links').innerHTML=op+o.links.map(([t,h])=>`<a href="${h}">${t}</a>`).join('');
  const tk=!cell?S.view:(S.hv||S.sel);const tt=$('tagT'),tc=$('tagC');
  if(tk){tt.innerHTML=ORG[tk].t+(cell&&DETB[tk]?' <small>· toque de novo para ver por dentro</small>':!cell?' <small>· em corte, arraste para girar</small>':'');tc.style.cssText=`background:${ORG[tk].c};color:${ORG[tk].c}`}
  else{tt.innerHTML=`${CELLS[S.ctype][0]} <small>· toque num ponto ou arraste para girar</small>`;tc.style.cssText='display:none'}}
$('links').onclick=e=>{const b=e.target.closest('button.open');if(b){stopTour();open(b.dataset.o);viewEl.scrollIntoView({behavior:'smooth',block:'start'})}};
// cartão de ampliação (escala real)
const NICE=[1,2,5];const fmtLen=um=>um>=1?`${+um.toPrecision(3)} µm`.replace('.',','):`${Math.round(um*1000)} nm`;let lastMag='';
function updMag(ppu,viewUm,W){const target=Math.min(150,W*.22)/ppu;const e=Math.floor(Math.log10(target));let v=Math.pow(10,e);for(const n of NICE)if(n*Math.pow(10,e)<=target)v=n*Math.pow(10,e);
  const mag=ppu*264.6;const key=`${Math.round(mag/Math.pow(10,Math.floor(Math.log10(mag))-2))}|${v}`;if(key===lastMag)return;lastMag=key;
  $('magX').textContent='ampliado ×'+Math.round(mag).toLocaleString('pt-BR');$('magBar').style.width=Math.round(v*ppu)+'px';
  $('magL').textContent=`${fmtLen(v)} · ${fmtLen(viewUm)} de largura na vista`;$('magU').textContent=v<1?'Um nanômetro (nm) é um milionésimo de milímetro.':'Um micrômetro (µm) é um milésimo de milímetro.'}
// início
{const h=decodeURIComponent(location.hash.slice(1));if(CELLS[h])S.ctype=h;else if(DETB[h]){if(ORG[h].veg)S.ctype='vegetal';S.view=h}}
function webgl(){try{const c=document.createElement('canvas');return!!(c.getContext('webgl2')||c.getContext('webgl'))}catch(e){return false}}
addEventListener('hashchange',()=>{const h=decodeURIComponent(location.hash.slice(1));if(CELLS[h]){if(S.view!==h||S.ctype!==h)setType(h)}else if(DETB[h]&&S.view!==h){stopTour();if(ORG[h].veg&&!CELLS[S.ctype][1].includes(h))S.ctype='vegetal';set({view:h,sel:null,hv:null,z:0})}});
ui();
if(webgl())ReactDOMClient.createRoot($('stage')).render(html`<${App}/>`);
else $('stage').innerHTML='<p class="nogl">Este navegador não conseguiu ligar o WebGL, que desenha a célula em 3D. Tente atualizar o navegador ou ativar a aceleração por hardware.</p>';
