/* LAB, Matemática: motor comum dos módulos (♾️ Cantor, a partir do módulo 1 do ⚙️ Arquimedes e do 🔭 Galileo).
   Canvas 2D, sem dependências. Cada módulo carrega este arquivo e depois o seu, que define SECS e chama def(sec, id, o). */
'use strict';
const TAU = Math.PI * 2;
const $ = id => document.getElementById(id);
const cv = $('cv'), X = cv.getContext('2d');
const off = document.createElement('canvas'), OX = off.getContext('2d');
let W = 600, H = 500, DPR = 1, NAR = false, K = 1;

function rs() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  const r = cv.getBoundingClientRect();
  W = Math.max(240, r.width); H = Math.max(240, r.height);
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  off.width = cv.width; off.height = cv.height;
  X.setTransform(DPR, 0, 0, DPR, 0, 0); OX.setTransform(DPR, 0, 0, DPR, 0, 0);
  NAR = W < 700; K = NAR ? 1 : cl(Math.min(H / 560, W / 1100), 1, 1.2);
}

// cores fixas (guia Campo escuro + adaptação do 🌻 Fibonacci para a Matemática)
const C = {
  A: '#4B9BFF', B: '#F06AAE', res: '#FFB347',
  N: '#39E58C', Z: '#3FA9FF', Q: '#FFC53D', I: '#F06AAE', R: '#9A6BFF',
  txt: '#E8EDF7', dim: '#9DA9C4', line: '#5B6C99', faint: '#2C3757',
  panel: '#131A2B', panel2: '#1B2440', ok: '#3FBF6A', bad: '#FF6B7D', ink: '#1A1206'
};
const FT = "'Atkinson Hyperlegible Next',system-ui,sans-serif";
const FH = "'Space Grotesk','Atkinson Hyperlegible Next',system-ui,sans-serif";
const FM = "'JetBrains Mono',ui-monospace,monospace";

