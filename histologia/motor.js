/* LAB, módulo Histologia. Motor: canvas 2D, primitivas de desenho, rotas por hash e controles.
   Código da equipe (Aurelius), derivado do motor da Embriologia. Sem dependências.
   As cenas ficam em cenas-a.js ... cenas-e.js; cada uma chama def(sec, id, o). */
'use strict';
const TAU = Math.PI * 2, PI = Math.PI;
const $ = id => document.getElementById(id);
const cv = $('cv');
let X = cv.getContext('2d'), W = 600, H = 500, NAR = false, LB = true;

function rs() {
  const d = Math.min(2, window.devicePixelRatio || 1), r = cv.getBoundingClientRect();
  W = Math.max(240, r.width); H = Math.max(240, r.height);
  cv.width = Math.round(W * d); cv.height = Math.round(H * d);
  X.setTransform(d, 0, 0, d, 0, 0); NAR = W < 700;
}

// ---------- cores: fixas por estrutura (guia 2.3), lidas dos tokens do base.css ----------
const css = (n, f) => (getComputedStyle(document.documentElement).getPropertyValue(n).trim() || f);
const C = {
  // coloração HE: hematoxilina (núcleos roxo-azulados) e eosina (citoplasma e fibras em rosa)
  he_nucleo: '#7B5CD6', he_rosa: '#E7A6C4',
  // cor de destaque de cada tecido (roteiros do Taxon e do Sapien)
  epit: '#2FC6C0', conj: '#F2A93B', cart: '#8FB8DE', osso: '#EDE3D1', adip: '#F5D98A',
  sangue: '#E0414F', hemacia: '#F0605D', leuco: '#C9D3F0', plaq: '#D9A0E8',
  musc: '#FF8C7A', neur: '#A276FF', glia: '#8FCB8A',
  // fibras da matriz: colágenas em rosa forte, elásticas amareladas ("fibras amarelas")
  colag: '#F28AA8', elast: '#D6C36A',
  // moléculas e íons (roteiro B): actina azul-claro, miosina vermelha, Ca²⁺ amarelo, Na⁺ laranja, K⁺ roxo-claro, mielina branco-gelo
  actina: '#7CC8FF', miosina: '#E5484D', ca: '#FFD84D', na: '#FF9A3C', k: '#B9A3FF', mielina: '#EEF4FA',
  txt: '#E8EDF7', dim: '#9DA9C4', line: '#5B6C99'
};

