/* LAB, módulo Embriologia. Cenas B: segmentação, mórula, blástula e gástrula.
   Texto: roteiro do Taxon (docs/revisao-biologia/embriologia-roteiro.md, D1 a D4). Código e desenhos da equipe (Apolo). */
'use strict';
{
  const EMB = '#E8A9A3';                 // tecido do embrião (o mesmo de cenas-a): massa celular interna
  const TROFO = C.corion;                // trofoblasto: forma o córion, então leva a cor do córion
  const SUP = '⁰¹²³⁴⁵';
  const pcol = c => { if (c[0] === '#') { const h = c.length === 4 ? c.replace(/#(.)(.)(.)/, '#$1$1$2$2$3$3') : c; return hx(h); } const m = c.match(/[\d.]+/g) || [0, 0, 0]; return [+m[0], +m[1], +m[2]]; };
  const mix = (a, b, t) => { const A = pcol(a), B = pcol(b); t = cl(t, 0, 1); return `rgb(${A[0] + (B[0] - A[0]) * t | 0},${A[1] + (B[1] - A[1]) * t | 0},${A[2] + (B[2] - A[2]) * t | 0})`; };
  const lightC = (c, k) => mix(c, '#FFFFFF', k), darkC = (c, k) => mix(c, '#000000', k);
  const STROKE = 'rgba(11,15,28,.62)';
  // passo de divisão "em degraus": a faixa anda contínua, mas cada divisão acontece num trecho e depois para
  const steps = (v, n) => { v = cl(v, 0, n); const k = Math.min(n - 1, Math.floor(v)), f = v - k; return v >= n ? n : k + ss(seg(f, .08, .78)); };
  const fillPoly = (P, f, s, lw) => { if (P.length < 3) return; X.beginPath(); P.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.closePath(); if (f) { X.fillStyle = f; X.fill(); } if (s) { X.strokeStyle = s; X.lineWidth = lw || 1; X.lineJoin = 'round'; X.stroke(); } };

  // =====================================================================================
  // MODELO 3D DA SEGMENTAÇÃO HOLOBLÁSTICA: cada blastômero se divide em dois, com o plano certo
  // 1ª e 2ª divisões meridionais, 3ª equatorial (deslocada para o polo animal no ovo heterolécito), 4ª meridional, 5ª latitudinal
  // =====================================================================================
  function relax(L, desig) {
    const n = L.length;
    for (let it = 0; it < 360; it++) {
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        const a = L[i], b = L[j]; let dx = b.p[0] - a.p[0], dy = b.p[1] - a.p[1], dz = b.p[2] - a.p[2], d = Math.hypot(dx, dy, dz);
        const tg = (a.r + b.r) * .92; if (d >= tg) continue;
        if (d < 1e-5) { dx = Math.sin(i * 7.1 + j); dy = Math.cos(i * 3.3 + j * 1.7) * .3; dz = Math.cos(i + j * 5.3); d = Math.hypot(dx, dy, dz); }
        const k = (tg - d) / d * .25, wa = b.r / (a.r + b.r), wb = a.r / (a.r + b.r);
        a.p[0] -= dx * k * wa * 2; a.p[1] -= dy * k * wa * 2; a.p[2] -= dz * k * wa * 2;
        b.p[0] += dx * k * wb * 2; b.p[1] += dy * k * wb * 2; b.p[2] += dz * k * wb * 2;
      }
      for (const c of L) {
        if (desig) c.p[1] += (c.veg ? .004 : -.004);
        c.p[0] *= .997; c.p[1] *= .997; c.p[2] *= .997;
        const m = Math.hypot(c.p[0], c.p[1], c.p[2]), lim = 1 - c.r;
        if (m > lim) { const s = lim / m; c.p[0] *= s; c.p[1] *= s; c.p[2] *= s; }
      }
    }
  }
  function clivagem(desig) {
    const st = [[{ p: [0, 0, 0], r: 1, par: -1, veg: 0 }]];
    for (let k = 0; k < 5; k++) {
      const nx = [];
      st[k].forEach((c, i) => {
        let ax; if (k === 0) ax = [1, 0, 0]; else if (k === 1) ax = [0, 0, 1]; else if (k === 2 || k === 4) ax = [0, 1, 0];
        else { const h = Math.hypot(c.p[0], c.p[2]); ax = h > 1e-3 ? [-c.p[2] / h, 0, c.p[0] / h] : [1, 0, 0]; }
        const fa = desig && k === 2 ? .28 : .5, sh = k === 0 ? .86 : 1, o = c.r * .45;
        nx.push({ p: [c.p[0] - ax[0] * o, c.p[1] - ax[1] * o, c.p[2] - ax[2] * o], r: c.r * Math.cbrt(fa) * sh, par: i, veg: k === 2 ? 0 : c.veg });
        nx.push({ p: [c.p[0] + ax[0] * o, c.p[1] + ax[1] * o, c.p[2] + ax[2] * o], r: c.r * Math.cbrt(1 - fa) * sh, par: i, veg: k === 2 ? 1 : c.veg });
      });
      relax(nx, desig); st.push(nx);
    }
    return st;
  }
  const CLV = { igual: clivagem(false), desig: clivagem(true) };
  // células num ponto p (0 a 5) da segmentação; no heterolécito o polo vegetativo se divide mais devagar
  function cellsAt(st, p, desig) {
    if (p >= 5) return st[5].map(c => ({ p: c.p.slice(), r: c.r, veg: c.veg }));
    const k = Math.floor(p), d = p - k, A = st[k], B = st[k + 1];
    return B.map(c => { const P = A[c.par], e = ss(desig && P.p[1] > .08 ? seg(d, .3, 1) : d); return { p: [lerp(P.p[0], c.p[0], e), lerp(P.p[1], c.p[1], e), lerp(P.p[2], c.p[2], e)], r: lerp(P.r, c.r, e), veg: c.veg }; });
  }
  function proj(p, yaw, pit) {
    const x1 = p[0] * Math.cos(yaw) + p[2] * Math.sin(yaw), z1 = -p[0] * Math.sin(yaw) + p[2] * Math.cos(yaw);
    return [x1, p[1] * Math.cos(pit) - z1 * Math.sin(pit), p[1] * Math.sin(pit) + z1 * Math.cos(pit)];
  }
  // cor do citoplasma conforme a altura: no heterolécito o vitelo se acumula embaixo (polo vegetativo)
  const corY = (y, desig) => desig ? mix(C.ovo, C.vitelo, ss((y + .15) / .8)) : C.ovo;
  function blasto(x, y, r, y0, y1, desig, o = {}) {
    const g = X.createLinearGradient(x, y - r, x, y + r); g.addColorStop(0, o.c || corY(y0, desig)); g.addColorStop(1, o.c || corY(y1, desig));
    circ(x, y, r, g, STROKE, 1.2);
    const h = X.createRadialGradient(x - r * .4, y - r * .45, r * .05, x - r * .2, y - r * .2, r * 1.05);
    h.addColorStop(0, 'rgba(255,255,255,.42)'); h.addColorStop(.5, 'rgba(255,255,255,.06)'); h.addColorStop(1, 'rgba(11,15,28,.22)');
    circ(x, y, r, h);
  }
  // envoltório (membrana de fecundação): o tamanho total não muda
  const envelope = (cx, cy, R) => circ(cx, cy, R * 1.05, 'rgba(201,207,220,.05)', 'rgba(201,207,220,.38)', 1.2);
  function drawHolo(cx, cy, R, p, desig, t) {
    const L = cellsAt(desig ? CLV.desig : CLV.igual, p, desig), yaw = .55 + Math.sin(t * .3) * .16, pit = -.38;
    envelope(cx, cy, R);
    const Q = L.map(c => { const q = proj(c.p, yaw, pit); return { x: cx + q[0] * R, y: cy + q[1] * R, z: q[2], r: c.r * R, yw: c.p[1], rw: c.r }; }).sort((a, b) => a.z - b.z);
    for (const c of Q) blasto(c.x, c.y, c.r, c.yw - c.rw, c.yw + c.rw, desig);
    return Q;
  }

  // meroblástica discoidal: só a cicatrícula (disco no polo animal) se divide; vista de cima e de lado
  const DISC_C = [[[0, 0]], [[.45, 0], [.45, PI]], [0, 1, 2, 3].map(i => [.5, PI / 4 + i * PI / 2]), [...Array(8)].map((_, i) => [.52, PI / 8 + i * PI / 4]),
    [...[...Array(8)].map((_, i) => [.25, PI / 8 + i * PI / 4]), ...[...Array(8)].map((_, i) => [.7, PI / 8 + i * PI / 4])],
    [...[...Array(16)].map((_, i) => [.26, PI / 16 + i * PI / 8]), ...[...Array(16)].map((_, i) => [.7, PI / 16 + i * PI / 8])]];
  function drawDisco(cx, cy, R, p) {
    const b = .5, sb = Math.sin(b), cb = Math.cos(b), rd = .56, h = Math.sqrt(1 - rd * rd);
    const g = X.createRadialGradient(cx - R * .3, cy - R * .2, R * .1, cx, cy, R * 1.02);
    g.addColorStop(0, lightC(C.vitelo, .25)); g.addColorStop(1, darkC(C.vitelo, .3));
    circ(cx, cy, R, g, STROKE, 1.5);
    X.save(); X.beginPath(); X.arc(cx, cy, R - 2, 0, TAU); X.clip(); grains(cx - R, cy - R * .5, R * 2, R * 1.5, darkC(C.vitelo, .35), .5, 11); X.restore();
    const ex = cx, ey = cy - h * cb * R, Rx = rd * R, Ry = rd * sb * R, mp = (u, w) => [ex + u * Rx, ey + w * Ry];
    ell(ex, ey + 4, Rx, Ry, 0, darkC(C.ovo, .3), STROKE, 1);
    const dg = X.createRadialGradient(ex - Rx * .3, ey - Ry * .5, 2, ex, ey, Rx); dg.addColorStop(0, lightC(C.ovo, .3)); dg.addColorStop(1, C.ovo);
    ell(ex, ey, Rx, Ry, 0, dg, STROKE, 1.2);
    // sulcos de clivagem: crescem do centro para a borda e não chegam até ela (o disco continua preso à gema)
    const furrow = (pts) => { X.beginPath(); pts.forEach((q, i) => { const m = mp(q[0], q[1]); i ? X.lineTo(m[0], m[1]) : X.moveTo(m[0], m[1]); }); X.strokeStyle = 'rgba(11,15,28,.72)'; X.lineWidth = 1.6; X.stroke(); };
    const diam = (a, f) => furrow([[-Math.cos(a) * .9 * f, -Math.sin(a) * .9 * f], [Math.cos(a) * .9 * f, Math.sin(a) * .9 * f]]);
    const dj = j => cl(p - (j - 1), 0, 1);
    if (dj(1) > 0) diam(PI / 2, ss(dj(1)));
    if (dj(2) > 0) diam(0, ss(dj(2)));
    if (dj(3) > 0) { diam(PI / 4, ss(dj(3))); diam(3 * PI / 4, ss(dj(3))); }
    if (dj(4) > 0) { const pts = []; const n = Math.max(2, Math.round(48 * ss(dj(4)))); for (let i = 0; i <= n; i++) { const a = -PI / 2 + i / 48 * TAU; pts.push([Math.cos(a) * .45, Math.sin(a) * .45]); } furrow(pts); }
    if (dj(5) > 0) for (let i = 0; i < 4; i++) diam(PI / 8 + i * PI / 4, ss(dj(5)));
    const k = Math.floor(p + .001);
    for (const [r, a] of DISC_C[Math.min(5, k)]) { const m = mp(Math.cos(a) * r, Math.sin(a) * r); ell(m[0], m[1], Math.max(1.6, R * .022), Math.max(1.2, R * .022 * sb * 1.6), 0, C.nucleo); }
    return { ex, ey, Rx, Ry };
  }

  // meroblástica superficial: núcleos se dividem no centro, migram para a borda e só então surgem as membranas
  const SUPC = (() => {
    const s = [[[0, 0]]];
    for (let k = 1; k <= 4; k++) { const o = .34 * Math.pow(.62, Math.floor((k - 1) / 2)), ax = k % 2 ? [o, 0] : [0, o * 1.1]; s.push(s[k - 1].flatMap(q => [[q[0] - ax[0], q[1] - ax[1]], [q[0] + ax[0], q[1] + ax[1]]])); }
    const ord = s[4].map((q, i) => [Math.atan2(q[1], q[0]), i]).sort((a, b) => a[0] - b[0]), slot = [];
    ord.forEach(([, i], j) => { slot[i] = -PI + (j + .5) * TAU / 16; });
    return { s, slot };
  })();
  function drawSuperf(cx, cy, R, p, lbl) {
    const rx = R * 1.12, ry = R * .66, k = Math.floor(p), d = p - k;
    const per = lerp(.9, .78, ss(seg(p, 3.5, 4.3))), memb = ss(seg(p, 4.45, 5)), mig = ss(seg(p, 3.35, 4));
    ell(cx, cy, rx * 1.04, ry * 1.06, 0, 'rgba(201,207,220,.05)', 'rgba(201,207,220,.38)', 1.2);
    ell(cx, cy, rx, ry, 0, C.ovo, STROKE, 1.5);
    const g = X.createRadialGradient(cx - rx * .2, cy - ry * .3, 4, cx, cy, rx);
    g.addColorStop(0, lightC(C.vitelo, .2)); g.addColorStop(1, darkC(C.vitelo, .2));
    ell(cx, cy, rx * per, ry * per, 0, g);
    X.save(); X.beginPath(); X.ellipse(cx, cy, rx * per - 1, ry * per - 1, 0, 0, TAU); X.clip(); grains(cx - rx, cy - ry, rx * 2, ry * 2, darkC(C.vitelo, .35), .5, 5); X.restore();
    const E = (u, v) => [cx + u * rx, cy + v * ry], halo = Math.max(4, R * .085);
    let N = [];
    if (p < 3) { const A = SUPC.s[k], B = SUPC.s[k + 1], e = ss(seg(d, .1, .75)); N = B.map((q, i) => { const P = A[i >> 1]; return [lerp(P[0], q[0], e), lerp(P[1], q[1], e)]; }); if (d < .1) N = A.slice(); }
    else if (p < 4 && d < .01) N = SUPC.s[3].slice();
    else if (p < 4) { const A = SUPC.s[3], B = SUPC.s[4], e = ss(seg(d, .0, .35)); N = B.map((q, i) => { const P = A[i >> 1], c = [lerp(P[0], q[0], e), lerp(P[1], q[1], e)], a = SUPC.slot[i], pr = (per + 1) / 2 * .97; return [lerp(c[0], Math.cos(a) * pr, mig), lerp(c[1], Math.sin(a) * pr, mig)]; }); }
    else { const e = p >= 5 ? 1 : ss(seg(d, 0, .35)), pr = (per + 1) / 2 * .97; N = []; for (let i = 0; i < 16; i++) { const a = -PI + (i + .5) * TAU / 16; for (const sg of [-1, 1]) { const b = a + sg * e * PI / 32; N.push([Math.cos(b) * pr, Math.sin(b) * pr]); } } }
    // periferia: vira uma camada de células (blastoderme) quando as membranas aparecem
    if (memb > 0) {
      for (let j = 0; j < 32; j++) {
        const a = -PI + j * TAU / 32, f = memb; const o = E(Math.cos(a), Math.sin(a)), i = E(Math.cos(a) * lerp(1, per, f), Math.sin(a) * lerp(1, per, f));
        line(o[0], o[1], i[0], i[1], 'rgba(11,15,28,.7)', 1.4);
      }
      X.save(); X.globalAlpha = memb; ell(cx, cy, rx * per, ry * per, 0, null, 'rgba(11,15,28,.7)', 1.4); X.restore();
    }
    for (const q of N) { const m = E(q[0], q[1]); if (p < 3.6) circ(m[0], m[1], halo, rgba('#C9CFDC', .9), STROKE, 1); circ(m[0], m[1], Math.max(2.2, halo * .45), C.nucleo, 'rgba(11,15,28,.5)', 1); }
    if (lbl) {
      lab(cx + rx * .25, cy + ry * .25, cx + rx * .7, cy + ry + 30, 'vitelo no centro');
      if (memb > .5) lab(cx - rx * .9, cy - ry * .3, cx - rx - 20, cy - ry - 22, 'camada de células');
      else lab(...E(N[0][0], N[0][1]), cx - rx - 20, cy - ry - 22, p < 3.4 ? 'núcleos (sem membranas)' : 'núcleos migrando');
    }
    return { n: N.length, cel: memb > .5 };
  }

  const TIPOS = [
    { n: 'Holoblástica igual', o: 'oligolécito', ex: 'ouriço-do-mar, anfioxo, mamíferos' },
    { n: 'Holoblástica desigual', o: 'heterolécito', ex: 'anfíbios (rã, sapo)' },
    { n: 'Meroblástica discoidal', o: 'telolécito', ex: 'aves, répteis, maioria dos peixes' },
    { n: 'Meroblástica superficial', o: 'centrolécito', ex: 'insetos e outros artrópodes' }
  ];
  function drawTipo(i, cx, cy, R, p, t, lbl) {
    if (i === 0 || i === 1) return { Q: drawHolo(cx, cy, R, p, i === 1, t) };
    if (i === 2) return { D: drawDisco(cx, cy, R, p) };
    return { S: drawSuperf(cx, cy, R, p, lbl) };
  }

  // =====================================================================================
  // D1 SEGMENTAÇÃO
  // =====================================================================================
  def('desenvolvimento', 'segmentacao', {
    t: 'Segmentação', s: 'holoblástica e meroblástica', c: C.ovo, loc: 'Zigoto, logo após a fecundação', still: 2, stillV: 4,
    ctl: { l: 'Divisões', min: 0, max: 5, step: 1, v: 0, f: v => { const n = Math.round(v); return `${n} (${2 ** n} ${n ? 'células' : 'célula'})`; }, rate: () => 1 },
    auto: .42,
    init(S) { if (S.tipo == null) S.tipo = 0; },
    extra: TIPOS.map((T, i) => ({ t: `Ovo ${T.o}`, on: S => { S.tipo = i; }, pressed: S => (S.tipo || 0) === i })),
    alt: 'Ovo em segmentação passando de 1 para 2, 4, 8, 16 e 32 células sem mudar de tamanho; botões escolhem o tipo de ovo: oligolécito (holoblástica igual), heterolécito (holoblástica desigual, células pequenas em cima e grandes embaixo), telolécito (meroblástica discoidal, só o disco do topo se divide) e centrolécito (meroblástica superficial, núcleos se dividem no centro e migram para a borda)',
    d: `<p>Depois da fecundação, o zigoto passa por uma série de mitoses rápidas, a <b>segmentação</b> (ou clivagem). As células formadas, os <b>blastômeros</b>, ficam cada vez menores, porque quase não há crescimento entre uma divisão e outra: o embrião continua do tamanho do ovo. O vitelo atrapalha a divisão. Por isso, o <a href="#ovos/tipos">tipo de ovo</a> decide o tipo de segmentação. Na <b>holoblástica</b> (total), o ovo inteiro se divide. Ela é <b>igual</b> no oligolécito, com blastômeros do mesmo tamanho (nos mamíferos, quase igual e lenta), e <b>desigual</b> no heterolécito: no polo animal ficam células pequenas (<b>micrômeros</b>) e no polo vegetativo, cheio de vitelo, células grandes (<b>macrômeros</b>).</p>
<p>Na <b>meroblástica</b> (parcial), só a parte sem vitelo se divide. No telolécito ela é <b>discoidal</b>: só o disco da cicatrícula se divide, formando um disco de células sobre a gema. No centrolécito ela é <b>superficial</b>: o núcleo se divide várias vezes no centro, os núcleos migram para a periferia e só então as membranas separam as células, numa camada em volta do vitelo.</p>
<p>Use os botões para escolher o tipo de ovo e a faixa para avançar as divisões. Nos painéis menores, os quatro tipos andam juntos para comparar.</p>
<div class="tab"><table>
<thead><tr><th>Ovo</th><th>Segmentação</th><th>Exemplos</th></tr></thead>
<tbody>
<tr><th>Oligolécito (isolécito)</th><td>holoblástica igual</td><td>ouriço-do-mar, anfioxo, mamíferos placentários</td></tr>
<tr><th>Heterolécito</th><td>holoblástica desigual</td><td>anfíbios (sapo, rã)</td></tr>
<tr><th>Telolécito</th><td>meroblástica discoidal</td><td>aves, répteis, maioria dos peixes, cefalópodes, monotremados</td></tr>
<tr><th>Centrolécito</th><td>meroblástica superficial</td><td>insetos e outros artrópodes</td></tr>
</tbody></table></div>`,
    enem: 'Segmentação são <b>mitoses</b>: todas as células têm o mesmo número de cromossomos do zigoto. O embrião aumenta o número de células, mas <b>não cresce</b>. A pegadinha está no tipo de ovo: ovo de ave <b>não</b> se divide inteiro (meroblástica discoidal); ovo de anfíbio se divide inteiro, mas de forma desigual.',
    links: [['Tipos de ovo', '#ovos/tipos'], ['Mórula', '#desenvolvimento/morula']],
    draw(t, S) {
      const A = area(), p = steps(S.v, 5), ti = S.tipo || 0, T = TIPOS[ti], side = !NAR && A.w > 760;
      const bw = side ? A.w * .64 : A.w, bcx = A.x0 + bw / 2;
      const R = Math.min(bw * (ti === 3 ? .3 : .34), (A.h - (NAR ? 96 : 104)) / (ti === 3 ? 1.6 : 2.2));
      const cy = A.y0 + (NAR ? 46 : 52) + (A.h - (NAR ? 96 : 104)) / 2;
      head(T.n, bcx, A.y0 + 8); tx(`ovo ${T.o}: ${T.ex}`, bcx, A.y0 + (NAR ? 27 : 30), { s: 12, c: C.dim, bg: false });
      const r = drawTipo(ti, bcx, cy, R, p, t, true), top = cy - R * (ti === 3 ? .7 : 1.05), bot = cy + R * (ti === 3 ? .72 : 1.07);
      if (ti < 3) { const px = NAR ? A.x1 : bcx + R * 1.12, al = NAR ? 'right' : 'left'; tx('polo animal', px, top + (NAR ? -6 : 6), { s: 12, c: C.dim, a: al }); tx('polo vegetativo', px, bot - 6, { s: 12, c: C.dim, a: al }); }
      const n = Math.floor(p + .5);
      const cnt = ti === 3 && !r.S.cel ? `núcleos: ${r.S.n}` : `células: 2${SUP[n]} = ${2 ** n}`;
      tx(cnt, bcx, bot + 20, { s: 14, f: FD, w: 500, c: C.txt });
      tx('o tamanho total não muda', bcx, bot + 40, { s: 12, c: C.dim, bg: false });
      // rótulos de estrutura
      if (ti === 1 && p >= 3) { const Q = r.Q, up = Q.reduce((a, b) => b.y < a.y ? b : a), dn = Q.reduce((a, b) => b.y > a.y ? b : a); lab(up.x, up.y, bcx - R * 1.25, up.y - 6, 'micrômeros'); lab(dn.x, dn.y, bcx - R * 1.25, dn.y + 6, 'macrômeros'); }
      else if (ti === 0 && p >= 1) { const c = r.Q[r.Q.length - 1]; lab(c.x, c.y, bcx - R * 1.3, cy - R * .6, 'blastômeros'); }
      else if (ti === 2) { lab(r.D.ex - r.D.Rx * .5, r.D.ey, bcx - R * 1.2, r.D.ey - 18, NAR ? 'cicatrícula' : 'cicatrícula: só ela se divide'); lab(bcx - R * .3, cy + R * .45, bcx - R * 1.2, cy + R * .7, NAR ? 'gema' : 'gema: não se divide'); }
      // painéis de comparação
      if (side) {
        const x0 = A.x0 + bw + 12, cw = A.x1 - x0, ph = A.h / 4;
        line(x0 - 6, A.y0 + 4, x0 - 6, A.y1 - 4, 'rgba(91,108,153,.3)', 1);
        TIPOS.forEach((U, i) => {
          const y = A.y0 + ph * (i + .5), rr0 = Math.min(ph * (i === 3 ? .36 : .34), cw * .16), mx = x0 + rr0 * 1.35 + 6;
          if (i === ti) rr(x0, y - ph / 2 + 3, cw, ph - 6, 10, 'rgba(255,179,71,.07)', 'rgba(255,179,71,.5)', 1);
          drawTipo(i, mx, y + (i === 2 ? rr0 * .1 : 0), rr0, p, t, false);
          const lx = mx + rr0 * 1.35 + 10, lw = A.x1 - lx - 6;
          wrapTx(U.n, lx, y - 10, lw, { s: 13, w: 600, c: C.txt, a: 'left', lh: 16 });
          tx(U.o, lx, y + (tw(U.n, 13, 600) > lw ? 24 : 10), { s: 12, c: C.dim, a: 'left', bg: false });
        });
      }
      const k = Math.floor(p + .001), un = ti === 3 && p < 4.45 ? 'núcleos' : 'blastômeros', fase = p >= 5 ? 'Fim desta sequência: 32 blastômeros' : p > k + .02 ? `Divisão ${k + 1} em andamento` : k ? `${2 ** k} ${un}` : 'Zigoto, antes da primeira divisão';
      const nota = ['os blastômeros têm o mesmo tamanho', 'o vitelo embaixo deixa as células de baixo maiores e mais lentas para se dividir', 'só o disco do topo se divide; a gema fica inteira (disco ampliado no desenho)', p < 3.4 ? 'os núcleos se dividem no centro, ainda sem membranas' : p < 4.45 ? 'os núcleos migram para a borda' : 'as membranas separam as células em volta do vitelo (no inseto real, os núcleos se dividem muito mais vezes antes disso)'][ti];
      cap(`${fase}: ${nota}`);
    }
  });

  // =====================================================================================
  // D2 MÓRULA: vista externa e em corte, com compactação no fim
  // =====================================================================================
  function clipHalf(P, nx, ny, c) {
    const out = [], n = P.length;
    for (let i = 0; i < n; i++) { const A = P[i], B = P[(i + 1) % n], da = A[0] * nx + A[1] * ny - c, db = B[0] * nx + B[1] * ny - c; if (da <= 0) out.push(A); if ((da < 0) !== (db < 0)) { const f = da / (da - db); out.push([A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f]); } }
    return out;
  }
  // célula achatada pelas vizinhas: círculo cortado pelo plano de contato com cada vizinha
  function squash(L, i, sc, dz) {
    const a = L[i], ra = a.r * sc, P = [];
    for (let k = 0; k < 28; k++) { const an = k / 28 * TAU; P.push([a.x + Math.cos(an) * ra, a.y + Math.sin(an) * ra]); }
    let Q = P;
    for (let j = 0; j < L.length; j++) {
      if (j === i) continue; const b = L[j], rb = b.r * sc, dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
      if (d < 1e-6 || d > ra + rb || (dz && Math.abs(a.z - b.z) > (a.r + b.r) * dz)) continue;
      const m = (d * d + ra * ra - rb * rb) / (2 * d), nx = dx / d, ny = dy / d;
      Q = clipHalf(Q, nx, ny, a.x * nx + a.y * ny + m); if (Q.length < 3) break;
    }
    return Q;
  }
  const DIA = ['dia 1: zigoto', 'dia 1 a 2', 'dia 2', 'dia 2 a 3', 'dia 3: mórula', 'dia 3', 'dia 3 a 4'];
  def('desenvolvimento', 'morula', {
    t: 'Mórula', s: 'uma bolinha maciça de células', c: C.ovo, loc: 'No ser humano: tuba uterina, por volta do 3º dia', still: 2, stillV: 6,
    ctl: { l: 'Divisões', min: 0, max: 6, step: 1, v: 0, f: v => { const n = Math.round(v); return n === 6 ? 'compactação' : `${n} (${2 ** n} ${n ? 'células' : 'célula'})`; }, rate: () => 1 },
    auto: .45,
    alt: 'Zigoto se dividindo em 2, 4, 8, 16 e 32 células, em vista externa e em corte; o corte mostra que a mórula é maciça, sem cavidade; na compactação as células se achatam e as de fora e as de dentro ganham tons diferentes',
    d: `<p>Com cerca de <b>12 a 32 células</b> (Moore), o embrião é uma bolinha maciça, parecida com uma amora, e por isso se chama <b>mórula</b> (do latim <i>morum</i>, amora). Ainda não há cavidade dentro dela. Até essa fase, os blastômeros dos mamíferos e de muitos outros animais são equivalentes: se um embrião bem jovem se separa em dois, cada metade pode formar um indivíduo completo. Cerca de 1/3 dos gêmeos univitelinos (monozigóticos) surge assim; os outros 2/3, em geral, da divisão da massa celular interna do blastocisto, um pouco depois (ver <a href="#humano/gemeos">gêmeos</a>). No ser humano, a mórula se forma por volta do <b>3º dia</b> depois da fecundação, ainda dentro da tuba uterina, e chega ao útero entre o 3º e o 4º dia.</p>
<p>Na mórula dos mamíferos, as células se apertam umas contra as outras (<b>compactação</b>) e começam a se separar em dois grupos: as de fora darão o <b>trofoblasto</b>, e as de dentro, a <b>massa celular interna</b>. É o primeiro passo de diferenciação do embrião.</p>
<p>Os dias da tela contam <b>desde a fecundação</b>, como no Moore (pela data da última menstruação, some cerca de 2 semanas).</p>`,
    kv: [['Mórula', 'cerca de 12 a 32 células, maciça (sem cavidade)'], ['No ser humano', 'por volta do 3º dia após a fecundação, na tuba uterina'], ['Chega ao útero', 'entre o 3º e o 4º dia'], ['Compactação', 'células de fora: trofoblasto; de dentro: massa celular interna']],
    enem: 'Mórula é <b>maciça</b>: ainda não tem cavidade. A sequência que a prova cobra é <b>zigoto → mórula → blástula → gástrula → nêurula</b>. Como as células da mórula ainda podem formar qualquer parte do embrião, a separação nessa fase, ou um pouco depois, na massa celular interna do blastocisto (o caso mais comum), origina <b>gêmeos univitelinos</b> (monozigóticos).',
    links: [['Gêmeos', '#humano/gemeos'], ['Blástula', '#desenvolvimento/blastula']],
    draw(t, S) {
      const A = area(), v = cl(S.v, 0, 6), p = steps(Math.min(v, 5), 5), cp = ss(seg(v, 5.05, 5.9));
      const stack = NAR || A.w < 620, R = stack ? Math.min(A.w * .3, (A.h - 120) / 4.6) : Math.min(A.w * .2, (A.h - 90) / 2.5);
      const c1 = stack ? [A.cx, A.y0 + 30 + R * 1.1] : [A.x0 + A.w * .28, A.cy + 4], c2 = stack ? [A.cx, A.y0 + 30 + R * 3.55] : [A.x0 + A.w * .72, A.cy + 4];
      head('vista externa', c1[0], c1[1] - R * 1.05 - 18); head('corte (pelo meio)', c2[0], c2[1] - R * 1.05 - 18);
      const L = cellsAt(CLV.igual, p, false), yaw = .55 + Math.sin(t * .3) * .16, pit = -.38;
      const Q = L.map(c => { const q = proj(c.p, yaw, pit), out = Math.hypot(...c.p) + c.r > .88; return { x: q[0], y: q[1], z: q[2], r: c.r, out }; }).sort((a, b) => a.z - b.z);
      const tone = c => cp > 0 ? mix(C.ovo, c.out ? TROFO : EMB, cp) : C.ovo;
      // vista externa
      envelope(c1[0], c1[1], R);
      if (cp <= 0) for (const c of Q) blasto(c1[0] + c.x * R, c1[1] + c.y * R, c.r * R, c.y - c.r, c.y + c.r, false);
      else {
        // compactação: as esferas se achatam umas contra as outras; o contorno fica liso e os limites quase somem
        const L2 = Q.filter(c => c.z > -.05).map(c => ({ x: c1[0] + c.x * R, y: c1[1] + c.y * R, r: c.r * R })), col = mix(C.ovo, TROFO, cp), sc = 1.5;
        X.save(); X.beginPath(); X.arc(c1[0], c1[1], R * .985, 0, TAU); X.clip();
        circ(c1[0], c1[1], R, col);
        L2.forEach((c, i) => fillPoly(squash(L2, i, sc, 0), col, `rgba(11,15,28,${lerp(.5, .3, cp)})`, 1));
        const sh = X.createRadialGradient(c1[0] - R * .35, c1[1] - R * .4, R * .1, c1[0], c1[1], R); sh.addColorStop(0, 'rgba(255,255,255,.22)'); sh.addColorStop(.6, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(11,15,28,.32)'); circ(c1[0], c1[1], R, sh);
        X.globalAlpha = 1 - cp; for (const c of Q) blasto(c1[0] + c.x * R, c1[1] + c.y * R, c.r * R, c.y - c.r, c.y + c.r, false);
        X.globalAlpha = 1;
        X.restore(); circ(c1[0], c1[1], R * .985, null, STROKE, 1.4);
      }
      // corte: só as células cortadas pelo plano do meio, com o núcleo
      envelope(c2[0], c2[1], R);
      const cut = Q.filter(c => Math.abs(c.z) < c.r * .97).map(c => { const r = Math.sqrt(c.r * c.r - c.z * c.z) * 1.12; return { x: c2[0] + c.x * R, y: c2[1] + c.y * R, z: 0, r: r * R, out: Math.hypot(c.x, c.y) > .45 }; });
      X.save(); X.beginPath(); X.arc(c2[0], c2[1], R, 0, TAU); X.clip();
      // tecido contínuo atrás das células: a mórula é maciça, o centro do corte nunca fica vazio
      if (p > .5) circ(c2[0], c2[1], R * .42, C.ovo);
      cut.forEach((c, i) => { const P = squash(cut, i, 1.25 + .3 * cp, 0); fillPoly(P, tone(c), STROKE, 1.2); circ(c.x, c.y, Math.max(2, c.r * .26), C.nucleo, 'rgba(11,15,28,.5)', 1); });
      X.restore();
      const n = Math.floor(p + .5), by = stack ? c2[1] + R * 1.12 + 16 : c1[1] + R * 1.1 + 24;
      tx(`células: ${2 ** n}`, stack ? A.cx - 70 : c1[0], by, { s: 14, f: FD, w: 500, c: C.txt });
      tx(`ser humano: ${DIA[cp > .5 ? 6 : n]}`, stack ? A.cx + 60 : c2[0], by, { s: 12, c: C.dim, bg: false });
      if (!stack) tx('idade contada desde a fecundação', c2[0], by + 18, { s: 12, c: C.dim, bg: false });
      if (p >= 4 && cut.length) {
        if (cp > .5) { const dc = c => Math.hypot(c.x - c2[0], c.y - c2[1]), o = cut.filter(c => c.out).sort((a, b) => dc(b) - dc(a))[0] || cut[0], ii = cut.slice().sort((a, b) => dc(a) - dc(b))[0]; lab(o.x, o.y, c2[0] + R * 1.2, c2[1] - R * .8, 'trofoblasto (fora)'); lab(ii.x, ii.y, c2[0] + R * 1.2, c2[1] + R * .6, 'massa celular interna'); }
        else lab(c2[0], c2[1], c2[0] + R * 1.25, c2[1] + R * .55, 'sem cavidade');
      }
      cap(cp > .5 ? 'Compactação: as células se achatam umas contra as outras; as de fora formarão o trofoblasto, as de dentro a massa celular interna' : p >= 4 ? 'Mórula: uma bolinha maciça de células, parecida com uma amora, sem cavidade' : n ? `${2 ** n} blastômeros, todos ainda equivalentes` : 'Zigoto: a primeira célula do novo indivíduo');
    }
  });

  // =====================================================================================
  // D3 BLÁSTULA: a mórula ganha líquido e fica oca (corte), em quatro animais
  // =====================================================================================
  // amostra radial de um polígono a partir do centroide (para transformar círculo em célula alongada)
  const KR = 28;
  function radial(P) {
    let cx = 0, cy = 0; P.forEach(q => { cx += q[0]; cy += q[1]; }); cx /= P.length; cy /= P.length;
    const d = [];
    for (let k = 0; k < KR; k++) {
      const a = k / KR * TAU, ux = Math.cos(a), uy = Math.sin(a); let best = 0;
      for (let i = 0; i < P.length; i++) {
        const A = P[i], B = P[(i + 1) % P.length], ex = B[0] - A[0], ey = B[1] - A[1], wx = A[0] - cx, wy = A[1] - cy, den = ux * ey - uy * ex;
        if (Math.abs(den) < 1e-9) continue; const tt = (wx * ey - wy * ex) / den, s = (wx * uy - wy * ux) / den;
        if (s >= 0 && s <= 1 && tt > best) best = tt;
      }
      d.push(best);
    }
    return { c: [cx, cy], d };
  }
  const roundR = (x, y, r) => ({ c: [x, y], d: Array(KR).fill(r) });
  const morph = (a, b, f) => { const cx = lerp(a.c[0], b.c[0], f), cy = lerp(a.c[1], b.c[1], f), sw = 1 + .3 * Math.sin(PI * f); return a.d.map((_, k) => { const an = k / KR * TAU, r = lerp(a.d[k], b.d[k], f) * sw; return [cx + Math.cos(an) * r, cy + Math.sin(an) * r]; }); };
  function sector(cx, cy, r1, r2, a1, a2) { const P = []; for (let i = 0; i <= 5; i++) { const a = lerp(a1, a2, i / 5); P.push([cx + Math.cos(a) * r2, cy + Math.sin(a) * r2]); } for (let i = 5; i >= 0; i--) { const a = lerp(a1, a2, i / 5); P.push([cx + Math.cos(a) * r1, cy + Math.sin(a) * r1]); } return P; }
  // mórula em corte: N células num disco de raio 1
  function hexDisc(N) {
    const a = Math.sqrt(2 * PI / (Math.sqrt(3) * N)), pts = [];
    for (let j = -12; j <= 12; j++) for (let i = -12; i <= 12; i++) { const x = (i + (j & 1) * .5) * a, y = j * a * Math.sqrt(3) / 2; pts.push([x + .013, y + .021]); }
    pts.sort((p, q) => Math.hypot(...p) - Math.hypot(...q)); const s = pts.slice(0, N), mx = Math.hypot(...s[N - 1]) + a / 2;
    return s.map(q => ({ x: q[0] / mx, y: q[1] / mx, r: a / 2 / mx * 1.08 }));
  }
  const byAng = (L, f) => L.map((q, i) => [Math.atan2(f(q)[1], f(q)[0]), i]).sort((a, b) => a[0] - b[0]).map(z => z[1]);
  const BL = (() => {
    const out = {};
    // anfioxo: esfera oca regular, uma camada de células
    { const N = 30, M = hexDisc(N), T = [...Array(N)].map((_, i) => sector(0, 0, .8, 1, -PI + i * TAU / N + .004, -PI + (i + 1) * TAU / N - .004));
      const om = byAng(M, q => [q.x, q.y]); const cells = om.map((mi, j) => ({ a: roundR(M[mi].x, M[mi].y, M[mi].r), b: radial(T[j]), y: 0, kind: 'b' }));
      out.anfioxo = { cells, cav: [0, 0, .8] }; }
    // anfíbio: blastocele deslocada para o polo animal; embaixo, várias camadas de células grandes com vitelo
    { const cc = [0, -.36], rc = .44, T = [], nW = 22;
      const D = a => { const ux = Math.cos(a), uy = Math.sin(a), b = cc[0] * ux + cc[1] * uy, c = cc[0] ** 2 + cc[1] ** 2 - 1; return -b + Math.sqrt(b * b - c); };
      const pt = (a, f) => { const r = rc + f * (D(a) - rc); return [cc[0] + Math.cos(a) * r, cc[1] + Math.sin(a) * r]; };
      for (let i = 0; i < nW; i++) {
        const a1 = -PI / 2 + i * TAU / nW, a2 = a1 + TAU / nW, am = (a1 + a2) / 2, veg = ss((Math.sin(am) + .3) / 1.3), th = lerp(.16, .42, veg), Ly = Math.max(1, Math.round((D(am) - rc) / th));
        for (let l = 0; l < Ly; l++) { const P = []; for (let s = 0; s <= 4; s++) P.push(pt(lerp(a1, a2, s / 4) + .003, (l + 1) / Ly - .004)); for (let s = 4; s >= 0; s--) P.push(pt(lerp(a1, a2, s / 4) + .003, l / Ly + .004)); T.push(P); }
      }
      const N = T.length, M = hexDisc(N), R2 = T.map(radial), used = new Set(), cells = [];
      R2.map((r, i) => [Math.hypot(r.c[0], r.c[1] - .05), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => {
        let bj = -1, bd = 1e9; M.forEach((m, j) => { if (used.has(j)) return; const d = Math.hypot(m.x - R2[i].c[0], m.y - R2[i].c[1]); if (d < bd) { bd = d; bj = j; } });
        used.add(bj); cells.push({ a: roundR(M[bj].x, M[bj].y, M[bj].r), b: R2[i], y: R2[i].c[1], y0: M[bj].y, kind: 'b' });
      });
      out.anfibio = { cells, cav: [cc[0], cc[1], rc] }; }
    // mamífero: blastocisto com trofoblasto (camada externa) e massa celular interna num dos lados
    { const Nt = 24, ic = [], M0 = hexDisc(Nt + 10);
      for (let j = -3; j <= 3; j++) for (let i = -4; i <= 4; i++) { const x = (i + (j & 1) * .5) * .25, y = -.66 + j * .2; if (Math.hypot(x, y) < .76 && y < -.3 && y > -.9) ic.push([x, y]); }
      const Mi = ic.length, M = hexDisc(Nt + Mi), byR = M.map((m, i) => [Math.hypot(m.x, m.y), i]).sort((a, b) => b[0] - a[0]).map(z => z[1]);
      const outer = byR.slice(0, Nt), inner = byR.slice(Nt), T = [...Array(Nt)].map((_, i) => sector(0, 0, .89, 1, -PI + i * TAU / Nt + .004, -PI + (i + 1) * TAU / Nt - .004));
      const oo = byAng(outer.map(i => M[i]), q => [q.x, q.y]).map(k => outer[k]);
      const cells = oo.map((mi, j) => ({ a: roundR(M[mi].x, M[mi].y, M[mi].r), b: radial(T[j]), kind: 't' }));
      const ii = inner.slice().sort((a, b) => M[a].x - M[b].x), ics = ic.slice().sort((a, b) => a[0] - b[0]);
      ii.forEach((mi, j) => cells.push({ a: roundR(M[mi].x, M[mi].y, M[mi].r), b: roundR(ics[j][0], ics[j][1], .135), kind: 'i' }));
      void M0; out.mamifero = { cells, cav: [0, 0, .89] }; }
    return out;
  })();
  const ORG = [
    { id: 'anfioxo', n: 'Anfioxo', s: 'esfera oca e regular' },
    { id: 'anfibio', n: 'Anfíbio', s: 'blastocele deslocada para o polo animal' },
    { id: 'ave', n: 'Ave', s: 'disco de células sobre a gema' },
    { id: 'mamifero', n: 'Mamífero', s: 'blastocisto' }
  ];
  function liquid(x, y, r) { const g = X.createRadialGradient(x - r * .3, y - r * .3, 2, x, y, r); g.addColorStop(0, light(C.liquido, .25)); g.addColorStop(1, C.liquido); circ(x, y, r, g); }
  function drawAve(cx, cy, R, q) {
    const yc = cy + R * 2.3, Ry = R * 2.75, ys = x => yc - Math.sqrt(Ry * Ry - x * x), A = area();
    X.save(); X.beginPath(); X.rect(A.x0, A.y0, A.w, A.h); X.clip();
    const g = X.createRadialGradient(cx, cy - R * .3, R * .2, cx, yc, Ry); g.addColorStop(0, lightC(C.vitelo, .2)); g.addColorStop(1, darkC(C.vitelo, .35));
    circ(cx, yc, Ry, g, STROKE, 1.5);
    X.save(); X.beginPath(); X.arc(cx, yc, Ry - 2, 0, TAU); X.clip(); grains(cx - Ry, ys(0) + 6, Ry * 2, R * 2, darkC(C.vitelo, .35), .45, 9); X.restore();
    X.restore();
    const hw = R * 1.15, th = x => R * .3 * Math.sqrt(Math.max(0, 1 - (x / hw) ** 2)) + R * .05, hc = x => q * R * .16 * Math.max(0, 1 - (x / (hw * .7)) ** 2);
    // fenda (cavidade sob o disco)
    if (q > .01) { X.beginPath(); for (let i = 0; i <= 40; i++) { const x = lerp(-hw * .7, hw * .7, i / 40); i ? X.lineTo(cx + x, ys(x) - hc(x)) : X.moveTo(cx + x, ys(x) - hc(x)); } for (let i = 40; i >= 0; i--) { const x = lerp(-hw * .7, hw * .7, i / 40); X.lineTo(cx + x, ys(x) + 1); } X.closePath(); X.fillStyle = light(C.liquido, .15); X.fill(); }
    const nc = 15;
    for (let i = 0; i < nc; i++) {
      const xa = lerp(-hw, hw, i / nc), xb = lerp(-hw, hw, (i + 1) / nc), xm = (xa + xb) / 2, rows = th(xm) > R * .25 ? 3 : th(xm) > R * .15 ? 2 : 1;
      const yb = x => ys(x) - hc(x), yt = x => yb(x) - th(x);
      for (let r = 0; r < rows; r++) {
        const P = [], f1 = r / rows, f2 = (r + 1) / rows;
        for (let s = 0; s <= 3; s++) { const x = lerp(xa, xb, s / 3); P.push([cx + x, lerp(yb(x), yt(x), f1)]); }
        for (let s = 3; s >= 0; s--) { const x = lerp(xa, xb, s / 3); P.push([cx + x, lerp(yb(x), yt(x), f2)]); }
        fillPoly(P, mix(C.ovo, '#FFFFFF', r * .08), STROKE, 1);
        const m = [cx + xm, lerp(yb(xm), yt(xm), (f1 + f2) / 2)]; circ(m[0], m[1], Math.max(1.8, R * .025), C.nucleo);
      }
    }
    return { top: ys(0) - th(0) - hc(0), cav: [cx, ys(0) - hc(0) / 2], yolk: [cx + R * .4, ys(0) + R * .6] };
  }
  def('desenvolvimento', 'blastula', {
    t: 'Blástula', s: 'a bola fica oca', c: C.liquido, loc: 'Embrião em corte', still: 2, stillV: 100,
    ctl: { l: 'Tempo', min: 0, max: 100, step: 1, v: 0, f: v => v < 15 ? 'mórula' : v < 90 ? 'blastocele crescendo' : 'blástula', rate: () => 1 },
    auto: 22,
    init(S) { if (S.org == null) S.org = 0; },
    extra: ORG.map((o, i) => ({ t: o.n, on: S => { S.org = i; }, pressed: S => (S.org || 0) === i })),
    alt: 'Corte de uma mórula que ganha líquido no centro: as células vão para a periferia e surge a blastocele; botões mostram as blástulas de anfioxo (esfera oca), anfíbio (cavidade deslocada para cima), ave (disco de células sobre a gema, com uma fenda embaixo) e mamífero (blastocisto com trofoblasto e massa celular interna)',
    d: `<p>As divisões continuam, e as células se organizam na periferia em volta de uma cavidade cheia de líquido, a <b>blastocele</b>. O embrião passa a se chamar <b>blástula</b>, e a camada de células, <b>blastoderme</b>. No anfioxo e no ouriço-do-mar, a blástula é uma esfera oca e regular. No anfíbio, a blastocele fica deslocada para o polo animal, porque o polo vegetativo está cheio de células com vitelo. Na ave, a blástula é um disco de células sobre a gema, com uma fenda embaixo.</p>
<p>Nos mamíferos, a blástula tem nome próprio: <b>blastocisto</b>. Ela tem uma camada externa, o <b>trofoblasto</b>, e um grupo de células num dos lados, a <b>massa celular interna</b> (embrioblasto), que vai formar o embrião. No ser humano, o blastocisto se forma por volta do 4º e 5º dia e se implanta no útero a partir do 6º (ver <a href="#humano/nidacao">nidação</a>). Os dias contam desde a fecundação.</p>
<p>Use os botões para trocar de animal; a faixa leva da mórula à blástula.</p>`,
    kv: [['Blastocele', 'cavidade cheia de líquido da blástula'], ['Blastoderme', 'camada de células em volta dela'], ['Mamíferos', 'blastocisto: trofoblasto + massa celular interna'], ['No ser humano', 'blastocisto no 4º e 5º dia; implanta-se a partir do 6º (desde a fecundação)']],
    enem: 'Blástula é <b>oca</b>: tem a <b>blastocele</b>. Nos mamíferos, chama-se <b>blastocisto</b>: o trofoblasto ajuda a formar a placenta, e a massa celular interna forma o embrião. Da massa celular interna saem as <b>células-tronco embrionárias</b>, que podem formar qualquer tecido; o uso delas em pesquisa é tema de questões sobre bioética.',
    links: [['Nidação', '#humano/nidacao'], ['Gástrula', '#desenvolvimento/gastrula']],
    draw(t, S) {
      const A = area(), q = ss(seg(S.v, 8, 92)), oi = S.org || 0, O = ORG[oi];
      const R = Math.min(A.w * (NAR ? .36 : .27), (A.h - 90) / 2.3), cx = A.cx, cy = A.y0 + 44 + (A.h - 90) / 2;
      head(O.n, cx, A.y0 + 8); tx(q > .9 ? O.s : q > .05 ? 'a blastocele está se formando' : 'mórula: ainda maciça', cx, A.y0 + (NAR ? 27 : 30), { s: 12, c: C.dim, bg: false });
      if (oi === 2) {
        const r = drawAve(cx, cy + R * .1, R, q);
        lab(cx - R * .5, r.top + R * .1, cx - R * 1.3, r.top - 26, 'blastoderme (disco de células)');
        if (q > .4) lab(r.cav[0] + R * .15, r.cav[1], cx + R * 1.2, r.cav[1] - 34, 'fenda (blastocele)');
        lab(r.yolk[0], r.yolk[1], cx + R * 1.2, r.yolk[1] + 20, 'gema (vitelo)');
      } else {
        const B = BL[O.id], cav = B.cav, k = ss(seg(q, 0, 1));
        if (oi === 3) circ(cx, cy, R * 1.07, 'rgba(201,207,220,.04)', 'rgba(201,207,220,.4)', 2.5);
        else envelope(cx, cy, R);
        if (k > .02) liquid(cx + cav[0] * R, cy + cav[1] * R, cav[2] * R * k);
        const ms = [];
        for (const c of B.cells) {
          const P = morph(c.a, c.b, k).map(z => [cx + z[0] * R, cy + z[1] * R]);
          let col = C.ovo;
          if (oi === 1) col = mix(C.ovo, C.vitelo, ss((lerp(c.y0, c.y, k) + .2) / .9));
          if (oi === 3) col = mix(C.ovo, c.kind === 't' ? TROFO : EMB, k);
          fillPoly(P, col, STROKE, 1.1);
          const m = [cx + lerp(c.a.c[0], c.b.c[0], k) * R, cy + lerp(c.a.c[1], c.b.c[1], k) * R]; circ(m[0], m[1], Math.max(1.8, R * .028), C.nucleo); ms.push({ m, c });
        }
        const cvx = cx + cav[0] * R, cvy = cy + cav[1] * R;
        if (q > .4) lab(cvx, cvy + (oi === 3 ? cav[2] * R * .3 : 0), cx + R * 1.3, cvy + R * .5, 'blastocele');
        if (oi === 0) lab(cx - R * .9 * .7, cy - R * .9 * .7, cx - R * 1.3, cy - R * .95, q > .5 ? 'blastoderme' : 'blastômeros');
        if (oi === 1) { lab(cx, cy + R * .65, cx - R * 1.3, cy + R * .9, 'células com vitelo'); { const px = NAR ? A.x1 : cx + R * 1.1, al = NAR ? 'right' : 'left'; tx('polo animal', px, cy - R * (NAR ? 1.12 : .95), { s: 12, c: C.dim, a: al }); tx('polo vegetativo', px, cy + R * (NAR ? 1.12 : .95), { s: 12, c: C.dim, a: al }); } }
        if (oi === 3 && q > .4) {
          const tl = ms.filter(z => z.c.kind === 't').sort((a, b) => a.m[0] - b.m[0])[0], ic = ms.filter(z => z.c.kind === 'i'), icm = ic.reduce((a, z) => [a[0] + z.m[0] / ic.length, a[1] + z.m[1] / ic.length], [0, 0]);
          lab(tl.m[0], tl.m[1], cx - R * 1.3, cy + R * .7, 'trofoblasto'); lab(icm[0], icm[1], cx - R * 1.3, cy - R * 1.0, 'massa celular interna');
          if (q > .9 && !NAR) lab(cx + R * .76, cy - R * .76, cx + R * 1.3, cy - R * .95, 'zona pelúcida');
        }
      }
      if (oi === 3) tx(q > .5 ? 'ser humano: dia 4 a 5, blastocisto' : 'ser humano: dia 3 a 4, mórula', cx, A.y1 - 14, { s: 12, c: C.dim, bg: false });
      if (oi === 3 && !NAR) tx('(dias desde a fecundação)', cx, A.y1 + 4, { s: 12, c: C.dim, bg: false });
      cap(q < .05 ? 'Mórula: maciça, sem cavidade' : q < .95 ? 'O líquido entra, a blastocele cresce e as células vão para a periferia' : oi === 3 ? 'Blastocisto: trofoblasto por fora, massa celular interna num dos lados e a blastocele' : oi === 2 ? 'Blástula da ave: um disco de células sobre a gema, com uma fenda embaixo' : oi === 1 ? 'Blástula do anfíbio: a blastocele fica perto do polo animal; embaixo, células grandes com vitelo' : 'Blástula do anfioxo: uma esfera oca com uma camada de células');
    }
  });

  // =====================================================================================
  // D4 GÁSTRULA (anfioxo): invaginação do polo vegetativo forma o arquêntero e o blastóporo
  // =====================================================================================
  const GA = (() => {
    const Ro = .86, wo = .14, wi = .2, gap = .13, Ri = Ro - wo / 2 - gap - wi / 2, be = .4, rho = (Ro - Ri) / 2, F = [], dir = a => [Math.cos(a), Math.sin(a)];
    const arc = (r, a1, a2, n) => { for (let i = 0; i <= n; i++) { const a = lerp(a1, a2, i / n); F.push([Math.cos(a) * r, Math.sin(a) * r, 'o']); } };
    arc(Ro, -PI / 2, PI / 2 - be, 60); const iA = F.length;
    { const pl = PI / 2 - be, C0 = dir(pl).map(v => v * (Ro + Ri) / 2), d1 = dir(pl), d2 = dir(pl + PI / 2); for (let i = 1; i <= 16; i++) { const s = i / 16 * PI; F.push([C0[0] + rho * (Math.cos(s) * d1[0] + Math.sin(s) * d2[0]), C0[1] + rho * (Math.cos(s) * d1[1] + Math.sin(s) * d2[1]), 'l']); } }
    const iB = F.length; for (let i = 1; i <= 100; i++) { const a = lerp(PI / 2 - be, PI / 2 + be - TAU, i / 100); F.push([Math.cos(a) * Ri, Math.sin(a) * Ri, 'i']); } const iC = F.length;
    { const pl = PI / 2 + be, C0 = dir(pl).map(v => v * (Ro + Ri) / 2), d1 = dir(pl), d2 = dir(pl - PI / 2); for (let i = 1; i <= 16; i++) { const s = i / 16 * PI; F.push([C0[0] + rho * (-Math.cos(s) * d1[0] + Math.sin(s) * d2[0]), C0[1] + rho * (-Math.cos(s) * d1[1] + Math.sin(s) * d2[1]), 'l']); } }
    const iD = F.length; arc(Ro, PI / 2 + be, 3 * PI / 2, 60); F.shift();
    // comprimento acumulado
    const cum = [0]; for (let i = 1; i < F.length; i++) cum.push(cum[i - 1] + Math.hypot(F[i][0] - F[i - 1][0], F[i][1] - F[i - 1][1]));
    const tot = cum[cum.length - 1] + Math.hypot(F[0][0] - F[F.length - 1][0], F[0][1] - F[F.length - 1][1]);
    const sA = (cum[iA - 1] + cum[iB - 1]) / 2 / tot, sB = (cum[iC - 1] + cum[iD - 1]) / 2 / tot; // meio dos lábios: limite ecto/endo
    const at = s => { s = fr(s) * tot; let i = 0; while (i < cum.length - 1 && cum[i + 1] < s) i++; const j = (i + 1) % F.length, L = (i + 1 < cum.length ? cum[i + 1] : tot) - cum[i], f = L ? (s - cum[i]) / L : 0; return [lerp(F[i][0], F[j][0], f), lerp(F[i][1], F[j][1], f)]; };
    const M = 300, fin = [...Array(M)].map((_, i) => at(i / M));
    return { Ro, Ri, wo, wi, gap, be, sA, sB, fin, M };
  })();
  def('desenvolvimento', 'gastrula', {
    t: 'Gástrula', s: 'surgem os folhetos e o intestino primitivo', c: C.endo, loc: 'Gástrula de anfioxo, em corte', still: 2, stillV: 100,
    ctl: { l: 'Gastrulação', min: 0, max: 100, step: 5, v: 0, f: v => Math.round(v) + ' %', rate: () => 1 },
    auto: 13,
    alt: 'Blástula de anfioxo em corte: o polo vegetativo se dobra para dentro (invaginação), a blastocele encolhe e forma-se o arquêntero, aberto para fora pelo blastóporo; a camada de fora é a ectoderme (azul) e a de dentro a endoderme (amarelo); no fim surgem a mesoderme (vermelho) entre as duas camadas e a notocorda (verde) em cima do arquêntero',
    d: `<p>Na <b>gastrulação</b>, as células da blástula se movem e se reorganizam em camadas, os <b>folhetos germinativos</b>. No modelo mais simples, o do anfioxo, uma parte da blástula afunda para dentro, como uma bola de borracha apertada com o dedo (<b>invaginação</b>, ou embolia). Forma-se uma nova cavidade, o <b>arquêntero</b> (intestino primitivo), que se abre para fora por um orifício, o <b>blastóporo</b>. A camada de fora é a <b>ectoderme</b>; a que reveste o arquêntero é a <b>endoderme</b>. Depois surge entre elas uma terceira camada, a <b>mesoderme</b>, e, nos cordados, a <b>notocorda</b>, um bastão de sustentação nas costas do embrião.</p>
<p>Nos anfíbios, além da invaginação, as células pequenas do polo animal crescem por cima das grandes, cheias de vitelo (<b>epibolia</b>); o vitelo que sobra aparece como um "tampão" no blastóporo. No ser humano, a gastrulação acontece na <b>3ª semana</b> após a fecundação (5ª semana pela DUM), a partir de uma faixa no disco embrionário, a linha primitiva, e transforma o disco de duas camadas num disco de três.</p>
<p>O destino do blastóporo está em <a href="#desenvolvimento/blastoporo">protostômios e deuterostômios</a>, e o que cada folheto forma, em <a href="#desenvolvimento/folhetos">folhetos</a>.</p>`,
    kv: [['Ectoderme', 'camada externa (azul)'], ['Endoderme', 'reveste o arquêntero (amarelo)'], ['Mesoderme', 'entre as duas (vermelho)'], ['Notocorda', 'bastão nas costas dos cordados (verde)'], ['Arquêntero', 'intestino primitivo; abre-se pelo blastóporo'], ['No ser humano', semF(3)]],
    enem: 'A gástrula é a fase em que surgem os <b>folhetos germinativos</b>, o <b>arquêntero</b> (que vai formar o tubo digestório) e o <b>blastóporo</b>. Não confunda as cavidades: a <b>blastocele</b> é a da blástula e some; o <b>arquêntero</b> é a nova, que vira intestino.',
    links: [['Protostômios e deuterostômios', '#desenvolvimento/blastoporo'], ['O que cada folheto forma', '#desenvolvimento/folhetos']],
    draw(t, S) {
      const A = area(), g = cl(S.v / 100, 0, 1), e = ss(seg(g, 0, .8)), m = ss(seg(g, .8, 1)), cg = ss(seg(g, .02, .4));
      const R = Math.min(A.w * (NAR ? .4 : .27), (A.h - 40) / 2.25), cx = A.cx, cy = A.y0 + 12 + (A.h - 24) / 2;
      const { fin, M, sA, sB, Ro, Ri, wo, wi, gap, be } = GA;
      // linha média do epitélio: do círculo da blástula para a forma final (mesmo parâmetro de comprimento)
      const mid = [], wd = [], isEndo = [];
      for (let i = 0; i < M; i++) {
        const s = i / M, a = -PI / 2 + s * TAU, b = fin[i], en = s > sA && s < sB;
        mid.push([cx + lerp(Math.cos(a) * Ro, b[0], e) * R, cy + lerp(Math.sin(a) * Ro, b[1], e) * R]); isEndo.push(en);
        const edge = Math.min(Math.abs(s - sA), Math.abs(s - sB)), bl = ss(cl(edge * 25, 0, 1));
        wd.push(R * lerp(wo, en ? lerp(wo, wi, bl) : wo, e));
      }
      const nor = mid.map((q, i) => { const a = mid[(i - 1 + M) % M], b = mid[(i + 1) % M], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [dy / L, -dx / L]; });
      const P1 = mid.map((q, i) => [q[0] + nor[i][0] * wd[i] / 2, q[1] + nor[i][1] * wd[i] / 2]), P2 = mid.map((q, i) => [q[0] - nor[i][0] * wd[i] / 2, q[1] - nor[i][1] * wd[i] / 2]);
      // blastocele: o espaço fechado pela linha média (encolhe à medida que as camadas se encostam)
      fillPoly(mid, rgba(C.liquido, lerp(1, .85, m)));
      // arquêntero: cavidade nova, dentro da endoderme, aberta pelo blastóporo
      const iS = Math.ceil(sA * M), iE = Math.floor(sB * M), arch = P2.slice(iS, iE + 1);
      if (e > .15) fillPoly(arch.length ? arch : [], rgba(C.endo, .1 * ss(seg(e, .15, .6))));
      // mesoderme e notocorda surgem entre as camadas no fim
      if (m > 0) {
        const rm = (Ro - wo / 2 + Ri + wi / 2) / 2 * R, hw = gap * R * .5 * m, nA = .3;
        const band = (a1, a2) => { const P = []; for (let i = 0; i <= 24; i++) { const a = lerp(a1, a2, i / 24); P.push([cx + Math.cos(a) * (rm + hw), cy + Math.sin(a) * (rm + hw)]); } for (let i = 24; i >= 0; i--) { const a = lerp(a1, a2, i / 24); P.push([cx + Math.cos(a) * (rm - hw), cy + Math.sin(a) * (rm - hw)]); } fillPoly(P, C.meso, STROKE, 1); };
        band(-PI / 2 + nA + .04, PI / 2 - be - .22); band(PI / 2 + be + .22, 3 * PI / 2 - nA - .04);
        ell(cx, cy - rm, R * .16 * m + 1, gap * R * .48 * m + 1, 0, C.noto, STROKE, 1.2);
      }
      // células: faixas do epitélio entre as duas bordas
      const NC = 56;
      for (let c = 0; c < NC; c++) {
        const i0 = Math.round(c / NC * M), i1 = Math.round((c + 1) / NC * M), P = [];
        for (let i = i0; i <= i1; i++) P.push(P1[i % M]); for (let i = i1; i >= i0; i--) P.push(P2[i % M]);
        const im = Math.round((i0 + i1) / 2) % M, en = isEndo[im];
        fillPoly(P, mix(C.ovo, en ? C.endo : C.ecto, cg * .9), STROKE, 1);
        circ(mid[im][0], mid[im][1], Math.max(1.6, R * .02), rgba(C.nucleo, .9));
      }
      // rótulos
      const pick = s => { const i = Math.round(s * M) % M; return P1[i]; };
      const ecto = pick(.12), endo = P2[Math.round((sA + sB) / 2 * M + M * .12)], bot = [cx, cy + lerp(Ro, Math.cos(be) * Ro, e) * R], ac = [cx, cy + lerp(.2, .05, e) * R];
      if (g > .05) { lab(ecto[0], ecto[1], cx + R * 1.2, cy - R * .85, 'ectoderme'); lab(endo[0], endo[1], cx - R * 1.25, cy - R * .25, 'endoderme'); }
      else lab(ecto[0], ecto[1], cx + R * 1.2, cy - R * .85, 'blastoderme');
      if (m > .3) { { const rm = (Ro - wo / 2 + Ri + wi / 2) / 2 * R, am = PI * .85; lab(cx + Math.cos(am) * rm, cy + Math.sin(am) * rm, cx - R * 1.25, cy + R * .45, 'mesoderme'); } lab(cx, cy - (Ro - wo / 2 - gap / 2) * R, cx - R * 1.2, cy - R * .95, 'notocorda'); }
      if (e > .45) { lab(bot[0], bot[1] - 4, cx + R * 1.2, bot[1] + 10, 'blastóporo'); tx('arquêntero', ac[0], ac[1], { s: 13, w: 600, c: C.txt }); }
      if (m > .5 && !NAR) { const a = PI / 2 - be - .12, rm = (Ro - wo / 2 + Ri + wi / 2) / 2 * R; lab(cx + Math.cos(a) * rm, cy + Math.sin(a) * rm, cx + R * 1.25, cy + R * .5, 'restos da blastocele'); }
      if (m < .3) { const bi = Math.round(.06 * M), bq = [lerp(P2[bi][0], cx, .12), lerp(P2[bi][1], cy, .12)]; lab(bq[0], bq[1] + 6, cx + R * 1.25, cy - R * .45, e > .5 ? 'blastocele (encolhe)' : 'blastocele'); }
      cap(g < .05 ? 'Blástula de anfioxo: uma camada de células em volta da blastocele' : e < .98 ? 'Invaginação: o polo vegetativo afunda, como uma bola apertada com o dedo; a blastocele encolhe e o arquêntero cresce' : m < .5 ? 'Gástrula: ectoderme por fora, endoderme revestindo o arquêntero, que se abre pelo blastóporo' : 'Surgem a mesoderme, entre as duas camadas, e a notocorda, em cima do arquêntero');
    }
  });
}
