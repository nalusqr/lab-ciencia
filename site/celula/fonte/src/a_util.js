// ================= 3D: utilidades (geometria procedural, materiais) =================
const {React,ReactDOMClient,THREE,FIBER,DREI,RoomEnvironment,mergeVertices,html}=window.R3F;
const {Canvas,useFrame,useThree}=FIBER;
const MAT=window.LAB_MATERIALS?window.LAB_MATERIALS(THREE):null;   // biblioteca de materiais da equipe (site/assets/materials.js)
const {OrbitControls,Html}=DREI;
const V3=(x,y,z)=>new THREE.Vector3(x,y,z);
const TAU=Math.PI*2;
let SEED=1;const rnd=()=>((SEED=(SEED*16807)%2147483647)/2147483647);const rr=(a,b)=>a+(b-a)*rnd();
// ruído 3D (value noise + fbm)
function hash(i,j,k){let h=(i*374761393+j*668265263+k*1274126177)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967295}
function vnoise(x,y,z){const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z);let xf=x-xi,yf=y-yi,zf=z-zi;
  const u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),w=zf*zf*(3-2*zf);const L=(a,b,t)=>a+(b-a)*t;
  return L(L(L(hash(xi,yi,zi),hash(xi+1,yi,zi),u),L(hash(xi,yi+1,zi),hash(xi+1,yi+1,zi),u),v),
           L(L(hash(xi,yi,zi+1),hash(xi+1,yi,zi+1),u),L(hash(xi,yi+1,zi+1),hash(xi+1,yi+1,zi+1),u),v),w)}
function fbm(x,y,z,o=4){let a=0,amp=.5,f=1;for(let i=0;i<o;i++){a+=amp*(vnoise(x*f,y*f,z*f)*2-1);f*=2.03;amp*=.5}return a}
// solda vértices (sem costura) e desloca ao longo da normal; opcionalmente pinta cores por vértice
function weld(g){g.deleteAttribute('uv');g.deleteAttribute('normal');g=mergeVertices(g,1e-4);g.computeVertexNormals();return g}
function bumpy(g,amp=.05,freq=2,seed=0,col=null,cvar=.25,oct=4){g=weld(g);const p=g.attributes.position,n=g.attributes.normal;const c=col?new Float32Array(p.count*3):null;const base=col?new THREE.Color(col):null;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const d=fbm(x*freq+seed,y*freq-seed*.7,z*freq+seed*1.3,oct);
    p.setXYZ(i,x+n.getX(i)*d*amp,y+n.getY(i)*d*amp,z+n.getZ(i)*d*amp);
    if(c){const m=(1+cvar*fbm(x*freq*2.7-seed,y*freq*2.7,z*freq*2.7+seed,3)*1.6)*(1+Math.max(-.5,Math.min(.5,d))*.7);c[i*3]=base.r*m;c[i*3+1]=base.g*m;c[i*3+2]=base.b*m}}
  if(c)g.setAttribute('color',new THREE.BufferAttribute(c,3));g.computeVertexNormals();return g}
const sphG=(r,s=48)=>new THREE.SphereGeometry(r,s,Math.round(s*.75));
function ellG(rx,ry,rz,s=64){const g=sphG(1,s);g.scale(rx,ry,rz);return g}
// superelipsoide (caixa arredondada orgânica)
function superG(a,b,c,e=.35,s=72){const g=sphG(1,s);const p=g.attributes.position;const f=v=>Math.sign(v)*Math.pow(Math.abs(v),e);
  for(let i=0;i<p.count;i++)p.setXYZ(i,f(p.getX(i))*a,f(p.getY(i))*b,f(p.getZ(i))*c);g.computeVertexNormals();return g}
function capG(r,len,s=32){return new THREE.CapsuleGeometry(r,len,12,s,8)}
function tubeG(pts,r,seg=64,rs=10,taper=null){const cv=new THREE.CatmullRomCurve3(pts);const g=new THREE.TubeGeometry(cv,seg,r,rs,false);
  if(taper){const p=g.attributes.position;for(let i=0;i<=seg;i++){const c=cv.getPointAt(i/seg);const k=taper(i/seg);for(let j=0;j<=rs;j++){const id=i*(rs+1)+j;p.setXYZ(id,c.x+(p.getX(id)-c.x)*k,c.y+(p.getY(id)-c.y)*k,c.z+(p.getZ(id)-c.z)*k)}}g.computeVertexNormals()}
  return g}
