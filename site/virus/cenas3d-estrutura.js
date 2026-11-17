/* LAB Vírus: cenas 3D da Estrutura (Martin), sobre o kit vir3d.js e as peças de vir3d-pecas.js.
   A partícula viral: o RNA em 8 bastões, os capsômeros que se encaixam sozinhos, as espículas na membrana da célula e o
   brotamento, com a membrana embrulhando o vírus até se fechar; botões de corte e de sabão. Formas e tipos: o bastonete
   helicoidal do mosaico do tabaco (com uma janela aberta no RNA), o icosaedro do adenovírus com as 20 faces destacadas e
   as fibras nos vértices (o envelope do herpes por cima) e o fago T4. Os modos de cartões continuam no desenho plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.kitV) return;
  const { V, K } = V3, { cl, mix, sst, add, sub, mul, nrm, dot, hash, TAU } = V;
  const RED = () => V3.REDUZ();
  const sg = (a, b, x) => cl((x - a) / (b - a), 0, 1);
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const cam = (g, P, hx, hy, o = {}) => V3.viva({ th: o.th == null ? .4 : o.th, fi: o.fi == null ? .22 : o.fi, d: V3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .6 : o.viva);
  const GA = Math.PI * (3 - Math.sqrt(5));

  // =====================================================================================
  // A PARTÍCULA VIRAL (vírus da gripe: RNA em 8 pedaços, capsídeo, envelope com espículas H e N)
  // =====================================================================================
  const PE = {
    rna: { nome: 'RNA em 8 pedaços', frase: 'O material genético do vírus da gripe: 8 bastões de RNA, cada um enrolado com proteínas. Vírus têm DNA ou RNA, nunca os dois como material genético.', cor: C.rna },
    caps: { nome: 'Capsídeo', frase: 'Capa de proteína feita de muitas unidades iguais, os capsômeros, que se encaixam sozinhas. Na gripe, essas proteínas envolvem cada um dos 8 pedaços de RNA: são 8 nucleocapsídeos em hélice, soltos dentro do vírus.', cor: C.capsideo },
    m1: { nome: 'Matriz (proteína M1)', frase: 'Camada de proteína logo abaixo do envelope. Dá forma à partícula e liga os nucleocapsídeos ao envelope na hora do brotamento.', cor: '#9FB4D8' },
    env: { nome: 'Envelope', frase: 'Bicamada de lipídios que o vírus leva da membrana da célula onde foi montado. Sabão e álcool 70% o desmancham.', cor: C.envelope },
    espH: { nome: 'Espícula H (hemaglutinina)', frase: 'Glicoproteína do vírus que se encaixa no receptor da célula, como chave e fechadura. É o H de H1N1.', cor: C.espicula },
    espN: { nome: 'Espícula N (neuraminidase)', frase: 'Glicoproteína que solta os vírus novos da célula na saída. É o N de H1N1.', cor: '#FFD98A' },
    mem: { nome: 'Membrana da célula', frase: 'As espículas fabricadas pela célula ficam espetadas aqui; no brotamento, este pedaço de membrana vira o envelope.', cor: C.membrana },
    sabao: { nome: 'Sabão', frase: 'Moléculas com uma ponta que gosta de água e outra que gosta de gordura: entram nos lipídios do envelope e o desmancham.', cor: K.sabao }
  };
  const R = 1, RMAX = 2, ROUT = 9, NDISCO = 30, NFORA = 44;
  const DISCO = Array.from({ length: NDISCO }, (_, i) => { const s = Math.sqrt((i + .5) / NDISCO), a = i * GA, th = Math.acos(1 - 2 * s * s); return { r: s * RMAX, a, dir: [Math.sin(th) * Math.cos(a), Math.cos(th), Math.sin(th) * Math.sin(a)], tp: i % 4 === 3 ? 'N' : 'H' }; });
  const FORA = Array.from({ length: NFORA }, (_, i) => ({ r: 2.35 + 5.6 * Math.sqrt(hash(i, 81)), a: hash(i, 82) * TAU, tp: i % 4 === 3 ? 'N' : 'H' }));
  const DIRS = DISCO.map(d => d.dir);

  V3.cena('estrutura/particula', {
    fit: 7, raio: 4, bolas: 260, pecas: PE,
    so2D: S => S.modo === 'chave',
    rotulos: [{ pc: 'env', t: 'envelope', pr: 1 }, { pc: 'espH', t: 'espícula H', pr: 2 }, { pc: 'espN', t: 'espícula N', pr: 3 }, { pc: 'rna', t: 'RNA', pr: 4 }, { pc: 'caps', t: 'capsídeo', pr: 5 }, { pc: 'm1', t: 'matriz', pr: 6 }, { pc: 'mem', t: 'membrana da célula', pr: 7 }, { pc: 'sabao', t: 'sabão', pr: 8 }],
    montar(g) {
      const T = g.T;
      g.gv = new T.Group(); g.raiz.add(g.gv);
      g.pl = V3.corte(g, g.gv, [0, 0, -1], 50);
      g.W = V3.kitV(g, { planos: [g.pl], knobs: 400, rods: 260 });
      g.memM = V3.filme(g, '#F06AAE', { cor2: '#FFD0E6', dentro: '#5A1E44', base: .26, fr: .55, esc: 2.2 });
      g.mem = V3.membranaB(g, g.memM, ROUT, null, 'mem'); g.mem.mesh.renderOrder = 6;
      g.rnaM = V3.fis(g, C.rna, { p: { roughness: .4, clearcoat: .5 }, rim: '#FFC0B0', rimK: .3 });
      g.rnp = V3.rnps(g, g.gv, 8, g.rnaM);
      g.mod = V3.modelo(g, 'esf', g.q.cel ? 90 : 120);
      g.qv = new T.Quaternion();
    },
    animar(g, P) {
      const S = P.S, t = P.t, W = g.W, v = g.v, sab = !!S.sabOn, tm = sab ? 99 : t;
      const gen = sst(.3, 2.2, tm), capP = sst(2.4, 5.4, tm), espM = sst(5.6, 7.2, tm), rise = sst(7.4, 11, tm), pronto = tm >= 12.5;
      const sb = sab ? (S.sab || 0) : 0, cv = sab ? 0 : (S.cv || 0), desfaz = sst(.15, .7, sb), solta = sst(.2, .8, sb), mA = 1 - sst(0, .2, sb);
      const sep = rise >= .999 || sab;
      let w = 0, yc;
      if (sab) yc = 0;
      else if (sep) yc = mix(1, 1.3, sst(11, 12.5, tm));
      else if (rise < .12) yc = mix(-1.35, -1, rise / .12);
      else { w = (rise - .12) / .88; yc = -Math.cos(Math.PI * w); }
      const c = [0, yc, 0]; g.gv.position.set(0, yc, 0);
      const rot = RED() ? 0 : Math.max(0, t - 12.5) * .12; V3.setQ(g, g.qv, 0, rot, 0);
      // corte: o plano fica de frente para a câmera e abre a metade de perto
      const cp = v.cam.position, dc = nrm(sub(c, [cp.x, cp.y, cp.z])); g.pl.reg.n = dc; g.pl.reg.c = mix(50, 0, cv);
      // membrana (some com o sabão)
      g.memM.uniforms.uOp.value = mA; g.mem.mesh.visible = mA > .02;
      if (mA > .02) g.mem.set(R, RMAX, sep ? 0 : w);
      // RNA (8 bastões, de 7 em volta de 1) e capsômeros
      g.rnp.forEach((tb, i) => { const k = cl(gen * 8 - i, 0, 1); if (k <= .02) { tb.mesh.visible = false; return; } tb.set(V3.rnpPontos(i, 8, R * .9, k, t), R * .045); tb.mesh.position.set(0, 0, 0); tb.mesh.quaternion.copy(g.qv); });
      // capsídeo da gripe: proteínas em hélice em volta de cada bastão de RNA (8 nucleocapsídeos) e a matriz M1 sob o envelope
      const kN = sst(0, .6, capP), kM = sst(.45, 1, capP);
      if (kN > .01) for (let i = 0; i < 8; i++) {
        const P8 = V3.rnpPontos(i, 8, R * .9, 1, t);
        for (let j = 1; j < 45; j += 3) {
          const dl = (i * 14 + j) / 160, f = sst(dl * .5, dl * .5 + .5, kN); if (f <= .01) continue;
          const a = j * 1.9 + i, o = [Math.cos(a) * R * .065, 0, Math.sin(a) * R * .065], P = V3.aplica(g, c, g.qv, 1, add(P8[j], o));
          V3.bola(g, P, R * .042 * (.4 + .6 * f), C.capsideo, .9 + .15 * hash(i, j), g.pecas.caps);
          if (i === 2 && j === 22) g.capA = P;
        }
      }
      if (kM > .01) V3.capsideo(g, W, g.mod, c, g.qv, R * .86, { k: kM, r: .1, info: g.pecas.m1, casca: false, seed: 7, cor: '#9FB4D8' });
      // espículas na membrana (antes de se separar) e no envelope (depois)
      const tc = nrm(sub([cp.x, cp.y, cp.z], c));
      if (!sep) {
        DISCO.forEach((d, i) => { if (espM <= .01) return; const [p, n] = g.mem.mapa(d.r, d.a, R, RMAX, w); V3.espicula(g, W, p, n, R * .3 * espM, R, d.tp, d.tp === 'N' ? '#FFD98A' : K.espicula, g.pecas[d.tp === 'N' ? 'espN' : 'espH']); if (i === 0) ach(g, 'espH', add(p, mul(n, R * .32))); if (i === 3 && espM > .5) ach(g, 'espN', add(p, mul(n, R * .32))); });
      } else {
        V3.envelope(g, W, DIRS, c, g.qv, R, {
          env: sab ? 1 - sst(.55, .75, sb) : 1, esc: 1 + .15 * desfaz, esp: 1, solta, info: g.pecas.env,
          tipo: i => DISCO[i].tp, corEsp: i => (DISCO[i].tp === 'N' ? '#FFD98A' : K.espicula), infoEsp: i => g.pecas[DISCO[i].tp === 'N' ? 'espN' : 'espH'],
          pula: (i, d) => cv > .5 && dot(d, tc) > .1
        });
        if (sb < .3) { const d0 = V3.giraV(g, g.qv, DIRS[0]), d3 = V3.giraV(g, g.qv, DIRS[3]); ach(g, 'espH', add(c, mul(d0, R * 1.3))); ach(g, 'espN', add(c, mul(d3, R * 1.3))); }
        if (!sab || sb < .5) ach(g, 'env', add(c, mul(nrm([-.7, .45, .55]), R)));
      }
      if (espM > .01 && mA > .05) FORA.forEach(d => { const [p, n] = g.mem.mapa(d.r, d.a, R, RMAX, sep ? 0 : w); V3.espicula(g, W, p, n, R * .3 * espM * mA, R, d.tp, d.tp === 'N' ? '#FFD98A' : K.espicula, g.pecas[d.tp === 'N' ? 'espN' : 'espH'], mA); });
      if (!sep && w > .3) ach(g, 'env', add(c, mul(nrm([-.7, .5, .5]), R * 1.02)));
      if (mA > .3) ach(g, 'mem', g.mem.mapa(4.2, 2.3, R, RMAX, sep ? 0 : w)[0]);
      if ((cv > .5 || capP < 1 || !sep) && gen > .5) ach(g, 'rna', add(c, [0, R * .3, 0]));
      if ((cv > .5 || !sep) && capP > .5 && g.capA) ach(g, 'caps', g.capA);
      if ((cv > .5 || !sep) && capP > .8) ach(g, 'm1', add(c, mul(nrm([.6, .2, .7]), R * .86)));
      // sabão: moléculas que chegam, lipídios que se soltam
      if (sab) {
        for (let i = 0; i < 26; i++) {
          const d = nrm([hash(i, 91) - .5, hash(i, 92) - .5, hash(i, 93) - .5]), d0 = R * (2 + hash(i, 94) * .8), dl = hash(i, 95) * .1, f = sst(dl, dl + .25, sb), d1 = R * 1.06 + desfaz * R * .55 * (1 + (i % 3) * .3), dd = mix(d0, d1, f), p = add(c, mul(d, dd));
          V3.bola(g, p, .055, K.sabao, 1, g.pecas.sabao); V3.bastao(g, W.rod, p, add(p, mul(d, -.16)), .014, '#7FB8AC', 1, g.pecas.sabao);
          if (i === 0) ach(g, 'sabao', p);
        }
        if (desfaz > .01) for (let i = 0; i < 46; i++) { const d = nrm([hash(i, 71) - .5, hash(i, 72) - .5, hash(i, 73) - .5]), k = 1 - sst(.75, 1.15, sb); if (k > .02) V3.bola(g, add(c, mul(d, R * (1 + desfaz * (.3 + .9 * hash(i, 74))))), .09 * k * Math.min(1, desfaz * 3), C.envelope, .95, g.pecas.env); }
        if (sb > .75) V3.ficha(g, add(c, [0, -R * 1.25, 0]), 'inativado', C.dim, { pr: 1, dy: 1 });
      }
      if (mA > .2 && LB) { V3.texto(g, [-3.6, .35, 1.2], 'fora da célula', { s: 12, c: C.dim }); V3.texto(g, [-3.6, -.5, 1.2], 'citoplasma da célula', { s: 12, c: C.dim }); }
      V3.fimKit(W);
      g.c = c; g.sep = sep; g.pronto = pronto;
    },
    camera(g, P) { const c = g.c || [0, 0, 0]; const lar = V3.deitado(g); return cam(g, P, lar ? 2.9 : 1.75, lar ? 2.5 : 2.3, { al: [0, .15 + c[1] * .5, 0], th: .5, fi: .3, k: lar ? 1.12 : 1.05 }); }
  });

  // =====================================================================================
  // FORMAS E TIPOS: helicoidal, icosaédrico (com envelope opcional) e complexo
  // =====================================================================================
  const PT = {
    hel: { nome: 'Helicoidal: mosaico do tabaco', frase: 'Os capsômeros giram em espiral em volta do RNA e formam um bastonete. Na janela aberta, o RNA aparece enrolado entre eles.', cor: C.capsideo },
    rnaH: { nome: 'RNA do mosaico do tabaco', frase: 'Uma fita de RNA que segue a espiral dos capsômeros, por dentro do bastonete.', cor: C.rna },
    ico: { nome: 'Icosaédrico: adenovírus', frase: '20 faces triangulares, quase uma esfera. Também é a forma do HPV e do poliovírus. No adenovírus, uma fibra sai de cada um dos 12 vértices.', cor: C.capsideo },
    env: { nome: 'Envelope (como no herpes)', frase: 'Com envelope, por fora o vírus parece uma esfera com espinhos e a forma do capsídeo fica escondida. Adenovírus, HPV e poliovírus não têm envelope.', cor: C.envelope },
    t4: { nome: 'Complexo: bacteriófago T4', frase: 'Cabeça icosaédrica com o DNA, cauda que funciona como seringa e fibras que prendem o fago na bactéria.', cor: C.capsideo }
  };
  V3.cena('estrutura/tipos', {
    fit: 9, raio: 5, bolas: 160, pecas: PT,
    so2D: S => S.modo !== 'formas',
    rotulos: [{ pc: 'hel', t: 'helicoidal', pr: 1 }, { pc: 'ico', t: 'icosaédrico', pr: 2, se: g => g.ev < .5 }, { pc: 'env', t: 'com envelope', pr: 2, se: g => g.ev >= .5 }, { pc: 't4', t: 'complexo', pr: 3 }, { pc: 'rnaH', t: 'RNA', pr: 4 }],
    montar(g) {
      const T = g.T; g.W = V3.kitV(g, { knobs: g.q.cel ? 900 : 1500, rods: 220 });
      g.rnaM = V3.fis(g, C.rna, { p: { roughness: .4, clearcoat: .5 }, rimK: .3 });
      g.helTubo = V3.tubo(g, 320, g.q.cel ? 6 : 8, g.rnaM, null, 'rnaH');
      g.qH = new T.Quaternion(); g.qI2 = new T.Quaternion(); g.qT = new T.Quaternion(); g.qK = new T.Quaternion(); g.e = new T.Euler();
      g.mIco = V3.modelo(g, 'ico', g.q.cel ? 3 : 4);
      g.dEnv = V3.fibo(18, .3);
    },
    animar(g, P) {
      const S = P.S, t = P.t, W = g.W, lar = V3.deitado(g), ev = S.ev || 0; g.ev = ev;
      const C0 = lar ? [[-3.2, .15, 0], [0, .15, 0], [3.2, .15, 0]] : [[0, 3.1, 0], [0, 0, 0], [0, -3.1, 0]]; g.lar = lar;
      // 1. bastonete helicoidal (capsômeros em espiral, janela aberta perto de uma ponta)
      const Lr = 2.6, pitch = g.q.cel ? .13 : .09, m = g.q.cel ? 11 : 16, rr = .13, nTot = Math.floor(Lr / pitch * m), cH = C0[0];
      V3.setQ(g, g.qH, 0, RED() ? .3 : .3 + t * .12, lar ? -.35 : Math.PI / 2 - .22);
      const corte = Lr * .24, rnaP = [];
      for (let i = 0; i < nTot; i++) {
        const u = i / m, y = -Lr / 2 + u * pitch, a = u * TAU, l = [Math.cos(a) * rr, y, Math.sin(a) * rr];
        if (y < -Lr / 2 + corte && Math.sin(a) > -.25) continue;
        const p = V3.aplica(g, cH, g.qH, 1, l);
        g.e.set(0, -a, Math.PI / 2); g.qK.setFromEuler(g.e); g.qK.premultiply(g.qH);
        V3.put(g, W.knob, p, g.qK, .055, .075, .048, i % 9 ? C.capsideo : '#CDD4E3', .95 + .1 * hash(i, 5), g.pecas.hel);
      }
      for (let i = 0; i <= 300; i++) { const y = -Lr / 2 + i / 300 * Lr, a = (y + Lr / 2) / pitch * TAU; rnaP.push(V3.aplica(g, cH, g.qH, 1, [Math.cos(a) * rr * .55, y, Math.sin(a) * rr * .55])); }
      g.helTubo.set(rnaP, .022);
      ach(g, 'hel', V3.aplica(g, cH, g.qH, 1, [0, Lr * .3, rr])); ach(g, 'rnaH', V3.aplica(g, cH, g.qH, 1, [0, -Lr / 2 + corte * .5, 0]));
      // 2. icosaedro com faces destacadas uma a uma e fibras nos 12 vértices; envelope opcional
      const cI = C0[1], s = .78, hl = Math.min(20, Math.floor((t % 16) / .6));
      V3.setQ(g, g.qI2, .35, RED() ? .5 : t * .45, 0);
      V3.capsideo(g, W, g.mIco, cI, g.qI2, s, { r: g.q.cel ? .15 : .12, info: g.pecas.ico, seed: 2, hl: (f, pen) => (pen ? '#F2F5FB' : f < hl ? '#E8D7A6' : C.capsideo) });
      if (ev < .4) g.mIco.pts.forEach((pt, i) => { if (!g.mIco.pen[i]) return; const d = V3.giraV(g, g.qI2, V.nrm(pt)), a = add(cI, mul(d, s * .98)), b = add(cI, mul(d, s * 1.5)); V3.bastao(g, W.rod, a, b, .018 * (1 - ev * 2), '#C9D1E2', 1, g.pecas.ico); V3.bola(g, b, .05 * (1 - ev * 2), '#E6EBF5', 1, g.pecas.ico); });
      if (ev > .02) V3.envelope(g, W, g.dEnv, cI, g.qI2, s * (1.02 + .3 * ev), { env: ev, esp: ev, tipo: () => 'bola', info: g.pecas.env, infoEsp: () => g.pecas.env });
      ach(g, ev < .5 ? 'ico' : 'env', add(cI, [0, s * (ev < .5 ? 1.05 : 1.45), 0]));
      // 3. fago T4
      const cT = C0[2], sT = .62; V3.setQ(g, g.qT, 0, RED() ? .4 : t * .3, 0);
      const ft = V3.fago(g, W, add(cT, [0, -1.15, 0]), g.qT, sT, { pernas: .85, info: { cab: g.pecas.t4, cauda: g.pecas.t4, fibra: g.pecas.t4, base: g.pecas.t4 } });
      ach(g, 't4', add(ft.cabeca, [0, .55, 0]));
      // nome e material genético embaixo de cada modelo
      const yb = lar ? -1.75 : -1.35, ac = [['RNA', C.rna], [ev > .5 ? 'DNA (herpes)' : 'DNA (adenovírus)', C.dna], ['DNA', C.dna]];
      [cH, cI, cT].forEach((c0, i) => V3.ficha(g, add(c0, lar ? [0, yb, 0] : [1.7, -.2, 0]), ac[i][0], ac[i][1], { pr: 2, dy: 0 }));
      V3.fimKit(W);
    },
    camera(g, P) { return g.lar ? cam(g, P, 4.9, 2.5, { th: .12, fi: .12, k: 1.04, al: [0, -.3, 0] }) : cam(g, P, 2.4, 4.6, { th: .12, fi: .1, k: 1.02 }); }
  });
})();
