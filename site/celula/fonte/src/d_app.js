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
// ?embed=1: só a cena, sem interface, girando devagar (é a vitrine da página inicial, num iframe). Sem toque, sem
// pontos e sem nomes; com movimento reduzido, fica parada. Avisa a página de fora (postMessage) quando já desenhou.
const EMB=/[?&]embed=1(&|$)/.test(location.search);
const S={ctype:'animal',view:'celula',sel:null,hv:null,labels:!EMB,paused:RM,z:0,ver:0};
const subs=new Set();
function set(p){let ch=false;for(const k in p)if(S[k]!==p[k]){ch=true;break}if(!ch)return;Object.assign(S,p);S.ver++;subs.forEach(f=>f());ui()}
const useS=()=>React.useSyncExternalStore(cb=>{subs.add(cb);return()=>subs.delete(cb)},()=>S.ver);
const sceneKey=()=>S.view==='celula'?'c:'+S.ctype:'d:'+S.view;
const CACHE={};
function getScene(key){if(CACHE[key])return CACHE[key];MATS.length=0;const [t,k]=key.split(':');const sc=(t==='c'?CELLB[k]:DETB[k])();sc.mats=MATS.slice();MATS.length=0;sc.g.updateMatrixWorld(true);ext(sc);return CACHE[key]=sc}
const inList=k=>CELLS[S.ctype][1].includes(k);
function choose(k){stopTour();if(!inList(k))return;if(k==='mitocondria'&&typeof MODELOS!=='undefined')MODELOS.preparar('mitocondria');if(S.sel===k&&DETB[k])open(k);else set({sel:k,hv:k})}
function open(k){if(!DETB[k])return;set({view:k,sel:null,hv:null,z:0});setHash(k)}
function back(){set({view:'celula',hv:null,z:0});setHash(S.ctype)}
function setType(t){if(!CELLS[t])return;stopTour();set({ctype:t,view:'celula',sel:null,hv:null,z:0});setHash(t)}
function setHash(h){try{history.replaceState(null,'','#'+h)}catch(e){}}
let T=0;const PORTAL={current:document.getElementById('stage')};
const BAR=()=>innerWidth<700?68:76;   // altura ocupada pela barra de ferramentas embaixo do palco (px)
// ---------- componentes 3D ----------
function Env(){const {gl,scene}=useThree();React.useEffect(()=>{gl.localClippingEnabled=true;if(MAT)MAT.configurarRenderer(gl);gl.toneMappingExposure=.92;
  const pm=new THREE.PMREMGenerator(gl);const env=pm.fromScene(new RoomEnvironment(),.04).texture;scene.environment=env;scene.environmentIntensity=.38;pm.dispose();
  let bg=null,bt=null;
  if(EMB){}   // na vitrine o fundo é transparente: aparece o fundo da página de fora
  else if(MAT){bg=MAT.fundoPalco(34);scene.add(bg)}   // degradê do palco (guia 2.1), da biblioteca de materiais
  else{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');const g=x.createRadialGradient(128,120,8,128,128,200);g.addColorStop(0,'#161D33');g.addColorStop(1,'#0B0F1C');x.fillStyle=g;x.fillRect(0,0,256,256);bt=new THREE.CanvasTexture(c);bt.colorSpace=THREE.SRGBColorSpace;scene.background=bt}
  return()=>{env.dispose();if(bg){scene.remove(bg);bg.geometry.dispose();bg.material.dispose()}if(bt)bt.dispose()}},[]);return null}
// três luzes do "laboratório" (guia 5): principal morna de cima e da esquerda, preenchimento frio, contorno por trás
const LUZ=MAT?MAT.luzes(1.05):null;
function Lights(){return LUZ?html`<primitive object=${LUZ}/>`:html`<ambientLight intensity=${.2}/><directionalLight position=${[-5,5,5]} intensity=${2.3} color="#FFF4E6"/><directionalLight position=${[6,1,3]} intensity=${.7} color="#CFE0FF"/><directionalLight position=${[0,3,-6]} intensity=${1.4}/>`}
// ---------- enquadramento pela forma do modelo (revisão visual v5, ajuste 3) ----------
// A distância da câmera sai da silhueta da cena (não só da proporção do palco): o modelo é centrado na área
// livre (entre o topo ocupado pela etiqueta e pelo cartão e a barra de ferramentas) e ocupa até ~74% do lado
// menor e ~85% do maior. No celular em pé, a célula larga é girada 90° em torno do eixo da câmera, para usar a altura.
const TAN=Math.tan(17*Math.PI/180),_cv=new THREE.Vector3(),_m4=new THREE.Matrix4();
const livre=(w,h)=>{if(EMB)return{x0:8,x1:w-8,y0:8,y1:h-8};const m=w<700;return{x0:16,x1:w-16,y0:m?88:64,y1:h-BAR()-(m?6:0)}};
function ext(sc){if(sc.ext)return sc.ext;sc.g.updateMatrixWorld(true);const n=sc.cam.clone().normalize(),r=V3(0,1,0).cross(n).normalize(),u=n.clone().cross(r);
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;const box=new THREE.Box3();
  const add=(p,rad)=>{const x=p.dot(r),y=p.dot(u);x0=Math.min(x0,x-rad);x1=Math.max(x1,x+rad);y0=Math.min(y0,y-rad);y1=Math.max(y1,y+rad);box.expandByPoint(p)};
  sc.g.traverse(o=>{if(!(o.isMesh||o.isLine)||!o.geometry||!o.geometry.attributes.position)return;for(let q=o;q;q=q.parent)if(!q.visible)return;const geo=o.geometry,pos=geo.attributes.position;
    if(o.isInstancedMesh){if(!geo.boundingBox)geo.computeBoundingBox();const bb=geo.boundingBox,st=Math.max(1,Math.floor(o.count/200));
      for(let i=0;i<o.count;i+=st){o.getMatrixAt(i,_m4);_m4.premultiply(o.matrixWorld);for(let c=0;c<8;c++){_cv.set(c&1?bb.max.x:bb.min.x,c&2?bb.max.y:bb.min.y,c&4?bb.max.z:bb.min.z).applyMatrix4(_m4);add(_cv,0)}}}
    else{const st=Math.max(1,Math.floor(pos.count/400));for(let i=0;i<pos.count;i+=st){_cv.fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld);add(_cv,0)}}});
  if(x0>x1){x0=y0=-1;x1=y1=1;box.set(V3(-1,-1,-1),V3(1,1,1))}
  return sc.ext={n,r,u,cx:(x0+x1)/2,cy:(y0+y1)/2,ex:(x1-x0)/2,ey:(y1-y0)/2,box}}
