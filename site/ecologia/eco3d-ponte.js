/* LAB Ecologia: ponte entre o motor 2D do index.html (fechado numa função) e o kit 3D compartilhado
   (../biologia-molecular/mol3d.js, ../virus/vir3d.js e peças). O kit foi escrito para motores que deixam SC, X, W, H,
   LB, tx e parentes no escopo global; aqui eles viram propriedades de window que leem e escrevem no motor da Ecologia.
   Sem window.LAB_ECO (página sem os ganchos) nada é criado e as cenas 3D não se registram: fica o desenho 2D. */
'use strict';
(function () {
  const E = window.LAB_ECO; if (!E) return;
  const def = (n, get, set) => { try { Object.defineProperty(window, n, { configurable: true, get, set: set || (() => {}) }); } catch (e) { /* já existe */ } };
  window.SC = E.SC; window.C = E.C; window.FT = E.FT; window.FH = E.FH; window.FD = E.FD;
  def('X', () => E.X, v => { E.X = v; });
  def('W', () => E.W); def('H', () => E.H); def('LB', () => E.LB); def('NAR', () => E.W < 700);
  window.LBS = [];
  window.tx = (s, x, y, o) => E.tx(s, x, y, o);
  window.tw = (s, sz, w) => { const x = E.X; x.save(); x.font = `${w || 400} ${Math.max(12, sz || 13)}px ${E.FT}`; const r = x.measureText(s).width; x.restore(); return r; };
  // pastilha de rótulo com bolinha da cor (a ficha do kit)
  window.tok = (x, y, s, cor, o = {}) => {
    const X = E.X; X.save(); X.globalAlpha = o.a == null ? 1 : o.a; X.font = `700 12px ${E.FT}`;
    const w = X.measureText(s).width + 26, h = 22, x0 = x - w / 2, y0 = y - h / 2;
    X.beginPath(); X.roundRect ? X.roundRect(x0, y0, w, h, 11) : X.rect(x0, y0, w, h); X.fillStyle = 'rgba(11,15,28,.84)'; X.fill();
    X.strokeStyle = 'rgba(255,255,255,.1)'; X.lineWidth = 1; X.stroke();
    X.beginPath(); X.arc(x0 + 11, y, 4, 0, Math.PI * 2); X.fillStyle = cor || '#CFE0FF'; X.fill();
    X.fillStyle = '#E8EDF7'; X.textBaseline = 'middle'; X.textAlign = 'left'; X.fillText(s, x0 + 19, y + .5); X.restore();
  };
  window.cap = s => { const c = document.getElementById('cap'); if (c && c.innerHTML !== s) c.innerHTML = s; };
})();
