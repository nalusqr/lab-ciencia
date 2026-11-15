/* LAB · Embriologia. Seção Humano, parte E: placenta e cordão umbilical, gêmeos, semana a semana.
   Roteiro: docs/revisao-biologia/embriologia-roteiro-b.md (Sapien). Desenhos esquemáticos próprios em canvas 2D (Íris).
   Tudo fica dentro de um bloco para não colidir com os nomes das outras cenas. */
'use strict';
{
  // ---------- cores (paleta comum do motor; os tons extras são só deste arquivo) ----------
  const E = {
    amnio: C.amnio, corion: C.corion, alant: C.alant, vitelo: C.vitelo, mae: C.mae, ovo: C.ovo, esperma: C.esperma,
    ecto: C.ecto, meso: C.meso, endo: C.endo,
    sM: C.sangue, sF: C.sangueF, art: C.artUmb, veia: C.veiaUmb,
    lago: '#4A1520', hemM: '#C0303F', pele: '#F0C2AE', contorno: '#6B3B33', geleia: '#E6DAF2', placenta: '#8E2A40',
    alerta: '#FFB347', txt: C.txt, dim: C.dim
  };
  const PPM = 96 / 25.4; // px de CSS por milímetro (tamanho real aproximado na tela)
  const wrapE = (s, x, y, maxw, o) => wrapTx(s, x, y, maxw, o);
  // linhas que um texto ocupa (sem desenhar)
  function nLin(s, maxw, sz = 13, w = 400) { let n = 1, cur = ''; for (const p of s.split(' ')) { const t = cur ? cur + ' ' + p : p; if (cur && tw(t, sz, w) > maxw) { n++; cur = p; } else cur = t; } return n; }
  // transição suave quando o valor da faixa muda
  function trans(S, v, t) { if (S.lv !== v) { S.lv = v; S.t0 = t; } return S.paused ? 1 : ss((t - S.t0) / .45); }
  // pastilha de texto (selo)
  function pill(x, y, s, o = {}) {
    const sz = o.s || 13, w = tw(s, sz, o.w || 600) + 18, h = sz + 11, a = o.a || 'center', rx = a === 'left' ? x : a === 'right' ? x - w : x - w / 2;
    rr(rx, y - h / 2, w, h, 999, o.bg || 'rgba(11,15,28,.84)', o.bd || 'rgba(255,255,255,.16)', 1.2);
    tx(s, rx + w / 2, y + .5, { s: sz, w: o.w || 600, c: o.c || E.txt, bg: false }); return w;
  }
  // forma desenhada duas vezes: contorno (mais grossa) e preenchimento, para virar uma silhueta única
  function blob(parts, fill, edge, ew = 2.4) {
    for (const p of parts) p(ew, edge); for (const p of parts) p(0, fill);
  }
  const bC = (x, y, r) => (e, c) => circ(x, y, r + e, c);
  const bE = (x, y, rx, ry, rot) => (e, c) => ell(x, y, rx + e, ry + e, rot, c);
  const bL = (pts, w) => (e, c) => { X.lineCap = 'round'; poly(pts, c, w + e * 2); X.lineCap = 'butt'; };

  // ---------- embrião e feto (esquemáticos, de lado, olhando para a esquerda) ----------
  // embrião da 4ª à 7ª semana: corpo em "C", cabeça grande, cauda, brotos dos membros
  function embrC(x, y, L, wk) {
    const R = L * .36, cx = x + R * .2, cy = y, a0 = -PI * .62, a1 = PI * .74, N = 34, k = cl((wk - 4) / 3, 0, 1);
    const P = s => { const a = lerp(a0, a1, s); return [cx + Math.cos(a) * R, cy + Math.sin(a) * R, a]; };
    const rad = s => L * lerp(.15 + .05 * k, .022, Math.pow(s, .75 - .15 * k));
    const parts = [];
    for (let i = 0; i <= N; i++) { const s = i / N * (1 - .12 * k), [px, py] = P(s); parts.push(bC(px, py, rad(s))); }
    const bud = (s, sz) => { const [px, py, a] = P(s), r = rad(s); return bE(px - Math.cos(a) * r * .9, py - Math.sin(a) * r * .9, sz * 1.1, sz * .7, a + PI / 2); };
    parts.push(bud(.4, L * (.035 + .05 * k)), bud(.7, L * (.03 + .045 * k)));
    blob(parts, E.pele, E.contorno, Math.max(1.2, L * .015));
    // coração (bate a partir do ≈ 22º dia), arcos faríngeos, somitos, olho
    const [hx2, hy2, ha] = P(.3), hr = rad(.3);
    circ(hx2 - Math.cos(ha) * hr * .75, hy2 - Math.sin(ha) * hr * .75, L * (.075 - .015 * k), rgba(E.sF, .85), rgba('#0B0F1C', .4), 1);
    for (let i = 0; i < 3; i++) { const [px, py, a] = P(.17 + i * .04), r = rad(.17 + i * .04); circ(px - Math.cos(a) * r * .7, py - Math.sin(a) * r * .7, Math.max(1, L * .012), rgba(E.contorno, .6)); }
    for (let i = 0; i < 9; i++) { const s = .32 + i * .05, [px, py, a] = P(s), r = rad(s); circ(px + Math.cos(a) * r * .55, py + Math.sin(a) * r * .55, Math.max(.8, r * .2), rgba(E.contorno, .35)); }
    if (wk >= 5) { const [px, py, a] = P(.06), r = rad(.06); circ(px - Math.cos(a) * r * .35 - r * .2, py - Math.sin(a) * r * .35 + r * .25, Math.max(1.2, L * .025), '#2A1A18'); }
    if (wk >= 6) { const [px, py, a] = P(.4), r = rad(.4); const bx = px - Math.cos(a) * r * .9, by = py - Math.sin(a) * r * .9; for (let i = -1; i <= 1; i++) line(bx, by, bx - Math.cos(a) * L * .05 + i * L * .015, by - Math.sin(a) * L * .05, rgba(E.contorno, .55), 1); }
    return { umb: P(.5) };
  }
  // feto (8ª semana em diante): cabeça cada vez menor em proporção, membros dobrados
  function feto(x, y, L, wk, rot = 0) {
    const k = cl((wk - 8) / 30, 0, 1), hr = L * lerp(.25, .15, k), fat = lerp(.82, 1.08, k);
    const top = -L / 2, hcx = -L * .05, hcy = top + hr, tY0 = top + hr * 1.6, tY1 = L / 2, tcx = L * .05, tcy = (tY0 + tY1) / 2, tRy = (tY1 - tY0) / 2 + L * .02, trx = tRy * .6 * fat;
    const lw = trx * .5, aw = lw * .72;
    X.save(); X.translate(x, y); X.rotate(rot);
    const parts = [bC(hcx, hcy, hr), bE(tcx, tcy, trx, tRy, -.12),
      bL([[tcx, tY1 - L * .08], [-L * .2, tY1 - L * .26], [-L * .26, tY1 - L * .05]], lw),
      bL([[hcx + hr * .1, tY0 + L * .06], [-L * .14, tY0 + L * .2], [-L * .2, tY0 + L * .02]], aw)];
    blob(parts, E.pele, E.contorno, Math.max(1.2, L * .012));
    // contornos internos do braço e da perna, olho, orelha, coto do cordão
    X.lineCap = 'round'; poly([[tcx, tY1 - L * .08], [-L * .2, tY1 - L * .26], [-L * .26, tY1 - L * .05]], rgba(E.contorno, .45), 1.2); poly([[hcx + hr * .1, tY0 + L * .06], [-L * .14, tY0 + L * .2], [-L * .2, tY0 + L * .02]], rgba(E.contorno, .45), 1.2); X.lineCap = 'butt';
    if (wk < 10) for (let i = -1; i <= 1; i++) line(-L * .2, tY0 + L * .02, -L * .25 + i * L * .015, tY0 - L * .03, rgba(E.contorno, .5), 1);
    ell(hcx - hr * .5, hcy + hr * .1, Math.max(1.2, hr * .1), Math.max(1, hr * (wk >= 26 ? .06 : .03)), 0, '#2A1A18');
    X.beginPath(); X.arc(hcx + hr * .15, hcy + hr * .15, Math.max(1.5, hr * .15), -PI * .4, PI * .6); X.strokeStyle = rgba(E.contorno, .6); X.lineWidth = 1.2; X.stroke();
    const ux = tcx - trx * .92, uy = tcy + tRy * .15;
    X.restore();
    const c = Math.cos(rot), s = Math.sin(rot);
    return { umb: [x + ux * c - uy * s, y + ux * s + uy * c] };
  }
  // 1ª semana: blastocisto; 2ª: disco com 2 folhetos entre o âmnio e a vesícula vitelínica; 3ª: disco com 3 folhetos
  function blasto(x, y, r) {
    circ(x, y, r, '#1A1430', E.corion, Math.max(1.2, r * .12));
    X.save(); X.beginPath(); X.arc(x, y, r * .94, 0, TAU); X.clip(); ell(x, y - r * .62, r * .6, r * .42, 0, E.ovo); X.restore();
  }
  function disco2(x, y, r) {
    circ(x, y, r, 'rgba(183,155,255,.12)', E.corion, Math.max(1, r * .06));
    ell(x, y - r * .3, r * .5, r * .32, 0, rgba(E.amnio, .35), E.amnio, Math.max(1, r * .04));
    ell(x, y + r * .32, r * .42, r * .3, 0, rgba(E.vitelo, .45), E.vitelo, Math.max(1, r * .04));
    rr(x - r * .5, y - r * .06, r, r * .08, 2, E.ecto); rr(x - r * .5, y + r * .02, r, r * .07, 2, E.endo);
  }
  function disco3(x, y, r) {
    X.beginPath(); X.moveTo(x, y - r); X.bezierCurveTo(x + r * .8, y - r, x + r * .55, y + r * .9, x, y + r * .9); X.bezierCurveTo(x - r * .55, y + r * .9, x - r * .8, y - r, x, y - r);
    X.fillStyle = rgba(E.ecto, .85); X.fill(); X.strokeStyle = light(E.ecto, .3); X.lineWidth = Math.max(1, r * .05); X.stroke();
    line(x, y + r * .05, x, y + r * .75, rgba(E.meso, .95), Math.max(1.2, r * .08)); circ(x, y, Math.max(1.2, r * .07), E.meso);
    line(x, y - r * .7, x, y - r * .05, rgba(C.noto || '#3FBF6A', .9), Math.max(1, r * .05));
  }
  function figura(x, y, L, wk, rot) {
    if (wk <= 1) blasto(x, y, L / 2); else if (wk === 2) disco2(x, y, L / 2); else if (wk === 3) disco3(x, y, L / 2);
    else if (wk < 8) return embrC(x, y, L, wk); else return feto(x, y, L, wk, rot);
    return null;
  }
  // cordão umbilical enrolado entre dois pontos: geleia clara com 2 artérias (azuladas) e 1 veia (vermelha)
  function cordao(p0, p1, bend, w) {
    const qx = (p0[0] + p1[0]) / 2 + bend[0], qy = (p0[1] + p1[1]) / 2 + bend[1], N = 40, pts = [];
    for (let i = 0; i <= N; i++) pts.push(qpt(p0[0], p0[1], qx, qy, p1[0], p1[1], i / N));
    X.lineCap = 'round'; poly(pts, rgba(E.geleia, .9), w); X.lineCap = 'butt';
    const str = (ph, c) => { X.beginPath(); for (let i = 0; i <= N; i++) { const [px, py] = pts[i], [qx2, qy2] = pts[Math.min(N, i + 1)], [rx2, ry2] = pts[Math.max(0, i - 1)], dx = qx2 - rx2, dy = qy2 - ry2, d = Math.hypot(dx, dy) || 1, o = Math.sin(i * .9 + ph) * w * .28; const xx = px - dy / d * o, yy = py + dx / d * o; i ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } X.strokeStyle = c; X.lineWidth = Math.max(1.2, w * .22); X.stroke(); };
    str(0, E.art); str(2.1, E.art); str(4.2, E.veia);
    return pts;
  }

  // =====================================================================================
  // PLACENTA E CORDÃO UMBILICAL
  // =====================================================================================
  const NIV = ['útero', 'placenta', 'vilosidade', 'membrana', 'cordão'];
  const SUB = [
    { n: 'O₂', c: '#FF6B6B', d: 1, t: '<b>O₂</b> passa do sangue da mãe para o do feto, atravessando a membrana placentária' },
    { n: 'glicose', c: '#FFE1A6', d: 1, t: '<b>Glicose</b> passa da mãe para o feto, atravessando a membrana placentária' },
    { n: 'CO₂', c: '#9AA3B2', d: -1, t: '<b>CO₂</b> faz o caminho contrário: do feto para a mãe, que o elimina pelos pulmões' },
    { n: 'ureia', c: '#E9E2B0', d: -1, t: '<b>Ureia</b>, excreta do feto, passa para o sangue da mãe e sai pelos rins dela' },
    { n: 'anticorpos IgG', nn: 'IgG', c: '#8FD8FF', d: 1, t: '<b>Anticorpos IgG</b> da mãe passam para o feto' },
    { n: 'álcool', c: E.alerta, d: 1, al: 1, t: '<b>Álcool atravessa</b> a placenta e chega ao feto: a barreira não é perfeita' },
    { n: 'vírus da rubéola', nn: 'rubéola', c: E.alerta, d: 1, al: 1, t: 'O <b>vírus da rubéola</b> atravessa a placenta e pode causar malformações (a vacina previne)' },
    { n: 'hemácia', c: E.hemM, d: 0, t: '<b>Hemácias não atravessam</b>: o sangue da mãe e o do feto nunca se misturam' }
  ];
  let hot = null; // pastilhas clicáveis do nível "membrana" (posição atual na tela)
  const subAt = S => S.pick != null ? S.pick : Math.floor(S.ph / 3.5) % SUB.length;
  function hookCanvas() {
    if (cv.dataset.irisHook) return; cv.dataset.irisHook = '1';
    const hit = e => { if (!hot || performance.now() - hot.at > 250) return -1; const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; return hot.chips.findIndex(c => x >= c[0] && x <= c[0] + c[2] && y >= c[1] && y <= c[1] + c[3]); };
    cv.addEventListener('click', e => { const i = hit(e); if (i >= 0) hot.S.pick = hot.S.pick === i ? null : i; });
    cv.addEventListener('mousemove', e => { cv.style.cursor = hit(e) >= 0 ? 'pointer' : ''; });
  }
  function setNivel(S, v) { S.v = v; S.touch = performance.now(); const r = $('ctlR'); if (r) { r.value = v; $('ctlV').textContent = NIV[v]; r.setAttribute('aria-valuetext', NIV[v]); } }

  // nível 0: útero com o feto, o cordão e a placenta
  function nUtero(A, t) {
    const s = Math.min(A.w * .4, A.h * .47), cx = A.cx + (NAR ? 0 : -A.w * .04), cy = A.cy + s * .02;
    const forma = (k, ox = 0, oy = 0) => { X.beginPath(); const S2 = s * k, x = cx + ox, y = cy + oy; X.moveTo(x, y - S2 * .95); X.bezierCurveTo(x + S2 * 1.08, y - S2 * .98, x + S2 * .98, y + S2 * .45, x + S2 * .22, y + S2 * .84); X.lineTo(x + S2 * .13, y + S2 * 1.02); X.lineTo(x - S2 * .13, y + S2 * 1.02); X.lineTo(x - S2 * .22, y + S2 * .84); X.bezierCurveTo(x - S2 * .98, y + S2 * .45, x - S2 * 1.08, y - S2 * .98, x, y - S2 * .95); X.closePath(); };
    forma(1); X.fillStyle = dark(E.mae, .25); X.fill(); X.strokeStyle = E.mae; X.lineWidth = 2; X.stroke();
    forma(.84, 0, s * .02); X.fillStyle = rgba(E.mae, .55); X.fill();
    // placenta presa à parede, no alto e à direita
    const px = cx + s * .4, py = cy - s * .58;
    X.save(); forma(.84, 0, s * .02); X.clip();
    ell(px + s * .1, py - s * .08, s * .42, s * .2, .55, E.placenta, rgba(E.corion, .9), 3); X.restore();
    // âmnio com líquido amniótico
    forma(.7, -s * .02, s * .1); X.fillStyle = rgba(E.amnio, .2); X.fill(); X.strokeStyle = E.amnio; X.lineWidth = 2; X.stroke();
    // feto de cabeça para baixo, com cordão até a placenta
    const L = s * .95, f = feto(cx - s * .04, cy + s * .14, L, 34, PI * .92);
    const pl = [px - s * .02, py + s * .1];
    cordao(f.umb, pl, [-s * .32, -s * .05 + Math.sin(t) * 3], Math.max(5, s * .05));
    lab(px + s * .1, py - s * .05, A.x1 - (NAR ? 4 : 40), A.y0 + 20, 'placenta');
    lab(pl[0] - s * .25, pl[1] + s * .05, NAR ? A.x0 + 4 : A.x0 + 20, A.y0 + 30, 'cordão umbilical');
    lab(cx + s * .5, cy + s * .25, A.x1 - (NAR ? 4 : 30), cy + s * .38, NAR ? 'âmnio' : 'âmnio com líquido amniótico');
    lab(cx - s * .68, cy - s * .2, NAR ? A.x0 + 4 : A.x0 + 10, cy + s * .55, NAR ? 'parede do útero' : 'parede do útero (endométrio)');
    lab(cx - s * .1, cy + s * .2, NAR ? A.x0 + 4 : A.x0 + 30, cy - s * .2, 'feto');
    return 'O feto fica dentro do <b>âmnio</b>, ligado à <b>placenta</b> pelo <b>cordão umbilical</b>. Aumente o zoom para ver a placenta por dentro';
  }
  // nível 1: corte da placenta (mãe em cima, feto embaixo)
  function arvore(x, y, len, ang, dep, w, R, out) {
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len; out.push([x, y, x2, y2, w]);
    if (dep > 0) { arvore(x2, y2, len * (.62 + R() * .12), ang - .42 - R() * .2, dep - 1, w * .72, R, out); arvore(x2, y2, len * (.62 + R() * .12), ang + .38 + R() * .2, dep - 1, w * .72, R, out); }
  }
  function nPlacenta(A, t) {
    const yd0 = A.y0 + 4, yd1 = A.y0 + A.h * .17, yc0 = A.y1 - A.h * .26, yc1 = yc0 + A.h * .08;
    rr(A.x0, yd0, A.w, yd1 - yd0, 8, dark(E.mae, .1)); rr(A.x0, yd1, A.w, yc0 - yd1, 0, E.lago);
    grains(A.x0 + 4, yd0 + 4, A.w - 8, yd1 - yd0 - 8, light(E.mae, .2), .5, 11);
    // artérias espiraladas da mãe jorram sangue no lago
    const nA = NAR ? 3 : 4, R = rng(5);
    for (let i = 0; i < nA; i++) {
      const ax = A.x0 + A.w * (i + .5) / nA + A.w * .06; const pts = []; for (let j = 0; j <= 10; j++) pts.push([ax + Math.sin(j * 1.3) * 5, lerp(yd0 + 2, yd1 + 2, j / 10)]); poly(pts, E.hemM, 4);
      for (let k = 0; k < 10; k++) { const f = fr(t * .25 + k / 10 + i * .17), a = (R() - .5) * 1.6; circ(ax + Math.sin(a) * f * A.h * .35, yd1 + 4 + Math.cos(a) * f * (yc0 - yd1) * .85, 3.2, rgba(E.hemM, .9 * (1 - f))); }
    }
    // vilosidades: árvores do córion mergulhadas no sangue materno
    const nV = NAR ? 3 : 5, R2 = rng(21), seg2 = [];
    for (let i = 0; i < nV; i++) arvore(A.x0 + A.w * .06 + A.w * .88 * (i + .5) / nV, yc0 + 2, (yc0 - yd1) * .42, -PI / 2 + (R2() - .5) * .3, 3, NAR ? 11 : 14, R2, seg2);
    X.lineCap = 'round';
    for (const g of seg2) line(g[0], g[1], g[2], g[3], E.corion, g[4] + 4);
    for (const g of seg2) line(g[0], g[1], g[2], g[3], '#3A2552', g[4]);
    for (const g of seg2) line(g[0], g[1], g[2], g[3], rgba(E.sF, .85), Math.max(1.5, g[4] * .32));
    X.lineCap = 'butt';
    // placa coriônica (parte fetal), âmnio e cordão
    rr(A.x0, yc0, A.w, yc1 - yc0, 6, rgba(E.corion, .85)); line(A.x0, yc1 + 2, A.x1, yc1 + 2, E.amnio, 2.5);
    const cx = A.cx; line(cx - A.w * .3, yc0 + 6, cx + A.w * .3, yc0 + 6, E.art, 2); line(cx - A.w * .3, yc0 + 11, cx + A.w * .3, yc0 + 11, E.veia, 2);
    cordao([cx, yc1], [cx + 10, A.y1 + 4], [16 * Math.sin(t * .8), 0], 16);
    tx('lado da mãe', A.x0 + 10, yd0 + 12, { a: 'left', s: 12, w: 600, c: E.txt });
    tx('lado do feto', A.x0 + 10, yc1 + 14, { a: 'left', s: 12, w: 600, c: E.txt });
    const v = seg2[seg2.length - 3];
    lab(A.x0 + A.w * .2, (yd0 + yd1) / 2, A.x0 + A.w * .12, yd1 + 18, NAR ? 'decídua basal (mãe)' : 'decídua basal: parte materna');
    lab(A.x0 + A.w * .25, (yc0 + yc1) / 2, A.x0 + 8, yc1 + 26, NAR ? 'córion viloso (feto)' : 'córion viloso: parte fetal');
    lab(v[2], v[3], A.x1 - 8, A.y0 + A.h * .4, 'vilosidade coriônica');
    lab(A.x0 + A.w * (NAR ? .5 : .3), yd1 + (yc0 - yd1) * .15, A.x0 + A.w * .46, yd1 + (yc0 - yd1) * .1, 'sangue materno');
    lab(cx + 4, yc1 + 18, cx + 50, A.y1 - 8, 'cordão umbilical');
    return 'A placenta tem uma <b>parte materna</b> (decídua basal) e uma <b>parte fetal</b> (córion viloso). As vilosidades ficam mergulhadas em lagos de sangue da mãe';
  }
  // nível 2: uma vilosidade com o capilar fetal dentro
  function hemacia(x, y, r, c, a = 1) { X.save(); X.globalAlpha *= a; ell(x, y, r, r * .8, 0, c, 'rgba(11,15,28,.5)', 1); ell(x, y, r * .45, r * .32, 0, dark(c, .25)); X.restore(); }
  function nVilo(A, t) {
    rr(A.x0, A.y0, A.w, A.h, 10, E.lago);
    const yb = A.y1 - A.h * .14, fw = Math.min(A.w * (NAR ? .19 : .13), 96), cx = A.cx;
    const F = [{ x: cx, top: A.y0 + A.h * .1 }, { x: cx - fw * 1.55, top: A.y0 + A.h * .32 }, { x: cx + fw * 1.55, top: A.y0 + A.h * .24 }];
    // hemácias da mãe passando em volta (por trás das vilosidades)
    const R = rng(9);
    for (let i = 0; i < (NAR ? 16 : 26); i++) { const y = A.y0 + 16 + R() * (yb - A.y0 - 30), x = A.x0 + fr(R() + t * (.04 + R() * .03)) * A.w; hemacia(x, y + Math.sin(t * 2 + i) * 3, 7, E.hemM, .95); }
    const fill = (e, c) => { for (const f of F) rr(f.x - fw / 2 - e, f.top - e, fw + e * 2, yb - f.top + e * 2, fw / 2 + e, c); rr(cx - fw * 2.4 - e, yb - 6 - e, fw * 4.8 + e * 2, A.y1 - yb + 6 + e * 2, 8, c); };
    fill(4, E.corion); fill(0, '#3A2552');
    // capilar em "U" dentro de cada dedo: chega azulado (pobre em O₂), sai vermelho (rico em O₂)
    const loops = F.map(f => { const lx = f.x - fw * .2, rx = f.x + fw * .2, yt = f.top + fw * .38; return [[lx, A.y1 + 2], [lx, yt + fw * .18], [lx + fw * .05, yt + fw * .04], [f.x, yt - fw * .02], [rx - fw * .05, yt + fw * .04], [rx, yt + fw * .18], [rx, A.y1 + 2]]; });
    for (const p of loops) {
      const n = 40; for (let i = 0; i < n; i++) { const a = pth(p, i / n), b = pth(p, (i + 1) / n), f = i / n; X.lineCap = 'round'; line(a[0], a[1], b[0], b[1], f < .38 ? E.art : f > .62 ? E.veia : f < .5 ? E.art : E.veia, fw * .17); }
      X.lineCap = 'butt';
      for (let k = 0; k < 6; k++) { const f = fr(t * .12 + k / 6), [hx2, hy2] = pth(p, f); hemacia(hx2, hy2, fw * .065, f < .5 ? light(E.art, .1) : E.veia); }
    }
    const lp = loops[1], rp = loops[2], top = F[0];
    lab(top.x + fw / 2 + 2, top.top + fw, A.x1 - 10, top.top + 8, NAR ? 'membrana placentária' : 'membrana placentária (parede da vilosidade)');
    lab(A.x0 + A.w * .1, A.y0 + A.h * .2, A.x0 + 8, A.y0 + 14, NAR ? 'sangue da mãe' : 'sangue da mãe, em volta');
    lab(lp[1][0], lp[1][1] + A.h * .25, A.x0 + 8, A.y1 - A.h * .3, NAR ? 'chega pobre em O₂' : 'chega pobre em O₂ (vem do feto)');
    lab(rp[5][0], rp[5][1] + A.h * .2, A.x1 - 8, A.y1 - A.h * .34, NAR ? 'sai rico em O₂' : 'sai rico em O₂ (vai para o feto)');
    lab(top.x, top.top + fw * .3, A.x1 - 10, A.y0 + A.h * .5 + (NAR ? 40 : 0), 'capilar do feto');
    return 'O sangue do <b>feto</b> corre <b>dentro</b> da vilosidade; o da <b>mãe</b> fica em volta. Uma membrana fina separa os dois: <b>eles nunca se misturam</b>';
  }
  // nível 3: a membrana placentária e as substâncias que passam (ou não)
  function nMembrana(A, t, S) {
    // pastilhas de escolha
    const chips = []; let cx = A.x0, cy = A.y0 + 2; const ch = 28, gap = 6;
    SUB.forEach((u, i) => { const s = NAR && u.nn ? u.nn : u.n, w = tw(s, 13, 600) + 22; if (cx + w > A.x1) { cx = A.x0; cy += ch + gap; } chips.push([cx, cy, w, ch, s]); cx += w + gap; });
    const tot = chips.reduce((m, c) => Math.max(m, c[0] + c[2]), 0) - A.x0, off = (A.w - tot) / 2;
    const cur = subAt(S), u = SUB[cur];
    chips.forEach((c, i) => { c[0] += off; const on = i === cur; rr(c[0], c[1], c[2], c[3], 999, on ? SUB[i].c : 'rgba(11,15,28,.84)', on ? '#fff' : 'rgba(255,255,255,.25)', on ? 2 : 1); tx(c[4], c[0] + c[2] / 2, c[1] + c[3] / 2 + .5, { s: 13, w: 600, c: on ? '#0B0F1C' : E.txt, bg: false }); });
    hot = { chips, S, at: performance.now() };
    const y0 = cy + ch + 12, y1 = A.y1 - 34, ym = (y0 + y1) / 2, mt = 24;
    rr(A.x0, y0, A.w, ym - mt / 2 - y0, 8, E.lago); rr(A.x0, ym + mt / 2, A.w, y1 - ym - mt / 2, 8, '#3A1430');
    rr(A.x0, ym - mt / 2, A.w, mt * .62, 3, rgba(E.corion, .9)); rr(A.x0, ym - mt / 2 + mt * .62, A.w, mt * .38, 3, rgba(C.memb, .8));
    tx('sangue da mãe', A.x0 + 10, y0 + 14, { a: 'left', s: 13, w: 600, c: E.txt });
    tx('sangue do feto', A.x0 + 10, y1 - 14, { a: 'left', s: 13, w: 600, c: E.txt });
    // hemácias de cada lado ficam sempre no seu lado
    const R = rng(3);
    for (let i = 0; i < (NAR ? 6 : 10); i++) { const x = A.x0 + 30 + R() * (A.w - 60), d = u.d === 0 ? 1 : 0; const bm = Math.abs(Math.sin(t * 1.6 + i)) * d; hemacia(x, lerp(y0 + 30 + R() * (ym - y0 - 60), ym - mt / 2 - 10, bm), 8, E.hemM); const x2 = A.x0 + 30 + R() * (A.w - 60); hemacia(x2, lerp(ym + mt / 2 + 30 + R() * (y1 - ym - 60), ym + mt / 2 + 10, Math.abs(Math.sin(t * 1.6 + i + 1)) * d), 6.5, E.sF); }
    if (u.d !== 0) {
      const n = NAR ? 4 : 7, s = NAR && u.nn ? u.nn : u.n;
      for (let i = 0; i < n; i++) {
        const f = fr(t * .2 + i / n), a = Math.sin(f * PI), x = A.x0 + A.w * (i + .5) / n + Math.sin(t + i) * 6, ya = u.d > 0 ? y0 + 22 : y1 - 22, yb2 = u.d > 0 ? y1 - 22 : y0 + 22;
        tok(x, lerp(ya, yb2, f), s, u.c, { a: Math.min(1, a * 1.6) });
      }
    }
    // veredito, no rodapé da cena
    const ok = u.d !== 0, msg = !ok ? 'não atravessa' : u.d > 0 ? 'atravessa: da mãe para o feto' : 'atravessa: do feto para a mãe';
    pill(A.cx, A.y1 - 12, (u.al ? 'alerta: ' : '') + msg, { c: u.al ? '#1A1206' : E.txt, bg: u.al ? E.alerta : 'rgba(11,15,28,.84)' });
    if (!NAR) { const ax = A.x1 - 24; if (ok) arrow(ax, u.d > 0 ? ym - 46 : ym + 46, ax, u.d > 0 ? ym + 46 : ym - 46, '#fff', 2.5); }
    lab(A.x0 + A.w * .72, ym, A.x0 + A.w * .72, ym - (NAR ? 70 : 60), NAR ? 'membrana placentária' : 'membrana placentária (trofoblasto + parede do capilar)');
    return u.t + (S.pick == null ? '. <span class="q">Toque numa substância para escolher</span>' : '');
  }
  // nível 4: corte do cordão umbilical
  function nCordao(A, t) {
    const rc = Math.min(NAR ? A.w * .3 : A.h * .36, NAR ? A.h * .2 : A.w * .2), cx = NAR ? A.cx : A.x0 + A.w * .26, cy = NAR ? A.y0 + rc + 34 : A.cy;
    circ(cx, cy, rc + 5, rgba(E.amnio, .5), E.amnio, 2); circ(cx, cy, rc, E.geleia);
    X.save(); X.beginPath(); X.arc(cx, cy, rc, 0, TAU); X.clip(); grains(cx - rc, cy - rc, rc * 2, rc * 2, '#C9B8DD', .25, 4); X.restore();
    circ(cx, cy, rc + 5, null, E.amnio, 2);
    const vr = rc * .3, ar = rc * .2;
    circ(cx + rc * .18, cy - rc * .32, vr, light(E.veia, .1), dark(E.veia, .3), 2.5);
    for (const [ox, oy] of [[-rc * .38, rc * .3], [rc * .36, rc * .36]]) { circ(cx + ox, cy + oy, ar + ar * .55, '#C8B2CF', dark(E.art, .35), 1.5); circ(cx + ox, cy + oy, ar, E.art, dark(E.art, .3), 1.5); }
    tx('corte do cordão', cx, cy - rc - 22, { s: 13, w: 600, c: E.dim });
    lab(cx + rc * .18 + vr * .7, cy - rc * .32 - vr * .6, cx + rc + 30, cy - rc * .9, NAR ? 'veia: rica em O₂' : 'veia umbilical (1)');
    lab(cx - rc * .38, cy + rc * .3 + ar, cx - rc - 10, cy + rc + 18, NAR ? 'artérias: pobres em O₂' : 'artérias umbilicais (2)');
    lab(cx - rc * .5, cy - rc * .4, cx - rc - 20, cy - rc * .8, 'geleia de Wharton');
    // esquema do sentido do sangue
    const bx0 = NAR ? A.x0 + 6 : A.x0 + A.w * .52, bx1 = A.x1 - 6, by = NAR ? cy + rc + 70 : A.cy - 40, bw = bx1 - bx0;
    const fX = bx0 + 34, pX = bx1 - 40;
    feto(fX, by + 34, NAR ? 64 : 84, 30, 0);
    ell(pX, by + 34, 26, 38, 0, E.placenta, E.corion, 2.5); tx('placenta', pX, by + 34 + 52, { s: 13, w: 600, c: E.txt });
    tx('feto', fX, by + 34 + 52, { s: 13, w: 600, c: E.txt });
    const ya = by + 14, yv = by + 56, xa = fX + 40, xb = pX - 32;
    arrow(xa, ya, xb, ya, E.art, 3); arrow(xb, yv, xa, yv, E.veia, 3);
    for (let i = 0; i < 4; i++) { const f = fr(t * .3 + i / 4); circ(lerp(xa, xb, f), ya, 3.5, light(E.art, .3)); circ(lerp(xb, xa, f), yv, 3.5, light(E.veia, .3)); }
    const mw = xb - xa, sz = NAR ? 12 : 13;
    const h1 = wrapE(NAR ? 'artérias: sangue pobre em O₂' : 'artérias: sangue pobre em O₂, do feto para a placenta', (xa + xb) / 2, ya - 18 - (nLin(NAR ? 'artérias: sangue pobre em O₂' : 'artérias: sangue pobre em O₂, do feto para a placenta', mw, sz, 600) - 1) * (sz + 4), mw, { s: sz, w: 600, c: light(E.art, .35) });
    void h1;
    wrapE(NAR ? 'veia: sangue rico em O₂' : 'veia: sangue rico em O₂, da placenta para o feto', (xa + xb) / 2, yv + 18, mw, { s: sz, w: 600, c: light(E.veia, .2) });
    const nota = 'Artéria é o vaso que leva o sangue para longe do coração. As umbilicais levam sangue pobre em O₂ do feto para a placenta';
    wrapE(nota, bx0 + bw / 2, by + 34 + 84, Math.min(bw, 360), { s: 12, c: E.dim });
    return 'Cordão umbilical: <b>2 artérias</b> levam sangue <b>pobre em O₂</b> do feto para a placenta; <b>1 veia</b> traz sangue <b>rico em O₂</b> para o feto';
  }

  def('humano', 'placenta', {
    t: 'Placenta e cordão umbilical', s: 'dois sangues que não se misturam', c: C.corion, loc: 'Útero, placenta e cordão', still: 5, stillV: 3,
    ctl: { l: 'Zoom', min: 0, max: 4, step: 1, v: 0, f: v => NIV[Math.round(v)], rate: () => 1 },
    extra: [{ t: 'Trocar substância', on: S => { S.pick = ((S.pick == null ? subAt(S) : S.pick) + 1) % SUB.length; setNivel(S, 3); } }],
    alt: 'Zoom em cinco níveis: o útero com o feto, o cordão e a placenta; o corte da placenta com a parte materna e a fetal; uma vilosidade com o capilar do feto dentro, cercada pelo sangue da mãe; a membrana placentária com as substâncias que passam ou não; e o corte do cordão, com duas artérias e uma veia',
    d: `<p>A <b>placenta</b> é o órgão de trocas entre a mãe e o feto, formada por <b>duas partes</b>: uma <b>fetal</b>, o <b>córion viloso</b> (as vilosidades coriônicas, ver <a href="#anexos/funcoes">funções dos anexos</a>), e uma <b>materna</b>, a <b>decídua basal</b>, a parte do endométrio onde o embrião se implantou (ver <a href="#humano/nidacao">nidação</a>). As vilosidades ficam mergulhadas em lagos de <b>sangue materno</b>, mas o sangue do feto corre <b>dentro</b> delas, separado do da mãe por uma membrana fina, a membrana placentária. <b>Os dois sangues não se misturam</b>: as substâncias passam por essa membrana. No fim da gestação a placenta é um disco de <b>15 a 25&nbsp;cm</b> de diâmetro, cerca de <b>3&nbsp;cm</b> de espessura e <b>500 a 600&nbsp;g</b> (Moore).</p>
<p>Pela placenta passam <b>oxigênio, glicose, aminoácidos, água, sais</b> e <b>anticorpos IgG</b> da mãe para o feto, e <b>gás carbônico e ureia</b> do feto para a mãe. Ela também é uma glândula: produz <b>hCG</b>, <b>progesterona</b> e <b>estrogênios</b>. Mas a barreira não é perfeita: <b>álcool, nicotina, muitos medicamentos, drogas</b> e alguns agentes de doença (os vírus da <b>rubéola</b>, do <b>Zika</b> e o <b>HIV</b>, o protozoário da <b>toxoplasmose</b> e a bactéria da <b>sífilis</b>) também atravessam.</p>
<p>O feto se liga à placenta pelo <b>cordão umbilical</b>, com cerca de <b>55&nbsp;cm</b> em média (de 30 a 90&nbsp;cm), que tem <b>duas artérias</b> e <b>uma veia</b>, envoltas numa geleia protetora (geleia de Wharton). Atenção ao sentido: as <b>artérias umbilicais levam sangue pobre em O₂</b> do feto para a placenta, e a <b>veia umbilical traz sangue rico em O₂</b> da placenta para o feto. No desenho, as artérias umbilicais aparecem azuladas por isso.</p>
<p>Mova a faixa para aumentar o zoom: útero, placenta, vilosidade, membrana e cordão. No nível "membrana", toque numa substância (ou no botão "Trocar substância") para ver se ela passa e em que sentido.</p>`,
    kv: [['Parte fetal', 'córion viloso (vilosidades coriônicas)'], ['Parte materna', 'decídua basal (endométrio)'], ['Placenta a termo', '15 a 25&nbsp;cm; cerca de 3&nbsp;cm; 500 a 600&nbsp;g'], ['Mãe → feto', 'O₂, glicose, aminoácidos, água, sais, IgG'], ['Feto → mãe', 'CO₂ e ureia'], ['Hormônios', 'hCG, progesterona, estrogênios'], ['Cordão', 'cerca de 55&nbsp;cm; 2 artérias e 1 veia']],
    enem: 'O ENEM gosta de três ideias: o sangue da mãe e o do feto <b>não se misturam</b> (as trocas são por difusão e transporte através da membrana placentária); a placenta <b>não barra tudo</b>, e por isso álcool, cigarro, medicamentos e infecções como <b>rubéola, Zika, toxoplasmose e sífilis</b> podem afetar o feto (relacione com o pré-natal e a vacinação); e a placenta tem uma parte <b>materna</b> e uma <b>fetal</b>.',
    links: [['Funções dos anexos', '#anexos/funcoes'], ['Nidação', '#humano/nidacao']],
    init(S) { hookCanvas(); },
    draw(t, S) {
      const A = area(), v = Math.round(S.v), a = trans(S, v, t);
      X.save(); X.globalAlpha = a;
      const c = [nUtero, nPlacenta, nVilo, nMembrana, nCordao][v](A, t, S);
      X.restore();
      if (v !== 3) hot = null;
      cap(c);
    }
  });

  // =====================================================================================
  // GÊMEOS
  // =====================================================================================
  const TIPO = d => d <= 3 ? 0 : d <= 8 ? 1 : d <= 12 ? 2 : 3;
  const MONO = [
    { n: '2 córions + 2 âmnios', f: 'cerca de 1/3 dos monozigóticos', e: 'separação de 2 células a mórula' },
    { n: '1 córion + 2 âmnios', f: 'cerca de 2/3: o caso mais comum', e: 'separação da massa celular interna' },
    { n: '1 córion + 1 âmnio', f: 'cerca de 1% dos casos', e: 'separação do disco embrionário' },
    { n: 'gêmeos unidos', f: 'separação incompleta (siameses)', e: 'disco embrionário se separa só em parte' }
  ];
  const ZA = '#F2C6A0', ZB = '#A8D8A0';
  function ovocito(x, y, r, c) { circ(x, y, r + r * .18, rgba('#E8EDF7', .14), rgba('#E8EDF7', .45), 1.2); cell(x, y, r, c, { n: .28 }); }
  function esperm(x, y, s, ang, t) {
    X.save(); X.translate(x, y); X.rotate(ang);
    X.beginPath(); for (let i = 0; i <= 12; i++) { const u = i / 12, xx = s * .5 + u * s * 2.2, yy = Math.sin(u * 7 - t * 9) * s * .22 * u; i ? X.lineTo(xx, yy) : X.moveTo(xx, yy); } X.strokeStyle = rgba(E.esperma, .9); X.lineWidth = 1.3; X.stroke();
    ell(0, 0, s * .55, s * .36, 0, E.esperma, 'rgba(11,15,28,.5)', 1); X.restore();
  }
  // um embrião pequeno dentro do âmnio, com cor de borda da "família genética"
  function embMini(x, y, r, c, flip) { X.save(); X.translate(x, y); if (flip) X.scale(-1, 1); embrC(0, 0, r * 1.5, 6); X.restore(); circ(x + (flip ? -1 : 1) * r * .62, y - r * .7, Math.max(2.5, r * .14), c, 'rgba(11,15,28,.6)', 1); }
  // anexos: 0 = 2 córions + 2 âmnios; 1 = 1 córion + 2 âmnios; 2 = 1 córion + 1 âmnio; 3 = unidos
  function anexos(x, y, r, tipo, cA, cB, labs) {
    const pl = (px, py, rr2, a0) => { X.beginPath(); X.arc(px, py, rr2, a0 - .7, a0 + .7); X.strokeStyle = E.placenta; X.lineWidth = Math.max(5, rr2 * .2); X.stroke(); };
    let out = {};
    if (tipo === 0) {
      const d = r * .52, rc = r * .5;
      for (const [s, c] of [[-1, cA], [1, cB]]) { const cx = x + s * d; circ(cx, y, rc, rgba(E.corion, .14), E.corion, 2.5); pl(cx, y, rc - 3, -PI / 2); circ(cx, y + rc * .1, rc * .7, rgba(E.amnio, .2), E.amnio, 2); embMini(cx, y + rc * .12, rc * .38, c, s > 0); }
      out = { cor: [x - d - rc * .7, y - rc * .7], amn: [x + d + rc * .5, y + rc * .4], pla: [x - d, y - rc + 2] };
    } else {
      circ(x, y, r, rgba(E.corion, .14), E.corion, 2.5); pl(x, y, r - 3, -PI / 2);
      if (tipo === 1) { for (const s of [-1, 1]) { circ(x + s * r * .4, y + r * .12, r * .36, rgba(E.amnio, .2), E.amnio, 2); embMini(x + s * r * .4, y + r * .14, r * .2, s < 0 ? cA : cB, s > 0); } out = { cor: [x - r * .7, y - r * .7], amn: [x + r * .7, y + r * .3], pla: [x, y - r + 3] }; }
      else { circ(x, y + r * .1, r * .74, rgba(E.amnio, .2), E.amnio, 2); if (tipo === 2) { embMini(x - r * .3, y + r * .14, r * .26, cA, false); embMini(x + r * .3, y + r * .14, r * .26, cB, true); } else { embMini(x - r * .14, y + r * .14, r * .28, cA, false); embMini(x + r * .14, y + r * .14, r * .28, cB, true); } out = { cor: [x - r * .7, y - r * .7], amn: [x + r * .65, y + r * .4], pla: [x, y - r + 3] }; }
    }
    if (labs) { lab(out.cor[0], out.cor[1], x - r - 40, y - r * .3, 'córion'); lab(out.amn[0], out.amn[1], x + r + 40, y + r * .6, 'âmnio'); if (!NAR) lab(out.pla[0], out.pla[1], x + r + 30, y - r * .45, 'placenta'); }
  }
  // estágio em que o embrião monozigótico se separa
  function estagio(x, y, r, d, sep) {
    const tp = TIPO(d), g = sep * r * .55;
    if (tp === 0) { if (d <= 1) { cell(x - g - r * .42, y, r * .45, ZA, { n: .3 }); cell(x + g + r * .42, y, r * .45, ZA, { n: .3 }); } else { const R = rng(2); for (const s of [-1, 1]) for (let i = 0; i < 6; i++) { const a = i / 6 * TAU, rr2 = r * .28; cell(x + s * (r * .45 + g) + Math.cos(a) * rr2 * .6, y + Math.sin(a) * rr2 * .6, rr2 * .55, ZA); } void R; } }
    else if (tp === 1) { blasto(x, y, r); X.save(); X.beginPath(); X.arc(x, y, r * .9, 0, TAU); X.clip(); for (const s of [-1, 1]) ell(x + s * (r * .22 + g * .3), y - r * .6, r * .22, r * .3, 0, ZA, 'rgba(11,15,28,.5)', 1); X.restore(); }
    else if (tp === 2) { circ(x, y, r, 'rgba(183,155,255,.12)', E.corion, 1.5); ell(x, y - r * .2, r * .62, r * .36, 0, rgba(E.amnio, .3), E.amnio, 1.5); for (const s of [-1, 1]) { rr(x + s * (r * .1 + g * .2) - (s < 0 ? r * .42 : 0), y + r * .08, r * .42, r * .1, 2, E.ecto); rr(x + s * (r * .1 + g * .2) - (s < 0 ? r * .42 : 0), y + r * .18, r * .42, r * .09, 2, E.endo); } ell(x, y + r * .55, r * .38, r * .25, 0, rgba(E.vitelo, .45), E.vitelo, 1.5); }
    else { X.save(); X.translate(x, y); for (const s of [-1, 1]) { X.save(); X.rotate(s * .32 * (.4 + sep * .6)); disco3(0, -r * .35, r * .55); X.restore(); } X.restore(); }
  }
  function caso(B, mono, d, t, pr) {
    const hz = B.hz, cA = mono ? ZA : ZA, cB = mono ? ZA : ZB;
    head(mono ? 'Monozigóticos ("idênticos")' : 'Dizigóticos (fraternos)', B.x + B.w / 2, B.y + 10, mono ? E.txt : E.txt);
    tx(mono ? '1 ovócito + 1 espermatozoide = 1 zigoto' : '2 ovócitos + 2 espermatozoides = 2 zigotos', B.x + B.w / 2, B.y + 30, { s: 12, c: E.dim, bg: false });
    const top = B.y + 46, bot = B.y + B.h, rOv = Math.min(B.w * (hz ? .055 : .08), 22);
    const fluxo = hz ? [[B.x + B.w * .12, top + (bot - top) * .38], [B.x + B.w * .36, top + (bot - top) * .38], [B.x + B.w * .7, top + (bot - top) * .4]] : [[B.x + B.w / 2, top + (bot - top) * .08], [B.x + B.w / 2, top + (bot - top) * .27], [B.x + B.w / 2, top + (bot - top) * .64]];
    const [g, z, an] = fluxo, f = ss(seg(pr, 0, .45));
    // gametas e fecundação
    const pos = mono ? [0] : [-1, 1], sp = hz ? rOv * 1.25 : rOv * 1.5;
    for (const s of pos) { const ox = hz ? 0 : s * sp, oy = hz ? s * sp : 0; ovocito(g[0] + ox, g[1] + oy, rOv, s > 0 ? ZB : ZA); esperm(g[0] + ox + lerp(rOv * 3.2, rOv * 1.1, f), g[1] + oy - lerp(rOv * 1.4, rOv * .5, f), rOv * .3, .45, t); }
    // seta para os zigotos
    const ar = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, m = Math.min(hz ? rOv * 2.2 : rOv * 2.1, L * .32); arrow(p[0] + ux * m, p[1] + uy * m, q[0] - ux * m, q[1] - uy * m, C.line, 1.6); };
    ar(g, z);
    if (mono) { estagio(z[0], z[1], rOv * 1.05, d, ss(seg(pr, .45, .8))); tx(hz ? `dia ${d}` : `dia ${d}: ${MONO[TIPO(d)].e}`, z[0], z[1] + rOv * 1.05 + 14, { s: 12, c: E.dim }); }
    else for (const s of [-1, 1]) cell(z[0] + (hz ? 0 : s * sp), z[1] + (hz ? s * sp : 0), rOv * .8, s > 0 ? ZB : ZA, { n: .3 });
    ar(z, an);
    const rA = hz ? Math.min(B.w * .14, (bot - top) * .3) : Math.min(B.w * .3, (bot - top) * .17);
    X.save(); X.globalAlpha *= ss(seg(pr, .6, 1)); anexos(an[0], an[1], rA, mono ? TIPO(d) : 0, cA, cB, mono); X.restore();
    const nm = mono ? MONO[TIPO(d)] : { n: '2 córions + 2 âmnios', f: 'cerca de 2/3 dos gêmeos' };
    tx(nm.n, an[0], an[1] + rA + 16, { s: 13, w: 700, c: E.txt }); tx(nm.f, an[0], an[1] + rA + 34, { s: 12, c: E.dim });
    if (!mono && !NAR) tx('(as placentas às vezes se fundem)', an[0], an[1] + rA + 50, { s: 12, c: E.dim });
    return an[1] + rA + 34;
  }
  function linhaDias(x0, x1, y, d) {
    const fx = v => x0 + v / 14 * (x1 - x0), cs = ['#6C5A9E', '#8A6FD0', '#5E7FC8', '#8C6A52'], segs = [[0, 3.5], [3.5, 8.5], [8.5, 12.5], [12.5, 14]];
    const nomes = NAR ? ['0 a 3', '4 a 8', '9 a 12', '13+'] : ['até o 3º dia', '4º ao 8º', '9º ao 12º', '13º em diante'];
    segs.forEach((s, i) => { rr(fx(s[0]) + 1, y - 10, fx(s[1]) - fx(s[0]) - 2, 20, 5, rgba(cs[i], TIPO(d) === i ? .95 : .4)); const w = fx(s[1]) - fx(s[0]); const nm = tw(nomes[i], 12, 600) < w - 4 ? nomes[i] : ['0 a 3', '4 a 8', '9 a 12', '13+'][i]; if (tw(nm, 12, 600) < w - 4) tx(nm, (fx(s[0]) + fx(s[1])) / 2, y + .5, { s: 12, w: 600, c: E.txt, bg: false }); });
    const mx = fx(cl(d + .5, .25, 13.75)); X.beginPath(); X.moveTo(mx, y - 12); X.lineTo(mx - 6, y - 20); X.lineTo(mx + 6, y - 20); X.closePath(); X.fillStyle = E.alerta; X.fill();
    tx('dia da separação (após a fecundação)', (x0 + x1) / 2, y + 22, { s: 12, c: E.dim, bg: false });
  }

  def('humano', 'gemeos', {
    t: 'Gêmeos', s: 'um zigoto que se divide ou dois zigotos', c: C.amnio, loc: 'Primeiras duas semanas após a fecundação', still: 6, stillV: 5, auto: .7,
    ctl: { l: 'Dia da separação', min: 1, max: 14, step: 1, v: 1, f: v => 'dia ' + Math.round(v), rate: () => 1 },
    alt: 'Duas colunas: gêmeos dizigóticos, de dois ovócitos e dois espermatozoides, cada um com córion e âmnio próprios; e gêmeos monozigóticos, de um zigoto que se divide, com anexos que mudam conforme o dia da separação: dois córions e dois âmnios, um córion e dois âmnios, um córion e um âmnio, ou gêmeos unidos',
    d: `<p>Os <b>gêmeos dizigóticos</b> (ou fraternos, "bivitelinos") surgem quando <b>dois ovócitos</b> são liberados no mesmo ciclo e cada um é fecundado por um espermatozoide diferente. São dois zigotos, e por isso os irmãos são tão parecidos quanto quaisquer irmãos: podem ter sexos e tipos sanguíneos diferentes. Cada um tem o seu <b>âmnio</b> e o seu <b>córion</b> (e às vezes as placentas se fundem, mas os córions continuam separados). São cerca de <b>2/3</b> dos gêmeos, e a frequência varia muito: aumenta com a idade da mãe, com a história na família materna e com tratamentos de fertilidade (Moore).</p>
<p>Os <b>gêmeos monozigóticos</b> ("idênticos", "univitelinos") vêm de <b>um só zigoto</b>, que se divide em dois embriões. Têm o mesmo material genético, o <b>mesmo sexo</b> e o mesmo tipo sanguíneo. A frequência é parecida no mundo todo, cerca de <b>3 a 4 por 1.000 nascimentos</b>. Os anexos que eles dividem dependem de <b>quando</b> o embrião se separa (Moore; Gilbert), contando os dias após a fecundação:</p>
<div class="tab"><table><thead><tr><th>Separação</th><th>Estágio</th><th>Anexos</th><th>Casos</th></tr></thead><tbody>
<tr><td>até o 3º dia</td><td>2 células a <a href="#desenvolvimento/morula">mórula</a></td><td>2 córions e 2 âmnios</td><td>cerca de 1/3</td></tr>
<tr><td>4º ao 8º dia</td><td>massa celular interna do <a href="#humano/nidacao">blastocisto</a></td><td>1 córion (e 1 placenta), 2 âmnios</td><td>cerca de 2/3</td></tr>
<tr><td>9º ao 12º dia (o âmnio já se formou)</td><td>disco embrionário</td><td>1 córion e 1 âmnio</td><td>cerca de 1%</td></tr>
<tr><td>após cerca de 13 dias</td><td>separação incompleta</td><td>gêmeos unidos (siameses)</td><td>raros</td></tr>
</tbody></table></div>
<p>Mova a faixa para escolher o dia em que o embrião monozigótico se separa. Córion em lilás, âmnio em azul-claro (ver <a href="#anexos/funcoes">anexos</a>).</p>`,
    kv: [['Dizigóticos', '2 ovócitos + 2 espermatozoides; cerca de 2/3 dos gêmeos'], ['Monozigóticos', '1 zigoto; cerca de 3 a 4 por 1.000 nascimentos'], ['Mesmo sexo', 'monozigóticos: sim; dizigóticos: pode não ser'], ['Material genético', 'monozigóticos: igual; dizigóticos: como irmãos']],
    enem: 'Monozigóticos vêm de <b>1 zigoto</b>: mesmo sexo, mesmo genótipo; diferenças entre eles vêm do <b>ambiente</b> (por isso são usados em estudos de "genética ou ambiente"). Dizigóticos vêm de <b>2 ovócitos e 2 espermatozoides</b>: são irmãos comuns nascidos juntos. Cuidado: "ter placenta separada" <b>não prova</b> que os gêmeos são dizigóticos, porque monozigóticos que se separam até o 3º dia também têm placentas e córions próprios.',
    links: [['Fecundação', '#humano/fecundacao'], ['Placenta', '#humano/placenta']],
    draw(t, S) {
      const A = area(), d = Math.round(S.v), pr = S.paused ? 1 : seg(t, 0, 3.2);
      let bD, bM;
      if (NAR) { const hh = (A.h - 74) / 2; bD = { x: A.x0, y: A.y0, w: A.w, h: hh, hz: true }; bM = { x: A.x0, y: A.y0 + hh + 4, w: A.w, h: hh, hz: true }; }
      else { const g = 28, w = (A.w - g) / 2; bD = { x: A.x0, y: A.y0, w, h: A.h - 96, hz: false }; bM = { x: A.x0 + w + g, y: A.y0, w, h: A.h - 96, hz: false }; line(A.cx, A.y0, A.cx, A.y1, 'rgba(91,108,153,.35)', 1); }
      caso(bD, false, d, t, pr); caso(bM, true, d, t, pr);
      // linha do tempo da separação, sob os monozigóticos
      const ly = NAR ? A.y1 - 48 : A.y1 - 70;
      linhaDias(bM.x + (NAR ? 0 : 10), bM.x + bM.w - (NAR ? 0 : 10), ly, d);
      // selos
      const sy = A.y1 - 10;
      if (NAR) { pill(A.x0, sy, 'dizigóticos: sexo pode diferir; genes como irmãos', { a: 'left', s: 12 }); }
      else {
        pill(bD.x + bD.w / 2, sy - 30, 'mesmo sexo: pode não ser', { s: 13 }); pill(bD.x + bD.w / 2, sy, 'material genético: como irmãos comuns', { s: 13 });
        pill(bM.x + bM.w / 2, sy, 'mesmo sexo: sim     material genético: igual', { s: 13, bd: rgba(E.alerta, .5) });
      }
      const tp = TIPO(d);
      cap(NAR ? `Monozigóticos: mesmo sexo e mesmo material genético. Separação no dia ${d}: <b>${MONO[tp].n}</b> (${MONO[tp].f})`
        : `Separação no <b>dia ${d}</b> após a fecundação: ${MONO[tp].e}. Resultado: <b>${MONO[tp].n}</b>, ${MONO[tp].f}`);
    }
  });

  // =====================================================================================
  // SEMANA A SEMANA
  // =====================================================================================
  const MARCO = {
    1: ['fecundação, segmentação, blastocisto e início da nidação', '0,1 mm'],
    2: ['nidação completa; disco embrionário com 2 folhetos; âmnio e vesícula vitelínica; hCG detectável no sangue', '0,2 mm'],
    3: ['gastrulação (3 folhetos), notocorda e placa neural; o tubo cardíaco se forma', '1,5 a 2,5 mm'],
    4: ['o coração bate (≈ 22º dia); o tubo neural fecha; brotos dos braços e das pernas', '4 a 6 mm'],
    5: ['encéfalo cresce rápido; mãos e pés em forma de "pá", depois dedos', '7 a 22 mm (semanas 5 a 7)'],
    6: ['encéfalo cresce rápido; mãos e pés em forma de "pá", depois dedos', '7 a 22 mm (semanas 5 a 7)'],
    7: ['encéfalo cresce rápido; mãos e pés em forma de "pá", depois dedos', '7 a 22 mm (semanas 5 a 7)'],
    8: ['fim do período embrionário; todos os órgãos principais formados; aparência humana', '≈ 30 mm'],
    12: ['início do 2º trimestre; sexo distinguível pela genitália externa', '≈ 87 mm; ≈ 45 g'],
    16: ['ossos visíveis no ultrassom; movimentos começam a ser sentidos (16 a 20 semanas)', '≈ 140 mm; ≈ 200 g'],
    20: ['pele coberta de vérnix e lanugem; ultrassom morfológico; limite de viabilidade, com UTI', '≈ 190 mm; ≈ 460 g'],
    24: ['surfactante começa a ser produzido; prematuros já têm boa chance de sobreviver com UTI', '≈ 230 mm; ≈ 820 g'],
    28: ['olhos abrem; pulmões já conseguem respirar com ajuda', '≈ 270 mm; ≈ 1.300 g'],
    32: ['acúmulo de gordura sob a pele', '≈ 300 mm; ≈ 2.100 g'],
    38: ['a termo: parto', '≈ 360 mm; ≈ 3.400 g']
  };
  const MW = Object.keys(MARCO).map(Number);
  const TAM = [[1, .1], [2, .2], [3, 2], [4, 5], [5, 7], [7, 22], [8, 30], [12, 87], [16, 140], [20, 190], [24, 230], [28, 270], [32, 300], [38, 360]];
  const MAS = [[12, 45], [16, 200], [20, 460], [24, 820], [28, 1300], [32, 2100], [38, 3400]];
  const interp = (T, w) => { if (w <= T[0][0]) return T[0][1]; for (let i = 1; i < T.length; i++) if (w <= T[i][0]) { const [a, va] = T[i - 1], [b, vb] = T[i]; return Math.exp(lerp(Math.log(va), Math.log(vb), (w - a) / (b - a))); } return T[T.length - 1][1]; };
  const arred = v => v < 10 ? nbr(v, v < 1 ? 1 : 0) : v < 100 ? nbr(Math.round(v)) : nbr(Math.round(v / 10) * 10);
  const tri = w => { const m = w + 2; return m <= 13 ? '1º trimestre' : m <= 27 ? '2º trimestre' : '3º trimestre'; };
  const OBJ = [
    { ate: 5, n: 'grão de arroz', mm: 6, d(x, y, k) { ell(x, y, 3 * k, 1.3 * k, .3, '#F4F1E6', 'rgba(11,15,28,.5)', 1); } },
    { ate: 9, n: 'uva', mm: 22, d(x, y, k) { ell(x, y, 9 * k, 11 * k, 0, '#7FB25A', 'rgba(11,15,28,.5)', 1); ell(x - 3 * k, y - 4 * k, 2.5 * k, 3.5 * k, 0, 'rgba(255,255,255,.25)'); } },
    { ate: 15, n: 'limão', mm: 60, d(x, y, k) { ell(x, y, 30 * k, 23 * k, 0, '#E8D84A', 'rgba(11,15,28,.5)', 1); ell(x - 31 * k, y, 3 * k, 3 * k, 0, '#E8D84A'); ell(x + 31 * k, y, 3 * k, 3 * k, 0, '#E8D84A'); } },
    { ate: 28, n: 'banana', mm: 190, d(x, y, k) { X.beginPath(); X.moveTo(x - 10 * k, y - 95 * k); X.quadraticCurveTo(x + 55 * k, y, x - 10 * k, y + 95 * k); X.quadraticCurveTo(x + 25 * k, y, x - 10 * k, y - 95 * k); X.fillStyle = '#F2D24B'; X.fill(); X.strokeStyle = 'rgba(11,15,28,.5)'; X.lineWidth = 1; X.stroke(); } },
    { ate: 99, n: 'melancia pequena', mm: 240, d(x, y, k) { circ(x, y, 120 * k, '#3E8E4A', 'rgba(11,15,28,.5)', 1); for (let i = -2; i <= 2; i++) { X.beginPath(); X.ellipse(x, y, Math.abs(i) * 26 * k + 4, 118 * k, 0, 0, TAU); X.strokeStyle = 'rgba(20,60,30,.6)'; X.lineWidth = 3; X.stroke(); } } }
  ];
  // barra das duas contagens: eixo em semanas pela DUM (0 a 40); a fecundação fica na semana 2 da DUM
  function barra(x0, x1, y, w) {
    const fx = m => x0 + m / 40 * (x1 - x0), sh = 18;
    // linha 1: trimestres (contados pela DUM)
    const T = [[0, 13, '1º trimestre', '1º tri.'], [13, 27, '2º trimestre', '2º tri.'], [27, 40, '3º trimestre', '3º tri.']];
    T.forEach(([a, b, n, m2], i) => { rr(fx(a) + 1, y, fx(b) - fx(a) - 2, sh, 4, ['#2B3557', '#323E66', '#2B3557'][i]); const s = tw(n, 12, 600) < fx(b) - fx(a) - 6 ? n : m2; tx(s, (fx(a) + fx(b)) / 2, y + sh / 2 + .5, { s: 12, w: 600, c: E.txt, bg: false }); });
    // linha 2: períodos
    const y2 = y + sh + 4;
    rr(fx(0) + 1, y2, fx(2) - fx(0) - 2, sh, 4, 'rgba(91,108,153,.25)');
    rr(fx(2) + 1, y2, fx(10) - fx(2) - 2, sh, 4, rgba(E.ecto, .5)); rr(fx(10) + 1, y2, fx(40) - fx(10) - 2, sh, 4, rgba(E.corion, .38));
    X.save(); X.beginPath(); X.rect(fx(4), y2, fx(10) - fx(4) - 1, sh); X.clip(); for (let xx = fx(4) - sh; xx < fx(10); xx += 7) line(xx, y2 + sh, xx + sh, y2, rgba(E.alerta, .9), 2.5); X.restore();
    rr(fx(4), y2, fx(10) - fx(4) - 1, sh, 3, null, E.alerta, 1.5);
    const emb = tw('período embrionário', 12, 600) < fx(10) - fx(2) - 6 ? 'período embrionário' : tw('embrionário', 12, 600) < fx(10) - fx(2) - 6 ? 'embrionário' : '';
    if (emb) tx(emb, (fx(2) + fx(10)) / 2, y2 + sh / 2 + .5, { s: 12, w: 600, c: E.txt });
    tx(NAR ? 'período fetal' : 'período fetal: crescimento e amadurecimento', (fx(10) + fx(40)) / 2, y2 + sh / 2 + .5, { s: 12, w: 600, c: E.txt, bg: false });
    for (const m of [22, 24]) line(fx(m), y - 3, fx(m), y2 + sh + 3, 'rgba(232,237,247,.8)', 1.5, [3, 3]);
    // semana atual: célula entre m-1 e m (pela DUM)
    const m = w + 2; rr(fx(m - 1) - 1, y - 4, fx(m) - fx(m - 1) + 2, sh * 2 + 12, 3, null, '#fff', 2);
    // rótulos por cima do quadro da semana atual
    if (emb) tx(emb, (fx(2) + fx(10)) / 2, y2 + sh / 2 + .5, { s: 12, w: 600, c: E.txt });
    T.forEach(([a, b, n, m2]) => { const s = tw(n, 12, 600) < fx(b) - fx(a) - 6 ? n : m2; tx(s, (fx(a) + fx(b)) / 2, y + sh / 2 + .5, { s: 12, w: 600, c: E.txt }); });
    X.beginPath(); X.moveTo(fx(m - .5), y - 6); X.lineTo(fx(m - .5) - 6, y - 14); X.lineTo(fx(m - .5) + 6, y - 14); X.closePath(); X.fillStyle = E.alerta; X.fill();
    // escalas
    const yT = y - 26, yB = y2 + sh + 16;
    const tf = NAR ? [0, 8, 20, 38] : [0, 4, 8, 12, 16, 20, 24, 28, 32, 38], td = NAR ? [0, 10, 22, 40] : [0, 10, 14, 22, 26, 30, 34, 40];
    tx('semanas após a fecundação', x0, yT - 16, { a: 'left', s: 12, w: 600, c: E.txt, bg: false });
    for (const f of tf) tx(String(f), fx(f + 2), yT, { s: 12, f: FD, c: E.dim, bg: false });
    for (const d of td) tx(String(d), fx(d), yB, { s: 12, f: FD, c: E.dim, bg: false });
    tx('semanas pela DUM (idade gestacional)', x0, yB + 16, { a: 'left', s: 12, w: 600, c: E.txt, bg: false });
    if (!NAR) tx('listras: maior sensibilidade a teratógenos (3ª a 8ª semana após a fecundação)    tracejado: viabilidade (22 a 24 pela DUM)', x1, yB + 16, { a: 'right', s: 12, c: E.dim, bg: false });
    return yB + 16;
  }

  def('humano', 'semanas', {
    t: 'Semana a semana', s: 'do zigoto ao recém-nascido', c: C.mae, loc: 'Linha do tempo da gestação', still: 2, stillV: 8, auto: 1.2,
    ctl: { l: 'Semana', min: 1, max: 38, step: 1, v: 1, f: v => semK(Math.round(v)), rate: () => 1 },
    alt: 'Linha do tempo de 38 semanas após a fecundação (40 pela DUM): o embrião e depois o feto crescem e mudam de forma, comparados com objetos do dia a dia; embaixo, uma barra com os trimestres, o período embrionário, o período fetal e a faixa de maior sensibilidade a teratógenos',
    d: `<p>Aqui toda semana aparece nas duas contagens: <b>desde a fecundação</b>, como nos livros de embriologia, e <b>pela DUM</b> (primeiro dia da última menstruação), como no pré-natal, cerca de 2 semanas a mais. Exemplo: ${semF(8)}.</p>
<p>O desenvolvimento humano tem dois períodos. O <b>período embrionário</b> vai da fecundação ao fim da <b>8ª semana</b>: nele se formam os folhetos (gastrulação na <b>3ª semana</b>, ver <a href="#desenvolvimento/gastrula">gástrula</a> e <a href="#desenvolvimento/folhetos">folhetos</a>), o tubo neural (fecha na <b>4ª semana</b>, ver <a href="#desenvolvimento/neurula">nêurula</a>) e todos os órgãos principais (organogênese). O coração começa a bater por volta do <b>22º dia</b>. No fim da 8ª semana, o embrião tem cerca de <b>3&nbsp;cm</b> e já tem aparência humana. Como tudo está se formando, é a fase de <b>maior sensibilidade</b> a agentes que causam malformações (os <b>teratógenos</b>: álcool, alguns medicamentos, radiação, rubéola e Zika; ver <a href="#desenvolvimento/organogenese">organogênese</a>), e muitas mulheres ainda nem sabem que estão grávidas.</p>
<p>A partir da <b>9ª semana</b>, o embrião passa a se chamar <b>feto</b>, e o <b>período fetal</b> é sobretudo de <b>crescimento</b> e amadurecimento dos órgãos já formados. Os órgãos genitais externos permitem ver o sexo no ultrassom por volta da 12ª a 14ª semana; a mãe sente os movimentos entre a <b>16ª e a 20ª semana</b>; os pulmões começam a produzir <b>surfactante</b> perto da 24ª semana, e é por isso que bebês nascidos antes de cerca de 22 a 24 semanas de gestação (pela DUM) raramente sobrevivem. O parto ocorre por volta de <b>38 semanas após a fecundação</b> (40 pela DUM), com cerca de <b>3,4&nbsp;kg</b> e 50&nbsp;cm. Os <b>trimestres</b> costumam ser contados pela DUM: 1º até a 13ª semana, 2º da 14ª à 27ª, 3º da 28ª até o parto.</p>
<div class="tab"><table><thead><tr><th>Semana após a fecundação (DUM)</th><th>Marco</th><th>Tamanho / massa</th></tr></thead><tbody>
<tr><td>1 (3)</td><td>fecundação, segmentação, blastocisto, início da nidação</td><td>0,1&nbsp;mm</td></tr>
<tr><td>2 (4)</td><td>nidação completa; disco embrionário com 2 folhetos; âmnio e vesícula vitelínica; hCG detectável no sangue</td><td>0,2&nbsp;mm</td></tr>
<tr><td>3 (5)</td><td>gastrulação (3 folhetos), notocorda, placa neural; tubo cardíaco se forma</td><td>1,5 a 2,5&nbsp;mm</td></tr>
<tr><td>4 (6)</td><td><b>coração bate (≈ 22º dia)</b>; tubo neural fecha; brotos dos braços e pernas</td><td>4 a 6&nbsp;mm</td></tr>
<tr><td>5 a 7 (7 a 9)</td><td>encéfalo cresce rápido; mãos e pés em forma de "pá", depois dedos</td><td>7 a 22&nbsp;mm</td></tr>
<tr><td>8 (10)</td><td>fim do período embrionário; todos os órgãos principais formados; aparência humana</td><td>≈ 30&nbsp;mm</td></tr>
<tr><td>12 (14)</td><td>início do 2º trimestre; sexo distinguível pela genitália externa</td><td>≈ 87&nbsp;mm; ≈ 45&nbsp;g</td></tr>
<tr><td>16 (18)</td><td>ossos visíveis no ultrassom; movimentos começam a ser sentidos (16 a 20 semanas)</td><td>≈ 140&nbsp;mm; ≈ 200&nbsp;g</td></tr>
<tr><td>20 (22)</td><td>pele coberta de vérnix e lanugem; ultrassom morfológico; limite de viabilidade, com UTI</td><td>≈ 190&nbsp;mm; ≈ 460&nbsp;g</td></tr>
<tr><td>24 (26)</td><td>surfactante começa a ser produzido; prematuros já têm boa chance de sobreviver com UTI</td><td>≈ 230&nbsp;mm; ≈ 820&nbsp;g</td></tr>
<tr><td>28 (30)</td><td>olhos abrem; pulmões já conseguem respirar com ajuda</td><td>≈ 270&nbsp;mm; ≈ 1.300&nbsp;g</td></tr>
<tr><td>32 (34)</td><td>acúmulo de gordura sob a pele</td><td>≈ 300&nbsp;mm; ≈ 2.100&nbsp;g</td></tr>
<tr><td>38 (40)</td><td>a termo: parto</td><td>≈ 360&nbsp;mm (CCN); ≈ 3.400&nbsp;g</td></tr>
</tbody></table></div>
<p>Os tamanhos a partir da 8ª semana são o <b>comprimento cabeça-nádega</b> (CCN, o feto sentado, que é o que o ultrassom mede no começo), não o comprimento total; o recém-nascido mede cerca de 50&nbsp;cm de comprimento total. Tamanhos e massas: Moore, cap. 6 e 7. O desenho é esquemático.</p>`,
    kv: [['Período embrionário', 'fecundação até o fim da 8ª semana (10ª pela DUM)'], ['Período fetal', 'da 9ª semana (11ª pela DUM) ao parto'], ['Coração bate', '≈ 22º dia após a fecundação'], ['Parto', '≈ 38 semanas após a fecundação (40 pela DUM)'], ['Recém-nascido', '≈ 3,4&nbsp;kg e 50&nbsp;cm']],
    enem: 'O que mais cai é o <b>período embrionário (até a 8ª semana)</b> como fase de <b>maior risco de malformações</b>: é nele que se formam os órgãos, e por isso álcool, cigarro, alguns medicamentos e infecções como <b>rubéola e Zika</b> (microcefalia) são mais perigosos no começo da gravidez. Lembre também que embrião vira <b>feto</b> a partir da 9ª semana e que o pré-natal conta a gestação pela <b>DUM</b> (40 semanas).',
    links: [['Organogênese', '#desenvolvimento/organogenese'], ['Placenta', '#humano/placenta']],
    draw(t, S) {
      const A = area(), w = cl(Math.round(S.v), 1, 38), mm = interp(TAM, w), mk = MARCO[w];
      // barra embaixo
      const by = A.y1 - (NAR ? 86 : 74);
      barra(A.x0 + 2, A.x1 - 2, by, w);
      // informações
      const ix = NAR ? A.x0 + 2 : A.x0 + A.w * .6, iy = A.y0 + 8;
      const tam = mk ? mk[1].split(';')[0] : '≈ ' + arred(mm) + ' mm';
      const mas = mk && mk[1].includes(';') ? mk[1].split(';')[1].trim() : w >= 12 ? '≈ ' + arred(interp(MAS, w)) + ' g' : w >= 9 ? 'menos de 45 g' : '';
      const ccn = w >= 8 ? 'comprimento cabeça-nádega' : w <= 2 ? 'diâmetro' : 'comprimento';
      let topBox;
      if (NAR) {
        tx(`Semana ${w} após a fecundação`, ix, iy + 6, { a: 'left', f: FH, s: 17, w: 700, c: E.txt });
        tx(`${w + 2}ª semana pela DUM   ${tri(w)}`, ix, iy + 28, { a: 'left', s: 13, w: 600, c: E.dim });
        tx(`${ccn}: ${tam}`, ix, iy + 48, { a: 'left', s: 12, f: FD, c: E.txt });
        if (mas) tx(`massa: ${mas}`, ix, iy + 66, { a: 'left', s: 12, f: FD, c: E.txt });
        topBox = iy + (mas ? 80 : 62);
      } else {
        tx(`Semana ${w}`, ix, iy + 14, { a: 'left', f: FH, s: 30, w: 700, c: E.txt });
        tx('após a fecundação', ix, iy + 40, { a: 'left', s: 14, w: 600, c: E.txt });
        tx(`${w + 2}ª semana de gestação, pela DUM`, ix, iy + 60, { a: 'left', s: 14, c: E.dim });
        tx(`${tri(w)}, ${w <= 8 ? 'período embrionário' : 'período fetal'}`, ix, iy + 84, { a: 'left', s: 14, w: 600, c: w <= 8 ? light(E.ecto, .35) : light(E.corion, .2) });
        tx(`${ccn}:`, ix, iy + 110, { a: 'left', s: 13, c: E.dim }); tx(tam, ix, iy + 128, { a: 'left', s: 15, f: FD, w: 500, c: E.txt });
        if (mas) { tx('massa:', ix, iy + 152, { a: 'left', s: 13, c: E.dim }); tx(mas, ix, iy + 170, { a: 'left', s: 15, f: FD, w: 500, c: E.txt }); }
        if (w >= 3 && w <= 8) pill(ix, iy + (mas ? 200 : 158), 'maior sensibilidade a teratógenos', { a: 'left', s: 13, c: '#1A1206', bg: E.alerta });
        if (w === 4) pill(ix, iy + 192, 'o coração bate (≈ 22º dia)', { a: 'left', s: 13 });
        topBox = A.y0;
      }
      // palco do embrião/feto
      const bx0 = A.x0 + (NAR ? 0 : 8), bx1 = NAR ? A.x1 : A.x0 + A.w * .56, byy0 = topBox + 8, byy1 = by - 66, bw = bx1 - bx0, bhh = byy1 - byy0;
      const ob = OBJ.find(o => w <= o.ate), maxL = Math.min(bw * .5, bhh * .82);
      const real = mm * PPM, k = real > maxL ? maxL / real : 1, L = Math.max(1.5, real * k), pxmm = PPM * k;
      const fx = bx0 + bw * .36, fy = (byy0 + byy1) / 2;
      const lupa = real < 30;
      if (lupa) {
        // tamanho real (minúsculo) e a lupa ao lado
        const lr = Math.min(bhh * .36, bw * .2), lx = bx0 + bw * .36, ly = fy, dotx = bx0 + bw * .1;
        figura(dotx, ly, Math.max(1.5, real), w, 0);
        line(dotx, ly, lx - lr * .7, ly - lr * .7, 'rgba(232,237,247,.5)', 1); line(dotx, ly, lx - lr * .7, ly + lr * .7, 'rgba(232,237,247,.5)', 1);
        circ(lx, ly, lr, 'rgba(19,26,43,.92)', 'rgba(232,237,247,.8)', 2.5);
        X.save(); X.beginPath(); X.arc(lx, ly, lr - 2, 0, TAU); X.clip(); figura(lx, ly, lr * 1.25, w, 0); X.restore();
        tx('tamanho real', dotx, ly + 18, { s: 12, c: E.dim });
        tx(`lupa: cerca de ${nbr(Math.round(lr * 1.25 / Math.max(real, 1.5)))} vezes maior`, lx, ly + lr + 14, { s: 12, c: E.dim });
      } else {
        figura(fx, fy, L, w, 0);
        const rT = k < 1 ? `desenho reduzido cerca de ${nbr(Math.round(1 / k))} vezes` : 'tamanho real aproximado na tela';
        if (NAR) tx(rT, A.x0, byy1 + 4, { a: 'left', s: 12, c: E.dim }); else tx(rT, fx, Math.min(byy1 + 4, fy + L * .55 + 16), { s: 12, c: E.dim });
      }
      // objeto para comparar, na mesma escala do desenho
      const ok2 = lupa ? PPM : pxmm; let ox = bx0 + bw * (lupa ? .8 : .82);
      const oy = fy;
      const hw = { 'grão de arroz': 4, uva: 10, 'limão': 35, banana: 46, 'melancia pequena': 121 }[ob.n] * ok2;
      ox = Math.min(ox, A.x1 - 4 - hw);
      ob.d(ox, oy, ok2);
      const oN = `para comparar: ${ob.n}`, oW = tw(oN, 12) / 2;
      if (NAR && !lupa) tx(oN, A.x1, byy1 - 14, { a: 'right', s: 12, c: E.dim });
      else tx(oN, cl(ox, A.x0 + oW, A.x1 - oW), Math.min(byy1 + 4, oy + Math.max(12, ob.mm * ok2 * .55) + 14), { s: 12, c: E.dim });
      // legenda: marco da semana
      const pd = w + 2;
      let m;
      if (mk) m = mk[0];
      else if (w <= 11) m = 'início do período fetal: o embrião passa a se chamar feto; agora é sobretudo crescimento e amadurecimento dos órgãos';
      else { const nx = MW.find(x => x > w); m = `período fetal: crescimento e amadurecimento dos órgãos. Próximo marco na semana ${nx} (${nx + 2}ª pela DUM)`; }
      if (NAR && !mk && w > 11) m = `crescimento e amadurecimento dos órgãos; próximo marco na semana ${MW.find(x => x > w)}`;
      const via = w >= 20 && w <= 22 ? (NAR ? '. Tracejado na barra: viabilidade (22 a 24 pela DUM)' : '. O tracejado na barra marca o limite de viabilidade, 22 a 24 semanas pela DUM') : '';
      cap(`<b>Semana ${w}${NAR ? '' : ' após a fecundação'} (${pd}ª pela DUM)</b>: ${m}${w >= 3 && w <= 8 ? '. <b>Maior sensibilidade a teratógenos</b> (listras na barra)' : ''}${via}`);
    }
  });
}