const emPe=(sc,w,h)=>S.view==='celula'&&w/h<.85&&ext(sc).ex>ext(sc).ey*1.25;
function fitD(sc,w,h){const e=ext(sc),F=livre(w,h),pe=emPe(sc,w,h),EX=pe?e.ey:e.ex,EY=pe?e.ex:e.ey,Fw=F.x1-F.x0,Fh=F.y1-F.y0,m=w<700;
  const big=m?.92:.8,small=m?.8:.78,k=Math.min((Fw>=Fh?big:small)*Fw/(2*EX),(Fw>=Fh?small:big)*Fh/(2*EY));return (h/2)/(k*TAN)}
// deslocamento que leva o centro da silhueta ao centro da área livre (com a cena em pé, os eixos trocam)
function fitOff(sc,pe){const e=ext(sc);return pe?e.u.clone().multiplyScalar(e.cx).addScaledVector(e.r,-e.cy):e.r.clone().multiplyScalar(-e.cx).addScaledVector(e.u,-e.cy)}
function Rig({sc}){const ctl=React.useRef();const {camera,size}=useThree();
  React.useEffect(()=>{camera.position.copy(sc.cam.clone().normalize().multiplyScalar(fitD(sc,size.width,size.height)*1.35));if(ctl.current)ctl.current.target.set(0,0,0);camera.lookAt(0,0,0)},[sc]);
  useFrame((st,dt)=>{const c=ctl.current;if(!c)return;dt=Math.min(dt,.05);let tgt=V3(0,0,0),f=1;
    // com seleção: a organela vai para o centro da área livre
    if(S.view==='celula'&&S.sel&&sc.anch[S.sel]){tgt=sc.anch[S.sel].clone().applyMatrix4(sc.g.matrixWorld);f=.66}
    const F=livre(size.width,size.height),oy=Math.round(size.height/2-(F.y0+F.y1)/2);if(!camera.view||camera.view.offsetY!==oy||camera.view.fullWidth!==size.width||camera.view.fullHeight!==size.height)camera.setViewOffset(size.width,size.height,0,oy,size.width,size.height);
    c.target.lerp(tgt,Math.min(1,dt*3));const want=fitD(sc,size.width,size.height)*f*Math.pow(1.3,-S.z);const off=camera.position.clone().sub(c.target);const cur=off.length();off.setLength(cur+(want-cur)*Math.min(1,dt*4));camera.position.copy(c.target).add(off);c.update();
    const vis=2*off.length()*Math.tan(camera.fov*Math.PI/360)*size.width/size.height;updMag(size.width/(vis*sc.upu),vis*sc.upu,size.width)});
  return html`<${OrbitControls} ref=${ctl} makeDefault enableRotate=${!EMB} autoRotate=${EMB&&!RM} autoRotateSpeed=${.5} enablePan=${false} enableZoom=${false} enableDamping=${true} dampingFactor=${.08} rotateSpeed=${.55} minPolarAngle=${.12} maxPolarAngle=${Math.PI-.12}/>`}
