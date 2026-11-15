/* LAB · Módulo 08 Bioenergética. Motor: canvas 2D, primitivas de desenho, rotas por hash e controles.
   Código da equipe (Apolo). Sem dependências. As cenas ficam em cenas-a.js e cenas-b.js. */
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
  mito: css('--sci-energia', '#F25C3B'), cloro: css('--sci-fotossintese', '#3FBF6A'), grana: css('--sci-grana', '#2A9450'),
  memb: css('--sci-membrana', '#F06AAE'), cito: css('--sci-citoplasma', '#2A1E3D'), parede: css('--sci-parede', '#A9C54A'),
  agua: css('--sci-vacuolo', '#2A9FC9'), creme: css('--sci-ribossomo', '#FFE1A6'), nucleo: css('--sci-nucleo', '#9A6BFF'),
  o: css('--cpk-o', '#FF4D4D'), c: css('--cpk-c', '#9AA3B2'), n: css('--cpk-n', '#4D7DFF'), p: css('--cpk-p', '#FF9A3C'), s: css('--cpk-s', '#F2D24B'),
  h: '#F2F4F8', e: '#FFE066', nad: '#7FB2FF', luz: '#FFE9A8', calor: '#FF8A7A',
  txt: '#E8EDF7', dim: '#9DA9C4', line: '#5B6C99', inter: '#44292F'
};
C.atp = C.p; C.o2 = C.o; C.co2 = C.c; C.glic = C.creme;

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

// partículas
function hplus(x, y, r = 6, a = 1) { X.save(); X.globalAlpha *= a; circ(x, y, r, C.h, 'rgba(11,15,28,.5)', 1); X.strokeStyle = '#0B0F1C'; X.lineWidth = Math.max(1.2, r * .26); X.beginPath(); X.moveTo(x - r * .5, y); X.lineTo(x + r * .5, y); X.moveTo(x, y - r * .5); X.lineTo(x, y + r * .5); X.stroke(); X.restore(); }
function elec(x, y, r = 4.5, a = 1) { X.save(); X.globalAlpha *= a; circ(x, y, r * 2.1, rgba(C.e, .22)); circ(x, y, r, C.e, 'rgba(11,15,28,.5)', 1); X.strokeStyle = '#0B0F1C'; X.lineWidth = 1.3; X.beginPath(); X.moveTo(x - r * .5, y); X.lineTo(x + r * .5, y); X.stroke(); X.restore(); }
function photon(x1, y1, x2, y2, t, a = 1, c = C.luz) { const L = Math.hypot(x2 - x1, y2 - y1), n = Math.max(8, L / 5 | 0), ux = (x2 - x1) / L, uy = (y2 - y1) / L; X.save(); X.globalAlpha *= a; X.beginPath(); for (let i = 0; i <= n; i++) { const d = i / n * (L - 8), w = Math.sin(d * .38 - t * 9) * 4; const px = x1 + ux * d - uy * w, py = y1 + uy * d + ux * w; i ? X.lineTo(px, py) : X.moveTo(px, py); } X.strokeStyle = c; X.lineWidth = 1.8; X.lineJoin = 'round'; X.stroke(); arrowHead(x2, y2, Math.atan2(uy, ux), c, 8); X.restore(); }
function heat(x, y, t, a = 1, k = 0) { X.save(); X.globalAlpha *= a; for (let j = 0; j < 3; j++) { const f = fr(t * .5 + j / 3 + k), ox = (j - 1) * 9; X.globalAlpha = a * Math.sin(f * PI) * .9; X.beginPath(); for (let i = 0; i <= 8; i++) { const yy = y - f * 26 - i * 2.2, xx = x + ox + Math.sin(i * 1.1 + f * 6) * 2.5; i ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } X.strokeStyle = C.calor; X.lineWidth = 1.6; X.stroke(); } X.restore(); }
// cadeia de carbonos (bolinhas cinza ligadas)
function cchain(x, y, n, r = 6, o = {}) { const g = r * 1.9, x0 = x - (n - 1) * g / 2; X.save(); if (o.a != null) X.globalAlpha *= o.a; if (n > 1) line(x0, y, x0 + (n - 1) * g, y, 'rgba(232,237,247,.55)', 2); for (let i = 0; i < n; i++) circ(x0 + i * g, y, r, o.c || C.c, 'rgba(11,15,28,.55)', 1); X.restore(); }
// anel de ciclo com setas, sentido horário
function ring(cx, cy, R, c, n = 6, lw = 3) { circ(cx, cy, R, null, rgba(c, .75), lw); for (let i = 0; i < n; i++) { const a = i / n * TAU + .3; arrowHead(cx + Math.cos(a) * R + Math.cos(a + PI / 2) * 5, cy + Math.sin(a) * R + Math.sin(a + PI / 2) * 5, a + PI / 2, c, 11); } }

