/* LAB Morfofisiologia: kit das cenas 3D (Martin). Usa o visor do mol3d.js (girar, zoom, Frente/Lado/Cima, painel de detalhe,
   pós-processamento com superamostragem, fundo desfocado e brilho só nos destaques) e acrescenta o que as cenas de célula pedem:
   bicamada de fosfolipídios em instâncias (plana ou em superfície de revolução, para dobrar e fechar vesículas), proteínas
   "massudas", películas translúcidas, tubos dinâmicos, peças tocáveis com rótulos que seguem o movimento e câmera viva por passo.
   Cada cena se registra com MORFO3D.cena('sec/id', {...}) e entra no lugar da cena 2D (que vira o plano B sem WebGL). */
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

  // ---------- qualidade por tamanho de tela ----------
  function qualidade() {
    const cel = Math.min(innerWidth, innerHeight) < 560 || innerWidth < 700;
    return cel ? { cel: 1, seg: 12, det: 3, k: .62 } : { cel: 0, seg: 16, det: 4, k: 1 };
  }

  // ---------- materiais ----------
  // físico com luz de contorno (a mesma receita do DNA cinematográfico)
  function fis(g, cor, o = {}) {
    const T = g.T, m = new T.MeshPhysicalMaterial(Object.assign({ color: cor, roughness: .42, metalness: 0, clearcoat: .55, clearcoatRoughness: .3, envMapIntensity: .45, sheen: .25, sheenColor: new T.Color('#D8E2FF'), sheenRoughness: .5 }, o.p || {}));
    const rim = new T.Color(o.rim || '#8FB6FF').multiplyScalar((o.rimK == null ? .22 : o.rimK) * .55);
    m.onBeforeCompile = sh => {
      sh.uniforms.uRim = { value: rim };
      sh.fragmentShader = 'uniform vec3 uRim;\n' + sh.fragmentShader.replace('#include <opaque_fragment>',
        'outgoingLight += uRim * pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.6);\n#include <opaque_fragment>');
    };
    m.customProgramCacheKey = () => 'mf-rim';
    if (o.vc) m.vertexColors = true;
    g.mats.push(m); return m;
  }
  // brilho próprio: só o que precisa chamar a atenção (ATP, fosfato, carga em trânsito) passa do limiar do brilho
  function emis(g, cor, k, o = {}) {
    const T = g.T, m = new T.MeshPhysicalMaterial(Object.assign({ color: cor, emissive: new T.Color(cor), emissiveIntensity: k == null ? 2.2 : k, roughness: .3, clearcoat: .8, clearcoatRoughness: .15 }, o));
    g.mats.push(m); return m;
  }
  // película translúcida (membrana vista de longe, vesícula, envoltório): borda clara (Fresnel), centro quase transparente, manchas leves
  function pelicula(g, cor, o = {}) {
    const T = g.T;
    const u = { uC: { value: new T.Color(cor) }, uC2: { value: new T.Color(o.cor2 || '#FFFFFF') }, uOp: { value: o.op == null ? 1 : o.op }, uBase: { value: o.base == null ? .06 : o.base }, uFr: { value: o.fr == null ? .55 : o.fr }, uEsc: { value: o.esc || 3 }, uSel: { value: 0 } };
    const m = new T.ShaderMaterial({
      uniforms: u, transparent: true, depthWrite: !!o.depth, side: o.lado === 1 ? T.FrontSide : T.DoubleSide,
      vertexShader: 'varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vP = position; vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vV = -mv.xyz; gl_Position = projectionMatrix*mv; }',
      fragmentShader: `uniform vec3 uC, uC2; uniform float uOp, uBase, uFr, uEsc, uSel; varying vec3 vN; varying vec3 vV; varying vec3 vP;
        float hs(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
        float vn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(mix(hs(i), hs(i+vec3(1,0,0)), f.x), mix(hs(i+vec3(0,1,0)), hs(i+vec3(1,1,0)), f.x), f.y), mix(mix(hs(i+vec3(0,0,1)), hs(i+vec3(1,0,1)), f.x), mix(hs(i+vec3(0,1,1)), hs(i+vec3(1,1,1)), f.x), f.y), f.z); }
        void main(){
          float fr = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
          float n = vn(vP * uEsc) * 0.6 + vn(vP * uEsc * 2.7) * 0.4;
          vec3 col = mix(uC, uC2, fr * 0.55) * (0.75 + n * 0.5);
          float a = (uBase + fr * uFr + n * 0.04 + uSel * 0.12) * uOp;
          gl_FragColor = vec4(col * (1.0 + uSel * 0.5), a); }`
    });
    g.mats.push(m); return m;
  }

  // ---------- geometrias ----------
  // bolha de proteína: icosfera com saliências suaves e ruído
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
  // cápsula (eixo y), por torno: raio r, meio comprimento h (sem as tampas)
  function capsula(g, r, h, n) {
    const T = g.T, k = 'cap:' + r + ':' + h + ':' + n; if (CACHE[k]) return CACHE[k];
    const pts = [], m = Math.max(4, n >> 1);
    for (let i = 0; i <= m; i++) { const a = -Math.PI / 2 + i / m * Math.PI / 2; pts.push(new T.Vector2(Math.cos(a) * r + 1e-4, -h + Math.sin(a) * r)); }
    for (let i = 0; i <= m; i++) { const a = i / m * Math.PI / 2; pts.push(new T.Vector2(Math.cos(a) * r + 1e-4, h + Math.sin(a) * r)); }
    const geo = new T.LatheGeometry(pts, n); CACHE[k] = geo; return geo;
  }
  const esfera = (g, n) => { const k = 'esf:' + n; return CACHE[k] || (CACHE[k] = new g.T.SphereGeometry(1, n, Math.max(8, n * .7 | 0))); };

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
  // quaternion que leva o eixo y para dir
  function qy(g, dir, q) { g._v1.set(0, 1, 0); g._v2.set(dir[0], dir[1], dir[2]).normalize(); return (q || g._q).setFromUnitVectors(g._v1, g._v2); }
  // quaternion com o eixo x em dir e o y perto de cima
  function qx(g, dir, cima) {
    const x = nrm(dir); let c = cima || [0, 1, 0]; if (Math.abs(dot(x, c)) > .97) c = Math.abs(x[2]) < .9 ? [0, 0, 1] : [1, 0, 0];
    const z = nrm(cross(x, c)), y = cross(z, x);
    g._b.set(x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, 0, 0, 0, 1);
    return g._q.setFromRotationMatrix(g._b);
  }

  // ---------- tubo dinâmico (DNA, RNA, filamentos) ----------
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
  function cr(p0, p1, p2, p3, t) { const t2 = t * t, t3 = t2 * t; return [0, 1, 2].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)); }
  function denso(P, s) { const o = [], n = P.length; for (let i = 0; i < n - 1; i++) { const a = P[Math.max(i - 1, 0)], b = P[i], c = P[i + 1], d = P[Math.min(i + 2, n - 1)]; for (let k = 0; k < s; k++) o.push(cr(a, b, c, d, k / s)); } o.push(P[n - 1]); return o; }
  // ponta arredondada do tubo
  const pontas = (r0, k) => (i, n) => r0 * Math.sqrt(Math.max(.02, Math.min(1, i / (k || 2), (n - 1 - i) / (k || 2))));

  // ---------- perfis de revolução (membrana que dobra para dentro e fecha uma vesícula) ----------
  // Uma folha inextensível: o ponto a uma distância u do eixo, na membrana plana, vai para o ponto do perfil a uma distância u
  // medida ao longo da curva. O perfil: calota esférica de raio a (do fundo até o ângulo phi), filete de raio b e plano y = 0.
  // sinal -1: a dobra vai para baixo (citoplasma); +1: para cima.
  function perfil(a, b, phi, sinal, n) {
    const P = [];   // [r, y, nr, ny] com a normal apontando para "cima" da folha original
    const S = sinal || -1, N = n || 90;
    if (phi < 1e-3) { P.push([0, 0, 0, 1], [1e4, 0, 0, 1]); return amostrar(P); }
    const yc = a * Math.cos(phi) + b * (Math.cos(phi) - 1);
    for (let i = 0; i <= N; i++) { const al = i / N * phi; P.push([a * Math.sin(al), yc - a * Math.cos(al), -Math.sin(al), Math.cos(al)]); }
    const Px = a * Math.sin(phi), Py = yc - a * Math.cos(phi), Fx = Px + b * Math.sin(phi), Fy = Py - b * Math.cos(phi);
    for (let i = 1; i <= N; i++) { const be = phi * (1 - i / N); P.push([Fx - b * Math.sin(be), Fy + b * Math.cos(be), -Math.sin(be), Math.cos(be)]); }
    P.push([Fx + 1e4, 0, 0, 1]);
    if (S > 0) P.forEach(p => { p[1] = -p[1]; p[2] = -p[2]; });
    // a normal da calota aponta para dentro da esfera quando S < 0 (lado de fora da célula fica "em cima"): mantém a convenção
    return amostrar(P);
  }
  function amostrar(P) {
    const s = [0]; for (let i = 1; i < P.length; i++) s.push(s[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    return { P, s, em(u) { let lo = 0, hi = s.length - 1; if (u >= s[hi]) return P[hi]; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s[m] <= u) lo = m; else hi = m; } const t = (u - s[lo]) / Math.max(1e-6, s[hi] - s[lo]), A = P[lo], B = P[hi]; return [mix(A[0], B[0], t), mix(A[1], B[1], t), mix(A[2], B[2], t), mix(A[3], B[3], t)]; } };
  }
  // esfera fechada (vesícula): perfil só da calota completa
  function perfilEsfera(a) { const P = []; const N = 120; for (let i = 0; i <= N; i++) { const al = i / N * Math.PI; P.push([a * Math.sin(al), -a * Math.cos(al), -Math.sin(al), Math.cos(al)]); } return amostrar(P); }

  // ---------- bicamada de fosfolipídios ----------
  // o = { R (raio do disco), sp (espaço), cabeca, cauda (comprimento), meia (meia espessura até as cabeças), cores, dobra (cauda com dobra cis),
  //       buracos [[x, z, r]], forma: 'disco' | 'faixa' [larg, prof] }
  function bicamada(g, o) {
    const T = g.T, sp = o.sp || .82, R = o.R || 12, rc = o.cabeca || .4, Lc = o.cauda || 1.88, meia = o.meia || 2.15, q = g.q;
    const pts = [];   // posições na folha plana (hexagonal)
    const lim = o.faixa ? Math.max(o.faixa[0], o.faixa[1]) : R;
    for (let j = -Math.ceil(lim / (sp * .866)); j <= Math.ceil(lim / (sp * .866)); j++) for (let i = -Math.ceil(lim / sp) - 1; i <= Math.ceil(lim / sp) + 1; i++) {
      const x = (i + (j & 1) * .5) * sp, z = j * sp * .866;
      if (o.faixa ? (Math.abs(x) > o.faixa[0] || Math.abs(z) > o.faixa[1]) : Math.hypot(x, z) > R) continue;
      pts.push([x, z]);
    }
    const n = pts.length * 2;
    const geH = esfera(g, q.seg), geT = capsula(g, .16, Lc * .27, q.cel ? 6 : 8);
    const mH = o.matCabeca || fis(g, '#ffffff', { p: { roughness: .32, clearcoat: .8, clearcoatRoughness: .18, sheen: .4, sheenColor: new T.Color('#FFD0E6') }, rim: '#FFC2DD', rimK: .2 });
    const mT = o.matCauda || fis(g, '#ffffff', { p: { roughness: .5, clearcoat: .3, clearcoatRoughness: .4, sheen: .2 }, rimK: .12 });
    const B = { pts, n, R, sp, meia, Lc, rc, o, peca: o.peca };
    B.H = inst(g, geH, mH, n, o.pai, o.peca); B.Tl = inst(g, geT, mT, n * (o.dobra ? 4 : 2), o.pai, o.peca);
    B.mH = mH; B.mT = mT;
    B.ph = pts.map((p, i) => [hash(i, 1) * TAU, hash(i, 2) * TAU, hash(i, 3), hash(i, 4)]);
    // f: parâmetros por quadro { t, agita (0 gel a 1 fluido), deriva (deslocamento lateral), aperto (espaço x), perfil (de revolução),
    //    centro [x,y,z], esconde(x,z) -> true para pular, corH, corT, inclina }
    B.atualizar = f => desenharBicamada(g, B, f);
    return B;
  }
  const _q2 = {};
  function desenharBicamada(g, B, f) {
    const T = g.T, t = f.t || 0, ag = f.agita == null ? .5 : f.agita, ce = f.centro || [0, 0, 0], esc = f.esc || 1;
    const corH = f.corH || '#F06AAE', corT = f.corT || '#F4C9DC', kink = !!B.o.dobra, buracos = f.buracos || B.o.buracos || [];
    const qA = _q2.a || (_q2.a = new T.Quaternion()), qB = _q2.b || (_q2.b = new T.Quaternion()), eu = _q2.e || (_q2.e = new T.Euler());
    const W = B.R * 1.02, red = REDUZ();
    for (let li = 0; li < 2; li++) {
      const sg = li ? -1 : 1;   // folha de cima (+1) e de baixo (-1)
      for (let i = 0; i < B.pts.length; i++) {
        const ph = B.ph[i];
        let x = B.pts[i][0], z = B.pts[i][1];
        // deriva lateral (fluidez): cada folha anda um pouco, com volta pelo outro lado
        if (f.difunde && !red) { x += Math.sin(t * (.6 + ph[2]) + ph[0] + li * 3) * f.difunde; z += Math.cos(t * (.5 + ph[3]) + ph[1] + li) * f.difunde; }
        if (f.aperto) x *= f.aperto;
        if (buracos.length && buracos.some(b => (x - b[0]) ** 2 + (z - b[1]) ** 2 < b[2] * b[2])) continue;
        if (f.esconde && f.esconde(x, z, li)) continue;
        let P, Nn;
        if (f.perfil) {
          const u = Math.hypot(x, z), th = Math.atan2(z, x), pr = f.perfil.em(u * (f.perfilK || 1));
          // ralear onde a folha se comprime (dentro da calota): mantém a densidade parecida
          if (u > 1e-3 && pr[0] / u < 1 && hash(i, 9 + li) > Math.max(.08, pr[0] / u)) continue;
          P = [Math.cos(th) * pr[0], pr[1], Math.sin(th) * pr[0]]; Nn = [Math.cos(th) * pr[2], pr[3], Math.sin(th) * pr[2]];
        } else { P = [x, 0, z]; Nn = [0, 1, 0]; if (f.altura) { const hgt = f.altura(x, z); P[1] = hgt[0]; Nn = hgt[1]; } }
        const bob = red ? 0 : Math.sin(t * (1.6 + ph[2]) + ph[0]) * .12 * ag;
        const nn = mul(Nn, sg), cab = add(add(ce, mul(P, esc)), mul(nn, ((f.meia || B.meia) + bob) * esc));
        put(g, B.H, cab, null, B.rc * esc, B.rc * esc, B.rc * esc, f.corCabeca ? f.corCabeca(i, li) : corH, .92 + .16 * ph[3], B.peca);
        // caudas: duas, apontando para o meio da bicamada; balançam com a agitação
        const tilt = red ? .05 : (.07 + .55 * ag) * Math.sin(t * (2.2 + ph[3] * 1.5) + ph[1]), tz = red ? 0 : (.45 * ag) * Math.cos(t * (1.9 + ph[2]) + ph[0] * 1.3);
        const base = (f.inclina || 0);
        const dirIn = mul(nn, -1);
        for (let k = 0; k < 2; k++) {
          const off = (k ? 1 : -1) * .17 * esc;
          // eixo lateral qualquer perpendicular à normal
          const lat = nrm(cross(nn, Math.abs(nn[1]) < .9 ? [0, 1, 0] : [1, 0, 0])), lat2 = cross(nn, lat);
          const a0 = add(cab, add(mul(lat, off), mul(dirIn, B.rc * .55 * esc)));
          let d = nrm(add(dirIn, add(mul(lat, tilt * (k ? 1 : .8) + base), mul(lat2, tz * (k ? .7 : 1)))));
          const Lc = B.Lc * (f.Lk || 1), L1 = (kink && k ? Lc * .5 : Lc) * esc;
          const m1 = add(a0, mul(d, L1 / 2));
          put(g, B.Tl, m1, qy(g, d, qA), esc, L1 / (B.Lc * .54 + .32) , esc, corT, .9 + .2 * ph[2], B.peca);
          if (kink && k) {   // dobra cis: a segunda metade sai em ângulo de cerca de 30°
            const d2 = nrm(add(d, mul(lat, .62)));
            const a1 = add(a0, mul(d, L1)), L2 = Lc * .5 * esc;
            put(g, B.Tl, add(a1, mul(d2, L2 / 2)), qy(g, d2, qB), esc, L2 / (B.Lc * .54 + .32), esc, corT, .9 + .2 * ph[2], B.peca);
          }
        }
      }
    }
    fim(B.H); fim(B.Tl);
  }

  // ---------- moléculas pequenas (bola e bastão) em instâncias ----------
  // tipos: O2, CO2, H2O, glicose (anel), Na, K, Cl, ATP (com brilho)
  const CPK = { O: '#FF4D4D', C: '#9AA3B2', H: '#F2F4F8', N: '#4D7DFF', P: '#FF9A3C' };
  function moleculas(g, max, pai) {
    const T = g.T, mB = fis(g, '#ffffff', { p: { roughness: .28, clearcoat: .9, clearcoatRoughness: .12, sheen: 0 }, rimK: .18 });
    const W = { b: inst(g, esfera(g, g.q.seg), mB, max * 7, pai), s: inst(g, capsula(g, 1, .5, 8), mB, max * 7, pai) };
    W.desenhar = (tipo, p, q, k, info) => {
      const b = W.b, s = W.s, at = (d, r, c) => { g._v1.set(d[0], d[1], d[2]).applyQuaternion(q); put(g, b, [p[0] + g._v1.x * k, p[1] + g._v1.y * k, p[2] + g._v1.z * k], null, r * k, r * k, r * k, c, 1, info); };
      const st = (a, c2, r) => { g._v1.set(a[0], a[1], a[2]).applyQuaternion(q); g._v2.set(c2[0], c2[1], c2[2]).applyQuaternion(q); const m = [(g._v1.x + g._v2.x) / 2 * k + p[0], (g._v1.y + g._v2.y) / 2 * k + p[1], (g._v1.z + g._v2.z) / 2 * k + p[2]]; const d = [g._v2.x - g._v1.x, g._v2.y - g._v1.y, g._v2.z - g._v1.z], L = len(d); put(g, s, m, qy(g, d, g._qm || (g._qm = new T.Quaternion())), r * k, L * k / 2.4, r * k, '#C8D2E8', 1, info); };
      if (tipo === 'O2') { at([-.6, 0, 0], .62, CPK.O); at([.6, 0, 0], .62, CPK.O); }
      else if (tipo === 'CO2') { at([0, 0, 0], .66, CPK.C); at([-1.16, 0, 0], .58, CPK.O); at([1.16, 0, 0], .58, CPK.O); st([-1.1, 0, 0], [1.1, 0, 0], .12); }
      else if (tipo === 'H2O') { at([0, 0, 0], .62, CPK.O); at([-.62, .48, 0], .38, CPK.H); at([.62, .48, 0], .38, CPK.H); }
      else if (tipo === 'glicose') { for (let i = 0; i < 6; i++) { const a = i / 6 * TAU, a2 = (i + 1) / 6 * TAU; at([Math.cos(a) * 1.05, Math.sin(a * 2) * .12, Math.sin(a) * 1.05], .38, i === 5 ? CPK.O : CPK.C); st([Math.cos(a) * 1.05, 0, Math.sin(a) * 1.05], [Math.cos(a2) * 1.05, 0, Math.sin(a2) * 1.05], .12); } at([1.9, .5, .3], .34, CPK.O); at([-1.8, -.4, .2], .34, CPK.O); at([.2, .6, 1.9], .34, CPK.O); }
      else if (tipo === 'Na') at([0, 0, 0], .78, '#AB7CF2');
      else if (tipo === 'K') at([0, 0, 0], .92, '#7FDA9C');
      else if (tipo === 'Cl') at([0, 0, 0], .9, '#5CCB6E');
      else if (tipo === 'gota') at([0, 0, 0], .5, '#7FD1FF');
    };
    W.fim = () => { fim(W.b); fim(W.s); };
    return W;
  }

  // ---------- registro das cenas ----------
  const FILA = window.MORFO_CENAS = window.MORFO_CENAS || [];
  const PECA_PADRAO = { cor: '#CFE0FF', frase: '' };
  function cena(chave, o) {
    FILA.push(API => {
      const old = API.SC[chave]; if (!old || !window.MOL3D) return;
      let G = null;
      const pecas = o.pecas || {};
      Object.keys(pecas).forEach(id => { const p = pecas[id]; p.id = id; if (!p.cor) p.cor = PECA_PADRAO.cor; p.centro = () => { const a = G && G.anc[id]; return a ? [a[0], a[1], a[2], (G.raioPc[id] || 3) * 1.4] : null; }; });
      const rotulos = o.rotulos || [];
      function montar(M) {
        const v = MOL3D.visor, T = v.THREE, q = qualidade();
        const g = G = { T, v, M, q, mats: [], geos: [], insts: [], pick: [], anc: {}, vis: {}, raioPc: {}, extras: [], t: 0, dt: 0, P: null, pecas, V };
        g._m = new T.Matrix4(); g._b = new T.Matrix4(); g._p = new T.Vector3(); g._s = new T.Vector3(); g._c = new T.Color(); g._q = new T.Quaternion(); g._v1 = new T.Vector3(); g._v2 = new T.Vector3(); g.qI = new T.Quaternion();
        g.raiz = M._nos.raiz;
        // fundo desfocado: o que fica atrás entra na camada que o visor desfoca (profundidade de campo só no fundo)
        g.fundo = new T.Group(); const pf = v.pos && v.pos.ok ? v.pos.fundo : null; (pf || g.raiz).add(g.fundo); g.fundoNoPos = !!pf;
        M.semVolume = true; M.fitFixo = o.fit || 30; M.raioFixo = o.raio || 14; M.vista = Object.assign({ th: -.5, fi: .3, zoom: 1, alvo: [0, 0, 0] }, o.vista || {});
        // luz: um pouco mais quente na chave e recorte mais forte, como no DNA
        g.luz0 = []; v.cam.children.forEach(l => { if (l.isLight) g.luz0.push([l, l.intensity]); });
        if (g.luz0[0]) g.luz0[0][0].intensity = 1.55; if (g.luz0[1]) g.luz0[1][0].intensity = .42; if (g.luz0[2]) g.luz0[2][0].intensity = 2.5;
        g.hemi = new T.HemisphereLight('#C6D6FF', '#2A1E3D', .3); g.raiz.add(g.hemi);
        g.fog0 = v.cena.fog; v.cena.fog = o.nevoa === 0 ? null : new T.FogExp2('#121A30', o.nevoa || .012);
        // âncoras dos rótulos: um "átomo" invisível por rótulo, num nó que segue a peça
        g.rots = rotulos.map((r, i) => {
          const id = 'L' + i, pc = pecas[r.pc] || PECA_PADRAO; M.no(id);
          const a = M.atomo('X', [0, 0, 0], { no: id, nome: pc.nome || r.t, frase: pc.frase, cor: pc.cor, r: [.001, .001] });
          M.atomos[a].pc = r.pc; M.rotulo(a, r.t, r.pr || 3); return { r, id, a };
        });
        o.montar(g, M);
        g.pick.forEach(m => { if (!m.userData.peca && m.userData.pc) m.userData.peca = pecas[m.userData.pc]; });
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
        g.insts.forEach(W => W.m.dispose());
        g.mats.forEach(m => m.dispose()); g.geos.forEach(x => x.dispose());
        G = null;
      }
      function animar(M, P) {
        const g = G; if (!g) return;
        g.dt = Math.max(0, P.t - g.t); g.t = P.t; g.P = P;
        // seleção: a peça escolhida ganha um leve brilho; o resto fica como está
        const s = g.v.sel; let sid = null;
        if (s) { if (s.custom) sid = s.custom.id; else if (s.atomo != null && M.atomos[s.atomo]) sid = M.atomos[s.atomo].pc; }
        g.sel = sid;
        o.animar(g, P);
        g.rots.forEach(x => { const a = g.anc[x.r.pc], on = a && g.vis[x.r.pc] && (!x.r.passo || x.r.passo(P)); const n = M.nos[x.id]; if (a) n.pos = [a[0], a[1], a[2]]; n.esc = on ? 1 : 1e-4; });
        if (o.camera) { const c = o.camera(g, P); if (c) M.cam = { th: c.th, fi: c.fi, d: c.d, tx: c.al[0], ty: c.al[1], tz: c.al[2] }; }
        if (o.legenda && typeof window.cap === 'function') window.cap(o.legenda(P, g));
      }
      const spec = Object.assign({}, old, {
        loc: 'Modelo 3D', girar: false, ctl: o.ctl === undefined ? old.ctl : o.ctl, tip: o.tip === undefined ? old.tip : o.tip,
        alt: o.alt, montar, animar,
        plano(t, S) { if (old.init && !this._pi) { old.init(S); this._pi = 1; } return old.draw.call(old, t, S); }
      });
      delete spec.draw; delete spec.init;
      if (o.init) spec.init = o.init;
      const c3 = MOL3D.cena(spec);
      const draw0 = c3.draw;
      c3.draw = function (t, S) { if (S.v == null) S.v = 0; return draw0.call(this, t, S); };
      // ao sair, limpa a legenda
      const sair0 = c3.sair; c3.sair = function () { if (typeof window.cap === 'function') window.cap(''); return sair0.call(this); };
      API.SC[chave] = c3; c3.sec = old.sec; c3.key = old.key;
    });
  }

  // câmera por quadros-chave {t, th, fi, d, al}
  function kf(tp, K) {
    if (tp <= K[0].t) return Object.assign({}, K[0]);
    for (let i = 0; i < K.length - 1; i++) {
      const a = K[i], b = K[i + 1]; if (tp < b.t) { const e = E().move(seg(tp, a.t, b.t)); return { th: mix(a.th, b.th, e), fi: mix(a.fi, b.fi, e), d: mix(a.d, b.d, e), al: lerp3(a.al, b.al, e) }; }
    }
    return Object.assign({}, K[K.length - 1]);
  }
  // deriva lenta da câmera (viva, mas sem enjoar); parada com movimento reduzido
  function viva(c, t, k) { if (REDUZ()) return c; const a = k == null ? 1 : k; c.th += Math.sin(t * .11) * .16 * a; c.fi += Math.sin(t * .083 + 1) * .05 * a; c.d *= 1 + Math.sin(t * .07) * .03 * a; return c; }

  window.MORFO3D = { cena, V, fis, emis, pelicula, lumpy, capsula, esfera, inst, put, fim, qy, qx, tubo, denso, pontas, perfil, perfilEsfera, bicamada, moleculas, kf, viva, qualidade, CPK };
})();
