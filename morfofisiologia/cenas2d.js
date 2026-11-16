/* LAB Morfofisiologia: cenas 2D de alto nível (Martin), onde o 3D não ajuda.
   - tipos/escala: zoom contínuo pela régua logarítmica, do ribossomo ao óvulo, com cada miniatura em escala real
     em relação às vizinhas (a barra de escala e a janela na régua mostram onde a "lente" está).
   - teoria/postulados: os cinco postulados entram em sequência, com uma cortina que revela o próximo.
   Tudo é função do tempo da cena: pausar congela; com movimento reduzido, cada tela abre parada no estado final. */
'use strict';
(function () {
  const TAU = Math.PI * 2, cl = (v, a, b) => (v < a ? a : v > b ? b : v), mix = (a, b, t) => a + (b - a) * t;
  const ss = t => { t = cl(t, 0, 1); return t * t * (3 - 2 * t); }, io = t => { t = cl(t, 0, 1); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FT = "'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', system-ui, sans-serif", FH = "'Space Grotesk', sans-serif";
  const nf = new Intl.NumberFormat('pt-BR');

  (window.MORFO_CENAS = window.MORFO_CENAS || []).push(API => {
    // ================= ESCALA =================
    const esc = API.SC['tipos/escala'];
    if (esc) {
      const IT = [['ribossomo', .025, '#E03131', 'cerca de 25 nm'], ['vírus da gripe', .1, '#FFA8A8', 'cerca de 100 nm'], ['Mycoplasma', .3, '#C8E07A', 'cerca de 0,3 µm'], ['mitocôndria', 1, '#F25C3B', 'cerca de 1 µm'], ['E. coli', 2, '#A9C54A', 'cerca de 2 µm'], ['hemácia', 7.5, '#D7303B', 'cerca de 7,5 µm'], ['célula animal', 20, '#F06AAE', 'cerca de 20 µm'], ['célula vegetal', 50, '#3FBF6A', 'cerca de 50 µm'], ['óvulo humano', 120, '#F7C13B', 'cerca de 120 µm']];
      const XW = [0]; for (let i = 1; i < IT.length; i++) XW.push(XW[i - 1] + IT[i - 1][1] / 2 + IT[i][1] * .5 + IT[i][1] * .32);
      const D = 1.7, M = 1.5, RV = 4.2, PER = (IT.length - 1) * (D + M) + D + RV;
      const foco = t => {   // índice (fracionário) do item em foco
        let u = t % PER;
        for (let k = 0; k < IT.length - 1; k++) { if (u < D) return k; u -= D; if (u < M) return k + io(u / M); u -= M; }
        if (u < D) return IT.length - 1; u -= D; return (IT.length - 1) * (1 - io(u / RV));
      };
      const gr = (X, x, y, r, c0, c1) => { const g = X.createRadialGradient(x - r * .35, y - r * .4, r * .05, x, y, r); g.addColorStop(0, c0); g.addColorStop(1, c1); return g; };
      const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
      const MINI = [
        (X, x, y, r) => { X.fillStyle = gr(X, x, y - r * .15, r * .62, '#FF8F8F', '#A61E1E'); X.beginPath(); X.ellipse(x, y - r * .14, r * .62, r * .5, 0, 0, TAU); X.fill(); X.fillStyle = gr(X, x, y + r * .4, r * .42, '#FFC9C9', '#C2414A'); X.beginPath(); X.ellipse(x + r * .06, y + r * .42, r * .46, r * .3, -.15, 0, TAU); X.fill(); },
        (X, x, y, r, t) => { X.strokeStyle = '#FFD0D0'; X.lineWidth = Math.max(1, r * .06); for (let i = 0; i < 22; i++) { const a = i / 22 * TAU + t * .05; X.beginPath(); X.moveTo(x + Math.cos(a) * r * .66, y + Math.sin(a) * r * .66); X.lineTo(x + Math.cos(a) * r * .95, y + Math.sin(a) * r * .95); X.stroke(); X.fillStyle = i % 3 ? '#FFA8A8' : '#FFE1A6'; X.beginPath(); X.arc(x + Math.cos(a) * r * .97, y + Math.sin(a) * r * .97, r * .07, 0, TAU); X.fill(); } X.fillStyle = gr(X, x, y, r * .7, '#FFD6D6', '#B8505A'); X.beginPath(); X.arc(x, y, r * .7, 0, TAU); X.fill(); },
        (X, x, y, r, t) => { X.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * TAU, rr = r * (.86 + .1 * Math.sin(a * 3 + t * .6) + .05 * Math.sin(a * 7)); X[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rr, y + Math.sin(a) * rr); } X.fillStyle = gr(X, x, y, r, 'rgba(232,248,190,.95)', 'rgba(120,150,50,.85)'); X.fill(); X.strokeStyle = '#E8F8BE'; X.lineWidth = Math.max(1, r * .04); X.stroke(); X.fillStyle = 'rgba(80,60,140,.55)'; for (let i = 0; i < 9; i++) { const a = i * 2.4, d = r * .5 * ((i * 37 % 10) / 10); X.beginPath(); X.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * .06, 0, TAU); X.fill(); } },
        (X, x, y, r) => { X.save(); X.translate(x, y); X.rotate(-.35); const w = r, h = r * .5; X.beginPath(); X.ellipse(0, 0, w, h, 0, 0, TAU); X.fillStyle = gr(X, 0, 0, w, '#FFB59E', '#A8321F'); X.fill(); X.strokeStyle = '#FFD0C0'; X.lineWidth = Math.max(1, r * .05); X.stroke(); X.strokeStyle = 'rgba(255,220,205,.85)'; X.lineWidth = Math.max(1, r * .045); X.beginPath(); for (let i = 0; i <= 12; i++) { const px = -w * .78 + i / 12 * w * 1.56, py = (i % 2 ? 1 : -1) * h * .55 * Math.sqrt(1 - (px / w) ** 2); X[i ? 'lineTo' : 'moveTo'](px, py); } X.stroke(); X.restore(); },
        (X, x, y, r, t) => { X.save(); X.translate(x, y); X.rotate(.12); X.strokeStyle = 'rgba(221,232,255,.8)'; X.lineWidth = Math.max(1, r * .03); for (let k = 0; k < 3; k++) { X.beginPath(); for (let i = 0; i <= 30; i++) { const f = i / 30; X[i ? 'lineTo' : 'moveTo'](-r - f * r * 1.1, (k - 1) * r * .18 + Math.sin(f * 9 - t * 6 + k) * r * .09 * f); } X.stroke(); } const w = r, h = r * .44; X.beginPath(); X.roundRect(-w, -h, w * 2, h * 2, h); X.fillStyle = gr(X, 0, 0, w, '#D9F08A', '#5E7A1C'); X.fill(); X.strokeStyle = '#E8F8BE'; X.lineWidth = Math.max(1, r * .04); X.stroke(); X.strokeStyle = 'rgba(154,107,255,.8)'; X.beginPath(); for (let i = 0; i <= 30; i++) { const a = i / 30 * TAU; X[i ? 'lineTo' : 'moveTo'](Math.cos(a) * w * .4 + Math.sin(a * 3) * w * .08, Math.sin(a) * h * .45); } X.stroke(); X.restore(); },
        (X, x, y, r) => { X.save(); X.translate(x, y); X.scale(1, .8); const g = X.createRadialGradient(0, 0, r * .1, 0, 0, r); g.addColorStop(0, '#8E1520'); g.addColorStop(.45, '#B7212C'); g.addColorStop(.78, '#F0505A'); g.addColorStop(1, '#9B1822'); X.fillStyle = g; X.beginPath(); X.arc(0, 0, r, 0, TAU); X.fill(); X.restore(); },
        (X, x, y, r, t) => { X.beginPath(); for (let i = 0; i <= 48; i++) { const a = i / 48 * TAU, rr = r * (.95 + .04 * Math.sin(a * 4 + t * .4) + .02 * Math.sin(a * 9)); X[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rr, y + Math.sin(a) * rr); } X.fillStyle = gr(X, x, y, r, 'rgba(255,190,220,.42)', 'rgba(140,40,95,.55)'); X.fill(); X.strokeStyle = '#F06AAE'; X.lineWidth = Math.max(1, r * .025); X.stroke(); X.fillStyle = gr(X, x - r * .15, y + r * .05, r * .3, '#C9AEFF', '#5A3FB0'); X.beginPath(); X.arc(x - r * .15, y + r * .05, r * .3, 0, TAU); X.fill(); X.fillStyle = 'rgba(242,92,59,.8)'; for (let i = 0; i < 6; i++) { const a = i * 1.1 + .4, d = r * .62; X.beginPath(); X.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d, r * .09, r * .045, a, 0, TAU); X.fill(); } },
        (X, x, y, r) => { const w = r, h = r * .64; X.beginPath(); X.roundRect(x - w, y - h, w * 2, h * 2, r * .12); X.fillStyle = 'rgba(30,60,40,.55)'; X.fill(); X.strokeStyle = '#7FD08A'; X.lineWidth = Math.max(1.2, r * .05); X.stroke(); X.fillStyle = 'rgba(127,209,255,.18)'; X.strokeStyle = 'rgba(127,209,255,.55)'; X.lineWidth = Math.max(1, r * .015); X.beginPath(); X.ellipse(x + w * .12, y, w * .58, h * .62, 0, 0, TAU); X.fill(); X.stroke(); X.fillStyle = gr(X, x - w * .7, y - h * .3, r * .16, '#C9AEFF', '#5A3FB0'); X.beginPath(); X.arc(x - w * .7, y - h * .3, r * .15, 0, TAU); X.fill(); X.fillStyle = '#3FCF6A'; for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, px = x + Math.cos(a) * w * .84, py = y + Math.sin(a) * h * .8; X.beginPath(); X.ellipse(px, py, r * .09, r * .05, a, 0, TAU); X.fill(); } },
        (X, x, y, r, t) => { X.fillStyle = 'rgba(255,225,166,.5)'; for (let i = 0; i < 26; i++) { const a = i / 26 * TAU + t * .02; X.beginPath(); X.arc(x + Math.cos(a) * r * 1.02, y + Math.sin(a) * r * 1.02, r * .1, 0, TAU); X.fill(); } X.fillStyle = 'rgba(232,240,255,.16)'; X.beginPath(); X.arc(x, y, r * .93, 0, TAU); X.fill(); X.fillStyle = gr(X, x, y, r * .78, '#FFE7B0', '#B8822A'); X.beginPath(); X.arc(x, y, r * .78, 0, TAU); X.fill(); X.fillStyle = gr(X, x + r * .2, y - r * .15, r * .16, '#E9DDFF', '#7A5CD0'); X.beginPath(); X.arc(x + r * .2, y - r * .15, r * .16, 0, TAU); X.fill(); }
      ];
      esc.draw = function (t) {
        const X = API.X, W = API.W, H = API.H, LB = window.LB, nar = W < 640, rm = RM();
        const f = rm ? 5 : foco(t), k0 = Math.floor(f), k1 = Math.min(IT.length - 1, k0 + 1), fr = f - k0;
        const lv = mix(Math.log10(IT[k0][1]), Math.log10(IT[k1][1]), fr), Dpx = Math.min(W * (nar ? .44 : .26), H * .36), s = Dpx / Math.pow(10, lv);
        const xc = mix(XW[k0], XW[k1], fr), cy = H * (nar ? .42 : .43), yr = H - (nar ? 118 : 112);
        // miniaturas em escala real
        const vis = [];
        for (let i = IT.length - 1; i >= 0; i--) {
          const [n, v, c] = IT[i], r = v / 2 * s, x = W / 2 + (XW[i] - xc) * s;
          if (r < .5 || r > H * 3 || x + r < -40 || x - r > W + 40) continue;
          const foc = Math.max(0, 1 - Math.abs(i - f) * 1.4);
          X.globalAlpha = .55 + .45 * foc;
          if (r < 2.5) { X.fillStyle = c; X.beginPath(); X.arc(x, cy, Math.max(1, r), 0, TAU); X.fill(); }
          else MINI[i](X, x, cy, r, t);
          X.globalAlpha = 1; vis.push([i, x, r, foc]);
        }
        // nomes (só dos que estão visíveis e grandes o bastante)
        if (LB) for (const [i, x, r, foc] of vis) {
          if (r < 7) continue;
          X.font = `600 ${nar ? 13 : 14}px ${FT}`; const w1 = Math.max(X.measureText(IT[i][0]).width, (X.font = `12px ${FT}`, X.measureText(IT[i][3]).width)); if (x - w1 / 2 < 8 || x + w1 / 2 > W - 8) continue;
          const ly = Math.min(cy + r * (i === 7 ? .7 : 1) + 22, yr - 54), a = r > H * .7 ? .0 : .5 + .5 * foc; if (a < .05) continue;
          X.globalAlpha = a; X.textAlign = 'center'; X.textBaseline = 'middle';
          X.font = `600 ${nar ? 13 : 14}px ${FT}`; X.lineWidth = 4; X.lineJoin = 'round'; X.strokeStyle = 'rgba(11,15,28,.9)'; X.strokeText(IT[i][0], x, ly); X.fillStyle = foc > .5 ? '#FFFFFF' : '#C9D2E6'; X.fillText(IT[i][0], x, ly);
          X.font = `12px ${FT}`; X.strokeText(IT[i][3], x, ly + 17); X.fillStyle = '#9DA9C4'; X.fillText(IT[i][3], x, ly + 17); X.globalAlpha = 1;
        }
        // barra de escala (número "redondo" de 1, 2 ou 5)
        const alvo = (nar ? 90 : 120) / s, e = Math.floor(Math.log10(alvo)); let nice = Math.pow(10, e); for (const m of [1, 2, 5]) if (m * Math.pow(10, e) <= alvo) nice = m * Math.pow(10, e);
        const bw = nice * s, bx = nar ? 16 : W * .08, by = yr - 34, um = nice;
        X.fillStyle = '#E8EDF7'; X.fillRect(bx, by, bw, 3); X.fillRect(bx, by - 4, 1.5, 11); X.fillRect(bx + bw - 1.5, by - 4, 1.5, 11);
        const lbl = um >= 1 ? `${nf.format(+um.toPrecision(2))} µm` : `${nf.format(+(um * 1000).toPrecision(2))} nm`;
        X.font = `600 13px ${FT}`; X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillStyle = '#E8EDF7'; X.fillText(lbl, bx + bw + 10, by + 1);
        // régua logarítmica com a janela da lente
        const x0 = W * (nar ? .06 : .08), x1 = W * (nar ? .94 : .92), lg = v => (Math.log10(v) + 2) / (Math.log10(300) + 2), xp = v => x0 + lg(v) * (x1 - x0);
        X.strokeStyle = 'rgba(200,210,240,.45)'; X.lineWidth = 1.2; X.beginPath(); X.moveTo(x0, yr); X.lineTo(x1, yr); X.stroke();
        for (const [v, sx] of [[.01, '10 nm'], [.1, '100 nm'], [1, '1 µm'], [10, '10 µm'], [100, '100 µm']]) { X.beginPath(); X.moveTo(xp(v), yr - 5); X.lineTo(xp(v), yr + 5); X.strokeStyle = 'rgba(200,210,240,.7)'; X.stroke(); X.font = `12px ${FT}`; X.textAlign = 'center'; X.fillStyle = '#9DA9C4'; X.fillText(sx, xp(v), yr + 18); }
        const wl = xp(Math.pow(10, lv - .55)), wr = xp(Math.pow(10, lv + .55));
        X.fillStyle = 'rgba(255,179,71,.12)'; X.strokeStyle = 'rgba(255,179,71,.75)'; X.lineWidth = 1.2; X.beginPath(); X.roundRect(wl, yr - 11, wr - wl, 22, 6); X.fill(); X.stroke();
        IT.forEach(([n, v, c], i) => { const foc = Math.max(0, 1 - Math.abs(i - f) * 1.4); X.fillStyle = c; X.beginPath(); X.arc(xp(v), yr, 3 + foc * 2.5, 0, TAU); X.fill(); });
        if (!nar) { X.font = `12px ${FT}`; X.fillStyle = '#9DA9C4'; X.textAlign = 'center'; X.fillText('escala logarítmica: cada marca é 10 vezes maior', W / 2, yr + 38); }
      };
    }

    // ================= POSTULADOS =================
    const pos = API.SC['teoria/postulados'];
    if (pos) {
      const d0 = pos.draw;
      pos.draw = function (t, S) {
        const X = API.X, W = API.W, H = API.H;
        if (S._pv !== S.v) { S._pa = S._pv; S._pt = t; S._pv = S.v; }
        const e = RM() || S._pa == null ? 1 : io((t - S._pt) / .9);
        if (e >= 1) { d0.call(this, t, S); return; }
        // cortina: o postulado anterior sai pela direita enquanto o novo entra da esquerda, com um leve recuo de câmera
        const bx = W * e;
        X.save(); X.beginPath(); X.rect(bx, 0, W - bx, H); X.clip(); X.translate(W / 2, H / 2); X.scale(1 - .03 * e, 1 - .03 * e); X.translate(-W / 2, -H / 2); d0.call(this, t, Object.assign({}, S, { v: S._pa })); X.restore();
        X.save(); X.beginPath(); X.rect(0, 0, bx, H); X.clip(); X.translate(W / 2, H / 2); X.scale(1.03 - .03 * e, 1.03 - .03 * e); X.translate(-W / 2, -H / 2); d0.call(this, t, S); X.restore();
        const g = X.createLinearGradient(bx - 24, 0, bx + 2, 0); g.addColorStop(0, 'rgba(255,179,71,0)'); g.addColorStop(1, 'rgba(255,179,71,.35)');
        X.fillStyle = g; X.fillRect(bx - 24, 0, 26, H); X.fillStyle = 'rgba(255,214,150,.8)'; X.fillRect(bx, 0, 1.5, H);
      };
    }
  });
})();