// ---------- estruturas reutilizáveis ----------
// faixa de membrana com proteínas embutidas (corte); devolve as bordas
function membrane(x0, x1, ym, mh, c) {
  rr(x0, ym - mh / 2, x1 - x0, mh, 4, rgba(c, .16)); const r = Math.max(2.4, mh * .11), sp = r * 2.5;
  for (let x = x0 + r; x < x1; x += sp) { circ(x, ym - mh / 2 + r, r, rgba(c, .85)); circ(x, ym + mh / 2 - r, r, rgba(c, .85)); line(x, ym - mh / 2 + r * 2, x, ym - 1.5, rgba(c, .4), 1); line(x, ym + 1.5, x, ym + mh / 2 - r * 2, rgba(c, .4), 1); }
  return { top: ym - mh / 2, bot: ym + mh / 2 };
}
function protein(x, y, w, h, c, name, o = {}) {
  const g = X.createLinearGradient(x, y - h / 2, x, y + h / 2); g.addColorStop(0, light(c, .25)); g.addColorStop(1, dark(c, .25));
  rr(x - w / 2, y - h / 2, w, h, Math.min(w, h) * .34, g, 'rgba(11,15,28,.7)', 1.5);
  if (o.glow) { X.save(); X.globalAlpha = o.glow; rr(x - w / 2 - 3, y - h / 2 - 3, w + 6, h + 6, Math.min(w, h) * .4, null, C.luz, 2.5); X.restore(); }
  if (name) tx(name, x, y + (o.dy || 0), { s: 12, w: 700, c: '#0B0F1C', bg: false });
}
// ATP sintase: canal na membrana, haste e cabeça do lado "dir" (+1 = para baixo)
function synthase(x, ym, mh, dir, t, sc = 1) {
  const c = '#FFD9A0', w = 26 * sc, hr = 19 * sc, hy = ym + dir * (mh / 2 + 16 * sc + hr * .6);
  rr(x - w / 2, ym - mh / 2 - 3, w, mh + 6, 7, dark(c, .28), 'rgba(11,15,28,.7)', 1.5);
  for (let i = 0; i < 4; i++) { const k = fr(i / 4 + t * .35); line(x - w / 2 + k * w, ym - mh / 2 - 1, x - w / 2 + k * w, ym + mh / 2 + 1, 'rgba(11,15,28,.45)', 1.5); }
  rr(x - 4 * sc, Math.min(ym + dir * mh / 2, hy), 8 * sc, Math.abs(hy - (ym + dir * mh / 2)), 2, dark(c, .1), 'rgba(11,15,28,.6)', 1);
  circ(x, hy, hr, c, 'rgba(11,15,28,.7)', 1.5);
  for (let i = 0; i < 3; i++) { const a = t * 2.1 + i * TAU / 3; line(x, hy, x + Math.cos(a) * hr * .88, hy + Math.sin(a) * hr * .88, 'rgba(11,15,28,.55)', 1.6); }
  circ(x, hy, hr * .2, '#0B0F1C');
  return { hy, hr };
}
// mitocôndria em corte: cristas são dobras da membrana interna, abertas para o espaço intermembranas
function mito(cx, cy, L, Wd, o = {}) {
  const m = Math.max(6, Wd * .075), n = o.n || 5, free = o.free || 0, iL = L - m * 2, iW = Wd - m * 2, r = iW / 2;
  capsule(cx, cy, L, Wd); X.fillStyle = C.inter; X.fill(); X.strokeStyle = C.mito; X.lineWidth = 2.5; X.stroke();
  capsule(cx, cy, iL, iW); X.fillStyle = '#5A2418'; X.fill();
  X.save(); capsule(cx, cy, iL, iW); X.clip();
  const g = X.createRadialGradient(cx, cy, 4, cx, cy, L / 2); g.addColorStop(0, 'rgba(242,92,59,.34)'); g.addColorStop(1, 'rgba(242,92,59,.12)'); X.fillStyle = g; X.fillRect(cx - L / 2, cy - Wd / 2, L, Wd);
  const xs = cx - iL / 2 + r * .7 + free * iL, xe = cx + iL / 2 - r * .7, cw = Math.max(8, Math.min(18, (xe - xs) / n * .36)), cr = [];
  for (let i = 0; i < n; i++) {
    const x = n > 1 ? lerp(xs, xe, i / (n - 1)) : (xs + xe) / 2, top = i % 2 === 0, dep = iW * (o.dep || .62) * (i === 0 || i === n - 1 ? .82 : 1);
    const y0 = top ? cy - iW / 2 - 4 : cy + iW / 2 + 4, y1 = top ? cy - iW / 2 + dep : cy + iW / 2 - dep;
    rr(x - cw / 2, Math.min(y0, y1), cw, Math.abs(y1 - y0), cw / 2, C.inter, C.mito, 2);
    cr.push({ x, y0: top ? cy - iW / 2 : cy + iW / 2, y1, top, cw });
  }
  X.restore();
  capsule(cx, cy, iL, iW); X.strokeStyle = C.mito; X.lineWidth = 2; X.stroke();
  // reabre a boca de cada crista: o lúmen da crista é contínuo com o espaço intermembranas
  for (const k of cr) { const yy = k.top ? cy - iW / 2 : cy + iW / 2; line(k.x - k.cw / 2 + 1.5, yy, k.x + k.cw / 2 - 1.5, yy, C.inter, 3.5); }
  return { cr, m, iL, iW, xl: cx - iL / 2, xr: cx + iL / 2 };
}
// cloroplasto em corte: dois envoltórios, estroma e grana (pilhas de tilacoides)
function cloro(cx, cy, rx, ry, o = {}) {
  ell(cx, cy, rx, ry, 0, '#12301F', C.cloro, 2.5); ell(cx, cy, rx - 5, ry - 5, 0, 'rgba(63,191,106,.16)', rgba(C.cloro, .7), 1.5);
  const gs = o.grana || [[-.5, -.1], [-.15, .2], [.2, -.15], [.52, .12]], gw = (o.gw || .2) * rx, out = [];
  X.strokeStyle = rgba(C.grana, .9); X.lineWidth = 2;
  for (let i = 0; i < gs.length - 1; i++) { X.beginPath(); X.moveTo(cx + gs[i][0] * rx, cy + gs[i][1] * ry); X.lineTo(cx + gs[i + 1][0] * rx, cy + gs[i + 1][1] * ry); X.stroke(); }
  for (const [u, v] of gs) {
    const x = cx + u * rx, y = cy + v * ry, n = o.n || 5, th = Math.max(4, ry * .085);
    for (let i = 0; i < n; i++) { const yy = y + (i - (n - 1) / 2) * (th + 1.5); rr(x - gw / 2, yy - th / 2, gw, th, th / 2, C.grana, light(C.cloro, .25), 1); }
    out.push({ x, y, w: gw, h: n * (th + 1.5) });
  }
  return out;
}
// folha simples
function leaf(x, y, s, rot, c) { X.save(); X.translate(x, y); X.rotate(rot || 0); X.beginPath(); X.moveTo(-s, 0); X.quadraticCurveTo(0, -s * .75, s, 0); X.quadraticCurveTo(0, s * .75, -s, 0); X.closePath(); X.fillStyle = c || C.cloro; X.fill(); X.strokeStyle = 'rgba(11,15,28,.5)'; X.lineWidth = 1; X.stroke(); line(-s * .85, 0, s * .85, 0, 'rgba(11,15,28,.35)', 1.2); X.restore(); }

