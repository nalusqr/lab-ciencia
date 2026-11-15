/* LAB, módulo Vírus. Cenas C (Prometeu): Replicação (retrovírus e transcriptase reversa) e Doenças (arboviroses).
   Fonte científica: docs/revisao-biologia/virus-roteiro.md (Taxon, R2 e D1, com a revisão do Sapien).
   Usa a API do motor.js (def, area, tx, mtx, wrapTx, tok, title, panel, cap, hitR, hitC, hitAt; virion, fita, membrana,
   receptor, bicho...). Código, desenhos e textos da equipe; sem assets nem código de terceiros. */
'use strict';
{
  // cores por significado (paleta C do motor; a reserva só vale se faltar alguma)
  const RES = {
    virus: '#B9C2D3', dna: '#9A6BFF', dnaClaro: '#C9B2FF', dnaEscuro: '#6A45D8', rna: '#FF8A6B', envelope: '#F06AAE', espicula: '#F7C13B',
    receptor: '#7CC4FF', ribo: '#FFE1A6', citoplasma: '#2A1E3D', nucleo: '#9A6BFF', vetor: '#9FD84A', amber: '#FFB347',
    ok: '#6BCB77', erro: '#F0605D', txt: '#E8EDF7', dim: '#9DA9C4', line: '#5B6C99'
  };
  const K = n => (typeof C !== 'undefined' && C && C[n]) || RES[n];
  const COR = {
    virus: K('virus'), dna: K('dna'), dnaC: K('dnaClaro'), dnaE: K('dnaEscuro'), rna: K('rna'), env: K('envelope'), esp: K('espicula'),
    ribo: K('ribo'), cito: K('citoplasma'), nuc: K('nucleo'), cd4: K('receptor'), vetor: K('vetor'), amber: K('amber'),
    ok: K('ok'), erro: K('erro'), txt: K('txt'), dim: K('dim'), line: K('line'),
    // enzimas do HIV (R2): transcriptase reversa em âmbar (roteiro), integrase em turquesa, protease em verde
    tr: K('amber'), int: '#45C9BE', pro: '#8FD45E',
    // cenário de D1
    mata: '#4E9A62', tronco: '#6B5236', macaco: '#C89B6D', agua: '#5FA8E8', areia: '#D9BE86', doente: '#FF9A7A'
  };
  const PAINEL = 'rgba(19,26,43,.78)', BORDA = 'rgba(255,255,255,.14)';
  const tam = (a, b) => NAR ? a : b;
  // ícones do motor (bicho); se faltar algum, um círculo simples no lugar (a página não quebra)
  const icone = (id, x, y, s, o = {}) => { if (typeof bicho === 'function' && typeof BICHOS !== 'undefined' && BICHOS[id]) bicho(id, x, y, s, o); else circ(x, y, s * .3, null, o.c || COR.txt, 1.5); };
  // cartão com texto que quebra linhas (aceita <i> e <b>); o.dry só mede; devolve a altura
  function cartao(x, y, w, s, o = {}) {
    const sz = o.s || tam(12, 13), lh = sz + 5, pad = 10;
    const h = wrapTx(s, 0, 0, w - pad * 2, { s: sz, lh, dry: true }) + pad * 2 - 5 + (o.tit ? lh + 2 : 0);
    if (o.dry) return h;
    panel(x, y, w, h, { f: o.f || PAINEL, s: o.borda || BORDA, r: 10 });
    let yy = y + pad + sz / 2;
    if (o.tit) { mtx(o.tit, x + pad, yy, { s: sz, w: 700, a: 'left', c: o.tc || COR.esp, bg: false }); yy += lh + 2; }
    wrapTx(s, x + pad, yy, w - pad * 2, { s: sz, lh, a: 'left', c: o.c || '#D3DAEA' });
    return h;
  }

  // =====================================================================================
  // R2 RETROVÍRUS E TRANSCRIPTASE REVERSA
  // =====================================================================================
  const T2 = 24;   // duração do ciclo (s, ritmo 1)
  // etapas do ciclo: início (s) e legenda
  const ET2 = [
    [0, '<b>Ligação.</b> As espículas do HIV se encaixam no receptor <b>CD4</b> do linfócito T.'],
    [2.5, '<b>Fusão.</b> O envelope se funde com a membrana e o capsídeo entra no citoplasma.'],
    [4.5, '<b>Transcriptase reversa.</b> A enzima lê o RNA do vírus e monta um <b>DNA</b> de fita dupla: de RNA para DNA, o caminho ao contrário.'],
    [8.5, '<b>Integrase.</b> O DNA do vírus entra no núcleo e é costurado no cromossomo da célula: agora é um <b>provírus</b>.'],
    [11.5, '<b>Transcrição.</b> A célula lê o provírus como se fosse um gene seu e faz RNA do vírus.'],
    [13.5, '<b>Tradução.</b> Os ribossomos da célula fabricam as proteínas do vírus numa cadeia longa.'],
    [15.5, '<b>Protease.</b> A enzima corta a cadeia de proteínas no tamanho certo: é esse corte que deixa o vírus novo <b>maduro</b>, capaz de infectar.'],
    [17.5, '<b>Montagem e brotamento.</b> Vírus novos saem levando um pedaço da membrana da célula como envelope.'],
    [21.5, 'Os vírus novos vão infectar outros linfócitos. O provírus fica no cromossomo: por isso, até hoje, a infecção é <b>para a vida toda</b>.']
  ];
  // remédios: alvo (etapa 0, 1 ou 2), ponto do ciclo em que a animação trava, cor da enzima que ele bloqueia
  const REM = [
    { k: 'tr', n: 'Inibidor da transcriptase reversa', e: 'transcriptase reversa', l: ['Inibidor da', 'transcriptase', 'reversa'], alvo: 0, trava: 5.6, c: COR.tr,
      ok: 'Certo. Sem a <b>transcriptase reversa</b>, o RNA do vírus não vira DNA. Exemplos: tenofovir e AZT (o primeiro antirretroviral).',
      preso: 'o RNA não vira DNA; sem DNA do vírus não há provírus, e <b>nenhum vírus novo</b> é produzido.' },
    { k: 'int', n: 'Inibidor da integrase', e: 'integrase', l: ['Inibidor da', 'integrase'], alvo: 1, trava: 10.4, c: COR.int,
      ok: 'Certo. Sem a <b>integrase</b>, o DNA do vírus não é costurado no cromossomo e não vira provírus.',
      preso: 'o DNA do vírus não entra no cromossomo; sem provírus, <b>nenhum vírus novo</b> é produzido.' },
    { k: 'pro', n: 'Inibidor da protease', e: 'protease', l: ['Inibidor da', 'protease'], alvo: 2, trava: 21.45, c: COR.pro,
      ok: 'Certo. Sem a <b>protease</b>, a cadeia de proteínas do vírus não é cortada no tamanho certo.',
      preso: 'a cadeia de proteínas não é cortada; os vírus até brotam, mas saem <b>imaturos</b> e <b>nenhum vírus novo</b> consegue infectar.' }
  ];
  const ALVO = ['RNA vira DNA', 'DNA entra no cromossomo', 'proteínas são cortadas'];
  const ALVO_C = ['RNA vira DNA', 'DNA no cromossomo', 'proteínas cortadas'];   // no celular

  function geoR2() {
    const A = area(), band = tam(54, 58);
    let tray, R;
    if (NAR) {
      const th = 54; tray = { x0: A.x0, x1: A.x1, y0: A.y1 - th, y1: A.y1, col: false };
      R = { x0: A.x0, x1: A.x1, y0: A.y0 + band, y1: A.y1 - th - 12 };
    } else {
      const tw0 = Math.min(210, A.w * .26); tray = { x0: A.x1 - tw0, x1: A.x1, y0: A.y0 + band, y1: A.y1, col: true };
      R = { x0: A.x0, x1: A.x1 - tw0 - 16, y0: A.y0 + band, y1: A.y1 };
    }
    const w = R.x1 - R.x0, h = R.y1 - R.y0;
    const rx = NAR ? Math.min(w / 2 - 22, h * .5) : Math.min(w / 2 - 70, h * 1.15);
    const ry = NAR ? Math.min(h / 2 - 8, rx * 1.2) : Math.min(h / 2 - 10, rx * .6);
    const cx = R.x0 + w / 2 + tam(10, 40), cy = R.y0 + h / 2;
    const nuc = NAR ? { x: cx + rx * .32, y: cy + ry * .1, rx: rx * .46, ry: ry * .3 } : { x: cx + rx * .42, y: cy + ry * .05, rx: rx * .3, ry: ry * .58 };
    const P = NAR
      ? [{ x: cx - rx * .38, y: cy - ry * .55 }, { x: nuc.x - 6, y: nuc.y - nuc.ry * .45 }, { x: cx - rx * .36, y: cy + ry * .52 }]
      : [{ x: cx - rx * .5, y: cy - ry * .28 }, { x: nuc.x - nuc.rx * .1, y: nuc.y - nuc.ry * .45 }, { x: cx - rx * .22, y: cy + ry * .45 }];
    const aIn = PI + .5, aOut = PI - .45;
    const pm = a => [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
    const alvR = tam(24, 30);
    const alvos = P.map(q => ({ x: q.x, y: q.y, r: alvR }));
    const pills = REM.map((m, i) => {
      if (tray.col) { const ph = 62, gp = 12, y0 = tray.y0 + 26 + i * (ph + gp); return { x: tray.x0, y: y0, w: tray.x1 - tray.x0, h: ph }; }
      const gp = 6, pw = (tray.x1 - tray.x0 - gp * 2) / 3; return { x: tray.x0 + i * (pw + gp), y: tray.y0, w: pw, h: tray.y1 - tray.y0 };
    });
    return { A, R, cx, cy, rx, ry, nuc, P, aIn, aOut, pm, tray, pills, alvos, band };
  }
  // altura do rótulo de cada etapa (e da ficha "bloqueada" que o substitui): em cima do alvo; no celular, a etapa 3 fica embaixo
  const slotY = (q, i) => NAR && i === 2 ? q.y + q.r + 13 : q.y - q.r - 12;
  // comprimido: cápsula com o nome em linhas
  function comprimido(x, y, w, h, m, o = {}) {
    const a = o.a == null ? 1 : o.a; if (a <= .02) return;
    X.save(); X.globalAlpha *= a;
    if (o.sel) rr(x - 3, y - 3, w + 6, h + 6, Math.min(h / 2 + 3, 21), null, rgba(COR.amber, .9), 2);
    rr(x, y, w, h, Math.min(h / 2, 18), o.f || rgba(m.c, .2), m.c, o.sel ? 2.5 : 1.6);
    const sz = tam(11.5, 12.5), lh = sz + 2, ls = NAR ? m.l : [m.l[0], m.l.slice(1).join(' ')];
    const yy = y + h / 2 - (ls.length - 1) * lh / 2;
    ls.forEach((s, i) => tx(s, x + w / 2, yy + i * lh, { s: sz, w: 700, c: '#fff', bg: false }));
    X.restore();
  }
  // faixa do dogma central, com a seta curva âmbar de RNA para DNA
  function dogma(g, p) {
    const A = g.A, y = A.y0 + tam(36, 38), sx = tam(Math.min(100, A.w * .3), 120), x0 = (g.R.x0 + g.R.x1) / 2 - sx;
    const xs = [x0, x0 + sx, x0 + 2 * sx], lb = ['DNA', 'RNA', 'proteína'], cs = [COR.dna, COR.rna, COR.virus], sz = tam(13, 14);
    const hl = p >= 4.5 && p < 8.5;
    lb.forEach((s, i) => tok(xs[i], y, s, cs[i], { s: sz }));
    const hw = i => mtw(lb[i], sz, 700) / 2 + 10;
    arrow(xs[0] + hw(0), y, xs[1] - hw(1) - 3, y, COR.dim, 1.6);
    arrow(xs[1] + hw(1), y, xs[2] - hw(2) - 3, y, COR.dim, 1.6);
    const ya = y - tam(12, 13);
    X.save(); X.globalAlpha *= hl ? 1 : .7;
    qarrow(xs[1] - 4, ya, (xs[0] + xs[1]) / 2, ya - tam(16, 20), xs[0] + 6, ya + 1, COR.tr, hl ? 3 : 2);
    tx('transcriptase reversa', (xs[0] + xs[1]) / 2, ya - tam(20, 25), { s: tam(12, 13), w: 700, c: COR.tr });
    X.restore();
  }
  // enzima: "boca" que lê ou corta (cor da enzima)
  function enzima(x, y, r, c, a = 1, ang = 0) {
    if (a <= .02) return; X.save(); X.globalAlpha *= a; X.beginPath(); X.arc(x, y, r, ang + .4, ang + TAU - .4); X.lineTo(x, y); X.closePath();
    X.fillStyle = c; X.fill(); X.strokeStyle = 'rgba(11,15,28,.7)'; X.lineWidth = 1; X.stroke(); X.restore();
  }
  // DNA do cromossomo da célula (violeta-escuro), com a fenda e o provírus (violeta-claro)
  function cromossomo(g, prov, fenda) {
    const n = g.nuc, x0 = n.x - n.rx * .8, x1 = n.x + n.rx * .8, gap = n.rx * .42 * fenda, amp = tam(3, 3.5), ond = tam(13, 15);
    fita([[x0, n.y], [n.x - gap / 2, n.y]], { tipo: 'dna', c: COR.dnaE, amp, ond, lw: 2 });
    fita([[n.x + gap / 2, n.y], [x1, n.y]], { tipo: 'dna', c: COR.dnaE, amp, ond, lw: 2, ph: (n.x + gap / 2 - x0) / ond * TAU });
    if (prov > .02 && gap > 2) fita([[n.x - gap / 2, n.y], [n.x + gap / 2, n.y]], { tipo: 'dna', c: COR.dnaC, amp, ond, lw: 2.4, a: prov });
  }

  function cicloR2(t, S, g) {
    // trava no primeiro remédio que está no lugar certo
    let trava = null; for (const m of REM) if (S.pos[m.k] === m.alvo && (!trava || m.trava < trava.trava)) trava = m;
    const p0 = fr(t / T2) * T2, p = trava ? Math.min(p0, trava.trava) : p0, preso = !!trava && p0 >= trava.trava;
    const { cx, cy, rx, ry, nuc, P, aIn, aOut, pm, alvos } = g, vr = tam(15, 22), L1 = LB && !NAR;
    const intB = S.pos.int === 1, proB = S.pos.pro === 2;   // inibidores da integrase e da protease no lugar
    dogma(g, p);
    // brotamento: cada vírus novo empurra a membrana e sai embrulhado nela (a membrana vira o envelope)
    const brotos = [0, 1].map(j => {
      const t0 = 17.5 + j * 1.5, aj = aOut + (j ? .17 : -.1), [mx, my] = pm(aj), d0 = Math.hypot(mx - cx, my - cy), ux = (mx - cx) / d0, uy = (my - cy) / d0;
      const mv = ss(seg(p, t0, t0 + 1.1)), sai = ss(seg(p, t0 + 1.1, t0 + 2.3)), vai = seg(p, t0 + 2.3, T2);
      const ix = lerp(P[2].x, mx - ux * vr * 1.25, mv), iy = lerp(P[2].y, my - uy * vr * 1.25, mv), dd = lerp(-1.25, 1, sai) * vr;
      const x = mx + ux * (dd + vai * tam(30, 76)) + (j ? 1 : -1) * vai * tam(6, 16) * uy, y = my + uy * (dd + vai * tam(30, 76)) - (j ? 1 : -1) * vai * tam(6, 16) * ux;
      return { j, t0, ux, uy, mv, sai, vai, x: mv < 1 ? ix : x, y: mv < 1 ? iy : y, preso: p >= t0 + 1.1 && sai < 1 };
    });
    // contorno da célula: elipse unida aos vírus que ainda estão brotando (raios a partir do centro)
    const pts = [];
    for (let i = 0; i < 360; i++) {
      const a = i / 360 * TAU, ex = Math.cos(a) * rx, ey = Math.sin(a) * ry, re = Math.hypot(ex, ey), ux = ex / re, uy = ey / re;
      let Rr = re;
      for (const b of brotos) {
        if (!b.preso || p < b.t0) continue;
        const vx = b.x - cx, vy = b.y - cy, pr = ux * vx + uy * vy, d2 = (vr * 1.04) ** 2 - (vx * vx + vy * vy - pr * pr);
        if (pr > 0 && d2 > 0) Rr = Math.max(Rr, pr + Math.sqrt(d2));
      }
      pts.push([cx + ux * Rr, cy + uy * Rr]);
    }
    membrana(pts, { fechada: true, f: rgba(COR.cito, .82), d: tam(3, 4) });
    // ribossomos espalhados e o grupo onde as proteínas do vírus são feitas
    const R0 = rng(5);
    for (let i = 0; i < 16; i++) {
      const a = R0() * TAU, k = .3 + R0() * .55, x = cx + Math.cos(a) * rx * k, y = cy + Math.sin(a) * ry * k;
      if (Math.hypot((x - nuc.x) / (nuc.rx + 8), (y - nuc.y) / (nuc.ry + 8)) < 1) continue;
      if (alvos.some(q => Math.hypot(x - q.x, y - q.y) < q.r + 6)) continue;
      circ(x, y, tam(2, 2.4), COR.ribo);
    }
    for (const [dx, dy] of [[-1.6, -.6], [-.6, .7], [.5, -.4], [1.5, .6], [-1.2, 1.4]]) circ(P[2].x - tam(14, 22) + dx * tam(5, 6), P[2].y + 14 + dy * tam(5, 6), tam(2.2, 2.6), COR.ribo);
    // núcleo e cromossomo
    ell(nuc.x, nuc.y, nuc.rx, nuc.ry, 0, rgba(COR.nuc, .16), COR.nuc, 1.8);
    ell(nuc.x, nuc.y, nuc.rx - 3, nuc.ry - 3, 0, null, rgba(COR.nuc, .45), 1);
    const fenda = intB ? 0 : seg(p, 10, 10.6), entra = seg(p, 10.6, 11.3);
    cromossomo(g, entra, p >= 10 ? fenda : 0);
    if (LB && p >= 11.3) tx('provírus', nuc.x, nuc.y + tam(16, 20), { s: 12, w: 700, c: COR.dnaC });
    // receptores CD4 perto da entrada
    const recs = [-.2, 0, .2].map(da => {
      const a = aIn + da, [mx, my] = pm(a), na = Math.atan2(Math.sin(a) / ry, Math.cos(a) / rx);
      return { a: na, tip: receptor(mx, my, na, 'CD4', { s: tam(12, 15) }) };
    });
    if (LB) { const [mx, my] = pm(aIn + tam(-.42, .36)); tx('CD4', cl(mx - tam(10, 26), 22, W - 22), my - tam(-4, 18), { s: 12, w: 700, c: COR.cd4 }); }   // no celular, abaixo dos receptores
    // alvos dos remédios: círculos numerados
    alvos.forEach((q, i) => {
      const m = REM.find(z => z.alvo === i), on = S.pos[m.k] === i, ativo = !on && (S.sel != null || !!S.arr);
      X.save(); X.globalAlpha *= on ? 1 : ativo ? 1 : .6;
      circ(q.x, q.y, q.r, on ? rgba(m.c, .14) : null, on ? m.c : 'rgba(233,239,250,.75)', on ? 2.5 : 1.4);
      if (!on) { X.setLineDash([4, 4]); circ(q.x, q.y, q.r + 5, null, ativo ? COR.amber : 'rgba(233,239,250,.3)', ativo ? 1.6 : 1); X.setLineDash([]); }
      X.restore();
      hitC(q.x, q.y, q.r + 6, 'alvo:' + i);
    });
    // 1) ligação e 2) fusão
    const [ex, ey] = pm(aIn), ux0 = Math.cos(aIn), uy0 = Math.sin(aIn), tip = recs[1].tip, dist = tam(44, 80);
    if (p < 4.6) {
      const k = ss(seg(p, 0, 2.2)), fx = tip[0] + ux0 * vr * 1.15, fy = tip[1] + uy0 * vr * 1.15;
      if (p < 2.5) virion(lerp(fx + ux0 * dist, fx, k), lerp(fy + uy0 * dist, fy, k), vr, { tipo: 'hiv', corte: .75, enz: true, rot: .6 + p * .15, ph: t });
      else {
        const f = ss(seg(p, 2.5, 4.5)), ev = 1 - seg(p, 2.6, 3.4);
        virion(lerp(fx, P[0].x, f), lerp(fy, P[0].y, f), vr, { tipo: 'hiv', corte: .75, enz: true, env: ev, esp: ev, rot: .97 + f * .5, ph: t });
        if (p < 3.6) { X.save(); X.globalAlpha *= (1 - seg(p, 3, 3.6)) * .6; circ(ex, ey, vr * .9, rgba(COR.env, .35)); X.restore(); }   // o envelope vira membrana
      }
    }
    // 3) transcriptase reversa: lê o RNA (coral) e monta o DNA (violeta)
    const Lr = Math.min(rx * tam(.5, .36), 120), rx0 = P[0].x - Lr / 2, rx1 = P[0].x + Lr / 2, yR = P[0].y - 5, yD = P[0].y + 7;
    if (p >= 4.5 && p < 9) {
      const capA = 1 - seg(p, 4.5, 5.2);
      if (capA > .02) virion(P[0].x, P[0].y, vr, { tipo: 'hiv', env: 0, esp: 0, a: capA, enz: true, rot: 1.47, ph: t });
      const ra = seg(p, 4.6, 5) * (1 - seg(p, 8.1, 8.7)), f = seg(p, 5, 8.2);
      fita([[rx0, yR], [rx1, yR]], { tipo: 'rna', amp: 2.4, ond: 10, lw: 2.2, a: ra, ph: t * .5 });
      if (p < 8.5) {
        fita([[rx0, yD], [rx1, yD]], { tipo: 'dna', f, amp: 3, ond: 12, lw: 1.8 });
        enzima(lerp(rx0, rx1, f), P[0].y + 1, tam(6, 7.5), COR.tr, seg(p, 4.8, 5.1));
        if (L1 && p >= 5) tx('transcriptase reversa', P[0].x, P[0].y + g.alvos[0].r + 14, { s: 12, w: 700, c: COR.tr });
      }
    }
    // 4) o DNA vai ao núcleo; a integrase o costura no cromossomo
    if (p >= 8.5 && p < 11.3) {
      const k = ss(seg(p, 8.5, 10.1)), x = lerp(P[0].x, nuc.x, k), y = lerp(yD, nuc.y - (intB ? tam(18, 22) : 0), k), L = Lr * lerp(1, .42, k);
      fita([[x - L / 2, y], [x + L / 2, y]], { tipo: 'dna', amp: 3, ond: 12, lw: 1.8, a: 1 - seg(p, 10.6, 11.3) });
      if (p >= 9.6) {
        const ia = seg(p, 9.6, 9.9) * (1 - seg(p, 11, 11.3));
        enzima(nuc.x - nuc.rx * .22 + Math.sin(p * 9) * 2, nuc.y - tam(8, 10), tam(6, 7.5), COR.int, ia, PI / 2);
        enzima(nuc.x + nuc.rx * .22 - Math.sin(p * 9) * 2, nuc.y - tam(8, 10), tam(6, 7.5), COR.int, ia, PI / 2);
        if (L1) { const q = alvos[1]; X.save(); X.globalAlpha *= ia; tx('integrase', q.x - q.r - 8, q.y, { s: 12, w: 700, a: 'right', c: COR.int }); X.restore(); }
      }
    }
    // 5) transcrição: RNAs saem do núcleo até os ribossomos
    if (p >= 11.5 && p < 15) {
      for (let i = 0; i < 3; i++) {
        const k = ss(seg(p, 11.6 + i * .4, 13.2 + i * .4)), a = seg(p, 11.6 + i * .4, 11.9 + i * .4) * (1 - seg(p, 14.2, 15));
        const qx = lerp(nuc.x - nuc.rx * .2, P[2].x + 12 - i * 13, k), qy = lerp(nuc.y + 6, P[2].y - 10 + i * 7, k);
        fita([[qx - 12, qy], [qx + 12, qy]], { tipo: 'rna', amp: 1.8, ond: 7, lw: 2, a });
      }
    }
    // 6) tradução: cadeia longa de proteínas; 7) a protease corta
    const nB = 9, cb = tam(6.5, 8.5), x0c = P[2].x - nB * cb / 2, yc = P[2].y + tam(2, 4);
    if (p >= 13.5 && p < 18.4) {
      const k = seg(p, 13.6, 15.4), corte = proB ? 0 : seg(p, 15.7, 17.3), a = 1 - seg(p, 17.8, 18.4);
      X.save(); X.globalAlpha *= a;
      const n = Math.round(nB * k);
      for (let i = 0; i < n; i++) { const gi = Math.floor(i / 3), sep = corte * (gi - 1) * tam(5, 7); circ(x0c + i * cb + sep, yc, cb * .48, rgba(COR.virus, .45), COR.virus, 1.2); }
      if (p >= 15.5 && p < 17.6) {
        const xe = proB ? x0c - cb : lerp(x0c - cb, x0c + nB * cb + tam(6, 10), seg(p, 15.6, 17.3));   // bloqueada, a protease não anda pela cadeia
        enzima(xe, yc - cb - 2, tam(6, 7.5), COR.pro, 1, PI / 2);
        if (L1) tx('protease', xe, yc + cb + 14, { s: 12, w: 700, c: COR.pro });
      }
      X.restore();
    }
    // 8) montagem e brotamento: o capsídeo encosta na membrana, que o embrulha com as espículas; o vírus novo se solta
    for (const b of brotos) {
      if (p < b.t0) continue;
      const a = 1 - seg(p, T2 - .9, T2), mont = seg(p, b.t0, b.t0 + .6);
      if (b.sai < 1) {
        virion(b.x, b.y, vr, { tipo: 'hiv', env: 0, esp: 0, cap: proB ? 0 : mont, gen: mont, rot: b.j * 2, ph: t, a });
        if (b.preso) {   // espículas na parte da membrana que já saiu
          const g0 = Math.atan2(b.uy, b.ux), k = ss(seg(b.sai, .3, .9));
          for (let i = 0; i < 5; i++) { const g1 = g0 + (i - 2) * .55; espicula(b.x + Math.cos(g1) * vr * 1.04, b.y + Math.sin(g1) * vr * 1.04, g1, vr * .3, { tipo: 'gp', a: k }); }
        }
      } else { virion(b.x, b.y, vr, { tipo: 'hiv', corte: .75, cap: proB ? 0 : 1, rot: b.j * 2, ph: t, a }); if (proB) tx('imaturo', cl(b.x, 34, W - 34), b.y + (b.j ? -1 : 1) * vr * 1.75, { s: 12, w: 700, c: COR.dim }); }
    }
    // remédio no lugar: nome da enzima bloqueada junto ao alvo
    for (const m of REM) if (S.pos[m.k] === m.alvo) tok(alvos[m.alvo].x, slotY(alvos[m.alvo], m.alvo), m.e + ' bloqueada', m.c, { s: 12 });
    // legenda
    let e = ET2[0][1]; for (const [s0, c0] of ET2) if (p >= s0) e = c0;
    if (S.pos.pro === 2 && p >= 15.5 && p < 17.5) e = '<b>Protease bloqueada.</b> A cadeia de proteínas não é cortada: os vírus novos vão sair <b>imaturos</b>.';
    if (S.msg && performance.now() - S.msgT < 6000) e = S.msg;   // a resposta ao aluno vem antes do aviso de trava
    else if (preso) e = `<b>Travado.</b> ${trava.n}: ${trava.preso}`;
    cap(e);
  }

  function bandejaR2(g, S) {
    const { tray, pills, alvos } = g;
    if (tray.col) {
      tx('Onde o remédio age?', (tray.x0 + tray.x1) / 2, tray.y0 + 6, { s: 13, w: 700, c: COR.txt });
      wrapTx('Arraste cada comprimido até a etapa que ele bloqueia, ou toque no comprimido e depois na etapa.', tray.x0, pills[2].y + pills[2].h + 22, tray.x1 - tray.x0, { s: 12, lh: 16, a: 'left', c: COR.dim });
    } else tx('Toque num comprimido e depois na etapa que ele bloqueia.', (tray.x0 + tray.x1) / 2, tray.y0 - 9, { s: 12, c: COR.dim });
    REM.forEach((m, i) => {
      const r = pills[i], usado = S.pos[m.k] === m.alvo, arr = S.arr && S.arr.k === m.k;
      if (usado) { rr(r.x, r.y, r.w, r.h, Math.min(r.h / 2, 18), null, 'rgba(233,239,250,.22)', 1); tx('no lugar', r.x + r.w / 2, r.y + r.h / 2, { s: 12, c: COR.dim, bg: false }); return; }
      comprimido(r.x, r.y, r.w, r.h, m, { sel: S.sel === m.k, a: arr ? .3 : 1 });
      hitR(r.x, r.y, r.w, r.h, 'rem:' + m.k);
    });
    // nome de cada etapa (o processo, não a enzima): o aluno decide qual remédio age ali
    alvos.forEach((q, i) => {
      if (S.pos[REM.find(z => z.alvo === i).k] === i) return;
      tx(`${i + 1}. ${(NAR ? ALVO_C : ALVO)[i]}`, q.x, slotY(q, i), { s: tam(11.5, 12.5), w: 700, c: COR.txt });
    });
    if (S.arr) { const m = REM.find(z => z.k === S.arr.k), w = tam(104, 150), h = tam(48, 44); comprimido(S.arr.x - w / 2, S.arr.y - h / 2, w, h, m, { sel: true, a: .94 }); }
  }

  // população de vírus: um remédio sozinho seleciona o mutante resistente; os três juntos barram
  function populacao(t, S, g) {
    const A = g.A, tres = S.modo === 'tres', T = 16, p = fr(t / T) * T;
    const top = A.y0 + tam(8, 10), box = { x0: A.x0 + tam(4, 30), x1: A.x1 - tam(4, 30), y0: top + tam(66, 58), y1: A.y1 - tam(40, 34) };
    title(tres ? 'Os três remédios juntos' : 'Só um remédio', (A.x0 + A.x1) / 2, top + 6, A.w - 20, { s: tam(15, 18) });
    const ms = tres ? REM : [REM[0]], pw = tam(Math.min(108, (A.w - 24) / 3), 150), ph = tam(46, 40), gx = 8;
    const tot = ms.length * pw + (ms.length - 1) * gx, ap = seg(p, 3, 4);
    ms.forEach((m, i) => comprimido((A.x0 + A.x1) / 2 - tot / 2 + i * (pw + gx), top + 18, pw, ph, m, { a: .35 + .65 * ap }));
    panel(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0, { f: 'rgba(240,106,174,.05)', s: rgba(COR.env, .5) });
    const R = rng(7), n = 46, vr = tam(7, 9), pts = [];
    for (let i = 0; i < 92; i++) pts.push([lerp(box.x0 + vr * 2.2, box.x1 - vr * 2.2, R()), lerp(box.y0 + 30, box.y1 - vr * 2.2, R())]);
    const morre = seg(p, 4, 6);
    let vivos = 0;
    for (let i = 0; i < n; i++) {
      const [x, y] = pts[i], mut = i === 5, a = (mut ? (tres ? 1 - seg(p, 6, 8) : 1) : 1 - morre) * (1 - seg(p, T - .6, T) * (mut ? 0 : 1));
      if (a <= .02) continue; vivos++;
      virion(x + Math.sin(t * 2 + i) * 1.5, y, vr, { tipo: 'hiv', a, rot: i, ph: t });
      if (mut) circ(x + Math.sin(t * 2 + i) * 1.5, y, vr * 1.9, null, COR.rna, 2);
    }
    if (!tres) {   // o mutante se multiplica: 1, 2, 4, 8...
      for (let i = 0; i < 44; i++) {
        const gen = Math.floor(Math.log2(i + 2)) - 1, t0 = 6.5 + gen * 1.3, a = seg(p, t0, t0 + .4) * (1 - seg(p, T - .6, T));
        if (a <= .02) continue; vivos++;
        const [x, y] = pts[n + i]; virion(x, y, vr, { tipo: 'hiv', a, rot: i, ph: t }); circ(x, y, vr * 1.9, null, COR.rna, 2);
      }
    }
    tx(`vírus na amostra: ${vivos}`, box.x1 - 10, box.y0 + 14, { s: 12, w: 700, a: 'right', c: COR.txt });
    if (tres && p > 8.2) wrapTx('Nenhum vírus escapou dos três remédios ao mesmo tempo.', (box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2, box.x1 - box.x0 - 30, { s: tam(13, 15), w: 700, lh: tam(18, 20), c: COR.ok });
    const yL = box.y1 + tam(16, 18);
    circ(box.x0 + 10, yL, vr * .9, null, COR.rna, 2);
    wrapTx('mutante resistente ao inibidor da transcriptase reversa', box.x0 + 24, yL, box.x1 - box.x0 - 30, { s: tam(11.5, 12), lh: 15, a: 'left', c: COR.dim });
    let e;
    if (p < 3) e = 'No corpo, o HIV muda muito: a transcriptase reversa <b>erra</b> e não corrige os erros. Alguns vírus nascem <b>mutantes</b>.';
    else if (p < 6.2) e = tres ? 'Os três remédios agem ao mesmo tempo, cada um numa enzima diferente do vírus.' : 'O remédio barra os vírus comuns, mas não o <b>mutante resistente</b>.';
    else e = tres ? 'O mutante escapa de um remédio, mas é barrado pelos outros dois. Escapar dos três ao mesmo tempo é <b>muito mais difícil</b>: por isso o tratamento usa vários remédios juntos.'
      : 'O mutante resistente, que já existia antes do remédio, se multiplica e toma o lugar dos outros: o remédio sozinho <b>deixa de funcionar</b>. O remédio não cria a mutação; ele <b>seleciona</b> o mutante.';
    cap(e);
  }

  function soltaR2(S, k, alvo) {
    const m = REM.find(z => z.k === k); S.sel = null; if (alvo == null) return;
    if (m.alvo === alvo) S.msg = m.ok;
    else S.msg = `Esse remédio não age na etapa "${ALVO[alvo]}". O ${m.n.toLowerCase()} bloqueia a etapa da enzima que dá nome a ele.`;
    if (m.alvo === alvo) S.pos[k] = alvo;
    if (REM.every(z => S.pos[z.k] === z.alvo)) S.msg = 'Os três remédios no lugar certo. Agora compare <b>Só um remédio</b> com <b>Os três juntos</b>.';
    S.msgT = performance.now();
  }

  def('replicacao', 'retrovirus', {
    t: 'Retrovírus e transcriptase reversa',
    s: 'de RNA para DNA, o caminho ao contrário',
    loc: 'Linfócito T em corte, infectado pelo HIV',
    locNota: 'Desenho esquemático, fora de escala',
    alt: 'Um linfócito T em corte. O HIV se prende ao receptor CD4, funde o envelope com a membrana e solta o capsídeo; a transcriptase reversa lê o RNA do vírus e monta DNA, que entra no núcleo e é costurado no cromossomo pela integrase, virando provírus. A célula faz RNA e proteínas do vírus, a protease corta as proteínas e vírus novos brotam com um pedaço da membrana. No alto, o dogma central com uma seta de RNA para DNA marcada transcriptase reversa. Três comprimidos podem ser levados até a etapa que cada um bloqueia, e dois botões comparam um remédio sozinho com os três juntos',
    still: 6.5,
    init(S) { if (!S.pos) { S.pos = {}; S.modo = 'ciclo'; S.sel = null; S.arr = null; S.msg = ''; S.msgT = 0; } },
    extra: [
      { t: 'Ciclo do HIV', on(S) { S.modo = 'ciclo'; S.ph = 0; }, pressed: S => S.modo === 'ciclo' },
      { t: 'Só um remédio', on(S) { S.modo = S.modo === 'um' ? 'ciclo' : 'um'; S.ph = 0; }, pressed: S => S.modo === 'um' },
      { t: 'Os três juntos', on(S) { S.modo = S.modo === 'tres' ? 'ciclo' : 'tres'; S.ph = 0; }, pressed: S => S.modo === 'tres' }
    ],
    grab(x, y, S) {
      if (S.modo !== 'ciclo') return false;
      const id = hitAt(x, y); if (!id || !String(id).startsWith('rem:')) return false;
      S.arr = { k: id.slice(4), x, y, x0: x, y0: y }; return true;
    },
    grabMove(x, y, S) { if (S.arr) { S.arr.x = x; S.arr.y = y; } },
    grabEnd(x, y, S) {
      const a = S.arr; S.arr = null; if (!a) return;
      if (Math.hypot(x - a.x0, y - a.y0) < 8) { S.sel = S.sel === a.k ? null : a.k; return; }   // clique sem arrastar: seleciona
      const g = S.g; let alvo = null;
      if (g) g.alvos.forEach((q, i) => { if (Math.hypot(x - q.x, y - q.y) <= q.r + 16) alvo = i; });
      if (alvo == null) { S.sel = null; return; }
      soltaR2(S, a.k, alvo);
    },
    tap(x, y, S) {
      if (S.modo !== 'ciclo') return;
      const id = hitAt(x, y); if (!id) { S.sel = null; return; }
      if (id.startsWith('rem:')) { const k = id.slice(4); S.sel = S.sel === k ? null : k; return; }
      if (id.startsWith('alvo:')) {
        if (S.sel) soltaR2(S, S.sel, +id.slice(5));
        else { S.msg = 'Escolha primeiro um comprimido e depois toque na etapa que ele bloqueia.'; S.msgT = performance.now(); }
      }
    },
    draw(t, S) {
      this.init(S); const g = geoR2(); S.g = g;
      if (S.modo === 'ciclo') { cicloR2(t, S, g); bandejaR2(g, S); }
      else populacao(t, S, g);
    },
    d: `<p>Na célula, a informação genética costuma seguir um caminho: o <b>DNA</b> é transcrito em <b>RNA</b>, e o RNA é traduzido em <b>proteína</b>. Os <b>retrovírus</b> fazem parte do caminho ao contrário (<i>retro</i> = para trás). Seu material genético é <b>RNA</b>, mas, logo depois de entrar na célula, uma enzima que o vírus traz dentro do capsídeo, a <b>transcriptase reversa</b>, usa esse RNA como molde para fabricar <b>DNA</b>. Em seguida, outra enzima viral, a <b>integrase</b>, insere esse DNA no <b>cromossomo da célula</b>, onde ele passa a se chamar <b>provírus</b>. A partir daí, a célula transcreve os genes do vírus como se fossem seus, e produz RNA e proteínas para novos vírus; uma terceira enzima viral, a <b>protease</b>, corta essas proteínas no tamanho certo, e é esse corte que deixa os vírus novos <b>maduros</b>, capazes de infectar. A transcriptase reversa foi descoberta em <b>1970</b>, ao mesmo tempo, por Howard <b>Temin</b> e David <b>Baltimore</b> (Nobel de 1975). O retrovírus mais conhecido é o <b>HIV</b>.</p>
<p>Três consequências caem muito em prova. Primeira: como o provírus fica no DNA da célula, a infecção pelo HIV é, até hoje, <b>para a vida toda</b>: os remédios controlam o vírus, mas o provírus continua nas células "escondidas". Segunda: a transcriptase reversa <b>erra muito</b> e não corrige os erros, por isso o HIV muda depressa dentro da própria pessoa, o que favorece a <b>resistência a medicamentos</b> e dificulta uma vacina. Por isso o tratamento usa vários remédios juntos (o "coquetel"). Terceira: os remédios <b>antirretrovirais</b> atacam justamente essas enzimas, que a célula humana não tem: há inibidores da <b>transcriptase reversa</b> (como o tenofovir e o AZT, o primeiro antirretroviral), da <b>integrase</b> e da <b>protease</b>.</p>
<p>Atenção: o <b>SARS-CoV-2 não é retrovírus</b> e não tem transcriptase reversa; ele copia RNA em RNA no citoplasma e não entra no núcleo. A transcriptase reversa também virou ferramenta de laboratório: o exame <b>RT-PCR</b> da covid-19 começa transformando o RNA do vírus em DNA com ela.</p>
<p>Na animação, leve cada comprimido até a etapa que ele bloqueia: o ciclo trava ali. Sem a transcriptase reversa ou sem a integrase, nenhum vírus novo é produzido; sem a protease, os vírus até brotam, mas saem <b>imaturos</b> e não infectam. Depois, compare <b>Só um remédio</b> com <b>Os três juntos</b>.</p>`,
    enem: '<b>Retrovírus</b> = vírus de <b>RNA</b> que usa a <b>transcriptase reversa</b> para fazer <b>DNA</b> a partir do RNA, e integra esse DNA no genoma da célula (<b>provírus</b>). É a exceção mais famosa ao "DNA faz RNA, que faz proteína". A prova também cobra por que o tratamento do HIV usa <b>vários antirretrovirais</b>: a alta taxa de <b>mutação</b> gera variantes resistentes a um remédio isolado. Pegadinha: o SARS-CoV-2 e o vírus da gripe são vírus de RNA, mas <b>não</b> são retrovírus.',
    links: [LK.dnarna, ['HIV e aids', '#doencas/hiv']]
  });

  // =====================================================================================
  // D1 ARBOVIROSES: DENGUE, ZIKA, CHIKUNGUNYA E FEBRE AMARELA
  // =====================================================================================
  const CRI = [
    { k: 'calha', feito: 'Calha limpa: as folhas saíram e a água escorre.' },
    { k: 'caixa', feito: "Caixa-d'água tampada: o mosquito não entra para pôr ovos." },
    { k: 'pneu', feito: 'Pneu guardado em lugar coberto, sem água dentro.' },
    { k: 'prato', feito: 'Areia no pratinho do vaso: a água não fica parada.' },
    { k: 'garrafa', feito: 'Garrafa guardada de boca para baixo.' }
  ];
  const MOSQ_POR = 8;
  const FICHAS = [
    { s: 'Febre alta, dor atrás dos olhos, dor no corpo e manchas na pele.', d: 'dengue' },
    { s: 'Gestante teve manchas na pele; o bebê nasceu com microcefalia.', d: 'zika' },
    { s: 'Dor forte nas articulações há três meses, depois de uma febre.', d: 'chik' },
    { s: 'Pele e olhos amarelados depois de acampar na mata.', d: 'fa' }
  ];
  const DOENCAS = [
    { k: 'dengue', n: 'Dengue', dica: 'Dengue: febre alta, dor atrás dos olhos e manchas na pele.' },
    { k: 'zika', n: 'Zika', dica: 'Zika: na gestante, o vírus atravessa a placenta e pode causar microcefalia.' },
    { k: 'chik', n: 'Chikungunya', dica: 'Chikungunya: dor forte nas articulações, que pode durar meses.' },
    { k: 'fa', n: 'Febre amarela', dica: 'Febre amarela: o vírus ataca o fígado e deixa a pele amarelada (icterícia).' }
  ];
  // mosquito voando (ícone do motor, na cor da via vetor); dir 1 = para a direita
  const voa = (x, y, s, dir = 1, o = {}) => icone('mosquito', x, y, s, Object.assign({ c: COR.vetor, flip: dir > 0 }, o));

  // ----- criadouros, com e sem água parada -----
  const brilho = (x, y, w) => line(x - w * .3, y, x + w * .1, y, 'rgba(255,255,255,.5)', 1.2);
  function dCalha(r, ok) {
    rr(r.x, r.y, r.w, r.h, 3, '#2A3350', '#8E9BB8', 1.6);
    if (!ok) { rr(r.x + 3, r.y + r.h * .35, r.w - 6, r.h * .55, 2, rgba(COR.agua, .75)); for (let i = 0; i < 6; i++) ell(r.x + 8 + i * (r.w - 16) / 5, r.y + r.h * .35, 5, 2.4, i, '#8C7A3C'); brilho(r.x + r.w * .5, r.y + r.h * .55, r.w * .4); }
    line(r.x + r.w - 6, r.y + r.h, r.x + r.w - 6, r.y + r.h + 16, '#8E9BB8', 3);
    if (ok) line(r.x + r.w - 6, r.y + r.h + 18, r.x + r.w - 6, r.y + r.h + 26, rgba(COR.agua, .8), 2, [2, 4]);
  }
  function dCaixa(x, y, w, h, ok) {
    line(x + w * .15, y + h, x + w * .1, y + h + h * .7, '#7C879F', 3); line(x + w * .85, y + h, x + w * .9, y + h + h * .7, '#7C879F', 3);
    line(x + w * .12, y + h + h * .35, x + w * .88, y + h + h * .35, '#7C879F', 2);
    shape([[x, y], [x + w * .06, y + h], [x + w * .94, y + h], [x + w, y]], '#3B5E8C', '#8FB4E6', 1.6);
    if (ok) { ell(x + w / 2, y, w / 2 + 3, h * .12, 0, '#4E73A6', '#8FB4E6', 1.6); ell(x + w / 2, y - h * .1, w * .12, h * .06, 0, '#8FB4E6'); }
    else { ell(x + w / 2, y, w / 2, h * .12, 0, rgba(COR.agua, .85), '#8FB4E6', 1.6); brilho(x + w / 2, y, w * .5); }
  }
  function dPneu(x, y, r, ok) {
    if (ok) {   // guardado sob um telhadinho, em pé
      shape([[x - r * 1.5, y - r * 1.25], [x, y - r * 1.75], [x + r * 1.5, y - r * 1.25]], '#3A425A', '#8E9BB8', 1.4);
      line(x - r * 1.3, y - r * 1.3, x - r * 1.3, y + r, '#8E9BB8', 2); line(x + r * 1.3, y - r * 1.3, x + r * 1.3, y + r, '#8E9BB8', 2);
    }
    ell(x, y, r, r * .95, 0, '#262A33', '#5E6575', r * .35);
    ell(x, y, r * .5, r * .47, 0, '#0E1220', '#3E4454', 1.5);
    if (!ok) { X.save(); X.beginPath(); X.ellipse(x, y, r * .5, r * .47, 0, 0, TAU); X.clip(); rr(x - r * .5, y + r * .12, r, r * .4, 0, rgba(COR.agua, .8)); X.restore(); }
  }
  function dPrato(x, y, s, ok) {
    shape([[x - s * .55, y - s], [x + s * .55, y - s], [x + s * .4, y - s * .22], [x - s * .4, y - s * .22]], '#B0643E', '#D98C62', 1.5);
    for (const [dx, h] of [[-.2, .55], [0, .75], [.22, .5]]) { line(x + dx * s, y - s, x + dx * s * 1.6, y - s - h * s, '#6BCB77', 2.2); ell(x + dx * s * 1.6, y - s - h * s, s * .12, s * .06, dx * 4, '#6BCB77'); }
    ell(x, y - s * .16, s * .7, s * .16, 0, ok ? COR.areia : '#8A4A2E', '#D98C62', 1.5);
    if (!ok) { ell(x, y - s * .18, s * .56, s * .09, 0, rgba(COR.agua, .85)); brilho(x, y - s * .18, s * .5); }
    else for (let i = 0; i < 7; i++) circ(x - s * .45 + i * s * .15, y - s * .18 + (i % 2) * 2 - 1, 1.2, '#A88A54');
  }
  function dGarrafa(x, y, s, ok) {
    const h = s * 1.1, w = s * .36;
    X.save(); X.translate(x, y - h / 2); if (ok) X.rotate(PI);
    X.beginPath(); X.moveTo(-w / 2, h / 2); X.lineTo(-w / 2, -h * .05); X.quadraticCurveTo(-w / 2, -h * .25, -w * .2, -h * .32); X.lineTo(-w * .2, -h / 2); X.lineTo(w * .2, -h / 2); X.lineTo(w * .2, -h * .32); X.quadraticCurveTo(w / 2, -h * .25, w / 2, -h * .05); X.lineTo(w / 2, h / 2); X.closePath();
    X.fillStyle = 'rgba(120,200,140,.22)'; X.fill(); X.strokeStyle = '#8FD4A0'; X.lineWidth = 1.6; X.stroke();
    if (!ok) { X.clip(); rr(-w / 2, h * .1, w, h * .4, 0, rgba(COR.agua, .75)); }
    X.restore();
  }
  // ----- quintal -----
  function geoQuintal(A, y0) {
    const B = { x0: A.x0, x1: A.x1, y0, y1: A.y1 }, w = B.x1 - B.x0, h = B.y1 - B.y0, gy = B.y1 - h * .12;
    const u = NAR ? Math.min(w / 7, h / 4.4) : Math.min(w / 10, h / 4.4);
    const cw = w * .3, ct = Math.max(B.y0 + h * .34, gy - cw * (NAR ? 1.05 : 1));
    const casa = { x: B.x0 + w * .02, y: ct, w: cw, h: gy - ct };
    const pos = {
      calha: { x: casa.x - 4, y: casa.y - u * .3, w: casa.w + 8, h: u * .32 },
      caixa: { x: B.x0 + w * (NAR ? .42 : .38), y: B.y0 + h * (NAR ? .16 : .22), w: u * 1.3, h: u * 1.1 },
      pneu: { x: B.x0 + w * (NAR ? .5 : .62), y: gy - u * .62, r: u * .62 },
      prato: { x: B.x0 + w * (NAR ? .73 : .79), y: gy, s: u * .9 },
      garrafa: { x: B.x0 + w * .93, y: gy, s: u }
    };
    const P2 = pos;
    const hit = {
      calha: { x: P2.calha.x, y: P2.calha.y - 6, w: P2.calha.w, h: P2.calha.h + 12 },
      caixa: { x: P2.caixa.x - 6, y: P2.caixa.y - 10, w: P2.caixa.w + 12, h: P2.caixa.h * 1.9 },
      pneu: { x: P2.pneu.x - P2.pneu.r * 1.4, y: P2.pneu.y - P2.pneu.r * 1.6, w: P2.pneu.r * 2.8, h: P2.pneu.r * 2.7 },
      prato: { x: P2.prato.x - P2.prato.s * .75, y: P2.prato.y - P2.prato.s * 1.8, w: P2.prato.s * 1.5, h: P2.prato.s * 1.9 },
      garrafa: { x: P2.garrafa.x - P2.garrafa.s * .38, y: P2.garrafa.y - P2.garrafa.s * 1.22, w: P2.garrafa.s * .76, h: P2.garrafa.s * 1.26 }
    };
    for (const k in hit) { const r = hit[k]; if (r.x + r.w > B.x1) r.w = B.x1 - r.x; if (r.x < B.x0) { r.w -= B.x0 - r.x; r.x = B.x0; } }
    return { B, w, h, gy, u, casa, pos, hit };
  }
  function quintal(t, S, A, y0) {
    const q = geoQuintal(A, y0), { B, gy, casa, pos, hit } = q;
    rr(B.x0, gy, B.x1 - B.x0, B.y1 - gy, 4, 'rgba(110,160,90,.18)'); line(B.x0, gy, B.x1, gy, 'rgba(160,200,140,.55)', 1.5);
    rr(casa.x, casa.y, casa.w, casa.h, 2, 'rgba(216,192,138,.16)', 'rgba(216,192,138,.6)', 1.4);
    shape([[casa.x - 8, casa.y], [casa.x + casa.w / 2, casa.y - Math.min(q.u * 1.1, casa.w * .45)], [casa.x + casa.w + 8, casa.y]], 'rgba(200,110,80,.3)', '#D98C62', 1.4);
    rr(casa.x + casa.w * .58, casa.y + casa.h * .38, casa.w * .24, casa.h * .62, 2, 'rgba(11,15,28,.5)', 'rgba(216,192,138,.6)', 1.2);
    rr(casa.x + casa.w * .12, casa.y + casa.h * .25, casa.w * .3, casa.h * .28, 2, 'rgba(95,168,232,.18)', 'rgba(216,192,138,.6)', 1.2);
    const ok = k => !!S.feito[k];
    dCalha(pos.calha, ok('calha'));
    dCaixa(pos.caixa.x, pos.caixa.y, pos.caixa.w, pos.caixa.h, ok('caixa'));
    dPneu(pos.pneu.x, pos.pneu.y, pos.pneu.r, ok('pneu'));
    dPrato(pos.prato.x, pos.prato.y, pos.prato.s, ok('prato'));
    dGarrafa(pos.garrafa.x, pos.garrafa.y, pos.garrafa.s, ok('garrafa'));
    const faltam = CRI.filter(c => !ok(c.k));
    for (const c of CRI) {
      const r = hit[c.k];
      if (ok(c.k)) { circ(r.x + r.w - 4, r.y + 6, 8, COR.ok, '#0B0F1C', 1.5); poly([[r.x + r.w - 8, r.y + 6], [r.x + r.w - 5, r.y + 9], [r.x + r.w, r.y + 3]], '#0B0F1C', 2); }
      else {
        X.save(); X.globalAlpha *= S.paused ? .6 : .35 + .3 * Math.sin(t * 4); X.setLineDash([4, 4]); rr(r.x, r.y, r.w, r.h, 8, null, COR.amber, 1.4); X.setLineDash([]); X.restore();
        hitR(r.x, r.y, r.w, r.h, 'cri:' + c.k);
      }
    }
    // mosquitos voando perto dos criadouros que restam
    const R = rng(11);
    faltam.forEach((c, j) => {
      const r = hit[c.k];
      for (let i = 0; i < 3; i++) {
        const ph = R() * TAU, sp = .7 + R() * .6, mx = r.x + r.w / 2 + Math.cos(t * sp + ph) * r.w * .6, my = r.y - 10 + Math.sin(t * sp * 1.7 + ph) * 12 - i * 9;
        voa(cl(mx, B.x0 + 10, B.x1 - 10), cl(my, B.y0 + 36, gy - 4), tam(16, 18), -Math.sin(t * sp + ph) >= 0 ? 1 : -1);
      }
    });
    const n = faltam.length * MOSQ_POR, s = `Mosquitos no quintal: ${n}`, sz = tam(12, 13), wT = tw(s, sz, 700) + 20;
    rr(B.x1 - wT, B.y0 + 2, wT, 26, 13, 'rgba(11,15,28,.84)', n ? rgba(COR.vetor, .6) : COR.ok, 1.2);
    tx(s, B.x1 - wT / 2, B.y0 + 15, { s: sz, w: 700, c: n ? COR.txt : COR.ok, bg: false });
    return faltam.length;
  }
  // ciclo do mosquito num criadouro (corte de um balde); f = 0..1
  function cicloMosquito(r, f, t) {
    panel(r.x, r.y, r.w, r.h, { f: PAINEL, s: BORDA });
    tx('No criadouro', r.x + r.w / 2, r.y + 14, { s: 12.5, w: 700, c: COR.txt, bg: false });
    const bw = Math.min(r.w * .38, 110), bh = r.h - 46, bx = r.x + 14, by = r.y + 30;
    const nivel = lerp(.35, .78, ss(seg(f, .18, .32)));
    rr(bx, by, bw, bh, 4, 'rgba(255,255,255,.04)', '#8E9BB8', 1.6);
    rr(bx + 2, by + bh * (1 - nivel), bw - 4, bh * nivel - 2, 2, rgba(COR.agua, .45));
    const ye = by + bh * .5, ovos = 1 - seg(f, .32, .4);
    if (ovos > .02) for (let i = 0; i < 5; i++) ell(bx + 5, ye - i * 4, 1.6, 2.6, 0, rgba('#E8EDF7', ovos));
    const la = seg(f, .36, .42) * (1 - seg(f, .66, .72));
    for (let i = 0; i < 3 && la > .02; i++) { const lx = bx + bw * (.3 + i * .22), ly = by + bh * (1 - nivel) + 10 + i * 7 + Math.sin(t * 5 + i) * 3; fita([[lx, ly], [lx + 2, ly + 12]], { c: '#E8EDF7', amp: 1.6, ond: 6, lw: 2, a: la, ph: t * 6 + i }); }
    if (f >= .7) { const k = seg(f, .7, .95); voa(bx + bw / 2 + k * bw * .6, by + bh * (1 - nivel) - 8 - k * 24, 18, 1, { a: 1 - seg(f, .95, 1) }); }
    const et = ['ovos na parede', 'a água sobe', 'larvas', 'mosquito adulto'], ei = f < .18 ? 0 : f < .36 ? 1 : f < .68 ? 2 : 3;
    const xl = bx + bw + 12, wl = r.x + r.w - xl - 8;
    et.forEach((s, i) => tx(s, xl, by + 8 + i * 17, { s: 12, w: i === ei ? 700 : 400, a: 'left', c: i === ei ? COR.vetor : COR.dim, bg: false }));
    wrapTx('do ovo ao adulto: cerca de 7 a 10 dias', xl, by + 8 + 4 * 17 + 2, wl, { s: 12, lh: 15, a: 'left', c: COR.txt });
  }
  // transmissão: a fêmea pica a pessoa doente e depois a sadia
  function transmissao(r, f, t) {
    panel(r.x, r.y, r.w, r.h, { f: PAINEL, s: BORDA });
    const s = Math.min(r.h * .44, 52), y = r.y + r.h - s * .5 - 22, xa = r.x + r.w * .2, xb = r.x + r.w * .8;
    icone('humano', xa, y, s, { c: COR.doente }); icone('humano', xb, y, s, { c: COR.txt });
    tx('pessoa com o vírus', xa, r.y + r.h - 11, { s: 12, w: 700, c: COR.doente });
    tx('pessoa sadia', xb, r.y + r.h - 11, { s: 12, w: 700, c: COR.txt });
    for (let i = 0; i < 4; i++) circ(xa - s * .1 + (i % 2) * s * .2, y - s * .02 + Math.floor(i / 2) * s * .16, 2.4, COR.virus);
    const ya = y - s * .18, topo = r.y + 36, qx = (xa + xb) / 2;
    X.save(); X.setLineDash([3, 5]); X.beginPath(); X.moveTo(xa + s * .22, ya); X.quadraticCurveTo(qx, topo - 4, xb - s * .22, ya); X.strokeStyle = rgba(COR.vetor, .7); X.lineWidth = 1.6; X.stroke(); X.restore();
    tx('o vírus se multiplica no mosquito e chega à saliva', qx, r.y + 14, { s: 12.5, w: 700, c: COR.vetor, bg: false });
    let mx, my, dir = 1;
    if (f < .22) { mx = xa + s * .3; my = ya + Math.sin(t * 3) * 1.5; dir = -1; }
    else if (f < .7) [mx, my] = qpt(xa + s * .22, ya, qx, topo - 4, xb - s * .22, ya, ss(seg(f, .22, .7)));
    else { mx = xb - s * .3; my = ya + Math.sin(t * 3) * 1.5; }
    voa(mx, my - 6, 22, dir);
    if (f > .22) { const nv = 1 + Math.round(3 * ss(seg(f, .3, .62))); for (let i = 0; i < nv; i++) circ(mx + (6 + (i % 2) * 4) * dir, my - 1 - Math.floor(i / 2) * 4, 2.4, COR.virus); }   // o vírus se multiplica dentro do mosquito
    if (!NAR) mtx(f < .22 ? 'a fêmea de <i>Aedes aegypti</i> suga o vírus' : f < .7 ? 'o vírus se multiplica nela por dias' : 'pica e passa o vírus na saliva', qx, r.y + r.h - 11, { s: 12, c: COR.dim, bg: false });
  }
  // febre amarela: mata (ciclo silvestre) e cidade (ciclo urbano)
  function mata(t, S, A) {
    const vert = NAR || A.w < 560;
    const M = vert ? { x0: A.x0, x1: A.x1, y0: A.y0, y1: A.y0 + A.h * .64 } : { x0: A.x0, x1: A.x0 + A.w * .62, y0: A.y0, y1: A.y1 };
    const Ci = vert ? { x0: A.x0, x1: A.x1, y0: M.y1 + 10, y1: A.y1 } : { x0: M.x1 + 14, x1: A.x1, y0: A.y0, y1: A.y1 };
    const mw = M.x1 - M.x0, mh = M.y1 - M.y0;
    panel(M.x0, M.y0, mw, mh, { f: 'rgba(47,107,69,.12)', s: 'rgba(110,190,130,.4)' });
    tx('Ciclo silvestre', M.x0 + 12, M.y0 + 16, { s: tam(13, 14), w: 700, a: 'left', c: '#9ED9A8', bg: false });
    mtx('<i>Haemagogus</i> e <i>Sabethes</i>: mosquitos da mata', M.x0 + 12, M.y0 + 36, { s: tam(12, 12.5), a: 'left', c: COR.vetor, bg: false });
    const nota = 'Macacos não transmitem para pessoas: adoecem como nós e servem de alerta.';
    const hN = wrapTx(nota, M.x0 + 12, M.y0 + 56, mw - 24, { s: 12, lh: 16, a: 'left', c: '#F0D9BF' });
    // árvores (presas ao painel)
    const top0 = M.y0 + 56 + hN, gy = M.y1 - mh * .13, ch = gy - top0;
    X.save(); X.beginPath(); X.rect(M.x0 + 1, M.y0 + 1, mw - 2, mh - 2); X.clip();
    const cop = [], r = Math.min(mw * .1, ch * .2);
    for (let i = 0; i < 5; i++) {
      const x = M.x0 + mw * (.1 + i * .2), y = top0 + r * 1.1 + (i % 2) * ch * .06;
      line(x, y, x, gy, COR.tronco, tam(5, 7));
      for (let j = 0; j < 3; j++) circ(x + (j - 1) * r * .62, y - (j === 1 ? r * .32 : 0), r * (.72 + ((i + j) % 3) * .08), rgba(COR.mata, .5), COR.mata, 1.2);
      cop.push([x, y + r * .3]);
    }
    line(M.x0 + 6, gy, M.x1 - 6, gy, 'rgba(160,200,140,.5)', 1.5);
    const ty = gy + (M.y1 - gy) * .55;
    line(M.x0 + mw * .35, ty, M.x1 - 8, ty, 'rgba(217,190,134,.6)', 2, [6, 6]);
    const ps = Math.min(mh * .2, 46), px = M.x1 - mw * .12 - fr(t / 14) * mw * .12, py = ty - ps * .45;
    icone('humano', px, py, ps, { c: COR.txt });
    const mk = [cop[1], cop[3]], ms = Math.min(mh * .17, r * 1.3, 44);
    mk.forEach(([x, y], i) => icone('macaco', x, y, ms, { c: COR.macaco, flip: i === 0 }));
    const f = S.paused ? .3 : fr(t / 9), a0 = mk[0], a1 = mk[1], h0 = Math.min(mh * .14, r);
    const c1 = [a0[0] + ms * .3, a0[1] - ms * .3, (a0[0] + a1[0]) / 2, a0[1] - ms * .3 - h0, a1[0] - ms * .3, a1[1] - ms * .3];
    const c2 = [a1[0] + ms * .2, a1[1] + ms * .3, (a1[0] + px) / 2 + 10, (a1[1] + py) / 2, px - ps * .25, py - ps * .3];
    qarrow(...c1, rgba(COR.vetor, .75), 1.5, [3, 5]);
    qarrow(...c2, rgba(COR.vetor, .75), 1.5, [3, 5]);
    const [mx, my] = f < .5 ? qpt(...c1, ss(f / .5)) : qpt(...c2, ss((f - .5) / .5));
    voa(mx, my, tam(18, 20), f < .5 ? 1 : (px > a1[0] ? 1 : -1));
    X.restore();
    // cidade
    const cw = Ci.x1 - Ci.x0, chh = Ci.y1 - Ci.y0;
    panel(Ci.x0, Ci.y0, cw, chh, { f: 'rgba(19,26,43,.6)', s: BORDA });
    tx('Ciclo urbano', Ci.x0 + 12, Ci.y0 + 16, { s: tam(13, 14), w: 700, a: 'left', c: COR.txt, bg: false });
    mtx('Transmissor: <i>Aedes aegypti</i>', Ci.x0 + 12, Ci.y0 + 36, { s: tam(12, 12.5), a: 'left', c: COR.vetor, bg: false });
    const hC = wrapTx('No Brasil, não há registro de febre amarela urbana desde <b>1942</b>.', Ci.x0 + 12, Ci.y0 + 56, cw - 24, { s: tam(12, 13), lh: tam(16, 17), a: 'left', c: COR.txt });
    const by = Ci.y1 - 10, yTop = Ci.y0 + 56 + hC + 6, hMax = Math.max(24, by - yTop), nb = vert ? 6 : 5, bw = Math.min((cw - 24) / nb, 54);
    for (let i = 0; i < nb; i++) {
      const hb = hMax * (.5 + ((i * 37) % 5) * .1), x = Ci.x0 + 12 + i * bw;
      rr(x + 2, by - hb, bw - 6, hb, 2, 'rgba(155,170,200,.12)', 'rgba(155,170,200,.45)', 1.2);
      for (let wy = by - hb + 8; wy < by - 10; wy += 13) for (let wx = x + 7; wx < x + bw - 10; wx += 10) rr(wx, wy, 5, 6, 1, (i + Math.round(wy) + Math.round(wx)) % 3 ? 'rgba(247,193,59,.22)' : 'rgba(155,170,200,.18)');
    }
    voa(Ci.x1 - 24, Ci.y0 + 18 + (S.paused ? 0 : Math.sin(t * 2) * 3), 20, -1);
    cap(f < .5 ? 'Na mata, o vírus passa de macaco para macaco pela picada de mosquitos como <i>Haemagogus</i> e <i>Sabethes</i>.'
      : 'Quem entra na mata pode ser picado; sem a vacina, pode adoecer. O vírus ataca o <b>fígado</b> e causa a pele amarelada (icterícia). Há vacina eficaz no SUS.');
  }
  // "Qual arbovirose?": fichas fictícias e doenças (toque na ficha, depois na doença)
  function fichas(t, S, A) {
    const top = A.y0 + 4;
    title('Qual arbovirose?', (A.x0 + A.x1) / 2, top + 8, A.w - 20, { s: tam(15, 17) });
    tx('Fichas fictícias: toque numa ficha e depois na doença.', (A.x0 + A.x1) / 2, top + 30, { s: 12, c: COR.dim });
    const y0 = top + 48, g = 10;
    let fr0, dr;
    if (NAR) {
      const dh = 36, fh = Math.min(76, (A.y1 - y0 - 2 * (dh + 8) - 8 - 3 * g) / 4);
      fr0 = FICHAS.map((f, i) => ({ x: A.x0, y: y0 + i * (fh + g), w: A.w, h: fh }));
      const yd = y0 + 4 * (fh + g) + 2, dw = (A.w - 8) / 2;
      dr = DOENCAS.map((d, i) => ({ x: A.x0 + (i % 2) * (dw + 8), y: yd + Math.floor(i / 2) * (dh + 8), w: dw, h: dh }));
    } else {
      const dw = Math.min(190, A.w * .26), fw = (A.w - dw - 24 - g) / 2, fh = Math.min(120, (A.y1 - y0 - g) / 2);
      fr0 = FICHAS.map((f, i) => ({ x: A.x0 + (i % 2) * (fw + g), y: y0 + Math.floor(i / 2) * (fh + g), w: fw, h: fh }));
      const dh = 46, gd = Math.min(14, (2 * fh + g - 4 * dh) / 3);
      dr = DOENCAS.map((d, i) => ({ x: A.x1 - dw, y: y0 + i * (dh + gd), w: dw, h: dh }));
    }
    FICHAS.forEach((f, i) => {
      const r = fr0[i], certo = S.res[i] === f.d, err = S.err && S.err.i === i && performance.now() - S.err.t < 1200;
      const sel = S.selF === i, cb = certo ? COR.ok : err ? COR.erro : sel ? COR.amber : 'rgba(255,255,255,.2)';
      rr(r.x, r.y, r.w, r.h, 10, certo ? 'rgba(107,203,119,.1)' : PAINEL, cb, sel || certo || err ? 2.5 : 1);
      const pad = 12, sz = tam(12.5, 14);
      tx(`Ficha ${i + 1}`, r.x + pad, r.y + 14, { s: 12, w: 700, a: 'left', c: COR.dim, bg: false });
      wrapTx(f.s, r.x + pad, r.y + 32, r.w - pad * 2, { s: sz, lh: sz + 4, a: 'left', c: COR.txt });
      if (certo) { const d = DOENCAS.find(z => z.k === f.d), wk = mtw(d.n, 12, 700) + 12; tok(r.x + r.w - wk / 2 - 8, r.y + 14, d.n, COR.ok, { s: 12 }); }
      else hitR(r.x, r.y, r.w, r.h, 'ficha:' + i);
    });
    DOENCAS.forEach((d, i) => {
      const r = dr[i], usada = FICHAS.some((f, j) => S.res[j] === d.k && f.d === d.k);
      rr(r.x, r.y, r.w, r.h, 10, usada ? 'rgba(107,203,119,.1)' : rgba(COR.vetor, S.selF != null ? .16 : .08), usada ? COR.ok : rgba(COR.vetor, .8), 1.5);
      tx(d.n, r.x + r.w / 2, r.y + r.h / 2, { s: tam(13, 14), w: 700, c: usada ? COR.ok : COR.txt, bg: false });
      if (!usada) hitR(r.x, r.y, r.w, r.h, 'doenca:' + d.k);
    });
    const acertos = FICHAS.filter((f, i) => S.res[i] === f.d).length;
    let e = 'Leia os sintomas e a história de cada ficha. As quatro doenças são viroses transmitidas por mosquito.';
    if (acertos === 4) e = '<b>Todas certas.</b> Lembre: antibiótico não trata nenhuma delas, e na suspeita de dengue não se toma AAS.';
    else if (S.fmsg && performance.now() - S.fmsgT < 6000) e = S.fmsg;
    cap(e);
  }
  const SABIA = 'O Ministério da Saúde e a Fiocruz soltam <i>Aedes aegypti</i> com a bactéria <i>Wolbachia</i>, que atrapalha a multiplicação dos vírus dentro do mosquito. Esses mosquitos cruzam com os do lugar e passam a bactéria para os filhotes.';

  def('doencas', 'arboviroses', {
    t: 'Dengue, zika, chikungunya e febre amarela',
    s: 'quatro vírus levados por mosquitos, três deles pelo <i>Aedes aegypti</i>',
    loc: 'Um quintal com criadouros e uma mata',
    locNota: 'Desenho esquemático',
    alt: 'Um quintal com cinco criadouros de água parada: calha entupida, caixa-d\'água aberta, pneu, pratinho de vaso e garrafa. Tocar em cada um elimina o criadouro e diminui o número de mosquitos. No alto, o ciclo do mosquito num criadouro e uma fêmea de Aedes aegypti que pica uma pessoa com o vírus; o vírus se multiplica dentro dela e, dias depois, ela pica uma pessoa sadia. Outros botões mostram os ciclos silvestre e urbano da febre amarela e um jogo com quatro fichas fictícias de pacientes',
    still: 3,
    init(S) { if (!S.feito) { S.feito = {}; S.modo = 'quintal'; S.res = {}; S.selF = null; S.err = null; S.fmsg = ''; S.fmsgT = 0; S.qmsg = ''; S.qmsgT = 0; } },
    extra: [
      { t: 'Caça aos criadouros', on(S) { S.modo = 'quintal'; }, pressed: S => S.modo === 'quintal' },
      { t: 'Febre amarela', on(S) { S.modo = 'mata'; }, pressed: S => S.modo === 'mata' },
      { t: 'Qual arbovirose?', on(S) { S.modo = 'fichas'; }, pressed: S => S.modo === 'fichas' }
    ],
    tap(x, y, S) {
      const id = hitAt(x, y); if (!id) { if (S.modo === 'fichas') S.selF = null; return; }
      if (id.startsWith('cri:')) {
        const c = CRI.find(z => z.k === id.slice(4)); S.feito[c.k] = true;
        const n = CRI.filter(z => !S.feito[z.k]).length;
        S.qmsg = `${c.feito} ${n ? `Falta${n > 1 ? 'm' : ''} ${n} criadouro${n > 1 ? 's' : ''}.` : 'Todos os criadouros foram eliminados.'}`; S.qmsgT = performance.now();
      } else if (id.startsWith('ficha:')) { const i = +id.slice(6); S.selF = S.selF === i ? null : i; }
      else if (id.startsWith('doenca:')) {
        const k = id.slice(7), d = DOENCAS.find(z => z.k === k);
        if (S.selF == null) { S.fmsg = 'Escolha primeiro uma ficha e depois a doença.'; S.fmsgT = performance.now(); return; }
        const i = S.selF;
        if (FICHAS[i].d === k) { S.res[i] = k; S.fmsg = 'Certo. ' + d.dica; }
        else { S.err = { i, t: performance.now() }; S.fmsg = `A ficha ${i + 1} não é de ${d.n.toLowerCase()}. ${d.dica} Releia a ficha.`; }
        S.fmsgT = performance.now(); S.selF = null;
      }
    },
    draw(t, S) {
      this.init(S); const A = area();
      if (S.modo === 'mata') { mata(t, S, A); return; }
      if (S.modo === 'fichas') { fichas(t, S, A); return; }
      // faixa de cima: ciclo do mosquito e transmissão (lado a lado no computador; alternando no celular);
      // sem nenhum criadouro, a faixa dá lugar ao "Sabia?"
      const fim = CRI.every(c => S.feito[c.k]), bh0 = 138;
      let bh = bh0;
      if (fim) {
        const w = Math.min(A.w, 720), x = A.x0 + (A.w - w) / 2, hC = cartao(x, A.y0, w, SABIA, { tit: 'Sabia?', dry: true }); bh = Math.max(bh0, hC);
        cartao(x, A.y0 + (bh - hC) / 2, w, SABIA, { tit: 'Sabia?', f: 'rgba(19,26,43,.92)', borda: rgba(COR.ok, .6) });
      } else if (NAR) {
        const pp = fr(t / 20); if (pp < .5) cicloMosquito({ x: A.x0, y: A.y0, w: A.w, h: bh }, pp * 2, t); else transmissao({ x: A.x0, y: A.y0, w: A.w, h: bh }, (pp - .5) * 2, t);
      } else {
        const g = 12, w1 = (A.w - g) * .46;
        cicloMosquito({ x: A.x0, y: A.y0, w: w1, h: bh }, fr(t / 10), t);
        transmissao({ x: A.x0 + w1 + g, y: A.y0, w: A.w - w1 - g, h: bh }, fr(t / 10), t);
      }
      const falta = quintal(t, S, A, A.y0 + bh + 12);
      let e;
      if (S.qmsg && performance.now() - S.qmsgT < 5000) e = S.qmsg;
      else if (!falta) e = 'Sem água parada, o mosquito não tem onde pôr ovos. <b>Eliminar os criadouros</b> é o combate mais eficiente nas cidades.';
      else e = 'Toque nos <b>criadouros</b> de água parada para eliminá-los. Só a <b>fêmea</b> pica: ela precisa do sangue para amadurecer os ovos.';
      cap(e);
    },
    d: `<p><b>Arboviroses</b> são doenças causadas por vírus transmitidos por artrópodes, como mosquitos. No Brasil, as mais importantes são <b>dengue</b>, <b>zika</b>, <b>chikungunya</b> e <b>febre amarela</b>, todas causadas por <b>vírus de RNA envelopados</b>. A dengue, a zika e a chikungunya são transmitidas nas cidades pela <b>fêmea</b> do mosquito <b><i>Aedes aegypti</i></b> (só a fêmea pica, porque precisa do sangue para amadurecer os ovos). O <i>Aedes albopictus</i>, também presente no Brasil, transmite a dengue na Ásia; por aqui, ainda não foi associado à transmissão, mas também é alvo do combate. O mosquito pica de dia e põe os ovos em <b>água parada e limpa</b>: pneus, vasos de plantas, garrafas, caixas-d'água destampadas. Os ovos resistem secos por mais de um ano e eclodem quando a água volta. Por isso o combate mais eficiente é <b>eliminar os criadouros</b>. Quando a fêmea pica uma pessoa infectada, o vírus se <b>multiplica dentro do mosquito</b> e, alguns dias depois, chega à saliva; a partir daí, ela passa o vírus a cada picada, pelo resto da vida. Não há transmissão de pessoa para pessoa pelo ar nem pelo toque.</p>
<p>A <b>dengue</b> causa febre alta, dor atrás dos olhos, dor no corpo e manchas na pele. Há <b>quatro sorotipos</b> do vírus (DENV-1 a DENV-4): quem pega um fica protegido contra ele, mas uma segunda infecção por <b>outro sorotipo</b> aumenta o risco de <b>dengue grave</b>, com sangramentos e queda da pressão. Por isso, com suspeita de dengue, <b>não se deve tomar ácido acetilsalicílico</b> (AAS) nem anti-inflamatórios, que pioram o sangramento, e é preciso beber muito líquido e procurar atendimento. O SUS oferece vacina contra a dengue desde 2024, para grupos e idades definidos pelo Ministério da Saúde (confira o calendário vigente). O Instituto Butantan desenvolveu uma vacina brasileira de dose única, aprovada pela Anvisa em 2025; a oferta dela no SUS depende das decisões do Ministério da Saúde. A <b>zika</b> costuma ser mais leve no adulto, mas, na gestante, o vírus atravessa a placenta e pode causar <b>microcefalia</b> e outras malformações no bebê (a <b>síndrome congênita do zika</b>, que marcou a epidemia de 2015 e 2016 no Brasil); também se associa à síndrome de <b>Guillain-Barré</b> e pode ser transmitida por <b>relação sexual</b>. A <b>chikungunya</b> ("aquele que se dobra", numa língua da Tanzânia) causa <b>dor forte nas articulações</b>, que pode durar meses.</p>
<p>A <b>febre amarela</b> tem dois ciclos. No <b>ciclo silvestre</b>, nas matas, o vírus passa entre <b>macacos</b> por mosquitos dos gêneros <i>Haemagogus</i> e <i>Sabethes</i>, e a pessoa que entra na mata pode ser picada. Os <b>macacos não transmitem</b> a doença para pessoas: eles adoecem e morrem como nós, e servem de <b>alerta</b> de que o vírus está circulando; matá-los é crime e atrapalha a vigilância. No <b>ciclo urbano</b>, o transmissor seria o <i>Aedes aegypti</i>; no Brasil, não há registro de febre amarela urbana desde <b>1942</b>. O vírus ataca o <b>fígado</b>, e a pele amarelada (<b>icterícia</b>) dá nome à doença. Há uma <b>vacina</b> eficaz no calendário do SUS.</p>
<div class="tab"><table><caption>Quadro (Ministério da Saúde, Guia de Vigilância em Saúde)</caption>
<thead><tr><th>Doença</th><th>Transmissão principal</th><th>Marca da doença</th><th>Vacina no SUS</th></tr></thead>
<tbody>
<tr><td>Dengue</td><td><i>Aedes aegypti</i> (urbano)</td><td>febre alta, dor atrás dos olhos; 4 sorotipos; risco de forma grave</td><td>sim, para grupos e idades definidos</td></tr>
<tr><td>Zika</td><td><i>Aedes aegypti</i>; também sexual e da mãe para o feto</td><td>microcefalia e outras malformações; Guillain-Barré</td><td>não</td></tr>
<tr><td>Chikungunya</td><td><i>Aedes aegypti</i></td><td>dor nas articulações que pode durar meses</td><td>só em alguns municípios escolhidos pelo Ministério da Saúde (fora do calendário)</td></tr>
<tr><td>Febre amarela</td><td><i>Haemagogus</i> e <i>Sabethes</i> (silvestre); <i>Aedes aegypti</i> (urbano, sem casos no Brasil desde 1942)</td><td>icterícia, lesão do fígado</td><td>sim</td></tr>
</tbody></table></div>`,
    enem: 'É um dos temas mais cobrados da Biologia no ENEM. Saiba: as quatro são <b>viroses</b>, transmitidas por <b>mosquito</b> (vetor), e a medida mais eficaz nas cidades é <b>eliminar os criadouros de água parada</b>. Antibiótico <b>não</b> trata nenhuma delas. Pegadinhas: o mosquito <b>não</b> é o causador (é o <b>vetor</b>; o causador é o vírus); o <b>macaco não transmite</b> febre amarela para pessoas; e na suspeita de dengue não se toma <b>AAS</b>. A relação <b>zika na gestação e microcefalia</b> aparece em questões sobre teratogenia.',
    links: [LK.embrio, LK.calendario, ['Cada via, sua prevenção', '#prevencao/transmissao']]
  });
}
