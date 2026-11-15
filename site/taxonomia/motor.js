/* LAB, módulo Taxonomia. Motor: canvas 2D, primitivas de desenho, texto com itálico, árvores e cladogramas,
   ícones de seres vivos, rotas por hash e controles.
   Código da equipe (Aurelius), derivado do motor da Histologia. Sem dependências.
   As cenas ficam em cenas-a.js ... cenas-e.js; cada uma chama def(sec, id, o). Resumo da API: /tmp/claude-0/tax/api.md */
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
  // categorias taxonômicas, na ordem do arco-íris: do domínio (violeta) à espécie (vermelho)
  dom: '#A276FF', rei: '#6E86FF', filo: '#4FA8FF', cla: '#2FC6C0', ord: '#6BCB77', fam: '#E3CF4E', gen: '#FF9A3C', esp: '#F0605D',
  // três domínios (Woese)
  bact: '#4FA8FF', arch: '#FF9A3C', euk: '#6BCB77',
  // cinco reinos (Whittaker), tons próprios que se reencaixam nos domínios
  monera: '#7FB2E5', proto: '#C58BE8', fungi: '#D9A066', plantae: '#7BD88F', animalia: '#FF8C7A',
  // cladística: novidade evolutiva (sinapomorfia) em âmbar; grupos mono (verde), para (amarelo), poli (vermelho)
  sinapo: '#FFB347', mono: '#6BCB77', para: '#F2D04B', poli: '#F0605D',
  // ossos homólogos (K3): úmero âmbar, rádio e ulna azul, punho e dedos verde
  umero: '#FFB347', radio: '#4FA8FF', dedos: '#6BCB77',
  // nome científico: gênero (laranja) e epíteto específico (vermelho), as mesmas cores das categorias
  genero: '#FF9A3C', epiteto: '#F0605D',
  // apoio
  papel: '#E9DFC6', tinta: '#3A2E1F', ok: '#6BCB77', erro: '#F0605D',
  txt: '#E8EDF7', dim: '#9DA9C4', line: '#5B6C99', amber: '#FFB347'
};
// cor de cada categoria, de 0 (domínio) a 7 (espécie)
const CAT = ['domínio', 'reino', 'filo', 'classe', 'ordem', 'família', 'gênero', 'espécie'];
const CATC = [C.dom, C.rei, C.filo, C.cla, C.ord, C.fam, C.gen, C.esp];

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

