/* LAB Vírus: peças 3D próprias dos vírus (Martin), sobre o kit vir3d.js. Desenho próprio, sem modelos de terceiros.
   Capsídeo de capsômeros (icosaédrico, esférico ou em cone), envelope com espículas, nucleocapsídeo de RNA em bastões,
   bacteriófago T4 (cabeça, colar, bainha que se contrai, placa basal e fibras) e fago λ, bactéria em corte com cromossomo
   em anel, anticorpo em Y e a membrana que embrulha o vírus no brotamento. Tudo em malhas instanciadas reescritas a cada
   quadro (como no kit), com escala, posição e giro passados por quem desenha. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3) return;
  const { V, K } = V3, { cl, mix, sst, add, sub, mul, nrm, len, cross, dot, hash, lerp3, TAU } = V;
  const CACHE = {};

  // ---------- geometria ----------
  function juntar(T, geos) {
    const arr = geos.map(g => (g.index ? g.toNonIndexed() : g));
    let n = 0; arr.forEach(g => { n += g.attributes.position.count; });
    const P = new Float32Array(n * 3), N = new Float32Array(n * 3); let o = 0;
    arr.forEach(g => { P.set(g.attributes.position.array, o * 3); N.set(g.attributes.normal.array, o * 3); o += g.attributes.position.count; });
    const r = new T.BufferGeometry(); r.setAttribute('position', new T.BufferAttribute(P, 3)); r.setAttribute('normal', new T.BufferAttribute(N, 3)); return r;
  }
  // capsômero: prisma de 6 lados com o topo mais estreito e abaulado
  function knobGeo(g) {
    const k = 'knob:' + (g.q.cel ? 1 : 0); if (CACHE[k]) return CACHE[k];
    const T = g.T, a = new T.CylinderGeometry(.84, 1, .7, 6, 1), b = new T.SphereGeometry(.84, 6, 3, 0, TAU, 0, Math.PI / 2);
    b.scale(1, .45, 1); b.translate(0, .35, 0); a.rotateY(Math.PI / 6); b.rotateY(Math.PI / 6);
    return (CACHE[k] = juntar(T, [a, b]));
  }
  const cascaGeo = g => CACHE.casca || (CACHE.casca = new g.T.IcosahedronGeometry(1, 0));
  // anticorpo: Y com a haste (Fc) e dois braços (Fab), em cápsulas; a ponta dos braços é o sítio que prende o antígeno
  function yGeo(g) {
    if (CACHE.y) return CACHE.y;
    const T = g.T, cap = (r, h) => { const pts = []; for (let i = 0; i <= 6; i++) { const a = -Math.PI / 2 + i / 6 * Math.PI; pts.push(new T.Vector2(Math.max(1e-4, Math.cos(a) * r), (a < 0 ? -h : h) + Math.sin(a) * r)); } return new T.LatheGeometry(pts, 12); };
    const fc = cap(.13, .2); fc.translate(0, -.3, 0);
    const f1 = cap(.12, .2); f1.translate(0, .26, 0); f1.rotateZ(.62);
    const f2 = cap(.12, .2); f2.translate(0, .26, 0); f2.rotateZ(-.62);
    const hj = new T.SphereGeometry(.13, 10, 8);
    const geo = juntar(T, [fc, f1, f2, hj]); geo.computeVertexNormals(); return (CACHE.y = geo);
  }

  // ---------- conjunto de malhas instanciadas de uma cena ----------
  function kit(g, o = {}) {
    const T = g.T, q = g.q, pl = o.planos;
    const W = {};
    W.knob = V3.inst(g, knobGeo(g), V3.fis(g, '#FFFFFF', { p: { roughness: .42, clearcoat: .55, clearcoatRoughness: .3 }, rimK: .22, planos: pl }), o.knobs || 1200);
    W.casca = V3.inst(g, cascaGeo(g), V3.fis(g, '#FFFFFF', { p: { roughness: .7, flatShading: true }, rimK: .08, planos: pl }), o.cascas || 30);
    W.rod = V3.inst(g, V3.cilindro(g, q.cel ? 8 : 12), V3.fis(g, '#FFFFFF', { p: { roughness: .45, clearcoat: .45 }, rimK: .2 }), o.rods || 900);
    W.env = V3.inst(g, V3.esfera(g, q.cel ? 28 : 40), V3.fis(g, '#FFFFFF', { p: { roughness: .5, sheen: .9, sheenColor: new T.Color('#FFD0E6'), clearcoat: .35, clearcoatRoughness: .4 }, rim: '#FFC4E0', rimK: .45, planos: pl, lados: !!pl }), o.envs || 16);
    if (o.y) W.y = V3.inst(g, yGeo(g), V3.fis(g, '#FFFFFF', { p: { roughness: .35, clearcoat: .7, clearcoatRoughness: .2 }, rim: '#E6F0FF', rimK: .35 }), o.y);
    for (const k in W) g.pick.push(W[k].m);
    return W;
  }
  function fimKit(W) { for (const k in W) V3.fim(W[k]); }

  // ---------- modelos de capsídeo (pontos e normais locais, raio 1) ----------
  // 'ico': capsômeros nas faces planas de um icosaedro (subdivisão n); face e penton de cada um
  // 'esf': capsômeros espalhados por igual numa esfera (camada de matriz de vírus envelopados)
  // 'cone': capsídeo cônico do HIV (fulereno em cone, pontas arredondadas)
  function modelo(g, tipo, n) {
    const k = 'mod:' + tipo + ':' + n; if (CACHE[k]) return CACHE[k];
    const T = g.T, pts = [], nr = [], face = [], pen = [];
    if (tipo === 'ico') {
      const b = new T.IcosahedronGeometry(1, 0), p = b.attributes.position, vis = {};
      const F = []; for (let f = 0; f < p.count / 3; f++) F.push([0, 1, 2].map(j => [p.getX(f * 3 + j), p.getY(f * 3 + j), p.getZ(f * 3 + j)]));
      const vert = []; F.forEach(f => f.forEach(v => { if (!vert.some(u => len(sub(u, v)) < 1e-4)) vert.push(v); }));
      F.forEach((f, fi) => {
        const [a, bb, c] = f, fn = nrm(cross(sub(bb, a), sub(c, a)));
        for (let i = 0; i <= n; i++) for (let j = 0; j <= n - i; j++) {
          const P = add(a, add(mul(sub(bb, a), i / n), mul(sub(c, a), j / n))), key = P.map(x => Math.round(x * 1e4)).join(',');
          if (vis[key]) continue; vis[key] = 1;
          const ep = vert.some(u => len(sub(u, P)) < 1e-4), canto = i === 0 || j === 0 || i + j === n;
          pts.push(P); nr.push(ep || canto ? nrm(P) : (dot(fn, P) < 0 ? mul(fn, -1) : fn)); face.push(fi); pen.push(ep ? 1 : 0);
        }
      });
    } else if (tipo === 'cone') {
      // cone do HIV: eixo y, de y -1 (ponta larga) a y 1 (ponta estreita)
      const anel = n; for (let i = 0; i <= anel; i++) {
        const u = i / anel, y = -1 + 2 * u, r = mix(.62, .26, u), m = Math.max(5, Math.round(r * 26));
        for (let j = 0; j < m; j++) { const a = (j + (i % 2) * .5) / m * TAU; const P = [Math.cos(a) * r, y, Math.sin(a) * r]; pts.push(P); nr.push(nrm([P[0], (.62 - .26) / 2 * r, P[2]])); face.push(0); pen.push(0); }
      }
      for (const [y0, r0, sg] of [[-1, .62, -1], [1, .26, 1]]) for (let i = 1; i <= 3; i++) {
        const k2 = i / 3, rr = r0 * Math.cos(k2 * Math.PI / 2), yy = y0 + sg * r0 * .6 * Math.sin(k2 * Math.PI / 2), m = Math.max(1, Math.round(rr * 22));
        for (let j = 0; j < m; j++) { const a = j / m * TAU; const P = [Math.cos(a) * rr, yy, Math.sin(a) * rr]; pts.push(P); nr.push(nrm([P[0], sg * r0, P[2]])); face.push(0); pen.push(i === 3 ? 1 : 0); }
      }
    } else {
      const ga = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) { const y = 1 - 2 * (i + .5) / n, r = Math.sqrt(1 - y * y), a = i * ga; const P = [Math.cos(a) * r, y, Math.sin(a) * r]; pts.push(P); nr.push(P); face.push(i % 20); pen.push(0); }
    }
    const qL = nr.map(d => { const q = new T.Quaternion(); q.setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(d[0], d[1], d[2]).normalize()); return q; });
    return (CACHE[k] = { pts, nr, face, pen, qL, n: pts.length });
  }
  // direções espalhadas por igual (girassol)
  function fibo(n, s) { const ga = Math.PI * (3 - Math.sqrt(5)), o = []; for (let i = 0; i < n; i++) { const y = 1 - 2 * (i + .5) / n, r = Math.sqrt(1 - y * y), a = i * ga + (s || 0); o.push([Math.cos(a) * r, y, Math.sin(a) * r]); } return o; }

  // ---------- transformação local para o mundo ----------
  function xf(g) {
    if (!g._xf) { const T = g.T; g._xf = { m: new T.Matrix4(), v: new T.Vector3(), p: new T.Vector3(), s: new T.Vector3(), q: new T.Quaternion(), q2: new T.Quaternion(), e: new T.Euler(), id: new T.Quaternion() }; }
    return g._xf;
  }
  function quat(g, rx, ry, rz) { const T = g.T, q = new T.Quaternion(); q.setFromEuler(new T.Euler(rx || 0, ry || 0, rz || 0)); return q; }
  function setQ(g, q, rx, ry, rz) { const X0 = xf(g); X0.e.set(rx || 0, ry || 0, rz || 0); return q.setFromEuler(X0.e); }
  // aplica (p, q, s, ey) a um ponto local
  function aplica(g, p, q, s, l, ey) { const X0 = xf(g); X0.v.set(l[0] * s, l[1] * s * (ey || 1), l[2] * s).applyQuaternion(q || X0.id); return [p[0] + X0.v.x, p[1] + X0.v.y, p[2] + X0.v.z]; }
  function giraV(g, q, d) { const X0 = xf(g); X0.v.set(d[0], d[1], d[2]).applyQuaternion(q || X0.id); return [X0.v.x, X0.v.y, X0.v.z]; }

  // ---------- capsídeo ----------
  // o: cor, k (montagem 0 a 1), sep (desmonte 0 a 1), r (tamanho do capsômero), ey (alongamento), hl(face, penton) cor,
  //    casca (cor da casca interna ou false), info, pula(i, pontoLocal) para esconder, seed
  function capsideo(g, W, M, p, q, s, o = {}) {
    const X0 = xf(g), k = o.k == null ? 1 : o.k, sep = o.sep || 0, rk = (o.r || .16) * s, cor = o.cor || K.capsideo, ey = o.ey || 1, sd = o.seed || 1;
    for (let i = 0; i < M.n; i++) {
      const l = M.pts[i]; if (o.pula && o.pula(i, l)) continue;
      const dl = hash(i, sd) * .5, f = k >= 1 ? 1 : sst(dl, dl + .5, k), ds = sep > 0 ? sst(hash(i, sd + 3) * .4, hash(i, sd + 3) * .4 + .6, sep) : 0, fora = 1 - f + ds;
      if (f <= .01 || ds >= .99) continue;
      let L = l;
      if (fora > 0) { const d = M.nr[i], rnd = [hash(i, sd + 5) - .5, hash(i, sd + 6) - .5, hash(i, sd + 7) - .5]; L = add(l, mul(add(mul(d, 1.8 + 1.4 * hash(i, sd + 8)), mul(rnd, 1.6)), fora)); }
      const P = aplica(g, p, q, s, L, ey);
      X0.q2.copy(q || X0.id).multiply(M.qL[i]);
      if (fora > 0) { X0.e.set(fora * 4 * hash(i, 11), fora * 3 * hash(i, 12), 0); X0.q.setFromEuler(X0.e); X0.q2.multiply(X0.q); }
      const c = o.hl ? o.hl(M.face[i], M.pen[i], i) : M.pen[i] ? (o.corPen || '#E3E9F5') : cor, sz = rk * (.35 + .65 * f) * (1 - ds * .6);
      V3.put(g, W.knob, P, X0.q2, sz, sz * .7, sz, c, .92 + .14 * hash(i, sd + 9), o.info);
    }
    if (o.casca !== false && k > .9 && sep < .1) { X0.q2.copy(q || X0.id); V3.put(g, W.casca, p, X0.q2, s * .93, s * .93 * ey, s * .93, o.casca || '#4A5470', 1, o.info); }
  }

  // ---------- envelope com espículas ----------
  // dirs: direções das espículas (locais); o: env (0 a 1), esp (0 a 1, comprimento), solta (0 a 1, espículas se soltam),
  // tipo(i) 'H' | 'N' | 'bola' | 'gp', cor, corEsp(i), info, infoEsp(i), pula(i, dirMundo)
  function envelope(g, W, dirs, p, q, s, o = {}) {
    const env = o.env == null ? 1 : o.env, esp = o.esp == null ? 1 : o.esp, so = o.solta || 0;
    if (env > .01) V3.put(g, W.env, p, q, s * (o.esc || 1), null, null, o.cor || K.envelope, 1, o.info);
    if (esp <= .01) return;
    for (let i = 0; i < dirs.length; i++) {
      const d = giraV(g, q, dirs[i]); if (o.pula && o.pula(i, d)) continue;
      const fs = so > 0 ? sst(hash(i, 21) * .3, hash(i, 21) * .3 + .7, so) : 0; if (fs >= .99) continue;
      const tp = o.tipo ? o.tipo(i) : 'H', Lh = s * (tp === 'gp' ? .22 : .3) * esp, info = o.infoEsp ? o.infoEsp(i) : o.info, cE = o.corEsp ? o.corEsp(i) : K.espicula;
      let b = add(p, mul(d, s * .97)), dd = d;
      if (fs > 0) { const w = [hash(i, 22) - .5, hash(i, 23) - .5, hash(i, 24) - .5]; b = add(b, mul(add(mul(d, 1.6 + hash(i, 25)), w), s * 1.6 * fs)); dd = nrm(add(d, mul(w, 2.5 * fs))); }
      espicula(g, W, b, dd, Lh, s, tp, cE, info, 1 - fs * .5);
    }
  }
  function espicula(g, W, b, d, Lh, s, tp, cor, info, k) {
    if (Lh < .004) return; k = k == null ? 1 : k;
    if (tp === 'N') { V3.bastao(g, W.rod, b, add(b, mul(d, Lh * .8)), s * .022 * k, cor, .9, info); V3.bola(g, add(b, mul(d, Lh * .9)), s * .07 * k, cor, 1.05, info); }
    else if (tp === 'bola') { V3.bastao(g, W.rod, b, add(b, mul(d, Lh * .7)), s * .028 * k, cor, .9, info); V3.bola(g, add(b, mul(d, Lh * .82)), s * .085 * k, cor, 1, info); }
    else if (tp === 'gp') {
      // trímero da gp120 sobre a haste da gp41: três lobos
      V3.bastao(g, W.rod, b, add(b, mul(d, Lh * .55)), s * .03 * k, '#C9A24A', .95, info);
      const u = nrm(cross(d, Math.abs(d[1]) < .9 ? [0, 1, 0] : [1, 0, 0])), w = cross(d, u);
      for (let j = 0; j < 3; j++) { const a = j / 3 * TAU, o2 = add(mul(u, Math.cos(a) * s * .055), mul(w, Math.sin(a) * s * .055)); V3.bola(g, add(add(b, mul(d, Lh * .85)), o2), s * .06 * k, cor, 1, info); }
    } else { V3.bastao(g, W.rod, b, add(b, mul(d, Lh)), s * .045 * k, cor, 1, info); V3.bola(g, add(b, mul(d, Lh)), s * .055 * k, cor, 1.1, info); }
  }

  // ---------- nucleocapsídeo do vírus da gripe: 8 bastões de RNA (7 em volta de 1) ----------
  function rnps(g, pai, n, mat) {
    const T = []; for (let i = 0; i < n; i++) T.push(V3.tubo(g, 46, g.q.cel ? 6 : 8, mat, pai, 'rna')); return T;
  }
  function rnpPontos(i, n, s, k, t) {
    const a = i === 0 ? 0 : (i - 1) / (n - 1) * TAU, r = i === 0 ? 0 : s * .2, L = s * (.75 + .5 * hash(i, 31)), m = Math.max(2, Math.round(46 * k)), P = [];
    for (let j = 0; j < m; j++) { const u = j / 45, y = (u - .5) * L, tw = u * 18 + i; P.push([Math.cos(a) * r + Math.cos(tw) * s * .035, y, Math.sin(a) * r + Math.sin(tw) * s * .035]); }
    return P;
  }

  // ---------- bacteriófago T4 (base na origem, cauda para +y) ----------
  // o: contr (0 a 1), pernas (0 a 1), pen (o tubo interno entra na parede), info { cab, cauda, fibra, base }, cor
  const T4 = { cab: .5, ey: 1.32, Lt: 1.05, Lc: .52, rs: .17, rc: .26, n: 14 };
  function fago(g, W, p, q, s, o = {}) {
    const c = sst(0, 1, o.contr || 0), pe = o.pernas == null ? 1 : o.pernas, inf = o.info || {}, cor = o.cor || K.capsideo;
    const Lt = mix(T4.Lt, T4.Lc, c) * s, rs = mix(T4.rs, T4.rc, c) * s, yb = .08 * s, yTop = yb + Lt, P = l => aplica(g, p, q, 1, l);
    // placa basal hexagonal e pinos
    V3.put(g, W.rod, P([0, yb * .5, 0]), q, .3 * s, yb, .3 * s, '#8E98B0', 1, inf.base);
    // bainha: anéis empilhados (contraída: mais curta e mais grossa)
    for (let i = 0; i < T4.n; i++) { const y = yb + (i + .5) * Lt / T4.n; V3.put(g, W.rod, P([0, y, 0]), q, rs, Lt / T4.n * .78, rs, i % 2 ? '#A7B1C6' : '#97A2BA', 1, inf.cauda); }
    // tubo interno: na contração atravessa a placa e entra na parede
    const pen = (o.pen == null ? c : o.pen) * .42 * s;
    V3.bastao(g, W.rod, P([0, -pen, 0]), P([0, yTop + .04 * s, 0]), .07 * s, '#D9DEEA', 1, inf.cauda);
    // colar
    V3.put(g, W.rod, P([0, yTop + .04 * s, 0]), q, .24 * s, .07 * s, .24 * s, '#C4CBDB', 1, inf.cauda);
    // cabeça alongada
    const hc = [0, yTop + .08 * s + T4.cab * T4.ey * s, 0];
    capsideo(g, W, modelo(g, 'ico', 3), P(hc), q, T4.cab * s, { ey: T4.ey, r: .17, cor, info: inf.cab, seed: 3, casca: '#5A6480' });
    // seis fibras longas (dobradas junto da cauda ou abertas até a superfície)
    for (let i = 0; i < 6; i++) {
      const a = (i + .5) / 6 * TAU, rd = [Math.cos(a), 0, Math.sin(a)];
      const at = add(mul(rd, .28 * s), [0, yb, 0]);
      const kn = lerp3(add(mul(rd, .3 * s), [0, .85 * s, 0]), add(mul(rd, .85 * s), [0, .48 * s, 0]), pe);
      const tp = lerp3(add(mul(rd, .42 * s), [0, .3 * s, 0]), add(mul(rd, 1.28 * s), [0, -.01 * s, 0]), pe);
      V3.bastao(g, W.rod, P(at), P(kn), .028 * s, '#B8C2D6', 1, inf.fibra); V3.bola(g, P(kn), .04 * s, '#D3DAE8', 1, inf.fibra);
      V3.bastao(g, W.rod, P(kn), P(tp), .024 * s, '#B8C2D6', 1, inf.fibra);
      V3.bastao(g, W.rod, P(at), P(add(mul(rd, .4 * s), [0, 0, 0])), .03 * s, '#8E98B0', 1, inf.base);
    }
    return { cabeca: P(hc), base: P([0, 0, 0]), ponta: P([0, -pen, 0]), topoCauda: P([0, yTop, 0]), fibra: P(add(mul([Math.cos(.52), 0, Math.sin(.52)], .9 * s), [0, .45 * s, 0])) };
  }
  // fago λ: cabeça icosaédrica e cauda fina e flexível, sem bainha que contrai
  function lambda(g, W, p, q, s, o = {}) {
    const inf = o.info || {}, P = l => aplica(g, p, q, 1, l), Lt = 1.25 * s;
    for (let i = 0; i < 12; i++) { const y = (i + .5) / 12 * Lt; V3.put(g, W.rod, P([0, y, 0]), q, .07 * s, Lt / 12 * .8, .07 * s, i % 2 ? '#A7B1C6' : '#97A2BA', 1, inf.cauda); }
    V3.bastao(g, W.rod, P([0, 0, 0]), P([0, -.12 * s, 0]), .03 * s, '#D3DAE8', 1, inf.cauda);
    const hc = [0, Lt + .5 * s, 0];
    capsideo(g, W, modelo(g, 'ico', 3), P(hc), q, .5 * s, { r: .17, info: inf.cab, seed: 5, casca: '#5A6480' });
    return { cabeca: P(hc), ponta: P([0, -.12 * s, 0]) };
  }

  // ---------- cadeia de DNA (cromossomo em anel feito de bastões; corta em pedaços com pic) ----------
  // P: pontos de um laço fechado; o: pic (0 a 1, picota e some), cor, faixa [i0, i1, cor] (prófago), info
  function cadeia(g, W, P, r, o = {}) {
    const n = P.length, pic = o.pic || 0;
    for (let i = 0; i < n; i++) {
      const a = P[i], b = P[(i + 1) % n]; if (!o.fechado && i === n - 1) break;
      let A = a, B = b, k = 1;
      if (pic > 0) { const gap = hash(i, 61) < .35 ? sst(0, .4, pic) : 0, sh = 1 - sst(.4, 1, pic) * (.6 + .4 * hash(i, 62)); if (gap > .5 && hash(i, 63) < .5) continue; const m = mul(add(a, b), .5), d = mul([hash(i, 64) - .5, hash(i, 65) - .5, (hash(i, 66) - .5) * .4], pic * .5); A = add(lerp3(m, a, sh), d); B = add(lerp3(m, b, sh), d); k = sh; if (sh < .05) continue; }
      const f = o.faixa && i >= o.faixa[0] && i < o.faixa[1], cor = f ? o.faixa[2] : (o.cor || K.dnaEscuro);
      V3.bastao(g, W.rod, A, B, r * (f ? 1.8 : 1) * k, cor, f ? 1.25 : 1, f && o.infoF ? o.infoF : o.info);
    }
  }
  // laço fechado irregular (no plano xy, com profundidade z), semente s
  function laco(n, rx, ry, z, s, c) {
    const P = []; c = c || [0, 0, 0];
    for (let i = 0; i < n; i++) { const a = i / n * TAU, w = 1 + .18 * Math.sin(a * 3 + s) + .12 * Math.sin(a * 7 + s * 2); P.push([c[0] + Math.cos(a) * rx * w, c[1] + Math.sin(a) * ry * w, c[2] + z * Math.sin(a * 5 + s)]); }
    return P;
  }
  // novelo de fita (para tubos de DNA ou RNA): pontos de um caminho enrolado em volta de c, de raio rr
  function novelo(n, c, rr, s, k) {
    const P = [], m = Math.max(2, Math.round(n * (k == null ? 1 : k)));
    for (let i = 0; i < m; i++) { const u = i / (n - 1), a = u * TAU * 2.2 + s, b = u * TAU * 1.3 + s * 2; P.push([c[0] + Math.cos(a) * Math.cos(b) * rr, c[1] + Math.sin(b) * rr * .8, c[2] + Math.sin(a) * Math.cos(b) * rr * .7]); }
    return P;
  }

  // ---------- membrana que embrulha o vírus no brotamento ----------
  // malha polar de raio Rout; o miolo (raio Rmax) vira a calota da esfera de raio R quando w vai de 0 a 1
  function membrana(g, mat, Rout, pai, pc) {
    const T = g.T, nr = g.q.cel ? 30 : 42, na = g.q.cel ? 48 : 72, pos = new Float32Array((nr + 1) * na * 3), idx = [];
    for (let j = 0; j < nr; j++) for (let i = 0; i < na; i++) { const a = j * na + i, b = j * na + (i + 1) % na, c = a + na, d = b + na; idx.push(a, c, b, b, c, d); }
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3).setUsage(T.DynamicDrawUsage)); geo.setIndex(idx); geo.setAttribute('normal', new T.BufferAttribute(new Float32Array(pos.length), 3));
    const mesh = new T.Mesh(geo, mat); mesh.frustumCulled = false; (pai || g.raiz).add(mesh); g.geos.push(geo); if (pc) { mesh.userData.peca = g.pecas[pc]; g.pick.push(mesh); }
    const rj = j => Rout * Math.pow(j / nr, 1.5);
    return {
      mesh,
      // mapa de um ponto do plano (raio r, ângulo a) para o espaço; devolve [ponto, normal]
      mapa(r, a, R, Rmax, w, cx) {
        cx = cx || [0, 0];
        if (w <= .001) return [[cx[0] + Math.cos(a) * r, 0, cx[1] + Math.sin(a) * r], [0, 1, 0]];
        const sMax = Math.sqrt((1 - Math.cos(Math.PI * w)) / 2), s = r / Rmax, yc = -R * Math.cos(Math.PI * w);
        if (s <= sMax) { const th = Math.acos(cl(1 - 2 * s * s, -1, 1)), d = [Math.sin(th) * Math.cos(a), Math.cos(th), Math.sin(th) * Math.sin(a)]; return [[cx[0] + d[0] * R, yc + d[1] * R, cx[1] + d[2] * R], d]; }
        const rw = sMax * Rmax, re = R * Math.sin(Math.PI * w), rr = re + (r - rw) * (Rout - re) / Math.max(1e-3, Rout - rw);
        return [[cx[0] + Math.cos(a) * rr, 0, cx[1] + Math.sin(a) * rr], [0, 1, 0]];
      },
      set(R, Rmax, w, cx) {
        let o = 0;
        for (let j = 0; j <= nr; j++) for (let i = 0; i < na; i++) { const q = this.mapa(rj(j), i / na * TAU, R, Rmax, w, cx)[0]; pos[o++] = q[0]; pos[o++] = q[1]; pos[o++] = q[2]; }
        geo.attributes.position.needsUpdate = true; geo.computeVertexNormals(); geo.boundingSphere = null;
      }
    };
  }

  Object.assign(V3, { kitV: kit, fimKit, modelo, fibo, quat, setQ, aplica, giraV, capsideo, envelope, espicula, rnps, rnpPontos, fago, lambda, T4, cadeia, laco, novelo, membranaB: membrana, juntar });
})();