// gráfico de linhas; devolve as funções de escala
function graph(G, o) {
  const fx = v => G.x0 + (v - o.x0) / (o.x1 - o.x0) * G.w, fy = v => G.y1 - (v - o.y0) / (o.y1 - o.y0) * G.h;
  rr(G.x0, G.y0, G.w, G.h, 8, 'rgba(19,26,43,.55)', C.line, 1);
  for (const t of o.xt || []) { line(fx(t[0]), G.y0, fx(t[0]), G.y1, 'rgba(91,108,153,.22)', 1); tx(t[1], fx(t[0]), G.y1 + 12, { s: 12, f: FD, w: 500, c: C.dim, bg: false }); }
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
  { id: 'atp', t: 'ATP e energia', c: C.atp },
  { id: 'resp', t: 'Respiração celular', c: C.mito },
  { id: 'ferm', t: 'Fermentação', c: C.creme },
  { id: 'foto', t: 'Fotossíntese', c: C.cloro },
  { id: 'fatores', t: 'Fatores limitantes', c: C.luz },
  { id: 'relacao', t: 'Fotossíntese × respiração', c: C.agua }
];
const SC = {}, ORDER = {};
const RITMO = { l: 'Ritmo', min: .25, max: 2, step: .25, v: 1, f: v => nbr(v, 2) + '×', rate: v => v };
function def(sec, id, o) { const k = sec + '/' + id; o.sec = sec; o.key = k; if (!o.ctl) o.ctl = RITMO; SC[k] = o; (ORDER[sec] = ORDER[sec] || []).push(k); }
const LK = {
  mito: ['Mitocôndria em 3D', '../celula/index.html#mitocondria'], cloro: ['Cloroplasto em 3D', '../celula/index.html#cloroplasto'],
  origem: ['Origem da mitocôndria (endossimbiose)', '../morfofisiologia/index.html#origem/mito'], origemC: ['Origem do cloroplasto', '../morfofisiologia/index.html#origem/cloro'],
  biom: ['Biomoléculas', '../biomoleculas/index.html']
};

