/* LAB Microrganismos e fungos: peças 3D próprias deste módulo (Martin), sobre o kit do módulo Vírus (../virus/vir3d.js e
   ../virus/vir3d-pecas.js, reaproveitados sem cópia: fago T4, cadeia de DNA em bastões, laço, membranas translúcidas).
   Aqui ficam: bactérias instanciadas em corte (parede verde, membrana e citoplasma), nucleoide enovelado, plasmídeos em
   anel, flagelo em hélice que gira, fímbrias, hifas que crescem por galhos e cílios que batem em onda. Desenho próprio,
   sem modelos de terceiros. */
'use strict';
(function () {
  const V3 = window.VIR3D; if (!V3 || !V3.kitV) return;
  const { V } = V3, { cl, mix, sst, add, sub, mul, nrm, cross, hash, TAU } = V;
  const RED = () => V3.REDUZ();

  // ---------- bactérias em corte (instanciadas) ----------
  // cápsula de raio 1 e meio comprimento 2,2 (eixo y); escala uniforme r/1 mantém as pontas redondas
  const HL = 2.2;
  function bacterias(g, max, pl, o = {}) {
    const T = g.T, geo = V3.capsula(g, 1, 1.2, g.q.cel ? 22 : 32), pls = pl ? [pl] : null;
    const par = V3.celulas(g, max, { geo, planos: pls, kc: .62, pc: o.pcPar, p: { roughness: .55, sheen: .6, sheenColor: new T.Color('#E8FFB0') } });
    const mem = V3.celulas(g, max, { geo, planos: pls, kc: .9, pc: o.pcMem, p: { roughness: .45 } });
    const cit = V3.celulas(g, max, { geo, planos: pls, kc: .24, pc: o.pcCit, p: { roughness: .5 } });
    return { par, mem, cit, q: new T.Quaternion() };
  }
  // uma bactéria: centro p, eixo dir, raio r (o comprimento sai do raio: cerca de 4,4 r); k = brilho; info por camada
  function bact(g, B, p, dir, r, o = {}) {
    V3.qy(g, dir, B.q);
    V3.celula(g, B.par, p, r, o.cor || C.parede, { q: B.q, k: o.k, pc: o.iPar });
    V3.celula(g, B.mem, p, r * .93, C.membrana, { q: B.q, k: o.k, pc: o.iMem });
    V3.celula(g, B.cit, p, r * .9, o.corC || '#C25A8E', { q: B.q, k: o.k, pc: o.iCit });
  }
  function fimB(B) { V3.fimCel(B.par); V3.fimCel(B.mem); V3.fimCel(B.cit); }

  // ---------- nucleoide: laço de DNA enovelado, sempre atrás do plano de corte (z < 0) ----------
  function nucleoide(n, c, rx, ry, s) {
    const P = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU, w = 1 + .22 * Math.sin(a * 5 + s) + .12 * Math.sin(a * 11 + s * 2);
      P.push([c[0] + Math.cos(a) * rx * w + Math.sin(a * 13 + s) * rx * .1, c[1] + Math.sin(a) * ry * w + Math.cos(a * 9 + s) * ry * .14, c[2] - Math.abs(Math.sin(a * 3 + s)) * .22 - .04]);
    }
    return P;
  }

  // ---------- plasmídeos (anéis) ----------
  function plasmideos(g, max, pc) {
    const W = V3.inst(g, V3.toro(g, .2, g.q.cel ? 12 : 18), V3.fis(g, '#FFFFFF', { p: { roughness: .35, clearcoat: .7 }, rim: '#FFE7A8', rimK: .35 }), max, null, pc ? g.pecas[pc] : null);
    g.pick.push(W.m); W.q = new g.T.Quaternion(); W.e = new g.T.Euler(); return W;
  }
  function plasmideo(g, W, p, s, gir, k, info, cor) { W.e.set(.9 + gir * .3, gir, .4); W.q.setFromEuler(W.e); V3.put(g, W, p, W.q, s, s, s, cor || C.plasmideo, k == null ? 1 : k, info); }

  // ---------- flagelo: hélice que sai de um polo (base b, eixo d) e gira ----------
  function flagelo(g, n, mat, pai, pc) { return V3.tubo(g, n, g.q.cel ? 6 : 8, mat, pai, pc); }
  function helice(b, d, L, amp, voltas, fase, n) {
    const u = nrm(cross(d, Math.abs(d[1]) < .9 ? [0, 1, 0] : [1, 0, 0])), w = cross(d, u), P = [];
    for (let i = 0; i < n; i++) { const s = i / (n - 1), a = s * voltas * TAU - fase, A = amp * sst(0, .18, s); P.push(add(add(b, mul(d, s * L)), add(mul(u, Math.cos(a) * A), mul(w, Math.sin(a) * A)))); }
    return P;
  }

  // ---------- hifas: árvore de segmentos em 3D [a, b, nascimento, profundidade] ----------
  function arvore(seed, raiz, dir0, l0, max, plano) {
    let s = seed; const R = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }, out = [];
    (function gera(a, d, l, dep, b) {
      const bb = add(a, mul(d, l)); out.push([a, bb, b, dep]); if (dep >= max) return;
      const nb = dep < 1 ? 3 : 2;
      for (let k = 0; k < nb; k++) {
        let nd = add(d, [(R() - .5) * 1.1 + (k ? (k % 2 ? .6 : -.6) : 0), plano ? 0 : (R() - .5) * .9, (R() - .5) * 1.1]);
        if (plano === 'xz') nd[1] = 0; nd = nrm(nd);
        gera(bb, nd, l * (.76 + R() * .14), dep + 1, b + .1 + R() * .06);
      }
    })(raiz, nrm(dir0), l0, 0, R() * .12);
    return out;
  }
  // desenha uma árvore crescida até g0 (0 a 1); devolve as pontas já crescidas
  function hifas(g, Wr, arv, g0, r, cor, info, pontas) {
    for (const h of arv) {
      const p = cl((g0 - h[2]) / .14, 0, 1); if (p <= 0) continue;
      const b = V.lerp3(h[0], h[1], p); V3.bastao(g, Wr, h[0], b, r * (1 - h[3] * .12), cor, 1, info);
      if (h[3] > 0) V3.bola(g, h[0], r * (1 - h[3] * .12) * 1.05, cor, 1, info);
      if (pontas && p >= 1 && h[3] === 4) pontas.push(h[1]);
    }
  }

  // ---------- cílios que batem em onda metacrônica ----------
  // base b, normal n, tangente de batida tg; devolve a ponta (para desenhar como bastão)
  function cilio(b, n, tg, L, fase) {
    const f = RED() ? .3 : fase, k = Math.sin(f), pow = k > 0 ? k : k * .45;
    return add(b, mul(nrm(add(n, mul(tg, pow * 1.1))), L));
  }

  Object.assign(V3, { mHL: HL, bacterias, bact, fimB, nucleoide, plasmideos, plasmideo, flagelo, helice, arvore, hifas, cilio });
})();