// ---------- utilidades ----------
const cl = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
const ss = t => { t = cl(t, 0, 1); return t * t * (3 - 2 * t); };
function hx(c) { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function rgba(c, a) { const [r, g, b] = hx(c); return `rgba(${r},${g},${b},${a})`; }
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const fm = v => {
  if (v === Infinity) return '+∞'; if (v === -Infinity) return '−∞';
  return (Math.round(v * 1000) / 1000).toString().replace('.', ',').replace('-', '−');
};
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const sup = n => String(n).split('').map(d => SUP[d]).join('');

function tx(s, x, y, o = {}) {
  X.save(); if (o.al != null) X.globalAlpha *= o.al;
  X.font = `${o.w || 600} ${(o.s || 14) * K}px ${o.f || FT}`; X.fillStyle = o.c || C.txt;
  X.textAlign = o.a || 'center'; X.textBaseline = o.b || 'middle'; X.fillText(s, x, y); X.restore();
}
function tw(s, sz, w, f) { X.font = `${w || 600} ${sz * K}px ${f || FT}`; return X.measureText(s).width; }
function fit(s, maxw, sz, w, f, min = 10) { while (sz > min && tw(s, sz, w, f) > maxw) sz--; return sz; }
function circ(x, y, r, f, s, lw) { X.beginPath(); X.arc(x, y, Math.max(.1, r), 0, TAU); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1; X.stroke(); } }
function ell(x, y, rx, ry, f, s, lw) { X.beginPath(); X.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, TAU); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1; X.stroke(); } }
function rr(x, y, w, h, r, f, s, lw) { X.beginPath(); X.roundRect(x, y, w, h, Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2))); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1; X.stroke(); } }
function line(x1, y1, x2, y2, s, lw, dash) { X.beginPath(); X.moveTo(x1, y1); X.lineTo(x2, y2); X.strokeStyle = s; X.lineWidth = lw || 1; if (dash) X.setLineDash(dash); X.stroke(); if (dash) X.setLineDash([]); }
function area() {
  const x0 = NAR ? 12 : 28, x1 = W - x0, y0 = NAR ? 50 : 62, y1 = H - (NAR ? 64 : 70);
  return { x0, x1, y0, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}
function pill(s, x, y, c, o = {}) {
  X.save(); const sz = (o.s || (NAR ? 12 : 14)) * K; X.font = `${o.w || 600} ${sz}px ${o.f || FT}`;
  const w = X.measureText(s).width + (c ? 26 : 18), h = sz + 12;
  const px = o.a === 'center' ? x - w / 2 : o.a === 'right' ? x - w : x;
  rr(px, y - h / 2, w, h, 999, o.bg || 'rgba(11,15,28,.88)', o.st || 'rgba(255,255,255,.14)', o.lw || 1);
  if (c) circ(px + 12, y, 4.5, c);
  X.fillStyle = o.tc || C.txt; X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillText(s, px + (c ? 21 : 9), y + .5);
  X.restore(); return { x: px, y: y - h / 2, w, h };
}
// ---------- estilo: profundidade discreta (🌻 Fibonacci) ----------
function blob(x, y, rx, ry, c, o = {}) {
  const g = X.createRadialGradient(x - rx * .25, y - ry * .3, 0, x, y, Math.max(rx, ry));
  g.addColorStop(0, rgba(c, o.a0 ?? .2)); g.addColorStop(1, rgba(c, o.a1 ?? .04));
  X.beginPath(); X.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, TAU); X.fillStyle = g; X.fill();
  X.save(); X.shadowColor = rgba(c, .55); X.shadowBlur = o.glow ?? 16; X.strokeStyle = c; X.lineWidth = o.lw || 2.2; X.stroke(); X.restore();
}
function frame(x, y, w, h) {
  const g = X.createLinearGradient(x, y, x, y + h); g.addColorStop(0, 'rgba(255,255,255,.04)'); g.addColorStop(1, 'rgba(255,255,255,.012)');
  rr(x, y, w, h, 16, g, 'rgba(120,138,190,.45)', 1.2);
}
function token(x, y, r, label, on, edge, o = {}) {
  X.save(); X.shadowColor = on ? rgba(C.res, .6) : 'rgba(0,0,0,.5)'; X.shadowBlur = on ? 18 : 8; X.shadowOffsetY = on ? 0 : 2;
  const g = X.createLinearGradient(x, y - r, x, y + r);
  if (on) { g.addColorStop(0, '#FFD08A'); g.addColorStop(1, '#F29A1F'); } else { g.addColorStop(0, '#26304F'); g.addColorStop(1, '#161D33'); }
  circ(x, y, r, g); X.restore();
  circ(x, y, r, null, on ? '#FFE0AE' : (edge || C.line), on ? 1.5 : 1.4);
  if (label != null) tx(label, x, y + 1, { f: FM, w: 500, s: o.s || (NAR ? 14 : 16), c: on ? C.ink : (o.tc || C.txt) });
}
function backdrop() {
  const step = 28; X.save(); X.fillStyle = 'rgba(160,178,230,.07)';
  for (let x = step / 2; x < W; x += step) for (let y = step / 2; y < H; y += step) { X.fillRect(x - .75, y - .75, 1.5, 1.5); }
  const v = X.createRadialGradient(W / 2, H * .45, Math.min(W, H) * .2, W / 2, H * .45, Math.max(W, H) * .75);
  v.addColorStop(0, 'rgba(11,15,28,0)'); v.addColorStop(1, 'rgba(11,15,28,.55)'); X.fillStyle = v; X.fillRect(0, 0, W, H); X.restore();
}
const inBox = (b, x, y) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;