// ---------- rótulos sem sobreposição (guia 5, "Rótulos") ----------
// Célula inteira: cada nome tenta ficar ao lado do seu ponto (direita, esquerda, acima, abaixo), do mais importante
// para o menos; não toca em outro nome, no cartão, na etiqueta, na barra nem em outro ponto. No computador todos os
// nomes aparecem (decisão do PM); no celular, até 5.
// Detalhe: os nomes vão para fora da silhueta, em duas fileiras (acima e abaixo do modelo), ligados ao ponto por
// uma linha-guia de 1 px. Teto do guia: 8 no computador, 5 no celular.
const LBL=new Set();const _pv=new THREE.Vector3();let _lt=0,_blk=[],_mt=0;
const hitR=(r,arr)=>arr.some(q=>r[0]<q[2]+4&&r[2]+4>q[0]&&r[1]<q[3]+3&&r[3]+3>q[1]);
function blocos(now){if(now-_mt<1000&&_blk.length)return _blk;_mt=now;const sr=document.getElementById('stage').getBoundingClientRect();_blk=[];
  for(const id of['mag','tag','back']){const el=document.getElementById(id),q=el&&el.getBoundingClientRect();if(q&&q.width)_blk.push([q.left-sr.left,q.top-sr.top,q.right-sr.left,q.bottom-sr.top])}return _blk}
