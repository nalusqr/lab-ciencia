/* LAB, módulo Origem da vida e evolução. Motor (copiado do módulo Anatomia): canvas 2D, primitivas de desenho, texto com itálico, ícones de seres vivos,
   cartões para classificar, rotas por hash e controles. Ajudantes próprios da evolução (régua do tempo geológico, alelos, curva em sino) ficam no fim das primitivas.
   Código da equipe (Aurelius). Sem dependências. As cenas ficam em cenas-o.js (origem, ideias, evidências) e cenas-s.js (teoria sintética a evolução humana);
   cada uma chama def(sec, id, o). */
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

// ---------- cores: fixas por significado (guia 2.3; proposta de cores do roteiro do Taxon) ----------
const C = {
  // partícula viral: capsídeo cinza-prata (a cor do vírus no site), envelope rosa (vem da membrana da célula),
  // espículas âmbar (glicoproteínas que se encaixam nos receptores), receptores da célula em azul-gelo
  virus: '#B9C2D3', capsideo: '#B9C2D3', envelope: '#F06AAE', espicula: '#F7C13B', receptor: '#7CC4FF',
  // ácidos nucleicos: DNA violeta (o do site), RNA coral; DNA do fago claro e da bactéria escuro (F1, F2, R2)
  dna: '#9A6BFF', dnaClaro: '#C9B2FF', dnaEscuro: '#6A45D8', rna: '#FF8A6B',
  // células e organelas (paleta científica do guia)
  membrana: '#F06AAE', citoplasma: '#2A1E3D', nucleo: '#9A6BFF', ribo: '#FFE1A6', parede: '#A9C54A', bacteria: '#A9C54A',
  hemacia: '#D7303B', plasmideo: '#F7C13B', monera: '#7FB2E5', proto: '#C58BE8', fungi: '#D9A066', pele: '#F28C3A',
  // vias de transmissão (D1 a D4 e P2): uma cor por via
  vetor: '#9FD84A', resp: '#5AA9FF', sangue: '#F0605D', fecal: '#C08A5A', mordida: '#C58BE8',
  // imunidade: anticorpo (Y) e vacina
  anticorpo: '#CFE0FF', vacina: '#2FCFBF', soro: '#FF9A3C',
  // apoio
  ok: '#6BCB77', erro: '#F0605D', txt: '#E8EDF7', dim: '#9DA9C4', line: '#5B6C99', amber: '#FFB347'
};
// vias de transmissão, na ordem do roteiro (P2): [id, nome, cor]
const VIAS = [['resp', 'respiratória', C.resp], ['fecal', 'fecal-oral (água e alimento)', C.fecal], ['pele', 'pela pele (solo, água ou ferimento)', C.pele], ['sangue', 'sangue e sexual', C.sangue], ['vetor', 'vetor', C.vetor]];
const VIA = Object.fromEntries(VIAS.map(v => [v[0], { n: v[1], c: v[2] }]));

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
function mix(a, b, k) { const A = hx(a), B = hx(b); return '#' + [0, 1, 2].map(i => Math.round(A[i] + (B[i] - A[i]) * cl(k, 0, 1)).toString(16).padStart(2, '0')).join(''); }
const nbr = (v, d = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
const semTag = s => String(s || '').replace(/<[^>]+>/g, '');

// área útil do palco (fora das pastilhas de cima e da legenda de baixo)
function area() {
  const x0 = NAR ? 10 : 28, x1 = W - x0, y0 = NAR ? 46 : 64, y1 = H - (NAR ? 92 : 84);
  return { x0, x1, y0, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}

// ---------- primitivas ----------
function circ(x, y, r, f, s, lw) { X.beginPath(); X.arc(x, y, Math.max(.1, r), 0, TAU); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1; X.stroke(); } }
function ell(x, y, rx, ry, rot, f, s, lw) { X.beginPath(); X.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot || 0, 0, TAU); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1; X.stroke(); } }
function line(x1, y1, x2, y2, s, lw, dash) { X.beginPath(); X.moveTo(x1, y1); X.lineTo(x2, y2); X.strokeStyle = s; X.lineWidth = lw || 1; if (dash) X.setLineDash(dash); X.stroke(); if (dash) X.setLineDash([]); }
function rr(x, y, w, h, r, f, s, lw) { X.beginPath(); X.roundRect(x, y, w, h, Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2))); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1; X.stroke(); } }
function shape(pts, f, s, lw) { X.beginPath(); pts.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.closePath(); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1; X.lineJoin = 'round'; X.stroke(); } }
function poly(p, c, lw, dash) { X.beginPath(); p.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.strokeStyle = c; X.lineWidth = lw || 1; X.lineJoin = 'round'; if (dash) X.setLineDash(dash); X.stroke(); if (dash) X.setLineDash([]); }
function ngon(x, y, r, n, rot, f, s, lw) { X.beginPath(); for (let i = 0; i < n; i++) { const a = rot + i / n * TAU; i ? X.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : X.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } X.closePath(); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1.5; X.lineJoin = 'round'; X.stroke(); } }
function arrowHead(x, y, ang, c, s = 7) { X.beginPath(); X.moveTo(x, y); X.lineTo(x - Math.cos(ang - .45) * s, y - Math.sin(ang - .45) * s); X.lineTo(x - Math.cos(ang + .45) * s, y - Math.sin(ang + .45) * s); X.closePath(); X.fillStyle = c; X.fill(); }
function arrow(x1, y1, x2, y2, c, lw = 1.5, dash) { line(x1, y1, x2, y2, c, lw, dash); arrowHead(x2, y2, Math.atan2(y2 - y1, x2 - x1), c, 5 + lw * 1.6); }
function qarrow(x1, y1, qx, qy, x2, y2, c, lw = 1.5, dash) { X.beginPath(); X.moveTo(x1, y1); X.quadraticCurveTo(qx, qy, x2, y2); X.strokeStyle = c; X.lineWidth = lw; if (dash) X.setLineDash(dash); X.stroke(); if (dash) X.setLineDash([]); arrowHead(x2, y2, Math.atan2(y2 - qy, x2 - qx), c, 5 + lw * 1.6); }
const qpt = (x1, y1, qx, qy, x2, y2, f) => [(1 - f) * (1 - f) * x1 + 2 * (1 - f) * f * qx + f * f * x2, (1 - f) * (1 - f) * y1 + 2 * (1 - f) * f * qy + f * f * y2];
function pth(p, f) {
  f = cl(f, 0, 1); let tot = 0; const L = [];
  for (let i = 1; i < p.length; i++) { const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); L.push(d); tot += d; }
  let d = f * tot; for (let i = 0; i < L.length; i++) { if (d <= L[i] || i === L.length - 1) { const k = L[i] ? d / L[i] : 0; return [lerp(p[i][0], p[i + 1][0], k), lerp(p[i][1], p[i + 1][1], k)]; } d -= L[i]; }
  return p[0];
}

// ---------- texto ----------
const FT = "'Atkinson Hyperlegible Next', system-ui, sans-serif", FH = "'Space Grotesk', sans-serif", FD = "'JetBrains Mono', ui-monospace, monospace";
const fnt = (sz, w = 400, f = FT, it = false) => `${it ? 'italic ' : ''}${w} ${Math.max(12, sz)}px ${f}`;
// texto simples; o.i = itálico (nomes científicos de gênero, espécie e subespécie)
function tx(s, x, y, o = {}) {
  X.font = fnt(o.s || 13, o.w || 400, o.f || FT, o.i); X.textAlign = o.a || 'center'; X.textBaseline = o.b || 'middle';
  if (o.bg !== false) { X.lineWidth = 4; X.lineJoin = 'round'; X.strokeStyle = 'rgba(11,15,28,.9)'; X.strokeText(s, x, y); }
  X.fillStyle = o.c || '#DFE6F5'; X.fillText(s, x, y);
}
function tw(s, size = 13, w = 400, f = FT, it = false) { X.font = fnt(size, w, f, it); return X.measureText(s).width; }
// texto com marcação: <i>itálico</i> e <b>negrito</b> (ex.: '<i>Homo sapiens</i> Linnaeus, 1758'); devolve a largura
function parseM(s) {
  const out = []; let it = false, bd = false;
  for (const p of String(s).split(/(<\/?[ib]>)/)) { if (p === '<i>') it = true; else if (p === '</i>') it = false; else if (p === '<b>') bd = true; else if (p === '</b>') bd = false; else if (p) out.push({ s: p, i: it, b: bd }); }
  return out;
}
function mtw(s, sz = 13, w = 400, f = FT) { let t = 0; for (const p of parseM(s)) t += tw(p.s, sz, p.b ? Math.max(700, w) : w, f, p.i); return t; }
function mtx(s, x, y, o = {}) {
  const sz = o.s || 13, w = o.w || 400, f = o.f || FT, parts = parseM(s), tot = mtw(s, sz, w, f);
  let cx = o.a === 'left' ? x : o.a === 'right' ? x - tot : x - tot / 2;
  X.textAlign = 'left'; X.textBaseline = o.b || 'middle';
  for (const p of parts) {
    X.font = fnt(sz, p.b ? Math.max(700, w) : w, f, p.i || o.i);
    if (o.bg !== false) { X.lineWidth = 4; X.lineJoin = 'round'; X.strokeStyle = 'rgba(11,15,28,.9)'; X.strokeText(p.s, cx, y); }
    X.fillStyle = o.c || '#DFE6F5'; X.fillText(p.s, cx, y); cx += X.measureText(p.s).width;
  }
  return tot;
}
// quebra em linhas para caber em maxw (aceita marcação); devolve a altura usada. o.dry = só mede
function wrapTx(s, x, y, maxw, o = {}) {
  const sz = o.s || 13, w = o.w || 400, f = o.f || FT, lh = o.lh || sz + 4, lines = []; let cur = [], it = false, bd = false;
  const words = []; // palavras com o estado de estilo no início
  for (const p of String(s).split(/(<\/?[ib]>|\s+)/)) {
    if (p === '<i>') it = true; else if (p === '</i>') it = false; else if (p === '<b>') bd = true; else if (p === '</b>') bd = false;
    else if (/^\s+$/.test(p)) words.push(null); else if (p) words.push({ s: p, i: it, b: bd });
  }
  // junta pedaços colados (sem espaço) numa só palavra
  const W2 = []; let g = [];
  for (const q of words) { if (q === null) { if (g.length) W2.push(g); g = []; } else g.push(q); }
  if (g.length) W2.push(g);
  const mk = parts => parts.map(p => (p.b ? '<b>' : '') + (p.i ? '<i>' : '') + p.s + (p.i ? '</i>' : '') + (p.b ? '</b>' : '')).join('');
  for (const wd of W2) { const t = cur.concat(cur.length ? [{ s: ' ', i: false, b: false }] : [], wd); if (cur.length && mtw(mk(t), sz, w, f) > maxw) { lines.push(cur); cur = wd.slice(); } else cur = t; }
  if (cur.length) lines.push(cur);
  if (!o.dry) lines.forEach((l, i) => mtx(mk(l), x, y + i * lh, Object.assign({ bg: false }, o, { s: sz })));
  return lines.length * lh;
}
function head(s, x, y, c, a) { mtx(s, x, y, { f: FH, s: NAR ? 14 : 16, w: 600, c: c || C.txt, a }); }
// título que encolhe para caber em maxw
function title(s, x, y, maxw, o = {}) { let sz = o.s || (NAR ? 15 : 17); while (sz > 12 && mtw(s, sz, 600, FH) > maxw) sz--; mtx(s, x, y, Object.assign({ f: FH, s: sz, w: 600, c: C.txt }, o, { s: sz })); }
// ficha: pastilha colorida com o nome escrito (cor nunca é a única pista); aceita marcação
function tok(x, y, s, c, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= .02) return 0;
  X.save(); X.globalAlpha *= a; const sz = o.s || 12, w = mtw(s, sz, 700) + 12, h = sz + 8;
  rr(x - w / 2, y - h / 2, w, h, 6, c, 'rgba(11,15,28,.55)', 1);
  mtx(s, x, y + .5, { s: sz, w: 700, c: o.tc || '#0B0F1C', bg: false }); X.restore(); return w;
}
// pastilha de nome sem linha-guia (escura, com bolinha de cor opcional); x é a borda esquerda; devolve a largura
function pill(s, x, y, c, a = 1) {
  if (!LB) return 0; X.save(); X.globalAlpha *= a; const sz = NAR ? 12 : 13;
  const w = mtw(s, sz, 600) + (c ? 26 : 16), h = NAR ? 20 : 22;
  rr(x, y - h / 2, w, h, 999, 'rgba(11,15,28,.84)', 'rgba(255,255,255,.14)', 1);
  if (c) circ(x + 11, y, 4.5, c);
  mtx(s, x + (c ? 20 : 8), y + .5, { s: sz, w: 600, a: 'left', c: C.txt, bg: false }); X.restore(); return w;
}

// rótulos em pastilha com linha-guia (no máximo 5 no celular e 8 no computador, sem sobreposição); aceita marcação
let LBS = [];
function lab(ax, ay, bx, by, s) {
  if (!LB) return; if (LBS.length >= (NAR ? 5 : 8)) return;
  const pw = mtw(s, 13, 600) + 16, ph = 24; let L = bx < ax - 1;
  if (L && bx - pw < 4) L = false; if (!L && bx + pw > W - 4) L = true;
  bx = cl(bx, L ? pw + 4 : 4, L ? W - 4 : W - pw - 4); by = cl(by, ph / 2 + (NAR ? 44 : 56), H - ph / 2 - (NAR ? 92 : 84)); const rx = L ? bx - pw : bx;
  if (LBS.some(r => rx < r[0] + r[2] + 4 && rx + pw + 4 > r[0] && by - ph / 2 < r[1] + r[3] + 3 && by + ph / 2 + 3 > r[1])) return;
  LBS.push([rx, by - ph / 2, pw, ph]);
  line(ax, ay, bx, by, 'rgba(255,255,255,.6)', 1); circ(ax, ay, 3, '#fff');
  rr(rx, by - ph / 2, pw, ph, 999, 'rgba(11,15,28,.84)', 'rgba(255,255,255,.12)', 1);
  mtx(s, rx + 8, by + .5, { s: 13, w: 600, a: 'left', c: C.txt, bg: false });
}
// painel escuro com borda (cartões, quadros)
function panel(x, y, w, h, o = {}) { rr(x, y, w, h, o.r == null ? 10 : o.r, o.f || 'rgba(19,26,43,.78)', o.s || C.line, o.lw || 1); }

