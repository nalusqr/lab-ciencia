// ================= MODELOS do Blender (.glb embutido em .glb.js) · dono: Prometeu =================
// Este arquivo é concatenado DEPOIS de d_app.js, dentro do mesmo IIFE. Para não colidir com nomes do
// Aurelius (já houve bug com `hash` duplicado), tudo aqui mora no objeto MODELOS ou começa com "mod".
// Os únicos nomes soltos são MODELOS, carregarModelo e os auxiliares mod*.
//
// ATENÇÃO: este arquivo vai embutido num script inline do index.html. Nunca escreva aqui "<" seguido de "/script",
// nem em comentário: ela fecha a tag e quebra a página inteira ("Unexpected end of input").
// De onde vem o modelo: scripts/glb2js.py transforma site/assets/modelos/X.glb em X.glb.js, que faz
//   window.LAB_MODELOS = window.LAB_MODELOS||{}; LAB_MODELOS['X'] = '<base64>';
// Basta uma tag script com src="../assets/modelos/X.glb.js" na página, ANTES do script principal.
// (Em file:// o navegador bloqueia fetch de .glb, mas não bloqueia <script src>.)
//
// API
//   carregarModelo(nome)  -> Promise<THREE.Group|null>
//       null quando não há LAB_MODELOS[nome], quando o bundle não tem GLTFLoader ou quando o .glb falha:
//       nesses casos a cena fica com a versão procedural. Resultado em cache (a mesma Promise por nome).
//       O grupo traz:  grupo.pecas   = {membrana_externa:[Mesh,...], cristas:[...], matriz:[...], ...}
//                      grupo.ancoras = {membrana_externa:Vector3, ...}  (no espaço do próprio grupo)
//       Nomes vêm dos objetos do Blender; sufixos ".001", "_002" são ignorados (cristas.001 -> cristas).
//   MODELOS.tem(nome)     -> true se o .glb.js foi incluído na página
//   MODELOS.pronto(nome)  -> o grupo, se já terminou de carregar (síncrono); senão undefined
//   MODELOS.trocar(s, nome, opcoes) -> troca, numa cena {g, anch, labels, tick, mats...}, o conteúdo
//       procedural pelo modelo assim que ele carregar, e refaz os rótulos nas âncoras do modelo.
//
// ---------------------------------------------------------------------------------------------------
// INTEGRAÇÃO (para o Aurelius; este arquivo não mexe em c_details.js, d_app.js nem build.sh):
//
// 1) build.sh: incluir este arquivo depois de d_app.js na concatenação
//      ... "$F"/src/d_app.js "$F"/src/e_modelos.js; echo '})();' ...
//    e carregar o modelo antes do script principal (junto de materials.js / r3f.js):
//      echo "<script src=\"../assets/modelos/mitocondria.glb.js\"><\/script>"   (sem a barra invertida)
//    Se o arquivo não existir, o navegador só registra um 404 de script e a cena fica procedural.
//
// 2) c_details.js, em DETB.mitocondria(), trocar o final
//      ...;lab(s,'DNA próprio',[-.9,-.25,.55]);return s},
//    por
//      ...;lab(s,'DNA próprio',[-.9,-.25,.55]);
//      if(typeof MODELOS!=='undefined')MODELOS.trocar(s,'mitocondria',{tamanho:4.6});return s},
//    O builder continua síncrono (getScene guarda a cena em CACHE): a procedural aparece na hora e é
//    trocada pela do Blender quando o parse termina (dezenas de ms). Se o modelo já estiver pronto
//    (pré-carregado), a troca acontece ali mesmo, sem piscar.
//    O `typeof` evita ReferenceError se alguém montar a página sem e_modelos.js.
// ---------------------------------------------------------------------------------------------------