function helixPts(r,len,turns,n=120,ax='x',ph=0){const a=[];for(let i=0;i<=n;i++){const t=i/n,an=ph+t*turns*TAU;const u=-len/2+t*len;a.push(ax==='x'?V3(u,Math.cos(an)*r,Math.sin(an)*r):V3(Math.cos(an)*r,u,Math.sin(an)*r))}return a}
// caminho aleatório suave dentro de um elipsoide (cromatina, nucleoide)
function walk(n,step,inside,start=V3(0,0,0)){const a=[start.clone()];let d=V3(rr(-1,1),rr(-1,1),rr(-1,1)).normalize();
  for(let i=0;i<n;i++){let p;for(let t=0;t<20;t++){const nd=d.clone().add(V3(rr(-.8,.8),rr(-.8,.8),rr(-.8,.8))).normalize();p=a[a.length-1].clone().addScaledVector(nd,step);if(inside(p)){d=nd;break}p=null}
    if(!p){d.negate();continue}a.push(p)}return a}
// ---------- materiais ----------
const MATS=[];// registro do cenário atual: materiais com userData.k
function M(k,col,o={}){const vc=!!o.vc;delete o.vc;const c=new THREE.Color(col);
  const m=new THREE.MeshPhysicalMaterial(Object.assign({color:vc?0xffffff:c,vertexColors:vc,roughness:.58,metalness:0,clearcoat:.12,clearcoatRoughness:.5,
    sheen:.3,sheenRoughness:.6,sheenColor:c.clone().lerp(new THREE.Color('#ffffff'),.2),specularIntensity:.65,emissive:vc?new THREE.Color('#ffffff'):c.clone(),emissiveIntensity:0},o));
  m.userData.k=k;m.userData.e0=m.emissiveIntensity;if(!m.transparent||m.opacity>.5)m.userData.c0=m.color.clone();MATS.push(m);return m}
// vidro biológico (membranas que deixam ver o interior)
function GLASS(k,tint,o={}){const t=new THREE.Color(tint);const keep={};for(const x of['roughness','opacity','clearcoat'])if(o[x]!==undefined)keep[x]=o[x];
  return M(k,t.clone().lerp(new THREE.Color('#ffffff'),.25),Object.assign({transparent:true,opacity:.2,depthWrite:false,roughness:.32,clearcoat:.7,clearcoatRoughness:.3,sheen:0,envMapIntensity:.7,specularIntensity:.8},keep))}
// película translúcida comum (para estruturas dentro de outra membrana)
function FILM(k,col,op=.35,o={}){return M(k,col,Object.assign({transparent:true,opacity:op,depthWrite:false,roughness:.15,clearcoat:1,side:THREE.DoubleSide},o))}
// brilho de borda (efeito Fresnel), aditivo
function RIM(col,int=1,pw=2.6){return new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.FrontSide,
  uniforms:{c:{value:new THREE.Color(col)},i:{value:int},p:{value:pw}},
  vertexShader:`varying vec3 vN;varying vec3 vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`uniform vec3 c;uniform float i;uniform float p;varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),p);gl_FragColor=vec4(c*f*i,f*i);}`})}
// ---------- montagem ----------
function mesh(g,m,k,pos,rot,sc){const o=new THREE.Mesh(g,m);if(k)o.userData.k=k;if(pos)o.position.copy(pos.isVector3?pos:V3(...pos));if(rot)o.rotation.set(...rot);if(sc)typeof sc==='number'?o.scale.setScalar(sc):o.scale.set(...sc);return o}
function noPick(o){o.traverse(c=>{c.raycast=()=>{}});return o}
// instâncias (ribossomos, grânulos, cabeças de fosfolipídios…)
function inst(g,m,k,list){const im=new THREE.InstancedMesh(g,m,list.length);const d=new THREE.Object3D();
  list.forEach((t,i)=>{d.position.copy(t.p);d.rotation.set(...(t.r||[0,0,0]));d.scale.setScalar(t.s||1);if(t.q)d.quaternion.copy(t.q);d.updateMatrix();im.setMatrixAt(i,d.matrix)});
  im.instanceMatrix.needsUpdate=true;if(k)im.userData.k=k;return im}
// orienta um objeto do eixo Y para uma direção
const qY=dir=>new THREE.Quaternion().setFromUnitVectors(V3(0,1,0),dir.clone().normalize());
// amostragem sem sobreposição
function placer(){const P=[];return{ok(p,r){return P.every(q=>q.p.distanceTo(p)>q.r+r)},add(p,r){P.push({p,r})}}}
function scatter(n,r,gen,pl,tries=400){const out=[];for(let i=0;i<tries&&out.length<n;i++){const p=gen();if(pl.ok(p,r)){pl.add(p,r);out.push(p)}}return out}
function dispose(g){g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)[].concat(o.material).forEach(m=>m.dispose())})}
// cena padrão: grupo + âncoras dos pontos clicáveis + rótulos fixos + animação
function scene(o){return Object.assign({g:new THREE.Group(),anch:{},labels:[],tick:null,dist:7,cam:V3(0,.55,1),upu:1,mats:MATS.splice(0)},o)}