// ---------- utilidades ----------
const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
const ss = t => { t = cl(t, 0, 1); return t * t * (3 - 2 * t); };
const seg = (p, a, b) => cl((p - a) / (b - a), 0, 1);
const fr = v => v - Math.floor(v);
function rng(s) { s = s >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function hx(c) { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function rgba(c, a) { const [r, g, b] = hx(c); return `rgba(${r},${g},${b},${a})`; }
function light(c, k = .45) { const [r, g, b] = hx(c); return `rgb(${r + (255 - r) * k | 0},${g + (255 - g) * k | 0},${b + (255 - b) * k | 0})`; }
function dark(c, k = .5) { const [r, g, b] = hx(c); return `rgb(${r * (1 - k) | 0},${g * (1 - k) | 0},${b * (1 - k) | 0})`; }
const nbr = (v, d = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });

// área útil do palco (fora das pastilhas de cima e da legenda de baixo)
function area() {
  const x0 = NAR ? 10 : 28, x1 = W - x0, y0 = NAR ? 46 : 64, y1 = H - (NAR ? 92 : 84);
  return { x0, x1, y0, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}

// ---------- primitivas ----------
function circ(x, y, r, f, s, lw) { X.beginPath(); X.arc(x, y, Math.max(.1, r), 0, TAU); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1; X.stroke(); } }
function ell(x, y, rx, ry, rot, f, s, lw) { X.beginPath(); X.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot || 0, 0, TAU); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1; X.stroke(); } }
function line(x1, y1, x2, y2, s, lw, dash) { X.beginPath(); X.moveTo(x1, y1); X.lineTo(x2, y2); X.strokeStyle = s; X.lineWidth = lw || 1; if (dash) X.setLineDash(dash); X.stroke(); if (dash) X.setLineDash([]); }
function rr(x, y, w, h, r, f, s, lw) { X.beginPath(); X.roundRect(x, y, w, h, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2)); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1; X.stroke(); } }
const FT = "'Atkinson Hyperlegible Next', system-ui, sans-serif", FH = "'Space Grotesk', sans-serif", FD = "'JetBrains Mono', ui-monospace, monospace";
function tx(s, x, y, o = {}) {
  X.font = `${o.w || 400} ${Math.max(12, o.s || 13)}px ${o.f || FT}`; X.textAlign = o.a || 'center'; X.textBaseline = o.b || 'middle';
  if (o.bg !== false) { X.lineWidth = 4; X.lineJoin = 'round'; X.strokeStyle = 'rgba(11,15,28,.9)'; X.strokeText(s, x, y); }
  X.fillStyle = o.c || '#DFE6F5'; X.fillText(s, x, y);
}
function tw(s, size = 13, w = 400, f = FT) { X.font = `${w} ${Math.max(12, size)}px ${f}`; return X.measureText(s).width; }
// texto que quebra em linhas para caber em maxw; devolve a altura usada
function wrapTx(s, x, y, maxw, o = {}) {
  const sz = o.s || 13, w = o.w || 400, f = o.f || FT, lh = o.lh || sz + 4, out = []; let cur = '';
  for (const p of s.split(' ')) { const t = cur ? cur + ' ' + p : p; if (cur && tw(t, sz, w, f) > maxw) { out.push(cur); cur = p; } else cur = t; }
  if (cur) out.push(cur); out.forEach((l, i) => tx(l, x, y + i * lh, Object.assign({ bg: false }, o, { s: sz }))); return out.length * lh;
}
function head(s, x, y, c, a) { tx(s, x, y, { f: FH, s: NAR ? 14 : 16, w: 600, c: c || C.txt, a }); }
// ficha de molécula: pastilha colorida com o nome escrito (cor nunca é a única pista)
function tok(x, y, s, c, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= .02) return 0;
  X.save(); X.globalAlpha *= a; X.font = `700 12px ${FT}`; const w = X.measureText(s).width + 12, h = 20;
  rr(x - w / 2, y - h / 2, w, h, 6, c, 'rgba(11,15,28,.55)', 1);
  X.fillStyle = '#0B0F1C'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(s, x, y + .5); X.restore(); return w;
}
function arrowHead(x, y, ang, c, s = 7) { X.beginPath(); X.moveTo(x, y); X.lineTo(x - Math.cos(ang - .45) * s, y - Math.sin(ang - .45) * s); X.lineTo(x - Math.cos(ang + .45) * s, y - Math.sin(ang + .45) * s); X.closePath(); X.fillStyle = c; X.fill(); }
function arrow(x1, y1, x2, y2, c, lw = 1.5, dash) { line(x1, y1, x2, y2, c, lw, dash); arrowHead(x2, y2, Math.atan2(y2 - y1, x2 - x1), c, 5 + lw * 1.6); }
function qarrow(x1, y1, qx, qy, x2, y2, c, lw = 1.5, dash) { X.beginPath(); X.moveTo(x1, y1); X.quadraticCurveTo(qx, qy, x2, y2); X.strokeStyle = c; X.lineWidth = lw; if (dash) X.setLineDash(dash); X.stroke(); if (dash) X.setLineDash([]); arrowHead(x2, y2, Math.atan2(y2 - qy, x2 - qx), c, 5 + lw * 1.6); }
const qpt = (x1, y1, qx, qy, x2, y2, f) => [(1 - f) * (1 - f) * x1 + 2 * (1 - f) * f * qx + f * f * x2, (1 - f) * (1 - f) * y1 + 2 * (1 - f) * f * qy + f * f * y2];
// ponto em uma linha poligonal, f de 0 a 1
function pth(p, f) {
  f = cl(f, 0, 1); let tot = 0; const L = [];
  for (let i = 1; i < p.length; i++) { const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); L.push(d); tot += d; }
  let d = f * tot; for (let i = 0; i < L.length; i++) { if (d <= L[i] || i === L.length - 1) { const k = L[i] ? d / L[i] : 0; return [lerp(p[i][0], p[i + 1][0], k), lerp(p[i][1], p[i + 1][1], k)]; } d -= L[i]; }
  return p[0];
}
function poly(p, c, lw, dash) { X.beginPath(); p.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.strokeStyle = c; X.lineWidth = lw || 1; X.lineJoin = 'round'; if (dash) X.setLineDash(dash); X.stroke(); if (dash) X.setLineDash([]); }
function ngon(x, y, r, n, rot, f, s, lw) { X.beginPath(); for (let i = 0; i < n; i++) { const a = rot + i / n * TAU; i ? X.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : X.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } X.closePath(); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1.5; X.lineJoin = 'round'; X.stroke(); } }
function capsule(cx, cy, L, Wd) { const r = Wd / 2; X.beginPath(); X.moveTo(cx - L / 2 + r, cy - r); X.lineTo(cx + L / 2 - r, cy - r); X.arc(cx + L / 2 - r, cy, r, -PI / 2, PI / 2); X.lineTo(cx - L / 2 + r, cy + r); X.arc(cx - L / 2 + r, cy, r, PI / 2, PI * 1.5); X.closePath(); }

