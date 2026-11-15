/* LAB, módulo Vírus. Cenas C (Prometeu): Replicação (retrovírus e transcriptase reversa) e Doenças (arboviroses).
   Fonte científica: docs/revisao-biologia/virus-roteiro.md (Taxon, R2 e D1, com a revisão do Sapien).
   Usa a API do motor.js (def, tx, mtx, wrapTx, circ, ell, rr, line, arrow, qarrow, cap, area, hitR, hitAt...).
   Código, desenhos e textos da equipe; sem assets nem código de terceiros. */
'use strict';
{
  // cores por significado (proposta do roteiro): capsídeo cinza-azulado, DNA violeta, RNA coral, envelope rosa,
  // espículas âmbar; o mosquito na cor da via "vetor" (verde-limão), a mesma de D1 a D4 e P2
  const RES = {
    virus: '#B9C2D3', dna: '#9A6BFF', dnaClaro: '#C9B2FF', dnaEscuro: '#6A45D8', rna: '#FF8A6B', envelope: '#F06AAE', espicula: '#F7C13B',
    receptor: '#7CC4FF', ribo: '#FFE1A6', vetor: '#9FD84A', ok: '#6BCB77', erro: '#F0605D', txt: '#E8EDF7', dim: '#9DA9C4', line: '#5B6C99'
  };
  const K = n => (typeof C !== 'undefined' && C && C[n]) || RES[n];   // paleta do motor; a reserva só vale se faltar alguma
  const COR = {
    virus: K('virus'), dna: K('dna'), dnaC: K('dnaClaro'), dnaE: K('dnaEscuro'), rna: K('rna'), env: K('envelope'), esp: K('espicula'),
    tr: K('espicula'), int: '#45C9BE', pro: '#8FD45E', ribo: K('ribo'), cd4: K('receptor'),
    vetor: K('vetor'), ok: K('ok'), erro: K('erro'), txt: K('txt'), dim: K('dim'), line: K('line'),
    mata: '#2F6B45', mataC: '#4E9A62', macaco: '#C89B6D', agua: '#5FA8E8', areia: '#D9BE86'
  };
  const PAINEL = 'rgba(19,26,43,.78)', BORDA = 'rgba(255,255,255,.14)';
  const pressBtn = (i, on) => { const b = document.querySelectorAll('#extra button')[i]; if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false'); };
  const mostraFaixa = on => { const r = $('ctlR'); if (r && r.parentNode) r.parentNode.hidden = !on; };
  const tam = (a, b) => NAR ? a : b;

  // ---------- desenhos próprios deste arquivo ----------
  // espícula: haste e cabeça âmbar, apontando para fora do centro (x0, y0)
  function espicula(x0, y0, r, ang, s, a = 1) {
    const x = x0 + Math.cos(ang) * r, y = y0 + Math.sin(ang) * r, x2 = x0 + Math.cos(ang) * (r + s), y2 = y0 + Math.sin(ang) * (r + s);
    X.save(); X.globalAlpha *= a; line(x, y, x2, y2, COR.esp, Math.max(1.2, s * .28)); circ(x2, y2, Math.max(1.4, s * .34), COR.esp); X.restore();
  }
  // RNA: fita ondulada coral entre (x1, y1) e (x2, y2)
  function fita(x1, y1, x2, y2, c, lw, amp = 2.5, ond = 9, f = 1) {
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / (L || 1), uy = (y2 - y1) / (L || 1), n = Math.max(2, Math.ceil(L * f / 3));
    X.beginPath();
    for (let i = 0; i <= n; i++) { const d = L * f * i / n, w = Math.sin(d / ond * TAU) * amp, px = x1 + ux * d - uy * w, py = y1 + uy * d + ux * w; i ? X.lineTo(px, py) : X.moveTo(px, py); }
    X.strokeStyle = c; X.lineWidth = lw; X.lineCap = 'round'; X.stroke(); X.lineCap = 'butt';
  }
  // DNA: duas fitas lado a lado com degraus (dupla-hélice simplificada)
  function dupla(x1, y1, x2, y2, c, f = 1, lw = 2) {
    const L = Math.hypot(x2 - x1, y2 - y1) * f, ux = (x2 - x1) / (Math.hypot(x2 - x1, y2 - y1) || 1), uy = (y2 - y1) / (Math.hypot(x2 - x1, y2 - y1) || 1), g = 3;
    if (L < 1) return;
    line(x1 - uy * g, y1 + ux * g, x1 + ux * L - uy * g, y1 + uy * L + ux * g, c, lw);
    line(x1 + uy * g, y1 - ux * g, x1 + ux * L + uy * g, y1 + uy * L - ux * g, c, lw);
    for (let d = 4; d < L; d += 6) line(x1 + ux * d - uy * g, y1 + uy * d + ux * g, x1 + ux * d + uy * g, y1 + uy * d - ux * g, rgba(COR.dna, .7), 1);
  }
  // HIV: envelope rosa com espículas, capsídeo em cone e duas fitas de RNA
  function hiv(x, y, r, o = {}) {
    const a = o.a == null ? 1 : o.a; if (a <= .02) return;
    X.save(); X.globalAlpha *= a;
    const ea = o.env == null ? 1 : o.env;
    if (ea > .02) {
      X.save(); X.globalAlpha *= ea;
      for (let i = 0; i < 9; i++) espicula(x, y, r, i / 9 * TAU + (o.rot || 0), r * .32);
      circ(x, y, r, rgba(COR.env, .16), COR.env, Math.max(1.5, r * .12));
      X.restore();
    }
    if (o.cap !== false) {
      const k = r * .62, ang = o.capRot || -.5;
      X.save(); X.translate(x, y); X.rotate(ang);
      X.beginPath(); X.moveTo(-k, -k * .38); X.lineTo(k, -k * .7); X.quadraticCurveTo(k * 1.18, 0, k, k * .7); X.lineTo(-k, k * .38); X.quadraticCurveTo(-k * 1.1, 0, -k, -k * .38); X.closePath();
      X.fillStyle = rgba(COR.virus, .25); X.fill(); X.strokeStyle = COR.virus; X.lineWidth = Math.max(1.2, r * .09); X.stroke();
      fita(-k * .7, -k * .14, k * .75, -k * .2, COR.rna, Math.max(1, r * .08), r * .07, r * .45);
      fita(-k * .7, k * .16, k * .75, k * .22, COR.rna, Math.max(1, r * .08), r * .07, r * .45);
      X.restore();
    }
    X.restore();
  }
  // mosquito (fêmea de Aedes): corpo escuro com listras brancas, asas e pernas; dir = 1 olha para a direita
  function mosquito(x, y, s, o = {}) {
    const a = o.a == null ? 1 : o.a; if (a <= .02) return;
    const dir = o.dir || 1, bat = Math.sin((o.t || 0) * 60) * .5 + .5;
    X.save(); X.globalAlpha *= a; X.translate(x, y); X.scale(dir * s / 20, s / 20);
    X.lineCap = 'round';
    // asas (batendo)
    X.fillStyle = 'rgba(220,232,255,.28)'; X.strokeStyle = 'rgba(220,232,255,.65)'; X.lineWidth = 1;
    X.beginPath(); X.ellipse(-1, -6 - bat * 2, 8, 3, -.5 - bat * .4, 0, TAU); X.fill(); X.stroke();
    X.beginPath(); X.ellipse(1, -5 - bat * 2, 7, 2.6, -.9 + bat * .3, 0, TAU); X.fill(); X.stroke();
    // pernas
    X.strokeStyle = o.c || COR.vetor; X.lineWidth = 1.1;
    for (const [px, qx] of [[-3, -9], [0, -2], [3, 8]]) { X.beginPath(); X.moveTo(px, 1); X.lineTo(qx * .6, 6); X.lineTo(qx, 10); X.stroke(); }
    // abdome e tórax
    X.fillStyle = '#20263A'; X.strokeStyle = o.c || COR.vetor; X.lineWidth = 1.4;
    X.beginPath(); X.ellipse(-7, 1, 7, 2.6, .15, 0, TAU); X.fill(); X.stroke();
    X.strokeStyle = '#F2F5FA'; X.lineWidth = 1.2; for (const sx of [-10, -7, -4]) { X.beginPath(); X.moveTo(sx, -1.2); X.lineTo(sx + .5, 3); X.stroke(); }
    X.fillStyle = '#20263A'; X.strokeStyle = o.c || COR.vetor; X.lineWidth = 1.4;
    X.beginPath(); X.ellipse(2, -1, 3.6, 3, 0, 0, TAU); X.fill(); X.stroke();
    X.beginPath(); X.arc(6.4, -.5, 2.1, 0, TAU); X.fill(); X.stroke();
    X.strokeStyle = o.c || COR.vetor; X.lineWidth = 1.2; X.beginPath(); X.moveTo(8, 0); X.lineTo(14, 3); X.stroke();   // probóscide
    X.restore();
  }
  // pessoa (ícone simples): cabeça e tronco
  function pessoa(x, y, s, o = {}) {
    const a = o.a == null ? 1 : o.a; if (a <= .02) return;
    const c = o.c || COR.txt; X.save(); X.globalAlpha *= a;
    circ(x, y - s * .36, s * .16, rgba(c, .25), c, 2);
    rr(x - s * .22, y - s * .16, s * .44, s * .5, s * .14, rgba(c, .2), c, 2);
    line(x - s * .1, y + s * .34, x - s * .12, y + s * .62, c, 2); line(x + s * .1, y + s * .34, x + s * .12, y + s * .62, c, 2);
    X.restore();
  }
  // macaco (bugio estilizado): corpo, cabeça e cauda enrolada
  function macaco(x, y, s, o = {}) {
    const a = o.a == null ? 1 : o.a; if (a <= .02) return;
    const c = o.c || COR.macaco, f = o.flip ? -1 : 1; X.save(); X.globalAlpha *= a; X.translate(x, y); X.scale(f * s / 40, s / 40);
    X.lineCap = 'round'; X.lineJoin = 'round';
    X.strokeStyle = c; X.lineWidth = 2.4;
    X.beginPath(); X.moveTo(-10, 4); X.bezierCurveTo(-26, 6, -28, -10, -18, -12); X.bezierCurveTo(-12, -13, -12, -5, -17, -6); X.stroke();   // cauda
    X.beginPath(); X.moveTo(-4, 6); X.lineTo(-8, 16); X.moveTo(6, 6); X.lineTo(9, 16); X.moveTo(8, -4); X.lineTo(16, -14); X.stroke();      // pernas e braço
    X.fillStyle = rgba(c, .35); X.beginPath(); X.ellipse(0, 0, 11, 8, -.2, 0, TAU); X.fill(); X.stroke();
    X.beginPath(); X.arc(11, -9, 6.5, 0, TAU); X.fill(); X.stroke();
    X.fillStyle = '#0B0F1C'; X.beginPath(); X.arc(13.5, -10, 1.3, 0, TAU); X.fill();
    X.restore();
  }
  // cartão com texto que quebra linhas; devolve a altura usada
  function cartao(x, y, w, s, o = {}) {
    const sz = o.s || tam(12, 13), lh = sz + 5, pad = 10;
    const h = wrapTx(s, 0, 0, w - pad * 2, { s: sz, lh, dry: true }) + pad * 2 - 5 + (o.tit ? lh + 2 : 0);
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
  // etapas do ciclo: início (s), legenda
  const ET2 = [
    [0, '<b>Ligação.</b> As espículas do HIV se encaixam no receptor <b>CD4</b> do linfócito T.'],
    [2.5, '<b>Fusão.</b> O envelope se funde com a membrana e o capsídeo entra no citoplasma.'],
    [4.5, '<b>Transcriptase reversa.</b> A enzima lê o RNA do vírus e monta uma fita de <b>DNA</b>: de RNA para DNA, o caminho ao contrário.'],
    [8.5, '<b>Integrase.</b> O DNA viral entra no núcleo e é costurado no cromossomo: agora é um <b>provírus</b>.'],
    [11.5, '<b>Transcrição.</b> A célula lê o provírus como se fosse um gene seu e faz RNA do vírus.'],
    [13.5, '<b>Tradução.</b> Os ribossomos da célula fabricam as proteínas do vírus numa cadeia longa.'],
    [15.5, '<b>Protease.</b> A enzima corta a cadeia de proteínas no tamanho certo para a montagem.'],
    [17.5, '<b>Montagem e brotamento.</b> Vírus novos saem levando um pedaço da membrana da célula como envelope.'],
    [21.5, 'Vírus novos vão infectar outros linfócitos. O provírus continua no cromossomo: a infecção é <b>para a vida toda</b>.']
  ];
  // remédios: nome, alvo (etapa 1, 2 ou 3), ponto onde a animação trava, cor da enzima
  const REM = [
    { k: 'tr', n: 'Inibidor da transcriptase reversa', l: ['Inibidor da', 'transcriptase', 'reversa'], alvo: 0, trava: 5.6, c: COR.tr,
      ok: 'Certo! Sem a <b>transcriptase reversa</b>, o RNA não vira DNA e nenhum vírus novo sai. Exemplos: tenofovir e o antigo AZT.' },
    { k: 'int', n: 'Inibidor da integrase', l: ['Inibidor da', 'integrase'], alvo: 1, trava: 10.4, c: COR.int,
      ok: 'Certo! Sem a <b>integrase</b>, o DNA do vírus não entra no cromossomo e não vira provírus.' },
    { k: 'pro', n: 'Inibidor da protease', l: ['Inibidor da', 'protease'], alvo: 2, trava: 16.1, c: COR.pro,
      ok: 'Certo! Sem a <b>protease</b>, a cadeia de proteínas não é cortada e os vírus novos não se montam direito.' }
  ];
  const ALVO = ['RNA vira DNA', 'DNA entra no cromossomo', 'proteínas são cortadas'];

  function geoR2() {
    const A = area(), band = tam(54, 58);
    let tray, R;
    if (NAR) {
      const th = 54; tray = { x0: A.x0, x1: A.x1, y0: A.y1 - th, y1: A.y1, col: false };
      R = { x0: A.x0, x1: A.x1, y0: A.y0 + band, y1: A.y1 - th - 10 };
    } else {
      const tw0 = Math.min(210, A.w * .26); tray = { x0: A.x1 - tw0, x1: A.x1, y0: A.y0 + band, y1: A.y1, col: true };
      R = { x0: A.x0, x1: A.x1 - tw0 - 16, y0: A.y0 + band, y1: A.y1 };
    }
    const cx = (R.x0 + R.x1) / 2 + tam(8, 22), cy = (R.y0 + R.y1) / 2;
    const rx = Math.min((R.x1 - R.x0) / 2 - tam(18, 40), (R.y1 - R.y0) * .78), ry = Math.min((R.y1 - R.y0) / 2 - tam(10, 14), rx * .82);
    const nuc = { x: cx + rx * .36, y: cy + ry * .08, rx: rx * .4, ry: ry * .52 };
    const P = [
      { x: cx - rx * .46, y: cy - ry * .2 },            // 1: transcriptase reversa
      { x: nuc.x, y: nuc.y },                            // 2: integração no cromossomo
      { x: cx - rx * .32, y: cy + ry * .5 }              // 3: tradução e protease
    ];
    const aIn = PI + .42, aOut = -PI / 2 + .12;
    const pm = a => [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
    // comprimidos na bandeja
    const pills = REM.map((m, i) => {
      if (tray.col) { const h = 62, g = 12, y0 = tray.y0 + 26 + i * (h + g); return { x: tray.x0, y: y0, w: tray.x1 - tray.x0, h }; }
      const g = 6, w = (tray.x1 - tray.x0 - g * 2) / 3; return { x: tray.x0 + i * (w + g), y: tray.y0, w, h: tray.y1 - tray.y0 };
    });
    return { A, R, cx, cy, rx, ry, nuc, P, aIn, aOut, pm, tray, pills, band };
  }
  // membrana com um calombo (brotamento) no ângulo ab
  function membrana(g, bump, ab) {
    const n = 140; X.beginPath();
    for (let i = 0; i <= n; i++) {
      const a = i / n * TAU; let d = a - ab; d = Math.atan2(Math.sin(d), Math.cos(d));
      const k = 1 + bump * Math.exp(-(d * d) / (2 * .09 * .09)) * .16;
      const px = g.cx + Math.cos(a) * g.rx * k, py = g.cy + Math.sin(a) * g.ry * k; i ? X.lineTo(px, py) : X.moveTo(px, py);
    }
    X.closePath(); X.fillStyle = 'rgba(240,106,174,.07)'; X.fill(); X.strokeStyle = COR.env; X.lineWidth = tam(3, 4); X.stroke();
  }
  // cromossomo no núcleo, com o provírus (f = 0..1: abertura da fenda e entrada)
  function cromossomo(g, prov, fenda) {
    const n = g.nuc, x0 = n.x - n.rx * .78, x1 = n.x + n.rx * .78, gap = n.rx * .36 * fenda, w = n.ry * .12;
    const yv = x => n.y + Math.sin((x - x0) / (n.rx * .22)) * w;
    const tr = (a, b, c, lw) => { X.beginPath(); for (let x = a; x <= b; x += 2) { const y = yv(x); x === a ? X.moveTo(x, y) : X.lineTo(x, y); } X.strokeStyle = c; X.lineWidth = lw; X.lineCap = 'round'; X.stroke(); X.lineCap = 'butt'; };
    tr(x0, n.x - gap / 2, COR.dnaE, tam(4, 5)); tr(n.x + gap / 2, x1, COR.dnaE, tam(4, 5));
    if (prov > .02) { X.save(); X.globalAlpha *= prov; tr(n.x - gap / 2, n.x + gap / 2, COR.dnaC, tam(5, 6)); X.restore(); }
  }
  // ribossomos (bolinhas aos pares)
  function ribos(x, y, s) { for (const [dx, dy] of [[-1.4, 0], [0, .8], [1.4, -.2], [-.4, -1.2]]) { circ(x + dx * s, y + dy * s, s * .55, rgba(COR.ribo, .35), COR.ribo, 1.2); circ(x + dx * s + s * .35, y + dy * s - s * .35, s * .35, rgba(COR.ribo, .35), COR.ribo, 1); } }
  function enzima(x, y, r, c, a = 1) { if (a <= .02) return; X.save(); X.globalAlpha *= a; X.beginPath(); X.arc(x, y, r, .35, TAU - .35); X.lineTo(x, y); X.closePath(); X.fillStyle = c; X.fill(); X.strokeStyle = '#0B0F1C'; X.lineWidth = 1; X.stroke(); X.restore(); }
  function comprimido(x, y, w, h, m, o = {}) {
    const a = o.a == null ? 1 : o.a; X.save(); X.globalAlpha *= a;
    rr(x, y, w, h, Math.min(h / 2, 18), o.f || rgba(m.c, .18), m.c, o.sel ? 3 : 1.6);
    const sz = tam(11.5, 12.5), lh = sz + 2, ls = (NAR || o.mini) ? m.l : [m.l[0], m.l.slice(1).join(' ')];
    const yy = y + h / 2 - (ls.length - 1) * lh / 2;
    ls.forEach((s, i) => tx(s, x + w / 2, yy + i * lh, { s: sz, w: 700, c: '#fff', bg: false }));
    X.restore();
  }
  // posições ao longo do ciclo
  function dogma(g, t) {
    const A = g.A, y = A.y0 + tam(36, 38), sx = tam(Math.min(100, A.w * .3), 120), x0 = (g.R.x0 + g.R.x1) / 2 - sx;
    const xs = [x0, x0 + sx, x0 + 2 * sx], lb = ['DNA', 'RNA', 'proteína'], cs = [COR.dna, COR.rna, COR.virus], sz = tam(13, 14);
    const hl = t >= 4.5 && t < 8.5;
    lb.forEach((s, i) => tok(xs[i], y, s, cs[i], { s: sz }));
    const hw = i => mtw(lb[i], sz, 700) / 2 + 10;
    arrow(xs[0] + hw(0), y, xs[1] - hw(1) - 3, y, COR.dim, 1.6);
    arrow(xs[1] + hw(1), y, xs[2] - hw(2) - 3, y, COR.dim, 1.6);
    const ya = y - tam(12, 13);
    X.save(); X.globalAlpha *= hl ? 1 : .75;
    qarrow(xs[1] - 4, ya, (xs[0] + xs[1]) / 2, ya - tam(16, 20), xs[0] + 6, ya + 1, COR.tr, hl ? 3 : 2);
    tx('transcriptase reversa', (xs[0] + xs[1]) / 2, ya - tam(20, 25), { s: tam(12, 13), w: 700, c: COR.tr });
    X.restore();
  }

  function cicloR2(t, S, g) {
    // trava no primeiro remédio colocado no lugar certo
    let trava = null; for (const m of REM) if (S.pos[m.k] === m.alvo && (trava == null || m.trava < trava.trava)) trava = m;
    const p0 = fr(t / T2) * T2, p = trava ? Math.min(p0, trava.trava) : p0;
    if (trava && p0 >= trava.trava) S.preso = true;
    if (p >= 11.5 && !trava) S.prov = true;
    const { cx, cy, rx, ry, nuc, P, aIn, aOut, pm } = g, vr = tam(13, 17);
    dogma(g, p);
    // brotamento: calombo na membrana
    const b1 = seg(p, 18.6, 19.6) * (1 - seg(p, 19.9, 20.3)), b2 = seg(p, 20.0, 20.9) * (1 - seg(p, 21.2, 21.6));
    membrana(g, Math.max(b1, b2) * 2.2, aOut);
    // núcleo
    ell(nuc.x, nuc.y, nuc.rx, nuc.ry, 0, 'rgba(154,107,255,.12)', rgba(COR.dna, .8), 2);
    const fenda = seg(p, 10, 10.7), entra = seg(p, 10.5, 11.3);
    cromossomo(g, Math.max(S.prov ? 1 : 0, entra), Math.max(S.prov ? 1 : 0, fenda));
    // receptores CD4 perto da entrada
    for (const da of [-.22, 0, .22]) {
      const a = aIn + da, [mx, my] = pm(a), ux = Math.cos(a), uy = Math.sin(a);
      line(mx, my, mx + ux * 9, my + uy * 9, COR.cd4, 2); circ(mx + ux * 11, my + uy * 11, 3.2, COR.cd4);
    }
    {
      const [mx, my] = pm(aIn + .38); if (LB) tx('CD4', mx + Math.cos(aIn + .38) * 22, my + Math.sin(aIn + .38) * 22, { s: 12, w: 700, c: COR.cd4 });
    }
    // ribossomos fixos
    ribos(P[2].x - tam(20, 30), P[2].y + 2, tam(4, 5));
    // alvos dos remédios: círculos tracejados numerados
    const alvR = tam(24, 30);
    g.alvos = P.map((q, i) => ({ x: i === 1 ? q.x - nuc.rx * .1 : q.x, y: i === 1 ? q.y - nuc.ry * .5 : q.y + (i === 0 ? 0 : 0), r: alvR }));
    g.alvos.forEach((q, i) => {
      const m = REM.find(z => z.alvo === i), on = S.pos[m.k] === i, ativo = S.sel != null || S.arr;
      X.save(); X.globalAlpha *= on ? 1 : ativo ? .95 : .55;
      circ(q.x, q.y, q.r, on ? rgba(m.c, .12) : null, on ? m.c : 'rgba(233,239,250,.7)', on ? 2.5 : 1.4);
      if (!on) { X.setLineDash([4, 4]); circ(q.x, q.y, q.r + 4, null, ativo ? COR.esp : 'rgba(233,239,250,.35)', 1); X.setLineDash([]); }
      X.restore();
      hitC(q.x, q.y, q.r + 6, 'alvo:' + i);
    });
    // HIV chegando e fusão
    const [ex, ey] = pm(aIn), ox = Math.cos(aIn), oy = Math.sin(aIn), dist = tam(48, 70);
    if (p < 4.6) {
      const k = ss(seg(p, 0, 2.3)), fx = ex + ox * (vr + 14), fy = ey + oy * (vr + 14);
      if (p < 2.5) hiv(lerp(ex + ox * dist * 1.6, fx, k), lerp(ey + oy * dist * 1.6, fy, k), vr, { rot: p * .3 });
      else {
        const f = ss(seg(p, 2.5, 4.5));
        hiv(lerp(fx, P[0].x, f), lerp(fy, P[0].y, f), vr, { env: 1 - seg(p, 2.5, 3.3), rot: .75, capRot: -.5 + f * .5 });
        if (p < 3.4) { X.save(); X.globalAlpha *= 1 - seg(p, 2.9, 3.4); circ(ex, ey, vr * .9, rgba(COR.env, .25)); X.restore(); }
      }
    }
    // transcriptase reversa: RNA coral lido, DNA violeta montado
    const Lr = tam(rx * .5, rx * .44), rx0 = P[0].x - Lr / 2, rx1 = P[0].x + Lr / 2, ry0 = P[0].y - 5;
    if (p >= 4.5 && p < 9.2) {
      const cap0 = 1 - seg(p, 4.5, 5.2);
      if (cap0 > .02) hiv(P[0].x, P[0].y, vr, { env: 0, a: cap0, capRot: 0 });
      const ra = seg(p, 4.6, 5.0) * (1 - seg(p, 8.2, 8.8));
      const f = seg(p, 5.0, 8.2);
      if (ra > .02) { X.save(); X.globalAlpha *= ra; fita(rx0, ry0, rx1, ry0, COR.rna, 2.4, 2.2, 8); X.restore(); }
      if (p < 8.5) { dupla(rx0, ry0 + 9, rx1, ry0 + 9, COR.dna, f, 2); if (p >= 4.8) enzima(lerp(rx0, rx1, f), ry0 + 4, tam(6, 7), COR.tr, seg(p, 4.8, 5.1)); }
      if (LB && p < 8.4 && p >= 5) tx('transcriptase reversa', P[0].x, ry0 - tam(16, 18), { s: 12, w: 700, c: COR.tr });
    }
    // DNA vai ao núcleo e a integrase costura
    if (p >= 8.5 && p < 11.3) {
      const k = ss(seg(p, 8.5, 10.1)), q = g.alvos[1], x = lerp(P[0].x, nuc.x, k), y = lerp(ry0 + 9, nuc.y, k), L = Lr * lerp(1, .36, k);
      X.save(); X.globalAlpha *= 1 - seg(p, 10.6, 11.3); dupla(x - L / 2, y, x + L / 2, y, COR.dna, 1, 2); X.restore();
      if (p >= 9.8) {
        const ia = seg(p, 9.8, 10.1) * (1 - seg(p, 11, 11.3));
        enzima(nuc.x - nuc.rx * .2 + Math.sin(p * 9) * 3, nuc.y - 9, tam(6, 7), COR.int, ia);
        if (LB) { X.save(); X.globalAlpha *= ia; tx('integrase', q.x, q.y - q.r - 10, { s: 12, w: 700, c: COR.int }); X.restore(); }
      }
    }
    if (S.prov && LB && (p < 4.5 || p >= 11.3)) tx('provírus', nuc.x, nuc.y + nuc.ry * .38, { s: 12, w: 700, c: COR.dnaC });
    // transcrição: RNAs saem do núcleo até os ribossomos
    if (p >= 11.5 && p < 15) {
      for (let i = 0; i < 3; i++) {
        const k = ss(seg(p, 11.6 + i * .4, 13.2 + i * .4)), a = 1 - seg(p, 14.2, 15);
        const sx = nuc.x - nuc.rx * .1, sy = nuc.y + 4, qx = lerp(sx, P[2].x + 10 - i * 12, k), qy = lerp(sy, P[2].y - 8 + i * 6, k);
        X.save(); X.globalAlpha *= a * seg(p, 11.6 + i * .4, 11.9 + i * .4); fita(qx - 12, qy, qx + 12, qy, COR.rna, 2, 1.8, 7); X.restore();
      }
    }
    // tradução: cadeia longa de proteínas; protease corta
    const nB = 9, cb = tam(7, 8.5), cx0 = P[2].x - nB * cb / 2 + tam(12, 18), cyb = P[2].y + tam(4, 6);
    if (p >= 13.5 && p < 18.4) {
      const k = seg(p, 13.6, 15.4), corte = seg(p, 15.7, 17.3), a = 1 - seg(p, 17.9, 18.4);
      X.save(); X.globalAlpha *= a;
      for (let i = 0; i < Math.round(nB * k); i++) {
        const gi = Math.floor(i / 3), sep = corte * gi * tam(5, 7);
        circ(cx0 + i * cb + sep - corte * tam(5, 7), cyb, cb * .48, rgba(COR.virus, .45), COR.virus, 1.2);
      }
      if (p >= 15.5 && p < 17.6) { const ex2 = lerp(cx0, cx0 + nB * cb + tam(10, 14), seg(p, 15.6, 17.3)); enzima(ex2, cyb - cb, tam(6, 7), COR.pro); if (LB) tx('protease', ex2, cyb - cb - 15, { s: 12, w: 700, c: COR.pro }); }
      X.restore();
    }
    // montagem e brotamento: dois vírus novos saem pela membrana
    const [bx, by] = pm(aOut), ux = Math.cos(aOut), uy = Math.sin(aOut);
    for (let j = 0; j < 2; j++) {
      const t0 = 17.6 + j * 1.4, mv = ss(seg(p, t0, t0 + 1.2)), sai = ss(seg(p, t0 + 1.3, t0 + 2.4)), vai = seg(p, t0 + 2.4, T2);
      if (p < t0) continue;
      const ix = lerp(P[2].x, bx - ux * vr * 1.3, mv), iy = lerp(P[2].y, by - uy * vr * 1.3, mv);
      const x = ix + ux * (vr * 2.4 * sai + vai * tam(30, 60)) + (j ? 1 : -1) * vai * tam(10, 26), y = iy + uy * (vr * 2.4 * sai + vai * tam(30, 60));
      hiv(x, y, vr * lerp(.8, 1, mv), { env: seg(p, t0 + 1.4, t0 + 2.2), a: 1 - seg(p, T2 - .8, T2) * .9, rot: j, capRot: -1.2 });
    }
    // remédio colocado: marca de "travado" na etapa
    for (const m of REM) if (S.pos[m.k] === m.alvo) {
      const q = g.alvos[m.alvo]; comprimido(q.x - tam(30, 36), q.y + q.r + 4, tam(60, 72), 20, { c: m.c, l: [m.l[m.l.length - 1]] }, { mini: true });
    }
    // legenda do passo
    let e = ET2[0][1]; for (const [s, c] of ET2) if (p >= s) e = c;
    if (trava && p0 >= trava.trava) e = `<b>Travado.</b> ${trava.n}: a etapa "${ALVO[trava.alvo]}" parou e <b>nenhum vírus novo sai</b> da célula.`;
    else if (S.msg && performance.now() - S.msgT < 6000) e = S.msg;
    cap(e);
  }

  function bandejaR2(g, S) {
    const { tray, pills } = g;
    if (tray.col) {
      tx('Onde o remédio age?', (tray.x0 + tray.x1) / 2, tray.y0 + 6, { s: 13, w: 700, c: COR.txt });
      wrapTx('Arraste cada comprimido até a etapa que ele bloqueia, ou toque no comprimido e depois na etapa.', tray.x0, pills[2].y + pills[2].h + 22, tray.x1 - tray.x0, { s: 12, lh: 16, a: 'left', c: COR.dim });
    }
    REM.forEach((m, i) => {
      const r = pills[i], usado = S.pos[m.k] === m.alvo, arr = S.arr && S.arr.k === m.k;
      if (usado) { rr(r.x, r.y, r.w, r.h, Math.min(r.h / 2, 18), null, 'rgba(233,239,250,.25)', 1); tx('no lugar', r.x + r.w / 2, r.y + r.h / 2, { s: 12, c: COR.dim, bg: false }); return; }
      if (!arr) comprimido(r.x, r.y, r.w, r.h, m, { sel: S.sel === m.k });
      hitR(r.x, r.y, r.w, r.h, 'rem:' + m.k);
    });
    // rótulos das etapas (nome do processo, não da enzima) junto aos alvos
    if (LB) g.alvos.forEach((q, i) => {
      if (S.pos[REM.find(z => z.alvo === i).k] === i) return;
      const lado = i === 1 ? 0 : -1;
      tx(`${i + 1}. ${ALVO[i]}`, q.x + lado * 0, q.y - q.r - 9, { s: tam(11.5, 12), w: 700, c: COR.txt });
    });
    if (S.arr) { const m = REM.find(z => z.k === S.arr.k), w = tam(104, 150), h = tam(48, 44); comprimido(S.arr.x - w / 2, S.arr.y - h / 2, w, h, m, { sel: true, a: .92 }); }
  }

  // população de vírus: um remédio sozinho seleciona o mutante resistente; três juntos barram
  function populacao(t, S, g) {
    const A = g.A, tres = S.modo === 'tres', T = 16, p = fr(t / T) * T;
    const top = A.y0 + tam(8, 10), box = { x0: A.x0 + tam(4, 30), x1: A.x1 - tam(4, 30), y0: top + tam(64, 56), y1: A.y1 - tam(70, 60) };
    title(tres ? 'Os três remédios juntos' : 'Só um remédio', (A.x0 + A.x1) / 2, top + 6, A.w - 20, { s: tam(15, 18) });
    // comprimidos usados
    const ms = tres ? REM : [REM[0]], pw = tam(Math.min(108, (A.w - 24) / 3), 150), ph = tam(46, 40), gx = 8;
    const tot = ms.length * pw + (ms.length - 1) * gx, ap = seg(p, 3, 4);
    ms.forEach((m, i) => comprimido((A.x0 + A.x1) / 2 - tot / 2 + i * (pw + gx), top + 20, pw, ph, m, { a: .35 + .65 * ap }));
    panel(box.x0, box.y0, box.x1 - box.x0, box.y1 - box.y0, { f: 'rgba(240,106,174,.05)', s: rgba(COR.env, .5) });
    // vírus selvagens (cinza) e mutantes (anel coral)
    const R = rng(7), n = 46, vr = tam(7, 9), pts = [];
    for (let i = 0; i < 90; i++) pts.push([lerp(box.x0 + vr * 2, box.x1 - vr * 2, R()), lerp(box.y0 + vr * 2, box.y1 - vr * 2, R())]);
    const morre = seg(p, 4, 6);
    let vivos = 0;
    for (let i = 0; i < n; i++) {
      const [x, y] = pts[i], mut = i === 5, a = mut ? (tres ? 1 - seg(p, 6, 8) : 1) : 1 - morre;
      if (a <= .02) continue; vivos++;
      const wob = Math.sin(t * 2 + i) * 1.5;
      hiv(x + wob, y, vr, { a, rot: i, capRot: i });
      if (mut) circ(x + wob, y, vr * 1.9, null, COR.rna, 2);
    }
    // o mutante resistente se multiplica (só com um remédio)
    if (!tres) {
      const ger = Math.floor(cl((p - 6.5) / 1.3, 0, 5.99)), k = p < 6.5 ? 0 : Math.pow(2, ger + 1) - 1;
      for (let i = 0; i < Math.min(k, 44); i++) {
        const [x, y] = pts[n + i], a = seg(p, 6.5 + Math.floor(Math.log2(i + 2) - 1) * 1.3, 6.9 + Math.floor(Math.log2(i + 2) - 1) * 1.3) * (1 - seg(p, T - .6, T));
        if (a <= .02) continue; vivos++;
        hiv(x, y, vr, { a, rot: i, capRot: i }); circ(x, y, vr * 1.9, null, COR.rna, 2);
      }
    }
    const yL = box.y1 + tam(16, 18);
    circ(box.x0 + 10, yL, vr * .9, null, COR.rna, 2); mtx('mutante resistente ao inibidor da transcriptase reversa', box.x0 + 24, yL, { s: tam(11.5, 12), a: 'left', c: COR.dim });
    tx(`vírus na amostra: ${vivos}`, box.x1 - 6, box.y0 - 10, { s: 12, w: 700, a: 'right', c: COR.txt });
    let e;
    if (p < 3) e = 'Na pessoa, o HIV muda muito: a transcriptase reversa <b>erra</b> e não corrige. Alguns vírus nascem <b>mutantes</b>.';
    else if (p < 6.2) e = tres ? 'Os três remédios agem ao mesmo tempo, cada um numa enzima diferente.' : 'O remédio barra os vírus comuns, mas não o <b>mutante resistente</b>.';
    else e = tres ? 'O mutante escapa de um remédio, mas é barrado pelos outros dois. Escapar dos três ao mesmo tempo é <b>muito mais difícil</b>: por isso o tratamento usa o "coquetel".'
      : 'O mutante resistente se multiplica e toma o lugar dos outros: o remédio sozinho <b>deixa de funcionar</b>.';
    cap(e);
  }

  function soltaR2(S, k, alvo) {
    const m = REM.find(z => z.k === k); S.sel = null;
    if (alvo == null) return;
    if (m.alvo === alvo) { S.pos[k] = alvo; S.msg = m.ok; }
    else S.msg = `Esse remédio não age aí. O ${m.n.toLowerCase()} bloqueia a etapa da enzima que dá nome a ele. Tente outra etapa.`;
    S.msgT = performance.now();
    if (REM.every(z => S.pos[z.k] === z.alvo)) { S.msg = 'Os três remédios no lugar certo. Agora veja os botões <b>Só um remédio</b> e <b>Os três juntos</b>.'; S.msgT = performance.now(); }
  }

  def('replicacao', 'retrovirus', {
    t: 'Retrovírus e transcriptase reversa',
    s: 'de RNA para DNA, o caminho ao contrário',
    loc: 'Linfócito T em corte, infectado pelo HIV',
    locNota: 'Desenho esquemático, fora de escala',
    alt: 'Um linfócito T em corte. O HIV se prende ao receptor CD4, funde o envelope com a membrana e solta o capsídeo; a transcriptase reversa lê o RNA do vírus e monta DNA, que entra no núcleo e é costurado no cromossomo pela integrase, virando provírus. A célula faz RNA e proteínas do vírus, a protease corta as proteínas e vírus novos brotam. No alto, o dogma central com uma seta de RNA para DNA marcada transcriptase reversa. Três comprimidos podem ser levados até a etapa que cada um bloqueia',
    still: 6.5,
    init(S) { if (!S.pos) { S.pos = {}; S.modo = 'ciclo'; S.sel = null; S.arr = null; S.msg = ''; S.msgT = 0; S.prov = false; } },
    extra: [
      { t: 'Ciclo do HIV', on(S) { S.modo = 'ciclo'; S.ph = 0; }, pressed: S => S.modo === 'ciclo' },
      { t: 'Só um remédio', on(S) { S.modo = S.modo === 'um' ? 'ciclo' : 'um'; S.ph = 0; }, pressed: S => S.modo === 'um' },
      { t: 'Os três juntos', on(S) { S.modo = S.modo === 'tres' ? 'ciclo' : 'tres'; S.ph = 0; }, pressed: S => S.modo === 'tres' }
    ],
    grab(x, y, S) {
      if (S.modo !== 'ciclo') return false;
      const id = hitAt(x, y); if (!id || !id.startsWith('rem:')) return false;
      S.arr = { k: id.slice(4), x, y, x0: x, y0: y }; return true;
    },
    grabMove(x, y, S) { if (S.arr) { S.arr.x = x; S.arr.y = y; } },
    grabEnd(x, y, S) {
      const a = S.arr; S.arr = null; if (!a) return;
      if (Math.hypot(x - a.x0, y - a.y0) < 8) { S.sel = S.sel === a.k ? null : a.k; return; }   // clique sem arrastar: seleciona
      const g = S.g; let alvo = null;
      if (g && g.alvos) g.alvos.forEach((q, i) => { if (Math.hypot(x - q.x, y - q.y) <= q.r + 14) alvo = i; });
      if (alvo == null) { S.sel = null; return; }
      soltaR2(S, a.k, alvo);
    },
    tap(x, y, S) {
      if (S.modo !== 'ciclo') return;
      const id = hitAt(x, y); if (!id) { S.sel = null; return; }
      if (id.startsWith('rem:')) { const k = id.slice(4); S.sel = S.sel === k ? null : k; return; }
      if (id.startsWith('alvo:')) { if (S.sel) soltaR2(S, S.sel, +id.slice(5)); else { S.msg = 'Escolha primeiro um comprimido e depois toque na etapa que ele bloqueia.'; S.msgT = performance.now(); } }
    },
    draw(t, S) {
      this.init(S); const g = geoR2(); S.g = g;
      if (S.modo === 'ciclo') { cicloR2(t, S, g); bandejaR2(g, S); }
      else populacao(t, S, g);
    },
    d: `<p>Na célula, a informação genética costuma seguir um caminho: o <b>DNA</b> é transcrito em <b>RNA</b>, e o RNA é traduzido em <b>proteína</b>. Os <b>retrovírus</b> fazem parte do caminho ao contrário (<i>retro</i> = para trás). Seu material genético é <b>RNA</b>, mas, logo depois de entrar na célula, uma enzima que o vírus traz dentro do capsídeo, a <b>transcriptase reversa</b>, usa esse RNA como molde para fabricar <b>DNA</b>. Em seguida, outra enzima viral, a <b>integrase</b>, insere esse DNA no <b>cromossomo da célula</b>, onde ele passa a se chamar <b>provírus</b>. A partir daí, a célula transcreve os genes do vírus como se fossem seus, e produz RNA e proteínas para novos vírus; uma terceira enzima viral, a <b>protease</b>, corta as proteínas no tamanho certo para a montagem. A transcriptase reversa foi descoberta em <b>1970</b>, ao mesmo tempo, por Howard <b>Temin</b> e David <b>Baltimore</b> (Nobel de 1975). O retrovírus mais conhecido é o <b>HIV</b>.</p>
<p>Três consequências caem muito em prova. Primeira: como o provírus fica no DNA da célula, a infecção pelo HIV é, até hoje, <b>para a vida toda</b>: os remédios controlam o vírus, mas o provírus continua nas células "escondidas". Segunda: a transcriptase reversa <b>erra muito</b> e não corrige os erros, por isso o HIV muda depressa dentro da própria pessoa, o que favorece a <b>resistência a medicamentos</b> e dificulta uma vacina. Por isso o tratamento usa vários remédios juntos (o "coquetel"). Terceira: os remédios <b>antirretrovirais</b> atacam justamente essas enzimas, que a célula humana não tem: há inibidores da <b>transcriptase reversa</b> (como o tenofovir e o antigo AZT), da <b>integrase</b> e da <b>protease</b>.</p>
<p>Atenção: o <b>SARS-CoV-2 não é retrovírus</b> e não tem transcriptase reversa; ele copia RNA em RNA no citoplasma e não entra no núcleo. A transcriptase reversa também virou ferramenta de laboratório: o exame <b>RT-PCR</b> da covid-19 começa transformando o RNA do vírus em DNA com ela.</p>
<p>Na animação, leve cada comprimido até a etapa que ele bloqueia: a etapa trava e nenhum vírus novo sai. Depois, compare <b>Só um remédio</b> com <b>Os três juntos</b>.</p>`,
    enem: '<b>Retrovírus</b> = vírus de <b>RNA</b> que usa a <b>transcriptase reversa</b> para fazer <b>DNA</b> a partir do RNA, e integra esse DNA no genoma da célula (<b>provírus</b>). É a exceção mais famosa ao "DNA faz RNA, que faz proteína". A prova também cobra por que o tratamento do HIV usa <b>vários antirretrovirais</b>: a alta taxa de <b>mutação</b> gera variantes resistentes a um remédio isolado. Pegadinha: o SARS-CoV-2 e o vírus da gripe são vírus de RNA, mas <b>não</b> são retrovírus.',
    links: [LK.dnarna, ['HIV e aids', '#doencas/hiv']]
  });

  // =====================================================================================
  // D1 ARBOVIROSES: DENGUE, ZIKA, CHIKUNGUNYA E FEBRE AMARELA
  // =====================================================================================
  const CRI = [
    { k: 'calha', n: 'calha entupida', feito: 'Calha limpa: as folhas saíram e a água escorre.' },
    { k: 'caixa', n: "caixa-d'água aberta", feito: "Caixa-d'água tampada: o mosquito não entra para pôr ovos." },
    { k: 'pneu', n: 'pneu velho', feito: 'Pneu guardado em lugar coberto, sem água dentro.' },
    { k: 'prato', n: 'pratinho de vaso', feito: 'Areia no pratinho do vaso: a água não fica parada.' },
    { k: 'garrafa', n: 'garrafa', feito: 'Garrafa virada de boca para baixo.' }
  ];
  const MOSQ_POR = 8;
  const FICHAS = [
    { s: 'Febre alta, dor atrás dos olhos, dor no corpo e manchas na pele.', d: 'dengue' },
    { s: 'Gestante teve manchas na pele; o bebê nasceu com microcefalia.', d: 'zika' },
    { s: 'Dor forte nas articulações há três meses, depois de febre.', d: 'chik' },
    { s: 'Pele e olhos amarelados depois de acampar na mata.', d: 'fa' }
  ];
  const DOENCAS = [
    { k: 'dengue', n: 'Dengue', dica: 'Dengue: febre alta, dor atrás dos olhos e manchas na pele.' },
    { k: 'zika', n: 'Zika', dica: 'Zika: na gestante, o vírus atravessa a placenta e pode causar microcefalia.' },
    { k: 'chik', n: 'Chikungunya', dica: 'Chikungunya: dor forte nas articulações, que pode durar meses.' },
    { k: 'fa', n: 'Febre amarela', dica: 'Febre amarela: ataca o fígado e deixa a pele amarelada (icterícia).' }
  ];

  // ----- desenhos dos criadouros (com e sem água parada) -----
  function aguaBrilho(x, y, w) { line(x - w * .3, y, x + w * .1, y, 'rgba(255,255,255,.5)', 1.2); }
  function dCalha(r, ok) {   // r = área da calha
    rr(r.x, r.y, r.w, r.h, 3, '#2A3350', '#8E9BB8', 1.6);
    if (!ok) { rr(r.x + 3, r.y + r.h * .35, r.w - 6, r.h * .55, 2, rgba(COR.agua, .75)); for (let i = 0; i < 6; i++) ell(r.x + 8 + i * (r.w - 16) / 5, r.y + r.h * .35, 5, 2.4, i, '#8C7A3C'); aguaBrilho(r.x + r.w * .5, r.y + r.h * .55, r.w * .4); }
    line(r.x + r.w - 6, r.y + r.h, r.x + r.w - 6, r.y + r.h + 16, '#8E9BB8', 3);
    if (ok) { X.save(); X.setLineDash([2, 4]); line(r.x + r.w - 6, r.y + r.h + 18, r.x + r.w - 6, r.y + r.h + 26, rgba(COR.agua, .8), 2); X.restore(); }
  }
  function dCaixa(x, y, w, h, ok) {   // x, y = topo esquerdo do cilindro
    line(x + w * .15, y + h, x + w * .1, y + h + h * .7, '#7C879F', 3); line(x + w * .85, y + h, x + w * .9, y + h + h * .7, '#7C879F', 3);
    line(x + w * .12, y + h + h * .35, x + w * .88, y + h + h * .35, '#7C879F', 2);
    X.beginPath(); X.moveTo(x, y); X.lineTo(x + w * .06, y + h); X.lineTo(x + w * .94, y + h); X.lineTo(x + w, y); X.closePath(); X.fillStyle = '#3B5E8C'; X.fill(); X.strokeStyle = '#8FB4E6'; X.lineWidth = 1.6; X.stroke();
    if (ok) { ell(x + w / 2, y, w / 2 + 3, h * .12, 0, '#4E73A6', '#8FB4E6', 1.6); ell(x + w / 2, y - h * .1, w * .12, h * .06, 0, '#8FB4E6'); }
    else { ell(x + w / 2, y, w / 2, h * .12, 0, rgba(COR.agua, .85), '#8FB4E6', 1.6); aguaBrilho(x + w / 2, y, w * .5); }
  }
  function dPneu(x, y, r, ok, t) {   // centro do pneu
    if (ok) {   // guardado: pneu em pé sob um telhadinho
      shape([[x - r * 1.5, y - r * 1.25], [x, y - r * 1.75], [x + r * 1.5, y - r * 1.25]], '#3A425A', '#8E9BB8', 1.4);
      line(x - r * 1.3, y - r * 1.3, x - r * 1.3, y + r, '#8E9BB8', 2); line(x + r * 1.3, y - r * 1.3, x + r * 1.3, y + r, '#8E9BB8', 2);
    }
    ell(x, y, r, r * .95, 0, '#262A33', '#5E6575', r * .35);
    ell(x, y, r * .5, r * .47, 0, '#0E1220', '#3E4454', 1.5);
    if (!ok) { X.save(); X.beginPath(); X.ellipse(x, y, r * .5, r * .47, 0, 0, TAU); X.clip(); rr(x - r * .5, y + r * .12, r, r * .4, 0, rgba(COR.agua, .8)); X.restore(); }
  }
  function dPrato(x, y, s, ok) {   // base do vaso em (x, y)
    shape([[x - s * .55, y - s], [x + s * .55, y - s], [x + s * .4, y - s * .22], [x - s * .4, y - s * .22]], '#B0643E', '#D98C62', 1.5);
    for (const [dx, h] of [[-.2, .55], [0, .75], [.22, .5]]) { line(x + dx * s, y - s, x + dx * s * 1.6, y - s - h * s, '#6BCB77', 2.2); ell(x + dx * s * 1.6, y - s - h * s, s * .12, s * .06, dx * 4, '#6BCB77'); }
    ell(x, y - s * .16, s * .7, s * .16, 0, ok ? COR.areia : '#8A4A2E', '#D98C62', 1.5);
    if (!ok) { ell(x, y - s * .18, s * .56, s * .09, 0, rgba(COR.agua, .85)); aguaBrilho(x, y - s * .18, s * .5); }
    else for (let i = 0; i < 7; i++) circ(x - s * .45 + i * s * .15, y - s * .18 + (i % 2) * 2 - 1, 1.2, '#A88A54');
  }
  function dGarrafa(x, y, s, ok) {   // base em (x, y)
    X.save(); X.translate(x, y - s * .55); if (ok) X.rotate(PI); X.translate(0, -0);
    const h = s * 1.1, w = s * .36;
    X.beginPath(); X.moveTo(-w / 2, h / 2); X.lineTo(-w / 2, -h * .05); X.quadraticCurveTo(-w / 2, -h * .25, -w * .2, -h * .32); X.lineTo(-w * .2, -h / 2); X.lineTo(w * .2, -h / 2); X.lineTo(w * .2, -h * .32); X.quadraticCurveTo(w / 2, -h * .25, w / 2, -h * .05); X.lineTo(w / 2, h / 2); X.closePath();
    X.fillStyle = 'rgba(120,200,140,.22)'; X.fill(); X.strokeStyle = '#8FD4A0'; X.lineWidth = 1.6; X.stroke();
    if (!ok) { X.save(); X.clip(); rr(-w / 2, h * .1, w, h * .4, 0, rgba(COR.agua, .75)); X.restore(); }
    X.restore();
  }
  // ----- geometria do quintal -----
  function geoQuintal(A, y0) {
    const B = { x0: A.x0, x1: A.x1, y0, y1: A.y1 }, w = B.x1 - B.x0, h = B.y1 - B.y0, gy = B.y1 - h * .12;
    const u = Math.min(w / 10, h / 4.4);
    const casa = { x: B.x0 + w * .02, y: B.y0 + h * .34, w: w * .3, h: gy - (B.y0 + h * .34) };
    const pos = {
      calha: { x: casa.x - 4, y: casa.y - u * .3, w: casa.w + 8, h: u * .32 },
      caixa: { x: B.x0 + w * .38, y: B.y0 + h * .22, w: u * 1.3, h: u * 1.1 },
      pneu: { x: B.x0 + w * .62, y: gy - u * .62, r: u * .62 },
      prato: { x: B.x0 + w * .79, y: gy, s: u * .9 },
      garrafa: { x: B.x0 + w * .93, y: gy, s: u * 1.0 }
    };
    // área de toque de cada criadouro
    const hit = {
      calha: { x: pos.calha.x, y: pos.calha.y - 6, w: pos.calha.w, h: pos.calha.h + 12 },
      caixa: { x: pos.caixa.x - 6, y: pos.caixa.y - 10, w: pos.caixa.w + 12, h: pos.caixa.h * 1.9 },
      pneu: { x: pos.pneu.x - pos.pneu.r * 1.4, y: pos.pneu.y - pos.pneu.r * 1.6, w: pos.pneu.r * 2.8, h: pos.pneu.r * 2.7 },
      prato: { x: pos.prato.x - pos.prato.s * .8, y: pos.prato.y - pos.prato.s * 1.8, w: pos.prato.s * 1.6, h: pos.prato.s * 1.9 },
      garrafa: { x: pos.garrafa.x - pos.garrafa.s * .4, y: pos.garrafa.y - pos.garrafa.s * 1.2, w: pos.garrafa.s * .8, h: pos.garrafa.s * 1.25 }
    };
    // garante que nenhuma área saia da tela
    for (const k in hit) { const r = hit[k]; if (r.x + r.w > B.x1) r.w = B.x1 - r.x; }
    return { B, w, h, gy, u, casa, pos, hit };
  }
  function quintal(t, S, A, y0) {
    const q = geoQuintal(A, y0), { B, gy, casa, pos, hit } = q;
    // chão e casa
    rr(B.x0, gy, B.x1 - B.x0, B.y1 - gy, 4, 'rgba(110,160,90,.18)'); line(B.x0, gy, B.x1, gy, 'rgba(160,200,140,.55)', 1.5);
    rr(casa.x, casa.y, casa.w, casa.h, 2, 'rgba(216,192,138,.16)', 'rgba(216,192,138,.6)', 1.4);
    shape([[casa.x - 8, casa.y], [casa.x + casa.w / 2, casa.y - q.u * 1.1], [casa.x + casa.w + 8, casa.y]], 'rgba(200,110,80,.3)', '#D98C62', 1.4);
    rr(casa.x + casa.w * .58, casa.y + casa.h * .38, casa.w * .24, casa.h * .62, 2, 'rgba(11,15,28,.5)', 'rgba(216,192,138,.6)', 1.2);
    rr(casa.x + casa.w * .14, casa.y + casa.h * .25, casa.w * .28, casa.h * .3, 2, 'rgba(95,168,232,.18)', 'rgba(216,192,138,.6)', 1.2);
    // criadouros
    const ok = k => !!S.feito[k];
    dCalha(pos.calha, ok('calha'));
    dCaixa(pos.caixa.x, pos.caixa.y, pos.caixa.w, pos.caixa.h, ok('caixa'));
    dPneu(pos.pneu.x, pos.pneu.y, pos.pneu.r, ok('pneu'), t);
    dPrato(pos.prato.x, pos.prato.y, pos.prato.s, ok('prato'));
    dGarrafa(pos.garrafa.x, pos.garrafa.y, pos.garrafa.s, ok('garrafa'));
    const faltam = CRI.filter(c => !ok(c.k));
    // anel pulsante nos que faltam (dica) e marca de feito
    for (const c of CRI) {
      const r = hit[c.k], cx = r.x + r.w / 2, cy = r.y + r.h / 2;
      if (ok(c.k)) { circ(r.x + r.w - 4, r.y + 6, 8, COR.ok, '#0B0F1C', 1.5); poly([[r.x + r.w - 8, r.y + 6], [r.x + r.w - 5, r.y + 9], [r.x + r.w, r.y + 3]], '#0B0F1C', 2); }
      else { X.save(); X.globalAlpha *= .35 + .3 * Math.sin(t * 4); X.setLineDash([4, 4]); rr(r.x, r.y, r.w, r.h, 8, null, COR.esp, 1.4); X.setLineDash([]); X.restore(); hitR(r.x, r.y, r.w, r.h, 'cri:' + c.k); }
      void cx; void cy;
    }
    // mosquitos voando perto dos criadouros que restam
    const R = rng(11);
    faltam.forEach((c, j) => {
      const r = hit[c.k];
      for (let i = 0; i < 3; i++) {
        const ph = R() * TAU, sp = .7 + R() * .6, mx = r.x + r.w / 2 + Math.cos(t * sp + ph) * r.w * .6, my = r.y - 10 + Math.sin(t * sp * 1.7 + ph) * 12 - i * 9;
        mosquito(cl(mx, B.x0 + 10, B.x1 - 10), cl(my, B.y0 + 6, gy), tam(11, 13), { t: t + i + j, dir: Math.cos(t * sp + ph + PI / 2) > 0 ? 1 : -1 });
      }
    });
    // contador
    const n = faltam.length * MOSQ_POR, cxT = B.x1 - 4;
    const txt = `Mosquitos no quintal: ${n}`;
    const wT = tw(txt, tam(12, 13), 700) + 20;
    rr(cxT - wT, B.y0 + 2, wT, 26, 13, 'rgba(11,15,28,.84)', n ? rgba(COR.vetor, .6) : COR.ok, 1.2);
    tx(txt, cxT - wT / 2, B.y0 + 15, { s: tam(12, 13), w: 700, c: n ? COR.txt : COR.ok, bg: false });
    if (!faltam.length) {
      const w = Math.min(B.x1 - B.x0 - 8, 420), x = (B.x0 + B.x1) / 2 - w / 2;
      cartao(x, B.y0 + 34, w, 'A Fiocruz solta mosquitos com a bactéria <i>Wolbachia</i>, que diminui a capacidade do <i>Aedes</i> de transmitir os vírus. Esses mosquitos cruzam com os do lugar e passam a bactéria para os filhotes.', { tit: 'Sabia?', f: 'rgba(19,26,43,.94)' });
    }
    return faltam.length;
  }
  // ciclo do mosquito num criadouro (corte de um balde); f = 0..1 do ciclo
  function cicloMosquito(r, f, t) {
    panel(r.x, r.y, r.w, r.h, { f: PAINEL, s: BORDA });
    tx('No criadouro', r.x + r.w / 2, r.y + 14, { s: 12.5, w: 700, c: COR.txt, bg: false });
    const bw = Math.min(r.w * .42, 110), bh = r.h - 46, bx = r.x + 14, by = r.y + 30;
    const nivel = lerp(.35, .78, ss(seg(f, .18, .32)));
    rr(bx, by, bw, bh, 4, 'rgba(255,255,255,.04)', '#8E9BB8', 1.6);
    rr(bx + 2, by + bh * (1 - nivel), bw - 4, bh * nivel - 2, 2, rgba(COR.agua, .45));
    // ovos na parede, um pouco acima da água inicial
    const ye = by + bh * (1 - .5);
    const ovos = 1 - seg(f, .32, .4);
    if (ovos > .02) for (let i = 0; i < 5; i++) ell(bx + 5, ye - i * 4, 1.6, 2.6, 0, rgba('#E8EDF7', ovos), null);
    // larvas
    const la = seg(f, .36, .42) * (1 - seg(f, .66, .72));
    if (la > .02) { X.save(); X.globalAlpha *= la; for (let i = 0; i < 3; i++) { const lx = bx + bw * (.3 + i * .22), ly = by + bh * (1 - nivel) + 10 + i * 7 + Math.sin(t * 5 + i) * 3; fita(lx, ly, lx + 2, ly + 12, '#E8EDF7', 2, 1.6, 6); } X.restore(); }
    // adulto sai
    if (f >= .7) { const k = seg(f, .7, .95); mosquito(bx + bw / 2 + k * bw * .6, by + bh * (1 - nivel) - 6 - k * 26, 13, { t, a: 1 - seg(f, .95, 1) }); }
    const etapas = ['ovos na parede', 'a água sobe', 'larvas', 'mosquito adulto'];
    const ei = f < .18 ? 0 : f < .36 ? 1 : f < .68 ? 2 : 3;
    const xl = bx + bw + 12, wl = r.x + r.w - xl - 8;
    etapas.forEach((s, i) => tx(s, xl, by + 10 + i * 18, { s: 12, w: i === ei ? 700 : 400, a: 'left', c: i === ei ? COR.vetor : COR.dim, bg: false }));
    wrapTx('do ovo ao adulto: cerca de 7 a 10 dias', xl, by + 10 + 4 * 18 + 2, wl, { s: 12, lh: 15, a: 'left', c: COR.txt });
  }
  // transmissão: fêmea pica a pessoa doente e depois a sadia
  function transmissao(r, f, t) {
    panel(r.x, r.y, r.w, r.h, { f: PAINEL, s: BORDA });
    const s = Math.min(r.h * .5, 56), y = r.y + r.h - s * .7 - 6, xa = r.x + r.w * .2, xb = r.x + r.w * .8;
    pessoa(xa, y, s, { c: '#FF9A7A' }); pessoa(xb, y, s, { c: COR.txt });
    tx('pessoa com o vírus', xa, y + s * .72 - 2, { s: 12, w: 700, c: '#FF9A7A' });
    tx('pessoa sadia', xb, y + s * .72 - 2, { s: 12, w: 700, c: COR.txt });
    // partículas virais na pessoa doente
    for (let i = 0; i < 4; i++) circ(xa - s * .1 + (i % 2) * s * .2, y - s * .02 + Math.floor(i / 2) * s * .16, 2.4, COR.virus);
    const ya = y - s * .1, topo = r.y + 34;
    X.save(); X.setLineDash([3, 5]); X.beginPath(); X.moveTo(xa + s * .2, ya); X.quadraticCurveTo((xa + xb) / 2, topo - 4, xb - s * .2, ya); X.strokeStyle = rgba(COR.vetor, .7); X.lineWidth = 1.6; X.stroke(); X.restore();
    tx('o vírus vai junto com a saliva', (xa + xb) / 2, r.y + 14, { s: 12.5, w: 700, c: COR.vetor, bg: false });
    // trajeto do mosquito
    let mx, my, dir = 1, vir = f > .22;
    if (f < .22) { mx = xa + s * .22; my = ya + Math.sin(t * 3) * 1.5; dir = -1; }
    else if (f < .7) { const k = ss(seg(f, .22, .7)); [mx, my] = qpt(xa + s * .2, ya, (xa + xb) / 2, topo - 4, xb - s * .2, ya, k); }
    else { mx = xb - s * .22; my = ya + Math.sin(t * 3) * 1.5; }
    mosquito(mx, my - 8, 16, { t, dir });
    if (vir) circ(mx + 4 * dir, my - 4, 2.4, COR.virus);
    const etapa = f < .22 ? 'a fêmea pica e leva o vírus' : f < .7 ? 'voa até outra pessoa' : 'pica e passa o vírus';
    tx(etapa, (xa + xb) / 2, r.y + r.h - 10, { s: 12, c: COR.dim, bg: false });
  }

  // cenário da febre amarela: mata (ciclo silvestre) e cidade (ciclo urbano)
  function mata(t, S, A) {
    const vert = NAR || A.w < 560;
    const M = vert ? { x0: A.x0, x1: A.x1, y0: A.y0, y1: A.y0 + A.h * .64 } : { x0: A.x0, x1: A.x0 + A.w * .62, y0: A.y0, y1: A.y1 };
    const Ci = vert ? { x0: A.x0, x1: A.x1, y0: M.y1 + 10, y1: A.y1 } : { x0: M.x1 + 14, x1: A.x1, y0: A.y0, y1: A.y1 };
    const mw = M.x1 - M.x0, mh = M.y1 - M.y0;
    panel(M.x0, M.y0, mw, mh, { f: 'rgba(47,107,69,.12)', s: 'rgba(110,190,130,.4)' });
    tx('Ciclo silvestre', M.x0 + 12, M.y0 + 16, { s: tam(13, 14), w: 700, a: 'left', c: '#9ED9A8', bg: false });
    // árvores: copas no alto
    const R = rng(3), cop = [];
    for (let i = 0; i < 5; i++) {
      const x = M.x0 + mw * (.1 + i * .2), y = M.y0 + mh * (.36 + (i % 2) * .06), r = Math.min(mw * .12, mh * .2);
      line(x, y, x, M.y1 - mh * .14, '#6B5236', tam(5, 7));
      for (let j = 0; j < 3; j++) circ(x + (j - 1) * r * .6, y - (j === 1 ? r * .35 : 0), r * (.7 + R() * .2), rgba(COR.mataC, .55), COR.mataC, 1.2);
      cop.push([x, y - r * .2, r]);
    }
    // trilha e pessoa entrando
    const gy = M.y1 - mh * .14;
    line(M.x0 + 6, gy, M.x1 - 6, gy, 'rgba(160,200,140,.5)', 1.5);
    X.save(); X.setLineDash([6, 6]); line(M.x0 + mw * .35, gy + mh * .07, M.x1 - 8, gy + mh * .07, 'rgba(217,190,134,.6)', 2); X.restore();
    const ps = Math.min(mh * .22, 46), px = M.x1 - mw * .14 - (fr(t / 14) * mw * .12), py = gy + mh * .07 - ps * .62;
    pessoa(px, py, ps, { c: COR.txt });
    // macacos na copa
    const mk = [cop[1], cop[3]], ms = Math.min(mh * .2, 40);
    mk.forEach(([x, y], i) => macaco(x, y + 4, ms, { flip: i === 1 }));
    // mosquitos do mato: vão de macaco a macaco e, às vezes, até a pessoa
    const f = fr(t / 9);
    const a0 = mk[0], a1 = mk[1];
    X.save(); X.setLineDash([3, 5]);
    qarrow(a0[0] + 10, a0[1] - 10, (a0[0] + a1[0]) / 2, a0[1] - mh * .2, a1[0] - 10, a1[1] - 10, rgba(COR.vetor, .7), 1.5);
    qarrow(a1[0] + 6, a1[1] + 10, (a1[0] + px) / 2 + 10, (a1[1] + py) / 2, px - ps * .2, py - ps * .3, rgba(COR.vetor, .7), 1.5);
    X.restore();
    let mx, my, dir = 1;
    if (f < .5) { [mx, my] = qpt(a0[0] + 10, a0[1] - 10, (a0[0] + a1[0]) / 2, a0[1] - mh * .2, a1[0] - 10, a1[1] - 10, ss(f / .5)); }
    else { [mx, my] = qpt(a1[0] + 6, a1[1] + 10, (a1[0] + px) / 2 + 10, (a1[1] + py) / 2, px - ps * .2, py - ps * .3, ss((f - .5) / .5)); }
    mosquito(mx, my, tam(14, 16), { t, dir, c: '#D7E87A' });
    // rótulos
    const lyb = M.y1 - 10;
    mtx('<i>Haemagogus</i> e <i>Sabethes</i>: mosquitos da mata', M.x0 + 12, M.y0 + 36, { s: tam(11.5, 12.5), a: 'left', c: '#D7E87A' });
    if (LB) {
      const tt = 'Macacos não transmitem para pessoas: adoecem como nós e servem de alerta.';
      const wq = Math.min(mw - 24, 330);
      const hq = wrapTx(tt, 0, 0, wq - 20, { s: 12, lh: 16, dry: true }) + 14;
      panel(M.x0 + 12, lyb - hq - mh * .08, wq, hq, { f: 'rgba(11,15,28,.84)', s: rgba(COR.macaco, .7) });
      wrapTx(tt, M.x0 + 22, lyb - hq - mh * .08 + 14, wq - 20, { s: 12, lh: 16, a: 'left', c: '#F0D9BF' });
    }
    // cidade (ciclo urbano)
    const cw = Ci.x1 - Ci.x0, ch = Ci.y1 - Ci.y0;
    panel(Ci.x0, Ci.y0, cw, ch, { f: 'rgba(19,26,43,.6)', s: BORDA });
    tx('Ciclo urbano', Ci.x0 + 12, Ci.y0 + 16, { s: tam(13, 14), w: 700, a: 'left', c: COR.txt, bg: false });
    const by = Ci.y1 - 12, nb = 5, bw = Math.min(cw / (nb + 1), 46);
    const prE = vert ? Ci.x0 + cw * .5 : Ci.x0 + 12;
    for (let i = 0; i < nb; i++) {
      const hb = ch * (.22 + ((i * 37) % 5) * .05), x = (vert ? Ci.x0 + 12 : Ci.x0 + (cw - nb * bw) / 2) + i * bw * (vert ? .9 : 1);
      rr(x, by - hb, bw * .8, hb, 2, 'rgba(155,170,200,.14)', 'rgba(155,170,200,.5)', 1.2);
    }
    void prE;
    const tc = vert ? { x: Ci.x0 + 12 + nb * bw * .9 + 10, w: Ci.x1 - (Ci.x0 + 12 + nb * bw * .9 + 10) - 10, y: Ci.y0 + 34 } : { x: Ci.x0 + 12, w: cw - 24, y: Ci.y0 + 34 };
    mtx('Transmissor: <i>Aedes aegypti</i>', tc.x, tc.y, { s: tam(11.5, 12.5), a: 'left', c: COR.vetor });
    wrapTx('No Brasil, não há registro de febre amarela urbana desde <b>1942</b>.', tc.x, tc.y + 20, tc.w, { s: tam(12, 13), lh: tam(16, 17), a: 'left', c: COR.txt });
    mosquito(Ci.x1 - 26, Ci.y0 + 18 + Math.sin(t * 2) * 3, 14, { t });
    cap(f < .5 ? 'Na mata, o vírus passa de macaco para macaco pela picada de <i>Haemagogus</i> e <i>Sabethes</i>.'
      : 'Quem entra na mata sem vacina pode ser picado. O vírus ataca o <b>fígado</b> e causa a pele amarelada (icterícia). Há vacina eficaz no SUS.');
  }

  // "Qual arbovirose?": fichas fictícias e doenças (toque na ficha, depois na doença)
  function fichas(t, S, A) {
    const top = A.y0 + 4;
    title('Qual arbovirose?', (A.x0 + A.x1) / 2, top + 8, A.w - 20, { s: tam(15, 17) });
    tx('Fichas fictícias: toque numa ficha e depois na doença.', (A.x0 + A.x1) / 2, top + 30, { s: 12, c: COR.dim });
    const y0 = top + 48, g = 10;
    let fr0, dr;
    if (NAR) {
      const dh = 36, dRows = 2, fh = Math.min(76, (A.y1 - y0 - dRows * (dh + 8) - 8 - 3 * g) / 4);
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
      const r = fr0[i], res = S.res[i], certo = res && res === f.d, err = S.err && S.err.i === i && performance.now() - S.err.t < 1200;
      const sel = S.selF === i, cb = certo ? COR.ok : err ? COR.erro : sel ? COR.esp : 'rgba(255,255,255,.2)';
      rr(r.x, r.y, r.w, r.h, 10, certo ? 'rgba(107,203,119,.1)' : PAINEL, cb, sel || certo || err ? 2.5 : 1);
      const pad = 12, sz = tam(12.5, 14);
      tx(`Ficha ${i + 1}`, r.x + pad, r.y + 14, { s: 12, w: 700, a: 'left', c: COR.dim, bg: false });
      wrapTx(f.s, r.x + pad, r.y + 32, r.w - pad * 2 - (certo ? 0 : 0), { s: sz, lh: sz + 4, a: 'left', c: COR.txt });
      if (certo) { const d = DOENCAS.find(z => z.k === f.d), wtk = mtw(d.n, 12, 700) + 12; tok(r.x + r.w - wtk / 2 - 8, r.y + 14, d.n, COR.ok, { s: 12 }); }
      if (!certo) hitR(r.x, r.y, r.w, r.h, 'ficha:' + i);
    });
    DOENCAS.forEach((d, i) => {
      const r = dr[i], usada = FICHAS.some((f, j) => S.res[j] === d.k && f.d === d.k);
      rr(r.x, r.y, r.w, r.h, 10, usada ? 'rgba(107,203,119,.1)' : rgba(COR.vetor, S.selF != null ? .16 : .08), usada ? COR.ok : rgba(COR.vetor, .8), 1.5);
      tx(d.n, r.x + r.w / 2, r.y + r.h / 2, { s: tam(13, 14), w: 700, c: usada ? COR.ok : COR.txt, bg: false });
      if (!usada) hitR(r.x, r.y, r.w, r.h, 'doenca:' + d.k);
    });
    const acertos = FICHAS.filter((f, i) => S.res[i] === f.d).length;
    let e = 'Leia os sintomas e a história de cada ficha. Todas as quatro doenças são viroses transmitidas por mosquito.';
    if (acertos === 4) e = '<b>Todas certas!</b> Lembre: antibiótico não trata nenhuma delas, e na suspeita de dengue não se toma AAS.';
    else if (S.fmsg && performance.now() - S.fmsgT < 6000) e = S.fmsg;
    cap(e);
  }

  def('doencas', 'arboviroses', {
    t: 'Dengue, zika, chikungunya e febre amarela',
    s: 'quatro vírus, um mosquito: o <i>Aedes aegypti</i>',
    loc: 'Um quintal com criadouros e uma mata',
    locNota: 'Desenho esquemático',
    alt: 'Um quintal com cinco criadouros de água parada: calha entupida, caixa-d\'água aberta, pneu, pratinho de vaso e garrafa. Tocar em cada um elimina o criadouro e diminui o número de mosquitos. No alto, o ciclo do mosquito num criadouro e uma fêmea de Aedes aegypti picando uma pessoa com o vírus e depois uma pessoa sadia. Outros botões mostram os ciclos silvestre e urbano da febre amarela e um jogo com quatro fichas fictícias de pacientes',
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
        S.qmsg = `${c.feito} ${n ? `Faltam ${n} criadouro${n > 1 ? 's' : ''}.` : 'Todos os criadouros eliminados!'}`; S.qmsgT = performance.now();
      } else if (id.startsWith('ficha:')) { const i = +id.slice(6); S.selF = S.selF === i ? null : i; }
      else if (id.startsWith('doenca:')) {
        const k = id.slice(7);
        if (S.selF == null) { S.fmsg = 'Escolha primeiro uma ficha e depois a doença.'; S.fmsgT = performance.now(); return; }
        const i = S.selF, f = FICHAS[i];
        if (f.d === k) { S.res[i] = k; S.fmsg = 'Certo! ' + DOENCAS.find(z => z.k === k).dica; }
        else { S.err = { i, t: performance.now() }; S.fmsg = `Não é ${DOENCAS.find(z => z.k === k).n.toLowerCase()}. ${DOENCAS.find(z => z.k === k).dica} Releia a ficha.`; }
        S.fmsgT = performance.now(); S.selF = null;
      }
    },
    draw(t, S) {
      this.init(S); const A = area();
      if (S.modo === 'mata') { mata(t, S, A); return; }
      if (S.modo === 'fichas') { fichas(t, S, A); return; }
      // faixa de cima: ciclo do mosquito e transmissão (lado a lado no computador; alternando no celular)
      const bh = tam(128, 138), r = { x: A.x0, y: A.y0, w: A.w, h: bh };
      const P = 20, pp = fr(t / P);
      if (NAR) {
        if (pp < .5) cicloMosquito(r, pp * 2, t); else transmissao(r, (pp - .5) * 2, t);
      } else {
        const g = 12, w1 = (A.w - g) * .46;
        cicloMosquito({ x: r.x, y: r.y, w: w1, h: bh }, fr(t / 10), t);
        transmissao({ x: r.x + w1 + g, y: r.y, w: A.w - w1 - g, h: bh }, fr(t / 10), t);
      }
      const falta = quintal(t, S, A, A.y0 + bh + 12);
      let e;
      if (S.qmsg && performance.now() - S.qmsgT < 5000) e = S.qmsg;
      else if (!falta) e = 'Sem água parada, o mosquito não tem onde pôr ovos. <b>Eliminar os criadouros</b> é o combate mais eficiente nas cidades.';
      else e = 'Toque nos <b>criadouros</b> de água parada para eliminá-los. Só a <b>fêmea</b> pica: ela precisa do sangue para amadurecer os ovos.';
      cap(e);
    },
    d: `<p><b>Arboviroses</b> são doenças causadas por vírus transmitidos por artrópodes, como mosquitos. No Brasil, as mais importantes são <b>dengue</b>, <b>zika</b>, <b>chikungunya</b> e <b>febre amarela</b>, todas causadas por <b>vírus de RNA envelopados</b>. A dengue, a zika e a chikungunya são transmitidas nas cidades pela <b>fêmea</b> do mosquito <b><i>Aedes aegypti</i></b> (só a fêmea pica, porque precisa do sangue para amadurecer os ovos), e também pelo <i>Aedes albopictus</i>. O mosquito pica de dia e põe os ovos em <b>água parada e limpa</b>: pneus, vasos de plantas, garrafas, caixas-d'água destampadas. Os ovos resistem secos por mais de um ano e eclodem quando a água volta. Por isso o combate mais eficiente é <b>eliminar os criadouros</b>. Não há transmissão de pessoa para pessoa pelo ar nem pelo toque.</p>
<p>A <b>dengue</b> causa febre alta, dor atrás dos olhos, dor no corpo e manchas na pele. Há <b>quatro sorotipos</b> do vírus (DENV-1 a DENV-4): quem pega um fica protegido contra ele, mas uma segunda infecção por <b>outro sorotipo</b> aumenta o risco de <b>dengue grave</b>, com sangramentos e queda da pressão. Por isso, com suspeita de dengue, <b>não se deve tomar ácido acetilsalicílico</b> (AAS) nem anti-inflamatórios, que pioram o sangramento, e é preciso beber muito líquido e procurar atendimento. O SUS oferece uma vacina contra a dengue desde 2024, para uma faixa de idade definida pelo Ministério da Saúde, e o Instituto Butantan desenvolveu uma vacina de dose única aprovada pela Anvisa em 2025. A <b>zika</b> costuma ser mais leve no adulto, mas, na gestante, o vírus atravessa a placenta e pode causar <b>microcefalia</b> e outras malformações no bebê (a <b>síndrome congênita do zika</b>, que marcou a epidemia de 2015 e 2016 no Brasil); também se associa à síndrome de <b>Guillain-Barré</b> e pode ser transmitida por <b>relação sexual</b>. A <b>chikungunya</b> ("aquele que se dobra", numa língua da Tanzânia) causa <b>dor forte nas articulações</b>, que pode durar meses.</p>
<p>A <b>febre amarela</b> tem dois ciclos. No <b>ciclo silvestre</b>, nas matas, o vírus passa entre <b>macacos</b> por mosquitos dos gêneros <i>Haemagogus</i> e <i>Sabethes</i>, e a pessoa que entra na mata pode ser picada. Os <b>macacos não transmitem</b> a doença para pessoas: eles adoecem e morrem como nós, e servem de <b>alerta</b> de que o vírus está circulando; matá-los é crime e atrapalha a vigilância. No <b>ciclo urbano</b>, o transmissor seria o <i>Aedes aegypti</i>; no Brasil, não há registro de febre amarela urbana desde <b>1942</b>. O vírus ataca o <b>fígado</b>, e a pele amarelada (<b>icterícia</b>) dá nome à doença. Há uma <b>vacina</b> eficaz no calendário do SUS.</p>
<table><caption>Quadro (Ministério da Saúde, Guia de Vigilância em Saúde)</caption>
<thead><tr><th>Doença</th><th>Transmissão principal</th><th>Marca da doença</th><th>Vacina no SUS</th></tr></thead>
<tbody>
<tr><td>Dengue</td><td><i>Aedes aegypti</i> (urbano)</td><td>febre alta, dor atrás dos olhos; 4 sorotipos; risco de forma grave</td><td>sim, para grupos e idades definidos</td></tr>
<tr><td>Zika</td><td><i>Aedes aegypti</i>; também sexual e da mãe para o feto</td><td>microcefalia e outras malformações; Guillain-Barré</td><td>não</td></tr>
<tr><td>Chikungunya</td><td><i>Aedes aegypti</i></td><td>dor nas articulações que pode durar meses</td><td>não (ainda fora do calendário)</td></tr>
<tr><td>Febre amarela</td><td><i>Haemagogus</i> e <i>Sabethes</i> (silvestre); <i>Aedes aegypti</i> (urbano, sem casos no Brasil desde 1942)</td><td>icterícia, lesão do fígado</td><td>sim</td></tr>
</tbody></table>`,
    enem: 'É um dos temas mais cobrados da Biologia no ENEM. Saiba: as quatro são <b>viroses</b>, transmitidas por <b>mosquito</b> (vetor), e a medida mais eficaz nas cidades é <b>eliminar os criadouros de água parada</b>. Antibiótico <b>não</b> trata nenhuma delas. Pegadinhas: o mosquito <b>não</b> é o causador (é o <b>vetor</b>; o causador é o vírus); o <b>macaco não transmite</b> febre amarela para pessoas; e na suspeita de dengue não se toma <b>AAS</b>. A relação <b>zika na gestação e microcefalia</b> aparece em questões sobre teratogenia.',
    links: [LK.embrio, LK.calendario, ['Cada via, sua prevenção', '#prevencao/transmissao']]
  });
}
