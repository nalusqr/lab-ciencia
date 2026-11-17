/* LAB Bioenergética: kit das cenas 3D (Martin). Usa o visor do mol3d.js (superamostragem, fundo desfocado com bokeh,
   brilho só nos destaques, qualidade adaptativa, câmera viva que cede ao usuário e volta após 12 s parado) e acrescenta o
   que a bioenergética pede: organelas em corte (mitocôndria e cloroplasto com envoltórios, cristas e grana), moléculas
   pequenas em bola e bastão (ATP, CO₂, O₂, H₂O, NADH, açúcares), partículas que brilham (elétrons e luz), peças tocáveis
   e uma camada 2D por cima para as fichas das moléculas e os textos. Cada cena entra com BIO3D.cena('sec/id', {...});
   a cena 2D antiga vira o plano B sem WebGL. Funções de apoio copiadas e adaptadas do cito3d.js, sem tocar naquele arquivo. */
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
  // caminho poligonal 3D, f de 0 a 1
  function trilha(P, f) {
    f = cl(f, 0, 1); let tot = 0; const L = [];
    for (let i = 1; i < P.length; i++) { const d = len(sub(P[i], P[i - 1])); L.push(d); tot += d; }
    let d = f * tot; for (let i = 0; i < L.length; i++) { if (d <= L[i] || i === L.length - 1) return lerp3(P[i], P[i + 1], L[i] ? cl(d / L[i], 0, 1) : 0); d -= L[i]; }
    return P[0].slice();
  }
  // curva de Bézier quadrática 3D
  const bez = (a, c, b, f) => lerp3(lerp3(a, c, f), lerp3(c, b, f), f);
  const surge = f => Math.min(1, Math.sin(cl(f, 0, 1) * Math.PI) * 3);   // aparece e some nas pontas
  const V = { cl, mix, seg, sst, add, sub, mul, dot, len, nrm, cross, lerp3, fr, vnoise, hash, trilha, bez, surge, TAU };
  const REDUZ = () => (window.MOL3D ? MOL3D.reduz : false);
  const E = () => (window.MOL3D ? MOL3D.E : { out: x => x, in: x => x, move: x => x });
  const CACHE = {};
  function qualidade() { const cel = Math.min(innerWidth, innerHeight) < 560 || innerWidth < 700; return cel ? { cel: 1, seg: 16, det: 3 } : { cel: 0, seg: 24, det: 4 }; }

  // ---------- materiais (clearcoat suave, borda fria leve, variação de cor por instância) ----------
  function fis(g, cor, o = {}) {
    const T = g.T, m = new T.MeshPhysicalMaterial(Object.assign({ color: cor, roughness: .42, metalness: 0, clearcoat: .5, clearcoatRoughness: .32, envMapIntensity: .45, sheen: .25, sheenColor: new T.Color('#D8E2FF'), sheenRoughness: .5 }, o.p || {}));
    const rim = new T.Color(o.rim || '#8FB6FF').multiplyScalar((o.rimK == null ? .2 : o.rimK) * .55);
    m.onBeforeCompile = sh => {
      sh.uniforms.uRim = { value: rim };
      sh.fragmentShader = 'uniform vec3 uRim;\n' + sh.fragmentShader.replace('#include <opaque_fragment>',
        'outgoingLight += uRim * pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.6);\n#include <opaque_fragment>');
    };
    m.customProgramCacheKey = () => 'bio-rim';
    if (o.lados) m.side = T.DoubleSide;
    g.mats.push(m); return m;
  }
  function emis(g, cor, k, o = {}) {
    const T = g.T, m = new T.MeshPhysicalMaterial(Object.assign({ color: cor, emissive: new T.Color(cor), emissiveIntensity: k == null ? 2.2 : k, roughness: .3, clearcoat: .8, clearcoatRoughness: .15 }, o));
    g.mats.push(m); return m;
  }
  // película translúcida (Fresnel): borda clara, centro quase transparente
  function filme(g, cor, o = {}) {
    const T = g.T;
    const u = { uC: { value: new T.Color(cor) }, uC2: { value: new T.Color(o.cor2 || '#FFFFFF') }, uIn: { value: new T.Color(o.dentro || cor) }, uOp: { value: 1 }, uBase: { value: o.base == null ? .05 : o.base }, uFr: { value: o.fr == null ? .6 : o.fr }, uEsc: { value: o.esc || 1.2 }, uT: { value: 0 } };
    const m = new T.ShaderMaterial({
      uniforms: u, transparent: true, depthWrite: false, side: T.DoubleSide,
      vertexShader: 'varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vP = position; vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vV = -mv.xyz; gl_Position = projectionMatrix*mv; }',
      fragmentShader: `uniform vec3 uC, uC2, uIn; uniform float uOp, uBase, uFr, uEsc, uT; varying vec3 vN; varying vec3 vV; varying vec3 vP;
        float hs(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
        float vn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(mix(hs(i), hs(i+vec3(1,0,0)), f.x), mix(hs(i+vec3(0,1,0)), hs(i+vec3(1,1,0)), f.x), f.y), mix(mix(hs(i+vec3(0,0,1)), hs(i+vec3(1,0,1)), f.x), mix(hs(i+vec3(0,1,1)), hs(i+vec3(1,1,1)), f.x), f.y), f.z); }
        void main(){
          float fr = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
          float n = vn(vP * uEsc + uT * 0.05) * 0.6 + vn(vP * uEsc * 2.7) * 0.4;
          vec3 col = mix(uIn, mix(uC, uC2, fr * 0.45), clamp(fr * 1.6, 0.0, 1.0)) * (0.8 + n * 0.4);
          gl_FragColor = vec4(col, (uBase + fr * uFr + n * 0.04) * uOp); }`
    });
    g.mats.push(m); return m;
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
      const rr = 1 + m + (vnoise(x * 1.9 + seed, y * 1.9, z * 1.9) - .5) * .2;
      p.setXYZ(i, x * rr, y * rr, z * rr);
    }
    geo.computeVertexNormals(); CACHE[k] = geo; return geo;
  }
  const esfera = (g, n) => { const k = 'esf:' + n; return CACHE[k] || (CACHE[k] = new g.T.SphereGeometry(1, n, Math.max(8, n * .7 | 0))); };
  const cilindro = (g, n) => { const k = 'cil:' + n; return CACHE[k] || (CACHE[k] = new g.T.CylinderGeometry(1, 1, 1, n, 1)); };
  const toro = (g, r, n) => { const k = 'tor:' + r + ':' + n; return CACHE[k] || (CACHE[k] = new g.T.TorusGeometry(1, r, Math.max(8, n >> 1), n * 2)); };
  function capsula(g, r, h, n) {
    const T = g.T, k = 'cap:' + r + ':' + h + ':' + n; if (CACHE[k]) return CACHE[k];
    const pts = [], m = Math.max(4, n >> 1);
    for (let i = 0; i <= m; i++) { const a = -Math.PI / 2 + i / m * Math.PI / 2; pts.push(new T.Vector2(Math.cos(a) * r + 1e-4, -h + Math.sin(a) * r)); }
    for (let i = 0; i <= m; i++) { const a = i / m * Math.PI / 2; pts.push(new T.Vector2(Math.cos(a) * r + 1e-4, h + Math.sin(a) * r)); }
    const geo = new T.LatheGeometry(pts, n); CACHE[k] = geo; return geo;
  }
  // caixa de cantos arredondados (meias-medidas hx, hy, hz; raio r)
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
  // perfis de corte (meia silhueta [raio, y] de baixo para cima): estádio (mitocôndria) e elipse (cloroplasto)
  function perfilEstadio(r, h, n) { const P = [], m = Math.max(6, n); for (let i = 0; i <= m; i++) { const a = -Math.PI / 2 + i / m * Math.PI / 2; P.push([Math.cos(a) * r, -h + Math.sin(a) * r]); } for (let i = 0; i <= m; i++) { const a = i / m * Math.PI / 2; P.push([Math.cos(a) * r, h + Math.sin(a) * r]); } return P; }
  function perfilElipse(rx, ry, n) { const P = []; for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + i / n * Math.PI; P.push([Math.cos(a) * rx, Math.sin(a) * ry]); } return P; }
  // casca em corte: metade de trás de uma superfície de revolução, com espessura e a face cortada no plano z = 0
  // (o eixo da revolução é y; gire o grupo para deitar a organela). Devolve { grupo, fora, dentro, face }.
  function casca(g, perfil, esp, mat, matFace, n) {
    const T = g.T, gr = new T.Group(), ymax = Math.max(...perfil.map(p => Math.abs(p[1]))), kin = 1 - esp / ymax;
    const P1 = perfil.map(p => new T.Vector2(Math.max(1e-4, p[0]), p[1])), P2 = perfil.map(p => new T.Vector2(Math.max(1e-4, p[0] - esp), p[1] * kin));
    const g1 = new T.LatheGeometry(P1, n, Math.PI / 2, Math.PI), g2 = new T.LatheGeometry(P2, n, Math.PI / 2, Math.PI);
    const sh = new T.Shape(), ho = new T.Path();
    P1.forEach((p, i) => (i ? sh.lineTo(p.x, p.y) : sh.moveTo(p.x, p.y))); for (let i = P1.length - 1; i >= 0; i--) sh.lineTo(-P1[i].x, P1[i].y);
    P2.forEach((p, i) => (i ? ho.lineTo(p.x, p.y) : ho.moveTo(p.x, p.y))); for (let i = P2.length - 1; i >= 0; i--) ho.lineTo(-P2[i].x, P2[i].y);
    sh.holes.push(ho); const g3 = new T.ShapeGeometry(sh, 2);
    const fora = new T.Mesh(g1, mat), dentro = new T.Mesh(g2, mat), face = new T.Mesh(g3, matFace || mat);
    fora.material.side = T.DoubleSide; gr.add(fora, dentro, face); g.geos.push(g1, g2, g3);
    return { grupo: gr, fora, dentro, face };
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
  function bastao(g, W, a, b, r, hex, k, info) { const d = sub(b, a), L = len(d); if (L < 1e-4) return; put(g, W, mul(add(a, b), .5), qy(g, d), r, L, r, hex, k, info); }
  // tubo dinâmico (caminhos de elétrons, fios de DNA, hifas)
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
  // malha simples tocável
  function peca(g, geo, mat, pc, pai) { const m = new g.T.Mesh(geo, mat); (pai || g.raiz).add(m); if (pc) { m.userData.peca = g.pecas[pc]; g.pick.push(m); } return m; }

  // ---------- moléculas pequenas em bola e bastão (um conjunto de instâncias por cena) ----------
  const A = { C: '#9AA3B2', O: '#FF4D4D', H: '#F2F4F8', P: '#FF9A3C', N: '#4D7DFF', S: '#F2D24B', G: '#FFE1A6', AD: '#8C7CF0', RB: '#F3D49B', NAD: '#7FB2FF' };
  // cada tipo: lista de átomos [x, y, z, raio, cor] e ligações [i, j]
  const MOL = {};
  (function () {
    const fosf = (x, y, z, out) => { const i = out.a.length; out.a.push([x, y, z, .24, A.P]); [[0, .34, 0], [.3, -.14, .16], [-.3, -.14, .16], [0, -.14, -.32]].forEach(d => { out.a.push([x + d[0], y + d[1], z + d[2], .14, A.O]); out.b.push([i, out.a.length - 1]); }); return i; };
    const nuc = n => { const o = { a: [[-1.25, 0, 0, .4, A.AD], [-.72, .16, 0, .32, A.AD], [-.2, -.08, 0, .3, A.RB]], b: [[0, 1], [1, 2]] }; let prev = 2; for (let k = 0; k < n; k++) { const i = fosf(.38 + k * .62, k % 2 ? .1 : -.06, 0, o); o.b.push([prev, i]); prev = i; } return o; };
    MOL.atp = nuc(3); MOL.adp = nuc(2); MOL.pi = (() => { const o = { a: [], b: [] }; fosf(0, 0, 0, o); return o; })();
    MOL.co2 = { a: [[0, 0, 0, .3, A.C], [.56, 0, 0, .27, A.O], [-.56, 0, 0, .27, A.O]], b: [[0, 1], [0, 2]] };
    MOL.o2 = { a: [[.27, 0, 0, .28, A.O], [-.27, 0, 0, .28, A.O]], b: [[0, 1]] };
    MOL.h2o = { a: [[0, 0, 0, .3, A.O], [.36, .26, 0, .18, A.H], [-.36, .26, 0, .18, A.H]], b: [[0, 1], [0, 2]] };
    MOL.h2s = { a: [[0, 0, 0, .34, A.S], [.42, .28, 0, .18, A.H], [-.42, .28, 0, .18, A.H]], b: [[0, 1], [0, 2]] };
    MOL.nadh = { a: [[-.34, 0, 0, .3, A.NAD], [.34, 0, 0, .3, A.NAD], [.62, .26, 0, .15, A.H]], b: [[0, 1], [1, 2]] };
    MOL.nad = { a: [[-.34, 0, 0, .3, '#5C78B8'], [.34, 0, 0, .3, '#5C78B8']], b: [[0, 1]] };
    MOL.fadh2 = { a: [[-.34, 0, 0, .3, '#9CC8FF'], [.34, 0, 0, .3, '#9CC8FF'], [.6, .26, 0, .15, A.H], [-.6, .26, 0, .15, A.H]], b: [[0, 1], [1, 2], [0, 3]] };
    const anel = (n, r, cor) => { const o = { a: [], b: [] }; for (let i = 0; i < n; i++) { const a = i / n * TAU + .3; o.a.push([Math.cos(a) * r, Math.sin(a) * r * .55, Math.sin(a) * r * .3, i === n - 1 ? .22 : .25, i === n - 1 ? A.O : cor]); o.b.push([i, (i + 1) % n]); } return o; };
    MOL.glic = anel(6, .62, A.G);
    // cadeia em zigue-zague de n carbonos (cor do carbono) com um O na ponta
    MOL.cad = (n, cor) => { const k = 'c' + n + cor; if (MOL[k]) return MOL[k]; const o = { a: [], b: [] }, x0 = -(n - 1) * .24; for (let i = 0; i < n; i++) { o.a.push([x0 + i * .48, i % 2 ? .16 : -.16, 0, .25, cor || A.C]); if (i) o.b.push([i - 1, i]); } o.a.push([x0 + (n - 1) * .48 + .4, (n - 1) % 2 ? .4 : -.4, 0, .2, A.O]); o.b.push([n - 1, n]); return (MOL[k] = o); };
  })();
  // aloca as instâncias das moléculas da cena
  function moleculas(g, max) {
    g.mS = inst(g, esfera(g, g.q.cel ? 14 : 18), fis(g, '#FFFFFF', { p: { roughness: .32, clearcoat: .7, clearcoatRoughness: .2 }, rimK: .25 }), max || 500);
    g.mB = inst(g, cilindro(g, 8), fis(g, '#FFFFFF', { p: { roughness: .45 } }), Math.round((max || 500) * .9));
    g.mE = inst(g, esfera(g, 12), emis(g, '#FFFFFF', 3.4), 160);
  }
  // põe uma molécula: tipo (nome ou objeto), centro, escala, rotação [rx, ry, rz], brilho k, peça tocável
  function mol(g, tipo, p, s, rot, k, pc) {
    if (s <= .01) return; const M = typeof tipo === 'string' ? MOL[tipo] : tipo; if (!M) return;
    g._e.set(rot ? rot[0] : 0, rot ? rot[1] : 0, rot ? rot[2] : 0); const q = g._q2.setFromEuler(g._e), W = [];
    const pf = typeof pc === 'function' ? pc : () => pc;
    M.a.forEach((a, i) => { g._p.set(a[0], a[1], a[2]).applyQuaternion(q); const w = [p[0] + g._p.x * s, p[1] + g._p.y * s, p[2] + g._p.z * s]; W.push(w); put(g, g.mS, w, null, a[3] * s, null, null, a[4], k, pf(i)); });
    for (const b of M.b) bastao(g, g.mB, W[b[0]], W[b[1]], .07 * s, '#D9DFEA', (k == null ? 1 : k) * .9, pf(b[0]));
    return W;
  }
  // partícula que brilha (elétron, fóton, energia): o brilho entra no limiar de destaque do mol3d
  function brilho(g, p, r, hex, k) { if (r > .005) put(g, g.mE, p, null, r, null, null, hex, k); }
  function hmais(g, p, s, k, pc) { if (s > .01) put(g, g.mS, p, null, .2 * s, null, null, '#F2F4F8', k, pc); }
  function fimMol(g) { fim(g.mS); fim(g.mB); fim(g.mE); }

  // ---------- fichas (camada 2D por cima) ----------
  // ficha: pastilha clara com letra escura, ancorada num ponto 3D; as de menor prioridade cedem lugar
  function ficha(g, p, s, cor, o = {}) { g.fichas.push({ p, s, cor, a: o.a == null ? 1 : o.a, pr: o.pr || 5, dx: o.dx || 0, dy: o.dy == null ? -1 : o.dy }); }
  function texto(g, p, s, o = {}) { g.textos.push({ p, s, o }); }
  function desenharFichas(g) {
    const ocup = [], Wd = W, Hd = H, topo = NAR ? 48 : 70, base = Hd - (NAR ? 64 : 58);
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
  // distância para caber uma caixa de meia largura hx e meia altura hy no palco atual
  function enquadrar(g, hx, hy, prof) { const v = g.v, tg = Math.tan(v.cam.fov * Math.PI / 360), asp = Math.max(.3, v.w / Math.max(1, v.h)); return Math.max(hy / tg, hx / (tg * asp)) + (prof || 0); }
  function tela(g, p) { const v = g.v; g._v1.set(p[0], p[1], p[2]); if (g.raizGira) g._v1.applyMatrix4(g.raiz.matrixWorld); g._v1.project(v.cam); return [(g._v1.x + 1) / 2 * v.w, (1 - g._v1.y) / 2 * v.h, g._v1.z]; }
  const deitado = g => g.v.w >= g.v.h * 1.05;   // palco largo (computador) ou em pé (celular)

  // ---------- organelas em corte e membranas ----------
  // dobra (crista ou lamela) dentro de um cilindro de raio ri, presa ao lado +x (lado = 1) ou -x (lado = -1): só a metade de trás (z <= 0)
  function dobra(g, ri, xt, esp, lado) {
    const T = g.T, k = ['dob', ri, xt, esp, lado].join(':'); if (CACHE[k]) return CACHE[k];
    const sh = new T.Shape(), vb = Math.sqrt(Math.max(.01, ri * ri - xt * xt));
    sh.moveTo(xt, 0); sh.lineTo(ri, 0); sh.absarc(0, 0, ri, 0, -Math.acos(xt / ri), true); sh.quadraticCurveTo(xt - .32, -vb * .5, xt, 0);
    const geo = new T.ExtrudeGeometry(sh, { depth: esp, bevelEnabled: true, bevelThickness: .05, bevelSize: .05, bevelSegments: 2, curveSegments: 12 });
    geo.rotateX(Math.PI / 2); geo.translate(0, esp / 2, 0); if (lado < 0) geo.scale(-1, 1, 1); geo.computeVertexNormals();
    CACHE[k] = geo; return geo;
  }
  // mitocôndria em corte (eixo longo em y; gire o grupo para deitar). o: { r, h, n (cristas), pc: { ext, int, crista, matriz } }
  function mitoCorte(g, o) {
    const T = g.T, n = g.q.cel ? 28 : 40, r = o.r || 2.2, h = o.h || 3, pc = o.pc || {};
    const mExt = fis(g, '#E8603F', { p: { roughness: .5, clearcoat: .45 }, rim: '#FFC2A8', rimK: .3, lados: 1 }), mFace = fis(g, '#F7A58A', { p: { roughness: .6, clearcoat: .2 }, lados: 1 });
    const mInt = fis(g, '#F28C66', { p: { roughness: .45, clearcoat: .5 }, rim: '#FFD2BF', rimK: .3, lados: 1 }), mMat = fis(g, '#5E2A22', { p: { roughness: .7, clearcoat: .15, sheen: .4, sheenColor: new T.Color('#C9786A') }, lados: 1 });
    const ext = casca(g, perfilEstadio(r, h, 10), .15, mExt, mFace, n), r2 = r - .42, h2 = h - .18;
    const int = casca(g, perfilEstadio(r2, h2, 10), .13, mInt, mFace, n); int.dentro.material = mMat;
    const gr = new T.Group(); gr.add(ext.grupo, int.grupo);
    [ext.fora, ext.dentro, ext.face].forEach(m => { m.userData.peca = g.pecas[pc.ext]; g.pick.push(m); });
    [int.fora, int.face].forEach(m => { m.userData.peca = g.pecas[pc.int]; g.pick.push(m); }); int.dentro.userData.peca = g.pecas[pc.matriz]; g.pick.push(int.dentro);
    const ri = r2 - .13, nc = o.n || 6, cr = [], mCr = fis(g, '#F59A76', { p: { roughness: .45, clearcoat: .55 }, rim: '#FFD9C8', rimK: .35, lados: 1 });
    for (let i = 0; i < nc; i++) {
      const y = mix(-h2 + .5, h2 - .5, nc > 1 ? i / (nc - 1) : .5), lado = i % 2 ? -1 : 1, xt = ri * (.02 - .16 * hash(i, 3));
      const m = new T.Mesh(dobra(g, ri, xt, .26, lado), mCr); m.position.y = y; gr.add(m); m.userData.peca = g.pecas[pc.crista]; g.pick.push(m);
      cr.push({ y, lado, m });
    }
    // grânulos e DNA da matriz
    const gra = inst(g, esfera(g, 10), fis(g, '#C9786A', { p: { roughness: .6 } }), 40, gr);
    for (let i = 0; i < 40; i++) { const a = hash(i, 1) * Math.PI + Math.PI, yy = mix(-h2, h2, hash(i, 2)), rr = ri * (.3 + .55 * hash(i, 4)); put(g, gra, [Math.cos(a) * rr, yy, Math.sin(a) * rr * .9], null, .06 + .04 * hash(i, 5), null, null, '#D99A88', .8); }
    fim(gra); gra.m.count = 40;
    return { grupo: gr, ri, h: h2, r, cr };
  }
  // cloroplasto em corte (eixo longo em y). o: { r, h, grana: [[x, y, z, n]], pc: { env, estroma, granum, tila } }
  function cloroCorte(g, o) {
    const T = g.T, n = g.q.cel ? 28 : 40, r = o.r || 2.3, h = o.h || 4.8, pc = o.pc || {};
    const mEnv = fis(g, '#4FC97A', { p: { roughness: .45, clearcoat: .5 }, rim: '#C8FFD9', rimK: .32, lados: 1 }), mFace = fis(g, '#9BE6B3', { p: { roughness: .6, clearcoat: .2 }, lados: 1 });
    const mEst = fis(g, '#1F5136', { p: { roughness: .7, clearcoat: .15, sheen: .4, sheenColor: new T.Color('#7FD49B') }, lados: 1 });
    const ext = casca(g, perfilElipse(r, h, 24), .11, mEnv, mFace, n), int = casca(g, perfilElipse(r - .3, h - .3, 24), .1, mEnv, mFace, n); int.dentro.material = mEst;
    const gr = new T.Group(); gr.add(ext.grupo, int.grupo);
    [ext.fora, ext.dentro, ext.face, int.fora, int.face].forEach(m => { m.userData.peca = g.pecas[pc.env]; g.pick.push(m); }); int.dentro.userData.peca = g.pecas[pc.estroma]; g.pick.push(int.dentro);
    const G = o.grana || [[0, -3, -.7, 6], [.6, -1.5, -.9, 8], [-.5, 0, -.8, 7], [.5, 1.5, -.9, 8], [-.2, 3, -.7, 6]], nd = G.reduce((s, q) => s + q[3], 0);
    const disco = inst(g, cilindro(g, g.q.cel ? 18 : 28), fis(g, '#33A85C', { p: { roughness: .38, clearcoat: .7, clearcoatRoughness: .2 }, rim: '#C8FFD9', rimK: .4 }), nd, gr);
    const lam = inst(g, cilindro(g, 10), fis(g, '#2E8F50', { p: { roughness: .5 } }), G.length * 2, gr), stacks = [];
    G.forEach((q, j) => { const [x, y, z, k] = q, rd = .62; stacks.push({ p: [x, y, z], k, top: y + k * .085 }); for (let i = 0; i < k; i++) put(g, disco, [x, y - (k - 1) * .085 + i * .17, z], null, rd, .13, rd, i % 2 ? '#3DB868' : '#33A85C', 1, g.pecas[i === k - 1 && j === 2 ? pc.tila : pc.granum]); });
    for (let j = 0; j < G.length - 1; j++) { const a = G[j], b = G[j + 1]; const p0 = [a[0], a[1] + .09, a[2]], p1 = [b[0], b[1] - .09, b[2]], d = sub(p1, p0); put(g, lam, mul(add(p0, p1), .5), qy(g, d), .32, len(d), .035, '#2E8F50', .9, g.pecas[pc.estroma]); }
    fim(disco); disco.m.count = nd; fim(lam); lam.m.count = G.length - 1; g.pick.push(disco.m);
    const amido = new T.Mesh(esfera(g, 20), fis(g, '#EDE6D2', { p: { roughness: .6 } })); amido.scale.set(.42, .6, .36); amido.position.set(-.9, -2.2, -.9); gr.add(amido);
    return { grupo: gr, r, h, stacks, amido };
  }
  // bicamada lipídica em placa (de x0 a x1, profundidade z de -zd a zd, centro y = 0), com buracos onde ficam as proteínas
  function membrana(g, o) {
    const T = g.T, x0 = o.x0, x1 = o.x1, zd = o.zd || 2.6, esp = o.esp || 1.3, sp = g.q.cel ? .46 : .38, furos = o.furos || [], gr = new T.Group();
    const nx = Math.ceil((x1 - x0) / sp), nz = Math.ceil(2 * zd / sp), max = nx * nz * 2;
    const cab = inst(g, esfera(g, g.q.cel ? 10 : 14), fis(g, o.cor || '#F0A08A', { p: { roughness: .4, clearcoat: .6 }, rimK: .3 }), max, gr, g.pecas[o.pc]);
    for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) for (let s = -1; s <= 1; s += 2) {
      const x = x0 + (i + .5 + (j % 2) * .5) * sp, z = -zd + (j + .5) * sp; if (x > x1) continue;
      if (furos.some(f => Math.hypot((x - f[0]) / f[1], z / (f[2] || f[1])) < 1)) continue;
      put(g, cab, [x + (hash(i * 31 + j, s + 2) - .5) * .08, s * (esp / 2 - .1) + (hash(i, j + s * 7) - .5) * .06, z], null, sp * .46, null, null, o.cor || '#F0A08A', .85 + .25 * hash(i * 7 + j, 11 + s));
    }
    const nn = cab.n; fim(cab); cab.m.count = nn;
    const nucleo = new T.Mesh(caixaR(g, (x1 - x0) / 2, esp / 2 - .22, zd, .12, 2), fis(g, o.cauda || '#F7D9A8', { p: { roughness: .7, clearcoat: .1, transparent: true, opacity: .85 } }));
    nucleo.position.set((x0 + x1) / 2, 0, 0); gr.add(nucleo); if (o.pc) { nucleo.userData.peca = g.pecas[o.pc]; g.pick.push(nucleo); }
    g.pick.push(cab.m); g.raiz.add(gr); return { grupo: gr, cab, esp };
  }
  // ponto do grupo para o mundo
  function mundo(g, ob, p) { g._v1.set(p[0], p[1], p[2]); ob.updateMatrixWorld(true); ob.localToWorld(g._v1); return [g._v1.x, g._v1.y, g._v1.z]; }

  // ---------- registro das cenas ----------
  function cena(chave, o) {
    const old = SC[chave]; if (!old || !window.MOL3D) return;
    let G = null; const pecas = o.pecas || {};
    Object.keys(pecas).forEach(id => { const p = pecas[id]; p.id = id; if (!p.cor) p.cor = '#CFE0FF'; p.centro = () => { const a = G && G.anc[id]; return a ? [a[0], a[1], a[2], (o.raioPc && o.raioPc[id]) || 2.5] : null; }; });
    const rotulos = o.rotulos || [];
    function montar(M) {
      const v = MOL3D.visor, T = v.THREE, q = qualidade();
      const g = G = { T, v, M, q, mats: [], geos: [], insts: [], pick: [], anc: {}, vis: {}, t: 0, dt: 0, S: null, pecas, fichas: [], textos: [] };
      g._m = new T.Matrix4(); g._p = new T.Vector3(); g._s = new T.Vector3(); g._c = new T.Color(); g._q = new T.Quaternion(); g._q2 = new T.Quaternion(); g._v1 = new T.Vector3(); g._v2 = new T.Vector3(); g.qI = new T.Quaternion(); g._e = new T.Euler();
      g.raiz = M._nos.raiz;
      M.semVolume = true; M.fitFixo = o.fit || 30; M.raioFixo = o.raio || 10; M.vista = Object.assign({ th: 0, fi: .15, zoom: 1 }, o.vista || {});
      g.luz0 = []; v.cam.children.forEach(l => { if (l.isLight) g.luz0.push([l, l.intensity]); });
      if (g.luz0[0]) g.luz0[0][0].intensity = 1.6; if (g.luz0[1]) g.luz0[1][0].intensity = .5; if (g.luz0[2]) g.luz0[2][0].intensity = 2.3;
      g.hemi = new T.HemisphereLight(o.ceu || '#C6D6FF', o.chao || '#2A1E3D', .34); g.raiz.add(g.hemi);
      g.fog0 = v.cena.fog; v.cena.fog = null;
      g.rots = rotulos.map((r, i) => {
        const id = 'L' + i, pc = pecas[r.pc] || { cor: '#CFE0FF' }; M.no(id);
        const a = M.atomo('X', [0, 0, 0], { no: id, nome: pc.nome || r.t, frase: pc.frase, cor: pc.cor, r: [.001, .001] });
        M.atomos[a].pc = r.pc; M.rotulo(a, r.t, r.pr || i + 1); return { r, id, a };
      });
      if (o.moleculas !== false) moleculas(g, o.moleculas);
      o.montar(g, M);
      M.pegar = ray => {
        const vivo = ob => { for (let x = ob; x; x = x.parent) if (!x.visible) return false; return !(ob.isInstancedMesh && !ob.count); };
        const hs = ray.intersectObjects(g.pick.filter(vivo), false);
        for (const h of hs) { const pc = (h.object.userData.info && h.instanceId != null && h.object.userData.info[h.instanceId]) || h.object.userData.peca; if (pc) return pc; }
        return null;
      };
      if (g.mS) { g.pick.push(g.mS.m); }
      M.pecas = () => { const ids = []; g.rots.forEach(x => { if (G.vis[x.r.pc] && ids.indexOf(x.r.pc) < 0 && pecas[x.r.pc]) ids.push(x.r.pc); }); return ids.map(id => pecas[id]); };
      M.limpar = () => limpar(g);
    }
    function limpar(g) {
      const v = g.v;
      if (o.limpar) try { o.limpar(g); } catch (e) { console.error(e); }
      g.luz0.forEach(([l, i]) => { l.intensity = i; }); v.cena.fog = g.fog0 || null;
      g.insts.forEach(W => W.m.dispose()); g.mats.forEach(m => m.dispose()); g.geos.forEach(x => x.dispose());
      G = null;
    }
    function animar(M, P) {
      const g = G; if (!g) return;
      g.dt = Math.max(0, P.t - g.t); if (g.dt > .5) g.dt = 0; g.t = P.t; g.P = P; g.S = P.S; g.v0 = P.S.v;
      const s = g.v.sel; let sid = null;
      if (s) { if (s.custom) sid = s.custom.id; else if (s.atomo != null && M.atomos[s.atomo]) sid = M.atomos[s.atomo].pc; }
      g.sel = sid; g.vis = {}; g.fichas = []; g.textos = [];
      o.animar(g, P);
      if (g.mS) fimMol(g);
      g.rots.forEach(x => { const a = g.anc[x.r.pc], on = a && g.vis[x.r.pc] && (!x.r.se || x.r.se(g)); const n = M.nos[x.id]; if (a) n.pos = [a[0], a[1], a[2]]; n.esc = on ? 1 : 1e-4; });
      if (o.camera) { const c = o.camera(g, P); if (c) M.cam = { th: c.th, fi: c.fi, d: c.d, tx: c.al[0], ty: c.al[1], tz: c.al[2] }; }
    }
    const spec = Object.assign({}, old, {
      loc: old.loc, girar: false, montar, animar,
      init(S) { if (old.init) old.init.call(old, S); if (o.init) o.init(S); },
      plano(t, S) { return old.draw.call(old, t, S); }
    });
    delete spec.draw;
    const c3 = MOL3D.cena(spec), d3 = c3.draw, tl = document.getElementById('cv').parentElement;
    c3.draw = function (t, S) {
      const r = d3.call(this, t, S);
      const v = MOL3D.visor, on = !!(v && v.spec === c3 && v.M && G);
      tl.classList.toggle('g3', on);
      if (on) {
        X.clearRect(0, 0, W, H); X.save();
        try { if (o.sobre) o.sobre(G, S); desenharFichas(G); } catch (err) { console.error(err); }
        X.restore();
        if (o.legenda) cap(o.legenda(G, S));
      }
      return r;
    };
    const sair0 = c3.sair; c3.sair = function () { tl.classList.remove('g3'); if (o.sair) try { o.sair(); } catch (e) { console.error(e); } return sair0.call(this); };
    c3.sec = old.sec; c3.key = old.key; SC[chave] = c3;
  }

  // estilos do palco 3D neste módulo (o #cv 2D fica por cima, transparente e sem receber toque)
  function estilos() {
    if (document.getElementById('b3-css')) return;
    const st = document.createElement('style'); st.id = 'b3-css';
    st.textContent = `.tela.g3 #cv{position:absolute;inset:0;z-index:1;pointer-events:none}
.tela.g3 .m3-rot,.tela.g3 .hud{z-index:2}.tela.g3 .m3-info{z-index:3}.tela.g3 .cad-hs-host{display:none}
.palco .m3-barra{border-top:1px solid var(--line)}`;
    document.head.appendChild(st);
    const tl = document.getElementById('cv').parentElement; if (tl && !tl.id) tl.id = 'view';
  }
  estilos();

  window.BIO3D = { cena, dobra, mitoCorte, cloroCorte, membrana, mundo, V, A, MOL, fis, emis, filme, lumpy, esfera, cilindro, toro, capsula, caixaR, perfilEstadio, perfilElipse, casca, inst, put, fim, qy, bastao, tubo, peca, mol, brilho, hmais, ficha, texto, viva, enquadrar, tela, deitado, qualidade, E, REDUZ };
})();
