/* LAB Bioenergética: cenas 3D de fermentação e fotossíntese (Martin). Kit: bio3d.js; o desenho 2D antigo fica como plano B. */
'use strict';
(function () {
  if (!window.BIO3D) return;
  const B = BIO3D, { cl, mix, seg, add, sub, mul, lerp3, fr, hash, trilha, bez, surge, TAU } = B.V;
  const E = () => B.E(), RED = () => B.REDUZ();
  const pc = (nome, cor, frase) => ({ nome, cor, frase });
  const q = s => `<span class="q">${s}</span>`;

  // =====================================================================================
  // Fermentação: músculo e iogurte (lática) ou levedura e massa de pão (alcoólica), com a via animada por cima
  // =====================================================================================
  function fermentacao(chave, alc) {
    const pecas = {
      via: pc('Glicólise', '#FFE1A6', 'A glicose é partida em 2 piruvatos no citosol. Rende 2 ATP e 2 NADH, sem O₂.'),
      reg: pc(alc ? 'Piruvato vira etanol' : 'Piruvato vira lactato', '#7FB2FF', alc ? 'Cada piruvato perde um CO₂ e recebe o hidrogênio do NADH, formando etanol. O NAD⁺ volta para a glicólise.' : 'O piruvato recebe o hidrogênio do NADH e vira lactato. O NAD⁺ volta para a glicólise, que pode continuar.'),
      nad: pc('NAD⁺ e NADH', '#7FB2FF', 'Sem O₂, o NADH não descarrega na cadeia. A fermentação devolve o NAD⁺ para a glicólise não parar.'),
      atp: pc('ATP', '#FF9A3C', 'A fermentação rende só os 2 ATP da glicólise por glicose.')
    };
    if (alc) Object.assign(pecas, {
      lev: pc('Levedura', '#E9D9A6', 'Fungo unicelular. Com O₂, respira; sem O₂, fermenta. Aqui aparece brotando, seu jeito de se reproduzir.'),
      massa: pc('Massa de pão', '#E8C68E', 'O CO₂ da fermentação forma bolhas que fazem a massa crescer. O etanol evapora no forno.'),
      co2: pc('CO₂', '#9AA3B2', 'Sai na fermentação alcoólica, não na lática. É ele que faz a massa crescer e dá gás às bebidas.')
    });
    else Object.assign(pecas, {
      mus: pc('Músculo em esforço intenso', '#C9475A', 'Quando falta O₂ no esforço intenso, as fibras musculares fermentam e formam lactato. A dor do dia seguinte não vem do lactato.'),
      iog: pc('Iogurte', '#F3EEE2', 'Lactobacilos fermentam a lactose do leite. O ácido lático coagula as proteínas e dá o gosto azedo.'),
      lacto: pc('Lactobacilos', '#B9A6F2', 'Bactérias em bastão que fazem fermentação lática.')
    });
    B.cena(chave, {
      fit: 20, raio: 9, pecas,
      rotulos: alc ? [{ pc: 'lev', t: 'levedura' }, { pc: 'massa', t: 'massa de pão' }, { pc: 'via', t: 'glicólise' }, { pc: 'reg', t: 'piruvato vira etanol' }]
        : [{ pc: 'mus', t: 'músculo' }, { pc: 'iog', t: 'iogurte' }, { pc: 'via', t: 'glicólise' }, { pc: 'reg', t: 'piruvato vira lactato' }, { pc: 'lacto', t: 'lactobacilos' }],
      montar(g) {
        const T = g.T;
        g.ctxA = new T.Group(); g.ctxB = new T.Group(); g.raiz.add(g.ctxA, g.ctxB);
        if (!alc) {
          // músculo: feixe de fibras com estrias, bainha translúcida e tendões
          g.fib = B.inst(g, B.capsula(g, .3, 1.6, 14), B.fis(g, '#C9475A', { p: { roughness: .5, clearcoat: .55, sheen: .6, sheenColor: new T.Color('#FFB3BF') }, rim: '#FFC9D2', rimK: .35 }), 19, g.ctxA, g.pecas.mus); g.pick.push(g.fib.m);
          g.est = B.inst(g, B.cilindro(g, 14), B.fis(g, '#8E2E40', { p: { roughness: .6 } }), 19 * 7, g.ctxA, g.pecas.mus);
          g.bai = B.peca(g, B.capsula(g, 1.3, 1.9, 24), B.filme(g, '#F2A0AE', { cor2: '#FFE3E8', dentro: '#3A1520', base: .03, fr: .5, esc: 1.4 }), null, g.ctxA); g.bai.renderOrder = 3;
          g.ten = [0, 1].map(i => { const m = B.peca(g, B.capsula(g, .45, .7, 16), B.fis(g, '#EDE6DA', { p: { roughness: .45, clearcoat: .6 } }), 'mus', g.ctxA); return m; });
          // iogurte: pote em torno, superfície cremosa e lactobacilos
          const pts = [[.0, -1.3], [1.15, -1.3], [1.3, -1.15], [1.5, 1.1], [1.62, 1.25], [1.55, 1.3], [1.42, 1.15], [1.22, -1.08], [.0, -1.08]].map(p => new T.Vector2(p[0] + 1e-4, p[1]));
          const pote = new T.Mesh(new T.LatheGeometry(pts, g.q.cel ? 28 : 44), B.fis(g, '#DCE6F2', { p: { roughness: .2, clearcoat: .9, transparent: true, opacity: .38, depthWrite: false }, lados: 1 })); g.geos.push(pote.geometry); g.ctxB.add(pote); pote.userData.peca = g.pecas.iog; g.pick.push(pote);
          const iog = new T.Mesh(B.lumpy(g, 'iog', 33, 3, 6, .06, .3, .7), B.fis(g, '#F6F1E4', { p: { roughness: .6, clearcoat: .3, sheen: .5 } })); iog.scale.set(1.33, .9, 1.33); iog.position.y = .05; g.ctxB.add(iog); iog.userData.peca = g.pecas.iog; g.pick.push(iog);
          g.lac = B.inst(g, B.capsula(g, .07, .16, 10), B.fis(g, '#B9A6F2', { p: { roughness: .4, clearcoat: .7 }, rimK: .4 }), 26, g.ctxB, g.pecas.lacto); g.pick.push(g.lac.m);
        } else {
          // leveduras brotando
          g.lev = [];
          const mLev = B.fis(g, '#E9D9A6', { p: { roughness: .4, clearcoat: .6, sheen: .6, sheenColor: new T.Color('#FFF4D6'), transparent: true, opacity: .92 }, rim: '#FFF0C8', rimK: .45 });
          for (let i = 0; i < 4; i++) { const m = B.peca(g, B.lumpy(g, 'lev' + i, 40 + i, 3, 4, .08, .4, .8), mLev, 'lev', g.ctxA); g.lev.push(m); const b = B.peca(g, B.esfera(g, 20), mLev, 'lev', m); b.position.set(.85, .55, 0); b.scale.setScalar(.42); m.userData.bud = b; const v = new T.Mesh(B.esfera(g, 16), B.fis(g, '#9FC6E8', { p: { roughness: .3, clearcoat: .8, transparent: true, opacity: .8 } })); v.scale.setScalar(.38); v.position.set(-.2, .1, .3); m.add(v); }
          // massa de pão crescendo sobre a tábua
          g.tab = B.peca(g, B.caixaR(g, 2.2, .14, 1.5, .1, 2), B.fis(g, '#8A5A36', { p: { roughness: .7, clearcoat: .2 } }), null, g.ctxB); g.tab.position.y = -1.1;
          g.massa = B.peca(g, B.lumpy(g, 'massa', 51, 4, 9, .12, .4, .9), B.fis(g, '#E8C68E', { p: { roughness: .65, clearcoat: .25, sheen: .7, sheenColor: new T.Color('#FFF0D0') }, rim: '#FFF0D0', rimK: .3 }), 'massa', g.ctxB);
          g.bol = B.inst(g, B.esfera(g, 14), B.fis(g, '#FFF6E6', { p: { roughness: .1, clearcoat: 1, transparent: true, opacity: .55 } }), 30, g.ctxB, g.pecas.massa);
        }
        // trilhos do NAD⁺ e do NADH
        g.tN = B.tubo(g, 40, 6, B.fis(g, '#7FB2FF', { p: { roughness: .4, transparent: true, opacity: .45 } }));
        g.tD = B.tubo(g, 40, 6, B.fis(g, '#7FB2FF', { p: { roughness: .4, transparent: true, opacity: .45 } }));
      },
      animar(g) {
        const t = g.t, dep = B.deitado(g), Pk = g.pecas, f = fr(t / 10);
        g.dep = dep; g.f = f;
        // contexto: lado a lado (computador) ou em cima (celular)
        const sA = dep ? 1 : (alc ? .8 : .6), sB = dep ? 1 : .8;
        g.ctxA.position.set(...(dep ? [-7, .2, -.5] : [-2.1, 4.6, -.5])); g.ctxB.position.set(...(dep ? [7, .1, -.5] : [2.2, 4.5, -.5])); g.ctxA.scale.setScalar(sA); g.ctxB.scale.setScalar(sB);
        if (!alc) {
          const ct = RED() ? 0 : Math.max(0, Math.sin(t * 4.2)) ** 2, enc = 1 - .1 * ct, eng = 1 + .07 * ct;
          let n = 0; for (let r = 0; r < 3; r++) { const k = r ? 6 * r : 1; for (let i = 0; i < k; i++) { const a = i / k * TAU + r * .3, rr = r * .52, p = [Math.cos(a) * rr * eng, 0, Math.sin(a) * rr * eng]; B.put(g, g.fib, p, null, 1, enc * (1 - r * .06), 1, n % 3 ? '#C9475A' : '#B83E52', 1, Pk.mus); for (let s = 0; s < 7; s++) B.put(g, g.est, add(p, [0, (s - 3) * .5 * enc * (1 - r * .06), 0]), null, .305, .05, .305, '#8E2E40', 1, Pk.mus); n++; } }
          B.fim(g.fib); B.fim(g.est); g.bai.scale.set(eng, enc, eng); g.bai.material.uniforms.uT.value = t;
          g.ten[0].position.y = 2.9 * enc; g.ten[1].position.y = -2.9 * enc; g.ctxA.rotation.set(0, .3, Math.PI / 2 * (dep ? 1 : 1));
          for (let i = 0; i < 26; i++) { const a = hash(i, 1) * TAU + (RED() ? 0 : t * .15 * (hash(i, 2) - .5)), r = .2 + 1.05 * hash(i, 3), y = .2 + .9 * hash(i, 4) + .05 * Math.sin(t + i); g._e.set(hash(i, 5) * 3, a, hash(i, 6) * 3); g._q.setFromEuler(g._e); B.put(g, g.lac, [Math.cos(a) * r, y, Math.sin(a) * r], g._q, 1, null, null, '#B9A6F2', 1, Pk.lacto); }
          B.fim(g.lac); g.ctxB.rotation.y = RED() ? .3 : t * .1;
          g.vis.mus = g.vis.iog = g.vis.lacto = 1; g.anc.mus = B.mundo(g, g.ctxA, [1.4, 0, .8]); g.anc.iog = B.mundo(g, g.ctxB, [0, -.6, 1.55]); g.anc.lacto = B.mundo(g, g.ctxB, dep ? [0, 1.3, 0] : [-.9, 1.3, 0]);
        } else {
          g.lev.forEach((m, i) => { const a = i / 4 * TAU + .4; m.position.set(Math.cos(a) * 1.4, Math.sin(a) * 1.1, Math.sin(a * 2) * .5); m.scale.set(.75, .62, .62); m.rotation.set(i, t * .2 + i, i * .7); m.userData.bud.scale.setScalar(.3 + .14 * (.5 + .5 * Math.sin(t * .3 + i))); });
          const cres = RED() ? .6 : .5 + .5 * Math.sin(t * .35), mh = .75 + .35 * cres;
          g.massa.scale.set(1.75 + .15 * cres, mh, 1.25 + .1 * cres); g.massa.position.y = -1 + mh * .85;
          for (let i = 0; i < 30; i++) { const a = hash(i, 1) * TAU, z0 = hash(i, 2), cy = g.massa.position.y, life = fr(t * .12 + hash(i, 3)), s = .05 + .13 * life * (.4 + .6 * cres); B.put(g, g.bol, [Math.cos(a) * 1.55 * (1 - z0 * .45), cy + (z0 - .2) * mh * .9, Math.sin(a) * 1.15 * (1 - z0 * .45)], null, s, null, null, '#FFF6E6', 1, Pk.massa); }
          B.fim(g.bol); g.ctxB.rotation.y = .35;
          g.vis.lev = g.vis.massa = 1; g.anc.lev = B.mundo(g, g.ctxA, [1.4, 1.2, .4]); g.anc.massa = B.mundo(g, g.ctxB, [0, g.massa.position.y + mh * .7, .9]);
          // CO₂ subindo da massa e das leveduras
          for (let i = 0; i < 4; i++) { const k = fr(t * .2 + i / 4), b = B.mundo(g, g.ctxB, [(i - 1.5) * .8, g.massa.position.y + mh * .8, .3]); B.mol(g, 'co2', add(b, [Math.sin(i + k * 4) * .3, k * 2.2, 0]), .55 * surge(k) * (dep ? 1 : .7), [0, t + i, 0], 1, Pk.co2); }
        }
        // via: glicose em G, piruvatos em P, regeneração em R
        const G = dep ? [-3.3, 0, .6] : [-2.5, .2, .6], R = dep ? [3.3, 0, .6] : [2.5, .2, .6], Pm = lerp3(G, R, .5), ay = dep ? 1.75 : 1.5;
        const arcoN = [], arcoD = []; for (let i = 0; i < 40; i++) { const u = i / 39; arcoN.push(bez(add(G, [.5, 1.2, 0]), add(Pm, [0, ay * 1.4, 0]), add(R, [-.5, 1.2, 0]), u)); arcoD.push(bez(add(R, [-.5, -1.2, 0]), add(Pm, [0, -ay * 1.4, 0]), add(G, [.5, -1.2, 0]), u)); }
        g.tN.set(arcoN, .035); g.tD.set(arcoD, .035);
        const sp = E().move(seg(f, .14, .3)), pir = [0, 1].map(j => lerp3(G, add(lerp3(G, R, .55), [0, j ? -.85 : .85, 0]), sp));
        const vr = E().move(seg(f, .42, .58)), pirR = [0, 1].map(j => lerp3(pir[j], add(R, [0, j ? -.75 : .75, 0]), vr));
        const red = seg(f, .6, .7), sai = seg(f, .74, .98);
        if (f < .2) { B.mol(g, 'glic', G, .85 * (1 + .04 * Math.sin(t * 5)), [0, t * .4, 0], 1, Pk.via); B.ficha(g, G, 'glicose', '#FFE1A6', { dy: -1.6, pr: 2 }); }
        const ext = dep ? (alc ? [6.5, 2.4, -.2] : [6.2, .2, .3]) : [1.9, 3.8, -.2];
        for (let j = 0; j < 2; j++) {
          if (f < .2) break;
          let p = vr > 0 ? pirR[j] : pir[j], tipo = B.MOL.cad(3, '#FFE1A6'), nome = 'piruvato';
          if (alc && f > .5) { tipo = B.MOL.cad(2, '#FFE1A6'); nome = 'acetaldeído'; }
          if (red >= .5) { tipo = alc ? B.MOL.cad(2, '#FFE1A6') : B.MOL.cad(3, '#FFE1A6'); nome = alc ? 'etanol' : 'lactato'; }
          if (sai > 0) p = lerp3(add(R, [0, j ? -.75 : .75, 0]), add(ext, [0, j ? -.5 : .5, 0]), E().in(sai));
          const s = .92 * (1 - seg(sai, .75, 1));
          B.mol(g, tipo, p, s, [0, t * .3 + j, 0], 1, red >= .5 ? Pk.reg : Pk.via);
          if (red >= .5) B.hmais(g, add(p, [.55, .3, .2]), 1.3 * (1 - seg(sai, .75, 1)), 1, Pk.reg);
          if (j === 0 && s > .2) B.ficha(g, p, '2 ' + (nome === 'piruvato' ? 'piruvatos' : nome === 'etanol' ? 'etanóis' : nome === 'lactato' ? 'lactatos' : 'acetaldeídos'), '#FFE1A6', { dy: -1.4, pr: 2 });
          // alcoólica: cada piruvato perde um CO₂ no meio do caminho
          if (alc) { const k = seg(f, .48, .7); if (k > 0 && k < 1) { const c0 = lerp3(pir[j], add(R, [0, j ? -.75 : .75, 0]), .45); const c = add(c0, [0, (j ? -1 : 1) * 2.4 * E().out(k), .3]); B.mol(g, 'co2', c, .7 * surge(k), [0, t, 0], 1, Pk.co2); if (j === 0) B.ficha(g, c, 'CO₂', '#C9CFDC', { dy: -1.2, pr: 1 }); } }
        }
        // ATP da glicólise
        { const k = seg(f, .2, .42); if (k > 0 && k < 1) for (let j = 0; j < 2; j++) { const p = add(G, [(j - .5) * 1.2, -2.4 * E().out(k) - .6, .4]); B.mol(g, 'atp', p, .45 * surge(k), [0, 0, .2], 1, Pk.atp); if (!j) B.ficha(g, p, '2 ATP', '#FFB870', { dy: 1.4, pr: 1 }); } }
        // NAD⁺ vira NADH em G, viaja pelo arco de cima, entrega o H em R e volta como NAD⁺ pelo arco de baixo
        for (let j = 0; j < 2; j++) {
          const o = j * .04, k1 = seg(f, .3 + o, .56 + o), k2 = seg(f, .72 + o, .97 + o);
          let p, tipo;
          if (f < .3 + o) { p = trilha(arcoD, .999); tipo = f > .12 ? 'nadh' : 'nad'; }
          else if (k1 < 1) { p = trilha(arcoN, E().move(k1)); tipo = 'nadh'; }
          else if (f < .72 + o) { p = trilha(arcoN, 1); tipo = red > .5 ? 'nad' : 'nadh'; }
          else { p = trilha(arcoD, E().move(k2)); tipo = 'nad'; }
          B.mol(g, tipo, add(p, [0, 0, j * .5]), .7, [0, t * .5 + j, 0], 1, Pk.nad);
          if (j === 0) B.ficha(g, p, tipo === 'nadh' ? 'NADH' : 'NAD⁺', '#9CC8FF', { dy: tipo === 'nadh' && k1 > 0 && k1 < 1 ? -1.3 : 1.3, pr: 3 });
        }
        g.vis.via = g.vis.reg = 1; g.anc.via = add(G, [0, -.9, .4]); g.anc.reg = add(R, [dep ? 0 : -1.8, -1.0, .4]);
      },
      camera(g) { const dep = B.deitado(g); return B.viva({ th: .08, fi: .12, d: dep ? B.enquadrar(g, 10.2, 3.6) : B.enquadrar(g, 4.3, 4.6), al: dep ? [0, .3, 0] : [0, 2.1, 0] }, g.t, 1); },
      legenda: () => (alc ? `Fermentação alcoólica: ${q('glicose')} forma ${q('2 etanol + 2 CO₂ + 2 ATP')}; o NADH devolve o NAD⁺ para a glicólise` : `Fermentação lática: ${q('glicose')} forma ${q('2 lactato + 2 ATP')}, sem CO₂; o NADH devolve o NAD⁺ para a glicólise`)
    });
  }
  fermentacao('ferm/latica', false);
  fermentacao('ferm/alcoolica', true);

  // =====================================================================================
  // Visão geral da fotossíntese: cloroplasto em corte, com granum, tilacoide, estroma e envoltório
  // =====================================================================================
  const eqF = () => `${q('6 CO₂ + 12 H₂O + luz')} formam ${q('C₆H₁₂O₆ + 6 O₂ + 6 H₂O')}`;
  B.cena('foto/geral', {
    fit: 20, raio: 9, raioPc: { granum: 1.6, tila: 1.2 },
    pecas: {
      env: pc('Envoltório', '#4FC97A', 'Duas membranas envolvem o cloroplasto, como na mitocôndria. Sinal da origem por endossimbiose.'),
      estroma: pc('Estroma', '#1F5136', 'Líquido interno do cloroplasto. Aqui ocorre o ciclo de Calvin, que fixa o CO₂ em açúcar.'),
      granum: pc('Granum', '#33A85C', 'Pilha de tilacoides, como moedas empilhadas. Os grana são ligados por lamelas.'),
      tila: pc('Tilacoide', '#3DB868', 'Bolsa achatada de membrana com clorofila. Na membrana dele ocorre a fase clara: luz, fotólise da água, ATP e NADPH.'),
      calvin: pc('Ciclo de Calvin', '#9BE6B3', 'No estroma, usa ATP e NADPH da fase clara para transformar CO₂ em açúcar.')
    },
    rotulos: [{ pc: 'granum', t: 'granum' }, { pc: 'tila', t: 'tilacoide' }, { pc: 'estroma', t: 'estroma' }, { pc: 'env', t: 'envoltório' }, { pc: 'calvin', t: 'ciclo de Calvin' }],
    montar(g) {
      g.cl = B.cloroCorte(g, { r: 2.3, h: 5.2, pc: { env: 'env', estroma: 'estroma', granum: 'granum', tila: 'tila' } }); g.raiz.add(g.cl.grupo);
      g.kv = B.peca(g, B.toro(g, .12, 32), B.fis(g, '#9BE6B3', { p: { roughness: .35, clearcoat: .8 }, rim: '#E0FFE8', rimK: .4 }), 'calvin', g.cl.grupo); g.kv.scale.setScalar(.5); g.kv.position.set(1.0, .75, -.6);
      g.rai = B.inst(g, B.esfera(g, 10), B.emis(g, '#FFE9A8', 2.6), 60);
    },
    animar(g, P) {
      const t = g.t, dep = B.deitado(g), Pk = g.pecas, cl0 = g.cl, gr = cl0.grupo, v = P.S.v / 100;
      g.dep = dep; g.lv = v;
      gr.rotation.z = dep ? Math.PI / 2 : 0; gr.position.set(0, dep ? -.4 : -1.2, 0);
      g.kv.rotation.z = RED() ? 0 : -t * .5;
      const gra = cl0.stacks[1], gW = B.mundo(g, gr, add(gra.p, [0, .3, .5])), K = B.mundo(g, gr, [1.0, .75, -.2]);
      // luz: raios que chegam aos grana
      const nr = Math.round(14 * v), src = dep ? [-4.5, 4.6, 2] : [-3.2, 6.4, 2];
      for (let i = 0; i < 14; i++) { if (i >= nr) break; const f = fr(t * .5 + i / 14), alvo = B.mundo(g, gr, add(cl0.stacks[i % 5].p, [0, 0, .7])), o = add(src, [(hash(i, 1) - .5) * 3, (hash(i, 2) - .5) * 1.2, 0]); for (let k = 0; k < 3; k++) { const ff = f - k * .035; if (ff > 0 && ff < 1) B.put(g, g.rai, lerp3(o, alvo, ff), null, .07 * (1 - k * .25), null, null, '#FFE9A8', 1); } }
      B.fim(g.rai);
      const voo = (A, Bp, f, tipo, s, fi, cor, pr) => { if (f <= 0 || f >= 1) return; const p = lerp3(A, Bp, E().move(f)); B.mol(g, tipo, p, s * surge(f), [0, t * .7, 0], 1); if (fi && f > .2 && f < .9) B.ficha(g, p, fi, cor, { dy: -1.2, pr: pr || 4 }); };
      const u = t * .12;
      if (v > 0) {
        const h2o = dep ? [-6.5, -3.2, 1] : [-3.4, -6.4, 1], o2 = dep ? [-5.8, 3.4, 1] : [-3.6, 4.4, 1], co2 = dep ? [6.9, 1.5, 1] : [3.4, 5.4, 1], ac = dep ? [6.4, -3.4, 1] : [3.4, -6.6, 1];
        voo(h2o, gW, fr(u), 'h2o', .7, 'H₂O', '#FF8A8A', 3); voo(h2o, gW, fr(u + .5), 'h2o', .7);
        voo(gW, o2, fr(u + .25), 'o2', .75, 'O₂ (vem da água)', '#FF8A8A', 2);
        voo(co2, K, fr(u + .1), 'co2', .75, 'CO₂', '#C9CFDC', 3); voo(co2, K, fr(u + .6), 'co2', .75);
        voo(K, ac, fr(u + .4), 'glic', .65, 'glicose', '#FFE1A6', 2);
        voo(gW, K, fr(u * 2 + .2), 'atp', .38, dep && 'ATP', '#FFB870', 5); voo(gW, K, fr(u * 2 + .7), 'nadh', .5, dep && 'NADPH', '#9CC8FF', 5);
      }
      g.vis.granum = g.vis.tila = g.vis.estroma = g.vis.env = g.vis.calvin = 1;
      const s2 = cl0.stacks[2];
      g.anc.granum = B.mundo(g, gr, add(cl0.stacks[3].p, [.55, 0, .3])); g.anc.tila = B.mundo(g, gr, [s2.p[0] - .45, s2.top, s2.p[2] + .45]); g.anc.estroma = B.mundo(g, gr, dep ? [-1.1, 2.6, -.6] : [-cl0.r * .8, .9, -.2]);
      g.anc.env = B.mundo(g, gr, [cl0.r * .62, -3.8, -cl0.r * .4]); g.anc.calvin = B.mundo(g, gr, [1.45, .75, -.3]);
    },
    camera(g) { const dep = B.deitado(g); return B.viva({ th: .2, fi: .2, d: dep ? B.enquadrar(g, 7.4, 4.1) : B.enquadrar(g, 3.9, 7.9), al: [0, dep ? 0 : -1.3, 0] }, g.t, 1); },
    legenda: g => (g.lv === 0 ? 'No escuro, a fase clara para; sem ATP e NADPH, o ciclo de Calvin também para' : eqF() + '<br>O O₂ liberado vem da água')
  });

  // =====================================================================================
  // Fase clara: membrana do tilacoide com volume, elétrons e prótons em fluxo contínuo
  // =====================================================================================
  B.cena('foto/clara', {
    fit: 22, raio: 10, moleculas: 700,
    pecas: {
      PSII: pc('Fotossistema II', '#3FBF6A', 'A luz excita a clorofila, que perde elétrons. Eles são repostos pela quebra da água (fotólise), que libera O₂ e H⁺.'),
      b6f: pc('Citocromo b6f', '#B98ACB', 'Passa os elétrons adiante e usa essa energia para bombear H⁺ para dentro do tilacoide.'),
      PSI: pc('Fotossistema I', '#2E9E58', 'Recebe os elétrons, é excitado de novo pela luz e os entrega à ferredoxina.'),
      FNR: pc('NADP⁺ redutase', '#7FB2FF', 'Usa os elétrons e H⁺ do estroma para formar NADPH, que vai para o ciclo de Calvin.'),
      S: pc('ATP sintase', '#E9A24E', 'Os H⁺ saem do tilacoide por ela. A passagem gira o rotor e forma ATP no estroma.'),
      agua: pc('Fotólise da água', '#FF4D4D', 'A água é quebrada no fotossistema II: libera O₂, H⁺ e os elétrons que repõem os da clorofila. O O₂ da fotossíntese vem daqui.'),
      PQ: pc('Plastoquinona', '#F2D24B', 'Carregador móvel na membrana: leva elétrons do fotossistema II ao citocromo b6f.'),
      PC: pc('Plastocianina', '#5C9CFF', 'Proteína pequena com cobre, no interior do tilacoide: leva elétrons ao fotossistema I.'),
      lumen: pc('Interior do tilacoide', '#F2F4F8', 'Os H⁺ se acumulam aqui. Essa diferença de concentração move a ATP sintase.'),
      mem: pc('Membrana do tilacoide', '#7FD49B', 'Bicamada com os fotossistemas e a cadeia de elétrons da fase clara.')
    },
    rotulos: [{ pc: 'PSII', t: 'fotossistema II' }, { pc: 'PSI', t: 'fotossistema I' }, { pc: 'S', t: 'ATP sintase' }, { pc: 'agua', t: 'fotólise da água' }, { pc: 'b6f', t: 'citocromo b6f' }, { pc: 'FNR', t: 'NADP⁺ redutase' }, { pc: 'PC', t: 'plastocianina' }],
    montar(g) {
      const T = g.T, dep = B.deitado(g), K = dep ? 1 : .92; g.K = K; g.raizGira = true;
      const X0 = { PSII: -6.4 * K, b6f: -2.4 * K, PSI: 1.6 * K, FNR: 3.7 * K, S: 6.6 * K }; g.X0 = X0;
      B.membrana(g, { x0: -9.6 * K, x1: 8.9 * K, zd: 2.4, esp: 1.4, pc: 'mem', cor: '#8FD9A4', cauda: '#E8F2C8', furos: [[X0.PSII, 1.75, 1.5], [X0.b6f, 1.35, 1.25], [X0.PSI, 1.7, 1.45], [X0.S, 1.15, 1.15]] });
      const lp = (k, s) => B.lumpy(g, k, s, 3, 7, .3, .35, .75), mt = c => B.fis(g, c, { p: { roughness: .42, clearcoat: .55 }, rim: '#E0FFE8', rimK: .3 });
      const corpo = (id, k, s, c, pos, sc) => { const m = B.peca(g, lp(k, s), mt(c), id); m.position.set(...pos); m.scale.set(...sc); return m; };
      g.ps2 = corpo('PSII', 'p2', 61, '#3FBF6A', [X0.PSII, .15, 0], [1.4, 1.55, 1.15]); g.b6 = corpo('b6f', 'b6', 62, '#B98ACB', [X0.b6f, .15, 0], [1.05, 1.5, .9]);
      g.ps1 = corpo('PSI', 'p1', 63, '#2E9E58', [X0.PSI, .1, 0], [1.35, 1.5, 1.1]); g.fnr = corpo('FNR', 'fnr', 64, '#7FB2FF', [X0.FNR, -1.55, .3], [.6, .5, .6]);
      g.oec = corpo('agua', 'oec', 65, '#7FD49B', [X0.PSII + .2, 1.75, .4], [.55, .4, .55]);
      g.ant = [g.ps2, g.ps1].map((m, i) => { const a = B.peca(g, B.esfera(g, 20), B.emis(g, '#9BFFB8', .6), i ? 'PSI' : 'PSII'); a.scale.set(.45, .35, .45); return a; });
      g.rot = new T.Group(); g.rot.position.set(X0.S, 0, 0); g.raiz.add(g.rot);
      const mFo = B.fis(g, '#F2D2A0', { p: { roughness: .4, clearcoat: .6 }, rim: '#FFF0D8', rimK: .35 });
      for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, m = B.peca(g, B.capsula(g, .17, .38, 12), mFo, 'S', g.rot); m.position.set(Math.cos(a) * .62, 0, Math.sin(a) * .62); }
      const haste = B.peca(g, B.cilindro(g, 14), B.fis(g, '#E9A24E', { p: { roughness: .4 } }), 'S', g.rot); haste.scale.set(.17, 2.1, .17); haste.position.y = -1.35;
      g.f1 = new T.Group(); g.f1.position.set(X0.S, -2.75, 0); g.raiz.add(g.f1);
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU, m = B.peca(g, lp('f1' + (i % 2), 9 + i % 2), mt(i % 2 ? '#F2C27A' : '#E9A24E'), 'S', g.f1); m.position.set(Math.cos(a) * .6, 0, Math.sin(a) * .6); m.scale.set(.48, .62, .48); }
      corpo('S', 'est', 12, '#D8925A', [X0.S + 1.05, .05, .1], [.45, .8, .45]);
      g.PQ = B.peca(g, B.cilindro(g, 18), B.fis(g, '#F2D24B', { p: { roughness: .35, clearcoat: .8 } }), 'PQ'); g.PQ.scale.set(.32, .14, .32);
      g.PC = B.peca(g, B.lumpy(g, 'pc', 66, 2, 4, .2, .4, .8), B.fis(g, '#5C9CFF', { p: { roughness: .35, clearcoat: .8 } }), 'PC'); g.PC.scale.setScalar(.34);
      g.fd = B.peca(g, B.lumpy(g, 'fd', 67, 2, 4, .2, .4, .8), B.fis(g, '#C97A4A', { p: { roughness: .35, clearcoat: .8 } }), 'PSI'); g.fd.scale.setScalar(.28);
      g.trilho = B.tubo(g, 100, 6, B.emis(g, '#FFE066', .55, { transparent: true, opacity: .45 }));
      g.rai = B.inst(g, B.esfera(g, 10), B.emis(g, '#FFE9A8', 2.6), 40);
    },
    animar(g, P) {
      const t = g.t, S = P.S, K = g.K, X0 = g.X0, Pk = g.pecas, tr = RED();
      g.dep = B.deitado(g); g.M.nos.raiz.rot = [0, 0, g.dep ? 0 : -Math.PI / 2];
      const v = S.v / 100; g.g = g.g == null ? v : g.g + (v - g.g) * Math.min(1, (g.dt || .016) * 1.1); const gr = g.g, on = Math.min(1, gr * 3);
      const st = Math.floor(S.ph / 4.5) % 4; g.st = st; g.lv = v;
      // luz chegando aos dois fotossistemas; a antena acende
      [g.ps2, g.ps1].forEach((m, i) => { const a = g.ant[i]; a.position.set(m.position.x + (i ? .3 : -.3), 1.35, .9); a.material.emissiveIntensity = .4 + 2.2 * gr * (.6 + .4 * Math.sin(t * 6 + i)); });
      for (let i = 0; i < 8; i++) { if (gr < .02) break; const f = fr(t * .7 + i / 8), al = i % 2 ? g.ant[1].position : g.ant[0].position, o = [al.x - 2.2 + hash(i, 1), 5.4, 2.4 + hash(i, 2)]; for (let k = 0; k < 3; k++) { const ff = f - k * .04; if (ff > 0 && ff < 1) B.put(g, g.rai, lerp3(o, al.toArray(), ff), null, .08 * (1 - k * .25) * on, null, null, '#FFE9A8', 1); } }
      B.fim(g.rai);
      // elétrons: PSII, plastoquinona, b6f, plastocianina, PSI, ferredoxina, NADP⁺ redutase
      const zf = 1.3, cam = [[X0.PSII + .2, 1.6, zf], [X0.PSII, .2, zf], [X0.PSII + .6, -.1, zf], [X0.b6f, -.1, zf], [X0.b6f, 1.3, zf], [X0.PSI, 1.4, zf], [X0.PSI, .2, zf], [X0.PSI + .4, -1.5, zf], [X0.FNR, -1.6, zf]];
      g.trilho.set(Array.from({ length: 100 }, (_, i) => trilha(cam, i / 99)), .03); g.trilho.mesh.material.opacity = .2 + .35 * on;
      for (let i = 0; i < 7; i++) { const f = fr(t * .1 + i / 7); B.brilho(g, trilha(cam, f), .12 * on, '#FFE066', 2 + 1.2 * (st === 0 || st === 3)); }
      const fq = .5 + .5 * Math.sin(t * .6); g.PQ.position.set(mix(X0.PSII + 1.1, X0.b6f - 1, fq), 0, 1.5); g.PQ.rotation.set(1.2, t * .5, 0);
      const fc = .5 + .5 * Math.sin(t * .55 + 1); g.PC.position.set(mix(X0.b6f + .8, X0.PSI - .9, fc), 1.6, 1.0); g.PC.rotation.set(t * .3, t * .4, 0);
      g.fd.position.set(X0.PSI + .9 + .25 * Math.sin(t * .8), -1.55, .9); g.fd.rotation.set(t * .4, 0, t * .2);
      // fotólise da água no lado de dentro: entra H₂O, sai O₂, ficam H⁺
      const fw = fr(t * .12), w0 = [X0.PSII - 2.2, 3.4, 1.2], w1 = [X0.PSII + .2, 2.1, .9];
      if (fw < .45) { const p = lerp3(w0, w1, E().out(seg(fw, 0, .4))); B.mol(g, 'h2o', p, .8 * on, [0, t, 0], 1, Pk.agua); B.mol(g, 'h2o', add(p, [-.6, .4, -.3]), .8 * on, [0, -t, 0], 1, Pk.agua); if (on > .2) B.ficha(g, p, '2 H₂O', '#FF8A8A', { dy: -1.2, pr: 2 }); }
      else { const k = seg(fw, .45, 1), p = lerp3(w1, [X0.PSII + 1.6, 3.9, 1.3], E().out(k)); B.mol(g, 'o2', p, .85 * on * (1 - seg(k, .85, 1)), [0, t, 0], 1, Pk.agua); if (on > .2) B.ficha(g, p, 'O₂', '#FF8A8A', { dy: -1.2, pr: 2 }); for (let i = 0; i < 2; i++) B.hmais(g, lerp3(w1, [X0.PSII - 1 + i * 1.6, 2.7, .6], E().out(k)), .9 * on, 1, Pk.lumen); }
      // H⁺ bombeados pelo b6f para dentro do tilacoide e acumulados lá
      for (let i = 0; i < 2; i++) { const f = fr(t * .25 + i / 2); B.hmais(g, [X0.b6f + (i - .5) * .5, mix(-2.4, 2.5, E().move(f)), 1.35], .9 * surge(f) * on, 1, Pk.lumen); }
      const nI = Math.round(30 * gr); for (let i = 0; i < nI; i++) B.hmais(g, [mix(-9 * K, 8.4 * K, hash(i, 1)) + Math.sin(t * .9 + i) * .15, 1.8 + 1.4 * hash(i, 2), mix(-2, 1.6, hash(i, 3))], .8, .9, Pk.lumen);
      g.vis.lumen = 1; g.anc.lumen = [X0.b6f + 1.5, 2.7, .6];
      // NADP⁺ vira NADPH no estroma
      const fn = fr(t * .13), n0 = [X0.FNR - 1.6, -3.7, 1.1], n1 = [X0.FNR, -2.2, .9];
      if (fn < .5) { const p = lerp3(n0, n1, E().out(seg(fn, 0, .45))); B.mol(g, 'nad', p, .75 * on, [0, t * .4, 0], 1, Pk.FNR); if (on > .2) B.ficha(g, p, 'NADP⁺', '#9CC8FF', { dy: 1.2, pr: 3 }); }
      else { const k = seg(fn, .5, 1), p = lerp3(n1, [X0.FNR + 1.2, -4.1, 1.2], E().out(k)); B.mol(g, 'nadh', p, .75 * on * (1 - seg(k, .85, 1)), [0, t * .4, 0], 1, Pk.FNR); if (on > .2) B.ficha(g, p, 'NADPH', '#9CC8FF', { dy: 1.2, pr: 1 }); }
      // ATP sintase: H⁺ saem do tilacoide, o rotor gira, ATP no estroma
      g.ang = (g.ang || 0) + (tr ? 0 : g.dt * 2.2 * gr); g.rot.rotation.y = g.ang;
      for (let i = 0; i < 3; i++) { const f = fr(t * .3 + i / 3), p = trilha([[X0.S + .95, 2.1, .4], [X0.S + .75, .7, .5], [X0.S + .6 * Math.cos(g.ang + i), 0, .6 * Math.sin(g.ang + i) + .2], [X0.S + .3, -1.0, .5], [X0.S - .2, -1.7, .7]], f); B.hmais(g, p, 1.1 * surge(f) * on, 1, Pk.S); }
      const fa = fr(t * .2), cab = [X0.S, -2.75, 0];
      if (fa < .5) { const p = lerp3([X0.S - 2.3, -3.9, 1.1], add(cab, [-.6, -.3, .8]), E().out(seg(fa, 0, .4))); B.mol(g, 'adp', p, .45 * on, [0, 0, .4], 1, Pk.S); if (on > .2 && !NAR) B.ficha(g, p, 'ADP + Pᵢ', '#C9CFDC', { dy: 1.2, pr: 4 }); }
      else { const k = seg(fa, .5, 1), p = lerp3(add(cab, [.3, -.5, .9]), [X0.S + 2.2, -4, 1.2], E().out(k)); B.mol(g, 'atp', p, .45 * (1 - seg(k, .85, 1)) * on, [0, 0, -.3], 1, Pk.S); if (on > .2) B.ficha(g, p, 'ATP', '#FFB870', { dy: 1.2, pr: 1 }); }
      ['PSII', 'PSI', 'S', 'agua', 'b6f', 'FNR', 'PC'].forEach(id => { g.vis[id] = 1; });
      g.anc.PSII = [X0.PSII - .5, 1.1, .9]; g.anc.PSI = [X0.PSI, 1.2, .8]; g.anc.S = [X0.S, -3.1, .4]; g.anc.agua = [X0.PSII + .4, 2.1, .7]; g.anc.b6f = [X0.b6f, 1.1, .6]; g.anc.FNR = [X0.FNR, -1.9, .7]; g.anc.PC = g.PC.position.toArray();
    },
    camera(g) { const dep = B.deitado(g); return B.viva(dep ? { th: .06, fi: .16, d: B.enquadrar(g, 9.9, 4.6), al: [-.2, -.3, 0] } : { th: .3, fi: .06, d: B.enquadrar(g, 4.6, 9), al: [-.3, .3, 0] }, g.t, .8); },
    sobre(g) {
      B.texto(g, [8.6 * g.K, 3.4, 0], 'interior do tilacoide', { a: 'right', c: '#CFE8D8', s: 13 });
      B.texto(g, [-8.9 * g.K, -3.5, 0], 'estroma', { a: 'left', c: '#CFE8D8', s: 13 });
      if (g.g > .05) B.ficha(g, [g.X0.b6f + 1.8, 2.3, .8], 'H⁺', '#F2F4F8', { dy: 0, pr: 5 });
    },
    legenda: g => (g.lv === 0 ? 'No escuro, a fase clara para: sem luz não se formam ATP nem NADPH' : ['1. A luz excita a clorofila dos fotossistemas, que perdem elétrons', '2. A fotólise da água repõe os elétrons do fotossistema II e libera O₂ e H⁺', '3. A passagem dos elétrons bombeia H⁺ para dentro do tilacoide; a volta pela ATP sintase forma ATP', '4. No fim do caminho, os elétrons reduzem o NADP⁺ a NADPH'][g.st])
  });

  // =====================================================================================
  // Ciclo de Calvin: roda legível, com um carbono (CO₂) entrando por volta e a RuBisCO no topo
  // =====================================================================================
  B.cena('foto/calvin', {
    fit: 14, raio: 7,
    pecas: {
      rub: pc('RuBisCO', '#5FCB86', 'A enzima mais abundante da Terra. Une o CO₂ à RuBP (5 C): é a fixação do carbono.'),
      anel: pc('Ciclo de Calvin', '#7FD49B', 'Ocorre no estroma. A cada 3 voltas, 3 CO₂ entram e 1 G3P (3 C) sai para formar açúcares.'),
      mol: pc('Compostos do ciclo', '#9AA3B2', 'RuBP (5 C) mais CO₂ formam 2 moléculas de 3 C, que viram G3P com ATP e NADPH.'),
      co2: pc('CO₂', '#9AA3B2', 'Entra pelos estômatos e é fixado pela RuBisCO: um carbono por volta.'),
      atp: pc('ATP e NADPH', '#FF9A3C', 'Vêm da fase clara. Por glicose, o ciclo gasta 18 ATP e 12 NADPH.'),
      g3p: pc('G3P', '#FFE1A6', 'Açúcar de 3 carbonos. Um a cada 3 voltas sai do ciclo e forma glicose, sacarose, amido e celulose.')
    },
    rotulos: [{ pc: 'rub', t: 'RuBisCO' }],
    montar(g) {
      g.anel = B.peca(g, B.toro(g, .022, 64), B.fis(g, '#7FD49B', { p: { roughness: .35, clearcoat: .8 }, rim: '#E0FFE8', rimK: .4 }), 'anel');
      g.chev = B.inst(g, B.esfera(g, 12), B.fis(g, '#B8F0C8', { p: { roughness: .4 } }), 24);
      g.rub = B.peca(g, B.lumpy(g, 'rub', 71, 3, 8, .28, .35, .7), B.fis(g, '#5FCB86', { p: { roughness: .42, clearcoat: .6, sheen: .5, sheenColor: new g.T.Color('#E0FFE8') }, rim: '#E0FFE8', rimK: .35 }), 'rub');
    },
    animar(g) {
      const t = g.t, tt = t / 7, qq = fr(tt), volta = Math.floor(tt) % 3, Pk = g.pecas, R = B.deitado(g) ? 3.0 : 2.5;
      g.R = R; g.q = qq; g.volta = volta;
      g.anel.scale.setScalar(R);
      const pa = a => [R * Math.sin(a), R * Math.cos(a), 0];
      for (let i = 0; i < 24; i++) { const a = (i / 24 + (RED() ? 0 : t * .015)) * TAU, p = pa(a); B.put(g, g.chev, p, B.qy(g, [Math.cos(a), -Math.sin(a), 0]), .09, .26, .09, '#B8F0C8', 1.1); }
      B.fim(g.chev);
      const top = pa(0); g.rub.position.set(top[0], top[1] + .1, -.5); g.rub.scale.setScalar(.95 * (1 + (RED() ? 0 : .03 * Math.sin(t * 3)))); g.rub.rotation.y = t * .15;
      // CO₂ chega à RuBisCO
      const kc = seg(qq, 0, .12), far = [-R * 1.3, R * 1.55, .8];
      if (qq < .14) { const p = lerp3(far, add(top, [-.2, .1, .7]), E().out(kc)); B.mol(g, 'co2', p, .85, [0, t, 0], 1, Pk.co2); B.ficha(g, p, 'CO₂', '#C9CFDC', { dy: -1.2, pr: 1 }); }
      // o composto anda pela roda
      const a = qq * TAU, p = add(pa(a), [0, 0, .5]);
      let lista;
      if (qq < .12) lista = [[5, 'RuBP (5 C)']]; else if (qq < .2) lista = [[6, '6 C instável']]; else if (qq < .45) lista = [[3, '2 compostos de 3 C'], [3]]; else if (qq < .62) lista = [[3, '2 G3P (3 C)'], [3]]; else lista = [[3, volta === 2 && qq < .72 ? 'G3P' : 'parte refaz a RuBP'], [volta === 2 ? 0 : 2], [volta === 2 ? 0 : 1, volta < 2 ? '1 C fica para o G3P' : '']];
      if (qq >= .72 && qq < .9) lista = [[5, 'RuBP refeita (5 C)']]; if (qq >= .9) lista = [[5, 'RuBP (5 C)']];
      lista.forEach((it, j) => { if (!it[0]) return; const pp = add(p, [0, 0, j * .7]), cor = qq >= .45 && qq < .72 ? '#FFE1A6' : '#9AA3B2'; B.mol(g, B.MOL.cad(it[0], cor), pp, 1.0, [0, .3, -a], 1, Pk.mol); if (it[1]) B.ficha(g, pp, it[1], '#C9CFDC', { dy: 0, pr: 3 }); });
      // ATP e NADPH entram na redução; ATP na regeneração
      const entra = (q0, tipo, fi, cor, dir) => { const k = seg(qq, q0, q0 + .13); if (k <= 0 || k >= 1) return; const p0 = pa(q0 * TAU + .25), d = B.V.nrm(p0), o = add(p0, mul(d, 2.1 * (1 - E().out(seg(k, 0, .7))))); B.mol(g, tipo, add(o, dir || [0, 0, 0]), (tipo === 'atp' ? .45 : .7) * surge(k), [0, t, 0], 1, Pk.atp); B.ficha(g, add(o, dir || [0, 0, 0]), fi, cor, { dy: d[1] > .3 ? -1.2 : 1.2, pr: 2 }); };
      entra(.3, 'atp', '2 ATP', '#FFB870', [0, 0, .3]); entra(.36, 'nadh', '2 NADPH', '#9CC8FF', [0, 0, .6]); entra(.75, 'atp', 'ATP', '#FFB870', [0, 0, .3]);
      // na 3ª volta, 1 G3P sai do ciclo para formar açúcar
      if (volta === 2) { const k = seg(qq, .62, .82); if (k > 0 && k < 1) { const p0 = pa(.62 * TAU), o = add(p0, mul(B.V.nrm(p0), 2.6 * E().out(k))); B.mol(g, B.MOL.cad(3, '#FFE1A6'), add(o, [0, 0, .6]), 1.0 * surge(k), [0, t, 0], 1, Pk.g3p); B.ficha(g, add(o, [0, 0, .6]), '1 G3P sai: vira glicose e amido', '#FFE1A6', { dy: 1.3, pr: 1 }); } }
      const c = q0 => (qq >= q0 ? 1 : 0);
      g.cont = { co2: volta + c(.12), atp: volta * 3 + 2 * c(.4) + c(.85), nadph: volta * 2 + 2 * c(.46), g3p: volta === 2 ? c(.7) : 0 };
      g.vis.rub = 1; g.anc.rub = add(top, [-.9, .5, .4]);
    },
    camera(g) { return B.viva({ th: .1, fi: .1, d: B.enquadrar(g, g.R + 2.7 + (NAR ? .4 : 0), g.R + 2.3 + (NAR ? .4 : 0)), al: [0, .1, 0] }, g.t, 1.2); },
    sobre(g) {
      B.texto(g, [0, .35, 0], 'Ciclo de Calvin', { f: FH, s: NAR ? 15 : 17, w: 600, c: C.txt });
      B.texto(g, [0, -.35, 0], `volta ${g.volta + 1} de 3`, { s: 13, w: 600, c: '#B8F0C8' });
      const R = g.R, est = [[.06, '1. fixação'], [.36, '2. redução'], [.8, '3. regeneração']];
      est.forEach(([q0, s], i) => { const a = q0 * TAU, on = [g.q < .2, g.q >= .2 && g.q < .72, g.q >= .72][i], r = R + (NAR ? 1.3 : 1.1); B.texto(g, NAR && i === 0 ? [Math.sin(.75) * r, Math.cos(.75) * r, 0] : [Math.sin(a) * r + (i === 0 ? 1.3 : 0), Math.cos(a) * r, 0], s, { s: 13, w: on ? 700 : 500, c: on ? C.txt : C.dim }); });
      const c = g.cont, x = NAR ? 14 : 22, y = NAR ? 62 : 80, lh = NAR ? 18 : 20, L = [['CO₂ fixados', c.co2, 3], ['ATP usados', c.atp, 9], ['NADPH usados', c.nadph, 6], ['G3P que sai', c.g3p, 1]];
      X.save(); rr(x - 6, y - 12, NAR ? 168 : 192, lh * 5 + 4, 10, 'rgba(11,15,28,.62)', 'rgba(255,255,255,.1)', 1);
      tx('a cada 3 voltas', x + 4, y, { a: 'left', s: 12, w: 600, c: C.dim, bg: false });
      L.forEach((l, i) => { tx(l[0], x + 4, y + (i + 1) * lh, { a: 'left', s: 13, w: 600, c: C.txt, bg: false }); tx(l[1] + ' de ' + l[2], x + (NAR ? 156 : 180), y + (i + 1) * lh, { a: 'right', s: 12, f: FD, w: 500, c: '#B8F0C8', bg: false }); });
      X.restore();
    },
    legenda: g => (g.q < .2 ? '1. Fixação: a enzima RuBisCO une o CO₂ à RuBP (5 C); entra um carbono por volta' : g.q < .72 ? '2. Redução: ATP e NADPH da fase clara formam G3P; a cada 3 voltas, um G3P sai e vira açúcar' : '3. Regeneração: com mais ATP, o restante do G3P refaz a RuBP')
  });
})();
