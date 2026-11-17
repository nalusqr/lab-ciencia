/* LAB Citogenética: cenas 3D da gametogênese (Martin). A árvore abre já montada; o passo atual acende e a câmera se
   aproxima dele. Na ovogênese, ovogônia, ovócitos, corpúsculos polares e espermatozoide estão em escala real
   (1 unidade = 10 µm): o ovócito tem cerca de 100 µm, o corpúsculo polar cerca de 15 µm e a cabeça do espermatozoide cerca de 5 µm. */
'use strict';
(function () {
  if (!window.CITO3D) return;
  const C3 = CITO3D, { cl, mix, add, sub, mul, nrm, len, lerp3, hash, TAU } = C3.V;
  const RED = () => window.MOL3D && MOL3D.reduz;
  const pc = (nome, cor, frase) => ({ nome, cor, frase });

  // n: { id, row, x, r (raio no mundo), pl, ph, from, nm, kind: 'sp' | 'pb', sp (espermatozoide chegando) }
  function arvore(chave, cfg) {
    C3.cena(chave, K => {
      const c = cfg(K), N = c.nos, by = {}; N.forEach(n => { by[n.id] = n; });
      const pecas = {}, rot = [];
      N.forEach(n => { if (n.nm) { pecas[n.id] = pc(n.nm, n.kind === 'pb' ? '#F06AAE' : '#5CC8F0', c.frases[n.id] || ''); rot.push({ pc: n.id, t: n.nm }); } });
      let HZ = false; const pos = n => HZ ? [-c.rows[n.row] * (c.kx || 1), -n.x * c.hw, 0] : [n.x * c.hw, c.rows[n.row], 0], pRow = n => pecas[n.id] || pecas[(N.find(m => m.row === n.row && m.nm) || {}).id];
      return {
        fit: 60, vista: { th: 0, fi: .1 }, pecas, rotulos: rot,
        montar(g) {
          const T = g.T;
          g.nos = N.map(n => {
            const gr = new T.Group(); g.raiz.add(gr); gr.position.set(...pos(n)); const o = { n, gr };
            if (n.kind === 'sp') {
              o.cab = new T.Mesh(C3.esfera(g, 24), C3.fis(g, '#D7DEF2', { p: { roughness: .35, clearcoat: .8 }, rim: '#E0ECFF', rimK: .4 })); o.cab.userData.peca = pRow(n); gr.add(o.cab); g.pick.push(o.cab);
              o.acr = new T.Mesh(C3.esfera(g, 16), C3.fis(g, '#F7C13B', { p: { roughness: .4 } })); gr.add(o.acr);
              o.cau = C3.tubo(g, 44, 7, g._mCau || (g._mCau = C3.fis(g, '#CFE0FF', { p: { roughness: .4, clearcoat: .5 } })), gr);
            } else {
              o.m = new T.Mesh(C3.esfera(g, 48), C3.filme(g, n.kind === 'pb' ? '#F49AC8' : '#F06AAE', { cor2: '#FFD6EC', dentro: '#2A1E44', base: .04, fr: .55, esc: .5 / Math.max(.4, n.r) })); o.m.renderOrder = 3; o.m.userData.peca = pRow(n); gr.add(o.m); g.pick.push(o.m);
              o.nu = new T.Mesh(C3.lumpy(g, 'nuG', 7, 3, 5, .12, .4, .8), C3.fis(g, '#9A6BFF', { p: { roughness: .45, clearcoat: .6, sheen: .5, sheenColor: new T.Color('#E6DCFF') }, rim: '#D2C2FF', rimK: .32 })); gr.add(o.nu);
              if (n.zona) { o.z = new T.Mesh(C3.esfera(g, 48), C3.filme(g, '#E8E2FF', { cor2: '#FFFFFF', dentro: '#1A1A30', base: .02, fr: .38, esc: 1.2 })); o.z.renderOrder = 4; gr.add(o.z); }
              if (n.org) o.org = C3.inst(g, C3.lumpy(g, 'mito', 5, 2, 5, .25, .5, .9), C3.fis(g, '#C98A5A', { p: { roughness: .5 } }), 30, gr);
            }
            return o;
          });
          g.lin = C3.inst(g, C3.cilindro(g, 6), C3.fis(g, '#5B6C99', { p: { roughness: .5, transparent: true, opacity: .8 } }), 40);
          g.ext = C3.inst(g, C3.esfera(g, 20), C3.fis(g, '#D7DEF2', { p: { roughness: .35, clearcoat: .8 } }), 4);
          g.extC = C3.tubo(g, 44, 7, C3.fis(g, '#CFE0FF', { p: { roughness: .4 } }));
        },
        animar(g, P) {
          const i = P.i, e = P.e, t = g.t, red = RED();
          HZ = g.v.w >= 640;
          g.nos.forEach((o, j) => {
            o.gr.position.set(...pos(o.n)); o.gr.rotation.z = HZ && o.n.kind === 'sp' ? Math.PI / 2 : 0;
            const n = o.n, on = n.ph === i, k = on ? 1 : n.ph < i ? .62 : .45, pul = on && !red ? 1 + .012 * Math.sin(t * 2.4 + j) : 1;
            if (n.kind === 'sp') {
              const s = n.r; o.cab.scale.set(s * .55, s, s * .38); o.cab.material.color.set('#D7DEF2').multiplyScalar(k); o.acr.scale.set(s * .42, s * .45, s * .3); o.acr.position.set(0, s * .62, 0);
              const tl = []; for (let q = 0; q < 44; q++) { const f = q / 43, ph = red ? 0 : t * 5 + j; tl.push([Math.sin(f * 7 - ph) * s * .9 * f, -s - f * s * c.cauda, Math.cos(f * 5 - ph) * s * .3 * f]); }
              o.cau.set(tl, (ii, nn) => s * .12 * (1 - ii / nn * .7));
            } else {
              o.m.scale.setScalar(n.r * pul); const u = o.m.material.uniforms; u.uOp.value = k; u.uT.value = t; u.uSel.value = on ? .35 : 0;
              o.nu.scale.setScalar(n.r * (n.kind === 'pb' ? .5 : .32)); o.nu.position.set(n.r * .12, n.r * .05, n.r * .2); o.nu.material.color.set('#9A6BFF').multiplyScalar(k); o.nu.rotation.y = t * .1;
              if (o.z) { o.z.scale.setScalar(n.r * 1.14); o.z.material.uniforms.uOp.value = k; }
              if (o.org) { for (let q = 0; q < 30; q++) { const z0 = hash(q + j * 31, 1) * 2 - 1, an = hash(q + j * 31, 2) * TAU, sq = Math.sqrt(1 - z0 * z0), rr = n.r * (.45 + .45 * hash(q, 3)); g._e.set(an, z0, q); g._q.setFromEuler(g._e); C3.put(g, o.org, [sq * Math.cos(an) * rr, sq * Math.sin(an) * rr, z0 * rr], g._q, n.r * .025, n.r * .06, n.r * .025, '#C98A5A', .7 * k); } C3.fim(o.org); }
            }
            if (n.nm) { g.vis[n.id] = 1; const p = pos(n); g.anc[n.id] = add(p, !HZ && n.kind === 'pb' ? [n.r + .6, -n.r - .9, 0] : !HZ && n.r >= 5 ? [-n.r * .6, n.r * .8, n.r * .3] : [0, (n.kind === 'sp' ? n.r * .6 : n.r) + .15, n.kind === 'sp' ? 0 : n.r * .3]); }
          });
          // ligações entre mãe e filhas
          N.forEach(n => { if (!n.from) return; const p = by[n.from], a = pos(p), b = pos(n), d = nrm(sub(b, a)), r1 = p.r + .25, r2 = (n.kind === 'sp' ? n.r * 1.2 : n.r) + .25; if (len(sub(b, a)) < r1 + r2) return; C3.bastao(g, g.lin, add(a, mul(d, r1)), sub(b, mul(d, r2)), c.lw || .06, '#5B6C99', n.ph <= i ? 1 : .55); });
          C3.fim(g.lin);
          // espermatozoide chegando ao óvulo (ovogênese)
          const alvo = N.find(n => n.sp);
          if (alvo) {
            const q = alvo.ph === i ? e : alvo.ph < i ? 1 : 0, a = pos(alvo), s = c.spR, x = a[0] - alvo.r - s * .8 - mix(c.spLong, .1, q);
            if (HZ) { const y0 = a[1] + alvo.r + s * .8 + mix(c.spLong, .1, q); C3.put(g, g.ext, [a[0], y0, 0], null, s * .55, s, s * .38, '#D7DEF2', 1); C3.fim(g.ext); const tl = []; for (let k = 0; k < 44; k++) { const f = k / 43, ph = red ? 0 : t * 6; tl.push([a[0] + Math.sin(f * 7 - ph) * s * .9 * f, y0 + s + f * s * c.cauda, Math.cos(f * 5 - ph) * s * .3 * f]); } g.extC.set(tl, (ii, nn) => s * .12 * (1 - ii / nn * .7)); return; }
            C3.put(g, g.ext, [x, a[1] + alvo.r * .05, 0], g._q.setFromAxisAngle(g._v1.set(0, 0, 1), Math.PI / 2), s * .55, s, s * .38, '#D7DEF2', 1); C3.fim(g.ext);
            const tl = []; for (let k = 0; k < 44; k++) { const f = k / 43, ph = red ? 0 : t * 6; tl.push([x - s - f * s * c.cauda, a[1] + alvo.r * .05 + Math.sin(f * 7 - ph) * s * .9 * f, Math.cos(f * 5 - ph) * s * .3 * f]); }
            g.extC.set(tl, (ii, nn) => s * .12 * (1 - ii / nn * .7));
          } else g.extC.mesh.visible = false;
        },
        camera(g, P) {
          const rows = c.rows, yi = rows[cl(P.i, 0, 4)], span = (rows[0] - rows[4]) / 2 + c.pad, ym = (rows[0] + rows[4]) / 2;
          if (HZ) { const d = C3.enquadrar(g, span * (c.kx || 1) + 1, c.hx * .8 + 1.5, 4); return C3.viva({ th: -.06 + .03 * Math.sin(P.u), fi: .08, d, al: [-mix(ym, yi, .06) * (c.kx || 1), c.aly || 0, 0] }, g.t, .5); }
          const d = C3.enquadrar(g, c.hx, span + 1.5, 4);
          return C3.viva({ th: -.08 + .04 * Math.sin(P.u), fi: .08, d, al: [c.alx || 0, mix(ym, yi, .06) + .6, 0] }, g.t, .5);
        },
        sobre(g, S, K) {
          const X = K.X;
          g.nos.forEach(o => { const n = o.n; if (n.kind === 'sp' || !n.pl || !(n.r >= 1.2 || HZ)) return; const p = C3.tela(g, add(pos(n), [n.r * .12, n.r * .05, n.r * .5])); K.tx(n.pl, p[0], p[1], { f: K.FD, s: 12, w: 600, c: '#fff' }); });
          c.PL.forEach(([row, s, ph]) => { const a = ph < S.i ? 1 : ph === S.i ? S.e : .35, m = (c.rows[row] + c.rows[row + 1]) / 2, st = { s: HZ ? 13 : 12, w: ph === S.i ? 600 : 400, c: ph === S.i ? K.C.txt : K.C.dim }; X.globalAlpha = Math.max(.35, a);
            if (HZ) { const x = C3.tela(g, [-m * (c.kx || 1), 0, 0])[0]; K.tx(s, x, K.H - 44, st); } else { const y = C3.tela(g, [0, m, 0])[1] + 14; K.tx(s, K.W - 14, y, Object.assign({ a: 'right' }, st)); } X.globalAlpha = 1; });
          if (c.escala) { const [u, s] = c.escala, a = C3.tela(g, [0, 0, 0]), b = C3.tela(g, [u, 0, 0]), w = Math.abs(b[0] - a[0]), x = 16, y = K.H - 18; X.lineCap = 'butt'; K.line(x, y, x + w, y, '#E8EDF7', 2); K.line(x, y - 5, x, y + 5, '#E8EDF7', 1.5); K.line(x + w, y - 5, x + w, y + 5, '#E8EDF7', 1.5); K.tx(s, x + w + 8, y, { a: 'left', s: 12.5, c: K.C.dim }); }
        }
      };
    });
  }

  arvore('gametogenese/espermatogenese', K => ({
    hw: 8, rows: [10.5, 5.2, 0, -5.2, -10.5], hx: 9.5, pad: 3.6, alx: -.4, cauda: 4.5, kx: 1.35,
    nos: [{ id: 'a', row: 0, x: 0, r: 1.25, pl: '2n', ph: 0, nm: 'Espermatogônia', org: 1 }, { id: 'b', row: 1, x: 0, r: 1.75, pl: '2n', ph: 1, from: 'a', nm: 'Espermatócito I', org: 1 },
      { id: 'c1', row: 2, x: -.38, r: 1.3, pl: 'n', ph: 2, from: 'b', nm: 'Espermatócitos II', org: 1 }, { id: 'c2', row: 2, x: .38, r: 1.3, pl: 'n', ph: 2, from: 'b', org: 1 },
      { id: 'd1', row: 3, x: -.6, r: .95, pl: 'n', ph: 3, from: 'c1', nm: 'Espermátides', org: 1 }, { id: 'd2', row: 3, x: -.2, r: .95, pl: 'n', ph: 3, from: 'c1', org: 1 }, { id: 'd3', row: 3, x: .2, r: .95, pl: 'n', ph: 3, from: 'c2', org: 1 }, { id: 'd4', row: 3, x: .6, r: .95, pl: 'n', ph: 3, from: 'c2', org: 1 },
      { id: 'e1', row: 4, x: -.6, r: .7, kind: 'sp', ph: 4, from: 'd1', nm: 'Espermatozoides' }, { id: 'e2', row: 4, x: -.2, r: .7, kind: 'sp', ph: 4, from: 'd2' }, { id: 'e3', row: 4, x: .2, r: .7, kind: 'sp', ph: 4, from: 'd3' }, { id: 'e4', row: 4, x: .6, r: .7, kind: 'sp', ph: 4, from: 'd4' }],
    PL: [[0, 'mitoses e crescimento', 1], [1, 'meiose I', 2], [2, 'meiose II', 3], [3, 'espermiogênese', 4]],
    frases: {
      a: 'Célula 2n da parede do túbulo seminífero. Divide-se por mitose durante toda a vida reprodutiva.',
      b: 'Cresce, duplica o DNA e entra em meiose. É a maior célula da linhagem.',
      c1: 'Resultado da meiose I: duas células n, com cromossomos ainda duplicados.',
      d1: 'Resultado da meiose II: quatro células n, de tamanhos iguais.',
      e1: 'Cada espermátide perde citoplasma, ganha acrossomo e flagelo: são quatro espermatozoides n.'
    }
  }));

  // ovogênese em escala real: 1 unidade = 10 µm
  arvore('gametogenese/ovogenese', K => ({
    hw: 14, rows: [24, 12.5, 0, -12.5, -25], hx: 17.5, pad: 6, alx: 1.5, cauda: 9, spR: .3, spLong: 9, lw: .12,
    escala: [10, '100 µm'],
    nos: [{ id: 'a', row: 0, x: -.45, r: 1, pl: '2n', ph: 0, nm: 'Ovogônia', org: 1 }, { id: 'b', row: 1, x: -.45, r: 5, pl: '2n', ph: 1, from: 'a', nm: 'Ovócito I', org: 1 },
      { id: 'c', row: 2, x: -.45, r: 5, pl: 'n', ph: 2, from: 'b', nm: 'Ovócito II', zona: 1, org: 1 }, { id: 'p1', row: 2, x: .45, r: .75, kind: 'pb', ph: 2, from: 'b', nm: '1º corpúsculo polar' },
      { id: 'd', row: 3, x: -.45, r: 5, pl: 'n', ph: 3, from: 'c', nm: 'Ovócito II ovulado', zona: 1, org: 1 },
      { id: 'f', row: 4, x: -.45, r: 5, pl: 'n', ph: 4, from: 'd', nm: 'Óvulo', sp: 1, zona: 1, org: 1 }, { id: 'p2', row: 4, x: .45, r: .75, kind: 'pb', ph: 4, from: 'd', nm: '2º corpúsculo polar' }],
    PL: [[0, 'mitoses e crescimento', 1], [1, 'meiose I', 2], [2, 'ovulação', 3], [3, 'fecundação e meiose II', 4]],
    frases: {
      a: 'Célula 2n do ovário fetal, com cerca de 20 µm. Multiplica-se por mitose só antes do nascimento.',
      b: 'Cresce até cerca de 100 µm acumulando citoplasma e reservas, e fica parado na prófase I por anos.',
      c: 'A meiose I é desigual: quase todo o citoplasma fica no ovócito II (n).',
      p1: 'Célula pequena, de cerca de 15 µm, com um conjunto de cromossomos e quase nada de citoplasma. Degenera.',
      d: 'É liberado do ovário parado na metáfase II, envolto pela zona pelúcida.',
      f: 'A meiose II só termina com a entrada do espermatozoide. Repare na escala: a cabeça do espermatozoide tem cerca de 5 µm.',
      p2: 'Segundo corpúsculo polar, também pequeno. De uma célula sai só um óvulo.'
    }
  }));
})();
