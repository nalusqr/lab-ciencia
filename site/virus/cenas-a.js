/* LAB, módulo Vírus. Cenas: Natureza (N1, vírus são seres vivos?) e Estrutura (E1, a partícula viral; E2, formas e tipos).
   Código da equipe (Aurelius). Textos: roteiro do Taxon revisado pelo Sapien (docs/revisao-biologia/virus-roteiro.md). */
'use strict';
{
  const NAT = '#D8C08A';
  // passo de tempo das interações: anda mesmo com a animação pausada (quem prefere menos movimento também vê o resultado)
  const passo = S => S.paused ? .12 : Math.min(.05, S.dt || .016);
  const modo = (id, t) => ({ t, on: S => { S.modo = id; S.msg = null; }, pressed: S => S.modo === id });
  const toque = S => { const now = performance.now(), ok = now - (S.tapT || 0) > 200; S.tapT = now; return ok; };
  const maiusc = s => s[0].toUpperCase() + s.slice(1), minusc = s => s[0].toLowerCase() + s.slice(1);
  const NB = ' ';
  // sorteio com semente bem misturada (as primeiras saídas do rng com sementes pequenas ficam parecidas)
  const sorte = k => { const R = rng(Math.imul(k + 1, 2654435761) >>> 0); R(); R(); return R; };

  // =====================================================================================
  // N1 VÍRUS SÃO SERES VIVOS? O filtro de Ivanovsky e Beijerinck, a balança e a escala
  // =====================================================================================
  const FOLHA = '#3FBF6A', FOLHA_E = '#2A9450', MOSAICO = '#E3E88A', PORC = '#E9E4D8', FILTRADO = '#CFE0FF';
  // folha de tabaco esquemática; mancha (0 a 1) espalha o mosaico (manchas claras e escuras)
  function folha(x, y, s, ang, mancha, a = 1) {
    X.save(); X.globalAlpha *= a; X.translate(x, y); X.rotate(ang);
    const w = s * .34, h = s / 2;
    const path = () => { X.beginPath(); X.moveTo(0, h); X.bezierCurveTo(-w * 1.5, h * .4, -w * 1.1, -h * .6, 0, -h); X.bezierCurveTo(w * 1.1, -h * .6, w * 1.5, h * .4, 0, h); X.closePath(); };
    path(); X.fillStyle = rgba(FOLHA, .5); X.fill();
    if (mancha > .01) {
      X.save(); path(); X.clip(); const R = rng(17), n = 30;
      for (let i = 0; i < n; i++) { const px = (R() - .5) * w * 2.3, py = (R() - .5) * h * 1.9, r0 = s * (.05 + R() * .07), k = cl(mancha * n * 1.15 - i, 0, 1); if (k > 0) circ(px, py, r0, rgba(i % 3 ? MOSAICO : FOLHA_E, .8 * k)); }
      X.restore();
    }
    path(); X.strokeStyle = FOLHA_E; X.lineWidth = 1.6; X.stroke();
    line(0, h * 1.25, 0, -h * .8, FOLHA_E, 1.4);
    for (let i = 1; i < 5; i++) { const yy = h * .75 - i * h * .36; line(0, yy, -w * .8, yy - h * .22, FOLHA_E, 1); line(0, yy, w * .8, yy - h * .22, FOLHA_E, 1); }
    X.restore();
  }
  const Q1B = Array.from({ length: 7 }, (_, i) => { const R = sorte(31 + i); return { u: .06 + .88 * R(), v: R(), d: R() * .4, g: (R() - .5) * 1.4 }; });
  const Q1V = Array.from({ length: 18 }, (_, i) => { const R = sorte(71 + i); return { u: .04 + .92 * R(), v: R(), d: R() * .42, bu: R(), bv: R() }; });
  const Q3R = Array.from({ length: 6 }, (_, i) => { const R = sorte(93 + i); return { u: R(), v: R(), g: R() * PI }; });
  const QT = ['Filtrar o suco da folha', 'Pingar na folha sadia', 'Ver no microscópio eletrônico'], QA = ['1892', '1892 e 1898', '1939'];
  const QI = [0, 7, 13];
  function painel(P, n, ativo) {
    panel(P.x, P.y, P.w, P.h, { s: ativo ? 'rgba(232,237,247,.5)' : C.line, f: 'rgba(19,26,43,.55)' });
    circ(P.x + 20, P.y + 18, 11, ativo ? NAT : rgba(NAT, .35)); tx(String(n + 1), P.x + 20, P.y + 18.5, { s: 13, w: 700, c: '#0B0F1C', bg: false });
    mtx(QT[n], P.x + 38, P.y + 18, { f: FH, s: NAR ? 14 : 15, w: 600, a: 'left', c: C.txt, bg: false });
    tx(QA[n], P.x + P.w - 12, P.y + 18, { f: FD, s: 12, w: 500, a: 'right', c: C.dim, bg: false });
  }
  // quadro 1: a seiva da folha com mosaico passa pelo filtro de porcelana; as bactérias ficam, os vírus passam
  function q1(P, q) {
    const x = P.x, w = P.w, y = P.y + 36, h = P.h - 44, cx = x + w / 2;
    const ls = Math.min(w * .24, h * .17);
    folha(x + w * .15, y + ls * .55, ls, -.6, 1, 1 - .45 * ss(seg(q, 0, .2)));
    if (LB) tx('folha com mosaico, triturada', x + w * .15 + ls * .55, y + ls * .25, { s: 12, a: 'left', c: C.dim });
    const fx0 = x + w * .14, fx1 = x + w * .86, top = y + h * .3, fy = y + h * .5, fh = Math.max(14, h * .045);
    arrow(x + w * .15 + ls * .1, y + ls * 1.1, x + w * .2, top - 6, C.dim, 1.2);
    line(fx0, top - 8, fx0, fy, C.dim, 1.4); line(fx1, top - 8, fx1, fy, C.dim, 1.4);
    const lvl = lerp(top + 4, fy - 16, ss(seg(q, .05, .95)));
    X.fillStyle = rgba(FOLHA, .16); X.fillRect(fx0 + 1, lvl, fx1 - fx0 - 2, fy - lvl);
    if (LB) tx('suco da folha', cx, top - 14, { s: 12, c: C.dim });
    rr(fx0 - 4, fy, fx1 - fx0 + 8, fh, 3, rgba(PORC, .5), PORC, 1);
    const np = Math.max(8, Math.floor((fx1 - fx0) / 11)), pore = k => fx0 + (k + .5) * (fx1 - fx0) / np;
    for (let k = 0; k < np; k++) line(pore(k), fy + 1, pore(k), fy + fh - 1, '#0B0F1C', 2);
    const bx0 = cx - w * .27, bx1 = cx + w * .27, by0 = fy + fh + 34, by1 = y + h * .88, lvB = (by1 - by0) * .32;
    X.fillStyle = rgba(FILTRADO, .08); const lb = ss(seg(q, .3, 1)) * lvB; X.fillRect(bx0 + 1, by1 - lb, bx1 - bx0 - 2, lb);
    poly([[bx0, by0], [bx0, by1], [bx1, by1], [bx1, by0]], C.dim, 1.4);
    // vírus: atravessam os poros e caem no béquer
    for (const v of Q1V) {
      const f = seg(q, v.d, v.d + .55), sx = lerp(fx0 + 6, fx1 - 6, v.u), sy = top + 8 + v.v * (fy - top - 26);
      const kk = cl(Math.round((sx - fx0) / (fx1 - fx0) * np - .5), 0, np - 1), px = pore(kk);
      const pts = [[sx, sy], [px, fy - 3], [px, fy + fh + 3], [cl(px, bx0 + 6, bx1 - 6), by0 + 4], [lerp(bx0 + 7, bx1 - 7, v.bu), by1 - 5 - v.bv * Math.max(2, lvB - 8)]];
      const [vx, vy] = pth(pts, ss(f)); circ(vx, vy, 2.4, C.virus, 'rgba(11,15,28,.6)', 1);
    }
    // bactérias: param em cima do filtro
    for (const b of Q1B) {
      const f = ss(seg(q, b.d, b.d + .5)), bx = lerp(fx0 + 10, fx1 - 10, b.u), by = lerp(top + 10 + b.v * (fy - top - 34), fy - 5, f);
      X.save(); X.translate(bx, by); X.rotate(b.g * (1 - f)); rr(-7, -3, 14, 6, 3, rgba(C.bacteria, .9), dark(C.bacteria, .45), 1); X.restore();
    }
    if (LB) {
      tx('filtro de porcelana: segura as bactérias', cx, fy + fh + 15, { s: 12, c: C.txt });
      if (q > .65) tx('bactérias presas', cx, fy - 20, { s: 12, c: C.bacteria });
      tx('filtrado (sem bactérias)', cx, by1 + 15, { s: 12, c: C.dim });
    }
  }
  // quadro 2: o filtrado pingado na folha sadia espalha o mosaico
  function q2(P, q) {
    const x = P.x, w = P.w, y = P.y + 36, h = P.h - 44, cx = x + w / 2;
    const dw = Math.max(9, w * .03), dy0 = y + h * .07, dy1 = y + h * .28;
    ell(cx, dy0, dw * 1.35, dw * 1.5, 0, '#5B6C99', '#9DA9C4', 1);
    rr(cx - dw, dy0 + dw, dw * 2, dy1 - dy0 - dw, 3, rgba(FILTRADO, .08), C.dim, 1.2);
    X.fillStyle = rgba(FILTRADO, .18); X.fillRect(cx - dw + 1, lerp(dy0 + dw * 2, dy1 - 6, ss(seg(q, .05, .45))), dw * 2 - 2, Math.max(0, dy1 - lerp(dy0 + dw * 2, dy1 - 6, ss(seg(q, .05, .45)))));
    shape([[cx - dw, dy1], [cx + dw, dy1], [cx + 2, dy1 + dw * 1.4], [cx - 2, dy1 + dw * 1.4]], rgba(FILTRADO, .1), C.dim, 1.2);
    if (LB) tx('o filtrado', cx + dw * 2.2, dy0 + dw * 2.4, { s: 12, a: 'left', c: C.dim });
    const s = Math.min(w * .7, h * .46), ly = y + h * .58, hit = ly - s * .18;
    const mancha = ss(seg(q, .42, .95));
    folha(cx, ly, s, 0, mancha);
    for (let i = 0; i < 3; i++) {
      const d0 = .08 + i * .1, f = seg(q, d0, d0 + .12); if (f <= 0) continue;
      if (f < 1) { const yy = lerp(dy1 + dw * 1.6, hit, f * f); circ(cx, yy, 3.6, rgba(FILTRADO, .75)); shape([[cx - 3, yy - 1], [cx + 3, yy - 1], [cx, yy - 8]], rgba(FILTRADO, .75)); }
      else { const k = seg(q, d0 + .12, d0 + .3); if (k < 1) circ(cx, hit, 4 + k * 14, null, rgba(FILTRADO, .6 * (1 - k)), 1.4); }
    }
    if (LB && mancha > .5) tx('a folha sadia também fica com mosaico', cx, ly + s * .625 + 14, { s: 12, c: C.txt });
  }
  // quadro 3: microscópio eletrônico com os bastonetes do vírus do mosaico do tabaco
  function q3(P, q, t) {
    const x = P.x, w = P.w, y = P.y + 36, h = P.h - 44, cx = x + w / 2, cy = y + h * .48;
    const R0 = Math.min(w * .42, h * .36), R = R0 * (.3 + .7 * ss(seg(q, 0, .3)));
    circ(cx, cy, R, '#05070D', 'rgba(232,237,247,.45)', 2);
    X.save(); X.beginPath(); X.arc(cx, cy, R - 1, 0, TAU); X.clip();
    const G = rng(5); for (let i = 0; i < 70; i++) circ(cx + (G() - .5) * 2 * R, cy + (G() - .5) * 2 * R, 1 + G() * 1.5, 'rgba(185,194,211,.07)');
    const L = R0 * .5, th = Math.max(2.5, L * .035), ar = ss(seg(q, .25, .6));
    X.globalAlpha *= ar;
    for (const r of Q3R) {
      const rad = Math.sqrt(r.u) * R0 * .5, g = r.v * TAU, px = cx + Math.cos(g) * rad, py = cy - R0 * .08 + Math.sin(g) * rad * .8;
      X.save(); X.translate(px, py); X.rotate(r.g + Math.sin(t * .3 + r.u * 5) * .03);
      rr(-L / 2, -th, L, 2 * th, th, rgba(C.virus, .85)); for (let k = 3; k < L - 2; k += 4) line(-L / 2 + k, -th + .5, -L / 2 + k + 2, th - .5, 'rgba(11,15,28,.35)', 1);
      X.restore();
    }
    X.restore();
    if (q > .55) { X.save(); X.globalAlpha *= ss(seg(q, .55, .8)); regua(cx - L / 2, cy + R0 * .76, L, `300${NB}nm`); X.restore(); }
    if (LB) {
      tx('imagem de microscópio eletrônico', cx, cy - R - 12, { s: 12, c: C.dim });
      if (q > .5) tx('bastonetes do vírus do mosaico do tabaco', cx, cy + R + 16, { s: 12, c: C.txt });
    }
  }
  const QCAP = [
    '1892, Ivanovsky: o suco de uma folha de tabaco com mosaico passa por um filtro de porcelana, que segura as bactérias.',
    'O filtrado, sem bactérias, ainda infecta a folha sadia: Ivanovsky viu isso em 1892. Em 1898, Beijerinck concluiu que era um agente novo, menor que qualquer bactéria.',
    `1939: o microscópio eletrônico mostra os bastonetes do vírus do mosaico do tabaco, com cerca de 300${NB}nm.`
  ];
  function drawExp(t, S, A) {
    const tt = t % 21, at = tt < 7 ? 0 : tt < 13 ? 1 : 2, Q = [seg(tt, .5, 6.5), seg(tt, 7.5, 12.5), seg(tt, 13.5, 18.5)], fs = [q1, q2, q3];
    if (NAR) {
      for (let i = 0; i < 3; i++) { const bx = A.cx + (i - 1) * 40, on = i === at; circ(bx, A.y0 + 6, on ? 11 : 9, on ? NAT : rgba(NAT, .25), on ? null : rgba(NAT, .6), 1); tx(String(i + 1), bx, A.y0 + 6.5, { s: 12, w: 700, c: on ? '#0B0F1C' : C.txt, bg: false }); hitC(bx, A.y0 + 6, 18, 'q' + i); }
      const P = { x: A.x0, y: A.y0 + 24, w: A.w, h: A.h - 24 };
      painel(P, at, true); fs[at](P, Q[at], t);
    } else {
      const g = 16, pw = (A.w - 2 * g) / 3;
      for (let i = 0; i < 3; i++) {
        const P = { x: A.x0 + i * (pw + g), y: A.y0, w: pw, h: A.h };
        painel(P, i, i === at); X.save(); X.globalAlpha *= i <= at ? 1 : .4; fs[i](P, i < at ? 1 : i === at ? Q[i] : 0, t); X.restore();
        hitR(P.x, P.y, P.w, P.h, 'q' + i);
      }
    }
    cap(QCAP[at]);
  }
  // "Vivo ou não vivo?": balança de dois pratos
  const VIVO = baralho({
    nome: 'viv',
    alvos: [{ t: 'como um ser vivo', c: '#6BCB77' }, { t: 'diferente de um ser vivo', c: '#FF9A3C' }],
    cartas: [
      { t: 'tem DNA ou RNA', k: 0, x: 'como os seres vivos, o vírus tem material genético, que passa para as cópias (hereditariedade).' },
      { t: 'sofre mutação', k: 0, x: 'o material genético do vírus muda, como o de qualquer ser vivo.' },
      { t: 'evolui por seleção natural', k: 0, x: 'é assim que surgem as variantes do vírus da gripe e da covid-19.' },
      { t: 'não tem célula', k: 1, x: 'o vírus é acelular: só um ácido nucleico numa capa de proteína.' },
      { t: 'não tem metabolismo próprio', k: 1, x: 'sem citoplasma nem enzimas para produzir energia, fora da célula ele é inerte.' },
      { t: 'não tem ribossomos', k: 1, x: 'para fazer as próprias proteínas, usa os ribossomos da célula que infecta.' },
      { t: 'só se multiplica dentro de uma célula', k: 1, x: 'é um parasita intracelular obrigatório; as cópias são montadas a partir de peças.' },
      { t: 'pode ser cristalizado, como um sal', k: 1, x: 'Wendell Stanley cristalizou o vírus do mosaico do tabaco em 1935.' }
    ],
    certo: c => `Isso: ${c.x}`,
    errado: c => `Olhe de novo: nesse ponto o vírus é ${c.k ? 'diferente dos' : 'parecido com os'} seres vivos.`,
    fim: () => 'Por isso muitos autores não consideram o vírus um ser vivo, mas a questão continua em debate.',
    dica: 'Primeiro toque num cartão; depois, num dos pratos da balança.'
  });
  function drawViv(S, A) {
    const hdr = NAR ? 22 : 26;
    title(NAR ? 'Como é o vírus? Leve cada cartão a um prato.' : 'Como é o vírus? Leve cada cartão para um dos pratos da balança.', A.cx, A.y0 + 6, A.w, { s: NAR ? 13 : 15 });
    const bx = { x0: A.x0, y0: A.y0 + hdr, x1: A.x1, y1: A.y1 };
    const cols = NAR ? 2 : 4, ch = NAR ? 36 : 40, g = NAR ? 6 : 8, rows = Math.ceil(VIVO.cartas.length / cols);
    const yb = bx.y0 + rows * (ch + g) + (NAR ? 14 : 18), b = S.viv || {}, on = b.onde || {};
    const nL = Object.values(on).filter(k => k === 0).length, nR = Object.values(on).filter(k => k === 1).length;
    S.tilt = lerp(S.tilt || 0, cl((nR - nL) * .045, -.2, .2), 1 - Math.exp(-5 * passo(S)));
    const bh = NAR ? A.w * .27 : Math.min(A.w * .28, 330), a = S.tilt, hang = 22;
    const pw = NAR ? Math.min(A.w * .47, 2 * bh - 14) : Math.min(A.w * .34, 360), ph = A.y1 - yb - hang - bh * Math.sin(.2) - 16;
    const ends = [[A.cx - bh * Math.cos(a), yb - bh * Math.sin(a)], [A.cx + bh * Math.cos(a), yb + bh * Math.sin(a)]];
    const R = ends.map(([ex, ey]) => ({ x: ex - pw / 2, y: ey + hang, w: pw, h: ph }));
    line(A.cx, yb, A.cx, A.y1 - 6, '#9DA9C4', 4); rr(A.cx - 40, A.y1 - 8, 80, 8, 4, '#5B6C99');
    R.forEach((r, k) => { const [ex, ey] = ends[k]; line(ex, ey, r.x + 12, r.y, C.dim, 1); line(ex, ey, r.x + r.w - 12, r.y, C.dim, 1); });
    X.lineCap = 'round'; line(ends[0][0], ends[0][1], ends[1][0], ends[1][1], '#C9D3F0', 5); X.lineCap = 'butt'; circ(A.cx, yb, 6, '#C9D3F0', '#0B0F1C', 1.5);
    VIVO.draw(S, bx, { cols, cartaH: ch, slotH: 32, alvoRect: k => R[k] });
    cap(VIVO.msg(S) || 'O vírus tem algumas características dos seres vivos e não tem outras. Toque num cartão e depois num prato (no computador, também dá para arrastar).');
  }
  // "Escala": régua logarítmica de 10 nm a 10 µm
  const ESC = [
    { n: 'poliovírus', nm: 30, ic: 'polio', d: `cerca de 30${NB}nm`, x: 'o vírus da poliomielite (paralisia infantil).' },
    { n: 'vírus da gripe', nm: 100, ic: 'gripe', d: `cerca de 100${NB}nm`, x: 'o vírus influenza.' },
    { n: 'HIV', nm: 120, ic: 'hiv', d: `cerca de 120${NB}nm`, x: 'o vírus que causa a aids.' },
    { n: 'mimivírus', nm: 750, ic: 'mimi', d: `cerca de 750${NB}nm`, x: 'um vírus gigante, maior que algumas bactérias.' },
    { n: 'bactéria', nm: 2000, ic: 'bac', d: `cerca de 2${NB}µm (2${NB}000${NB}nm)`, x: 'uma bactéria comum.' },
    { n: 'hemácia', nm: 7000, ic: 'hem', d: `cerca de 7${NB}µm (7${NB}000${NB}nm)`, x: 'uma célula do sangue humano.' }
  ];
  function icEsc(id, x, y, s, t) {
    if (id === 'hem') { ell(x, y, s * .5, s * .44, 0, rgba(C.hemacia, .85), '#8E1F27', 1.2); ell(x, y, s * .24, s * .2, 0, 'rgba(240,120,128,.45)'); }
    else if (id === 'bac') bicho('bacteria', x, y, s, { c: C.bacteria });
    else if (id === 'mimi') { for (let i = 0; i < 30; i++) { const g = i / 30 * TAU; line(x + Math.cos(g) * s * .34, y + Math.sin(g) * s * .34, x + Math.cos(g) * s * .5, y + Math.sin(g) * s * .5, rgba(C.virus, .7), 1); } icosa(x, y, s * .36, { ry: t * .3, capso: false }); }
    else if (id === 'hiv') virion(x, y, s * .38, { tipo: 'hiv', rot: t * .2 });
    else if (id === 'gripe') virion(x, y, s * .38, { tipo: 'gripe', rot: t * .2 });
    else icosa(x, y, s * .36, { ry: t * .3, capso: false });
  }
  function drawEsc(t, S, A) {
    const lg = v => Math.log10(v), L0 = 1, L1 = 4;
    if (!NAR) {
      const xa = A.x0 + 56, xb = A.x1 - 56, ay = A.y0 + A.h * .74, Xp = v => lerp(xa, xb, (lg(v) - L0) / (L1 - L0)), s = 50;
      rr(Xp(20), ay - 14, Xp(300) - Xp(20), 28, 6, rgba(C.virus, .14));
      if (LB) tx(`a maioria dos vírus: 20 a 300${NB}nm`, (Xp(20) + Xp(300)) / 2, ay + 46, { s: 12, c: C.virus });
      line(xa, ay, xb, ay, C.txt, 1.5);
      for (let d = L0; d <= L1; d++) { const x = Xp(10 ** d); line(x, ay - 8, x, ay + 8, C.txt, 1.5); tx(['10 nm', '100 nm', '1 µm', '10 µm'][d - 1].replace(' ', NB), x, ay + 24, { f: FD, s: 12, w: 500, c: C.txt }); if (d < L1) for (let m = 2; m < 10; m++) { const xm = Xp(m * 10 ** d); line(xm, ay - 4, xm, ay + 4, C.dim, 1); } }
      ESC.forEach((e, i) => {
        const x = Xp(e.nm), y = ay - (i % 2 ? 160 : 74), sel = S.sel === i;
        line(x, y + s * .55, x, ay - 2, rgba(C.dim, .8), 1, [3, 4]); circ(x, ay, 4, sel ? C.amber : C.txt);
        if (sel) circ(x, y, s * .62, null, C.amber, 2);
        icEsc(e.ic, x, y, s, t); hitC(x, y, s * .62, 'e' + i);
        tx(e.n, x, y - s * .5 - 12, { s: 13, w: 600, c: sel ? C.amber : C.txt });
      });
    } else {
      const axx = A.x0 + 64, ya = A.y0 + 70, yb = A.y1 - 16, Yp = v => lerp(yb, ya, (lg(v) - L0) / (L1 - L0)), s = 38;
      rr(axx - 10, Yp(300), 20, Yp(20) - Yp(300), 6, rgba(C.virus, .16));
      line(axx, ya, axx, yb, C.txt, 1.5);
      for (let d = L0; d <= L1; d++) { const y = Yp(10 ** d); line(axx - 7, y, axx + 7, y, C.txt, 1.5); tx(['10 nm', '100 nm', '1 µm', '10 µm'][d - 1].replace(' ', NB), axx - 12, y, { f: FD, s: 12, w: 500, a: 'right', c: C.txt }); if (d < L1) for (let m = 2; m < 10; m++) { const ym = Yp(m * 10 ** d); line(axx - 3, ym, axx + 3, ym, C.dim, 1); } }
      ESC.forEach((e, i) => {
        const y0 = Yp(e.nm), y = y0 + (e.ic === 'hiv' ? -16 : e.ic === 'gripe' ? 16 : 0), x = i % 2 ? A.x0 + A.w * .74 : A.x0 + A.w * .43, sel = S.sel === i;
        poly([[axx + 2, y0], [axx + 18, y0], [axx + 30, y], [x - s * .55, y]], rgba(C.dim, .8), 1, [3, 4]); circ(axx, y0, 3.5, sel ? C.amber : C.txt);
        if (sel) circ(x, y, s * .62, null, C.amber, 2);
        icEsc(e.ic, x, y, s, t); hitC(x, y, s * .66, 'e' + i);
        tx(e.n, x, y + s * .5 + 11, { s: 12, w: 600, c: sel ? C.amber : C.txt });
      });
    }
    const e = ESC[S.sel];
    cap(e ? `<b>${maiusc(e.n)}</b>: ${e.d}, ${e.x}` : `Toque em cada um para ver o tamanho. A régua é logarítmica: cada número vale 10 vezes o anterior. A faixa cinza marca a maioria dos vírus (20 a 300${NB}nm).`);
  }

  def('natureza', 'vivo', {
    t: 'Vírus são seres vivos?', s: 'passam no filtro, não têm célula e só se multiplicam dentro de outra', c: NAT,
    loc: S => ({ exp: 'Do filtro ao microscópio eletrônico', viv: 'Balança: o vírus e os seres vivos', esc: 'Régua de tamanhos' })[S.modo] || 'Do filtro ao microscópio eletrônico',
    locNota: S => S.modo === 'esc' ? 'Régua logarítmica; ícones fora de escala' : 'Desenho esquemático',
    ctlVis: S => S.modo === 'exp',
    alt: 'o experimento de Ivanovsky e Beijerinck em três quadros: o suco de folha de tabaco com mosaico passa por um filtro de porcelana que segura as bactérias, o filtrado infecta uma folha sadia, e o microscópio eletrônico mostra os bastonetes do vírus; há também uma balança para separar o que o vírus tem de parecido e de diferente dos seres vivos e uma régua de tamanhos de 10 nanômetros a 10 micrômetros',
    still: 19.5,
    extra: [modo('exp', 'Experimento'), modo('viv', 'Vivo ou não vivo?'), modo('esc', 'Escala')],
    init(S) { S.modo = 'exp'; S.sel = null; S.tilt = 0; VIVO.zera(S); },
    d: `<p>No fim do século XIX, os cientistas já sabiam que muitas doenças eram causadas por bactérias, e um jeito de provar isso era passar o líquido doente por um <b>filtro de porcelana</b>, com poros tão finos que seguravam as bactérias. Em <b>1892</b>, o russo <b>Dmitri Ivanovsky</b> fez isso com a seiva de plantas de tabaco com a <b>doença do mosaico</b> (folhas manchadas) e viu que o líquido filtrado continuava infectando plantas sadias. Em <b>1898</b>, o holandês <b>Martinus Beijerinck</b> repetiu o experimento e concluiu que o agente era algo novo, menor que qualquer bactéria e que só se multiplicava dentro da planta. Chamou-o de <b>vírus</b> (do latim, "veneno"). Ninguém viu um vírus até <b>1939</b>, quando o <b>microscópio eletrônico</b> mostrou os bastonetes do vírus do mosaico do tabaco. A maioria dos vírus mede de <b>20 a 300 nanômetros</b>: uma bactéria comum tem cerca de 2${NB}000${NB}nm.</p>
<p>Um vírus <b>não tem célula</b>: é só um <b>ácido nucleico</b> (DNA ou RNA) dentro de uma capa de proteína. Não tem citoplasma, ribossomos nem enzimas para produzir energia, e por isso <b>não tem metabolismo próprio</b>. Fora de uma célula, é uma partícula inerte, que pode até ser <b>cristalizada</b>, como um sal (Wendell Stanley fez isso com o vírus do mosaico em 1935). Dentro de uma célula, usa a maquinaria dela para fazer cópias de si mesmo: é um <b>parasita intracelular obrigatório</b>. Também não cresce nem se divide: as cópias são <b>montadas</b> a partir de peças. Por tudo isso, muitos autores <b>não consideram os vírus seres vivos</b>, ou os colocam "na fronteira" da vida. Por outro lado, os vírus têm <b>material genético</b>, que passa para as cópias (<b>hereditariedade</b>), sofrem <b>mutação</b> e <b>evoluem por seleção natural</b>: é assim que surgem as variantes do vírus da gripe e da covid-19. A descoberta de <b>vírus gigantes</b>, como o <b>mimivírus</b> (cerca de 750${NB}nm, maior que algumas bactérias), reacendeu o debate. Na Biologia, a resposta mais honesta é: depende da definição de vida que se usa.</p>
<p>Toque num quadro para ir direto a ele. Em "Vivo ou não vivo?", leve cada cartão para um prato da balança; em "Escala", toque em cada um para ver o tamanho. A régua de "Escala" é logarítmica: cada número vale 10 vezes o anterior, e os tracinhos entre dois números marcam 2, 3, 4 até 9 vezes o número menor.</p>`,
    enem: 'As duas ideias mais cobradas: vírus são <b>acelulares</b> e <b>parasitas intracelulares obrigatórios</b>. Delas sai tudo: por que não entram em nenhum reino, por que <b>antibióticos não funcionam</b> contra vírus (agem em parede e ribossomos de bactérias, que o vírus não tem) e por que é preciso cultivar vírus <b>em células vivas</b> (ovos embrionados, culturas de células) para estudá-los ou fazer vacinas. Se a questão perguntar o argumento <b>a favor</b> de serem vivos, a resposta é <b>material genético com mutação e evolução</b>.',
    links: [LK.morfo, LK.reinos, ['A partícula viral', '#estrutura/particula']],
    tap(x, y, S) {
      if (S.modo === 'viv') { VIVO.tap(x, y, S); return; }
      if (!toque(S)) return; const h = hitAt(x, y);
      if (S.modo === 'esc') { S.sel = typeof h === 'string' && h[0] === 'e' ? (S.sel === +h.slice(1) ? null : +h.slice(1)) : null; return; }
      if (typeof h === 'string' && h[0] === 'q') S.ph = Math.floor(S.ph / 21) * 21 + (S.paused ? [6.6, 12.6, 18.6][+h[1]] : QI[+h[1]] + .01);
    },
    grab(x, y, S) { return S.modo === 'viv' && VIVO.grab(x, y, S); },
    grabMove(x, y, S) { VIVO.grabMove(x, y, S); },
    grabEnd(x, y, S) { VIVO.grabEnd(x, y, S); },
    draw(t, S) {
      const A = area();
      if (S.modo === 'viv') drawViv(S, A); else if (S.modo === 'esc') drawEsc(t, S, A); else drawExp(t, S, A);
    }
  });

  // =====================================================================================
  // E1 A PARTÍCULA VIRAL: montagem, corte, sabão e "chave e fechadura"
  // =====================================================================================
  const SABAO = '#9AD7C9';
  // membrana horizontal em ym que se curva por cima de um círculo (px, py, R) que a atravessa (brotamento)
  function memPts(x0, x1, ym, px, py, R) {
    const d = ym - py; if (Math.abs(d) >= R - .5) return [[x0, ym], [x1, ym]];
    const dx = Math.sqrt(R * R - d * d), pts = [[x0, ym], [px - dx, ym]];
    let a0 = Math.atan2(d, -dx); const a1 = Math.atan2(d, dx); if (a0 > 0) a0 -= TAU;
    for (let i = 1; i < 40; i++) { const g = lerp(a0, a1, i / 40); pts.push([px + Math.cos(g) * R, py + Math.sin(g) * R]); }
    pts.push([px + dx, ym], [x1, ym]); return pts;
  }
  function layE1(A) {
    const r = Math.min((A.h - 24) / 4.6, A.w * (NAR ? .2 : .19)), top = A.y0 + 8 + Math.max(0, (A.h - 24 - 4.6 * r) / 2), ym = top + 2.75 * r + 6;
    return { r, ym, yin: ym + r + 6, yout: ym - 1.4 * r - 6 };
  }
  const E1CAP = [
    '1. O ácido nucleico: aqui, RNA em 8 pedaços, como no vírus da gripe.',
    '2. Os capsômeros, unidades de proteína, se encaixam sozinhos em volta do RNA: formam o capsídeo.',
    '3. As espículas (glicoproteínas do vírus), fabricadas pela célula, ficam espetadas na membrana dela.',
    '4. O nucleocapsídeo empurra esse trecho da membrana e sai embrulhado nele: é o envelope, já com as espículas.'
  ];
  function drawMont(t, S, A) {
    const L = layE1(A), r = L.r, cx = A.cx, tm = S.sabOn ? 99 : t;
    const gen = ss(seg(tm, .3, 2.2)), capP = ss(seg(tm, 2.4, 5.4)), espM = ss(seg(tm, 5.6, 7.2)), rise = ss(seg(tm, 7.4, 11)), pronto = tm >= 12.5;
    S.cv = lerp(S.cv || 0, S.corte ? 1 : 0, 1 - Math.exp(-6 * passo(S)));
    if (S.sabOn) S.sab = Math.min(1.2, (S.sab || 0) + passo(S) / 5);
    const sb = S.sabOn ? S.sab : 0, py = lerp(lerp(L.yin, L.yout, rise), A.cy, ss(seg(sb, 0, .25))), sep = py <= L.ym - r + .5 || S.sabOn, rot = Math.max(0, t - 12.5) * .05, desfaz = ss(seg(sb, .15, .7)), solta = ss(seg(sb, .2, .8)), lado = ss(seg(sb, .65, 1)) * r * .55, mA = 1 - ss(seg(sb, 0, .2));
    // célula: citoplasma abaixo da membrana (a membrana se curva no brotamento)
    const mp = memPts(-4, W + 4, L.ym, cx, S.sabOn ? -1e4 : py, r);
    X.save(); X.globalAlpha *= mA;
    X.beginPath(); mp.forEach((p, i) => i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1])); X.lineTo(W + 4, H + 4); X.lineTo(-4, H + 4); X.closePath(); X.fillStyle = rgba(C.citoplasma, .6); X.fill();
    X.restore();
    if (!sep) {
      virion(cx, py, r, { tipo: 'gripe', gen, cap: capP, env: 0, ph: t });
      if (capP > 0 && capP < 1) {
        const R0 = rng(44);
        for (let i = 0; i < 24; i++) {
          const a0 = lerp(-.3, PI + .3, R0()), d0 = r * (1.5 + R0() * .8), a1 = R0() * TAU, d1 = Math.sqrt(R0()) * r * .55, dl = R0() * .45, f = ss(seg(capP, dl, dl + .55));
          if (f < 1) circ(cx + lerp(Math.cos(a0) * d0, Math.cos(a1) * d1, f), py + lerp(Math.sin(a0) * d0, Math.sin(a1) * d1, f), Math.max(2, r * .045), mix('#1A2033', C.capsideo, .75), 'rgba(11,15,28,.5)', 1);
        }
      }
    } else if (S.sabOn) {
      virion(cx - lado, py + lado * .3, r, { tipo: 'gripe', env: 0, ph: t });
      virion(cx, py, r, { tipo: 'gripe', gen: 0, cap: 0, rot, corte: 1, desfaz, solta });
    } else virion(cx, py, r, { tipo: 'gripe', ph: t, rot, corte: S.cv });
    X.save(); X.globalAlpha *= mA; membrana(mp, { d: 4 }); X.restore();
    // as espículas já estão na membrana da célula antes do brotamento: o envelope sai com elas
    if (!sep && espM > 0) for (let i = 0; i < 22; i++) { const g = i / 22 * TAU; if (Math.sin(g) > -.05) continue; const ax = cx + Math.cos(g) * r, ay = py + Math.sin(g) * r, fora = ay < L.ym - 4; espicula(ax, fora ? ay : L.ym - 4, fora ? g : -PI / 2, r * .3 * espM, { tipo: i % 4 === 3 ? 'N' : 'H' }); }
    if (LB && mA > .05) { X.save(); X.globalAlpha *= mA; tx('fora da célula', A.x0 + 4, L.ym - 12, { s: 12, a: 'left', c: C.dim }); tx('citoplasma da célula', A.x0 + 4, L.ym + 18, { s: 12, a: 'left', c: C.dim }); X.restore(); }
    // sabão: moléculas com cabeça para fora e cauda para dentro, que entram no envelope e o desmancham
    if (S.sabOn) {
      const R0 = rng(77);
      for (let i = 0; i < 26; i++) {
        const g = R0() * TAU, d0 = r * (1.8 + R0() * .7), dl = R0() * .1, f = ss(seg(sb, dl, dl + .25)), d1 = r * 1.06 + desfaz * r * .55 * (1 + (i % 3) * .3);
        const d = lerp(d0, d1, f), px = cx + Math.cos(g) * d, qy = py + Math.sin(g) * d;
        line(px, qy, px - Math.cos(g) * 8, qy - Math.sin(g) * 8, SABAO, 1.6); circ(px, qy, 3.2, SABAO);
      }
      if (LB) tx('sabão', cx + r * 1.75, py - r * 1.05, { s: 12, w: 600, c: SABAO });
      if (sb > .75) tok(cx - lado, py + lado * .3 + r * .95, 'inativado', C.dim, { s: 12 });
    }
    // rótulos
    if (LB && pronto && !S.sabOn) {
      const el = r * .3, sp = i => { const g = rot + i / 22 * TAU; return [cx + Math.cos(g) * (r + el * .7), py + Math.sin(g) * (r + el * .7)]; };
      const [hx, hy] = sp(0), [nx, ny] = sp(3), eg = rot + PI * .78, ex = cx + Math.cos(eg) * r, ey = py + Math.sin(eg) * r, R1 = r * 1.75;
      const T = NAR ? ['envelope', 'espícula H', 'espícula N', 'RNA', 'capsídeo', 'membrana'] : ['envelope (lipídios da célula)', 'espícula H (hemaglutinina)', 'espícula N (neuraminidase)', 'RNA (8 pedaços)', 'capsídeo (capsômeros)', 'membrana da célula'];
      // no celular não cabe rótulo dos lados: duas fileiras acima da partícula e a espícula N embaixo, à direita
      const P = NAR ? { e: [cx - r * .95, py - r * 1.7], h: [cx + r * .95, py - r * 1.7], rna: [cx + r * .95, py - r * 2.2], cap: [cx - r * .95, py - r * 2.2], n: [cx + r * 1.4, py + r * 1.05] }
        : { e: [cx - R1, py + r * .55], h: [cx + R1, py - r * .55], rna: [cx + R1, py + r * .25], cap: [cx - R1, py - r * .5], n: [cx + R1, py + r * (S.cv > .5 ? .95 : .4)] };
      lab(ex, ey, ...P.e, T[0]);
      lab(hx, hy, ...P.h, T[1]);
      if (S.cv > .5) { lab(cx + Math.cos(.4) * r * .26, py + Math.sin(.4) * r * .26, ...P.rna, T[3]); lab(cx - r * .5, py - r * .12, ...P.cap, T[4]); }
      lab(nx, ny, ...P.n, T[2]);
      if (!NAR) lab(cx + r * 2.2, L.ym, cx + r * 2.6, L.ym + 40, T[5]);
    }
    let c = pronto ? (S.cv > .5 ? 'Em corte: RNA, capsídeo (ácido nucleico mais capsídeo formam o nucleocapsídeo), envelope de lipídios e espículas H e N.' : 'Partícula pronta. Toque em Corte para abrir ao meio, ou em Sabão para ver o que acontece com o envelope.') : E1CAP[tm < 2.4 ? 0 : tm < 5.6 ? 1 : tm < 7.4 ? 2 : 3];
    if (S.sabOn) c = sb < .7 ? 'O sabão se mistura aos lipídios do envelope e o desmancha; as espículas se soltam.' : 'Sem envelope e sem espículas, o vírus não consegue se prender à célula: está inativado.';
    cap(c);
  }
  // "Chave e fechadura": cada vírus só entra na célula que tem o receptor certo
  const VK = [
    { n: 'HIV', e: 'gp120', tipo: 'hiv', c: 0, ok: 'A gp120 do HIV encaixa na proteína CD4 do linfócito T auxiliar: o vírus entra.' },
    { n: 'SARS-CoV-2', e: 'proteína S', tipo: 'corona', c: 1, ok: 'A proteína S (<i>spike</i>) encaixa na ECA2, presente em células do nariz, do pulmão e de outros órgãos: o vírus entra.' },
    { n: 'vírus da gripe', e: 'hemaglutinina (H)', tipo: 'gripe', c: 2, ok: 'A hemaglutinina (H) se liga ao ácido siálico, um açúcar da superfície das células das vias respiratórias: o vírus entra.' }
  ];
  const CK = [{ n: 'linfócito T auxiliar', r: 'receptor CD4', rec: 'CD4' }, { n: 'célula com ECA2', r: 'como as do pulmão', rec: 'ECA2' }, { n: 'célula com ácido siálico', r: 'como as da traqueia', rec: 'sial' }, { n: 'hemácia', r: 'sem núcleo e sem ribossomos', rec: null }];
  function layK(A) {
    if (!NAR) {
      const vr = Math.min(34, A.h * .08), ry = Math.min(A.h * .12, 52), rx = Math.min(A.w / 8 - 18, 120);
      return { vr, vs: VK.map((v, i) => [A.x0 + A.w * (.25 + i * .25), A.y0 + A.h * .17]), rx, ry, cs: CK.map((c, k) => [A.x0 + A.w * (k + .5) / 4, A.y0 + A.h * .7]) };
    }
    const vr = 20, ry = Math.min(36, A.h * .075), rx = A.w * .2;
    return { vr, vs: VK.map((v, i) => [A.x0 + A.w * (1 + 2 * i) / 6, A.y0 + 30]), rx, ry, cs: CK.map((c, k) => [A.x0 + A.w * (k % 2 ? .75 : .25), A.y0 + A.h * (k < 2 ? .44 : .78)]) };
  }
  function soltaK(S, v, k, from) { S.sel = null; if (S.an) return; S.an = { v, k, t: 0, ok: VK[v].c === k, gruda: v === 2 && k === 3, from }; S.msg = null; }
  function drawChave(t, S, A) {
    const L = layK(A), vr = L.vr;
    S.inf = S.inf || {};
    // células
    const alvo = [];
    CK.forEach((c, k) => {
      const [x, y] = L.cs[k], inf = S.inf[k] != null;
      if (c.rec) { const o = celula(x, y, L.rx, L.ry, { nuc: { x: .3, y: .15, r: .42 }, ribo: 8, seed: k + 2, rec: { n: 5, tipo: c.rec, de: -PI * .85, ate: -PI * .15, s: NAR ? 11 : 13 } }); const m = o.rec[2]; alvo.push([m.tx, m.ty]); }
      else { ell(x, y, L.rx * .62, L.ry * .9, 0, rgba(C.hemacia, .85), '#8E1F27', 1.4); ell(x, y, L.rx * .3, L.ry * .38, 0, 'rgba(240,120,128,.4)'); [-1, 0, 1].forEach(j => receptor(x + j * L.rx * .3, y - L.ry * .9 * Math.sqrt(1 - (j * .3 / .62) ** 2), -PI / 2 + j * .5, 'sial', { s: NAR ? 9 : 11 })); alvo.push([x, y - L.ry * .9]); }
      if (inf) fita([[x - L.rx * .55, y + L.ry * .3], [x - L.rx * .05, y + L.ry * .3]], { amp: 3, ond: 12, ph: t * 2 });
      hitR(x - L.rx, y - L.ry - 18, L.rx * 2, L.ry * 2 + 18, 'kc' + k);
      tx(c.n, x, y + L.ry + (NAR ? 13 : 16), { s: NAR ? 12 : 13, w: 600, c: C.txt });
      tx(inf ? 'o RNA do vírus entrou' : c.r, x, y + L.ry + (NAR ? 28 : 33), { s: 12, c: inf ? C.ok : C.dim });
    });
    // vírus em casa (ou fantasma enquanto viaja)
    const an = S.an, T1 = .9, T2 = an && an.ok ? .9 : .7;
    if (an) { an.t += passo(S); if (an.t > T1 + T2) { if (an.ok) S.inf[an.k] = an.v; S.an = null; if (Object.keys(S.inf).length === 3) S.msg = 'Cada vírus só infecta as células que têm o receptor certo: é a especificidade. A hemácia madura, sem núcleo nem ribossomos, não é infectada por nenhum dos três.'; } }
    VK.forEach((v, i) => {
      const [x, y] = L.vs[i], viaja = an && an.v === i, arr = S.drag && S.drag.v === i;
      if (S.sel === i) circ(x, y, vr * 1.55, null, C.amber, 2);
      virion(x, y, vr, { tipo: v.tipo, rot: t * .15, a: viaja || arr ? .25 : 1 }); hitC(x, y, vr * 1.6, 'kv' + i);
      tx(v.n, x, y + vr * 1.45 + 10, { s: NAR ? 12 : 13, w: 600, c: S.sel === i ? C.amber : C.txt });
      if (!NAR) tx('espícula: ' + v.e, x, y + vr * 1.45 + 28, { s: 12, c: C.espicula });
    });
    if (S.drag) virion(S.drag.x, S.drag.y, vr, { tipo: VK[S.drag.v].tipo, rot: t * .15 });
    if (an) {
      const [hx, hy] = an.from || L.vs[an.v], [ax, ay] = alvo[an.k], [cx0, cy0] = L.cs[an.k], dx = ax, dy = ay - vr * 1.3;
      let x, y, a = 1, s = 1;
      if (an.t < T1) { const f = ss(an.t / T1); x = lerp(hx, dx, f); y = lerp(hy, dy, f) - Math.sin(f * PI) * 30; }
      else { const f = ss((an.t - T1) / T2); if (an.ok) { x = lerp(dx, cx0, f); y = lerp(dy, cy0, f); s = 1 - .6 * f; a = 1 - f; } else if (an.gruda) { x = dx; y = dy + f * vr * .3; a = 1 - f * f; } else { x = dx + f * vr * 2.2; y = dy + f * vr * .4; a = 1 - f; } }
      virion(x, y, vr * s, { tipo: VK[an.v].tipo, rot: t * .15, a });
      if (an.t > T1 * .8 && S.an) S.msg = an.ok ? VK[an.v].ok : an.gruda ? 'A hemaglutinina até gruda no ácido siálico da hemácia (daí o nome: ela aglutina hemácias), mas a hemácia madura não tem núcleo nem ribossomos: o vírus não se multiplica nela.' : an.k === 3 ? `A hemácia madura não tem núcleo nem ribossomos: não fabrica vírus, e o ${VK[an.v].n} não a infecta.` : `As espículas do ${VK[an.v].n} não encaixam no receptor desta célula: sem o receptor certo, sem infecção.`;
    }
    cap(S.msg || 'Toque num vírus e depois numa célula (no computador, também dá para arrastar o vírus).');
  }

  def('estrutura', 'particula', {
    t: 'A partícula viral', s: 'ácido nucleico, capsídeo e, às vezes, um envelope', c: C.virus,
    loc: S => S.modo === 'chave' ? 'Três vírus e quatro células' : 'Vírus envelopado (modelo da gripe)', locNota: 'Desenho esquemático, fora de escala',
    ctlVis: S => S.modo !== 'chave',
    alt: 'uma partícula de vírus envelopado se monta: o RNA em oito pedaços, os capsômeros em volta, as espículas na membrana da célula e o brotamento, em que o vírus sai embrulhado nesse pedaço de membrana, já com as espículas; botões abrem a partícula em corte, mostram o sabão desmanchando o envelope e testam o encaixe de três vírus em quatro células, como chave e fechadura',
    still: 14,
    extra: [
      { t: 'Corte', on: S => { if (S.modo !== 'mont') { S.modo = 'mont'; S.corte = true; } else S.corte = !S.corte; }, pressed: S => S.modo === 'mont' && !!S.corte },
      { t: 'Sabão', on: S => { S.modo = 'mont'; if (S.sabOn) { S.sabOn = false; S.sab = 0; } else { S.sabOn = true; S.sab = 0; } }, pressed: S => S.modo === 'mont' && !!S.sabOn },
      { t: 'Chave e fechadura', on: S => { S.modo = S.modo === 'chave' ? 'mont' : 'chave'; S.msg = null; S.sel = null; }, pressed: S => S.modo === 'chave' }
    ],
    init(S) { S.modo = 'mont'; S.corte = false; S.cv = 0; S.sabOn = false; S.sab = 0; S.sel = null; S.an = null; S.inf = {}; S.msg = null; S.drag = null; },
    d: `<p>Todo vírus tem duas partes. No centro, o <b>ácido nucleico</b>, que guarda os genes do vírus: <b>DNA ou RNA, nunca os dois</b> como material genético. Ele pode ser de fita <b>simples</b> ou <b>dupla</b>, inteiro ou dividido em pedaços (o vírus da gripe tem o RNA em <b>8 segmentos</b>). Em volta, uma capa de proteína, o <b>capsídeo</b>, formada por muitas unidades iguais, os <b>capsômeros</b>, que se encaixam sozinhas, como peças de um brinquedo de montar. O capsídeo protege o ácido nucleico e, nos vírus sem envelope, é ele que se prende à célula. Ácido nucleico mais capsídeo formam o <b>nucleocapsídeo</b>. Alguns vírus carregam também <b>enzimas</b> dentro do capsídeo, como a transcriptase reversa do HIV (veja <a href="#replicacao/retrovirus">Retrovírus e transcriptase reversa</a>).</p>
<p>Muitos vírus que infectam animais têm, por fora do capsídeo, um <b>envelope</b>: uma bicamada de <b>lipídios</b> que o vírus leva da <b>membrana da célula</b> onde foi montado, quando sai dela. Nesse envelope ficam espetadas <b>glicoproteínas virais</b>, as <b>espículas</b>, que funcionam como "chaves": elas se encaixam em <b>receptores</b> da membrana de certas células, como chave e fechadura. É por isso que cada vírus infecta só alguns tipos de célula (<b>especificidade</b>): o HIV usa a proteína <b>CD4</b> dos linfócitos T auxiliares; o SARS-CoV-2 usa a sua <b>proteína S</b> (<i>spike</i>) para se ligar à <b>ECA2</b>, presente em células do nariz, do pulmão e de outros órgãos; o vírus da gripe usa a <b>hemaglutinina (H)</b> para entrar e a <b>neuraminidase (N)</b> para sair, e as letras H e N dão nome aos subtipos, como <b>H1N1</b> e <b>H3N2</b>. Como o envelope é feito de lipídios, <b>sabão</b> e <b>álcool 70%</b> o destroem e inativam o vírus. Vírus <b>sem envelope</b> (HPV, hepatite A, rotavírus, norovírus, poliovírus) são mais resistentes ao ambiente e ao álcool.</p>
<p>Toque em "Corte" para abrir a partícula ao meio e em "Sabão" para ver o que acontece com o envelope. Em "Chave e fechadura", leve cada vírus até uma célula.</p>`,
    enem: 'Saiba as partes: <b>ácido nucleico</b> (DNA <b>ou</b> RNA), <b>capsídeo</b> (proteína, feito de capsômeros) e <b>envelope</b> (lipídios da célula hospedeira, com glicoproteínas virais). A ideia de <b>especificidade</b> (espícula e receptor) explica por que o HIV ataca linfócitos T CD4 e por que muitas vacinas miram a proteína da superfície do vírus. Pegadinha do dia a dia: lavar as mãos com <b>sabão</b> funciona contra vírus envelopados porque <b>dissolve o envelope</b> de lipídios, não porque "mata" o vírus como se mata uma bactéria.',
    links: [['Formas e tipos de vírus', '#estrutura/tipos'], ['Vírus em células animais', '#replicacao/animal'], LK.celula],
    tap(x, y, S) {
      if (S.modo !== 'chave' || !toque(S)) return; const h = hitAt(x, y);
      if (typeof h !== 'string') { S.sel = null; return; }
      if (h.startsWith('kv')) { const v = +h[2]; S.sel = S.sel === v ? null : v; if (S.sel != null) S.msg = `${VK[v].n} escolhido: agora toque numa célula.`; return; }
      if (h.startsWith('kc')) { if (S.sel != null) soltaK(S, S.sel, +h[2]); else S.msg = 'Primeiro toque num vírus; depois, numa célula.'; }
    },
    grab(x, y, S) { if (S.modo !== 'chave' || S.an) return false; const h = hitAt(x, y); if (typeof h === 'string' && h.startsWith('kv')) { const v = +h[2]; S.drag = { v, x, y }; S.sel = v; S.msg = `${VK[v].n} escolhido: agora toque numa célula.`; return true; } return false; },
    grabMove(x, y, S) { if (S.drag) { S.drag.x = x; S.drag.y = y; } },
    grabEnd(x, y, S) { const d = S.drag; S.drag = null; if (!d) return; const h = hitAt(x, y); if (typeof h === 'string' && h.startsWith('kc')) soltaK(S, d.v, +h[2], [x, y]); },
    draw(t, S) { const A = area(); if (S.modo === 'chave') drawChave(t, S, A); else drawMont(t, S, A); }
  });

  // =====================================================================================
  // E2 FORMAS E TIPOS: helicoidal, icosaédrico, complexo; DNA ou RNA; viroide e príon
  // =====================================================================================
  const FORMAS = [
    { n: 'Helicoidal', e: 'bastonete: vírus do mosaico do tabaco', x: 'capsômeros em espiral em volta do RNA', ac: 'RNA' },
    { n: 'Icosaédrico', e: 'adenovírus (também HPV e poliovírus)', x: '20 faces triangulares', ac: 'DNA (adenovírus)' },
    { n: 'Complexo', e: 'bacteriófago T4', x: 'cabeça icosaédrica, cauda e fibras', ac: 'DNA' }
  ];
  function modelo(i, x, y, s, t, S) {
    if (i === 0) { const L = s * 1.05, g = -.35, r = Math.max(9, s * .055); helice(x - Math.cos(g) * L / 2, y - Math.sin(g) * L / 2, x + Math.cos(g) * L / 2, y + Math.sin(g) * L / 2, r, { ph: t * 1.2, corte: .22 }); }
    else if (i === 1) {
      const R = s * .3, hl = Math.min(20, Math.floor((t % 16) / .6)), ev = S.ev || 0;
      icosa(x, y, R, { ry: t * .45, rx: .35, hl });
      if (ev > .02) { circ(x, y, R * 1.3, rgba('#1E1830', .95 * ev)); envelope(x, y, R * 1.3, { a: ev, esp: 18, espTipo: 'bola', espLen: R * .3, rot: t * .1 }); }
      return hl;
    } else fago(x, y + s * .5, s, { ang: -PI / 2 + Math.sin(t * .8) * .05, pernas: .85 });
    return null;
  }
  function drawFormas(t, S, A) {
    S.ev = lerp(S.ev || 0, S.envOn ? 1 : 0, 1 - Math.exp(-4 * passo(S)));
    for (let i = 0; i < 3; i++) {
      const f = FORMAS[i]; let mx, my, s, bx, by, al, mw;
      if (!NAR) { const cw = A.w / 3; mx = A.x0 + cw * (i + .5); my = A.y0 + A.h * .4; s = Math.min(cw * .7, A.h * .56); bx = mx; by = A.y0 + A.h * .76; al = 'center'; mw = cw - 24; }
      else { const rh = A.h / 3; mx = A.x0 + A.w * .26; my = A.y0 + rh * (i + .5); s = Math.min(rh * .86, A.w * .4); bx = A.x0 + A.w * .53; by = A.y0 + rh * i + rh * .2; al = 'left'; mw = A.x1 - bx; }
      const hl = modelo(i, mx, my, s, t, S);
      const env = i === 1 && S.ev > .5;
      head(env ? (NAR ? 'Com envelope' : 'Icosaédrico, com envelope') : f.n, bx, by, C.txt, al);
      let yy = by + (NAR ? 20 : 24);
      yy += wrapTx(env ? 'como no vírus do herpes: por fora, parece uma esfera com espinhos' : f.e, bx, yy, mw, { s: NAR ? 12 : 13, c: C.txt, a: al, lh: NAR ? 15 : 17 });
      yy += wrapTx(env ? 'adenovírus, HPV e poliovírus não têm envelope' : i === 1 ? `${f.x}; destacadas: ${hl} de 20` : f.x, bx, yy, mw, { s: 12, c: C.dim, a: al, lh: 15 });
      const ac = env ? 'DNA (herpes)' : f.ac, tw0 = mtw(ac, 12, 700) + 12; tok(al === 'left' ? bx + tw0 / 2 : bx, yy + 8, ac, ac[0] === 'R' ? C.rna : C.dna, { s: 12 });
    }
    cap(S.ev > .5 ? 'Com envelope (como no herpes), por fora o vírus parece uma esfera com espinhos: a forma do capsídeo fica escondida.' : 'Três formas de capsídeo: helicoidal (bastonete), icosaédrica (20 faces) e complexa (cabeça e cauda).');
  }
  const ACN = baralho({
    nome: 'acn',
    alvos: [{ t: 'vírus de DNA', c: C.dna }, { t: 'vírus de RNA', c: C.rna }],
    cartas: [
      ['gripe', 1, 1, 'O vírus da gripe', ' Muda muito: a vacina é atualizada todo ano.'], ['herpes', 0, 1, 'O vírus do herpes', ''], ['HIV', 1, 1, 'O HIV', ' É um retrovírus: dentro da célula, o RNA dele é copiado em DNA.'],
      ['HPV', 0, 0, 'O HPV', ''], ['dengue', 1, 1, 'O vírus da dengue', ''], ['hepatite B', 0, 1, 'O vírus da hepatite B', ''], ['sarampo', 1, 1, 'O vírus do sarampo', ''],
      ['covid-19', 1, 1, 'O SARS-CoV-2, vírus da covid-19,', ' Ganhou muitas variantes.'], ['febre amarela', 1, 1, 'O vírus da febre amarela', ''], ['hepatite A', 1, 0, 'O vírus da hepatite A', '']
    ].map(([t, k, e, v, x]) => ({ t, k, e, v, x, t2: `${t}: ${e ? 'com' : 'sem'} envelope` })),
    certo: c => `${c.v} é de ${c.k ? 'RNA' : 'DNA'}, ${c.e ? 'com' : 'sem'} envelope.${c.x}`,
    errado: (c, a) => `Ainda não: ${minusc(c.v)} não é ${a.t}.`,
    fim: () => 'Resumo: vírus de RNA mudam mais rápido, porque a enzima que copia o RNA quase não corrige erros. Por isso a vacina da gripe é anual.',
    dica: 'Primeiro toque num cartão; depois, na coluna do DNA ou na do RNA.'
  });
  // príon: proteína normal (hélices) e com a forma errada (folha em zigue-zague)
  function proteina(x, y, s, k) {
    if (k < 1) { X.save(); X.globalAlpha *= 1 - k; X.beginPath(); for (let i = 0; i <= 40; i++) { const u = i / 40, px = x - s * .45 + u * s * .9, py = y + Math.sin(u * TAU * 3) * s * .22; i ? X.lineTo(px, py) : X.moveTo(px, py); } X.strokeStyle = C.receptor; X.lineWidth = 2.4; X.lineCap = 'round'; X.stroke(); X.restore(); }
    if (k > 0) { X.save(); X.globalAlpha *= k; const p = []; for (let i = 0; i <= 6; i++) p.push([x - s * .42 + i * s * .14, y + (i % 2 ? -1 : 1) * s * .24]); poly(p, '#F0605D', 2.6); arrowHead(p[6][0], p[6][1], Math.atan2(p[6][1] - p[5][1], p[6][0] - p[5][0]), '#F0605D', 7); X.restore(); }
  }
  const VP = [
    { n: 'Vírus', c: C.virus, a: 'ácido nucleico e capsídeo', b: 'há vírus de bactérias, arqueas, protistas, fungos, plantas e animais' },
    { n: 'Viroide', c: C.rna, a: 'só RNA circular, sem capsídeo', b: 'causa doenças em plantas, como a do tubérculo afilado da batata' },
    { n: 'Príon', c: '#F0605D', a: 'só proteína, sem nenhum ácido nucleico', b: 'proteína com a forma errada que muda a forma das outras: vaca louca e Creutzfeldt-Jakob' }
  ];
  function iconeVP(i, x, y, s, t) {
    if (i === 0) virion(x, y, s * .32, { tipo: 'nu', ac: 'rna', rot: t * .3 });
    else if (i === 1) {
      X.save(); X.translate(x, y); X.rotate(Math.sin(t * .4) * .25);
      const rx = s * .44, ry = s * .11; X.beginPath(); for (let k = 0; k <= 80; k++) { const g = k / 80 * TAU, w = 1 + Math.sin(g * 9 + t) * .06; const px = Math.cos(g) * rx, py = Math.sin(g) * ry * w; k ? X.lineTo(px, py) : X.moveTo(px, py); } X.closePath(); X.strokeStyle = C.rna; X.lineWidth = 2.4; X.stroke();
      for (let k = 1; k < 12; k++) { const px = -rx * .88 + k * rx * 1.76 / 12; line(px, -ry * .55, px, ry * .55, rgba(C.rna, .5), 1); }
      X.restore();
    } else {
      const n = 4, ph = (t % 10) / 2.2, sp = s * .27;
      for (let k = 0; k < n; k++) { const px = x + (k - 1.5) * sp, py = y + (k % 2 ? 8 : -8), kk = cl(ph - k + 1, 0, 1); proteina(px, py, sp * .9, k === 0 ? 1 : kk); if (k > 0 && kk > 0 && kk < 1) circ(px - sp * .5, py, 4, null, rgba('#F0605D', .7), 1.4); }
      if (LB) { const ly = y + s * .3, lx = x - sp * 1.6, x2 = NAR ? lx : lx + sp * 1.7, y2 = NAR ? ly + 17 : ly; line(lx, ly, lx + 16, ly, C.receptor, 2.4); tx('normal', lx + 22, ly, { s: 12, a: 'left', c: C.receptor }); line(x2, y2, x2 + 16, y2, '#F0605D', 2.6); tx('forma errada', x2 + 22, y2, { s: 12, a: 'left', c: '#F0605D' }); }
    }
  }
  function drawVP(t, S, A) {
    for (let i = 0; i < 3; i++) {
      const v = VP[i];
      if (!NAR) {
        const g = 16, pw = (A.w - 2 * g) / 3, x = A.x0 + i * (pw + g), y = A.y0, ph = A.h;
        panel(x, y, pw, ph, { s: rgba(v.c, .55) });
        head(v.n, x + pw / 2, y + 22, v.c);
        iconeVP(i, x + pw / 2, y + ph * .4, Math.min(pw * .62, ph * .5), t);
        let yy = y + ph * .68; yy += wrapTx(`<b>${v.a}</b>`, x + pw / 2, yy, pw - 32, { s: 14, c: C.txt, lh: 19 }) + 6;
        wrapTx(v.b, x + pw / 2, yy, pw - 32, { s: 13, c: C.dim, lh: 18 });
      } else {
        const g = 8, ph = (A.h - 2 * g) / 3, x = A.x0, y = A.y0 + i * (ph + g), pw = A.w, iw = pw * .38;
        panel(x, y, pw, ph, { s: rgba(v.c, .55) });
        iconeVP(i, x + iw / 2 + 4, y + ph / 2, Math.min(iw * .95, ph * .8), t);
        const tx0 = x + iw + 8, mw = pw - iw - 16;
        head(v.n, tx0, y + 18, v.c, 'left');
        let yy = y + 40; yy += wrapTx(`<b>${v.a}</b>`, tx0, yy, mw, { s: 12, c: C.txt, a: 'left', lh: 15 }) + 3;
        wrapTx(v.b, tx0, yy, mw, { s: 12, c: C.dim, a: 'left', lh: 15 });
      }
    }
    cap('Na fronteira dos vírus: o viroide (só RNA, sem capsídeo) e o príon (só proteína, sem ácido nucleico).');
  }

  def('estrutura', 'tipos', {
    t: 'Formas e tipos de vírus', s: 'hélice, icosaedro, cabeça e cauda; DNA ou RNA', c: C.virus,
    loc: S => S.modo === 'acn' ? 'Vírus de DNA e de RNA' : S.modo === 'vp' ? 'Vírus, viroide e príon' : 'Helicoidal, icosaédrico e complexo', locNota: 'Desenho esquemático, fora de escala',
    ctlVis: S => S.modo !== 'acn',
    alt: 'três modelos girando devagar: o bastonete helicoidal do vírus do mosaico do tabaco, o icosaedro do adenovírus com as 20 faces destacadas uma a uma e o bacteriófago T4 com cabeça, cauda e fibras; um botão veste o icosaedro com envelope, como no vírus do herpes; cartões para separar vírus de DNA e de RNA; e três cartões que comparam vírus, viroide e príon',
    still: 4,
    extra: [
      modo('formas', 'Formas'),
      { t: 'Colocar envelope', on: S => { S.modo = 'formas'; S.envOn = !S.envOn; }, pressed: S => S.modo === 'formas' && !!S.envOn },
      modo('acn', 'DNA ou RNA?'),
      modo('vp', 'Viroide e príon')
    ],
    init(S) { S.modo = 'formas'; S.envOn = false; S.ev = 0; ACN.zera(S); },
    d: `<p>Os capsômeros se organizam em poucas formas. Na simetria <b>helicoidal</b>, eles giram em espiral em volta do ácido nucleico e formam um bastonete, como no <b>vírus do mosaico do tabaco</b>; o vírus da gripe e o do sarampo têm nucleocapsídeos helicoidais dentro do envelope. Na simetria <b>icosaédrica</b>, o capsídeo é um poliedro de <b>20 faces triangulares</b>, quase uma esfera, como no <b>HPV</b>, no <b>adenovírus</b> e no <b>poliovírus</b>. Os <b>bacteriófagos</b> como o <b>T4</b> têm forma <b>complexa</b>: uma "cabeça" icosaédrica com o DNA, uma <b>cauda</b> que funciona como seringa e <b>fibras</b> que prendem o fago na bactéria. Por fora, com o envelope, muitos vírus parecem esferas com espinhos, e a forma do capsídeo fica escondida.</p>
<p>Os vírus também são separados pelo material genético. <b>Vírus de DNA:</b> herpes (herpes labial e genital, catapora), HPV, hepatite B, varíola, adenovírus e o fago T4. <b>Vírus de RNA:</b> gripe, SARS-CoV-2, HIV, dengue, zika, chikungunya, febre amarela, sarampo, raiva, poliomielite e hepatites A e C. Os vírus de RNA, em geral, <b>mutam mais</b>, porque as enzimas que copiam RNA quase não corrigem os próprios erros. É por isso que a vacina da gripe muda todo ano. O SARS-CoV-2 corrige parte dos erros ao copiar o RNA, mas, com milhões de pessoas infectadas, muitas variantes surgiram e foram selecionadas. Existem vírus para <b>todos os grupos de seres vivos</b>: bactérias (bacteriófagos), arqueas, protistas (o mimivírus infecta amebas), fungos, plantas e animais.</p>
<p>Na fronteira dos vírus há agentes ainda mais simples. Os <b>viroides</b> são só uma pequena molécula de <b>RNA circular, sem capsídeo</b>, e causam doenças em plantas (como a do tubérculo afilado da batata). Os <b>príons</b> não têm <b>nenhum ácido nucleico</b>: são <b>proteínas</b> com a forma errada que fazem outras proteínas iguais mudarem de forma. Eles causam doenças que destroem o cérebro, como a <b>encefalopatia espongiforme bovina</b> ("doença da vaca louca") e, em humanos, a doença de Creutzfeldt-Jakob.</p>
<p>Em "DNA ou RNA?", leve cada vírus ou doença para a coluna certa; ao acertar, o cartão mostra se o vírus tem envelope.</p>`,
    enem: 'A prova não pede nome de família de vírus, mas cobra a relação entre <b>RNA</b>, <b>alta taxa de mutação</b> e <b>vacina que precisa ser atualizada</b> (gripe, covid-19). Formas que valem a pena reconhecer no desenho: o bastonete <b>helicoidal</b>, o <b>icosaedro</b> e o fago "cabeça e cauda". Se aparecer um agente infeccioso <b>sem ácido nucleico</b>, é um <b>príon</b>; só <b>RNA, sem capsídeo</b>, é um <b>viroide</b>.',
    links: [LK.fago3d, ['O ciclo lítico', '#fagos/litico'], ['Gripe, covid-19 e sarampo', '#doencas/respiratorias']],
    tap(x, y, S) { if (S.modo === 'acn') ACN.tap(x, y, S); },
    grab(x, y, S) { return S.modo === 'acn' && ACN.grab(x, y, S); },
    grabMove(x, y, S) { ACN.grabMove(x, y, S); },
    grabEnd(x, y, S) { ACN.grabEnd(x, y, S); },
    draw(t, S) {
      const A = area();
      if (S.modo === 'acn') { ACN.draw(S, A, { cols: NAR ? 2 : 5, cartaH: NAR ? 34 : 40, slotH: NAR ? 32 : 30 }); cap(ACN.msg(S) || 'Leve cada vírus ou doença para a coluna do seu material genético: DNA ou RNA.'); }
      else if (S.modo === 'vp') drawVP(t, S, A);
      else drawFormas(t, S, A);
    }
  });
}