// ---------- toque: áreas clicáveis registradas a cada quadro ----------
// No draw: hitR(x, y, w, h, id) ou hitC(x, y, r, id). No o.tap(x, y, S): const id = hitAt(x, y).
// O motor zera a lista a cada quadro e mostra a mãozinha quando o ponteiro está sobre uma área (se a cena tiver o.tap).
let HITS = [];
function hitR(x, y, w, h, id) { HITS.push({ x, y, w, h, id }); }
function hitC(x, y, r, id) { HITS.push({ x: x - r, y: y - r, w: 2 * r, h: 2 * r, r, cx: x, cy: y, id }); }
function hitAt(x, y) { for (let i = HITS.length - 1; i >= 0; i--) { const h = HITS[i]; if (h.r != null ? Math.hypot(x - h.cx, y - h.cy) <= h.r + 3 : x >= h.x - 3 && x <= h.x + h.w + 3 && y >= h.y - 3 && y <= h.y + h.h + 3) return h.id; } return null; }


// ---------- ícones de seres vivos (desenho próprio, traço único) ----------
// bicho(id, x, y, s, o): desenha o ícone centrado em (x, y), cabendo num quadrado de lado s.
// o.c cor do traço (padrão C.txt), o.f preenchimento (padrão o.c com 22% de opacidade), o.a opacidade, o.flip espelha.
// ids: onca, gato, cao, lobo, humano, chimpanze, cavalo, jumento, baleia, golfinho, peixe, tubarao, lampreia, sapo,
//      lagarto, cobra, crocodilo, jacare, tartaruga, ave, galinha, tucano, polvo, abelha, borboleta, caranguejo, aranha,
//      minhoca, estrela, milho, tomate, samambaia, arvore, cogumelo, levedura, bacteria, ameba, alga, morcego
const BICHOS = {};
function bicho(id, x, y, s, o = {}) {
  const fn = BICHOS[id]; if (!fn) return; const a = o.a == null ? 1 : o.a; if (a <= .02) return;
  const c = o.c || C.txt, k = s / 2;
  X.save(); X.globalAlpha *= a; X.translate(x, y); X.scale(o.flip ? -k : k, k);
  X.lineWidth = (o.lw || (s < 40 ? 1.6 : 2)) / k; X.lineJoin = 'round'; X.lineCap = 'round';
  X.strokeStyle = c; X.fillStyle = o.f || rgba(c, .22);
  try { fn(c, o); } catch (err) { console.error(err); }
  X.restore();
}
{
  const P = () => X.beginPath(), FS = () => { X.fill(); X.stroke(); }, ST = () => X.stroke();
  const E = (x, y, rx, ry, r = 0) => { P(); X.ellipse(x, y, rx, ry, r, 0, TAU); FS(); };
  const DOT = (x, y, r, c) => { P(); X.arc(x, y, r, 0, TAU); X.fillStyle = c; X.fill(); };
  const L = (...p) => { P(); X.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) X.lineTo(p[i], p[i + 1]); ST(); };
  const SH = (...p) => { P(); X.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) X.lineTo(p[i], p[i + 1]); X.closePath(); FS(); };
  const Q = (x0, y0, qx, qy, x1, y1) => { P(); X.moveTo(x0, y0); X.quadraticCurveTo(qx, qy, x1, y1); ST(); };
  const dark0 = '#0B0F1C';
  const quad = (c, o, sp) => { // quadrúpede genérico (corpo, pernas, cabeça); sp = ajustes
    L(-.5, .1, -.55, .62); L(-.3, .15, -.3, .62); L(.3, .15, .32, .62); L(.5, .1, .52, .62);
    E(0, .05, .62, .26);
    sp(c, o);
  };
  Object.assign(BICHOS, {
    gato(c, o) { quad(c, o, () => { Q(-.6, -.02, -.95, -.2, -.85, -.6); E(.66, -.25, .24, .21); SH(.5, -.38, .52, -.62, .64, -.44); SH(.72, -.44, .84, -.62, .86, -.38); DOT(.72, -.27, .04, dark0); }); },
    onca(c, o) { BICHOS.gato(c, o); const R = rng(4); for (let i = 0; i < 9; i++) { P(); X.arc(-.42 + R() * .84, -.05 + R() * .22, .045, 0, TAU); X.fillStyle = dark0; X.fill(); } },
    cao(c, o) { quad(c, o, () => { Q(-.6, -.05, -.8, -.35, -.72, -.5); E(.66, -.28, .22, .2); SH(.78, -.32, 1, -.24, .98, -.14, .8, -.16); SH(.56, -.42, .5, -.18, .62, -.3); DOT(.7, -.32, .04, dark0); }); },
    lobo(c, o) { quad(c, o, () => { Q(-.6, -.02, -.9, .1, -.95, .32); E(.66, -.28, .22, .19); SH(.8, -.34, 1, -.22, .82, -.16); SH(.56, -.4, .58, -.66, .7, -.44); DOT(.7, -.32, .04, dark0); }); },
    cavalo(c, o) { quad(c, o, () => { Q(-.6, -.05, -.85, .05, -.8, .4); SH(.42, -.1, .58, -.62, .74, -.56, .62, -.05); SH(.6, -.62, .96, -.42, .92, -.3, .64, -.44); L(.6, -.62, .64, -.78); DOT(.7, -.52, .035, dark0); }); },
    jumento(c, o) { BICHOS.cavalo(c, o); SH(.58, -.6, .5, -.95, .64, -.66); },
    humano(c, o) { E(0, -.68, .2, .22); P(); X.roundRect(-.3, -.42, .6, .62, .18); FS(); L(-.14, .2, -.16, .92); L(.14, .2, .16, .92); L(-.3, -.36, -.44, .2); L(.3, -.36, .44, .2); },
    chimpanze(c, o) { E(.1, -.05, .42, .3, -.3); E(.5, -.45, .2, .2); E(.56, -.42, .1, .09); L(-.15, .2, -.3, .7); L(.15, .2, .1, .7); L(.38, -.2, .55, .62); L(-.25, -.15, -.5, .4); },
    morcego(c, o) { E(0, 0, .14, .26); SH(-.1, -.12, -.9, -.4, -.7, -.05, -.95, .1, -.55, .12, -.4, .3, -.1, .1); SH(.1, -.12, .9, -.4, .7, -.05, .95, .1, .55, .12, .4, .3, .1, .1); SH(-.1, -.24, -.06, -.42, 0, -.26); SH(.1, -.24, .06, -.42, 0, -.26); },
    baleia(c, o) { P(); X.moveTo(-.95, -.05); X.quadraticCurveTo(-.7, -.42, .1, -.32); X.quadraticCurveTo(.6, -.25, .78, -.02); X.quadraticCurveTo(.5, .32, -.2, .3); X.quadraticCurveTo(-.85, .28, -.95, -.05); FS(); SH(.76, -.04, 1, -.3, .92, .02, 1, .26); DOT(-.6, -.06, .05, dark0); Q(-.4, .2, -.3, .4, -.15, .38); },
    golfinho(c, o) { P(); X.moveTo(-1, -.02); X.lineTo(-.72, -.1); X.quadraticCurveTo(-.2, -.4, .5, -.12); X.quadraticCurveTo(.25, .22, -.6, .12); X.closePath(); FS(); SH(-.05, -.3, .1, -.58, .2, -.22); SH(.48, -.12, .92, -.42, .8, -.1, .95, .18); DOT(-.6, -.05, .04, dark0); },
    peixe(c, o) { E(-.1, 0, .62, .32); SH(.48, 0, .95, -.36, .95, .36); SH(-.2, -.3, .05, -.52, .18, -.28); DOT(-.45, -.06, .06, dark0); Q(-.28, -.2, -.22, 0, -.28, .2); },
    tubarao(c, o) { P(); X.moveTo(-1, .02); X.quadraticCurveTo(-.7, -.28, .1, -.22); X.quadraticCurveTo(.55, -.18, .7, 0); X.quadraticCurveTo(.5, .2, -.2, .2); X.quadraticCurveTo(-.8, .2, -1, .02); FS(); SH(-.15, -.22, .05, -.62, .18, -.2); SH(.66, -.02, 1, -.48, .86, .02, .96, .24); SH(-.1, .18, .1, .42, .14, .16); DOT(-.72, -.04, .045, dark0); },
    lampreia(c, o) { X.lineWidth *= 4.2; P(); X.moveTo(-.8, 0); X.bezierCurveTo(-.4, -.3, -.1, .3, .25, 0); X.bezierCurveTo(.5, -.22, .75, .15, .95, .02); X.strokeStyle = c; ST(); X.lineWidth /= 4.2; P(); X.arc(-.86, 0, .13, 0, TAU); FS(); for (let i = 0; i < 5; i++) DOT(-.6 + i * .08, -.06 + Math.sin(i) * .02, .025, dark0); },
    sapo(c, o) { E(0, .12, .6, .4); E(-.32, -.26, .16, .16); E(.32, -.26, .16, .16); DOT(-.32, -.28, .06, dark0); DOT(.32, -.28, .06, dark0); Q(-.25, 0, 0, .1, .25, 0); L(-.55, .3, -.85, .55, -.6, .55); L(.55, .3, .85, .55, .6, .55); },
    lagarto(c, o) { P(); X.moveTo(-.25, 0); X.quadraticCurveTo(-.8, .05, -1, -.2); X.quadraticCurveTo(-.7, .2, -.25, .12); ST(); E(.05, .04, .36, .13); E(.55, -.02, .2, .1); L(-.15, .1, -.3, .38); L(.2, .1, .32, .38); L(-.15, -.02, -.3, -.3); L(.2, -.02, .32, -.3); DOT(.62, -.05, .03, dark0); },
    cobra(c, o) { X.lineWidth *= 4; P(); X.moveTo(-.9, .45); X.bezierCurveTo(-.4, .8, -.3, -.1, 0, .05); X.bezierCurveTo(.3, .2, .3, -.55, .6, -.35); ST(); X.lineWidth /= 4; E(.72, -.36, .18, .12, -.3); DOT(.76, -.4, .03, dark0); L(.88, -.4, 1, -.44); },
    crocodilo(c, o) { P(); X.moveTo(-1, .05); X.quadraticCurveTo(-.6, -.14, -.2, -.12); X.lineTo(.5, -.1); X.lineTo(1, -.02); X.lineTo(.98, .06); X.lineTo(.5, .08); X.quadraticCurveTo(-.2, .18, -1, .05); FS(); for (let i = 0; i < 5; i++) SH(-.7 + i * .2, -.1, -.62 + i * .2, -.2, -.55 + i * .2, -.11); L(-.1, .12, -.2, .36); L(.3, .1, .38, .36); DOT(.46, -.14, .035, dark0); },
    jacare(c, o) { BICHOS.crocodilo(c, o); },
    tartaruga(c, o) { P(); X.ellipse(0, 0, .58, .4, 0, PI, TAU); X.closePath(); FS(); L(-.4, 0, -.55, .25); L(.35, 0, .5, .25); E(.72, -.06, .18, .13); L(-.58, -.02, -.82, .08); },
    ave(c, o) { E(-.05, .05, .48, .3, -.15); E(.45, -.32, .2, .19); SH(.62, -.36, .9, -.28, .62, -.24); SH(-.45, .05, -.95, -.12, -.88, .2); Q(-.2, -.05, .05, -.25, .25, .05); L(-.05, .32, -.1, .65); L(.12, .3, .12, .65); DOT(.5, -.36, .04, dark0); },
    galinha(c, o) { E(-.05, .08, .5, .38); E(.42, -.32, .2, .2); SH(.36, -.5, .42, -.66, .48, -.5, .54, -.62, .56, -.46); SH(.6, -.34, .82, -.28, .6, -.22); SH(-.5, -.05, -.85, -.5, -.65, .15); L(-.05, .45, -.1, .75); L(.12, .44, .12, .75); DOT(.48, -.35, .04, dark0); },
    tucano(c, o) { E(-.15, .1, .38, .3, .5); E(.18, -.3, .2, .2); P(); X.moveTo(.32, -.4); X.quadraticCurveTo(.95, -.42, 1, -.2); X.quadraticCurveTo(.7, -.18, .32, -.2); X.closePath(); X.fillStyle = rgba('#FF9A3C', .75); X.fill(); ST(); SH(-.4, .3, -.6, .8, -.3, .38); DOT(.22, -.34, .04, dark0); },
    polvo(c, o) { E(0, -.3, .42, .42); for (let i = 0; i < 6; i++) { const x0 = -.32 + i * .128; P(); X.moveTo(x0, 0); X.quadraticCurveTo(x0 + (i % 2 ? .2 : -.2), .45, x0 + (i - 2.5) * .12, .8); X.lineWidth *= 2.2; ST(); X.lineWidth /= 2.2; } DOT(-.14, -.32, .06, dark0); DOT(.14, -.32, .06, dark0); },
    abelha(c, o) { E(-.25, -.42, .26, .18, -.5); E(.15, -.45, .24, .17, .5); E(.1, .1, .48, .3); for (const sx of [-.05, .15, .35]) L(sx, -.16, sx, .37); E(-.48, .02, .17, .17); L(-.55, -.12, -.7, -.35); L(-.45, -.13, -.5, -.38); L(.58, .1, .72, .12); },
    borboleta(c, o) { E(-.38, -.25, .36, .32, -.4); E(.38, -.25, .36, .32, .4); E(-.3, .3, .24, .22, .5); E(.3, .3, .24, .22, -.5); P(); X.ellipse(0, .05, .06, .45, 0, 0, TAU); X.fillStyle = c; X.fill(); L(0, -.38, -.15, -.7); L(0, -.38, .15, -.7); },
    caranguejo(c, o) { E(0, .1, .5, .3); for (let i = 0; i < 3; i++) { L(-.42, .15 + i * .08, -.82, .3 + i * .15); L(.42, .15 + i * .08, .82, .3 + i * .15); } L(-.3, -.1, -.55, -.4); L(.3, -.1, .55, -.4); E(-.62, -.5, .17, .13, -.5); E(.62, -.5, .17, .13, .5); DOT(-.12, -.12, .05, dark0); DOT(.12, -.12, .05, dark0); },
    aranha(c, o) { for (let i = 0; i < 4; i++) { const y = -.15 + i * .1, s = i < 2 ? -1 : 1; P(); X.moveTo(-.1, y); X.lineTo(-.55, y - .35 * (i < 2 ? 1 : -.2)); X.lineTo(-.85, y + .2 + i * .1); ST(); P(); X.moveTo(.1, y); X.lineTo(.55, y - .35 * (i < 2 ? 1 : -.2)); X.lineTo(.85, y + .2 + i * .1); ST(); void s; } E(0, .2, .3, .3); E(0, -.22, .18, .16); },
    minhoca(c, o) { X.lineWidth *= 4; P(); X.moveTo(-.9, .2); X.bezierCurveTo(-.5, -.4, -.2, .5, .2, 0); X.bezierCurveTo(.5, -.35, .7, .2, .9, -.05); ST(); X.lineWidth /= 4; X.strokeStyle = dark0; for (let i = 1; i < 9; i++) { const t = i / 9, x = -.9 + t * 1.8; L(x, -.12 + Math.sin(t * 9) * .12, x, .06 + Math.sin(t * 9) * .12); } X.strokeStyle = c; },
    estrela(c, o) { P(); for (let i = 0; i < 10; i++) { const a = -PI / 2 + i * PI / 5, r = i % 2 ? .32 : .9; i ? X.lineTo(Math.cos(a) * r, Math.sin(a) * r) : X.moveTo(Math.cos(a) * r, Math.sin(a) * r); } X.closePath(); FS(); for (let i = 0; i < 5; i++) { const a = -PI / 2 + i * TAU / 5; DOT(Math.cos(a) * .45, Math.sin(a) * .45, .04, dark0); } },
    milho(c, o) { L(0, .95, 0, -.6); P(); X.ellipse(.12, -.15, .2, .48, .15, 0, TAU); X.fillStyle = rgba('#E3CF4E', .65); X.fill(); ST(); Q(0, .6, -.6, .2, -.75, -.5); Q(0, .4, .5, .1, .7, -.3); Q(.05, .2, .5, -.2, .35, -.7); },
    tomate(c, o) { E(0, .15, .62, .52); SH(0, -.4, -.25, -.55, -.08, -.38, 0, -.6, .08, -.38, .25, -.55); L(0, -.45, 0, -.75); },
    samambaia(c, o) { Q(0, .95, -.1, 0, .2, -.9); for (let i = 0; i < 7; i++) { const t = i / 7, x = lerp(-.02, .14, t), y = lerp(.6, -.7, t), l = .5 * (1 - t * .6); E(x - l / 2, y, l / 2, .08, -.3); E(x + l / 2, y - .05, l / 2, .08, .3); } },
    arvore(c, o) { P(); X.moveTo(-.1, .95); X.lineTo(-.08, .1); X.lineTo(.08, .1); X.lineTo(.1, .95); X.closePath(); FS(); E(0, -.3, .62, .52); },
    cogumelo(c, o) { P(); X.moveTo(-.18, .85); X.lineTo(-.12, -.05); X.lineTo(.12, -.05); X.lineTo(.18, .85); X.closePath(); FS(); P(); X.ellipse(0, -.05, .75, .6, 0, PI, TAU); X.closePath(); FS(); DOT(-.3, -.35, .07, dark0); DOT(.2, -.45, .06, dark0); },
    levedura(c, o) { E(-.15, .1, .42, .36); E(.42, -.3, .22, .2); E(-.15, .1, .14, .12); },
    bacteria(c, o) { P(); X.roundRect(-.6, -.24, 1.2, .48, .24); FS(); Q(.6, 0, .8, -.25, 1, .05); P(); X.moveTo(-.3, 0); X.bezierCurveTo(-.1, -.1, .1, .1, .3, 0); ST(); },
    ameba(c, o) { P(); X.moveTo(-.7, 0); X.bezierCurveTo(-.8, -.5, -.2, -.3, 0, -.6); X.bezierCurveTo(.3, -.8, .5, -.3, .8, -.3); X.bezierCurveTo(.9, .1, .5, .2, .6, .5); X.bezierCurveTo(.3, .8, 0, .4, -.3, .6); X.bezierCurveTo(-.6, .7, -.6, .3, -.7, 0); FS(); E(.05, 0, .16, .14); },
    alga(c, o) { E(0, 0, .3, .62); E(0, -.05, .14, .32); DOT(0, -.5, .06, dark0); Q(0, -.62, .25, -.85, .1, -1); Q(0, -.62, -.25, -.85, -.1, -1); }
  });
}

