/* LAB, módulo Vírus. Cenas B (Apolo): Fagos (ciclo lítico, ciclo lisogênico) e Replicação (vírus em células animais).
   Fonte científica: docs/revisao-biologia/virus-roteiro.md (Taxon, F1, F2 e R1, com a revisão do Sapien).
   Usa a API do motor.js (def, area, tx, mtx, title, wrapTx, panel, lab, cap, hitR, hitAt, fago, bacteriaCorte, cromCirc,
   novelo, fita, icosa, envelope, virion, espicula, receptor, membrana, baralho, C...). Resumo: /tmp/claude-0/vir/api.md.
   Código, desenhos e textos da equipe; desenhos esquemáticos, fora de escala. */
'use strict';
{
  const NOTA = 'Desenho esquemático, fora de escala';
  const UV = '#8FD8FF';                       // luz ultravioleta (só em F2)
  const CARTA = 'rgba(19,26,43,.94)', BORDA = 'rgba(157,169,196,.5)', FUNDO = '#0B0F1C';
  const BEAD = mix('#1A2033', C.capsideo, .7); // capsômero solto (mesmo tom do motor)

  // ---------- utilidades locais ----------
  function poeV(S, v, ctl) {
    S.v = v; S.touch = performance.now();
    const r = $('ctlR'), vv = $('ctlV');
    if (r) { r.value = v; r.setAttribute('aria-valuetext', ctl.f(v)); }
    if (vv) vv.textContent = ctl.f(v);
  }
  const embaralha = (a, R) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // posições fixas (semente), normalizadas de -1 a 1, dentro de um círculo de raio lim; o 3º valor é um sorteio de 0 a 1
  function pontos(n, seed, lim = .8) { const R = rng(seed), out = []; while (out.length < n) { const x = R() * 2 - 1, y = R() * 2 - 1; if (x * x + y * y < lim * lim) out.push([x, y, R()]); } return out; }

  // etapas numeradas. Computador: coluna à esquerda; celular: fila de bolinhas e o nome da etapa atual
  function etapas(R, nomes, cur) {
    const n = nomes.length;
    if (!NAR) {
      const rh = Math.min(40, R.h / n);
      nomes.forEach((s, i) => {
        const y = R.y + i * rh + rh / 2, on = i === cur, feito = i < cur;
        if (on) rr(R.x, y - rh / 2 + 3, R.w, rh - 6, 8, 'rgba(255,179,71,.12)', rgba(C.amber, .7), 1);
        circ(R.x + 18, y, 11, on ? C.amber : 'rgba(19,26,43,.95)', on ? C.amber : feito ? C.txt : C.line, 1.5);
        tx(String(i + 1), R.x + 18, y + .5, { s: 12, w: 700, f: FD, c: on ? FUNDO : feito ? C.txt : C.dim, bg: false });
        title(s, R.x + 36, y, R.w - 42, { a: 'left', s: 14, f: FT, w: on ? 700 : 600, c: on ? '#fff' : feito ? C.txt : C.dim });
      });
    } else {
      const r = 12, gap = 30, y = R.y + r;
      nomes.forEach((s, i) => {
        const on = i === cur, feito = i < cur, x = R.x + r + i * gap;
        circ(x, y, r, on ? C.amber : 'rgba(19,26,43,.95)', on ? C.amber : feito ? C.txt : C.line, 1.5);
        tx(String(i + 1), x, y + .5, { s: 12, w: 700, f: FD, c: on ? FUNDO : feito ? C.txt : C.dim, bg: false });
      });
      title(nomes[cur], R.x + n * gap + 4, y, R.w - n * gap - 4, { a: 'left', s: 14 });
    }
  }
  // cartão tocável (mesmo desenho dos cartões do baralho do motor); devolve a altura
  function cartao(x, y, w, s, o = {}) {
    const sz = NAR ? 13 : 14, lh = sz + 4, tw0 = w - 20 - (o.num ? 26 : 0), hT = wrapTx(s, 0, 0, tw0, { s: sz, w: 600, lh, dry: true }), h = Math.max(o.h || 0, hT + 14);
    const borda = o.erro ? C.erro : o.ok ? C.ok : o.sel ? C.amber : BORDA;
    rr(x, y, w, h, 8, o.sel ? 'rgba(255,179,71,.14)' : CARTA, borda, o.sel || o.erro ? 2.5 : 1.3);
    let x0 = x + 10;
    if (o.num) { circ(x + 20, y + h / 2, 10, o.ok ? C.ok : C.line); tx(String(o.num), x + 20, y + h / 2 + .5, { s: 12, w: 700, f: FD, c: FUNDO, bg: false }); x0 += 26; }
    wrapTx(s, x0, y + h / 2 - hT / 2 + lh / 2, tw0, { s: sz, w: 600, lh, a: 'left', c: o.dim ? C.dim : C.txt });
    return h;
  }
  // contorno de bastonete (o mesmo do bacteriaCorte), n pontos no sentido horário
  function capsula(x, y, w, h, n = 72) {
    const r = h / 2, L = Math.max(0, w - h), per = 2 * L + TAU * r, out = [];
    for (let i = 0; i < n; i++) {
      const d = i / n * per;
      if (d < L) out.push([x - L / 2 + d, y - r]);
      else if (d < L + PI * r) { const a = -PI / 2 + (d - L) / r; out.push([x + L / 2 + Math.cos(a) * r, y + Math.sin(a) * r]); }
      else if (d < 2 * L + PI * r) out.push([x + L / 2 - (d - L - PI * r), y + r]);
      else { const a = PI / 2 + (d - 2 * L - PI * r) / r; out.push([x - L / 2 + Math.cos(a) * r, y + Math.sin(a) * r]); }
    }
    return out;
  }
  // a lisozima abre buracos na parede (apaga trechos do contorno já desenhado)
  function fendas(x, y, w, h, k) {
    if (k <= 0) return; const P = capsula(x, y, w, h, 280), n = 14, len = Math.round(2 + k * 7);
    X.save(); X.globalCompositeOperation = 'destination-out'; X.lineCap = 'round';
    for (let i = 0; i < n; i++) { const j = Math.floor((i + .5) / n * 280); poly(P.slice(j, j + len), '#000', Math.max(5, h * .08)); }
    X.restore();
  }
  // raio de luz ultravioleta (ziguezague), desenhado até a fração k
  function raioUV(x0, y0, x1, y1, k, a = 1) {
    if (k <= 0 || a <= .02) return; const P = [], n = 7;
    for (let i = 0; i <= n; i++) { const f = i / n, s = i === 0 || i === n ? 0 : (i % 2 ? 1 : -1) * 8; P.push([lerp(x0, x1, f) + s, lerp(y0, y1, f)]); }
    const m = Math.max(1, Math.ceil(k * n)), Q = P.slice(0, m + 1), f0 = cl(k * n - (m - 1), 0, 1), pv = Q[Q.length - 2] || P[0], ls = Q[Q.length - 1];
    Q[Q.length - 1] = [lerp(pv[0], ls[0], f0), lerp(pv[1], ls[1], f0)];
    X.save(); X.globalAlpha *= a; X.lineCap = 'round'; X.lineJoin = 'round'; poly(Q, UV, 3); X.restore();
  }
  // fago T4 em partes, para a montagem: só a cabeça ou só a cauda (recorte do desenho do motor)
  function fagoParte(x, y, s, parte, o = {}) {
    X.save(); X.beginPath();
    if (parte === 'cabeca') X.rect(x - s * .5, y - s * 1.05, s, s * .585); else X.rect(x - s * .6, y - s * .465, s * 1.2, s * .75);
    X.clip(); fago(x, y, s, o); X.restore();
  }
  // fago lambda (λ): cabeça icosaédrica e cauda longa e flexível, que não se contrai. (x, y) = ponta da cauda; u = unidade
  function fagoL(x, y, u, o = {}) {
    const a = o.a == null ? 1 : o.a; if (a <= .02) return; const c = C.capsideo, dq = o.dna == null ? 1 : o.dna;
    X.save(); X.globalAlpha *= a; X.translate(x, y); if (o.rot) X.rotate(o.rot); X.lineJoin = 'round'; X.lineCap = 'round';
    line(0, 0, 0, -u * .32, light(c, .2), Math.max(1, u * .1));
    X.beginPath(); X.moveTo(0, -u * .32); X.quadraticCurveTo(u * .12, -u * 1.1, 0, -u * 1.9); X.strokeStyle = light(c, .2); X.lineWidth = Math.max(1.6, u * .22); X.stroke();
    const P = []; for (let i = 0; i < 6; i++) { const g = -PI / 2 + i * PI / 3; P.push([Math.cos(g) * u * .64, -u * 2.52 + Math.sin(g) * u * .64]); }
    shape(P, dq > .02 ? 'rgba(26,32,51,.92)' : 'rgba(26,32,51,.6)', light(c, .2), Math.max(1, u * .12));
    if (dq > .02) novelo(0, -u * 2.52, u * .5 * Math.sqrt(dq), { tipo: 'dna', c: C.dnaClaro, seed: 9, lw: Math.max(.8, u * .08), a: Math.min(1, dq * 1.5) });
    X.restore();
  }
  // DNA de fago fechado em círculo (pequeno laço violeta-claro)
  const circuloF = (x, y, r, a = 1) => { if (a > .02 && r > 2) cromCirc(x, y, r, r * .78, { c: C.dnaClaro, a, lw: Math.max(1.2, r * .12), seed: 4 }); };

  // =====================================================================================
  // F1 O CICLO LÍTICO
  // =====================================================================================
  const F1N = ['Adsorção', 'Penetração', 'Síntese', 'Montagem', 'Liberação (lise)'];
  const F1B = [0, 3, 6, 15, 24, 30];
  const f1Etapa = tm => tm < 3 ? 0 : tm < 6 ? 1 : tm < 15 ? 2 : tm < 24 ? 3 : 4;
  const minTx = tm => tm < .5 ? '0 min' : 'cerca de ' + Math.round(tm) + ' min';
  const ctlF1 = { l: 'Tempo', min: 0, max: 30, step: .5, v: 0, f: v => Math.round(v) + ' min', rate: () => 1 };
  const F1CAP = [
    '<b>Adsorção:</b> as fibras da cauda do fago se prendem a receptores da parede da bactéria.',
    '<b>Penetração:</b> a cauda se contrai como uma seringa e injeta só o DNA; o capsídeo vazio fica do lado de fora.',
    '<b>Síntese:</b> o DNA da bactéria é picotado, e os ribossomos e as enzimas dela passam a fazer DNA e proteínas do fago.',
    '<b>Montagem:</b> cabeças, caudas e fibras se juntam sozinhas, e cada cabeça recebe uma cópia do DNA.',
    '<b>Liberação:</b> a lisozima do fago rompe a parede, a bactéria arrebenta e solta de 100 a 200 fagos novos.'
  ];
  const F1_COP = pontos(8, 23, .62), F1_EXTRA = pontos(16, 41, .5);
  const F1_SLOT = (() => { const out = [], R = rng(31); for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) out.push([-.66 + c * .264 + (r ? .13 : 0), r ? .36 : -.02, (R() - .5) * 1.2, (R() - .5) * .9, (R() - .5) * 1.1, (R() - .5) * .7, (R() - .5) * 2.4]); return out; })();

  function layF1(A, cartoes) {
    if (!NAR) { const cw = Math.min(214, A.w * .19); return { lst: { x: A.x0, y: A.y0 + 4, w: cw, h: A.h - 8 }, cont: { x: A.x1 - cw, y: A.y0 + 14, w: cw }, cena: { x: A.x0 + cw + 20, y: A.y0, w: A.w - 2 * cw - 40, h: A.h } }; }
    const top = cartoes ? 124 : 58;
    return { lst: { x: A.x0, y: A.y0, w: A.w, h: top - 8 }, cont: null, cena: { x: A.x0, y: A.y0 + top, w: A.w, h: A.h - top } };
  }
  // a cena do ciclo lítico no tempo tm (minutos, de 0 a 30)
  function cenaF1(c, tm) {
    const bw = Math.min(c.w * .92, 480), bh = Math.min(c.h * .5, bw * .44, 196);
    const s0 = Math.min(bh * .66, 112), folga = Math.max(0, c.h - bh - .96 * s0 - 10);
    const bx = c.x + c.w / 2, by = c.y + c.h - bh / 2 - 6 - folga * .45, top = by - bh / 2;
    const s = cl(Math.min(s0, (top - c.y - 4) / .96), 40, 112), sm = Math.min(s * .36, bh * .26);
    const preso = (x, y, m) => [cl(x, c.x + m * .45, c.x + c.w - m * .45), cl(y, c.y + m, c.y + c.h - 4)];
    const kDesce = ss(seg(tm, 0, 2)), kFix = ss(seg(tm, 1.6, 3)), kContr = ss(seg(tm, 3, 4)), kInj = seg(tm, 4, 6);
    const kFrag = ss(seg(tm, 6, 9)), kCop = seg(tm, 8, 15), kPart = seg(tm, 10, 15), kMont = seg(tm, 15, 23);
    const kLis = seg(tm, 24, 26), kBur = seg(tm, 26, 30), et = f1Etapa(tm);
    // bactéria (com ribossomos e cromossomo; o DNA dela é picotado na síntese)
    bacteriaCorte(bx, by, bw, bh, { ribo: 18, pic: kFrag, lise: kBur });
    if (kBur <= 0) fendas(bx, by, bw, bh, kLis);
    const dentro = 1 - ss(seg(kBur, 0, .5));
    // (só nas duas primeiras etapas: depois, as peças do fago e as linhas-guia ocupam esse canto)
    if (et < 2 && LB) mtx('<i>E. coli</i> em corte', bx - bw / 2 + bh * .3, by + bh / 2 - 14, { s: 12, c: C.dim, a: 'left' });
    // fago que infecta: desce, prende as fibras, contrai a cauda e injeta o DNA (o capsídeo vazio fica fora)
    const room = Math.max(0, top - .96 * s - c.y - 2), fy = top - 1 - room * (1 - kDesce);
    const F = fago(bx, fy, s, { contrai: kContr, pernas: kFix, dna: 1 - ss(kInj), a: 1 - seg(kBur, 0, .4) * .8 });
    // DNA injetado: da ponta do tubo até um novelo à direita do cromossomo
    const qx = bx + bw * .3, qy = by - bh * .04;
    if (kInj > 0 && kMont < 1) {
      const P = [[F.tx, F.ty], [lerp(F.tx, qx, .45), F.ty + bh * .1]];
      for (let i = 0; i <= 24; i++) { const g = i / 24, ang = -PI * .8 + g * TAU * 1.6, r = bh * .13 * (1 - g * .5); P.push([qx + Math.cos(ang) * r * 1.3, qy + Math.sin(ang) * r]); }
      fita(P, { tipo: 'dna', c: C.dnaClaro, amp: 2.4, ond: 9, lw: 1.4, f: kInj, a: (1 - kMont) * dentro });
    }
    F1_COP.forEach((p, i) => { const k = cl(kCop * 8 - i, 0, 1); novelo(bx + p[0] * bw * .4, by + p[1] * bh * .3, bh * .075, { tipo: 'dna', c: C.dnaClaro, seed: 3 + i, a: k * (1 - kMont) * dentro }); });
    // peças (cabeças e caudas) e fagos novos; na lise, os fagos voam para fora
    F1_SLOT.forEach((q, i) => {
      const ap = seg(kPart, i / 12 * .6, i / 12 * .6 + .4); if (ap <= 0) return;
      const sx = bx + q[0] * bw * .5, sy = by + q[1] * bh;
      const ki = ss(seg(kMont, i / 12 * .5, i / 12 * .5 + .5));
      if (kBur > 0) {
        const dx = sx - bx, dy = sy - by - bh * .3, d = Math.hypot(dx, dy) || 1, kk = ss(kBur), dist = Math.min(c.w * .5, c.h * .7);
        const [fx, fy2] = preso(sx + dx / d * dist * kk, sy + dy / d * dist * kk * .75, sm);
        fago(fx, fy2, sm, { ang: -PI / 2 + q[6] * kk, a: 1 - seg(kBur, .7, 1) * .4 });
        return;
      }
      if (ki >= 1) { fago(sx, sy, sm, {}); return; }
      fagoParte(sx + q[2] * bh * .2 * (1 - ki), sy + q[3] * bh * .2 * (1 - ki), sm, 'cauda', { a: ap, pernas: .4 });
      fagoParte(sx + q[4] * bh * .2 * (1 - ki), sy + q[5] * bh * .2 * (1 - ki), sm, 'cabeca', { a: ap, dna: seg(ki, .6, 1) });
    });
    if (kBur > 0) F1_EXTRA.forEach(p => {
      const kk = ss(kBur), dist = Math.min(c.w * .5, c.h * .7) * (.45 + p[2] * .5), d = Math.hypot(p[0], p[1]) || 1;
      const [fx, fy2] = preso(bx + p[0] / d * dist * kk, by + p[1] / d * dist * kk * .7, sm);
      fago(fx, fy2, sm, { ang: -PI / 2 + (p[2] - .5) * 3 * kk, a: seg(kBur, .05, .3) * (1 - seg(kBur, .7, 1) * .4) });
    });
    // rótulos (no máximo três por etapa). No celular, os de cima ficam à direita do capsídeo vazio
    // e sobem acima dele quando não cabem ao lado
    const labC = (ax, ay, y, txt) => { const xr = W - 6, pw = mtw(txt, 13, 600) + 16; lab(ax, ay, xr, xr - pw >= F.hx + s * .2 ? y : Math.min(y, F.hy - s * .24 - 18), txt); };
    if (et === 0 && tm > 2) { if (NAR) labC(bx + s * .36, top + 2, top - bh * .35, 'fibras da cauda'); else lab(bx + s * .36, top + 2, bx + bw * .32, top - bh * .35, 'fibras da cauda'); }
    if (et === 1 && kInj > .4) {
      if (NAR) { lab(qx, qy - bh * .13, W - 6, by + bh * .5 + 26, 'DNA do fago entra'); labC(F.hx, F.hy - s * .24, F.hy - s * .24 - 18, 'capsídeo vazio fica fora'); }
      else { lab(qx, qy - bh * .13, bx + bw * .46, top - bh * .5, 'DNA do fago entra'); lab(F.hx - s * .16, F.hy, bx - bw * .34, F.hy - 4, 'capsídeo vazio fica fora'); }
    }
    if (et === 2) {
      // no celular, os dois rótulos ficam embaixo da bactéria, em linhas diferentes (em cima está o capsídeo vazio)
      if (tm > 6.5) lab(bx - bw * .2, by + bh * .12, bx - bw * (NAR ? .36 : .48), NAR ? by + bh * .5 + 58 : top - bh * .5, 'DNA da bactéria picotado');
      if (tm > 9) lab(bx + F1_COP[0][0] * bw * .4, by + F1_COP[0][1] * bh * .3, bx + bw * (NAR ? .46 : .44), NAR ? by + bh * .5 + 26 : top - bh * .5, 'cópias do DNA do fago');
      if (tm > 11 && !NAR) lab(bx - bw * .36, by - bh * .2, bx - bw * .5, by + bh * .66, 'ribossomos da bactéria');
    }
    if (et === 3 && kMont > .6) { const ax = bx + F1_SLOT[3][0] * bw * .5, ay = by + F1_SLOT[3][1] * bh - sm * .7; if (NAR) labC(ax, ay, top - bh * .45, 'fago novo montado'); else lab(ax, ay, bx + bw * .4, top - bh * .45, 'fago novo montado'); }
    if (et === 4 && kBur <= 0) { if (NAR) labC(bx + bw * .47, by - bh * .25, top - bh * .5, 'lisozima rompe a parede'); else lab(bx + bw * .47, by - bh * .25, bx + bw * .5, top - bh * .5, 'lisozima rompe a parede'); }
  }
  const A_H = R => area().y1 - R.y;
  function contadorF1(L, tm) {
    const lib = tm >= 26 ? 'cerca de 150' : '0';
    if (!NAR) {
      const R = L.cont, h = Math.min(236, A_H(R)); panel(R.x, R.y, R.w, h);
      tx('tempo', R.x + 14, R.y + 20, { s: 12, c: C.dim, a: 'left', bg: false });
      tx(minTx(tm), R.x + 14, R.y + 42, { s: 16, w: 500, f: FD, c: '#fff', a: 'left', bg: false });
      tx('fagos liberados', R.x + 14, R.y + 70, { s: 12, c: C.dim, a: 'left', bg: false });
      tx(lib, R.x + 14, R.y + 92, { s: 16, w: 500, f: FD, c: tm >= 26 ? C.amber : '#fff', a: 'left', bg: false });
      [[C.dnaClaro, 'DNA do fago'], [C.dnaEscuro, 'DNA da bactéria'], [C.capsideo, 'capsídeo e cauda'], [C.parede, 'parede da bactéria'], [C.ribo, 'ribossomos']]
        .forEach(([c, s], i) => { const y = R.y + 122 + i * 22; circ(R.x + 20, y, 5, c); tx(s, R.x + 32, y, { s: 13, c: C.txt, a: 'left', bg: false }); });
    } else {
      const y = L.lst.y + 44;
      tx('tempo: ' + minTx(tm), L.lst.x, y, { s: 12, w: 600, c: C.txt, a: 'left' });
      tx('liberados: ' + lib, L.lst.x + L.lst.w, y, { s: 12, w: 600, c: tm >= 26 ? C.amber : C.txt, a: 'right' });
    }
  }
  // "Monte o ciclo": cartões embaralhados; o aluno toca na próxima etapa e ela toca na animação
  function cartoesF1(L, S) {
    const R = L.lst, cols = NAR ? 2 : 1, gap = 6, cw = (R.w - (cols - 1) * gap) / cols, ch = NAR ? 32 : 38;
    S.hit = [];
    if (!NAR) tx('Toque nas etapas na ordem certa', R.x, R.y + 8, { s: 13, w: 600, c: C.dim, a: 'left', bg: false });
    const y0 = R.y + (NAR ? 0 : 24);
    S.ordem.forEach((e, i) => {
      const x = R.x + (i % cols) * (cw + gap), y = y0 + Math.floor(i / cols) * (ch + gap), feito = e < S.acertos, err = S.erro && S.erro.e === e && S.erro.t > 0;
      cartao(x, y, cw, F1N[e], { h: ch, ok: feito, erro: err, num: feito ? e + 1 : null, dim: feito });
      S.hit.push({ e }); hitR(x, y, cw, ch, i);
    });
  }
  // "Placa de cultura": cada toque solta um fago no tapete de bactérias; a placa de lise cresce ciclo após ciclo
  function placaF1(A, S) {
    const pw = NAR ? A.w : A.w - 270, R0 = Math.min(pw, A.h) / 2 - 8, cx = A.x0 + (NAR ? A.w / 2 : R0 + 12), cy = A.cy;
    S.placaG = { cx, cy, R: R0 };
    circ(cx, cy, R0 + 6, 'rgba(19,26,43,.9)', C.line, 2);
    X.save(); X.beginPath(); X.arc(cx, cy, R0, 0, TAU); X.clip();
    circ(cx, cy, R0, rgba(C.parede, .28));
    const Rr = rng(5); X.lineCap = 'round';
    for (let i = 0; i < 420; i++) { const g = Rr() * TAU, r = Math.sqrt(Rr()) * R0, x = cx + Math.cos(g) * r, y = cy + Math.sin(g) * r, an = Rr() * PI; line(x - Math.cos(an) * 3, y - Math.sin(an) * 3, x + Math.cos(an) * 3, y + Math.sin(an) * 3, rgba(C.parede, .75), 2); }
    let maxG = 0; const raio = g => Math.min(R0 * .42, R0 * .03 + R0 * .045 * g);
    for (const p of S.placas) {
      const g = (S.tAcc - p.t0) / 2.2, r = raio(g); maxG = Math.max(maxG, g);
      circ(p.x, p.y, r + 4, rgba(C.parede, .14));
      circ(p.x, p.y, r, '#141B2E', rgba(C.dnaClaro, .35), 1);
      const Rp = rng(p.s); for (let i = 0; i < Math.min(30, 4 + g * 4); i++) { const g2 = Rp() * TAU, r2 = (.6 + Rp() * .45) * r; circ(p.x + Math.cos(g2) * r2, p.y + Math.sin(g2) * r2, 1.4, C.capsideo); }
    }
    X.restore();
    if (S.placas.length) { const p = S.placas[0], r = raio((S.tAcc - p.t0) / 2.2); lab(p.x + r * .7, p.y - r * .7, p.x + R0 * .5, p.y - R0 * .6, 'placa de lise'); }
    const h = Math.max(.5, Math.round(maxG) * .5), n = S.placas.length;
    const msg = n ? `${n} ${n > 1 ? 'fagos soltos' : 'fago solto'}; cultura de cerca de ${nbr(h, h % 1 ? 1 : 0)} h` : 'Toque no tapete de bactérias para soltar um fago.';
    if (!NAR) {
      const x = A.x1 - 246, w = 246; panel(x, A.y0 + 4, w, 200);
      tx('Placa de cultura', x + 14, A.y0 + 24, { s: 15, w: 700, f: FH, c: '#fff', a: 'left', bg: false });
      const y = A.y0 + 50 + wrapTx(msg, x + 14, A.y0 + 50, w - 28, { s: 13, a: 'left', c: C.txt });
      wrapTx('Cada ciclo leva cerca de meia hora. Os fagos novos infectam as bactérias vizinhas, e o buraco claro cresce em círculo.', x + 14, y + 10, w - 28, { s: 13, a: 'left', c: C.dim });
    }
    return msg;
  }

  def('fagos', 'litico', {
    t: 'O ciclo lítico', s: 'o fago entra, copia e arrebenta a bactéria', loc: 'Fago T4 e <i>Escherichia coli</i> em corte', locNota: NOTA,
    still: 0, stillV: 20, ctl: ctlF1, auto: S => S.modo ? 0 : 1.5, ctlVis: S => !S.modo,
    alt: 'Ciclo lítico em cinco etapas numeradas: o fago T4 pousa na bactéria Escherichia coli em corte, prende as fibras da cauda, contrai a cauda e injeta só o DNA; o capsídeo vazio fica fora. Dentro, o DNA da bactéria é picotado, aparecem cópias do DNA do fago e peças do vírus, que se montam em fagos novos. A parede se rompe e os fagos se espalham. Contador de tempo, de 0 a 30 minutos, e de fagos liberados, cerca de 150',
    extra: [
      { t: 'Monte o ciclo', on: S => { S.modo = S.modo === 'monte' ? null : 'monte'; S.acertos = 0; S.mt = 0; S.erro = null; S.ordem = embaralha([0, 1, 2, 3, 4], Math.random); }, pressed: S => S.modo === 'monte' },
      { t: 'Placa de cultura', on: S => { S.modo = S.modo === 'placa' ? null : 'placa'; S.placas = []; S.tAcc = 0; }, pressed: S => S.modo === 'placa' }
    ],
    d: `<p>Os <b>bacteriófagos</b> (ou só <b>fagos</b>, "comedores de bactéria") são vírus que infectam <b>bactérias</b>. O mais estudado é o <b>T4</b>, que ataca a <i>Escherichia coli</i>. No <b>ciclo lítico</b>, a infecção termina com a morte da bactéria, em cinco etapas:</p>
<p><b>1. Adsorção:</b> as fibras da cauda se prendem a receptores da parede da bactéria.</p>
<p><b>2. Penetração:</b> a cauda se contrai como uma seringa e <b>injeta só o DNA</b>; o capsídeo vazio fica do lado de fora.</p>
<p><b>3. Síntese:</b> o DNA do fago comanda a bactéria. Uma das primeiras proteínas virais degrada o DNA da própria bactéria, e os <b>ribossomos, enzimas, nucleotídeos, aminoácidos e ATP da bactéria</b> passam a produzir DNA e proteínas do fago.</p>
<p><b>4. Montagem:</b> as cabeças, caudas e fibras se juntam sozinhas, e cada cabeça recebe uma cópia do DNA.</p>
<p><b>5. Liberação (lise):</b> uma enzima do fago, a <b>lisozima</b>, rompe a parede da bactéria, que <b>arrebenta</b> e libera de <b>100 a 200</b> fagos novos, prontos para infectar outras bactérias.</p>
<p>Tudo isso leva cerca de <b>meia hora</b> a 37 °C. Como cada bactéria libera centenas de fagos, e cada um infecta outra bactéria, uma cultura de bactérias pode ser destruída em poucas horas. Numa placa de cultura, isso aparece como "buracos" claros no tapete de bactérias, as <b>placas de lise</b>. Os fagos atacam bactérias, mas <b>não infectam células humanas</b>: por isso estão sendo estudados como alternativa aos antibióticos contra bactérias resistentes (a <b>fagoterapia</b>).</p>
<p>Toque em <b>Monte o ciclo</b> e ponha as etapas em ordem: a cada acerto, a etapa toca na animação. Em <b>Placa de cultura</b>, toque no tapete de bactérias para soltar um fago e veja a placa de lise crescer. Tempo e número de fagos são aproximados.</p>`,
    enem: 'Guarde a sequência <b>adsorção, penetração, síntese, montagem e liberação</b>, e o ponto central: o vírus usa a <b>maquinaria da célula</b> (ribossomos, enzimas, energia, matéria-prima), porque não tem a própria. No fago, <b>só o ácido nucleico entra</b>; essa é a base do experimento de Hershey e Chase (1952), que marcou o DNA e as proteínas do fago com isótopos diferentes e mostrou que o DNA, e não a proteína, é o material genético.',
    links: [LK.fago3d, ['O ciclo lisogênico', '#fagos/lisogenico'], LK.morfo],
    init(S) { if (S.ordem == null) { S.ordem = [0, 1, 2, 3, 4]; S.acertos = 0; S.mt = 0; S.placas = []; S.tAcc = 0; } },
    tap(x, y, S) {
      if (S.modo === 'monte') {
        const id = hitAt(x, y); if (id == null || !S.hit || !S.hit[id]) return; const e = S.hit[id].e;
        if (e < S.acertos) return;
        if (e === S.acertos) { S.acertos++; S.erro = null; if (S.mt < F1B[e]) S.mt = F1B[e]; } else S.erro = { e, t: 1.6 };
      } else if (S.modo === 'placa') {
        const g = S.placaG; if (!g || Math.hypot(x - g.cx, y - g.cy) > g.R - 4) return;
        if (S.placas.length >= 6) S.placas.shift();
        S.placas.push({ x, y, t0: S.tAcc, s: 1 + Math.floor(Math.random() * 1e6) });
      }
    },
    draw(t, S) {
      const A = area();
      if (S.modo === 'placa') { S.tAcc += S.dt || 0; const m = placaF1(A, S); cap(NAR ? m : 'Cada fago solto começa uma <b>placa de lise</b>: um buraco claro no tapete de bactérias, que cresce a cada ciclo.'); return; }
      if (S.modo === 'monte') {
        const alvo = F1B[S.acertos]; if (S.mt < alvo) S.mt = Math.min(alvo, S.mt + (S.dt || 0) * 2);
        if (S.erro) S.erro.t -= S.dt || 0;
        const L = layF1(A, true); cartoesF1(L, S); cenaF1(L.cena, S.mt); if (!NAR) contadorF1(L, S.mt);
        if (S.erro && S.erro.t > 0) cap(`Ainda não. Qual etapa vem antes de <b>${F1N[S.erro.e].toLowerCase()}</b>?`);
        else if (S.acertos === 0) cap('As cinco etapas estão embaralhadas. Toque na <b>primeira</b> etapa do ciclo lítico.');
        else if (S.acertos < 5) cap(F1CAP[S.acertos - 1] + ' Qual é a próxima?');
        else cap(S.mt >= 30 ? 'Ciclo completo: <b>adsorção, penetração, síntese, montagem e liberação</b>, em cerca de meia hora.' : F1CAP[4]);
        return;
      }
      const tm = S.v, L = layF1(A, false), et = f1Etapa(tm);
      etapas(L.lst, F1N, et); contadorF1(L, tm); cenaF1(L.cena, tm); cap(F1CAP[et]);
    }
  });

  // =====================================================================================
  // F2 O CICLO LISOGÊNICO
  // =====================================================================================
  // leitura da faixa com até 7 letras: no computador, a caixa do número tem uns 53 px
  const ctlF2 = { l: 'Etapa', min: 0, max: 40, step: .5, v: 0, rate: () => 1,
    f: v => v < 5 ? 'injeção' : v < 8 ? 'círculo' : v < 12 ? 'prófago' : v < 24 ? 'divisão' : v < 26 ? 'luz UV' : v < 33 ? 'indução' : 'lise' };
  const F2_MIN = pontos(6, 51, .55), F2_COP = pontos(6, 57, .55);
  const PROF = { f: .93, len: .15 };          // onde o prófago se encaixa no cromossomo
  // bactéria do ciclo lisogênico. o.prof (0 a 1) prófago entrando no cromossomo; o.livre (0 a 1) DNA do fago solto, em círculo;
  // o.p (0 a 1) andamento do ciclo lítico dentro dela (cópias, montagem e lise); o.voo distância dos fagos na lise
  function celB(x, y, w, h, o = {}) {
    const bx = o.box;
    const p = o.p || 0, cop = seg(p, .05, .4), mini = seg(p, .35, .7), bur = seg(p, .72, 1), pr = o.prof || 0;
    bacteriaCorte(x, y, w, h, { ribo: 6, ins: pr > .02 ? { f: PROF.f, len: PROF.len, k: pr } : null, lise: bur, seed: 21 });
    const den = 1 - ss(seg(bur, 0, .5));
    circuloF(x + w * .37, y - h * .02, Math.min(w * .065, h * .17), (o.livre || 0) * den);
    F2_COP.forEach((q, i) => { const k = cl(cop * 6 - i, 0, 1); circuloF(x + w * .14 + q[0] * w * .26, y + q[1] * h * .46, Math.min(w * .05, h * .13), k * (1 - mini) * den); });
    const um = Math.min(w * .036, h * .09);
    if (mini > 0) F2_MIN.forEach((q, i) => {
      const k = cl(mini * 6 - i, 0, 1); if (k <= 0) return;
      const mx = x + q[0] * w * .4, my = y + q[1] * h * .28 + um * 1.3;
      if (bur > 0) {
        const kk = ss(bur), d = Math.hypot(q[0], q[1]) || 1, dist = o.voo || w * .6;
        let fx = mx + q[0] / d * dist * kk, fy = my + q[1] / d * dist * kk * .6;
        if (bx) { fx = cl(fx, bx.x + um, bx.x + bx.w - um); fy = cl(fy, bx.y + um * 2.9, bx.y + bx.h - 3); }
        fagoL(fx, fy, um, { rot: (q[2] - .5) * 4 * kk, a: 1 - seg(bur, .7, 1) * .4 });
      }
      else fagoL(mx, my, um, { a: k });
    });
  }
  // posições das filhas: geração g (0 a 3), índice i (a filha i vem da mãe i >> 1)
  function posLiso(Rg, g, i) {
    const cw = Rg.w / 4, rh = Rg.h / 2;
    if (g === 3) return [Rg.x + cw * ((i >> 1) + .5), Rg.y + rh * ((i & 1) + .5)];
    if (g === 2) return [Rg.x + cw * (i + .5), Rg.y + Rg.h / 2];
    if (g === 1) return [Rg.x + cw * (2 * i + 1), Rg.y + Rg.h / 2];
    return [Rg.x + Rg.w / 2, Rg.y + Rg.h / 2];
  }
  const tamLiso = Rg => { const cw = Math.min(Rg.w / 4 * .84, 150); return [cw, Math.min(Rg.h / 2 * .74, cw * .46)]; };
  // colônia lisogênica: gd (0 a 3, contínuo) gerações; o.ind filha induzida pela luz UV (o.uv, o.exc, o.p)
  function colonia(Rg, gd, o = {}) {
    const [cw, ch] = tamLiso(Rg), g = Math.min(3, Math.floor(gd)), k = ss(gd - g), n = 1 << g, cells = [];
    for (let i = 0; i < n; i++) {
      const p0 = posLiso(Rg, g, i);
      if (g < 3 && k > 0) for (const j of [2 * i, 2 * i + 1]) { const p1 = posLiso(Rg, g + 1, j); cells.push({ i: j << (2 - g), x: lerp(p0[0], p1[0], k), y: lerp(p0[1], p1[1], k) }); }
      else cells.push({ i: i << (3 - g), x: p0[0], y: p0[1] });
    }
    for (const c of cells) {
      const indz = o.ind != null && gd >= 3 && c.i === o.ind;
      celB(c.x, c.y, cw, ch, indz ? { prof: 1 - (o.exc || 0), livre: (o.exc || 0) * (1 - seg(o.p || 0, 0, .3)), p: o.p || 0, voo: Math.min(Rg.w, Rg.h) * .4, box: o.box || Rg }
        : { prof: o.prof == null ? 1 : o.prof, livre: o.livre || 0 });
    }
    if (o.ind != null && gd >= 3 && o.lamp) {
      const [ux, uy] = posLiso(Rg, 3, o.ind);
      raioUV(o.lamp[0], o.lamp[1], ux + cw * .12, uy - ch / 2 + 2, o.uv || 0, 1 - seg(o.exc || 0, .3, 1));
    }
    return cells;
  }
  // lâmpada de luz ultravioleta com o nome ao lado ou embaixo (o raio sai de (x, y))
  function lampada(x, y, a, lado = 'left') {
    if (a <= .02) return; X.save(); X.globalAlpha *= a; X.lineCap = 'round';
    circ(x, y, 8, rgba(UV, .25), UV, 2);
    for (let i = 0; i < 8; i++) { const g = i / 8 * TAU; line(x + Math.cos(g) * 11, y + Math.sin(g) * 11, x + Math.cos(g) * 15, y + Math.sin(g) * 15, UV, 1.6); }
    if (lado === 'baixo') tx('luz UV', x, y + 28, { s: 13, w: 700, c: UV, a: 'center' });
    else tx('luz UV', lado === 'left' ? x - 22 : x + 22, y, { s: 13, w: 700, c: UV, a: lado === 'left' ? 'right' : 'left' });
    X.restore();
  }
  function layF2(A) {
    if (!NAR) {
      const iw = Math.min(250, A.w * .21), lx = A.x0 + iw + 34, lw = A.x1 - lx, hh = (A.h - 12) / 2;
      return { inj: { x: A.x0, y: A.y0, w: iw, h: A.h }, l1: { x: lx, y: A.y0, w: lw, h: hh }, l2: { x: lx, y: A.y0 + hh + 12, w: lw, h: hh }, tw: 168 };
    }
    const ih = 104, hh = (A.h - ih - 16) / 2;
    return { inj: { x: A.x0, y: A.y0, w: A.w, h: ih }, l1: { x: A.x0, y: A.y0 + ih + 8, w: A.w, h: hh }, l2: { x: A.x0, y: A.y0 + ih + 16 + hh, w: A.w, h: hh }, tw: 0 };
  }
  function faixaF2(R, tw0, tit, sub, a) {
    X.save(); X.globalAlpha *= a; panel(R.x, R.y, R.w, R.h, { f: 'rgba(19,26,43,.55)' });
    if (!NAR) { title(tit, R.x + 14, R.y + 22, tw0 - 22, { a: 'left', s: 16 }); wrapTx(sub, R.x + 14, R.y + 46, tw0 - 26, { s: 12, a: 'left', c: C.dim }); }
    else { title(tit, R.x + 10, R.y + 14, R.w * .58, { a: 'left', s: 13 }); if (sub) mtx(sub, R.x + R.w - 10, R.y + 14, { s: 12, a: 'right', c: C.dim }); }
    X.restore();
    return NAR ? { x: R.x + 6, y: R.y + 30, w: R.w - 12, h: R.h - 34 } : { x: R.x + tw0, y: R.y + 8, w: R.w - tw0 - 10, h: R.h - 16 };
  }
  // a infecção pelo fago λ (comum aos dois caminhos); devolve o ponto de saída das setas
  function injecao(R, v, a) {
    X.save(); X.globalAlpha *= a;
    const cw = NAR ? Math.min(140, R.w * .4) : Math.min(R.w * .8, 190), ch = cw * .44;
    const cx = NAR ? R.x + cw / 2 + 8 : R.x + R.w / 2, cy = NAR ? R.y + R.h - ch / 2 - 4 : R.y + R.h * .58, top = cy - ch / 2, u = NAR ? 9 : 15;
    const kD = ss(seg(v, 0, 1.5)), kI = seg(v, 2.5, 4.5), kC = seg(v, 4.2, 5);
    bacteriaCorte(cx, cy, cw, ch, { ribo: 6, seed: 21 });
    const lx = cx + cw * .37, ly = cy - ch * .02;
    if (kI > 0 && kC < 1) fita([[cx + 1, top + 2], [lerp(cx, lx, .5), top + ch * .3], [lx, ly]], { tipo: 'dna', c: C.dnaClaro, amp: 2, ond: 8, lw: 1.3, f: kI, a: 1 - kC });
    circuloF(lx, ly, Math.min(cw * .065, ch * .17), kC);
    const room = cl(top - 3.2 * u - R.y - (NAR ? 4 : 40), 0, 70);
    fagoL(cx + 1, top - room * (1 - kD), u, { dna: 1 - ss(kI) });
    if (!NAR) { title('Infecção pelo fago λ', R.x + R.w / 2, Math.max(R.y + 14, top - 3.2 * u - room - 26), R.w - 8, { s: 15 }); if (v > 4.5 && LB) mtx('DNA do fago em círculo', cx, cy + ch / 2 + 16, { s: 12, c: C.dnaClaro }); }
    else { title('Infecção pelo fago λ', R.x + cw + 24, R.y + 18, R.w - cw - 30, { a: 'left', s: 13 }); if (v > 4.5 && LB) mtx('DNA do fago em círculo', R.x + cw + 24, R.y + 40, { s: 12, a: 'left', c: C.dnaClaro }); }
    X.restore();
    return { x: cx + cw / 2, y: cy };
  }
  const F2CAP = v => v < 5 ? 'O fago λ se prende à bactéria e injeta o seu DNA, que se fecha em círculo.'
    : v < 8 ? 'Daqui, o DNA do fago pode seguir dois caminhos.'
    : v < 12 ? 'Lítico: o DNA do fago comanda a bactéria. Lisogênico: o DNA do fago se encaixa no cromossomo e vira <b>prófago</b>.'
    : v < 24 ? 'A bactéria lisogênica se divide, e o prófago é <b>copiado junto</b> com o cromossomo em todas as filhas.'
    : v < 29 ? 'A luz ultravioleta atinge uma bactéria: o prófago se solta do cromossomo. É a <b>indução</b>.'
    : 'Induzido, o fago entra no <b>ciclo lítico</b>: monta fagos novos e a bactéria arrebenta.';
  // quadro comparativo (cartões do motor)
  const BQ = baralho({
    nome: 'quadro',
    cartas: [{ t: 'a bactéria morre logo', k: 0 }, { t: 'o DNA viral entra no cromossomo', k: 1 }, { t: 'o vírus é copiado quando a bactéria se divide', k: 1 }, { t: 'libera centenas de fagos', k: 0 }],
    alvos: [{ t: 'Ciclo lítico', c: C.capsideo }, { t: 'Ciclo lisogênico', c: C.dnaClaro }],
    certo: c => c.k ? 'Certo: isso acontece no <b>ciclo lisogênico</b>.' : 'Certo: isso acontece no <b>ciclo lítico</b>.',
    errado: (c, al) => `Ainda não: "${c.t}" não acontece no ${al.t.toLowerCase()}.`,
    fim: () => '<b>Quadro completo.</b> Lítico: lise imediata. Lisogênico: prófago copiado a cada divisão, até a indução.',
    dica: 'Toque numa frase e depois na coluna do ciclo certo.'
  });
  // "Condições": o que acontece com uma bactéria que já carrega o prófago
  function condicoesF2(A, S) {
    const ops = ['bem nutridas, sem estresse', 'luz UV'];
    const bw = NAR ? (A.w - 8) / 2 : 260, bh = NAR ? 46 : 40, y = A.y0 + 4, x0 = NAR ? A.x0 : A.cx - bw - 6;
    if (!NAR) tx('Condições:', x0 - 14, y + bh / 2, { s: 14, w: 700, c: C.dim, a: 'right' });
    ops.forEach((s, i) => { const x = x0 + i * (bw + (NAR ? 8 : 12)); cartao(x, y, bw, s, { sel: S.cond === i, h: bh }); hitR(x, y, bw, bh, 'cond' + i); });
    const Rg = { x: A.x0 + (NAR ? 0 : A.w * .12), y: y + bh + 34, w: NAR ? A.w : A.w * .76, h: A.y1 - (y + bh + 34) - 6 };
    if (S.cond == null) {
      const cw = Math.min(Rg.w * .5, 300), ch = cw * .44;
      celB(Rg.x + Rg.w / 2, Rg.y + Rg.h / 2, cw, ch, { prof: 1 });
      if (LB) lab(Rg.x + Rg.w / 2 + cw * .25, Rg.y + Rg.h / 2 - ch * .05, Rg.x + Rg.w / 2 + cw * .62, Rg.y + Rg.h / 2 - ch * .9, 'prófago');
      return 'Esta bactéria é <b>lisogênica</b>: carrega o prófago. Escolha as condições no alto.';
    }
    const tc = S.tc;
    if (S.cond === 0) { colonia(Rg, cl(tc / 3, 0, 3), { prof: 1 }); return 'Sem estresse, o prófago fica quieto e é copiado a cada divisão. (Na infecção, a "escolha" entre os ciclos depende do estado da bactéria e de quantos fagos a infectam.)'; }
    const uv = seg(tc, 0, 1.2), exc = seg(tc, 1.2, 3.2), p = seg(tc, 3.2, 9);
    const cw = Math.min(Rg.w * .5, 300), ch = cw * .44, cx = Rg.x + Rg.w / 2, cy = Rg.y + Rg.h / 2, lx = cx + cw * .45, ly = Math.max(Rg.y + 4, cy - ch / 2 - 70);
    celB(cx, cy, cw, ch, { prof: 1 - exc, livre: exc * (1 - seg(p, 0, .3)), p, voo: Math.min(Rg.w, Rg.h) * .5, box: Rg });
    lampada(lx, ly, 1 - seg(p, .8, 1) * .6, 'right');
    raioUV(lx - 10, ly + 10, cx + cw * .1, cy - ch / 2 + 2, uv, 1 - seg(exc, .3, 1));
    return p > .7 ? 'A luz UV provocou a <b>indução</b>: o prófago se soltou, o fago entrou no ciclo lítico e a bactéria arrebentou.' : 'A luz UV estressa a bactéria: o prófago se solta do cromossomo (<b>indução</b>).';
  }

  def('fagos', 'lisogenico', {
    t: 'O ciclo lisogênico', s: 'o fago se esconde no DNA da bactéria', loc: 'Fago λ e bactérias em corte', locNota: NOTA,
    still: 0, stillV: 23, ctl: ctlF2, auto: S => S.modo ? 0 : 2, ctlVis: S => !S.modo,
    alt: 'O fago lambda injeta o DNA numa bactéria e o DNA se fecha em círculo. Daí saem dois caminhos. No ciclo lítico, a bactéria faz cópias do DNA do fago, monta fagos novos e arrebenta. No ciclo lisogênico, o DNA do fago se encaixa no cromossomo circular da bactéria (prófago); a bactéria se divide três vezes e as oito filhas carregam o prófago. Um raio de luz ultravioleta atinge uma delas: o prófago se solta e ela entra no ciclo lítico',
    extra: [
      { t: 'Condições', on: S => { S.modo = S.modo === 'cond' ? null : 'cond'; S.cond = null; S.tc = 0; }, pressed: S => S.modo === 'cond' },
      { t: 'Quadro: lítico ou lisogênico?', on: S => { S.modo = S.modo === 'quadro' ? null : 'quadro'; BQ.zera(S); }, pressed: S => S.modo === 'quadro' }
    ],
    d: `<p>Alguns fagos, como o <b>fago lambda (λ)</b>, podem seguir outro caminho. Depois de injetar o DNA, em vez de destruir a bactéria logo, o fago <b>insere o seu DNA no cromossomo bacteriano</b>. Esse DNA viral integrado se chama <b>prófago</b>. Ele fica "quieto": quase nenhum gene do fago é expresso, a bactéria continua viva e normal, e, cada vez que ela se divide, o prófago é <b>copiado junto</b> com o cromossomo. Assim, em poucas gerações, milhões de bactérias carregam o fago sem saber. A bactéria com prófago é chamada de <b>lisogênica</b>. Esse é o <b>ciclo lisogênico</b>.</p>
<p>O prófago pode ficar assim por muitas gerações, mas não para sempre. Um estresse para a bactéria, como <b>radiação ultravioleta</b> ou certas substâncias químicas, pode provocar a <b>indução</b>: o prófago se solta do cromossomo e o vírus entra no <b>ciclo lítico</b>, com montagem de fagos e lise da bactéria. Às vezes, os genes do prófago mudam a própria bactéria, o que se chama <b>conversão lisogênica</b>. Um exemplo importante para a saúde: as bactérias da <b>difteria</b> (<i>Corynebacterium diphtheriae</i>) e da <b>cólera</b> (<i>Vibrio cholerae</i>) só produzem as toxinas que causam essas doenças quando carregam o gene trazido por um fago. Ou seja, um vírus pode transformar uma bactéria inofensiva em perigosa. Fagos que carregam pedaços de DNA de uma bactéria para outra também espalham genes, inclusive alguns de resistência a antibióticos (a <b>transdução</b>).</p>
<p>Em <b>Condições</b>, veja o que acontece com uma bactéria lisogênica sem estresse e com luz UV. Em <b>Quadro</b>, ponha cada frase na coluna do ciclo certo.</p>`,
    enem: '<b>Lítico</b> = multiplicação imediata e <b>lise</b> (morte) da célula. <b>Lisogênico</b> = DNA viral <b>integrado</b> ao cromossomo (<b>prófago</b>), copiado a cada divisão, sem matar a célula, até a <b>indução</b> para o ciclo lítico. A questão pode trazer o gráfico de uma cultura de bactérias que cresce normalmente e, de repente, despenca depois de uma exposição a UV: é a indução do prófago. A ideia de vírus "dormindo" no DNA reaparece no HIV (provírus, em R2).',
    links: [['O ciclo lítico', '#fagos/litico'], ['Retrovírus e provírus', '#replicacao/retrovirus']],
    init(S) { if (S.tc == null) { S.tc = 0; BQ.zera(S); } },
    tap(x, y, S) {
      if (S.modo === 'quadro') { BQ.tap(x, y, S); return; }
      if (S.modo === 'cond') { const id = hitAt(x, y); if (id === 'cond0' || id === 'cond1') { S.cond = +id.slice(4); S.tc = 0; } }
    },
    grab(x, y, S) { return S.modo === 'quadro' ? BQ.grab(x, y, S) : false; },
    grabMove: BQ.grabMove, grabEnd: BQ.grabEnd,
    draw(t, S) {
      const A = area();
      if (S.modo === 'cond') { if (S.cond != null) S.tc += S.dt || 0; cap(condicoesF2(A, S)); return; }
      if (S.modo === 'quadro') {
        BQ.draw(S, { x0: A.x0, y0: A.y0 + 4, x1: A.x1, y1: A.y1 - 4 }, { cols: NAR ? 1 : 4, cartaH: NAR ? 34 : 42, slotH: NAR ? 50 : undefined });
        cap(BQ.msg(S) || (NAR ? 'Toque numa frase e depois na coluna do ciclo certo.' : 'Arraste cada frase para a coluna certa, ou toque na frase e depois na coluna.'));
        return;
      }
      const v = S.v, L = layF2(A), aL = ss(seg(v, 5, 7.5)), aP = lerp(.4, 1, aL), uvA = seg(v, 23, 24) * (1 - seg(v, 31, 33));
      const ip = injecao(L.inj, v, v >= 8 ? .55 : 1);
      const r1 = faixaF2(L.l1, L.tw, NAR ? 'Caminho 1: ciclo lítico' : 'Ciclo lítico', 'a bactéria morre logo', aP);
      const r2 = faixaF2(L.l2, L.tw, NAR ? 'Caminho 2: ciclo lisogênico' : 'Ciclo lisogênico', NAR ? (v >= 23 ? '' : 'a bactéria vive') : 'o DNA do fago entra no cromossomo e é copiado a cada divisão', aP);
      const rg2 = NAR ? r2 : { x: r2.x, y: r2.y, w: r2.w - 120, h: r2.h }, lamp = NAR ? [L.l2.x + L.l2.w - 22, L.l2.y + 14] : [r2.x + r2.w - 30, r2.y + 22];
      if (!NAR && aL > 0) {
        X.save(); X.globalAlpha *= aL;
        qarrow(ip.x + 6, ip.y - 8, ip.x + 16, L.l1.y + L.l1.h / 2, L.l1.x - 4, L.l1.y + L.l1.h / 2, C.txt, 1.6);
        qarrow(ip.x + 6, ip.y + 8, ip.x + 16, L.l2.y + L.l2.h / 2, L.l2.x - 4, L.l2.y + L.l2.h / 2, C.txt, 1.6);
        X.restore();
      }
      if (aL > 0) {
        X.save(); X.globalAlpha *= aL;
        // cada caminho fica dentro do próprio painel (a lise não atravessa a borda)
        const recorte = R => { X.save(); X.beginPath(); X.rect(R.x, R.y, R.w, R.h); X.clip(); };
        // lítico: a mesma bactéria, com o DNA do fago solto, faz cópias, monta fagos e arrebenta
        const [cw, ch] = tamLiso(rg2), p1 = seg(v, 8, 20), lx = r1.x + Math.max(cw * .75, r1.w * .2);
        recorte(L.l1);
        celB(lx, r1.y + r1.h / 2, cw * 1.2, ch * 1.2, { livre: 1 - seg(p1, 0, .3), p: p1, voo: Math.min(r1.h * .7, cw * 1.6), box: r1 });
        if (p1 >= 1) wrapTx('a bactéria arrebentou e liberou os fagos novos', lx + cw * 2.1 + (r1.w - cw * 2.1 - (lx - r1.x)) / 2, r1.y + r1.h / 2 - 8, Math.max(120, r1.w - cw * 2.6 - (lx - r1.x)), { s: 13, c: C.dim });
        X.restore();
        // lisogênico: integração, três divisões, luz UV e indução
        const integ = seg(v, 8, 12), gd = cl((v - 12) / 3.5, 0, 3);   // três divisões, prontas em v = 22,5
        recorte(L.l2);
        const cells = colonia(rg2, gd, { prof: integ, livre: 1 - integ, ind: 6, uv: seg(v, 24, 26), exc: seg(v, 26, 29), p: seg(v, 29, 36), lamp, box: r2 });
        lampada(lamp[0], lamp[1], uvA, NAR ? 'left' : 'baixo');
        X.restore();
        if (LB && v > 10 && v < 24) {
          const [w0] = tamLiso(rg2);
          // no celular, a pastilha fica entre o título da faixa e as bactérias, à direita do título
          if (NAR) { const c4 = cells.find(q => q.i === 4) || cells[0], ax = c4.x + w0 * .27; lab(ax, c4.y, Math.max(ax, L.l2.x + L.l2.w * .66), r2.y + 6, 'prófago'); }
          else { const c0 = cells.find(q => q.i === 0) || cells[0]; lab(c0.x + w0 * .27, c0.y, c0.x + w0 * .55, r2.y - 12, 'prófago'); }
        }
        X.restore();
      }
      cap(F2CAP(v));
    }
  });

  // =====================================================================================
  // R1 VÍRUS EM CÉLULAS ANIMAIS
  // =====================================================================================
  const R1B = [0, 2.5, 5, 7, 10.5, 12.5, 16];
  const r1Etapa = v => v < 2.5 ? 0 : v < 5 ? 1 : v < 7 ? 2 : v < 10.5 ? 3 : v < 12.5 ? 4 : 5;
  // leitura curta ("3 de 6"): os nomes das etapas já estão na lista ao lado e na legenda
  const ctlR1 = { l: 'Etapa', min: 0, max: 16, step: .1, v: 0, f: v => (r1Etapa(v) + 1) + ' de 6', rate: () => 1 };
  const R1_RIB = pontos(40, 71, .9), R1_PEC = pontos(16, 77, .8), R1_SAI = pontos(10, 83, .7), R1_COP = pontos(6, 89, .7);
  const BUDS = [-2.25, -1.62, -.95];          // onde os vírus brotam (ângulos na membrana)
  const RECS = [-PI / 2, -2.1, -1.0, -2.6, -.5];
  // vírus com envelope (esquema genérico de vírus de RNA): envelope rosa com espículas âmbar, capsídeo e RNA
  function virEnv(x, y, r, o = {}) {
    const a = o.a == null ? 1 : o.a; if (a <= .02) return; X.save(); X.globalAlpha *= a;
    const env = o.env == null ? 1 : o.env, cp = o.cap == null ? 1 : o.cap, gen = o.gen == null ? 1 : o.gen, rot = o.rot || 0;
    if (cp > .02) icosa(x, y, r * .62, { a: cp, ry: rot + .6, capso: false });
    if (gen > .02) novelo(x, y, r * .34, { tipo: 'rna', seed: 4, a: gen });
    if (env > .02) envelope(x, y, r, { a: env, esp: 12, espTipo: 'bola', espLen: r * .36, rot, mostra: o.esp == null ? 1 : o.esp });
    X.restore();
  }
  const virAdeno = (x, y, r, o = {}) => virion(x, y, r, Object.assign({ tipo: 'nu', fibras: true }, o));
  // capsômeros (faces do capsídeo): n triângulos de lado s, a uma distância d do centro, girados por gi
  function pecas(x, y, d, s, n = 10, rot = 0, gi = 0) {
    for (let i = 0; i < n; i++) {
      const g = rot + i / n * TAU, cx = x + Math.cos(g) * d, cy = y + Math.sin(g) * d, q = g + gi;
      shape([0, 1, 2].map(j => [cx + Math.cos(q + j * TAU / 3) * s, cy + Math.sin(q + j * TAU / 3) * s]), BEAD, light(C.capsideo, .2), 1);
    }
  }
  function geoR1(c) {
    const rx = Math.min(c.w * (NAR ? .46 : .4), 340), ry = Math.min(c.h * (NAR ? .3 : .31), rx * .72);
    const cx = c.x + c.w / 2, cy = c.y + c.h - ry - 8, rv = cl(ry * .17, 13, 22);
    return { cx, cy, rx, ry, rv, nx: cx - rx * .3, ny: cy + ry * .22, nrx: rx * .3, nry: ry * .42, qx: cx + rx * .16, qy: cy - ry * .28 };
  }
  // ponto da elipse no ângulo th, deslocado d px pela normal (para fora > 0): [x, y, nx, ny]
  function memPt(G, th, d = 0) {
    const bx = G.cx + Math.cos(th) * G.rx, by = G.cy + Math.sin(th) * G.ry;
    let nx = Math.cos(th) / G.rx, ny = Math.sin(th) / G.ry; const m = Math.hypot(nx, ny); nx /= m; ny /= m;
    return [bx + nx * d, by + ny * d, nx, ny];
  }
  const bump = (bs, th) => bs.reduce((s, b) => { let d = th - b.th; d = Math.atan2(Math.sin(d), Math.cos(d)); return s + b.amp * Math.exp(-(d * d) / (b.wd * b.wd)); }, 0);
  // membrana da célula com saliências (bs = [{ th, amp, wd }]): brotamento (amp > 0) e endocitose (amp < 0).
  // o.lise rompe em pedaços; o.fraca tracejado; o.esp = trechos com espículas virais já colocadas
  function membranaCel(G, bs, o = {}) {
    const N = 240, P = [], d = NAR ? 3 : 3.5;
    for (let i = 0; i < N; i++) { const th = -PI + i / N * TAU; P.push(memPt(G, th, bump(bs, th))); }
    const b = o.lise || 0, P2 = P.map(q => [q[0], q[1]]);
    for (const e of (o.esp || [])) {
      if (e.a <= .02) continue;
      for (let i = 0; i < N; i += 4) {
        const th = -PI + i / N * TAU; let dd = th - e.th; dd = Math.atan2(Math.sin(dd), Math.cos(dd)); if (Math.abs(dd) > e.wd) continue;
        const q = P2[i], q0 = P2[(i + N - 1) % N], q1 = P2[(i + 1) % N];
        espicula(q[0], q[1], Math.atan2(q1[1] - q0[1], q1[0] - q0[0]) - PI / 2, e.len, { tipo: 'bola', a: e.a * (1 - b) });
      }
    }
    if (b <= 0) {
      if (o.fraca) X.setLineDash([12, 2 + o.fraca * 8]);
      membrana(P2, { fechada: true, f: rgba(C.citoplasma, .82), d });
      X.setLineDash([]);
      return;
    }
    const k = ss(b); X.save(); X.globalAlpha *= 1 - seg(b, .55, 1);
    shape(P2, rgba(C.citoplasma, .82 * (1 - k)), null);
    for (let i = 0; i < 16; i++) { const pc = P2.slice(i * 15, i * 15 + 12), m = pc[6], dx = m[0] - G.cx, dy = m[1] - G.cy, dl = Math.hypot(dx, dy) || 1; membrana(pc.map(q => [q[0] + dx / dl * k * 40, q[1] + dy / dl * k * 40]), { d }); }
    X.restore();
  }

  function cenaR1(c, v, S) {
    const G = geoR1(c), adeno = S.vir === 'adeno', endo = adeno || S.endo, rv = G.rv, TOP = -PI / 2;
    const e = r1Etapa(v), k = seg(v, R1B[e], R1B[e + 1]);
    const bs = [], esp = []; let lise = 0, fraca = 0;
    const pTop = memPt(G, TOP), rS = adeno ? rv * .9 : rv, out = 12 + (adeno ? rS * 1.5 : rS * 1.32);
    const espL = rv * .36, wdV = rS * 1.5 / G.rx;
    // o vírus que entra: posição, envelope, vesícula
    let vy = pTop[1] - out, envA = 1, vesA = 0, soCap = false, capX = G.cx, capY = 0, vis = true;
    if (e === 0) vy = lerp(c.y + rS * 1.6, pTop[1] - out, ss(seg(k, 0, .6)));
    else if (e === 1) {
      if (!endo) {   // fusão do envelope com a membrana
        const ka = seg(k, 0, .4), kb = seg(k, .4, 1);
        bs.push({ th: TOP, amp: 2 * rS * ss(ka) * (1 - ss(kb)), wd: wdV * .85 });
        envA = 1 - ss(ka); vy = lerp(pTop[1] - out, pTop[1] - rS * .95, ss(ka));
        esp.push({ th: TOP, wd: wdV * 1.1, a: ss(ka), len: espL });
        if (kb > 0) { soCap = true; capY = lerp(pTop[1] - rS * .95, pTop[1] + rS * 1.7, ss(kb)); }
      } else {       // endocitose: a membrana afunda em volta do vírus e fecha uma vesícula
        const ka = seg(k, 0, .5), kp = seg(k, .5, .62), kr = seg(k, .55, .8), km = seg(k, .6, 1), fundo = 2.8 * rS * ss(ka);
        bs.push({ th: TOP, amp: -fundo * (1 - ss(kr)), wd: wdV });
        const pitY = lerp(pTop[1] - out, pTop[1] + fundo - rS * 1.15, ss(ka));
        vy = kp < 1 ? pitY : lerp(pitY, G.qy - rS * .3, ss(km));
        vesA = ss(kp) * (1 - seg(km, .7, 1));
        if (km > .7) envA = adeno ? 1 : 1 - seg(km, .7, 1);
        if (km >= 1) { soCap = true; capY = G.qy - rS * .3; }
      }
    } else if (e === 2) { soCap = true; const k0 = ss(seg(k, 0, .3)); capX = lerp(G.cx, G.qx, k0); capY = lerp(endo ? G.qy - rS * .3 : pTop[1] + rS * 1.7, G.qy, k0); }
    else vis = false;
    if (e === 2 && !endo) esp.push({ th: TOP, wd: wdV * 1.1, a: 1 - k, len: espL });
    const sint = e === 3 ? k : e > 3 ? 1 : 0, mont = e === 4 ? k : e > 4 ? 1 : 0, sai = e === 5 ? k : 0;
    if (!adeno) BUDS.forEach((th, j) => {
      const kb = seg(sai, j * .17, j * .17 + .55), grow = ss(seg(kb, 0, .55)), rel = seg(kb, .55, .68);
      esp.push({ th, wd: rv * 1.25 / G.rx * (1 + grow * .6), a: ss(seg(sint, .6, 1)) * (1 - seg(kb, .5, .58)), len: espL });
      if (grow > 0) bs.push({ th, amp: 2.6 * rv * grow * (1 - ss(rel)), wd: rv * 1.05 / G.rx });
    });
    if (adeno && sai > 0) { fraca = seg(sai, .3, .45); lise = seg(sai, .45, 1); }
    // célula: membrana, núcleo e ribossomos
    membranaCel(G, bs, { lise, fraca: lise > 0 ? 0 : fraca, esp });
    const den = 1 - ss(seg(lise, 0, .5)), nq = adeno ? seg(sai, 0, .3) : 0;
    X.save(); X.globalAlpha *= den;
    ell(G.nx, G.ny, G.nrx, G.nry, 0, rgba(C.nucleo, .26 * (1 - nq * .6)), null);
    if (nq > 0) X.setLineDash([8, 3 + nq * 10]);
    X.save(); X.globalAlpha *= 1 - nq * .7; ell(G.nx, G.ny, G.nrx, G.nry, 0, null, C.nucleo, 1.6); ell(G.nx, G.ny, G.nrx - 3, G.nry - 3, 0, null, rgba(C.nucleo, .5), 1); X.restore();
    X.setLineDash([]);
    R1_RIB.forEach(p => { const x = G.cx + p[0] * G.rx * .9, y = G.cy + p[1] * G.ry * .82; if (((x - G.nx) / G.nrx) ** 2 + ((y - G.ny) / G.nry) ** 2 < 1.15) return; circ(x, y, NAR ? 1.6 : 2, C.ribo); });
    X.restore();
    // receptores da membrana
    if (e <= 1) for (const th of RECS) {
      if (e === 1 && th === TOP) continue;
      const q = memPt(G, th, bump(bs, th));
      receptor(q[0], q[1], Math.atan2(q[3], q[2]), null, { s: 12, c: th === TOP && e === 0 && k > .6 ? C.amber : C.receptor });
    }
    // o vírus que entra
    if (vis) {
      if (vesA > 0) membrana([...Array(37)].map((_, i) => [G.cx + Math.cos(i / 36 * TAU) * rS * 1.75, vy + Math.sin(i / 36 * TAU) * rS * 1.75]), { a: vesA, d: 2.5 });
      if (soCap) { if (adeno) virAdeno(capX, capY, rS, { rot: 0, cap: e === 2 ? 1 - ss(seg(k, .3, .6)) : 1, fibras: false }); else virEnv(capX, capY, rS, { env: 0, cap: e === 2 ? 1 - ss(seg(k, .3, .6)) : 1 }); }
      else if (adeno) virAdeno(G.cx, vy, rS, {});
      else virEnv(G.cx, vy, rS, { env: envA, esp: envA });
    }
    // desnudamento: as peças do capsídeo se espalham e o ácido nucleico fica solto no citoplasma
    if (e === 2 && k > .3) {
      const kk = ss(seg(k, .3, 1));
      X.save(); X.globalAlpha *= 1 - seg(k, .8, 1) * .7; pecas(G.qx, G.qy, rS * (.5 + kk * 1.9), Math.max(3.5, rS * .32), 10, .3, kk * 3); X.restore();
      novelo(G.qx, G.qy, rS * .45, { tipo: adeno ? 'dna' : 'rna', seed: 4 });
    }
    // síntese: cópias do ácido nucleico (no citoplasma, no vírus de RNA; no núcleo, no adenovírus) e proteínas nos ribossomos
    if (e >= 3 && (!adeno || sai < .3)) {
      const kg = adeno ? ss(seg(sint, 0, .25)) : 0, gx = lerp(G.qx, G.nx, kg), gy = lerp(G.qy, G.ny, kg);
      if (e === 3) novelo(gx, gy, rS * .45, { tipo: adeno ? 'dna' : 'rna', seed: 4 });
      R1_COP.forEach((p, i) => {
        const a0 = cl(seg(sint, .2, .6) * 6 - i, 0, 1) * (1 - ss(seg(mont, i * .1, i * .1 + .5))); if (a0 <= .02) return;
        const ang = i / 6 * TAU + .4;
        if (adeno) { const px = G.nx + Math.cos(ang) * G.nrx * .55, py = G.ny + Math.sin(ang) * G.nry * .55; fita([[px - rv * .6, py], [px + rv * .6, py]], { tipo: 'dna', amp: 2.5, ond: 9, a: a0 }); }
        else { const px = G.qx + Math.cos(ang) * rv * 2.2, py = G.qy + Math.sin(ang) * rv * 1.4; fita([[px - rv * .55, py - rv * .2], [px + rv * .55, py + rv * .2]], { amp: 2.5, ond: 9, a: a0, ph: i }); }
      });
      const kp = seg(sint, .45, 1);
      R1_PEC.forEach((p, i) => {
        const ap = cl(kp * 16 - i, 0, 1) * (1 - ss(mont)); if (ap <= .02) return;
        const x = G.cx + p[0] * G.rx * .75, y = G.cy + p[1] * G.ry * .6; if (((x - G.nx) / G.nrx) ** 2 + ((y - G.ny) / G.nry) ** 2 < 1.2) return;
        X.save(); X.globalAlpha *= ap; pecas(x, y, 0, Math.max(3, rv * .24), 1, i); X.restore();
      });
      if (!adeno) BUDS.forEach((th, j) => {   // espículas recém-feitas indo para a membrana
        const kk = seg(sint, .5 + j * .05, .85 + j * .05); if (kk <= 0 || kk >= 1) return;
        const q = memPt(G, th, -rv * 1.4), x = lerp(G.qx, q[0], ss(kk)), y = lerp(G.qy, q[1], ss(kk));
        espicula(x, y, Math.atan2(q[3], q[2]), espL * 1.2, { tipo: 'bola', a: 1 - seg(kk, .8, 1) });
      });
    }
    // montagem e saída
    if (mont > 0) {
      if (!adeno) BUDS.forEach((th, j) => {
        const kb = seg(sai, j * .17, j * .17 + .55), grow = ss(seg(kb, 0, .55)), rel = seg(kb, .55, .68), am = 2.6 * rv * grow * (1 - ss(rel));
        if (rel > 0) {   // vírus novo, já com o envelope tirado da membrana (fica dentro do palco)
          const q = memPt(G, th, 0), dist = 2.6 * rv * .6 + rv * .9 + seg(kb, .55, 1) * rv * 2.6, m = rv * 1.45;
          virEnv(cl(q[0] + q[2] * dist, c.x + m, c.x + c.w - m), Math.max(c.y + m, q[1] + q[3] * dist), rv, { rot: j }); return;
        }
        const q = memPt(G, th, -rv * 1.05 + am * .95), ka = ss(seg(mont, j * .15, j * .15 + .6));
        if (ka < 1) novelo(lerp(G.qx, q[0], ka), lerp(G.qy, q[1], ka), rv * .3, { tipo: 'rna', seed: j, a: 1 - ka * .5 });
        virEnv(q[0], q[1], rv, { env: 0, cap: ka, gen: ka });
      });
      else for (let i = 0; i < 8; i++) {
        const ang = i / 8 * TAU, px0 = G.nx + Math.cos(ang) * G.nrx * .55, py0 = G.ny + Math.sin(ang) * G.nry * .55, ka = ss(seg(mont, i * .06, i * .06 + .5));
        if (sai <= 0) { virAdeno(px0, py0, rv * .5, { cap: ka, gen: ka, fibras: ka > .9 }); continue; }
        const p = R1_SAI[i % R1_SAI.length], ko = ss(seg(sai, 0, .3)), kx = G.cx + p[0] * G.rx * .7, ky = G.cy + p[1] * G.ry * .55;
        let x = lerp(px0, kx, ko), y = lerp(py0, ky, ko);
        if (lise > 0) { const dx = x - G.cx, dy = y - G.cy, dl = Math.hypot(dx, dy) || 1, kk = ss(lise); x += dx / dl * kk * G.rx * .8; y += dy / dl * kk * G.ry * .9; }
        virAdeno(x, y, rv * .5, { rot: lise * 2 + i });
      }
    }
    // rótulos (no computador, a pastilha não pode entrar no quadro "Fago e vírus animal", à direita da cena)
    const labR = (ax, ay, bx, by, txt) => {
      if (!NAR) { const pw = mtw(txt, 13, 600) + 16, xr = c.x + c.w + 12;
        if (bx >= ax - 1 && bx + pw > xr) bx = xr - pw >= ax - 1 ? xr - pw : Math.min(ax - 2, xr); }
      lab(ax, ay, bx, by, txt);
    };
    if (e === 0 && k > .6) labR(G.cx + 4, pTop[1] - 10, G.cx + G.rx * .55, pTop[1] - rv * 3.2, adeno ? 'fibra se liga ao receptor' : 'espícula se liga ao receptor');
    if (e === 0 && k < .6 && !NAR) { const q = memPt(G, -2.1); labR(q[0], q[1], G.cx - G.rx * .75, c.y + 24, 'membrana da célula'); }
    if (e === 1 && !endo && k > .3) labR(G.cx + rS * 1.2, pTop[1] - rS * .5, G.cx + G.rx * .55, pTop[1] - rv * 3, 'o envelope se funde com a membrana');
    if (e === 1 && endo && k > .55 && k < .95) labR(G.cx + rS * 1.75, vy, G.cx + G.rx * .62, vy - rv * 2.4, 'vesícula');
    if (e === 2 && k > .4) labR(G.qx + rS * 1.6, G.qy - rS * .6, G.qx + G.rx * .45, G.qy - rv * 3.6, 'capsômeros se espalham');
    if (e >= 2 && e <= 3) labR(G.nx - G.nrx * .7, G.ny - G.nry * .7, G.nx - G.nrx * 1.5, G.ny - G.nry * 1.5, 'núcleo');
    if (e === 3 && k > .55) { const p = R1_RIB[5]; labR(G.cx + p[0] * G.rx * .9, G.cy + p[1] * G.ry * .82, G.cx + G.rx * .78, G.cy + G.ry * .92, 'ribossomos da célula'); }
    if (e === 3 && k > .35) {
      if (adeno) labR(G.nx + G.nrx * .55, G.ny, G.nx + G.nrx * 1.8, G.ny + G.nry * .3, 'cópias do DNA');
      else labR(G.qx + rv * 2.2, G.qy, G.qx + G.rx * .5, G.qy + G.ry * .5, 'cópias do RNA');
    }
    if (e === 5 && !adeno && k > .18 && k < .7) { const q = memPt(G, BUDS[1], bump(bs, BUDS[1]) * .6); labR(q[0], q[1], G.cx + G.rx * .12, G.cy - G.ry * .05, 'a membrana vira o envelope'); }
  }

  // faixa "Latência": catapora, vírus quieto num gânglio nervoso, herpes-zóster
  function latencia(A, t) {
    const x0 = A.x0, pw = A.w, y0 = A.y0;
    title('Latência: o vírus da catapora (varicela-zóster)', x0 + pw / 2, y0 + 12, pw - 16, { s: NAR ? 14 : 17 });
    const lx0 = x0 + (NAR ? 18 : 60), lx1 = A.x1 - (NAR ? 18 : 60), ly = y0 + (NAR ? 100 : 96), ax = g => lerp(lx0, lx1, g / 80);
    line(lx0, ly, lx1, ly, C.line, 3);
    for (let g = 0; g <= 80; g += 10) { line(ax(g), ly - 4, ax(g), ly + 4, C.line, 1.5); if (!NAR || g % 20 === 0) tx(String(g), ax(g), ly + 16, { s: 12, f: FD, c: C.dim }); }
    if (!NAR) tx('idade (anos)', lx1, ly + 34, { s: 12, c: C.dim, a: 'right' });
    line(ax(5), ly, ax(65), ly, C.dna, 3, [6, 5]);
    const idade = (t * 6) % 92;
    circ(ax(Math.min(80, idade)), ly, 7, C.amber, '#fff', 2);
    circ(ax(5), ly, 9, C.erro, '#fff', 2); circ(ax(65), ly, 9, C.erro, '#fff', 2);
    mtx('<b>5 anos:</b> catapora', ax(5) - 6, ly - 26, { s: NAR ? 12 : 14, a: 'left', c: C.txt });
    mtx('<b>65 anos:</b> herpes-zóster ("cobreiro")', ax(65) + (NAR ? 14 : 8), NAR ? ly - 48 : ly - 26, { s: NAR ? 12 : 14, a: 'right', c: C.txt });
    tx(NAR ? 'vírus quieto' : 'anos de vírus quieto num gânglio nervoso', ax(35), ly + (NAR ? 34 : 34), { s: 13, w: 600, c: C.dna });
    // neurônio do gânglio, com o DNA do vírus guardado no núcleo, separado do DNA da célula
    const gr = NAR ? 28 : 32, gx = NAR ? x0 + gr + 8 : x0 + pw * .2, gy = ly + (NAR ? 112 : 104);
    X.save(); X.lineCap = 'round';
    line(gx - gr * (NAR ? 1 : 2.6), gy, gx - gr, gy, C.txt, 2.4); line(gx + gr, gy, gx + gr * (NAR ? 1.4 : 3.2), gy + 6, C.txt, 2.4);
    circ(gx, gy, gr, rgba(C.citoplasma, .85), C.membrana, 2); circ(gx, gy, gr * .5, rgba(C.nucleo, .26), C.nucleo, 1.6);
    circuloV(gx + gr * .12, gy, gr * .17, .55 + .45 * Math.sin(t * 2) ** 2);
    X.restore();
    if (LB && !NAR) lab(gx + gr * .12, gy + gr * .1, gx + gr * .6, gy + gr * 1.6, 'DNA do vírus, separado');
    const tx0 = NAR ? gx + gr * 1.5 + 8 : gx + gr * 3.4 + 20, txw = NAR ? A.x1 - tx0 : Math.min(560, A.x1 - tx0);
    let yy = gy - (NAR ? 36 : 24);
    yy += wrapTx('O DNA do vírus fica guardado no <b>núcleo de neurônios</b> de um gânglio nervoso, <b>separado</b> do DNA da célula, sem se integrar.', tx0, yy, txw, { s: 13, a: 'left', c: C.txt }) + 8;
    wrapTx('Quando a imunidade cai, o vírus volta a se multiplicar e desce pelo nervo até a pele.', tx0, yy, txw, { s: 13, a: 'left', c: C.dim });
    wrapTx('Existe vacina contra a catapora (no calendário infantil) e contra o herpes-zóster (para pessoas mais velhas). Idades e doses: veja o calendário vigente.', x0 + pw / 2, A.y1 - (NAR ? 40 : 22), pw - 24, { s: 12, c: C.dim });
  }
  const circuloV = (x, y, r, a) => cromCirc(x, y, r, r * .8, { c: C.dna, a, lw: Math.max(1.2, r * .14), seed: 6 });

  def('replicacao', 'animal', {
    t: 'Vírus em células animais', s: 'entrar inteiro, se desmontar e sair brotando', loc: 'Célula animal em corte e vírus', locNota: NOTA,
    still: 0, stillV: 14.6, ctl: ctlR1, auto: S => S.lat ? 0 : .8, ctlVis: S => !S.lat,
    alt: 'Célula animal em corte, com membrana rosa e núcleo violeta, e um vírus com envelope e espículas âmbar. Em seis etapas: a espícula se liga ao receptor; o envelope se funde com a membrana (ou a célula engole o vírus numa vesícula, na endocitose); o capsídeo se desmonta e libera o RNA (desnudamento); o RNA é copiado e os ribossomos da célula fazem proteínas virais; os vírus se montam perto da membrana; e saem por brotamento, embrulhados num pedaço da membrana. Com o adenovírus, sem envelope, a entrada é por endocitose, o DNA é copiado no núcleo e a saída é pela ruptura da célula',
    extra: [
      { t: 'Com envelope', on: S => { S.vir = 'env'; S.lat = false; poeV(S, 0, ctlR1); }, pressed: S => S.vir !== 'adeno' && !S.lat },
      { t: 'Sem envelope (adenovírus)', on: S => { S.vir = 'adeno'; S.lat = false; poeV(S, 0, ctlR1); }, pressed: S => S.vir === 'adeno' && !S.lat },
      { t: 'Endocitose', on: S => { S.lat = false; if (S.vir === 'adeno') S.aviso = 3.5; else S.endo = !S.endo; poeV(S, 0, ctlR1); }, pressed: S => (S.vir === 'adeno' || !!S.endo) && !S.lat },
      { t: 'Latência', on: S => { S.lat = !S.lat; }, pressed: S => !!S.lat }
    ],
    d: `<p>Nos vírus que infectam animais, as etapas são parecidas com as do fago, com três diferenças importantes. <b>Na entrada</b>, o vírus entra <b>inteiro</b>: depois de se prender ao receptor, ou o envelope <b>se funde</b> com a membrana da célula, ou a célula engole o vírus numa vesícula (<b>endocitose</b>), sem saber que é uma armadilha. <b>Depois</b>, o capsídeo se desmonta e libera o ácido nucleico no citoplasma; essa etapa se chama <b>desnudamento</b>. Vírus de DNA, em geral, levam o DNA ao <b>núcleo</b>, onde são copiados; muitos vírus de RNA se copiam no próprio <b>citoplasma</b>, com uma enzima que eles mesmos codificam (a <b>RNA polimerase dependente de RNA</b>, que a célula não tem).</p>
<p><b>Na saída</b>, vírus sem envelope costumam sair rompendo a célula, como no ciclo lítico. Os <b>envelopados</b> saem por <b>brotamento</b>: o nucleocapsídeo empurra um pedaço da membrana, onde as glicoproteínas virais já foram colocadas, e sai embrulhado nele, ganhando o envelope. A célula pode continuar produzindo vírus por um tempo antes de morrer. Alguns vírus também ficam <b>latentes</b>, quietos dentro da célula por anos. O vírus do <b>herpes simples</b> fica guardado em <b>neurônios</b> e volta a causar as bolhas do herpes labial quando a imunidade cai (estresse, febre, sol forte). O da <b>catapora</b> (varicela-zóster) faz o mesmo e pode voltar décadas depois como <b>herpes-zóster</b> ("cobreiro"). Isso lembra o ciclo lisogênico, mas o DNA do herpes <b>não se integra</b> ao DNA da célula: fica separado, dentro do núcleo.</p>
<p>Na animação, o vírus com envelope é um esquema de vírus de RNA que se copia no citoplasma; o adenovírus, sem envelope, é um vírus de DNA. Compare a saída dos dois: brotamento (como no vírus da gripe) ou ruptura da célula. O botão <b>Endocitose</b> troca a forma de entrada do vírus com envelope. Em <b>Latência</b>, veja a linha do tempo da catapora e do herpes-zóster.</p>`,
    enem: 'As diferenças para o fago: o vírus animal <b>entra inteiro</b> (por <b>fusão</b> ou <b>endocitose</b>), passa pelo <b>desnudamento</b> e, se tiver envelope, sai por <b>brotamento</b>, levando um pedaço da membrana da célula. Uma questão pode perguntar por que uma pessoa tem herpes labial "de novo" sem ter se contaminado outra vez: o vírus ficou <b>latente</b> em neurônios e foi <b>reativado</b>.',
    links: [['O ciclo lítico do fago', '#fagos/litico'], ['A partícula viral', '#estrutura/particula'], ['Retrovírus', '#replicacao/retrovirus'], LK.calendario],
    init(S) { if (S.vir == null) { S.vir = 'env'; S.endo = false; S.lat = false; S.aviso = 0; } },
    draw(t, S) {
      const A = area();
      if (S.lat) { latencia(A, t); cap('Catapora na infância, anos de vírus quieto, herpes-zóster décadas depois: é a <b>latência</b>.'); return; }
      const v = S.v, adeno = S.vir === 'adeno', endo = adeno || S.endo, e = r1Etapa(v), k = seg(v, R1B[e], R1B[e + 1]);
      const nomes = ['Ligação ao receptor', endo ? 'Entrada (endocitose)' : 'Entrada (fusão)', 'Desnudamento', 'Cópia e proteínas', 'Montagem', adeno ? 'Lise da célula' : 'Brotamento'];
      let c;
      if (!NAR) {
        const cw = Math.min(214, A.w * .19), sw = Math.min(236, A.w * .2), px = A.x1 - sw;
        etapas({ x: A.x0, y: A.y0 + 4, w: cw, h: A.h - 8 }, nomes, e);
        c = { x: A.x0 + cw + 20, y: A.y0, w: A.w - cw - sw - 40, h: A.h };
        panel(px, A.y0 + 14, sw, 214);
        tx('Fago e vírus animal', px + 14, A.y0 + 34, { s: 15, w: 700, f: FH, c: '#fff', a: 'left', bg: false });
        let y = A.y0 + 60;
        y += wrapTx('<b>Fago:</b> só o DNA entra; o capsídeo fica fora.', px + 14, y, sw - 28, { s: 13, a: 'left', c: C.txt }) + 8;
        y += wrapTx('<b>Vírus animal:</b> entra inteiro e se desmonta dentro da célula.', px + 14, y, sw - 28, { s: 13, a: 'left', c: C.txt }) + 8;
        wrapTx(adeno ? '<b>Sem envelope:</b> sai rompendo a célula.' : '<b>Com envelope:</b> sai por brotamento.', px + 14, y, sw - 28, { s: 13, a: 'left', c: e === 5 ? C.amber : C.dim });
      } else {
        etapas({ x: A.x0, y: A.y0, w: A.w, h: 40 }, nomes, e);
        c = { x: A.x0, y: A.y0 + 40, w: A.w, h: A.h - 40 };
      }
      cenaR1(c, v, S);
      if (S.aviso > 0) { S.aviso -= S.dt || 0; cap('Sem envelope, o adenovírus não se funde com a membrana: ele entra por <b>endocitose</b>.'); return; }
      const CAPS = [
        adeno ? 'As <b>fibras</b> do adenovírus se encaixam num <b>receptor</b> da membrana da célula.' : 'A <b>espícula</b> do vírus se encaixa num <b>receptor</b> da membrana da célula.',
        adeno ? 'A célula engole o vírus inteiro numa vesícula (<b>endocitose</b>); depois, a vesícula se rompe e solta o capsídeo.'
          : endo ? 'A célula engole o vírus inteiro numa vesícula (<b>endocitose</b>); depois, o envelope se funde com a vesícula e solta o capsídeo.'
            : 'O envelope <b>se funde</b> com a membrana da célula, e o capsídeo entra inteiro.',
        'O capsídeo se desmonta e libera o ácido nucleico no citoplasma: é o <b>desnudamento</b>.',
        adeno ? 'O DNA do adenovírus vai ao <b>núcleo</b> e é copiado lá; os <b>ribossomos da célula</b> fazem as proteínas do vírus.'
          : 'O RNA é copiado no próprio <b>citoplasma</b>, por uma enzima do vírus (a RNA polimerase dependente de RNA); os <b>ribossomos da célula</b> fazem as proteínas do vírus.',
        adeno ? 'Os capsídeos novos se montam no núcleo, cada um com uma cópia do DNA.' : 'As espículas já estão na membrana; os capsídeos com RNA se montam logo abaixo delas.',
        adeno ? 'Sem envelope, o adenovírus sai <b>rompendo a célula</b>, como no ciclo lítico.'
          : k > .6 ? 'De onde veio o envelope do vírus novo? <b>Da membrana desta célula</b>, onde as espículas do vírus já estavam.'
            : 'O capsídeo empurra a membrana e sai embrulhado nela: é o <b>brotamento</b>, como no vírus da gripe.'
      ];
      cap(CAPS[e]);
    }
  });
}
