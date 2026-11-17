/* LAB Ecologia: peças 3D próprias do módulo (Martin), sobre o kit do módulo Vírus (../virus/vir3d.js e vir3d-pecas.js)
   e as lâminas de folha de ../plantas-animais/plantas3d-pecas.js, reaproveitados sem cópia.
   Aqui ficam: ECO3D.cena (registra a cena 3D por cima da 2D, liga o toque nas peças aos botões e à faixa da cena),
   o kit de instâncias da Ecologia (bolas elípticas, bastões, cones, caixas, lâminas e brilhos) e os seres em desenho
   próprio, de poucas formas: capim, árvore, arbusto, gafanhoto, sapo, cobra, gavião, boi, cogumelo, bactérias, peixe,
   alga, nuvem, fábrica, carro e a molécula de CO₂. Sem modelos de terceiros. Sem WebGL, nada disto roda: fica o 2D. */
'use strict';
(function () {
  const V3 = window.VIR3D, E = window.LAB_ECO; if (!V3 || !V3.paLaminas || !E) return;
  const { V } = V3, { cl, mix, add, sub, mul, nrm, len, hash, lerp3, TAU } = V;
  const RED = () => V3.REDUZ();
  const limpa2D = () => { try { const X = E.X; X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.clearRect(0, 0, X.canvas.width, X.canvas.height); X.restore(); } catch (e) { /* sem canvas 2D */ } };

  // ---------- registro: VIR3D.cena + pausa do motor + toque que escolhe ----------
  // o.toque: { idDaPeca: número (valor da faixa) ou texto (id do botão de opção) }
  function cena(chave, o) {
    const ani = o.animar;
    o.sair = (f => () => { limpa2D(); if (f) f(); })(o.sair);
    o.animar = function (g, P) {
      const S = P.S;
      if (o.toque && g.sel !== g._sel0) {
        g._sel0 = g.sel; const a = g.sel ? o.toque[g.sel] : undefined;
        if (typeof a === 'number' && S.v !== a) { E.ctlSet(a); S.touched = true; }
        else if (typeof a === 'string' && S.o !== a) E.escolhe(a);
      }
      ani.call(this, g, P);
    };
    V3.cena(chave, o);
    const c = E.SC[chave]; if (!c || c === o) return;
    const d = c.draw; c.draw = function (t, S) { S.paused = E.paused; return d.call(this, t, S); };
  }

  // ---------- kit de instâncias (tudo reescrito a cada quadro) ----------
  function kit(g, o = {}) {
    const T = g.T, q = g.q, K = {};
    K.b = V3.inst(g, V3.esfera(g, q.cel ? 14 : 20), V3.fis(g, '#FFFFFF', { p: { roughness: .5, clearcoat: .35, sheen: .2 }, rimK: .16 }), o.bolas || 700);
    K.r = V3.inst(g, V3.cilindro(g, q.cel ? 8 : 12), V3.fis(g, '#FFFFFF', { p: { roughness: .55, clearcoat: .3 }, rimK: .12 }), o.bastoes || 500);
    K.c = V3.inst(g, V3.cone(g, q.cel ? 10 : 16), V3.fis(g, '#FFFFFF', { p: { roughness: .6, clearcoat: .2 }, rimK: .1 }), o.cones || 120);
    K.x = V3.inst(g, new T.BoxGeometry(1, 1, 1), V3.fis(g, '#FFFFFF', { p: { roughness: .7, clearcoat: .15 }, rimK: .08 }), o.caixas || 80);
    const mE = new T.MeshBasicMaterial({ color: '#FFFFFF', toneMapped: false }); g.mats.push(mE);
    K.e = V3.inst(g, V3.esfera(g, 10), mE, o.brilhos || 260);   // brilho na cor de cada instância (luz, calor, nutrientes)
    K.F = V3.paLaminas(g, V3.paFolhaGeo(g), o.folhas || 500);
    for (const k of ['b', 'r', 'c', 'x', 'e']) g.pick.push(K[k].m);
    K.q = new T.Quaternion(); K.eu = new T.Euler();
    return K;
  }
  function fimKit(K) { for (const k of ['b', 'r', 'c', 'x', 'e', 'F']) V3.fim(K[k]); }
  const rot = (K, x, y, z) => { K.eu.set(x || 0, y || 0, z || 0, 'YXZ'); return K.q.setFromEuler(K.eu); };
  // elipsoide (rx, ry, rz) com giro yaw/pitch/roll
  const ovo = (g, K, p, rx, ry, rz, cor, k, info, ya, pi, ro) => V3.put(g, K.b, p, ya || pi || ro ? rot(K, pi, ya, ro) : null, rx, ry, rz, cor, k, info);
  const vara = (g, K, a, b, r, cor, k, info) => V3.bastao(g, K.r, a, b, r, cor, k, info);
  const caixa = (g, K, p, w, h, d, cor, k, info, ya) => V3.put(g, K.x, p, ya ? rot(K, 0, ya, 0) : null, w, h, d, cor, k, info);
  const cone = (g, K, a, b, r, cor, k, info) => { const d = sub(b, a); V3.put(g, K.c, mul(add(a, b), .5), V3.qy(g, d), r, len(d), r, cor, k, info); };
  const luz = (g, K, p, r, cor, k) => { if (r > .004) V3.put(g, K.e, p, null, r, null, null, cor, k); };
  // posição local (girada em y) a partir da base p
  const loc = (p, ya, s, v) => { const c = Math.cos(ya), sn = Math.sin(ya); return [p[0] + (v[0] * c + v[2] * sn) * s, p[1] + v[1] * s, p[2] + (-v[0] * sn + v[2] * c) * s]; };

  // ---------- plantas ----------
  function capim(g, K, p, s, k, info, t, cor) {
    const n = g.q.cel ? 6 : 8, sw = RED() ? 0 : Math.sin(t * 1.4 + p[0] * 3) * .08;
    for (let i = 0; i < n; i++) { const a = i / n * TAU + hash(i, p[0] * 9 | 0) * .8; V3.paFolha(g, K.F, add(p, [Math.cos(a) * .03 * s, 0, Math.sin(a) * .03 * s]), a, 1.15 + sw + hash(i, 3) * .25, 0, s * (.55 + .3 * hash(i, 4)), .1, cor || (i % 2 ? '#5DBE6E' : '#4AA85C'), k, info); }
  }
  function arvore(g, K, p, s, k, info, cor) {
    vara(g, K, p, add(p, [0, s * .55, 0]), s * .06, '#7A5534', k, info);
    vara(g, K, add(p, [0, s * .35, 0]), add(p, [s * .18, s * .62, 0]), s * .035, '#7A5534', k, info);
    const c = cor || '#3FA45E';
    [[0, .82, 0, .34], [.22, .7, .1, .26], [-.22, .68, -.06, .27], [.05, .66, -.24, .25], [-.06, .7, .24, .24]].forEach((v, i) => ovo(g, K, add(p, [v[0] * s, v[1] * s, v[2] * s]), v[3] * s, v[3] * s * .9, v[3] * s, i ? c : '#4DB86C', k * (i % 2 ? .9 : 1), info));
  }
  function arbusto(g, K, p, s, k, info, cor) {
    [[0, .3, 0, .3], [.25, .22, .08, .22], [-.24, .2, -.05, .22], [0, .2, .26, .2]].forEach((v, i) => ovo(g, K, add(p, [v[0] * s, v[1] * s, v[2] * s]), v[3] * s, v[3] * s * .85, v[3] * s, cor || '#4FA85A', k * (i % 2 ? .88 : 1), info));
  }

  // ---------- animais (olhos escuros pequenos; cor fixa por ser) ----------
  const olhos = (g, K, a, b, r, k) => { ovo(g, K, a, r, r, r, '#11141C', k); ovo(g, K, b, r, r, r, '#11141C', k); };
  function gafanhoto(g, K, p, s, ya, k, info, t) {
    const P = v => loc(p, ya, s, v), cor = '#9FC23A', esc = '#7E9C2A', pulo = RED() ? 0 : Math.max(0, Math.sin(t * 2.2)) * .05;
    const b = P([0, .17 + pulo, 0]);
    ovo(g, K, b, .26 * s, .085 * s, .085 * s, cor, k, info, ya);
    ovo(g, K, P([.27, .2 + pulo, 0]), .08 * s, .085 * s, .075 * s, esc, k, info, ya);
    olhos(g, K, P([.31, .24 + pulo, .05]), P([.31, .24 + pulo, -.05]), .022 * s, k);
    for (const z of [1, -1]) {
      vara(g, K, P([-.02, .19 + pulo, .06 * z]), P([-.12, .34 + pulo, .12 * z]), .022 * s, esc, k, info);
      vara(g, K, P([-.12, .34 + pulo, .12 * z]), P([-.3, .02, .14 * z]), .016 * s, esc, k, info);
      vara(g, K, P([.15, .14 + pulo, .05 * z]), P([.2, .0, .1 * z]), .012 * s, esc, k, info);
      vara(g, K, P([.05, .14 + pulo, .05 * z]), P([.04, .0, .12 * z]), .012 * s, esc, k, info);
      vara(g, K, P([.33, .28 + pulo, .03 * z]), P([.55, .4 + pulo, .12 * z]), .006 * s, esc, k, info);
    }
    ovo(g, K, P([-.05, .24 + pulo, 0]), .22 * s, .025 * s, .08 * s, '#B9D468', k * .95, info, ya);   // asas fechadas
  }
  function sapo(g, K, p, s, ya, k, info, t) {
    const P = v => loc(p, ya, s, v), cor = '#6E9A3E', b = 1 + (RED() ? 0 : Math.sin(t * 3.1) * .04);
    ovo(g, K, P([0, .2, 0]), .3 * s, .19 * s, .26 * s, cor, k, info, ya, 0, .25);
    ovo(g, K, P([.24, .16, 0]), .1 * s, .07 * s * b, .14 * s, '#E6D9A0', k, info, ya);   // papo
    for (const z of [1, -1]) {
      ovo(g, K, P([.18, .36, .13 * z]), .07 * s, .07 * s, .07 * s, cor, k, info);
      ovo(g, K, P([.22, .39, .14 * z]), .035 * s, .035 * s, .035 * s, '#11141C', k);
      ovo(g, K, P([-.18, .1, .26 * z]), .18 * s, .08 * s, .09 * s, '#5E8A34', k, info, ya + .5 * z);
      ovo(g, K, P([.2, .04, .2 * z]), .1 * s, .03 * s, .06 * s, '#5E8A34', k, info, ya - .4 * z);
    }
  }
  function cobra(g, K, p, s, ya, k, info, t) {
    const n = g.q.cel ? 16 : 24, f = RED() ? 0 : t * 1.6, cor = '#C9853C', esc = '#7A4A22';
    let q = null;
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1), x = .55 - u * 1.2, z = Math.sin(u * 7 - f) * .16 * (1 - u * .3), r = .065 * (1 - Math.pow(u, 3) * .8) * s;
      const P = loc(p, ya, s, [x, r / s, z]); ovo(g, K, P, r, r * .8, r, i % 3 ? cor : esc, k, info); q = q || P;
    }
    const h = loc(p, ya, s, [.64, .075, Math.sin(-f) * .16]); ovo(g, K, h, .1 * s, .06 * s, .075 * s, esc, k, info, ya);
    olhos(g, K, loc(p, ya, s, [.68, .11, Math.sin(-f) * .16 + .045]), loc(p, ya, s, [.68, .11, Math.sin(-f) * .16 - .045]), .016 * s, k);
  }
  function gaviao(g, K, p, s, ya, k, info, t) {
    const P = v => loc(p, ya, s, v), bat = RED() ? .3 : Math.sin(t * 5) * .5;
    ovo(g, K, P([0, 0, 0]), .3 * s, .14 * s, .14 * s, '#8A6A4A', k, info, ya, 0, .1);
    ovo(g, K, P([.02, -.05, 0]), .22 * s, .1 * s, .11 * s, '#E9DCC0', k, info, ya);
    ovo(g, K, P([.3, .08, 0]), .11 * s, .1 * s, .1 * s, '#6E5236', k, info);
    cone(g, K, P([.38, .07, 0]), P([.48, .03, 0]), .035 * s, '#F2C14B', k, info);
    olhos(g, K, P([.36, .12, .06]), P([.36, .12, -.06]), .018 * s, k);
    ovo(g, K, P([-.36, .0, 0]), .18 * s, .025 * s, .1 * s, '#6E5236', k, info, ya);
    for (const z of [1, -1]) ovo(g, K, P([-.02, .05 + Math.sin(bat) * .2 * z * z, .36 * z]), .2 * s, .025 * s, .34 * s, '#7A5A3A', k, info, ya, bat * z, 0);
  }
  function quad(g, K, p, s, ya, k, info, cor, o = {}) {
    const P = v => loc(p, ya, s, v), esc = o.esc || '#5A4030';
    ovo(g, K, P([0, .55, 0]), .42 * s, .2 * s, .2 * s, cor, k, info, ya);
    for (const [x, z] of [[.28, .12], [.28, -.12], [-.28, .12], [-.28, -.12]]) vara(g, K, P([x, .45, z]), P([x, 0, z]), .045 * s, esc, k, info);
    const hy = o.baixo ? -.16 : 0;   // boi: cabeça mais baixa e pescoço grosso
    vara(g, K, P([.36, .6, 0]), P([.5, .8 + hy, 0]), (o.baixo ? .12 : .08) * s, cor, k, info);
    ovo(g, K, P([.58, .82 + hy, 0]), .14 * s, .09 * s, .09 * s, cor, k, info, ya, 0, -.3);
    olhos(g, K, P([.64, .88 + hy, .07]), P([.64, .88 + hy, -.07]), .018 * s, k);
    if (o.chifre) for (const z of [1, -1]) vara(g, K, P([.52, .9 + hy, .06 * z]), P([.5, 1.02 + hy, .16 * z]), .016 * s, '#E8DCC0', k, info);
    vara(g, K, P([-.42, .6, 0]), P([-.5, .3, 0]), .02 * s, esc, k, info);
  }
  // capivara: corpo de barril, cabeça grande e rombuda, pernas curtas, sem cauda
  function capivara(g, K, p, s, ya, k, info) {
    const P = v => loc(p, ya, s, v), cor = '#9A6A42', esc = '#6E4A2C';
    ovo(g, K, P([0, .36, 0]), .42 * s, .22 * s, .22 * s, cor, k, info, ya);
    ovo(g, K, P([.44, .42, 0]), .2 * s, .14 * s, .12 * s, cor, k, info, ya, 0, -.35);
    ovo(g, K, P([.6, .36, 0]), .07 * s, .07 * s, .08 * s, esc, k, info);
    for (const z of [1, -1]) ovo(g, K, P([.36, .55, .07 * z]), .03 * s, .04 * s, .03 * s, esc, k, info);
    olhos(g, K, P([.52, .47, .08]), P([.52, .47, -.08]), .016 * s, k);
    for (const [x, z] of [[.24, .12], [.24, -.12], [-.24, .12], [-.24, -.12]]) vara(g, K, P([x, .24, z]), P([x, 0, z]), .05 * s, esc, k, info);
  }
  // onça-pintada: corpo longo e baixo, cabeça redonda, cauda comprida e rosetas escuras
  function onca(g, K, p, s, ya, k, info, t) {
    const P = v => loc(p, ya, s, v), cor = '#E0A84A', esc = '#3A2A1A', ab = RED() ? 0 : Math.sin(t * 6 + p[0] * 3) * .06;
    ovo(g, K, P([0, .42, 0]), .46 * s, .15 * s, .15 * s, cor, k, info, ya);
    ovo(g, K, P([.5, .5, 0]), .14 * s, .12 * s, .12 * s, cor, k, info);
    ovo(g, K, P([.6, .47, 0]), .06 * s, .05 * s, .06 * s, '#F2DDB0', k, info);
    for (const z of [1, -1]) ovo(g, K, P([.48, .62, .07 * z]), .035 * s, .035 * s, .025 * s, cor, k, info);
    olhos(g, K, P([.6, .54, .06]), P([.6, .54, -.06]), .016 * s, k);
    for (const [x, z, f] of [[.3, .1, 1], [.3, -.1, -1], [-.3, .1, -1], [-.3, -.1, 1]]) vara(g, K, P([x, .34, z]), P([x + ab * f, 0, z]), .045 * s, cor, k, info);
    vara(g, K, P([-.44, .45, 0]), P([-.7, .35, 0]), .03 * s, cor, k, info); vara(g, K, P([-.7, .35, 0]), P([-.85, .42, 0]), .028 * s, esc, k, info);
    for (let j = 0; j < 6; j++) ovo(g, K, P([-.3 + j * .12, .5 + (j % 2) * .04, (j % 2 ? .06 : -.06)]), .035 * s, .015 * s, .035 * s, esc, k);
  }
  function cogumelo(g, K, p, s, k, info, cor) {
    vara(g, K, p, add(p, [0, s * .42, 0]), s * .07, '#EFE4C6', k, info);
    ovo(g, K, add(p, [0, s * .44, 0]), s * .24, s * .12, s * .24, cor || '#C7744A', k, info);
    ovo(g, K, add(p, [s * .05, s * .52, s * .05]), s * .04, s * .02, s * .04, '#F3E3C8', k);
  }
  function bacterias(g, K, c, R, n, k, info, t, cor) {
    for (let i = 0; i < n; i++) {
      const a = hash(i, 71) * TAU + (RED() ? 0 : t * .3 * (hash(i, 72) - .5)), r = Math.sqrt(hash(i, 73)) * R, y = (hash(i, 74) - .5) * R * .5;
      ovo(g, K, add(c, [Math.cos(a) * r, y, Math.sin(a) * r]), .06, .025, .025, cor || '#2FCFBF', k, info, a, 0, hash(i, 75));
    }
  }
  function peixe(g, K, p, s, ya, k, info, t, cor) {
    const P = v => loc(p, ya, s, v), w = RED() ? 0 : Math.sin(t * 6) * .25;
    ovo(g, K, P([0, 0, 0]), .3 * s, .14 * s, .08 * s, cor || '#F25C3B', k, info, ya);
    ovo(g, K, P([-.32, 0, 0]), .1 * s, .12 * s, .02 * s, cor || '#F25C3B', k * .9, info, ya + w);
    olhos(g, K, P([.2, .04, .06]), P([.2, .04, -.06]), .02 * s, k);
  }
  function alga(g, K, p, s, k, info, t) {
    for (let j = 0; j < 3; j++) { let q = add(p, [(j - 1) * .08 * s, 0, 0]); for (let i = 0; i < 7; i++) { const n = add(q, [Math.sin(i * .9 + (RED() ? 0 : t * 1.3) + j) * .04 * s, .12 * s, 0]); vara(g, K, q, n, .02 * s, '#3FA45E', k, info); q = n; } }
  }
  function nuvem(g, K, p, s, k, info, cor) {
    [[0, 0, 0, .42], [.4, -.05, .05, .32], [-.42, -.06, -.04, .3], [.15, .18, -.05, .3], [-.12, .1, .15, .28]].forEach(v => ovo(g, K, add(p, [v[0] * s, v[1] * s, v[2] * s]), v[3] * s, v[3] * s * .8, v[3] * s, cor || '#DDE6F7', k, info));
  }
  function fabrica(g, K, p, s, k, info, t, fumaca) {
    caixa(g, K, add(p, [0, .3 * s, 0]), 1 * s, .6 * s, .6 * s, '#8E97A8', k, info);
    caixa(g, K, add(p, [-.15 * s, .7 * s, 0]), .4 * s, .2 * s, .5 * s, '#7A8394', k, info);
    vara(g, K, add(p, [.3 * s, .5 * s, 0]), add(p, [.3 * s, 1.25 * s, 0]), .08 * s, '#A9B1C0', k, info);
    if (fumaca !== false) for (let i = 0; i < 5; i++) { const f = RED() ? i / 5 : (t * .25 + i / 5) % 1; ovo(g, K, add(p, [(.3 + f * .5) * s, (1.3 + f * .9) * s, 0]), (.06 + f * .1) * s, (.06 + f * .09) * s, (.06 + f * .1) * s, '#6A7282', k * (1 - f * .4)); }
  }
  function carro(g, K, p, s, ya, k, info) {
    const P = v => loc(p, ya, s, v);
    caixa(g, K, P([0, .16, 0]), .7 * s, .16 * s, .34 * s, '#4B7BFF', k, info, ya);
    caixa(g, K, P([-.05, .3, 0]), .38 * s, .14 * s, .3 * s, '#3A62D0', k, info, ya);
    for (const [x, z] of [[.22, .17], [.22, -.17], [-.22, .17], [-.22, -.17]]) ovo(g, K, P([x, .07, z]), .07 * s, .07 * s, .03 * s, '#1B2033', k, info, ya);
  }
  // molécula de CO₂: carbono cinza no meio e dois oxigênios vermelhos (cores CPK do guia)
  function co2(g, K, p, s, a, k, info) {
    const d = [Math.cos(a) * .24 * s, Math.sin(a * .7) * .05 * s, Math.sin(a) * .24 * s];
    ovo(g, K, p, .13 * s, .13 * s, .13 * s, '#9AA3B2', k, info); ovo(g, K, add(p, d), .12 * s, .12 * s, .12 * s, '#FF4D4D', k, info); ovo(g, K, sub(p, d), .12 * s, .12 * s, .12 * s, '#FF4D4D', k, info);
  }

  // ---------- chão: caixa de solo em camadas (o corte frontal mostra o subsolo) ----------
  function material(g, cor, o = {}) {
    const T = g.T, m = new T.MeshPhysicalMaterial(Object.assign({ color: cor, roughness: .85, clearcoat: .08, envMapIntensity: .35 }, o)); g.mats.push(m); return m;
  }
  function placa(g, w, h, d, p, cor, pc, o) {
    const geo = new g.T.BoxGeometry(w, h, d); g.geos.push(geo);
    const m = V3.peca(g, geo, material(g, cor, o), pc); m.position.set(p[0], p[1], p[2]); return m;
  }
  // água: placa translúcida que deixa ver o fundo
  function agua(g, w, h, d, p, pc) { return placa(g, w, h, d, p, '#1F6F9C', pc, { transparent: true, opacity: .42, roughness: .15, clearcoat: .9, clearcoatRoughness: .1, depthWrite: false }); }

  // ---------- fluxos: partículas que andam numa curva (Bézier quadrática em 3D) ----------
  const bz = (P, f) => V.bez(P[0], P[1], P[2], f);
  function trilho(g, K, P, cor, k, o = {}) {
    const n = o.n || 14, r = o.r || .022;
    for (let i = 0; i <= n; i++) { const f = i / n; V3.put(g, K.b, bz(P, f), null, r, r, r, cor, k * .55, o.info); }
  }
  function particulas(g, K, P, cor, t, o = {}) {
    const n = o.n || 3, v = o.vel || .3, r = o.r || .07;
    for (let i = 0; i < n; i++) { const f = RED() ? (i + .5) / n : (t * v + i / n) % 1; luz(g, K, bz(P, f), r * (o.enc ? 1 - f * o.enc : 1), cor, o.k == null ? 1 : o.k); }
  }

  window.ECO3D = { cena, kit, fimKit, ovo, vara, caixa, cone, luz, loc, capim, arvore, arbusto, gafanhoto, sapo, cobra, gaviao, quad, capivara, onca, cogumelo, bacterias, peixe, alga, nuvem, fabrica, carro, co2, material, placa, agua, bz, trilho, particulas, limpa2D };
})();