// funciona também sozinho (teste-modelo.html): só depende de window.R3F, não de a_util.js
const modTHREE=window.R3F.THREE;
const MODELOS={
  _cache:{},      // nome -> Promise<Group|null>
  _prontos:{},    // nome -> Group (depois de resolvido)
  // rótulos padrão por modelo: [nome da peça no Blender, texto]. A ordem é a prioridade (os primeiros
  // ficam quando não cabe tudo). Os seis primeiros repetem os da mitocôndria procedural.
  ROTULOS:{
    mitocondria:[['membrana_externa','membrana externa'],['membrana_interna','membrana interna'],['cristas','cristas (dobras)'],
      ['matriz','matriz'],['atp_sintase','ATP sintase'],['dna_mitocondrial','DNA próprio'],['ribossomos','ribossomos próprios'],
      ['espaco_intermembranas','espaço intermembranas'],['cadeia_transportadora','cadeia transportadora de elétrons']]
  },
  tem(nome){return !!(window.LAB_MODELOS&&typeof window.LAB_MODELOS[nome]==='string')},
  pronto(nome){return MODELOS._prontos[nome]},
  carregar(nome){
    if(MODELOS._cache[nome])return MODELOS._cache[nome];
    const p=new Promise(res=>{
      const b64=window.LAB_MODELOS&&window.LAB_MODELOS[nome];
      const Loader=window.R3F&&window.R3F.GLTFLoader;
      if(typeof b64!=='string'){res(null);return}
      if(!Loader){console.warn('[modelos] o bundle vendor/r3f.js não tem GLTFLoader; usando a versão procedural de',nome);res(null);return}
      let buf;try{buf=modBase64(b64)}catch(e){console.warn('[modelos] base64 inválido em',nome,e);res(null);return}
      try{new Loader().parse(buf,'',gltf=>{
          const g=gltf.scene||(gltf.scenes&&gltf.scenes[0]);if(!g){res(null);return}
          g.name=g.name||nome;g.userData.modelo=nome;modIndexar(g);MODELOS._prontos[nome]=g;res(g)},
        err=>{console.warn('[modelos] falha ao ler',nome+'.glb',err);res(null)})}
      catch(e){console.warn('[modelos] falha ao ler',nome+'.glb',e);res(null)}});
    return MODELOS._cache[nome]=p},
  // opcoes: tamanho (maior dimensão, em unidades da cena; sem ele mantém a escala do Blender), centrar (padrão true),
  //   rotacao [x,y,z] em radianos, k (chave de seleção dos materiais; padrão = nome),
  //   rotulos ([[peça,texto],...]; padrão MODELOS.ROTULOS[nome]), ancoras ({peça:[x,y,z]} para ajustar à mão),
  //   material (função (peça, materialDoBlender) -> material a usar, ex.: um da biblioteca MAT),
  //   manterTick (padrão false: a animação procedural para de rodar).
  trocar(s,nome,o={}){
    if(!s||!s.g||!MODELOS.tem(nome))return false;
    const aplicar=orig=>{if(!orig)return;
      const m=orig.parent?modClonar(orig):orig;           // o mesmo grupo não pode estar em duas cenas
      if(o.rotacao)m.rotation.set(...o.rotacao);
      modEncaixar(m,o.tamanho,o.centrar!==false);modIndexar(m);
      const k=o.k||nome;const mats=new Set();
      m.traverse(c=>{if(!c.isMesh)return;c.userData.k=k;
        const peca=modPeca(c.name);
        c.material=[].concat(c.material).map(mt=>o.material?(o.material(peca,mt)||mt):mt);if(c.material.length===1)c.material=c.material[0];
        [].concat(c.material).forEach(mt=>mats.add(mt))});
      // os materiais entram no mesmo esquema de destaque/dessaturação de World (d_app.js): userData.k, e0, c0
      for(const mt of mats){mt.userData.k=k;mt.userData.e0=mt.emissiveIntensity||0;if(!mt.emissive)mt.emissive=new modTHREE.Color(0);
        if(mt.color&&(!mt.transparent||mt.opacity>.5))mt.userData.c0=mt.color.clone();if(s.mats&&!s.mats.includes(mt))s.mats.push(mt)}
      // tira a geometria procedural (fica só o modelo)
      for(const c of [...s.g.children]){s.g.remove(c);modDescartar(c)}
      s.g.add(m);s.g.updateMatrixWorld(true);
      if(s.mats)for(let i=s.mats.length-1;i>=0;i--)if(!mats.has(s.mats[i])){s.mats[i].dispose();s.mats.splice(i,1)}
      if(!o.manterTick)s.tick=null;
      // rótulos nas âncoras do modelo (mesmo formato de lab(): [texto, Vector3])
      const rot=o.rotulos||MODELOS.ROTULOS[nome]||Object.keys(m.pecas).map(p=>[p,p.replace(/_/g,' ')]);
      // pontos espalhados, na face voltada para a câmera (o.vista; padrão a direção da câmera da mitocôndria procedural),
      // já no espaço de s.g; o.ancoras ({peça:[x,y,z]}, também no espaço de s.g) vence o cálculo automático
      const auto=modEspalhar(m,rot.map(r=>r[0]),o.vista||[0,.95,1]);
      const nov=[];for(const [peca,texto] of rot){const a=o.ancoras&&o.ancoras[peca]?new modTHREE.Vector3(...o.ancoras[peca]):auto[peca];if(a)nov.push([texto,a])}
      s.labels.length=0;s.labels.push(...nov);
      s.modelo=m;modAvisar()};
    const ja=MODELOS.pronto(nome);
    if(ja)aplicar(ja);else MODELOS.carregar(nome).then(aplicar);
    return true}
};
const carregarModelo=nome=>MODELOS.carregar(nome);

