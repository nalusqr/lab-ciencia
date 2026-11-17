/* LAB Ecologia: quatro viagens sobre figuras de IA, no padrão de anatomia/cenas-figura-digestorio.js (Martin).
   ciclos/carbono      o átomo de carbono: ar, folha, árvore, boi, solo (vista B), rocha fóssil, chaminé e oceano; medidor de CO₂ no ar.
   ciclos/nitrogenio   o átomo de nitrogênio: ar, nódulo (vista B), nitrificação no solo, capim, boi, decomposição e desnitrificação;
                       a forma química troca na etapa certa (N₂, NH₃, NH₄⁺, NO₂⁻, NO₃⁻, proteína); medidor da forma do nitrogênio.
   impactos/estufa     o pacote de energia: luz do Sol, solo aquecido, infravermelho, gases que devolvem calor, CO₂ da queima e CH₄ do gado;
                       medidor de CO₂ (ppm) e de temperatura.
   impactos/eutrofizacao  o fosfato: esgoto (vista B), lago, floração, sombra no fundo, decomposição e peixes mortos; medidor de O₂ dissolvido.
   Painel com etapas (anterior, pausar, próxima, "Etapa N de M"), elemento que anda numa curva suave sobre a figura,
   moléculas que mudam na etapa certa, pontos tocáveis que levam a viagem até a etapa e vista B que entra sozinha.
   A cena antiga fica atrás de "Ver em 3D" (ou "Ver esquema" sem WebGL), pelo alternador LAB_FIGALT (figura-alterna.js).
   Com prefers-reduced-motion nada anda sozinho: etapas por botão e quadro parado.
   Substitui os blocos antigos de impactos/estufa (cenas-figura-v2.js) e impactos/eutrofizacao (cenas-figura.js).
   Carregar depois de cenas-figura-v2.js. Exporta o motor em window.LAB_ECO_VG (usado por cenas-figura-ciclos2.js). Texto na tela: sem "!", sem setas ou pontos como separador. */
