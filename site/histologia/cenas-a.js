/* LAB, módulo Histologia. Cenas: Tecidos (visão geral) e Epitelial (revestimento e glandular).
   Código da equipe (Aurelius). Textos: roteiro do Taxon (docs/revisao-biologia/histologia-roteiro.md). */
'use strict';
{
  const MU = '#DCE8F5';      // muco
  const SECR = '#FFE7A3';    // secreção e hormônio (pontos claros)
  const LUZ = '#151d33';     // luz de ducto ou de órgão oco
  function mixH(a, b, k) { const A = hx(a), B = hx(b); return '#' + [0, 1, 2].map(i => Math.round(A[i] + (B[i] - A[i]) * k).toString(16).padStart(2, '0')).join(''); }
  const tint = (c, k = .5) => mixH(C.he_rosa, c, k);
  function clipR(x, y, w, h) { X.beginPath(); X.rect(x, y, w, h); X.clip(); }
  // pastilha de nome sem linha-guia, presa a uma camada do corte
  function pill(s, x, y, c, a = 1) {
    if (!LB) return; X.save(); X.globalAlpha *= a; X.font = `600 ${NAR ? 12 : 13}px ${FT}`;
    const w = X.measureText(s).width + (c ? 26 : 16), h = NAR ? 20 : 22;
    rr(x, y - h / 2, w, h, 999, 'rgba(11,15,28,.84)', 'rgba(255,255,255,.14)', 1);
    if (c) circ(x + 11, y, 4.5, c);
    X.fillStyle = C.txt; X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillText(s, x + (c ? 20 : 8), y + .5); X.restore();
  }
  // título centrado que encolhe para caber
  function title(s, x, y, maxw, c) { let sz = NAR ? 15 : 17; while (sz > 12 && tw(s, sz, 600, FH) > maxw) sz--; tx(s, x, y, { f: FH, s: sz, w: 600, c: c || C.txt }); }
  function syncCtl(o, S) { const r = $('ctlR'); r.value = S.v; const f = o.ctl.f(S.v); $('ctlV').textContent = f; r.setAttribute('aria-valuetext', f); }
  function syncExtra(o, S) { [...$('extra').children].forEach((b, i) => { const y = o.extra && o.extra[i]; if (y) b.setAttribute('aria-pressed', y.pressed ? !!y.pressed(S) : false); }); }

  // ---------------------------------------------------------------------------------
  // tecidos em retângulos (usados no corte da visão geral e na lupa)
  // ---------------------------------------------------------------------------------
  function epiCols(x, y, w, h, cw, a, o = {}) {
    if (a <= .02) return; X.save(); X.globalAlpha *= a; clipR(x, y - 12, w, h + 12);
    const f = tint(C.epit, .45);
    for (let i = 0, cx = x; cx < x + w; i++, cx += cw) {
      const gob = o.calic && i % 5 === 2;
      rr(cx, y, cw, h, 2, f, rgba(C.epit, .85), 1);
      if (gob) { ell(cx + cw / 2, y + h * .32, cw * .36, h * .26, 0, rgba(MU, .7), rgba(C.he_rosa, .8), 1); nuc(cx + cw / 2, y + h * .84, cw * .28, h * .07); }
      else nuc(cx + cw / 2, y + h * .7, cw * .25, Math.min(h * .14, cw * .5));
      if (o.mv && !gob) for (let j = 0; j < 5; j++) line(cx + cw * (j + .5) / 5, y, cx + cw * (j + .5) / 5, y - o.mv, tint(C.epit, .6), 1.2);
    }
    X.restore();
  }
  // estratificado: fileiras de baixo (cúbicas) para cima (achatadas); ker = camadas mortas de queratina no alto
  function estrat(x, yb, w, H, a, o = {}) {
    if (a <= .02) return yb - H; X.save(); X.globalAlpha *= a;
    const rows = [[14, 16], [13, 20], [13, 24], [9, 34], [7, 44], [5, 58], [5, 66]];
    if (o.ker) rows.push([4, 84, 1], [4, 92, 1], [4, 100, 1]);
    const tot = rows.reduce((s, r) => s + r[0], 0), k = H / tot; let y = yb;
    clipR(x, yb - H - 2, w, H + 4);
    rows.forEach(([hh, cw, ker], j) => {
      const rh = hh * k, cwp = cw * k, off = (j * .37 % 1) * cwp, f = ker ? '#EBD3DC' : tint(C.epit, .45 - j * .03);
      for (let cx = x - off; cx < x + w; cx += cwp) {
        rr(cx + .5, y - rh, cwp - 1, rh, Math.min(3, rh / 3), f, ker ? 'rgba(255,255,255,.28)' : rgba(C.epit, .8), 1);
        if (!ker) nuc(cx + cwp / 2, y - rh / 2, Math.min(cwp * .2, rh * (j ? .55 : .35)), rh * (j < 3 ? .3 : .22));
      }
      y -= rh;
    });
    X.restore(); return yb - H;
  }
  function conjR(x, y, w, h, a, o = {}) {
    if (a <= .02) return; matriz(x, y, w, h, { a, seed: o.seed || 3, n: o.n || 1 });
    X.save(); X.globalAlpha *= a; clipR(x, y, w, h);
    const R = rng((o.seed || 3) + 5), n = Math.max(2, Math.round(w * h / (o.esp || 7000))), s = o.fs || 1;
    for (let i = 0; i < n; i++) { const fx = x + R() * w, fy = y + R() * h, an = (R() - .5) * .8; ell(fx, fy, 12 * s, 3.2 * s, an, rgba(C.he_rosa, .55)); nuc(fx, fy, 7 * s, 2.2 * s, an, { seed: i + 2 }); }
    for (const c of o.cap || []) capilar(c[0], c[1], c[2], { t: o.t || 0 });
    X.restore();
  }
  function muscR(x, y, w, h, a, o = {}) {
    if (a <= .02) return; X.save(); X.globalAlpha *= a; clipR(x, y, w, h);
    X.fillStyle = rgba(C.he_rosa, .1); X.fillRect(x, y, w, h);
    const s = o.s || 12, f = tint(C.musc, .55);
    if (o.v) {
      for (let j = 0, cy = y + s * .5; cy < y + h + s; j++, cy += s * .95) for (let cx = x + (j % 2) * s * .5; cx < x + w + s; cx += s) {
        circ(cx, cy, s * .46, f, rgba(C.musc, .85), 1); if ((cx * 3 + cy) % 3 < 1.2) nuc(cx, cy, s * .14, s * .14);
      }
    } else {
      const L = s * 5;
      for (let j = 0, cy = y + s * .5; cy < y + h + s; j++, cy += s * .9) for (let cx = x - (j % 3) * L / 3; cx < x + w + L; cx += L) {
        ell(cx + L / 2, cy, L / 2, s * .47, 0, f, rgba(C.musc, .85), 1); nuc(cx + L / 2, cy, L * .14, s * .14, 0, { seed: j + 1 });
      }
    }
    X.restore();
  }
  function neuro(cx, cy, r, a, t, seed = 1) {
    if (a <= .02) return; X.save(); X.globalAlpha *= a; const R = rng(seed), f = tint(C.neur, .6);
    for (let i = 0; i < 5; i++) {
      const an = i / 5 * TAU + R() * .6, L = r * (2.2 + R() * 1.6), ex = cx + Math.cos(an) * L, ey = cy + Math.sin(an) * L * .6;
      X.beginPath(); X.moveTo(cx, cy); X.quadraticCurveTo(cx + Math.cos(an + .4) * L * .5, cy + Math.sin(an + .4) * L * .4, ex, ey); X.strokeStyle = f; X.lineWidth = Math.max(1.5, r * .22); X.lineCap = 'round'; X.stroke();
      line(ex, ey, ex + Math.cos(an - .6) * r * .8, ey + Math.sin(an - .6) * r * .5, f, Math.max(1, r * .12));
    }
    // axônio, mais longo, para a direita
    X.beginPath(); X.moveTo(cx, cy); X.bezierCurveTo(cx + r * 3, cy + r * .8, cx + r * 5, cy - r * .6, cx + r * 9, cy + r * .2); X.strokeStyle = f; X.lineWidth = Math.max(1.5, r * .25); X.stroke();
    circ(cx, cy, r, f, rgba(C.neur, .95), 1.5);
    circ(cx, cy, r * .45, '#D9CCF5', 'rgba(11,15,28,.4)', 1); circ(cx + r * .08, cy - r * .05, Math.max(1.5, r * .13), C.he_nucleo);
    X.restore();
  }
  function nervR(x, y, w, h, a, t, o = {}) {
    if (a <= .02) return; matriz(x, y, w, h, { a: a * .7, n: .4, seed: 9 });
    X.save(); clipR(x, y, w, h);
    const n = Math.max(2, Math.round(w / (o.esp || 130))), r = Math.min(h * .28, 11);
    for (let i = 0; i < n; i++) neuro(x + (i + .5) * w / n, y + h * (.5 + (i % 2 ? .1 : -.1)), r, a, t, i + 3);
    X.globalAlpha *= a; const R = rng(21); for (let i = 0; i < n * 4; i++) nuc(x + R() * w, y + R() * h, 2.6, 2);
    X.restore();
  }
  function adipR(x, y, w, h, a, s = 26) {
    if (a <= .02) return; X.save(); X.globalAlpha *= a; clipR(x, y, w, h);
    X.fillStyle = rgba(C.he_rosa, .12); X.fillRect(x, y, w, h);
    for (let j = 0, cy = y + s * .4; cy < y + h + s; j++, cy += s * 1.6) for (let cx = x + (j % 2) * s; cx < x + w + s; cx += s * 2) {
      circ(cx, cy, s * .95, rgba(C.adip, .16), tint(C.conj, .5), 2); nuc(cx + s * .8, cy + s * .3, s * .18, s * .07, -.6);
    }
    X.restore();
  }

  // =====================================================================================
  // TECIDOS: visão geral
  // =====================================================================================
  const NOMES = ['epitelial', 'conjuntivo', 'muscular', 'nervoso', 'órgão'];
  const TC = [C.epit, C.conj, C.musc, C.neur];
  const DENS = [.92, .25, .85, .9];    // fração ilustrativa de células (o resto é matriz)
  const CAPV = [
    '<b>Epitelial:</b> células coladas, quase sem matriz e sem vasos; reveste superfícies e forma glândulas',
    '<b>Conjuntivo:</b> células afastadas em muita matriz, com vasos; sustenta, liga, preenche, defende e transporta',
    '<b>Muscular:</b> células alongadas (fibras) que se contraem e movem o órgão',
    '<b>Nervoso:</b> neurônios e glia muito juntos, quase sem matriz; recebem, conduzem e integram sinais',
    '<b>Órgão:</b> vários tecidos juntos, cada um com sua função'
  ];
  const INT = [
    { k: -1, f: .1, n: 'luz do intestino' },
    { k: 0, f: .2, n: 'epitélio' },
    { k: 1, f: .27, n: 'conjuntivo' },
    { k: 2, f: .17, n: 'músculo liso' },
    { k: 3, f: .09, n: 'plexo nervoso' },
    { k: 2, f: .17, n: '', v: true }
  ];
  const PELE = [
    { k: 0, f: .22, n: 'epiderme', estr: true },
    { k: 1, f: .43, n: 'derme' },
    { k: 1, f: .35, n: 'hipoderme', adip: true }
  ];
  function lupaT(k, cx, cy, r, t, pele) {
    const x = cx - r, y = cy - r, d = 2 * r;
    if (k === 0 && pele) {
      X.fillStyle = LUZ; X.fillRect(x, y, d, d);
      estrat(x, cy + r * .3, d, r * 1.05, 1, { ker: true });
      conjR(x, cy + r * .32, d, r * .7, 1, { seed: 4, fs: 1.6, esp: 5000 });
      line(x, cy + r * .31, x + d, cy + r * .31, '#F6C9DA', 3);
    } else if (k === 0) {
      X.fillStyle = LUZ; X.fillRect(x, y, d, d);
      epiCols(x, cy - r * .5, d, r * .82, r * .3, 1, { mv: r * .07, calic: true });
      conjR(x, cy + r * .34, d, r * .7, 1, { seed: 4, fs: 1.6, esp: 5000 });
      line(x, cy + r * .33, x + d, cy + r * .33, '#F6C9DA', 3);
    } else if (k === 1) conjR(x, y, d, d, 1, { seed: 8, n: 2.4, fs: 1.8, esp: 4200, cap: [[cx + r * .35, cy + r * .4, r * .16]], t });
    else if (k === 2) muscR(x, y, d, d, 1, { s: r * .22 });
    else { matriz(x, y, d, d, { n: .5, seed: 2, a: .7 }); neuro(cx - r * .35, cy, r * .2, 1, t, 4); const R = rng(5); for (let i = 0; i < 6; i++) nuc(x + R() * d, y + R() * d, 4, 3); }
  }
  def('tecidos', 'visao', {
    t: 'Os quatro tecidos', s: 'células e matriz trabalhando juntas', c: C.he_rosa,
    ctl: { l: 'Tecido', min: 0, max: 4, step: 1, v: 0, f: v => NOMES[Math.round(v)], rate: () => 1 },
    auto: S => .26, stillV: 4, still: 2,
    loc: 'Corte de órgão, como no microscópio',
    alt: 'Corte da parede do intestino (ou da pele) desenhado no estilo da coloração HE, com camadas de epitélio, conjuntivo, músculo e nervos; a faixa acende um tecido por vez, uma lupa mostra o detalhe e uma barra compara a quantidade de células e de matriz',
    extra: [
      { t: 'Intestino', on: S => { S.pele = false; }, pressed: S => !S.pele },
      { t: 'Pele', on: S => { S.pele = true; }, pressed: S => !!S.pele }
    ],
    d: `<p><b>Tecido</b> é um conjunto de células parecidas, com a mesma origem e a mesma função, junto com o material que fica entre elas, a <b>matriz extracelular</b>. O corpo humano tem quatro tipos de tecido. No <b>epitelial</b>, as células ficam coladas umas nas outras, com quase nenhuma matriz: ele reveste superfícies e forma glândulas. No <b>conjuntivo</b>, as células ficam afastadas, mergulhadas em muita matriz: ele sustenta, preenche, liga, defende e transporta (o sangue é um conjuntivo). O <b>muscular</b> tem células alongadas que se contraem. O <b>nervoso</b> tem células que recebem e transmitem sinais elétricos. Os órgãos são feitos de vários tecidos juntos: o estômago tem epitélio por dentro, conjuntivo, músculo e nervos.</p>
<p>Os tecidos vêm dos <b>folhetos germinativos</b> do embrião (ver <a href="../embriologia/index.html#desenvolvimento/folhetos">Folhetos germinativos</a>). O nervoso vem da ectoderme (exceto a micróglia, células de defesa de origem mesodérmica); o conjuntivo e quase todo o muscular, da mesoderme; e o epitelial pode vir dos três folhetos (a epiderme da ectoderme, o revestimento do intestino da endoderme, o dos vasos da mesoderme). A ciência que estuda os tecidos é a <b>histologia</b>. Como as células são quase transparentes, os cortes são tingidos: na coloração mais comum, a <b>HE</b>, os núcleos ficam roxo-azulados e o citoplasma e as fibras, rosa.</p>
<div class="tab"><table>
<thead><tr><th>Tecido</th><th>Células</th><th>Matriz extracelular</th><th>Vasos sanguíneos</th><th>Função principal</th><th>Origem principal</th></tr></thead>
<tbody>
<tr><th>Epitelial</th><td>justapostas</td><td>quase nenhuma</td><td>não tem (nutrição por difusão)</td><td>revestir, proteger, absorver, secretar</td><td>ecto, meso e endoderme</td></tr>
<tr><th>Conjuntivo</th><td>afastadas</td><td>abundante</td><td>em geral sim (a cartilagem não tem)</td><td>sustentar, ligar, preencher, defender, transportar</td><td>mesoderme</td></tr>
<tr><th>Muscular</th><td>alongadas (fibras)</td><td>pouca</td><td>sim</td><td>contrair e mover</td><td>mesoderme</td></tr>
<tr><th>Nervoso</th><td>neurônios e glia</td><td>pouquíssima</td><td>sim</td><td>receber, conduzir e integrar sinais</td><td>ectoderme</td></tr>
</tbody></table></div>`,
    enem: 'O critério para identificar o tecido num desenho é a <b>relação entre células e matriz</b>: células coladas e pouca matriz indicam <b>epitelial</b>; células espalhadas em muita matriz indicam <b>conjuntivo</b>. Lembre ainda que o <b>sangue é um tecido conjuntivo</b> (a matriz é o plasma) e que o <b>epitélio não tem vasos</b>, e por isso depende do conjuntivo que fica logo abaixo dele.',
    links: [LK.folhetos, ['Epitélios de revestimento', '#epitelial/revestimento']],
    draw(t, S) {
      const A = area(), act = Math.round(S.v), pele = !!S.pele;
      let P, L;
      if (NAR) { P = { x: A.x0, y: A.y0 + 4, w: A.w, h: A.h * .56 }; const r = Math.min(A.h * .19, A.w * .24); L = { x: A.x0 + r + 4, y: P.y + P.h + 18 + r, r }; }
      else { P = { x: A.x0, y: A.y0 + 4, w: A.w * .6, h: A.h - 8 }; const r = Math.min(A.w * .15, A.h * .34); L = { x: A.x0 + A.w * .81, y: A.y0 + 32 + r, r }; }
      const on = k => act === 4 || k === act, al = k => on(k) ? 1 : .2;
      // corte em camadas
      X.save(); X.beginPath(); X.roundRect(P.x, P.y, P.w, P.h, 10); X.clip();
      const lay = pele ? PELE : INT, sum = lay.reduce((s, l) => s + l.f, 0); let y = P.y; const pos = [];
      for (const l of lay) {
        const h = P.h * l.f / sum; pos.push([l, y, h]);
        if (l.k === -1) { X.fillStyle = LUZ; X.fillRect(P.x, y, P.w, h); }
        else if (l.k === 0) { if (l.estr) estrat(P.x, y + h, P.w, h, al(0), { ker: true }); else epiCols(P.x, y, P.w, h, Math.max(14, h * .32), al(0), { mv: 3, calic: true }); }
        else if (l.k === 1) { if (l.adip) adipR(P.x, y, P.w, h, al(1), NAR ? 18 : 24); else conjR(P.x, y, P.w, h, al(1), { seed: 3, cap: [[P.x + P.w * .3, y + h * .55, Math.min(12, h * .18)], [P.x + P.w * .74, y + h * .4, Math.min(10, h * .15)]], t }); }
        else if (l.k === 2) muscR(P.x, y, P.w, h, al(2), { s: NAR ? 9 : 11, v: l.v });
        else nervR(P.x, y, P.w, h, al(3), t, { esp: NAR ? 110 : 150 });
        y += h;
      }
      // membrana basal sob o epitélio
      const ep = pos.find(p => p[0].k === 0); if (ep) line(P.x, ep[1] + ep[2], P.x + P.w, ep[1] + ep[2], rgba('#F6C9DA', .4 + .6 * al(0)), 2);
      if (pele) {
        const de = pos[1], hy = pos[2];
        // folículo do pelo (epitélio) com o músculo eretor (liso) e uma terminação nervosa
        const fx0 = P.x + P.w * .8, fy0 = de[1], fx1 = P.x + P.w * .68, fy1 = de[1] + de[2] * .85;
        X.save(); X.globalAlpha *= al(0); X.lineCap = 'round'; line(fx0, fy0 - pos[0][2], fx1, fy1, tint(C.epit, .45), NAR ? 16 : 20); line(fx0, fy0 - pos[0][2] - 4, fx1, fy1, '#3B2A2A', 3); X.restore();
        const mx0 = lerp(fx0, fx1, .55), my0 = lerp(fy0, fy1, .55), mx1 = P.x + P.w * .95, my1 = de[1] + 4;
        X.save(); X.globalAlpha *= al(2); X.lineCap = 'round'; line(mx0, my0, mx1, my1, tint(C.musc, .55), NAR ? 9 : 11); line(mx0, my0, mx1, my1, rgba(C.musc, .9), 1); nuc((mx0 + mx1) / 2, (my0 + my1) / 2, 5, 1.6, Math.atan2(my1 - my0, mx1 - mx0)); X.restore();
        const nx = P.x + P.w * .3;
        X.save(); X.globalAlpha *= al(3); X.beginPath(); X.moveTo(nx - 30, hy[1] + hy[2]); X.bezierCurveTo(nx + 30, hy[1], nx - 30, de[1] + de[2] * .5, nx, de[1] + 14); X.strokeStyle = tint(C.neur, .6); X.lineWidth = 3; X.stroke();
        ell(nx, de[1] + 12, 7, 11, 0, tint(C.neur, .5), rgba(C.neur, .95), 1.5); ell(nx, de[1] + 12, 3.5, 6, 0, null, rgba(C.neur, .8), 1); X.restore();
        if (act === 2 || act === 3 || act === 4) {
          if (act !== 3) pill('músculo eretor do pelo', Math.max(P.x + 4, mx1 - (NAR ? 150 : 170)), (my0 + my1) / 2 + (NAR ? 18 : 22), C.musc);
          if (act !== 2) pill('terminação nervosa', nx + 14, de[1] + 24, C.neur);
        }
      }
      X.restore();
      rr(P.x, P.y, P.w, P.h, 10, null, 'rgba(232,237,247,.25)', 1);
      // destaque do tecido escolhido
      if (act < 4) for (const [l, yy, h] of pos) if (l.k === act) { X.save(); X.shadowColor = TC[act]; X.shadowBlur = 10; X.strokeStyle = TC[act]; X.lineWidth = 2.5; X.strokeRect(P.x + 1.5, yy + 1.5, P.w - 3, h - 3); X.restore(); }
      // nomes das camadas
      const seen = {};
      for (const [l, yy, h] of pos) {
        if (l.k === -1) { tx(l.n, P.x + P.w / 2, yy + h / 2, { s: 12, c: C.dim, bg: false }); continue; }
        if (!l.n || (seen[l.k] && !pele)) continue; seen[l.k] = 1;
        pill(l.n, P.x + 8, yy + Math.min(h / 2, 16), TC[l.k], on(l.k) ? 1 : .55);
      }
      // lupa
      const lk = act < 4 ? act : Math.floor(t / 2.4) % 4;
      const src = pos.find(p => p[0].k === lk) || pos[0];
      lupa(L.x, L.y, L.r, (cx, cy, r) => lupaT(lk, cx, cy, r, t, pele), NAR ? null : P.x + P.w - 6, NAR ? null : src[1] + src[2] / 2);
      circ(L.x, L.y, L.r - 1, null, TC[lk], 2);
      // barra células e matriz
      const tgt = DENS[lk]; S.dd = S.dd == null ? tgt : lerp(S.dd, tgt, 1 - Math.exp(-(S.dt || .016) * 6));
      let bx, by, bw;
      if (NAR) { bx = L.x + L.r + 14; bw = A.x1 - bx; by = L.y - 4; tx('Na lupa: ' + NOMES[lk], bx, L.y - L.r + 10, { s: 13, w: 600, a: 'left', c: C.txt, bg: false }); }
      else { bx = L.x - L.r; bw = 2 * L.r; by = L.y + L.r + 52; tx('Na lupa: ' + NOMES[lk], L.x, L.y - L.r - 16, { s: 14, w: 600, c: C.txt, bg: false }); }
      tx('células', bx, by - 12, { s: 12, w: 600, a: 'left', c: TC[lk], bg: false }); tx('matriz', bx + bw, by - 12, { s: 12, w: 600, a: 'right', c: C.he_rosa, bg: false });
      rr(bx, by, bw, 14, 4, rgba(C.he_rosa, .45)); rr(bx, by, Math.max(6, bw * S.dd), 14, 4, TC[lk]);
      wrapTx('proporção ilustrativa', NAR ? bx : bx + bw / 2, by + 30, bw, { s: 12, c: C.dim, a: NAR ? 'left' : 'center' });
      cap(CAPV[act]);
    }
  });

  // =====================================================================================
  // EPITELIAL: revestimento
  // =====================================================================================
  const TIPOS = [
    { n: 'Simples pavimentoso', ex: 'alvéolos pulmonares, vasos (endotélio), cavidades', por: 'Camada fina de células achatadas: facilita trocas e difusão', f: 'simples pav.' },
    { n: 'Simples cúbico', ex: 'túbulos dos rins, folículos da tireoide', por: 'Uma camada de células cúbicas: secreção e absorção', f: 'simples cúbico' },
    { n: 'Simples prismático', ex: 'estômago e intestino', por: 'Células altas, com microvilosidades e células caliciformes (que fazem muco): absorção e secreção', f: 'simples prism.' },
    { n: 'Pseudoestratificado prismático ciliado', ex: 'traqueia e brônquios', por: 'Uma camada só, com núcleos em alturas diferentes: o muco prende partículas e os cílios as levam para a garganta', f: 'pseudoestrat.' },
    { n: 'Estratificado pavimentoso queratinizado', ex: 'epiderme', por: 'Várias camadas, as de cima mortas e cheias de queratina: proteção contra atrito e perda de água', f: 'estrat. queratin.' },
    { n: 'Estratificado pavimentoso não queratinizado', ex: 'boca, esôfago, vagina', por: 'Várias camadas, as de cima vivas e úmidas: proteção contra atrito', f: 'estrat. úmido' },
    { n: 'Epitélio de transição', ex: 'bexiga e ureteres', por: 'As células de cima mudam de forma: estica sem rasgar quando a bexiga enche', f: 'transição' }
  ];
  const ESP = [
    { t: 'Microvilosidades', id: 'mv', tipo: 2 },
    { t: 'Cílios', id: 'cil', tipo: 3 },
    { t: 'Queratina', id: 'ker', tipo: 4 },
    { t: 'Fumante', id: 'fum', tipo: 3 }
  ];
  const CTL_REV = { l: 'Tipo', min: 0, max: 6, step: 1, v: 0, f: v => TIPOS[Math.round(v)].f, rate: () => 1 };

  function simples(x0, x1, yb, cw, h, kind, a, o = {}) {
    const top = yb - h, an = {}; if (a <= .02) return an; X.save(); X.globalAlpha *= a; clipR(x0, top - 30, x1 - x0, h + 31);
    const f = tint(C.epit, .45); let i = 0;
    for (let x = x0; x < x1 - 1; x += cw, i++) {
      const ww = Math.min(cw, x1 - x), gob = o.calic && i % 5 === 2;
      rr(x, top, ww, h, Math.min(3, h / 3), f, rgba(C.epit, .9), 1);
      if (gob) { ell(x + ww / 2, top + h * .34, ww * .38, h * .28, 0, rgba(MU, .75), rgba(C.he_rosa, .8), 1); nuc(x + ww / 2, yb - h * .12, ww * .3, h * .06); if (!an.gob && x > x0 + (x1 - x0) * .3) an.gob = [x + ww / 2, top + h * .3]; }
      else if (kind === 'pav') nuc(x + ww / 2, yb - h * .5, ww * .26, h * .34);
      else if (kind === 'cub') nuc(x + ww / 2, yb - h * .5, ww * .22, ww * .22);
      else nuc(x + ww / 2, yb - h * .27, ww * .25, h * .12);
      if (o.mv && !gob) { for (let j = 0; j < 6; j++) line(x + ww * (j + .5) / 6, top, x + ww * (j + .5) / 6, top - o.mv, tint(C.epit, .65), 1.3); if (!an.mv && x > x0 + (x1 - x0) * .55) an.mv = [x + ww / 2, top - o.mv]; }
      if (i && h > 20) { line(x, top, x, top + 6, 'rgba(11,15,28,.9)', 3); circ(x, top + h * .45, 2, '#2a1a4a'); circ(x, top + h * .45 + 7, 2, '#2a1a4a'); if (!an.jun && x > x0 + (x1 - x0) * .12) an.jun = [x, top + 3]; }
    }
    X.restore(); return an;
  }
  function pseudo(x0, x1, yb, u, t, a, S, cil) {
    const h = 70 * u, cw = 15 * u, top = yb - h, an = {}; if (a <= .02) return an;
    X.save(); X.globalAlpha *= a; clipR(x0, top - 40 * u, x1 - x0, h + 40 * u + 1);
    const f = tint(C.epit, .45); let i = 0; const cL = 11 * u * cil;
    for (let x = x0; x < x1 - 1; x += cw, i++) {
      const gob = i % 4 === 1;
      rr(x, top, cw, h, 2, f, rgba(C.epit, .9), 1);
      if (gob) { ell(x + cw / 2, top + h * .28, cw * .4, h * .22, 0, rgba(MU, .75), rgba(C.he_rosa, .8), 1); nuc(x + cw / 2, top + h * .62, cw * .28, h * .07); if (!an.gob && x > x0 + (x1 - x0) * .35) an.gob = [x + cw / 2, top + h * .25]; }
      else nuc(x + cw / 2, yb - h * [.45, .62, .52][i % 3], cw * .27, h * .08);
      if (!gob && cL > .5) for (let j = 0; j < 5; j++) {
        const bx = x + cw * (j + .5) / 5, ang = -PI / 2 + .5 * Math.sin(t * 7 - bx * .04), ex = bx + Math.cos(ang) * cL, ey = top + Math.sin(ang) * cL;
        X.beginPath(); X.moveTo(bx, top); X.quadraticCurveTo(bx, top - cL * .5, ex, ey); X.strokeStyle = tint(C.epit, .3); X.lineWidth = 1.3; X.stroke();
        if (!an.cil && bx > x0 + (x1 - x0) * .7) an.cil = [bx, top - cL * .6];
      }
    }
    // células basais, baixas, entre as altas: os núcleos ficam em três alturas
    for (let x = x0 + cw; x < x1; x += cw * 2) { shape([[x - cw * .5, yb], [x + cw * .5, yb], [x + cw * .3, yb - h * .26], [x - cw * .3, yb - h * .26]], tint(C.epit, .55), rgba(C.epit, .9), 1); nuc(x, yb - h * .12, cw * .25, h * .06); }
    // muco com partículas, empurrado pelos cílios para um lado (o da garganta)
    const mb = top - cL - 1, mh = 8 * u * (1 + (1 - cil) * .7);
    rr(x0, mb - mh, x1 - x0, mh, 4, rgba(MU, .32), rgba(MU, .5), 1);
    S.mpos = (S.mpos || 0) + (S.dt || 0) * .05 * cil;
    const R = rng(13); for (let j = 0; j < 14; j++) circ(x0 + fr(R() + S.mpos) * (x1 - x0), mb - mh * (.25 + R() * .5), 1.8 + R() * 1.5, 'rgba(70,64,60,.85)');
    an.muco = [x0 + (x1 - x0) * .2, mb - mh / 2]; an.mb = mb - mh;
    X.restore(); return an;
  }
  function transicao(x0, x1, yb, u, s, a) {
    const an = {}; if (a <= .02) return an; X.save(); X.globalAlpha *= a;
    const rows = [[12, 16], [14, 20], [14, 22]], kh = 1 - .45 * s, kw = 1 + .6 * s; let y = yb;
    const tot = (12 + 14 + 14 + 20) * u * kh; clipR(x0, yb - tot - 10, x1 - x0, tot + 11);
    rows.forEach(([hh, cw], j) => {
      const rh = hh * u * kh, cwp = cw * u * kw, off = j * cwp * .4;
      for (let cx = x0 - off; cx < x1; cx += cwp) { rr(cx + .5, y - rh, cwp - 1, rh, 3, tint(C.epit, .45), rgba(C.epit, .85), 1); nuc(cx + cwp / 2, y - rh / 2, Math.min(cwp * .2, rh * .4), rh * .3); }
      y -= rh;
    });
    // células "em guarda-chuva", grandes e abauladas, que achatam quando a bexiga enche
    const rh = 20 * u * kh, cwp = 44 * u * kw; let i = 0;
    for (let cx = x0 - cwp * .3; cx < x1; cx += cwp, i++) {
      X.beginPath(); X.moveTo(cx, y); X.lineTo(cx, y - rh * .45); X.quadraticCurveTo(cx + cwp / 2, y - rh * 1.35, cx + cwp, y - rh * .45); X.lineTo(cx + cwp, y); X.closePath();
      X.fillStyle = tint(C.epit, .38); X.fill(); X.strokeStyle = rgba(C.epit, .9); X.lineWidth = 1; X.stroke();
      if (i % 3 === 1) { nuc(cx + cwp * .38, y - rh * .45, cwp * .1, rh * .2); nuc(cx + cwp * .62, y - rh * .45, cwp * .1, rh * .2); } else nuc(cx + cwp / 2, y - rh * .45, cwp * .12, rh * .22);
      if (!an.gc && cx > x0 + (x1 - x0) * .5) an.gc = [cx + cwp / 2, y - rh * .8];
    }
    X.restore(); return an;
  }

  def('epitelial', 'revestimento', {
    t: 'Epitélios de revestimento', s: 'camadas e formas', c: C.epit,
    ctl: CTL_REV, auto: S => S.esp ? 0 : .2, stillV: 3, still: 1,
    loc: 'Pele, mucosas e vasos',
    alt: 'Bloco de epitélio em corte sobre a membrana basal e o conjuntivo, com um capilar embaixo de onde nutrientes e oxigênio sobem por difusão; a faixa troca entre os sete tipos de epitélio de revestimento, e botões mostram microvilosidades, cílios levando o muco, queratina descamando e a traqueia do fumante perdendo os cílios',
    extra: ESP.map(e => ({
      t: e.t,
      on(S) { if (S.esp === e.id) S.esp = null; else { S.esp = e.id; S.v = e.tipo; S.t0 = S.ph; syncCtl({ ctl: CTL_REV }, S); } S.touch = performance.now(); },
      pressed: S => S.esp === e.id
    })),
    d: `<p>Os epitélios de revestimento cobrem o corpo por fora e forram as cavidades e os tubos por dentro. As células ficam unidas por <b>junções</b> (as de oclusão vedam a passagem entre elas; os desmossomos as prendem como rebites) e se apoiam numa camada fina, a <b>membrana basal</b>, que as separa do conjuntivo. O epitélio <b>não tem vasos sanguíneos</b>: recebe nutrientes e O₂ por difusão a partir do conjuntivo. Por estar exposto, ele se renova muito: o revestimento do intestino é trocado a cada poucos dias, e a epiderme, a cada mês, mais ou menos.</p>
<p>A classificação usa dois critérios. Pelo <b>número de camadas</b>: <b>simples</b> (uma camada, para trocas e absorção), <b>estratificado</b> (várias camadas, para proteção) ou <b>pseudoestratificado</b> (uma camada só, mas com núcleos em alturas diferentes, que parece ter várias). Pela <b>forma das células da superfície</b>: <b>pavimentoso</b> (achatadas), <b>cúbico</b> ou <b>prismático</b> (altas, também chamadas cilíndricas). Há ainda o <b>epitélio de transição</b>, da bexiga, cujas células mudam de forma quando a bexiga enche e esvazia. As células podem ter especializações: <b>microvilosidades</b> no intestino (aumentam a área de absorção), <b>cílios</b> na traqueia (varrem o muco) e <b>queratina</b> na epiderme (impermeabiliza).</p>
<div class="tab"><table>
<thead><tr><th>Tipo</th><th>Onde</th><th>Por quê</th></tr></thead>
<tbody>
<tr><th>Simples pavimentoso</th><td>alvéolos pulmonares; endotélio dos vasos; revestimento das cavidades (mesotélio)</td><td>camada fina: facilita trocas e difusão</td></tr>
<tr><th>Simples cúbico</th><td>túbulos dos rins; folículos da tireoide</td><td>secreção e absorção</td></tr>
<tr><th>Simples prismático</th><td>estômago; intestino (com microvilosidades e células caliciformes, que fazem muco)</td><td>absorção e secreção</td></tr>
<tr><th>Pseudoestratificado prismático ciliado</th><td>traqueia e brônquios (com células caliciformes)</td><td>o muco prende partículas e os cílios as levam para a garganta</td></tr>
<tr><th>Estratificado pavimentoso queratinizado</th><td>epiderme</td><td>proteção contra atrito e perda de água</td></tr>
<tr><th>Estratificado pavimentoso não queratinizado</th><td>boca, esôfago, vagina</td><td>proteção contra atrito, superfície úmida</td></tr>
<tr><th>De transição</th><td>bexiga e ureteres</td><td>estica sem rasgar</td></tr>
</tbody></table></div>`,
    enem: 'Relacione a <b>forma com a função</b>: epitélio <b>fino</b> (simples pavimentoso) onde há <b>trocas</b> (alvéolos, capilares); epitélio com <b>várias camadas</b> onde há <b>atrito</b> (pele, boca, esôfago); <b>microvilosidades</b> onde há <b>absorção</b> (intestino); <b>cílios e muco</b> onde é preciso <b>limpar</b> (vias respiratórias). O cigarro paralisa e destrói os cílios da traqueia, e por isso o fumante tosse para expulsar o muco.',
    links: [LK.juncoes, ['Os quatro tecidos', '#tecidos/visao']],
    draw(t, S) {
      const A = area(), ti = Math.round(S.v), T = TIPOS[ti], o = this;
      if (S.esp && ESP.find(e => e.id === S.esp).tipo !== ti) { S.esp = null; syncExtra(o, S); }
      const x0 = A.x0, x1 = A.x1, w = A.w;
      const yb = A.y0 + A.h * (NAR ? .66 : .64), ys = A.y0 + 46, u = (yb - ys - (NAR ? 30 : 36)) / 90;
      // título e exemplo
      title(T.n, A.cx, A.y0 + 10, w - 8, C.epit);
      tx(S.esp === 'fum' ? 'traqueia de um fumante' : 'exemplo: ' + T.ex, A.cx, A.y0 + 30, { s: 13, c: C.dim, bg: false });
      // conjuntivo com capilares e difusão
      const cy0 = yb + 2, ch = A.y1 - cy0, cr = Math.min(16, ch * .2), cyy = cy0 + ch * .58;
      const caps = (NAR ? [.28, .74] : [.18, .5, .82]).map(f => [x0 + w * f, cyy, cr]);
      conjR(x0, cy0, w, ch, 1, { seed: 6, cap: caps, t });
      for (const [cx] of caps) for (let j = 0; j < 4; j++) { const p = fr(t * .35 + j / 4), xx = cx + (j - 1.5) * cr * .7; circ(xx, lerp(cyy - cr - 2, yb - 10, p), 2.2, rgba('#FFFFFF', .85 * (1 - p * .7))); }
      // o epitélio do tipo escolhido
      let an = {}, top = yb, fum = S.esp === 'fum' ? cl((t - (S.t0 || 0)) / 9, 0, 1) : 0;
      if (ti === 0) { an = simples(x0, x1, yb, 46 * u, 8 * u, 'pav', 1); top = yb - 8 * u; }
      else if (ti === 1) { an = simples(x0, x1, yb, 26 * u, 26 * u, 'cub', 1); top = yb - 26 * u; }
      else if (ti === 2) { const mv = S.esp === 'mv' ? 6 * u : 2 * u; an = simples(x0, x1, yb, 17 * u, 58 * u, 'pri', 1, { calic: true, mv }); top = yb - 58 * u - mv; }
      else if (ti === 3) {
        const cil = 1 - seg(fum, .05, .45), q = seg(fum, .5, .9);
        an = pseudo(x0, x1, yb, u, t, 1 - q, S, cil); top = an.mb != null ? an.mb : yb - 70 * u;
        if (q > 0) { estrat(x0, yb, w, 66 * u, q); top = Math.min(top, yb - 66 * u); }
        if (S.esp === 'fum' && fum < .95) { const R = rng(17); for (let j = 0; j < 18; j++) circ(x0 + fr(R() + t * .02) * w, ys + 6 + fr(R() + t * .1) * Math.max(10, top - ys - 16), 2 + R() * 2, 'rgba(160,160,160,.45)'); }
      }
      else if (ti === 4) {
        top = estrat(x0, yb, w, 84 * u, 1, { ker: true });
        // descamação: lâminas de queratina soltando do alto
        const n = S.esp === 'ker' ? 7 : 4;
        for (let j = 0; j < n; j++) { const p = fr(t * .12 + j / n), fx = x0 + w * ((j * .29 + .08) % 1); X.save(); clipR(x0, A.y0 + 44, w, top - A.y0 - 40); X.globalAlpha = 1 - p; X.translate(fx, top - 3 - p * 18 * u); X.rotate((j % 2 ? 1 : -1) * p * .5); rr(-8 * u, -1.2 * u, 16 * u, 2.4 * u, 2, '#EBD3DC'); X.restore(); }
        an.ker = [x0 + w * .62, top + 4 * u];
      }
      else if (ti === 5) { top = estrat(x0, yb, w, 76 * u, 1); line(x0, top - 1, x1, top - 1, rgba(MU, .7), 2.5); an.umid = [x0 + w * .6, top - 1]; }
      else { const s = .5 + .5 * Math.sin(t * .7); an = transicao(x0, x1, yb, u, s, 1); top = yb - 60 * u * (1 - .45 * s); S.cheia = s; S.enche = Math.cos(t * .7) > 0; }
      line(x0, yb, x1, yb, '#F6C9DA', 2.5);
      if (ti !== 3 && ti !== 2 && ti !== 4 && top - ys > 30) tx('superfície livre', A.cx, (ys + top) / 2 + 6, { s: 12, c: C.dim, bg: false });
      // rótulos: primeiro o que é próprio do tipo (nunca acima do título)
      const yL = y => Math.max(y, A.y0 + 56);
      if (an.mv) lab(an.mv[0], an.mv[1], an.mv[0] + 50, yL(an.mv[1] - 26 * u), 'microvilosidades');
      if (an.cil) lab(an.cil[0], an.cil[1], an.cil[0] - 30, yL(an.cil[1] - 30 * u), 'cílios');
      if (an.muco && fum < .5) lab(an.muco[0], an.muco[1], an.muco[0] + 30, yL(an.muco[1] - 24 * u), 'muco com partículas');
      if (an.gob) lab(an.gob[0], an.gob[1], an.gob[0] - 40, an.gob[1] + 30 * u, 'célula caliciforme');
      if (an.ker) lab(an.ker[0], an.ker[1], an.ker[0] + 30, yL(an.ker[1] - 30 * u), 'células mortas com queratina');
      if (an.umid) lab(an.umid[0], an.umid[1], an.umid[0] + 30, yL(an.umid[1] - 20 * u), 'superfície úmida');
      if (an.gc) lab(an.gc[0], an.gc[1], an.gc[0] + 30, yL(an.gc[1] - 26 * u), 'células em guarda-chuva');
      if (an.jun && !NAR) lab(an.jun[0], an.jun[1], an.jun[0] - 30, yL(an.jun[1] - 26 * u), 'junções');
      lab(x0 + w * .08, yb, x0 + w * .04, yb + 22, 'membrana basal');
      lab(caps[caps.length - 1][0], cyy + cr, caps[caps.length - 1][0] - 24, cyy + cr + 22, 'capilar');
      if (!NAR) lab(caps[1][0] + cr * .5, yb + (cyy - cr - yb) * .5, caps[1][0] + 50, yb + 26, 'nutrientes e O₂ por difusão');
      if (!NAR) lab(x0 + w * .3, cyy + cr + 14, x0 + w * .36, A.y1 - 12, 'conjuntivo (sem vasos acima da membrana)');
      // legenda
      if (S.esp === 'fum') cap(fum < .48 ? 'A fumaça paralisa e destrói os <b>cílios</b>: o muco para de andar e o fumante <b>tosse</b> para expulsá-lo' : '<b>Agressão contínua:</b> o epitélio vira estratificado, que protege, mas não limpa');
      else if (S.esp === 'mv') cap('<b>Microvilosidades:</b> dobras da membrana que aumentam muito a área de absorção do intestino');
      else if (S.esp === 'cil') cap('<b>Cílios:</b> batem juntos e levam o muco, com as partículas presas, para a garganta');
      else if (S.esp === 'ker') cap('<b>Queratina:</b> as células de cima morrem cheias de queratina, impermeabilizam a pele e descamam');
      else if (ti === 6) cap(`<b>Bexiga ${S.enche ? 'enchendo' : 'esvaziando'}:</b> as células de cima ${S.enche ? 'se achatam' : 'voltam a ficar altas'}, e o epitélio estica sem rasgar`);
      else cap(T.por);
    }
  });

  // =====================================================================================
  // EPITELIAL: glandular
  // =====================================================================================
  const MODO = ['mantida', 'mista', 'desfeita'];
  const TITG = ['Glândula exócrina: tem ducto', 'Glândula mista: o pâncreas', 'Glândula endócrina: sem ducto'];
  // tubo revestido de células (ducto), de (x1, y1) a (x2, y2); dw = largura da luz, cs = altura das células; cheio = cordão maciço
  function tubo(x1, y1, x2, y2, dw, cs, a, cheio) {
    if (a <= .02) return; const L = Math.hypot(x2 - x1, y2 - y1); if (L < 1) return;
    X.save(); X.globalAlpha *= a; X.translate(x1, y1); X.rotate(Math.atan2(y2 - y1, x2 - x1));
    const f = tint(C.epit, .45);
    rr(0, -dw / 2, L, dw, 2, cheio ? f : LUZ);
    for (const side of [-1, 1]) for (let d = 0; d < L; d += cs) { const yy = side < 0 ? -dw / 2 - cs : dw / 2; rr(d, yy, Math.min(cs, L - d), cs, 2, f, rgba(C.epit, .85), 1); nuc(d + cs / 2, yy + cs / 2, cs * .22, cs * .22); }
    if (cheio) for (let d = 0; d < L; d += cs) for (let k = -dw / 2; k < dw / 2 - 1; k += cs) { rr(d, k, Math.min(cs, L - d), Math.min(cs, dw / 2 - k), 2, f, rgba(C.epit, .7), 1); }
    X.restore();
  }
  // porção secretora em ácino: células em cunha ao redor de uma luz pequena
  function acino(x, y, ra, a, abre, palido) {
    if (a <= .02) return; X.save(); X.globalAlpha *= a; const n = 10, rl = ra * .28 * abre;
    const f = tint(C.epit, palido ? .2 : .5);
    for (let i = 0; i < n; i++) {
      const a0 = i / n * TAU, a1 = (i + 1) / n * TAU, am = (a0 + a1) / 2;
      X.beginPath(); X.arc(x, y, ra, a0, a1); X.arc(x, y, Math.max(.5, rl), a1, a0, true); X.closePath(); X.fillStyle = f; X.fill(); X.strokeStyle = rgba(C.epit, .85); X.lineWidth = 1; X.stroke();
      nuc(x + Math.cos(am) * ra * .74, y + Math.sin(am) * ra * .74, ra * .11, ra * .09, am);
      if (!palido) for (let k = 0; k < 3; k++) circ(x + Math.cos(am + (k - 1) * .12) * ra * (.42 + k * .04), y + Math.sin(am + (k - 1) * .12) * ra * (.42 + k * .04), Math.max(1.2, ra * .035), rgba(SECR, .9));
    }
    if (rl > 1) circ(x, y, rl, LUZ);
    X.restore();
  }
  // cordões de células endócrinas com capilares entre eles; devolve os capilares [x0, y, w, h]
  function cordoes(x, y, ra, a, t, palido) {
    const tubes = [[x - ra * 1.7, y - ra * .5, ra * 3.4, ra * .26], [x - ra * 1.7, y + ra * .5, ra * 3.4, ra * .26]];
    if (a <= .02) return tubes; X.save(); X.globalAlpha *= a;
    const f = tint(C.epit, palido ? .2 : .45), cw = ra * .38;
    for (const [ry, wf] of [[-ra * .95, .7], [0, 1], [ra * .95, .7]]) {
      const half = ra * 1.25 * wf;
      for (let cx = x - half; cx < x + half - 2; cx += cw) { rr(cx, y + ry - ra * .3, cw - 1, ra * .6, 3, f, rgba(C.epit, .85), 1); nuc(cx + cw / 2, y + ry, cw * .24, cw * .24); }
    }
    for (const [tx0, ty, tw0, th] of tubes) {
      rr(tx0, ty - th / 2, tw0, th, th / 2, rgba(C.sangue, .28), tint(C.he_rosa, .2), 1.5);
      for (let j = 0; j < 5; j++) ell(tx0 + fr(t * .12 + j / 5) * tw0, ty, th * .34, th * .26, 0, C.hemacia, 'rgba(11,15,28,.4)', 1);
    }
    X.restore(); return tubes;
  }
  // pontos de hormônio saindo das células e indo embora pelo capilar
  function hormonio(tubes, y, a, t) {
    if (a <= .02) return; X.save(); X.globalAlpha *= a;
    tubes.forEach(([tx0, ty, tw0], k) => { for (let j = 0; j < 6; j++) { const p = fr(t * .22 + j / 6 + k * .5), sx = tx0 + tw0 * (.3 + .4 * ((j * .37) % 1)); const xx = p < .3 ? sx : lerp(sx, tx0 + tw0 - 6, (p - .3) / .7), yy = p < .3 ? lerp(y + (ty - y) * .3, ty, p / .3) : ty; circ(xx, yy, 3, SECR, 'rgba(11,15,28,.5)', 1); } });
    X.restore();
  }
  function superficie(x0, x1, y, eh, gaps, a = 1) {
    X.save(); X.globalAlpha *= a; const cw = eh * .95, f = tint(C.epit, .45);
    for (let x = x0; x < x1; x += cw) { const c = x + cw / 2; if (gaps.some(([gx, gw]) => Math.abs(c - gx) < gw / 2)) continue; rr(x, y, Math.min(cw, x1 - x), eh, 2, f, rgba(C.epit, .85), 1); nuc(c, y + eh * .55, cw * .22, eh * .2); }
    X.restore();
  }

  // três modos de secreção numa célula
  function modos(A, t) {
    const n = 3, cwc = A.w / n, ty = A.y0 + (NAR ? 8 : 20), top0 = ty + (NAR ? 62 : 56), yb = A.y0 + A.h * (NAR ? .7 : .78);
    const M = [
      { n: 'Merócrina', ex: 'salivares e sudoríparas comuns', d: 'a secreção sai por exocitose e a célula fica inteira' },
      { n: 'Apócrina', ex: 'glândula mamária (gordura do leite)', d: 'a ponta da célula sai junto com a secreção' },
      { n: 'Holócrina', ex: 'glândula sebácea', d: 'a célula inteira se desfaz e vira a secreção' }
    ];
    M.forEach((m, i) => {
      const cx = A.x0 + cwc * (i + .5), cw = Math.min(cwc * (NAR ? .4 : .46), 92), ch = Math.min(yb - top0 - (NAR ? 20 : 40), cw * (NAR ? 3.4 : 2.6)), top = yb - ch, f = tint(C.epit, .45);
      tx(m.n, cx, ty, { f: FH, s: NAR ? 14 : 16, w: 600, c: C.epit });
      wrapTx(m.ex, cx, ty + 20, cwc - 10, { s: 12, c: C.dim, lh: 15 });
      line(cx - cwc * .45, yb, cx + cwc * .45, yb, '#F6C9DA', 2.5);
      // vizinhas, esmaecidas
      for (const sd of [-1, 1]) { X.save(); clipR(cx - cwc / 2 + 4, top - 4, cwc - 8, ch + 8); X.globalAlpha = .35; rr(cx + sd * cw - cw / 2 + sd * 2, top, cw, ch, 6, f, rgba(C.epit, .8), 1); nuc(cx + sd * (cw + 2), yb - ch * .2, cw * .2, cw * .17); X.restore(); }
      if (i === 0) {
        rr(cx - cw / 2, top, cw, ch, 6, f, rgba(C.epit, .95), 1.5); nuc(cx, yb - ch * .2, cw * .22, cw * .19);
        for (let k = 0; k < 3; k++) X.beginPath(), X.arc(cx, yb - ch * .38 - k * 4, cw * (.22 - k * .03), PI * 1.15, PI * 1.85), X.strokeStyle = rgba(C.he_rosa, .9), X.lineWidth = 1.5, X.stroke();
        for (let j = 0; j < 4; j++) {
          const p = fr(t * .3 + j / 4), vx = cx + (j - 1.5) * cw * .18;
          if (p < .75) circ(vx, lerp(yb - ch * .45, top + 5, p / .75), cw * .07, SECR, 'rgba(11,15,28,.4)', 1);
          else { const q = (p - .75) / .25; X.save(); X.globalAlpha = 1 - q; circ(vx, top - q * 34, cw * .06, SECR); X.restore(); }
        }
      } else if (i === 1) {
        const k = fr(t / 4.5), rd = cw * .3 * seg(k, 0, .4), lost = seg(k, .7, .75) * (1 - seg(k, .8, 1)), ct = top + ch * .1 * lost;
        rr(cx - cw / 2, ct, cw, yb - ct, 6, f, rgba(C.epit, .95), 1.5); nuc(cx, yb - ch * .2, cw * .22, cw * .19);
        if (k < .72) {
          const bu = seg(k, .4, .7), by = lerp(top + ch * .2, top - cw * .2, bu), br = lerp(rd, cw * .36, bu);
          if (bu > 0) { X.beginPath(); X.moveTo(cx - cw * (.42 - .2 * bu), top + 2); X.quadraticCurveTo(cx - br * 1.1, by, cx, by - br - 2); X.quadraticCurveTo(cx + br * 1.1, by, cx + cw * (.42 - .2 * bu), top + 2); X.closePath(); X.fillStyle = f; X.fill(); X.strokeStyle = rgba(C.epit, .95); X.lineWidth = 1.5; X.stroke(); }
          circ(cx, by, Math.max(.5, rd * (1 + .1 * bu)), SECR, 'rgba(11,15,28,.3)', 1);
        } else {
          const q = seg(k, .72, 1), by = top - cw * .4 - q * 50; X.save(); X.globalAlpha = 1 - seg(k, .88, 1);
          circ(cx, by, cw * .38, f, rgba(C.epit, .95), 1.5); circ(cx, by, cw * .3, SECR, 'rgba(11,15,28,.3)', 1); X.restore();
        }
      } else {
        const k = fr(t / 5.5), R = rng(31), nd = Math.floor(22 * seg(k, 0, .5));
        if (k < .56) {
          rr(cx - cw / 2, top, cw, ch, 6, f, rgba(C.epit, .95), 1.5);
          for (let j = 0; j < 22; j++) { const dx = cx + (R() - .5) * cw * .75, dy = top + 8 + R() * (ch * .7), dr = cw * (.06 + R() * .05); if (j < nd) circ(dx, dy, dr, rgba(SECR, .85)); }
          const sh = 1 - .6 * seg(k, .25, .5); nuc(cx, yb - ch * .2, cw * .22 * sh, cw * .19 * sh, 0, { c: sh < .7 ? '#4B2F96' : undefined });
        } else {
          const q = seg(k, .56, .92);
          X.save(); X.globalAlpha = 1 - q; for (let j = 0; j < 14; j++) { const dx = cx + (R() - .5) * cw, dy = top + R() * ch - q * (40 + R() * 40); j % 2 ? circ(dx, dy, cw * .09, SECR) : rr(dx - 5, dy - 3, 10, 6, 2, f); } X.restore();
          const nh = ch * seg(k, .6, 1); if (nh > 4) { rr(cx - cw / 2, yb - nh, cw, nh, 6, f, rgba(C.epit, .95), 1.5); nuc(cx, yb - Math.min(nh * .5, ch * .2), cw * .22, Math.min(cw * .19, nh * .3)); }
        }
      }
      wrapTx(m.d, cx, yb + 18, cwc - 12, { s: NAR ? 12 : 14, c: C.txt, w: 600, lh: NAR ? 16 : 18 });
    });
  }

  const CTL_GL = { l: 'Ligação com a superfície', min: 0, max: 2, step: 1, v: 0, f: v => MODO[Math.round(v)], rate: () => 1 };
  def('epitelial', 'glandular', {
    t: 'Epitélios glandulares', s: 'exócrinas, endócrinas e mistas', c: C.epit,
    ctl: CTL_GL, // na endócrina, espera a animação terminar (cerca de 11 s) antes de voltar ao começo
    auto: S => { if (S.modos) return 0; if (Math.round(S.v) !== 2) return .085; return S.ph - (S.tm || 0) < 11 ? (S.v < 2 ? .045 : 0) : .2; }, stillV: 1, still: 7,
    loc: 'Glândulas do corpo',
    alt: 'Faixa de epitélio de revestimento em que células brotam para dentro do conjuntivo: com o ducto mantido, forma-se uma glândula exócrina que lança gotas de secreção na superfície; com o ducto desfeito, forma-se uma glândula endócrina, com cordões de células junto a capilares e hormônio entrando no sangue; no meio, o pâncreas, com ácinos e ducto e uma ilhota com capilar; um botão mostra os modos de secreção merócrino, apócrino e holócrino',
    extra: [{ t: 'Modos de secreção', on: S => { S.modos = !S.modos; S.touch = performance.now(); }, pressed: S => !!S.modos }],
    d: `<p>As <b>glândulas</b> são feitas de epitélio especializado em <b>secreção</b>. Elas se formam quando células de um epitélio de revestimento se multiplicam e afundam no conjuntivo. Se a ligação com a superfície continua, como um tubo, a glândula é <b>exócrina</b>: lança a secreção por um <b>ducto</b> numa cavidade ou para fora do corpo (sudoríparas, sebáceas, salivares, mamárias). Se a ligação some, a glândula é <b>endócrina</b>: não tem ducto, e a secreção, o <b>hormônio</b>, vai direto para o sangue (tireoide, hipófise, adrenais). Algumas glândulas são <b>mistas</b>: o <b>pâncreas</b> lança suco digestivo no intestino (parte exócrina) e produz insulina e glucagon nas <b>ilhotas pancreáticas</b>, que vão para o sangue (parte endócrina). Testículos e ovários também são mistos: liberam gametas e produzem hormônios.</p>
<p>As exócrinas também se distinguem pela maneira de liberar a secreção. Na <b>merócrina</b>, a secreção sai por exocitose e a célula fica inteira (salivares, sudoríparas comuns). Na <b>apócrina</b>, a célula perde a ponta junto com a secreção (glândula mamária, na parte gordurosa do leite). Na <b>holócrina</b>, a célula inteira se desfaz e vira a secreção (glândula sebácea).</p>
<div class="tab"><table>
<thead><tr><th></th><th>Exócrina</th><th>Endócrina</th><th>Mista</th></tr></thead>
<tbody>
<tr><th>Ducto</th><td>tem</td><td>não tem</td><td>tem, na parte exócrina</td></tr>
<tr><th>Para onde vai a secreção</th><td>cavidade ou fora do corpo</td><td>sangue (hormônio)</td><td>os dois</td></tr>
<tr><th>Exemplos</th><td>sudoríparas, sebáceas, salivares, mamárias</td><td>tireoide, hipófise, adrenais</td><td>pâncreas, testículos, ovários</td></tr>
</tbody></table></div>`,
    enem: '<b>Exócrina tem ducto</b> e secreta para fora ou numa cavidade; <b>endócrina não tem ducto</b> e secreta <b>hormônios no sangue</b>. O <b>pâncreas é misto</b>: suco pancreático (exócrino) e insulina e glucagon (endócrino). Essa ideia aparece nas questões sobre diabetes: o problema está na parte <b>endócrina</b> do pâncreas.',
    links: [['Epitélios de revestimento', '#epitelial/revestimento'], ['Os quatro tecidos', '#tecidos/visao']],
    draw(t, S) {
      const A = area();
      if (S.modos) { modos(A, t); cap('<b>Modos de secreção</b> das glândulas exócrinas: merócrina, apócrina e holócrina'); return; }
      const m = Math.round(S.v); if (S.m !== m) { S.m = m; S.tm = t; }
      // pausado (ou movimento reduzido): mostra a animação já terminada, e ela continua terminada ao reproduzir
      if (S.paused) S.tm = Math.min(S.tm, t - 99);
      const el = t - (S.tm || 0), x0 = A.x0, x1 = A.x1, w = A.w;
      title(TITG[m], A.cx, A.y0 + 10, w - 8, C.epit);
      const eh = NAR ? 24 : 26, ys = A.y0 + 46, yc = ys + eh, D = A.y1 - yc;
      tx(m === 1 ? 'luz do intestino (duodeno)' : 'superfície (pele ou cavidade)', A.cx, ys - 10, { s: 12, c: C.dim, bg: false });
      conjR(x0, yc, w, D, 1, { seed: 12, n: .8 });
      const ra = Math.min(D * .24, NAR ? w * .17 : w * .085), gy = yc + D * .58, g = ss(seg(el, 0, 3.2)), abre = seg(el, 3.2, 3.9);
      const dw = ra * .42, cs = ra * .3;
      if (m === 0 || m === 2) {
        const gxs = NAR ? [A.cx] : [x0 + w * .3, x0 + w * .7], q = m === 2 ? seg(el, 4.2, 6.2) : 0;
        const ductA = 1 - q, gap = (dw + 2 * cs) * Math.min(1, g * 3) * ductA;
        superficie(x0, x1, ys, eh, gxs.map(gx => [gx, gap * .7]));
        gxs.forEach((gx, gi) => {
          const len = (gy - ra * .8 - yc) * Math.min(1, g / .7), bud = seg(g, .7, 1);
          tubo(gx, yc - eh * .5, gx, yc + len, dw, cs, ductA, abre < .5);
          if (bud > 0) acino(gx, gy, ra * bud, 1 - q, abre, false);
          const tubes = cordoes(gx, gy, ra, q, t, false);
          if (m === 0 && abre >= 1) for (let j = 0; j < 6; j++) {
            const p = fr(t * .22 + j / 6 + gi * .3), pts = [[gx, gy], [gx, yc], [gx, ys - 4], [gx + (j % 2 ? 1 : -1) * (14 + j * 3), ys - 24]], [px, py] = pth(pts, p);
            X.save(); X.globalAlpha = 1 - seg(p, .85, 1); circ(px, py, 3.2, SECR, 'rgba(11,15,28,.5)', 1); X.restore();
          }
          if (m === 2 && q >= 1) hormonio(tubes, gy, 1, t);
          if (gi === gxs.length - 1) {
            if (m === 0 && g >= 1) { lab(gx + dw / 2 + cs, (yc + gy - ra) / 2, gx + ra * 1.6, (yc + gy - ra) / 2 - 10, 'ducto'); lab(gx + ra * .9, gy + ra * .3, gx + ra * 1.7, gy + ra * .9, 'porção secretora'); lab(gx + 16, ys - 16, gx + 60, ys - 22, 'secreção'); }
            if (m === 2 && q >= 1) { lab(gx + ra * .6, gy - ra * .95, gx + ra * 1.9, gy - ra * 1.6, 'cordões de células'); lab(gx + ra * 1.5, tubes[1][1], gx + ra * 1.9, tubes[1][1] + ra * .9, 'capilar'); lab(gx + ra * 1.2, tubes[0][1], gx + ra * 1.9, tubes[0][1] - ra * .3, 'hormônio no sangue'); }
          }
        });
        if (m === 0) cap(g < 1 ? 'Células do epitélio se multiplicam e <b>afundam</b> no conjuntivo' : '<b>Exócrina:</b> a ligação com a superfície vira um <b>ducto</b>, que leva a secreção para fora');
        else cap(q < .05 ? 'Células do epitélio se multiplicam e <b>afundam</b> no conjuntivo' : q < 1 ? 'A <b>ligação com a superfície some</b>: a glândula fica sem ducto' : '<b>Endócrina:</b> sem ducto, o <b>hormônio</b> vai direto para o sangue dos capilares');
      } else {
        // pâncreas: ácinos com ducto que desemboca no intestino, e uma ilhota com capilares
        const fa = seg(el, 0, 1.2), mx = x0 + w * (NAR ? .27 : .3), jy = yc + D * .3, ra2 = ra * (NAR ? .7 : .92);
        const ac = [[mx - ra2 * 1.25, gy], [mx + ra2 * 1.25, gy]];
        superficie(x0, x1, ys, eh, [[mx, (dw + 2 * cs) * .7]]);
        tubo(mx, yc - eh * .5, mx, jy, dw, cs, fa);
        for (const [ax, ay] of ac) { const d = Math.hypot(ax - mx, ay - jy), k = (d - ra2 * .9) / d; tubo(mx, jy, mx + (ax - mx) * k, jy + (ay - jy) * k, dw * .8, cs * .9, fa); }
        for (const [ax, ay] of ac) acino(ax, ay, ra2, fa, 1, false);
        X.save(); X.globalAlpha *= fa; circ(mx, jy, dw * .5 + cs, tint(C.epit, .45)); circ(mx, jy, dw * .5, LUZ); X.restore();
        const ix = x0 + w * (NAR ? .79 : .72), iy = yc + D * .5, ri = ra * (NAR ? .52 : 1);
        circ(ix, iy, ri * 1.75, rgba(C.he_rosa, .12 * fa), rgba(C.epit, .5 * fa), 1.5);
        const tubes = cordoes(ix, iy, ri, fa, t, true);
        if (fa >= 1) {
          for (let j = 0; j < 8; j++) {
            const ax = ac[j % 2][0], ay = ac[j % 2][1], p = fr(t * .2 + j / 8), d = Math.hypot(ax - mx, ay - jy), k = (d - ra2 * .9) / d;
            const [px, py] = pth([[ax, ay], [mx + (ax - mx) * k, jy + (ay - jy) * k], [mx, jy], [mx, yc], [mx, ys - 4], [mx + (j % 2 ? 1 : -1) * 20, ys - 22]], p);
            X.save(); X.globalAlpha = 1 - seg(p, .88, 1); circ(px, py, 3, SECR, 'rgba(11,15,28,.5)', 1); X.restore();
          }
          hormonio(tubes, iy, 1, t);
          lab(ac[0][0] - ra2 * .5, ac[0][1] + ra2 * .7, ac[0][0] - ra2 * .2, ac[0][1] + ra2 * 1.5, 'ácinos (suco pancreático)');
          lab(mx + dw / 2 + cs, (yc + jy) / 2, mx + ra2 * 1.4, (yc + jy) / 2 - 6, 'ducto pancreático');
          lab(ix - ri * 1.2, iy - ri * 1.25, ix - ri * 1.6, iy - ri * 2.1, 'ilhota pancreática');
          lab(ix + ri * 1.5, tubes[1][1], ix + ri * .6, tubes[1][1] + ri * 1.2, 'insulina e glucagon no sangue');
        }
        cap('<b>Pâncreas, glândula mista:</b> os ácinos lançam suco pancreático no intestino pelo ducto; as ilhotas lançam insulina e glucagon no sangue');
      }
    }
  });
}
