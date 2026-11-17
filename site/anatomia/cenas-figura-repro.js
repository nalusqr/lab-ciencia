/* LAB Anatomia: reprodutor em viagens sobre figuras de IA realistas, no padrão de cenas-figura-digestorio.js (Martin + Íris).
   Figuras (Nano Banana 2): -v4a mostra o sistema genital masculino em corte sagital e o feminino em corte frontal,
   usados como duas vistas (recortes da mesma imagem); -v4b mostra ovário, tuba e útero de perto, com folículos,
   corpo lúteo, ovulação, fecundação na ampola, clivagem e nidação.
   1. reprodutor/ciclo, duas viagens:
      a) "Viagem dos gametas": os espermatozoides dos túbulos seminíferos até a tuba e o ovócito do ovário até a nidação.
         Medidor: quantos espermatozoides seguem na etapa e, do lado feminino, FSH, LH, estrogênio e progesterona no dia do ciclo.
      b) "Ciclo em etapas": menstruação, fase folicular, ovulação por volta do dia 14, fase lútea e fim do ciclo,
         com o dia andando e o mesmo medidor de hormônios (pico de LH na ovulação, progesterona alta na fase lútea).
   2. reprodutor/prevencao, "Onde cada método age": vasectomia, camisinha masculina, camisinha feminina, DIU, laqueadura
      e pílula, cada um no ponto do trajeto em que age; o medidor diz onde age e se protege contra ISTs (só as camisinhas).
   Tocar num ponto da figura leva a viagem até ele; a vista certa entra sozinha na etapa certa. Os modos antigos (desenho
   plano) seguem nos botões de sempre e atrás de "Ver esquema". Com prefers-reduced-motion nada anda sozinho: etapas por botão.
   Usa os globais do motor (SC, X, W, H, NAR, cap, cv). Carregar depois das outras cenas-figura-*.js e antes de
   LAB_ANATOMIA_iniciar(). Texto na tela: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  if (!window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const eIO = u => { u = cl(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const fr = v => v - Math.floor(v);
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${cl(a, 0, 1)})`; };
  const FT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const TXT = '#E8EDF7', DIM = '#9DA9C4', AMB = '#FFB347', ERRO = '#FF6B6B', OK = '#5FCF8A';
  const ESPC = '#9FDCFF', OVOC = '#FFD27A', SEMC = '#F4EFD8', SANG = '#D94B57';
  const HC = { fsh: '#6FB1E8', lh: '#FFB347', e: '#F06AAE', p: '#2FCFBF' };
  const AS = [.88, .491];   // proporção das figuras (880 x 491); x e y em % da imagem inteira

  // ---------- hormônios do ciclo (0 a 1), mesmos formatos do calendário de cenas-r.js ----------
  const gau = (d, m, s) => Math.exp(-.5 * ((d - m) / s) * ((d - m) / s));
  function hor(d) {
    return {
      fsh: .18 + .32 * gau(d, 3, 3.2) + .3 * gau(d, 14, 1.1),
      lh: .1 + .85 * gau(d, 14, 1) + .06 * gau(d, 21, 3),
      e: .1 + .62 * gau(d, 13, 2.6) + .3 * gau(d, 21, 3.4),
      p: .05 + .9 * gau(d, 21, 3.6),
      en: d <= 5 ? lerp(.4, .12, (d - 1) / 4) : d <= 14 ? lerp(.12, .55, (d - 5) / 9) : d <= 26 ? lerp(.55, .9, (d - 14) / 12) : lerp(.9, .35, (d - 26) / 2)
    };
  }
  const nivel = (k, v) => k === 'lh' && v > .8 ? 'pico' : v < .25 ? 'baixo' : v < .5 ? 'médio' : v < .75 ? 'alto' : 'muito alto';
  const fase = d => d < 5.5 ? 'menstruação' : d < 13.5 ? 'fase folicular' : d < 14.6 ? 'ovulação' : 'fase lútea';

  // ---------- curvas suaves (Catmull-Rom) medidas em distância real da figura ----------
  function curva(P) {
    const N = 12, AM = [], IDX = [], LC = [0];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      IDX[i] = AM.length;
      for (let j = 0; j < N; j++) { const t = j / N, t2 = t * t, t3 = t2 * t; AM.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3))); }
    }
    IDX[P.length - 1] = AM.length; AM.push(P[P.length - 1].slice());
    for (let i = 1; i < AM.length; i++) LC.push(LC[i - 1] + Math.hypot((AM[i][0] - AM[i - 1][0]) * AS[0], (AM[i][1] - AM[i - 1][1]) * AS[1]));
    const LT = LC[LC.length - 1] || 1, LF = LC.map(v => v / LT);
    return {
      AM, LF, FI: i => LF[IDX[i]],
      em(f) { f = cl(f, 0, 1); let i = 1; while (i < LF.length - 1 && LF[i] < f) i++; const u = (f - LF[i - 1]) / ((LF[i] - LF[i - 1]) || 1), a = AM[i - 1], b = AM[i]; return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.atan2((b[1] - a[1]) * AS[1], (b[0] - a[0]) * AS[0])]; }
    };
  }
  // trecho de uma curva entre os pontos i0 e i1, com a fração k (0 a 1)
  const trecho = (C, i0, i1, k) => lerp(C.FI(i0), C.FI(i1), k);
  function rastro(R, X, C, f0, f1, cor, lw) {
    if (f1 <= f0) return;
    X.save(); X.setLineDash([2, 5]); X.lineCap = 'round'; X.strokeStyle = cor; X.lineWidth = lw || 1.6; X.beginPath();
    let st = false; for (let i = 0; i < C.AM.length; i++) { if (C.LF[i] < f0) continue; if (C.LF[i] > f1) break; const s = R.pt(C.AM[i][0], C.AM[i][1]); if (!st) { X.moveTo(s[0], s[1]); st = true; } else X.lineTo(s[0], s[1]); }
    const e = C.em(f1), s = R.pt(e[0], e[1]); if (st) { X.lineTo(s[0], s[1]); X.stroke(); } X.restore();
  }
  const P = (R, C, f) => { const e = C.em(f), s = R.pt(e[0], e[1]); return [s[0], s[1], e[2]]; };

  // ---------- caminhos conferidos sobre as figuras ----------
  // masculino (vista a): túbulos, epidídimo, ducto deferente contornando a bexiga, ducto ejaculatório na próstata, uretra
  const MC = curva([[32.3, 72], [33.5, 68.5], [31.5, 65.8], [29.6, 67.5], [28.7, 72], [29, 76], [29.8, 70], [31, 63.5], [33, 57], [34.6, 51], [35.8, 45],
    [36, 40], [35.2, 35.5], [32.5, 32.4], [27.5, 31.3], [22.8, 30.9], [20.4, 33], [20.3, 37.5], [21, 40.5], [22.4, 43.2], [24, 46.5], [24.8, 50],
    [26, 53.2], [29, 53.9], [33, 53.7], [36.5, 54.6], [38.8, 58], [39.8, 64], [40, 72], [40, 79.5]]);
  // feminino (vista f): espermatozoides da vagina até a tuba direita da figura
  const FS = curva([[75, 80], [75, 70], [75, 62], [75, 57], [75, 50], [75.5, 43], [77.5, 37], [80, 34], [84, 33], [88, 32], [90.5, 31.2]]);
  // feminino (vista f): ovócito do folículo até o útero
  const OF = curva([[91.6, 39.6], [94.2, 38.5], [95.4, 34], [93.5, 29.5], [90.5, 31.2], [86, 32.6], [82, 33.4], [79, 34.5], [76.5, 39], [75.5, 44]]);
  // ovário e tuba de perto (vista b): ovulação, captura pelas fímbrias e ampola
  const OB = curva([[78, 75], [80, 82], [84, 80.5], [88, 73], [91, 61], [92.5, 48], [92, 37], [89.5, 29.5], [85.5, 27]]);
  // da ampola ao endométrio (vista b): clivagem e nidação
  const ZB = curva([[85.5, 27], [79, 24.5], [73, 26], [68, 28.5], [63, 31.5], [58, 35], [53, 38], [47, 40], [42, 40.5], [36, 40.5], [30, 41.5], [23.5, 44], [18.5, 49], [14.5, 55]]);
  // espermatozoides chegando à ampola pela tuba (vista b)
  const SB = curva([[30, 41.5], [36, 40.5], [42, 40.5], [47, 40], [53, 38], [58, 35], [63, 31.5], [68, 28.5], [73, 26], [78, 24.5], [82, 25.5]]);
  // hormônios do ovário pelo sangue até o endométrio (vista b)
  const HB = curva([[67, 77], [56, 64], [46, 56], [36, 51], [26, 50], [18, 55]]);

  // ---------- desenho miúdo ----------
  function dot(X, x, y, r, c, a) { if (a <= 0) return; X.globalAlpha = cl(a, 0, 1); X.beginPath(); X.arc(x, y, Math.max(.1, r), 0, TAU); X.fillStyle = c; X.fill(); X.globalAlpha = 1; }
  function brilho(X, x, y, r, c, a) { if (a <= 0) return; const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c, a)); g.addColorStop(1, rgba(c, 0)); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); }
  function txt(X, s, x, y, o = {}) { X.font = `${o.w || 600} ${o.s || 13}px ${FT}`; X.fillStyle = o.c || TXT; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  function quebra(X, s, x, y, w, lh, o = {}) {
    X.font = `${o.w || 500} ${o.s || 13}px ${FT}`; const ps = s.split(' '); let l = '', yy = y;
    ps.forEach(p => { const tt = l ? l + ' ' + p : p; if (X.measureText(tt).width > w && l) { txt(X, l, x, yy, o); l = p; yy += lh; } else l = tt; });
    if (l) txt(X, l, x, yy, o); return yy - y + lh;
  }
  // espermatozoide: cabeça oval e cauda ondulando atrás (ang é a direção do nado)
  function esperma(X, x, y, ang, s, t, a, cor) {
    if (a <= .01) return;
    X.save(); X.globalAlpha = cl(a, 0, 1); X.translate(x, y); X.rotate(ang);
    X.beginPath(); X.moveTo(-s * .9, 0);
    for (let i = 1; i <= 10; i++) { const q = i / 10; X.lineTo(-s * .9 - q * s * 4.2, Math.sin(q * 6 - t * 14) * s * .55 * q); }
    X.strokeStyle = rgba(cor || ESPC, .85); X.lineWidth = Math.max(1, s * .32); X.lineCap = 'round'; X.stroke();
    X.beginPath(); X.ellipse(0, 0, s * 1.05, s * .68, 0, 0, TAU); X.fillStyle = cor || ESPC; X.fill(); X.strokeStyle = 'rgba(11,15,28,.75)'; X.lineWidth = 1; X.stroke();
    X.restore();
  }
  // grupinho de espermatozoides em volta de um ponto do caminho; vivos de 0 a n (os outros somem)
  function cardume(X, x, y, ang, s, t, n, a, vivos) {
    const tt = RED ? 0 : t;
    for (let i = 0; i < n; i++) {
      const k = fr(Math.sin(i * 12.9898) * 43758.5453), k2 = fr(Math.sin(i * 78.233) * 12543.1);
      const al = vivos == null ? 1 : cl(vivos - i, 0, 1);
      const back = (k * 2.6 + .2) * s * 3.2, side = (k2 - .5) * s * 5.5;
      const px = x - Math.cos(ang) * back - Math.sin(ang) * side + Math.sin(tt * 3 + i) * s * .4, py = y - Math.sin(ang) * back + Math.cos(ang) * side + Math.cos(tt * 2.6 + i) * s * .4;
      esperma(X, px, py, ang + (k2 - .5) * .7 + Math.sin(tt * 4 + i * 2) * .12, s, tt + i * .37, a * al);
    }
  }
  // ovócito: coroa radiada, zona pelúcida e citoplasma; z = 1 depois da fecundação (dois pronúcleos)
  function ovocito(X, x, y, r, t, a, z) {
    if (a <= .01) return; X.save(); X.globalAlpha = cl(a, 0, 1);
    brilho(X, x, y, r * 2.6, OVOC, .35);
    const tt = RED ? 0 : t;
    for (let i = 0; i < 16; i++) { const q = i / 16 * TAU + tt * .15; dot(X, x + Math.cos(q) * r * 1.5, y + Math.sin(q) * r * 1.5, Math.max(1.2, r * .17), '#F6D9B8', .9 * a); }
    X.globalAlpha = cl(a, 0, 1);
    X.beginPath(); X.arc(x, y, r * 1.2, 0, TAU); X.strokeStyle = 'rgba(214,236,255,.85)'; X.lineWidth = Math.max(1.4, r * .18); X.stroke();
    const g = X.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r); g.addColorStop(0, '#FFF3DA'); g.addColorStop(.6, OVOC); g.addColorStop(1, '#E3A24F');
    X.beginPath(); X.arc(x, y, r, 0, TAU); X.fillStyle = g; X.fill(); X.strokeStyle = 'rgba(11,15,28,.6)'; X.lineWidth = 1; X.stroke();
    if (z) { dot(X, x - r * .3, y, r * .24, '#B5793A', a); dot(X, x + r * .3, y, r * .24, '#7A9FD0', a); }
    else dot(X, x + r * .15, y - r * .1, r * .26, '#B5793A', a);
    X.restore();
  }
  // embrião em clivagem: n células (1 a 16); n >= 32 é o blastocisto (bola oca)
  function embriao(X, x, y, r, n, a) {
    if (a <= .01) return; X.save(); X.globalAlpha = cl(a, 0, 1);
    brilho(X, x, y, r * 2.4, OVOC, .3);
    X.beginPath(); X.arc(x, y, r * 1.15, 0, TAU); X.strokeStyle = 'rgba(214,236,255,.8)'; X.lineWidth = Math.max(1.2, r * .14); X.stroke();
    if (n >= 32) {
      X.beginPath(); X.arc(x, y, r, 0, TAU); X.fillStyle = 'rgba(255,230,190,.25)'; X.fill();
      for (let i = 0; i < 14; i++) { const q = i / 14 * TAU; dot(X, x + Math.cos(q) * r * .82, y + Math.sin(q) * r * .82, r * .22, OVOC, a); }
      for (let i = 0; i < 4; i++) dot(X, x - r * .35 + (i % 2) * r * .25, y - r * .35 + (i > 1 ? r * .22 : 0), r * .2, '#F2B66A', a);
    } else {
      const pos = n <= 1 ? [[0, 0, 1]] : n === 2 ? [[-.45, 0, .55], [.45, 0, .55]] : n <= 4 ? [[-.4, -.4, .45], [.4, -.4, .45], [-.4, .4, .45], [.4, .4, .45]]
        : Array.from({ length: Math.min(n, 16) }, (_, i) => { const q = i * 2.399, d = Math.sqrt((i + .5) / Math.min(n, 16)) * .72; return [Math.cos(q) * d, Math.sin(q) * d, n > 8 ? .26 : .34]; });
      pos.forEach(p => { const gx = x + p[0] * r, gy = y + p[1] * r, rr = p[2] * r; const g = X.createRadialGradient(gx - rr * .3, gy - rr * .3, rr * .1, gx, gy, rr); g.addColorStop(0, '#FFF3DA'); g.addColorStop(1, OVOC); X.beginPath(); X.arc(gx, gy, rr, 0, TAU); X.fillStyle = g; X.fill(); X.strokeStyle = 'rgba(11,15,28,.55)'; X.lineWidth = 1; X.stroke(); });
    }
    X.restore();
  }
  function gota(X, x, y, r, c, a) {
    if (a <= .01) return; X.save(); X.globalAlpha = cl(a, 0, 1); X.translate(x, y);
    X.beginPath(); X.moveTo(0, -r * 2); X.bezierCurveTo(r * .9, -r * .7, r, r * .2, 0, r); X.bezierCurveTo(-r, r * .2, -r * .9, -r * .7, 0, -r * 2);
    X.fillStyle = c; X.fill(); X.strokeStyle = 'rgba(11,15,28,.5)'; X.lineWidth = 1; X.stroke(); X.restore();
  }
  function anelPulso(X, x, y, r0, r1, t, c, per) {
    if (RED) { X.beginPath(); X.arc(x, y, (r0 + r1) / 2, 0, TAU); X.strokeStyle = rgba(c, .7); X.lineWidth = 2; X.stroke(); return; }
    const u = fr(t / (per || 1.6)); X.beginPath(); X.arc(x, y, lerp(r0, r1, u), 0, TAU); X.strokeStyle = rgba(c, .85 * (1 - u)); X.lineWidth = 2; X.stroke();
  }
  // marca de bloqueio: barra vermelha atravessando o caminho
  function bloqueio(X, x, y, ang, s, t) {
    const p = RED ? 1 : .75 + .25 * Math.sin(t * 4);
    X.save(); X.translate(x, y); X.rotate(ang + PI / 2); X.lineCap = 'round';
    X.strokeStyle = 'rgba(11,15,28,.85)'; X.lineWidth = s * .9 + 3; X.beginPath(); X.moveTo(-s * 2.2, 0); X.lineTo(s * 2.2, 0); X.stroke();
    X.strokeStyle = rgba(ERRO, p); X.lineWidth = s * .9; X.beginPath(); X.moveTo(-s * 2.2, 0); X.lineTo(s * 2.2, 0); X.stroke();
    X.restore();
  }
  // corte cirúrgico: dois tracinhos com uma folga entre eles
  function corte(X, x, y, ang, s) {
    X.save(); X.translate(x, y); X.rotate(ang); X.lineCap = 'round';
    [-1, 1].forEach(k => { X.strokeStyle = 'rgba(11,15,28,.85)'; X.lineWidth = s * .7 + 3; X.beginPath(); X.moveTo(k * s * .9, -s * 1.6); X.lineTo(k * s * .9, s * 1.6); X.stroke(); X.strokeStyle = ERRO; X.lineWidth = s * .7; X.beginPath(); X.moveTo(k * s * .9, -s * 1.6); X.lineTo(k * s * .9, s * 1.6); X.stroke(); });
    X.restore();
  }
  // faixa do endométrio na vista b: mais grossa quanto maior en
  function endometrio(R, X, en, a) {
    [[8, 34], [17, 35], [17.5, 55], [16, 66], [13.5, 78]].forEach(p => { const q = R.pt(p[0], p[1]); brilho(X, q[0], q[1], R.u * (1.6 + en * 3.2), '#F06AAE', .34 * a); });
  }

  // ---------- botões da viagem (HTML sobre o palco) ----------
  const ICO = { ant: '<path d="M14.5 6 8.5 12l6 6"/>', prox: '<path d="m9.5 6 6 6-6 6"/>', pausa: '<path d="M9 6v12M15 6v12"/>', play: '<path d="M8 5.5v13l10-6.5z"/>' };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
  function estilo() {
    if (document.getElementById('rp-css')) return;
    const st = document.createElement('style'); st.id = 'rp-css';
    st.textContent = `.rp-nav{position:absolute;left:0;top:0;z-index:2;display:flex;align-items:center;gap:6px}
.rp-nav[hidden]{display:none}
.rp-nav button{font:inherit;width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92);color:var(--txt,#E8EDF7);cursor:pointer;transition:background-color 90ms,border-color 90ms,color 90ms}
.rp-nav button:hover{background:var(--panel-2,#1B2440);border-color:var(--amber,#FFB347)}
.rp-nav button:active{transform:scale(.96)}
.rp-nav button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.rp-nav button svg{width:22px;height:22px}
.rp-nav button[hidden]{display:none}
.rp-nav .et{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 6px;line-height:1.2}
.rp-nav .et small{font-size:12px;color:var(--dim,#9DA9C4)}
.rp-nav .et b{font-size:15px;font-weight:600;color:var(--txt,#E8EDF7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(prefers-reduced-motion:reduce){.rp-nav button{transition:none}.rp-nav button:active{transform:none}}`;
    document.head.appendChild(st);
  }

  // ---------- layout ----------
  const compacto = () => NAR || W < 1160;
  const capRes = () => NAR ? 116 : 76, faixaH = () => 142;
  const reserva = () => compacto() ? capRes() + faixaH() + 8 : 56;
  const PW = 330;   // largura do painel lateral na tela larga
  // caixa da figura: na tela larga começa depois do painel, para a figura deitada não ficar embaixo dele
  function caixa(W2, H2) {
    if (!compacto()) { const x0 = 28 + PW + 14, y0 = 60; return { x: x0, y: y0, w: W2 - x0 - 24, h: H2 - y0 - 56 }; }
    const x0 = NAR ? 6 : 24, y0 = NAR ? 46 : 60; return { x: x0, y: y0, w: W2 - 2 * x0, h: H2 - y0 - reserva() };
  }

  // ---------- medidores ----------
  // gráfico dos quatro hormônios nos 28 dias, com o cursor no dia d
  function grafico(X, x, y, w, h, d, mini) {
    const xd = q => x + (q - 1) / 27 * w;
    X.save();
    // faixas das fases
    [[1, 5.5, SANG, .16], [13.5, 14.6, AMB, .22]].forEach(([a, b, c, al]) => { X.fillStyle = rgba(c, al); X.fillRect(xd(a), y, xd(b) - xd(a), h); });
    X.fillStyle = 'rgba(255,255,255,.06)'; X.fillRect(x, y + h - 1, w, 1);
    ['fsh', 'lh', 'e', 'p'].forEach(k => {
      X.beginPath(); for (let q = 1; q <= 28.01; q += .5) { const v = hor(q)[k], px = xd(q), py = y + h - 2 - v * (h - 6); q === 1 ? X.moveTo(px, py) : X.lineTo(px, py); }
      X.strokeStyle = HC[k]; X.lineWidth = mini ? 1.6 : 2.2; X.lineJoin = 'round'; X.stroke();
    });
    const cx = xd(cl(d, 1, 28)); X.fillStyle = 'rgba(232,237,247,.75)'; X.fillRect(cx - 1, y - 2, 2, h + 4);
    const hv = hor(d); ['fsh', 'lh', 'e', 'p'].forEach(k => dot(X, cx, y + h - 2 - hv[k] * (h - 6), mini ? 3 : 4, HC[k], 1));
    if (!mini) [1, 14, 28].forEach(n => txt(X, String(n), xd(n), y + h + 10, { s: 12, c: DIM, w: 500, a: n === 1 ? 'left' : n === 28 ? 'right' : 'center' }));
    X.restore();
  }
  function linhasHorm(X, x, y, w, d) {
    const hv = hor(d), NM = { fsh: 'FSH', lh: 'LH', e: 'Estrogênio', p: 'Progesterona' };
    ['fsh', 'lh', 'e', 'p'].forEach((k, i) => {
      const ly = y + i * 24; dot(X, x + 5, ly, 4.5, HC[k], 1); txt(X, NM[k], x + 16, ly, { s: 13 });
      const bx = x + 118, bw = w - 118 - 78; X.fillStyle = 'rgba(232,237,247,.1)'; X.beginPath(); X.roundRect(bx, ly - 4, bw, 8, 4); X.fill();
      X.fillStyle = HC[k]; X.beginPath(); X.roundRect(bx, ly - 4, Math.max(8, bw * cl(hv[k], 0, 1)), 8, 4); X.fill();
      txt(X, nivel(k, hv[k]), x + w, ly, { s: 12, c: k === 'lh' && hv[k] > .8 ? AMB : DIM, a: 'right', w: k === 'lh' && hv[k] > .8 ? 700 : 500 });
    });
    const ly = y + 4 * 24 + 6, en = hv.en;
    txt(X, 'Endométrio', x, ly, { s: 13, c: '#F2A6C6' });
    const bx = x + 118, bw = w - 118 - 78; X.fillStyle = 'rgba(232,237,247,.1)'; X.beginPath(); X.roundRect(bx, ly - 5, bw, 10, 5); X.fill();
    X.fillStyle = '#C8628F'; X.beginPath(); X.roundRect(bx, ly - 5, Math.max(10, bw * en), 10, 5); X.fill();
    txt(X, d < 5.5 ? 'descamando' : d > 26 ? 'regredindo' : en < .3 ? 'fino' : en < .7 ? 'engrossando' : 'grosso', x + w, ly, { s: 12, c: DIM, a: 'right', w: 500 });
  }
  function legendaMini(X, x, y, w, d, duas) {
    const hv = hor(d), it = duas ? [['fsh', 'FSH'], ['lh', 'LH'], ['e', 'Estrogênio'], ['p', 'Progesterona']] : [['fsh', 'FSH'], ['lh', 'LH'], ['e', 'Estr.'], ['p', 'Prog.']], cols = duas ? 2 : 4, cw = w / cols;
    it.forEach(([k, n], i) => { const cx = x + (i % cols) * cw, cy = y + Math.floor(i / cols) * 20; dot(X, cx + 4, cy, 3.5, HC[k], 1); txt(X, `${n} ${nivel(k, hv[k])}`, cx + 11, cy, { s: NAR ? 11 : 12, c: TXT, w: 500 }); });
  }
  const rotN = n => n >= 5e7 ? 'centenas de milhões' : n >= 1e6 ? 'milhões' : n >= 1e3 ? 'milhares' : n >= 60 ? 'algumas centenas' : n > 1.5 ? 'dezenas' : 'um só fecunda';
  // quantos espermatozoides seguem: escala de 1 a 1 bilhão (logarítmica)
  function contagem(X, x, y, w, n, rot, comp) {
    txt(X, rot, x, y, { s: comp ? 12 : 13, c: ESPC });
    const by = y + (comp ? 14 : 18), bh = comp ? 6 : 8, k = cl(Math.log10(Math.max(1, n)) / 9, 0, 1);
    const g = X.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#24324F'); g.addColorStop(1, ESPC);
    X.fillStyle = g; X.beginPath(); X.roundRect(x, by, w, bh, bh / 2); X.fill();
    const nx = x + w * k; X.beginPath(); X.moveTo(nx, by - 2); X.lineTo(nx - 6, by - 9); X.lineTo(nx + 6, by - 9); X.closePath(); X.fillStyle = TXT; X.fill(); X.fillRect(nx - 1, by - 2, 2, bh + 4);
    if (!comp) [['1', 0, 'left'], ['mil', 3 / 9, 'center'], ['1 milhão', 6 / 9, 'center'], ['1 bilhão', 1, 'right']].forEach(q => txt(X, q[0], x + w * q[1], by + bh + 11, { s: 12, c: DIM, w: 500, a: q[2] }));
  }

  // ---------- motor de uma rota com uma ou mais viagens sobre a figura ----------
  // C: { K, nome, vistas, hs, trilhas: { modo: { rotulo, aria, ET, VAI, sobre(R, X, t, S, v), painel(X, b, t, S, v), alt } }, ordem: [modos], loc, ajustes(c3) }
  function rota(C) {
    const c3 = SC[C.K]; if (!c3) return;
    const MODOS = C.ordem, eh = m => MODOS.indexOf(m) >= 0;
    const novo = m => ({ m, e: 0, u: RED ? 1 : 0, hold: 0, pausa: false });
    let FIG = null, Sx = null, ultAb = null, vivo = 0, NAV = null, sincK = '', navK = '', em3d = false, Rfig = null;
    const tri = S => C.trilhas[S.vg.m];
    function irPara(S, e, troca) {
      const v = S.vg, T = tri(S), NE = T.ET.length; v.e = (e + NE) % NE; v.u = RED ? 1 : 0; v.hold = 0;
      if (troca && FIG) { const q = T.ET[v.e].v || 'a'; if (FIG.vistaAtual !== q) FIG.mostrar(q); }
      sinc(S);
    }
    function avancar(S, dt) {
      const v = S.vg, T = tri(S), et = T.ET[v.e];
      if (RED || v.pausa || !dt) return;
      const k = dt;
      if (v.u < 1) { v.u = Math.min(1, v.u + k / et.dur); return; }
      v.hold += k;
      if (v.hold > (v.e < T.ET.length - 1 ? 1.4 : 3)) irPara(S, v.e + 1, true);
    }
    function montarNav() {
      if (NAV) return; estilo();
      NAV = document.createElement('div'); NAV.className = 'rp-nav'; NAV.hidden = true; NAV.setAttribute('role', 'group');
      NAV.innerHTML = `<button type="button" data-a="ant" aria-label="Etapa anterior" title="Etapa anterior">${svg('ant')}</button>`
        + `<div class="et" aria-live="polite"><small></small><b></b></div>`
        + `<button type="button" data-a="pausa"${RED ? ' hidden' : ''}></button>`
        + `<button type="button" data-a="prox" aria-label="Próxima etapa" title="Próxima etapa">${svg('prox')}</button>`;
      NAV.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b || !Sx || !Sx.vg) return; const v = Sx.vg;
        if (b.dataset.a === 'ant') irPara(Sx, v.e - 1, true);
        else if (b.dataset.a === 'prox') irPara(Sx, v.e + 1, true);
        else { v.pausa = !v.pausa; sinc(Sx); }
      });
      cv.parentNode.appendChild(NAV);
      (function vigia() { if (NAV && !NAV.hidden && performance.now() - vivo > 180) NAV.hidden = true; requestAnimationFrame(vigia); })();
    }
    function sinc(S) {
      if (!NAV) return; const v = S.vg, T = tri(S), k = v.m + '|' + v.e + '|' + v.pausa; if (k === sincK) return; sincK = k;
      NAV.setAttribute('aria-label', T.aria);
      NAV.querySelector('.et small').textContent = `Etapa ${v.e + 1} de ${T.ET.length}`;
      NAV.querySelector('.et b').textContent = T.ET[v.e].nome;
      const p = NAV.querySelector('[data-a="pausa"]'), tt = v.pausa ? 'Continuar a viagem' : 'Pausar a viagem';
      p.innerHTML = svg(v.pausa ? 'play' : 'pausa'); p.title = tt; p.setAttribute('aria-label', tt);
    }
    function posNav(x, y, w) { const k = [x, y, w].map(Math.round).join(); if (k === navK) return; navK = k; NAV.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`; NAV.style.width = Math.round(w) + 'px'; }
    function garante(S) { if (!eh(S.modo)) S.modo = MODOS[0]; if (!S.vg || S.vg.m !== S.modo) { S.vg = novo(S.modo); sincK = ''; ultAb = null; if (FIG) { const q = C.trilhas[S.modo].ET[0].v || 'a'; if (FIG.vistaAtual !== q) FIG.mostrar(q); } } }

    function sobre(R, X, t, c) {
      const S = c.S; if (!S || !S.vg) return; Sx = S; vivo = performance.now();
      if (!FIG) FIG = c3.figura;
      const T = tri(S), ab = FIG && FIG.aberto ? FIG.aberto.id : null;
      if (ab !== ultAb) { ultAb = ab; if (ab && T.VAI[ab] != null && T.VAI[ab] !== S.vg.e) irPara(S, T.VAI[ab], false); }
      avancar(S, S.dt || 0);
      Rfig = R; R.u = Math.abs(R.pt(1, 0)[0] - R.pt(0, 0)[0]);   // pixels por 1% da imagem inteira (vale também nos recortes)
      const et = T.ET[S.vg.e];
      if ((et.v || 'a') === R.vista) T.sobre(R, X, t, S, S.vg, et);
    }
    function fora(X, t, c) {
      const S = c.S; if (!S || !S.vg || !Rfig) return; montarNav(); sinc(S); NAV.hidden = false;
      const T = tri(S), et = T.ET[S.vg.e];
      let bx;
      if (!compacto()) {
        const x0 = 28, w = PW, y0 = 60, h = Math.min(T.alt, H - y0 - 20);
        X.fillStyle = 'rgba(11,15,28,.72)'; X.beginPath(); X.roundRect(x0, y0, w, h, 14); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
        posNav(x0 + 10, y0 + 10, w - 20); bx = { x: x0 + 18, y: y0 + 72, w: w - 36, comp: false };
      } else {
        const x0 = NAR ? 6 : 24, w = W - 2 * x0, h = faixaH(), y0 = H - capRes() - h - 4;
        X.fillStyle = 'rgba(11,15,28,.78)'; X.beginPath(); X.roundRect(x0, y0, w, h, 12); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
        posNav(x0 + 6, y0 + 6, w - 12); bx = { x: x0 + 12, y: y0 + 66, w: w - 24, h: h - 66, comp: true };
      }
      T.painel(X, bx, t, S, S.vg, et);
      cap(et.cap);
    }

    // ---------- registro: figura padrão; os modos antigos seguem nos botões e atrás de "Ver esquema" ----------
    const d3 = c3.draw, init0 = c3.init; let chamou3 = false;
    // aciona um botão da barra pelo rótulo, para o motor atualizar qual botão fica marcado
    const clicaExtra = rot => { const i = (c3.extra || []).findIndex(x => x.t === rot), b = document.querySelector(`#extra button[data-i="${i}"]`); if (b) b.click(); };
    c3.draw = function (...a) { chamou3 = true; return d3.apply(this, a); };
    const amb = {
      SC, X: () => X, W: () => W, H: () => H, nar: () => NAR, tela: cv.parentNode,
      cap: () => { }, plano: () => { }, ao3d: () => { em3d = true; setTimeout(() => { if (Sx && C.esquema) clicaExtra(C.esquema); }, 0); },
      t: a => a[0], rot3d: 'Ver esquema', dica3d: '',
      esconder: ['.hud.onde'], esconderFig: []
    };
    LAB_FIGALT.cena(amb, C.K, { pref: 'anatomia', nome: C.nome, mask: { miolo: .86, borda: 1 }, vistas: C.vistas, hs: C.hs, manter: (W2, H2) => caixa(W2, H2), sobre, fora });
    // "Ver figura" volta para a viagem
    document.addEventListener('click', e => {
      const b = e.target.closest && e.target.closest('.fa-barra button[data-m="fig"]');
      if (!b || !Sx || SC[decodeURIComponent(location.hash.slice(1))] !== c3) return;
      if (!eh(Sx.modo)) { Sx.modo = MODOS[0]; setTimeout(() => clicaExtra(C.trilhas[MODOS[0]].rotulo), 0); }
    }, true);
    // botões das viagens, antes dos modos antigos
    const ex = c3.extra = (c3.extra || []).slice();
    MODOS.slice().reverse().forEach(m => ex.unshift({
      t: C.trilhas[m].rotulo, pressed: S => S.modo === m,
      on: S => { S.modo = m; S.vg = novo(m); sincK = ''; ultAb = null; if (em3d) { const b = document.querySelector('.fa-barra button[data-m="fig"]'); if (b) b.click(); } else if (FIG) { const q = C.trilhas[m].ET[0].v || 'a'; if (FIG.vistaAtual !== q) FIG.mostrar(q); } }
    }));
    const dFig = c3.draw, i1 = c3.init;
    c3.init = function (S) { if (init0) init0.call(this, S); i1.call(this, S); S.modo = MODOS[0]; S.vg = novo(S.modo); sincK = ''; ultAb = null; };
    c3.draw = function (t, S) {
      if (!S.modo) S.modo = MODOS[0];
      if (!eh(S.modo) && !em3d) { X.save(); try { d3.call(c3, t, S); } catch (e) { console.error(e); } X.restore(); return; }
      if (!em3d) garante(S);
      chamou3 = false; const r = dFig.call(this, t, S); em3d = chamou3; return r;
    };
    const lo = c3.loc, ln = c3.locNota;
    c3.loc = S => eh(S.modo) ? C.trilhas[S.modo].rotulo : (lo ? lo(S) : '');
    c3.locNota = S => eh(S.modo) ? 'Ilustração, fora de escala' : (typeof ln === 'function' ? ln(S) : ln);
    const cv0 = c3.ctlVis; c3.ctlVis = S => eh(S.modo) ? false : (cv0 ? cv0(S) : true);
    if (C.ajustes) C.ajustes(c3);
  }

  // =====================================================================================
  // Pontos da figura (as duas rotas usam a mesma imagem -v4a)
  // =====================================================================================
  const VISTAS = [
    ['a', 'reprodutor-ciclo-v4a', 'Masculino', 'Sistema genital masculino em corte, de lado: testículo, epidídimo, ducto deferente, vesícula seminal, próstata e uretra', [.06, .12, .40, .74]],
    ['f', 'reprodutor-ciclo-v4a', 'Feminino', 'Sistema genital feminino em corte, de frente: ovários, tubas uterinas, útero com endométrio, colo e vagina', [.52, .22, .46, .62]]
  ];
  const HSM = [
    { id: 'tes', c: ESPC, t: 'Testículo e túbulos seminíferos', d: 'Nos túbulos seminíferos, a meiose forma os espermatozoides o tempo todo, a partir da puberdade. Entre os túbulos, as células de Leydig produzem testosterona.', em: { a: [32.5, 72] }, z: 3 },
    { id: 'epi', c: '#F2B6C6', t: 'Epidídimo', d: 'Tubo enovelado sobre o testículo. Os espermatozoides amadurecem ali, ganham movimento e ficam guardados até a ejaculação.', em: { a: [31, 65.4] }, z: 3.2 },
    { id: 'def', c: AMB, t: 'Ducto deferente', d: 'Leva os espermatozoides do epidídimo até a próstata, contornando a bexiga. Na vasectomia, ele é cortado.', em: { a: [35.7, 44] }, z: 3 },
    { id: 'ves', c: '#E9D98A', t: 'Vesícula seminal', d: 'Fica atrás da bexiga. Produz a maior parte do líquido do sêmen, rico em frutose, a fonte de energia dos espermatozoides.', em: { a: [18.6, 38] }, z: 3.2 },
    { id: 'pro', c: '#F2A65A', t: 'Próstata', d: 'Glândula logo abaixo da bexiga, em volta da uretra. Produz um líquido alcalino que ajuda os espermatozoides a resistir à acidez da vagina.', em: { a: [22.8, 45.5] }, z: 3.2 },
    { id: 'bex', c: '#8FD8FF', t: 'Bexiga urinária', d: 'Guarda a urina. A uretra sai dela e leva urina ou sêmen, nunca os dois juntos.', em: { a: [26.5, 35] }, z: 2.8 },
    { id: 'ure', c: '#CFE0FF', t: 'Uretra e pênis', d: 'A uretra atravessa a próstata e o pênis e leva o sêmen para fora na ejaculação.', em: { a: [39.6, 66] }, z: 3 }
  ];
  const HSF = [
    { id: 'ova', c: '#F2B6C6', t: 'Ovário', d: 'Guarda os folículos, cada um com um ovócito. Libera o ovócito na ovulação e produz estrogênio e progesterona.', em: { f: [88.5, 40.5] }, z: 3 },
    { id: 'tub', c: AMB, t: 'Tuba uterina', d: 'Recolhe o ovócito com as fímbrias e o leva ao útero. A fecundação costuma ocorrer aqui, na parte mais larga, a ampola.', em: { f: [90.5, 30.8] }, z: 3 },
    { id: 'ute', c: '#F28B8B', t: 'Útero e endométrio', d: 'Órgão muscular. A camada de dentro, o endométrio, engrossa a cada ciclo e é onde o embrião se implanta.', em: { f: [75, 45] }, z: 2.8 },
    { id: 'col', c: '#CFE0FF', t: 'Colo do útero', d: 'Parte estreita do útero que se abre na vagina. O muco do colo fica mais fino perto da ovulação.', em: { f: [75, 57] }, z: 3 },
    { id: 'vag', c: '#F2B6C6', t: 'Vagina', d: 'Canal que liga o colo do útero ao exterior. Recebe o sêmen e é o canal do parto. O meio ácido elimina muitos espermatozoides.', em: { f: [75, 71] }, z: 2.8 }
  ];
  const HSB = [
    { id: 'fol', c: '#F2B6C6', t: 'Folículos em crescimento', d: 'Na fase folicular, o FSH faz vários folículos crescerem. Em geral só um amadurece por ciclo.', em: { b: [72, 60] }, z: 2.4 },
    { id: 'fma', c: AMB, t: 'Folículo maduro e ovulação', d: 'O folículo maduro tem uma cavidade com líquido. O pico de LH faz ele se romper e soltar o ovócito secundário por volta do dia 14.', em: { b: [78, 73] }, z: 2.4 },
    { id: 'clu', c: '#F2D04A', t: 'Corpo lúteo', d: 'O folículo rompido vira o corpo lúteo, que produz progesterona e estrogênio. Sem gravidez, ele regride em cerca de 12 dias.', em: { b: [67, 77] }, z: 2.4 },
    { id: 'fim', c: '#F2B6C6', t: 'Fímbrias', d: 'Franjas na ponta da tuba que se movem sobre o ovário e recolhem o ovócito liberado.', em: { b: [89.5, 70] }, z: 2.4 },
    { id: 'amp', c: OVOC, t: 'Ampola: fecundação', d: 'Na parte mais larga da tuba, um espermatozoide entra no ovócito. Os núcleos se unem e forma-se o zigoto, com 2n cromossomos.', em: { b: [85.5, 27] }, z: 2.6 },
    { id: 'cli', c: '#FFD9A8', t: 'Clivagem na tuba', d: 'O zigoto se divide em 2, 4, 8 células enquanto desce pela tuba, empurrado por cílios e contrações. Vira mórula e depois blastocisto.', em: { b: [58, 34] }, z: 2.6 },
    { id: 'nid', c: '#F06AAE', t: 'Nidação', d: 'Cerca de 6 a 7 dias depois da fecundação, o blastocisto se implanta no endométrio e passa a produzir hCG, o hormônio dos testes de gravidez.', em: { b: [14, 56] }, z: 2.6 },
    { id: 'end', c: '#F06AAE', t: 'Endométrio', d: 'Camada interna do útero. O estrogênio a reconstrói e a progesterona a deixa grossa e cheia de vasos. Quando a progesterona cai, ela descama: é a menstruação.', em: { b: [15.5, 72] }, z: 2.2 }
  ];

  // =====================================================================================
  // 1. reprodutor/ciclo: viagem dos gametas e ciclo em etapas
  // =====================================================================================
  (function () {
    const GAM = [
      { id: 'tes', nome: 'Túbulos seminíferos', v: 'a', dur: 5, n: 1e8, nt: 'Milhões formados por dia',
        cap: 'Nos <b>túbulos seminíferos</b> do testículo, a meiose forma os <b>espermatozoides</b> (n). O FSH e a testosterona, estimulada pelo LH, comandam a produção.' },
      { id: 'epi', nome: 'Epidídimo', v: 'a', dur: 4, n: 1e8, nt: 'Milhões guardados',
        cap: 'No <b>epidídimo</b>, os espermatozoides amadurecem e ganham a capacidade de nadar. Ficam guardados ali até a ejaculação.' },
      { id: 'def', nome: 'Ducto deferente', v: 'a', dur: 6, n: 2.5e8, nt: 'Centenas de milhões',
        cap: 'O <b>ducto deferente</b> sobe do escroto, contorna a bexiga e leva os espermatozoides até a próstata. É o ducto cortado na vasectomia.' },
      { id: 'ves', nome: 'Vesícula e próstata', v: 'a', dur: 5, n: 2.5e8, nt: 'Centenas de milhões',
        cap: 'A <b>vesícula seminal</b> junta um líquido com frutose, a energia dos espermatozoides, e a <b>próstata</b>, um líquido alcalino. Juntos com os espermatozoides, formam o <b>sêmen</b>.' },
      { id: 'ure', nome: 'Uretra', v: 'a', dur: 5, n: 2.5e8, nt: 'Cerca de 200 a 300 milhões',
        cap: 'Na ejaculação, o sêmen sai pela <b>uretra</b>, que passa pela próstata e pelo pênis: são centenas de milhões de espermatozoides de uma vez.' },
      { id: 'vag', nome: 'Vagina, útero e tuba', v: 'f', dur: 7, n: [2.5e8, 300], nt: 'Só algumas centenas chegam à tuba', d: [14, 14],
        cap: 'Na <b>vagina</b>, o meio ácido elimina muitos espermatozoides. Os que passam pelo colo e pelo útero chegam às <b>tubas uterinas</b>: só algumas centenas.' },
      { id: 'ovu', nome: 'Ovulação', v: 'b', dur: 5, n: 300, nt: 'Algumas centenas na tuba', d: [13.6, 14.2],
        cap: 'Por volta do <b>dia 14</b>, o <b>pico de LH</b> rompe o folículo maduro e o <b>ovócito</b> sai do ovário. É a <b>ovulação</b>.' },
      { id: 'fim', nome: 'Captura pela tuba', v: 'b', dur: 6, n: 300, nt: 'Algumas centenas na tuba', d: [14.2, 14.6],
        cap: 'As <b>fímbrias</b> da tuba recolhem o ovócito, que segue até a <b>ampola</b>, a parte mais larga da tuba. Ele sobrevive cerca de 24 horas.' },
      { id: 'fec', nome: 'Fecundação', v: 'b', dur: 7, n: [300, 1], nt: 'Só um espermatozoide fecunda', d: [14.6, 15],
        cap: 'Na <b>ampola</b> da tuba uterina, um espermatozoide entra no ovócito e os núcleos se unem: forma-se o <b>zigoto</b>, com 2n cromossomos. A membrana muda e barra os outros.' },
      { id: 'cli', nome: 'Clivagem', v: 'b', dur: 7, n: 1, nt: 'Um embrião', d: [15, 19.5],
        cap: 'O zigoto se divide em 2, 4, 8 células enquanto desce pela tuba e chega ao útero em cerca de 4 a 5 dias, como mórula e depois <b>blastocisto</b>.' },
      { id: 'nid', nome: 'Nidação', v: 'b', dur: 6, n: 1, nt: 'Um embrião', d: [19.5, 21],
        cap: 'Por volta do <b>dia 20 a 21</b> do ciclo, o blastocisto se implanta no <b>endométrio</b>: é a <b>nidação</b>. Ele produz <b>hCG</b>, que mantém o corpo lúteo e a progesterona.' }
    ];
    // trechos do caminho masculino por etapa (pontos de MC)
    const TM = { tes: [0, 1], epi: [1, 5], def: [5, 18], ves: [18, 20], ure: [20, 29] };
    const VAIG = { tes: 0, epi: 1, def: 2, ves: 3, pro: 3, bex: 3, ure: 4, vag: 5, col: 5, ute: 5, tub: 8, ova: 6, fol: 6, fma: 6, clu: 6, fim: 7, amp: 8, cli: 9, nid: 10, end: 10 };
    const dia = (et, v) => et.d ? lerp(et.d[0], et.d[1], RED ? .5 : v.u) : null;
    const quantos = (et, v) => Array.isArray(et.n) ? Math.pow(10, lerp(Math.log10(et.n[0]), Math.log10(et.n[1]), RED ? 1 : sst(.1, .9, v.u))) : et.n;
    function sobreGam(R, X, t, S, v, et) {
      const uu = RED ? .6 : eIO(v.u), s = cl(R.u * .42, 3, 6), tt = RED ? 0 : t;
      if (et.v === 'a') {
        const [i0, i1] = TM[et.id], f0 = MC.FI(0), f = trecho(MC, i0, i1, uu);
        rastro(R, X, MC, f0, f, rgba(ESPC, .55));
        let [x, y, ang] = P(R, MC, f);
        if (et.id === 'tes') {   // os espermatozoides se formam e giram dentro do testículo antes de sair
          const c = R.pt(32.4, 72.5), rr = R.u * 3.2;
          brilho(X, c[0], c[1], rr * 1.6, ESPC, .25);
          for (let i = 0; i < 7; i++) { const q = i / 7 * TAU + tt * .8, k = sst(i / 9, i / 9 + .3, RED ? 1 : v.u); const px = c[0] + Math.cos(q) * rr * .7, py = c[1] + Math.sin(q) * rr * .7; esperma(X, px, py, q + PI / 2, s * .85, tt + i, k); }
          return;
        }
        if (et.id === 'ves' || et.id === 'ure') {   // líquidos da vesícula seminal e da próstata entram no caminho
          [[[18.6, 38], [21.2, 41.5]], [[22.4, 45], [23.6, 46.2]]].forEach(([a, b], k) => {
            const A = R.pt(a[0], a[1]), B = R.pt(b[0], b[1]);
            for (let i = 0; i < 3; i++) { const u = RED ? (i + .5) / 3 : fr(tt * .6 + i / 3 + k * .2); dot(X, lerp(A[0], B[0], u), lerp(A[1], B[1], u), Math.max(2, R.u * .3), SEMC, Math.sin(PI * u) * (et.id === 'ves' ? .95 : .5)); }
          });
        }
        if (et.id === 'ves' || et.id === 'ure') for (let i = 0; i < 6; i++) { const q = P(R, MC, Math.max(f0, f - (i + 1) * .012)); dot(X, q[0], q[1], Math.max(1.8, R.u * .28), SEMC, .55 - i * .07); }
        cardume(X, x, y, ang, s, t, 6, 1);
        if (et.id === 'def' && !RED) { X.beginPath(); X.arc(x, y, s * 4.5, 0, TAU); X.strokeStyle = rgba(AMB, .35 + .2 * Math.sin(t * 4)); X.lineWidth = 1.5; X.stroke(); }
        return;
      }
      if (et.v === 'f') {
        const f = uu; rastro(R, X, FS, 0, f, rgba(ESPC, .55));
        const [x, y, ang] = P(R, FS, f);
        cardume(X, x, y, ang, s, t, 9, 1, lerp(9, 2.2, RED ? .6 : v.u));
        // os que ficam pelo caminho somem aos poucos
        for (let i = 0; i < 6; i++) { const fi = f * (i + .5) / 6, q = P(R, FS, fi); esperma(X, q[0] + Math.sin(i * 3) * s * 2, q[1], q[2] + .8 * Math.sin(i), s * .8, tt + i, .35 * (1 - f)); }
        return;
      }
      // vista b: ovário e tuba de perto
      const ovR = cl(R.u * 1.5, 6, 16);
      if (et.id === 'ovu') {
        const fl = R.pt(78, 74); anelPulso(X, fl[0], fl[1], R.u * 2, R.u * 6, t, AMB, 1.2);
        const f = trecho(OB, 0, 1, uu), [x, y] = P(R, OB, f); ovocito(X, x, y, ovR, t, 1, false);
        return;
      }
      if (et.id === 'fim') {
        const f0 = OB.FI(1), f = trecho(OB, 1, 8, uu); rastro(R, X, OB, f0, f, rgba(OVOC, .6));
        const fm = R.pt(89.5, 70); brilho(X, fm[0], fm[1], R.u * 7, '#F2B6C6', .22 * (1 - uu) + .05);
        const [x, y] = P(R, OB, f); ovocito(X, x, y, ovR, t, 1, false);
        cardume(X, ...P(R, SB, .55 + .1 * Math.sin(tt * .7)), s, t, 5, .9);
        return;
      }
      const am = P(R, ZB, 0);
      if (et.id === 'fec') {
        const k = RED ? .8 : v.u, z = k > .62;
        // vários chegam; um entra; os outros param na membrana e somem
        for (let i = 0; i < 7; i++) {
          const q = i / 7 * TAU + .4, chega = sst(0, .45, k), rr = ovR * lerp(5, 1.7, chega), px = am[0] + Math.cos(q) * rr, py = am[1] + Math.sin(q) * rr;
          esperma(X, px, py, q + PI, s, (RED ? 0 : t) + i, i === 0 ? 0 : 1 - sst(.62, .9, k));
        }
        if (!z) { const e = sst(.45, .62, k), q0 = .4, rr = ovR * lerp(1.7, .2, e); esperma(X, am[0] + Math.cos(q0) * rr, am[1] + Math.sin(q0) * rr, q0 + PI, s, t, 1 - e * .8); }
        ovocito(X, am[0], am[1], ovR, t, 1, z);
        if (z && !RED) { const u = sst(.62, .85, k); X.beginPath(); X.arc(am[0], am[1], ovR * (1.3 + u * 1.6), 0, TAU); X.strokeStyle = rgba('#FFFFFF', .7 * (1 - u)); X.lineWidth = 2; X.stroke(); }
        return;
      }
      if (et.id === 'cli') {
        const f = trecho(ZB, 0, 10, uu); rastro(R, X, ZB, 0, f, rgba(OVOC, .6));
        const [x, y] = P(R, ZB, f), n = Math.pow(2, Math.min(4, Math.floor((RED ? .6 : v.u) * 5)));
        embriao(X, x, y, ovR * .95, n, 1);
        return;
      }
      if (et.id === 'nid') {
        const f = trecho(ZB, 10, 13, Math.min(1, uu * 1.4)); rastro(R, X, ZB, 0, f, rgba(OVOC, .6));
        endometrio(R, X, .9, 1);
        const [x, y] = P(R, ZB, f), afunda = sst(.7, 1, RED ? 1 : v.u);
        embriao(X, x + afunda * R.u * .6, y + afunda * R.u * .5, ovR * .95, 32, 1 - afunda * .25);
        if (afunda > .2) for (let i = 0; i < 6; i++) { const u = RED ? (i + .5) / 6 : fr(tt * .35 + i / 6), q = i * 1.05; dot(X, x + Math.cos(q) * R.u * (1.5 + u * 6), y + Math.sin(q) * R.u * (1.5 + u * 6), Math.max(1.8, R.u * .32), '#C79BF2', (1 - u) * afunda); }
      }
    }
    function painelGam(X, b, t, S, v, et) {
      const n = quantos(et, v), d = dia(et, v);
      if (!b.comp) {
        contagem(X, b.x, b.y, b.w, n, `Espermatozoides: ${rotN(n)}`, false);
        X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(b.x, b.y + 50, b.w, 1);
        if (d == null) {
          txt(X, 'Hormônios no homem', b.x, b.y + 72, { s: 14 });
          quebra(X, 'A hipófise libera FSH e LH. O LH faz o testículo produzir testosterona; o FSH e a testosterona mantêm a produção de espermatozoides, contínua desde a puberdade.', b.x, b.y + 96, b.w, 19, { s: 13, c: DIM });
        } else {
          txt(X, `Dia ${Math.round(d)} do ciclo`, b.x, b.y + 72, { s: 15 }); txt(X, fase(d), b.x + b.w, b.y + 72, { s: 12, c: DIM, a: 'right', w: 500 });
          grafico(X, b.x, b.y + 88, b.w, 70, d, false);
          legendaMini(X, b.x, b.y + 182, b.w, d, true);
        }
      } else {
        if (d == null) contagem(X, b.x, b.y + 4, b.w, n, `Espermatozoides: ${rotN(n)}`, true);
        else {
          txt(X, `Dia ${Math.round(d)}`, b.x, b.y + 4, { s: 12 }); txt(X, `Espermatozoides: ${rotN(n)}`, b.x + b.w, b.y + 4, { s: 12, c: ESPC, a: 'right', w: 500 });
          grafico(X, b.x, b.y + 16, b.w, 22, d, true);
          legendaMini(X, b.x, b.y + 50, b.w, d, true);
        }
      }
    }
    const CIC = [
      { id: 'men', nome: 'Menstruação', v: 'f', dur: 7, d: [1, 5.4],
        cap: '<b>Dias 1 a 5</b>: sem gravidez, a progesterona caiu e o <b>endométrio descama</b>, saindo como menstruação. O FSH começa a subir.' },
      { id: 'fol', nome: 'Fase folicular', v: 'b', dur: 8, d: [5.6, 13.4],
        cap: '<b>Fase folicular</b>: o <b>FSH</b> faz os folículos crescerem. O folículo maduro produz <b>estrogênio</b>, que reconstrói o endométrio.' },
      { id: 'ovu', nome: 'Ovulação (dia 14)', v: 'b', dur: 6, d: [13.5, 14.5],
        cap: '<b>Por volta do dia 14</b>, o estrogênio alto provoca o <b>pico de LH</b> (e um pico menor de FSH). O folículo se rompe e libera o ovócito.' },
      { id: 'lut', nome: 'Fase lútea', v: 'b', dur: 9, d: [14.6, 25.8],
        cap: '<b>Fase lútea</b>: o folículo rompido vira o <b>corpo lúteo</b>, que produz <b>progesterona</b>. O endométrio fica grosso e cheio de vasos, pronto para a nidação.' },
      { id: 'fimc', nome: 'Fim do ciclo', v: 'f', dur: 6, d: [26, 28],
        cap: 'Sem fecundação, o corpo lúteo regride, a <b>progesterona cai</b> e o endométrio volta a descamar: começa um novo ciclo. Na gravidez, o hCG mantém o corpo lúteo e não há menstruação.' }
    ];
    const VAIC = { ute: 0, vag: 0, col: 0, fol: 1, ova: 1, fma: 2, fim: 2, clu: 3, end: 3 };
    const diaC = (et, v) => lerp(et.d[0], et.d[1], RED ? .5 : v.u);
    function sobreCic(R, X, t, S, v, et) {
      const d = diaC(et, v), hv = hor(d), tt = RED ? 0 : t, s = R.u;
      if (et.v === 'f') {
        const desc = et.id === 'men' ? 1 - sst(.75, 1, RED ? .3 : v.u) : sst(.3, 1, RED ? .7 : v.u);
        const cu = R.pt(75, 44); brilho(X, cu[0], cu[1], s * 7, SANG, .42 * desc);
        // gotas do endométrio que descama descem pelo colo e pela vagina
        const A = R.pt(75, 46), B = R.pt(75, 80);
        for (let i = 0; i < 6; i++) { const u = RED ? (i + .5) / 6 : fr(tt * .25 + i / 6); gota(X, lerp(A[0], B[0], u) + Math.sin(i * 2.3) * s * .9, lerp(A[1], B[1], u), Math.max(2.4, s * .5), SANG, Math.sin(PI * u) * desc); }
        if (et.id === 'fimc') { const o = R.pt(88.6, 42); brilho(X, o[0], o[1], s * 3.6, '#F2D04A', .55 * (1 - sst(0, .8, RED ? .5 : v.u))); }
        return;
      }
      endometrio(R, X, hv.en, 1);
      const fl = R.pt(78, 74), cl0 = R.pt(67, 77);
      if (et.id === 'fol') {
        const k = RED ? .6 : v.u; X.save(); X.setLineDash([4, 4]); X.beginPath(); X.arc(fl[0], fl[1], s * lerp(1.2, 4.6, k), 0, TAU); X.strokeStyle = rgba(AMB, .9); X.lineWidth = 2; X.stroke(); X.restore();
        brilho(X, fl[0], fl[1], s * 6, HC.e, .25 * k);
        for (let i = 0; i < 6; i++) { const u = RED ? (i + .5) / 6 : fr(tt * .22 + i / 6), q = P(R, HB, u); dot(X, q[0] + (fl[0] - cl0[0]) * (1 - u), q[1] + (fl[1] - cl0[1]) * (1 - u), Math.max(2, s * .4), HC.e, Math.sin(PI * u) * (.4 + .6 * k)); }
      } else if (et.id === 'ovu') {
        anelPulso(X, fl[0], fl[1], s * 2, s * 6, t, HC.lh, 1.1);
        const f = trecho(OB, 0, 3, RED ? .6 : eIO(v.u)), [x, y] = P(R, OB, f); ovocito(X, x, y, cl(s * 1.5, 6, 16), t, 1, false);
      } else if (et.id === 'lut') {
        const k = RED ? .6 : v.u; brilho(X, cl0[0], cl0[1], s * 6.5, '#F2D04A', .45 * (1 - .35 * sst(.75, 1, k)));
        for (let i = 0; i < 7; i++) { const u = RED ? (i + .5) / 7 : fr(tt * .22 + i / 7), q = P(R, HB, u); dot(X, q[0], q[1], Math.max(2, s * .4), HC.p, Math.sin(PI * u) * .95); }
      }
    }
    function painelCic(X, b, t, S, v, et) {
      const d = diaC(et, v);
      if (!b.comp) {
        txt(X, `Dia ${Math.round(d)} de 28`, b.x, b.y, { s: 16 }); txt(X, fase(d), b.x + b.w, b.y, { s: 12, c: DIM, a: 'right', w: 500 });
        grafico(X, b.x, b.y + 16, b.w, 84, d, false);
        linhasHorm(X, b.x, b.y + 134, b.w, d);
      } else {
        txt(X, `Dia ${Math.round(d)}`, b.x, b.y + 4, { s: 12 }); txt(X, fase(d), b.x + b.w, b.y + 4, { s: 12, c: DIM, a: 'right', w: 500 });
        grafico(X, b.x, b.y + 16, b.w, 22, d, true);
        legendaMini(X, b.x, b.y + 50, b.w, d, true);
      }
    }
    rota({
      K: 'reprodutor/ciclo', nome: 'Sistemas genitais, gametas e ciclo menstrual',
      vistas: VISTAS.concat([['b', 'reprodutor-ciclo-v4b', 'Ovário e tuba', 'Ovário com folículos e corpo lúteo, tuba com a fecundação na ampola e a clivagem, e o útero com o endométrio onde ocorre a nidação']]),
      hs: HSM.concat(HSF, HSB),
      ordem: ['gam', 'cic'], esquema: 'Sistemas genitais',
      trilhas: {
        gam: { rotulo: 'Viagem dos gametas', aria: 'Viagem dos gametas: etapas', ET: GAM, VAI: VAIG, sobre: sobreGam, painel: painelGam, alt: 340 },
        cic: { rotulo: 'Ciclo em etapas', aria: 'Ciclo menstrual: etapas', ET: CIC, VAI: VAIC, sobre: sobreCic, painel: painelCic, alt: 356 }
      },
      ajustes(c3) {
        if (typeof c3.d === 'string') c3.d = c3.d.replace('<p>Mova o controle de dia no calendário', '<p>Em "Viagem dos gametas" e "Ciclo em etapas", siga as etapas sobre a figura e toque nos pontos para ver cada estrutura. No "Calendário do ciclo", mova o controle de dia');
      }
    });
  })();

  // =====================================================================================
  // 2. reprodutor/prevencao: onde cada método age
  // =====================================================================================
  (function () {
    const MET = [
      { id: 'vas', nome: 'Vasectomia', v: 'a', dur: 7, onde: 'Ducto deferente', tipo: 'Cirúrgico', ist: false, ac: 'Os espermatozoides não saem',
        cap: 'Na <b>vasectomia</b>, os <b>ductos deferentes</b> são cortados. O sêmen continua saindo, só que sem espermatozoides. <b>Não protege contra ISTs</b>.' },
      { id: 'cam', nome: 'Camisinha masculina', v: 'a', dur: 7, onde: 'Pênis', tipo: 'Barreira', ist: true, ac: 'Retém o sêmen',
        cap: 'A <b>camisinha masculina</b> cobre o pênis e retém o sêmen. Com a feminina, é o único método que também <b>protege contra ISTs</b>, como HIV e sífilis.' },
      { id: 'caf', nome: 'Camisinha feminina', v: 'f', dur: 7, onde: 'Vagina', tipo: 'Barreira', ist: true, ac: 'Os espermatozoides não chegam ao colo',
        cap: 'A <b>camisinha feminina</b> reveste a vagina e impede a passagem dos espermatozoides para o colo do útero. Também <b>protege contra ISTs</b>.' },
      { id: 'diu', nome: 'DIU', v: 'f', dur: 7, onde: 'Útero', tipo: 'Intrauterino', ist: false, ac: 'Prejudica os espermatozoides',
        cap: 'O <b>DIU</b> fica dentro do <b>útero</b>. O de cobre prejudica os espermatozoides; o hormonal age no endométrio e no muco do colo. <b>Não protege contra ISTs</b>.' },
      { id: 'laq', nome: 'Laqueadura', v: 'f', dur: 7, onde: 'Tubas uterinas', tipo: 'Cirúrgico', ist: false, ac: 'Ovócito e espermatozoides não se encontram',
        cap: 'Na <b>laqueadura</b>, as <b>tubas uterinas</b> são cortadas ou fechadas: o ovócito e os espermatozoides não se encontram. <b>Não protege contra ISTs</b>.' },
      { id: 'pil', nome: 'Pílula', v: 'f', dur: 7, onde: 'Ovário (via hipófise)', tipo: 'Hormonal', ist: false, ac: 'Não há ovulação',
        cap: 'A <b>pílula</b> tem hormônios que freiam o FSH e o LH da hipófise: o folículo não amadurece e <b>não há ovulação</b>. <b>Não protege contra ISTs</b>.' }
    ];
    const HSP = [
      { id: 'def', c: ERRO, t: 'Ducto deferente: vasectomia', d: 'Na vasectomia, os ductos deferentes são cortados. O sêmen deixa de levar espermatozoides, mas a ejaculação continua. Não protege contra ISTs.', em: { a: [34.6, 51] }, z: 3 },
      { id: 'pen', c: OK, t: 'Pênis: camisinha masculina', d: 'A camisinha masculina cobre o pênis e retém o sêmen. Com a feminina, é o único tipo de método que também previne ISTs.', em: { a: [39.8, 72] }, z: 3 },
      { id: 'vag', c: OK, t: 'Vagina: camisinha feminina', d: 'A camisinha feminina reveste a vagina, com um anel interno junto ao colo e outro externo. Impede a passagem dos espermatozoides e protege contra ISTs.', em: { f: [75, 70] }, z: 2.8 },
      { id: 'ute', c: '#C9843B', t: 'Útero: DIU', d: 'O DIU, colocado dentro do útero, dificulta a passagem e a sobrevivência dos espermatozoides. O DIU hormonal também afina o endométrio.', em: { f: [75, 44] }, z: 2.8 },
      { id: 'tub', c: ERRO, t: 'Tuba uterina: laqueadura', d: 'Na laqueadura, as tubas são cortadas ou fechadas. O ovócito e os espermatozoides não se encontram.', em: { f: [85, 32.8] }, z: 3 },
      { id: 'ova', c: '#F2B6C6', t: 'Ovário: pílula', d: 'Pílula, injeção, adesivo, anel e implante freiam o FSH e o LH. Sem o pico de LH, não há ovulação e não há ovócito para fecundar.', em: { f: [91.6, 39.6] }, z: 3 },
      { id: 'ves', c: SEMC, t: 'Vesícula seminal e próstata', d: 'Depois da vasectomia, estas glândulas continuam produzindo o líquido do sêmen. Por isso a ejaculação não muda, só não tem espermatozoides.', em: { a: [20, 41] }, z: 3 }
    ];
    const VAIP = { def: 0, ves: 0, pen: 1, vag: 2, ute: 3, tub: 4, ova: 5 };
    // o grupinho anda em ciclos até o ponto de bloqueio e para ali
    function fluxo(R, X, C, f0, fB, fEnd, t, s, cor, n) {
      const tt = RED ? 0 : t;
      for (let i = 0; i < n; i++) {
        const u = RED ? (i + .5) / n : fr(tt * .16 + i / n), f = lerp(f0, fEnd, u);
        if (f > fB) { const q = P(R, C, fB), k = (f - fB) / ((fEnd - fB) || 1); esperma(X, q[0] - Math.cos(q[2]) * s * (1 + i % 3) * 1.4 + Math.sin(i * 2) * s, q[1] - Math.sin(q[2]) * s * (1 + i % 3) * 1.4 + Math.cos(i * 3) * s, q[2] + Math.sin(i) * .9, s, tt + i, .9 * (1 - k)); }
        else { const q = P(R, C, f); esperma(X, q[0], q[1], q[2], s, tt + i, cor ? .95 : .95); }
      }
    }
    function sobreP(R, X, t, S, v, et) {
      const s = cl(R.u * .42, 3, 6), tt = RED ? 0 : t;
      if (et.id === 'vas') {
        const f0 = MC.FI(5), fB = MC.FI(8) - .015, fEnd = MC.FI(29);
        rastro(R, X, MC, f0, fB, rgba(ESPC, .55)); rastro(R, X, MC, MC.FI(18), fEnd, rgba(SEMC, .45));
        fluxo(R, X, MC, f0, fB, MC.FI(10), t, s, true, 6);
        // o líquido da vesícula e da próstata continua saindo, sem espermatozoides
        for (let i = 0; i < 8; i++) { const u = RED ? (i + .5) / 8 : fr(tt * .18 + i / 8), q = P(R, MC, lerp(MC.FI(18), fEnd, u)); dot(X, q[0], q[1], Math.max(2, R.u * .28), SEMC, Math.sin(PI * u) * .9); }
        const c = P(R, MC, MC.FI(8)); corte(X, c[0], c[1], c[2], cl(R.u * .5, 3, 6));
        return;
      }
      if (et.id === 'cam') {
        const f0 = MC.FI(20), fEnd = MC.FI(29);
        rastro(R, X, MC, f0, fEnd, rgba(ESPC, .5));
        // a camisinha: capa translúcida sobre o pênis, com o reservatório na ponta
        const Q = [[38.3, 62], [38.1, 70], [38.3, 78.5], [39.2, 81.2], [40, 82.6], [40.8, 81.2], [41.8, 78.5], [42, 70], [41.8, 62]].map(p => R.pt(p[0], p[1]));
        X.save(); X.beginPath(); Q.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.fillStyle = 'rgba(160,230,190,.16)'; X.fill(); X.strokeStyle = rgba(OK, .9); X.lineWidth = 2; X.lineJoin = 'round'; X.stroke(); X.restore();
        const tip = R.pt(40, 81.4);
        for (let i = 0; i < 7; i++) { const u = RED ? (i + .5) / 7 : fr(tt * .16 + i / 7), f = lerp(f0, fEnd, Math.min(1, u * 1.15)), q = P(R, MC, f); const pr = u * 1.15 >= 1; esperma(X, pr ? tip[0] + Math.sin(i * 2.1) * s * 1.6 : q[0], pr ? tip[1] - s * (i % 3) * .8 : q[1], pr ? PI / 2 + Math.sin(i) : q[2], s, tt + i, .95); }
        return;
      }
      if (et.id === 'caf') {
        const Q = [[72.9, 61], [73.2, 70], [73.1, 80.5], [76.9, 80.5], [76.8, 70], [77.1, 61]].map(p => R.pt(p[0], p[1]));
        X.save(); X.beginPath(); Q.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.fillStyle = 'rgba(160,230,190,.14)'; X.fill(); X.strokeStyle = rgba(OK, .9); X.lineWidth = 2; X.lineJoin = 'round'; X.stroke();
        const a1 = R.pt(75, 61.4), a2 = R.pt(75, 81); X.beginPath(); X.ellipse(a1[0], a1[1], Math.abs(Q[5][0] - Q[0][0]) / 2, R.u * .7, 0, 0, TAU); X.stroke(); X.beginPath(); X.ellipse(a2[0], a2[1], Math.abs(Q[3][0] - Q[2][0]) / 2 + R.u * .6, R.u * .8, 0, 0, TAU); X.stroke(); X.restore();
        fluxo(R, X, FS, 0, FS.FI(2) + .02, FS.FI(4), t, s, true, 7);
        return;
      }
      if (et.id === 'diu') {
        rastro(R, X, FS, 0, FS.FI(5), rgba(ESPC, .5));
        const T1 = R.pt(75, 40), T2 = R.pt(75, 51.5), Ae = R.pt(72.6, 39.2), Ad = R.pt(77.4, 39.2);
        X.save(); X.lineCap = 'round'; X.strokeStyle = 'rgba(11,15,28,.8)'; X.lineWidth = R.u * .45 + 3;
        [[T1, T2], [Ae, Ad]].forEach(([a, b]) => { X.beginPath(); X.moveTo(a[0], a[1]); X.lineTo(b[0], b[1]); X.stroke(); });
        X.strokeStyle = '#E0B070'; X.lineWidth = R.u * .45; [[T1, T2], [Ae, Ad]].forEach(([a, b]) => { X.beginPath(); X.moveTo(a[0], a[1]); X.lineTo(b[0], b[1]); X.stroke(); });
        X.strokeStyle = '#C9843B'; X.lineWidth = 1.4; for (let i = 0; i < 6; i++) { const y = lerp(T1[1] + R.u * 1.2, T2[1] - R.u * .6, i / 5); X.beginPath(); X.moveTo(T1[0] - R.u * .4, y); X.lineTo(T1[0] + R.u * .4, y + R.u * .18); X.stroke(); }
        X.restore();
        brilho(X, T1[0], (T1[1] + T2[1]) / 2, R.u * 5, '#C9843B', .18 + (RED ? 0 : .08 * Math.sin(t * 3)));
        fluxo(R, X, FS, 0, FS.FI(4) + .02, FS.FI(6), t, s, true, 7);
        return;
      }
      if (et.id === 'laq') {
        rastro(R, X, FS, 0, FS.FI(8), rgba(ESPC, .5)); rastro(R, X, OF, 0, OF.FI(5), rgba(OVOC, .55));
        fluxo(R, X, FS, FS.FI(3), FS.FI(8) - .03, FS.FI(10), t, s, true, 5);
        const k = RED ? .6 : fr(tt * .12), f = Math.min(OF.FI(5) - .04, lerp(0, OF.FI(5), k * 1.2)), q = P(R, OF, f); ovocito(X, q[0], q[1], cl(R.u * .9, 4, 9), t, 1, false);
        [[85, 32.8, -.05], [64.5, 32.6, .12]].forEach(([x, y, a]) => { const c = R.pt(x, y); corte(X, c[0], c[1], a, cl(R.u * .45, 3, 6)); });
        return;
      }
      if (et.id === 'pil') {
        const o = R.pt(91.6, 39.6), r = R.u * 1.6;
        brilho(X, o[0], o[1], r * 2.2, '#F2B6C6', .2);
        X.save(); X.setLineDash([3, 4]); X.beginPath(); X.arc(o[0], o[1], r, 0, TAU); X.strokeStyle = rgba(TXT, .85); X.lineWidth = 1.6; X.stroke(); X.restore();
        bloqueio(X, o[0], o[1], PI / 4, cl(R.u * .45, 3, 6), t);
        // os hormônios da pílula chegam pelo sangue (pontinhos) e o folículo não amadurece
        for (let i = 0; i < 6; i++) { const u = RED ? (i + .5) / 6 : fr(tt * .25 + i / 6), a = i * 1.05; dot(X, o[0] + Math.cos(a) * r * (3.6 - 2.4 * u), o[1] + Math.sin(a) * r * (3.6 - 2.4 * u), Math.max(2, R.u * .35), '#C79BF2', Math.sin(PI * u) * .9); }
        rastro(R, X, FS, 0, FS.FI(10), rgba(ESPC, .4));
        cardume(X, ...P(R, FS, FS.FI(9) + .02 * Math.sin(tt)), s, t, 4, .85);
      }
    }
    function painelP(X, b, t, S, v, et) {
      if (!b.comp) {
        txt(X, 'Onde age', b.x, b.y, { s: 12, c: DIM, w: 500 }); txt(X, et.onde, b.x + b.w, b.y, { s: 14, a: 'right' });
        txt(X, 'Tipo', b.x, b.y + 24, { s: 12, c: DIM, w: 500 }); txt(X, et.tipo, b.x + b.w, b.y + 24, { s: 14, a: 'right' });
        txt(X, 'Efeito', b.x, b.y + 48, { s: 12, c: DIM, w: 500 }); quebra(X, et.ac, b.x + 64, b.y + 48, b.w - 64, 18, { s: 13, a: 'left' });
        const iy = b.y + 92, cor = et.ist ? OK : ERRO;
        X.fillStyle = rgba(cor, .14); X.beginPath(); X.roundRect(b.x, iy - 16, b.w, 32, 8); X.fill(); X.strokeStyle = rgba(cor, .7); X.lineWidth = 1; X.stroke();
        txt(X, 'Protege contra ISTs', b.x + 12, iy, { s: 14 }); txt(X, et.ist ? 'sim' : 'não', b.x + b.w - 12, iy, { s: 15, c: cor, a: 'right', w: 700 });
        X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(b.x, iy + 28, b.w, 1);
        MET.forEach((m, i) => {
          const ly = iy + 50 + i * 24, on = m === et;
          if (on) { X.fillStyle = 'rgba(255,179,71,.14)'; X.beginPath(); X.roundRect(b.x - 6, ly - 11, b.w + 12, 22, 6); X.fill(); }
          txt(X, m.nome, b.x, ly, { s: 13, c: on ? AMB : TXT, w: on ? 700 : 500 });
          dot(X, b.x + b.w - 62, ly, 4.5, m.ist ? OK : 'rgba(232,237,247,.25)', 1);
          txt(X, m.ist ? 'IST sim' : 'IST não', b.x + b.w, ly, { s: 12, c: m.ist ? OK : DIM, a: 'right', w: 500 });
        });
      } else {
        txt(X, `Age em: ${et.onde}`, b.x, b.y + 4, { s: 12 }); txt(X, et.tipo, b.x + b.w, b.y + 4, { s: 12, c: DIM, a: 'right', w: 500 });
        const cor = et.ist ? OK : ERRO; dot(X, b.x + 5, b.y + 30, 5, cor, 1);
        txt(X, `Protege contra ISTs: ${et.ist ? 'sim' : 'não'}`, b.x + 16, b.y + 30, { s: 13, c: cor, w: 700 });
        txt(X, 'só as camisinhas', b.x + b.w, b.y + 30, { s: 12, c: DIM, a: 'right', w: 500 });
      }
    }
    rota({
      K: 'reprodutor/prevencao', nome: 'Onde cada método age',
      vistas: VISTAS,
      hs: HSP,
      ordem: ['prev'], esquema: 'Trilha dos gametas',
      trilhas: { prev: { rotulo: 'Onde cada método age', aria: 'Métodos contraceptivos: etapas', ET: MET, VAI: VAIP, sobre: sobreP, painel: painelP, alt: 382 } },
      ajustes(c3) {
        if (typeof c3.d === 'string') c3.d = c3.d.replace('<p>Veja onde cada grupo age', '<p>Em "Onde cada método age", siga os métodos sobre a figura, do testículo à tuba, e veja quais protegem contra ISTs. Veja também onde cada grupo age');
      }
    });
  })();
})();