// rótulos em pastilha com linha-guia (no máximo 5 no celular e 8 no computador, sem sobreposição)
let LBS = [];
function lab(ax, ay, bx, by, s) {
  if (!LB) return; if (LBS.length >= (NAR ? 5 : 8)) return;
  X.font = `600 13px ${FT}`; const pw = X.measureText(s).width + 16, ph = 24; let L = bx < ax - 1;
  if (L && bx - pw < 4) L = false; if (!L && bx + pw > W - 4) L = true;
  bx = cl(bx, L ? pw + 4 : 4, L ? W - 4 : W - pw - 4); by = cl(by, ph / 2 + (NAR ? 44 : 56), H - ph / 2 - (NAR ? 92 : 84)); const rx = L ? bx - pw : bx;
  if (LBS.some(r => rx < r[0] + r[2] + 4 && rx + pw + 4 > r[0] && by - ph / 2 < r[1] + r[3] + 3 && by + ph / 2 + 3 > r[1])) return;
  LBS.push([rx, by - ph / 2, pw, ph]);
  line(ax, ay, bx, by, 'rgba(255,255,255,.6)', 1); circ(ax, ay, 3, '#fff');
  rr(rx, by - ph / 2, pw, ph, 999, 'rgba(11,15,28,.84)', 'rgba(255,255,255,.12)', 1);
  X.fillStyle = C.txt; X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillText(s, rx + 8, by + .5);
}

// anel de ciclo com setas, sentido horário
function ring(cx, cy, R, c, n = 6, lw = 3) { circ(cx, cy, R, null, rgba(c, .75), lw); for (let i = 0; i < n; i++) { const a = i / n * TAU + .3; arrowHead(cx + Math.cos(a) * R + Math.cos(a + PI / 2) * 5, cy + Math.sin(a) * R + Math.sin(a + PI / 2) * 5, a + PI / 2, c, 11); } }

