/* LAB Morfofisiologia: cenas 3D do núcleo (Martin). Carioteca e poros, cromatina (do DNA ao cromossomo), nucléolo e
   cromossomos (metafásico girável e os tipos pela posição do centrômero). Tudo é função do tempo e do passo: pausar congela,
   e com movimento reduzido cada passo abre já no estado final. */
'use strict';
(function () {
  if (!window.MORFO3D) return;
  const K = MORFO3D, { cl, mix, seg, sst, add, sub, mul, nrm, len, dot, cross, lerp3, rng, hash, vnoise, TAU } = K.V;
  const RED = () => window.MOL3D && MOL3D.reduz;
  const out = x => (window.MOL3D ? MOL3D.E.out(cl(x, 0, 1)) : x), mv = x => (window.MOL3D ? MOL3D.E.move(cl(x, 0, 1)) : x);
  const pc = (nome, cor, frase) => ({ nome, cor, frase });
  const prot = (g, cor, brilho) => K.fis(g, cor, { p: { roughness: .5, clearcoat: .35, sheen: .6, sheenColor: new g.T.Color(brilho || '#FFF0C8') }, rim: brilho || '#FFE6B0', rimK: .3 });

  // caminho com comprimento de arco: pos(s) e comprimento total
  function caminho(P) {
    const s = [0]; for (let i = 1; i < P.length; i++) s.push(s[i - 1] + len(sub(P[i], P[i - 1])));
    return { P, L: s[s.length - 1], em(u) { if (u <= 0) return P[0].slice(); if (u >= s[s.length - 1]) return P[P.length - 1].slice(); let lo = 0, hi = s.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s[m] <= u) lo = m; else hi = m; } return lerp3(P[lo], P[hi], (u - s[lo]) / Math.max(1e-6, s[hi] - s[lo])); } };
  }
  const v3 = (g, p, gr) => { g._v1.set(p[0], p[1], p[2]); gr.updateMatrix(); g._v1.applyMatrix4(gr.matrix); return [g._v1.x, g._v1.y, g._v1.z]; };

  // ---------- cromossomo metafásico: duas cromátides com bandas, constrição no centrômero, cinetócoros e telômeros ----------
  // o = { L (comprimento), p (fração do braço p), w (raio), sat (satélite no braço p), sem }
  function cromatide(g, o) {
    const T = g.T, L = o.L, w = o.w, top = o.p * L, bot = -(1 - o.p) * L, Ns = g.q.cel ? 70 : 110, Na = g.q.cel ? 20 : 28;
    const R = rng(o.sem || 3), bandas = []; let y = top;
    while (y > bot) { const h = w * (.35 + R() * .8); bandas.push([y, y - h, R() < .5 ? 1 : 0]); y -= h; }
    const banda = yy => { for (const b of bandas) if (yy <= b[0] && yy >= b[1]) return b[2]; return 0; };
    const cE = new T.Color('#3A2878'), cC = new T.Color('#C9B8FF'), cM = new T.Color('#E2D8FF'), cT = new T.Color('#FFE1A6'), cc = new T.Color();
    const pos = [], col = [], idx = [];
    const cx = yy => { const arm = yy > 0 ? Math.max(top, .001) : -bot; return w * .9 * (1 - .32 * Math.exp(-((yy / w) ** 2))) + w * .42 * Math.pow(Math.min(1, Math.abs(yy) / arm), 2); };
    for (let i = 0; i <= Ns; i++) {
      const yy = mix(top + w * .02, bot - w * .02, i / Ns), e = Math.min(top - yy, yy - bot) + w * .02, ee = cl(e / w, 0, 1);
      let r = w * Math.sqrt(ee * (2 - ee));
      if (o.p > .02) r *= 1 - .4 * Math.exp(-((yy / (w * .45)) ** 2));
      const x0 = cx(yy);
      for (let j = 0; j <= Na; j++) {
        const a = j / Na * TAU, rr = r * (1 + .1 * (vnoise(Math.cos(a) * 1.4 + o.sem, yy * 1.3, Math.sin(a) * 1.4) - .5) * 2 + .065 * Math.sin(yy * 9 / w + a * 2) + .03 * Math.sin(yy * 23 / w - a * 3));
        pos.push(x0 + Math.cos(a) * rr, yy, Math.sin(a) * rr * .92);
        const b = banda(yy); cc.copy(b ? cE : cC);
        if (o.p > .02) cc.lerp(cM, Math.exp(-((yy / (w * .5)) ** 2)) * .8);
        cc.lerp(cT, cl(1 - e / (w * .7), 0, 1) * .85);
        col.push(cc.r, cc.g, cc.b);
      }
    }
    for (let i = 0; i < Ns; i++) for (let j = 0; j < Na; j++) { const a = i * (Na + 1) + j, b = a + Na + 1; idx.push(a, a + 1, b, b, a + 1, b + 1); }
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new T.Float32BufferAttribute(col, 3)); geo.setIndex(idx); geo.computeVertexNormals(); g.geos.push(geo);
    return { geo, top, bot, cx };
  }
  function cromossomo(g, o, pai, peca) {
    const T = g.T, gr = new T.Group(); (pai || g.raiz).add(gr);
    const C = cromatide(g, o), mat = o.mat || (g._mCr || (g._mCr = K.fis(g, '#ffffff', { vc: 1, p: { roughness: .55, clearcoat: .35, clearcoatRoughness: .4, sheen: .55, sheenColor: new T.Color('#D8C8FF') }, rim: '#C9B4FF', rimK: .32 })));
    const ms = [];
    for (const sd of [1, -1]) { const m = new T.Mesh(C.geo, mat); m.scale.x = sd; m.userData.peca = peca; gr.add(m); ms.push(m); g.pick.push(m); }
    const mk = g._mKi || (g._mKi = K.fis(g, '#CFE0FF', { p: { roughness: .35, clearcoat: .6, emissive: new T.Color('#5C7BD6'), emissiveIntensity: .35 }, rim: '#E0ECFF', rimK: .4 }));
    const ki = [];
    if (o.p > .02) for (const sd of [1, -1]) { const k = new T.Mesh(g._gKi || (g._gKi = new T.CylinderGeometry(1, 1, .3, 24)), mk); const r0 = o.w * .6; k.scale.set(o.w * .42, o.w * .6, o.w * .42); k.rotation.z = Math.PI / 2; k.position.set(sd * (C.cx(0) + r0 + o.w * .05), 0, 0); k.userData.peca = o.pecaKi || peca; gr.add(k); ki.push(k); g.pick.push(k); }
    else for (const sd of [1, -1]) { const k = new T.Mesh(g._gKi || (g._gKi = new T.CylinderGeometry(1, 1, .3, 24)), mk); k.scale.set(o.w * .42, o.w * .5, o.w * .42); k.position.set(sd * C.cx(C.top), C.top + o.w * .12, 0); k.userData.peca = o.pecaKi || peca; gr.add(k); ki.push(k); g.pick.push(k); }
    if (o.sat) for (const sd of [1, -1]) {
      const s = new T.Mesh(K.esfera(g, 20), g._mSat || (g._mSat = K.fis(g, '#9A7BE8', { p: { roughness: .55, sheen: .5, sheenColor: new T.Color('#D8C8FF') }, rim: '#C9B4FF', rimK: .32 }))); s.scale.setScalar(o.w * .62); s.position.set(sd * C.cx(C.top) * 1.05, C.top + o.w * 1.9, 0); s.userData.peca = peca; gr.add(s);
      const h = new T.Mesh(K.capsula(g, o.w * .13, o.w * .45, 8), mk); h.position.set(sd * C.cx(C.top), C.top + o.w * .85, 0); gr.add(h);
    }
    return { gr, C, ms, ki, o };
  }

  // ================= CARIOTECA E POROS =================
  K.cena('nucleo/poro', {
    alt: 'Modelo 3D em corte da carioteca: duas membranas que se unem na borda de um complexo de poro com simetria de 8 partes, com filamentos para o citoplasma, cesta do lado do núcleo, malha FG no canal e a lâmina nuclear por baixo; uma importina leva uma proteína para dentro e um mRNA sai com o receptor de exportação',
    fit: 36, raio: 16, nevoa: .011,
    pecas: {
      ext: pc('Membrana externa', '#F06AAE', 'Continua com o retículo endoplasmático rugoso e, como ele, tem ribossomos aderidos.'),
      int: pc('Membrana interna', '#F06AAE', 'Voltada para o núcleo, ancora a lâmina nuclear e a cromatina.'),
      peri: pc('Espaço perinuclear', '#FF9CCB', 'O espaço entre as duas membranas, de cerca de 20 a 40 nm, contínuo com o interior do retículo.'),
      lam: pc('Lâmina nuclear', '#A5D8FF', 'Rede de laminas (filamentos intermediários) que reforça a carioteca. Na mitose ela se desmonta e a carioteca se fragmenta.'),
      npc: pc('Complexo do poro', '#FFD995', 'Cerca de 30 tipos de nucleoporinas em várias cópias, num anel com simetria de 8 partes e cerca de 120 nm de diâmetro.'),
      fil: pc('Filamentos citoplasmáticos', '#FFE1A6', 'Fios do lado do citoplasma que capturam as cargas que vão entrar.'),
      cesta: pc('Cesta nuclear', '#FFE1A6', 'Do lado do núcleo, recebe o mRNA e as subunidades de ribossomo que vão sair.'),
      fg: pc('Canal central (FG)', '#CFE0FF', 'Malha de nucleoporinas FG: moléculas pequenas passam livres; as grandes precisam de escolta.'),
      imp: pc('Proteína (NLS) + importina', '#9A6BFF', 'A importina reconhece o sinal de localização nuclear (NLS) e leva a proteína pelo canal. A energia vem da proteína Ran (GTP).'),
      mrna: pc('mRNA + receptor de exportação', '#FF6B6B', 'O mRNA pronto sai para o citoplasma preso a um receptor próprio, que atravessa a malha FG.'),
      peq: pc('Moléculas pequenas', '#E9ECEF', 'Íons e nucleotídeos atravessam por difusão, sem escolta.'),
      cito: pc('Citoplasma', '#9DA9C4', 'Do lado de cima: aqui ficam os ribossomos que traduzem o mRNA.'),
      nuc: pc('Núcleo', '#9DA9C4', 'Do lado de baixo: aqui o DNA é transcrito em RNA.')
    },
    rotulos: [{ pc: 'ext', t: 'Membrana externa', pr: 2 }, { pc: 'int', t: 'Membrana interna', pr: 2 }, { pc: 'peri', t: 'Espaço perinuclear', pr: 3 }, { pc: 'lam', t: 'Lâmina nuclear', pr: 3 }, { pc: 'fil', t: 'Filamentos citoplasmáticos', pr: 2 }, { pc: 'cesta', t: 'Cesta nuclear', pr: 2 }, { pc: 'fg', t: 'Canal central (FG)', pr: 2 }, { pc: 'imp', t: 'Proteína (NLS) + importina', pr: 1 }, { pc: 'mrna', t: 'mRNA + receptor', pr: 1 }, { pc: 'cito', t: 'Citoplasma', pr: 4 }, { pc: 'nuc', t: 'Núcleo', pr: 4 }],
    montar(g) {
      const T = g.T, q = g.q, h = 1.7, d = .55, Rp = 5.2, Rmax = q.cel ? 22 : 30, th0 = -.35, cw = .95;
      Object.assign(g, { h, d, Rp, th0, cw });
      const naCunha = (x, z) => { let a = Math.atan2(x, z) - th0; a = Math.atan2(Math.sin(a), Math.cos(a)); return Math.abs(a) < cw; };
      g.naCunha = naCunha;
      // perfil da carioteca: membrana externa, dobra na borda do poro e membrana interna (com espessura)
      const C = [], N = [];
      for (let i = 0; i <= 30; i++) { C.push([mix(Rmax, Rp + h, i / 30), h]); N.push([0, 1]); }
      for (let i = 1; i < 24; i++) { const a = Math.PI / 2 + i / 24 * Math.PI; C.push([Rp + h + h * Math.cos(a), h * Math.sin(a)]); N.push([Math.cos(a), Math.sin(a)]); }
      for (let i = 0; i <= 30; i++) { C.push([mix(Rp + h, Rmax, i / 30), -h]); N.push([0, -1]); }
      const fora = C.map((c, i) => new T.Vector2(c[0] + N[i][0] * d / 2, c[1] + N[i][1] * d / 2)), dentro = C.map((c, i) => new T.Vector2(c[0] - N[i][0] * d / 2, c[1] - N[i][1] * d / 2)).reverse();
      const perf = fora.concat(dentro, [fora[0].clone()]);
      const ph0 = th0 + cw, gL = new T.LatheGeometry(perf, q.cel ? 90 : 140, ph0, TAU - 2 * cw); g.geos.push(gL);
      const mM = K.fis(g, '#E8679F', { p: { roughness: .46, clearcoat: .5, clearcoatRoughness: .3, sheen: .7, sheenColor: new T.Color('#FFC8E2'), side: T.DoubleSide }, rim: '#FFB8D8', rimK: .3 });
      g.env = new T.Mesh(gL, mM); g.env.userData.peca = g.pecas.ext; g.raiz.add(g.env); g.pick.push(g.env);
      // faces do corte (mostram as duas membranas e o espaço entre elas)
      const sh = new T.Shape(perf.map(p => new T.Vector2(p.x, p.y))), gS = new T.ShapeGeometry(sh, 2); g.geos.push(gS);
      const mS = K.fis(g, '#B9437C', { p: { roughness: .7, side: T.DoubleSide, sheen: 0, clearcoat: 0 }, rimK: .05 });
      for (const ph of [ph0, ph0 + TAU - 2 * cw]) { const m = new T.Mesh(gS, mS); m.rotation.y = ph - Math.PI / 2; m.userData.peca = g.pecas.peri; g.raiz.add(m); g.pick.push(m); }
      // lúmen (espaço perinuclear) visto no corte: um véu claro entre as membranas
      // ribossomos na membrana externa
      const rb = K.inst(g, K.lumpy(g, 'rib', 61, 2, 8, .25, .4, .7), K.fis(g, '#C9B8F0', { p: { roughness: .6, sheen: .4 }, rimK: .15 }), 120), R = rng(9);
      for (let i = 0; i < (q.cel ? 60 : 110); i++) { const r = mix(Rp + h + 3, Rmax - 2, Math.sqrt(R())), a = R() * TAU, x = Math.sin(a) * r, z = Math.cos(a) * r; if (naCunha(x, z)) continue; K.put(g, rb, [x, h + d / 2 + .38, z], null, .42 + R() * .12, null, null, '#ffffff', .85 + .3 * R()); } K.fim(rb);
      // lâmina nuclear: rede de filamentos por baixo da membrana interna
      const la = K.inst(g, K.capsula(g, .11, .5, 6), K.fis(g, '#A5D8FF', { p: { roughness: .45, clearcoat: .4 }, rim: '#D8ECFF', rimK: .3 }), 2600);
      for (const [ang, of] of [[.5, 0], [-.62, .9]]) {
        const u = [Math.cos(ang), 0, Math.sin(ang)], v = [-Math.sin(ang), 0, Math.cos(ang)];
        for (let k = -12; k <= 12; k++) for (let s = -26; s < 26; s += 1.25) {
          const a = add(mul(v, k * 2.3 + of), mul(u, s)), b = add(a, mul(u, 1.25)), m = lerp3(a, b, .5), r = Math.hypot(m[0], m[2]);
          if (r < Rp + h + 1.4 || r > Rmax - 1.5 || naCunha(m[0], m[2])) continue;
          const yy = -h - d / 2 - .38 + (vnoise(m[0] * .4, m[2] * .4, k) - .5) * .25;
          K.put(g, la, [m[0], yy, m[2]], K.qy(g, u).clone(), 1, 1.2, 1, '#ffffff', .85 + .3 * hash(k * 97 + (s * 4 | 0), 2), g.pecas.lam);
        }
      }
      K.fim(la); g.pick.push(la.m);
      // complexo do poro: anel citoplasmático, anel interno (raios) e anel nuclear, com simetria de 8
      const mP = prot(g, '#FFD995'), mP2 = prot(g, '#E9C88A', '#FFE3B8');
      g.npc = new T.Group(); g.raiz.add(g.npc);
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * TAU + .2, x = Math.sin(a), z = Math.cos(a);
        const mk = (geoK, sem, mat, r, y, s) => { const m = new T.Mesh(K.lumpy(g, geoK, sem, q.det, 14, .22, .3, .6), mat); m.position.set(x * r, y, z * r); m.scale.set(...s); m.rotation.y = a; m.userData.peca = g.pecas.npc; m.userData.ang = a; g.npc.add(m); g.pick.push(m); return m; };
        mk('npcC' + (i % 3), 11 + i % 3, mP, 6.0, h + .95, [1.25, .85, 1.5]);
        mk('npcI' + (i % 3), 21 + i % 3, mP2, 3.95, 0, [.9, 1.95, 1.3]);
        mk('npcN' + (i % 3), 31 + i % 3, mP, 6.0, -h - .95, [1.25, .85, 1.5]);
      }
      const mF = prot(g, '#FFE1A6'); g.fil = []; g.cesta = [];
      for (let i = 0; i < 8; i++) { g.fil.push(K.tubo(g, 30, 6, mF, null, g.pecas.fil)); g.cesta.push(K.tubo(g, 30, 6, mF, null, g.pecas.cesta)); g.pick.push(g.fil[i].mesh, g.cesta[i].mesh); }
      g.anel = new T.Mesh(new T.TorusGeometry(2.5, .32, 10, 40), mF); g.anel.rotation.x = Math.PI / 2; g.anel.position.y = -h - 7.2; g.anel.userData.peca = g.pecas.cesta; g.raiz.add(g.anel); g.geos.push(g.anel.geometry); g.pick.push(g.anel);
      // malha FG no canal central
      const mG = K.fis(g, '#CFE0FF', { p: { roughness: .4, transparent: true, opacity: .62, depthWrite: false, sheen: .4 }, rim: '#E8F0FF', rimK: .35 });
      g.fg = []; const RF = rng(14);
      for (let j = 0; j < (q.cel ? 14 : 22); j++) {
        const a = RF() * TAU, y0 = (RF() * 2 - 1) * 1.5, b = a + Math.PI + (RF() - .5) * 2.2, rEnd = .4 + RF() * 1.6, base = [];
        for (let k = 0; k <= 8; k++) { const f = k / 8, r = mix(3.2, rEnd, f), an = mix(a, b, f * .5); base.push([Math.sin(an) * r, y0 + (RF() - .5) * .9 * f, Math.cos(an) * r]); }
        const tb = K.tubo(g, 40, 5, mG, null, g.pecas.fg); tb.mesh.renderOrder = 4; g.fg.push([tb, base, RF() * TAU]); g.pick.push(tb.mesh);
      }
      // cargas: importina (crescente) com a proteína NLS, mRNA com o receptor, moléculas pequenas
      g.imp = new T.Group(); g.raiz.add(g.imp);
      const cres = new T.Mesh(new T.TorusGeometry(1.05, .34, 12, 32, 4.1), prot(g, '#9A6BFF', '#D8C8FF')); cres.rotation.set(.3, 0, 1.0); g.geos.push(cres.geometry); g.imp.add(cres);
      g.carga = new T.Mesh(K.lumpy(g, 'carga', 77, q.det, 12, .25, .35, .6), prot(g, '#F2CF8C')); g.carga.scale.setScalar(.95); g.raiz.add(g.carga);
      g.nls = new T.Mesh(K.esfera(g, 14), K.emis(g, '#FFE066', 1.3)); g.nls.scale.setScalar(.22); g.carga.add(g.nls); g.nls.position.set(-.9, .2, .3);
      [cres, g.carga].forEach(m => { m.userData.peca = g.pecas.imp; g.pick.push(m); });
      g.rna = K.tubo(g, 60, 7, K.fis(g, '#FF6B6B', { p: { roughness: .35, clearcoat: .6 }, rim: '#FFC0C0', rimK: .35 }), null, g.pecas.mrna); g.pick.push(g.rna.mesh);
      g.rec = new T.Mesh(K.lumpy(g, 'recx', 81, q.det, 10, .25, .35, .6), prot(g, '#FFE1A6')); g.rec.scale.set(.85, .7, .85); g.rec.userData.peca = g.pecas.mrna; g.raiz.add(g.rec); g.pick.push(g.rec);
      g.peq = K.inst(g, K.esfera(g, 10), K.fis(g, '#E9ECEF', { p: { roughness: .3, clearcoat: .8 }, rimK: .2 }), 16, null, g.pecas.peq); g.pick.push(g.peq.m);
      const pI = [[-11, 10, 3], [-5, h + 6, 1.5], [-.6, h + 2.2, .2], [0, 0, 0], [.6, -h - 2.2, .2], [2.5, -h - 6.5, 1.2], [-3, -12, 2.5]];
      g.cI = caminho(K.denso(pI, 8));
      const pE = [[9, -13, -1], [4, -h - 7, 0], [.5, -h - 2.5, 0], [0, 0, 0], [-.5, h + 2.5, 0], [-3, h + 6, 1.5], [-9, 11, 3]];
      g.cE = caminho(K.denso(pE, 8));
      // fundo desfocado: cromatina embaixo, retículo em cima
      const mFc = K.fis(g, '#6A50A8', { p: { roughness: .7, sheen: .4 }, rimK: .1 }), RB = rng(3);
      for (let i = 0; i < 7; i++) { const m = new T.Mesh(K.lumpy(g, 'crf' + (i % 3), 40 + i % 3, 2, 12, .3, .3, .6), mFc); m.position.set((RB() * 2 - 1) * 26, -15 - RB() * 6, -10 - RB() * 14); m.scale.setScalar(3 + RB() * 3); g.fundo.add(m); }
      const mEr = K.fis(g, '#B9437C', { p: { roughness: .6 }, rimK: .1 });
      for (let i = 0; i < 4; i++) { const m = new T.Mesh(K.capsula(g, 1.2, 9, 12), mEr); m.position.set(-20 + i * 13, 15 + RB() * 4, -16 - RB() * 8); m.rotation.z = Math.PI / 2 + (RB() - .5) * .4; g.fundo.add(m); }
    },
    animar(g, P) {
      const t = P.t, red = RED(), h = g.h, th0 = g.th0;
      // filamentos e cesta
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * TAU + .2, x = Math.sin(a), z = Math.cos(a), F = [], C = [];
        const vis = !g.naCunha(x, z);
        for (let k = 0; k <= 10; k++) { const f = k / 10, w = red ? 0 : Math.sin(t * 1.1 + i * 1.7 + f * 4) * .5 * f; F.push([x * (6.2 + f * 1.2) + z * w, h + 1.6 + f * 5.2, z * (6.2 + f * 1.2) - x * w]); }
        for (let k = 0; k <= 10; k++) { const f = k / 10, r = mix(6.0, 2.5, sst(0, 1, f)) + Math.sin(f * Math.PI) * 1.2; C.push([x * r, -h - 1.6 - f * 5.6, z * r]); }
        if (vis) { g.fil[i].set(K.denso(F, 2), K.pontas(.24, 2)); g.cesta[i].set(K.denso(C, 2), .2); } else { g.fil[i].mesh.visible = false; g.cesta[i].mesh.visible = false; }
      }
      g.npc.children.forEach(m => { m.visible = !g.naCunha(Math.sin(m.userData.ang), Math.cos(m.userData.ang)); });
      // ciclo: importação na primeira metade, exportação na segunda
      const PER = 14, f = red ? .22 : (t / PER) % 1, imp = f < .5, qq = imp ? f / .5 : (f - .5) / .5;
      let carga = null;
      if (imp) {
        const s = mv(cl(qq / .82, 0, 1)) * g.cI.L * .86, p = g.cI.em(s); carga = p;
        const solta = seg(qq, .72, 1);
        g.imp.visible = true; g.imp.position.set(p[0] + .2 + solta * 3, p[1] - solta * 1.5, p[2] + .4 + solta * 1.2); g.imp.scale.setScalar(Math.max(.001, 1 - out(seg(qq, .8, 1)) * .999));
        const pc2 = qq > .72 ? g.cI.em(g.cI.L * mix(.86, 1, out(seg(qq, .72, 1)))) : p;
        g.carga.visible = true; g.carga.position.set(pc2[0] - .3, pc2[1], pc2[2] - .2); g.carga.rotation.set(t * .4, t * .3, 0);
        g.rna.mesh.visible = false; g.rec.visible = false;
        g.anc.imp = add(p, [-1.4, .9, .6]); g.vis.imp = qq < .95 ? 1 : 0; g.vis.mrna = 0;
      } else {
        g.imp.visible = false; g.carga.visible = false;
        const sh = mix(4, g.cE.L, mv(qq)), Q = [];
        for (let k = 0; k < 26; k++) { const u = sh - k * .5; let p; if (u >= 0) p = g.cE.em(u); else { const p0 = g.cE.P[0], dd = nrm(sub(g.cE.P[1], p0)); p = add(p0, mul(dd, u)); } const w = red ? 0 : Math.sin(t * 2 + k * .7) * .25 * cl(k / 6, 0, 1); Q.push([p[0] + w, p[1], p[2] + Math.cos(t * 1.7 + k * .6) * .25 * cl(k / 6, 0, 1)]); }
        g.rna.set(K.denso(Q, 2), .2); const hd = Q[0]; carga = hd;
        g.rec.visible = true; g.rec.position.set(hd[0] + .3, hd[1] + .55, hd[2]); g.rec.rotation.set(t * .5, t * .2, 0);
        g.anc.mrna = add(hd, [1.2, .8, .6]); g.vis.mrna = 1; g.vis.imp = 0;
      }
      // malha FG: balança e abre caminho para a carga
      g.fg.forEach(([tb, base, ph], j) => {
        const Q = base.map((p, k) => { let r = [p[0] + (red ? 0 : Math.sin(t * 1.3 + ph + k) * .22), p[1] + (red ? 0 : Math.cos(t * 1.1 + ph * 1.3 + k) * .22), p[2] + (red ? 0 : Math.sin(t * .9 + ph + k * 1.4) * .22)];
          if (carga && Math.abs(carga[1]) < 4) { const dv = sub(r, carga), dd = len(dv); if (dd < 2.1) r = add(carga, mul(nrm(dv), 2.1)); }
          return r; });
        const vis = !(g.naCunha(Q[0][0], Q[0][2]) && Q[0][2] > 0 && false); if (vis) tb.set(K.denso(Q, 2), .09);
      });
      // moléculas pequenas passando livres
      for (let i = 0; i < 12; i++) { const ff = red ? (i + .5) / 12 : (t * .16 + i / 12) % 1, up = i % 2, y = up ? mix(-10, 10, ff) : mix(10, -10, ff), rr = Math.abs(y) < 4 ? 1.4 : 1.4 + (Math.abs(y) - 4) * 1.1, a = i * 2.3; K.put(g, g.peq, [Math.sin(a) * rr, y, Math.cos(a) * rr], null, .26, null, null, '#ffffff', 1, g.pecas.peq); }
      K.fim(g.peq);
      const pol = (r, a, y) => [Math.sin(th0 + a) * r, y, Math.cos(th0 + a) * r];
      Object.assign(g.anc, { ext: pol(15, 1.3, h + g.d / 2), int: pol(15, -1.25, -h - g.d / 2), peri: pol(13, g.cw + .02, 0), lam: pol(10.5, -1.15, -h - 1.1), fil: [Math.sin(th0 + Math.PI * .8) * 7.4, h + 6.8, Math.cos(th0 + Math.PI * .8) * 7.4], cesta: [Math.sin(th0 + 2) * 3.4, -h - 4.2, Math.cos(th0 + 2) * 3.4], fg: [0, -.2, 0], cito: pol(16, 1.9, 10), nuc: pol(16, 1.9, -11) });
      ['ext', 'int', 'peri', 'lam', 'fil', 'cesta', 'fg', 'cito', 'nuc', 'npc', 'peq'].forEach(k => { g.vis[k] = 1; });
      Object.keys(g.pecas).forEach(k => { g.raioPc[k] = 6; });
      g.f = f;
    },
    camera(g, P) { return K.viva(g.q.cel ? { th: -.35, fi: .42, d: 62, al: [0, -1, 0] } : { th: -.35, fi: .4, d: 48, al: [0, -1, 0] }, P.t, .5); },
    legenda(P, g) { const imp = (g.f || 0) < .5; return imp ? '<b>Importação</b><small>a importina leva uma proteína com sinal NLS pelo canal central</small>' : '<b>Exportação</b><small>o mRNA sai para o citoplasma preso a um receptor de exportação</small>'; }
  });

  // ================= CROMATINA: DO DNA AO CROMOSSOMO =================
  const NOMES_C = ['Dupla hélice de DNA, 2 nm', 'Nucleossomos ("colar de contas"), 11 nm', 'Fibra de cromatina, cerca de 30 nm', 'Alças presas ao arcabouço, cerca de 300 nm', 'Cromossomo metafásico, cerca de 1 400 nm'];
  const FAT_C = ['DNA esticado, sem compactação', 'compactação: cerca de 6 vezes', 'compactação: cerca de 40 vezes', 'compactação: cerca de 1 000 vezes', 'compactação: cerca de 10 000 vezes'];
  const BASES = ['#39E58C', '#FF4F6D', '#FFC53D', '#7C8BFF'];
  K.cena('nucleo/cromatina', {
    alt: 'Modelo 3D com os cinco níveis de compactação do DNA: a dupla hélice; os nucleossomos, com o DNA dando quase duas voltas em torno de 8 histonas; a fibra de cromatina, com os nucleossomos empilhados; as alças presas a um arcabouço de proteínas; e o cromossomo metafásico, com duas cromátides-irmãs',
    fit: 36, raio: 16, nevoa: .008,
    pecas: {
      bp: pc('Pares de bases', '#FFC53D', 'A com T e C com G, como degraus de uma escada torcida.'),
      esq: pc('Esqueleto açúcar-fosfato', '#C9AEFF', 'Os corrimãos da escada: desoxirribose e fosfato alternados.'),
      hist: pc('Octâmero de histonas', '#FFE1A6', 'Oito histonas (H2A, H2B, H3 e H4, duas de cada). Cerca de 147 pares de bases dão quase duas voltas em torno dele.'),
      lig: pc('DNA de ligação', '#9A6BFF', 'Trecho de DNA entre um nucleossomo e o seguinte.'),
      h1: pc('Histona H1', '#FF9A3C', 'Prende o DNA na entrada e na saída do nucleossomo e aproxima os nucleossomos, que se empilham na fibra.'),
      fib: pc('Fibra de cromatina', '#9A6BFF', 'Nucleossomos empilhados. O modelo clássico é a fibra de 30 nm; nas células vivas ela parece ser mais irregular.'),
      arc: pc('Arcabouço proteico', '#FFE1A6', 'Eixo de proteínas (condensinas e coesinas) onde as alças se prendem.'),
      alca: pc('Alça de cromatina', '#9A6BFF', 'Cada alça tem dezenas de milhares de pares de bases.'),
      crom: pc('Cromátides-irmãs', '#B7A2FF', 'As duas cópias idênticas do DNA, feitas na replicação, unidas até a anáfase.'),
      cen: pc('Centrômero', '#E2D8FF', 'A constrição que une as cromátides-irmãs; ali se forma o cinetócoro.')
    },
    rotulos: [
      { pc: 'bp', t: 'Pares de bases', pr: 1, passo: P => P.passo === 1 }, { pc: 'esq', t: 'Esqueleto açúcar-fosfato', pr: 1, passo: P => P.passo === 1 },
      { pc: 'hist', t: 'Octâmero de histonas', pr: 1, passo: P => P.passo === 2 }, { pc: 'lig', t: 'DNA de ligação', pr: 1, passo: P => P.passo === 2 },
      { pc: 'h1', t: 'Histona H1', pr: 1, passo: P => P.passo === 3 }, { pc: 'fib', t: 'Fibra de cromatina', pr: 2, passo: P => P.passo === 3 },
      { pc: 'arc', t: 'Arcabouço proteico', pr: 1, passo: P => P.passo === 4 }, { pc: 'alca', t: 'Alça de cromatina', pr: 1, passo: P => P.passo === 4 },
      { pc: 'crom', t: 'Cromátides-irmãs', pr: 1, passo: P => P.passo === 5 }, { pc: 'cen', t: 'Centrômero', pr: 1, passo: P => P.passo === 5 }
    ],
    montar(g) {
      const T = g.T, q = g.q;
      g.N = [null]; for (let i = 1; i <= 5; i++) { const gr = new T.Group(); g.raiz.add(gr); g.N.push(gr); gr.visible = false; }
      // 1. dupla hélice
      { const gr = g.N[1], n = 48, sp = .54, R = 1.6, A = [], B = [];
        const mA = K.fis(g, '#C9AEFF', { p: { roughness: .35, clearcoat: .7 }, rim: '#E6DAFF', rimK: .3 }), mB = K.fis(g, '#E8EDF7', { p: { roughness: .35, clearcoat: .7 }, rimK: .3 });
        for (let i = 0; i < n; i++) { const x = (i - n / 2) * sp, a = i * .62; A.push([x, Math.cos(a) * R, Math.sin(a) * R]); B.push([x, Math.cos(a + 2.3) * R, Math.sin(a + 2.3) * R]); }
        const tA = K.tubo(g, 200, 10, mA, gr, g.pecas.esq), tB = K.tubo(g, 200, 10, mB, gr, g.pecas.esq); tA.set(K.denso(A, 3), .34); tB.set(K.denso(B, 3), .34);
        const ru = K.inst(g, K.capsula(g, .17, .5, 8), K.fis(g, '#ffffff', { p: { roughness: .4, clearcoat: .5 }, rimK: .2 }), n * 2, gr, g.pecas.bp);
        for (let i = 0; i < n; i++) { const a = A[i], b = B[i], m = lerp3(a, b, .5), k = i * 7 % 4, kk = [1, 0, 3, 2][k]; K.put(g, ru, lerp3(a, m, .5), K.qy(g, sub(b, a)).clone(), 1, len(sub(m, a)) / 1.34, 1, BASES[k], 1, g.pecas.bp); K.put(g, ru, lerp3(m, b, .5), K.qy(g, sub(b, a)).clone(), 1, len(sub(m, a)) / 1.34, 1, BASES[kk], 1, g.pecas.bp); }
        K.fim(ru); g.pick.push(tA.mesh, tB.mesh, ru.m); g.h1A = A; }
      // 2. nucleossomos ("colar de contas")
      { const gr = g.N[2], P = [], nN = 5, mH = [prot(g, '#FFE1A6'), prot(g, '#F2CF8C'), prot(g, '#FFD0A6', '#FFE6D0'), prot(g, '#E9C88A', '#FFE3B8')];
        P.push([-15, 0, 0]);
        for (let i = 0; i < nN; i++) {
          const c = [(i - (nN - 1) / 2) * 6.2, (i % 2 ? .9 : -.9), 0], ax = nrm([.25 * (i % 2 ? 1 : -1), .3, 1]), u = nrm(cross(ax, [0, 1, 0])), v = cross(ax, u);
          const oc = new T.Group(); oc.position.set(...c); gr.add(oc);
          for (let k = 0; k < 8; k++) { const a = (k % 4) / 4 * TAU + (k < 4 ? 0 : .4), off = add(add(mul(u, Math.cos(a) * .82), mul(v, Math.sin(a) * .82)), mul(ax, k < 4 ? -.48 : .48)); const m = new T.Mesh(K.lumpy(g, 'hist' + (k % 4), 101 + k % 4, q.det, 10, .22, .35, .6), mH[k % 4]); m.position.set(...off); m.scale.setScalar(.82); m.userData.peca = g.pecas.hist; oc.add(m); g.pick.push(m); }
          const n0 = 1.65 * TAU, a0 = -Math.PI / 2;
          for (let k = 0; k <= 44; k++) { const f = k / 44, a = a0 + f * n0; P.push(add(c, add(add(mul(u, Math.cos(a) * 2.02), mul(v, Math.sin(a) * 2.02)), mul(ax, mix(-.85, .85, f))))); }
          if (i === 2) { g.ancH = add(c, [0, 2.4, 1]); }
        }
        P.push([15, 0, 0]);
        const tb = K.tubo(g, 900, 8, K.fis(g, '#9A6BFF', { p: { roughness: .38, clearcoat: .6 }, rim: '#D0B8FF', rimK: .35 }), gr, g.pecas.lig); tb.set(K.denso(P, 3), .34); g.pick.push(tb.mesh);
        g.ancL = [9.3, -1.6, 1.4]; }
      // 3. fibra de cromatina (solenoide)
      { const gr = g.N[3], n = q.cel ? 40 : 52, Rf = 2.4, P = [];
        const nb = K.inst(g, K.lumpy(g, 'nuc30', 121, q.det, 10, .18, .35, .6), prot(g, '#FFE1A6'), n, gr, g.pecas.fib), dn = K.inst(g, new T.TorusGeometry(1.08, .22, 8, 26), K.fis(g, '#9A6BFF', { p: { roughness: .38, clearcoat: .6 }, rim: '#D0B8FF', rimK: .35 }), n, gr, g.pecas.fib), h1 = K.inst(g, K.esfera(g, 12), K.emis(g, '#FF9A3C', .9), n, gr, g.pecas.h1);
        g.geos.push(dn.m.geometry);
        for (let i = 0; i < n; i++) {
          const a = i * TAU / 6, x = -13 + i * 26 / (n - 1), c = [x, Math.cos(a) * Rf, Math.sin(a) * Rf], rad = [0, Math.cos(a), Math.sin(a)], tg = [0, -Math.sin(a), Math.cos(a)];
          const ax = nrm(add(tg, [.35, 0, 0])), qq = K.qy(g, ax).clone();
          K.put(g, nb, c, qq, 1.05, .78, 1.05, '#ffffff', .9 + .2 * hash(i, 1), g.pecas.fib); K.put(g, dn, c, K.qy(g, ax, new T.Quaternion()).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1, 0, 0), Math.PI / 2)), 1, 1, 1, '#ffffff', 1, g.pecas.fib);
          const hp = add(c, mul(rad, -1.05)); K.put(g, h1, hp, null, .3, null, null, '#ffffff', 1, g.pecas.h1);
          P.push(add(c, mul(rad, -1.15)));
          if (i === Math.floor(n / 2)) { g.ancH1 = hp; g.ancF = add(c, mul(rad, 1.4)); }
        }
        K.fim(nb); K.fim(dn); K.fim(h1);
        const tb = K.tubo(g, 400, 6, K.fis(g, '#9A6BFF', { p: { roughness: .38, clearcoat: .6 }, rim: '#D0B8FF', rimK: .35 }), gr, g.pecas.fib); tb.set(K.denso(P, 3), .2);
        g.pick.push(nb.m, dn.m, h1.m, tb.mesh); }
      // 4. alças presas ao arcabouço
      { const gr = g.N[4], nL = q.cel ? 20 : 28;
        g.arcI = K.inst(g, K.lumpy(g, 'arc', 141, 2, 10, .25, .35, .6), prot(g, '#FFE1A6'), 40, gr, g.pecas.arc);
        for (let i = 0; i < 26; i++) K.put(g, g.arcI, [-11.5 + i * .92, (hash(i, 3) - .5) * .3, (hash(i, 4) - .5) * .3], null, .62, null, null, '#ffffff', .9 + .2 * hash(i, 5), g.pecas.arc);
        K.fim(g.arcI);
        g.alc = K.inst(g, K.esfera(g, 10), K.fis(g, '#ffffff', { p: { roughness: .45, clearcoat: .4, sheen: .5, sheenColor: new T.Color('#D8C8FF') }, rim: '#C9B4FF', rimK: .3 }), nL * 60, gr, g.pecas.alca);
        g.loops = []; for (let j = 0; j < nL; j++) g.loops.push([-10.8 + j * 21.6 / (nL - 1), j * 2.39996, 4.4 + 2.4 * hash(j, 7), hash(j, 8) * TAU]);
        g.pick.push(g.arcI.m, g.alc.m); }
      // 5. cromossomo metafásico
      g.cr5 = cromossomo(g, { L: 15, p: .42, w: 1.75, sem: 5 }, g.N[5], g.pecas.crom);
    },
    animar(g, P) {
      const t = P.t, red = RED(), lv = cl(P.passo || 1, 1, 5), tp = P.tp;
      if (g.lv !== lv) { g.ant = g.lv || null; g.lv = lv; }
      const e = red ? 1 : out(tp / 1.4);
      for (let i = 1; i <= 5; i++) {
        const gr = g.N[i];
        if (i === lv) { gr.visible = true; const s = mix(g.ant && g.ant < lv ? 2.4 : .45, 1, e); gr.scale.setScalar(s); }
        else if (i === g.ant && e < 1) { gr.visible = true; gr.scale.setScalar(Math.max(.001, (g.ant < lv ? mix(1, .25, e) : mix(1, 2.6, e)) * (1 - sst(.55, 1, e)))); }
        else gr.visible = false;
        gr.rotation.x = red ? .3 : t * (i === 5 ? 0 : .18);
        if (i === 5) gr.rotation.y = red ? .5 : t * .3;
      }
      // alças: balançam devagar
      if (g.N[4].visible) {
        g.loops.forEach(([x0, al, L, ph], j) => {
          const d = [0, Math.cos(al), Math.sin(al)], n = Math.ceil(L * 2 / .34) + 6;
          for (let k = 0; k <= n; k++) { const u = k / n, r = L * Math.sin(Math.PI * u) + .3, lat = -.55 * Math.cos(Math.PI * u), w = red ? 0 : Math.sin(t * .8 + ph + u * 5) * .35 * Math.sin(Math.PI * u);
            const p = [x0 + lat + w * .6, d[1] * r - d[2] * w, d[2] * r + d[1] * w]; K.put(g, g.alc, p, null, .3, null, null, j % 3 ? '#9A6BFF' : '#8A62F0', .85 + .3 * hash(j * 131 + k, 2), g.pecas.alca); }
          if (j === 5) g.ancA = [x0, d[1] * (L + .6), d[2] * (L + .6)];
        });
        K.fim(g.alc);
      }
      // âncoras dos rótulos (no grupo do nível atual)
      const gr = g.N[lv];
      if (lv === 1) { const A = g.h1A; g.anc.esq = v3(g, A[30], gr); g.anc.bp = v3(g, lerp3(A[22], [A[22][0], 0, 0], .5), gr); }
      if (lv === 2) { g.anc.hist = v3(g, g.ancH, gr); g.anc.lig = v3(g, g.ancL, gr); }
      if (lv === 3) { g.anc.h1 = v3(g, g.ancH1, gr); g.anc.fib = v3(g, g.ancF, gr); }
      if (lv === 4) { g.anc.arc = v3(g, [6, 0, 0], gr); g.anc.alca = v3(g, g.ancA || [0, 5, 0], gr); }
      if (lv === 5) { const C = g.cr5.C; g.anc.crom = v3(g, [C.cx(-8) + 2.3, -8, 0], gr); g.anc.cen = v3(g, [g.cr5.ki[0].position.x, 0, 0], gr); }
      Object.keys(g.pecas).forEach(k => { g.vis[k] = 1; g.raioPc[k] = 5; });
    },
    camera(g, P) { const lv = cl(P.passo || 1, 1, 5), d = [0, 34, 34, 36, 40, 40][lv]; return K.viva(g.q.cel ? { th: -.25, fi: .16, d: d * 1.45, al: [0, 0, 0] } : { th: -.3, fi: .18, d, al: [0, 0, 0] }, P.t, .5); },
    legenda(P) { const lv = cl(P.passo || 1, 1, 5); return `<b>${lv}. ${NOMES_C[lv - 1]}</b><small>${FAT_C[lv - 1]}</small>`; }
  });

  // ================= NUCLÉOLO =================
  K.cena('nucleo/nucleolo', {
    alt: 'Modelo 3D do nucléolo em corte, sem membrana, com os centros fibrilares, o componente fibrilar denso e o componente granular; ao lado, genes de RNA ribossômico sendo transcritos, com os RNAs nascentes crescendo em forma de árvore de Natal; o pré-RNA 45S é cortado em 18S, 5,8S e 28S, e as subunidades 40S e 60S saem do nucléolo',
    fit: 40, raio: 18, nevoa: .008,
    pecas: {
      fc: pc('Centro fibrilar (rDNA)', '#DCF0FF', 'Onde ficam os genes do RNA ribossômico, prontos para a transcrição.'),
      dfc: pc('Componente fibrilar denso', '#6A45D8', 'Em volta dos centros fibrilares: ali o pré-RNA é transcrito e começa a ser processado.'),
      gc: pc('Componente granular', '#C9AEFF', 'Grânulos de subunidades de ribossomo em montagem, com o rRNA e cerca de 80 proteínas vindas do citoplasma.'),
      dna: pc('DNA espaçador', '#9A6BFF', 'Trecho entre dois genes de rRNA que não é transcrito.'),
      pol: pc('RNA-polimerase I', '#FFE1A6', 'Transcreve o rDNA. Dezenas delas leem o mesmo gene ao mesmo tempo, uma atrás da outra.'),
      rna: pc('RNA nascente', '#FF8787', 'Fica mais longo à medida que a polimerase avança: por isso o gene parece uma árvore de Natal.'),
      pre: pc('Pré-rRNA 45S', '#FFC9C9', 'É cortado em 18S, 5,8S e 28S. Junto com o 5S, feito fora do nucléolo, forma os ribossomos.'),
      r18: pc('rRNA 18S', '#FF922B', 'Vai para a subunidade menor, 40S.'),
      r28: pc('rRNA 28S e 5,8S', '#E8590C', 'Vão para a subunidade maior, 60S, com o 5S.'),
      sub: pc('Subunidades 40S e 60S', '#FF922B', 'Saem pelos poros da carioteca e só se juntam no citoplasma.')
    },
    rotulos: [{ pc: 'fc', t: 'Centro fibrilar (rDNA)', pr: 1 }, { pc: 'dfc', t: 'Componente fibrilar denso', pr: 1 }, { pc: 'gc', t: 'Componente granular', pr: 1 }, { pc: 'dna', t: 'DNA espaçador', pr: 2 }, { pc: 'pol', t: 'RNA-polimerase I', pr: 1 }, { pc: 'rna', t: 'RNA nascente', pr: 2 }, { pc: 'pre', t: 'Pré-rRNA 45S', pr: 2 }, { pc: 'r18', t: '18S', pr: 3 }, { pc: 'r28', t: '28S e 5,8S', pr: 3 }, { pc: 'sub', t: 'Subunidades 40S e 60S', pr: 2 }],
    montar(g) {
      const T = g.T, q = g.q, cel = q.cel;
      g.cN = cel ? [0, 7.2, 0] : [-10, .5, 0]; g.Rn = cel ? 5.2 : 6.4;
      g.ax = cel ? { x0: -9, x1: 9, y: -3.4 } : { x0: 1, x1: 19.5, y: 3.4 };
      g.pr = cel ? { x: 0, y: -9.2 } : { x: 10.2, y: -3.6 };
      // grãos do componente granular (com um contorno irregular) e o fibrilar denso em volta dos centros
      const R = rng(4), Rn = g.Rn, gc = [], dfc = [];
      g.fcs = [[-.35, .3, -.15], [.32, .38, .1], [.05, -.32, -.1], [-.42, -.3, .05], [.45, -.2, -.2]].map(p => mul(p, Rn));
      const nG = cel ? 900 : 1700;
      for (let i = 0; i < nG * 3 && gc.length < nG; i++) { const p = [(R() * 2 - 1) * Rn, (R() * 2 - 1) * Rn, (R() * 2 - 1) * Rn], r = len(p), lim = Rn * (.82 + .3 * vnoise(p[0] * .35 + 3, p[1] * .35, p[2] * .35)); if (r > lim) continue; if (g.fcs.some(c => len(sub(p, c)) < Rn * .3)) continue; gc.push([p, .17 + R() * .1, R() * TAU]); }
      g.fcs.forEach((c, j) => { for (let i = 0; i < (cel ? 70 : 120); i++) { const d = nrm([R() - .5, R() - .5, R() - .5]), r = Rn * (.17 + R() * .1); dfc.push([add(c, mul(d, r)), .12 + R() * .07, R() * TAU]); } });
      g.gc = gc; g.dfc = dfc;
      g.iGc = K.inst(g, K.esfera(g, 8), K.fis(g, '#ffffff', { p: { roughness: .5, sheen: .5, sheenColor: new T.Color('#E8DCFF') }, rimK: .2 }), gc.length, null, g.pecas.gc);
      g.iDf = K.inst(g, K.esfera(g, 8), K.fis(g, '#ffffff', { p: { roughness: .45, sheen: .4 }, rim: '#B8A0FF', rimK: .3 }), dfc.length, null, g.pecas.dfc);
      g.fcM = g.fcs.map((c, j) => { const m = new T.Mesh(K.esfera(g, 28), K.pelicula(g, '#DCF0FF', { base: .2, fr: .7, cor2: '#FFFFFF', esc: 2 })); m.position.set(...add(g.cN, c)); m.scale.setScalar(Rn * .15); m.renderOrder = 3; m.userData.peca = g.pecas.fc; g.raiz.add(m); g.pick.push(m); return m; });
      g.pick.push(g.iGc.m, g.iDf.m);
      // genes de rRNA: o eixo de DNA, as polimerases e os RNAs nascentes
      const ax = g.ax, U = (ax.x1 - ax.x0) * .4;
      g.un = [ax.x0 + (ax.x1 - ax.x0) * .04, ax.x0 + (ax.x1 - ax.x0) * .56]; g.U = U;
      const tb = K.tubo(g, 80, 8, K.fis(g, '#9A6BFF', { p: { roughness: .38, clearcoat: .6 }, rim: '#D0B8FF', rimK: .35 }), null, g.pecas.dna);
      const D = []; for (let i = 0; i <= 60; i++) { const x = mix(ax.x0 - .8, ax.x1 + .8, i / 60); D.push([x, ax.y + Math.sin(x * .7) * .12, Math.cos(x * .5) * .12]); } tb.set(D, .2); g.pick.push(tb.mesh);
      g.iPol = K.inst(g, K.lumpy(g, 'pol1', 151, q.det, 10, .25, .35, .6), prot(g, '#FFE1A6'), 40, null, g.pecas.pol);
      g.iRna = K.inst(g, K.esfera(g, 8), K.fis(g, '#FF8787', { p: { roughness: .45, clearcoat: .4, sheen: .5, sheenColor: new T.Color('#FFD0D0') }, rim: '#FFC0C0', rimK: .3 }), 1400, null, g.pecas.rna);
      g.iPon = K.inst(g, K.esfera(g, 10), K.fis(g, '#FFC9C9', { p: { roughness: .4, clearcoat: .5 }, rimK: .3 }), 40, null, g.pecas.rna);
      g.pick.push(g.iPol.m, g.iRna.m, g.iPon.m);
      // processamento: o 45S e os pedaços 18S, 5,8S e 28S
      const mR = c => K.fis(g, c, { p: { roughness: .38, clearcoat: .6 }, rimK: .3 });
      g.t45 = [K.tubo(g, 30, 8, mR('#FFC9C9'), null, g.pecas.pre), K.tubo(g, 30, 8, mR('#FF922B'), null, g.pecas.r18), K.tubo(g, 12, 8, mR('#E8590C'), null, g.pecas.r28), K.tubo(g, 40, 8, mR('#E8590C'), null, g.pecas.r28), K.tubo(g, 12, 8, mR('#FFC9C9'), null, g.pecas.pre)];
      g.t45.forEach(x => g.pick.push(x.mesh));
      // subunidades saindo
      g.s40 = new T.Mesh(K.lumpy(g, 's40', 161, q.det, 10, .25, .35, .6), prot(g, '#FF922B', '#FFD0A0')); g.s60 = new T.Mesh(K.lumpy(g, 's60', 162, q.det, 12, .25, .35, .6), prot(g, '#E8590C', '#FFC0A0'));
      [g.s40, g.s60].forEach(m => { m.userData.peca = g.pecas.sub; g.raiz.add(m); g.pick.push(m); });
      // fundo: cromatina e o envoltório do núcleo ao longe
      const mFc = K.fis(g, '#3A2A70', { p: { roughness: .8, sheen: .2 }, rimK: .05 }), RB = rng(8);
      for (let i = 0; i < 8; i++) { const m = new T.Mesh(K.lumpy(g, 'crn' + (i % 3), 60 + i % 3, 2, 12, .3, .3, .6), mFc); m.position.set((RB() * 2 - 1) * 30, (RB() * 2 - 1) * 16, -22 - RB() * 14); m.scale.setScalar(1.6 + RB() * 1.8); g.fundo.add(m); }
    },
    animar(g, P) {
      const t = P.t, red = RED(), cN = g.cN, Rn = g.Rn, corte = p => p[2] > Rn * .12 && p[0] > -Rn * .9;
      g.gc.forEach(([p, s, ph], i) => { if (corte(p)) return; const w = red ? 0 : .05; K.put(g, g.iGc, [cN[0] + p[0] + Math.sin(t * .6 + ph) * w, cN[1] + p[1] + Math.cos(t * .5 + ph) * w, cN[2] + p[2]], null, s, null, null, '#C9AEFF', .75 + .45 * hash(i, 2), g.pecas.gc); });
      g.dfc.forEach(([p, s, ph], i) => { if (corte(p) && p[2] > Rn * .3) return; K.put(g, g.iDf, add(cN, p), null, s, null, null, '#6A45D8', .85 + .3 * hash(i, 3), g.pecas.dfc); });
      K.fim(g.iGc); K.fim(g.iDf);
      g.fcM.forEach((m, j) => m.scale.setScalar(Rn * .15 * (1 + (red ? 0 : .03 * Math.sin(t * 1.2 + j)))));
      // árvores de Natal
      const ax = g.ax, U = g.U, Lmax = g.q.cel ? 4.2 : 5.6;
      g.un.forEach((u0, ui) => {
        for (let i = 0; i < 16; i++) {
          const f = red ? (i + .5) / 16 : (t * .05 + i / 16) % 1, x = u0 + f * U, L = .3 + f * Lmax * (1 - sst(.94, 1, f)), b = i * 2.39996 + ui, d = [0, Math.cos(b), Math.sin(b) * .8], pol = [x, ax.y, 0];
          K.put(g, g.iPol, pol, null, .36, null, null, '#ffffff', 1, g.pecas.pol);
          const n = Math.max(1, Math.round(L / .24));
          let last = pol;
          for (let k = 1; k <= n; k++) { const s = k / n * L, w = red ? 0 : Math.sin(t * .9 + i + s * .8) * .18 * s / Lmax; const p = [x + Math.sin(s * 1.3 + i) * .14 + w, ax.y + d[1] * (s + .3), d[2] * (s + .3) + w]; K.put(g, g.iRna, p, null, .13 + .03 * hash(i * 17 + k, ui), null, null, '#ffffff', .9 + .2 * hash(k, i), g.pecas.rna); last = p; }
          K.put(g, g.iPon, last, null, .2 + f * .22, null, null, '#ffffff', 1, g.pecas.rna);
          if (ui === 0 && i === 9) { g.anc.pol = pol; }
          if (ui === 0 && i === 12) g.anc.rna = last;
        }
      });
      K.fim(g.iPol); K.fim(g.iRna); K.fim(g.iPon);
      // 45S cortado em 18S, 5,8S e 28S
      const pr = g.pr, c = red ? 1 : ((t * .14) % 1), sep = out(seg(c, .35, .6)) * (1 - sst(.9, 1, c)), Lt = 9, seg45 = [[0, .05, 4], [.05, .3, 1], [.3, .38, 4], [.38, .42, 2], [.42, .95, 3], [.95, 1, 4]];
      const segs = [[.05, .3, 1, -1.2], [.38, .42, 2, 0], [.42, .95, 3, 1.2], [0, .05, 0, -2.4], [.95, 1, 4, 2.4]];
      segs.forEach(([a, b, k, dx]) => {
        const Q = []; for (let i = 0; i <= 16; i++) { const u = mix(a, b, i / 16), x = pr.x - Lt / 2 + u * Lt + dx * sep, y = pr.y + Math.sin(u * 14 + t * 1.4) * .22 - (k === 0 || k === 4 ? sep * 1.4 : 0); Q.push([x, y, Math.cos(u * 11 + t) * .2]); }
        const tb = g.t45[k]; tb.set(Q, (k === 0 || k === 4) ? .22 * (1 - sst(.6, .85, c)) + .001 : .24);
      });
      g.t45[0].mesh.visible = g.t45[4].mesh.visible = c < .85;
      g.anc.pre = [pr.x - Lt / 2 + .2, pr.y + .4, 0]; g.anc.r18 = [pr.x - Lt / 2 + .17 * Lt - 1.2 * sep, pr.y + .3, 0]; g.anc.r28 = [pr.x - Lt / 2 + .7 * Lt + 1.2 * sep, pr.y + .3, 0];
      g.vis.pre = 1; g.vis.r18 = g.vis.r28 = sep > .5 ? 1 : 0;
      // subunidades saindo do nucléolo
      const fs = red ? .5 : (t * .12) % 1, dir = g.q.cel ? nrm([.9, .5, .3]) : nrm([-.2, 1, .4]), p0 = add(cN, mul(dir, Rn * .85)), p1 = add(p0, mul(dir, 8)), ps = lerp3(p0, p1, mv(fs)), sc = sst(0, .12, fs) * (1 - sst(.85, 1, fs));
      g.s40.position.set(ps[0] - .6, ps[1], ps[2]); g.s60.position.set(ps[0] + .7, ps[1] - .3, ps[2] + .2); g.s40.scale.setScalar(.6 * sc + .001); g.s60.scale.setScalar(.85 * sc + .001);
      g.s40.rotation.y = g.s60.rotation.x = t * .5; g.anc.sub = add(ps, [0, 1.2, 0]); g.vis.sub = sc > .5 ? 1 : 0;
      const fc0 = g.fcs[1], df0 = g.fcs[2];
      Object.assign(g.anc, { fc: add(cN, fc0), dfc: add(cN, add(df0, [Rn * .2, -Rn * .1, .4])), gc: add(cN, [-Rn * .7, Rn * .55, -1]), dna: [g.un[0] + U + (g.un[1] - g.un[0] - U) / 2, ax.y - .2, 0] });
      ['fc', 'dfc', 'gc', 'dna', 'pol', 'rna'].forEach(k => { g.vis[k] = 1; });
      Object.keys(g.pecas).forEach(k => { g.raioPc[k] = 5; });
    },
    camera(g, P) { return K.viva(g.q.cel ? { th: -.12, fi: .12, d: 60, al: [0, -1, 0] } : { th: -.2, fi: .12, d: 44, al: [4.2, -.4, 0] }, P.t, .5); },
    legenda() { return '<b>“Árvores de Natal”: a transcrição do rDNA</b><small>o pré-rRNA 45S é cortado em 18S, 5,8S e 28S, que formam as subunidades 40S e 60S</small>'; }
  });

  // ================= CROMOSSOMOS =================
  const TIPOS_C = [['Metacêntrico', .5, 0, 'braços iguais, p:q cerca de 1'], ['Submetacêntrico', .33, 0, 'braços desiguais, p:q cerca de 0,5'], ['Acrocêntrico', .13, 1, 'braço p muito curto, às vezes com um satélite'], ['Telocêntrico', 0, 0, 'centrômero na ponta, sem braço p (não ocorre em humanos)']];
  K.cena('nucleo/cromossomos', {
    alt: 'Modelo 3D girável de um cromossomo metafásico com as duas cromátides-irmãs, o centrômero, os cinetócoros, os braços p e q e os telômeros; ao lado, os quatro tipos pela posição do centrômero: metacêntrico, submetacêntrico, acrocêntrico com satélite e telocêntrico',
    fit: 38, raio: 17, nevoa: .006,
    pecas: {
      crom: pc('Cromátides-irmãs', '#B7A2FF', 'Duas cópias idênticas do DNA, feitas na replicação e unidas pelo centrômero até a anáfase.'),
      cen: pc('Centrômero', '#E2D8FF', 'A constrição primária. Divide o cromossomo em braço curto (p) e braço longo (q).'),
      cin: pc('Cinetócoro', '#CFE0FF', 'Placa de proteínas no centrômero onde se prendem as fibras do fuso na divisão celular.'),
      p: pc('Braço p', '#B7A2FF', 'O braço curto (do francês petit).'),
      q: pc('Braço q', '#B7A2FF', 'O braço longo.'),
      tel: pc('Telômero', '#FFE1A6', 'Repetições de TTAGGG que protegem as pontas e, na maioria das células do corpo, encurtam a cada divisão.'),
      t0: pc('Metacêntrico', '#C9AEFF', 'Centrômero no meio: braços iguais. Exemplo: o cromossomo 1.'),
      t1: pc('Submetacêntrico', '#C9AEFF', 'Centrômero fora do meio: braço p menor que o q.'),
      t2: pc('Acrocêntrico', '#C9AEFF', 'Braço p muito curto, às vezes com um satélite. Nos humanos: 13, 14, 15, 21 e 22, que levam os genes do nucléolo.'),
      t3: pc('Telocêntrico', '#C9AEFF', 'Centrômero na ponta. Não ocorre em humanos.')
    },
    rotulos: [{ pc: 'cin', t: 'Cinetócoro', pr: 1 }, { pc: 'cen', t: 'Centrômero', pr: 1 }, { pc: 'p', t: 'Braço p', pr: 1 }, { pc: 'q', t: 'Braço q', pr: 1 }, { pc: 'tel', t: 'Telômero', pr: 2 }, { pc: 'crom', t: 'Cromátides-irmãs', pr: 2 },
      { pc: 't0', t: 'Metacêntrico', pr: 1 }, { pc: 't1', t: 'Submetacêntrico', pr: 1 }, { pc: 't2', t: 'Acrocêntrico', pr: 1 }, { pc: 't3', t: 'Telocêntrico', pr: 1 }],
    montar(g) {
      const cel = g.q.cel;
      g.big = cromossomo(g, { L: cel ? 12 : 15.5, p: .38, w: cel ? 1.4 : 1.8, sem: 7, pecaKi: g.pecas.cin }, null, g.pecas.crom);
      g.big.gr.position.set(...(cel ? [0, 5.6, 0] : [-9, .4, 0]));
      g.tipos = TIPOS_C.map(([n, r, sat], i) => {
        const c = cromossomo(g, { L: cel ? 5.2 : 7.6, p: r, w: cel ? .68 : .95, sat, sem: 11 + i }, null, g.pecas['t' + i]);
        c.gr.position.set(...(cel ? [-6.6 + i * 4.4, -5.4, 0] : [1.5 + i * 5.2, -1.2, 0])); return c;
      });
    },
    animar(g, P) {
      const t = P.t, red = RED(), B = g.big, C = B.C, gr = B.gr, cel = g.q.cel;
      gr.rotation.y = red ? .45 : t * .28; gr.rotation.z = red ? 0 : Math.sin(t * .2) * .05;
      const foco = red ? -1 : Math.floor(t / 4.5) % 4;
      g.tipos.forEach((c, i) => { c.gr.rotation.y = red ? .4 : t * .35 + i * .8; const s = foco === i ? 1.08 : 1; c.gr.scale.setScalar(mix(c.gr.scale.x || 1, s, .08)); const tp = c.C; g.anc['t' + i] = v3(g, [0, tp.top + c.o.w * (c.o.sat ? 3.6 : 1.6) + (i === 2 ? 2.2 : 0), 0], c.gr); g.vis['t' + i] = 1; });
      g.foco = foco;
      const w = B.o.w;
      Object.assign(g.anc, {
        cin: v3(g, [B.ki[0].position.x + w * .2, 0, 0], gr), cen: v3(g, [-B.ki[0].position.x * .4, 0, 0], gr),
        p: v3(g, [-C.cx(C.top * .5) - w * .9, C.top * .5, 0], gr), q: v3(g, [-C.cx(C.bot * .55) - w * .9, C.bot * .55, 0], gr),
        tel: v3(g, [C.cx(C.top), C.top + w * .2, 0], gr), crom: v3(g, [C.cx(C.bot * .3) + w * .8, C.bot * .3, 0], gr)
      });
      ['cin', 'cen', 'p', 'q', 'tel', 'crom'].forEach(k => { g.vis[k] = 1; });
      Object.keys(g.pecas).forEach(k => { g.raioPc[k] = 5; });
    },
    camera(g, P) { return K.viva(g.q.cel ? { th: -.08, fi: .08, d: 52, al: [0, -.2, 0] } : { th: -.12, fi: .08, d: 42, al: [3.2, -.4, 0] }, P.t, .4); },
    legenda(P, g) { const f = g.foco; if (f == null || f < 0) return '<b>Pela posição do centrômero</b><small>metacêntrico, submetacêntrico, acrocêntrico e telocêntrico</small>'; const T0 = TIPOS_C[f]; return `<b>${T0[0]}</b><small>${T0[3]}</small>`; }
  });
})();