function layoutLabels(cam,size,sc){const now=performance.now(),W=size.width,H=size.height,list=[...LBL].filter(e=>e.g&&e.d&&e.d.isConnected);if(!list.length)return;
  const det=list[0].dot===12;if(!det&&now-_lt<90)return;_lt=now;
  for(const e of list){e.g.getWorldPosition(_pv).project(cam);e.x=(_pv.x*.5+.5)*W;e.y=(-_pv.y*.5+.5)*H;const l=e.lr&&e.lr.current;e.off=_pv.z>1||e.x<-8||e.x>W+8||e.y<-8||e.y>H+8||!!(l&&l.off&&l.off());
    const s=e.s=e.d.querySelector('span');if(s&&(!e.w||e.d.dataset.t!==s.textContent)){e.w=s.offsetWidth||s.textContent.length*7.5+22;e.d.dataset.t=s.textContent}}
  const block=blocos(now).slice();
  if(det)return layoutDet(list,cam,W,H,sc,block);
  block.push([W/2-200,H-BAR()-4,W/2+200,H]);
  const max=W<700?5:99;list.sort((a,b)=>b.pri()-a.pri()||a.i-b.i);
  const placed=[];let n=0;
  const dots=list.filter(e=>!e.off).map(e=>[e.x-11,e.y-11,e.x+11,e.y+11,e]);
  const cand=e=>{const x=e.x,y=e.y,h=28,g=e.dot,w=e.w,R=[x+g,y-h/2,x+g+w,y+h/2,'r'],L=[x-g-w,y-h/2,x-g,y+h/2,'l'],U=[x-w/2,y-g-h,x+w/2,y-g,'t'],D=[x-w/2,y+g,x+w/2,y+g+h,'b'];return x>W*.62?[L,R,U,D]:[R,L,U,D]};
  const free=(r,od)=>r[0]>=8&&r[2]<=W-8&&r[1]>=8&&r[3]<=H-8&&!hitR(r,placed)&&!hitR(r,block)&&!(od&&hitR(r,od));
  const put=(e,r)=>{placed.push(r);n++;const c=e.d.classList;c.toggle('r',r[4]==='l');c.toggle('t',r[4]==='t');c.toggle('b',r[4]==='b');c.remove('hid')};
  for(const e of list){e.cs=null;if(!e.s){e.d.classList.remove('hid');continue}if(e.off){e.d.classList.add('hid');continue}
    const od=dots.filter(q=>q[4]!==e),must=e.pri()>=2,cs=e.cs=cand(e);let r=null;
    if(n<max||must){r=cs.find(c=>free(c,od))||null;if(!r&&must)r=cs[0]}
    if(r)put(e,r);else e.d.classList.add('hid')}
  // 2ª passada, sem bloquear por pontos: no computador, todos os nomes; no celular, até 3 quando a cena é densa
  for(const e of list){if(!e.cs||!e.d.classList.contains('hid'))continue;if(!(W>=700||n<3))continue;const r=e.cs.find(c=>free(c));if(r)put(e,r)}}
const _dc=new THREE.Vector3();
function layoutDet(list,cam,W,H,sc,block){const F=livre(W,H),h=28,gap=8,max=W<700?5:8;
  // silhueta na tela: caixa da cena projetada
  let sy0=1e9,sy1=-1e9;const bx=ext(sc).box,pm=sc.g.parent?sc.g.parent.matrixWorld:null;
  for(let i=0;i<8;i++){_dc.set(i&1?bx.max.x:bx.min.x,i&2?bx.max.y:bx.min.y,i&4?bx.max.z:bx.min.z);if(pm)_dc.applyMatrix4(pm);_dc.project(cam);const y=(-_dc.y*.5+.5)*H;sy0=Math.min(sy0,y);sy1=Math.max(sy1,y)}
  const mid=(sy0+sy1)/2,yT=Math.max(F.y0,Math.min(sy0-24-h,mid-60-h)),yB=Math.min(F.y1-h-8,Math.max(sy1+24,mid+60));
  // faixa livre de cada fileira: recua onde há cartão, etiqueta ou botão
  const faixa=y=>{let lo=16,hi=W-16;for(const q of block){if(y<q[3]+6&&y+h+6>q[1]){if((q[0]+q[2])/2<W/2)lo=Math.max(lo,q[2]+8);else hi=Math.min(hi,q[0]-8)}}return[lo,hi]};
  const rows=[{y:yT,f:faixa(yT),it:[],used:0,top:true},{y:yB,f:faixa(yB),it:[],used:0,top:false}];
  list.sort((a,b)=>a.i-b.i);let n=0;
  for(const e of list){e.row=null;if(!e.s||e.off||n>=max)continue;
    const pref=e.y<mid?0:1;for(const ri of[pref,1-pref]){const R=rows[ri],need=e.w+(R.it.length?gap:0);if(R.used+need<=R.f[1]-R.f[0]){R.it.push(e);R.used+=need;e.row=R;n++;break}}}
  for(const R of rows){R.it.sort((a,b)=>a.x-b.x);let prev=R.f[0]-gap;for(const e of R.it){e.px=Math.max(e.x-e.w/2,prev+gap);prev=e.px+e.w}
    let nx=R.f[1]+gap;for(let i=R.it.length-1;i>=0;i--){const e=R.it[i];e.px=Math.min(e.px,nx-gap-e.w);nx=e.px}}
  for(const e of list){if(!e.s)continue;const c=e.d.classList;if(!e.row){if(!c.contains('hid'))c.add('hid');continue}
    if(c.contains('hid'))c.remove('hid');const R=e.row,l=Math.round(e.px-e.x),t=Math.round(R.y-e.y),key=l+','+t;if(e.k===key)continue;e.k=key;
    e.s.style.left=l+'px';e.s.style.top=t+'px';
    const ln=e.d.querySelector('b');if(ln){const ax=Math.max(e.px+12,Math.min(e.px+e.w-12,e.x))-e.x,ay=(R.top?R.y+h:R.y)-e.y;ln.style.width=Math.max(0,Math.hypot(ax,ay)-5)+'px';ln.style.transform='rotate('+Math.atan2(ay,ax)+'rad) translateX(5px)'}}}
