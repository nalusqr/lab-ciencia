/* LAB Citogenética: cenas 3D da divisão (Martin). Mitose, citocinese, meiose, crossing-over, segregação independente,
   mitose e meiose lado a lado e não disjunção. As células leem os mesmos estados das cenas 2D do módulo (mkMitose e
   mkMeiose), então a ciência e a cadência por fase são as mesmas; o que muda é o volume, a luz e a câmera. */
'use strict';
(function () {
  if (!window.CITO3D) return;
  const C3 = CITO3D, { cl, mix, add, sub, mul, nrm, len, lerp3, hash, TAU } = C3.V;
  const RED = () => window.MOL3D && MOL3D.reduz;
  const R0 = 100, KW = .1;   // estados montados com R = 100 px; 1 px = 0,1 unidade do mundo

  // ---------- cena genérica "por estados" (1 ou 2 diagramas) ----------
  // cfg(K) => { diag: [{ est: estados, G, titulo, aster, alerta }], extra }
  function porEstados(chave, cfg) {
    C3.cena(chave, K => {
      const c = cfg(K), pecas = {}, rot = [], idx = {};
      c.diag.forEach((d, j) => d.est.forEach(st => (st.labs || []).forEach(l => {
        const key = j + ':' + l[4]; if (idx[key] != null) return; const id = 'r' + Object.keys(idx).length; idx[key] = id;
        pecas[id] = { nome: l[4], cor: '#CFE0FF', frase: C3.FR[l[4]] || '' }; rot.push({ pc: id, t: l[4] });
      })));
      Object.assign(pecas, c.pecas || {});
      const largo = g => g.v.w >= 640;
      const lay = g => { const n = c.diag.length; if (n === 1) return [[0, 0]]; return largo(g) ? [[-c.sep, 0], [c.sep, 0]] : [[0, c.sepY], [0, -c.sepY]]; };
      return {
        pecas, rotulos: rot, fit: 40, vista: { th: -.25, fi: .16 },
        montar(g) {
          g.D = c.diag.map(d => { const D = C3.divisao(g, { aster: d.aster !== false, nch: 4 }); return D; });
        },
        animar(g, P) {
          const L = lay(g); g.box = [0, 0];
          c.diag.forEach((d, j) => {
            const D = g.D[j], st = d.est, i = cl(P.i, 0, st.length - 1), S = K.mixS(st[Math.max(0, i - 1)], st[i], i ? P.e : 1);
            D.off = [L[j][0], L[j][1], 0]; D.S = S;
            D.alerta = [];
            if (d.alerta) (S.tags || []).forEach(tg => { if (!/[+−]/.test(tg.s)) return; let b = -1, bd = 1e9; S.cells.forEach((cc, ci) => { const dd = Math.hypot(cc.x - tg.x, cc.y - tg.y); if (dd < bd) { bd = dd; b = ci; } }); if (b >= 0) { D.alerta[b] = S.e; S.cells.forEach((cc, ci) => { if (Math.hypot(cc.x - S.cells[b].x, cc.y - S.cells[b].y) < .5) D.alerta[ci] = S.e; }); } });
            D.set(S, d.G, g.t);
            (S.labs || []).forEach(l => { const id = idx[j + ':' + l[4]]; if (S.e > .3) { g.vis[id] = 1; g.anc[id] = D.wm(l[0], l[1], 1.2); } });
            S.cells.forEach(cc => { g.box[0] = Math.max(g.box[0], Math.abs(D.off[0]) + (Math.abs(cc.x) + cc.r) * KW); g.box[1] = Math.max(g.box[1], Math.abs(D.off[1]) + (Math.abs(cc.y) + cc.r) * KW); });
          });
          if (c.animar) c.animar(g, P);
        },
        camera(g, P) {
          const n = c.diag[0].est.length, u = cl(P.u / Math.max(1, n - 1), 0, 1);
          const hx = Math.max(g.box[0], c.minX || 12) * 1.1 + .8, hy = Math.max(g.box[1], c.minY || 9) * 1.06 + (c.diag.length > 1 ? (g.v.w < 640 ? 4 : 2.6) : 1.8);
          return C3.viva({ th: mix(-.22, .18, u), fi: .14 + .05 * Math.sin(u * 3), d: C3.enquadrar(g, hx, hy, 4), al: [0, -.3, 0] }, g.t, .8);
        },
        sobre(g, S, K) {
          const X = K.X;
          c.diag.forEach((d, j) => {
            const D = g.D[j], SS = D.S; if (!SS) return;
            if (d.titulo) { const top = C3.tela(g, D.wm(0, -(c.tituloY || 120), 0)); K.tx(d.titulo, top[0], Math.max(K.W < 640 ? 96 : 62, top[1]), { f: K.FTT, s: K.W < 640 ? 14 : 15, w: 600, c: K.C.txt }); }
            X.globalAlpha = SS.e;
            (SS.tags || []).forEach(tg => {
              const p = C3.tela(g, D.wm(tg.x, tg.y, 0)), mau = d.alerta && /[+−]/.test(tg.s);
              if (mau) { X.font = `600 13px ${K.FD}`; const tw = X.measureText(tg.s).width + 18; K.rr(p[0] - tw / 2, p[1] - 12, tw, 24, 12); X.fillStyle = 'rgba(70,14,26,.92)'; X.fill(); X.strokeStyle = K.C.red; X.lineWidth = 1.5; X.stroke(); K.tx(tg.s, p[0], p[1] + .5, { f: K.FD, s: 13, w: 600, c: '#FFD0D6', bg: false }); }
              else K.tx(tg.s, p[0], p[1], { f: K.FD, s: 13, w: 500, c: tg.c || K.C.txt });
            });
            X.globalAlpha = 1;
            if (d.G.alle && SS.cond > .5) SS.ch.forEach((ch, i) => {
              const G = d.G, ux = Math.sin(ch.a), uy = Math.cos(ch.a), vx = Math.cos(ch.a), vy = -Math.sin(ch.a), Lh = G.L[i], off = G.w * .55 + ch.s;
              const pts = ch.s < G.w ? [[ch.x, ch.y]] : [[ch.x - vx * off, ch.y - vy * off], [ch.x + vx * off, ch.y + vy * off]];
              for (const [px, py] of pts) {
                let best = SS.cells[0], bd = 1e9; for (const q of SS.cells) { const dd = Math.hypot(q.x - px, q.y - py); if (dd < bd) { bd = dd; best = q; } }
                const sg = ((px - best.x) * ux + (py - best.y) * uy) >= 0 ? 1 : -1, p = C3.tela(g, D.wm(px + ux * sg * (Lh / 2 + 16), py + uy * sg * (Lh / 2 + 16), 1));
                K.tx(G.alle[i], p[0], p[1], { s: 14, w: 700, c: K.light(G.col[i], .55) });
              }
            });
          });
          if (c.sobre) c.sobre(g, S, K);
        }
      };
    });
  }

  // ---------- mitose ----------
  // na telófase e na citocinese os cromossomos voltam a se descondensar (só no 3D: o 2D mantém o desenho antigo)
  const desc = (st, m) => { Object.keys(m).forEach(k => { st[k] = Object.assign({}, st[k], { cond: m[k] }); }); return st; };
  porEstados('mitose/fases', K => ({ diag: [{ est: desc(K.mkMitose(0, 0, R0), { 4: .75, 5: .22 }), G: K.geo(R0) }], minX: 12, minY: 9 }));
  // ---------- meiose ----------
  porEstados('meiose/fases', K => ({ diag: [{ est: desc(K.mkMeiose(0, 0, R0, { labs: true }), { 7: .3 }), G: K.geo(R0, { xo: true }) }], minX: 12, minY: 10 }));
  // ---------- segregação independente: dois arranjos ----------
  porEstados('meiose/segregacao', K => {
    const map = [2, 3, 4, 6, 7], al = ['A', 'a', 'B', 'b'];
    return { sep: 17, sepY: 13.5, minX: 12, minY: 10, tituloY: 135, diag: [0, 1].map(k => ({ titulo: k ? 'Arranjo 2' : 'Arranjo 1', est: K.mkMeiose(0, 0, R0, { swap: !!k, alle: al }).filter((s, j) => map.includes(j)), G: K.geo(R0, { alle: al }) })) };
  });
  // ---------- mitose e meiose lado a lado ----------
  porEstados('comparar/lado', K => {
    const M = K.mkMitose(0, 0, R0, { labs: false }), E = K.mkMeiose(0, 0, R0, {});
    return { sep: 17, sepY: 13.5, minX: 12, minY: 10, tituloY: 135, diag: [{ titulo: 'Mitose', est: [0, 1, 2, 3, 5, 5, 5].map(k => M[k]), G: K.geo(R0) }, { titulo: 'Meiose', est: [0, 1, 2, 3, 4, 6, 7].map(k => E[k]), G: K.geo(R0, { xo: true }) }] };
  });
  // ---------- não disjunção: gameta errado em alerta ----------
  porEstados('erros/naodisjuncao', K => {
    const map = [2, 3, 4, 5, 6, 7];
    return { sep: 17, sepY: 13.5, minX: 12, minY: 10, tituloY: 135, diag: [0, 1].map(k => ({ titulo: k ? 'Erro na meiose II' : 'Erro na meiose I', alerta: true, est: K.mkMeiose(0, 0, R0, { nd: k ? 'II' : 'I' }).filter((s, j) => map.includes(j)), G: K.geo(R0) })) };
  });

  // ---------- citocinese: animal (estrangulamento) e vegetal (placa celular) ----------
  C3.cena('mitose/citocinese', K => {
    const pc = (nome, cor, frase) => ({ nome, cor, frase });
    return {
      fit: 40, vista: { th: -.3, fi: .2 },
      pecas: {
        anel: pc('Anel contrátil', '#CFE0FF', 'Filamentos de actina e miosina formam um anel sob a membrana e apertam a célula pelo equador.'),
        placa: pc('Placa celular', '#A9C54A', 'Vesículas do complexo de Golgi se fundem no meio da célula e formam a nova parede, de dentro para fora.'),
        parede: pc('Parede celular', '#A9C54A', 'Camada rígida de celulose por fora da membrana. Ela impede o estrangulamento.'),
        golgi: pc('Vesículas do Golgi', '#F7C13B', 'Trazem material da parede (pectina e celulose) para a placa celular.'),
        memb: C3.PECAS_BASE.membrana, nuc: C3.PECAS_BASE.nucleo
      },
      rotulos: [{ pc: 'anel', t: 'Anel contrátil' }, { pc: 'placa', t: 'Placa celular' }, { pc: 'parede', t: 'Parede celular' }],
      montar(g) {
        const T = g.T, q = g.q;
        g.A = new T.Group(); g.B = new T.Group(); g.raiz.add(g.A, g.B);
        g.mem = [0, 1].map(() => { const m = new T.Mesh(C3.esfera(g, q.cel ? 40 : 56), C3.filme(g, '#F06AAE', { cor2: '#FFD6EC', dentro: '#3A2350', base: .05, fr: .62, esc: .35 })); m.renderOrder = 3; m.userData.peca = g.pecas.memb; g.A.add(m); g.pick.push(m); return m; });
        const nuc = side => { const m = new T.Mesh(C3.esfera(g, 36), C3.filme(g, '#9A6BFF', { cor2: '#D9C9FF', dentro: '#2A1E4D', base: .1, fr: .55, esc: .9 })); m.renderOrder = 2; m.userData.peca = g.pecas.nuc; g.pick.push(m); return m; };
        g.nA = [nuc(), nuc()]; g.nA.forEach(m => g.A.add(m)); g.nB = [nuc(), nuc()]; g.nB.forEach(m => g.B.add(m));
        const mC = C3.fis(g, '#9A6BFF', { p: { roughness: .5, sheen: .5, sheenColor: new T.Color('#E6DCFF') }, rim: '#D2C2FF', rimK: .34 });
        g.cr = []; for (let j = 0; j < 4; j++) { const t = C3.tubo(g, 60, 8, mC, j < 2 ? g.A : g.B, C3.PECAS_BASE.crom); g.cr.push(t); }
        g.anel = new T.Mesh(new T.TorusGeometry(1, .07, 12, 64), C3.emis(g, '#CFE0FF', 1.6)); g.anel.userData.peca = g.pecas.anel; g.A.add(g.anel); g.pick.push(g.anel); g.geos.push(g.anel.geometry);
        g.orgA = C3.inst(g, C3.lumpy(g, 'mito', 5, 2, 5, .25, .5, .9), C3.fis(g, '#ffffff', { p: { roughness: .5, sheen: .4 } }), 16, g.A, C3.PECAS_BASE.organela);
        // vegetal
        g.par = new T.Mesh(C3.caixaR(g, 7.2, 4.6, 4.2, 1.2, 10), C3.filme(g, '#A9C54A', { cor2: '#E6F5A8', dentro: '#3D4A1A', base: .14, fr: .75, esc: .5 })); g.par.renderOrder = 4; g.par.userData.peca = g.pecas.parede; g.B.add(g.par); g.pick.push(g.par);
        g.memB = new T.Mesh(C3.caixaR(g, 6.85, 4.25, 3.85, 1.0, 10), C3.filme(g, '#F06AAE', { cor2: '#FFD6EC', dentro: '#2E2440', base: .04, fr: .45, esc: .5 })); g.memB.renderOrder = 3; g.B.add(g.memB);
        g.placa = new T.Mesh(C3.caixaR(g, .5, 4.25, 3.85, .45, 8), C3.fis(g, '#C9DD72', { p: { roughness: .45, clearcoat: .5, transparent: true, opacity: .92 }, rim: '#F0FFB0', rimK: .3 })); g.placa.userData.peca = g.pecas.placa; g.B.add(g.placa); g.pick.push(g.placa);
        g.ves = C3.inst(g, C3.esfera(g, 12), C3.emis(g, '#F7C13B', 1.3), 140, g.B, g.pecas.golgi); g.pick.push(g.ves.m);
        g.clo = C3.inst(g, C3.lumpy(g, 'clo', 9, 2, 4, .2, .5, .9), C3.fis(g, '#3FBF6A', { p: { roughness: .5, sheen: .4, sheenColor: new T.Color('#BFFFD0') }, rim: '#BFFFD0', rimK: .3 }), 12, g.B);
        g.fib = C3.inst(g, C3.cilindro(g, 5), C3.fis(g, '#CFE0FF', { p: { transparent: true, opacity: .5, depthWrite: false } }), 120, g.B);
        g.cen = C3.inst(g, C3.esfera(g, 12), C3.emis(g, '#CFE0FF', 2.4), 4, g.A, C3.PECAS_BASE.polo);
        // novelos de cromatina dos núcleos-filhos
        g.nov = [0, 1, 2, 3].map(s => { const R = C3.V.rng(40 + s * 3), P = []; let p = [0, 0, 0]; for (let j = 0; j < 60; j++) { p = add(p, mul(nrm([R() - .5, R() - .5, R() - .5]), .55)); const l = len(p); if (l > 1) p = mul(p, .8 / l); P.push(p); } return P; });
      },
      animar(g, P) {
        const i = P.i, e = P.e, qq = i ? cl((i - 1 + e) / 3, 0, 1) : 0, q = RED() ? qq : qq, larg = g.v.w >= 640, t = g.t;
        const offA = larg ? [-11.5, 0, 0] : [0, 8.8, 0], offB = larg ? [11.5, 0, 0] : [0, -8.8, 0];
        g.A.position.set(...offA); g.B.position.set(...offB); g.offA = offA; g.offB = offB;
        // animal: duas esferas que se afastam; a parte de dentro da outra some (superfície única com o sulco)
        const R = 5, r = mix(.82, .74, q) * R, d = mix(.5, .8, q) * R;
        g.mem.forEach((m, s) => { const sg = s ? 1 : -1; m.position.set(sg * d, 0, 0); m.scale.setScalar(r); const u = m.material.uniforms, o = add(offA, [-sg * d, 0, 0]); u.uO.value[0].set(o[0], o[1], o[2], r * .998); u.uN.value = 1; u.uT.value = t; u.uSel.value = g.sel === 'memb' ? .6 : 0; });
        g.nA.forEach((m, s) => { m.position.set((s ? 1 : -1) * d, 0, 0); m.scale.setScalar(.36 * R); m.material.uniforms.uSel.value = g.sel === 'nuc' ? .6 : 0; });
        const h = d < r ? Math.sqrt(r * r - d * d) : 0; g.anel.visible = i > 0 && h > .05; g.anel.scale.set(h * 1.0, h * 1.0, h); g.anel.rotation.y = Math.PI / 2;
        if (g.anel.visible) { g.vis.anel = 1; g.anc.anel = add(offA, [0, h, 0]); }
        g.cr.forEach((tb, s) => {
          const nb = s < 2 ? s : s - 2, cx = (nb ? 1 : -1) * (s < 2 ? d : 3.9), base = g.nov[s];
          tb.set(base.map((p, j) => [cx + p[0] * 1.2, p[1] * 1.2, p[2] * 1.2 + Math.sin(j * .4 + t * .3) * .05]), C3.pontas(.09, 2));
        });
        for (let s = 0; s < 2; s++) { const sg = s ? 1 : -1; C3.put(g, g.cen, [sg * (d + .5 * R), .3 * R, .4], null, .14, null, null, '#CFE0FF', 1, C3.PECAS_BASE.polo); }
        C3.fim(g.cen);
        for (let s = 0; s < 16; s++) { const cc = s < 8 ? -1 : 1, z0 = hash(s, 1) * 2 - 1, an = hash(s, 2) * TAU, sq = Math.sqrt(1 - z0 * z0), rr = r * (.6 + .25 * hash(s, 3)), p = [cc * d + sq * Math.cos(an) * rr, sq * Math.sin(an) * rr, z0 * rr]; g._e.set(an, z0, s); g._q.setFromEuler(g._e); C3.put(g, g.orgA, p, g._q, .24, .55, .24, '#E8A15A', .9, C3.PECAS_BASE.organela); }
        C3.fim(g.orgA);
        // vegetal: placa cresce do centro para as bordas, vesículas do Golgi chegam na borda da placa
        g.nB.forEach((m, s) => { m.position.set((s ? 1 : -1) * 3.9, 0, 0); m.scale.setScalar(1.6); });
        const pl = q, hy = 4.25, hz = 3.85;
        g.placa.visible = pl > .02; g.placa.scale.set(.25 + .75 * (i === 3 ? e : 0), Math.max(.02, pl), Math.max(.02, pl));
        g.par.material.uniforms.uSel.value = g.sel === 'parede' ? .6 : 0;
        if (g.placa.visible) { g.vis.placa = 1; g.anc.placa = add(offB, [0, -pl * hy * .5, pl * hz * .6]); }
        g.vis.parede = 1; g.anc.parede = add(offB, [-6.4, 4.2, 2.5]);
        if (i > 0) {
          for (let s = 0; s < 120; s++) {
            const an = hash(s, 8) * TAU, rad = Math.sqrt(hash(s, 9)), ry = Math.sin(an) * rad, rz = Math.cos(an) * rad, dist = Math.max(Math.abs(ry), Math.abs(rz));
            if (dist <= pl - .03) continue;
            const near = cl((pl + .32 - dist) / .32, 0, 1), xo = mix(2.2 * (hash(s, 10) - .5) * 2, 0, near), drift = RED() ? 0 : Math.sin(t * 1.2 + s) * .06;
            C3.put(g, g.ves, [xo + drift, ry * hy * .92, rz * hz * .92], null, .16 + .06 * near, null, null, '#F7C13B', 1, g.pecas.golgi);
          }
          // fragmoplasto: fibras curtas perpendiculares à placa, na borda que cresce
          for (let s = 0; s < 30; s++) { const an = s / 30 * TAU, rr = Math.min(1, pl + .12), y = Math.sin(an) * hy * rr * .92, z = Math.cos(an) * hz * rr * .92; if (pl >= .99) break; C3.bastao(g, g.fib, [-1.1, y, z], [1.1, y, z], .03, '#CFE0FF', 1); }
        }
        C3.fim(g.ves); C3.fim(g.fib);
        for (let s = 0; s < 12; s++) { const sx = s < 6 ? -1 : 1, p = [sx * (2 + 4.2 * hash(s, 4)), (hash(s, 5) * 2 - 1) * 3.4, (hash(s, 6) * 2 - 1) * 3]; g._e.set(s, s * .7, 0); g._q.setFromEuler(g._e); C3.put(g, g.clo, p, g._q, .55, .3, .38, '#3FBF6A', 1); }
        C3.fim(g.clo);
        g.memB.material.uniforms.uT.value = t;
      },
      camera(g, P) { const larg = g.v.w >= 640, hx = larg ? 19.5 : 8.5, hy = larg ? 6.5 : 15.6; return C3.viva({ th: -.28 + .14 * Math.sin(P.u * .5), fi: .2, d: C3.enquadrar(g, hx, hy + (larg ? 2 : 3.2), 5), al: [0, -.4, 0] }, g.t, .7); },
      sobre(g, S, K) {
        const larg = g.v.w >= 640;
        [[g.offA, 'Célula animal', 'de fora para dentro (centrípeta)'], [g.offB, 'Célula vegetal', 'de dentro para fora (centrífuga)']].forEach(([o, t1, t2]) => {
          if (!o) return; const a = C3.tela(g, add(o, [0, 6.6, 0])), b = C3.tela(g, add(o, [0, larg ? -6.4 : -7.6, 0]));
          K.tx(t1, a[0], Math.max(62, a[1]), { f: K.FTT, s: 15, w: 600, c: K.C.txt }); K.tx(t2, b[0], Math.min(K.H - 12, b[1]), { s: 13, c: K.C.dim });
        });
      }
    };
  });

  // ---------- crossing-over: quatro cromátides em volume, quiasma em destaque ----------
  C3.cena('meiose/crossing', K => {
    const pc = (nome, cor, frase) => ({ nome, cor, frase });
    const Lc = 13, top = Lc / 2, bot = -Lc / 2, yc = -Lc * .1, yA = Lc * .17, yB = -Lc * .34, yce = top - Lc * .13, sg = 1.2;
    const col = h => [-h - sg / 2, -h + sg / 2, h - sg / 2, h + sg / 2];
    const sp = 2.9, VV = [{ x: col(4.4), c: 0, hw: .2, j: 1, m: 0 }, { x: col(sg * 1.2), c: 0, hw: .2, j: 1, m: 0 }, { x: col(sg * 1.2), c: 1, hw: .2, j: 1, m: 0 }, { x: col(sg * 1.2), c: 1, hw: .07, j: 1, m: 1 }, { x: [-1.5, -.5, .5, 1.5].map(k => k * sp), c: 1, hw: .07, j: 0, m: 1 }];
    const MAT = K.C.mat, PAT = K.C.pat;
    return {
      fit: 40, vista: { th: -.2, fi: .12 },
      pecas: {
        irmas: pc('Cromátides-irmãs', '#9A6BFF', 'Cópias idênticas do mesmo cromossomo, unidas pelo centrômero.'),
        biv: pc('Bivalente', '#9A6BFF', 'Os dois homólogos pareados: 4 cromátides lado a lado, gene com gene.'),
        quiasma: pc('Quiasma', '#FFB347', 'Ponto onde duas cromátides não irmãs se cruzam. Ali ocorre a troca de pedaços.'),
        troca: pc('Trechos trocados', '#5CC8F0', 'Depois da troca, cada cromátide envolvida tem um pedaço materno e um paterno.')
      },
      rotulos: [{ pc: 'irmas', t: 'Cromátides-irmãs' }, { pc: 'biv', t: 'Bivalente: 4 cromátides lado a lado' }, { pc: 'quiasma', t: 'Quiasma' }, { pc: 'troca', t: 'Trechos trocados entre homólogos' }],
      montar(g) {
        const T = g.T, mk = c => C3.fis(g, c, { p: { roughness: .44, clearcoat: .6, clearcoatRoughness: .28, sheen: .55, sheenColor: new T.Color('#E6DCFF') }, rim: '#D2C2FF', rimK: .34 });
        g.cm = mk(MAT); g.cp = mk(PAT);
        g.up = [0, 1, 2, 3].map(k => C3.tubo(g, 40, g.q.cel ? 12 : 16, k < 2 ? g.cm : g.cp, null, g.pecas.biv));
        g.lo = [0, 1, 2, 3].map(k => C3.tubo(g, 40, g.q.cel ? 12 : 16, k < 2 ? g.cm : g.cp, null, g.pecas.biv));   // a parte de baixo segue a sua cromátide
        [...g.up, ...g.lo].forEach(t => g.pick.push(t.mesh));
        g.ban = C3.inst(g, C3.cilindro(g, 18), C3.fis(g, '#ffffff', { p: { roughness: .35, clearcoat: .8 }, rimK: .3 }), 8);
        g.cen = C3.inst(g, C3.esfera(g, 18), C3.fis(g, '#E6EEFF', { p: { roughness: .35, clearcoat: .8 } }), 2, null, g.pecas.irmas); g.pick.push(g.cen.m);
        g.qui = new T.Mesh(C3.esfera(g, 24), C3.emis(g, '#FFB347', 2.4, { transparent: true, opacity: .9 })); g.qui.userData.peca = g.pecas.quiasma; g.raiz.add(g.qui); g.pick.push(g.qui);
        g.quiR = new T.Mesh(new T.TorusGeometry(1, .06, 10, 48), C3.emis(g, '#FFB347', 1.8)); g.geos.push(g.quiR.geometry); g.raiz.add(g.quiR);
      },
      animar(g, P) {
        const i = P.i, A = VV[Math.max(0, i - 1)], B = VV[i], qv = i ? P.e : 1;
        const xs = B.x.map((b, k) => mix(A.x[k], b, qv)), c = mix(A.c, B.c, qv), hw = mix(A.hw, B.hw, qv) * Lc, j = mix(A.j, B.j, qv), m = mix(A.m, B.m, qv);
        const rr = (y0, y1) => y => cl((y1 - y) / (y1 - y0), 0, 1);   // 0 em cima da faixa, 1 embaixo
        const ramp = y => { const s = cl(((yc + hw) - y) / (2 * hw), 0, 1); return s * s * (3 - 2 * s); };
        const w = .5, n = 36, z0 = [-.2, .2, -.2, .2];
        for (let k = 0; k < 4; k++) {
          const other = k === 1 ? 2 : k === 2 ? 1 : k, cruza = k === 1 || k === 2;
          const U = [], L = [];
          for (let s = 0; s < n; s++) {
            const y = mix(top, yc, s / (n - 1)), r = cruza ? ramp(y) : 0, amt = c * (1 - m) * r, x = mix(xs[k], xs[other], amt);
            U.push([x, y, z0[k] + (cruza ? Math.sin(Math.PI * amt) * (k === 1 ? 1 : -1) * .5 : 0)]);
          }
          for (let s = 0; s < n; s++) {
            const y = mix(yc, bot, s / (n - 1)), r = cruza ? ramp(y) : 0, amt = c * (m + (1 - m) * r), x = mix(xs[k], xs[other], amt);
            L.push([x, y, z0[k] + (cruza ? Math.sin(Math.PI * amt) * (k === 1 ? 1 : -1) * .5 * (1 - m) : 0)]);
          }
          g.up[k].set(U, (ii, nn) => w * Math.sqrt(Math.max(.02, Math.min(1, ii / 3))));
          g.lo[k].set(L, (ii, nn) => w * Math.sqrt(Math.max(.02, Math.min(1, (nn - 1 - ii) / 3))));
          g.lo[k].pos = L;
        }
        // alelos: faixas claras em A/a (parte de cima) e B/b (parte de baixo, que viaja com a cromátide)
        for (let k = 0; k < 4; k++) {
          C3.put(g, g.ban, [xs[k], yA, z0[k]], null, w * 1.08, .42, w * 1.08, k < 2 ? '#E6DCFF' : '#D6F2FF', 1);
          const L = g.lo[k].pos, yi = Math.round((yc - yB) / (yc - bot) * (n - 1)), pB = L[Math.min(n - 1, yi)], dono = k;
          C3.put(g, g.ban, pB, null, w * 1.08, .42, w * 1.08, dono < 2 ? '#E6DCFF' : '#D6F2FF', 1);
          g.pB = g.pB || []; g.pB[k] = pB;
        }
        C3.fim(g.ban);
        for (let p = 0; p < 2; p++) C3.put(g, g.cen, [(xs[p * 2] + xs[p * 2 + 1]) / 2, yce, 0], null, Math.max(.001, .5 * j), .5 * j, .5 * j, '#E6EEFF', 1, g.pecas.irmas);
        C3.fim(g.cen);
        const qx = (xs[1] + xs[2]) / 2, ql = (i === 2 ? P.e : i === 3 ? 1 - P.e * .6 : 0), pul = RED() ? 1 : 1 + .15 * Math.sin(g.t * 3.2);
        g.qui.visible = g.quiR.visible = ql > .02; g.qui.position.set(qx, yc, 0); g.qui.scale.setScalar(.34 * ql * pul); g.quiR.position.set(qx, yc, 0); g.quiR.scale.setScalar(1.1 * ql * pul);
        g.xs = xs; g.yc = yc;
        if (i === 0) { g.vis.irmas = 1; g.anc.irmas = [(xs[0] + xs[1]) / 2, yce, .6]; }
        if (i === 1) { g.vis.biv = 1; g.anc.biv = [qx, -Lc * .22, .6]; }
        if (i === 2) { g.vis.quiasma = 1; g.anc.quiasma = [qx, yc, .6]; }
        if (i === 3) { g.vis.troca = 1; g.anc.troca = [xs[1], -Lc * .26, .6]; }
      },
      camera(g, P) { const hx = Math.max(7, Math.abs(g.xs ? g.xs[3] : 6) + 2.4), hy = Lc / 2 + 2.6; return C3.viva({ th: -.2 + .045 * P.u, fi: .1, d: C3.enquadrar(g, hx, hy, 3), al: [0, -.5, 0] }, g.t, .6); },
      sobre(g, S, K) {
        if (!g.xs) return; const xs = g.xs, X = K.X;
        const bd = (p, s, co) => { K.circ(p[0], p[1], 10, K.light(co, .62), 'rgba(11,15,28,.7)', 1.5); K.tx(s, p[0], p[1] + .5, { f: K.FTT, s: 13, w: 700, c: '#0B0F1C', bg: false }); };
        for (let k = 0; k < 4; k++) {
          const a = C3.tela(g, [xs[k], yA, 1.2]), b = C3.tela(g, add(g.pB[k], [0, 0, 1.2])), dono = k;
          bd([a[0] + 16, a[1]], k < 2 ? 'A' : 'a', k < 2 ? MAT : PAT); bd([b[0] + 16, b[1]], dono < 2 ? 'B' : 'b', dono < 2 ? MAT : PAT);
        }
        if (S.i < 4) { const a = C3.tela(g, [xs[1], top + .9, 0]), b = C3.tela(g, [xs[2], top + .9, 0]); K.tx('materno', a[0] - 4, a[1] - 6, { a: 'right', s: 13, c: K.light(MAT, .4) }); K.tx('paterno', b[0] + 4, b[1] - 6, { a: 'left', s: 13, c: K.light(PAT, .3) }); }
        if (S.i === 4) {
          X.globalAlpha = S.e; const nm = ['AB', 'Ab', 'aB', 'ab'];
          for (let k = 0; k < 4; k++) { const p = C3.tela(g, [xs[k], bot - 1.2, 0]); K.tx(nm[k], p[0], p[1], { f: K.FD, s: 14, w: 500, c: K.C.txt }); if (k === 0 || k === 3) K.tx('parental', p[0], p[1] + 20, { s: 13, c: K.C.dim }); }
          const m = C3.tela(g, [0, bot - 1.2, 0]); K.tx('recombinantes', m[0], m[1] + 20, { s: 13, w: 600, c: K.C.txt }); X.globalAlpha = 1;
        }
      }
    };
  });
})();