// ícones só deste módulo: mosquito (vetor), macaco (sentinela da febre amarela), porco (gripe)
{
  const P = () => X.beginPath(), FS = () => { X.fill(); X.stroke(); }, ST = () => X.stroke();
  const E = (x, y, rx, ry, r = 0) => { P(); X.ellipse(x, y, rx, ry, r, 0, TAU); FS(); };
  const DOT = (x, y, r, c) => { P(); X.arc(x, y, r, 0, TAU); X.fillStyle = c; X.fill(); };
  const L = (...p) => { P(); X.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) X.lineTo(p[i], p[i + 1]); ST(); };
  const dark0 = '#0B0F1C';
  Object.assign(BICHOS, {
    mosquito(c) {
      const f0 = X.fillStyle; X.fillStyle = rgba('#CFE0FF', .16); E(-.02, -.36, .4, .11, -.25); E(.12, -.3, .34, .09, -.05); X.fillStyle = f0;
      L(-.12, .05, -.4, .45, -.55, .92); L(-.02, .08, -.05, .5, -.2, .95); L(.08, .06, .35, .45, .5, .92);
      E(-.08, 0, .18, .13); P(); X.ellipse(.42, .1, .42, .1, .18, 0, TAU); FS(); E(-.33, -.04, .1, .1);
      L(-.42, 0, -.98, .2); L(-.38, -.1, -.6, -.32);
      X.strokeStyle = '#F2F4F8'; for (const k of [.22, .38, .54, .7]) L(k, .02 + k * .18, k + .02, .17 + k * .18); X.strokeStyle = c;
    },
    macaco(c) {
      P(); X.moveTo(.35, .2); X.bezierCurveTo(.95, .3, .95, -.5, .62, -.5); X.bezierCurveTo(.45, -.5, .45, -.25, .62, -.28); ST();
      E(0, .12, .38, .3, -.2); E(-.45, -.3, .22, .2); E(-.52, -.26, .11, .1); DOT(-.5, -.35, .03, dark0);
      L(-.2, .32, -.32, .78); L(.2, .3, .22, .78); L(-.28, .02, -.55, .4); L(.25, .0, .45, .35);
    },
    porco(c) {
      E(0, .05, .62, .36); E(.66, -.08, .2, .2); E(.84, -.04, .09, .1); P(); X.moveTo(.56, -.24); X.lineTo(.6, -.48); X.lineTo(.72, -.27); X.closePath(); FS();
      DOT(.7, -.14, .035, dark0); L(-.4, .32, -.42, .66); L(-.15, .38, -.15, .66); L(.2, .38, .2, .66); L(.42, .3, .44, .66);
      P(); X.moveTo(-.62, -.02); X.bezierCurveTo(-.85, -.2, -.95, .1, -.78, .12); ST();
    }
  });
}

// ---------- ajudantes de vírus ----------
// Cores sempre em hex (#RRGGBB). Todas as funções aceitam o.a (opacidade, padrão 1) e salvam e restauram o estado do canvas.
const alfa = o => (o && o.a != null ? o.a : 1);

// ácido nucleico ao longo de uma linha quebrada pts = [[x, y], ...]
// o.tipo 'rna' (fita simples, coral, padrão) ou 'dna' (dupla hélice, violeta, com degraus); o.c cor; o.amp amplitude em px (4);
// o.ond comprimento de onda em px (16); o.ph fase (anima a onda); o.lw espessura; o.f fração desenhada (0 a 1)
function fita(pts, o = {}) {
  const a = alfa(o); if (a <= .02 || !pts || pts.length < 2) return;
  const dna = o.tipo === 'dna', c = o.c || (dna ? C.dna : C.rna), amp = o.amp == null ? 4 : o.amp, ond = o.ond || 16, lw = o.lw || (dna ? 1.6 : 2), ph = o.ph || 0;
  const L = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  const end = tot * (o.f == null ? 1 : cl(o.f, 0, 1)); if (end < 1) return;
  const at = d => { let i = 0; while (i < L.length - 1 && d > L[i]) { d -= L[i]; i++; } const l = L[i] || 1, p = pts[i], q = pts[i + 1], k = cl(d / l, 0, 1); return [lerp(p[0], q[0], k), lerp(p[1], q[1], k), -(q[1] - p[1]) / l, (q[0] - p[0]) / l]; };
  X.save(); X.globalAlpha *= a; X.lineCap = 'round'; X.lineJoin = 'round';
  const strand = (sg, col, w) => { X.beginPath(); for (let d = 0; ; d = Math.min(end, d + 2)) { const [x, y, nx, ny] = at(d), v = Math.sin(d / ond * TAU + ph) * amp * sg; d ? X.lineTo(x + nx * v, y + ny * v) : X.moveTo(x + nx * v, y + ny * v); if (d >= end) break; } X.strokeStyle = col; X.lineWidth = w; X.stroke(); };
  if (dna) {
    X.beginPath(); for (let d = ond / 6; d <= end; d += ond / 4) { const [x, y, nx, ny] = at(d), v = Math.sin(d / ond * TAU + ph) * amp; X.moveTo(x + nx * v, y + ny * v); X.lineTo(x - nx * v, y - ny * v); }
    X.strokeStyle = rgba(c, .55); X.lineWidth = 1; X.stroke();
    strand(1, c, lw); strand(-1, light(c, .25), lw);
  } else strand(1, c, lw);
  X.restore();
}
// genoma enrolado dentro de um círculo de raio r (dentro do capsídeo). o.tipo 'rna' | 'dna'; o.c; o.seg número de pedaços
// (o vírus da gripe tem 8); o.seed muda o desenho; o.ph anima de leve; o.lw
function novelo(x, y, r, o = {}) {
  const a = alfa(o); if (a <= .02 || r < 2) return;
  const dna = o.tipo === 'dna', c = o.c || (dna ? C.dna : C.rna), n = o.seg || 1, ph = o.ph || 0;
  if (n > 1) {
    for (let i = 0; i < n; i++) {
      const g = i / n * TAU + .4, cx = x + Math.cos(g) * r * .5, cy = y + Math.sin(g) * r * .5, d = g + PI / 2 + .5, l = r * .62;
      fita([[cx - Math.cos(d) * l / 2, cy - Math.sin(d) * l / 2], [cx + Math.cos(d) * l / 2, cy + Math.sin(d) * l / 2]], { tipo: o.tipo, c, amp: Math.max(1.5, r * .08), ond: Math.max(6, l / 2.2), ph: ph + i, lw: o.lw || (r < 24 ? 1.6 : 2.2), a });
    }
    return;
  }
  const R = rng(o.seed || 7), m = r > 30 ? 11 : 8, pts = [];
  for (let k = 0; k < m; k++) { const g = k / m * TAU * 2 + R() * .6, rad = r * (.25 + .55 * R()) + Math.sin(ph + k) * r * .04; pts.push([x + Math.cos(g) * rad, y + Math.sin(g) * rad]); }
  X.save(); X.globalAlpha *= a; X.lineCap = 'round'; X.lineJoin = 'round';
  X.beginPath(); const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], m0 = mid(pts[m - 1], pts[0]); X.moveTo(m0[0], m0[1]);
  for (let k = 0; k < m; k++) { const q = pts[k], nx = mid(q, pts[(k + 1) % m]); X.quadraticCurveTo(q[0], q[1], nx[0], nx[1]); }
  const lw = o.lw || (r < 24 ? 1.6 : 2.2);
  if (dna) { X.strokeStyle = c; X.lineWidth = lw * 2.4; X.stroke(); X.strokeStyle = 'rgba(11,15,28,.85)'; X.lineWidth = lw * .7; X.stroke(); }
  else { X.strokeStyle = c; X.lineWidth = lw; X.stroke(); }
  X.restore();
}