// ---------- auxiliares (prefixo mod) ----------
function modBase64(b64){const s=atob(b64);const n=s.length;const u=new Uint8Array(n);for(let i=0;i<n;i++)u[i]=s.charCodeAt(i);return u.buffer}
// nome da peça: o GLTFLoader já tira "." e espaços dos nomes (cristas.001 -> cristas001); aqui some o número final
function modPeca(n){return String(n||'').toLowerCase().replace(/[._ -]?\d{3}$/,'')}
// pecas: peça -> lista de meshes; ancoras: peça -> ponto da superfície mais perto do centro da caixa da peça
// (fica sobre a peça, e não no meio do vazio, como aconteceria com o centro de uma casca)
function modIndexar(root){root.updateMatrixWorld(true);const inv=root.matrixWorld.clone().invert();const pecas={},ancoras={};
  root.traverse(c=>{if(!c.isMesh||c===root)return;let o=c,p=modPeca(o.name);
    // malha com vários materiais vira Group com filhos sem nome próprio: herda o nome do pai
    while((!p||/^mesh_?\d*$/.test(p))&&o.parent&&o.parent!==root){o=o.parent;p=modPeca(o.name)}if(!p)return;(pecas[p]=pecas[p]||[]).push(c)});
  const b=new modTHREE.Box3(),ctr=new modTHREE.Vector3(),v=new modTHREE.Vector3();
  for(const p in pecas){b.makeEmpty();for(const c of pecas[p])b.expandByObject(c);b.getCenter(ctr);let best=null,bd=Infinity;
    for(const c of pecas[p]){const pos=c.geometry&&c.geometry.attributes.position;if(!pos)continue;const st=Math.max(1,Math.floor(pos.count/4000));
      for(let i=0;i<pos.count;i+=st){v.fromBufferAttribute(pos,i).applyMatrix4(c.matrixWorld);const d=v.distanceToSquared(ctr);if(d<bd){bd=d;best=v.clone()}}}
    ancoras[p]=(best||ctr.clone()).applyMatrix4(inv)}
  root.pecas=pecas;root.ancoras=ancoras;return root}
// âncoras para rótulos, no espaço do pai de root: para cada peça (na ordem de prioridade), entre os vértices da face
// voltada para `vista`, escolhe o que fica mais longe das âncoras já escolhidas, sem se afastar demais do centro da peça.
// Assim os rótulos não se amontoam no meio, como acontece com o centro da caixa de peças espalhadas (cristas, ribossomos).
function modEspalhar(root,ordem,vista){root.updateMatrixWorld(true);const pinv=root.parent?root.parent.matrixWorld.clone().invert():new modTHREE.Matrix4();
  const d=new modTHREE.Vector3(...vista).normalize(),v=new modTHREE.Vector3(),out={},usadas=[];
  const raio=new modTHREE.Box3().setFromObject(root).getSize(new modTHREE.Vector3()).length()/2||1;
  for(const p of ordem){const ms=root.pecas[p];if(!ms)continue;const pts=[];
    for(const c of ms){const pos=c.geometry&&c.geometry.attributes.position;if(!pos)continue;const st=Math.max(1,Math.floor(pos.count/1500));
      for(let i=0;i<pos.count;i+=st)pts.push(v.fromBufferAttribute(pos,i).applyMatrix4(c.matrixWorld).clone())}
    if(!pts.length)continue;const ctr=new modTHREE.Box3().setFromPoints(pts).getCenter(new modTHREE.Vector3());
    const fr=pts.map(q=>q.dot(d)).sort((a,b)=>a-b);const lim=fr[Math.floor(fr.length*.6)];
    let best=null,bs=-Infinity;for(const q of pts){if(q.dot(d)<lim)continue;
      const longe=usadas.length?Math.min(...usadas.map(u=>u.distanceTo(q))):0;const sc=Math.min(longe,raio*.5)-.35*q.distanceTo(ctr);
      if(sc>bs){bs=sc;best=q}}
    usadas.push(best);out[p]=best.clone().applyMatrix4(pinv)}
  return out}
// centra na origem e escala para que a maior dimensão valha `tam`
function modEncaixar(root,tam,centrar){root.updateMatrixWorld(true);const b=new modTHREE.Box3().setFromObject(root);if(b.isEmpty())return;
  const sz=b.getSize(new modTHREE.Vector3()),mx=Math.max(sz.x,sz.y,sz.z);const k=tam&&mx>0?tam/mx:1;
  if(k!==1)root.scale.multiplyScalar(k);
  if(centrar){root.updateMatrixWorld(true);const c=new modTHREE.Box3().setFromObject(root).getCenter(new modTHREE.Vector3());root.position.sub(c)}
  root.updateMatrixWorld(true)}
// clone com materiais próprios (o destaque mexe em emissive/cor, que não podem vazar para outra cena)
function modClonar(g){const c=g.clone(true);c.traverse(o=>{if(o.isMesh)o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone()});return c}
function modDescartar(o){o.traverse(c=>{if(c.geometry)c.geometry.dispose()})}
// pede a World/rótulos que redesenhem (usa o store de d_app.js se existir; ver S, subs)
function modAvisar(){try{if(typeof S!=='undefined'&&typeof subs!=='undefined'){S.ver++;subs.forEach(f=>f())}}catch(e){}}
// pré-carrega todo modelo presente na página, para que a troca já aconteça na primeira vez que a cena for montada
if(window.LAB_MODELOS)Object.keys(window.LAB_MODELOS).forEach(n=>MODELOS.carregar(n));