function Hot({k,p,i}){useS();const g=React.useRef(),d=React.useRef();const on=S.sel===k||S.hv===k;
  React.useEffect(()=>{const e={g:null,d:null,i,dot:18,pri:()=>S.sel===k?3:S.hv===k?2:0};const t=setInterval(()=>{e.g=g.current;e.d=d.current},200);e.g=g.current;e.d=d.current;LBL.add(e);return()=>{clearInterval(t);LBL.delete(e)}},[]);
  useFrame(()=>{if(g.current)g.current.position.copy(p)});
  return html`<group ref=${g}><${Html} portal=${PORTAL} zIndexRange=${[40,0]}><div ref=${d} className=${'hs'+(on?' on':'')} style=${{'--c':ORG[k].c}}><button aria-label=${ORG[k].t} onClick=${e=>{e.stopPropagation();choose(k)}} onPointerEnter=${()=>set({hv:k})} onPointerLeave=${()=>set({hv:null})}></button>${S.labels||on?html`<span>${ORG[k].t}</span>`:null}</div><//></group>`}
function Lab({l,i}){const g=React.useRef(),d=React.useRef(),lr=React.useRef(l);lr.current=l;
  React.useEffect(()=>{const e={g:null,d:null,i,dot:12,lr,pri:()=>0};const t=setInterval(()=>{e.g=g.current;e.d=d.current},200);e.g=g.current;e.d=d.current;LBL.add(e);return()=>{clearInterval(t);LBL.delete(e)}},[]);
  useFrame(()=>{if(g.current)g.current.position.copy(l.live?l.live():l[1])});
  return html`<group ref=${g}><${Html} portal=${PORTAL} zIndexRange=${[40,0]}><div ref=${d} className="dl hid"><b></b><i></i><span>${l[0]}</span></div><//></group>`}
