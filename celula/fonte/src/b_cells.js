// ================= 3D: as 8 células =================
const C=k=>ORG[k].c;
const ellIn=(a,b,c,o=V3(0,0,0))=>(p,m=0)=>((p.x-o.x)/a)**2+((p.y-o.y)/b)**2+((p.z-o.z)/c)**2<(1-m)**2;
const supIn=(a,b,c,e,o=V3(0,0,0))=>(p,m=0)=>{const q=2/e;return Math.abs((p.x-o.x)/(a*(1-m)))**q+Math.abs((p.y-o.y)/(b*(1-m)))**q+Math.abs((p.z-o.z)/(c*(1-m)))**q<1};
const rndIn=(a,b,c,o=V3(0,0,0))=>()=>V3(o.x+rr(-a,a),o.y+rr(-b,b),o.z+rr(-c,c));
// pontos na superfície de um elipsoide, na direção d
const ellSurf=(a,b,c,d)=>{d=d.clone().normalize();const k=1/Math.sqrt((d.x/a)**2+(d.y/b)**2+(d.z/c)**2);return d.multiplyScalar(k)};
// membrana com vidro + brilho de borda
function shell(G,geo,k,tint,rim,o={}){const b=noPick(mesh(geo,M(null,tint,{transparent:true,opacity:o.back||.08,depthWrite:false,side:THREE.BackSide,roughness:.6,clearcoat:0,sheen:0})));b.renderOrder=-1;G.add(b);const m=mesh(geo,GLASS(k,tint,o));m.renderOrder=2;G.add(k&&o.pick?m:noPick(m));const r=noPick(mesh(geo,RIM(rim,o.rimI||.85,2.4)));r.scale.setScalar(1.004);r.renderOrder=3;G.add(r);return m}
// núcleo em corte (envelope com poros, nucléolo e cromatina)
function nucleus(G,k,pos,r,col=C('nucleo')){const cut=.8,face=Math.PI/2;
  const env=bumpy(new THREE.SphereGeometry(r,72,54,face+cut,TAU-2*cut),r*.04,3.2/r*.5,7,col,.35);
  G.add(mesh(env,M(k,'#fff',{vc:true,side:THREE.DoubleSide,roughness:.5,clearcoat:.3}),k,pos));
  const pores=[];for(let i=0;i<70;i++){const d=V3(rr(-1,1),rr(-1,1),rr(-1,1)).normalize();let ph=Math.atan2(d.z,-d.x);if(ph<0)ph+=TAU;if(Math.abs(ph-face)<cut+.08)continue;
    pores.push({p:pos.clone().addScaledVector(d,r*1.01),q:new THREE.Quaternion().setFromUnitVectors(V3(0,0,1),d),s:r/.78})}
  G.add(inst(new THREE.TorusGeometry(.03,.011,6,14),M(k,'#E2D6FF',{roughness:.45}),k,pores));
  G.add(mesh(bumpy(sphG(r*.38,40),r*.05,6,2,'#6A45D8',.4),M(k,'#fff',{vc:true,roughness:.6}),k,pos.clone().add(V3(r*.15,-r*.08,r*.05))));
  const inn=ellIn(r*.88,r*.88,r*.88,pos);for(let i=0;i<5;i++){const w=walk(40,r*.12,p=>inn(p),pos.clone().add(V3(rr(-.4,.4)*r,rr(-.4,.4)*r,rr(-.4,.4)*r)));if(w.length>4)G.add(mesh(tubeG(w,r*.022,140,5),M(k,'#C9B6FF',{roughness:.62}),k))}
  return pos.clone().add(V3(0,r*.95,0))}
const MITO={};
function mito(G,p,len,r,rot){const g=bumpy(capG(r,len,24),r*.12,9,rr(0,9),C('mitocondria'),.35);
  if(!MITO.m){MITO.m=M('mitocondria','#fff',{vc:true,roughness:.32,transparent:true,opacity:.62,depthWrite:false,clearcoat:.6});MITO.c=M('mitocondria','#C2452E',{roughness:.5,side:THREE.DoubleSide})}
  const o=mesh(g,MITO.m,'mitocondria',p,rot);o.renderOrder=1;
  // cristas: dobras da membrana interna, vistas através da casca
  const n=Math.max(3,Math.round(len/r*2.2));for(let i=0;i<n;i++){const y=-len/2+(i+.5)*len/n,sg=i%2?1:-1;const c=mesh(new THREE.CylinderGeometry(r*.78,r*.78,r*.07,16,1,false,0,Math.PI*1.25),MITO.c,'mitocondria',[0,y,0],[0,sg*1.1+rr(-.3,.3),0]);c.scale.set(1,1,.85);o.add(c)}
  G.add(o);return o}
function erSheets(G,ctr,r0,n,arc,ph,h=4){const pts=[];for(let i=0;i<n;i++){const R=r0+i*.13;const tg=bumpy(new THREE.TorusGeometry(R,.04,10,110,arc),.025,4,i,C('re'),.25);
    const o=mesh(tg,M('re','#fff',{vc:true,roughness:.4}),'re',ctr,[-Math.PI/2,0,ph+i*.25]);o.scale.set(1,1,h);G.add(o);o.updateMatrix();
    for(let j=0;j<120;j++){const u=rr(0,arc),v=rnd()<.5?0:Math.PI;const t=.04;pts.push({p:V3((R+t*1.25*Math.cos(v))*Math.cos(u),(R+t*1.25*Math.cos(v))*Math.sin(u),rr(-t,t)).applyMatrix4(o.matrix),s:1})}}
  G.add(inst(sphG(.017,8),M('ribossomo',C('ribossomo'),{roughness:.5}),'ribossomo',pts));return pts}
function golgi(G,p,sc=1,rotY=0){const g=new THREE.Group();g.position.copy(p);g.rotation.y=rotY;g.scale.setScalar(sc);const m=M('golgi',C('golgi'),{roughness:.3,clearcoat:.8});
  for(let i=0;i<5;i++){const tg=bumpy(new THREE.TorusGeometry(.3+i*.075,.028,10,50,1.5-i*.08),.012,6,i);const o=mesh(tg,m,'golgi',[0,0,0],[-Math.PI/2,0,-.75+i*.04]);o.scale.set(1,1,3.4-i*.3);g.add(o)}
  const ves=[];for(let i=0;i<9;i++){const a=rr(-1.1,1.1),R=rr(.2,.75);ves.push({p:V3(Math.cos(a)*R,rr(-.12,.12),-Math.sin(a)*R*.4+rr(-.1,.1)),s:rr(.7,1.3)})}
  g.add(inst(sphG(.035,14),m,'golgi',ves));G.add(g);return g}
