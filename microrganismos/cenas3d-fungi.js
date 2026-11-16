/* LAB Microrganismos e fungos: cena 3D do corpo dos fungos (Martin), sobre o kit do módulo Vírus e micro3d-pecas.js.
   Bolor no pão: esporos pousam numa fatia úmida, germinam e as hifas crescem em galhos até formar o micélio; no fim
   sobem os esporângios pretos. Ao lado, a ponta de uma hifa ampliada solta enzimas, que quebram moléculas grandes do pão
   em pedaços pequenos, absorvidos pela hifa (digestão fora do corpo). O cogumelo e o micélio: o solo aberto ao meio mostra
   o micélio crescendo escondido e, depois, o corpo de frutificação saindo da terra. Os jogos de cartões continuam no plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.arvore) return;
  const { V } = V3, { cl, mix, sst, seg, add, sub, mul, nrm, hash, lerp3, fr, TAU } = V;
  const RED = () => V3.REDUZ();
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const cam = (g, P, hx, hy, o = {}) => V3.viva({ th: o.th == null ? .3 : o.th, fi: o.fi == null ? .22 : o.fi, d: V3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .5 : o.viva);
  const HIFA = '#EDE3D0', AM = '#FFB347';

  const PE = {
    pao: { nome: 'Pão úmido', frase: 'Alimento rico em amido. Com umidade e calor, é um bom lugar para o bolor crescer.', cor: '#E9CB8F' },
    esporo: { nome: 'Esporo', frase: 'Célula leve que viaja pelo ar. Ao pousar num lugar úmido e com alimento, germina.', cor: '#5C5448' },
    hifa: { nome: 'Hifas', frase: 'Filamentos finos que crescem pela ponta e se ramificam. Têm parede de quitina.', cor: HIFA },
    micelio: { nome: 'Micélio', frase: 'O conjunto das hifas: é o corpo do fungo, a mancha de bolor que vemos.', cor: HIFA },
    esporangio: { nome: 'Esporângios', frase: 'Pontinhos pretos no alto das hifas. Cada um libera milhares de esporos novos.', cor: '#2A2622' },
    ponta: { nome: 'Ponta da hifa, ampliada', frase: 'A hifa cresce pela ponta. É ali que ela solta as enzimas e absorve o alimento já digerido.', cor: HIFA },
    enzima: { nome: 'Enzimas digestivas', frase: 'Saem da hifa e digerem o alimento do lado de fora: o fungo se alimenta por absorção.', cor: AM },
    molecula: { nome: 'Moléculas do alimento', frase: 'As grandes (como o amido) são quebradas pelas enzimas em pedaços pequenos, que atravessam a parede da hifa.', cor: '#C2B08A' },
    solo: { nome: 'Solo', frase: 'Rico em restos de folhas e madeira, que o fungo decompõe. Os fungos reciclam a matéria.', cor: '#7A5A38' },
    cogumelo: { nome: 'Cogumelo', frase: 'É só o corpo de frutificação, que produz esporos nas lamelas, embaixo do chapéu.', cor: '#B5563B' },
    lamela: { nome: 'Lamelas', frase: 'Lâminas finas sob o chapéu, onde se formam os esporos.', cor: '#E8DCC4' },
    micSolo: { nome: 'Micélio no solo', frase: 'A maior parte do fungo: cresce escondido na terra por metros e pode viver anos.', cor: HIFA }
  };
  // colônias no pão: raiz (x, z) e direção inicial
  const COLS = [[-1.1, -.55], [.85, -.7], [-.5, .55], [1.05, .6], [.1, -.05]].map(([x, z], i) => ({ x, z, arv: V3.arvore(31 + i * 17, [x, 0, z], [Math.cos(i * 2.3), 0, Math.sin(i * 2.3)], .32, 4, 'xz').map(h => { const k = p => [cl(p[0], -1.75, 1.75), p[1], cl(p[2], -1.25, 1.25)]; return [k(h[0]), k(h[1]), h[2], h[3]]; }) }));
  // micélio no solo: galhos para baixo e para os lados, sempre atrás do corte
  const SOLO = []; [-1.15, -.6, -.2, .2, .6, 1.15].forEach((a, i) => V3.arvore(91 + i * 13, [0, -.05, -.65], [Math.sin(a), -Math.cos(a) * .9, (hash(i, 9) - .5) * .3], .42, 4).forEach(h => { const z = p => [p[0], cl(p[1], -1.65, -.05), cl(p[2], -1.15, -.12)]; SOLO.push([z(h[0]), z(h[1]), h[2], h[3]]); }));

  V3.cena('fungi/fungos', {
    fit: 9, raio: 5, bolas: 380, pecas: PE,
    so2D: S => S.modo !== 'pao' && S.modo !== 'cogu',
    rotulos: [{ pc: 'micelio', t: 'micélio', pr: 1 }, { pc: 'esporangio', t: 'esporângios', pr: 2 }, { pc: 'esporo', t: 'esporo', pr: 2 }, { pc: 'enzima', t: 'enzimas', pr: 3 }, { pc: 'molecula', t: 'alimento', pr: 4 }, { pc: 'ponta', t: 'ponta da hifa', pr: 5 },
      { pc: 'cogumelo', t: 'cogumelo', pr: 1 }, { pc: 'micSolo', t: 'micélio', pr: 1 }, { pc: 'lamela', t: 'lamelas', pr: 3 }, { pc: 'solo', t: 'solo', pr: 4 }],
    montar(g) {
      const T = g.T;
      g.pl = V3.corte(g, g.raiz, [0, 0, -1], 0);
      // pão: miolo claro e casca
      g.gP = new T.Group(); g.raiz.add(g.gP);
      g.miolo = V3.bloco(g, V3.caixa(g, 3.7, .42, 2.7, 0, 'miolo'), '#E9CB8F', { dn: 0, esc: 4, k: 1.05, pc: 'pao', pai: g.gP }); g.miolo.position.y = -.21;
      g.casca = V3.peca(g, V3.caixa(g, 3.95, .36, 2.95, 0, 'casca'), V3.fis(g, '#B57A3E', { p: { roughness: .7 }, rimK: .1 }), 'pao', g.gP); g.casca.position.y = -.27;
      // ponta de hifa ampliada
      g.gZ = new T.Group(); g.raiz.add(g.gZ);
      g.zM = V3.filme(g, HIFA, { cor2: '#FFFFFF', dentro: '#8C7E64', base: .28, fr: .65, esc: 2.5 });
      g.zH = V3.peca(g, V3.capsula(g, 1, 2, g.q.cel ? 20 : 28), g.zM, 'ponta', g.gZ); g.zH.scale.set(.3, .3, .3); g.zH.rotation.z = Math.PI / 2; g.zH.position.x = -.6; g.zH.renderOrder = 5;
      // solo em corte
      g.gS = new T.Group(); g.raiz.add(g.gS);
      g.solo = V3.bloco(g, V3.caixa(g, 5.2, 1.8, 2.4, 0, 'solo'), '#6E4E30', { dn: .12, nuc: '#3C2A18', nr: .12, esc: 3, planos: [g.pl], pc: 'solo', pai: g.gS }); g.solo.position.y = -.9;
      // cogumelo: pé e chapéu (sólidos de revolução)
      g.cog = new T.Group(); g.raiz.add(g.cog); g.cog.position.set(0, 0, -.65);
      V3.peca(g, V3.torno(g, [[.001, 0], [.17, 0], [.14, .25], [.12, .75], [.13, 1.12], [.001, 1.12]], 16, 'pe'), V3.fis(g, '#EFE6D6', { p: { roughness: .6 } }), 'cogumelo', g.cog);
      V3.peca(g, V3.torno(g, [[.001, 1.08], [.55, 1.06], [.7, 1.14], [.66, 1.3], [.5, 1.46], [.28, 1.56], [.001, 1.6]], g.q.cel ? 20 : 28, 'chapeu'), V3.fis(g, '#B5563B', { p: { roughness: .5, clearcoat: .4 }, rim: '#FFC0A0', rimK: .3 }), 'cogumelo', g.cog);
      g.W = V3.kitV(g, { knobs: 1, cascas: 1, envs: 1, rods: g.q.cel ? 900 : 1200 });
    },
    animar(g, P) {
      const S = P.S, t = P.t, W = g.W, d = V3.deitado(g), info = g.pecas, pao = S.modo !== 'cogu';
      g.gP.visible = g.gZ.visible = pao; g.gS.visible = g.cog.visible = !pao; g.pao = pao; g.d = d;
      if (pao) bolor(g, t, d, info); else cogumelo(g, t, info);
      V3.fimKit(W);
    },
    sobre(g, S) {
      if (!g.pao || !g.zc) return;
      // lente: linha tracejada do pão até a ponta ampliada e um anel em volta dela
      const a = V3.tela(g, g.alvoPao), b = V3.tela(g, g.zc), r = Math.hypot(V3.tela(g, add(g.zc, [1.25, 0, 0]))[0] - b[0], V3.tela(g, add(g.zc, [0, 1.25, 0]))[1] - b[1]) / Math.SQRT2;
      if (a[2] > 1 || b[2] > 1) return;
      const ang = Math.atan2(a[1] - b[1], a[0] - b[0]);
      line(a[0], a[1], b[0] + Math.cos(ang) * r, b[1] + Math.sin(ang) * r, 'rgba(255,255,255,.45)', 1, [4, 4]); circ(a[0], a[1], 5, null, '#fff', 1.4);
      circ(b[0], b[1], r, null, 'rgba(255,179,71,.75)', 2);
      tx('ponta de hifa, ampliada', b[0], b[1] - r - 12, { s: 12, c: C.dim });
      mtx('<b>digestão fora do corpo</b>', b[0], b[1] + r + 14, { s: 13, c: C.amber });
      V3.reserva(g, [b[0] - 80, b[1] - r - 22, 160, 20]); V3.reserva(g, [b[0] - 90, b[1] + r + 4, 180, 22]);
    },
    camera(g, P) {
      const d = V3.deitado(g);
      if (g.pao === false) return cam(g, P, d ? 2.8 : 2.5, d ? 1.85 : 2.1, { al: [0, -.05, 0], th: .5, fi: .2 });
      return cam(g, P, d ? 4.6 : 2.25, d ? 1.9 : 3.3, { al: d ? [.75, .05, 0] : [0, .55, 0], th: d ? .1 : .05, fi: .5, k: 1.02 });
    }
  });

  function bolor(g, t, d, info) {
    const T = RED() ? 13.5 : t % 19, g0 = seg(T, 2.2, 12.5), sp = sst(12.5, 15.5, T), fade = 1 - sst(17.5, 19, T), W = g.W;
    const po = d ? [-1.15, 0, 0] : [0, -1.25, .2]; g.gP.position.set(po[0], po[1], po[2]);
    const top = add(po, [0, .02, 0]);
    // esporos pousando
    COLS.forEach((c, i) => {
      const f = sst(i * .15, i * .15 + 1.6, T), raiz = add(top, [c.x, .03, c.z]);
      if (T < 3) { V3.bola(g, lerp3(add(raiz, [0, 2.2, 0]), raiz, f), .045, '#5C5448', 1, info.esporo); if (i === 1) ach(g, 'esporo', lerp3(add(raiz, [0, 2.2, 0]), raiz, f)); }
      else if (g0 < .3) V3.bola(g, raiz, .04, '#5C5448', 1, info.esporo);
      if (fade < .02) return;
      const pontas = [], arv = c.arv.map(h => [add(top, add(h[0], [0, .03, 0])), add(top, add(h[1], [0, .03, 0])), h[2], h[3]]);
      V3.hifas(g, W.rod, arv, g0, .018 * fade, HIFA, info.hifa, pontas);
      if (i === 2 && g0 > .3) ach(g, 'micelio', arv[3][1]);
      if (sp > 0) pontas.forEach((p, j) => { if (j % 2) return; const tp = add(p, [0, .26 * sp, 0]); V3.bastao(g, W.rod, p, tp, .01, HIFA, 1, info.esporangio); V3.bola(g, tp, .045 * sp * fade, '#1E1A16', 1, info.esporangio); if (i === 0 && j === 0) ach(g, 'esporangio', tp); });
    });
    g.alvoPao = add(top, [-.5, .05, .55]);
    // ponta ampliada (à direita no computador, em cima no celular)
    const zc = d ? [2.85, .35, 0] : [0, 1.75, 0]; g.zc = zc; g.gZ.position.set(zc[0], zc[1], zc[2]);
    const tip = add(zc, [.3, 0, 0]), e = RED() ? .5 : fr(t * .3);
    ach(g, 'ponta', add(zc, [-.4, .3, 0]));
    const BL = [[.75, -.55], [.95, .1], [.7, .55]];
    BL.forEach(([u, v], i) => {
      const c = add(zc, [u, v * .9, 0]), pq = sst(.35 + i * .04, .7, e);
      if (pq < 1) V3.bola(g, c, .16 * (1 - pq * .8), '#C2B08A', 1, info.molecula); if (i === 1) ach(g, 'molecula', c);
      if (e > .4) { const f = sst(.55 + i * .05, .95, e); for (let k = 0; k < 3; k++) V3.bola(g, lerp3(add(c, [(k - 1) * .09, (k - 1) * .07, 0]), add(tip, [-.1, (k - 1) * .06, 0]), f), .045, '#E5D3A6', 1, info.molecula); }
    });
    for (let i = 0; i < 6; i++) { if (e >= .45) break; const f = sst(0, .4, e), tg = BL[i % 3]; const p = lerp3(add(tip, [0, (i - 3) * .03, 0]), add(zc, [tg[0], tg[1] * .9, .02]), f); V3.brilho(g, p, .035, AM, 1.6); if (i === 0) ach(g, 'enzima', p); }
  }

  function cogumelo(g, t, info) {
    const T = RED() ? 13 : t % 16, gr = sst(0, 7, T), em0 = sst(5, 9, T), em = em0, W = g.W;
    V3.hifas(g, W.rod, SOLO, gr, .02, HIFA, info.micSolo);
    if (gr > .3) ach(g, 'micSolo', SOLO[Math.min(SOLO.length - 1, 20)][1]);
    ach(g, 'solo', [2.1, -.25, -.3]);
    g.cog.scale.setScalar(Math.max(.001, em)); g.cog.visible = em0 > .01;
    if (em0 > .5) {
      ach(g, 'cogumelo', [.55 * em, 1.4 * em, -.65]);
      // lamelas: lâminas radiais sob o chapéu
      for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, c = Math.cos(a), s = Math.sin(a); V3.bastao(g, W.rod, [c * .18 * em, 1.07 * em, -.65 + s * .18 * em], [c * .6 * em, 1.05 * em, -.65 + s * .6 * em], .012 * em, '#E8DCC4', 1, info.lamela); }
      ach(g, 'lamela', [-.45 * em, 1.04 * em, -.45]);
      for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + .3, r = .2 + hash(i, 3) * .28; V3.bola(g, [Math.cos(a) * r * em, (1.6 - r * .6) * em, -.65 + Math.sin(a) * r * em], .035 * em, '#F3E9DA', 1, info.cogumelo); }
    }
  }
})();