// icosaedro em 3D (capsídeo de 20 faces triangulares). o.rx, o.ry giro em radianos; o.c cor; o.hl quantas faces destacar
// (em âmbar, numa ordem fixa, de 0 a 20); o.capso true põe capsômeros (bolinhas) nas faces da frente; o.fundo false esconde as faces de trás
const ICO = (() => {
  const f = (1 + Math.sqrt(5)) / 2, V = [];
  for (const a of [-1, 1]) for (const b of [-1, 1]) V.push([0, a, b * f], [a, b * f, 0], [b * f, 0, a]);
  const F = [];
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) for (let k = j + 1; k < 12; k++) {
    const d = (p, q) => (V[p][0] - V[q][0]) ** 2 + (V[p][1] - V[q][1]) ** 2 + (V[p][2] - V[q][2]) ** 2;
    if (Math.abs(d(i, j) - 4) < .01 && Math.abs(d(j, k) - 4) < .01 && Math.abs(d(i, k) - 4) < .01) F.push([i, j, k]);
  }
  const n = Math.hypot(1, f), Vn = V.map(v => v.map(c => c / n));
  const cen = t => [0, 1, 2].map(e => (Vn[t[0]][e] + Vn[t[1]][e] + Vn[t[2]][e]) / 3);
  // ordem de destaque: de cima para baixo, girando
  F.sort((p, q) => { const a = cen(p), b = cen(q), ba = Math.round(a[1] * 2.2), bb = Math.round(b[1] * 2.2); return ba - bb || Math.atan2(a[2], a[0]) - Math.atan2(b[2], b[0]); });
  return { V: Vn, F };
})();
function icosa(x, y, r, o = {}) {
  const a = alfa(o); if (a <= .02 || r < 2) return;
  const rx = o.rx == null ? .42 : o.rx, ry = o.ry == null ? .6 : o.ry, c = o.c || C.capsideo, hl = o.hl || 0;
  const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
  const P = ICO.V.map(([vx, vy, vz]) => { const x1 = vx * cy + vz * sy, z1 = -vx * sy + vz * cy, y2 = vy * cx - z1 * sx, z2 = vy * sx + z1 * cx; return [x1, y2, z2]; });
  const Lt = [-.42, -.6, .68], ln = Math.hypot(...Lt);
  const fs = ICO.F.map((t, i) => { const q = t.map(k => P[k]), m = [0, 1, 2].map(e => (q[0][e] + q[1][e] + q[2][e]) / 3), mn = Math.hypot(...m); return { q, z: m[2], sh: (m[0] * Lt[0] + m[1] * Lt[1] + m[2] * Lt[2]) / (mn * ln), h: i < hl }; }).sort((p, q) => p.z - q.z);
  X.save(); X.globalAlpha *= a; X.lineJoin = 'round';
  for (const f of fs) {
    const pts = f.q.map(p => [x + p[0] * r, y + p[1] * r]), front = f.z > 0;
    if (!front && o.fundo === false) continue;
    if (front) shape(pts, f.h ? mix('#1A2033', mix(c, '#FFFFFF', .6), .7 + .3 * Math.max(0, f.sh)) : mix('#1A2033', c, .35 + .55 * Math.max(0, f.sh)), light(c, .3), r < 20 ? 1 : 1.3);
    else shape(pts, f.h ? rgba(mix(c, '#FFFFFF', .6), .16) : rgba(c, .05), rgba(c, .22), 1);
  }
  if (o.capso !== false && r > 22) for (const f of fs) if (f.z > .15) {
    const m = [0, 1].map(e => (f.q[0][e] + f.q[1][e] + f.q[2][e]) / 3);
    for (const p of f.q) circ(x + (m[0] * .55 + p[0] * .45) * r, y + (m[1] * .55 + p[1] * .45) * r, r * .055, null, 'rgba(11,15,28,.5)', 1);
  }
  X.restore();
}

// bastonete helicoidal (vírus do mosaico do tabaco): capsômeros em espiral em volta do RNA, de (x0, y0) a (x1, y1), meia espessura r.
// o.ph gira a hélice; o.corte fração do fim (lado x1) sem capsômeros, mostrando o RNA (0 a 1); o.c; o.rna false esconde o RNA
function helice(x0, y0, x1, y1, r, o = {}) {
  const a = alfa(o); if (a <= .02) return;
  const len = Math.hypot(x1 - x0, y1 - y0) || 1, ux = (x1 - x0) / len, uy = (y1 - y0) / len, nx = -uy, ny = ux;
  const c = o.c || C.capsideo, ph = o.ph || 0, per = 12, pitch = Math.max(4, r * .5), n = Math.floor(len / pitch * per), corte = o.corte || 0;
  const bead = (i, front) => {
    const th = i / per * TAU + ph, s = i / per * pitch; if (s > len * (1 - corte)) return; const dz = Math.sin(th);
    if ((dz >= 0) !== front) return; const px = x0 + ux * s + nx * Math.cos(th) * r * .72, py = y0 + uy * s + ny * Math.cos(th) * r * .72;
    ell(px, py, r * .3, r * .2, Math.atan2(uy, ux) + PI / 2, front ? mix('#1A2033', c, .5 + .45 * dz) : mix('#141A2B', c, .28), front ? 'rgba(11,15,28,.55)' : null, 1);
  };
  X.save(); X.globalAlpha *= a;
  for (let i = 0; i < n; i++) bead(i, false);
  if (o.rna !== false) { // o RNA acompanha a hélice, por dentro dos capsômeros
    X.beginPath(); for (let i = 0; i <= n; i++) { const th = i / per * TAU + ph, s = i / per * pitch, px = x0 + ux * s + nx * Math.cos(th) * r * .42, py = y0 + uy * s + ny * Math.cos(th) * r * .42; i ? X.lineTo(px, py) : X.moveTo(px, py); }
    X.strokeStyle = C.rna; X.lineWidth = Math.max(1.4, r * .1); X.lineJoin = 'round'; X.stroke();
  }
  for (let i = 0; i < n; i++) bead(i, true);
  X.restore();
}

// espícula (glicoproteína do envelope) presa em (x, y), apontando para ang, com comprimento len.
// o.tipo: 'bola' (padrão), 'H' (hemaglutinina, gripe), 'N' (neuraminidase, gripe), 'gp' (HIV), 'S' (proteína S, coronavírus); o.c
function espicula(x, y, ang, len, o = {}) {
  const a = alfa(o); if (a <= .02 || len < 2) return;
  const c = o.c || C.espicula, t = o.tipo || 'bola', st = dark(c, .45), lw = Math.max(1, len * .11);
  X.save(); X.globalAlpha *= a; X.translate(x, y); X.rotate(ang); X.lineCap = 'round';
  const stem = e => { X.beginPath(); X.moveTo(0, 0); X.lineTo(len * e, 0); X.strokeStyle = c; X.lineWidth = lw; X.stroke(); };
  if (t === 'H') { stem(.45); shape([[len * .4, -len * .07], [len, -len * .2], [len, len * .2], [len * .4, len * .07]], c, st, 1); }
  else if (t === 'N') { stem(.62); rr(len * .62, -len * .19, len * .38, len * .38, len * .08, c, st, 1); circ(len * .81, 0, len * .05, st); }
  else if (t === 'gp') { stem(.55); for (const [u, v] of [[.72, -.15], [.72, .15], [.9, 0]]) circ(len * u, len * v, len * .15, c, st, 1); }
  else if (t === 'S') { stem(.42); X.beginPath(); X.moveTo(len * .4, -len * .06); X.quadraticCurveTo(len * .6, -len * .32, len, -len * .24); X.lineTo(len, len * .24); X.quadraticCurveTo(len * .6, len * .32, len * .4, len * .06); X.closePath(); X.fillStyle = c; X.fill(); X.strokeStyle = st; X.lineWidth = 1; X.stroke(); }
  else { stem(.62); circ(len * .78, 0, len * .22, c, st, 1); }
  X.restore();
}

// envelope: bicamada de lipídios em círculo de raio r (rosa: veio da membrana da célula).
// o.esp número de espículas; o.espTipo ('bola', 'H', 'N', 'gp', 'S' ou função (i) que devolve o tipo); o.espLen; o.rot;
// o.mostra (0 a 1) fração das espículas já colocadas; o.solta (0 a 1) espículas se soltando; o.desfaz (0 a 1) o envelope se desmancha (sabão); o.f cor de preenchimento do miolo; o.c
function envelope(x, y, r, o = {}) {
  const a = alfa(o); if (a <= .02 || r < 3) return;
  const c = o.c || C.envelope, d = Math.max(2.5, r * .07), dz = cl(o.desfaz || 0, 0, 1), rot = o.rot || 0;
  X.save(); X.globalAlpha *= a;
  if (o.f && dz < .05) circ(x, y, r - d, o.f);
  const nE = o.esp || 0, sl = cl(o.solta || 0, 0, 1), el = o.espLen || r * .34;
  const vis = nE * cl(o.mostra == null ? 1 : o.mostra, 0, 1);
  for (let i = 0; i < nE && i < vis; i++) {
    const g = rot + i / nE * TAU, tp = typeof o.espTipo === 'function' ? o.espTipo(i) : o.espTipo, off = sl * r * (.5 + (i % 3) * .25);
    espicula(x + Math.cos(g) * (r + off), y + Math.sin(g) * (r + off), g + sl * (i % 2 ? .8 : -.8), el * Math.min(1, vis - i), { tipo: tp, c: o.espC, a: 1 - sl * .75 });
  }
  if (dz < .02) {
    circ(x, y, r - d / 2, null, rgba(c, .32), d); circ(x, y, r, null, c, 1.4); circ(x, y, r - d, null, c, 1.1);
    if (r > 26) { const n = Math.floor(r * TAU / 7); X.fillStyle = c; X.beginPath(); for (let i = 0; i < n; i++) { const g = i / n * TAU; for (const rr0 of [r, r - d]) { X.moveTo(x + Math.cos(g) * rr0 + 1.6, y + Math.sin(g) * rr0); X.arc(x + Math.cos(g) * rr0, y + Math.sin(g) * rr0, 1.6, 0, TAU); } } X.fill(); }
  } else { // pedaços de membrana se afastando e virando bolinhas (micelas com o sabão)
    const k = 10;
    for (let i = 0; i < k; i++) {
      const g0 = rot + i / k * TAU, span = TAU / k * (1 - dz * .85), mv = dz * r * .55 * (1 + (i % 3) * .3), mx = Math.cos(g0 + span / 2) * mv, my = Math.sin(g0 + span / 2) * mv;
      X.globalAlpha = a * (1 - dz * .6);
      X.beginPath(); X.arc(x + mx, y + my, r - d / 2, g0, g0 + span); X.strokeStyle = rgba(c, .5); X.lineWidth = d; X.stroke();
      X.beginPath(); X.arc(x + mx, y + my, r, g0, g0 + span); X.strokeStyle = c; X.lineWidth = 1.2; X.stroke();
    }
  }
  X.restore();
}