function ribos(G,k,n,gen,ok,r=.016){const pts=[];for(let i=0;i<n*4&&pts.length<n;i++){const p=gen();if(ok(p))pts.push({p,s:rr(.8,1.2)})}G.add(inst(sphG(r,8),M(k,C(k==='ribo70'?'ribo70':'ribossomo'),{roughness:.55}),k,pts));return pts}
const up=(p,d=.15)=>p.clone().add(V3(0,d,0));

// ---------- vida: corrente citoplasmática, organelas que se mexem ----------
// o.vol = [a,b,c,centro]: partículas do citosol girando devagar dentro do elipsoide (corrente citoplasmática), num shader barato.
// o.ok(p): filtro opcional para as partículas (fora do núcleo, do vacúolo...). As organelas listadas em o.mexe oscilam de leve.
function vida(s,o={}){const G=s.g,base=[];const ks=new Set(o.mexe||['mitocondria','lisossomo','peroxissomo']);
  G.children.forEach(c=>{if(ks.has(c.userData.k)&&c.isMesh)base.push({o:c,p:c.position.clone(),q:c.quaternion.clone(),f:rnd()*TAU,a:(o.amp||.035)*rr(.6,1.2)})});
  let U=null;
  if(o.vol){const [a,b,c,ct]=o.vol,n=o.n||(innerWidth<700?260:600),P=[],S=[],F=[];
    for(let i=0;i<n*6&&P.length<n*3;i++){const q=V3(rr(-1,1),rr(-1,1),rr(-1,1));if(q.lengthSq()>.9)continue;const w=V3(ct.x+q.x*a,ct.y+q.y*b,ct.z+q.z*c);if(o.ok&&!o.ok(w))continue;P.push(q.x,q.y,q.z);S.push(rr(.4,1));F.push(rnd()*TAU)}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('aS',new THREE.Float32BufferAttribute(S,1));g.setAttribute('aF',new THREE.Float32BufferAttribute(F,1));
    U={uT:{value:0},uPx:{value:800},uABC:{value:V3(a,b,c)},uC:{value:ct.clone()},uCol:{value:new THREE.Color(o.cor||'#FFE3B8')},uV:{value:o.vel||.11},uR:{value:o.raio||.012}};
    const pm=new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
      vertexShader:`attribute float aS;attribute float aF;uniform float uT,uPx,uV,uR;uniform vec3 uABC,uC;varying float vA;
        void main(){float r=length(position.xz);float an=uT*uV*(1.4-r)*(.7+.3*aS)+aF*.02;float cs=cos(an),sn=sin(an);
          vec3 q=vec3(position.x*cs-position.z*sn,position.y+.04*sin(uT*.5+aF),position.x*sn+position.z*cs);
          vec4 mv=modelViewMatrix*vec4(uC+q*uABC,1.);gl_PointSize=clamp(uR*aS*uPx/max(-mv.z,.1)*2.,1.,14.);vA=.35+.4*aS;gl_Position=projectionMatrix*mv;}`,
      fragmentShader:`uniform vec3 uCol;varying float vA;void main(){vec2 q=gl_PointCoord*2.-1.;float d=dot(q,q);if(d>1.)discard;float a=(1.-d)*(1.-d)*vA*.5;gl_FragColor=vec4(uCol*a,a);}`});
    const pts=noPick(new THREE.Points(g,pm));pts.frustumCulled=false;pts.renderOrder=1;
    pts.onBeforeRender=(r,sc,cam)=>{const v=r.getDrawingBufferSize(_vs);U.uPx.value=v.y/(2*Math.tan(cam.fov*Math.PI/360))};G.add(pts)}
  const t0=s.tick;s.tick=(t,dt)=>{if(t0)t0(t,dt);if(U)U.uT.value=t;
    for(const b of base){const f=b.f,a=b.a;b.o.position.set(b.p.x+Math.sin(t*.7+f)*a,b.p.y+Math.sin(t*.53+f*1.7)*a*.6,b.p.z+Math.cos(t*.61+f)*a);
      _qv.setFromEuler(_ev.set(Math.sin(t*.4+f)*.12,Math.sin(t*.33+f*2)*.15,Math.cos(t*.37+f)*.1));b.o.quaternion.copy(b.q).multiply(_qv)}};
  return s}
const _vs=new THREE.Vector2(),_qv=new THREE.Quaternion(),_ev=new THREE.Euler();

