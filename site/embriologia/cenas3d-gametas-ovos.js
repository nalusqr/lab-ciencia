/* LAB Embriologia: cenas 3D de gametas e ovos (Martin). Gametogênese em duas árvores com células de volume e meioses
   sincronizadas; ovo em corte com o vitelo distribuído conforme o tipo; três trilhas de desenvolvimento (ave, anfíbio,
   mamífero) com os medidores de reserva. Usa o kit embrio3d.js; a cena 2D antiga fica como plano B sem WebGL. */
'use strict';
(function () {
  const E3 = window.EMB3D; if (!E3) return;
  const { V, K } = E3, { cl, mix, seg, sst, TAU, hash } = V;
  const cam = (g, P, hx, hy, o = {}) => E3.viva({ th: o.th || 0, fi: o.fi == null ? .1 : o.fi, d: E3.enquadrar(g, hx, hy) * (o.k || 1.04), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .6 : o.viva);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };

  // =====================================================================================
  // GAMETAS: duas árvores, meiose I e meiose II ao mesmo tempo nos dois lados
  // =====================================================================================
  E3.cena('gametas/resumo', {
    fit: 30, raio: 10, bolas: 60,
    pecas: {
      ec1: { nome: 'Espermatócito primário', frase: 'Célula diploide (2n) do túbulo seminífero que entra em meiose; dela saem 4 espermatozoides.', cor: K.esperma },
      ec2: { nome: 'Espermatócitos secundários', frase: 'Saem da meiose I, já haploides (n); cada um faz a meiose II e forma 2 espermátides.', cor: K.esperma },
      esp: { nome: 'Espermatozoides', frase: 'As 4 espermátides se transformam em espermatozoides (espermiogênese): cabeça com acrossomo, peça intermediária e cauda.', cor: K.esperma },
      oc1: { nome: 'Ovócito primário', frase: 'Fica parado na prófase I desde a vida fetal até a puberdade. A divisão do citoplasma é desigual.', cor: K.ovo },
      oc2: { nome: 'Ovócito secundário', frase: 'É ele que sai do ovário na ovulação, parado na metáfase II. A meiose II só termina se um espermatozoide entrar.', cor: K.ovo },
      pol: { nome: 'Corpúsculos polares', frase: 'Células pequenas, quase sem citoplasma, que recebem a outra metade dos cromossomos e degeneram.', cor: K.polar },
      zona: { nome: 'Zona pelúcida', frase: 'Camada de glicoproteínas em volta do ovócito; o espermatozoide precisa atravessá-la.', cor: '#C9D6FF' }
    },
    rotulos: [{ pc: 'ec1', t: 'espermatócito primário' }, { pc: 'esp', t: 'espermatozoides' }, { pc: 'oc1', t: 'ovócito primário' }, { pc: 'oc2', t: 'ovócito secundário' }, { pc: 'pol', t: 'corpúsculo polar' }],
    montar(g) {
      g.pl = E3.corte(g, g.raiz);
      g.W = E3.celulas(g, 12, { nucleo: true, p: { transparent: true, opacity: .58, depthWrite: false, roughness: .3, clearcoat: .8 } }); g.W.m.renderOrder = 3;
      g.lig = E3.inst(g, E3.cilindro(g, 8), E3.fis(g, '#7F8BA8', { p: { roughness: .6 } }), 16);
      g.esp = E3.espermas(g, 5, { pc: 'esp' });
      g.ovo = E3.ovocito(g, { pc: 'oc2', pcZ: 'zona' });
    },
    animar(g, P) {
      const larg = E3.deitado(g), L = larg ? 1 : .64, cx = larg ? 5.6 : 3.3, ys = [4.3, 0, -4.4];
      const tau = E3.REDUZ() ? 9 : P.t % 12, k1 = sst(1, 3, tau), k2 = sst(4.5, 6.8, tau), W = g.W, t = P.t;
      const liga = (a, b, k) => { if (k > .02) E3.bastao(g, g.lig, a, V.lerp3(a, b, k), .045, '#8E9AB8', .9); };
      // espermatogênese: divisões iguais
      const p0 = [-cx, ys[0], 0], p1 = [[-cx - 1.7 * L, ys[1], 0], [-cx + 1.7 * L, ys[1], 0]];
      E3.celula(g, W, p0, 1.05 * L + .1, K.esperma, { n: .45, pc: g.pecas.ec1 }); ach(g, 'ec1', [-cx + 1.1 * L, ys[0] - .5, 0]);
      p1.forEach(p => { liga(p0, p, k1); if (k1 > .01) E3.celula(g, W, V.lerp3(p0, p, k1), (.82 * L + .08) * mix(.6, 1, k1), K.esperma, { n: .42, pc: g.pecas.ec2 }); });
      for (let i = 0; i < 4; i++) {
        const pai = p1[i < 2 ? 0 : 1], alvo = [-cx + (i - 1.5) * 1.15 * L, ys[2] + .4, 0];
        if (k2 > .02) liga(pai, alvo, k2);
        g.esp.pos(i, V.lerp3(pai, alvo, k2), [Math.sin(i * 1.7) * .15, 1, 0], t + i * .7, k2 * .95 * (L * .8 + .2), { acro: 1 });
      }
      if (k2 > .5) ach(g, 'esp', [-cx, ys[2] + 1.2, 0]);
      // ovogênese: divisões desiguais; a meiose II só termina com o espermatozoide
      const q0 = [cx - .3 * L, ys[0], 0], q1 = [cx - .3 * L, ys[1], 0], pb1 = [cx + 2 * L + .2, ys[1] + .5, 0];
      E3.celula(g, W, q0, 1.55 * L + .15, K.ovo, { n: .3, pc: g.pecas.oc1 }); ach(g, 'oc1', [cx + 1.3 * L, ys[0] - .6, 0]);
      liga(q0, q1, k1); liga(q0, pb1, k1);
      if (k1 > .01) {
        E3.celula(g, W, V.lerp3(q0, q1, k1), (1.45 * L + .15) * mix(.85, 1, k1), K.ovo, { n: .26, pc: g.pecas.oc2 });
        E3.celula(g, W, V.lerp3(q0, pb1, k1), (.36 * L + .06) * k1, K.polar, { pc: g.pecas.pol });
        if (k1 > .6) { ach(g, 'pol', pb1); ach(g, 'oc2', [q0[0] + (q1[0] - q0[0]) * k1 - 1.45 * L, q0[1] + (q1[1] - q0[1]) * k1 + .9, 0]); }
      }
      const q2 = [cx - .3 * L, ys[2], 0], so = (1.2 * L + .12) * k2;
      liga(q1, q2, k2); g.ovo.gr.visible = k2 > .02; g.ovo.gr.position.set(q2[0], q2[1], q2[2]); g.ovo.gr.scale.setScalar(Math.max(.01, so));
      const ch = sst(.3, .9, k2), dE = V.nrm([1, -1, 0]), pE = V.add(q2, V.mul(dE, -so * mix(2.6, 1.32, ch)));
      g.esp.pos(4, pE, dE, t, k2 * (L * .7 + .2), { acro: 1 - sst(.85, 1, k2) * .7 });
      if (k2 > .02) {
        const pbA = [cx + 2 * L + .2, ys[2] + .9, 0];
        liga(pb1, pbA, k2); E3.celula(g, W, pbA, (.32 * L + .05) * k2, K.polar, { pc: g.pecas.pol });
        const sai = sst(.85, 1, k2); if (sai > 0) E3.celula(g, W, V.add(q2, [so * .8, -so * .85, .1]), (.28 * L + .05) * sai, K.polar, { pc: g.pecas.pol });
        if (sai > .5) E3.texto(g, [q2[0], q2[1] - so - .6, 0], 'ovócito fecundado', { s: 12, c: C.dim });
      }
      E3.fim(g.lig); E3.fimCel(W);
      const fs = larg ? 15 : 13;
      E3.texto(g, [-cx, ys[0] + 2.9, 0], 'Espermatogênese', { f: FH, s: fs, c: K.esperma });
      E3.texto(g, [cx, ys[0] + 2.9, 0], 'Ovogênese', { f: FH, s: fs, c: '#DCE1EC' });
      E3.texto(g, [0, (ys[0] + ys[1]) / 2, 0], 'meiose I', { s: 12, c: C.dim, al: k1 > .05 ? 1 : .5 });
      E3.texto(g, [0, (ys[1] + ys[2]) / 2, 0], 'meiose II', { s: 12, c: C.dim, al: k2 > .05 ? 1 : .5 });
    },
    camera(g, P) { return cam(g, P, E3.deitado(g) ? 8.8 : 5.6, 8.2, { al: [0, -.8, 0] }); }
  });

  // =====================================================================================
  // OVOS: tipos (ovo em corte; a faixa muda a quantidade de vitelo e onde ele fica)
  // =====================================================================================
  const TIPO = {
    oligo: ['Oligolécito', 'pouco vitelo, espalhado por igual', 'segmentação holoblástica igual'],
    hetero: ['Heterolécito', 'vitelo médio, no polo vegetativo', 'segmentação holoblástica desigual'],
    telo: ['Telolécito', 'muito vitelo; citoplasma só na cicatrícula', 'segmentação meroblástica discoidal'],
    centro: ['Centrolécito', 'vitelo no centro, citoplasma em volta', 'segmentação meroblástica superficial']
  };
  E3.cena('ovos/tipos', {
    fit: 14, raio: 5, bolas: 160,
    pecas: {
      cit: { nome: 'Citoplasma', frase: 'Parte ativa da célula-ovo, onde ficam o núcleo e as organelas. Onde há pouco vitelo, as divisões são mais rápidas.', cor: K.ovo },
      vit: { nome: 'Vitelo', frase: 'Reserva de proteínas e lipídios que alimenta o embrião. Quanto mais vitelo, mais ele atrapalha as divisões.', cor: K.vitelo },
      nuc: { nome: 'Núcleo', frase: 'Fica no citoplasma livre de vitelo: no centro do oligolécito, perto do polo animal no heterolécito e na cicatrícula do telolécito.', cor: K.nucleo },
      cic: { nome: 'Cicatrícula', frase: 'Disco germinativo: o pouco citoplasma com o núcleo, por cima da gema. Só ele se divide (segmentação discoidal).', cor: '#F3EEE4' }
    },
    rotulos: [{ pc: 'vit', t: 'vitelo' }, { pc: 'nuc', t: 'núcleo' }, { pc: 'cit', t: 'citoplasma' }, { pc: 'cic', t: 'cicatrícula' }],
    montar(g) {
      const T = g.T, R = 3; g.R = R;
      g.pl = E3.corte(g, g.raiz); g.plv = E3.corte(g, g.raiz, [0, -1, 0], 0);
      const sf = E3.esfera(g, g.q.cel ? 40 : 56);
      g.ovo = E3.solido(g, sf, K.ovo, [g.pl], { pc: 'cit', corte: '#E6E9F0', kc: 1, m: { p: { roughness: .5, sheen: .7, sheenColor: new T.Color('#FFFFFF') } } });
      g.vit = E3.solido(g, sf, K.vitelo, [g.pl, g.plv], { pc: 'vit', corte: '#EBA94C', kc: 1, m: { p: { roughness: .55 } } });
      g.ilha = E3.solido(g, sf, K.ovo, [g.pl], { pc: 'cit', corte: '#EEF0F5', kc: 1 });
      g.cic = E3.solido(g, sf, '#F3EEE4', [g.pl], { pc: 'cic', corte: '#F6F1E8', kc: 1 });
      g.nuc = E3.solido(g, sf, K.nucleo, [g.pl], { pc: 'nuc', corte: '#B591FF', kc: 1 });
    },
    animar(g, P) {
      const S = P.S, R = g.R, cen = !!S.cen, v = S.v, u = cl((v - 25) / 75, 0, 1), us = u * u * (3 - 2 * u);
      const tipo = cen ? 'centro' : v < 25 ? 'oligo' : v < 70 ? 'hetero' : 'telo'; g.tipo = tipo;
      const ex = cen ? [1.3, .72, .95] : [1, 1, 1];
      g.ovo.scale.set(R * ex[0], R * ex[1], R * ex[2]);
      const f = cen ? 0 : v < 25 ? 0 : v < 70 ? mix(.22, .62, (v - 25) / 45) : mix(.9, .95, (v - 70) / 30), lvl = -R + 2 * R * f;
      g.plv.reg.c = cen ? 99 : lvl;
      g.vit.visible = cen || f > 0; g.ilha.visible = cen; g.cic.visible = !cen && v >= 70;
      if (cen) { g.vit.scale.set(R * 1.3 * .82, R * .72 * .76, R * .95 * .8); g.ilha.scale.setScalar(R * .2); }
      else g.vit.scale.setScalar(R * .975);
      const ny = cen ? 0 : f > 0 ? (R + lvl) / 2 : 0, nr = cen ? R * .1 : R * mix(.16, .06, us);
      g.nuc.position.set(0, ny, cen ? .02 : 0); g.nuc.scale.setScalar(nr);
      if (g.cic.visible) { const ys = R * .9; g.cic.position.set(0, ys, 0); g.cic.scale.set(R * .42, R * .1, R * .42); g.nuc.position.set(0, ys + .02, 0); }
      // grânulos de vitelo: espalhados no oligolécito, densos dentro da massa nos outros
      const uni = cen ? 0 : v < 25 ? .25 + v / 25 * .6 : Math.max(0, 1 - (v - 25) / 15);
      for (let i = 0; i < 110; i++) {
        const a = hash(i, 1) * TAU, d = Math.sqrt(hash(i, 2)) * R * .9, x = Math.cos(a) * d, y = Math.sin(a) * d, z = -.06 - hash(i, 3) * .25;
        if (uni > 0 && i < 80) E3.bola(g, [x, y, z], R * (.018 + .014 * hash(i, 4)) * uni + .01, K.vitelo, 1, g.pecas.vit);
        const den = cen ? Math.hypot(x / 1.05, y / .55) < R * .95 : (f > 0 && y < lvl - .1);
        if (den) E3.bola(g, [cen ? x * 1.05 : x, cen ? y * .55 : y, z], R * (.022 + .018 * hash(i, 5)), '#C9822F', 1, g.pecas.vit);
      }
      if (v < 70 || cen) ach(g, 'cit', cen ? [-R * 1.12, R * .1, 0] : f > 0 && v < 70 ? [-R * .55, R * .62, 0] : [-R * .62, R * .3, 0]);
      if (cen || f > 0) ach(g, 'vit', cen ? [R * .55, -R * .15, 0] : [R * .4, (lvl - R) / 2, 0]);
      ach(g, 'nuc', g.nuc.position.toArray());
      if (g.cic.visible) ach(g, 'cic', [-R * .38, R * .92, 0]);
      if (tipo === 'hetero') { E3.texto(g, [0, R + .8, 0], 'polo animal', { s: 12, c: C.dim }); E3.texto(g, [0, -R - .55, 0], 'polo vegetativo', { s: 12, c: C.dim }); }
    },
    camera(g, P) { const k = g.tipo === 'centro' ? 1.3 : 1; return cam(g, P, g.R * 1.25 * k + .6, g.R * 1.35, { th: .3, fi: .08, al: [0, E3.deitado(g) ? 0 : -.6, 0] }); },
    sobre(g) {
      const T = TIPO[g.tipo || 'oligo'], x = NAR ? 12 : 28, y = NAR ? 58 : 82;
      tx(T[0], x, y, { f: FH, s: NAR ? 16 : 19, w: 600, a: 'left', c: C.txt });
      tx(T[1], x, y + (NAR ? 21 : 25), { s: 13, w: 600, a: 'left', c: C.txt });
      tx(T[2], x, y + (NAR ? 40 : 46), { s: 12, a: 'left', c: C.dim });
      E3.reserva(g, [x - 4, y - 14, Math.max(tw(T[1], 13, 600), tw(T[0], NAR ? 16 : 19, 600, FH)) + 12, NAR ? 66 : 76]);
    }
  });

  // =====================================================================================
  // OVOS: vitelo e modo de vida (ave, anfíbio e mamífero na mesma régua de tempo)
  // =====================================================================================
  const PINTO = '#F4D77E', SAPO = '#7FA66A', PIG = '#4A4E5A', NUTRI = '#FFE1A6';
  E3.cena('ovos/vitelo', {
    fit: 30, raio: 12, bolas: 120,
    pecas: {
      gema: { nome: 'Gema (vitelo)', frase: 'O pintinho cresce dentro do ovo gastando a gema por 21 dias e sai parecido com o adulto: desenvolvimento direto.', cor: K.vitelo },
      casca: { nome: 'Casca', frase: 'Protege o embrião em terra firme e deixa passar gases pelos poros.', cor: K.casca },
      anf: { nome: 'Ovo de anfíbio', frase: 'Vitelo médio, que acaba cedo: o embrião sai como larva (girino), que come sozinha e passa por metamorfose.', cor: K.vitelo },
      girino: { nome: 'Girino', frase: 'Larva aquática do anfíbio. Na metamorfose, ganha patas, perde a cauda e vira sapo: desenvolvimento indireto.', cor: SAPO },
      utero: { nome: 'Útero', frase: 'O embrião de mamífero placentário se implanta na parede do útero.', cor: K.mae },
      plac: { nome: 'Placenta e cordão', frase: 'Trazem nutrientes da mãe o tempo todo; por isso o ovo do mamífero quase não precisa de vitelo.', cor: K.placenta },
      emb: { nome: 'Embrião', frase: 'Cresce protegido, nutrido pela gema na ave e pela mãe no mamífero.', cor: K.pele }
    },
    rotulos: [{ pc: 'gema', t: 'gema' }, { pc: 'girino', t: 'girino' }, { pc: 'plac', t: 'placenta' }, { pc: 'anf', t: 'ovo' }],
    montar(g) {
      const T = g.T, sf = E3.esfera(g, 40);
      g.ave = new T.Group(); g.raiz.add(g.ave);
      g.casca = E3.peca(g, sf, E3.filme(g, '#F4EADA', { cor2: '#FFFFFF', dentro: '#5E5648', base: .1, fr: .7, esc: 2 }), 'casca', g.ave); g.casca.scale.set(1.75, 2.2, 1.75); g.casca.renderOrder = 4;
      g.gema = E3.peca(g, sf, E3.fis(g, K.vitelo, { p: { roughness: .35, clearcoat: .8 } }), 'gema', g.ave);
      g.embA = E3.corpo(g, { pai: g.ave, pc: 'emb' });
      g.pinto = new T.Group(); g.ave.add(g.pinto);
      const mP = E3.fis(g, PINTO, { p: { roughness: .8, sheen: 1, sheenColor: new T.Color('#FFF4C4') } });
      const cp = E3.peca(g, E3.lumpy(g, 'pin', 61, 3, 5, .06, .5, .9), mP, 'emb', g.pinto); cp.scale.set(1.05, .9, .85);
      const cb = E3.peca(g, sf, mP, 'emb', g.pinto); cb.scale.setScalar(.55); cb.position.set(.75, .85, 0);
      const bi = E3.peca(g, E3.cone(g, 12), E3.fis(g, '#F29A3C'), 'emb', g.pinto); bi.scale.set(.14, .3, .14); bi.rotation.z = -Math.PI / 2; bi.position.set(1.38, .82, 0);
      const ol = E3.peca(g, sf, E3.fis(g, '#1B1420', { p: { roughness: .15, clearcoat: 1 } }), 'emb', g.pinto); ol.scale.setScalar(.08); ol.position.set(1.05, .98, .38);
      const meia = E3.peca(g, E3.esfera(g, 32), E3.filme(g, '#F4EADA', { cor2: '#FFFFFF', dentro: '#7A705E', base: .25, fr: .6 }), 'casca', g.pinto); meia.scale.set(1.5, .9, 1.5); meia.position.y = -.9;
      g.anf = new T.Group(); g.raiz.add(g.anf);
      g.gel = E3.peca(g, sf, E3.filme(g, '#8FD8FF', { cor2: '#FFFFFF', dentro: '#1E4E66', base: .07, fr: .5, esc: 2 }), 'anf', g.anf); g.gel.scale.setScalar(1.55); g.gel.renderOrder = 4;
      g.pAnf = E3.corte(g, g.anf, [0, 1, 0], 0);
      g.ovA = E3.peca(g, sf, E3.fis(g, K.vitelo, { p: { roughness: .45 } }), 'anf', g.anf);
      g.pig = E3.solido(g, sf, PIG, [g.pAnf], { pai: g.anf, pc: 'anf', corte: PIG });
      g.mG = E3.fis(g, '#3E4A3A', { p: { roughness: .45, clearcoat: .6 } }); g.cG0 = new T.Color('#3E4A3A'); g.cG1 = new T.Color(SAPO);
      g.gir = new T.Group(); g.anf.add(g.gir);
      g.girC = E3.peca(g, E3.lumpy(g, 'gir', 71, 3, 4, .05, .5, .9), g.mG, 'girino', g.gir);
      g.cauda = E3.tubo(g, 18, 8, g.mG, g.gir, 'girino');
      g.pata = [0, 1, 2, 3].map(() => E3.peca(g, E3.capsula(g, .12, .3, 10), g.mG, 'girino', g.gir));
      g.olhoG = E3.peca(g, sf, E3.fis(g, '#111111', { p: { roughness: .1, clearcoat: 1 } }), 'girino', g.gir);
      g.mam = new T.Group(); g.raiz.add(g.mam);
      g.ut = E3.utero(g, { pai: g.mam, s: .78, pc: 'utero' });
      g.plac = E3.peca(g, E3.lumpy(g, 'plc', 81, 3, 6, .1, .4, .8), E3.fis(g, K.placenta, { p: { roughness: .6, sheen: .7 } }), 'plac', g.mam);
      g.amn = E3.peca(g, sf, E3.filme(g, K.amnio, { cor2: '#FFFFFF', dentro: K.liquido, base: .12, fr: .6 }), 'emb', g.mam); g.amn.renderOrder = 4;
      g.embM = E3.corpo(g, { pai: g.mam, pc: 'emb' });
      g.cord = E3.tubo(g, 16, 8, E3.fis(g, K.alant, { p: { roughness: .4 } }), g.mam, 'plac');
    },
    animar(g, P) {
      const S = P.S, T = S.v / 100, t = P.t, larg = E3.deitado(g), RD = E3.REDUZ();
      const pos = larg ? [[-7.4, 0, 0], [0, 0, 0], [7.4, 0, 0]] : [[-1.9, 5.1, 0], [-1.9, 0, 0], [-1.9, -5.1, 0]], sc = larg ? 1 : .86;
      [g.ave, g.anf, g.mam].forEach((o, i) => { o.position.set(pos[i][0], pos[i][1], 0); o.scale.setScalar(sc); o.updateMatrixWorld(true); });
      const mw = (o, p) => E3.mundo(g, o, p);
      // ave: a gema diminui enquanto o embrião cresce; em 21 dias sai o pintinho
      const sai = T >= .93, res = sai ? .08 : 1 - .9 * T; g.res = [res, .55 * Math.max(0, 1 - T / .3), .04 * Math.max(0, 1 - T / .08)];
      g.casca.visible = g.gema.visible = g.embA.gr.visible = !sai; g.pinto.visible = sai;
      if (!sai) {
        const gr = 1.15 * Math.sqrt(res) + .05; g.gema.scale.setScalar(gr); g.gema.position.set(0, -.25, 0);
        g.embA.gr.position.set(-.1, -.25 + gr + .05 + T * .3, .2 + T * .4); g.embA.gr.rotation.set(0, 0, -.3);
        g.embA.set(mix(22, 60, T), t, mix(.25, 1.9, T));
        ach(g, 'gema', mw(g.ave, [gr * .7, -.25 - gr * .4, 0]));
      } else { g.pinto.position.set(-.2, -.3, 0); g.pinto.rotation.y = RD ? 0 : Math.sin(t * .8) * .25; ach(g, 'emb', mw(g.ave, [.3, 1.4, 0])); }
      // anfíbio: ovo pequeno na cápsula gelatinosa; depois girino e metamorfose
      const ovo = T < .3; g.gel.visible = g.ovA.visible = g.pig.visible = ovo; g.gir.visible = !ovo;
      if (ovo) { g.pig.scale.setScalar(1.012); g.pAnf.reg.c = -mix(0, .3, T / .3) + .02; ach(g, 'anf', mw(g.anf, [1.1, 1.1, 0])); }
      else {
        const gg = seg(T, .3, .7), pe = seg(T, .55, .75), m = seg(T, .8, .97), s = mix(.7, 1.45, gg);
        g.mG.color.copy(g.cG0).lerp(g.cG1, m);
        g.gir.position.set(0, RD ? 0 : Math.sin(t * 2) * .12, 0); g.gir.scale.setScalar(s);
        g.girC.scale.set(mix(.75, .62, m), mix(.55, .5, m), mix(.55, .62, m)); g.girC.position.set(.2, 0, 0);
        g.olhoG.scale.setScalar(.09); g.olhoG.position.set(.62, .18 + .1 * m, .3);
        const cL = 2.2 * (1 - m), P2 = [];
        for (let i = 0; i < 18; i++) { const u = i / 17, w = (RD ? Math.sin(u * 5) : Math.sin(u * 5 - t * 7)) * .22 * u; P2.push([-.35 - u * cL, w, 0]); }
        g.cauda.set(cL > .05 ? P2 : [], (i, n) => .26 * (1 - i / n * .85) * (1 - m * .5));
        g.pata.forEach((p, i) => { const tras = i < 2, k = tras ? pe : seg(T, .7, .85), lado = i % 2 ? 1 : -1; p.visible = k > .02; p.scale.setScalar(Math.max(.01, k) * (tras ? 1.4 : 1)); p.position.set(tras ? -.25 : .45, -.42, lado * .35); p.rotation.set(lado * .4, 0, tras ? -.6 : .5); });
        g.gir.updateMatrixWorld(true); ach(g, 'girino', mw(g.anf, [.3, .9, 0]));
      }
      // mamífero: ovócito minúsculo, implantação e placenta
      const ang = -Math.PI * .3, ix = Math.cos(ang) * 1.05, iy = Math.sin(ang) * .9 + .3;
      const cedo = T < .15; g.plac.visible = g.amn.visible = g.embM.gr.visible = !cedo; if (cedo) g.cord.mesh.visible = false;
      if (cedo) {
        const k = sst(0, .08, T); E3.bola(g, mw(g.mam, V.lerp3([-.9, .7, -.2], [ix - .1, iy + .05, -.2], k)), (T < .08 ? .07 : .1) * sc, K.ovo, 1.1, g.pecas.emb);
        ach(g, 'utero', mw(g.mam, [-1.4, -1.6, 0]));
      } else {
        const gg = seg(T, .15, .95), er = mix(.28, .95, gg), pr = mix(.25, .5, gg);
        g.plac.position.set(ix, iy, -.25); g.plac.scale.set(pr * .5, pr, pr * .8); g.plac.rotation.z = ang;
        const ec = [-.15, .35 - .2 * gg, -.25]; g.amn.position.set(ec[0], ec[1], ec[2]); g.amn.scale.setScalar(er);
        g.embM.gr.position.set(ec[0], ec[1], ec[2]); g.embM.set(mix(24, 70, gg), t, er * 1.15);
        const a = V.add(ec, [er * .2, -er * .15, 0]), b = [ix - .1, iy, -.25], c = V.add(V.mul(V.add(a, b), .5), [.1, -.35, 0]), PC = [];
        for (let i = 0; i < 16; i++) PC.push(V.bez(a, c, b, i / 15)); g.cord.set(PC, .045);
        if (!RD) for (let i = 0; i < 4; i++) E3.brilho(g, mw(g.mam, V.bez(b, c, a, V.fr(t * .5 + i / 4))), .06 * sc, NUTRI, 1.4);
        ach(g, 'plac', mw(g.mam, [ix + .2, iy + .2, 0]));
      }
      g.pos = pos;
    },
    camera(g, P) { return E3.deitado(g) ? cam(g, P, 10.6, 4.2, { al: [0, .3, 0], viva: .3 }) : cam(g, P, 4.3, 8.4, { al: [0, -.5, 0], viva: .3 }); },
    sobre(g, S) {
      if (!g.pos) return;
      const T = S.v / 100, larg = E3.deitado(g), tit = ['Ave (telolécito)', 'Anfíbio (heterolécito)', 'Mamífero placentário'];
      g.pos.forEach((p, i) => {
        const top = E3.tela(g, larg ? [p[0], p[1] + 3, 0] : [p[0] + 2.4, p[1] + 1.6, 0]), bot = E3.tela(g, larg ? [p[0], p[1] - 2.8, 0] : [p[0] + 2.4, p[1] - .2, 0]);
        const w = larg ? Math.min(220, W / 3 - 30) : Math.min(170, W - top[0] - 12), x = larg ? cl(bot[0] - w / 2, 8, W - w - 8) : cl(top[0], 8, W - w - 8);
        tx(tit[i], larg ? x + w / 2 : x, top[1], { f: FH, s: NAR ? 13 : 15, w: 600, a: larg ? 'center' : 'left', c: C.txt });
        hbar(x, bot[1], w, 8, g.res[i], C.vitelo, 'reserva de vitelo');
        if (i === 2) hbar(x, bot[1] + 30, w, 8, T >= .15 ? 1 : 0, C.mae, 'nutrientes pela placenta');
        E3.reserva(g, [x - 2, top[1] - 12, w + 4, 24]); E3.reserva(g, [x - 2, bot[1] - 22, w + 4, i === 2 ? 64 : 34]);
      });
    }
  });
})();