'use strict';
(function () {
  const E = window.LAB_ECO;
  if (!E || !window.LAB_FIGALT || !window.LAB_FIGIA) return;
  const RED = LAB_FIGALT.RED, PI = Math.PI, TAU = PI * 2;
  const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
  const sst = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const eIO = u => { u = cl(u, 0, 1); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
  const rgba = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
  const hash = (i, k) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };
  const FT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
  const TXT = '#E8EDF7', DIM = '#9DA9C4', VERDE = '#7BE0A0', VERM = '#FF7A7A', AMB = '#FFB347';
  const AC = '#8A93A6', AO = '#E0605C', AN = '#5B8CFF', AH = '#E8EDF7', AP = '#F2A65A';   // cores dos átomos: C, O, N, H, P

  // a figura dos nódulos é da rota relacoes/harmonicas (prefixo ecologia); o alternador monta o nome como pref + '-' + vista.
  // O nome com "nodulo/../" faz o <script> cair no arquivo certo, e o apelido abaixo devolve a mesma imagem.
  const LIMG = window.LAB_IMG = window.LAB_IMG || {};
  const NODB = 'nodulo/../ecologia-relacoes-harmonicas-b';
  if (!Object.getOwnPropertyDescriptor(LIMG, 'bioenergetica-' + NODB)) Object.defineProperty(LIMG, 'bioenergetica-' + NODB, { configurable: true, get: () => LIMG['ecologia-relacoes-harmonicas-b'] });

  // ---------- desenho: átomos, moléculas e formas ----------
  function bola(X, x, y, r, c, a) {
    X.save(); X.globalAlpha *= a == null ? 1 : a;
    const g = X.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.3, c); g.addColorStop(1, rgba(c, .85));
    X.beginPath(); X.arc(x, y, Math.max(.1, r), 0, TAU); X.fillStyle = g; X.fill(); X.strokeStyle = 'rgba(11,15,28,.7)'; X.lineWidth = 1; X.stroke(); X.restore();
  }
  // at: [dx, dy, raio, cor] em unidades de s; lig: [i, j, número de traços]
  function mol(X, x, y, s, at, lig, rot, a) {
    const c = Math.cos(rot || 0), sn = Math.sin(rot || 0), P = at.map(q => [x + (q[0] * c - q[1] * sn) * s, y + (q[0] * sn + q[1] * c) * s]);
    X.save(); X.globalAlpha *= a == null ? 1 : a; X.strokeStyle = 'rgba(232,237,247,.75)'; X.lineCap = 'round';
    (lig || []).forEach(([i, j, n]) => {
      const A = P[i], B = P[j], dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L; n = n || 1;
      for (let k = 0; k < n; k++) { const o = (k - (n - 1) / 2) * Math.max(1.6, s * .28); X.lineWidth = Math.max(1, s * .14); X.beginPath(); X.moveTo(A[0] + nx * o, A[1] + ny * o); X.lineTo(B[0] + nx * o, B[1] + ny * o); X.stroke(); }
    });
    X.restore();
    at.forEach((q, i) => bola(X, P[i][0], P[i][1], q[2] * s, q[3], a));
  }
  const raio = (n, r, a0) => Array.from({ length: n }, (_, i) => [Math.cos(a0 + i * TAU / n) * r, Math.sin(a0 + i * TAU / n) * r]);
  function anel(X, x, y, s, r, cores, a) {   // anel de açúcar (hexágono)
    const V = raio(6, r, -PI / 2); X.save(); X.globalAlpha *= a == null ? 1 : a; X.beginPath(); V.forEach((p, i) => i ? X.lineTo(x + p[0] * s, y + p[1] * s) : X.moveTo(x + p[0] * s, y + p[1] * s)); X.closePath();
    X.strokeStyle = 'rgba(232,237,247,.8)'; X.lineWidth = Math.max(1, s * .16); X.stroke(); X.restore();
    V.forEach((p, i) => bola(X, x + p[0] * s, y + p[1] * s, s * .3, cores[i % cores.length], a));
  }
  function cadeia(X, x, y, s, n, cores, t, a) {
    const P = []; for (let i = 0; i < n; i++) P.push([x + (i - (n - 1) / 2) * s * .95, y + (i % 2 ? -.45 : .45) * s + Math.sin(t * 2 + i) * s * .06]);
    X.save(); X.globalAlpha *= a == null ? 1 : a; X.strokeStyle = 'rgba(232,237,247,.75)'; X.lineWidth = Math.max(1, s * .14); X.beginPath(); P.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.stroke(); X.restore();
    P.forEach((p, i) => bola(X, p[0], p[1], s * .38, cores[i % cores.length], a));
  }
  function onda(X, x, y, s, cor, t, a) {   // pacote de infravermelho
    X.save(); X.globalAlpha *= a == null ? 1 : a; X.strokeStyle = cor; X.lineWidth = Math.max(1.6, s * .3); X.lineCap = 'round'; X.beginPath();
    for (let k = 0; k <= 16; k++) { const u = k / 16, xx = x + (u - .5) * s * 3, yy = y + Math.sin(u * TAU * 2 + t * 6) * s * .55; k ? X.lineTo(xx, yy) : X.moveTo(xx, yy); }
    X.stroke(); X.restore();
  }
  function brilho(X, x, y, r, cor, a) {
    const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(cor, .9)); g.addColorStop(.4, rgba(cor, .35)); g.addColorStop(1, rgba(cor, 0));
    X.save(); X.globalAlpha *= a == null ? 1 : a; X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); X.restore();
  }
  function celula(X, x, y, s, viva, a) {   // alga: célula verde com cloroplastos; morta fica parda e murcha
    const cor = viva ? '#5FC46A' : '#8C7A4E';
    X.save(); X.globalAlpha *= a == null ? 1 : a;
    X.beginPath(); X.ellipse(x, y, s * 1.1, s * (viva ? .8 : .55), viva ? .3 : .9, 0, TAU); X.fillStyle = rgba(cor, .85); X.fill(); X.strokeStyle = viva ? '#B9F0A8' : '#C9B58A'; X.lineWidth = 1; X.stroke();
    [[-.4, -.1], [.3, .15], [0, -.3]].forEach(q => { X.beginPath(); X.arc(x + q[0] * s, y + q[1] * s, s * .2, 0, TAU); X.fillStyle = viva ? '#1E7A35' : '#5C4A2A'; X.fill(); });
    X.restore();
  }
  // formas: nome curto (para a pastilha), descrição e desenho
  const FORMA = {
    co2: { n: 'CO₂', d: 'gás carbônico', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[-1.2, 0, .6, AO], [0, 0, .72, AC], [1.2, 0, .6, AO]], [[0, 1, 2], [1, 2, 2]], Math.sin(t * .8) * .25, a) },
    glic: { n: 'glicose', d: 'açúcar feito na fotossíntese', g: (X, x, y, s, t, a) => anel(X, x, y, s, 1.05, [AO, AC, AC, AC, AC, AC], a) },
    celu: { n: 'celulose', d: 'açúcares em cadeia: a madeira', g: (X, x, y, s, t, a) => { [-1.1, 0, 1.1].forEach(dx => anel(X, x + dx * s * 1.05, y, s * .55, 1, [AO, AC, AC, AC, AC, AC], a)); } },
    prot: { n: 'proteína e gordura', d: 'matéria orgânica do boi', g: (X, x, y, s, t, a) => cadeia(X, x, y, s, 5, [AC, AN, AC, AO, AC], t, a) },
    mo: { n: 'matéria orgânica', d: 'restos e fezes no solo', g: (X, x, y, s, t, a) => cadeia(X, x, y, s * .9, 6, ['#A5774A', AC, '#A5774A', AO, AC, '#A5774A'], t, a) },
    petr: { n: 'carvão e petróleo', d: 'carbono fóssil, fora do ciclo rápido', g: (X, x, y, s, t, a) => cadeia(X, x, y, s * .9, 6, ['#3A3F4C', '#4A505E'], 0, a) },
    hco3: { n: 'bicarbonato', d: 'CO₂ dissolvido na água do mar', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[0, 0, .7, AC], [0, -1.15, .58, AO], [1, .6, .58, AO], [-1, .6, .58, AO], [-1.75, 1.2, .38, AH]], [[0, 1, 2], [0, 2], [0, 3], [3, 4]], Math.sin(t * .6) * .2, a) },
    n2: { n: 'N₂', d: 'gás nitrogênio, cerca de 78% do ar', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[-.6, 0, .66, AN], [.6, 0, .66, AN]], [[0, 1, 3]], Math.sin(t * .8) * .3, a) },
    nh3: { n: 'NH₃', d: 'amônia', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[0, 0, .72, AN], [0, -1.05, .4, AH], [.95, .55, .4, AH], [-.95, .55, .4, AH]], [[0, 1], [0, 2], [0, 3]], Math.sin(t * .7) * .2, a) },
    nh4: { n: 'NH₄⁺', d: 'amônio, a amônia no solo úmido', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[0, 0, .72, AN], [0, -1.05, .4, AH], [1.05, 0, .4, AH], [0, 1.05, .4, AH], [-1.05, 0, .4, AH]], [[0, 1], [0, 2], [0, 3], [0, 4]], t * .3, a) },
    no2: { n: 'NO₂⁻', d: 'nitrito', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[0, -.2, .7, AN], [-1, .55, .6, AO], [1, .55, .6, AO]], [[0, 1, 2], [0, 2]], Math.sin(t * .7) * .2, a) },
    no3: { n: 'NO₃⁻', d: 'nitrato, a forma que as plantas mais absorvem', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[0, 0, .7, AN], [0, -1.15, .6, AO], [1, .6, .6, AO], [-1, .6, .6, AO]], [[0, 1, 2], [0, 2], [0, 3]], t * .25, a) },
    protn: { n: 'proteína', d: 'nitrogênio orgânico', g: (X, x, y, s, t, a) => cadeia(X, x, y, s, 5, [AC, AN, AC, AO, AN], t, a) },
    ureia: { n: 'ureia e fezes', d: 'o que o boi elimina', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[0, 0, .66, AC], [0, -1.1, .58, AO], [-1.05, .6, .62, AN], [1.05, .6, .62, AN]], [[0, 1, 2], [0, 2], [0, 3]], 0, a) },
    luz: { n: 'luz visível', d: 'energia do Sol', g: (X, x, y, s, t, a) => { brilho(X, x, y, s * 2.6, '#FFD95A', a); bola(X, x, y, s * .7, '#FFE58A', a); } },
    calor: { n: 'solo aquecido', d: 'a energia vira calor', g: (X, x, y, s, t, a) => { brilho(X, x, y, s * 3, '#FF9A4A', a); bola(X, x, y, s * .7, '#FFB06A', a); } },
    ir: { n: 'infravermelho', d: 'calor que a superfície emite', g: (X, x, y, s, t, a) => { brilho(X, x, y, s * 2.2, '#FF6B5A', (a == null ? 1 : a) * .6); onda(X, x, y, s, '#FF7A6A', t, a); } },
    ch4: { n: 'CH₄', d: 'metano, do gado e do lixo', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[0, 0, .72, AC], [.8, -.8, .4, AH], [-.8, -.8, .4, AH], [.8, .8, .4, AH], [-.8, .8, .4, AH]], [[0, 1], [0, 2], [0, 3], [0, 4]], t * .4, a) },
    po4: { n: 'fosfato', d: 'nutriente do esgoto e do adubo', g: (X, x, y, s, t, a) => mol(X, x, y, s, [[0, 0, .72, AP], [0, -1.15, .55, AO], [1.1, .4, .55, AO], [-1.1, .4, .55, AO], [0, 1.2, .55, AO]], [[0, 1, 2], [0, 2], [0, 3], [0, 4]], t * .3, a) },
    alga: { n: 'alga', d: 'o fósforo vira parte da alga', g: (X, x, y, s, t, a) => celula(X, x, y, s * 1.1, true, a) },
    morta: { n: 'alga morta', d: 'matéria orgânica que afunda', g: (X, x, y, s, t, a) => celula(X, x, y, s * 1.1, false, a) }
  };

  // ---------- caminho suave (Catmull-Rom) em pixels a partir de pontos em % da figura ----------
  function curva(R, P) {
    const Q = P.map(p => R.pt(p[0], p[1])), A = [];
    if (Q.length === 1) return { A: [Q[0]], L: [0], T: 0 };
    for (let i = 0; i < Q.length - 1; i++) {
      const p0 = Q[Math.max(0, i - 1)], p1 = Q[i], p2 = Q[i + 1], p3 = Q[Math.min(Q.length - 1, i + 2)];
      for (let j = 0; j < 10; j++) { const t = j / 10, t2 = t * t, t3 = t2 * t; A.push([0, 1].map(k => .5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3))); }
    }
    A.push(Q[Q.length - 1]);
    const L = [0]; for (let i = 1; i < A.length; i++) L.push(L[i - 1] + Math.hypot(A[i][0] - A[i - 1][0], A[i][1] - A[i - 1][1]));
    return { A, L, T: L[L.length - 1] };
  }
  function naCurva(C, f) {
    if (C.A.length === 1) return [C.A[0][0], C.A[0][1], 0];
    const s = cl(f, 0, 1) * C.T; let i = 1; while (i < C.L.length - 1 && C.L[i] < s) i++;
    const u = (s - C.L[i - 1]) / ((C.L[i] - C.L[i - 1]) || 1), a = C.A[i - 1], b = C.A[i];
    return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), Math.atan2(b[1] - a[1], b[0] - a[0])];
  }
  function trilha(X, C, f, cor) {
    X.save(); X.lineCap = 'round'; X.setLineDash([2, 6]); X.lineWidth = 1.6;
    X.strokeStyle = rgba(cor, .28); X.beginPath(); C.A.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.stroke();
    const s = f * C.T; X.strokeStyle = rgba(cor, .8); X.lineWidth = 2; X.beginPath(); let st = false;
    for (let i = 0; i < C.A.length && C.L[i] <= s; i++) { st ? X.lineTo(C.A[i][0], C.A[i][1]) : X.moveTo(C.A[i][0], C.A[i][1]); st = true; }
    if (st) { const p = naCurva(C, f); X.lineTo(p[0], p[1]); X.stroke(); } X.restore();
  }

  // ---------- texto e pastilhas ----------
  function txt(X, s, x, y, o = {}) { X.font = `${o.w || 600} ${o.s || 13}px ${FT}`; X.fillStyle = o.c || TXT; X.textAlign = o.a || 'left'; X.textBaseline = 'middle'; X.fillText(s, x, y); }
  function pastilha(X, x, y, s, cor, o = {}) {
    X.save(); X.globalAlpha *= o.al == null ? 1 : o.al; X.font = `600 ${o.s || 12}px ${FT}`;
    const w = X.measureText(s).width + 26, h = 22; let x0 = o.c ? x - w / 2 : x; x0 = cl(x0, 4, E.W - w - 4);
    X.beginPath(); X.roundRect(x0, y - h / 2, w, h, 11); X.fillStyle = 'rgba(11,15,28,.86)'; X.fill(); X.strokeStyle = 'rgba(255,255,255,.14)'; X.lineWidth = 1; X.stroke();
    X.beginPath(); X.arc(x0 + 11, y, 4, 0, TAU); X.fillStyle = cor; X.fill();
    X.fillStyle = TXT; X.textBaseline = 'middle'; X.textAlign = 'left'; X.fillText(s, x0 + 19, y + .5); X.restore();
  }
  function quebra(X, s, w) {   // até duas linhas
    X.font = `500 12px ${FT}`; if (X.measureText(s).width <= w) return [s];
    const p = s.split(' '); let a = '', i = 0; while (i < p.length && X.measureText((a ? a + ' ' : '') + p[i]).width <= w) { a = (a ? a + ' ' : '') + p[i]; i++; }
    return [a, p.slice(i).join(' ')];
  }
  const sinalTxt = { '-1': ['retira do ar', VERDE], '0': ['fica guardado', DIM], '1': ['devolve ao ar', VERM], '2': ['soma carbono antigo', VERM] };

  // ---------- borda suave da figura (o fundo do palco engole o retângulo) ----------
  function feather(R, X) {
    const f = Math.min(26, R.w * .05), bg = '15,22,38';
    X.save();
    [[R.x, 0, R.x + f, 0, R.x, R.y, f, R.h], [R.x + R.w, 0, R.x + R.w - f, 0, R.x + R.w - f, R.y, f, R.h], [0, R.y, 0, R.y + f, R.x, R.y, R.w, f], [0, R.y + R.h, 0, R.y + R.h - f, R.x, R.y + R.h - f, R.w, f]].forEach(q => {
      const g = X.createLinearGradient(q[0], q[1], q[2], q[3]); g.addColorStop(0, `rgba(${bg},1)`); g.addColorStop(1, `rgba(${bg},0)`); X.fillStyle = g; X.fillRect(q[4], q[5], q[6], q[7]);
    });
    X.restore();
  }

  // ---------- botões da viagem (HTML sobre o palco), um conjunto para as quatro rotas ----------
  const ICO = { ant: '<path d="M14.5 6 8.5 12l6 6"/>', prox: '<path d="m9.5 6 6 6-6 6"/>', pausa: '<path d="M9 6v12M15 6v12"/>', play: '<path d="M8 5.5v13l10-6.5z"/>' };
  const svg = k => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
  let NAV = null, ATUAL = null, vivo = 0, sincK = '', navK = '';
  const tela = document.querySelector('.palco .tela');
  function montarNav() {
    if (NAV) return;
    const st = document.createElement('style'); st.id = 'ec-nav-css';
    st.textContent = `.ec-nav{position:absolute;left:0;top:0;z-index:2;display:flex;align-items:center;gap:6px}
.ec-nav[hidden]{display:none}
.ec-nav button{font:inherit;width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:10px;border:1px solid var(--line-strong,#5B6C99);background:rgba(19,26,43,.92);color:var(--txt,#E8EDF7);cursor:pointer;transition:background-color 90ms,border-color 90ms,color 90ms}
.ec-nav button:hover{background:var(--panel-2,#1B2440);border-color:var(--amber,#FFB347)}
.ec-nav button:active{transform:scale(.96)}
.ec-nav button:focus-visible{outline:2px solid var(--focus,#8FD8FF);outline-offset:2px}
.ec-nav button svg{width:22px;height:22px}
.ec-nav button[hidden]{display:none}
.ec-nav .et{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;padding:0 6px;line-height:1.2}
.ec-nav .et small{font-size:12px;color:var(--dim,#9DA9C4)}
.ec-nav .et b{font-size:15px;font-weight:600;color:var(--txt,#E8EDF7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(prefers-reduced-motion:reduce){.ec-nav button{transition:none}.ec-nav button:active{transform:none}}`;
    document.head.appendChild(st);
    NAV = document.createElement('div'); NAV.className = 'ec-nav'; NAV.hidden = true; NAV.setAttribute('role', 'group');
    NAV.innerHTML = `<button type="button" data-a="ant" aria-label="Etapa anterior" title="Etapa anterior">${svg('ant')}</button>`
      + `<div class="et" aria-live="polite"><small></small><b></b></div>`
      + `<button type="button" data-a="pausa"${RED ? ' hidden' : ''}></button>`
      + `<button type="button" data-a="prox" aria-label="Próxima etapa" title="Próxima etapa">${svg('prox')}</button>`;
    NAV.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b || !ATUAL) return; const v = ATUAL.S.vg;
      if (b.dataset.a === 'ant') ATUAL.ir(v.e - 1, true);
      else if (b.dataset.a === 'prox') ATUAL.ir(v.e + 1, true);
      else { v.pausa = !v.pausa; sinc(); }
    });
    tela.appendChild(NAV);
    (function vigia() { if (NAV && !NAV.hidden && performance.now() - vivo > 180) NAV.hidden = true; requestAnimationFrame(vigia); })();
  }
  function sinc() {
    if (!NAV || !ATUAL) return; const v = ATUAL.S.vg, ET = ATUAL.cfg.ET, k = ATUAL.cfg.K + '|' + v.e + '|' + v.pausa; if (k === sincK) return; sincK = k;
    NAV.setAttribute('aria-label', ATUAL.cfg.rotNav);
    NAV.querySelector('.et small').textContent = `Etapa ${v.e + 1} de ${ET.length}`;
    NAV.querySelector('.et b').textContent = ET[v.e].nome;
    const p = NAV.querySelector('[data-a="pausa"]'), tt = v.pausa ? 'Continuar a viagem' : 'Pausar a viagem';
    p.innerHTML = svg(v.pausa ? 'play' : 'pausa'); p.title = tt; p.setAttribute('aria-label', tt);
  }
  function posNav(x, y, w) { const k = [x, y, w].map(Math.round).join(); if (k === navK) return; navK = k; NAV.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`; NAV.style.width = Math.round(w) + 'px'; }

  // ---------- layout: painel à esquerda no palco largo; faixa embaixo no estreito ----------
  const largo = () => E.W >= 900;
  const FAIXA = 128;
  function caixa(W, H) {
    if (W >= 900) return { x: 332, y: 14, w: W - 348, h: H - 28 };
    const nar = W < 700; return { x: nar ? 6 : 24, y: 52, w: W - 2 * (nar ? 6 : 24), h: H - 52 - FAIXA - 12 };
  }

  const emFigura = () => { const b = document.querySelector('.fa-barra'); const f = b && b.querySelector('button[data-m="fig"]'); return !!(b && !b.hidden && f && f.getAttribute('aria-pressed') === 'true'); };

  // =====================================================================================
  // motor genérico de uma viagem
  // cfg: K, pref, nome, vistas, hs, VAI, ET [{ id, nome, vista, P, dur, cap, f: [[u, forma]], ... }], cor, rotForma,
  //      fundo(X, R, t, ctx) (partículas por trás do viajante), medidor(X, x, y, w, comp, ctx), alvo(e, u) (valor do medidor)
  // =====================================================================================
  function viagem(cfg) {
    const c3 = E.SC[cfg.K]; if (!c3) return;
    const ET = cfg.ET, NE = ET.length;
    const ctl = { cfg, S: null, FIG: null };
    const novo = () => ({ e: 0, u: RED ? 1 : 0, hold: 0, pausa: false, mv: cfg.alvo(0, RED ? 1 : 0), vsync: true });
    const forma = (et, u) => { let f = et.f[0][1]; et.f.forEach(q => { if (u >= q[0]) f = q[1]; }); return f; };
    ctl.ir = function (e, troca) {
      const v = ctl.S.vg; v.e = (e + NE) % NE; v.u = RED ? 1 : 0; v.hold = 0;
      if (RED) v.mv = cfg.alvo(v.e, 1);
      if (troca && ctl.FIG && ctl.FIG.vistaAtual !== ET[v.e].vista) ctl.FIG.mostrar(ET[v.e].vista);
      sinc();
    };
    function avancar(S, dt) {
      const v = S.vg, et = ET[v.e];
      if (RED || v.pausa || !dt) return;
      if (v.u < 1) { v.u = Math.min(1, v.u + dt / et.dur); return; }
      v.hold += dt;
      if (v.e < NE - 1) { if (v.hold > 1.6) ctl.ir(v.e + 1, true); }
      else if (v.hold > 3) ctl.ir(0, true);
    }
    let ultAb = null, Rfig = null;
    function sobre(R, X, t, c) {
      const S = c.S; if (!S || !S.vg) return; ctl.S = S; ATUAL = ctl; vivo = performance.now();
      if (!ctl.FIG) ctl.FIG = c3.figura;
      const FIG = ctl.FIG, v = S.vg;
      if (!cfg.mask) feather(R, X);
      if (v.vsync) { v.vsync = false; if (FIG.vistaAtual !== ET[v.e].vista) { FIG.mostrar(ET[v.e].vista); } }
      else if (R.vista !== ET[v.e].vista) {   // o aluno trocou de vista: a viagem pula para a primeira etapa daquela vista
        let k = -1; for (let i = 1; i <= NE && k < 0; i++) { const j = (v.e + i) % NE; if (ET[j].vista === R.vista) k = j; }
        if (k >= 0) ctl.ir(k, false);
      }
      // tocar num ponto leva a viagem até a etapa dele
      const ab = FIG.aberto ? FIG.aberto.id : null;
      if (ab !== ultAb) { ultAb = ab; if (ab && cfg.VAI[ab] != null && cfg.VAI[ab] !== v.e) ctl.ir(cfg.VAI[ab], false); }
      avancar(S, S.dt || 0);
      const et = ET[v.e], tt = RED ? 3.7 : t;
      const alvo = cfg.alvo(v.e, v.u); v.mv = RED ? alvo : v.mv + (alvo - v.mv) * Math.min(1, (S.dt || 0) * 3);
      Rfig = R;
      const C = curva(R, et.P), uu = RED ? (et.parado != null ? et.parado : .62) : eIO(v.u), p = naCurva(C, uu);
      const cx = { v, et, u: v.u, uu, p, tt, R, S, nar: E.W < 700 };
      if (cfg.fundo) { X.save(); try { cfg.fundo(X, R, tt, cx); } catch (e) { console.error(e); } X.restore(); }
      if (R.vista !== et.vista) return;
      if (et.P.length > 1) trilha(X, C, uu, cfg.cor);
      const fm = forma(et, RED ? 1 : v.u), s = cl(R.s * .95, 5, 11);
      // troca de forma: um anel rápido marca o instante da reação
      let anelK = 0; et.f.forEach(q => { if (q[0] > 0 && !RED) { const d = v.u - q[0]; if (d >= 0 && d < .08) anelK = 1 - d / .08; } });
      brilho(X, p[0], p[1], s * 3.4, cfg.cor, .55);
      if (anelK > 0) { X.save(); X.beginPath(); X.arc(p[0], p[1], s * (2 + 3 * (1 - anelK)), 0, TAU); X.strokeStyle = rgba('#FFFFFF', .8 * anelK); X.lineWidth = 2; X.stroke(); X.restore(); }
      FORMA[fm].g(X, p[0], p[1], s, tt, 1);
      pastilha(X, p[0] + s * 2.6, p[1] - s * 2.6, FORMA[fm].n, cfg.cor, { s: 12 });
    }
    function fora(X, t, c) {
      const S = c.S; if (!S || !S.vg || !Rfig) return; montarNav(); ATUAL = ctl; sinc(); NAV.hidden = false;
      const v = S.vg, et = ET[v.e], tt = RED ? 3.7 : t, W = E.W, H = E.H, fm = forma(et, RED ? 1 : v.u);
      const cx = { v, et, u: v.u, tt };
      if (largo()) {
        const x0 = 16, y0 = 60, w = 300, h = Math.min(H - 76, 330);
        X.fillStyle = 'rgba(11,15,28,.78)'; X.beginPath(); X.roundRect(x0, y0, w, h, 14); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
        posNav(x0 + 10, y0 + 10, w - 20);
        const px = x0 + 18, pw = w - 36;
        // processo da etapa
        X.beginPath(); X.arc(px + 5, y0 + 80, 5, 0, TAU); X.fillStyle = et.pc || cfg.cor; X.fill();
        txt(X, et.proc, px + 16, y0 + 80, { s: 14 });
        if (et.sn != null) { const q = sinalTxt[et.sn]; txt(X, q[0], px + pw, y0 + 80, { s: 12, c: q[1], a: 'right', w: 500 }); }
        X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(px, y0 + 98, pw, 1);
        cfg.medidor(X, px, y0 + 112, pw, false, cx);
        X.fillStyle = 'rgba(255,255,255,.08)'; X.fillRect(px, y0 + 196, pw, 1);
        txt(X, cfg.rotForma, px, y0 + 214, { s: 12, c: DIM, w: 500 });
        X.fillStyle = 'rgba(255,255,255,.04)'; X.beginPath(); X.roundRect(px, y0 + 228, 64, 56, 10); X.fill();
        FORMA[fm].g(X, px + 32, y0 + 256, 8, tt, 1);
        txt(X, FORMA[fm].n, px + 78, y0 + 246, { s: 15 });
        quebra(X, FORMA[fm].d, pw - 78).forEach((l, i) => txt(X, l, px + 78, y0 + 266 + i * 15, { s: 12, c: DIM, w: 500 }));
        // etapas como contas de um colar: feitas, atual e por vir
        const dy = y0 + h - 22, n = NE, gap = pw / (n - 1);
        X.strokeStyle = 'rgba(255,255,255,.14)'; X.lineWidth = 2; X.beginPath(); X.moveTo(px, dy); X.lineTo(px + pw, dy); X.stroke();
        X.strokeStyle = rgba(cfg.cor, .8); X.beginPath(); X.moveTo(px, dy); X.lineTo(px + gap * (v.e + (RED ? 0 : eIO(v.u))) * (v.e < n - 1 ? 1 : 0) + (v.e === n - 1 ? pw : 0), dy); X.stroke();
        for (let i = 0; i < n; i++) { X.beginPath(); X.arc(px + i * gap, dy, i === v.e ? 6 : 4, 0, TAU); X.fillStyle = i <= v.e ? cfg.cor : '#2A3352'; X.fill(); if (i === v.e) { X.strokeStyle = TXT; X.lineWidth = 1.5; X.stroke(); } }
      } else {
        const x0 = E.W < 700 ? 6 : 24, w = W - 2 * x0, y0 = H - FAIXA - 4;
        X.fillStyle = 'rgba(11,15,28,.8)'; X.beginPath(); X.roundRect(x0, y0, w, FAIXA, 12); X.fill(); X.strokeStyle = 'rgba(255,255,255,.08)'; X.lineWidth = 1; X.stroke();
        posNav(x0 + 6, y0 + 6, w - 12);
        const px = x0 + 12, pw = w - 24, fw = 104;
        cfg.medidor(X, px, y0 + 58, pw - fw - 8, true, cx);
        const fx = px + pw - fw;
        X.fillStyle = 'rgba(255,255,255,.04)'; X.beginPath(); X.roundRect(fx, y0 + 56, fw, 64, 10); X.fill();
        FORMA[fm].g(X, fx + fw / 2, y0 + 80, 6, tt, 1);
        txt(X, FORMA[fm].n, fx + fw / 2, y0 + 108, { s: 12, a: 'center' });
      }
    }

    // ---------- registro ----------
    const tem3d = !!c3.plano, rot = tem3d ? 'Ver em 3D' : 'Ver esquema';
    const amb = {
      SC: E.SC, X: () => E.X, W: () => E.W, H: () => E.H, nar: () => E.W < 700, tela,
      t: a => a[0], plano: () => {}, rot3d: rot, dica3d: tem3d ? 'Arraste para girar o modelo' : '',
      esconder: ['.hud.onde', '#ctl', '#opts'], esconderFig: []
    };
    LAB_FIGALT.cena(amb, cfg.K, {
      pref: cfg.pref, nome: cfg.nome, mask: cfg.mask || false, vistas: cfg.vistas, hs: cfg.hs,
      manter: (W, H) => caixa(W, H), sobre, fora
    });
    const dFig = c3.draw, i1 = c3.init, cap0 = c3.cap, hit0 = c3.hit;
    c3.init = function (S) { i1.call(this, S); S.vg = novo(); sincK = ''; ultAb = null; };
    c3.draw = function (t, S) {
      if (!S.vg) S.vg = novo();
      const r = dFig.call(this, t, S);
      const sp = document.querySelector('.fa-barra button[data-m="d3"] span'); if (sp && sp.textContent !== rot) sp.textContent = rot;   // a barra é uma só para o módulo
      return r;
    };
    // com a figura na tela, a legenda vem da etapa e os cliques do desenho antigo não valem
    c3.cap = function (S) { return emFigura() && S && S.vg ? ET[S.vg.e].cap : (cap0 ? cap0.call(this, S) : ''); };
    if (hit0) c3.hit = function (...a) { return emFigura() ? null : hit0.apply(this, a); };
  }

  // =====================================================================================
  // CICLO DO CARBONO
  // =====================================================================================
  const CO = '#C9D3E6';
  const ppmBar = (X, x, y, w, comp, val, lo, hi, marcas) => {   // barra de CO₂ com marcas de referência
    const by = y, bh = comp ? 8 : 10;
    const g = X.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#3E7F5A'); g.addColorStop(.55, '#C9A23A'); g.addColorStop(1, '#C8503F');
    X.fillStyle = g; X.beginPath(); X.roundRect(x, by, w, bh, bh / 2); X.fill();
    marcas.forEach(([m, rot], i) => { const mx = x + w * cl((m - lo) / (hi - lo), 0, 1); X.fillStyle = 'rgba(232,237,247,.7)'; X.fillRect(mx - .5, by - 3, 1, bh + 6); if (rot) txt(X, rot, i ? x + w : x, by + bh + 12, { s: comp ? 11 : 12, c: DIM, w: 500, a: i ? 'right' : 'left' }); });
    const nx = x + w * cl((val - lo) / (hi - lo), 0, 1);
    X.beginPath(); X.moveTo(nx, by - 2); X.lineTo(nx - 6, by - 9); X.lineTo(nx + 6, by - 9); X.closePath(); X.fillStyle = TXT; X.fill(); X.fillRect(nx - 1, by - 2, 2, bh + 4);
  };
  viagem({
    K: 'ciclos/carbono', pref: 'bioenergetica', mask: { miolo: .9, borda: 1 }, nome: 'Ciclo do carbono: a viagem do átomo', cor: '#F2D04A', rotForma: 'Forma do carbono agora',
    rotNav: 'Viagem do átomo de carbono: etapas',
    vistas: [
      ['a', 'relacao-carbono-a', 'Paisagem', 'Paisagem em corte: árvore, boi, cogumelos, fábrica, carro, rocha profunda e oceano'],
      ['b', 'relacao-carbono-b', 'Solo de perto', 'Solo de perto: folhas caídas, raízes, fungos, hifas e minhocas']
    ],
    hs: [
      { id: 'car', c: CO, t: 'CO₂ no ar', d: 'O CO₂ é cerca de 0,04% do ar. A fotossíntese o retira; a respiração, a decomposição e a queima o devolvem.', em: { a: [44, 27] }, z: 2 },
      { id: 'cfo', c: '#A9C54A', t: 'Folhas', d: 'Na fotossíntese, as folhas usam luz, água e CO₂ para fabricar glicose e liberam O₂. É a principal entrada do carbono nos seres vivos.', em: { a: [24, 13] }, z: 2.4 },
      { id: 'ctr', c: '#C99A6A', t: 'Tronco e madeira', d: 'A madeira é feita de celulose. Uma floresta guarda muito carbono no tronco, nas raízes e no solo; queimá-la devolve esse carbono ao ar.', em: { a: [19, 40] }, z: 2.6 },
      { id: 'cbo', c: '#F7C13B', t: 'Boi', d: 'Consumidor primário. Recebe o carbono ao comer plantas e devolve parte dele ao ar na respiração. Na digestão, o boi também libera metano (CH₄).', em: { a: [35, 41] }, z: 2.8 },
      { id: 'ccg', c: '#FFA94D', t: 'Cogumelos', d: 'Fungos decompositores. Quebram restos de plantas e animais e devolvem o carbono ao ar como CO₂, na respiração.', em: { a: [30, 52.5] }, z: 3 },
      { id: 'cfs', c: '#9AA3B2', t: 'Rocha profunda', d: 'Restos soterrados há milhões de anos, sem se decompor, viram carvão, petróleo e gás natural. Esse carbono fica fora do ciclo rápido.', em: { a: [40, 86] }, z: 2.4 },
      { id: 'cch', c: '#F28B8B', t: 'Chaminé', d: 'A queima de combustíveis fósseis em fábricas e usinas libera CO₂ em poucos anos. É a maior fonte de CO₂ lançado pelas atividades humanas.', em: { a: [56.4, 33] }, z: 3 },
      { id: 'cca', c: '#FFA94D', t: 'Carro', d: 'Gasolina e diesel vêm do petróleo e emitem CO₂ fóssil. O etanol devolve o CO₂ que a cana retirou do ar há pouco tempo.', em: { a: [65.5, 41] }, z: 3 },
      { id: 'coc', c: '#8FD8FF', t: 'Oceano', d: 'O oceano troca CO₂ com o ar e absorve parte do que emitimos. Algas usam o CO₂ dissolvido na fotossíntese. Mais CO₂ deixa a água mais ácida.', em: { a: [84, 63] }, z: 2.4 },
      { id: 'cfl', c: '#C99A6A', t: 'Folhas caídas', d: 'A serapilheira, camada de folhas e galhos caídos, é o alimento dos decompositores. Assim o carbono das plantas chega ao solo.', em: { b: [12, 29] }, z: 2.4 },
      { id: 'cfu', c: '#FFA94D', t: 'Fungos na madeira', d: 'Fungos decompõem a madeira morta. Ao respirar, devolvem o carbono ao ar como CO₂.', em: { b: [73, 22] }, z: 2.6 },
      { id: 'chi', c: '#E8EDF7', t: 'Hifas', d: 'Os fios brancos são hifas, o corpo do fungo. Elas se espalham pelo solo e absorvem os restos que o fungo digere fora do corpo.', em: { b: [74, 38] }, z: 2.8 },
      { id: 'cmi', c: '#F28B8B', t: 'Minhoca', d: 'Minhocas comem restos e misturam o solo, o que ajuda os decompositores. Elas também respiram e liberam CO₂.', em: { b: [79, 56] }, z: 2.6 },
      { id: 'cra', c: '#A9C54A', t: 'Raízes', d: 'As raízes também respiram e soltam CO₂ no solo. Parte do carbono fica guardada no solo como húmus.', em: { b: [35, 50] }, z: 2.2 }
    ],
    VAI: { car: 0, cfo: 1, ctr: 2, cbo: 3, cfs: 5, cch: 6, cca: 6, coc: 7, cfl: 4, cfu: 4, chi: 4, cmi: 4, cra: 4 },
    ET: [
      { id: 'ar', nome: 'No ar', vista: 'a', P: [[50, 31], [46, 28], [42, 25], [37, 22]], dur: 5, f: [[0, 'co2']], ppm: 420, proc: 'Ponto de partida', sn: null,
        cap: 'O átomo de carbono começa no <b>ar</b>, dentro de uma molécula de <b>CO₂</b>. O CO₂ é só cerca de 0,04% do ar, mas é dele que vem o carbono dos seres vivos.' },
      { id: 'folha', nome: 'Folha', vista: 'a', P: [[37, 22], [33, 19], [29, 16], [25, 17]], dur: 6, f: [[0, 'co2'], [.72, 'glic']], ppm: 405, proc: 'Fotossíntese', sn: -1, pc: '#A9C54A',
        cap: 'Na <b>folha</b>, a <b>fotossíntese</b> usa a luz para juntar o CO₂ com a água e formar <b>glicose</b>. O carbono sai do ar e entra no ser vivo.' },
      { id: 'arvore', nome: 'Árvore', vista: 'a', P: [[25, 17], [22, 23], [20, 30], [19, 38], [19.5, 45]], dur: 6, f: [[0, 'glic'], [.5, 'celu']], ppm: 405, proc: 'Crescimento', sn: 0, pc: '#C99A6A',
        cap: 'A planta usa a glicose para crescer: o carbono vira <b>celulose</b> e fica guardado na madeira por anos. Parte da glicose é gasta na <b>respiração</b> e volta ao ar como CO₂.' },
      { id: 'boi', nome: 'Boi', vista: 'a', P: [[19.5, 45], [24, 46.5], [29.5, 45.5], [33, 42], [37, 41]], dur: 6, f: [[0, 'celu'], [.45, 'prot']], ppm: 412, proc: 'Alimentação e respiração', sn: 1, pc: '#F7C13B',
        cap: 'O carbono passa ao <b>boi</b> pela <b>alimentação</b>: ele come capim e folhas, matéria orgânica feita na fotossíntese. No boi, vira proteína e gordura, e parte volta ao ar na <b>respiração</b>.' },
      { id: 'solo', nome: 'Solo', vista: 'b', P: [[10, 22], [16, 29], [24, 34], [36, 40], [50, 44], [62, 42], [73, 38]], dur: 8, f: [[0, 'mo']], ppm: 418, proc: 'Decomposição', sn: 1, pc: '#FFA94D',
        cap: 'Fezes, folhas e corpos mortos chegam ao <b>solo</b>. Fungos, bactérias e minhocas os decompõem e, ao respirar, devolvem boa parte do carbono ao ar como CO₂. Uma parte fica guardada no solo.' },
      { id: 'fossil', nome: 'Rocha fóssil', vista: 'a', P: [[30, 57], [31, 65], [34, 73], [38, 80], [44, 86]], dur: 7, f: [[0, 'mo'], [.6, 'petr']], ppm: 418, proc: 'Fossilização', sn: 0, pc: '#9AA3B2',
        cap: 'Restos soterrados sem oxigênio, por <b>milhões de anos</b>, sob calor e pressão, viram <b>carvão, petróleo e gás natural</b>. Esse carbono sai do ciclo rápido.' },
      { id: 'chamine', nome: 'Chaminé', vista: 'a', P: [[44, 86], [50, 80], [54, 70], [56, 60], [56.4, 50], [56.4, 40], [56.4, 30], [58, 24], [62, 18]], dur: 8, f: [[0, 'petr'], [.78, 'co2']], ppm: 445, proc: 'Combustão', sn: 2, pc: '#F28B8B',
        cap: 'O petróleo é extraído e queimado em fábricas, usinas e carros. A <b>combustão</b> devolve ao ar, em pouco tempo, carbono guardado há milhões de anos: o CO₂ do ar aumenta e o efeito estufa se intensifica.' },
      { id: 'oceano', nome: 'Oceano', vista: 'a', P: [[62, 18], [68, 22], [74, 30], [78, 40], [81, 50], [84, 58], [87, 66]], dur: 7, f: [[0, 'co2'], [.62, 'hco3']], ppm: 432, proc: 'Troca com o oceano', sn: -1, pc: '#8FD8FF',
        cap: 'O <b>oceano</b> absorve parte do CO₂ do ar. Dissolvido, ele forma ácido carbônico e <b>bicarbonato</b>. As algas usam esse carbono na fotossíntese, mas o excesso deixa a água mais ácida.' }
    ],
    alvo(e) { return this.ET[e].ppm; },
    medidor(X, x, y, w, comp, c) {
      const v = c.v, et = c.et, sob = c.v.e ? et.ppm - this.ET[c.v.e - 1].ppm : 0;
      txt(X, 'CO₂ no ar', x, y + 6, { s: comp ? 13 : 15 });
      const tend = Math.abs(sob) < 2 ? ['estável', DIM] : sob > 0 ? ['subindo', VERM] : ['descendo', VERDE];
      txt(X, tend[0], x + w, y + 6, { s: 12, c: tend[1], a: 'right', w: 600 });
      ppmBar(X, x, y + (comp ? 22 : 26), w, comp, v.mv, 260, 470, [[280, comp ? '280' : '280 antes da indústria'], [420, 'cerca de 420 hoje']]);
      if (!comp) txt(X, 'escala ilustrativa: a agulha mostra o sentido da troca', x, y + 66, { s: 11, c: DIM, w: 500 });
    },
    fundo(X, R, t, c) {
      if (R.vista === 'a') {
        const e = c.v.e, [ux] = [R.s];
        // CO₂ espalhado no ar; depois da chaminé há mais
        const n = 7 + (e >= 6 ? 6 : 0);
        for (let i = 0; i < n; i++) {
          const x = 36 + hash(i, 1) * 58 + Math.sin(t * .2 + i) * 1.5, y = 4 + hash(i, 2) * 24 + Math.cos(t * .25 + i * 2) * 1.2, p = R.pt(x, y);
          FORMA.co2.g(X, p[0], p[1], cl(ux * .6, 3.2, 6), t + i, i >= 7 ? Math.min(1, (e === 6 ? c.u * 1.4 : 1)) * .8 : .55);
        }
        if (e === 1) for (let i = 0; i < 3; i++) { const u = RED ? (i + .5) / 3 : (t * .25 + i / 3) % 1, a = R.pt(lerp(40 + i * 6, 22 + i * 3, u), lerp(8 + i * 4, 14 + i, u)); FORMA.co2.g(X, a[0], a[1], cl(ux * .6, 3.2, 6), t, Math.sin(PI * u)); }
        if (e === 3) for (let i = 0; i < 3; i++) { const u = RED ? (i + .5) / 3 : (t * .3 + i / 3) % 1, a = R.pt(29 + u * 2 - i, 43 - u * 9); FORMA.co2.g(X, a[0], a[1], cl(ux * .55, 3, 5.6), t, Math.sin(PI * u) * .9); }
        if (e === 5 || e === 6) {   // jazida de carvão e petróleo na rocha funda
          const a = e === 5 ? sst(.2, .7, c.u) : 1 - sst(.3, .8, c.u) * .5, p = R.pt(42, 86.5);
          X.save(); X.globalAlpha = a; X.beginPath(); X.ellipse(p[0], p[1], R.s * 14, R.s * 2.4, -.05, 0, TAU);
          const g = X.createLinearGradient(p[0], p[1] - R.s * 2.4, p[0], p[1] + R.s * 2.4); g.addColorStop(0, 'rgba(70,74,90,.9)'); g.addColorStop(.5, 'rgba(18,20,28,.95)'); g.addColorStop(1, 'rgba(40,42,54,.9)');
          X.fillStyle = g; X.fill(); X.strokeStyle = 'rgba(200,210,230,.35)'; X.lineWidth = 1; X.stroke(); X.restore();
          if (e === 5) pastilha(X, p[0], p[1] + R.s * 5, 'carvão e petróleo', '#9AA3B2', { c: 1, al: a });
        }
        if (e === 6) for (let i = 0; i < 4; i++) { const u = RED ? (i + .5) / 4 : (t * .2 + i / 4) % 1, a = R.pt(lerp(i % 2 ? 70 : 57, i % 2 ? 76 : 63, u), lerp(i % 2 ? 38 : 25, i % 2 ? 26 : 8, u)); FORMA.co2.g(X, a[0], a[1], cl(ux * .6, 3.2, 6), t, Math.sin(PI * u)); }
        if (e === 7) for (let i = 0; i < 4; i++) { const u = RED ? (i + .5) / 4 : (t * .18 + i / 4) % 1, x = 72 + i * 6, a = R.pt(x, lerp(40, 62, u)); (u < .5 ? FORMA.co2 : FORMA.hco3).g(X, a[0], a[1], cl(ux * .55, 3, 5.6), t, Math.sin(PI * u) * .9); }
      } else {
        // solo de perto: CO₂ saindo dos decompositores e das raízes
        [[73, 22], [74, 38], [80, 54], [30, 17], [35, 50]].forEach((q, i) => {
          for (let k = 0; k < 2; k++) { const u = RED ? .5 : (t * .22 + k / 2 + i * .13) % 1, a = R.pt(q[0] + Math.sin(u * 6 + i) * 1.2, q[1] - u * 14); FORMA.co2.g(X, a[0], a[1], cl(R.s * .6, 3.2, 6), t + i, Math.sin(PI * u) * (c.v.e === 4 ? .95 : .4)); }
        });
      }
    }
  });

  // =====================================================================================
  // CICLO DO NITROGÊNIO
  // =====================================================================================
  const ORDEM_N = [['n2', 'N₂'], ['nh3', 'NH₃'], ['no2', 'NO₂⁻'], ['no3', 'NO₃⁻'], ['protn', 'proteína']];
  const POS_N = { n2: 0, nh3: 1, nh4: 1, no2: 2, no3: 3, protn: 4, ureia: 4 };
  const ABS_N = { n2: ['não absorvem', VERM], nh3: ['absorvem, como amônio', VERDE], nh4: ['absorvem', VERDE], no2: ['quase não', AMB], no3: ['absorvem bem', VERDE], protn: ['já é orgânico', DIM], ureia: ['ainda não', AMB] };
  viagem({
    K: 'ciclos/nitrogenio', pref: 'bioenergetica', mask: { miolo: .9, borda: 1 }, nome: 'Ciclo do nitrogênio: a viagem do átomo', cor: '#7FA8FF', rotForma: 'Forma do nitrogênio agora',
    rotNav: 'Viagem do átomo de nitrogênio: etapas',
    vistas: [
      ['a', 'relacao-carbono-a', 'Paisagem', 'Paisagem em corte: ar, capim, boi, cogumelos, solo e margem encharcada'],
      ['b', NODB, 'Nódulos da raiz', 'Raiz de leguminosa com nódulos, onde vivem bactérias fixadoras de nitrogênio']
    ],
    hs: [
      { id: 'nar', c: '#7FA8FF', t: 'N₂ no ar', d: 'O N₂ forma cerca de 78% do ar. Plantas e animais não conseguem usar o nitrogênio nessa forma.', em: { a: [44, 27] }, z: 2 },
      { id: 'nnu', c: '#FFD43B', t: 'Nuvens e raios', d: 'A energia dos raios quebra o N₂ e forma compostos que a chuva leva ao solo. Essa fixação é pequena perto da feita pelas bactérias.', em: { a: [70, 12] }, z: 2.2 },
      { id: 'nso', c: '#F7C13B', t: 'Solo', d: 'Bactérias Nitrosomonas transformam amônio em nitrito, e Nitrobacter transformam nitrito em nitrato. É a nitrificação.', em: { a: [36, 66] }, z: 2.4 },
      { id: 'nca', c: '#A9C54A', t: 'Capim', d: 'As raízes absorvem nitrato e amônio. A planta usa o nitrogênio para fazer proteínas e ácidos nucleicos: é a assimilação.', em: { a: [40, 46.5] }, z: 2.8 },
      { id: 'nbo', c: '#F7C13B', t: 'Boi', d: 'Recebe o nitrogênio ao comer plantas e monta as próprias proteínas. Elimina o excesso na urina, como ureia.', em: { a: [35, 41] }, z: 2.8 },
      { id: 'ncg', c: '#FFA94D', t: 'Cogumelos', d: 'Fungos e bactérias decompositores transformam o nitrogênio de restos, fezes e urina em amônia. É a amonificação.', em: { a: [30, 52.5] }, z: 3 },
      { id: 'nen', c: '#F06AAE', t: 'Solo encharcado', d: 'Perto da água, o solo fica encharcado e pobre em oxigênio. Ali, bactérias desnitrificantes transformam nitrato em N₂, que volta ao ar.', em: { a: [62, 58] }, z: 2.6 },
      { id: 'nnc', c: '#F28B8B', t: 'Nódulo cortado', d: 'O interior rosado vem da leg-hemoglobina, que controla o oxigênio perto das bactérias. Dentro dele, os Rhizobium fixam o N₂.', em: { b: [49, 48] }, z: 2.6 },
      { id: 'nno', c: '#FFD43B', t: 'Nódulo', d: 'Bolinha na raiz onde vivem bactérias Rhizobium. Elas fixam o N₂ em amônia, e a planta dá açúcares em troca. É mutualismo.', em: { b: [64, 33] }, z: 2.6 },
      { id: 'nra', c: '#CFE0FF', t: 'Raiz da leguminosa', d: 'Feijão, soja e amendoim são leguminosas. A amônia dos nódulos vai para a planta e vira proteína. Por isso enriquecem o solo.', em: { b: [24, 20] }, z: 2.4 },
      { id: 'nsb', c: '#A9C54A', t: 'Ar do solo', d: 'Entre os grãos de terra há ar, com N₂. É desse N₂ que as bactérias dos nódulos tiram o nitrogênio.', em: { b: [14, 84] }, z: 2.2 }
    ],
    VAI: { nar: 0, nnu: 0, nso: 2, nca: 3, nbo: 4, ncg: 5, nen: 6, nnc: 1, nno: 1, nra: 1, nsb: 1 },
    ET: [
      { id: 'ar', nome: 'N₂ no ar', vista: 'a', P: [[52, 30], [47, 27], [42, 24], [37, 21]], dur: 5, f: [[0, 'n2']], proc: 'Ponto de partida', pc: '#7FA8FF',
        cap: 'O átomo de nitrogênio começa no <b>ar</b>, na molécula de <b>N₂</b>, cerca de 78% do ar. Plantas e animais não conseguem usar essa forma. Raios fixam um pouco de N₂.' },
      { id: 'fix', nome: 'Nódulo da raiz', vista: 'b', P: [[90, 22], [80, 24], [70, 26], [60, 30], [54, 36], [50, 43], [49, 48]], dur: 7, f: [[0, 'n2'], [.8, 'nh3']], proc: 'Fixação', pc: '#F28B8B',
        cap: 'Nos <b>nódulos</b> da raiz das leguminosas vivem bactérias <i>Rhizobium</i>. Elas fazem a <b>fixação</b>: transformam o N₂ em <b>amônia</b> (NH₃). A planta recebe amônia e dá açúcar às bactérias.' },
      { id: 'nitr', nome: 'Solo', vista: 'a', P: [[22, 60], [27, 64], [33, 67], [39, 66], [45, 63]], dur: 9, f: [[0, 'nh4'], [.4, 'no2'], [.78, 'no3']], proc: 'Nitrificação', pc: '#F7C13B',
        cap: 'Parte da amônia fica no solo como <b>amônio</b> (NH₄⁺). Na <b>nitrificação</b>, bactérias <i>Nitrosomonas</i> o transformam em <b>nitrito</b> (NO₂⁻), e bactérias <i>Nitrobacter</i>, em <b>nitrato</b> (NO₃⁻).' },
      { id: 'assim', nome: 'Capim', vista: 'a', P: [[45, 63], [42, 57], [38, 52], [34, 49], [31, 47]], dur: 6, f: [[0, 'no3'], [.7, 'protn']], proc: 'Assimilação', pc: '#A9C54A',
        cap: 'Na <b>assimilação</b>, as raízes absorvem o nitrato (e também amônio), e a planta usa o nitrogênio para fabricar <b>proteínas</b> e ácidos nucleicos.' },
      { id: 'boi', nome: 'Boi', vista: 'a', P: [[31, 47], [29.5, 45], [32, 42.5], [36, 41]], dur: 5, f: [[0, 'protn'], [.85, 'ureia']], proc: 'Alimentação', pc: '#F7C13B',
        cap: 'O <b>boi</b> come o capim e usa o nitrogênio das proteínas para montar as próprias proteínas. O excesso sai na urina, como <b>ureia</b>, e nas fezes.' },
      { id: 'amon', nome: 'Decompositores', vista: 'a', P: [[36, 41], [37, 45.5], [34, 49], [31, 52], [30, 56]], dur: 6, f: [[0, 'ureia'], [.7, 'nh3']], proc: 'Amonificação', pc: '#FFA94D',
        cap: 'Na <b>amonificação</b>, fungos e bactérias decompositores transformam o nitrogênio de fezes, urina e restos mortos em <b>amônia</b>. No solo, ela pode ser nitrificada de novo.' },
      { id: 'desn', nome: 'Solo encharcado', vista: 'a', P: [[30, 56], [38, 61], [48, 62], [57, 60], [63, 58], [70, 50], [74, 40], [72, 30], [66, 24]], dur: 9, f: [[0, 'nh3'], [.18, 'no3'], [.5, 'n2']], proc: 'Desnitrificação', pc: '#F06AAE',
        cap: 'A amônia vira nitrato de novo. Em <b>solo encharcado</b>, com pouco oxigênio, bactérias <b>desnitrificantes</b> (como <i>Pseudomonas</i>) transformam o nitrato em <b>N₂</b>, que volta ao ar. O ciclo se fecha.' }
    ],
    alvo(e, u) { const et = this.ET[e]; let f = et.f[0][1]; et.f.forEach(q => { if (u >= q[0]) f = q[1]; }); return POS_N[f]; },
    medidor(X, x, y, w, comp, c) {
      const et = c.et; let f = et.f[0][1]; et.f.forEach(q => { if ((RED ? 1 : c.u) >= q[0]) f = q[1]; });
      txt(X, 'Plantas', x, y + 6, { s: comp ? 13 : 15 });
      const ab = ABS_N[f]; txt(X, ab[0], x + w, y + 6, { s: 12, c: ab[1], a: 'right' });
      const ty = y + (comp ? 30 : 36), n = ORDEM_N.length, gap = w / (n - 1), mv = c.v.mv;
      X.strokeStyle = 'rgba(255,255,255,.16)'; X.lineWidth = 2; X.beginPath(); X.moveTo(x, ty); X.lineTo(x + w, ty); X.stroke();
      ORDEM_N.forEach(([id, rot], i) => {
        const on = Math.abs(mv - i) < .5, cx = x + i * gap;
        X.beginPath(); X.arc(cx, ty, on ? 7 : 4.5, 0, TAU); X.fillStyle = on ? '#7FA8FF' : '#2A3352'; X.fill(); if (on) { X.strokeStyle = TXT; X.lineWidth = 1.5; X.stroke(); }
        if (on || !comp) txt(X, rot, cx, ty + (comp ? 16 : 18), { s: comp ? 11 : 12, c: on ? TXT : DIM, a: i === 0 ? 'left' : i === n - 1 ? 'right' : 'center', w: on ? 700 : 500 });
      });
      const mx = x + cl(mv, 0, n - 1) * gap; X.beginPath(); X.moveTo(mx, ty - 9); X.lineTo(mx - 5, ty - 15); X.lineTo(mx + 5, ty - 15); X.closePath(); X.fillStyle = TXT; X.fill();
      if (!comp) txt(X, 'A agulha mostra a forma química do átomo', x, y + 74, { s: 11, c: DIM, w: 500 });
    },
    fundo(X, R, t, c) {
      const e = c.v.e, s = cl(R.s * .6, 3.2, 6);
      if (R.vista === 'a') {
        for (let i = 0; i < 9; i++) { const x = 36 + hash(i, 4) * 58 + Math.sin(t * .2 + i) * 1.5, y = 4 + hash(i, 5) * 24 + Math.cos(t * .25 + i) * 1.2, p = R.pt(x, y); FORMA.n2.g(X, p[0], p[1], s, t + i, .5); }
        if (e === 0 && !RED && (t % 4) < .35) {   // raio rápido saindo da nuvem
          const P = [[63, 19], [61, 24], [63, 25], [59, 32]].map(q => R.pt(q[0], q[1]));
          X.save(); X.strokeStyle = 'rgba(255,240,170,.95)'; X.lineWidth = 2.5; X.shadowColor = '#FFE58A'; X.shadowBlur = 12; X.beginPath(); P.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.stroke(); X.restore();
        }
        if (e === 2) {   // bactérias nitrificantes no solo: primeiro Nitrosomonas, depois Nitrobacter
          const cor = c.u < .55 ? '#F7C13B' : '#7BE0A0';
          for (let i = 0; i < 7; i++) { const a = i * 2.4 + (RED ? 0 : t * .5), p = R.pt(lerp(24, 44, hash(i, 7)) + Math.cos(a) * .8, 63 + hash(i, 8) * 6 + Math.sin(a) * .6); X.save(); X.translate(p[0], p[1]); X.rotate(a); X.beginPath(); X.roundRect(-s, -s * .4, s * 2, s * .8, s * .4); X.fillStyle = rgba(cor, .85); X.fill(); X.restore(); }
          pastilha(X, R.pt(34, 75)[0], R.pt(34, 75)[1], c.u < .55 ? 'Nitrosomonas' : 'Nitrobacter', cor, { c: 1 });
        }
        if (e === 5) for (let i = 0; i < 6; i++) { const a = i * 1.9 + (RED ? 0 : t * .6), p = R.pt(30 + Math.cos(a) * 3, 55 + Math.sin(a) * 1.5); X.beginPath(); X.arc(p[0], p[1], s * .5, 0, TAU); X.fillStyle = 'rgba(255,169,77,.85)'; X.fill(); }
        if (e === 6) for (let i = 0; i < 4; i++) { const u = RED ? (i + .5) / 4 : (t * .2 + i / 4) % 1, p = R.pt(56 + i * 3, lerp(60, 30, u)); FORMA.n2.g(X, p[0], p[1], s, t + i, Math.sin(PI * u) * .9); }
      } else {
        // nódulos: N₂ do ar do solo entrando, bactérias no nódulo cortado e amônia indo para a raiz
        for (let i = 0; i < 4; i++) { const u = RED ? (i + .5) / 4 : (t * .15 + i / 4) % 1, p = R.pt(lerp(95, 56, u), lerp(14 + i * 4, 34 + i * 2, u)); FORMA.n2.g(X, p[0], p[1], s * 1.2, t + i, Math.sin(PI * u) * .85); }
        const cc = R.pt(49, 48);
        for (let i = 0; i < 14; i++) { const a = i * 2.39 + (RED ? 0 : t * .4), d = (.25 + .7 * hash(i, 3)) * R.s * 6.5, x = cc[0] + Math.cos(a) * d, y = cc[1] + Math.sin(a) * d * .9; X.save(); X.translate(x, y); X.rotate(a * 1.7); X.beginPath(); X.roundRect(-s * .9, -s * .32, s * 1.8, s * .64, s * .32); X.fillStyle = 'rgba(255,240,245,.85)'; X.fill(); X.restore(); }
        if (e === 1) pastilha(X, cc[0], cc[1] + R.s * 11, 'bactérias Rhizobium', '#F28B8B', { c: 1 });
        if (e === 1 && (c.u > .75 || RED)) for (let i = 0; i < 3; i++) { const u = RED ? (i + .5) / 3 : (t * .3 + i / 3) % 1, p = R.pt(lerp(46, 26, u), lerp(42, 20, u)); FORMA.nh3.g(X, p[0], p[1], s * 1.1, t, Math.sin(PI * u)); }
      }
    }
  });

  // =====================================================================================
  // EFEITO ESTUFA
  // =====================================================================================
  const hazeY = x => 22 + Math.pow(x - 50, 2) * .004;
  const GCH = [[18, 66], [30, 70], [44, 64], [54, 74], [66, 66], [76, 72], [88, 68]];
  viagem({
    K: 'impactos/estufa', pref: 'ecologia', nome: 'Efeito estufa: a viagem da energia', cor: '#FFB347', rotForma: 'O que viaja agora',
    rotNav: 'Viagem da energia do Sol: etapas',
    vistas: [['a', 'impactos-estufa-a', 'Paisagem', 'Paisagem com floresta, fábrica, gado e estrada sob uma camada de gases de efeito estufa']],
    hs: [
      { id: 'esol', c: '#FFD43B', t: 'Luz do Sol', d: 'A luz atravessa os gases sem dificuldade e aquece o chão e a água.', em: { a: [21, 25] }, z: 2.4 },
      { id: 'egz', c: '#FFA94D', t: 'Gases de efeito estufa', d: 'CO₂, CH₄ e vapor de água deixam passar a luz, mas retêm parte do calor que a Terra devolve. Mais gases, mais calor retido.', em: { a: [62, 24] }, z: 2.6 },
      { id: 'efa', c: '#F28B8B', t: 'Fábrica', d: 'A queima de combustíveis fósseis libera CO₂ que estava guardado há milhões de anos.', em: { a: [50, 58] }, z: 2.8 },
      { id: 'efl', c: '#A9C54A', t: 'Floresta', d: 'As plantas absorvem CO₂ na fotossíntese e guardam carbono. O desmatamento e as queimadas devolvem esse carbono ao ar.', em: { a: [14, 52] }, z: 2.4 },
      { id: 'egd', c: '#F7C13B', t: 'Gado', d: 'Os bois liberam metano (CH₄) na digestão. Por molécula, o CH₄ retém muito mais calor que o CO₂.', em: { a: [84, 70] }, z: 2.8 },
      { id: 'eca', c: '#8FD8FF', t: 'Estrada', d: 'Carros e caminhões movidos a combustível fóssil emitem CO₂ em cada trajeto.', em: { a: [50, 80] }, z: 2.6 }
    ],
    VAI: { esol: 0, egz: 3, efa: 4, eca: 4, egd: 5, efl: 5 },
    ET: [
      { id: 'luz', nome: 'Luz do Sol', vista: 'a', P: [[21.3, 25.4], [30, 38], [42, 52], [54, 65], [60, 71]], dur: 5, f: [[0, 'luz']], ppm: 280, tmp: 0, proc: 'Radiação solar', pc: '#FFD43B',
        cap: 'A <b>luz do Sol</b> atravessa a atmosfera quase sem ser absorvida pelos gases e chega à superfície.' },
      { id: 'solo', nome: 'Solo aquece', vista: 'a', P: [[60, 71], [60.8, 71.4], [61.4, 71]], dur: 4, f: [[0, 'luz'], [.35, 'calor']], ppm: 280, tmp: 0, proc: 'Aquecimento', pc: '#FF9A4A', parado: 1,
        cap: 'A luz <b>aquece</b> o solo, a água e as plantas. A superfície aquecida passa a emitir calor.' },
      { id: 'ir', nome: 'Infravermelho', vista: 'a', P: [[61.4, 71], [62.5, 58], [63.8, 45], [65, 34], [66, 25]], dur: 5, f: [[0, 'ir']], ppm: 280, tmp: 0, proc: 'Infravermelho', pc: '#FF6B5A',
        cap: 'A superfície devolve a energia como <b>calor</b>, na forma de radiação <b>infravermelha</b>, que sobe em direção ao espaço.' },
      { id: 'gases', nome: 'Gases seguram', vista: 'a', P: [[66, 25], [68.5, 23.5], [70.5, 30], [72.5, 44], [74, 58], [75, 68]], dur: 6, f: [[0, 'ir']], ppm: 280, tmp: 0, proc: 'Efeito estufa natural', pc: '#FFA94D',
        cap: 'Gases como CO₂, metano (CH₄) e vapor de água <b>absorvem parte do infravermelho</b> e o devolvem à superfície. É o efeito estufa natural: mantém a Terra em cerca de 15 °C. Sem ele, seriam cerca de −18 °C.' },
      { id: 'queima', nome: 'Queima', vista: 'a', P: [[47.4, 48.5], [49, 42], [52, 36], [56, 31], [60, 27.5], [64, 25.5]], dur: 6, f: [[0, 'co2']], ppm: 420, tmp: .6, proc: 'Mais CO₂', pc: '#F28B8B',
        cap: 'A queima de carvão, petróleo e gás em fábricas, usinas e veículos lança <b>CO₂</b>. Desde a Revolução Industrial, o CO₂ do ar subiu de cerca de 280 para cerca de 420 ppm.' },
      { id: 'gado', nome: 'Gado e queimadas', vista: 'a', P: [[84, 67], [83, 58], [81, 47], [78, 36], [74, 28]], dur: 6, f: [[0, 'ch4']], ppm: 420, tmp: 1, proc: 'Mais CH₄ e CO₂', pc: '#F7C13B',
        cap: 'O <b>gado</b> libera metano (CH₄) na digestão, e o <b>desmatamento</b> e as queimadas devolvem CO₂ ao ar. Com mais gases, mais calor volta à superfície: em 2025, a Terra estava cerca de 1,4 °C mais quente que antes da indústria.' }
    ],
    alvo(e) { return this.ET[e].tmp; },
    medidor(X, x, y, w, comp, c) {
      const et = c.et, k = c.v.mv;
      txt(X, 'CO₂ no ar', x, y + 6, { s: comp ? 13 : 14 });
      txt(X, 'cerca de ' + et.ppm + ' ppm', x + w, y + 6, { s: 12, c: et.ppm > 300 ? VERM : DIM, a: 'right' });
      const ppmV = lerp(280, 420, cl(k / .6, 0, 1));
      ppmBar(X, x, y + (comp ? 22 : 26), w, true, ppmV, 250, 450, [[280], [420]]);
      const ty = y + (comp ? 46 : 54);
      txt(X, 'Temperatura', x, ty, { s: comp ? 13 : 14 });
      const tt = k < .05 ? ['cerca de 15 °C', DIM] : k < .95 ? ['subindo', AMB] : ['cerca de 1,4 °C a mais', VERM];
      txt(X, tt[0], x + w, ty, { s: 12, c: tt[1], a: 'right' });
      const by = ty + 12, bh = 8; X.fillStyle = 'rgba(255,255,255,.12)'; X.beginPath(); X.roundRect(x, by, w, bh, 4); X.fill();
      const g = X.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#E8A04A'); g.addColorStop(1, '#E0503C'); X.fillStyle = g; X.beginPath(); X.roundRect(x, by, w * (.5 + .4 * k), bh, 4); X.fill();
    },
    fundo(X, R, t, c) {
      const e = c.v.e, s = cl(R.s * .62, 3.2, 6.4);
      // camada de gases: mais densa com mais CO₂ e CH₄
      const f = e >= 5 ? 1 : e === 4 ? .5 + .5 * sst(0, .8, c.u) : 0;
      X.save(); X.beginPath(); for (let x = 0; x <= 100; x += 4) { const p = R.pt(x, hazeY(x) + 1); x ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]); }
      X.strokeStyle = `rgba(255,170,90,${.1 + .25 * f})`; X.lineWidth = R.s * 4; X.lineCap = 'round'; X.stroke(); X.restore();
      const nC = 6 + Math.round(8 * f), nM = 2 + (e >= 5 ? Math.round(5 * (e === 5 ? sst(0, .8, c.u) : 1)) : 0);
      for (let i = 0; i < nC + nM; i++) { const x = 4 + hash(i, 21) * 92 + Math.sin(t * .2 + i) * 1.2, y = hazeY(x) - 1.5 + hash(i, 22) * 4, p = R.pt(x, y); (i < nC ? FORMA.co2 : FORMA.ch4).g(X, p[0], p[1], s, t + i, .8); }
      // luz que desce do Sol (sempre fraca; forte na primeira etapa)
      GCH.forEach((g, i) => { const u = RED ? (i + .5) / GCH.length : (t * .18 + i / GCH.length) % 1, p = R.pt(lerp(21.3, g[0], u), lerp(25.4, g[1], u)); brilho(X, p[0], p[1], R.s * 1.4, '#FFD95A', (e === 0 ? .8 : .35) * Math.sin(u * PI)); });
      if (e >= 1) { const p = R.pt(61, 71); brilho(X, p[0], p[1], R.s * (5 + 2 * (e === 1 ? c.u : 1)), '#FF8A4A', .45); }
      // infravermelho: sobe; a partir da etapa dos gases, uma fração volta (maior com mais gases)
      if (e >= 2) {
        const fv = e < 3 ? 0 : e === 3 ? .3 : e === 4 ? .45 : .6, n = 7;
        for (let i = 0; i < n; i++) {
          const g = GCH[i], volta = hash(i, 9) < fv, u = RED ? (i * .37) % 1 : (t * .15 + i / n) % 1, yh = hazeY(g[0]) + 2;
          let y, xx = g[0], a = .8;
          if (volta) { if (u < .5) y = lerp(g[1] - 4, yh, u / .5); else { y = lerp(yh, g[1] - 2, (u - .5) / .5); xx += (u - .5) * 6; } }
          else { y = lerp(g[1] - 4, 2, u); a *= u > .75 ? 1 - (u - .75) / .25 : 1; }
          const p = R.pt(xx, y); onda(X, p[0], p[1], s * .9, volta && u > .5 ? '#FF5A4A' : '#FF8A7A', t + i, a * .8);
        }
      }
    }
  });

  // =====================================================================================
  // EUTROFIZAÇÃO
  // =====================================================================================
  viagem({
    K: 'impactos/eutrofizacao', pref: 'ecologia', nome: 'Eutrofização: a viagem do fosfato', cor: '#A9C54A', rotForma: 'O que viaja agora',
    rotNav: 'Viagem do fosfato: etapas',
    vistas: [
      ['a', 'impactos-eutrofizacao-a', 'Lago com algas', 'Lago coberto por floração de algas verdes, com peixes mortos na superfície'],
      ['b', 'impactos-eutrofizacao-b', 'Esgoto no rio', 'Tubulação lançando esgoto sem tratamento em um rio urbano']
    ],
    hs: [
      { id: 'lfl', c: '#A9C54A', t: 'Floração de algas', d: 'O excesso de nitrogênio e fósforo faz algas e cianobactérias se multiplicarem e cobrirem a água.', em: { a: [23, 52] }, z: 2.6 },
      { id: 'lsu', c: '#CFE0FF', t: 'Camada na superfície', d: 'A camada verde bloqueia a luz. As plantas e algas do fundo morrem, e a produção de oxigênio cai.', em: { a: [62, 53] }, z: 2.6 },
      { id: 'lpe', c: '#F28B8B', t: 'Peixes mortos', d: 'Bactérias aeróbias decompõem as algas mortas e gastam o oxigênio da água. Os peixes morrem por falta de oxigênio.', em: { a: [36, 74] }, z: 3 },
      { id: 'lma', c: '#FFA94D', t: 'Margem do lago', d: 'Adubos e esgoto chegam ao lago pela margem e pelo escoamento da chuva. A fonte dos nutrientes quase sempre é humana.', em: { a: [86, 42] }, z: 2.4 },
      { id: 'etu', c: '#F7C13B', t: 'Saída do esgoto', d: 'Esgoto sem tratamento leva matéria orgânica, fósforo e nitrogênio. É causa de eutrofização artificial e de rios poluídos.', em: { b: [70, 42] }, z: 2.8 },
      { id: 'ees', c: '#8FD8FF', t: 'Esgoto escuro e espuma', d: 'A matéria orgânica é decomposta e consome oxigênio. A demanda bioquímica de oxigênio (DBO) sobe, e a vida aquática sofre.', em: { b: [39, 74] }, z: 3 },
      { id: 'eri', c: '#CFE0FF', t: 'Rio turvo', d: 'A água fica turva e com cheiro forte. Tratar o esgoto, o saneamento básico, é a medida que mais reduz o problema.', em: { b: [16, 48] }, z: 2.4 },
      { id: 'eca', c: '#FFA94D', t: 'Casas na margem', d: 'Cidades sem rede de esgoto tratada despejam resíduos no rio. A saúde e o ambiente dependem do saneamento.', em: { b: [31, 19] }, z: 2.4 },
      { id: 'eli', c: '#A9C54A', t: 'Lixo e resíduos', d: 'Lixo e plástico se juntam ao esgoto na margem e poluem a água e prejudicam os seres do rio.', em: { b: [75, 78] }, z: 2.6 }
    ],
    VAI: { etu: 0, ees: 0, eri: 0, eca: 0, eli: 0, lma: 1, lfl: 2, lsu: 3, lpe: 5 },
    ET: [
      { id: 'esgoto', nome: 'Esgoto no rio', vista: 'b', P: [[66, 43], [65, 52], [62, 60], [56, 68], [46, 73], [34, 78], [22, 82]], dur: 6, f: [[0, 'po4']], o2: 8, proc: 'Esgoto e adubos', pc: '#F7C13B',
        cap: 'Esgoto sem tratamento e adubos levados pela chuva carregam <b>fosfato</b> e <b>nitrato</b> para rios e lagos.' },
      { id: 'chega', nome: 'No lago', vista: 'a', P: [[90, 44], [80, 45], [70, 47], [60, 50], [50, 53], [42, 55]], dur: 6, f: [[0, 'po4']], o2: 8, proc: 'Excesso de nutrientes', pc: '#FFA94D',
        cap: 'Os nutrientes chegam ao <b>lago</b>. O fósforo e o nitrogênio costumam ser o que limita o crescimento das algas: com eles de sobra, esse freio some.' },
      { id: 'algas', nome: 'Floração', vista: 'a', P: [[42, 55], [36, 56], [30, 56.5], [25, 55]], dur: 7, f: [[0, 'po4'], [.4, 'alga']], o2: 8, proc: 'Floração', pc: '#A9C54A',
        cap: 'Com nutriente de sobra, algas e cianobactérias se multiplicam na superfície: é a <b>floração</b>. O fosfato vira parte das algas, e a água fica verde.' },
      { id: 'luz', nome: 'Sombra no fundo', vista: 'a', P: [[25, 55], [22, 53], [19, 51]], dur: 6, f: [[0, 'alga']], o2: 6, proc: 'Sombra no fundo', pc: '#CFE0FF',
        cap: 'A camada de algas na superfície <b>barra a luz</b>. Plantas e algas do fundo param de fazer fotossíntese e morrem, e a produção de oxigênio cai.' },
      { id: 'decomp', nome: 'Decomposição', vista: 'a', P: [[19, 51], [20, 58], [23, 66], [27, 74]], dur: 7, f: [[0, 'alga'], [.2, 'morta']], o2: 2.5, proc: 'Decomposição aeróbia', pc: '#C9A27A',
        cap: 'As algas morrem em massa e afundam. <b>Bactérias decompositoras aeróbias</b> se multiplicam e gastam o <b>oxigênio dissolvido</b> na água.' },
      { id: 'peixes', nome: 'Peixes morrem', vista: 'a', P: [[27, 74], [31, 74.5], [35, 74]], dur: 5, f: [[0, 'morta']], o2: 1, proc: 'Falta de oxigênio', pc: '#F28B8B',
        cap: 'Sem oxigênio, os <b>peixes morrem</b>. Eles não morrem envenenados pelas algas: morrem porque as bactérias gastaram o O₂. Restam bactérias anaeróbias, que liberam gás sulfídrico, de mau cheiro.' }
    ],
    alvo(e) { return this.ET[e].o2; },
    medidor(X, x, y, w, comp, c) {
      const o = c.v.mv;
      txt(X, comp ? 'O₂ dissolvido' : 'O₂ dissolvido no lago', x, y + 6, { s: comp ? 13 : 14 });
      const st = o > 5 ? ['bom para peixes', VERDE] : o >= 2 ? ['baixo', AMB] : ['crítico', VERM];
      txt(X, st[0], x + w, y + 6, { s: 12, c: st[1], a: 'right' });
      const by = y + (comp ? 22 : 26), bh = comp ? 8 : 10;
      X.fillStyle = 'rgba(255,255,255,.12)'; X.beginPath(); X.roundRect(x, by, w, bh, bh / 2); X.fill();
      X.fillStyle = o > 5 ? '#5FB3D9' : o >= 2 ? '#E0A040' : '#E0605C'; X.beginPath(); X.roundRect(x, by, Math.max(bh, w * o / 10), bh, bh / 2); X.fill();
      txt(X, 'cerca de ' + (Math.round(o * 2) / 2).toString().replace('.', ',') + ' mg/L', x, by + bh + 13, { s: comp ? 11 : 12, c: DIM, w: 500 });
      if (!comp) txt(X, 'abaixo de 2 mg/L, quase nenhum peixe resiste', x, by + bh + 32, { s: 11, c: DIM, w: 500 });
    },
    fundo(X, R, t, c) {
      const e = c.v.e, s = cl(R.s * .55, 3, 5.6);
      if (R.vista === 'b') {
        for (let i = 0; i < 10; i++) {
          const u = RED ? (i + .5) / 10 : (t * .12 + i / 10) % 1, P = [[66, 44], [63, 58], [56, 68], [44, 74], [30, 79], [14, 84]];
          const k = u * (P.length - 1), j = Math.min(P.length - 2, Math.floor(k)), f = k - j, p = R.pt(lerp(P[j][0], P[j + 1][0], f) + Math.sin(i * 3) * 2, lerp(P[j][1], P[j + 1][1], f) + Math.cos(i * 2) * 1.5);
          (i % 2 ? FORMA.no3 : FORMA.po4).g(X, p[0], p[1], s, t + i, Math.sin(PI * u) * .9);
        }
        return;
      }
      // véu verde e escuro na água: floração e sombra
      const verde = e >= 2 ? (e === 2 ? sst(0, .9, c.u) : 1) : 0, escuro = e >= 3 ? (e === 3 ? sst(.1, .9, c.u) : 1) : 0;
      if (verde > 0) for (let i = 0; i < 46; i++) {
        const x = 4 + hash(i, 31) * 70, y = 36 + hash(i, 32) * 30; if (hash(i, 33) > verde) continue;
        const p = R.pt(x + Math.sin(t * .3 + i) * .6, y); celula(X, p[0], p[1], s, e < 4, .9);
      }
      if (escuro > 0) { const a = R.pt(0, 58), b = R.pt(100, 100), g = X.createLinearGradient(0, a[1], 0, b[1]); g.addColorStop(0, 'rgba(6,10,18,0)'); g.addColorStop(1, `rgba(6,10,18,${.55 * escuro})`); X.fillStyle = g; X.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); }
      // raios de luz entrando na água: somem com a floração
      for (let i = 0; i < 4; i++) {
        const x = 12 + i * 18, a = R.pt(x, 34), b = R.pt(x - 3, lerp(92, 52, escuro)), al = .35 * (1 - .85 * escuro);
        const g = X.createLinearGradient(a[0], a[1], b[0], b[1]); g.addColorStop(0, `rgba(255,236,170,${al})`); g.addColorStop(1, 'rgba(255,236,170,0)');
        X.strokeStyle = g; X.lineWidth = R.s * 1.6; X.lineCap = 'round'; X.beginPath(); X.moveTo(a[0], a[1]); X.lineTo(b[0], b[1]); X.stroke();
      }
      // nutrientes que chegam pela margem
      if (e === 1 || e === 2) for (let i = 0; i < 6; i++) { const u = RED ? (i + .5) / 6 : (t * .14 + i / 6) % 1, p = R.pt(lerp(92, 30 + i * 4, u), lerp(43 + i * .6, 50 + i * 1.2, u)); (i % 2 ? FORMA.no3 : FORMA.po4).g(X, p[0], p[1], s, t + i, Math.sin(PI * u) * .85); }
      // bolhas de O₂: muitas no começo, quase nenhuma no fim
      const nb = Math.round(c.v.mv * 1.2);
      for (let i = 0; i < nb; i++) { const u = RED ? (i + .5) / nb : (t * .2 + i / nb) % 1, p = R.pt(8 + hash(i, 41) * 60, lerp(80, 40, u)); X.beginPath(); X.arc(p[0], p[1], s * .55, 0, TAU); X.strokeStyle = `rgba(200,235,255,${.7 * Math.sin(PI * u)})`; X.lineWidth = 1.2; X.stroke(); }
      // bactérias decompositoras se multiplicam
      if (e >= 4) { const n = e === 4 ? Math.round(24 * sst(0, .9, c.u)) : 24; for (let i = 0; i < n; i++) { const a = i * 2.2 + (RED ? 0 : t * .4), p = R.pt(10 + hash(i, 51) * 60 + Math.cos(a) * .6, 62 + hash(i, 52) * 26); X.save(); X.translate(p[0], p[1]); X.rotate(a); X.beginPath(); X.roundRect(-s * 1.1, -s * .42, s * 2.2, s * .84, s * .42); X.fillStyle = 'rgba(255,222,170,.95)'; X.fill(); X.strokeStyle = 'rgba(40,30,20,.8)'; X.lineWidth = 1; X.stroke(); X.restore(); } if (e === 4) pastilha(X, R.pt(46, 92)[0], R.pt(46, 92)[1], 'bactérias aeróbias gastam O₂', '#C9A27A', { c: 1 }); }
      if (e === 5) [[36, 73.5], [57, 68], [48.5, 64.5]].forEach((q, i) => { const p = R.pt(q[0], q[1]), u = RED ? .5 : (t * .5 + i * .3) % 1; X.beginPath(); X.arc(p[0], p[1], R.s * (2 + 3 * u), 0, TAU); X.strokeStyle = `rgba(255,122,122,${.8 * (1 - u)})`; X.lineWidth = 2; X.stroke(); });
    }
  });

  // o motor fica disponível para cenas-figura-ciclos2.js (água, magnificação e chuva ácida): mesma barra de etapas e mesmo painel
  window.LAB_ECO_VG = { viagem, FORMA, bola, mol, brilho, txt, pastilha, quebra };
})();