// seleção: a organela escolhida ganha um realce; as outras perdem 40% da saturação (guia 5, "Brilho")
const _hsl={},_c=new THREE.Color();let avisou=false,quadrosEmb=0;
function World({sc}){useS();DESEMPENHO.simplificar(sc.mats);const kg=React.useRef();const size=useThree(st=>st.size);const pe=emPe(sc,size.width,size.height);
  const [rq,ro]=React.useMemo(()=>[new THREE.Quaternion().setFromAxisAngle(ext(sc).n,pe?-Math.PI/2:0),fitOff(sc,pe)],[sc,pe]);
  useFrame((st,dt)=>{dt=Math.min(dt,.05);if(!S.paused){T+=dt;if(sc.tick)sc.tick(T,dt)}
    if(kg.current){kg.current.position.copy(sc.g.position);kg.current.quaternion.copy(sc.g.quaternion);kg.current.scale.copy(sc.g.scale)}const now=st.clock.elapsedTime;
    const cell=S.view==='celula',focus=cell?(S.sel||S.hv):null;
    for(const m of sc.mats){const k=m.userData.k;const on=k&&k===focus;const t=on?.22+.08*Math.sin(now*4):m.userData.e0;m.emissiveIntensity+=(t-m.emissiveIntensity)*Math.min(1,dt*8);
      const c0=m.userData.c0;if(!c0)continue;const dim=focus&&!on&&k!=='membrana'?1:0;m.userData.dz=(m.userData.dz||0)+(dim-(m.userData.dz||0))*Math.min(1,dt*6);
      const q=m.userData.dz;_c.copy(c0);if(q>.002){_c.getHSL(_hsl);_c.setHSL(_hsl.h,_hsl.s*(1-.4*q),_hsl.l*(1-.25*q))}m.color.copy(_c)}
    if(EMB&&!avisou&&++quadrosEmb>3){avisou=true;document.documentElement.classList.add('pronta');try{if(parent!==window)parent.postMessage({lab:'celula-pronta'},'*')}catch(e){}}
    layoutLabels(st.camera,st.size,sc)});
  const kOf=e=>{let o=e.object;while(o&&!o.userData.k)o=o.parent;return o&&o.userData.k};
  const cell=S.view==='celula'&&!EMB;
  const ev=cell?{onPointerMove:e=>{e.stopPropagation();const k=kOf(e);const v=k&&inList(k)?k:null;if(v!==S.hv)set({hv:v});document.body.style.cursor=v?'pointer':''},
    onPointerOut:()=>{if(S.hv)set({hv:null});document.body.style.cursor=''},onClick:e=>{e.stopPropagation();const k=kOf(e);if(k&&inList(k))choose(k)}}:{};
  const kids=EMB?[]:cell?CELLS[S.ctype][1].filter(k=>sc.anch[k]).map((k,i)=>html`<${Hot} key=${k} k=${k} i=${i} p=${sc.anch[k]}/>`):sc.labels.map((l,i)=>html`<${Lab} key=${i} i=${i} l=${l}/>`);
  return html`<group quaternion=${rq} position=${ro}><primitive object=${sc.g} dispose=${null} ...${ev}/><group ref=${kg}>${kids}</group></group>`}
function App(){useS();const sc=getScene(sceneKey());
  return html`<${Canvas} dpr=${DESEMPENHO.dpr} gl=${{antialias:true,powerPreference:'high-performance'}} camera=${{fov:34,near:.05,far:120,position:[0,5,9]}}
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
  $('magL').textContent=fmtLen(v);$('magV').textContent='Vista de '+fmtLen(viewUm);
  // a explicação da unidade aparece só na primeira vez (por sessão); depois o cartão fica só com os números
  const un=v<1?'nm':'um',sk=sceneKey()+un;if(sk!==magSK){magSK=sk;let visto=false;try{visto=!!sessionStorage.getItem('lab-cel-'+un);sessionStorage.setItem('lab-cel-'+un,'1')}catch(e){}
    $('magN').hidden=visto;$('magU').textContent=un==='nm'?'1 nm é um milionésimo de milímetro.':'1 µm é um milésimo de milímetro; uma hemácia tem cerca de 7 µm.'}}
let magSK='';
// início
{const h=decodeURIComponent(location.hash.slice(1));if(CELLS[h])S.ctype=h;else if(DETB[h]){if(ORG[h].veg)S.ctype='vegetal';if(h==='nucleo_lev')S.ctype='levedura';S.view=h}}
function webgl(){try{const c=document.createElement('canvas');return!!(c.getContext('webgl2')||c.getContext('webgl'))}catch(e){return false}}
addEventListener('hashchange',()=>{const h=decodeURIComponent(location.hash.slice(1));if(CELLS[h]){if(S.view!==h||S.ctype!==h)setType(h)}else if(DETB[h]&&S.view!==h){stopTour();if(ORG[h].veg&&!CELLS[S.ctype][1].includes(h))S.ctype='vegetal';if(h==='nucleo_lev')S.ctype='levedura';set({view:h,sel:null,hv:null,z:0})}});
ui();
if(webgl())ReactDOMClient.createRoot($('stage')).render(html`<${App}/>`);
else $('stage').innerHTML='<p class="nogl">Seu navegador não mostrou o 3D. Tente atualizar a página ou abrir no Chrome ou no Firefox.</p>';