// sombreamento de regiões: [['add'|'in'|'out', caminho]], caminho(ctx) desenha o contorno
function region(ops, color, alpha) {
  OX.save(); OX.setTransform(1, 0, 0, 1, 0, 0); OX.clearRect(0, 0, off.width, off.height); OX.restore();
  OX.fillStyle = color;
  for (const [m, p] of ops) {
    OX.globalCompositeOperation = m === 'add' ? 'source-over' : m === 'in' ? 'destination-in' : 'destination-out';
    OX.beginPath(); p(OX); OX.fill(p.eo ? 'evenodd' : 'nonzero');
  }
  OX.globalCompositeOperation = 'source-over';
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = alpha; X.drawImage(off, 0, 0); X.restore();
}
const pEll = (x, y, rx, ry) => c => c.ellipse(x, y, rx, ry, 0, 0, TAU);
const pRect = (x, y, w, h) => c => c.roundRect(x, y, w, h, 14);

// ---------- reta numérica ----------
function axis(L) { // L: {x0,x1,y,lo,hi}
  L.u = (L.x1 - L.x0) / (L.hi - L.lo); L.px = v => L.x0 + (cl(v, L.lo, L.hi) - L.lo) * L.u; L.val = px => L.lo + (px - L.x0) / L.u; return L;
}
function drawAxis(L, o = {}) {
  line(L.x0 - 8, L.y, L.x1 + 8, L.y, C.line, 1.5);
  X.beginPath(); X.moveTo(L.x1 + 14, L.y); X.lineTo(L.x1 + 6, L.y - 5); X.lineTo(L.x1 + 6, L.y + 5); X.closePath(); X.fillStyle = C.line; X.fill();
  const step = o.step || 1;
  for (let v = Math.ceil(L.lo); v <= L.hi + 1e-9; v += step) {
    const x = L.px(v); line(x, L.y - 5, x, L.y + 5, C.line, 1.2);
    if (o.labels !== false && (!NAR || L.u > 22 || v % 2 === 0)) tx(fm(v), x, L.y + 18, { f: FM, w: 500, s: NAR ? 11 : 12, c: C.dim });
  }
}
function ball(x, y, closed, c, r = 7.5) { X.save(); X.shadowColor = rgba(c, .7); X.shadowBlur = 10; circ(x, y, r, closed ? c : '#0B0F1C', c, 2.8); X.restore(); }
function drawIv(L, I, c, y, lw = 6) {
  y = y ?? L.y; const xa = I.a === -Infinity ? L.x0 - 6 : L.px(I.a), xb = I.b === Infinity ? L.x1 + 6 : L.px(I.b);
  if (I.a === I.b) { ball(xa, y, true, c); return; }
  X.save(); X.lineCap = 'round'; X.shadowColor = rgba(c, .6); X.shadowBlur = 14; line(xa, y, xb, y, rgba(c, .95), lw + 1); X.restore();
  if (I.a === -Infinity) { X.beginPath(); X.moveTo(xa - 10, y); X.lineTo(xa, y - 8); X.lineTo(xa, y + 8); X.closePath(); X.fillStyle = c; X.fill(); } else ball(xa, y, I.ca, c);
  if (I.b === Infinity) { X.beginPath(); X.moveTo(xb + 10, y); X.lineTo(xb, y - 8); X.lineTo(xb, y + 8); X.closePath(); X.fillStyle = c; X.fill(); } else ball(xb, y, I.cb, c);
}
// álgebra de intervalos (🔭 Galileo)
function ivInter(I, J) {
  const lo = Math.max(I.a, J.a), hi = Math.min(I.b, J.b);
  const clo = I.a === J.a ? I.ca && J.ca : (I.a > J.a ? I.ca : J.ca);
  const chi = I.b === J.b ? I.cb && J.cb : (I.b < J.b ? I.cb : J.cb);
  if (lo > hi || (lo === hi && !(clo && chi))) return [];
  return [{ a: lo, b: hi, ca: clo, cb: chi }];
}
function ivUnion(list) {
  const L = list.map(o => ({ ...o })).sort((p, q) => p.a - q.a || (q.ca - p.ca)); const out = [];
  for (const I of L) {
    const c = out[out.length - 1];
    if (c && (I.a < c.b || (I.a === c.b && (c.cb || I.ca)))) {
      if (I.b > c.b) { c.b = I.b; c.cb = I.cb; } else if (I.b === c.b) c.cb = c.cb || I.cb;
    } else out.push(I);
  }
  return out;
}
const ivComp = I => [{ a: -Infinity, b: I.a, ca: false, cb: !I.ca }, { a: I.b, b: Infinity, ca: !I.cb, cb: false }].filter(K => !(K.a === K.b && !(K.ca && K.cb)));
const ivDiff = (I, J) => ivUnion(ivComp(J).flatMap(K => ivInter(I, K)));
function ivStr(I) {
  if (I.a === I.b) return `{${fm(I.a)}}`;
  const l = I.a === -Infinity ? ']−∞' : (I.ca ? '[' : ']') + fm(I.a);
  const r = I.b === Infinity ? '+∞[' : fm(I.b) + (I.cb ? ']' : '[');
  return `${l}; ${r}`;
}
const ivsStr = L => L.length ? L.map(ivStr).join(' ∪ ') : '∅';