// partícula viral completa centrada em (x, y), raio r (o do envelope; nos vírus sem envelope, o do capsídeo).
// o.tipo: 'gripe' (RNA em 8 pedaços, espículas H e N), 'corona' (RNA, proteína S), 'hiv' (2 RNAs, capsídeo em cone, gp120),
//   'herpes' (DNA, capsídeo icosaédrico com envelope), 'dengue' (RNA, envelope liso), 'nu' (sem envelope: adenovírus, HPV)
// Partes (0 a 1, para montar aos poucos): o.gen ácido nucleico, o.cap capsídeo, o.env envelope, o.esp espículas.
// o.corte (0 a 1): 0 = fechado (o envelope esconde o miolo), 1 = aberto ao meio. o.ac 'dna' | 'rna' troca o ácido nucleico.
// o.rot gira; o.ph anima; o.solta e o.desfaz como em envelope; o.fibras (vírus nu) fibras nos vértices; o.enz true mostra enzimas (HIV)
const VTIPO = {
  gripe: { ac: 'rna', seg: 8, cap: 'hel', esp: 22, et: i => i % 4 === 3 ? 'N' : 'H', mat: true },
  corona: { ac: 'rna', cap: 'hel', esp: 16, et: 'S', el: .42 },
  hiv: { ac: 'rna', cap: 'cone', esp: 10, et: 'gp', mat: true },
  herpes: { ac: 'dna', cap: 'ico', esp: 20, et: 'bola', capR: .55 },
  dengue: { ac: 'rna', cap: 'ico', esp: 30, et: 'bola', el: .16, capR: .62 },
  nu: { ac: 'dna', cap: 'ico', esp: 0, sem: true }
};
function virion(x, y, r, o = {}) {
  const a = alfa(o); if (a <= .02 || r < 3) return;
  const T = VTIPO[o.tipo] || VTIPO.gripe, ac = o.ac || T.ac, ph = o.ph || 0, rot = o.rot || 0;
  const g = o.gen == null ? 1 : o.gen, cp = o.cap == null ? 1 : o.cap, ev = T.sem ? 0 : (o.env == null ? 1 : o.env), es = T.sem ? 0 : (o.esp == null ? 1 : o.esp);
  const corte = o.corte == null ? 0 : cl(+o.corte, 0, 1), rc = T.sem ? r : r * (T.capR || .8);
  X.save(); X.globalAlpha *= a;
  // espículas e envelope por trás do miolo (o envelope é desenhado depois, por cima, com o miolo escondido se fechado)
  if (T.cap === 'ico') {
    if (cp > .02) icosa(x, y, rc * (T.sem ? 1 : .92), { rx: .42 + ph * .05, ry: rot + .6, a: cp, c: o.c });
    if (g > .02) { X.save(); X.globalAlpha *= g * (cp > .5 ? .9 : 1); novelo(x, y, rc * .55, { tipo: ac, ph, seed: 11 }); X.restore(); }
    if (T.sem && o.fibras && cp > .5) for (let i = 0; i < 6; i++) { const q = rot + i / 6 * TAU + .5; line(x + Math.cos(q) * rc * .9, y + Math.sin(q) * rc * .9, x + Math.cos(q) * rc * 1.5, y + Math.sin(q) * rc * 1.5, C.capsideo, 1.5); circ(x + Math.cos(q) * rc * 1.55, y + Math.sin(q) * rc * 1.55, Math.max(2, rc * .08), C.capsideo); }
  } else if (T.cap === 'cone') {
    const L = rc * 1.15, w0 = rc * .28, w1 = rc * .62, ca = rot - .5, ux = Math.cos(ca), uy = Math.sin(ca), nx = -uy, ny = ux;
    const P = [[x - ux * L / 2 + nx * w0, y - uy * L / 2 + ny * w0], [x + ux * L / 2 + nx * w1, y + uy * L / 2 + ny * w1], [x + ux * L / 2 - nx * w1, y + uy * L / 2 - ny * w1], [x - ux * L / 2 - nx * w0, y - uy * L / 2 - ny * w0]];
    if (cp > .02) { X.save(); X.globalAlpha *= cp; shape(P, rgba(o.c || C.capsideo, .18), o.c || C.capsideo, 1.8); X.restore(); }
    if (g > .02) for (const s of [-1, 1]) fita([[x - ux * L * .3 + nx * s * rc * .1, y - uy * L * .3 + ny * s * rc * .1], [x + ux * L * .32 + nx * s * rc * .22, y + uy * L * .32 + ny * s * rc * .22]], { c: C.rna, amp: Math.max(1.5, rc * .06), ond: rc * .35, ph: ph + s, a: g, lw: r < 30 ? 1.5 : 2 });
    if (o.enz && g > .5) for (const [u, v] of [[.25, .3], [-.05, -.32], [.38, -.1]]) circ(x + ux * L * u + nx * v * rc, y + uy * L * u + ny * v * rc, Math.max(2, rc * .07), C.amber, 'rgba(11,15,28,.6)', 1);
  } else { // nucleocapsídeo helicoidal: o RNA coberto de capsômeros
    if (g > .02) novelo(x, y, rc * .8, { tipo: ac, seg: T.seg, ph, seed: 5, a: g });
    if (cp > .02) {
      const R0 = rng(3), nb = Math.round(r * (T.seg ? 1 : .8));
      X.save(); X.globalAlpha *= cp;
      for (let i = 0; i < nb; i++) { const q = R0() * TAU, d = Math.sqrt(R0()) * rc * .72; circ(x + Math.cos(q) * d, y + Math.sin(q) * d, Math.max(1.5, r * .045), mix('#1A2033', o.c || C.capsideo, .75), 'rgba(11,15,28,.5)', 1); }
      X.restore();
    }
  }
  if (!T.sem) {
    if (T.mat && ev > .02) { X.save(); X.globalAlpha *= ev * (1 - cl(o.desfaz || 0, 0, 1)); circ(x, y, r * .9, null, rgba(C.capsideo, .5), Math.max(1.5, r * .04)); X.restore(); }
    if (ev > .02 && corte < 1) { X.save(); X.globalAlpha *= ev * (1 - corte) * (1 - cl(o.desfaz || 0, 0, 1)); circ(x, y, r, '#1E1830'); circ(x, y, r, rgba(C.envelope, .14)); X.restore(); }
    envelope(x, y, r, { a: ev, esp: o.espN || T.esp, mostra: es, espTipo: T.et, espLen: r * (T.el || .3), rot, solta: o.solta, desfaz: o.desfaz });
  }
  X.restore();
}

// bacteriófago T4. (x, y) é a placa basal (ponta da cauda); ang aponta da placa basal para a cabeça (padrão -PI/2, cabeça para cima);
// s é a altura total. o.contrai (0 a 1) contrai a bainha da cauda e o tubo atravessa a parede; o.pernas (0 recolhidas, 1 abertas e presas);
// o.dna (0 a 1) quanto DNA ainda há na cabeça (0 = cabeça vazia); o.c cor; o.dnaC cor do DNA (padrão C.dnaClaro).
// Devolve { hx, hy } (centro da cabeça) e { tx, ty } (ponta do tubo interno, de onde sai o DNA).
function fago(x, y, s, o = {}) {
  const a = alfa(o), ang = o.ang == null ? -PI / 2 : o.ang, ux = Math.cos(ang), uy = Math.sin(ang), nx = -uy, ny = ux;
  const k = cl(o.contrai || 0, 0, 1), pe = o.pernas == null ? 1 : cl(o.pernas, 0, 1), c = o.c || C.capsideo, dq = o.dna == null ? 1 : cl(o.dna, 0, 1);
  const P = (u, v) => [x + ux * u + nx * v, y + uy * u + ny * v];
  const Lt = s * .42 * (1 - .45 * k), sw = s * (.045 + .02 * k), hc = Lt + s * .05 + s * .24, hh = s * .24, hw = s * .16, tip = -s * .1 * k;
  if (a > .02) {
    X.save(); X.globalAlpha *= a; X.lineJoin = 'round'; X.lineCap = 'round';
    // fibras da cauda (as de trás mais apagadas)
    for (const [sg, al] of [[-1, .5], [1, .5], [-1, 1], [1, 1]]) {
      const off = al < 1 ? .55 : 1, b = P(0, sg * s * .08 * off), kn = P(lerp(s * .24, s * .06, pe), sg * lerp(s * .11, s * .3, pe) * off), ft = P(lerp(s * .04, -s * .1, pe), sg * lerp(s * .12, s * .4, pe) * off);
      X.globalAlpha = a * al; poly([b, kn, ft], c, Math.max(1, s * .016));
    }
    X.globalAlpha = a;
    // tubo interno (aparece quando a bainha contrai) e bainha com anéis
    poly([P(tip, 0), P(Lt + s * .03, 0)], light(c, .2), Math.max(1.5, s * .03));
    shape([P(0, -sw), P(Lt, -sw), P(Lt, sw), P(0, sw)], mix('#1A2033', c, .55), light(c, .2), 1);
    const nr = Math.max(3, Math.round(Lt / (s * .035))); for (let i = 1; i < nr; i++) { const u = Lt * i / nr; line(...P(u, -sw), ...P(u, sw), 'rgba(11,15,28,.55)', 1); }
    shape([P(-s * .02, -s * .1), P(s * .025, -s * .09), P(s * .025, s * .09), P(-s * .02, s * .1)], mix('#1A2033', c, .7), light(c, .2), 1);
    shape([P(Lt, -s * .07), P(Lt + s * .04, -s * .06), P(Lt + s * .04, s * .06), P(Lt, s * .07)], mix('#1A2033', c, .7), light(c, .2), 1);
    // cabeça (icosaedro alongado) com o DNA
    const hd = [P(hc - hh, 0), P(hc - hh * .55, -hw), P(hc + hh * .55, -hw), P(hc + hh, 0), P(hc + hh * .55, hw), P(hc - hh * .55, hw)];
    shape(hd, dq > .02 ? 'rgba(26,32,51,.92)' : 'rgba(26,32,51,.6)', light(c, .2), 1.6);
    if (dq > .02) { const [hx, hy] = P(hc, 0); novelo(hx, hy, hw * .95 * Math.sqrt(dq), { tipo: 'dna', c: o.dnaC || C.dnaClaro, seed: 9, lw: Math.max(1, s * .012), a: Math.min(1, dq * 1.5) }); }
    for (const [p, q] of [[P(hc - hh * .55, -hw), P(hc, 0)], [P(hc - hh * .55, hw), P(hc, 0)], [P(hc, 0), P(hc + hh * .55, -hw)], [P(hc, 0), P(hc + hh * .55, hw)]]) line(...p, ...q, rgba(c, .45), 1);
    X.restore();
  }
  const [hx, hy] = P(hc, 0), [tx, ty] = P(tip, 0); return { hx, hy, tx, ty };
}

// cromossomo circular de bactéria (laço de DNA). o.c (padrão C.dnaEscuro); o.ins = { f, len, c, k } trecho inserido
// (prófago: f posição de 0 a 1, len fração do laço, c cor, padrão C.dnaClaro, k de 0 a 1 o quanto já entrou); o.pic (0 a 1) DNA picotado;
// o.lw. Devolve pos(f) que dá o [x, y] de um ponto do laço (para rótulos).
function cromCirc(x, y, rx, ry, o = {}) {
  const a = alfa(o), N = 96, R = rng(o.seed || 21), wob = [];
  for (let i = 0; i < 6; i++) wob.push([R() * TAU, .04 + R() * .06]);
  const pt = f => { const g = f * TAU, w = 1 + wob.reduce((s, [p, m], j) => s + Math.sin(g * (j + 2) + p) * m * .5, 0); return [x + Math.cos(g) * rx * w, y + Math.sin(g) * ry * w]; };
  if (a > .02) {
    const c = o.c || C.dnaEscuro, lw = o.lw || Math.max(1.6, Math.min(rx, ry) * .07), pic = cl(o.pic || 0, 0, 1), I = o.ins;
    X.save(); X.globalAlpha *= a; X.lineCap = 'round'; X.lineJoin = 'round';
    const inIns = f => I && (I.k == null || I.k > .02) && ((f - I.f + 1) % 1) < (I.len || .12);
    const draw = (f0, f1, col, bump) => { X.beginPath(); for (let i = 0; i <= 12; i++) { const f = lerp(f0, f1, i / 12), [px, py] = pt(f); let qx = px, qy = py; if (bump) { const m = Math.sin(i / 12 * PI) * bump, dx = px - x, dy = py - y, d = Math.hypot(dx, dy) || 1; qx += dx / d * m; qy += dy / d * m; } i ? X.lineTo(qx, qy) : X.moveTo(qx, qy); } X.strokeStyle = col; X.lineWidth = lw * 2.2; X.stroke(); X.strokeStyle = 'rgba(11,15,28,.8)'; X.lineWidth = lw * .6; X.stroke(); };
    const nseg = 24;
    for (let i = 0; i < nseg; i++) {
      let f0 = i / nseg, f1 = (i + 1) / nseg; const mid = (f0 + f1) / 2;
      if (inIns(mid)) continue;
      if (pic > 0) { const sh = (1 - pic * .6); f1 = f0 + (f1 - f0) * sh; }
      X.save(); if (pic > 0) { const R2 = rng(i + 3), dd = pic * Math.min(rx, ry) * .5 * R2(); X.translate(Math.cos(R2() * TAU) * dd, Math.sin(R2() * TAU) * dd); X.globalAlpha *= 1 - pic * .5; }
      draw(f0, f1, c); X.restore();
    }
    if (I && (I.k == null || I.k > .02)) draw(I.f, I.f + (I.len || .12), I.c || C.dnaClaro, (1 - (I.k == null ? 1 : I.k)) * Math.min(rx, ry) * .6);
    X.restore();
  }
  return pt;
}

// bactéria em corte (bacilo), centrada em (x, y), comprimento w, largura h, girada o.rot.
// Parede verde-oliva e membrana rosa por dentro; o.crom (padrão true) desenha o cromossomo circular, com o.ins e o.pic de cromCirc;
// o.ribo número de ribossomos (padrão 12); o.lise (0 a 1) a parede arrebenta; o.c cor da parede. Devolve pos(f) do cromossomo.
function bacteriaCorte(x, y, w, h, o = {}) {
  const a = alfa(o); if (a <= .02) return () => [x, y];
  const c = o.c || C.parede, ls = cl(o.lise || 0, 0, 1), r = h / 2;
  X.save(); X.globalAlpha *= a; X.translate(x, y); X.rotate(o.rot || 0);
  let pos = () => [x, y];
  if (ls < .02) {
    rr(-w / 2, -h / 2, w, h, r, rgba(C.citoplasma, .9), c, Math.max(2.5, h * .05));
    rr(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8, r - 4, null, rgba(C.membrana, .8), 1.2);
  } else {
    X.save(); X.globalAlpha *= 1 - ls; rr(-w / 2, -h / 2, w, h, r, rgba(C.citoplasma, .9)); X.restore();
    const n = 10;
    for (let i = 0; i < n; i++) { // pedaços da parede se afastando
      const f0 = i / n, f1 = f0 + 1 / n * (1 - ls * .5), g = (f0 + f1) / 2 * TAU, mv = ls * h * .6;
      X.save(); X.translate(Math.cos(g) * mv, Math.sin(g) * mv); X.globalAlpha *= 1 - ls * .7;
      X.beginPath(); for (let j = 0; j <= 8; j++) { const q = lerp(f0, f1, j / 8) * TAU; const px = Math.cos(q) * w / 2, py = Math.sin(q) * h / 2; j ? X.lineTo(px, py) : X.moveTo(px, py); }
      X.strokeStyle = c; X.lineWidth = Math.max(2.5, h * .05); X.stroke(); X.restore();
    }
  }
  const R = rng(5), nr = o.ribo == null ? 12 : o.ribo;
  X.save(); X.globalAlpha *= 1 - ls; for (let i = 0; i < nr; i++) circ((R() - .5) * (w - h * .7), (R() - .5) * h * .62, Math.max(1.5, h * .03), C.ribo); X.restore();
  if (o.crom !== false) { const pt = cromCirc(0, 0, w * .26, h * .26, { ins: o.ins, pic: o.pic, a: 1 - ls * .8, seed: o.seed }); const ca = Math.cos(o.rot || 0), sa = Math.sin(o.rot || 0); pos = f => { const [px, py] = pt(f); return [x + px * ca - py * sa, y + px * sa + py * ca]; }; }
  X.restore();
  return pos;
}

