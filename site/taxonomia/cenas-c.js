/* LAB, módulo Taxonomia. Cenas C (Prometeu): Sistemas (de dois a cinco reinos; os três domínios).
   Fonte científica: docs/revisao-biologia/taxonomia-roteiro.md (Taxon, S1 e S2, com a revisão do Sapien).
   Usa a API do motor.js (def, tx, tw, wrapTx, circ, ell, rr, line, lab, cap, area, C...). Código, desenhos e textos da equipe. */
'use strict';
{
  // cores: domínios e reinos (roteiro: Bacteria azul, Archaea laranja, Eukarya verde; reinos de Whittaker em tons próprios)
  // (nomes da paleta C do motor; a reserva só vale se faltar alguma)
  const RES = { bact: '#4FA8FF', arch: '#FF9A3C', euk: '#6BCB77', monera: '#7FB2E5', proto: '#C58BE8', fungi: '#D9A066',
    plantae: '#7BD88F', animalia: '#FF8C7A', amber: '#FFB347', txt: '#E8EDF7', dim: '#9DA9C4', line: '#5B6C99' };
  const K = n => (typeof C !== 'undefined' && C && C[n]) || RES[n];
  const AMB = () => K('amber');
  const PAINEL = 'rgba(19,26,43,.6)';
  
  // muda o valor da faixa por código e anota, para saber depois se foi o aluno quem mexeu
  function poeV(S, v, ctl) {
    S.v = S.vSet = v;
    const r = $('ctlR'), vv = $('ctlV');
    if (r) { r.value = v; r.setAttribute('aria-valuetext', ctl.f(v)); }
    if (vv) vv.textContent = ctl.f(v);
  }
  const marca = (x, y, c) => { circ(x, y, 11, rgba(c, .25)); circ(x, y, 6.5, c, '#fff', 2); };
  const pressBtn = (i, on) => { const b = document.querySelectorAll('#extra button')[i]; if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false'); };
  const mostraFaixa = on => { const r = $('ctlR'); if (r && r.parentNode) r.parentNode.hidden = !on; };
  const lerpR = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });

  // ---------- ícones: os do motor (bicho) e dois só deste arquivo, no mesmo traço ----------
  if (typeof BICHOS !== 'undefined') {
    if (!BICHOS.esponja) BICHOS.esponja = () => {   // esponja: vaso com ósculo e poros
      X.beginPath(); X.moveTo(-.5, .9); X.quadraticCurveTo(-.85, -.1, -.42, -.85); X.lineTo(.42, -.85); X.quadraticCurveTo(.85, -.1, .5, .9); X.closePath(); X.fill(); X.stroke();
      X.beginPath(); X.ellipse(0, -.85, .36, .1, 0, 0, TAU); X.stroke();
      for (const [u, v] of [[-.28, -.25], [.25, 0], [-.12, .4], [.3, .5], [0, .05]]) { X.beginPath(); X.arc(u, v, .08, 0, TAU); X.stroke(); }
    };
    if (!BICHOS.algaUni) BICHOS.algaUni = c => {    // alga verde unicelular: célula com cloroplasto em taça
      X.beginPath(); X.arc(0, 0, .8, 0, TAU); X.fill(); X.stroke();
      X.beginPath(); X.arc(0, .05, .55, .25, PI - .25); X.stroke(); X.beginPath(); X.arc(-.25, -.3, .14, 0, TAU); X.fillStyle = c; X.fill();
    };
  }
  const ICID = { bact: 'bacteria', ameba: 'ameba', alga: 'alga', algau: 'algaUni', cogu: 'cogumelo', lev: 'levedura', sama: 'samambaia', esponja: 'esponja', onca: 'onca', peixe: 'peixe' };
  function icone(k, x, y, r, a = 1, c) { if (typeof bicho === 'function') bicho(ICID[k] || k, x, y, r * 2.2, { a, c: c || K('txt') }); }
  // bloco colorido com nome (e linha curta embaixo, se couber)
  function bloco(r, c, nome, sub, a = 1, o = {}) {
    if (a <= .02 || r.w < 4 || r.h < 4) return; X.save(); X.globalAlpha *= a;
    rr(r.x, r.y, r.w, r.h, 10, rgba(c, o.fundo == null ? .22 : o.fundo), c, o.lw || 1.6);
    const cx = r.x + r.w / 2, so = sub && r.h >= 48 && tw(sub, 12) < r.w - 8, sz = NAR ? 13 : 14;
    if (nome && tw(nome, sz, 700) < r.w - 6) tx(nome, cx, r.y + (o.ny != null ? o.ny : (so ? r.h / 2 - 9 : r.h / 2)), { s: sz, w: 700, i: !!o.it, c: '#fff', bg: false });
    if (so) tx(sub, cx, r.y + r.h / 2 + 10, { s: 12, c: '#D3DAEA', bg: false });
    X.restore();
  }

  // =====================================================================================
  // S1 DE DOIS A CINCO REINOS
  // =====================================================================================
  const RE = ['mon', 'pro', 'fun', 'veg', 'ani'];
  const COR_R = { mon: 'monera', pro: 'proto', fun: 'fungi', veg: 'plantae', ani: 'animalia' };
  const VIS = [['veg', 'ani'], ['pro', 'veg', 'ani'], ['mon', 'pro', 'veg', 'ani'], RE, RE];
  const PAI = { mon: 'pro', fun: 'veg', pro: null };
  function nomeR(k, s) {
    if (k === 'mon') return 'Monera'; if (k === 'fun') return 'Fungi';
    if (k === 'pro') return s === 2 || s >= 4 ? 'Protoctista' : 'Protista';   // Copeland (1956) cunhou Protoctista; Whittaker (1969) usou Protista
    if (k === 'veg') return s === 0 ? 'Vegetais' : 'Plantae';
    return s === 0 ? 'Animais' : 'Animalia';
  }
  // onde mora cada ícone em cada etapa (null = ainda não aparece)
  const ICS = [
    ['bact', [null, 'pro', 'mon', 'mon', 'mon']],
    ['ameba', [null, 'pro', 'pro', 'pro', 'pro']],
    ['alga', ['veg', 'veg', 'veg', 'veg', 'pro']],
    ['cogu', ['veg', 'veg', 'pro', 'fun', 'fun']],
    ['sama', ['veg', 'veg', 'veg', 'veg', 'veg']],
    ['peixe', ['ani', 'ani', 'ani', 'ani', 'ani']]
  ];
  const ETAPA = [
    { ano: '1735', q: 'Lineu: dois reinos', cap: 'Lineu dividia os seres vivos em <b>dois reinos</b>: animais e vegetais. Os cogumelos e as algas ficavam entre os vegetais.' },
    { ano: '1866', q: 'Haeckel: três reinos', cap: 'Com o microscópio, <b>Haeckel</b> criou o reino <b>Protista</b> para os seres microscópicos, bactérias incluídas.' },
    { ano: '1956', q: 'Copeland: quatro reinos', cap: '<b>Copeland</b> separou as bactérias, de célula <b>procarionte</b>, no reino <b>Monera</b>, e chamou de <b>Protoctista</b> o reino dos eucariontes simples, fungos incluídos.' },
    { ano: '1969', q: 'Whittaker: cinco reinos', cap: '<b>Whittaker</b> deu aos fungos um reino próprio, <b>Fungi</b>. Célula, número de células e nutrição separam os <b>cinco reinos</b>.' },
    { ano: '1982', q: 'Margulis e Schwartz: Protoctista', cap: '<b>Margulis e Schwartz</b> levaram todas as algas para <b>Protoctista</b>; Plantae ficou com os seres que têm <b>embrião</b>.' }
  ];
  const ctlS1 = { l: 'Linha do tempo', min: 0, max: 4, step: 1, v: 0, f: v => ETAPA[cl(Math.round(v), 0, 4)].ano, rate: () => 1 };

  // ---------- "Em que reino?": três critérios de Whittaker, em perguntas ----------
  const SERES = [
    { n: 'bactéria', ic: 'bact', f: 'Uma célula só, sem núcleo organizado: o DNA fica solto no citoplasma.', nuc: 0, pl: 0, nut: 1, r: 'mon', nota: 'Toda célula sem núcleo organizado (procarionte) vai para Monera, sem precisar das outras perguntas.' },
    { n: 'levedura', ic: 'lev', f: 'O fungo do pão e da cerveja: uma célula só, com núcleo; vive no açúcar do suco de uva e o tira do meio pela superfície da célula.', nuc: 1, pl: 0, nut: 1, r: 'fun', nota: 'Fungo pode ser unicelular. O que o põe em Fungi é a nutrição por absorção (e a parede de quitina).' },
    { n: 'cogumelo', ic: 'cogu', f: 'Corpo de muitos filamentos, as hifas, com núcleo; cresce na madeira podre, solta enzimas sobre ela e aproveita o que se dissolve.', nuc: 1, pl: 1, nut: 1, r: 'fun', nota: 'Fungo não é planta: não faz fotossíntese, tem quitina na parede e guarda glicogênio, como os animais.' },
    { n: 'ameba', ic: 'ameba', f: 'Uma célula só, com núcleo; estende pseudópodes, envolve outros seres e os digere.', nuc: 1, pl: 0, nut: 2, r: 'pro', nota: 'Eucarionte unicelular que ingere o alimento: um protozoário, do reino Protoctista.' },
    { n: 'alga verde', ic: 'algau', f: 'Alga verde unicelular: uma célula só, com núcleo e cloroplasto; vive na água iluminada e cresce só com luz, água, gás carbônico e sais.', nuc: 1, pl: 0, nut: 0, r: 'pro', nota: 'Eucarionte unicelular que faz fotossíntese: uma alga, do reino Protoctista.' },
    { n: 'samambaia', ic: 'sama', f: 'Muitas células, com núcleo; folhas verdes, cheias de cloroplastos; cresce só com luz, água, gás carbônico e sais, e se desenvolve a partir de um embrião.', nuc: 1, pl: 1, nut: 0, r: 'veg', nota: 'Pluricelular, faz fotossíntese e tem embrião: reino Plantae.' },
    { n: 'esponja', ic: 'esponja', f: 'Muitas células, com núcleo, mas sem tecidos verdadeiros; fica presa na rocha e retém partículas da água que passa pelos poros.', nuc: 1, pl: 1, nut: 2, r: 'ani', nota: 'Mesmo sem tecidos verdadeiros, a esponja é pluricelular e ingere o alimento: reino Animalia.' },
    { n: 'onça', ic: 'onca', f: 'Muitas células, com núcleo; caça capivaras e outros animais e os come.', nuc: 1, pl: 1, nut: 2, r: 'ani', nota: 'Pluricelular que ingere o alimento: reino Animalia.' }
  ];
  const PERG = [
    { q: 'Tem núcleo organizado?', op: ['sim', 'não'], dica: 'veja se o DNA fica dentro de um núcleo' },
    { q: 'É pluricelular?', op: ['sim', 'não'], dica: 'veja se é uma célula só ou muitas' },
    { q: 'Como obtém o alimento?', op: ['fotossíntese', 'absorção', 'ingestão'], dica: 'veja como o ser consegue o alimento' }
  ];
  const certo = (s, q) => q === 0 ? (s.nuc ? 0 : 1) : q === 1 ? (s.pl ? 0 : 1) : s.nut;
  const nomeFinal = { mon: 'Monera', pro: 'Protoctista (Protista)', fun: 'Fungi', veg: 'Plantae', ani: 'Animalia' };

  function desenhaQuiz(A, S) {
    S.hit = [];
    const gap = 8, cols = NAR ? 4 : 8, y0q = A.y0 + (NAR ? 0 : 14), rows = Math.ceil(SERES.length / cols), cw = (A.w - gap * (cols - 1)) / cols, chH = 44;
    // fichas dos seres para escolher
    SERES.forEach((s, i) => {
      const c = i % cols, r0 = Math.floor(i / cols), R = { x: A.x0 + c * (cw + gap), y: y0q + r0 * (chH + 6), w: cw, h: chH }, on = S.ser === i;
      rr(R.x, R.y, R.w, R.h, 8, on ? 'rgba(255,179,71,.16)' : PAINEL, on ? AMB() : K('line'), on ? 2 : 1);
      const iw = cw > 92 ? 30 : 0;
      if (iw) icone(s.ic, R.x + 18, R.y + R.h / 2, 10);
      tx(s.n, R.x + iw + (R.w - iw) / 2, R.y + R.h / 2, { s: 13, w: 600, c: on ? '#fff' : '#D3DAEA', bg: false });
      S.hit.push({ r: R, f: () => { S.ser = i; S.passo = 0; S.resp = []; S.erro = null; S.fim = false; } });
    });
    let y = y0q + rows * (chH + 6) + 10;
    if (S.ser == null) {
      wrapTx('Escolha um ser acima. Depois responda às três perguntas de Whittaker, uma de cada vez, até chegar ao reino.', A.cx, y + 20, Math.min(A.w, 560), { s: 15, w: 600, c: K('txt') });
      // o fluxograma em miniatura, para o aluno ver o caminho antes de começar
      y += 76; const bw = Math.min(A.w, 420), x0 = A.cx - bw / 2;
      PERG.forEach((p, i) => { rr(x0, y + i * 58, bw, 40, 8, PAINEL, K('line'), 1); tx(`${i + 1}. ${p.q}`, A.cx, y + i * 58 + 20, { s: 14, w: 600, c: K('txt'), bg: false }); if (i < 2) arrow(A.cx, y + i * 58 + 42, A.cx, y + i * 58 + 56, K('dim'), 1.5); });
      return;
    }
    const s = SERES[S.ser], fw = Math.min(A.w, 640), fx = A.cx - fw / 2;
    // ficha do ser escolhido
    const lines = wrapLinhas(s.f, fw - 66, 14);
    const fh = Math.max(52, lines.length * 19 + 18);
    rr(fx, y, fw, fh, 10, PAINEL, K('line'), 1); icone(s.ic, fx + 28, y + fh / 2, 15);
    lines.forEach((l, i) => tx(l, fx + 56, y + 9 + 10 + i * 19, { s: 14, a: 'left', c: '#D3DAEA', bg: false }));
    y += fh + 10;
    // perguntas já respondidas (uma linha cada)
    for (let i = 0; i < S.passo && i < PERG.length; i++) {
      tx(`${PERG[i].q} ${PERG[i].op[S.resp[i]]}`, fx + 4, y + 10, { s: 13, w: 600, a: 'left', c: K('dim'), bg: false });
      circ(fx + fw - 10, y + 10, 5, AMB()); y += 24;
    }
    if (!S.fim) {
      const p = PERG[S.passo];
      tx(`${S.passo + 1}. ${p.q}`, A.cx, y + 14, { s: 16, w: 700, f: FH, c: '#fff', bg: false }); y += 32;
      const n = p.op.length, bw = Math.min(150, (fw - (n - 1) * 10) / n), tot = n * bw + (n - 1) * 10;
      p.op.forEach((o, j) => {
        const R = { x: A.cx - tot / 2 + j * (bw + 10), y, w: bw, h: 44 }, ruim = S.erro === j;
        rr(R.x, R.y, R.w, R.h, 8, ruim ? 'rgba(229,72,77,.18)' : 'rgba(255,179,71,.10)', ruim ? '#E5484D' : AMB(), 1.5);
        tx(o, R.x + R.w / 2, R.y + 22, { s: 14, w: 700, c: '#fff', bg: false });
        S.hit.push({ r: R, f: () => responde(S, j) });
      });
      y += 54;
      if (S.erro != null) wrapTx(`Ainda não. Releia a ficha: ${p.dica}.`, A.cx, y + 6, fw, { s: 14, w: 600, c: '#F4A3A6' });
    } else {
      // resultado: o bloco do reino, na cor do reino
      const k = s.r, rh = 50;
      bloco({ x: fx, y, w: fw, h: rh }, K(COR_R[k]), 'Reino ' + nomeFinal[k], null, 1, { fundo: .3 });
      y += rh + 10; wrapTx(s.nota, A.cx, y + 8, fw, { s: 14, w: 600, c: K('txt') });
    }
  }
  function responde(S, j) {
    const s = SERES[S.ser]; if (S.fim) return;
    if (j !== certo(s, S.passo)) { S.erro = j; return; }
    S.erro = null; S.resp[S.passo] = j;
    if (S.passo === 0 && !s.nuc) { S.passo = 1; S.fim = true; return; }
    S.passo++; if (S.passo >= 3) S.fim = true;
  }
  // quebra o texto em linhas (sem desenhar)
  function wrapLinhas(s, maxw, sz, w = 400) { const out = []; let cur = ''; for (const p of s.split(' ')) { const t = cur ? cur + ' ' + p : p; if (cur && tw(t, sz, w) > maxw) { out.push(cur); cur = p; } else cur = t; } if (cur) out.push(cur); return out; }

  function desenhaLinha(A, S, sd) {
    const s0 = Math.floor(sd), s1 = Math.min(4, s0 + 1), f = ss(sd - s0), sR = Math.round(sd);
    // linha do tempo embaixo
    const ty = A.y1 - 14, tx0 = A.x0 + (NAR ? 22 : 60), tx1 = A.x1 - (NAR ? 22 : 60);
    line(tx0, ty, tx1, ty, K('line'), 2);
    ETAPA.forEach((e, i) => { const x = lerp(tx0, tx1, i / 4); circ(x, ty, 4, i <= sR ? K('txt') : K('line')); tx(e.ano, x, ty + 16, { s: 12, f: FD, w: 500, c: i === sR ? '#fff' : K('dim'), bg: false }); });
    marca(lerp(tx0, tx1, sd / 4), ty, AMB());
    head(ETAPA[sR].q, A.cx, ty - 26, '#fff');
    // posição horizontal de cada reino numa etapa (o que ainda não existe sai de dentro do "pai")
    const bw = NAR ? Math.min(118, A.w * .33) : Math.min(190, A.w / 5 - 18), bh = NAR ? 64 : 92;
    const ux0 = A.x0 + bw / 2, ux1 = A.x1 - bw / 2;
    const posX = (k, s) => { const v = VIS[s], i = v.indexOf(k); if (i >= 0) return v.length < 2 ? A.cx : v.length * bw + (v.length - 1) * 12 <= A.w ? A.cx + (i - (v.length - 1) / 2) * Math.min(bw + 40, (ux1 - ux0) / (v.length - 1)) : lerp(ux0, ux1, i / (v.length - 1)); if (k === 'pro') return (posX('veg', s) + posX('ani', s)) / 2; return posX(PAI[k], s); };
    const tri = s => VIS[s].length * bw + (VIS[s].length - 1) * 12 > A.w;  // não cabe numa fileira: escalona em duas
    const yTop = A.y0 + 6;
    const posY = (k, s) => { const v = VIS[s], i = Math.max(0, v.indexOf(k)); return yTop + (tri(s) && i % 2 ? bh + 10 : 0); };
    const P = {};
    for (const k of RE) {
      const a0 = VIS[s0].includes(k) ? 1 : 0, a1 = VIS[s1].includes(k) ? 1 : 0;
      P[k] = { x: lerp(posX(k, s0), posX(k, s1), f), y: lerp(posY(k, s0), posY(k, s1), f), a: lerp(a0, a1, f) };
    }
    // árvore: raiz embaixo; a partir de 1956, os eucariontes saem de um ramo próprio
    const R = { x: A.cx, y: ty - 58 }, botY = yTop + bh * 2 + 10, e = ss(cl(sd - 1, 0, 1));
    const eukX = (P.pro.x + P.ani.x) / 2, N1 = { x: lerp(R.x, eukX, e), y: lerp(R.y, lerp(R.y, botY, .45), e) };
    for (const k of RE) {
      const p = P[k]; if (p.a <= .02) continue;
      const base = k === 'mon' ? R : N1, by = p.y + bh;
      X.save(); X.globalAlpha *= p.a; X.beginPath(); X.moveTo(base.x, base.y); X.quadraticCurveTo(p.x, base.y, p.x, by);
      X.strokeStyle = rgba(K(COR_R[k]), .8); X.lineWidth = 3; X.stroke(); X.restore();
    }
    circ(R.x, R.y, 5, K('txt'));
    if (e > .05) {
      X.save(); X.globalAlpha *= e; line(R.x, R.y, N1.x, N1.y, rgba(K('txt'), .7), 3); circ(N1.x, N1.y, 5, K('txt')); X.restore();
      if (e > .9) { const mp = qpt(R.x, R.y, P.mon.x, R.y, P.mon.x, P.mon.y + bh, .35); lab(N1.x, N1.y, N1.x + (NAR ? 30 : 70), N1.y + 22, NAR ? 'eucarionte' : 'célula eucarionte'); lab(mp[0], mp[1], mp[0] + (NAR ? 14 : 40), mp[1] - (NAR ? 40 : 10), NAR ? 'procarionte' : 'célula procarionte'); }
    }
    // blocos dos reinos
    for (const k of RE) {
      const p = P[k]; if (p.a <= .02) continue;
      const nm = f < .5 ? nomeR(k, s0) : nomeR(k, s1);
      bloco({ x: p.x - bw / 2, y: p.y, w: bw, h: bh }, K(COR_R[k]), nm, null, p.a, { ny: NAR ? 16 : 20 });
    }
    // ícones dos exemplos, que mudam de reino conforme a história
    const slot = (k, s) => { const h = ICS.filter(c => c[1][s] === k); return h; };
    for (const [ic, mor] of ICS) {
      const m0 = mor[s0], m1 = mor[s1];
      const pt = (m, s) => {
        if (!m) return null; const lst = slot(m, s).map(c => c[0]), i = lst.indexOf(ic), n = lst.length, sp = Math.min(NAR ? 26 : 40, (bw - 16) / Math.max(1, n));
        return { x: posX(m, s) + (i - (n - 1) / 2) * sp, y: posY(m, s) + bh * (NAR ? .68 : .66) };
      };
      const p0 = pt(m0, s0), p1 = pt(m1, s1); if (!p0 && !p1) continue;
      const A0 = p0 ? 1 : 0, A1 = p1 ? 1 : 0, q0 = p0 || p1, q1 = p1 || p0;
      icone(ic, lerp(q0.x, q1.x, f), lerp(q0.y, q1.y, f), NAR ? 10 : 15, lerp(A0, A1, f));
    }
  }

  def('sistemas', 'reinos', {
    t: 'De dois a cinco reinos', s: 'o sistema de Whittaker', c: K('proto'), loc: 'Linha do tempo dos sistemas de classificação', still: 2, stillV: 4,
    ctl: ctlS1,
    alt: 'Árvore de reinos que cresce com a linha do tempo: em 1735, dois reinos, animais e vegetais; em 1866 surge Protista; em 1956 surge Monera, na base; em 1969 Fungi se separa de Plantae; em 1982 as algas passam para Protoctista. Cada reino mostra ícones de exemplos. O botão Em que reino abre um jogo de perguntas com os três critérios de Whittaker',
    extra: [
      { t: 'Em que reino?', on: S => { S.quiz = !S.quiz; mostraFaixa(!S.quiz); }, pressed: S => !!S.quiz }
    ],
    d: `<p>Lineu dividia os seres vivos em <b>dois reinos</b>: animais e vegetais. O microscópio complicou a história: onde pôr seres de uma célula só, alguns que nadam e fazem fotossíntese ao mesmo tempo? O alemão <b>Ernst Haeckel</b> (1866) criou um terceiro reino, <b>Protista</b>, para os seres microscópicos. Depois, ficou clara a grande diferença entre a célula <b>procarionte</b> (sem núcleo organizado) e a <b>eucarionte</b> (com núcleo envolvido por membrana), confirmada nos anos 1950 e 1960 pelo microscópio eletrônico. <b>Herbert Copeland</b> (1956) separou as bactérias num quarto reino, <b>Monera</b>.</p>
<p>Em <b>1969</b>, o norte-americano <b>Robert Whittaker</b> propôs o <b>sistema de cinco reinos</b>, que ainda organiza a maior parte dos livros do ensino médio. Ele usou três critérios: o tipo de <b>célula</b> (procarionte ou eucarionte), o <b>número de células</b> (uni ou pluricelular) e o <b>modo de nutrição</b> (fotossíntese, absorção ou ingestão). Os reinos são: <b>Monera</b> (procariontes: bactérias e cianobactérias); <b>Protoctista</b> ou <b>Protista</b> (eucariontes simples: protozoários e algas); <b>Fungi</b> (fungos, que absorvem o alimento e têm parede de quitina); <b>Plantae</b> (plantas, pluricelulares, que fazem fotossíntese); e <b>Animalia</b> (animais, pluricelulares, que ingerem o alimento). No original de Whittaker, as algas pluricelulares ficavam em Plantae. Lynn <b>Margulis</b> e Karlene Schwartz (1982) reorganizaram o reino dos eucariontes simples com o nome <b>Protoctista</b> e levaram para ele todas as algas; Plantae ficou só com os seres que se desenvolvem a partir de um <b>embrião</b>. É essa versão que os livros do ensino médio usam. Os <b>vírus</b> não entram em nenhum reino: não têm célula.</p>
<p>Quadro dos cinco reinos, na versão dos livros do ensino médio, com o Protoctista de Margulis (Amabis; Lopes):</p>
<div class="tab"><table><thead><tr><th>Reino</th><th>Célula</th><th>Nº de células</th><th>Nutrição</th><th>Exemplos</th></tr></thead><tbody>
<tr><td>Monera</td><td>procarionte</td><td>unicelular</td><td>autótrofa ou heterótrofa</td><td>bactérias, cianobactérias</td></tr>
<tr><td>Protoctista (Protista)</td><td>eucarionte</td><td>uni ou pluricelular simples</td><td>autótrofa (algas) ou heterótrofa (protozoários)</td><td>ameba, <i>Plasmodium</i>, algas</td></tr>
<tr><td>Fungi</td><td>eucarionte</td><td>uni ou pluricelular</td><td>heterótrofa por absorção</td><td>cogumelos, bolores, leveduras</td></tr>
<tr><td>Plantae</td><td>eucarionte</td><td>pluricelular, com embrião</td><td>autótrofa (fotossíntese)</td><td>musgos, samambaias, pinheiros, plantas com flores</td></tr>
<tr><td>Animalia</td><td>eucarionte</td><td>pluricelular</td><td>heterótrofa por ingestão</td><td>esponjas, insetos, peixes, mamíferos</td></tr>
</tbody></table></div>
<p>Mova a linha do tempo para ver a árvore de reinos crescer. Depois toque em <b>Em que reino?</b>, escolha um ser e responda às perguntas de Whittaker até chegar ao reino. A levedura mostra que fungo pode ser unicelular; a esponja, que animal pode não ter tecidos verdadeiros e mesmo assim ingerir o alimento.</p>`,
    enem: 'Saiba os <b>critérios</b> de Whittaker: <b>célula</b> (procarionte só em Monera), <b>número de células</b> e <b>nutrição</b> (autótrofa, absorção, ingestão). Pegadinhas: <b>fungo não é planta</b> (não faz fotossíntese, tem quitina na parede e guarda glicogênio, como os animais); <b>cianobactéria</b> faz fotossíntese, mas é Monera; e <b>vírus</b> não está em nenhum reino.',
    links: [['Os três domínios', '#sistemas/dominios'], LK.virus, ['Procarionte e eucarionte', '../morfofisiologia/index.html#tipos/lado']],
    init(S) { if (S.resp == null) { S.resp = []; S.passo = 0; } },
    tap(x, y, S) {
      if (!S.quiz) return;
      const id = hitAt(x, y), h = id != null && (S.hit || [])[id]; if (h) h.f();
    },
    draw(t, S) {
      const A = area();
      if (S.quiz) { cap(S.fim ? '' : 'Escolha um ser e responda às perguntas de Whittaker.'); desenhaQuiz(A, S); S.hit.forEach((h, i) => hitR(h.r.x, h.r.y, h.r.w, h.r.h, i)); return; }
      // a linha do tempo anda sozinha uma vez ao abrir (uma etapa a cada 3 s); se o aluno mexer, ele manda
      if (S.vSet === undefined) { S.vSet = S.v; S.toq = false; }
      if (S.v !== S.vSet) S.toq = true;
      if (!S.toq && !S.paused && t < 16) { const v = cl(Math.floor(t / 3), 0, 4); if (v !== S.v) poeV(S, v, ctlS1); }
      if (S.vd == null || S.paused) S.vd = S.v;
      S.vd += (S.v - S.vd) * Math.min(1, (S.dt || 0) * 3.2); if (Math.abs(S.v - S.vd) < .002) S.vd = S.v;
      const sd = cl(S.vd, 0, 4);
      cap(ETAPA[Math.round(sd)].cap);
      desenhaLinha(A, S, sd);
    }
  });

  // =====================================================================================
  // S2 OS TRÊS DOMÍNIOS
  // =====================================================================================
  const DOM = [
    { id: 'b', n: 'Bacteria', c: 'bact', ex: 'bactérias', ex2: 'cianobactérias' },
    { id: 'a', n: 'Archaea', c: 'arch', ex: 'arqueas', ex2: 'toque para ver onde vivem' },
    { id: 'e', n: 'Eukarya', c: 'euk' }
  ];
  const CRIT = { mon: ['procarionte', 'unicelular', 'autótrofa ou heterótrofa'], pro: ['eucarionte', 'uni ou pluricelular simples', 'autótrofa ou heterótrofa'],
    fun: ['eucarionte', 'uni ou pluricelular', 'absorção'], veg: ['eucarionte', 'pluricelular, com embrião', 'fotossíntese'], ani: ['eucarionte', 'pluricelular', 'ingestão'] };
  const CRITD = [['procarionte', 'peptidoglicano na parede', 'RNA polimerase simples'], ['procarionte', 'sem peptidoglicano', 'RNA polimerase complexa'], ['eucarionte', 'núcleo e organelas com membrana', 'três RNA polimerases complexas']];
  const EXR = { mon: 'bactérias', pro: 'protozoários e algas', fun: 'fungos', veg: 'plantas', ani: 'animais' };
  const NOMR = { mon: 'Monera', pro: 'Protoctista', fun: 'Fungi', veg: 'Plantae', ani: 'Animalia' };
  // trecho de RNA ribossômico: sequências fictícias e didáticas (rodapé na tela)
  const SEQ = ['AUGUUAGCCUAGGACC', 'ACGAUAGUCUGGCAUC', 'AGGAUAGUCAGGCAUU'];
  const PARES = [[0, 1], [1, 2], [0, 2]];
  const ctlS2 = { l: 'Sistema', min: 0, max: 2, step: .05, v: 0, f: v => v < .5 ? '5 reinos' : v < 1.5 ? '3 domínios' : 'árvore do RNA', rate: () => 1 };

  // posições dos blocos: com a = 0 (cinco reinos) e com a = 1 (três domínios)
  function layoutS2(A) {
    const L = {};
    if (!NAR) {
      const T0 = Math.min(120, A.h * .3), G = 24, g = 14, fy = A.y0 + 8, fh = T0 + 44, iy = fy + 34;
      const L1 = (A.w - 2 * G) * .2, LE = A.w - 2 * G - 2 * L1, gw = (A.w - 4 * g) / 5;
      L.k5 = RE.map((k, i) => ({ x: A.x0 + i * (gw + g), y: iy, w: gw, h: T0 }));
      L.fr = [{ x: A.x0, y: fy, w: L1, h: fh }, { x: A.x0 + L1 + G, y: fy, w: L1, h: fh }, { x: A.x0 + 2 * (L1 + G), y: fy, w: LE, h: fh }];
      L.ib = { x: L.fr[0].x + 8, y: iy, w: L1 - 16, h: T0 }; L.ia = { x: L.fr[1].x + 8, y: iy, w: L1 - 16, h: T0 };
      const ew = (LE - 16 - 3 * 8) / 4; L.e4 = [0, 1, 2, 3].map(i => ({ x: L.fr[2].x + 8 + i * (ew + 8), y: iy, w: ew, h: T0 }));
      L.fim = fy + fh;
    } else {
      const M = A.h - 4, G = 12, cw = A.w, x0 = A.x0;
      const rh = Math.max(40, Math.min(56, (M - 3 * 28 - 6 * 3 - 2 * 6 - 2 * G - 8) / 6));
      const hb = 28 + rh + 6, he = 28 + 4 * rh + 3 * 6 + 6;
      const y0 = A.y0 + Math.max(0, (M - (2 * hb + he + 2 * G)) / 2);
      L.fr = [{ x: x0, y: y0, w: cw, h: hb }, { x: x0, y: y0 + hb + G, w: cw, h: hb }, { x: x0, y: y0 + 2 * (hb + G), w: cw, h: he }];
      L.ib = { x: x0 + 8, y: L.fr[0].y + 28, w: cw - 16, h: rh }; L.ia = { x: x0 + 8, y: L.fr[1].y + 28, w: cw - 16, h: rh };
      L.e4 = [0, 1, 2, 3].map(i => ({ x: x0 + 8, y: L.fr[2].y + 28 + i * (rh + 6), w: cw - 16, h: rh }));
      const tot = 5 * rh + 4 * 10, ky = A.y0 + (M - tot) / 2;
      L.k5 = RE.map((k, i) => ({ x: x0 + 8, y: ky + i * (rh + 10), w: cw - 16, h: rh }));
      L.fim = L.fr[2].y + he;
    }
    // pontas da árvore (fase c)
    const tw3 = (A.w - 2 * 10) / 3; L.tip = [0, 1, 2].map(i => ({ x: A.x0 + i * (tw3 + 10), y: A.y0 + 4, w: tw3, h: 40 }));
    if (!NAR) L.tip.forEach(r => { r.y += 10; });
    return L;
  }

  function painelArqueas(A, S) {
    const pw = Math.min(A.w, 600), cols = NAR ? 2 : 4, cellH = NAR ? 84 : 92, ph = 56 + Math.ceil(4 / cols) * cellH;
    const x = A.cx - pw / 2, y = A.y1 - ph - 4;
    rr(x, y, pw, ph, 12, '#0E1424', K('arch'), 2);
    tx('Onde vivem muitas arqueas', A.cx, y + 20, { s: 15, w: 700, f: FH, c: '#fff', bg: false });
    const AMB_ = [['termal', 'fonte termal muito quente'], ['salina', 'salina, água muito salgada'], ['pantano', 'pântano sem oxigênio'], ['vaca', 'intestino do gado (metano)']];
    const cw = pw / cols;
    AMB_.forEach(([k, s], i) => {
      const cx = x + cw * (i % cols + .5), cy = y + 56 + Math.floor(i / cols) * cellH + 26;
      ambiente(k, cx, cy, 20);
      wrapTx(s, cx, cy + 34, cw - 12, { s: 12, w: 600, c: '#D3DAEA' });
    });
    tx('toque no quadro para fechar', A.cx, y + 38, { s: 12, c: K('dim'), bg: false });
    S.hitPainel = { x, y, w: pw, h: ph };
  }
  function ambiente(k, x, y, r) {
    X.save(); X.lineCap = 'round'; X.lineJoin = 'round';
    if (k === 'termal') {        // poça com vapor
      ell(x, y + r * .55, r, r * .35, 0, '#4A9FC4', 'rgba(232,237,247,.5)', 1);
      for (const u of [-.45, 0, .45]) { X.beginPath(); for (let i = 0; i <= 8; i++) X.lineTo(x + u * r + Math.sin(i * .9) * r * .12, y + r * .3 - i * r * .14); X.strokeStyle = 'rgba(232,237,247,.8)'; X.lineWidth = 1.6; X.stroke(); }
    } else if (k === 'salina') { // montes de sal à beira da água
      rr(x - r, y + r * .45, r * 2, r * .4, 3, '#3F7FA6');
      for (const [u, s] of [[-.45, .7], [.25, .95], [.75, .55]]) { X.beginPath(); X.moveTo(x + (u - s * .5) * r, y + r * .5); X.lineTo(x + u * r, y + r * (.5 - s)); X.lineTo(x + (u + s * .5) * r, y + r * .5); X.closePath(); X.fillStyle = '#F2F2EE'; X.fill(); X.strokeStyle = 'rgba(11,15,28,.4)'; X.lineWidth = 1; X.stroke(); }
    } else if (k === 'pantano') { // água parada, juncos e bolhas
      rr(x - r, y + r * .35, r * 2, r * .5, 3, '#3E6B4E');
      for (const u of [-.7, -.4, .55, .8]) line(x + u * r, y + r * .4, x + u * r + r * .08, y - r * .7, '#8DB86A', 2);
      for (const [u, v] of [[-.05, .1], [.15, -.2], [0, -.5]]) circ(x + u * r, y + v * r, r * .1, null, 'rgba(232,237,247,.85)', 1.3);
    } else if (k === 'vaca') {   // alça de intestino com bolhas de metano
      X.beginPath(); for (let i = 0; i <= 30; i++) { const f = i / 30; X.lineTo(x - r + f * 2 * r, y + r * .25 + Math.sin(f * TAU * 1.5) * r * .35); }
      X.strokeStyle = '#E7A6B4'; X.lineWidth = r * .32; X.stroke();
      for (const [u, v] of [[-.5, -.45], [.1, -.6], [.6, -.4]]) circ(x + u * r, y + v * r, r * .13, null, 'rgba(232,237,247,.85)', 1.3);
      tx('CH₄', x, y - r * .95, { s: 12, f: FD, w: 500, c: '#fff', bg: false });
    }
    X.restore();
  }

  function desenhaArvore(A, S, L, t, b) {
    if (b <= .02) return; X.save(); X.globalAlpha *= b;
    const tip = L.tip, tb = tip[0].y + tip[0].h, x1 = tip[0].x + tip[0].w / 2, x2 = tip[1].x + tip[1].w / 2, x3 = tip[2].x + tip[2].w / 2;
    const treeH = A.h * (NAR ? .4 : .36), yL = tb + treeH;
    const nAE = { x: (x2 + x3) / 2, y: lerp(tb, yL, .45) }, luca = { x: (x1 + nAE.x) / 2, y: yL };
    const par = PARES[Math.floor(t / 3.2) % 3];
    const usa = { e1: par.includes(0), e2: par.includes(0), e3: par.includes(1), e4: par.includes(2) };
    const ramo = (p, q, c, k) => { const on = usa[k]; X.beginPath(); X.moveTo(p.x, p.y); X.lineTo(q.x, q.y); X.strokeStyle = on ? AMB() : rgba(c, .75); X.lineWidth = on ? 4 : 2.5; X.stroke(); };
    ramo(luca, { x: x1, y: tb }, K('bact'), 'e1'); ramo(luca, nAE, K('txt'), 'e2'); ramo(nAE, { x: x2, y: tb }, K('arch'), 'e3'); ramo(nAE, { x: x3, y: tb }, K('euk'), 'e4');
    circ(nAE.x, nAE.y, 4, K('txt')); circ(luca.x, luca.y, 7, '#fff', 'rgba(11,15,28,.6)', 1.5);
    tx('LUCA', luca.x, luca.y + 18, { s: 13, w: 700, c: '#fff' });
    tx(NAR ? 'último ancestral comum' : 'último ancestral comum universal', luca.x, luca.y + 35, { s: 12, c: K('dim') });
    // régua de RNA ribossômico
    const lw = NAR ? 70 : 92, cell = Math.min(30, (A.w - lw) / SEQ[0].length), rw = lw + cell * SEQ[0].length, rx = A.cx - rw / 2;
    let y = yL + 58; const rowH = NAR ? 24 : 26;
    tx('Trecho de RNA ribossômico', rx, y, { s: 13, w: 700, a: 'left', c: K('txt'), bg: false }); y += 18;
    const dif = [...SEQ[par[0]]].map((c, i) => c !== SEQ[par[1]][i]);
    SEQ.forEach((sq, r) => {
      const on = par.includes(r), yy = y + r * rowH; X.save(); if (!on) X.globalAlpha *= .4;
      tx(DOM[r].n, rx, yy + rowH / 2, { s: 12, w: 700, a: 'left', c: K(DOM[r].c), bg: false });
      [...sq].forEach((ch, i) => {
        const cx = rx + lw + i * cell; if (on && dif[i]) rr(cx + 1, yy + 2, cell - 2, rowH - 4, 4, rgba(AMB(), .85));
        tx(ch, cx + cell / 2, yy + rowH / 2 + .5, { s: 12, f: FD, w: 500, c: on && dif[i] ? '#0B0F1C' : '#D3DAEA', bg: false });
      });
      X.restore();
    });
    y += 3 * rowH + 14;
    const nd = dif.filter(Boolean).length;
    tx(`${DOM[par[0]].n} e ${DOM[par[1]].n}: ${nd} diferenças em ${SEQ[0].length} posições`, A.cx, y, { s: 13, w: 700, c: AMB(), bg: false });
    tx('sequências fictícias e didáticas', A.cx, y + 18, { s: 12, c: K('dim'), bg: false });
    X.restore();
    return par;
  }

  def('sistemas', 'dominios', {
    t: 'Os três domínios', s: 'Woese, o RNA e as arqueas', c: K('arch'), loc: 'Do sistema de cinco reinos à árvore universal', still: 7, stillV: 1,
    ctl: ctlS2,
    alt: 'Os cinco reinos de Whittaker em blocos coloridos se reencaixam nos três domínios: Monera se parte em Bacteria, em azul, e Archaea, em laranja; Protoctista, Fungi, Plantae e Animalia entram juntos no domínio Eukarya, em verde. Tocar em Archaea mostra os ambientes extremos. Na árvore do RNA, os três domínios saem de um ancestral comum, LUCA, e uma régua de RNA ribossômico fictícia acende as diferenças entre dois domínios',
    extra: [
      { t: '5 reinos', on: S => { S.alvo = 0; S.toq = true; S.arq = false; }, pressed: S => S.v < .5 },
      { t: '3 domínios', on: S => { S.alvo = 1; S.toq = true; S.arq = false; }, pressed: S => S.v >= .5 && S.v < 1.5 },
      { t: 'Árvore do RNA', on: S => { S.alvo = 2; S.toq = true; S.arq = false; }, pressed: S => S.v >= 1.5 }
    ],
    d: `<p>Nos anos 1970, o microbiologista norte-americano <b>Carl Woese</b> passou a comparar seres vivos por uma molécula que todos têm: o <b>RNA ribossômico</b> (o RNA da subunidade menor do ribossomo, 16S nos procariontes). Quanto mais parecidas as sequências, mais próximo o parentesco. Em <b>1977</b>, com George Fox, ele descobriu que alguns "procariontes", muitos vivendo em ambientes extremos (fontes termais, água muito salgada, pântanos sem oxigênio), eram tão diferentes das bactérias quanto das plantas e animais. Em <b>1990</b>, Woese, Kandler e Wheelis propuseram uma categoria acima do reino, o <b>domínio</b>, e dividiram a vida em três: <b>Bacteria</b>, <b>Archaea</b> e <b>Eukarya</b>.</p>
<p>O antigo reino Monera ficou dividido em dois domínios. As <b>arqueas</b> parecem bactérias por fora (são procariontes, sem núcleo), mas por dentro têm muito em comum com os eucariontes: algumas têm proteínas parecidas com as <b>histonas</b> que enrolam o DNA, e a enzima que copia os genes em RNA (a RNA polimerase) é complexa, com muitas subunidades, como a nossa. Elas não têm <b>peptidoglicano</b> na parede, e os lipídios da membrana são de outro tipo. Muitas são <b>extremófilas</b>, e algumas vivem no nosso intestino e no do gado, onde produzem <b>metano</b>. Os outros quatro reinos de Whittaker (Protoctista, Fungi, Plantae e Animalia) cabem todos no domínio <b>Eukarya</b>. Pesquisas recentes com DNA sugerem até que os eucariontes surgiram de dentro do grupo das arqueas; é um debate ainda em aberto.</p>
<p>Comparação dos três domínios (Woese e colaboradores, 1990; Raven, cap. 12; Campbell, cap. 26):</p>
<div class="tab"><table><thead><tr><th>Característica</th><th>Bacteria</th><th>Archaea</th><th>Eukarya</th></tr></thead><tbody>
<tr><td>Núcleo com membrana</td><td>não</td><td>não</td><td>sim</td></tr>
<tr><td>Organelas com membrana</td><td>não</td><td>não</td><td>sim</td></tr>
<tr><td>Peptidoglicano na parede</td><td>sim (na maioria)</td><td>não</td><td>não</td></tr>
<tr><td>Histonas no DNA</td><td>não</td><td>algumas</td><td>sim</td></tr>
<tr><td>RNA polimerase</td><td>um tipo, simples</td><td>um tipo, complexa (parecida com a dos eucariontes)</td><td>três tipos, complexas</td></tr>
<tr><td>Exemplos</td><td><i>E. coli</i>, cianobactérias</td><td>metanogênicas, halófilas, termófilas</td><td>protoctistas, fungos, plantas, animais</td></tr>
</tbody></table></div>
<p>Use os botões para alternar entre os cinco reinos e os três domínios, e toque em Archaea para ver onde muitas arqueas vivem. Na árvore do RNA, a régua compara dois domínios de cada vez: quanto mais diferenças, mais longe ficam os ramos. As sequências da régua são fictícias e didáticas.</p>`,
    enem: 'Os três domínios são <b>Bacteria</b>, <b>Archaea</b> e <b>Eukarya</b>, e se baseiam em comparação <b>molecular</b> (RNA ribossômico), não só na aparência. A ideia cobrada: o reino <b>Monera foi dividido</b> em Bacteria e Archaea, e as <b>arqueas</b>, embora procariontes, são <b>mais próximas dos eucariontes</b> do que das bactérias. Domínio é a categoria <b>acima</b> do reino.',
    links: [['De dois a cinco reinos', '#sistemas/reinos'], ['Procarionte e eucarionte', '../morfofisiologia/index.html#tipos/lado'], LK.virus],
    tap(x, y, S) {
      const id = hitAt(x, y);
      if (id === 'painel') S.arq = false; else if (id === 'arq') S.arq = !S.arq;
    },
    draw(t, S) {
      const A = area(), L = layoutS2(A);
      // a faixa toca sozinha uma vez (cinco reinos, pausa, três domínios); botões levam a faixa até o alvo
      if (S.vSet === undefined) { S.vSet = S.v; }
      if (S.v !== S.vSet) { S.toq = true; S.alvo = null; S.vSet = S.v; }
      if (!S.toq && !S.paused && t > 1.6 && t < 6) poeV(S, cl(Math.round(ss((t - 1.6) / 3.4) / .05) * .05, 0, 1), ctlS2);
      if (S.alvo != null) {
        const d = S.alvo - S.v, st = S.paused ? Math.abs(d) : (S.dt || 0) * .9;
        poeV(S, Math.abs(d) <= st ? S.alvo : Math.round((S.v + Math.sign(d) * st) * 1000) / 1000, ctlS2);
        if (S.v === S.alvo) S.alvo = null;
      }
      const pr = S.v < .5 ? 0 : S.v < 1.5 ? 1 : 2; if (pr !== S.prLast) { S.prLast = pr; [0, 1, 2].forEach(i => pressBtn(i, i === pr)); }
      const a = ss(cl(S.v, 0, 1)), b = ss(cl(S.v - 1, 0, 1));
      S.hitArq = null;
      // molduras dos domínios (aparecem com a, viram as pontas da árvore com b)
      DOM.forEach((dm, i) => {
        const r = lerpR(L.fr[i], L.tip[i], b), c = K(dm.c);
        if (a <= .02) return; X.save(); X.globalAlpha *= a;
        rr(r.x, r.y, r.w, r.h, 12, rgba(c, .1 + .12 * b), c, 2);
        const nm = b > .5 ? dm.n : 'Domínio ' + dm.n;
        tx(nm, r.x + r.w / 2, r.y + (b > .5 ? r.h / 2 : 15), { s: 14, w: 700, f: FH, c, bg: false });
        X.restore();
        if (i === 1) S.hitArq = r;
      });
      // critérios de Woese embaixo de cada domínio (só no computador, onde sobra espaço)
      if (!NAR && !S.arq && a > .5 && b < .5) {
        X.save(); X.globalAlpha *= seg(a, .5, 1) * (1 - 2 * b);
        CRITD.forEach((ls, i) => { const r = L.fr[i]; ls.forEach((l, j) => tx(l, r.x + r.w / 2, r.y + r.h + 24 + j * 20, { s: 13, c: j ? K('dim') : '#D3DAEA', bg: false })); });
        X.restore();
      }
      // os quatro reinos eucariontes: deslizam para dentro de Eukarya e somem na árvore
      ['pro', 'fun', 'veg', 'ani'].forEach((k, i) => {
        const r0 = L.k5[i + 1], r1 = L.e4[i], r = lerpR(lerpR(r0, r1, a), L.tip[2], b);
        bloco(r, K(COR_R[k]), NOMR[k], EXR[k], 1 - b);
      });
      // Monera: um bloco que se parte em dois (Bacteria azul, Archaea laranja)
      const m = L.k5[0], half = [{ x: m.x, y: m.y, w: m.w / 2 + 1, h: m.h }, { x: m.x + m.w / 2, y: m.y, w: m.w / 2, h: m.h }];
      const alvoM = [L.ib, L.ia];
      [0, 1].forEach(i => {
        const r = lerpR(lerpR(half[i], alvoM[i], a), L.tip[i], b), c = mix(K('monera'), K(i ? 'arch' : 'bact'), a);
        if (1 - b <= .02) return; X.save(); X.globalAlpha *= 1 - b;
        rr(r.x, r.y, r.w, r.h, 10 * a, mix('#1B2238', c, .3), a > .05 ? c : null, 1.6);
        if (a > .55) {
          const dm = DOM[i], sz = NAR ? 13 : 14, so = r.h >= 48 && tw(dm.ex2, 12) < r.w - 8;
          X.globalAlpha *= seg(a, .55, .9);
          if (tw(dm.ex, sz, 700) < r.w - 6) tx(dm.ex, r.x + r.w / 2, r.y + r.h / 2 - (so ? 9 : 0), { s: sz, w: 700, c: '#fff', bg: false });
          if (so) tx(dm.ex2, r.x + r.w / 2, r.y + r.h / 2 + 10, { s: 12, c: i ? '#FFE0C2' : '#D3DAEA', bg: false });
        }
        X.restore();
      });
      if (a < .5) {   // nome único do reino Monera, enquanto ainda é um bloco só
        X.save(); X.globalAlpha *= 1 - a * 2; rr(m.x, m.y, m.w, m.h, 10, null, K('monera'), 1.6);
        // critérios de Whittaker embaixo de cada reino (só no computador, onde sobra espaço)
        if (!NAR) RE.forEach((k, i) => { const r = L.k5[i]; CRIT[k].forEach((l, j) => tx(l, r.x + r.w / 2, r.y + r.h + 22 + j * 20, { s: 13, c: j ? K('dim') : '#D3DAEA', bg: false })); }); tx('Monera', m.x + m.w / 2, m.y + m.h / 2 - 9, { s: NAR ? 13 : 14, w: 700, c: '#fff', bg: false }); tx('bactérias', m.x + m.w / 2, m.y + m.h / 2 + 10, { s: 12, c: '#D3DAEA', bg: false }); X.restore();
        if (a < .02 && !NAR) tx('Sistema de cinco reinos (Whittaker, 1969)', A.cx, L.k5[0].y - 18, { s: 14, w: 700, f: FH, c: K('txt'), bg: false });
      }
      const par = desenhaArvore(A, S, L, t, b);
      if (S.v >= .7 && S.hitArq) hitR(S.hitArq.x, S.hitArq.y, S.hitArq.w, S.hitArq.h, 'arq');
      if (S.arq && S.v >= .7) { painelArqueas(A, S); hitR(S.hitPainel.x, S.hitPainel.y, S.hitPainel.w, S.hitPainel.h, 'painel'); } else S.hitPainel = null;
      if (b > .5) cap(par ? `Três domínios saindo de um ancestral comum. Archaea e Eukarya ficam mais perto: menos diferenças no RNA ribossômico.` : '');
      else if (a > .5) cap('<b>Monera</b> se partiu em <b>Bacteria</b> e <b>Archaea</b>; os outros quatro reinos cabem todos em <b>Eukarya</b>.');
      else cap('Os <b>cinco reinos</b> de Whittaker. Toque em <b>3 domínios</b> para ver como eles se reencaixam.');
    }
  });
}