const CELLB={
animal(){SEED=11;const s=scene({dist:7,upu:20/5,cam:V3(0,.62,1)}),G=s.g;const A=2.5,B=1.05,Cc=2.05;const IN=ellIn(A,B,Cc);
  shell(G,bumpy(ellG(A,B,Cc,110),.09,.8,3),'membrana',C('membrana'),'#ff9ed2',{thickness:1.4,attenuationDistance:3.6});
  const pl=placer();const nP=V3(-.4,.02,-.15),nr=.74;s.anch.nucleo=nucleus(G,'nucleo',nP,nr);pl.add(nP,nr+.42);
  erSheets(G,nP,nr+.16,3,TAU*.5,Math.PI*.55);s.anch.re=nP.clone().add(V3(-.74,.16,.74));
  const gp=V3(1.05,.0,-.75);golgi(G,gp,1,.5);pl.add(gp,.7);s.anch.golgi=up(gp,.3);
  const cp=V3(.8,.05,.45);pl.add(cp,.25);const cm=M('centriolo',C('centriolo'),{roughness:.35});
  G.add(mesh(new THREE.CylinderGeometry(.045,.045,.18,18),cm,'centriolo',cp,[0,0,Math.PI/2]));G.add(mesh(new THREE.CylinderGeometry(.045,.045,.18,18),cm,'centriolo',cp.clone().add(V3(.06,.08,0)),[Math.PI/2,0,0]));s.anch.centriolo=up(cp,.18);
  // citoesqueleto: microtúbulos saindo do centrossomo
  const cyto=M('citoesqueleto',C('citoesqueleto'),{transparent:true,opacity:.55,emissiveIntensity:.35,roughness:.3});cyto.userData.e0=.35;const tracks=[];
  for(let i=0;i<16;i++){const a=i/16*TAU+rr(-.15,.15);const end=ellSurf(A,B,Cc,V3(Math.cos(a),rr(-.25,.25),Math.sin(a))).multiplyScalar(.93);const mid=cp.clone().lerp(end,.5).add(V3(rr(-.2,.2),rr(-.15,.15),rr(-.2,.2)));
    if(mid.distanceTo(nP)<nr+.1)mid.add(mid.clone().sub(nP).setLength(.3));const pts=[cp.clone(),mid,end];G.add(mesh(tubeG(pts,.008,60,5),cyto,'citoesqueleto'));tracks.push(new THREE.CatmullRomCurve3(pts))}
  s.anch.citoesqueleto=tracks[3].getPointAt(.7).add(V3(0,.06,0));
  const ring=()=>{const a=rr(0,TAU),R=rr(.35,.92);return V3(Math.cos(a)*A*R,rr(-.35,.35),Math.sin(a)*Cc*R)};
  const mitos=scatter(10,.27,ring,pl).filter(p=>IN(p,.18));mitos.forEach(p=>mito(G,p,.34,.1,[rr(-.3,.3),rr(0,TAU),Math.PI/2+rr(-.3,.3)]));if(mitos[0])s.anch.mitocondria=up(mitos[0],.16);
  const lys=scatter(6,.16,ring,pl).filter(p=>IN(p,.15));const lm=M('lisossomo','#fff',{vc:true,roughness:.25});lys.forEach(p=>G.add(mesh(bumpy(sphG(.1,32),.012,9,rr(0,9),C('lisossomo'),.4),lm,'lisossomo',p,null,rr(.8,1.25))));if(lys[0])s.anch.lisossomo=up(lys[0],.14);
  const per=scatter(4,.14,ring,pl).filter(p=>IN(p,.15));const pm=M('peroxissomo','#fff',{vc:true,roughness:.3});per.forEach(p=>G.add(mesh(bumpy(sphG(.085,32),.01,9,rr(0,9),C('peroxissomo'),.4),pm,'peroxissomo',p)));if(per[0])s.anch.peroxissomo=up(per[0],.12);
  const rib=ribos(G,'ribossomo',420,rndIn(A,B,Cc),p=>IN(p,.06)&&p.distanceTo(nP)>nr+.05);s.anch.ribossomo=up(rib[7].p,.06);
  s.anch.membrana=ellSurf(A,B,Cc,V3(-1,.35,.2)).multiplyScalar(1.01);
  // vesículas viajando pelos trilhos
  const vm=M(null,'#ffe8a3',{roughness:.25,clearcoat:1,emissive:new THREE.Color('#ffcf70'),emissiveIntensity:.35});vm.userData.e0=.35;
  const ves=[0,2,4,5,7,9,11,13,15].map((i,j)=>{const o=noPick(mesh(sphG(.04,18),vm));G.add(o);return{o,c:tracks[i],t:rnd(),v:rr(.05,.1)*(j%2?1:-1)}});
  // secreção: vesículas brotam da face trans do Golgi e viajam até a membrana
  const gm=FILM(null,'#ffc078',.75,{depthWrite:true});const sec=[0,1,2].map(i=>{const o=noPick(mesh(sphG(.05,18),gm));G.add(o);const fim=ellSurf(A,B,Cc,V3(1,rr(-.2,.3),rr(-1.2,-.2))).multiplyScalar(.95);
    return{o,c:new THREE.CatmullRomCurve3([gp.clone().add(V3(.15,.12,.25)),gp.clone().lerp(fim,.5).add(V3(0,.15,0)),fim]),ph:i/3}});
  s.tick=(t,dt)=>{for(const v of ves){v.t=((v.t+dt*v.v)%1+1)%1;v.o.position.copy(v.c.getPointAt(v.t))}
    for(const q of sec){const u=(t*.09+q.ph)%1;q.o.position.copy(q.c.getPointAt(u));q.o.scale.setScalar(Math.min(1,u*9)*Math.min(1,(1-u)*7))}};
  return vida(s,{vol:[A*.9,B*.85,Cc*.9,V3(0,0,0)],ok:p=>p.distanceTo(nP)>nr+.08})},

vegetal(){SEED=5;const s=scene({dist:8.2,upu:50/5.6,cam:V3(0,.62,1)}),G=s.g;const A=2.8,B=1.2,Cc=1.9,E=.3;const IN=supIn(A,B,Cc,E);
  shell(G,bumpy(superG(A,B,Cc,E,96),.03,1.4,4),'vacuolo','#94d82d','#c0eb75',{thickness:2,attenuationDistance:2.6,roughness:.3,rimI:.7});
  const mem=noPick(mesh(superG(A*.955,B*.92,Cc*.94,E,80),FILM('membrana',C('membrana'),.07,{side:THREE.FrontSide})));G.add(mem);
  const vO=V3(.35,0,-.05),VA=1.6,VB=.82,VC=1.2;const vac=superG(VA,VB,VC,.55,80);const VIN=supIn(VA,VB,VC,.55,vO);
  G.add(mesh(vac,FILM('vacuolo',C('vacuolo'),.22,{roughness:.05}),'vacuolo',vO));const vr=noPick(mesh(vac,RIM('#7fe3ff',1.1,2)));vr.position.copy(vO);G.add(vr);
  s.anch.vacuolo=vO.clone().add(V3(-.2,VB+.05,.1));
  const pl=placer();const nP=V3(-2.0,.05,1.05),nr=.5;s.anch.nucleo=nucleus(G,'nucleo',nP,nr);pl.add(nP,nr+.15);
  erSheets(G,nP,nr+.12,2,TAU*.35,Math.PI*.15,3);s.anch.re=nP.clone().add(V3(.62,.2,-.2));
  const okP=(p,m)=>IN(p,m)&&!VIN(p,-.12);
  const gen=()=>{const a=rr(0,TAU);return V3(Math.cos(a)*rr(.5,1)*A,rr(-.5,.5),Math.sin(a)*rr(.5,1)*Cc)};
  const chl=scatter(26,.31,gen,pl,5000).filter(p=>okP(p,.09));chl.forEach((p,i)=>{const g=bumpy(ellG(.3,.11,.18,48),.018,7,i,C('cloroplasto'),.55);
    G.add(mesh(g,M('cloroplasto','#fff',{vc:true,roughness:.42}),'cloroplasto',p,[rr(-.2,.2),Math.atan2(p.z,p.x)+Math.PI/2,rr(-.2,.2)]))});
  if(chl.length)s.anch.cloroplasto=up(chl[0],.16);
  const gp=scatter(1,.45,gen,pl,800).filter(p=>okP(p,.15))[0]||V3(-1.9,0,-1.1);golgi(G,gp,.65,Math.atan2(gp.z,gp.x));s.anch.golgi=up(gp,.22);
  const mt=scatter(6,.24,gen,pl,1500).filter(p=>okP(p,.12));mt.forEach(p=>mito(G,p,.28,.085,[rr(-.3,.3),rr(0,TAU),Math.PI/2]));if(mt[0])s.anch.mitocondria=up(mt[0],.14);
  const pe=scatter(3,.14,gen,pl,800).filter(p=>okP(p,.12));const pm=M('peroxissomo',C('peroxissomo'),{roughness:.3});pe.forEach(p=>G.add(mesh(sphG(.08,24),pm,'peroxissomo',p)));if(pe[0])s.anch.peroxissomo=up(pe[0],.12);
  const rib=ribos(G,'ribossomo',300,rndIn(A,B,Cc),p=>okP(p,.06)&&p.distanceTo(nP)>nr+.04);s.anch.ribossomo=up(rib[3].p,.06);
  s.anch.membrana=V3(A*.86,B*.86,Cc*.55);
  // citoesqueleto: microtúbulos corticais logo abaixo da membrana (plantas também têm citoesqueleto)
  const cyto=M('citoesqueleto',C('citoesqueleto'),{transparent:true,opacity:.6,roughness:.4});const ctr=[];
  for(let i=0;i<12;i++){const a0=rr(0,TAU),y=rr(-.75,.75);const pts=[];for(let j=0;j<=6;j++){const a=a0+j*.2;pts.push(V3(Math.cos(a)*A*.86,y+Math.sin(j*.9+i)*.05,Math.sin(a)*Cc*.86))}G.add(mesh(tubeG(pts,.012,40,5),cyto,'citoesqueleto'));ctr.push(pts[3])}
  s.anch.citoesqueleto=ctr.reduce((a,b)=>b.z>a.z?b:a).clone().add(V3(0,.06,0));
  // ciclose: cloroplastos circulam devagar em volta do vacúolo
  const chs=G.children.filter(o=>o.userData.k==='cloroplasto').map(o=>{const d=o.position.clone().sub(vO);return{o,y:o.position.y,r:Math.hypot(d.x/A,d.z/Cc),a0:Math.atan2(d.z/Cc,d.x/A),ry:o.rotation.y,ph:rnd()*TAU}});
  s.tick=(t)=>{for(const c of chs){const a=c.a0+t*.035;let x=vO.x+Math.cos(a)*c.r*A,z=vO.z+Math.sin(a)*c.r*Cc;const p=V3(x,c.y+Math.sin(t*.5+c.ph)*.02,z);
      if(p.distanceTo(nP)<nr+.3)p.addScaledVector(p.clone().sub(nP).setY(0).normalize(),nr+.3-p.distanceTo(nP));c.o.position.copy(p);c.o.rotation.y=c.ry-(a-c.a0)}
    if(chs[0])s.anch.cloroplasto.copy(chs[0].o.position).add(V3(0,.16,0))};
  return vida(s,{vol:[A*.85,B*.8,Cc*.85,V3(0,0,0)],ok:p=>okP(p,.05)&&p.distanceTo(nP)>nr+.05,cor:'#E9FFD0',mexe:['mitocondria','peroxissomo']})},

bacteria(){SEED=3;const s=scene({enqX:[-2.1,3.1],dist:7.6,upu:3/3.9,cam:V3(-.38,.6,1)}),G=s.g;const R=.62,L=2.6;
  const g=bumpy(capG(R,L,48),.02,2.4,1);g.rotateZ(Math.PI/2);shell(G,g,'parede_bac','#82c91e','#d8f5a2',{thickness:1,attenuationDistance:2.2,pick:false});
  const im=noPick(mesh(capG(R*.9,L,40),FILM(null,'#b197fc',.12)));im.rotation.z=Math.PI/2;G.add(im);
  const IN=p=>{const x=Math.max(-L/2,Math.min(L/2,p.x));return Math.hypot(p.x-x,p.y,p.z)<R*.82};
  const NIN=ellIn(1.05,.34,.36);for(let i=0;i<4;i++){const w=walk(70,.09,p=>NIN(p),V3(rr(-.5,.5),0,0));G.add(mesh(tubeG(w,.02,260,5),M('nucleoide',C('nucleoide'),{roughness:.45}),'nucleoide'))}
  s.anch.nucleoide=V3(-.2,.38,0);
  const pm=M('plasmidio',C('plasmidio'),{roughness:.35});[[.95,.1,.25],[-1.15,-.12,-.2],[1.35,-.1,-.15]].forEach((p,i)=>G.add(mesh(new THREE.TorusKnotGeometry(.075,.012,90,6,2,3),pm,'plasmidio',p,[rr(0,3),rr(0,3),0])));s.anch.plasmidio=V3(.95,.26,.25);
  const rb=ribos(G,'ribo70',380,rndIn(2,.6,.6),p=>IN(p)&&!NIN(p,-.05),.024);s.anch.ribo70=up(rb[4].p,.07);
  s.anch.parede_bac=V3(-.6,R*.95,.25);
  const fl=new THREE.Group();fl.position.x=L/2+R*.9;const fg=tubeG(helixPts(.13,3.6,4.2,180,'x'),.024,260,6,t=>Math.min(1,t*12+.4));fg.translate(1.8,0,0);
  fl.add(mesh(fg,M('flagelo',C('flagelo'),{roughness:.35}),'flagelo'));fl.add(mesh(new THREE.CylinderGeometry(.05,.05,.12,16),M('flagelo',C('flagelo')),'flagelo',[0,0,0],[0,0,Math.PI/2]));G.add(fl);s.anch.flagelo=V3(L/2+R+.75,.22,0);
  const pmat=M('pili',C('pili'),{roughness:.5});for(let i=0;i<34;i++){const x=rr(-L/2,L/2),a=rr(0,TAU);const n=V3(0,Math.cos(a),Math.sin(a));const p=V3(x,0,0).addScaledVector(n,R);const len=rr(.18,.34);
    G.add(mesh(new THREE.CylinderGeometry(.007,.007,len,5),pmat,'pili',p.clone().addScaledVector(n,len/2),null))}
  // (setar quaternion depois do add)
  G.children.filter(o=>o.userData.k==='pili').forEach(o=>{const n=o.position.clone().setX(0).normalize();o.quaternion.copy(qY(n))});
  s.anch.pili=V3(.4,-R-.3,.1).applyAxisAngle(V3(1,0,0),-.9);
  G.position.x=-1.45;s.tick=(t)=>{fl.rotation.x=t*4;G.rotation.z=Math.sin(t*.8)*.015};return vida(s,{vol:[L/2+R*.5,R*.7,R*.7,V3(0,0,0)],ok:p=>IN(p),cor:'#E6FFD0',vel:.25,n:innerWidth<700?160:340})},

neuronio(){SEED=21;const s=scene({enqX:[-4.6,4.4],dist:11,upu:110/8.4,cam:V3(-.4,.7,1)}),G=s.g;const sP=V3(-2.6,0,0);
  const soma=bumpy(ellG(.95,.72,.82,80),.08,1.6,2);soma.translate(sP.x,sP.y,sP.z);shell(G,soma,null,'#f59f00','#ffd8a8',{thickness:1.2,attenuationDistance:1.5});
  s.anch.nucleo=nucleus(G,'nucleo',sP.clone().add(V3(-.05,0,0)),.4);
  const dm=M('dendrito','#fff',{vc:true,roughness:.4});
  function branch(p,d,len,r,dep){const pts=[p.clone()];let q=p.clone(),dd=d.clone();for(let i=0;i<4;i++){dd.add(V3(rr(-.35,.35),rr(-.25,.25),rr(-.35,.35))).normalize();q=q.clone().addScaledVector(dd,len/4);pts.push(q)}
    const g=bumpy(tubeG(pts,r,40,8,t=>1-t*.45),r*.25,6,rr(0,9),C('dendrito'),.3);G.add(mesh(g,dm,'dendrito'));
    if(dep>0)for(const sgn of[-1,1])branch(q,dd.clone().applyAxisAngle(V3(0,1,0),sgn*rr(.35,.7)).add(V3(0,rr(-.3,.3),0)).normalize(),len*.65,r*.55,dep-1);
    else for(let i=0;i<5;i++){const sp=pts[2+(i%2)];G.add(noPick(mesh(sphG(.018,6),dm,null,sp.clone().add(V3(rr(-.06,.06),rr(-.06,.06),rr(-.06,.06))))))}return pts}
  const dirs=[[-1,.15,.5],[-1,-.1,-.6],[-.4,.5,1],[-.3,-.4,-1],[-.2,.3,-1.1],[-.9,.6,0]];dirs.forEach((d,i)=>{const dd=V3(...d).normalize();const pts=branch(sP.clone().addScaledVector(dd,.68),dd,1.3,.12,2);if(i===0)s.anch.dendrito=up(pts[2],.18)});
  const ax=[sP.clone().add(V3(.85,0,0)),V3(-1.2,.05,.1),V3(0,-.05,-.1),V3(1.3,.08,.05),V3(2.6,0,-.15),V3(3.6,.05,0)];const axc=new THREE.CatmullRomCurve3(ax);
  G.add(mesh(bumpy(tubeG(ax,.08,160,10,t=>t<.06?1.9-t*15:1),.006,8,1,C('axonio'),.2),M('axonio','#fff',{vc:true,roughness:.35}),'axonio'));s.anch.axonio=axc.getPointAt(.08).add(V3(0,.2,0));
  const mm=M('mielina','#fff',{vc:true,roughness:.3,clearcoat:1,sheen:1});const sheaths=[];for(let i=0;i<7;i++){const t=.16+i*.11;const p=axc.getPointAt(t),tg=axc.getTangentAt(t);const o=mesh(bumpy(capG(.18,.38,24),.01,8,i,C('mielina'),.12),mm,'mielina',p);o.quaternion.copy(qY(tg));G.add(o);sheaths.push(t)}
  s.anch.mielina=axc.getPointAt(.38).add(V3(0,.25,0));
  const sm=M('sinapse',C('sinapse'),{roughness:.3});const tip=ax[ax.length-1];for(let i=0;i<5;i++){const d=V3(1,rr(-.8,.8),rr(-1,1)).normalize();const e=tip.clone().addScaledVector(d,rr(.45,.7));
    G.add(mesh(tubeG([tip,tip.clone().lerp(e,.5).add(V3(0,rr(-.1,.1),0)),e],.025,20,6),M('axonio',C('axonio')),'axonio'));const b=mesh(bumpy(sphG(.1,24),.01,9,i),sm,'sinapse',e);G.add(b);if(i===0)s.anch.sinapse=up(e,.16)}
  const mt=M('mitocondria',C('mitocondria'),{roughness:.4});[[-.2,.1],[.3,-.08]].forEach(([dx,dy])=>G.add(mesh(capG(.05,.14,12),mt,'mitocondria',sP.clone().add(V3(dx,dy,.2)),[0,0,Math.PI/2])));
  [.25,.47,.69].forEach(t=>{const o=mesh(capG(.025,.12,8),mt,'mitocondria',axc.getPointAt(t-.05));o.quaternion.copy(qY(axc.getTangentAt(t)));G.add(o)});s.anch.mitocondria=sP.clone().add(V3(.3,.12,.42));
  // potencial de ação saltando de nó em nó
  const sp=noPick(mesh(sphG(.09,16),new THREE.MeshBasicMaterial({color:'#fff3bf',transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false})));const halo=noPick(mesh(sphG(.22,16),RIM('#ffe066',1.6,1.2)));G.add(sp,halo);
  s.tick=(t)=>{const u=(t*.22)%1;const k=sheaths.findIndex(x=>x>u);const tt=u<.16?u:(k<0?u:sheaths[Math.max(0,k-1)]+.11*Math.pow((u-sheaths[Math.max(0,k-1)])/.11,4));const p=axc.getPointAt(Math.min(1,tt));sp.position.copy(p);halo.position.copy(p)};
  G.position.x=1.25;G.rotation.z=.14;return vida(s,{amp:.012})},

esperma(){SEED=9;const s=scene({enqX:[-4.3,.6],dist:9,upu:60/8.6,cam:V3(-.42,.75,1)}),G=s.g;const hP=V3(-3.5,0,0);
  const head=bumpy(ellG(.62,.2,.4,72),.012,3,1);head.translate(hP.x,hP.y,hP.z);shell(G,head,null,'#74c0fc','#d0ebff',{thickness:.5,attenuationDistance:1.2});
  G.add(mesh(bumpy(ellG(.5,.14,.31,56),.01,5,3,C('nucleo_esp'),.35),M('nucleo_esp','#fff',{vc:true,roughness:.5}),'nucleo_esp',hP.clone().add(V3(.04,0,0))));s.anch.nucleo_esp=hP.clone().add(V3(.25,.3,0));
  const ac=new THREE.SphereGeometry(1,56,40,0,TAU,0,Math.PI*.42);ac.rotateZ(Math.PI/2);ac.scale(.66,.23,.44);G.add(mesh(ac,FILM('acrossomo',C('acrossomo'),.55,{depthWrite:true}),'acrossomo',hP));s.anch.acrossomo=hP.clone().add(V3(-.45,.28,0));
  const mx=hP.x+.6,ml=1.1;G.add(mesh(new THREE.CylinderGeometry(.085,.075,ml,20),M('peca_int','#ffd8a8',{roughness:.5}),'peca_int',[mx+ml/2,0,0],[0,0,Math.PI/2]));
  const hx=tubeG(helixPts(.09,ml,10,240,'x'),.032,400,6);hx.translate(mx+ml/2,0,0);G.add(mesh(hx,M('peca_int',C('peca_int'),{roughness:.35}),'peca_int'));s.anch.peca_int=V3(mx+ml/2,.22,0);
  const tm=M('cauda',C('cauda'),{roughness:.35,clearcoat:.8});const x0=mx+ml,TL=6.4;let tail=null;
  const tailPts=t=>{const a=[];for(let i=0;i<=40;i++){const u=i/40;const amp=.08+u*.55;a.push(V3(x0+u*TL,Math.sin(u*9-t*7)*amp*.25,Math.sin(u*7.5-t*7)*amp))}return a};
  const build=t=>{const g=tubeG(tailPts(t),.06,110,8,u=>1-u*.75);if(!tail){tail=mesh(g,tm,'cauda');G.add(tail)}else{tail.geometry.dispose();tail.geometry=g}};build(0);
  s.anch.cauda=V3(x0+TL*.2,.32,0);let acc=0;s.tick=(t,dt)=>{acc+=dt;if(acc>1/40){acc=0;build(t)}const ss=s.anch.cauda;ss.z=Math.sin(.2*7.5-t*7)*.15;G.rotation.y=Math.sin(t*3.5)*.03};
  G.position.x=-.4;return s},

levedura(){SEED=31;const s=scene({dist:8,upu:10/4.6,cam:V3(0,.62,1)}),G=s.g;const mP=V3(-.45,0,0),bP=V3(1.5,.35,.1);
  shell(G,bumpy(ellG(1.5,1.28,1.32,96).translate(mP.x,mP.y,mP.z),.035,1.8,2),'parede_lev','#d9a441','#ffe8a3',{thickness:1.6,attenuationDistance:2.2,pick:true,rimI:.7});
  const bG=bumpy(sphG(.72,72).translate(bP.x,bP.y,bP.z),.02,2.5,6);shell(G,bG,'broto','#e2b55f','#fff3bf',{thickness:1,attenuationDistance:2,pick:true,rimI:.7});
  s.anch.parede_lev=mP.clone().add(V3(-.7,1.15,.35));s.anch.broto=bP.clone().add(V3(.1,.75,0));
  const vP=V3(-.75,-.1,-.25);const vg=bumpy(sphG(.62,64),.03,2.5,4);G.add(mesh(vg,FILM('vacuolo_lev',C('vacuolo_lev'),.32,{roughness:.05}),'vacuolo_lev',vP));const vr=noPick(mesh(vg,RIM('#66d9e8',1.2,2)));vr.position.copy(vP);G.add(vr);
  G.add(inst(sphG(.03,10),M('vacuolo_lev','#c5f6fa',{roughness:.2}),'vacuolo_lev',Array.from({length:14},()=>({p:vP.clone().add(V3(rr(-.4,.4),rr(-.35,.35),rr(-.4,.4)))}))));s.anch.vacuolo_lev=vP.clone().add(V3(0,.7,0));
  s.anch.nucleo_lev=nucleus(G,'nucleo_lev',V3(.25,.12,.35),.4,C('nucleo_lev'));
  const IN=ellIn(1.3,1.1,1.15,mP);for(let i=0;i<5;i++){const w=walk(8,.12,p=>IN(p)&&p.distanceTo(vP)>.7&&p.distanceTo(V3(.25,.12,.35))>.5,V3(rr(-1,.6),rr(-.6,.6),rr(-.8,.8)));if(w.length>3)G.add(mesh(tubeG(w,.045,40,8),M('mitocondria',C('mitocondria'),{roughness:.4}),'mitocondria'));if(i===0&&w[2])s.anch.mitocondria=up(w[2],.12)}
  const lip=M(null,'#ffe066',{roughness:.15,clearcoat:1});for(let i=0;i<6;i++){const p=V3(rr(-1.4,.6),rr(-.8,.8),rr(-.9,.9)).add(mP);if(IN(p,.1)&&p.distanceTo(vP)>.7)G.add(noPick(mesh(sphG(rr(.06,.1),20),lip,null,p)))}
  ribos(G,'ribossomo',180,rndIn(1.5,1.3,1.3,mP),p=>IN(p,.05)&&p.distanceTo(vP)>.65);
  const sm=M('parede_lev','#c99a4a',{roughness:.6});[V3(-1,.5,1),V3(-1.2,-.3,-.9)].forEach(d=>{const p=ellSurf(1.5,1.28,1.32,d).add(mP);const o=mesh(new THREE.TorusGeometry(.12,.03,8,24),sm,'parede_lev',p);o.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(V3(0,0,1),d.clone().normalize()));G.add(o)});
  const bro=G.children.filter(o=>o.geometry===bG);
  s.tick=(t)=>{const k=1+.03*Math.sin(t*.45);for(const o of bro){o.scale.setScalar(k);o.position.copy(bP).multiplyScalar(1-k)}};
  G.position.x=-.3;return vida(s,{vol:[1.25,1.05,1.1,mP],ok:p=>p.distanceTo(vP)>.68&&p.distanceTo(V3(.25,.12,.35))>.45,cor:'#FFF0C8',n:innerWidth<700?200:420})},