// bicamada de membrana ao longo de uma linha quebrada pts (trechos ampliados: fusão, brotamento, endocitose).
// o.d meia espessura (4); o.c (padrão C.membrana); o.fechada true fecha o contorno; o.f preenchimento (com o.fechada)
function membrana(pts, o = {}) {
  const a = alfa(o); if (a <= .02 || pts.length < 2) return;
  const c = o.c || C.membrana, d = o.d || 4, P = o.fechada ? pts.concat([pts[0]]) : pts;
  const off = sg => { const out = []; for (let i = 0; i < P.length; i++) { const p = P[i - 1] || (o.fechada ? P[P.length - 2] : P[i]), q = P[i + 1] || (o.fechada ? P[1] : P[i]), l = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; out.push([P[i][0] - (q[1] - p[1]) / l * d * sg, P[i][1] + (q[0] - p[0]) / l * d * sg]); } return out; };
  X.save(); X.globalAlpha *= a; X.lineJoin = 'round'; X.lineCap = 'round';
  if (o.fechada && o.f) shape(pts, o.f);
  poly(P, rgba(c, .3), d * 2); poly(off(1), c, 1.3); poly(off(-1), c, 1.3);
  X.restore();
}

// receptor da membrana da célula em (x, y), apontando para fora (ang). tipo: 'CD4' (linfócito T, encaixa 'gp' do HIV),
// 'ECA2' (encaixa 'S' do SARS-CoV-2), 'sial' (ácido siálico, encaixa 'H' da gripe), outro valor: receptor genérico.
// o.s comprimento (14); o.c (padrão C.receptor). Devolve [x, y] da ponta (onde a espícula encosta).
function receptor(x, y, ang, tipo, o = {}) {
  const a = alfa(o), s = o.s || 14, c = o.c || C.receptor, st = dark(c, .5);
  if (a > .02) {
    X.save(); X.globalAlpha *= a; X.translate(x, y); X.rotate(ang); X.lineCap = 'round';
    line(0, 0, s * .55, 0, c, Math.max(1.4, s * .12));
    if (tipo === 'CD4') { ell(s * .62, 0, s * .16, s * .2, 0, c, st, 1); ell(s * .9, 0, s * .14, s * .24, 0, c, st, 1); }
    else if (tipo === 'ECA2') { X.beginPath(); X.moveTo(s * .5, -s * .3); X.lineTo(s, -s * .32); X.lineTo(s * .78, -s * .1); X.lineTo(s * .78, s * .1); X.lineTo(s, s * .32); X.lineTo(s * .5, s * .3); X.closePath(); X.fillStyle = c; X.fill(); X.strokeStyle = st; X.lineWidth = 1; X.stroke(); }
    else if (tipo === 'sial') { line(s * .5, 0, s * .85, -s * .26, c, Math.max(1.2, s * .09)); line(s * .5, 0, s * .85, s * .26, c, Math.max(1.2, s * .09)); ngon(s * .9, -s * .28, s * .1, 4, 0, c); ngon(s * .9, s * .28, s * .1, 4, 0, c); }
    else { X.beginPath(); X.arc(s * .78, 0, s * .22, PI / 2, -PI / 2, true); X.strokeStyle = c; X.lineWidth = Math.max(1.4, s * .12); X.stroke(); }
    X.restore();
  }
  return [x + Math.cos(ang) * s, y + Math.sin(ang) * s];
}

// célula animal (hospedeira) em corte: membrana rosa (bicamada), citoplasma, núcleo violeta e ribossomos.
// o.nuc = { x, y, r } posição e raio do núcleo em frações (padrão { x: .15, y: .05, r: .34 }), ou false sem núcleo;
// o.ribo número de ribossomos (14); o.rec = { n, tipo, de, ate, s } receptores na membrana, entre os ângulos de e ate (radianos);
// o.hl (0 a 1) contorno âmbar de destaque; o.ond ondulação do contorno (.03); o.seed.
// Devolve { pt(ang), nx, ny, nr, rec: [{ x, y, ang, tx, ty }] } (pt dá o ponto da membrana no ângulo ang; tx, ty a ponta do receptor).
function celula(x, y, rx, ry, o = {}) {
  const a = alfa(o), w = o.ond == null ? .03 : o.ond, sd = (o.seed || 1) * 1.7;
  const pt = g => { const k = 1 + w * Math.sin(3 * g + sd) + w * .6 * Math.sin(5 * g + sd * 2); return [x + Math.cos(g) * rx * k, y + Math.sin(g) * ry * k]; };
  const nu = o.nuc === false ? null : Object.assign({ x: .15, y: .05, r: .34 }, o.nuc || {}), m = Math.min(rx, ry);
  const out = { pt, nx: nu ? x + nu.x * rx : x, ny: nu ? y + nu.y * ry : y, nr: nu ? nu.r * m : 0, rec: [] };
  if (o.rec) {
    const n = o.rec.n || 6, de = o.rec.de == null ? 0 : o.rec.de, ate = o.rec.ate == null ? TAU : o.rec.ate, full = Math.abs(ate - de - TAU) < 1e-6;
    for (let i = 0; i < n; i++) { const g = full ? de + i / n * TAU : lerp(de, ate, n > 1 ? i / (n - 1) : .5), [px, py] = pt(g), [qx, qy] = pt(g + .01), ga = Math.atan2(qy - py, qx - px) - PI / 2; out.rec.push({ x: px, y: py, ang: ga }); }
  }
  if (a <= .02) { out.rec.forEach(r => { r.tx = r.x + Math.cos(r.ang) * (o.rec.s || 14); r.ty = r.y + Math.sin(r.ang) * (o.rec.s || 14); }); return out; }
  X.save(); X.globalAlpha *= a;
  const path = (k) => { X.beginPath(); for (let i = 0; i <= 72; i++) { const g = i / 72 * TAU, [px, py] = pt(g), dx = px - x, dy = py - y; i ? X.lineTo(x + dx * k, y + dy * k) : X.moveTo(x + dx * k, y + dy * k); } X.closePath(); };
  path(1); X.fillStyle = rgba(C.citoplasma, .82); X.fill();
  const d = Math.max(3, m * .035);
  path(1 - d / m / 2); X.strokeStyle = rgba(C.membrana, .3); X.lineWidth = d; X.stroke();
  path(1); X.strokeStyle = C.membrana; X.lineWidth = 1.4; X.stroke();
  path(1 - d / m); X.strokeStyle = C.membrana; X.lineWidth = 1.1; X.stroke();
  if (o.hl) { path(1 + 6 / m); X.strokeStyle = rgba(C.amber, cl(o.hl, 0, 1)); X.lineWidth = 2; X.stroke(); }
  const R = rng((o.seed || 1) * 13), nr = o.ribo == null ? 14 : o.ribo;
  for (let i = 0; i < nr; i++) { const g = R() * TAU, k = .35 + R() * .5, [px, py] = pt(g), qx = lerp(x, px, k), qy = lerp(y, py, k); if (nu && Math.hypot(qx - out.nx, qy - out.ny) < out.nr + 4) continue; circ(qx, qy, Math.max(1.5, m * .018), C.ribo); }
  if (nu) { circ(out.nx, out.ny, out.nr, rgba(C.nucleo, .3), C.nucleo, 1.6); circ(out.nx, out.ny, out.nr - 3, null, rgba(C.nucleo, .5), 1); circ(out.nx + out.nr * .25, out.ny - out.nr * .2, out.nr * .22, rgba(C.dnaEscuro, .8)); }
  for (const r of out.rec) { const [tx, ty] = receptor(r.x, r.y, r.ang, o.rec.tipo, { s: o.rec.s, c: o.rec.c }); r.tx = tx; r.ty = ty; }
  X.restore();
  return out;
}

// anticorpo (Y) com o pé em (x, y), braços apontando para ang, tamanho s. o.c (padrão C.anticorpo); o.lw
function anticorpo(x, y, ang, s, o = {}) {
  const a = alfa(o); if (a <= .02) return; const c = o.c || C.anticorpo, lw = o.lw || Math.max(1.6, s * .12);
  X.save(); X.globalAlpha *= a; X.translate(x, y); X.rotate(ang); X.lineCap = 'round'; X.lineJoin = 'round';
  poly([[0, 0], [s * .5, 0]], c, lw); poly([[s * .5, 0], [s, -s * .36]], c, lw); poly([[s * .5, 0], [s, s * .36]], c, lw);
  X.restore();
}

// barra de escala horizontal: de x a x + w, na altura y, com o texto em cima (fonte de dados)
function regua(x, y, w, s, o = {}) {
  const c = o.c || C.txt; line(x, y, x + w, y, c, 1.5); line(x, y - 4, x, y + 4, c, 1.5); line(x + w, y - 4, x + w, y + 4, c, 1.5);
  tx(s, x + w / 2, y - 11, { f: FD, s: 12, w: 500, c });
}

// ---------- cartões para classificar ----------
// Toque no cartão e depois no alvo (no mouse e na caneta também dá para arrastar). Só a resposta certa fica; a errada volta e explica.
// const B = baralho({ nome: 'bar', cartas: [{ t: 'tem DNA ou RNA', k: 0, t2: 'texto depois de colocado (opcional)' }], alvos: [{ t: 'como um ser vivo', c: C.ok }],
//   certo: (carta, S) => 'texto', errado: (carta, alvo, S) => 'texto', fim: S => 'texto' });
// No tópico: init(S) { B.zera(S) }; tap(x, y, S) { if (B.tap(x, y, S)) return; ... }; grab: B.grab, grabMove: B.grabMove, grabEnd: B.grabEnd.
// No draw: B.draw(S, { x0, y0, x1, y1 }, { cols, cartaH, slotH, alvoRect(k, n, caixa) }) e cap(B.msg(S)). slotH: altura máxima do cartão já colocado.
// Estado em S[nome]: { onde: { i: k }, sel, msg, erros, fim }. B.feito(S) diz se acabou; B.resolver(S) põe tudo no lugar.
function baralho(cfg) {
  const nm = cfg.nome || 'bar', cartas = cfg.cartas.map((c, i) => Object.assign({ i }, c)), alvos = cfg.alvos;
  const st = S => S[nm] || (S[nm] = { onde: {}, sel: null, msg: null, erros: 0, fim: false, pos: {}, bate: {}, tapT: 0 });
  const B = {
    cartas, alvos,
    zera(S) { S[nm] = null; st(S); },
    msg: S => st(S).msg,
    feito: S => st(S).fim,
    resolver(S) { const b = st(S); cartas.forEach(c => { b.onde[c.i] = c.k; }); b.sel = null; b.fim = true; b.msg = cfg.fim ? cfg.fim(S) : null; },
    soltar(S, i, k) {
      const b = st(S), c = cartas[i]; b.sel = null; if (b.onde[i] != null) return;
      if (c.k === k) { b.onde[i] = k; b.msg = cfg.certo ? cfg.certo(c, S) : null; if (cartas.every(q => b.onde[q.i] != null)) { b.fim = true; if (cfg.fim) b.msg = cfg.fim(S); } }
      else { b.bate[i] = 1; b.erros++; b.msg = cfg.errado ? cfg.errado(c, alvos[k], S) : null; }
    },
    tap(x, y, S) {
      const b = st(S), now = performance.now(); if (now - b.tapT < 200) return true; b.tapT = now;
      const h = hitAt(x, y); if (typeof h !== 'string' || !h.startsWith(nm + ':')) return false;
      const [kind, v] = h.slice(nm.length + 1).split('='); const n = +v;
      if (kind === 'c') { if (b.onde[n] == null) b.sel = b.sel === n ? null : n; return true; }
      if (kind === 'a') { if (b.sel != null) B.soltar(S, b.sel, n); else if (!b.fim) b.msg = cfg.dica || 'Primeiro toque num cartão; depois, no lugar certo.'; return true; }
      return false;
    },
    grab(x, y, S) { const b = st(S), h = hitAt(x, y); if (typeof h === 'string' && h.startsWith(nm + ':c=')) { const n = +h.split('=')[1]; if (b.onde[n] == null) { b.drag = { i: n, x, y }; b.sel = n; return true; } } return false; },
    grabMove(x, y, S) { const b = st(S); if (b.drag) { b.drag.x = x; b.drag.y = y; } },
    grabEnd(x, y, S) { const b = st(S), d = b.drag; b.drag = null; if (!d) return; const h = hitAt(x, y); if (typeof h === 'string' && h.startsWith(nm + ':a=')) B.soltar(S, d.i, +h.split('=')[1]); },
    draw(S, bx, o = {}) {
      const b = st(S), dt = S.dt || .016, g = NAR ? 6 : 8, na = alvos.length;
      const pend = cartas.filter(c => b.onde[c.i] == null), cols = o.cols || (NAR ? 2 : 4), ch = o.cartaH || (NAR ? 38 : 42);
      const rows = Math.ceil(cartas.length / cols);
      const bw = bx.x1 - bx.x0, cw = (bw - (cols - 1) * g) / cols, ay0 = bx.y0 + rows * (ch + g) + 4;
      const aRect = o.alvoRect || ((k) => { const st2 = NAR && na > 2, c2 = st2 ? 2 : na, rw = (bw - (c2 - 1) * 12) / c2, nrw = Math.ceil(na / c2), rh = (bx.y1 - ay0 - (nrw - 1) * 10) / nrw; return { x: bx.x0 + (k % c2) * (rw + 12), y: ay0 + Math.floor(k / c2) * (rh + 10), w: rw, h: rh }; });
      // alvos
      const R = alvos.map((al, k) => aRect(k, na, bx));
      R.forEach((r, k) => {
        const al = alvos[k], on = b.sel != null;
        rr(r.x, r.y, r.w, r.h, 12, rgba(al.c, .08), rgba(al.c, on ? .9 : .5), on ? 2 : 1.4); hitR(r.x, r.y, r.w, r.h, nm + ':a=' + k);
        title(al.t, r.x + r.w / 2, r.y + (NAR ? 15 : 17), r.w - 12, { c: al.c, s: NAR ? 13 : 15 });
      });
      // posição-alvo de cada cartão
      const capa = k => cartas.filter(c => c.k === k).length;
      const tgt = c => {
        const k = b.onde[c.i];
        if (k == null) { const j = pend.indexOf(c); return [bx.x0 + (j % cols) * (cw + g), bx.y0 + Math.floor(j / cols) * (ch + g), cw, ch]; }
        const r = R[k], ord = cartas.filter(q => b.onde[q.i] === k), j = ord.indexOf(c), hd = NAR ? 30 : 34, sh = Math.min(o.slotH || ch * .8, (r.h - hd - 6) / Math.max(1, capa(k)) - 4);
        return [r.x + 6, r.y + hd + j * (sh + 4), r.w - 12, sh];
      };
      const ord = cartas.slice().sort((p, q) => (b.drag && p.i === b.drag.i) - (b.drag && q.i === b.drag.i));
      for (const c of ord) {
        const [tx0, ty0, tw0, th0] = tgt(c), p = b.pos[c.i] || (b.pos[c.i] = { x: tx0, y: ty0, w: tw0, h: th0 }), k = 1 - Math.exp(-10 * Math.max(dt, .016));
        p.x = lerp(p.x, tx0, k); p.y = lerp(p.y, ty0, k); p.w = lerp(p.w, tw0, k); p.h = lerp(p.h, th0, k);
        let ox = 0; if (b.bate[c.i]) { b.bate[c.i] = Math.max(0, b.bate[c.i] - Math.max(dt, .016) * 1.6); ox = Math.sin(b.bate[c.i] * 30) * 6 * b.bate[c.i]; }
        let x = p.x + ox, y = p.y; if (b.drag && b.drag.i === c.i) { x = b.drag.x - p.w / 2; y = b.drag.y - p.h / 2; }
        const k2 = b.onde[c.i], sel = b.sel === c.i, bc = sel ? C.amber : k2 != null ? alvos[k2].c : 'rgba(157,169,196,.5)';
        rr(x, y, p.w, p.h, 8, 'rgba(19,26,43,.94)', bc, sel ? 2.5 : 1.3);
        if (k2 == null && !(b.drag && b.drag.i === c.i)) hitR(x, y, p.w, p.h, nm + ':c=' + c.i);
        if (c.ic) { X.save(); X.beginPath(); X.rect(x, y, p.w, p.h); X.clip(); c.ic(x + p.w / 2, y + p.h / 2, p.w, p.h, k2 != null); X.restore(); continue; }
        const txt = k2 != null && c.t2 ? c.t2 : c.t, fs = k2 != null ? 12 : (NAR ? 12 : 13), lh = fs + 3, th = wrapTx(txt, 0, 0, p.w - 12, { s: fs, w: 600, lh, dry: true });
        X.save(); X.beginPath(); X.rect(x, y, p.w, p.h); X.clip();
        wrapTx(txt, x + p.w / 2, y + p.h / 2 - th / 2 + lh / 2, p.w - 12, { s: fs, w: 600, lh, c: C.txt });
        X.restore();
      }
      return R;
    }
  };
  return B;
}