// ---------- estruturas reutilizáveis ----------
// célula com membrana: preenchimento, borda e núcleo opcional (o.n = raio relativo do núcleo)
function cell(x, y, r, c, o = {}) {
  const g = X.createRadialGradient(x - r * .35, y - r * .35, r * .1, x, y, r);
  g.addColorStop(0, light(c, .25)); g.addColorStop(1, dark(c, .12));
  circ(x, y, r, g, o.s || 'rgba(11,15,28,.6)', o.lw || 1.2);
  if (o.n) nuc(x + (o.nx || 0) * r, y + (o.ny || 0) * r, r * o.n, r * o.n);
}
// ---------- ajudantes do estilo HE ----------
// núcleo corado pela hematoxilina: elipse roxo-azulada com grumos de cromatina (o.a = opacidade, o.seed)
function nuc(x, y, rx, ry, rot = 0, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= .02) return;
  X.save(); X.globalAlpha *= a; ell(x, y, rx, ry, rot, o.c || C.he_nucleo, 'rgba(11,15,28,.45)', 1);
  if (Math.min(rx, ry) > 3.5) { const R = rng(o.seed || 5); for (let i = 0; i < 4; i++) { const u = (R() - .5) * 1.1, v = (R() - .5) * 1.1, c = Math.cos(rot), s = Math.sin(rot); circ(x + (u * rx) * c - (v * ry) * s, y + (u * rx) * s + (v * ry) * c, Math.min(rx, ry) * .2, 'rgba(40,20,90,.55)'); } }
  X.restore();
}
// polígono preenchido (célula vista em corte); pts = [[x,y],...]
function shape(pts, f, s, lw) { X.beginPath(); pts.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.closePath(); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1; X.lineJoin = 'round'; X.stroke(); } }
// matriz extracelular em rosa claro com fibras onduladas, dentro do retângulo (o.c cor das fibras, o.n densidade, o.seed, o.a)
function matriz(x0, y0, w, h, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= .02) return;
  X.save(); X.globalAlpha *= a; X.beginPath(); X.rect(x0, y0, w, h); X.clip();
  X.fillStyle = rgba(o.fundo || C.he_rosa, .16); X.fillRect(x0, y0, w, h);
  const R = rng(o.seed || 11), n = Math.round(w * h / 2600 * (o.n == null ? 1 : o.n)), c = o.c || C.colag;
  for (let i = 0; i < n; i++) {
    const x = x0 + R() * w, y = y0 + R() * h, L = 20 + R() * 40, ang = (R() - .5) * 1.2, amp = 2 + R() * 3;
    X.beginPath(); for (let j = 0; j <= 8; j++) { const d = j / 8 * L, q = Math.sin(j * .9 + i) * amp; X.lineTo(x + Math.cos(ang) * d - Math.sin(ang) * q, y + Math.sin(ang) * d + Math.cos(ang) * q); }
    X.strokeStyle = rgba(c, .35 + R() * .3); X.lineWidth = 1.2 + R() * 1.6; X.lineCap = 'round'; X.stroke();
  }
  X.restore();
}
// capilar em corte transversal: anel de endotélio com hemácias dentro
function capilar(x, y, r, o = {}) {
  circ(x, y, r, rgba(C.sangue, .22), rgba(C.he_rosa, .9), Math.max(1.5, r * .18));
  nuc(x + r * .95, y, r * .2, r * .1, PI / 2);
  for (let i = 0; i < (o.n || 2); i++) { const ang = i / (o.n || 2) * TAU + (o.t || 0); ell(x + Math.cos(ang) * r * .35, y + Math.sin(ang) * r * .35, r * .32, r * .24, ang, C.hemacia, 'rgba(11,15,28,.4)', 1); }
}
// lupa: recorta um círculo, desenha fn(cx, cy, r) dentro dele e contorna; ax, ay = ponto do corte de onde a lupa sai
function lupa(cx, cy, r, fn, ax, ay) {
  if (ax != null) line(ax, ay, cx - (cx - ax) * (1 - r / Math.hypot(cx - ax, cy - ay)), cy - (cy - ay) * (1 - r / Math.hypot(cx - ax, cy - ay)), 'rgba(232,237,247,.5)', 1.5, [4, 4]);
  X.save(); X.beginPath(); X.arc(cx, cy, r, 0, TAU); X.clip(); X.fillStyle = '#121a2e'; X.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  try { fn(cx, cy, r); } catch (err) { console.error(err); }
  X.restore(); circ(cx, cy, r, null, 'rgba(232,237,247,.85)', 2.5);
}
// pontos espalhados (grânulos, íons, hormônio) num retângulo
function grains(x0, y0, w, h, c, dens = 1, seed = 7) {
  const R = rng(seed), n = Math.round(w * h / 90 * dens);
  for (let i = 0; i < n; i++) circ(x0 + R() * w, y0 + R() * h, 1 + R() * 1.4, rgba(c, .3 + R() * .3));
}

