/* LAB Microrganismos e fungos: cena 3D dos protozoários (Martin), sobre o kit do módulo Vírus e micro3d-pecas.js.
   Quatro jeitos de viver, lado a lado: a ameba translúcida estica pseudópodes e engloba uma alga (fagocitose); o
   tripanossomo ondula o corpo e o flagelo; o paramécio, coberto de cílios que batem em onda, mostra o macronúcleo, o
   micronúcleo e os vacúolos contráteis pulsando; o Plasmodium fica parado dentro das hemácias (anel e esquizonte).
   Algas, vacúolo contrátil com a salinidade e o jogo "Quem é quem?" continuam no desenho plano. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.cilio) return;
  const { V } = V3, { cl, mix, sst, add, sub, mul, nrm, hash, TAU } = V;
  const RED = () => V3.REDUZ();
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const cam = (g, P, hx, hy, o = {}) => V3.viva({ th: o.th == null ? .3 : o.th, fi: o.fi == null ? .22 : o.fi, d: V3.enquadrar(g, hx, hy) * (o.k || 1.05), al: o.al || [0, 0, 0] }, P.t, o.viva == null ? .5 : o.viva);
  const PRO = C.proto, NUC = C.nucleo, ALGA = '#6BCB77';

  const PE = {
    ameba: { nome: 'Ameba (sarcodíneo)', frase: 'Muda de forma o tempo todo. Move-se por pseudópodes, que também englobam o alimento.', cor: PRO },
    pseudo: { nome: 'Pseudópode', frase: 'Expansão do citoplasma, um "falso pé". Serve para rastejar e para abraçar o alimento.', cor: '#E2C6F5' },
    fago: { nome: 'Fagocitose', frase: 'Os pseudópodes cercam a alga e a fecham num vacúolo digestivo, onde ela é digerida.', cor: ALGA },
    nucleo: { nome: 'Núcleo', frase: 'Protozoários são eucariontes: o DNA fica dentro de um núcleo com membrana.', cor: NUC },
    tripa: { nome: 'Tripanossomo (flagelado)', frase: 'Agente da doença de Chagas, o Trypanosoma cruzi. Nada no sangue ondulando o corpo e o flagelo.', cor: '#D3A8F0' },
    flagelo: { nome: 'Flagelo', frase: 'Filamento longo que bate em onda. Corre colado ao corpo e sai livre na ponta da frente.', cor: '#EDE4FA' },
    param: { nome: 'Paramécio (ciliado)', frase: 'Corpo em forma de sola de sapato, coberto de cílios. Vive em água doce.', cor: PRO },
    cilios: { nome: 'Cílios', frase: 'Milhares de pelinhos que batem em onda, um pouco depois do vizinho, e empurram a célula.', cor: '#EDE4FA' },
    macro: { nome: 'Macronúcleo e micronúcleo', frase: 'Os ciliados têm dois tipos de núcleo: o grande comanda o dia a dia, o pequeno entra na reprodução sexuada (conjugação).', cor: NUC },
    vac: { nome: 'Vacúolo contrátil', frase: 'Junta a água que entra por osmose e a bombeia para fora. Sem ele, a célula de água doce estouraria.', cor: '#8FD8FF' },
    plasmo: { nome: 'Plasmódio (esporozoário)', frase: 'Não tem estrutura de locomoção e é parasita: no corpo humano, vive dentro de células do fígado e das hemácias, onde se multiplica. Causa a malária.', cor: '#7C5CD6' },
    hemacia: { nome: 'Hemácia', frase: 'Glóbulo vermelho. Quando os parasitas de dentro se multiplicam, ela se rompe e libera novos parasitas: vem a febre.', cor: C.hemacia }
  };
  // posições dos quatro (deitado: em fila; em pé: 2 por 2)
  const POS = d => d ? [[-4.6, 0, 0], [-1.55, 0, 0], [1.55, 0, 0], [4.6, 0, 0]] : [[-1.5, 1.6, 0], [1.5, 1.6, 0], [-1.5, -1.7, 0], [1.5, -1.7, 0]];
  const NOMES = [['ameba', 'pseudópodes'], ['tripanossomo', 'flagelo'], ['paramécio', 'cílios'], ['plasmódio', 'sem locomoção']];
  // pseudópodes da ameba: direção no plano e fase
  const PSD = [[1, .15], [.35, 1], [-.8, .7], [-.9, -.6], [.3, -1]].map((d, i) => ({ d: nrm([d[0], d[1], 0]), f: i * 1.3, k: i === 0 ? 1.15 : .8 + hash(i, 3) * .3 }));
  const CIL = (() => { const o = [], n = 220, ga = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++) { const y = 1 - 2 * (i + .5) / n, r = Math.sqrt(1 - y * y), a = i * ga; o.push([y, Math.cos(a) * r, Math.sin(a) * r]); } return o; })();
  const PEL = [1.05, .42, .36];

  V3.cena('protoctista/grupos', {
    fit: 12, raio: 6, bolas: 260, pecas: PE,
    so2D: S => S.modo !== 'proto',
    rotulos: [{ pc: 'ameba', t: 'ameba', pr: 1 }, { pc: 'tripa', t: 'tripanossomo', pr: 1 }, { pc: 'param', t: 'paramécio', pr: 1 }, { pc: 'plasmo', t: 'plasmódio', pr: 1 },
      { pc: 'pseudo', t: 'pseudópode', pr: 3 }, { pc: 'flagelo', t: 'flagelo', pr: 3 }, { pc: 'cilios', t: 'cílios', pr: 3 }, { pc: 'hemacia', t: 'hemácia', pr: 4 }, { pc: 'vac', t: 'vacúolo contrátil', pr: 5 }, { pc: 'macro', t: 'macronúcleo', pr: 6 }, { pc: 'fago', t: 'alga engolida', pr: 6 }],
    montar(g) {
      const T = g.T;
      // ameba: malha que se deforma a cada quadro
      const geo = new T.IcosahedronGeometry(1, g.q.cel ? 3 : 4); g.geos.push(geo); geo.deleteAttribute('uv');
      g.amB = Float32Array.from(geo.attributes.position.array); g.amG = geo;
      g.amM = V3.filme(g, PRO, { cor2: '#F3E6FF', dentro: '#3A2450', base: .2, fr: .6, esc: 3 });
      g.am = V3.peca(g, geo, g.amM, 'ameba'); g.am.renderOrder = 4;
      // tripanossomo e flagelo
      g.trM = V3.fis(g, '#D3A8F0', { p: { roughness: .45, clearcoat: .5, transparent: true, opacity: .92 }, rim: '#F3E6FF', rimK: .4 });
      g.tr = V3.tubo(g, 46, g.q.cel ? 10 : 14, g.trM, null, 'tripa');
      g.flM = V3.fis(g, '#EDE4FA', { p: { roughness: .4 }, rimK: .3 });
      g.fl = V3.tubo(g, 60, 6, g.flM, null, 'flagelo');
      // paramécio: casca translúcida
      const pg = V3.lumpy(g, 'param', 29, g.q.cel ? 3 : 4, 3, .04, .4, .7);
      g.paM = V3.filme(g, PRO, { cor2: '#F3E6FF', dentro: '#2E2045', base: .16, fr: .6, esc: 3 });
      g.pa = V3.peca(g, pg, g.paM, 'param'); g.pa.scale.set(PEL[0], PEL[1], PEL[2]); g.pa.renderOrder = 4;
      // hemácia infectada (translúcida) e as normais
      g.heM = V3.filme(g, '#E0505A', { cor2: '#FFC0C0', dentro: '#6A1018', base: .32, fr: .5, esc: 2 });
      g.he = [V3.peca(g, V3.hemGeo(g), g.heM, 'hemacia'), V3.peca(g, V3.hemGeo(g), g.heM, 'hemacia')]; g.he.forEach(m => { m.renderOrder = 4; });
      g.H = V3.hemacias(g, 8, 'hemacia');
      g.W = V3.kitV(g, { knobs: 1, cascas: 1, envs: 12, rods: g.q.cel ? 340 : 420 });
      g.anel = V3.plasmideos(g, 2, 'plasmo');
      g.q0 = new T.Quaternion(); g.e0 = new T.Euler();
    },
    animar(g, P) {
      const t = P.t, W = g.W, info = g.pecas, d = V3.deitado(g), Q = POS(d), tt = RED() ? 2 : t;
      g.Q = Q;
      ameba(g, Q[0], tt, info); tripa(g, d ? Q[1] : add(Q[1], [-.75, 0, 0]), tt, info, d ? 2.3 : 1.7); param(g, Q[2], tt, info); plasmo(g, Q[3], tt, info);
      NOMES.forEach((n, i) => V3.texto(g, add(Q[i], [0, d ? -1.45 : -1.25, 0]), n[0] + ': ' + n[1], { s: NAR ? 12 : 13, w: 600, c: C.txt }));
      V3.fim(g.anel); V3.fim(g.H); V3.fimKit(W);
    },
    camera(g, P) { const d = V3.deitado(g); return cam(g, P, d ? 6.2 : 3, d ? 1.7 : 3.2, { al: [0, d ? -.1 : 0, 0], th: .15, fi: .3, k: 1.02 }); }
  });

  // ---------- ameba ----------
  function ameba(g, c, t, info) {
    const u = (t % 9) / 9, pos = g.amG.attributes.position, B = g.amB;
    // a alga vem pela direção do primeiro pseudópode; os vizinhos se fecham em volta dela
    const chega = sst(.05, .45, u), entra = sst(.45, .7, u), dig = sst(.75, 1, u), dA = PSD[0].d;
    const ext = PSD.map((p, i) => { const base = .7 + .45 * Math.sin(t * .7 + p.f); return i === 0 ? mix(base, .85, sst(.25, .5, u)) * (1 - entra * .7) : base * p.k; });
    for (let i = 0; i < pos.count; i++) {
      const x = B[i * 3], y = B[i * 3 + 1], z = B[i * 3 + 2]; let r = .62 + (V.vnoise(x * 2 + t * .2, y * 2, z * 2) - .5) * .12;
      PSD.forEach((p, k) => { const dd = x * p.d[0] + y * p.d[1]; if (dd > 0) r += ext[k] * Math.pow(dd, 5); });
      pos.setXYZ(i, c[0] + x * r, c[1] + y * r, c[2] + z * r * .5);
    }
    pos.needsUpdate = true; g.amG.computeVertexNormals(); g.amG.boundingSphere = null;
    ach(g, 'ameba', add(c, [-.3, .45, 0])); ach(g, 'pseudo', add(c, mul(PSD[2].d, .62 + ext[2] * .9)));
    V3.bola(g, add(c, [-.15, -.08, -.02]), .17, NUC, 1, info.nucleo);
    V3.bola(g, add(c, [-.2, -.08, .1]), .06, '#C9B2FF', 1.1, info.nucleo);
    // vacúolo contrátil (enche e esvazia)
    const vc = RED() ? .5 : .5 + .5 * Math.sin(t * 1.6); V3.bola(g, add(c, [-.45, .2, .02]), .05 + .07 * vc, '#8FD8FF', .9, info.vac);
    // grânulos do citoplasma
    for (let i = 0; i < 14; i++) V3.bola(g, add(c, [(hash(i, 41) - .5) * .9, (hash(i, 42) - .5) * .8, (hash(i, 43) - .5) * .25]), .025, '#E8D8C0', .9, info.ameba);
    // alga: chega, é cercada e digerida dentro do vacúolo
    const fora = add(c, mul(dA, 1.6)), dentro = add(c, mul(dA, .25)), pA = V.lerp3(V.lerp3(fora, add(c, mul(dA, 1.15)), chega), dentro, entra), rA = .13 * (1 - dig * .75);
    if (dig < .98) { V3.bola(g, pA, rA, ALGA, 1, info.fago); if (entra > .5) V3.bola(g, pA, rA + .06, '#BDE7C4', .5, info.fago); ach(g, 'fago', pA); }
  }

  // ---------- tripanossomo ----------
  function tripa(g, c, t, info, L) {
    const P = [], F = [], n = 46, w = RED() ? 0 : t * 5;
    for (let i = 0; i < n; i++) { const s = i / (n - 1), x = (s - .5) * L, a = .07 + .12 * s; P.push([c[0] + x, c[1] + Math.sin(s * 7 - w) * a, c[2] + Math.cos(s * 5 - w * .7) * .05]); }
    g.tr.set(P, (i, m) => { const s = i / (m - 1); return .035 + .16 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 1.05)), .8); });
    // flagelo: preso à borda do corpo (membrana ondulante) e livre depois da ponta
    for (let i = 0; i < 60; i++) {
      const s = i / 59 * 1.4, x = (s - .5) * L, a = .07 + .12 * Math.min(1, s), r = s < 1 ? .035 + .16 * Math.pow(Math.sin(Math.PI * s), .8) : 0;
      F.push([c[0] + x, c[1] + Math.sin(s * 7 - w) * a + r * .95, c[2] + Math.cos(s * 5 - w * .7) * .05]);
    }
    g.fl.set(F.slice(12), .016);
    ach(g, 'tripa', P[14]); ach(g, 'flagelo', F[56]);
    V3.bola(g, P[24], .07, NUC, 1, info.nucleo); V3.bola(g, P[6], .035, '#5B3FB0', 1, info.tripa);
  }

  // ---------- paramécio ----------
  function param(g, c, t, info) {
    const roll = RED() ? .3 : t * .35, cr = Math.cos(roll), sr = Math.sin(roll), R = p => [p[0], p[1] * cr - p[2] * sr, p[1] * sr + p[2] * cr];
    g.pa.position.set(c[0], c[1], c[2]); g.pa.rotation.x = roll;
    const W = g.W;
    for (let i = 0; i < CIL.length; i++) {
      const d = CIL[i], b = R([d[0] * PEL[0] * .98, d[1] * PEL[1] * .98, d[2] * PEL[2] * .98]), n = nrm(R([d[0] / PEL[0], d[1] / PEL[1], d[2] / PEL[2]]));
      const tp = V3.cilio(add(c, b), n, [-1, 0, 0], .13, t * 9 - d[0] * 7);
      V3.bastao(g, W.rod, add(c, b), tp, .006, '#CDBFE6', .8, info.cilios);
      if (i === 40) ach(g, 'cilios', tp);
    }
    // macronúcleo (feijão), micronúcleo e vacúolos contráteis em estrela
    g.e0.set(roll, 0, .2); g.q0.setFromEuler(g.e0);
    V3.put(g, W.env, add(c, R([.05, .02, 0])), g.q0, .3, .16, .14, NUC, 1, info.macro);
    V3.bola(g, add(c, R([.32, .08, .05])), .05, '#C9B2FF', 1.1, info.macro); ach(g, 'macro', add(c, R([.05, .14, 0])));
    [-.62, .62].forEach((x, k) => {
      const f = RED() ? .5 : .5 + .5 * Math.sin(t * 2 + k * Math.PI), p = add(c, R([x, .1, .12]));
      V3.bola(g, p, .035 + .05 * f, '#8FD8FF', .95, info.vac);
      for (let j = 0; j < 6; j++) { const a = j / 6 * TAU, e = add(c, R([x + Math.cos(a) * .17, .1 + Math.sin(a) * .13, .1])); V3.bastao(g, W.rod, p, e, .01 + .012 * (1 - f), '#8FD8FF', .8, info.vac); }
      if (!k) ach(g, 'vac', p);
    });
    for (let i = 0; i < 6; i++) V3.bola(g, add(c, R([-.4 + i * .14, -.12 + hash(i, 51) * .06, (hash(i, 52) - .5) * .12])), .04, '#9FD08A', .85, info.param);
    ach(g, 'param', add(c, R([-.5, .3, 0])));
  }

  // ---------- Plasmodium nas hemácias ----------
  function plasmo(g, c, t, info) {
    const H = g.H, bob = RED() ? 0 : Math.sin(t * .6) * .05;
    [[-.5, .55, -.35], [.62, .5, -.4], [-.65, -.55, -.3], [.55, -.6, -.45], [0, 1.0, -.6]].forEach((o, i) => {
      g.e0.set(.5 + hash(i, 61) + t * .05, hash(i, 62) * 3, .3); g.q0.setFromEuler(g.e0);
      V3.put(g, H, add(c, [o[0], o[1] + bob, o[2]]), g.q0, .42, .42, .42, C.hemacia, .95, info.hemacia);
    });
    // duas hemácias infectadas, translúcidas: anel jovem e esquizonte com merozoítos
    [[-.05, .18, .15, 0], [.12, -.45, .05, 1]].forEach((o, k) => {
      const m = g.he[k]; m.position.set(c[0] + o[0], c[1] + o[1] + bob, c[2] + o[2]); m.rotation.set(1.25 + k * .2, .3, .1 + k * .3); m.scale.setScalar(.48);
      const p = [c[0] + o[0], c[1] + o[1] + bob, c[2] + o[2] + .05];
      if (!k) { V3.plasmideo(g, g.anel, add(p, [.05, .02, 0]), .13, 0, 1, info.plasmo, '#8E6BE0'); V3.bola(g, add(p, [.17, .1, .02]), .035, '#E04C8A', 1.2, info.plasmo); ach(g, 'plasmo', p); }
      else for (let j = 0; j < 8; j++) { const a = j / 8 * TAU + t * .1; V3.bola(g, add(p, [Math.cos(a) * .12, Math.sin(a) * .1, .02]), .035, '#7C5CD6', 1.1, info.plasmo); }
      if (k) ach(g, 'hemacia', add(p, [.3, -.1, 0]));
    });
  }
})();