// ---------- árvores e cladogramas ----------
// Nó: { n: 'rótulo (aceita <i>)', k: [filhos] }; folha não tem k. Pode levar qualquer outro campo (id, cor, marca...).
// arvore(raiz, caixa, o) calcula x, y de cada nó, mais pai (p), profundidade (d) e folhas (tips). Devolve { raiz, nos, folhas }.
//   o.dir: 'up' (raiz embaixo, folhas no alto: cladograma, padrão), 'down' (raiz no alto: chave dicotômica), 'right' (raiz à esquerda)
//   o.estilo: 'diag' (cladograma em V, ramos retos inclinados, padrão do ENEM) ou 'ret' (ramos em cotovelo)
//   o.inclina (diag): 1 = ramos a 45° quando a caixa é quadrada; o.folhaAlinhada=false (ret): folhas na altura da sua profundidade
//   Para girar um nó, inverta n.k (n.k.reverse()) e chame arvore de novo.
function arvore(raiz, B, o = {}) {
  const dir = o.dir || 'up', est = o.estilo || 'diag', nos = [], folhas = [];
  (function walk(n, p, d) { n.p = p; n.d = d; nos.push(n); if (n.k && n.k.length) n.k.forEach(c => walk(c, n, d + 1)); else folhas.push(n); })(raiz, null, 0);
  const maxD = Math.max(...nos.map(n => n.d)) || 1, nf = folhas.length;
  const across = dir === 'right' ? [B.y0, B.y1] : [B.x0, B.x1], along = dir === 'right' ? [B.x0, B.x1] : dir === 'down' ? [B.y0, B.y1] : [B.y1, B.y0];
  folhas.forEach((f, i) => { f.u = nf > 1 ? lerp(across[0], across[1], i / (nf - 1)) : (across[0] + across[1]) / 2; });
  (function span(n) { if (n.k && n.k.length) { n.k.forEach(span); n.ua = Math.min(...n.k.map(c => c.ua)); n.ub = Math.max(...n.k.map(c => c.ub)); n.u = (n.ua + n.ub) / 2; } else { n.ua = n.ub = n.u; } })(raiz);
  const full = Math.abs(across[1] - across[0]) || 1, len = along[1] - along[0];
  nos.forEach(n => {
    let v; // posição ao longo do eixo raiz-folhas
    if (est === 'diag') v = (n.k && n.k.length) ? along[1] - Math.sign(len) * Math.min(Math.abs(len), (n.ub - n.ua) / full * Math.abs(len) * (o.inclina || 1)) : along[1];
    else v = (n.k && n.k.length) || o.folhaAlinhada === false ? lerp(along[0], along[1], n.d / maxD) : along[1];
    if (dir === 'right') { n.x = v; n.y = n.u; } else { n.x = n.u; n.y = v; }
  });
  return { raiz, nos, folhas, dir, est };
}
// ponto a uma fração f do ramo que liga o pai ao nó n (0 = pai, 1 = nó); devolve [x, y, ângulo do ramo]
function ramoPt(L, n, f) {
  const p = n.p; if (!p) { const off = 22; const [dx, dy] = L.dir === 'right' ? [-off, 0] : L.dir === 'down' ? [0, -off] : [0, off]; return [lerp(n.x + dx, n.x, f), lerp(n.y + dy, n.y, f), Math.atan2(-dy, -dx)]; }
  if (L.est === 'diag') return [lerp(p.x, n.x, f), lerp(p.y, n.y, f), Math.atan2(n.y - p.y, n.x - p.x)];
  // cotovelo: o trecho que se mede é o último (paralelo ao eixo raiz-folhas)
  if (L.dir === 'right') return [lerp(p.x, n.x, f), n.y, 0];
  return [n.x, lerp(p.y, n.y, f), L.dir === 'down' ? PI / 2 : -PI / 2];
}
// desenha o cladograma. o.cor(n) cor do ramo que chega em n; o.lw; o.tracejado(n) true para ramo tracejado;
// o.alfa(n) opacidade; o.raizLen comprimento do toco da raiz; o.no(n) desenha algo no nó interno (ou true para bolinha)
function clado(L, o = {}) {
  const cor = o.cor || (() => '#C9D3F0'), lw = o.lw || (NAR ? 2.5 : 3);
  X.lineCap = 'round';
  for (const n of L.nos) {
    const a = o.alfa ? o.alfa(n) : 1; if (a <= .02) continue;
    X.save(); X.globalAlpha *= a; const c = cor(n), dash = o.tracejado && o.tracejado(n) ? [7, 6] : null;
    if (!n.p) { const [x0, y0] = ramoPt(L, n, 0); line(x0, y0, n.x, n.y, c, lw, dash); }
    else if (L.est === 'diag') line(n.p.x, n.p.y, n.x, n.y, c, lw, dash);
    else if (L.dir === 'right') poly([[n.p.x, n.p.y], [n.p.x, n.y], [n.x, n.y]], c, lw, dash);
    else poly([[n.p.x, n.p.y], [n.x, n.p.y], [n.x, n.y]], c, lw, dash);
    X.restore();
  }
  if (o.no) for (const n of L.nos) if (n.k && n.k.length) { if (o.no === true) circ(n.x, n.y, lw * 1.3, '#C9D3F0'); else o.no(n); }
  X.lineCap = 'butt';
}
// marca de novidade evolutiva (sinapomorfia) sobre o ramo de n, na fração f: barrinha âmbar e texto ao lado
function sinapo(L, n, f, s, o = {}) {
  const [x, y, ang] = ramoPt(L, n, f), a = o.a == null ? 1 : o.a; if (a <= .02) return [x, y];
  X.save(); X.globalAlpha *= a; const px = Math.cos(ang + PI / 2) * 9, py = Math.sin(ang + PI / 2) * 9;
  X.lineCap = 'round'; line(x - px, y - py, x + px, y + py, o.c || C.sinapo, 5); X.lineCap = 'butt';
  if (s && LB) { const lado = o.lado || 'right', dx = lado === 'right' ? 14 : -14; mtx(s, x + dx, y, { s: o.s || (NAR ? 12 : 13), w: 600, c: o.c || C.sinapo, a: lado === 'right' ? 'left' : 'right' }); }
  X.restore(); return [x, y];
}
// ancestral comum mais recente de dois nós; folhas abaixo de um nó; caminho de um nó até a raiz
function mrca(a, b) { const s = new Set(); for (let n = a; n; n = n.p) s.add(n); for (let n = b; n; n = n.p) if (s.has(n)) return n; return null; }
function folhasDe(n) { return n.k && n.k.length ? n.k.flatMap(folhasDe) : [n]; }
function ateRaiz(n) { const out = []; for (; n; n = n.p) out.push(n); return out; }
function ehDescendente(n, anc) { for (; n; n = n.p) if (n === anc) return true; return false; }
// constrói a árvore a partir de uma lista aninhada: ['lampreia', ['tubarão', ['sapo', ...]]]
function deLista(v) { return Array.isArray(v) ? { n: '', k: v.map(deLista) } : (typeof v === 'object' ? v : { n: v, id: v }); }

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
    tucano(c, o) { E(-.15, .1, .38, .3, .5); E(.18, -.3, .2, .2); P(); X.moveTo(.32, -.4); X.quadraticCurveTo(.95, -.42, 1, -.2); X.quadraticCurveTo(.7, -.18, .32, -.2); X.closePath(); X.fillStyle = rgba(C.gen, .75); X.fill(); ST(); SH(-.4, .3, -.6, .8, -.3, .38); DOT(.22, -.34, .04, dark0); },
    polvo(c, o) { E(0, -.3, .42, .42); for (let i = 0; i < 6; i++) { const x0 = -.32 + i * .128; P(); X.moveTo(x0, 0); X.quadraticCurveTo(x0 + (i % 2 ? .2 : -.2), .45, x0 + (i - 2.5) * .12, .8); X.lineWidth *= 2.2; ST(); X.lineWidth /= 2.2; } DOT(-.14, -.32, .06, dark0); DOT(.14, -.32, .06, dark0); },
    abelha(c, o) { E(-.25, -.42, .26, .18, -.5); E(.15, -.45, .24, .17, .5); E(.1, .1, .48, .3); for (const sx of [-.05, .15, .35]) L(sx, -.16, sx, .37); E(-.48, .02, .17, .17); L(-.55, -.12, -.7, -.35); L(-.45, -.13, -.5, -.38); L(.58, .1, .72, .12); },
    borboleta(c, o) { E(-.38, -.25, .36, .32, -.4); E(.38, -.25, .36, .32, .4); E(-.3, .3, .24, .22, .5); E(.3, .3, .24, .22, -.5); P(); X.ellipse(0, .05, .06, .45, 0, 0, TAU); X.fillStyle = c; X.fill(); L(0, -.38, -.15, -.7); L(0, -.38, .15, -.7); },
    caranguejo(c, o) { E(0, .1, .5, .3); for (let i = 0; i < 3; i++) { L(-.42, .15 + i * .08, -.82, .3 + i * .15); L(.42, .15 + i * .08, .82, .3 + i * .15); } L(-.3, -.1, -.55, -.4); L(.3, -.1, .55, -.4); E(-.62, -.5, .17, .13, -.5); E(.62, -.5, .17, .13, .5); DOT(-.12, -.12, .05, dark0); DOT(.12, -.12, .05, dark0); },
    aranha(c, o) { for (let i = 0; i < 4; i++) { const y = -.15 + i * .1, s = i < 2 ? -1 : 1; P(); X.moveTo(-.1, y); X.lineTo(-.55, y - .35 * (i < 2 ? 1 : -.2)); X.lineTo(-.85, y + .2 + i * .1); ST(); P(); X.moveTo(.1, y); X.lineTo(.55, y - .35 * (i < 2 ? 1 : -.2)); X.lineTo(.85, y + .2 + i * .1); ST(); void s; } E(0, .2, .3, .3); E(0, -.22, .18, .16); },
    minhoca(c, o) { X.lineWidth *= 4; P(); X.moveTo(-.9, .2); X.bezierCurveTo(-.5, -.4, -.2, .5, .2, 0); X.bezierCurveTo(.5, -.35, .7, .2, .9, -.05); ST(); X.lineWidth /= 4; X.strokeStyle = dark0; for (let i = 1; i < 9; i++) { const t = i / 9, x = -.9 + t * 1.8; L(x, -.12 + Math.sin(t * 9) * .12, x, .06 + Math.sin(t * 9) * .12); } X.strokeStyle = c; },
    estrela(c, o) { P(); for (let i = 0; i < 10; i++) { const a = -PI / 2 + i * PI / 5, r = i % 2 ? .32 : .9; i ? X.lineTo(Math.cos(a) * r, Math.sin(a) * r) : X.moveTo(Math.cos(a) * r, Math.sin(a) * r); } X.closePath(); FS(); for (let i = 0; i < 5; i++) { const a = -PI / 2 + i * TAU / 5; DOT(Math.cos(a) * .45, Math.sin(a) * .45, .04, dark0); } },
    milho(c, o) { L(0, .95, 0, -.6); P(); X.ellipse(.12, -.15, .2, .48, .15, 0, TAU); X.fillStyle = rgba(C.fam, .65); X.fill(); ST(); Q(0, .6, -.6, .2, -.75, -.5); Q(0, .4, .5, .1, .7, -.3); Q(.05, .2, .5, -.2, .35, -.7); },
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