// legenda do passo (HTML, quebra a linha sozinha no celular)
let capLast = null;
function cap(html) { if (html !== capLast) { capLast = html; $('cap').innerHTML = html || ''; } }

// ---------- ajudantes comuns às cenas ----------
const passo = S => S.paused ? .12 : Math.min(.05, S.dt || .016);
const modo = (id, t) => ({ t, on: S => { S.modo = id; }, pressed: S => S.modo === id });
const toque = S => { const now = performance.now(), ok = now - (S.tapT || 0) > 200; S.tapT = now; return ok; };
// botão desenhado no canvas: devolve nada; id vira área de toque. o.on = destacado, o.s = tamanho do texto, o.tc = cor do texto
function btn(x, y, w, h, s, c, id, o = {}) {
  const on = !!o.on; rr(x, y, w, h, 10, rgba(c, on ? .22 : .08), rgba(c, on ? 1 : .55), on ? 2 : 1.3); if (id != null) hitR(x, y, w, h, id);
  wrapTx(s, x + w / 2, y + h / 2 - (wrapTx(s, 0, 0, w - 10, { s: o.s || (NAR ? 12 : 13), w: 600, lh: (o.s || (NAR ? 12 : 13)) + 3, dry: true }) - ((o.s || (NAR ? 12 : 13)) + 3)) / 2, w - 10, { s: o.s || (NAR ? 12 : 13), w: 600, lh: (o.s || (NAR ? 12 : 13)) + 3, c: o.tc || C.txt });
}
// silhueta humana neutra (sem detalhes): cabeça, tronco, braços e pernas. (x, y) = centro; h = altura total
function silhueta(x, y, h, c, a = 1) {
  const f = rgba(c || '#9DA9C4', .16 * a), s = rgba(c || '#9DA9C4', .7 * a), u = h / 10;
  circ(x, y - 4.1 * u, .9 * u, f, s, 1.5);
  rr(x - 1.3 * u, y - 3 * u, 2.6 * u, 4.2 * u, u, f, s, 1.5);
  rr(x - 2.5 * u, y - 2.9 * u, .9 * u, 3.8 * u, .45 * u, f, s, 1.5); rr(x + 1.6 * u, y - 2.9 * u, .9 * u, 3.8 * u, .45 * u, f, s, 1.5);
  rr(x - 1.25 * u, y + 1 * u, 1.1 * u, 4 * u, .5 * u, f, s, 1.5); rr(x + .15 * u, y + 1 * u, 1.1 * u, 4 * u, .5 * u, f, s, 1.5);
}

// ---------- ajudantes da evolução (paleta do guia docs/visual/evolucao-ecologia.md) ----------
const EV = { origem: '#F25C3B', ouro: '#F7C13B', violeta: '#9A6BFF', lamarck: '#B79BFF', darwin: '#2FCFBF', cinza: '#9AA3B2', solo: '#8A6A4A', creme: '#FFE1A6', azS: '#4B7BFF', laR: '#FF9A3C', rosa: '#F06AAE', gelo: '#CFE0FF', verde: '#3FBF6A', verdeEsc: '#2A9450', agua: '#2A9FC9', lima: '#A9C54A', ocre: '#D9A441', areia: '#E8D9B5', graf: '#4A4A4A', coral: '#FF6B6B', foco: '#8FD8FF', alerta: '#FF6B7D', marrom: '#A5543A', oxi: '#7FB8E8' };
const fsz = () => NAR ? 12 : 13;
// botão de modo do tópico (extra): zera a mensagem e o relógio local do modo; em movimento reduzido abre no estado final
const mdE = (id, t, f) => ({ t, on: S => { S.modo = id; S.msg = null; S.fl = null; S.t0 = agora(S); if (f) f(S); }, pressed: S => S.modo === id });
const lt = S => S.ph - (S.t0 || 0);
const agora = S => S.paused ? S.ph - 99 : S.ph; // instante de início de uma ação: em movimento reduzido já cai no estado final
// fase de um processo: laço suave de T segundos que para no estado final depois de n ciclos
const ciclo = (l, T, n = 2) => l >= T * n ? 1 : Math.min(1, (l % T) / (T * .88));
const hid = (x, y) => { const h = hitAt(x, y); return typeof h === 'string' ? h : null; };
const flash = (S, id) => { S.fl = { id, t: performance.now() }; };
const isf = (S, id) => S.fl && S.fl.id === id && performance.now() - S.fl.t < 900;
// botão no canvas com anel gelo ao tocar (retorno em menos de 100 ms)
const bt = (S, x, y, w, h, s, c, id, on) => { btn(x, y, w, h, s, c, id, { on }); if (isf(S, id)) rr(x - 2, y - 2, w + 4, h + 4, 12, null, EV.foco, 2); };
const visto = (x, y, r, c) => { X.save(); X.lineCap = 'round'; X.lineJoin = 'round'; poly([[x - r * .6, y], [x - r * .15, y + r * .5], [x + r * .65, y - r * .45]], c || EV.verde, 2.4); X.restore(); };
const xis = (x, y, r, c) => { X.save(); X.lineCap = 'round'; line(x - r * .5, y - r * .5, x + r * .5, y + r * .5, c || EV.alerta, 2.4); line(x + r * .5, y - r * .5, x - r * .5, y + r * .5, c || EV.alerta, 2.4); X.restore(); };
const gau = (x, m, sd) => Math.exp(-.5 * ((x - m) / sd) ** 2);
const nome = (s, x, y, o) => mtx(s, x, y, Object.assign({ s: fsz(), c: C.dim }, o));
const mkdrag = (ps, soltar) => ({
  grab(x, y, S) { const h = hid(x, y); if (h && h.startsWith(ps) && h.length > ps.length) { S.dr = { i: +h.slice(ps.length), x, y }; return true; } return false; },
  grabMove(x, y, S) { if (S.dr) { S.dr.x = x; S.dr.y = y; } },
  grabEnd(x, y, S) { const d = S.dr; S.dr = null; if (d) soltar(S, d.i, hid(x, y)); }
});
// pulso de convite: dois ciclos ao abrir o tópico, depois para
function pulso(S, x, y, r) { const l = lt(S); if (S.paused || l > 4.4) return; const k = fr(l / 1.1); X.save(); X.globalAlpha *= (1 - k) * .8; circ(x, y, r + k * 10, null, EV.foco, 2); X.restore(); }
// alelo: 0 claro (areia), 1 escuro (grafite com contorno gelo), 2 resistência (coral); o.mut = contorno brilhante de mutação nova
function alelo(x, y, r, k, o = {}) {
  if (o.mut) circ(x, y, r + 3.5, rgba(EV.creme, .25), EV.creme, 1.5);
  circ(x, y, r, [EV.areia, EV.graf, EV.coral][k] || k, k === 1 ? EV.gelo : 'rgba(11,15,28,.5)', k === 1 ? 1.5 : 1);
}
// curva em sino: fn(v) em 0..1 para v de -3,5 a 3,5; desenha entre x0 e x1 com base em yb e altura h
function curva(fn, x0, x1, yb, h, o = {}) {
  const P = []; for (let i = 0; i <= 56; i++) { const v = -3.5 + 7 * i / 56; P.push([lerp(x0, x1, i / 56), yb - h * Math.min(1.05, fn(v))]); }
  if (o.f) { X.beginPath(); X.moveTo(x0, yb); P.forEach(q => X.lineTo(q[0], q[1])); X.lineTo(x1, yb); X.closePath(); X.fillStyle = o.f; X.fill(); }
  if (o.s) poly(P, o.s, o.lw || 2, o.dash);
}
// régua do tempo geológico fixa (bilhões de anos atrás, de 4,6 até hoje); marcador âmbar em ga. Devolve a base y
function reguaGeo(x, y, w, ga, o = {}) {
  const SG = [[4.6, 3.8, '#9AA3B2', 'Terra'], [3.8, 2.4, '#A5543A', 'vida sem oxigênio'], [2.4, 2.0, '#7FB8E8', 'oxigênio'], [2.0, .6, '#3FBF6A', 'eucariontes'], [.6, 0, '#2A9450', 'animais e plantas']], xv = g => x + (4.6 - g) / 4.6 * w, h = NAR ? 16 : 18;
  if (!o.semTitulo) tx('bilhões de anos atrás', x, y - 12, { s: 12, c: C.dim, a: 'left', bg: false });
  SG.forEach(([a, b, c, n]) => { const x0 = xv(a), x1 = xv(b); rr(x0, y, x1 - x0 - 1, h, 3, c, null); if (x1 - x0 > (NAR ? 64 : 92)) tx(n, (x0 + x1) / 2, y + h / 2 + .5, { s: 12, w: 600, c: '#0B0F1C', bg: false }); });
  [[4.6, '4,6'], [3.8, '3,8'], [2.4, '2,4'], [2.0, '2,0'], [.6, '0,6'], [0, 'hoje']].forEach(([g, n]) => { if (NAR && (g === 3.8 || g === 2.0)) return; tx(n, g === 4.6 ? xv(g) : g === 0 ? xv(g) : xv(g), y + h + 11, { s: 12, f: FD, c: C.dim, a: g === 4.6 ? 'left' : g === 0 ? 'right' : 'center', bg: false }); });
  if (ga != null) { const mx = xv(cl(ga, 0, 4.6)); shape([[mx, y - 1], [mx - 6, y - 10], [mx + 6, y - 10]], C.amber); line(mx, y, mx, y + h, C.amber, 2); }
  return y + h + 22;
}

