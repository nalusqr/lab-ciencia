/* LAB, módulo Histologia. Cenas B: tecido conjuntivo (propriamente dito, adiposo, cartilagem, osso e ossificação).
   Texto: roteiro do Taxon (docs/revisao-biologia/histologia-roteiro.md, C1 a C5). Código e desenhos da equipe (Apolo).

   Visual HE do módulo (direção de arte, Apolo), para as outras cenas seguirem:
   - fundo do corte: matriz em rosa-eosina escurecido (MAT abaixo), nunca rosa claro chapado, para o texto claro continuar legível;
   - núcleos sempre com nuc() do motor (roxo-azulado, cromatina em pontos); citoplasma em rosa claro translúcido;
   - fibras colágenas: faixas grossas rosa-forte (C.colag) com um fio claro no meio; elásticas: fios finos, ondulados e
     ramificados em amarelo (C.elast, as "fibras amarelas");
   - cartilagem: matriz azul-lilás (basófila, C.cart) com lacunas claras; osso: matriz rosa-bege (C.osso puxado para o rosa),
     em lamelas concêntricas em volta do canal de Havers, osteócitos como amêndoas escuras ligadas por canalículos;
   - cor de destaque do tecido conjuntivo: âmbar (C.conj), usada nas setas de ação e na faixa de cada tópico. */