// gráfico de linhas; devolve as funções de escala
function graph(G, o) {
  const fx = v => G.x0 + (v - o.x0) / (o.x1 - o.x0) * G.w, fy = v => G.y1 - (v - o.y0) / (o.y1 - o.y0) * G.h;
  rr(G.x0, G.y0, G.w, G.h, 8, 'rgba(19,26,43,.55)', C.line, 1);
  for (const t of o.xt || []) { line(fx(t[0]), G.y0, fx(t[0]), G.y1, 'rgba(91,108,153,.22)', 1); const hw = tw(t[1], 12, 500, FD) / 2 + 2; tx(t[1], cl(fx(t[0]), hw, W - hw), G.y1 + 12, { s: 12, f: FD, w: 500, c: C.dim, bg: false }); }
  if (o.y0 < 0) line(G.x0, fy(0), G.x1, fy(0), 'rgba(232,237,247,.6)', 1);
  tx(o.xl, G.x0 + G.w / 2, G.y1 + 30, { s: 13, w: 600, c: C.txt, bg: false });
  X.save(); X.translate(G.x0 - 14, G.y0 + G.h / 2); X.rotate(-PI / 2); tx(o.yl, 0, 0, { s: 13, w: 600, c: C.txt, bg: false }); X.restore();
  X.save(); X.beginPath(); X.rect(G.x0, G.y0, G.w, G.h); X.clip();
  for (const k of o.curves) { X.beginPath(); for (let i = 0; i <= 120; i++) { const v = lerp(o.x0, o.x1, i / 120), px = fx(v), py = fy(k.f(v)); i ? X.lineTo(px, py) : X.moveTo(px, py); } X.strokeStyle = k.c; X.lineWidth = k.lw || 2.5; X.lineJoin = 'round'; if (k.dash) X.setLineDash(k.dash); X.stroke(); X.setLineDash([]); }
  X.restore();
  return { fx, fy, inv: px => cl(o.x0 + (px - G.x0) / G.w * (o.x1 - o.x0), o.x0, o.x1) };
}
function marker(x, y, c) { circ(x, y, 11, rgba(c, .25)); circ(x, y, 6.5, c, '#fff', 2); }
function hbar(x, y, w, h, f, c, name, val) { rr(x, y, w, h, 4, 'rgba(91,108,153,.25)'); if (f > .005) rr(x, y, Math.max(4, w * cl(f, 0, 1)), h, 4, c); tx(name, x, y - 10, { s: 13, w: 600, a: 'left', c: C.txt, bg: false }); if (val) tx(val, x + w, y - 10, { s: 12, f: FD, w: 500, a: 'right', c: C.dim, bg: false }); }

// legenda do passo (HTML, quebra a linha sozinha no celular)
let capLast = null;
function cap(html) { if (html !== capLast) { capLast = html; $('cap').innerHTML = html || ''; } }

// ---------- registro das cenas ----------
const SEC = [
  { id: 'tecidos', t: 'Tecidos', c: C.he_rosa },
  { id: 'epitelial', t: 'Epitelial', c: C.epit },
  { id: 'conjuntivo', t: 'Conjuntivo', c: C.conj },
  { id: 'sangue', t: 'Sangue', c: C.sangue },
  { id: 'muscular', t: 'Muscular', c: C.musc },
  { id: 'nervoso', t: 'Nervoso', c: C.neur }
];
const SC = {}, ORDER = {};
const RITMO = { l: 'Ritmo', min: .25, max: 2, step: .25, v: 1, f: v => nbr(v, 2) + '×', rate: v => v };
function def(sec, id, o) { const k = sec + '/' + id; o.sec = sec; o.key = k; if (o.ctl === false) o.noCtl = true; if (!o.ctl) o.ctl = RITMO; SC[k] = o; (ORDER[sec] = ORDER[sec] || []).push(k); }
const LK = {
  folhetos: ['Folhetos germinativos', '../embriologia/index.html#desenvolvimento/folhetos'],
  juncoes: ['Junções entre células', '../morfofisiologia/index.html#membranas/espec'],
  bomba: ['Bomba de sódio e potássio', '../morfofisiologia/index.html#membranas/bomba'],
  neuronio: ['O neurônio na Célula', '../celula/index.html#neuronio'],
  latica: ['Fermentação lática', '../bioenergetica/index.html#ferm/latica'],
  cadeia: ['Cadeia respiratória', '../bioenergetica/index.html#resp/cadeia'],
  genetica: ['Genética', '../genetica/index.html'],
  celula: ['A célula por dentro', '../celula/index.html']
};