sangue(){SEED=41;const s=scene({dist:10,upu:30/7.6,cam:V3(0,.7,1)}),G=s.g;
  const prof=[];const N=40;for(let i=0;i<=N;i++){const r=Math.sin(i/N*Math.PI/2);const h=.5*Math.sqrt(Math.max(0,1-r*r))*(.207+2.003*r*r-1.123*r**4);prof.push(new THREE.Vector2(r,h+.002))}
  for(let i=N;i>=0;i--){const r=Math.sin(i/N*Math.PI/2);const h=.5*Math.sqrt(Math.max(0,1-r*r))*(.207+2.003*r*r-1.123*r**4);prof.push(new THREE.Vector2(r,-h-.002))}
  let rbcG=new THREE.LatheGeometry(prof,72);rbcG=bumpy(rbcG,.006,3,2,C('hemacia'),.18,3);rbcG.scale(.97,.97,.97);
  const rm=M('hemacia','#fff',{vc:true,roughness:.4,clearcoat:.7,sheen:1,sheenColor:new THREE.Color('#ff8f8f')});
  const pl=placer();const wP=V3(.2,0,.2);pl.add(wP,1.5);
  const leu=bumpy(sphG(1.35,96),.07,4.2,3);leu.translate(wP.x,wP.y,wP.z);shell(G,leu,'leucocito','#b197fc','#e5dbff',{thickness:1.6,attenuationDistance:1.8,pick:true});
  const lm=M('leucocito','#fff',{vc:true,roughness:.5});[[-.35,.1,0,.42],[.2,.15,-.2,.38],[.35,-.15,.25,.36],[-.1,-.2,.3,.3]].forEach(([x,y,z,r],i)=>G.add(mesh(bumpy(sphG(r,48),.04,4,i,'#7048e8',.35),lm,'leucocito',wP.clone().add(V3(x,y,z)))));
  G.add(inst(sphG(.03,8),M('leucocito','#eebefa',{roughness:.4}),'leucocito',Array.from({length:120},()=>{const d=V3(rr(-1,1),rr(-1,1),rr(-1,1));return{p:wP.clone().addScaledVector(d.normalize(),rr(.7,1.15))}})));
  s.anch.leucocito=wP.clone().add(V3(.2,1.42,0));
  const rbcs=scatter(9,1.02,()=>V3(rr(-3.6,3.6),rr(-.7,.7),rr(-2.2,2.2)),pl,3000).map((p,i)=>{const o=mesh(rbcG,rm,'hemacia',p,[rr(-1.2,1.2),rr(0,TAU),rr(-1.2,1.2)]);G.add(o);return{o,p:p.clone(),w:V3(rr(-.2,.2),rr(-.2,.2),rr(-.2,.2)),ph:rr(0,TAU)}});
  s.anch.hemacia=V3();
  const pm=M('plaqueta','#fff',{vc:true,roughness:.5});const plts=scatter(6,.3,()=>V3(rr(-3.6,3.6),rr(-.6,.6),rr(-2.2,2.2)),pl,3000).map((p,i)=>{const o=mesh(bumpy(ellG(.22,.07,.17,32),.025,5,i,C('plaqueta'),.3),pm,'plaqueta',p,[rr(0,3),rr(0,3),0]);G.add(o);return{o,p:p.clone(),ph:rr(0,TAU)}});
  s.anch.plaqueta=V3();
  const flx=(x,t,v)=>{const L=8.4,u=((x+4.2+t*v)%L+L)%L;return[u-4.2,Math.min(1,u/.7,(L-u)/.7)]};
  s.tick=(t,dt)=>{for(const r of rbcs){r.o.rotation.x+=r.w.x*dt;r.o.rotation.z+=r.w.z*dt;const [x,e]=flx(r.p.x,t,.32);r.o.position.set(x,r.p.y+Math.sin(t*.4+r.ph)*.06,r.p.z+Math.cos(t*.25+r.ph)*.06);r.o.scale.setScalar(Math.max(.001,e))}
    for(const q of plts){q.o.rotation.y+=dt*.6;const [x,e]=flx(q.p.x,t,.38);q.o.position.set(x,q.p.y+Math.sin(t*.5+q.ph)*.05,q.p.z);q.o.scale.setScalar(Math.max(.001,e))}
    s.anch.hemacia.copy(rbcs[0].o.position).add(V3(0,.45,0));s.anch.plaqueta.copy(plts[0].o.position).add(V3(0,.18,0))};s.tick(0,0);return s},

