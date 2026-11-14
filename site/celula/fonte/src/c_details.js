// ================= 3D: telas de detalhe (organela ampliada, em corte) =================
const CUT=()=>[new THREE.Plane(V3(0,-1,0),0.02)];
function lab(s,t,p){s.labels.push([t,p.isVector3?p:V3(...p)])}
const DETB={
nucleo(){SEED=61;const s=scene({dist:8.4,upu:6/3.6,cam:V3(0,.5,1)}),G=s.g;const r=1.75;nucleus(G,'nucleo',V3(0,0,0),r);
  erSheets(G,V3(0,0,0),r+.22,2,TAU*.42,Math.PI*.62,5);
  lab(s,'envelope duplo',[1.45,.75,.75]);lab(s,'poro nuclear',[.4,1.62,-.4]);lab(s,'nucléolo',[.3,-.1,.3]);lab(s,'cromatina (DNA + proteínas)',[-.55,.45,.5]);lab(s,'retículo ligado ao núcleo',[-1.75,-.55,.95]);return s},

mitocondria(){SEED=62;const s=scene({dist:7,upu:2/5,cam:V3(0,.95,1)}),G=s.g;const P=CUT(),L=2.6;
  const o=bumpy(capG(1,L,64),.025,2,1);o.rotateZ(Math.PI/2);G.add(mesh(o,M('mitocondria',C('mitocondria'),{clippingPlanes:P,side:THREE.DoubleSide,roughness:.4}),'mitocondria'));
  const i=capG(.86,L,64);i.rotateZ(Math.PI/2);G.add(mesh(i,M('mitocondria','#B8402A',{clippingPlanes:P,side:THREE.DoubleSide,roughness:.5}),'mitocondria'));
  const cm=M('mitocondria','#fff',{vc:true,clippingPlanes:P,side:THREE.DoubleSide,roughness:.45});const atp=[];
  for(let k=0;k<9;k++){const x=-1.75+k*.44,sg=k%2?1:-1;const g=new THREE.BoxGeometry(.07,1.7,1.05,2,40,28);const p=g.attributes.position;const cr=Math.min(.78,Math.sqrt(Math.max(0,.86**2-Math.max(0,Math.abs(x)-1.3)**2))-.08);for(let j=0;j<p.count;j++){let y=p.getY(j),z=p.getZ(j);const zw=z+sg*.32,rr2=Math.hypot(y,zw);if(rr2>cr){y*=cr/rr2;z=zw*cr/rr2-sg*.32;p.setY(j,y);p.setZ(j,z)}p.setX(j,p.getX(j)+Math.sin(y*4+k)*.06+Math.sin(z*5)*.05)}
    const cg=bumpy(g,.01,6,k,'#FF8A5C',.3);const m=mesh(cg,cm,'mitocondria',[x,0,sg*.32]);G.add(m);
    for(let j=0;j<26;j++){const y=rr(-.8,0),z=sg*.32+rr(-.5,.5);if(Math.hypot(y,z)<.8)atp.push({p:V3(x+(rnd()<.5?-.05:.05),y,z)})}}
  G.add(inst(sphG(.028,8),M('mitocondria','#ffe066',{roughness:.3,clippingPlanes:P}),'mitocondria',atp));
  G.add(inst(sphG(.03,8),M('mitocondria','#ffd8a8',{roughness:.5,clippingPlanes:P}),'mitocondria',Array.from({length:160},()=>({p:V3(rr(-2,2),rr(-.75,-.05),rr(-.7,.7))})).filter(t=>Math.hypot(t.p.y,t.p.z)<.78)));
  [V3(-.9,-.35,.55),V3(1.1,-.4,-.5)].forEach(p=>G.add(mesh(new THREE.TorusGeometry(.12,.012,6,30),M('mitocondria','#74c0fc'),'mitocondria',p,[Math.PI/2,0,0])));
  lab(s,'membrana externa',[-2.2,.15,-.95]);lab(s,'membrana interna',[2.3,.05,.55]);lab(s,'cristas (dobras)',[-.35,.05,.45]);lab(s,'matriz',[.68,-.35,.1]);lab(s,'ATP sintase',[1.36,.05,-.32]);lab(s,'DNA próprio',[-.9,-.25,.55]);if(typeof MODELOS!=='undefined')MODELOS.trocar(s,'mitocondria',{tamanho:4.6,
    rotulos:[['matriz','Matriz mitocondrial'],['cristas','Cristas'],['membrana_externa','Membrana externa'],['membrana_interna','Membrana interna'],['atp_sintase','ATP sintase'],
      ['cadeia_transportadora','Cadeia transportadora'],['espaco_intermembranas','Espaço intermembranas'],['dna_mitocondrial','DNA mitocondrial'],['ribossomos','Ribossomos']],ancoras:{matriz:[-1.25,-.3,.35]}});return s},

cloroplasto(){SEED=63;const s=scene({dist:7.6,upu:5/5,cam:V3(0,1.05,1)}),G=s.g;const P=CUT();
  G.add(mesh(bumpy(ellG(2.5,.95,1.45,90),.02,2,1),M('cloroplasto',C('cloroplasto'),{clippingPlanes:P,side:THREE.DoubleSide,roughness:.4}),'cloroplasto'));
  G.add(mesh(ellG(2.38,.86,1.35,90),FILM('cloroplasto','#b2f2bb',.35,{clippingPlanes:P}),'cloroplasto'));
  const tg=bumpy(new THREE.CylinderGeometry(.3,.3,.07,36,1),.01,8,2,'#2A9450',.3);const tm=M('cloroplasto','#fff',{vc:true,roughness:.35,clearcoat:.8,clippingPlanes:P});const disks=[],stacks=[];
  const pl=placer();scatter(10,.36,()=>V3(rr(-1.8,1.8),0,rr(-.9,.9)),pl,800).forEach(c=>{if((c.x/2.1)**2+(c.z/1.15)**2>1)return;stacks.push(c);const n=6+Math.floor(rnd()*5);for(let j=0;j<n;j++)disks.push({p:V3(c.x,-.6+j*.085,c.z)})});
  G.add(inst(tg,tm,'cloroplasto',disks));
  const lm=M('cloroplasto','#37b24d',{roughness:.4,clippingPlanes:P,transparent:true,opacity:.85});for(let i=0;i<stacks.length-1;i++){const a=stacks[i],b=stacks[i+1];const d=b.clone().sub(a);const o=mesh(new THREE.BoxGeometry(d.length(),.025,.12),lm,'cloroplasto',a.clone().lerp(b,.5).setY(-.35+(i%3)*.12));o.rotation.y=-Math.atan2(d.z,d.x);G.add(o)}
  G.add(mesh(bumpy(ellG(.35,.18,.25,32),.02,5,1,'#f8f9fa',.1),M('cloroplasto','#fff',{vc:true,roughness:.6,clippingPlanes:P}),'cloroplasto',[1.6,-.35,.6]));
  G.add(inst(sphG(.05,12),M('cloroplasto','#ffe066',{roughness:.2,clippingPlanes:P}),'cloroplasto',Array.from({length:14},()=>({p:V3(rr(-2,2),rr(-.6,-.1),rr(-1,1))})).filter(t=>(t.p.x/2.2)**2+(t.p.z/1.2)**2<1)));
  const sg2=stacks.reduce((a,b)=>b.z<a.z?b:a);lab(s,'granum (pilha de tilacoides)',[sg2.x,.05,sg2.z]);const sl=stacks.reduce((a,b)=>b.x<a.x?b:a);lab(s,'tilacoide: luz → ATP',[sl.x,-.05,sl.z+.3]);lab(s,'estroma (ciclo de Calvin)',[-.9,-.55,.9]);lab(s,'membrana dupla',[-2.45,.1,.4]);lab(s,'grão de amido',[1.6,-.1,.6]);return s},

re(){SEED=64;const s=scene({dist:9,upu:2/5,cam:V3(0,.75,1)}),G=s.g;const rib=[];
  for(let k=0;k<4;k++){const g=new THREE.BoxGeometry(3.6,.12,2.8,90,1,70);const p=g.attributes.position;const y0=-.95+k*.62;
    for(let j=0;j<p.count;j++){const x=p.getX(j),z=p.getZ(j);p.setY(j,p.getY(j)+Math.sin(x*1.8+k)*.12+Math.sin(z*2.2+k*.7)*.1)}g.computeVertexNormals();
    const o=mesh(bumpy(g,.008,5,k,C('re'),.25),M('re','#fff',{vc:true,roughness:.35,clearcoat:.9}),'re',[-.9,y0,0]);G.add(o);
    for(let j=0;j<260;j++){const x=rr(-1.75,1.75),z=rr(-1.35,1.35),sg=rnd()<.5?1:-1;rib.push({p:V3(x-.9,y0+Math.sin(x*1.8+k)*.12+Math.sin(z*2.2+k*.7)*.1+sg*.1,z)})}}
  G.add(inst(sphG(.045,10),M('ribossomo',C('ribossomo'),{roughness:.5}),'ribossomo',rib));
  const sm=M('re','#8FB0FF',{roughness:.3,clearcoat:1});for(let i=0;i<9;i++){const w=walk(9,.38,p=>p.x>1&&p.x<3.3&&Math.abs(p.y)<1.2&&Math.abs(p.z)<1.3,V3(1.3,rr(-.9,.9),rr(-1,1)));if(w.length>3)G.add(mesh(tubeG(w,.075,50,10),sm,'re'))}
  const ves=noPick(mesh(sphG(.12,20),FILM(null,'#d3f9d8',.6,{depthWrite:true})));G.add(ves);s.tick=t=>{const u=(t*.25)%1;ves.position.set(2.2+u*1.2,.2+u*1.1,.2);ves.scale.setScalar(Math.min(1,u*5))};
  lab(s,'RE rugoso (cheio de ribossomos)',[-1.9,.95,.6]);lab(s,'ribossomo',[-.3,.45,-.9]);lab(s,'RE liso (tubos, faz lipídios)',[2.0,-.75,.6]);lab(s,'vesícula saindo',[3,1,.2]);return s},

golgi(){SEED=65;const s=scene({dist:7.6,upu:1/5,cam:V3(0,.55,1)}),G=s.g;const c0=new THREE.Color('#F7C13B'),c1=new THREE.Color('#E58A2E');
  for(let i=0;i<6;i++){const a=1.75-i*.1;const g=superG(a,.075,1.05-i*.04,.7,64);const p=g.attributes.position;for(let j=0;j<p.count;j++){const x=p.getX(j);p.setY(j,p.getY(j)+x*x*.13)}
    const col='#'+c0.clone().lerp(c1,i/5).getHexString();G.add(mesh(bumpy(g,.012,4,i,col,.2),M('golgi','#fff',{vc:true,roughness:.3,clearcoat:1}),'golgi',[0,-.75+i*.28,0]));
    for(const sg of[-1,1])G.add(mesh(sphG(.11,20),M('golgi',col,{roughness:.25}),'golgi',[sg*(a+.05),-.75+i*.28+a*a*.13,rr(-.4,.4)]))}
  const vm=FILM(null,'#ffc078',.8,{depthWrite:true});const flow=Array.from({length:6},(_,i)=>{const o=noPick(mesh(sphG(.12,18),vm));G.add(o);return{o,ph:i/6,x:rr(-1,1),z:rr(-.5,.5)}});
  s.tick=t=>{for(const f of flow){const u=(t*.12+f.ph)%1;f.o.position.set(f.x*(1-u*.3),-1.3+u*2.6,f.z+.6);f.o.scale.setScalar(Math.min(1,Math.min(u,1-u)*8))}};
  lab(s,'face cis: chega do retículo',[-1.5,-1.0,.6]);lab(s,'cisternas',[1.2,-.1,.7]);lab(s,'face trans: sai empacotado',[1.4,1.0,.4]);lab(s,'vesícula',[1.85,.95,0]);return s},

lisossomo(){SEED=66;const s=scene({dist:7.3,upu:.5/3.2,cam:V3(0,1.1,1)}),G=s.g;const P=CUT();
  G.add(mesh(bumpy(sphG(1.55,90),.035,2.5,1,C('lisossomo'),.3),M('lisossomo','#fff',{vc:true,clippingPlanes:P,side:THREE.DoubleSide,roughness:.35}),'lisossomo'));
  const pumps=[];for(let i=0;i<40;i++){const d=V3(rr(-1,1),rr(-1,0),rr(-1,1)).normalize();pumps.push({p:d.clone().multiplyScalar(1.57),q:qY(d)})}
  G.add(inst(new THREE.CylinderGeometry(.06,.06,.16,10),M('lisossomo','#a5d8ff',{roughness:.3,clippingPlanes:P}),'lisossomo',pumps));
  const enz=[];for(let i=0;i<70;i++){const p=V3(rr(-1.2,1.2),rr(-1.2,-.1),rr(-1.2,1.2));if(p.length()<1.25)enz.push({p,r:[rr(0,3),rr(0,3),0],s:rr(.7,1.3)})}
  G.add(inst(bumpy(sphG(.075,16),.03,14,2),M('lisossomo','#e599f7',{roughness:.4,clippingPlanes:P}),'lisossomo',enz));
  const deb=mesh(bumpy(capG(.22,.5,20),.05,6,3,'#ff922b',.4),M('lisossomo','#fff',{vc:true,roughness:.6,clippingPlanes:P}),'lisossomo',[.2,-.55,.1],[.4,.6,1.1]);G.add(deb);
  const H=noPick(inst(sphG(.03,8),new THREE.MeshBasicMaterial({color:'#fff3bf'}),null,Array.from({length:60},()=>({p:V3(rr(-1.2,1.2),rr(-1.1,-.1),rr(-1.2,1.2))})).filter(t=>t.p.length()<1.3)));G.add(H);
  s.tick=t=>{deb.scale.setScalar(.75+.25*Math.cos(t*.3));deb.rotation.y=t*.2;H.rotation.y=t*.15};
  lab(s,'membrana',[-1.45,.1,.6]);lab(s,'bomba de prótons (deixa o interior ácido)',[1.15,-.75,1.0]);lab(s,'enzimas digestivas',[-.5,-.3,.4]);lab(s,'material sendo digerido',[.2,-.2,.1]);return s},

ribossomo(){SEED=67;const s=scene({dist:8.8,upu:.025/4,cam:V3(0,.35,1)}),G=s.g;
  G.add(mesh(bumpy(ellG(1.35,.95,1.15,80),.12,2.2,1,'#ffa94d',.35,5),M('ribossomo','#fff',{vc:true,roughness:.55}),'ribossomo',[0,.55,0]));
  G.add(mesh(bumpy(ellG(1.05,.58,.82,72),.1,2.4,4,'#ffd8a8',.3,5),M('ribossomo','#fff',{vc:true,roughness:.55}),'ribossomo',[-.1,-.78,0]));
  const mm=M('ribossomo','#4dabf7',{roughness:.4});const mrna=new THREE.Group();G.add(mrna);const nb=[];for(let i=0;i<70;i++)nb.push({p:V3(-4.2+i*.12,-.22+Math.sin(i*.5)*.03,.35)});mrna.add(inst(sphG(.055,10),mm,'ribossomo',nb));
  const tr=M('ribossomo','#c0eb75',{roughness:.4});[[-.25,0],[.25,0]].forEach(([x])=>{G.add(mesh(tubeG([V3(x,-.2,.4),V3(x,-.05,.95),V3(x+.12,.15,1.35),V3(x+.2,.35,1.5)],.075,24,8),tr,'ribossomo'))});
  const pm=M('ribossomo','#ff8787',{roughness:.35});const chain=Array.from({length:40},(_,i)=>{const o=noPick(mesh(sphG(.08,10),pm));G.add(o);return o});
  const path=new THREE.CatmullRomCurve3([V3(0,.4,.4),V3(.2,1.2,.6),V3(.8,1.8,.3),V3(1.5,2.0,-.2),V3(2.2,1.6,-.4),V3(2.6,1.0,0)]);
  s.tick=t=>{const u=(t*.08)%1;mrna.position.x=-u*1.2;const n=Math.floor(u*40);chain.forEach((o,i)=>{o.visible=i<n;if(i<n)o.position.copy(path.getPointAt(Math.min(1,(n-i)/40)))})};
  lab(s,'subunidade maior',[1.0,1.3,.2]);lab(s,'subunidade menor',[-.9,-1.25,.5]);lab(s,'RNA mensageiro (a receita)',[-2.6,-.05,.4]);lab(s,'RNA transportador (traz aminoácidos)',[.45,.35,1.5]);lab(s,'proteína nascendo',[1.6,2.2,-.2]);s.labels[4].live=()=>{const n=chain.filter(o=>o.visible).length;return path.getPointAt(Math.min(1,Math.max(n,4)/40)).add(V3(0,.15,0))};return s},

membrana(){SEED=68;const s=scene({dist:8.8,upu:.03/6,cam:V3(0,.6,1)}),G=s.g;const prot=[{p:V3(-1.2,0,-.2),r:.6},{p:V3(1.3,0,.4),r:.55},{p:V3(.1,0,-.9),r:.5}];
  const free=(x,z)=>prot.every(q=>Math.hypot(x-q.p.x,z-q.p.z)>q.r+.08);const heads=[],tails=[],chol=[];
  for(let i=0;i<24;i++)for(let j=0;j<16;j++){const x=-3+i*.26+rr(-.03,.03),z=-2+j*.26+rr(-.03,.03);if(!free(x,z))continue;
    for(const sg of[1,-1]){heads.push({p:V3(x,sg*.62,z)});for(const dx of[-.045,.045])tails.push({p:V3(x+dx,sg*.34,z),r:[rr(-.12,.12),0,rr(-.12,.12)]})}
    if(rnd()<.06)chol.push({p:V3(x+.13,.3,z+.13)})}
  G.add(inst(bumpy(sphG(.12,16),.01,10,1),M('membrana',C('membrana'),{roughness:.35,clearcoat:.8}),'membrana',heads));
  G.add(inst(new THREE.CylinderGeometry(.02,.012,.48,6),M('membrana','#ffec99',{roughness:.6}),'membrana',tails));
  G.add(inst(capG(.04,.2,8),M('membrana','#fab005',{roughness:.4}),'membrana',chol));
  const pm=M('membrana','#fff',{vc:true,roughness:.45});G.add(mesh(bumpy(ellG(.55,1.05,.5,64),.08,3,1,'#9775fa',.35),pm,'membrana',prot[0].p));
  for(let k=0;k<5;k++){const a=k/5*TAU;G.add(mesh(bumpy(capG(.15,.9,16),.03,6,k,'#4dabf7',.3),pm,'membrana',prot[1].p.clone().add(V3(Math.cos(a)*.28,0,Math.sin(a)*.28))))}
  G.add(mesh(bumpy(ellG(.45,.9,.45,64),.07,3,5,'#e64980',.3),pm,'membrana',prot[2].p));
  const sug=[];let q=prot[2].p.clone().setY(.9);for(let i=0;i<9;i++){q=q.clone().add(V3(rr(-.12,.12),.13,rr(-.12,.12)));sug.push({p:q});if(i===4){let b=q.clone();for(let j=0;j<4;j++){b=b.clone().add(V3(.12,.08,0));sug.push({p:b})}}}
  G.add(inst(new THREE.IcosahedronGeometry(.07,0),M('membrana','#69db7c',{roughness:.3}),'membrana',sug));
  const ion=noPick(mesh(sphG(.08,14),new THREE.MeshPhysicalMaterial({color:'#ffd43b',emissive:'#fab005',emissiveIntensity:.6,roughness:.2})));G.add(ion);
  s.tick=t=>{const u=(t*.3)%1;ion.position.set(prot[1].p.x,1.6-u*3.2,prot[1].p.z)};
  lab(s,'cabeça (atrai água)',[-2.6,.8,1.6]);lab(s,'caudas (fogem da água)',[-2.9,0,1.8]);lab(s,'proteína atravessando',[-1.2,1.15,-.2]);lab(s,'canal (deixa íons passar)',[1.3,1.15,.4]);lab(s,'glicoproteína (crachá da célula)',[.3,2.1,-.9]);lab(s,'colesterol',[chol[0]?chol[0].p.x:0,.35,chol[0]?chol[0].p.z:0]);return s},

citoesqueleto(){SEED=69;const s=scene({dist:9.4,upu:.2/6,cam:V3(0,.6,1)}),G=s.g;
  function mt(a,b,col1,col2){const d=b.clone().sub(a),L=d.length(),n=Math.floor(L/.085);const q=qY(d);const A=[],B=[];for(let i=0;i<n;i++)for(let k=0;k<13;k++){const an=k/13*TAU+i*.08;const p=V3(Math.cos(an)*.24,i*.085-L/2+k*.0065,Math.sin(an)*.24).applyQuaternion(q).add(a.clone().lerp(b,.5));((i+k)%2?A:B).push({p})}
    G.add(inst(sphG(.048,8),M('citoesqueleto',col1,{roughness:.4}),'citoesqueleto',A));G.add(inst(sphG(.048,8),M('citoesqueleto',col2,{roughness:.4}),'citoesqueleto',B))}
  mt(V3(-3.5,-.3,0),V3(3.5,-.3,0),'#d0ebff','#74c0fc');mt(V3(-1.5,-1.2,-2.2),V3(1.8,.4,2),'#d0ebff','#a5d8ff');
  const am=M('citoesqueleto','#ff8787',{roughness:.4});for(let f=0;f<3;f++){const y=.9+f*.32,z=-1.5+f*.6;const pts=[];for(let i=0;i<110;i++)for(const ph of[0,Math.PI])pts.push({p:V3(-3.4+i*.062,y+Math.cos(i*.42+ph)*.035,z+Math.sin(i*.42+ph)*.035)});G.add(inst(sphG(.034,8),am,'citoesqueleto',pts))}
  const im=M('citoesqueleto','#b2f2bb',{roughness:.5});for(let k=0;k<3;k++){const h=tubeG(helixPts(.05,5,5,200,'x',k*TAU/3),.03,300,6);h.rotateY(.35);h.translate(.3,-1.1,.7);G.add(mesh(h,im,'citoesqueleto'))}
  const kin=new THREE.Group();const km=M('citoesqueleto','#ffd43b',{roughness:.35});const l1=mesh(capG(.045,.35,8),km,'citoesqueleto',[-.08,.05,0]),l2=mesh(capG(.045,.35,8),km,'citoesqueleto',[.08,.05,0]);kin.add(l1,l2,mesh(tubeG([V3(0,.25,0),V3(.05,.55,0),V3(0,.85,0)],.035,12,6),km,'citoesqueleto'));
  const vs=mesh(sphG(.42,40),FILM('citoesqueleto','#ffe8a3',.55,{depthWrite:true}),'citoesqueleto',[0,1.3,0]);kin.add(vs);G.add(kin);
  s.tick=t=>{const u=(t*.1)%1;kin.position.set(-3+u*6,-.03,0);l1.rotation.z=Math.sin(t*6)*.4;l2.rotation.z=-Math.sin(t*6)*.4};
  lab(s,'microtúbulo (tubos de tubulina)',[2.6,-.05,.25]);lab(s,'filamento de actina',[1.2,1.25,-1.2]);lab(s,'filamento intermediário',[2.2,-1.05,.05]);lab(s,'cinesina (motor que anda)',[0,.4,.3]);lab(s,'carga',[0,1.75,0]);s.labels[3].live=()=>kin.position.clone().add(V3(0,.45,.2));s.labels[4].live=()=>kin.position.clone().add(V3(0,1.8,0));return s},

centriolo(){SEED=70;const s=scene({dist:8.4,upu:.5/4.5,cam:V3(0,.7,1)}),G=s.g;const cm=M('centriolo',C('centriolo'),{roughness:.35,clearcoat:.8});
  function barrel(pos,rot){const g=new THREE.Group();g.position.copy(pos);g.rotation.set(...rot);const T=[];for(let k=0;k<9;k++){const a=k/9*TAU;for(let j=0;j<3;j++){const ang=a+j*.16,R=.5+j*.075;T.push({p:V3(Math.cos(ang)*R,0,Math.sin(ang)*R)})}}
    g.add(inst(new THREE.CylinderGeometry(.075,.075,1.5,14),cm,'centriolo',T));const sp=M('centriolo','#ffe3e3',{roughness:.4});for(let k=0;k<9;k++){const a=k/9*TAU;const o=mesh(new THREE.CylinderGeometry(.015,.015,.5,6),sp,'centriolo',[Math.cos(a)*.25,-.6,Math.sin(a)*.25],[0,-a,Math.PI/2]);g.add(o)}
    g.add(mesh(new THREE.CylinderGeometry(.06,.06,.1,12),sp,'centriolo',[0,-.6,0]));G.add(g);return g}
  barrel(V3(-.55,0,0),[0,0,0]);barrel(V3(.75,-.15,.25),[Math.PI/2,0,.3]);
  G.add(noPick(inst(sphG(.035,8),M(null,'#ffd8d8',{roughness:.6,transparent:true,opacity:.55,depthWrite:false}),null,Array.from({length:420},()=>{const d=V3(rr(-1,1),rr(-1,1),rr(-1,1)).normalize();return{p:d.multiplyScalar(rr(1.25,1.9)),s:rr(.5,1.2)}}))));
  const tm=M('citoesqueleto','#d0ebff',{roughness:.4,transparent:true,opacity:.8});for(let i=0;i<10;i++){const d=V3(rr(-1,1),rr(-1,1),rr(-1,1)).normalize();G.add(mesh(tubeG([d.clone().multiplyScalar(1.4),d.clone().multiplyScalar(2.4).add(V3(rr(-.3,.3),rr(-.3,.3),0)),d.clone().multiplyScalar(3.4)],.035,20,6),tm,'centriolo'))}
  lab(s,'trinca de microtúbulos',[-.05,.8,.35]);lab(s,'9 trincas formando um cilindro',[-.55,.85,-.6]);lab(s,'par em ângulo reto',[1.2,.3,.6]);lab(s,'nuvem que lança microtúbulos',[1.6,1.4,-.2]);return s},

peroxissomo(){SEED=71;const s=scene({dist:7.3,upu:.5/3.2,cam:V3(0,1.1,1)}),G=s.g;const P=CUT();
  G.add(mesh(bumpy(sphG(1.55,80),.03,2.6,2,C('peroxissomo'),.3),M('peroxissomo','#fff',{vc:true,clippingPlanes:P,side:THREE.DoubleSide,roughness:.35}),'peroxissomo'));
  const cr=[];for(let i=0;i<6;i++)for(let j=0;j<4;j++)for(let k=0;k<6;k++)cr.push({p:V3(-.45+i*.18,-.95+j*.18,-.45+k*.18).applyAxisAngle(V3(0,1,0),.5)});
  G.add(inst(new THREE.BoxGeometry(.13,.13,.13),M('peroxissomo','#fff3bf',{roughness:.15,clearcoat:1,metalness:.1,clippingPlanes:P}),'peroxissomo',cr));
  G.add(inst(bumpy(sphG(.07,14),.02,14,1),M('peroxissomo','#ffa94d',{roughness:.4,clippingPlanes:P}),'peroxissomo',Array.from({length:90},()=>({p:V3(rr(-1.3,1.3),rr(-1.2,-.05),rr(-1.3,1.3))})).filter(t=>t.p.length()<1.35&&(Math.abs(t.p.x)>.6||Math.abs(t.p.z)>.6))));
  const bm=new THREE.MeshPhysicalMaterial({color:'#e7f5ff',transmission:0,transparent:true,opacity:.6,roughness:.05,clearcoat:1});const bub=Array.from({length:10},(_,i)=>{const o=noPick(mesh(sphG(.07,12),bm));G.add(o);return{o,x:rr(-1,1),z:rr(-1,1),ph:i/10}});
  s.tick=t=>{for(const b of bub){const u=(t*.2+b.ph)%1;b.o.position.set(b.x*.9,-1.1+u*1.2,b.z*.9);b.o.scale.setScalar(u<.85?1:Math.max(.01,(1-u)*6))}};
  lab(s,'membrana simples',[-1.45,.1,.6]);lab(s,'cristal de enzima (urato oxidase)',[0,-.15,0]);lab(s,'catalase',[1.0,-.4,.6]);lab(s,'água oxigenada sendo desfeita',[-.8,-.1,-.6]);return s},

vacuolo(){SEED=72;const s=scene({dist:10.4,upu:10/6,cam:V3(0,.36,1)}),G=s.g;const fb=[];
  for(let L=0;L<4;L++){const a=L*.9;for(let i=0;i<26;i++){const off=-2.4+i*.19;fb.push({p:V3(0,-1.75+L*.1,off).applyAxisAngle(V3(0,1,0),a),q:new THREE.Quaternion().setFromUnitVectors(V3(0,1,0),V3(1,0,0).applyAxisAngle(V3(0,1,0),a))})}}
  G.add(inst(new THREE.CylinderGeometry(.045,.045,5,8),M('vacuolo','#d8f5a2',{roughness:.6}),'vacuolo',fb));
  G.add(mesh(new THREE.BoxGeometry(5,.04,5),FILM('membrana',C('membrana'),.35),'membrana',[0,-1.45,0]));
  const vg=bumpy(sphG(1.8,96),.03,1.5,4);G.add(mesh(vg,FILM('vacuolo',C('vacuolo'),.28,{roughness:.05}),'vacuolo',[0,.55,0]));const r=noPick(mesh(vg,RIM('#99e9f2',1.3,2)));r.position.y=.55;G.add(r);
  const aq=[];for(let i=0;i<46;i++){const d=V3(rr(-1,1),rr(-1,1),rr(-1,1)).normalize();aq.push({p:d.clone().multiplyScalar(1.8).add(V3(0,.55,0)),q:qY(d)})}G.add(inst(new THREE.CylinderGeometry(.07,.07,.16,8),M('vacuolo','#1098ad',{roughness:.3}),'vacuolo',aq));
  const wm=new THREE.MeshPhysicalMaterial({color:'#e7f5ff',roughness:.1,clearcoat:1});const wat=Array.from({length:16},(_,i)=>{const o=noPick(mesh(sphG(.06,10),wm));G.add(o);const d=aq[i*2].p.clone().sub(V3(0,.55,0)).normalize();return{o,d,ph:i/16}});
  s.tick=t=>{for(const w of wat){const u=(t*.15+w.ph)%1;w.o.position.copy(w.d).multiplyScalar(2.6-u*1.6).add(V3(0,.55,0))}};
  lab(s,'parede celular (fibras de celulose cruzadas)',[2.2,-1.6,-.6]);lab(s,'membrana plasmática',[-2.3,-1.42,.9]);lab(s,'vacúolo central (água + sais)',[0,.6,0]);lab(s,'tonoplasto (membrana do vacúolo)',[-1.3,1.7,.6]);lab(s,'aquaporina: canal de água',[1.4,1.3,.8]);G.position.y=.1;return s}
};