// legenda do passo (HTML, quebra a linha sozinha no celular)
let capLast = null;
function cap(html) { if (html !== capLast) { capLast = html; $('cap').innerHTML = html || ''; } }

// ---------- registro das cenas ----------
const SEC = [
  { id: 'historia', t: 'História', c: '#D8C08A' },
  { id: 'categorias', t: 'Categorias', c: C.dom },
  { id: 'especie', t: 'Espécie', c: C.esp },
  { id: 'nomes', t: 'Nomes', c: C.gen },
  { id: 'sistemas', t: 'Sistemas', c: C.euk },
  { id: 'cladistica', t: 'Cladística', c: '#E39B5B' },
  { id: 'chave', t: 'Chave', c: C.cla }
];
const SC = {}, ORDER = {};
const RITMO = { l: 'Ritmo', min: .25, max: 2, step: .25, v: 1, f: v => nbr(v, 2) + '×', rate: v => v };
function def(sec, id, o) { const k = sec + '/' + id; o.sec = sec; o.key = k; if (o.ctl === false) o.noCtl = true; if (!o.ctl) o.ctl = RITMO; SC[k] = o; (ORDER[sec] = ORDER[sec] || []).push(k); }
const LK = {
  virus: ['Vírus na Morfofisiologia', '../morfofisiologia/index.html#teoria/virus'],
  blastoporo: ['Protostômios e deuterostômios', '../embriologia/index.html#desenvolvimento/blastoporo'],
  meiose: ['Meiose na Citogenética', '../divisao-celular/index.html'],
  procarionte: ['Procarionte e eucarionte', '../morfofisiologia/index.html#tipos/lado'],
  celula: ['A célula por dentro', '../celula/index.html']
};

