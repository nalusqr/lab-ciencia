/* LAB Biologia molecular: versão 3D realista de na/dna-rna (só com ?v=3d na URL). Código da equipe (Prometeu).
   Fitas em tubos lisos (TubeGeometry sobre CatmullRomCurve3), bases como lajes arredondadas, pontes de hidrogênio luminosas, névoa leve de profundidade.
   Usa o visor do mol3d.js (girar, zoom, Frente/Lado/Cima, tocar na base); as peças do mol3d ficam invisíveis e só servem para escolher a peça com o toque. */
(() => {
  'use strict';
  if (!/[?&]v=3d\b/.test(location.search) || typeof SC === 'undefined' || !SC['na/dna-rna'] || typeof MOL3D === 'undefined') return;
  const o = SC['na/dna-rna'], PI_ = Math.PI, gr = d => d * PI_ / 180;
  const COR = { A: '#39E58C', T: '#FF4F6D', G: '#FFC53D', C: '#3FA9FF', U: '#C77DFF' };
  const NOME = { A: 'Adenina (A)', T: 'Timina (T)', G: 'Guanina (G)', C: 'Citosina (C)', U: 'Uracila (U)' };
  const FRASE = {
    A: 'Base púrica, de dois anéis. Pareia com a timina no DNA e com a uracila no RNA, por 2 ligações de hidrogênio.',
    T: 'Base pirimídica, de um anel, que só existe no DNA. Pareia com a adenina por 2 ligações de hidrogênio.',
    G: 'Base púrica, de dois anéis. Pareia com a citosina por 3 ligações de hidrogênio.',
    C: 'Base pirimídica, de um anel. Pareia com a guanina por 3 ligações de hidrogênio.',
    U: 'Base pirimídica, de um anel, que só existe no RNA. No lugar da timina, pareia com a adenina por 2 ligações de hidrogênio.'
  };
  const PAR = { A: 'T', T: 'A', G: 'C', C: 'G' }, PARR = { A: 'U', U: 'A', G: 'C', C: 'G' }, pur = b => b === 'A' || b === 'G', NH = b => (b === 'G' || b === 'C' ? 3 : 2);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const nor = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }, mix = (a, b, t) => add(mul(a, 1 - t), mul(b, t));
  const ease = t => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
  const V = { raiz: null, mats: [], bases: [], tubos: [], pontes: {}, M: null };

  function slab(THREE, l, w) { // laje arredondada: comprimento l (eixo x), largura w (eixo z), espessura em y
    const r = Math.min(w, l) * .32, s = new THREE.Shape(), x = (l - .5) / 2, y = (w - .5) / 2;
    s.moveTo(-x + r, -y); s.lineTo(x - r, -y); s.quadraticCurveTo(x, -y, x, -y + r); s.lineTo(x, y - r); s.quadraticCurveTo(x, y, x - r, y); s.lineTo(-x + r, y); s.quadraticCurveTo(-x, y, -x, y - r); s.lineTo(-x, -y + r); s.quadraticCurveTo(-x, -y, -x + r, -y);
    const g = new THREE.ExtrudeGeometry(s, { depth: .35, bevelEnabled: true, bevelThickness: .26, bevelSize: .25, bevelSegments: 5, curveSegments: 10 });
    g.translate(0, 0, -.175); g.rotateX(-PI_ / 2); return g;
  }

  function montar(M) {
    const T = window.R3F.THREE, v = MOL3D.visor; V.M = M; V.mats = []; V.bases = []; V.tubos = []; V.pontes = {};
    const mBase = c => { const m = new T.MeshPhysicalMaterial({ color: c, roughness: .34, metalness: 0, clearcoat: .7, clearcoatRoughness: .25, emissive: c, emissiveIntensity: .1, envMapIntensity: .9 }); m.userData.cor = new T.Color(c); V.mats.push(m); return m; };
    const mTubo = c => { const m = new T.MeshPhysicalMaterial({ color: c, roughness: .2, metalness: .04, clearcoat: 1, clearcoatRoughness: .1, envMapIntensity: 1.25, emissive: c, emissiveIntensity: .04 }); m.userData.cor = new T.Color(c); V.mats.push(m); return m; };
    // luz da ponte de hidrogênio e névoa de profundidade (devolvidas em sair)
    V.matP0 = { e: v.matP.emissive.clone(), i: v.matP.emissiveIntensity, c: v.matP.color.clone() }; v.matP.emissive.set('#6FD4FF'); v.matP.emissiveIntensity = 1.5; v.matP.color.set('#BFEAFF');
    v.cena.fog = new T.Fog('#0B0F1C', 80, 300);
    const gA = new T.Group(); M._nos.raiz.add(gA); V.raiz = gA;
    const grupo = (id, nome, frase, cor) => M.grupo(id, { nome, frase, cor });
    M.no('d1'); M.no('d2');
    grupo('d1', 'Fita do DNA', 'Esqueleto liso de desoxirribose e fosfato, em hélice; as bases ficam para dentro.', '#E8CD9F');
    grupo('d2', 'Fita complementar do DNA', 'Corre no sentido oposto ao da outra fita (antiparalela) e tem as bases complementares.', '#A9CBEA');
    grupo('r1', 'Fita do RNA', 'Uma fita só, de ribose e fosfato; dobra sobre si mesma e pareia trechos complementares (grampo).', '#D7B7F2');
    const geoCache = {}, geo = (l, w) => geoCache[l + 'x' + w] || (geoCache[l + 'x' + w] = slab(T, l, w));
    const tubePick = (id, no, p, i) => M.atomo('X', p, { no, grupo: id, r: [1.4, 1.6], cor: '#E8CD9F' });
    function mkBase(b, no, grp, parent) { // laje + átomo invisível para o toque
      const l = pur(b) ? 6.2 : 4.6, w = pur(b) ? 3.4 : 2.5, mesh = new T.Mesh(geo(l, w), mBase(COR[b])); parent.add(mesh);
      M.grupo(grp, { nome: NOME[b], frase: FRASE[b], cor: COR[b] });
      const at = M.atomo('X', [0, 0, 0], { no, grupo: grp, r: [1.7, 1.9], cor: COR[b] });
      const B = { b, l, w, mesh, at, grp, tips: [] }; V.bases.push(B); return B;
    }
    const posBase = (B, c, u) => { B.mesh.position.set(c[0], c[1], c[2]); B.mesh.rotation.y = Math.atan2(-u[2], u[0]); M.atomos[B.at].p = c; };
    // ---------------- DNA: 14 pares, forma B (10 por volta, 3,4 A por par), sulcos desiguais (140 graus) ----------------
    const seq = 'GCATGCGTACGATC', n = seq.length, X0 = -15, Y0 = -(n - 1) * 3.4 / 2, rB = 8, sep = gr(140);
    const hel = (a, y, x0 = X0, r = rB) => [x0 + r * Math.cos(a), y, -r * Math.sin(a)];
    [['d1', 0, '#E8CD9F'], ['d2', sep, '#A9CBEA']].forEach(([id, off, cor]) => {
      const pts = []; for (let t = -.6; t <= n - .4 + 1e-6; t += .25) pts.push(new T.Vector3(...hel(t * gr(36) + off, Y0 + t * 3.4)));
      const mesh = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 260, 1.05, 16, false), mTubo(cor)); M.nos[id].obj.add(mesh); V.tubos.push({ mesh, grp: id });
      [pts[0], pts[pts.length - 1]].forEach(p => { const s = new T.Mesh(new T.SphereGeometry(1.05, 20, 14), mesh.material); s.position.copy(p); M.nos[id].obj.add(s); });
      for (let i = 0; i < n; i += 2) tubePick(id, id, hel(i * gr(36) + off, Y0 + i * 3.4), i);
    });
    V.dna = [];
    for (let i = 0; i < n; i++) {
      const a1 = i * gr(36), a2 = a1 + sep, y = Y0 + i * 3.4, s1 = hel(a1, y), s2 = hel(a2, y), u = nor([s2[0] - s1[0], 0, s2[2] - s1[2]]), t = [-u[2], 0, u[0]];
      const b1 = seq[i], b2 = PAR[b1], B1 = mkBase(b1, 'd1', 'b1-' + i, M.nos.d1.obj), B2 = mkBase(b2, 'd2', 'b2-' + i, M.nos.d2.obj);
      posBase(B1, add(s1, mul(u, 1.1 + B1.l / 2)), u); posBase(B2, sub(s2, mul(u, 1.1 + B2.l / 2)), u);
      const e1 = add(s1, mul(u, 1.1 + B1.l)), e2 = sub(s2, mul(u, 1.1 + B2.l)), nb = NH(b1), pts = [];
      for (let k = 0; k < nb; k++) { const off = (k - (nb - 1) / 2) * 1.0, p1 = add(e1, mul(t, off)), p2 = add(e2, mul(t, off)); const a = M.atomo('X', p1, { no: 'd1', grupo: 'b1-' + i, r: [0, 0] }), b = M.atomo('X', p2, { no: 'd2', grupo: 'b2-' + i, r: [0, 0] }); pts.push(M.ponteH(a, b, { k: 1 })); }
      V.dna.push({ pts }); if (i === 4) M.rotulo(pts[0], 'par ' + b1 + '–' + b2, 2);
    }
    // rótulos de sulco (âncoras sem volume)
    const anc = (p, no) => M.atomo('X', p, { no: no || 'd1', r: [0, 0] });
    M.rotulo(anc(hel(gr(36) * 6 + sep * .5, Y0 + 6 * 3.4)), 'sulco menor', 1); M.rotulo(anc(hel(gr(36) * 4 + sep + (2 * PI_ - sep) * .5, Y0 + 4 * 3.4)), 'sulco maior', 0);
    M.rotulo(anc(hel(gr(36) * 10 - gr(8), Y0 + 10 * 3.4)), 'esqueleto de açúcar e fosfato', 4); M.rotulo(anc(hel(gr(36) * 1.5 + sep, Y0 + 1.5 * 3.4), 'd2'), 'DNA', 5);
    // ---------------- RNA: grampo GGACUUCGGUCC (haste de 4 pares, alça UUCG) ----------------
    const sr = 'GGACUUCGGUCC', XR = 19, YR = -11, rr = 8.4, sepR = gr(150), N = sr.length;
    const dobrado = [], aberto = [], dirDob = [], dirAb = [];
    for (let i = 0; i < 4; i++) { const a = i * gr(26), yy = YR + i * 3.4, pA = hel(a, yy, XR, rr), pB = hel(a + sepR, yy, XR, rr); dobrado[i] = pA; dobrado[N - 1 - i] = pB; dirDob[i] = nor([XR - pA[0], 0, -pA[2]]); dirDob[N - 1 - i] = nor([XR - pB[0], 0, -pB[2]]); }
    { const A = dobrado[3], B = dobrado[8], cen = mix(A, B, .5), ax = sub(B, A), R = Math.hypot(ax[0], ax[1], ax[2]) / 2, ux = nor(ax);
      for (let k = 1; k <= 4; k++) { const th = PI_ * k / 5, p = add(cen, add(mul(ux, -R * Math.cos(th)), [0, R * 1.15 * Math.sin(th) + 1.2, 0])); dobrado[3 + k] = p; dirDob[3 + k] = nor(sub(p, add(cen, [0, 0, 0]))); dirDob[3 + k][1] = Math.max(dirDob[3 + k][1], 0); dirDob[3 + k] = nor(dirDob[3 + k]); } }
    for (let i = 0; i < N; i++) { aberto[i] = [XR - 13 + i * 2.4, YR + 8 + 3 * Math.sin(i * 1.15), 2.2 * Math.cos(i * 1.15)]; dirAb[i] = nor([0, i % 2 ? 1 : -1, .5]); }
    V.rna = { dobrado, aberto, dirDob, dirAb, bases: [], tubo: null, pick: [], pares: [] };
    V.rna.tubo = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(dobrado.map(p => new T.Vector3(...p))), 220, 1.0, 16, false), mTubo('#D7B7F2')); M.nos.raiz.obj.add(V.rna.tubo); V.tubos.push({ mesh: V.rna.tubo, grp: 'r1' });
    V.rna.capa = [0, 1].map(() => { const s = new T.Mesh(new T.SphereGeometry(1.0, 20, 14), V.rna.tubo.material); M.nos.raiz.obj.add(s); return s; });
    for (let i = 0; i < N; i++) { const B = mkBase(sr[i], 'raiz', 'rb' + i, M.nos.raiz.obj); V.rna.bases.push(B); V.rna.pick.push(M.atomo('X', dobrado[i], { grupo: 'r1', r: [1.2, 1.4], cor: '#D7B7F2' })); }
    // pontes da haste: pontas das bases pareadas (as pontas seguem a pose em animar)
    for (let j = 0; j < 4; j++) { const a = j, b = N - 1 - j, nb = NH(sr[a]), tips = []; for (let k = 0; k < nb; k++) { const ta = M.atomo('X', [0, 0, 0], { r: [0, 0] }), tb = M.atomo('X', [0, 0, 0], { r: [0, 0] }); tips.push([ta, tb, M.ponteH(ta, tb, { k: 1 })]); } V.rna.pares.push({ a, b, tips }); }
    M.rotulo(V.rna.pick[5], 'alça do RNA', 3); M.rotulo(V.rna.pick[1], 'haste pareada', 1); M.rotulo(V.rna.bases[9].at, 'uracila', 6); M.rotulo(anc(add(dobrado[10], [0, 2, 0]), 'raiz'), 'RNA', 7);
    M.vista = { th: -.35, fi: .16, zoom: 1.02 }; V.t0 = null; V.pose = -1;
    // as peças do mol3d só servem para o toque: ficam invisíveis (o raio do toque ignora "visible")
    V.oculta = true;
  }

  function poseRNA(u) { // u: 0 aberto, 1 dobrado
    const r = V.rna, M = V.M, N = r.bases.length, pts = [], T = window.R3F.THREE;
    for (let i = 0; i < N; i++) {
      const p = mix(r.aberto[i], r.dobrado[i], u), d = nor(mix(r.dirAb[i], r.dirDob[i], u)), B = r.bases[i];
      pts.push(new T.Vector3(...p)); M.atomos[r.pick[i]].p = p;
      const c = add(p, mul(d, 1.1 + B.l / 2)); B.mesh.position.set(...c); B.mesh.rotation.y = Math.atan2(-d[2], d[0]); M.atomos[B.at].p = c; B.d = d; B.p = p;
    }
    // prolonga as pontas do tubo para fora da primeira e da última base
    const ext = (a, b) => new T.Vector3(...add([a.x, a.y, a.z], mul(nor([a.x - b.x, a.y - b.y, a.z - b.z]), 1.6)));
    const path = [ext(pts[0], pts[1]), ...pts, ext(pts[N - 1], pts[N - 2])];
    r.tubo.geometry.dispose(); r.tubo.geometry = new T.TubeGeometry(new T.CatmullRomCurve3(path), 220, 1.0, 16, false); r.capa[0].position.copy(path[0]); r.capa[1].position.copy(path[path.length - 1]);
    r.pares.forEach(pr => { const A = r.bases[pr.a], B = r.bases[pr.b], t = nor([-A.d[2], 0, A.d[0]]);
      const ea = add(A.p, mul(A.d, 1.1 + A.l)), eb = add(B.p, mul(B.d, 1.1 + B.l)); pr.tips.forEach(([ta, tb], k) => { const off = (k - (pr.tips.length - 1) / 2) * 1.0; M.atomos[ta].p = add(ea, mul(t, off)); M.atomos[tb].p = add(eb, mul(t, off)); }); });
  }

  function animar(M, P) {
    const v = MOL3D.visor; if (!v || !V.rna) return;
    if (V.oculta) [M.mA, M.mL, M.mPl, M.mH].forEach(m => { if (m) m.visible = false; });
    const now = performance.now(); if (V.t0 == null) V.t0 = now;
    // DNA: no passo 1 a segunda fita vem de lado e as pontes se desenham
    V.dna.forEach((d, i) => { const k = P.passo === 1 ? P.linear(1.3 + i * .09, 1.7 + i * .09) : 1; d.pts.forEach(p => { p.k = k; }); });
    M.nos.d2.pos = [P.passo === 1 ? 18 * (1 - P.entre(0, 1.5)) : 0, 0, 0];
    // RNA: no passo 2 a fita abre e dobra no grampo, e as pontes da haste aparecem
    const u = P.passo === 2 ? P.entre(0, 2) : 1; if (u !== V.pose) { poseRNA(u); V.pose = u; }
    V.rna.pares.forEach((pr, j) => { const k = P.passo === 2 ? P.linear(1.6 + j * .2, 2 + j * .2) : 1; pr.tips.forEach(t => { M.atomos[t[0]].esc = 1; t[2].k = k; }); });
    // destaque da peça escolhida: o resto escurece, a escolhida brilha
    const sel = v.sel, grp = sel && sel.atomo != null ? (M.atomos[sel.atomo].grupo) : sel && sel.grupo; const atomoSel = sel && sel.atomo != null && !M.atomos[sel.atomo].grupo ? sel.atomo : -1;
    const ativo = (g, at) => !sel || (grp && grp === g) || at === atomoSel;
    V.bases.forEach(B => { const on = !sel || grp === B.grp || (sel.atomo === B.at); B.mesh.material.color.copy(B.mesh.material.userData.cor).multiplyScalar(on ? 1 : .35); B.mesh.material.emissiveIntensity = sel && on ? .4 : .1; });
    V.tubos.forEach(t => { const on = !sel || grp === t.grp; t.mesh.material.color.copy(t.mesh.material.userData.cor).multiplyScalar(on ? 1 : .4); t.mesh.material.emissiveIntensity = sel && on ? .25 : .04; });
    v.cena.fog.near = v.orb.d - 10; v.cena.fog.far = v.orb.d + 75;
    M.corSuja = true;
  }
  function sair() { const v = MOL3D.visor; if (v && V.matP0) { v.matP.emissive.copy(V.matP0.e); v.matP.emissiveIntensity = V.matP0.i; v.matP.color.copy(V.matP0.c); if (v.cena) v.cena.fog = null; } }

  const spec = {};
  ['t', 's', 'c', 'loc', 'still', 'ctl', 'alt', 'd', 'kv', 'enem', 'links', 'legenda', 'plano'].forEach(k => { if (o[k] !== undefined) spec[k] = o[k]; });
  spec.montar = montar; spec.animar = animar; spec.sair = sair;
  def('na', 'dna-rna', MOL3D.cena(spec));
  const i = ORDER.na.lastIndexOf('na/dna-rna'); if (i > ORDER.na.indexOf('na/dna-rna')) ORDER.na.splice(i, 1);
})();
