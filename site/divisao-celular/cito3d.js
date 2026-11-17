/* LAB Citogenética: kit das cenas 3D (Martin). Usa o visor do mol3d.js (superamostragem, fundo desfocado com bokeh,
   brilho só nos destaques, qualidade adaptativa, câmera que cede ao usuário) e acrescenta o que a divisão celular pede:
   membranas que se estrangulam (união de esferas), envoltório nuclear que se desfaz, cromatina que condensa em cromossomo,
   fuso em 3D, centrossomos, peças tocáveis e uma camada 2D por cima para o anel do ciclo, painéis e números.
   Cada cena entra com CITO3D.cena('sec/id', K => ({...})); a cena 2D antiga vira o plano B sem WebGL.
   Funções de apoio copiadas e adaptadas do morfo3d.js (Morfofisiologia), sem tocar naquele arquivo. */
'use strict';
(function () {
  const TAU = Math.PI * 2;
  const cl = (v, a, b) => (v < a ? a : v > b ? b : v), mix = (a, b, t) => a + (b - a) * t;
  const seg = (t, a, b) => cl((t - a) / (b - a), 0, 1), sst = (a, b, x) => { const t = seg(x, a, b); return t * t * (3 - 2 * t); };
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const len = a => Math.hypot(a[0], a[1], a[2]), nrm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const lerp3 = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
  function rng(s) { return () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function h3(x, y, z) { let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(z | 0, 1274126177); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  function vnoise(x, y, z) {
    const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z), fx = x - X, fy = y - Y, fz = z - Z;
    const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz), L = (a, b, t) => a + (b - a) * t;
    return L(L(L(h3(X, Y, Z), h3(X + 1, Y, Z), u), L(h3(X, Y + 1, Z), h3(X + 1, Y + 1, Z), u), v),
      L(L(h3(X, Y, Z + 1), h3(X + 1, Y, Z + 1), u), L(h3(X, Y + 1, Z + 1), h3(X + 1, Y + 1, Z + 1), u), v), w);
  }
  const hash = (i, k) => h3(i, k || 0, 7);
  const V = { cl, mix, seg, sst, add, sub, mul, dot, len, nrm, cross, lerp3, rng, vnoise, hash, TAU };
  const REDUZ = () => (window.MOL3D ? MOL3D.reduz : false);
  const E = () => (window.MOL3D ? MOL3D.E : { out: x => x, in: x => x, move: x => x });
  const CACHE = {};

  function qualidade() { const cel = Math.min(innerWidth, innerHeight) < 560 || innerWidth < 700; return cel ? { cel: 1, seg: 14, det: 3 } : { cel: 0, seg: 20, det: 4 }; }

  // ---------- materiais ----------
  function fis(g, cor, o = {}) {
    const T = g.T, m = new T.MeshPhysicalMaterial(Object.assign({ color: cor, roughness: .42, metalness: 0, clearcoat: .55, clearcoatRoughness: .3, envMapIntensity: .45, sheen: .25, sheenColor: new T.Color('#D8E2FF'), sheenRoughness: .5 }, o.p || {}));
    const rim = new T.Color(o.rim || '#8FB6FF').multiplyScalar((o.rimK == null ? .22 : o.rimK) * .55);
    m.onBeforeCompile = sh => {
      sh.uniforms.uRim = { value: rim };
      sh.fragmentShader = 'uniform vec3 uRim;\n' + sh.fragmentShader.replace('#include <opaque_fragment>',
        'outgoingLight += uRim * pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.6);\n#include <opaque_fragment>');
    };
    m.customProgramCacheKey = () => 'ct-rim';
    if (o.vc) m.vertexColors = true;
    g.mats.push(m); return m;
  }
  function emis(g, cor, k, o = {}) {
    const T = g.T, m = new T.MeshPhysicalMaterial(Object.assign({ color: cor, emissive: new T.Color(cor), emissiveIntensity: k == null ? 2.2 : k, roughness: .3, clearcoat: .8, clearcoatRoughness: .15 }, o));
    g.mats.push(m); return m;
  }
  // película translúcida: borda clara (Fresnel), centro quase transparente, manchas leves. Extras desta versão:
  // uO (até 4 esferas, em coordenadas do mundo) apaga a parte que fica dentro de outra célula, para a membrana de duas células
  // que se separam virar uma superfície só (o estrangulamento); uFrag quebra a película em placas (envoltório nuclear se desfazendo).
  function filme(g, cor, o = {}) {
    const T = g.T;
    const u = {
      uC: { value: new T.Color(cor) }, uC2: { value: new T.Color(o.cor2 || '#FFFFFF') }, uIn: { value: new T.Color(o.dentro || cor) },
      uOp: { value: 1 }, uBase: { value: o.base == null ? .05 : o.base }, uFr: { value: o.fr == null ? .6 : o.fr }, uEsc: { value: o.esc || 1.2 },
      uSel: { value: 0 }, uFrag: { value: 0 }, uN: { value: 0 }, uO: { value: [new T.Vector4(), new T.Vector4(), new T.Vector4(), new T.Vector4()] }, uT: { value: 0 }
    };
    const m = new T.ShaderMaterial({
      uniforms: u, transparent: true, depthWrite: false, side: T.DoubleSide,
      vertexShader: 'varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec3 vW; void main(){ vP = position; vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; vN = normalize(normalMatrix*normal); vec4 mv = viewMatrix*w; vV = -mv.xyz; gl_Position = projectionMatrix*mv; }',
      fragmentShader: `uniform vec3 uC, uC2, uIn; uniform float uOp, uBase, uFr, uEsc, uSel, uFrag, uN, uT; uniform vec4 uO[4]; varying vec3 vN; varying vec3 vV; varying vec3 vP; varying vec3 vW;
        float hs(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
        float vn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(mix(hs(i), hs(i+vec3(1,0,0)), f.x), mix(hs(i+vec3(0,1,0)), hs(i+vec3(1,1,0)), f.x), f.y), mix(mix(hs(i+vec3(0,0,1)), hs(i+vec3(1,0,1)), f.x), mix(hs(i+vec3(0,1,1)), hs(i+vec3(1,1,1)), f.x), f.y), f.z); }
        void main(){
          for (int i = 0; i < 4; i++) { if (float(i) >= uN) break; vec3 d = vW - uO[i].xyz; if (dot(d, d) < uO[i].w * uO[i].w) discard; }
          if (uFrag > 0.001) { float q = vn(vP * 2.6 + 3.1) * 0.65 + vn(vP * 6.0) * 0.35; if (q < uFrag) discard; }
          float fr = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
          float n = vn(vP * uEsc + uT * 0.05) * 0.6 + vn(vP * uEsc * 2.7) * 0.4;
          vec3 col = mix(uIn, mix(uC, uC2, fr * 0.45), clamp(fr * 1.6, 0.0, 1.0)) * (0.8 + n * 0.4);
          float a = (uBase + fr * uFr + n * 0.04 + uSel * 0.12) * uOp;
          gl_FragColor = vec4(col * (1.0 + uSel * 0.5), a); }`
    });
    g.mats.push(m); return m;
  }

  // ---------- geometrias ----------
  function lumpy(g, key, seed, det, nb, amp, w0, w1) {
    const T = g.T, k = key + ':' + det; if (CACHE[k]) return CACHE[k];
    let geo = new T.IcosahedronGeometry(1, det); geo.deleteAttribute('normal'); geo.deleteAttribute('uv'); geo = window.R3F.mergeVertices(geo);
    const r = rng(seed), B = [];
    for (let j = 0; j < nb; j++) { const z = r() * 2 - 1, a = r() * TAU, s = Math.sqrt(1 - z * z), w = mix(w0, w1, r()); B.push([s * Math.cos(a), s * Math.sin(a), z, w * w, (.5 + .5 * r()) * amp]); }
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i); let m = 0;
      for (const b of B) { const d2 = (x - b[0]) ** 2 + (y - b[1]) ** 2 + (z - b[2]) ** 2; if (d2 < b[3]) { const t = 1 - d2 / b[3], h = b[4] * t * t, q = cl(.5 + .5 * (h - m) / .035, 0, 1); m = mix(m, h, q) + .035 * q * (1 - q); } }
      const rr = 1 + m + (vnoise(x * 1.9 + seed, y * 1.9, z * 1.9) - .5) * .22;
      p.setXYZ(i, x * rr, y * rr, z * rr);
    }
    geo.computeVertexNormals(); CACHE[k] = geo; return geo;
  }
  function capsula(g, r, h, n) {
    const T = g.T, k = 'cap:' + r + ':' + h + ':' + n; if (CACHE[k]) return CACHE[k];
    const pts = [], m = Math.max(4, n >> 1);
    for (let i = 0; i <= m; i++) { const a = -Math.PI / 2 + i / m * Math.PI / 2; pts.push(new T.Vector2(Math.cos(a) * r + 1e-4, -h + Math.sin(a) * r)); }
    for (let i = 0; i <= m; i++) { const a = i / m * Math.PI / 2; pts.push(new T.Vector2(Math.cos(a) * r + 1e-4, h + Math.sin(a) * r)); }
    const geo = new T.LatheGeometry(pts, n); CACHE[k] = geo; return geo;
  }
  const esfera = (g, n) => { const k = 'esf:' + n; return CACHE[k] || (CACHE[k] = new g.T.SphereGeometry(1, n, Math.max(8, n * .7 | 0))); };
  const cilindro = (g, n) => { const k = 'cil:' + n; return CACHE[k] || (CACHE[k] = new g.T.CylinderGeometry(1, 1, 1, n, 1)); };
  // caixa de cantos arredondados (meia-medidas hx, hy, hz; raio r), para a célula vegetal
  function caixaR(g, hx, hy, hz, r, n) {
    const T = g.T, k = ['cx', hx, hy, hz, r, n].join(':'); if (CACHE[k]) return CACHE[k];
    let geo = new T.BoxGeometry(2, 2, 2, n, n, n); geo.deleteAttribute('normal'); geo.deleteAttribute('uv'); geo = window.R3F.mergeVertices(geo);
    const p = geo.attributes.position, H = [hx, hy, hz];
    for (let i = 0; i < p.count; i++) {
      const q = [p.getX(i) * hx, p.getY(i) * hy, p.getZ(i) * hz], c = q.map((v, j) => cl(v, -H[j] + r, H[j] - r)), d = nrm(sub(q, c));
      p.setXYZ(i, c[0] + d[0] * r, c[1] + d[1] * r, c[2] + d[2] * r);
    }
    geo.computeVertexNormals(); CACHE[k] = geo; return geo;
  }

  // ---------- instâncias reescritas a cada quadro ----------
  function inst(g, geo, mat, max, pai, peca) {
    const T = g.T, m = new T.InstancedMesh(geo, mat, Math.max(1, max)); m.frustumCulled = false; m.count = 0; m.instanceMatrix.setUsage(T.DynamicDrawUsage);
    m.setColorAt(0, new T.Color(1, 1, 1)); m.instanceColor.setUsage(T.DynamicDrawUsage); (pai || g.raiz).add(m);
    const W = { m, n: 0, max, info: new Array(Math.max(1, max)) }; m.userData.info = W.info; if (peca) m.userData.peca = peca;
    g.insts.push(W); return W;
  }
  const _c = {};
  function put(g, W, p, q, sx, sy, sz, hex, k, info) {
    if (W.n >= W.max) return; const i = W.n++;
    g._p.set(p[0], p[1], p[2]); g._s.set(sx, sy == null ? sx : sy, sz == null ? sx : sz); g._m.compose(g._p, q || g.qI, g._s); W.m.setMatrixAt(i, g._m);
    const c = _c[hex] || (_c[hex] = new g.T.Color(hex)); g._c.copy(c); if (k != null && k !== 1) g._c.multiplyScalar(k); W.m.setColorAt(i, g._c);
    W.info[i] = info || null;
  }
  function fim(W) { W.m.count = W.n; W.m.instanceMatrix.needsUpdate = true; if (W.m.instanceColor) W.m.instanceColor.needsUpdate = true; W.m.boundingSphere = null; W.n = 0; }
  function qy(g, dir, q) { g._v1.set(0, 1, 0); g._v2.set(dir[0], dir[1], dir[2]).normalize(); return (q || g._q).setFromUnitVectors(g._v1, g._v2); }
  // bastão entre dois pontos (cilindro de raio r)
  function bastao(g, W, a, b, r, hex, k, info) { const d = sub(b, a), L = len(d); if (L < 1e-4) return; put(g, W, mul(add(a, b), .5), qy(g, d), r, L, r, hex, k, info); }

  // ---------- tubo dinâmico ----------
  function tubo(g, max, rad, mat, pai, peca) {
    const T = g.T, nv = max * (rad + 1), pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), idx = [];
    for (let i = 0; i < max - 1; i++) for (let j = 0; j < rad; j++) { const a = i * (rad + 1) + j, b = a + rad + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(pos, 3).setUsage(T.DynamicDrawUsage)); geo.setAttribute('normal', new T.BufferAttribute(nor, 3).setUsage(T.DynamicDrawUsage)); geo.setIndex(idx);
    const mesh = new T.Mesh(geo, mat); mesh.frustumCulled = false; (pai || g.raiz).add(mesh); g.geos.push(geo); if (peca) mesh.userData.peca = peca;
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
  const pontas = (r0, k) => (i, n) => r0 * Math.sqrt(Math.max(.02, Math.min(1, i / (k || 2), (n - 1 - i) / (k || 2))));

  // ---------- câmera ----------
  function kf(tp, K) {
    if (tp <= K[0].t) return Object.assign({}, K[0]);
    for (let i = 0; i < K.length - 1; i++) {
      const a = K[i], b = K[i + 1]; if (tp < b.t) { const e = E().move(seg(tp, a.t, b.t)); return { th: mix(a.th, b.th, e), fi: mix(a.fi, b.fi, e), d: mix(a.d, b.d, e), al: lerp3(a.al, b.al, e) }; }
    }
    return Object.assign({}, K[K.length - 1]);
  }
  function viva(c, t, k) { if (REDUZ()) return c; const a = k == null ? 1 : k; c.th += Math.sin(t * .11) * .14 * a; c.fi += Math.sin(t * .083 + 1) * .045 * a; c.d *= 1 + Math.sin(t * .07) * .025 * a; return c; }
  // distância para caber uma caixa de meia largura hx e meia altura hy (unidades do mundo) no palco atual
  function enquadrar(g, hx, hy, prof) {
    const v = g.v, tg = Math.tan(v.cam.fov * Math.PI / 360), asp = Math.max(.3, v.w / Math.max(1, v.h));
    return Math.max(hy / tg, hx / (tg * asp)) + (prof || 0);
  }
  // ponto do mundo para a tela (px do palco)
  function tela(g, p) { const v = g.v; g._v1.set(p[0], p[1], p[2]).project(v.cam); return [(g._v1.x + 1) / 2 * v.w, (1 - g._v1.y) / 2 * v.h, g._v1.z]; }
  // px por unidade do mundo, à distância d
  const ppu = (g, d) => (g.v.h / 2) / (d * Math.tan(g.v.cam.fov * Math.PI / 360));

  // ---------- frases das peças (toque) ----------
  const FR = {
    'Envoltório nuclear': 'Membrana dupla em volta do núcleo. Desfaz-se na prófase e se refaz na telófase.',
    'Centrossomos': 'Organizam os microtúbulos do fuso. Na célula animal, cada um tem um par de centríolos.',
    'Cromatina (DNA já duplicado)': 'DNA com proteínas, ainda descondensado. Cada cromossomo já tem duas cromátides.',
    'Cromossomo com 2 cromátides': 'Duas cromátides-irmãs, cópias idênticas do DNA, unidas pelo centrômero.',
    'Fuso em formação': 'Microtúbulos que crescem a partir dos centrossomos e vão prender os cromossomos.',
    'Placa equatorial': 'O plano no meio da célula onde os cromossomos se alinham na metáfase.',
    'Fibras do fuso': 'Microtúbulos presos ao centrômero que puxam as cromátides para os polos.',
    'Centrômero': 'Região de união das cromátides-irmãs, onde as fibras do fuso se prendem.',
    'Cromátides-irmãs se separam': 'Os centrômeros se dividem e cada cromátide passa a ser um cromossomo.',
    'Envoltório se refaz': 'Em volta de cada grupo de cromossomos surge um novo envoltório nuclear.',
    'Sulco de clivagem': 'Um anel de proteínas contráteis estrangula a célula animal pelo meio.',
    'Homólogos pareados (bivalente)': 'Um cromossomo materno e o paterno equivalente, lado a lado: 4 cromátides.',
    'Crossing-over': 'Troca de pedaços entre cromátides não irmãs de um mesmo par de homólogos.',
    'Pares de homólogos no equador': 'Na metáfase I, quem se alinha no equador são os pares, não os cromossomos sozinhos.',
    'Homólogos se separam': 'Na anáfase I, cada homólogo vai para um polo, ainda com as duas cromátides.'
  };
  const PECAS_BASE = {
    membrana: { nome: 'Membrana plasmática', cor: '#F06AAE', frase: 'Envolve a célula. Na citocinese animal, ela se estrangula pelo meio.' },
    nucleo: { nome: 'Envoltório nuclear', cor: '#9A6BFF', frase: FR['Envoltório nuclear'] },
    crom: { nome: 'Cromossomo', cor: '#9A6BFF', frase: 'DNA enrolado em proteínas. Violeta: veio da mãe. Azul: veio do pai.' },
    fuso: { nome: 'Fibras do fuso', cor: '#CFE0FF', frase: 'Microtúbulos que prendem os cromossomos pelo centrômero e os puxam para os polos.' },
    polo: { nome: 'Centrossomo', cor: '#CFE0FF', frase: FR.Centrossomos },
    organela: { nome: 'Mitocôndria', cor: '#E8A15A', frase: 'As organelas também se repartem entre as células-filhas.' }
  };

  // ---------- célula em divisão (lê os estados 2D do módulo: cells, nuc, ch, poles, att, pp, cond, env, spin, dup, nucl, bend, xo) ----------
  // o = { k (unidades por px), aster (célula animal), nch, pecas, nome }
  const ZC = [.9, -.75, -.45, .6, .2, -.2, .5, -.6];
  function divisao(g, o = {}) {
    const T = g.T, q = g.q, k = o.k || .1, nch = o.nch || 4, P = Object.assign({}, PECAS_BASE, o.pecas || {});
    const D = { k, off: [0, 0, 0], cx: 0, cy: 0, P, cells: [], nucs: [], tubos: [], xos: [], alerta: [] };
    const gr = D.gr = new T.Group(); (o.pai || g.raiz).add(gr);
    for (let i = 0; i < 4; i++) {
      const m = filme(g, '#F06AAE', { cor2: '#FFD6EC', dentro: '#2A1E44', base: .03, fr: .5, esc: .35 }), me = new T.Mesh(esfera(g, q.cel ? 40 : 56), m);
      me.renderOrder = 3; me.userData.peca = P.membrana; gr.add(me); g.pick.push(me); D.cells.push(me);
      const mn = filme(g, '#9A6BFF', { cor2: '#D9C9FF', dentro: '#2A1E4D', base: .08, fr: .5, esc: .9 }), mnn = new T.Mesh(esfera(g, q.cel ? 32 : 44), mn);
      mnn.renderOrder = 2; mnn.userData.peca = P.nucleo; gr.add(mnn); g.pick.push(mnn);
      const nl = new T.Mesh(lumpy(g, 'nucl', 11 + i, q.det - 1, 6, .25, .5, .9), g._mNucl || (g._mNucl = fis(g, '#5B3BB8', { p: { roughness: .55, sheen: .5, sheenColor: new T.Color('#B9A0FF') }, rim: '#B9A0FF', rimK: .3 })));
      gr.add(nl); D.nucs.push({ m: mnn, nl });
    }
    const mC = o.matCrom || null;
    for (let i = 0; i < nch * 2; i++) {
      const m = mC || fis(g, '#9A6BFF', { p: { roughness: .46, clearcoat: .55, clearcoatRoughness: .3, sheen: .55, sheenColor: new T.Color('#E6DCFF') }, rim: '#D2C2FF', rimK: .34 });
      const t = tubo(g, 46, q.cel ? 10 : 14, m, gr, P.crom); g.pick.push(t.mesh); D.tubos.push({ t, m });
      const m2 = fis(g, '#5CC8F0', { p: { roughness: .46, clearcoat: .55, clearcoatRoughness: .3, sheen: .55, sheenColor: new T.Color('#E6DCFF') }, rim: '#D2C2FF', rimK: .34 });
      const t2 = tubo(g, 34, q.cel ? 10 : 14, m2, gr, P.crom); g.pick.push(t2.mesh); D.xos.push({ t: t2, m: m2 });
    }
    // novelos da cromatina: um caminho aleatório em 3D por cromátide (fixo), que se condensa no bastão
    D.novelo = []; for (let i = 0; i < nch * 2; i++) { const R = rng(91 + (i >> 1) * 7), pts = []; let p = [0, 0, 0], d = nrm([R() - .5, R() - .5, R() - .5]);
      for (let j = 0; j < 46; j++) { d = nrm(add(d, mul([R() - .5, R() - .5, R() - .5], 1.3))); p = add(p, mul(d, .5)); const l = len(p); if (l > 1) p = mul(p, .7 / l); pts.push(p.slice()); } D.novelo.push(pts); }
    D.cen = inst(g, esfera(g, 16), fis(g, '#ffffff', { p: { roughness: .35, clearcoat: .7 }, rimK: .3 }), nch, gr, P.crom);
    const mF = fis(g, '#CFE0FF', { p: { roughness: .3, clearcoat: .6, transparent: true, opacity: .5, depthWrite: false }, rim: '#E0ECFF', rimK: .3 });
    D.mF = mF; D.fus = inst(g, cilindro(g, 5), mF, 520, gr, P.fuso); g.pick.push(D.fus.m);
    const mK = fis(g, '#DDE8FF', { p: { roughness: .3, clearcoat: .6, transparent: true, opacity: .85, emissive: new T.Color('#5C7BD6'), emissiveIntensity: .25 }, rim: '#E0ECFF', rimK: .3 });
    D.mK = mK; D.kin = inst(g, cilindro(g, 6), mK, nch * 2, gr, P.fuso);
    D.cent = inst(g, cilindro(g, 9), fis(g, '#E8F0FF', { p: { roughness: .3, clearcoat: .8, emissive: new T.Color('#7FA3FF'), emissiveIntensity: .35 }, rim: '#FFFFFF', rimK: .4 }), 16, gr, P.polo); g.pick.push(D.cent.m);
    D.brilho = inst(g, esfera(g, 14), emis(g, '#CFE0FF', 2.6), 8, gr, P.polo);
    D.org = inst(g, lumpy(g, 'mito', 5, 2, 5, .25, .5, .9), fis(g, '#ffffff', { p: { roughness: .5, sheen: .4 }, rimK: .2 }), 40, gr, P.organela);
    D.ves = inst(g, esfera(g, 10), fis(g, '#ffffff', { p: { roughness: .35, clearcoat: .7 }, rimK: .2 }), 60, gr);
    D.w = (x, y, z) => [(x - D.cx) * k, -(y - D.cy) * k, z || 0];
    D.wm = (x, y, z) => add(D.w(x, y, z), D.off);
    D.set = (S, G, t) => desenharDiv(g, D, S, G, t || 0, o);
    return D;
  }
  const _col = {};
  const cor = (g, hex) => _col[hex] || (_col[hex] = new g.T.Color(hex));
  function unicos(L, eps) { const u = []; L.forEach((c, i) => { if (!u.some(m => Math.hypot(m.x - c.x, m.y - c.y) < eps)) u.push(Object.assign({ i }, c)); }); return u; }
  function desenharDiv(g, D, S, G, t, o) {
    const k = D.k, w2 = D.w, red = REDUZ();
    // membranas: cada célula única é uma esfera; a parte dentro das vizinhas some (superfície de união)
    const U = unicos(S.cells, .5);
    D.cells.forEach((m, j) => {
      const c = U[j]; m.visible = !!c && (o.semMembrana !== true); if (!m.visible) return;
      const p = w2(c.x, c.y), r = c.r * k; m.position.set(p[0], p[1], p[2]); m.scale.setScalar(r);
      const u = m.material.uniforms; let n = 0;
      U.forEach((d, jj) => { if (jj === j) return; const pd = D.wm(d.x, d.y); u.uO.value[n++].set(pd[0], pd[1], pd[2], d.r * k * .998); }); u.uN.value = n;
      const al = D.alerta[c.i] || 0, tm = D.tom; u.uC.value.copy(cor(g, '#F06AAE')); if (tm && tm.k > 0) u.uC.value.lerp(cor(g, tm.cor), tm.k); u.uC.value.lerp(cor(g, '#FF4D5E'), al); u.uIn.value.copy(cor(g, '#3A2350')).lerp(cor(g, '#5A1A2A'), al);
      u.uSel.value = (g.sel === 'membrana' ? .6 : 0) + al * (.4 + .3 * Math.sin(t * 4)); u.uT.value = t; u.uOp.value = o.opMem == null ? 1 : o.opMem;
    });
    D.gr.position.set(D.off[0], D.off[1], D.off[2]);
    // núcleos e nucléolos
    const NU = unicos(S.nuc, .5);
    D.nucs.forEach((N, j) => {
      const n = NU[j], on = !!n && S.env > .02; N.m.visible = on; N.nl.visible = on && S.nucl > .02;
      if (!on) return; const p = w2(n.x, n.y); N.m.position.set(p[0], p[1], 0); N.m.scale.setScalar(n.r * k);
      const u = N.m.material.uniforms; u.uOp.value = cl(S.env * 1.2, 0, 1); u.uFrag.value = S.env > .97 ? 0 : cl((1 - S.env) * 1.25, 0, .92); u.uSel.value = g.sel === 'nucleo' ? .6 : 0;
      if (N.nl.visible) { N.nl.position.set(p[0] + n.r * k * .32, p[1] - n.r * k * .28, .3); N.nl.scale.setScalar(n.r * k * .2 * S.nucl); N.nl.rotation.y = t * .1; }
    });
    // cromossomos
    const w = G.w, rw = Math.max(.34, w * k * .68), cond = S.cond, ec = E().move(cl(cond, 0, 1));
    S.ch.forEach((c, i) => {
      const L = G.L[i] * 1.18, col = G.col[i], z = ZC[i % ZC.length] * (o.zk || 1);
      const ux = Math.sin(c.a), uy = Math.cos(c.a), vx = Math.cos(c.a), vy = -Math.sin(c.a);
      const sat = cl(c.s / (2.5 * w), 0, 1), off = w * .55 + c.s, cur = -w * .9 * (1 - sat) + w * 1.8 * S.bend * sat, xo = G.xo && G.xo[i] || {};
      for (let sdx = 0; sdx < 2; sdx++) {
        const T0 = D.tubos[i * 2 + sdx], X0 = D.xos[i * 2 + sdx], sg = sdx ? 1 : -1, dd = sdx ? S.dup : 1, b = sdx ? -cur : cur;
        const ax = c.x + vx * off * sg * (sdx ? S.dup : 1), ay = c.y + vy * off * sg * (sdx ? S.dup : 1);
        const nov = D.novelo[i * 2 + sdx], Rn = L * .5, n = 40, pts = [];
        const coilC = w2(c.x + (sdx ? 2.5 * S.dup : 0), c.y + (sdx ? 2.5 * S.dup : 0), z);
        for (let j = 0; j < n; j++) {
          const tt = -1 + 2 * j / (n - 1), px = ax + ux * tt * L / 2 + vx * b * tt * tt, py = ay + uy * tt * L / 2 + vy * b * tt * tt;
          const rod = w2(px, py, z + Math.sin(tt * 2.2 + i) * .12), cv = nov[Math.min(45, j)], coil = add(coilC, mul(cv, Rn * k));
          pts.push(lerp3(coil, rod, ec));
        }
        const r0 = mix(.1, rw, ec) * (sdx ? Math.max(.001, cl(S.dup * 1.4, 0, 1)) : 1);
        T0.t.set(pts, pontas(r0, 3)); T0.m.color.copy(cor(g, col)); T0.m.emissive && T0.m.emissive.setRGB(0, 0, 0);
        T0.t.mesh.visible = dd > .01 || !sdx;
        // trecho trocado no crossing-over (fica por cima, da fração .3 até a ponta)
        const c2 = sdx ? xo.B : xo.A;
        if (c2 && S.xo > .01 && ec > .5) { const k0 = Math.round((n - 1) * .65); X0.t.set(pts.slice(k0), (ii, nn) => r0 * 1.04 * Math.sqrt(Math.max(.02, Math.min(1, (nn - 1 - ii) / 3))) * (ii === 0 ? .98 : 1)); X0.m.color.copy(cor(g, c2)); X0.t.mesh.visible = true; X0.t.mesh.scale.setScalar(1); }
        else X0.t.mesh.visible = false;
        T0.cen = w2(ax, ay, z);
      }
      if (sat < .98 && ec > .4) put(g, D.cen, w2(c.x, c.y, z), null, w * k * .62 * (1 - sat) * ec, null, null, '#E6EEFF', 1, D.P.crom);
    });
    for (let j = S.ch.length * 2; j < D.tubos.length; j++) { D.tubos[j].t.mesh.visible = false; D.xos[j].t.mesh.visible = false; }
    fim(D.cen);
    // polos (centrossomos com dois centríolos) e fibras do fuso
    const PO = unicos(S.poles, 2);
    PO.forEach((pp, j) => {
      const p = w2(pp.x, pp.y, 0), a = t * .2 + j;
      put(g, D.cent, add(p, [-.12, 0, 0]), qy(g, [Math.cos(a), Math.sin(a), 0]), .1, .5, .1, '#E8F0FF', 1, D.P.polo);
      put(g, D.cent, add(p, [.12, .05, 0]), qy(g, [0, Math.sin(a), Math.cos(a)]), .1, .5, .1, '#E8F0FF', 1, D.P.polo);
      put(g, D.brilho, p, null, .16 + .04 * (red ? 0 : Math.sin(t * 2 + j)), null, null, '#CFE0FF', 1, D.P.polo);
      if (o.aster && S.spin > .05) for (let r = 0; r < 14; r++) { const z0 = hash(r, 3) * 2 - 1, an = hash(r, 4) * TAU, s = Math.sqrt(1 - z0 * z0), d = [s * Math.cos(an), s * Math.sin(an), z0]; bastao(g, D.fus, add(p, mul(d, .3)), add(p, mul(d, .3 + 1.3 * S.spin)), .022, '#CFE0FF', .8, D.P.fuso); }
    });
    fim(D.cent); fim(D.brilho);
    D.mF.opacity = .5 * cl(S.spin, 0, 1); D.mK.opacity = .85 * cl(S.spin, 0, 1);
    if (S.spin > .02) {
      for (const [a, b] of S.pp) {
        const A = S.poles[a], B = S.poles[b]; if (Math.hypot(A.x - B.x, A.y - B.y) < 2) continue;
        const PA = w2(A.x, A.y, 0), PB = w2(B.x, B.y, 0), ax = sub(PB, PA), L = len(ax), u = nrm(ax), e1 = nrm(cross(u, [0, 0, 1])), e2 = cross(u, e1);
        for (let r = 0; r < 12; r++) {
          const an = r / 12 * TAU + .3, kk = (r % 2 ? .3 : .17) * L, dir = add(mul(e1, Math.cos(an) * kk), mul(e2, Math.sin(an) * kk));
          let prev = PA; for (let s = 1; s <= 10; s++) { const f = s / 10, pt = add(lerp3(PA, PB, f), mul(dir, 4 * f * (1 - f))); bastao(g, D.fus, prev, pt, .028, '#CFE0FF', 1, D.P.fuso); prev = pt; }
        }
      }
      S.ch.forEach((c, i) => { const at = S.att[i]; if (!at) return; [0, 1].forEach(sdx => { const T0 = D.tubos[i * 2 + sdx]; if (!T0.cen || (sdx && S.dup < .5)) return; const P0 = S.poles[at[sdx]], pp = w2(P0.x, P0.y, 0); bastao(g, D.kin, pp, T0.cen, .045, '#DDE8FF', 1, D.P.fuso); }); });
    }
    fim(D.fus); fim(D.kin);
    // organelas: um conjunto por célula do estado; quando as células se separam, cada filha leva o seu
    const oc = ['#C98A5A', '#B97A4A', '#D29A68'];
    S.cells.forEach((c, j) => {
      const p = w2(c.x, c.y), r = c.r * k;
      for (let m = 0; m < 6; m++) {
        const z0 = hash(j * 9 + m, 1) * 2 - 1, an = hash(j * 9 + m, 2) * TAU, s = Math.sqrt(1 - z0 * z0), rr = r * (.62 + .22 * hash(j * 9 + m, 3)), d = [s * Math.cos(an) * 1.0, s * Math.sin(an), z0];
        const pos = add(p, mul(d, rr));
        g._e.set(an, z0 * 2, m); g._q.setFromEuler(g._e); put(g, D.org, pos, g._q, r * .04, r * .095, r * .04, oc[m % 3], .62, D.P.organela);
      }
      for (let m = 0; m < 6; m++) { const z0 = hash(j * 13 + m, 5) * 2 - 1, an = hash(j * 13 + m, 6) * TAU + (red ? 0 : t * .05), s = Math.sqrt(1 - z0 * z0), rr = r * (.5 + .38 * hash(j * 13 + m, 7)); put(g, D.ves, add(p, mul([s * Math.cos(an), s * Math.sin(an), z0], rr)), null, r * .026, null, null, m % 2 ? '#7FB8C8' : '#A99AD8', .6); }
    });
    fim(D.org); fim(D.ves);
  }

  // ---------- registro das cenas ----------
  const ok = s => String(s).replace(/ → /g, ' para ').replace(/ · /g, ', ').replace(/→/g, 'para');
  function cena(chave, fo) {
    (window.LAB_CITO = window.LAB_CITO || []).push(K => {
      CITO3D.K = K; const old = K.SC && K.SC[chave]; if (!old || !window.MOL3D) return;
      const o = typeof fo === 'function' ? fo(K) : fo;
      let G = null;
      const pecas = o.pecas || {};
      Object.keys(pecas).forEach(id => { const p = pecas[id]; p.id = id; if (!p.cor) p.cor = '#CFE0FF'; p.centro = () => { const a = G && G.anc[id]; return a ? [a[0], a[1], a[2], (G.raioPc[id] || 3) * 1.4] : null; }; });
      const rotulos = o.rotulos || [];
      const S = { v: 0, i: 0, e: 0, f: 0, u: 0, paused: false, tm: 0 };
      function montar(M) {
        const v = MOL3D.visor, T = v.THREE, q = qualidade();
        const g = G = { T, v, M, q, mats: [], geos: [], insts: [], pick: [], anc: {}, vis: {}, raioPc: {}, t: 0, dt: 0, P: null, pecas, V, K, S };
        g._m = new T.Matrix4(); g._b = new T.Matrix4(); g._p = new T.Vector3(); g._s = new T.Vector3(); g._c = new T.Color(); g._q = new T.Quaternion(); g._v1 = new T.Vector3(); g._v2 = new T.Vector3(); g.qI = new T.Quaternion(); g._e = new T.Euler();
        g.raiz = M._nos.raiz;
        g.fundo = new T.Group(); const pf = v.pos && v.pos.ok ? v.pos.fundo : null; (pf || g.raiz).add(g.fundo);
        M.semVolume = true; M.fitFixo = o.fit || 40; M.raioFixo = o.raio || 14; M.vista = Object.assign({ th: -.3, fi: .2, zoom: 1, alvo: [0, 0, 0] }, o.vista || {});
        g.luz0 = []; v.cam.children.forEach(l => { if (l.isLight) g.luz0.push([l, l.intensity]); });
        if (g.luz0[0]) g.luz0[0][0].intensity = 1.55; if (g.luz0[1]) g.luz0[1][0].intensity = .45; if (g.luz0[2]) g.luz0[2][0].intensity = 2.4;
        g.hemi = new T.HemisphereLight('#C6D6FF', '#2A1E3D', .32); g.raiz.add(g.hemi);
        g.fog0 = v.cena.fog; v.cena.fog = o.nevoa ? new T.FogExp2('#121A30', o.nevoa) : null;
        g.rots = rotulos.map((r, i) => {
          const id = 'L' + i, pc = pecas[r.pc] || { cor: '#CFE0FF' }; M.no(id);
          const a = M.atomo('X', [0, 0, 0], { no: id, nome: pc.nome || r.t, frase: pc.frase, cor: pc.cor, r: [.001, .001] });
          M.atomos[a].pc = r.pc; M.rotulo(a, r.t, r.pr || 3); return { r, id, a };
        });
        o.montar(g, M);
        M.pegar = ray => {
          const vivo = ob => { for (let x = ob; x; x = x.parent) if (!x.visible) return false; return !(ob.isInstancedMesh && !ob.count); };
          const hs = ray.intersectObjects(g.pick.filter(vivo), false);
          for (const h of hs) { const pc = h.object.userData.info && h.instanceId != null ? h.object.userData.info[h.instanceId] : h.object.userData.peca; if (pc) return pc; }
          return null;
        };
        M.pecas = () => { const ids = []; g.rots.forEach(x => { if (G.vis[x.r.pc] && ids.indexOf(x.r.pc) < 0 && pecas[x.r.pc]) ids.push(x.r.pc); }); return ids.map(id => pecas[id]); };
        M.limpar = () => limpar(g);
      }
      function limpar(g) {
        const v = g.v;
        if (o.limpar) try { o.limpar(g); } catch (e) { console.error(e); }
        g.luz0.forEach(([l, i]) => { l.intensity = i; }); v.cena.fog = g.fog0 || null;
        if (g.fundo.parent) g.fundo.parent.remove(g.fundo);
        g.insts.forEach(W => W.m.dispose()); g.mats.forEach(m => m.dispose()); g.geos.forEach(x => x.dispose());
        G = null;
      }
      function animar(M, P) {
        const g = G; if (!g) return;
        g.dt = Math.max(0, P.t - g.t); g.t = P.t; g.P = P;
        P.i = S.i; P.e = S.e; P.f = S.f; P.u = S.u;
        const s = g.v.sel; let sid = null;
        if (s) { if (s.custom) sid = s.custom.id; else if (s.atomo != null && M.atomos[s.atomo]) sid = M.atomos[s.atomo].pc; }
        g.sel = sid; g.vis = {};
        o.animar(g, P);
        const LB = K.LB;
        g.rots.forEach(x => { const a = g.anc[x.r.pc], on = LB && a && g.vis[x.r.pc] && (!x.r.passo || x.r.passo(P)); const n = M.nos[x.id]; if (a) n.pos = [a[0], a[1], a[2]]; n.esc = on ? 1 : 1e-4; });
        if (o.camera) { const c = o.camera(g, P); if (c) M.cam = { th: c.th, fi: c.fi, d: c.d, tx: c.al[0], ty: c.al[1], tz: c.al[2] }; }
      }
      const spec = Object.assign({}, old, {
        loc: 'Modelo 3D', girar: false, montar, animar,
        plano(t, SS) { return old.draw.call(old, SS.i, SS.e, SS.f, SS.tm); }
      });
      if (o.inf) spec.inf = o.inf; if (spec.inf) spec.inf = spec.inf.map(r => r.map(ok));
      if (o.ph) spec.ph = o.ph; if (o.leg) spec.leg = o.leg; if (o.dur) spec.dur = o.dur;
      delete spec.draw; delete spec.init;
      const c3 = MOL3D.cena(spec), d3 = c3.draw, view = document.getElementById('view');
      c3.draw = function (i, e, f, tm) {
        S.i = i; S.e = e; S.f = f; S.u = i + f; S.v = i; S.tm = tm;
        const r = d3.call(this, performance.now() / 1000, S);
        const v = MOL3D.visor, on = !!(v && v.spec === c3 && v.M && G);
        view.classList.toggle('g3', on);
        if (on) { const X = K.X; X.clearRect(0, 0, K.W, K.H); if (o.sobre) { X.save(); try { o.sobre(G, S, K); } catch (err) { console.error(err); } X.restore(); } }
        return r;
      };
      const sair0 = c3.sair; c3.sair = function () { view.classList.remove('g3'); return sair0.call(this); };
      c3.sec = old.sec; c3.key = old.key; K.SC[chave] = c3;
    });
  }

  // estilos do palco 3D neste módulo (o #cv 2D passa a ficar por cima, transparente e sem receber toque)
  function estilos() {
    if (document.getElementById('ct3-css')) return;
    const st = document.createElement('style'); st.id = 'ct3-css';
    st.textContent = `#view.tela canvas.m3-cv{position:absolute;inset:0}
#view.g3 #cv{position:absolute;inset:0;z-index:1;pointer-events:none}
#view.g3 .m3-rot,#view.g3 .hud{z-index:2}#view.g3 .m3-info{z-index:3}
.m3-barra{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:8px;padding:6px;border:1px solid var(--line);border-bottom:0;background:var(--panel)}
.m3-barra button{font:inherit;font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;height:44px;min-width:44px;justify-content:center;padding:0 12px;border-radius:8px;border:1px solid var(--line-strong);background:var(--panel);color:var(--txt);cursor:pointer;flex:none;transition:background .15s,border-color .15s}
.m3-barra button:hover{background:var(--panel-2)}
.m3-barra button[aria-pressed="true"]{color:var(--amber,#FFB347);border-color:var(--amber,#FFB347);background:var(--panel-2)}
.m3-barra button.sq{padding:0;width:44px}
.m3-barra svg{width:20px;height:20px;flex:none}
@media(max-width:699px){.m3-barra .tx{display:none}.m3-barra button{padding:0;width:44px}}`;
    document.head.appendChild(st);
    const vw = document.getElementById('view'); if (vw) vw.classList.add('tela');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', estilos); else estilos();

  const CITO3D = window.CITO3D = { cena, V, fis, emis, filme, lumpy, capsula, esfera, cilindro, caixaR, inst, put, fim, qy, bastao, tubo, pontas, kf, viva, enquadrar, tela, ppu, qualidade, divisao, FR, PECAS_BASE, unicos, K: null };
})();
