/* LAB Origem da vida e evolução: especiação alopátrica em 3D (Martin), sobre o kit do módulo Vírus (vir3d.js), as peças da
   Anatomia (anat3d-pecas.js) e as deste módulo (evo3d-pecas.js).
   Um terreno com uma população de uma cor só; uma cordilheira sobe e divide o grupo, o fluxo gênico para, cada lado muda de tom
   (azul de um lado, laranja do outro), a cordilheira se desgasta, os grupos se misturam de novo e já não cruzam: duas espécies.
   Mesmo tempo e mesmas cores do desenho plano, que continua escondido cuidando da legenda; a montagem continua no plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.anCena) return;
  const { cl, seg, sst, mix: mx, hash } = V3.V;
  const RED = () => V3.REDUZ(), ach = V3.ach, cm = V3.corMix;
  const TOM0 = '#9FE3F5', AZ = '#4B7BFF', LA = '#FF9A3C', SOLO = '#8A6A4A';
  const PD = (() => { const r = rng(5), L = []; for (let i = 0; i < 30; i++) L.push([r(), r(), r(), r()]); return L; })();
  const LX = 7, LZ = 4.4;
  const PE = {
    barreira: { nome: 'Barreira geográfica', frase: 'Uma cordilheira, um rio ou o mar que sobe separa a população em dois grupos que não se encontram mais.', cor: SOLO },
    ind: { nome: 'Indivíduo', frase: 'A cor representa o conjunto de genes. Separados, os dois grupos acumulam mutações diferentes e sofrem seleção e deriva diferentes.', cor: TOM0 },
    par: { nome: 'Encontro sem cruzamento', frase: 'Sem a barreira os grupos voltam a se encontrar, mas já não cruzam ou não deixam filhos férteis: isolamento reprodutivo.', cor: '#FF6B7D' }
  };
  const E = [['isolamento', .08], ['diferenciação', .3], ['isolamento reprodutivo', .8]];
  // altura da cordilheira em (x, z) com altura k (0 a 1)
  const crista = (x, z, k) => { if (k <= 0) return 0; const w = .32 + .12 * V3.V.vnoise(z * 1.4, 3, 1), a = (.7 + .6 * V3.V.vnoise(z * 1.7, 7, 2)) * (1 + .25 * Math.sin(z * 5.3)); return k * 1.55 * a * Math.exp(-(x / w) * (x / w)) * cl(1.2 - Math.abs(z) / (LZ * .5) * .3, 0, 1); };

  V3.anCena('especiacao/modos', {
    fit: 9, raio: 5, bolas: 80, pecas: PE,
    so2D: S => S.modo === 'monte',
    rotulos: [{ pc: 'barreira', t: 'cordilheira', pr: 1 }, { pc: 'ind', t: 'população', pr: 2 }, { pc: 'par', t: 'não cruzam mais', pr: 1 }],
    montar(g) {
      const T = g.T, nx = g.q.cel ? 56 : 84, nz = g.q.cel ? 34 : 52, geo = new T.PlaneGeometry(LX, LZ, nx, nz); geo.rotateX(-Math.PI / 2);
      g.base = Float32Array.from(geo.attributes.position.array);
      const mat = new T.MeshPhysicalMaterial({ color: '#FFFFFF', roughness: .82, clearcoat: .1, side: T.DoubleSide }); g.mats.push(mat);
      g.ter = V3.evCorVert(g, geo, mat); g.ter.position.y = -.05; g.raiz.add(g.ter); g.ter.userData.peca = g.pecas.barreira; g.pick.push(g.ter);
      // borda do bloco de terra
      const bd = new T.Mesh(new T.BoxGeometry(LX, .35, LZ), V3.fis(g, '#3A2F22', { p: { roughness: .9 } })); g.geos.push(bd.geometry); bd.position.y = -.42; g.raiz.add(bd);
      g.bs = V3.evBichos(g, 40, 'ind');
      g.xm = V3.inst(g, V3.cilindro(g, 8), V3.fis(g, '#FF6B7D', { p: { roughness: .4 } }), 8, null, g.pecas.par); g.pick.push(g.xm.m);
      g.kAnt = -1;
    },
    animar(g, P) {
      const S = P.S, rv = !RED(), t = P.t, info = g.pecas, p = ciclo(Math.max(0, lt(S)), 14);
      const mont = sst(0, 1, seg(p, .08, .28)) * (1 - sst(0, 1, seg(p, .74, .82))), d = sst(0, 1, seg(p, .3, .7)), mist = sst(0, 1, seg(p, .8, .9)), ban = sst(0, 1, seg(p, .88, .97));
      if (Math.abs(mont - g.kAnt) > .004) { g.kAnt = mont; terreno(g, mont); }
      const alt = (x, z) => crista(x, z, mont) + .02 * Math.sin(x * 2.1 + z * 1.3);
      PD.forEach((q, i) => {
        const lado = i % 2, u0 = lado ? .56 + q[0] * .38 : .06 + q[0] * .38, v0 = .1 + q[1] * .8, u = mx(u0, .05 + q[2] * .9, mist), v = mx(v0, .1 + q[3] * .8, mist);
        const x = (u - .5) * LX * .94, z = (v - .5) * LZ * .9, ph = hash(i, 3) * 6.28, pula = rv ? Math.max(0, Math.sin(t * 3 + ph)) * .06 : 0;
        V3.evBicho(g, g.bs, [x, alt(x, z), z], .15, ph + (rv ? Math.sin(t * .4 + i) * .3 : 0), cm(TOM0, lado ? LA : AZ, d), info.ind, pula);
        if (i === 6) ach(g, 'ind', [x, .45, z]);
      });
      // encontro: três pares que não cruzam mais
      if (ban > .02) {
        for (let k = 0; k < 3; k++) {
          const z = -1.1 + k * 1.1, s = .17 * ban;
          V3.evBicho(g, g.bs, [-.32, 0, z], s, 0, cm(TOM0, AZ, d), info.par); V3.evBicho(g, g.bs, [.32, 0, z], s, Math.PI, cm(TOM0, LA, d), info.par);
          [-1, 1].forEach(j => { g._q.setFromEuler(g._e.set(0, 0, j * .785)); V3.put(g, g.xm, [0, .32, z], g._q, .025 * ban, .32 * ban, .025 * ban, '#FF6B7D', 1, info.par); });
        }
        ach(g, 'par', [0, .7, -1.1]);
      }
      V3.evFimBichos(g.bs); V3.fim(g.xm);
      g.vis.barreira = false; if (mont > .4) ach(g, 'barreira', [0, crista(0, .3, mont) + .15, .3]);
      if (mont > .5 && d < .6) V3.ficha(g, [0, crista(0, 1.4, mont) + .2, 1.4], 'fluxo gênico interrompido', '#E8EDF7', { pr: 2 });
      if (d > .5 && mist < .5) { V3.ficha(g, [-2.2, .4, 1.9], 'mudou para azul', AZ, { pr: 3, dy: 1 }); V3.ficha(g, [2.2, .4, 1.9], 'mudou para laranja', LA, { pr: 3, dy: 1 }); }
    },
    sobre(g, S) {
      if (S.modo !== 'alo') return;
      const A = area(), p = ciclo(Math.max(0, lt(S)), 14), w = Math.min(A.w, 560), x0 = A.x0;
      E.forEach(([n, a], i) => { const on = p >= a, x = x0 + i * (w / 3); rr(x + 3, A.y0 + 2, w / 3 - 6, 28, 8, on ? 'rgba(42,159,201,.3)' : 'rgba(19,26,43,.85)', on ? '#2A9FC9' : 'rgba(42,159,201,.4)', on ? 2 : 1); tx(NAR && i === 2 ? 'isol. reprodutivo' : n, x + w / 6, A.y0 + 16.5, { s: NAR ? 12 : 13, w: 600, c: on ? C.txt : C.dim, bg: false }); });
      V3.reserva(g, [x0, A.y0 - 2, w, 36]);
    },
    camera(g, P) { const d = V3.deitado(g); return V3.anCam(g, P, d ? 3.7 : 3.1, d ? 2.1 : 2.8, { al: [0, .1, 0], th: .22, fi: .62, viva: .3 }); }
  });

  function terreno(g, k) {
    const geo = g.ter.geometry, pA = geo.attributes.position, B = g.base, rg = V3.evRgb, mr = V3.evMixRgb;
    const verde = rg('#4E7A3E'), verde2 = rg('#6C9448'), rocha = rg(SOLO), cume = rg('#C9CED8');
    for (let i = 0; i < pA.count; i++) { const x = B[i * 3], z = B[i * 3 + 2]; pA.setY(i, crista(x, z, k) + .02 * Math.sin(x * 2.1 + z * 1.3)); }
    pA.needsUpdate = true; geo.computeVertexNormals();
    V3.evPinta(geo, (x, y, z) => { const n = V3.V.vnoise(x * 2, 1, z * 2); let c = mr(verde, verde2, n); c = mr(c, rocha, cl(y / .35, 0, 1)); return mr(c, cume, cl((y - 1.05) / .3, 0, 1)); });
  }
})();