// ---------- registro das cenas ----------
const SEC = [
  { id: 'origem', t: 'Origem da vida', c: '#F25C3B' },
  { id: 'ideias', t: 'Ideias evolutivas', c: '#B79BFF' },
  { id: 'evidencias', t: 'Evidências', c: '#F7C13B' },
  { id: 'sintetica', t: 'Teoria sintética', c: '#F06AAE' },
  { id: 'selecao', t: 'Seleção natural', c: '#3FBF6A' },
  { id: 'acaso', t: 'Acaso e migração', c: '#9A6BFF' },
  { id: 'especiacao', t: 'Especiação', c: '#2A9FC9' },
  { id: 'padroes', t: 'Padrões', c: '#A9C54A' },
  { id: 'humana', t: 'Evolução humana', c: '#D9A441' }
];
const SC = {}, ORDER = {};
const RITMO = { l: 'Ritmo', min: .25, max: 2, step: .25, v: 1, f: v => nbr(v, 2) + '×', rate: v => v };
function def(sec, id, o) { const k = sec + '/' + id; o.sec = sec; o.key = k; if (o.ctl === false) o.noCtl = true; if (!o.ctl) o.ctl = RITMO; SC[k] = o; (ORDER[sec] = ORDER[sec] || []).push(k); }
// links para fora do módulo (pares [texto, href]); o calendário de vacinação aponta para a página vigente do PNI
const LK = {
  genfatores: ['Fatores evolutivos na Genética', '../genetica/index.html#populacoes/fatores'],
  hardy: ['Hardy-Weinberg na Genética', '../genetica/index.html#populacoes/hardy-weinberg'],
  meiose: ['Meiose na Divisão celular', '../divisao-celular/index.html#meiose/fases'],
  homologia: ['Homologia e analogia na Taxonomia', '../taxonomia/index.html#cladistica/homologia'],
  cladograma: ['Cladograma na Taxonomia', '../taxonomia/index.html#cladistica/cladograma'],
  grupos: ['Grupos monofiléticos na Taxonomia', '../taxonomia/index.html#cladistica/grupos'],
  dominios: ['Os três domínios na Taxonomia', '../taxonomia/index.html#sistemas/dominios'],
  binomial: ['Nome científico na Taxonomia', '../taxonomia/index.html#nomes/binomial'],
  procarionte: ['Célula procariótica em Microrganismos', '../microrganismos/index.html#monera/celula'],
  troca: ['Troca de genes em Microrganismos', '../microrganismos/index.html#monera/reproducao'],
  doencas: ['Doenças bacterianas em Microrganismos', '../microrganismos/index.html#monera/doencas'],
  novidades: ['Novidades evolutivas dos animais', '../plantas-animais/index.html#animalia/novidades'],
  conquista: ['Plantas e a conquista da terra', '../plantas-animais/index.html#plantae/conquista'],
  respcel: ['Respiração celular na Bioenergética', '../bioenergetica/index.html#resp/geral'],
  embrio: ['Embriologia comparada', '../embriologia/index.html'],
  nucleo: ['Ácidos nucleicos em Biologia molecular', '../biologia-molecular/index.html#na/nucleotideo'],
  celula: ['Célula e organelas', '../celula/index.html'],
  plantasanimais: ['Plantas e animais', '../plantas-animais/index.html']
};

// ---------- interface ----------
function LAB_EVOLUCAO_iniciar() {
  const ST = {}; let cur = null, paused = false, last = performance.now();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // seção sem tópicos (arquivo de cenas ainda vazio): botão fica desativado, a página não quebra
  $('secs').innerHTML = SEC.map(s => `<button type="button" data-s="${s.id}"${ORDER[s.id] && ORDER[s.id].length ? '' : ' disabled title="Em breve"'}><i style="background:${s.c}"></i>${s.t}</button>`).join('');
  $('secs').onclick = e => { const b = e.target.closest('button'); if (b && ORDER[b.dataset.s] && ORDER[b.dataset.s].length) go(ORDER[b.dataset.s][0], true); };
  const fresh = o => ({ ph: paused ? (o.still == null ? 2.5 : o.still) : 0, v: paused && o.stillV != null ? o.stillV : o.ctl.v, dt: 0 });
  function setCtl(o, S) { const c = o.ctl, r = $('ctlR'); r.min = c.min; r.max = c.max; r.step = c.step; r.value = S.v; $('ctlL').textContent = c.l; $('ctlV').textContent = c.f(S.v); r.setAttribute('aria-valuetext', c.f(S.v)); if (c.chLarg == null) { let n = 0; for (let k = 0; k <= 64; k++) n = Math.max(n, String(c.f(c.min + (c.max - c.min) * k / 64)).length); c.chLarg = n; } $('ctlV').style.minWidth = `max(44px, ${c.chLarg}ch)`; }
  // o.ctlVis(S) (opcional): false esconde a faixa naquele modo do tópico (ex.: a faixa só vale para uma das interações)
  const ctlShow = (o, S) => { let v = !o.noCtl; if (v && o.ctlVis) try { v = !!o.ctlVis(S); } catch (err) { console.error(err); } $('ctlR').parentNode.hidden = !v; };
  // barra larga demais (muitos botões extras): no computador, Nomes, Pausar e Recomeçar ficam só com o ícone, em vez de a barra quebrar em duas linhas
  const barra = document.querySelector('.barra');
  function ajustaBarra() { barra.classList.remove('compacta'); if (innerWidth >= 700 && barra.offsetHeight > 70) barra.classList.add('compacta'); }
  // o.loc e o.locNota aceitam texto ou função de S: a pastilha acompanha o modo do tópico (só escreve no DOM quando o texto muda)
  let ondeUlt = null;
  const val = (f, S) => { try { return typeof f === 'function' ? f(S) : f; } catch (err) { console.error(err); return null; } };
  function ondeSync(o, S) { const loc = val(o.loc, S) || '', n = val(o.locNota, S), nota = n == null ? 'Desenho esquemático' : n, k = loc + '\u0000' + nota; if (k === ondeUlt) return; ondeUlt = k; $('ondeV').innerHTML = loc; $('ondeS').innerHTML = nota; $('ondeS').hidden = nota === ''; $('ondeM').innerHTML = nota ? nota + '.' : ''; $('ondeM').hidden = !nota; }
  function syncExtra() { const o = SC[cur], S = ST[cur]; if (!o) return; [...$('extra').children].forEach((el, i) => { const y = o.extra && o.extra[i]; if (y) { el.setAttribute('aria-pressed', y.pressed ? !!y.pressed(S) : false); el.hidden = !!(y.vis && !y.vis(S)); } }); ctlShow(o, S); ondeSync(o, S); ajustaBarra(); }
  function go(key, force, keepHash) {
    const o = SC[key]; if (!o) return; const re = key === cur; cur = key;
    if (!ST[key] || force || !re) ST[key] = fresh(o); const S = ST[key]; if (o.init) try { o.init(S); } catch (err) { console.error(err); }
    const sec = SEC.find(s => s.id === o.sec);
    [...$('secs').children].forEach(b => { const on = b.dataset.s === o.sec; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); if (on && b.scrollIntoView && $('secs').scrollWidth > $('secs').clientWidth) $('secs').scrollLeft = Math.max(0, b.offsetLeft - 24); });
    $('tops').innerHTML = ORDER[o.sec].map((k, i) => `<button type="button" data-k="${k}" class="${k === key ? 'on' : ''}"${k === key ? ' aria-current="true"' : ''}><em>${String(i + 1).padStart(2, '0')}</em><span>${SC[k].t}<small>${SC[k].s}</small></span></button>`).join('');
    $('topL').textContent = `${sec.t}: escolha um tópico`;
    // títulos podem ter <i> (nomes científicos): vão como HTML na tela e sem marcação no título da aba e no texto alternativo
    $('iS').textContent = sec.t; $('iD').style.background = o.c || sec.c; $('iT').innerHTML = o.t; $('desc').innerHTML = o.d || '';
    $('enemT').innerHTML = o.enem || ''; $('enem').hidden = !o.enem;
    $('kv').innerHTML = (o.kv || []).map(([a, b]) => `<div>${a}</div><div>${b}</div>`).join(''); $('kv').hidden = !(o.kv && o.kv.length);
    $('links').innerHTML = (o.links || []).map(([t, h]) => `<a class="btn" href="${h}">${t}</a>`).join('');
    $('tagC').style.background = o.c || sec.c; $('tagT').innerHTML = o.t; ondeUlt = null; ondeSync(o, S);
    cv.setAttribute('aria-label', `Animação: ${semTag(o.t)}. ${semTag(o.alt || o.s)}.`); cv.classList.toggle('arr', !!o.drag);
    setCtl(o, S); ctlShow(o, S); capLast = null; cap('');
    // botões extras do tópico: o.extra = [{ t, on(S), pressed(S) }]; t aceita <i>
    $('extra').innerHTML = (o.extra || []).map((b, i) => `<button type="button" data-i="${i}" aria-pressed="${b.pressed ? !!b.pressed(S) : false}">${b.t}</button>`).join('');
    syncExtra();
    document.title = `${semTag(o.t)} | Origem da vida e evolução | LAB`;
    if (!keepHash) try { history.replaceState(null, '', '#' + key); } catch (e) { /* file:// em navegadores antigos */ }
  }
  $('tops').onclick = e => { const b = e.target.closest('button'); if (b) go(b.dataset.k, true); };
  $('ctlR').oninput = e => { const o = SC[cur], S = ST[cur]; S.v = +e.target.value; S.touch = performance.now(); $('ctlV').textContent = o.ctl.f(S.v); e.target.setAttribute('aria-valuetext', o.ctl.f(S.v)); };
  $('extra').onclick = e => { const b = e.target.closest('button'); if (!b) return; const o = SC[cur], S = ST[cur], x = o.extra[+b.dataset.i]; try { x.on(S); } catch (err) { console.error(err); } syncExtra(); setCtl(o, S);
    // no celular a barra fica abaixo do palco: traz o canvas de volta à tela para mostrar o resultado do toque
    if (NAR) try { cv.scrollIntoView({ block: 'nearest' }); } catch (err) { /* navegador antigo */ } };
  $('lbls').onclick = () => { LB = !LB; $('lbls').setAttribute('aria-pressed', LB); };
  const setP = v => { paused = v; const b = $('pause'); b.title = paused ? 'Reproduzir a animação' : 'Pausar a animação'; b.setAttribute('aria-label', b.title); b.innerHTML = `<svg aria-hidden="true"><use href="#${paused ? 'ui-continuar' : 'ui-pausar'}"/></svg><span class="tx">${paused ? 'Reproduzir' : 'Pausar'}</span>`; ajustaBarra(); };
  $('pause').onclick = () => setP(!paused); if (reduce) setP(true);
  $('reset').onclick = () => go(cur, true);
  const ALL = SEC.flatMap(s => ORDER[s.id] || []); const step = d => ALL.length && go(ALL[(ALL.indexOf(cur) + d + ALL.length) % ALL.length], true);
  $('prev').onclick = () => step(-1); $('next').onclick = () => step(1);
  addEventListener('keydown', e => { if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.altKey || e.ctrlKey || e.metaKey) return; if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
  // ponteiro: o.drag(x, y, S) devolve o novo valor da faixa (arrastar no gráfico);
  // o.tap(x, y, S) recebe um toque curto (use hitAt); o.grab(x, y, S) true começa a arrastar um objeto (só mouse e caneta),
  // com o.grabMove(x, y, S) e o.grabEnd(x, y, S). Depois de um toque ou de um arrasto, os botões extras são ressincronizados.
  let dragging = false, grabbing = false, down = null;
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const dragTo = e => { const o = SC[cur]; if (!o.drag) return; const [x, y] = pos(e), v = o.drag(x, y, ST[cur]); if (v == null) return; const c = o.ctl; ST[cur].v = cl(Math.round(v / c.step) * c.step, c.min, c.max); ST[cur].touch = performance.now(); setCtl(o, ST[cur]); };
  cv.addEventListener('pointerdown', e => {
    const o = SC[cur]; if (!o) return; const [x, y] = pos(e); down = { x, y, t: performance.now() };
    if (o.grab && e.pointerType !== 'touch') { let g = false; try { g = o.grab(x, y, ST[cur]); } catch (err) { console.error(err); } if (g) { grabbing = true; try { cv.setPointerCapture(e.pointerId); } catch (err) { /* sem captura */ } return; } }
    if (o.drag) { dragging = true; try { cv.setPointerCapture(e.pointerId); } catch (err) { /* sem captura */ } dragTo(e); }
  });
  cv.addEventListener('pointermove', e => {
    const o = SC[cur]; if (!o) return; const [x, y] = pos(e);
    if (grabbing) { try { o.grabMove && o.grabMove(x, y, ST[cur]); } catch (err) { console.error(err); } return; }
    if (dragging) { dragTo(e); return; }
    if (e.pointerType === 'mouse') cv.style.cursor = (o.tap || o.grab) && hitAt(x, y) != null ? 'pointer' : '';
  });
  const up = e => {
    const o = SC[cur]; if (!o) { dragging = grabbing = false; return; } const [x, y] = pos(e);
    if (grabbing) { grabbing = false; try { o.grabEnd && o.grabEnd(x, y, ST[cur]); } catch (err) { console.error(err); } syncExtra(); down = null; return; }
    dragging = false;
    if (down && o.tap && e.type === 'pointerup' && Math.hypot(x - down.x, y - down.y) < 10 && performance.now() - down.t < 700) { try { o.tap(x, y, ST[cur]); } catch (err) { console.error(err); } syncExtra(); setCtl(o, ST[cur]); }
    down = null;
  };
  addEventListener('pointerup', up); addEventListener('pointercancel', up);
  const route = keep => { let h = ''; try { h = decodeURIComponent(location.hash.slice(1)); } catch (e) { h = ''; } const k = SC[h] ? h : (ORDER[h] && ORDER[h].length) ? ORDER[h][0] : null; if (k) { if (k !== cur) go(k, true, keep && k === h); } else if (!cur && ALL.length) go(ALL[0], true); };
  addEventListener('hashchange', () => route(true));
  if (window.ResizeObserver) new ResizeObserver(rs).observe(cv); addEventListener('resize', rs); addEventListener('resize', ajustaBarra); rs();
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
    X.clearRect(0, 0, W, H); LBS = []; HITS = []; X.save();
    try { o.draw.call(o, S.ph, S); } catch (err) { console.error(err); }
    ondeSync(o, S);
    X.restore(); X.globalAlpha = 1; X.setLineDash([]);
    requestAnimationFrame(frame);
  }
  route(false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rs);
  window.LAB_EVOLUCAO = { rotas: ALL, ir: k => go(k, true), pausar: setP, estado: () => ({ cur, paused, ph: cur ? ST[cur].ph : 0, v: cur ? ST[cur].v : 0 }) };
  requestAnimationFrame(frame);
}
