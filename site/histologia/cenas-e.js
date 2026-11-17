/* LAB, módulo Histologia. Seção Nervoso: neurônio e arco reflexo, glia e mielina, impulso nervoso, sinapse.
   Roteiro: docs/revisao-biologia/histologia-roteiro-b.md (Sapien). Desenhos esquemáticos próprios em canvas 2D (Íris).
   Tudo fica dentro de um bloco para não colidir com os nomes das outras cenas. */
'use strict';
{
  // ---------- cores (paleta comum do motor; os tons extras são só deste arquivo) ----------
  const hexOk = c => typeof c === 'string' && /^#[0-9a-fA-F]{6}$/.test(c);
  const pc = (n, f) => (hexOk(C[n]) ? C[n] : f);
  const N = {
    neur: pc('neur', '#A276FF'), glia: pc('glia', '#8FCB8A'), nuc: pc('he_nucleo', '#7B5CD6'), rosa: pc('he_rosa', '#E7A6C4'),
    miel: pc('mielina', '#EEF4FA'), na: pc('na', '#FF9A3C'), k: pc('k', '#B9A3FF'), ca: pc('ca', '#FFD84D'),
    musc: pc('musc', '#FF8C7A'), sangue: pc('sangue', '#E0414F'), hem: pc('hemacia', '#F0605D'),
    nt: '#5CE6A0', sens: '#86B6FF', inter: '#E6D9FF', rec: '#7CC8FF', alerta: '#FF6B7D',
    pele: '#E2B49F', contorno: '#6B3B33', txt: pc('txt', '#E8EDF7'), dim: pc('dim', '#9DA9C4'), line: pc('line', '#5B6C99')
  };

  // ---------- utilidades locais ----------
  function pill(x, y, s, o = {}) {
    const sz = o.s || 13, w = tw(s, sz, o.w || 600) + 18, h = sz + 11, a = o.a || 'center', rx = a === 'left' ? x : a === 'right' ? x - w : x - w / 2;
    rr(rx, y - h / 2, w, h, 999, o.bg || 'rgba(11,15,28,.84)', o.bd || 'rgba(255,255,255,.16)', 1.2);
    tx(s, rx + w / 2, y + .5, { s: sz, w: o.w || 600, c: o.c || N.txt, bg: false }); return w;
  }
  function halo(x, y, r, c, a) { const g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c, a)); g.addColorStop(1, rgba(c, 0)); circ(x, y, r, g); }
  function spark(x, y, r = 4.5) { halo(x, y, r * 3, '#FFE7A8', .4); circ(x, y, r, '#FFF4D6', 'rgba(11,15,28,.5)', 1); }
  function subPath(p, f) {
    f = cl(f, 0, 1); const out = [p[0]]; if (f <= 0) return out; let tot = 0; const L = [];
    for (let i = 1; i < p.length; i++) { const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); L.push(d); tot += d; }
    let d = f * tot; for (let i = 0; i < L.length; i++) { if (d <= L[i]) { const k = L[i] ? d / L[i] : 0; out.push([lerp(p[i][0], p[i + 1][0], k), lerp(p[i][1], p[i + 1][1], k)]); return out; } out.push(p[i + 1]); d -= L[i]; }
    return out;
  }
  // forma desenhada duas vezes: contorno (mais grossa) e preenchimento
  function membro(pts, w, fill = N.pele, edge = N.contorno) { X.lineCap = 'round'; X.lineJoin = 'round'; poly(pts, edge, w + 3); poly(pts, fill, w); X.lineCap = 'butt'; }
  // atualiza o estado visual dos botões extras (quando a cena muda de vista sozinha)
  function syncExtra(o, S) { const el = $('extra'); if (!el || !o.extra) return; [...el.children].forEach((b, i) => { const y = o.extra[i]; if (y) b.setAttribute('aria-pressed', y.pressed ? !!y.pressed(S) : false); }); }
  // a pessoa mexeu na faixa? (o motor marca S.touch)
  function mexeu(S) { if (S.touch && S.touch !== S.lastTouch) { S.lastTouch = S.touch; return true; } return false; }
  const ms = v => (v < 10 ? nbr(v, 1) : nbr(Math.round(v))) + ' ms';

  // =====================================================================================
  // NEURÔNIO: geometria em coordenadas locais (eixo do axônio em +u, comprimento ≈ 1)
  // =====================================================================================
  function ramo(o, x, y, a, len, w, d, R, path) {
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len, p = path.concat([[x2, y2]]);
    o.seg.push([x, y, x2, y2, w]);
    if (d <= 0) { o.tips.push(p.slice().reverse()); return; }
    for (const sg of [-1, 1]) ramo(o, x2, y2, a + sg * (.32 + R() * .28), len * (.6 + R() * .18), w * .62, d - 1, R, p);
  }
  function axonPts(u0, u1, amp, n = 36) { const p = []; for (let i = 0; i <= n; i++) { const u = lerp(u0, u1, i / n); p.push([u, amp * Math.sin(u * 11)]); } return p; }
  function terminais(o, sp) {
    const e = o.axon[o.axon.length - 1];
    for (let j = 0; j < 4; j++) { const v = (j - 1.5) * sp; o.term.push([e, [e[0] + .035, e[1] + v * .5], [e[0] + .075, e[1] + v]]); }
    o.routes = o.tips.map((t, i) => t.concat(o.axon, o.term[i % 4]));
  }
  function geoMulti() {
    const R = rng(11), o = { seg: [], tips: [], soma: [.13, 0, .05, 1], my: [], term: [] };
    for (const a0 of [.56, .78, 1, 1.22, 1.44]) { const a = a0 * PI + (R() - .5) * .14, sx = .13 + Math.cos(a) * .045, sy = Math.sin(a) * .045; ramo(o, sx, sy, a, .075 + R() * .02, .017, 2, R, [[.13, 0], [sx, sy]]); }
    o.axon = axonPts(.178, .86, .01);
    for (let f = .12; f < .9; f += .105) o.my.push([f, f + .09]);
    terminais(o, .06); return o;
  }
  function geoBi() {
    const R = rng(5), o = { seg: [[.385, 0, .2, 0, .014]], tips: [], soma: [.44, 0, .045, 1.35], my: [], term: [] };
    for (const a of [PI * .82, PI, PI * 1.18]) ramo(o, .2, 0, a + (R() - .5) * .1, .06, .01, 1, R, [[.44, 0], [.385, 0], [.2, 0]]);
    o.axon = axonPts(.5, .86, .006);
    terminais(o, .045); return o;
  }
  function geoPseudo() {
    const R = rng(3), o = { seg: [], tips: [], soma: [.46, -.13, .045, 1], my: [], term: [], stalk: [[.46, -.085], [.472, -.05], [.452, -.022], [.46, 0]] };
    for (const a of [PI * .8, PI, PI * 1.2]) ramo(o, .05, 0, a, .035, .009, 1, R, [[.05, 0]]);
    o.axon = axonPts(.05, .88, .005, 48);
    o.my = [[.06, .15], [.17, .26], [.28, .37], [.39, .47], [.53, .61], [.63, .72], [.74, .83], [.85, .93]];
    o.gang = true;
    terminais(o, .045); return o;
  }
  const GM = geoMulti(), GB = geoBi(), GP = geoPseudo();

  function somaBlob(x, y, r, el, rot, col, seed) {
    X.save(); X.translate(x, y); X.rotate(rot);
    X.beginPath(); for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU, q = r * (1 + .08 * Math.sin(a * 3 + seed) + .05 * Math.sin(a * 5)); const px = Math.cos(a) * q * el, py = Math.sin(a) * q; i ? X.lineTo(px, py) : X.moveTo(px, py); } X.closePath();
    const g = X.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r * 1.2); g.addColorStop(0, light(col, .25)); g.addColorStop(1, dark(col, .15));
    X.fillStyle = g; X.fill(); X.strokeStyle = 'rgba(11,15,28,.6)'; X.lineWidth = 1.2; X.stroke();
    // corpúsculos de Nissl (retículo rugoso, muito abundante no corpo celular)
    const R = rng(seed * 7 + 1); for (let i = 0; i < 14; i++) { const a = R() * TAU, d = r * (.58 + R() * .3); circ(Math.cos(a) * d * el, Math.sin(a) * d, Math.max(.8, r * .06), rgba(N.nuc, .6)); }
    // núcleo grande e claro, com nucléolo evidente
    circ(0, 0, r * .45, light(N.nuc, .35), 'rgba(11,15,28,.45)', 1); circ(r * .08, -r * .05, Math.max(1.2, r * .12), dark(N.nuc, .25));
    X.restore();
  }
  // desenha um neurônio da geometria g; mp(u,v) devolve o ponto na tela; k = px por unidade
  function drawNeu(g, mp, k, o = {}) {
    const col = o.c || N.neur, M = p => mp(p[0], p[1]);
    X.lineCap = 'round';
    for (const s of g.seg) { const a = mp(s[0], s[1]), b = mp(s[2], s[3]); line(a[0], a[1], b[0], b[1], col, Math.max(1.3, s[4] * k)); }
    const ax = g.axon.map(M);
    poly(ax, col, Math.max(1.6, .007 * k));
    if (g.stalk) poly(g.stalk.map(M), col, Math.max(1.6, .009 * k));
    for (const t of g.term) { const p = t.map(M); poly(p, col, Math.max(1.3, .005 * k)); const e = p[p.length - 1]; circ(e[0], e[1], Math.max(2.5, .011 * k), light(col, .2), 'rgba(11,15,28,.5)', 1); }
    for (const [f0, f1] of g.my) { const pts = []; for (let i = 0; i <= 8; i++) pts.push(pth(ax, lerp(f0, f1, i / 8))); poly(pts, 'rgba(11,15,28,.75)', Math.max(5, .03 * k) + 2); poly(pts, N.miel, Math.max(5, .03 * k)); }
    X.lineCap = 'butt';
    const [sx, sy, sr, el] = g.soma, c = mp(sx, sy), d0 = mp(0, 0), d1 = mp(1, 0), rot = Math.atan2(d1[1] - d0[1], d1[0] - d0[0]);
    if (g.gang) { circ(c[0], c[1], sr * k * 1.9, rgba(N.glia, .12), rgba(N.glia, .5), 1); }
    somaBlob(c[0], c[1], sr * k, el, rot, col, o.seed || 2);
    return { ax, c, r: sr * k };
  }
  function dots(g, mp, t, n, sp) {
    const R = g.routes.map(r => r.map(p => mp(p[0], p[1])));
    for (let i = 0; i < n; i++) { const r = R[(i * 7) % R.length], f = fr(t * sp + i / n), p = pth(r, f); spark(p[0], p[1], 3.6); }
  }

  // vista 0: neurônio multipolar grande, com rótulos
  function vNeuronio(A, t) {
    const k = Math.min(A.w / 1.08, A.h / .56), ox = A.cx - k * .445, oy = A.cy - k * .03, mp = (u, v) => [ox + u * k, oy + v * k];
    const r = drawNeu(GM, mp, k);
    dots(GM, mp, t, 16, .2);
    // seta de sentido do impulso (desenho; o texto vai na legenda)
    const ay = Math.min(oy + k * .2, A.y1 - 22), a0 = mp(-.05, 0)[0], a1 = mp(.97, 0)[0];
    arrow(a0, ay, a1, ay, rgba(N.txt, .55), 1.5);
    const sub = [['recebem', -.01], ['conduz', .5], ['transmitem', .93]];
    for (const [s, u] of sub) { const w = tw(s, 13, 600) / 2 + 4; tx(s, cl(mp(u, 0)[0], A.x0 + w, A.x1 - w), ay + 14, { s: 13, w: 600, c: N.dim }); }
    // rótulos
    const d = GM.seg[GM.seg.length - 3], dp = mp(d[2], d[3]);
    lab(dp[0], dp[1], dp[0] - 30, dp[1] - 40, 'dendritos');
    lab(r.c[0], r.c[1] - r.r * .9, r.c[0] + 30, r.c[1] - r.r - 50, 'corpo celular');
    const ap = pth(r.ax, .07); lab(ap[0], ap[1], ap[0] + 10, ap[1] + 58, 'axônio');
    const mpnt = pth(r.ax, (GM.my[3][0] + GM.my[3][1]) / 2); lab(mpnt[0], mpnt[1] - k * .012, mpnt[0] + 10, mpnt[1] - 62, 'bainha de mielina');
    const tp = mp(GM.term[0][2][0], GM.term[0][2][1]); lab(tp[0], tp[1], tp[0] - 40, tp[1] - 48, 'terminais do axônio');
    if (!NAR) { lab(r.c[0], r.c[1], r.c[0] - 20, r.c[1] + r.r + 56, 'núcleo'); const np = pth(r.ax, (GM.my[5][1] + GM.my[6][0]) / 2); lab(np[0], np[1], np[0] + 10, np[1] + 56, 'nodo de Ranvier'); }
    cap('O impulso segue sempre no mesmo sentido: dos <b>dendritos</b> ao <b>corpo celular</b> e, pelo <b>axônio</b>, até os <b>terminais</b>.');
  }

  // vista 1: as três formas, lado a lado e na vertical
  function vFormas(A, t) {
    const L = [[GM, 'multipolar', 'motor: muitos dendritos e um axônio'], [GB, 'bipolar', 'retina: um dendrito e um axônio'], [GP, 'pseudounipolar', 'sensitivo: corpo celular num gânglio']];
    const ht = NAR ? 26 : 40, cw = A.w / 3, top0 = A.y0 + ht, hh = A.h - ht - (NAR ? 46 : 36);
    L.forEach(([g, nm, ds], i) => {
      const cx = A.x0 + cw * (i + .5), k = Math.min(hh / 1.08, (cw - 10) / .46), top = top0 + (hh - 1.05 * k) / 2 + .08 * k;
      const mp = (u, v) => [cx + v * k, top + u * k];
      head(nm, cx, A.y0 + (NAR ? 8 : 20), N.txt);
      drawNeu(g, mp, k, { seed: i + 2 });
      dots(g, mp, t, 8, .22);
      const n = wrapTx(ds, cx, A.y1 - (NAR ? 38 : 26), cw - 12, { s: 12, w: 400, c: N.dim, lh: 15 });
      if (g.gang && LB) { const c = mp(g.soma[0], g.soma[1]); tx('gânglio', c[0] + (NAR ? 0 : 0), c[1] - g.soma[2] * k * 2.2 - 8, { s: 12, w: 600, c: N.glia }); }
      return n;
    });
    cap('Formas de neurônio. Em todas, o impulso vai dos dendritos (ou das terminações sensitivas) para o axônio. No pseudounipolar, ele passa direto, sem atravessar o corpo celular.');
  }

  // vista 2: arco reflexo (retirada da mão ou patelar)
  const TW = { sens: [0, 38], inter: [40, 43], mot: [45, 50], contr: 55, brain: [40, 115], mov: 'braço se afasta', br: 'dor percebida', mus: 'bíceps' };
  const TP = { sens: [0, 8], mot: [9, 17], contr: 20, brain: [9, 40], mov: 'perna chuta', br: 'toque chega ao encéfalo', mus: 'quadríceps' };
  function medula(cx, cy, R) {
    ell(cx, cy, R, R * .8, 0, rgba(N.miel, .82), 'rgba(11,15,28,.6)', 1.4);
    const gm = rgba(N.neur, .85);
    for (const s of [-1, 1]) { ell(cx + s * .36 * R, cy + .26 * R, .25 * R, .3 * R, s * .3, gm); ell(cx + s * .27 * R, cy - .33 * R, .1 * R, .33 * R, -s * .45, gm); }
    rr(cx - .42 * R, cy - .09 * R, .84 * R, .2 * R, 4, gm);
    circ(cx, cy + .01 * R, Math.max(2, .045 * R), '#1A2440');
    line(cx, cy - .8 * R, cx, cy - .55 * R, 'rgba(11,15,28,.5)', 1.2);
  }
  function encefalo(x, y, rx, ry, on) {
    if (on > 0) halo(x, y, rx * 1.25, N.na, .16 * on);
    ell(x, y, rx, ry, 0, '#D59BBE', 'rgba(11,15,28,.6)', 1.4);
    X.save(); X.beginPath(); X.ellipse(x, y, rx, ry, 0, 0, TAU); X.clip();
    for (let i = 0; i < 5; i++) { X.beginPath(); X.arc(x - rx + i * rx * .5, y + ry * (i % 2 ? .3 : -.2), rx * .32, 0, PI * (i % 2 ? -1 : 1), i % 2 === 1); X.strokeStyle = 'rgba(90,40,70,.55)'; X.lineWidth = 1.3; X.stroke(); }
    X.restore();
  }
  function trilha(p, a, b, tm, col, lw = 2.4) {
    poly(p, rgba(col, .38), lw);
    if (tm >= a) { const f = b > a ? (tm - a) / (b - a) : 1, q = subPath(p, f); poly(q, col, lw + .6); if (f < 1) { const e = q[q.length - 1]; spark(e[0], e[1], 5); } }
  }
  function vArco(A, t, S) {
    const pat = !!S.pat, T = pat ? TP : TW, tm = S.v;
    const y1 = A.y1 - 58, Ah = y1 - A.y0;
    const R = Math.min(A.w * (NAR ? .18 : .2), Ah * .27), cx = A.x0 + A.w * (NAR ? .78 : .7), cy = A.y0 + Ah * .55;
    const m = ss(seg(tm, T.contr, T.contr + 90));
    // membro
    let musc, rec, nerve, hand = null;
    if (!pat) {
      const Lu = Math.min(Ah * .5, A.w * (NAR ? .3 : .17)), aw = Lu * .28;
      const S0 = [A.x0 + A.w * (NAR ? .1 : .1), A.y0 + Ah * .1], E = [S0[0] + Lu * .2, S0[1] + Lu * .98];
      const ang = lerp(PI * .06, -PI * .38, m), Lf = Lu * .92, Hd = [E[0] + Math.cos(ang) * Lf, E[1] + Math.sin(ang) * Lf];
      // panela (fica no lugar; a mão sobe)
      const H0 = [E[0] + Math.cos(PI * .06) * Lf, E[1] + Math.sin(PI * .06) * Lf], pw = Lu * .75, ph = Lu * .34, py = H0[1] + aw * .45;
      rr(H0[0] - pw * .45, py, pw, ph, 6, '#3A4256', 'rgba(11,15,28,.7)', 1.2); rr(H0[0] - pw * .5, py - 3, pw * 1.1, 6, 3, '#556079');
      line(H0[0] + pw * .55, py + 6, H0[0] + pw * .85, py + 2, '#556079', 5);
      for (let i = 0; i < 3; i++) { X.beginPath(); const bx = H0[0] - pw * .2 + i * pw * .22; for (let j = 0; j <= 10; j++) { const yy = py + ph + 6 + j * 2.2, xx = bx + Math.sin(j * .9 + t * 6 + i) * 2.5; j ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } X.strokeStyle = 'rgba(255,140,80,.75)'; X.lineWidth = 1.6; X.stroke(); }
      membro([S0, E], aw); membro([E, Hd], aw * .85); ell(Hd[0] + Math.cos(ang) * aw * .5, Hd[1] + Math.sin(ang) * aw * .5, aw * .62, aw * .45, ang, N.pele, N.contorno, 1.5);
      const mid = [lerp(S0[0], E[0], .45) + aw * .32, lerp(S0[1], E[1], .45)];
      musc = mid; ell(mid[0], mid[1], aw * (.3 + .16 * m), Lu * .3, -.2, rgba(N.musc, .7 + .3 * m), 'rgba(11,15,28,.5)', 1);
      rec = [Hd[0] + Math.cos(ang) * aw * .8, Hd[1] + Math.sin(ang) * aw * .8]; nerve = [S0[0] + aw * .3, S0[1] + aw * .2];
      hand = { E, S0 };
    } else {
      const Lt = Math.min(A.w * (NAR ? .36 : .24), Ah * .6), lw2 = Lt * .26;
      const Hp = [A.x0 + A.w * .04 + lw2 * .5, A.y0 + Ah * .3], K = [Hp[0] + Lt, Hp[1] + Lt * .04];
      const ang = lerp(PI * .5, PI * .5 - .85, m), Ll = Lt * .95, F = [K[0] + Math.cos(ang) * Ll, K[1] + Math.sin(ang) * Ll];
      membro([Hp, K], lw2); membro([K, F], lw2 * .78);
      ell(F[0] + Math.cos(ang - PI / 2) * lw2 * .5, F[1] + Math.sin(ang - PI / 2) * lw2 * .5, lw2 * .7, lw2 * .32, ang - PI / 2, N.pele, N.contorno, 1.5);
      const mid = [lerp(Hp[0], K[0], .5), Hp[1] - lw2 * .2];
      musc = mid; ell(mid[0], mid[1], Lt * .34, lw2 * (.26 + .12 * m), 0, rgba(N.musc, .7 + .3 * m), 'rgba(11,15,28,.5)', 1);
      // martelo de reflexo, batendo logo abaixo do joelho
      // martelo de reflexo: a cabeça bate no tendão, logo abaixo do joelho, e depois se afasta
      const hit = [K[0] + lw2 * .62, K[1] + lw2 * .75], up = tm < 6 ? 0 : ss(seg(tm, 6, 40)), hl = Lt * .4, hs = Math.max(8, lw2 * .32);
      X.save(); X.translate(hit[0] + up * hl * .35, hit[1] - up * hl * .1); X.rotate(.35 + up * .5);
      rr(hs * .5, -2.5, hl, 5, 2.5, '#8C96AD'); rr(-hs * .5, -hs, hs, hs * 2, 4, '#C9CFDC', 'rgba(11,15,28,.6)', 1); X.restore();
      if (tm < 6) halo(hit[0], hit[1], 16, '#FFFFFF', .35);
      rec = [mid[0] + Lt * .12, mid[1]]; nerve = [mid[0] + Lt * .3, mid[1] - lw2 * .4];
    }
    // medula, gânglio e encéfalo
    medula(cx, cy, R);
    const G = [cx - 1.42 * R, cy - .62 * R], bx = cx, by = A.y0 + Math.max(18, R * .3), brx = R * .55, bry = R * .3;
    ell(G[0], G[1], .2 * R, .15 * R, -.3, rgba(N.glia, .25), rgba(N.glia, .8), 1.2);
    const dh = [cx - .3 * R, cy - .45 * R], vh = [cx - .4 * R, cy + .38 * R], ih = [cx - .14 * R, cy - .02 * R];
    const sensP = [rec].concat(hand ? [[hand.E[0] - 4, hand.E[1]], [nerve[0], nerve[1]]] : [nerve]).concat([[nerve[0] + 20, nerve[1] - 6], [G[0] - .4 * R, G[1]], G, [cx - .9 * R, cy - .52 * R], dh]);
    if (pat) sensP.push([cx - .5 * R, cy - .05 * R], vh);
    const motP = [vh, [cx - .95 * R, cy + .5 * R], [cx - 1.5 * R, cy + .58 * R], [nerve[0] + 20, nerve[1] + 10], hand ? [nerve[0] + 6, nerve[1] + 14] : nerve, musc];
    const brP = [dh, [cx + .12 * R, cy - .55 * R], [cx + .12 * R, cy - .82 * R], [bx, by + bry]];
    encefalo(bx, by, brx, bry, tm >= T.brain[1] ? 1 : 0);
    // via até o encéfalo (tracejada)
    X.setLineDash([5, 4]); poly(brP, rgba(N.dim, .5), 1.6); X.setLineDash([]);
    if (tm >= T.brain[0]) { const f = (tm - T.brain[0]) / (T.brain[1] - T.brain[0]), q = subPath(brP, f); poly(q, N.na, 2); if (f < 1) { const e = q[q.length - 1]; spark(e[0], e[1], 4); } }
    trilha(sensP, T.sens[0], T.sens[1], tm, N.sens);
    if (!pat) { const iP = [dh, ih, vh]; trilha(iP, T.inter[0], T.inter[1], tm, N.inter); circ(ih[0], ih[1], Math.max(3.5, R * .06), N.inter, 'rgba(11,15,28,.6)', 1); }
    trilha(motP, T.mot[0], T.mot[1], tm, N.neur);
    circ(G[0], G[1], Math.max(4, R * .08), N.sens, 'rgba(11,15,28,.6)', 1);
    circ(vh[0], vh[1], Math.max(5, R * .1), N.neur, 'rgba(11,15,28,.6)', 1.2);
    if (tm >= T.contr && tm < T.contr + 90) halo(musc[0], musc[1], R * .5, N.musc, .3);
    // rótulos
    const sp = pth(sensP, hand ? .3 : .25), mpt = pth(motP, .55);
    lab(sp[0], sp[1], sp[0] + 10, sp[1] - 46, 'neurônio sensitivo');
    if (!pat) lab(ih[0], ih[1], cx + R * .2, cy + R * .1, 'interneurônio');
    lab(mpt[0], mpt[1], mpt[0] + 10, mpt[1] + 48, 'neurônio motor');
    lab(cx + R * .7, cy + R * .4, cx + R * .9, cy + R * 1.0, 'medula espinal');
    lab(musc[0], musc[1], musc[0] - 10, musc[1] + (pat ? -50 : 40), T.mus);
    lab(G[0], G[1], G[0] - 30, G[1] - 40, 'gânglio');
    lab(cx - .25 * R, cy + .2 * R, cx + R * 1.1, cy - R * .5, 'substância cinzenta');
    if (LB) tx('encéfalo', NAR ? bx - brx - 6 : bx + brx + 8, by, { s: 12, w: 600, a: NAR ? 'right' : 'left', c: N.dim });
    // linha do tempo
    const ty = A.y1 - 12, t0 = A.x0 + 8, t1 = A.x1 - 8, fx = v => t0 + v / 200 * (t1 - t0);
    rr(t0, ty - 3, t1 - t0, 6, 3, 'rgba(91,108,153,.35)'); rr(t0, ty - 3, Math.max(6, fx(tm) - t0), 6, 3, rgba(N.na, .85));
    for (let v = 0; v <= 200; v += 50) { const s = v === 0 ? '0' : v === 200 ? '200 ms' : String(v), w = tw(s, 12, 500) / 2; tx(s, cl(fx(v), t0 + w, t1 - w), ty + 14, { s: 12, w: 500, c: N.dim, bg: false }); }
    const ev = [[T.contr, T.mov + ': cerca de ' + ms(T.contr), N.musc, 22], [T.brain[1], T.br + ': cerca de ' + ms(T.brain[1]), N.na, 42]];
    for (const [v, s, c, dy] of ev) {
      const x = fx(v), on = tm >= v, w = tw(s, 12, 600) + 16;
      line(x, ty - 5, x, ty - dy + 9, rgba(c, on ? .9 : .4), 1.4);
      const lx = cl(x - 8, t0, t1 - w);
      rr(lx, ty - dy - 9, w, 19, 999, 'rgba(11,15,28,.84)', rgba(c, on ? .9 : .3), 1.2);
      tx(s, lx + w / 2, ty - dy + .5, { s: 12, w: 600, c: on ? N.txt : N.dim, bg: false });
    }
    marker(fx(tm), ty, N.na);
    cap(pat
      ? 'Reflexo patelar: o neurônio sensitivo se liga <b>direto</b> ao motor, na medula, sem interneurônio. A perna chuta antes de o sinal chegar ao encéfalo.'
      : 'Reflexo de retirada: sensitivo, interneurônio e motor. A resposta sai da <b>medula espinal</b>, e o braço se afasta antes de a dor ser percebida.');
  }

  def('nervoso', 'neuronio', {
    t: 'O neurônio', s: 'a célula que conduz sinais', c: N.neur, loc: 'Sistema nervoso central e periférico', still: 3, stillV: 70,
    ctl: { l: 'Tempo do reflexo', min: 0, max: 200, step: 2, v: 0, f: v => nbr(v) + ' ms', rate: () => 1 },
    auto: S => (S.view === 2 ? 30 : 0),
    extra: [
      { t: 'Formas', on: S => { S.view = S.view === 1 ? 0 : 1; }, pressed: S => S.view === 1 },
      { t: 'Arco reflexo', on: S => { if (S.view === 2 && !S.pat) S.view = 0; else { S.view = 2; S.pat = false; S.v = 0; } }, pressed: S => S.view === 2 && !S.pat },
      { t: 'Reflexo patelar', on: S => { if (S.view === 2 && S.pat) S.view = 0; else { S.view = 2; S.pat = true; S.v = 0; } }, pressed: S => S.view === 2 && !!S.pat }
    ],
    alt: 'Um neurônio multipolar com dendritos, corpo celular, núcleo, axônio com bainha de mielina e terminais, com pontos de luz correndo dos dendritos aos terminais. Botões mostram as formas de neurônio (multipolar, bipolar e pseudounipolar) e o arco reflexo: a mão na panela quente, a medula espinal em corte, os neurônios sensitivo, de associação e motor, e uma linha do tempo em milissegundos',
    d: `<p>O tecido nervoso tem dois tipos de célula: os <b>neurônios</b>, que recebem, conduzem e transmitem sinais elétricos e químicos, e as <b>células da glia</b>, que sustentam, nutrem, isolam e defendem os neurônios (ver <a href="#nervoso/glia">glia e mielina</a>). Tem pouquíssima substância entre as células. Forma o <b>sistema nervoso central</b> (encéfalo e medula espinal) e o <b>periférico</b> (nervos e gânglios). Neurônios e quase toda a glia vêm da <b>ectoderme</b>; a micróglia é exceção (ver <a href="#tecidos/visao">os quatro tecidos</a>).</p>
<p>O <b>neurônio</b> tem três partes. O <b>corpo celular</b> (pericário) tem o núcleo e a maior parte das organelas, com muito retículo rugoso para produzir proteínas. Os <b>dendritos</b>, prolongamentos curtos e ramificados, <b>recebem</b> os sinais. O <b>axônio</b>, em geral único e longo, <b>conduz</b> o impulso para longe do corpo celular até os <b>terminais</b>, onde ele passa para outra célula. O sentido é sempre o mesmo: do <b>dendrito</b> para o <b>corpo celular</b>, depois para o <b>axônio</b> e, por fim, para o <b>terminal</b>. Há axônios de menos de 1&nbsp;milímetro e outros com cerca de 1&nbsp;metro, como os que vão da medula espinal aos pés. O encéfalo humano tem cerca de <b>86 bilhões de neurônios</b> (Azevedo et al., 2009, um estudo brasileiro). Os neurônios maduros quase não se dividem, e por isso uma lesão no sistema nervoso central costuma deixar sequelas.</p>
<p>Pela função, os neurônios são de três tipos. Os <b>sensitivos</b> (aferentes) levam informações dos receptores até o sistema nervoso central; os <b>motores</b> (eferentes) levam ordens do sistema nervoso central até músculos e glândulas; e os <b>de associação</b> (interneurônios), dentro do encéfalo e da medula, ligam uns aos outros. Os três aparecem juntos no <b>arco reflexo</b>: quando a mão encosta numa panela quente, um neurônio sensitivo leva o sinal à medula, um interneurônio o passa a um neurônio motor, e o braço se afasta antes mesmo de o cérebro perceber a dor. No reflexo patelar (a "martelada" no joelho), o neurônio sensitivo se liga direto ao motor, sem interneurônio.</p>
<p>Toque em "Arco reflexo" ou "Reflexo patelar" e mova a faixa para acompanhar o tempo, em milissegundos. Os tempos da linha são aproximados e servem para comparar a ordem dos acontecimentos: o reflexo patelar, com uma sinapse só, é o mais rápido.</p>`,
    kv: [['Partes', 'dendritos, corpo celular, axônio, terminais'], ['Sentido do impulso', 'do dendrito ao terminal do axônio'], ['Neurônios no encéfalo', 'cerca de 86 bilhões'], ['Sensitivo (aferente)', 'leva ao sistema nervoso central'], ['Motor (eferente)', 'leva a músculos e glândulas'], ['Arco reflexo', 'resposta na medula espinal, rápida e involuntária']],
    enem: 'Lembre o <b>sentido do impulso</b> (do dendrito ao corpo celular e daí ao axônio) e os três tipos funcionais: <b>sensitivo</b> leva ao sistema nervoso central, <b>motor</b> leva aos músculos, <b>de associação</b> liga um ao outro. O <b>arco reflexo</b> é a questão clássica: a resposta acontece na <b>medula espinal</b>, sem depender do encéfalo, e por isso é rápida e involuntária.',
    links: [LK.neuronio || ['Ver o neurônio em 3D', '../celula/index.html#neuronio'], ['Glia e mielina', '#nervoso/glia']],
    init(S) { if (S.view == null) S.view = 0; S.lastTouch = S.touch; },
    draw(t, S) {
      const A = area();
      if (mexeu(S) && S.view !== 2) { S.view = 2; syncExtra(this, S); }
      if (S.view === 1) vFormas(A, t); else if (S.view === 2) vArco(A, t, S); else vNeuronio(A, t);
    }
  });

  // =====================================================================================
  // GLIA E MIELINA
  // =====================================================================================
  const GLIA = {
    astro: ['Astrócito', 'sustenta os neurônios, leva nutrientes do sangue até eles, recolhe neurotransmissores e ajuda a formar a <b>barreira hematoencefálica</b>.'],
    oligo: ['Oligodendrócito', 'forma a <b>bainha de mielina</b> no sistema nervoso central; cada um envolve trechos de <b>vários axônios</b>.'],
    micro: ['Micróglia', 'célula de <b>defesa</b>: fagocita micro-organismos e restos de células, como os macrófagos.'],
    epend: ['Células ependimárias', 'revestem as cavidades do encéfalo e da medula e participam da produção do <b>líquor</b>.'],
    neur: ['Neurônio', 'recebe, conduz e transmite os sinais; não é glia, mas é quem a glia sustenta.']
  };
  const GORD = ['astro', 'oligo', 'micro', 'epend'];
  let gHot = null;
  function hookGlia() {
    if (cv.dataset.irisGlia) return; cv.dataset.irisGlia = '1';
    const hit = e => { if (!gHot || performance.now() - gHot.at > 300) return null; const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; const h = gHot.hits.find(q => Math.hypot(x - q[1], y - q[2]) < q[3]); return h ? h[0] : null; };
    cv.addEventListener('click', e => { const h = hit(e); if (h) gHot.S.pick = gHot.S.pick === h ? null : h; });
    cv.addEventListener('mousemove', e => { cv.style.cursor = hit(e) ? 'pointer' : ''; });
  }
  function miniNeu(x, y, r, seed, al) {
    X.save(); X.globalAlpha *= al; const R = rng(seed); X.lineCap = 'round';
    for (let i = 0; i < 5; i++) { const a = R() * TAU, l = r * (2 + R() * 1.5); line(x, y, x + Math.cos(a) * l, y + Math.sin(a) * l, N.neur, Math.max(1.2, r * .22)); const bx = x + Math.cos(a) * l * .7, by = y + Math.sin(a) * l * .7; line(bx, by, bx + Math.cos(a + .6) * l * .4, by + Math.sin(a + .6) * l * .4, N.neur, Math.max(1, r * .12)); }
    X.lineCap = 'butt'; somaBlob(x, y, r, 1, 0, N.neur, seed); X.restore();
  }
  function vBairro(A, t, S) {
    const P = (u, v) => [A.x0 + u * A.w, A.y0 + v * A.h], s = Math.min(A.w, A.h);
    const sel = S.pick || GORD[Math.floor(t / 3.5) % GORD.length], al = id => (id === sel ? 1 : .5);
    const hits = [];
    rr(A.x0, A.y0, A.w, A.h * .8, 14, rgba(N.rosa, .07));
    // ventrículo e células ependimárias
    const vy = A.y0 + A.h * .86;
    rr(A.x0, vy, A.w, A.y1 - vy, 8, 'rgba(46,95,128,.45)');
    X.save(); X.globalAlpha *= al('epend');
    const ne = Math.max(6, Math.round(A.w / (s * .09))), ew = A.w / ne;
    for (let i = 0; i < ne; i++) {
      const x = A.x0 + i * ew; rr(x + 1, vy - ew * .75, ew - 2, ew * .75, 3, rgba(N.glia, .75), 'rgba(11,15,28,.5)', 1);
      nuc(x + ew / 2, vy - ew * .4, ew * .2, ew * .15, 0, { seed: i + 3 });
      for (let j = 0; j < 4; j++) { const cx2 = x + ew * (.2 + j * .2), b = Math.sin(t * 5 + i + j * .5) * 3; line(cx2, vy, cx2 + b, vy + 7, rgba(N.glia, .9), 1.2); }
    }
    X.restore(); hits.push(['epend', A.cx, vy - ew * .4, Math.max(ew, s * .08)], ['epend', A.x0 + A.w * .2, vy - ew * .4, Math.max(ew, s * .08)], ['epend', A.x0 + A.w * .8, vy - ew * .4, Math.max(ew, s * .08)]);
    // capilar com hemácias
    const cy0 = A.y0 + A.h * .1, cr = s * .045, cx1 = A.x0 + A.w * .56;
    rr(A.x0, cy0 - cr, cx1 - A.x0, cr * 2, cr, rgba(N.sangue, .25), rgba(N.rosa, .9), 2);
    X.save(); X.beginPath(); X.rect(A.x0, cy0 - cr, cx1 - A.x0, cr * 2); X.clip();
    for (let i = 0; i < 8; i++) { const x = A.x0 + fr(t * .08 + i / 8) * (cx1 - A.x0); ell(x, cy0 + Math.sin(i * 2) * cr * .25, cr * .55, cr * .38, .2, N.hem, 'rgba(11,15,28,.4)', 1); }
    X.restore();
    // neurônios
    const nA = P(.14, .5), nB = P(.52, .58), nr = s * .05;
    miniNeu(nA[0], nA[1], nr, 4, al('neur') > .9 ? 1 : .8); miniNeu(nB[0], nB[1], nr, 9, al('neur') > .9 ? 1 : .8);
    hits.push(['neur', nA[0], nA[1], nr * 1.4], ['neur', nB[0], nB[1], nr * 1.4]);
    // axônios mielinizados e oligodendrócito
    const axU = [.7, .8, .93], my0 = A.y0 + A.h * .2, my1 = A.y0 + A.h * .44;
    for (const u of axU) { const x = A.x0 + u * A.w; line(x, A.y0 + 4, x, vy - ew, rgba(N.neur, .9), 2.2); }
    const oc = P(.86, .64);
    X.save(); X.globalAlpha *= al('oligo');
    axU.forEach((u, i) => { const x = A.x0 + u * A.w, ym = (my0 + my1) / 2 + (i - 1) * s * .03; X.beginPath(); X.moveTo(oc[0], oc[1]); X.quadraticCurveTo((oc[0] + x) / 2, ym + s * .12, x, ym + s * .06); X.strokeStyle = rgba(N.glia, .9); X.lineWidth = 2; X.stroke();
      rr(x - s * .018, my0 + (i - 1) * s * .03, s * .036, my1 - my0, s * .018, N.miel, 'rgba(11,15,28,.6)', 1);
      for (let j = 1; j < 6; j++) line(x - s * .018, my0 + (i - 1) * s * .03 + j * (my1 - my0) / 6, x + s * .018, my0 + (i - 1) * s * .03 + j * (my1 - my0) / 6 - 3, 'rgba(120,130,160,.45)', 1); });
    circ(oc[0], oc[1], s * .035, N.glia, 'rgba(11,15,28,.6)', 1.2); nuc(oc[0], oc[1], s * .022, s * .02, 0, { seed: 8 });
    X.restore(); hits.push(['oligo', oc[0], oc[1], s * .08], ['oligo', A.x0 + .8 * A.w, (my0 + my1) / 2, s * .08]);
    // astrócito: pés no capilar e nos neurônios
    const ac = P(.33, .32);
    X.save(); X.globalAlpha *= al('astro'); X.lineCap = 'round';
    const feet = [[A.x0 + A.w * .26, cy0 + cr], [A.x0 + A.w * .4, cy0 + cr], [nA[0] + nr * .8, nA[1] - nr * .6], [nB[0] - nr * .7, nB[1] - nr * .7]];
    for (const f of feet) { X.beginPath(); X.moveTo(ac[0], ac[1]); X.quadraticCurveTo((ac[0] + f[0]) / 2 + 6, (ac[1] + f[1]) / 2, f[0], f[1]); X.strokeStyle = N.glia; X.lineWidth = 3; X.stroke(); ell(f[0], f[1] + (f[1] < ac[1] ? 2 : 0), 7, 3.5, 0, N.glia); }
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + .4, l = s * (.06 + (i % 2) * .03); line(ac[0], ac[1], ac[0] + Math.cos(a) * l, ac[1] + Math.sin(a) * l, N.glia, 2); }
    X.lineCap = 'butt'; circ(ac[0], ac[1], s * .028, N.glia, 'rgba(11,15,28,.6)', 1.2); nuc(ac[0], ac[1], s * .017, s * .014, 0, { seed: 2 });
    X.restore(); hits.push(['astro', ac[0], ac[1], s * .09]);
    // micróglia englobando um resto de célula
    const mc = P(.33, .7), deb = 1 - fr(t / 6) * .6;
    X.save(); X.globalAlpha *= al('micro');
    circ(mc[0] + s * .05, mc[1] - s * .01, s * .02 * deb, '#B98A8A', 'rgba(11,15,28,.5)', 1);
    X.lineCap = 'round'; for (let i = 0; i < 6; i++) { const a = i / 6 * TAU, l = s * (.04 + (i % 3) * .015); X.beginPath(); X.moveTo(mc[0], mc[1]); X.quadraticCurveTo(mc[0] + Math.cos(a + .4) * l * .6, mc[1] + Math.sin(a + .4) * l * .6, mc[0] + Math.cos(a) * l, mc[1] + Math.sin(a) * l); X.strokeStyle = light(N.glia, .3); X.lineWidth = 1.4; X.stroke(); }
    X.lineCap = 'butt'; ell(mc[0], mc[1], s * .028, s * .014, .3, light(N.glia, .3), 'rgba(11,15,28,.6)', 1); nuc(mc[0], mc[1], s * .02, s * .008, .3, { seed: 6 });
    X.restore(); hits.push(['micro', mc[0], mc[1], s * .08]);
    // destaque do escolhido
    const hs = hits.find(h => h[0] === sel); if (hs) circ(hs[1], hs[2], hs[3] * .9, null, rgba('#FFB347', .8), 2);
    gHot = { hits, S, at: performance.now() };
    lab(ac[0] - s * .02, ac[1] - s * .02, ac[0] - 20, ac[1] - 30, 'astrócito');
    lab(oc[0], oc[1], oc[0] - 20, oc[1] + 34, 'oligodendrócito');
    lab(mc[0], mc[1], mc[0] - 30, mc[1] + 30, 'micróglia');
    lab(A.x0 + A.w * .62, vy - ew * .4, A.x0 + A.w * .55, vy - ew - 34, 'células ependimárias');
    lab(A.x0 + A.w * .48, cy0, A.x0 + A.w * .6, cy0 + 4, 'capilar');
    lab(nB[0], nB[1], nB[0] + 30, nB[1] + 40, 'neurônio');
    lab(A.x0 + .93 * A.w, my1, A.x0 + .9 * A.w, my1 + 30, 'mielina');
    const g = GLIA[sel]; cap(`<b>${g[0]}</b>: ${g[1]} <span class="q">(toque numa célula)</span>`);
  }
  function vSchwann(A, t) {
    const s = Math.min(A.w, A.h);
    const big = NAR ? { x: A.cx, y: A.y0 + A.h * .26, r: A.h * .2 } : { x: A.x0 + A.w * .24, y: A.cy, r: Math.min(A.w * .2, A.h * .42) };
    const p = fr(t / 8), turns = .4 + 4.6 * ss(p / .75), ra = big.r * .32, gap = (big.r * .62) / 5;
    // corte transversal: a célula de Schwann enrola a membrana em volta do axônio
    circ(big.x, big.y, ra, rgba(N.neur, .85), 'rgba(11,15,28,.6)', 1.2);
    const pts = [], th1 = turns * TAU, rot = -th1 * .5;
    for (let th = 0; th <= th1; th += .08) { const r = ra + 3 + gap * th / TAU; pts.push([big.x + Math.cos(th + rot) * r, big.y + Math.sin(th + rot) * r]); }
    X.lineCap = 'round'; poly(pts, N.miel, gap * .82); poly(pts, 'rgba(120,130,160,.55)', 1); X.lineCap = 'butt';
    const ro = ra + 3 + gap * turns, ae = th1 + rot, bx = big.x + Math.cos(ae) * (ro + gap * .35), by = big.y + Math.sin(ae) * (ro + gap * .35);
    ell(bx, by, gap * 2.2, gap * 1.1, ae + PI / 2, rgba(N.glia, .9), 'rgba(11,15,28,.6)', 1.2); nuc(bx, by, gap * 1.2, gap * .55, ae + PI / 2, { seed: 4 });
    lab(big.x, big.y, big.x - big.r * .2, big.y - big.r * 1.05, 'axônio');
    lab(bx, by, bx + 30, by + 30, 'célula de Schwann');
    const mp2 = pts[Math.floor(pts.length * .7)] || [big.x, big.y]; lab(mp2[0], mp2[1], big.x + big.r * .9, big.y + big.r * .95, 'camadas de mielina');
    // vista de lado: SNP (Schwann, um axônio) e SNC (oligodendrócito, vários axônios)
    const R0 = NAR ? { x0: A.x0, x1: A.x1, y0: A.y0 + A.h * .55, y1: A.y1 } : { x0: A.x0 + A.w * .5, x1: A.x1, y0: A.y0 + 8, y1: A.y1 };
    const rw = R0.x1 - R0.x0, rh = R0.y1 - R0.y0, ya = R0.y0 + rh * (NAR ? .3 : .26), yb = R0.y0 + rh * (NAR ? .84 : .78), ysc = NAR ? ya + 56 : R0.y0 + rh * .5;
    tx('Sistema nervoso periférico', R0.x0, R0.y0 + 6, { s: 13, w: 600, a: 'left', c: N.txt });
    line(R0.x0, ya, R0.x1, ya, N.neur, 2.4);
    const ni = 4, il = rw / ni;
    for (let i = 0; i < ni; i++) { const x = R0.x0 + i * il + 4; rr(x, ya - 9, il - 8, 18, 9, N.miel, 'rgba(11,15,28,.6)', 1); ell(x + il * .5, ya - 11, il * .16, 5, 0, rgba(N.glia, .95)); nuc(x + il * .5, ya - 11, il * .08, 3, 0, { seed: i }); }
    lab(R0.x0 + il, ya, R0.x0 + il + 14, NAR ? ya - 30 : ya + 30, 'nodo de Ranvier');
    tx('uma célula de Schwann por trecho de um só axônio', R0.x0, ya + (NAR ? 26 : 48), { s: 12, w: 400, a: 'left', c: N.dim });
    tx('Sistema nervoso central', R0.x0, ysc, { s: 13, w: 600, a: 'left', c: N.txt });
    const ox = R0.x0 + rw * .5, oy = NAR ? ysc + 26 : yb - rh * .16;
    [-1, 0, 1].forEach(j => { const y = yb + j * 14; line(R0.x0, y, R0.x1, y, N.neur, 2); rr(ox - rw * .2 + j * rw * .06, y - 5, rw * .3, 10, 5, N.miel, 'rgba(11,15,28,.6)', 1); line(ox, oy, ox + j * rw * .06, y - 5, N.glia, 2); });
    circ(ox, oy, 8, N.glia, 'rgba(11,15,28,.6)', 1); nuc(ox, oy, 5, 4, 0, { seed: 3 });
    lab(ox, oy, ox + 40, oy - (NAR ? 0 : 18), 'oligodendrócito');
    tx('um oligodendrócito envolve trechos de vários axônios', R0.x0, Math.min(R0.y1 - 6, yb + 32), { s: 12, w: 400, a: 'left', c: N.dim });
    cap('A célula de Schwann gira em volta do axônio e enrola camadas da sua membrana, ricas em lipídios: a <b>bainha de mielina</b> é um isolante elétrico.');
  }
  const MV = [1, 10, 30, 70, 120], MN = ['sem mielina', 'mielina fina', 'mielina média', 'mielina espessa', 'muito mielinizado'];
  function vCorrida(A, t, S) {
    const lv = Math.round(S.v), em = !!S.em && lv > 0, vf = MV[lv], ni = [0, 14, 11, 8, 6][lv], th = [0, 10, 13, 16, 20][lv];
    const key = lv + '|' + em; if (S.rk !== key) { S.rk = key; S.r0 = t; }
    const xa = A.x0 + 8, xb = A.x1 - 8, L = xb - xa, y1 = A.y0 + A.h * .34, y2 = A.y0 + A.h * .74;
    // tempos (trilha de 10 cm): sem mielina a 1 m/s leva 100 ms
    const tfast = 100 / vf, segs = [];
    if (ni) { for (let i = 0; i < ni; i++) { const bad = em && (i === Math.floor(ni * .35) || i === Math.floor(ni * .35) + 1); segs.push({ x0: i / ni, x1: (i + 1) / ni, dt: tfast / ni * (bad ? 6 : 1), bad }); } } else segs.push({ x0: 0, x1: 1, dt: 100, bad: false, cont: true });
    const tot = segs.reduce((a, q) => a + q.dt, 0), D = 2.6, kk = tfast / D, Dr = tot / kk, cyc = Dr + 2;
    const tr = S.paused ? Dr * .55 : (t - S.r0) % cyc, ts = tr * kk;
    // trilhas
    const trackT = (y, nm) => { tx(nm, xa, y - 34, { s: 13, w: 600, a: 'left', c: N.txt }); line(xa, y, xb, y, rgba(N.neur, .9), 5); };
    trackT(y1, 'sem mielina: cerca de 1 m/s');
    trackT(y2, (lv ? MN[lv] : 'sem mielina') + ': cerca de ' + nbr(vf) + ' m/s' + (em ? ' (com trechos destruídos)' : ''));
    // de cima: onda contínua e lenta, com o trecho refratário atrás
    const xs = xa + cl(ts / 100, 0, 1) * L;
    if (xs > xa + 1) { const g = X.createLinearGradient(xs - 80, 0, xs, 0); g.addColorStop(0, 'rgba(157,169,196,0)'); g.addColorStop(1, 'rgba(157,169,196,.6)'); rr(Math.max(xa, xs - 80), y1 - 5, Math.min(80, xs - xa), 10, 5, g); }
    halo(xs, y1, 18, N.na, .55); circ(xs, y1, 5, N.na);
    // de baixo: mielina com nodos; o impulso salta de nodo em nodo
    const gp = 6;
    for (const q of segs) if (!q.cont) { const x0 = xa + q.x0 * L + gp / 2, w = (q.x1 - q.x0) * L - gp; if (q.bad) rr(x0, y2 - th / 2, w, th, th / 2, null, rgba(N.miel, .35), 1, [3, 3]); else rr(x0, y2 - th / 2, w, th, th / 2, N.miel, 'rgba(11,15,28,.6)', 1); }
    let acc = 0, xp = xa, done = ts >= tot;
    for (const q of segs) {
      if (ts < acc + q.dt) { const f = (ts - acc) / q.dt; if (q.cont || q.bad) { xp = xa + lerp(q.x0, q.x1, f) * L; halo(xp, y2, 18, N.na, .55); circ(xp, y2, 5, N.na); } else { const xn = xa + q.x0 * L, xm = xa + q.x1 * L; xp = xn; halo(xn, y2, 16 * (1 - f) + 6, N.na, .6); circ(xn, y2, 5, N.na); X.beginPath(); X.moveTo(xn, y2 - th / 2 - 2); X.quadraticCurveTo((xn + xm) / 2, y2 - th - 26, lerp(xn, xm, f), y2 - th / 2 - 2 - Math.sin(f * PI) * (th / 2 + 12)); X.strokeStyle = rgba(N.na, .8); X.lineWidth = 1.6; X.setLineDash([4, 3]); X.stroke(); X.setLineDash([]); } break; }
      acc += q.dt;
    }
    if (done) { halo(xb, y2, 18, N.na, .55); circ(xb, y2, 5, N.na); }
    // resultados
    const right = (y, s, c) => tx(s, xb, y - 34, { s: 13, w: 600, a: 'right', c: c || N.dim });
    if (!NAR) { right(y2, done ? 'chegou em ' + ms(tot) : 'tempo: ' + ms(Math.min(ts, tot)), done ? N.na : N.dim); right(y1, ts >= 100 ? 'chegou em 100 ms' : done ? 'chegaria em 100 ms' : ''); }
    const msg = done ? (lv === 0 ? 'Empate: sem mielina, os dois andam a cerca de 1 m/s.' : `Com mielina: ${ms(tot)}. Sem mielina: chegaria em 100 ms.`) : 'tempo: ' + ms(Math.min(ts, tot));
    pill(A.cx, A.y0 + 6 + 10, msg, { s: 13, c: done ? N.txt : N.dim });
    tx('trilha de 10 cm, em câmera lenta', A.cx, A.y1 - 8, { s: 12, w: 400, c: N.dim });
    if (ni) lab(xa + segs[1].x0 * L, y2, xa + segs[1].x0 * L + 10, y2 + 32, 'nodo de Ranvier');
    cap(em ? '<b>Esclerose múltipla</b>: o sistema imunitário destrói a mielina; nos trechos sem ela, o impulso se arrasta (ou até para).'
      : 'Na fibra com mielina, o impulso <b>salta</b> de um nodo de Ranvier ao outro (condução saltatória) e chega muito antes.');
  }
  def('nervoso', 'glia', {
    t: 'Glia e mielina', s: 'as células que cuidam dos neurônios', c: N.glia, loc: 'Encéfalo, medula espinal e nervos', still: 2, stillV: 3,
    ctl: { l: 'Mielina', min: 0, max: 4, step: 1, v: 3, f: v => 'cerca de ' + nbr(MV[Math.round(v)]) + ' m/s', rate: () => 1 },
    extra: [
      { t: 'Schwann', on: S => { S.view = S.view === 1 ? 0 : 1; }, pressed: S => S.view === 1 },
      { t: 'Corrida', on: S => { S.view = S.view === 2 ? 0 : 2; }, pressed: S => S.view === 2 },
      { t: 'Esclerose múltipla', on: S => { S.em = !S.em; S.view = 2; if (S.v < 2) S.v = 3; }, pressed: S => !!S.em }
    ],
    alt: 'Um bairro do sistema nervoso central com neurônios, um astrócito com os pés no capilar e nos neurônios, um oligodendrócito enrolando mielina em três axônios, uma micróglia englobando um resto de célula e células ependimárias com cílios na parede do ventrículo. Outras vistas: a célula de Schwann enrolando a mielina em volta do axônio e uma corrida entre um axônio sem mielina e outro com mielina',
    d: `<p>As <b>células da glia</b> (neuróglia) não conduzem impulsos, mas sem elas os neurônios não funcionam. No <b>sistema nervoso central</b> há quatro tipos: os <b>astrócitos</b>, em forma de estrela, que sustentam os neurônios, levam nutrientes do sangue até eles, recolhem neurotransmissores e ajudam a formar a <b>barreira hematoencefálica</b>, que filtra o que passa do sangue para o encéfalo; os <b>oligodendrócitos</b>, que formam a <b>bainha de mielina</b> no sistema nervoso central, cada um envolvendo trechos de vários axônios; a <b>micróglia</b>, células de defesa que fagocitam micro-organismos e restos de células, parentes dos macrófagos (ver <a href="#conjuntivo/propriamente">conjuntivo propriamente dito</a>); e as <b>células ependimárias</b>, que revestem as cavidades do encéfalo e da medula e participam da produção do líquido cerebrospinal (líquor). No <b>sistema nervoso periférico</b>, as <b>células de Schwann</b> formam a mielina, cada uma envolvendo um trecho de um único axônio. Por muito tempo se disse que havia 10 células da glia para cada neurônio; contagens recentes mostram uma proporção perto de <b>1 para 1</b> no encéfalo humano (Azevedo et al., 2009).</p>
<p>A <b>bainha de mielina</b> é feita de camadas da membrana dessas células, enroladas em volta do axônio, ricas em lipídios: funciona como um isolante elétrico. Entre um trecho de mielina e outro ficam espaços curtos, os <b>nodos de Ranvier</b>. O impulso "salta" de um nodo ao outro (<b>condução saltatória</b>), e por isso as fibras mielinizadas são muito mais rápidas: até cerca de <b>100 a 120&nbsp;m/s</b>, contra menos de 2&nbsp;m/s nas fibras finas sem mielina (Guyton). A mielina dá a cor da <b>substância branca</b> do sistema nervoso; a <b>substância cinzenta</b> é onde ficam os corpos celulares. Na <b>esclerose múltipla</b>, o próprio sistema imunitário destrói a mielina do sistema nervoso central, e a condução fica lenta ou falha.</p>
<p>Toque numa célula para ver a sua função. Os botões mostram a célula de Schwann formando a mielina e a corrida entre dois axônios; a faixa muda a espessura da mielina e a distância entre os nodos.</p>`,
    kv: [['Astrócito', 'sustentação, nutrição, barreira hematoencefálica'], ['Oligodendrócito', 'mielina no SNC (vários axônios)'], ['Célula de Schwann', 'mielina no SNP (um só axônio)'], ['Micróglia', 'defesa (fagocitose)'], ['Ependimárias', 'revestem ventrículos; líquor'], ['Velocidade', 'sem mielina: 0,5 a 2&nbsp;m/s; com mielina: até cerca de 120&nbsp;m/s']],
    enem: 'Associe: <b>oligodendrócito</b> = mielina no sistema nervoso <b>central</b>; <b>célula de Schwann</b> = mielina no <b>periférico</b>; <b>astrócito</b> = sustentação, nutrição e barreira hematoencefálica; <b>micróglia</b> = defesa. A mielina aumenta a <b>velocidade</b> do impulso (condução <b>saltatória</b>, de nodo em nodo). Doenças que destroem a mielina, como a <b>esclerose múltipla</b>, deixam a condução lenta.',
    links: [['O neurônio', '#nervoso/neuronio'], ['O impulso nervoso', '#nervoso/impulso']],
    init(S) { if (S.view == null) S.view = 0; S.lastTouch = S.touch; hookGlia(); },
    draw(t, S) {
      const A = area();
      if (mexeu(S) && S.view !== 2) { S.view = 2; syncExtra(this, S); }
      if (S.view === 1) vSchwann(A, t); else if (S.view === 2) vCorrida(A, t, S); else vBairro(A, t, S);
    }
  });

  // =====================================================================================
  // IMPULSO NERVOSO
  // =====================================================================================
  // tempo simulado (ms) a partir do tempo real, com câmera mais lenta durante o disparo
  const LOOP = 6.6;
  function tsim(ph) { const r = ph % LOOP; if (r < .8) return r / .8; if (r < 4.8) return 1 + (r - .8) / 2; if (r < 6) return 3 + (r - 4.8) / .4; return 6; }
  function Vm(ts, v, block) {
    const x = ts - 1; if (x < 0) return -70;
    if (v < 30 || block) { const vp = -70 + Math.min(13.5, 14 * v / 30); const k = x < 1 ? 1 - Math.exp(-x / .35) : (1 - Math.exp(-1 / .35)) * Math.exp(-(x - 1) / .8); return -70 + (vp + 70) * k; }
    if (x < .35) return -70 + 15 * ss(x / .35);
    if (x < .7) return lerp(-55, 30, ss((x - .35) / .35));
    if (x < 1.5) return lerp(30, -77, ss((x - .7) / .8));
    if (x < 3.5) return lerp(-77, -70, ss((x - 1.5) / 2));
    return -70;
  }
  const freq = v => (v < 30 ? 0 : Math.round(10 + (v - 30) / 70 * 190));
  function cadeado(x, y, s) { X.beginPath(); X.arc(x, y - s * .25, s * .32, PI, 0); X.strokeStyle = '#C9CFDC'; X.lineWidth = 2; X.stroke(); rr(x - s * .45, y - s * .25, s * .9, s * .7, 3, '#C9CFDC', 'rgba(11,15,28,.6)', 1); circ(x, y + s * .08, s * .1, '#1A2440'); }
  function ionNa(x, y, r) { circ(x, y, r, N.na, 'rgba(11,15,28,.5)', 1); }
  function ionK(x, y, r) { rr(x - r, y - r, 2 * r, 2 * r, r * .45, N.k, 'rgba(11,15,28,.5)', 1); }
  function membrana(B, ts, v, block, ph) {
    const supra = v >= 30 && !block, x = ts - 1, V = Vm(ts, v, block), my = B.y0 + B.h * .5, bt = NAR ? 16 : 24;
    const chNa = B.x0 + B.w * .2, chK = B.x0 + B.w * .48, pump = B.x0 + B.w * .78, ir = NAR ? 4 : 5;
    tx('meio externo', B.x0 + 4, B.y0 + 10, { s: 12, w: 600, a: 'left', c: N.dim });
    tx('citoplasma', B.x0 + 4, B.y1 - 10, { s: 12, w: 600, a: 'left', c: N.dim });
    // bicamada
    rr(B.x0, my - bt, B.w, bt * 2, 4, rgba(N.rosa, .18));
    for (let xx = B.x0 + 4; xx < B.x1; xx += 8) { circ(xx, my - bt + 3, 3, rgba(N.rosa, .85)); circ(xx, my + bt - 3, 3, rgba(N.rosa, .85)); }
    // íons parados (distribuição desigual)
    const R = rng(21), far = xx => Math.abs(xx - chNa) > 22 && Math.abs(xx - chK) > 22 && Math.abs(xx - pump) > 30;
    const put = (n, y0, y1, f) => { let c = 0, g = 0; while (c < n && g++ < 400) { const xx = B.x0 + 12 + R() * (B.w - 24), yy = y0 + R() * (y1 - y0); if (!far(xx) || xx < B.x0 + 90 && yy < y0 + 14) continue; f(xx + Math.sin(ph * 2 + c) * 1.5, yy + Math.cos(ph * 1.7 + c) * 1.5, ir); c++; } };
    const oy0 = B.y0 + 24, oy1 = my - bt - 22, iy0 = my + bt + 22, iy1 = B.y1 - 22;
    put(NAR ? 9 : 13, oy0, oy1, ionNa); put(2, iy0, iy1, ionNa); put(NAR ? 9 : 13, iy0, iy1, ionK); put(2, oy0, oy1, ionK);
    // sinais de carga
    const inv = V > 0;
    for (let i = 0; i < 7; i++) { const xx = B.x0 + B.w * (.07 + i * .145); if (!far(xx)) continue; tx(inv ? '−' : '+', xx, my - bt - 10, { s: 14, w: 700, c: inv ? N.rec : N.na, bg: false }); tx(inv ? '+' : '−', xx, my + bt + 10, { s: 14, w: 700, c: inv ? N.na : N.rec, bg: false }); }
    // canais
    const naOpen = supra && x >= .35 && x < .75, kOpen = supra && x >= .65 && x < 1.9;
    const canal = (cx, open, c) => { const gpp = open ? 7 : 2; rr(cx - gpp - 12, my - bt - 4, 12, bt * 2 + 8, 4, c, 'rgba(11,15,28,.6)', 1); rr(cx + gpp, my - bt - 4, 12, bt * 2 + 8, 4, c, 'rgba(11,15,28,.6)', 1); };
    canal(chNa, naOpen, dark(N.na, .35)); canal(chK, kOpen, dark(N.k, .45));
    if (block) cadeado(chNa, my - bt - 18, 16);
    // fluxo de Na⁺ (entra) e de K⁺ (sai)
    if (supra) {
      for (let i = 0; i < 5; i++) { const f = seg(x, .35 + i * .06, .65 + i * .06); if (f > 0 && f < 1) { const p = pth([[chNa - 26 + i * 6, oy0 + 10], [chNa, my - bt], [chNa, my + bt], [chNa + 18 - i * 7, iy1 - 6]], f); ionNa(p[0], p[1], ir); } }
      for (let i = 0; i < 5; i++) { const f = seg(x, .7 + i * .09, 1.1 + i * .09); if (f > 0 && f < 1) { const p = pth([[chK - 16 + i * 7, iy1 - 4], [chK, my + bt], [chK, my - bt], [chK + 20 - i * 8, oy0 + 6]], f); ionK(p[0], p[1], ir); } }
    }
    // bomba de Na⁺/K⁺: gira o tempo todo, gastando ATP
    const pa = ph * 1.6;
    circ(pump, my, bt + 6, rgba(N.glia, .35), N.glia, 1.5);
    for (let i = 0; i < 3; i++) { const f = fr(ph * .35 + i / 3); ionNa(pump - 8 + i * 8, lerp(my + bt, oy0 + 6, f), ir * .9); }
    for (let i = 0; i < 2; i++) { const f = fr(ph * .35 + .5 + i / 2); ionK(pump - 5 + i * 10, lerp(my - bt, iy1 - 6, f), ir * .9); }
    arrowHead(pump + Math.cos(pa) * (bt + 6), my + Math.sin(pa) * (bt + 6), pa + PI / 2, N.glia, 8);
    tok(pump + bt + 30, iy1 - 4, 'ATP', '#FFE1A6', { a: .5 + .5 * Math.sin(ph * 2) * .5 + .25 });
    // legenda das formas
    const lx = B.x1 - 4, ly = B.y0 + 10; const w1 = tok(lx - 22, ly, 'K⁺', N.k); tok(lx - 22 - w1 - 6, ly, 'Na⁺', N.na);
    lab(chNa, my + bt + 4, chNa - 10, my + bt + 40, block ? 'canal de Na⁺ bloqueado' : 'canal de Na⁺');
    lab(chK, my - bt - 4, chK + 10, my - bt - 40, 'canal de K⁺');
    lab(pump, my + bt + 6, pump - 10, my + bt + 44, 'bomba de Na⁺/K⁺');
  }
  function axonVista(B, ts, v, block, ph) {
    const supra = v >= 30, my = B.y0 + B.h * .5, rh = NAR ? 22 : 30, xa = B.x0 + 30, xb = B.x1 - 6, L = xb - xa;
    const xblk = xa + L * .5, x = ts - 1, wf = x < 0 ? -1 : x / 4.6; // a onda percorre o axônio
    let pos = supra ? xa + wf * L : -1; if (block && pos > xblk - 10) pos = -1;
    const stuck = block && supra && x > 0 && xa + wf * L > xblk - 10;
    rr(xa, my - rh, L, rh * 2, rh, rgba(N.neur, .35), N.neur, 1.5);
    // estados ao longo do axônio
    const n = Math.floor(L / 22);
    for (let i = 0; i <= n; i++) {
      const xx = xa + i * L / n, d = pos - xx, dep = pos > 0 && d >= 0 && d < L * .07, refr = pos > 0 && d >= L * .07 && d < L * .2;
      const cOut = dep ? N.rec : N.na, cIn = dep ? N.na : N.rec;
      if (dep) rr(xx - 8, my - rh + 3, 16, rh * 2 - 6, 6, rgba(N.na, .35)); else if (refr) rr(xx - 8, my - rh + 3, 16, rh * 2 - 6, 6, 'rgba(157,169,196,.3)');
      tx(dep ? '−' : '+', xx, my - rh - 10, { s: 13, w: 700, c: cOut, bg: false }); tx(dep ? '+' : '−', xx, my, { s: 13, w: 700, c: cIn, bg: false });
    }
    // estímulo
    X.beginPath(); X.moveTo(B.x0 + 6, my - 14); X.lineTo(B.x0 + 16, my - 2); X.lineTo(B.x0 + 9, my - 2); X.lineTo(B.x0 + 19, my + 12); X.strokeStyle = '#FFE1A6'; X.lineWidth = 2; X.stroke();
    if (block) { rr(xblk - 14, my - rh - 2, 28, rh * 2 + 4, 6, 'rgba(201,207,220,.25)', '#C9CFDC', 1.2); cadeado(xblk, my + rh + 22, 16); }
    wrapTx('o trecho de trás fica refratário (cinza): o impulso só segue para a frente', B.x0 + B.w / 2, B.y1 - (NAR ? 30 : 8), B.w - 8, { s: 12, w: 400, c: N.dim, lh: 15 });
    lab(xa + 40, my - rh, xa + 40, my - rh - 44, stuck ? 'parou no bloqueio' : 'axônio');
  }
  function grafico(G, ts, v, block) {
    const fx = q => G.x0 + 34 + q / 6 * (G.w - 40), fy = q => G.y0 + 8 + (40 - q) / 130 * (G.h - 34);
    rr(G.x0 + 34, G.y0, G.w - 34, G.h - 22, 8, 'rgba(19,26,43,.55)', N.line, 1);
    const ref = [[30, 'pico', N.na, []], [-55, 'limiar', '#FFE1A6', [5, 4]], [-70, 'repouso', N.rec, []]];
    for (const [q, nm, c, dsh] of ref) { line(G.x0 + 34, fy(q), G.x1, fy(q), rgba(c, .55), 1, dsh); tx((q > 0 ? '+' : q < 0 ? '−' : '') + Math.abs(q), G.x0 + 30, fy(q), { s: 12, f: FD, w: 500, a: 'right', c: N.dim, bg: false }); }
    tx('limiar', G.x1 - 6, fy(-55) - 9, { s: 12, w: 600, a: 'right', c: '#FFE1A6' }); tx('repouso', G.x1 - 6, fy(-70) + 10, { s: 12, w: 600, a: 'right', c: N.rec }); tx('pico', G.x1 - 6, fy(30) - 9, { s: 12, w: 600, a: 'right', c: N.na });
    tx('mV', G.x0 + 30, G.y0 + 6, { s: 12, f: FD, w: 500, a: 'right', c: N.dim, bg: false });
    for (let q = 0; q <= 6; q += 2) tx(q + (q === 6 ? ' ms' : ''), cl(fx(q), G.x0 + 40, G.x1 - 18), G.y1 - 10, { s: 12, f: FD, w: 500, c: N.dim, bg: false });
    X.beginPath(); for (let i = 0; i <= 160; i++) { const q = ts * i / 160, px = fx(q), py = fy(Vm(q, v, block)); i ? X.lineTo(px, py) : X.moveTo(px, py); }
    X.strokeStyle = '#FFF4D6'; X.lineWidth = 2.4; X.lineJoin = 'round'; X.stroke();
    marker(fx(ts), fy(Vm(ts, v, block)), N.na);
  }
  function raster(B, v, block, ph) {
    const f = block ? 0 : freq(v);
    tx(f ? `${nbr(f)} disparos por segundo, todos da mesma altura` : 'nenhum disparo', B.x0, B.y0 + 6, { s: 13, w: 600, a: 'left', c: f ? N.txt : N.dim });
    const y0 = B.y0 + 16, h = B.y1 - y0; rr(B.x0, y0, B.w, h, 6, 'rgba(19,26,43,.55)', N.line, 1);
    if (!f) return;
    const n = f;
    X.beginPath(); for (let i = 0; i < n; i++) { const xx = B.x0 + 3 + fr(i / n - ph / 4) * (B.w - 6); X.moveTo(xx, y0 + 4); X.lineTo(xx, y0 + h - 4); } X.strokeStyle = rgba(N.na, .9); X.lineWidth = f > 120 ? 1 : 1.5; X.stroke();
  }
  def('nervoso', 'impulso', {
    t: 'O impulso nervoso', s: 'potencial de repouso e potencial de ação', c: N.na, loc: 'Membrana do axônio', still: 2.0, stillV: 60,
    ctl: { l: 'Estímulo', min: 0, max: 100, step: 5, v: 60, f: v => nbr(v) + ' de 100', rate: () => 1 },
    extra: [
      { t: 'Axônio inteiro', on: S => { S.ax = !S.ax; }, pressed: S => !!S.ax },
      { t: 'Anestésico local', on: S => { S.blk = !S.blk; }, pressed: S => !!S.blk }
    ],
    alt: 'Um trecho de membrana em corte, com íons de sódio (laranja, redondos) concentrados fora e de potássio (roxo-claro, quadrados) dentro, canais de sódio e de potássio e a bomba de sódio e potássio; embaixo, o gráfico da voltagem pelo tempo, com as linhas de repouso (−70 mV), limiar (−55 mV) e pico (+30 mV), e uma faixa com os disparos por segundo',
    d: `<p>Em repouso, a membrana do neurônio é <b>polarizada</b>: o lado de dentro é negativo em relação ao de fora, cerca de <b>−70&nbsp;mV</b>. Isso acontece porque os íons estão distribuídos de forma desigual. Fora há muito <b>sódio (Na⁺)</b>, cerca de 10 vezes mais que dentro; dentro há muito <b>potássio (K⁺)</b>, cerca de 35 vezes mais que fora (Guyton). A <b>bomba de sódio e potássio</b> mantém essa diferença, gastando ATP: a cada ciclo, põe <b>3 Na⁺ para fora</b> e <b>2 K⁺ para dentro</b> (ver <a href="../morfofisiologia/index.html#membranas/bomba">bomba de sódio e potássio</a>). Como a membrana em repouso deixa vazar mais K⁺ do que Na⁺, o interior fica negativo.</p>
<p>Quando um estímulo leva a membrana até o <b>limiar</b>, cerca de <b>−55&nbsp;mV</b>, canais de Na⁺ se abrem, o sódio entra rápido e o interior fica positivo, até cerca de <b>+30&nbsp;mV</b>: é a <b>despolarização</b>. Logo depois, os canais de Na⁺ se fecham e canais de K⁺ se abrem; o potássio sai e a membrana volta a ficar negativa (<b>repolarização</b>). Esse <b>potencial de ação</b> dura cerca de <b>1&nbsp;milissegundo</b> e se propaga pelo axônio como uma onda, porque cada trecho despolarizado despolariza o trecho seguinte. Ele obedece à <b>lei do tudo ou nada</b>: um estímulo abaixo do limiar não dispara nada, e qualquer estímulo acima dele dispara um potencial de ação sempre do mesmo tamanho. Um estímulo mais forte não aumenta o potencial, aumenta a <b>frequência</b> de disparos. Logo depois de um disparo, o trecho fica um instante sem responder (período refratário), e é isso que faz o impulso seguir só para a frente. Anestésicos locais, como a lidocaína do dentista, bloqueiam os canais de Na⁺: o impulso de dor não chega ao cérebro.</p>
<p>Mova a faixa para mudar a intensidade do estímulo. Abaixo de 30, nada dispara; acima, a altura do potencial de ação não muda, só o número de disparos por segundo. O gráfico passa em câmera lenta.</p>`,
    kv: [['Repouso', '−70&nbsp;mV (dentro negativo)'], ['Limiar', 'cerca de −55&nbsp;mV'], ['Pico', 'cerca de +30&nbsp;mV'], ['Despolarização', 'Na⁺ entra'], ['Repolarização', 'K⁺ sai'], ['Bomba de Na⁺/K⁺', '3 Na⁺ para fora, 2 K⁺ para dentro, 1 ATP'], ['Duração', 'cerca de 1&nbsp;ms']],
    enem: 'Repouso: <b>dentro negativo</b>, Na⁺ concentrado <b>fora</b> e K⁺ <b>dentro</b>, mantidos pela <b>bomba de Na⁺/K⁺</b> (transporte ativo, gasta ATP). Potencial de ação: <b>Na⁺ entra</b> (despolarização), <b>K⁺ sai</b> (repolarização). A lei do <b>tudo ou nada</b> diz que o tamanho do impulso não depende da força do estímulo; o estímulo forte aumenta a <b>frequência</b>. Venenos e anestésicos que <b>bloqueiam canais de Na⁺</b> (a lidocaína, a toxina do baiacu) impedem o impulso.',
    links: [LK.bomba || ['Bomba de sódio e potássio', '../morfofisiologia/index.html#membranas/bomba'], ['A sinapse', '#nervoso/sinapse']],
    draw(t, S) {
      const A = area(), v = S.v, blk = !!S.blk, ts = tsim(t), x = ts - 1, supra = v >= 30 && !blk;
      let B, G, Rb;
      if (NAR) { const h1 = A.h * .44; B = { x0: A.x0, x1: A.x1, y0: A.y0, y1: A.y0 + h1 }; G = { x0: A.x0, x1: A.x1, y0: A.y0 + h1 + 10, y1: A.y1 - 44 }; Rb = { x0: A.x0, x1: A.x1, y0: A.y1 - 36, y1: A.y1 }; }
      else { const xm = A.x0 + A.w * .52; B = { x0: A.x0, x1: xm, y0: A.y0, y1: A.y1 }; G = { x0: xm + 24, x1: A.x1, y0: A.y0 + 20, y1: A.y0 + A.h * .72 }; Rb = { x0: xm + 58, x1: A.x1, y0: A.y0 + A.h * .8, y1: A.y1 }; }
      for (const q of [B, G, Rb]) { q.w = q.x1 - q.x0; q.h = q.y1 - q.y0; }
      if (!NAR) tx('voltagem da membrana', G.x0 + 34, G.y0 - 12, { s: 13, w: 600, a: 'left', c: N.txt });
      if (S.ax) axonVista(B, ts, v, blk, t); else membrana(B, ts, v, blk, t);
      grafico(G, ts, v, blk);
      raster(Rb, v, blk, t);
      let c;
      if (blk) c = '<b>Anestésico local</b>: os canais de Na⁺ ficam bloqueados; a membrana não chega ao limiar e o impulso não acontece.';
      else if (v < 30) c = 'Abaixo do limiar: a membrana mal se mexe e nada dispara (lei do <b>tudo ou nada</b>).';
      else if (x < 0) c = 'Repouso: dentro negativo (−70 mV). A bomba põe 3 Na⁺ para fora e 2 K⁺ para dentro, gastando ATP.';
      else if (x < .35) c = 'Estímulo: a membrana se aproxima do <b>limiar</b> (−55 mV).';
      else if (x < .7) c = '<b>Despolarização</b>: canais de Na⁺ se abrem, o Na⁺ entra e o interior fica positivo (até +30 mV).';
      else if (x < 1.5) c = '<b>Repolarização</b>: os canais de Na⁺ se fecham, os de K⁺ se abrem e o K⁺ sai.';
      else c = 'O potencial passa um pouco de −70 mV e volta ao repouso; logo depois do disparo há um instante refratário.';
      cap(c);
      return supra;
    }
  });

  // =====================================================================================
  // SINAPSE
  // =====================================================================================
  const SUBS = [
    { n: 'nenhuma', nt: 'neurotransmissor', enz: 1, tr: 1, rec: 1, post: 'célula seguinte', f: 'O neurotransmissor se liga aos receptores e depois é removido: parte é cortada por uma enzima, parte volta ao terminal (recaptação).' },
    { n: 'fluoxetina', nt: 'serotonina', enz: 0, tr: -1, rec: 1, post: 'célula seguinte', f: '<b>Fluoxetina</b> bloqueia o transportador de recaptação da serotonina: ela fica mais tempo na fenda e o efeito se prolonga.' },
    { n: 'cocaína', nt: 'dopamina', enz: 0, tr: -1, rec: 1, post: 'célula seguinte', f: '<b>Cocaína</b> bloqueia o transportador de recaptação da dopamina: ela se acumula na fenda e o efeito se prolonga.' },
    { n: 'organofosforado', nt: 'acetilcolina', enz: -1, tr: 0, rec: 1, post: 'fibra muscular', f: '<b>Organofosforado</b> inibe a acetilcolinesterase: a acetilcolina não é destruída, se acumula e continua estimulando a fibra.' },
    { n: 'curare', nt: 'acetilcolina', enz: 1, tr: 0, rec: -1, post: 'fibra muscular', f: '<b>Curare</b> ocupa os receptores de acetilcolina sem ativá-los: o neurotransmissor é liberado, mas não tem onde se ligar, e o músculo não se contrai.' }
  ];
  function geoSin(A) {
    const SA = NAR ? { x0: A.x0, x1: A.x1, y0: A.y0, y1: A.y1 - 58 } : { x0: A.x0, x1: A.x0 + A.w * .64, y0: A.y0, y1: A.y1 };
    SA.w = SA.x1 - SA.x0; SA.h = SA.y1 - SA.y0; SA.cx = (SA.x0 + SA.x1) / 2;
    const tw2 = Math.min(SA.w * .78, 460), gap = cl(SA.h * .15, 36, 64), yPre = SA.y0 + SA.h * .5, yPost = yPre + gap;
    const rx = [], nr = 5; for (let i = 0; i < nr; i++) rx.push(SA.cx + (i - 2) * tw2 * .17);
    return { SA, cx: SA.cx, tw: tw2, gap, yPre, yPost, rx,
      enz: [[SA.cx - tw2 * .26, yPre + gap * .5], [SA.cx + tw2 * .3, yPre + gap * .5]],
      tr: [[SA.cx - tw2 * .43, yPre], [SA.cx + tw2 * .43, yPre]],
      ca: [[SA.cx - tw2 / 2, yPre - 34], [SA.cx + tw2 / 2, yPre - 34]],
      dock: [-.3, -.1, .1, .3].map(f => [SA.cx + f * tw2, yPre - 12]) };
  }
  function sinInit(S) { S.nt = []; S.ca = []; S.fus = []; S.bound = new Array(5).fill(0); S.nextArr = 0; S.wave = -1; S.resp = 0; S.lvl = 0; S.dockT = [0, 0, 0, 0]; S.simt = 0; }
  function sinStep(S, g, dt, sub) {
    S.simt += dt;
    const rate = .25 + (S.v / 100) * 2.25;
    if (S.simt >= S.nextArr) { S.nextArr = S.simt + 1 / rate; S.wave = S.simt; }
    // a onda desce e abre os canais de Ca²⁺; depois, as vesículas se fundem
    if (S.wave >= 0 && S.simt - S.wave > .35 && !S.waveCa) { S.waveCa = 1; for (const c of g.ca) for (let i = 0; i < 3; i++) S.ca.push({ p0: [c[0] + (c[0] < g.cx ? -24 : 24), c[1] - 10 + i * 8], p1: [c[0] + (c[0] < g.cx ? 26 : -26), c[1] + 6 + i * 5], t: -i * .06 }); }
    if (S.wave >= 0 && S.simt - S.wave > .65) {
      const nf = 1 + (S.v > 40 ? 1 : 0) + (S.v > 75 ? 1 : 0);
      const free = [0, 1, 2, 3].filter(i => S.dockT[i] <= S.simt).sort(() => Math.random() - .5).slice(0, nf);
      for (const i of free) { S.dockT[i] = S.simt + 1.4; S.fus.push({ i, t: 0 }); }
      S.wave = -1; S.waveCa = 0;
    }
    for (const c of S.ca) c.t += dt; S.ca = S.ca.filter(c => c.t < .45);
    for (const f of S.fus) { f.t += dt; if (f.t >= .25 && !f.rel) { f.rel = 1; const d = g.dock[f.i]; for (let k = 0; k < 9; k++) S.nt.push({ x: d[0] + (Math.random() - .5) * 10, y: g.yPre + 3, vx: (Math.random() - .5) * 40, vy: 30 + Math.random() * 30, st: 0, t: 0 }); } }
    S.fus = S.fus.filter(f => f.t < .5);
    // neurotransmissor: difusão, ligação, remoção
    const xl = g.cx - g.tw / 2 + 4, xr = g.cx + g.tw / 2 - 4;
    for (let i = 0; i < 5; i++) if (S.bound[i] > 0) { S.bound[i] -= dt; if (S.bound[i] <= 0) { S.bound[i] = 0; S.nt.push({ x: g.rx[i], y: g.yPost - 8, vx: (Math.random() - .5) * 50, vy: -40, st: 0, t: 0 }); } }
    for (const p of S.nt) {
      p.t += dt;
      if (p.st === 0) {
        p.vx += (Math.random() - .5) * 360 * dt; p.vy += (Math.random() - .5) * 360 * dt + 70 * dt; p.vx *= .97; p.vy *= .97;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.y < g.yPre + 3) { p.y = g.yPre + 3; p.vy = Math.abs(p.vy); }
        if (p.y > g.yPost - 4) { p.y = g.yPost - 4; p.vy = -Math.abs(p.vy);
          if (sub.rec > 0) { const i = g.rx.findIndex(rx => Math.abs(rx - p.x) < 13); if (i >= 0 && S.bound[i] === 0) { S.bound[i] = .6; p.st = 9; } } }
        if (p.x < xl || p.x > xr) { if (Math.random() < .25) p.st = 9; else { p.x = cl(p.x, xl, xr); p.vx = -p.vx; } }
        if (sub.enz > 0) for (const e of g.enz) if (Math.hypot(p.x - e[0], p.y - e[1]) < 15 && Math.random() < 2.2 * dt) { p.st = 2; p.t = 0; p.cx = e[0]; p.cy = e[1]; }
        if (sub.tr > 0) for (const q of g.tr) if (Math.hypot(p.x - q[0], p.y - q[1]) < 16 && Math.random() < 4 * dt) { p.st = 3; p.t = 0; p.x = q[0]; }
        if (sub.enz <= 0 && sub.tr <= 0 && Math.random() < .12 * dt) p.st = 9;
        if (sub.enz > 0 && sub.tr <= 0 && Math.random() < .05 * dt) p.st = 9;
        if (sub.tr > 0 && sub.enz <= 0 && Math.random() < .05 * dt) p.st = 9;
      } else if (p.st === 3) { p.y -= 60 * dt; if (p.t > .5) p.st = 9; }
      else if (p.st === 2) { if (p.t > .5) p.st = 9; }
    }
    S.nt = S.nt.filter(p => p.st !== 9);
    if (S.nt.length > 170) S.nt.splice(0, S.nt.length - 170);
    const nb = S.bound.filter(b => b > 0).length, freeN = S.nt.filter(p => p.st === 0).length;
    S.resp += ((sub.rec > 0 ? nb / 5 : 0) - S.resp) * Math.min(1, dt * 3);
    S.lvl += (Math.min(1, freeN / 60) - S.lvl) * Math.min(1, dt * 3);
  }
  function tesoura(x, y, a, on) {
    const c = on ? '#E8EDF7' : '#6B7591';
    X.save(); X.translate(x, y);
    for (const sg of [-1, 1]) { X.save(); X.rotate(sg * a); ell(5, 0, 7, 2, 0, c); circ(-5, sg * 3, 3, null, c, 1.5); X.restore(); }
    circ(0, 0, 1.5, '#1A2440'); X.restore();
  }
  function vQuimica(A, t, S) {
    const g = geoSin(A), sub = SUBS[S.sub || 0], inib = !!S.inib && !S.sub;
    if (!S.nt || S.gk !== g.cx + '|' + g.yPre) { S.gk = g.cx + '|' + g.yPre; sinInit(S); if (S.paused) for (let i = 0; i < 80; i++) sinStep(S, g, .05, sub); }
    sinStep(S, g, S.dt || 0, sub);
    const { SA, cx, tw: tw2, yPre, yPost } = g;
    // célula seguinte
    const bright = inib ? 0 : S.resp;
    rr(cx - tw2 * .62, yPost, tw2 * 1.24, SA.y1 - yPost + 10, 18, rgba(sub.post === 'fibra muscular' ? N.musc : N.neur, .25 + .45 * bright), 'rgba(11,15,28,.6)', 1.4);
    if (inib) rr(cx - tw2 * .62, yPost, tw2 * 1.24, SA.y1 - yPost + 10, 18, `rgba(11,15,28,${.15 + .5 * S.resp})`);
    line(cx - tw2 * .62, yPost, cx + tw2 * .62, yPost, N.rosa, 2);
    // terminal do axônio
    const nk = 22, y0 = SA.y0, yb = SA.y0 + SA.h * .18;
    X.beginPath(); X.moveTo(cx - nk, y0); X.lineTo(cx - nk, yb); X.bezierCurveTo(cx - nk, yb + 20, cx - tw2 / 2, yb + 10, cx - tw2 / 2, yb + 50); X.lineTo(cx - tw2 / 2, yPre - 18); X.quadraticCurveTo(cx - tw2 / 2, yPre, cx - tw2 / 2 + 18, yPre); X.lineTo(cx + tw2 / 2 - 18, yPre); X.quadraticCurveTo(cx + tw2 / 2, yPre, cx + tw2 / 2, yPre - 18); X.lineTo(cx + tw2 / 2, yb + 50); X.bezierCurveTo(cx + tw2 / 2, yb + 10, cx + nk, yb + 20, cx + nk, yb); X.lineTo(cx + nk, y0);
    X.fillStyle = rgba(N.neur, .3); X.fill(); X.strokeStyle = N.rosa; X.lineWidth = 2; X.stroke();
    // onda do impulso descendo
    if (S.wave >= 0) { const f = cl((S.simt - S.wave) / .35, 0, 1); halo(cx, lerp(y0, yb + 40, f), 26, N.na, .55); }
    // mitocôndria
    ell(cx + tw2 * .22, yb + 40, 26, 12, .2, '#E86A4A', 'rgba(11,15,28,.5)', 1); for (let i = -2; i <= 2; i++) line(cx + tw2 * .22 + i * 8, yb + 32, cx + tw2 * .22 + i * 8 + 2, yb + 48, 'rgba(255,220,200,.6)', 1);
    // vesículas
    const R = rng(7);
    for (let i = 0; i < 7; i++) { const vx = cx + (R() - .5) * tw2 * .7, vy = yb + 50 + R() * (yPre - yb - 90); circ(vx, vy, 8, rgba(N.nt, .18), rgba(N.nt, .8), 1.2); for (let j = 0; j < 3; j++) circ(vx + (j - 1) * 3.5, vy + (j % 2) * 2, 1.6, N.nt); }
    g.dock.forEach((d, i) => {
      const fu = S.fus.find(f => f.i === i), ready = S.dockT[i] <= S.simt;
      if (fu) { const f = fu.t / .25; circ(d[0], lerp(d[1], yPre - 2, cl(f, 0, 1)), 8 * (1 - cl(f - 1, 0, 1)), rgba(N.nt, .25), rgba(N.nt, .8), 1.2); }
      else if (ready) { circ(d[0], d[1], 8, rgba(N.nt, .25), rgba(N.nt, .8), 1.2); for (let j = 0; j < 3; j++) circ(d[0] + (j - 1) * 3.5, d[1] + (j % 2) * 2, 1.6, N.nt); }
    });
    // canais de Ca²⁺
    for (const c of g.ca) rr(c[0] - 6, c[1] - 9, 12, 18, 4, dark(N.ca, .35), 'rgba(11,15,28,.6)', 1);
    for (const c of S.ca) { const f = cl(c.t / .4, 0, 1); if (f > 0) circ(lerp(c.p0[0], c.p1[0], f), lerp(c.p0[1], c.p1[1], f), 3.5, N.ca); }
    // transportadores de recaptação
    if (sub.tr !== 0) for (const q of g.tr) { rr(q[0] - 7, q[1] - 10, 14, 20, 5, sub.tr > 0 ? '#E9A7D9' : '#5A6077', 'rgba(11,15,28,.6)', 1); if (sub.tr < 0) { line(q[0] - 9, q[1] - 9, q[0] + 9, q[1] + 9, N.alerta, 2.4); line(q[0] + 9, q[1] - 9, q[0] - 9, q[1] + 9, N.alerta, 2.4); } }
    // enzimas
    if (sub.enz !== 0) for (const e of g.enz) { tesoura(e[0], e[1], sub.enz > 0 ? .25 + .2 * Math.abs(Math.sin(t * 6)) : .05, sub.enz > 0); if (sub.enz < 0) circ(e[0] + 9, e[1] - 6, 4, N.alerta); }
    // receptores ("fechaduras") e neurotransmissor ligado
    g.rx.forEach((x, i) => {
      rr(x - 9, yPost - 2, 6, 12, 2, N.rec); rr(x + 3, yPost - 2, 6, 12, 2, N.rec); rr(x - 9, yPost + 6, 18, 6, 2, N.rec);
      if (sub.rec < 0) rr(x - 10, yPost - 7, 20, 7, 3, '#9AA3B2', 'rgba(11,15,28,.6)', 1);
      else if (S.bound[i] > 0) circ(x, yPost + 2, 3.4, N.nt);
    });
    // neurotransmissor livre
    for (const p of S.nt) {
      if (p.st === 2) { const a = 1 - p.t / .5; circ(p.x - 3 - p.t * 10, p.y, 2, rgba(N.nt, a)); circ(p.x + 3 + p.t * 10, p.y, 2, rgba(N.nt, a)); }
      else circ(p.x, p.y, 3.2, N.nt, 'rgba(11,15,28,.4)', .8);
    }
    // rótulos
    lab(cx - nk, y0 + 20, cx - nk - 50, y0 + 20, 'terminal do axônio');
    lab(cx + tw2 / 2, yPre + g.gap / 2, cx + tw2 / 2 + 20, yPre + g.gap / 2, 'fenda (cerca de 20 nm)');
    lab(g.rx[4], yPost + 6, g.rx[4] + 20, yPost + 46, 'receptores');
    lab(g.dock[0][0], g.dock[0][1], g.dock[0][0] - 50, g.dock[0][1] - 40, 'vesícula');
    if (sub.enz !== 0) lab(g.enz[0][0], g.enz[0][1], g.enz[0][0] - 40, g.enz[0][1] + 44, sub.nt === 'acetilcolina' ? 'acetilcolinesterase' : 'enzima');
    if (sub.tr !== 0) lab(g.tr[1][0], g.tr[1][1] - 8, g.tr[1][0] + 30, g.tr[1][1] - 46, sub.tr > 0 ? 'recaptação' : 'recaptação bloqueada');
    lab(g.ca[0][0], g.ca[0][1], g.ca[0][0] - 30, g.ca[0][1] - 40, 'canal de Ca²⁺');
    lab(cx - tw2 * .4, SA.y1 - 14, cx - tw2 * .4 - 20, SA.y1 - 14, sub.post);
    return g;
  }
  function vEletrica(A, t, S) {
    const g = geoSin(A), { SA, cx, tw: tw2, yPre } = g, gp = 8, yPost = yPre + gp;
    const per = 2.2, ph = S.paused ? .5 : fr(t / per) * per, on = ph > .35 && ph < 1.2;
    S.resp += ((on ? 1 : 0) - S.resp) * Math.min(1, (S.dt || 0) * 8); if (S.paused) S.resp = .8; S.lvl = 0;
    rr(cx - tw2 / 2, SA.y0 + 10, tw2, yPre - SA.y0 - 10, 18, rgba(N.neur, .3), N.rosa, 2);
    rr(cx - tw2 / 2, yPost, tw2, SA.y1 - yPost, 18, rgba(N.neur, .25 + .45 * S.resp), N.rosa, 2);
    halo(cx, lerp(SA.y0 + 10, yPre - 20, cl(ph / .35, 0, 1)), 28, N.na, ph < .4 ? .5 : 0);
    const nc = 5;
    for (let i = 0; i < nc; i++) {
      const x = cx + (i - 2) * tw2 * .16; rr(x - 8, yPre - 14, 16, 14 + gp + 14, 5, '#7C8BB8', 'rgba(11,15,28,.6)', 1); rr(x - 2.5, yPre - 14, 5, 28 + gp, 2, '#1A2440');
      if (on) for (let j = 0; j < 2; j++) { const f = fr((ph - .35) * 1.5 + j * .5 + i * .13), up = (i + j) % 3 === 0; circ(x, up ? lerp(yPost + 24, yPre - 30, f) : lerp(yPre - 30, yPost + 24, f), 3, j ? N.k : N.na); }
    }
    lab(cx + tw2 * .32, yPre, cx + tw2 * .32 + 30, yPre - 44, 'junções comunicantes');
    lab(cx - tw2 * .3, SA.y0 + 30, cx - tw2 * .3 - 40, SA.y0 + 30, 'neurônio');
    lab(cx - tw2 * .3, SA.y1 - 20, cx - tw2 * .3 - 40, SA.y1 - 20, 'célula seguinte');
    if (LB) tx('os íons passam direto, nos dois sentidos', cx, SA.y1 - 50, { s: 12, w: 600, c: N.txt });
    return g;
  }
  function medidores(A, S, sub, ele) {
    const inib = !!S.inib && !S.sub;
    const resp = ele ? 'célula seguinte ativada' : inib ? 'célula seguinte inibida' : sub.rec < 0 ? 'resposta: bloqueada' : 'resposta da ' + sub.post;
    const bar = (x, y, w, f, c, nm) => { tx(nm, x, y - 11, { s: 13, w: 600, a: 'left', c: N.txt, bg: false }); rr(x, y, w, 10, 5, 'rgba(91,108,153,.3)'); if (f > .01) rr(x, y, Math.max(6, w * cl(f, 0, 1)), 10, 5, c); };
    if (NAR) {
      const y = A.y1 - 30, w = (A.w - 16) / 2;
      bar(A.x0, y, w, S.lvl, N.nt, 'na fenda'); bar(A.x0 + w + 16, y, w, S.resp, inib ? '#9AA3B2' : N.na, inib ? 'inibição' : 'resposta');
    } else {
      const x0 = A.x0 + A.w * .69, w = A.x1 - x0 - 4;
      if (!ele) pill(x0, A.y0 + 16, 'substância: ' + sub.n, { a: 'left', s: 13, c: sub.n === 'nenhuma' ? N.dim : N.txt });
      if (!ele && S.sub) tx('neurotransmissor: ' + sub.nt, x0, A.y0 + 48, { s: 13, w: 600, a: 'left', c: N.nt });
      bar(x0, A.y0 + A.h * .4, w, ele ? 0 : S.lvl, N.nt, ele ? 'sem neurotransmissor' : sub.nt + ' na fenda');
      bar(x0, A.y0 + A.h * .4 + 56, w, S.resp, inib ? '#9AA3B2' : N.na, resp);
    }
  }
  def('nervoso', 'sinapse', {
    t: 'A sinapse', s: 'como um neurônio passa o sinal adiante', c: N.nt, loc: 'Terminal do axônio e célula seguinte', still: 3, stillV: 40,
    ctl: { l: 'Impulsos', min: 1, max: 100, step: 1, v: 20, f: v => nbr(v) + ' por segundo', rate: () => 1 },
    extra: [
      { t: 'Substância', on: S => { S.sub = ((S.sub || 0) + 1) % SUBS.length; S.ele = false; }, pressed: S => !!S.sub },
      { t: 'Inibitória', on: S => { S.inib = !S.inib; S.sub = 0; S.ele = false; }, pressed: S => !!S.inib && !S.sub },
      { t: 'Elétrica', on: S => { S.ele = !S.ele; }, pressed: S => !!S.ele }
    ],
    alt: 'O terminal do axônio em cima, com vesículas cheias de neurotransmissor, a fenda sináptica no meio e a célula seguinte embaixo, com receptores em forma de fechadura. O impulso chega, o cálcio entra, as vesículas liberam o neurotransmissor, que se liga aos receptores e depois é cortado por uma enzima ou recapturado. Um seletor mostra o efeito de fluoxetina, cocaína, organofosforado e curare; outro botão mostra a sinapse elétrica',
    d: `<p><b>Sinapse</b> é o ponto de comunicação entre um neurônio e outra célula: outro neurônio, uma fibra muscular (a junção neuromuscular, ver <a href="#muscular/contracao">contração muscular</a>) ou uma glândula. Na <b>sinapse química</b>, a mais comum, as duas células não se tocam: entre elas há a <b>fenda sináptica</b>, de cerca de <b>20&nbsp;nm</b>. Quando o impulso chega ao terminal do axônio, canais de <b>Ca²⁺</b> se abrem, o cálcio entra e faz <b>vesículas</b> cheias de <b>neurotransmissor</b> se fundirem com a membrana e o liberarem na fenda (exocitose). O neurotransmissor se liga a <b>receptores</b> na célula seguinte e abre canais iônicos: pode <b>excitá-la</b> (aproximá-la do limiar) ou <b>inibi-la</b> (afastá-la). Depois, ele é <b>destruído</b> por enzimas, como a acetilcolinesterase, ou <b>recapturado</b> pelo terminal que o liberou. Como só o terminal tem vesículas e só a célula seguinte tem receptores, o sinal segue em <b>um só sentido</b>. Há também <b>sinapses elétricas</b>, em que junções comunicantes deixam os íons passarem direto de uma célula a outra: são mais rápidas e existem em algumas regiões do encéfalo e na retina; as mesmas junções comunicantes ligam as células do músculo cardíaco (ver <a href="#muscular/tipos">tipos de músculo</a>).</p>
<p>Alguns neurotransmissores para conhecer: <b>acetilcolina</b> (músculos, memória), <b>glutamato</b> (o principal excitatório do encéfalo), <b>GABA</b> (o principal inibitório), <b>dopamina</b> (movimento, motivação e recompensa; a doença de Parkinson vem da perda de neurônios que produzem dopamina), <b>serotonina</b> (humor, sono, apetite) e <b>noradrenalina</b> (alerta). Muitos medicamentos e drogas agem na sinapse. Antidepressivos como a fluoxetina <b>bloqueiam a recaptação de serotonina</b>, que fica mais tempo na fenda; a <b>cocaína</b> bloqueia a recaptação de dopamina; os <b>organofosforados</b> inibem a acetilcolinesterase; os <b>benzodiazepínicos</b> reforçam o efeito do GABA.</p>
<p>A faixa muda quantos impulsos chegam por segundo: com mais impulsos, mais vesículas se abrem e o neurotransmissor se acumula na fenda. O botão "Substância" troca entre fluoxetina, cocaína, organofosforado e curare, sempre mostrando o mecanismo.</p>`,
    kv: [['Fenda sináptica', 'cerca de 20&nbsp;nm'], ['Gatilho da liberação', 'entrada de Ca²⁺ no terminal'], ['Liberação', 'exocitose das vesículas'], ['Remoção', 'enzima ou recaptação'], ['Sentido', 'único (química)'], ['Elétrica', 'junções comunicantes, sem fenda']],
    enem: 'A sequência é: impulso, entrada de <b>Ca²⁺</b>, liberação do <b>neurotransmissor</b> por exocitose, ligação a <b>receptores</b> e remoção por <b>enzima</b> ou <b>recaptação</b>. A sinapse química é <b>unidirecional</b>. As questões costumam pedir o efeito de uma substância: bloquear a <b>recaptação</b> (antidepressivos, cocaína) ou a <b>enzima</b> (organofosforados) <b>prolonga</b> o efeito do neurotransmissor; bloquear o <b>receptor</b> (curare) <b>impede</b> o efeito.',
    links: [['Junção neuromuscular', '#muscular/contracao'], ['O impulso nervoso', '#nervoso/impulso']],
    init(S) { S.nt = null; },
    draw(t, S) {
      const A = area(), sub = SUBS[S.sub || 0];
      if (S.ele) vEletrica(A, t, S); else vQuimica(A, t, S);
      medidores(A, S, sub, !!S.ele);
      if (S.ele) cap('<b>Sinapse elétrica</b>: as membranas quase se encostam e as junções comunicantes deixam os íons passarem direto, e nos dois sentidos; é mais rápida.');
      else if (S.inib && !S.sub) cap('<b>Sinapse inibitória</b>: o neurotransmissor abre canais que afastam a célula seguinte do limiar, e ela fica menos excitável.');
      else cap(sub.f);
    }
  });
}