'use strict';
{
  const INK = 'rgba(11,15,28,.6)', BG = '#0B0F1C', AMB = C.conj;
  const pcol = c => { if (c[0] === '#') return hx(c); const m = c.match(/[\d.]+/g) || [0, 0, 0]; return [+m[0], +m[1], +m[2]]; };
  const mix = (a, b, t) => { const A = pcol(a), B = pcol(b); t = cl(t, 0, 1); return `rgb(${A[0] + (B[0] - A[0]) * t | 0},${A[1] + (B[1] - A[1]) * t | 0},${A[2] + (B[2] - A[2]) * t | 0})`; };
  const mixA = (a, b, t, al) => { const m = mix(a, b, t).match(/\d+/g); return `rgba(${m[0]},${m[1]},${m[2]},${al})`; };
  const MAT = mix(C.he_rosa, BG, .66);                     // fundo do corte (substância fundamental)
  const CIT = 'rgba(244,206,222,.62)';                     // citoplasma eosinófilo claro
  const OSSO = mix(C.osso, C.he_rosa, .38);                // matriz óssea no HE: rosa-bege
  const MITO = '#C9773A', CALOR = '#FF9A3C', BACT = '#7FCB7A', ANTI = '#F5E6A8';

  // ---------- ajudantes de desenho ----------
  function wpts(x, y, ang, len, amp, per, ph, n) {
    const ca = Math.cos(ang), sa = Math.sin(ang), P = []; n = n || Math.max(8, Math.round(len / 3));
    for (let i = 0; i <= n; i++) { const s = (i / n - .5) * len, o = amp * Math.sin(s / per * TAU + ph); P.push([x + ca * s - sa * o, y + sa * s + ca * o]); }
    return P;
  }
  function strokeP(P, c, lw) { if (P.length < 2) return; X.beginPath(); P.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.strokeStyle = c; X.lineWidth = lw; X.lineCap = 'round'; X.lineJoin = 'round'; X.stroke(); X.lineCap = 'butt'; }
  function fibraC(P, w, a = 1) { if (a <= .01) return; X.save(); X.globalAlpha *= a; strokeP(P, 'rgba(11,15,28,.35)', w + 1.6); strokeP(P, C.colag, w); strokeP(P, light(C.colag, .4), Math.max(.8, w * .28)); X.restore(); }
  function fibraE(P, a = 1) { if (a <= .01) return; X.save(); X.globalAlpha *= a; strokeP(P, 'rgba(11,15,28,.4)', 3); strokeP(P, C.elast, 1.6); X.restore(); }
  // fundo de corte com granulação fina (substância fundamental)
  function corte(x, y, w, h, c, seed, r = 12) {
    X.save(); X.beginPath(); X.roundRect(x, y, w, h, r); X.clip();
    const g = X.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, mix(c, BG, .58)); g.addColorStop(1, mix(c, BG, .7));
    X.fillStyle = g; X.fillRect(x, y, w, h);
    const R = rng(seed), n = Math.min(500, Math.round(w * h / 420));
    for (let i = 0; i < n; i++) circ(x + R() * w, y + R() * h, .6 + R(), rgba(c, .1 + R() * .12));
    X.restore();
  }
  const borda = (x, y, w, h, c, r = 12) => rr(x, y, w, h, r, null, rgba(c, .45), 1.2);
  // fibroblasto: célula fusiforme com núcleo alongado
  function fibroblasto(x, y, L, wd, rot, a = 1, seed = 3) {
    if (a <= .01) return; X.save(); X.globalAlpha *= a; X.translate(x, y); X.rotate(rot);
    X.beginPath(); X.moveTo(-L, 0); X.quadraticCurveTo(-L * .3, -wd * 1.3, 0, -wd); X.quadraticCurveTo(L * .3, -wd * 1.1, L, 0); X.quadraticCurveTo(L * .3, wd * 1.2, 0, wd); X.quadraticCurveTo(-L * .3, wd * 1.3, -L, 0); X.closePath();
    X.fillStyle = CIT; X.fill(); X.strokeStyle = INK; X.lineWidth = 1; X.stroke();
    nuc(0, 0, L * .42, Math.max(2.2, wd * .62), 0, { seed }); X.restore();
  }
  // seta de calor ondulada
  function onda(x1, y1, ang, len, c, a) {
    if (a <= .01) return; X.save(); X.globalAlpha *= a; const P = [];
    for (let i = 0; i <= 14; i++) { const s = i / 14 * len, o = Math.sin(i / 14 * TAU * 1.5) * 4; P.push([x1 + Math.cos(ang) * s - Math.sin(ang) * o, y1 + Math.sin(ang) * s + Math.cos(ang) * o]); }
    strokeP(P, c, 2.4); const q = P[P.length - 1], p = P[P.length - 2]; arrowHead(q[0], q[1], Math.atan2(q[1] - p[1], q[0] - p[0]), c, 8); X.restore();
  }
  function clipHalf(P, nx, ny, c) {
    const out = [], n = P.length;
    for (let i = 0; i < n; i++) { const A = P[i], B = P[(i + 1) % n], da = A[0] * nx + A[1] * ny - c, db = B[0] * nx + B[1] * ny - c; if (da <= 0) out.push(A); if ((da < 0) !== (db < 0)) { const f = da / (da - db); out.push([A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f]); } }
    return out;
  }
  const pathP = P => { X.beginPath(); P.forEach((q, i) => i ? X.lineTo(q[0], q[1]) : X.moveTo(q[0], q[1])); X.closePath(); };
  // anticorpo em Y
  function anticorpo(x, y, s, rot, a) { if (a <= .01) return; X.save(); X.globalAlpha *= a; X.translate(x, y); X.rotate(rot); X.strokeStyle = ANTI; X.lineWidth = 2; X.lineCap = 'round'; X.beginPath(); X.moveTo(0, s); X.lineTo(0, 0); X.lineTo(-s * .7, -s * .8); X.moveTo(0, 0); X.lineTo(s * .7, -s * .8); X.stroke(); X.restore(); }

  // =====================================================================================
  // C1 CONJUNTIVO PROPRIAMENTE DITO
  // =====================================================================================
  const COL = (() => { const R = rng(31), A = []; for (let i = 0; i < 30; i++) A.push({ u: .06 + R() * .88, v: .06 + R() * .88, a: R() * PI, l: .2 + R() * .22, ph: R() * TAU, du: (R() - .5) * .12, da: (R() - .5) * .07 }); return A; })();
  const ELA = (() => { const R = rng(77), A = []; for (let i = 0; i < 9; i++) A.push({ u: .08 + R() * .84, v: .08 + R() * .84, a: R() * PI, l: .14 + R() * .16, ph: R() * TAU, br: R() }); return A; })();
  const FIB = [{ u: .22, v: .34, a: .5, tu: .2, tv: 6.5 / 30 }, { u: .6, v: .76, a: -.3, tu: .5, tv: 13.5 / 30 }, { u: .86, v: .22, a: 1.2, tu: .76, tv: 20.5 / 30 }, { u: .44, v: .55, a: 2.4, tu: .34, tv: 25.5 / 30 }];
  const DENS = ['Conjuntivo frouxo', 'Conjuntivo denso não modelado', 'Conjuntivo denso modelado'];
  const densN = v => v < .5 ? 0 : v < 1.5 ? 1 : 2;
  // complacência (quanto estica) em cada sentido: [horizontal, vertical]
  const compl = d => d <= 1 ? [lerp(1, .18, ss(d)), lerp(1, .18, ss(d))] : [lerp(.18, .06, ss(d - 1)), lerp(.18, .62, ss(d - 1))];

  def('conjuntivo', 'propriamente', {
    t: 'Conjuntivo propriamente dito', s: 'fibras, células e o tecido que liga tudo', c: C.conj, loc: 'Sob os epitélios, na derme, nos tendões e ligamentos',
    still: 3.2, stillV: 0,
    ctl: { l: 'Densidade de fibras', min: 0, max: 2, step: .05, v: 0, f: v => ['frouxo', 'denso não modelado', 'denso modelado'][densN(v)], rate: () => 1 },
    extra: [{ t: 'Puxar o tecido', on: S => { S.pull = !S.pull; S.pt = 0; }, pressed: S => !!S.pull }],
    alt: 'Corte de conjuntivo frouxo corado em HE: fibras colágenas grossas e rosa, fibras elásticas finas e amareladas, e células espalhadas; um fibroblasto produz uma fibra, um macrófago engole uma bactéria, um mastócito solta grânulos de histamina e o vaso ao lado se dilata, um plasmócito solta anticorpos; a faixa transforma o tecido em denso não modelado e em denso modelado (tendão, fibras paralelas entre músculo e osso); o botão puxa o tecido nos dois sentidos',
    d: `<p>O tecido conjuntivo tem células afastadas e muita <b>matriz extracelular</b>, formada por uma <b>substância fundamental</b>, um gel com água, proteínas e açúcares, e por <b>fibras</b>. As <b>fibras colágenas</b> são as mais abundantes: resistem à tração como cabos, e o colágeno é a proteína mais abundante do corpo, cerca de um quarto de todas as proteínas. As <b>fibras elásticas</b> esticam e voltam, e as <b>reticulares</b> formam redes finas que sustentam órgãos como o baço e os linfonodos. A célula principal é o <b>fibroblasto</b>, que produz as fibras e a substância fundamental. Há também células de defesa: os <b>macrófagos</b>, que fagocitam micróbios e restos de células e vêm dos monócitos do sangue; os <b>mastócitos</b>, que liberam <b>histamina</b> (inflamação, alergia) e <b>heparina</b> (anticoagulante); e os <b>plasmócitos</b>, que produzem <b>anticorpos</b> e vêm dos linfócitos B.</p>
<p>O conjuntivo <b>frouxo</b> tem poucas fibras, desorganizadas, e muitas células: fica sob os epitélios, em volta de vasos e nervos, e é onde começam as inflamações. O conjuntivo <b>denso</b> tem muitas fibras colágenas. No <b>denso não modelado</b>, as fibras correm em todas as direções e resistem a puxões de vários lados (a derme, as cápsulas dos órgãos). No <b>denso modelado</b>, as fibras são paralelas e resistem num sentido só: são os <b>tendões</b>, que ligam músculo a osso, e os <b>ligamentos</b>, que ligam osso a osso. O conjuntivo também envolve cada músculo e cada feixe de fibras musculares (ver <a href="#muscular/sarcomero">sarcômero</a>).</p>
<div class="tab"><table>
<thead><tr><th>Célula</th><th>Função</th><th>Origem</th></tr></thead>
<tbody>
<tr><th>Fibroblasto</th><td>produz fibras e substância fundamental; cicatrização</td><td>mesênquima (local)</td></tr>
<tr><th>Macrófago</th><td>fagocitose; apresenta antígenos</td><td>monócito do sangue</td></tr>
<tr><th>Mastócito</th><td>histamina (inflamação e alergia) e heparina</td><td>medula óssea</td></tr>
<tr><th>Plasmócito</th><td>anticorpos</td><td>linfócito B ativado</td></tr>
<tr><th>Adipócito</th><td>reserva de gordura (ver <a href="#conjuntivo/adiposo">tecido adiposo</a>)</td><td>mesênquima</td></tr>
</tbody></table></div>
<p><b>Saúde:</b> a <b>vitamina C</b> é necessária para fazer o colágeno. Sem ela, o colágeno sai fraco, e surge o <b>escorbuto</b>: gengivas que sangram, feridas que não cicatrizam, vasos frágeis.</p>
<p>A faixa aumenta a densidade de fibras: frouxo, denso não modelado e denso modelado. O botão "Puxar o tecido" estica o corte na horizontal e depois na vertical.</p>`,
    enem: 'Saiba as funções das células: <b>fibroblasto</b> produz as fibras (cicatrização), <b>macrófago</b> fagocita, <b>mastócito</b> libera <b>histamina</b> (alergia; os anti-histamínicos agem aqui) e <b>plasmócito</b> produz <b>anticorpos</b>. <b>Tendão</b> liga músculo a osso; <b>ligamento</b>, osso a osso. E a ligação com nutrição: falta de <b>vitamina C</b> compromete o colágeno e causa <b>escorbuto</b>.',
    links: [['Tecido adiposo', '#conjuntivo/adiposo'], ['Conjuntivo no músculo', '#muscular/sarcomero']],
    draw(t, S) {
      const A = area(), d = cl(S.v, 0, 2), dd = ss(cl(d, 0, 1)), e = ss(seg(d, 1, 2)), def_ = 1 - ss(seg(d, .3, .8));
      const w0 = A.w * (NAR ? .9 : .8), h0 = (A.h - 26) * .84, cx = A.cx, cy = A.y0 + 26 + (A.h - 26) / 2;
      // puxão: alterna horizontal (3 s) e vertical (3 s)
      let sx = 1, sy = 1, dir = -1, f = 0;
      if (S.pull) {
        S.pt = (S.pt || 0) + S.dt; const k = S.pt % 6; dir = k < 3 ? 0 : 1; const lc = k % 3;
        f = ss(seg(lc, 0, .8)) * (1 - ss(seg(lc, 2.3, 3)));
        const cp = compl(d)[dir], st = .24 * f * cp;
        if (dir === 0) { sx = 1 + st; sy = 1 - st * .25; } else { sy = 1 + st; sx = 1 - st * .25; }
        S.st = Math.round(st * 100); S.dir = dir;
      }
      const T = (x, y) => [cx + (x - cx) * sx, cy + (y - cy) * sy];
      const M = (u, v) => T(cx + (u - .5) * w0, cy + (v - .5) * h0);
      const w = w0 * sx, h = h0 * sy, x0 = cx - w / 2, y0 = cy - h / 2, sc = cl(w0 / 760, .55, 1);
      head(DENS[densN(d)], cx, A.y0 + 8);
      corte(x0, y0, w, h, C.he_rosa, 5);
      X.save(); X.beginPath(); X.roundRect(x0, y0, w, h, 12); X.clip();
      // fibras elásticas (somem em parte no denso)
      const ea = lerp(1, .55, dd) * lerp(1, .5, e);
      ELA.forEach((F, i) => {
        const a0 = F.a > PI / 2 ? F.a - PI : F.a, ang = lerp(a0, 0, e), c = M(lerp(F.u, .5 + (F.u - .5) * .3, e * 0), lerp(F.v, (i * 3.3 + 2) / 30, e));
        const P = wpts(c[0], c[1], ang, F.l * w0 * lerp(1, 1.8, e), lerp(5, 2.5, e) * (1 - .6 * f), lerp(22, 11, e), F.ph + t * .4).map(q => T(q[0], q[1]).map((z, j) => z));
        fibraE(P, ea);
        if (F.br > .4 && e < .5) { const m = P[Math.floor(P.length * .6)]; fibraE(wpts(m[0] + 16, m[1] + 9, ang + .9, 36, 3, 14, F.ph), ea * (1 - e * 2)); }
      });
      // fibras colágenas
      const nv = lerp(9, 30, dd), wf = lerp(3.2, 6, dd) * sc;
      COL.forEach((F, i) => {
        const al = cl(nv - i, 0, 1); if (al <= 0) return;
        const a0 = F.a > PI / 2 ? F.a - PI : F.a, ang = lerp(a0, F.da, e);
        const u = lerp(F.u, .5 + F.du, e), v = lerp(F.v, (i + .5) / 30, e), L = lerp(F.l * lerp(1, 1.3, dd), 1.3, e) * w0;
        const c0 = [cx + (u - .5) * w0, cy + (v - .5) * h0];
        const P = wpts(c0[0], c0[1], ang, L, lerp(lerp(6, 4, dd), 2.2, e) * (1 - .6 * f), lerp(46, 15, e), F.ph).map(q => T(q[0], q[1]));
        fibraC(P, wf, al);
      });
      // músculo e osso nas pontas do tendão
      if (e > .02) {
        X.save(); X.globalAlpha = e;
        const mw = w * .07; rr(x0, y0, mw, h, 0, mix(C.musc, BG, .25)); for (let i = 1; i < 8; i++) line(x0 + 2, y0 + h * i / 8, x0 + mw - 2, y0 + h * i / 8, rgba(BG, .35), 1);
        rr(x0 + w - mw, y0, mw, h, 0, OSSO); for (let i = 1; i < 6; i++) line(x0 + w - mw + i * mw / 6, y0, x0 + w - mw + i * mw / 6, y0 + h, rgba(BG, .2), 1);
        X.restore();
      }
      // fibroblastos (ficam no denso, achatados entre as fibras)
      const rc = cl(w0 * .03, 10, 20);
      FIB.forEach((F, i) => { const p = M(lerp(F.u, F.tu, e), lerp(F.v, F.tv, e)); fibroblasto(p[0], p[1], rc * lerp(1.6, 1.3, dd), rc * lerp(.55, .3, dd), lerp(F.a, 0, e), 1, 3 + i); F.px = p; });
      // fibroblasto 0 fia uma fibra colágena
      { const F = FIB[0], p = fr(t / 8), g = ss(seg(p, .05, .7)), al = def_ * (1 - ss(seg(p, .85, 1)));
        if (al > .01 && g > 0) { const ang = F.a, L0 = rc * 1.6, bx = F.px[0] + Math.cos(ang) * L0, by = F.px[1] + Math.sin(ang) * L0, Lg = g * rc * 6;
          const P = wpts(bx + Math.cos(ang) * Lg / 2, by + Math.sin(ang) * Lg / 2, ang, Lg, 2.5, 30, 0);
          fibraC(P, wf * .8, al);
          for (let k = 0; k < 4; k++) { const q = fr(t * .9 + k / 4); circ(F.px[0] + Math.cos(ang) * (L0 * .6 + q * (L0 * .4 + Lg)), F.px[1] + Math.sin(ang) * (L0 * .6 + q * (L0 * .4 + Lg)), 2, rgba(light(C.colag, .3), al * (1 - q))); }
          S.fiando = g > .1 && g < 1 && al > .5;
        } else S.fiando = false; }
      // vaso sanguíneo (dilata com a histamina)
      const pm = fr(t / 6), hist = ss(seg(pm, .45, .65)) * (1 - ss(seg(pm, .88, 1)));
      const vp = M(.8, .8), vr = rc * 1.15 * (1 + .45 * hist * def_);
      X.save(); X.globalAlpha = lerp(1, .55, dd) * (1 - e); capilar(vp[0], vp[1], vr, { n: 3, t: t * .2 }); X.restore();
      // mastócito: grânulos de histamina saem e chegam ao vaso
      const mp = M(.62, .6), ma = def_;
      if (ma > .01) {
        X.save(); X.globalAlpha = ma;
        ell(mp[0], mp[1], rc * 1.1, rc * .85, .3, CIT, INK, 1); nuc(mp[0], mp[1], rc * .32, rc * .3, 0, { seed: 9 });
        const R = rng(13);
        for (let i = 0; i < 34; i++) { const an = R() * TAU, rd = Math.sqrt(R()) * .85; let gx = mp[0] + Math.cos(an) * rd * rc * 1.05, gy = mp[1] + Math.sin(an) * rd * rc * .8;
          const out = i % 3 === 0 ? ss(seg(pm, .2 + (i % 5) * .03, .6)) : 0; if (out > 0) { gx = lerp(gx, vp[0] + Math.cos(an) * vr * .6, out); gy = lerp(gy, vp[1] + Math.sin(an) * vr * .6, out); }
          circ(gx, gy, 1.7, rgba(C.he_nucleo, out > .9 ? 1 - (out - .9) * 10 : .95)); }
        X.restore();
        if (hist > .3 && ma > .5) tok(vp[0], vp[1] - vr - 14, 'vaso dilata', AMB, { a: ma });
      }
      // macrófago engole uma bactéria
      const qp = M(.34, .2), pp = fr(t / 7);
      if (def_ > .01) {
        X.save(); X.globalAlpha = def_;
        const ab = 2.6, arm = ss(seg(pp, .3, .5)) * (1 - ss(seg(pp, .55, .7))), r0 = rc * 1.15;
        X.beginPath();
        for (let i = 0; i <= 60; i++) { const an = i / 60 * TAU, dA = Math.atan2(Math.sin(an - ab), Math.cos(an - ab)); let r = r0 * (1 + .08 * Math.sin(3 * an + t * 1.3) + .06 * Math.sin(5 * an - t));
          r += r0 * .9 * arm * (Math.exp(-(((dA - .5) / .2) ** 2)) + Math.exp(-(((dA + .5) / .2) ** 2))); const px = qp[0] + Math.cos(an) * r, py = qp[1] + Math.sin(an) * r; i ? X.lineTo(px, py) : X.moveTo(px, py); }
        X.closePath(); X.fillStyle = 'rgba(236,190,212,.72)'; X.fill(); X.strokeStyle = INK; X.lineWidth = 1; X.stroke();
        circ(qp[0] + r0 * .35, qp[1] + r0 * .4, r0 * .12, 'rgba(255,255,255,.18)'); circ(qp[0] + r0 * .5, qp[1] - r0 * .1, r0 * .09, 'rgba(255,255,255,.18)');
        nuc(qp[0] + r0 * .15, qp[1] - r0 * .05, r0 * .38, r0 * .26, .4, { seed: 4 }); circ(qp[0] + r0 * .3, qp[1] - r0 * .25, r0 * .14, 'rgba(236,190,212,.95)');
        const far = r0 * 3.2, app = ss(seg(pp, 0, .4)), inn = ss(seg(pp, .5, .7)), dist = lerp(far, r0 * 1.2, app) * (1 - inn) + inn * r0 * .45;
        const bx = qp[0] + Math.cos(ab) * dist, by = qp[1] + Math.sin(ab) * dist, ba = 1 - ss(seg(pp, .75, .95));
        if (inn > .5) circ(bx, by, rc * .45, 'rgba(255,255,255,.2)', INK, 1);
        X.save(); X.globalAlpha *= ba; X.translate(bx, by); X.rotate(t * .5); capsule(0, 0, rc * .7, rc * .32); X.fillStyle = BACT; X.fill(); X.strokeStyle = INK; X.stroke(); X.restore();
        X.restore();
      }
      // plasmócito solta anticorpos
      const lp = M(.15, .72);
      if (def_ > .01) {
        X.save(); X.globalAlpha = def_;
        ell(lp[0], lp[1], rc * 1.05, rc * .8, -.2, 'rgba(190,170,225,.7)', INK, 1);
        circ(lp[0] + rc * .05, lp[1], rc * .3, 'rgba(255,255,255,.22)');
        const nx = lp[0] - rc * .45, ny = lp[1] + rc * .05; circ(nx, ny, rc * .42, C.he_nucleo, 'rgba(11,15,28,.45)', 1);
        for (let k = 0; k < 7; k++) circ(nx + Math.cos(k / 7 * TAU) * rc * .3, ny + Math.sin(k / 7 * TAU) * rc * .3, rc * .07, 'rgba(40,20,90,.7)'); circ(nx, ny, rc * .08, 'rgba(40,20,90,.7)');
        for (let k = 0; k < 5; k++) { const q = fr(t * .25 + k / 5), an = -1.2 + k * .55; anticorpo(lp[0] + Math.cos(an) * (rc + q * rc * 2.6), lp[1] + Math.sin(an) * (rc + q * rc * 2.6), 5, an + PI / 2, 1 - q); }
        X.restore();
      }
      X.restore();
      borda(x0, y0, w, h, C.he_rosa);
      // setas do puxão
      if (S.pull && f > .02) {
        const L = 22 + 10 * f;
        if (dir === 0) { arrow(x0 - 2, cy, x0 - 2 - L, cy, AMB, 3); arrow(x0 + w + 2, cy, x0 + w + 2 + L, cy, AMB, 3); }
        else { arrow(cx, y0 - 2, cx, y0 - 2 - L * .6, AMB, 3); arrow(cx, y0 + h + 2, cx, y0 + h + 2 + L * .6, AMB, 3); }
      }
      // rótulos
      if (def_ > .5) {
        lab(FIB[1].px[0], FIB[1].px[1], FIB[1].px[0] + rc * 3, FIB[1].px[1] + rc * 2.6, 'fibroblasto');
        lab(qp[0], qp[1] + rc * .6, qp[0] - rc * 4, qp[1] + rc * 2.2, 'macrófago');
        lab(mp[0] - rc * .3, mp[1], mp[0] - rc * 3.5, mp[1] + rc * 1.6, 'mastócito');
        lab(lp[0], lp[1] - rc * .7, lp[0] + rc * 3, lp[1] - rc * 2.6, 'plasmócito');
        const c3 = COL[2], cp3 = M(c3.u, c3.v); lab(cp3[0], cp3[1], cp3[0] + rc * 3, cp3[1] - rc * 2.4, 'fibra colágena');
        const e0 = ELA[0], ep = M(e0.u, e0.v); lab(ep[0], ep[1], ep[0] - rc * 3, ep[1] - rc * 2, 'fibra elástica');
        lab(vp[0] + vr * .7, vp[1] + vr * .7, vp[0] + rc * 2, vp[1] + rc * 2.2, 'vaso sanguíneo');
      } else {
        const fp = FIB[1].px; lab(fp[0], fp[1], fp[0] + rc * 3, fp[1] + rc * 3, 'fibroblasto');
        const c3 = COL[14], q = M(lerp(c3.u, .5, e), lerp(c3.v, 14.5 / 30, e)); lab(q[0], q[1], q[0] - rc * 4, y0 + 18, 'fibras colágenas');
        if (e > .6) { lab(x0 + w * .035, cy, x0 + w * .1, y0 + h + 14, 'músculo'); lab(x0 + w * .965, cy, x0 + w * .9, y0 + h + 14, 'osso'); lab(cx, y0 + h * .1, cx + rc * 2, A.y0 + 30, 'tendão: liga músculo a osso'); }
      }
      // legenda
      const nome = ['frouxo', 'denso não modelado', 'denso modelado'][densN(d)];
      if (S.pull && f > .1) {
        const sent = S.dir === 0 ? 'na horizontal' : 'na vertical';
        const why = d < .5 ? 'o frouxo cede muito em qualquer sentido' : d < 1.5 ? 'o denso não modelado resiste em todos os sentidos' : S.dir === 0 ? 'o denso modelado resiste no sentido das fibras' : 'puxado de lado, as fibras paralelas se afastam: o modelado resiste num sentido só';
        cap(`Puxão ${sent}: o tecido esticou ${S.st}%; ${why}`);
      } else if (d < .5) {
        const ev = pm > .4 && pm < .9 ? 'o mastócito solta histamina e o vaso se dilata' : pp > .3 && pp < .75 ? 'o macrófago engole uma bactéria (fagocitose)' : S.fiando ? 'o fibroblasto produz uma fibra colágena' : 'o plasmócito solta anticorpos';
        cap(`Conjuntivo frouxo, poucas fibras e muitas células: ${ev}`);
      } else if (d < 1.5) cap('Denso não modelado (derme, cápsulas dos órgãos): muitas fibras colágenas em todas as direções');
      else cap('Denso modelado (tendões e ligamentos): fibras colágenas paralelas, com fibroblastos enfileirados entre elas');
      void nome;
    }
  });

  // =====================================================================================
  // C2 TECIDO ADIPOSO
  // =====================================================================================
  const GOT = (() => { const R = rng(41), A = []; let k = 0; while (A.length < 13 && k < 400) { k++; const an = R() * TAU, rd = .3 + R() * .48, r = .07 + R() * .06, x = Math.cos(an) * rd, y = Math.sin(an) * rd; if (A.every(g => Math.hypot(g.x - x, g.y - y) > g.r + r + .02)) A.push({ x, y, r }); } return A; })();
  const MIT = (() => { const R = rng(43), A = []; let k = 0; while (A.length < 34 && k < 900) { k++; const an = R() * TAU, rd = .27 + R() * .55, x = Math.cos(an) * rd, y = Math.sin(an) * rd; if (GOT.every(g => Math.hypot(g.x - x, g.y - y) > g.r + .05) && A.every(m => Math.hypot(m.x - x, m.y - y) > .09)) A.push({ x, y, a: R() * PI }); } return A; })();
  const balN = v => v < -10 ? 'jejum ou exercício' : v > 10 ? 'excesso' : 'equilíbrio';
  function bebe(x, y, s, a) {
    X.save(); X.globalAlpha *= a; const sk = '#E9C3A8', st = 'rgba(11,15,28,.5)';
    ell(x - s * .42, y + s * .25, s * .14, s * .42, .5, sk, st, 1); ell(x + s * .42, y + s * .25, s * .14, s * .42, -.5, sk, st, 1);
    ell(x - s * .2, y + s * 1.05, s * .15, s * .38, .1, sk, st, 1); ell(x + s * .2, y + s * 1.05, s * .15, s * .38, -.1, sk, st, 1);
    rr(x - s * .38, y - s * .05, s * .76, s * .95, s * .3, sk, st, 1); circ(x, y - s * .38, s * .36, sk, st, 1);
    // tecido pardo: entre as escápulas e no pescoço
    ngon(x, y + s * .22, s * .22, 4, 0, rgba(MITO, .9), st, 1); rr(x - s * .16, y - s * .1, s * .32, s * .1, 4, rgba(MITO, .9));
    X.restore();
  }
  def('conjuntivo', 'adiposo', {
    t: 'Tecido adiposo', s: 'reserva, isolamento e calor', c: C.adip, loc: 'Sob a pele e em volta dos órgãos; o pardo, no bebê',
    still: 2, stillV: 0,
    ctl: { l: 'Balanço de energia', min: -100, max: 100, step: 5, v: 0, f: balN, rate: () => 1 },
    init(S) { if (S.fill == null) S.fill = .6; if (S.frio == null) S.frio = 0; },
    extra: [{ t: 'Frio', on: S => { S.cold = !S.cold; }, pressed: S => !!S.cold }],
    alt: 'À esquerda, um adipócito unilocular (branco) com uma única gota grande de gordura e o núcleo achatado na borda; a faixa de balanço de energia enche a gota (comer mais do que se gasta) ou a esvazia, com ácidos graxos saindo para o sangue. À direita, um adipócito multilocular (pardo) com muitas gotinhas e muitas mitocôndrias; o botão Frio acende as mitocôndrias e ondas de calor saem da célula. Uma silhueta de bebê visto de costas mostra o tecido pardo entre as escápulas e no pescoço',
    d: `<p>O tecido adiposo é um conjuntivo em que predominam os <b>adipócitos</b>, células que guardam gordura (triglicerídeos). No <b>adiposo unilocular</b> (ou branco), cada célula tem uma única gota enorme de gordura, que empurra o núcleo e o citoplasma para a borda. Ele é a principal <b>reserva de energia</b> do corpo (um grama de gordura rende cerca de 9 kcal, mais que o dobro de um grama de carboidrato ou de proteína), forma uma camada sob a pele que <b>isola do frio</b> e amortece choques (em volta dos rins, na planta dos pés) e funciona como glândula: libera <b>hormônios</b>, como a leptina, que ajuda a regular a fome.</p>
<p>No <b>adiposo multilocular</b> (ou pardo), a gordura fica em muitas gotinhas, e a célula tem uma enorme quantidade de <b>mitocôndrias</b>. Ele não serve de estoque: serve para <b>produzir calor</b>. Nas mitocôndrias dele há uma proteína, a termogenina, que deixa os prótons voltarem para a matriz sem passar pela ATP sintase: a energia da respiração sai como calor, e não como ATP (ver <a href="../bioenergetica/index.html#resp/cadeia">cadeia respiratória</a>). É abundante em <b>recém-nascidos</b> e em animais que <b>hibernam</b>; o adulto tem pouco. No adulto, o número de adipócitos muda pouco: engordar é sobretudo encher as células que já existem.</p>
<p>A faixa muda o balanço de energia: para a esquerda, jejum ou exercício (a gota esvazia); para a direita, comer mais do que se gasta (a gota enche). O botão "Frio" liga a produção de calor no tecido pardo.</p>`,
    kv: [['Unilocular (branco)', 'uma gota grande; reserva, isolamento, proteção, hormônios'], ['Multilocular (pardo)', 'muitas gotinhas e mitocôndrias; produz calor'], ['1 g de gordura', 'cerca de 9 kcal'], ['Pardo abundante em', 'recém-nascidos e animais que hibernam']],
    enem: '<b>Unilocular (branco)</b>: reserva de energia, isolamento térmico e proteção mecânica. <b>Multilocular (pardo)</b>: produz <b>calor</b>, porque as mitocôndrias "desperdiçam" o gradiente de prótons. A questão costuma ligar o tecido pardo a <b>recém-nascidos</b> e <b>animais que hibernam</b>, ou pedir por que ele tem tantas mitocôndrias.',
    links: [[LK.cadeia[0], LK.cadeia[1]], ['Conjuntivo propriamente dito', '#conjuntivo/propriamente']],
    draw(t, S) {
      const A = area(), v = S.v / 100;
      S.fill = cl((S.fill == null ? .6 : S.fill) + S.dt * v * .07, .12, 1);
      S.frio = cl((S.frio || 0) + S.dt * (S.cold ? 1.2 : -1.2), 0, 1);
      const fl = S.fill, cg = ss(S.frio);
      let U, Mu, B, R;
      if (NAR) { const ph = (A.h - 8) / 2; R = Math.min(A.w * .3, ph * .36); U = [A.x0 + A.w * .38, A.y0 + 24 + ph * .48]; Mu = [A.x0 + A.w * .38, A.y0 + ph + 30 + ph * .48]; B = [A.x1 - A.w * .14, Mu[1] - R * .3, R * .55]; }
      else { const cw = A.w * .4; R = Math.min(cw * .3, (A.h - 90) * .42); U = [A.x0 + cw * .5, A.y0 + 30 + (A.h - 70) / 2]; Mu = [A.x0 + cw * 1.5, U[1]]; B = [A.x0 + A.w * .9, U[1] - R * .45, Math.min(A.w * .06, R * .55)]; }
      const hd = (s, x, y) => head(s, x, y);
      hd(NAR ? 'Unilocular (branco)' : 'Unilocular (branco): reserva', U[0], U[1] - R * 1.32 - 6);
      hd(NAR ? 'Multilocular (pardo)' : 'Multilocular (pardo): calor', Mu[0], Mu[1] - R * 1.32 - 6);
      // ----- unilocular, com vizinhas apagadas
      X.save(); X.beginPath(); X.rect(U[0] - R * 1.45, U[1] - R * 1.2, R * 2.9, R * 2.4); X.clip();
      X.fillStyle = MAT; X.fillRect(U[0] - R * 1.45, U[1] - R * 1.2, R * 2.9, R * 2.4);
      for (let i = 0; i < 6; i++) { const an = i / 6 * TAU + .5; const nx = U[0] + Math.cos(an) * R * 2, ny = U[1] + Math.sin(an) * R * 2; circ(nx, ny, R * .95, rgba(C.adip, .16), rgba(C.he_rosa, .4), 1.5); }
      X.restore();
      const Rc = R * (.66 + .34 * fl), rim = Math.max(3, Rc * .07), gr = Rc - rim;
      circ(U[0], U[1], Rc, CIT, INK, 1.2);
      const g = X.createRadialGradient(U[0] - gr * .3, U[1] - gr * .35, gr * .1, U[0], U[1], gr);
      g.addColorStop(0, light(C.adip, .35)); g.addColorStop(1, mix(C.adip, BG, .15)); circ(U[0], U[1], gr, g, 'rgba(11,15,28,.3)', 1);
      const na = -2.3, nr = Rc - rim * .5; nuc(U[0] + Math.cos(na) * nr, U[1] + Math.sin(na) * nr, Rc * .26, rim * .55 + 1.6, na + PI / 2, { seed: 2 });
      // capilar e ácidos graxos
      const cpx = U[0] + R * 1.08, cpy = U[1] + R * .95; capilar(cpx, cpy, R * .16, { n: 2, t: t * .3 });
      const flux = Math.abs(v);
      if (flux > .08) { const n = Math.round(3 + flux * 6);
        for (let k = 0; k < n; k++) { const q = fr(t * .35 + k / n), qq = v < 0 ? q : 1 - q, an = .75 + (k % 3 - 1) * .25; const sx = U[0] + Math.cos(an) * gr * .9, sy = U[1] + Math.sin(an) * gr * .9;
          circ(lerp(sx, cpx, qq), lerp(sy, cpy, qq) - Math.sin(qq * PI) * 8, 3, rgba(C.adip, Math.sin(q * PI))); }
        tok(cpx - R * (NAR ? .55 : .1), cpy + R * .32, v < 0 ? 'ácidos graxos saem' : 'gordura entra', C.adip); }
      // estoque
      if (NAR) { const bx = A.x1 - A.w * .2, bw = 16, bh = R * 1.7, by = U[1] - bh / 2; rr(bx, by, bw, bh, 5, 'rgba(91,108,153,.25)'); rr(bx, by + bh * (1 - fl), bw, bh * fl, 5, C.adip); tx('gordura', bx + bw / 2, by - 12, { s: 12, c: C.dim, bg: false }); tx('guardada', bx + bw / 2, by + bh + 12, { s: 12, c: C.dim, bg: false }); }
      else hbar(U[0] - R * 1.1, U[1] + R * 1.38 + 12, R * 2.2, 10, fl, C.adip, 'gordura guardada', Math.round(fl * 100) + '%');
      lab(U[0] + Math.cos(na) * nr, U[1] + Math.sin(na) * nr, U[0] - R * 1.25, U[1] - R * 1.05, NAR ? 'núcleo na borda' : 'núcleo achatado na borda');
      lab(U[0] + gr * .2, U[1] + gr * .1, U[0] - R * 1.3, U[1] + R * .5, 'gota de gordura');
      // ----- multilocular (célula bem menor que a do branco: cerca de 0,6 do raio)
      const Rm = R * .6;
      X.save(); X.beginPath(); X.rect(Mu[0] - R * 1.45, Mu[1] - R * 1.2, R * 2.9, R * 2.4); X.clip();
      X.fillStyle = MAT; X.fillRect(Mu[0] - R * 1.45, Mu[1] - R * 1.2, R * 2.9, R * 2.4);
      for (let i = 0; i < 18; i++) { const ring = i < 6 ? 1 : 2, an = (i % 6) / 6 * TAU + .5 + (ring - 1) * PI / 6, d = ring === 1 ? 1.75 : 3.1; ngon(Mu[0] + Math.cos(an) * Rm * d, Mu[1] + Math.sin(an) * Rm * d, Rm * .9, 6, .5, rgba(MITO, .12), rgba(C.he_rosa, .35), 1.5); }
      X.restore();
      ngon(Mu[0], Mu[1], Rm * .98, 6, .5, mixA(C.he_rosa, MITO, .45, .55), INK, 1.2);
      for (const G of GOT) circ(Mu[0] + G.x * Rm * .9, Mu[1] + G.y * Rm * .9, G.r * Rm, rgba(C.adip, .9), 'rgba(11,15,28,.3)', 1);
      for (const m of MIT) { const x = Mu[0] + m.x * Rm * .9, y = Mu[1] + m.y * Rm * .9;
        if (cg > .02) circ(x, y, Rm * .07 * (1 + .2 * Math.sin(t * 4 + m.a * 5)), rgba(CALOR, .35 * cg));
        ell(x, y, Rm * .055, Rm * .026, m.a, mix(MITO, '#FFC266', cg), 'rgba(11,15,28,.45)', .8); }
      nuc(Mu[0], Mu[1], Rm * .2, Rm * .18, 0, { seed: 7 });
      [0, .6, -.6, PI, PI + .6, PI - .6].forEach((an, i) => { const q = fr(t * .5 + i * .37); onda(Mu[0] + Math.cos(an) * Rm * (1 + q * .25), Mu[1] + Math.sin(an) * Rm * (1 + q * .25), an, R * .26, CALOR, cg * Math.sin(q * PI)); });
      if (cg > .3) tok(Mu[0] + R * (NAR ? .8 : 1.05), Mu[1] - R * 1.05, 'calor', CALOR, { a: cg });
      lab(Mu[0] + MIT[3].x * Rm * .9, Mu[1] + MIT[3].y * Rm * .9, Mu[0] - R * 1.3, Mu[1] + R * .9, 'mitocôndrias');
      lab(Mu[0] + GOT[0].x * Rm * .9, Mu[1] + GOT[0].y * Rm * .9, Mu[0] - R * 1.3, Mu[1] - R * .9, 'gotinhas de gordura');
      tx(NAR ? 'menor que a do branco' : 'na mesma escala, menor que a célula do branco', Mu[0], Mu[1] + R * 1.2 + 14, { s: 12, c: C.dim, bg: false });
      // bebê
      bebe(B[0], B[1], B[2], 1);
      tx('bebê visto', B[0], B[1] + B[2] * 1.75, { s: 12, c: C.dim, bg: false }); tx('de costas', B[0], B[1] + B[2] * 1.75 + 15, { s: 12, c: C.dim, bg: false });
      lab(B[0], B[1] + B[2] * .22, B[0] - B[2] * .2, B[1] - B[2] * 1.3, 'tecido pardo');
      const est = v < -.1 ? 'Jejum ou exercício: a gota esvazia e a gordura sai como ácidos graxos para o sangue' : v > .1 ? 'Comer mais do que se gasta: a mesma célula enche (o número de adipócitos muda pouco no adulto)' : 'Balanço em equilíbrio: a gota do adipócito branco fica do mesmo tamanho';
      cap(cg > .3 ? 'Frio: as mitocôndrias do tecido pardo deixam os prótons voltarem sem fazer ATP, e a energia sai como calor' : est);
    }
  });

  // =====================================================================================
  // C3 TECIDO CARTILAGINOSO
  // =====================================================================================
  const CAR = ['hialina', 'elástica', 'fibrosa'];
  const GRP = (() => { const R = rng(51), A = []; const nx = 7, ny = 4;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const gx = (i + .5 + (R() - .5) * .5) / nx, gy = (j + .5 + (R() - .5) * .45) / ny, edge = gx < .13;
      const n = edge ? 1 : 1 + Math.floor(R() * 3.99);
      A.push({ gx, gy, n, edge, rot: R() * PI, tx_: gx, ty: (Math.round(gy * 4 - .5) + .5) / 4 + (j % 2 ? .02 : -.02) });
    } return A; })();
  const ELF = (() => { const R = rng(57), A = []; for (let i = 0; i < 34; i++) A.push({ x: .12 + R() * .88, y: R(), a: R() * PI, l: .08 + R() * .14, ph: R() * TAU }); return A; })();
  const NUT = (() => { const R = rng(59), A = []; for (let i = 0; i < 26; i++) A.push({ b: R(), dy: (R() - .5) * 2, k: .5 + R() * .5, w: R() * TAU }); return A; })();
  const offs = n => n === 1 ? [[0, 0]] : n === 2 ? [[-.55, 0], [.55, 0]] : n === 3 ? [[-.55, .35], [.55, .35], [0, -.55]] : [[-.55, -.55], [.55, -.55], [-.55, .55], [.55, .55]];
  function icone(k, x, y, s, t, a) {
    if (a <= .01) return; X.save(); X.globalAlpha *= a; const cc = C.cart;
    if (k === 0) { // traqueia: anéis em C
      for (let i = 0; i < 5; i++) { const yy = y - s * .8 + i * s * .4; X.beginPath(); X.ellipse(x, yy, s * .55, s * .13, 0, PI * .15, PI * 1.85, false); X.strokeStyle = cc; X.lineWidth = 5; X.stroke(); }
      line(x + s * .5, y - s * .9, x + s * .5, y + s * .9, rgba(C.he_rosa, .7), 2);
    } else if (k === 1) { // orelha que dobra e volta
      const b = Math.sin(t * 2) * .35; X.translate(x, y); X.transform(1 - Math.abs(b) * .5, 0, b, 1, 0, 0);
      X.beginPath(); X.moveTo(-s * .1, s * .9); X.bezierCurveTo(-s * .55, s * .5, -s * .6, -s * .9, s * .1, -s * .9); X.bezierCurveTo(s * .6, -s * .9, s * .55, -s * .1, s * .2, s * .2); X.bezierCurveTo(s * .05, s * .35, s * .15, s * .7, -s * .1, s * .9); X.closePath();
      X.fillStyle = '#E9C3A8'; X.fill(); X.strokeStyle = 'rgba(11,15,28,.5)'; X.lineWidth = 1.5; X.stroke();
      X.beginPath(); X.moveTo(-s * .05, s * .5); X.bezierCurveTo(-s * .35, s * .1, -s * .3, -s * .6, s * .1, -s * .6); X.strokeStyle = rgba(C.elast, .9); X.lineWidth = 2; X.stroke();
    } else { // disco entre vértebras sendo comprimido
      const c = .5 + .5 * Math.sin(t * 2), dh = s * lerp(.36, .22, c), bulge = lerp(1, 1.12, c);
      rr(x - s * .6, y - dh / 2 - s * .55, s * 1.2, s * .55, 6, OSSO, INK, 1); rr(x - s * .6, y + dh / 2, s * 1.2, s * .55, 6, OSSO, INK, 1);
      ell(x, y, s * .62 * bulge, dh / 2, 0, mix(C.cart, C.colag, .45), INK, 1);
      arrow(x, y - s * 1.25, x, y - dh / 2 - s * .6, AMB, 2 + c); arrow(x, y + s * 1.25, x, y + dh / 2 + s * .6, AMB, 2 + c);
    }
    X.restore();
  }
  def('conjuntivo', 'cartilagem', {
    t: 'Tecido cartilaginoso', s: 'firme, flexível e sem vasos', c: C.cart, loc: 'Articulações, traqueia, orelha, discos entre as vértebras',
    still: 4, stillV: 0,
    ctl: { l: 'Tipo', min: 0, max: 2, step: 1, v: 0, f: v => CAR[Math.round(v)], rate: () => 1 },
    auto: .16,
    alt: 'Corte de cartilagem: à esquerda, conjuntivo com um vaso sanguíneo; depois o pericôndrio; e a cartilagem, sem vasos, com condrócitos em lacunas, às vezes em grupos de 2 a 4 (grupos isógenos). Pontos de nutrientes saem do vaso e se difundem devagar até as células do meio. A faixa troca o tipo: hialina (matriz lisa), elástica (fibras onduladas, ícone de orelha que dobra) e fibrosa (feixes grossos de colágeno, ícone de disco entre vértebras sendo comprimido)',
    d: `<p>A <b>cartilagem</b> é um conjuntivo de matriz firme mas flexível, rica em colágeno e em moléculas que seguram muita água, o que a torna resistente à compressão. As células jovens, os <b>condroblastos</b>, produzem a matriz e acabam presas dentro dela, em pequenas cavidades (as lacunas), onde passam a se chamar <b>condrócitos</b>. A cartilagem <b>não tem vasos sanguíneos nem nervos</b>: recebe nutrientes por difusão a partir de uma capa de conjuntivo que a envolve, o <b>pericôndrio</b> (as cartilagens das articulações, que não têm pericôndrio, são nutridas pelo líquido sinovial). Por isso a cartilagem <b>se regenera muito devagar</b>: uma lesão no joelho ou o desgaste da artrose quase não se recupera sozinho.</p>
<p>Há três tipos. A <b>hialina</b> é a mais comum: reveste as superfícies das articulações, forma os anéis da traqueia, a ponta do nariz e as cartilagens das costelas, e é o molde do esqueleto do embrião e o disco de crescimento dos ossos longos (ver <a href="#conjuntivo/ossificacao">ossificação</a>). A <b>elástica</b>, com fibras elásticas, dobra e volta: pavilhão da orelha e epiglote. A <b>fibrosa</b> (fibrocartilagem), com muitas fibras colágenas, aguenta pressão e tração: discos entre as vértebras e meniscos do joelho. Nos tubarões e raias (peixes cartilaginosos), o esqueleto inteiro do adulto é de cartilagem.</p>
<div class="tab"><table>
<thead><tr><th>Tipo</th><th>Destaque da matriz</th><th>Onde</th></tr></thead>
<tbody>
<tr><th>Hialina</th><td>colágeno fino, aspecto vítreo</td><td>articulações, traqueia, nariz, costelas, esqueleto do embrião, disco epifisário</td></tr>
<tr><th>Elástica</th><td>fibras elásticas</td><td>pavilhão da orelha, epiglote</td></tr>
<tr><th>Fibrosa</th><td>feixes de colágeno grossos</td><td>discos intervertebrais, meniscos, sínfise púbica</td></tr>
</tbody></table></div>`,
    enem: 'A cartilagem <b>não tem vasos sanguíneos</b>, e por isso se nutre por difusão e <b>se regenera lentamente</b>: lesões de menisco e o desgaste da artrose são difíceis de tratar. Associe os tipos aos exemplos: <b>hialina</b> nas articulações e na traqueia, <b>elástica</b> na orelha, <b>fibrosa</b> nos discos entre as vértebras.',
    links: [['Formação dos ossos', '#conjuntivo/ossificacao'], ['Tecido ósseo', '#conjuntivo/osso']],
    draw(t, S) {
      const A = area(), tgt = Math.round(cl(S.v, 0, 2));
      S.vs = S.vs == null ? tgt : S.vs + (tgt - S.vs) * Math.min(1, (S.dt || 0) * 4); if (S.paused) S.vs = tgt;
      const vs = S.vs, wH = Math.max(0, 1 - Math.abs(vs)), wE = Math.max(0, 1 - Math.abs(vs - 1)), wF = Math.max(0, 1 - Math.abs(vs - 2));
      const side = !NAR && A.w > 640, sw = side ? A.w * .74 : A.w, sh = side ? A.h - 30 : (A.h - 30) * .74;
      const x0 = A.x0, y0 = A.y0 + 26, cw = sw * .15, pw = sw * .09, kx = x0 + cw + pw, kw = sw - cw - pw;
      head(`Cartilagem ${CAR[tgt]}`, x0 + sw / 2, A.y0 + 8);
      X.save(); X.beginPath(); X.roundRect(x0, y0, sw, sh, 12); X.clip();
      // conjuntivo vizinho com o vaso
      corte(x0, y0, cw + 2, sh, C.he_rosa, 8, 0);
      for (let i = 0; i < 5; i++) fibraC(wpts(x0 + cw * .5, y0 + sh * (i + .5) / 5, 1.2 + i * .4, cw * .9, 3, 20, i), 2.4, .7);
      const vx = x0 + cw * .45, vy = y0 + sh * .5, vr = Math.min(cw * .3, 18); capilar(vx, vy, vr, { n: 3, t: t * .2 });
      // pericôndrio (some aos poucos na fibrosa)
      const pa = 1 - wF * .7;
      X.fillStyle = mix(C.he_rosa, BG, .5); X.fillRect(x0 + cw, y0, pw, sh);
      for (let i = 0; i < 9; i++) { const yy = y0 + sh * (i + .5) / 9; fibraC(wpts(x0 + cw + pw * .35, yy, PI / 2, sh / 9 * 1.1, 1.5, 30, i), 2, .7 * pa); nuc(x0 + cw + pw * (.3 + (i % 2) * .35), yy + 6, 2.2, sh / 9 * .26, 0, { seed: i, a: pa }); }
      // matriz da cartilagem
      const mc = mix(mix(C.cart, C.he_nucleo, .3), C.colag, wF * .55), g = X.createLinearGradient(kx, 0, kx + kw, 0);
      g.addColorStop(0, mix(mc, BG, .42)); g.addColorStop(1, mix(mc, BG, .55)); X.fillStyle = g; X.fillRect(kx, y0, kw, sh);
      // fibras elásticas
      if (wE > .01) ELF.forEach(F => { const P = wpts(kx + F.x * kw, y0 + F.y * sh, F.a, F.l * kw, 3, 12, F.ph); fibraE(P, wE); const m = P[Math.floor(P.length / 2)]; fibraE(wpts(m[0] + 8, m[1] + 6, F.a + .9, F.l * kw * .5, 2, 10, F.ph), wE * .8); });
      // feixes de colágeno da fibrosa
      if (wF > .01) for (let r = 0; r <= 4; r++) { const yy = y0 + sh * r / 4; for (let k = -2; k <= 2; k++) fibraC(wpts(kx + kw / 2, yy + k * 5, 0, kw * 1.05, 2, 26, r + k), 3.4, wF * .9); }
      // condrócitos em lacunas
      const rc = cl(Math.min(kw / 7, sh / 4) * .14, 5, 11);
      GRP.forEach((G, i) => {
        const gx = kx + lerp(G.gx, G.tx_, wF) * kw, gy = y0 + lerp(G.gy, G.ty, wF) * sh;
        const O = offs(G.n), rot = lerp(G.rot, 0, wF), flat = G.edge ? .5 : 1;
        if (!G.edge && wH + wE > .05) circ(gx, gy, rc * (G.n > 1 ? 2.25 : 1.5), rgba(C.he_nucleo, .22 * (wH + wE)));
        O.forEach((o, j) => {
          const ox = wF > .5 ? (j - (G.n - 1) / 2) * rc * 2.3 : (o[0] * Math.cos(rot) - o[1] * Math.sin(rot)) * rc * 2.1, oy = wF > .5 ? 0 : (o[0] * Math.sin(rot) + o[1] * Math.cos(rot)) * rc * 2.1 * flat;
          const x = gx + ox, y = gy + oy;
          ell(x, y, rc * 1.08, rc * 1.08 * flat, 0, 'rgba(232,238,248,.22)', 'rgba(11,15,28,.45)', 1);
          ell(x, y, rc * .85, rc * .82 * flat, 0, 'rgba(206,196,236,.55)');
          nuc(x, y, rc * .42, rc * .38 * flat, 0, { seed: i * 4 + j });
        });
        G.px = [gx, gy];
      });
      // nutrientes por difusão
      for (const N of NUT) { const q = fr(t / 9 + N.b), ag = q * 9, dx = Math.sqrt(q) * (kw * .95 + pw + cw * .5) * N.k, x = vx + vr + dx, y = vy + N.dy * sh * .42 * Math.sqrt(q) + Math.sin(ag * 1.3 + N.w) * 6;
        circ(x, y, 2.6, rgba('#B8E06A', .95 * (1 - q) * Math.min(1, q * 8)), 'rgba(11,15,28,.5)', .8); }
      X.restore();
      borda(x0, y0, sw, sh, C.cart);
      // painel "onde"
      const ix = side ? A.x0 + sw + (A.w - sw) / 2 : A.x0 + A.w * .14, iy = side ? A.y0 + 26 + sh * .38 : y0 + sh + (A.h - 26 - sh) / 2 + 4, is = side ? Math.min((A.w - sw) * .3, sh * .2) : Math.min((A.h - 26 - sh) * .32, 40);
      [0, 1, 2].forEach(k => icone(k, ix, iy, is, t, [wH, wE, wF][k]));
      const ONDE = ['articulações, traqueia, nariz e costelas', 'orelha e epiglote: dobra e volta', 'discos entre as vértebras e meniscos'];
      if (side) wrapTx(ONDE[tgt], ix, iy + is * 1.6, A.w - sw - 16, { s: 13, c: C.txt, lh: 17 });
      else wrapTx(ONDE[tgt], A.x0 + A.w * .62, iy - 10, A.w * .6, { s: 13, c: C.txt, lh: 17 });
      // rótulos
      lab(vx, vy - vr, vx + 8, y0 + 18, NAR ? 'vaso' : 'vaso (só fora da cartilagem)');
      if (wF < .5) lab(x0 + cw + pw * .5, y0 + sh * .78, x0 + cw + pw + 14, y0 + sh - 14, 'pericôndrio');
      const g1 = GRP.find(G => G.n >= 3 && G.gx > .35 && G.gy > .3 && G.gy < .7) || GRP[10]; if (g1.px) lab(g1.px[0], g1.px[1], g1.px[0] + rc * 5, g1.px[1] + rc * 5, wF > .5 ? 'condrócitos em fileiras' : NAR ? 'grupo isógeno' : 'grupo isógeno (mesma célula-mãe)');
      const g2 = GRP.find(G => G.n === 1 && !G.edge && G.gx > .5 && G.gy > .2) || GRP[20]; if (g2.px) lab(g2.px[0], g2.px[1], g2.px[0] + rc * 5, g2.px[1] - rc * 5, 'condrócito na lacuna');
      if (wE > .6) { const F = ELF[5]; lab(kx + F.x * kw, y0 + F.y * sh, kx + F.x * kw - 30, y0 + F.y * sh - 30, 'fibras elásticas'); }
      if (wF > .6) lab(kx + kw * .6, y0 + sh * .5, kx + kw * .55, y0 + sh * .5 + 36, 'feixes de colágeno');
      if (!NAR) lab(kx + kw * .1, vy + sh * .04, kx + kw * .2, vy + sh * .3, 'nutrientes por difusão');
      cap(['Hialina: matriz lisa e vítrea; sem vasos, os nutrientes chegam por difusão a partir do pericôndrio', 'Elástica: a mesma base, com fibras elásticas que deixam a orelha dobrar e voltar', 'Fibrosa: feixes grossos de colágeno entre fileiras de condrócitos; aguenta pressão e tração'][tgt]);
    }
  });

  // =====================================================================================
  // C4 TECIDO ÓSSEO
  // =====================================================================================
  const TRA = (() => { const R = rng(61), P = []; for (let i = 0; i < 42; i++) { const a = R() * TAU, r = Math.sqrt(R()) * .95; P.push([Math.cos(a) * r, Math.sin(a) * r]); }
    const E = []; for (let i = 0; i < P.length; i++) { const d = P.map((q, j) => [Math.hypot(q[0] - P[i][0], q[1] - P[i][1]), j]).sort((a, b) => a[0] - b[0]); for (let k = 1; k <= 3; k++) { const j = d[k][1]; if (j > i || !E.some(e => e[0] === j && e[1] === i)) E.push([i, j, R()]); } }
    return { P, E }; })();
  const OCY = (() => { const R = rng(67), A = []; for (let r = 1; r <= 5; r++) { const n = 3 + r * 2; for (let i = 0; i < n; i++) A.push({ r, a: (i + R() * .6) / n * TAU }); } return A; })();
  const balO = v => v < -30 ? 'mais reabsorção' : v > 30 ? 'mais formação' : 'equilíbrio';
  function osteon(cx, cy, R, t, a = 1, main = true) {
    X.save(); X.globalAlpha *= a; const rc = R * .17, N = 6;
    for (let i = N; i >= 1; i--) circ(cx, cy, rc + (R - rc) * i / N, mix(OSSO, i % 2 ? C.he_rosa : C.osso, .25), 'rgba(11,15,28,.18)', 1);
    circ(cx, cy, R, null, 'rgba(60,30,60,.6)', 2);  // linha cimentante
    if (main) {
      // canalículos
      for (const o of OCY) { const rr_ = rc + (R - rc) * (o.r - .5) / N, x = cx + Math.cos(o.a) * rr_, y = cy + Math.sin(o.a) * rr_;
        for (const s of [-1, 1]) line(x, y, x + Math.cos(o.a) * s * (R - rc) / N * .95, y + Math.sin(o.a) * s * (R - rc) / N * .95, 'rgba(60,30,60,.55)', .9);
        line(x, y, x + Math.cos(o.a + PI / 2) * 6, y + Math.sin(o.a + PI / 2) * 6, 'rgba(60,30,60,.45)', .8); }
      for (const o of OCY) { const rr_ = rc + (R - rc) * (o.r - .5) / N, x = cx + Math.cos(o.a) * rr_, y = cy + Math.sin(o.a) * rr_;
        ell(x, y, Math.max(3.5, R * .055), Math.max(2, R * .026), o.a + PI / 2, 'rgba(60,30,60,.75)'); nuc(x, y, Math.max(2.4, R * .036), Math.max(1.4, R * .016), o.a + PI / 2, { seed: 3 }); }
      // nutrientes pelos canalículos
      for (let i = 0; i < 12; i++) { const an = OCY[i * 3 % OCY.length].a, q = fr(t * .22 + i * .19); circ(cx + Math.cos(an) * (rc + q * (R - rc)), cy + Math.sin(an) * (rc + q * (R - rc)), 1.8, rgba('#B8E06A', Math.sin(q * PI))); }
    }
    circ(cx, cy, rc, '#2A1420', 'rgba(11,15,28,.6)', 1.2);
    circ(cx - rc * .35, cy - rc * .1, rc * .36, rgba(C.sangue, .95)); circ(cx + rc * .4, cy + rc * .2, rc * .25, '#6F8CFF');
    if (main) circ(cx + rc * .1, cy - rc * .5, rc * .14, '#F2E6B0');
    X.restore();
  }
  function ossoLongo(cx, cy, L, hs, re, o = {}) {
    const ex = L / 2 - re; X.beginPath(); X.ellipse(cx - ex, cy, re, re * .92, 0, 0, TAU); X.moveTo(cx + ex + re, cy); X.ellipse(cx + ex, cy, re, re * .92, 0, 0, TAU); X.rect(cx - ex, cy - hs, ex * 2, hs * 2);
  }
  // osso do experimento: linha média curva com cabeças nas pontas
  function ossoCurvo(cx, cy, L, th, bend, fill, crack) {
    const p = f => { const x = cx + (f - .5) * L * Math.cos(bend * (f - .5) * 2.2), y = cy - Math.sin(PI * f) * bend * L * .35; return [x, y]; };
    const P = []; for (let i = 0; i <= 24; i++) P.push(p(i / 24));
    strokeP(P, 'rgba(11,15,28,.6)', th + 3); strokeP(P, fill, th);
    for (const q of [P[0], P[24]]) { const s = q === P[0] ? -1 : 1; circ(q[0], q[1] - th * .45, th * .62, fill, 'rgba(11,15,28,.5)', 1.2); circ(q[0], q[1] + th * .45, th * .62, fill, 'rgba(11,15,28,.5)', 1.2); void s; }
    if (crack) { const R = rng(9); for (let i = 0; i < 7; i++) { const q = P[3 + i * 3]; poly([[q[0], q[1] - th / 2], [q[0] + (R() - .5) * 8, q[1]], [q[0] + (R() - .5) * 6, q[1] + th / 2]], 'rgba(40,40,40,.8)', 1.2); } }
  }
  def('conjuntivo', 'osso', {
    t: 'Tecido ósseo', s: 'matriz mineralizada e células vivas', c: C.osso, loc: 'Esqueleto: osso compacto na parede, esponjoso nas pontas',
    still: 3, stillV: 0,
    ctl: { l: 'Formação × reabsorção', min: -100, max: 100, step: 5, v: 0, f: balO, rate: () => 1 },
    extra: [{ t: 'Experimento', on: S => { S.exp = !S.exp; S.et = 0; }, pressed: S => !!S.exp }],
    alt: 'No alto, um osso longo cortado ao meio: parede de osso compacto em volta do canal medular e pontas de osso esponjoso, com traves e medula vermelha. Embaixo, à esquerda, a ampliação de um sistema de Havers: anéis de matriz em volta de um canal com vasos, osteócitos nos anéis ligados por canalículos e um canal de Volkmann. À direita, a superfície do osso: osteoblastos depositam matriz rosa que endurece, e um osteoclasto com vários núcleos escava uma cratera e libera cálcio. A faixa pende o equilíbrio para a osteoporose (traves somem) ou para o crescimento. O botão Experimento mostra um osso no vinagre, que fica mole e dobra, e um osso queimado, que esfarela',
    d: `<p>O osso é um conjuntivo de <b>matriz mineralizada</b>: cerca de <b>dois terços</b> da massa são minerais, sobretudo fosfato de cálcio na forma de <b>hidroxiapatita</b>, que dá dureza, e cerca de <b>um terço</b> é matéria orgânica, quase toda <b>colágeno</b>, que dá resistência e alguma flexibilidade. O osso guarda cerca de <b>99% do cálcio</b> do corpo. Três células trabalham nele. Os <b>osteoblastos</b> produzem a matriz; quando ficam presos dentro dela, viram <b>osteócitos</b>, que se comunicam por canalículos finos e mantêm o osso vivo. Os <b>osteoclastos</b>, células grandes com vários núcleos que vêm dos monócitos, <b>reabsorvem</b> a matriz. O equilíbrio entre os dois mantém o osso em renovação constante: um adulto troca cerca de 10% do esqueleto por ano.</p>
<p>No <b>osso compacto</b>, que forma a parede dos ossos longos, a matriz se organiza em camadas concêntricas em volta de canais com vasos e nervos, os <b>sistemas de Havers</b> (ósteons), ligados entre si por canais transversais (de Volkmann). No <b>osso esponjoso</b>, nas pontas dos ossos longos e no interior dos ossos chatos, a matriz forma uma rede de traves, e os espaços são ocupados pela <b>medula óssea vermelha</b>, que produz as células do sangue (ver <a href="#sangue/elementos">elementos do sangue</a>). O cálcio do sangue é regulado por hormônios: o <b>paratormônio</b> (das paratireoides) estimula os osteoclastos e libera cálcio do osso; a <b>calcitonina</b> (da tireoide) faz o contrário; a <b>vitamina D</b>, que a pele produz com o sol, aumenta a absorção de cálcio no intestino. Na <b>osteoporose</b>, a reabsorção supera a formação e os ossos ficam porosos e frágeis, o que é comum depois da menopausa, com a queda do estrogênio.</p>
<p>A faixa pende o equilíbrio entre formação e reabsorção. O botão "Experimento" mostra o que acontece com um osso no vinagre e com um osso queimado.</p>`,
    kv: [['Minerais (hidroxiapatita)', 'cerca de 2/3 da massa: dureza'], ['Matéria orgânica (colágeno)', 'cerca de 1/3: resistência e flexibilidade'], ['Osteoblasto', 'forma a matriz'], ['Osteócito', 'osteoblasto preso na matriz; mantém o osso'], ['Osteoclasto', 'multinucleado; reabsorve a matriz'], ['Paratormônio', 'tira cálcio do osso para o sangue (osteoclastos)'], ['Calcitonina', 'faz o contrário: guarda cálcio no osso']],
    enem: 'O experimento clássico: osso no <b>ácido</b> (vinagre) perde o <b>cálcio</b> e fica <b>flexível</b>; osso <b>queimado</b> perde o <b>colágeno</b> e fica <b>quebradiço</b>. Conclusão: o mineral dá <b>dureza</b> e o colágeno, <b>flexibilidade e resistência</b>. Liga-se também à saúde: <b>cálcio</b>, <b>vitamina D</b> (sol) e exercício previnem a <b>osteoporose</b>. O osso é vivo e se renova: <b>osteoblasto forma, osteoclasto reabsorve</b>.',
    links: [['Elementos do sangue', '#sangue/elementos'], ['Formação dos ossos', '#conjuntivo/ossificacao']],
    draw(t, S) {
      const A = area(), b = cl(S.v / 100, -1, 1), Fo = .5 + b / 2, Re = .5 - b / 2;
      if (S.exp) { S.et = (S.et || 0) + S.dt; return this.exp(A, S.et, t); }
      // ----- osso longo
      const bh = A.h * (NAR ? .25 : .29), L = A.w * .86, re = Math.min(bh * .46, L * .1), hs = re * .6, bcx = A.cx, bcy = A.y0 + 6 + bh / 2;
      const twl = hs * .48 * (1 + b * .25), ex = L / 2 - re;
      ossoLongo(bcx, bcy, L, hs, re); X.strokeStyle = 'rgba(11,15,28,.7)'; X.lineWidth = 3; X.stroke(); X.fillStyle = OSSO; X.fill();
      rr(bcx - ex, bcy - hs + twl, ex * 2, (hs - twl) * 2, 3, mix('#E8C77A', C.sangue, .35));
      const loss = Math.max(0, -b) * .65, lw = 1.6 * (1 + b * .5);
      for (const s of [-1, 1]) {
        const ox = bcx + s * ex; X.save(); X.beginPath(); X.ellipse(ox, bcy, re * .86, re * .94, 0, 0, TAU); X.rect(Math.min(ox, ox - s * re * .9), bcy - hs + twl, re * .9, (hs - twl) * 2); X.clip();
        X.fillStyle = mix(C.sangue, BG, .35); X.fillRect(ox - re, bcy - re * 1.1, re * 2, re * 2.2);
        for (const e of TRA.E) { if (e[2] < loss) continue; const p = TRA.P[e[0]], q = TRA.P[e[1]]; line(ox + p[0] * re, bcy + p[1] * re, ox + q[0] * re, bcy + q[1] * re, OSSO, lw); }
        X.restore();
      }
      const zx = bcx + L * .12, zy = bcy - hs + twl / 2; rr(zx - 7, zy - 6, 14, 12, 3, null, '#fff', 1.5);
      const boneLabs = () => { if (NAR) return; lab(bcx - ex * .4, bcy - hs + twl / 2, bcx - ex * .15, bcy - re - 6, 'osso compacto'); lab(bcx + ex * .3, bcy, bcx + ex * .1, bcy - re - 6, 'canal medular'); };
      lab(bcx - ex, bcy - re * .3, bcx - ex + re * 1.6, bcy - re - 8, NAR ? 'esponjoso' : 'osso esponjoso e medula vermelha');
      // ----- painéis de baixo
      const ty = A.y0 + bh + 18, rest = A.y1 - ty;
      let O, Rp;
      if (NAR) { O = [A.x0, ty, A.w, rest * .5]; Rp = [A.x0, ty + rest * .5 + 6, A.w, rest * .5 - 6]; } else { O = [A.x0, ty, A.w * .48, rest]; Rp = [A.x0 + A.w * .52, ty, A.w * .48, rest]; }
      // ósteon
      const oR = Math.min(O[2] * (NAR ? .3 : .34), O[3] * .44), ocx = O[0] + O[2] * (NAR ? .38 : .45), ocy = O[1] + O[3] * .52;
      line(zx, zy + 6, ocx, ocy - oR, 'rgba(232,237,247,.4)', 1.2, [4, 4]);
      X.save(); X.beginPath(); X.roundRect(O[0], O[1], O[2], O[3], 12); X.clip();
      X.fillStyle = mix(OSSO, BG, .25); X.fillRect(O[0], O[1], O[2], O[3]);
      for (let i = 0; i < 9; i++) line(O[0], O[1] + O[3] * i / 9 + 4, O[0] + O[2], O[1] + O[3] * i / 9 - 6, 'rgba(11,15,28,.12)', 3);
      osteon(ocx + oR * 2.05, ocy - oR * .6, oR * .85, t, .85, false); osteon(ocx - oR * 1.95, ocy + oR * .5, oR * .8, t, .85, false); osteon(ocx + oR * 1.6, ocy + oR * 1.45, oR * .75, t, .85, false);
      // canal de Volkmann
      const va = -.3, v1 = [ocx + Math.cos(va) * oR * .17, ocy + Math.sin(va) * oR * .17], v2 = [ocx + oR * 2.05 + Math.cos(va + PI) * oR * .14, ocy - oR * .6 + Math.sin(va + PI) * oR * .14];
      line(v1[0], v1[1], v2[0], v2[1], '#2A1420', oR * .12); line(v1[0], v1[1], v2[0], v2[1], rgba(C.sangue, .9), oR * .05);
      osteon(ocx, ocy, oR, t, 1, true);
      line(v1[0], v1[1], lerp(v1[0], v2[0], .5), lerp(v1[1], v2[1], .5), '#2A1420', oR * .12); line(v1[0], v1[1], lerp(v1[0], v2[0], .5), lerp(v1[1], v2[1], .5), rgba(C.sangue, .9), oR * .05);
      X.restore(); borda(O[0], O[1], O[2], O[3], C.osso);
      tx(NAR ? 'sistema de Havers' : 'sistema de Havers (ósteon) ampliado', O[0] + 10, O[1] + 14, { s: 12, w: 600, a: 'left', c: C.txt });
      lab(ocx, ocy, ocx - oR * 1.2, ocy + oR * 1.05, 'canal de Havers');
      const o5 = OCY.find(o => o.r === 4 && Math.cos(o.a) > .6) || OCY[20], r5 = oR * .17 + (oR * .83) * 3.5 / 6; lab(ocx + Math.cos(o5.a) * r5, ocy + Math.sin(o5.a) * r5, ocx + oR * 1.25, ocy + oR * .15, 'osteócito');
      const ostLabs = () => { if (NAR) return; lab(ocx - oR * .62, ocy - oR * .5, ocx - oR * 1.3, ocy - oR * .2, 'lamelas'); lab(lerp(v1[0], v2[0], .62), lerp(v1[1], v2[1], .62), ocx + oR * 1.3, ocy - oR * 1.05, 'canal de Volkmann'); };
      // superfície: osteoblastos e osteoclasto
      const [rx, ry, rw, rh] = Rp, sy = ry + rh * .62, p = fr(t / 7), fade = 1 - ss(seg(p, .9, 1)), gp = ss(seg(p, .05, .85));
      X.save(); X.beginPath(); X.roundRect(rx, ry, rw, rh, 12); X.clip();
      X.fillStyle = mix(C.sangue, BG, .55); X.fillRect(rx, ry, rw, rh);
      const th = Fo * rh * .12 * gp * fade, dp = Re * rh * .2 * gp * fade, ccx = rx + rw * .74, cwid = rw * .17;
      const surf = x => sy - (x < rx + rw * .5 ? th : 0) + (Math.abs(x - ccx) < cwid ? dp * Math.cos((x - ccx) / cwid * PI / 2) ** 2 : 0);
      X.beginPath(); X.moveTo(rx, ry + rh); for (let x = rx; x <= rx + rw + 1; x += 3) X.lineTo(x, Math.max(sy, surf(x)) + (x < rx + rw * .5 ? 0 : 0)); X.lineTo(rx + rw, ry + rh); X.closePath(); X.fillStyle = OSSO; X.fill();
      for (let i = 1; i < 4; i++) line(rx, sy + i * (rh * .38) / 4, rx + rw, sy + i * (rh * .38) / 4, 'rgba(11,15,28,.12)', 2);
      nuc(rx + rw * .3, sy + rh * .2, 4, 2, 0, { seed: 8 }); ell(rx + rw * .3, sy + rh * .2, 6, 3.4, 0, null, 'rgba(60,30,60,.7)', 1);
      // matriz nova (rosa) que mineraliza de baixo para cima
      if (th > .5) { const mn = ss(seg(p, .35, 1)); rr(rx, sy - th, rw * .5, th, 0, mix(C.he_rosa, BG, .05)); rr(rx, sy - th * mn * .8, rw * .5, th * mn * .8, 0, OSSO); }
      const cs = Math.min(rw * .5 / 6, rh * .16);
      for (let i = 0; i < 6; i++) { const x = rx + (i + .5) * rw * .5 / 6, y = sy - th - cs * .5; rr(x - cs * .45, y - cs * .5, cs * .9, cs, 3, CIT, INK, 1); nuc(x, y - cs * .1, cs * .25, cs * .22, 0, { seed: i }); }
      // osteoclasto
      const ocY = sy + dp - cs * .55, ocW = cwid * 1.1;
      X.beginPath(); X.ellipse(ccx, ocY - cs * .2, ocW, cs * .95, 0, PI, TAU); X.lineTo(ccx + ocW, ocY + cs * .25);
      for (let k = 12; k >= 0; k--) X.lineTo(ccx - ocW + k / 12 * ocW * 2, ocY + cs * .25 + (k % 2 ? 4 : 0)); X.closePath();
      X.fillStyle = 'rgba(236,170,200,.82)'; X.fill(); X.strokeStyle = INK; X.lineWidth = 1; X.stroke();
      for (let k = 0; k < 5; k++) nuc(ccx - ocW * .6 + k * ocW * .3, ocY - cs * .45 + (k % 2) * 4, cs * .18, cs * .15, 0, { seed: 20 + k });
      if (Re > .15) for (let k = 0; k < 3; k++) { const q = fr(t * .4 + k / 3); circ(ccx + (k - 1) * cwid * .4, ocY - cs * 1.2 - q * rh * .25, 3, rgba(C.ca, Math.sin(q * PI) * Re * 1.6)); }
      X.restore(); borda(rx, ry, rw, rh, C.osso);
      const bw = Math.min(rw * .36, 150), bx1 = rx + 12, bx2 = rx + rw - bw - 12, by = ry + 30;
      hbar(bx1, by, bw, 8, Fo, C.he_rosa, 'formação', Math.round(Fo * 100) + '%'); hbar(bx2, by, bw, 8, Re, C.ca, 'reabsorção', Math.round(Re * 100) + '%');
      lab(rx + rw * .2, sy - th - cs, rx + rw * .2, ry + rh * .38, 'osteoblastos');
      lab(ccx, ocY - cs * .9, ccx - rw * .1, ry + rh * .38, 'osteoclasto');
      boneLabs(); ostLabs();
      if (Re > .15 && !NAR) tok(ccx + cwid * 1.1, ocY - cs * 1.6, 'Ca²⁺', C.ca, { a: Math.min(1, Re * 2) });
      cap(b < -.3 ? 'Reabsorção maior que a formação: as traves do osso esponjoso afinam e somem (osteoporose)' : b > .3 ? 'Formação maior que a reabsorção: o osso ganha massa (infância, exercício)' : 'Equilíbrio: osteoblastos formam e osteoclastos reabsorvem na mesma medida; o osso se renova sem mudar de massa');
    },
    exp(A, et, t) {
      const half = NAR ? A.h / 2 : A.w / 2, c1 = NAR ? [A.cx, A.y0 + half * .48] : [A.x0 + half * .5, A.cy], c2 = NAR ? [A.cx, A.y0 + half * 1.5] : [A.x0 + half * 1.5, A.cy];
      const p = fr(et / 10), soak = p < .4, L = Math.min(NAR ? A.w * .55 : half * .66, 340), th = L * .09;
      head('Osso no vinagre (ácido)', c1[0], (NAR ? c1[1] - half * .42 : A.cy - L * .45)); head('Osso queimado', c2[0], (NAR ? c2[1] - half * .42 : A.cy - L * .45));
      // vinagre
      if (soak) { const bw = L * 1.25, bh_ = th * 5; rr(c1[0] - bw / 2, c1[1] - bh_ / 2, bw, bh_, 10, 'rgba(240,230,170,.18)', 'rgba(232,237,247,.7)', 2); ossoCurvo(c1[0], c1[1], L, th, 0, OSSO);
        for (let i = 0; i < 8; i++) { const q = fr(et * .7 + i / 8); circ(c1[0] - L / 2 + i * L / 7, c1[1] + th - q * bh_ * .45, 2.5, 'rgba(255,255,255,.5)'); }
        tx(`dias no vinagre: ${Math.round(ss(p / .4) * 7)}`, c1[0], c1[1] + bh_ / 2 + 16, { s: 13, f: FD, c: C.txt });
      } else { const bnd = Math.sin((p - .4) / .6 * TAU * 2) * .55; ossoCurvo(c1[0], c1[1] + L * .1, L, th, Math.abs(bnd), mix(OSSO, '#D8C9A0', .4));
        tx('dobra sem quebrar', c1[0], c1[1] + L * .1 + th * 2.2, { s: 13, c: C.txt }); }
      // queimado
      const burn = ss(seg(p, 0, .4)), col = mix(OSSO, '#F4F2EC', burn);
      if (soak) { for (let i = 0; i < 7; i++) { const fx = c2[0] - L * .4 + i * L * .13, fh = th * (2 + Math.sin(t * 9 + i * 2) * .6); X.beginPath(); X.moveTo(fx - 7, c2[1] + th * 3); X.quadraticCurveTo(fx, c2[1] + th * 3 - fh * 2, fx + 7, c2[1] + th * 3); X.fillStyle = rgba(CALOR, .8); X.fill(); }
        ossoCurvo(c2[0], c2[1], L, th, 0, col); }
      else { const br = ss(seg(p, .5, .75)); ossoCurvo(c2[0], c2[1], L, th, 0, col, true);
        const R = rng(17); for (let i = 0; i < 22; i++) { const x = c2[0] + (R() - .5) * L, y = c2[1] + th / 2 + br * (10 + R() * L * .3); ngon(x, y, 2 + R() * 3, 5, R() * 3, rgba('#F4F2EC', .9 * Math.min(1, br * 3)), 'rgba(11,15,28,.5)', .8); }
        tx('esfarela', c2[0], c2[1] + th * 2.2 + L * .32, { s: 13, c: C.txt }); }
      if (!NAR) line(A.cx, A.y0 + 30, A.cx, A.y1 - 10, 'rgba(91,108,153,.3)', 1);
      cap(soak ? 'Um osso fica no vinagre (ácido) e outro vai ao fogo' : 'No vinagre, o osso perde o mineral (cálcio) e fica flexível; no fogo, perde o colágeno e fica quebradiço: o mineral dá dureza e o colágeno, flexibilidade');
    }
  });

  // =====================================================================================
  // C5 OSSIFICAÇÃO
  // =====================================================================================
  const CRN = [{ x: -.4, y: -.58, n: 'frontal' }, { x: .4, y: -.58, n: 'frontal' }, { x: -.5, y: .15, n: 'parietal' }, { x: .5, y: .15, n: 'parietal' }, { x: 0, y: .86, n: 'occipital' }];
  const idade = v => v < 25 ? null : v < 40 ? (v - 25) / 15 * 2 : v < 70 ? 2 + (v - 40) / 30 * 10 : v < 90 ? 12 + (v - 70) / 20 * 8 : 20 + (v - 90) / 10 * 5;
  const idTx = v => { if (v < 12) return 'embrião'; if (v < 24) return 'feto'; if (v < 26) return 'nascimento'; const a = idade(v); if (a < 1) { const m = Math.max(1, Math.round(a * 12)); return m === 12 ? '1 ano' : m + (m === 1 ? ' mês' : ' meses'); } const y = Math.round(a); return y + (y === 1 ? ' ano' : ' anos'); };
  const CHON = (() => { const R = rng(71), A = []; for (let i = 0; i < 60; i++) A.push([R() * 2 - 1, R() * 2 - 1]); return A; })();
  function cranio(cx, cy, R, v, t) {
    const rx = R * .78, ry = R, P0 = []; for (let i = 0; i < 64; i++) { const a = i / 64 * TAU; P0.push([Math.cos(a) * .78, Math.sin(a)]); }
    const toS = q => [cx + q[0] * R, cy + q[1] * R];
    // mesênquima / membrana
    ell(cx, cy, rx, ry, 0, mix(C.he_rosa, BG, .5), 'rgba(232,237,247,.5)', 1.5);
    const Rg = rng(3); for (let i = 0; i < 70; i++) { const a = Rg() * TAU, r = Math.sqrt(Rg()) * .95; circ(cx + Math.cos(a) * r * rx, cy + Math.sin(a) * r * ry, 1.6, rgba(C.he_nucleo, .7)); }
    const gr = 1.25 * ss(seg(v, 4, 24)), g = .022;
    CRN.forEach((c, i) => {
      let P = P0; CRN.forEach((d, j) => { if (j === i) return; const dx = d.x - c.x, dy = d.y - c.y, L = Math.hypot(dx, dy), nx = dx / L, ny = dy / L, k = (d.x * d.x + d.y * d.y - c.x * c.x - c.y * c.y) / (2 * L) - g; P = clipHalf(P, nx, ny, k); });
      if (P.length < 3 || gr <= 0) return;
      X.save(); pathP(P.map(toS)); X.clip();
      const ccx = cx + c.x * R, ccy = cy + c.y * R; circ(ccx, ccy, gr * R, OSSO);
      for (let k = 0; k < 18; k++) { const a = k / 18 * TAU + i; line(ccx, ccy, ccx + Math.cos(a) * gr * R, ccy + Math.sin(a) * gr * R, 'rgba(150,90,110,.35)', 1.2); }
      circ(ccx, ccy, Math.max(2, R * .03), rgba(C.he_nucleo, .7));
      X.restore();
    });
    // fontanelas (membrana que ainda não virou osso)
    const ka = v < 25 ? 1 : 1 - ss(seg(v, 25, 40)), kp = v < 25 ? 1 : 1 - ss(seg(v, 25, 28)), fc = mix(C.he_rosa, BG, .45);
    const fa = [cx, cy - .165 * R], fp = [cx, cy + .32 * R];
    if (v > 18 && ka > .01) shape([[fa[0], fa[1] - R * .26 * ka], [fa[0] + R * .17 * ka, fa[1]], [fa[0], fa[1] + R * .2 * ka], [fa[0] - R * .17 * ka, fa[1]]], fc, 'rgba(232,237,247,.6)', 1.2);
    if (v > 18 && kp > .01) shape([[fp[0] - R * .1 * kp, fp[1] - R * .03 * kp], [fp[0] + R * .1 * kp, fp[1] - R * .03 * kp], [fp[0], fp[1] + R * .13 * kp]], fc, 'rgba(232,237,247,.6)', 1.2);
    ell(cx, cy, rx, ry, 0, null, 'rgba(232,237,247,.6)', 1.5);
    tx('frente', cx, cy - ry - 10, { s: 12, c: C.dim, bg: false });
    return { fa, fp, ka, kp, gr };
  }
  function ossoEndo(cx, cy, Lmax, v, t) {
    const len = v < 25 ? lerp(.32, .5, v / 25) : v < 40 ? lerp(.5, .6, (v - 25) / 15) : v < 70 ? lerp(.6, .84, (v - 40) / 30) : v < 90 ? lerp(.84, 1, (v - 70) / 20) : 1;
    const L = Lmax * len, re = L * .11, hs = re * .56, ex = L / 2 - re, sh = ss(seg(v, 0, 4));
    // contorno do adulto (tracejado)
    ossoLongo(cx, cy, Lmax, Lmax * .0616, Lmax * .11); X.setLineDash([5, 5]); X.strokeStyle = 'rgba(232,237,247,.28)'; X.lineWidth = 1.2; X.stroke(); X.setLineDash([]);
    X.save(); X.globalAlpha = .35 + .65 * sh;
    ossoLongo(cx, cy, L, hs, re); X.strokeStyle = 'rgba(11,15,28,.7)'; X.lineWidth = 3; X.stroke(); X.fillStyle = mix(C.cart, BG, .15); X.fill();
    X.save(); ossoLongo(cx, cy, L, hs, re); X.clip();
    for (const q of CHON) circ(cx + q[0] * L / 2, cy + q[1] * re, 1.6, rgba(C.he_nucleo, .65));
    const pc = ss(seg(v, 8, 16)), mc = ss(seg(v, 12, 22)), sc = ss(seg(v, 25, 38)), cc = ss(seg(v, 88, 96));
    const pw = re * .24, dEnd = ex - re * .62;          // fim do osso da diáfise; disco logo depois
    if (pc > 0) { const xb = lerp(re * .25, dEnd, pc); rr(cx - xb, cy - re * 1.2, xb * 2, re * 2.4, 0, OSSO);
      for (let k = -4; k <= 4; k++) line(cx - xb, cy + k * hs * .22, cx + xb, cy + k * hs * .22, 'rgba(150,90,110,.25)', 1); }
    if (mc > 0) { const xc = lerp(0, dEnd - re * .1, mc), hc = hs * .55; rr(cx - xc, cy - hc, xc * 2, hc * 2, 3, mix(mix(C.sangue, BG, .3), mix('#E8C77A', C.sangue, .35), ss(seg(v, 70, 90)))); }
    if (sc > 0) for (const s of [-1, 1]) { const ox = cx + s * ex; X.save(); X.beginPath(); X.ellipse(ox, cy, re * .8, re * .8, 0, 0, TAU); X.clip();
      X.beginPath(); X.rect(s < 0 ? ox - re : cx + s * (dEnd + pw), cy - re * 1.2, s < 0 ? (cx - dEnd - pw) - (ox - re) : (ox + re) - (cx + dEnd + pw), re * 2.4); X.clip();
      circ(ox, cy, re * 1.15 * sc, OSSO); circ(ox, cy, re * .55 * sc, mix(C.sangue, BG, .35)); X.restore(); }
    // disco epifisário que fecha no fim
    if (sc > .3) for (const s of [-1, 1]) { const x = cx + s * (dEnd + pw / 2); line(x, cy - re, x, cy + re, mix(mix(C.cart, BG, .1), OSSO, cc), pw * (1 - cc * .85)); if (cc > .5) line(x, cy - re * .95, x, cy + re * .95, 'rgba(150,90,110,.5)', 1); }
    X.restore();
    X.restore();
    // vasos entrando
    if (v > 11) { const a = ss(seg(v, 11, 14)); X.save(); X.globalAlpha = a; poly([[cx + re * .2, cy + re * 1.9], [cx + re * .1, cy + hs], [cx, cy]], C.sangue, 2.5); X.restore(); }
    if (v > 27) { const a = ss(seg(v, 27, 32)); X.save(); X.globalAlpha = a; for (const s of [-1, 1]) poly([[cx + s * ex, cy + re * 1.7], [cx + s * ex, cy + re * .4]], C.sangue, 2.2); X.restore(); }
    // setas de crescimento nos discos
    const grow = v > 30 && v < 90;
    if (grow) for (const s of [-1, 1]) { const x = cx + s * (dEnd + pw / 2), q = fr(t * .8); X.save(); X.globalAlpha = Math.sin(q * PI); arrow(x, cy - re * 1.35, x + s * (10 + q * 14), cy - re * 1.35, AMB, 2.5); X.restore(); }
    return { L, re, hs, ex, dEnd, pw, pc, mc, sc, cc };
  }
  def('conjuntivo', 'ossificacao', {
    t: 'Formação e crescimento dos ossos', s: 'da membrana ou da cartilagem', c: C.osso, loc: 'Crânio (intramembranosa) e ossos longos (endocondral)',
    still: 2, stillV: 32,
    ctl: { l: 'Idade', min: 0, max: 100, step: 1, v: 0, f: idTx, rate: () => 1 },
    auto: 7,
    alt: 'Duas trilhas lado a lado. Intramembranosa: o crânio do bebê visto de cima; no mesênquima surgem pontos de osso que crescem e se juntam em placas, deixando as fontanelas, que fecham com a idade (a posterior em poucos meses, a anterior até cerca de 2 anos). Endocondral: um molde de cartilagem azul-claro em forma de osso longo; o centro vira osso, chega um vaso, surge o canal medular, depois os centros nas pontas, e sobram os discos epifisários; o osso se alonga enquanto os discos existem e para de crescer quando eles fecham, por volta dos 20 anos. Uma linha do tempo marca nascimento, 2 anos, puberdade e cerca de 20 anos',
    d: `<p>Os ossos se formam de dois jeitos. Na <b>ossificação intramembranosa</b>, o tecido mesenquimal do embrião vira osso diretamente: é assim que se formam os ossos chatos do crânio e parte da clavícula. Ao nascer, esses ossos ainda não se juntaram, e os espaços de tecido fibroso entre eles são as <b>fontanelas</b> (a "moleira"), que permitem à cabeça se ajustar no parto e ao cérebro crescer, e se fecham até os dois anos, mais ou menos. Na <b>ossificação endocondral</b>, primeiro se forma um molde de <b>cartilagem hialina</b>, que depois é destruído e substituído por osso: é o caso dos ossos longos, das vértebras e da maioria dos ossos do corpo.</p>
<p>Nos ossos longos sobra, entre a ponta (epífise) e o corpo (diáfise), uma faixa de cartilagem, o <b>disco epifisário</b> (placa de crescimento). A cartilagem dele se multiplica de um lado e vira osso do outro, e assim o osso <b>cresce em comprimento</b>. No fim da puberdade (mais cedo nas meninas, por volta dos 15 a 17 anos; nos meninos, até cerca de 21), o disco é todo substituído por osso e o crescimento em altura para; por isso uma radiografia da mão permite estimar a idade óssea. O hormônio do crescimento (GH) e os hormônios sexuais controlam esse processo. Quando um osso quebra, forma-se primeiro um calo de cartilagem e de tecido fibroso, que depois vira osso, repetindo em parte a ossificação endocondral.</p>
<p>A faixa avança a idade, do embrião ao adulto. O contorno tracejado mostra o tamanho do osso adulto.</p>`,
    kv: [['Intramembranosa', 'mesênquima vira osso direto: ossos chatos do crânio, parte da clavícula'], ['Endocondral', 'molde de cartilagem hialina substituído por osso: ossos longos, vértebras'], ['Fontanelas', 'fecham até cerca de 2 anos'], ['Disco epifisário', 'cresce em comprimento; fecha no fim da puberdade']],
    enem: 'A pergunta mais comum é <b>por que paramos de crescer</b>: o <b>disco epifisário</b> (cartilagem de crescimento) é substituído por osso no fim da puberdade. Também cai a ideia de que muitos ossos começam como <b>cartilagem</b> (ossificação endocondral) e de que a "moleira" do bebê é um espaço entre ossos do crânio ainda em formação (ossificação intramembranosa).',
    links: [['Cartilagem', '#conjuntivo/cartilagem'], ['Tecido ósseo', '#conjuntivo/osso'], [LK.folhetos[0], LK.folhetos[1]]],
    draw(t, S) {
      const A = area(), v = cl(S.v, 0, 100), tlH = 40, top = A.y0, bot = A.y1 - tlH;
      let K, Bo, Lmax;
      if (NAR) { const hh = bot - top; K = [A.cx, top + 22 + hh * .27, Math.min(hh * .22, A.w * .3)]; Bo = [A.cx, top + hh * .8]; Lmax = A.w * .82; head('Intramembranosa: crânio', A.cx, top + 6); head('Endocondral: osso longo', A.cx, top + hh * .58); }
      else { const lw = A.w * .38; K = [A.x0 + lw / 2, top + 34 + (bot - top - 34) / 2, Math.min((bot - top - 50) * .42, lw * .45)]; Bo = [A.x0 + lw + (A.w - lw) / 2, K[1]]; Lmax = (A.w - lw) * .86; head('Intramembranosa (crânio visto de cima)', K[0], top + 18); head('Endocondral (osso longo)', Bo[0], Bo[1] - Lmax * .143 - 46);
        line(A.x0 + lw, top + 26, A.x0 + lw, bot - 6, 'rgba(91,108,153,.3)', 1); }
      const c = cranio(K[0], K[1], K[2], v, t), o = ossoEndo(Bo[0], Bo[1], Lmax, v, t);
      // rótulos do crânio
      if (v >= 4 && v < 22) lab(K[0] + CRN[2].x * K[2], K[1] + CRN[2].y * K[2], K[0] - K[2] * 1.1, K[1] + K[2] * .9, 'centro de ossificação');
      else if (v < 4) lab(K[0], K[1], K[0] - K[2] * 1.05, K[1] + K[2] * .9, 'mesênquima');
      if (v > 18 && c.ka > .1) lab(c.fa[0], c.fa[1], K[0] + K[2] * .95, K[1] - K[2] * .75, NAR ? 'fontanela anterior' : 'fontanela anterior (moleira)');
      if (v > 18 && c.kp > .1) lab(c.fp[0], c.fp[1], K[0] + K[2] * .95, K[1] + K[2] * .7, 'fontanela posterior');
      if (v >= 40) lab(K[0], K[1] + K[2] * .02, K[0] + K[2] * .95, K[1] - K[2] * .1, 'sutura');
      // rótulos do osso longo
      const y1 = Bo[1] + o.re * 1.3 + 16, y2 = Bo[1] - o.re * 1.3 - 16;
      if (o.pc < .5) lab(Bo[0] + o.ex * .5, Bo[1], Bo[0] + o.ex * .4, y2, NAR ? 'molde de cartilagem' : 'molde de cartilagem hialina');
      else if (o.sc < .3) lab(Bo[0], Bo[1] - o.hs * .8, Bo[0] - o.ex * .3, y2, 'centro primário');
      if (o.mc > .5) lab(Bo[0] - o.ex * .3, Bo[1], Bo[0] - o.ex * .35, y1, 'canal medular');
      if (o.sc > .5 && o.cc < .5) lab(Bo[0] + o.dEnd + o.pw / 2, Bo[1] + o.re * .4, Bo[0] + o.dEnd + o.pw / 2 + 4, NAR ? y2 : y1, NAR ? 'disco epifisário' : 'disco epifisário (cresce aqui)');
      if (o.sc > .3 && o.sc < 1 && v < 45) lab(Bo[0] - o.ex, Bo[1], Bo[0] - o.ex * .6, y2, 'centro secundário');
      if (o.cc > .5) lab(Bo[0] + o.dEnd + o.pw / 2, Bo[1] + o.re * .4, Bo[0] + o.dEnd + o.pw / 2 + 4, y1, NAR ? 'disco fechado' : 'disco fechado: parou de crescer');
      if (v >= 88) lab(Bo[0] - o.ex - o.re * .9, Bo[1] - o.re * .3, Bo[0] - o.ex * .75, y2, 'cartilagem articular');
      if (v > 11 && v < 25) lab(Bo[0] + o.re * .2, Bo[1] + o.re * 1.6, Bo[0] - o.ex * .6, y1, 'vaso sanguíneo');
      // linha do tempo
      const lx0 = A.x0 + 16, lx1 = A.x1 - 16, ly = A.y1 - 18, fx = u => lerp(lx0, lx1, u / 100);
      line(lx0, ly, lx1, ly, 'rgba(91,108,153,.7)', 3);
      [[25, 'nascimento', 1], [40, '2 anos', -1], [70, 'puberdade', 1], [90, 'cerca de 20 anos', -1]].forEach(([u, s, side]) => { line(fx(u), ly - 5, fx(u), ly + 5, C.dim, 1.5); const hw = tw(s, 12) / 2 + 2; tx(s, cl(fx(u), lx0 + hw, lx1 - hw), ly + side * 13, { s: 12, c: C.dim, bg: false }); });
      marker(fx(v), ly, AMB);
      cap(v < 4 ? 'Embrião: mesênquima no lugar do crânio e um molde de cartilagem no lugar do osso longo' : v < 12 ? 'No crânio surgem centros de osso no próprio mesênquima; o osso longo ainda é cartilagem' : v < 24 ? 'O centro do molde vira osso, chega um vaso e abre-se o canal medular; as placas do crânio crescem' : v < 40 ? 'Ao nascer sobram as fontanelas; nas pontas do osso surgem os centros secundários e ficam os discos epifisários' : v < 88 ? 'Infância e puberdade: os discos epifisários fazem o osso crescer em comprimento' : 'Fim da puberdade: os discos viram osso e o crescimento em altura para');
    }
  });
}