// ---------- interface ----------
function LAB_TAXO_iniciar() {
  const ST = {}; let cur = null, paused = false, last = performance.now();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // seção sem tópicos (arquivo de cenas ainda vazio): botão fica desativado, a página não quebra
  $('secs').innerHTML = SEC.map(s => `<button type="button" data-s="${s.id}"${ORDER[s.id] && ORDER[s.id].length ? '' : ' disabled title="Em breve"'}><i style="background:${s.c}"></i>${s.t}</button>`).join('');
  $('secs').onclick = e => { const b = e.target.closest('button'); if (b && ORDER[b.dataset.s] && ORDER[b.dataset.s].length) go(ORDER[b.dataset.s][0], true); };
  const fresh = o => ({ ph: paused ? (o.still == null ? 2.5 : o.still) : 0, v: paused && o.stillV != null ? o.stillV : o.ctl.v, dt: 0 });
  function setCtl(o, S) { const c = o.ctl, r = $('ctlR'); r.min = c.min; r.max = c.max; r.step = c.step; r.value = S.v; $('ctlL').textContent = c.l; $('ctlV').textContent = c.f(S.v); r.setAttribute('aria-valuetext', c.f(S.v)); }
  function syncExtra() { const o = SC[cur], S = ST[cur]; if (!o) return; [...$('extra').children].forEach((el, i) => { const y = o.extra && o.extra[i]; if (y) el.setAttribute('aria-pressed', y.pressed ? !!y.pressed(S) : false); }); }
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
    $('tagC').style.background = o.c || sec.c; $('tagT').innerHTML = o.t; $('ondeV').innerHTML = o.loc || ''; $('ondeS').innerHTML = o.locNota == null ? 'Desenho esquemático' : o.locNota; $('ondeS').hidden = o.locNota === '';
    cv.setAttribute('aria-label', `Animação: ${semTag(o.t)}. ${semTag(o.alt || o.s)}.`); cv.classList.toggle('arr', !!o.drag);
    setCtl(o, S); $('ctlR').parentNode.hidden = !!o.noCtl; capLast = null; cap('');
    // botões extras do tópico: o.extra = [{ t, on(S), pressed(S) }]; t aceita <i>
    $('extra').innerHTML = (o.extra || []).map((b, i) => `<button type="button" data-i="${i}" aria-pressed="${b.pressed ? !!b.pressed(S) : false}">${b.t}</button>`).join('');
    document.title = `${semTag(o.t)} | Taxonomia | LAB`;
    if (!keepHash) try { history.replaceState(null, '', '#' + key); } catch (e) { /* file:// em navegadores antigos */ }
  }
  $('tops').onclick = e => { const b = e.target.closest('button'); if (b) go(b.dataset.k, true); };
  $('ctlR').oninput = e => { const o = SC[cur], S = ST[cur]; S.v = +e.target.value; S.touch = performance.now(); $('ctlV').textContent = o.ctl.f(S.v); e.target.setAttribute('aria-valuetext', o.ctl.f(S.v)); };
  $('extra').onclick = e => { const b = e.target.closest('button'); if (!b) return; const o = SC[cur], S = ST[cur], x = o.extra[+b.dataset.i]; try { x.on(S); } catch (err) { console.error(err); } syncExtra(); setCtl(o, S);
    // no celular a barra fica abaixo do palco: traz o canvas de volta à tela para mostrar o resultado do toque
    if (NAR) try { cv.scrollIntoView({ block: 'nearest' }); } catch (err) { /* navegador antigo */ } };
  $('lbls').onclick = () => { LB = !LB; $('lbls').setAttribute('aria-pressed', LB); };
  const setP = v => { paused = v; const b = $('pause'); b.title = paused ? 'Reproduzir a animação' : 'Pausar a animação'; b.setAttribute('aria-label', b.title); b.innerHTML = `<svg aria-hidden="true"><use href="#${paused ? 'ui-continuar' : 'ui-pausar'}"/></svg><span class="tx">${paused ? 'Reproduzir' : 'Pausar'}</span>`; };
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
  const route = keep => { let h = ''; try { h = decodeURIComponent(location.hash.slice(1)); } catch (e) { h = ''; } const k = SC[h] ? h : (ORDER[h] && ORDER[h].length) ? ORDER[h][0] : null; if (k) { if (k !== cur) go(k, true, keep && k === h); } else if (!cur && ALL.length) go(SC['historia/aristoteles'] ? 'historia/aristoteles' : ALL[0], true); };
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
    X.clearRect(0, 0, W, H); LBS = []; HITS = []; X.save();
    try { o.draw.call(o, S.ph, S); } catch (err) { console.error(err); }
    X.restore(); X.globalAlpha = 1; X.setLineDash([]);
    requestAnimationFrame(frame);
  }
  route(false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rs);
  window.LAB_TAXO = { rotas: ALL, ir: k => go(k, true), pausar: setP, estado: () => ({ cur, paused, ph: cur ? ST[cur].ph : 0, v: cur ? ST[cur].v : 0 }) };
  requestAnimationFrame(frame);
}