// ---------- interface ----------
function LAB_HISTO_iniciar() {
  const ST = {}; let cur = null, paused = false, last = performance.now();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // seção sem tópicos (arquivo de cenas ainda ausente): botão fica desativado, a página não quebra
  $('secs').innerHTML = SEC.map(s => `<button type="button" data-s="${s.id}"${ORDER[s.id] && ORDER[s.id].length ? '' : ' disabled title="Em breve"'}><i style="background:${s.c}"></i>${s.t}</button>`).join('');
  $('secs').onclick = e => { const b = e.target.closest('button'); if (b && ORDER[b.dataset.s] && ORDER[b.dataset.s].length) go(ORDER[b.dataset.s][0], true); };
  const fresh = o => ({ ph: paused ? (o.still == null ? 2.5 : o.still) : 0, v: paused && o.stillV != null ? o.stillV : o.ctl.v, dt: 0 });
  function setCtl(o, S) { const c = o.ctl, r = $('ctlR'); r.min = c.min; r.max = c.max; r.step = c.step; r.value = S.v; $('ctlL').textContent = c.l; $('ctlV').textContent = c.f(S.v); r.setAttribute('aria-valuetext', c.f(S.v)); }
  function go(key, force, keepHash) {
    const o = SC[key]; if (!o) return; const re = key === cur; cur = key;
    if (!ST[key] || force || !re) ST[key] = fresh(o); const S = ST[key]; if (o.init) try { o.init(S); } catch (err) { console.error(err); }
    const sec = SEC.find(s => s.id === o.sec);
    [...$('secs').children].forEach(b => { const on = b.dataset.s === o.sec; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); if (on && b.scrollIntoView && $('secs').scrollWidth > $('secs').clientWidth) $('secs').scrollLeft = Math.max(0, b.offsetLeft - 24); });
    $('tops').innerHTML = ORDER[o.sec].map((k, i) => `<button type="button" data-k="${k}" class="${k === key ? 'on' : ''}"${k === key ? ' aria-current="true"' : ''}><em>${String(i + 1).padStart(2, '0')}</em><span>${SC[k].t}<small>${SC[k].s}</small></span></button>`).join('');
    $('topL').textContent = `${sec.t}: escolha um tópico`;
    $('iS').textContent = sec.t; $('iD').style.background = o.c || sec.c; $('iT').textContent = o.t; $('desc').innerHTML = o.d || '';
    $('enemT').innerHTML = o.enem || ''; $('enem').hidden = !o.enem;
    $('kv').innerHTML = (o.kv || []).map(([a, b]) => `<div>${a}</div><div>${b}</div>`).join(''); $('kv').hidden = !(o.kv && o.kv.length);
    $('links').innerHTML = (o.links || []).map(([t, h]) => `<a class="btn" href="${h}">${t}</a>`).join('');
    $('tagC').style.background = o.c || sec.c; $('tagT').textContent = o.t; $('ondeV').textContent = o.loc || '';
    cv.setAttribute('aria-label', `Animação: ${o.t}. ${o.alt || o.s}.`); cv.classList.toggle('arr', !!o.drag);
    setCtl(o, S); $('ctlR').parentNode.hidden = !!o.noCtl; capLast = null; cap('');
    // botões extras do tópico: o.extra = [{ t, on(S), pressed(S) }]
    $('extra').innerHTML = (o.extra || []).map((b, i) => `<button type="button" data-i="${i}" aria-pressed="${b.pressed ? !!b.pressed(S) : false}">${b.t}</button>`).join('');
    document.title = `${o.t} | Histologia | LAB`;
    if (!keepHash) try { history.replaceState(null, '', '#' + key); } catch (e) { /* file:// em navegadores antigos */ }
  }
  $('tops').onclick = e => { const b = e.target.closest('button'); if (b) go(b.dataset.k, true); };
  $('ctlR').oninput = e => { const o = SC[cur], S = ST[cur]; S.v = +e.target.value; S.touch = performance.now(); $('ctlV').textContent = o.ctl.f(S.v); e.target.setAttribute('aria-valuetext', o.ctl.f(S.v)); };
  $('extra').onclick = e => { const b = e.target.closest('button'); if (!b) return; const o = SC[cur], S = ST[cur], x = o.extra[+b.dataset.i]; try { x.on(S); } catch (err) { console.error(err); } [...$('extra').children].forEach((el, i) => { const y = o.extra[i]; el.setAttribute('aria-pressed', y.pressed ? !!y.pressed(S) : false); }); };
  $('lbls').onclick = () => { LB = !LB; $('lbls').setAttribute('aria-pressed', LB); };
  const setP = v => { paused = v; const b = $('pause'); b.title = paused ? 'Reproduzir a animação' : 'Pausar a animação'; b.setAttribute('aria-label', b.title); b.innerHTML = `<svg aria-hidden="true"><use href="#${paused ? 'ui-continuar' : 'ui-pausar'}"/></svg><span class="tx">${paused ? 'Reproduzir' : 'Pausar'}</span>`; };
  $('pause').onclick = () => setP(!paused); if (reduce) setP(true);
  $('reset').onclick = () => go(cur, true);
  const ALL = SEC.flatMap(s => ORDER[s.id] || []); const step = d => ALL.length && go(ALL[(ALL.indexOf(cur) + d + ALL.length) % ALL.length], true);
  $('prev').onclick = () => step(-1); $('next').onclick = () => step(1);
  addEventListener('keydown', e => { if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.altKey || e.ctrlKey || e.metaKey) return; if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
  // arrastar no gráfico muda o valor do controle
  let dragging = false;
  const dragTo = e => { const o = SC[cur]; if (!o.drag) return; const r = cv.getBoundingClientRect(), v = o.drag(e.clientX - r.left, e.clientY - r.top, ST[cur]); if (v == null) return; const c = o.ctl; ST[cur].v = cl(Math.round(v / c.step) * c.step, c.min, c.max); setCtl(o, ST[cur]); };
  cv.addEventListener('pointerdown', e => { if (SC[cur] && SC[cur].drag) { dragging = true; try { cv.setPointerCapture(e.pointerId); } catch (err) { /* sem captura */ } dragTo(e); } });
  cv.addEventListener('pointermove', e => { if (dragging) dragTo(e); });
  addEventListener('pointerup', () => { dragging = false; }); addEventListener('pointercancel', () => { dragging = false; });
  const route = keep => { let h = ''; try { h = decodeURIComponent(location.hash.slice(1)); } catch (e) { h = ''; } const k = SC[h] ? h : (ORDER[h] && ORDER[h].length) ? ORDER[h][0] : null; if (k) { if (k !== cur) go(k, true, keep && k === h); } else if (!cur && ALL.length) go(SC['tecidos/visao'] ? 'tecidos/visao' : ALL[0], true); };
  addEventListener('hashchange', () => route(true));
  if (window.ResizeObserver) new ResizeObserver(rs).observe(cv); addEventListener('resize', rs); rs();
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now; const o = SC[cur], S = ST[cur];
    if (!o) { requestAnimationFrame(frame); return; }
    S.dt = paused ? 0 : dt; S.paused = paused; S.ph += S.dt * (o.ctl.rate ? o.ctl.rate(S.v) : 1);
    // o.auto (unidades por segundo, ou função de S que devolve isso): a faixa anda sozinha, para 1,5 s no fim e recomeça; espera 4 s depois de a pessoa mexer
    const au = typeof o.auto === 'function' ? o.auto(S) : o.auto;
    if (au && !paused && !dragging && (!S.touch || now - S.touch > 4000)) {
      const c = o.ctl; S.v += dt * au;
      if (S.v >= c.max) { S.v = c.max; S.hold = (S.hold || 0) + dt; if (S.hold > 1.5) { S.v = c.min; S.hold = 0; } }
      setCtl(o, S);
    }
    X.clearRect(0, 0, W, H); LBS = []; X.save();
    try { o.draw.call(o, S.ph, S); } catch (err) { console.error(err); }
    X.restore(); X.globalAlpha = 1; X.setLineDash([]);
    requestAnimationFrame(frame);
  }
  route(false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rs);
  window.LAB_HISTO = { rotas: ALL, ir: k => go(k, true), pausar: setP, estado: () => ({ cur, paused, ph: cur ? ST[cur].ph : 0 }) };
  requestAnimationFrame(frame);
}
