/* LAB Bioenergética: cenas 3D de C3, C4 e CAM e das relações entre os processos (Martin). Kit: bio3d.js; o desenho 2D antigo fica como plano B. */
'use strict';
(function () {
  if (!window.BIO3D) return;
  const B = BIO3D, { cl, seg, add, lerp3, fr, hash, trilha, bez, surge, TAU } = B.V;
  const E = () => B.E(), RED = () => B.REDUZ();
  const pc = (nome, cor, frase) => ({ nome, cor, frase });
  const ss = x => { x = cl(x, 0, 1); return x * x * (3 - 2 * x); };
  const ATOMO_S = { a: [[0, 0, 0, .36, '#F2D24B']], b: [] };
  // barra de medidor desenhada por cima do 3D
  function barra(x, y, w, k, cor, rot) {
    tx(rot, x, y, { a: 'left', s: 12, w: 600, c: C.dim, bg: false });
    rr(x, y + 9, w, 8, 4, 'rgba(255,255,255,.10)'); if (k > .01) rr(x, y + 9, Math.max(8, w * cl(k, 0, 1)), 8, 4, cor);
  }

  // =====================================================================================
  // C3, C4 e CAM: três cortes de folha com volume, estômatos que abrem e fecham, dia e noite
  // =====================================================================================
  {
    const TIPOS = [
      { k: 'C3', ex: 'trigo, arroz, soja, feijão', exs: 'trigo, arroz, feijão' },
      { k: 'C4', ex: 'cana-de-açúcar, milho, capins', exs: 'cana, milho' },
      { k: 'CAM', ex: 'cactos, abacaxi, agave', exs: 'cactos, abacaxi' }];
    const estado = (k, D, h, cyc) => k === 0 ? { ab: D * (1 - .8 * h), fix: D * (1 - .7 * h), agua: 1 - .55 * h, foto: D * h }
      : k === 1 ? { ab: D * (1 - .6 * h), fix: D * (1 - .12 * h), agua: (1 - .6 * h) * .55, foto: 0 }
        : { ab: (1 - D) * .9, fix: D * .5, agua: .2 - .1 * h, foto: 0, vac: cyc < .5 ? 1 - cyc * 2 : (cyc - .5) * 2 };
    B.cena('fatores/c4cam', {
      fit: 22, raio: 10, moleculas: 420,
      pecas: {
        c3: pc('Folha C3', '#5FCB86', 'O CO₂ vai direto para o ciclo de Calvin nas células do mesofilo. No calor e na seca o estômato fecha e a RuBisCO passa a usar O₂: é a fotorrespiração.'),
        c4: pc('Folha C4', '#3FBF6A', 'O mesofilo prende o CO₂ num composto de 4 carbonos e o leva à bainha do feixe, onde fica o ciclo de Calvin. Separa as etapas no espaço.'),
        cam: pc('Folha CAM', '#8FD9A4', 'Abre o estômato à noite e guarda o CO₂ como ácido no vacúolo. De dia, de estômato fechado, usa esse CO₂. Separa as etapas no tempo.'),
        est: pc('Estômato', '#3FBF6A', 'Poro entre duas células-guarda. Aberto, deixa entrar CO₂ e sair vapor de água.'),
        calvin: pc('Ciclo de Calvin', '#B8F0C8', 'Onde a RuBisCO fixa o CO₂. Gira mais rápido quando a folha fixa mais carbono.'),
        bainha: pc('Bainha do feixe', '#2E9E58', 'Células em volta da nervura nas plantas C4. Ali o CO₂ é solto e concentrado para a RuBisCO.'),
        vac: pc('Vacúolo', '#5FB7E0', 'Na planta CAM, guarda à noite o CO₂ preso como ácido. Enche de noite e esvazia de dia.'),
        co2: pc('CO₂', '#9AA3B2', 'Entra pelo estômato aberto.'),
        agua: pc('Vapor de água', '#FF8A8A', 'Sai pelo estômato aberto. Quanto mais tempo aberto no calor, mais água a planta perde.')
      },
      rotulos: [{ pc: 'est', t: 'estômato' }, { pc: 'bainha', t: 'bainha do feixe' }, { pc: 'vac', t: 'vacúolo' }],
      montar(g) {
        const T = g.T;
        g.pain = [0, 1, 2].map(i => { const gr = new T.Group(); g.raiz.add(gr); return gr; });
        const mEpi = B.fis(g, '#B9E8B4', { p: { roughness: .45, clearcoat: .7, transparent: true, opacity: .9 }, rim: '#E8FFE8', rimK: .3 });
        const mGu = B.fis(g, '#3FBF6A', { p: { roughness: .4, clearcoat: .7, sheen: .5 }, rim: '#D8FFE0', rimK: .4 });
        const mCel = B.fis(g, '#FFFFFF', { p: { roughness: .45, clearcoat: .55, sheen: .5, sheenColor: new T.Color('#E8FFE8') }, rim: '#E0FFE8', rimK: .3 });
        const mAnel = B.emis(g, '#B8F0C8', .5, { roughness: .35 });
        g.cel = []; g.gu = []; g.anel = []; g.vac = null; g.vacIn = null;
        g.pain.forEach((gr, i) => {
          const id = ['c3', 'c4', 'cam'][i];
          const sup = B.peca(g, B.caixaR(g, 2.1, .13, .72, .08, 2), mEpi, id, gr); sup.position.y = 1.5;
          [-1, 1].forEach(s => { const inf = B.peca(g, B.caixaR(g, .82, .12, .72, .08, 2), mEpi, id, gr); inf.position.set(s * 1.28, -1.5, 0); });
          const gu = [-1, 1].map(() => { const m = B.peca(g, B.capsula(g, .2, .6, 14), mGu, 'est', gr); m.rotation.x = Math.PI / 2; m.position.y = -1.5; return m; }); g.gu.push(gu);
          const W = B.inst(g, B.esfera(g, 18), mCel, 40, gr, g.pecas[id]); g.pick.push(W.m); g.cel.push(W);
          const an = B.peca(g, B.toro(g, .07, 40), mAnel, 'calvin', gr); g.anel.push(an);
          if (i === 1) { const nerv = B.peca(g, B.cilindro(g, 20), B.fis(g, '#E8E0B0', { p: { roughness: .5, clearcoat: .4 } }), 'bainha', gr); nerv.rotation.x = Math.PI / 2; nerv.scale.set(.3, 1.3, .3); nerv.position.set(.75, .15, 0); }
          if (i === 2) {
            g.vac = B.peca(g, B.esfera(g, 28), B.filme(g, '#7FD0F0', { cor2: '#E0F6FF', dentro: '#0E2C3E', base: .05, fr: .55 }), 'vac', gr); g.vac.position.set(-.85, .35, .15); g.vac.scale.setScalar(.72); g.vac.renderOrder = 3;
            g.vacIn = B.peca(g, B.esfera(g, 24), B.fis(g, '#5FB7E0', { p: { roughness: .25, clearcoat: .9, transparent: true, opacity: .85 } }), 'vac', gr); g.vacIn.position.copy(g.vac.position);
          }
        });
      },
      animar(g, P) {
        const t = g.t, dep = B.deitado(g), Pk = g.pecas, hh = P.S.v / 100, cyc = fr(t / 16), D = ss(Math.sin(cyc * TAU) * 2.5 + .5);
        g.D = D; g.cyc = cyc; g.hh = hh; g.dep = dep; g.E = [0, 1, 2].map(i => estado(i, D, hh, cyc));
        g.hemi.intensity = .16 + .3 * D;
        g.pain.forEach((gr, i) => {
          const Es = g.E[i], id = ['c3', 'c4', 'cam'][i], W = g.cel[i];
          gr.position.set(...(dep ? [(i - 1) * 5.3, 1.25, 0] : [-1.45, (1 - i) * 4.25 - .25, 0])); gr.rotation.set(.12, dep ? (i - 1) * -.12 : .18, 0); gr.scale.setScalar(dep ? 1 : .86);
          // estômato: as duas células-guarda se afastam quando abre
          const gap = .04 + .22 * Es.ab; g.gu[i][0].position.x = -(gap + .2); g.gu[i][1].position.x = gap + .2;
          // células
          const cor = i === 2 ? '#7CCB8E' : '#5FCB86';
          if (i === 0) {
            for (let k = 0; k < 7; k++) B.put(g, W, [-1.65 + k * .55, .78, (k % 2 - .5) * .3], null, .24, .52, .24, cor, 1, Pk[id]);
            for (let k = 0; k < 9; k++) { const x = -1.7 + (k % 5) * .85 + (k > 4 ? .42 : 0), y = k > 4 ? -.85 : -.15; if (Math.abs(x) < .45 && y < -.5) continue; B.put(g, W, [x, y, (hash(k, 2) - .5) * .5], null, .3, .3, .3, '#4FB874', 1, Pk[id]); }
          } else if (i === 1) {
            for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; B.put(g, W, [.75 + Math.cos(a) * .6, .15 + Math.sin(a) * .6, 0], null, .25, .25, .4, '#2E9E58', 1, Pk.bainha); }
            [[-1.15, .75], [-1.6, -.2], [-.9, -.5], [-.4, .9], [1.75, .95], [1.8, -.6], [.3, -.9], [-1.65, .9]].forEach((c, k) => B.put(g, W, [c[0], c[1], (hash(k, 4) - .5) * .4], null, .28, .28, .34, '#6FD392', 1, Pk[id]));
          } else {
            [[.95, .45], [.95, -.55], [-.85, -.75], [-1.75, .9], [1.8, .9]].forEach((c, k) => B.put(g, W, [c[0], c[1], -.15], null, k > 2 ? .3 : .5, k > 2 ? .3 : .45, .5, cor, 1, Pk[id]));
            g.vacIn.scale.setScalar(.12 + .55 * (Es.vac || 0)); g.vac.material.uniforms.uT.value = t;
          }
          B.fim(W);
          // ciclo de Calvin: anel que gira conforme a fixação
          const an = g.anel[i], ap = i === 0 ? [0, .2, .78] : i === 1 ? [.75, .15, .7] : [.95, .45, .7];
          an.position.set(...ap); an.scale.setScalar(i === 1 ? .32 : .36); an.rotation.z = (an.rotation.z || 0) - (RED() ? 0 : g.dt * 2.6 * Es.fix); an.material.emissiveIntensity = .25 + .9 * Es.fix;
          g.anc['p' + i] = B.mundo(g, gr, ap);
          // CO₂ entrando pelo estômato aberto
          const S0 = B.mundo(g, gr, [0, -2.4, .75]), S1 = B.mundo(g, gr, [0, -1.2, .75]), CV = B.mundo(g, gr, ap);
          if (i === 0 && Es.ab > .1) for (let j = 0; j < 2; j++) { const f = fr(t * .35 + j / 2); B.mol(g, 'co2', trilha([S0, S1, CV], f), .5 * surge(f) * cl(Es.ab * 3, 0, 1), [0, t + j, 0], 1, Pk.co2); }
          if (i === 1) {
            const Mz = B.mundo(g, gr, [-.9, -.3, .75]);
            for (let j = 0; j < 2; j++) { const f = fr(t * .3 + j / 2); if (Es.ab <= .1 && f < .5) continue; const p = trilha([S0, S1, Mz, CV], f), c4 = f > .5 && f < .85;
              B.mol(g, c4 ? B.MOL.cad(4, '#9AA3B2') : 'co2', p, (c4 ? .42 : .5) * surge(f), [0, t + j, 0], 1, Pk.co2); if (j === 0 && c4 && dep) B.ficha(g, p, '4 C', '#C9CFDC', { dy: -1, pr: 3 }); }
          }
          if (i === 2) {
            const VC = B.mundo(g, gr, [-.85, .35, .8]);
            if (D < .5) for (let j = 0; j < 2; j++) { const f = fr(t * .3 + j / 2); B.mol(g, 'co2', trilha([S0, S1, VC], f), .5 * surge(f), [0, t + j, 0], 1, Pk.co2); }
            else { const f = fr(t * .3); B.mol(g, 'co2', lerp3(VC, CV, E().move(f)), .5 * surge(f) * (Es.vac > .05 ? 1 : 0), [0, t, 0], 1, Pk.co2); }
          }
          // vapor de água saindo
          for (let j = 0; j < 2; j++) { const f = fr(t * .45 + j / 2 + i * .3); B.mol(g, 'h2o', lerp3(B.mundo(g, gr, [0, -1.6, .8]), B.mundo(g, gr, [j ? .9 : -.9, -2.15, .8]), f), .4 * surge(f) * cl(Es.ab * 2.5, 0, 1) * (.4 + .6 * Es.agua), [t, j, 0], 1, Pk.agua); }
          // fotorrespiração: O₂ chegando à RuBisCO da C3
          if (i === 0 && Es.foto > .3) { const f = fr(t * .3), p = lerp3(B.mundo(g, gr, [1.9, 1.2, .8]), CV, E().move(f)); B.mol(g, 'o2', p, .5 * surge(f), [0, t, 0], 1, Pk.calvin); }
        });
        g.vis.est = g.vis.bainha = g.vis.vac = 1;
        g.anc.est = B.mundo(g, g.pain[0], [1.25, -1.25, .7]); g.anc.bainha = B.mundo(g, g.pain[1], [1.4, -.2, .4]); g.anc.vac = B.mundo(g, g.pain[2], [-.85, 1.05, .4]);
      },
      camera(g) { const dep = B.deitado(g); return B.viva({ th: 0, fi: .1, d: dep ? B.enquadrar(g, 8.2, 4.1) : B.enquadrar(g, 3.7, 7.7), al: dep ? [0, .05, 0] : [0, .1, 0] }, g.t, .5); },
      sobre(g) {
        const dep = g.dep, D = g.D;
        // relógio de dia e noite
        const cw = Math.min(220, W * .5), cx0 = W / 2 - cw / 2, cy0 = NAR ? 56 : 28;
        rr(cx0, cy0 - 4, cw / 2, 8, 4, 'rgba(255,233,168,.4)'); rr(cx0 + cw / 2, cy0 - 4, cw / 2, 8, 4, 'rgba(120,138,190,.4)');
        X.beginPath(); X.arc(cx0 + cw * g.cyc, cy0, 7, 0, TAU); X.fillStyle = D > .5 ? '#FFE9A8' : '#C9CFDC'; X.fill(); X.lineWidth = 1.5; X.strokeStyle = 'rgba(11,15,28,.7)'; X.stroke();
        tx('dia', cx0 - 8, cy0, { a: 'right', s: 12, c: D > .5 ? C.txt : C.dim, bg: false }); tx('noite', cx0 + cw + 8, cy0, { a: 'left', s: 12, c: D > .5 ? C.dim : C.txt, bg: false });
        g.pain.forEach((gr, i) => {
          const T0 = TIPOS[i], Es = g.E[i];
          if (dep) {
            const q = B.tela(g, B.mundo(g, gr, [0, -2.2, 0])), w = Math.min(200, W * .25), x = q[0] - w / 2, y = Math.min(q[1] + 22, H - 150);
            tx(T0.k, x, y, { f: FH, s: 17, w: 700, a: 'left', c: C.txt, bg: false }); tx(T0.ex, x + tw(T0.k, 17, 700, FH) + 10, y + 1, { s: 12, a: 'left', c: C.dim, bg: false });
            barra(x, y + 14, w, Es.fix, '#5FCB86', 'Ciclo de Calvin agora'); barra(x, y + 44, w, Es.agua, '#5FB7E0', 'Água perdida no dia');
          } else {
            const q = B.tela(g, B.mundo(g, gr, [2.25, 1.3, 0])), x = q[0] + 4, w = Math.max(60, W - x - 14), y = q[1];
            tx(T0.k, x, y, { f: FH, s: 15, w: 700, a: 'left', c: C.txt, bg: false }); tx(T0.exs, x, y + 17, { s: 12, a: 'left', c: C.dim, bg: false });
            barra(x, y + 34, w, Es.fix, '#5FCB86', 'Ciclo de Calvin'); barra(x, y + 64, w, Es.agua, '#5FB7E0', 'Perda de água');
          }
          const tq = B.mundo(g, gr, i === 0 ? [0, -.25, .8] : i === 1 ? [.75, -.6, .8] : [.95, -.15, .8]);
          B.texto(g, tq, 'Calvin', { s: 12, w: 600, c: Es.fix > .1 ? '#DFFBE7' : C.dim, al: .95 });
          if (i === 0 && Es.foto > .3) B.texto(g, B.mundo(g, gr, [0, 2.0, 0]), 'fotorrespiração', { s: 12, w: 700, c: '#FF8A8A' });
          B.texto(g, B.mundo(g, gr, [0, dep ? -1.5 : -2.6, .9]), Es.ab > .15 ? 'estômato aberto' : 'estômato fechado', { s: 11, w: 600, c: C.dim, dy: dep ? 22 : 0 });
          if (i === 2 && g.D < .5) B.texto(g, B.mundo(g, gr, [0, 2.0, 0]), 'prende CO₂ como ácido', { s: 12, w: 700, c: '#9CC8FF' });
        });
      },
      legenda: g => (g.D > .5 ? (g.hh > .5 ? 'Dia quente e seco: a C3 fecha o estômato e perde para a fotorrespiração; a C4 quase não sente; a CAM usa o CO₂ guardado à noite' : 'Dia: C3 e C4 abrem os estômatos e fixam CO₂; a CAM fica fechada e usa o CO₂ guardado no vacúolo')
        : 'Noite: sem luz, C3 e C4 param o ciclo de Calvin; a CAM abre os estômatos, com o ar fresco, e guarda o CO₂ como ácido')
    });
  }

  // =====================================================================================
  // Fotossíntese e respiração: cloroplasto e mitocôndria trocando moléculas
  // =====================================================================================
  B.cena('relacao/ciclo', {
    fit: 18, raio: 8, moleculas: 360,
    pecas: {
      cloro: pc('Cloroplasto', '#3FBF6A', 'Faz a fotossíntese: usa luz, CO₂ e H₂O para formar glicose e liberar O₂.'),
      mito: pc('Mitocôndria', '#E07A5F', 'Faz a respiração: usa glicose e O₂ para formar ATP, liberando CO₂ e H₂O.'),
      ida: pc('Glicose e O₂', '#FFE1A6', 'Produtos da fotossíntese que a respiração consome.'),
      volta: pc('CO₂ e H₂O', '#9AA3B2', 'Produtos da respiração que a fotossíntese consome.'),
      amido: pc('Amido', '#F3E3B5', 'Reserva de glicose no cloroplasto. No escuro, a planta respira usando o amido que guardou.'),
      atp: pc('ATP', '#FF9A3C', 'A energia da glicose vai para o ATP, que a célula usa no trabalho. Parte vira calor.')
    },
    rotulos: [{ pc: 'cloro', t: 'cloroplasto' }, { pc: 'mito', t: 'mitocôndria' }],
    init(S) { S.gl = S.v / 100; },
    montar(g) {
      g.cl = B.cloroCorte(g, { r: 1.55, h: 3.5, grana: [[-.25, -1.75, -.6, 5], [.4, -.6, -.8, 6], [-.35, .55, -.7, 6], [.3, 1.65, -.6, 5]], pc: { env: 'cloro', estroma: 'cloro', granum: 'cloro', tila: 'cloro' } }); g.raiz.add(g.cl.grupo);
      g.mi = B.mitoCorte(g, { r: 1.35, h: 2.4, n: 5, pc: { ext: 'mito', int: 'mito', crista: 'mito', matriz: 'mito' } }); g.raiz.add(g.mi.grupo);
      g.amido = B.peca(g, B.lumpy(g, 'amido', 81, 3, 5, .1, .3, .7), B.fis(g, '#F3E3B5', { p: { roughness: .5, clearcoat: .5, sheen: .5 } }), 'amido', g.cl.grupo); g.amido.position.set(-.8, -1.0, -.1);
      g.rai = B.inst(g, B.esfera(g, 10), B.emis(g, '#FFE9A8', 2.2), 30);
      const mt = cor => B.fis(g, cor, { p: { roughness: .4, transparent: true, opacity: .32, depthWrite: false } });
      g.tA = B.tubo(g, 44, 8, mt('#FFE1A6')); g.tB = B.tubo(g, 44, 8, mt('#C9CFDC'));
    },
    animar(g, P) {
      const t = g.t, dep = B.deitado(g), Pk = g.pecas, S = P.S, v = S.v / 100;
      S.gl = S.gl == null ? v : S.gl + (v - S.gl) * Math.min(1, g.dt * 1.5); const gl = S.gl; g.gl = gl; g.dep = dep;
      const cg = g.cl.grupo, mg = g.mi.grupo;
      cg.rotation.set(0, 0, Math.PI / 2); mg.rotation.set(0, 0, Math.PI / 2);
      if (dep) { cg.position.set(-3.7, .1, 0); mg.position.set(3.9, .1, 0); } else { cg.position.set(0, 2.9, 0); mg.position.set(0, -2.9, 0); }
      cg.scale.setScalar(1); mg.scale.setScalar(1);
      const C0 = dep ? [-1.8, .9, .9] : [1.7, 2.6, .9], M0 = dep ? [2.2, .9, .9] : [1.6, -2.4, .9], M1 = dep ? [2.2, -.7, .9] : [-1.6, -2.4, .9], C1 = dep ? [-1.8, -.7, .9] : [-1.7, 2.6, .9];
      const A1 = [], A2 = []; for (let i = 0; i < 44; i++) { const u = i / 43; A1.push(bez(C0, dep ? [.2, 3.6, .9] : [3.6, 0, .9], M0, u)); A2.push(bez(M1, dep ? [.2, -3.4, .9] : [-3.6, 0, .9], C1, u)); }
      g.tA.set(A1, .05); g.tB.set(A2, .05);
      // luz chegando ao cloroplasto
      const src = dep ? [-6.4, 4.2, 1.5] : [-3.4, 6.6, 1.5], nr = Math.round(10 * gl);
      for (let i = 0; i < nr; i++) { const f = fr(t * .5 + i / 10), alvo = B.mundo(g, cg, [(hash(i, 3) - .5) * 1.6, (hash(i, 4) - .5) * 2.4, .6]), o = add(src, [(hash(i, 1) - .5) * 2.4, (hash(i, 2) - .5), 0]); for (let k = 0; k < 3; k++) { const ff = f - k * .04; if (ff > 0 && ff < 1) B.put(g, g.rai, lerp3(o, alvo, ff), null, .07 - k * .015, null, null, '#FFE9A8', 1.2 - k * .3); } }
      B.fim(g.rai);
      // ida: glicose e O₂ (com luz, da fotossíntese; no escuro, glicose do amido e O₂ do ar)
      const AM = B.mundo(g, cg, [-.8, -1.0, .4]), AR = dep ? [1.4, 4.3, .9] : [3.4, 1.6, .9];
      for (let i = 0; i < 2; i++) {
        const f = fr(t * .12 + i / 2);
        if (i === 0) { const k = gl, p = k > .5 ? trilha(A1, E().move(f)) : lerp3(AM, M0, E().move(f)); B.mol(g, 'glic', p, .5 * surge(f), [0, t * .6, 0], 1, Pk.ida); if (f > .15 && f < .85) B.ficha(g, p, k > .5 ? 'glicose' : 'glicose do amido', '#FFE1A6', { dy: -1.2, pr: 2 }); }
        else { const p = gl > .5 ? trilha(A1, E().move(f)) : lerp3(AR, M0, E().move(f)); B.mol(g, 'o2', p, .7 * surge(f), [0, t, 0], 1, Pk.ida); if (f > .15 && f < .85) B.ficha(g, p, gl > .5 ? 'O₂' : 'O₂ do ar', '#FF8A8A', { dy: -1.1, pr: 2 }); }
      }
      g.amido.scale.setScalar(.3 * (.75 + .25 * gl));
      // volta: CO₂ e H₂O (no escuro, saem da célula pelo ar)
      for (let i = 0; i < 2; i++) { const f = fr(t * .12 + i / 2 + .25), p = trilha(A2, E().move(f)), dim = gl > .1 ? 1 : (f < .6 ? 1 : 1 - seg(f, .6, .9)); B.mol(g, i ? 'h2o' : 'co2', p, (i ? .75 : .7) * surge(f) * dim, [0, t + i, 0], 1, Pk.volta); if (f > .15 && f < .85) B.ficha(g, p, i ? 'H₂O' : 'CO₂', i ? '#9CC8FF' : '#C9CFDC', { dy: 1.2, pr: 3 }); }
      // ATP e calor saindo da mitocôndria
      { const f = fr(t * .16), o = B.mundo(g, mg, [0, .9, .7]), p = lerp3(o, add(o, dep ? [2.7, -1.2, .3] : [2.1, 1.2, .3]), E().out(f)); B.mol(g, 'atp', p, .4 * surge(f), [0, 0, .3], 1, Pk.atp); if (f > .2 && f < .85) B.ficha(g, p, 'ATP', '#FFB870', { dy: -1, pr: 4 }); }
      for (let i = 0; i < 5; i++) { const f = fr(t * .3 + i / 5), o = B.mundo(g, mg, [(i - 2) * .35, -.3, .9]); B.brilho(g, add(o, [Math.sin(i * 2 + f * 4) * .2, f * 1.4, 0]), .12 * surge(f), '#FF7A4A', 1.4); }
      g.vis.cloro = g.vis.mito = 1; g.anc.cloro = B.mundo(g, cg, [-1.2, 1.4, .4]); g.anc.mito = B.mundo(g, mg, [-1.0, 1.1, .4]);
    },
    camera(g) { const dep = B.deitado(g); return B.viva({ th: 0, fi: .14, d: dep ? B.enquadrar(g, 7.2, 3.9) : B.enquadrar(g, 3.7, 6.2), al: [0, dep ? .15 : 0, 0] }, g.t, 1); },
    sobre(g) {
      const dep = g.dep;
      B.texto(g, B.mundo(g, g.cl.grupo, dep ? [-2.1, 0, 0] : [-1.9, 0, 0]), 'fotossíntese', { s: 13, w: 700, c: '#B8F0C8' });
      B.texto(g, B.mundo(g, g.mi.grupo, dep ? [-1.9, 0, 0] : [-1.75, 0, 0]), 'respiração', { s: 13, w: 700, c: '#FFC2AE' });
      if (g.gl > .05) B.texto(g, dep ? [-6.0, 4.6, 1.5] : [-3.0, 6.9, 1.5], 'luz', { s: 13, w: 700, c: '#FFE9A8', al: Math.min(1, g.gl * 2) });
    },
    legenda: (g, S) => (S.v === 0 ? 'No escuro a fotossíntese para, mas a respiração continua: a planta usa o amido que guardou' : 'Glicose e O₂ vão do cloroplasto para a mitocôndria; CO₂ e H₂O fazem o caminho de volta. A matéria circula; a energia flui')
  });

  // =====================================================================================
  // Ciclo do carbono: paisagem estilizada com os fluxos de CO₂
  // =====================================================================================
  B.cena('relacao/carbono', {
    fit: 26, raio: 12, moleculas: 700, ceu: '#D6E4FF', chao: '#3A2A1E',
    pecas: {
      ar: pc('CO₂ na atmosfera', '#9AA3B2', 'O reservatório que todos os fluxos ligam. Sobe quando a queima de fósseis supera o que a fotossíntese retira.'),
      arv: pc('Árvore', '#3FBF6A', 'Pela fotossíntese, tira CO₂ do ar e o transforma em matéria orgânica. Também respira e devolve parte dele.'),
      ani: pc('Animal', '#D9B38C', 'Obtém o carbono comendo plantas ou outros animais e devolve CO₂ pela respiração.'),
      dec: pc('Decompositores', '#C98A6E', 'Fungos e bactérias decompõem restos e cadáveres e devolvem o carbono como CO₂.'),
      fab: pc('Combustão', '#FF7A4A', 'A queima de carvão, petróleo e gás devolve ao ar, em décadas, carbono guardado há milhões de anos.'),
      fos: pc('Combustíveis fósseis', '#3A3A44', 'Restos de seres vivos soterrados há milhões de anos viraram carvão, petróleo e gás.'),
      solo: pc('Solo', '#7A5638', 'Guarda carbono em matéria orgânica, que os decompositores vão liberando.')
    },
    rotulos: [{ pc: 'arv', t: 'árvore' }, { pc: 'ani', t: 'animal' }, { pc: 'dec', t: 'decompositores' }, { pc: 'fab', t: 'fábrica' }, { pc: 'fos', t: 'carvão, petróleo e gás' }],
    montar(g) {
      const T = g.T;
      g.solo = B.peca(g, B.caixaR(g, 1, .5, 1, .12, 3), B.fis(g, '#6E8B3D', { p: { roughness: .7, clearcoat: .25 } }), 'solo');
      g.rocha = B.peca(g, B.caixaR(g, 1, .8, 1, .1, 2), B.fis(g, '#4A3A2E', { p: { roughness: .8, clearcoat: .1 } }), 'solo');
      g.fos = B.peca(g, B.lumpy(g, 'fos', 91, 3, 6, .12, .3, .7), B.fis(g, '#22222A', { p: { roughness: .3, clearcoat: .9 }, rim: '#8A8AA0', rimK: .4 }), 'fos');
      const mTr = B.fis(g, '#7A5638', { p: { roughness: .6, clearcoat: .3 } }), mFo = B.fis(g, '#3FBF6A', { p: { roughness: .5, clearcoat: .45, sheen: .6, sheenColor: new T.Color('#C8FFD8') }, rim: '#D8FFE0', rimK: .3 });
      g.arv = new T.Group(); g.raiz.add(g.arv);
      const tr = B.peca(g, B.cilindro(g, 16), mTr, 'arv', g.arv); tr.scale.set(.2, 1.6, .2); tr.position.y = .8;
      [[0, 2.2, 0, 1], [-.55, 1.75, .2, .72], [.55, 1.8, -.1, .75], [.1, 1.7, .5, .6]].forEach((c, i) => { const m = B.peca(g, B.lumpy(g, 'copa' + i, 60 + i, 3, 5, .1, .3, .7), mFo, 'arv', g.arv); m.position.set(c[0], c[1], c[2]); m.scale.setScalar(c[3]); });
      const mAn = B.fis(g, '#D9B38C', { p: { roughness: .5, clearcoat: .4, sheen: .5 } });
      g.ani = new T.Group(); g.raiz.add(g.ani);
      const corpo = B.peca(g, B.capsula(g, .42, .9, 16), mAn, 'ani', g.ani); corpo.rotation.z = Math.PI / 2; corpo.position.y = .78;
      const cab = B.peca(g, B.esfera(g, 18), mAn, 'ani', g.ani); cab.scale.set(.3, .27, .27); cab.position.set(.85, 1.08, 0); g.cab = cab;
      [[-.4, .25], [-.4, -.25], [.4, .25], [.4, -.25]].forEach(c => { const p = B.peca(g, B.cilindro(g, 10), mAn, 'ani', g.ani); p.scale.set(.09, .55, .09); p.position.set(c[0], .3, c[1]); });
      g.dec = new T.Group(); g.raiz.add(g.dec);
      const tora = B.peca(g, B.cilindro(g, 16), B.fis(g, '#6A4A30', { p: { roughness: .7 } }), 'dec', g.dec); tora.rotation.z = Math.PI / 2; tora.scale.set(.26, 1.4, .26); tora.position.set(0, .26, -.2);
      [[-.35, .9, .2, 1], [.3, .7, .3, .75], [.0, .6, .45, .55]].forEach(c => { const pe = B.peca(g, B.cilindro(g, 10), B.fis(g, '#EFE3CF', { p: { roughness: .5 } }), 'dec', g.dec); pe.scale.set(.06 * c[3], .4 * c[3], .06 * c[3]); pe.position.set(c[0], c[1] - .2 * c[3], c[2]); const ch = B.peca(g, B.esfera(g, 16), B.fis(g, '#C98A6E', { p: { roughness: .45, clearcoat: .6 } }), 'dec', g.dec); ch.scale.set(.28 * c[3], .14 * c[3], .28 * c[3]); ch.position.set(c[0], c[1], c[2]); });
      g.fab = new T.Group(); g.raiz.add(g.fab);
      const pr = B.peca(g, B.caixaR(g, .75, .35, .5, .06, 2), B.fis(g, '#8A93A8', { p: { roughness: .5, clearcoat: .5 } }), 'fab', g.fab); pr.position.y = .35;
      const ch = B.peca(g, B.cilindro(g, 16), B.fis(g, '#6F7890', { p: { roughness: .5, clearcoat: .5 } }), 'fab', g.fab); ch.scale.set(.16, 1.5, .16); ch.position.set(.45, .75, 0);
      for (let i = 0; i < 3; i++) { const j = B.peca(g, B.caixaR(g, .1, .08, .02, .02, 1), B.emis(g, '#FFE9A8', 1.4), null, g.fab); j.position.set(-.45 + i * .32, .38, .51); }
      g.fum = B.inst(g, B.esfera(g, 14), B.fis(g, '#9AA0AE', { p: { roughness: .9, transparent: true, opacity: .45, depthWrite: false } }), 14, g.raiz, g.pecas.fab);
      g.gota = B.inst(g, B.esfera(g, 10), B.fis(g, '#15151B', { p: { roughness: .2, clearcoat: 1 } }), 6, g.raiz, g.pecas.fos);
      const mt = cor => B.fis(g, cor, { p: { roughness: .4, transparent: true, opacity: .22, depthWrite: false } });
      g.tf = [['#5FCB86'], ['#E07A5F'], ['#E07A5F'], ['#F3D49B'], ['#FF7A4A']].map(c => B.tubo(g, 2, 8, mt(c[0])));
    },
    animar(g, P) {
      const t = g.t, dep = B.deitado(g), Pk = g.pecas, v = P.S.v / 100; g.dep = dep; g.v0 = v;
      const xs = dep ? [-6.2, -2.1, 1.9, 5.9] : [-2.6, -.85, .95, 2.7], s = dep ? 1 : .5, gy = dep ? -1.6 : -.6, hx = dep ? 8.4 : 3.6, sky = dep ? 2.7 : 4.6;
      g.xs = xs; g.gy = gy; g.sky = sky; g.s = s;
      g.solo.scale.set(hx, dep ? .5 : .35, dep ? 2.2 : 1.5); g.solo.position.set(0, gy - (dep ? .5 : .35), 0);
      g.rocha.scale.set(hx, dep ? .9 : .9, dep ? 2.2 : 1.5); g.rocha.position.set(0, gy - (dep ? 1.0 : .7) - (dep ? .9 : .9), 0);
      g.fos.scale.set(dep ? 1.5 : .9, dep ? .4 : .32, dep ? .9 : .6); g.fos.position.set(xs[3] + (dep ? 0 : -.15), gy - (dep ? 1.9 : 1.6), dep ? 1.3 : .9);
      g.arv.position.set(xs[0], gy, 0); g.ani.position.set(xs[1], gy, .2); g.dec.position.set(xs[2], gy, .2); g.fab.position.set(xs[3], gy, 0);
      [g.arv, g.ani, g.dec, g.fab].forEach(o => o.scale.setScalar(dep ? 1 : s * 1.1));
      g.arv.rotation.z = RED() ? 0 : Math.sin(t * .6) * .02; g.cab.position.y = 1.08 + (RED() ? 0 : Math.max(0, Math.sin(t * .8)) * -.12);
      // CO₂ espalhado na atmosfera: mais moléculas quanto mais queima
      const N = Math.round((dep ? 16 : 9) * (1 + v * 1.4));
      for (let i = 0; i < N; i++) { const x = -hx + .5 + hash(i, 1) * (hx * 2 - 1), y = sky + .2 + hash(i, 2) * (dep ? 1.0 : 1.4), z = (hash(i, 3) - .5) * 1.5; B.mol(g, 'co2', [x + (RED() ? 0 : Math.sin(t * .4 + i) * .2), y + (RED() ? 0 : Math.cos(t * .3 + i * 2) * .1), z], dep ? .42 : .3, [0, t * .3 + i, i], 1, Pk.ar); }
      // fluxos: fotossíntese desce, respiração, decomposição e combustão sobem
      const tops = sky, sk = dep ? 1 : .75;
      const F = [[xs[0] - .9 * sk, sky, gy + 2.2 * s * 1.1 + .1, 1], [xs[0] + .9 * sk, gy + 2.2 * s * 1.1 + .1, tops, 1], [xs[1], gy + 1.4 * s * 1.1 + .1, tops, 1], [xs[2], gy + 1.0 * s * 1.1 + .1, tops, 1], [xs[3] + .45 * s * 1.1, gy + 1.6 * s * 1.1 + .1, tops, v]];
      const pcs = [Pk.arv, Pk.arv, Pk.ani, Pk.dec, Pk.fab];
      g.F = F;
      F.forEach(([x, y1, y2, k], i) => {
        g.tf[i].set([[x, y1, 1.1], [x, y2, 1.1]], k > .01 ? .022 + .02 * k : .0001);
        if (k <= .01) return; const n = k > .6 ? 3 : 2;
        for (let j = 0; j < n; j++) { const f = fr(t * .2 + j / n + i * .13); B.mol(g, 'co2', [x, y1 + (y2 - y1) * f, 1.1], (dep ? .42 : .3) * surge(f), [0, t + j, 0], 1, pcs[i]); }
      });
      // fumaça e petróleo subindo do subsolo
      for (let i = 0; i < 14; i++) { const f = fr(t * .18 + i / 14), b = [xs[3] + .45 * s * 1.1, gy + 1.55 * s * 1.1, 0]; const sc = (.15 + .5 * f) * (dep ? 1 : .55) * v; B.put(g, g.fum, add(b, [Math.sin(i * 1.7) * .3 * f, f * (dep ? 1.5 : 1.0), (hash(i, 2) - .5) * .4]), null, sc, null, null, '#9AA0AE', 1 - f * .5, Pk.fab); }
      B.fim(g.fum);
      for (let i = 0; i < 6; i++) { const f = fr(t * .25 + i / 6), y0 = gy - (dep ? 1.9 : 1.6), y1 = gy; B.put(g, g.gota, [xs[3] - (dep ? .4 : .3), y0 + (y1 - y0) * f, dep ? 1.3 : .9], null, (dep ? .09 : .06) * surge(f) * (v > 0 ? 1 : 0), null, null, '#15151B', 1, Pk.fos); }
      B.fim(g.gota);
      g.vis.arv = g.vis.ani = g.vis.dec = g.vis.fab = g.vis.fos = 1;
      g.anc.arv = B.mundo(g, g.arv, [-.6, 2.5, .3]); g.anc.ani = B.mundo(g, g.ani, [-.5, 1.3, .3]); g.anc.dec = B.mundo(g, g.dec, [.4, 1.0, .4]); g.anc.fab = B.mundo(g, g.fab, [-.5, .8, .5]); g.anc.fos = add(g.fos.position.toArray(), [dep ? -1.0 : -.5, 0, .3]);
    },
    camera(g) { const dep = B.deitado(g); return B.viva({ th: 0, fi: .1, d: dep ? B.enquadrar(g, 8.6, 4.0) : B.enquadrar(g, 3.8, 4.6), al: dep ? [0, .75, 0] : [0, 1.7, 0] }, g.t, .5); },
    sobre(g) {
      const dep = g.dep, F = g.F, xs = g.xs, gy = g.gy, s = g.s;
      const nom = ['fotossíntese', 'respiração', 'respiração', 'decomposição', 'combustão'], cor = ['#B8F0C8', '#FFC2AE', '#FFC2AE', '#F3E3B5', '#FFB59A'];
      F.forEach(([x, y1, y2, k], i) => { if (k <= .01 || (i === 1 && !dep)) return; if (dep) B.texto(g, [x + (i === 0 ? -.15 : .15), (y1 + y2) / 2, 1.1], nom[i], { s: 12, w: 700, c: cor[i], a: i === 0 ? 'right' : 'left', dx: i === 0 ? -6 : 6 }); else B.texto(g, [x, y1 + (y2 - y1) * (i % 2 ? .62 : .38), 1.1], nom[i], { s: 11, w: 700, c: cor[i] }); });
      if (dep) { B.texto(g, [(xs[0] + xs[1]) / 2, gy + .35, 1], 'alimento', { s: 12, c: C.dim }); B.texto(g, [(xs[1] + xs[2]) / 2, gy + .35, 1], 'restos', { s: 12, c: C.dim }); }
      B.texto(g, [0, g.sky + (dep ? 1.45 : 1.75), 0], 'CO₂ na atmosfera', { s: 13, w: 700, c: C.txt });
      // medidor do CO₂ no ar
      const w = NAR ? 112 : 160, x = NAR ? 14 : W - w - 28, y = NAR ? 62 : 90, k = .3 + .6 * g.v0;
      rr(x - 6, y - 12, w + 12, 44, 10, 'rgba(11,15,28,.62)', 'rgba(255,255,255,.1)', 1);
      barra(x, y, w, k, g.v0 > .5 ? '#FF8A6A' : '#C9CFDC', g.v0 > 0 ? 'CO₂ no ar subindo' : 'CO₂ no ar estável');
    },
    legenda: (g, S) => (S.v === 0 ? 'Sem queima de fósseis, o CO₂ devolvido pela respiração e pela decomposição equivale ao que a fotossíntese retirou' : 'A combustão devolve ao ar, em décadas, carbono guardado há milhões de anos: o CO₂ da atmosfera sobe')
  });

  // =====================================================================================
  // Quimiossíntese: fonte hidrotermal, tapetes de bactérias e uma bactéria em destaque
  // =====================================================================================
  B.cena('relacao/quimio', {
    fit: 20, raio: 9, moleculas: 360, ceu: '#7FA8D8', chao: '#20140E',
    pecas: {
      fonte: pc('Fonte hidrotermal', '#5A4A3E', 'Chaminé no fundo do mar que solta água muito quente, rica em H₂S e minerais. Ali não chega luz.'),
      bac: pc('Bactéria quimiossintetizante', '#F2D24B', 'Oxida o H₂S com O₂ e usa a energia liberada para fixar CO₂ em açúcar. É autótrofa sem usar luz.'),
      oxi: pc('Oxidação do H₂S', '#F2D24B', 'H₂S mais O₂ formam enxofre e água, liberando energia, guardada como ATP.'),
      fix: pc('Fixação do CO₂', '#5FCB86', 'Com a energia da oxidação, a bactéria transforma CO₂ em açúcar, como no ciclo de Calvin.'),
      verme: pc('Vermes tubícolas', '#E05A6A', 'Vivem junto às fontes e abrigam bactérias quimiossintetizantes que os alimentam. A base da cadeia alimentar ali é a quimiossíntese.'),
      tapete: pc('Tapete de bactérias', '#E8E2C8', 'Colônias de bactérias quimiossintetizantes que cobrem as rochas perto da fonte.')
    },
    rotulos: [{ pc: 'fonte', t: 'fonte hidrotermal' }, { pc: 'verme', t: 'vermes tubícolas' }, { pc: 'oxi', t: 'oxidação' }, { pc: 'fix', t: 'fixação do CO₂' }],
    montar(g) {
      const T = g.T;
      g.chao = B.peca(g, B.caixaR(g, 1, .3, 1, .12, 3), B.fis(g, '#2A201A', { p: { roughness: .8, clearcoat: .15 } }), 'fonte');
      const pts = [[.0, 0], [1.05, 0], [.9, .5], [.78, 1.2], [.66, 1.9], [.52, 2.6], [.42, 3.0], [.0, 3.0]].map(p => new T.Vector2(p[0] + 1e-4, p[1]));
      g.ch = new T.Mesh(new T.LatheGeometry(pts, g.q.cel ? 20 : 30), B.fis(g, '#4A3A2E', { p: { roughness: .85, clearcoat: .2 }, rim: '#FF9A5A', rimK: .25 })); g.geos.push(g.ch.geometry); g.raiz.add(g.ch); g.ch.userData.peca = g.pecas.fonte; g.pick.push(g.ch);
      g.boca = B.peca(g, B.toro(g, .1, 24), B.emis(g, '#FF8A3C', 2.4), null, g.ch); g.boca.rotation.x = Math.PI / 2; g.boca.position.y = 3.0; g.boca.scale.setScalar(.42);
      g.plu = B.inst(g, B.esfera(g, 14), B.fis(g, '#2E2E36', { p: { roughness: .95, clearcoat: 0, transparent: true, opacity: .72, depthWrite: false } }), 16, g.raiz, g.pecas.fonte);
      g.tub = B.inst(g, B.cilindro(g, 12), B.fis(g, '#EDE6DA', { p: { roughness: .5, clearcoat: .5 } }), 9, g.raiz, g.pecas.verme); g.pick.push(g.tub.m);
      g.plm = B.inst(g, B.esfera(g, 14), B.fis(g, '#E05A6A', { p: { roughness: .4, clearcoat: .7, sheen: .6 }, rim: '#FFC0C8', rimK: .4 }), 9, g.raiz, g.pecas.verme); g.pick.push(g.plm.m);
      g.tap = B.inst(g, B.esfera(g, 12), B.fis(g, '#E8E2C8', { p: { roughness: .6, clearcoat: .3, sheen: .5 } }), 40, g.raiz, g.pecas.tapete); g.pick.push(g.tap.m);
      // bactéria em destaque: parede translúcida, citoplasma e os dois sítios
      g.bac = new T.Group(); g.raiz.add(g.bac);
      g.par = B.peca(g, B.capsula(g, 1.3, 3.6, 28), B.filme(g, '#F2D24B', { cor2: '#FFF4C8', dentro: '#2A2410', base: .04, fr: .5, esc: 1.2 }), 'bac', g.bac); g.par.rotation.z = Math.PI / 2; g.par.renderOrder = 3;
      g.oxi = B.peca(g, B.esfera(g, 24), B.fis(g, '#F2D24B', { p: { roughness: .35, clearcoat: .8, transparent: true, opacity: .8 }, rim: '#FFF4C8', rimK: .5 }), 'oxi', g.bac); g.oxi.position.set(-1.25, 0, 0); g.oxi.scale.setScalar(.6);
      g.anel = B.peca(g, B.toro(g, .09, 40), B.emis(g, '#7FD49B', .7, { roughness: .35 }), 'fix', g.bac); g.anel.position.set(1.25, 0, 0); g.anel.scale.setScalar(.58);
      g.tE = B.tubo(g, 2, 8, B.fis(g, '#FFE9A8', { p: { roughness: .4, transparent: true, opacity: .3, depthWrite: false } }), g.bac);
    },
    animar(g) {
      const t = g.t, dep = B.deitado(g), Pk = g.pecas; g.dep = dep;
      const V = dep ? [-5.2, -2.6, -.4] : [-1.9, -3.9, -.3], vs = dep ? 1 : .72, fy = V[1];
      g.chao.scale.set(dep ? 9 : 4.2, .3, 2.4); g.chao.position.set(0, fy - .3, 0);
      g.ch.position.set(...V); g.ch.scale.setScalar(vs);
      const boca = [V[0], fy + 3.0 * vs, V[2]]; g.boca.material.emissiveIntensity = 1.8 + (RED() ? 0 : .6 * Math.sin(t * 3));
      for (let i = 0; i < 16; i++) { const f = fr(t * .12 + i / 16), k = Math.sin(i * 3.3); B.put(g, g.plu, add(boca, [k * (.2 + f * 1.2) * vs, f * 3.0 * vs, (hash(i, 2) - .5) * .5]), null, (.2 + f * .55) * vs, null, null, '#2E2E36', 1 - f * .5, Pk.fonte); }
      B.fim(g.plu);
      // vermes tubícolas junto da base da fonte
      for (let i = 0; i < 9; i++) { const x = V[0] + (dep ? 1.6 : 1.2) + (i % 3) * .3 * vs + hash(i, 1) * .15, z = V[2] + .6 + Math.floor(i / 3) * .28 - .3, h = (.7 + .5 * hash(i, 2)) * vs, sw = RED() ? 0 : Math.sin(t * 1.3 + i) * .05; B.put(g, g.tub, [x + sw * h / 2, fy + h / 2, z], null, .06 * vs, h, .06 * vs, '#EDE6DA', 1, Pk.verme); B.put(g, g.plm, [x + sw * h, fy + h + .06, z], null, .13 * vs, .16 * vs, .13 * vs, '#E05A6A', 1, Pk.verme); }
      B.fim(g.tub); B.fim(g.plm);
      for (let i = 0; i < 40; i++) { const x = V[0] - 1.6 * vs + hash(i, 1) * (dep ? 6.5 : 3.6), z = (hash(i, 2) - .2) * 1.6; if (Math.abs(x - V[0]) < .9 * vs && z < .6) continue; B.put(g, g.tap, [x, fy + .02, z], null, .22 + .18 * hash(i, 3), .06, .22 + .18 * hash(i, 4), hash(i, 5) > .5 ? '#E8E2C8' : '#F2E4A0', 1, Pk.tapete); }
      B.fim(g.tap);
      // bactéria
      const bp = dep ? [2.4, .4, .3] : [0, 2.4, .3], bs = dep ? 1 : .9; g.bac.position.set(...bp); g.bac.scale.setScalar(bs); g.bac.rotation.set(.08, dep ? -.15 : 0, 0);
      g.par.material.uniforms.uT.value = t; g.anel.rotation.z = RED() ? 0 : -t * .8;
      const O = B.mundo(g, g.bac, [-1.25, 0, .3]), Fx = B.mundo(g, g.bac, [1.25, 0, .3]);
      g.tE.set([[-.62, 0, .2], [.62, 0, .2]], .05);
      for (let i = 0; i < 3; i++) { const f = fr(t * .5 + i / 3); B.brilho(g, B.mundo(g, g.bac, [-.62 + 1.24 * f, Math.sin(f * 9) * .06, .25]), .1 * Math.sin(f * Math.PI), '#FFE9A8', 2); }
      const fl = (A, Bp, f, tipo, s, nome, cor, pr, dy) => { if (f <= 0 || f >= 1) return; const p = lerp3(A, Bp, E().move(f)); B.mol(g, tipo, p, s * surge(f) * (dep ? 1 : .8), [0, t * .7, 0], 1); if (nome && f > .12 && f < .88) B.ficha(g, p, nome, cor, { dy: dy == null ? -1.2 : dy, pr }); };
      const u = t * .12, top = dep ? 3.9 : 5.9;
      fl(add(boca, [.3, .4, 0]), add(O, [-.3, -.35, 0]), fr(u), 'h2s', .7, 'H₂S', '#F2E4A0', 2); fl(add(boca, [.3, .4, 0]), add(O, [-.3, -.35, 0]), fr(u + .5), 'h2s', .7);
      fl([O[0] - .6, top, O[2]], add(O, [0, .4, 0]), fr(u + .3), 'o2', .7, 'O₂', '#FF8A8A', 3);
      fl(add(O, [0, -.4, 0]), [O[0] + .4, dep ? fy + .6 : O[1] - 2.1, O[2] + .4], fr(u + .7), ATOMO_S, .9, 'enxofre', '#F2E4A0', 4, 1.1); fl(add(O, [.2, -.4, 0]), [O[0] + .9, dep ? fy + .9 : O[1] - 1.9, O[2] + .4], fr(u + .75), 'h2o', .65, 'H₂O', '#9CC8FF', 5, 1.1);
      fl([Fx[0] + .4, top, Fx[2]], add(Fx, [0, .4, 0]), fr(u + .15), 'co2', .75, 'CO₂', '#C9CFDC', 3);
      fl(add(Fx, [0, -.4, 0]), [Fx[0] + .6, dep ? fy + .8 : Fx[1] - 2.1, Fx[2] + .4], fr(u + .6), 'glic', .55, 'açúcar', '#FFE1A6', 2, 1.1);
      g.vis.fonte = g.vis.verme = 1; g.vis.oxi = g.vis.fix = dep ? 1 : 0;
      g.anc.fonte = add(boca, [-.4 * vs, dep ? -1.2 * vs : .4, .3]); g.anc.verme = [V[0] + (dep ? 2.0 : 1.5), fy + (dep ? 1.2 : .4) * vs, V[2] + .8]; g.fundoP = [V[0], fy + .6, V[2]]; g.anc.oxi = B.mundo(g, g.bac, [-1.25, dep ? .65 : -1.5, .4]); g.anc.fix = B.mundo(g, g.bac, [1.25, dep ? .65 : -1.5, .4]);
    },
    camera(g) { const dep = B.deitado(g); return B.viva({ th: .05, fi: .1, d: dep ? B.enquadrar(g, 7.6, 4.1) : B.enquadrar(g, 3.4, 6.4), al: dep ? [-.4, .15, 0] : [0, .5, 0] }, g.t, .8); },
    sobre(g) {
      B.texto(g, B.mundo(g, g.bac, [0, .32, .5]), 'energia (ATP)', { s: 12, w: 700, c: '#FFE9A8' });
      if (g.dep || !g.fundoP) tx('fundo do mar, sem luz', W - 14, NAR ? 62 : 84, { a: 'right', s: 12, c: C.dim }); else B.texto(g, g.fundoP, 'fundo do mar, sem luz', { s: 12, w: 600, c: C.dim });
      B.texto(g, B.mundo(g, g.bac, [0, g.dep ? -1.75 : 1.9, 0]), 'bactéria quimiossintetizante', { s: 13, w: 700, c: '#F2E4A0' });
      if (!g.dep) { B.texto(g, B.mundo(g, g.bac, [-1.25, -.95, .5]), 'oxidação', { s: 11, w: 700, c: '#F2E4A0' }); B.texto(g, B.mundo(g, g.bac, [1.25, .95, .5]), 'fixação do CO₂', { s: 11, w: 700, c: '#B8F0C8' }); }
    },
    legenda: () => 'A energia para fixar o CO₂ vem da oxidação de substâncias inorgânicas, como o H₂S, e não da luz'
  });
})();