// ---------- interface ----------
function LAB8_iniciar() {
  const ST = {}; let cur = null, paused = false, last = performance.now();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('secs').innerHTML = SEC.map(s => `<button type="button" data-s="${s.id}"><i style="background:${s.c}"></i>${s.t}</button>`).join('');
  $('secs').onclick = e => { const b = e.target.closest('button'); if (b) go(ORDER[b.dataset.s][0], true); };
  const fresh = o => ({ ph: paused ? (o.still == null ? 2.5 : o.still) : 0, v: o.ctl.v, dt: 0 });
  function setCtl(o, S) { const c = o.ctl, r = $('ctlR'); r.min = c.min; r.max = c.max; r.step = c.step; r.value = S.v; $('ctlL').textContent = c.l; $('ctlV').textContent = c.f(S.v); r.setAttribute('aria-valuetext', c.f(S.v)); }
  function go(key, force, keepHash) {
    const o = SC[key]; if (!o) return; const re = key === cur; cur = key;
    if (!ST[key] || force || !re) ST[key] = fresh(o); const S = ST[key]; if (o.init) o.init(S);
    const sec = SEC.find(s => s.id === o.sec);
    [...$('secs').children].forEach(b => { const on = b.dataset.s === o.sec; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); if (on && b.scrollIntoView && $('secs').scrollWidth > $('secs').clientWidth) $('secs').scrollLeft = Math.max(0, b.offsetLeft - 24); });
    $('tops').innerHTML = ORDER[o.sec].map((k, i) => `<button type="button" data-k="${k}" class="${k === key ? 'on' : ''}"${k === key ? ' aria-current="true"' : ''}><em>${String(i + 1).padStart(2, '0')}</em><span>${SC[k].t}<small>${SC[k].s}</small></span></button>`).join('');
    $('topL').textContent = `${sec.t}: escolha um tópico`;
    $('iS').textContent = sec.t; $('iD').style.background = o.c; $('iT').textContent = o.t; $('desc').innerHTML = o.d;
    $('enemT').innerHTML = o.enem || ''; $('enem').hidden = !o.enem;
    $('kv').innerHTML = (o.kv || []).map(([a, b]) => `<div>${a}</div><div>${b}</div>`).join(''); $('kv').hidden = !(o.kv && o.kv.length);
    $('links').innerHTML = (o.links || []).map(([t, h]) => `<a class="btn" href="${h}">${t}</a>`).join('');
    $('tagC').style.background = o.c; $('tagT').textContent = o.t; $('ondeV').textContent = o.loc || '';
    cv.setAttribute('aria-label', `Animação: ${o.t}. ${o.alt || o.s}.`); cv.classList.toggle('arr', !!o.drag);
    setCtl(o, S); capLast = null; cap('');
    document.title = `${o.t} · Bioenergética · LAB`;
    if (!keepHash) try { history.replaceState(null, '', '#' + key); } catch (e) { /* file:// em navegadores antigos */ }
  }
  $('tops').onclick = e => { const b = e.target.closest('button'); if (b) go(b.dataset.k, true); };
  $('ctlR').oninput = e => { const o = SC[cur], S = ST[cur]; S.v = +e.target.value; $('ctlV').textContent = o.ctl.f(S.v); e.target.setAttribute('aria-valuetext', o.ctl.f(S.v)); };
  $('lbls').onclick = () => { LB = !LB; $('lbls').setAttribute('aria-pressed', LB); };
  const setP = v => { paused = v; const b = $('pause'); b.title = paused ? 'Reproduzir a animação' : 'Pausar a animação'; b.setAttribute('aria-label', b.title); b.innerHTML = `<svg aria-hidden="true"><use href="#${paused ? 'ui-continuar' : 'ui-pausar'}"/></svg><span class="tx">${paused ? 'Reproduzir' : 'Pausar'}</span>`; };
  $('pause').onclick = () => setP(!paused); if (reduce) setP(true);
  $('reset').onclick = () => go(cur, true);
  const ALL = SEC.flatMap(s => ORDER[s.id] || []); const step = d => go(ALL[(ALL.indexOf(cur) + d + ALL.length) % ALL.length], true);
  $('prev').onclick = () => step(-1); $('next').onclick = () => step(1);
  addEventListener('keydown', e => { if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.altKey || e.ctrlKey || e.metaKey) return; if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
  // arrastar no gráfico muda o valor do controle
  let dragging = false;
  const dragTo = e => { const o = SC[cur]; if (!o.drag) return; const r = cv.getBoundingClientRect(), v = o.drag(e.clientX - r.left, e.clientY - r.top, ST[cur]); if (v == null) return; const c = o.ctl; ST[cur].v = cl(Math.round(v / c.step) * c.step, c.min, c.max); setCtl(o, ST[cur]); };
  cv.addEventListener('pointerdown', e => { if (SC[cur].drag) { dragging = true; try { cv.setPointerCapture(e.pointerId); } catch (err) { /* sem captura */ } dragTo(e); } });
  cv.addEventListener('pointermove', e => { if (dragging) dragTo(e); });
  addEventListener('pointerup', () => { dragging = false; }); addEventListener('pointercancel', () => { dragging = false; });
  const route = keep => { let h = ''; try { h = decodeURIComponent(location.hash.slice(1)); } catch (e) { h = ''; } const k = SC[h] ? h : ORDER[h] ? ORDER[h][0] : null; if (k) { if (k !== cur) go(k, true, keep && k === h); } else if (!cur) go(ALL[0], true); };
  addEventListener('hashchange', () => route(true));
  if (window.ResizeObserver) new ResizeObserver(rs).observe(cv); addEventListener('resize', rs); rs();
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now; const o = SC[cur], S = ST[cur];
    S.dt = paused ? 0 : dt; S.paused = paused; S.ph += S.dt * (o.ctl.rate ? o.ctl.rate(S.v) : 1);
    X.clearRect(0, 0, W, H); LBS = []; X.save();
    try { o.draw.call(o, S.ph, S); } catch (err) { console.error(err); }
    X.restore(); X.globalAlpha = 1; X.setLineDash([]);
    requestAnimationFrame(frame);
  }
  route(false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rs);
  window.LAB8 = { rotas: ALL, ir: k => go(k, true), pausar: setP, estado: () => ({ cur, paused, ph: ST[cur].ph }) };
  requestAnimationFrame(frame);
}