// ---------- registro de tópicos ----------
let SECS = [];
const TOPS = [];
const def = (sec, id, o) => { o.sec = sec; o.id = id; TOPS.push(o); };
const secOf = o => SECS.find(s => s.id === o.sec);

// ---------- montagem da página ----------
let IDX = 0, S = null, UI = [], DRAG = false, capPrev = null;
const cur = () => TOPS[IDX];
function renderQuiz() { const o = cur(), el = $('quiz'); if (o.quiz) o.html(S, el); }
function buildUI() {
  const box = $('ctls'); box.innerHTML = ''; UI = [];
  const specs = cur().ui ? cur().ui(S) : [];
  for (const sp of specs) {
    if (sp.type === 'btns') {
      const g = document.createElement('div'); g.className = 'grp'; g.setAttribute('role', 'group'); if (sp.l) g.setAttribute('aria-label', sp.l);
      if (sp.l) { const s = document.createElement('span'); s.className = 'gl'; s.textContent = sp.l; g.appendChild(s); }
      sp.items.forEach(it => {
        const b = document.createElement('button'); b.type = 'button'; b.textContent = it.l;
        b.onclick = () => { it.f(S); sync(); }; g.appendChild(b);
        UI.push(() => { if (it.on) b.setAttribute('aria-pressed', it.on(S) ? 'true' : 'false'); });
      });
      box.appendChild(g);
    } else if (sp.type === 'range') {
      const lab = document.createElement('label'); lab.className = 'ctl';
      lab.innerHTML = `<span>${sp.l}</span><input type="range" min="${sp.min}" max="${sp.max}" step="${sp.step || 1}"><output></output>`;
      const inp = lab.querySelector('input'), out = lab.querySelector('output');
      inp.value = sp.get(S); inp.oninput = () => { sp.set(S, +inp.value); sync(); };
      box.appendChild(lab);
      UI.push(() => { const v = sp.get(S); if (+inp.value !== v) inp.value = v; out.textContent = sp.fmt ? sp.fmt(v) : v; inp.setAttribute('aria-valuetext', out.textContent); });
    }
  }
  sync();
}
function sync() { UI.forEach(f => f()); }
function buildTops() {
  const box = $('tops'); box.innerHTML = '';
  SECS.forEach(sec => {
    const h = document.createElement('div'); h.className = 'sech'; h.innerHTML = `<i style="background:${sec.c}"></i>${sec.n}`; box.appendChild(h);
    TOPS.forEach((o, i) => { if (o.sec !== sec.id) return;
      const b = document.createElement('button'); b.type = 'button'; b.dataset.i = i;
      b.innerHTML = `<em>${String(i + 1).padStart(2, '0')}</em><span>${o.t}<small>${o.st}</small></span>`;
      b.onclick = () => { go(i); document.querySelector('.palco').scrollIntoView({ behavior: 'smooth', block: 'start' }); }; box.appendChild(b); });
  });
  const secs = $('secs'); secs.innerHTML = '';
  SECS.forEach(sec => { const b = document.createElement('button'); b.type = 'button'; b.dataset.s = sec.id; b.innerHTML = `<i style="background:${sec.c}"></i>${sec.n}`;
    b.onclick = () => go(TOPS.findIndex(o => o.sec === sec.id)); secs.appendChild(b); });
}
function go(i, push = true) {
  IDX = (i + TOPS.length) % TOPS.length; const o = cur(), sec = secOf(o);
  S = o.init ? o.init() : {}; S.t = 0;
  $('tagT').textContent = o.t; $('tagC').style.background = sec.c;
  $('iD').style.background = sec.c; $('iS').textContent = `${sec.n} · ${IDX + 1} de ${TOPS.length}`.replace(' · ', ', tópico ');
  $('iT').textContent = o.t; $('desc').innerHTML = o.desc;
  $('kv').innerHTML = (o.kv || []).map(([k, v]) => `<div class="q">${k}</div><div>${v}</div>`).join(''); $('kv').hidden = !(o.kv || []).length;
  $('enemT').innerHTML = o.enem;
  cv.classList.toggle('arr', !!o.drag);
  const qz = $('quiz'); qz.hidden = !o.quiz; $('cap').parentNode.hidden = !!o.quiz; if (o.quiz) renderQuiz();
  document.querySelectorAll('#tops button').forEach(b => b.classList.toggle('on', +b.dataset.i === IDX));
  document.querySelectorAll('#secs button').forEach(b => b.classList.toggle('on', b.dataset.s === o.sec));
  buildUI(); capPrev = null;
  if (push) history.replaceState(null, '', `#${o.sec}/${o.id}`);
}
function fromHash() { const [s, t] = location.hash.slice(1).split('/'); const i = TOPS.findIndex(o => o.sec === s && o.id === t); return i >= 0 ? i : TOPS.findIndex(o => o.sec === s); }
const pt = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
cv.addEventListener('pointerdown', e => { const o = cur(); if (!o.down) return; const [x, y] = pt(e); if (o.down(S, x, y) !== false) { DRAG = true; cv.setPointerCapture(e.pointerId); } sync(); });
cv.addEventListener('pointermove', e => { const o = cur(), [x, y] = pt(e); if (DRAG && o.move) { o.move(S, x, y); sync(); } else if (o.hover) cv.style.cursor = o.hover(S, x, y) || 'default'; });
const endDrag = e => { if (!DRAG) return; DRAG = false; const o = cur(); if (o.up) o.up(S, ...pt(e)); sync(); };
cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', endDrag);
$('prev').onclick = () => go(IDX - 1); $('next').onclick = () => go(IDX + 1);
$('reset').onclick = () => { const o = cur(); S = o.init ? o.init() : {}; S.t = 0; buildUI(); renderQuiz(); };
window.addEventListener('resize', rs);
document.addEventListener('lab-rebuild', () => buildUI()); // telas que mudam os controles pedem reconstrução
window.addEventListener('hashchange', () => { const i = fromHash(); if (i >= 0 && i !== IDX) go(i, false); });
let last = performance.now();
function loop(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now; S.t += dt;
  X.clearRect(0, 0, W, H); backdrop(); cur().draw(S, dt);
  const c = cur().cap ? cur().cap(S) : ''; if (c !== capPrev) { $('cap').innerHTML = c; capPrev = c; }
  requestAnimationFrame(loop);
}
window.LAB_MAT_iniciar = () => {
  rs(); buildTops(); const i = fromHash(); go(i >= 0 ? i : 0, i < 0);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rs);
  requestAnimationFrame(loop);
};
