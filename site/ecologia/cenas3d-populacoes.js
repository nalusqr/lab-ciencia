/* LAB Ecologia: cena 3D de predador e presa (Martin), sobre o kit do módulo Vírus e as peças de eco3d-pecas.js.
   O campo do 2D vira um pedaço de várzea em 3D: capivaras (presas) e onças-pintadas (predadores), cada animal valendo
   cerca de 3 indivíduos do modelo (com um teto de animais na tela). O número de animais segue o modelo de Lotka-Volterra do motor 2D, que continua
   calculando por baixo; o gráfico das duas curvas fica no rodapé do palco, desenhado por cima do 3D.
   Sem WebGL, a cena desenha o 2D antigo (plano B). */
'use strict';
(function () {
  const V3 = window.VIR3D, K3 = window.ECO3D, E = window.LAB_ECO; if (!V3 || !K3 || !E) return;
  const { V } = V3, { cl, hash, TAU } = V;
  const RED = () => V3.REDUZ();
  const ach = (g, id, p) => { g.anc[id] = p; g.vis[id] = true; };
  const PRESA = '#F7C13B', PRED = '#9A6BFF';
  const PC = {
    presa: { nome: 'Capivara: presa', frase: 'Herbívora. Com pouco predador e muito capim, a população cresce depressa.', cor: PRESA },
    pred: { nome: 'Onça-pintada: predador', frase: 'Carnívora. Com muitas presas, sobra alimento e a população cresce, sempre depois do pico das presas.', cor: PRED },
    capim: { nome: 'Capim', frase: 'O alimento das capivaras. Na situação Alimento limitado, ele segura o crescimento das presas.', cor: '#3FBF6A' }
  };
  const FW = 7, FD = 2.6;   // tamanho do campo

  K3.cena('populacoes/predador', {
    fit: 10, raio: 6, bolas: 40, pecas: PC,
    rotulos: [{ pc: 'presa', t: 'presas', pr: 1 }, { pc: 'pred', t: 'predadores', pr: 2 }, { pc: 'capim', t: 'capim', pr: 3 }],
    montar(g) {
      g.K = K3.kit(g, { bolas: 900, bastoes: 520, folhas: 120, cones: 10 });
      K3.placa(g, FW + .4, .3, FD + .4, [0, -.15, 0], '#6E5236', null);
      K3.placa(g, FW + .42, .06, FD + .42, [0, .0, 0], '#5F7A36', 'capim', { roughness: .95 });
    },
    animar(g, P) {
      const S = P.S, t = P.t, K = g.K, pc = g.pecas, cel = g.q.cel;
      const nN = Math.min(cel ? 26 : 40, Math.round((S.N || 0) / 3)), nP = Math.min(cel ? 14 : 20, Math.round((S.P || 0) / 3));
      for (let i = 0; i < 10; i++) K3.capim(g, K, [-FW / 2 + .3 + hash(i, 1) * (FW - .6), .03, -FD / 2 + .2 + hash(i, 2) * (FD - .4)], .4, 1, pc.capim, t + i);
      ach(g, 'capim', [-FW / 2 + .3 + hash(0, 1) * (FW - .6), .45, -FD / 2 + .2 + hash(0, 2) * (FD - .4)]);
      const anda = (i, k, vel) => { const a = RED() ? 0 : t * vel * (hash(i, k + 2) > .5 ? 1 : -1); return [-FW / 2 + .3 + ((hash(i, k) + a / FW) % 1 + 1) % 1 * (FW - .6), .03, -FD / 2 + .25 + hash(i, k + 1) * (FD - .5)]; };
      let p0 = null;
      for (let i = 0; i < nN; i++) { const p = anda(i, 10, .05), ya = hash(i, 12) > .5 ? 0 : Math.PI; K3.capivara(g, K, p, .62, ya, 1, pc.presa); p0 = p0 || p; }
      if (p0) ach(g, 'presa', [p0[0], .55, p0[2]]);
      let q0 = null;
      for (let i = 0; i < nP; i++) { const p = anda(i, 30, .12), ya = hash(i, 32) > .5 ? 0 : Math.PI; K3.onca(g, K, p, .7, ya, 1, pc.pred, t); q0 = q0 || p; }
      if (q0) ach(g, 'pred', [q0[0], .7, q0[2]]);
      K3.fimKit(K);
    },
    // gráfico das duas populações no rodapé (o mesmo histórico S.h do motor 2D)
    sobre(g, S) {
      const X = E.X, W = E.W, H = E.H, cel = W < 560, h = S.h || [];
      const x0 = cel ? 34 : W * .1, x1 = W - (cel ? 16 : W * .08), y0 = H - (cel ? 62 : 58), y1 = H * (cel ? .62 : .6);
      V3.reserva(g, [0, y1 - 30, W, H - y1 + 30]);
      X.fillStyle = 'rgba(11,15,28,.78)'; X.beginPath(); X.roundRect ? X.roundRect(x0 - (cel ? 26 : 34), y1 - 30, x1 - x0 + (cel ? 36 : 48), y0 - y1 + 52, 12) : X.rect(x0 - 30, y1 - 30, x1 - x0 + 40, y0 - y1 + 52); X.fill();
      let ym = 120; h.forEach(q => { ym = Math.max(ym, q[0] * 1.1, q[1] * 1.1); });
      X.strokeStyle = '#5B6C99'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(x0, y1); X.lineTo(x0, y0); X.lineTo(x1, y0); X.stroke();
      E.tx('tempo', x1, y0 + 14, { a: 'right', s: 12, c: '#9DA9C4' });
      [0, 1].forEach(j => { X.beginPath(); h.forEach((q, i) => { const x = x0 + i / 420 * (x1 - x0), y = y0 - q[j] / ym * (y0 - y1); i ? X.lineTo(x, y) : X.moveTo(x, y); }); X.strokeStyle = j ? PRED : PRESA; X.lineWidth = 2.5; X.lineJoin = 'round'; X.stroke(); });
      E.tx('presas: ' + Math.round(S.N || 0), x0 + 8, y1 - 12, { a: 'left', f: E.FD, s: 12, c: PRESA, bg: true });
      E.tx('predadores: ' + Math.round(S.P || 0), x1, y1 - 12, { a: 'right', f: E.FD, s: 12, c: PRED, bg: true });
    },
    camera(g, P) {
      const d = V3.deitado(g);
      // o campo fica na metade de cima; o gráfico ocupa o rodapé
      return V3.viva({ th: d ? .1 : .5, fi: .62, d: V3.enquadrar(g, d ? FW / 2 + .2 : FD + .6, 1.4) * (d ? 1.5 : 1.25), al: [0, d ? -.75 : -2.6, d ? .7 : .4] }, P.t, .25);
    }
  });
})();