fago(){SEED=51;const s=scene({dist:11,upu:.36/6.2,cam:V3(0,.25,1)}),G=s.g;const hy=1.55;
  const cap=new THREE.IcosahedronGeometry(1,0);cap.scale(.82,1.12,.82);cap.computeVertexNormals();
  const cm=M('capsideo',C('capsideo'),{metalness:.25,roughness:.22,transparent:true,opacity:.42,iridescence:.8,iridescenceIOR:1.4,clearcoat:1,side:THREE.DoubleSide,depthWrite:false,flatShading:true});
  const capM=mesh(cap,cm,'capsideo',[0,hy,0]);capM.renderOrder=3;G.add(capM);const ed=noPick(new THREE.LineSegments(new THREE.EdgesGeometry(cap),new THREE.LineBasicMaterial({color:'#f1f3f5',transparent:true,opacity:.65})));ed.position.y=hy;G.add(ed);
  const cs=[];G.add(inst(new THREE.IcosahedronGeometry(.05,0),M('capsideo','#dee2e6',{roughness:.4}),'capsideo',(()=>{const a=[],p=cap.attributes.position;for(let i=0;i<p.count;i+=3){const c=V3(0,0,0);for(let j=0;j<3;j++)c.add(V3(p.getX(i+j),p.getY(i+j),p.getZ(i+j)));c.divideScalar(3);a.push({p:c.add(V3(0,hy,0))})}return a})()));
  s.anch.capsideo=V3(.55,hy+.75,.3);
  const dp=[];for(let i=0;i<=900;i++){const u=i/900;const th=Math.acos(1-2*u),ph=u*TAU*34;const r=.6+.05*Math.sin(i*.7);dp.push(V3(Math.sin(th)*Math.cos(ph)*r*.95,Math.cos(th)*r*1.28,Math.sin(th)*Math.sin(ph)*r*.95))}
  const dg=tubeG(dp,.022,2400,5);dg.translate(0,hy,0);G.add(mesh(dg,M('dna_fago',C('dna_fago'),{roughness:.4,emissiveIntensity:.15}),'dna_fago'));s.anch.dna_fago=V3(-.35,hy+.1,.55);
  const tmat=M('cauda_fago',C('cauda_fago'),{roughness:.35,metalness:.2});G.add(mesh(new THREE.CylinderGeometry(.07,.07,2.1,16),tmat,'cauda_fago',[0,-.25,0]));
  G.add(mesh(new THREE.CylinderGeometry(.3,.22,.12,6),tmat,'cauda_fago',[0,.4,0]));
  const rings=[];for(let i=0;i<22;i++)rings.push({p:V3(0,.28-i*.075,0),r:[Math.PI/2,0,i*.25]});const ringIM=inst(new THREE.TorusGeometry(.15,.045,8,6),tmat,'cauda_fago',rings);G.add(ringIM);s.anch.cauda_fago=V3(.32,-.4,0);
  const bp=-1.42;G.add(mesh(new THREE.CylinderGeometry(.48,.48,.13,6),tmat,'cauda_fago',[0,bp,0]));
  const fm=M('fibras',C('fibras'),{roughness:.4});for(let i=0;i<6;i++){const a=i/6*TAU+.3;const d=V3(Math.cos(a),0,Math.sin(a));const p0=d.clone().multiplyScalar(.45).setY(bp);const k=d.clone().multiplyScalar(1.45).setY(bp+.55);const f=d.clone().multiplyScalar(2.1).setY(bp-.85);
    G.add(mesh(tubeG([p0,p0.clone().lerp(k,.5).add(V3(0,.12,0)),k],.032,20,6),fm,'fibras'));G.add(mesh(tubeG([k,k.clone().lerp(f,.5).add(d.clone().multiplyScalar(.12)),f],.028,20,6),fm,'fibras'));G.add(mesh(sphG(.05,10),fm,'fibras',k));
    G.add(mesh(new THREE.ConeGeometry(.05,.22,8),fm,'fibras',[Math.cos(a+.5)*.35,bp-.15,Math.sin(a+.5)*.35],[Math.PI,0,0]));if(i===1)s.anch.fibras=k.clone().add(V3(0,.2,0))}
  // infecção: o fago pousa na bactéria, a bainha da cauda se contrai e o DNA entra na célula (ciclo de cerca de 14 s)
  const topo=G.children.slice(0,6),top0=topo.map(o=>o.position.y);
  const ys=rings.map(r=>r.p.y),dm=new THREE.Matrix4(),dq=new THREE.Quaternion(),dv=new THREE.Vector3(),ds=new THREE.Vector3();
  // superfície da bactéria: um pedaço curvo da parede (verde) e da membrana (lilás) logo abaixo
  const sy=bp-.98,pw=bumpy(new THREE.SphereGeometry(5,128,40,0,Math.PI*2,0,.5).translate(0,-5,0),.03,1.8,5,'#8BC34A',.3);
  const wall=noPick(mesh(pw,M(null,'#6FA63C',{vc:true,roughness:.62,clearcoat:.3,emissiveIntensity:.08}),null,[0,sy,0]));G.add(wall);
  const mem=noPick(mesh(new THREE.SphereGeometry(5,96,30,0,Math.PI*2,0,.48).translate(0,-5,0),M(null,'#9a7ef0',{transparent:true,opacity:.5,depthWrite:false,emissive:new THREE.Color('#5b3fb8'),emissiveIntensity:.25}),null,[0,sy-.22,0]));G.add(mem);
  const ip=[];let q=V3(0,bp-.1,0);for(let i=0;i<70;i++){ip.push(q.clone());q=q.clone().add(V3(Math.sin(i*.55)*.09,i<8?-.12:-.03,Math.cos(i*.43)*.08));if(q.y<sy-.75)q.y=sy-.75+Math.sin(i)*.04}
  const ig=tubeG(ip,.022,420,5);const inj=noPick(mesh(ig,M('dna_fago',C('dna_fago'),{roughness:.4,emissive:new THREE.Color(C('dna_fago')),emissiveIntensity:.35}),null));G.add(inj);const nIdx=ig.index.count;
  const a0={c:s.anch.capsideo.clone(),d:s.anch.dna_fago.clone(),t:s.anch.cauda_fago.clone()};
  const ss=(a,b,x)=>{const u=Math.max(0,Math.min(1,(x-a)/(b-a)));return u*u*(3-2*u)};
  s.tick=(t)=>{const u=t%14,des=1-ss(0,3,u),con=ss(3,4.5,u)*(1-ss(12,14,u)),dna=ss(4.6,10,u)*(1-ss(12,13.6,u));
    G.position.y=-.15+des*1.1+Math.sin(t*.6)*.03*des;
    const k=1-.45*con,off=-(1-k)*22*.075;
    rings.forEach((r,i)=>{ringIM.getMatrixAt(i,dm);dm.decompose(dv,dq,ds);dv.y=ys[i]+i*.075*(1-k)+off;ds.set(1+.3*con,1+.3*con,1);dm.compose(dv,dq,ds);ringIM.setMatrixAt(i,dm)});ringIM.instanceMatrix.needsUpdate=true;
topo.forEach((o,i)=>{o.position.y=top0[i]+off});
    ig.setDrawRange(0,Math.floor(nIdx*dna/6)*6);inj.visible=dna>.002;
    s.anch.capsideo.copy(a0.c).setY(a0.c.y+off);s.anch.dna_fago.copy(a0.d).setY(a0.d.y+off);s.anch.cauda_fago.copy(a0.t).setY(a0.t.y+off*.5)};
  s.tick(RM?7.5:0);return s}
};
