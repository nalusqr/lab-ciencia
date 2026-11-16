/* LAB Vírus: kit das cenas 3D (Martin). Copiado e adaptado do histo3d.js da Histologia, sem tocar naquele arquivo.
   Usa o visor do mol3d.js (superamostragem, fundo desfocado, brilho só nos destaques, qualidade adaptativa, câmera viva que
   cede ao usuário e volta depois de 12 s parado). Cada cena entra com VIR3D.cena('sec/id', {...}); a cena 2D antiga vira o
   plano B sem WebGL e continua rodando escondida para manter a legenda, o estado dos botões e a faixa que anda sozinha.
   Modos que são cartões, gráficos ou jogos de tocar continuam no desenho plano com o.so2D(S).
   As peças próprias dos vírus (capsídeo, envelope, espículas, fago, bactéria, anticorpo) ficam em vir3d-pecas.js. */
'use strict';
(function () {
  if (typeof SC === 'undefined') return;
  const TAU = Math.PI * 2;
  const cl = (v, a, b) => (v < a ? a : v > b ? b : v), mix = (a, b, t) => a + (b - a) * t;
  const seg = (t, a, b) => cl((t - a) / (b - a), 0, 1), sst = (a, b, x) => { const t = seg(x, a, b); return t * t * (3 - 2 * t); };
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const len = a => Math.hypot(a[0], a[1], a[2]), nrm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const lerp3 = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
  const fr = v => v - Math.floor(v);
  function h3(x, y, z) { let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function vnoise(x, y, z) {
    const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z), fx = x - X, fy = y - Y, fz = z - Z;
    const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz), L = (a, b, t) => a + (b - a) * t;
    return L(L(L(h3(X, Y, Z), h3(X + 1, Y, Z), u), L(h3(X, Y + 1, Z), h3(X + 1, Y + 1, Z), u), v),
      L(L(h3(X, Y, Z + 1), h3(X + 1, Y, Z + 1), u), L(h3(X, Y + 1, Z + 1), h3(X + 1, Y + 1, Z + 1), u), v), w);
  }
  const hash = (i, k) => h3(i, k || 0, 7);
  function trilha(P, f) {
    f = cl(f, 0, 1); let tot = 0; const L = [];
    for (let i = 1; i < P.length; i++) { const d = len(sub(P[i], P[i - 1])); L.push(d); tot += d; }
    let d = f * tot; for (let i = 0; i < L.length; i++) { if (d <= L[i] || i === L.length - 1) return lerp3(P[i], P[i + 1], L[i] ? cl(d / L[i], 0, 1) : 0); d -= L[i]; }
    return P[0].slice();
  }
  const bez = (a, c, b, f) => lerp3(lerp3(a, c, f), lerp3(c, b, f), f);
  const surge = f => Math.min(1, Math.sin(cl(f, 0, 1) * Math.PI) * 3);
  // degraus: a faixa anda contínua, mas cada divisão acontece num trecho e depois para
  const degraus = (v, n) => { v = cl(v, 0, n); const k = Math.min(n - 1, Math.floor(v)), f = v - k; return v >= n ? n : k + sst(.08, .78, f); };
  const V = { cl, mix, seg, sst, add, sub, mul, dot, len, nrm, cross, lerp3, fr, vnoise, hash, trilha, bez, surge, degraus, TAU };
  const REDUZ = () => (window.MOL3D ? MOL3D.reduz : false);
  const E = () => (window.MOL3D ? MOL3D.E : { out: x => x, in: x => x, move: x => x });
  const CACHE = {};
  const TEM_GL = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } })();
  function qualidade() { const cel = Math.min(innerWidth, innerHeight) < 560 || innerWidth < 700; return cel ? { cel: 1, seg: 16, det: 3 } : { cel: 0, seg: 24, det: 4 }; }

  // ---------- cores fixas do módulo (as mesmas do motor 2D) ----------
  const css = (n, f) => (getComputedStyle(document.documentElement).getPropertyValue(n).trim() || f);
  const K = {
    capsideo: C.capsideo, envelope: C.envelope, espicula: C.espicula, receptor: C.receptor, dna: C.dna, dnaClaro: C.dnaClaro, dnaEscuro: C.dnaEscuro,
    rna: C.rna, membrana: C.membrana, citoplasma: C.citoplasma, nucleo: C.nucleo, ribo: C.ribo, parede: C.parede, anticorpo: C.anticorpo, vacina: C.vacina,
    amber: C.amber, nucleoE: '#5B3FB0', citoC: '#3A2A55', bactC: '#2B3A20', enzima: '#5FD3B0', integrase: '#E6C15A', protease: '#FF9A3C', sabao: '#9AD7C9'
  };

  // ---------- materiais (clearcoat suave, borda leve, variação de cor por instância) ----------
  function fis(g, cor, o = {}) {
    const T = g.T, m = new T.MeshPhysicalMaterial(Object.assign({ color: cor, roughness: .46, metalness: 0, clearcoat: .45, clearcoatRoughness: .34, envMapIntensity: .45, sheen: .35, sheenColor: new T.Color('#FFE6EE'), sheenRoughness: .5 }, o.p || {}));
    const rim = new T.Color(o.rim || '#FFD2DC').multiplyScalar((o.rimK == null ? .22 : o.rimK) * .55);
    const L = o.listras; if (L) m.userData.lis = { uLn: { value: L.n || 8 }, uLs: { value: L.s == null ? 1 : L.s }, uLo: { value: 0 } };
    m.onBeforeCompile = sh => {
      sh.uniforms.uRim = { value: rim };
      let fs = 'uniform vec3 uRim;\n' + sh.fragmentShader.replace('#include <opaque_fragment>',
        'outgoingLight += uRim * pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.6);\n#include <opaque_fragment>');
      if (L) {
        Object.assign(sh.uniforms, m.userData.lis);
        sh.vertexShader = 'varying vec3 vObjP;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjP = position;');
        // banda A escura (anisotrópica), banda I clara e a linha Z fina no meio da banda I
        fs = 'varying vec3 vObjP; uniform float uLn, uLs, uLo;\n' + fs.replace('#include <color_fragment>', `#include <color_fragment>
          float sp = fract(vObjP.y * uLn + uLo); float bA = smoothstep(.0, .05, sp) * (1.0 - smoothstep(.57, .62, sp));
          float zl = 1.0 - smoothstep(.0, .035, abs(sp - .81));
          diffuseColor.rgb *= mix(1.0, mix(1.18, .6, bA) * (1.0 - .55 * zl), uLs);`);
      }
      sh.fragmentShader = fs;
    };
    m.customProgramCacheKey = () => 'vir-rim' + (L ? '-lis' : '');
    if (o.lados) m.side = T.DoubleSide;
    if (o.planos) m.clippingPlanes = o.planos;
    g.mats.push(m); return m;
  }
  function emis(g, cor, k, o = {}) {
    const T = g.T, m = new T.MeshPhysicalMaterial(Object.assign({ color: cor, emissive: new T.Color(cor), emissiveIntensity: k == null ? 2.2 : k, roughness: .3, clearcoat: .8, clearcoatRoughness: .15 }, o));
    g.mats.push(m); return m;
  }
  // face cortada: cor chapada (pinta o lado de dentro do sólido aberto pelo plano)
  function faceCorte(g, cor, planos, o = {}) {
    const T = g.T, m = new T.MeshBasicMaterial({ color: new T.Color(cor || '#FFFFFF').multiplyScalar(o.k == null ? 1 : o.k), side: T.BackSide, clippingPlanes: planos });
    if (o.inst) m.color.setRGB(o.k || 1, o.k || 1, o.k || 1);
    g.mats.push(m); return m;
  }
  // película translúcida (Fresnel): borda clara, centro quase transparente
  function filme(g, cor, o = {}) {
    const T = g.T;
    const u = { uC: { value: new T.Color(cor) }, uC2: { value: new T.Color(o.cor2 || '#FFFFFF') }, uIn: { value: new T.Color(o.dentro || cor) }, uOp: { value: o.op == null ? 1 : o.op }, uBase: { value: o.base == null ? .05 : o.base }, uFr: { value: o.fr == null ? .6 : o.fr }, uEsc: { value: o.esc || 1.2 }, uT: { value: 0 } };
    const m = new T.ShaderMaterial({
      uniforms: u, transparent: true, depthWrite: false, side: o.frente ? T.FrontSide : T.DoubleSide, clipping: !!o.planos,
      vertexShader: '#include <clipping_planes_pars_vertex>\nvarying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vP = position; vN = normalize(normalMatrix*normal); vec4 mvPosition = modelViewMatrix*vec4(position,1.0); vV = -mvPosition.xyz; gl_Position = projectionMatrix*mvPosition;\n#include <clipping_planes_vertex>\n}',
      fragmentShader: `#include <clipping_planes_pars_fragment>
        uniform vec3 uC, uC2, uIn; uniform float uOp, uBase, uFr, uEsc, uT; varying vec3 vN; varying vec3 vV; varying vec3 vP;
        float hs(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
        float vn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(mix(hs(i), hs(i+vec3(1,0,0)), f.x), mix(hs(i+vec3(0,1,0)), hs(i+vec3(1,1,0)), f.x), f.y), mix(mix(hs(i+vec3(0,0,1)), hs(i+vec3(1,0,1)), f.x), mix(hs(i+vec3(0,1,1)), hs(i+vec3(1,1,1)), f.x), f.y), f.z); }
        void main(){
          #include <clipping_planes_fragment>
          float fr = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
          float n = vn(vP * uEsc + uT * 0.05) * 0.6 + vn(vP * uEsc * 2.7) * 0.4;
          vec3 col = mix(uIn, mix(uC, uC2, fr * 0.45), clamp(fr * 1.6, 0.0, 1.0)) * (0.8 + n * 0.4);
          gl_FragColor = vec4(col, (uBase + fr * uFr + n * 0.04) * uOp); }`
    });
    if (o.planos) m.clippingPlanes = o.planos;
    g.mats.push(m); g.filmes.push(m); return m;
  }

  // ---------- geometrias ----------
  function lumpy(g, key, seed, det, nb, amp, w0, w1) {
    const T = g.T, k = key + ':' + det; if (CACHE[k]) return CACHE[k];
    let geo = new T.IcosahedronGeometry(1, det); geo.deleteAttribute('normal'); geo.deleteAttribute('uv'); geo = window.R3F.mergeVertices(geo);
    let s = seed; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }, B = [];
    for (let j = 0; j < nb; j++) { const z = r() * 2 - 1, a = r() * TAU, q = Math.sqrt(1 - z * z), w = mix(w0, w1, r()); B.push([q * Math.cos(a), q * Math.sin(a), z, w * w, (.5 + .5 * r()) * amp]); }
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i); let m = 0;
      for (const b of B) { const d2 = (x - b[0]) ** 2 + (y - b[1]) ** 2 + (z - b[2]) ** 2; if (d2 < b[3]) { const t = 1 - d2 / b[3]; m = Math.max(m, b[4] * t * t); } }
      const rr = 1 + m + (vnoise(x * 1.9 + seed, y * 1.9, z * 1.9) - .5) * .12;
      p.setXYZ(i, x * rr, y * rr, z * rr);
    }
    geo.computeVertexNormals(); CACHE[k] = geo; return geo;
  }
  const celGeo = g => lumpy(g, 'cel', 17, g.q.cel ? 3 : 4, 5, .05, .5, .9);
  const esfera = (g, n) => { const k = 'esf:' + n; return CACHE[k] || (CACHE[k] = new g.T.SphereGeometry(1, n, Math.max(8, n * .7 | 0))); };
  const cilindro = (g, n) => { const k = 'cil:' + n; return CACHE[k] || (CACHE[k] = new g.T.CylinderGeometry(1, 1, 1, n, 1)); };
  const cone = (g, n) => { const k = 'cone:' + n; return CACHE[k] || (CACHE[k] = new g.T.ConeGeometry(1, 1, n, 1)); };
  const toro = (g, r, n, arco) => { const k = 'tor:' + r + ':' + n + ':' + (arco || 0); return CACHE[k] || (CACHE[k] = new g.T.TorusGeometry(1, r, Math.max(8, n >> 1), n * 2, arco || TAU)); };
  function capsula(g, r, h, n) {
    const T = g.T, k = 'cap:' + r + ':' + h + ':' + n; if (CACHE[k]) return CACHE[k];
    const pts = [], m = Math.max(4, n >> 1);
    for (let i = 0; i <= m; i++) { const a = -Math.PI / 2 + i / m * Math.PI / 2; pts.push(new T.Vector2(Math.cos(a) * r + 1e-4, -h + Math.sin(a) * r)); }
    for (let i = 0; i <= m; i++) { const a = i / m * Math.PI / 2; pts.push(new T.Vector2(Math.cos(a) * r + 1e-4, h + Math.sin(a) * r)); }
    const geo = new T.LatheGeometry(pts, n); CACHE[k] = geo; return geo;
  }
  // sólido de revolução a partir de um perfil [raio, y] de baixo para cima (fechado no eixo)
  function torno(g, perfil, n, key) {
    const T = g.T, k = key && 'trn:' + key + ':' + n; if (k && CACHE[k]) return CACHE[k];
    const geo = new T.LatheGeometry(perfil.map(p => new T.Vector2(Math.max(1e-4, p[0]), p[1])), n);
    if (k) CACHE[k] = geo; else g.geos.push(geo); return geo;
  }

  // ---------- instâncias reescritas a cada quadro (com gêmeo opcional para a face cortada) ----------
  function inst(g, geo, mat, max, pai, peca, matCorte) {
    const T = g.T, mk = m0 => { const m = new T.InstancedMesh(geo, m0, Math.max(1, max)); m.frustumCulled = false; m.count = 0; m.instanceMatrix.setUsage(T.DynamicDrawUsage); m.setColorAt(0, new T.Color(1, 1, 1)); m.instanceColor.setUsage(T.DynamicDrawUsage); (pai || g.raiz).add(m); return m; };
    const m = mk(mat), W = { m, n: 0, max, info: new Array(Math.max(1, max)) }; m.userData.info = W.info; if (peca) m.userData.peca = peca;
    if (matCorte) { W.m2 = mk(matCorte); W.m2.userData.info = W.info; if (peca) W.m2.userData.peca = peca; }
    g.insts.push(W); return W;
  }
  const _c = {};
  function put(g, W, p, q, sx, sy, sz, hex, k, info) {
    if (W.n >= W.max) return; const i = W.n++;
    g._p.set(p[0], p[1], p[2]); g._s.set(sx, sy == null ? sx : sy, sz == null ? sx : sz); g._m.compose(g._p, q || g.qI, g._s); W.m.setMatrixAt(i, g._m);
    const c = _c[hex] || (_c[hex] = new g.T.Color(hex)); g._c.copy(c); if (k != null && k !== 1) g._c.multiplyScalar(k); W.m.setColorAt(i, g._c);
    if (W.m2) { W.m2.setMatrixAt(i, g._m); g._c.multiplyScalar(W.kc || 1.18); W.m2.setColorAt(i, g._c); }
    W.info[i] = info || null;
  }
  function fim(W) { for (const m of W.m2 ? [W.m, W.m2] : [W.m]) { m.count = W.n; m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; m.boundingSphere = null; } W.n = 0; }
  function qy(g, dir, q) { g._v1.set(0, 1, 0); g._v2.set(dir[0], dir[1], dir[2]).normalize(); return (q || g._q).setFromUnitVectors(g._v1, g._v2); }
  function qx(g, dir, q) { g._v1.set(1, 0, 0); g._v2.set(dir[0], dir[1], dir[2]).normalize(); return (q || g._q).setFromUnitVectors(g._v1, g._v2); }
  function bastao(g, W, a, b, r, hex, k, info) { const d = sub(b, a), L = len(d); if (L < 1e-4) return; put(g, W, mul(add(a, b), .5), qy(g, d), r, L, r, hex, k, info); }
  // tubo dinâmico (caudas, cordão, vasos, tubas)
  function tubo(g, max, rad, mat, pai, peca) {
    const T = g.T, nv = max * (rad + 1), pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), idx = [];
    for (let i = 0; i < max - 1; i++) for (let j = 0; j < rad; j++) { const a = i * (rad + 1) + j, b = a + rad + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(pos, 3).setUsage(T.DynamicDrawUsage)); geo.setAttribute('normal', new T.BufferAttribute(nor, 3).setUsage(T.DynamicDrawUsage)); geo.setIndex(idx);
    const mesh = new T.Mesh(geo, mat); mesh.frustumCulled = false; (pai || g.raiz).add(mesh); g.geos.push(geo); if (peca) { mesh.userData.peca = g.pecas[peca] || peca; g.pick.push(mesh); }
    return {
      mesh, set(P, rf) {
        const n = Math.min(P.length, max); if (n < 2) { mesh.visible = false; return; } mesh.visible = true;
        let N = null;
        for (let i = 0; i < n; i++) {
          const t = nrm(sub(P[Math.min(i + 1, n - 1)], P[Math.max(i - 1, 0)]));
          if (N) { N = sub(N, mul(t, dot(N, t))); if (len(N) < 1e-4) N = null; else N = nrm(N); }
          if (!N) N = nrm(cross(t, Math.abs(t[1]) < .9 ? [0, 1, 0] : [1, 0, 0]));
          const B = cross(t, N), r = typeof rf === 'function' ? rf(i, n) : rf, o = i * (rad + 1) * 3;
          for (let j = 0; j <= rad; j++) {
            const a = j / rad * TAU, c = Math.cos(a), s = Math.sin(a), nx = N[0] * c + B[0] * s, ny = N[1] * c + B[1] * s, nz = N[2] * c + B[2] * s, k = o + j * 3;
            pos[k] = P[i][0] + nx * r; pos[k + 1] = P[i][1] + ny * r; pos[k + 2] = P[i][2] + nz * r; nor[k] = nx; nor[k + 1] = ny; nor[k + 2] = nz;
          }
        }
        geo.setDrawRange(0, (n - 1) * rad * 6); geo.attributes.position.needsUpdate = true; geo.attributes.normal.needsUpdate = true; geo.boundingSphere = null;
      }
    };
  }
  // malha simples (tocável quando recebe o id de uma peça)
  function peca(g, geo, mat, pc, pai) { const m = new g.T.Mesh(geo, mat); (pai || g.raiz).add(m); if (pc) { m.userData.peca = g.pecas[pc]; g.pick.push(m); } return m; }
  // sólido cortado: superfície de fora com luz e face cortada chapada (cor do tecido), num grupo só
  function solido(g, geo, cor, planos, o = {}) {
    const T = g.T, gr = new T.Group(), fr = fis(g, cor, Object.assign({ planos }, o.m || {})), bk = faceCorte(g, o.corte || cor, planos, { k: o.kc == null ? 1.05 : o.kc });
    const a = new T.Mesh(geo, fr), b = new T.Mesh(geo, bk); gr.add(a, b); (o.pai || g.raiz).add(gr);
    if (o.pc) { a.userData.peca = b.userData.peca = g.pecas[o.pc]; g.pick.push(a, b); }
    gr.userData.fr = a; gr.userData.bk = b; return gr;
  }
  // plano de corte: guarda a normal e a constante no espaço do objeto; o kit leva para o mundo a cada quadro
  function corte(g, ob, n, c) { const pl = new g.T.Plane(new g.T.Vector3(0, 0, -1), 0), r = { pl, ob, n: n || [0, 0, -1], c: c || 0 }; g.cortes.push(r); pl.reg = r; return pl; }
  function mundo(g, ob, p) { g._v1.set(p[0], p[1], p[2]); ob.updateMatrixWorld(true); ob.localToWorld(g._v1); return [g._v1.x, g._v1.y, g._v1.z]; }

  // ---------- bolinhas genéricas (vesículas, grânulos, partículas) ----------
  function bolas(g, max) {
    g.mS = inst(g, esfera(g, g.q.cel ? 14 : 18), fis(g, '#FFFFFF', { p: { roughness: .34, clearcoat: .7, clearcoatRoughness: .2 }, rimK: .25 }), max || 400);
    g.mE = inst(g, esfera(g, 12), emis(g, '#FFFFFF', 3.4), 200);
  }
  function bola(g, p, r, hex, k, pc) { if (r > .004) put(g, g.mS, p, null, r, null, null, hex, k, pc); }
  function brilho(g, p, r, hex, k) { if (r > .004) put(g, g.mE, p, null, r, null, null, hex, k); }

  // ---------- células ----------
  // conjunto de células com volume (membrana orgânica, núcleo opcional); com planos, a face cortada aparece na cor do citoplasma
  function celulas(g, max, o = {}) {
    const T = g.T, pl = o.planos;
    const W = inst(g, o.geo || celGeo(g), fis(g, '#FFFFFF', { p: Object.assign({ roughness: .5, clearcoat: .35, sheen: .55, sheenColor: new T.Color('#FFF0F4') }, o.p || {}), rimK: .3, planos: pl }), max, o.pai, o.pc ? g.pecas[o.pc] : null, pl ? faceCorte(g, '#FFFFFF', pl, { inst: 1, k: 1 }) : null);
    W.kc = o.kc || 1.12; g.pick.push(W.m); if (W.m2) g.pick.push(W.m2);
    if (o.nucleo) { W.nuc = inst(g, esfera(g, 14), fis(g, '#FFFFFF', { p: { roughness: .4, clearcoat: .6 }, planos: pl }), max, o.pai, null, pl ? faceCorte(g, '#FFFFFF', pl, { inst: 1, k: 1 }) : null); W.nuc.kc = 1.1; }
    return W;
  }
  // célula: p, raio, cor; forma (f = [sx, sy, sz] relativos) e rotação q opcionais; núcleo opcional (fração do raio)
  function celula(g, W, p, r, hex, o = {}) {
    if (r < .004) return; const q = o.q || null, f = o.f || [1, 1, 1];
    put(g, W, p, q, r * f[0], r * f[1], r * f[2], hex, o.k, o.pc);
    if (W.nuc && o.n) { const d = o.nd || [0, 0, 0]; put(g, W.nuc, add(p, mul(d, r)), null, r * o.n, null, null, o.cn || K.nucleo, 1, o.pc); }
  }
  function fimCel(W) { fim(W); if (W.nuc) fim(W.nuc); }
  // célula que se divide: dois lóbulos que se separam (sulco de clivagem), k de 0 a 1
  function divide(g, W, p0, r0, pa, ra, pb, rb, k, hex, o = {}) {
    if (k <= 0) { celula(g, W, p0, r0, hex, o); return; }
    const e = E().move(cl(k, 0, 1)), A = lerp3(p0, pa, e), B = lerp3(p0, pb, e), Ra = mix(r0 * .8, ra, e), Rb = mix(r0 * .8, rb, e);
    const d = nrm(sub(pb, pa)), q = qx(g, d, g._q3 || (g._q3 = new g.T.Quaternion()));
    const pinca = 1 - .12 * Math.sin(e * Math.PI), alonga = mix(1.15, 1, e);
    celula(g, W, A, Ra, o.ha || hex, Object.assign({}, o, { q, f: [alonga, pinca, pinca] }));
    celula(g, W, B, Rb, o.hb || hex, Object.assign({}, o, { q, f: [alonga, pinca, pinca] }));
  }

  // ---------- superfície de corte corada em HE (hematoxilina e eosina) ----------
  // fundo rosado com variação, fibras onduladas (o.fib, o.dir, o.fq), núcleos roxo-azulados espalhados (o.dn), luz suave (o.luz)
  // o.lado 'tras' pinta o lado de dentro de um sólido aberto por um plano de corte (o.planos)
  function he(g, cor, o = {}) {
    const T = g.T, d = o.dir || [1, 0, 0];
    const u = { uC: { value: new T.Color(cor) }, uN: { value: new T.Color(o.nuc || K.nucleo) }, uF: { value: new T.Color(o.cf || K.colag) }, uDn: { value: o.dn == null ? .35 : o.dn },
      uEsc: { value: o.esc || 3 }, uFib: { value: o.fib || 0 }, uDir: { value: new T.Vector3(d[0], d[1], d[2]).normalize() }, uFq: { value: o.fq || 7 },
      uLuz: { value: o.luz == null ? (o.lado === 'tras' ? 0 : .7) : o.luz }, uK: { value: o.k || 1 }, uOp: { value: o.op == null ? 1 : o.op }, uAl: { value: o.al || 1 }, uNr: { value: o.nr || .2 } };
    const m = new T.ShaderMaterial({
      uniforms: u, side: o.lado === 'tras' ? T.BackSide : o.lados ? T.DoubleSide : T.FrontSide, clipping: !!o.planos, transparent: o.op != null, depthWrite: o.op == null,
      vertexShader: '#include <clipping_planes_pars_vertex>\nvarying vec3 vP; varying vec3 vN; varying vec3 vV;\nvoid main(){ vP = position; vN = normalize(normalMatrix*normal); vec4 mvPosition = modelViewMatrix*vec4(position,1.0); vV = -mvPosition.xyz; gl_Position = projectionMatrix*mvPosition;\n#include <clipping_planes_vertex>\n}',
      fragmentShader: `#include <clipping_planes_pars_fragment>
        uniform vec3 uC, uN, uF, uDir; uniform float uDn, uEsc, uFib, uFq, uLuz, uK, uOp, uAl, uNr; varying vec3 vP; varying vec3 vN; varying vec3 vV;
        float hs(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
        float vn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(mix(hs(i), hs(i+vec3(1,0,0)), f.x), mix(hs(i+vec3(0,1,0)), hs(i+vec3(1,1,0)), f.x), f.y), mix(mix(hs(i+vec3(0,0,1)), hs(i+vec3(1,0,1)), f.x), mix(hs(i+vec3(0,1,1)), hs(i+vec3(1,1,1)), f.x), f.y), f.z); }
        void main(){
          #include <clipping_planes_fragment>
          vec3 p = vP * uEsc;
          float n = vn(p * 1.3) * .55 + vn(p * 3.1) * .3 + vn(p * 7.0) * .15;
          vec3 col = uC * (.8 + .4 * n);
          vec3 a = normalize(cross(uDir, abs(uDir.y) < .9 ? vec3(0., 1., 0.) : vec3(1., 0., 0.))), b = cross(uDir, a);
          float s = dot(p, a) * uFq + dot(p, b) * uFq * .6 + sin(dot(p, uDir) * 1.7) * 1.4 + vn(p * 1.6) * 3.0;
          float fb = smoothstep(.45, .95, sin(s) * .5 + .5);
          col = mix(col, uF * (.9 + .25 * n), fb * uFib * .7) * (1.0 - (1.0 - fb) * uFib * .14);
          // núcleos: pontos de Worley (redondos), alongados ao longo das fibras; uDn = fração de células com núcleo
          vec3 q = p * 1.6; q += uDir * dot(q, uDir) * (uAl - 1.0);
          vec3 ip = floor(q), fp = fract(q); float md = 9.0;
          for (int i = -1; i <= 1; i++) for (int j = -1; j <= 1; j++) for (int k = -1; k <= 1; k++) {
            vec3 o = vec3(float(i), float(j), float(k)), c = ip + o;
            if (hs(c + 9.1) < uDn) { vec3 r = o + vec3(hs(c + 1.7), hs(c + 3.1), hs(c + 5.3)) * .7 + .15 - fp; md = min(md, length(r) / (.75 + .5 * hs(c + 2.2))); }
          }
          float nk = 1.0 - smoothstep(uNr, uNr + .05, md);
          col = mix(col, uN * (.68 + .45 * vn(p * 13.0)), nk * .95);
          vec3 nn = normalize(vN); float l = .58 + .5 * max(dot(nn, normalize(vec3(.35, .75, .55))), 0.) + .18 * pow(1. - abs(dot(nn, normalize(vV))), 2.);
          gl_FragColor = vec4(col * mix(1., l, uLuz) * uK, uOp); }`
    });
    if (o.planos) m.clippingPlanes = o.planos;
    g.mats.push(m); return m;
  }
  // bloco (caixa) de tecido corado; com planos, a face de dentro também aparece corada
  function bloco(g, geo, cor, o = {}) {
    const T = g.T, gr = new T.Group(), a = new T.Mesh(geo, he(g, cor, Object.assign({}, o, { lado: 'frente' }))); gr.add(a);
    if (o.planos) { const b = new T.Mesh(geo, he(g, cor, Object.assign({}, o, { lado: 'tras', luz: 0, k: (o.k || 1) * 1.05 }))); gr.add(b); gr.userData.bk = b; if (o.pc) { b.userData.peca = g.pecas[o.pc]; g.pick.push(b); } }
    if (o.pc) { a.userData.peca = g.pecas[o.pc]; g.pick.push(a); }
    (o.pai || g.raiz).add(gr); gr.userData.fr = a; return gr;
  }
  // caixa com cantos arredondados (lado de cima levemente abaulado, como tecido de verdade)
  function caixa(g, w, h, d, n, key) {
    const T = g.T, k = 'cx:' + (key || [w, h, d, n].join(':')); if (CACHE[k]) return CACHE[k];
    const geo = new T.BoxGeometry(w, h, d, n || 24, 6, n ? Math.max(4, n >> 1) : 12), p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); if (y > h / 2 - 1e-4) p.setY(i, y + (vnoise(x * 1.7, 3, z * 1.7) - .5) * h * .06); }
    geo.computeVertexNormals(); CACHE[k] = geo; return geo;
  }

  // ---------- hemácia (disco bicôncavo, perfil de Evans e Fung) ----------
  function hemGeo(g) {
    const T = g.T, k = 'hem:' + (g.q.cel ? 1 : 0); if (CACHE[k]) return CACHE[k];
    const pts = [], n = 18, h = r => .5 * Math.sqrt(Math.max(0, 1 - r * r)) * (.207 + 2.003 * r * r - 1.123 * r ** 4);
    for (let i = 0; i <= n; i++) { const r = Math.sin(i / n * Math.PI / 2); pts.push(new T.Vector2(r + 1e-4, -h(r))); }
    for (let i = n - 1; i >= 0; i--) { const r = Math.sin(i / n * Math.PI / 2); pts.push(new T.Vector2(r + 1e-4, h(r))); }
    const geo = new T.LatheGeometry(pts, g.q.cel ? 18 : 26); geo.computeVertexNormals(); CACHE[k] = geo; return geo;
  }
  function hemacias(g, max, pc, pai) {
    const W = inst(g, hemGeo(g), fis(g, '#FFFFFF', { p: { roughness: .38, clearcoat: .55, clearcoatRoughness: .3, sheen: .5, sheenColor: new g.T.Color('#FFC9C0') }, rim: '#FFB0A8', rimK: .35 }), max, pai, pc ? g.pecas[pc] : null);
    g.pick.push(W.m); return W;
  }
  // gira uma hemácia: eixo sorteado por i, tombando com o tempo
  function giro(g, i, t, q) { g._e.set(hash(i, 3) * TAU + t * (.3 + hash(i, 4) * .5), hash(i, 5) * TAU, hash(i, 6) * TAU + t * .2); return (q || g._q).setFromEuler(g._e); }

  // ---------- vaso (capilar ou arteríola) com parede translúcida, endotélio e hemácias correndo ----------
  // P = pontos do eixo; r = raio; o.n hemácias, o.vel, o.pc, o.pai, o.H (instâncias de hemácias compartilhadas)
  function vaso(g, P, r, o = {}) {
    const T = g.T, pai = o.pai || g.raiz;
    const parede = tubo(g, P.length, g.q.cel ? 14 : 20, filme(g, o.cor || '#F06C82', { cor2: '#FFD0D8', dentro: o.dentro || '#5A1828', base: o.base == null ? .2 : o.base, fr: .55, esc: 2.5, planos: o.planos }), pai, o.pc);
    parede.set(P, r); parede.mesh.renderOrder = 4;
    const H = o.H || hemacias(g, o.n || 12, o.pc, pai);
    const v = { parede, H, P, r, n: o.n == null ? 8 : o.n, vel: o.vel == null ? .06 : o.vel, k: 1,
      set(t, op = {}) {
        const n = op.n == null ? v.n : op.n, vel = REDUZ() ? 0 : (op.vel == null ? v.vel : op.vel), rr = op.r || v.r;
        for (let i = 0; i < n; i++) {
          const f = fr(t * vel + i / n + hash(i, 9) * .3 / n), c = trilha(v.P, f), u = hash(i, 1) * TAU, d = rr * .35 * hash(i, 2);
          const off = [Math.cos(u) * d, Math.sin(u) * d, Math.cos(u + 1) * d * .6];
          put(g, H, add(c, off), giro(g, i, t), rr * .62, rr * .62, rr * .62, K.hemacia, .95 + .1 * hash(i, 7), o.pc ? g.pecas[o.pc] : null);
        }
        if (!o.H) fim(H);
      }
    };
    return v;
  }
  // fibra ondulada de a a b (para colágenas e elásticas); amp 0 = esticada
  function onda(a, b, amp, fase, n, eixo) {
    const P = [], d = sub(b, a), L = len(d), t = nrm(d), u = nrm(cross(t, eixo || (Math.abs(t[1]) < .9 ? [0, 1, 0] : [1, 0, 0]))), w = cross(t, u);
    for (let i = 0; i < n; i++) { const s = i / (n - 1), k = Math.sin(s * L * 2.2 + fase) * amp, k2 = Math.cos(s * L * 1.3 + fase * 1.7) * amp * .5; P.push(add(add(a, mul(d, s)), add(mul(u, k), mul(w, k2)))); }
    return P;
  }

  // ---------- ficha e texto (camada 2D por cima) ----------
  function ficha(g, p, s, cor, o = {}) { g.fichas.push({ p, s, cor, a: o.a == null ? 1 : o.a, pr: o.pr || 5, dx: o.dx || 0, dy: o.dy == null ? -1 : o.dy }); }
  function texto(g, p, s, o = {}) { g.textos.push({ p, s, o }); }
  // reserva um retângulo de tela (painel 2D) para as fichas não passarem por cima
  function reserva(g, r) { g.reservas.push(r); }
  function desenharFichas(g) {
    const ocup = g.reservas.slice(), Wd = W, Hd = H, topo = NAR ? 48 : 70, base = Hd - (NAR ? 64 : 58);
    g.textos.forEach(t => { const q = tela(g, t.p); if (q[2] > 1) return; const o = Object.assign({ s: 13, w: 600, c: C.txt }, t.o), w = tw(t.s, o.s, o.w), x = q[0] + (o.dx || 0); const xd = o.a === 'left' ? cl(x, 8, Wd - 8 - w) : o.a === 'right' ? cl(x, 8 + w, Wd - 8) : cl(x, 8 + w / 2, Wd - 8 - w / 2), yd = cl(q[1] + (o.dy || 0), topo, base); X.save(); X.globalAlpha = o.al == null ? 1 : o.al; tx(t.s, xd, yd, o); X.restore(); ocup.push([o.a === 'left' ? xd : o.a === 'right' ? xd - w : xd - w / 2, yd - 9, w, 18]); });
    (g.rots || []).forEach(x => { const a = g.anc[x.r.pc]; if (!a || !g.vis[x.r.pc]) return; const q = tela(g, a); if (q[2] > 1) return; ocup.push([q[0] - 8, q[1] - 12, tw(x.r.t, 12, 600) + 34, 24]); });
    g.fichas.sort((a, b) => a.pr - b.pr).forEach(f => {
      if (f.a <= .05) return; const q = tela(g, f.p); if (q[2] > 1) return;
      X.font = `700 12px ${FT}`; const w = X.measureText(f.s).width + 12, h = 20;
      let x = q[0] + f.dx * (w / 2 + 10), y = q[1] + f.dy * 18; x = cl(x, w / 2 + 6, Wd - w / 2 - 6); y = cl(y, topo + 4, base);
      const r = [x - w / 2, y - h / 2, w, h]; if (ocup.some(o => r[0] < o[0] + o[2] + 3 && r[0] + r[2] + 3 > o[0] && r[1] < o[1] + o[3] + 2 && r[1] + r[3] + 2 > o[1])) return;
      ocup.push(r); tok(x, y, f.s, f.cor, { a: f.a });
    });
  }

  // ---------- câmera ----------
  function viva(c, t, k) { if (REDUZ()) return c; const a = k == null ? 1 : k; c.th += Math.sin(t * .11) * .12 * a; c.fi += Math.sin(t * .083 + 1) * .04 * a; c.d *= 1 + Math.sin(t * .07) * .02 * a; return c; }
  function enquadrar(g, hx, hy, prof) { const v = g.v, tg = Math.tan(v.cam.fov * Math.PI / 360), asp = Math.max(.3, v.w / Math.max(1, v.h)); return Math.max(hy / tg, hx / (tg * asp)) + (prof || 0); }
  function tela(g, p) { const v = g.v; g._v1.set(p[0], p[1], p[2]); g._v1.project(v.cam); return [(g._v1.x + 1) / 2 * v.w, (1 - g._v1.y) / 2 * v.h, g._v1.z]; }
  const deitado = g => g.v.w >= g.v.h * 1.05;

  // ---------- a faixa toca sozinha ----------
  // uma vez ao abrir, de min a max em dur segundos; se a pessoa mexer, ela manda (como nas cenas C)
  function umaVez(S, t, ctl, dur) {
    if (S.vSet === undefined) { S.vSet = S.v; S.toq = false; }
    if (S.v !== S.vSet) S.toq = true;
    if (!S.toq && !S.paused && t <= dur + .05) { const v = cl(Math.round(mix(ctl.min, ctl.max, sst(0, 1, t / dur)) / ctl.step) * ctl.step, ctl.min, ctl.max); if (v !== S.v) { S.v = S.vSet = v; sinc(ctl, S); } }
    return S.v;
  }
  // em laço, enquanto a pessoa não mexe na faixa (pausa no fim e volta ao começo; como nas cenas D)
  let curS = null;
  const ctlR = document.getElementById('ctlR'); if (ctlR) ctlR.addEventListener('input', () => { if (curS) curS.user = true; });
  function laco(ctl, S, vel, max, hold) {
    curS = S; max = max == null ? ctl.max : max; hold = hold == null ? 2.5 : hold;
    if (!S.paused && !S.user) { if (S.hold > 0) { S.hold -= S.dt; if (S.hold <= 0) S.v = ctl.min; } else { S.v += S.dt * vel; if (S.v >= max) { S.v = max; S.hold = hold; } } }
    sinc(ctl, S);
  }
  function sinc(ctl, S) { const r = document.getElementById('ctlR'); if (!r) return; const s = ctl.f(S.v); if (S._lastF !== s) { S._lastF = s; r.value = S.v; const v = document.getElementById('ctlV'); if (v) v.textContent = s; r.setAttribute('aria-valuetext', s); } }

  // ---------- registro das cenas ----------
  const SOMBRA = (() => { const c = document.createElement('canvas'); c.width = c.height = 1; return c.getContext('2d'); })();
  function cena(chave, o) {
    const old = SC[chave]; if (!old || !window.MOL3D || !TEM_GL) return;   // sem WebGL a cena 2D fica como está
    let G = null; const pecas = o.pecas || {};
    Object.keys(pecas).forEach(id => { const p = pecas[id]; p.id = id; if (!p.cor) p.cor = '#CFE0FF'; p.centro = () => { const a = G && G.anc[id]; return a ? [a[0], a[1], a[2], (o.raioPc && o.raioPc[id]) || 2.5] : null; }; });
    const rotulos = o.rotulos || [];
    function montar(M) {
      const v = MOL3D.visor, T = v.THREE, q = qualidade();
      const g = G = { T, v, M, q, mats: [], geos: [], insts: [], pick: [], anc: {}, vis: {}, t: 0, dt: 0, S: null, pecas, fichas: [], textos: [], reservas: [], cortes: [], filmes: [], old };
      g._m = new T.Matrix4(); g._p = new T.Vector3(); g._s = new T.Vector3(); g._c = new T.Color(); g._q = new T.Quaternion(); g._q2 = new T.Quaternion(); g._v1 = new T.Vector3(); g._v2 = new T.Vector3(); g.qI = new T.Quaternion(); g._e = new T.Euler(); g._n = new T.Matrix3();
      g.raiz = M._nos.raiz;
      M.semVolume = true; M.fitFixo = o.fit || 30; M.raioFixo = o.raio || 10; M.vista = Object.assign({ th: 0, fi: .15, zoom: 1 }, o.vista || {});
      g.luz0 = []; v.cam.children.forEach(l => { if (l.isLight) g.luz0.push([l, l.intensity]); });
      if (g.luz0[0]) g.luz0[0][0].intensity = 1.55; if (g.luz0[1]) g.luz0[1][0].intensity = .5; if (g.luz0[2]) g.luz0[2][0].intensity = 2.2;
      g.hemi = new T.HemisphereLight(o.ceu || '#D6DEFF', o.chao || '#3A1E2D', .36); g.raiz.add(g.hemi);
      g.fog0 = v.cena.fog; v.cena.fog = null; g.clip0 = v.ren.localClippingEnabled; v.ren.localClippingEnabled = true;
      g.rots = rotulos.map((r, i) => {
        const id = 'L' + i, pc = pecas[r.pc] || { cor: '#CFE0FF' }; M.no(id);
        const a = M.atomo('X', [0, 0, 0], { no: id, nome: pc.nome || r.t, frase: pc.frase, cor: pc.cor, r: [.001, .001] });
        M.atomos[a].pc = r.pc; M.rotulo(a, r.t, r.pr || i + 1); return { r, id, a };
      });
      bolas(g, o.bolas);
      o.montar(g, M);
      M.pegar = ray => {
        const vivo = ob => { for (let x = ob; x; x = x.parent) if (!x.visible) return false; return !(ob.isInstancedMesh && !ob.count); };
        const hs = ray.intersectObjects(g.pick.filter(vivo), false);
        for (const h of hs) {
          const pls = h.object.material && h.object.material.clippingPlanes; if (pls && pls.some(p => p.distanceToPoint(h.point) < 0)) continue;
          const pc = (h.object.userData.info && h.instanceId != null && h.object.userData.info[h.instanceId]) || h.object.userData.peca; if (pc) return pc;
        }
        return null;
      };
      g.pick.push(g.mS.m);
      M.pecas = () => { const ids = []; g.rots.forEach(x => { if (G.vis[x.r.pc] && ids.indexOf(x.r.pc) < 0 && pecas[x.r.pc]) ids.push(x.r.pc); }); return ids.map(id => pecas[id]); };
      M.limpar = () => limpar(g);
    }
    function limpar(g) {
      const v = g.v;
      if (o.limpar) try { o.limpar(g); } catch (e) { console.error(e); }
      g.luz0.forEach(([l, i]) => { l.intensity = i; }); v.cena.fog = g.fog0 || null; v.ren.localClippingEnabled = !!g.clip0;
      g.insts.forEach(W => { W.m.dispose(); if (W.m2) W.m2.dispose(); }); g.mats.forEach(m => m.dispose()); g.geos.forEach(x => x.dispose());
      G = null;
    }
    function animar(M, P) {
      const g = G; if (!g) return;
      g.dt = Math.max(0, P.t - g.t); if (g.dt > .5) g.dt = 0; g.t = P.t; g.P = P; g.S = P.S;
      const s = g.v.sel; let sid = null;
      if (s) { if (s.custom) sid = s.custom.id; else if (s.atomo != null && M.atomos[s.atomo]) sid = M.atomos[s.atomo].pc; }
      g.sel = sid; g.vis = {}; g.fichas = []; g.textos = []; g.reservas = [];
      o.animar(g, P);
      fim(g.mS); fim(g.mE);
      g.filmes.forEach(m => { m.uniforms.uT.value = g.t; });
      g.cortes.forEach(c => { c.ob.updateMatrixWorld(true); c.pl.normal.set(c.n[0], c.n[1], c.n[2]); c.pl.constant = c.c; c.pl.applyMatrix4(c.ob.matrixWorld, g._n.getNormalMatrix(c.ob.matrixWorld)); });
      g.rots.forEach(x => { const a = g.anc[x.r.pc], on = a && g.vis[x.r.pc] && (!x.r.se || x.r.se(g)); const n = M.nos[x.id]; if (a) n.pos = [a[0], a[1], a[2]]; n.esc = on ? 1 : 1e-4; });
      if (o.camera) { const c = o.camera(g, P); if (c) M.cam = { th: c.th, fi: c.fi, d: c.d, tx: c.al[0], ty: c.al[1], tz: c.al[2] }; }
    }
    const spec = Object.assign({}, old, {
      loc: old.loc, girar: false, montar, animar,
      init(S) { if (old.init && o.initAntigo !== false) old.init.call(old, S); if (o.init) o.init(S); },
      plano(t, S) { if (o.initAntigo === false && old.init && !S._ini2d) { S._ini2d = 1; old.init.call(old, S); } return old.draw.call(old, t, S); }
    });
    delete spec.draw;
    const c3 = MOL3D.cena(spec), d3 = c3.draw, tl = document.getElementById('cv').parentElement;
    c3.draw = function (t, S) {
      const r = d3.call(this, t, S);
      const v = MOL3D.visor, on = !!(v && v.spec === c3 && v.M && G);
      tl.classList.toggle('g3', on);
      // modo 2D: algumas vistas secundárias (gráficos e linhas do tempo) continuam no desenho plano, por cima do palco 3D
      const so2 = on && o.so2D && o.so2D(S); tl.classList.toggle('so2d', !!so2);
      if (so2) { X.clearRect(0, 0, W, H); const gr = X.createRadialGradient(W / 2, H * .46, 0, W / 2, H * .46, Math.max(W, H) * .62); gr.addColorStop(0, css('--stage-in', '#161D33')); gr.addColorStop(1, css('--bg', '#0B0F1C')); X.fillStyle = gr; X.fillRect(0, 0, W, H); LBS = []; X.save(); try { old.draw.call(old, t, S); } catch (err) { console.error(err); } finally { X.restore(); X.globalAlpha = 1; X.setLineDash([]); } return r; }
      if (on) {
        // a cena 2D antiga roda escondida num quadro de 1 px: mantém legenda, estado dos botões e a faixa que anda sozinha
        if (o.sombra !== false) { const X0 = X; X = SOMBRA; LBS = []; X.save(); try { old.draw.call(old, t, S); } catch (err) { console.error(err); } finally { X.restore(); X = X0; LBS = []; } }
        X.clearRect(0, 0, W, H); X.save();
        try { if (o.sobre) o.sobre(G, S); desenharFichas(G); } catch (err) { console.error(err); }
        X.restore(); X.globalAlpha = 1; X.setLineDash([]);
        if (o.legenda) cap(o.legenda(G, S));
      }
      return r;
    };
    const sair0 = c3.sair; c3.sair = function () { tl.classList.remove('g3', 'so2d'); const s2 = old.sair || old.sai; if (s2) try { s2.call(old); } catch (e) { console.error(e); } if (o.sair) try { o.sair(); } catch (e) { console.error(e); } return sair0.call(this); };
    c3.sec = old.sec; c3.key = old.key; SC[chave] = c3;
  }

  // estilos do palco 3D neste módulo (o #cv 2D fica por cima, transparente e sem receber toque)
  function estilos() {
    if (document.getElementById('v3-css')) return;
    const st = document.createElement('style'); st.id = 'v3-css';
    st.textContent = `.tela.g3 #cv{position:absolute;inset:0;z-index:1;pointer-events:none}
.tela.so2d .m3-rot,.tela.so2d .m3-barra,.tela.so2d .m3-info{visibility:hidden}.tela.so2d #cv{pointer-events:auto}
.tela.g3 .m3-rot,.tela.g3 .hud{z-index:2}.tela.g3 .m3-info{z-index:3}
.palco .m3-barra{border-top:1px solid var(--line)}
.palco:has(.tela.so2d) .m3-barra{visibility:hidden}`;
    document.head.appendChild(st);
    const tl = document.getElementById('cv').parentElement; if (tl && !tl.id) tl.id = 'view';
  }
  estilos();

  window.VIR3D = { cena, V, K, he, bloco, caixa, hemGeo, hemacias, giro, vaso, onda, fis, emis, faceCorte, filme, lumpy, celGeo, esfera, cilindro, cone, toro, capsula, torno, inst, put, fim, qy, qx, bastao, tubo, peca, solido, corte, mundo, bola, brilho, celulas, celula, fimCel, divide, ficha, texto, reserva, viva, enquadrar, tela, deitado, qualidade, umaVez, laco, sinc, E, REDUZ };
})();

